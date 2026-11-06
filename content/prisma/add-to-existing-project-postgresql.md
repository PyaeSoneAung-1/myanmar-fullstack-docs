---
title: "PostgreSQL Database ရှိပြီးသား Project ထဲကို Prisma ORM ထည့်သွင်းခြင်း"
description: "PostgreSQL table တွေ ရှိပြီးသား app တစ်ခုထဲကို Prisma ORM ထည့်ပြီး contract infer၊ query နှစ်ခု run လုပ်ကာ ပထမဆုံး table ပြောင်းလဲမှုကို migration plan နဲ့ db migrate နဲ့ အသုံးချတဲ့ အဆင့်ဆင့် လမ်းညွှန်"
order: 53
source: "https://www.prisma.io/docs/prisma-orm/add-to-existing-project/postgresql"
status: translated
updated: 2026-11-06
---

PostgreSQL database မှာ table တွေ ရှိပြီးသား ဖြစ်နေတဲ့ app တစ်ခုထဲကို Prisma ORM ထည့်သွင်းကြည့်ရအောင်။

ဒီ page က PostgreSQL ကို သုံးပါတယ်။ MongoDB နဲ့ လုပ်ချင်ရင်တော့ [MongoDB အတွက် လမ်းညွှန်](/docs/prisma/add-to-existing-project-mongodb) ကို ကြည့်ပါ။

ဒီ page မှာ သင့် PostgreSQL database ထဲမှာ table တွေ ရှိပြီးသား ဖြစ်နေတဲ့ app တစ်ခုထဲကို Prisma ORM ထည့်သွင်းပါမယ်။ `orm init` ကို run လုပ်မယ်၊ သင့် table တွေကနေ contract ကို generate လုပ်မယ်၊ query နှစ်ခု run ကြည့်မယ်၊ ပြီးရင် table တွေပေါ်ကို သင့်ရဲ့ ပထမဆုံး ပြောင်းလဲမှုကို apply လုပ်မယ်။ Contract ဆိုတာ သင့် model တွေကို သိမ်းထားတဲ့ file ဖြစ်ပါတယ်။ Prisma ORM 7 မှာတော့ အဲဒါက `schema.prisma` ပါ။

