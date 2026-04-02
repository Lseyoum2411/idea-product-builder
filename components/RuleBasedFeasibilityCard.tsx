"use client";

import clsx from "clsx";
import type { IntakeInputs } from "@/types";
import {
  computeRuleBasedFeasibility,
  type RuleFeasibilityLabel,
} from "@/lib/feasibilityRules";

const BAR: Record<RuleFeasibilityLabel, string> = {
  "Solid Plan": "from-emerald-600 to-emerald-500",
  Ambitious: "from-amber-600 to-amber-500",
  Overloaded: "from-rose-600 to-rose-500",
};

const TEXT: Record<RuleFeasibilityLabel, string> = {
  "Solid Plan": "text-emerald-200",
  Ambitious: "text-amber-200",
  Overloaded: "text-rose-300",
};

export function RuleBasedFeasibilityCard({ inputs }: { inputs: IntakeInputs }) {
  const { score, label, tip } = computeRuleBasedFeasibility(inputs);
  const pct = score;

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-100">
          Feasibility score
        </h2>
        <span className={clsx("text-sm font-semibold", TEXT[label])}>
          {label}
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={clsx(
            "h-full rounded-full bg-gradient-to-r transition-all",
            BAR[label]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>0</span>
        <span className="font-mono text-zinc-400">{score}</span>
        <span>100</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{tip}</p>
      <p className="mt-3 text-xs text-zinc-600">
        Full AI feasibility scoring coming soon
      </p>
    </section>
  );
}
