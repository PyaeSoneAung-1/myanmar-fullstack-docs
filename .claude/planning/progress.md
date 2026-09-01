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
