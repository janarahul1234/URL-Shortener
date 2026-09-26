-- ============================================================
-- SHORTCIRCUIT — URL shortener schema
-- Run once against your Supabase project (SQL Editor or `supabase db push`).
-- Idempotent: safe to re-run.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- urls: one row per shortened link, owned by an auth user
-- ------------------------------------------------------------
create table if not exists public.urls (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  slug          text not null,
  destination   text not null,
  total_clicks  bigint not null default 0,
  created_at    timestamptz not null default now(),
  constraint urls_slug_unique unique (slug),
  constraint urls_slug_format_ok check (
    slug ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,62}$'
  ),
  constraint urls_destination_protocol_ok check (
    destination ~* '^https?://'
  )
);

create index if not exists urls_user_id_created_idx
  on public.urls (user_id, created_at desc);

-- ------------------------------------------------------------
-- clicks: one row per redirect hit (raw click log)
-- ------------------------------------------------------------
create table if not exists public.clicks (
  id          bigint generated always as identity primary key,
  url_id      uuid not null references public.urls (id) on delete cascade,
  referrer    text,
  clicked_at  timestamptz not null default now()
);

-- latest-click lookup per url + rolling-window counts
create index if not exists clicks_url_clicked_idx
  on public.clicks (url_id, clicked_at desc);

-- keep urls.total_clicks in sync with the clicks table
create or replace function public.bump_total_clicks()
returns trigger
language plpgsql
as $$
begin
  update public.urls
     set total_clicks = total_clicks + 1
   where id = new.url_id;
  return new;
end;
$$;

drop trigger if exists clicks_bump_total on public.clicks;
create trigger clicks_bump_total
  after insert on public.clicks
  for each row execute function public.bump_total_clicks();

-- ------------------------------------------------------------
-- RLS: locked down. Owner can read/manage their own rows only.
-- Writes to clicks and slug lookups for redirects go through the
-- service-role key server-side (bypasses RLS), never the browser.
-- ------------------------------------------------------------
alter table public.urls enable row level security;
alter table public.clicks enable row level security;

drop policy if exists "owners read their own urls" on public.urls;
create policy "owners read their own urls" on public.urls
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owners insert their own urls" on public.urls;
create policy "owners insert their own urls" on public.urls
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "owners update their own urls" on public.urls;
create policy "owners update their own urls" on public.urls
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "owners delete their own urls" on public.urls;
create policy "owners delete their own urls" on public.urls
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owners read clicks on their urls" on public.clicks;
create policy "owners read clicks on their urls" on public.clicks
  for select
  to authenticated
  using (exists (
    select 1 from public.urls u
    where u.id = url_id
      and u.user_id = (select auth.uid())
  ));

-- ------------------------------------------------------------
-- click_summary(): per-link last-click timestamp for the current user,
-- aggregated once server-side instead of shipping the raw click log.
-- SECURITY INVOKER: RLS on clicks + urls still applies.
-- ------------------------------------------------------------
create or replace function public.click_summary()
returns table (url_id uuid, last_click timestamptz)
language sql
security invoker
stable
as $$
  select c.url_id, max(c.clicked_at)
    from public.clicks c
   where c.url_id in (select id from public.urls where user_id = (select auth.uid()))
   group by c.url_id;
$$;

revoke execute on function public.click_summary() from public, anon;
grant execute on function public.click_summary() to authenticated;
