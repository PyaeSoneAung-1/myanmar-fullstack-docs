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

## Node.js (nodejs.org/en/learn) — ~180 pages — 6 done
- [x] getting-started — Node.js မိတ်ဆက်
- [x] modules — Modules အခြေခံ
- [x] event-loop — Event Loop
- [x] async — Async programming (callbacks/promises/async-await)
- [x] npm-basics — npm အခြေခံ
- [x] file-system — File system
- [ ] ... (learn guides ကျန်)

## Express (expressjs.com) — ~30 pages — 16 done
- [x] getting-started, routing, middleware
- [x] error-handling, writing-middleware, static-files
- [x] advanced-routing, debugging, best-practices
- [x] installing — Install Express
- [x] generator — Express application generator
- [x] faq — FAQ
- [x] behind-proxies — Trust proxy & behind proxies
- [x] template-engines — Template engines သုံးနည်း
- [x] overriding-express-api — Express API ကို override လုပ်ခြင်း
- [x] developing-template-engines — Template engine ရေးနည်း
- [ ] security — Security
- [ ] api-reference — API reference (4.x/5.x)
- [ ] resources — Community resources
- [ ] contribution-guide — Contribution guide
- [ ] ... (ကျန် guide အနည်းငယ်)

## PostgreSQL (postgresql.org/docs) — core ~500 pages — 6 done
- [x] getting-started — PostgreSQL မိတ်ဆက်
- [x] sql-basics — SQL အခြေခံ
- [x] advanced-sql — Advanced SQL (JOIN, aggregate, transactions)
- [x] indexes — Indexes
- [x] transactions — Transactions
- [ ] ... (tutorial + core chapters)

## Postman (learning.postman.com) — ~150 pages — 1 done
- [x] getting-started — Postman မိတ်ဆက်
- [ ] collections — Collections အသေးစိတ်
- [ ] environments — Environments & Variables
- [ ] testing — Automated testing
- [ ] ... (learning center ကျန်)

## Prisma (prisma.io/docs) — ~200 pages — 6 done
- [x] getting-started — Prisma စတင်ခြင်း
- [x] schema — Schema ရေးနည်း
- [x] relations — Relations
- [x] queries — Query အသေးစိတ် (CRUD)
- [x] migrations — Migrations
- [ ] ... (guides ကျန်)

## TypeScript (typescriptlang.org) — ~100 pages — 6 done
- [x] getting-started — TypeScript မိတ်ဆက်
- [x] everyday-types — Everyday types
- [x] narrowing — Type narrowing
- [x] functions — Functions
- [x] generics — Generics
- [ ] ... (handbook ကျန်)

## useSWR (swr.vercel.app) — ~25 pages — 17 done (core အကုန် + guides)
- [x] getting-started, data-fetching, error-handling
- [x] arguments, conditional-fetching, global-config
- [x] pagination, infinite-loading, prefetching
- [x] mutation — Mutate & useSWRMutation
- [x] revalidation — Revalidation
- [x] middleware — Middleware
- [x] suspense — Suspense
- [x] typescript — TypeScript
- [x] with-nextjs — Next.js နဲ့ တွဲသုံးခြင်း
- [x] subscription — Subscription
- [x] performance — Advanced: Performance
- [ ] api — API reference
- [ ] advanced: cache, understanding, devtools, react-native
- [ ] examples — Examples

## TanStack Query (tanstack.com/query) — ~100 pages — 14 done
- [x] getting-started, queries, query-keys
- [x] mutations, cache, infinite-queries
- [x] dependent-queries — Dependent Queries
- [x] query-functions — Query Functions
- [x] parallel-queries — Parallel Queries
- [x] paginated-queries — Paginated Queries
- [x] optimistic-updates — Optimistic Updates
- [x] query-invalidation — Query Invalidation
- [x] network-mode — Network Mode
- [x] important-defaults — Important Defaults
- [ ] guides ကျန် (filters, polling, retries, ssr, suspense, testing, ...)
- [ ] ... (API reference)

## Zustand (zustand.docs.pmnd.rs) — ~20 pages — 17 done (core အကုန် + reference အများစု)
- [x] getting-started, update-state, selectors, typescript
- [x] middleware, persist, immer, testing, recipes
- [x] reference/apis: create-store, create, shallow
- [x] reference/hooks: use-store, use-shallow
- [x] reference/middlewares: devtools, combine
- [x] reference/integrations: third-party-libraries
- [ ] reference/apis: create-with-equality-fn
- [ ] reference/middlewares: redux, subscribe-with-selector
- [ ] reference/integrations: immer-middleware, persisting-store-data
- [ ] reference/migrations: v3 migration + previous-versions

## အလုပ်လုပ်နည်း (workflow)
1. Backlog ထဲက `[ ]` အများဆုံး 4 worker × 5 pages batch နဲ့ ဘာသာပြန်
2. `npm run build` အောင်အောင် verify → commit → `git push` (Vercel auto-deploy)
3. Backlog ကို update (done)
4. နောက်တစ်ကြိမ် ဒီ file ကို ပြန်ဖတ်ပြီး ဆက်လုပ်ပါ
