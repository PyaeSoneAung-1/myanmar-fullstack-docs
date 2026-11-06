---
title: "MongoDB နဲ့ App အသစ် ဖန်တီးခြင်း (Quickstart)"
description: "create-prisma@latest ကို အသုံးပြုပြီး MongoDB နဲ့ Prisma ORM project အသစ်တစ်ခု ဖန်တီးတာ၊ ပထမဆုံး migration ကို apply လုပ်တာနဲ့ ပထမဆုံး query ကို run ကြည့်တဲ့ အဆင့်ဆင့် လမ်းညွှန်"
order: 52
source: "https://www.prisma.io/docs/prisma-orm/quickstart/mongodb"
status: translated
updated: 2026-11-06
---

`create-prisma@latest` ကို သုံးပြီး MongoDB နဲ့ Prisma ORM project အသစ်တစ်ခု ဖန်တီးကြည့်ရအောင်။

ဒီ page က MongoDB ကို သုံးပါတယ်။ PostgreSQL နဲ့ လုပ်ချင်ရင်တော့ [Use PostgreSQL instead](/docs/prisma/quickstart-postgresql) ကို ကြည့်ပါ။

MongoDB နဲ့အတူ Prisma ORM app တစ်ခု ဖန်တီးပြီး ပထမဆုံး migration ကို apply လုပ်ကာ — seed လုပ်ထားတဲ့ ဒေတာအပေါ် သင့်ရဲ့ ပထမဆုံး query ကို run ကြည့်ပါမယ်။

