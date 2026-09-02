---
title: "Userland Migrations မိတ်ဆက်"
description: "Node.js ရဲ့ official userland migrations — Codemod နဲ့ ပူးပေါင်းထားတဲ့ @nodejs codemods များ၊ codemod သုံးနည်း၊ အကောင်းဆုံး အလေ့အထများ၊ registry နားလည်ခြင်းနဲ့ migration guides စာရင်း"
order: 66
source: "https://nodejs.org/learn/getting-started/userland-migrations"
status: translated
updated: 2026-09-02
---

Node.js က **"userland"** code တွေ — node executable ပြင်ပက code ဘာမဆို — အတွက် migrations တွေ ပံ့ပိုးပေးပါတယ်။ ဒါတွေက features အသစ်တွေကို လက်ခံကျင့်သုံးဖို့နဲ့ breaking changes တွေကို ကိုင်တွယ်ဖို့ ကူညီပေးပါတယ်။ ဒီ migrations တွေကို — codemods တွေကို တည်ဆောက်၊ မျှဝေ၊ run လုပ်ရတာ လွယ်ကူအောင် အာရုံစိုက်ထားတဲ့ platform တစ်ခုဖြစ်တဲ့ [Codemod](https://codemod.com) နဲ့ ပူးပေါင်းတည်ဆောက်ထားပါတယ်။

Official migrations တွေကို [Codemod registry](https://codemod.link/nodejs-official) ထဲက `@nodejs` scope အောက်မှာ ထုတ်ဝေထားပါတယ်။ ဒါတွေကို Node.js members တွေက ပြန်လည်သုံးသပ်ထားပြီး/ရေးသားထားတာ ဖြစ်ပါတယ်။

## ရည်ရွယ်ချက် (Goal)

Node.js Userland Migrations အဖွဲ့ရဲ့ ရည်ရွယ်ချက်က — developer တွေ သူတို့ရဲ့ codebases တွေကို Node.js version အသစ်ဆုံးတွေဆီ ပြောင်းရွှေ့ဖို့ ကူညီပေးဖို့ပါ — deprecations, features အသစ်တွေနဲ့ breaking changes တွေကို ကိုင်တွယ်ရတာ ပိုလွယ်ကူအောင် လုပ်ပေးတာပါ။

## Codemod တစ်ခုကို ဘယ်လို သုံးမလဲ

Codemod တစ်ခုကို သုံးဖို့ — terminal ထဲမှာ အောက်ပါ command ကို run နိုင်ပါတယ်:

```bash
npx codemod <codemod-name>
```

`<codemod-name>` နေရာမှာ သင်သုံးချင်တဲ့ codemod ရဲ့ နာမည်ကို ထည့်ပါ။ ဥပမာ — သင့် project ပေါ်မှာ `@nodejs/import-assertions-to-attributes` codemod ကို run ချင်ရင် ဒီလို run ရပါမယ်:

```bash
npx codemod @nodejs/import-assertions-to-attributes
```

## အကောင်းဆုံး အလေ့အထများ (Good Practices)

- **Migrations တွေကို branch သပ်သပ်တစ်ခုမှာ run ပါ**: Git လို version control system သုံးနေရင် — migrations တွေကို branch သပ်သပ်တစ်ခုမှာ run တာက အကောင်းဆုံး အလေ့အထတစ်ခုပါ။ ဒါက သင့် main branch ထဲကို merge မလုပ်ခင် အပြောင်းအလဲတွေကို ပြန်လည်သုံးသပ်ခွင့် ပေးပါတယ်။
- **အပြောင်းအလဲတွေကို ပြန်လည်သုံးသပ်ပါ**: Migration တစ်ခု run ပြီးတဲ့အခါ — သင့် codebase ပေါ်မှာ ဖြစ်သွားတဲ့ အပြောင်းအလဲတွေကို သုံးသပ်ပါ။ Migration က မရည်ရွယ်ဘဲ ဘေးထွက်ဆိုးကျိုး (side effects) ဒါမှမဟုတ် ပြဿနာတွေ မဖြစ်စေဘူးဆိုတာ သေချာစေပါ။
- **ကိုယ့် code ကို test လုပ်ပါ**: Migration တစ်ခု run ပြီးတဲ့အခါ — အရာအားလုံး မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေလားဆိုတာ သေချာဖို့ code ကို test လုပ်တာ အရေးကြီးပါတယ်။ သင့် test suite ကို run ပြီး error တွေ ဒါမှမဟုတ် failures တွေ ရှိမရှိ စစ်ဆေးပါ။
- **Code ကို format နဲ့ lint လုပ်ပါ**: Migration တစ်ခု run ပြီးတဲ့အခါ — code ကို format နဲ့ lint လုပ်တာက အကောင်းဆုံး အလေ့အထပါ။ ဒါက သင့် code က project ရဲ့ coding standards တွေနဲ့ ကိုက်ညီပြီး — ဖတ်ရလွယ်၊ ထိန်းသိမ်းရလွယ်ကူစေပါတယ်။

## Codemods Registry အကြောင်း နားလည်ခြင်း

[Codemod registry](https://codemod.link/nodejs-official) က Node.js အတွက် ရနိုင်တဲ့ codemods တွေရဲ့ စာရင်းကို ပေးပါတယ်။ Codemod တချို့က အောက်က resources တွေထဲမှာ မပါဝင်ပေမယ့် — Node.js version တစ်ခုဆီ ပြောင်းရွှေ့ခြင်းနဲ့ မသက်ဆိုင်လို့ — ရနေဆဲ ဖြစ်နိုင်ပါတယ်။ ကျွန်တော်တို့က End-Of-Life (EOL) deprecations တွေအတွက် codemods တွေကိုပဲ စာရင်းပြုစုထားတာမို့ — သင့် migrations တွေအတွက် အသုံးဝင်နိုင်တဲ့ တခြား codemods တွေကို registry ထဲမှာ ကိုယ်တိုင် ရှာဖွေကြည့်ဖို့ လိုနိုင်ပါတယ်။

> Codemod platform ထဲကို login ဝင်ထားရင် — ဒီ posts တွေကို like လုပ်နိုင်ပါတယ်။ ဒါက ဘယ်အရာတွေက user တွေအတွက် အဖိုးတန်လဲဆိုတာ ကျွန်တော်တို့ သိမြင်နိုင်ဖို့ ကူညီပေးပါတယ်။

## အကြံပြုချက် (Feedback)

အကြံပြုချက် ဒါမှမဟုတ် ပိုကောင်းအောင် လုပ်ဖို့ အကြံဉာဏ်တွေ ရှိရင် — [Node.js Userland Migrations repository](https://github.com/nodejs/userland-migrations/discussions) မှာ discussion တစ်ခု ဖွင့်ပေးပါ။

## Userland Migrations တိုးတက်မှုကို ခြေရာခံခြင်း

Userland migrations တွေရဲ့ တိုးတက်မှုကို ကျွန်တော်တို့ရဲ့ [GitHub project board](https://github.com/orgs/nodejs/projects/13/views/1) မှာ လိုက်ကြည့်နိုင်ပါတယ်။

ဒီ board မှာ ဒါတွေကို ခြေရာခံပါတယ်:

- Codemod အမျိုးအစား (deprecation, breaking change, ecosystem)
- Node.js version
- Status (backlog, todo, in progress, done, not planned) — *ပါဝင်ကူညီချင်ရင်တော့ "todo" column ကို ကြည့်ပေးပါ*

## Migration Guides

Migration guides အားလုံးကို [migration guides section](https://nodejs.org/blog/migrations) မှာ ကြည့်နိုင်ပါတယ်။ ဒီထဲက Node.js userland migrations နဲ့ ဆိုင်တဲ့ guides တွေကို မြန်မာလို ဘာသာပြန်ထားပါတယ်:

- [Axios မှ WHATWG Fetch သို့](/docs/nodejs/axios-to-whatwg-fetch) — Axios HTTP client ကနေ built-in global `fetch` ဆီ ပြောင်းရွှေ့ခြင်း
- [Chalk မှ util.styleText() သို့](/docs/nodejs/chalk-to-util-styletext) — `chalk` package ကနေ Node.js built-in `util.styleText()` ဆီ ပြောင်းရွှေ့ခြင်း
- [TypeScript Specifiers ပြုပြင်ခြင်း](/docs/nodejs/correct-ts-specifiers) — TypeScript import specifiers တွေကို standards-compliant ဖြစ်အောင် ပြုပြင်ခြင်း
- [Kleur မှ util.styleText သို့](/docs/nodejs/kleur-to-util-styletext) — `kleur` package ကနေ Node.js built-in `util.styleText` ဆီ ပြောင်းရွှေ့ခြင်း
- [Mocha မှ Node.js Test Runner သို့](/docs/nodejs/mocha-to-node-test-runner) — Mocha test suites တွေကို built-in test runner (`node:test`) ဆီ ပြောင်းရွှေ့ခြင်း

ဒါ့အပြင် — major-to-major releases တွေအတွက် migration guides တွေမှာ end-of-life [deprecations](https://nodejs.org/docs/latest/api/deprecations.html) နဲ့ breaking changes တွေပဲ ပါဝင်တယ်ဆိုတာကိုလည်း သတိပြုပါ။
