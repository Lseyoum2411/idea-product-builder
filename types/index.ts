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

/** Stored in Supabase `outputs` JSON column */
export interface FeasibilityScore {
  score: number;
  label: "Overloaded" | "Ambitious" | "Solid" | "Comfortable";
  summary: string;
}

export interface AnticipatedComplexityFlag {
  phase: string;
  flag: boolean;
  reason: string;
}

export interface PersistedPlanOutputs {
  builder: BuilderOutputs;
  feasibility: FeasibilityScore | null;
  /** Per checklist phase title */
  complexityByPhase: Record<string, PhaseComplexityDisplay>;
}

export interface PhaseComplexityDisplay {
  flagged: boolean;
  reason?: string;
}

export type TabId =
  | "prd"
  | "prompts"
  | "roadmap"
  | "tech"
  | "code"
  | "checklist";

export interface ResultSessionPayload {
  outputs: BuilderOutputs;
  inputs: IntakeInputs;
  slug?: string;
  shareUrl?: string;
  feasibility?: FeasibilityScore | null;
  complexityByPhase?: Record<string, PhaseComplexityDisplay>;
  updatedTabs?: TabId[];
}
