---
title: "Relations (ဆက်စပ်မှုများ)"
description: "Prisma schema မှာ model တွေကြား relation (ဆက်စပ်မှု) သတ်မှတ်နည်း — one-to-one, one-to-many, many-to-many, @relation attribute, implicit/explicit many-to-many နဲ့ relation query တွေ"
order: 3
source: "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations"
status: translated
updated: 2026-09-01
---

## Relation ဆိုတာ ဘာလဲ

**Relation** ဆိုတာ Prisma schema ထဲက model နှစ်ခုကြားက ဆက်စပ်မှုပါ။ ဥပမာ — user တစ်ယောက်က blog post အများကြီး ရေးနိုင်တာကြောင့် `User` နဲ့ `Post` ကြားမှာ one-to-many relation ရှိပါတယ်။ Prisma အနေနဲ့ ဒီ relation ကို အပိုင်းနှစ်ပိုင်း ခွဲကြည့်လို့ရပါတယ်:

- **Relation field** (`author`, `posts`) — Prisma ORM အဆင့်မှာ connection ကို သတ်မှတ်ပေးပြီး database ထဲမှာ column အနေနဲ့ မရှိပါဘူး
- **Relation scalar field** (`authorId`) — database ထဲမှာ အမှန်တကယ် ရှိတဲ့ foreign key ပါ

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int  // Foreign key connecting Post to User
  title    String
}
```

SQL မှာ foreign key နဲ့ table နှစ်ခုကို ချိတ်ဆက်သလိုပဲ — `Post.authorId` column က `User.id` (primary key) ကို ညွှန်းပါတယ်။

## Relation အမျိုးအစားတွေ

Prisma မှာ relation အမျိုးအစား သုံးမျိုး ရှိပါတယ်:

- **one-to-one (1-1)** — နှစ်ဖက်စလုံးက record တစ်ခုနဲ့တစ်ခု ချိတ်ဆက်တာ။ ဥပမာ `User` ↔ `Profile`
- **one-to-many (1-n)** — တစ်ဖက်က record တစ်ခုနဲ့ နောက်တစ်ဖက်က record အများကြီး ချိတ်ဆက်တာ။ ဥပမာ `User` ↔ `Post`
- **many-to-many (m-n)** — နှစ်ဖက်စလုံးက record အများကြီးနဲ့ချင်း ချိတ်ဆက်တာ။ ဥပမာ `Post` ↔ `Category`

အမျိုးအစား သုံးမျိုးစလုံး ပါဝင်တဲ့ schema တစ်ခုကို ကြည့်ရအောင် — `User` ↔ `Profile` က one-to-one၊ `User` ↔ `Post` က one-to-many၊ `Post` ↔ `Category` က many-to-many ပါ:

```prisma
model User {
  id      Int      @id @default(autoincrement())
  posts   Post[]
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique // relation scalar field (used in the `@relation` attribute above)
}

model Post {
  id         Int        @id @default(autoincrement())
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int // relation scalar field  (used in the `@relation` attribute above)
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

## @relation attribute နဲ့ foreign key

`@relation(fields: [...], references: [...])` က relation ရဲ့ foreign key ဘက်မှာ ထည့်ပါတယ် — `fields` က ကိုယ့်ဘက်က foreign key column ဖြစ်ပြီး `references` က ညွှန်းတဲ့ဘက်က column ပါ။ အပေါ်က ဥပမာမှာ `Post.authorId` က `User.id` ကို ညွှန်းပါတယ်။ Foreign key ကို ထားသင့်တဲ့ ဘက်ကတော့ "many" (သို့) dependent ဘက်ပါ — ဥပမာ post တစ်ခုက user မရှိဘဲ မဖြစ်ပေမယ့် user ကတော့ post မရှိဘဲ ဖြစ်နေလို့ရပါတယ်။ Relation scalar field ရဲ့ နာမည်က ပုံမှန် `fieldName + Id` ပုံစံပါ — `author` → `authorId` လိုမျိုး။ `@relation` attribute က one-to-one နဲ့ one-to-many မှာ မဖြစ်မနေ လိုအပ်ပြီး — model တစ်စုံတည်းကြားမှာ relation တစ်ခုထက် ပိုရှိနေရင်တော့ `name` argument နဲ့ relation တွေကို ခွဲခြားသတ်မှတ်ရပါတယ်။

## Implicit နဲ့ explicit many-to-many

Many-to-many relation ကို နည်းနှစ်နည်းနဲ့ ရေးလို့ရပါတယ်:

- **Implicit many-to-many** — join table (relation table) ကို Prisma က ကိုယ်တိုင် စီမံပေးပြီး schema ထဲမှာ မပေါ်ပါဘူး။ အပေါ်က `Post.categories` / `Category.posts` လို နှစ်ဖက်စလုံးက list field နဲ့ ရေးရုံပါ။ ဒါဆိုရင် Prisma Client API က ပိုရိုးရှင်းပါတယ် — nested write တွေမှာ အဆင့်တစ်ဆင့် လျော့သွားလို့ပါ။ ဒါပေမယ့် model နှစ်ခုလုံးမှာ single `@id` ရှိရမယ်၊ multi-field ID နဲ့ `@unique` ကို `@id` နေရာမှာ သုံးလို့ မရပါဘူး
- **Explicit many-to-many** — join table ကို model အနေနဲ့ ကိုယ်တိုင် သတ်မှတ်တာပါ — ဥပမာ `PostTag { postId, tagId, post, tag, @@id([postId, tagId]) }` လိုမျိုး။ Composite primary key နဲ့ စုံတွဲတစ်ခုကို တစ်ကြိမ်သာ သေချာ မှတ်ပြီး join model ပေါ်မှာ `addedAt` လို နောက်ထပ် အချက်အလက်တွေလည်း ထည့်လို့ရပါတယ်

## Relation query တွေ — include နဲ့ nested write

Relation နဲ့ အတူတူ ပြန်ဖတ်ချင်ရင် `include` ကို သုံးပါတယ် — user တစ်ယောက်နဲ့ သူ့ရဲ့ post တွေကို query တစ်ခုတည်းနဲ့ တစ်ခါတည်း ယူပါတယ်:

```ts
const userWithPosts = await prisma.user.findUnique({
  where: { id: "20" },
  include: { posts: true },
});
```

**Nested write** ကတော့ — user နဲ့ သူ့ရဲ့ post တွေကို transaction တစ်ခုထဲမှာ အတူတူ ဖန်တီးတာပါ။ တစ်စိတ်တစ်ပိုင်း မအောင်မြင်ရင် အကုန်လုံး rollback ဖြစ်ပြီး data တွေ မပျက်စီးအောင် ကာကွယ်ပေးပါတယ်:

```ts
const userAndPosts = await prisma.user.create({
  data: {
    posts: {
      create: [{ title: "Prisma Day 2020" }, { title: "How to write a Prisma schema" }],
    },
  },
});
```

`include` နဲ့ nested write တွေအပြင် relation filter (`some`/`every`/`none`) စတဲ့ query အသေးစိတ်တွေကို [Query အသေးစိတ် (CRUD)](/docs/prisma/queries) မှာ ဆက်ဖတ်နိုင်ပါတယ်။ Schema ရဲ့ အခြေခံကို ပြန်ကြည့်ချင်ရင် [Prisma Schema ရေးနည်း](/docs/prisma/schema) မှာ ရှိပါတယ်။
