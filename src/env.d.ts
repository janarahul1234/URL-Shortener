// Environment typing. Server-only credentials (SUPABASE_SECRET_KEY) must never
// be prefixed with NEXT_PUBLIC_ — those vars ship to the browser.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
      SUPABASE_SECRET_KEY: string;
      APP_BASE_URL?: string;
    }
  }
}

export {};
