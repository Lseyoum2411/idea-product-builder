import clsx from "clsx";
import type { ReactNode } from "react";

export function SectionCard({
  children,
  className,
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-sm",
        className
      )}
    >
      {title ? (
        <header className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
