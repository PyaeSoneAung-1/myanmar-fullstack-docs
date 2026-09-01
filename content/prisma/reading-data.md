---
title: "ဒေတာ ဖတ်ခြင်း (Reading data)"
description: "Prisma 8 နဲ့ record တွေ ဖတ်နည်း — .where() နဲ့ filter၊ .select() နဲ့ field ရွေး၊ .orderBy()/.take()/.skip() နဲ့ စဉ်ခြင်းနဲ့ page ခွဲခြင်း၊ .all()/.first() နဲ့ stream လုပ်ခြင်း"
order: 7
source: "https://www.prisma.io/docs/orm/prisma-client/queries/reading-data"
status: translated
updated: 2026-09-01
---

ဒီ page က Prisma 8 နဲ့ ဒေတာဖတ်နည်းကို ပြပါတယ် — record **အများကြီး ဒါမှမဟုတ် တစ်ခု** ဖတ်ခြင်း၊ **filter** လုပ်ခြင်း၊ **field ရွေးယူခြင်း**၊ **စဉ်ခြင်းနဲ့ page ခွဲခြင်း**၊ **အရေအတွက် ရေခြင်း**၊ နဲ့ ရလဒ်ကြီးတွေကို **stream** လုပ်ခြင်း စသဖြင့်ပါ။

Query တိုင်းက model ပေါ်မှာ method တွေကို ဆက်တွဲပြီး — `.all()` ဒါမှမဟုတ် `.first()` လို့ ခေါ်လိုက်မှ စတင် run ပါတယ်:

```ts
import { db } from "./prisma/db";

// Published ဖြစ်တဲ့ post တွေ အားလုံး
const posts = await db.orm.public.Post.where({ published: true }).all();

// User တစ်ယောက်၊ ဒါမှမဟုတ် null
const user = await db.orm.public.User.where({ email: "alice@prisma.io" }).first();
```

```ts
import { db } from "./prisma/db";

// Published ဖြစ်တဲ့ post တွေ အားလုံး
const posts = await db.orm.posts.where({ published: true }).all();

// User တစ်ယောက်၊ ဒါမှမဟုတ် null
const user = await db.orm.users.where({ email: "alice@prisma.io" }).first();
```

ရလဒ်တိုင်းက contract နဲ့အညီ type လုပ်ထားပါတယ်။ PostgreSQL မှာ model တွေကို schema namespace နဲ့ ခေါ်ပြီး (`db.orm.public.User` — `public` က default PostgreSQL schema ပါ) — MongoDB မှာတော့ collection name နဲ့ ခေါ်ပါတယ် (`db.orm.users`)

Prisma 7 သုံးနေသူတွေအတွက် — `findMany` နဲ့ `findFirst` / `findUnique` က terminal call နှစ်ခုဖြစ်တဲ့ `.all()` နဲ့ `.first()` ပေါ်ကို တိုက်ရိုက် မြေပုံဆွဲလို့ရပါတယ်:

```diff
- const posts = await prisma.post.findMany({ where: { published: true } });
+ const posts = await db.orm.public.Post.where({ published: true }).all();

- const user = await prisma.user.findUnique({ where: { email } });
+ const user = await db.orm.public.User.where({ email }).first();
```

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

## Record အများကြီး ဒါမှမဟုတ် တစ်ခု ဖတ်ခြင်း

ကိုက်ညီတဲ့ record တွေ အားလုံး လိုချင်ရင် `.all()` ကို သုံးပါတယ် — array အနေနဲ့ ပြန်ပေးပါတယ်:

```ts
const users = await db.orm.public.User.all();
```

```js
[
  { id: 'cuid20000000000000000001', email: 'alice@prisma.io', name: 'Alice', createdAt: 2026-07-06T09:03:13.808Z },
  { id: 'cuid20000000000000000002', email: 'bob@prisma.io', name: 'Bob', createdAt: 2026-07-06T09:03:14.112Z }
]
```

`.all()` က ကိုယ်ပိုင် limit မရှိပါဘူး — ဒါကြောင့် ကြီးထွားလာနိုင်တဲ့ table တွေမှာ `take` နဲ့ တွဲသုံးပါ (အောက်မှာ ကြည့်ပါ)။

Record တစ်ခုတည်း လိုချင်ရင် `.first()` ကို သုံးပါတယ် — record ကို ပြန်ပေးပြီး ဘာမှ မကိုက်ညီရင် `null` ပြန်ပေးပါတယ်။ PostgreSQL ပေါ်မှာတော့ row တစ်ကြောင်းထက် ပိုပြီး မယူပါဘူး:

