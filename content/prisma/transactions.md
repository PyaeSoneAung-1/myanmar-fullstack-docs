---
title: "Transactions"
description: "Write အများကြီးကို db.transaction() နဲ့ အတူတူ အောင်အောင် / အတူတူ ပျက်ပျက် run လုပ်နည်း — PostgreSQL ပေါ်က atomic transaction နဲ့ MongoDB driver နဲ့ multi-document transaction"
order: 11
source: "https://www.prisma.io/docs/orm/prisma-client/queries/transactions"
status: translated
updated: 2026-09-01
---

Write အများကြီးကို unit တစ်ခုအနေနဲ့ `db.transaction(...)` နဲ့ run လုပ်ပါတယ် — အားလုံး အတူတူ commit ဖြစ်ပြီး ဒါမှမဟုတ် အားလုံး အတူတူ roll back ပါ။

## Transaction ထဲမှာ Write တွေ Run လုပ်ခြင်း

Business operation တစ်ခုက write တစ်ခုထက် ပိုပြီး ဖြတ်သွားတိုင်း transaction သုံးပါ — user တစ်ယောက်ကို သူ့ရဲ့ ပထမဆုံး record တွေနဲ့ ဖန်တီးတာ၊ တန်ဖိုးတစ်ခုကို row နှစ်ခုကြား ရွှေ့တာ၊ ဒါမှမဟုတ် parent တစ်ခုကို သူ့ child တွေ ပြီးမှ ဖျက်တာမျိုးပါ။

`db.transaction(...)` ဆီ callback တစ်ခု ပေးပါတယ် — အထဲမှာ `db.orm` အစား `tx.orm` ကနေ query လုပ်ပြီး call တိုင်း transaction တစ်ခုတည်းပေါ်မှာ စီးသွားပါတယ်။ Callback ရဲ့ return value က ပြန်ထွက်လာပါတယ်:

```ts
import { db } from "./prisma/db";

const result = await db.transaction(async (tx) => {
  const user = await tx.orm.public.User.create({ email: "jane@prisma.io", name: "Jane" });
  const post = await tx.orm.public.Post.create({
    title: "Hello",
    content: null,
    published: false,
    authorId: user.id,
  });
  return { userId: user.id, postId: post.id };
});
// Record နှစ်ခုလုံး အခု ရှိနေပါပြီ
```

Write တစ်ခုတည်းအတွက် transaction မလိုပါဘူး — mutation တိုင်းက သူ့ဘာသာ atomic ဖြစ်ပြီးသားပါ။

## Error ဖြစ်ရင် Roll Back လုပ်ခြင်း

Callback က ပုံမှန် ပြန်လာရင် transaction က commit ဖြစ်ပြီး — error throw လုပ်ရင် roll back ဖြစ်ပါတယ်။ Callback ထဲက ဘာမှ error ဖြစ်ချိန်မှာ မကျန်ရစ်ပါဘူး:

```ts
try {
  await db.transaction(async (tx) => {
    await tx.orm.public.User.create({ email: "ghost@prisma.io", name: "Ghost" });
    throw new Error("boom");
  });
} catch {
  // User record က roll back ဖြစ်သွားပြီး မရှိတော့ပါဘူး
}
```

## Transaction ထဲမှာ SQL Builder သုံးခြင်း

[SQL builder](/docs/prisma/advanced-queries) plan တွေက transaction ထဲမှာ `tx.execute(...)` ကနေ run ပြီး — `tx.sql` က `db.sql` ကို mirror လုပ်ပါတယ်:

```ts
await db.transaction(async (tx) => {
  const plan = tx.sql.public.post
    .update({ published: false })
    .where((f, fns) => fns.lt(f.createdAt, cutoff))
    .build();
  await tx.execute(plan);
});
```

## MongoDB ပေါ်က Transaction များ

Prisma 8 က MongoDB transaction တွေကို မထောက်ပံ့သေးပါဘူး — MongoDB client ပေါ်မှာ `db.transaction(...)` မရှိဘဲ ORM write တစ်ခုချင်းစီက document တစ်ခုအလိုက် atomic ပါ။

ဒီနေ့ အတွက် multi-document transaction run ချင်ရင် MongoDB driver ကို တိုက်ရိုက် သုံးပါတယ် — Prisma 8 နဲ့ ကိုယ့် code ကြားမှာ `MongoClient` တစ်ခုတည်းကို မျှဝေပြီး write တွေကို driver session တစ်ခုထဲမှာ စုပါ။ MongoDB က transaction အတွက် replica set လိုပါတယ်။

```ts
import mongo from "@prisma/orm-mongo/runtime";
import { MongoClient } from "mongodb";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

export const client = new MongoClient(process.env["DATABASE_URL"]!);

export const db = mongo<Contract>({
  contractJson,
  mongoClient: client,
  dbName: "app",
});
```

```ts
import { client, db } from "./prisma/db";

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    const database = client.db("app");
    const user = await database
      .collection("users")
      .insertOne({ email: "jane@prisma.io", name: "Jane", createdAt: new Date() }, { session });
    await database.collection("posts").insertOne(
      { title: "Hello", content: null, published: false, authorId: user.insertedId, createdAt: new Date() },
      { session },
    );
  });
} finally {
  await session.endSession();
}

// Prisma 8 read တွေက commit ဖြစ်ပြီးသား ရလဒ်ကို မြင်ရပါတယ်
const jane = await db.orm.users.where({ email: "jane@prisma.io" }).first();
```

