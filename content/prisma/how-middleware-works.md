---
title: "Middleware တွေ ဘယ်လို အလုပ်လုပ်လဲ (How Middleware Works)"
description: "Middleware က query တိုင်းရဲ့ ရှေ့နဲ့ နောက်မှာ သင့် code ကို run လို့ — policy တစ်ခုက သင့် app တစ်ခုလုံးကို လွှမ်းခြုံနိုင်ပါတယ်"
order: 18
source: "https://www.prisma.io/docs/orm/prisma-middleware/how-middleware-works"
status: translated
updated: 2026-09-01
---

Middleware က သင့် app က Prisma 8 ကနေ ပို့တဲ့ query တိုင်းရဲ့ ပတ်လည်မှာ သင့်ကိုယ်ပိုင် code ကို run ခွင့် ပေးပါတယ်။

ဥပမာ — query တိုင်းကို latency နဲ့အတူ log လုပ်တာ၊ `WHERE` clause မရှိတဲ့ `DELETE` တစ်ခုကို database မရောက်ခင် ပိတ်ဆို့တာ၊ ဒါမှမဟုတ် ထပ်ခါထပ်ခါ ဖတ်တဲ့ query တစ်ခုကို ပြန် run မလုပ်ဘဲ memory ကနေ ဖြည့်ပေးတာမျိုးပါ။ Policy ကို တစ်ခါ ရေးပြီး တစ်ခါ register လုပ်ရုံပါ — query တိုင်းက လိုက်နာသွားပြီး call sites တွေ update လုပ်စရာ မလိုပါဘူး။

Middleware ဆိုတာ name တစ်ခုနဲ့ hook တစ်ခု ဒါမှမဟုတ် ပိုပြီး ပါတဲ့ ရိုးရိုး object တစ်ခုပါ။ Client setup ရဲ့ `middleware` option ထဲမှာ တစ်ခါပဲ register လုပ်ပါတယ်:

```ts
import { createCacheMiddleware } from '@prisma/orm-extension-middleware-cache';
import postgres from '@prisma/orm-postgres/runtime';
import { budgets, lints } from '@prisma/orm-postgres/family-runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [
    createCacheMiddleware({ maxEntries: 1_000 }),
    lints(),
    budgets({ maxRows: 10_000, maxLatencyMs: 1_000 }),
  ],
});
```

Query တိုင်းက chain ကို ဖြတ်သွားပါတယ် — ORM API ကလာတာ ဒါမှမဟုတ် SQL query builder ကလာတာ ဘာပဲဖြစ်ဖြစ် — နှစ်ခုလုံးက runtime တစ်ခုတည်းကနေ execute ဖြစ်လို့ပါ။ MongoDB ပေါ်မှာဆိုရင် `@prisma/orm-mongo/runtime` ကနေ `mongo(...)` ကို ဒီ option တစ်ခုတည်း ပေးပါ။

ပုံတစ်ပုံလုံးနဲ့ ကိုက်ညီပါတယ်: သင့် app က database နဲ့ စကားပြောပြီး middleware က အလယ်မှာ ထိုင်ပါတယ်။ Query တစ်ခုကို ဖြတ်သွားခွင့် ပေးတာ၊ ပိတ်ဆို့တာ၊ ဒါမှမဟုတ် ကိုယ်တိုင် အဖြေပေးတာ လုပ်နိုင်ပါတယ်:

> **Animation: middleware pipeline** — app က query ပို့တယ် → middleware chain က ဖြတ်သွားတယ် → driver က database ကို run တယ် ဆိုတဲ့ flow ကို သရုပ်ပြထားပါတယ်။

## Hook ငါးခု

Middleware တစ်ခုက သူလိုအပ်တဲ့ hooks တွေကိုပဲ implement လုပ်ပါတယ်။ ငါးခု ရှိပြီး — ပုံသေ အစီအစဉ်နဲ့ run ပါတယ်:

> **Animation: middleware lifecycle** — hook ငါးခုက middleware တစ်ခုချင်းစီပေါ်မှာ ပုံသေ အစီအစဉ်နဲ့ run တာကို သရုပ်ပြထားပါတယ်။

Runtime က register လုပ်ထားတဲ့ middleware တိုင်းပေါ်မှာ hook တစ်ခုစီကို — `middleware` array ထဲမှာ ပေါ်တဲ့ အစီအစဉ်အတိုင်း ခေါ်ပါတယ်။ Hook တစ်ခုချင်းစီက ဘာအတွက်လဲ:

### beforeCompile — query ကို ပြန်ရေးခြင်း

Query ကို SQL အဖြစ် မပြောင်းခင် — typed AST အနေနဲ့ ရှိနေတုန်း run ပါတယ်။ Query ကို ပြန်ရေးဖို့ draft တစ်ခု ပြန်ပေးပါ — ဥပမာ `SELECT` တိုင်းကို tenant filter တစ်ခု ထည့်တာမျိုးပါ။ ဒီ hook က SQL database တွေပေါ်မှာပဲ ရှိပါတယ် — ဘာလို့လဲဆိုတော့ သူက SQL query AST ပေါ်မှာ အလုပ်လုပ်လို့ပါ။

