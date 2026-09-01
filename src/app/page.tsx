import Link from "next/link";
import { getAllPages, getCategories } from "@/lib/content";

export default function Home() {
  const categories = getCategories();
  const allPages = getAllPages();
  const done = allPages.filter((p) => p.status === "translated").length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-brand-900/20 dark:via-ink-950 dark:to-ink-950" />
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
            🇲🇲 မြန်မာလို Fullstack JavaScript Documentation
          </p>
          <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight leading-snug">
            Official Docs တွေကို
            <br />
            <span className="text-brand-600 dark:text-brand-400">
              မြန်မာဘာသာဖြင့်
            </span>{" "}
            လေ့လာပါ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-loose">
            React, Next.js, Node.js, Express, PostgreSQL, Prisma, TypeScript, useSWR,
            TanStack Query, Zustand, Postman — နည်းပညာအပြည့်အစုံရဲ့ official
            documentation ကို မြန်မာလို ဘာသာပြန်ထားပါတယ်။ Code example တွေက
            မူရင်းအတိုင်းပါ။
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 font-semibold shadow-sm transition-colors"
            >
              Documentation ဖတ်မယ် →
            </Link>
            <Link
              href="/roadmap"
              className="rounded-xl border border-ink-200 dark:border-ink-700 px-6 py-3 font-semibold hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
            >
              လမ်းပြမြေပုံ
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-ink-500 dark:text-ink-400">
            <span>
              <strong className="text-ink-900 dark:text-ink-100">{allPages.length}</strong> မျက်နှာများ
            </span>
            <span className="w-px h-4 bg-ink-200 dark:bg-ink-700 hidden sm:block" />
            <span>
              <strong className="text-ink-900 dark:text-ink-100">{done}</strong> ဘာသာပြန်ပြီး
            </span>
            <span className="w-px h-4 bg-ink-200 dark:bg-ink-700 hidden sm:block" />
            <span>
              <strong className="text-ink-900 dark:text-ink-100">{categories.length}</strong> အမျိုးအစား
            </span>
          </div>
        </div>
      </section>

      {/* Tech grid */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 pb-20 space-y-10">
        {categories.map((cat) => (
          <div key={cat.key}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-4">
              {cat.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.techs.map((tech) => {
                const t = tech.slug;
                return (
                  <Link
                    key={t}
                    href={`/docs/${t}`}
                    className="group rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 hover:border-ink-300 dark:hover:border-ink-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ background: tech.color }}
                      />
                      <h3 className="font-bold text-lg">{tech.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                      {tech.tagline}
                    </p>
                    <p className="mt-3 text-xs text-brand-600 dark:text-brand-400 font-semibold group-hover:underline">
                      ဖတ်ရန် →
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
