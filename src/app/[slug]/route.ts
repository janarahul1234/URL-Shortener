import { after, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SLUG_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,62}$/;

/**
 * Short-link resolver: /<slug> -> destination (302).
 * Trusted lookup + click write run server-side with the service-role key;
 * the click insert is non-blocking via after().
 */
export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;

  if (!SLUG_RE.test(slug)) {
    return new Response("404 FATAL ERROR: NO SUCH ROUTE\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("urls")
    .select("id, destination")
    .eq("slug", slug)
    .maybeSingle<{ id: string; destination: string }>();

  if (!data) {
    return new Response(
      `404 FATAL ERROR: ROUTE /${slug} NOT FOUND\n\nPRESS ANY KEY TO RETURN... (it goes home)\n`,
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  const referrer = request.headers.get("referer");
  after(async () => {
    try {
      await admin.from("clicks").insert({
        url_id: data.id,
        referrer: referrer ? referrer.slice(0, 500) : null,
      });
    } catch {
      // Click telemetry must never break the redirect itself.
    }
  });

  return new Response(null, {
    status: 302,
    headers: { Location: data.destination },
  });
}