### beforeExecute — validate လုပ်ခြင်း ဒါမှမဟုတ် ပိတ်ဆို့ခြင်း

SQL render လုပ်ပြီးတဲ့ နောက်၊ database ကို ဘာမှ မရောက်ခင် run ပါတယ်။ Hook က plan အပြည့်အစုံ (`plan.sql`, `plan.ast`) ကို မြင်ရပါတယ်။ Query ကို ပိတ်ဆို့ဖို့ error throw လုပ်ပါ:

```ts
async beforeExecute(plan) {
  if (isForbidden(plan)) throw new Error("blocked by policy");
}
```

ဒီနေရာမှာ `lints` က `WHERE` မပါတဲ့ `DELETE` တစ်ခုကို ရပ်တန့်ပြီး — `budgets` က rows အများကြီး ဖတ်မယ့် query တစ်ခုကို ငြင်းပယ်ပါတယ်။ ဒီ hook က driver အတွက် encode မလုပ်ခင် parameter values တွေကိုလည်း ချိန်ညှိပေးနိုင်ပါတယ်။

### intercept — database မပါဘဲ အဖြေပေးခြင်း

Driver မရောက်ခင် နောက်ဆုံး run ပါတယ်။ `{ rows }` ပြန်ပေးရင် driver က လုံးဝ run မလုပ်ပါဘူး; ဘာမှ မပြန်ရင် query က ဆက်သွားပါတယ်။ ဒါက cache က ထပ်ခါထပ်ခါ ဖတ်တာတွေကို ဖြည့်ပေးတဲ့ နည်းလမ်းပါ။ `beforeExecute` ကနေ validation က ဒီအချိန်မှာ ပြီးသွားပြီ ဖြစ်ပါတယ်။

### onRow — rows တွေ စီးဆင်းတာကို ကြည့်ခြင်း

Database က ရလဒ်တွေ stream လုပ်တဲ့အခါ row တစ်ခုစီမှာ တစ်ခါ run ပါတယ်။ Rows တွေကို ရေတွက်တာ၊ sample လုပ်တာ၊ ဒါမှမဟုတ် stream ကို ရပ်ဖို့ throw လုပ်တာပါ။ `budgets` က ဒီ hook ကို သုံးပြီး ခန့်မှန်းချက်ထက် rows ပိုပြန်တဲ့ query တစ်ခုကို ရပ်တန့်စေပါတယ်။

### afterExecute — ပြီးသွားတဲ့ query ကို လေ့လာခြင်း

အဆုံးမှာ တစ်ခါ run ပါတယ် — အောင်မြင်သည်ဖြစ်စေ ကျရှုံးသည်ဖြစ်စေ။ ရလဒ်ကို လက်ခံရရှိပါတယ်: `result.rowCount`, `result.latencyMs`, `result.completed` နဲ့ `result.source` — သာမန် query တစ်ခုအတွက် `'driver'` ဖြစ်ပြီး `intercept` က အဖြေပေးခဲ့ရင် `'middleware'` ဖြစ်ပါတယ်။ Timing, logging နဲ့ latency budgets တွေ ဒီမှာ နေပါတယ်။

လက်တွေ့မှာ အရေးပါတဲ့ အစီအစဉ် စည်းမျဉ်း နှစ်ခု:

- Registration order က hook တိုင်းမှာ execution order ပါပဲ။ Middleware တစ်ခုက `beforeCompile` မှာ query ကို ပြန်ရေးရင် — နောက် middleware က ပြန်ရေးပြီးသား version ကို မြင်ရပါတယ်။
- Middleware အများကြီးက `intercept` implement လုပ်ထားရင် — rows တွေ ပထမဆုံး ပြန်ပေးတဲ့ဟာက အနိုင်ရပါတယ်။

## Built-in ပါလာတဲ့ Middleware များ

Prisma 8 နဲ့အတူ middleware သုံးခု ပါလာပါတယ်:

