---
title: "Relations နဲ့ Joins"
description: "Prisma 8 နဲ့ .include() သုံးပြီး query တစ်ခုထဲမှာ ဆက်စပ်တဲ့ record တွေ တွဲဖတ်နည်း — one-to-one, one-to-many, many-to-many relation တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ"
order: 9
source: "https://www.prisma.io/docs/orm/prisma-client/queries/relations-and-joins"
status: translated
updated: 2026-09-01
---

Query တစ်ခုထဲမှာ ဆက်စပ်တဲ့ record တွေကိုပါ ပါအောင် `.include(...)` ထည့်ပါတယ် — ဆက်စပ်တဲ့ record တွေက parent ပေါ်မှာ ထည့်ထားသလို nested အနေနဲ့ ပြန်လာပြီး type လည်း လိုက်ဖက်အောင် လုပ်ထားပါတယ်:

```ts
import { db } from "./prisma/db";

const posts = await db.orm.public.Post
  .where({ published: true })
  .include("author")
  .all();
// posts[0].author က User record အပြည့်အစုံပါ
```

```ts
import { db } from "./prisma/db";

const posts = await db.orm.posts
  .where({ published: true })
  .include("author")
  .all();
// posts[0].author က ညွှန်းထားတဲ့ user document ပါ
```

`.include(...)` ထဲက relation name က — contract ထဲက field name ဖြစ်ပြီး table name မဟုတ်ပါဘူး။ Caller က ဆက်စပ်တဲ့ ဒေတာကို တစ်ခါတည်း လိုချင်တဲ့အခါ `.include(...)` သုံးပြီး — record ပေါ်က foreign key နဲ့ လုံလောက်တဲ့အခါ ချန်လိုက်ပါ။

ဒီ page က relation ပုံစံ သုံးမျိုးလုံးကို — data model ကနေ query နဲ့ ရလဒ်အထိ လျှောက်ပြပါတယ်။ Relational data ကို ဘယ်လို model လုပ်ထားလဲ သိပြီးသားဆိုရင် — အောက်က **relation data နဲ့ parent record တွေ filter လုပ်ခြင်း** ဒါမှမဟုတ် **လက်ရှိ ကန့်သတ်ချက်များ** ဆီ တိုက်ရိုက် သွားနိုင်ပါတယ်။

## One-to-one (တစ်ခုနဲ့တစ်ခု)

Record တစ်ခုက အခြား record တစ်ခုနဲ့ အများဆုံး တစ်ခုပဲ ချိတ်ဆက်ထားတာပါ — ဥပမာ profile တိုင်းက user အတိအကျ တစ်ယောက်နဲ့ပဲ ဆိုင်ပါတယ်။

Foreign key ကိုင်ထားတဲ့ model က relation ကို ကြေညာပြီး — foreign key ပေါ်က `@unique` ကမှ ဒါကို one-to-one ဖြစ်စေပါတယ်:

```prisma
model Profile {
  id     String @id @default(cuid(2))
  bio    String
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

Profile တစ်ခုကို သူ့ user နဲ့တကွ ဖတ်ဖို့ — profile ကနေ စပြီး relation ကို include လုပ်ပါ:

```ts
const profileWithUser = await db.orm.public.Profile
  .where({ userId: user.id })
  .include("user")
  .first();
// { id, bio, userId, user: { id, email, name, createdAt } }
```

Profile မရှိရင် `.first()` က `null` ပြန်ပေးပါတယ် — ဒါကြောင့် user တစ်ယောက်မှာ profile မရှိတာက error မဟုတ်ဘဲ `null` check တစ်ခုပဲ ဖြစ်ပါတယ်။

အခြား model ပေါ်က mirror field (`User` ပေါ်က `profile Profile?`) ကို contract ထဲမှာ မထောက်ပံ့သေးပါဘူး — ဒါကြောင့် foreign key ပိုင်ဆိုင်တဲ့ ဘက်ကနေပဲ relation ကို include လုပ်ပါ။ User တွေကနေ စပြီး profile တွေကို query တစ်ခုထဲမှာ တွဲချင်ရင် — [SQL query builder](/docs/prisma/advanced-queries) နဲ့ table နှစ်ခုကို join လုပ်ပါ:

```ts
const plan = db.sql.public.user
  .as("u")
  .innerJoin(db.sql.public.profile.as("pr"), (f, fns) => fns.eq(f.pr.userId, f.u.id))
  .select((f) => ({ email: f.u.email, bio: f.pr.bio }))
  .build();

