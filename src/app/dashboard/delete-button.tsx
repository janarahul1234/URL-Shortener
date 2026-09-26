"use client";

import { useState } from "react";
import { deleteUrl } from "@/app/actions/urls";
import { CmdButton } from "@/components/terminal/cmd-button";

/**
 * `DEL` -> `PURGE /slug? [Y/N]` — confirm-before-purge, chip buttons.
 */
export function DeleteButton({ id, slug }: { id: string; slug: string }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <span role="alert" className="text-xs text-bad">
        !! {error}
      </span>
    );
  }

  if (!confirming) {
    return (
      <CmdButton
        variant="danger"
        type="button"
        disabled={busy}
        onClick={() => setConfirming(true)}
      >
        DEL
      </CmdButton>
    );
  }

  async function purge() {
    setBusy(true);
    const result = await deleteUrl(id);
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      setConfirming(false);
    }
    // On success the row disappears on revalidation.
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className="text-bad">PURGE /{slug}?</span>
      <CmdButton
        variant="danger"
        type="button"
        disabled={busy}
        onClick={purge}
      >
        {busy ? "..." : "Y"}
      </CmdButton>
      <CmdButton type="button" onClick={() => setConfirming(false)}>
        N
      </CmdButton>
    </span>
  );
}