| Middleware | Import | ဘာလုပ်လဲ |
| --- | --- | --- |
| [`budgets`](https://www.prisma.io/docs/orm/middleware/built-in-budgets) | `@prisma/orm-postgres/family-runtime` | Rows အများကြီး ဖတ်မယ့် query တွေကို ပိတ်ဆို့ပြီး latency budget ကျော်တဲ့ query တွေကို အစီရင်ခံပါတယ် |
| [`lints`](https://www.prisma.io/docs/orm/middleware/built-in-lints) | `@prisma/orm-postgres/family-runtime` | `WHERE` မပါတဲ့ `DELETE` လိုမျိုး အန္တရာယ်ရှိတဲ့ query ပုံစံတွေကို ပိတ်ဆို့ ဒါမှမဟုတ် သတိပေးပါတယ် |
| [`cache`](https://www.prisma.io/docs/orm/middleware/built-in-cache) | `@prisma/orm-extension-middleware-cache` | ထပ်ခါထပ်ခါ ဖတ်တာတွေကို in-memory store ကနေ ဖြည့်ပေးပြီး query တစ်ခုချင်းအလိုက် opt in လုပ်ပါတယ် |

ကိုယ်ပိုင် ရေးချင်ရင် [authoring guide](https://www.prisma.io/docs/orm/middleware/authoring-custom-middleware) ကို လိုက်လုပ်ပါ — အလုပ်လုပ်တဲ့ query logger တစ်ခုကို step by step တည်ဆောက်ပေးပါတယ်။

## Middleware က ဘယ် Database တွေပေါ်မှာ Run လဲ

Prisma 8 က database တွေကို family တွေအဖြစ် စုပါတယ်: SQL family (PostgreSQL နဲ့ တခြား SQL database တွေ) နဲ့ document family (MongoDB)။ SQL text ဒါမှမဟုတ် SQL query AST ကို စစ်ဆေးတဲ့ middleware တစ်ခုက SQL database တွေပေါ်မှာပဲ အဓိပ္ပာယ်ရှိလို့ — `familyId: 'sql'` နဲ့ ဘယ် family နဲ့ ဆိုင်လဲ ကြေညာပါတယ်။

- `budgets` နဲ့ `lints` က `familyId: 'sql'` ကြေညာပါတယ်။ PostgreSQL ပေါ်မှာ register ဖြစ်ပြီး MongoDB ပေါ်မှာတော့ ငြင်းပယ်ခံရပါတယ်။
- Cache က `familyId` မကြေညာပါဘူး။ Query ရဲ့ family-neutral အစိတ်အပိုင်းတွေနဲ့ အလုပ်လုပ်လို့ PostgreSQL နဲ့ MongoDB နှစ်ခုလုံးမှာ run ပါတယ်။

Client တည်ဆောက်တဲ့အခါ runtime က ဒါကို စစ်ပါတယ်။ Runtime နဲ့ မကိုက်ညီတဲ့ middleware တစ်ခုက — production မှာ query time မှာ မဟုတ်ဘဲ startup မှာ `RUNTIME.MIDDLEWARE_FAMILY_MISMATCH` နဲ့ fail ဖြစ်ပါတယ်။

## Middleware ဒါမှမဟုတ် Driver က Throw လုပ်တဲ့အခါ

`beforeCompile`, `beforeExecute`, `intercept` ဒါမှမဟုတ် `onRow` ကနေ throw လုပ်တဲ့ middleware တစ်ခုက query ကို ကျရှုံးစေပါတယ် — error က caller ဆီ သွားပြီး database အလုပ်က ရပ်ပါတယ်။

Driver ကိုယ်တိုင် ကျရှုံးတဲ့အခါ — `afterExecute` က middleware တိုင်းပေါ်မှာ `result.completed` ကို `false` နဲ့ တင်ပြီး ဆက်လက် run ပါတယ်။ ဒါကြောင့် သင့် logging က failed query တွေကိုပါ မြင်ရပါတယ်။ Failure တစ်ခုကို ကိုင်တွယ်နေစဉ်မှာ `afterExecute` ကနေ throw လုပ်တဲ့ errors တွေကို မျိုချပါတယ် — မူရင်း error ကို ဖုံးကွယ်မသွားအောင်ပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ ဒီ page နဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "ကျွန်တော်တို့ရဲ့ Prisma 8 client ပေါ်မှာ lints နဲ့ budgets middleware တွေကို 10k row budget နဲ့ register လုပ်ပေးပါ။"
- "Cache middleware ထည့်ပြီး dashboard queries တွေကို 60 စက္ကန့် TTL နဲ့ opt in လုပ်ပေးပါ။"
- "250ms ထက် နှေးတဲ့ query တိုင်းကို log လုပ်တဲ့ middleware တစ်ခု ရေးပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [Authoring custom middleware](https://www.prisma.io/docs/orm/middleware/authoring-custom-middleware) — query logger တစ်ခုကို step by step တည်ဆောက်ပြီး စမ်းသပ်ခြင်း
- [Writing data](/docs/prisma/writing-data) — lints နဲ့ budgets က စောင့်ကြပ်တဲ့ mutations တွေ
- [Built-in: budgets](https://www.prisma.io/docs/orm/middleware/built-in-budgets), [Built-in: lints](https://www.prisma.io/docs/orm/middleware/built-in-lints), [Built-in: cache](https://www.prisma.io/docs/orm/middleware/built-in-cache)
- [Using extensions](https://www.prisma.io/docs/orm/extensions/using-extensions) — queries တွေကို wrap လုပ်တာထက် database capabilities တွေ ထည့်ဖို့
