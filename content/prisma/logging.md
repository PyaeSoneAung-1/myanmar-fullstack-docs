---
title: "Logging (Prisma ရဲ့ Log)"
description: "Prisma Client က database ဆီ ပို့လိုက်တဲ့ query တွေနဲ့ အချက်အလက်တွေကို log လုပ်နည်း — log level (query, info, warn, error) တွေ၊ stdout / event emit ပုံစံ နဲ့ $on() နဲ့ subscribe လုပ်ခြင်း"
order: 19
source: "https://www.prisma.io/docs/orm/v7/prisma-client/observability-and-logging/logging"
status: translated
updated: 2026-09-02
---

ဒီ page က Prisma Client က database ဆီ ပို့လိုက်တဲ့ raw SQL query တွေနဲ့ တခြား အချက်အလက်တွေကို log လုပ်ဖို့ ဘယ်လို configure လုပ်ရမလဲ ရှင်းပြပါတယ်။

`PrismaClient` ရဲ့ [`log`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#log) parameter ကို သုံးပြီး [log levels](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#log-levels) တွေကို သတ်မှတ်ပါတယ် — database ဆီ ပို့လိုက်တဲ့ query တွေအကြောင်း အချက်အလက်တွေ၊ warning တွေ၊ error တွေ စတာတွေ ပါဝင်ပါတယ်။

Prisma Client က logging ပုံစံ နှစ်မျိုး ထောက်ပံ့ပါတယ်:

- [stdout](https://en.wikipedia.org/wiki/Standard_streams) ပေါ် log ထုတ်ခြင်း (default)
- Event-based logging — [`$on()`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#on) method နဲ့ [event တွေကို subscribe](#event-based-logging) လုပ်ပြီး လက်ခံခြင်း

> **မှတ်ချက်:** Prisma Client ရဲ့ debugging output ကို `DEBUG` environment variable နဲ့လည်း ဖွင့်လို့ရပါတယ် — [Debugging (အမှားရှာဖွေခြင်း)](/docs/prisma/debugging) မှာ အသေးစိတ် ဖတ်ပါ။

> **မှတ်ချက်:** လုပ်ဆောင်ချက် တစ်ခုချင်းစီရဲ့ အဆင့်အထိ Prisma Client ရဲ့ performance ကို အသေးစိတ် ကြည့်ချင်ရင် — [OpenTelemetry tracing](https://www.prisma.io/docs/orm/v7/prisma-client/observability-and-logging/opentelemetry-tracing) ကို ကြည့်ပါ။

## Log level တွေနဲ့ emit format

`log` မှာ သုံးလို့ရတဲ့ level တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ်က — [Prisma Client API reference ထဲက log levels](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#log-levels) အရ — ဒီလိုပါ:

- **query** — Prisma က run လုပ်တဲ့ query တွေ အားလုံးကို log လုပ်ပါတယ်။ Relational database တွေမှာ SQL query တွေ အကုန် log တက်ပြီး — MongoDB မှာတော့ [`mongosh` shell](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) format နဲ့ log တက်ပါတယ်။
- **info** — Prisma Client ရဲ့ သာမန် အချက်အလက် messages တွေ — ဥပမာ connection pool စတာတဲ့အကြောင်း။
- **warn** — warning (သတိပေးချက်) တွေ။
- **error** — error တွေ။

Level တစ်ခုချင်းစီကို emit format နှစ်မျိုးနဲ့ ထုတ်နိုင်ပါတယ်:

- **stdout** — standard output ပေါ် တိုက်ရိုက် ရိုက်ထုတ်တာ။
- **event** — subscribe လုပ်လို့ရတဲ့ event တစ်ခုအနေနဲ့ ပစ်တင်ပေးတာ။

## Log တွေကို stdout ပေါ် ထုတ်ခြင်း

Log level တွေ *အားလုံး* ကို stdout ပေါ် ရိုက်ထုတ်ဖို့ အလွယ်ဆုံးနည်းက `LogLevel` object တွေရဲ့ array တစ်ခု ထည့်ပေးလိုက်ရုံပါပဲ:

```ts
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

ဒါက `LogDefinition` object တွေရဲ့ array ထည့်တဲ့ ပုံစံရဲ့ short form ပါ — ဒီပုံစံမှာ `emit` ရဲ့ တန်ဖိုးက `stdout` ပဲ ဖြစ်ပါတယ်:

```ts
const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});
```

`log` option ကို ဒီပုံစံ နှစ်မျိုးထဲက တစ်မျိုးနဲ့ပဲ ပေးလို့ရပါတယ် — log level name တွေရဲ့ array (`["query", "info"]` လိုမျိုး) ဒါမှမဟုတ် `{ level, emit }` object တွေရဲ့ array ပါ။ Level တွေ အကုန်လုံး ထည့်စရာ မလိုဘဲ — လိုချင်တဲ့ level တွေကိုပဲ ရွေးထည့်လို့ရပြီး emit format ကိုလည်း level တစ်ခုချင်းစီအလိုက် သီးခြား သတ်မှတ်လို့ရပါတယ် (အောက်က ဥပမာတွေမှာ မြင်ရပါမယ်)။

### stdout log တွေရဲ့ ပုံစံ

Level နှစ်ခုကို stdout နဲ့ ဖွင့်ထားတဲ့ client တစ်ခုမှာ — Prisma Client API reference ထဲက ဥပမာအရ — stdout ပေါ်က log တွေက level နာမည်ကို prefix အနေနဲ့ ပါပြီး ဒီလိုမျိုး ပေါ်ပါတယ်:

```ts
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({ log: ["query", "info"] });

async function main() {
  const countUsers = await prisma.user.count({});
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

```bash
prisma:info  Starting a postgresql pool with 13 connections.
prisma:info  Started http server
prisma:query SELECT COUNT(*) FROM (SELECT "public"."User"."id" FROM "public"."User" WHERE 1=1 ORDER BY "public"."User"."coinflips" ASC OFFSET $1) AS "sub"
```

`query` level ရဲ့ relational database log တွေက database ဆီ ပို့လိုက်တဲ့ SQL စာကြောင်း အပြည့်အစုံ ဖြစ်ပြီး — `$1`, `$2` လို parameter placeholder တွေပါ ပါပါတယ်။ MongoDB မှာတော့ query log တွေက `db.User.find(...)` လို `mongosh` shell command ပုံစံနဲ့ ပေါ်ပါတယ်။ ဒါကြောင့် — သင့် app က database ကို တကယ် ဘာ query တွေ ပို့နေလဲ ကြည့်လို့ရပြီး မလိုအပ်တဲ့ query တွေ၊ N+1 လို ပုံစံတွေကို ရှာတွေ့နိုင်ပါတယ်။ Query တစ်ခုချင်းစီရဲ့ ကြာချိန် (duration) ကိုတော့ event-based logging မှာ `$on` event ရဲ့ `e.duration` ကနေ ရနိုင်ပါတယ် — အပေါ်က ဥပမာမှာ မြင်ခဲ့ရတဲ့အတိုင်းပါ။

## Event-based logging

Event-based logging သုံးဖို့ —

1. ကိုယ် log ချင်တဲ့ level တစ်ခုအတွက် (ဥပမာ query) `emit` ကို `event` လို့ သတ်မှတ်ပါ
2. Event ကို subscribe လုပ်ဖို့ `$on()` method ကို သုံးပါ

အောက်က ဥပမာက `query` event တွေ အားလုံးကို subscribe လုပ်ပြီး `duration` နဲ့ `query` တွေကို console ပေါ် ရေးထုတ်ပါတယ်:

### Relational databases

```ts
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});
```

```sql
Query: SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name" FROM "public"."User" WHERE 1=1 OFFSET $1
Params: [0]
Duration: 3ms
Query: SELECT "public"."Post"."id", "public"."Post"."title", "public"."Post"."authorId" FROM "public"."Post" WHERE "public"."Post"."authorId" IN ($1,$2,$3,$4) OFFSET $5
Params: [2, 7, 18, 29]
Duration: 2ms
```

### MongoDB

```ts
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
});
```

```bash
Query: db.User.aggregate([ { $project: { _id: 1, email: 1, name: 1, }, }, ])
Query: db.Post.aggregate([ { $match: { userId: { $in: [ "622f0bbbdf635a42016ee325", ], }, }, }, { $project: { _id: 1, slug: 1, title: 1, body: 1, userId: 1, }, }, ])
```

Event (`e`) တစ်ခုချင်းစီမှာ ရနိုင်တဲ့ property တွေက log level အပေါ် မူတည်ပါတယ် — [event types](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#event-types) အသေးစိတ်ကို Prisma Client API reference မှာ ကြည့်ပါ။

## Event types — event ထဲမှာ ဘာတွေ ပါလဲ

`query` event ရဲ့ type က ဒီလိုပါ:

```ts
export type QueryEvent = {
  timestamp: Date;
  query: string; // Query sent to the database
  params: string; // Query parameters
  duration: number; // Time elapsed (in milliseconds) between client issuing query and database responding - not only time taken to run query
  target: string;
};
```

`params` နဲ့ `duration` က MongoDB မှာတော့ `undefined` ဖြစ်နေတာ သတိပြုပါ။ ကျန် log level တွေ (`info`, `warn`, `error`) ရဲ့ event type က:

```ts
export type LogEvent = {
  timestamp: Date;
  message: string;
  target: string;
};
```

## ဘယ် logging ပုံစံကို ရွေးမလဲ

Query တွေ database ဆီ ဘာတွေ ရောက်နေလဲ စစ်ကြည့်ချင်ရင် — `query` level ကို stdout နဲ့ ဖွင့်ထားရုံနဲ့ ရပါတယ်။ Log တွေကို ကိုယ်ပိုင် format နဲ့ ပြောင်းချင်တာ၊ စုစည်းသိမ်းချင်တာ၊ ဒါမှမဟုတ် query တစ်ခုချင်းစီရဲ့ params/duration တွေကို ကိုယ်ပိုင် logic နဲ့ ကိုင်တွယ်ချင်ရင်တော့ `$on()` event-based logging ကို သုံးပါတယ် — ဥပမာ log တစ်ခုစီမှာ request id တွဲထည့်ချင်တာမျိုးကို [Client Extensions](/docs/prisma/client-extensions) ရဲ့ use case တွေထဲမှာလည်း တွေ့ရပါမယ်။

Logging သတ်မှတ်ချက် အပြည့်အစုံ (log levels, emit formats, event types, ဥပမာတွေ) ကို [Prisma Client API reference — `log` parameter](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#log) မှာ ကြည့်နိုင်ပါတယ်။

## Logging ကို လက်တွေ့ ဘယ်လို သုံးမလဲ

Development အဆင့်မှာ — `query` level ကို stdout နဲ့ ဖွင့်ထားရင် သင့် query တွေက database ပေါ်မှာ တကယ် ဘယ်လို ပုံစံနဲ့ run နေလဲ မျက်စိနဲ့ မြင်ရပါတယ် — relation တွေ ဘယ်လို join ဖြစ်နေလဲ၊ filter တွေ မှန်မမှန်၊ query တစ်ခုက database ကို ဘယ်နှစ်ခါ သွားနေလဲ စတာတွေ စစ်လို့ရတာမို့ — debugging လုပ်တဲ့အခါ အရမ်း အသုံးဝင်ပါတယ်။

ဒါပေမယ့် production မှာတော့ — query log တိုင်းကို stdout ပေါ် တိုက်ရိုက် ထုတ်နေရင် log ပမာဏက ကြီးမားသွားနိုင်ပါတယ်။ Event-based logging ကို သုံးပြီး — query event တွေကို ကိုယ်ပိုင် handler နဲ့ လက်ခံကာ လိုအပ်တဲ့အချက်အလက်တွေကိုပဲ ရွေးထုတ်၊ ကိုယ်ပိုင် log format (JSON လိုမျိုး) နဲ့ ပြောင်း၊ ဒါမှမဟုတ် log aggregation service တစ်ခုဆီ ပို့လို့ရပါတယ်။ `warn` နဲ့ `error` level တွေကတော့ — Prisma Client ရဲ့ ပုံမှန်မဟုတ်တဲ့ အခြေအနေတွေကို စောင့်ကြည့်ဖို့ နေရာတိုင်းမှာ ဖွင့်ထားလေ့ ရှိပါတယ်။

အချိန် ကြာနေတဲ့ query တစ်ခုချင်းစီရဲ့ performance ကို operation အဆင့်အထိ ခွဲကြည့်ချင်ရင်တော့ — [OpenTelemetry tracing](https://www.prisma.io/docs/orm/v7/prisma-client/observability-and-logging/opentelemetry-tracing) က log level တွေထက် ပိုပြီး အသေးစိတ် ပေးပါတယ်။

## နောက်တစ်ဆင့်

- [Debugging (အမှားရှာဖွေခြင်း)](/docs/prisma/debugging) — `DEBUG` environment variable နဲ့ client/engine ရဲ့ debug output ဖွင့်ခြင်း
- [Client Extensions](/docs/prisma/client-extensions) — request အလိုက် logging အပြုအမူ ပြောင်းလဲဖို့ client ကို extension လုပ်ခြင်း
- [Prisma Client အသုံးပြုခြင်း](/docs/prisma/prisma-client) — client instance တစ်ခုတည်း သုံးခြင်း (singleton) နဲ့ serverless setup
