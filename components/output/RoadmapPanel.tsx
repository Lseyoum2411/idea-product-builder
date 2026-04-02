"use client";

import type { BuilderOutputs } from "@/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { buildRoadmapMarkdown } from "@/lib/export";

export function RoadmapPanel({
  roadmap,
}: Pick<BuilderOutputs, "roadmap">) {
  const md = buildRoadmapMarkdown(roadmap);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={md} label="Copy roadmap" />
      </div>
      <ol className="space-y-4">
        {roadmap.map((r, i) => (
          <li
            key={i}
            className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{r.title}</h3>
              {r.timeframe ? (
                <span className="text-xs text-violet-300/90">{r.timeframe}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-zinc-400">{r.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
