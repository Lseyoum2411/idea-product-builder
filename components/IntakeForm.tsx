"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AudienceInput } from "@/components/form/AudienceInput";
import { DesignStyleInput } from "@/components/form/DesignStyleInput";
import { FeaturePrioritizationInput } from "@/components/form/FeaturePrioritizationInput";
import { IdeaInput } from "@/components/form/IdeaInput";
import { IntegrationsInput } from "@/components/form/IntegrationsInput";
import { OptionalSection } from "@/components/form/OptionalSection";
import { PlatformSelect } from "@/components/form/PlatformSelect";
import { TechInput } from "@/components/form/TechInput";
import { TimelineSelect } from "@/components/form/TimelineSelect";
import { Button } from "@/components/shared/Button";
import { SectionCard } from "@/components/shared/SectionCard";
import type { BuilderOutputs, IntakeInputs } from "@/types";

const STORAGE_KEY = "product-buddy-session";

export function IntakeForm() {
  const router = useRouter();
  const [productIdea, setProductIdea] = useState("");
  const [timeline, setTimeline] = useState("");
  const [platform, setPlatform] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [techPreferences, setTechPreferences] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [featurePrioritization, setFeaturePrioritization] = useState("");
  const [integrations, setIntegrations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    idea?: string;
    audience?: string;
  }>({});

  const canSubmit =
    productIdea.trim() &&
    timeline &&
    platform &&
    targetAudience.trim() &&
    !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fe: typeof fieldErrors = {};
    if (!productIdea.trim()) fe.idea = "Describe your product idea.";
    if (!targetAudience.trim()) fe.audience = "Who is this for?";
    setFieldErrors(fe);
    if (Object.keys(fe).length) return;

    const body: IntakeInputs = {
      productIdea: productIdea.trim(),
      timeline,
      platform,
      targetAudience: targetAudience.trim(),
      techPreferences: techPreferences.trim() || undefined,
      designStyle: designStyle.trim() || undefined,
      featurePrioritization: featurePrioritization.trim() || undefined,
      integrations: integrations.trim() || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Generation failed"
        );
      }
      const outputs = data.outputs as BuilderOutputs | undefined;
      if (!outputs) throw new Error("Invalid response from server");

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          outputs,
          inputs: data.inputs as IntakeInputs,
        })
      );
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <SectionCard
        title="Required"
        subtitle="We use these to shape scope, roadmap, and checklist hours."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <IdeaInput
              value={productIdea}
              onChange={setProductIdea}
              error={fieldErrors.idea}
            />
          </div>
          <TimelineSelect value={timeline} onChange={setTimeline} />
          <PlatformSelect value={platform} onChange={setPlatform} />
          <div className="md:col-span-2">
            <AudienceInput
              value={targetAudience}
              onChange={setTargetAudience}
              error={fieldErrors.audience}
            />
          </div>
        </div>
      </SectionCard>

      <OptionalSection title="Optional — refine the plan">
        <TechInput value={techPreferences} onChange={setTechPreferences} />
        <DesignStyleInput value={designStyle} onChange={setDesignStyle} />
        <FeaturePrioritizationInput
          value={featurePrioritization}
          onChange={setFeaturePrioritization}
        />
        <IntegrationsInput value={integrations} onChange={setIntegrations} />
      </OptionalSection>

      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={!canSubmit}
          className="min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Building plan…
            </>
          ) : (
            "Generate build plan"
          )}
        </Button>
      </div>
    </form>
  );
}
