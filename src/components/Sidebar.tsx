import Link from "next/link";
import { getCategories, getTechPages } from "@/lib/content";

export default function Sidebar({
  activeTech,
  activeSlug,
}: {
  activeTech?: string;
  activeSlug?: string;
}) {
  const categories = getCategories();

  return (
    <nav className="py-4 pr-2 space-y-4 text-sm">
      {categories.map((cat) => (
        <div key={cat.key}>
          <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
            {cat.label}
          </p>
          <div className="space-y-0.5">
            {cat.techs.map((tech) => {
              const techSlug = tech.slug;
              const pages = getTechPages(techSlug);
              const isActive = activeTech === techSlug;
              return (
                <details key={techSlug} open={isActive}>
                  <summary
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer list-none select-none font-semibold ${
                      isActive
                        ? "bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-ink-100"
                        : "text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800/50"
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ background: tech.color }}
                    />
                    <span className="truncate">{tech.name}</span>
                    <span className="ml-auto text-[10px] font-mono text-ink-400">
                      {pages.filter((p) => p.status === "translated").length}/{pages.length}
                    </span>
                  </summary>
                  <div className="mt-1 ml-3 pl-3 border-l border-ink-100 dark:border-ink-800 space-y-0.5">
                    {pages.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/docs/${techSlug}/${p.slug}`}
                        className={`block px-2.5 py-1.5 rounded-md leading-relaxed ${
                          activeTech === techSlug && activeSlug === p.slug
                            ? "text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-900/20"
                            : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800/50"
                        }`}
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
