import type {
  AnticipatedComplexityFlag,
  BuilderOutputs,
  FeasibilityScore,
  IntakeInputs,
} from "@/types";
import { callClaude, MODEL_HAIKU } from "@/lib/claude";
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

export function buildRefinementSystemPrompt(): string {
  return `You are updating an existing solo-builder product plan. Respond with ONLY valid JSON — no markdown fences, no commentary. Use this exact shape:
{
  "prd": string,
  "aiPrompts": { "title": string, "prompt": string }[],
  "roadmap": { "title": string, "description": string, "timeframe"?: string }[],
  "techStack": string,
  "codeSnippets": { "title": string, "language": string, "code": string }[],
  "soloChecklist": { "phase": string, "tasks": string[], "estimatedHours": number }[]
}
Rules:
- Apply the user's change description to the previous plan. Update only sections that must change for consistency; keep unchanged sections the same verbatim when possible.
- If timeline or scope shifts, revise roadmap and soloChecklist (hours) accordingly.
- If features change, revise PRD, aiPrompts, and related snippets as needed.
- Always return the complete object with all keys.`;
}

export function buildRefinementUserPrompt(
  previous: BuilderOutputs,
  inputs: IntakeInputs,
  changeDescription: string
): string {
  return `${buildUserPrompt(inputs)}

--- Previous plan (JSON) ---
${JSON.stringify(previous)}

--- What changed ---
${changeDescription}

Return the full updated JSON now.`;
}

export async function generateRefinedOutputs(
  previous: BuilderOutputs,
  inputs: IntakeInputs,
  changeDescription: string
): Promise<BuilderOutputs> {
  const raw = await callClaude(
    buildRefinementSystemPrompt(),
    buildRefinementUserPrompt(previous, inputs, changeDescription)
  );
  const parsed = parseClaudeJSON<unknown>(raw);
  return validateOutputs(parsed);
}

function bucketLabel(
  score: number
): FeasibilityScore["label"] {
  if (score <= 40) return "Overloaded";
  if (score <= 70) return "Ambitious";
  if (score <= 90) return "Solid";
  return "Comfortable";
}

function validateFeasibility(data: unknown): FeasibilityScore | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const score =
    typeof o.score === "number" && !Number.isNaN(o.score)
      ? Math.max(0, Math.min(100, Math.round(o.score)))
      : null;
  if (score === null) return null;
  const summary =
    typeof o.summary === "string" ? o.summary : "Feasibility assessment.";
  return { score, label: bucketLabel(score), summary };
}

export async function fetchFeasibilityScore(
  inputs: IntakeInputs
): Promise<FeasibilityScore | null> {
  const featureLine =
    inputs.featurePrioritization?.trim() ||
    "(Infer likely features from the product idea.)";
  const system = `You assess feasibility for a solo builder. Reply with ONLY JSON: {"score": number 0-100, "label": string, "summary": string}
Label must be exactly one of: "Overloaded", "Ambitious", "Solid", "Comfortable" based on score ranges:
0-40 Overloaded, 41-70 Ambitious, 71-90 Solid, 91-100 Comfortable.
Summary: one sentence, concrete.`;

  const user = `Product idea: ${inputs.productIdea}
Timeline: ${inputs.timeline}
Target audience: ${inputs.targetAudience}
Platform: ${inputs.platform}
Feature / scope notes: ${featureLine}`;

  try {
    const raw = await callClaude(system, user, {
      model: MODEL_HAIKU,
      maxTokens: 300,
      temperature: 0,
    });
    return validateFeasibility(parseClaudeJSON<unknown>(raw));
  } catch {
    return null;
  }
}

function validateAnticipatedFlags(
  data: unknown
): AnticipatedComplexityFlag[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      return {
        phase: typeof r.phase === "string" ? r.phase.trim() : "",
        flag: r.flag === true,
        reason: typeof r.reason === "string" ? r.reason.trim() : "",
      };
    })
    .filter(
      (x): x is AnticipatedComplexityFlag =>
        !!x &&
        x.phase.length > 0 &&
        (!x.flag || x.reason.length > 0)
    );
}

export async function fetchAnticipatedComplexityFlags(
  inputs: IntakeInputs
): Promise<AnticipatedComplexityFlag[]> {
  const system = `You flag solo-builder checklist phases that are often deceptively hard (underestimated effort, tricky edge cases, platform constraints).
Reply with ONLY a JSON array (no wrapper object), e.g.:
[{"phase":"short phase title you expect on a checklist","flag":true,"reason":"why it's tricky for one person"}]
Include 3–8 objects. Use flag true only for genuinely risky areas; you may include flag false for non-risk phases to pad structure if needed.
Phase titles should be short (2–6 words) so they can match real checklist headings later.`;

  const user = `Product idea: ${inputs.productIdea}
Platform: ${inputs.platform}
Timeline: ${inputs.timeline}
Tech / integrations context: ${inputs.techPreferences || "unspecified"} ${inputs.integrations || ""}`;

  try {
    const raw = await callClaude(system, user, {
      model: MODEL_HAIKU,
      maxTokens: 500,
      temperature: 0,
    });
    return validateAnticipatedFlags(parseClaudeJSON<unknown>(raw));
  } catch {
    return [];
  }
}
