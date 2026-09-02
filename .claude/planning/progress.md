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
