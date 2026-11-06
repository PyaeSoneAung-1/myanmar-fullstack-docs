---
title: "ထောက်ပံ့ထားတဲ့ Version များ (Supported versions)"
description: "Prisma ORM 8 လိုအပ်တဲ့ Node.js, Bun, Deno, PostgreSQL, MongoDB နဲ့ TypeScript version တွေနဲ့ သူမျှော်လင့်တဲ့ tsconfig setting တွေ"
order: 38
source: "https://www.prisma.io/docs/orm/supported-versions"
status: translated
updated: 2026-11-06
---

Prisma ORM 8 လိုအပ်တဲ့ Node.js၊ Bun၊ Deno၊ PostgreSQL၊ MongoDB နဲ့ TypeScript version တွေ၊ ပြီးတော့ သူမျှော်လင့်ထားတဲ့ tsconfig setting တွေကို ဒီ page မှာ ဖော်ပြထားပါတယ်။

Prisma ORM 8 က [release candidate](/docs/prisma/release-status) ဖြစ်ပါတယ်။ ဒီ page မှာ runtime၊ database နဲ့ tool တစ်ခုချင်းစီအတွက် အနိမ့်ဆုံး version တွေကို စာရင်းပြုထားပါတယ်။ အဲဒီထက် ဟောင်းတဲ့ version တွေကို ထောက်ပံ့မထားပါဘူး။

## Runtime များ (Runtimes)

