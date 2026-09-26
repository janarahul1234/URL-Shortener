/**
 * Boot-screen banner rendered as the reference's first terminal window:
 * black chrome, dot buttons, a prompt line, and the product name loud
 * in white with a green status line underneath.
 */
export function Banner() {
  return (
    <header className="mb-6 rounded-md border border-white/10 bg-window shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-1.5 px-4 pt-3" aria-hidden="true">
        <span className="size-2 rounded-full bg-ink-dim" />
        <span className="size-2 rounded-full bg-ink-dim" />
        <span className="size-2 rounded-full bg-ink-dim" />
      </div>
      <p className="px-4 pt-2 text-xs text-ink-muted">
        operator@shortcircuit ~ % ./boot --device=display-0
      </p>
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <h1 className="text-2xl font-bold leading-tight tracking-[0.14em] text-ink sm:text-4xl">
          SHORTCIRCUIT
        </h1>
        <p className="mt-2 text-xs text-ok sm:text-sm">
          ✓ URL SHORTENER TERMINAL v1.0 — DISPLAY OK
          <span className="cursor-blink" aria-hidden="true">
            ▌
          </span>
        </p>
      </div>
    </header>
  );
}
