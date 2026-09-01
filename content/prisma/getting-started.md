---
title: "Prisma စတင်ခြင်း"
description: "Prisma ဆိုတာ ဘာလဲ၊ ဘယ်လို install လုပ်ပြီး ပထမဆုံး model နဲ့ query ကို စရေးမလဲ — Node.js/TypeScript project တစ်ခုမှာ"
order: 1
source: "https://www.prisma.io/docs/getting-started/quickstart"
status: translated
updated: 2026-09-01
---

## Prisma ဆိုတာ ဘာလဲ

**Prisma** က Node.js နဲ့ TypeScript အတွက် next-generation ORM
(Object-Relational Mapping) tool တစ်ခုပါ။ ORM ဆိုတာ — database ရဲ့ table တွေကို
programming language ထဲက object တွေအနေနဲ့ ကိုင်တွယ်လို့ရအောင် ကြားခံပေးတဲ့
layer ပါ။ Prisma ရဲ့ အထူးခြားဆုံး အားသာချက်ကတော့ **type-safe database access**
ပါ — schema မှာ model တွေ သတ်မှတ်ပြီးတာနဲ့ Prisma Client က TypeScript type
တွေကို အလိုအလျောက် generate လုပ်ပေးလို့၊ query ရေးတဲ့အခါ field အမည် မှားရင်
app ကို run လုပ်စရာမလိုဘဲ compile လုပ်တုန်းမှာတင် error ဖမ်းလို့ရပါတယ်။

Prisma မှာ အဓိက အစိတ်အပိုင်း သုံးခု ပါတယ်:

- **Prisma Client** — auto-generated, type-safe query builder။ SQL မရေးဘဲ
  JavaScript/TypeScript function တွေနဲ့ query ရေးလို့ရတယ်
- **Prisma Migrate** — schema ပြောင်းတိုင်း migration file တွေ ဖန်တီးပြီး
  database ကို sync လုပ်ပေးတယ်
- **Prisma Studio** — browser မှာ data တွေကို GUI နဲ့ ကြည့်/ပြင်/ဖျက်လို့ရတဲ့ tool

## စတင်ဖို့ — Project အသစ် တစ်ခု ဖန်တီးမယ်

အရင်ဆုံး project folder အသစ် တစ်ခု ဆောက်ပြီး `npm` နဲ့ စတင်လိုက်ပါ:

```bash
mkdir hello-prisma
cd hello-prisma
npm init -y
```

ပြီးရင် Prisma CLI ကို development dependency အနေနဲ့ install လုပ်ပါ:

```bash
npm install prisma --save-dev
```

## Prisma ကို စတင်သုံးမယ်

`prisma init` command က project ထဲမှာ Prisma ကို သတ်မှတ်ပေးပါတယ် —
`prisma/schema.prisma` ဆိုတဲ့ schema file နဲ့ `.env` ဆိုတဲ့ environment file
တို့ကို ဖန်တီးပေးပါတယ်:

```bash
npx prisma init --datasource-provider sqlite
```

ဒီမှာ `--datasource-provider sqlite` က SQLite database ကို သုံးမယ်လို့
ရွေးလိုက်တာပါ — စမ်းကြည့်ဖို့ အလွယ်ဆုံး ဖြစ်လို့ပါ။ PostgreSQL သုံးချင်ရင်
ဒီ flag မှာ `postgresql` လို့ ပြောင်းရေးလို့ရပါတယ်။

## Model တစ်ခု သတ်မှတ်မယ်

`prisma/schema.prisma` ထဲမှာ model တစ်ခု သတ်မှတ်ကြည့်ရအောင်။ Model ဆိုတာ
database ထဲက table တစ်ခုကို ကိုယ်စားပြုပြီး — model ရဲ့ field တွေက
table ရဲ့ column တွေ ဖြစ်ပါတယ်:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

ဒီ model မှာ `id` က primary key (`@id`) ဖြစ်ပြီး အလိုအလျောက် တိုးသွားပါတယ်
(`@default(autoincrement())`); `email` က တစ်ဦးနဲ့တစ်ဦး မထပ်ရအောင် `@unique`
သတ်မှတ်ထားပြီး၊ `name` က `?` ပါလို့ မထည့်ဘဲ ချန်ထားလို့ရတဲ့ optional field ပါ။

## Migration run လုပ်မယ်

Schema ကို database မှာ အမှန်တကယ် သက်ရောက်စေဖို့ migration လုပ်ရပါတယ်:

```bash
npx prisma migrate dev --name init
```

ဒီ command က — migration file အသစ်တွေ ဖန်တီးပေး၊ database ထဲမှာ table တွေ
ဖန်တီးပေးပြီး Prisma Client ကိုပါ generate လုပ်ပေးပါတယ်။ ပြီးရင် app ထဲမှာ
သုံးဖို့ `@prisma/client` package ကို install လုပ်ရပါမယ်:

```bash
npm install @prisma/client
```

## Prisma Client နဲ့ query ရေးမယ်

အခု `script.ts` ဆိုတဲ့ file အသစ် တစ်ခု ဆောက်ပြီး Prisma Client ကို သုံးပြီး
user အသစ် တစ်ယောက် ဖန်တီးကြည့်ရအောင်:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // user အသစ် တစ်ယောက် ဖန်တီးမယ်
  const user = await prisma.user.create({
    data: {
      email: "ada@prisma.io",
      name: "Ada Lovelace",
    },
  });
  console.log(user);
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

ဒီ script ကို run လုပ်ဖို့ TypeScript ကို တိုက်ရိုက် run လို့ရတဲ့ `tsx` ကို
သုံးနိုင်ပါတယ်:

```bash
npx tsx script.ts
```

Table ထဲက data အားလုံးကို ပြန်ဖတ်ချင်ရင် `findMany` ကို သုံးပါတယ်:

```ts
const users = await prisma.user.findMany();
console.log(users);
```

## နောက်တစ်ဆင့်တွေ

- [Prisma Schema ရေးနည်း](/docs/prisma/schema) — datasource, generator,
  relation တွေ အကြောင်း ဆက်လေ့လာပါ
- Data တွေကို GUI နဲ့ ကြည့်ချင်ရင် `npx prisma studio` ကို run လုပ်ပါ
- Official docs: https://www.prisma.io/docs