> **မှတ်ချက် — Prisma ORM 7 ကို သုံးနေသလား။**
>
> Prisma ORM 8 က release candidate ပါ။ Prisma ORM 7 ကို အပြည့်အဝ ဆက်ပြီး ထောက်ပံ့ထားဆဲ ဖြစ်ပြီး — သူ့ documentation တွေက [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ၊ setup လမ်းကြောင်းတွေက [/v7/getting-started](https://www.prisma.io/docs/v7/getting-started) မှာ ရှိပါတယ်။
>
> Release candidate ဆိုတာ ဘာကို ဆိုလိုလဲ၊ final release ကို ဘယ်တော့ မျှော်လင့်ရမလဲ၊ version 7 ပေါ်မှာ ဘယ်လို ဆက်နေနိုင်မလဲဆိုတာကို [Release status](/docs/prisma/release-status) မှာ ဖတ်ပါ။

## အမြန် စတင်ခြင်း (Quick start)

Node.js 22 line မှာ 22.18 နဲ့ အထက်၊ 24 line မှာ 24.11 နဲ့ အထက်၊ ဒါမှမဟုတ် 26 နဲ့ အထက် လိုပါတယ် — Node.js 24 ကို အကြံပြုပါတယ်။ သင့် Node.js release နဲ့အတူ ပါလာတဲ့ npm က အလုပ်လုပ်ပါတယ် — Node.js 22 မှာဆိုရင် အဲဒါက npm 10 ပါ။ [Supported versions](/docs/prisma/supported-versions) မှာ အနိမ့်ဆုံး version တွေ အားလုံး ပါပါတယ်။

#### bun

```bash
bun create prisma@latest --provider mongodb --no-deploy
```

#### pnpm

```bash
pnpm create prisma@latest --provider mongodb --no-deploy
```

#### yarn

```bash
yarn create prisma@latest --provider mongodb --no-deploy
```

#### npm

```bash
npm create prisma@latest -- --provider mongodb --no-deploy
```

Command က MongoDB ကို ကြိုတင် ရွေးချယ်ပေးပြီး — project နာမည်၊ template၊ contract ရေးသားတဲ့ ပုံစံ (PSL ဒါမှမဟုတ် TypeScript)၊ သင့် package manager နဲ့ agent skills တွေ install လုပ်မလုပ်ဆိုတာတွေကို မေးပါလိမ့်မယ်။ Template မပါဘဲ Prisma ORM ကို project တစ်ခုထဲ ကိုယ်တိုင် ထည့်ချင်ရင်တော့ PostgreSQL ကို သုံးတဲ့ [Set up Prisma ORM from scratch](/docs/prisma/from-scratch) ကို လိုက်ပါ။

Setup က သင့်ကို app template၊ starter contract တစ်ခု၊ `prisma-8.md`၊ သင့် coding agent အတွက် project-level Prisma ORM skills တွေနဲ့ အောက်က database အဆင့်တွေအတွက် package script တွေ ပေးပါတယ်။ Agent skill file တွေ မလိုချင်ရင် skills prompt မှာ no လို့ ဖြေပါ ဒါမှမဟုတ် `--skills none` ကို ပေးပါ။ နောက်မှ ဖျက်ချင်ရင်တော့ [`skills sync`](https://www.prisma.io/docs/cli/skills) နဲ့ [`skills` config section](https://www.prisma.io/docs/cli/configuration#agent-skills) ကို ကြည့်ပါ။ App က database ကို ပထမဆုံး query လုပ်တဲ့အခါ နမူနာ user တွေကို အလိုအလျောက် seed လုပ်ပေးတာမို့ သီးခြား seed အဆင့် မလိုပါဘူး။

ဒီ quickstart ကို လုပ်ပြီးမြောက်ဖို့ standalone `mongod` တစ်ခုက လုံလောက်ပါတယ်။ Replica set က transaction တွေနဲ့ change stream တွေအတွက်ပဲ လိုအပ်ပြီး — MongoDB Atlas မှာဆိုရင် အဲဒါ ပါပြီးသား ဖြစ်ပါတယ်။ Scaffold က ရေးချပေးတဲ့ connection string က port 27017 ပေါ်က `rs0` ဆိုတဲ့ single-node replica set တစ်ခုကို မှန်းထားတာမို့ — local မှာ တစ်ခု run ပါ ဒါမှမဟုတ် သင့် standalone server ဆီ ညွှန်အောင် string ကို edit လုပ်ပါ။ Standalone `mongod` ကို သုံးမယ်ဆိုရင် အောက်က connection string တွေထဲက `replicaSet=rs0` ကို ဖယ်ပါ (`directConnection=true` ကို ချန်ထားပါ) — replica set နာမည် ပါတဲ့ URL က replica set တစ်ခုထဲ ပါဝင်တဲ့ server ကိုပဲ ချိတ်ဆက်နိုင်လို့ပါ။

## 1. Database connection ကို သတ်မှတ်ခြင်း

Scaffold က local replica-set connection string ပါတဲ့ `.env` တစ်ခုကို ရေးချပေးပါတယ်:

```text title=".env"
DATABASE_URL="mongodb://localhost:27017/mydb?replicaSet=rs0&directConnection=true"
```

Generate လုပ်ထားတဲ့ script တွေက `.env` ကနေ မဟုတ်ဘဲ environment variable တွေကို တိုက်ရိုက် ဖတ်ပါတယ်။ ပြီးတော့ CLI နဲ့ app က variable နာမည် မတူပါဘူး — CLI command တွေက `MONGODB_URL` ကို ဖတ်ပြီး app က `DATABASE_URL` ကို ဖတ်ပါတယ်။ နှစ်ခုလုံးကို သင်အလုပ်လုပ်နေတဲ့ shell ထဲမှာ export လုပ်ပါ:

```bash
export MONGODB_URL="mongodb://localhost:27017/mydb?replicaSet=rs0&directConnection=true"
export DATABASE_URL="$MONGODB_URL"
```

MongoDB Atlas ကို သုံးမယ်ဆိုရင် သင့် Atlas cluster ရဲ့ connection string ကို အစားထိုး သုံးပါ။ MongoDB server မရှိသေးရင် [A database on your machine](/docs/prisma/local-database) မှာ Docker ထဲမှာ တစ်ခု run ပုံကို ပြထားပါတယ်။

## 2. Migration plan ကို ဖန်တီးခြင်း

Starter contract ကနေ ပထမဆုံး migration plan ကို ဖန်တီးပါ။

#### bun

```bash
bun run migration:plan --name init
```

#### pnpm

```bash
pnpm run migration:plan --name init
```

#### yarn

```bash
yarn migration:plan --name init
```

#### npm

```bash
npm run migration:plan -- --name init
```

Output က plan လုပ်ထားတဲ့ operation တွေကို ပြပါတယ် — `users` နဲ့ `posts` collection တွေ ဖန်တီးတာ၊ ပြီးတော့ `users.email` ပေါ်မှာ unique index တစ်ခု ထည့်တာပါ။

## 3. Migration ကို apply လုပ်ခြင်း

Plan လုပ်ထားတဲ့ migration ကို MongoDB ပေါ် apply လုပ်ပါ။

#### bun

```bash
bun run migrate
```

#### pnpm

```bash
pnpm run migrate
```

#### yarn

```bash
yarn migrate
```

#### npm

```bash
npm run migrate
```

Output က `Applied 3 operation(s) across 1 contract space` လို summary တစ်ခုနဲ့ ဆုံးပါတယ်။ Connection error နဲ့ ကျရှုံးရင် — ဒီ shell ထဲမှာ `MONGODB_URL` ကို export လုပ်ထားပြီး run နေတဲ့ MongoDB deployment ဆီ ညွှန်နေမနေနဲ့၊ string မှာ `replicaSet=rs0` ရှိနေဆဲဆိုရင် အဲဒီ replica set က တည်ရှိနေရမယ်ဆိုတာ အတည်ပြုပါ။

Summary ထဲက `1 contract space` က သင့်ကိုယ်ပိုင် model တွေအတွက် migration history ပါ။ Prisma ORM က အဲဒါကို `app` [contract space](/docs/prisma/the-migration-graph) လို့ ခေါ်ပြီး သူ့ migration တွေက `migrations/app/` ထဲ ရှိပါတယ်။

## 4. App ကို run ခြင်း

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

သင့် template က ပြထားတဲ့ URL ဒါမှမဟုတ် terminal output ကို သုံးပါ။ MongoDB ကနေ ပြန်လာတဲ့ seed လုပ်ထားတဲ့ user တွေကို မြင်ရပါလိမ့်မယ်။

## နောက်တစ်ဆင့်များ

* `src/prisma/contract.prisma` ဒါမှမဟုတ် `src/prisma/contract.ts` ကို ဖွင့်ပြီး starter model ကို ပြောင်းကြည့်ပါ။
* App တစ်ခု ရှိပြီးသားဆိုရင် — database အလွတ်ဖြစ်နေတဲ့အခါ [Add Prisma ORM and MongoDB to an existing app](https://www.prisma.io/docs/prisma-orm/quickstart/existing-app/mongodb) ကို လိုက်ပါ၊ database မှာ collection တွေ ရှိပြီးသားဆိုရင်တော့ [Add Prisma ORM to an existing MongoDB database](/docs/prisma/add-to-existing-project-mongodb) ကို လိုက်ပါ။
* Contract တွေ၊ query API တွေနဲ့ migration တွေရဲ့ နောက်ကွယ်က အယူအဆတွေ လိုချင်တဲ့အခါ [Prisma ORM overview](https://www.prisma.io/docs/orm) ကို ဖတ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [`Create a new app with PostgreSQL`](/docs/prisma/quickstart-postgresql): create-prisma@latest ကို သုံးပြီး PostgreSQL နဲ့ Prisma ORM project အသစ်တစ်ခု ဖန်တီးပါ။
