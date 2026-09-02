---
title: "Kleur မှ util.styleText သို့"
description: "kleur npm package ကနေ Node.js built-in util.styleText API ဆီ ပြောင်းရွှေ့ခြင်း — kleur style calls နဲ့ kleur/colors named style functions တွေကို အသွင်ပြောင်းပုံ ဥပမာများ, လိုက်ဖက်မှုနဲ့ ကန့်သတ်ချက်များ"
order: 70
source: "https://nodejs.org/learn/userland-migrations/kleur-to-util-styletext"
status: translated
updated: 2026-09-02
---

ဒီ recipe က ပြင်ပ `kleur` package ကနေ — Node.js ရဲ့ built-in `util.styleText` API ဆီ ပြောင်းရွှေ့ပေးပါတယ်။ `kleur` style calls တွေနဲ့ `kleur/colors` ရဲ့ named style functions တွေကို — Node.js ရဲ့ native styling လုပ်ဆောင်ချက်အဖြစ် အသွင်ပြောင်းပေးပါတယ်။

## ဥပမာများ

Default import နဲ့ `kleur` style calls တွေကို ဘယ်လို ပြောင်းလဲပေးလဲဆိုတာ ကြည့်ရအောင် — `chalk` လိုပဲ style method တစ်ခုချင်းစီကို style name string ပါတဲ့ `styleText(...)` call အဖြစ် ပြောင်းပေးပြီး — chain လုပ်ထားတဲ့ styles တွေကို array တစ်ခုအဖြစ် ပေါင်းပေးပါတယ်:

```diff
- import kleur from 'kleur';
+ import { styleText } from 'node:util';
- console.log(kleur.red('Error'));
+ console.log(styleText('red', 'Error'));
- console.log(kleur.bold().red('Failure'));
+ console.log(styleText(['bold', 'red'], 'Failure'));
```

`kleur/colors` ကနေ named imports (ဥပမာ — `green`, `dim`) နဲ့ သုံးထားရင်လည်း — function တစ်ခုချင်းစီကို သက်ဆိုင်ရာ `styleText(...)` call တွေအဖြစ် ပြောင်းပေးပါတယ်:

```diff
- import { green, dim } from 'kleur/colors';
+ import { styleText } from 'node:util';
- console.log(green('OK') + ' ' + dim(name));
+ console.log(styleText('green', 'OK') + ' ' + styleText('dim', name));
```

တစ်ခုနဲ့တစ်ခု nested လုပ်ထားတဲ့ (အထဲအထဲ ထည့်ခေါ်ထားတဲ့) style functions တွေကိုလည်း — styles အားလုံးကို ပေါင်းစပ်ထားတဲ့ array တစ်ခုတည်းအဖြစ် ပြောင်းပေးနိုင်ပါတယ်:

```diff
- import { bgRed, white } from 'kleur/colors';
+ import { styleText } from 'node:util';
- console.log(bgRed(white('FAIL')));
+ console.log(styleText(['bgRed', 'white'], 'FAIL'));
```

## လိုက်ဖက်မှု (Compatibility)

- `package.json` ကနေ `kleur` dependency ကို အလိုအလျောက် ဖယ်ရှားပေးပါတယ်
- Default, namespace နဲ့ CommonJS `kleur` imports တွေကို ပံ့ပိုးပါတယ်
- `kleur/colors` ကနေ named imports တွေနဲ့ destructured requires တွေကို ပံ့ပိုးပါတယ်
- `kleur.enabled` နဲ့ `kleur/colors` က `$` လို မထောက်ခံတဲ့ APIs တွေကိုတော့ မပြောင်းဘဲ ထားပေးပါတယ်

## ကန့်သတ်ချက်များ (Limitations)

- `kleur.enabled`, `kleur/colors` က `$` နဲ့ — တိုက်ရိုက် style functions မဟုတ်တဲ့ တခြား APIs တွေအတွက်တော့ ကိုယ်တိုင် ပြောင်းရွှေ့ခြင်း (manual migration) လိုအပ်ပါတယ်

## ဆက်ဖတ်ရန်

- [Userland Migrations မိတ်ဆက်](/docs/nodejs/userland-migrations) — Node.js ရဲ့ official codemods များအကြောင်း
- [Chalk မှ util.styleText() သို့](/docs/nodejs/chalk-to-util-styletext) — `chalk` package ကနေ ပြောင်းရွှေ့ခြင်း
