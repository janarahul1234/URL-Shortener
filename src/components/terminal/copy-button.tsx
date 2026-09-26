"use client";

import { useEffect, useRef, useState } from "react";
import { CmdButton } from "./cmd-button";

/**
 * `COPY` chip button with copied feedback. Falls back to execCommand on
 * browsers without async clipboard (or non-secure contexts).
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <CmdButton
      variant="ghost"
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${text}`}
    >
      {copied ? "✓ COPIED" : "COPY"}
    </CmdButton>
  );
}
