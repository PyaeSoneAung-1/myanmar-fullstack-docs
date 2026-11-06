---
title: "create-prisma နဲ့ Prisma ORM app အသစ် တည်ဆောက်ခြင်း (create-prisma)"
description: "create-prisma ကို သုံးပြီး Prisma Composer၊ Prisma Postgres နဲ့ deploy လုပ်နည်း အဆင်သင့် ပါဝင်တဲ့ Prisma ORM app အသစ် တစ်ခု scaffold လုပ်နည်း — prompts၊ flags၊ templates နဲ့ generated scripts များ"
order: 49
source: "https://www.prisma.io/docs/prisma-orm/create-prisma"
status: translated
updated: 2026-11-06
---

`create-prisma` က app template တစ်ခုကနေ Prisma ORM project အသစ် တစ်ခု ဖန်တီးပေးပါတယ်။ Prisma ORM ကို install လုပ်၊ contract ကို emit လုပ်ပြီး deploy လုပ်လို့ရတဲ့ [Prisma Composer](https://www.prisma.io/docs/composer) app တစ်ခု generate လုပ်ပေးပါတယ်။ PostgreSQL project တွေက Composer ရဲ့ native Prisma Postgres provider ကို သုံးပြီး migrations နဲ့ typed runtime client ပါ ပါဝင်ပါတယ်။

အလုပ်လုပ်နေတဲ့ app တစ်ခုကနေ စချင်တဲ့အခါ ဒါကို သုံးပါ။ App ရှိပြီးသားဆိုရင်တော့ [Add Prisma ORM to an existing PostgreSQL database](/docs/prisma/add-to-existing-project-postgresql) ဒါမှမဟုတ် [Add Prisma ORM to an existing MongoDB database](/docs/prisma/add-to-existing-project-mongodb) ကို လိုက်ပါ။

> **မှတ်ချက် — Prisma ORM 7**
>
> `create-prisma@latest` က Prisma ORM 8 ကို scaffold လုပ်ပါတယ်။ Prisma ORM 7 app တစ်ခု scaffold လုပ်ချင်ရင် `npm create prisma@stable` ကို run ပြီး [Prisma ORM 7 setup paths](https://www.prisma.io/docs/v7/getting-started) ကို လိုက်ပါ။

## ကြိုတင်လိုအပ်ချက်များ (Prerequisites)

* **Node.js 22.18 ဒါမှမဟုတ် အထက် (22 line မှာ)၊ 24.11 ဒါမှမဟုတ် အထက် (24 line မှာ)၊ ဒါမှမဟုတ် 26 ဒါမှမဟုတ် အထက်။** `node --version` နဲ့ စစ်ပါ။ Node.js 24 ကို အကြံပြုပါတယ်။ [Supported versions](/docs/prisma/supported-versions) မှာ floor အားလုံး ပါပါတယ်။
* **Package manager တစ်ခု။** သင့် Node.js release နဲ့ အတူ ပါလာတဲ့ npm က အလုပ်လုပ်ပါတယ် — Node.js 22 မှာဆိုရင် npm 10 ပါ။ pnpm၊ Bun နဲ့ Yarn 4.10 ဒါမှမဟုတ် အထက်ကိုလည်း ထောက်ပံ့ပါတယ်။

ကျန်တဲ့ Node.js version တွေမှာဆိုရင် `create-prisma` က file တစ်ခုမှ မရေးခင် ရပ်သွားပြီး လိုအပ်တဲ့ range ကို print ထုတ်ပါတယ်။ Bun ဒါမှမဟုတ် Deno နဲ့ run တဲ့အခါတော့ ဒီစစ်ဆေးမှုကို ကျော်သွားပါတယ်။

## Project တစ်ခု ဖန်တီးခြင်း (Create a project)

သင့် package manager နဲ့ CLI ကို run ပြီး prompts တွေကို ဖြေပါ:

#### bun

```bash
bun create prisma@latest my-app
```

#### pnpm

```bash
pnpm create prisma@latest my-app
```

#### yarn

```bash
yarn create prisma@latest my-app
```

#### npm

```bash
npm create prisma@latest -- my-app
```

Prompts တွေက project နာမည်၊ app template၊ database provider၊ contract authoring style၊ package manager၊ coding assistant တွေအတွက် agent skill files တွေ install လုပ်မလား နဲ့ ချက်ချင်း deploy လုပ်မလား ဆိုတာတွေကို မေးပါတယ်။ Skill files တွေက default အားဖြင့် `.claude/`၊ `.cursor/`၊ `.agents/` နဲ့ `.devin/` ထဲ ဝင်ပါတယ်; မလိုချင်ရင် no လို့ ဖြေပါ ဒါမှမဟုတ် `--skills none` ကို ပေးပါ။ နောက်မှ ဖယ်ချင်ရင် `prisma.config.ts` ထဲမှာ `skills: { agents: [] }` ကို set လုပ်ပြီး `prisma skills sync` ကို run ပါ; [Configuration](https://www.prisma.io/docs/cli/configuration) ကို ကြည့်ပါ။ Generate လုပ်ထားတဲ့ Node.js project တွေက အောက်မှာ ဖော်ပြထားတဲ့ လိုအပ်ချက်များ (Prerequisites) ထဲက Node.js versions တွေကို မျှော်လင့်ပါတယ်။

နောက်ဆုံး prompt က ဒီလိုပါ:

```text
Deploy to Prisma now?
```

Prompt က Yes ကို default ထားပါတယ်။ `--yes` က ကျန်တဲ့ prompts တွေအတွက် defaults ကို လက်ခံပေမယ့် ဒီနေရာမှာတော့ No လို့ ဖြေပါတယ် — ဒါကြောင့် `--yes` တစ်ခုတည်း ပေးရင် ဘယ်တော့မှ deploy မလုပ်ပါဘူး; `--json` ကတော့ `--no-deploy` မပေးရင် deploy လုပ်ပါတယ်။ နောက်မှ deploy လုပ်ချင်ရင် no ကို ရွေးပြီး generate လုပ်ထားတဲ့ `deploy` script နဲ့ လုပ်နိုင်ပါတယ်။ Prisma workspace session တစ်ခုထက် ပိုရနိုင်တဲ့အခါ CLI က deployment ကို ဘယ် workspace က လက်ခံမလဲ မေးပါတယ်; prompt မပါဘဲ ရွေးချင်ရင် `--workspace <id-or-name>` ကို ပေးပါ၊ ဒါမှမဟုတ် active workspace ကို သုံးချင်ရင် ချန်ထားပါ။ တခြား workspace တစ်ခုကို ရွေးလိုက်ရင် Prisma CLI ရဲ့ active workspace session ကိုပါ update လုပ်ပေးပါတယ်။

## Prompts တွေကို ကျော်ခြင်း (Skip the prompts)

Project ရဲ့ ပုံစံကို သိပြီးသားဆိုရင် flags တွေ ပေးလိုက်ပါ။ `--yes` က သင် မထည့်ထားတဲ့ အရာတွေအတွက် defaults ကို လက်ခံပါတယ်:

#### bun

```bash
bun create prisma@latest my-app --template next --provider postgres --yes
```

#### pnpm

```bash
pnpm create prisma@latest my-app --template next --provider postgres --yes
```

#### yarn

```bash
yarn create prisma@latest my-app --template next --provider postgres --yes
```

#### npm

```bash
npm create prisma@latest -- my-app --template next --provider postgres --yes
```

`create` က default subcommand ဖြစ်လို့ `npm create prisma@latest -- create my-app ...` နဲ့ `npm create prisma@latest -- my-app ...` က command အတူတူပါပဲ။ `--` နောက်က အရာအားလုံးက `create-prisma` ဆီ ရောက်ပါတယ်; separator မပါရင် npm က flags တွေကို သူ့ဆီမှာပဲ ယူထားပါတယ်။

| Flag | ဘာလုပ်လဲ |
| --- | --- |
| `<name>` or `--name <name>` | Project နာမည်နဲ့ directory။ |
| `--template <name>` | App template ကို ရွေးပါ (အောက်မှာ ကြည့်ပါ)။ |
| `--provider postgres\|postgresql\|mongo\|mongodb` | Database ကို ရွေးပါ — PostgreSQL relational models ဒါမှမဟုတ် MongoDB document models။ |
| `--authoring psl\|typescript` | [Contract authoring](/docs/prisma/the-data-contract) style ကို ရွေးပါ။ |
| `--package-manager npm\|pnpm\|yarn\|bun\|deno` | Dependencies install လုပ်ဖို့ သုံးမယ့် package manager ကို ရွေးပါ။ |
| `--skills <agents>\|none` | ဘယ် coding agents တွေ skill files ရမလဲ၊ ဒါမှမဟုတ် လုံးဝ မလိုချင်ရင် `none`။ Values နဲ့ effect က [`prisma init --skills`](https://www.prisma.io/docs/cli/init) နဲ့ အတူတူပါပဲ; ရွေးချယ်မှုကို [`skills` config section](https://www.prisma.io/docs/cli/configuration#agent-skills) မှာ မှတ်တမ်းတင်ပါတယ်။ |
| `--deploy` / `--no-deploy` | Generate လုပ်ထားတဲ့ app ကို Prisma ဆီ ချက်ချင်း deploy လုပ်တယ်၊ ဒါမှမဟုတ် အဲဒီအဆင့်ကို ကျော်တယ်။ |
| `--workspace <id-or-name>` | Deploy လုပ်မယ့် Prisma workspace။ |
| `--yes` | Prompts တွေကို ကျော်ပြီး default ရွေးချယ်မှုတွေကို လက်ခံတယ် — ဆိုလိုတာက deploy မလုပ်ဘူး။ |
| `--force` | ဗလာမဟုတ်တဲ့ directory ထဲ scaffold လုပ်ပြီး generate လုပ်ထားတဲ့ starter နဲ့ Prisma files (config၊ contract နဲ့ `db.ts`) တွေကို overwrite လုပ်တယ်။ Target မှာ ဗလာမဟုတ်တဲ့ `migrations/` directory ရှိရင်တော့ ငြင်းပယ်တယ်။ |
| `--verbose` | Setup လုပ်နေတုန်း command output အပြည့်ကို ပြတယ်။ `--json` နဲ့ တွဲသုံးလို့ မရဘူး။ |
| `--json` | Non-interactively run ပြီး JSON result object တစ်ခုကို stdout ဆီ ရေးတယ် — agents နဲ့ automation အတွက်။ `--no-deploy` မပေးရင် deploy လုပ်တယ်။ |

## Templates များ (Templates)

| `--template` | App |
| --- | --- |
| `minimal` | Query တစ်ခုတည်းပါတဲ့ minimal server |
| `next` | Next.js |
| `hono` | Hono |
| `elysia` | Elysia |
| `nest` | NestJS |
| `svelte` | SvelteKit |
| `astro` | Astro |
| `nuxt` | Nuxt (22 line မှာ Node.js 22.22.3 ဒါမှမဟုတ် အထက်၊ 24 line မှာ 24.15 ဒါမှမဟုတ် အထက်၊ ဒါမှမဟုတ် 26 ဒါမှမဟုတ် အထက် လိုအပ်တယ်) |
| `tanstack-start` | TanStack Start |

Template တိုင်းက PostgreSQL နဲ့ MongoDB၊ PSL ဒါမှမဟုတ် TypeScript contract authoring၊ ပြီးတော့ npm၊ pnpm၊ Yarn နဲ့ Bun တို့ကို ထောက်ပံ့ပါတယ်။ [Framework guide](https://www.prisma.io/docs/guides) တစ်ခုချင်းစီက generate လုပ်ထားတဲ့ app ကို ပထမ query ကနေ deploy အထိ လမ်းညွှန်ပေးပါတယ်။

Deno ကို local minimal PostgreSQL app တွေအတွက် ထောက်ပံ့ပါတယ်:

```bash
deno run -A --minimum-dependency-age=0 npm:create-prisma@latest my-deno-app --template minimal --provider postgres --package-manager deno --no-deploy
```

Deno 2.9 က လွန်ခဲ့တဲ့ ၂၄ နာရီအတွင်း publish လုပ်ထားတဲ့ packages တွေကို default အားဖြင့် ကျော်သွားတာမို့ `--minimum-dependency-age=0` မပါရင် အသစ်ထွက်တဲ့ `create-prisma` release က cache ထဲက အဟောင်း version တစ်ခုကို resolve လုပ်သွားပါလိမ့်မယ်။ Prisma Compute က Deno deployments တွေကို အခုထိ မထောက်ပံ့သေးလို့ Deno project တွေက verified local run မှာပဲ ရပ်ပါတယ်။

## App ကို start လုပ်ခြင်း (Start the app)

သင့် environment မှာ connection string ကို set လုပ်ပြီး database ကို initialize လုပ်ကာ dev server ကို start လုပ်ပါ။ Generate လုပ်ထားတဲ့ `prisma.config.ts` က PostgreSQL အတွက် `DATABASE_URL` နဲ့ MongoDB အတွက် `MONGODB_URL` ကို process environment ကနေ ဖတ်ပြီး dotenv file တစ်ခုမှ မဖွင့်ပါဘူး (Deno project တွေကတော့ ခြွင်းချက်ပါ — သူတို့ရဲ့ scripts တွေက `--env-file=.env` ကို ပေးပါတယ်)။ ဒါကြောင့် scripts တွေ မ run ခင် shell ထဲမှာ variable ကို export လုပ်ပါ။ Database မရှိသေးရင် [A database on your machine](/docs/prisma/local-database) က တစ်ခု ပေးပါလိမ့်မယ်။

```bash
cd my-app
npm run db:init
npm run dev
```

Sample records တွေကို app ရဲ့ ပထမ query မှာ seed လုပ်ပါတယ်။ အဲဒီကစပြီး `src/prisma/` အောက်က contract ကို ပြင်ဆင်ပြီး `npm run contract:emit` ကို run၊ ပြီးတော့ `npx prisma migration plan` နဲ့ `npx prisma db migrate` တို့နဲ့ migration ကို plan လုပ်ကာ apply လုပ်ပါ။ [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql) က အဲဒီ loop ကို အသေးစိတ် လွှမ်းခြုံပြီး [Create a new app with MongoDB](/docs/prisma/quickstart-mongodb) ကတော့ MongoDB connection string ကို လွှမ်းခြုံပါတယ်။

### Generate လုပ်ထားတဲ့ scripts များ (Generated scripts)

Scaffold က ဒီ scripts တွေကို `package.json` ထဲ ထည့်ပေးပါတယ်:

| Script | ဘာ run လုပ်လဲ |
| --- | --- |
| `contract:emit` | `prisma contract emit` |
| `db:init` | `prisma db init` |
| `db:update` | `prisma db update` |
| `db:verify` | `prisma db verify` |
| `migration:plan` | `prisma migration plan` |
| `migrate` | `prisma db migrate` |
| `migration:status` | `prisma migration status` |
| `migration:show` | `prisma migration show` |
| `skills:sync` | `prisma skills sync \|\| exit 0` |
| `postinstall` | `prisma skills sync \|\| exit 0` — scaffold run လုပ်တဲ့ `prisma init` က ထည့်ပေးတယ် |
| `composer:dev` | `prisma dev` |
| `composer:deploy` | `prisma deploy` |
| `dev:composer` | build script၊ ပြီးတော့ `composer:dev` |
| `deploy` | build script၊ ပြီးတော့ `composer:deploy` |

Deno project တွေက Prisma scripts တွေပဲ ရပြီး တစ်ခုချင်းစီကို `deno run -A npm:...` နဲ့ ခြုံထားကာ `skills:sync` မပါ၊ `postinstall` မပါ၊ Composer scripts တွေလည်း မပါပါဘူး။ `--skills none` ကလည်း `skills:sync` နဲ့ `postinstall` ကို ချန်လှပ်ထားပါတယ်။

## Telemetry (အသုံးပြုမှု အချက်အလက်)

Publish လုပ်ထားတဲ့ builds တွေက anonymous usage telemetry ကို ပို့နိုင်ပါတယ်။ Project နာမည်၊ file path ဒါမှမဟုတ် database URL တွေ ဘယ်တော့မှ မပါပါဘူး။ သင့် environment မှာ `DO_NOT_TRACK`၊ `CREATE_PRISMA_DISABLE_TELEMETRY` ဒါမှမဟုတ် `CREATE_PRISMA_TELEMETRY_DISABLED` ကို set လုပ်ပြီး ပိတ်နိုင်ပါတယ်။

CLI က [prisma/create-prisma](https://github.com/prisma/create-prisma) မှာ open source ဖြစ်ပါတယ်။

## ဆက်စပ် page များ (Related pages)

- [`A database on your machine`](/docs/prisma/local-database): Prisma ORM project တစ်ခုအတွက် PostgreSQL ဒါမှမဟုတ် MongoDB database တစ်ခုကို ဘာအတွက်မှ sign up မလုပ်ဘဲ ရယူပြီး သင့် app က ရေးလိုက်တဲ့ rows တွေကို ကြည့်ခြင်း။
- [`From scratch`](/docs/prisma/from-scratch): config file တစ်ခု၊ contract တစ်ခုနဲ့ index.ts တစ်ခုတည်းနဲ့ PostgreSQL အတွက် Prisma ORM ကို ကိုယ်တိုင် set up လုပ်ခြင်း။
