import type { BuilderOutputs, TabId } from "@/types";

export function computeUpdatedTabs(
  prev: BuilderOutputs,
  next: BuilderOutputs
): TabId[] {
  const tabs: TabId[] = [];
  if (prev.prd !== next.prd) tabs.push("prd");
  if (JSON.stringify(prev.aiPrompts) !== JSON.stringify(next.aiPrompts)) {
    tabs.push("prompts");
  }
  if (JSON.stringify(prev.roadmap) !== JSON.stringify(next.roadmap)) {
    tabs.push("roadmap");
  }
  if (prev.techStack !== next.techStack) tabs.push("tech");
  if (
    JSON.stringify(prev.codeSnippets) !== JSON.stringify(next.codeSnippets)
  ) {
    tabs.push("code");
  }
  if (
    JSON.stringify(prev.soloChecklist) !== JSON.stringify(next.soloChecklist)
  ) {
    tabs.push("checklist");
  }
  return tabs;
}
