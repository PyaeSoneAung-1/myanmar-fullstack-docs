---
title: "ဒေတာ ရေးသားခြင်း (Writing data)"
description: "Prisma 8 နဲ့ record တွေ create, update, delete, upsert လုပ်နည်း — တစ်ခုချင်း ဒါမှမဟုတ် bulk (createAll, updateAll, deleteAll, Count variants) နဲ့"
order: 8
source: "https://www.prisma.io/docs/orm/prisma-client/queries/writing-data"
status: translated
updated: 2026-09-01
---

ဒီ page က Prisma 8 နဲ့ ဒေတာရေးနည်းကို ပြပါတယ် — record တစ်ခုချင်းစီကို **ဖန်တီးခြင်း**, **ပြင်ဆင်ခြင်း**, **ဖျက်ခြင်း**, **upsert လုပ်ခြင်း** — ပြီးတော့ record အများကြီးကို တစ်ပြိုင်နက် `All` နဲ့ `Count` variants သုံးပြီး **ရေးသားခြင်း** တို့ပါ။

## ဥပမာ Schema

ဒီ page ပေါ်က ဥပမာ အားလုံးက အောက်ပါ schema ကို အခြေခံထားပါတယ် —

PostgreSQL အတွက် sample schema:

```prisma
model User {
  id        String   @id @default(cuid(2))
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid(2))
  title     String
  content   String?
  published Boolean
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

MongoDB အတွက် sample schema:

```prisma
model User {
  id        ObjectId @id @map("_id")
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
  @@map("users")
}

model Post {
  id        ObjectId @id @map("_id")
  title     String
  content   String?
  published Boolean
  author    User     @relation(fields: [authorId], references: [id])
  authorId  ObjectId
  createdAt DateTime @default(now())
  @@map("posts")
}
```

## Record တစ်ခု ဖန်တီးခြင်း (Create)

`.create(...)` နဲ့ record တစ်ခု ထည့်ပါတယ် — field တွေကို တိုက်ရိုက် ပေးရပြီး Prisma 8 က ထည့်လိုက်တဲ့ record ကို ပြန်ပေးပါတယ်။ ID တွေနဲ့ database default တွေလိုမျိုး generate လုပ်ထားတဲ့ တန်ဖိုးတွေပါ ပါဝင်ပါတယ်:

```ts
import { db } from "./prisma/db";

const user = await db.orm.public.User.create({
  email: "jane@prisma.io",
  name: "Jane",
});
// user.id နဲ့ user.createdAt ကို အလိုအလျောက် ဖြည့်ပေးပါတယ်
```

```ts
import { db } from "./prisma/db";

const user = await db.orm.users.create({
  email: "jane@prisma.io",
  name: "Jane",
  createdAt: new Date(),
});
// user._id ကို server က ဖြည့်ပေးပါတယ်
```

ပြန်ပေးတဲ့ record က အပြည့်အစုံပါ — ဒါကြောင့် generate လုပ်ထားတဲ့ တန်ဖိုးတွေကို ချက်ချင်း သုံးလို့ရပါတယ်:

```js
{
  id: 'cuid20000000000000000003',
  email: 'jane@prisma.io',
  name: 'Jane',
  createdAt: 2026-07-06T09:09:56.119Z
}
```

Field တချို့ပဲ ပြန်ယူချင်ရင် `.create(...)` ရှေ့မှာ `.select(...)` ကို ဆက်ခေါ်ပါတယ် — insert ကတော့ အတူတူပဲ၊ ပြန်လာတဲ့ ပုံစံပဲ ကျဉ်းသွားတာပါ:

```ts
const account = await db.orm.public.User
  .select("id", "email")
  .create({ email: "jane@prisma.io", name: "Jane" });
```

```js
{ id: 'cuid20000000000000000003', email: 'jane@prisma.io' }
```

Prisma 7 သုံးနေသူတွေအတွက် — `data` wrapper မရှိတော့ပါဘူး:

```diff
- const user = await prisma.user.create({ data: { email: "jane@prisma.io", name: "Jane" } });
+ const user = await db.orm.public.User.create({ email: "jane@prisma.io", name: "Jane" });
```

> **မှတ်ချက်:** MongoDB မှာ `createdAt` လိုမျိုး timestamp field တွေကို ကိုယ်တိုင် ထည့်ပေးရပါတယ်။ Contract ထဲက `@default(now())` ကို create လုပ်ချိန်မှာ သုံးပေးတာ မရသေးပါဘူး။ PostgreSQL မှာတော့ database က သူ့အလိုလို ဖြည့်ပေးပါတယ်။

## Record တစ်ခု ပြင်ဆင်ခြင်း (Update)

`.where(...)` နဲ့ record ကို ရွေးပြီး `.update(...)` ထဲမှာ ပြောင်းချင်တဲ့ field တွေ ထည့်ပါတယ် — ကိုက်ညီတဲ့ record **တစ်ခု** တည်းကိုပဲ ပြင်ပြီး အဲဒါကို ပြန်ပေးပါတယ်:

```ts
const updatedUser = await db.orm.public.User
  .where({ email: "jane@prisma.io" })
  .update({ name: "Jane Doe" });
