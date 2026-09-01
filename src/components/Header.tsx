import Link from "next/link";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 dark:border-ink-800 bg-white/85 dark:bg-ink-950/85 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-[15px] shrink-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-600 text-white text-sm">
            မ
          </span>
          <span lang="my">
            Myanmar <span className="text-brand-600 dark:text-brand-400">Fullstack</span> Docs
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm ml-2">
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">
            Documentation
          </Link>
          <Link href="/roadmap" className="px-3 py-1.5 rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">
            လမ်းပြမြေပုံ
          </Link>
        </nav>
        <div className="flex-1" />
        <div className="w-full max-w-xs">
          <SearchBox />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
