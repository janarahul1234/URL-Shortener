"use client";

import { CmdButton } from "@/components/terminal/cmd-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center py-24">
      <div className="w-full max-w-lg rounded-md border border-white/10 bg-window px-6 py-8 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
        <p className="text-lg text-bad">!! GENERAL PROTECTION FAULT</p>
        <p className="mt-2 text-sm text-ink-muted">
          # {error.message || "AN UNKNOWN ERROR HAS OCCURRED."}
        </p>
        {error.digest ? (
          <p className="mt-1 text-xs text-ink-dim">DUMP: {error.digest}</p>
        ) : null}
        <CmdButton type="button" onClick={reset} className="mt-4">
          REBOOT
        </CmdButton>
      </div>
    </main>
  );
}
