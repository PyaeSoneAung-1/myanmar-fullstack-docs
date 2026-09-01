import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, getTech, getTechPages } from "@/lib/content";
import Markdown from "@/components/Markdown";
import Sidebar from "@/components/Sidebar";

function extractToc(content: string): { id: string; text: string; level: number }[] {
  const items: { id: string; text: string; level: number }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2]
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .trim();
    const id = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-");
    items.push({ id, text, level });
  }
  return items;
}

export async function generateStaticParams() {
  const techs = await import("@/lib/content").then((m) => m.getTechs());
  const params: { tech: string; slug: string }[] = [];
  for (const t of techs) {
    const techSlug = t.slug;
    const pages = getTechPages(techSlug);
    for (const p of pages) params.push({ tech: techSlug, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tech: string; slug: string }>;
}): Promise<Metadata> {
  const { tech, slug } = await params;
  const page = getPage(tech, slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.meta.title,
    description: page.meta.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ tech: string; slug: string }>;
}) {
  const { tech, slug } = await params;
  const page = getPage(tech, slug);
  if (!page) notFound();
  const techMeta = getTech(tech);
  const allPages = getTechPages(tech);
  const idx = allPages.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? allPages[idx - 1] : null;
  const next = idx >= 0 && idx < allPages.length - 1 ? allPages[idx + 1] : null;
  const toc = extractToc(page.content);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)_220px] lg:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <Sidebar activeTech={tech} activeSlug={slug} />
        </aside>

        {/* Article */}
        <article className="min-w-0 py-8">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-3 flex-wrap">
            <Link href="/docs" className="hover:text-brand-600 dark:hover:text-brand-400">
              Documentation
            </Link>
            <span>/</span>
            <Link
              href={`/docs/${tech}`}
              className="hover:text-brand-600 dark:hover:text-brand-400"
            >
              {techMeta?.name ?? tech}
            </Link>
            <span>/</span>
            <span>{page.meta.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {techMeta && (
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ background: techMeta.color }}
              />
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {page.meta.title}
            </h1>
            {page.meta.status === "translated" ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
                ဘာသာပြန်ပြီး
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
            <span>
              နောက်ဆုံးပြင်ဆင်: {page.meta.updated}
            </span>
            {page.meta.source && (
              <a
                href={page.meta.source}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-600 dark:hover:text-brand-400"
              >
                မူရင်း official doc ↗
              </a>
            )}
          </div>

          <div className="mt-8 prose prose-lg max-w-none">
            <Markdown content={page.content} />
          </div>

          {/* Prev / Next */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 border-t border-ink-100 dark:border-ink-800 pt-6">
            {prev ? (
              <Link
                href={`/docs/${tech}/${prev.slug}`}
                className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 hover:border-ink-300 dark:hover:border-ink-600 transition-colors"
              >
                <p className="text-[11px] text-ink-400">← ရှေ့မျက်နှာ</p>
                <p className="mt-1 font-semibold text-sm">{prev.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/docs/${tech}/${next.slug}`}
                className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 text-right hover:border-ink-300 dark:hover:border-ink-600 transition-colors"
              >
                <p className="text-[11px] text-ink-400">နောက်မျက်နှာ →</p>
                <p className="mt-1 font-semibold text-sm">{next.title}</p>
              </Link>
            ) : null}
          </div>
        </article>

        {/* TOC */}
        <aside className="hidden xl:block">
          {toc.length > 0 && (
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-2 text-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-2">
                ဤစာမျက်နှာတွင်
              </p>
              <ul className="space-y-1 border-l border-ink-100 dark:border-ink-800">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className={`block border-l-2 -ml-px leading-relaxed text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 ${
                        t.level === 3 ? "pl-5" : "pl-3"
                      } border-transparent hover:border-brand-400`}
                    >
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
