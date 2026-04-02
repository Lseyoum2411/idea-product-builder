"use client";

import type { BuilderOutputs } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { buildCodeMarkdown } from "@/lib/export";

export function CodeSnippetsPanel({
  codeSnippets,
}: Pick<BuilderOutputs, "codeSnippets">) {
  const md = buildCodeMarkdown(codeSnippets);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={md} label="Copy all snippets" />
      </div>
      <ul className="space-y-4">
        {codeSnippets.map((s, i) => (
          <li
            key={i}
            className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-4"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{s.title}</h3>
              <CopyButton
                text={s.code}
                label={`Copy ${s.language}`}
              />
            </div>
            <pre className="overflow-x-auto rounded-lg bg-black/50 p-3 text-xs text-emerald-100/90">
              <code>{s.code}</code>
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
