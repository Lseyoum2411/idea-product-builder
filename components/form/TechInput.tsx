"use client";

import { FieldLabel } from "@/components/shared/FieldLabel";

export function TechInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel>Tech preferences</FieldLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. TypeScript, Next.js, Postgres"
        className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
      />
    </div>
  );
}
