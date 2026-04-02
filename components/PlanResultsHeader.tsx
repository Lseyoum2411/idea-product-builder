"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/shared/Button";
import type { BuilderOutputs, IntakeInputs } from "@/types";
import {
  buildFullPlanMarkdown,
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

function timelineLabel(key: string): string {
  const map: Record<string, string> = {
    "1-week": "1 week",
    "2-weeks": "2 weeks",
    "1-month": "1 month",
    "3-months": "3 months",
    "6-months": "6 months",
  };
  return map[key] ?? key.replace(/-/g, " ");
}

function platformLabel(key: string): string {
  const map: Record<string, string> = {
    web: "Web",
    mobile: "Mobile",
    desktop: "Desktop",
    api: "API",
    hybrid: "Hybrid",
  };
  return map[key] ?? key;
}

export function PlanResultsHeader({
  inputs,
  outputs,
  statusPill = "Generated just now",
}: {
  inputs: IntakeInputs;
  outputs: BuilderOutputs;
  statusPill?: string;
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const title =
    inputs.productIdea.length > 60
      ? `${inputs.productIdea.slice(0, 60)}…`
      : inputs.productIdea;

  const fullMd = buildFullPlanMarkdown(outputs);
  const csv = exportTasksCSV(outputs.soloChecklist);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const copyMd = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullMd);
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy failed");
    }
    setExportOpen(false);
  }, [fullMd, showToast]);

  const sharePage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied!");
    } catch {
      showToast("Copy failed");
    }
  }, [showToast]);

  return (
    <>
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">
              {title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300">
                {timelineLabel(inputs.timeline)}
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300">
                {platformLabel(inputs.platform)}
              </span>
              <span className="rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-200/90">
                {statusPill}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div className="relative" ref={menuRef}>
              <Button
                type="button"
                variant="outline"
                className="min-w-[140px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setExportOpen((o) => !o);
                }}
              >
                Export
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 transition",
                    exportOpen && "rotate-180"
                  )}
                />
              </Button>
              {exportOpen ? (
                <div className="absolute right-0 top-full z-30 mt-1 min-w-[220px] rounded-xl border border-white/10 bg-zinc-950 py-1 shadow-xl">
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-white/5"
                    onClick={() => {
                      void copyMd();
                    }}
                  >
                    Copy as Markdown
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-white/5"
                    onClick={() => {
                      downloadText(
                        "product-buddy-plan.md",
                        fullMd,
                        "text/markdown;charset=utf-8"
                      );
                      setExportOpen(false);
                    }}
                  >
                    Download .md file
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-white/5"
                    onClick={() => {
                      downloadText(
                        "product-buddy-checklist.csv",
                        csv,
                        "text/csv;charset=utf-8"
                      );
                      setExportOpen(false);
                    }}
                  >
                    Download checklist as CSV
                  </button>
                </div>
              ) : null}
            </div>
            <Button type="button" variant="primary" onClick={() => void sharePage()}>
              Share
            </Button>
          </div>
        </div>
      </div>

      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/95 px-4 py-2.5 text-sm text-emerald-100 shadow-lg"
          role="status"
        >
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          {toast}
        </div>
      ) : null}
    </>
  );
}
