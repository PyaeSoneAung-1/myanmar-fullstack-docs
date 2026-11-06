---
title: "ရှိပြီးသား MongoDB Database ဆီကို Prisma ORM ထည့်သွင်းခြင်း"
description: "MongoDB database မှာ collection တွေ ရှိပြီးသား ဖြစ်နေတဲ့ app တစ်ခုဆီကို Prisma ORM ထည့်ပြီး contract ရေးကာ query နှစ်ခု run ကြည့်တဲ့ အဆင့်ဆင့် လမ်းညွှန်"
order: 54
source: "https://www.prisma.io/docs/prisma-orm/add-to-existing-project/mongodb"
status: translated
updated: 2026-11-06
---

MongoDB database မှာ collection တွေ ရှိပြီးသား ဖြစ်နေတဲ့ app တစ်ခုဆီကို Prisma ORM ထည့်သွင်းပုံကို ဒီ page မှာ ရှင်းပြပါတယ်။

ဒီ page က MongoDB ကို သုံးပါတယ်။ [အစား PostgreSQL ကို သုံးချင်ရင် ဒီမှာ ကြည့်ပါ](/docs/prisma/add-to-existing-project-postgresql)။

ဒီ page မှာ သင် လုပ်မှာက — MongoDB database မှာ collection တွေ ရှိပြီးသား ဖြစ်နေတဲ့ app တစ်ခုဆီကို Prisma ORM ထည့်တာပါ။ `orm init` ကို run မယ်၊ သင့် collection တွေကို ဖော်ပြတဲ့ contract တစ်ခု ရေးမယ်၊ ပြီးရင် query နှစ်ခု run မယ်။ Contract ဆိုတာ သင့် model တွေ သိမ်းထားတဲ့ file ပါ။ အရင် Prisma ORM version တွေမှာတော့ အဲဒါက `schema.prisma` ဖြစ်ပါတယ်။

သင့် app က သူ့ MongoDB database ဆီ ရောက်နိုင်ရမယ်၊ ပြီးတော့ Node.js 22 line မှာ 22.18 နဲ့ အထက်၊ 24 line မှာ 24.11 နဲ့ အထက်၊ ဒါမှမဟုတ် 26 နဲ့ အထက်မှာ run ရပါမယ် ([Supported versions](/docs/prisma/supported-versions))။ `mongod` server တစ်ခုတည်းနဲ့ လုံလောက်ပါတယ်။ Replica set က transactions နဲ့ change streams အတွက်ပဲ လိုပြီး MongoDB Atlas မှာဆိုရင် တစ်ခု အလုပ်လုပ်နေပြီးသား ဖြစ်ပါတယ်။

