import {
  countTranslated,
  getAllPages,
  getTech,
  getTechPages,
} from "@/lib/content";

// Estimated official-doc page counts (guides + core reference).
// Sources: official docs sites of each project, rough manual count.
const ESTIMATES: Record<string, { total: number; note: string }> = {
  react: { total: 120, note: "Learn + Reference အားလုံး" },
  nextjs: { total: 300, note: "App Router guides + API reference" },
  typescript: { total: 100, note: "Handbook + Tutorials" },
  nodejs: { total: 180, note: "Guides + core API digest" },
  express: { total: 30, note: "Getting started → advanced topics" },
  postgresql: { total: 500, note: "Tutorial + core chapters (full docs ~3000 pages)" },
  prisma: { total: 200, note: "Concepts + guides + reference" },
  swr: { total: 25, note: "Full docs site" },
  "tanstack-query": { total: 100, note: "Overview + guides + API" },
  zustand: { total: 15, note: "Full docs site" },
  postman: { total: 150, note: "Learning Center: getting started + API dev" },
};

export default function Roadmap() {
  const all = getAllPages();
  const done = all.filter((p) => p.status === "translated").length;

  const rows = Object.entries(ESTIMATES)
    .map(([tech, est]) => {
      const meta = getTech(tech);
      const pages = getTechPages(tech);
      const translated = pages.filter((p) => p.status === "translated").length;
      return {
        tech,
        name: meta?.name ?? tech,
        color: meta?.color ?? "#888",
        current: translated,
        estimate: est.total,
        note: est.note,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-[1000px] px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold">လမ်းပြမြေပုံ (Roadmap)</h1>
      <p className="mt-3 text-ink-600 dark:text-ink-300 leading-loose">
        ဒီ project ရဲ့ ရည်မှန်းချက်က — နည်းပညာ တစ်ခုချင်းစီရဲ့ official documentation
        ကို <strong>တစ်မျက်နှာမကျန်</strong> မြန်မာလို ဘာသာပြန်ဖို့ပါ။
        အောက်မှာ ခန့်မှန်း မျက်နှာရေနဲ့ လက်ရှိ progress ကို တွေ့နိုင်ပါတယ်။
      </p>

      <div className="mt-8 rounded-2xl border border-ink-100 dark:border-ink-800 p-6">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-ink-400 text-xs">စုစုပေါင်း ခန့်မှန်း</p>
            <p className="text-2xl font-extrabold">
              {Object.values(ESTIMATES).reduce((a, b) => a + b.total, 0).toLocaleString()}{" "}
              <span className="text-sm font-normal text-ink-400">မျက်နှာ</span>
            </p>
          </div>
          <div>
            <p className="text-ink-400 text-xs">ဘာသာပြန်ပြီး</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {done} <span className="text-sm font-normal text-ink-400">မျက်နှာ</span>
            </p>
          </div>
          <div>
            <p className="text-ink-400 text-xs">ကျန်သေး</p>
            <p className="text-2xl font-extrabold">
              {(Object.values(ESTIMATES).reduce((a, b) => a + b.total, 0) - done).toLocaleString()}{" "}
              <span className="text-sm font-normal text-ink-400">မျက်နှာ</span>
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">နည်းပညာအလိုက် Progress</h2>
      <div className="mt-4 rounded-2xl border border-ink-100 dark:border-ink-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-50 dark:bg-ink-800/50 text-left">
              <th className="px-4 py-2.5 font-semibold">နည်းပညာ</th>
              <th className="px-4 py-2.5 font-semibold w-48">Progress</th>
              <th className="px-4 py-2.5 font-semibold">မှတ်ချက်</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const pct = Math.round((r.current / r.estimate) * 100);
              return (
                <tr key={r.tech} className="border-t border-ink-100 dark:border-ink-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: r.color }} />
                      {r.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: r.color }} />
                      </div>
                      <span className="text-xs font-mono text-ink-400 whitespace-nowrap">
                        {r.current}/{r.estimate}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500 dark:text-ink-400">{r.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">ဘယ်လို ဆက်လုပ်မလဲ</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-ink-100 dark:border-ink-800 p-5">
          <h3 className="font-bold">1. Translation Pipeline</h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            <code className="font-mono text-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">scripts/translate.mjs</code>{" "}
            က official docs (GitHub sources) တွေကို ဆွဲပြီး၊ chunk ဖြတ်ပြီး LLM
            နဲ့ မြန်မာလို ပြန်ဆိုပါတယ်။ Progress manifest နဲ့ တစ်မျက်နှာချင်း
            ခြေရာခံပါတယ်။
          </p>
        </div>
        <div className="rounded-xl border border-ink-100 dark:border-ink-800 p-5">
          <h3 className="font-bold">2. ဦးစားပေး အစီအစဉ်</h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            သေးငယ်တဲ့ library တွေ (Zustand, SWR, Express) ကို အရင်ပြီးအောင် လုပ်ပြီး
            နောက် Prisma, TanStack Query, ပြီးမှ React / Next.js / PostgreSQL
            စတဲ့ ကြီးတဲ့ဟာတွေ ဆက်ပါမယ်။
          </p>
        </div>
      </div>
    </div>
  );
}
