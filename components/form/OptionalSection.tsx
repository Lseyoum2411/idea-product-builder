"use client";

import type { ReactNode } from "react";

export function OptionalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.12] bg-zinc-950/40 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
