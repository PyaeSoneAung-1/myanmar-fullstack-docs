---
title: "arktype-json — JSON Column ကို Type သတ်မှတ်ပြီး စစ်ဆေးခြင်း"
description: "arktype schema နဲ့ arktype-json extension ကို သုံးပြီး Prisma ORM 8 မှာ JSON column တစ်ခုကို TypeScript type ပေးကာ ဖတ်တဲ့အခါ validate လုပ်နည်း"
order: 45
source: "https://www.prisma.io/docs/orm/extensions/arktype-json"
status: translated
updated: 2026-11-06
---

သာမန် `Jsonb` column — PostgreSQL `jsonb` column အတွက် Prisma ORM 8 ရဲ့ type — က JSON value မှန်သမျှအနေနဲ့ ဖတ်လို့ရတာမို့ သင့် code က သူ့ထဲမှာ ဘာရှိလဲ ကိုယ်တိုင် စစ်ရပါတယ်။ arktype-json extension ကတော့ JSON column ကို [arktype](https://arktype.io) schema တစ်ခုနဲ့ ဖော်ပြပေးပါတယ်။ ပြီးတော့ column ရဲ့ TypeScript type က schema ကနေ လာပြီး၊ Prisma ORM က ဖတ်တဲ့အခါ value တစ်ခုချင်းစီကို schema နဲ့ စစ်ပေးပါတယ်။

Column က `jsonb` column အဖြစ်ပဲ ရှိနေတာမို့ server ပေါ်မှာ ဘာမှ install လုပ်စရာ မလိုပါဘူး။

ဒီ page က PostgreSQL ပေါ်က Prisma ORM 8 project တစ်ခုကို အခြေခံထားပါတယ် — [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql) ကနေ ရလာတဲ့ project လိုမျိုးမှာ `src/prisma/db.ts` က သင့် code query လုပ်တဲ့ client ကို ဖန်တီးပါတယ်။

## သင့် contract က TypeScript ဖြစ်ရမည် (Your contract must be TypeScript)

Schema က JavaScript value တစ်ခုဖြစ်တာမို့ column ကို TypeScript contract ဖြစ်တဲ့ `src/prisma/contract.ts` ထဲမှာ ကြေညာရပါတယ်။ `contract.prisma` contract ကတော့ အဲဒါကို မထည့်နိုင်ပါဘူး။ Project တစ်ခုမှာ contract တစ်ခုပဲ ရှိတာမို့ သင့်ဟာက `contract.prisma` ဖြစ်နေရင် အရင်ဆုံး TypeScript နဲ့ ပြန်ရေးပါ — [TypeScript schema builder](/docs/prisma/typescript-schema-builder) က PSL construct တစ်ခုချင်းစီရဲ့ TypeScript ပုံစံကို ပြပေးပါတယ်။ ပြီးရင် `prisma.config.ts` ထဲက `contract` ကို `./src/prisma/contract.ts` လို့ သတ်မှတ်ပါ။

## စတင် တပ်ဆင်ခြင်း (Set it up)

Package နဲ့ arktype ကို `@prisma/orm-postgres` ဘေးမှာ install လုပ်ပါ:

#### bun

```bash
bun add @prisma/orm-extension-arktype-json arktype
```

#### pnpm

```bash
pnpm add @prisma/orm-extension-arktype-json arktype
```

#### yarn

```bash
yarn add @prisma/orm-extension-arktype-json arktype
```

#### npm

```bash
npm install @prisma/orm-extension-arktype-json arktype
```

Prisma ORM 8 extension ဆိုတာ `prisma` command-line tool ရော သင့် app ရဲ့ client ပါ load လုပ်တဲ့ package တစ်ခုပါ — `$extends` နဲ့ လုပ်ထားတဲ့ Prisma ORM 7 client extension မျိုး မဟုတ်ပါဘူး။ နေရာသုံးခုမှာ ထည့်ပါ — `prisma.config.ts` ထဲမှာ `/control` ကနေ၊ `src/prisma/db.ts` ထဲမှာ `/runtime` ကနေ၊ ပြီးတော့ contract ထဲမှာ `/pack` ကနေ (ဒါက `defineContract` သုံးတဲ့ အပိုင်းပါ)။ ဖိုင်တစ်ခုချင်းစီရဲ့ ကျန်တဲ့အပိုင်းကို ရှိသလို ထားပါ။ ဖိုင်အပြည့်အစုံက ဒီလိုပါ:

```ts title="prisma.config.ts"
import 'dotenv/config';
import { definePrismaConfig } from 'prisma/config';
import arktypeJsonControl from '@prisma/orm-extension-arktype-json/control';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.ts',
    extensions: [arktypeJsonControl],
    db: { connection: process.env['DATABASE_URL']! },
  }),
});
```

```ts title="src/prisma/db.ts"
import 'dotenv/config';
import arktypeJsonRuntime from '@prisma/orm-extension-arktype-json/runtime';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env['DATABASE_URL']!,
  extensions: [arktypeJsonRuntime],
});
```

## Column ကို ကြေညာခြင်း (Declare the column)

Contract ထဲမှာ pack ကို `defineContract` ဆီ `"arktype-json"` ဆိုတဲ့ key နဲ့ ပေးပါ — hyphen ပါတာမို့ quote ထည့်ထားတာပါ။ တခြား key သုံးရင် client က `RUNTIME.MISSING_EXTENSION_PACK` နဲ့ စတင် မလုပ်နိုင်ဘဲ ရပ်သွားပါလိမ့်မယ်။ ပြီးရင် column ကို `/column-types` ကနေ `arktypeJson(schema)` နဲ့ လုပ်ပါ:

```ts title="src/prisma/contract.ts"
import { defineContract } from '@prisma/orm-postgres/contract-builder';
import arktypeJsonPack from '@prisma/orm-extension-arktype-json/pack';
import { arktypeJson } from '@prisma/orm-extension-arktype-json/column-types';
import { type } from 'arktype';

export const ArticleMeta = type({ tags: 'string[]', 'readingMinutes?': 'number' });

export const contract = defineContract({ extensions: { 'arktype-json': arktypeJsonPack } }, ({ field, model, type: t }) => {
  const Article = model('Article', {
    fields: {
      id: field.column(t.Int()).id(),
      title: field.column(t.String()),
      meta: field.column(arktypeJson(ArticleMeta)).optional(),
    },
  });

  return { models: { Article: Article.sql({ table: 'article' }) } };
});
```

ဒီမှာ builder ရဲ့ ကိုယ်ပိုင် `type` helper ကို `t` လို့ နာမည်ပြောင်းထားပါတယ် — arktype ရဲ့ `type` နဲ့ နာမည်တူနေတာမို့ပါ။ `ArticleMeta` ကို export လုပ်ထားတာက သင့် app ကလည်း value တွေကို သူနဲ့ စစ်နိုင်ရအောင်ပါ။ `.optional()` က column ကို အလွတ်ထားခွင့်ပြုပြီး၊ အလွတ်ဖြစ်ရင် `null` အနေနဲ့ ဖတ်ပါတယ်။

ပြီးရင် generate လုပ်ထားတဲ့ ဖိုင်တွေကို update လုပ်၊ migration ရေးပြီး သင့် development database ပေါ်မှာ apply လုပ်ပါ:

```bash
npx prisma contract emit
npx prisma migration plan --name add-article-meta
npx prisma db migrate --advance-ref db
```

ဒီအပြောင်းအလဲ နှစ်ခုက database ကို ရှိသလို ထားခဲ့ပါတယ် — column က `jsonb` အဖြစ်ပဲ ရှိနေတာမို့ပါ: ရှိပြီးသား `Jsonb` column တစ်ခုကို `arktypeJson(...)` ကို ပြောင်းတာ၊ နဲ့ နောက်မှ arktype type ကို ပြောင်းတာ။ နှစ်ခုထဲက တစ်ခုကို လုပ်ပြီးတိုင်း `npx prisma contract emit` ကို run ပါ — ဒါမှ column ရဲ့ TypeScript type က လိုက်ပါသွားမှာပါ။ ပြီးရင် `migration plan` က `MIGRATION.PLANNING_FAILED` နဲ့ ရပ်ပြီး command တစ်ခု ပြပေးပါလိမ့်မယ်:

1. ပြထားတဲ့ `npx prisma migration new --from <hash>` ကို run ပါ။ ဒါက operation မပါတဲ့ migration တစ်ခုကို ရေးပေးပြီး၊ အဲဒါက contract အသစ်ကို မှတ်တမ်းတင်ပါတယ်။
2. `npx prisma db migrate --advance-ref db` ကို run ပါ။

Column ထဲမှာ ရှိပြီးသား rows တွေကို ဖတ်တဲ့အချိန်အထိ စစ်ဆေးတာ မရှိပါဘူး။

## Column ကို ဖတ်ခြင်းနဲ့ ရေးခြင်း (Read and write the column)

`contract emit` က schema ရဲ့ TypeScript type ကို `contract.d.ts` ထဲ ရေးပေးတာမို့ `meta` က `{ tags: string[]; readingMinutes?: number }` အနေနဲ့ ဖတ်ပြီး၊ သင် ရေးတာကို TypeScript က စစ်ပေးပါတယ်:

```ts
const article = await db.orm.public.Article.create({
  id: 1,
  title: 'Typed JSON',
  meta: { tags: ['json', 'arktype'], readingMinutes: 4 },
});

article.meta?.tags; // string[]
```

Prisma ORM က value တစ်ခုကို ရေးတဲ့အချိန်မှာ မဟုတ်ဘဲ ဖတ်တဲ့အချိန်မှာ schema နဲ့ စစ်ပါတယ်။ SQL နဲ့ပဲဖြစ်ဖြစ် တခြား app တစ်ခုကပဲဖြစ်ဖြစ် ရေးထားတဲ့၊ သိမ်းထားတဲ့ value က schema ကို ချိုးဖောက်နေတဲ့ row တစ်ခုကို ဖတ်တဲ့အခါ `code` က `RUNTIME.JSON_SCHEMA_VALIDATION_FAILED` ဖြစ်တဲ့ error နဲ့ ကျရှုံးပါတယ်။ Message က ပြဿနာကို နာမည်တပ်ပြပါတယ် — ဥပမာ `tags must be an array (was number)`။ Row အများကြီး ပြန်တဲ့ query တစ်ခုမှာ အဲဒီလို row တစ်ခု ပါနေရင် query တစ်ခုလုံး ကျရှုံးပါတယ်။

Writes တွေကို မစစ်တာမို့ `any` ဒါမှမဟုတ် `unknown` လို့ type သတ်မှတ်ထားတဲ့ value တစ်ခု — ဥပမာ parse လုပ်ထားတဲ့ request body — က မစစ်ဆေးဘဲ database ဆီ ရောက်သွားပါတယ်။ ပြီးရင် ဘာဖြစ်မလဲဆိုတာက method ပေါ်မှာ မူတည်ပါတယ်:

* `create()` က row ကို သိမ်းပြီး၊ ပြန်ဖတ်တဲ့အခါ `RUNTIME.JSON_SCHEMA_VALIDATION_FAILED` ကို ပစ်ပါတယ်။ Row ကတော့ database ထဲမှာ ကျန်နေပါတယ်။
* `update()` က အဲဒီ error ကိုပဲ ပစ်ပြီး အပြောင်းအလဲကို မသိမ်းပါဘူး။
* `createAndCount()` နဲ့ `updateAndCount()` က rows တွေကို ပြန်မဖတ်တာမို့ value ကို သိမ်းပြီး ဘာမှ မပစ်ပါဘူး။

အဲဒီလို value ကို မရေးခင် arktype type နဲ့ စစ်ပါ:

```ts
import { type } from 'arktype';
import { ArticleMeta } from './prisma/contract';

const meta = ArticleMeta(input);
if (meta instanceof type.errors) {
  throw new Error(meta.summary);
}
await db.orm.public.Article.create({ id: 2, title: 'From a form', meta });
```

ဖတ်လို့မရတဲ့ row တစ်ခုကို ပြုပြင်ဖို့ သူ့ value ကို ဖုံးရေးလိုက်ပါ — `update()` က value အဟောင်းကို မဖတ်တာမို့ `db.orm.public.Article.where({ id }).update({ meta: { tags: [] } })` က အဲဒီ row ပေါ်မှာ အလုပ်လုပ်ပါတယ်။ အဲဒီလို rows တွေကို SQL နဲ့ ရှာပါ — ဥပမာ `SELECT id FROM article WHERE meta IS NOT NULL AND jsonb_typeof(meta->'tags') IS DISTINCT FROM 'array'` က `tags` key မပါတဲ့ values တွေကိုပါ ရှာပေးပါတယ်။ Table က `article` ဖြစ်တာက contract က `table: 'article'` လို့ သတ်မှတ်ထားလို့ပါ။

## နောက်တစ်ဆင့် (Next steps)

* [Using extensions](/docs/prisma/using-extensions) က pgvector အတွက် setup ကို အဆင့်လိုက် လမ်းညွှန်ပြပါတယ်။
* [arktype ရဲ့ ကိုယ်ပိုင် documentation](https://arktype.io/docs) က schema တစ်ခု ရေးနည်းကို ဖော်ပြထားပါတယ်။

## ဆက်စပ်သော Page များ (Related pages)

- [`ParadeDB`](/docs/prisma/paradedb): ParadeDB extension၊ BM25 index နဲ့ သူ့ရဲ့ match၊ phrase နဲ့ score operations တွေကို သုံးပြီး Prisma ORM 8 app ထဲကို relevance အလိုက် အစီအစဉ်ချထားတဲ့ full-text search ထည့်ပါ။
- [`PostGIS`](/docs/prisma/postgis): Prisma ORM 8 နဲ့ PostgreSQL ထဲမှာ points၊ lines နဲ့ polygons တွေကို သိမ်းပြီး၊ PostGIS extension နဲ့ distance ဒါမှမဟုတ် area အလိုက် rows တွေကို ရှာပါ။
- [`Using extensions`](/docs/prisma/using-extensions): Extensions တွေက vector search၊ geospatial data နဲ့ full-text search လိုမျိုး database features တွေကို Prisma ORM project ထဲ ထည့်ပေးပါတယ်။
