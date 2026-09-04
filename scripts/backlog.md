# Translation Backlog — တစ်ခုမကျန် ဘာသာပြန်ဖို့ Queue

Official docs အကုန်လုံးကို မြန်မာလို ဘာသာပြန်ဖို့အတွက် tracking file ပါ။
Status: `[x]` done / `[ ]` todo
(စာမျက်နှာရေတွေက official docs အရွယ်အစားအလိုက် ခန့်မှန်းချက်ပါ)

**Total: 993 pages translated** (wave 27, 2026-09-04: +12 PostgreSQL SQL Commands pages)
Wave history: W1=20 → W2=52 → W3=70 → W4=101 → W5=167 → W6=241 → W7=289 → W8=331 → W9=393 → W10=457 → W11=520 → W12=555 → W13=633 → W14=672 → W15=722 → W16=772 → W17=823 → W18=847 → W19=866 → W20=876 → W21=896 → W22=909 → W23=921 → W24=939 → W25=950 → W26=981 → W27=993

## React (react.dev/learn + core reference) — est ~120 — 123 done
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
- [x] Wave 13 (orders 116–123): Activity, using-typescript, add-react-to-an-existing-project, react-developer-tools, react-compiler (+ installation, incremental-adoption, debugging) — React core Learn + Reference ပြည့်စုံ 🎉 (123/120 est)
- [ ] React ကျန် (optional, low value): tutorial-tic-tac-toe, learn hubs (installation/setup/index), reference hubs (apis/components/hooks), addTransitionType, experimental_taint*, canary APIs (cacheSignal, captureOwnerStack)

