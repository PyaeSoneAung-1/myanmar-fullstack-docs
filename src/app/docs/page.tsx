import Link from "next/link";
import {
  getAllPages,
  getCategories,
  getTechPages,
} from "@/lib/content";

export default function DocsIndex() {
  const categories = getCategories();
  const all = getAllPages();

  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold">Documentation</h1>
      <p className="mt-2 text-ink-600 dark:text-ink-300 leading-relaxed">
        အောက်မှာ ဘာသာပြန်ထားတဲ့ documentation တွေကို နည်းပညာအလိုက် ရွေးဖတ်နိုင်ပါတယ်။
        စုစုပေါင်း {all.length} မျက်နှာ ရှိပြီး၊ ဘာသာပြန်ပြီးသား မျက်နှာတွေကို
        sidebar မှာ progress နဲ့ ပြထားပါတယ်။
      </p>

      <div className="mt-10 space-y-8">
        {categories.map((cat) => (
          <div key={cat.key}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-3">
              {cat.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {cat.techs.map((tech) => {
                const t = tech.slug;
                const pages = getTechPages(t);
                const done = pages.filter((p) => p.status === "translated").length;
                const pct = pages.length ? Math.round((done / pages.length) * 100) : 0;
                return (
                  <Link
                    key={t}
                    href={`/docs/${t}`}
                    className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 hover:border-ink-300 dark:hover:border-ink-600 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: tech.color }}
                      />
                      <h3 className="font-bold">{tech.name}</h3>
                      <span className="ml-auto text-xs text-ink-400 font-mono">
                        {done}/{pages.length}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: tech.color }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
