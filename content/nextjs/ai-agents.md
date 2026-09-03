---
title: "AI Coding Agents အတွက် Project စနစ်ထည့်သွင်းခြင်း (Setting Up Your Next.js Project for AI Coding Agents)"
description: "AI coding agents တွေ ခေတ်နောက်ကျနေတဲ့ training data တွေရဲ့ အစား နောက်ဆုံးပေါ် documentation တွေကို သုံးနိုင်အောင် Next.js project ကို configure လုပ်နည်း — AGENTS.md/CLAUDE.md နဲ့ bundled docs ညွှန်ပြခြင်း, agentRules option, runtime visibility (MCP server, agent-browser), errors ကနေ fixes မောင်းနှင်ခြင်း, next-dev-loop စတဲ့ Skills များ အကြောင်း"
order: 131
source: "https://nextjs.org/docs/app/guides/ai-agents"
status: translated
updated: 2026-09-03
---

Next.js က version နဲ့ ကိုက်ညီတဲ့ documentation တွေကို `next` package ထဲမှာ တွဲပို့ (bundle) ထားပါတယ် — ဒါက AI coding agents တွေ တိကျပြီး နောက်ဆုံးပေါ် APIs နဲ့ patterns တွေကို ကိုးကားနိုင်စေပါတယ်။ သင့် project ရဲ့ root မှာရှိတဲ့ `AGENTS.md` file က agents တွေကို — သူတို့ရဲ့ training data တွေရဲ့ အစား — ဒီ bundled docs တွေဆီ ညွှန်ပြပေးပါတယ်။

Agents တွေကို bundled docs တွေဆီ ညွှန်ပြပါ၊ သူတို့ကို dev server ရဲ့ **runtime visibility** ပေးပါ၊ **errors တွေက fixes တွေကို မောင်းနှင်စေပါ**၊ ပြီးတော့ multi-step workflows တွေကို **skills** တွေဆီ အပ်နှံပါ။

## အဆင့် 1: Agents တွေကို bundled docs ဆီ ညွှန်ပြခြင်း (Point Agents at the Bundled Docs)