```

```ts
const updatedUser = await db.orm.users
  .where({ email: "jane@prisma.io" })
  .update({ name: "Jane Doe" });
```

```js
{
  id: 'cuid20000000000000000003',
  email: 'jane@prisma.io',
  name: 'Jane Doe',
  createdAt: 2026-07-06T09:09:56.119Z
}
```

Filter က record တစ်ခုထက် ပိုပြီး ကိုက်ညီနိုင်ရင်တောင် `.update(...)` က record တစ်ခုပဲ ပြောင်းပါတယ်။ ကိုက်ညီသမျှ အားလုံး ပြောင်းချင်ရင်တော့ `updateAll` ဒါမှမဟုတ် `updateCount` ကို သုံးပါ (အောက်မှာ ကြည့်ပါ):

```ts
await db.orm.posts
  .where({ title: "Draft thoughts" })
  .update((p) => [p.content.set("Now filled in")]);
```

`.push(...)` နဲ့ `.pull(...)` လို array operation တွေကို စစ်ဆေးပြီးသား မဟုတ်သေးပါဘူး — မှီခိုမသုံးခင် ကိုယ့် schema ပေါ်မှာ စမ်းသပ်ကြည့်ပါ။ အသေးစိတ်ကို reference ထဲက [Field update operations](https://www.prisma.io/docs/orm/reference/orm-client#field-update-operations) မှာ ကြည့်ပါ။

## Record တစ်ခု ဖျက်ခြင်း (Delete)

`.where(...)` ပြီးတော့ `.delete()` ကို ခေါ်ပါတယ် — ကိုက်ညီတဲ့ record **တစ်ခု** တည်းကို ဖျက်ပြီး အဲဒါကို ပြန်ပေးပါတယ်:

```ts
const deletedUser = await db.orm.public.User
  .where({ email: "jane@prisma.io" })
  .delete();
```

```ts
const deletedUser = await db.orm.users
  .where({ email: "jane@prisma.io" })
  .delete();
```

ကိုက်ညီသမျှ အားလုံး ဖျက်ချင်ရင်တော့ `deleteAll` ဒါမှမဟုတ် `deleteCount` ကို သုံးပါ (အောက်မှာ ကြည့်ပါ)။

## Record တစ်ခုကို Upsert လုပ်ခြင်း

`.upsert(...)` က record ရှိပြီးသားဆိုရင် update လုပ်ပြီး — မရှိဘူးဆိုရင် create လုပ်ပါတယ်။ အကိုင်းနှစ်ခုကို သီးခြားစီ ပေးရပါတယ်:

```ts
await db.orm.public.User.upsert({
  create: { email: "eve@prisma.io", name: "Eve" },
  update: { name: "Eve Exists" },
});
```

```ts
await db.orm.users.where({ email: "eve@prisma.io" }).upsert({
  create: { email: "eve@prisma.io", name: "Eve", createdAt: new Date() },
  update: { name: "Eve Exists" },
});
```

PostgreSQL မှာ record ကို model ရဲ့ unique field တွေနဲ့ ကိုက်ညီအောင် ရှာပါတယ် (ဒီမှာဆို `email`)။ MongoDB မှာတော့ `.upsert(...)` မခေါ်ခင် `.where(...)` ထဲမှာ ရှာမယ့်အချက်ကို ထည့်ပေးရပါတယ်။

## Record အများကြီး ရေးသားခြင်း

ကိုက်ညီတဲ့ record တွေ အားလုံးကို သက်ရောက်စေချင်တဲ့အခါ `All` နဲ့ `Count` variants တွေကို သုံးပါတယ်:

```ts
// Record အများကြီး တစ်ပြိုင်နက် ထည့်ခြင်း
const newPosts = await db.orm.public.Post.createAll([
  { title: "One", content: null, published: false, authorId: user.id },
  { title: "Two", content: null, published: false, authorId: user.id },
]);

