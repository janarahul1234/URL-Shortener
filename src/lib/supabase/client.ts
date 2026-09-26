import { createBrowserClient } from "@supabase/ssr";

/** Client-side Supabase client (browser only). Uses the publishable key. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
