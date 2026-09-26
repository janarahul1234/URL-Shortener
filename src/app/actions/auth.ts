"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { credentialsSchema, fieldErrorsFrom } from "@/lib/validation";
import { z } from "zod";

export interface FormState {
  error?: string;
  fields?: Record<string, string>;
  ok?: boolean;
}

const authFormSchema = credentialsSchema.and(
  z.object({ mode: z.enum(["signin", "signup"]) }),
);

/** Single entry point for sign-in / sign-up forms (Zod-validated). */
export async function authenticate(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = authFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    mode: formData.get("mode"),
  });
  if (!parsed.success) {
    return { fields: fieldErrorsFrom(parsed.error) };
  }

  const { mode, ...credentials } = parsed.data;
  const supabase = await createClient();

  const { error } =
    mode === "signup"
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

  if (error) {
    if (/invalid login credentials/i.test(error.message)) {
      return { error: "ACCESS DENIED — wrong email or password." };
    }
    if (/confirm/i.test(error.message)) {
      return {
        error:
          "ACCOUNT CREATED — check your inbox, then sign in once confirmed.",
      };
    }
    if (/rate limit/i.test(error.message)) {
      return { error: "TOO MANY ATTEMPTS — wait a minute and retry." };
    }
    return { error: "SYSTEM HALT — authentication failed. Try again." };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
