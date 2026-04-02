"use client";

import clsx from "clsx";
import type { FeasibilityScore } from "@/types";

const BAR_COLORS: Record<
  FeasibilityScore["label"],
  string
> = {
  Overloaded: "from-rose-600 to-rose-500",
  Ambitious: "from-amber-600 to-amber-500",
  Solid: "from-emerald-600 to-emerald-500",
  Comfortable: "from-sky-600 to-sky-500",
};

const TEXT_COLORS: Record<FeasibilityScore["label"], string> = {
  Overloaded: "text-rose-300",
  Ambitious: "text-amber-200",
  Solid: "text-emerald-200",
  Comfortable: "text-sky-200",
};

export function FeasibilityCard({ data }: { data: FeasibilityScore }) {
  const pct = Math.max(0, Math.min(100, data.score));
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-100">
          Feasibility score
        </h2>
        <span
          className={clsx(
            "text-sm font-semibold",
            TEXT_COLORS[data.label]
          )}
        >
          {data.label}
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={clsx(
            "h-full rounded-full bg-gradient-to-r transition-all",
            BAR_COLORS[data.label]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>0</span>
        <span className="font-mono text-zinc-400">{data.score}</span>
        <span>100</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {data.summary}
      </p>
    </section>
  );
}
