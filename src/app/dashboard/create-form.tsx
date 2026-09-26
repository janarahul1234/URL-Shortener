"use client";

import { useState, useActionState } from "react";
import { createUrl, type CreateUrlState } from "@/app/actions/urls";
import { CmdButton } from "@/components/terminal/cmd-button";
import { CopyButton } from "@/components/terminal/copy-button";
import { Field } from "@/components/terminal/field";
import { Panel } from "@/components/terminal/panel";
import { createUrlSchema, fieldErrorsFrom } from "@/lib/validation";

function readErrors(form: HTMLFormElement): Record<string, string> {
  const fd = new FormData(form);
  const destination = String(fd.get("destination") ?? "");
  const customSlug = String(fd.get("customSlug") ?? "");
  const parsed = createUrlSchema.safeParse({ destination, customSlug });
  if (parsed.success) return {};
  // Don't nag about fields the operator has not typed into yet.
  const errors = fieldErrorsFrom(parsed.error);
  if (destination === "") delete errors.destination;
  if (customSlug === "") delete errors.customSlug;
  return errors;
}

export function CreateForm() {
  const [state, formAction, pending] = useActionState<CreateUrlState, FormData>(
    createUrl,
    {},
  );
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const created = state.created;

  const errorFor = (key: string) =>
    localErrors[key] ?? state.fields?.[key];

  return (
    <Panel title="shorten new url">
      <form
        action={formAction}
        onInput={(e) => setLocalErrors(readErrors(e.currentTarget))}
      >
        <Field
          label="long_url"
          name="destination"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://very-long-and-boring-url.example.com/page"
          error={errorFor("destination")}
        />
        <Field
          label="custom_slug"
          name="customSlug"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="(optional) my-route — leave blank for random"
          hint="A-Z a-z 0-9 - _ · 1-63 chars"
          error={errorFor("customSlug")}
        />

        {state.error ? (
          <p role="alert" className="mb-3 text-sm text-bad">
            !! {state.error}
          </p>
        ) : null}

        <CmdButton type="submit" disabled={pending}>
          {pending ? "SHORTENING..." : "SHORTEN"}
        </CmdButton>
      </form>

      {created ? (
        <p
          className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 break-all text-sm"
          aria-live="polite"
        >
          <span className="text-ok">READY&gt;</span>
          <a
            href={created.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ink underline decoration-white/20 hover:decoration-ink"
          >
            {created.shortUrl}
          </a>
          <CopyButton text={created.shortUrl} />
        </p>
      ) : null}
    </Panel>
  );
}
