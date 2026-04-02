import { mergeAnticipatedComplexity } from "@/lib/complexityMerge";
import {
  fetchAnticipatedComplexityFlags,
  fetchFeasibilityScore,
  generateAllOutputs,
  generateRefinedOutputs,
} from "@/lib/prompts";
import type {
  BuilderOutputs,
  IntakeInputs,
  PersistedPlanOutputs,
} from "@/types";

export async function runFullGenerationPipeline(
  inputs: IntakeInputs,
  options?: {
    previousOutputs?: BuilderOutputs;
    changeDescription?: string;
  }
): Promise<{
  outputs: BuilderOutputs;
  persisted: PersistedPlanOutputs;
}> {
  const refine =
    options?.previousOutputs &&
    options.changeDescription?.trim().length;

  const mainPromise = refine
    ? generateRefinedOutputs(
        options.previousOutputs!,
        inputs,
        options.changeDescription!.trim()
      )
    : generateAllOutputs(inputs);

  const [outputs, feasibility, anticipatedFlags] = await Promise.all([
    mainPromise,
    fetchFeasibilityScore(inputs),
    fetchAnticipatedComplexityFlags(inputs),
  ]);

  const complexityByPhase = mergeAnticipatedComplexity(
    outputs.soloChecklist,
    anticipatedFlags
  );

  const persisted: PersistedPlanOutputs = {
    builder: outputs,
    feasibility,
    complexityByPhase,
  };

  return { outputs, persisted };
}
