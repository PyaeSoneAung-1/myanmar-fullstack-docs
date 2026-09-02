# Translation Backlog — တစ်ခုမကျန် ဘာသာပြန်ဖို့ Queue

Official docs အကုန်လုံးကို မြန်မာလို ဘာသာပြန်ဖို့အတွက် tracking file ပါ။
Status: `[x]` done / `[ ]` todo
(စာမျက်နှာရေတွေက official docs အရွယ်အစားအလိုက် ခန့်မှန်းချက်ပါ)

**Total: 555 pages translated** (wave 12, 2026-09-02: +35 pages)
Wave history: W1=20 → W2=52 → W3=70 → W4=101 → W5=167 → W6=241 → W7=289 → W8=331 → W9=393 → W10=457 → W11=520 → W12=555

## React (react.dev/learn + core reference) — est ~120 — 115 done
- [x] Learn section: getting-started, installation/build-toolchain (creating-a-react-app, build-a-react-app-from-scratch, editor-setup), chapter hubs (describing-the-ui, adding-interactivity, managing-state, escape-hatches), and all learn pages: your-first-component, importing-and-exporting-components, writing-markup-with-jsx, javascript-in-jsx-with-curly-braces, props, conditional-rendering, rendering-lists, keeping-components-pure, understanding-your-ui-as-a-tree, events, state-a-components-memory, render-and-commit, state-snapshot, queueing-a-series-of-state-updates, updating-objects-in-state, updating-arrays-in-state, reacting-to-input-with-state, choosing-the-state-structure, sharing-state-between-components, preserving-and-resetting-state, extracting-state-logic-into-a-reducer, passing-data-deeply-with-context, scaling-up-with-reducer-and-context, referencing-values-with-refs, manipulating-the-dom-with-refs, synchronizing-with-effects, you-might-not-need-an-effect, lifecycle-of-reactive-effects, separating-events-from-effects, removing-effect-dependencies, reusing-logic-with-custom-hooks, strict-mode, thinking-in-react
- [x] API reference (condensed): useState, use, useEffect, useEffectEvent, useImperativeHandle, useRef, built-in-components
- [x] API reference batch 2 (wave 8): useReducer, useMemo, useCallback, useContext, useLayoutEffect, forwardRef, createContext, Suspense, lazy, startTransition (orders 50–59)
- [x] API reference wave 9 (orders 60–73): useId, useTransition, useDeferredValue, useDebugValue, useSyncExternalStore, useInsertionEffect, useOptimistic, useActionState, useFormStatus, createElement, createPortal, flushSync, Component, memo (StrictMode/Fragment already covered in strict-mode.md + built-in-components.md)
- [x] react-dom components (wave 10, orders 74–84): form, input, select, textarea, option, progress, link, title, script, meta, style
- [x] react-dom client + misc (wave 10, orders 85–88): createRoot, hydrateRoot, cloneElement, isValidElement
- [x] react-dom/server (wave 11, orders 89–95): server hub (react-dom-server), renderToString, renderToStaticMarkup, resume, resumeToPipeableStream, renderToPipeableStream, renderToReadableStream
- [x] react-dom resource preloading (wave 11, orders 96–101): preconnect, prefetchDNS, preinit, preinitModule, preload, preloadModule
- [x] Misc API (wave 11, orders 102–107): act, cache, createRef, Profiler, PureComponent, legacy
- [x] Wave 12 (orders 108–115): react-dom/static (prerender, prerenderToNodeStream, resumeAndPrerender, resumeAndPrerenderToNodeStream, hub), Children, Fragment, ViewTransition
- [ ] API reference ကျန် (optional): Activity (~31KB) + learn extras (installation variants, react-compiler, using-typescript) — optional
- [ ] Learn extras (installation page variants, react-compiler, using-typescript) — optional