const usersWithProfiles = await db.runtime().execute(plan);
```

```js
[ { email: 'alice@prisma.io', bio: 'Writes about typed databases.' } ]
```

## One-to-many (တစ်ခုနဲ့အများ)

Parent record တစ်ခုက child record ဘယ်နှစ်ခုနဲ့မဆို ချိတ်ဆက်နိုင်ပါတယ် — user တစ်ယောက်မှာ post အများကြီး ရှိနိုင်ပါတယ်။ ဒါက သင် အသုံးအများဆုံး relation ပါ။

Child က parent ရဲ့ id ကို သိမ်းပြီး — parent က list field တစ်ခု ကြေညာပါတယ်:

```prisma
model User {
  id    String @id @default(cuid(2))
  email String @unique
  posts Post[]
}

model Post {
  id       String @id @default(cuid(2))
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

ဘယ်ဘက်ကနေမဆို query လုပ်လို့ရပါတယ် — parent ကနေဆို child တွေက array အနေနဲ့ ရောက်လာပြီး child ကနေဆို parent က object တစ်ခုအနေနဲ့ ရောက်လာပါတယ်:

```ts
// User တစ်ယောက်ချင်းစီ သူ့ရဲ့ posts တွေနဲ့
const usersWithPosts = await db.orm.public.User.include("posts").all();
// Array<{ id, email, posts: Post[] }>

// Post တစ်ခုချင်းစီ သူ့ရဲ့ author နဲ့
const postsWithAuthors = await db.orm.public.Post.include("author").all();
// Array<{ id, title, authorId, author: User }>
```

Relation တစ်ခုချင်းစီ ဘယ်လိုပုံစံ ပြန်မယ်ဆိုတာ သတ်မှတ်ချင်ရင် ဒုတိယ argument အနေနဲ့ callback တစ်ခု ပေးပါတယ် — အထဲမှာ `.where`, `.select`, `.orderBy`, `.take` တွေကို top-level query လိုပဲ ဆက်တွဲခေါ်လို့ရပါတယ်။ ဒါက "user တစ်ယောက်ချင်းစီရဲ့ အသစ်ဆုံး post ၅ ခု" ကို query တစ်ခုထဲမှာ ယူနည်းပါ:

```ts
const usersWithRecentPosts = await db.orm.public.User
  .select("id", "email")
  .include("posts", (post) =>
    post
      .select("id", "title", "createdAt")
      .orderBy((p) => p.createdAt.desc())
      .take(5),
  )
  .take(10)
  .all();
// Array<{ id, email, posts: Array<{ id, title, createdAt }> }>
```

ဒီနေရာမှာ အဖြစ်များတဲ့ အမှားက N+1 loop ပါ — user တွေ ယူပြီး သူတို့ပေါ်မှာ `for` loop နဲ့ post တွေ ထပ်မေးတာမျိုး။ အဲဒါက user တစ်ယောက်ကို query တစ်ခုစီ run ပါတယ်။ User query ပေါ်မှာ `.include("posts")` တစ်ခါ ခေါ်ရင် — အဲဒီ ဒေတာတွေ တစ်ခုတည်းသော query တစ်ခုနဲ့ ရပါတယ်။

## Many-to-many (အများနဲ့အများ)

ဘက်နှစ်ဖက်စလုံးက record တွေက အခြားဘက်က အများကြီးနဲ့ ချိတ်ဆက်နိုင်ပါတယ် — post တစ်ခုမှာ tag အများကြီး ရှိနိုင်ပြီး tag တစ်ခုက post အများကြီးပေါ်မှာ ပါနိုင်ပါတယ်။ Table ဘယ်တစ်ခုကမှ အခြားဘက်ရဲ့ foreign key ကို ကိုင်မထားနိုင်လို့ — junction model တစ်ခုက pair တစ်ခုစီအတွက် link record တစ်ခုစီ သိမ်းပါတယ်။

Junction ကို ရှင်းရှင်းလင်းလင်း model လုပ်ပါတယ် — `PostTag` record တစ်ခုစီက post တစ်ခုကို tag တစ်ခုနဲ့ ချိတ်ပေးပါတယ်:

```prisma
model Tag {
  id    String    @id @default(cuid(2))
  name  String    @unique
  posts PostTag[]
}

model PostTag {
  id     String @id @default(cuid(2))
  postId String
  tagId  String
  post   Post   @relation(fields: [postId], references: [id])
  tag    Tag    @relation(fields: [tagId], references: [id])
}
```

Hop နှစ်ခုလုံးကို query တစ်ခုထဲမှာ ဖြတ်ဖို့ — relation callback ထဲမှာ include တစ်ခုကို ထပ်ထည့်ပါ:

```ts
const postsWithTags = await db.orm.public.Post
  .where({ published: true })
  .include("tags", (postTag) => postTag.include("tag"))
  .all();
```

```js
[
  {
    title: 'Hello Prisma 8',
    // ...
    tags: [
      { id: 'k2…', postId: 'i3…', tagId: 't1…', tag: { id: 't1…', name: 'typescript' } },
      { id: 'k3…', postId: 'i3…', tagId: 't2…', tag: { id: 't2…', name: 'databases' } }
    ]
  },
  { title: 'Typed queries', tags: [ /* one link record */ ] }
]
```

ရလဒ်ထဲမှာ junction record တွေ ပါနေပြီး — tag တစ်ခုစီက သူ့ရဲ့ link record အထဲမှာ nested ဖြစ်နေပါတယ်။ Tag name တွေကို `post.tags.map((pt) => pt.tag.name)` နဲ့ ဖတ်ပါ။

Post တစ်ခုကို tag တစ်ခုနဲ့ ချိတ်တာက junction model ပေါ်မှာ သာမန် create တစ်ခုပါပဲ:

```ts
await db.orm.public.PostTag.create({ postId: post.id, tagId: tag.id });
```

Junction record တွေ မပါတဲ့ flat ရလဒ် (post-tag pair တစ်ခုကို row တစ်ကြောင်းစီ) လိုချင်ရင် — [SQL builder နဲ့ junction table ကို ဖြတ် join လုပ်ပါ](/docs/prisma/advanced-queries)။

## Relation data နဲ့ parent record တွေ Filter လုပ်ခြင်း

PostgreSQL ပေါ်မှာ `.where(...)` က relation ထဲအထိ ရောက်ပြီး filter လုပ်နိုင်ပါတယ် — `.some(...)` က ကိုက်ညီတဲ့ child အနည်းဆုံး တစ်ခု ရှိတဲ့ parent တွေကို ကိုက်ညီစေပြီး `.none(...)` က ဘာမှ မရှိတဲ့ parent တွေ၊ `.every(...)` က child အားလုံး ကိုက်ညီရမယ်လို့ လိုအပ်ပါတယ်:

```ts
// Published post အနည်းဆုံး တစ်ခု ရှိတဲ့ user တွေ
const activeAuthors = await db.orm.public.User
  .where((u) => u.posts.some((p) => p.published.eq(true)))
  .all();

// Tag အတိအကျ တစ်ခု သယ်ဆောင်ထားတဲ့ post တွေ
const taggedPosts = await db.orm.public.Post
  .where((p) => p.tags.some((pt) => pt.tagId.eq(tag.id)))
  .all();
```

MongoDB ပေါ်မှာတော့ child collection ကို တိုက်ရိုက် query လုပ်ပါ — ဒါမှမဟုတ် `$lookup` နဲ့ `$match` ပါတဲ့ pipeline အနေနဲ့ ဖော်ပြပါ။

## PostgreSQL နဲ့ MongoDB ကွာခြားချက်များ

PostgreSQL ပေါ်မှာ Prisma 8 က included relation တွေကို joins နဲ့ ယူပါတယ်။ MongoDB ပေါ်မှာတော့ reference-style relation တွေအတွက် `$lookup` သုံးပြီး — embedded document တွေက parent ထဲမှာ ရှိပြီးသားမို့ include မလိုပါဘူး။

အပေါ်က relation ပုံစံတွေက database နှစ်ခုလုံးပေါ်က reference-style relation တွေနဲ့ သက်ဆိုင်ပါတယ်။ MongoDB ပေါ်မှာ one-to-one နဲ့ one-to-many ဒေတာကို မကြာခဏ parent document ထဲမှာ ကိုယ်တိုင် embedded လုပ်တတ်ပြီး — embedded ဒေတာက read တိုင်းမှာ အလိုအလျောက် ပါလာပါတယ်။

## လက်ရှိ ကန့်သတ်ချက်များ

- Implicit many-to-many (contract က ကိုယ့်ဘာသာ manage လုပ်တဲ့ `through` junction) နဲ့ ကြေညာထားတဲ့ relation တွေကို `.include(...)` က မထောက်ပံ့သေးပါဘူး။ Junction ကို အထက်မှာ ပြထားသလို ရှင်းရှင်းလင်းလင်း model လုပ်ရင် — အခုကတည်းက အလုပ်လုပ်ပါတယ်။
- One-to-one relation က foreign key ကိုင်တဲ့ ဘက်မှာပဲ သူ့ရဲ့ relation field ကို ကြေညာလို့ရပါတယ်။ အခြား model ပေါ်က mirror field ကို မထောက်ပံ့သေးပါဘူး။
- Include refinement callback ကို PostgreSQL ပေါ်မှာ စမ်းသပ်ထားပါတယ်။ MongoDB ပေါ်မှာတော့ သာမန် `.include("author")` ပုံစံကနေ စပြီး — joined document တွေကို ပြန်ပုံဖော်ချင်ရင် [pipeline builder](/docs/prisma/advanced-queries) သုံးပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က relation query နှစ်မျိုးလုံးနဲ့ schema ထဲက relation field တွေကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး User ဆီ unique foreign key ပါတဲ့ one-to-one Profile model တစ်ခု ထည့်ပေးပါ။"
- "prisma-8 skill ကို သုံးပြီး user တစ်ယောက်ချင်းစီရဲ့ အသစ်ဆုံး post ၅ ခုကို query တစ်ခုထဲမှာ ယူပေးပါ။"
- "Post နဲ့ Tag ကြားမှာ explicit junction model နဲ့ many-to-many ကို model လုပ်ပြီး post တစ်ခုရဲ့ tag name တွေကို ဖတ်တဲ့ nested include ရေးပေးပါ။"
- "Loop သုံးစရာ မလိုဘဲ relation predicate နဲ့ published post အနည်းဆုံး တစ်ခု ရှိတဲ့ user တွေကို ရှာပေးပါ။"

## နောက်တစ်ဆင့်

- [အဆင့်မြင့် query များ](/docs/prisma/advanced-queries) — explicit joins, flat junction traversals, `$lookup` pipelines အတွက်။
- [ဒေတာ ဖတ်ခြင်း](/docs/prisma/reading-data) — model တွေကနေ filter, sort, paginate, select လုပ်နည်း။
- [Model အများကြီးကို ဖြတ်တဲ့ write တွေ atomic run လုပ်ခြင်း](/docs/prisma/transactions) — transaction နဲ့။
