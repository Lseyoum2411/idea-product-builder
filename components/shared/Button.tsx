"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({
  className,
  variant = "primary",
  disabled,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" &&
          "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500",
        variant === "ghost" && "text-zinc-200 hover:bg-white/5",
        variant === "outline" &&
          "border border-white/10 bg-white/[0.03] text-zinc-100 hover:border-violet-500/40 hover:bg-violet-500/10",
        className
      )}
      {...props}
    />
  );
}
