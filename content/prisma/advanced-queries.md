---
title: "အဆင့်မြင့် Query များ (Advanced queries)"
description: "ORM API နဲ့ ဖော်ပြလို့မရတဲ့ query တွေအတွက် — PostgreSQL မှာ SQL query builder၊ MongoDB မှာ pipeline builder သုံးနည်း (joins, aggregates, RETURNING, $lookup)"
order: 10
source: "https://www.prisma.io/docs/orm/prisma-client/queries/advanced-queries"
status: translated
updated: 2026-09-01
---

ORM API နဲ့ query တစ်ခုကို ဖော်ပြလို့မရတဲ့အခါ — တစ်ဆင့် နိမ့်သွားပါ: PostgreSQL မှာ SQL query builder၊ MongoDB မှာ pipeline builder ပါ။ နှစ်ခုလုံးက contract နဲ့အညီ typed ဖြစ်နေပြီး — ဘယ်တစ်ခုကမှ raw string တွေ ရေးရတာမဟုတ်ပါဘူး။

ရွေးချယ်မှုက app တစ်ခုလုံးအတွက် တစ်ခါတည်း သတ်မှတ်စရာ မဟုတ်ဘဲ query တစ်ခုချင်းစီအတွက်ပါ။ ORM API ကို နေရာတိုင်းမှာ သုံးပြီး builder နှစ်ခုကို hot spot သုံးလေးနေရာမှာပဲ သုံးတာက — ရည်ရွယ်ထားတဲ့ ပုံစံပါပဲ။

## PostgreSQL — SQL Query Builder

SQL query builder က SQL statement တစ်ကြောင်းတည်းကို typed *plan* တစ်ခုအနေနဲ့ ဖွဲ့ပါတယ် — query ရဲ့ ဖော်ပြချက်ကို တစ်ခါ ဆောက်ပြီး runtime ကနေ execute လုပ်တာပါ။ SQL ရဲ့ ပုံစံ (joins, grouping, projections) ကို အပြည့်အဝ ထိန်းချုပ်ထားပြီး — contract နဲ့အညီ type safety အပြည့် ရှိပါတယ်။

**ဒီအခါတွေ သုံးပါ:**

- Query က SQL နဲ့ ပြောရတာ ပိုလွယ်တဲ့အခါ: condition ပါတဲ့ joins, computed columns, set-shaped ရလဒ်တွေ။
- ORM API က မပေါ်လွှမ်းတဲ့ PostgreSQL အပြုအမူ လိုအပ်တဲ့အခါ — bulk insert ပေါ်က `RETURNING` လိုမျိုး။
- Aggregation က တိကျတဲ့ ထိန်းချုပ်မှု လိုတဲ့အခါ — database ထဲမှာ aggregate နဲ့ ordering/limiting လုပ်ရတာမျိုး။
- Query က performance-sensitive ဖြစ်ပြီး ပုံစံ အတိအကျ ကိုယ်တိုင် ဆုံးဖြတ်ချင်တဲ့အခါ။

**ORM API ကို ပိုသင့်တယ်ဆိုရင်** — query က CRUD, filtered read, ဒါမှမဟုတ် relation traversal ဖြစ်နေတဲ့အခါပါ။ [ဖတ်ခြင်း](/docs/prisma/reading-data), [ရေးသားခြင်း](/docs/prisma/writing-data), [relations](/docs/prisma/relations-and-joins) pages တွေက အဲဒီ surface ကို — code ပိုနည်းနည်းနဲ့ type safety အတူတူ လွှမ်းခြုံပေးပါတယ်။

### Plan တစ်ခု ဆောက်ပြီး run လုပ်ခြင်း

`db.sql.public.<table>` နဲ့ table တစ်ခုကနေ စပြီး (table တွေက contract ရဲ့ mapped table name — snake_case storage name — တွေကို သုံးပါတယ်) clause တွေ ဆက်ပြီး `.build()` ခေါ်ပါတယ်။ Plan ကို runtime နဲ့ execute လုပ်ပါတယ်:

```ts
import { db } from "./prisma/db";

const plan = db.sql.public.post
  .select("id", "title", "authorId")
  .where((f, fns) => fns.eq(f.published, true))
  .limit(10)
  .build();

const publishedPosts = await db.runtime().execute(plan);
```

