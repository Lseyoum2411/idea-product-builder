"use client";

import ReactMarkdown from "react-markdown";
import type { BuilderOutputs } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { buildTechStackMarkdown } from "@/lib/export";

export function TechStackPanel({
  techStack,
}: Pick<BuilderOutputs, "techStack">) {
  const md = buildTechStackMarkdown(techStack);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={md} label="Copy tech stack" />
      </div>
      <article className="prose prose-invert prose-sm max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300">
        <ReactMarkdown>{techStack}</ReactMarkdown>
      </article>
    </div>
  );
}
