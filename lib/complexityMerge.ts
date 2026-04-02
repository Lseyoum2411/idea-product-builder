import type {
  AnticipatedComplexityFlag,
  PhaseComplexityDisplay,
  SoloChecklistPhase,
} from "@/types";

function normalizePhase(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokens(s: string): Set<string> {
  return new Set(normalizePhase(s).split(" ").filter(Boolean));
}

function overlapScore(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  ta.forEach((x) => {
    if (tb.has(x)) inter++;
  });
  return inter / Math.min(ta.size, tb.size);
}

function phraseMatch(phaseTitle: string, hint: string): boolean {
  const p = normalizePhase(phaseTitle);
  const h = normalizePhase(hint);
  if (!h || !p) return false;
  if (p.includes(h) || h.includes(p)) return true;
  return overlapScore(phaseTitle, hint) >= 0.35;
}

/** Map anticipated Haiku flags onto actual checklist phase titles. */
export function mergeAnticipatedComplexity(
  checklist: SoloChecklistPhase[],
  anticipated: AnticipatedComplexityFlag[]
): Record<string, PhaseComplexityDisplay> {
  const result: Record<string, PhaseComplexityDisplay> = {};
  const flagged = anticipated.filter((a) => a.flag && a.reason?.trim());

  for (const phase of checklist) {
    result[phase.phase] = { flagged: false };
    for (const a of flagged) {
      if (phraseMatch(phase.phase, a.phase)) {
        result[phase.phase] = { flagged: true, reason: a.reason };
        break;
      }
    }
  }
  return result;
}
