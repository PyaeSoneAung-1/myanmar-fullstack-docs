---
title: "Extensions အသုံးပြုခြင်း (Using Extensions)"
description: "Vector search, geospatial, full-text search လိုမျိုး Prisma 8 မှာ default မပါတဲ့ database capabilities တွေကို extension packages နဲ့ ထည့်နည်း — package install, config နဲ့ client မှာ register, schema မှာ type သုံးပြီး query လုပ်ခြင်း၊ pgvector နမူနာ အပြည့်အစုံ"
order: 35
source: "https://www.prisma.io/docs/orm/extensions/using-extensions"
status: translated
updated: 2026-09-02
---

Extensions တွေက Prisma 8 project တစ်ခုထဲကို vector search, geospatial data, full-text search လိုမျိုး database capabilities တွေ ထည့်ပေးပါတယ်။

Extension ဆိုတာ — Prisma 8 မှာ out of the box မပါတဲ့ database capability တစ်ခုကို ထည့်ပေးတဲ့ package တစ်ခုပါ: column types အသစ်တွေ၊ query operations တွေ၊ index types တွေ — အခြေခံ database feature ကို install လုပ်ပေးတဲ့ migrations တွေနဲ့အတူပါ။ Vector search, geospatial data, full-text search, typed JSON နဲ့ provider-specific integrations တွေ အားလုံးကို extensions တွေကနေ ထည့်ပါတယ်။

ဒီ database features တွေထဲက တစ်ခုခု လိုအပ်ပေမယ့် — typed schema declarations, generated TypeScript, migration support နဲ့ query helpers တွေကို သင့် Prisma 8 project ထဲမှာပဲ ထိန်းထားချင်ရင် extension တစ်ခုကို သုံးပါ။

Extension တစ်ခု ထည့်ဖို့ — package ကို install လုပ်ပြီး နေရာ နှစ်ခုမှာ register လုပ်ရပါတယ်: config နဲ့ client ပါ။ အောက်က steps တွေက vector search extension ဖြစ်တဲ့ pgvector ကို နမူနာ အနေနဲ့ သုံးထားပါတယ်။

## 1. Package ကို Install လုပ်ခြင်း

#### bun

```bash title="Terminal"
bun add @prisma/orm-extension-pgvector
```

#### pnpm

```bash title="Terminal"
pnpm add @prisma/orm-extension-pgvector
```

#### yarn

```bash title="Terminal"
yarn add @prisma/orm-extension-pgvector
```

#### npm

```bash title="Terminal"
npm install @prisma/orm-extension-pgvector
```

## 2. Config ထဲမှာ Register လုပ်ခြင်း

Prisma 8 က သင့် contract ကို emit လုပ်ပြီး migrations တွေ စီစဉ်တဲ့အခါ ဒီ registration ကို သုံးပါတယ်:

```ts title="prisma.config.ts"
import { definePrismaConfig } from 'prisma/config';
import pgvector from '@prisma/orm-extension-pgvector/control';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    extensions: [pgvector],
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
```

## 3. Client ပေါ်မှာ Register လုပ်ခြင်း

Prisma 8 က သင့် app က queries တွေ run တဲ့အခါ ဒီ registration ကို သုံးပါတယ်: extension ရဲ့ query operations တွေနဲ့ value types တွေကို ထည့်ပေးပါတယ်:

```ts title="src/prisma/db.ts"
import pgvector from '@prisma/orm-extension-pgvector/runtime';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  extensions: [pgvector],
});
```

## 4. Schema ထဲမှာ Type အသစ်ကို သုံးခြင်း

Extension ရဲ့ types တွေက ခုဆို သင့် contract ထဲမှာ ရနေပါပြီ။ Dimension အတိအကျ ပါတဲ့ vector column တစ်ခု ကြေညာကြည့်ပါ:

```prisma title="src/prisma/contract.prisma"
types {
  Embedding1536 = pgvector.Vector(1536)
}

model Post {
  id        String         @id @default(uuid())
  title     String
  embedding Embedding1536?
}
```

## 5. Apply လုပ်ပြီး Query လုပ်ခြင်း

`npx prisma@latest db init` ကို run ပါ (existing database ဆိုရင် `db update`)။ Extension က ကိုယ်ပိုင် migration ပါလာလို့ — ဒီ step က သင့်အတွက် `CREATE EXTENSION IF NOT EXISTS vector` ကို run ပေးပါတယ်။ `db init` က contract-space layout violation တစ်ခု အစီရင်ခံရင်တော့ `npx prisma@latest migration plan` ကို တစ်ခါ run လိုက်ပါ: ဒါက extension ရဲ့ baseline migration ကို `migrations/<extension>/` အောက်မှာ ရေးပြီး — `db init` က ဆက်ပြီး ရှေ့ဆက်သွားပါမယ်။ ပြီးရင် extension က ထည့်ပေးတဲ့ operations တွေနဲ့ query လုပ်ပါ:

```ts title="src/prisma/similarity-search.ts"
const plan = db.sql.public.post
  .select('id', 'title')
  .select('distance', (f, fns) => fns.cosineDistance(f.embedding, queryVector))
  .orderBy((f, fns) => fns.cosineDistance(f.embedding, queryVector), { direction: 'asc' })
  .limit(10)
  .build();

const similar = await db.runtime().execute(plan);
```

## အစိတ်အပိုင်းတွေ ဘယ်လို ဆက်စပ်လဲ

