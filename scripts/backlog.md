# Translation Backlog — တစ်ခုမကျန် ဘာသာပြန်ဖို့ Queue

Official docs အကုန်လုံးကို မြန်မာလို ဘာသာပြန်ဖို့အတွက် tracking file ပါ။
Status: `[x]` done / `[~]` in-progress / `[ ]` todo
(စာမျက်နှာရေတွေက official docs အရွယ်အစားအလိုက် ခန့်မှန်းချက်ပါ)

## React (react.dev/learn) — ~120 pages — 6 done
- [x] getting-started — React မိတ်ဆက်
- [x] describing-ui — UI ဖော်ပြခြင်း (components, JSX)
- [x] props — Props ပေးပို့ခြင်း
- [x] events — Event handler များ
- [x] state-snapshot — State နဲ့ Rendering
- [x] thinking-in-react — React အတွေးအခေါ်
- [ ] managing-state — State စီမံခန့်ခွဲခြင်း (useState deep, lifting)
- [ ] ... (learn section ကျန် + reference)

## Next.js (nextjs.org/docs) — ~300 pages — 6 done
- [x] getting-started — Next.js စတင်ခြင်း
- [x] pages-layouts — Pages & Layouts
- [x] dynamic-routes — Dynamic Routes
- [x] linking — Linking & Navigation
- [x] data-fetching — Data Fetching
- [x] route-handlers — Route Handlers (API)
- [ ] rendering — Rendering (SSR/SSG/CSR deep)
- [ ] ... (guides ကျန် + API reference)

## Node.js (nodejs.org/en/learn) — ~180 pages — 1 done
- [x] getting-started — Node.js မိတ်ဆက်
- [ ] modules — Modules အခြေခံ
- [ ] event-loop — Event Loop
- [ ] async — Async programming (callbacks/promises/async-await)
- [ ] npm-basics — npm အခြေခံ
- [ ] file-system — File system
- [ ] ... (learn guides ကျန်)

## Express (expressjs.com) — ~30 pages — 9 done
- [x] getting-started, routing, middleware
- [x] error-handling, writing-middleware, static-files
- [x] advanced-routing, debugging, best-practices
- [ ] security — Security
- [ ] ... (ကျန် guide အနည်းငယ်)

## PostgreSQL (postgresql.org/docs) — core ~500 pages — 2 done
- [x] getting-started — PostgreSQL မိတ်ဆက်
- [x] sql-basics — SQL အခြေခံ
- [ ] advanced-sql — Advanced SQL (JOIN, aggregate, transactions)
- [ ] indexes — Indexes
- [ ] transactions — Transactions
- [ ] ... (tutorial + core chapters)

## Postman (learning.postman.com) — ~150 pages — 1 done
- [x] getting-started — Postman မိတ်ဆက်
- [ ] collections — Collections အသေးစိတ်
- [ ] environments — Environments & Variables
- [ ] testing — Automated testing
- [ ] ... (learning center ကျန်)

## Prisma (prisma.io/docs) — ~200 pages — 2 done
- [x] getting-started — Prisma စတင်ခြင်း
- [x] schema — Schema ရေးနည်း
- [ ] relations — Relations
- [ ] queries — Query အသေးစိတ် (CRUD)
- [ ] migrations — Migrations
- [ ] ... (guides ကျန်)

## TypeScript (typescriptlang.org) — ~100 pages — 1 done
- [x] getting-started — TypeScript မိတ်ဆက်
- [ ] everyday-types — Everyday types
- [ ] narrowing — Type narrowing
- [ ] functions — Functions
- [ ] generics — Generics
- [ ] ... (handbook ကျန်)

## useSWR (swr.vercel.app) — ~25 pages — 9 done (core အကုန်)
- [x] getting-started, data-fetching, error-handling
- [x] arguments, conditional-fetching, global-config
- [x] pagination, infinite-loading, prefetching
- [ ] ... (API reference ကျန်)

## TanStack Query (tanstack.com/query) — ~100 pages — 6 done
- [x] getting-started, queries, query-keys
- [x] mutations, cache, infinite-queries
- [ ] ... (guides ကျန် + API reference)

## Zustand (zustand.docs.pmnd.rs) — ~15 pages — 9 done (core အကုန်)
- [x] getting-started, update-state, selectors, typescript
- [x] middleware, persist, immer, testing, recipes
- [ ] ... (reference ကျန်)

## အလုပ်လုပ်နည်း (workflow)
1. Backlog ထဲက `[ ]` အများဆုံး 4 worker × 5 pages batch နဲ့ ဘာသာပြန်
2. `npm run build` အောင်အောင် verify → commit → `git push` (Vercel auto-deploy)
3. Backlog ကို update (done)
4. နောက်တစ်ကြိမ် ဒီ file ကို ပြန်ဖတ်ပြီး ဆက်လုပ်ပါ
