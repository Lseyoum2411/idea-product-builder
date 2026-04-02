"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";

export function LandingNavbar() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-2 px-4 py-4 md:px-8">
        <Link
          href="/"
          className="justify-self-start text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/90 transition hover:text-violet-300"
        >
          BUDDY
        </Link>
        <a
          href="/#how-it-works"
          className="justify-self-center text-center text-sm text-zinc-400 transition hover:text-zinc-200"
        >
          How it works
        </a>
        <div className="justify-self-end">
          <Button
            type="button"
            variant="primary"
            className="shrink-0 text-sm"
            onClick={() => router.push("/new")}
          >
            Build my plan →
          </Button>
        </div>
      </div>
    </header>
  );
}
