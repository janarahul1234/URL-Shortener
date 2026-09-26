"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { buildShortUrl } from "@/lib/url";
import type { ShortenedUrl } from "@/lib/types";
import { createUrlSchema, fieldErrorsFrom, generateSlug } from "@/lib/validation";

export interface CreateUrlState {
  ok?: boolean;
  created?: ShortenedUrl;
  error?: string;
  fields?: Record<string, string>;
}

export async function createUrl(
  _prev: CreateUrlState,
  formData: FormData,
): Promise<CreateUrlState> {
  const parsed = createUrlSchema.safeParse({
    destination: formData.get("destination"),
    customSlug: formData.get("customSlug"),
  });
  if (!parsed.success) {
    return { fields: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "SESSION EXPIRED — sign in again." };
  }

  const { destination, customSlug } = parsed.data;
  const slug = customSlug || generateSlug();

  const { data, error } = await supabase
    .from("urls")
    .insert({
      user_id: user.id,
      slug,
      destination,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        fields: { customSlug: `slug "${slug}" is already taken by someone.` },
      };
    }
    return { error: "WRITE FAILED — the link was not saved. Try again." };
  }

  revalidatePath("/dashboard");
  return {
    ok: true,
    created: {
      ...data,
      total_clicks: Number(data.total_clicks),
      shortUrl: await buildShortUrl(slug),
    },
  };
}

const idSchema = z.string().uuid();

export async function deleteUrl(id: string): Promise<{ error?: string }> {
  if (!idSchema.safeParse(id).success) {
    return { error: "BAD ARGUMENT — invalid link id." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("urls").delete().eq("id", id);
  if (error) return { error: "DELETE FAILED — try again." };

  revalidatePath("/dashboard");
  return {};
}
