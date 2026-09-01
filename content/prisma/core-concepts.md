---
title: "အဓိက သဘောတရားများ (Core Concepts)"
description: "Prisma 8 ရဲ့ command နဲ့ API တိုင်း အခြေခံထားတဲ့ သဘောတရားတွေ — contract, emitting, plan, database signature, codec နဲ့ migration graph"
order: 13
source: "https://www.prisma.io/docs/orm/core-concepts"
status: translated
updated: 2026-09-01
---

Prisma 8 က Prisma ORM ရဲ့ လက်ရှိ major version ဖြစ်ပြီး — TypeScript နဲ့ ပြန်တည်ဆောက်ထားကာ အဓိက အယူအဆတစ်ခုပေါ်မှာ အခြေခံပါတယ်: သင့် application နဲ့ သင့် database အကြား ဒေတာက ဘယ်လိုပုံစံ ရှိသင့်လဲဆိုတဲ့ ရှင်းလင်းပြီး စစ်ဆေးလို့ရတဲ့ သဘောတူညီချက် (agreement) တစ်ခု ရှိနေရမယ်ဆိုတာပါ။ အဲဒီအယူအဆကနေ ဝေါဟာရအနည်းငယ် ဆင်းသက်လာပြီး — CLI, query API တွေနဲ့ error message တွေမှာ နေရာတိုင်း ထပ်တလဲလဲ တွေ့ရပါတယ်။ အောက်က section တွေက အသုံးအနှုန်းတစ်ခုချင်းစီကို ရိုးရိုးဘာသာစကားနဲ့ အဓိပ္ပာယ်ဖွင့်ပေးပြီး — တစ်ခုချင်းစီမှာ ပိုနက်ရှိုင်းတဲ့ page ဆီ link လည်း ပါပါတယ်။

## Contract နဲ့ Schema