သင့် database မှာ collection တွေ မရှိသေးရင် [Add Prisma ORM and MongoDB to an existing app](https://www.prisma.io/docs/prisma-orm/quickstart/existing-app/mongodb) ကို လိုက်ပါ — အဲဒီမှာ collection တွေကို ဖန်တီးပေးပါတယ်။ Prisma ORM က သင့်အတွက် app အသစ်တစ်ခု ဖန်တီးပေးစေချင်ရင် [Create a new app with MongoDB](/docs/prisma/quickstart-mongodb) ကို လိုက်ပါ။

> **မှတ်ချက် — Prisma ORM 7 ကို သုံးနေပါသလား**
>
> Prisma ORM 8 က release candidate ပါ။ Prisma ORM 7 ကို အပြည့်အဝ ထောက်ပံ့နေဆဲ ဖြစ်ပြီး — သူ့ docs တွေက [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ၊ setup လမ်းကြောင်းတွေက [/v7/getting-started](https://www.prisma.io/docs/v7/getting-started) မှာ ရှိပါတယ်။
>
> Release candidate ဆိုတာ ဘာလဲ၊ final release ကို ဘယ်အချိန် မျှော်လင့်ရမလဲ၊ version 7 မှာ ဘယ်လို ဆက်နေမလဲဆိုတာကို [Release status](/docs/prisma/release-status) မှာ ကြည့်ပါ။

## 1. `tsx` ကို install လုပ်ခြင်း

ဒီ page က script တွေက `tsx` နဲ့ run ပါတယ်။ သင့် project မှာ မရှိသေးရင် install လုပ်ပါ:

#### bun

```bash
bun add --dev tsx typescript
```

#### pnpm

```bash
pnpm add --save-dev tsx typescript
```

#### yarn

```bash
yarn add --dev tsx typescript
```

#### npm

```bash
npm install --save-dev tsx typescript
```

## 2. Prisma ORM ကို initialize လုပ်ခြင်း

အောက်က `orm init` command က သင့် `tsconfig.json` နဲ့ `package.json` ကို ပြောင်းလဲပါတယ်။ `tsconfig.json` ထဲမှာ `module` ကို `preserve`၊ `moduleResolution` ကို `bundler` သတ်မှတ်ပါတယ်။ သင့် `package.json` မှာ `"type"` field မပါရင် `"type": "module"` ကို ထည့်ပါတယ်။ `"type": "commonjs"` ပါနေရင်တော့ command က အဲဒါကို ဆက်ထားပြီး warning တစ်ခု print ပါတယ်။ သင့် app က CommonJS အနေနဲ့ run နေရင် — ဥပမာ file တွေကို `require` နဲ့ load လုပ်တာမျိုး၊ ဒါမှမဟုတ် `tsc` က `require` call တွေအဖြစ် compile လုပ်တာမျိုး — သင့် app ကို ပြန် start မလုပ်ခင် [In a CommonJS project](https://www.prisma.io/docs/cli/orm-init#in-a-commonjs-project) ကို လိုက်နာပါ။ `tsx` က ဒီ page က script တွေကို app နှစ်မျိုးလုံးမှာ run နိုင်တာမို့ ဒီ page ကို အရင် အပြီးသတ်လိုက်လို့ ရပါတယ်။

သင့် project ရဲ့ root ကနေ run ပါ:

#### bun

```bash
bunx prisma@latest orm init --yes --target mongodb --authoring psl --write-env
```

#### pnpm

```bash
pnpm dlx prisma@latest orm init --yes --target mongodb --authoring psl --write-env
```

#### yarn

```bash
yarn dlx prisma@latest orm init --yes --target mongodb --authoring psl --write-env
```

#### npm

```bash
npx prisma@latest orm init --yes --target mongodb --authoring psl --write-env
```

`prisma@latest` က Prisma ORM 8 ကို run ပြီး `--target mongodb` က MongoDB ကို ရွေးပါတယ်။ `--authoring psl` က PSL — Prisma Schema Language — ကို ရွေးပါတယ်၊ အဲဒါက အရင် Prisma ORM version တွေကတည်းက သိထားတဲ့ `.prisma` file format ပါ။ `--write-env` က `.env` file တစ်ခု ရေးပေးပါတယ် — သင့်ဆီမှာ ရှိပြီးသားဆိုရင်တော့ မရေးပါဘူး။ `--yes` က မေးခွန်းတိုင်းအတွက် default အဖြေကို လက်ခံတာမို့ command က ဘာမှ မမေးပါဘူး။

Command က Prisma ORM package တွေကို install လုပ်ပြီး သူ့ file တွေ ရေးပါတယ်။ ဒီ page မှာ သင် သုံးမှာက သုံးခုပါ:

* `src/prisma/contract.prisma` — နမူနာ contract တစ်ခု။ အဆင့် 4 မှာ သင့် collection တွေကို ဖော်ပြဖို့ ဒါကို ပြောင်းပါမယ်။
* `src/prisma/db.ts` — query တွေ run ဖို့ သင့် code က import လုပ်တဲ့ file။
* `.env` — connection string ကို သိမ်းထားတဲ့ file။

Command က `prisma-8.md` ကိုလည်း ရေးပေးပါတယ် — query ရေးတဲ့အခါ ကိုးကားရတဲ့ အတိုချုပ် reference တစ်ခုပါ။ ဒီ page အတွက်တော့ မလိုပါဘူး။

အခုကစပြီး `prisma` command တိုင်းရဲ့ အဆုံးမှာ `Prisma agent skills are out of date` ဆိုတဲ့ စာကြောင်း ပေါ်လာပါလိမ့်မယ်။ အဲဒါက command ရဲ့ လုပ်ဆောင်ချက်ကို မပြောင်းလဲတာမို့ လျစ်လျူရှုလို့ ရပါတယ်။ Agent skills ဆိုတာ AI coding tool တွေ ဖတ်တဲ့ instruction file တွေ ဖြစ်ပြီး သင့် project မှာ အဲဒါတွေ မရှိသေးတာမို့ အဲဒီစာကြောင်း ပေါ်လာတာပါ။ အဲဒါတွေ ထည့်ပြီး စာကြောင်းကို ရပ်ချင်ရင် [`npx prisma@latest init`](https://www.prisma.io/docs/cli/init) ကို run ပါ။ Prisma ORM 8 မှာ `init` က skills တွေနဲ့ သူတို့ကို up to date ဖြစ်နေစေတဲ့ `postinstall` script တစ်ခု ထည့်ပေးပြီး သင့် contract နဲ့ `.env` ကိုတော့ မထိပါဘူး။ Prisma ORM ကို setup လုပ်တဲ့ command က `orm init` ပါ။

## 3. Database connection string ကို သတ်မှတ်ခြင်း

`.env` မရှိခဲ့ရင် `orm init` က placeholder တစ်ခုနဲ့ ရေးပေးပါတယ် — `DATABASE_URL="mongodb://user:password@localhost:27017/mydb"`။ `.env` ထဲက `DATABASE_URL` ကို သင့် app က အခု သုံးနေတဲ့ database ရဲ့ connection string အဖြစ် သတ်မှတ်ပါ:

```text title=".env"
DATABASE_URL="mongodb://username:password@host:27017/database"
```

နောက်ဆုံး `/` ရဲ့ နောက်၊ `?` မတိုင်ခင် အပိုင်းက database ရဲ့ နာမည် ဖြစ်ပါတယ်။ သင့်စက်ထဲက copy တစ်ခုပေါ်မှာ အလုပ်လုပ်ချင်ရင်တော့ [A database on your machine](/docs/prisma/local-database#mongodb) မှာ MongoDB ကို Docker နဲ့ run ပုံ ပြထားပါတယ်။

`orm init` က `src/prisma/db.ts` ကို ရေးခဲ့ပြီး အဲဒါကို ပြောင်းဖို့ မလိုပါဘူး:

```typescript title="src/prisma/db.ts"
import 'dotenv/config';
import mongo from '@prisma/orm-mongo/runtime';
import { contractFromJson } from '@prisma/orm-mongo/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const contract = contractFromJson<Contract>(contractJson);

export const db = mongo({
  contract,
  url: process.env['DATABASE_URL']!,
});
```

ပထမဆုံး စာကြောင်းက `.env` ကို load လုပ်တာမို့ `db` ကို import လုပ်တဲ့ file တိုင်းက `DATABASE_URL` ကို အဲဒီကနေ ဖတ်ပါတယ်။ သူ import လုပ်တဲ့ `contract` file နှစ်ခုကို အဆင့် 5 မှာ `contract emit` က ရေးပေးပါတယ်။

## 4. Contract ထဲမှာ သင့် collection တွေကို ဖော်ပြခြင်း

Prisma ORM က contract ကို အလိုအလျောက် ရေးပေးဖို့ MongoDB database ကို ဖတ်လို့ မရပါဘူး၊ ဒါကြောင့် သင်ကိုယ်တိုင် ရေးရပါတယ်။ သင့် code က Prisma ORM ကနေ ဖတ် ဒါမှမဟုတ် ရေး လုပ်တဲ့ collection တွေကိုပဲ ဖော်ပြပါ။ ကျန် collection တွေကတော့ ရှိသလို ဆက်ရှိနေပါတယ်။

`src/prisma/contract.prisma` ထဲက နမူနာ contract က `users` collection နဲ့ `posts` collection ကို ဖော်ပြပါတယ်:

```prisma title="src/prisma/contract.prisma"
// use prisma-8

model User {
  id       ObjectId @id @map("_id")
  email    String   @unique
  username String?
  name     String?
  posts    Post[]
  @@map("users")
}

model Post {
  id       ObjectId @id @map("_id")
  title    String
  content  String?
  author   User     @relation(fields: [authorId], references: [id])
  authorId ObjectId
  @@map("posts")
}
```

ပထမဆုံး စာကြောင်းကို ချန်ထားပါ — ဘာလို့လဲဆိုတော့ `contract emit` က အဲဒီစာကြောင်းနဲ့ စတဲ့ `.prisma` file တွေကိုပဲ ဖတ်ပါတယ်။ `@@map("users")` က model ကို သိမ်းတဲ့ collection ကို နာမည်ပေးတာပါ။ MongoDB က document တိုင်းရဲ့ identifier ကို `_id` မှာ သိမ်းပြီး `@map("_id")` က `id` field ကို အဲဒီမှာ သိမ်းစေပါတယ်။ `db.orm` query တွေနဲ့ သူတို့ရဲ့ result တွေမှာ သင် သုံးတာက field နာမည် `id` ဖြစ်ပြီး `_id` ကို Prisma ORM က သင့်ကိုယ်စား ဖတ်/ရေး ပေးပါတယ်။ `@map` ပါတဲ့ တခြား field တွေအတွက်လည်း အလားတူပါပဲ။

Model တွေကို သင့် document တွေနဲ့ ကိုက်ညီအောင် ပြောင်းပါ — collection တစ်ခုအတွက် model တစ်ခု၊ သူ့ document တွေရဲ့ field တစ်ခုစီအတွက် field တစ်ခု။ [Data modeling](/docs/prisma/data-modeling) မှာ field type တွေ စာရင်း ပြထားပါတယ်။

## 5. သင့် code က import လုပ်တဲ့ file တွေ generate လုပ်ခြင်း

`contract emit` က `prisma generate` ရဲ့ နေရာမှာ အစားထိုး ဝင်ပြီး contract ကို ပြောင်းတိုင်း အဲဒါကို run ရပါတယ်:

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

Command က `src/prisma/contract.json` နဲ့ `src/prisma/contract.d.ts` ကို ရေးပေးပြီး `db.ts` က နှစ်ခုလုံးကို import လုပ်ပါတယ်။ သင့် app က အဲဒါတွေ မပါဘဲ run လို့ မရတာမို့ commit လုပ်ပါ။

## 6. `db.orm` နဲ့ collection တစ်ခုကို query လုပ်ခြင်း

`db.orm` က သင့် model တွေကို query လုပ်ပါတယ် — အရင် Prisma ORM version တွေမှာ Prisma Client လုပ်ခဲ့သလိုပါပဲ။ MongoDB မှာ model တစ်ခုကို သူ့ collection ရဲ့ နာမည်နဲ့ ရောက်ပါတယ်၊ အဲဒါက `@@map` ထဲက နာမည်ပါ။ ဒါကြောင့် `User` model က `db.orm.users` ဖြစ်ပါတယ်။

အောက်က code နဲ့ `script.ts` ကို ဖန်တီးပြီး သင့်ကိုယ်ပိုင် နာမည်တွေ ထည့်ပါ — `users` ကို သင့် collection တစ်ခုရဲ့ နာမည်နဲ့၊ `email` နဲ့ `existing@example.com` ကို သူ့ document တွေထဲက field တစ်ခုနဲ့ တန်ဖိုးတစ်ခုနဲ့ အစားထိုးပါ။

```typescript title="script.ts"
import { db } from "./src/prisma/db";

async function main() {
  const user = await db.orm.users.where({ email: "existing@example.com" }).first();
  console.log(user);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Run ကြည့်ပါ:

#### bun

```bash
bunx tsx script.ts
```

#### pnpm

```bash
pnpm dlx tsx script.ts
```

#### yarn

```bash
yarn dlx tsx script.ts
```

#### npm

```bash
npx tsx script.ts
```

```text no-copy
{
  username: null,
  id: '6abca6a1e7a9bb8d8c716f65',
  email: 'existing@example.com',
  name: 'Existing User'
}
```

Document မှာ `username` field မပါဘဲ contract မှာ `username` က optional ဖြစ်တာမို့ result မှာ `null` အနေနဲ့ ပြပါတယ်။ ကိုက်ညီတဲ့ document မရှိရင်တော့ script က `null` ကို print ပါတယ်။

## 7. Pipeline နဲ့ collection တစ်ခုကို query လုပ်ခြင်း

`db.query` က collection တစ်ခုပေါ်မှာ MongoDB aggregation pipeline တစ်ခုကို တည်ဆောက်ပြီး collection ကို MongoDB မှာ သိမ်းထားတဲ့ နာမည်အတိုင်း ခေါ်ပါတယ်။ `.build()` က pipeline ကို ပြန်ပေးပြီး `runtime.query()` က run ပါတယ် — `runtime` ဆိုတာ `await db.runtime()` က ပြန်ပေးတဲ့ object ပါ။ `users`၊ `email` နဲ့ တန်ဖိုးကို သင့်ကိုယ်ပိုင်ဟာနဲ့ ထပ်ပြီး အစားထိုးပါ။

Pipeline က document တွေကို MongoDB သိမ်းထားတဲ့အတိုင်း ဖတ်တာမို့ သင့် schema ထဲက field နာမည်တွေ မဟုတ်ဘဲ သိမ်းထားတဲ့ နာမည်တွေကို သုံးပါတယ်။ `id` မဟုတ်ဘဲ `_id` လို့ ရေးပြီး `@map` ပါတဲ့ တခြား field တိုင်းအတွက် အဲဒီ `@map` ထဲက နာမည်ကို သုံးပါ။

`script.ts` ကို ဒီ version နဲ့ အစားထိုးပါ:

```typescript title="script.ts"
import { db } from "./src/prisma/db";

async function main() {
  const runtime = await db.runtime();
  const query = db.query
    .from("users")
    .match((fields) => fields.email.eq("existing@example.com"))
    .project("email", "name")
    .build();

  const rows = await runtime.query(query);
  console.log(rows);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

ထပ်ပြီး run ကြည့်ပါ:

#### bun

```bash
bunx tsx script.ts
```

#### pnpm

```bash
pnpm dlx tsx script.ts
```

#### yarn

```bash
yarn dlx tsx script.ts
```

#### npm

```bash
npx tsx script.ts
```

```text no-copy
[
  {
    email: 'existing@example.com',
    name: 'Existing User',
    _id: '6abca6a1e7a9bb8d8c716f65'
  }
]
```

## 8. နောက်ထပ် လုပ်ဆောင်ရမယ့် အဆင့်များ

`src/prisma/contract.prisma` ကို ပြောင်းတိုင်း `npx prisma contract emit` ကို ထပ် run ပါ။

ရှိပြီးသား collection တွေထဲက document တွေကို migration မလိုဘဲ ဖတ်/ရေး လုပ်လို့ ရပါတယ်။ Prisma ORM က collection နဲ့ index တွေကို ဖန်တီး ဒါမှမဟုတ် ပြောင်းစေချင်တဲ့အခါ [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) ကို သုံးပါ။

## ဆက်စပ်ဖတ်ရန်

- [`Add Prisma ORM to an existing PostgreSQL database`](/docs/prisma/add-to-existing-project-postgresql): PostgreSQL database မှာ table တွေ ရှိပြီးသား ဖြစ်နေတဲ့ app တစ်ခုဆီကို Prisma ORM ထည့်သွင်းခြင်း။
