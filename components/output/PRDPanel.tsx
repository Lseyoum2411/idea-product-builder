"use client";

import ReactMarkdown from "react-markdown";
import type { BuilderOutputs } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { buildPRDMarkdown } from "@/lib/export";

export function PRDPanel({ prd }: Pick<BuilderOutputs, "prd">) {
  const md = buildPRDMarkdown(prd);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={md} label="Copy PRD" />
      </div>
      <article className="prose prose-invert prose-sm max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300">
        <ReactMarkdown>{prd}</ReactMarkdown>
      </article>
    </div>
  );
}
