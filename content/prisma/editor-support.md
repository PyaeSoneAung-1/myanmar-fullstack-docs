---
title: "Editor Support — Prisma Contract အတွက် Editor ပံ့ပိုးမှု"
description: "Prisma VS Code extension က Prisma ORM contract တစ်ခုအတွက် ဘာတွေ လုပ်ပေးလဲ၊ ပြီးတော့ file ကို လက်မခံတော့တဲ့အခါ ဘာလုပ်ရမလဲဆိုတာ ရှင်းပြထားပါတယ်"
order: 43
source: "https://www.prisma.io/docs/orm/contract-authoring/editor-support"
status: translated
updated: 2026-11-06
---

Prisma VS Code extension က Prisma ORM contract တစ်ခုအတွက် ဘာတွေ လုပ်ပေးလဲ၊ ပြီးတော့ file ကို လက်မခံတော့တဲ့အခါ ဘာလုပ်ရမလဲဆိုတာ ဒီ page မှာ ဖတ်ပါ။

`.prisma` file ထဲမှာ error checking၊ formatting နဲ့ completion တွေ ရဖို့ [Prisma VS Code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) ကို install လုပ်ပါ။

Prisma ORM 8 မှာ အဲဒီ file က [data contract](/docs/prisma/the-data-contract) ပါ — Prisma ORM 7 က schema လို့ ခေါ်ခဲ့တဲ့ သင့် models ရဲ့ ဖော်ပြချက်ပါ။ သူ့ path က သင့် `prisma.config.ts` ထဲက `contract` setting ဖြစ်ပြီး — [`orm init`](https://www.prisma.io/docs/cli/orm-init) ရေးပေးတဲ့ config မှာဆိုရင် `prisma/contract.prisma` ပါ။ [Configuration](https://www.prisma.io/docs/cli/configuration#config-file) ကို ကြည့်ပါ။

Prisma ORM 7 ကနေ လာတာလား။ [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) ကနေ စပါ။ ဒီ page က VS Code အတွက်ပဲ ရည်ရွယ်ထားပါတယ်။

## File ရဲ့ ခေါင်းပိုင်း (The file header)

Extension က ပထမဆုံး blank မဟုတ်တဲ့ line က အောက်ပါအတိုင်း ဖြစ်နေတဲ့ `.prisma` files တွေပေါ်မှာပဲ အလုပ်လုပ်ပါတယ်:

```prisma title="prisma/contract.prisma"
// use prisma-8
```

အဲဒီ line မပါတဲ့ file က error checking၊ completion နဲ့ formatting ဘာမှ မရပါဘူး။ [`prisma contract emit`](https://www.prisma.io/docs/cli/contract-emit) ကလည်း warning မပေးဘဲ ကျော်သွားပြီး — `contract` setting က ဖော်ပြတဲ့ file တွေထဲက တစ်ခုမှ အဲဒီ line မပါရင် `contract emit` က `CONTRACT.SOURCE_LOAD_FAILED` နဲ့ fail ဖြစ်ပါတယ်။ [`orm init`](https://www.prisma.io/docs/cli/orm-init) နဲ့ [`contract infer`](https://www.prisma.io/docs/cli/contract-infer) က အဲဒီ line ကို အလိုအလျောက် ရေးပေးပါတယ်။ Contract ကို ကိုယ်တိုင် လက်နဲ့ ဖန်တီးတဲ့အခါမှာတော့ ကိုယ်တိုင် ထည့်ပါ။

## Editor က ဘာတွေ လုပ်ပေးလဲ

* **Errors** တွေက စာရိုက်နေစဉ်မှာတင် inline ပေါ်လာပါတယ်။ အဲဒါတွေက [`prisma contract emit`](https://www.prisma.io/docs/cli/contract-emit) — contract ကို စစ်ဆေးပြီး `contract.json` နဲ့ `contract.d.ts` ကို ရေးပေးတဲ့ command — က ပေးမယ့် error တွေနဲ့ အတူတူပါပဲ။
* **Formatting** က file တစ်ခုလုံးကို ပြန်စီပေးပါတယ်။ VS Code မှာ **Format Document** ကို run ပါ။
* **Completion** က `@` ဒါမှမဟုတ် `@@` ရိုက်တာနဲ့ စပါတယ်။ Editor က `@id`၊ `@default` နဲ့ `@@index` လိုမျိုး attribute နာမည်တွေကို ဖော်ပြပြီး တစ်ခုချင်းစီမှာ ဖော်ပြချက်တိုတို ပါပါတယ်။ Attribute တစ်ခုအတွင်းမှာဆိုရင် မဖြည့်ရသေးတဲ့ argument နာမည်တွေကို ဖော်ပြပြီး သူတို့အတွက် value တွေ အကြံပြုပါတယ်။ `[ ]` နဲ့ `{ }` အတွင်းမှာလည်း value တွေ အကြံပြုပါတယ်။ MongoDB index ရဲ့ field list မှာဆိုရင် field နာမည်နောက်က ကွင်းစွဲထဲမှာ option နဲ့ သူ့ value တွေကို အကြံပြုပါတယ် — ဥပမာ `@@index([createdAt(sort: Desc)])` ထဲက `sort` နဲ့ `Desc` ပါ။ Attribute က field နာမည်ကို မျှော်နေတဲ့ နေရာမှာဆိုရင် scalar fields တွေကိုပဲ အကြံပြုပါတယ်။ Attribute တစ်ခုမှာ မဖြစ်မနေ လိုတဲ့ arguments ရှိရင် — VS Code က argument တစ်ခုချင်းစီရဲ့ နာမည်နဲ့ placeholder တွေ ထည့်ပေးပြီး tab နဲ့ ဆက်သွားလို့ ရပါတယ်။ `policy_select` လိုမျိုး block တစ်ခုမှာဆိုရင် lists နဲ့ function calls အတွင်းအပါအဝင် value တွေကို complete လုပ်ပေးပြီး namespace အတွက် `ns.` ကို ပေးပါတယ်။ Block value တစ်ခုက တခြား namespace ထဲက entity တစ်ခုကို ဖော်ပြနိုင်ပါတယ် — `target = auth.Account` လိုမျိုးပါ။
* **Hover** က နာမည်တစ်ခုက ဘာလဲဆိုတာ ပြပါတယ်။ Model၊ field၊ type ဒါမှမဟုတ် block တစ်ခုပေါ်မှာဆိုရင် declaration နဲ့ သူ့ရဲ့ `///` doc comment ကို ပြပါတယ်။ Attribute၊ argument နာမည်၊ function၊ constant ဒါမှမဟုတ် extension pack က type တစ်ခုပေါ်မှာဆိုရင် signature နဲ့ သူ့ documentation ကို ပြပါတယ်။
* **Go to definition** က နာမည်တစ်ခုကို သုံးထားတဲ့ နေရာကနေ သူ့ declaration ဆီ ခုန်သွားပြီး — **Find references** က နာမည်တစ်ခုကို သုံးထားတဲ့ နေရာတိုင်းကို စာရင်းပြပါတယ်။ နှစ်ခုလုံးက models၊ composite types၊ named types၊ blocks၊ fields နဲ့ namespaces တွေအတွက် contract ရဲ့ file တိုင်းဆီမှာ အလုပ်လုပ်ပါတယ်။
* **Signature help** က attribute တစ်ခုအတွင်း `(` ဒါမှမဟုတ် `,` ရိုက်တဲ့အခါ ပေါ်လာပါတယ်။ Attribute ရဲ့ arguments တွေကို ပြပြီး သင်ရိုက်နေတဲ့ argument ကို ရှင်းပြပါတယ်။

Attribute စာရင်းက သင့် `prisma.config.ts` ကနေ လာပါတယ် — အဲဒါက ကြေညာထားတဲ့ database နဲ့ `extensions` အောက်မှာ ဖော်ပြထားတဲ့ Prisma extension packs တွေပါ။ အဲဒီ config အတွက် [Extension packs](https://www.prisma.io/docs/cli/configuration#extension-packs) ကို ကြည့်ပါ။ Extension packs ဆိုတာ [pgvector](/docs/prisma/using-extensions) လိုမျိုး database features တွေအတွက် add-on packages တွေပါ။ သင့် config မှာ pgvector pack ကို ဖော်ပြထားရင် editor က pgvector ရဲ့ attributes တွေကိုပါ အကြံပြုပါတယ်။ Database connection မလိုပါဘူး။

## Contract ကို file များစွာနဲ့ ရေးခြင်း

`prisma.config.ts` ထဲက `contract` က `./*.prisma` လိုမျိုး glob ဖြစ်နေရင် — editor က `// use prisma-8` နဲ့ စတဲ့ file တိုင်းကို contract တစ်ခုတည်းအနေနဲ့ ဖတ်ပါတယ်။ `prisma contract emit` ဖတ်တဲ့ file တွေနဲ့ အတူတူပါပဲ။ သင်မဖွင့်ရသေးတဲ့ file တစ်ခုမှာ ကြေညာထားတဲ့ model က သင်တည်းဖြတ်နေတဲ့ file တွေမှာ သိထားပြီး ဖြစ်နေပါတယ်။ Editor က contract ရဲ့ file တိုင်းမှာ — သင်မဖွင့်ထားတဲ့ file တွေအပါအဝင် — error တွေကို report လုပ်ပါတယ်။ [Split the schema across several files](https://www.prisma.io/docs/cli/configuration#split-the-schema-across-several-files) ကို ကြည့်ပါ။

## Upgrade ပြီးနောက် မှားယွင်းတဲ့ errors ပေါ်လာခြင်း

`prisma contract emit` လက်ခံတဲ့ contract တစ်ခုမှာ editor က attributes တွေကို error အနေနဲ့ မှတ်နေရင် — အကြောင်းရင်းက ORM package အိုနေတာ ဖြစ်နိုင်ပါတယ်။ အဲဒါက သင့် project က သူ့ database အတွက် install လုပ်တဲ့ `@prisma/orm-postgres`၊ `@prisma/orm-mongo` ဒါမှမဟုတ် `@prisma/orm-sqlite` package ပါ။ Install ထားတဲ့ version ကို စစ်ပါ:

```bash title="Terminal"
npm ls @prisma/orm-postgres
```

`8.0.0-rc.9` အောက် version ကို ပြရင် နောက်ဆုံး version ကို update လုပ်ပါ:

#### bun

```bash title="Terminal"
bun add @prisma/orm-postgres@latest
```

#### pnpm

```bash title="Terminal"
pnpm add @prisma/orm-postgres@latest
```

#### yarn

```bash title="Terminal"
yarn add @prisma/orm-postgres@latest
```

#### npm

```bash title="Terminal"
npm install @prisma/orm-postgres@latest
```

သင့် database နဲ့ ကိုက်ညီအောင် `orm-postgres` ကို `orm-mongo` ဒါမှမဟုတ် `orm-sqlite` နဲ့ အစားထိုးပါ။ ပြီးရင် editor window ကို reload လုပ်ပါ။ VS Code မှာ Command Palette ကနေ **Developer: Reload Window** ကို run ပါ။

## ဆက်စပ်ဖတ်ရန်

- [Advanced PostgreSQL](/docs/prisma/advanced-postgresql): Row-level security၊ expression နဲ့ partial indexes၊ check constraints၊ Prisma ORM က မစီမံသင့်တဲ့ tables တွေနဲ့ လိုအပ်တဲ့ PostgreSQL extensions တွေ — တစ်ခုချင်းစီကို သင့် contract ထဲမှာ ရေးခြင်း။
- [Author in PSL](/docs/prisma/psl-syntax): သိပြီးသား Prisma schema language အပြင် Prisma ORM 8 ရဲ့ အပိုဆောင်းချက်တွေပါ ပါဝင်တဲ့ Prisma ORM contract ကို ရေးခြင်း။
- [Author in TypeScript](/docs/prisma/typescript-schema-builder): Schema file အစား TypeScript ထဲက typed builder နဲ့ Prisma ORM contract ကို define လုပ်ခြင်း။ Models တူတူ၊ `contract.json` နဲ့ `contract.d.ts` တူတူ၊ သီးခြား language မလို။
- [contract.json နဲ့ contract.d.ts](/docs/prisma/the-contract-artifact): contract.json နဲ့ contract.d.ts က Prisma ORM ရဲ့ တခြား အစိတ်အပိုင်းတိုင်း ဖတ်တဲ့ file နှစ်ခုပါ။ အထဲမှာ ဘာတွေ ပါလဲဆိုတာ ဒီမှာ ကြည့်ပါ။
- [Supported database features](/docs/prisma/capabilities): Contract က သင့် packages တွေ ထောက်ပံ့တဲ့ database features တွေကို မှတ်တမ်းတင်ထားလို့ — Prisma ORM က မထောက်ပံ့တဲ့ feature တစ်ခုကို ရှင်းလင်းတဲ့ error နဲ့ စောစော ငြင်းပယ်နိုင်ပါတယ်။
