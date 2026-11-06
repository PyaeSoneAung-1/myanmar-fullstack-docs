---
title: "Raw query ကိုးကားညွှန်း — PostgreSQL raw SQL နဲ့ MongoDB raw command"
description: "Prisma ORM ရဲ့ raw query တွေအတွက် ကိုးကားညွှန်း — PostgreSQL raw SQL (fns.raw fragment နဲ့ db.raw.sql statement) နဲ့ MongoDB raw command တွေ၊ interpolation နဲ့ type id အသေးစိတ်"
order: 57
source: "https://www.prisma.io/docs/orm/reference/raw-queries"
status: translated
updated: 2026-11-06
---

Prisma ORM ရဲ့ raw query တွေအတွက် ကိုးကားညွှန်းပါ — PostgreSQL raw SQL နဲ့ MongoDB raw command တွေ။

Typed API တွေနဲ့ ကိုယ့်လိုအပ်တဲ့ query ကို မဖော်ပြနိုင်တဲ့အခါ raw query က ထွက်ပေါက်ပါ။ ဒါပေမယ့် ပထမဆုံး typed API တွေကို စဉ်းစားပါ — နေ့စဉ် read နဲ့ write တွေအတွက် [ORM client](https://www.prisma.io/docs/orm/reference/orm-client)၊ PostgreSQL join နဲ့ aggregate တွေအတွက် [SQL query builder](https://www.prisma.io/docs/orm/reference/sql-query-builder)၊ MongoDB aggregation အတွက် [pipeline builder](https://www.prisma.io/docs/orm/reference/pipeline-builder) ပါ။ ဒီသုံးခုထဲက ဘယ်တစ်ခုမှ ကိုယ်လိုချင်တဲ့ SQL clause ဒါမှမဟုတ် MongoDB command ဆီ မရောက်နိုင်မှသာ raw ကို ဆင်းပါ။

Raw query နှစ်မျိုး ရှိပါတယ် — **PostgreSQL raw SQL** (fragment တွေအတွက် `fns.raw` tagged template နဲ့ statement တစ်ခုလုံးအတွက် `db.raw.sql` tag) နဲ့ **MongoDB raw commands** (`db.raw.collection(...)` နဲ့ `db.query.rawCommand(...)`) ပါ။

## PostgreSQL raw SQL — SQL ကို တိုက်ရိုက်ရေးခြင်း

Raw SQL က ပုံစံ နှစ်မျိုး ရှိပါတယ်။

**Raw fragment** ဆိုတာ builder query တစ်ခုထဲ ထည့်လိုက်တဲ့ SQL အပိုင်းအစပါ။ `fns.raw` နဲ့ tagged template အနေနဲ့ ရေးပြီး `select()`, `where()`, `orderBy()`, ဒါမှမဟုတ် `update()` call ဆီ ပေးလိုက်ပါ။ ကျန်တဲ့ query က typed အတိုင်း ဆက်နေပါတယ်။

**Whole raw statement** ဆိုတာ `db.raw.sql` နဲ့ ရေးထားတဲ့ SQL statement တစ်ခုလုံးပါ။ အဲဒါက Prisma ORM 7 က `$queryRaw` နဲ့ `$executeRaw` တို့ရဲ့ နေရာကို အစားထိုးပါတယ်။ `$queryRaw` query လိုမျိုး rows ပြန်ပေးတယ်ဆိုရင် — spec က [အောက်မှာ ဖော်ပြထားတဲ့](#client-level-dbrawsql-tag) column list ဖြစ်ပြီး — `.returnsRow(spec).build()` နဲ့ အဆုံးသတ်ကာ result ကို `db.query(...)` ဆီ ပေးပါ။ မပြန်ပေးဘူးဆိုရင် (`$executeRaw` လိုမျိုးပါ) `.affectedCount().build()` နဲ့ အဆုံးသတ်ပြီး result ကို `db.execute(...)` ဆီ ပေးပါ။ Build လုပ်ထားတဲ့ query က ဘယ် SQL ပို့မလဲဆိုတာကို run မလုပ်ဘဲ ကြည့်ချင်ရင် [`db.toSql(...)`](https://www.prisma.io/docs/orm/reference/transactions-and-runtime#dbtosqlplan) ဆီ ပေးပါ။

> **သတိပေးချက် — `.returnsRow()` ပဲ value တွေကို convert လုပ်ပေးတယ်**
>
> `pg/text@1` လိုမျိုး type id က column တစ်ခုက ဘယ် JavaScript type ဖြစ်လာရမလဲဆိုတာကို Prisma ORM ကို ပြောပြပြီး — property နာမည်က `codecId` ပါ။ `.returnsRow(spec)` က `db.raw.sql` statement တစ်ခုလုံးရဲ့ column တိုင်းအတွက် type id ကို သတ်မှတ်ပေးလို့ တကယ့် JavaScript value တွေ ပြန်ရပါတယ်။ Fragment ရဲ့ `.returns(...)` ကတော့ ဘာမှ convert မလုပ်ပါဘူး — TypeScript ကို ဘယ် type မျှော်ရမလဲ ပြောပြရုံသာပါ၊ ဒါကြောင့် value က အောက်ခံ PostgreSQL driver ဖြစ်တဲ့ `pg` package ပေးတဲ့အတိုင်း ဖြစ်ပါတယ်။ `text` ဒါမှမဟုတ် `integer` column ဆိုရင် JavaScript string ဒါမှမဟုတ် number ဖြစ်ပြီးသား ဖြစ်နေမယ်၊ `numeric` column ကတော့ string အနေနဲ့ လာပါတယ်။ Date column ကို Prisma ORM က convert မလုပ်ဘူးဆိုတော့ အဲဒီ column အတွက် `pg` package ရဲ့ value အတိုင်း ရပါတယ်။

ဒီ section က ဥပမာတွေက SQL query builder page က `user` / `post` schema ပေါ်မှာ run ပါတယ်။ Model definition အပြည့်အစုံအတွက် အဲဒီ page ရဲ့ [example schema](https://www.prisma.io/docs/orm/reference/sql-query-builder#example-schema) ကို ကြည့်ပါ။ အဲဒီ page လိုပဲ client ကို `postgres(...)` နဲ့ ဖန်တီးပြီး table တွေကို `db.sql.public` ကနေ ရောက်ပါ — အဲဒါက table နာမည်နဲ့ key ဖြစ်ပါတယ် (model က `@@map` attribute နဲ့ table နာမည် ပြောင်းထားတာ မရှိရင် ရေးထားတဲ့ model နာမည် အတိအကျ)။ `db.query(...)` နဲ့ `db.execute(...)` က build လုပ်ထားတဲ့ query ကို run ပါတယ်။

```ts
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };
const db = postgres({ contract: contractFromJson<Contract>(contractJson), url: process.env.DATABASE_URL! });
const aliceId = '00000000-0000-4000-8000-000000000001';
```

### `fns.raw` — projection ထဲမှာ သုံးခြင်း

Projection ဆိုတာ `select()` list ပါ။ `select()` callback က argument နှစ်ခု လက်ခံပါတယ် — column တစ်ခုချင်းအတွက် property တစ်ခုစီပါတဲ့ `f` နဲ့ expression helper တွေပါတဲ့ `fns` ပါ။ `fns.raw` က tagged template ပါ။ SQL fragment တစ်ခု ရေးပြီး column နဲ့ value တွေကို `${...}` နဲ့ interpolate လုပ်ကာ fragment ရဲ့ result type ကို `.returns(typeId)` နဲ့ ကြေညာပါ။ လက်ခံတဲ့ ပုံစံအားလုံးအတွက် [`select()`](https://www.prisma.io/docs/orm/reference/sql-query-builder#select) ကို ကြည့်ပါ။

```ts
const plan = db.sql.public.user
  .select('id')
  .select('upperEmail', (f, fns) => fns.raw`UPPER(${f.email})`.returns('pg/text@1'))
  .where((f, fns) => fns.eq(f.id, aliceId))
  .build();
const rows = await db.query(plan);
// rows === [{ id: aliceId, upperEmail: 'ALICE@EXAMPLE.COM' }]
```

`.returns(...)` က TypeScript ကို ဘာမျှော်ရမလဲ ပြောပြရုံပါ — SQL ထဲမှာ value ကို cast မလုပ်သလို `pg` package ဖတ်ပုံကိုလည်း မပြောင်းပါဘူး။ Type id string တစ်ခု ဒါမှမဟုတ် `{ codecId, nullable }` ပုံစံ object တစ်ခု လက်ခံပါတယ်။ ကိုယ် အများဆုံး ရေးဖို့ ဖြစ်နိုင်တဲ့ type id တွေအတွက် [`param()` နဲ့ bare value ကို bind လုပ်ခြင်း](#param-နဲ့-bare-value-ကို-bind-လုပ်ခြင်း) ကို ကြည့်ပြီး — အပြည့်အစုံအတွက် SQL query builder ရဲ့ [`fns.raw` and `.returns()`](https://www.prisma.io/docs/orm/reference/sql-query-builder#fnsraw-and-returns) ကို ကြည့်ပါ။

### `fns.raw` — `where()` predicate အနေနဲ့

`where()` ရဲ့ callback က boolean expression တစ်ခု ပြန်ပေးပါတယ် — `fns.eq(...)` လိုမျိုး comparison helper တွေ ပြန်ပေးတဲ့ အတူတူပါပဲ။ `.returns('pg/bool@1')` ကြေညာထားတဲ့ raw fragment က ကိုယ်တိုင် boolean expression ဖြစ်လို့ `fns.eq(...)` နဲ့ မပတ်ဘဲ `where()` ဆီ တိုက်ရိုက် ပေးလို့ရပါတယ်။

```ts
const plan = db.sql.public.user
  .select('id', 'email')
  .where((f, fns) => fns.raw`LENGTH(${f.email}) > 15`.returns('pg/bool@1'))
  .build();
const rows = await db.query(plan);
// only users whose email is longer than 15 characters
```

### Typed expression ကို interpolate လုပ်ခြင်း

Comparison၊ column reference ဒါမှမဟုတ် အခြား raw fragment လိုမျိုး expression တစ်ခုကို interpolate လုပ်လို့ရပါတယ်။ Fragment ထဲ ရောက်သွားတာက expression ကိုယ်တိုင်ပါ၊ render လုပ်ထားတဲ့ SQL မဟုတ်လို့ type-check ဆက်ဖြစ်နေပါတယ်။ Interpolate လုပ်ထားတဲ့ value က query parameter အနေနဲ့ ပို့ခံရပြီး SQL ထဲကို ဘယ်တော့မှ ကပ်ထည့်မခံရပါဘူး။ Column ဒါမှမဟုတ် table နာမည်ကို string အနေနဲ့ interpolate လုပ်လို့ မရပါဘူး — string က parameter ဖြစ်သွားလို့ပါ။ Column ကို run time မှာ ရွေးရတဲ့အခါ ကိုယ်ထိန်းချုပ်ထားတဲ့ column စာရင်းတစ်ခုထဲကနေ ကိုယ့် code ထဲမှာပဲ ရွေးပြီး တစ်ခုချင်းစီအတွက် သက်ဆိုင်တဲ့ `fns.raw` fragment ဒါမှမဟုတ် `select()` call ကို ရွေးပါ။

```ts
const plan = db.sql.public.user
  .select('id', 'kind')
  .select('kindLabel', (f, fns) => fns.raw`CASE WHEN ${fns.eq(f.kind, 'admin')} THEN 'admin' ELSE 'regular user' END`.returns('pg/text@1'))
  .build();
const rows = await db.query(plan);
// each row's kindLabel is 'admin' or 'regular user'
```

### `param()` နဲ့ bare value ကို bind လုပ်ခြင်း

`number`, `string`, `boolean`, `bigint`, ဒါမှမဟုတ် `Uint8Array` ကို တိုက်ရိုက် interpolate လုပ်ပါ။ ကျန်တဲ့အရာတွေ — ဥပမာ အချိန်တစ်ခု ဒါမှမဟုတ် `numeric` အနေနဲ့ သိမ်းချင်တဲ့ decimal — အတွက်တော့ value ကို `param(value, { codecId })` နဲ့ ပတ်ပြီး type id ကို ကိုယ်တိုင် သတ်မှတ်ပါ။ `param` ကို `@prisma/orm-postgres/relational-core/expression` ကနေ import လုပ်ပါ။

တိုက်ရိုက် interpolate လုပ်လိုက်တဲ့ bare value က Prisma ORM က သူ့ JavaScript type ကနေ ရွေးလိုက်တဲ့ type id ကို ရပါတယ်:

| ကိုယ် interpolate လုပ်တဲ့ value | ရလာတဲ့ type id |
| --------------------------------------------------- | ------------------------------------------------- |
| `-2147483648` မှ `2147483647` အတွင်း ကိန်းပြည့် `number` တစ်ခု | `pg/int4@1` |
| ပိုကြီးတဲ့ ကိန်းပြည့် `number` — `9007199254740991` အထိ | `pg/int8number@1`၊ `number` အနေနဲ့ ပြန်ဖတ်ရပါတယ် |
| အခြား `number` အားလုံး — အပိုင်းကိန်း အပါအဝင် | `pg/float8@1` |
| `bigint` တစ်ခု | `pg/int8@1`၊ `bigint` အနေနဲ့ ပြန်ဖတ်ရပါတယ် |
| `string` တစ်ခု | `pg/text@1` |
| `boolean` တစ်ခု | `pg/bool@1` |
| `Uint8Array` တစ်ခု | `pg/bytea@1` |

Type id ဆိုတာ `pg/`၊ နာမည်တစ်ခု၊ ပြီးတော့ `@1` ပါ။ နာမည်က များသောအားဖြင့် PostgreSQL type ဖြစ်ပြီး — တချို့မှာ ဘယ် JavaScript type ရမလဲ ပြောတဲ့ suffix ပါပါတယ်။ ဥပမာ `number` အတွက် `pg/int8number@1`၊ `Date` အတွက် `pg/timestamptz-date@1` နဲ့ `Temporal.Instant` အတွက် `pg/timestamptz-temporal@1` ပါ။ ဒီနှစ်ခုထဲက ရွေးရာမှာ value က 2^53 ကျော်နိုင်ရင် `pg/int8@1` ကို ယူပါ။ နောက် ရေးဖို့ များတဲ့ သုံးခုက `pg/uuid@1`, `pg/numeric@1`, နဲ့ `pg/jsonb@1` ပါ။ အဲဒါတွေက အသုံးများတာတွေပါ၊ အားလုံးတော့ မဟုတ်ပါဘူး။ Column တစ်ခုအတွက် `db.sql.public.<table>.columns.<column>.codecId` က သူ့ id ဖြစ်ပြီး အဲဒီ id တွေပဲ `contract.json` ထဲက `storage.namespaces.<schema>.entries.table.<table>.columns.<column>.codecId` မှာ ရှိပါတယ်။ အချိန်တစ်ခုက `param()` ရှိတဲ့ အကြောင်းရင်းပါ — `pg/timestamptz-date@1` က `Date` ယူပြီး `pg/timestamptz-temporal@1` က `Temporal.Instant` ယူပါတယ်။ အဲဒါအတွက် global `Temporal` လိုပါတယ် — [Supported versions](/docs/prisma/supported-versions) မှာ ပြထားပါတယ်။

```ts
import { param } from '@prisma/orm-postgres/relational-core/expression';

const cutoff = param(new Date('2024-01-01T00:00:00Z'), { codecId: 'pg/timestamptz-date@1' });
const plan = db.sql.public.user
  .select('id', 'email')
  .where((f, fns) => fns.raw`${f.createdAt} > ${cutoff}`.returns('pg/bool@1'))
  .build();
const rows = await db.query(plan);
// users created after the start of 2024
```

### Nullable result ကို ကြေညာခြင်း

`.returns()` ရဲ့ object ပုံစံက nullable result ကို ကြေညာပါတယ်။ Fragment တစ်ခုက SQL `NULL` ဖြစ်နိုင်တဲ့အခါ — result type က `T | null` ဖြစ်အောင် — သုံးပါ။

```ts
const plan = db.sql.public.user
  .select('id')
  .select('adminName', (f, fns) => fns.raw`CASE WHEN ${fns.eq(f.kind, 'admin')} THEN ${f.displayName} END`.returns({ codecId: 'pg/text@1', nullable: true }))
  .build();
const rows = await db.query(plan);
// adminName is the displayName for admins, null for everyone else
```

### Client-level `db.raw.sql` tag

`db.raw` က client ရဲ့ raw API ပါ၊ `db.sql` နဲ့ `db.orm` ဘေးမှာပါ။ PostgreSQL မှာ `sql` ပါပြီး အဲဒါက `fns.raw` နဲ့ အတူတူ tagged template ပါ။ MongoDB မှာတော့ `collection(...)` ပါပြီး [MongoDB raw commands](#mongodb-raw-commands--command-တွေကို-တိုက်ရိုက်-run-ခြင်း) section မှာ ဖော်ပြထားပါတယ်။ `fns.raw` နဲ့ မတူဘဲ `db.raw.sql` က builder callback အပြင်မှာ အလုပ်လုပ်ပြီး statement တစ်ခုလုံးကို run လို့ရတဲ့ query အဖြစ် ပြောင်းပေးတဲ့ အပိုဆောင်း method တွေ ပါပါတယ်။

Expression တစ်ခုကို ကြိုတင် တည်ဆောက်ပြီး output column တစ်ခုချင်းစီကို နာမည်ပေးတဲ့ [`select()`](https://www.prisma.io/docs/orm/reference/sql-query-builder#select) ရဲ့ object ပုံစံဆီ ပို့ဖို့ `.returns(...)` ကို သုံးပါ:

```ts
const serverNow = db.raw.sql`now()`.returns('pg/timestamptz-date@1');
const plan = db.sql.public.user
  .select((f) => ({ id: f.id, serverNow }))
  .where((f, fns) => fns.eq(f.id, aliceId))
  .build();
const rows = await db.query(plan);
```

Statement တစ်ခုလုံးကို run ပြီး convert လုပ်ထားတဲ့ rows ပြန်ရဖို့ `.returnsRow(spec)` ကို သုံးပါ။ Spec က ပြန်လာတဲ့ row တိုင်းရဲ့ column တွေကို နာမည်ပေးပြီး entry တစ်ခုချင်းစီက ကိုယ့် contract ထဲက column တစ်ခု ဒါမှမဟုတ် type id တစ်ခု ဖြစ်ပါတယ်။ `db.sql.public.user.columns.id` လိုမျိုး column က သူ့ရဲ့ conversion၊ nullability နဲ့ TypeScript type ကို ကိုယ်တိုင် ပါလာပါတယ်။ Contract နဲ့ မကိုက်တဲ့ column အတွက် type id ရေးပါ၊ အဲဒီ column က `NULL` ဖြစ်နိုင်ရင် (`LEFT JOIN` column လိုမျိုး) `{ codecId: 'pg/text@1', nullable: true }` object ပုံစံ ရေးပါ။ ပြန်လာတဲ့ row မှာ spec က နာမည်ပေးထားတဲ့ column မပါရင် query က error throw လုပ်ပြီး `code` က `RUNTIME.RAW_ROW_COLUMN_MISSING` ဖြစ်ပါတယ်။ ကျရှုံးတဲ့ statement က `SqlQueryError` throw လုပ်ပြီး `sqlState` က အဲဒီ ကျရှုံးမှုအတွက် PostgreSQL error code ဖြစ်ပါတယ် — ဥပမာ unique-constraint ချိုးဖောက်မှုအတွက် `23505` ပါ။

```ts
const user = db.sql.public.user;
const post = db.sql.public.post;

const plan = db.raw.sql`
  SELECT u.id, u.email, count(p.id) AS "postCount"
  FROM "user" u
  LEFT JOIN "post" p ON p."userId" = u.id
  GROUP BY u.id, u.email
  ORDER BY count(p.id) DESC, u.email ASC
  LIMIT ${10}
`
  .returnsRow({ id: user.columns.id, email: user.columns.email, postCount: 'pg/int8@1' })
  .build();

const rows = await db.query(plan);
// row.email is a string; row.postCount is a bigint
```

Rows မပြန်တဲ့ statement အတွက် spec မယူတဲ့ `.affectedCount()` ကို သုံးပါ။ Build လုပ်ထားတဲ့ query ကို `db.execute(...)` ဆီ ပို့ပါ၊ အဲဒါက statement က ပြောင်းလိုက်တဲ့ row အရေအတွက် `{ affectedRows }` ကို resolve လုပ်ပါတယ်။ Build လုပ်ထားတဲ့ raw query ကို transaction ထဲမှာလည်း run လို့ရပါတယ် — [`db.transaction()`](https://www.prisma.io/docs/orm/reference/transactions-and-runtime#dbtransactioncallback) က `tx` ပေးပြီး `tx.query(...)` နဲ့ `tx.execute(...)` က `db.query(...)` နဲ့ `db.execute(...)` လိုပဲ build လုပ်ထားတဲ့ query တွေကို ယူပါတယ်။

```ts
const plan = db.raw.sql`
  UPDATE "post"
  SET priority = ${'urgent'}
  WHERE "userId" IN (SELECT id FROM "user" WHERE kind = ${'admin'})
`.affectedCount().build();

const stats = await db.execute(plan);
// stats.affectedRows
```

`.returnsRow()` query တစ်ခုကို အခြားတစ်ခုရဲ့ အတွင်းမှာ nest လုပ်လို့ရပါတယ် — subquery ဒါမှမဟုတ် `WITH` query ဖြစ်တဲ့ CTE ကို ရေးတဲ့ နည်းပါ။ `.build()` မတိုင်ခင် interpolate လုပ်ပြီး `.build()` ကို အပြင်ဘက် တစ်ခုတည်းမှာသာ ခေါ်ပါ။ သူ့ရဲ့ `.returns` property က ကြေညာထားတဲ့ column တွေကို ကိုင်ထားလို့ `outer.returnsRow({ postCount: inner.returns.postCount })` က ကြေညာချက်ကို ပြန်သုံးပါတယ်။ `.affectedCount()` နဲ့ အဆုံးသတ်တဲ့ statement ကို nest လုပ်လို့ မရပါဘူး — rows မထုတ်လို့ပါ။ `UPDATE ... RETURNING` ကို ကျတော့ nest လုပ်လို့ရပါတယ် — rows ထုတ်လို့ပါ။

> **မှတ်ချက် — နာမည် သုံးခု ဆင်တူနေတယ်**
>
> `.returns(typeId)` က fragment ပေါ်က method၊ `.returnsRow(spec)` က statement ပေါ်က method၊ ပြီးတော့ `.returns` က `.returnsRow()` ပေးတဲ့ object ပေါ်က property ပါ။

```ts
const authorsWithPosts = db.raw.sql`
  SELECT p."userId" AS "userId", count(*) AS "postCount"
  FROM "post" p
  GROUP BY p."userId"
  HAVING count(*) >= ${3}
`.returnsRow({ userId: post.columns.userId, postCount: 'pg/int8@1' });

const plan = db.raw.sql`
  WITH active AS (${authorsWithPosts})
  SELECT u.email, active."postCount"
  FROM active
  JOIN "user" u ON u.id = active."userId"
  ORDER BY active."postCount" DESC, u.email ASC
`.returnsRow({ email: user.columns.email, postCount: authorsWithPosts.returns.postCount }).build();
```

### မပံ့ပိုးတဲ့ interpolation

Interpolation က column တွေ၊ expression တွေ၊ `param(...)` value တွေ၊ rows ပြန်ပေးတဲ့ raw query တွေ နဲ့ bare type ဖြစ်တဲ့ `number`, `bigint`, `string`, `boolean`, `Uint8Array` တို့ကို လက်ခံပါတယ်။ `Date` လိုမျိုး အခြားတစ်ခုခုကို interpolate လုပ်ရင် TypeScript က compile အချိန်မှာ ငြင်းပါတယ်။ Plain JavaScript မှာတော့ tagged template က ခေါ်လိုက်တာနဲ့ throw လုပ်ပြီး error ရဲ့ `code` က `RUNTIME.RAW_SQL_UNSUPPORTED_INTERPOLATION` ဖြစ်ကာ message က ဒီလိုပါ:

```
unsupported JS value type for raw-SQL interpolation: wrap this value in `param(...)` with an explicit codec
```

စာရင်းထဲ မပါတဲ့ type ရှိတဲ့ value ကို bind လုပ်ဖို့ မှန်ကန်တဲ့ type id နဲ့အတူ [`param(value, { codecId })`](#param-နဲ့-bare-value-ကို-bind-လုပ်ခြင်း) နဲ့ ပတ်ပါ။ `Date` အတွက်ဆိုရင် `pg/timestamptz-date@1` ကို သုံးပါ။

## MongoDB raw commands — command တွေကို တိုက်ရိုက် run ခြင်း

`db.raw.collection(collectionName)` က collection တစ်ခုပေါ်မှာ MongoDB command တွေကို တိုက်ရိုက် run ဖို့ method ကိုးခုပါတဲ့ object တစ်ခု ပြန်ပေးပါတယ်။ Collection နာမည်က ကိုယ့် contract က ကြေညာထားတဲ့ နာမည်ပါ (`'users'`, `'posts'`) — ORM client သုံးတဲ့ နာမည်အတူတူပါ (`db.orm.users`)။ MongoDB မှာ schema မရှိလို့ ဒီမှာ `public` segment မရှိသလို `db.orm` မှာလည်း မရှိပါဘူး။ Raw `find()` မရှိလို့ `$match` stage နဲ့ `aggregate<Row>()` ကို သုံးပါ။ Prisma ORM မှာ MongoDB transaction မရှိလို့ raw command ကို transaction ထဲမှာ run လို့ မရပါဘူး။ [Transactions (MongoDB)](https://www.prisma.io/docs/orm/reference/transactions-and-runtime#transactions-mongodb) ကို ကြည့်ပါ။

ဒီ method ကိုးခုက command တစ်ခုကို တည်ဆောက်ပါတယ် — `.build()` ခေါ်ပြီး `runtime.query(...)` နဲ့ run ပါ၊ `runtime` ဆိုတာ `await db.runtime()` က ပြန်ပေးတာပါ။ Write တွေအတွက်လည်း အတူတူပါပဲ။ Write က element တစ်ခုပါတဲ့ array ပြန်ပေးလို့ `const [result] = ...` နဲ့ destructure လုပ်ပါ။ Update ဒါမှမဟုတ် delete command ကို `runtime.execute(...)` နဲ့လည်း run လို့ရပြီး အဲဒါက `{ affectedRows }` ကို resolve လုပ်ပါတယ်။ PostgreSQL လိုမျိုး `db.query(...)` နဲ့ command ကို run လို့ မရပါဘူး — MongoDB မှာ `db.query` က aggregation pipeline တွေ တည်ဆောက်တဲ့ [pipeline builder](https://www.prisma.io/docs/orm/reference/pipeline-builder) ဖြစ်လို့ပါ။

> **သတိပေးချက် — MongoDB raw result တွေက native BSON value တွေပါ**
>
> ဒီ page ရဲ့ MongoDB ဘက်မှာ ဘာမှ ကိုယ့်အတွက် convert မလုပ်ပေးပါဘူး။ Raw command တွေက field တွေကို database ထဲ သိမ်းထားတဲ့အတိုင်း နာမည်ပေးပါတယ် — ဒါကြောင့် `id ObjectId @id @map("_id")` လို့ ကြေညာထားလို့ ORM က `id` လို့ ခေါ်တဲ့ field က ဒီမှာ filter တွေထဲမှာရော ပြန်ရတဲ့ rows တွေထဲမှာပါ `_id` ဖြစ်ပါတယ်။ `_id` က သိမ်းထားတဲ့အတိုင်း ပြန်လာပါတယ် — MongoDB က generate လုပ်ထားတာက hex string မဟုတ်ဘဲ အောက်ခံ MongoDB driver ဖြစ်တဲ့ `mongodb` package ရဲ့ `ObjectId` instance ပါ။ `String(row._id) === aliceId` နဲ့ နှိုင်းယှဉ်ပါ။ Raw filter တွေကလည်း native BSON value တွေ ယူလို့ id တွေကို အဲဒီ package ရဲ့ `ObjectId` class နဲ့ တည်ဆောက်ပါ။ Write method တွေက count နဲ့ id တွေကို `mongodb` package ရဲ့ ကိုယ်ပိုင် key နာမည်တွေဖြစ်တဲ့ `{ insertedId }`, `{ matchedCount, modifiedCount, upsertedCount, upsertedId }`, နဲ့ `{ deletedCount }` အောက်မှာ ပေးပြီး အဲဒီ key တွေကို တိုက်ရိုက် ဖတ်ပါ။

ဒီ section က ဥပမာတွေက pipeline builder page က `users` / `posts` schema ပေါ်မှာ run ပါတယ်။ Model definition အပြည့်အစုံအတွက် အဲဒီ page ရဲ့ [example schema](https://www.prisma.io/docs/orm/reference/pipeline-builder#example-schema) ကို ကြည့်ပါ။ `mongo(...)` နဲ့ client ဖန်တီးပြီး build လုပ်ထားတဲ့ query ကို run တဲ့ connection ကို `await db.runtime()` ကနေ ယူကာ ဥပမာ id နှစ်ခုကို တစ်ခါတည်း ကြေညာပါ:

```ts
import mongo from '@prisma/orm-mongo/runtime';
import { contractFromJson } from '@prisma/orm-mongo/static';
import { ObjectId } from 'mongodb';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };
const db = mongo({ contract: contractFromJson<Contract>(contractJson), url: process.env.MONGODB_URL!, dbName: 'app' });
const runtime = await db.runtime();
const aliceId = '6539a1f2c3d4e5f60718293a';
const bobId = '6539a1f2c3d4e5f60718293b';
```

### `aggregate<Row>()`

Collection တစ်ခုပေါ်မှာ raw aggregation pipeline ကို run ပါ။ Type parameter က ပြန်လာတဲ့ row တစ်ခုချင်းစီရဲ့ ပုံသဏ္ဌာန်ကို ပြောပါတယ်။ Pipeline stage တွေက ကိုယ်ရေးထားတဲ့အတိုင်း ပို့တဲ့ raw MongoDB document တွေဖြစ်လို့ တကယ့် `ObjectId` နဲ့ `_id` ပေါ်မှာ filter လုပ်တာက ကိုက်ညီပါတယ်။

```ts
const plan = db.raw.collection('posts').aggregate<{ _id: unknown; title: string }>([{ $match: { title: 'Hello world' } }]).build();
const [row] = await runtime.query(plan);
// row.title === 'Hello world'; row._id is a raw ObjectId
```

### `insertOne()` နဲ့ `insertMany()`

Document တစ်ခု ဒါမှမဟုတ် အများကြီး insert လုပ်ပါ။ နှစ်ခုလုံးက generate လုပ်ထားတဲ့ id တွေအတွက် `ObjectId` instance တွေနဲ့အတူ `mongodb` package ရဲ့ ကိုယ်ပိုင် insert result ကို ပြန်ပေးပါတယ်။ `insertMany()` ရဲ့ `insertedIds` က document တွေ ပေးလိုက်တဲ့ အစီအစဉ်အတိုင်း `ObjectId` တွေပါတဲ့ ရိုးရိုး array ပါ။

```ts
const users = db.raw.collection('users');
const onePlan = users.insertOne({ name: 'Dave', email: 'dave@example.com', role: 'author' }).build();
const [oneResult] = await runtime.query(onePlan);
// { insertedId: <ObjectId> }

const manyPlan = users.insertMany([{ name: 'Eve', email: 'eve@example.com', role: 'author' }, { name: 'Frank', email: 'frank@example.com', role: 'author' }]).build();
const [manyResult] = await runtime.query(manyPlan);
// { insertedCount: 2, insertedIds: [<ObjectId>, <ObjectId>] }
```

### `updateOne()` နဲ့ `updateMany()`

Document တစ်ခု ဒါမှမဟုတ် ကိုက်ညီတဲ့ document အားလုံးကို update လုပ်ပါ။ ပထမ argument က raw filter document ဖြစ်ပြီး ဒုတိယက `{ $set: ... }` လိုမျိုး update document ဒါမှမဟုတ် stage တွေပါတဲ့ array ဖြစ်တဲ့ aggregation pipeline ပါ။ နှစ်ခုလုံးက `{ matchedCount, modifiedCount, upsertedCount, upsertedId }` ကို ပြန်ပေးပါတယ်။

#### Update document ပုံစံ

```ts
const plan = db.raw.collection('users').updateOne({ _id: new ObjectId(aliceId) }, { $set: { bio: 'Updated bio' } }).build();
const [result] = await runtime.query(plan);
// { matchedCount: 1, modifiedCount: 1, ... }
```

#### Pipeline ပုံစံ

Array update ဆိုတာ aggregation-pipeline update အပြည့်အစုံဖြစ်လို့ stage တစ်ခုက document ရဲ့ အခြား field တွေကို ရည်ညွှန်းလို့ရပါတယ်။

```ts
const plan = db.raw.collection('users').updateMany({ role: 'author' }, [{ $set: { bio: { $concat: ['bio for ', '$name'] } } }]).build();
const [result] = await runtime.query(plan);
// { matchedCount: 2, modifiedCount: 2, ... }
```

### `deleteOne()` နဲ့ `deleteMany()`

Document တစ်ခု ဒါမှမဟုတ် ကိုက်ညီတဲ့ document အားလုံးကို ဖျက်ပါ။ နှစ်ခုလုံးက `{ deletedCount }` ကို ပြန်ပေးပါတယ်။

```ts
const onePlan = db.raw.collection('users').deleteOne({ _id: new ObjectId(bobId) }).build();
const [oneResult] = await runtime.query(onePlan);
// { deletedCount: 1 }

const manyPlan = db.raw.collection('users').deleteMany({ role: 'author' }).build();
const [manyResult] = await runtime.query(manyPlan);
// { deletedCount: 2 }
```

### `findOneAndUpdate()`

ကိုက်ညီတဲ့ document ကို atomically update လုပ်ပြီး update မတိုင်ခင်က အတိုင်း document ကို ပြန်ပေးပါတယ်။ Document မကိုက်ညီဘဲ `upsert` က `true` ဖြစ်တဲ့အခါ update က document တစ်ခု insert လုပ်ပါတယ်။

#### မှတ်ချက်များ

* `findOneAndUpdate()` က တတိယ argument အနေနဲ့ `{ upsert }` ကိုပဲ လက်ခံပါတယ်။ Sort လုပ်လို့မရသလို update ပြီးနောက် document ကိုလည်း မပေးနိုင်ပါဘူး။ Options object ထဲမှာ `sort` ဒါမှမဟုတ် `returnDocument` ပါရင် TypeScript က ငြင်းပါတယ်။

Sort လုပ်ချင်ရင် ဒါမှမဟုတ် update ပြီးနောက် document ကို ဖတ်ချင်ရင် command ကို ကိုယ်တိုင် တည်ဆောက်ပြီး `db.query.rawCommand(...)` ကနေ run ပါ။ `new RawFindOneAndUpdateCommand(...)` က argument ခြောက်ခု ယူပါတယ်:

* `collection`: collection နာမည်။ မဖြစ်မနေ လိုပါတယ်။
* `filter`: filter document။ မဖြစ်မနေ လိုပါတယ်။
* `update`: update document တစ်ခု ဒါမှမဟုတ် aggregation-pipeline stage တွေပါတဲ့ array။ မဖြစ်မနေ လိုပါတယ်။
* `upsert`: boolean တစ်ခု။ မဖြစ်မနေ မလိုပါ၊ မထည့်ရင် `false` ပါ။
* `sort`: field နာမည်ကနေ `1` ဒါမှမဟုတ် `-1` ကို map လုပ်တဲ့ record။ မဖြစ်မနေ မလိုပါ။
* `returnDocument`: `'before'` ဒါမှမဟုတ် `'after'`။ မဖြစ်မနေ မလိုပါ။ မထည့်ရင် update မတိုင်ခင်က အတိုင်း document ရပါတယ်။

```ts
import { RawFindOneAndUpdateCommand } from '@prisma/orm-mongo/query-ast/execution';

// collection, filter, update, upsert, sort, returnDocument
const command = new RawFindOneAndUpdateCommand('users', { _id: new ObjectId(aliceId) }, { $inc: { count: 1 } }, true, { count: -1 }, 'after');
const [updated] = await runtime.query(db.query.rawCommand(command));
```

##### Upsert counter ပုံစံ

`findOneAndUpdate()` က ကိုယ့် update မတိုင်ခင် အတိုင်း document ကို ပြန်ပေးပါတယ်။ ပထမ call က document ကို ဖန်တီးလို့ ပြန်ပေးဖို့ ဘာမှ မရှိဘဲ `[]` ရပါတယ်။ ဒုတိယ call က `count: 1` ကို ပြန်ပေးပြီး အဲဒါက အဲဒီ call က တစ်ခု မထည့်ခင် ရှိနေတဲ့ value ပါ။ ဥပမာ schema မှာ counter collection မရှိလို့ ဒီမှာ `users` က counter နေရာမှာ အစားထိုးထားပါတယ်။ MongoDB က ရိုးရိုး string `_id` ကို ခွင့်ပြုလို့ `'pageViews'` က မှန်ကန်တဲ့ id ဖြစ်ပါတယ်။ `ObjectId` နဲ့ id တည်ဆောက်ဖို့ အကြံပြုချက်က MongoDB generate လုပ်တဲ့ id တွေအတွက်ပါ။

```ts
const filter = { _id: 'pageViews' };
const update = { $inc: { count: 1 }, $setOnInsert: { _id: 'pageViews' } };
const counter = db.raw.collection('users');
const bump = () => runtime.query(counter.findOneAndUpdate(filter, update, { upsert: true }).build());
const first = await bump(); // [], because the insert has no earlier version
const second = await bump(); // [{ ..., count: 1 }], the version before the second increment
const third = await bump(); // [{ ..., count: 2 }]
```

### `findOneAndDelete()`

ကိုက်ညီတဲ့ document ကို atomically ဖျက်ပြီး ပြန်ပေးပါတယ်။ ရလာတဲ့ row က wrapper object မဟုတ်ဘဲ ကိုက်ညီတဲ့ raw document ကိုယ်တိုင်ဖြစ်လို့ သူ့ `_id` က raw `ObjectId` ပါ။

```ts
const plan = db.raw.collection('users').findOneAndDelete({ _id: new ObjectId(aliceId) }).build();
const [deleted] = await runtime.query(plan);
// deleted is the removed document, and its _id is a raw ObjectId
const isAlice = String(deleted._id) === aliceId; // true
```

## `db.query.rawCommand()` — raw MongoDB command run ခြင်း

`db.query.rawCommand(command)` က raw MongoDB command ကို ကိုယ်ရေးထားတဲ့အတိုင်း အတိအကျ ပို့ပြီး run ပါတယ်။ [pipeline builder](https://www.prisma.io/docs/orm/reference/pipeline-builder) ကို ကြည့်ပါ။ အဲဒါက build လုပ်ထားတဲ့ query ကို ပြန်ပေးပြီးသားဖြစ်လို့ `.build()` မခေါ်ပါနဲ့။ `aggregate<Row>()` နဲ့ မတူဘဲ row type parameter မရှိလို့ rows တွေက `unknown` အနေနဲ့ ပြန်လာပြီး ကိုယ်တိုင် cast လုပ်ရပါတယ်။

```ts
import { RawAggregateCommand } from '@prisma/orm-mongo/query-ast/execution';

const plan = db.query.rawCommand(new RawAggregateCommand('posts', [{ $count: 'total' }]));
const rows = (await runtime.query(plan)) as { total: number }[];
// [{ total: 2 }]
```

Typed pipeline builder က query တစ်ခုကို မဖော်ပြနိုင်တဲ့အခါ `rawCommand()` က ထွက်ပေါက်ပါ။ ပေးလိုက်တဲ့ command က မပြောင်းဘဲ ပို့ခံရလို့ pipeline document ထဲက တကယ့် `ObjectId` က ကိုက်ညီပါတယ်။ `db.raw.collection()` ပေါ်က `aggregate<Row>()` ကလည်း `_id` filter လုပ်တာကို ကိုင်တွယ်ပြီး row type ပေးလို့ — `db.query` ထဲမှာ အလုပ်လုပ်နေပြီး အဲဒီမှာ raw command တစ်ခု လိုတဲ့အခါ `rawCommand()` ကို သုံးပါ။ အပြည့်အစုံအတွက် pipeline builder ရဲ့ [`rawCommand()`](https://www.prisma.io/docs/orm/reference/pipeline-builder#rawcommand) section ကို ကြည့်ပါ။

```ts
const plan = db.query.rawCommand(new RawAggregateCommand('posts', [{ $match: { _id: new ObjectId('6539a1f2c3d4e5f60718293c') } }]));
const rows = await runtime.query(plan);
```

## ဆက်စပ် ဖတ်ရန်

- [`Error reference`](https://www.prisma.io/docs/orm/reference/error-reference): namespace အလိုက် Prisma ORM command တွေ၊ runtime နဲ့ extension တွေရဲ့ structured error code တွေ — တစ်ခုချင်းစီကို ဘယ်အခြေအနေမှာ ဖြစ်စေလဲ ဆိုတာ အပါအဝင်။
- [`Migration API`](/docs/prisma/migration-api): migration.ts က သုံးနိုင်တဲ့ method နဲ့ helper တိုင်း — Migration class၊ PostgreSQL operation တွေ၊ column နဲ့ constraint helper တွေ၊ rawSql နဲ့ MongoDB operation တွေ။
- [`ORM client reference`](https://www.prisma.io/docs/orm/reference/orm-client): Prisma ORM client ရဲ့ query၊ mutation၊ filter နဲ့ aggregate method တွေအတွက် ကိုးကားညွှန်း။
- [`Pipeline builder reference`](https://www.prisma.io/docs/orm/reference/pipeline-builder): Prisma ORM MongoDB pipeline builder ရဲ့ stage တွေ၊ accumulator တွေ၊ expression helper တွေနဲ့ write method တွေအတွက် ကိုးကားညွှန်း။
- [`SQL query builder reference`](https://www.prisma.io/docs/orm/reference/sql-query-builder): Prisma ORM SQL query builder ရဲ့ select၊ mutation နဲ့ grouped query method တွေအတွက် ကိုးကားညွှန်း။