သင့် project root မှာ `AGENTS.md` ရှိပြီး — agents တွေကို bundled docs ဆီ ညွှန်ပြနေတာ သေချာပါစေ။ `next` ကို install လုပ်တဲ့အခါ — Next.js documentation တွေကို `node_modules/next/dist/docs/` မှာ [Next.js documentation site](https://nextjs.org/docs) ရဲ့ ပုံစံအတိုင်း တွဲပို့ထားပါတယ်:

```txt
node_modules/next/dist/docs/
├── 01-app/
│   ├── 01-getting-started/
│   ├── 02-guides/
│   └── 03-api-reference/
├── 02-pages/
├── 03-architecture/
└── index.mdx
```

Agents တွေက network request (သို့) external lookup မလိုအပ်ဘဲ — သင့် install လုပ်ထားတဲ့ version နဲ့ ကိုက်ညီတဲ့ docs တွေကို အမြဲတမ်း ဝင်ရောက်နိုင်ပါတယ်။ [Next.js ကို upgrade လုပ်ခြင်း](/docs/nextjs/upgrading) က bundled docs တွေကိုပါ — ရှိပြီးသား features တွေအတွက် လမ်းညွှန်အသစ်တွေ အပါအဝင် — upgrade လုပ်ပေးပါတယ်။ Claude Code, Codex, Cursor နဲ့ GitHub Copilot အပါအဝင် AI coding agents အများစုက session စတင်တဲ့အခါ `AGENTS.md` ကို အလိုအလျောက် ဖတ်ပါတယ်။

### Project အသစ်များ (New Projects)

[`create-next-app`](/docs/nextjs/create-next-app) က `AGENTS.md` နဲ့ `CLAUDE.md` တွေကို အလိုအလျောက် ထုတ်လုပ်ပေးပါတယ်။ နောက်ထပ် setup မလိုအပ်ပါဘူး:

```bash package="pnpm"
pnpm create next-app@canary
```

```bash package="npm"
npx create-next-app@canary
```

```bash package="yarn"
yarn create next-app@canary
```

```bash package="bun"
bun create next-app@canary
```

Agent files တွေ မလိုချင်ဘူးဆိုရင် — `--no-agents-md` ကို ထည့်ပေးပါ:

```bash
npx create-next-app@canary --no-agents-md
```

### ရှိပြီးသား Project များ (Existing Projects)

Next.js 16.3 (သို့) နောက်ပိုင်းမှာ — `next dev` ကို run လုပ်ပါ။ Environment ထဲမှာ AI coding agent တစ်ခု တွေ့ရှိပြီး managed block မရှိသေးဘူးဆိုရင် — Next.js က project root မှာ `AGENTS.md` နဲ့ `CLAUDE.md` တွေကို အလိုအလျောက် ထုတ်လုပ်ပေးပါတယ်။ ရှိပြီးသား `AGENTS.md` (သို့) `CLAUDE.md` files တွေကို upsert (ရှိရင် update၊ မရှိရင် ထည့်) လုပ်ပေးလို့ — managed block အပြင်ဘက်က content တွေကို ထိန်းသိမ်းပေးပါတယ်:

```md filename="AGENTS.md"
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

```md filename="CLAUDE.md"
@AGENTS.md
```

သင့်ကိုယ်ပိုင် project-specific ညွှန်ကြားချက်တွေကို `<!-- BEGIN:nextjs-agent-rules -->` နဲ့ `<!-- END:nextjs-agent-rules -->` markers တွေရဲ့ အပြင်ဘက်မှာ ထည့်နိုင်ပါတယ် — Next.js က managed block ကို update လုပ်တဲ့အခါ အဲဒါတွေကို ထိန်းသိမ်းပေးပါလိမ့်မယ်။

### Opt out ပြုလုပ်ခြင်း

Auto-generation ကို ဖွင့်ထားတာက default ကောင်းတစ်ခုလို့ ကျွန်ုပ်တို့ ယုံကြည်ပါတယ်။ [nextjs.org/evals ပေါ်က benchmark ရလဒ်တွေ](https://nextjs.org/evals) က — bundled docs တွေကို ဖတ်တဲ့အခါ agents တွေ ပိုကောင်းကောင်း လုပ်ဆောင်တာကို ပြသပါတယ်။ တကယ်ပဲ opt out လုပ်ချင်တယ်ဆိုရင် — သင့် config ထဲမှာ `agentRules` ကို `false` လို့ သတ်မှတ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
}

export default nextConfig
```

### အစောပိုင်း Versions များအတွက် (For Earlier Versions)

Version 16.2 မှာ — docs တွေက bundled ဖြစ်ပေမယ့် `AGENTS.md` ကို အလိုအလျောက် မထုတ်လုပ်ပေးပါဘူး။ Code မရေးခင် `node_modules/next/dist/docs/` မှာရှိတဲ့ bundled docs တွေကို ဖတ်ဖို့ ညွှန်ကြားချက်တစ်ခုနဲ့ — file ကို ကိုယ်တိုင် ထည့်ပေးပါ။

Version 16.1 နဲ့ အစောပိုင်းတွေမှာတော့ — docs တွေကိုပါ bundle မလုပ်ပေးပါဘူး။ Version နဲ့ ကိုက်ညီတဲ့ copy တစ်ခုကို project root ရဲ့ `.next-docs/` ဆီ download လုပ်ပြီး `AGENTS.md` ထဲမှာ index လုပ်ပေးတဲ့ — legacy `agents-md` command ကို သုံးပါ:

```bash
npx @next/codemod@canary agents-md
```

### Network ပေါ်မှ Docs များ (Docs Over the Network)

Next.js docs တွေကို — `node_modules` ကို မဖတ်ဘဲ pages တွေကို fetch လုပ်တဲ့ agents တွေအတွက် — network ပေါ်မှာ Markdown အနေနဲ့လည်း ရနိုင်ပါတယ်။ [nextjs.org/docs](https://nextjs.org/docs) ပေါ်က page URL တိုင်းရဲ့ နောက်မှာ `.md` ကို ထည့်လိုက်ရင် — plain Markdown version တစ်ခု ရပြီး — `Accept: text/markdown` header ပို့တဲ့ clients တွေကလည်း Markdown ကို ရရှိပါတယ်။ Bundle မလုပ်ထားတဲ့ `/docs/messages` အောက်က per-error pages တွေလည်း ဒီထဲမှာ ပါဝင်ပါတယ်။

[`/docs/llms.txt`](https://nextjs.org/docs/llms.txt) မှာရှိတဲ့ index နဲ့ file တစ်ခုတည်းပါတဲ့ [`/docs/llms-full.txt`](https://nextjs.org/docs/llms-full.txt) တို့က [`llms.txt` convention](https://llmstxt.org/) ကို လိုက်နာပါတယ် — ဒါကြောင့် အခြား tools တွေအတွက် `llms.txt` ကို ဖတ်ပြီးသား agents တွေက ဒီနည်းအတိုင်းပဲ Next.js docs တွေကိုပါ ရှာဖွေတွေ့ရှိနိုင်ပါတယ်။

## အဆင့် 2: Agents တွေကို runtime visibility ပေးခြင်း (Give Agents Runtime Visibility)

`next dev` ကို run ပြီး — agent ကို run နေတဲ့ server ပေါ်မှာ အလုပ်လုပ်ခိုင်းပါ။ Runtime errors တွေ, client-side warnings တွေနဲ့ render လုပ်ထားတဲ့ output တွေက browser ထဲမှာ ရှိနေလို့ — agents တွေ ကြည့်လို့ မရပါဘူး။ Next.js က agent တစ်ခု terminal ကနေ ဖတ်နိုင်တဲ့ — ဖြည့်စွက် view နှစ်ခုကို ပြသပေးပါတယ်။

ပထမဆုံး — `next dev` က browser console errors နဲ့ warnings တွေကို terminal ဆီ ပို့ပေးပါတယ် ([`logging.browserToTerminal`](/docs/nextjs/next-config-logging) config) — ဒါကြောင့် agents တွေ ဖတ်နေပြီးသား output ထဲမှာ သူတို့ ပြင်ခိုင်းထားတဲ့ client-side failures တွေ ပါဝင်လာပါတယ်။

`next dev` က သူ့ရဲ့ PID, port နဲ့ URL တွေကိုလည်း `.next/dev/lock` ထဲကို ရေးပေးပါတယ်။ Project တစ်ခုတည်းမှာ ဒုတိယ `next dev` တစ်ခု run လိုက်ရင် — run နေတဲ့ server ရဲ့ URL နဲ့ kill ရမယ့် PID တွေကို print ပေးလို့ — agent တစ်ခုက duplicate server အသစ်တစ်ခု စတင်မယ့်အစား — ရှိပြီးသား server နဲ့ ချိတ်ဆက်ပါတယ်။

**Framework ရဲ့ view** ကတော့ `/_next/mcp` မှာရှိတဲ့ [Next.js MCP server](https://nextjs.org/docs/app/guides/mcp) ကနေ လာပါတယ် — ဒါက run နေတဲ့ dev server ရဲ့ routes, server logs နဲ့ compilation issues တွေကို ဖော်ထုတ်ပေးပါတယ်။ သူ့ရဲ့ `get_compilation_issues` နဲ့ `compile_route` tools တွေက code က dev server ကနေ တိုက်ရိုက် compile ဖြစ်မဖြစ် အစီရင်ခံပေးလို့ — agent တစ်ခုက သိဖို့အတွက် `next build` အပြည့်အစုံ run စရာ မလိုပါဘူး။

**Browser ရဲ့ view** ကတော့ DOM, console, network နဲ့ Web Vitals တွေကို structured text အဖြစ် ဖော်ထုတ်ပေးတဲ့ CLI တစ်ခုဖြစ်တဲ့ [`agent-browser`](https://github.com/vercel-labs/agent-browser) ကနေ လာပါတယ်။ React DevTools ဖွင့်ထားရင် (`agent-browser open` ဆီ `--enable react-devtools` ကို ထည့်ပေးပါ — `next-dev-loop` skill က သင့်အတွက် လုပ်ပေးပါတယ်) — component tree နဲ့ ဘယ် Suspense boundaries တွေ ဆက်ပြီး pending ဖြစ်နေသေးလဲဆိုတာကိုပါ အစီရင်ခံပေးပါတယ်။ Agent တစ်ခုက `react tree` လို command တစ်ခု run ပြီး — သူ မမြင်နိုင်တဲ့ DevTools panel တစ်ခုကို ကြည့်မယ့်အစား — output ကို ဖတ်ကာ နောက်ဘာကို စစ်ဆေးရမလဲ ဆုံးဖြတ်ပါတယ်။

`next-dev-loop` skill က view နှစ်ခုစလုံးအပေါ်မှာ အခြေချပြီး — framework ရဲ့ ရှုထောင့်နဲ့ browser ရဲ့ ရှုထောင့်ကို edit-and-verify loop တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ပေးပါတယ်။

> **သိထားသင့်သည်:** ဒီ tooling တွေရဲ့ နောက်ကွယ်က ဇာတ်လမ်းအတွက် — [Next.js 16.2](https://nextjs.org/blog/next-16-2-ai) နဲ့ [Next.js 16.3](https://nextjs.org/blog/next-16-3-ai-improvements) AI blog posts တွေကို ကြည့်ပါ။

## အဆင့် 3: Errors တွေက fixes တွေကို မောင်းနှင်စေခြင်း (Let Errors Drive the Fixes)

[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ဖွင့်ထားတဲ့အခါ — blocking error တစ်ခုက label တပ်ထားတဲ့ fixes တွေကို ပြသပေးပြီး — fix တစ်ခုချင်းစီမှာ trade-off မတူညီပါဘူး။ Dev overlay မှာ ရွေးထားတဲ့ fix ကို paste-ready prompt တစ်ခုအဖြစ် ထုပ်ပိုးပေးတဲ့ **Copy prompt** button တစ်ခုပါ ထည့်ပေးပါတယ်။ ဒီ prompt က agent ကို — ကိုက်ညီတဲ့ error page ကို ဖတ်ခြင်း၊ canonical pattern ကို အသုံးပြုခြင်းနဲ့ ရလဒ်ကို runtime မှာ verify လုပ်ခြင်းတစ်လျှောက် လမ်းညွှန်ပေးပါတယ်။

ဒီ menu က `next dev` terminal နဲ့ `next build` output နှစ်ခုလုံးမှာပါ print လုပ်ပေးလို့ — CI logs တွေကို ဖတ်နေတဲ့ agent တစ်ခုကလည်း မြင်ရပါတယ်:

```txt filename="Terminal"
Route "/products/[slug]": Next.js encountered uncached data during prerendering.

`fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route
from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] Cache the data access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at ProductPage (app/products/[slug]/page.tsx:52:32)
    ...
```

`next dev` ထဲမှာ — stack frame က dev overlay ရော terminal မှာပါ သင့် source ဆီ ညွှန်ပြပေးပါတယ်။ Production build က server code တွေကို minify လုပ်တာမို့ — build error တစ်ခုတည်းနဲ့ မလုံလောက်တဲ့အခါ — [`next build --debug-prerender`](https://nextjs.org/docs/app/guides/building#debugging-build-errors) က server source maps တွေကို ဖွင့်ပေးပြီး — ပထမဆုံး failure ကိုကျော်ကာ ဆက်လုပ်ဆောင်ပေးပါတယ်။

`Learn more` link က — agents တွေ ဖတ်ဖို့ ရည်ရွယ်ရေးသားထားတဲ့ [`/docs/messages`](https://nextjs.org/docs/messages/blocking-prerender-dynamic) အောက်က per-error page တစ်ခုဆီ ရောက်သွားပါတယ်။ Page တစ်ခုချင်းစီက ပုံစံတူဖြစ်ပြီး — fix တိုင်းအတွက် canonical patterns, အခြား fixes တွေနဲ့ ယှဉ်တဲ့ trade-offs တွေ၊ ပထမဆုံး ကြိုးစားမှုမှာ agent တစ်ခု လွတ်သွားနိုင်ခြေရှိတဲ့ gotchas တွေ ပါဝင်ပါတယ်။ [Instant navigation guide](https://nextjs.org/docs/app/guides/instant-navigation#ai-workflow) က — insight တစ်ခုကို ဖတ်တာကနေ — fix မတိုင်ခင် fail ဖြစ်ပြီး fix ဝင်ပြီးတာနဲ့ pass ဖြစ်တဲ့ `instant()` test တစ်ခု ရေးတာအထိ — agent တစ်ခု ဒီ errors တွေပေါ်မှာ run တဲ့ loop အပြည့်အစုံကို လမ်းညွှန်ပေးပါတယ်။

## အဆင့် 4: Multi-step Workflows တွေကို Skills တွေဆီ အပ်နှံခြင်း (Hand Multi-Step Workflows to Skills)

Framework အသိပညာက Skills တွေကနေ မဟုတ်ဘဲ — bundled docs တွေကနေ လာပါတယ်။ [Benchmark ရလဒ်တွေ](https://nextjs.org/evals) က — အမြဲတမ်း ရနိုင်တဲ့ context (always-available context) က on-demand retrieval ထက် ပိုကောင်းတာကို ပြသပါတယ်။ Skills တွေက lookups တွေထက် workflows တွေဖြစ်တဲ့ အလုပ်တွေကို ဖုံးအုပ်ပေးပါတယ် — ဥပမာ app တစ်ခုလုံးမှာ Cache Components (သို့) Partial Prefetching တွေကို adopt လုပ်တာမျိုးပါ။ Next.js Skills တွေက ဒါတွေကို — agent တစ်ခု install လုပ်ပြီး လိုက်နာရမယ့် ဖွဲ့စည်းထားတဲ့ ညွှန်ကြားချက်တွေအဖြစ် ထုပ်ပိုးပေးပြီး — အလုပ်တွေကို အစီအစဉ်တကျ စီစဉ်ကာ — တစ်လျှောက်လုံး သက်ဆိုင်ရာ docs တွေနဲ့ runtime tooling တွေဆီ ညွှန်ပြပေးပါတယ်။

ဒီ Skills တွေရဲ့ source တွေကို [Next.js repository](https://github.com/vercel/next.js/tree/canary/skills) ထဲမှာ ကြည့်ရှုနိုင်ပြီး — [skills.sh ပေါ်မှာ](https://www.skills.sh/vercel/next.js) ရှာဖွေနိုင်ပါတယ်။

Skills တွေက workflow အမျိုးအစား သုံးမျိုးကို ဆောင်ရွက်ပေးပါတယ်:

- **Runtime foundations** — `next-dev-loop` လိုမျိုးက coding task တိုင်းကို ထပ်ခါတလဲလဲ လုပ်လို့ရတဲ့ inspect, edit နဲ့ verify cycle တစ်ခု ပေးပါတယ်။
- **Interactive workflows** — app တစ်ခုလုံးမှာ Cache Components (သို့) Partial Prefetching adopt လုပ်တာလိုမျိုး — user checkpoints တွေနဲ့အတူ ပိုကျယ်ပြန့်တဲ့ အပြောင်းအလဲတွေကို ပြုလုပ်ပါတယ်။
- **Unattended loops** — verify လုပ်လို့ရတဲ့ goal တစ်ခုဆီ ဦးတည် အလုပ်လုပ်ပြီး — တကယ့် ဆုံးဖြတ်ချက်တွေအတွက်ပဲ ရပ်တန့်ပါတယ်။

### `next-dev-loop`

[`next-dev-loop`](https://www.skills.sh/vercel/next.js/next-dev-loop) runtime foundation က [MCP server](https://nextjs.org/docs/app/guides/mcp) နဲ့ browser ကို သုံးပြီး — run နေတဲ့ dev server ပေါ်မှာ အပြောင်းအလဲတွေကို verify လုပ်ပေးပါတယ်။

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-dev-loop
```

ပြီးရင် agent ကို ဒီ prompt ပေးပါ:

```prompt
Edit တစ်ခုစီ ပြီးတိုင်း — page က runtime မှာ အလုပ်လုပ်နေသေးလားဆိုတာ next-dev-loop Skill ကို သုံးပြီး verify လုပ်ပါ။
```

### `next-cache-components-adoption`

[`next-cache-components-adoption`](https://www.skills.sh/vercel/next.js/next-cache-components-adoption) Skill က app တစ်ခုကို [Cache Components](/docs/nextjs/caching) ဆီ migrate လုပ်ပေးပါတယ်:

1. Flag ကို ဖွင့်ပြီး — prerender မလုပ်နိုင်တဲ့ routes တွေကို ရှာဖွေပါတယ်။
2. Feature တစ်ခုချင်းစီကို ပြင်ဆင်ပေးပြီး — ရှေ့ဆက်မလုပ်ခင် သင့်ဆီ အသိပေးပါတယ်။
3. Feature တစ်ခုကို မပြီးပြတ်ခင် — `next dev` နဲ့ `next build` နဲ့ အတည်ပြုပါတယ်။

အလုပ်တွေကို PR တွဲတွေအဖြစ် ထည့်မလား (သို့) branch တစ်ခုတည်းမှာ ထားမလားဆိုတာကို သင်က ရွေးချယ်ပါတယ်။

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-cache-components-adoption
```

ပြီးရင် agent ကို ဒီ prompt ပေးပါ:

```prompt
ဒီ project ထဲမှာ next-cache-components-adoption Skill ကို သုံးပြီး Cache Components တွေကို adopt လုပ်ပါ။
```

### `next-cache-components-optimizer`

[`next-cache-components-optimizer`](https://www.skills.sh/vercel/next.js/next-cache-components-optimizer) Skill က target route တစ်ခု (သို့) route အစုတစ်ခုကို ယူပြီး — click လုပ်လိုက်တဲ့အချိန်မှာ သင်လိုချင်တဲ့ UI ပေါ်နေဖို့ ဦးတည် အလုပ်လုပ်ပါတယ်:

1. သင်နာမည်ပေးလိုက်တဲ့ UI အတွက် fail ဖြစ်မယ့် [`instant()`](https://nextjs.org/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) test တစ်ခု ရေးပါတယ်။
2. Route ကို pass ဖြစ်တဲ့အထိ refactor လုပ်ပါတယ် — မကြာခဏဆိုသလို data read တစ်ခုကို `<Suspense>` boundary အောက်ကို ရွှေ့ခြင်းဖြင့်ပါ။
3. Pass ဖြစ်တဲ့ test ကို refactoring နဲ့အတူ commit လုပ်လို့ — နောင်ဖြစ်လာမယ့် regressions တွေကို ဖမ်းမိစေပါတယ်။

ဒါက [Cache Components](/docs/nextjs/caching) နဲ့ build ဖြစ်နေပြီးသား route တစ်ခု လိုအပ်ပါတယ်။

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-cache-components-optimizer
```

ပြီးရင် agent ကို ဒီလိုမျိုး prompt တစ်ခု ပေးပါ:

```prompt
next-cache-components-optimizer Skill ကို သုံးပြီး /settings ကနေ /dashboard ကို သွားတဲ့ navigation ကို instant ဖြစ်အောင် လုပ်ပါ။ Header နဲ့ project list တွေက instant UI ရဲ့ အစိတ်အပိုင်း ဖြစ်သင့်ပါတယ်။
```

### `next-partial-prefetching-adoption`

[`next-partial-prefetching-adoption`](https://www.skills.sh/vercel/next.js/next-partial-prefetching-adoption) Skill က app တစ်ခုကို — links တွေ App Shell တစ်ခုတည်းကို မျှဝေတဲ့ — [Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) ဆီ ရွှေ့ပေးပါတယ်:

1. ရှိပြီးသား `<Link prefetch={true}>` calls တွေကို သင့်နဲ့အတူ စစ်ဆေး (audit) ပါတယ်။
2. Flag ကို ဖွင့်ပြီး — ပေါ်လာတဲ့ insights တွေကို ဖြေရှင်းပေးပါတယ်။
3. URL data တွေကို နောက်ပိုင်းမှာ prefetch လုပ်ဖို့ ထိုက်တန်နိုင်တဲ့ routes တွေကို မှတ်သားပေးပါတယ်။

ဒါအတွက် [Cache Components](/docs/nextjs/caching) တွေကို အရင်ကတည်းက adopt လုပ်ထားဖို့ လိုအပ်ပါတယ်။

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

ပြီးရင် agent ကို ဒီ prompt ပေးပါ:

```prompt
ဒီ project ထဲမှာ next-partial-prefetching-adoption Skill ကို သုံးပြီး Partial Prefetching တွေကို adopt လုပ်ပါ။
```
