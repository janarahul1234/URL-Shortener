"use client";

import { useActionState, useState } from "react";
import { authenticate, type FormState } from "@/app/actions/auth";
import { CmdButton } from "@/components/terminal/cmd-button";
import { Field } from "@/components/terminal/field";
import { Panel } from "@/components/terminal/panel";

type Mode = "signin" | "signup";

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("signin");
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    authenticate,
    {},
  );

  return (
    <Panel title="user sign-on">
      <form action={formAction} noValidate>
        <input type="hidden" name="mode" value={mode} />
        <Field
          label="login"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="operator@phosphor.sys"
          error={state.fields?.email}
        />
        <Field
          label="passphrase"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="minimum 8 characters"
          error={state.fields?.password}
          hint={mode === "signup" ? "pick something you do not type on walls" : undefined}
        />

        {state.error ? (
          <p role="alert" className="mb-3 text-sm text-bad">
            !! {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <CmdButton type="submit" disabled={pending}>
            {pending ? "WORKING..." : mode === "signin" ? "SIGN ON" : "REGISTER"}
          </CmdButton>
          <CmdButton
            variant="ghost"
            type="button"
            disabled={pending}
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          >
            {mode === "signin" ? "NEW ACCOUNT" : "BACK TO SIGN ON"}
          </CmdButton>
          <span className="text-xs text-ink-dim">
            MODE={mode.toUpperCase()}
          </span>
        </div>
      </form>
    </Panel>
  );
}