## Next.js (nextjs.org/docs app) — est ~300 — 73 done
- [x] getting-started (hub), project-structure, pages-layouts, dynamic-routes, linking, css, image, fonts, forms (server functions/mutations)
- [x] Building: data-fetching, route-handlers, server-client-components, caching (cache components model), revalidating, error-handling, not-found, parallel-routes, intercepting-routes, loading/streaming, lazy-loading
- [x] Config/deploy: environment-variables, redirecting, static-exports, deploying, internationalization
- [x] File conventions reference (wave 8, orders 26–33): page, layout, loading, error, not-found (merged into existing not-found.md — same source; duplicate file removed), default, template, forbidden
- [x] Functions reference (wave 10, orders 34–44, 53–55): cookies, headers, redirect, permanentRedirect, revalidatePath, revalidateTag, useRouter, usePathname, useSearchParams, generateViewport, generateStaticParams, cacheLife, cacheTag, connection
- [x] Functions/file-conventions + metadata (wave 10, orders 45–52): generateMetadata (Metadata API), route.js, instrumentation, opengraph-image, robots, sitemap, manifest, app-icons
- [x] Directives reference (wave 11, orders 56–60): use client, use server, use cache, use cache: private, use cache: remote (sources = bundled node_modules/next/dist/docs, live URLs verified 200)
- [x] Functions batch 2 (wave 11, orders 61–69): after, draftMode, io, generateSitemaps, userAgent, useParams, ImageResponse, refresh, useOffline
- [x] Components reference (wave 12, orders 70–73): link (<Link>), script, form, font (next/font google+local)
- [x] Route Segment Config (wave 12, order 74): merged page — runtime, maxDuration, dynamicParams, preferredRegion, prefetch, instant
- [ ] API reference ကျန်: components/image (~61KB), next.config.js options (~40 files, small — good quick win), CLI reference (create-next-app + next), file-conventions (proxy ~31KB, instrumentation-client), guides ကျန် (client-side-data-fetching, testing, upgrading/version-16, migrating, authentication, deployment) — prose pages already link to official nextjs.org URLs pending translation

## Node.js (nodejs.org/en/learn) — est ~180 — 81 done
- [x] Getting started: introduction (getting-started), how-much-javascript-do-you-need, differences-between-nodejs-and-the-browser, the-v8-javascript-engine, fetching-data-with-nodejs (fetch), nodejs-the-difference-between-development-and-production, security-best-practices, npm basics, run scripts, REPL, environment variables
- [x] Asynchronous work: event loop, timers, promises, async-programming, async flow control, blocking vs non-blocking, event emitter, process.nextTick, setImmediate, dont-block-the-event-loop
- [x] Files: file paths, descriptors, file stats, file-system, reading-files, writing-files, working-with-folders, output/input command line
- [x] Modules/TS: modules, how-to-use-streams, backpressuring-in-streams, TypeScript native/transpile/runner/publishing (orders 35–38)
- [x] HTTP: anatomy-of-an-http-transaction
- [x] Wave 8 (orders 39–44): ecmascript-2015-es6-and-beyond, debugging, profiling, websocket, enterprise-network-configuration, working-with-different-filesystems
- [x] Wave 9 (orders 45–71): nodejs-with-webassembly, comparing-nodejs-concurrency-models, diagnostics section complete (live-debugging, using-inspector, flame-graphs, poor-performance, using-linux-perf, memory, understanding-and-tuning-memory, using-gc-traces, using-heap-profiler, using-heap-snapshot, user-journey), modules (publishing-a-package, abi-stability, publishing-node-api-modules), test-runner complete (introduction, using-test-runner, mocking, collecting-code-coverage), typescript/introduction, userland-migrations complete (hub + axios-to-whatwg-fetch, chalk-to-util-styletext, correct-ts-specifiers, kleur-to-util-styletext, mocha-to-node-test-runner)
  - Note: nodejs.org/learn/modules/publishing-a-package now hosts 'Publishing ECMAScript modules' (module formats/dual-package) content — translated as-is
- [x] node-api (wave 10, orders 72–81): section hub, getting-started (prerequisites, project-structure, your-first-project, tools, migration, objectwrap), build-tools (hub, node-gyp, cmake-js)
- [ ] node-api special-topics (asyncworker, context-awareness, object-function-refs, thread-safe-functions) — optional deep area
- [ ] Core API reference digest (nodejs.org/api — est scope of the 180 total) — not started

