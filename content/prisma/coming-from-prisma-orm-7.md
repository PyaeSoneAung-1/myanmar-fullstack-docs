---
title: "Prisma ORM 7 ကနေ ပြောင်းလာခြင်း (Coming from Prisma ORM 7)"
description: "Prisma ORM 7 မှာ သုံးခဲ့တဲ့ schema attribute၊ command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်လဲ၊ ဘာတွေ မရနိုင်သေးဘူးဆိုတာကို ဇယားတွေနဲ့ ယှဉ်ပြထားတဲ့ lookup page"
order: 55
source: "https://www.prisma.io/docs/orm/coming-from-prisma-orm-7"
status: translated
updated: 2026-11-06
---

Prisma ORM 7 မှာ သုံးခဲ့တဲ့ schema attribute၊ command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်လဲ၊ ပြီးတော့ ဘာတွေ မရနိုင်သေးဘူးဆိုတာကို ဒီ page မှာ ဖော်ပြထားပါတယ်။

သင် Prisma ORM 7 ကို ရင်းနှီးပြီးသားဆိုရင် — သင်အခု သုံးနေတဲ့ အရာတစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်လဲဆိုတာ ဒီ page က ပြောပြပါတယ်။ ဇယားတွေ မစခင် သိထားသင့်တဲ့ နာမည်ပြောင်းသွားတဲ့ အရာ နှစ်ခု ရှိပါတယ်: schema file ကို အခု contract လို့ ခေါ်ပါတယ် (file အတူတူပဲ၊ နာမည်ပဲ ပြောင်းတာပါ)၊ ပြီးတော့ client types တွေ generate လုပ်တာကို အခု `emit` လို့ ခေါ်ပါတယ်။ ဒီ page က lookup table တစ်ခုပါ၊ tutorial မဟုတ်ပါဘူး — schema အတွက် တစ်ခု၊ command-line tool အတွက် တစ်ခု၊ query API အတွက် တစ်ခု ဇယား ရှိပြီး အဆုံးမှာ မရနိုင်သေးတဲ့ အရာတွေအကြောင်း section တစ်ခု ပါပါတယ်။

အလုပ်လုပ်နေတဲ့ application တစ်ခုကို ရွှေ့ချင်ရင်တော့ [Migrate from Prisma ORM 7 to 8](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql) ကို လိုက်ပါ။ အဲဒါက version နှစ်ခုလုံးကို database အတူတူပေါ်မှာ ဘေးချင်း ယှဉ်ပြီး run ပေးကာ — app ရဲ့ အစိတ်အပိုင်းတစ်ခုချင်းစီကို တစ်ခါတစ်ခု ရွှေ့ပေးပါတယ်။ ရွှေ့သင့်မရွှေ့သင့် ဆုံးဖြတ်ချင်ရင်တော့ [Release status](/docs/prisma/release-status) ကို ကြည့်ပါ။

ဒီ page ထဲက ဥပမာအားလုံးက PostgreSQL ကို သုံးပါတယ်။

## မစတင်ခင် (Before you start)

သင် Prisma ORM 7 နဲ့ run နေတဲ့ application တစ်ခုထဲကို Prisma ORM 8 ထည့်မယ်ဆိုရင် — အဲဒီ project ထဲမှာ အောက်က new-project commands တွေကို မ run ပါနဲ့။ ဘာလို့လဲဆိုတော့ `npm install prisma` က version 7 command-line tool နေရာမှာ version 8 ကို အစားထိုး install လုပ်လိုက်လို့ပါ။ အဲဒီအစား [Migrate from Prisma ORM 7 to 8](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql) ကို လိုက်ပါ။ အဲဒါက version နှစ်ခုလုံးကို သင့် database ပေါ်မှာ ဘေးချင်း ယှဉ်ပြီး သူ့ data ကို မပြောင်းဘဲ run ပေးကာ — အဆုံးမှာတော့ Prisma ORM 8 က migrations တွေကို စီမံခန့်ခွဲပါလိမ့်မယ်။

PostgreSQL မှာ အောက်က command က Prisma ORM 7 ကို `prisma7` command နဲ့ `prisma7.config.ts` ဆီ ရွှေ့ပြီး — Prisma ORM 8 က သင့် `schema.prisma` ကို သူ့ contract အနေနဲ့ ဖတ်ဖို့ ပြင်ဆင်ပေးပါတယ်:

#### bun

```bash
bunx prisma@latest orm init --from-prisma7-schema prisma/schema.prisma
```

#### pnpm

```bash
pnpm dlx prisma@latest orm init --from-prisma7-schema prisma/schema.prisma
```

#### yarn

```bash
yarn dlx prisma@latest orm init --from-prisma7-schema prisma/schema.prisma
```

#### npm

```bash
npx prisma@latest orm init --from-prisma7-schema prisma/schema.prisma
```

