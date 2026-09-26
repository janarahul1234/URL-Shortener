import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cmdClass, cx } from "./cx";

interface CmdButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  children: ReactNode;
}

/**
 * Solid chip button, like the reference's `Create` / `Cancel` controls.
 */
export function CmdButton({
  variant = "primary",
  className,
  children,
  disabled,
  ...props
}: CmdButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(cmdClass(variant), "cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}
