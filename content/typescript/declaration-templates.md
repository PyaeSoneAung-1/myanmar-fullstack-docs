---
title: "Templates (.d.ts Templates များ)"
description: ".d.ts template (နမူနာပုံစံ) အမျိုးမျိုးရဲ့ စာရင်း — global, module, class, function, plugin စတဲ့ library structure တစ်ခုချင်းစီအတွက် စတင်ရေးသားစရာ .d.ts files"
order: 22
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/templates.html"
status: translated
updated: 2026-09-02
---

ဒီစာမျက်နှာက — သာမန်အသုံးများတဲ့ .d.ts ပုံစံ (template — စတင်ရေးသားဖို့ နမူနာပုံစံ) အမျိုးမျိုးအတွက် စတင်ရေးသားစရာ (starting point) files တွေကို စုစည်းထားတာပါ။ အောက်က file name တစ်ခုချင်းစီကို နှိပ်လိုက်ရင် — အဲဒီပုံစံအတွက် ပြည့်စုံတဲ့ `.d.ts` template code နဲ့ ရှင်းလင်းချက် ပါဝင်တဲ့ စာမျက်နှာဆီ ရောက်သွားပါလိမ့်မယ်။

## Template စာရင်း

- [`global-modifying-module.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html) — import လုပ်လိုက်တာနဲ့ global scope ထဲက existing values တွေကို ပြုပြင် (modify) ပေးတဲ့ module အတွက် declaration — ဥပမာ `String.prototype` ထဲကို member အသစ်တွေ ထည့်ပေးတဲ့ library မျိုး
- [`global-plugin.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-plugin-d-ts.html) — UMD module တွေ (module အနေနဲ့လည်း သုံးလို့ရသလို module loader မရှိတဲ့ environment မှာ global အနေနဲ့လည်း သုံးလို့ရတဲ့ပုံစံ) အတွက် plugin declaration
- [`global.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html) — import လုပ်စရာမလိုဘဲ global scope မှာ တိုက်ရိုက် သုံးလို့ရတဲ့ global libraries တွေအတွက် declaration
- [`module-class.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html) — class တစ်ခုကို export လုပ်တဲ့ module တွေအတွက် declaration (constructor နဲ့ methods ပါတဲ့ class ပုံစံ)
- [`module-function.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) — function တစ်ခုကို export လုပ်ပြီး အဲဒီ function ပေါ်မှာ properties/namespace တွေ တွဲပါလာတဲ့ module တွေအတွက် declaration
- [`module-plugin.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html) — တခြား library (module) ရဲ့ exports တွေကို ချဲ့ထွင် (extend) ပေးတဲ့ module plugin တွေအတွက် declaration
- [`module.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html) — `module.exports` နဲ့ exported values တွေကို ဖော်ပြတဲ့ CommonJS/ES module ပုံစံ module တွေအတွက် declaration

## ဆက်လက်လေ့လာရန်

- [Type Declarations](/docs/typescript/type-declarations) — `.d.ts` files တွေနဲ့ type definitions အခြေခံ
- [Modules](/docs/typescript/modules) — module structure တွေနဲ့ import/export ပုံစံများ
