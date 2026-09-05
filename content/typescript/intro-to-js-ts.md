---
title: "Intro to JS with TS (JavaScript နဲ့ TypeScript မိတ်ဆက်)"
description: "JavaScript ကုဒ်တွေကနေ TypeScript ရဲ့ type system ဆီ ခြေလှမ်းတစ်ဆင့်ချင်း ရွေ့လျားနည်း — JSDoc type hints, @ts-check, @ts-ignore, @ts-expect-error စတဲ့ tools တွေနဲ့ စတင် type-checking လုပ်နည်း"
order: 44
source: "https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html"
status: translated
updated: 2026-09-05
---

TypeScript ရဲ့ type system က — codebase (ကုဒ်အစုအဝေး) တစ်ခုနဲ့ အလုပ်လုပ်တဲ့အခါ — strictness (တင်းကျပ်မှု) အဆင့် အမျိုးမျိုး ရှိပါတယ်:

- JavaScript code တွေမှာ inference (ခန့်မှန်းခြင်း) တစ်ခုတည်းကိုပဲ အခြေခံတဲ့ type system
- JavaScript မှာ [JSDoc ကနေတစ်ဆင့်](/docs/typescript/jsdoc-reference) incremental typing (တစ်စတစ်စ type သတ်မှတ်ခြင်း)
- JavaScript file တစ်ခုထဲမှာ `// @ts-check` ကို သုံးခြင်း
- TypeScript code
- [`strict`](https://www.typescriptlang.org/tsconfig) ဖွင့်ထားတဲ့ TypeScript

အဆင့်တစ်ခုချင်းစီက — ပိုလုံခြုံတဲ့ type system တစ်ခုဆီ ဦးတည်တဲ့ ရွေ့လျားမှုတစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒါပေမယ့် project တိုင်း — အဲဒီအဆင့်အထိ စိစစ်မှု (verification) လိုအပ်တာတော့ မဟုတ်ပါဘူး။

## TypeScript with JavaScript (JavaScript နဲ့ TypeScript တွဲသုံးခြင်း)

ဒါက — auto-complete (အလိုအလျောက် ဖြည့်ပေးခြင်း)၊ jump to symbol (symbol ဆီ ခုန်သွားခြင်း) နဲ့ rename လို refactoring tools (ဖွဲ့စည်းပုံ ပြန်စီစဉ်ရေး ကိရိယာများ) စတဲ့ tooling တွေကို ပေးစွမ်းဖို့ TypeScript ကို သုံးထားတဲ့ editor တစ်ခုကို သုံးတဲ့ အခြေအနေပါ။ [ပင်မစာမျက်နှာ](/) မှာ TypeScript plugins ပါတဲ့ editors တွေရဲ့ စာရင်းကို တွေ့နိုင်ပါတယ်။

## Providing Type Hints in JS via JSDoc (JSDoc ကနေတစ်ဆင့် JS မှာ Type Hints ပေးခြင်း)

`.js` file တစ်ခုထဲမှာ — types တွေကို မကြာခဏ infer (ခန့်မှန်း) လုပ်လို့ရပါတယ်။ Types တွေကို infer လုပ်လို့ မရတဲ့အခါမှာတော့ — JSDoc syntax ကို သုံးပြီး သတ်မှတ်လို့ရပါတယ်။

Declaration (ကြေညာချက်) တစ်ခုရဲ့ ရှေ့မှာ လာတဲ့ JSDoc annotations တွေကို — အဲဒီ declaration ရဲ့ type ကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ဥပမာ:

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

ပံ့ပိုးထားတဲ့ JSDoc patterns တွေရဲ့ စာရင်းအပြည့်အစုံကို [JSDoc Supported Types](/docs/typescript/jsdoc-reference) မှာ ရှာတွေ့နိုင်ပါတယ်။

## `@ts-check`

အပေါ်က code နမူနာရဲ့ နောက်ဆုံး line က TypeScript မှာဆိုရင် error တစ်ခု ထုတ်ပေးမှာ ဖြစ်ပေမယ့် — JS project တစ်ခုမှာတော့ default အနေနဲ့ error မထုတ်ပါဘူး။ JavaScript files တွေမှာ errors တွေကို ဖွင့်ပေးချင်ရင် — ကိုယ့်ရဲ့ `.js` files တွေရဲ့ ပထမဆုံး line မှာ `// @ts-check` ကို ထည့်လိုက်ရုံပါပဲ — TypeScript က အဲဒါကို error အဖြစ် ထုတ်ပေးပါလိမ့်မယ်။

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

Errors တွေ ထည့်ချင်တဲ့ JavaScript files တွေ အများကြီး ရှိတယ်ဆိုရင် — [`jsconfig.json`](/docs/typescript/tsconfig-json) ကို သုံးတဲ့ပုံစံဆီ ပြောင်းလို့ရပါတယ်။ File တစ်ချို့ကို check လုပ်တာ ကျော်လိုချင်ရင်တော့ — အဲဒီ files တွေထဲမှာ `// @ts-nocheck` comment တစ်ခု ထည့်ထားနိုင်ပါတယ်။

TypeScript က သင်သဘောမတူတဲ့ errors တွေကို ပြသလာနိုင်ပါတယ်။ အဲဒီလိုအခါမျိုးမှာ — error မလိုချင်တဲ့ line ရဲ့ အပေါ်က line ပေါ်မှာ `// @ts-ignore` ဒါမှမဟုတ် `// @ts-expect-error` ကို ထည့်ပြီး — သတ်မှတ်ထားတဲ့ lines တွေပေါ်က errors တွေကို လျစ်လျူရှုထားနိုင်ပါတယ်။

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // Not OK
```

TypeScript က JavaScript ကို ဘယ်လို အနက်ဖွင့် (interpret) လုပ်လဲဆိုတာ ပိုသိချင်ရင် — [How TS Type Checks JS](/docs/typescript/type-checking-javascript-files) ကို ဖတ်ကြည့်ပါ။
