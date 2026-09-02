# Myanmar Fullstack Docs 🇲🇲

Fullstack JavaScript documentation တွေကို မြန်မာလို ဘာသာပြန်တင်ဆက်တဲ့ docs site တစ်ခုပါ။
All content is translated from the **official documentation** of each project.

## ပါဝင်တဲ့ နည်းပညာများ

| Category | Techs |
|---|---|
| Frontend | React, Next.js, TypeScript |
| Backend | Node.js, Express, PostgreSQL, Prisma ORM |
| Data & State | useSWR, TanStack Query, Zustand |
| Tooling | Postman |

## Tech Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4** — dark mode, Burmese-friendly typography
- **react-markdown** — content rendering (remark-gfm, rehype-slug)
- **minisearch** — client-side full-text search (Ctrl+K)
- Content: plain Markdown + frontmatter in `content/<tech>/`

## Project Structure

```
content/<tech>/_meta.json    # tech metadata (name, color, official URL, slug)
content/<tech>/<slug>.md     # Burmese pages (frontmatter: title/order/source/status)
scripts/sources.json         # official-doc source registry (GitHub repos)
scripts/translate.mjs        # translation pipeline (fetch → chunk → LLM → write)
scripts/build-search-index.mjs  # generates public/search-index.json
src/lib/content.ts           # content loading (fs + gray-matter)
```

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (regenerates search index)
```

## ဘာသာပြန် ဘယ်လို ထပ်ဖြည့်မလဲ

### ကိုယ်တိုင် ရေးတာ
`content/<tech>/` ထဲမှာ markdown file အသစ်တစ်ခု ဖန်တီးပြီး frontmatter
(`title`, `order`, `source`, `status: translated`, `updated`) ထည့်ပါ။
စည်းမျဉ်းတွေကို `../content-drafts/STYLE.md` မှာ ဖတ်ပါ။

### Pipeline နဲ့ အလိုအလျောက်
```bash
export LLM_API_KEY=sk-...          # required
node scripts/translate.mjs --tech zustand          # one tech
node scripts/translate.mjs --limit 10              # first 10 pages of each tech
node scripts/translate.mjs --dry-run               # inspect without translating
node scripts/translate.mjs --stub                  # mechanics test, no key needed
```

Pipeline က official docs (GitHub) ကနေ ဆွဲပြီး chunk ဖြတ်ပြီး LLM နဲ့ မြန်မာလို
ပြန်ဆိုပါတယ်။ `scripts/progress.json` မှာ progress ခြေရာခံပြီး — ပြီးပြီးသားဟာတွေ
ပြန်မလုပ်ပါဘူး။

## Status

- ✅ **555 pages ဘာသာပြန်ပြီး** (wave 12, 2026-09-02: +35) — React react-dom/static (prerender APIs) + Children/Fragment/ViewTransition (115/120)၊ Next.js components (link/script/form/font) + Route Segment Config (73/300)၊ Postman API specifications + monitoring + sandbox reference (74/150)၊ TanStack Query plugins (63/100)
- 🔄 ကျန် ~1,165 pages (official docs စုစုပေါင်း ခန့်မှန်းချက်) — `/roadmap` page မှာ
  progress ကြည့်ပါ။ `scripts/backlog.md` ကိုလည်း ဖတ်ပါ။

## License Note

ဘာသာပြန်ထားတဲ့ content တွေက open-source projects တွေရဲ့ official docs ကို
အခြေခံပါတယ် (React: CC-BY-4.0, Express: CC-BY-SA-3.0, အခြားဟာတွေ MIT/Apache-2.0) —
သက်ဆိုင်ရာ license တွေကို လေးစားပါ။