`.where(...)` callback က `(fields, fns)` ကို လက်ခံပါတယ် — `fields` မှာ column reference တွေ၊ `fns` မှာ operator တွေ (`eq`, `ne`, `gt`, `lt`, `ilike`, `and`, `count` နဲ့ extension တွေက ထည့်ပေးတဲ့ operator တွေ) ရှိပါတယ်။

### Join တွေကို တိကျစွာ ထိန်းချုပ်ခြင်း

ဘက်တစ်ခုစီကို `.as(...)` နဲ့ alias ပေးပြီး — condition မှန်သမျှနဲ့ join လုပ်ကာ ဘက်နှစ်ဖက်စလုံးက column တွေကို flat ရလဒ်တစ်ခုထဲ စုထုတ်လို့ရပါတယ်:

```ts
const plan = db.sql.public.post
  .as("p")
  .innerJoin(db.sql.public.user.as("u"), (f, fns) => fns.eq(f.p.authorId, f.u.id))
  .select((f) => ({
    postId: f.p.id,
    title: f.p.title,
    authorEmail: f.u.email,
  }))
  .where((f, fns) => fns.eq(f.p.published, true))
  .limit(10)
  .build();

const postsWithAuthors = await db.runtime().execute(plan);
// Array<{ postId, title, authorEmail }>
```

Multi-hop ဖြတ်ဖို့ join တွေ ထပ်ဆက်နိုင်ပါတယ်။ [many-to-many junction table](/docs/prisma/relations-and-joins) ကို ဖြတ်ပြီး flat post-tag list ရနည်း — pair တစ်ခုကို row တစ်ကြောင်းစီနဲ့:

```ts
const plan = db.sql.public.post_tag
  .as("pt")
  .innerJoin(db.sql.public.tag.as("t"), (f, fns) => fns.eq(f.pt.tagId, f.t.id))
  .innerJoin(db.sql.public.post.as("p"), (f, fns) => fns.eq(f.pt.postId, f.p.id))
  .select((f) => ({ postTitle: f.p.title, tagName: f.t.name }))
  .build();

const postTagPairs = await db.runtime().execute(plan);
```

```js
[
  { postTitle: 'Hello Prisma 8', tagName: 'databases' },
  { postTitle: 'Hello Prisma 8', tagName: 'typescript' },
  { postTitle: 'Typed queries', tagName: 'typescript' }
]
```

### ရလဒ်တွေ စုစည်းခြင်းနဲ့ အဆင့်သတ်မှတ်ခြင်း (Group and rank)

"Top N groups" မေးခွန်းတွေ — post အများဆုံး ရေးထားတဲ့ author တွေလိုမျိုး — ကို database ထဲမှာတင် aggregate ပေါ်မှာ ordering နဲ့ limiting လုပ်ပြီး ဖြေနိုင်ပါတယ်:

```ts
const plan = db.sql.public.post
  .select((f, fns) => ({
    authorId: f.authorId,
    posts: fns.count(),
  }))
  .groupBy((f) => f.authorId)
  .orderBy((f, fns) => fns.count(), { direction: "desc" })
  .limit(5)
  .build();

const topAuthors = await db.runtime().execute(plan);
```

```js
[
  { authorId: 'cuid20000000000000000001', posts: '2' },
  { authorId: 'cuid20000000000000000002', posts: '1' }
]
```

PostgreSQL က counts တွေကို string အနေနဲ့ ပြန်ပေးပါတယ် — `Number(row.posts)` နဲ့ ပြောင်းပါ။

### RETURNING နဲ့ ရေးသားခြင်း

SQL builder ရဲ့ write တွေက row array တစ်ခုကို လက်ခံပါတယ်။ Statement တစ်ခုတည်းကနေ ဘယ် column တွေ ပြန်လာမယ်ဆိုတာ ရွေးဖို့ `.returning(...)` ကို သုံးပါတယ်:

```ts
const plan = db.sql.public.user
  .insert([{ email: "sql@prisma.io" }])
  .returning("id", "email")
  .build();

const [insertedUser] = await db.runtime().execute(plan);
// Contract defaults — generate လုပ်ထားတဲ့ ID တွေလိုမျိုး — သက်ရောက်ပါတယ်
```

### Raw SQL Fragment များ

