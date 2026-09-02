---
title: "Migration တစ်ခုကို တည်းဖြတ်ခြင်း (Editing a Migration)"
description: "Migration က သင်ပိုင်တဲ့ TypeScript ပါ — backfill တွေ ဖြည့်ပါ၊ step တွေ ပြန်စီပါ၊ raw SQL ချသုံးပါ — ပြီးရင် command တစ်ခုတည်းနဲ့ ပြန် compile လုပ်ပါ"
order: 26
source: "https://www.prisma.io/docs/orm/migrations/editing-a-migration"
status: translated
updated: 2026-09-02
---

Migration တစ်ခုက သင်ပိုင်တဲ့ TypeScript ပါ။ Backfills တွေ ဖြည့်ပါ၊ step တွေ ပြန်စီပါ၊ ဒါမှမဟုတ် raw SQL အထိ ဆင်းပြီး — command တစ်ခုတည်းနဲ့ ပြန် compile လုပ်ပါ။

Planner က ကောင်းတဲ့ ပထမမူကြမ်း တစ်ခု ရေးပေးပါတယ် — ဒါပေမယ့် တကယ့် migrations အများအပြားမှာ လူသား (ဒါမှမဟုတ် agent) တစ်ယောက်ရဲ့ ဆုံးဖြတ်ချက် လိုပါတယ်: column တစ်ခု required ဖြစ်လာတဲ့အခါ ရှိပြီးသား rows တွေထဲ ဘာထည့်မလဲ၊ step နှစ်ခု ဘယ်အစီအစဉ်နဲ့ run ရမလဲ၊ planner မှာ factory မရှိတဲ့ statement တစ်ခု။ Prisma 8 မှာ အဲဒီပြောင်းလဲမှုတွေကို — autocomplete နဲ့ type checking ပါတဲ့ သာမန် TypeScript ဖြစ်တဲ့ `migration.ts` ကို တည်းဖြတ်ပြီး ပြန် compile လုပ်ခြင်းအားဖြင့် လုပ်ပါတယ်။ SQL file တွေ ဒါမှမဟုတ် `ops.json` ကို လက်နဲ့ ဘယ်တော့မှ မတည်းဖြတ်ပါဘူး။

ဒါကို လုံခြုံအောင် လုပ်ပေးတဲ့ စည်းမျဉ်း:

> **သင်က `migration.ts` ကို တည်းဖြတ်တယ်။ အဲဒါ run လိုက်တာက `ops.json` ကို ပြန်ထုတ်ပေးတယ်။ Runner က `ops.json` ကိုပဲ အမြဲ execute လုပ်တယ်။**

တည်းဖြတ်ပြီးတိုင်း — သင့် project ထဲကနေ ပြန် compile လုပ်ပါ:

```bash
node migrations/app/20260707T1008_add_display_name/migration.ts
```

```text
Wrote ops.json + migration.json to migrations/app/20260707T1008_add_display_name
```

ပြန် compile လုပ်တာက migration ကို **re-attest** လည်း လုပ်ပါတယ်: `migration.json` က compiled output ကို fingerprint လုပ်တဲ့ `migrationHash` အသစ် တစ်ခု ရပြီး — နောက်မှာ `ops.json` ကို လက်နဲ့ ပြင်တာမျိုး ဖော်ထုတ်လို့ရပါတယ်။ တစ်ယောက်ယောက်က `ops.json` ကို တိုက်ရိုက် တည်းဖြတ်ရင်၊ ဒါမှမဟုတ် `migration.ts` ကို ပြင်ပြီး ပြန် compile လုပ်ဖို့ မေ့သွားရင် — `migration check` က CI မှာ hash mismatch နဲ့ ကျရှုံးပါတယ်။ `migration.ts` နဲ့ `ops.json` ကို lockfile တစ်ခုနဲ့ သူ့ manifest လိုမျိုး — အတူတူ commit လုပ်ပါ။

## လက်တွေ့ ဥပမာ: Column တစ်ခု Required ဖြစ်လာအောင် လုပ်ခြင်း

ဒါက ဂန္ထဝင် case ပါ။ `User` က required `displayName` တစ်ခု ရလာပြီး — table ထဲမှာ rows တွေ ရှိပြီးသား ဖြစ်ကာ — အဲဒီ rows တွေမှာ `displayName` မရှိပါဘူး။ Plan လုပ်ပါ:

```bash
npx prisma@latest migration plan --name add_display_name
```

```text
⚠ Planned migration with placeholder(s) — edit migration.ts then run `node migration.ts` to self-emit

Open migration.ts and replace each `placeholder(...)` call with your actual query.
```

