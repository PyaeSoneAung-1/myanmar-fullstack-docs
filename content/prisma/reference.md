---
title: "Prisma ORM API ကိုးကားညွှန်း (API Reference)"
description: "Prisma ORM client, SQL query builder, pipeline builder, raw queries နဲ့ runtime API တွေအတွက် reference index — query ရေးနည်း သုံးမျိုးနဲ့ သက်ဆိုင်ရာ reference page တွေဆီ လမ်းညွှန်"
order: 56
source: "https://www.prisma.io/docs/orm/reference"
status: translated
updated: 2026-11-06
---

Prisma ORM client၊ SQL query builder၊ pipeline builder၊ raw queries နဲ့ runtime API တွေအတွက် reference index ပါ။

Prisma ORM မှာ query တစ်ခုရေးဖို့ typed နည်းလမ်း သုံးမျိုး ရှိပါတယ်။ Prisma ORM 7 မှာ `findMany({ where, include })` လို့ ရေးခဲ့ပေမယ့် — အခုတော့ အဲဒီ argument တစ်ခုချင်းစီက သင့်က chain လုပ်ရတဲ့ method တွေ ဖြစ်နေပါပြီ: `.where(...).include(...)`။ argument တစ်ခုချင်းစီက ဘယ် method နဲ့ ကိုက်ညီလဲဆိုတာကို [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) မှာ ဖတ်နိုင်ပါတယ်။

* **ORM client** က `db.orm` မှာ ရှိပါတယ်။ `where()`, `create()`, `include()` လိုမျိုး model method တွေ ပါပြီး PostgreSQL နဲ့ MongoDB နှစ်ခုလုံးမှာ အလုပ်လုပ်ကာ သင့် model တွေပေါ်က နေ့စဉ်သုံး read နဲ့ write တွေကို ဖုံးလွှမ်းပေးပါတယ်။
* **SQL query builder** က `db.sql` မှာ ရှိပါတယ်။ `select()`, `innerJoin()`, `groupBy()` လိုမျိုး SQL နဲ့ ကိုက်ညီတဲ့ table method တွေ ပါပြီး PostgreSQL မှာပဲ အလုပ်လုပ်ကာ သင့် `select()` တောင်းဆိုတဲ့ shape အတိုင်း ပြန်ပေးပါတယ် — သင့် model ပုံစံ ကျ object တွေ မဟုတ်ပါဘူး။
* **Pipeline builder** က `db.query` မှာ ရှိပါတယ်။ MongoDB aggregation pipeline တွေ တည်ဆောက်ပေးပြီး MongoDB မှာပဲ အလုပ်လုပ်ပါတယ်။

