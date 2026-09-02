---
title: "create-next-app CLI"
description: "create-next-app CLI — command တစ်ကြောင်းနဲ့ Next.js app အသစ် ဖန်တီးခြင်း; default template (သို့) GitHub က public example တွေနဲ့; --ts, --tailwind, --app, --example စတဲ့ options အားလုံး"
order: 80
source: "https://nextjs.org/docs/app/api-reference/cli/create-next-app"
status: translated
updated: 2026-09-02
---

`create-next-app` CLI က default template (သို့) public GitHub repository တစ်ခုထဲက [example](https://github.com/vercel/next.js/tree/canary/examples) တစ်ခုကို သုံးပြီး — Next.js application အသစ်တစ်ခု ဖန်တီးနိုင်စေပါတယ်။ Next.js ကို စတင်လေ့လာဖို့ အလွယ်ဆုံး နည်းလမ်း ဖြစ်ပါတယ်။

အခြေခံ အသုံးပြုပုံ:

```bash package="pnpm"
pnpm create next-app [project-name] [options]
```

```bash package="npm"
npx create-next-app@latest [project-name] [options]
```

```bash package="yarn"
yarn create next-app [project-name] [options]
```

```bash package="bun"
bun create next-app [project-name] [options]
```

## Reference

အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Options                                 | Description                                                           |
| --------------------------------------- | --------------------------------------------------------------------- |
| `-h` or `--help`                        | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်                                            |
| `-v` or `--version`                     | Version နံပါတ်ကို ပြသသည်                                             |
| `--no-*`                                | Default options တွေကို ပယ်ဖျက်ရန်။ ဥပမာ `--no-ts`                                |
| `--ts` or `--typescript`                | TypeScript project အဖြစ် စတင်ရန် (default)                          |
| `--js` or `--javascript`                | JavaScript project အဖြစ် စတင်ရန်                                    |
| `--tailwind`                            | Tailwind CSS config နဲ့ စတင်ရန် (default)                         |
| `--react-compiler`                      | React Compiler ဖွင့်ထားပြီး စတင်ရန်                                |
| `--eslint`                              | ESLint config နဲ့ စတင်ရန်                                         |
| `--biome`                               | Biome config နဲ့ စတင်ရန်                                          |
| `--no-linter`                           | Linter configuration ကို ကျော်ရန်                                             |
| `--app`                                 | App Router project အဖြစ် စတင်ရန်                                   |
| `--api`                                 | Route handlers တွေပဲ ပါတဲ့ project အဖြစ် စတင်ရန်                         |
| `--src-dir`                             | `src/` directory အတွင်းမှာ စတင်ရန်                                  |
| `--turbopack`                           | Generated package.json ထဲ Turbopack ကို force enable လုပ်ရန် (default ဖွင့်ထား) |
| `--webpack`                             | Generated package.json ထဲ Webpack ကို force enable လုပ်ရန်                        |
| `--import-alias <alias-to-configure>`   | သုံးရမယ့် import alias ကို သတ်မှတ်ရန် (default "@/*")                          |
| `--empty`                               | Project အလွတ်တစ်ခု စတင်ရန်                                           |
| `--use-npm`                             | npm ကို သုံးပြီး application ကို bootstrap လုပ်ရန် CLI ကို ပြောရန်        |
| `--use-pnpm`                            | pnpm ကို သုံးပြီး application ကို bootstrap လုပ်ရန် CLI ကို ပြောရန်       |
| `--use-yarn`                            | Yarn ကို သုံးပြီး application ကို bootstrap လုပ်ရန် CLI ကို ပြောရန်       |
| `--use-bun`                             | Bun ကို သုံးပြီး application ကို bootstrap လုပ်ရန် CLI ကို ပြောရန်        |
| `-e` or `--example [name] [github-url]` | App ကို bootstrap လုပ်ရန် example တစ်ခု                                  |
| `--example-path <path-to-example>`      | Example ဆီ သီးခြား path တစ်ခု သတ်မှတ်ရန်                            |
| `--reset-preferences`                   | သိမ်းထားတဲ့ preferences တွေကို reset လုပ်ရန် CLI ကို ပြောရန်               |
| `--skip-install`                        | Packages install လုပ်ခြင်းကို ကျော်ရန် CLI ကို ပြောရန်                   |
| `--disable-git`                         | Git initialization ကို ပိတ်ရန် CLI ကို ပြောရန်                 |
| `--agents-md`                           | Coding agents တွေကို လမ်းညွှန်ဖို့ `AGENTS.md` နဲ့ `CLAUDE.md` ထည့်ရန် (default)  |
| `--yes`                                 | Options အားလုံးအတွက် အရင် preferences (သို့) defaults တွေကို သုံးရန်                  |

## ဥပမာများ (Examples)

### Default template နဲ့

Default template ကို သုံးပြီး app အသစ်တစ်ခု ဖန်တီးဖို့ — terminal ထဲမှာ အောက်ပါ command ကို run ပါ:

```bash package="pnpm"
pnpm create next-app
```

```bash package="npm"
npx create-next-app@latest
```

```bash package="yarn"
yarn create next-app
```

```bash package="bun"
bun create next-app
```

Installation လုပ်တဲ့အခါ — အောက်ပါအတိုင်း prompts တွေ တွေ့ရပါလိမ့်မယ်:

```txt filename="Terminal"
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
    No, reuse previous settings
    No, customize settings - Choose your own preferences
```

`customize settings` ကို ရွေးရင် — အောက်ပါအတိုင်း prompts တွေ တွေ့ရပါလိမ့်မယ်:

```txt filename="Terminal"
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? No / Yes
```

Prompts တွေ ပြီးသွားတဲ့အခါ — `create-next-app` က သင့် project name နဲ့ folder တစ်ခု ဖန်တီးပြီး လိုအပ်တဲ့ dependencies တွေကို install လုပ်ပေးပါတယ်။

### Linter Options

**ESLint**: ရိုးရာ အသုံးအများဆုံး JavaScript linter ပါ။ `@next/eslint-plugin-next` ကနေ Next.js-specific rules တွေ ပါဝင်ပါတယ်။

**Biome**: ESLint နဲ့ Prettier တို့ရဲ့ လုပ်ဆောင်ချက်တွေကို ပေါင်းစပ်ထားတဲ့ မြန်ဆန်ပြီး ခေတ်မီတဲ့ linter နဲ့ formatter တစ်ခုပါ။ အကောင်းဆုံး performance အတွက် built-in Next.js နဲ့ React domain support တွေ ပါဝင်ပါတယ်။

**None**: Linter configuration ကို လုံးဝ ကျော်လိုက်တာပါ။ နောက်မှ ဘယ်အချိန်မဆို linter တစ်ခု ထပ်ထည့်နိုင်ပါတယ်။

Prompts တွေကို ဖြေပြီးတာနဲ့ — သင် ရွေးချယ်ထားတဲ့ configuration နဲ့ project အသစ်တစ်ခု ဖန်တီးပြီးသွားပါလိမ့်မယ်။

### Official Next.js example တစ်ခုနဲ့

Official Next.js example တစ်ခုကို သုံးပြီး app အသစ်တစ်ခု ဖန်တီးဖို့ — `--example` flag ကို သုံးပါ။ ဥပမာ:

```bash package="pnpm"
pnpm create next-app --example [example-name] [your-project-name]
```

```bash package="npm"
npx create-next-app@latest --example [example-name] [your-project-name]
```

```bash package="yarn"
yarn create next-app --example [example-name] [your-project-name]
```

```bash package="bun"
bun create next-app --example [example-name] [your-project-name]
```

ရနိုင်တဲ့ examples အားလုံးရဲ့ စာရင်းကို setup instructions တွေနဲ့အတူ [Next.js repository](https://github.com/vercel/next.js/tree/canary/examples) မှာ ကြည့်ရှုနိုင်ပါတယ်။

### Public GitHub example ဘယ်ဟာမဆို နဲ့

Public GitHub example ဘယ်ဟာကိုမဆို သုံးပြီး app အသစ်တစ်ခု ဖန်တီးဖို့ — `--example` option ကို GitHub repository ရဲ့ URL နဲ့အတူ သုံးပါ။ ဥပမာ:

```bash package="pnpm"
pnpm create next-app --example "https://github.com/.../" [your-project-name]
```

```bash package="npm"
npx create-next-app@latest --example "https://github.com/.../" [your-project-name]
```

```bash package="yarn"
yarn create next-app --example "https://github.com/.../" [your-project-name]
```

```bash package="bun"
bun create next-app --example "https://github.com/.../" [your-project-name]
```
