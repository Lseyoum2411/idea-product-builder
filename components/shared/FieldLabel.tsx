import clsx from "clsx";
import type { ReactNode } from "react";

export function FieldLabel({
  children,
  required,
  className,
}: {
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      className={clsx(
        "mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400",
        className
      )}
    >
      {children}
      {required ? (
        <span className="ml-1 text-violet-400" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}