Planner က ပြုပြင်မှုရဲ့ ပုံသဏ္ဍာန် (column ကို nullable အနေနဲ့ ထည့်၊ backfill လုပ်၊ ပြီးမှ tighten လုပ်) ကို သိပြီး — အတိအကျ အဲဒါကို scaffold လုပ်ကာ backfill query ကို သင့်လက်ထဲ ထားပေးပါတယ်:

```ts
override get operations() {
  return [
    this.addColumn({
      schema: 'public',
      table: 'user',
      column: col('displayName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
    }),
    this.dataTransform(endContract, 'backfill-user-displayName', {
      check: () => placeholder('backfill-user-displayName:check'),
      run: () => placeholder('backfill-user-displayName:run'),
    }),
    this.setNotNull({ schema: 'public', table: 'user', column: 'displayName' }),
  ];
}
```

`dataTransform` တစ်ခုက closure နှစ်ခု ယူပါတယ်။ `check` က "ဒါကို လိုနေသေးတဲ့ rows တွေ ရှိလား" လို့ မေးပါတယ်။ *Row တစ်ခုခု* ရှိနေတာက အလုပ် ကျန်နေသေးတယ်လို့ ဆိုလိုတဲ့ — row-returning query တစ်ခု ဖြစ်ရပါမယ်။ ပုံမှန် ပုံစံက `select('id').where(<violation>).limit(1)` ပါ။ `run` က ပြောင်းလဲမှုကို လုပ်ဆောင်ပါတယ်။ Migration ဘေးမှာ ရှိနေတဲ့ contract snapshot နဲ့ ချိတ်ထားတဲ့ typed SQL query builder နဲ့ သူတို့ကို ဖြည့်ပါ:

```ts
import type { Contract as End } from './end-contract';
import endContractJson from './end-contract.json' with { type: 'json' };
import type { Contract as Start } from './start-contract';
import startContractJson from './start-contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';
import postgresAdapter from '@prisma/orm-postgres/adapter/runtime';
import { sql } from '@prisma/orm-postgres/builder/runtime';
import { createExecutionContext, createSqlExecutionStack } from '@prisma/orm-postgres/family-runtime';
import postgresTarget, { PostgresContractSerializer } from '@prisma/orm-postgres/target/runtime';

const endContract = new PostgresContractSerializer().deserializeContract(endContractJson);

const db = sql<End>({
  context: createExecutionContext({
    contract: endContract,
    stack: createSqlExecutionStack({ target: postgresTarget, adapter: postgresAdapter }),
  }),
});

export default class M extends Migration<Start, End> {
  override readonly endContractJson = endContractJson;
  override readonly startContractJson = startContractJson;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('displayName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
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
      this.setNotNull({ schema: 'public', table: 'user', column: 'displayName' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
```

ခဏရပ်ပြီး ကြည့်သင့်တဲ့ အသေးစိတ် နှစ်ခု:

- **Types တွေက migration ရဲ့ ကိုယ်ပိုင် contract snapshot** (`./end-contract`) ကနေ လာတာပါ — သင့် live app contract ကနေ မဟုတ်ပါဘူး။ သင်က schema *ဒီ step run တဲ့အချိန်မှာ ရှိမယ့်ပုံစံ* နဲ့ ယှဉ်ပြီး type-check လုပ်နေတာပါ။ ဒါကြောင့် column က မရှိသေးပေမယ့် builder က `displayName` ကို သက်တောင့်သက်သာ ရည်ညွှန်းနိုင်တာပါ — ပြီးတော့ လွန်ခဲ့တဲ့ လများစွာက ရေးထားတဲ့ migration တစ်ခုက သင့် contract ရှေ့ဆက်သွားတဲ့အခါမှာလည်း compile ဖြစ်နေတာပါ။
- **Query က application-grade TypeScript အစစ် ဖြစ်ပါတယ်။** Shared constants တွေ import လုပ်လို့ရပြီး — column နာမည်ထဲက စာလုံးပေါင်း အမှားတွေက production မှာ ကျရှုံးတာထက် type check မှာပဲ ကျရှုံးပါတယ်။

ထိပ်မှာရှိတဲ့ wiring block (contract ကို deserialize လုပ်ပြီး `db` handle တည်ဆောက်တာ) က လက်ရှိ ပုံစံပါ။ ဒါက တစ်ကြောင်းတည်းအထိ တိုသွားမယ်လို့ မျှော်လင့်ပါတယ်။ သင့် live app client အစား — ဒီ migration ရဲ့ snapshot နဲ့ ယှဉ်ပြီး typed လုပ်ထားတဲ့ query builder တစ်ခုရဲ့ ဈေးနှုန်းပါ။

