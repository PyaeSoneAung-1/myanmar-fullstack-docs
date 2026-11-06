---
title: "Migration API — migration.ts က ခေါ်သုံးနိုင်တဲ့ Method နဲ့ Helper အားလုံး"
description: "migration.ts တစ်ခု ခေါ်သုံးနိုင်တဲ့ Migration class၊ PostgreSQL operation တွေ၊ column နဲ့ constraint helper တွေ၊ rawSql နဲ့ MongoDB operation တွေရဲ့ အပြည့်အစုံ reference"
order: 58
source: "https://www.prisma.io/docs/orm/reference/migration-api"
status: translated
updated: 2026-11-06
---

`migration.ts` တစ်ခု ခေါ်သုံးနိုင်တဲ့ method နဲ့ helper အားလုံးကို ဒီ page မှာ စုစည်းထားပါတယ် — Migration class၊ PostgreSQL operation တွေ၊ column နဲ့ constraint helper တွေ၊ `rawSql` နဲ့ MongoDB operation တွေ ပါဝင်ပါတယ်။

Migration တစ်ခုစီဟာ `migrations/app/` အတွင်းက ကိုယ်ပိုင် folder တစ်ခု ဖြစ်ပြီး၊ အဲဒီထဲမှာ သင်တည်းဖြတ်ရမယ့် file က `migration.ts` ပါ။ `app` ဆိုတာ သင့် project ရဲ့ migrations တွေကို ထည့်ထားတဲ့ folder ရဲ့ ပုံသေ နာမည် ဖြစ်ပါတယ်; ကိုယ်ပိုင် migration တွေ ပါလာတဲ့ extension package တွေကတော့ အဲဒီအဘေးမှာ ကိုယ်ပိုင် folder တွေ ရပါတယ်။

