import Link from "next/link";

/** Shown below `md` when the desktop sidebar is hidden. */
export function MobileRouteNav() {
  return (
    <nav
      className="flex flex-wrap justify-center gap-4 border-b border-white/[0.06] bg-zinc-950/90 px-4 py-2.5 text-xs font-medium text-zinc-400 backdrop-blur md:hidden"
      aria-label="Main"
    >
      <Link href="/" className="hover:text-zinc-100">
        Home
      </Link>
      <Link href="/new" className="hover:text-zinc-100">
        New
      </Link>
      <Link href="/result" className="hover:text-zinc-100">
        Results
      </Link>
      <Link href="/about" className="hover:text-zinc-100">
        About
      </Link>
    </nav>
  );
}