ဒါက `prisma/` ကိုရော database ကိုပါ မပြောင်းပါဘူး။ [`orm init` on a Prisma ORM 7 project](https://www.prisma.io/docs/cli/orm-init#on-a-prisma-orm-7-project) မှာ ဘာတွေ ပြောင်းသွားလဲ စာရင်းပြုစုထားပါတယ်။ ပြီးရင် `npx prisma db sign` ကို run ပြီး — guide ရဲ့ [phase 3](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql#3-migrate-one-route) ကနေ ဆက်ပါ၊ route တွေကို တစ်ခုချင်း `src/prisma/db.ts` ထဲက client ဆီ ရွှေ့သွားပါ။ Guide ရဲ့ [phase 4](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql#4-transfer-migration-ownership) မှာ Prisma ORM 8 က migrations တွေကို လွှဲယူတဲ့အထိ Prisma ORM 7 ကပဲ သင့် migrations တွေကို ပိုင်ဆိုင်ထားပါလိမ့်မယ်။ Phase 4 မှာ Prisma ORM 8 အတွက် ရေးထားတဲ့ contract file တစ်ခု လိုပါတယ်။ မစခင်မှာ guide ရဲ့ အဆင့် 2.3 ကနေ 2.5 အထိ လုပ်ပြီး contract တစ်ခု ဖန်တီးပါ၊ ပြီးရင် `prisma.config.ts` ထဲက `contract` ကို အဲဒီ file ရဲ့ path ဆီ ညွှန်ပါ။

Project အသစ်တစ်ခုမှာ Prisma ORM 8 ကို setup လုပ်ချင်ရင်တော့ `prisma` နဲ့ `@prisma/orm-postgres` ကို install လုပ်ပြီး `orm init` ကို run ပါ:

#### bun

```bash title="Terminal"
bun add --dev prisma
bun add @prisma/orm-postgres
bunx prisma orm init --write-env
```

#### pnpm

```bash title="Terminal"
pnpm add --save-dev prisma
pnpm add @prisma/orm-postgres
pnpm prisma orm init --write-env
```

#### yarn

```bash title="Terminal"
yarn add --dev prisma
yarn add @prisma/orm-postgres
yarn prisma orm init --write-env
```

#### npm

```bash title="Terminal"
npm install --save-dev prisma
npm install @prisma/orm-postgres
npx prisma orm init --write-env
```

`orm init` က `prisma.config.ts`၊ starter `src/prisma/contract.prisma`၊ `src/prisma/db.ts` နဲ့ `.env` တို့ကို ရေးပေးပါတယ်။ သင့် connection string ကို `.env` ထဲမှာ `DATABASE_URL` အနေနဲ့ ထည့်ပါ၊ models တွေကို contract ထဲမှာ ရေးပါ၊ ပြီးရင် `npx prisma contract emit` ကို run ပါ; `db.ts` က အဲဒီက ရေးလိုက်တဲ့ file နှစ်ခုကို import လုပ်ပါတယ်။

အောက်က ဇယားတွေမှာ commands တွေကို `prisma ...` အနေနဲ့ ရေးထားပါတယ်။ Run လုပ်တဲ့အခါတော့ `npx prisma ...` အနေနဲ့ run ပါ။

## Schema

`schema.prisma` က အခု `src/prisma/contract.prisma` ဖြစ်ပါပြီ။ File အတူတူပါပဲ၊ နာမည်ပဲ ပြောင်းသွားတာပါ: models တွေကို အဲဒီထဲမှာပဲ ဖော်ပြရဆဲပါ။ Prisma ORM 8 မှာ "schema" ဆိုတာ PostgreSQL schema — သင့် tables တွေ နေထိုင်တဲ့ namespace၊ များသောအားဖြင့် `public` — ကို ဆိုလိုပါတယ်။

အထင်ရှားဆုံး ပြောင်းလဲမှုက field types တွေမှာ ဖြစ်ပါတယ်။ Prisma ORM 7 က Prisma type တစ်ခုနဲ့ `@db.` attribute တစ်ခုကို တွဲရေးခဲ့တဲ့နေရာမှာ — ဥပမာ `String @db.VarChar(255)` ဆိုရင် — Prisma ORM 8 က database type ကိုပဲ field type အနေနဲ့ ရေးပါတယ်: `VarChar(255)`။

| Prisma ORM 7 | Prisma ORM 8 | မှတ်ချက် |
| --- | --- | --- |
| `schema.prisma` | `contract.prisma` | |
| (ဘာမှ မရှိ) | ပထမဆုံး လိုင်းအနေနဲ့ `// use prisma-8` | Prisma ORM 8 `.prisma` contract file တိုင်းမှာ မဖြစ်မနေ လိုပါတယ်; ဇယားအောက်က မှတ်ချက်ကို ကြည့်ပါ |
| `generator client { ... }` | ဖယ်ရှားထားသည် | `emit` က `generate` အတွက် စကားလုံးအသစ် ဖြစ်ပါတယ်။ `prisma contract emit` က သင့် contract ဘေးမှာ file နှစ်ခု — `contract.json` နဲ့ `contract.d.ts` — ရေးပေးပါတယ်။ နှစ်ခုလုံးကို commit လုပ်ပါ |
| `datasource db { ... }` | `prisma.config.ts` ရဲ့ `orm` section | connection string နဲ့ file path တွေက schema ထဲမှာ မဟုတ်ဘဲ config file ထဲမှာ ရှိပါတယ်။ ဥပမာက အောက်မှာ ပါတယ် |
| `String @db.Text` | `String` | `String` ကို `text` အနေနဲ့ သိမ်းပြီးသား ဖြစ်ပါတယ် |
| `String @db.VarChar(255)` | `VarChar(255)` | ကျန်တဲ့ `@db.` types အများစုအတွက်လည်း အတူတူပါပဲ — ဥပမာ `@db.Xml`၊ `@db.Oid` နဲ့ `@db.Money`။ Attribute နာမည်ပဲ field type ဖြစ်သွားပါတယ်။ [PSL syntax](/docs/prisma/psl-syntax) မှာ စာရင်းပြုစုထားပါတယ်။ `@db.Citext` ကတော့ `citext.Citext` ဖြစ်သွားပြီး — `@prisma/orm-postgres-contrib` ထဲက citext pack ကနေ လာပါတယ်; [Using extensions](/docs/prisma/using-extensions) ကို ကြည့်ပါ |
| `Decimal @db.Decimal(10, 2)` | `Numeric(10, 2)` | `Decimal` က သီးသန့်အနေနဲ့ ရှိဆဲပါပဲ၊ ဒါပေမယ့် အဲဒါက precision သတ်မှတ်မထားတဲ့ `numeric` column ဖြစ်ပါတယ် |
| `Int`, `Boolean`, `Float`, `BigInt`, `Bytes` | မပြောင်းလဲပါ | |
| `String @db.Uuid` | `Uuid` | |
| `DateTime` | `DateTime(storage: timestamp)` | Prisma ORM 7 က `DateTime` ကို `timestamp(3)` အနေနဲ့ သိမ်းခဲ့ပြီး — ဒါက အဲဒါကို ဆက်ထိန်းထားပါတယ်။ Values တွေက Prisma ORM 7 လိုပဲ JavaScript `Date` အနေနဲ့ ပြန်လာပါတယ်။ ရိုးရိုး `DateTime` ကတော့ `timestamptz(3)` column ဖြစ်လို့ — ရှိပြီးသား table ပေါ်မှာ မတူတဲ့ column တစ်ခု ဖြစ်သွားပါတယ်။ ဇယားအောက်က မှတ်ချက်ကို ကြည့်ပါ |
| `DateTime @db.Timestamptz(3)` | `DateTime` | `timestamptz(3)` column အတူတူပါပဲ၊ `Date` အနေနဲ့ ဖတ်ပါတယ်။ အခြား precision လိုရင် `DateTime(precision: 6)` လို့ ရေးပါ |
| `updatedAt DateTime @updatedAt` | `updatedAt temporal.UpdatedAt` | `temporal.UpdatedAt` က ကွင်းစကွင်းပိတ် မပါဘဲ ရေးတဲ့ named type ဖြစ်ပြီး — create လုပ်တဲ့အခါနဲ့ update တိုင်းမှာ Prisma ORM က သင့် application ရဲ့ clock ကနေ သတ်မှတ်ပေးတဲ့ `timestamptz(3)` column ပါ။ `temporal.` က contract syntax ရဲ့ အစိတ်အပိုင်းပါ၊ import လုပ်စရာ မရှိပါဘူး။ Prisma ORM 7 ရဲ့ `timestamp(3)` column ကို ဆက်ထိန်းချင်ရင် attribute တွေကို ကိုယ်တိုင် ရေးပါ: `updatedAt DateTime(storage: timestamp) @onCreate(now()) @onUpdate(now())` |
| `createdAt DateTime @default(now())` | အတူတူပဲ၊ ဒါမှမဟုတ် `createdAt temporal.CreatedAt` | နှစ်ခုလုံး အလုပ်လုပ်ပါတယ်၊ `timestamptz(3)` columns အနေနဲ့ပါ။ Prisma ORM 7 ရဲ့ `timestamp(3)` ကို ဆက်ထိန်းချင်ရင် `(storage: timestamp)` ကို ထည့်ပါ။ `@default(now())` က database default ပါ။ `temporal.CreatedAt` ကတော့ Prisma ORM က သင့် application ရဲ့ clock ကနေ သတ်မှတ်ပေးပြီး — column မှာ database default လုံးဝ မရှိပါဘူး |
| `String @id @default(uuid())` | `String @id @onCreate(uuid())` | `@default` က အခု database default သက်သက်ပဲ ဖြစ်ပြီး — Prisma ORM က generate လုပ်တဲ့ value ကို `@onCreate(...)` အနေနဲ့ ရေးပါတယ်။ `uuid(7)`၊ `ulid()` နဲ့ `nanoid()` တို့အတွက်လည်း အတူတူပါပဲ။ `@default(uuid())` ကို `PSL_GENERATOR_IN_DEFAULT` နဲ့ ပယ်ချပါတယ်။ [Generated values](/docs/prisma/psl-syntax) မှာ functions တွေ စာရင်းပြုစုထားပါတယ် |
| `String @default(cuid())` | `String @onCreate(cuid(2))` | `2` က cuid version ပါ။ ရိုးရိုး `cuid()` ကို ပယ်ချပါတယ် |
| `@default(dbgenerated("gen_random_uuid()"))` | ``@default(sql`gen_random_uuid()`)`` | `dbgenerated` ကို ပယ်ချပါတယ်။ SQL expression တိုင်းကို `` sql`...` `` အနေနဲ့ ရေးပါ၊ ဒါပေမယ့် `now()` နဲ့ `autoincrement()` ကိုတော့ ရိုးရိုး function အနေနဲ့ပဲ ဆက်ရေးပါ။ [Default values](/docs/prisma/psl-syntax) မှာ default အမျိုးအစားတိုင်းကို ဖော်ပြထားပါတယ် |
| `Json` | `Jsonb` | Prisma ORM 7 ရဲ့ `Json` က PostgreSQL `jsonb` column ကို သိမ်းခဲ့တာမို့ — `Jsonb` လို့ ရေးပါ။ Prisma ORM 8 မှာ `Json` ဆိုတာ PostgreSQL ရဲ့ အဟောင်း `json` type ကို ဆိုလိုပြီး — အဲဒါကို သင်လိုချင်မှာ သေချာပေါက် မဟုတ်ပါဘူး |
| `Json @default("{}")` | ``Jsonb @default(json`{}`)`` | JSON default ကို `` json`...` `` အနေနဲ့ ရေးပါ။ Quote ခတ်ထားတဲ့ string က text ဖြစ်ပြီး — JSON column က အဲဒါကို လက်မခံပါဘူး |
| `DateTime @default("2024-01-01T00:00:00Z")`, `Bytes @default("aGVsbG8=")` | ``DateTime @default(timestamptz`2024-01-01T00:00:00Z`)``, ``Bytes @default(bytea`\x68656c6c6f`)`` | ပုံသေ date၊ time ဒါမှမဟုတ် bytes default ကို column ရဲ့ type နာမည်၊ ပြီးရင် backtick ထဲက value အနေနဲ့ ရေးပါ။ `bytea` default က `\x` နောက်မှာ hexadecimal ကို ကိုင်ထားပြီး — base64 မဟုတ်ပါဘူး |
| `enum Role { ADMIN USER }`၊ database အသစ်တစ်ခုမှာ | `enum Role { ADMIN USER }` | Syntax အတူတူပါပဲ။ Members တွေကို explicit values ပေးလို့ရပါတယ် (`ADMIN = "admin"`)။ Column ကို text အနေနဲ့ သိမ်းပြီး — PostgreSQL enum type အနေနဲ့ မဟုတ်ပါဘူး |
| `enum Role { ADMIN USER }` နဲ့ field `role Role`၊ ရှိပြီးသား Prisma ORM 7 database တစ်ခုမှာ | `native_enum Role { ADMIN = "ADMIN" USER = "USER" }` နဲ့ field `role pg.enum(Role)` | သင့် database မှာ အဲဒါအတွက် PostgreSQL enum type ရှိပြီးသား ဖြစ်ပြီး — `native_enum` က အဲဒါကို ဆက်ထိန်းထားပါတယ်။ ဇယားအောက်က မှတ်ချက်ကို ကြည့်ပါ |
| `String[]` | `String[]`၊ ဒါမှမဟုတ် `String?[]` | `String[]` column အတွက် Prisma ORM 8 က `NULL` element တွေကို ပယ်ချတဲ့ database check constraint တစ်ခု ဖန်တီးပေးပါတယ်။ ခွင့်ပြုချင်ရင် `String?[]` လို့ ရေးပါ — ဥပမာ Prisma ORM 7 က ဖန်တီးထားတဲ့ column မှာ အဲဒါတွေ ရှိပြီးသား ဖြစ်နေတဲ့အခါမျိုးပါ။ List filters (`has`, `hasEvery`, `hasSome`, `isEmpty`) တွေ မရနိုင်ပါဘူး; လောလောဆယ် list ပေါ်မှာ filter လုပ်ချင်ရင် raw SQL နဲ့ လုပ်ပါ (အောက်မှာ ကြည့်ပါ) |
| `@@schema("billing")` | `namespace billing { model ... }` | `namespace` block က PostgreSQL schema တစ်ခု ဖြစ်ပြီး — model တွေကို အဲဒီထဲ ထည့်ပါ။ အဲဒါတွေက `db.orm.billing.Invoice` စသဖြင့် ဖြစ်လာပါတယ် |
| implicit many-to-many (`Tag` ပေါ်မှာ `Post[]`၊ `Post` ပေါ်မှာ `Tag[]`၊ join table အတွက် model မရှိ) | အဲဒီ list field နှစ်ခုအတူတူပဲ၊ အပေါင်း join table အတွက် model တစ်ခု | join table ကို model အနေနဲ့ ကိုယ်တိုင် ရေးပါ။ ဥပမာက အောက်မှာ ပါတယ် |
| `@id`, `@unique`, `@default`, `@relation`, `@map`, `@@map`, `@@index`, `@@id`, `@@unique` | မပြောင်းလဲပါ | `@@map` မပါတဲ့ model က သူ့ table ကို model နာမည်အတိုင်း — ရေးထားတဲ့အတိုင်း အတိအကျ — နာမည်ပေးပါတယ်။ Prisma ORM 7 မှာလည်း ဒီလိုပါပဲ |
| optional foreign key တစ်ခုပေါ်က required relation field၊ ဒါမှမဟုတ် အဲဒါရဲ့ ပြောင်းပြန် | ပယ်ချသည် | `8.0.0-rc.10` ကတည်းက `contract emit` က `PSL_RELATION_NULLABILITY_MISMATCH` ကို report လုပ်ပါတယ်။ Relation field နဲ့ သူ့ရဲ့ `@relation(fields: [...])` columns တွေမှာ `?` ကို အတူတူ ထည့်ပါ ဒါမှမဟုတ် နှစ်ခုလုံး မထည့်ဘဲ ထားပါ |

> **မှတ်ချက် — Contract file ရဲ့ ပထမဆုံး လိုင်း**
>
> Prisma ORM 8 `.prisma` contract file တိုင်းက `// use prisma-8` နဲ့ စရပါတယ်။ `prisma orm init` က အဲဒီလိုင်းကို ရေးပေးပါတယ်၊ ဒါကြောင့် contract file ကို ကိုယ်တိုင် လက်နဲ့ ဖန်တီးတဲ့အခါမှပဲ သင်ကိုယ်တိုင် ထည့်ရပါတယ်။ `prisma contract emit` က ဒီလိုင်းနဲ့ စတဲ့ `.prisma` files တွေကိုပဲ ဖတ်ပြီး — ကျန်တာတွေကို warning မပေးဘဲ ကျော်သွားပါတယ်။ [Prisma editor extension](/docs/prisma/editor-support) ကလည်း ဒီလိုင်းမပါတဲ့ file ကို အသိအမှတ် မပြုပါဘူး။

> **မှတ်ချက် — Prisma ORM 7 က ဖန်တီးထားတဲ့ database ထဲက enums**
>
> Prisma ORM 7 က `enum` တစ်ခုချင်းစီကို PostgreSQL enum type အနေနဲ့ သိမ်းခဲ့ပါတယ်။ အဲဒီ type ကို ဆက်ထိန်းချင်ရင် enum ကို `native_enum` နဲ့ ကြေညာပါ၊ member တိုင်းကို explicit value ပေးပါ၊ ပြီးရင် field ရဲ့ type ကို `pg.enum(Role)` လို့ ရေးပါ။ `temporal.` လိုပဲ `pg.` ကလည်း contract syntax ရဲ့ အစိတ်အပိုင်းမို့ — import လုပ်စရာ မရှိပါဘူး။
>
> ```prisma title="src/prisma/contract.prisma (excerpt)"
> native_enum Role {
>   ADMIN = "ADMIN"
>   USER  = "USER"
> }
>
> model User {
>   id   Int           @id @default(autoincrement())
>   role pg.enum(Role)
> }
> ```
>
> `pg.enum(...)` field က `eq` နဲ့ `in` filters တွေကို ထောက်ပံ့ပြီး — `like` ဒါမှမဟုတ် `ilike` ကို မထောက်ပံ့ပါဘူး။ နောက်ပိုင်း ရိုးရိုး `enum` ကို ပြောင်းလို့ရပါတယ်၊ ဒါပေမယ့် အဲဒါက column type ကို ပြောင်းတာမို့ migration တစ်ခု လိုပါတယ်။

> **မှတ်ချက် — DateTime values နဲ့ Node.js versions**
>
> `DateTime` type က သူ့ values တွေကို Prisma ORM 7 လိုပဲ JavaScript `Date` objects အနေနဲ့ ဖတ်ပြီး ရေးပါတယ်၊ polyfill လည်း မလိုပါဘူး။ `Date` တစ်ခုက millisecond အထိပဲ ဆံ့ပါတယ်။ `timestamptz` column တစ်ခု သိမ်းနိုင်တဲ့ microseconds တွေကို ထိန်းချင်ရင် `DateTime(as: temporal)` လို့ ရေးပါ — အဲဒါက `Temporal.Instant` ကို ဖတ်ပါတယ်; ဒါမှမဟုတ် ISO 8601 string ဖတ်တဲ့ `DateTime(as: string)` ကို ရေးပါ။
>
> `Temporal` က Node.js 26 နဲ့ အထက်မှာ ပါပြီး — Node.js 22 ဒါမှမဟုတ် 24 မှာတော့ မပါပါဘူး။ အဲဒီ versions တွေမှာ `Temporal` value ဖတ်တဲ့ type တစ်ခုကို သုံးမယ်ဆိုရင် `temporal-polyfill` ကို install လုပ်ပြီး `src/prisma/db.ts` ရဲ့ အပေါ်ဆုံးမှာ ဒီလိုင်းကို ထည့်ပါ:
>
> ```ts
> import "temporal-polyfill/full/global";
> ```
>
> Homebrew ရဲ့ Node.js 26 build မှာ `Temporal` မပါပါဘူး၊ ဒါကြောင့် `node -p "typeof Temporal"` နဲ့ စစ်ပါ; `undefined` လို့ ပြရင် polyfill ကို ထည့်ပါ။
>
> `orm init --from-prisma7-schema` က ပြင်ဆင်ပေးသလို Prisma ORM 8 က သင့် `schema.prisma` ကို `prisma7Schema(...)` ကနေ ဖတ်တဲ့အခါ — `@db.Timestamp` ဒါမှမဟုတ် `@db.Timestamptz` ပါပါ မပါပါ `DateTime` field ကလည်း `Date` အနေနဲ့ပဲ ဖတ်ပြီး ရေးပါတယ်။ `@db.Date` ဒါမှမဟုတ် `@db.Time` field ကတော့ ISO 8601 string အနေနဲ့ ဖတ်ပြီး — ဥပမာ `2026-09-14` ဒါမှမဟုတ် `10:00:00.5` ပါ။ ဘယ်ဟာမှ `Temporal` မလိုပါဘူး။ [Use a Prisma ORM 7 schema](https://www.prisma.io/docs/cli/configuration#use-a-prisma-orm-7-schema) မှာ type တစ်ခုချင်းစီကို စာရင်းပြုစုထားပါတယ်။

Many-to-many relation တစ်ခုက list field နှစ်ခုကို ဆက်ထိန်းထားပြီး — join table အတွက် model တစ်ခု ထပ်ထည့်ပါတယ်။ သူ့ primary key က foreign key နှစ်ခုပဲ ဖြစ်ရမယ်၊ အခြား ဘာမှ မပါရပါဘူး — အောက်က `@@id([postId, tagId])` လိုပါ:

```prisma title="src/prisma/contract.prisma"
// use prisma-8

model Post {
  id   Int    @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model PostTag {
  postId Int
  tagId  Int
  post   Post @relation(fields: [postId], references: [id])
  tag    Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
}
```

ဒါက ရေးထားတဲ့အတိုင်း ပြည့်စုံပါပြီ: `Post` ဒါမှမဟုတ် `Tag` ပေါ်မှာ `PostTag[]` field ထည့်စရာ မလိုပါဘူး။ `.include("tags")` က `post.tags` ကို `Tag[]` အနေနဲ့ ပေးပြီး — `connect` နဲ့ `disconnect` က အဲဒါပေါ်မှာ အလုပ်လုပ်ပါတယ်။ `set` ကတော့ မလုပ်ပါဘူး; အောက်က [Not available](#မရနိုင်သေးတဲ့-အရာတွေ-not-available) ကို ကြည့်ပါ။

Join table က Prisma ORM 7 ကတည်းက ရှိပြီးသားဆိုရင် — အဲဒါက `_PostToTag` လို့ နာမည်ရပြီး `A` နဲ့ `B` columns ရှိပါတယ်။ Table ကို ဆက်ထိန်းချင်ရင် model ကို အဲဒီနာမည်တွေဆီ map လုပ်ပါ: model ပေါ်မှာ `@@map("_PostToTag")`၊ အက္ခရာစဉ်အရ ပထမဆုံး လာတဲ့ နာမည်ရှိတဲ့ model ဆီ ညွှန်တဲ့ field (`postId`) ပေါ်မှာ `@map("A")`၊ ကျန်တစ်ခု (`tagId`) ပေါ်မှာ `@map("B")` ထည့်ပါ။

Config file က `generator` နဲ့ `datasource` blocks တွေကို အစားထိုးပါတယ်။ ဒါက PostgreSQL အတွက် ဖြစ်ပါတယ်:

```ts title="prisma.config.ts"
import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: process.env.DATABASE_URL!,
    },
  }),
});
```

`orm` section က ဒီ keys တွေကို လက်ခံပါတယ်:

* `contract`: သင့် contract file ရဲ့ path၊ ဒါမှမဟုတ် [contract ကို file များစွာနဲ့ ရေးတဲ့](/docs/prisma/psl-syntax)အခါ သုံးတဲ့ glob။ PostgreSQL မှာဆိုရင် `prisma7Schema("prisma/schema.prisma")` လည်း ဖြစ်နိုင်ပြီး — `prisma7Schema` ကို `defineConfig` ဘေးမှာ `@prisma/orm-postgres/config` ကနေ import လုပ်ပါတယ်။ အဲဒီအခါ schema က Prisma ORM 7 syntax အတိုင်း ကျန်နေတာမို့ — အပေါ်က ဇယားထဲက ပြောင်းလဲမှုတွေ သက်ရောက်မှာ မဟုတ်ဘဲ `// use prisma-8` လိုင်းလည်း မလိုပါဘူး။ `contract emit` က Prisma ORM 8 မဖတ်နိုင်တဲ့ အပိုင်းတစ်ခုခု — ဥပမာ `view` block — ပေါ်မှာ fail ဖြစ်ပြီး error က လိုင်းနံပါတ်ကို ဖော်ပြကာ Prisma ORM 7 schema မှာ ဘာပြောင်းသင့်လဲ စိတ်ကူးပေးပါတယ်; [Use a Prisma ORM 7 schema](https://www.prisma.io/docs/cli/configuration#use-a-prisma-orm-7-schema) ကို ကြည့်ပါ။
* `db`: connection။
* `output` (optional): `contract.json` နဲ့ `contract.d.ts` ကို ဘယ်မှာ ရေးမလဲ။ Default: contract ဘေးမှာ။
* `extensions` (optional): database extensions တွေ၊ ဥပမာ `extensions: [pgvector]` နဲ့ `import pgvector from "@prisma/orm-extension-pgvector/control"`။ [Using extensions](/docs/prisma/using-extensions) ကို ကြည့်ပါ။
* `migrations` (optional): `{ dir: "migrations" }`၊ `prisma.config.ts` နဲ့ ဆက်စပ်တဲ့ နေရာ။ သင့်ကိုယ်ပိုင် migrations တွေက အဲဒါအောက်က `migrations/app/` ထဲမှာ သွားပါတယ်။

`provider` setting ဆိုတာ မရှိပါဘူး; `@prisma/orm-postgres/config` ကနေ import လုပ်တာက PostgreSQL ကို ရွေးချယ်ပေးတာပါ။

## Commands (Command များ)

Prisma ORM 8 command-line tool က commands တွေကို သူတို့ သက်ရောက်တဲ့ အရာအလိုက် အုပ်စုဖွဲ့ပါတယ်: သင့် contract file အတွက် `contract`၊ သင်ချိတ်ဆက်ထားတဲ့ database အတွက် `db`၊ သင့် repository ထဲက migration files တွေအတွက် `migration` ပါ။

| Prisma ORM 7 | Prisma ORM 8 | မှတ်ချက် |
| --- | --- | --- |
| `prisma generate` | `prisma contract emit` | contract ကို ပြောင်းတိုင်း ဒါကို run ပါ။ `contract.json` နဲ့ `contract.d.ts` ကို ရေးပေးပါတယ်; နှစ်ခုလုံးကို commit လုပ်ပါ |
| `prisma migrate dev` | `prisma db update`၊ ဒါမှမဟုတ် `prisma migration plan` ပြီးရင် `prisma db migrate` | ဇယားအောက်က စာပိုဒ်ကို ကြည့်ပါ |
| `prisma migrate deploy` | `prisma db migrate` | သင့် repository ထဲက migration files တွေကို apply လုပ်ပါတယ် |
| `prisma migrate status` | `prisma migration status` | database က ဘယ် migrations တွေကို apply လုပ်ပြီးလဲ report လုပ်ပါတယ် |
| `prisma db push` | ပထမဆုံးအကြိမ်၊ database အလွတ်မှာ `prisma db init`; ပြီးနောက်ပိုင်း `prisma db update` | `db init` က tables တွေ ဖန်တီးပါတယ်; `db update` က ရှိပြီးသား tables တွေကို contract နဲ့ ကိုက်ညီအောင် ပြောင်းပါတယ်။ သင့် Prisma ORM 7 tables တွေ ရှိပြီးသား database အတွက်တော့ နှစ်ခုလုံး မ run ပါနဲ့; [step 4 of the migration guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql#4-transfer-migration-ownership) ကို ကြည့်ပါ။ [`db update`](https://www.prisma.io/docs/cli/db-update) ကို ကြည့်ပါ |
| `prisma db pull` | `prisma contract infer` | ရှိပြီးသား database ကနေ contract ရဲ့ ပထမဆုံး draft ကို ရေးပေးပါတယ် |
| `prisma migrate diff` | database မှာ ဘာတွေ ပြောင်းမလဲ ကြည့်ဖို့ `prisma db update --dry-run`၊ ဒါမှမဟုတ် migration file တစ်ခု ဘာလုပ်လဲ ထုတ်ပြဖို့ `prisma migration show <migration name>` | `<migration name>` က `migrations/app/` အောက်က folder နာမည် ဖြစ်ပြီး — ဥပမာ `20260911T1030_add_bio` ပါ။ Migration နှစ်ခုကို migration file အသစ်တစ်ခုအဖြစ် diff လုပ်ချင်ရင် `prisma migration plan --from <migration name> --to <migration name>` ကို သုံးပါ |
| `prisma migrate resolve --applied` | [Rollbacks and recovery](/docs/prisma/rollbacks-and-recovery) ကို ကြည့်ပါ | တစ်ဝက်မှာ fail သွားတဲ့ migration အတွက် |
| သင့် schema နဲ့ ကိုက်ညီပြီးသား database အတွက် `prisma migrate resolve` | [step 4 of the migration guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql#4-transfer-migration-ownership) | ဒီ guide က database က ဘယ် contract နဲ့ ကိုက်ညီလဲဆိုတာကို database ထဲမှာရော သင့် repository ထဲမှာပါ မှတ်တမ်းတင်ပါတယ်။ Commands တွေကို ကိုယ်တိုင် run မယ့်အစား ဒါကို လိုက်ပါ |
| `prisma migrate reset` | `prisma db update` | Prisma ORM 8 က database ကို ဘယ်တော့မှ reset မလုပ်ပါဘူး။ `db update` က migration history ကို ဆက်ထိန်းစရာ မလိုတဲ့ database ကို သင့် contract ဆီ ရွှေ့ပေးပြီး — data ဆုံးရှုံးမယ့်အခါ မလုပ်ခင် မေးပါတယ်။ production လိုမျိုး migrations ကနေပဲ ပြောင်းတဲ့ database ကိုတော့ `prisma db migrate` နဲ့ ရွှေ့ပါတယ် |
| `prisma db seed` | မရှိပါ | seed command မရှိပါဘူး။ `src/prisma/db.ts` ကနေ `db` ကို import လုပ်ပြီး `.create(...)` ကို ခေါ်တဲ့ script တစ်ခု ရေးပါ၊ ပြီးရင် TypeScript file တိုင်း run သလိုပဲ run ပါ — ဥပမာ `npx tsx src/prisma/seed.ts` |
| `prisma studio` | Prisma ORM 8 tool ထဲမှာ မရှိပါ | Studio ကို Prisma ORM 7 tool နဲ့ — သင့် project အပြင်ဘက် directory တစ်ခုကနေ — connection string ကို အတိအကျ ရေးပြီး run ပါ: `cd /tmp && npx prisma@7 studio --url "postgresql://user:password@localhost:5432/mydb"`။ [Studio with Prisma ORM](https://www.prisma.io/docs/studio/prisma-next) ကို ကြည့်ပါ |
| `prisma format` | `prisma contract format` | |
| `prisma validate` | မရှိပါ | contract မမှန်ရင် `prisma contract emit` က fail ဖြစ်ပြီး — `prisma db verify` က database နဲ့ ယှဉ်စစ်ပါတယ် |

Prisma ORM 8 tool မှာ `prisma migrate dev`၊ `deploy`၊ `status`၊ `diff`၊ `reset` ဒါမှမဟုတ် `resolve` လို့ ရိုက်လိုက်ရင် — exit code `2` နဲ့ error code `CLI.COMMAND_MOVED` နဲ့ ထွက်သွားပြီး၊ သူ့ရဲ့ next action က သုံးသင့်တဲ့ Prisma ORM 8 command ကို ဖော်ပြပါတယ်။ သင့် migrations တွေကို Prisma ORM 8 ဆီ မလွှဲခင်အထိ — [step 4 of the migration guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql#4-transfer-migration-ownership) မှာ — `migrate dev`၊ `migrate deploy` နဲ့ `migrate status` တို့ကို Prisma ORM 7 tool နဲ့ပဲ ဆက် run ပါ; အဲဒီ tool ကို guide က `prisma7` အနေနဲ့ install လုပ်ပေးပါတယ်။ ဥပမာ `npx prisma7 migrate dev` ပါ။

နေ့စဉ်လုပ်ငန်းမှာ `prisma migrate dev` ကို အစားထိုးတဲ့ loop က ဒီလိုပါ: contract ကို edit လုပ်ပါ၊ `prisma contract emit` ကို run ပါ၊ ပြီးရင် ပြောင်းလဲမှုကို development database ပေါ်မှာ apply လုပ်ဖို့ `prisma db update` ကို run ပါ။ `db update --dry-run` က ဘာတွေ ပြောင်းမလဲ ပြပေးပြီး — `db update` က data ဆုံးရှုံးစေတဲ့ operation တစ်ခုကို မ apply ခင် မေးပါတယ်။ Model ဒါမှမဟုတ် field တစ်ခုကို နာမည်ပြောင်းပြီး သူ့ data ကို ဆက်ထိန်းချင်ရင် `--rename <old>:<new>` ကို ပေးပါ။ Commit လုပ်လို့ရတဲ့ migration file တစ်ခု လိုချင်ရင်တော့ `db update` အစား `prisma migration plan` ကို run ပါ; အဲဒါက `migrations/app/` အောက်မှာ folder တစ်ခု ရေးပေးပြီး အထဲမှာ ဖတ်လို့၊ edit လုပ်လို့၊ commit လုပ်လို့ရတဲ့ `migration.ts` ပါပါတယ်။ ပြီးရင် `prisma db migrate` က အဲဒါကို apply လုပ်ပါတယ်။ [Generating a migration](/docs/prisma/generating-a-migration) ကို ကြည့်ပါ။

သင်ပထမဆုံး တွေ့ရမယ့် command အသစ် လေးခု:

* `prisma orm init` က project တစ်ခုမှာ Prisma ORM 8 ကို setup လုပ်ပါတယ်: config file၊ starter contract နဲ့ `db.ts` ([Before you start](#မစတင်ခင်-before-you-start) ကို ကြည့်ပါ)။
* `prisma db init` က database အလွတ်တစ်ခုမှာ သင့် contract အတွက် tables တွေ ဖန်တီးပါတယ်။ (`db update` က tables ရှိပြီးသား database အတွက်ပါ။)
* `prisma db verify` က database က သင့် contract နဲ့ ကိုက်ညီနေသေးလား စစ်ပါတယ်။
* `prisma db sign` က database က သင့် contract နဲ့ ကိုက်ညီတယ်ဆိုတာကို database ထဲမှာ မှတ်တမ်းတင်ပါတယ်။ Migration guide ရဲ့ step 4 က သင့်ရှိပြီးသား database အတွက် ဒါကို run ပါတယ်; သင်ကိုယ်တိုင် ရိုက်ဖို့ ဆိုတာ ရှားပါတယ်။

ကျန်တာတွေက [CLI reference](https://www.prisma.io/docs/cli) မှာ ရှိပါတယ်။

## `src/prisma/db.ts` က `PrismaClient` ကို အစားထိုးခြင်း

Prisma ORM 8 က `PrismaClient` ကို generate မလုပ်တော့ပါဘူး၊ ဒါကြောင့် client ကို သင်ကိုယ်တိုင် — တစ်ကြိမ်တည်း — `src/prisma/db.ts` ထဲမှာ `prisma contract emit` က ရေးခဲ့တဲ့ `contract.json` နဲ့ `contract.d.ts` ကနေ ဖန်တီးရပါတယ်:

```ts title="src/prisma/db.ts"
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: process.env.DATABASE_URL!,
});
```

`prisma orm init` က ဒီ file ကို သင့်အတွက် ရေးပေးပါတယ်။ ဒီ page ပေါ်က ဥပမာတိုင်းက အဲဒီကနေ `db` ကို import လုပ်ပါတယ်။

`db` မှာ ဒီအစိတ်အပိုင်းတွေ ရှိပါတယ်:

* `db.orm`: သင့် models တွေ၊ model နာမည်အလိုက် (`db.orm.public.User`)။
* `db.sql`: [SQL query builder](https://www.prisma.io/docs/orm/reference/sql-query-builder)။ ဒါက သင့် tables တွေကို table နာမည်အလိုက် ကိုင်ထားပြီး — `db.sql.public.User` လိုပါ။ `@@map` မသတ်မှတ်ထားရင် table နာမည်က သူ့ model ရဲ့ နာမည်ပါ။ ဒီ page မှာ raw SQL ဥပမာတွေက ဒါကို column တစ်ခုချင်းစီရဲ့ type ပေးဖို့ပဲ သုံးပါတယ်။
* `db.raw.sql`: SQL query တစ်ခုကို text အနေနဲ့ ရေးခွင့်ပြုပါတယ်။
* `db.query(query)` နဲ့ `db.execute(query)`: `.build()` နဲ့ အပြီးသတ်ထားတဲ့ query တစ်ခုကို run ပါတယ် — အောက်က raw queries တွေလိုပါ။ `db.toSql(query)` က ပို့မယ့် SQL ကို ပြပါတယ်။
* `db.transaction`: queries တွေကို transaction တစ်ခုထဲမှာ run ပါတယ်။

Middleware ထည့်ချင်ရင်တော့ အပေါ်က `postgres({ ... })` call မှာ `middleware: [...]` key ကို ထည့်ပါ။ Middleware ဆိုတာ နာမည်တစ်ခုနဲ့ hook function တစ်ခု ဒါမှမဟုတ် နှစ်ခုအထက် ပါတဲ့ ရိုးရိုး object တစ်ခုပါ — ဥပမာ `{ name: "log", async beforeEncode(plan) { console.log(plan.sql); } }`။ [How middleware works](/docs/prisma/how-middleware-works) မှာ hooks တွေကို စာရင်းပြုစုထားပါတယ်။

## Query တွေ (Queries)

Query တစ်ခုဆိုတာ call တွေကို chain လုပ်ပြီး တစ်ခုတည်းအနေနဲ့ `await` လုပ်တဲ့ ပုံစံပါ။ ဘာကို ပြန်ချင်တာလဲဆိုတာကို options object ကြီးတစ်ခုပါတဲ့ method တစ်ခုတည်းနဲ့ မဟုတ်ဘဲ — နောက်ဆုံး call (`.all()`, `.first()`, `.create(...)` စသဖြင့်) ကပဲ ဖော်ပြပေးပါတယ်။

| Prisma ORM 7 | Prisma ORM 8 |
| --- | --- |
| `new PrismaClient()` | `db` — အပေါ်က `src/prisma/db.ts` ထဲကပါ။ အောက်က ဥပမာတွေက `src/` အောက် တိုက်ရိုက် ရှိတဲ့ file တစ်ခုထဲမှာ ရှိတယ်လို့ ယူဆထားလို့ import path က `./prisma/db` ဖြစ်ပါတယ် |
| `prisma.user` | `db.orm.public.User` (`public` က PostgreSQL schema ပါ။ ကိုယ်တိုင် schema တစ်ခု မဖန်တီးထားရင် table တိုင်းက `public` ထဲမှာ ရှိပါတယ်) |
| `findMany({ where })` | `.where(...).all()` |
| `findFirst({ where })` | `.where(...).first()`။ ဘာမှ မကိုက်ညီရင် `null` ပြန်ပါတယ်။ `.first({ id: 1 })` က `.where({ id: 1 }).first()` ရဲ့ အတိုကောက်ပါ |
| `findUnique({ where })` | `.whereUnique({ email }).first()` ကို သုံးပြီး `null` ဖြစ်မဖြစ် စစ်ပါ။ PostgreSQL မှာ `whereUnique` က primary key ဒါမှမဟုတ် unique constraint တစ်ခုရဲ့ fields တွေကို ယူပါတယ်၊ ပြီးတော့ အဲဒီနောက်မှာ rows အများကြီး ပြန်နိုင်တဲ့ call က compile မဖြစ်ပါဘူး။ MongoDB မှာတော့ `.where(...).first()` ပါ |
| `where: { id: 1, active: true }` | `.where({ id: 1, active: true })`; နှိုင်းယှဉ်မှုတွေအတွက် `.where((u) => u.age.gt(18))`။ [Filter condition နဲ့ operator တွေ](https://www.prisma.io/docs/orm/reference/orm-client#filter-conditions-and-operators) မှာ အားလုံးကို စာရင်းပြုစုထားပါတယ် |
| `select: { id: true, email: true }` | `.select("id", "email")` |
| `include: { posts: { where: ... } }` | `.include("posts")`၊ ဒါမှမဟုတ် ဆက်စပ် record တွေကို filter ဒါမှမဟုတ် sort လုပ်ဖို့ `.include("posts", (posts) => posts.where({ published: true }))` |
| `where: { name: { contains: "ali" } }` | `.where((u) => u.name.like("%ali%"))`; `startsWith` နဲ့ case-insensitive matching အတွက် [မရနိုင်သေးတဲ့ အရာတွေ](#မရနိုင်သေးတဲ့-အရာတွေ-not-available) ကို ကြည့်ပါ |
| `orderBy: { createdAt: "desc" }` | `.orderBy((u) => u.createdAt.desc())` |
| `take` / `skip` | `.limit(n)` / `.offset(n)` |
| `distinct: ["country"]` | `.distinct("country")` |
| `create({ data: { ... } })` | `.create({ ... })` — `data` wrapper မလိုပါ |
| `create({ data: { ..., posts: { create: [...] } } })` | `.create({ ..., posts: (p) => p.create([...]) })`; `connect` လည်း အလားတူပဲ အလုပ်လုပ်ပါတယ် |
| `createMany({ data: [...] })` | Rows ပြန်ရဖို့ `.createAll([...])`၊ ဒါမှမဟုတ် count ရဖို့ `.createAndCount([...])` |
| `createMany({ data: [...], skipDuplicates: true })` | `.createAll([...], { onConflict: "skip" })` ဒါမှမဟုတ် `.createAndCount([...], { onConflict: "skip" })` |
| `where: { title: { search: "cat & dog" } }` — `fullTextSearchPostgres` preview feature နဲ့အတူ | `.where((p) => p.title.fullTextMatches(toTsquery("cat & dog")))`။ အောက်က [စာသားအပြည့် ရှာဖွေခြင်း](#စာသားအပြည့်-ရှာဖွေခြင်း-full-text-search) ကို ကြည့်ပါ |
| `update({ where, data })` | `.where(...).update({ ... })` |
| `updateMany({ where, data })` | Rows အတွက် `.where(...).updateAll({ ... })`၊ ဒါမှမဟုတ် count အတွက် `.updateAndCount({ ... })` |
| `delete({ where })` | `.where(...).delete()` |
| `deleteMany({ where })` | Rows အတွက် `.where(...).deleteAll()`၊ ဒါမှမဟုတ် count အတွက် `.deleteAndCount()` |
| `upsert({ where, create, update })` | `.upsert({ create: { email: "a@b.c", name: "A" }, update: { name: "A" }, conflictOn: { email: "a@b.c" } })`။ `create` က ထည့်မယ့် row ပါ။ `conflictOn` က unique column တစ်ခုကို သူ့ value နဲ့အတူ ယူပါတယ်; အဲဒီ value ပါတဲ့ row ရှိပြီးသားဆိုရင် ထည့်မယ့်အစား အဲဒီ row ပေါ်မှာ `update` ကို apply လုပ်ပါတယ်။ Primary key ကို သုံးချင်ရင် `conflictOn` ကို ချန်ထားပါ |
| `count({ where })` | `.where(...).aggregate((agg) => ({ total: agg.count() }))` — object တစ်ခု `{ total: 5 }` ကို ပြန်ပေးပါတယ် |
| `aggregate({ _sum, _avg })` | `.aggregate((agg) => ({ total: agg.sum("views"), average: agg.avg("views") }))` |
| `groupBy({ by, _count })` | `.groupBy("userId").aggregate((agg) => ({ count: agg.count() }))` |
| `$transaction(async (tx) => ...)` | `db.transaction(async (tx) => ...)`; အတွင်းမှာ `db.orm` အစား `tx.orm` ကနေ query လုပ်ပါ |
| `$queryRaw` | အောက်က raw SQL ဥပမာကို ကြည့်ပါ |
| `$queryRaw` နဲ့ `SELECT ... FOR UPDATE` — rows တွေကို lock လုပ်ဖို့ | `db.transaction(...)` အတွင်းမှာ [ORM collection](https://www.prisma.io/docs/orm/reference/orm-client#row-locking) ဒါမှမဟုတ် [SQL query builder](https://www.prisma.io/docs/orm/reference/sql-query-builder#row-locking) ရဲ့ `SELECT` ပေါ်မှာ `.forUpdate()`။ ကျန် lock တွေကို `forNoKeyUpdate()`, `forShare()` နဲ့ `forKeyShare()` တို့က ယူပါတယ် |
| `$executeRaw` | အောက်က raw SQL ဥပမာကို ကြည့်ပါ |
| `$connect()` | `db.connect()`။ အများအားဖြင့် မလိုပါဘူး — client က ပထမဆုံး query မှာ connect လုပ်ပါတယ် |
| `$disconnect()` | `db.close()` |

### Filter နဲ့ ရှာခြင်း (Find with a filter)

Prisma ORM 7 နဲ့ Prisma ORM 8 ကို နှိုင်းယှဉ်ကြည့်ရအောင်:

```ts title="Prisma ORM 7"
const users = await prisma.user.findMany({
  where: { active: true },
  select: { id: true, email: true },
  orderBy: { createdAt: "desc" },
  take: 10,
});
```

```ts title="Prisma ORM 8"
import { db } from "./prisma/db";

const users = await db.orm.public.User
  .where({ active: true })
  .select("id", "email")
  .orderBy((u) => u.createdAt.desc())
  .limit(10)
  .all();
```

### Record တစ်ခု ဖန်တီးခြင်း (Create a record)

`data` wrapper မပါဘဲ တိုက်ရိုက် ရေးလို့ရပါတယ်:

```ts title="Prisma ORM 7"
const user = await prisma.user.create({
  data: { email: "alice@prisma.io", name: "Alice" },
});
```

```ts title="Prisma ORM 8"
const user = await db.orm.public.User.create({
  email: "alice@prisma.io",
  name: "Alice",
});
```

### Raw SQL နဲ့ query ရေးခြင်း (Raw SQL)

```ts title="Prisma ORM 7"
const rows = await prisma.$queryRaw`SELECT id, email FROM "User" WHERE active = true`;
await prisma.$executeRaw`UPDATE "User" SET active = false WHERE id = ${id}`;
```

```ts title="Prisma ORM 8"
// A query that returns rows must say what type each column is.
const user = db.sql.public.User;
const select = db.raw.sql`SELECT id, email FROM "User" WHERE active = true`
  .returnsRow({ id: user.columns.id, email: user.columns.email })
  .build();
const rows = await db.query(select);

// A statement that changes rows: ask for the count.
const update = db.raw.sql`UPDATE "User" SET active = false WHERE id = ${id}`
  .affectedCount()
  .build();
await db.execute(update);
```

Table နာမည်က `User` ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ `@@map` မပါတဲ့ model တစ်ခုက သူ့ table ကို model နာမည်အတိုင်း ပေးထားလို့ပါ။ Prisma ORM 7 လိုပဲ — `${id}` လိုမျိုး `${...}` နဲ့ SQL ထဲ ထည့်လိုက်တဲ့ value ကို database ဆီ query parameter အနေနဲ့ ပို့ပါတယ်။

Rows ပြန်တဲ့ raw query တိုင်းမှာ column တစ်ခုချင်းစီအတွက် type ပါတဲ့ `.returnsRow(...)` လိုပါတယ်၊ ပြီးတော့ အပေါ်မှာ ပြထားသလို type ကို table ကနေ ယူပါတယ်။ Computed column မှာတော့ ယူစရာ table column မရှိလို့ type နာမည်ကို string အနေနဲ့ တိုက်ရိုက် ရေးပါ: `SELECT count(*) AS total FROM "User"` အတွက်ဆိုရင် `.returnsRow({ total: "pg/int8@1" })` လို့ ရေးပါ။ ဒီမှာ `int8` က PostgreSQL column type ဖြစ်ပြီး — ဒီနေ့အထိ type နာမည်တိုင်းက `@1` နဲ့ ဆုံးပါတယ်။ Type နာမည်တွေကို [Raw queries](https://www.prisma.io/docs/orm/reference/raw-queries) မှာ စာရင်းပြုစုထားပါတယ်။ Query ကို `.build()` နဲ့ အဆုံးသတ်ပြီး — rows အတွက်ဆိုရင် `db.query()` ဆီ၊ ဒါမှမဟုတ် write တစ်ခုက ပြောင်းလိုက်တဲ့ row အရေအတွက်အတွက်ဆိုရင် `db.execute()` ဆီ ပေးပို့ပါ။

### Transaction အသုံးပြုခြင်း (Transaction)

```ts title="Prisma ORM 7"
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: "jane@prisma.io" } }),
  prisma.post.create({ data: { title: "Hello" } }),
]);
```

```ts title="Prisma ORM 8"
const result = await db.transaction(async (tx) => {
  const user = await tx.orm.public.User.create({ email: "jane@prisma.io" });
  const post = await tx.orm.public.Post.create({ title: "Hello", authorId: user.id });
  return { user, post };
});
```

### စာသားအပြည့် ရှာဖွေခြင်း (Full-text search)

Search query တစ်ခု ဆောက်ပေးတဲ့ function တွေကို `@prisma/orm-postgres/target/full-text` ကနေ import လုပ်ပါ။ `toTsquery` က PostgreSQL ရဲ့ operator syntax ကို ရေးထားတဲ့အတိုင်း ယူပါတယ် — ဥပမာ `cat & dog` — ပြီးတော့ syntax မမှန်တဲ့ စာသားဆိုရင် fail ဖြစ်ပါတယ်။ ဒါကြောင့် သင့် application ကိုယ်တိုင် ရေးတဲ့ စာသားအတွက်ပဲ သုံးပါ။ User တစ်ယောက် search box ထဲ ရိုက်ထည့်တဲ့ စာသားအတွက်တော့ `websearchToTsquery` ကို သုံးပါ — အဲဒါက quoted phrase တွေ၊ `or` နဲ့ စကားလုံးတစ်လုံးကို ဖယ်ထုတ်ဖို့ ရှေ့မှာ ထည့်ထားတဲ့ `-` တို့ကို လက်ခံပါတယ်။ Relevance နဲ့ စီချင်ရင် တူညီတဲ့ query ကို `fullTextRank` ဆီ ပေးပါ:

```ts title="Prisma ORM 8"
import { websearchToTsquery } from "@prisma/orm-postgres/target/full-text";

const query = websearchToTsquery('"cat food" -dog');
const posts = await db.orm.public.Post
  .where((p) => p.title.fullTextMatches(query))
  .orderBy((p) => p.title.fullTextRank(query).desc())
  .all();
```

PostgreSQL က search အတွက် index တစ်ခုကို သုံးနိုင်ဖို့ `Post` model မှာ `@@fullTextIndex([title], name: "post_title_search")` ကို ထည့်ပါ။ Prisma ORM 7 ရဲ့ field အများအပြားပေါ်က `@@fulltext` က weight group အများအပြားပါတဲ့ index တစ်ခု ဖြစ်လာပါတယ် — ဥပမာ `@@fullTextIndex([[title], body], name: "post_search")` — ပြီးတော့ query တစ်ခုက အဲဒါကို နာမည်နဲ့ ရှာပါတယ်: `.where((p, { fns, indexes }) => fns.fullTextMatches(indexes.post_search, query))`။ ကျန် option တွေကို [Full-text search](https://www.prisma.io/docs/orm/reference/orm-client#full-text-search) မှာ ဖော်ပြထားပါတယ်။

## မရနိုင်သေးတဲ့ အရာတွေ (Not available)

Prisma ORM 8 မှာ တိုက်ရိုက် ပုံစံ မရှိတဲ့ Prisma ORM 7 feature တွေနဲ့ အဲဒီအစား ဘာလုပ်ရမလဲဆိုတာပါ။ Status ကော်လံက feature တစ်ခုချင်းစီက မရနိုင်ဘူးလား၊ မတူတဲ့ ပုံစံနဲ့ ရနိုင်လား၊ ဒါမှမဟုတ် `$extends` အတွက်ဆိုရင် middleware နဲ့ အစားထိုးထားလားဆိုတာ ပြပါတယ်။

| Prisma ORM 7 feature | Status | အဲဒီအစား ဘာလုပ်ရမလဲ |
| --- | --- | --- |
| `createMany` ပေါ်က `skipDuplicates` | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | `.createAll(rows, { onConflict: "skip" })` ဒါမှမဟုတ် `.createAndCount(rows, { onConflict: "skip" })`။ ဇယားအောက်က မှတ်ချက်ကို ကြည့်ပါ |
| Update တစ်ခုထဲက `{ increment: n }` / `{ decrement: n }` | မရနိုင်ပါ | ဂဏန်းတွက်ချက်မှုကို raw SQL အနေနဲ့ ရေးပါ (အပေါ်က ဥပမာကို ကြည့်ပါ)၊ ဒါမှမဟုတ် value ကို ဖတ်ပြီး `db.transaction(...)` အတွင်းမှာ ပြန်ရေးပါ |
| `findUniqueOrThrow` / `findFirstOrThrow` | `.firstOrThrow()` | `await db.orm.public.User.whereUnique({ id }).firstOrThrow()` ဒါမှမဟုတ် `.where(...).firstOrThrow()`။ Row တစ်ခုကို ဖတ်ပြီး ဘာမှ မကိုက်ညီရင် `RUNTIME.NO_ROWS` ကုဒ်ပါတဲ့ error ကို throw လုပ်ပါတယ် |
| `mode: "insensitive"` | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | PostgreSQL မှာ text field ပေါ်က `.ilike("%alice%")`။ `%` wildcard တွေကို ကိုယ်တိုင် ရေးရပါတယ် |
| `contains` / `startsWith` / `endsWith` | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | `.like("%alice%")`, `.like("alice%")`, `.like("%alice")`; `%` wildcard တွေကို ကိုယ်တိုင် ရေးရပါတယ် |
| JSON အတွင်းမှာ filter လုပ်ခြင်း (`path`, `string_contains`, `array_contains`) | မရနိုင်ပါ | `Jsonb` field ကို တစ်ခုလုံးအနေနဲ့ပဲ နှိုင်းယှဉ်လို့ရပါတယ် (`eq`, `neq`, `in`, `notIn`)၊ ဒါမှမဟုတ် null ဟုတ်မဟုတ် စစ်လို့ရပါတယ်။ Query ကို raw SQL အနေနဲ့ ရေးပါ (အပေါ်က ဥပမာကို ကြည့်ပါ) |
| Query array ပါတဲ့ `$transaction([...])` | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | `db.transaction(async (tx) => ...)`; အတွင်းက query တွေက တစ်ခုပြီးတစ်ခု run ပါတယ် |
| `User` နဲ့ `Prisma.UserGetPayload<...>` | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | `contract.d.ts` က model တစ်ခုချင်းစီအတွက် type တစ်ခုပါတဲ့ `Models` namespace ကို export လုပ်ပါတယ်။ `Scalars<Models.public_User>` က သာမန် query တစ်ခု ပြန်တဲ့ row ဖြစ်ပြီး — `Shape<Models.public_User, { posts: { "+": "id" \| "title" } }>` က ရွေးထားတဲ့ relation တွေပါတဲ့ row ဖြစ်ကာ — `ResultType<typeof query>` ကတော့ ရေးပြီးသား query တစ်ခု ပြန်တဲ့အရာပါ။ [Model and result types](https://www.prisma.io/docs/orm/reference/orm-client#model-and-result-types) ကို ကြည့်ပါ။ [Types for your code](/docs/prisma/types) မှာ type တိုင်းကို ဖော်ပြထားပါတယ်။ |
| Implicit many-to-many relation တွေ | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | Join table ကို model အနေနဲ့ ရေးပါ; [Schema](#schema) အောက်က ဥပမာကို ကြည့်ပါ |
| `enum` ပေါ်က `@@map` | မရနိုင်ပါ | `contract emit` က `Unknown attribute "@@map" in "enum" block` ဆိုတဲ့ error နဲ့ ပယ်ချပါတယ်။ သာမန် `enum` တစ်ခုကို text အနေနဲ့ သိမ်းထားလို့ နာမည်ပေးစရာ ဘာမှ မရှိပါဘူး။ နာမည်သတ်မှတ်ထားတဲ့ PostgreSQL enum type တစ်ခု လိုရင်တော့ `native_enum` နဲ့ ကြေညာပါ — အဲဒါက `@@map` ကို လက်ခံပါတယ် |
| `$use` middleware | မတူတဲ့ ပုံစံနဲ့ ရနိုင်တယ် | `db.ts` ထဲမှာ client ကို ဖန်တီးတဲ့အခါ `middleware: [...]` ကို ပေးပါ (ဥပမာက အပေါ်က `db.ts` section မှာ ရှိပါတယ်)။ Hook တွေကို [How middleware works](https://www.prisma.io/docs/orm/middleware/how-middleware-works) မှာ စာရင်းပြုစုထားပါတယ် |
| `$extends` | middleware၊ custom collection တွေနဲ့ query fragment တွေနဲ့ အစားထိုးထားတယ် | `$extends` ကို ထည့်မှာ မဟုတ်ပါဘူး။ Query extension တွေကို middleware က အစားထိုးပါတယ်; [How middleware works](https://www.prisma.io/docs/orm/middleware/how-middleware-works) ကို ကြည့်ပါ။ Model method တွေအတွက်ဆိုရင် `Collection` ကို subclass လုပ်ပါ ([Custom `Collection` subclass](https://www.prisma.io/docs/orm/reference/orm-client#custom-collection-subclass))။ Query တွေနဲ့ model တွေကြားမှာ filter တစ်ခု ဒါမှမဟုတ် selection တစ်ခုကို မျှဝေချင်ရင် [query fragment](https://www.prisma.io/docs/orm/reference/orm-client#query-fragments) တစ်ခု ရေးပါ |

> **မှတ်ချက် — ထပ်နေတဲ့ rows တွေကို ကျော်ခြင်း**
>
> `{ onConflict: "skip" }` နဲ့ဆိုရင် `.createAll(...)` နဲ့ `.createAndCount(...)` က table ပေါ်က unique constraint တစ်ခုခုနဲ့ တိုက်မိတဲ့ row တိုင်းကို ကျော်သွားပြီး — `createAll` က database က အမှန်တကယ် ရေးလိုက်တဲ့ rows တွေကိုပဲ ပြန်ပေးပါတယ်။ Unique constraint တစ်ခုတည်းကိုပဲ စောင့်ကြည့်ချင်ရင် `conflictOn` မှာ သူ့ field တွေကို စာရင်းပြုစုပါ:
>
> ```ts title="Prisma ORM 8"
> const created = await db.orm.public.User.createAll(rows, {
>   onConflict: "skip",
>   conflictOn: ["email"],
> });
> ```
>
> ဒီမှာ `conflictOn` က field နာမည်တွေရဲ့ list ပါ။ `upsert` ထဲမှာတော့ field တွေနဲ့ value တွေပါတဲ့ object ဖြစ်ပါတယ်။ `8.0.0-rc.12` မတိုင်ခင် release တစ်ခုက emit လုပ်ထားတဲ့ contract ဆိုရင် call က `ORM.CAPABILITY_MISSING` နဲ့ fail ဖြစ်ပါတယ်။ ဒါကြောင့် သင့် project က အဲဒီ release မတိုင်ခင် Prisma ORM 8 ကို သုံးခဲ့ဖူးရင် `onConflict` မသုံးခင် `prisma contract emit` ကို ပြန် run ပါ။

ဒီနေ့အထိ မရနိုင်သေးတဲ့ အရာတွေလည်း ရှိပါသေးတယ်:

* `create`, `connect` နဲ့ `disconnect` မဟုတ်တဲ့ nested write တွေ: `connectOrCreate`၊ nested `update`၊ `updateMany`၊ `upsert`၊ `delete`၊ `deleteMany` နဲ့ relation ပေါ်က `set`။ ဆက်စပ် rows တွေကို သူတို့ရဲ့ model ကနေပဲ ပြောင်းပါ — ဥပမာ `db.orm.public.Post.where({ authorId }).updateAll({ ... })`။ Atomic ဖြစ်ရမယ်ဆိုရင် `db.transaction(...)` အတွင်းမှာ လုပ်ပါ။
* `String[]` နဲ့ တခြား list field တွေပေါ်က list filter တွေ ဖြစ်တဲ့ `has`, `hasEvery`, `hasSome` နဲ့ `isEmpty`။ Field တွေကိုယ်တိုင်တော့ အလုပ်လုပ်ပါတယ်၊ အပေါ်က [raw SQL ဥပမာ](#raw-sql-နဲ့-query-ရေးခြင်း-raw-sql) အတိုင်း ရေးထားတဲ့ raw SQL query တစ်ခုနဲ့ filter လုပ်လို့ရပါတယ်။ `tags String[]` field ပါတဲ့ `Post` model တစ်ခုအတွက်:

  ```ts title="Prisma ORM 8"
  const post = db.sql.public.Post;
  const query = db.raw.sql`SELECT id FROM "Post" WHERE ${tag} = ANY(tags)`
    .returnsRow({ id: post.columns.id })
    .build();
  const rows = await db.query(query);
  ```
* Transaction option တွေ: `isolationLevel`, `timeout`, `maxWait` နဲ့ transaction အတွင်းက transaction တွေ။
* `omit`, `relationLoadStrategy`, `Prisma.skip` နဲ့ `findUnique` call တွေရဲ့ အလိုအလျောက် batching။
* `P2002` / `P2025` ပုံစံ error code တွေ။ အဲဒီအစား error တွေမှာ `RUNTIME.NO_ROWS` လိုမျိုး `code` တစ်ခု ပါပါတယ်၊ ပြီးတော့ unique-constraint violation လိုမျိုး database error တစ်ခုမှာ standard SQL state ကုဒ်က `error.sqlState` ထဲ ပါပါတယ် (unique violation အတွက် `23505` — database တိုင်းမှာ အတူတူပါ)။ ဒါကြောင့် `if (error instanceof Error && "sqlState" in error && error.sqlState === "23505")` နဲ့ catch လုပ်ပါ။ [Error reference](https://www.prisma.io/docs/orm/reference/error-reference) ကို ကြည့်ပါ။
* `Prisma.sql`, `Prisma.join`, `Prisma.raw`, `Prisma.empty` နဲ့ TypedSQL။ `db.raw.sql` ကို သုံးပါ (အပေါ်က ဥပမာ); [Raw queries](https://www.prisma.io/docs/orm/reference/raw-queries) မှာ query ကို အပိုင်းအစတွေကနေ ဆောက်ပုံကို ဖော်ပြထားပါတယ်။
* Soft delete၊ schema ထဲက validation rule တွေ၊ model တွေပေါ်က lifecycle hook တွေ နဲ့ read replica တွေ။ Soft delete အတွက်ဆိုရင် nullable `deletedAt` field တစ်ခု ထည့်ပြီး အဲဒါပေါ်မှာ filter လုပ်ပါ — အဲဒီ field ပါတဲ့ model တိုင်း သုံးနိုင်တဲ့ [query fragment](https://www.prisma.io/docs/orm/reference/orm-client#query-fragments) တစ်ခုနဲ့ပါ။ Validation ကို သင့် application code ထဲမှာ လုပ်ပါ။ Hook တွေအတွက် middleware ကို သုံးပါ။ Read replica အတွက်ဆိုရင် database တစ်ခုချင်းစီအတွက် client တစ်ခု ဖန်တီးပါ။

## နောက်ဘယ်ကို ဆက်သွားမလဲ (Where to go next)

* [Prisma ORM 7 ကနေ 8 ကို ပြောင်းရွှေ့ခြင်း](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql) — အလုပ်လုပ်နေတဲ့ PostgreSQL application တစ်ခုအတွက် အဆင့်ဆင့် migration လမ်းညွှန်။
* [Core concepts](/docs/prisma/core-concepts) — contract ဆိုတာ ဘာလဲ၊ `contract emit` က ဘာလုပ်လဲဆိုတာအတွက်။
* [ORM client reference](https://www.prisma.io/docs/orm/reference/orm-client) — query method တိုင်းအတွက်။
* [Reading data](https://www.prisma.io/docs/orm/fundamentals/reading-data) နဲ့ [Writing data](https://www.prisma.io/docs/orm/fundamentals/writing-data) — query API အပြည့်အစုံအတွက်။
* [Release status](/docs/prisma/release-status) — Prisma ORM 8 က နောက်ဆုံး release နဲ့ ဘယ်လောက် နီးလဲ၊ Prisma ORM 7 ပေါ်မှာ ဘယ်လို ဆက်နေမလဲဆိုတာအတွက်။

## ဆက်စပ် page တွေ (Related pages)

- [`Core concepts`](/docs/prisma/core-concepts): Contract၊ `contract emit` ရေးတဲ့ files တွေ၊ database signature၊ query တွေနဲ့ migration တွေ — အစိတ်အပိုင်းတစ်ခုချင်းစီကို ကြုံတွေ့ရတဲ့ အစီအစဉ်အတိုင်း Prisma ORM 8 က ဘယ်လို ပေါင်းစပ်ထားလဲ။
- [`Extensions`](/docs/prisma/extensions): Prisma ORM ထဲ ထည့်သုံးလို့ရတဲ့ package တိုင်း — database package တွေ၊ column type တွေ၊ index တွေ၊ query operation တွေ နဲ့ middleware တွေ၊ Prisma နဲ့ community ကနေ။
- [`Overview`](/docs/prisma/data-modeling): Model တွေ၊ primary key တွေ၊ scalar field တွေ နဲ့ relation တွေနဲ့အတူ သင့် application လိုအပ်တဲ့ data ကို ဖော်ပြပါ။
- [`Prisma 7`](https://www.prisma.io/docs/orm/v7): Prisma ORM ဆိုတာ type-safe database access၊ migration တွေ နဲ့ visual data editor ကို ပေးတဲ့ မျိုးဆက်သစ် Node.js နဲ့ TypeScript ORM ပါ။
- [`Prisma ORM`](https://www.prisma.io/docs/orm/v6): Prisma ORM အကြောင်း လေ့လာပါ
