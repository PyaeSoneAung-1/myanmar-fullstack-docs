---
title: "Release Status — Prisma ORM 8 ရဲ့ လက်ရှိ အခြေအနေ"
description: "Prisma ORM 8 က ဒီနေ့ ဘယ်အဆင့်မှာ ရှိလဲ၊ install လုပ်ရင် ဘာတွေ ရမလဲ၊ ပြီးတော့ Prisma ORM 7 ပေါ်မှာ ဘယ်လို ဆက်နေနိုင်မလဲဆိုတာ ရှင်းပြထားပါတယ်"
order: 39
source: "https://www.prisma.io/docs/orm/release-status"
status: translated
updated: 2026-11-06
---

Prisma ORM 8 က ဒီနေ့ ဘယ်အဆင့်မှာ ရှိလဲ၊ install လုပ်လိုက်ရင် ဘာတွေ ရမလဲ၊ ပြီးတော့ Prisma ORM 7 ပေါ်မှာ ဘယ်လို ဆက်နေမလဲဆိုတာ ဒီ page မှာ ဖတ်ပါ။

Prisma ORM 8 က **release candidate** အဆင့်ပါ — ဒီနေ့တင် install လုပ်ပြီး တည်ဆောက်လို့ ရပါပြီ။ Final release မထွက်မချင်း API အသေးစိတ် တချို့ ပြောင်းလဲနိုင်သေးလို့ — အခု ရေးထားတဲ့ code တွေက နောက်ပိုင်း edit အနည်းငယ် လိုနိုင်ပါတယ်။ Release candidate တစ်ခုချင်းစီက အရင်တစ်ခုမှာ တွေ့ခဲ့တဲ့ bugs တွေကို ပြင်ပေးပါတယ်။

ဒါက Node.js ရဲ့ 22 line မှာ 22.18 နဲ့ အထက်၊ 24 line မှာ 24.11 နဲ့ အထက်၊ ဒါမှမဟုတ် 26 နဲ့ အထက် လိုအပ်ပြီး — TypeScript 5.9 နဲ့ အထက်လည်း လိုပါတယ်။ အဲဒီ Node.js releases တွေနဲ့ ပါလာတဲ့ npm တွေ အလုပ်လုပ်ပါတယ် — Node.js 22 ပေါ်က npm 10 အပါအဝင်ပါ။ [Supported versions](/docs/prisma/supported-versions) မှာ databases အပါအဝင် အနိမ့်ဆုံး version တွေအားလုံးကို ဖော်ပြထားပါတယ်။

ဆုံးဖြတ်ချက် မချခင် [what is not available yet](/docs/prisma/coming-from-prisma-orm-7) ကို ဖတ်ကြည့်ပါ။ ဒီနေ့အထိ အဲဒါထဲမှာ `$extends`၊ JSON columns အတွင်း filtering၊ atomic `increment`၊ nested writes အများစု၊ transaction isolation levels နဲ့ `P2002` ပုံစံ error codes တွေ ပါဝင်ပါတယ်။

## Final release ကို ဘယ်တော့ မျှော်လင့်ရမလဲ

General availability ကို 2026 ခုနှစ် အောက်တိုဘာလမှာ မျှော်လင့်ထားပါတယ်။

## Prisma ORM 7 ကို final release ပြီးနောက် 18 လ ထောက်ပံ့ပါတယ်

