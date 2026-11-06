---
title: "Prisma ORM ကို အစကနေ ကိုယ်တိုင် တည်ဆောက်ခြင်း (From scratch)"
description: "Config file တစ်ခု၊ contract တစ်ခုနဲ့ index.ts တစ်ခုတည်းကို အသုံးပြုပြီး PostgreSQL ပေါ်မှာ Prisma ORM 8 ကို လက်ဖြင့် setup လုပ်တဲ့ အဆင့်ဆင့် လမ်းညွှန်"
order: 50
source: "https://www.prisma.io/docs/prisma-orm/from-scratch"
status: translated
updated: 2026-11-06
---

Config file တစ်ခု၊ contract တစ်ခုနဲ့ `index.ts` တစ်ခုတည်းပဲ သုံးပြီး PostgreSQL နဲ့အတူ Prisma ORM ကို ကိုယ်တိုင် setup လုပ်ကြည့်ရအောင်။

ဒီ page ကို ပြီးဆုံးတဲ့အခါ သင့်မှာ `prisma.config.ts` တစ်ခု၊ `User` model တစ်ခု ပါဝင်တဲ့ `prisma/contract.prisma` တစ်ခု၊ ပြီးတော့ Prisma ORM 8 ကတစ်ဆင့် PostgreSQL ထဲက rows တွေကို ရေးတာ၊ update လုပ်တာ၊ ဖတ်တာ လုပ်တဲ့ `index.ts` တစ်ခု ရှိနေပါလိမ့်မယ် — အဲဒါ့အပြင် ကိုယ်တိုင် plan လုပ်ပြီး apply လုပ်ထားတဲ့ migration တစ်ခုလည်း ပါပါမယ်။ Template က ဘာတစ်ခုကိုမှ generate မလုပ်ပါဘူး — file တိုင်းကို ကိုယ်တိုင် ဖန်တီးပြီး တစ်ခုချင်းစီက ဘာအတွက်လဲဆိုတာ မြင်ရပါလိမ့်မယ်။

Prisma ORM က လိုအပ်တဲ့ file တိုင်းကို ကိုယ်တိုင် မြင်ချင်တဲ့အခါ၊ ဒါမှမဟုတ် ကိုယ်ပိုင် layout ရှိပြီးသား repository တစ်ခုထဲကို Prisma ORM ထည့်ချင်တဲ့အခါ ဒီလမ်းကြောင်းကို သုံးပါ။ File တွေကို အလိုအလျောက် ရေးပေးစေချင်ရင်တော့ `npm create prisma@latest` ကို run ပြီး [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql) ကို လိုက်ပါ။

