import { IntakeForm } from "@/components/IntakeForm";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileRouteNav } from "@/components/MobileRouteNav";
import { SectionCard } from "@/components/shared/SectionCard";
import Link from "next/link";

export default function NewPlanPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <MobileRouteNav />
      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10 md:px-8">
        <AppSidebar active="new" />

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

          <Link
            href="/"
            className="mt-8 inline-block text-sm text-zinc-500 hover:text-zinc-300"
          >
            ← Back to home
          </Link>
        </main>
      </div>
    </div>
  );
}
