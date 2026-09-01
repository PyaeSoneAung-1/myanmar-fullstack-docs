# Task Plan — Myanmar Fullstack JS Docs

## Goal
Build a documentation web app that aggregates the OFFICIAL docs of the fullstack
JavaScript ecosystem (React, Next.js, Node.js, Express, PostgreSQL, Postman,
Prisma ORM, TypeScript, useSWR, TanStack Query, Zustand) and presents them fully
translated into Burmese (မြန်မာဘာသာ).

## Phases

- [ ] **P0 — Scaffold** Next.js + TypeScript + Tailwind docs app in
      `projects/myanmar-fullstack-docs`
- [ ] **P1 — Architecture**: content model (Burmese .md with frontmatter),
      sidebar config, search index, tech landing pages
- [ ] **P2 — UI**: sidebar, topbar search, code copy, TOC, prev/next,
      original-link attribution, Burmese-friendly typography, dark mode
- [ ] **P3 — First content batch**: hand-quality Burmese translations
      (all 11 techs × getting-started, plus full core coverage of the small ones:
      Zustand, SWR)
- [ ] **P4 — Translation pipeline**: `scripts/translate.mjs` that fetches official
      doc sources (GitHub), chunks, calls LLM API for Burmese, writes content,
      tracks progress manifest
- [ ] **P5 — Verify**: `next build`, run dev server, screenshots
- [ ] **P6 — Roadmap doc**: volume estimates per tech, backlog, how to keep
      translating

## Decisions
- Content = plain Markdown + frontmatter (not MDX) → react-markdown rendering
- Search = client-side index generated at build time (minisearch)
- One repo, static-ish docs site, deployable on Vercel later

## Errors
| Error | Attempt | Resolution |
|-------|---------|------------|
