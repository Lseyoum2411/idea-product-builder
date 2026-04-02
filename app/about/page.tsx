import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { SectionCard } from "@/components/shared/SectionCard";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <LandingNavbar />

      <main className="mx-auto max-w-[680px] px-4 py-12 pb-24 md:px-8 md:py-16">
        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-violet-300/80">
            ProductBuddy
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
            About
          </h1>
        </header>

        <SectionCard title="Why I built this">
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Solo builders burn hours in Notion before they write a line of
              code. The plan drifts from the build: wrong stack guesses, no
              prompts ready for the IDE, checklist living in another tab.
            </p>
            <p>
              ProductBuddy closes that gap by generating a full structured
              output in one pass—scoped to the timeline you actually have—so
              you can paste prompts into Cursor, export a checklist, and share
              a link without maintaining six separate docs.
            </p>
          </div>
        </SectionCard>

        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Key product decisions
          </h2>
          <SectionCard title={undefined}>
            <ul className="space-y-5 text-sm text-zinc-400">
              <li>
                <p className="font-semibold text-zinc-200">
                  One generation call, not chained
                </p>
                <p className="mt-1 leading-relaxed">
                  A single Claude response returning structured JSON keeps
                  latency predictable and avoids compounding errors across six
                  dependent requests.
                </p>
              </li>
              <li>
                <p className="font-semibold text-zinc-200">
                  No login required
                </p>
                <p className="mt-1 leading-relaxed">
                  Friction at the start kills tools for solo builders. Shareable
                  links cover the &quot;come back later&quot; case without
                  forcing accounts.
                </p>
              </li>
              <li>
                <p className="font-semibold text-zinc-200">
                  Checklist over task board
                </p>
                <p className="mt-1 leading-relaxed">
                  One person doesn&apos;t need kanban columns. They need a
                  sequential list they can finish in one sitting.
                </p>
              </li>
            </ul>
          </SectionCard>
        </div>

        <SectionCard className="mt-8" title="What I learned">
          <p className="text-sm leading-relaxed text-zinc-400">
            Getting JSON reliably from the model took more iteration than I
            expected—small prompt changes matter. I was surprised how often the
            checklist surfaced work people forget (auth, edge cases). If I
            redid the first cut, I&apos;d ship the rule-based feasibility score
            earlier so users get immediate feedback before we invest in a second
            model call.
          </p>
        </SectionCard>

        <SectionCard className="mt-8" title="What&apos;s next">
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                Core generation flow (PRD, prompts, roadmap, tech stack, code,
                checklist)
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>Feasibility score</span>
            </li>
            <li className="flex gap-2">
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
              <span>Persistent plans via Supabase (shareable links)</span>
            </li>
            <li className="flex gap-2">
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
              <span>Notion export for checklist</span>
            </li>
            <li className="flex gap-2">
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
              <span>
                AI-powered feasibility scoring (replacing the current rule-based
                version)
              </span>
            </li>
            <li className="flex gap-2">
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
              <span>
                VS Code extension to inject prompts directly into Cursor
              </span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard className="mt-8" title="Built by">
          <p className="text-sm font-medium text-zinc-200">Lucas Seyoum</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <a
              href="https://www.linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              GitHub
            </a>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-600">
            Open to PM roles — I built ProductBuddy to demonstrate product
            thinking, not just coding.
          </p>
        </SectionCard>

        <Link
          href="/"
          className="mt-10 inline-block text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
