# Progress Log

## 2026-09-01 — Session 1
- Scaffolded Next.js 16 + TS + Tailwind v4 docs app at
  `projects/myanmar-fullstack-docs` (create-next-app).
- Content architecture: `content/<tech>/_meta.json` + `.md` with frontmatter,
  `src/lib/content.ts` (fs + gray-matter), search index builder script.
- UI: sidebar (categories→techs→pages, collapsible), Ctrl+K search (minisearch),
  code copy, TOC, prev/next, source links, dark mode, Noto Sans Myanmar
  self-hosted (3 woff2), roadmap page.
- Content: 20 pages Burmese (11 techs getting-started + Zustand 4 + SWR 3 +
  Express 3 + Prisma 2 + PostgreSQL 2). 4 parallel workers + manual writing.
- Translation pipeline `scripts/translate.mjs` + `scripts/sources.json` —
  verified dry-run against real repos (zustand: 41 files, chunked OK).
- Errors:
  - gray-matter parses `updated: 2026-09-01` → Date → React child error. Fix:
    normalize `data.updated` to ISO string in content.ts.
  - minisearch TS: `limit` not in SearchOptions → use `.slice(0,12)`.
  - slugify("Next.js") → "next-js" ≠ folder "nextjs" → added explicit `slug`
    field in `_meta.json` for all techs.
  - Stale `next start` kept serving old build (EADDRINUSE on restart, mixed
    404s) → pkill -f next-server, clean rebuild, verified all routes 200.
- Git repo initialized (2 commits).

## 2026-09-02 — Session 2 (wave 7: +48 → 289 pages)
- Translated +48 pages via 8 parallel workers (2 waves): React +17 (learn: your-first-component, writing-markup-with-jsx, updating-objects/arrays-in-state, understanding-your-ui-as-a-tree, you-might-not-need-an-effect, scaling-up-with-reducer-and-context, strict-mode, build-a-react-app-from-scratch, editor-setup; API: useState, use, useEffect, useEffectEvent, useImperativeHandle, useRef, built-in-components), Next.js +7 (project-structure, image, fonts, forms, not-found, parallel-routes, intercepting-routes), Node.js +14 (reading-files, how-much-javascript, browser differences, V8, fetching-data, dont-block-event-loop, dev-vs-prod, security-best-practices, streams, backpressuring, TS-native/transpile/runner/publishing), Express +3 (security, resources, contribution-guide), Prisma +4 (logging, debugging, client-extensions, deploy), Postman +3 (testing, building-workflows, creating-workspaces).
- Link sweep: rewrote every dangling internal link (68 targets) — React aliases → existing pages (props/events/use-effect/use-ref), Next.js API/file-convention links → verified official nextjs.org URLs (0 internal 404s remain).
- Notable: prisma.io docs are now versioned (v7 classic vs v8 default); nodejs.org/learn TS pages renamed; react.dev strict-mode is a Reference page not Learn.
- Verified: npm run build clean (295 static routes), homepage shows 289 pages, all new page routes 200.

## 2026-09-02 — Session 3 (wave 8: +42 → 331 pages)
- Translated +42 pages via 12 parallel workers (3 rounds): React +10 API reference (useReducer, useMemo, useCallback, useContext, useLayoutEffect, forwardRef, createContext, Suspense, lazy, startTransition, orders 50–59), TypeScript +6 declaration-files section (reference/dos-donts/deep-dive/publishing/consumption/templates, orders 20–25), Next.js +7 file conventions (page/layout/loading/error/default/template/forbidden, orders 26–33 — not-found merged into existing not-found.md, duplicate removed), Postman +6 (quick-start, request-basics, parameters, headers, pre-request-scripts, intro-monitors, orders 13–18), Node.js +6 (es6-beyond, debugging, profiling, websocket, enterprise-network-configuration, different-filesystems, orders 39–44), Prisma +7 Prisma-8 pages (the-data-contract, psl-syntax, the-migration-graph, editing-a-migration, rollbacks-and-recovery, authoring-custom-middleware, built-in-cache, orders 23–29).
- Source-drift fixes: Postman docs rebuilt (Fern) — URLs moved to /use/* and /tests-and-scripts/*; clean markdown via append `.md`, index at /llms.txt. Prisma docs default to v8 (contract/middleware paradigm), v7 archived at /docs/orm/v7/**. TypeScript declaration-files/structure.html is gone (404). Node learn canonical = nodejs.org/learn (no /en/).
- QA: automated checks — 0 order collisions, 0 dead internal links, balanced fences, no English-prose leaks; duplicate-source sweep found 5 groups total (1 fixed this wave: nextjs not-found; 4 pre-existing: express getting-started/installing, nodejs file-system/reading-files, react describing-the-ui/describing-ui, zustand immer/middleware — future cleanup).
- Verified: npm run build clean, 331 pages indexed, homepage/roadmap counts auto-update from content.
