---
title: "ParadeDB — Full-text Search အတွက် Extension"
description: "ParadeDB extension၊ BM25 index နဲ့ match, phrase, score operations တွေကို သုံးပြီး Prisma ORM 8 app မှာ relevance အလိုက် အစီအစဉ်ချထားတဲ့ full-text search ထည့်နည်း"
order: 46
source: "https://www.prisma.io/docs/orm/extensions/paradedb"
status: translated
updated: 2026-11-06
---

ParadeDB extension၊ BM25 index နဲ့ သူ့ရဲ့ match, phrase နဲ့ score operations တွေကို သုံးပြီး Prisma ORM 8 app တစ်ခုမှာ relevance အလိုက် အစီအစဉ်ချထားတဲ့ full-text search ကို ထည့်နိုင်ပါတယ်။

ParadeDB extension က Prisma ORM 8 ထဲကို full-text search ထည့်ပေးပြီး — ရလဒ်တွေကို ဘယ်လောက် ကိုက်ညီသလဲဆိုတဲ့ အဆင့်အတိုင်း စီပေးပါတယ်။ ဒါက [ParadeDB](https://paradedb.com) ရဲ့ PostgreSQL extension ဖြစ်တဲ့ `pg_search` ကို သုံးပါတယ်။ `pg_search` က BM25 index တစ်ခု ထည့်ပေးပြီး — search engine အများစုလိုပဲ ရလဒ်တွေကို အဆင့်သတ်မှတ်ပေးပါတယ်။ Search လုပ်မယ့် text columns တွေပေါ်မှာ index တစ်ခု ကြေညာပြီး — search query တစ်ခုနဲ့ rows တွေကို filter လုပ်ကာ အဆင့်သတ်မှတ်ပါတယ်။

`@prisma/orm-extension-paradedb` က experimental ပါ — သူပေးတဲ့ အရာတွေက နောက် Prisma ORM release တစ်ခုမှာ ပြောင်းလဲနိုင်တာမို့ upgrade မလုပ်ခင် သူ့ရဲ့ release notes ကို စစ်ပါ။

ဒီ page က PostgreSQL ပေါ်က Prisma ORM 8 project တစ်ခုကို အခြေခံထားပါတယ် — ဥပမာ [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql) ကနေ ဖန်တီးထားတဲ့ project မျိုးပါ။ အဲဒီမှာ `src/prisma/db.ts` က သင့် code က query လုပ်တဲ့ client ကို ဖန်တီးပေးပါတယ်။

`pg_search` ကို သင့် PostgreSQL server ပေါ်မှာ install လုပ်ထားရပါမယ်။ သင့် provider က ဒါကို ပေးသလား စစ်ပါ — [ParadeDB's documentation](https://docs.paradedb.com) မှာ ဘယ်နေရာတွေမှာ run လို့ရလဲ ဖော်ပြထားပါတယ်။ သင့်စက်ပေါ်မှာ run ချင်ရင် `paradedb/paradedb` Docker image ကို သုံးပါ — [A database on your machine](/docs/prisma/local-database) မှာ Compose file ကို ပြထားပြီး — သူ့ရဲ့ `image:` ကို `paradedb/paradedb` လို့ ပြောင်းလိုက်ရုံပါ။

## Contract က TypeScript ဖြစ်ရမယ် (Your contract must be TypeScript)

Search index ကို TypeScript contract ဖြစ်တဲ့ `src/prisma/contract.ts` မှာပဲ ကြေညာလို့ ရပါတယ်။ `contract.prisma` contract မှာတော့ ဒါကို ခုထိ ကြေညာလို့ မရသေးပါဘူး။ Project တစ်ခုမှာ contract တစ်ခုပဲ ရှိတာမို့ — သင့်ဟာက `contract.prisma` ဖြစ်နေရင် TypeScript နဲ့ ပြန်ရေးပြီး `contract.prisma` ကို ဖျက်ပါ — [TypeScript schema builder](/docs/prisma/typescript-schema-builder) မှာ `contract.prisma` ထဲ ရေးလို့ရတဲ့ အရာအားလုံးရဲ့ TypeScript ပုံစံကို ပြထားပါတယ်။ ပြီးရင် `prisma.config.ts` ထဲက `contract` ကို `./src/prisma/contract.ts` လို့ ပြောင်းပါ။ ပြန်ရေးထားတာက table တွေ အတူတူပဲ ဖော်ပြနေရင် — `migration plan` က ပြောင်းစရာ ဘာမှ ရှာတွေ့မှာ မဟုတ်ပါဘူး။

## Setup လုပ်ခြင်း (Set it up)

`@prisma/orm-postgres` ရဲ့ ဘေးမှာ package ကို install လုပ်ပါ:

  

#### bun

```bash
bun add @prisma/orm-extension-paradedb
```

#### pnpm

```bash
pnpm add @prisma/orm-extension-paradedb
```

#### yarn

```bash
yarn add @prisma/orm-extension-paradedb
```

#### npm

```bash
npm install @prisma/orm-extension-paradedb
```

Prisma ORM 8 extension ဆိုတာ `prisma` command-line tool ရော သင့် app ရဲ့ client ပါ load လုပ်တဲ့ package တစ်ခုပါ — `$extends` နဲ့ လုပ်ထားတဲ့ Prisma ORM 7 client extension မဟုတ်ပါဘူး။ နေရာ သုံးခုမှာ ထည့်ပါ: `prisma.config.ts` မှာ `/control` ကနေ၊ `src/prisma/db.ts` မှာ `/runtime` ကနေ၊ ပြီးတော့ contract မှာ `/pack` ကနေ — `defineContract` က သုံးတဲ့ အပိုင်းပါ။ File တစ်ခုချင်းစီရဲ့ ကျန်တဲ့အပိုင်းကို ရှိသလို ထားခဲ့ပါ။ File အပြည့်အစုံက ဒီလိုပါ:

```ts title="prisma.config.ts"
import 'dotenv/config';
import { definePrismaConfig } from 'prisma/config';
import paradedb from '@prisma/orm-extension-paradedb/control';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.ts',
    extensions: [paradedb],
    db: { connection: process.env['DATABASE_URL']! },
  }),
});
```

```ts title="src/prisma/db.ts"
import 'dotenv/config';
import paradedb from '@prisma/orm-extension-paradedb/runtime';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env['DATABASE_URL']!,
  extensions: [paradedb],
});
```

## Search index ကို ကြေညာခြင်း (Declare the search index)

Contract ထဲမှာ pack ကို `paradedb` ဆိုတဲ့ key နဲ့ `defineContract` ကို ပေးပြီး — `constraints.index` နဲ့ index ကို ထည့်ပါ:

```ts title="src/prisma/contract.ts"
import { defineContract } from '@prisma/orm-postgres/contract-builder';
import paradedb from '@prisma/orm-extension-paradedb/pack';

export const contract = defineContract({ extensions: { paradedb } }, ({ field, model, type }) => {
  const Article = model('Article', {
    fields: {
      id: field.column(type.Int()).id(),
      title: field.column(type.String()),
      body: field.column(type.String()),
    },
  });

  return {
    models: {
      Article: Article.sql(({ cols, constraints }) => ({
        indexes: [
          constraints.index([cols.id, cols.title, cols.body], {
            type: 'bm25',
            options: { key_field: 'id' },
            name: 'article_search',
          }),
        ],
      })),
    },
  };
});
```

Key column နဲ့ search လုပ်ချင်တဲ့ column တိုင်းကို စာရင်းထည့်ပါ။ `key_field` က row တစ်ခုချင်းစီကို ခွဲခြားပေးတဲ့ column ကို နာမည်ပေးတာပါ — များသောအားဖြင့် primary key ပါ။ Package က ဒါကို လိုအပ်ပါတယ် — ဒါပေမယ့် `pg_search` 0.26 နဲ့ အထက်က ဒါကို လျစ်လျူရှုပါတယ်။ Table နာမည်က `contract.prisma` ကနေ ဖြစ်လာသလိုပဲ — model နာမည် `Article` အတိုင်း ဖြစ်ပါတယ်။

ပြီးရင် generated files တွေကို update လုပ်ပြီး migration ရေးကာ သင့် development database ပေါ် apply လုပ်ပါ:

```bash
npx prisma contract emit
npx prisma migration plan --name add-search
npx prisma db migrate --advance-ref db
```

`migration plan` က သင့် migration ကို `migrations/app/` အောက်မှာ ရေးပေးပါတယ်။ `contract emit` ကတော့ extension ရဲ့ files တွေကို `migrations/paradedb/` အောက်မှာ ရေးပြီးသား ဖြစ်ပြီး — အဲဒီ migration က `pg_search` ကို database ထဲ install လုပ်ပေးပါတယ်။ နှစ်ခုလုံးကို commit လုပ်ပါ။ `--advance-ref db` အကြောင်းကို [Generating a migration](/docs/prisma/generating-a-migration) မှာ ရှင်းပြထားပါတယ်။

## Search လုပ်ခြင်း (Search)

Index ထဲက text column တိုင်းမှာ search operations တွေ ရှိပြီး — `where()` ထဲမှာ သုံးပါတယ်။ Search တစ်ခုက column ရဲ့ text နဲ့ သင့် query ကို word တွေအဖြစ် ခွဲပြီး — အကြီးအသေး မခွဲခြားဘဲ နှိုင်းယှဉ်ပါတယ်:

| Operation                                                     | ကိုက်ညီသွားတဲ့ row ရဲ့ field                                                |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `body.paradeDbMatch(query)` or `body.paradeDbMatchAny(query)` | `query` ရဲ့ word တစ်ခုခု ပါဝင်တယ်                                            |
| `body.paradeDbMatchAll(query)`                                | `query` ရဲ့ word အားလုံး ပါဝင်တယ်                                            |
| `body.paradeDbPhrase(query)`                                  | `query` ရဲ့ word တွေ အစီအစဉ်အတိုင်း ကပ်လျက် ပါဝင်တယ်                        |
| `body.paradeDbTerm(word)`                                     | `word` ဆိုတဲ့ word တစ်ခုတည်း ပါဝင်တယ်၊ ရေးထားတဲ့အတိုင်း တိုက်စစ်တာမို့ lowercase နဲ့ ပေးပါ |

```ts
const articles = await db.orm.public.Article.where((a) => a.body.paradeDbMatch('migration graph')).all();
```

Title နဲ့ body ကို query တစ်ခုတည်းနဲ့ ရှာချင်ရင် match နှစ်ခုကို `or` နဲ့ ပေါင်းပါ:

```ts
import { or } from '@prisma/orm-postgres/orm-client';

const query = 'migration graph';
const articles = await db.orm.public.Article.where((a) =>
  or(a.title.paradeDbMatch(query), a.body.paradeDbMatch(query)),
).all();
```

ရလဒ်တွေကို အဆင့်သတ်မှတ်ချင်ရင် query ကို [SQL query builder](https://www.prisma.io/docs/orm/fundamentals/advanced-queries) နဲ့ ရေးပါ။ အဲဒီမှာ `f` က table ရဲ့ columns တွေကို ကိုင်ထားပြီး — `fns` က အလားတူ operations တွေကို ကိုင်ထားပါတယ်၊ အဲဒါတွေက column ကို ပထမဆုံး argument အနေနဲ့ ယူပါတယ်။ `paradeDbScore` က key column ကို ယူပြီး row တစ်ခုချင်းစီရဲ့ relevance ကို ပြန်ပေးပါတယ် — ပိုကိုက်ညီရင် ပိုမြင့်ပါတယ်။ ဒါက တူညီတဲ့ query ထဲမှာ ParadeDB filter တစ်ခု လိုအပ်ပြီး — ဒီဥပမာမှာတော့ အဲဒါ ပါပါတယ်။ မပါရင် PostgreSQL က query ကို `pdb.score must be evaluated by a ParadeDB scan` ဆိုပြီး ပယ်ချပါတယ်:

```ts
const plan = db.sql.public.Article.select('id', 'title')
  .select('score', (f, fns) => fns.paradeDbScore(f.id))
  .where((f, fns) => fns.paradeDbMatch(f.body, 'migration graph'))
  .orderBy((f, fns) => fns.paradeDbScore(f.id), { direction: 'desc' })
  .build();

const ranked = await db.query(plan).toArray();
// [{ id: 3, title: 'Migrations explained', score: 1.478 }, { id: 1, title: 'Prisma ORM 8 is here', score: 0.43 }]
```

## နောက်တစ်ဆင့် (Next steps)

* [Using extensions](/docs/prisma/using-extensions) — pgvector အတွက် setup ကို အဆင့်ဆင့် လမ်းညွှန်ထားပါတယ်။
* [ParadeDB's own documentation](https://docs.paradedb.com) — text ကို word တွေအဖြစ် ဘယ်လို ခွဲသလဲ၊ သူ့ရဲ့ query syntax က ဘယ်လိုလဲ ဖော်ပြထားပါတယ်။

## ဆက်စပ် page များ (Related pages)

- [`arktype-json`](/docs/prisma/arktype-json): arktype schema နဲ့ Prisma ORM 8 အတွက် arktype-json extension ကို သုံးပြီး — JSON column တစ်ခုကို TypeScript type ပေးကာ ဖတ်တဲ့အခါ စစ်ဆေးခြင်း။
- [`PostGIS`](/docs/prisma/postgis): Prisma ORM 8 နဲ့ points, lines နဲ့ polygons တွေကို PostgreSQL မှာ သိမ်းပြီး — PostGIS extension နဲ့ အကွာအဝေး ဒါမှမဟုတ် ဧရိယာအလိုက် rows ရှာခြင်း။
- [`Using extensions`](/docs/prisma/using-extensions): Extensions တွေက vector search, geospatial data နဲ့ full-text search လိုမျိုး database features တွေကို Prisma ORM project တစ်ခုထဲ ထည့်ပေးပါတယ်။
