import type { BuilderOutputs, SoloChecklistPhase } from "@/types";

export function buildPRDMarkdown(prd: string): string {
  return `# Product requirements\n\n${prd.trim()}\n`;
}

export function buildRoadmapMarkdown(
  roadmap: BuilderOutputs["roadmap"]
): string {
  const lines = roadmap.map((r, i) => {
    const tf = r.timeframe ? ` _(${r.timeframe})_` : "";
    return `## ${i + 1}. ${r.title}${tf}\n\n${r.description}\n`;
  });
  return `# Roadmap\n\n${lines.join("\n")}`;
}

export function buildTechStackMarkdown(techStack: string): string {
  return `# Tech stack\n\n${techStack.trim()}\n`;
}

export function buildChecklistMarkdown(
  soloChecklist: SoloChecklistPhase[]
): string {
  const parts = soloChecklist.map((p) => {
    const tasks = p.tasks.map((t) => `- [ ] ${t}`).join("\n");
    return `## ${p.phase} _(~${p.estimatedHours}h)_\n\n${tasks}\n`;
  });
  return `# Solo build checklist\n\n${parts.join("\n")}`;
}

export function buildPromptsMarkdown(
  prompts: BuilderOutputs["aiPrompts"]
): string {
  const parts = prompts.map(
    (p, i) => `## ${i + 1}. ${p.title}\n\n\`\`\`\n${p.prompt}\n\`\`\`\n`
  );
  return `# AI prompts\n\n${parts.join("\n")}`;
}

export function buildCodeMarkdown(
  snippets: BuilderOutputs["codeSnippets"]
): string {
  const parts = snippets.map(
    (s) => `## ${s.title}\n\n\`\`\`${s.language}\n${s.code}\n\`\`\`\n`
  );
  return `# Code snippets\n\n${parts.join("\n")}`;
}

export function buildFullPlanMarkdown(outputs: BuilderOutputs): string {
  return [
    "# Product Buddy — full build plan\n",
    buildPRDMarkdown(outputs.prd),
    "\n",
    buildRoadmapMarkdown(outputs.roadmap),
    "\n",
    buildTechStackMarkdown(outputs.techStack),
    "\n",
    buildPromptsMarkdown(outputs.aiPrompts),
    "\n",
    buildCodeMarkdown(outputs.codeSnippets),
    "\n",
    buildChecklistMarkdown(outputs.soloChecklist),
  ].join("\n");
}

export function exportTasksCSV(checklist: SoloChecklistPhase[]): string {
  const rows = [["phase", "task", "estimated_hours_phase"]];
  for (const p of checklist) {
    for (const t of p.tasks) {
      rows.push([p.phase, t, String(p.estimatedHours)]);
    }
  }
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const s = cell.replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(",")
    )
    .join("\n");
}
