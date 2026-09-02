---
title: "Built-in: Cache — ပါလာတဲ့ Cache Middleware"
description: "ထပ်ခါထပ်ခါ ဖတ်တဲ့ reads တွေကို database အစား in-memory store ကနေ ဖြည့်ပေးတဲ့ built-in cache middleware — query တစ်ခုချင်းအလိုက် cache annotation နဲ့ opt in လုပ်ခြင်း၊ keys/hits နဲ့ options အသေးစိတ်"
order: 29
source: "https://www.prisma.io/docs/orm/middleware/built-in-cache"
status: translated
updated: 2026-09-02
---

Cache middleware က ထပ်ခါထပ်ခါ ဖတ်တဲ့ reads တွေကို database အစား in-memory store တစ်ခုကနေ ဖြည့်ပေးပါတယ်။ Caching က query တစ်ခုချင်းအလိုက် strictly opt-in ဖြစ်ပါတယ် — TTL နဲ့ annotate လုပ်ထားတဲ့ queries တွေပဲ cache (ကက်ရှ်) လုပ်ခံရပြီး ကျန်တာတွေကတော့ မထိဘဲ ဖြတ်သွားပါတယ်။

Dashboard တွေ၊ lookup tables တွေ၊ feature flags တွေ၊ navigation data တွေ ဒါမှမဟုတ် ဈေးကြီးတဲ့ search results တွေလိုမျိုး — ပူပြင်းပြီး ထပ်ခါ ဖတ်လို့ရတဲ့ reads တွေအတွက် သုံးပါ။ Stale ဖြစ်သွားတာကို ခဏလောက် သည်းခံလို့ရတဲ့ နေရာမျိုးမှာ သင့်တော်ပါတယ်။

Package ကို install လုပ်ပြီး middleware ကို register လုပ်ပါ:

```bash
bun add @prisma/orm-extension-middleware-cache
```
ဒါမှမဟုတ်
```bash
pnpm add @prisma/orm-extension-middleware-cache
```
ဒါမှမဟုတ်
```bash
yarn add @prisma/orm-extension-middleware-cache
```
ဒါမှမဟုတ်
```bash
npm install @prisma/orm-extension-middleware-cache
```

`src/prisma/db.ts` ထဲမှာ register လုပ်ပုံက ဒီလိုပါ:

```ts
import { createCacheMiddleware } from '@prisma/orm-extension-middleware-cache';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [createCacheMiddleware({ maxEntries: 1_000 })],
});
```

`intercept` ကို implement လုပ်ထားတဲ့ တခြား middleware တွေနဲ့ ပေါင်းသုံးတဲ့အခါ — cached rows တွေ အနိုင်ရစေချင်ရင် cache ကို ပထမဆုံး register လုပ်ပါ။ Cache hit တစ်ခုကို မဖြည့်ခင် `beforeExecute` hooks တွေ ဆက်ပြီး run နေဆဲ ဖြစ်ပြီး — `afterExecute` ကလည်း နောက်မှာ `result.source` ကို `'middleware'` အနေနဲ့ ထားပြီး fire ပါတယ်။

Cache က family-agnostic ပါ — `budgets` နဲ့ `lints` တို့နဲ့ မတူဘဲ PostgreSQL runtime တွေရော MongoDB runtime တွေရောမှာ အလုပ်လုပ်ပါတယ်။

## Query တစ်ခုကို opt in လုပ်ခြင်း

Read တစ်ခုကို `cacheAnnotation` နဲ့ `ttl` (millisecond) တွေနဲ့ annotate လုပ်ပါ။ SQL query builder ပေါ်မှာဆိုရင် plan ပေါ်ကို `.annotate(...)` ဆိုပြီး chain လုပ်ပါ:

```ts
import { cacheAnnotation } from '@prisma/orm-extension-middleware-cache';

const plan = db.sql.public.user
  .select('id', 'email')
  .annotate(cacheAnnotation({ ttl: 60_000 }))
  .limit(10)
  .build();

const users = await db.runtime().execute(plan);
```

ORM API ပေါ်မှာတော့ annotation ကို query ရဲ့ meta callback ကနေ ဖြတ်ပေးပါ:

```ts
import { cacheAnnotation } from '@prisma/orm-extension-middleware-cache';
import { db } from './db';

const user = await db.orm.public.User.first({ id }, (meta) =>
  meta.annotate(cacheAnnotation({ ttl: 60_000 })),
);
```

ပထမဆုံး call က database ပေါ်မှာ run ပြီး raw rows တွေကို သိမ်းပါတယ်။ TTL window အတွင်းမှာ — တူညီတဲ့ query နဲ့ parameters တွေနဲ့ ဒုတိယ call တစ်ခု ထပ်လုပ်ရင် store ကနေ ဖြည့်ပေးပြီး driver ကို မခေါ်တော့ပါဘူး။

Annotation payload မှာ field သုံးခု ပါပါတယ်:

| Field | Type | ဘာလုပ်လဲ |
| --- | --- | --- |
| `ttl` | `number` | Time-to-live (millisecond)။ `ttl` မပါရင် annotation က inert ဖြစ်ပြီး query ကို cache မလုပ်ပါဘူး |
| `skip` | `boolean` | `true` ဆိုရင် — `ttl` ထားထားပေမယ့် ဒီ call အတွက် cache ကို ကျော်သွားပါတယ်။ Force-refresh လုပ်ချင်တဲ့အခါ သုံးရတဲ့ knob တစ်ခုပါ |
| `key` | `string` | တွက်ချက်ထားတဲ့ cache key အစား ကိုယ်ပိုင် string တစ်ခု သုံးဖို့ — ရှိသလို အတိအကျ သိမ်းပါတယ် |