## Express (expressjs.com) — est ~30 — 21 done (API ref excluded)
- [x] Starter: getting-started, installing, hello-world, generator, faq, examples
- [x] Guide: routing, middleware, writing-middleware, error-handling, static-files, template-engines, developing-template-engines, advanced-routing, debugging, behind-proxies, best-practices, security, overriding-express-api
- [x] Resources: resources, contribution-guide
- [ ] api-reference (4.x/5.x) — excluded per sources.json note

## PostgreSQL (postgresql.org/docs tutorial + core) — est ~500 — 18 done
- [x] Tutorial (complete): getting-started, creating-db, creating-table, populating-table, querying-table, updating-data, deleting-data, sql-basics, joins, aggregate, advanced-features, views, foreign-keys, transactions, window-functions, inheritance, indexes, conclusion
- [ ] Core chapters + reference — ကြီးမားလွန်း (full docs ~3000 pages); tutorial ပြီးမြောက်။ နောက်ဆုံးမှ ဆက်ရန်

## Postman (learning.postman.com) — est ~150 — 74 done
- [x] getting-started, create-requests, managing-environments, variables, create-collections, manage-collections, authorization, intro-to-scripts, mock-servers, testing, building-workflows, creating-workspaces
- [x] Wave 8 (orders 13–18): quick-start, request-basics, parameters, headers, pre-request-scripts, intro-monitors
- [x] Wave 9 (orders 19–32): responses, examples, define-variables, test-data, intro-to-collections, intro-to-collection-runs, setting-up-monitor, sharing, using-workspaces, requests (overview), test-examples, troubleshoot-tests, create-dynamic-responses, comments
- [x] Wave 11 auth methods (orders 33–45): authorization-types, specifying-authorization-details, digest-auth, oauth-20, aws-signature, ntlm-authentication, hawk-authentication, authentication-for-public-apis, certificates, oauth-10, akamai-edgegrid, atlassian
- [x] Wave 11 runs + version control (orders 46–52): running-collections-overview, scheduling-collection-runs, working-with-data-files, collection-webhooks, version-control-overview, forking-elements, creating-pull-requests, reviewing-pull-requests
- [x] Wave 12 API design/monitoring (orders 53–74): specifications (overview, create/import/edit/validate, add-files, collaborate, generate-collections, view-live-documentation), api-builder, monitor results + reports (viewing, publish, update, usage, troubleshooting, faqs, static-IPs), sandbox reference (overview, pm.variables, pm.request, pm.response)
- [ ] Learning Center ကျန် — request/response deep dives (response saving/viewing), testing libraries (chai etc.), remaining sandbox pm.* pages, collection run reports/analysis, workspaces admin, private API network, admin/enterprise, webhooks/api-catalog — အများကြီး ကျန်သေး
  - Note: learning.postman.com rebuilt on Fern platform — URLs changed (sending-requests/* → use/send-requests/*). Clean markdown available: append `.md` to any page URL (e.g. https://learning.postman.com/docs/<path>.md); full index at /llms.txt. sources.json note is outdated.

## Prisma (prisma.io/docs) — est ~200 — 36 done
- [x] getting-started, core-concepts, schema, data-modeling, relational-databases, relations, queries, reading-data, writing-data, relations-and-joins, advanced-queries, transactions, prisma-client
- [x] Migrations: migrations, how-migrations-work, generating-a-migration, applying-a-migration, deploy (migrate deploy)
- [x] More: how-middleware-works, logging, debugging, client-extensions
- [x] Prisma 8 (v8) wave 8 (orders 23–29): the-data-contract, psl-syntax, the-migration-graph, editing-a-migration, rollbacks-and-recovery, authoring-custom-middleware, built-in-cache
- [x] Prisma 8 wave 9 (orders 30–36): the-contract-artifact, capabilities, typescript-schema-builder, built-in-budgets, built-in-lints, using-extensions, data-modeling/mongodb
- [ ] ကျန် — Prisma 8 reference (orm-client, pipeline-builder, raw-queries, sql-query-builder, transactions-and-runtime, error-reference — giant pages; low priority); v6/v7 classic pages archived under /docs/orm/v6/** and /docs/orm/v7/**
  - Note: prisma.io/docs now defaults to Prisma 8; v7 'classic' archived at /docs/orm/v7/**. Clean markdown: append `.md` (https://www.prisma.io/docs/<path>.md); indexes at /docs/llms.txt.

## TypeScript (typescriptlang.org handbook) — est ~100 — 25 done
- [x] Handbook v2 (core): getting-started, everyday-types, narrowing, functions, object-types, generics, classes, keyof-typeof, indexed-access-types, conditional-types, mapped-types, template-literal-types, modules, type-declarations, understanding-errors
- [x] Tutorials: typescript-tooling-in-5-minutes, dom-manipulation, react, migrating-from-javascript
- [x] Declaration files section (wave 8, orders 20–25): declaration-reference (by-example), declaration-dos-and-donts, declaration-deep-dive, declaration-publishing, declaration-consumption, declaration-templates
- [ ] ကျန် — tsconfig reference (single giant auto-generated page — skip), project setup guides, library-structures/dts-from-js — optional

## useSWR (swr.vercel.app) — ~25 — 24 done 🎉 COMPLETE
- [x] Getting started + core (data-fetching, error-handling, revalidation, arguments, global-config, pagination, infinite-loading, mutation, optimistic-ui, middleware, suspense, typescript, subscription, performance, with-nextjs, react-native)
- [x] Advanced (cache, understanding, devtools) + API reference (api)
- [x] Examples: auth, optimistic-ui
- [ ] Examples ကျန် (basic demos — website sandbox examples; optional)

## TanStack Query (tanstack.com/query react) — est ~100 — 63 done
- [x] Guides (complete): getting-started, queries, query-keys, query-functions, dependent-queries, parallel-queries, infinite-queries, disabling-queries, paginated-queries, placeholder-query-data, initial-query-data, prefetching, mutations, optimistic-updates, updates-from-mutation-responses, query-invalidation, query-cancellation, network-mode, background-fetching-indicators, filters, query-retries, suspense, polling, ssr, advanced-ssr, window-focus-refetching, scroll-restoration, testing, render-optimizations, request-waterfalls, default-query-function, query-options, important-defaults, typescript, devtools, cache
- [x] API reference functions (wave 10, orders 37–53): useQuery, useMutation, useInfiniteQuery, useQueries, useQueryClient, useIsFetching, useIsMutating, useMutationState, useSuspenseQuery, useSuspenseInfiniteQuery, useSuspenseQueries, usePrefetchQuery, usePrefetchInfiniteQuery, QueryClientProvider, HydrationBoundary, QueryErrorResetBoundary, useQueryErrorResetBoundary
- [x] Plugins + misc (wave 11, orders 54–63): useIsRestoring, persistQueryClient, createSyncStoragePersister, createAsyncStoragePersister, createPersister (experimental_createQueryPersister), broadcastQueryClient, quick-start, installation, react-native, graphql
- [ ] API reference ကျန် (optional): queryOptions/infiniteQueryOptions/mutationOptions function refs (slug collision with guides — merge/rename decision needed), Interfaces type pages (generated), comparison guide (~20KB), migrating-to-*

## Zustand (zustand.docs.pmnd.rs) — ~25 — 25 done 🎉 COMPLETE

## အလုပ်လုပ်နည်း (workflow)
1. Backlog ထဲက `[ ]` ကို worker 4 ယောက် (parallel) × 4–10 pages batch နဲ့ ဘာသာပြန်
2. `npm run build` အောင်အောင် verify → commit → `git push` (Vercel auto-deploy)
3. Backlog ကို update → နောက်တစ်ကြိမ် ဒီ file ကို ပြန်ဖတ်ပြီး ဆက်လုပ်ပါ
4. Internal links များကို မမေ့ရန်: dangling link sweep (existing files နဲ့ ကိုက်ညီအောင်)
