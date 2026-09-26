# SHORTCIRCUIT — URL Shortener Terminal

A SaaS URL shortener with a 90s CRT / DOS-terminal interface. Built with
**Next.js 16 (App Router) · Tailwind CSS v4 · Zod v4 · Supabase**.

```
C:\APPS\SHORTCIRCUIT.EXE
S H O R T C I R C U I T
> URL SHORTENER TERMINAL v1.0
```

## Features

- Shorten long URLs with auto-generated or **custom slugs**
- **Copy** short URLs to clipboard (`[ COPY ]` command)
- **Redirects**: `/<slug>` → destination (302) with click tracking
- **Manage links**: list, inspect, and delete (`[ DEL ]` → `[Y/N]` confirm)
- **Click telemetry**: total clicks, last activity, busiest-route bar chart
- **Auth**: Supabase email/password sign-on & registration, session refresh in
  the Next.js proxy
- **Validation**: every input parsed with Zod on the client *and* server
- Terminal aesthetic end-to-end: phosphor green / amber on true black,
  box-drawing panels, blinking caret, CRT scanlines

## Quick Start

### 1. Create a Supabase project

At <https://supabase.com/dashboard> → New Project (or use a local `supabase start`).

### 2. Apply the schema

Open the **SQL Editor** in the dashboard and run the entire contents of
[`supabase/schema.sql`](supabase/schema.sql). It is idempotent and creates:

| Object | Purpose |
| --- | --- |
| `public.urls` | links owned by auth users; unique slug + format/protocol CHECKs |
| `public.clicks` | raw redirect-hit log (FK → `urls`, cascade delete) |
| `bump_total_clicks` trigger | keeps `urls.total_clicks` denormalized for cheap lists |
| `click_summary()` RPC | per-link last-click, aggregated server-side, `SECURITY INVOKER` |
| RLS policies | owners can only read/write their own rows; `clicks` inserts are service-role only |

### 3. Configure environment

```powershell
Copy-Item .env.example .env.local
```

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser + server | publishable key (`sb_publishable_…`) |
| `SUPABASE_SECRET_KEY` | **server only** | secret / service-role key — used by the redirect handler |
| `APP_BASE_URL` | server | public origin for short URLs, e.g. `https://short.example.com` |

> ⚠️ `SUPABASE_SECRET_KEY` bypasses RLS — never prefix it with `NEXT_PUBLIC_`.

### 4. Enable Auth

Dashboard → Authentication → Providers → ensure **Email** is enabled.
(With "Confirm email" on, registration asks the user to confirm before sign-in;
the UI surfaces that state.)

### 5. Run

```powershell
npm install
npm run dev      # http://localhost:3000
```

Sign in, shorten a URL, open the short link — the click lands in
`public.clicks` and the dashboard telemetry updates.

## Architecture

```
src/
├── proxy.ts                     # Next 16 proxy (ex-middleware): session refresh
├── env.d.ts                     # typed process.env
├── app/
│   ├── layout.tsx               # terminal shell (DOS chrome, scanlines, footer)
│   ├── globals.css              # design tokens (@theme): phosphor/amber/CRT black
│   ├── page.tsx                 # / → dashboard or login (server-side)
│   ├── not-found.tsx / error.tsx / dashboard/loading.tsx
│   ├── login/                   # Banner + AuthPanel (useActionState)
│   ├── dashboard/
│   │   ├── page.tsx             # RSC: parallel fetch urls + click_summary
│   │   ├── create-form.tsx      # client: live Zod validation + server action
│   │   └── delete-button.tsx    # client: [DEL] → PURGE? [Y/N]
│   ├── [slug]/route.ts          # redirect handler: lookup, 302, after() click insert
│   └── actions/
│       ├── auth.ts              # authenticate / signOut (Zod-validated)
│       └── urls.ts              # createUrl / deleteUrl (auth-checked, revalidated)
├── components/terminal/         # reusable kit: Panel, Field, CmdButton, CopyButton, Banner
└── lib/
    ├── supabase/                # browser / server / admin(service-role) / proxy clients
    ├── validation.ts            # Zod schemas, slug generator, reserved-slug list
    ├── types.ts                 # UrlRow / ClickRow / ShortenedUrl
    └── url.ts                   # absolute short-URL builder
```

### Security model

- **RLS everywhere**: every policy uses `(select auth.uid()) = user_id` with
  `TO authenticated`; UPDATE has both `USING` and `WITH CHECK`.
- **Public redirect path** (`/[slug]`) uses the service-role key **server-side
  only**, selecting just `id, destination`; the click insert runs in `after()`
  so telemetry never blocks or breaks the redirect.
- **Writes go through server actions** which re-validate all input with Zod,
  check the session, and rely on RLS as the final enforcement layer.
- The browser client only ever receives the publishable key.

### Design system

True-black CRT screen (`#000`), phosphor green (`#33ff33`) for structure and
actions, amber (`#ffb000`) for data, IBM Plex Mono everywhere. Borders are
box-drawing characters (`┌┤ TITLE ├───┐`) that clip responsively; buttons are
reverse-video bracket commands (`[ SHORTEN ]`). Scanline overlay and blinking
caret are decorative and disabled under `prefers-reduced-motion`.

## Verification

```powershell
npm run build   # type-checks + compiles all routes
npm run lint    # eslint (flat config, next/core-web-vitals)
```

## Deploy notes

- Set `APP_BASE_URL` to your production origin so short links are absolute.
- On Vercel, add the three Supabase vars as environment variables; the secret
  key stays server-side automatically.
- For a custom short domain, point it at the app; `/[slug]` handles the rest.