Prisma 8 က standalone raw SQL statement တွေကို run မပေးပါဘူး — query တိုင်းက typed builder ကို ဖြတ်သွားရပါတယ်။ Operator တွေနဲ့ ဖော်ပြလို့မရတဲ့ expression လိုအပ်ရင် — `fns.raw` နဲ့ raw fragment တစ်ခု ထည့်ပြီး `.returns(...)` နဲ့ သူ့ရဲ့ type ကို ကြေညာပါ။ ကျန်တဲ့ query က typed အတိုင်း ဆက်ရှိနေပါတယ်:

```ts
const plan = db.sql.public.user
  .select("id", "email")
  .select("upperEmail", (f, fns) => fns.raw`UPPER(${f.email})`.returns("pg/text@1"))
  .limit(10)
  .build();

const users = await db.runtime().execute(plan);
// [{ id: 'cuid20000000000000000001', email: 'alice@prisma.io', upperEmail: 'ALICE@PRISMA.IO' }, ...]
```

Interpolate လုပ်ထားတဲ့ တန်ဖိုးတွေက string splice တွေ မဟုတ်ဘဲ AST node တွေပါ — ဒါကြောင့် fragment တစ်ခုက column တွေနဲ့ တခြား typed expression တွေကို လုံခြုံစွာ ရည်ညွှန်းနိုင်ပါတယ်။ Builder နဲ့ `fns.raw` ပေါင်းတောင် လိုအပ်တဲ့ ပုံစံ မဖော်ပြနိုင်ရင် — [use case ကို share လုပ်ပါ](https://pris.ly/discord)။

## MongoDB — Pipeline Builder

Pipeline builder က typed MongoDB aggregation pipeline တစ်ခုကို ဖွဲ့ပါတယ် — `$match`, `$group`, `$sort`, `$lookup` လို stage တွေကို contract နဲ့အညီ စစ်ဆေးပြီး ဆက်တွဲသွားတာပါ။ ဒါက SQL query builder ရဲ့ MongoDB counterpart ဖြစ်ပြီး — MongoDB ပေါ်က aggregation တွေ အားလုံးရဲ့ နေရာလည်း ဖြစ်ပါတယ်။ ဘာလို့လဲဆိုတော့ ORM API မှာ MongoDB ပေါ်အတွက် `.aggregate(...)` မရှိလို့ပါ။

**ဒီအခါတွေ သုံးပါ:**

- Aggregation လိုအပ်တဲ့အခါ: key တစ်ခုစီအလိုက် counts, grouping, summaries။
- Collection တွေကြား `$lookup` နဲ့ document တွေ join လုပ်ပြီး ပြန်ပုံဖော်ချင်တဲ့အခါ။
- ORM API နဲ့ မြေပုံမဆွဲနိုင်တဲ့ MongoDB pipeline stage တွေ လိုတဲ့အခါ — multi-stage filtering နဲ့ projection လိုမျိုး။
- MongoDB ရဲ့ `.where(...)` က မလွှမ်းခြုံသေးတဲ့ operator တွေ လိုအပ်တဲ့အခါ — range ဒါမှမဟုတ် boolean logic လိုမျိုး။

**ORM API ကို ပိုသင့်တယ်ဆိုရင်** — query က document CRUD ဒါမှမဟုတ် reference-relation read ဖြစ်နေတဲ့အခါပါ။ `.include(...)` က သာမန် `$lookup` case ကို ဖုံးထားပြီးသားပါ။

### Pipeline တစ်ခု ဆောက်ပြီး run လုပ်ခြင်း

`db.query.from(...)` နဲ့ collection တစ်ခုကနေ စပြီး stage တွေ ဆက်ပြီး `.build()` ခေါ်ပါတယ်။ Plan ကို runtime ကနေ execute လုပ်ပါတယ်:

```ts
import { acc } from "@prisma/orm-mongo/query-builder";
import { db } from "./prisma/db";

const runtime = await db.runtime();

// Author တစ်ယောက်စီရဲ့ post အရေအတွက် — အများဆုံးက ရှေ့ဆုံး
const plan = db.query
  .from("posts")
  .group((f) => ({
    _id: f.authorId,
    postCount: acc.count(),
  }))
  .sort({ postCount: -1 })
  .build();

const postsByAuthor = await runtime.execute(plan);
```

```js
[
  { _id: new ObjectId('650000000000000000000001'), postCount: 3 },
  { _id: new ObjectId('650000000000000000000002'), postCount: 2 }
]
```

`acc.count()` နဲ့ `acc.max(...)` လို accumulator တွေက `@prisma/orm-mongo/query-builder` ကနေ import လုပ်ပါတယ်။

### Stage အလိုက် Filter နဲ့ Group လုပ်ခြင်း

`.group(...)` မတိုင်ခင် `.match(...)` ကို ဆက်ခေါ်ရင် subset တစ်ခုပေါ်မှာ aggregate လုပ်ပါတယ် — `WHERE` က `GROUP BY` ရှေ့မှာ ရှိသလိုပါပဲ:

```ts
const plan = db.query
  .from("posts")
  .match((f) => f.published.eq(false))
  .group((f) => ({ _id: f.authorId, draftCount: acc.count() }))
  .build();

const draftsByAuthor = await runtime.execute(plan);
```

### Collection တွေကို $lookup နဲ့ ချိတ်ဆက်ခြင်း

အခြား collection တစ်ခုနဲ့ type-checked join အတွက် `.lookup(...)` ကို သုံးပါတယ် — joined document တွေက `.as(...)` မှာ ကိုယ်ပေးလိုက်တဲ့ name အောက်မှာ ရောက်လာပါတယ်:

```ts
const plan = db.query
  .from("posts")
  .match((f) => f.published.eq(true))
  .lookup((from) =>
    from("users")
      .on((local, foreign) => ({ local: local.authorId, foreign: foreign._id }))
      .as("author"),
  )
  .build();

const postsWithAuthors = await runtime.execute(plan);
// Post တစ်ခုစီမှာ ကိုက်ညီတဲ့ user document တွေပါတဲ့ "author" array ပါလာပါတယ်
```

## မှန်ကန်တဲ့ Query API ရွေးချယ်ခြင်း

| လိုအပ်ချက် | သုံးရန် |
| --- | --- |
| CRUD, filters, relations, ရိုးရိုး aggregates | ORM API (`db.orm`) |
| Explicit join, computed projection, grouped top-N, `RETURNING` | SQL query builder (`db.sql.public.<table>`) |
| `$group`, `$lookup` နဲ့ ပြန်ပုံဖော်ခြင်း, MongoDB aggregation မှန်သမျှ | Pipeline builder (`db.query.from(...)`) |

Plan တွေက PostgreSQL မှာ `db.runtime().execute(plan)` ကနေ execute လုပ်ပြီး — MongoDB မှာ `(await db.runtime()).execute(plan)` နဲ့ လုပ်ပါတယ်။ [Transaction](/docs/prisma/transactions) ထဲမှာဆိုရင် `tx.execute(plan)` သုံးပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က builder နှစ်ခုလုံးနဲ့ ORM API ကြားက ရွေးချယ်မှုကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး post အရေအတွက်အရ top 10 author တွေကို SQL builder plan နဲ့ ရေးပေးပါ။"
- "ဒီ report က post နဲ့ author column တွေကို flat ရလဒ်တစ်ခုထဲမှာ လိုတယ်။ SQL query builder နဲ့ join ဆောက်ပေးပါ။"
- "MongoDB ပေါ်မှာ pipeline builder နဲ့ author တစ်ယောက်စီအလိုက် post တွေကို group လုပ်ပြီး count နဲ့ စဉ်ပေးပါ။"
- "ဒီ file ကို ပြန်စစ်ပြီး ဘယ် query တွေက ORM API ပေါ်မှာ နေသင့်လဲ၊ ဘယ်ဟာတွေက builder လိုလဲ ပြောပေးပါ။"

## နောက်တစ်ဆင့်

- [ဒေတာ ဖတ်ခြင်း](/docs/prisma/reading-data) — ဒီ builder တွေရဲ့ အောက်ခြေမှာ ရှိတဲ့ ORM happy path။
- [Relations နားလည်ခြင်း](/docs/prisma/relations-and-joins) — explicit join တွေ မလုပ်ခင် အရင်ဖတ်ပါ။
- [SQL builder plan တွေကို atomic run လုပ်ခြင်း](/docs/prisma/transactions) — transaction ထဲမှာ။