`cacheAnnotation` ကို read-only (`applicableTo: ['read']`) အနေနဲ့ ကြေညာထားပါတယ်။ ဒါကို `create`, `update` ဒါမှမဟုတ် `delete` လိုမျိုး write တစ်ခုဆီ ပေးလိုက်ရင် — type error ရော runtime error ရော ဖြစ်လို့ mutation တစ်ခု မတော်တဆ cache ဖြစ်သွားဖို့ မရှိပါဘူး။

## Keys နဲ့ cache hits တွေ ဘယ်လို အလုပ်လုပ်လဲ

Default အားဖြင့် cache key က execute လုပ်လိုက်တဲ့ query ရဲ့ content hash ပါ — post-lowering ဖြစ်ပြီးသား statement ကို ၎င်းရဲ့ bound parameters တွေနဲ့အတူ contract ရဲ့ storage hash ပေါ် ပေါင်းထားတာပါ။ Parameter values မတူတဲ့ lookups နှစ်ခုက slots မတူတာတွေထဲ ကျပြီး — တူညီတဲ့ lookup ကတော့ hit ဖြစ်ပါတယ်။ Schema migrations တွေက storage hash ကို လှည့်ပြောင်းလို့ — migration မတိုင်ခင် cache လုပ်ထားတဲ့ entries တွေက schema အသစ်ပေါ်က queries တွေကို မဖြည့်ပေးနိုင်ပါဘူး။

Cache hits တွေက middleware chain ထဲက ကျန်တဲ့သူတွေ မြင်နေရဆဲပါ: `beforeExecute` hooks တွေ run ပြီးသွားပြီ၊ driver နဲ့ `onRow` ကို ကျော်သွားပြီး — `afterExecute` က middleware တိုင်းပေါ်မှာ `result.source` ကို `'driver'` အစား `'middleware'` နဲ့ fire လို့ logging နဲ့ metrics တွေက cached reads တွေအတွက်ပါ ဆက်ပြီး အလုပ်လုပ်ပါတယ်။

Cache က runtime scope မှာပဲ အလုပ်လုပ်ပါတယ်။ Transaction တစ်ခုထဲမှာ ဒါမှမဟုတ် သီးသန့် checkout လုပ်ထားတဲ့ connection ပေါ်မှာ execute လုပ်တဲ့ queries တွေက အမြဲတမ်း database ကိုပဲ သွားပါတယ် — အဲဒီနေရာတွေမှာ read-after-write consistency က caller ရဲ့ မျှော်လင့်ချက် ဖြစ်လို့ပါ။

## Options

| Option | Type | Default | ဘာကို ထိန်းချုပ်လဲ |
| --- | --- | --- | --- |
| `maxEntries` | `number` | `1000` | Default in-memory store ထဲက အများဆုံး entries အရေအတွက် — အသုံးနည်းဆုံး (least-recently-used) entries တွေက အရင်ဆုံး ထုတ်ပစ်ခံရပါတယ်။ `store` ကို ချန်လိုက်တဲ့အခါမှပဲ သက်ဆိုင်ပါတယ် |
| `store` | `CacheStore` | in-memory LRU | ကိုယ်ပိုင် store implementation ကို ယူသုံးပါ — ဥပမာ Redis နဲ့ backed လုပ်ထားတာမျိုး |
| `clock` | `() => number` | `Date.now` | Commit လုပ်ထားတဲ့ entries ပေါ်မှာ `storedAt` ကို ရိုက်ဖို့ သုံးတဲ့ အချိန် source — TTL expiry က store implementation ထဲမှာ ရှိပါတယ် |

## သတိထားရမယ့် အချက်များ

> **Warning — default store က per-process, in-memory ပါ**
>
> App instance နှစ်ခုက ဒီ store ကို မျှဝေမသုံးနိုင်ဘဲ — deploy လုပ်တိုင်း ရှင်းသွားပါတယ်။ ဒါကြောင့် ပူပြင်းပြီး stale ဖြစ်တာကို သည်းခံလို့ရတဲ့ reads တွေအတွက် ကောင်းမွန်ပေမယ့် — source of truth (မှီခိုရာ အရင်းအမြစ်) အနေနဲ့တော့ မသင့်တော်ပါဘူး။ Shared caching လိုချင်ရင် သင့် infrastructure ပေါ်မှာ `store` ကို implement လုပ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [How middleware works](/docs/prisma/how-middleware-works) — middleware က query တိုင်းရဲ့ ရှေ့နဲ့ နောက်မှာ သင့် code ကို run လို့ policy တစ်ခုက သင့် app တစ်ခုလုံးကို လွှမ်းခြုံနိုင်ပါတယ်
- [Authoring custom middleware](https://www.prisma.io/docs/orm/middleware/authoring-custom-middleware) — ကိုယ်ပိုင် Prisma 8 middleware တစ်ခုကို step by step တည်ဆောက်ခြင်း — `intercept` short-circuiting ဘယ်လို အလုပ်လုပ်လဲ အပါအဝင်
- [Built-in: budgets](https://www.prisma.io/docs/orm/middleware/built-in-budgets) — row counts တွေကို ကန့်သတ်ပြီး latency ကျော်နေတဲ့ queries တွေကို မြင်သာအောင် လုပ်ပေးတဲ့ budgets middleware
- [Built-in: lints](https://www.prisma.io/docs/orm/middleware/built-in-lints) — query တစ်ခုစီရဲ့ တည်ဆောက်ပုံကို run မလုပ်ခင် စစ်ပြီး အန္တရာယ်ရှိတဲ့ ပုံစံတွေကို block ဒါမှမဟုတ် warn လုပ်ပေးတဲ့ lints middleware
