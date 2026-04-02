"use client";

import type { BuilderOutputs } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { buildPromptsMarkdown } from "@/lib/export";

export function AIPromptsPanel({
  aiPrompts,
}: Pick<BuilderOutputs, "aiPrompts">) {
  const all = buildPromptsMarkdown(aiPrompts);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <CopyButton text={all} label="Copy all prompts" />
      </div>
      <ul className="space-y-6">
        {aiPrompts.map((p, i) => (
          <li
            key={i}
            className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-4"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{p.title}</h3>
              <CopyButton text={p.prompt} label="Copy" />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-xs text-zinc-300">
              {p.prompt}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