```ts
const user = await db.orm.public.User.where({ email: "alice@prisma.io" }).first();
```

```js
{ id: 'cuid20000000000000000001', email: 'alice@prisma.io', name: 'Alice', createdAt: 2026-07-06T09:03:13.808Z }
```

Primary key နဲ့ ရှာချင်ရင် — PostgreSQL မှာ key ကို တိုက်ရိုက် ပေးလိုက်ရုံပါပဲ၊ MongoDB မှာတော့ `_id` ပေါ်မှာ filter လုပ်ပါတယ်:

```ts
const user = await db.orm.public.User.first({ id: userId });
```

```ts
const user = await db.orm.users.where({ _id: id }).first();
```

## Record တွေ Filter လုပ်ခြင်း

Query ကို ကျဉ်းအောင် `.where(...)` ကို သုံးပါတယ် — equality နဲ့ ကိုက်ညီအောင် object တစ်ခု ပေးရပါတယ်:

```ts
const drafts = await db.orm.public.Post.where({ published: false }).all();
```

`.where(...)` ကို ဆက်တိုက် ခေါ်ရင် condition တွေက AND နဲ့ ပေါင်းပါတယ် — range (အပိုင်းအခြား) ဖော်ပြတဲ့နည်းလည်း ဒါပါပဲ:

```ts
const recentPosts = await db.orm.public.Post
  .where((p) => p.createdAt.gte(start))
  .where((p) => p.createdAt.lte(end))
  .all();
```

### PostgreSQL ပေါ်က Filter Operator တွေ

PostgreSQL ပေါ်မှာ `.where(...)` က lambda ကိုလည်း လက်ခံပြီး — အပေါ်က range ဥပမာလိုမျိုး ပိုကြွယ်ဝတဲ့ comparison တွေ ရေးလို့ရပါတယ်။ Field proxy က `.eq`, `.neq`, `.lt`, `.lte`, `.gt`, `.gte`, `.like`, `.ilike`, `.in([...])`, `.isNull()`, `.isNotNull()` တွေကို ထောက်ပံ့ပါတယ်:

```ts
// Case-sensitive မဟုတ်တဲ့ text ရှာဖွေခြင်း
const matchingPosts = await db.orm.public.Post
  .where((p) => p.title.ilike("%prisma%"))
  .all();

// တန်ဖိုးတွေထဲက တစ်ခုနဲ့ ကိုက်ညီခြင်း
const team = await db.orm.public.User
  .where((u) => u.email.in(["alice@prisma.io", "bob@prisma.io"]))
  .all();
```

OR ဒါမှမဟုတ် NOT နဲ့ ပေါင်းစပ်ချင်ရင် `or`, `and`, `not` helper တွေကို သုံးပါတယ် — လက်ရှိမှာ `@prisma/orm-postgres/orm-client` ကနေ export လုပ်ထားပါတယ်:

```ts
import { or } from "@prisma/orm-postgres/orm-client";

const highlighted = await db.orm.public.Post
  .where((p) => or(p.title.ilike("%hello%"), p.title.ilike("%prisma%")))
  .all();
```

### MongoDB ပေါ်က Filter Operator တွေ