`node migration.ts` နဲ့ ပြန် compile လုပ်ပြီး — backfill က ဘာဖြစ်သွားလဲ စစ်ဆေးပါ:

```json
{
  "id": "data_migration.backfill-user-displayName",
  "label": "Data transform: backfill-user-displayName",
  "operationClass": "data",
  "precheck": [
    {
      "description": "Check backfill-user-displayName has work to do",
      "sql": "SELECT EXISTS (SELECT \"id\" AS \"id\" FROM \"public\".\"user\" WHERE \"displayName\" IS NULL LIMIT 1) AS ok",
      "params": []
    }
  ],
  "execute": [
    {
      "description": "Run backfill-user-displayName",
      "sql": "UPDATE \"public\".\"user\" SET \"displayName\" = $1 WHERE \"displayName\" IS NULL",
      "params": ["Anonymous"]
    }
  ],
  "postcheck": [
    {
      "description": "Verify backfill-user-displayName resolved all violations",
      "sql": "SELECT NOT EXISTS (SELECT \"id\" AS \"id\" FROM \"public\".\"user\" WHERE \"displayName\" IS NULL LIMIT 1) AS ok",
      "params": []
    }
  ]
}
```

သင့် `check` closure က precheck (`EXISTS`: အလုပ် ရှိလား?) ရော postcheck (`NOT EXISTS`: ပြီးပြီလား?) ရော နှစ်ခုလုံး ဖြစ်သွားပါတယ်။ သင့် `run` က parameterized `UPDATE` တစ်ခု ဖြစ်သွားပါတယ်။ `"Anonymous"` က `params` ထဲမှာ သွားပြီး — driver ရဲ့ parameter binder ကနေတစ်ဆင့် — SQL text ထဲကို ဘယ်တော့မှ မထည့်တာကို သတိပြုပါ။ သင့် PR ကို ပြန်လည်သုံးသပ်တဲ့သူက `migration.ts` ထဲမှာ ရည်ရွယ်ချက်နဲ့ `ops.json` ထဲမှာ တိကျတဲ့ statements တွေကို — ဘေးချင်းကပ် မြင်ရပါတယ်။

## Escape hatch: Raw SQL

Operation factories တွေ မလွှမ်းခြုံတဲ့ ဘာအတွက်မဆို (extension တစ်ခု enable လုပ်ခြင်း၊ `CREATE INDEX CONCURRENTLY`၊ vendor-specific statement တစ်ခု) — `rawSql` ကို သုံးပြီး — တတ်နိုင်ရင် တူညီတဲ့ three-phase safety ကို ထိန်းထားပါ:

```ts
rawSql({
  id: 'extension.pgcrypto',
  label: 'Enable extension "pgcrypto"',
  operationClass: 'additive',
  target: { id: 'postgres' },
  precheck: [
    { description: 'not yet enabled', sql: "SELECT NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')" },
  ],
  execute: [{ description: 'enable it', sql: 'CREATE EXTENSION IF NOT EXISTS pgcrypto' }],
  postcheck: [
    { description: 'now enabled', sql: "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')" },
  ],
}),
```

Prechecks နဲ့ postchecks တွေက optional ပါ — ဒါပေမယ့် သူတို့ကမှ ကျရှုံးတဲ့ run တစ်ခုကို ပြန်စလို့ရအောင်၊ အမှားတစ်ခုကို ရှာဖွေတွေ့ရှိနိုင်အောင် လုပ်ပေးတာမို့ — သူတို့ကို ကျော်လိုက်တာက ဒီစနစ်က ပေးတဲ့အရာ အများစုကို လက်လွှတ်လိုက်တာပါ။ `rawSql` ကို နှစ်ခါ ရေးမိရင် — function တစ်ခုထဲကို မြှောက်လိုက်ပါ။ Built-in factories တွေက ဒါကို အတိအကျ လုပ်တဲ့ သာမန် functions တွေပါ။

## MongoDB ပေါ်မှာ အလားတူ ပုံစံ

Data transforms တွေက MongoDB ပေါ်မှာ တူညီတဲ့ `check`/`run` ပုံစံနဲ့ အလုပ်လုပ်ပြီး — precheck/execute/postcheck အဖြစ် compile လုပ်တာလည်း တူပါတယ်။ လက်နဲ့ ရေးတဲ့ Mongo transforms တွေက လက်ရှိမှာ typed builder အပြည့်အစုံ အစား — raw Mongo command shapes တွေကနေ query တွေ တည်ဆောက်ပါတယ်:

