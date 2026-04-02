import type { IntakeInputs } from "@/types";

export type RuleFeasibilityLabel = "Solid Plan" | "Ambitious" | "Overloaded";

export type RuleFeasibilityResult = {
  score: number;
  label: RuleFeasibilityLabel;
  tip: string;
};

/** Client-side feasibility per product spec (not AI). */
export function computeRuleBasedFeasibility(
  inputs: IntakeInputs
): RuleFeasibilityResult {
  let score = 75;

  switch (inputs.timeline) {
    case "1-week":
      score -= 20;
      break;
    case "2-weeks":
    case "1-month":
      score -= 5;
      break;
    case "3-months":
    case "6-months":
      score += 10;
      break;
    default:
      score -= 5;
  }

  switch (inputs.platform) {
    case "mobile":
      score -= 8;
      break;
    case "hybrid":
      score -= 5;
      break;
    default:
      break;
  }

  if (inputs.integrations?.trim()) {
    score -= 10;
  }
  if (inputs.techPreferences?.trim()) {
    score += 5;
  }

  score = Math.max(15, Math.min(95, Math.round(score)));

  let label: RuleFeasibilityLabel;
  let tip: string;
  if (score >= 70) {
    label = "Solid Plan";
    tip = "Your scope fits the timeline well.";
  } else if (score >= 50) {
    label = "Ambitious";
    tip = "Consider cutting one feature to reduce launch risk.";
  } else {
    label = "Overloaded";
    tip =
      "Scope is likely too large for one person in this timeline. Cut to 2-3 core features.";
  }

  return { score, label, tip };
}
