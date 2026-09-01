# Task Plan — Myanmar Fullstack JS Docs

## Goal
Build a documentation web app that aggregates the OFFICIAL docs of the fullstack
JavaScript ecosystem (React, Next.js, Node.js, Express, PostgreSQL, Postman,
Prisma ORM, TypeScript, useSWR, TanStack Query, Zustand) and presents them fully
translated into Burmese (မြန်မာဘာသာ).

## Phases

- [x] **P0 — Scaffold** Next.js + TypeScript + Tailwind docs app
- [x] **P1 — Architecture**: content model, sidebar config, search index, tech pages
- [x] **P2 — UI**: sidebar, search, code copy, TOC, prev/next, dark mode, typography
- [x] **P3 — First content batch**: 20 Burmese pages (all 11 techs + cores)
- [x] **P4 — Translation pipeline**: fetch → chunk → LLM → write + progress manifest
- [x] **P5 — Verify**: build clean, all routes 200, screenshots taken
- [x] **P6 — Roadmap page** with volume estimates (~1,700 pages remaining)

## Next steps (user-driven)
- [ ] Run pipeline with an LLM key to expand coverage (small techs first)
- [ ] Deploy (Vercel) + domain choice
- [ ] Search: add per-tech filters, Japanese-style indexing for Burmese (Bigram tokenizer)
- [ ] Review translated pages in a second pass (human-in-the-loop)

## Decisions
- Content = plain Markdown + frontmatter; react-markdown rendering
- Search = minisearch client-side index from build-time script
- Explicit `slug` field in `_meta.json` (slugify(name) is unreliable)
- Pipeline = BYO LLM key; `--stub`/`--dry-run` for testing

## Errors
| Error | Attempt | Resolution |
|-------|---------|------------|
| Date object from YAML frontmatter breaks render | normalise to ISO in content.ts | fixed |
| minisearch `limit` not in SearchOptions | use slice() | fixed |
| slugify mismatch (Next.js→next-js) | explicit slug field | fixed |
| stale next start serving old build | pkill + clean rebuild | fixed |
