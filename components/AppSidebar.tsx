import Link from "next/link";
import clsx from "clsx";

export type SidebarActive = "new" | "result" | "about" | "none";

export function AppSidebar({ active }: { active: SidebarActive }) {
  return (
    <aside className="hidden w-44 shrink-0 flex-col border-r border-white/[0.06] pr-6 pt-4 md:flex">
      <Link
        href="/"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/90 transition hover:text-violet-300"
      >
        BUDDY
      </Link>
      <nav className="mt-8 flex flex-col gap-1 text-sm">
        <Link
          href="/new"
          className={clsx(
            "rounded-lg px-3 py-2 transition",
            active === "new"
              ? "bg-violet-500/15 text-violet-200"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
          )}
        >
          New plan
        </Link>
        <Link
          href="/result"
          className={clsx(
            "rounded-lg px-3 py-2 transition",
            active === "result"
              ? "bg-violet-500/15 text-violet-200"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
          )}
        >
          Results
        </Link>
      </nav>
      <div className="mt-6 border-t border-white/[0.06] pt-6">
        <Link
          href="/about"
          className={clsx(
            "block rounded-lg px-3 py-2 text-sm transition",
            active === "about"
              ? "bg-violet-500/15 text-violet-200"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
          )}
        >
          About
        </Link>
      </div>
    </aside>
  );
}