## Next.js (nextjs.org/docs app) — est ~300 — 257 done
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
- [x] Wave 13 API reference (orders 75–80): components/image (next/image full reference, complete), file-conventions middleware + proxy + instrumentation-client, CLI (next + create-next-app)
- [x] Wave 13 next.config.js options (orders 81–100, 20 pages): reactStrictMode, poweredByHeader, compress, output, distDir, basePath, assetPrefix, env, headers, redirects, rewrites, images, trailingSlash, typedRoutes, logging, devIndicators, webpack, transpilePackages, sassOptions, serverActions
- [x] Wave 13 file conventions + guides (orders 101–108): dynamic-routes, mdx-components, public-folder, route-groups, src-folder, unauthorized; guides: testing, client-side-data-fetching
- [x] Wave 14 guides (orders 108–119, 12 pages): authentication, upgrading (hub), upgrading-version-16, mdx, custom-server, production-checklist, css-in-js, sass, view-transitions, multi-zones, debugging, ci-build-caching
- [x] Wave 16 guides (orders 121–136, 16 pages): rendering-philosophy, json-ld, deploying-to-platforms, cdn-caching, how-revalidation-works, multi-tenant, memory-usage, local-development, public-static-pages, analytics, ai-agents, mcp, self-hosting, open-telemetry, third-party-libraries, single-page-applications
- [x] Wave 16 functions (orders 137–152, 16 pages): unstable_noStore, unstable_rethrow, unstable_cache, fetch, next-request, next-response, updateTag, generateImageMetadata, catchError, forbidden, unauthorized, useLinkStatus, useReportWebVitals, useSelectedLayoutSegment(s), nextRootParams
- [x] Wave 16 next.config.js options (orders 153–170, 18 pages): allowedDevOrigins, crossOrigin, generateEtags, httpAgentOptions, mdxRs, onDemandEntries, productionBrowserSourceMaps, webVitalsAttribution, outputHashSalt, authInterrupts, cacheMaxMemorySize, serverComponentsHmrCache, staleTimes, pageExtensions, typescript, urlImports, serverExternalPackages, staticGeneration
- [x] Wave 17 guides (orders 171–189, 19 pages): testing suites complete (cypress, jest, playwright, vitest), client-side-data-fetching per-library (swr, tanstack-query), migrating (from-create-react-app, from-vite), upgrading/codemods, caching cluster (caching-without-cache-components, incremental-static-regeneration, incremental-static-regeneration-cache-components), prefetching cluster (prefetching, optimizing-prefetching, adopting-partial-prefetching), server-actions, server-and-client-boundary, data-security, ppr-platform-guide
- [x] Wave 17 next.config.js options (orders 190–221, 32 pages — config section COMPLETE 🎉): appDir, reactMaxHeadersLength, expireTime, generateBuildId, supportsImmutableAssets, optimizePackageImports, turbopackMemoryEviction, turbopackRustReactCompiler, turbopackFileSystemCache, turbopackLocalPostcssConfig, useTypeScriptCli, cacheComponents, partialPrefetching, instrumentationClientInject, inlineCss, htmlLimitedBots, adapterPath, deploymentId, exportPathMap, incrementalCacheHandlerPath, cacheLife, prefetchInlining, useOffline, reactCompiler, proxyClientMaxBodySize, useLightningcss, cssChunking, turbopackChunking, turbopackIgnoreIssue, taint, turbopack, cacheHandlers — all bundled next.config.js options translated
- [x] Wave 18 guides (orders 222–239, 18 pages): app-router-migration, authentication-with-cache-components, backend-for-frontend, building, content-security-policy, instant-navigation, interactive-apps, migrating-to-cache-components, offline-support, package-bundling, preserving-ui-state, preventing-flash-before-hydration, progressive-web-apps, scripts, tailwind-v3-css, videos, upgrading/version-14, upgrading/version-15 — backlog guide queue COMPLETE (Next.js guides အကုန် ပြီးစီး) 🎉
- [x] Wave 18 API ref (orders 240–245, 6 pages): functions/not-found → new slug `not-found-function` (file-convention `not-found.md` က bare slug ယူထားလို့ — function page ကို သီးခြား slug နဲ့ ထည့်သည်), api-reference/edge → `edge-runtime`, api-reference/turbopack, api-reference/config/typescript → `config-typescript`, api-reference/config/eslint → `config-eslint`, getting-started/metadata-and-og-images
- [x] Wave 22 adapters API reference (orders 246–258, 13 pages — 2026-09-03): api-reference/adapters section COMPLETE 🎉 — hub `adapters` + configuration (adapterPath/NEXT_ADAPTER_PATH), creating-an-adapter, api-reference (modifyConfig/onBuildComplete), testing-adapters, routing-with-next-routing (@next/routing), implementing-ppr-in-an-adapter, runtime-integration, invoking-entrypoints, output-types (largest), routing-information, use-cases, immutable-static-assets. Next.js 244 → 257.
  - Sources: bundled node_modules/next/dist/docs/01-app/03-api-reference/07-adapters (canonical Next 16.3.4); live URLs verified 200 (nextjs.org/docs/app/api-reference/adapters/*)
- [ ] ကျန် (optional): API-reference index hubs (file-conventions/components/directives/functions/config/cli index pages), functions/not-found slug rename (bare slug ကို file-convention page ကယူထား — clean up လုပ်ချင်ရင် rename + backlink sweep လိုမည်)

## Node.js (nodejs.org/en/learn) — est ~180 — 87 done (nodejs.org/en/learn repo အကုန် COMPLETE 🎉)
- [x] Getting started: introduction (getting-started), how-much-javascript-do-you-need, differences-between-nodejs-and-the-browser, the-v8-javascript-engine, fetching-data-with-nodejs (fetch), nodejs-the-difference-between-development-and-production, security-best-practices, npm basics, run scripts, REPL, environment variables
- [x] Asynchronous work: event loop, timers, promises, async-programming, async flow control, blocking vs non-blocking, event emitter, process.nextTick, setImmediate, dont-block-the-event-loop
- [x] Files: file paths, descriptors, file stats, file-system, reading-files, writing-files, working-with-folders, output/input command line
- [x] Modules/TS: modules, how-to-use-streams, backpressuring-in-streams, TypeScript native/transpile/runner/publishing (orders 35–38)
- [x] HTTP: anatomy-of-an-http-transaction
- [x] Wave 8 (orders 39–44): ecmascript-2015-es6-and-beyond, debugging, profiling, websocket, enterprise-network-configuration, working-with-different-filesystems
- [x] Wave 9 (orders 45–71): nodejs-with-webassembly, comparing-nodejs-concurrency-models, diagnostics section complete (live-debugging, using-inspector, flame-graphs, poor-performance, using-linux-perf, memory, understanding-and-tuning-memory, using-gc-traces, using-heap-profiler, using-heap-snapshot, user-journey), modules (publishing-a-package, abi-stability, publishing-node-api-modules), test-runner complete (introduction, using-test-runner, mocking, collecting-code-coverage), typescript/introduction, userland-migrations complete (hub + axios-to-whatwg-fetch, chalk-to-util-styletext, correct-ts-specifiers, kleur-to-util-styletext, mocha-to-node-test-runner)
  - Note: nodejs.org/learn/modules/publishing-a-package now hosts 'Publishing ECMAScript modules' (module formats/dual-package) content — translated as-is
- [x] node-api (wave 10, orders 72–81): section hub, getting-started (prerequisites, project-structure, your-first-project, tools, migration, objectwrap), build-tools (hub, node-gyp, cmake-js)
- [x] Wave 14 node-api special topics (orders 82–87): special-topics hub, asyncworker, context-awareness, object-function-refs, thread-safe-functions, node-pre-gyp — nodejs.org/en/learn section ပြည့်စုံ 🎉
- [ ] Core API reference digest (nodejs.org/api — est scope of the 180 total) — not started

## Express (expressjs.com) — est ~30 — 30 done 🎉 COMPLETE (API ref excluded)
- [x] Starter: getting-started, installing, hello-world, generator, faq, examples
- [x] Guide: routing, middleware, writing-middleware, error-handling, static-files, template-engines, developing-template-engines, advanced-routing, debugging, behind-proxies, best-practices, security, overriding-express-api
- [x] Resources: resources, contribution-guide
- [x] Wave 14 (orders 22–30): advanced (healthcheck-graceful-shutdown, security-updates), guide (database-integration, migrating-4, migrating-5), resources (glossary, community, utils), support — expressjs.com မျက်နှာစုံ ပြီးစီး 🎉
- [ ] api-reference (4.x/5.x) — excluded per sources.json note

## PostgreSQL (postgresql.org/docs — tutorial + core chapters) — est ~500 — 139 done
- [x] Tutorial (complete): getting-started, creating-db, creating-table, populating-table, querying-table, updating-data, deleting-data, sql-basics, joins, aggregate, advanced-features, views, foreign-keys, transactions, window-functions, inheritance, indexes, conclusion
- [x] Wave 19 (orders 19–37, 19 pages — 2026-09-03): Chapter 5 Data Definition (15 pages: 5.1 basics → 5.15 dependency tracking) + Chapter 6 Data Manipulation (4 pages: insert/update/delete/returning) — PostgreSQL 18.6 docs, official per-section pages (PostgreSQL 18 docs consolidated; old per-subsection URLs like ddl-constraints-fk.html are gone)
  - Sources: postgresql.org/docs/current HTML → clean markdown via `scripts/pg-html2md.py` (committed converter, needs `beautifulsoup4`); no official markdown source exists
- [x] Wave 20 (orders 19–21 + 41–47, 10 pages — 2026-09-03): Chapter 4 SQL Syntax (3 pages: 4.1 sql-syntax-lexical → 4.3 sql-syntax-calling-funcs) + Chapter 7 Queries (7 pages: 7.2 queries-table-expressions → 7.8 queries-with) — core SQL language chapters Ch4–Ch7 ပြည့်စုံ 🎉
  - Sidebar မှာ book order ဖြစ်အောင် Ch5/Ch6 ရဲ့ order fields ကို renumber လုပ်ခဲ့သည် (Ch5 19–33→22–36, Ch6 34–37→37–40) — SQL Syntax → Data Definition → Data Manipulation → Queries အစဉ်အတိုင်း ပေါ်သည်
  - Sources: postgresql.org/docs/current HTML → `scripts/pg-html2md.py`; QA: fences byte-identical, 0 dead internal links, 0 order collisions (1–47 contiguous)
- [x] Wave 21 (orders 48–67, 20 pages — 2026-09-03): Chapter 8 Data Types COMPLETE 🎉 (8.1 numeric → 8.21 pseudo-types — numeric, money, character, binary, datetime, boolean, enum, geometric, network, bit, textsearch, uuid, xml, json/jsonb, arrays, composite/rowtypes, range types, domains, oid, pseudo) — Part II "SQL Language" ရဲ့ အကြီးဆုံး chapter ပြီးစီး
  - PG 18.6: 8.20 pg_lsn standalone page မရှိတော့ (datatype-pglsn.html 404); 8.21 pseudo-types နှင့် ဆက်တိုက်ဖြစ်သည် — landing (datatype.html) က TOC chrome မို့ skip
  - Sources: postgresql.org/docs/current HTML → `scripts/pg-html2md.py`; QA: fences byte-identical (147), 0 dead internal links, orders 1–67 contiguous
- [x] Wave 23 (orders 68–79, 12 pages — 2026-09-03): Chapter 11 Indexes COMPLETE 🎉 (11.1 indexes-intro → 11.12 indexes-examine — indexes-types w/ 11.2.1–11.2.6 B-Tree/Hash/GiST/SP-GiST/GIN/BRIN, indexes-ordering, indexes-bitmap-scans, indexes-unique, indexes-expressional, indexes-partial, indexes-index-only-scans, indexes-opclass, indexes-collations, indexes-examine) — PostgreSQL 67 → 79. Part II core chapters: Tutorial + Ch4–Ch8 + Ch11 ပြီးစီး
  - Sources: postgresql.org/docs/current HTML → `scripts/pg-html2md.py` (converted sources staged /home/user/.workspace/pg-src/ch11, not committed)
  - QA (independent sweep): orders 68–79 contiguous, 0 collisions; frontmatter complete; all code fences byte-identical to converted source; 0 dead internal links (corpus-wide); no []() / bare-.html / (#anchor) artifacts; no English prose leaks
  - Note: tutorial `indexes.md` (order 6, from indexes.html landing) kept as-is — distinct tutorial page; ch11 reference pages are the real section docs
- [x] Wave 24 (orders 68–73 + 86–97, 18 pages — 2026-09-03): Chapter 10 Type Conversion COMPLETE 🎉 (10.1 typeconv-overview → 10.6 typeconv-select) + Chapter 13 Concurrency Control COMPLETE 🎉 (13.1 mvcc-intro, 13.2 transaction-iso, 13.3 explicit-locking, 13.4 applevel-consistency, 13.5 mvcc-serialization-failure-handling, 13.6 mvcc-caveats, 13.7 locking-indexes) + Chapter 14 Performance Tips COMPLETE 🎉 (14.1 using-explain ~87KB out, 14.2 planner-stats, 14.3 explicit-joins, 14.4 populate, 14.5 non-durability) → PostgreSQL 79 → 97
  - Sidebar book-order fix: Ch11 orders renumbered 68–79 → 74–85 so Ch10 (68–73) slots before it; orders 1–97 now contiguous
  - Sources: postgresql.org/docs/current HTML → `scripts/pg-html2md.py` (staged /home/user/.workspace/pg-src/ch10-13-14, not committed)
  - QA (independent sweep): orders 1–97 contiguous, 0 collisions; frontmatter complete; ALL code fences byte-identical to converted source (incl. using-explain 32 blocks w/ ZWSP rows); 0 dead internal links; []()/[[ ]]/bare-# artifacts fixed (transaction-iso biblio labels single-bracketed); lock matrices 13.2/13.3 rebuilt to true 8×8/4×4 grids from live PG18 page (converter flattened them)
  - Note: Ch11 renumber touches 12 existing files (frontmatter order only)
- [x] Wave 25 (orders 86–96, 11 pages — 2026-09-03): Chapter 12 Full Text Search COMPLETE 🎉 (12.1 textsearch-intro → 12.11 textsearch-limitations — textsearch-controls ~48KB out, textsearch-dictionaries ~52KB out w/ 27 fences, textsearch-parsers w/ token-type Table 12.1, textsearch-psql w/ \dF sessions) → PostgreSQL 97 → 108. Part II core: Tutorial + Ch4–Ch8 + Ch10–Ch14 ပြီးစီး (Ch9 + SQL Commands သာ ကျန်)
  - Sidebar book-order fix: Ch13/Ch14 orders renumbered 86–97 → 97–108 (12 files, frontmatter-only) so Ch12 (86–96) slots between Ch11 and Ch13; PG orders 1–108 contiguous
  - Sources: postgresql.org/docs/current HTML → scripts/pg-html2md.py (staged /home/user/.workspace/pg-src/ch12)
  - QA (independent sweep): orders 1–108 contiguous, 0 collisions; frontmatter complete; fenced bodies byte-identical to source; 0 dead internal links; no []() / [[ ]] / bare-# artifacts
  - Note: converter left some psql <programlisting> sessions inside list items UNFENCED (GFM would mangle pipe tables) — textsearch-psql.md sessions wrapped in plain fences (8 added); all fenced bodies verified verbatim from EN source
  - Notes: "264" superscript mangling → 2^64 (house caret style); backticks restored on tsvector/tsquery/<N>
- [x] Wave 26 (orders 68–98, 31 pages — 2026-09-04): Chapter 9 Functions and Operators COMPLETE (9.1 logical → 9.28 statistics — functions-* 31 pages) — Part II SQL Language ပြည့်စုံ 🎉 (Tutorial + Ch4–Ch14 အားလုံး)
  - Sources: postgresql.org/docs/current HTML → scripts/pg-html2md.py (staged /home/user/.workspace/pg-src/w26)
- [x] Wave 27 SQL Commands batch 1 (orders 140–151, 12 pages — 2026-09-04): database/object management commands COMPLETE — CREATE/ALTER/DROP DATABASE, CREATE/DROP SCHEMA, CREATE/ALTER/DROP VIEW, CREATE/ALTER/DROP SEQUENCE, COMMENT → PostgreSQL 139 → 151; corpus total 993
  - Sources: postgresql.org/docs/current HTML → scripts/pg-html2md.py (staged /home/user/.workspace/pg-src/w27); slugs sql-<page>.md (source page names)
  - QA (independent sweep): orders 140–151 contiguous, 0 collisions; frontmatter complete; ALL code fences byte-identical to converted source; 0 dead internal links (corpus-wide); 0 non-absolute .html link targets; no []() / [[ ]] / trailing-# / English-leak artifacts
  - Links: corpus-translated targets → internal /docs/postgresql/<slug>; untranslated commands/sections → absolute postgresql.org/docs/current URLs
  - Note: bare syntax lines inside list items (e.g. CREATE VIEW RECURSIVE) wrapped in indented ```sql fences per wave-25 practice
- [ ] ကျန် (next wave အလို့ငှာ): SQL Commands batch 2+ (Part VI — ~170 commands ကျန်; SELECT/CREATE TABLE/INSERT စတဲ့ ကြီးမားတဲ့ commands တွေ အပါအဝင်); Node.js core API digest; TanStack API leftovers; Next.js API-reference index hubs
- [ ] Core chapters + reference — ကြီးမားလွန်း (full docs ~3000 pages); tutorial ပြီးမြောက်။ နောက်ဆုံးမှ ဆက်ရန်

## Postman (learning.postman.com) — est ~150 — 166 done
- [x] getting-started, create-requests, managing-environments, variables, create-collections, manage-collections, authorization, intro-to-scripts, mock-servers, testing, building-workflows, creating-workspaces
- [x] Wave 8 (orders 13–18): quick-start, request-basics, parameters, headers, pre-request-scripts, intro-monitors
- [x] Wave 9 (orders 19–32): responses, examples, define-variables, test-data, intro-to-collections, intro-to-collection-runs, setting-up-monitor, sharing, using-workspaces, requests (overview), test-examples, troubleshoot-tests, create-dynamic-responses, comments
- [x] Wave 11 auth methods (orders 33–45): authorization-types, specifying-authorization-details, digest-auth, oauth-20, aws-signature, ntlm-authentication, hawk-authentication, authentication-for-public-apis, certificates, oauth-10, akamai-edgegrid, atlassian
- [x] Wave 11 runs + version control (orders 46–52): running-collections-overview, scheduling-collection-runs, working-with-data-files, collection-webhooks, version-control-overview, forking-elements, creating-pull-requests, reviewing-pull-requests
- [x] Wave 12 API design/monitoring (orders 53–74): specifications (overview, create/import/edit/validate, add-files, collaborate, generate-collections, view-live-documentation), api-builder, monitor results + reports (viewing, publish, update, usage, troubleshooting, faqs, static-IPs), sandbox reference (overview, pm.variables, pm.request, pm.response)
- [x] Wave 14 (orders 102–110, 105–116): GraphQL client (graphql-overview, graphql-http, graphql-client-first-request, graphql-client-interface), WebSocket (websocket-overview, create-a-websocket-request), capturing request data section complete (capture-overview, capturing-http-requests, capturing-https-traffic, capture-with-proxy, interceptor, syncing-cookies)
- [x] Wave 15 (orders 117–166, 50 pages): sandbox reference ပြီးစီး (pm-info, pm-message, pm-mock, pm-require, pm-state), write-scripts (test-scripts, variables-list, external-package-registries), datasets section (create/example-dataset-views/manage/use-datasets), test-apis (test-apis, end-to-end, integration, regression, performance testing), run-tests (run-tests-manually, run-tests-on-schedule, test-with-monitors), use-collections (add-requests-to-collections, collaborate-with-collections, collection-overview-tab, collections-schemas), publishing-your-api docs section (8 pages), Run in Postman buttons (3 pages), Newman CLI (7 pages), Postman CLI (8 pages)
- [ ] Learning Center ကျန် — request/response deep dives, testing libraries (chai etc.), remaining sandbox pm.* (pm-info, pm-message, pm-mock, pm-require, pm-state), collection run reports/analysis, workspaces admin (private/internal/partner), private API network, admin/enterprise, integrations/webhooks/api-catalog, Postman CLI, Newman — အများကြီး ကျန်သေး
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

## TanStack Query (tanstack.com/query react) — est ~100 — 69 done
- [x] Guides (complete): getting-started, queries, query-keys, query-functions, dependent-queries, parallel-queries, infinite-queries, disabling-queries, paginated-queries, placeholder-query-data, initial-query-data, prefetching, mutations, optimistic-updates, updates-from-mutation-responses, query-invalidation, query-cancellation, network-mode, background-fetching-indicators, filters, query-retries, suspense, polling, ssr, advanced-ssr, window-focus-refetching, scroll-restoration, testing, render-optimizations, request-waterfalls, default-query-function, query-options, important-defaults, typescript, devtools, cache
- [x] API reference functions (wave 10, orders 37–53): useQuery, useMutation, useInfiniteQuery, useQueries, useQueryClient, useIsFetching, useIsMutating, useMutationState, useSuspenseQuery, useSuspenseInfiniteQuery, useSuspenseQueries, usePrefetchQuery, usePrefetchInfiniteQuery, QueryClientProvider, HydrationBoundary, QueryErrorResetBoundary, useQueryErrorResetBoundary
- [x] Plugins + misc (wave 11, orders 54–63): useIsRestoring, persistQueryClient, createSyncStoragePersister, createAsyncStoragePersister, createPersister (experimental_createQueryPersister), broadcastQueryClient, quick-start, installation, react-native, graphql
- [x] Wave 13 guides (orders 64–69): comparison (framework/comparison), does-this-replace-client-state, invalidations-from-mutations, migrating-to-react-query-3, migrating-to-react-query-4, migrating-to-v5
- [ ] API reference ကျန် (optional): queryOptions/infiniteQueryOptions/mutationOptions function refs (slug collision with guides — merge/rename decision needed), Interfaces type pages (generated)

## Zustand (zustand.docs.pmnd.rs) — ~25 — 25 done 🎉 COMPLETE

## အလုပ်လုပ်နည်း (workflow)
1. Backlog ထဲက `[ ]` ကို worker 4 ယောက် (parallel) × 4–10 pages batch နဲ့ ဘာသာပြန်
2. `npm run build` အောင်အောင် verify → commit → `git push` (Vercel auto-deploy)
3. Backlog ကို update → နောက်တစ်ကြိမ် ဒီ file ကို ပြန်ဖတ်ပြီး ဆက်လုပ်ပါ
4. Internal links များကို မမေ့ရန်: dangling link sweep (existing files နဲ့ ကိုက်ညီအောင်)
