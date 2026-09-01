---
title: "Query အသေးစိတ် (CRUD)"
description: "Prisma Client နဲ့ CRUD query တွေ ရေးနည်း — create, findMany, update, upsert, delete, count, filter operator တွေ နဲ့ $queryRaw အကြောင်း"
order: 4
source: "https://www.prisma.io/docs/orm/prisma-client/queries"
status: translated
updated: 2026-09-01
---

## Create — Record အသစ် ဖန်တီးခြင်း

Record အသစ် တစ်ခု ထည့်ဖို့ `create` ကို သုံးပြီး — ဖန်တီးပြီးသား record တစ်ခုလုံးကို ပြန်ပေးပါတယ်။ `id` လိုမျိုး auto-generate ဖြစ်တဲ့ field တွေကို မထည့်ဘဲ ချန်ထားလို့ရပြီး — schema ထဲမှာ required ဖြစ်တဲ့ field တွေကိုတော့ မဖြစ်မနေ ထည့်ပေးရပါတယ်။ Record အများကြီးကို တစ်ပြိုင်နက် ထည့်ချင်ရင်တော့ `createMany` ကို သုံးပါတယ် — ဒါက record တွေကို ပြန်မပေးဘဲ `{ count }` ဆိုတဲ့ အရေအတွက်ပဲ ပြန်ပေးပါတယ်:

```ts
const user = await prisma.user.create({
  data: {
    email: "elsa@prisma.io",
    name: "Elsa Prisma",
  },
});

const createMany = await prisma.user.createMany({
  data: [
    { name: "Bob", email: "bob@prisma.io" },
    { name: "Yewande", email: "yewande@prisma.io" },
  ],
  skipDuplicates: true, // duplicate ဖြစ်နေတဲ့ record တွေကို ကျော်လိုက်မယ်
});
// Returns: { count: 2 }
```

`createMany` မှာ `skipDuplicates` option က unique field တွေ ထပ်နေတဲ့ record တွေကို ကျော်သွားစေပြီး — MongoDB, SQL Server, SQLite တို့မှာတော့ မရပါဘူး။

## Read — Record တွေ ဖတ်ခြင်း

`findUnique` က unique field (id, email စသည်) နဲ့ record တစ်ခုကို တိတိကျကျ ရှာပြီး — `findFirst` က filter ကိုက်ညီတဲ့ ပထမဆုံး record တစ်ခုကို ပြန်ပေးပါတယ်။ `findMany` ကတော့ ကိုက်ညီတဲ့ record တွေ အားလုံးကို list အနေနဲ့ ပြန်ပေးပါတယ်။ ဒီ query တွေမှာ `where` နဲ့ စစ်ထုတ်၊ `orderBy` နဲ့ စဉ်၊ `take`/`skip` နဲ့ page လိုက် ဖြတ်ယူ (offset pagination)၊ `select` နဲ့ လိုအပ်တဲ့ field တွေပဲ ရွေးယူလို့ရပါတယ်:

```ts
// id 99 ရှိတဲ့ user တစ်ယောက်
const user = await prisma.user.findUnique({
  where: { id: 99 },
});

// email က prisma.io နဲ့ ဆုံးတဲ့ user 10 ယောက် — id ကြီးတဲ့ဟာကစပြီး
const users = await prisma.user.findMany({
  where: { email: { endsWith: "prisma.io" } },
  orderBy: { id: "desc" },
  take: 10,
  select: { email: true, name: true },
});

// OR နဲ့ relation filter ပေါင်းစပ်ခြင်း — post တစ်ခုခုက views 100 ကျော်တဲ့ user
const filteredUsers = await prisma.user.findMany({
  where: {
    OR: [{ email: { endsWith: "gmail.com" } }, { email: { endsWith: "company.com" } }],
    posts: { some: { views: { gt: 100 } } },
  },
});
```

ဒီနေရာမှာ `take: 10` က record 10 ခုပဲ ယူပြီး — `skip` နဲ့ ပေါင်းသုံးရင် page တွေ ခွဲပြီး ဖတ်လို့ရပါတယ်။ Relation တွေပါ ပြန်ဖတ်ချင်ရင် `select` အစား `include: { posts: true }` ကို သုံးပါတယ် — အသေးစိတ်ကို [Relations (ဆက်စပ်မှုများ)](/docs/prisma/relations) မှာ ကြည့်ပါ။

## Filter operator တွေ

