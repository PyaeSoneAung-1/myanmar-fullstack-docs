# Translation Backlog — တစ်ခုမကျန် ဘာသာပြန်ဖို့ Queue

Official docs အကုန်လုံးကို မြန်မာလို ဘာသာပြန်ဖို့အတွက် tracking file ပါ။
Status: `[x]` done / `[ ]` todo
(စာမျက်နှာရေတွေက official docs အရွယ်အစားအလိုက် ခန့်မှန်းချက်ပါ)

**Total: 289 pages translated** (wave 7, 2026-09-02: +48 pages)
Wave history: W1=20 → W2=52 → W3=70 → W4=101 → W5=167 → W6=241 → W7=289

## React (react.dev/learn + core reference) — est ~120 — 49 done
- [x] Learn section: getting-started, installation/build-toolchain (creating-a-react-app, build-a-react-app-from-scratch, editor-setup), chapter hubs (describing-the-ui, adding-interactivity, managing-state, escape-hatches), and all learn pages: your-first-component, importing-and-exporting-components, writing-markup-with-jsx, javascript-in-jsx-with-curly-braces, props, conditional-rendering, rendering-lists, keeping-components-pure, understanding-your-ui-as-a-tree, events, state-a-components-memory, render-and-commit, state-snapshot, queueing-a-series-of-state-updates, updating-objects-in-state, updating-arrays-in-state, reacting-to-input-with-state, choosing-the-state-structure, sharing-state-between-components, preserving-and-resetting-state, extracting-state-logic-into-a-reducer, passing-data-deeply-with-context, scaling-up-with-reducer-and-context, referencing-values-with-refs, manipulating-the-dom-with-refs, synchronizing-with-effects, you-might-not-need-an-effect, lifecycle-of-reactive-effects, separating-events-from-effects, removing-effect-dependencies, reusing-logic-with-custom-hooks, strict-mode, thinking-in-react
- [x] API reference (condensed): useState, use, useEffect, useEffectEvent, useImperativeHandle, useRef, built-in-components
- [ ] API reference ကျန် (useReducer, useMemo, useCallback, useContext, useLayoutEffect, forwardRef, createContext, Suspense, lazy, ...) — internal links to these currently point to react.dev official pages
- [ ] Learn extras (installation page variants, react-compiler, using-typescript) — optional

## Next.js (nextjs.org/docs app) — est ~300 — 25 done
- [x] getting-started (hub), project-structure, pages-layouts, dynamic-routes, linking, css, image, fonts, forms (server functions/mutations)
- [x] Building: data-fetching, route-handlers, server-client-components, caching (cache components model), revalidating, error-handling, not-found, parallel-routes, intercepting-routes, loading/streaming, lazy-loading
- [x] Config/deploy: environment-variables, redirecting, static-exports, deploying, internationalization
- [ ] Guides ကျန် + file conventions + functions reference (page/layout/link/error/loading file conventions, cacheLife/cacheTag/use cache directives, useRouter, cookies/headers...) — existing prose links point to official nextjs.org API pages pending translation

## Node.js (nodejs.org/en/learn) — est ~180 — 38 done
- [x] Getting started: introduction (getting-started), how-much-javascript-do-you-need, differences-between-nodejs-and-the-browser, the-v8-javascript-engine, fetching-data-with-nodejs (fetch), nodejs-the-difference-between-development-and-production, security-best-practices, npm basics, run scripts, REPL, environment variables
- [x] Asynchronous work: event loop, timers, promises, async-programming, async flow control, blocking vs non-blocking, event emitter, process.nextTick, setImmediate, dont-block-the-event-loop
- [x] Files: file paths, descriptors, file stats, file-system, reading-files, writing-files, working-with-folders, output/input command line
- [x] Modules/TS: modules, how-to-use-streams, backpressuring-in-streams, TypeScript native/transpile/runner/publishing (orders 35–38)
- [x] HTTP: anatomy-of-an-http-transaction
- [ ] ကျန် (learn): HTTP enterprise config, concurrency models, diagnostics (memory profiler, inspector, perf), test runner guides, Node-API — optional deep areas

