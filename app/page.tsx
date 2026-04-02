import Link from "next/link";
import { LandingHeroCta } from "@/components/LandingHeroCta";
import { LandingNavbar } from "@/components/LandingNavbar";
import { SectionCard } from "@/components/shared/SectionCard";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <LandingNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8 md:pt-16">
        <section className="text-center">
          <h1 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl lg:text-5xl">
            Turn any app idea into a build plan in 60 seconds
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
            ProductBuddy generates a PRD, AI prompts, roadmap, tech stack, and
            phased checklist — scoped to your timeline. Built for solo builders.
          </p>
          <LandingHeroCta />
          <p className="mt-4 text-xs text-zinc-600">
            Free forever · No account needed · Powered by Claude
          </p>
        </section>

        <section className="mt-20 md:mt-24">
          <h2 className="text-center text-lg font-semibold text-zinc-100 md:text-xl">
            Here&apos;s what you get
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <SectionCard className="flex flex-col" title={undefined}>
              <div className="mb-3 inline-flex w-fit rounded-lg bg-violet-500/15 px-3 py-2 text-left text-sm font-medium text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.12)]">
                PRD
              </div>
              <p className="line-clamp-6 text-left text-xs leading-relaxed text-zinc-400">
                <strong className="text-zinc-300">Virtual try-on MVP</strong> —
                Overview: Let shoppers preview apparel on a photo of themselves
                before checkout. Goals: reduce returns, lift conversion on PDP.
                Scope: single garment overlay, mobile web, guest checkout…
              </p>
            </SectionCard>
            <SectionCard className="flex flex-col" title={undefined}>
              <div className="mb-3 inline-flex w-fit rounded-lg bg-violet-500/15 px-3 py-2 text-left text-sm font-medium text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.12)]">
                Roadmap
              </div>
              <p className="line-clamp-6 text-left text-xs leading-relaxed text-zinc-400">
                <strong className="text-zinc-300">Week 1:</strong> Image upload +
                basic overlay prototype.
                <br />
                <strong className="text-zinc-300">Week 2:</strong> PDP widget +
                session persistence.
                <br />
                <strong className="text-zinc-300">Week 3–4:</strong> Lighting
                presets, share link, analytics…
              </p>
            </SectionCard>
            <SectionCard className="flex flex-col" title={undefined}>
              <div className="mb-3 inline-flex w-fit rounded-lg bg-violet-500/15 px-3 py-2 text-left text-sm font-medium text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.12)]">
                Checklist
              </div>
              <p className="line-clamp-6 text-left text-xs leading-relaxed text-zinc-400">
                ○ Define overlay coordinate model
                <br />
                ○ Integrate segmentation API
                <br />
                ○ Build try-on canvas component
                <br />
                ○ Mobile gesture tests
                <br />○ …
              </p>
            </SectionCard>
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Plus AI prompts, tech stack recommendations, and starter code
          </p>
        </section>

        <section
          id="how-it-works"
          className="mt-20 scroll-mt-24 md:mt-28"
        >
          <h2 className="text-center text-lg font-semibold text-zinc-100 md:text-xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Describe your idea",
                d: "Your timeline, platform, and what you're building",
              },
              {
                n: "2",
                t: "We generate your plan",
                d: "Claude produces 6 structured outputs in one call",
              },
              {
                n: "3",
                t: "Start building",
                d: "Copy prompts into Cursor, export checklist, share your plan",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-500/35 bg-violet-500/15 text-sm font-semibold text-violet-200">
                  {s.n}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-zinc-100">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>ProductBuddy — built by Lucas Seyoum</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              GitHub
            </a>
            <Link href="/about" className="text-violet-400 hover:text-violet-300">
              About
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-6xl text-center text-xs text-zinc-600 sm:text-left">
          Built with Next.js and Claude API
        </p>
      </footer>
    </div>
  );
}
