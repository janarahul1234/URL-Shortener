/** Build the absolute short URL for a slug. */
export async function buildShortUrl(slug: string): Promise<string> {
  const configured = process.env.APP_BASE_URL;
  if (configured) return `${configured.replace(/\/+$/, "")}/${slug}`;
  const { headers } = await import("next/headers");
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host");
  if (!host) return `/${slug}`;
  return `${proto}://${host}/${slug}`;
}