MongoDB ပေါ်မှာ `.where(...)` က lambda မယူပါဘူး — object form ကို လက်ခံပြီး comparison နဲ့ boolean logic အတွက် `@prisma/orm-mongo/query-ast/execution` ကန့် lower-level `MongoFieldFilter` expression တွေကိုလည်း သုံးလို့ရပါတယ်။ အသေးစိတ်ကို reference ထဲက [Filter conditions and operators](https://www.prisma.io/docs/orm/reference/orm-client#filter-conditions-and-operators) မှာ ကြည့်ပါ။ Lambda-style operator set လိုချင်ရင် တစ်ဆင့်နိမ့်တဲ့ [pipeline builder](/docs/prisma/advanced-queries) ကို သွားပါ — အဲဒီမှာ `.match(...)` က အလားတူ filter တွေကို လွှမ်းခြုံပေးပါတယ်:

```ts
// Object form: equality filter တွေ
const drafts = await db.orm.posts.where({ published: false }).all();

// Pipeline builder: range တွေနဲ့ ပိုကြွယ်ဝတဲ့ operator တွေ
const runtime = await db.runtime();
const plan = db.query
  .from("posts")
  .match((f) => f.createdAt.gte(new Date("2026-06-01")))
  .match((f) => f.createdAt.lte(new Date("2026-07-01")))
  .build();
const junePosts = await runtime.execute(plan);
```

`.match(...)` က ဆက်တိုက် `.where(...)` ခေါ်သလိုပဲ AND-compose လုပ်ပြီး — `.in([...])` လည်း အလားတူ အလုပ်လုပ်ပါတယ်: `.match((f) => f.title.in(["Old", "New"]))` ပါ။

## Field တွေ ရွေးယူခြင်း (Select)

လိုအပ်တဲ့ field တွေပဲ ယူချင်ရင် `.select(...)` ကို သုံးပါတယ် — ရလဒ်ရဲ့ type ကလည်း အဲဒီအတိုင်း ကျဉ်းသွားပါတယ်:

```ts
const users = await db.orm.public.User.select("id", "email").all();
```

```ts
const users = await db.orm.users.select("_id", "email").all();
```

```js
[
  { id: 'cuid20000000000000000001', email: 'alice@prisma.io' },
  { id: 'cuid20000000000000000002', email: 'bob@prisma.io' }
]
```

## စဉ်ခြင်းနဲ့ Page ခွဲခြင်း (Sort and paginate)

စဉ်ဖို့ `.orderBy(...)`၊ ကန့်သတ်ဖို့ `.take(n)`၊ offset ချန်ဖို့ `.skip(n)` ကို သုံးပါတယ်။ PostgreSQL မှာ field ပေါ်က `.asc()` ဒါမှမဟုတ် `.desc()` ကို ခေါ်တဲ့ lambda နဲ့ စဉ်ပြီး — MongoDB မှာတော့ driver ရဲ့ direction value တွေ (`1` = ascending, `-1` = descending) နဲ့ စဉ်ပါတယ်:

```ts
// Post တွေရဲ့ ဒုတိယ page — အသစ်ဆုံးက ရှေ့ဆုံး
const page = await db.orm.public.Post
  .orderBy((p) => p.createdAt.desc())
  .take(20)
  .skip(20)
  .all();
```

```ts
// Post တွေရဲ့ ဒုတိယ page — အသစ်ဆုံးက ရှေ့ဆုံး
const page = await db.orm.posts
  .orderBy({ createdAt: -1 })
  .take(20)
  .skip(20)
  .all();
```

PostgreSQL မှာ ပေါင်းစပ် sort လုပ်ချင်ရင် lambda array ကို ပေးပါတယ် — ပထမ field နဲ့ စဉ်ပြီး၊ ဒုတိယ field က tiebreaker အနေနဲ့ ပါဝင်ပါတယ်:

```ts
const posts = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .all();
```

Offset pagination (`.skip`) က page တိုင်းမှာ ကျော်လိုက်တဲ့ row တွေကို ပြန်ရေတွက်ရလို့ — ဖတ်သူ နက်လာလေ နှေးလေပါ။ PostgreSQL ပေါ်က ကြီးမားတဲ့ table တွေမှာ တည်ငြိမ်တဲ့ pagination အတွက်တော့ `.orderBy(...)` နောက်မှာ `.cursor(...)` ကို ဆက်ခေါ်ပြီး နောက်ဆုံး ပြန်ပေးခဲ့တဲ့ record ကနေ ပြန်စပါတယ်။

Sort ရော cursor ရော နှစ်ခုလုံးမှာ `id` tiebreaker ကို ထည့်ထားပါ — `createdAt` က unique မဟုတ်လို့ non-unique field တစ်ခုတည်းပေါ်က cursor က boundary value ကို မျှဝေထားတဲ့ record တွေကို ကျော်သွား ဒါမှမဟုတ် ထပ်ယူသွားနိုင်ပါတယ်။ Composite cursor နဲ့ဆိုရင် timestamp တွေ တူနေတဲ့အခါတောင် page တွေ ထပ်မနေပါဘူး:

```ts
const page1 = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .take(20)
  .all();

const last = page1[page1.length - 1]!;
const page2 = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .cursor({ createdAt: last.createdAt, id: last.id })
  .take(20)
  .all();
```

## Record အရေအတွက် ရေခြင်း

PostgreSQL ပေါ်မှာ `.aggregate(...)` နဲ့ ရေတွက်ပါတယ် — ကိုယ်နာမည်ပေးလိုက်တဲ့ key တွေပါတဲ့ object ကို ပြန်ပေးပါတယ်:

```ts
const result = await db.orm.public.Post
  .where({ published: true })
  .aggregate((a) => ({ total: a.count() }));
```

```js
{ total: 2 }
```

Query chain ပေါ်မှာ `.count()` method မရှိပါဘူး။ MongoDB ပေါ်မှာတော့ [pipeline builder](/docs/prisma/advanced-queries) ထဲက `$group` stage နဲ့ ရေတွက်ပါတယ်။

## ရလဒ်ကြီးတွေကို Stream လုပ်ခြင်း

Streaming ဆိုတာ — database ကနေ record တွေ ရောက်လာတာနဲ့ အမျှ တစ်ခုချင်းစီ လုပ်ဆောင်တာပါ။ ရလဒ် တစ်ခုလုံး ပြည့်အောင် စောင့်ပြီး memory ထဲ ထည့်ထားစရာ မလိုပါဘူး။ Row သန်းချီ ပြန်ပေးနိုင်တဲ့ query တစ်ခုအတွက်ဆို — memory ကို တည်ငြိမ်ပြီး နည်းနည်းပဲ သုံးတာနဲ့ table တစ်ခုလုံးကို buffer လုပ်ထားတာနဲ့ ခြားနားချက် ကြီးပါတယ်။ နောက်ပြီး နောက်ဆုံး record မရောက်ခင်ကတည်းက ပထမ record ပေါ်မှာ စလုပ်လို့လည်း ရပါတယ်။

Prisma 8 က ဒါကို read တိုင်းထဲမှာ ထည့်ပေးထားပါတယ် — query result က promise တစ်ခုလည်း ဖြစ်၊ async iterator တစ်ခုလည်း ဖြစ်လို့ ဘယ်လို consume လုပ်မယ်ဆိုတာ ကိုယ်ရွေးလို့ရပါတယ်။

`await` က query ကို run ပြီး record တိုင်းကို array ထဲ buffer လုပ်ပါတယ်။ ဒါက ပုံမှန် အကောင်းဆုံး option ပါ — ရလဒ် တစ်ခုလုံး memory ထဲမှာ ရှိနေလို့ array ကို ကြိုက်သလောက် ခဏခဏ ဖတ်လို့ရပါတယ်:

```ts
const posts = await db.orm.public.Post.all();

console.log(posts.length);
console.log(posts[0]);
```

`for await` ကတော့ ရလဒ်ကို stream လုပ်ပါတယ် — record တွေကို buffer မလုပ်ဘဲ loop ဆီ တစ်ခုချင်းစီ ပေးပါတယ်။ ရလဒ်က memory ထဲ ထည့်ဖို့ ကြီးလွန်းတဲ့အခါ ဒါမှမဟုတ် နောက်ဆုံး record မရောက်ခင် စပြီး လုပ်ချင်တဲ့အခါမျိုးမှာ သုံးပါ:

```ts
for await (const post of db.orm.public.Post.all()) {
  await exportToSearchIndex(post);
}
```

Loop ကနေ စောစော ထွက်လို့လည်း ရပါတယ် — မလုပ်ရသေးတဲ့ record တွေကို buffer မလုပ်ပါဘူး:

```ts
for await (const post of db.orm.public.Post.all()) {
  if (isMatch(post)) break;
}
```

### Stream လုပ်ထားတဲ့ ရလဒ်ကို တစ်ကြိမ်ပဲ ဖတ်လို့ရတယ်

Streaming က record တစ်ခုချင်းစီကို loop ဆီ ပေးပြီး လွှတ်လိုက်ပါတယ် — ဘာမှ သိမ်းမထားပါဘူး။ ဒါကြောင့် `for await` loop က ရလဒ်တစ်ခုကို ထိပြီးတာနဲ့ — loop က စောစော ထွက်သွားရင်တောင် — အဲဒီ ရလဒ်က ပြီးဆုံးသွားပါပြီ။ အဲဒါကို နောက်တစ်ခါ ပြန် iterate လုပ်ရင် ဒါမှမဟုတ် နောက်မှ `await` လုပ်ရင် — result ကို သုံးပြီးသွားပြီဆိုတဲ့ error တက်ပါတယ်:

```ts
const result = db.orm.public.Post.all();

for await (const post of result) {
  // ...
}

await result;
```

```text
Error: AsyncIterableResult iterator has already been consumed via for-await loop.
Each AsyncIterableResult can only be iterated once.
```

ဒီ error မှာ `RUNTIME.ITERATOR_CONSUMED` ဆိုတဲ့ code ပါပါတယ်။

ဒေတာကို တစ်ခါထက် ပိုသုံးချင်ရင် — query ကို `await` လုပ်ပြီး array ထဲ သိမ်းကာ အဲဒီ array ကို ပြန်သုံးပါ:

```ts
const posts = await db.orm.public.Post.all();

const published = posts.filter((p) => p.published);
const titles = posts.map((p) => p.title);
```

Streaming က PostgreSQL ရော MongoDB ရော နှစ်ခုလုံးမှာ အတူတူပါပဲ။

## အဖြစ်များတဲ့ အမှားများ

### Record တစ်ခုအတွက် အကုန်လုံး ယူမိခြင်း

Record တစ်ခုတည်း လိုချင်တာနဲ့ — query လုပ်ပြီး ပထမဆုံး element ကို ယူလိုက်တာမျိုး:

```ts
const users = await db.orm.public.User.where({ email }).all();
const user = users[0];
```

ဒါက ကိုက်ညီတဲ့ record တွေ အကုန် ယူပြီး ကျန်တာတွေကို လွှင့်ပစ်တာပါ။ အဲဒီအစား `.first()` ကို သုံးပါ — record တစ်ခု ဒါမှမဟုတ် `null` ပြန်ပေးပြီး PostgreSQL မှာဆို database ကို row တစ်ကြောင်းထက် ပိုမယူခိုင်းပါဘူး:

```ts
const user = await db.orm.public.User.where({ email }).first();
```

### `.all()` မှာ limit မရှိဘူးဆိုတာ မေ့နေခြင်း

`.all()` က ကိုက်ညီသမျှ အားလုံးကို ပြန်ပေးပါတယ်။ ကြီးထွားနေတဲ့ table တစ်ခုမှာဆို — မနေ့က မြန်တဲ့ query က ဒီနေ့ နှေးတဲ့ query ဖြစ်သွားပါတယ်။ Record တွေ အကုန် တကယ်မလိုအပ်ရင် `.take(n)` ထည့်ပါ — ဒါမှမဟုတ် အကုန် လိုတယ်ဆိုရင် အပေါ်က streaming နည်းကို သုံးပါ။

### Streamed result ကို ပြန်သုံးခြင်း

`for await` နဲ့ result တစ်ခုကို stream လုပ်ပြီး — နောက်တစ်ခါ ပြန်ဖတ်ကြည့်တာမျိုးပါ။ ဒုတိယအကြိမ် ဖတ်တာက error တက်ပါတယ် — ဘာလို့လဲဆိုတော့ streamed result က ဖတ်လိုက်တာနဲ့ ကုန်သွားလို့ပါ။ နှစ်ခါ လိုအပ်ရင် ဒေတာကို သိမ်းထားပါ:

```ts
const posts = await db.orm.public.Post.all();
// posts က သာမန် array တစ်ခုပါ — ကြိုက်သလောက် ခဏခဏ ဖတ်လို့ရတယ်
```

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ပေါ်က အကြောင်းအရာ အားလုံးကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး အသစ်ဆုံး published post 20 ခုကို ပြန်ပေးတဲ့ query တစ်ခု ရေးပေးပါ။"
- "Post query မှာ field-proxy operator တွေသုံးပြီး case-insensitive title ရှာဖွေမှု ထည့်ပေးပါ။"
- "ဒီ offset pagination ကို .cursor() API သုံးတဲ့ cursor pagination အဖြစ် ပြောင်းပေးပါ။"
- "ဒီ export က table အကြီးကြီးကို loop ပတ်နေတယ်။ buffer လုပ်မယ့်အစား for await နဲ့ stream လုပ်အောင် ပြန်ရေးပေးပါ။"

## နောက်တစ်ဆင့်

- [ဒေတာ ရေးသားခြင်း](/docs/prisma/writing-data) — record တွေ create, update, delete, upsert လုပ်နည်း။
- [ဆက်စပ်တဲ့ record တွေ ဖတ်ခြင်း](/docs/prisma/relations-and-joins) — `.include(...)` နဲ့ query တစ်ခုထဲမှာ တွဲဖတ်နည်း။
- [အဆင့်မြင့် query များ](/docs/prisma/advanced-queries) — SQL query builder ဒါမှမဟုတ် MongoDB pipeline လိုအပ်တဲ့အခါ သုံးပါ။
