/** Join truthy class names. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared solid-chip styling for buttons and button-like links,
 * like the green `Create` / gray `Cancel` buttons in the reference.
 */
export function cmdClass(
  variant: "primary" | "danger" | "ghost" = "primary",
  extra?: string,
) {
  const variants = {
    primary:
      "bg-ok text-window hover:bg-[#5fe57f] disabled:bg-transparent disabled:text-ink-dim",
    danger:
      "bg-bad text-window hover:bg-[#ff7b7b] disabled:bg-transparent disabled:text-ink-dim",
    ghost:
      "bg-ink-muted text-window hover:bg-ink disabled:bg-transparent disabled:text-ink-dim",
  } as const;
  return cx(
    "inline-block rounded-xs px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors duration-75",
    variants[variant],
    extra,
  );
}
