import Link from "next/link";
import { notFound } from "next/navigation";
import { getTech, getTechPages } from "@/lib/content";

export default async function TechPage({
  params,
}: {
  params: Promise<{ tech: string }>;
}) {
  const { tech } = await params;
  const meta = getTech(tech);
  if (!meta) notFound();

  const pages = getTechPages(tech);
  const done = pages.filter((p) => p.status === "translated").length;

  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3">
        <span
          className="inline-block w-4 h-4 rounded-full"
          style={{ background: meta.color }}
        />
        <h1 className="text-3xl font-extrabold">{meta.name}</h1>
        <a
          href={meta.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          Official docs ↗
        </a>
      </div>
      <p className="mt-3 text-ink-600 dark:text-ink-300 leading-relaxed max-w-2xl">
        {meta.tagline}
      </p>
      <p className="mt-2 text-xs text-ink-400">
        ဘာသာပြန်ပြီး {done} / {pages.length} မျက်နှာ
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={`/docs/${tech}/${p.slug}`}
            className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 hover:border-ink-300 dark:hover:border-ink-600 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{p.title}</h3>
              {p.status === "translated" ? (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  ပြီး
                </span>
              ) : (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-500 font-semibold">
                  မပြီးသေး
                </span>
              )}
            </div>
            {p.description && (
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                {p.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