`where` ထဲမှာ field တန်ဖိုး တိုက်ရိုက် ပေးရုံမက — operator တွေနဲ့ ပိုတိကျတဲ့ filter တွေ ရေးလို့ရပါတယ်:

- `equals` — တန်ဖိုးနဲ့ အတိအကျ တူတာ၊ ဥပမာ `{ role: { equals: "ADMIN" } }`
- `contains` — text ထဲမှာ ပါဝင်တာ၊ ဥပမာ `{ name: { contains: "prisma" } }` (`startsWith`, `endsWith` တွေလည်း ရှိပါတယ်)
- `in` — list ထဲက တန်ဖိုးတစ်ခုခုနဲ့ ကိုက်ညီတာ၊ ဥပမာ `{ id: { in: [1, 2, 3] } }`
- `gt` / `gte` — ပိုကြီး / ကြီးသည်ထက် ကြီး၊ ဥပမာ `{ age: { gt: 18 } }` (`lt` / `lte` ကတော့ ပိုငယ် / ငယ်သည်ထက် ငယ်)

ဒီ operator တွေကို `OR`, `AND`, `NOT` တွေနဲ့ ပေါင်းစပ်လို့ရပြီး — relation ဘက်ကိုလည်း `some` (အနည်းဆုံး တစ်ခုနဲ့ ကိုက်ညီ) လို operator တွေနဲ့ filter လုပ်နိုင်ပါတယ်။ ဥပမာ အပေါ်က code ထဲမှာ `posts: { some: { views: { gt: 100 } } }` က "views 100 ကျော်တဲ့ post အနည်းဆုံး တစ်ခု ရှိတဲ့ user" ကိုပဲ ရွေးပေးပါတယ်။

## Update နဲ့ upsert

`update` က unique field နဲ့ record တစ်ခုကို ပြင်ပြီး — `updateMany` က filter ကိုက်ညီတဲ့ record တွေ အကုန် ပြင်ပြီး `{ count }` ပြန်ပေးပါတယ်။ **upsert** ကတော့ "ရှိရင် `update`၊ မရှိရင် `create`" ဆိုတဲ့ logic ကို query တစ်ခုထဲမှာ လုပ်ပေးပါတယ် — ဥပမာ user တစ်ယောက်ရဲ့ profile ကို ရှိရင် ပြင်၊ မရှိရင် အသစ် ဖန်တီးတာမျိုးပါ:

```ts
const updateUser = await prisma.user.update({
  where: { email: "viola@prisma.io" },
  data: { name: "Viola the Magnificent" },
});

const upsertUser = await prisma.user.upsert({
  where: { email: "viola@prisma.io" },
  update: { name: "Viola the Magnificent" },
  create: { email: "viola@prisma.io", name: "Viola the Magnificent" },
});
```

## Delete, count နဲ့ raw query

`delete` က record တစ်ခုကို ဖျက်ပြီး — `deleteMany` က filter ကိုက်ညီတဲ့ record တွေ အကုန် ဖျက်ပါတယ်။ Record အရေအတွက် ရေချင်ရင်တော့ `count` ကို သုံးပါတယ်။ နောက်ထပ် Prisma Client မှာ မပါသေးတဲ့ database feature လိုအပ်တဲ့အခါ ဒါမှမဟုတ် အဆင့်မြင့် optimized query ရေးချင်တဲ့အခါမျိုးမှာ `$queryRaw` နဲ့ raw SQL ရေးလို့ရပါတယ် — tagged template ဖြစ်လို့ variable တွေကို Prisma က escape လုပ်ပေးပြီး SQL injection အန္တရာယ် နည်းပါတယ်:

```ts
const deleteUsers = await prisma.user.deleteMany({
  where: { email: { contains: "prisma.io" } },
});

const userCount = await prisma.user.count({
  where: { profileViews: { gte: 100 } },
});

const email = "emelie@prisma.io";
const result = await prisma.$queryRaw`SELECT * FROM User WHERE email = ${email}`;
```

Prisma Client ကို ဘယ်လို သတ်မှတ်/configure လုပ်ရမလဲဆိုတာ [Prisma Client အသုံးပြုခြင်း](/docs/prisma/prisma-client) မှာ ရှိပြီး — schema ပြောင်းလဲမှုတွေကို စီမံချင်ရင်တော့ [Migrations](/docs/prisma/migrations) မှာ ဆက်ဖတ်နိုင်ပါတယ်။
