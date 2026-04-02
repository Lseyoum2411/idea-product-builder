"use client";

import clsx from "clsx";

export type TabId =
  | "prd"
  | "prompts"
  | "roadmap"
  | "tech"
  | "code"
  | "checklist";

const TABS: { id: TabId; label: string }[] = [
  { id: "prd", label: "PRD" },
  { id: "prompts", label: "AI prompts" },
  { id: "roadmap", label: "Roadmap" },
  { id: "tech", label: "Tech stack" },
  { id: "code", label: "Code" },
  { id: "checklist", label: "Checklist" },
];

export function TabNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <nav
      className="flex flex-col gap-1 border-r border-white/[0.06] pr-4"
      aria-label="Result sections"
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={clsx(
            "rounded-lg px-3 py-2 text-left text-sm font-medium transition",
            active === t.id
              ? "bg-violet-500/15 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.12)]"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
          )}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
