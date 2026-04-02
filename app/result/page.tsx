import { ResultWorkspace } from "@/components/ResultWorkspace";
import Link from "next/link";

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10 md:px-8">
        <aside className="hidden w-44 shrink-0 flex-col border-r border-white/[0.06] pr-6 pt-4 md:flex">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/90">
            Buddy
          </span>
          <nav className="mt-8 flex flex-col gap-1 text-sm">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
            >
              New plan
            </Link>
            <span className="rounded-lg bg-violet-500/15 px-3 py-2 text-violet-200">
              Results
            </span>
          </nav>
        </aside>
        <main className="flex-1">
          <ResultWorkspace />
        </main>
      </div>
    </div>
  );
}
