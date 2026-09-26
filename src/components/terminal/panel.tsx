import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  children: ReactNode;
}

/**
 * Terminal-window panel matching the reference chrome:
 *   ● ● ●  user@machine — title
 *   ┌───────────────────────────────┐
 *   │  ...                          │
 *   └───────────────────────────────┘
 * A black window with dot buttons, then a hairline-framed body.
 */
export function Panel({ title, children }: PanelProps) {
  return (
    <section className="mb-6">
      <div className="rounded-md border border-white/10 bg-window shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3 px-4 pt-3 pb-2">
          <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink-dim" />
            <span className="size-2 rounded-full bg-ink-dim" />
            <span className="size-2 rounded-full bg-ink-dim" />
          </span>
          <h2 className="truncate text-xs text-ink-muted sm:text-sm">{title}</h2>
        </header>
        <div className="m-3 mt-1 rounded-sm border border-white/10 px-3 py-4 sm:px-4">
          {children}
        </div>
      </div>
    </section>
  );
}
