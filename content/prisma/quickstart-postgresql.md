---
title: "PostgreSQL နဲ့ App အသစ် ဖန်တီးခြင်း (Quickstart)"
description: "create-prisma@latest ကို အသုံးပြုပြီး PostgreSQL နဲ့ Prisma ORM project အသစ်တစ်ခု ဖန်တီးတာ၊ database ကို initialize လုပ်တာနဲ့ ပထမဆုံး query ကို run ကြည့်တဲ့ အဆင့်ဆင့် လမ်းညွှန်"
order: 51
source: "https://www.prisma.io/docs/prisma-orm/quickstart/postgresql"
status: translated
updated: 2026-11-06
---

`create-prisma@latest` ကို သုံးပြီး PostgreSQL နဲ့ Prisma ORM project အသစ်တစ်ခု ဖန်တီးကြည့်ရအောင်။

ဒီ page က PostgreSQL ကို သုံးပါတယ်။ MongoDB နဲ့ လုပ်ချင်ရင်တော့ [Use MongoDB instead](/docs/prisma/quickstart-mongodb) ကို ကြည့်ပါ။

PostgreSQL နဲ့အတူ Prisma ORM app တစ်ခု ဖန်တီးပြီး — seed လုပ်ထားတဲ့ ဒေတာအပေါ် သင့်ရဲ့ ပထမဆုံး query ကို run ကြည့်ပါမယ်။

