"use client";

import type { BuilderOutputs } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { buildChecklistMarkdown } from "@/lib/export";

export function SoloChecklistPanel({
  soloChecklist,
}: Pick<BuilderOutputs, "soloChecklist">) {
  const md = buildChecklistMarkdown(soloChecklist);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={md} label="Copy checklist" />
      </div>
      <div className="space-y-6">
        {soloChecklist.map((p, i) => (
          <section
            key={i}
            className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-4"
          >
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{p.phase}</h3>
              <span className="text-xs text-zinc-500">
                ~{p.estimatedHours}h
              </span>
            </div>
            <ul className="space-y-2">
              {p.tasks.map((t, j) => (
                <li
                  key={j}
                  className="flex gap-2 text-sm text-zinc-300 before:content-['○'] before:text-violet-400"
                >
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
