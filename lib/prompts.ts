import type { BuilderOutputs, IntakeInputs } from "@/types";
import { callClaude } from "@/lib/claude";
import { getTechStackContext } from "@/lib/techstack";
import { getTimelineContext } from "@/lib/timeline";

export function buildSystemPrompt(): string {
  return `You are an expert product and engineering planner for solo builders. You respond with ONLY valid JSON — no markdown fences, no commentary before or after. The JSON must match this TypeScript shape exactly:
{
  "prd": string (markdown document sections: Overview, Goals, User stories, Scope, Non-goals, Success metrics),
  "aiPrompts": { "title": string, "prompt": string }[] (5–10 actionable prompts for building/implementing),
  "roadmap": { "title": string, "description": string, "timeframe"?: string }[],
  "techStack": string (markdown: recommended stack with short rationale),
  "codeSnippets": { "title": string, "language": string, "code": string }[] (2–5 small starter snippets),
  "soloChecklist": { "phase": string, "tasks": string[], "estimatedHours": number }[]
}
Rules:
- soloChecklist phases should map to realistic solo work; sum estimatedHours should align with the given timeline (tighter timelines = fewer hours).
- roadmap items should be ordered and sized for the timeline.
- Be concrete and specific to the user's product idea.`;
}

export function parseClaudeJSON<T>(raw: string): T {
  let s = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m;
  const m = s.match(fence);
  if (m) s = m[1].trim();

  try {
    return JSON.parse(s) as T;
  } catch {
    throw new Error(
      "Could not parse model output as JSON. Try again or shorten your idea."
    );
  }
}

function validateOutputs(data: unknown): BuilderOutputs {
  if (!data || typeof data !== "object") {
    throw new Error("Model returned invalid root object");
  }
  const o = data as Record<string, unknown>;
  const str = (k: string) =>
    typeof o[k] === "string" ? (o[k] as string) : "";
  const arr = (k: string) => (Array.isArray(o[k]) ? o[k] : []);

  const aiPrompts = arr("aiPrompts").map((item, i) => {
    if (!item || typeof item !== "object") {
      return { title: `Prompt ${i + 1}`, prompt: String(item) };
    }
    const p = item as Record<string, unknown>;
    return {
      title: typeof p.title === "string" ? p.title : `Prompt ${i + 1}`,
      prompt: typeof p.prompt === "string" ? p.prompt : "",
    };
  });

  const roadmap = arr("roadmap").map((item, i) => {
    if (!item || typeof item !== "object") {
      return { title: `Milestone ${i + 1}`, description: String(item) };
    }
    const p = item as Record<string, unknown>;
    return {
      title: typeof p.title === "string" ? p.title : `Milestone ${i + 1}`,
      description:
        typeof p.description === "string" ? p.description : "",
      timeframe:
        typeof p.timeframe === "string" ? p.timeframe : undefined,
    };
  });

  const codeSnippets = arr("codeSnippets").map((item, i) => {
    if (!item || typeof item !== "object") {
      return { title: `Snippet ${i + 1}`, language: "text", code: "" };
    }
    const p = item as Record<string, unknown>;
    return {
      title: typeof p.title === "string" ? p.title : `Snippet ${i + 1}`,
      language: typeof p.language === "string" ? p.language : "text",
      code: typeof p.code === "string" ? p.code : "",
    };
  });

  const soloChecklist = arr("soloChecklist").map((item, i) => {
    if (!item || typeof item !== "object") {
      return { phase: `Phase ${i + 1}`, tasks: [], estimatedHours: 0 };
    }
    const p = item as Record<string, unknown>;
    const tasks = Array.isArray(p.tasks)
      ? p.tasks.map((t) => String(t))
      : [];
    const hours =
      typeof p.estimatedHours === "number" && !Number.isNaN(p.estimatedHours)
        ? p.estimatedHours
        : 0;
    return {
      phase: typeof p.phase === "string" ? p.phase : `Phase ${i + 1}`,
      tasks,
      estimatedHours: hours,
    };
  });

  return {
    prd: str("prd") || "_(No PRD returned)_",
    aiPrompts: aiPrompts.length ? aiPrompts : [{ title: "Build", prompt: "" }],
    roadmap,
    techStack: str("techStack") || "_(No tech stack returned)_",
    codeSnippets,
    soloChecklist,
  };
}

export function buildUserPrompt(inputs: IntakeInputs): string {
  const timelineCtx = getTimelineContext(inputs.timeline);
  const stackCtx = getTechStackContext(
    inputs.platform,
    inputs.techPreferences,
    inputs.integrations
  );

  return `Product idea:
${inputs.productIdea}

Target audience:
${inputs.targetAudience}

Platform: ${inputs.platform}
Timeline key: ${inputs.timeline}

${timelineCtx}

${stackCtx}

${inputs.designStyle?.trim() ? `Design direction: ${inputs.designStyle}` : ""}
${inputs.featurePrioritization?.trim() ? `Feature priorities: ${inputs.featurePrioritization}` : ""}

Produce the JSON object now.`;
}

export async function generateAllOutputs(
  inputs: IntakeInputs
): Promise<BuilderOutputs> {
  const raw = await callClaude(buildSystemPrompt(), buildUserPrompt(inputs));
  const parsed = parseClaudeJSON<unknown>(raw);
  return validateOutputs(parsed);
}
