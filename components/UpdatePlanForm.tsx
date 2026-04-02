"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { IntegrationsInput } from "@/components/form/IntegrationsInput";
import { PlatformSelect } from "@/components/form/PlatformSelect";
import { TechInput } from "@/components/form/TechInput";
import { TimelineSelect } from "@/components/form/TimelineSelect";
import { Button } from "@/components/shared/Button";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { SectionCard } from "@/components/shared/SectionCard";
import type {
  BuilderOutputs,
  IntakeInputs,
  ResultSessionPayload,
} from "@/types";

const STORAGE_KEY = "product-buddy-session";

export function UpdatePlanForm({
  inputs,
  outputs,
  slug,
  onUpdated,
}: {
  inputs: IntakeInputs;
  outputs: BuilderOutputs;
  slug?: string;
  onUpdated: (session: ResultSessionPayload) => void;
}) {
  const [timeline, setTimeline] = useState(inputs.timeline);
  const [platform, setPlatform] = useState(inputs.platform);
  const [techPreferences, setTechPreferences] = useState(
    inputs.techPreferences ?? ""
  );
  const [integrations, setIntegrations] = useState(
    inputs.integrations ?? ""
  );
  const [changeNote, setChangeNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!changeNote.trim()) {
      setError('Describe what changed (e.g. "Add Stripe" or "3 weeks instead of 1").');
      return;
    }
    setError(null);
    setLoading(true);
    const nextInputs: IntakeInputs = {
      ...inputs,
      timeline,
      platform,
      techPreferences: techPreferences.trim() || undefined,
      integrations: integrations.trim() || undefined,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nextInputs,
          changeDescription: changeNote.trim(),
          previousOutputs: outputs,
          slug,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Update failed"
        );
      }
      const session: ResultSessionPayload = {
        outputs: data.outputs,
        inputs: data.inputs,
        slug: data.slug,
        feasibility: data.feasibility,
        complexityByPhase: data.complexityByPhase,
        updatedTabs: data.updatedTabs,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      onUpdated(session);
      setChangeNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard
      title="Update plan"
      subtitle="Adjust context and describe what changed. We regenerate only what needs to move."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TimelineSelect value={timeline} onChange={setTimeline} />
          <PlatformSelect value={platform} onChange={setPlatform} />
          <div className="sm:col-span-2">
            <TechInput
              value={techPreferences}
              onChange={setTechPreferences}
            />
          </div>
          <div className="sm:col-span-2">
            <IntegrationsInput
              value={integrations}
              onChange={setIntegrations}
            />
          </div>
        </div>
        <div>
          <FieldLabel required>What changed?</FieldLabel>
          <textarea
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            rows={3}
            placeholder='e.g. "Add Stripe checkout" or "We have 3 weeks now"'
            className="w-full resize-y rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
          />
        </div>
        {error ? (
          <p className="text-sm text-rose-300">{error}</p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating…
              </>
            ) : (
              "Regenerate plan"
            )}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
