/** Row shapes for the Supabase tables (see supabase/schema.sql). */

export interface UrlRow {
  id: string;
  user_id: string;
  slug: string;
  destination: string;
  total_clicks: number;
  created_at: string;
}

export interface ClickRow {
  id: number;
  url_id: string;
  referrer: string | null;
  clicked_at: string;
}

/** UrlRow enriched with the absolute short URL for display/copy. */
export interface ShortenedUrl extends UrlRow {
  shortUrl: string;
}