> **မှတ်ချက် — Prisma ORM 7 ကို သုံးနေသလား။**
>
> Prisma ORM 8 က release candidate ပါ။ Prisma ORM 7 ကို အပြည့်အဝ ဆက်ပြီး ထောက်ပံ့ထားဆဲ ဖြစ်ပြီး — သူ့ documentation တွေက [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ၊ setup လမ်းကြောင်းတွေက [/v7/getting-started](https://www.prisma.io/docs/v7/getting-started) မှာ ရှိပါတယ်။
>
> Release candidate ဆိုတာ ဘာကို ဆိုလိုလဲ၊ final release ကို ဘယ်တော့ မျှော်လင့်ရမလဲ၊ version 7 ပေါ်မှာ ဘယ်လို ဆက်နေနိုင်မလဲဆိုတာကို [Release status](/docs/prisma/release-status) မှာ ဖတ်ပါ။ Prisma ORM 7 API တိုင်းရဲ့ Prisma ORM 8 နာမည်အတွက်ကတော့ [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) ကို ကြည့်ပါ။

## အမြန် စတင်ခြင်း (Quick start)

Node.js 22 line မှာ 22.18 နဲ့ အထက်၊ 24 line မှာ 24.11 နဲ့ အထက်၊ ဒါမှမဟုတ် 26 နဲ့ အထက် လိုပါတယ် — Node.js 24 ကို အကြံပြုပါတယ်။ သင့် Node.js release နဲ့အတူ ပါလာတဲ့ npm က အလုပ်လုပ်ပါတယ် — Node.js 22 မှာဆိုရင် အဲဒါက npm 10 ပါ။ [Supported versions](/docs/prisma/supported-versions) မှာ အနိမ့်ဆုံး version တွေ အားလုံး ပါပါတယ်။

#### bun

```bash
bun create prisma@latest --provider postgres --no-deploy
```

#### pnpm

```bash
pnpm create prisma@latest --provider postgres --no-deploy
```

#### yarn

```bash
yarn create prisma@latest --provider postgres --no-deploy
```

#### npm

```bash
npm create prisma@latest -- --provider postgres --no-deploy
```

Command က PostgreSQL ကို ကြိုတင် ရွေးချယ်ပေးပြီး — project နာမည်၊ template၊ contract ရေးသားတဲ့ ပုံစံ (PSL ဒါမှမဟုတ် TypeScript)၊ သင့် package manager နဲ့ agent skills တွေ install လုပ်မလုပ်ဆိုတာတွေကို မေးပါလိမ့်မယ်။ Template မပါဘဲ Prisma ORM ကို project တစ်ခုထဲ ကိုယ်တိုင် ထည့်ချင်ရင်တော့ [Set up Prisma ORM from scratch](/docs/prisma/from-scratch) ကို လိုက်ပါ။

Setup က သင့်ကို app template၊ starter contract တစ်ခု၊ `prisma-8.md`၊ သင့် coding agent အတွက် project-level Prisma ORM skills တွေနဲ့ အောက်က database အဆင့်တွေအတွက် package script တွေ ပေးပါတယ်။ Agent skill file တွေ မလိုချင်ရင် skills prompt မှာ no လို့ ဖြေပါ ဒါမှမဟုတ် `--skills none` ကို ပေးပါ။ နောက်မှ ဖျက်ချင်ရင်တော့ [`skills sync`](https://www.prisma.io/docs/cli/skills) နဲ့ [`skills` config section](https://www.prisma.io/docs/cli/configuration#agent-skills) ကို ကြည့်ပါ။ App က database ကို ပထမဆုံး query လုပ်တဲ့အခါ နမူနာ user တွေကို အလိုအလျောက် seed လုပ်ပေးတာမို့ သီးခြား seed အဆင့် မလိုပါဘူး။

ဒီကနေ လမ်းကြောင်း နှစ်ခု ရှိပါတယ် — [Prisma Composer](https://www.prisma.io/docs/composer) ကို local Prisma Postgres database တစ်ခု run ခိုင်းတာ၊ ဒါမှမဟုတ် ကိုယ်တိုင် ပေးတဲ့ PostgreSQL database တစ်ခုကို ချိတ်ဆက်တာပါ။

## လမ်းကြောင်း A — Local database နဲ့ run ခြင်း

Composer က app ကို build လုပ်ပြီး local Prisma Postgres database တစ်ခု စတင်ကာ starter contract ကို သင့်အတွက် apply လုပ်ပေးပါတယ် — ဒါကြောင့် connection string မလိုပါဘူး။

#### bun

```bash
bun run dev:composer
```

#### pnpm

```bash
pnpm run dev:composer
```

#### yarn

```bash
yarn dev:composer
```

#### npm

```bash
npm run dev:composer
```

Command က print ထုတ်တဲ့ URL ကို ဖွင့်ပါ။ PostgreSQL ကနေ ပြန်လာတဲ့ seed လုပ်ထားတဲ့ user တွေကို မြင်ရပါလိမ့်မယ်။

## လမ်းကြောင်း B — ကိုယ်ပိုင် database ကို ချိတ်ဆက်ခြင်း

### 1. Database connection ကို သတ်မှတ်ခြင်း

Command တွေ run မယ့် shell ထဲမှာ `DATABASE_URL` ကို export လုပ်ပါ။ Generate လုပ်ထားတဲ့ script တွေက အဲဒီ variable ကို `.env` ကနေ မဟုတ်ဘဲ environment ကနေ ဖတ်ပါတယ်။

```bash
export DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

PostgreSQL database မရှိသေးရင် `npx create-db@latest` က ယာယီ Prisma Postgres database တစ်ခု ဖန်တီးပြီး သူ့ရဲ့ connection string နဲ့ claim URL ကို print ထုတ်ပေးပါတယ် — ဆက်ထားချင်ရင် အခမဲ့ Prisma account နဲ့ claim လုပ်ပါ။ ကိုယ်ပိုင် machine ပေါ်က database အတွက်ကတော့ [A database on your machine](/docs/prisma/local-database) ကို ကြည့်ပါ။

### 2. Database ကို initialize လုပ်ခြင်း

Generate လုပ်ထားတဲ့ project directory ထဲကနေ `db:init` ကို run ပြီး starter contract ကို PostgreSQL ပေါ် apply လုပ်ကာ database ကို sign လုပ်ပါ။

#### bun

```bash
bun run db:init
```

#### pnpm

```bash
pnpm run db:init
```

#### yarn

```bash
yarn db:init
```

#### npm

```bash
npm run db:init
```

Output က `Applied 5 operation(s) across 1 space(s), database signed` လို summary တစ်ခုနဲ့ ဆုံးပါတယ်။

### 3. App ကို run ခြင်း

App ကို စပြီး နမူနာ query က အောင်မြင်စွာ run မရှိမရှိ အတည်ပြုပါ။

#### bun

```bash
bun run dev
```

#### pnpm

```bash
pnpm run dev
```

#### yarn

```bash
yarn dev
```

#### npm

```bash
npm run dev
```

သင့် template က ပြထားတဲ့ URL ဒါမှမဟုတ် terminal output ကို သုံးပါ။ PostgreSQL ကနေ ပြန်လာတဲ့ seed လုပ်ထားတဲ့ user တွေကို မြင်ရပါလိမ့်မယ်။ Response က `Could not query users yet` ဖြစ်နေရင် — app run နေတဲ့ environment မှာ `DATABASE_URL` မသတ်မှတ်ထားတာ ဖြစ်ပါတယ်။ အဲဒီ shell ထဲမှာပဲ export လုပ်ပြီး ပြန် restart လုပ်ပါ။

## နောက်တစ်ဆင့်များ

* `src/prisma/contract.prisma` ဒါမှမဟုတ် `src/prisma/contract.ts` ကို ဖွင့်ပြီး starter model ကို ပြောင်းကြည့်ပါ။
* App တစ်ခု ရှိပြီးသားဆိုရင် — database အလွတ်ဖြစ်နေတဲ့အခါ [Add Prisma ORM and PostgreSQL to an existing app](https://www.prisma.io/docs/prisma-orm/quickstart/existing-app/postgresql) ကို လိုက်ပါ၊ database မှာ table တွေ ရှိပြီးသားဆိုရင်တော့ [Add Prisma ORM to an existing PostgreSQL database](/docs/prisma/add-to-existing-project-postgresql) ကို လိုက်ပါ။
* Contract တွေ၊ query API တွေနဲ့ migration တွေရဲ့ နောက်ကွယ်က အယူအဆတွေ လိုချင်တဲ့အခါ [Prisma ORM overview](https://www.prisma.io/docs/orm) ကို ဖတ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [`Create a new app with MongoDB`](/docs/prisma/quickstart-mongodb): create-prisma@latest ကို သုံးပြီး MongoDB နဲ့ Prisma ORM project အသစ်တစ်ခု ဖန်တီးပါ။
