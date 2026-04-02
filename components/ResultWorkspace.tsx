"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { PlanResultsHeader } from "@/components/PlanResultsHeader";
import { RuleBasedFeasibilityCard } from "@/components/RuleBasedFeasibilityCard";
import { UpdatePlanForm } from "@/components/UpdatePlanForm";
import { AIPromptsPanel } from "@/components/output/AIPromptsPanel";
import { CodeSnippetsPanel } from "@/components/output/CodeSnippetsPanel";
import { PRDPanel } from "@/components/output/PRDPanel";
import { RoadmapPanel } from "@/components/output/RoadmapPanel";
import { SoloChecklistPanel } from "@/components/output/SoloChecklistPanel";
import { TechStackPanel } from "@/components/output/TechStackPanel";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/shared/Button";
import { TabNav } from "@/components/shared/TabNav";
import type { ResultSessionPayload, TabId } from "@/types";

const STORAGE_KEY = "product-buddy-session";

type Session = ResultSessionPayload;

export function ResultWorkspace({
  initialSession,
  readOnly = false,
}: {
  initialSession?: Session | null;
  readOnly?: boolean;
}) {
  const [tab, setTab] = useState<TabId>("prd");
  const [data, setData] = useState<Session | null | "pending">("pending");

  useEffect(() => {
    if (initialSession !== undefined) {
      setData(initialSession?.outputs ? initialSession : null);
      return;
    }
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
  }, [initialSession]);

  const handleUpdated = useCallback((session: Session) => {
    setData(session);
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
      <SectionCard title={undefined}>
        <div className="flex flex-col items-center py-8 text-center">
          <Rocket className="h-12 w-12 text-violet-500/50" aria-hidden />
          <h2 className="mt-6 text-lg font-semibold text-zinc-100">
            No plan here yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            Head to the intake form and describe what you&apos;re building.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-8"
            onClick={() => {
              window.location.href = "/new";
            }}
          >
            Create a plan →
          </Button>
        </div>
      </SectionCard>
    );
  }

  const { outputs, inputs, slug, complexityByPhase, updatedTabs } = data;

  return (
    <div className="space-y-6">
      <PlanResultsHeader
        inputs={inputs}
        outputs={outputs}
        statusPill={
          readOnly ? "Shared plan" : "Generated just now"
        }
      />

      <RuleBasedFeasibilityCard inputs={inputs} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <TabNav
          active={tab}
          onChange={setTab}
          updatedTabs={updatedTabs ?? []}
        />
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
            <SoloChecklistPanel
              soloChecklist={outputs.soloChecklist}
              complexityByPhase={complexityByPhase}
              productTitle={inputs.productIdea.slice(0, 2000)}
            />
          ) : null}
        </SectionCard>
      </div>

      {!readOnly ? (
        <UpdatePlanForm
          inputs={inputs}
          outputs={outputs}
          slug={slug}
          onUpdated={handleUpdated}
        />
      ) : null}

      <Link
        href="/new"
        className="inline-block text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← New plan
      </Link>
    </div>
  );
}
