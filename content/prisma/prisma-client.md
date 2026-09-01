---
title: "Prisma Client အသုံးပြုခြင်း"
description: "Prisma Client ကို generate လုပ်ပြီး instantiate လုပ်ပုံ — singleton pattern, serverless/Next.js အတွက် globalThis caching, $connect/$disconnect, logging နဲ့ client extension အကြောင်း"
order: 6
source: "https://www.prisma.io/docs/orm/prisma-client"
status: translated
updated: 2026-09-01
---

## Prisma Client ဆိုတာ ဘာလဲ

**Prisma Client** က Prisma ORM ရဲ့ auto-generated, type-safe query builder ပါ။ Schema ထဲက model တွေပေါ်မူတည်ပြီး — model name, field name မှားရင် compile လုပ်တုန်းမှာတင် error ဖမ်းလို့ရတဲ့ typed method တွေ ထုတ်ပေးပါတယ်။ Schema ပြောင်းလိုက်တိုင်း client ကို ပြန် generate လုပ်ဖို့ လိုပါတယ်:

```bash
npx prisma generate
```

ပြီးရင် `@prisma/client` ကနေ import လုပ်ပြီး instance တစ်ခု ဆောက်ကာ query တွေ စရေးလို့ရပါတယ် — instance ကို ဘယ်လို စနစ်တကျ သတ်မှတ်ရမလဲဆိုတာ နောက် section တွေမှာ ဆက်ကြည့်ပါမယ်။

## Singleton pattern — instance တစ်ခုတည်း သုံးခြင်း

App တစ်ခုလုံးမှာ `PrismaClient` instance **တစ်ခုတည်း** ကို ပြန်သုံးသင့်ပါတယ်။ Instance တစ်ခုစီမှာ connection pool သီးခြား ရှိတာမို့ — instance များလေလေ database connection တွေ ကုန်လေလေပါ။ Connection limit ကျော်သွားရင် `too many clients already` လို error တွေ တက်လာပြီး database ကို နှေးကွေးစေပါတယ်။ Module တစ်ခုထဲမှာ instance ကို ဆောက်ပြီး export လုပ်ထားရင် Node.js ရဲ့ module cache က instance တစ်ခုတည်းကိုပဲ ပြန်သုံးပေးပါတယ်:

```ts
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export default prisma;
```

ဒီ module ကို ဘယ်နေရာကမဆို `import prisma from "./client"` လို့ import လုပ်ပြီး — `const users = await prisma.user.findMany();` လို query တွေ run လို့ရပါတယ်။

## Serverless / Next.js — globalThis caching

Serverless environment (AWS Lambda, Vercel Functions စသည်) မှာ function တစ်ခုချင်းစီအတွက် instance သီးခြား ဖြစ်သွားတတ်ပါတယ် — ဒါကြောင့် instance ကို handler ရဲ့ အပြင်ဘက်မှာ ဆောက်ထားပြီး container ပြန်သုံးနိုင်သမျှ ပြန်သုံးဖို့ အကြံပြုပါတယ်။ Next.js လို hot reload ရှိတဲ့ framework တွေမှာတော့ — file ပြောင်းတိုင်း module ကို ပြန် refresh လုပ်ပြီး instance အသစ်တွေ ထပ်ထွက်လာတတ်လို့ `globalThis` ပေါ်မှာ instance ကို cache လုပ်ထားတဲ့ နည်းကို သုံးပါတယ် (global variable တွေက reload လုပ်တဲ့အခါ မပျက်ပါဘူး):

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Connection lifecycle — $connect / $disconnect

Prisma Client က connection ကို lazy ဖွင့်ပါတယ် — query ပထမဆုံး run တဲ့အခါမှ connect ဖြစ်ပြီး `$connect()` နဲ့ စောစောဖွင့်ထားလို့လည်း ရပါတယ်။ Script လိုမျိုး ခဏသုံးပြီး ပြီးသွားတဲ့နေရာမှာတော့ `$disconnect()` နဲ့ connection ကို ပိတ်ပါတယ်။ ဒါပေမယ့် long-running app ဒါမှမဟုတ် serverless function တွေမှာ query တိုင်း နောက်ကြောင်း `$disconnect()` လုပ်နေရင် — connection အသစ် ပြန်ဖွင့်ရလို့ performance ကျဆင်းစေပါတယ်။

## Logging

Prisma Client က database ဆီ ပို့တဲ့ query တွေကို ကြည့်ချင်ရင် — `log` option နဲ့ log level တွေကို ဖွင့်နိုင်ပါတယ်:

```ts
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

`query` level က database ဆီ ပို့လိုက်တဲ့ SQL နဲ့ execution time ကို stdout ပေါ် ပြပေးပါတယ် — query တွေကို debug လုပ်တဲ့အခါ အရမ်း အသုံးဝင်ပါတယ်။ Event အနေနဲ့ လက်ခံချင်ရင်တော့ `prisma.$on("query", (e) => ...)` နဲ့ subscribe လုပ်ပြီး — query text, params, duration တွေကို ကိုယ်ပိုင် logic နဲ့ ကိုင်တွယ်လို့ရပါတယ်။

## Client extension (အကျဉ်း)

`$extends` နဲ့ Prisma Client ကို extension လုပ်နိုင်ပါတယ် — model တွေမှာ custom method ထည့်တာ (`model`), client-level method တွေ (`client`), query တွေကို ပြင်ဆင်တာ (`query`), result တွေမှာ field အသစ် ထည့်တာ (`result`) စသဖြင့်ပါ။ Extension လုပ်လိုက်တဲ့အခါ extended client အသစ် တစ်ခု ဖြစ်လာပြီး — မူလ client ကို မပြောင်းလဲဘဲ connection pool တစ်ခုတည်းကိုပဲ မျှဝေသုံးပါတယ်။ ဥပမာ — `prisma.user` မှာ `current()` ဆိုတဲ့ method တစ်ခု ထည့်ပြီး "လက်ရှိ login ဝင်နေတဲ့ user" ကို ပြန်ပေးတာမျိုး လုပ်လို့ရပါတယ်။

CRUD query တွေရဲ့ အသေးစိတ်ကို [Query အသေးစိတ် (CRUD)](/docs/prisma/queries) မှာ ဖတ်ပါ။ Schema ပြောင်းလဲမှုတွေကို version လိုက် စီမံချင်ရင် [Migrations](/docs/prisma/migrations) မှာ ဆက်ဖတ်နိုင်ပါတယ်။
