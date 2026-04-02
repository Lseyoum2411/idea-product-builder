import { ResultWorkspace } from "@/components/ResultWorkspace";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileRouteNav } from "@/components/MobileRouteNav";

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]">
      <MobileRouteNav />
      <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-4 py-10 md:px-8">
        <AppSidebar active="result" />
        <main className="flex-1">
          <ResultWorkspace />
        </main>
      </div>
    </div>
  );
}
