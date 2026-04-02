"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AIPromptsPanel } from "@/components/output/AIPromptsPanel";
import { CodeSnippetsPanel } from "@/components/output/CodeSnippetsPanel";
import { ExportBar } from "@/components/output/ExportBar";
import { PRDPanel } from "@/components/output/PRDPanel";
import { RoadmapPanel } from "@/components/output/RoadmapPanel";
import { SoloChecklistPanel } from "@/components/output/SoloChecklistPanel";
import { TechStackPanel } from "@/components/output/TechStackPanel";
import { SectionCard } from "@/components/shared/SectionCard";
import type { TabId } from "@/components/shared/TabNav";
import { TabNav } from "@/components/shared/TabNav";
import type { BuilderOutputs, IntakeInputs } from "@/types";

const STORAGE_KEY = "product-buddy-session";

export function ResultWorkspace() {
  const [tab, setTab] = useState<TabId>("prd");
  type Session = { outputs: BuilderOutputs; inputs: IntakeInputs };
  const [data, setData] = useState<Session | null | "pending">("pending");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setData(null);
        return;
      }
      const parsed = JSON.parse(raw) as Session;
      setData(parsed?.outputs ? parsed : null);
    } catch {
      setData(null);
    }
  }, []);

  if (data === "pending") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-violet-500/20" />
      </div>
    );
  }

  if (!data) {
    return (
      <SectionCard title="No plan loaded">
        <p className="text-sm text-zinc-400">
          Generate a plan from the home page first. Results are kept in this
          browser tab until you refresh.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-violet-400 hover:text-violet-300"
        >
          ← Back to intake
        </Link>
      </SectionCard>
    );
  }

  const { outputs, inputs } = data;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-300/80">
          Product Buddy
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Your build plan
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          {inputs.productIdea.slice(0, 200)}
          {inputs.productIdea.length > 200 ? "…" : ""}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          {inputs.platform} · {inputs.timeline.replace(/-/g, " ")}
        </p>
      </header>

      <ExportBar outputs={outputs} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <TabNav active={tab} onChange={setTab} />
        <SectionCard className="min-h-[420px] flex-1" title={undefined}>
          {tab === "prd" ? <PRDPanel prd={outputs.prd} /> : null}
          {tab === "prompts" ? (
            <AIPromptsPanel aiPrompts={outputs.aiPrompts} />
          ) : null}
          {tab === "roadmap" ? (
            <RoadmapPanel roadmap={outputs.roadmap} />
          ) : null}
          {tab === "tech" ? (
            <TechStackPanel techStack={outputs.techStack} />
          ) : null}
          {tab === "code" ? (
            <CodeSnippetsPanel codeSnippets={outputs.codeSnippets} />
          ) : null}
          {tab === "checklist" ? (
            <SoloChecklistPanel soloChecklist={outputs.soloChecklist} />
          ) : null}
        </SectionCard>
      </div>

      <Link
        href="/"
        className="inline-block text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← New idea
      </Link>
    </div>
  );
}