> **မှတ်ချက် — Prisma ORM 7 ကို သုံးနေသလား။**
>
> Prisma ORM 8 က release candidate ပါ။ Prisma ORM 7 ကို အပြည့်အဝ ဆက်ပြီး ထောက်ပံ့ထားဆဲ ဖြစ်ပြီး — သူ့ documentation တွေက [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ၊ setup လမ်းကြောင်းတွေက [/v7/getting-started](https://www.prisma.io/docs/v7/getting-started) မှာ ရှိပါတယ်။
>
> Release candidate ဆိုတာ ဘာကို ဆိုလိုလဲ၊ final release ကို ဘယ်တော့ မျှော်လင့်ရမလဲ၊ version 7 ပေါ်မှာ ဘယ်လို ဆက်နေနိုင်မလဲဆိုတာကို [Release status](/docs/prisma/release-status) မှာ ဖတ်ပါ။ Prisma ORM 7 API တိုင်းရဲ့ Prisma ORM 8 နာမည်အတွက်ကတော့ [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) ကို ကြည့်ပါ။

Prisma ORM 8 မှာ command နှစ်ခုက နာမည်အသစ် ရသွားပါတယ်။ `prisma generate` လုပ်ခဲ့တာကို အခု `contract emit` က လုပ်ပြီး — `migrate dev` လုပ်ခဲ့တာကို `migration plan` ပြီးရင် `db migrate` ဆိုတဲ့ အစီအစဉ်နဲ့ လုပ်ပါတယ်။ `@prisma/client` package မရှိတော့သလို `db push` လည်း မရှိတော့ပါဘူး။

## ကြိုတင် လိုအပ်ချက်များ (Prerequisites)

* Node.js 22 line မှာ 22.18 နဲ့ အထက်၊ 24 line မှာ 24.11 နဲ့ အထက်၊ ဒါမှမဟုတ် 26 နဲ့ အထက် (24 ကို အကြံပြုပါတယ်)။ [Supported versions](/docs/prisma/supported-versions) မှာ အနိမ့်ဆုံး version တွေ အားလုံး ပါပါတယ်။
* PostgreSQL database အလွတ်တစ်ခုအတွက် connection string တစ်ခု။ အဆင့် 4 က table တွေကို ဖန်တီးပြီး အဆင့် 5 က run တိုင်း `User` table ကို ရှင်းပစ်တာမို့ — လိုအပ်တဲ့ ဒေတာ ရှိနေတဲ့ database တစ်ခုဆီ ဒီ page ကို မချိတ်ပါနဲ့။ PostgreSQL URL မည်သည့်ဟာမဆို အလုပ်လုပ်ပါတယ်။ မရှိသေးရင် `npx create-db@latest` က ယာယီ Prisma Postgres database တစ်ခု ဖန်တီးပြီး သူ့ရဲ့ connection string နဲ့ claim URL ကို print ထုတ်ပေးပါတယ် — ဆက်ထားချင်ရင် အခမဲ့ Prisma account နဲ့ claim လုပ်ပါ။

## 1. Project ကို ဖန်တီးခြင်း

`package.json` ပါတဲ့ directory အလွတ်တစ်ခု ဖန်တီးပြီး ES modules ပေါ် ပြောင်းပါ — အကြောင်းက Prisma ORM package တွေနဲ့ အောက်က `index.ts` က `import` syntax ကို သုံးလို့ပါ။ `npm init -y` က `"type": "commonjs"` ကို ရေးချပေးတာမို့ ဒုတိယ npm command နဲ့ အဲဒါကို ပြောင်းပါ:

```bash
mkdir hello-prisma
cd hello-prisma
npm init -y
npm pkg set type=module
```

Runtime library၊ command-line tool နဲ့ TypeScript file တစ်ခုကို run ဖို့ tooling တွေကို install လုပ်ပါ:

#### bun

```bash
bun add @prisma/orm-postgres dotenv
bun add --dev prisma tsx typescript
```

#### pnpm

```bash
pnpm add @prisma/orm-postgres dotenv
pnpm add --save-dev prisma tsx typescript
```

#### yarn

```bash
yarn add @prisma/orm-postgres dotenv
yarn add --dev prisma tsx typescript
```

#### npm

```bash
npm install @prisma/orm-postgres dotenv
npm install --save-dev prisma tsx typescript
```

`@prisma/orm-postgres` က သင့် code က import လုပ်တဲ့ library ဖြစ်ပြီး `prisma` က command-line tool ပါ။ `dotenv` က `.env` ကို load လုပ်တယ်၊ `tsx` က `index.ts` ကို build step မလိုဘဲ run ပေးတယ်၊ ပြီးတော့ `typescript` 5.9 ဒါမှမဟုတ် အထက်က `@prisma/orm-postgres` ရဲ့ peer dependency ဖြစ်ပါတယ်။

`temporal-polyfill` ကလည်း `@prisma/orm-postgres` ရဲ့ peer dependency ပါ။ အဲဒါက JavaScript ရဲ့ date နဲ့ time API အသစ်ဖြစ်တဲ့ `Temporal` ကို — Node.js 24 လို အလိုအလျောက် မပါလာတဲ့ runtime တွေထဲ ထည့်ပေးပါတယ်။ npm နဲ့ဆိုရင် အလိုအလျောက် install ဖြစ်သွားပေမယ့် Yarn နဲ့ဆိုရင်တော့ ကိုယ်တိုင် ထည့်ရပါမယ်။

Prisma package နှစ်ခုမှာ version နံပါတ် မတူပါဘူး — ဥပမာ `prisma` 8.0.0-rc.30 နဲ့ `@prisma/orm-postgres` 8.0.0-rc.22 ဆိုသလိုပါ။ ဒါက ပုံမှန်ပါပဲ၊ `latest` version ဘယ်နှစ်ခုပဲဖြစ်ဖြစ် အတူတကွ အလုပ်လုပ်ပါတယ်။

## 2. Config file နဲ့ `.env` ကို ဖန်တီးခြင်း

Command-line tool က သင့် contract နဲ့ database ကို ရှာဖို့ project root ထဲက `prisma.config.ts` ကို ဖတ်ပါတယ်:

```typescript title="prisma.config.ts"
import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    db: {
      connection: process.env["DATABASE_URL"]!,
    },
  }),
  skills: {
    check: false,
  },
});
```

`contract` က နောက်တစ်ဆင့်မှာ ရေးမယ့် model file ဆီကို သွားတဲ့ path ဖြစ်ပြီး `db.connection` က database command တွေ သုံးတဲ့ connection string ပါ။ `skills` block က command တိုင်းက agent skill file တွေ install လုပ်ဖို့ ထုတ်ပေးနေတဲ့ notice ကို ပိတ်ပေးပါတယ် — အဲဒီ file တွေ လိုချင်ရင် ဖျက်ပစ်ပါ။ Setting တိုင်းကို [Configuration](https://www.prisma.io/docs/cli/configuration) မှာ ဖော်ပြထားပါတယ်။

Connection string ကို `.env` ထဲ ထည့်ပါ — config file ရဲ့ ပထမဆုံး line က အဲဒါကို load လုပ်ပါတယ်:

```bash title=".env"
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

Credentials တွေ version control ထဲ မပါအောင် `.env` ကို `.gitignore` ထဲ ထည့်ပါ။ Database မရှိသေးရင် [A database on your machine](/docs/prisma/local-database) က တစ်ခု ပေးပါလိမ့်မယ်။

## 3. Contract ကို ဖန်တီးခြင်း

Contract ဆိုတာ Prisma ORM 8 က schema file ကို ခေါ်တဲ့ နာမည်ပါ။ အဲဒါက `schema.prisma` ကို အစားထိုးပြီး — connection string က `prisma.config.ts` ထဲ ရှိတာမို့ `datasource` ဒါမှမဟုတ် `generator` block တွေ မပါပါဘူး။ Model တစ်ခု ကြေညာပါ:

```prisma title="prisma/contract.prisma"
// use prisma-8
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Field type တွေ၊ primary key တွေနဲ့ relation တွေကို [Data modeling](/docs/prisma/data-modeling) မှာ ဖော်ပြထားပါတယ်။

## 4. Contract ကို generate လုပ်ပြီး table ဖန်တီးခြင်း

`contract emit` က `contract.prisma` ကို ဖတ်ပြီး သူ့ဘေးမှာပဲ `prisma/contract.json` (run time မှာ ဖတ်တယ်) နဲ့ `prisma/contract.d.ts` (TypeScript က ဖတ်တယ်) ကို ရေးပါတယ်။ ဒါက အရင် `prisma generate` လုပ်ခဲ့တဲ့ အဆင့်ပါ — contract ကို ပြောင်းတိုင်း ထပ်ပြီး run ပါ။

#### bun

```bash
bunx prisma contract emit
```

#### pnpm

```bash
pnpm prisma contract emit
```

#### yarn

```bash
yarn prisma contract emit
```

#### npm

```bash
npx prisma contract emit
```

```text
✔ Resolving contract source...
✔ Emitting contract...
│  contract:  prisma/contract.json
│  types:     prisma/contract.d.ts
✔ Emitted contract.json and contract.d.ts
```

`db init` က contract က ကြေညာထားတဲ့ table တွေကို သင့် database ထဲ ဖန်တီးပြီး — database ကို sign လုပ်ပါတယ်။ Sign လုပ်တာက database က contract version ဘယ်ခုနဲ့ ကိုက်ညီနေလဲဆိုတာကို မှတ်တမ်းတင်ထားတာမို့ နောက်ပိုင်း migration တွေက ဘယ်ကနေ စရမလဲ သိနိုင်ပါတယ်:

#### bun

```bash
bunx prisma db init
```

#### pnpm

```bash
pnpm prisma db init
```

#### yarn

```bash
yarn prisma db init
```

#### npm

```bash
npx prisma db init
```

```text
✔ Introspecting database schema
✔ Planning migration
✔ Initialising database across spaces
│  contract:  prisma/contract.json
│  database:  postgres://****:****@db.prisma.io:5432/postgres?sslmode=require
✔ Applied 2 operation(s) across 1 contract space
App space
├─ Create table "User"
├─ Add unique constraint on "User" (email)
└─ marker b5ae4e66fad1f0b7dd5590568f75a12a6f4576e9f367a787a69a4e729abac1fb
✔ Advanced ref "db" → b5ae4e66fad1f0b7dd5590568f75a12a6f4576e9f367a787a69a4e729abac1fb
```

Output ထဲက `1 contract space` နဲ့ `App space` နှစ်ခုလုံးက သင့်ကိုယ်ပိုင် model တွေအတွက် migration history ကို ညွှန်းတာပါ။ အဲဒါက `migrations/app/` ထဲ ရှိပြီး `app` [contract space](/docs/prisma/the-migration-graph) လို့ ခေါ်ပါတယ်။

Output ထဲက `marker` line က signing က database ထဲ သိမ်းလိုက်တဲ့ မှတ်တမ်းပါ — database အခု ကိုက်ညီနေတဲ့ contract version ကို ဖော်ထုတ်တဲ့ hash ပါ။ `db init` က `migrations/app/refs/db.json` ကိုလည်း ရေးပေးပါတယ် — အဲဒါကို `db` ref လို့ ခေါ်ပြီး သင့် development database က contract version ဘယ်ခုမှာ ရှိနေလဲ မှတ်တမ်းတင်ထားတဲ့ file ပါ။ ဒါကြောင့် အဆင့် 6 က `migration plan` က ဘယ်ကနေ စရမလဲ သိနိုင်ပါတယ်။ Output ထဲက `Advanced ref "db"` line က `db init` က အဲဒါကို ရေးနေတာ ဖြစ်ပါတယ်။ `db init` က `migrations/snapshots/` အောက်မှာ ရေးတဲ့ contract snapshot နဲ့အတူ အဲဒါကို commit လုပ်ပါ။ Command က `DRIVER.CONNECTION_FAILED` နဲ့ ကျရှုံးရင် `.env` ထဲက `DATABASE_URL` မှားနေတာ ဒါမှမဟုတ် database ကို ဆက်သွယ်လို့ မရတာပါ။ SSL mode တွေအကြောင်း `SECURITY WARNING` က `pg` driver ကနေ လာတာဖြစ်ပြီး command ကို မရပ်ပါဘူး — ပိတ်ချင်ရင် `.env` ထဲမှာ `sslmode=require` ကို `sslmode=verify-full` ပြောင်းပါ။

## 5. ဒေတာ ရေးခြင်းနဲ့ ဖတ်ခြင်း

`index.ts` ကို ဖန်တီးပါ။ အဲဒါက အဆင့် 4 က file နှစ်ခုကို `contractFromJson` ဆီ ပေးပို့ပါတယ်။ အဲဒီ function က `contract.json` ကို စစ်ဆေးပြီး `contract.d.ts` ထဲက type တွေ ပေးလိုက်ပါတယ်။ ပြီးတော့ file က ရလဒ်ကနေ client ကို တည်ဆောက်ပြီး `User` model ပေါ်မှာ rows တွေကို ဖျက်တာ၊ ဖန်တီးတာ၊ update လုပ်တာ၊ ဖတ်တာ တွေ လုပ်ပါတယ်:

```typescript title="index.ts"
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./prisma/contract.d";
import contractJson from "./prisma/contract.json" with { type: "json" };

const contract = contractFromJson<Contract>(contractJson);

const db = postgres({
  contract,
  url: process.env["DATABASE_URL"]!,
});

async function main() {
  // Start from an empty table so you can run this file more than once.
  await db.orm.public.User.where({}).deleteAll();

  // Write: insert one row.
  const alice = await db.orm.public.User.create({
    email: "alice@prisma.io",
    name: "Alice",
  });
  console.log("Created:", alice);

  // Update: change one row, picked by its primary key.
  const renamed = await db.orm.public.User
    .where({ id: alice.id })
    .update({ name: "Alice Smith" });
  console.log("Updated:", renamed);

  // Read: fetch every row.
  const users = await db.orm.public.User.all();
  console.log("All users:", users);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

`db.orm.public.User` က model ပါ — `public` က PostgreSQL schema ဖြစ်ပြီး သင့် contract ထဲက model တိုင်း အဲဒီအောက်မှာ ပေါ်ပါတယ်။ `.update()` နဲ့ `.delete()` တို့က အရင်ဆုံး `.where()` လိုပြီး — `.where({})` က row တိုင်းနဲ့ ကိုက်ညီပါတယ်။ ကျန်တဲ့ query API ကို [Reading data](https://www.prisma.io/docs/orm/fundamentals/reading-data) နဲ့ [Writing data](https://www.prisma.io/docs/orm/fundamentals/writing-data) မှာ ကြည့်ပါ။

Run ကြည့်ပါ:

#### bun

```bash
bunx tsx index.ts
```

#### pnpm

```bash
pnpm dlx tsx index.ts
```

#### yarn

```bash
yarn dlx tsx index.ts
```

#### npm

```bash
npx tsx index.ts
```

```text
Created: { email: 'alice@prisma.io', id: 1, name: 'Alice' }
Updated: { email: 'alice@prisma.io', id: 1, name: 'Alice Smith' }
All users: [ { email: 'alice@prisma.io', id: 1, name: 'Alice Smith' } ]
```

Table ကို ရှင်းပေမယ့် sequence ကို မရှင်းတာမို့ file ကို run တိုင်း `id` က တစ်ခုစီ တက်သွားပါတယ်။ Run လုပ်တာ `Cannot find module '.../prisma/contract.json'` နဲ့ ကျရှုံးရင် အဆင့် 4 က `contract emit` ကို ကျော်သွားတာပါ။

## 6. Schema ကို ပြောင်းပြီး migrate လုပ်ခြင်း

Model ထဲကို optional field တစ်ခု ထည့်ပါ:

```prisma title="prisma/contract.prisma"
// use prisma-8
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  phone String?
}
```

Contract ကို ထပ်ပြီး emit လုပ်ပါ၊ ပြီးရင် migration တစ်ခု plan လုပ်ပါ။ `migration plan` က emit လုပ်ထားတဲ့ contract ကို database ကို sign လုပ်ထားတဲ့ version နဲ့ နှိုင်းယှဉ်ပြီး ကွာခြားချက်ကို migration directory တစ်ခုအနေနဲ့ ရေးပါတယ် — database ကို မချိတ်ဆက်ဘဲနဲ့ပါ:

#### bun

```bash
bunx prisma contract emit
bunx prisma migration plan --name add_user_phone
```

#### pnpm

```bash
pnpm prisma contract emit
pnpm prisma migration plan --name add_user_phone
```

#### yarn

```bash
yarn prisma contract emit
yarn prisma migration plan --name add_user_phone
```

#### npm

```bash
npx prisma contract emit
npx prisma migration plan --name add_user_phone
```

```text
✔ Planned baseline (3 operation(s)) + 1 operation(s)
migrations/app/20260917T1457_add_user_phone
└─ Add column "phone" to "User"
from:       b5ae4e66fad1f0b7dd5590568f75a12a6f4576e9f367a787a69a4e729abac1fb
to:         300832575ace8feebb3d3442d1bca52150c46628de3e4c6c32a61cb0ab21100f
baseline:   migrations/app/20260917T1456_baseline
app space:  migrations/app/20260917T1457_add_user_phone
ℹ DDL preview
ALTER TABLE "public"."User" ADD COLUMN "phone" text;
```

`migrations/app/` အောက်မှာ directory နှစ်ခု ပေါ်လာပါတယ် — `db init` က ဖန်တီးခဲ့တဲ့ table ကို မှတ်တမ်းတင်တဲ့ baseline တစ်ခုနဲ့ သင့်ပြောင်းလဲမှု တစ်ခုပါ။ Baseline ကို ဒီ database ပေါ်မှာ ဘယ်တော့မှ apply မလုပ်ပါဘူး — အကြောင်းက database က အဲဒီအခြေအနေမှာ sign လုပ်ပြီးသား ဖြစ်လို့ပါ။ Migration directory တိုင်းမှာ ဖတ်လို့ရ၊ edit လုပ်လို့ရတဲ့ `migration.ts` တစ်ခု ပါပါတယ်။ File တွေအကြောင်းကို [Generating a migration](/docs/prisma/generating-a-migration) မှာ ရှင်းပြထားပါတယ်။

Migration ကို `--advance-ref db` နဲ့ apply လုပ်ပါ။ အဲဒါက သင့် development database အခု contract အသစ်မှာ ရှိနေပြီဆိုတာ မှတ်တမ်းတင်ပေးတာမို့ နောက်တစ်ခါ `migration plan` လုပ်တဲ့အခါ အဲဒီကနေ စပါလိမ့်မယ်:

#### bun

```bash
bunx prisma db migrate --advance-ref db
```

#### pnpm

```bash
pnpm prisma db migrate --advance-ref db
```

#### yarn

```bash
yarn prisma db migrate --advance-ref db
```

#### npm

```bash
npx prisma db migrate --advance-ref db
```

```text
✔ Applied 1 migration(s) (1 operation(s)) across 1 contract space(s)
App space
├─ Add column "phone" to "User"
└─ marker 300832575ace8feebb3d3442d1bca52150c46628de3e4c6c32a61cb0ab21100f
✔ Advanced ref "db" → 300832575ace8feebb3d3442d1bca52150c46628de3e4c6c32a61cb0ab21100f
```

စွန့်ပစ်မယ့် database အတွက် migration file တွေ မလိုချင်ရင် — `migration plan` နဲ့ `db migrate` အစား [`db update`](https://www.prisma.io/docs/cli/db-update) က contract ပြောင်းလဲမှုကို တိုက်ရိုက် လုပ်ဆောင်ပေးပါတယ်။

`index.ts` ကို ဘာမှ မပြောင်းဘဲ ထပ်ပြီး run ပါ။ Column အသစ်က row တိုင်းမှာ ပေါ်လာပါလိမ့်မယ်:

#### bun

```bash
bunx tsx index.ts
```

#### pnpm

```bash
pnpm dlx tsx index.ts
```

#### yarn

```bash
yarn dlx tsx index.ts
```

#### npm

```bash
npx tsx index.ts
```

```text
Created: { email: 'alice@prisma.io', id: 2, name: 'Alice', phone: null }
Updated: { email: 'alice@prisma.io', id: 2, name: 'Alice Smith', phone: null }
All users: [
  { email: 'alice@prisma.io', id: 2, name: 'Alice Smith', phone: null }
]
```

## စစ်ဆေးအတည်ပြုခြင်း (Verify)

Disk ပေါ်က migration file တွေနဲ့ database ကိုက်ညီမှု ရှိမရှိ စစ်ပါ:

#### bun

```bash
bunx prisma migration status
```

#### pnpm

```bash
pnpm prisma migration status
```

#### yarn

```bash
yarn prisma migration status
```

#### npm

```bash
npx prisma migration status
```

```text
○   3008325  @contract @db (db)
│↑  20260917T1457_add_user_phone  b5ae4e6 → 3008325  1 ops  ✓ applied
○   b5ae4e6
│↑  20260917T1456_baseline              ∅ → b5ae4e6  3 ops
○   ∅
✔ Up to date
```

ဒီကစပြီး schema ပြောင်းတိုင်း အလုပ်တစ်ခုတည်းကို ထပ်လုပ်ရပါမယ် — `prisma/contract.prisma` ကို edit လုပ်ပါ၊ `npx prisma contract emit` ကို run ပါ၊ `npx prisma migration plan --name <name>` ကို run ပါ၊ ပြီးရင် `npx prisma db migrate --advance-ref db` နဲ့ apply လုပ်ပါ။

## နောက်တစ်ဆင့်များ

* Relation တွေ၊ နောက်ထပ် field type တွေနဲ့ index တွေအတွက် [Data modeling](/docs/prisma/data-modeling) ကို ဖတ်ပါ။
* Migration directory တစ်ခုထဲမှာ ဘာတွေ ပါလဲ၊ တစ်ခုကို ဘယ်လို edit လုပ်မလဲဆိုတာအတွက် [Generating a migration](/docs/prisma/generating-a-migration) ကို ကြည့်ပါ။
* အလားတူ setup ကို starter app တစ်ခုနဲ့အတူ အလိုအလျောက် generate လုပ်ပေးစေချင်ရင် [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql) ကို လိုက်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [`A database on your machine`](/docs/prisma/local-database): ဘာမှ sign up မလုပ်ဘဲ Prisma ORM project တစ်ခုအတွက် PostgreSQL ဒါမှမဟုတ် MongoDB database တစ်ခု ရယူပြီး သင့် app က ရေးလိုက်တဲ့ rows တွေကို ကြည့်ပါ။
- [`create-prisma`](/docs/prisma/create-prisma): Prisma Composer၊ Prisma Postgres နဲ့ deploy လမ်းကြောင်း ပါဝင်တဲ့ Prisma ORM app အသစ်တစ်ခုကို create-prisma နဲ့ scaffold လုပ်ပါ။
