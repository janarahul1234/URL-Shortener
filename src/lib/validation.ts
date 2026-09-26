import { z } from "zod";

/** Route segments the app owns — never allowed as custom slugs. */
export const RESERVED_SLUGS = [
  "api",
  "dashboard",
  "login",
  "logout",
  "signin",
  "signup",
  "assets",
  "static",
  "favicon.ico",
  "robots.txt",
] as const;

const slugPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,62}$/;
const reservedSlugSet = new Set<string>(RESERVED_SLUGS);

export const createUrlSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(1, "destination URL is required")
    .max(2048, "destination URL is too long (max 2048 chars)")
    .url("that does not look like a valid URL")
    .refine(
      (v) => /^https?:\/\//i.test(v),
      "only http:// and https:// URLs can be shortened",
    ),
  customSlug: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || slugPattern.test(v),
      "slug must be 1-63 chars: letters, digits, - or _ (must start with a letter or digit)",
    )
    .refine(
      (v) => !v || !reservedSlugSet.has(v.toLowerCase()),
      "that slug is reserved",
    ),
});

export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "email is required")
    .max(254)
    .email("that is not a valid email address"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .max(72, "password must be at most 72 characters"),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;

/** Flatten Zod issues into field -> first message for form display. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) out[key] = issue.message;
  }
  return out;
}

const SLUG_ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Random 7-char slug, ambiguous glyphs excluded (Crockford-style). */
export function generateSlug(length = 7): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(
    bytes,
    (b) => SLUG_ALPHABET[b % SLUG_ALPHABET.length],
  ).join("");
}
