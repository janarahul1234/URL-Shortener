import type { InputHTMLAttributes } from "react";
import { cx } from "./cx";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/**
 * Prompt-style input matching the reference forms:
 *   label
 *   ┌────────────────────┐
 *   │ value              │
 *   └────────────────────┘
 *   !! error line
 */
export function Field({ label, hint, error, id, className, ...props }: FieldProps) {
  const inputId = id ?? `field-${props.name ?? label}`;
  const errorId = `${inputId}-error`;
  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-xs text-ink-muted">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          "mt-1.5 w-full rounded-sm border bg-black/40 px-2.5 py-1.5",
          "text-sm text-ink caret-ok outline-none",
          "placeholder:text-ink-dim",
          error
            ? "border-bad focus:border-bad"
            : "border-white/15 focus:border-ink-muted",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-bad">
          !! {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-dim"># {hint}</p>
      ) : null}
    </div>
  );
}