Prisma ORM 8 မှာ `schema.prisma` က အခု `contract.prisma` ဖြစ်ပြီး — အဲဒါက သင့် contract ပါ: language လည်း အတူတူ၊ model တွေလည်း အတူတူပါပဲ။ `npx prisma migration plan` က contract ပြောင်းလဲမှုကနေ `migration.ts` ကို ရေးပေးပြီး၊ migration က ညွှန်ပြဖို့ contract ရဲ့ frozen မိတ္တူတစ်ခုကို သိမ်းပေးပါတယ်။ ဒီ page မှာ migration ရဲ့ start contract ဒါမှမဟုတ် end contract လို့ ပြောတဲ့အခါ အဲဒီမိတ္တူတွေထဲက တစ်ခုကို ဆိုလိုတာပါ။ သင်က `migration.ts` ကို တည်းဖြတ်ပြီး Node.js နဲ့ run လိုက်တဲ့အခါ — run မယ့် SQL ဖြစ်တဲ့ `ops.json` ကို အဲဒီ file ဘေးမှာပဲ ရေးပေးပါတယ်။ [`npx prisma db migrate`](https://www.prisma.io/docs/cli/db-migrate) က `ops.json` ကို database ပေါ်မှာ apply လုပ်ပါတယ်။

ဒီ page က `migration.ts` က ခေါ်နိုင်တဲ့ အရာအားလုံးကို စာရင်းပြုစုထားပါတယ်။ တည်းဖြတ်တဲ့ workflow နဲ့ backfill လုပ်ပုံကို အလုပ်လုပ်ပြထားတဲ့ ဥပမာနဲ့အတူ ဖတ်ချင်ရင် [Migration တစ်ခုကို တည်းဖြတ်ခြင်း](/docs/prisma/editing-a-migration) ကို ဖတ်ပါ။

PostgreSQL မှာ အရာအားလုံးက module တစ်ခုတည်းကနေ လာပါတယ်:

```ts
import { Migration, MigrationCLI, col, primaryKey, unique, foreignKey, checkExpression, lit, fn, rawSql, createExtension, placeholder } from '@prisma/orm-postgres/migration';
```

`migration plan` က migration လိုအပ်တဲ့ နာမည်တွေပဲ ပါတဲ့ import line ကို ရေးပေးပါတယ်။ ကိုယ်တိုင် call တစ်ခု ထည့်တဲ့အခါ အဲဒီနာမည်ကို import line ထဲ ထည့်ပါ။ Default၊ check ဒါမှမဟုတ် index expression လိုမျိုး သင့် contract ထဲက SQL ကို migration က ကိုင်ထားတဲ့နေရာမှာ — `migration plan` က အဲဒါကို `sql` value အဖြစ် ရေးပေးပါတယ်၊ ဥပမာ ``fn(sql`clock_timestamp()`)`` လိုမျိုးပါ၊ import ကတော့ အဲဒီ module ထဲကပဲ လာပါတယ်။ SQL ယူတဲ့ call တိုင်းက `sql` value ဒါမှမဟုတ် သာမန် string ကို လက်ခံပါတယ်။ String ကို ရေးထားတဲ့အတိုင်း အတိအကျ သုံးပြီး၊ `sql` value ကတော့ သူ့ရဲ့ shared indentation နဲ့ အစ/အဆုံးက blank line တွေကို ဖယ်ပေးပါတယ် — ဒါကြောင့် apply လုပ်ပြီးသား migration ထဲက string တွေကို ရှိပြီးသားအတိုင်း ထားခဲ့ပါ။ MongoDB မှာတော့ module က `@prisma/orm-mongo/target/migration` ပါ; path ထဲမှာ `target` တကယ် ပါပြီး placeholder မဟုတ်ပါဘူး။ [MongoDB operation တွေ](#mongodb-operation-တွေ) ကို ကြည့်ပါ။

## Migration File ရဲ့ ဖွဲ့စည်းပုံ

`migration.ts` က `Migration` ကို extend လုပ်တဲ့ class တစ်ခုကို export လုပ်ပါတယ်။ Column တစ်ခု ထည့်တဲ့ migration အတွက် `migration plan` က ဒီလို ရေးပေးပါတယ်:

```ts title="migrations/app/20260921T1408_add_user_bio/migration.ts"
#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/155ebf55586e71f917e8b534544f97d97523544e862ae74b8e70d2af933df807/contract';
import endContract from '../../snapshots/155ebf55586e71f917e8b534544f97d97523544e862ae74b8e70d2af933df807/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/1e8412e162dbbe69f4bb3bf8d07f0280ae67eaab15c34dcf201e67468315428d/contract';
import startContract from '../../snapshots/1e8412e162dbbe69f4bb3bf8d07f0280ae67eaab15c34dcf201e67468315428d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('bio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
```

အပေါ်က import လေးခုက snapshot တွေကို ညွှန်ပါတယ်။ Snapshot တွေဆိုတာ `migration plan` က `migrations/snapshots/<hash>/` အောက်မှာ သိမ်းထားတဲ့ သင့် contract ရဲ့ မိတ္တူတွေပါ — migration စတင်တဲ့ contract အတွက် တစ်ခု၊ ဆုံးသတ်တဲ့ contract အတွက် တစ်ခု။ အဲဒီ path တွေကို သင်ဘယ်တော့မှ ကိုယ်တိုင် ရိုက်ရမှာ မဟုတ်ပါဘူး; `migration plan` က ရေးပေးတာပါ။ Column ပေါ်က `codecRef` က သူ့ value တွေကို ဘယ်လို ဖတ်/ရေး မလဲဆိုတာ နာမည်ပေးတာပါ; `migration plan` ရေးထားတဲ့အတိုင်း ထားခဲ့ပါ။ နောက်ဆုံး line က file ကို Node.js နဲ့ run နိုင်အောင် လုပ်ပေးတာပါ; ရေးထားတဲ့အတိုင်း ထားပါ။

| Member                  | ဘာလဲ                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Migration<Start, End>` | Base class။ `Start` နဲ့ `End` က snapshot နှစ်ခုရဲ့ type တွေပါ။                                                                                                                                                                                                                  |
| `startContractJson`     | Start snapshot ရဲ့ `contract.json`။                                                                                                                                                                                                                                           |
| `endContractJson`       | End snapshot ရဲ့ `contract.json`။                                                                                                                                                                                                                                             |
| `operations`            | ပြောင်းလဲမှု စာရင်း။ သင်စာရင်းလုပ်ထားတဲ့ အစီအစဉ်အတိုင်း run ပါတယ် — table ပြောင်းလဲမှုနဲ့ data ပြောင်းလဲမှု အတူတူပါပဲ၊ ဒါကြောင့် column ပြောင်းလဲမှု နှစ်ခုကြားက `dataTransform` က အဲဒီနှစ်ခုကြားမှာ run ပါတယ်။ Entry တစ်ခုစီဟာ ဒီ page ပေါ်က method ဒါမှမဟုတ် helper တစ်ခုကို call တစ်ခါ ခေါ်တာပါ။ စာရင်းကို ရှိထားတဲ့အတိုင်း return လုပ်ပါ; call တွေကို `await` မလုပ်ပါနဲ့။ |
| `this.endContract`      | End contract ရဲ့ read-only မြင်ကွင်း — သင့်ကိုယ်ပိုင် code ထဲမှာ နာမည်တွေ၊ setting တွေ ရှာဖို့ သုံးပါတယ်။ `this.endContract.namespace.public.table.user` ဆိုတာ `public` schema ထဲက `user` table ပါ (အဲဒီ path ထဲက `namespace` က PostgreSQL schema ကို ဆိုလိုတာပါ)။                                                                                          |
| `this.startContract`    | Start contract အတွက် အတူတူပါ၊ ဒါမှမဟုတ် ပထမဆုံး migration မှာဆိုရင် `null` ဖြစ်ပါတယ်။                                                                                                                                                                                     |

ပထမဆုံး migration က database အလွတ်ကနေ စတာမို့ start snapshot မရှိပါဘူး။ `migration plan` က အဲဒါကို `extends Migration<never, End>` အနေနဲ့ ရေးပေးပြီး `Start` import နှစ်ခုနဲ့ `startContractJson` ကို ချန်ထားပါတယ်။

File ကို run လိုက်တာက `operations` ကို `ops.json` အဖြစ် ပြောင်းပေးရုံတင်မက start နဲ့ end contract တွေကို မှတ်တမ်းတင်တဲ့ `migration.json` ကိုလည်း ရေးပါတယ်။ Prisma ORM ထောက်ပံ့တဲ့ Node.js version တိုင်း (22 line မှာ 22.18 နဲ့အထက်၊ 24 line မှာ 24.11 နဲ့အထက်၊ ဒါမှမဟုတ် 26 နဲ့အထက်) က `.ts` file ကို build step မလိုဘဲ တိုက်ရိုက် run ပါတယ်။ အဲဒါက migration ကို ပိုင်ဆိုင်တဲ့ `prisma.config.ts` ကို ဖတ်ပြီး project က ဘယ် database နဲ့ extension တွေ သုံးလဲ သိပါတယ်: migration directory ရဲ့ အထက်မှာ ရှိပြီး သူ့ migrations directory ထဲမှာ အဲဒီ file ပါဝင်တဲ့ အနီးဆုံး config၊ မရှိရင် working directory ထဲက config၊ ဒါမှမဟုတ် `--config` နဲ့ သင်ပေးတဲ့ config ပါ။ Database ကိုတော့ ဘယ်တော့မှ မချိတ်ဆက်ပါဘူး။

```bash
node migrations/app/20260921T1408_add_user_bio/migration.ts
```

```text
Wrote ops.json + migration.json to /path/to/my-app/migrations/app/20260921T1408_add_user_bio
```

| Flag              | ဘာလုပ်သလဲ                                                                       |
| ----------------- | -------------------------------------------------------------------------------- |
| `--dry-run`       | `migration.json` နဲ့ `ops.json` ကို ရေးမယ့်အစား terminal ပေါ် print ထုတ်ပြပါတယ်။ |
| `--config <path>` | `./prisma.config.ts` အစား အဲဒီ config file ကို ဖတ်ပါတယ်။                       |
| `--help`          | Flag တွေကို print ထုတ်ပါတယ်။                                                    |

အခြား flag တစ်ခုခု ပေးရင် `code` က `CLI.UNKNOWN_FLAG` ဖြစ်တဲ့ error နဲ့ ကျရှုံးပါတယ်။

## Operation Class တွေနဲ့ Check တွေ

Operation တိုင်းမှာ `operationClass` ပါပြီး — အဲဒါက ဘယ်လို ပြောင်းလဲမှုမျိုး လုပ်လဲ ပြောတာပါ။ အောက်က method တွေက အဲဒါကို သင့်အတွက် set လုပ်ပေးပြီး၊ `rawSql` ကတော့ သင့်ကို မေးပါတယ်။ Class က ဘာ run မယ်ဆိုတာကို ဘာမှ မပြောင်းပါဘူး: `npx prisma db migrate` က class တိုင်းကို apply လုပ်ပြီး destructive operation တိုင်းကို `⚠` နဲ့ data-loss သတိပေးချက်နဲ့ မှတ်ပါတယ်။

| Class         | အဓိပ္ပာယ်                                                        | ဥပမာ                                              |
| ------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `additive`    | အသစ်တစ်ခု ထည့်တယ်                                                | Column ထည့်ခြင်း၊ index ဖန်တီးခြင်း                   |
| `widening`    | စည်းမျဉ်းကို လျော့ပေးတယ်၊ ဒါမှမဟုတ် ဘာမှ မဆုံးရှုံးဘဲ နာမည်ပြောင်းတယ် | `NOT NULL` ဖြုတ်ခြင်း၊ index နာမည်ပြောင်းခြင်း        |
| `destructive` | ရှိပြီးသား တစ်ခုခုကို ဖျက်တယ် ဒါမှမဟုတ် ပြောင်းတယ်၊ data ဆုံးရှုံးနိုင်တယ် | Column ဖျက်ခြင်း၊ column ရဲ့ type ပြောင်းခြင်း        |
| `data`        | Table တွေမဟုတ်ဘဲ rows တွေကို ပြောင်းတယ်                            | `dataTransform` တစ်ခု                                 |

Operation အများစုမှာ check query နှစ်ခု — precheck နဲ့ postcheck — ပါပြီး `db migrate` က ဒီအစီအစဉ်အတိုင်း run ပါတယ်:

1. Postcheck — "ပြောင်းလဲမှုက ရောက်နှင့်ပြီးလား?" လို့ မေးပါတယ်။ အောင်မြင်ရင် operation ကို ကျော်သွားပါတယ်။ ဒါကြောင့် တစ်ဝက်တစ်ပျက် ရပ်သွားတဲ့ run ပြီးနောက် `db migrate` ကို ပြန် run လို့ ရပါတယ်: ရောက်ပြီးသားအရာတွေကို ကျော်သွားပါတယ်။
2. Precheck — "database က ဒီပြောင်းလဲမှု မျှော်လင့်တဲ့ အခြေအနေမှာ ရှိလား?" လို့ မေးပါတယ်။ ကျရှုံးရင် run ရပ်သွားပါတယ်။
3. Statements တွေ။
4. Postcheck ကို ပြန်စစ်ပါတယ်။ အခု ကျရှုံးရင် run ရပ်သွားပါတယ်။

အောက်က method တွေက check နှစ်ခုလုံးကို သင့်အတွက် ရေးပေးပါတယ်; `rawSql` မှာပဲ သင် ကိုယ်တိုင် ရေးရပါတယ်။ အပြည့်အစုံ စည်းမျဉ်းကို [Migration တွေ ဘယ်လို အလုပ်လုပ်လဲ](/docs/prisma/how-migrations-work) မှာ ဖတ်ပါ။

## PostgreSQL Operation တွေ

Operation တစ်ခုစီဟာ migration ပေါ်မှာ ခေါ်တဲ့ method တစ်ခုပါ — `this.<name>({ ... })` — options object တစ်ခု ယူပါတယ်။ Method တိုင်းက `schema` ကို ယူပါတယ်; အောက်က table တွေမှာ `schema?` လို့ ပြထားရင် မထည့်ဘဲ ထားလို့ရပါတယ်။ `createSchema`၊ `renameSchema` နဲ့ `dropSchema` အတွက်ကတော့ အဲဒါက ဖန်တီး၊ နာမည်ပြောင်း ဒါမှမဟုတ် ဖျက်မယ့် schema ပါ။ ကျန် method တိုင်းအတွက်ကတော့ table ရှိတဲ့ PostgreSQL schema ဖြစ်ပြီး — သင့် contract က အခြားတစ်ခု မသတ်မှတ်ရင် `public` ပါ။ နာမည်တွေကို quote လုပ်ပေးထားပါတယ်: `"user"` မဟုတ်ဘဲ `user` ကို ပေးပါ။ Table နာမည်ကို ပေးရပါမယ် — အဲဒါက model နာမည် ရေးထားတဲ့အတိုင်း အတိအကျပါ၊ ဥပမာ `User`; model က `@@map` သတ်မှတ်ထားရင်တော့ မဟုတ်ပါဘူး: `@@map("user")` ရှိတဲ့ model ရဲ့ table က `user` ပါ။ အောက်က "Runs" က ဒီ page ရဲ့ ဥပမာ နာမည်တွေအတွက် SQL ပါ။

### Schema နဲ့ Table တွေ

| Method           | Options                                      | Runs                                                         | Class       |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------ | ----------- |
| `createSchema`   | `schema`                                     | `CREATE SCHEMA IF NOT EXISTS "app"`                          | additive    |
| `createTable`    | `schema`, `table`, `columns`, `constraints?` | `CREATE TABLE "public"."post" (...)`                         | additive    |
| `renameTable`    | `schema?`, `table`, `to`                     | `ALTER TABLE "public"."userProfile" RENAME TO "UserProfile"` | widening    |
| `dropTable`      | `schema`, `table`                            | `DROP TABLE "public"."post"`                                 | destructive |
| `renameSchema`   | `schema`, `to`                               | `ALTER SCHEMA "billing" RENAME TO "finance"`                 | widening    |
| `setTableSchema` | `schema?`, `table`, `to`                     | `ALTER TABLE "public"."invoice" SET SCHEMA "billing"`        | widening    |
| `dropSchema`     | `schema`                                     | `DROP SCHEMA "billing"`                                      | widening    |

`columns` က [`col(...)`](#column-နဲ့-constraint-helper-တွေ) call တွေရဲ့ စာရင်းဖြစ်ပြီး `constraints` ကတော့ `primaryKey(...)`၊ `unique(...)`၊ `foreignKey(...)` နဲ့ `checkExpression(...)` call တွေရဲ့ စာရင်းပါ — အားလုံးကို `CREATE TABLE` statement အတွင်းမှာ render လုပ်ပါတယ်။ အဲဒီ section မှာ `createTable` call အပြည့်အစုံနဲ့ သူထုတ်ပေးတဲ့ SQL ကို ပြထားပါတယ်။

`renameTable` က table တစ်ခုကို နာမည်ပြောင်းပြီး သူ့ rows တွေကို ဆက်ထားပါတယ်။ `migration plan` က table နာမည်အဟောင်းကနေ ဆင်းသက်ထားတဲ့ primary key၊ unique constraint၊ foreign key၊ index နဲ့ check တစ်ခုချင်းစီကိုလည်း နာမည်ပြောင်းပေးတာမို့ — အဲဒါက operation စာရင်းတစ်ခု return လုပ်ပါတယ်: `...this.renameTable({ table: 'userProfile', to: 'UserProfile' })` လိုမျိုး စာရင်းထဲကို spread လုပ်ပါ။ နာမည်တွေကို migration ရဲ့ start နဲ့ end contract တွေကနေ ဖတ်ပါတယ်။ သင့် contract ထဲမှာ table နာမည် (model နာမည် ဒါမှမဟုတ် သူ့ `@@map`) ကို ပြောင်းပြီး `prisma contract emit` ကို run ပါ။ `migration plan` က အဲဒီပြောင်းလဲမှုကို ဖျက်လိုက်တဲ့ table တစ်ခုနဲ့ အသစ်တစ်ခုအဖြစ် plan လုပ်ပါတယ်: အဲဒီအတွဲကို `renameTable` call နဲ့ အစားထိုးပါ၊ ဒါမှမဟုတ် [`prisma migration new`](https://www.prisma.io/docs/cli/migration-new) ကနေ migration အလွတ်တစ်ခုထဲမှာ call ကို ရေးပါ။ schema တစ်ခုထက်ပိုပြီး အဲဒီနာမည်နဲ့ table ရှိတဲ့အခါမှသာ `schema` ကို ပေးပါ။ Start contract မှာ အဲဒီလို table မရှိရင်၊ ဒါမှမဟုတ် end contract မှာ `to` နာမည်နဲ့ table မရှိရင် [`MIGRATION.TABLE_RENAME_UNMATCHED`](https://www.prisma.io/docs/orm/reference/error-reference#MIGRATION.TABLE_RENAME_UNMATCHED) နဲ့ ကျရှုံးပါတယ်။ SQLite မှာဆိုရင် `renameTable` က `table` နဲ့ `to` ကို ယူပါတယ်။

`renameSchema` က schema တစ်ခုကို နာမည်ပြောင်းပြီး သူ့ထဲက အရာအားလုံး အဲဒီထဲမှာပဲ ဆက်ရှိနေပါတယ်။ `setTableSchema` က table တစ်ခုကို သူ့ rows၊ constraints၊ indexes နဲ့ policies တွေနဲ့အတူ `to` schema ဆီ ရွှေ့ပါတယ်; အခြား table တွေက foreign key တွေက သူ့ကို ဆက်ညွှန်နေပါတယ်။ Schema မရှိတဲ့ table အတွက်ဆိုရင် `schema` ကို ချန်ထားပါ။ တူတဲ့ migration ထဲက နောက်ပိုင်း `renameTable` နဲ့ `renameColumn` call တွေက table ကို သူ့ schema အသစ် ဒါမှမဟုတ် schema နာမည်အသစ်အောက်မှာ ရှာတွေ့ပါတယ်။ `dropSchema` က schema တစ်ခုကို `CASCADE` မပါဘဲ ဖျက်တာမို့ — သူ့ table တွေကို အရင် ဖျက်ပါ ဒါမှမဟုတ် ရွှေ့ပါ: schema ထဲမှာ table၊ view၊ sequence၊ type ဒါမှမဟုတ် function ရှိနေသေးရင် သူ့ precheck က ကျရှုံးပါတယ်။ [`migration plan`](https://www.prisma.io/docs/cli/migration-plan#renames-and-data-loss) က `--rename billing:finance`၊ `--rename public.Invoice:billing.Invoice` ဒါမှမဟုတ် `--delete billing` ကို ပေးတဲ့အခါ ဒီ call တွေကို ရေးပေးပါတယ်။ ဒါတွေက PostgreSQL သီးသန့်ပါ။

### Column တွေ

| Method            | Options                                                                  | Runs                                                                      | Class                                                       |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `addColumn`       | `schema`, `table`, `column`                                              | `ALTER TABLE "public"."user" ADD COLUMN "bio" text`                       | additive                                                    |
| `dropColumn`      | `schema`, `table`, `column`                                              | `ALTER TABLE "public"."user" DROP COLUMN "bio"`                           | destructive                                                 |
| `alterColumnType` | `schema`, `table`, `column`, `type`, `using?`, `raw?`, `operationClass?` | `ALTER TABLE "public"."post" ALTER COLUMN "views" TYPE bigint`            | `destructive`၊ ဒါမှမဟုတ် `using` ပါရင် `data`               |
| `setNotNull`      | `schema`, `table`, `column`                                              | `ALTER TABLE "public"."post" ALTER COLUMN "views" SET NOT NULL`           | widening                                                    |
| `dropNotNull`     | `schema`, `table`, `column`                                              | `ALTER TABLE "public"."post" ALTER COLUMN "views" DROP NOT NULL`          | widening                                                    |
| `setDefault`      | `schema`, `table`, `column`                                              | `ALTER TABLE "public"."user" ALTER COLUMN "name" SET DEFAULT 'anonymous'` | `additive`၊ column မှာ default ရှိပြီးသားဆိုရင် `widening` |
| `dropDefault`     | `schema`, `table`, `column`                                              | `ALTER TABLE "public"."user" ALTER COLUMN "name" DROP DEFAULT`            | widening                                                    |

`addColumn` နဲ့ `setDefault` က `column` အနေနဲ့ `col(...)` call ကို ယူပါတယ်။ ကျန် method တွေကတော့ column နာမည်ကို string အနေနဲ့ ယူပါတယ်။

`alterColumnType` က type အသစ်ကို `type` ထဲမှာ ယူပြီး — migration ရေးတဲ့ပုံစံအတိုင်း ရေးရပါတယ်၊ ဥပမာ `'int8'`၊ `'varchar(255)'`၊ ဒါမှမဟုတ် enum တစ်ခုအတွက် `'"Mood"'` ပါ။ Prisma ORM က သူထောက်ပံ့တဲ့ PostgreSQL type တွေနဲ့ သင့် configuration ထဲက extension package တွေရဲ့ type တွေကို မှတ်မိပြီး၊ ပြောင်းပြီးနောက် `db migrate` က column မှာ သင်ရေးထားတဲ့ type ရှိမရှိ စစ်ပါတယ်။ မမှတ်မိတဲ့ type တစ်ခုက `MIGRATION.COLUMN_TYPE_UNREADABLE` နဲ့ ကျရှုံးပါတယ်။ အဲဒီ type က extension package တစ်ခုကနေ လာရင် package ကို သင့် configuration ထဲ ထည့်ပါ။ ကျန်တဲ့ type မှာဆိုရင် `raw: true` ကို set လုပ်ပြီး PostgreSQL print ထုတ်တဲ့အတိုင်း အတိအကျ ပေးပါ — အကြောင်းက `db migrate` က column ရဲ့ type ကို အဲဒီစာသားနဲ့ နှိုင်းယှဉ်လို့ပါ။

```ts
this.alterColumnType({ schema: 'public', table: 'post', column: 'views', type: 'int8' }),
```

`using` ဆိုတာ PostgreSQL ကိုယ်တိုင် မလုပ်နိုင်တဲ့ conversion တစ်ခုအတွက် `USING` clause ထဲက expression ပါ။ မပါရင် column ကို type အသစ်ဆီ cast လုပ်ပါတယ်။ Column ပေါ်က SQL အနေနဲ့ ရေးပါ၊ ဥပမာ `'"views"::bigint'`။ Quoted literal အပြင်ဘက်မှာ semicolon၊ SQL comment ဒါမှမဟုတ် dollar quoting၊ ဒါမှမဟုတ် ကွင်းမပါဘဲ comma ဒါမှမဟုတ် `FROM` လိုမျိုး keyword တစ်ခု ပါရင် `MIGRATION.SQL_EXPRESSION_INVALID` နဲ့ ကျရှုံးပါတယ်။ `using` ပါရင် operation က `data` ဖြစ်ပြီး၊ မပါရင် `destructive` ပါ; အခြား class တစ်ခု ရွေးချယ်ဖို့ `operationClass` (`'widening'`၊ `'destructive'` ဒါမှမဟုတ် `'data'`) ကို ပေးပါ။

Column က `autoincrement()` column ဖြစ်တဲ့အခါ `alterColumnType` က column ပိုင်ဆိုင်တဲ့ sequence ကိုလည်း width အသစ်ဆီ ပြောင်းပေးပါတယ် — `int8` column အတွက် `ALTER SEQUENCE ... AS bigint` ပါ။ Statement တစ်ခုမှ မစမီ sequence က width အသစ်အတွက် ကြီးလွန်းတဲ့ value တစ်ခုကို ပေးပြီးသားဖြစ်နေရင် အရင်ဆုံး ငြင်းပါတယ်။ `8.0.0-rc.19` မတိုင်ခင် apply လုပ်ထားတဲ့ migration က sequence ကို width အဟောင်းမှာ ထားခဲ့ပါတယ်။ အဲဒါကို ကိုယ်တိုင် ပြောင်းပါ၊ ဥပမာ `ALTER SEQUENCE "public"."post_id_seq" AS bigint`; `pg_get_serial_sequence('"public"."post"', 'id')` က sequence နာမည်ကို ပြပါတယ်။

`using` တစ်ခုကို type ပြောင်းလဲမှု လိုအပ်ပါတယ်။ `type` အသစ်က migration စတင်တဲ့ contract ထဲမှာ column မှာ ရှိပြီးသား type ဖြစ်နေရင် `migration.ts` က အဲဒီ `alterColumnType` ကို `MIGRATION.ALTER_COLUMN_TYPE_USING_WITHOUT_TYPE_CHANGE` နဲ့ ငြင်းပါတယ် — အကြောင်းက `db migrate` က column မှာ အဲဒီ type ရှိပြီးသားလို့ တွေ့ပြီး operation ကို ကျော်သွားမှာမို့ conversion က ဘယ်တော့မှ မဖြစ်လို့ပါ။ Column ထဲက values တွေကို ပြောင်းပြီး type ကို ဆက်ထားချင်ရင် အဲဒီအစား [`dataTransform`](#data-ဒေတာ-ပြောင်းလဲခြင်း) တစ်ခု ရေးပါ၊ အဲဒါက rows တွေကိုယ်တိုင် စစ်ဆေးပါတယ်။

`8.0.0-rc.18` မတိုင်ခင် ရေးထားတဲ့ `migration.ts` က `qualifiedTargetType`၊ `formatTypeExpected` နဲ့ `rawTargetTypeForLabel` ပါတဲ့ `options` object ကို ပေးခဲ့ပါတယ်။ အခုတော့ အဲဒါက [`MIGRATION.OPERATION_OPTION_REMOVED`](https://www.prisma.io/docs/orm/reference/error-reference#MIGRATION.OPERATION_OPTION_REMOVED) နဲ့ ရပ်သွားပါတယ်: `qualifiedTargetType` ကို `type` ဆီ၊ `options.using` ကို `using` ဆီ ရွှေ့ပြီး ကျန်နှစ်ခုကို ဖျက်ပါ။ Migration ကို database တစ်ခုမှ မ apply ရသေးရင် `ops.json` ရေးဖို့ ပြန် run ပါ; တစ်ခုခု apply ပြီးသားဆိုရင် `ops.json` နဲ့ `migration.json` ကို ရှိပြီးသားအတိုင်း ထားခဲ့ပါ — ပြန်ရေးရင် migration ရဲ့ hash ပြောင်းသွားလို့ပါ။

`setDefault` က column ကို default အသစ်နဲ့အတူ ယူပြီး Prisma ORM က `DEFAULT` clause ကို ရေးပါတယ်: `column: col('name', 'text', { default: lit('anonymous'), codecRef: { codecId: 'pg/text@1' } })`၊ ဒါမှမဟုတ် `column: col('createdAt', 'timestamptz', { default: fn('now()') })`။ `codecRef` ပေးတဲ့အခါ Prisma ORM က literal default က အဲဒီ type ရဲ့ တရားဝင် value ဟုတ်မဟုတ် အရင်စစ်ပြီး၊ မဟုတ်တဲ့ value က [`CONTRACT.DEFAULT_INVALID`](https://www.prisma.io/docs/orm/reference/error-reference#CONTRACT.DEFAULT_INVALID) နဲ့ ကျရှုံးပါတယ်။

`setDefault` မှာ postcheck မရှိတာမို့ အမြဲ run ပါတယ် — ဆိုလိုတာက column မှာ ရှိပြီးသား default ကိုလည်း အစားထိုးနိုင်ပါတယ်။ နောက်ဆုံး operation ပြီးနောက် `db migrate` က default က သင့် contract နဲ့ ကိုက်ညီမရှိ စစ်ပါတယ်။ Migration စတင်တဲ့ contract ထဲမှာ column မှာ default ရှိပြီးသားဆိုရင် operation က widening ဖြစ်ပြီး၊ မဟုတ်ရင် additive ပါ။

`setDefault` က `operationClass` ကို မယူပါဘူး; ပေးနေတဲ့ call တစ်ခုက run ပြီး အဲဒါကို လျစ်လျူရှုပါတယ်။ `8.0.0-rc.15` မတိုင်ခင် ရေးထားတဲ့ `migration.ts` က `defaultSql` ကို ပေးနေတုန်းဆိုရင် [`MIGRATION.OPERATION_OPTION_REMOVED`](https://www.prisma.io/docs/orm/reference/error-reference#MIGRATION.OPERATION_OPTION_REMOVED) နဲ့ ရပ်သွားတာမို့ — အပေါ်မှာ ပြထားတဲ့အတိုင်း call ကို ပြန်ရေးပါ။ သူ့ရဲ့ ရှိပြီးသား `ops.json` ကတော့ ဆက် apply ဖြစ်ပါတယ်။

`setNotNull` မှာ column ထဲ `NULL` ရှိနေသေးရင် ကျရှုံးတဲ့ အပို precheck တစ်ခု ရှိပါတယ် — ဒါကြောင့် column ကို `dataTransform` နဲ့ အရင် backfill လုပ်ပါ။ [Migration တစ်ခုကို တည်းဖြတ်ခြင်း](/docs/prisma/editing-a-migration) မှာ အဆင့်သုံးဆင့်ကို ပြထားပါတယ်။

### Constraint တွေ

| Method                  | Options                                       | Runs                                                                                                                                           | Class       |
| ----------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `addPrimaryKey`         | `schema`, `table`, `constraint`, `columns`    | `ALTER TABLE "public"."tag" ADD CONSTRAINT "tag_pkey" PRIMARY KEY ("id")`                                                                       | additive    |
| `addUnique`             | `schema`, `table`, `constraint`, `columns`    | `ALTER TABLE "public"."user" ADD CONSTRAINT "user_name_key" UNIQUE ("name")`                                                                    | additive    |
| `addForeignKey`         | `schema`, `table`, `foreignKey`               | `ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_post_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post" ("id") ON DELETE CASCADE` | additive    |
| `dropConstraint`        | `schema`, `table`, `constraint`, `kind?`      | `ALTER TABLE "public"."user" DROP CONSTRAINT "user_name_key"`                                                                                   | destructive |
| `addCheckConstraint`    | `schema`, `table`, `constraint`, `expression` | `ALTER TABLE "public"."post" ADD CONSTRAINT "post_title_len" CHECK (length("title") > 0)`                                                       | additive    |
| `renameCheckConstraint` | `schema`, `table`, `from`, `to`               | `ALTER TABLE "public"."post" RENAME CONSTRAINT "post_title_len" TO "post_title_nonempty"`                                                       | widening    |
| `renameConstraint`      | `schema?`, `table`, `kind`, `from`, `to`      | `ALTER TABLE "public"."user" RENAME CONSTRAINT "user_pkey" TO "account_pkey"`                                                                   | widening    |
| `dropCheckConstraint`   | `schema`, `table`, `constraint`               | `ALTER TABLE "public"."post" DROP CONSTRAINT "post_title_nonempty"`                                                                             | destructive |

ဒီ call တွေမှာ `constraint` ဆိုတာ constraint ကို ပေးရမယ့် နာမည်၊ ဒါမှမဟုတ် ဖျက်မယ့် တစ်ခုရဲ့ နာမည်ပါ၊ ပြီးတော့ `columns` က သူဖုံးလွှမ်းတဲ့ column နာမည် စာရင်းပါ:

```ts
this.addUnique({ schema: 'public', table: 'user', constraint: 'user_name_key', columns: ['name'] }),
```

`foreignKey` က object တစ်ခုပါ: `name`၊ `columns` (ဒီ table ပေါ်က)၊ ကိုယ်ပိုင် `schema`၊ `table` နဲ့ `columns` ပါတဲ့ `references`၊ ပြီးတော့ ရွေးချယ်နိုင်တဲ့ `onDelete` နဲ့ `onUpdate` — တစ်ခုချင်းစီက `'noAction'`၊ `'restrict'`၊ `'cascade'`၊ `'setNull'` ဒါမှမဟုတ် `'setDefault'` ပါ:

```ts
this.addForeignKey({
  schema: 'public',
  table: 'comment',
  foreignKey: {
    name: 'comment_post_fkey',
    columns: ['postId'],
    references: { schema: 'public', table: 'post', columns: ['id'] },
    onDelete: 'cascade',
  },
}),
```

`renameConstraint` က `kind` မရွေးဘဲ constraint တိုင်းကို နာမည်ပြောင်းပါတယ်: `'primaryKey'`၊ `'unique'`၊ `'foreignKey'` ဒါမှမဟုတ် `'checkConstraint'`။ `renameCheckConstraint` ဆိုတာ `kind: 'checkConstraint'` ပါတဲ့ call အတူတူပါပဲ။

`dropConstraint` က primary key၊ unique ဒါမှမဟုတ် foreign key constraint ကို နာမည်နဲ့ ဖျက်ပါတယ်။ သူ့ kind ကို `kind` အနေနဲ့ ပေးပါ — `'primaryKey'`၊ `'unique'` ဒါမှမဟုတ် `'foreignKey'` ထဲက တစ်ခုပါ။ `kind` ကို report လုပ်ဖို့ပဲ `ops.json` ထဲ မှတ်ထားပြီး SQL ကို ဘာမှ မပြောင်းပါဘူး; သူ့ default က `'unique'` ပါ။ Check constraint အတွက်ကတော့ ကိုယ်ပိုင် `dropCheckConstraint` ရှိပါတယ်။

`addCheckConstraint` က ရှိပြီးသား table တစ်ခုပေါ်မှာ check တစ်ခု ထည့်ပါတယ်; [helpers](#column-နဲ့-constraint-helper-တွေ) အောက်မှာ စာရင်းပြုစုထားတဲ့ `checkExpression(...)` ဆိုတာ `createTable` အတွင်းမှာ အတူတူပဲ ဖြစ်ပါတယ်။ နှစ်ခုလုံးမှာ `expression` က SQL ဖြစ်ပြီး သင်ရေးထားတဲ့အတိုင်း statement ထဲ ဝင်သွားတာမို့ column နာမည်တွေကို ကိုယ်တိုင် quote လုပ်ပါ: `'length("title") > 0'`။

Column တစ်ခုကို နာမည်ပြောင်းတဲ့ method မရှိပါဘူး။ [Raw SQL](#raw-sql-sql-ကို-တိုက်ရိုက်-ရေးခြင်း) မှာ column rename ကို ပြထားပါတယ်။ Table နာမည်ပြောင်းဖို့ [`renameTable`](#schema-နဲ့-table-တွေ) ကို သုံးပါ။

### Index တွေ

| Method        | Options                                                          | Runs                                                                    | Class       |
| ------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| `createIndex` | `schema`, `table`, `index`, `columns` ဒါမှမဟုတ် `expression`, `extras?` | `CREATE INDEX "post_author_idx" ON "public"."post" ("authorId")`        | additive    |
| `renameIndex` | `schema`, `table`, `from`, `to`                                  | `ALTER INDEX "public"."post_author_idx" RENAME TO "post_author_id_idx"` | widening    |
| `dropIndex`   | `schema`, `table`, `index`                                       | `DROP INDEX "public"."post_author_id_idx"`                              | destructive |

`createIndex` က `columns` (column နာမည် စာရင်း) ဒါမှမဟုတ် `expression` (ကွင်းနှစ်ခုကြားက အရာအားလုံး ဖြစ်သွားတဲ့ SQL string တစ်ခု၊ ဥပမာ `'lower("title")'`) ကို ယူပါတယ်။ ကျန်တာအားလုံး `extras` ထဲ ဝင်ပါတယ်:

| Field     | ဘာလဲ                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------- |
| `unique`  | `CREATE UNIQUE INDEX` အတွက် `true`။                                                               |
| `where`   | Partial index ရဲ့ အခြေအနေ — SQL အနေနဲ့၊ `WHERE` keyword မပါဘဲ။                                      |
| `type`    | Index method: `'gin'` က `USING "gin"` ကို render လုပ်ပါတယ်။                                        |
| `options` | Index storage parameter တွေ object အနေနဲ့: `{ fastupdate: false }` က `WITH ("fastupdate" = off)` ကို render လုပ်ပါတယ်။ |

အောက်က call က `CREATE UNIQUE INDEX "post_title_lower_idx" ON "public"."post" (lower("title")) WHERE ("views" > 0)` ကို run ပါတယ်:

```ts
this.createIndex({
  schema: 'public',
  table: 'post',
  index: 'post_title_lower_idx',
  expression: 'lower("title")',
  extras: { unique: true, where: '"views" > 0' },
}),
```

`CONCURRENTLY` option မရှိပါဘူး — အကြောင်းက `npx prisma db migrate` run တစ်ခုက [transaction တစ်ခု](/docs/prisma/applying-a-migration) ဖြစ်တာမို့ index က အဲဒီအတွင်းမှာ build ဖြစ်ပြီး ပြီးဆုံးတဲ့အထိ table ကို writes တွေ ပိတ်ထားပါတယ်။

### Native Enum Type တွေ

| Method                 | Options                         | Runs                                                      | Class       |
| ---------------------- | ------------------------------- | --------------------------------------------------------- | ----------- |
| `createNativeEnumType` | `schema`, `typeName`, `members` | `CREATE TYPE "public"."role" AS ENUM ('admin', 'member')` | additive    |
| `addNativeEnumValue`   | `schema`, `typeName`, `value`   | `ALTER TYPE "public"."role" ADD VALUE 'guest'`            | additive    |
| `dropNativeEnumType`   | `schema`, `typeName`            | `DROP TYPE "public"."role"`                               | destructive |

`members` နဲ့ `value` က enum ရဲ့ values တွေကို string အနေနဲ့ ပေးတာပါ၊ ပြီးတော့ `addNativeEnumValue` က call တစ်ခါကို value တစ်ခု ထည့်တာမို့ — ထည့်မယ့် value တစ်ခုစီအတွက် တစ်ခါ ခေါ်ပါ:

```ts
this.createNativeEnumType({ schema: 'public', typeName: 'role', members: ['admin', 'member'] }),
this.addNativeEnumValue({ schema: 'public', typeName: 'role', value: 'guest' }),
```

### Stored Enum Value တွေ

| Method               | Options                                                                   | Runs                                                           | Class       |
| -------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------- |
| `replaceStoredValue` | `schema?`, `table`, `column`, `from`, `to`, `many?`, `codecRef?`          | `UPDATE "public"."task" SET "state" = $2 WHERE "state" = $1`   | widening    |
| `removeStoredValue`  | `schema?`, `table`, `column`, `value`, `many?`, `codecRef?`, `enumValue?` | `UPDATE "public"."task" SET "state" = NULL WHERE "state" = $1` | destructive |

`migration plan` က ဒီ call တွေကို — `enum` block ရဲ့ member တစ်ခုက value အသစ်တစ်ခုကို သိမ်းတဲ့အခါ၊ ဒါမှမဟုတ် member တစ်ခုကို ဖျက်ပြီး သူ့ value ကို အခြား member တစ်ခုမှ မသိမ်းတဲ့အခါ — [Renames and data loss](https://www.prisma.io/docs/cli/migration-plan#renames-and-data-loss) မှာ ဖော်ပြထားတဲ့အတိုင်း ရေးပေးပါတယ်။ `replaceStoredValue` က သိမ်းထားတဲ့ value `from` ကို `to` အဖြစ် အဲဒါကို ကိုင်ထားတဲ့ row တိုင်းမှာ ပြောင်းပါတယ်။ `removeStoredValue` က `value` ကို ကိုင်ထားတဲ့ row တိုင်းမှာ column ကို `NULL` သတ်မှတ်ပါတယ်; required column တစ်ခုမှာဆိုရင် row တစ်ခုခု အဲဒီ value ကို ကိုင်ထားသေးရင် သူ့ precheck က ကျရှုံးပါတယ်။ `many: true` ပါရင် column က list တစ်ခုဖြစ်ပြီး၊ အဲဒါကို ကိုင်ထားတဲ့ list တိုင်းမှာ value ကို အစားထိုး ဒါမှမဟုတ် ဖျက်ပါတယ်။ Values တွေကို column သိမ်းတဲ့ ပုံစံအတိုင်း parameter အနေနဲ့ ပေးပါတယ်။ `codecRef` က column ရဲ့ codec ကို နာမည်ပေးပြီး၊ `enumValue` ကတော့ enum member ကို နာမည်ပေးတာမို့ — check ကျရှုံးရင် အဲဒီနာမည် ပါလာပါတယ်; နှစ်ခုလုံးကို `migration plan` က ဖြည့်ပေးပါတယ်။

Member တစ်ခုက value အသစ်တစ်ခုကို သိမ်းတဲ့အခါ rows တွေကို ဆက်ထားချင်ရင် — plan လုပ်ထားတဲ့ `removeStoredValue` ကို value အသစ်ဆီ ညွှန်တဲ့ `replaceStoredValue` နဲ့ အစားထိုးပြီး `node migration.ts` ကို run ပါ:

```ts
this.replaceStoredValue({ schema: 'public', table: 'task', column: 'state', from: 'archived', to: 'retired' }),
```

### Row-level Security (Row အဆင့် လုံခြုံရေး)

| Method                    | Options                         | Runs                                                                                               | Class       |
| ------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| `enableRowLevelSecurity`  | `schema`, `table`               | `ALTER TABLE "public"."post" ENABLE ROW LEVEL SECURITY`                                            | additive    |
| `disableRowLevelSecurity` | `schema`, `table`               | `ALTER TABLE "public"."post" DISABLE ROW LEVEL SECURITY`                                           | destructive |
| `createRlsPolicy`         | `schema`, `table`, `policy`     | `CREATE POLICY "post_read_all" ON "public"."post" AS PERMISSIVE FOR SELECT TO public USING (true)` | additive    |
| `renameRlsPolicy`         | `schema`, `table`, `from`, `to` | `ALTER POLICY "post_read_all" ON "public"."post" RENAME TO "post_read_any"`                        | widening    |
| `dropRlsPolicy`           | `schema`, `table`, `policy`     | `DROP POLICY "post_read_any" ON "public"."post"`                                                   | destructive |

`policy` က policy ကို အပြည့်အစုံ ဖော်ပြပါတယ်:

```ts
this.createRlsPolicy({
  schema: 'public',
  table: 'post',
  policy: {
    naming: { kind: 'exact', name: 'post_read_all' },
    tableName: 'post',
    namespaceId: 'public',
    operation: 'select',
    roles: ['public'],
    using: 'true',
    permissive: true,
  },
}),
```

`naming.name` က policy ရဲ့ နာမည်ဖြစ်ပြီး `kind` က အမြဲ `'exact'` ပါ။ `tableName` နဲ့ `namespaceId` က `table` နဲ့ `schema` နဲ့ အတူတူ values တွေ ယူပါတယ်။ `operation` က `'select'`၊ `'insert'`၊ `'update'`၊ `'delete'` ဒါမှမဟုတ် `'all'` ထဲက တစ်ခုပါ။ `roles` က `TO` clause ဖြစ်သွားပါတယ်။ `using` နဲ့ `withCheck` က SQL အခြေအနေတွေဖြစ်ပြီး ရေးထားတဲ့အတိုင်း ဝင်ပါတယ်; `SELECT` နဲ့ `DELETE` policy တွေက `using` ကိုပဲ ယူပြီး၊ `INSERT` policy တွေက `withCheck` ကိုပဲ ယူပါတယ်။ `permissive: false` က policy ကို `AS RESTRICTIVE` ဖြစ်စေပါတယ်။ `dropRlsPolicy` က policy ရဲ့ နာမည်ကို `policy` အနေနဲ့ ယူပါတယ်။

### Extension တွေ

| Call                    | Options                                        | Runs                                        | Class    |
| ----------------------- | ---------------------------------------------- | ------------------------------------------- | -------- |
| `createExtension(name)` | extension ရဲ့ နာမည်                            | `CREATE EXTENSION IF NOT EXISTS "pgcrypto"` | additive |
| `this.installExtension` | `extensionName`, `invariantId`, `id`, `label?` | `CREATE EXTENSION IF NOT EXISTS citext`     | additive |

အများအားဖြင့် extension ကို contract ထဲမှာ `extension pgcrypto {}` နဲ့ ကြေညာပြီး `migration plan` က `createExtension` call ကို သင့်အတွက် ရေးပေးပါတယ်; [PostgreSQL extensions](/docs/prisma/psl-syntax) မှာ ရှင်းပြထားပါတယ်။ `createExtension` က ကိုယ်တိုင် ရေးတဲ့ migration အတွက် သာမန် function တစ်ခုပါ၊ method မဟုတ်ပါဘူး။ အဲဒါက တခြား call တွေလိုပဲ `operations` စာရင်းထဲ ဝင်ပါတယ်:

```ts
override get operations() {
  return [
    createExtension('pgcrypto'),
    this.addColumn({ schema: 'public', table: 'user', column: col('token', 'text') }),
  ];
}
```

အဲဒါမှာ precheck ဒါမှမဟုတ် postcheck မရှိတာမို့ `db migrate` run တစ်ခု တစ်ဝက်တစ်ပျက် ရပ်ပြီး ပြန် run ရင် ဒီ operation က ပြန် run ပါတယ် — `IF NOT EXISTS` ရှိတာမို့ ဘာမှ ထိခိုက်မှု မရှိပါဘူး။

`installExtension` က ကိုယ်ပိုင် migration တွေ ပါလာတဲ့ [extension package](/docs/prisma/extensions) တစ်ခုရဲ့ အဟောင်း migration တွေအတွက်ပါ၊ အဲဒီမှာ `extensionName`၊ `invariantId` နဲ့ `id` အားလုံး လိုအပ်ပါတယ်။ Package အသစ်တစ်ခုကတော့ သူ့ PostgreSQL extension ကို သူ့ contract ထဲမှာ ကြေညာပါတယ် — အကြောင်းက `db sign` က database က မမှတ်တမ်းတင်ရသေးတဲ့ invariant တစ်ခုကို head က လိုအပ်နေတဲ့ contract space တစ်ခုကို `MIGRATION.SIGN_INVARIANTS_MISSING` နဲ့ ငြင်းလို့ပါ။ `id` က error message တွေထဲမှာ operation ကို နာမည်ပေးပြီး၊ `label` က CLI print ထုတ်တဲ့ စာသား၊ `invariantId` ကတော့ အဲဒီ package ထဲက တခြား migration တွေ install ကို ညွှန်းဖို့ သုံးနိုင်တဲ့ နာမည်ပါ။ `invariantId` ကို extension package တွေပဲ သုံးပါတယ်; `dataTransform` နဲ့ `rawSql` ပေါ်က ရွေးချယ်နိုင်တဲ့ `invariantId` ကလည်း သူတို့အတွက်ပါ — ဒါကြောင့် မထည့်ဘဲ ထားပါ။

### Data (ဒေတာ ပြောင်းလဲခြင်း)

| Call                                          | Arguments                                                                                                                                                          | Class |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `this.dataTransform(contract, name, options)` | `endContract` — အောက်မှာ တည်ဆောက်ထားတဲ့ contract object၊ operation အတွက် နာမည်တစ်ခု၊ ပြီးတော့ `run`၊ `check?` နဲ့ `invariantId?` ပါတဲ့ `options` | data  |

`run` ဆိုတာ [SQL query builder](https://www.prisma.io/docs/orm/reference/sql-query-builder) နဲ့ တည်ဆောက်ထားတဲ့ update တစ်ခု၊ ဒါမှမဟုတ် အစီအစဉ်အတိုင်း run မယ့် အဲဒီလို callback တွေရဲ့ စာရင်းကို return လုပ်တဲ့ callback ပါ။ `check` ကတော့ ပြောင်းလဲမှု လိုအပ်နေသေးတဲ့ rows တွေအတွက် query တစ်ခု return လုပ်တဲ့ callback ပါ။ အဲဒီ query တစ်ခုကို သင် ကိုယ်တိုင် ရေးရပါတယ်; rows တွေ တွေ့နေသေးရင် precheck အောင်မြင်ပြီး၊ တစ်ခုမှ မတွေ့တော့ရင် postcheck အောင်မြင်ပါတယ်။

Callback နှစ်ခုလုံးက သူတို့ရဲ့ query တွေကို `db` ဆိုတဲ့ query builder နဲ့ တည်ဆောက်ပြီး၊ `db` က end snapshot ရဲ့ JSON ကနေ တည်ဆောက်ထားတဲ့ contract object တစ်ခု လိုအပ်ပါတယ်။ အဲဒီ line တွေကို `migration plan` မရေးပေးပါဘူး; migration မှာ `dataTransform` ပါတိုင်း သင် ထည့်ရပါတယ်။ တူတဲ့ contract object ကို `contract` argument အနေနဲ့ ပေးပါ (`this.endContract` မဟုတ်ပါ — အဲဒါက နာမည်တွေ ရှာဖို့ မြင်ကွင်းတစ်ခုပဲပါ)။ Plan လုပ်ထားတဲ့ file က JSON import အတွက် `endContract` ဆိုတဲ့ နာမည်ကို သုံးပြီးသားဖြစ်တာမို့ — နာမည်လွတ်ဖို့ import ကို အရင် နာမည်ပြောင်းပါ:

```ts
import endContract from '../../snapshots/<end hash>/contract.json' with { type: 'json' }; // [!code --]
import endContractJson from '../../snapshots/<end hash>/contract.json' with { type: 'json' }; // [!code ++]
```

```ts
  override readonly endContractJson = endContract; // [!code --]
  override readonly endContractJson = endContractJson; // [!code ++]
```

ပြီးရင် class အပေါ်မှာ ဒီ line တွေကို ရှိထားတဲ့အတိုင်း ကူးထည့်ပါ; သူတို့က `db` ကို တည်ဆောက်ပြီး database ကို ဘယ်တော့မှ မချိတ်ဆက်ပါဘူး:

```ts
import postgresAdapter from '@prisma/orm-postgres/adapter/runtime';
import { sql } from '@prisma/orm-postgres/builder/runtime';
import { createExecutionContext, createSqlExecutionStack } from '@prisma/orm-postgres/family-runtime';
import postgresTarget, { PostgresContractSerializer } from '@prisma/orm-postgres/target/runtime';

const endContract = new PostgresContractSerializer().deserializeContract<End>(endContractJson);
const stack = createSqlExecutionStack({ target: postgresTarget, adapter: postgresAdapter });

const db = sql<End>({
  context: createExecutionContext({ contract: endContract, stack }),
  rawCodecInferer: stack.adapter.rawCodecInferer,
});
```

ပြီးရင် operation ကိုယ်တိုင် — Migration တစ်ခု တည်းဖြတ်ခြင်း page ပေါ်က အလုပ်လုပ်ပြထားတဲ့ ဥပမာထဲကအတိုင်းပါ။ `where` တစ်ခုစီအတွင်းမှာ `f` က table ရဲ့ columns တွေကို ကိုင်ထားပြီး `fns` က comparison function တွေကို ကိုင်ထားပါတယ်:

```ts
this.dataTransform(endContract, 'backfill-user-displayName', {
  check: () =>
    db.public.user
      .select('id')
      .where((f, fns) => fns.eq(f.displayName, null))
      .limit(1),
  run: () =>
    db.public.user
      .update({ displayName: 'Anonymous' })
      .where((f, fns) => fns.eq(f.displayName, null)),
}),
```

`migration plan` က `--backfill <Model.field>` နဲ့ သင်နာမည်ပေးတဲ့ field တစ်ခုစီအတွက် နေရာနှစ်ခုမှာ `placeholder('<name>:check')` နဲ့ `placeholder('<name>:run')` ပါတဲ့ `dataTransform` တစ်ခု၊ ပြီးတော့ `--convert` နဲ့ သင်နာမည်ပေးတဲ့ field တစ်ခုစီအတွက် `using: placeholder('<Model.field>:convert')` ပါတဲ့ `alterColumnType` တစ်ခုကို ရေးပေးပါတယ်; `placeholder(...)` call တစ်ခုစီကို query တစ်ခု ဒါမှမဟုတ် conversion တစ်ခုနဲ့ အစားထိုးရပါတယ်။ အဲဒီ flag တွေ မပါရင် placeholder တွေ မရေးပါဘူး: required field အသစ်တစ်ခုက ရှိပြီးသား rows တွေမှာ ယာယီ value တစ်ခု ရပြီး၊ ရွေးချယ်နိုင်တဲ့ field တစ်ခုကို required ဖြစ်စေတဲ့အခါ တိုက်ရိုက် တင်းကျပ်စေပါတယ်။ ယာယီ value တစ်ခုတည်း မယူနိုင်တဲ့ required field အသစ်ကတော့ ခြွင်းချက်ပါ: primary key၊ unique constraint ဒါမှမဟုတ် foreign key ထဲက တစ်ခု၊ enum လိုမျိုး သတ်မှတ်ထားတဲ့ value အစုတစ်ခုအတွင်းမှာပဲ ကန့်သတ်ထားတဲ့ တစ်ခု၊ ဒါမှမဟုတ် ယာယီ value မရှိတဲ့ type တစ်ခု ပါတဲ့ field ပါ။ `migration plan` က အဲဒါကို table အလွတ်အတွက်ပဲ ထည့်ပေးတာမို့ table မှာ rows ရှိရင် migration ကို apply လုပ်တဲ့အခါ ကျရှုံးပါတယ်; အဲဒီ rows တွေကို ကိုယ်တိုင် ဖြည့်ဖို့ field ကို `--backfill` နဲ့ နာမည်ပေးပါ။ [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) ကို ကြည့်ပါ။ [Migration တစ်ခုကို တည်းဖြတ်ခြင်း](/docs/prisma/editing-a-migration) မှာ file တစ်ခုလုံးနဲ့ backfill က migration ဖျက်မယ့် column တစ်ခုကို ဖတ်တဲ့အခါ ဘာလုပ်ရမလဲ ပြထားပါတယ်။

### Raw SQL (SQL ကို တိုက်ရိုက် ရေးခြင်း)

| Call                | Argument                                | Class                          |
| ------------------- | --------------------------------------- | ------------------------------ |
| `rawSql(operation)` | သင် အပြည့်အစုံ ရေးတဲ့ operation object | သင် set လုပ်တဲ့ `operationClass` |

`rawSql` က method မဟုတ်ပါဘူး: `@prisma/orm-postgres/migration` ကနေ import လုပ်ပြီး အောက်က ဥပမာလိုမျိုး `this.` မပါဘဲ ခေါ်ပါ။ ဒီ page ပေါ်မှာ method မရှိတဲ့ statement တစ်ခုအတွက် သုံးပါ၊ ဥပမာ column rename ဒါမှမဟုတ် `COMMENT ON`။ `db migrate` က migration ကို apply ပြီးနောက် database ကို end contract နဲ့ နှိုင်းယှဉ်စစ်တာမို့ — raw ပြောင်းလဲမှုက သင့် contract ထဲက ပြောင်းလဲမှုတစ်ခုနဲ့ ကိုက်ညီရပါမယ်: column တစ်ခု နာမည်ပြောင်းဖို့ `contract.prisma` ထဲမှာ field ကို နာမည်ပြောင်း၊ `migration plan` ကို run၊ ပြီးရင် သူရေးတဲ့ `dropColumn` နဲ့ `addColumn` ကို `rawSql` တစ်ခုတည်းနဲ့ အစားထိုးပါ။ အောက်က field တွေ ပါတဲ့ object တစ်ခုကို ပေးပါ:

| Field                              | ဘာလဲ                                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                               | Operation အတွက် နာမည်၊ error message တွေမှာ သုံးပါတယ်။ ဘယ် string မဆို ရပါတယ်; migration ထဲမှာ ထူးခြားအောင် ထားပါ။ Planner ရဲ့ ကိုယ်ပိုင်နာမည်တွေက `index.post.post_author_idx` လိုမျိုး ဖြစ်ပါတယ်။ |
| `label`                            | Apply လုပ်နေစဉ် CLI print ထုတ်တဲ့ စာသား။                                                                                                                                      |
| `operationClass`                   | [Class လေးခု](#operation-class-တွေနဲ့-check-တွေ) ထဲက တစ်ခု။                                                                                                                    |
| `target`                           | အမြဲ `{ id: 'postgres' }`။                                                                                                                                                     |
| `precheck`, `execute`, `postcheck` | Step တွေရဲ့ စာရင်းဖြစ်ပြီး တစ်ခုချင်းစီက `{ description, sql, params? }` ပါတယ်။ Check step တစ်ခုက `expectation` ကိုလည်း ယူနိုင်ပါတယ်။ `execute` က statements တွေကို ကိုင်ထားပြီး၊ ကျန်နှစ်ခုက အောက်မှာ ဖော်ပြထားတဲ့ check တွေကို ကိုင်ထားပါတယ်။ |
| `summary?`                         | ပိုရှည်တဲ့ ဖော်ပြချက်၊ ရွေးချယ်နိုင်ပါတယ်။                                                                                                                                     |
| `invariantId?`                     | ရွေးချယ်နိုင်တာမို့ မထည့်ဘဲ ထားပါ။                                                                                                                                            |

```ts
rawSql({
  id: 'rename.user.bio',
  label: 'Rename column "bio" to "biography" on "user"',
  operationClass: 'widening',
  target: { id: 'postgres' },
  precheck: [
    {
      description: 'column "bio" exists',
      sql: `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'bio')`,
    },
  ],
  execute: [{ description: 'rename', sql: `ALTER TABLE "public"."user" RENAME COLUMN "bio" TO "biography"` }],
  postcheck: [
    {
      description: 'column "biography" exists',
      sql: `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'biography')`,
    },
  ],
}),
```

#### Check တွေ ရေးသားခြင်း

Step တစ်ခုရဲ့ `sql` မှာ `$1`၊ `$2` စသဖြင့် သုံးနိုင်ပြီး values တွေကို `params` ထဲ ထည့်ပါ။ Check တစ်ခုက သူ့ query က ပထမ row ရဲ့ ပထမ column မှာ `true` ပြန်ပေးတဲ့အခါ အောင်မြင်ပါတယ်။ Query က `false` ဒါမှမဟုတ် row မရှိဘဲ ပြန်ရင် ကျရှုံးပါတယ်။

Precheck ကို `true` ဆိုတာ "ဆက်လုပ်ပါ" လို့ အဓိပ္ပာယ်ရအောင် ရေးပါ၊ အပေါ်က "column `bio` ရှိတယ်" လိုမျိုးပါ။ Postcheck ကို `true` ဆိုတာ "ပြောင်းလဲမှု ရောက်နေပြီ" လို့ အဓိပ္ပာယ်ရအောင် ရေးပါ၊ "column `biography` ရှိတယ်" လိုမျိုးပါ။ [အစီအစဉ်](#operation-class-တွေနဲ့-check-တွေ) ကို သတိရပါ: postcheck က အရင် run ပြီး၊ အောင်မြင်နှင့်ရင် operation ကို ကျော်သွားပါတယ်။ `precheck` အလွတ်က statements တွေကို အမြဲ run ခွင့်ပြုပါတယ်။ `postcheck` အလွတ်က ကြိုတင် ဘယ်တော့မှ မအောင်မြင်တာမို့ operation က သူ့ဆီ ရောက်တဲ့ `db migrate` တိုင်းမှာ run ပါတယ် — ကျရှုံးပြီးနောက် ဒုတိယ run အပါအဝင်ပါ။

Object တစ်ခု ရှိမရှိ မေးတဲ့ check တစ်ခုက အဲဒါကို `expectation` ထဲမှာ ပြောနိုင်ပါတယ်: `{ expects: 'absent' | 'present', object }`၊ `object` က object ကို ဖတ်သူ မြင်မယ့်အတိုင်း နာမည်ပေးတာပါ၊ ဥပမာ `'column "biography" on "user"'`။ Check ကျရှုံးတဲ့အခါ error က `That check failed on this database.` အစား database မှာ ဘာရှိပြီး ဘာမရှိဘူးကို ပြောပါတယ်၊ ဥပမာ `the database already has column "biography" on "user"` ပါ။ `object` က display စာသားသက်သက်ပါ။ Data အကြောင်း ဒါမှမဟုတ် object အများအပြားကို တစ်ပြိုင်နက် မေးတဲ့ check တစ်ခုမှာ `expectation` ကို မထည့်ပါနဲ့ — ဥပမာ column မှာ `NULL` values မရှိဘူးလို့ စစ်တဲ့ check ပါ။ ဒါကို database တစ်ခုမှ မ apply ရသေးတဲ့ migration မှာပဲ ထည့်ပါ။ ပြီးရင် `node migration.ts` ကို ပြန် run ပါ၊ အဲဒါက `ops.json` နဲ့ `migration.json` ကို ပြန်ရေးပါတယ်။

```ts
postcheck: [
  {
    description: 'column "biography" exists',
    sql: `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'biography')`,
    expectation: { expects: 'present', object: 'column "biography" on "user"' },
  },
],
```

## Column နဲ့ Constraint Helper တွေ

ဒါတွေက module ထဲကပဲ လာတဲ့ သာမန် function တွေပါ။ `createTable` နဲ့ `addColumn` က သူတို့ return လုပ်တဲ့အရာကို ယူပါတယ်။

| Helper                                                                       | ဘာပြန်သလဲ                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `col(name, type, options?)`                                                  | Column တစ်ခု။ `type` က PostgreSQL type ကို SQL အနေနဲ့ ရေးတာပါ၊ ဥပမာ `'text'`၊ `'integer'`၊ `'timestamptz'` ဒါမှမဟုတ် `'varchar(255)'`။ `options` မှာ `notNull`၊ `primaryKey` (column ပေါ်မှာ `PRIMARY KEY` render လုပ်တယ်; single-column key အတွက်ဆိုရင် `primaryKey(...)` constraint နဲ့ အတူတူပဲ လုပ်တယ်၊ `migration plan` က အဲဒါကို ရေးတယ်)၊ `default` နဲ့ `codecRef` ပါတယ်။ |
| `lit(value)`                                                                 | `col` အတွက် literal default: `default: lit(0)` က `DEFAULT 0` ကို render လုပ်တယ်။                                                                                                                                                                                                                                                             |
| `fn(expression)`                                                             | `col` အတွက် function default: `default: fn('now()')` က `DEFAULT (now())` ကို render လုပ်တယ်။                                                                                                                                                                                                                                                  |
| `primaryKey(columns, { name? })`                                             | `PRIMARY KEY` table constraint တစ်ခု။                                                                                                                                                                                                                                                                                                          |
| `unique(columns, { name? })`                                                 | `UNIQUE` table constraint တစ်ခု။                                                                                                                                                                                                                                                                                                               |
| `foreignKey(columns, refTable, refColumns, { name?, onDelete?, onUpdate? })` | `FOREIGN KEY` table constraint တစ်ခု၊ positional argument တွေနဲ့။ `this.addForeignKey` ရဲ့ `foreignKey` option က ပုံစံမတူဘဲ object ပါ။ `refTable` က schema တူတူထဲက table ပါ။ အခြား schema ထဲက table ကို ညွှန်ဖို့ table ရှိပြီးနောက် `this.addForeignKey` ကို သုံးပါ။                                                                                |
| `checkExpression(name, expression)`                                          | `CHECK` table constraint တစ်ခု။ `expression` က SQL ဖြစ်ပြီး ပေါ်လာသင့်တဲ့အတိုင်း ရေးပါ။                                                                                                                                                                                                                                                     |
| `placeholder(name)`                                                          | Query တစ်ခု သင်ရေးရမယ့်နေရာမှာ `migration plan` ချန်ထားတဲ့အရာ။ အဲဒါ ပါနေသေးတဲ့ migration ကို run ရင် `code` က `MIGRATION.UNFILLED_PLACEHOLDER` ဖြစ်တဲ့ error နဲ့ ကျရှုံးပါတယ်။                                                                                                                                                                     |

`migration plan` က plan လုပ်တဲ့ column တိုင်းမှာ `codecRef` ကို ရေးပါတယ်၊ ဥပမာ `{ codecId: 'pg/text@1' }` — အဲဒါက column ရဲ့ values တွေကို ဘယ်လို ဖတ်/ရေး မလဲ နာမည်ပေးတာပါ။ ရေးထားတဲ့အတိုင်း ထားခဲ့ပါ။ ဒီ id တွေရဲ့ ထုတ်ပြန်ထားတဲ့ စာရင်း မရှိတာမို့ — ကိုယ်တိုင် ရေးတဲ့ column မှာ `codecRef` ကို မထည့်ဘဲ ထားပါ: column က အတူတူပဲ ဖန်တီးခံရပြီး၊ migration file တွေကို စစ်ဆေးတဲ့ `npx prisma migration check` နဲ့ `db migrate` နှစ်ခုလုံးက လက်ခံပါတယ်။

```ts
this.createTable({
  schema: 'public',
  table: 'post',
  columns: [
    col('id', 'integer', { notNull: true }),
    col('title', 'text', { notNull: true }),
    col('authorId', 'integer', { notNull: true }),
    col('views', 'integer', { notNull: true, default: lit(0) }),
    col('createdAt', 'timestamptz', { notNull: true, default: fn('now()') }),
    col('meta', 'jsonb'),
  ],
  constraints: [
    primaryKey(['id']),
    unique(['title'], { name: 'post_title_key' }),
    foreignKey(['authorId'], 'user', ['id'], { name: 'post_author_fkey', onDelete: 'cascade' }),
    checkExpression('post_views_min', '"views" >= 0'),
  ],
}),
```

```sql
CREATE TABLE "public"."post" (
  "id" integer NOT NULL,
  "title" text NOT NULL,
  "authorId" integer NOT NULL,
  "views" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  "meta" jsonb,
  PRIMARY KEY ("id"),
  CONSTRAINT "post_title_key" UNIQUE ("title"),
  CONSTRAINT "post_author_fkey" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "post_views_min" CHECK ("views" >= 0)
)
```

## MongoDB Operation တွေ

MongoDB `migration.ts` ကလည်း ပုံစံအတူတူပါပဲ၊ အရာအားလုံးက module တစ်ခုတည်းကနေ လာပါတယ်:

```ts
import { Migration, MigrationCLI, placeholder, createCollection, dropCollection, createIndex, dropIndex, setValidation, collMod, validatedCollection, dataTransform } from '@prisma/orm-mongo/target/migration';
```

Operation တွေက method တွေမဟုတ်ဘဲ သာမန် function တွေဖြစ်တာမို့ `operations` က `this.createCollection(...)` မဟုတ်ဘဲ `createCollection('products')` လိုမျိုး call တွေကို return လုပ်ပါတယ်။ `this.endContract.collection.products` ဆိုတာ end contract ထဲက `products` collection ပါ၊ သူ့ `validator` နဲ့အတူပါ။

Data transform တစ်ခုရဲ့ `run` callback က field သုံးခုပါတဲ့ query object တစ်ခု return လုပ်ပါတယ်: `collection`၊ `RawUpdateManyCommand` လိုမျိုး `command`၊ ပြီးတော့ end contract ရဲ့ hash ဖြစ်တဲ့ `storageHash` ကို ကိုင်တဲ့ `meta` ပါ။ Check ရဲ့ `source` ကလည်း `AggregateCommand` ပါတဲ့ အဲဒီလို object မျိုး return လုပ်ပါတယ်။ ဒီဥပမာမှာ helper နှစ်ခုလုံး migration နဲ့အတူ `migration.ts` ထဲမှာပဲ ရှိပါတယ်။ ပထမ helper က check အတွက် query ဖြစ်ပြီး `status` မရှိတဲ့ document တစ်ခုကို ရှာပါတယ်။ ဒုတိယ helper က `status` မရှိတဲ့ document တိုင်းမှာ `status` ကို `'active'` သတ်မှတ်ပါတယ်။ `RawUpdateManyCommand` က collection နာမည်၊ filter တစ်ခုနဲ့ update တစ်ခုကို ယူပါတယ်:

```ts
import {
  AggregateCommand,
  MongoExistsExpr,
  MongoLimitStage,
  MongoMatchStage,
  type MongoQueryPlan,
  RawUpdateManyCommand,
} from '@prisma/orm-mongo/query-ast/execution';

function existingProductsWithoutStatus(storageHash: string): MongoQueryPlan {
  return {
    collection: 'products',
    command: new AggregateCommand('products', [
      new MongoMatchStage(new MongoExistsExpr('status', false)),
      new MongoLimitStage(1),
    ]),
    meta: { target: 'mongo', storageHash, lane: 'mongo-pipeline' },
  };
}

function backfillRun(storageHash: string): MongoQueryPlan {
  return {
    collection: 'products',
    command: new RawUpdateManyCommand(
      'products',
      { status: { $exists: false } },
      { $set: { status: 'active' } },
    ),
    meta: { target: 'mongo', storageHash, lane: 'mongo-raw' },
  };
}
```

ပြီးရင် migration ရဲ့ `operations` က `@prisma/orm-mongo/target/migration` က `setValidation` နဲ့အတူ နှစ်ခုလုံးကို သုံးပါတယ်:

```ts
override get operations() {
  const storageHash = this.endContract.storage.storageHash;
  const productsValidator = this.endContract.collection.products.validator;
  return [
    setValidation('products', productsValidator.jsonSchema, {
      validationLevel: productsValidator.validationLevel,
      validationAction: productsValidator.validationAction,
    }),
    dataTransform('backfill-product-status', {
      check: { source: () => existingProductsWithoutStatus(storageHash) },
      run: () => backfillRun(storageHash),
    }),
  ];
}
```

| Function                                      | Arguments                                                                                                                                                                                                               | Class                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `createCollection(name, options?)`            | `options`: `validator`, `validationLevel`, `validationAction`, `capped`, `size`, `max`, `timeseries`, `collation`, `changeStreamPreAndPostImages`, `clusteredIndex`                                                      | additive                                                            |
| `dropCollection(name)`                        |                                                                                                                                                                                                                          | destructive                                                         |
| `createIndex(collection, keys, options?)`     | `keys`: `{ field, direction }` စာရင်း; `options`: `unique`, `sparse`, `name`, `expireAfterSeconds`, `partialFilterExpression`, `collation`, `weights`, `default_language`, `language_override`, `wildcardProjection`     | additive                                                            |
| `dropIndex(collection, keys)`                 | Index ဖန်တီးစဉ်က သုံးခဲ့တဲ့ `keys` အတူတူ။                                                                                                                                                                                | destructive                                                         |
| `setValidation(collection, schema, options?)` | `schema`: JSON Schema object တစ်ခု; `options`: `validationLevel` (`'strict'` ဒါမှမဟုတ် `'moderate'`) နဲ့ `validationAction` (`'error'` ဒါမှမဟုတ် `'warn'`)                                                             | destructive                                                         |
| `collMod(collection, options, meta?)`         | `options`: `validator`, `validationLevel`, `validationAction`, `changeStreamPreAndPostImages: { enabled }`; `meta`: `id`, `label`, `operationClass`                                                                    | `meta: { operationClass: 'additive' }` မပေးရင် `destructive`        |
| `validatedCollection(name, schema, indexes)`  | Collection ကို `schema` ကို validator အနေနဲ့ထားပြီး၊ `{ keys, unique? }` entry တစ်ခုစီအတွက် index တစ်ခုနဲ့အတူ ဖန်တီးတယ်၊ `keys` က `createIndex` ထဲကအတိုင်း။ Operation စာရင်းတစ်ခု return လုပ်တာမို့ spread လုပ်ပါ: `...validatedCollection(...)` | additive                                                            |
| `dataTransform(name, options)`                | `options`: `run`, `check?`, `invariantId?`                                                                                                                                                                              | data                                                                |

`direction` က `1`၊ `-1`၊ `'text'`၊ `'2dsphere'`၊ `'2d'` ဒါမှမဟုတ် `'hashed'` ပါ။

MongoDB ပေါ်က `dataTransform` က contract argument မယူပါဘူး၊ ပြီးတော့ သူ့ `check` က `source` ဆိုတဲ့ callback ပါတဲ့ object တစ်ခုဖြစ်ပြီး — အဲဒါက ပြောင်းလဲမှု လိုအပ်နေသေးတဲ့ documents တွေအတွက် query တစ်ခု return လုပ်ပါတယ်။ ကျန်တဲ့ field နှစ်ခု `filter` နဲ့ `expect` ကတော့ ရွေးချယ်နိုင်တာမို့ မထည့်ဘဲ ထားလို့ရပါတယ်။ [Migration တစ်ခုကို တည်းဖြတ်ခြင်း](/docs/prisma/editing-a-migration) မှာ ဖြည့်ပြီးသား ဥပမာကို ပြထားပါတယ်။

## နောက်ထပ် ဖတ်ရန် (See also)

* [Migration တစ်ခုကို တည်းဖြတ်ခြင်း](/docs/prisma/editing-a-migration): plan လုပ်ထားတဲ့ migration ကို ဖြည့်ခြင်း၊ backfill တွေနဲ့ raw SQL
* [Migration တွေ ဘယ်လို အလုပ်လုပ်လဲ](/docs/prisma/how-migrations-work): `ops.json` ထဲ ဘာပါလဲ နဲ့ operation တိုင်း ကိုယ့်ကိုယ်ကို ဘယ်လို စစ်ဆေးလဲ
* [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) နဲ့ [`migration new`](https://www.prisma.io/docs/cli/migration-new): `migration.ts` ကို ရေးပေးတဲ့ command တွေ

## ဆက်စပ် Page တွေ (Related pages)

- [`Error reference`](https://www.prisma.io/docs/orm/reference/error-reference): Prisma ORM command တွေ၊ runtime နဲ့ extension တွေရဲ့ structured error code တွေ — namespace အလိုက်၊ တစ်ခုချင်းစီကို ဖြစ်စေတဲ့ အခြေအနေနဲ့အတူ။
- [`ORM client reference`](https://www.prisma.io/docs/orm/reference/orm-client): Prisma ORM client ရဲ့ query၊ mutation၊ filter နဲ့ aggregate method တွေအတွက် reference။
- [`Pipeline builder reference`](https://www.prisma.io/docs/orm/reference/pipeline-builder): Prisma ORM MongoDB pipeline builder ရဲ့ stage တွေ၊ accumulator တွေ၊ expression helper တွေနဲ့ write method တွေအတွက် reference။
- [`Raw queries reference`](/docs/prisma/raw-queries): Prisma ORM raw query တွေအတွက် reference: PostgreSQL raw SQL နဲ့ MongoDB raw command တွေ။
- [`SQL query builder reference`](https://www.prisma.io/docs/orm/reference/sql-query-builder): Prisma ORM SQL query builder ရဲ့ select၊ mutation နဲ့ grouped query method တွေအတွက် reference။