ဒီသုံးမျိုးနဲ့ မဖော်ပြနိုင်တဲ့ query ရှိရင်တော့ PostgreSQL မှာ raw SQL ဒါမှမဟုတ် MongoDB မှာ raw command ရေးပါ။ [Raw queries](/docs/prisma/raw-queries) မှာ ကြည့်ပါ။ Client ကို connect/disconnect လုပ်တာ၊ transaction တွေ၊ prepared statement တွေအတွက်ဆိုရင် [Transactions and runtime](https://www.prisma.io/docs/orm/reference/transactions-and-runtime) ကို ဖတ်ပါ။

## Query တစ်ခု run လုပ်ခြင်း (Running a query)

ORM client က သူ့ query တွေကို ကိုယ်တိုင် ပို့ပါတယ်: `first()`, `create()`, `update()`, `upsert()`, `delete()`, `aggregate()` တို့က ခေါ်လိုက်တဲ့ အချိန်မှာတင် query ကို ပို့ပါတယ်။ `all()`, `createAll()`, `updateAll()`, `deleteAll()` တို့ကတော့ result object တစ်ခု ပြန်ပေးပြီး အဲဒီ object ကို `await` လုပ်တဲ့အခါ ဒါမှမဟုတ် `for await` နဲ့ loop လုပ်တဲ့အခါမှ query ကို ပို့ပါတယ်။ `findMany` နေရာမှာ အစားထိုးဝင်လာတာက `all()` ပါ။

SQL query builder နဲ့ pipeline builder ကတော့ သူတို့ဘာသာ ဘာမှ မပို့ပါဘူး: `.build()` က built query တစ်ခု ပေးပါတယ်။ rows လိုချင်ရင် `runtime.query(...)` ဆီ ပေးပါ၊ rows မပြန်တဲ့ write တစ်ခုအတွက်ဆိုရင် `runtime.execute(...)` ဆီ ပေးပါ။ `runtime` ကို `db.runtime()` ကနေ တစ်ခါယူပြီး ပြန်ပြန်သုံးပါ။

### PostgreSQL

```ts
const runtime = db.runtime();
const admins = await db.orm.public.User.where((u) => u.kind.eq('admin')).all();
const plan = db.sql.public.user.select('id', 'email').where((f, fns) => fns.eq(f.kind, 'admin')).build();
const rows = await runtime.query(plan);
```

`User` က model name ဖြစ်ပြီး `user` က table name ပါ — [example schema](https://www.prisma.io/docs/orm/reference/orm-client#example-schema) မှာ `@@map("user")` နဲ့ သတ်မှတ်ထားပါတယ်။ `@@map` မပါရင် နှစ်ခုက နာမည်တူပါပဲ။ ORM client က column ပေါ်မှာ နှိုင်းယှဉ်ပါတယ် — `u.kind.eq(...)`။ SQL query builder ကတော့ `fns` ကနေ တစ်ဆင့် နှိုင်းယှဉ်ပါတယ် — `fns.eq(f.kind, ...)`။

### MongoDB

```ts
const runtime = await db.runtime();
const admins = await db.orm.users.where({ role: 'admin' }).all();
const plan = db.query.from('users').match((f) => f.role.eq('admin')).build();
const docs = await runtime.query(plan);
```

MongoDB မှာ `db.runtime()` က promise ပြန်ပေးတာမို့ `await` လုပ်ပါ။ `users` က collection name ဖြစ်ပြီး `db.orm` နဲ့ `db.query.from()` နှစ်ခုလုံးက အဲဒါကို key အဖြစ် သုံးပါတယ်။ ORM client ရဲ့ `where()` က field value တွေပါတဲ့ object တစ်ခု ယူပြီး pipeline builder ရဲ့ `match()` ကတော့ field ပေါ်မှာ နှိုင်းယှဉ်တဲ့ callback တစ်ခု ယူပါတယ် — `f.role.eq(...)`။ `query` ဆိုတဲ့ နာမည်တူ အရာနှစ်ခု ရှိပါတယ်: `db.query` က pipeline တည်ဆောက်ပြီး `runtime.query(...)` က တည်ဆောက်ပြီးသား query ကို run ပါတယ်။

- [ORM client reference](https://www.prisma.io/docs/orm/reference/orm-client): ORM client method တိုင်း၊ PostgreSQL နဲ့ MongoDB အပြုအမူတွေကို ဘေးချင်းယှဉ်ပြီး ဖော်ပြထားပါတယ်။

- [SQL query builder reference](https://www.prisma.io/docs/orm/reference/sql-query-builder): PostgreSQL ဆီမှာ typed, table-level query တွေ တည်ဆောက်ဖို့ SQL query builder method တိုင်း။

- [Pipeline builder reference](https://www.prisma.io/docs/orm/reference/pipeline-builder): MongoDB pipeline-builder stage, accumulator, expression helper နဲ့ write method တိုင်း။

- [Raw queries reference](/docs/prisma/raw-queries): typed API တွေ မဖော်ပြနိုင်တဲ့ query တွေအတွက် PostgreSQL မှာ raw SQL နဲ့ MongoDB မှာ raw command။

- [Transactions and runtime reference](https://www.prisma.io/docs/orm/reference/transactions-and-runtime): Client ကို connect/disconnect လုပ်တာ၊ transaction တွေ၊ prepared statement တွေနဲ့ execution option တွေ။

- [Migration API reference](/docs/prisma/migration-api): migration.ts တစ်ခု ခေါ်နိုင်တဲ့ method နဲ့ helper တိုင်း၊ PostgreSQL operation တိုင်း run တဲ့ SQL နဲ့ MongoDB operation တွေ အပါအဝင်။

## ဆက်စပ်ဖတ်ရန် (Related pages)

- [`Coming from Prisma ORM 7`](/docs/prisma/coming-from-prisma-orm-7): Prisma ORM 7 ရဲ့ schema attribute, command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်လဲ၊ ဘာတွေ မရနိုင်တော့ဘူးဆိုတာ။
- [`Core concepts`](/docs/prisma/core-concepts): Prisma ORM 8 က ဘယ်လို ပေါင်းစပ်အလုပ်လုပ်လဲ — contract, contract emit လုပ်တဲ့ file တွေ၊ database signature, query တွေနဲ့ migration တွေ ဆိုတဲ့ အစီအစဉ်အတိုင်း။
- [`Extensions`](/docs/prisma/extensions): Prisma ORM ထဲ ထည့်သုံးလို့ရတဲ့ package တိုင်း — database package, column type, index, query operation နဲ့ middleware တွေကို Prisma နဲ့ community အလိုက်။
- [`Overview`](/docs/prisma/data-modeling): Model တွေ၊ primary key တွေ၊ scalar field တွေနဲ့ relation တွေနဲ့ သင့် application လိုအပ်တဲ့ ဒေတာကို ဖော်ပြပါ။
- [`Prisma 7`](https://www.prisma.io/docs/orm/v7): Prisma ORM ဆိုတာ type-safe database access, migration တွေနဲ့ visual data editor ကို ပေးတဲ့ မျိုးဆက်သစ် Node.js နဲ့ TypeScript ORM ပါ။
