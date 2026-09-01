---
title: "Migration တစ်ခု Generate လုပ်ခြင်း (Generating a Migration)"
description: "migration plan command နဲ့ contract ပြောင်းလဲမှုတစ်ခုကို ပြန်လည်သုံးသပ်လို့ရတဲ့ migration အဖြစ် ပြောင်းလဲခြင်း — တစ်ခုလုံး offline"
order: 16
source: "https://www.prisma.io/docs/orm/prisma-migrate/generating-a-migration"
status: translated
updated: 2026-09-01
---

ဒီ tutorial က contract ပြောင်းလဲမှုတစ်ခုကို သင့် editor ကနေ disk ပေါ်မှာ plan လုပ်ပြီးသား migration တစ်ခုအထိ ပို့ဆောင်ပေးပါတယ်။ Planning က **လုံးဝ offline** ပါ။ `migration plan` က သင့် emitted contract နဲ့ ရှိပြီးသား migrations တွေကို ဖတ်ပြီး — database တစ်ခုကို ဘယ်တော့မှ မချိတ်ပါဘူး။ ဆိုလိုတာက လေယာဉ်ပေါ်မှာ၊ CI မှာ၊ ဒါမှမဟုတ် credentials မရှိတဲ့ sandbox ထဲမှာတောင် plan လုပ်လို့ရပါတယ်။

Minimal project တစ်ခုကနေ စပါ။ `npx create-prisma@latest` က တစ်ခု scaffold လုပ်ပေးပါတယ်။

## သင့် ပထမဆုံး Migration

သင့် contract မှာ model တစ်ခုတည်း ရှိတယ် ဆိုပါစို့:

```prisma
model User {
  id    Int     @id
  email String
  name  String?

  @@map("user")
}
```

အရင်ဆုံး contract ကို emit လုပ်ပါ။ ဒါက schema ကို တခြား command တိုင်း ဖတ်တဲ့ `contract.json` artifact အဖြစ် compile လုပ်ပေးပါတယ်:

```bash
npx prisma@latest contract emit
```

အခု plan လုပ်ပါ။ `--name` က directory နာမည်ရဲ့ လူဖတ်လို့ရတဲ့ အပိုင်းကို သတ်မှတ်ပါတယ်။ ချန်လိုက်ရင် directory နာမည်က `migration` လို့ ခေါ်ပါတယ်:

```bash
npx prisma@latest migration plan --name init
```

```text
✔ Planned 2 operation(s)

│
├─ Create schema "public"
└─ Create table "user"

from:   null
to:     sha256:705b1a62f26f0913caa4bfe3f8b7cb491a1b94bd47fc43471d8711bc480bcbb5
App space → migrations/app/20260707T1005_init

Next: review migrations/app/20260707T1005_init if needed, then run prisma-cli migrate.

DDL preview

CREATE SCHEMA IF NOT EXISTS "public";
CREATE TABLE "public"."user" (
  "email" text NOT NULL,
  "id" int4 NOT NULL,
  "name" text,
  PRIMARY KEY ("id")
);
```

(Hint ထဲက `prisma-cli` က binary ရဲ့ ကိုယ့်ကိုယ်ကို ခေါ်တဲ့ နာမည်ပါ။ `npx prisma@latest` အနေနဲ့ ခေါ်တဲ့အခါ — အကြံပြုထားတဲ့ subcommand ကို အလားတူ ပုံစံနဲ့ run ပါ: `npx prisma@latest db migrate`။)

သတိထားစရာ လေးချက်:

- **DDL preview က ချက်ချင်း ရှိနေတယ်။** File တွေကလွဲလို့ ဘာမှ မရှိသေးခင် SQL အတိအကျကို မြင်ရပါတယ်။
- **`from: null`** ဆိုတာ ဒီ migration က database အလွတ်တစ်ခုကနေ စတာပါ။ ဒါက သင့် [migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) ရဲ့ root ပါ။
- **`to:` က သင့် contract ရဲ့ hash ပါ။** Migration က သင်လေးနက်စွာ emit လုပ်ထားတဲ့ contract နဲ့ အတိအကျ ကိုက်ညီတဲ့ database တစ်ခုကို ပို့ဆောင်ပေးမယ်လို့ ကတိပေးပါတယ်။
- **`App space`** က သင့် application ရဲ့ migration lane ပါ။ Database extensions တွေက ကိုယ်ပိုင် lanes တွေ ယူဆောင်လာပါတယ်။ [extension spaces](/docs/prisma/applying-a-migration#extension-spaces) ကို ကြည့်ပါ။

Plan လုပ်ပြီးသား migration directory ထဲမှာ TypeScript source, compiled operations နဲ့ contract snapshots တွေ ပါဝင်ပါတယ်:

```text
migrations/app/20260707T1005_init/
├── migration.ts
├── ops.json
├── migration.json
└── end-contract.json  (+ end-contract.d.ts)
```

`migration.ts` ကို ဖွင့်ကြည့်ပါ။ ဒါက ပြောင်းလဲမှုရဲ့ ဖော်ပြချက်လို ဖတ်ရပြီး — ဘာလို့လဲဆိုတော့ အဲဒါကိုယ်တိုင် ဖော်ပြချက်ပါ:

```ts
import type { Contract as End } from './end-contract';
import endContract from './end-contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
```

ဖတ်တဲ့အခါ မှတ်စုနှစ်ခု: `col(...)` calls တွေက သင့် contract field တွေကို mirror လုပ်ပြီး — `codecRef` ကို လက်နဲ့ ဘယ်တော့မှ မရေးပါဘူး။ Planner က TypeScript နဲ့ Postgres အကြား value တွေ ဘယ်လို ပြောင်းလဲလဲ သေချာဖို့ ဖြည့်ပေးပါတယ်။ Review လုပ်တဲ့အခါ noise အဖြစ် သဘောထားပါ။

ရိုးရိုးပြောင်းလဲမှုတစ်ခုအတွက် ဒီ file ကို ထိစရာ မလိုပါဘူး။ ထိလိုအပ်တဲ့အခါ (data backfill ထည့်တာ၊ operations တွေ ပြန်စီတာ၊ raw SQL ထည့်တာ) — [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) ကို ကြည့်ပါ။

## ဒုတိယ Migration — Delta တစ်ခု Plan လုပ်ခြင်း

ပထမ migration ကို apply လုပ်ပါ ([Applying a migration](/docs/prisma/applying-a-migration) မှာ အသေးစိတ် ဖော်ပြထားပါတယ်)၊ ပြီးရင် နောက်ထပ် ပြောင်းလဲမှုတစ်ခု လုပ်ပါ — `phone` field တစ်ခု ထည့်တာပါ:

```prisma
model User {
  id    Int     @id
  email String
  name  String?
  phone String?

  @@map("user")
}
```

Emit လုပ်ပြီး ပြန် plan လုပ်ပါ။ ဒီတစ်ခါ planner ကို ဘယ်ကနေ စရမလဲ ပြောပြပါ — schema တစ်ခုလုံး အစား *delta* ကို plan လုပ်ဖို့ပါ:

```bash
npx prisma@latest contract emit
npx prisma@latest migration plan --name add_user_phone --from 20260707T1005_init
```

```text
✔ Planned 1 operation(s)

│
└─ Add column "phone" to "user"

from:   sha256:705b1a62f26f0913caa4bfe3f8b7cb491a1b94bd47fc43471d8711bc480bcbb5
to:     sha256:925198f3cc272c5fd19c24ac02f251661775ddac21cdac4e634bbc0dda8b2d72
App space → migrations/app/20260707T1006_add_user_phone

DDL preview

ALTER TABLE "public"."user" ADD COLUMN "phone" text;
```

`--from` က migration directory နာမည် (ဒီမှာလိုမျိုး)၊ contract hash ဒါမှမဟုတ် မရှင်းမလင်းမဖြစ်တဲ့ prefix (unambiguous prefix)၊ ref နာမည်၊ ဒါမှမဟုတ် "<dir>^" — "အဲဒီ migration ရဲ့ *အရင်က* state" လို့ အဓိပ္ပာယ်ရတဲ့ဟာတွေကို လက်ခံပါတယ်။

### db Ref — --from ကို ကျော်ခြင်း

`--from` ကို အကြိမ်တိုင်း ပေးစရာ မလိုပါဘူး။ **`db`** လို့ အမည်ရတဲ့ [ref](https://www.prisma.io/docs/orm/migrations/the-migration-graph#name-important-states-with-refs) တစ်ခု ရှိရင် planning က သူညွှန်တဲ့အရာကနေ ပုံမှန်အားဖြင့် စပါတယ်။ Apply လုပ်တိုင်း ref ကို ရှေ့ရွှေ့ပါ:

```bash
npx prisma@latest db migrate --advance-ref db
npx prisma@latest migration plan --name next_change   # db ref ကနေ အလိုအလျောက် စတယ်
```

> **Warning — `--from` ဒါမှမဟုတ် `db` ref မရှိရင် plan တွေက အလွတ်ကနေ စတယ်**
>
> `db` ref မရှိဘဲ `--from` ကိုလည်း ချန်လိုက်ရင် — `migration plan` က **database အလွတ်တစ်ခု**ကနေ plan လုပ်ပါတယ်: delta တစ်ခု မဟုတ်ဘဲ `CREATE`-အစုံပါတဲ့ full migration တစ်ခုပါ။ Column တစ်ခုတည်း ပြောင်းလဲမှုကို မျှော်လင့်ပြီး `CREATE TABLE` တွေ နံရံကြီး ရလာရင် ဒါက အကြောင်းရင်းပါ။ `--from` ပေးပါ ဒါမှမဟုတ် `db` ref တစ်ခု တည်ဆောက်ပါ။

## Planner က သင့် ထည့်သွင်းမှု လိုအပ်တဲ့အခါ

Schema diff တစ်ခုတည်းကနေ plan လို့မရတဲ့ ပြောင်းလဲမှုတွေ ရှိပါတယ်။ Rows တွေ ရှိနေပြီးသား table တစ်ခုကို **required** field တစ်ခု ထည့်ပါ — planner က `ADD COLUMN` နဲ့ `SET NOT NULL` ကို ရေးနိုင်ပေမယ့် ရှိပြီးသား rows တွေထဲမှာ ဘာတွေ ရှိသင့်လဲဆိုတာက သင်ပဲ သိပါတယ်။ မှန်းဆတာ မလုပ်ဘဲ — ဆုံးဖြတ်ချက်ကို **placeholder** တစ်ခုအနေနဲ့ scaffold လုပ်ပေးပါတယ်:

```text
⚠ Planned migration with placeholder(s) — edit migration.ts then run `node migration.ts` to self-emit

Open migration.ts and replace each `placeholder(...)` call with your actual query.
Then run: node migrations/app/20260707T1008_add_display_name/migration.ts
```

Generate လုပ်ထားတဲ့ migration က schema steps တွေကြားမှာ `dataTransform` တစ်ခုကို ညှပ်ထည့်ပြီး — သင့် backfill query ဝင်မယ့်နေရာမှာ `placeholder(...)` ပါပါတယ်။ အဲဒါကို ဖြည့်တာက [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) ရဲ့ အကြောင်းအရာပါ။

## Plan လုပ်ထားတာကို ပြန်လည်သုံးသပ်ခြင်း

Offline command သုံးခုက ဘာမှ run မလုပ်ခင် loop ကို ပိတ်ပေးပါတယ်:

```bash
# Migration တစ်ခုကို အသေးစိတ်: operations, metadata, DDL preview
npx prisma@latest migration show 20260707T1006_add_user_phone

# Graph တစ်ခုလုံး၊ သင့် edge အသစ် ပါနေတဲ့အတိုင်း
npx prisma@latest migration graph

# Integrity check: hashes တွေ ကိုက်လား၊ files တွေ ပြည့်စုံလား၊ graph ကောင်းလား; ကျရှုံးရင် non-zero exit
npx prisma@latest migration check
```

`migration check` က CI အတွက် ဒီဇိုင်းထုတ်ထားပါတယ်: exit code `0` ဆိုရင် သန့်ရှင်းတယ်၊ `2` ဆိုရင် သင်တောင်းတာကို ဖြေရှင်းလို့မရဘူး၊ `4` ဆိုရင် integrity failure — ဥပမာ တစ်ယောက်ယောက်က `migration.ts` ကို ပြန် run မလုပ်ဘဲ `ops.json` ကို လက်နဲ့ ပြင်ထားတာမျိုးပါ။

> **အစောပိုင်း အဆင့်မှာ ဘာတွေလဲ**
>
> Planning က tables, columns, indexes, constraints နဲ့ အပေါ်က ပြထားတဲ့ backfill scaffold ကို လွှမ်းခြုံပါတယ်။ Rename inference က မတည်ဆောက်ရသေးပါဘူး: field တစ်ခုကို rename လုပ်တာက **drop column + add column** အနေနဲ့ plan လုပ်ပြီး — data-loss warning ပါတဲ့ destructive လို့ အမှတ်အသား လုပ်ပါတယ်။ True rename လိုချင်ရင် migration ကို ပြင်ပြီး ဒီအတွဲကို `rawSql` `ALTER TABLE ... RENAME COLUMN` နဲ့ အစားထိုးပါ။ Interactive mode လည်း မရှိသေးပါဘူး။ Planner က သူ့ရဲ့ အကောင်းဆုံး အဖြေကို ရေးပြီး သန့်စင်မှုကို `migration.ts` ထဲမှာ သင့်လက်ထဲ ထားပေးပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "User ကို required `displayName` field တစ်ခု ထည့်၊ contract ကို emit လုပ်ပြီး migration plan လုပ်ပေးပါ။"
- "`add-orders-table` လို့ အမည်ရတဲ့ migration တစ်ခု plan လုပ်ပြီး — commit မလုပ်ခင် သူ့ရဲ့ DDL preview ကို ပြပေးပါ။"
- "`migration check` run ပြီး integrity failure တွေရှိရင် ရှင်းပြပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) — placeholders တွေ ဖြည့်ခြင်း၊ data steps တွေ ထည့်ခြင်း၊ raw SQL ရေးခြင်း
- [Applying a migration](/docs/prisma/applying-a-migration) — သင်စီစဉ်ထားတာကို run လုပ်ခြင်း
- [Studio with Prisma 8](https://www.prisma.io/docs/studio/prisma-next) — apply ပြီးတာနဲ့ Prisma Studio မှာ တူညီတဲ့ operations တွေကို visual diff အဖြစ် မြင်ရပါတယ်
- [TypeScript Migrations in Prisma 8](https://www.prisma.io/blog/typescript-migrations-in-prisma-next) — `migration.ts` ရဲ့ နောက်ကွယ်က ဒီဇိုင်း ဇာတ်လမ်း