// ကိုက်ညီသမျှ အားလုံး update လုပ်ခြင်း
const updatedCount = await db.orm.public.Post
  .where({ published: false })
  .updateCount({ published: true });

// ကိုက်ညီသမျှ အားလုံး ဖျက်ခြင်း
const deletedCount = await db.orm.public.Post
  .where((p) => p.title.ilike("draft%"))
  .deleteCount();
```

`Count` variants တွေက နံပါတ် သက်သက် ပြန်ပေးပါတယ်:

```js
updatedCount: 3
deletedCount: 3
```

Bulk method တွေက MongoDB မှာလည်း အတူတူပဲ အလုပ်လုပ်ပါတယ် — collection root တွေပေါ်မှာ (`db.orm.posts`)

## Row တွေ ဒါမှမဟုတ် အရေအတွက် ပြန်ယူခြင်း

Mutation တစ်ခုစီမှာ ပုံစံ သုံးမျိုး ရှိပါတယ် — ဘာပြန်လိုချင်လဲပေါ် မူတည်ပြီး ရွေးပါ:

| Form | သက်ရောက်မှု | ပြန်ပေးသည် |
| --- | --- | --- |
| `create`, `update`, `delete` | record တစ်ခု | သက်ရောက်ခံရတဲ့ record |
| `createAll`, `updateAll`, `deleteAll` | ကိုက်ညီသမျှ အားလုံး | သက်ရောက်ခံရတဲ့ record တွေ |
| `createCount`, `updateCount`, `deleteCount` | ကိုက်ညီသမျှ အားလုံး | သက်ရောက်ခံရတဲ့ အရေအတွက် |

`Count` ပုံစံတွေက သက်ရောက်ခံရတဲ့ record တွေကို ပြန်မဖတ်တော့လို့ — batch ကြီးတွေအတွက် ပိုသင့်တော်ပါတယ်။ `All` ပုံစံတွေက record တွေကို result အနေနဲ့ ပြန်ပေးပြီး — array အနေနဲ့ `await` လုပ်ချင်လည်း ရသလို [`for await` နဲ့ stream](/docs/prisma/reading-data) လုပ်ချင်လည်း ရပါတယ်:

```ts
const publishedPosts = await db.orm.public.Post
  .where({ published: false })
  .updateAll({ published: true });
```

```js
[
  { id: 'cuid20000000000000000101', title: 'One', published: true, /* ... */ },
  { id: 'cuid20000000000000000102', title: 'Two', published: true, /* ... */ }
]
```

## အဖြစ်များတဲ့ အမှားများ

### Record တစ်ခုထက် ပိုပြီး update/delete လုပ်မိခြင်း

Unique မဟုတ်တဲ့ field ပေါ်မှာ filter လုပ်ပြီး — ကိုက်ညီသမျှ အားလုံး ပြောင်းမယ်လို့ ထင်မိတာမျိုး:

```ts
await db.orm.public.Post.where({ published: false }).update({ published: true });
```

`.update(...)` နဲ့ `.delete()` က record တစ်ခုပဲ ပြောင်းပါတယ်။ Filter က အများကြီး ကိုက်ညီနေရင်တောင် Prisma 8 က record တစ်ခုတည်းကိုပဲ update/delete လုပ်ပြီး — ကျန်တာတွေက မူလအတိုင်း ကျန်နေပါတယ်။

ကိုက်ညီသမျှ အားလုံးကို သက်ရောက်စေချင်တယ်ဆိုရင် bulk variants တွေနဲ့ ပြောပါ:

```ts
const updatedCount = await db.orm.public.Post
  .where({ published: false })
  .updateCount({ published: true });