```ts
import { dataTransform, setValidation } from '@prisma/orm-mongo/target/migration';

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

Query-plan helpers နှစ်ခု အပါအဝင် — အလုပ်လုပ်တဲ့ migration အပြည့်အစုံက Prisma 8 repo ရဲ့ [retail-store example](https://github.com/prisma/orm/blob/main/examples/retail-store/migrations/app/20260513T0508_backfill_product_status/migration.ts) ထဲမှာ ရှိပါတယ်။

## Migration အလွတ်တစ်ခုကနေ စတင်ခြင်း

တစ်ခါတစ်ရံ contract ပြောင်းလဲမှု လုံးဝ မရှိပါဘူး: data-only migration တစ်ခု လိုချင်တာ၊ ဒါမှမဟုတ် တစ်ခုလုံးကို လက်နဲ့ ရေးချင်တာမျိုးပါ။ `migration new` က migration directory အလွတ်တစ်ခု (CLI ရေးတဲ့ဟာ အားလုံးလိုပဲ — attest လုပ်ပြီးသား) scaffold လုပ်ပေးပါတယ်:

```bash
npx prisma@latest migration new --name backfill_scores
```

ထွက်လာတဲ့ `migration.ts` ထဲမှာ သင့် operations တွေ ရေးပြီး — အလားတူ နည်းအတိုင်း compile လုပ်ပါ: `node migration.ts`။

## တည်းဖြတ်ခြင်း Checklist

1. `migration.ts` ကို တည်းဖြတ်ပါ — `ops.json` ကို ဘယ်တော့မှ မဟုတ်ပါဘူး။
2. ပြန် compile လုပ်ပါ: `node <migration-dir>/migration.ts`။
3. `ops.json` ရဲ့ diff ကို ပြန်လည်သုံးသပ်ပါ — run မယ့်ဟာက ဒါပါ။
4. စစ်ဆေးပါ: `npx prisma@latest migration check`။
5. `migration.ts`၊ `ops.json` နဲ့ `migration.json` ကို အတူတူ commit လုပ်ပါ။

> **အစောပိုင်း အဆင့်မှာ ဘာတွေလဲ**
>
> အပေါ်က typed-builder wiring နဲ့ raw Mongo command shapes တွေက လက်ရှိ မျက်နှာပြင်ပါ — ဒါတွေ ပိုပြီး ပါးလျလာမှာပါ။ ဒီ page ပေါ်မှာ ပြထားတာ အားလုံး (scaffolded placeholder flow၊ typed backfill၊ `rawSql`၊ recompile loop) က အစအဆုံး ဒီနေ့ အလုပ်လုပ်ပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "နောက်ဆုံး migration ထဲက placeholder ကို ဖြည့်ပေးပါ: `displayName` ကို user ရဲ့ email prefix နဲ့ backfill လုပ်ပါ။"
- "ဒီ migration ထဲမှာ unique constraint မတိုင်ခင် ရှိပြီးသား `phone` values တွေကို normalize လုပ်တဲ့ data transform တစ်ခု ထည့်ပေးပါ။"
- "ကျွန်တော် တည်းဖြတ်လိုက်တဲ့ migration ကို ပြန် compile လုပ်ပြီး ops.json diff ပြပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [Generating a migration](/docs/prisma/generating-a-migration) — scaffold က ဘယ်ကနေ လာလဲ
- [Applying a migration](/docs/prisma/applying-a-migration) — တည်းဖြတ်ပြီးသား migration ကို run လုပ်ခြင်း
- [Data Migrations in Prisma 8](https://www.prisma.io/blog/data-migrations-in-prisma-next) — `dataTransform` ရဲ့ ဒီဇိုင်း ဇာတ်လမ်း
- [How migrations work](/docs/prisma/how-migrations-work) — contract ပြောင်းတာ၊ migration plan လုပ်တာ၊ သုံးသပ်တာ၊ apply လုပ်တာ — step တိုင်း run မလုပ်ခင် နဲ့ လုပ်ပြီး နှစ်ကြိမ်လုံး စစ်ဆေးတယ်
- [Rollbacks and recovery](https://www.prisma.io/docs/orm/migrations/rollbacks-and-recovery) — rollback က သင်ရောက်ဖူးပြီးသား state တစ်ခုဆီ ဦးတည်တဲ့ migration တစ်ခု ထပ် plan လုပ်တာ၊ recovery က အကြောင်းရင်းကို ပြင်ပြီး ပြန် run တာ
- [The migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) — schema ပြောင်းတယ်၊ teammate က သူ့ဟာ ပြောင်းတယ်၊ နှစ်ခုလုံး merge — migration graph က file တွေ ပြန်နာမည်ပေးစရာ၊ history ပြန်ဆောက်စရာ မလိုဘဲ database တိုင်း လိုက်မီအောင် လုပ်ပေးတယ်
