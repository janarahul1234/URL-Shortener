import { redirect } from "next/navigation";
import { Banner } from "@/components/terminal/banner";
import { CmdButton } from "@/components/terminal/cmd-button";
import { CopyButton } from "@/components/terminal/copy-button";
import { Panel } from "@/components/terminal/panel";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { buildShortUrl } from "@/lib/url";
import type { UrlRow } from "@/lib/types";
import { CreateForm } from "./create-form";
import { DeleteButton } from "./delete-button";

export const metadata = { title: "CONTROL PANEL — SHORTCIRCUIT" };

/** UTC timestamp rendered like a log line: 1994-06-15 03:21 */
function fmt(iso: string | null | undefined): string {
  if (!iso) return "-- -- --";
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
}

/** Click-count bar: green filled blocks + gray remainder, shrinkable on narrow screens. */
function Bar({ count, max, width = 24 }: { count: number; max: number; width?: number }) {
  const filled = max <= 0 || count <= 0 ? 0 : Math.max(1, Math.round((count / max) * width));
  return (
    <span aria-hidden="true" className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
      <span className="text-ok">{"█".repeat(filled)}</span>
      <span className="text-ink-dim">{"░".repeat(width - filled)}</span>
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Independent queries run in parallel after auth resolves.
  const [urlsRes, summaryRes] = await Promise.all([
    supabase
      .from("urls")
      .select("id, user_id, slug, destination, total_clicks, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.rpc("click_summary"),
  ]);

  const urls: UrlRow[] = (urlsRes.data ?? []) as UrlRow[];
  const lastClick = new Map<string, string>(
    ((summaryRes.data ?? []) as { url_id: string; last_click: string }[]).map(
      (r) => [r.url_id, r.last_click],
    ),
  );

  const rows = await Promise.all(
    urls.map(async (u) => ({ ...u, shortUrl: await buildShortUrl(u.slug) })),
  );

  const totalClicks = urls.reduce((sum, u) => sum + u.total_clicks, 0);
  const maxClicks = rows.reduce((m, u) => Math.max(m, u.total_clicks), 0);
  const topRoutes = [...rows]
    .filter((u) => u.total_clicks > 0)
    .sort((a, b) => b.total_clicks - a.total_clicks)
    .slice(0, 5);
  const busiestLastClick = rows
    .map((u) => lastClick.get(u.id))
    .filter((t): t is string => Boolean(t))
    .sort();

  return (
    <main>
      <Banner />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-window px-4 py-2 text-xs">
        <span className="text-ink-muted">
          SESSION: <span className="text-ink">{user.email}</span>
        </span>
        <form action={signOut}>
          <CmdButton variant="danger" type="submit">
            LOGOUT
          </CmdButton>
        </form>
      </div>

      <CreateForm />

      <Panel title="click telemetry">
        {urlsRes.error ? (
          <p role="alert" className="text-sm text-bad">
            !! TELEMETRY READ FAILED — {urlsRes.error.message}
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            <p>
              LINKS=<span className="text-ok">{urls.length}</span>{" "}
              TOTAL_CLICKS=<span className="text-ok">{totalClicks}</span>{" "}
              LAST_ACTIVITY=
              <span className="text-ok">
                {fmt(busiestLastClick[busiestLastClick.length - 1])}
              </span>
            </p>
            {topRoutes.length > 0 ? (
              <div>
                <p className="text-xs text-ink-dim"># BUSIEST ROUTES</p>
                {topRoutes.map((u) => (
                  <p key={u.id} className="flex items-baseline gap-2">
                    <span className="w-24 shrink-0 truncate text-ok sm:w-32">
                      /{u.slug}
                    </span>
                    <Bar count={u.total_clicks} max={maxClicks} />
                    <span className="shrink-0 text-xs text-ink-muted">
                      {u.total_clicks}
                    </span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-dim">
                # NO CLICKS RECORDED YET — SHIP A LINK AND WAIT FOR TRAFFIC.
              </p>
            )}
          </div>
        )}
      </Panel>

      <Panel title="link router — manage routes">
        {rows.length === 0 ? (
          <p className="text-sm text-ink-dim">
            # ROUTER TABLE EMPTY — SHORTEN YOUR FIRST URL ABOVE.
          </p>
        ) : (
          <div>
            <div className="mb-1 flex items-baseline gap-x-3 border-b border-white/15 pb-1.5 text-xs text-ink-muted">
              <span className="w-32 shrink-0 sm:w-44">SHORT URL</span>
              <span className="w-14 shrink-0 sm:w-16">CLICKS</span>
              <span className="hidden min-w-0 flex-1 sm:block">ACTIVITY</span>
              <span className="ml-auto shrink-0">OPS</span>
            </div>
            <ul className="divide-y divide-white/10">
              {rows.map((u) => (
                <li key={u.id} className="py-3 first:pt-1 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <a
                      href={u.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-32 shrink-0 break-all font-bold text-ok underline decoration-white/20 hover:decoration-ok sm:w-44"
                    >
                      /{u.slug}
                    </a>
                    <span className="w-14 shrink-0 text-xs text-ink sm:w-16">
                      {u.total_clicks}
                    </span>
                    <span className="text-xs text-ink-dim">
                      last={fmt(lastClick.get(u.id))} · made={fmt(u.created_at)}
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-1.5">
                      <CopyButton text={u.shortUrl} />
                      <DeleteButton id={u.id} slug={u.slug} />
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-muted">
                    └─&gt; {u.destination}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {rows.length >= 100 ? (
          <p className="mt-3 text-xs text-ink-dim">
            # SHOWING 100 MOST RECENT ROUTES.
          </p>
        ) : null}
      </Panel>
    </main>
  );
}
