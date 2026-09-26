import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client bound to the request's cookies.
 * Create one per request — never share across requests.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
            // Auth cookies must never be cached by CDNs/proxies.
            Object.entries(headers).forEach(([key, value]) =>
              cookieStore.set(key, value),
            );
          } catch {
            // Called from a Server Component: safe to ignore, the proxy
            // (src/proxy.ts) handles session refresh.
          }
        },
      },
    },
  );
}
