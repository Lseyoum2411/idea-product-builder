import { notFound } from "next/navigation";
import { ResultWorkspace } from "@/components/ResultWorkspace";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileRouteNav } from "@/components/MobileRouteNav";
import { getAppBaseUrl } from "@/lib/appUrl";
import { fetchPlanBySlug, isSupabaseConfigured } from "@/lib/supabase";
import type { PersistedPlanOutputs, ResultSessionPayload } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export default async function SharedPlanPage({ params }: Props) {
  const { slug } = await params;
  if (!slug || !/^[0-9a-z]{8}$/.test(slug)) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const row = await fetchPlanBySlug(slug);
  if (!row) {
    notFound();
  }

  const blob = row.outputs as PersistedPlanOutputs;
  if (!blob?.builder) {
    notFound();
  }

  const base = getAppBaseUrl();
  const initialSession: ResultSessionPayload = {
    outputs: blob.builder,
    inputs: row.inputs,
    slug: row.slug,
    shareUrl: `${base}/plan/${row.slug}`,
    feasibility: blob.feasibility,
    complexityByPhase: blob.complexityByPhase ?? {},
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <MobileRouteNav />
      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10 md:px-8">
        <AppSidebar active="none" />
        <main className="flex-1">
          <p className="mb-4 text-xs text-zinc-500">
            Shared plan · anyone with this link can view
          </p>
          <ResultWorkspace initialSession={initialSession} readOnly />
        </main>
      </div>
    </div>
  );
}
