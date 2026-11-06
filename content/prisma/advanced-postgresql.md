---
title: "Advanced PostgreSQL — PostgreSQL အဆင့်မြင့် အင်္ဂါရပ်များ"
description: "Prisma ORM 8 contract ထဲမှာ row-level security, expression နှင့် partial indexes, check constraints, Prisma မစီမံသင့်တဲ့ tables နှင့် လိုအပ်တဲ့ PostgreSQL extensions တွေကို ဘယ်လို သတ်မှတ်မလဲ"
order: 42
source: "https://www.prisma.io/docs/orm/contract-authoring/advanced-postgresql"
status: translated
updated: 2026-11-06
---

Production PostgreSQL database တစ်ခုမှာ tables နဲ့ foreign keys တွေတင်မက အခြားအရာတွေလည်း ရှိတတ်ပါတယ် — user တစ်ယောက် ဘယ် rows တွေကို မြင်ခွင့်ရှိလဲ ဆုံးဖြတ်တဲ့ policies တွေ၊ expression တွေပေါ်မှာ တည်ဆောက်ထားတဲ့ indexes တွေ၊ မကောင်းတဲ့ values တွေကို ပယ်ချတဲ့ constraints တွေ၊ အခြား system တစ်ခုက ပိုင်ဆိုင်တဲ့ tables တွေ၊ ပြီးတော့ `citext` လိုမျိုး extensions တွေပါ။ Prisma ORM 8 က ဒါတွေအားလုံးကို `schema.prisma` ကို အစားထိုးလိုက်တဲ့ `contract.prisma` file ထဲမှာ ထောက်ပံ့ပေးပါတယ်။ ဒီ page က တစ်ခုချင်းစီကို သူဖြေရှင်းပေးတဲ့ အခြေအနေနဲ့အတူ ပြသပေးပါတယ်။ Contract ကို ပြောင်းလဲတိုင်း command သုံးခုကို အမြဲ run ရပါတယ်: ပထမဆုံး `npx prisma contract emit` က `contract.prisma` ကို သင့် app နဲ့ CLI ဖတ်တဲ့ `contract.json` နဲ့ `contract.d.ts` files တွေအဖြစ် ပြောင်းပေးပါတယ်။ ပြီးရင် `npx prisma migration plan --name <name>` က migration တစ်ခုကို ရေးပေးပါတယ်။ နောက်ဆုံး `npx prisma db migrate --advance-ref db` က အဲဒါကို သင့် development database ပေါ်မှာ apply လုပ်ပေးပါတယ်။ [Migration တစ်ခု Generate လုပ်ခြင်း](/docs/prisma/generating-a-migration) မှာ ဒီအဆင့်တွေကို အသေးစိတ် လမ်းညွှန်ထားပါတယ်။ Syntax နဲ့ option တိုင်းကို [PSL နဲ့ ရေးခြင်း](/docs/prisma/psl-syntax) မှာ ဖော်ပြထားပြီး — TypeScript ပုံစံကိုတော့ [TypeScript နဲ့ ရေးခြင်း](/docs/prisma/typescript-schema-builder) မှာ တွေ့နိုင်ပါတယ်။ Contract က လောလောဆယ် မဖော်ပြနိုင်သေးတဲ့ အရာတွေနဲ့ အဲဒီအစား ဘာလုပ်ရမလဲဆိုတာကို [ကန့်သတ်ချက်များ](#ကန့်သတ်ချက်များ-limitations) မှာ စာရင်းပြုစုထားပါတယ်။

ဒီ page ပေါ်က SQL expression တိုင်းဟာ quoted string မဟုတ်ဘဲ ``sql`...` `` literal ဖြစ်ပြီး — field names တွေမဟုတ်ဘဲ column names တွေကို သုံးပါတယ်။ Field တစ်ခုမှာ `@map` ရှိတဲ့အခါမှသာ နှစ်ခု ကွာခြားပါတယ်။ Migration က run မလုပ်မချင်း SQL ကို ဘာကမှ စစ်ဆေးပေးမှာ မဟုတ်ပါဘူး။

## User တစ်ယောက်ပိုင်တဲ့ Rows တွေ

သင့် `document` table က user တိုင်းရဲ့ documents တွေကို သိမ်းထားပြီး — user တစ်ယောက်စီက ကိုယ်ပိုင် documents တွေကိုပဲ ဖတ်ခွင့်နဲ့ ပြောင်းခွင့် ရှိပါတယ်။ PostgreSQL က ဒါကို row-level security နဲ့ အတင်းအကြပ် လိုက်နာစေပါတယ်: table ပေါ်က policies တွေကို သင့် app ချိတ်ဆက်တဲ့ database role ပေါ်မှာ apply လုပ်တာပါ။ Model အတွက် `@@rls` နဲ့ ဖွင့်ပါ၊ role ကို နာမည်ပေးပါ၊ ပြီးရင် ခွင့်ပြုချင်တဲ့ operation တစ်ခုချင်းစီအတွက် policy block တစ်ခု ရေးပါ။ အောက်က model က default schema ဖြစ်တဲ့ `public` ထဲမှာ ရှိပြီး — `@onCreate(uuid())` က id ကို သင့် app ထဲမှာ generate လုပ်ပါတယ်။ Prisma ORM 8 က generate လုပ်တဲ့ value တိုင်းကို အဲဒီနေရာမှာပဲ ထားပါတယ် (`@default` က database ကိုယ်တိုင် ဖြည့်ပေးတဲ့ value အတွက်ပဲ သုံးပါတယ်):

```prisma title="src/prisma/contract.prisma (excerpt)"
model Document {
  id      Uuid   @id @onCreate(uuid())
  ownerId Uuid
  title   String

  @@map("document")
  @@rls
}

namespace unbound {
  role app_user {}
}

policy_select document_owner_read {
  target = Document
  roles  = [app_user]
  using  = sql`"ownerId" = current_setting('app.user_id')::uuid`
}

policy_update document_owner_write {
  target    = Document
  roles     = [app_user]
  using     = sql`"ownerId" = current_setting('app.user_id')::uuid`
  withCheck = sql`"ownerId" = current_setting('app.user_id')::uuid`
}
```

`using` က operation က မြင်ရမယ့် ရှိပြီးသား rows တွေကို ဆုံးဖြတ်ပြီး — `withCheck` ကတော့ အသစ်ထည့်တဲ့ ဒါမှမဟုတ် ပြောင်းလဲတဲ့ rows တွေထဲက ဘယ်ဟာတွေကို လက်ခံမလဲ ဆုံးဖြတ်ပါတယ်။ `role` block ရဲ့ braces ထဲမှာ ဘာမှ မပါပါဘူး၊ ပြီးတော့ အဲဒါက `namespace unbound` ထဲမှာ ထားရပါတယ် — အကြောင်းက role တစ်ခုဟာ schema တစ်ခုတည်းမဟုတ်ဘဲ database server တစ်ခုလုံးကို ပိုင်ဆိုင်လို့ပါ။ ဒီကနေ `migration plan` က row-level security ဖွင့်တဲ့ statements တွေနဲ့ policy နှစ်ခုကို ဖန်တီးတဲ့ statements တွေကို ရေးပေးပါတယ်။ ပြီးတော့ [`db verify`](https://www.prisma.io/docs/cli/db-verify) က အဲဒါတွေ database ထဲမှာ ရှိမရှိ စစ်ဆေးပါတယ်။

Role ကိုယ်တိုင်ကိုတော့ သင်ပဲ ဖန်တီးရပါမယ်။ Prisma ORM က role တစ်ခုကို ဘယ်တော့မှ create ဒါမှမဟုတ် drop မလုပ်ပါဘူး; `role` block က role တစ်ခုကို နာမည်ပေးတာပဲ ဖြစ်ပြီး — အဲဒါ မရှိရင် `db verify` ကျရှုံးပါတယ်။ Login တစ်ခုနဲ့အတူ တစ်ကြိမ်တည်း ဖန်တီးပြီး — သင့် policies တွေ ခွင့်ပြုတဲ့ operations တွေကိုပဲ အတိအကျ grant လုပ်ပါ။ ဒီမှာဆိုရင် `SELECT` နဲ့ `UPDATE` ပါ:

```sql
CREATE ROLE app_user LOGIN PASSWORD '...';
GRANT SELECT, UPDATE ON "public"."document" TO app_user;
```

အစီအစဉ်က အရေးကြီးပါတယ်: migration ထဲက `CREATE POLICY` statements တွေက `app_user` ကို နာမည်ဖော်ပြထားတာမို့ — `db migrate` မလုပ်ခင် role ကို အရင် ဖန်တီးထားရပါမယ်။ ပြီးမှ table ရှိလာတဲ့အခါ `GRANT` ကို run ပါ။ Statement နှစ်ခုကို ကိုယ်တိုင် run ပါ၊ ဒါမှမဟုတ် SQL ပဲ ပါတဲ့ migration တစ်ခုထဲမှာ `GRANT` ကို ထည့်ပါ — အဲဒီလို migration ဘယ်လို ဖန်တီးမလဲဆိုတာကို [ကန့်သတ်ချက်များ](#ကန့်သတ်ချက်များ-limitations) မှာ ပြထားပါတယ်။

Policies တွေက connection တစ်ခု login ဝင်တဲ့ role ပေါ်မှာ သက်ရောက်ပြီး — table ရဲ့ owner ကတော့ အဲဒါတွေကို ကျော်သွားပါတယ်။ ဒါကြောင့် သင့် app အတွက် `app_user` အနေနဲ့ login ဝင်တဲ့ connection string တစ်ခု လိုအပ်ပြီး — CLI ကတော့ owner ရဲ့ connection string ကို ဆက်ထားပါတယ်။ CLI က `prisma.config.ts` ထဲက `db.connection` ကို ဖတ်ပြီး သင့် app က `src/prisma/db.ts` ထဲက `url` ကို ဖတ်တာမို့ — နှစ်ခုကို မတူတဲ့ values တွေ ပေးပါ။

ပြီးရင် query တစ်ခုစီ မလုပ်ခင် `app.user_id` ကို set လုပ်ပါ။ အဲဒီ setting က transaction တစ်ခုအတွင်း အသက်ဝင်နေတာမို့ — query ကို transaction တစ်ခုထဲမှာ run ပါ။ `db` က `src/prisma/db.ts` က ဖန်တီးတဲ့ client ဖြစ်ပြီး — `"pg/text@1"` က `set_config` ပြန်ပေးတဲ့ column တစ်ခုတည်းဟာ text ဖြစ်တယ်ဆိုတာကို ဖော်ပြတာပါ:

```ts
import { db } from "./prisma/db";

await db.transaction(async (tx) => {
  await tx.query(
    db.raw.sql`SELECT set_config('app.user_id', ${userId}, true)`.returnsRow({ set_config: "pg/text@1" }).build(),
  );
  return tx.orm.public.Document.all();
});
```

[Row-level security](/docs/prisma/psl-syntax) မှာ `policy_insert`, `policy_delete`, `policy_all` နဲ့ `permissive` တွေ ရှိပါတယ်။ Supabase ပေါ်မှာဆိုရင် `await db.asUser(jwt)` နဲ့ role တစ်ခုကို အရင်ချိတ်ပြီး — [Supabase extension](https://www.prisma.io/extensions/supabase) က query တိုင်းကို အဲဒီ role အနေနဲ့ run ပေးပါတယ်။

## Expression တစ်ခုပေါ်က ဒါမှမဟုတ် Rows တချို့ပေါ်က Index

Users တွေ email နဲ့ login ဝင်ပြီး — အဲဒီ lookup က အကြီးအသေး မခွဲခြားရပါဘူး။ `email` ပေါ်က သာမန် index တစ်ခုက `lower(email)` ပေါ်က query ကို မကူညီနိုင်တာမို့ — expression ကို index လုပ်ပါ:

```prisma title="src/prisma/contract.prisma (excerpt)"
model User {
  id    Uuid   @id @onCreate(uuid())
  email String

  @@index(expression: sql`lower(email)`, unique: true, name: "user_email_lower")
  @@map("user")
}
```

`task` table ထဲက rows အများစုက ပြီးသွားပြီး — queue က ဖွင့်ထားတဲ့ (open) rows တွေကိုပဲ အမြဲ ဖတ်ပါတယ်။ Partial index က အဲဒီ rows တွေကိုပဲ ဖုံးလွှမ်းတာမို့ သေးငယ်နေပါတယ်:

```prisma title="src/prisma/contract.prisma (excerpt)"
model Task {
  id    Uuid     @id @onCreate(uuid())
  done  Boolean  @default(false)
  dueAt DateTime

  @@index([dueAt], where: sql`(done = false)`, name: "task_open_due")
  @@map("task")
}
```

`expression:` က field list ကို အစားထိုးပြီး — `where:` က `WHERE` keyword မပါတဲ့ condition ပါ။ `unique:` က index ကို unique ဖြစ်စေပြီး — `type:` က list column တစ်ခုအတွက် `"gin"` လိုမျိုး index method ကို ရွေးပေးပါတယ်။ Database ထဲက index ကို `name:` ပေါ်မှာ suffix အတိုလေးတစ်ခု ပေါင်းပြီး နာမည်ပေးပါတယ် — ဥပမာ `user_email_lower_000a85d8` လိုပေါ့။ နောက်ပိုင်း `name:` ကို ပြောင်းရင် index ကို ပြန်နာမည်ပေးတာပဲ ဖြစ်ပြီး — ပြန် rebuild မလုပ်ပါဘူး။ `map:` ကတော့ database ထဲမှာ ရှိပြီးသား index တစ်ခုအတွက်ဖြစ်ပြီး သူ့ရဲ့ အတိအကျ နာမည်ကို သတ်မှတ်ပေးပါတယ်; index အသစ်အတွက်ဆိုရင် `name:` ကို သုံးပါ။ [Indexes](/docs/prisma/psl-syntax) မှာ option တိုင်း ပါပြီး — [Full-text indexes](/docs/prisma/psl-syntax) က search အကြောင်း ဖော်ပြပါတယ်။

## Database က ပယ်ချရမယ့် Value

Order total တစ်ခုက ဘယ်တော့မှ အနုတ်ဖြစ်လို့ မရပါဘူး။ သင့် application ကို ကျော်ပြီး write တစ်ခု ဝင်လာရင်တောင် database က ငြင်းပယ်စေချင်ပါတယ်။ Check constraint တစ်ခု ထည့်ပါ:

```prisma title="src/prisma/contract.prisma (excerpt)"
model Order {
  id    Int     @id @default(autoincrement())
  total Decimal

  @@check(expression: sql`total >= 0`, name: "order_total_not_negative")
  @@map("orders")
}
```

Model တစ်ခုမှာ `@@check` attribute ဘယ်နှစ်ခုမဆို ထည့်နိုင်ပြီး — `name:` နဲ့ `map:` က index ပေါ်မှာလိုပဲ အလုပ်လုပ်ပါတယ်။ [Check constraints](/docs/prisma/psl-syntax) မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

## Prisma ORM မထိသင့်တဲ့ Table

`audit_log` table ကို database trigger တစ်ခုက ရေးပြီး operations team က ပိုင်ဆိုင်ပါတယ်။ `legacy_customer` table ကိုတော့ အခြား application တစ်ခုနဲ့ မျှဝေသုံးထားပါတယ်။ နှစ်ခုလုံးကို သင့် app ကနေ ဖတ်ချင်ပေမယ့် — `migration plan` က ဘယ်တော့မှ မပြင်စေချင်ပါဘူး။ `@@control` က Prisma ORM က table တစ်ခုကို ဘယ်လောက်အထိ စီမံခန့်ခွဲမလဲ ဖော်ပြပါတယ်:

```prisma title="src/prisma/contract.prisma (excerpt)"
model AuditLog {
  id      Int    @id @default(autoincrement())
  message String

  @@map("audit_log")
  @@control(observed)
}

model LegacyCustomer {
  id   Int    @id
  name String

  @@map("legacy_customer")
  @@control(external)
}
```

| Value | `db verify` | Migrations |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| `managed` (default) | Table က ရှိရမည်ဖြစ်ပြီး model နှင့် အတိအကျ ကိုက်ညီရပါမည်။ | Create, alter နှင့် drop လုပ်ပါသည်။ |
| `tolerated` | ကြေညာထားတဲ့ columns တွေ ကိုက်ညီရပါမည်; အပို columns ကို လက်ခံပါသည်။ | မရှိရင် create လုပ်ပါသည်; alter ဒါမှမဟုတ် drop ဘယ်တော့မှ မလုပ်ပါ။ |
| `external` | ကြေညာထားတဲ့ columns တွေ ကိုက်ညီရပါမည်; အပို columns နှင့် constraints ကို လျစ်လျူရှုပါသည်။ | ဘယ်တော့မှ မထိပါ။ |
| `observed` | ဘာမဆို ဖြစ်နိုင်ပါသည်; မကိုက်ညီမှုက ကျရှုံးမှု မဟုတ်ဘဲ သတိပေးချက် (warning) သာ ဖြစ်ပါသည်။ | ဘယ်တော့မှ မထိပါ။ |

`tolerated` က ကြေညာထားတဲ့ column တစ်ခု ပြောင်းသွားရင် ဒါမှမဟုတ် ပျောက်သွားရင် `db verify` ကျရှုံးပေမယ့် — မသိတဲ့ columns တွေကိုတော့ လက်ခံပါတယ်။ `external` ကတော့ မသိတဲ့ constraints တွေကိုပါ လျစ်လျူရှုပြီး — table ကို ဘယ်တော့မှ create မလုပ်ပါဘူး။ Prisma ORM မရောက်ခင် table က အမြဲ ရှိနှင့်ပြီးသားဖြစ်ပြီး သူ့ရဲ့ ကြေညာထားတဲ့ columns တွေ တည်ငြိမ်နေတဲ့အခါ `external` ကို ရွေးပါ။ အဲဒီ columns တွေတောင် သင့်မသိဘဲ ပြောင်းလဲနိုင်တဲ့အခါမှာတော့ `observed` ကို ရွေးပါ။ [Control policy](/docs/prisma/psl-syntax) က reference entry ဖြစ်ပြီး — အပေါ်က row-level security policies တွေနဲ့ ဘာမှ မဆိုင်ပါဘူး။

## Migration တစ်ခု လိုအပ်တဲ့ Extension

အကြီးအသေး မခွဲခြားတဲ့ `email` column တစ်ခု လိုချင်ပါတယ်။ PostgreSQL မှာ အဲဒီအတွက် `citext` type ရှိပေမယ့် — column မတည်ရှိခင် install လုပ်ထားရမယ့် extension တစ်ခုကနေ လာတာပါ။ `@prisma/orm-postgres-contrib` ထဲက citext pack က type ကို ပေးပြီး extension ကို ကြေညာထားတာမို့ — config ထဲမှာ ထည့်ပါ:

```bash
npm install @prisma/orm-postgres-contrib
```

```typescript title="prisma.config.ts (excerpt)"
import citext from "@prisma/orm-postgres-contrib/citext/control";

// inside ormConfig({ ... }), beside contract and db:
    extensions: [citext],
```

```prisma title="src/prisma/contract.prisma (excerpt)"
model User {
  id    Uuid          @id @onCreate(uuid())
  email citext.Citext

  @@map("user")
}
```

`@prisma/orm-postgres-contrib/citext/runtime` ကနေ `citext` ကို client ရဲ့ `extensions` ဆီလည်း ပေးပို့ပါ။ `npx prisma contract emit` က pack ရဲ့ files တွေကို `migrations/` အောက်မှာ ရေးပေးပါတယ်။ ပြီးရင် `npx prisma db update` — ဒါမှမဟုတ် `migration plan` က သင့် migration ကို ရေးပြီးနောက် `npx prisma db migrate` — က pack ရဲ့ migration ကို run ပြီး extension ကို ဖန်တီးကာ၊ ပြီးမှ သင့် migration က column ကို ထည့်ပါတယ်။ ORM က `email` ကို PostgreSQL လိုပဲ အကြီးအသေး မခွဲဘဲ နှိုင်းယှဉ်ပါတယ်။

Pack တစ်ခုမှ မဖုံးလွှမ်းတဲ့ extension အတွက်ဆိုရင် — contract ထဲမှာ ကြေညာပြီး သူ့ types တွေကို `Raw` နဲ့ ရေးပါ။ `Raw` က database type ကို ရေးထားတဲ့အတိုင်း ယူပါတယ်:

```prisma title="src/prisma/contract.prisma (excerpt)"
extension hstore {}

model Setting {
  id     Uuid             @id @onCreate(uuid())
  values Raw(sql`hstore`)
}
```

ပြီးရင် `migration plan` က `CREATE EXTENSION IF NOT EXISTS hstore` ကို အဲဒါကို သုံးတဲ့ table မတိုင်ခင် plan လုပ်ပါတယ်။ ကျန်တာကို [PostgreSQL extensions](/docs/prisma/psl-syntax) မှာ ဖော်ပြထားပါတယ်။ `citext` နဲ့ `hstore` က PostgreSQL ရဲ့ trusted extensions တွေထဲ ပါတာမို့ — `db migrate` ချိတ်ဆက်တဲ့ role က superuser မလိုဘဲ database ပေါ်မှာ `CREATE` privilege ရှိရုံနဲ့ ရပါတယ်။ pgvector လို Prisma [extension package](/docs/prisma/extensions) တစ်ခုက သူ့ PostgreSQL extension ကို ကိုယ်ပိုင် contract ထဲမှာ ကြေညာထားတာမို့ — အဲဒီလိုဟာတွေအတွက် ဘာမှ ကြေညာစရာ မလိုပါဘူး။

## ရှိပြီးသား Database ကနေ ဒါတွေကို လက်ခံကျင့်သုံးခြင်း

`npx prisma contract infer --db "$DATABASE_URL"` က live database တစ်ခုကို ဖတ်ပြီး အစပျိုး contract တစ်ခု ရေးပေးပါတယ်။ တွေ့ရှိတဲ့ index, check constraint နဲ့ policy တစ်ခုချင်းစီကို `map:` (policy အတွက်ဆိုရင် `@@map`) ကို database မှာ ရှိတဲ့ နာမည်အတိုင်း သတ်မှတ်ပြီး — SQL ကိုလည်း PostgreSQL သိမ်းထားတဲ့အတိုင်း ရေးပေးတာမို့ `db verify` က ကိုက်ညီပြီး `migration plan` က သူတို့ကို မထိဘဲ ထားပါတယ်။ အဲဒီကစပြီး စည်းမျဉ်းက ဒီလိုပါ: database ထဲမှာ အဲဒီနာမည်အတိအကျနဲ့ ရှိပြီးသားအရာတွေအတွက် `map:`၊ သင်က အသစ်ထည့်နေတဲ့အရာတွေအတွက် `name:`။ အဲဒီလို contract ပေါ်မှာ `contract emit` တစ်ခါလုပ်တိုင်း SQL ပါပြီး `map:` ဒါမှမဟုတ် `@@map` သုံးထားတဲ့ policy, check နဲ့ index တစ်ခုချင်းစီအတွက် `PN_EXACT_NAME_BODY_COMPARISON` warning တစ်ခု ထုတ်ပြပါတယ်။ အဲဒီ warnings တွေက မျှော်လင့်ထားတာပါ၊ ဘာမှ ပြောင်းစရာ မလိုပါဘူး။

## ကန့်သတ်ချက်များ (Limitations)

ဒါတွေက `8.0.0-rc.22` မှာ ရှိတဲ့ ကွက်လပ်တွေဖြစ်ပြီး — တစ်ခုချင်းစီအတွက် အစားထိုး ဘာလုပ်ရမလဲ ပါပါတယ်။ Contract က လောလောဆယ် မဖော်ပြနိုင်သေးတဲ့ အရာတိုင်းကို migration ထဲက raw SQL step တစ်ခုထဲမှာ ထည့်ပါ — အဲဒါက သင်ပေးတဲ့ statements တွေကို run ပါတယ်။ `npx prisma migration new --name <name> --from <hash>` က operation မပါတဲ့ migration တစ်ခု ဖန်တီးပေးပါတယ်။ [`migration new`](https://www.prisma.io/docs/cli/migration-new) မှာ `--from` အကြောင်း ရှင်းပြထားပြီး — contract မပြောင်းထားတဲ့အခါ အဲဒီ command ကို လိုအပ်ပါတယ်။ Step ကို သူ့ရဲ့ `operations` list ထဲမှာ ထည့်ပြီး — `rawSql` ကို `@prisma/orm-postgres/migration` ကနေ import လုပ်ပါ။ ပြီးရင် file ကို ပြန် compile လုပ်ပါ — [Migration တစ်ခုကို ပြင်ဆင်ခြင်း](/docs/prisma/editing-a-migration) မှာ ပြထားတဲ့အတိုင်းပါ။ `operationClass` က `additive`, `widening`, `destructive` ဒါမှမဟုတ် `data` ဖြစ်ပြီး — အောက်က `GRANT` က စည်းမျဉ်းတစ်ခုကို လျှော့ပေးတာမို့ `widening` ဖြစ်ပါတယ်။ Migration API reference ထဲက [Raw SQL](https://www.prisma.io/docs/orm/reference/migration-api#raw-sql) မှာ ပုံစံအပြည့်အစုံ ပါပါတယ်:

```ts title="migration.ts (excerpt)"
rawSql({
  id: 'grant.document.app_user',
  label: 'Grant app_user access to "document"',
  operationClass: 'widening',
  target: { id: 'postgres' },
  execute: [{ description: 'grant', sql: 'GRANT SELECT, UPDATE ON "public"."document" TO app_user' }],
  precheck: [],
  postcheck: [],
}),
```

* **Roles နဲ့ `GRANT` က contract ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါ။** Prisma ORM က policies တွေ ဖန်တီးပေမယ့် role တစ်ခုကို ဘယ်တော့မှ မဖန်တီးသလို သူ့အတွက် privileges တွေလည်း မပေးပါဘူး။ Role ကို ဖန်တီးပြီး `GRANT` statements တွေကို raw SQL step တစ်ခုထဲမှာ ဒါမှမဟုတ် ကိုယ်တိုင် run ပါ။
* **`FORCE ROW LEVEL SECURITY` က contract ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါ။** Prisma ORM ကြေညာတဲ့အတိုင်း row-level security က table ရဲ့ owner ပေါ်မှာ မသက်ရောက်ပါဘူး။ Owner ပေါ်မှာပါ သက်ရောက်စေချင်ရင် `ALTER TABLE ... FORCE ROW LEVEL SECURITY` ကို raw SQL step တစ်ခုထဲမှာ run ပါ။ အဲဒီလိုလုပ်တာတောင် superuser ဒါမှမဟုတ် `BYPASSRLS` ရှိတဲ့ role ကို ဘယ်တော့မှ filter မလုပ်ပါဘူး — ဒါကြောင့် သင့် app login ဝင်တဲ့ role က နှစ်မျိုးလုံး မဖြစ်ရပါဘူး။
* **Triggers နဲ့ functions တွေ contract ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါ။** သူတို့ကို raw SQL step တစ်ခုထဲမှာ ဖန်တီးပါ။
* **`@@index` အတွင်းက sort order ကို ငြင်းပယ်ပါတယ်။** `@@index([createdAt(sort: Desc)])` က "Expected a field name" ဆိုတဲ့ error နဲ့ ကျရှုံးပါတယ် ([prisma/orm#30270](https://github.com/prisma/orm/issues/30270))။ အဲဒီလို index ကို raw SQL step တစ်ခုထဲမှာ ဖန်တီးပါ။
* **Base model ရဲ့ table ကို မျှဝေတဲ့ variant တစ်ခုက သူ့ကိုယ်ပိုင် constraints တွေကို ဆုံးရှုံးပါတယ်။** Variant ဆိုတာ `@@base` နဲ့ အခြား model တစ်ခုကို extend လုပ်တဲ့ model ဖြစ်ပြီး — PSL page မှာ `Bug` က `Task` ကို extend လုပ်ထားတာမျိုးပါ။ ကိုယ်ပိုင် `@@map` မရှိတဲ့ variant က သူ့ rows တွေကို base model ရဲ့ table ထဲမှာ သိမ်းပါတယ်။ အဲဒါပေါ်မှာ ကြေညာထားတဲ့ foreign key, `@@unique` ဒါမှမဟုတ် `@@index` ကို warning မပေးဘဲ contract ထဲကနေ ဖျက်ပစ်ပြီး ([prisma/orm#30445](https://github.com/prisma/orm/issues/30445)) — အဲဒါပေါ်က `@@check` ကိုတော့ ငြင်းပယ်ပါတယ်။ Base model ပေါ်မှာ ကြေညာပါ၊ ဒါမှမဟုတ် variant ကို ကိုယ်ပိုင် `@@map` ပေးပြီး ကိုယ်ပိုင် table ရစေပါ။ [Base models နဲ့ variants](/docs/prisma/psl-syntax) မှာ အဲဒီ layout နှစ်မျိုးကို ဖော်ပြထားပါတယ်။
* **`map:` နဲ့ ကိုယ်တိုင် ရေးထားတဲ့ SQL က drift ကို ဖော်ပြနိုင်ပါတယ်။** `db verify` က contract ထဲက SQL ကို PostgreSQL သိမ်းထားတဲ့ စာသားနဲ့ နှိုင်းယှဉ်ပြီး — PostgreSQL က သူ့ဆီ ပေးလိုက်တာကို ပြန်ရေးချပါတယ်။ Infer လုပ်ထားတဲ့ SQL က ကိုက်ညီပါတယ် — အကြောင်းက `contract infer` က PostgreSQL ရဲ့ စာသားကို ပြန်ရေးထည့်လို့ပါ; သင်ကိုယ်တိုင် `map:` နဲ့ ရိုက်ထည့်ထားတဲ့ SQL ကတော့ မကိုက်ညီနိုင်ပါဘူး ([prisma/orm#30294](https://github.com/prisma/orm/issues/30294))။ သင်ထည့်တဲ့အရာတိုင်းအတွက် `name:` ကို သုံးပါ။
* **`contract infer` က `public` schema ကိုပဲ ဖတ်ပါတယ်** ([prisma/orm#30573](https://github.com/prisma/orm/issues/30573))။ အခြား schemas ထဲက policies, indexes နဲ့ tables တွေကို ပြန်မဖတ်ပါဘူး; ကိုယ်တိုင် ရေးပါ။ ဒါ့အပြင် role နာမည်က PSL အတွက် တရားဝင် မဖြစ်တဲ့ policy တစ်ခုနဲ့ — SQL ကို မပြောင်းဘဲ ပြန်မဖတ်နိုင်တဲ့ index, check ဒါမှမဟုတ် policy တွေကို ကျော်သွားပြီး — ဘယ်နေရာမှာ ကျော်သွားလဲဆိုတာ file ထဲမှာ comment ထားခဲ့ပါတယ်။
* **Generate လုပ်ထားတဲ့ check တစ်ခုကို လွှတ်ပေးလို့ မရပါဘူး။** Prisma ORM က enum column တစ်ခုပေါ်မှာ enum ရဲ့ values တွေကိုပဲ လက်ခံဖို့ check တစ်ခု၊ list column တစ်ခုပေါ်မှာ `NULL` elements တွေကို ပယ်ဖို့ check တစ်ခု အမြဲ ထည့်ပါတယ်။ Control policy က managed ဖြစ်တဲ့ table တစ်ခုပေါ်မှာဆိုရင် value object column တစ်ခုချင်းစီပေါ်မှာ value object ရဲ့ shape ကိုပဲ လက်ခံတဲ့ check တစ်ခု၊ discriminator column တစ်ခုပေါ်မှာ သူ့ variants တွေရဲ့ values တွေကိုပဲ လက်ခံတဲ့ check တစ်ခု ထပ်ထည့်ပါတယ်။ အဲဒီလို check တစ်ခု ထည့်တဲ့ migration က check ငြင်းပယ်တဲ့ row တစ်ခုပေါ်မှာ ကျရှုံးပြီး — error က အဲဒီ rows တွေကို ရှာတဲ့ query ကို ပေးပါတယ်။ List ရဲ့ elements တွေ `NULL` ဖြစ်နိုင်ရင် `String?[]` လို့ ကြေညာပါ။ အဲဒါတွေကို လွှတ်ပေးခဲ့တဲ့ `@noCheck` attribute ကို `8.0.0-rc.19` မှာ ဖျက်ပစ်ခဲ့ပါတယ်။

## ဆက်စပ်ဖတ်ရန်

- [PSL နဲ့ ရေးခြင်း](/docs/prisma/psl-syntax): သင်သိပြီးသား Prisma schema language နဲ့ Prisma ORM contract ကို ရေးပါ၊ Prisma ORM 8 ရဲ့ အပိုဆောင်းချက်တွေနဲ့အတူ။
- [TypeScript နဲ့ ရေးခြင်း](/docs/prisma/typescript-schema-builder): Schema file အစား TypeScript ထဲက typed builder နဲ့ Prisma ORM contract ကို သတ်မှတ်ပါ။ Models တူတူ၊ `contract.json` နဲ့ `contract.d.ts` တူတူ၊ သီးသန့် language မလိုပါ။
- [`contract.json` နဲ့ `contract.d.ts`](/docs/prisma/the-contract-artifact): contract.json နဲ့ contract.d.ts က Prisma ORM ရဲ့ အခြားအစိတ်အပိုင်းတိုင်း ဖတ်တဲ့ file နှစ်ခု ဖြစ်ပါတယ်။ သူတို့ထဲမှာ ဘာတွေ ပါလဲဆိုတာ ဒီမှာ ဖော်ပြထားပါတယ်။
- [Editor ပံ့ပိုးမှု](/docs/prisma/editor-support): Prisma VS Code extension က Prisma ORM contract အတွက် ဘာလုပ်ပေးပြီး — file ကို လက်မခံတော့တဲ့အခါ ဘာလုပ်ရမလဲ။
- [ထောက်ပံ့ထားတဲ့ Database လုပ်ဆောင်ချက်များ](/docs/prisma/capabilities): Contract က သင့် packages တွေ ထောက်ပံ့တဲ့ database features တွေကို မှတ်တမ်းတင်ထားတာမို့ — Prisma ORM က မထောက်ပံ့တဲ့ feature တစ်ခုကို ရှင်းလင်းတဲ့ error နဲ့ အစောကတည်းက ငြင်းပယ်နိုင်ပါတယ်။