Driver ကနေ လုပ်တဲ့ write တွေက Prisma 8 query တွေ ရတဲ့ type-checking ကို ကျော်သွားလို့ — ဒီ section တွေကို သေးသေးထားပါ: atomic operation တစ်ခုကို function တစ်ခုနဲ့၊ ဝန်းကျင်မှာ ကျန်တာတွေကို Prisma 8 query တွေနဲ့ပါ။

## အဖြစ်များတဲ့ အမှားများ

### Callback ထဲမှာ Side Effect လုပ်ခြင်း

Transaction ထဲမှာ — သူနဲ့ ဆက်စပ်နေတဲ့ write ဘေးမှာ email ပို့တာ ဒါမှမဟုတ် job တစ်ခု queue လုပ်လိုက်တာမျိုး:

```ts
await db.transaction(async (tx) => {
  const user = await tx.orm.public.User.create({ email, name });
  await sendWelcomeEmail(user.email); // transaction roll back ဖြစ်ရင်တောင် run ပါတယ်
});
```

Database write တွေက roll back ဖြစ်ပြီး — email တွေက မဖြစ်ပါဘူး။ နောက် statement က error throw လုပ်ရင် record ပျောက်သွားပေမယ့် email က ပို့ပြီးသား ဖြစ်နေပါလိမ့်မယ်။

Callback ကနေ လိုအပ်တာကို ပြန်ယူပြီး — side effect ကို transaction commit ဖြစ်ပြီးမှ run ပါ:

```ts
const user = await db.transaction(async (tx) => {
  return tx.orm.public.User.create({ email, name });
});

await sendWelcomeEmail(user.email);
```

အခုဆိုရင် email က တကယ်ရှိနေတဲ့ user အတွက်ပဲ ပို့နိုင်ပါတော့တယ်။

### tx အစား db ကနေ Query လုပ်ခြင်း

Transaction တစ်ခု ဖွင့်ထားပေမယ့် callback ထဲမှာ `db.orm` နဲ့ပဲ ဆက်ရေးနေတာမျိုး:

```ts
await db.transaction(async (tx) => {
  await db.orm.public.User.create({ email, name }); // transaction ရဲ့ အပြင်မှာ
});
```

`db` ပေါ်က query တွေက ကိုယ်ပိုင် connection ပေါ်မှာ run ပြီး — ဖွင့်ထားတဲ့ transaction ရဲ့ အပြင်ဘက်မှာ ဖြစ်ပါတယ်။ ချက်ချင်း commit ဖြစ်သွားလို့ callback ရဲ့ ကျန်တာတွေနဲ့အတူ roll back မဖြစ်ပါဘူး။ Callback ထဲက query တိုင်းအတွက် `tx` handle ကို သုံးပါ — model တွေအတွက် `tx.orm`၊ SQL builder plan တွေအတွက် `tx.sql` နဲ့ `tx.execute`။

### Query Array တစ်ခု ပေးပို့ခြင်း

Prisma 7 က `$transaction([query1, query2])` ကို ထောက်ပံ့ပါတယ်။ Prisma 8 မှာ `$transaction` မရှိ၊ array ပုံစံလည်း မရှိပါဘူး — callback ကသာ အစားထိုးပါတယ်:

```diff
- const [user, post] = await prisma.$transaction([
-   prisma.user.create({ data: { email, name } }),
-   prisma.post.create({ data: { title, authorId } }),
- ]);
+ const { user, post } = await db.transaction(async (tx) => {
+   const user = await tx.orm.public.User.create({ email, name });
+   const post = await tx.orm.public.Post.create({
+     title,
+     content: null,
+     published: false,
+     authorId: user.id,
+   });
+   return { user, post };
+ });
```

Atomicity က အတူတူ ရပြီး — array ပုံစံမှာ ဘယ်တုန်းကမှ မရှိခဲ့တဲ့ အကျိုးကျေးဇူးတစ်ခုလည်း ပါပါတယ်: query တစ်ခုရဲ့ ရလဒ် (ဒီမှာဆို `user.id`) ကို transaction တစ်ခုတည်းထဲက နောက် query မှာ သုံးလို့ရပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က transactions တွေကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး ဒီ signup flow (user ဖန်တီး၊ welcome post ဖန်တီး) ကို db.transaction ထဲ ထုပ်ပြီး write နှစ်ခုလုံး အတူတူ commit ဖြစ်အောင် လုပ်ပေးပါ။"
- "ဒီ transaction callback ထဲမှာ db အစား tx သုံးထားတဲ့ query တွေ ရှိလား စစ်ပေးပါ။"
- "Email ပို့တာကို ဒီ transaction callback ကနေ ထုတ်ပြီး commit ဖြစ်ပြီးမှပဲ run ဖြစ်အောင် လုပ်ပေးပါ။"
- "ဒီ project က MongoDB ပေါ်မှာ။ MongoClient တစ်ခုတည်း မျှဝေသုံးပြီး collection နှစ်ခုကို atomic ရေးတဲ့ driver-session ပုံစံ ပြပေးပါ။"

## နောက်တစ်ဆင့်

- [ဒေတာ ရေးသားခြင်း](/docs/prisma/writing-data) — transaction ထဲမှာ စုပြီး run လုပ်တဲ့ single-record နဲ့ bulk mutations တွေ။
- [အဆင့်မြင့် query များ](/docs/prisma/advanced-queries) — SQL builder plan တွေကို transaction အပြင်/အထဲမှာ run လုပ်နည်း။