```

ပြောင်းလိုက်တဲ့ record တွေကိုပါ ပြန်လိုချင်ရင် `updateAll` ဒါမှမဟုတ် `deleteAll` သုံးပြီး — အရေအတွက် လုံလောက်ရင် `updateCount` ဒါမှမဟုတ် `deleteCount` သုံးပါ။ Singular ပုံစံတွေက record တစ်ခုတည်းအတွက် လုံခြုံပါတယ် — ကိုယ်ထင်ထားတာထက် ပိုပြီး မပြန့်ထွက်နိုင်ပါဘူး။

### Create field တွေကို data object ထဲ ထည့်ထားခြင်း

Prisma 7 ပုံစံအတိုင်း ရေးလိုက်တာနဲ့ type-check မအောင်ပါဘူး — ဘာလို့လဲဆိုတော့ contract ထဲမှာ `data` ဆိုတဲ့ field မရှိလို့ပါ:

```diff
- await db.orm.public.User.create({ data: { email, name } });
+ await db.orm.public.User.create({ email, name });
```

ကိုယ်ပေးလိုက်တဲ့ ပုံစံက record ရဲ့ ပုံစံပါပဲ — ဒါကြောင့်လည်း return value ကို ဘာမှ ထပ်ဖြုတ်စရာ မလိုတာပါ။

### Filter မပါဘဲ update/delete လုပ်ခြင်း

Model ပေါ်မှာ `.update(...)` ဒါမှမဟုတ် `.delete()` ကို တိုက်ရိုက် ခေါ်လိုက်တာမျိုး:

```ts
await db.orm.public.User.delete();
```

Mutation နှစ်ခုလုံးက အရင်ဆုံး `.where(...)` လိုပါတယ် — types တွေက filter မပါတဲ့ call ကို ငြင်းပါတယ်။ ဒါက ရည်ရွယ်ချက်ရှိရှိ လုပ်ထားတာပါ — "record တစ်ခု ဖျက်လိုက်စမ်း၊ ဘယ်ဟာ ဖြစ်ဖြစ်" ဆိုတာမျိုး မတော်တဆ ဖြစ်ဖို့ မရနိုင်အောင်ပါ။ တကယ်လို့ record တွေ အကုန် ဖျက်ချင်တယ်ဆိုရင် အဲဒါကို ဖော်ပြတဲ့ filter ရေးပြီး `deleteAll` သုံးပါ။

### ဆက်စပ်တဲ့ write တွေကို တစ်ခုပြီးတစ်ခု သီးခြား run လုပ်ခြင်း

User တစ်ယောက် ဖန်တီးပြီး — သူ့ရဲ့ ပထမဆုံး post ကို နောက် await တစ်ခုနဲ့ ဖန်တီးလိုက်တာမျိုး:

```ts
const user = await db.orm.public.User.create({ email, name });
const post = await db.orm.public.Post.create({ title, published: false, authorId: user.id });
```

ဒုတိယ write မအောင်ရင် — ပထမ write က commit ဖြစ်ပြီးသွားပြီမို့ လုပ်ငန်းစဉ် တစ်ဝက်ပဲ ပြီးနေပါတော့တယ်။ Write တွေ အတူတူ အောင်ရမယ်ဆိုရင် — [transaction](/docs/prisma/transactions) ထဲမှာ run ပါ: callback တစ်ခု၊ commit တစ်ကြိမ်၊ rollback တစ်ကြိမ်။

### Transaction ဆီ query array ပေးပို့ခြင်း

Prisma 7 က `$transaction([query1, query2])` ကို ထောက်ပံ့ပါတယ်။ Prisma 8 မှာ မရှိပါဘူး — `$transaction` လည်း မရှိ၊ array ထဲမှာ query တွေ စီတန်းထည့်လို့လည်း မရပါဘူး။ Call တွေကို `db.transaction(...)` callback တစ်ခုထဲ ထည့်ပါ — [Transactions page](/docs/prisma/transactions) မှာ ပုံစံကို ပြထားပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ပေါ်က အကြောင်းအရာ အားလုံးကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး User တစ်ယောက် ဖန်တီးပြီး id နဲ့ email ပဲ ပြန်ပေးတဲ့ signup function တစ်ခု ရေးပေးပါ။"
- "Email နဲ့ user ကို create လုပ်မယ်၊ ရှိပြီးသားဆိုရင် name ကို update လုပ်မယ့် upsert တစ်ခု ရေးပေးပါ။"
- "ဒီ cleanup script က ရက် 30 ကျော် ဟောင်းနေတဲ့ draft တွေ အကုန် ဖျက်ရမယ်။ Bulk delete variant သုံးပြီး ဖျက်လိုက်တဲ့ record အရေအတွက်ကို log တင်ပေးပါ။"
- "ကျွန်တော့် mutation တွေကို ပြန်စစ်ပေးပါ — .update() နေရာမှာ updateAll ဒါမှမဟုတ် updateCount သုံးသင့်တဲ့ နေရာတွေ ရှာပေးပါ။"

## နောက်တစ်ဆင့်

- [Write အများကြီးကို atomic run လုပ်ခြင်း](/docs/prisma/transactions) — `db.transaction(...)` နဲ့။
- [ဒေတာ ဖတ်ခြင်း](/docs/prisma/reading-data) — model တွေကနေ filter, sort, paginate, select လုပ်နည်း။
- [SQL builder သုံးခြင်း](/docs/prisma/advanced-queries) — `RETURNING` clause ပါတဲ့ insert/update တွေအတွက်။
