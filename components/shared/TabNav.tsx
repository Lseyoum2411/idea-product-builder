"use client";

import clsx from "clsx";
import type { TabId } from "@/types";

export type { TabId };

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
  updatedTabs = [],
}: {
  active: TabId;
  onChange: (id: TabId) => void;
  updatedTabs?: TabId[];
}) {
  const updated = new Set(updatedTabs);
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
            updated.has(t.id) && "border-l-2 border-amber-500/70 pl-[10px]",
            active === t.id
              ? "bg-violet-500/15 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.12)]"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
          )}
        >
          <span className="flex items-center gap-2">
            {t.label}
            {updated.has(t.id) ? (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
                Updated
              </span>
            ) : null}
          </span>
        </button>
      ))}
    </nav>
  );
}
