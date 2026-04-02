export interface SoloChecklistPhase {
  phase: string;
  tasks: string[];
  estimatedHours: number;
}

export interface AIPromptItem {
  title: string;
  prompt: string;
}

export interface RoadmapItem {
  title: string;
  description: string;
  timeframe?: string;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface BuilderOutputs {
  prd: string;
  aiPrompts: AIPromptItem[];
  roadmap: RoadmapItem[];
  techStack: string;
  codeSnippets: CodeSnippet[];
  soloChecklist: SoloChecklistPhase[];
}

export interface IntakeInputs {
  productIdea: string;
  timeline: string;
  platform: string;
  targetAudience: string;
  techPreferences?: string;
  designStyle?: string;
  featurePrioritization?: string;
  integrations?: string;
}
