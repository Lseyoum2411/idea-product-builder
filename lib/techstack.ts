export function getTechStackContext(
  platform: string,
  techPreferences?: string,
  integrations?: string
): string {
  const base: Record<string, string> = {
    web: "Web app: prefer modern SSR-friendly stacks (e.g. Next.js, React), accessible UI, and pragmatic hosting.",
    mobile: "Mobile: clarify native vs cross-platform (React Native, Flutter); consider app store constraints and offline needs.",
    desktop: "Desktop: consider Electron, Tauri, or native; distribution and auto-update matter.",
    api: "API/backend-first: REST or GraphQL, auth, observability, and versioning.",
    hybrid: "Hybrid: align web + mobile code sharing vs separate optimized clients.",
  };

  const platformHint = base[platform] ?? base.web;
  const prefs = techPreferences?.trim()
    ? `User tech preferences: ${techPreferences.trim()}`
    : "No explicit tech preferences — suggest a sensible default stack for a solo builder.";
  const integ = integrations?.trim()
    ? `Integrations to account for: ${integrations.trim()}`
    : "No integrations specified — mention common options only if they fit the idea.";

  return `${platformHint}\n${prefs}\n${integ}`;
}
