---
title: "PostGIS — Geometry Column Extension"
description: "Prisma ORM 8 နဲ့ points, lines, polygons တွေကို PostgreSQL မှာ သိမ်းပြီး PostGIS extension နဲ့ အကွာအဝေး ဒါမှမဟုတ် ဧရိယာအလိုက် rows ရှာနည်း"
order: 47
source: "https://www.prisma.io/docs/orm/extensions/postgis"
status: translated
updated: 2026-11-06
---

PostGIS extension က Prisma ORM 8 ထဲကို geometry column တစ်ခု ထည့်ပေးပါတယ် — [PostGIS](https://postgis.net) က PostgreSQL မှာ သိမ်းပေးတဲ့ point, line ဒါမှမဟုတ် polygon တစ်ခုပါ။ Value တွေကို GeoJSON ပုံစံ object တွေအနေနဲ့ ရေးပြီး ဖတ်ရပြီး — "ဒီ point ကနေ 5 km အတွင်း" ဒါမှမဟုတ် "ဒီဧရိယာအတွင်း" လိုမျိုး conditions တွေနဲ့ query လုပ်ပါတယ်။

ဒီ page က PostgreSQL ပေါ်က Prisma ORM 8 project တစ်ခုကို အခြေခံထားပါတယ် — ဥပမာ [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql) ကနေ ဖန်တီးထားတဲ့ project မျိုးပါ။ အဲဒီမှာ `src/prisma/contract.prisma` က သင့် contract ဖြစ်ပြီး — schema file အတွက် Prisma ORM 8 က ပေးထားတဲ့ နာမည်ပါ။ `src/prisma/db.ts` ကတော့ သင့် code က query လုပ်တဲ့ client ကို ဖန်တီးပေးပါတယ်။

PostGIS ကို သင့် PostgreSQL server ပေါ်မှာ install လုပ်လို့ ရရပါမယ်။ Managed provider အများစုက ဒါကို ပါဝင်ပေးထားပါတယ်။ သင့်စက်ပေါ်မှာ run ချင်ရင် `postgis/postgis` Docker image ကို သုံးပါ — [A database on your machine](/docs/prisma/local-database) မှာ Compose file ကို ပြထားပြီး — သူ့ရဲ့ `image:` ကို `postgis/postgis:17-3.5` လို့ ပြောင်းလိုက်ရုံပါ။

## Setup လုပ်ခြင်း (Set it up)

`@prisma/orm-postgres` ရဲ့ ဘေးမှာ package ကို install လုပ်ပါ:

  

#### bun

```bash
bun add @prisma/orm-extension-postgis
```

#### pnpm

```bash
pnpm add @prisma/orm-extension-postgis
```

#### yarn

```bash
yarn add @prisma/orm-extension-postgis
```

#### npm

```bash
npm install @prisma/orm-extension-postgis
```

Prisma ORM 8 extension ဆိုတာ `prisma` command-line tool ရော သင့် app ရဲ့ client ပါ load လုပ်တဲ့ package တစ်ခုပါ — `$extends` နဲ့ လုပ်ထားတဲ့ Prisma ORM 7 client extension မဟုတ်ပါဘူး။ File နှစ်ခုမှာ ထည့်ပါ: `prisma.config.ts` မှာ `/control` ကနေ import လုပ်ပြီး `extensions` ထဲ ထည့်ပါ၊ `src/prisma/db.ts` မှာ `/runtime` ကနေ import လုပ်ပြီး `extensions` ထဲ ထည့်ပါ။ File တစ်ခုချင်းစီရဲ့ ကျန်တဲ့အပိုင်းကို ရှိသလို ထားခဲ့ပါ။ File အပြည့်အစုံက ဒီလိုပါ:

```ts title="prisma.config.ts"
import 'dotenv/config';
import { definePrismaConfig } from 'prisma/config';
import postgis from '@prisma/orm-extension-postgis/control';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    extensions: [postgis],
    db: { connection: process.env['DATABASE_URL']! },
  }),
});
```

```ts title="src/prisma/db.ts"
import 'dotenv/config';
import postgis from '@prisma/orm-extension-postgis/runtime';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env['DATABASE_URL']!,
  extensions: [postgis],
});
```

## Geometry column ကို ကြေညာခြင်း (Declare a geometry column)

Geometry column တစ်ခုက shape တွေကို coordinate system တစ်ခုထဲမှာ သိမ်းပြီး — အဲဒီ system ကို SRID လို့ ခေါ်တဲ့ နံပါတ်တစ်ခုနဲ့ နာမည်ပေးပါတယ်။ SRID 4326 ဆိုတာ ဒီဂရီနဲ့ ပြတဲ့ longitude နဲ့ latitude ဖြစ်ပြီး — GPS နဲ့ map အများစု သုံးတဲ့ system ပါ။ `postgis.Geometry(4326)` က အဲဒီ system ထဲက column တစ်ခုပါ။ `types` block တစ်ခုထဲမှာ နာမည်တစ်ခါ ပေးပြီး — field တစ်ခုချင်းစီမှာ အဲဒီနာမည်ကို သုံးပါ:

```prisma title="src/prisma/contract.prisma"
// use prisma-8

types {
  Location = postgis.Geometry(4326)
}

model Place {
  id       Int      @id @default(autoincrement())
  name     String
  location Location

  @@index([location], type: "gist", name: "place_location")
}
```

Column က ဘယ် shape မဆို ထည့်လို့ရပါတယ် — point, line ဒါမှမဟုတ် polygon ပါ။ `gist` index ဆိုတာ PostGIS က shape တွေကို ရှာတဲ့ index အမျိုးအစားပါ — မရှိရင် PostgreSQL က row တိုင်းကို စစ်ပါတယ်။ TypeScript contract မှာဆိုရင် column က `field.column(type.postgis.Geometry(4326))` ဖြစ်ပြီး — contract က extension ရဲ့ `/pack` ကို `{ extensions: { postgis } }` အနေနဲ့ `defineContract` ကို ပေးရပါတယ်။ ဒါကို pgvector အတွက် [TypeScript schema builder](/docs/prisma/typescript-schema-builder) မှာ ပြထားပါတယ်။

ပြီးရင် generated files တွေကို update လုပ်ပြီး migration ရေးကာ သင့် development database ပေါ် apply လုပ်ပါ:

```bash
npx prisma contract emit
npx prisma migration plan --name add-places
npx prisma db migrate --advance-ref db
```

`migration plan` က သင့် migration ကို `migrations/app/` အောက်မှာ ရေးပေးပါတယ်။ `contract emit` ကတော့ extension ရဲ့ files တွေကို `migrations/postgis/` အောက်မှာ ရေးပြီးသား ဖြစ်ပြီး — အဲဒီ migration က PostGIS ကို database ထဲ install လုပ်ပေးပါတယ်။ နှစ်ခုလုံးကို commit လုပ်ပါ။ `--advance-ref db` အကြောင်းကို [Generating a migration](/docs/prisma/generating-a-migration) မှာ ရှင်းပြထားပါတယ်။

## Shape တွေ ရေးခြင်းနဲ့ ဖတ်ခြင်း (Write and read shapes)

Geometry value တစ်ခုဆိုတာ GeoJSON ပုံစံ object တစ်ခုပါ။ Package ရဲ့ `/geojson` entry point မှာ ဒါကို ဆောက်ပေးတဲ့ functions တွေ ရှိပါတယ်: `point(longitude, latitude)`, `polygon(ring)` နဲ့ `bboxPolygon([minLongitude, minLatitude, maxLongitude, maxLatitude])` တို့ပါ။ GeoJSON လိုပဲ longitude က အရင်လာပါတယ်။

```ts
import { point } from '@prisma/orm-extension-postgis/geojson';

const gate = await db.orm.public.Place.create({
  name: 'Brandenburg Gate',
  location: point(13.3777, 52.5163),
});

gate.location; // { type: 'Point', coordinates: [13.3777, 52.5163], srid: 4326 }
```

Function တိုင်းက SRID ကို နောက်ဆုံး argument အနေနဲ့ ယူပါတယ်။ SRID မပါဘဲ shape တစ်ခု ရေးလိုက်ရင် — column ရဲ့ SRID ကို ယူပါတယ်၊ ဖတ်တဲ့အခါလည်း comment မှာ ပြထားတဲ့ ပုံစံအတိုင်း ပြန်ရပါတယ်။ မတူညီတဲ့ SRID နဲ့ shape တစ်ခု ရေးလိုက်ရင်တော့ PostgreSQL က `Geometry SRID (3857) does not match column SRID (4326)` ဆိုပြီး ပယ်ချပါတယ်။

Query တစ်ခုထဲမှာ SRID ကို အမြဲ ပေးပါ: column နဲ့ နှိုင်းယှဉ်မယ့် shape တစ်ခုမှာ ကိုယ်တိုင် မပေးထားရင် SRID မပါပါဘူး၊ အဲဒီအခါ `distanceSphere` နဲ့ `intersectsBbox` ကလွဲပြီး အောက်က operation တိုင်းက `Operation on mixed SRID geometries` ဆိုပြီး fail ဖြစ်ပါတယ်။

## အကွာအဝေး ဒါမှမဟုတ် ဧရိယာအလိုက် rows ရှာခြင်း (Find rows by distance or area)

Geometry field တိုင်းမှာ ဒီ operations တွေ ရှိပြီး — `where()` ထဲမှာ သုံးပါတယ်:

| Operation                           | မှန်တယ်လို့ ပြန်တာ ဒါမှမဟုတ် ပြန်ပေးတာ                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `location.distanceSphere(other)`    | ကမ္ဘာ့မျက်နှာပြင်ပေါ်မှာ တိုင်းထားတဲ့ အကွာအဝေး (meter)                                                    |
| `location.distance(other)`          | column ရဲ့ unit အတိုင်း အကွာအဝေး — 4326 အတွက်ဆိုရင် ဒီဂရီ                                                  |
| `location.dwithin(other, distance)` | နှစ်ခုက `distance` အတွင်းမှာ ရှိရင် မှန်တယ် — column ရဲ့ unit အတိုင်း                                      |
| `location.within(area)`             | shape က `area` အတွင်းမှာ ရှိရင် မှန်တယ်                                                                    |
| `location.contains(other)`          | shape က `other` ကို ထည့်ထားရင် မှန်တယ်                                                                     |
| `location.intersects(other)`        | shape နှစ်ခု ထိနေတာ ဒါမှမဟုတ် ထပ်နေတာ မှန်တယ်                                                            |
| `location.intersectsBbox(other)`    | shape နှစ်ခုကို လွှမ်းထားတဲ့ rectangle နှစ်ခု ထပ်နေရင် မှန်တယ် — `intersects` ထက် ပိုမြန်ပြီး ပိုကြမ်းတဲ့ စစ်ဆေးမှုပါ |

4326 column ပေါ်မှာ "5 km အတွင်း" ရှာချင်ရင် — `distanceSphere` ကို meter နဲ့ နှိုင်းယှဉ်ပြီး `lt`, `lte`, `gt` ဒါမှမဟုတ် `gte` ကို သုံးပါ။ `distanceSphere` က `gist` index ကို မသုံးနိုင်တာမို့ — PostgreSQL က row တိုင်းကို စစ်ပါတယ်။ ဒါကြောင့် ဒီဂရီနဲ့ ပြတဲ့ radius ပါတဲ့ `dwithin` ကို အရှေ့မှာ ထည့်ပါ — အဲဒါက index သုံးပြီး row တွေကို အရင် ကျဉ်းအောင် လုပ်ပေးပါတယ်။ တစ်ဒသမ တစ်ဒီဂရီဆိုတာ တောင်လတ္တီတွဒ် 60 ဒီဂရီနဲ့ မြောက်လတ္တီတွဒ် 60 ဒီဂရီကြားမှာ ဘယ်လမ်းကြောင်းကနေမဆို 5 km ထက် ပိုပါတယ်:

```ts
import { and } from '@prisma/orm-postgres/orm-client';

const here = point(13.3777, 52.5163, 4326);

const nearby = await db.orm.public.Place.where((p) =>
  and(p.location.dwithin(here, 0.1), p.location.distanceSphere(here).lt(5000)),
).all();
```

`dwithin` က longitude တွေကို 180 ဒီဂရီမှာ လှည့်ပတ်ခြင်း မလုပ်ဘဲ နုတ်တာမို့ — longitude က 180 ကနေ -180 ကို ခုန်တဲ့ မျဉ်းရဲ့ တစ်ဖက်ကမ်းက နေရာတစ်ခုကို ဒီ query က လွတ်သွားပါတယ်: အီကွေတာမှာ `179.99` နဲ့ `-179.99` က 2 km ကွာပေမယ့် `dwithin` အတွက်တော့ 359.98 ဒီဂရီ ကွာပါတယ်။ 60 ဒီဂရီထက် ဝင်တဲ့ ဝင်ရိုးစွန်းတွေဆီမှာ 5 km အရှေ့ ဒါမှမဟုတ် အနောက်က တစ်ဒသမ တစ်ဒီဂရီထက် ပိုတာမို့ — အဲဒီနေရာတွေမှာ ပိုကြီးတဲ့ radius ကို သုံးပါ။

ဧရိယာတစ်ခုအတွင်းက နေရာတွေကို ရှာချင်ရင် polygon တစ်ခု ပေးပါ။ Ring ဆိုတာ `[longitude, latitude]` ထောင့်တွေရဲ့ စာရင်းပါ — `polygon()` က သူ့ကို ပိတ်ပေးပါတယ်:

```ts
import { polygon } from '@prisma/orm-extension-postgis/geojson';

const centralBerlin = polygon([[13.3, 52.4], [13.5, 52.4], [13.5, 52.6], [13.3, 52.6]], 4326);

const inside = await db.orm.public.Place.where((p) => p.location.within(centralBerlin)).all();
```

Row တစ်ခုချင်းစီနဲ့အတူ အကွာအဝေးကို ပြန်ပေးပြီး အဲဒါနဲ့ စီချင်ရင် query ကို [SQL query builder](https://www.prisma.io/docs/orm/fundamentals/advanced-queries) နဲ့ ရေးပါ။ အဲဒီမှာ table ကို database ထဲက သူ့နာမည်နဲ့ ခေါ်ရပါတယ် — model က `@@map` မသတ်မှတ်ထားရင် အဲဒါက model ရဲ့ နာမည်ပါ။ `f` က table ရဲ့ columns တွေကို ကိုင်ထားပြီး `fns` က အလားတူ operations တွေကို ကိုင်ထားပါတယ်၊ အဲဒါတွေက column ကို ပထမဆုံး argument အနေနဲ့ ယူပါတယ်:

```ts
const plan = db.sql.public.Place.select('name')
  .select('meters', (f, fns) => fns.distanceSphere(f.location, here))
  .orderBy((f, fns) => fns.distanceSphere(f.location, here), { direction: 'asc' })
  .limit(10)
  .build();

const closest = await db.query(plan).toArray();
// [{ name: 'Brandenburg Gate', meters: 0 }, { name: 'Alexanderplatz', meters: 2481.397 }, ...]
```

## နောက်တစ်ဆင့် (Next steps)

* [Using extensions](/docs/prisma/using-extensions) — pgvector အတွက် အလားတူ setup ကို အဆင့်ဆင့် လမ်းညွှန်ထားပါတယ်။
* [PostGIS's own documentation](https://postgis.net/documentation/) — coordinate systems တွေနဲ့ ဘယ် query တွေက index သုံးသလဲ ဖော်ပြထားပါတယ်။

## ဆက်စပ် page များ (Related pages)

- [`arktype-json`](/docs/prisma/arktype-json): arktype schema နဲ့ Prisma ORM 8 အတွက် arktype-json extension ကို သုံးပြီး — JSON column တစ်ခုကို TypeScript type ပေးကာ ဖတ်တဲ့အခါ စစ်ဆေးခြင်း။
- [`ParadeDB`](/docs/prisma/paradedb): ParadeDB extension၊ BM25 index နဲ့ match, phrase, score operations တွေကို သုံးပြီး Prisma ORM 8 app မှာ relevance အလိုက် အစီအစဉ်ချထားတဲ့ full-text search ထည့်ခြင်း။
- [`Using extensions`](/docs/prisma/using-extensions): Extensions တွေက vector search, geospatial data နဲ့ full-text search လိုမျိုး database features တွေကို Prisma ORM project တစ်ခုထဲ ထည့်ပေးပါတယ်။
