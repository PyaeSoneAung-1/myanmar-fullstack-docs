---
title: "Next.js MCP Server (Coding Agents အတွက်)"
description: "Next.js 16+ ရဲ့ MCP (Model Context Protocol) support — coding agents တွေ သင့် application ရဲ့ အတွင်းပိုင်း state ကို real-time ဝင်ရောက်ကြည့်ရှုနိုင်အောင် next-devtools-mcp package နဲ့ ချိတ်ဆက်နည်း; capabilities, ရရှိနိုင်တဲ့ tools, development workflow, ဥပမာများ နဲ့ troubleshooting အကြောင်း"
order: 132
source: "https://nextjs.org/docs/app/guides/mcp"
status: translated
updated: 2026-09-03
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) က open standard (ပွင့်လင်းစံနှုန်း) တစ်ခုဖြစ်ပြီး — AI agents နဲ့ coding assistants တွေက သင့် applications တွေနဲ့ စံသတ်မှတ်ထားတဲ့ interface တစ်ခုကနေတစ်ဆင့် အပြန်အလှန် ဆက်သွယ် လုပ်ဆောင်နိုင်အောင် ခွင့်ပြုပေးပါတယ်။

Next.js 16+ မှာ MCP support ပါဝင်ပြီး — coding agents (AI နဲ့ ကုဒ်ရေးသားရာမှာ ကူညီတဲ့ agents) တွေက သင့် application ရဲ့ အတွင်းပိုင်း အခြေအနေတွေကို real-time မှာ ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်။ ဒီ feature ကို သုံးဖို့ — [`next-devtools-mcp`](https://www.npmjs.com/package/next-devtools-mcp) package ကို install လုပ်ပါ။

## စတင်ခြင်း (Getting Started)

**Requirements (လိုအပ်ချက်များ):** Next.js 16 (သို့) အထက်

`next-devtools-mcp` ကို သင့် project ရဲ့ root မှာရှိတဲ့ `.mcp.json` file ထဲ ထည့်ပါ:

```json filename=".mcp.json"
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

ဒါပါပဲ! Development server ကို စတင်လိုက်တာနဲ့ — `next-devtools-mcp` က run နေတဲ့ သင့် Next.js instance ကို အလိုအလျောက် ရှာဖွေတွေ့ရှိပြီး ချိတ်ဆက်သွားပါလိမ့်မယ်။

နောက်ထပ် configuration options တွေအတွက် — [next-devtools-mcp repository](https://github.com/vercel/next-devtools-mcp) ကို ကြည့်ပါ။

## လုပ်ဆောင်နိုင်စွမ်းများ (Capabilities)

`next-devtools-mcp` က coding agents တွေကို တဖြည်းဖြည်း ကြီးထွားလာနေတဲ့ လုပ်ဆောင်နိုင်စွမ်း အစုအဝေးတစ်ခု ပေးပါတယ်:

### Application Runtime Access (application runtime သုံးခွင့်)

- **Error Detection (error ရှာဖွေခြင်း)**: သင့် dev server ကနေ လက်ရှိ build errors, runtime errors နဲ့ type errors တွေကို ထုတ်ယူပါတယ်
- **Live State Queries (တိုက်ရိုက် state မေးမြန်းခြင်း)**: Real-time application state နဲ့ runtime information တွေကို ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်
- **Page Metadata**: Page routes, components နဲ့ rendering အသေးစိတ်တွေကို မေးမြန်းနိုင်ပါတယ်
- **Server Actions**: Server Actions တွေနဲ့ component hierarchies (component အဆင့်ဆင့်) တွေကို စစ်ဆေးနိုင်ပါတယ်
- **Development Logs**: Development server logs နဲ့ console output တွေကို ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်

### Development Tools (development tools များ)

- **Documentation Gateway**: သင့် agent ကို — သင် install လုပ်ထားတဲ့ Next.js နဲ့အတူ ပါလာတဲ့ version-accurate docs (`node_modules/next/dist/docs/` ထဲမှာ) တွေဆီ ညွှန်ပေးလို့ — ရှင်းလင်းချက်တွေနဲ့ ထုတ်ပေးတဲ့ code တွေက သင် run နေတဲ့ version နဲ့ ကိုက်ညီနေပါတယ်
- **Browser Testing**: Browser ထဲမှာ pages တွေကို စစ်ဆေး အတည်ပြုဖို့ [Playwright MCP](https://github.com/microsoft/playwright-mcp) နဲ့ ပေါင်းစပ်ထားပါတယ်

> **မှတ်ချက်:** Next.js team က ဒီလုပ်ဆောင်နိုင်စွမ်းတွေကို တက်ကြွစွာ ချဲ့ထွင်နေပါတယ်။ Agent development အတွေ့အကြုံ ပိုကောင်းစေဖို့ tools အသစ်တွေနဲ့ features အသစ်တွေကို ပုံမှန် ထည့်သွင်းနေပါတယ်။

## Development လုပ်ငန်းစဉ် (Development Workflow)

1. သင့် Next.js development server ကို စတင်ပါ:

```bash package="pnpm"
pnpm dev
```

```bash package="npm"
npm run dev
```

```bash package="yarn"
yarn dev
```

```bash package="bun"
bun dev
```

2. သင့် Coding Agent က `next-devtools-mcp` ကနေတစ်ဆင့် run နေတဲ့ Next.js instance ဆီ အလိုအလျောက် ချိတ်ဆက်ပါလိမ့်မယ်

3. Pages တွေကြည့်ဖို့ သင့် application ကို browser ထဲမှာ ဖွင့်ပါ

4. Insights နဲ့ diagnostics တွေအတွက် သင့် agent ကို မေးမြန်းပါ (အောက်က ဥပမာတွေကို ကြည့်ပါ)

### ရရှိနိုင်သော Tools (Available Tools)

`next-devtools-mcp` ကနေတစ်ဆင့် agents တွေက အောက်ပါ tools တွေကို သုံးနိုင်ပါတယ်:

- **`get_errors`**: သင့် dev server ကနေ လက်ရှိ build errors, runtime errors နဲ့ type errors တွေကို ထုတ်ယူပါတယ်
- **`get_logs`**: Browser console logs နဲ့ server output တွေ ပါဝင်တဲ့ development log file ရဲ့ path ကို ရယူပါတယ်
- **`get_page_metadata`**: Routes, components နဲ့ rendering information အပါအဝင် — သီးခြား pages တစ်ခုချင်းစီအကြောင်း metadata ရယူပါတယ်
- **`get_project_metadata`**: Project structure, configuration နဲ့ dev server URL တွေကို ထုတ်ယူပါတယ်
- **`get_routes`**: Filesystem ကို စကင်ဖတ်ပြီး entry points တွေ ဖြစ်လာမယ့် routes အားလုံးကို ရယူပါတယ်။ Router type (appRouter, pagesRouter) အလိုက် အုပ်စုဖွဲ့ပြီး ပြန်ပေးပါတယ်။ Dynamic segments တွေက `[param]` (သို့) `[...slug]` patterns အနေနဲ့ ပေါ်လာပါတယ်
- **`get_server_action_by_id`**: Server Actions တွေကို သူတို့ရဲ့ ID နဲ့ ရှာဖွေပြီး source file နဲ့ function name ကို ဖော်ထုတ်ပါတယ်
- **`get_compilation_issues`**: Bundler ကနေ project တစ်ခုလုံးအတွက် compilation warnings နဲ့ errors တွေကို ထုတ်ယူပါတယ်။ Turbopack မှာပဲ ရပါတယ်
- **`compile_route`**: HTTP request တစ်ခု မလုပ်ဘဲ route တစ်ခုရဲ့ on-demand compilation ကို trigger လုပ်ပါတယ်။ `routeSpecifier` (ဥပမာ — `get_routes` က ပြန်ပေးတဲ့ `/blog/[slug]`) (သို့) `path` (ဥပမာ — `/blog/hello-world`) တစ်ခုကို လက်ခံပြီး — dev router ရဲ့ live route table ကို သုံးကာ ကိုက်ညီတဲ့ route ဆီ resolve လုပ်ပါတယ်။ Route အတွက် compilation issues တွေကို ပြန်ပေးပါတယ်။ Turbopack မှာပဲ ရပါတယ်

## Agents တွေနဲ့ အသုံးပြုခြင်း (Using with Agents)

MCP-compatible (MCP နဲ့ လိုက်ဖက်ညီတဲ့) Coding Agents တွေက သင့် Next.js development server ကို အလိုအလျောက် ရှာဖွေပြီး ချိတ်ဆက်နိုင်လို့ — သင့် project အကြောင်း ကြွယ်ဝတဲ့ context တွေနဲ့အတူ လုပ်ဆောင်နိုင်ပါတယ်။

### Agent အကူအညီနဲ့ ဖွံ့ဖြိုးတိုးတက်မှုအတွက် အကျိုးကျေးဇူးများ (Benefits)

Agents တွေက ဒါတွေကို လုပ်နိုင်ပါတယ်:

- **Context-aware suggestions ပေးနိုင်ခြင်း**: သင့် လက်ရှိ structure ပေါ် အခြေခံပြီး features အသစ်တွေ ထည့်ဖို့ သင့်တော်တဲ့ နေရာကို အကြံပြုနိုင်ပါတယ်
- **Live application state ကို မေးမြန်းနိုင်ခြင်း**: Development ကာလအတွင်း လက်ရှိ configuration, routes နဲ့ middleware တွေကို စစ်ဆေးနိုင်ပါတယ်
- **သင့် app router ရဲ့ pages layout ကို နားလည်ခြင်း**: ဘယ် page နဲ့ layout ကို render လုပ်နေလဲ အတိအကျ သိနိုင်ပါတယ်
- **မှန်ကန်တဲ့ implementations တွေ ပေးနိုင်ခြင်း**: သင့် project ရဲ့ patterns နဲ့ conventions တွေကို လိုက်နာတဲ့ code တွေ ထုတ်ပေးနိုင်ပါတယ်

## ဥပမာများ (Examples)

### Error ရှာဖွေခြင်းနဲ့ စစ်ဆေးခြင်း

သင့် agent ကို errors တွေအကြောင်း real-time မှာ မေးကြည့်ပါ:

```bash
User: "What errors are currently in my application?"
```

Agent က ဒါတွေကို လုပ်ပါလိမ့်မယ်:

- `next-devtools-mcp` ကနေတစ်ဆင့် run နေတဲ့ သင့် Next.js application ကို မေးမြန်းပါလိမ့်မယ်
- လက်ရှိ build errors, runtime errors နဲ့ type errors တွေကို ထုတ်ယူပါလိမ့်မယ်
- Errors တွေကို ခွဲခြမ်းစိတ်ဖြာပြီး လုပ်ဆောင်လို့ရတဲ့ အဖြေရှင်းနည်းတွေ ပေးပါလိမ့်မယ်

<details>
<summary>Agent ရဲ့ တုံ့ပြန်မှု (နှိပ်ပြီး ချဲ့ကြည့်ရန်)</summary>

```bash
> fix errors on the page

⏺ I'll help you fix the errors on the page. Let me first check what errors exist by looking at the
  current state of the project.

⏺ next-devtools - nextjs_runtime (MCP)(action: "discover_servers")
⏺ next-devtools - nextjs_runtime (MCP)(action: "call_tool", toolName: "get_errors")

⏺ I found a hydration error on the /about page. The error shows that the server is rendering
  "server" but the client is rendering "client", causing a mismatch. Let me create a todo list and fix
   this issue.

⏺ Perfect! Now let me check for errors on the page.           01:14 PM  claude-sonnet-4-5-20250929

⏺ next-devtools - nextjs_runtime (MCP)(action: "call_tool", toolName: "get_errors")
  ⎿ {
      "success": true,
      "port": 3000,
      "toolName": "get_errors",
      "result": {
        "content": [
          {
            "type": "text",
            "text": "# Found errors in 1 browser session(s)\n\n## Session: /about\n\n**1 error(s)
     found**\n\n### Runtime Errors\n\n#### Error 1 (Type: recoverable)\n\n**Error**: Hydration failed
```

</details>

### Upgrade လုပ်ခြင်းနဲ့ Best Practices

Next.js concepts တွေနဲ့ migrations တွေအတွက် အကူအညီ ရယူပါ:

```bash
User: "Help me upgrade my Next.js app to version 16"
```

Agent က official upgrade codemod (`npx @next/codemod@latest upgrade latest`) ကို run လုပ်ပြီး — breaking changes တွေကို ကိုင်တွယ်ဖို့ အဆင့်ဆင့် ညွှန်ကြားချက်တွေ ပေးပါလိမ့်မယ်။

Conceptual မေးခွန်းတွေ မေးကြည့်ပါ:

```bash
User: "When should I use 'use client' in App Router?"
```

Agent က သင့် project နဲ့အတူ ပါလာတဲ့ version-accurate Next.js docs တွေကို ဖတ်ပြီး — သင့် codebase ထဲက ဥပမာတွေနဲ့အတူ documentation ကို အခြေခံတဲ့ ရှင်းလင်းချက်တွေ ပေးပါလိမ့်မယ်။

## ဘယ်လို အလုပ်လုပ်လဲ (How It Works)

Next.js 16+ မှာ သင့် development server ထဲမှာ run လုပ်တဲ့ built-in MCP endpoint တစ်ခု — `/_next/mcp` မှာ ပါဝင်ပါတယ်။ `next-devtools-mcp` package က ဒီ endpoints တွေကို အလိုအလျောက် ရှာဖွေတွေ့ရှိပြီး ဆက်သွယ်နိုင်လို့ — အောက်ပါတို့ကို လုပ်နိုင်ပါတယ်:

- Port အမျိုးမျိုးပေါ်မှာ run နေတဲ့ Next.js instances အများအပြားကို ချိတ်ဆက်နိုင်ခြင်း
- Tool calls တွေကို သင့်တော်တဲ့ Next.js dev server ဆီ forward လုပ်နိုင်ခြင်း
- Coding agents တွေအတွက် unified interface (တစ်စုတစ်ဝည်း interface) တစ်ခု ပေးနိုင်ခြင်း

ဒီ architecture က agent interface ကို internal implementation ကနေ ခွဲထုတ်ထားလို့ — `next-devtools-mcp` က Next.js project အမျိုးမျိုးမှာ ချောမွေ့စွာ အလုပ်လုပ်နိုင်ပါတယ်။

## Troubleshooting (ပြဿနာဖြေရှင်းခြင်း)

### MCP server ချိတ်ဆက်မှု မဖြစ်နေလျှင်

- Next.js v16 (သို့) အထက် သုံးနေတာ သေချာပါစေ
- `next-devtools-mcp` ကို သင့် `.mcp.json` ထဲမှာ configure လုပ်ထားကြောင်း စစ်ဆေးပါ
- Development server ကို စတင်ပါ: `npm run dev`
- Server က run ပြီးသား ဖြစ်နေရင် ပြန်စတင်ကြည့်ပါ
- သင့် coding agent က MCP server configuration ကို load လုပ်ထားကြောင်း စစ်ဆေးပါ
