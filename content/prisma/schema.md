---
title: "Prisma Schema ရေးနည်း"
description: "schema.prisma ရဲ့ ဖွဲ့စည်းပုံ — datasource, generator, model — field type တွေ၊ attribute တွေနဲ့ relation ရေးနည်း"
order: 2
source: "https://www.prisma.io/docs/orm/prisma-schema/overview"
status: translated
updated: 2026-09-01
---

## Prisma Schema ဆိုတာ ဘာလဲ

**Prisma schema** က Prisma project တစ်ခုရဲ့ အဓိက configuration file ဖြစ်ပြီး
ပုံမှန်အားဖြင့် `prisma/schema.prisma` မှာ သိမ်းပါတယ်။ ဒီ file တစ်ခုတည်းထဲမှာ —
database နဲ့ ဘယ်လို ချိတ်ဆက်မယ် (datasource), ဘာ client code ကို generate
လုပ်မယ် (generator), data model (model) တွေ အားလုံးကို သတ်မှတ်ပါတယ်။
Schema က Prisma project ရဲ့ source of truth ဖြစ်ပြီး — ဒီကနေမှ Prisma
Client နဲ့ migration တွေ အကုန် ထွက်လာတာပါ။

## Schema File ရဲ့ ဖွဲ့စည်းပုံ

အခြေခံ schema file တစ်ခုက block သုံးမျိုးနဲ့ ဖွဲ့စည်းထားပါတယ် —
`datasource`, `generator`, `model`:

```prisma
// Prisma schema file ရဲ့ ပုံစံအကြမ်း
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

- **datasource block** — database ချိတ်ဆက်မှု သတ်မှတ်ချက်။ `provider` က
  database အမျိုးအစား (`postgresql`, `mysql`, `sqlite` စသည်) ဖြစ်ပြီး
  `url` က connection string ပါ။ Connection string ကို `.env` file ထဲက
  `DATABASE_URL` ကနေ ဖတ်တာမို့ — secret တွေက code ထဲ မရောက်အောင်
  ကာကွယ်ထားပါတယ်။
- **generator block** — `prisma generate` run လုပ်တဲ့အခါ ဘာ client ကို
  ထုတ်မယ်ဆိုတာ သတ်မှတ်တာ။ `prisma-client-js` က Prisma Client ကို
  generate လုပ်ပေးပါတယ်။

## Model — Database Table ကို ကိုယ်စားပြုခြင်း

**Model** က database ထဲက table တစ်ခုကို ကိုယ်စားပြုပြီး — model name က
table name အနေနဲ့ သုံးပါတယ်။ မတူတဲ့ name သုံးချင်ရင် `@@map("table_name")`
attribute နဲ့ ပြောင်းလို့ရပါတယ်။ Model ထဲက field တစ်ခုချင်းစီက column
တစ်ခုစီ ဖြစ်ပါတယ်:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  isAdmin   Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

Field ရဲ့ ဖွဲ့စည်းပုံက — `fieldName Type? attribute1 attribute2 ...` ပါ။
`?` ထည့်ထားရင် optional (nullable) field ဖြစ်ပြီး မထည့်ရင် required ပါ။
Prisma ရဲ့ အသုံးများတဲ့ scalar type တွေကတော့:

- `String` — text data
- `Int` — ကိန်းပြည့်
- `Boolean` — true / false
- `DateTime` — ရက်စွဲနဲ့ အချိန်
- (`Float`, `Decimal`, `Json` စတာတွေလည်း ရှိပါသေးတယ်)

Attribute တွေက field ရဲ့ အပြုအမူကို သတ်မှတ်ပါတယ်:

- `@id` — primary key ဖြစ်ကြောင်း သတ်မှတ်တာ
- `@default(autoincrement())` — row အသစ်တိုင်းမှာ 1, 2, 3... အလိုအလျောက်
  တိုးပေးတဲ့ default
- `@default(now())` — row ဖန်တီးတဲ့အချိန်ကို အလိုအလျောက် မှတ်ပေးတဲ့ default
- `@unique` — ဒီ column မှာ တန်ဖိုး ထပ်လို့မရဘူးလို့ သတ်မှတ်တာ

## Relations — Model တွေကြား ဆက်စပ်မှု

Real-world app တွေမှာ table တွေက တစ်ခုနဲ့တစ်ခု ဆက်စပ်နေတတ်ပါတယ် —
ဥပမာ user တစ်ယောက်က post အများကြီး ရေးနိုင်တဲ့ **one-to-many** relation။
ဒါကို Prisma မှာ `@relation` နဲ့ ဒီလို ရေးပါတယ်:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

ဒီမှာ relation ရဲ့ foreign key side က `Post` ပါ — `@relation(fields: [authorId],
references: [id])` ဆိုတာ `Post.authorId` column က `User.id` ကို ညွှန်းတယ်လို့
အဓိပ္ပာယ်ရပါတယ်။ နောက်တစ်ဖက် `User` မှာတော့ `posts Post[]` ဆိုပြီး
list field အနေနဲ့ သတ်မှတ်ပါတယ် — ဒါဆိုရင် Prisma Client ကနေ
`user.posts` လို့ တိုက်ရိုက် လှမ်းဖတ်လို့ရပါတယ်။

## Schema ကို Database နဲ့ Sync လုပ်ခြင်း

Schema ပြောင်းတိုင်း Prisma Client ကို ပြန် generate လုပ်ဖို့
`npx prisma generate` ကို run ပါ။ Table တွေကို database မှာ အမှန်တကယ်
ဖန်တီး/ပြောင်းဖို့ကတော့ — migration file နဲ့ သွားချင်ရင်
`npx prisma migrate dev`, migration file မလိုဘဲ ချက်ချင်း sync ချင်ရင်
`npx prisma db push` ကို သုံးပါတယ်။