Prisma ORM 8 general availability ရောက်တဲ့ နေ့ကစပြီး 18 လ အတွင်း Prisma ORM 7 ကို bug fixes နဲ့ security updates ဆက်ပြီး ပေးပါတယ်။ သူ့ documentation က [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ ဆက်ရှိပါတယ်။

## Prisma ORM 6 ကို 2026 ခုနှစ် နိုဝင်ဘာ 19 ရက်အထိ security patches ပေးပါတယ်

Prisma ORM 7 ထွက်ပြီးနောက် 12 လ — 2026 ခုနှစ် နိုဝင်ဘာ 19 ရက်မှာ ကုန်ဆုံးတဲ့ ကာလအတွင်း — Prisma ORM 6 ကို security patches ပဲ ပေးပြီး တခြား update မပေးပါဘူး။ သူ့ documentation က [/orm/v6](https://www.prisma.io/docs/orm/v6) မှာ ဆက်ရှိပါတယ်။

## ဒီနေ့ install လုပ်ရင် ဘာတွေ ရမလဲ

Prisma ORM 8 က package နှစ်ခုပါ — command-line tool တစ်ခုနဲ့ သင့် app က import လုပ်တဲ့ library တစ်ခုပါ။ Database တစ်ခုစီအတွက် library တစ်ခုစီ ရှိပြီး — PostgreSQL အတွက်ဆိုရင် `@prisma/orm-postgres` ပါ။

#### bun

```bash
bun add --dev prisma
bun add @prisma/orm-postgres
```

#### pnpm

```bash
pnpm add --save-dev prisma
pnpm add @prisma/orm-postgres
```

#### yarn

```bash
yarn add --dev prisma
yarn add @prisma/orm-postgres
```

#### npm

```bash
npm install --save-dev prisma
npm install @prisma/orm-postgres
```

MongoDB အတွက်ကတော့ library က `@prisma/orm-mongo` ပါ။ [Supported databases](/docs/prisma/supported-databases) မှာ database တိုင်းနဲ့ သူတို့ရဲ့ status ကို ဖော်ပြထားပါတယ်။

`@prisma/orm-postgres` က `temporal-polyfill` package ကို လိုပြီး — အဲဒါကို peer dependency အနေနဲ့ ကြေညာထားပါတယ်။ npm၊ pnpm နဲ့ bun က အလိုအလျောက် install ပေးပါတယ်။ Yarn နဲ့ဆိုရင်တော့ ကိုယ်တိုင် dependencies ထဲ ထည့်ပါ — `yarn add temporal-polyfill`။

Package နှစ်ခုမှာ version နံပါတ် မတူတာ ပုံမှန်ပါပဲ — သီးခြား release လုပ်တာဖြစ်ပြီး command-line tool က release ပိုမြန်ပါတယ်။ နှစ်ခုလုံးကို `latest` နဲ့ install လုပ်ပါ — `latest` version ဘယ်နှစ်ခုပဲဖြစ်ဖြစ် အတူ အလုပ်လုပ်ပါတယ်၊ နံပါတ်တွေကို ကိုယ်တိုင် တွဲစရာ မလိုပါဘူး။ Project တစ်ခုထဲက `@prisma/orm-*` library တိုင်းက version တူရမှဖြစ်ပြီး တစ်ကြိမ်ပဲ install ရပါမယ် — copy နှစ်ခု install ဖြစ်နေရင် command နဲ့ client တိုင်း `RUNTIME.MULTIPLE_ORM_COPIES` နဲ့ ရပ်သွားပြီး copy နှစ်ခုလုံးရဲ့ နာမည်ကို ဖော်ပြပါတယ်။ `npm ls @prisma/orm-framework` ဒါမှမဟုတ် `pnpm why @prisma/orm-framework` က copy တစ်ခုစီကို package ဘယ်ကနေ ယူလာလဲဆိုတာ ပြပါတယ်။

| Package | 2026 ခုနှစ် နိုဝင်ဘာ 3 ရက်နေ့က `latest` |
| --- | --- |
| `prisma` (command-line tool) | `8.0.0-rc.30` |
| `@prisma/orm-postgres` (library) | `8.0.0-rc.22` |
| `@prisma/orm-mongo` (MongoDB အတွက် library) | `8.0.0-rc.22` |

ဒီနေ့ package တစ်ခုချင်းစီရဲ့ `latest` version ကို ကြည့်ဖို့ `npm view prisma dist-tags`၊ `npm view @prisma/orm-postgres dist-tags` နဲ့ `npm view @prisma/orm-mongo dist-tags` တို့ကို run ပြီး — ရလဒ်တစ်ခုချင်းရဲ့ `latest` entry ကို ဖတ်ပါ။ Command-line tool နဲ့ libraries တွေက သီးခြား version သတ်မှတ်ထားလို့ command သုံးခုလုံး လိုပါတယ်။

`@prisma/client` — Prisma ORM 7 apps တွေ import လုပ်တဲ့ library — က `7.10.1` မှာပဲ ရှိနေပါတယ်။ အဲဒါက Prisma ORM 7 ရဲ့ အစိတ်အပိုင်းဖြစ်ပြီး Prisma ORM 8 ထဲ မပါဝင်လို့ပါ။

> **သတိပေးချက် — Prisma ORM 7 project တစ်ခု ရှိထားရင်**
>
> `npm install prisma` နဲ့ `npx prisma` က အခု Prisma ORM 8 command-line tool ကို ပေးပါပြီ — အဲဒါက `schema.prisma` ကို မဖတ်ဘဲ `generate`၊ `migrate dev` ဒါမှမဟုတ် `db push` command တွေလည်း မပါပါဘူး။ သင့် project က Prisma ORM 7 ပေါ်မှာဆိုရင် — အခုပဲ `npm install --save-dev prisma@7` ကို run ပြီး အောက်မှာ ပြထားတဲ့အတိုင်း `package.json` ထဲမှာ version ကို lock လုပ်ပါ။ Version 8 install ဖြစ်နေပြီးသားဆိုရင် အဲဒီ command ကပဲ downgrade လုပ်ပေးပါတယ်။ အခု ဘာ install ထားလဲ ကြည့်ဖို့ `npm ls prisma @prisma/client` ကို run ပါ။

## Prisma ORM 7 ပေါ်မှာ ဘယ်လို ဆက်နေမလဲ

`package.json` ထဲမှာ package နှစ်ခုလုံးကို version 7 မှာ lock လုပ်ပါ:

```json title="package.json"
{
  "devDependencies": {
    "prisma": "^7"
  },
  "dependencies": {
    "@prisma/client": "^7"
  }
}
```

Version lock မလုပ်ထားဘဲ tool ကို run လုပ်တဲ့ နေရာတိုင်း — ဥပမာ CI ဒါမှမဟုတ် တစ်ကြိမ်သုံး command — မှာ `npx prisma` အစား `npx prisma@7` လို့ ရေးပါ။

Prisma ORM 7 documentation က [/orm/v7](https://www.prisma.io/docs/orm/v7) မှာ၊ setup guides တွေက [/v7/getting-started](https://www.prisma.io/docs/v7/getting-started) မှာ၊ command reference က [/cli/v7](https://www.prisma.io/docs/cli/v7) မှာ ရှိပါတယ်။

## နောက်တစ်ဆင့်

* ရှိပြီးသား Prisma ORM 7 app ကို ရွှေ့ဖို့ [Migrate from Prisma ORM 7 to 8](https://www.prisma.io/docs/guides/upgrade-prisma-orm/postgresql) ကို လိုက်ပါ။ အဲဒါက version နှစ်ခုလုံးကို အတူတကွ run ပြီး app ရဲ့ အစိတ်အပိုင်း တစ်ခုချင်းစီကို ရွှေ့ပေးပါတယ်။
* Prisma ORM 7 command နဲ့ query တစ်ခုချင်းစီကို အခု ဘယ်လို ခေါ်လဲ၊ ဘာတွေ မရသေးလဲ ကြည့်ဖို့ [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) ကို ဖတ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [Prisma ORM 7 ကနေ လာခြင်း](/docs/prisma/coming-from-prisma-orm-7): Prisma ORM 7 ရဲ့ schema attribute၊ command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်လဲ၊ ဘာတွေ မရသေးလဲ။
- [Core concepts](/docs/prisma/core-concepts): Prisma ORM 8 က အစိတ်အပိုင်းတွေ ဘယ်လို ဆက်စပ်နေလဲ — contract၊ contract emit ရေးတဲ့ files၊ database signature၊ queries နဲ့ migrations အစဉ်လိုက်။
- [Extensions](/docs/prisma/extensions): Prisma ORM ထဲ ထည့်သုံးလို့ရတဲ့ package တိုင်း — database packages၊ column types၊ indexes၊ query operations နဲ့ middleware တွေ၊ Prisma နဲ့ community ကနေ ပံ့ပိုးထားတာပါ။
- [Overview](/docs/prisma/data-modeling): Models၊ primary keys၊ scalar fields နဲ့ relations တွေနဲ့ သင့် application လိုအပ်တဲ့ ဒေတာကို ဖော်ပြခြင်း။
- [Prisma 7](https://www.prisma.io/docs/orm/v7): Prisma ORM ဆိုတာ type-safe database access၊ migrations နဲ့ visual data editor တွေ ပေးတဲ့ မျိုးဆက်သစ် Node.js နဲ့ TypeScript ORM ပါ။