## Express (expressjs.com) — est ~30 — 21 done (API ref excluded)
- [x] Starter: getting-started, installing, hello-world, generator, faq, examples
- [x] Guide: routing, middleware, writing-middleware, error-handling, static-files, template-engines, developing-template-engines, advanced-routing, debugging, behind-proxies, best-practices, security, overriding-express-api
- [x] Resources: resources, contribution-guide
- [ ] api-reference (4.x/5.x) — excluded per sources.json note

## PostgreSQL (postgresql.org/docs tutorial + core) — est ~500 — 18 done
- [x] Tutorial (complete): getting-started, creating-db, creating-table, populating-table, querying-table, updating-data, deleting-data, sql-basics, joins, aggregate, advanced-features, views, foreign-keys, transactions, window-functions, inheritance, indexes, conclusion
- [ ] Core chapters + reference — ကြီးမားလွန်း (full docs ~3000 pages); tutorial ပြီးမြောက်။ နောက်ဆုံးမှ ဆက်ရန်

## Postman (learning.postman.com) — est ~150 — 12 done
- [x] getting-started, create-requests, managing-environments, variables, create-collections, manage-collections, authorization, intro-to-scripts, mock-servers, testing, building-workflows, creating-workspaces
- [ ] Learning Center ကျန် — sending requests အသေးစိတ်, responses, collections running/sharing, monitoring, collaborating — အများကြီး ကျန်သေး

## Prisma (prisma.io/docs) — est ~200 — 22 done
- [x] getting-started, core-concepts, schema, data-modeling, relational-databases, relations, queries, reading-data, writing-data, relations-and-joins, advanced-queries, transactions, prisma-client
- [x] Migrations: migrations, how-migrations-work, generating-a-migration, applying-a-migration, deploy (migrate deploy)
- [x] More: how-middleware-works, logging, debugging, client-extensions
- [ ] ကျန် — Prisma 8 (v8) / v7 guides + full reference; versioned docs (v7 classic pages live under /docs/orm/v7/**)

## TypeScript (typescriptlang.org handbook) — est ~100 — 19 done
- [x] Handbook v2 (core): getting-started, everyday-types, narrowing, functions, object-types, generics, classes, keyof-typeof, indexed-access-types, conditional-types, mapped-types, template-literal-types, modules, type-declarations, understanding-errors
- [x] Tutorials: typescript-tooling-in-5-minutes, dom-manipulation, react, migrating-from-javascript
- [ ] Declaration files deep-dive, tsconfig reference, project setup guides — optional

## useSWR (swr.vercel.app) — ~25 — 24 done 🎉 COMPLETE
- [x] Getting started + core (data-fetching, error-handling, revalidation, arguments, global-config, pagination, infinite-loading, mutation, optimistic-ui, middleware, suspense, typescript, subscription, performance, with-nextjs, react-native)
- [x] Advanced (cache, understanding, devtools) + API reference (api)
- [x] Examples: auth, optimistic-ui
- [ ] Examples ကျန် (basic demos — website sandbox examples; optional)

## TanStack Query (tanstack.com/query react) — est ~100 — 36 done
- [x] Guides (complete): getting-started, queries, query-keys, query-functions, dependent-queries, parallel-queries, infinite-queries, disabling-queries, paginated-queries, placeholder-query-data, initial-query-data, prefetching, mutations, optimistic-updates, updates-from-mutation-responses, query-invalidation, query-cancellation, network-mode, background-fetching-indicators, filters, query-retries, suspense, polling, ssr, advanced-ssr, window-focus-refetching, scroll-restoration, testing, render-optimizations, request-waterfalls, default-query-function, query-options, important-defaults, typescript, devtools, cache
- [ ] API reference (hooks: useQuery/useMutation/useInfiniteQuery...) — generated-style pages; optional

## Zustand (zustand.docs.pmnd.rs) — ~25 — 25 done 🎉 COMPLETE

## အလုပ်လုပ်နည်း (workflow)
1. Backlog ထဲက `[ ]` ကို worker 4 ယောက် (parallel) × 4–10 pages batch နဲ့ ဘာသာပြန်
2. `npm run build` အောင်အောင် verify → commit → `git push` (Vercel auto-deploy)
3. Backlog ကို update → နောက်တစ်ကြိမ် ဒီ file ကို ပြန်ဖတ်ပြီး ဆက်လုပ်ပါ
4. Internal links များကို မမေ့ရန်: dangling link sweep (existing files နဲ့ ကိုက်ညီအောင်)
