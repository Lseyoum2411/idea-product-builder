import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileRouteNav } from "@/components/MobileRouteNav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <MobileRouteNav />
      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10 md:px-8">
        <AppSidebar active="none" />
        <main className="flex-1">
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-8">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">
              This plan doesn&apos;t exist
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              The link may have expired or the plan was never saved.
            </p>
            <Link
              href="/new"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/40 transition hover:from-violet-500 hover:to-indigo-500"
            >
              Start a new plan →
            </Link>
            <p className="mt-6 text-xs text-zinc-600">
              Plans are currently session-only. Persistent storage coming soon.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