Package တစ်ခု၊ registration နှစ်ခု၊ database တစ်ခု:

<ConceptAnimation name="extension-planes" />

## Capabilities

Extension တစ်ခုချင်းစီက `pgvector.cosine` လိုမျိုး key တစ်ခုအောက်မှာ ကိုယ် ထည့်ပေးတာတွေကို နာမည်ပေးပါတယ်။ ဒီ keys တွေကို လက်နဲ့ ဘယ်တော့မှ မရေးပါဘူး။ Config ထဲမှာ extension ကို register လုပ်တာက သူတို့ကို သင့် contract ထဲမှာ မှတ်တမ်းတင်ပေးပြီး — `db.ts` ထဲမှာ register လုပ်တာက runtime မှာ ရနိုင်အောင် လုပ်ပေးပါတယ်။

ဒီ bookkeeping (မှတ်တမ်းစာရင်း) ရဲ့ ရည်ရွယ်ချက်က စောစော fail ဖြစ်ဖို့ပါ:

* သင့် contract က `db.ts` မှာ register မထားတဲ့ extension တစ်ခု လိုအပ်ရင် — client ကို ဖန်တီးတာက ချက်ချင်း fail ဖြစ်ပါတယ်။ Extension က တစ်ဝက်တစ်ပျက် register လုပ်ထားတဲ့အနေနဲ့ query တစ်ခုမှ run လို့ မရပါဘူး။
* Database ကိုယ်တိုင်က extension ကို install မလုပ်နိုင်ရင် — `db init` ဒါမှမဟုတ် `db update` က သင့် app က traffic မစီးခင် အစီရင်ခံပါတယ်။

## ရနိုင်တဲ့ Extensions

မရှိသေးတဲ့ extension တစ်ခုကိုလည်း သင်ကိုယ်တိုင် တည်ဆောက်နိုင်ပါတယ်။ Catalog က လောလောဆယ် first-party တွေပဲ ဖြစ်ပေမယ့် — community authors တွေအတွက် ရည်ရွယ်ပြီး တည်ဆောက်ထားပါတယ်: extension packs တွေက documented layout ပါတဲ့ versioned npm packages တွေပါ။ [Call for extension authors](https://www.prisma.io/blog/prisma-next-call-for-extension-authors) မှာ တစ်ခု ရေးပြီး publish လုပ်နည်းကို ရှင်းပြထားပါတယ်။

| Extension | ဘာတွေ ထည့်ပေးလဲ | Package |
| --- | --- | --- |
| [pgvector](https://github.com/prisma/orm/tree/main/packages/3-extensions/pgvector#readme) | Vector columns နဲ့ similarity search | `@prisma/orm-extension-pgvector` |
| [PostGIS](https://github.com/prisma/orm/tree/main/packages/3-extensions/postgis#readme) | Geometry columns နဲ့ geo queries | `@prisma/orm-extension-postgis` |
| [ParadeDB](https://github.com/prisma/orm/tree/main/packages/3-extensions/paradedb#readme) | BM25 full-text search indexes | `@prisma/orm-extension-paradedb` |
| [Supabase](https://github.com/prisma/orm/tree/main/packages/3-extensions/supabase#readme) | Supabase auth နဲ့ storage tables, role-bound clients | `@prisma/orm-extension-supabase` |
| [arktype-json](https://github.com/prisma/orm/tree/main/packages/3-extensions/arktype-json#readme) | arktype schema တစ်ခုနဲ့ validate လုပ်ထားတဲ့ JSON columns | `@prisma/orm-extension-arktype-json` |

အားလုံးက PostgreSQL ကို target လုပ်ပါတယ်။ ParadeDB နဲ့ Supabase က experimental ပါ (ParadeDB က လောလောဆယ် `key_field` index option ကိုပဲ ထောက်ပံ့ပါသေးတယ်)။ ကျန်တာတွေကတော့ Prisma 8 နဲ့အတူ ပါလာပါတယ်။ Extension နာမည်တွေက package တစ်ခုချင်းစီရဲ့ GitHub ပေါ်က README ဆီ ချိတ်ပေးထားပါတယ်။

Extension တစ်ခုချင်းစီအတွက် အလုပ်လုပ်တဲ့ project နမူနာတွေ ကြည့်ချင်ရင်: [pgvector](https://github.com/prisma/orm/tree/main/examples/prisma-8-demo), [PostGIS](https://github.com/prisma/orm/tree/main/examples/prisma-8-postgis-demo), [ParadeDB](https://github.com/prisma/orm/tree/main/examples/paradedb-demo) နဲ့ [Supabase](https://github.com/prisma/orm/tree/main/examples/supabase) တို့ပါ။

## ဆက်စပ်ဖတ်ရန်

- [Advanced queries](/docs/prisma/advanced-queries) — `cosineDistance` လိုမျိုး extension operations တွေ ပေါ်လာတဲ့ SQL query builder
- [How middleware works](/docs/prisma/how-middleware-works) — database capabilities တွေ ထည့်တာထက် queries တွေကို wrapping လုပ်ချင်ရင်
- [Quickstart with PostgreSQL](https://www.prisma.io/docs/prisma-orm/quickstart/postgresql) — extensions တွေ ထည့်ဖို့ project တစ်ခု တည်ဆောက်ရန်
- [Prisma 8 overview](https://www.prisma.io/docs/orm) — extensions တွေ ချိတ်ဝင်တဲ့ contract-first model အကြောင်း
