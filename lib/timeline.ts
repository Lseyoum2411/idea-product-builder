const TIMELINE_WEEKS: Record<string, number> = {
  "1-week": 1,
  "2-weeks": 2,
  "1-month": 4,
  "3-months": 12,
  "6-months": 24,
};

export function getSprintDuration(timeline: string): number {
  const weeks = TIMELINE_WEEKS[timeline] ?? 4;
  if (weeks <= 2) return 1;
  if (weeks <= 8) return 2;
  return 3;
}

export function getSprintCount(timeline: string): number {
  const weeks = TIMELINE_WEEKS[timeline] ?? 4;
  const sprintWeeks = getSprintDuration(timeline);
  return Math.max(1, Math.ceil(weeks / sprintWeeks));
}

export function getTimelineContext(timeline: string): string {
  const weeks = TIMELINE_WEEKS[timeline] ?? 4;
  const sprints = getSprintCount(timeline);
  const sprintLen = getSprintDuration(timeline);

  if (weeks <= 1) {
    return `Timeline is very tight (~1 week). Ruthlessly prioritize a tiny MVP: one core user job, minimal surface area, and a checklist under ~25 total hours where possible. Defer nice-to-haves.`;
  }
  if (weeks <= 2) {
    return `Timeline is ~2 weeks. Focus on a small MVP with clear scope boundaries; ${sprints} sprint(s) of ~${sprintLen} week(s) each.`;
  }
  if (weeks <= 4) {
    return `Timeline is about a month. Plan ${sprints} sprint(s) (~${sprintLen} weeks each) with incremental releases.`;
  }
  return `Timeline spans ~${weeks} weeks. Use ${sprints} sprint(s) (~${sprintLen} weeks each); allow for polish, testing, and iteration.`;
}

export function trimFeaturesForTimeline(
  timeline: string,
  features: string[]
): string[] {
  const weeks = TIMELINE_WEEKS[timeline] ?? 4;
  const cap = weeks <= 1 ? 3 : weeks <= 2 ? 5 : weeks <= 4 ? 8 : 12;
  return features.slice(0, cap);
}