| Runtime | အနိမ့်ဆုံး |
| --- | --- |
| Node.js | 22 line ပေါ်မှာ 22.18 သို့မဟုတ် အထက်၊ 24 line ပေါ်မှာ 24.11 သို့မဟုတ် အထက်၊ ဒါမှမဟုတ် 26 သို့မဟုတ် အထက်။ Node.js 23 နဲ့ 25 ကို မထောက်ပံ့ပါ။ 24 ကို အကြံပြုပါတယ်။ |
| Bun | 1.3 သို့မဟုတ် အထက်။ [Bun](https://www.prisma.io/docs/guides/runtimes/bun) ကို ကြည့်ပါ။ |
| Deno | 2.6 သို့မဟုတ် အထက်။ Deno support က experimental ပါ။ [Deno](https://www.prisma.io/docs/guides/runtimes/deno) ကို ကြည့်ပါ။ |

Node.js က အဓိက runtime ဖြစ်ပြီး test အများဆုံး ခံရပါတယ်။ Bun နဲ့ Deno လည်း အလုပ်လုပ်ပါတယ်၊ Deno support ကတော့ experimental ပါ။ Package manager ဘာပဲဖြစ်ဖြစ် ရပါတယ် — ဒီ Node.js release တွေနဲ့ ပါလာတဲ့ npm၊ pnpm၊ Bun ဒါမှမဟုတ် Yarn 4.10 သို့မဟုတ် အထက်။

PostgreSQL ပေါ်မှာ Prisma ORM 8 က `DateTime` field ကို JavaScript `Date` အနေနဲ့ ဖတ်ပြီး ရေးပါတယ် (MongoDB ပေါ်မှာလိုပါပဲ) — polyfill မလိုပါဘူး။ ဒါပေမယ့် `Temporal` value ကို ဖတ်ဖို့ type သတ်မှတ်ထားတဲ့ field တစ်ခု — ဥပမာ `DateTime(as: temporal)` ဒါမှမဟုတ် `TimestamptzTemporal` — ကတော့ global `Temporal` ကို လိုပါတယ်။ `Temporal` က Node.js 26၊ Bun 1.4 နဲ့ Deno 2.7 နှင့်အထက်တို့မှာ ပါပြီးသား ဖြစ်ပြီး — Node.js 22 နဲ့ 24၊ Bun 1.3 နဲ့ Deno 2.6 တို့မှာတော့ မပါပါဘူး။ သင့် app ကို run ပေးတဲ့ runtime မှာ စစ်ကြည့်ပါ — ဘာလို့လဲဆိုတော့ Homebrew ရဲ့ Node.js 26 build က အဲဒါကို ချန်ထားပါတယ်: `node -p "typeof Temporal"`၊ `bun -p "typeof Temporal"` ဒါမှမဟုတ် `deno eval "console.log(typeof Temporal)"`။ `undefined` ဆိုပြီး ထွက်တဲ့ နေရာတိုင်းမှာ သင့် package manager နဲ့ polyfill ကို install လုပ်ပါ:

  

#### bun

```bash
bun add temporal-polyfill
```

#### pnpm

```bash
pnpm add temporal-polyfill
```

#### yarn

```bash
yarn add temporal-polyfill
```

#### npm

```bash
npm install temporal-polyfill
```

ပြီးရင် သင့် client ကို ဖန်တီးတဲ့ file ရဲ့ အပေါ်ဆုံးမှာ ဒီလို လိုင်းတစ်လိုင်း ထည့်ပါ။ `npx prisma orm init` က set up လုပ်ထားတဲ့ project မှာဆိုရင် အဲဒီ file က `src/prisma/db.ts` ပါ:

```ts
import "temporal-polyfill/full/global";
```

အဲဒါ မပါရင် — အဲဒီလို field တစ်ခုကို ဖတ်တဲ့အခါ ဒါမှမဟုတ် သူ့အတွက် default က လက်ရှိအချိန်ကို generate လုပ်တဲ့ row တစ်ခုကို ရေးတဲ့အခါ — `code` က `RUNTIME.TEMPORAL_UNAVAILABLE` ဖြစ်တဲ့ error တစ်ခု ထွက်ပါတယ်။ `Temporal` value ကို default အနေနဲ့ ရေးတဲ့ TypeScript contract တစ်ခုကတော့ — ဥပမာ `.default(Temporal.Instant.from(...))` — `npx prisma contract emit` က file ကို load လုပ်တဲ့အခါ အဲဒီ code ကို run ပါတယ်။ ဒါကြောင့် `src/prisma/contract.ts` ရဲ့ အပေါ်ဆုံးမှာလည်း အဲဒီ import ကိုပဲ ထည့်ထားပါ။ ဘယ် type တွေက `Temporal` value တွေကို ဖတ်သလဲဆိုတာကို [Models နဲ့ fields](/docs/prisma/psl-syntax) မှာ စာရင်းပြုထားပါတယ်။

## Database များ (Databases)

| Database | အနိမ့်ဆုံး | Driver |
| --- | --- | --- |
| PostgreSQL | 15 | `@prisma/orm-postgres` ထဲမှာ ပါပြီးသား။ |
| MongoDB | 8.0 | `mongodb` 7 — `@prisma/orm-mongo` နဲ့အတူ npm နဲ့ pnpm က install လုပ်ပေးတဲ့ peer dependency ပါ။ Yarn နဲ့ဆိုရင် ကိုယ်တိုင် ထည့်ပါ။ |

`@prisma/orm-postgres` နဲ့ `@prisma/orm-mongo` က သင့် app import လုပ်တဲ့ library တွေ ဖြစ်ပါတယ်။ တစ်ခုချင်းစီက `@prisma/client` အစား သင့် app က သူ့ database အတွက် install လုပ်ရတဲ့ package တစ်ခုတည်း ဖြစ်ပါတယ်။ MariaDB၊ SQL Server နဲ့ CockroachDB တို့အတွက် Prisma ORM 8 library မရှိသေးပါဘူး။ SQLite ရဲ့ library `@prisma/orm-sqlite` က experimental ဖြစ်ပြီး — MySQL ရဲ့ `@prisma/orm-mysql` ကတော့ MySQL 8.4 ပေါ်မှာ migrations run ပြီး ဒေတာ ဖတ်နိုင်တဲ့ early preview ဖြစ်ပေမယ့် ORM ကနေ row တွေ မရေးနိုင်သေးပါဘူး။ စာရင်းကို [ထောက်ပံ့ထားတဲ့ database များ](/docs/prisma/supported-databases) မှာ ကြည့်ပါ။

## TypeScript လိုအပ်ချက်များ (TypeScript)

Prisma ORM က TypeScript ကို မလိုအပ်ပါဘူး — ဒါကြောင့် သာမန် JavaScript project တစ်ခု အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် TypeScript ရှိနေရင်တော့ 5.9 သို့မဟုတ် အထက် ဖြစ်ရပါမယ်။

`tsconfig.json` setting တွေက app ကို ဘယ်လို run သလဲဆိုတာပေါ် မူတည်ပါတယ်။ `tsx` ကနေ run သလို Vite၊ Next.js ဒါမှမဟုတ် esbuild လို bundler တစ်ခုက build လုပ်ပေးတဲ့ app တစ်ခုက `"module": "preserve"` နဲ့ `"moduleResolution": "bundler"` ကို သုံးပါတယ် — `npx prisma orm init` က အဲဒါတွေကို ရေးပေးပါတယ်။ ဒါတွေနဲ့အတူ `"strict": true` နဲ့ `"resolveJsonModule": true` လည်း ပါပါတယ်။ သင့် project မှာ `tsconfig.json` ရှိပြီးသားဆိုရင် `orm init` က `module`၊ `moduleResolution` နဲ့ `resolveJsonModule` ကို အဲဒီ value တွေအဖြစ် set လုပ်ပြီး၊ `types` ထဲကို `node` ထည့်ကာ — ကျန်တဲ့ setting တွေကို မပြောင်းဘဲ ထားပေးပါတယ်။ `tsc` နဲ့ compile လုပ်ပြီး output ကို `node` နဲ့ run တဲ့ app တစ်ခုကတော့ အဲဒါအစား `"module": "nodenext"` နဲ့ `"moduleResolution": "nodenext"` ကို သုံးပါတယ် — ဒါကြောင့် `orm init` ပြီးတဲ့နောက် အဲဒါတွေကို ပြန်ပြောင်းပါ။ App run နည်းတစ်မျိုးချင်းစီကို [tsconfig.json ကို set up လုပ်ခြင်း](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql#26-set-up-tsconfigjson-for-the-prisma-orm-8-client) မှာ ဖော်ပြထားပြီး MongoDB project တွေအတွက်လည်း သက်ဆိုင်ပါတယ်။

## ES module ပဲ သုံးရသည် (ES modules only)

Prisma ORM 8 package တိုင်းကို ES module အနေနဲ့ publish လုပ်ထားပါတယ်။ သင့် project ကလည်း ES module ဖြစ်နိုင်ပါတယ် — `package.json` ထဲမှာ `"type": "module"` ထည့်ရပါမယ်။ `package.json` မှာ `dependencies` မရှိသေးရင် `npx prisma orm init` က အဲဒါကို ထည့်ပေးပါတယ်။ ဒါမှမဟုတ် CommonJS အတိုင်း ဆက်ထားနိုင်ပါတယ်: `package.json` ကို ရှိသလို ထားပြီး အပေါ်က `nodenext` setting တွေကို သုံးကာ package တွေကို အရင်လိုပဲ `require` နဲ့ load လုပ်ပါ။ [CommonJS project တစ်ခုထဲမှာ](https://www.prisma.io/docs/cli/orm-init#in-a-commonjs-project) ဆိုတဲ့ နေရာမှာ အဆင့်ဆင့် ရှင်းပြထားပါတယ်။

## သင့် Version တွေကို စစ်ဆေးခြင်း (Check your versions)

```bash
node --version
npx tsc --version
npx prisma --version
psql "$DATABASE_URL" -c "SELECT version();"
```

`psql --version` တစ်ခုတည်းက `psql` program ရဲ့ version ကို ပြပါတယ်၊ server ရဲ့ version ကို မဟုတ်ပါဘူး။ MongoDB အတွက်ဆိုရင် `mongosh` ထဲမှာ `db.version()` ကို run ပါ။ Bun ဒါမှမဟုတ် Deno အတွက်ဆိုရင် `bun --version` ဒါမှမဟုတ် `deno --version` ကို run ပါ။

`prisma` က command-line tool ဖြစ်ပြီး library ဘေးမှာ dev dependency အနေနဲ့ install လုပ်ရပါတယ် — နှစ်ခုက version သီးခြားစီ ထုတ်ပါတယ်။ ဒီ page ပေါ်က version တွေကို နောက်ဆုံး 2026 ခုနှစ် အောက်တိုဘာလ 22 ရက်နေ့မှာ စစ်ဆေးထားပါတယ်။

## ဆက်စပ် Page များ (Related pages)

- [`Prisma ORM 7 ကနေ ပြောင်းလာခြင်း`](/docs/prisma/coming-from-prisma-orm-7): Prisma ORM 7 ရဲ့ schema attribute၊ command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်သလဲ၊ ပြီးတော့ ဘာတွေ မရသေးသလဲ။
- [`Core concepts`](/docs/prisma/core-concepts): Prisma ORM 8 က ဘယ်လို အစိတ်အပိုင်းတွေ ပေါင်းစပ်ထားသလဲ — contract၊ contract emit က ရေးတဲ့ file တွေ၊ database signature၊ queries နဲ့ migrations အစဉ်အတိုင်း။
- [`Extensions`](/docs/prisma/extensions): Prisma ORM ထဲ ချိတ်ဆက်လို့ရတဲ့ package တိုင်း — database package တွေ၊ column type တွေ၊ index တွေ၊ query operation တွေနဲ့ middleware တွေ၊ Prisma နဲ့ community ကနေ ထုတ်တာမျိုးပါ။
- [`Overview`](/docs/prisma/data-modeling): သင့် application လိုအပ်တဲ့ ဒေတာကို model တွေ၊ primary key တွေ၊ scalar field တွေနဲ့ relation တွေနဲ့ ဖော်ပြပါ။
- [`Prisma 7`](https://www.prisma.io/docs/orm/v7): Prisma ORM ဆိုတာ type-safe database access၊ migrations နဲ့ visual data editor ကို ပေးတဲ့ မျိုးဆက်သစ် Node.js နဲ့ TypeScript ORM ဖြစ်ပါတယ်။