**Contract** ဆိုတာ သင့် application လိုအပ်တဲ့ ဒေတာရဲ့ ဖော်ပြချက်ပါ — model တွေ၊ field တွေ၊ ဆက်စပ်ပုံ (relation) တွေ၊ ပြီးတော့ database table ဒါမှမဟုတ် collection တွေနဲ့ ဘယ်လို map လုပ်လဲဆိုတာတွေ ပါဝင်ပါတယ်။ အဲဒါကို PSL (Prisma schema language) သုံးပြီး `.prisma` file ထဲမှာ ဒါမှမဟုတ် TypeScript နဲ့ ရေးပါတယ်:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  userId    Int

  user User @relation(fields: [userId], references: [id])
}
```

Schema ကတော့ နောက်တစ်မျိုးပါ — database ရဲ့ အစစ်အမှန် ဖွဲ့စည်းပုံ၊ အခု ရှိနေတဲ့ table တွေနဲ့ index တွေပါ။ Contract က သင့် repository ထဲမှာ နေပြီး — schema က database ထဲမှာ နေပါတယ်။ Prisma 8 လုပ်တဲ့အရာတိုင်းက ဒီနှစ်ခုကြားက ဆက်စပ်မှုပါပဲ: query တွေက contract ပေါ်မှာ type လုပ်ထားပြီး — migration တွေက schema ကို contract ဆီ ရွှေ့ပေးကာ verification က schema က contract ကို ကျေနပ်သေးလားဆိုတာ စစ်ပေးပါတယ်။

> **Contract နဲ့ Schema**
>
> တခြား tool တွေက သင်ရေးတဲ့ file ကို "schema" လို့ ခေါ်ပါတယ်။ Prisma 8 မှာတော့ သင်က **contract** ကို ရေးပြီး — **schema** က database မှာ ရှိနေတဲ့အရာပါ။ Command ဒါမှမဟုတ် error message တစ်ခုက "schema" လို့ ပြောရင် — database ဘက်ကို ဆိုလိုတာပါ။

အသေးစိတ်ကို [The data contract](https://www.prisma.io/docs/orm/contract-authoring/the-data-contract) မှာ ဖတ်နိုင်ပြီး — [PSL](https://www.prisma.io/docs/orm/contract-authoring/psl-syntax) ဒါမှမဟုတ် [TypeScript](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder) နဲ့ ရေးနိုင်ပါတယ်။

## Emitting — Source ကနေ Artifact တွေဆီ

Emitting ဆိုတာ သင့် contract source ကို ရိုးရိုး file နှစ်ခုအဖြစ် compile လုပ်ပေးတဲ့ build step ပါ:

```bash
npx prisma@latest contract emit
```

1. `contract.json` — သင့် model တွေ၊ storage layout နဲ့ လိုအပ်တဲ့ capabilities တွေရဲ့ canonical JSON ဖော်ပြချက်။
2. `contract.d.ts` — အဲဒီကနေ ဆင်းသက်လာတဲ့ TypeScript types တွေ — ဒါက သင့် query တွေကို type-safe ဖြစ်စေတဲ့အရာပါ။

Toolchain ရဲ့ တခြားအစိတ်အပိုင်းတိုင်းက ဒီ artifacts တွေကို ဖတ်ပါတယ် — သင့် source file ကို မဟုတ်ပါဘူး။ Query API တွေက types အတွက် `contract.d.ts` ကို ဖတ်ပြီး — migration planner က `contract.json` file နှစ်ခုကို diff လုပ်ကာ runtime က database နဲ့ `contract.json` ကို verify လုပ်ပါတယ်။ အဲဒါကြောင့် workflow တိုင်းနီးပါးမှာ `contract emit` က ပထမဆုံး လာတာပါ: contract ပြောင်းလဲမှုတိုင်း ပြီးနောက် — plan, migrate, run မလုပ်ခင် emit လုပ်ပါ။

Emission က deterministic ပါ — တူညီတဲ့ source က ဘိုက်-အတိအကျ တူညီတဲ့ artifacts တွေကို အမြဲ ထုတ်ပေးလို့ file နှစ်ခုလုံးကို version control ထဲ commit လုပ်ပြီး code review မှာ သန့်ရှင်းစွာ diff ဖြစ်ပါတယ်။ ဒီအတွဲကို `package.json` နဲ့ `package-lock.json` လိုမျိုး တွေးကြည့်ပါ — source က သင်တောင်းတဲ့အရာ၊ artifacts တွေက တိကျတဲ့ ရလဒ်ပါ။

File တစ်ခုစီထဲမှာ ဘာတွေ ပါလဲဆိုတာ [The emitted artifacts](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) မှာ ကြည့်ပါ။

## Hash နဲ့ Database Signature

**Hash** ဆိုတာ file ရဲ့ content ကနေ တွက်ထုတ်ထားတဲ့ တိုတောင်းတဲ့ fingerprint ပါ — content တူရင် hash တူပြီး ဘယ်ပြောင်းလဲမှုမဆို hash ကွာပါတယ်။ Emission က deterministic ဖြစ်လို့ `contract.json` ကို hashing လုပ်တာက အဲဒီ schema state အတိအကျအတွက် identifier တစ်ခု ပေးပါတယ် — Git commit hash က code state အတိအကျကို ဖော်ထုတ်သလိုပါပဲ။ Contract hash တွေက CLI တစ်လျှောက် ပေါ်နေပြီး — ဥပမာ migration တစ်ခုက သူစတင်တဲ့ hash နဲ့ သူထုတ်လုပ်တဲ့ hash ကို မှတ်တမ်းတင်ပါတယ်။

Database က သဘောတူညီချက်ရဲ့ ကျန်တစ်ဝက်ကို သယ်ဆောင်ပါတယ် — **signature** ဆိုတာ database ထဲမှာပဲ သိမ်းထားတဲ့ အသေးစား marker record တစ်ခုဖြစ်ပြီး database က အခု ကျေနပ်နေတဲ့ contract hash ကို ဖော်ပြပါတယ်။ [`db sign`](https://www.prisma.io/docs/cli/db-sign) က ရေးပြီး — [`db migrate`](https://www.prisma.io/docs/cli/db-migrate) က migration တစ်ခု apply လုပ်တိုင်း update လုပ်ပါတယ်။

ဒီအတွဲနှစ်ခြမ်းက သဘောတူညီချက်ကို ဘက်နှစ်ဖက်ကနေ စစ်လို့ရအောင် လုပ်ပေးပါတယ်:

1. Query တွေ execute မလုပ်ခင် — runtime က application ကို တည်ဆောက်ထားတဲ့ contract နဲ့ database ရဲ့ signature ကို ယှဉ်ပြီး မကိုက်ရင် ရပ်လိုက်ပါတယ်။ ဥပမာ — migrate မလုပ်ရသေးတဲ့ database ပေါ်ကို deploy လုပ်တာမျိုး၊ မှားယွင်းတဲ့ ရလဒ်တွေ မထုတ်ခင် ဖမ်းမိပါတယ်။
2. Migration တစ်ခု apply မလုပ်ခင် — runner က database ရဲ့ signature နဲ့ migration စတင်တဲ့ contract hash ကို ယှဉ်စစ်ပါတယ်။

Contract နဲ့ database ကွဲလွဲနေတဲ့ အခြေအနေကို **drift** လို့ ခေါ်ပါတယ်။ [`db verify`](https://www.prisma.io/docs/cli/db-verify) က အဲဒါကို အစီရင်ခံပေးတဲ့ read-only command ပါ။

## Query တွေက Plan အဖြစ် Compile လုပ်တယ်

**Plan** ဆိုတာ query တစ်ခုရဲ့ compiled ပုံစံပါ — run ရမယ့် statement, သူ့ရဲ့ parameter တွေနဲ့ query က ဘာတွေကို ထိမိလဲဆိုတဲ့ metadata ကို ကိုင်ထားတဲ့ ရိုးရိုး data object တစ်ခုပါ။ Query တိုင်း — ဘယ် API က ထုတ်လုပ်ထားပါစေ — execute မလုပ်ခင် plan တစ်ခု ဖြစ်လာပြီး plan ကို run လုပ်တာက သီးခြား step တစ်ခုပါ။

SQL query builder နဲ့ဆိုရင် step နှစ်ခုကို ကုဒ်ထဲမှာ မြင်ရပါတယ်:

```ts
import { db } from "./prisma/db";

