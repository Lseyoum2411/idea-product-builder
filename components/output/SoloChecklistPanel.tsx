"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { BuilderOutputs, PhaseComplexityDisplay } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/shared/Button";
import { buildChecklistMarkdown } from "@/lib/export";
import { NotionExportModal } from "@/components/NotionExportModal";

export function SoloChecklistPanel({
  soloChecklist,
  complexityByPhase,
  productTitle,
}: Pick<BuilderOutputs, "soloChecklist"> & {
  complexityByPhase?: Record<string, PhaseComplexityDisplay>;
  productTitle: string;
}) {
  const md = buildChecklistMarkdown(soloChecklist);
  const [notionOpen, setNotionOpen] = useState(false);
  const [tipPhase, setTipPhase] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setNotionOpen(true)}
        >
          Export to Notion
        </Button>
        <CopyButton text={md} label="Copy checklist" />
      </div>
      <div className="space-y-6">
        {soloChecklist.map((p, i) => {
          const meta = complexityByPhase?.[p.phase];
          const flagged = meta?.flagged && meta.reason;
          return (
            <section
              key={i}
              className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-4"
            >
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {p.phase}
                  </h3>
                  {flagged ? (
                    <span className="relative inline-flex">
                      <button
                        type="button"
                        className="rounded p-0.5 text-amber-400 hover:bg-amber-500/10"
                        title={meta.reason}
                        aria-label={`Warning: ${meta.reason}`}
                        onClick={() =>
                          setTipPhase((x) => (x === p.phase ? null : p.phase))
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                      {tipPhase === p.phase ? (
                        <span className="absolute left-0 top-full z-10 mt-1 max-w-xs rounded-lg border border-amber-500/30 bg-zinc-900 px-2 py-1.5 text-xs text-amber-100/95 shadow-lg sm:hidden">
                          {meta.reason}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-zinc-500">~{p.estimatedHours}h</span>
              </div>
              {flagged ? (
                <p
                  className="mb-3 hidden text-xs text-amber-200/80 sm:block"
                  title={meta.reason}
                >
                  {meta.reason}
                </p>
              ) : null}
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
          );
        })}
      </div>

      <NotionExportModal
        open={notionOpen}
        onClose={() => setNotionOpen(false)}
        productTitle={productTitle}
        phases={soloChecklist.map((x) => ({
          phase: x.phase,
          tasks: x.tasks,
        }))}
      />
    </div>
  );
}
