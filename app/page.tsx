import { IntakeForm } from "@/components/IntakeForm";
import { SectionCard } from "@/components/shared/SectionCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10 md:px-8">
        <aside className="hidden w-44 shrink-0 flex-col border-r border-white/[0.06] pr-6 pt-4 md:flex">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/90">
            Buddy
          </span>
          <nav className="mt-8 flex flex-col gap-1 text-sm">
            <span className="rounded-lg bg-violet-500/15 px-3 py-2 text-violet-200">
              New plan
            </span>
            <Link
              href="/result"
              className="rounded-lg px-3 py-2 text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
            >
              Results
            </Link>
          </nav>
        </aside>

        <main className="flex-1 pb-20">
          <header className="mb-10">
            <p className="text-xs font-medium uppercase tracking-wider text-violet-300/80">
              Product Buddy
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
              Turn an idea into a solo build plan
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Describe what you want to build. We generate a structured PRD,
              prompts, roadmap, tech stack, starter code, and a phased checklist
              tuned to your timeline.
            </p>
          </header>

          <IntakeForm />

          <SectionCard className="mt-10" title="How it works">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-400">
              <li>Fill the form — tighter timelines narrow scope automatically.</li>
              <li>We call Claude once and parse a typed JSON plan.</li>
              <li>Copy or download Markdown and CSV from the results workspace.</li>
            </ol>
          </SectionCard>
        </main>
      </div>
    </div>
  );
}