const plan = db.sql.public.post
  .select("id", "title", "userId")
  .where((f, fns) => fns.eq(f.published, true))
  .limit(10)
  .build();

const publishedPosts = await db.runtime().execute(plan);
```

Plan တွေက အကြောင်းရင်း နှစ်ခုအတွက် အရေးကြီးပါတယ်:

1. **Query တိုင်း pipeline တစ်ခုတည်း ဖြတ်သွားပါတယ်။** Query ကို ဘယ်လိုပဲ ရေးထားပါစေ (ORM client, query builder, raw fragment, ဒါမှမဟုတ် extension တစ်ခု ထည့်ထားတဲ့ API) — database ကို plan တစ်ခုအနေနဲ့ပဲ ရောက်ပါတယ်။ Middleware တွေက query တိုင်းကို ပုံစံတူနဲ့ မြင်ရပြီး — execution က အားလုံးအတွက် အတူတူ အလုပ်လုပ်ကာ query API တွေကို လွတ်လပ်စွာ ရောသုံးလို့ရပါတယ်။ ဆိုလိုတာက policy တစ်ခု (ဥပမာ authorization check) က နေရာတစ်ခုတည်းမှာ ထိုင်ပြီး အရာအားလုံးကို မြင်နိုင်ပါတယ်။
2. **Plan က data ပါ။** Statement နဲ့ parameter တွေက database ကို မထိခင်ကတည်းက object တစ်ခုအနေနဲ့ ရှိနေလို့ — middleware က စစ်လို့ရ၊ telemetry က မှတ်တမ်းတင်လို့ရ၊ query ကျရှုံးရင်လည်း ဘာကို run လုပ်ခဲ့လဲ အတိအကျ အစီရင်ခံလို့ရပါတယ်။

## Query API များ

Query API အားလုံးက contract ပေါ်မှာ type လုပ်ထားပြီး — အားလုံးက plan တွေ ထုတ်လုပ်ပါတယ်။ ကွာခြားချက်က statement ရဲ့ ဘယ်လောက်ကို ကိုယ်တိုင် ရေးရလဲဆိုတာပါ။

**ORM client** က database နှစ်မျိုးလုံးမှာ စတင်တဲ့နေရာပါ — `db.orm.public.User.where(...)` လိုမျိုး model-based query တွေပါ။ ဒါက query builder ထက် ပိုပါတယ်။ `.include()` လိုမျိုး operation တစ်ခုက ပိုမြင့်တဲ့ လိုအပ်ချက်တွေ — အထူးသဖြင့် relation traversal — ကို ဖြည့်ဆည်းဖို့ query အများကြီးကို ကိုယ်စား ညှိနှိုင်းပြီး type လုပ်ထားတဲ့ ရလဒ်တစ်ခုတည်း ပြန်ပေးပါတယ်။ [Reading data](/docs/prisma/reading-data) ကနေ စပါ။

အောက်မှာတော့ database family တစ်ခုစီမှာ — ORM client က ဖော်ပြလို့မရတဲ့ query တွေအတွက် typed builder တစ်ခုနဲ့ အောက်ဆုံးမှာ raw escape hatch တစ်ခု ရှိပါတယ်။ Builder plan တစ်ခုက statement တစ်ခုတည်းကို compile လုပ်လို့ — သင်တည်ဆောက်တာက ပြေးတာပါပဲ:

| | PostgreSQL | MongoDB |
| --- | --- | --- |
| Typed builder | [The SQL query builder](/docs/prisma/advanced-queries): composable joins, grouping, projections | [The pipeline builder](https://www.prisma.io/docs/orm/reference/pipeline-builder): typed aggregation pipelines |
| Raw escape hatch | [Raw SQL fragments](https://www.prisma.io/docs/orm/reference/raw-queries) spliced into builder queries | [Raw commands](https://www.prisma.io/docs/orm/reference/raw-queries) sent to the driver |

Raw query တွေကလည်း plan တွေပဲ ဖြစ်လို့ middleware နဲ့ telemetry က တခြား query တွေလိုပဲ မြင်ရပါတယ်။ ဒါပေမယ့် သူတို့ရဲ့ ရလဒ်တွေက codec decoding ကို ကျော်သွားလို့ — raw value တွေကို ကိုယ်တိုင် ကိုင်တွယ်ရပါတယ်; [raw queries reference](https://www.prisma.io/docs/orm/reference/raw-queries) က database တစ်ခုစီအတွက် အဲဒါ ဘာကို ဆိုလိုလဲ အသေးစိတ် ဖော်ပြပါတယ်။

## Package တစ်ခုရဲ့ နောက်ကွယ်က Stack

Facade package တစ်ခုက သင့် code ကို database နဲ့ ချိတ်ပေးပါတယ်။ PostgreSQL project တစ်ခုက `@prisma/orm-postgres` ကို install လုပ်ပြီး — သူ့ရဲ့ config helper က အောက်က အရာအားလုံးကို ချိတ်ပေးပါတယ်: database **family** (SQL), **target** dialect (PostgreSQL), plan တွေကို အဲဒီ dialect ဆီ ပြောင်းပေးတဲ့ **adapter**, network connection ကို ကိုင်ထားတဲ့ **driver**။ ဒီနာမည်လေးခုကို error message တွေနဲ့ extension docs တွေမှာ တွေ့ရပါမယ် — နေ့စဉ်သုံးရင်တော့ package တစ်ခုကို configure လုပ်ပြီး ဆက်သွားရုံပါပဲ။

Layering က extensibility အတွက် ရှိနေတာပါ။ Prisma 8 ရဲ့ core က သေးပြီး — ပတ်ဝန်းကျင်က အရာအားလုံး (PostgreSQL support အပါအဝင်) က public interface တွေကနေ plug in လုပ်ပါတယ်။ Database အသစ်တစ်ခုကို support လုပ်ဖို့ဆိုရင် core ကို မပြောင်းဘဲ — target, adapter, driver အသစ်တွေ ရေးရုံပါပဲ။

## Capabilities

**Capability** ဆိုတာ database တစ်ခုမှာ ရှိနိုင်/မရှိနိုင်တဲ့ သီးခြား feature တစ်ခုပါ — `RETURNING` clauses ဒါမှမဟုတ် vector indexes လိုမျိုးပါ။ သင့် contract က လိုအပ်တဲ့ capabilities တွေကို ကြေညာပြီး — adapter က ချိတ်ထားတဲ့ database ပေးတဲ့အရာကို အစီရင်ခံပါတယ်။ Prisma 8 က startup မှာ နှစ်ခုကို ယှဉ်လို့ — feature တစ်ခု ပျောက်နေရင် နောက်ပိုင်း failed query တစ်ခုအနေနဲ့ မဟုတ်ဘဲ app boot တက်ချိန်မှာ ရှင်းရှင်းလင်းလင်း error တစ်ခုအဖြစ် ပေါ်လာပါတယ်။ [Capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) ကို ကြည့်ပါ။

## Codecs

**Codec** က JavaScript နဲ့ database ရဲ့ wire format အကြား value တွေကို ဘက်နှစ်ဖက်လုံးမှာ ပြောင်းပေးပါတယ်။ သင့် contract ထဲက column type တိုင်းကို codec တစ်ခုက ကျောထောက်ပါတယ် — PostgreSQL `timestamptz` column တစ်ခုမှာ ဖတ်တဲ့အခါ JavaScript `Date` ထုတ်ပေးပြီး ရေးတဲ့အခါ ပြန် encode လုပ်ပေးတဲ့ codec ရှိပါတယ်။ ဒါကြောင့် PSL မှာ column type ရွေးတဲ့အခါ — အဲဒီ column သယ်ဆောင်တဲ့ value တိုင်းကို ကိုင်တွယ်မယ့် codec ကိုပါ ရွေးနေတာပါ။

Extension တွေက သူတို့ ထည့်တဲ့ types တွေအတွက် codec တွေ ယူဆောင်လာပါတယ် — pgvector install လုပ်ထားရင် `Vector(1536)` column တစ်ခုက string အစား typed vector တစ်ခုအနေနဲ့ ပြန်လာပါတယ်။ Raw query ရလဒ်တွေက codec တွေကို ကျော်သွားလို့ value ကိုင်တွယ်မှုကို သင့်လက်ထဲ ပြန်အပ်လိုက်တာလည်း ဒီအကြောင်းကြောင့်ပါ။

## Extensions

**Extension** ဆိုတာ install လုပ်လို့ရတဲ့ package တစ်ခုဖြစ်ပြီး toolchain ထဲကို အပိုင်းအသစ်တွေ ထည့်ပေးပါတယ် — column types နဲ့ သူတို့ရဲ့ codec တွေ၊ query operations တွေ၊ index kinds တွေ၊ capabilities တွေ၊ ပြီးတော့ အကျယ်ဆုံးအနေနဲ့ database တစ်ခုလုံးအတွက် support ပါ။ Package တစ်ခုက contract language, emitted types, query builders နဲ့ migrations တွေကို အတူတူ extend လုပ်ပါတယ်။

Extension တွေကို `prisma.config.ts` မှာ ကြေညာပြီး client ပေါ်မှာ register လုပ်ပါတယ်:

```ts
import { definePrismaConfig } from 'prisma/config';
import pgvector from '@prisma/orm-extension-pgvector/control';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    extensions: [pgvector],
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
```

အဲဒီနောက် `pgvector.Vector(1536)` က သင့် contract ထဲက column type တစ်ခု ဖြစ်ပြီး — vector operators တွေက query builder မှာ ပေါ်လာကာ `migration plan` က vector indexes ဘယ်လို ဖန်တီးရမလဲ သိပါတယ်။ [Using extensions](https://www.prisma.io/docs/orm/extensions/using-extensions) ကို ကြည့်ပါ။

## Middleware

**Middleware** ဆိုတာ name တစ်ခုနဲ့ hook တစ်ခု ဒါမှမဟုတ် ပိုပြီး ပါတဲ့ ရိုးရိုး object တစ်ခုပါ — query တိုင်းရဲ့ ပတ်လည်မှာ run ပြီး Express ဒါမှမဟုတ် Koa ထဲက middleware နဲ့ အတူတူ အယူအဆပါ။ တစ်ခါပဲ register လုပ်ရပြီး — client setup ရဲ့ `middleware` option ထဲမှာပါ။ Query တိုင်းက plan တစ်ခု ဖြစ်လို့ middleware က စစ်ဆေးလို့ရတဲ့ structured object တစ်ခုကို ရပါတယ်: log လုပ်တာ၊ limit တွေ သတ်တာ၊ ငြင်းပယ်တာတွေ — query တွေ ရေးပုံကို မပြောင်းဘဲ လုပ်လို့ရပါတယ်။ အဲဒါက middleware ကို app တစ်ခုလုံး လွှမ်းခြုံရမယ့် policy တစ်ခုအတွက် နေရာ ဖြစ်စေပါတယ် — ဥပမာ plan တိုင်းကို run မလုပ်ခင် စစ်တဲ့ authorization rule မျိုးပါ။

Prisma 8 နဲ့အတူ middleware သုံးခု ပါလာပြီး — သူတို့က အစောပိုင်း အဆင့်မို့: ပြီးပြည့်စုံတဲ့ ထုတ်ကုန်တွေထက် ပုံစံ (pattern) ရဲ့ သရုပ်ပြမှု အနေနဲ့ သဘောထားပါ။ [Budgets](https://www.prisma.io/docs/orm/middleware/built-in-budgets) က row count တွေကို ကန့်သတ်ပြီး နှေးကွေးတဲ့ query တွေကို ဖော်ထုတ်ပေးပြီး — [lints](https://www.prisma.io/docs/orm/middleware/built-in-lints) က အန္တရာယ်ရှိတဲ့ query ပုံစံတွေကို ပိတ်ဆို့ကာ [cache](https://www.prisma.io/docs/orm/middleware/built-in-cache) က ထပ်ခါထပ်ခါ ဖတ်တာတွေကို memory ကနေ ဖြည့်ပေးပါတယ်။ သင့် app မှီခိုတဲ့ policy တွေအတွက်တော့ [ကိုယ်ပိုင် ရေးပါ](https://www.prisma.io/docs/orm/middleware/authoring-custom-middleware) — middleware API က ကြာရှည်ခံတဲ့ surface ပါ။ [How middleware works](/docs/prisma/how-middleware-works) ကနေ စပါ။

## Migrations — Contract တွေရဲ့ Graph

**Migration** ဆိုတာ database ရဲ့ schema ကို contract တစ်ခု ဖော်ပြတဲ့ state ကနေ နောက်တစ်ခု ဖော်ပြတဲ့ state ဆီ ရွှေ့ပေးတဲ့ မှတ်တမ်းတင်ထားတဲ့ ပြောင်းလဲမှုတစ်ခုပါ။ သင့် repository ထဲမှာ directory တစ်ခုအနေနဲ့ ရှိပြီး — ပြောင်းလဲမှုကို ပြင်ဆင်လို့ရတဲ့ TypeScript (`migration.ts`)၊ Prisma run လုပ်တဲ့ compiled operations (`ops.json`) နဲ့ ဘယ် contract hash ကနေ စတင် (`from`) ပြီး ဘယ်ဆီ ရွှေ့ (`to`) တယ်ဆိုတာ မှတ်တမ်းတင်တဲ့ metadata တွေ ပါဝင်ပါတယ်။

Command တစ်ခုက သူတို့ကို apply လုပ်ပါတယ်: [`db migrate`](https://www.prisma.io/docs/cli/db-migrate) က ရှင်သန်နေတဲ့ database တစ်ခုကို မှတ်တမ်းတင်ထားတဲ့ migration တွေအတိုင်း ရှေ့ရွှေ့ပေးပါတယ်။ တခြား `migration ...` command တွေက database ကို ဘယ်တော့မှ မထိပါဘူး — သူတို့က သင့် repository ထဲက migration file တွေကို ဖန်တီးပြီး စစ်ဆေးပါတယ်။

Migration တိုင်းက သူ့ရဲ့ `from` နဲ့ `to` hash တွေကို မှတ်တမ်းတင်လို့ repository ထဲက migration တွေက **graph** တစ်ခု ဖြစ်ပေါ်ပါတယ် — contract တွေက nodes၊ migration တွေက edges ပါ။ Branch နှစ်ခုစီက migration တစ်ခုစီ ထည့်ပြီး နှစ်ခုလုံး merge ဖြစ်ရင် — graph မှာ fork နဲ့ join ပေါ်ပြီး `db migrate` က database ရှိနေတဲ့နေရာကနေ သင်ရောက်ချင်တဲ့နေရာဆီ လမ်းကြောင်းတစ်ခု ရှာပါတယ်။ Renumbering မလို၊ migration file တွေကို rebase မလိုပါဘူး။

**Ref** ဆိုတာ contract တစ်ခုဆီ ညွှန်တဲ့ နာမည်တပ်ထားတဲ့ pointer တစ်ခုပါ — `production` ဒါမှမဟုတ် `staging` လိုမျိုး — [`migration ref`](https://www.prisma.io/docs/cli/migration-ref) နဲ့ စီမံပါတယ်။ Ref တွေက deploy command တွေကို environment တစ်ခုကို နာမည်နဲ့ ပစ်မှတ်ထားခွင့် ပေးပါတယ်: `db migrate --to production`။

Git သိရင် ဝေါဟာရတစ်ခုလုံး မြေပုံဆွဲလို့ရပါတယ်:

| Git | Prisma 8 |
| --- | --- |
| A commit | A contract, identified by its hash |
| A patch between commits | A migration |
| A branch or tag | A ref |
| `HEAD` | The database signature |
| `git checkout <commit>` | `db migrate --to <contract>` |

[How migrations work](/docs/prisma/how-migrations-work) ကနေ စပြီး — branching အကြောင်းကို [The migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) မှာ ဆက်ဖတ်ပါ။

## CLI Command တွေ ဘယ်လို ပေါင်းစပ်လဲ

[CLI](https://www.prisma.io/docs/cli) တစ်ခုလုံးကို စည်းမျဉ်းတစ်ခုက ခွဲပါတယ်: `db ...` command တွေက ရှင်သန်နေတဲ့ database တစ်ခုကို ချိတ်ပြီး ပြောင်းလဲနိုင်ပါတယ် — `contract ...` နဲ့ `migration ...` command တွေကတော့ သင့် repository ထဲက file တွေပေါ်မှာ အလုပ်လုပ်ပါတယ်။ တစ်ခုတည်းသော ခြွင်းချက်က `contract infer` ပါ — ဒါက ရှင်သန်နေတဲ့ database တစ်ခုကို ဖတ်ပြီး (အထဲမှာ ဘာမှ မပြောင်း) starter contract file တစ်ခု ရေးပေးပါတယ်။ Command တစ်ခုက ဘာတွေကို ထိနိုင်လဲ မသေချာရင် — ပထမဆုံး စကားလုံးက အဖြေပေးပါတယ်: database ကို ပြောင်းနိုင်တာ `db` ပဲ ရှိပါတယ်။

Command တွေက နေ့စဉ် workflow လေးခုအဖြစ် ပေါင်းစပ်ပါတယ်။

**Development loop.** Contract ကို ပြင်ပါ၊ emit လုပ်ပါ၊ ပြောင်းလဲမှုကို ပြန်လည်သုံးသပ်လို့ရတဲ့ migration အဖြစ် ပြောင်းပါ၊ apply လုပ်ပါ:

```bash
npx prisma@latest contract emit
npx prisma@latest migration plan --name add_user_phone
npx prisma@latest db migrate
```

**Migration file မပါဘဲ Prototyping လုပ်ခြင်း။** Schema က ပြောင်းလဲနေတုန်းဆိုရင် migration directory ကို ကျော်ပြီး database ကို တိုက်ရိုက် ညှိပါ။ [`db update`](https://www.prisma.io/docs/cli/db-update) က ရှင်သန်နေတဲ့ schema ကို emitted contract နဲ့ diff လုပ်ပြီး ကွာခြားချက်ကို apply လုပ်ပါတယ်; `--dry-run` က အရင်ဆုံး စမ်းကြည့်ပြသပေးပါတယ်:

```bash
npx prisma@latest contract emit
npx prisma@latest db update --db "$DATABASE_URL" --dry-run
npx prisma@latest db update --db "$DATABASE_URL"
```

ပုံစံ တည်ငြိမ်သွားရင် — ပြောင်းလဲမှုတွေ ပြန်လည်သုံးသပ်လို့ရတဲ့ file တွေ ဖြစ်လာဖို့ `migration plan` ဆီ ပြောင်းပါ။

**ရှိပြီးသား database တစ်ခုကို လက်ခံခြင်း။** [`contract infer`](https://www.prisma.io/docs/cli/contract-infer) က ရှင်သန်နေတဲ့ schema ကနေ starter contract တစ်ခု ရေးပါတယ်။ သုံးသပ်ပြီး ပြင်ပါ၊ emit လုပ်ပါ၊ ပြီးရင် database ကို contract management အောက် ယူပါ: [`db init`](https://www.prisma.io/docs/cli/db-init) က additive ပြောင်းလဲမှုတွေပဲ apply လုပ်ပြီး ပထမဆုံး signature ကို ရေးပါတယ်။ Database က contract နဲ့ အတိအကျ ကိုက်နေပြီဆိုရင် [`db sign`](https://www.prisma.io/docs/cli/db-sign) က ဘာမှ မပြောင်းဘဲ signature ကို မှတ်တမ်းတင်ပါတယ်:

```bash
npx prisma@latest contract infer --db "$DATABASE_URL"
npx prisma@latest contract emit
npx prisma@latest db init --db "$DATABASE_URL"
```

**CI မှာ စစ်ခြင်း၊ CD မှာ deploy လုပ်ခြင်း။** [`migration check`](https://www.prisma.io/docs/cli#other-commands) က migration file တွေနဲ့ graph ကို offline စစ်ဆေးပြီး — database မလိုဘဲ CI မှာ run လို့ရပါတယ်။ [`db verify`](https://www.prisma.io/docs/cli/db-verify) က သူ့ရဲ့ live counterpart ပါ — database တစ်ခုက contract ကို ကျေနပ်လားဆိုတဲ့ read-only စစ်ဆေးမှုပါ။ Deploy pipeline တစ်ခုက environment တွေကို ref တွေနဲ့ သတ်မှတ်ပြီး နာမည်နဲ့ သူတို့ဆီ migrate လုပ်ပါတယ်:

```bash
npx prisma@latest migration check
npx prisma@latest db verify --db "$DATABASE_URL"
npx prisma@latest db migrate --db "$DATABASE_URL" --to production
```

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "prisma-8 skill ကို သုံးပြီး ကျွန်တော်တို့ရဲ့ contract နဲ့ database schema ကြား ကွာခြားချက်ကို ရှင်းပြပေးပါ။"
- "ဒီ query အတွက် SQL query builder ထုတ်ပေးတဲ့ plan ကို ပြပေးပါ။"
- "ကျွန်တော်တို့ရဲ့ CLI script တွေထဲက ဘယ်ဟာတွေက live database ကို ထိလဲ၊ ဘယ်ဟာတွေက offline လဲ။"

## နောက်တစ်ဆင့်

- [The data contract](https://www.prisma.io/docs/orm/contract-authoring/the-data-contract) — ဒီ page တစ်ခုလုံး မှီခိုနေတဲ့ သဘောတရား၊ အသေးစိတ်။
- [Reading data](/docs/prisma/reading-data) — ORM client ကို သင့် contract ပေါ်မှာ အလုပ်ခိုင်းကြည့်ပါ။
- [How migrations work](/docs/prisma/how-migrations-work) — plan, review, apply loop ကို လက်တွေ့ လုပ်ကြည့်ပါ။