သင့် app က သင့် PostgreSQL database ဆီ ရောက်ရမယ်၊ ပြီးတော့ Node.js 22 line မှာ 22.18 နဲ့အထက်၊ 24 line မှာ 24.11 နဲ့အထက်၊ ဒါမှမဟုတ် 26 နဲ့အထက်မှာ run ရပါမယ် ([ထောက်ပံ့ထားတဲ့ version များ (Supported versions)](/docs/prisma/supported-versions))။ Production မဟုတ်ဘဲ သင့် database ရဲ့ development copy တစ်ခုပေါ်မှာ အလုပ်လုပ်ပါ။ နောက်ပိုင်း ပြောင်းလဲမှုတွေကို production ပေါ် ဘယ်လို apply လုပ်ရမလဲဆိုတာ [အဆင့် 9](#9-table-တွေပေါ်-ပထမဆုံး-ပြောင်းလဲမှု-လုပ်ခြင်း) မှာ ပြထားပါတယ်။

သင့် database မှာ table တွေ မရှိသေးရင်တော့ သင့်အတွက် table တွေ ဖန်တီးပေးတဲ့ [ရှိပြီးသား app တစ်ခုထဲကို Prisma ORM နဲ့ PostgreSQL ထည့်သွင်းခြင်း](https://www.prisma.io/docs/prisma-orm/quickstart/existing-app/postgresql) ကို လိုက်ပါ။ Prisma ORM က app အသစ်တစ်ခုကို ဖန်တီးပေးစေချင်ရင် [PostgreSQL နဲ့ app အသစ် ဖန်တီးခြင်း](/docs/prisma/quickstart-postgresql) ကို လိုက်ပါ။ သင့် app က လက်ရှိ Prisma ORM 7 ကို သုံးနေရင်တော့ [Prisma ORM 7 to 8 (PostgreSQL)](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql) ကို လိုက်ပါ။

> **မှတ်ချက် — Prisma ORM 7 ကို သုံးနေသလား။**
>
> Prisma ORM 8 က release candidate ပါ။ Prisma ORM 7 ကို အပြည့်အဝ ဆက်ပြီး ထောက်ပံ့ထားဆဲ ဖြစ်ပြီး — သူ့ documentation တွေက [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ၊ setup လမ်းကြောင်းတွေက [/v7/getting-started](https://www.prisma.io/docs/v7/getting-started) မှာ ရှိပါတယ်။
>
> Release candidate ဆိုတာ ဘာကို ဆိုလိုလဲ၊ final release ကို ဘယ်တော့ မျှော်လင့်ရမလဲ၊ version 7 ပေါ်မှာ ဘယ်လို ဆက်နေနိုင်မလဲဆိုတာကို [Release status (ထုတ်ဝေမှု အခြေအနေ)](/docs/prisma/release-status) မှာ ဖတ်ပါ။ Prisma ORM 7 API တိုင်းရဲ့ Prisma ORM 8 နာမည်အတွက်ကတော့ [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) ကို ကြည့်ပါ။

## 1. `tsx` ကို Install လုပ်ခြင်း

ဒီ page က scripts တွေကို `tsx` နဲ့ run ပါတယ်။ သင့် project မှာ မရှိသေးရင် install လုပ်ပါ:

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

## 2. Prisma ORM ကို Initialize လုပ်ခြင်း

အောက်က `orm init` command က သင့် `tsconfig.json` နဲ့ `package.json` ကို ပြောင်းပါတယ်။ `tsconfig.json` ထဲမှာ `module` ကို `preserve`၊ `moduleResolution` ကို `bundler` သတ်မှတ်ပါတယ်။ သင့် `package.json` မှာ `"type"` field မရှိရင် `"type": "module"` ကို ထည့်ပါတယ်။ `"type": "commonjs"` ရှိနေရင်တော့ အဲဒါကို ဆက်ထားပြီး warning တစ်ခု print ပါတယ်။ သင့် app က CommonJS အနေနဲ့ run နေရင် — ဥပမာ `require` နဲ့ file တွေ load လုပ်တာကြောင့် ဒါမှမဟုတ် `tsc` က `require` calls တွေအဖြစ် compile လုပ်တာကြောင့် — သင့် app ကို ပြန် start မလုပ်ခင် [CommonJS project တစ်ခုထဲမှာ](https://www.prisma.io/docs/cli/orm-init#in-a-commonjs-project) ကို လိုက်ပါ။ `tsx` က ဒီ page ထဲက scripts တွေကို app နှစ်မျိုးစလုံးမှာ run ပေးတာမို့ ဒီ page ကို အရင် ပြီးအောင် လုပ်နိုင်ပါတယ်။

သင့် project ရဲ့ root ကနေ run ပါ:

#### bun

```bash
bunx prisma@latest orm init --yes --target postgres --authoring psl --write-env
```

#### pnpm

```bash
pnpm dlx prisma@latest orm init --yes --target postgres --authoring psl --write-env
```

#### yarn

```bash
yarn dlx prisma@latest orm init --yes --target postgres --authoring psl --write-env
```

#### npm

```bash
npx prisma@latest orm init --yes --target postgres --authoring psl --write-env
```

`prisma@latest` က Prisma ORM 8 ကို run ပြီး `--target postgres` က PostgreSQL ကို ရွေးပါတယ်။ `--authoring psl` က PSL (Prisma Schema Language) ကို ရွေးတာဖြစ်ပြီး — အဲဒါက Prisma ORM 7 ကတည်းက သိထားတဲ့ `.prisma` file format ပါ။ `--write-env` က `.env` file ကို ရေးပါတယ် (`.env` ရှိပြီးသားဆိုရင် မရေးပါဘူး)။ `--yes` က မေးခွန်းတိုင်းအတွက် default အဖြေကို လက်ခံတာမို့ command က ဘာမှ မေးမှာ မဟုတ်ပါဘူး။

Command က Prisma ORM packages တွေကို install လုပ်ပြီး သူ့ file တွေကို ရေးပါတယ်။ ဒီ page မှာ အဲဒီထဲက သုံးခုကို သုံးပါတယ်:

* `src/prisma/contract.prisma` — နမူနာ contract တစ်ခု။ အဆင့် 4 မှာ သင့် table တွေကနေ generate လုပ်ထားတဲ့ contract နဲ့ အစားထိုးပါမယ်။
* `src/prisma/db.ts` — query တွေ run ဖို့ သင့် code က import လုပ်တဲ့ file။
* `.env` — connection string ကို သိမ်းထားတဲ့ file။

Command က `prisma-8.md` (query ရေးတဲ့အတွက် အတိုချုပ် reference တစ်ခု) ကိုလည်း ရေးပါတယ်။ ဒီ page အတွက်တော့ မလိုပါဘူး။

အခုကစပြီး `prisma` command တိုင်းရဲ့ အဆုံးမှာ `Prisma agent skills are out of date` ဆိုတဲ့ စာကြောင်း ပေါ်လာပါလိမ့်မယ်။ Command ရဲ့ လုပ်ဆောင်ချက်ကို မပြောင်းလဲတာမို့ လျစ်လျူရှုနိုင်ပါတယ်။ Agent skills ဆိုတာ AI coding tools တွေ ဖတ်တဲ့ instruction files တွေဖြစ်ပြီး — သင့် project မှာ တစ်ခုမှ မရှိသေးတာကြောင့် အဲဒီစာကြောင်း ပေါ်လာတာပါ။ အဲဒါတွေ ထည့်ပြီး စာကြောင်းကို ရပ်ချင်ရင် [`npx prisma@latest init`](https://www.prisma.io/docs/cli/init) ကို run ပါ။ Prisma ORM 8 မှာ `init` က skills တွေနဲ့ သူတို့ကို up to date ထိန်းထားတဲ့ `postinstall` script ကို ထည့်ပေးပြီး — သင့် contract နဲ့ `.env` ကိုတော့ မထိပါဘူး။ Prisma ORM ကို set up လုပ်တဲ့ command က `orm init` ပါ။

## 3. Database Connection String ကို သတ်မှတ်ခြင်း

`.env` မရှိခဲ့ရင် `orm init` က placeholder တစ်ခုနဲ့ ရေးပေးခဲ့ပါတယ် — `DATABASE_URL="postgresql://user:password@localhost:5432/mydb"`။ `.env` ထဲက `DATABASE_URL` ကို သင့် database ရဲ့ development copy အတွက် connection string နဲ့ သတ်မှတ်ပါ:

```text title=".env"
DATABASE_URL="postgres://username:password@host:5432/database?sslmode=require"
```

အဲဒီ copy က သင့်စက်ပေါ်မှာ run သင့်တယ်ဆိုရင် — [သင့်စက်ပေါ်က database တစ်ခု](/docs/prisma/local-database) မှာ Docker နဲ့ ဘယ်လို start လုပ်ရမလဲ ပြထားပါတယ်။

`orm init` က `src/prisma/db.ts` ကို ရေးပေးခဲ့ပြီး သင့်အနေနဲ့ ပြောင်းစရာ မလိုပါဘူး:

```typescript title="src/prisma/db.ts"
import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});
```

ပထမဆုံး စာကြောင်းက `.env` ကို load လုပ်တာမို့ `db` ကို import လုပ်တဲ့ file တိုင်းက `DATABASE_URL` ကို အဲဒီကနေ ဖတ်ပါတယ်။ Import လုပ်တဲ့ `contract` file နှစ်ခုကို အဆင့် 5 မှာ `contract emit` က ရေးပေးပါတယ်။

## 4. သင့် Table တွေကနေ Contract ကို Generate လုပ်ခြင်း

`contract infer` က သင့် database ထဲက table တွေကို ဖတ်ပြီး သူတို့ကို ဖော်ပြတဲ့ contract တစ်ခုကို ရေးပါတယ်။ Prisma ORM 7 မှာ `prisma db pull` လုပ်ခဲ့တဲ့ အလုပ်ကို လုပ်တာပါ။ Run ပါ:

#### bun

```bash
bunx prisma contract infer --output ./src/prisma/contract.prisma
```

#### pnpm

```bash
pnpm prisma contract infer --output ./src/prisma/contract.prisma
```

#### yarn

```bash
yarn prisma contract infer --output ./src/prisma/contract.prisma
```

#### npm

```bash
npx prisma contract infer --output ./src/prisma/contract.prisma
```

```text no-copy
✔ Connecting to database...
✔ Introspecting database schema...
Overwriting existing file: src/prisma/contract.prisma
│  database:  postgres://****@127.0.0.1:54329/legacy

✔ Contract written to src/prisma/contract.prisma
```

Command က အဆင့် 2 က နမူနာ contract ကို အစားထိုးပါတယ်။ `user` table နဲ့ `post` table ပါတဲ့ database တစ်ခုအတွက် contract အသစ်က ဒီလိုပုံ ရပါတယ်:

```prisma title="src/prisma/contract.prisma"
// use prisma-8
// Contract inferred from the live database schema. Edit as needed, then run `prisma contract emit`.

namespace public {
  model User {
    id        Int               @id(map: "user_pkey") @default(autoincrement())
    email     String            @unique(map: "user_email_key")
    name      String?
    role      String            @default("member")
    age       Int?
    createdAt DateTime(precision: 6) @default(now()) @map("created_at")
    posts     Post[]

    @@check(expression: sql`(age >= 0)`, map: "user_age_check")
    @@map("user")
  }

  model Post {
    id        Int          @id(map: "post_pkey") @default(autoincrement())
    title     VarChar(200)
    published Boolean      @default(false)
    authorId  Int          @map("author_id")
    author    User         @relation(fields: [authorId], references: [id], onDelete: Cascade, map: "post_author_id_fkey")

    @@index([authorId], map: "post_author_id_idx")
    @@index([title], map: "post_published_idx", where: sql`published`)
    @@index(expression: sql`lower(title::text)`, map: "post_title_lower_idx")
    @@rls
    @@map("post")
  }

  policy_select post_read {
    target = Post
    roles = [public]
    using = sql`published`
    @@map("post_read")
  }
}
```

ပထမဆုံး စာကြောင်းကို ထားပါ — ဘာလို့လဲဆိုတော့ `contract emit` က အဲဒီစာကြောင်းနဲ့ စတဲ့ `.prisma` files တွေကိုပဲ ဖတ်ပါတယ်။ `namespace public` က PostgreSQL schema `public` ထဲက table တွေရဲ့ model တွေကို သိမ်းထားပါတယ်။ Prisma ORM 7 က `DateTime @db.Timestamptz` လို့ ရေးခဲ့ရာမှာ contract က `DateTime(precision: 6)` လို့ ရေးပြီး — `String @db.VarChar(200)` ကတော့ `VarChar(200)` ဖြစ်လာပါတယ်။ Policy block ထဲက `roles = [public]` ဆိုတာ schema မဟုတ်ဘဲ PostgreSQL role `PUBLIC` ဖြစ်ပါတယ်။

`contract infer` က database ရဲ့ အောက်ပါ အပိုင်းတွေကို ဖတ်ပြီး တစ်ခုချင်းစီကို contract ထဲ ရေးပါတယ်:

| Database ထဲမှာ | အပေါ်က contract ထဲမှာ |
| --- | --- |
| Primary keys နဲ့ unique constraints | `@id`, `@unique` |
| Column defaults | `@default("member")`, `@default(now())` |
| Foreign keys နဲ့ delete ဖြစ်တဲ့အခါ ဘာဖြစ်လဲ | `@relation(..., onDelete: Cascade)` နဲ့ `posts` field |
| Check constraints | `@@check` |
| Indexes — table ရဲ့ အစိတ်အပိုင်းတစ်ခုပေါ်က index နဲ့ expression ပေါ်က index အပါအဝင် | `@@index` စာကြောင်း သုံးခု |
| Row-level security နဲ့ သူ့ policies တွေ | `@@rls` နဲ့ `policy_select` block |

ဆက်မလုပ်ခင် file ကို ပြန်စစ်ပါ။ Model တွေကို နာမည်ပြောင်းနိုင်ပြီး — မသုံးချင်သေးတဲ့ table တွေရဲ့ model တွေကို ဖျက်နိုင်ပါတယ်။ Model တစ်ခုက `@@map` မပါရင် model နာမည်အတိအကျရှိတဲ့ table ကို သုံးပါတယ်။ ဒါကြောင့် `user` table အတွက် `contract infer` က `@@map("user")` ပါတဲ့ `User` model ကို ရေးခဲ့တာပါ။ Model နာမည်ပြောင်းတဲ့အခါ `@@map` စာကြောင်းတွေကို ထားခဲ့ပါ — ဒါမှ model က table အတူတူကိုပဲ ဆက်ဖတ်နိုင်မှာပါ။

Model မရှိတဲ့ table တစ်ခုက သင့် database ထဲမှာ ဆက်ရှိနေပြီး နောက်ပိုင်း migration တွေက အဲဒါကို မထိပါဘူး။ ဒါပေမယ့် row-level security policy တွေ ရှိတဲ့ table ရဲ့ model ကိုတော့ မဖျက်ပါနဲ့။ ဖျက်လိုက်ရင် အဆင့် 6 က `db sign` က contract က မကြေညာထားတဲ့ policy တွေကို တွေ့တာမို့ fail ဖြစ်ပါလိမ့်မယ်။

### Date နဲ့ Time Column တွေ

`contract infer` က `timestamptz` column တစ်ခုကို `DateTime(precision: 6)` type ပေးပါတယ်။ `timestamptz(3)` column အတွက်ကတော့ `DateTime`၊ `timestamp` column အတွက် `DateTime(storage: timestamp, precision: 6)`၊ `timestamp(3)` အတွက် `DateTime(storage: timestamp)`၊ `date` column အတွက် `Date`၊ `time` column အတွက် `Time` ပေးပါတယ်။ Prisma ORM က `DateTime` ကို JavaScript `Date` အနေနဲ့ ပြန်ပေးပြီး `Date` ဒါမှမဟုတ် `Time` ကို `2026-09-30` လိုမျိုး ISO 8601 string အနေနဲ့ ပြန်ပေးပါတယ်။ သင့် app မှာ `Temporal` မလိုပါဘူး။ `Date` က millisecond အထိပဲ သိမ်းတာမို့ `05:36:38.60182` လိုမျိုး microsecond ပါတဲ့ `timestamptz` value က `05:36:38.601` အနေနဲ့ ဖတ်ပါတယ်။

ဂဏန်းတိုင်းကို ထိန်းထားချင်ရင် `DateTime` field မှာ `as: string` ထည့်ပါ — ဥပမာ `DateTime(as: string, precision: 6)` — အဲဒါက ISO 8601 string အနေနဲ့ ဖတ်ပါတယ်။ JavaScript ရဲ့ date/time API အသစ်ဖြစ်တဲ့ `Temporal` object တွေ လိုချင်ရင်တော့ `DateTime`၊ `Date` ဒါမှမဟုတ် `Time` field မှာ `as: temporal` ထည့်ပါ။ ဘယ်လိုဖြစ်စေ database ထဲက column က မပြောင်းလဲပါဘူး။ သင့် runtime မှာ `Temporal` ရှိမရှိကို `node -p "typeof Temporal"` နဲ့ စစ်ပါ။ Node.js 26 မှာ built in ပါပြီ (Homebrew ရဲ့ build ကလွဲပြီး)၊ Node.js 24 နဲ့ အရင်တွေမှာတော့ မပါပါဘူး။ `undefined` လို့ print လုပ်ရင် — အဲဒီလို field ကို ဖတ်တဲ့ ပထမဆုံး query က `RUNTIME.TEMPORAL_UNAVAILABLE` နဲ့ fail ဖြစ်ပါလိမ့်မယ်။ ဒါကြောင့် `temporal-polyfill` package ကို install လုပ်ပါ:

#### bun

```bash
bun add temporal-polyfill
```

#### pnpm

```bash
pnpm add temporal-polyfill
```

#### yarn

```bash
yarn add temporal-polyfill
```

#### npm

```bash
npm install temporal-polyfill
```

ပြီးရင် `src/prisma/db.ts` ရဲ့ အပေါ်ဆုံးမှာ ဒီစာကြောင်းကို ထည့်ပါ:

```typescript title="src/prisma/db.ts"
import "temporal-polyfill/global";
```

### အခြား PostgreSQL Schema တွေထဲက Table တွေ

`contract infer` က `public` လို့ နာမည်ရှိတဲ့ PostgreSQL schema ကိုပဲ ဖတ်ပါတယ်။ အခြား schema တွေထဲက table တွေကို ကျော်သွားပြီး သူတို့အကြောင်း ဘာမှ မပြောပါဘူး။

အခြား schema တစ်ခုက table ကို သုံးချင်ရင် — အဲဒီ schema နာမည်နဲ့ `namespace` block တစ်ခုထဲမှာ သူ့ model ကို ကိုယ်တိုင် ရေးပါ။ `audit` schema ထဲက `event` table အတွက် ဒါကို contract ရဲ့ အဆုံးမှာ ထည့်ပါ:

```prisma title="src/prisma/contract.prisma"
namespace audit {
  model Event {
    id      Int    @id @default(autoincrement())
    message String

    @@map("event")
  }
}
```

အဆင့် 6 မှာ `db sign` က ဒီ table ကို `public` ထဲက table တွေလိုပဲ စစ်ပါတယ်။ သင့် code က model ကို `db.orm.audit.Event` အနေနဲ့ ရောက်ပါတယ်။

## 5. သင့် Code က Import လုပ်တဲ့ Files တွေကို Generate လုပ်ခြင်း

`contract emit` က `prisma generate` နေရာမှာ အစားထိုးဝင်ပြီး — contract ကို ပြောင်းတိုင်း run ရပါတယ်:

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

Command က `src/prisma/contract.json` နဲ့ `src/prisma/contract.d.ts` ကို ရေးပြီး `db.ts` က နှစ်ခုစလုံးကို import လုပ်ပါတယ်။ သူတို့မပါဘဲ သင့် app run လို့မရတာမို့ commit လုပ်ပါ။

Contract ထဲမှာ SQL text ပါတဲ့ policy၊ check ဒါမှမဟုတ် index တစ်ခု ရှိရင် — `contract emit` က တစ်ခုစီအတွက် warning တစ်ခု print ပြီး file နှစ်ခုစလုံးကိုတော့ ဆက်ရေးပါတယ်။ Warning တစ်ခုစီက ဒီလို စပါတယ်:

```text no-copy
(node:15169) [PN_EXACT_NAME_BODY_COMPARISON] Warning: check "user_age_check" uses map: with a SQL body.
```

`contract infer` ရေးထားတဲ့ contract ပေါ်က ဒီ warnings တွေကို လျစ်လျူရှုနိုင်ပါတယ်။ အဲဒါတွေက ကိုယ်တိုင် ရေးတဲ့ SQL text အကြောင်းဖြစ်ပြီး — Prisma ORM က အဲဒါကို PostgreSQL ပြန်ပေးတဲ့ text နဲ့ စာလုံးတစ်လုံးချင်း နှိုင်းယှဉ်တာပါ။

## 6. Database ကို Sign လုပ်ခြင်း

`db sign` က သင့် database မှာ contract ဖော်ပြတဲ့အရာတွေ ရှိမရှိ စစ်ပါတယ်။ ပြီးရင် database က ဘယ် contract နဲ့ ကိုက်ညီလဲဆိုတာကို မှတ်တမ်းတင်ပါတယ်။ အဆင့် 9 က `migration plan` က အဲဒီမှတ်တမ်းကို လိုအပ်ပြီး — empty database ကနေ မဟုတ်ဘဲ သင့်မှာ ရှိပြီးသား table တွေကနေ စနိုင်ဖို့ပါ။

#### bun

```bash
bunx prisma db sign
```

#### pnpm

```bash
pnpm prisma db sign
```

#### yarn

```bash
yarn prisma db sign
```

#### npm

```bash
npx prisma db sign
```

```text no-copy
✔ Connecting to database...
✔ Verifying database schema...
✔ Signing database...
│  contract:  src/prisma/contract.json
│  database:  postgres://****@127.0.0.1:54329/legacy

✔ Database signed

from:  none
to:    596586f61799d5b2585df874a00f8d6f12d73a522d2eefbcbec62dba4e9904a4

✔ Advanced ref "db" → 596586f61799d5b2585df874a00f8d6f12d73a522d2eefbcbec62dba4e9904a4
```

Database မှာ ရှိပြီး contract က မကြေညာထားတဲ့ table ဒါမှမဟုတ် column တစ်ခုက ပြဿနာ မဟုတ်ပါဘူး။ Contract က ကြေညာတဲ့ အရာတစ်ခု database မှာ မရှိရင်တော့ `db sign` က ဘာမှ မရေးဘဲ exit code 4 နဲ့ ထွက်ပါတယ်။ ဥပမာ — `User` model မှာ `phone` field ပါပြီး table မှာ `phone` column မရှိတဲ့အခါ:

```text no-copy
✘ Schema issues
└─ ✘ missing: database/public/user/column:phone

✘ [CONTRACT.SCHEMA_VERIFICATION_FAILED] Database schema does not satisfy contract (1 failure)
  why: The live schema differs: missing: database/public/user/column:phone.
```

ဖြေရှင်းဖို့ — database မှာ မရှိတဲ့အရာတွေကို contract ကနေ ဖယ်ပါ၊ `npx prisma contract emit` ကို run ပါ၊ ပြီးမှ ပြန် sign လုပ်ပါ။

စစ်ဆေးမှု အောင်မြင်တဲ့အခါ `db sign` က database ထဲမှာ မှတ်တမ်းတစ်ခု သိမ်းပြီး သင့် project ထဲကို files တွေ ရေးပါတယ်:

* ဘယ် contract နဲ့ ကိုက်ညီလဲဆိုတဲ့ မှတ်တမ်းကို database ထဲက `prisma_contract.marker` table မှာ သိမ်းပါတယ်။ မှတ်တမ်းထဲမှာ contract ရဲ့ hash ပါပြီး — အဲဒါက output ထဲက `to:` နောက်က ရှည်လျားတဲ့ စာသားပါ။
* Contract ရဲ့ copy တစ်ခုကို သင့် project ထဲက `migrations/snapshots/` အောက်မှာ သိမ်းပါတယ်။
* `db` ref ကို `migrations/app/refs/db.json` file အနေနဲ့ သိမ်းပါတယ်။ အဲဒါမှာ hash အတူတူပါပါတယ်။ Output ထဲက `Advanced ref "db"` ဆိုတဲ့ စာကြောင်းက command က ဒီ file ကို ရေးခဲ့တယ်ဆိုတာ ဆိုလိုပါတယ်။

နောက် [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) က အဲဒီ copy နဲ့ `db` ref ကို ဖတ်တာမို့ သင့်မှာ ရှိပြီးသား table တွေကနေ စပါတယ်။ `migrations/` directory ကို commit လုပ်ပါ။

ပထမဆုံး migration ကို plan မလုပ်ခင် — database ထဲမှာ ရှိပြီးသား table တွေအတွက် model တွေ ထည့်နိုင်ပါတယ်။ `npx prisma contract emit` ကို run ပြီး `npx prisma db sign` ကို ပြန် run ပါ — အဲဒါက database ကို contract အသစ်နဲ့ စစ်ပြီး မှတ်တမ်းကို အစားထိုးပေးပါတယ်။

## 7. `db.orm` နဲ့ Model တစ်ခုကို Query လုပ်ခြင်း

`db.orm` က သင့် model တွေကို query လုပ်ပါတယ် — Prisma ORM 7 မှာ Prisma Client လုပ်ခဲ့တဲ့ ပုံစံအတိုင်းပါ။ အောက်က code နဲ့ `script.ts` ကို ဖန်တီးပါ။ အဲဒါက အဆင့် 4 က `User` model ကို ဖတ်ပါတယ်။ သင့်ကိုယ်ပိုင် model တစ်ခုနဲ့ သူ့ field တွေကို အစားထိုး သုံးပါ:

```typescript title="script.ts"
import { db } from "./src/prisma/db";

async function main() {
  const users = await db.orm.public.User
    .select("id", "email", "name")
    .limit(2)
    .all();

  console.log(users);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Run ပါ:

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
  { id: 1, email: 'alice@example.com', name: 'Alice' },
  { id: 2, email: 'bob@example.com', name: 'Bob' }
]
```

## 8. `db.sql` နဲ့ Table တစ်ခုကို Query လုပ်ခြင်း

`db.sql` က SQL query တွေကို တည်ဆောက်ပါတယ်။ `db.orm` က model နဲ့ field တွေကို နာမည်ပေးရာမှာ `db.sql` ကတော့ database ထဲမှာ ရှိတဲ့အတိုင်း table နဲ့ column တွေကို နာမည်ပေးပါတယ်။ ဒီဥပမာက `User` model က `@@map("user")` နဲ့ map လုပ်ထားတဲ့ `user` table ကို ဖတ်ပါတယ်။ `.build()` က query ကို မ run ဘဲ ပြန်ပေးပြီး `db.query()` က run ပါတယ်။

`script.ts` ကို ဒီ version နဲ့ အစားထိုးပါ:

```typescript title="script.ts"
import { db } from "./src/prisma/db";

async function main() {
  const query = db.sql.public.user
    .select("id", "email", "name")
    .limit(2)
    .build();

  const rows = await db.query(query);
  console.log(rows);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

ပြန် run ပါ:

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
  { id: 1, email: 'alice@example.com', name: 'Alice' },
  { id: 2, email: 'bob@example.com', name: 'Bob' }
]
```

## 9. Table တွေပေါ် ပထမဆုံး ပြောင်းလဲမှု လုပ်ခြင်း

ဒီကစပြီး table တွေကို contract ကို ပြောင်းပြီး ပြောင်းလဲပါမယ်။ `src/prisma/contract.prisma` ထဲက model တစ်ခုမှာ field တစ်ခု ထည့်ပါ။ ဒီဥပမာက အဆင့် 4 က `User` model မှာ `phone` ကို ထည့်ပါတယ် — သင့်ကိုယ်ပိုင် model နဲ့ field တစ်ခုကို အစားထိုး သုံးပါ:

```prisma title="src/prisma/contract.prisma"
  model User {
    id        Int         @id(map: "user_pkey") @default(autoincrement())
    email     String      @unique(map: "user_email_key")
    name      String?
    phone     String? // [!code ++]
```

Files တွေကို ပြန် generate လုပ်ပြီး migration တစ်ခု plan လုပ်ပါ။ `migration plan` က contract အသစ်ကို နောက်ဆုံး sign ဒါမှမဟုတ် apply လုပ်ခဲ့တဲ့ contract နဲ့ နှိုင်းယှဉ်ပြီး — ကွာခြားချက်ကို `migrations/app/` အောက်က directory အသစ်တစ်ခုထဲ ရေးပါတယ်။ `--name` က directory နာမည်ရဲ့ အဆုံးကို (ရက်စွဲနဲ့ အချိန်နောက်မှာ) သတ်မှတ်ပါတယ်။

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

```text no-copy
│  contract:    src/prisma/contract.json
│  migrations:  migrations/app
│  name:        add_user_phone

✔ Planned baseline (10 operation(s)) + 1 operation(s)

migrations/app/20260929T2130_baseline
├─ Create schema "public"
├─ Create table "post"
├─ Create table "user"
├─ Add unique constraint on "user" (email)
├─ Create index "post_author_id_idx" on "post"
├─ Create index "post_published_idx" on "post"
├─ Create index "post_title_lower_idx" on "post"
├─ Add foreign key "post_author_id_fkey" on "post"
├─ Enable row-level security on "post"
└─ Create RLS policy "post_read" on "post"
migrations/app/20260929T2131_add_user_phone
└─ Add column "phone" to "user"

from:       596586f61799d5b2585df874a00f8d6f12d73a522d2eefbcbec62dba4e9904a4
to:         4ef74b97c298402786f23bf299e17baba815e8d521bc90aaab59ab7de747c969
baseline:   migrations/app/20260929T2130_baseline
app space:  migrations/app/20260929T2131_add_user_phone
```

Output က SQL preview နဲ့ ဆက်သွားပါတယ်။ ပထမဆုံး plan က directory နှစ်ခု ရေးပါတယ်။ Baseline က သင် `db sign` ကို run လုပ်ချိန်မှာ ရှိခဲ့တဲ့ table တွေကို ဖော်ပြပါတယ်။ `Create table` operations တွေ စာရင်းပါပေမယ့် — အဲဒီ table တွေ ရှိပြီးသား database ပေါ်မှာ `db migrate` က သူတို့ကို run မှာ မဟုတ်ပါဘူး။ ဒုတိယ directory က သင့်ပြောင်းလဲမှုပါ။ Directory နှစ်ခုစလုံးကို commit လုပ်ပါ။ `migration plan` က baseline ကို ဘယ်အချိန် ရေးသလဲဆိုတာကို [Automatic baseline ဆိုတာ](https://www.prisma.io/docs/cli/migration-plan#the-automatic-baseline) မှာ ရှင်းပြထားပါတယ်။

Output ထဲက `space` ဆိုတဲ့ စကားလုံးကို လျစ်လျူရှုနိုင်ပါတယ် — သင့် migration အားလုံး `migrations/app/` ထဲမှာ ရှိတာပါ။

Migration ကို apply လုပ်ပါ:

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

```text no-copy
✔ Running migration plan across spaces
│  migrations:  migrations
│  database:    postgres://****@127.0.0.1:54329/legacy

✔ Applied 1 migration(s) (1 operation(s)) across 1 contract space(s)

App space
├─ Add column "phone" to "user"
└─ marker 4ef74b97c298402786f23bf299e17baba815e8d521bc90aaab59ab7de747c969

✔ Advanced ref "db" → 4ef74b97c298402786f23bf299e17baba815e8d521bc90aaab59ab7de747c969
```

`db migrate` က database မှာ မရှိသေးတဲ့ migration တွေကိုပဲ run ပါတယ်။ ဒီမှာ `phone` column ကို ထည့်ပြီး သင့် table တွေထဲက rows တွေက ရှိသလို ဆက်ရှိနေပါတယ်။ Output ထဲက `marker` က `db sign` က မှတ်တမ်းဖြစ်ပြီး အခု hash အသစ်ကို ကိုင်ထားပါတယ်။ သင့် development database ပေါ် migration apply လုပ်တိုင်း `--advance-ref db` ကို ပေးပါ — ဒါမှ နောက် `migration plan` မှာ သင့်နောက်ပြောင်းလဲမှုပဲ ပါမှာပါ။

အလားတူ table တွေ ရှိတဲ့ အခြား database တစ်ခု (ဥပမာ production) ပေါ် migration ကို apply လုပ်ချင်ရင် သူ့ connection string ကို ပေးပါ။ အဲဒီမှာ `--advance-ref` ကို ချန်လိုက်ပါ — ဘာလို့လဲဆိုတော့ `db` ref က သင့် development database ကို ခြေရာခံတာပါ:

#### bun

```bash
bunx prisma db migrate --db "$PRODUCTION_DATABASE_URL"
```

#### pnpm

```bash
pnpm prisma db migrate --db "$PRODUCTION_DATABASE_URL"
```

#### yarn

```bash
yarn prisma db migrate --db "$PRODUCTION_DATABASE_URL"
```

#### npm

```bash
npx prisma db migrate --db "$PRODUCTION_DATABASE_URL"
```

အဲဒီ database ပေါ်မှာ `db sign` run စရာ မလိုပါဘူး။ `db migrate` က baseline ရဲ့ table တွေ ရှိပြီးသားဖြစ်တာကို တွေ့ပြီး သူတို့နဲ့ သူတို့ရဲ့ rows တွေကို ရှိသလို ထားခဲ့ကာ `phone` column ကို ထည့်ပါတယ်။

## နောက်ထပ် အဆင့်များ (Next steps)

နောက်ပိုင်း ပြောင်းလဲမှုတိုင်းက အဆင့် လေးဆင့်တည်းကို လိုက်ပါတယ်: `src/prisma/contract.prisma` ကို ပြင်ပါ၊ `npx prisma contract emit` ကို run ပါ၊ `npx prisma migration plan --name <name>` ကို run ပါ၊ ပြီးရင် `npx prisma db migrate --advance-ref db` ကို run ပါ။

* [Migration တစ်ခု Generate လုပ်ခြင်း](/docs/prisma/generating-a-migration) — migration directory တစ်ခုထဲမှာ ဘာတွေ ပါလဲ၊ ဘယ်လို ပြင်ရမလဲ။
* [`db update`](https://www.prisma.io/docs/cli/db-update) — migration files မရေးဘဲ contract ပြောင်းလဲမှုကို development database ပေါ် apply လုပ်ရန်။
* [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) — Prisma ORM 7 call တိုင်းရဲ့ Prisma ORM 8 နာမည်။
* [Prisma Compute](https://www.prisma.io/docs/compute) — app ကို host လုပ်ရန်။ Prisma CLI က apps တွေကို [Prisma Composer](https://www.prisma.io/docs/composer) နဲ့ Prisma Compute ပေါ် deploy လုပ်ပါတယ်။ Prisma Compute က လက်ရှိ WebSocket servers တွေကို မထောက်ပံ့သေးဘဲ multi-region deployments လည်း မရှိပါဘူး ([ကန့်သတ်ချက်များ](https://www.prisma.io/docs/compute/limitations))။

## ဆက်စပ် Page များ

- [ရှိပြီးသား MongoDB database တစ်ခုထဲကို Prisma ORM ထည့်သွင်းခြင်း](/docs/prisma/add-to-existing-project-mongodb): MongoDB database မှာ collection တွေ ရှိပြီးသား ဖြစ်တဲ့ app တစ်ခုထဲကို Prisma ORM ထည့်သွင်းခြင်း။
