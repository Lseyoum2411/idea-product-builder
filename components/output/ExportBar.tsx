"use client";

import type { BuilderOutputs } from "@/types";
import { Button } from "@/components/shared/Button";
import { CopyButton } from "@/components/shared/CopyButton";
import {
  buildFullPlanMarkdown,
  buildPRDMarkdown,
  buildRoadmapMarkdown,
  buildTechStackMarkdown,
  buildCodeMarkdown,
  exportTasksCSV,
} from "@/lib/export";

function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportBar({ outputs }: { outputs: BuilderOutputs }) {
  const full = buildFullPlanMarkdown(outputs);
  const csv = exportTasksCSV(outputs.soloChecklist);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-violet-500/20 bg-violet-950/20 p-4">
      <span className="mr-2 text-xs font-medium uppercase tracking-wider text-violet-200/80">
        Export
      </span>
      <CopyButton
        text={full}
        label="Copy full plan"
        variant="primary"
        className="shrink-0"
      />
      <Button
        variant="primary"
        onClick={() =>
          downloadText("product-buddy-plan.md", full, "text/markdown;charset=utf-8")
        }
      >
        Download full plan (.md)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          downloadText("product-buddy-checklist.csv", csv, "text/csv;charset=utf-8")
        }
      >
        Download checklist (.csv)
      </Button>
      <Button
        variant="ghost"
        className="text-xs"
        onClick={() =>
          downloadText(
            "product-buddy-prd.md",
            buildPRDMarkdown(outputs.prd),
            "text/markdown;charset=utf-8"
          )
        }
      >
        PRD only
      </Button>
      <Button
        variant="ghost"
        className="text-xs"
        onClick={() =>
          downloadText(
            "product-buddy-roadmap.md",
            buildRoadmapMarkdown(outputs.roadmap),
            "text/markdown;charset=utf-8"
          )
        }
      >
        Roadmap only
      </Button>
      <Button
        variant="ghost"
        className="text-xs"
        onClick={() =>
          downloadText(
            "product-buddy-tech.md",
            buildTechStackMarkdown(outputs.techStack),
            "text/markdown;charset=utf-8"
          )
        }
      >
        Tech only
      </Button>
      <Button
        variant="ghost"
        className="text-xs"
        onClick={() =>
          downloadText(
            "product-buddy-code.md",
            buildCodeMarkdown(outputs.codeSnippets),
            "text/markdown;charset=utf-8"
          )
        }
      >
        Code only
      </Button>
    </div>
  );
}
