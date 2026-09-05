---
title: "Modules: Theory (Modules သီအိုရီ)"
description: "JavaScript module systems တွေရဲ့ သီအိုရီ အခြေခံ — scripts vs modules, host ဆိုတာ ဘာလဲ, module output format, module resolution နဲ့ declaration files တို့ရဲ့ အခန်းကဏ္ဍ"
order: 49
source: "https://www.typescriptlang.org/docs/handbook/modules/theory.html"
status: translated
updated: 2026-09-05
---

## Scripts and modules in JavaScript (JavaScript ထဲက Scripts နဲ့ Modules)

JavaScript ရဲ့ အစောပိုင်း ကာလတွေမှာ — ဘာသာစကားက browser တွေထဲမှာပဲ အလုပ်လုပ်နေတုန်း — module ဆိုတာ မရှိခဲ့ပါဘူး။ ဒါပေမယ့် web page တစ်ခုအတွက် JavaScript ကို file အများကြီး ခွဲထားဖို့ကတော့ — HTML ထဲမှာ `script` tag တွေ အများကြီး သုံးပြီး ဖြစ်နိုင်ခဲ့ပါတယ်:

```html
<html>
  <head>
    <script src="a.js"></script>
    <script src="b.js"></script>
  </head>
  <body></body>
</html>
```

ဒီနည်းလမ်းမှာ အားနည်းချက်တွေ ရှိခဲ့ပါတယ် — အထူးသဖြင့် web pages တွေ ပိုကြီးလာပြီး ပိုရှုပ်ထွေးလာတာနဲ့အမျှပါ။ အထူးသဖြင့် — page တစ်ခုတည်းပေါ် တင်လိုက်တဲ့ scripts အားလုံးက scope တစ်ခုတည်းကို မျှဝေသုံးစွဲကြပါတယ် — “global scope” လို့ သင့်လျော်စွာ ခေါ်ဝေါ်တဲ့ scope ပါ — ဆိုလိုတာက scripts တွေက တစ်ခုနဲ့တစ်ခုရဲ့ variables တွေနဲ့ functions တွေကို မတော်တဆ မထပ်ရေးမိအောင် အလွန် သတိထားရပါတယ်။

File တွေကို ကိုယ်ပိုင် scope တစ်ခုစီ ပေးပြီး — တစ်ချိန်တည်းမှာ code အပိုင်းအစတွေကို တခြား file တွေအတွက် ရရှိနိုင်အောင် နည်းလမ်းတစ်ခုပါ ပံ့ပိုးပေးတဲ့ ဘယ် system ကိုမဆို “module system” လို့ ခေါ်နိုင်ပါတယ်။ (Module system တစ်ခုထဲက file တစ်ခုချင်းစီကို “module” လို့ ခေါ်တယ်ဆိုတာ သိသာလွန်းတယ်လို့ ထင်ရနိုင်ပေမယ့် — ဒီအသုံးအနှုန်းက module system အပြင်ဘက်၊ global scope ထဲမှာ run လုပ်တဲ့ _script_ files တွေနဲ့ ခွဲခြားပြသဖို့ မကြာခဏ သုံးပါတယ်။)

> Module system တွေ [အများကြီး ရှိပါတယ်](https://github.com/myshov/history-of-javascript/tree/master/4_evolution_of_js_modularity) — TypeScript ကလည်း [အများအပြားကို emit လုပ်တာ ထောက်ပံ့ပါတယ်](https://www.typescriptlang.org/tsconfig/#module) — ဒါပေမယ့် ဒီ documentation ကတော့ ဒီနေ့ခေတ်ရဲ့ အရေးအကြီးဆုံး system နှစ်ခုကိုပဲ အဓိက အာရုံစိုက်သွားမှာ ဖြစ်ပါတယ်: ECMAScript modules (ESM) နဲ့ CommonJS (CJS) တို့ပါ။
>
> ECMAScript Modules (ESM) က ဘာသာစကားထဲမှာတင် တည်ဆောက်ထားတဲ့ module system ဖြစ်ပြီး — ခေတ်မီ browser တွေရော Node.js v12 ကစပြီးရော ထောက်ပံ့ပါတယ်။ ဒါက သီးသန့် `import` နဲ့ `export` syntax တွေကို သုံးပါတယ်:
>
> ```js
> // a.js
> export default "Hello from a.js";
> ```
>
> ```js
> // b.js
> import a from "./a.js";
> console.log(a); // 'Hello from a.js'
> ```
>
> CommonJS (CJS) ကတော့ — ESM က ဘာသာစကားရဲ့ specification ထဲ မပါသေးခင်က — Node.js ထဲမှာ မူလ ပါဝင်လာခဲ့တဲ့ module system ပါ။ ESM နဲ့အတူ Node.js မှာ ဒီနေ့ထိ ဆက်လက် ထောက်ပံ့နေဆဲ ဖြစ်ပါတယ်။ ဒါက `exports` နဲ့ `require` လို့ နာမည်ရှိတဲ့ ရိုးရိုး JavaScript objects တွေနဲ့ functions တွေကို သုံးပါတယ်:
>
> ```js
> // a.js
> exports.message = "Hello from a.js";
> ```
>
> ```js
> // b.js
> const a = require("./a");
> console.log(a.message); // 'Hello from a.js'
> ```

ဒါကြောင့် — TypeScript က file တစ်ခုကို CommonJS ဒါမှမဟုတ် ECMAScript module တစ်ခုအဖြစ် သိရှိတဲ့အခါ — အဲဒီ file မှာ ကိုယ်ပိုင် scope ရှိမယ်လို့ ဦးစွာ ယူဆပါတယ်။ ဒါပေမယ့် အဲဒီကနေ လွန်ပြီး — compiler ရဲ့ အလုပ်က နည်းနည်း ပိုရှုပ်ထွေးလာပါတယ်။

## TypeScript’s job concerning modules (Modules နဲ့ ပတ်သက်တဲ့ TypeScript ရဲ့ တာဝန်)

TypeScript compiler ရဲ့ အဓိက ရည်ရွယ်ချက်က — runtime errors တစ်ချို့ကို compile time မှာ ကြိုတင် ဖမ်းမိခြင်းအားဖြင့် ကာကွယ်ဖို့ပါ။ Modules ပါတာ မပါတာပဲ — compiler က code ရဲ့ ရည်ရွယ်ထားတဲ့ runtime environment အကြောင်း သိထားဖို့ လိုပါတယ် — ဥပမာ ဘယ် globals တွေ ရနိုင်လဲဆိုတာမျိုးပါ။ Modules တွေ ပါလာတဲ့အခါ — သူ့အလုပ်ကို လုပ်နိုင်ဖို့ compiler က ဖြေရှင်းရမယ့် နောက်ထပ် မေးခွန်းတွေ အများကြီး ရှိလာပါတယ်။ ဒါကို ခွဲခြမ်းစိတ်ဖြာဖို့ လိုအပ်တဲ့ အချက်အလက် အားလုံးအကြောင်း စဉ်းစားကြည့်ဖို့ input code စာကြောင်း အနည်းငယ်ကို ဥပမာအဖြစ် သုံးကြည့်ရအောင်:

```ts
import sayHello from "greetings";
sayHello("world");
```

ဒီ file ကို check လုပ်ဖို့ — compiler က `sayHello` ရဲ့ type ကို သိထားဖို့ လိုပါတယ် (string argument တစ်ခု လက်ခံနိုင်တဲ့ function တစ်ခုလား?) — အဲဒါက နောက်ထပ် မေးခွန်း အတော်များများ ဖွင့်ပေးပါတယ်:

1. Module system က ဒီ TypeScript file ကို တိုက်ရိုက် load လုပ်မှာလား — ဒါမှမဟုတ် ငါ (ဒါမှမဟုတ် တခြား compiler တစ်ခု) ဒီ TypeScript file ကနေ generate လုပ်ထားတဲ့ JavaScript file တစ်ခုကို load လုပ်မှာလား?
2. Module system က load လုပ်မယ့် file ရဲ့ နာမည်နဲ့ disk ပေါ်က တည်နေရာအရ — ဘယ်လို module _အမျိုးအစား (kind)_ မျိုးကို မျှော်လင့်ရမလဲ?
3. Output JavaScript emit လုပ်နေတယ်ဆိုရင် — ဒီ file ထဲက module syntax ကို output code ထဲမှာ ဘယ်လို ပြောင်းလဲ (transform) မလဲ?
4. Module system က `"greetings"` လို့ သတ်မှတ်ထားတဲ့ module ကို ရှာဖို့ ဘယ်နေရာတွေကို ကြည့်မလဲ? ရှာဖွေမှု အောင်မြင်မလား?
5. အဲဒီ ရှာဖွေမှုကနေ တွေ့ရှိလာတဲ့ file က ဘယ်လို module အမျိုးအစားလဲ?
6. Module system က (2) မှာ သိရှိရတဲ့ module အမျိုးအစားကို — (3) မှာ ဆုံးဖြတ်ထားတဲ့ syntax နဲ့ — (5) မှာ သိရှိရတဲ့ module အမျိုးအစားကို ရည်ညွှန်းခွင့် ပြုမလား?
7. `"greetings"` module ကို ခွဲခြမ်းစိတ်ဖြာပြီးတာနဲ့ — အဲဒီ module ရဲ့ ဘယ်အပိုင်းက `sayHello` ဆီ ချိတ်ဆက်သွားမလဲ?

ဒီမေးခွန်းတွေ အားလုံးက _host_ ရဲ့ လက္ခဏာတွေပေါ်မှာ မူတည်နေတာ သတိပြုပါ — host ဆိုတာက output JavaScript (ဒါမှမဟုတ် ကိစ္စအလိုက် raw TypeScript) ကို နောက်ဆုံးမှာ စားသုံးပြီး module loading အပြုအမူကို ဦးတည် ထိန်းချုပ်တဲ့ စနစ်ပါ — ပုံမှန်အားဖြင့် runtime (Node.js လိုမျိုး) ဒါမှမဟုတ် bundler (Webpack လိုမျိုး) တစ်ခုခု ဖြစ်ပါတယ်။

ECMAScript specification က ESM imports တွေနဲ့ exports တွေ တစ်ခုနဲ့တစ်ခု ဘယ်လို ချိတ်ဆက်ကြတယ်ဆိုတာကို သတ်မှတ်ပေးပေမယ့် — (4) ထဲက file ရှာဖွေမှု၊ _module resolution_ လို့ လူသိများတဲ့ အရာ ဘယ်လို ဖြစ်ပျက်တယ်ဆိုတာကိုတော့ မသတ်မှတ်ပေးပါဘူး — ပြီးတော့ CommonJS လိုမျိုး တခြား module systems တွေအကြောင်းလည်း ဘာမှ မပြောပါဘူး။ ဒါကြောင့် runtimes တွေရော bundlers တွေရော — အထူးသဖြင့် ESM ရော CJS ရော နှစ်မျိုးလုံးကို ထောက်ပံ့ချင်တဲ့သူတွေက — ကိုယ်ပိုင် rules တွေ ဒီဇိုင်းဆွဲဖို့ လွတ်လပ်မှု အများကြီး ရှိပါတယ်။ အကျိုးဆက်အနေနဲ့ — TypeScript က အပေါ်က မေးခွန်းတွေကို ဘယ်လို ဖြေသင့်လဲဆိုတာ — code ကို ဘယ်နေရာမှာ run ဖို့ ရည်ရွယ်ထားလဲပေါ် မူတည်ပြီး အလွန် ကွဲပြားနိုင်ပါတယ်။ အဖြေမှန် တစ်ခုတည်း ဆိုတာ မရှိပါဘူး — ဒါကြောင့် compiler ကို configuration options တွေကနေတစ်ဆင့် စည်းမျဉ်းတွေ ပြောပြထားဖို့ လိုအပ်ပါတယ်။

နောက်ထပ် သတိထားရမယ့် အဓိက အချက်က — TypeScript က ဒီမေးခွန်းတွေကို သူ့ရဲ့ _output_ JavaScript files တွေရဲ့ ရှုထောင့်ကနေ အမြဲလိုလို တွေးပါတယ် — _input_ TypeScript (ဒါမှမဟုတ် JavaScript!) files တွေကနေ မဟုတ်ပါဘူး။ ဒီနေ့ခေတ်မှာ runtimes တချို့နဲ့ bundlers တချို့က TypeScript files တွေကို တိုက်ရိုက် load လုပ်တာ ထောက်ပံ့ကြပြီး — အဲဒီလို ကိစ္စတွေမှာ input နဲ့ output files ဆိုပြီး သီးခြား တွေးဖို့က အဓိပ္ပာယ် မရှိပါဘူး။ ဒီ document အများစုကတော့ TypeScript files တွေကို JavaScript files တွေအဖြစ် compile လုပ်ပြီး — အဲဒီ JavaScript files တွေကို runtime module system က ပြန် load လုပ်တဲ့ ကိစ္စတွေကို ဆွေးနွေးထားပါတယ်။ ဒီကိစ္စတွေကို လေ့လာတာက compiler ရဲ့ options တွေနဲ့ အပြုအမူတွေကို နားလည်တည်ဆောက်ဖို့ မရှိမဖြစ် လိုအပ်ပါတယ် — esbuild ၊ Bun နဲ့ တခြား [TypeScript-first runtimes နဲ့ bundlers](https://www.typescriptlang.org/docs/handbook/modules) တွေအကြောင်း တွေးတဲ့အခါ အဲဒီကနေ စတင်ပြီး ရိုးရှင်းအောင် လုပ်ရတာ ပိုလွယ်ပါတယ်။ ဒါကြောင့် ခုလောလောဆယ် — modules နဲ့ ပတ်သက်တဲ့ TypeScript ရဲ့ အလုပ်ကို output files တွေရဲ့ ရှုထောင့်ကနေ ဒီလို အကျဉ်းချုပ် နိုင်ပါတယ်:

Host ရဲ့ **rules တွေကို** လုံလောက်အောင် နားလည်ပါ

1. file တွေကို တရားဝင်တဲ့ **output module format** တစ်ခုအဖြစ် compile လုပ်ဖို့၊
2. အဲဒီ **outputs** တွေထဲက imports တွေ **အောင်မြင်စွာ resolve** ဖြစ်မှာ သေချာစေဖို့၊ ပြီးတော့
3. **imported names တွေကို** ဘယ် **type** နဲ့ သတ်မှတ်ရမလဲဆိုတာ သိဖို့။

## Who is the host? (Host ဆိုတာ ဘယ်သူလဲ?)

ဆက်မရွေ့ခင် — _host_ ဆိုတဲ့ အသုံးအနှုန်းနဲ့ ပတ်သက်ပြီး တစ်ယောက်နဲ့တစ်ယောက် သဘောတူညီမှု ရှိအောင် သေချာအောင် လုပ်ထားဖို့ တန်ပါတယ် — ဘာလို့လဲဆိုတော့ ဒီအသုံးအနှုန်းက မကြာခဏ ပေါ်လာမှာမို့ပါ။ အရင်က ဒီလို သတ်မှတ်ခဲ့ပါတယ်: “output code ကို နောက်ဆုံး စားသုံးပြီး module loading အပြုအမူကို ဦးတည် ထိန်းချုပ်တဲ့ စနစ်။” တစ်နည်းပြောရရင် — TypeScript ရဲ့ module analysis က ပုံစံထုတ် (model) ဖို့ ကြိုးစားတဲ့ — TypeScript အပြင်ဘက်က စနစ်ပါ:

- Output code ကို (`tsc` ဒါမှမဟုတ် third-party transpiler တစ်ခုခုက ထုတ်လုပ်ထားတာဖြစ်ဖြစ်) Node.js လိုမျိုး runtime တစ်ခုထဲမှာ တိုက်ရိုက် run လုပ်တဲ့အခါ — runtime က host ပါ။
- Runtime တစ်ခုက TypeScript files တွေကို တိုက်ရိုက် စားသုံးလို့ “output code” ဆိုတာ မရှိတဲ့အခါ — runtime ကိုယ်တိုင်က host ပဲ ဖြစ်ပါတယ်။
- Bundler တစ်ခုက TypeScript inputs တွေ ဒါမှမဟုတ် outputs တွေကို စားသုံးပြီး bundle တစ်ခု ထုတ်လုပ်တဲ့အခါ — bundler က host ပါ — ဘာလို့လဲဆိုတော့ သူက မူရင်း imports/requires အစုအဝေးကို ကြည့်ပြီး၊ သူတို့ ရည်ညွှန်းတဲ့ file တွေကို ရှာဖွေပြီး၊ မူရင်း imports တွေနဲ့ requires တွေ မှတ်မိနိုင်လောက်အောင် မရှိတော့အောင် ဖျောက်ပစ် (သို့) ပြောင်းလဲပစ်ထားတဲ့ file အသစ် (သို့) file အစုတစ်ခုကို ထုတ်လုပ်လို့ပါ။ (အဲဒီ bundle ကိုယ်တိုင်က modules တွေ ပါဝင်နိုင်ပြီး — အဲဒါကို run လုပ်တဲ့ runtime ကလည်း သူ့ရဲ့ host ဖြစ်မှာပါ — ဒါပေမယ့် bundler နောက်ပိုင်း ဖြစ်ပျက်သမျှကို TypeScript က မသိပါဘူး။)
- တခြား transpiler ၊ optimizer ဒါမှမဟုတ် formatter တစ်ခုက TypeScript ရဲ့ outputs တွေပေါ်မှာ အလုပ်လုပ်ရင် — သူက မြင်ရတဲ့ imports တွေနဲ့ exports တွေကို ဒီအတိုင်း ချန်ထားသရွေ့ — ဒါက TypeScript ဂရုစိုက်တဲ့ host တစ်ခု _မဟုတ်ပါဘူး_။
- Web browser တစ်ခုထဲမှာ modules တွေ load လုပ်တဲ့အခါ — TypeScript က ပုံစံထုတ်ဖို့ လိုတဲ့ အပြုအမူတွေက တကယ်တော့ web server နဲ့ browser ထဲမှာ run နေတဲ့ module system ကြားမှာ ခွဲဝေထားပါတယ်။ Browser ရဲ့ JavaScript engine (ဒါမှမဟုတ် RequireJS လိုမျိုး script-based module-loading framework) က ဘယ် module formats တွေ လက်ခံမလဲဆိုတာကို ထိန်းချုပ်ပြီး — web server ကတော့ module တစ်ခုက နောက်တစ်ခုကို load ဖို့ request လုပ်တဲ့အခါ ဘယ် file ကို ပို့မလဲဆိုတာ ဆုံးဖြတ်ပါတယ်။
- TypeScript compiler ကိုယ်တိုင်ကတော့ host မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ တခြား hosts တွေကို ပုံစံထုတ်ဖို့ ကြိုးစားတာအပြင် modules နဲ့ ပတ်သက်တဲ့ ဘယ် အပြုအမူကိုမှ သူ မပံ့ပိုးပေးလို့ပါ။

## The module output format (Module output format)

Project တိုင်းမှာ — modules အကြောင်း ဦးစွာ ဖြေရှင်းရမယ့် ပထမဆုံး မေးခွန်းက — host က ဘယ်လို module အမျိုးအစားတွေကို မျှော်လင့်လဲဆိုတာပါ — ဒါမှ TypeScript က file တစ်ခုချင်းစီအတွက် သူ့ရဲ့ output format ကို ကိုက်ညီအောင် သတ်မှတ်နိုင်မှာပါ။ တစ်ခါတလေ host က module အမျိုးအစား တစ်ခုတည်းကိုပဲ _ထောက်ပံ့ပါတယ်_ — ဥပမာ browser ထဲမှာ ESM ၊ Node.js v11 နဲ့ အစောပိုင်း ဗားရှင်းတွေမှာ CJS ဆိုတာမျိုးပါ။ Node.js v12 နဲ့ နောက်ပိုင်းကတော့ CJS ရော ES modules ရော နှစ်မျိုးလုံး လက်ခံပေမယ့် — file တစ်ခုချင်းစီအတွက် ဘယ် format ဖြစ်သင့်လဲဆိုတာ ဆုံးဖြတ်ဖို့ file extensions တွေနဲ့ `package.json` files တွေကို သုံးပြီး — file ရဲ့ ပါဝင်မှုတွေက မျှော်လင့်ထားတဲ့ format နဲ့ မကိုက်ညီရင် error ပစ်ပါတယ်။

`module` compiler option က ဒီအချက်အလက်ကို compiler ဆီ ပေးပါတယ်။ သူ့ရဲ့ အဓိက ရည်ရွယ်ချက်က compilation အတွင်း emit လုပ်တဲ့ JavaScript တစ်ခုခုရဲ့ module format ကို ထိန်းချုပ်ဖို့ပါ — ဒါပေမယ့် file တစ်ခုချင်းစီရဲ့ module အမျိုးအစားကို ဘယ်လို သိရှိရမလဲ၊ module အမျိုးအစား မတူတာတွေ တစ်ခုနဲ့တစ်ခု import လုပ်ခွင့် ရှိ/မရှိ၊ `import.meta` နဲ့ top-level `await` လိုမျိုး features တွေ ရနိုင်/မရနိုင်ဆိုတာတွေကိုလည်း compiler ကို အသိပေးပါတယ်။ ဒါကြောင့် — TypeScript project တစ်ခုက `noEmit` သုံးနေရင်တောင် `module` အတွက် မှန်ကန်တဲ့ setting ရွေးတာက အရေးကြီးနေဆဲပါ။ အစောက ဖော်ပြခဲ့သလို — compiler က imports တွေကို type check လုပ်ဖို့ (ပြီးတော့ IntelliSense ပေးဖို့) module system ကို တိကျစွာ နားလည်ထားဖို့ လိုပါတယ်။ သင့် project အတွက် မှန်ကန်တဲ့ `module` setting ရွေးချယ်ခြင်းဆိုင်ရာ လမ်းညွှန်ချက်အတွက် [_compiler options ရွေးချယ်ခြင်း_](/docs/typescript/modules-choosing-compiler-options) ကို ကြည့်ပါ။

ရနိုင်တဲ့ `module` settings တွေကတော့

- [**`node16`**](/docs/typescript/modules-reference): Node.js v16+ ရဲ့ module system ကို ရောင်ပြန်ဟပ်ပါတယ် — ES modules တွေရော CJS modules တွေရော သီးခြား interoperability နဲ့ detection rules တွေနဲ့အတူ ဘေးချင်းကပ် တည်ရှိနေတာကို ထောက်ပံ့ပါတယ်။
- [**`node18`**](/docs/typescript/modules-reference): Node.js v18+ ရဲ့ module system ကို ရောင်ပြန်ဟပ်ပါတယ် — import attributes တွေအတွက် ထောက်ပံ့မှု ထပ်ဖြည့်ထားပါတယ်။
- [**`nodenext`**](/docs/typescript/modules-reference): Node.js ရဲ့ module system ပြောင်းလဲတာနဲ့အမျှ — နောက်ဆုံးပေါ် Node.js versions တွေကို ရောင်ပြန်ဟပ်နေတဲ့ ရွေ့လျားနေတဲ့ ပစ်မှတ်တစ်ခုပါ။ TypeScript 5.8 အရ — `nodenext` က ECMAScript modules တွေရဲ့ `require` ကို ထောက်ပံ့ပါတယ်။
- [**`es2015`**](/docs/typescript/modules-reference): JavaScript modules တွေအတွက် ES2015 ဘာသာစကား specification ကို ရောင်ပြန်ဟပ်ပါတယ် (ဘာသာစကားထဲကို `import` နဲ့ `export` ကို ပထမဆုံး မိတ်ဆက်ပေးခဲ့တဲ့ version ပါ)။
- [**`es2020`**](/docs/typescript/modules-reference): `es2015` ကို `import.meta` နဲ့ `export * as ns from "mod"` အတွက် ထောက်ပံ့မှု ထပ်ဖြည့်ပါတယ်။
- [**`es2022`**](/docs/typescript/modules-reference): `es2020` ကို top-level `await` အတွက် ထောက်ပံ့မှု ထပ်ဖြည့်ပါတယ်။
- [**`esnext`**](/docs/typescript/modules-reference): လောလောဆယ် `es2022` နဲ့ တူညီပေမယ့် — နောက်ဆုံးပေါ် ECMAScript specifications တွေကိုရော — လာမယ့် specification versions တွေမှာ ပါဝင်ဖို့ မျှော်လင့်ရတဲ့ module-related Stage 3+ proposals တွေကိုပါ ရောင်ပြန်ဟပ်မယ့် ရွေ့လျားနေတဲ့ ပစ်မှတ်တစ်ခု ဖြစ်ပါလိမ့်မယ်။
- **[`commonjs`](/docs/typescript/modules-reference), [`system`](/docs/typescript/modules-reference), [`amd`](/docs/typescript/modules-reference), and [`umd`](/docs/typescript/modules-reference)**: တစ်ခုချင်းစီက နာမည်ပေးထားတဲ့ module system ထဲမှာ အရာအားလုံးကို emit လုပ်ပြီး — အရာအားလုံး အဲဒီ module system ထဲကို အောင်မြင်စွာ import လုပ်လို့ ရတယ်လို့ ယူဆပါတယ်။ ဒါတွေက project အသစ်တွေအတွက် အကြံပြုမထားတော့ဘဲ — ဒီ documentation မှာလည်း အသေးစိတ် ဖော်ပြမှာ မဟုတ်ပါဘူး။

> Node.js မှာ run မယ့် projects တွေအတွက် — file တွေ အားလုံး `tsc` က emit လုပ်ထားတာ ESM ဒါမှမဟုတ် CJS ဖြစ်နေရင်တောင် — `module` ကို `esnext` ဒါမှမဟုတ် `commonjs` လို့ သတ်မှတ်တာက Node.js ရဲ့ module format detection နဲ့ interoperability rules တွေအရ မမှန်ကန်ပါဘူး။ Node.js မှာ run ဖို့ ရည်ရွယ်ထားတဲ့ projects တွေအတွက် မှန်ကန်တဲ့ `module` settings တွေက `node16` နဲ့ `nodenext` ပဲ ဖြစ်ပါတယ်။ All-ESM Node.js project တစ်ခုရဲ့ emitted JavaScript က `esnext` နဲ့ `nodenext` သုံးတဲ့ compilations နှစ်ခုလုံးမှာ တူတူပဲ ကြည့်ရနိုင်ပေမယ့် — type checking ကတော့ ကွဲပြားနိုင်ပါတယ်။ အသေးစိတ်အတွက် [`nodenext` ရဲ့ reference section](/docs/typescript/modules-reference) ကို ကြည့်ပါ။

### Module format detection (Module format သိရှိခြင်း)

Node.js က ES modules ရော CJS modules ရော နှစ်မျိုးလုံး နားလည်ပေမယ့် — file တစ်ခုချင်းစီရဲ့ format ကို သူ့ရဲ့ file extension နဲ့ — file ရဲ့ directory နဲ့ ရှေ့ဆက် ancestor directories အားလုံးကို ရှာဖွေရာမှာ ပထမဆုံး တွေ့ရတဲ့ `package.json` file ရဲ့ `type` field တို့က ဆုံးဖြတ်ပါတယ်:

- `.mjs` နဲ့ `.cjs` files တွေကို အမြဲတမ်း ES modules တွေနဲ့ CJS modules တွေအဖြစ် အသီးသီး အနက်ဖွင့်ပါတယ်။
- `.js` files တွေကို — အနီးဆုံး `package.json` file ထဲမှာ `"module"` ဆိုတဲ့ တန်ဖိုးရှိတဲ့ `type` field တစ်ခု ပါရင် — ES modules တွေအဖြစ် အနက်ဖွင့်ပါတယ်။ `package.json` file မရှိဘူးဆိုရင်၊ ဒါမှမဟုတ် `type` field ပျောက်နေတယ် (သို့) တခြား တန်ဖိုးတစ်ခုခု ဖြစ်နေရင် — `.js` files တွေကို CJS modules တွေအဖြစ် အနက်ဖွင့်ပါတယ်။

ဒီ rules တွေအရ file တစ်ခုကို ES module တစ်ခုလို့ သတ်မှတ်လိုက်ရင် — Node.js က evaluation အတွင်း CommonJS ရဲ့ `module` နဲ့ `require` objects တွေကို file ရဲ့ scope ထဲ ထိုးသွင်းမှာ မဟုတ်တော့ပါဘူး — ဒါကြောင့် သူတို့ကို သုံးဖို့ ကြိုးစားတဲ့ file တစ်ခုက crash ဖြစ်စေပါလိမ့်မယ်။ အပြန်အလှန်အနေနဲ့ — file တစ်ခုကို CJS module တစ်ခုလို့ သတ်မှတ်လိုက်ရင် — အဲဒီ file ထဲက `import` နဲ့ `export` declarations တွေက syntax error crash တစ်ခု ဖြစ်စေပါတယ်။

`module` compiler option ကို `node16` ၊ `node18` ဒါမှမဟုတ် `nodenext` လို့ သတ်မှတ်ထားတဲ့အခါ — TypeScript က ဒီ algorithm အတိုင်းပဲ project ရဲ့ _input_ files တွေပေါ်မှာ ကျင့်သုံးပြီး — သက်ဆိုင်တဲ့ _output_ file တစ်ခုချင်းစီရဲ့ module အမျိုးအစားကို ဆုံးဖြတ်ပါတယ်။ `--module nodenext` သုံးထားတဲ့ ဥပမာ project တစ်ခုမှာ module formats တွေ ဘယ်လို သိရှိလဲဆိုတာ ကြည့်ကြရအောင်:

| Input file နာမည် | Contents (ပါဝင်မှု) | Output file နာမည် | Module kind | Reason (အကြောင်းရင်း) |
| -------------------------------- | ---------------------- | ---------------- | ----------- | --------------------------------------- |
| `/package.json`                  | `{}`                   |                  |             |                                         |
| `/main.mts`                      |                        | `/main.mjs`      | ESM         | File extension                          |
| `/utils.cts`                     |                        | `/utils.cjs`     | CJS         | File extension                          |
| `/example.ts`                    |                        | `/example.js`    | CJS         | No `"type": "module"` in `package.json` |
| `/node_modules/pkg/package.json` | `{ "type": "module" }` |                  |             |                                         |
| `/node_modules/pkg/index.d.ts`   |                        |                  | ESM         | `"type": "module"` in `package.json`    |
| `/node_modules/pkg/index.d.cts`  |                        |                  | CJS         | File extension                          |

Input file extension က `.mts` ဒါမှမဟုတ် `.cts` ဖြစ်တဲ့အခါ — TypeScript က အဲဒီ file ကို ES module ဒါမှမဟုတ် CJS module အဖြစ် အသီးသီး သဘောထားဖို့ သိပါတယ် — ဘာလို့လဲဆိုတော့ Node.js က output `.mjs` file ကို ES module အဖြစ် ဒါမှမဟုတ် output `.cjs` file ကို CJS module အဖြစ် သဘောထားမှာမို့ပါ။ Input file extension က `.ts` ဖြစ်တဲ့အခါ — TypeScript က module format ကို ဆုံးဖြတ်ဖို့ အနီးဆုံး `package.json` file ကို တိုင်ပင်ရပါတယ် — ဘာလို့လဲဆိုတော့ Node.js က output `.js` file ကို တွေ့တဲ့အခါ ဒါပဲ လုပ်မှာမို့ပါ။ (`pkg` dependency ထဲက `.d.cts` နဲ့ `.d.ts` declaration files တွေမှာလည်း ဒီ rules တွေပဲ သက်ရောက်တာ သတိပြုပါ: ဒီ compilation ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ output file တစ်ခု ထုတ်လုပ်မှာ မဟုတ်ပေမယ့် — `.d.ts` file တစ်ခု ရှိနေခြင်းက သက်ဆိုင်တဲ့ `.js` file တစ်ခုရဲ့ တည်ရှိမှုကို _ဆိုလိုပါတယ်_ — `pkg` library ရဲ့ author က သူတို့ရဲ့ ကိုယ်ပိုင် input `.ts` file တစ်ခုပေါ်မှာ `tsc` run လုပ်တုန်းက ဖန်တီးခဲ့တာမျိုးပါ — အဲဒီ `.js` file ကို Node.js က ES module အဖြစ် အနက်ဖွင့်ရပါတယ် — ဘာလို့လဲဆိုတော့ သူ့ရဲ့ `.js` extension နဲ့ `/node_modules/pkg/package.json` ထဲမှာ `"type": "module"` field ရှိနေလို့ပါ။ Declaration files တွေကို [နောက်ပိုင်း section](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခုမှာ ပိုပြီး အသေးစိတ် ဖော်ပြထားပါတယ်။)

Input files တွေရဲ့ သိရှိရတဲ့ module format ကို TypeScript က — output file တစ်ခုချင်းစီထဲမှာ Node.js မျှော်လင့်တဲ့ output syntax ကို သူ emit လုပ်ကြောင်း သေချာစေဖို့ သုံးပါတယ်။ TypeScript က `/example.js` ကို `import` နဲ့ `export` statements တွေနဲ့ emit လုပ်မိခဲ့ရင် — Node.js က file ကို parse လုပ်တဲ့အခါ crash ဖြစ်မှာပါ။ TypeScript က `/main.mjs` ကို `require` calls တွေနဲ့ emit လုပ်မိခဲ့ရင် — Node.js က evaluation အတွင်း crash ဖြစ်မှာပါ။ Emit အပြင် — module format ကို type checking နဲ့ module resolution အတွက် rules တွေ ဆုံးဖြတ်ဖို့လည်း သုံးပါတယ် — ဒါတွေကို နောက် sections တွေမှာ ဆွေးနွေးသွားပါမယ်။

TypeScript 5.6 ကစပြီး — တခြား `--module` modes တွေ (`esnext` နဲ့ `commonjs` လိုမျိုး) ကလည်း format-specific file extensions (`.mts` နဲ့ `.cts`) တွေကို emit format အတွက် file-level override တစ်ခုအနေနဲ့ လေးစား လိုက်နာပါတယ်။ ဥပမာ — `main.mts` လို့ နာမည်ရှိတဲ့ file တစ်ခုက `--module` ကို `commonjs` လို့ သတ်မှတ်ထားရင်တောင် ESM syntax ကို `main.mjs` ထဲကို emit လုပ်ပါတယ်။

ထပ်ပြီး ဖော်ပြချင်တာက — `--module node16` ၊ `--module node18` နဲ့ `--module nodenext` တွေထဲက TypeScript ရဲ့ အပြုအမူက Node.js ရဲ့ အပြုအမူကြောင့်ပဲ လုံးဝ လှုံ့ဆော်ခံထားရတာပါ။ TypeScript ရဲ့ ရည်ရွယ်ချက်က compile time မှာ ဖြစ်နိုင်ခြေရှိတဲ့ runtime errors တွေကို ဖမ်းဖို့ ဖြစ်တာမို့ — runtime မှာ ဘာဖြစ်မယ်ဆိုတဲ့ အလွန် တိကျတဲ့ ပုံစံတစ်ခု လိုအပ်ပါတယ်။ Module အမျိုးအစား သိရှိခြင်းအတွက် ဒီလောက် ရှုပ်ထွေးတဲ့ rules အစုအဝေးက Node.js မှာ run မယ့် code တွေကို check လုပ်ဖို့ _လိုအပ်_ ပေမယ့် — Node.js မဟုတ်တဲ့ hosts တွေမှာ ကျင့်သုံးမယ်ဆိုရင် အလွန် တင်းကျပ်လွန်း (ဒါမှမဟုတ် ရိုးရိုး မမှန်ကန်) နိုင်ပါတယ်။

### Input module syntax (Input module syntax)

Input source files တွေထဲမှာ မြင်ရတဲ့ _input_ module syntax က JS files တွေဆီ emit လုပ်တဲ့ output module syntax နဲ့ အနည်းငယ် သီးခြား ခွဲထားတယ်ဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ်။ ဆိုလိုတာက — ESM import တစ်ခု ပါတဲ့ file တစ်ခု:

```ts
import { sayHello } from "greetings";
sayHello("world");
```

က ESM format နဲ့ဆိုရင် မူရင်းအတိုင်း အတိအကျ emit လုပ်ခံရနိုင်သလို — ဒါမှမဟုတ် CommonJS အဖြစ်လည်း emit လုပ်ခံရနိုင်ပါတယ်:

```ts
Object.defineProperty(exports, "__esModule", { value: true });
const greetings_1 = require("greetings");
(0, greetings_1.sayHello)("world");
```

ဒါက `module` compiler option (ပြီးတော့ `module` option က module အမျိုးအစား တစ်ခုထက် ပိုပြီး ထောက်ပံ့တယ်ဆိုရင် — သက်ဆိုင်ရာ [module format detection](https://www.typescriptlang.org/docs/handbook/modules) rules တွေ) ပေါ်မှာ မူတည်ပါတယ်။ ယေဘုယျအားဖြင့် ဆိုရရင် — input file တစ်ခုရဲ့ ပါဝင်မှုတွေကို ကြည့်ရုံနဲ့ သူက ES module လား CJS module လားဆိုတာ ဆုံးဖြတ်ဖို့ မလုံလောက်ပါဘူး။

> ဒီနေ့ခေတ်မှာ TypeScript files အများစုကို output format ဘယ်လိုပဲ ဖြစ်ဖြစ် — ESM syntax (`import` နဲ့ `export` statements) သုံးပြီး ရေးသားကြပါတယ်။ ဒါက တခြား မဟုတ်ဘဲ — ESM က ကျယ်ပြန့်တဲ့ ထောက်ပံ့မှု ရရှိဖို့ ဖြတ်သန်းခဲ့ရတဲ့ ရှည်လျားတဲ့ ခရီးရဲ့ အမွေအနှစ် (legacy) တစ်ခု ဖြစ်ပါတယ်။ ECMAScript modules တွေကို 2015 မှာ စံသတ်မှတ်ခဲ့ပြီး — 2017 မှာ browser အများစုမှာ ထောက်ပံ့ခဲ့ကာ — 2019 မှာ Node.js v12 ထဲ ရောက်ရှိခဲ့ပါတယ်။ ဒီကာလ အများစုအတွင်း — ESM က JavaScript modules တွေရဲ့ အနာဂတ်ဆိုတာ ထင်ရှားပေမယ့် — ဒါကို စားသုံးနိုင်တဲ့ runtimes တွေကတော့ အလွန် နည်းပါးခဲ့ပါတယ်။ Babel လိုမျိုး tools တွေက JavaScript ကို ESM နဲ့ ရေးသားပြီး — Node.js ဒါမှမဟုတ် browsers တွေမှာ သုံးလို့ရတဲ့ တခြား module format တစ်ခုဆီ downlevel လုပ်ဖို့ ဖြစ်နိုင်စေခဲ့ပါတယ်။ TypeScript ကလည်း လိုက်ပါ လုပ်ဆောင်ခဲ့ပြီး — ES module syntax အတွက် ထောက်ပံ့မှု ထည့်သွင်းကာ — မူရင်း CommonJS မှ ဆင်းသက်တဲ့ `import fs = require("fs")` syntax ကို [1.5 release](https://devblogs.microsoft.com/typescript/announcing-typescript-1-5/) မှာ ညင်သာစွာ အားပေးမှု ရုပ်သိမ်းခဲ့ပါတယ်။
>
> ဒီ “ESM နဲ့ ရေးပြီး ဘာကိုမဆို output လုပ်မယ်” ဆိုတဲ့ နည်းဗျူဟာရဲ့ ကောင်းကျိုးက — TypeScript က standard JavaScript syntax ကို သုံးနိုင်တာမို့ — အသစ်ဝင်လာသူတွေအတွက် ရေးသားမှု အတွေ့အကြုံ ရင်းနှီး လွယ်ကူစေပြီး — (သီအိုရီအရ) projects တွေက နောင်မှာ ESM outputs တွေကို ပစ်မှတ်ထားဖို့ စတင်တာ လွယ်ကူစေပါတယ်။ ဒါပေမယ့် သိသာထင်ရှားတဲ့ အားနည်းချက် သုံးခု ရှိပါတယ် — ESM ရော CJS modules ရော Node.js ထဲမှာ အတူယှဉ်တွဲ ရပ်တည်၊ အပြန်အလှန် ဆက်သွယ်ခွင့် ရပြီးမှပဲ အပြည့်အဝ ပေါ်လွင်လာတာတွေပါ:
>
> 1. Node.js ထဲမှာ ESM/CJS interoperability ဘယ်လို အလုပ်လုပ်မယ်ဆိုတဲ့ အစောပိုင်း ယူဆချက်တွေက မှားယွင်းခဲ့ပြီး — ဒီနေ့မှာ interoperability rules တွေက Node.js နဲ့ bundlers တွေကြားမှာတောင် ကွဲပြားနေပါတယ်။ အကျိုးဆက်အနေနဲ့ — TypeScript ထဲက modules အတွက် configuration space က ကြီးမားပါတယ်။
> 2. Input files တွေထဲက syntax တွေ အားလုံး ESM နဲ့ တူနေတဲ့အခါ — author တစ်ယောက် ဒါမှမဟုတ် code reviewer တစ်ယောက်အနေနဲ့ file တစ်ခုက runtime မှာ ဘယ်လို module အမျိုးအစားလဲဆိုတာ ခြေရာခံလို့ မလွယ်တော့ပါဘူး။ ပြီးတော့ Node.js ရဲ့ interoperability rules တွေကြောင့် — file တစ်ခုချင်းစီရဲ့ module အမျိုးအစားက အလွန် အရေးကြီးလာခဲ့ပါတယ်။
> 3. Input files တွေကို ESM နဲ့ ရေးထားတဲ့အခါ — type declaration outputs (`.d.ts` files) တွေထဲက syntax ကလည်း ESM လိုပဲ ကြည့်ရပါတယ်။ ဒါပေမယ့် သက်ဆိုင်တဲ့ JavaScript files တွေကို ဘယ် module format နဲ့မဆို emit လုပ်ထားနိုင်လို့ — TypeScript က file တစ်ခုရဲ့ module အမျိုးအစားကို သူ့ရဲ့ type declarations တွေရဲ့ ပါဝင်မှုတွေကို ကြည့်ရုံနဲ့ မပြောနိုင်ပါဘူး။ ပြီးတော့ ESM/CJS interoperability ရဲ့ သဘောသဘာဝကြောင့်ပဲ — မှန်ကန်တဲ့ types တွေ ပေးနိုင်ဖို့ရော crash ဖြစ်စေမယ့် imports တွေကို ကာကွယ်ဖို့ပါ — TypeScript က အရာအားလုံးရဲ့ module အမျိုးအစားကို သိထား_ရပါတယ်_။
>
> TypeScript 5.0 မှာ — TypeScript authors တွေ သူတို့ရဲ့ `import` နဲ့ `export` statements တွေ အတိအကျ ဘယ်လို emit ဖြစ်မယ်ဆိုတာ သိစေဖို့ — `verbatimModuleSyntax` လို့ ခေါ်တဲ့ compiler option အသစ်တစ်ခုကို မိတ်ဆက်ခဲ့ပါတယ်။ Enable လုပ်ထားတဲ့အခါ — ဒီ flag က input files တွေထဲက imports တွေနဲ့ exports တွေကို emit မလုပ်ခင် အနည်းဆုံး ပြောင်းလဲမှု ခံရမယ့် ပုံစံနဲ့ပဲ ရေးထားဖို့ လိုအပ်ပါတယ်။ ဒါကြောင့် file တစ်ခုကို ESM အဖြစ် emit လုပ်မယ်ဆိုရင် — imports တွေနဲ့ exports တွေကို ESM syntax နဲ့ ရေးထားရမှာ ဖြစ်ပြီး — CJS အဖြစ် emit လုပ်မယ်ဆိုရင် — CommonJS မှ ဆင်းသက်တဲ့ TypeScript syntax (`import fs = require("fs")` နဲ့ `export = {}`) နဲ့ ရေးထားရမှာ ဖြစ်ပါတယ်။ ဒီ setting က အများစု ESM သုံးပေမယ့် CJS files အနည်းငယ် ပါတဲ့ Node.js projects တွေအတွက် အထူး အကြံပြုပါတယ်။ လောလောဆယ် CJS ကို ပစ်မှတ်ထားပေမယ့် နောင်မှာ ESM ကို ပစ်မှတ်ထားချင်တဲ့ projects တွေအတွက်တော့ အကြံပြုမထားပါဘူး။

### ESM and CJS interoperability (ESM နဲ့ CJS အပြန်အလှန် ဆက်စပ်မှု)

ES module တစ်ခုက CommonJS module တစ်ခုကို `import` လုပ်လို့ ရလား။ ရတယ်ဆိုရင် — default import တစ်ခုက `exports` ဆီလား `exports.default` ဆီလား ချိတ်ဆက်လဲ။ CommonJS module တစ်ခုက ES module တစ်ခုကို `require` လုပ်လို့ ရလား။ CommonJS က ECMAScript specification ရဲ့ အစိတ်အပိုင်း မဟုတ်တာမို့ — ESM ကို 2015 မှာ စံသတ်မှတ်ပြီးကတည်းက runtimes တွေ၊ bundlers တွေနဲ့ transpilers တွေက ဒီမေးခွန်းတွေအတွက် ကိုယ်ပိုင် အဖြေတွေ ဖန်တီးခွင့် ရှိခဲ့ပါတယ် — ဒါကြောင့် စံသတ်မှတ်ထားတဲ့ interoperability rules အစုအဝေး ဆိုတာ မရှိပါဘူး။ ဒီနေ့မှာ runtimes အများစုနဲ့ bundlers အများစုက အကြမ်းဖျင်း အုပ်စု သုံးစု ထဲက တစ်ခုထဲကို ကျရောက်ပါတယ်:

1. **ESM-only (ESM သီးသန့်).** Browser engines လိုမျိုး runtimes တချို့က — ဘာသာစကားရဲ့ အစိတ်အပိုင်း တကယ့်အစစ်ဖြစ်တဲ့ ECMAScript Modules ကိုပဲ ထောက်ပံ့ပါတယ်။
2. **Bundler-like (Bundler ပုံစံ).** Major JavaScript engine တစ်ခုခုက ES modules တွေကို run နိုင်ခင် — Babel က သူတို့ကို CommonJS အဖြစ် transpile လုပ်ပြီး ရေးသားခွင့် ပေးခဲ့ပါတယ်။ ESM-to-CJS transpile လုပ်ထားတဲ့ ဒီ files တွေ hand-written-CJS files တွေနဲ့ အပြန်အလှန် ဆက်ဆံခဲ့ပုံက — bundlers တွေနဲ့ transpilers တွေအတွက် de facto စံ ဖြစ်လာတဲ့ သက်တောင့်သက်သာ ရှိသော (permissive) interoperability rules အစုအဝေးတစ်ခုကို ဆိုလိုခဲ့ပါတယ်။
3. **Node.js.** Node.js v20.19.0 အထိ — CommonJS modules တွေက ES modules တွေကို synchronously (`require` နဲ့) load လုပ်လို့ မရခဲ့ပါဘူး; dynamic `import()` calls တွေနဲ့ပဲ asynchronously load လုပ်နိုင်ခဲ့ပါတယ်။ ES modules တွေကတော့ CJS modules တွေကို default-import လုပ်နိုင်ပြီး — အဲဒါက `exports` ဆီပဲ အမြဲ ချိတ်ဆက်ပါတယ်။ (ဆိုလိုတာက — `__esModule` ပါတဲ့ Babel-like CJS output တစ်ခုရဲ့ default import တစ်ခုက Node.js နဲ့ bundlers တချို့ကြားမှာ မတူညီစွာ အပြုအမူ ပြုပါတယ်။)

ဒီ rules အစုအဝေးတွေထဲက ဘယ်ဟာကို ယူဆရမလဲဆိုတာ — (အထူးသဖြင့် `default` imports တွေပေါ်မှာ) မှန်ကန်တဲ့ types တွေ ပေးနိုင်ဖို့ရော runtime မှာ crash ဖြစ်မယ့် imports တွေပေါ်မှာ error ပြနိုင်ဖို့ပါ TypeScript က သိထားဖို့ လိုပါတယ်။ `module` compiler option ကို `node16` ၊ `node18` ဒါမှမဟုတ် `nodenext` လို့ သတ်မှတ်ထားတဲ့အခါ — Node.js ရဲ့ version-specific rules တွေကို ကျင့်သုံးပါတယ်။[^1] တခြား `module` settings တွေ အားလုံးက [`esModuleInterop`](/docs/typescript/modules-reference) option နဲ့ ပေါင်းတဲ့အခါ — TypeScript မှာ bundler-like interop ကို ရလဒ်အဖြစ် ပေးပါတယ်။ (`--module esnext` သုံးခြင်းက CommonJS modules တွေကို သင် _ရေးသားခြင်း_ မှ ကာကွယ်ပေးပေမယ့် — သူတို့ကို dependencies အဖြစ် _import လုပ်ခြင်း_ မှတော့ မကာကွယ်ပေးပါဘူး။ Browser ဆီ တိုက်ရိုက် သွားမယ့် code အတွက် သင့်လျော်သလို — ES module တစ်ခုက CommonJS module တစ်ခုကို import လုပ်တာကို ကာကွယ်ပေးနိုင်တဲ့ TypeScript setting ဆိုတာ လောလောဆယ် မရှိပါဘူး။)

[^1]: Node.js v20.19.0 နဲ့ နောက်ပိုင်းမှာ — ES module တစ်ခုရဲ့ `require` ကို ခွင့်ပြုပါတယ် — ဒါပေမယ့် resolve လုပ်ထားတဲ့ module နဲ့ သူ့ရဲ့ top-level imports တွေက top-level `await` ကို မသုံးဘူးဆိုမှပဲ ဖြစ်ပါတယ်။ TypeScript က ဒီ rule ကို ကျင့်သုံးဖို့ မကြိုးစားပါဘူး — ဘာလို့လဲဆိုတော့ declaration file တစ်ခုကနေ သက်ဆိုင်တဲ့ JavaScript file ထဲမှာ top-level `await` ပါမပါဆိုတာ ပြောပြနိုင်စွမ်း မရှိလို့ပါ။

### Module specifiers are not transformed by default (Module specifier တွေကို default အနေနဲ့ ပြောင်းလဲပေးမှု မရှိခြင်း)

`module` compiler option က input files တွေထဲက imports တွေနဲ့ exports တွေကို output files တွေထဲမှာ မတူညီတဲ့ module formats တွေဆီ ပြောင်းလဲ နိုင်ပေမယ့် — module _specifier_ (သင်က `import` လုပ်တဲ့ ၊ ဒါမှမဟုတ် `require` ဆီ ပေးလိုက်တဲ့ string `from`) ကိုတော့ ရေးထားတဲ့အတိုင်း အတိအကျ emit လုပ်ပါတယ်။ ဥပမာ — ဒီလို input တစ်ခု:

```ts
import { add } from "./math.mjs";
add(1, 2);
```

က ဒီလိုမျိုး emit လုပ်ခံရနိုင်သလို:

```ts
import { add } from "./math.mjs";
add(1, 2);
```

ဒါမှမဟုတ် ဒီလိုလည်း ဖြစ်နိုင်ပါတယ်:

```ts
const math_1 = require("./math.mjs");
math_1.add(1, 2);
```

`module` compiler option ပေါ်မှာ မူတည်ပါတယ် — ဒါပေမယ့် module specifier က ဘယ်လိုပဲ ဖြစ်ဖြစ် `"./math.mjs"` ပဲ ဖြစ်နေမှာပါ။ Default အနေနဲ့ — module specifiers တွေကို code ရဲ့ target runtime ဒါမှမဟုတ် bundler အတွက် အလုပ်လုပ်မယ့် ပုံစံနဲ့ ရေးထားရမှာ ဖြစ်ပြီး — အဲဒီ _output_-relative specifiers တွေကို နားလည်တာက TypeScript ရဲ့ အလုပ်ပါ။ Module specifier တစ်ခုက ရည်ညွှန်းတဲ့ file ကို ရှာဖွေတဲ့ လုပ်ငန်းစဉ်ကို _module resolution_ လို့ ခေါ်ပါတယ်။

> TypeScript 5.7 က [`--rewriteRelativeImportExtensions` option](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html) ကို မိတ်ဆက်ခဲ့ပါတယ် — ဒါက `.ts` ၊ `.tsx` ၊ `.mts` ဒါမှမဟုတ် `.cts` extensions တွေပါတဲ့ relative module specifiers တွေကို output files တွေထဲမှာ သူတို့ရဲ့ JavaScript equivalent တွေဆီ ပြောင်းလဲပေးပါတယ်။ ဒီ option က development အတွင်း Node.js ထဲမှာ တိုက်ရိုက် run လို့ရတဲ့ TypeScript files တွေ ဖန်တီးချင်သလို — distribution ဒါမှမဟုတ် production အတွက်လည်း JavaScript outputs တွေဆီ compile လုပ်ချင်တဲ့ ကိစ္စမျိုးတွေအတွက် အသုံးဝင်ပါတယ်။
>
> ဒီ documentation ကို `--rewriteRelativeImportExtensions` မမိတ်ဆက်ခင် ရေးသားခဲ့တာဖြစ်ပြီး — ဒီမှာ တင်ပြထားတဲ့ စိတ်ပိုင်းဆိုင်ရာ ပုံစံ (mental model) က — host module system က သူ့ရဲ့ input files တွေပေါ်မှာ လုပ်ဆောင်တဲ့ အပြုအမူကို ပုံစံထုတ်ခြင်းအပေါ် တည်ဆောက်ထားပါတယ် — bundler တစ်ခုက TypeScript files တွေပေါ်မှာ လုပ်ဆောင်တာဖြစ်ဖြစ်၊ runtime တစ်ခုက `.js` outputs တွေပေါ်မှာ လုပ်ဆောင်တာဖြစ်ဖြစ်ပါ။ `--rewriteRelativeImportExtensions` နဲ့ဆိုရင် — အဲဒီ စိတ်ပိုင်းဆိုင်ရာ ပုံစံကို ကျင့်သုံးရမယ့် နည်းလမ်းက — နှစ်ခါ ကျင့်သုံးဖို့ပါ: TypeScript input files တွေကို တိုက်ရိုက် process လုပ်နေတဲ့ runtime ဒါမှမဟုတ် bundler ပေါ်မှာ တစ်ခါ၊ ပြီးတော့ transform လုပ်ထားတဲ့ outputs တွေကို process လုပ်နေတဲ့ runtime ဒါမှမဟုတ် bundler ပေါ်မှာ နောက်တစ်ခါပါ။ ဒီ documentation အများစုက input files တွေ ဒါမှမဟုတ် output files တွေထဲက _တစ်ခုတည်းကိုပဲ_ load လုပ်မယ်လို့ ယူဆထားပေမယ့် — တင်ပြထားတဲ့ အခြေခံမူတွေက နှစ်ခုလုံး load လုပ်တဲ့ ကိစ္စအထိပါ တိုးချဲ့ သုံးနိုင်ပါတယ်။

## Module resolution (Module resolution — Module ရှာဖွေဖြေရှင်းခြင်း)

ကျွန်တော်တို့ရဲ့ [ပထမဆုံး ဥပမာ](https://www.typescriptlang.org/docs/handbook/modules) ဆီ ပြန်သွားပြီး — အခုထိ ဘာတွေ သင်ယူခဲ့ရပြီလဲဆိုတာ ပြန်လည် သုံးသပ်ကြည့်ရအောင်:

```ts
import sayHello from "greetings";
sayHello("world");
```

အခုထိ — host ရဲ့ module system နဲ့ TypeScript ရဲ့ `module` compiler option က ဒီ code ကို ဘယ်လို သက်ရောက်မှု ရှိနိုင်လဲဆိုတာ ဆွေးနွေးခဲ့ပါပြီ။ Input syntax က ESM လိုပဲ ကြည့်ရပေမယ့် — output format က `module` compiler option ၊ ဖြစ်နိုင်ခြေရှိတဲ့ file extension နဲ့ `package.json` ရဲ့ `"type"` field ပေါ်မှာ မူတည်တယ်ဆိုတာ သိပါတယ်။ `sayHello` က ဘာဆီ ချိတ်ဆက်သွားလဲဆိုတာ — ပြီးတော့ import ကို လုံးဝ ခွင့်ပြုလား မပြုဘူးလားဆိုတာတောင် — ဒီ file နဲ့ target file ရဲ့ module အမျိုးအစားတွေပေါ်မှာ မူတည်ပြီး ကွဲပြားနိုင်တယ်ဆိုတာလည်း သိပါတယ်။ ဒါပေမယ့် target file ကို ဘယ်လို _ရှာရမလဲ_ဆိုတာကိုတော့ အခုထိ ဆွေးနွေးမထားသေးပါဘူး။

### Module resolution is host-defined (Module resolution ကို host က သတ်မှတ်သည်)

ECMAScript specification က `import` နဲ့ `export` statements တွေကို ဘယ်လို parse လုပ်၊ အနက်ဖွင့်ရမလဲဆိုတာ သတ်မှတ်ပေးပေမယ့် — module resolution ကိုတော့ host ရဲ့ တာဝန်အဖြစ် ချန်ထားခဲ့ပါတယ်။ သင်ဟာ ခေတ်စားနေတဲ့ JavaScript runtime အသစ်တစ်ခု ဖန်တီးနေတယ်ဆိုရင် — ဒီလိုမျိုး module resolution scheme တစ်ခုကို ဖန်တီးဖို့ လွတ်လပ်ခွင့် ရှိပါတယ်:

```ts
import monkey from "🐒"; // Looks for './eats/bananas.js'
import cow from "🐄";    // Looks for './eats/grass.js'
import lion from "🦁";   // Looks for './eats/you.js'
```

ပြီးတော့ “standards-compliant ESM” ကို အကောင်အထည် ဖော်ထားတယ်လို့လည်း ပြောနိုင်ပါသေးတယ်။ ဒီ runtime ရဲ့ module resolution algorithm အကြောင်း built-in အသိပညာ မရှိရင် — TypeScript က `monkey` ၊ `cow` နဲ့ `lion` တွေအတွက် ဘယ် types တွေ သတ်မှတ်ရမလဲဆိုတာ လုံးဝ မသိနိုင်ဘူးဆိုတာ ပြောစရာတောင် မလိုပါဘူး။ `module` က compiler ကို host ရဲ့ မျှော်လင့်ထားတဲ့ module format အကြောင်း အသိပေးသလိုပဲ — `moduleResolution` က customization options အနည်းငယ်နဲ့အတူ — module specifiers တွေကို files တွေဆီ resolve လုပ်ဖို့ host သုံးတဲ့ algorithm ကို သတ်မှတ်ပေးပါတယ်။ ဒါက TypeScript က emit အတွင်း import specifiers တွေကို ဘာလို့ ပြုပြင်မွမ်းမံမလဲဆိုတာကိုလည်း ရှင်းလင်းစေပါတယ်: import specifier တစ်ခုနဲ့ disk ပေါ်က file တစ်ခုကြားက ဆက်စပ်မှုက (တစ်ခု တကယ် ရှိခဲ့ရင်) host က သတ်မှတ်တာဖြစ်ပြီး — TypeScript က host မဟုတ်လို့ပါ။

ရနိုင်တဲ့ `moduleResolution` options တွေကတော့:

- [**`classic`**](/docs/typescript/modules-reference): TypeScript ရဲ့ ရှေးအကျဆုံး module resolution mode ပါ — `module` ကို `commonjs` ၊ `node16` ဒါမှမဟုတ် `nodenext` ကလွဲပြီး တခြားဟာ သတ်မှတ်ထားရင် ကံမကောင်းစွာပဲ ဒါက default ဖြစ်နေပါတယ်။ [RequireJS](https://requirejs.org/docs/api.html#packages) configurations အမျိုးမျိုးအတွက် best-effort resolution တစ်ခု ပေးဖို့ ဖန်တီးထားခဲ့တာ ဖြစ်နိုင်ပါတယ်။ Project အသစ်တွေမှာ (RequireJS ဒါမှမဟုတ် တခြား AMD module loader တစ်ခုခု မသုံးတဲ့ project အဟောင်းတွေမှာတောင်) မသုံးသင့်ဘဲ — TypeScript 6.0 မှာ deprecation လုပ်ဖို့ စီစဉ်ထားပါတယ်။
- [**`node10`**](/docs/typescript/modules-reference): အရင်က `node` လို့ လူသိများခဲ့ပြီး — `module` ကို `commonjs` လို့ သတ်မှတ်ထားရင် ကံမကောင်းစွာပဲ ဒါက default ဖြစ်ပါတယ်။ Node.js v12 ထက် အဟောင်းဖြစ်တဲ့ ဗားရှင်းတွေရဲ့ အတော်လေး ကောင်းတဲ့ ပုံစံတစ်ခုဖြစ်ပြီး — တစ်ခါတလေ bundlers အများစု module resolution လုပ်ပုံရဲ့ ခံနိုင်ရည်ရှိတဲ့ အကြမ်းဖျဉ်း (passable approximation) တစ်ခုလည်း ဖြစ်ပါတယ်။ `node_modules` ကနေ packages တွေ ရှာဖွေတာ၊ directory `index.js` files တွေ load လုပ်တာ၊ relative module specifiers တွေထဲမှာ `.js` extensions တွေ ချန်လှပ်ထားတာတွေကို ထောက်ပံ့ပါတယ်။ Node.js v12 က ES modules တွေအတွက် မတူညီတဲ့ module resolution rules တွေ မိတ်ဆက်လိုက်လို့ — ဒါက Node.js ရဲ့ ခေတ်မီ ဗားရှင်းတွေရဲ့ အလွန် ဆိုးတဲ့ ပုံစံတစ်ခုပါ။ Project အသစ်တွေမှာ မသုံးသင့်ပါဘူး။
- [**`node16`**](/docs/typescript/modules-reference): ဒါက `--module node16` နဲ့ `--module node18` တို့ရဲ့ အဖော်ဖြစ်ပြီး — အဲဒီ `module` setting တွေနဲ့ဆို default အနေနဲ့ ပါလာပါတယ်။ Node.js v12 နဲ့ နောက်ပိုင်းက ESM ရော CJS ရော နှစ်မျိုးလုံးကို ထောက်ပံ့ပြီး — တစ်ခုချင်းစီက ကိုယ်ပိုင် module resolution algorithm ကို သုံးပါတယ်။ Node.js ထဲမှာ import statements တွေနဲ့ dynamic `import()` calls တွေထဲက module specifiers တွေက file extensions တွေ ဒါမှမဟုတ် `/index.js` suffixes တွေကို ချန်လှပ်ခွင့် မရှိပေမယ့် — `require` calls တွေထဲကတော့ ရပါတယ်။ ဒီ module resolution mode က — `--module node16`/`node18` တို့က ပြဋ္ဌာန်းထားတဲ့ [module format detection rules](https://www.typescriptlang.org/docs/handbook/modules) တွေအရ လိုအပ်တဲ့နေရာမှာ ဒီကန့်သတ်ချက်ကို နားလည်ပြီး ကျင့်သုံးပါတယ်။ (`node16` နဲ့ `nodenext` အတွက် — `module` နဲ့ `moduleResolution` က လက်တွဲ သွားပါတယ်: တစ်ခုကို `node16` ဒါမှမဟုတ် `nodenext` လို့ သတ်မှတ်ပြီး နောက်တစ်ခုကို တခြားတစ်ခုခု သတ်မှတ်တာက error တစ်ခုပါ။)
- [**`nodenext`**](/docs/typescript/modules-reference): လောလောဆယ် `node16` နဲ့ တူညီပြီး — `--module nodenext` ရဲ့ အဖော်ဖြစ်ကာ — အဲဒီ `module` setting နဲ့ဆို default အနေနဲ့ ပါလာပါတယ်။ Node.js module resolution features အသစ်တွေ ပေါ်လာတာနဲ့အမျှ ထောက်ပံ့ပေးမယ့် ရှေ့ကို မျှော်ကြည့်တဲ့ mode တစ်ခုအဖြစ် ရည်ရွယ်ထားပါတယ်။
- [**`bundler`**](/docs/typescript/modules-reference): Node.js v12 က npm packages တွေကို import လုပ်ဖို့ module resolution features အသစ်တချို့ — `package.json` ရဲ့ `"exports"` နဲ့ `"imports"` fields တွေ — မိတ်ဆက်ခဲ့ပြီး — bundlers အများစုက ESM imports တွေအတွက် ပိုတင်းကျပ်တဲ့ rules တွေကို မကျင့်သုံးဘဲ အဲဒီ features တွေကိုပဲ လက်ခံကျင့်သုံးခဲ့ပါတယ်။ ဒီ module resolution mode က bundler တစ်ခုကို ပစ်မှတ်ထားတဲ့ code အတွက် အခြေခံ algorithm တစ်ခု ပေးပါတယ်။ `package.json` ရဲ့ `"exports"` နဲ့ `"imports"` တွေကို default အနေနဲ့ ထောက်ပံ့ပေမယ့် — သူတို့ကို လျစ်လျူရှုဖို့လည်း configure လုပ်နိုင်ပါတယ်။ `module` ကို `esnext` လို့ သတ်မှတ်ထားဖို့ လိုအပ်ပါတယ်။

### TypeScript imitates the host’s module resolution, but with types (TypeScript က host ရဲ့ module resolution ကို types တွေနဲ့အတူ အတုယူသည်)

Modules နဲ့ ပတ်သက်တဲ့ TypeScript ရဲ့ [တာဝန်](https://www.typescriptlang.org/docs/handbook/modules) ရဲ့ အစိတ်အပိုင်း သုံးခုကို မှတ်မိကြသေးလား?

1. File တွေကို တရားဝင်တဲ့ **output module format** တစ်ခုအဖြစ် compile လုပ်ခြင်း
2. အဲဒီ **outputs** တွေထဲက imports တွေ **အောင်မြင်စွာ resolve** ဖြစ်ကြောင်း သေချာစေခြင်း
3. **Imported names တွေကို** ဘယ် **type** နဲ့ သတ်မှတ်ရမလဲဆိုတာ သိခြင်း

နောက်ဆုံး နှစ်ခုကို ပြီးမြောက်ဖို့ module resolution လိုအပ်ပါတယ်။ ဒါပေမယ့် ကျွန်တော်တို့ အချိန် အများစုကို input files တွေထဲမှာ အလုပ်လုပ်ရင်း ကုန်ဆုံးတတ်တာမို့ — (2) ကို မေ့သွားတာ လွယ်ပါတယ် — module resolution ရဲ့ အဓိက အစိတ်အပိုင်းတစ်ခုက — [input files တွေထဲက module specifiers တွေနဲ့ အတူတူပါတဲ့](https://www.typescriptlang.org/docs/handbook/modules) — output files တွေထဲက imports တွေ ဒါမှမဟုတ် `require` calls တွေ runtime မှာ တကယ် အလုပ်ဖြစ်မဖြစ် စစ်ဆေးနေတာဆိုတာပါ။ Files အများအပြား ပါတဲ့ ဥပမာအသစ်တစ်ခုကို ကြည့်ကြရအောင်:

```ts
// @Filename: math.ts
export function add(a: number, b: number) {
  return a + b;
}

// @Filename: main.ts
import { add } from "./math";
add(1, 2);
```

`"./math"` ကနေ import လုပ်တာကို မြင်ရတဲ့အခါ — “ဒါက TypeScript file တစ်ခုက နောက် TypeScript file တစ်ခုကို ရည်ညွှန်းပုံပဲ။ Compiler က `add` ဆီ type တစ်ခု သတ်မှတ်ပေးဖို့ ဒီ (extension မပါတဲ့) path ကို လိုက်ကြည့်တာပါ” လို့ တွေးမိနိုင်ပါတယ်။

ဒါက လုံးဝ မှားတာတော့ မဟုတ်ပါဘူး — ဒါပေမယ့် လက်တွေ့ကတော့ ပိုနက်ရှိုင်းပါတယ်။ `"./math"` ရဲ့ resolution (ပြီးတော့ နောက်ဆက်တွဲအနေနဲ့ `add` ရဲ့ type) က _output_ files တွေကို runtime မှာ ဘာတွေ ဖြစ်ပျက်မလဲဆိုတဲ့ လက်တွေ့ကို ရောင်ပြန်ဟပ်ဖို့ လိုအပ်ပါတယ်။ ဒီလုပ်ငန်းစဉ်ကို တွေးကြည့်ဖို့ ပိုခိုင်မာတဲ့ နည်းလမ်းတစ်ခုကတော့ ဒီလိုမျိုးပါ:

ဒီပုံစံက ရှင်းရှင်းလင်းလင်း ဖြစ်စေတာက — TypeScript အတွက် module resolution က အများအားဖြင့် — output files တွေကြားမှာ host ရဲ့ module resolution algorithm ကို တိကျစွာ ပုံစံထုတ်ခြင်းပဲ ဖြစ်ပြီး — type information ရှာဖွေဖို့ remapping နည်းနည်း ထပ်ဖြည့်ထားတာပါ။ ရိုးရှင်းတဲ့ ပုံစံရဲ့ မျက်မှန်ကနေ ကြည့်ရင် ပုံမမှန်ဘူးလို့ ထင်ရပေမယ့် — ခိုင်မာတဲ့ ပုံစံနဲ့ဆို လုံးဝ အဓိပ္ပာယ် ရှိတဲ့ နောက်ဥပမာတစ်ခုကို ကြည့်ကြရအောင်:

```ts
// @moduleResolution: node16
// @rootDir: src
// @outDir: dist

// @Filename: src/math.mts
export function add(a: number, b: number) {
  return a + b;
}

// @Filename: src/main.mts
import { add } from "./math.mjs";
add(1, 2);
```

Node.js ရဲ့ ESM `import` declarations တွေက — relative paths တွေမှာ file extensions တွေ ပါဝင်ဖို့ လိုအပ်တဲ့ တင်းကျပ်တဲ့ module resolution algorithm တစ်ခုကို သုံးပါတယ်။ Input files တွေကိုပဲ စဉ်းစားတဲ့အခါ — `"./math.mjs"` က `math.mts` ဆီ resolve ဖြစ်ပုံရတာက နည်းနည်း ထူးဆန်းပါတယ်။ compile လုပ်ထားတဲ့ outputs တွေကို မတူညီတဲ့ directory တစ်ခုထဲ ထည့်ဖို့ `outDir` သုံးနေတာမို့ — `math.mjs` က `main.mts` ဘေးမှာ လုံးဝ မရှိတော့ပါဘူး! ဒါက ဘာလို့ resolve ဖြစ်သင့်တာလဲ။ စိတ်ပိုင်းဆိုင်ရာ ပုံစံအသစ်နဲ့ဆိုရင် — ဒါ ပြဿနာ မဟုတ်ပါဘူး:

ဒီ စိတ်ပိုင်းဆိုင်ရာ ပုံစံကို နားလည်တာက input files တွေထဲမှာ output file extensions တွေ မြင်ရတာရဲ့ ထူးဆန်းမှုကို ချက်ချင်း မပပျောက်စေနိုင်သေးပါဘူး — ပြီးတော့ shortcuts တွေနဲ့ တွေးတာ သဘာဝကျပါတယ်: _`"./math.mjs"` က input file `math.mts` ကို ရည်ညွှန်းတာပါ။ ငါက output extension ကို ရေးရတာပါ — ဒါပေမယ့် ငါ `.mjs` ရေးတဲ့အခါ compiler က `.mts` ကို ရှာရမယ်ဆိုတာ သိပါတယ်။_ ဒီ shortcut က compiler အတွင်းပိုင်း အလုပ်လုပ်ပုံတောင် ဖြစ်ပါတယ် — ဒါပေမယ့် ပိုခိုင်မာတဲ့ စိတ်ပိုင်းဆိုင်ရာ ပုံစံက TypeScript မှာ module resolution ဒီလို အလုပ်လုပ်ရတဲ့ _အကြောင်းရင်း_ ကို ရှင်းပြပါတယ်: output file ထဲက module specifier က [input file ထဲကနဲ့ အတူတူပဲ](https://www.typescriptlang.org/docs/handbook/modules) ဖြစ်ရမယ်ဆိုတဲ့ ကန့်သတ်ချက်အောက်မှာ — output files တွေကို စစ်ဆေးခြင်းနဲ့ types တွေ သတ်မှတ်ပေးခြင်းဆိုတဲ့ ရည်ရွယ်ချက် နှစ်ခုလုံးကို ပြီးမြောက်စေတဲ့ တစ်ခုတည်းသော လုပ်ငန်းစဉ်က ဒါပဲ ဖြစ်လို့ပါ။

### The role of declaration files (Declaration files တွေရဲ့ အခန်းကဏ္ဍ)

အရင် ဥပမာမှာ — module resolution ရဲ့ “remapping” အပိုင်း input နဲ့ output files တွေကြားမှာ အလုပ်လုပ်နေတာကို မြင်ခဲ့ရပါတယ်။ ဒါပေမယ့် library code တစ်ခုကို import လုပ်တဲ့အခါရော ဘာဖြစ်မလဲ။ Library ကို TypeScript နဲ့ ရေးထားရင်တောင် — သူ့ရဲ့ source code ကို ထုတ်ဝေထားချင်မှ ထုတ်ဝေထားမှာပါ။ Library ရဲ့ JavaScript files တွေကို TypeScript file တစ်ခုဆီ ပြန် map လုပ်ဖို့ မမှီခိုနိုင်ရင် — ကျွန်တော်တို့ရဲ့ import က runtime မှာ အလုပ်ဖြစ်တာကို စစ်ဆေးနိုင်ပေမယ့် — types တွေ သတ်မှတ်ပေးခြင်းဆိုတဲ့ ဒုတိယ ရည်ရွယ်ချက်ကိုရော ဘယ်လို ပြီးမြောက်အောင် လုပ်မလဲ?

ဒီနေရာမှာ declaration files တွေ (`.d.ts` ၊ `.d.mts` စသည်) က ဝင်ပါလာပါတယ်။ Declaration files တွေကို ဘယ်လို အနက်ဖွင့်လဲဆိုတာ နားလည်ဖို့ အကောင်းဆုံး နည်းလမ်းက — သူတို့ ဘယ်ကနေ လာလဲဆိုတာ နားလည်ဖို့ပါ။ Input file တစ်ခုပေါ်မှာ `tsc --declaration` run လုပ်တဲ့အခါ — output JavaScript file တစ်ခုရော output declaration file တစ်ခုပါ ရပါတယ်:

ဒီဆက်စပ်မှုကြောင့် — compiler က declaration file တစ်ခုကို မြင်ရတိုင်း — declaration file ထဲက type information တွေက ပြီးပြည့်စုံစွာ ဖော်ပြနေတဲ့ သက်ဆိုင်ရာ JavaScript file တစ်ခု ရှိတယ်လို့ _ယူဆပါတယ်_။ Performance အကြောင်းပြချက်တွေကြောင့် — module resolution mode တိုင်းမှာ compiler က TypeScript files တွေရော declaration files တွေရော ပထမဆုံး အမြဲ ရှာဖွေပြီး — တစ်ခုခု တွေ့ရင် — သက်ဆိုင်တဲ့ JavaScript file ကို ဆက်ပြီး မရှာတော့ပါဘူး။ TypeScript input file တစ်ခု တွေ့ရင် — compilation ပြီးရင် JavaScript file တစ်ခု _ရှိလာမယ်_ ဆိုတာ သိပြီး — declaration file တစ်ခု တွေ့ရင် — compilation တစ်ခု (တခြားတစ်ယောက်ရဲ့ ဖြစ်နိုင်တယ်) ဖြစ်ပြီးသားဖြစ်ပြီး declaration file နဲ့အတူ JavaScript file တစ်ခုကိုပါ ဖန်တီးခဲ့တယ်ဆိုတာ သိပါတယ်။

Declaration file က compiler ကို JavaScript file တစ်ခု ရှိတယ်ဆိုတာ သာမက — သူ့ရဲ့ နာမည်နဲ့ extension ကပါ ဘာလဲဆိုတာကိုပါ ပြောပြပါတယ်:

| Declaration file extension | JavaScript file extension | TypeScript file extension |
| -------------------------- | ------------------------- | ------------------------- |
| `.d.ts`                    | `.js`                     | `.ts`                     |
| `.d.ts`                    | `.js`                     | `.tsx`                    |
| `.d.mts`                   | `.mjs`                    | `.mts`                    |
| `.d.cts`                   | `.cjs`                    | `.cts`                    |
| `.d.*.ts`                  | `.*`                      |                           |

နောက်ဆုံး row က ဖော်ပြတာက — non-JS files တွေကို module system က non-JS files တွေကို JavaScript objects တွေအနေနဲ့ import လုပ်တာကို ထောက်ပံ့တဲ့ ကိစ္စတွေအတွက် — `allowArbitraryExtensions` compiler option နဲ့ type လုပ်နိုင်တယ်ဆိုတာပါ။ ဥပမာ — `styles.css` လို့ နာမည်ရှိတဲ့ file တစ်ခုကို `styles.d.css.ts` လို့ နာမည်ရှိတဲ့ declaration file တစ်ခုနဲ့ ကိုယ်စားပြုနိုင်ပါတယ်။

> “ခဏစောင့်ပါဦး! Declaration files အများအပြားကို လက်နဲ့ပဲ ရေးသားကြတာပါ — `tsc` က generate လုပ်တာ မဟုတ်ပါဘူး။ DefinitelyTyped ဆိုတာ ကြားဖူးကြမှာပါ?” လို့ သင်က ကန့်ကွက်နိုင်ပါတယ်။ ဒါကလည်း မှန်ပါတယ် — declaration files တွေကို လက်နဲ့ ရေးသားခြင်း၊ ဒါမှမဟုတ် external build tool တစ်ခုရဲ့ outputs တွေကို ကိုယ်စားပြုဖို့ သူတို့ကို ရွှေ့ခြင်း/မိတ္တူကူးခြင်း/အမည်ပြောင်းခြင်းတောင် — အန္တရာယ်များပြီး error ဖြစ်လွယ်တဲ့ လုပ်ငန်းတစ်ခုပါ။ DefinitelyTyped contributors တွေရော — JavaScript files တွေရော declaration files တွေရော နှစ်ခုလုံးကို generate လုပ်ဖို့ `tsc` ကို မသုံးတဲ့ typed libraries တွေရဲ့ authors တွေပါ — JavaScript file တိုင်းမှာ နာမည်တူပြီး extension ကိုက်ညီတဲ့ sibling declaration file တစ်ခု ရှိဖို့ သေချာစေသင့်ပါတယ်။ ဒီဖွဲ့စည်းပုံကနေ သွေဖည်ခြင်းက end users တွေအတွက် false-positive TypeScript errors တွေ ဖြစ်စေနိုင်ပါတယ်။ [`@arethetypeswrong/cli`](https://www.npmjs.com/package/@arethetypeswrong/cli) ဆိုတဲ့ npm package က ဒီ errors တွေကို မထုတ်ဝေခင် ဖမ်းမိပြီး ရှင်းပြနိုင်ဖို့ ကူညီပေးနိုင်ပါတယ်။

### Module resolution for bundlers, TypeScript runtimes, and Node.js loaders (Bundlers ၊ TypeScript runtimes နဲ့ Node.js loaders တွေအတွက် module resolution)

အခုထိ — _input files_ နဲ့ _output files_ ကြားက ခြားနားချက်ကို တကယ့်ကို အလေးပေး ပြောခဲ့ပါတယ်။ Relative module specifier တစ်ခုပေါ်မှာ file extension တစ်ခု သတ်မှတ်တဲ့အခါ — TypeScript က ပုံမှန်အားဖြင့် [သင့်ကို _output_ file extension သုံးစေပါတယ်](https://www.typescriptlang.org/docs/handbook/modules):

```ts
// @Filename: src/math.ts
export function add(a: number, b: number) {
  return a + b;
}

// @Filename: src/main.ts
import { add } from "./math.ts";
//                  ^^^^^^^^^^^
// An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
```

ဒီကန့်သတ်ချက် သက်ရောက်တာက TypeScript က extension ကို `.js` ဆီ [ပြန်ရေးမပေးလို့](https://www.typescriptlang.org/docs/handbook/modules) ဖြစ်ပြီး — `"./math.ts"` က output JS file တစ်ခုထဲမှာ ပေါ်နေခဲ့ရင် — အဲဒီ import က runtime မှာ တခြား JS file တစ်ခုဆီ resolve ဖြစ်မှာ မဟုတ်လို့ပါ။ TypeScript က မလုံခြုံတဲ့ output JS file တစ်ခုကို သင် generate လုပ်မိမှာကို တကယ့်ကို ကာကွယ်ချင်ပါတယ်။ ဒါပေမယ့် output JS file ဆိုတာ _မရှိဘူးဆိုရင်ရော?_ ဒီအခြေအနေတွေထဲက တစ်ခုခုမှာ ရောက်နေရင်ရော:

- သင်က ဒီ code ကို bundle လုပ်နေပြီး — bundler က TypeScript files တွေကို in-memory မှာ transpile လုပ်ဖို့ configure လုပ်ထားပြီး — bundle တစ်ခု ထုတ်လုပ်ဖို့ သင်ရေးထားတဲ့ imports တွေ အားလုံးကို နောက်ဆုံးမှာ စားသုံး ဖျောက်ပစ်မှာ ဖြစ်တယ်ဆိုရင်။
- သင်က ဒီ code ကို Node ၊ Deno ဒါမှမဟုတ် Bun လိုမျိုး TypeScript runtime တစ်ခုထဲမှာ တိုက်ရိုက် run လုပ်နေတယ်ဆိုရင်။
- သင်က `ts-node` ၊ `tsx` ဒါမှမဟုတ် Node အတွက် တခြား transpiling loader တစ်ခုခုကို သုံးနေတယ်ဆိုရင်။

ဒီလိုကိစ္စတွေမှာ — သင် `noEmit` (ဒါမှမဟုတ် `emitDeclarationOnly`) နဲ့ `allowImportingTsExtensions` တို့ကို ဖွင့်ပြီး — မလုံခြုံတဲ့ JavaScript files တွေ emit လုပ်တာကို ပိတ်ပစ်ကာ `.ts`-extension imports တွေပေါ်က error ကို တိတ်ဆိတ်စေနိုင်ပါတယ်။

`allowImportingTsExtensions` ရှိတာ မရှိတာပဲ — module resolution host အတွက် အသင့်တော်ဆုံး `moduleResolution` setting ကို ရွေးတာက အရေးကြီးနေဆဲပါ။ Bundlers တွေနဲ့ Bun runtime အတွက်ဆိုရင် — `bundler` ပါ။ ဒီ module resolvers တွေက Node.js ကနေ စိတ်ကူး ရယူထားပေမယ့် — Node.js က imports တွေအတွက် ကျင့်သုံးတဲ့ [extension ရှာဖွေခြင်းကို ပိတ်ထားတဲ့](https://www.typescriptlang.org/docs/handbook/modules) တင်းကျပ်တဲ့ ESM resolution algorithm ကိုတော့ လက်ခံကျင့်သုံးမထားပါဘူး။ `bundler` module resolution setting က ဒါကို ရောင်ပြန်ဟပ်ပြီး — `node16`—`nodenext` တွေလိုပဲ `package.json` ရဲ့ `"exports"` ထောက်ပံ့မှုကို enable လုပ်ပေးကာ — extensionless imports တွေကို အမြဲ ခွင့်ပြုပါတယ်။ နောက်ထပ် လမ်းညွှန်ချက်တွေအတွက် [_compiler options ရွေးချယ်ခြင်း_](/docs/typescript/modules-choosing-compiler-options) ကို ကြည့်ပါ။

### Module resolution for libraries (Libraries တွေအတွက် module resolution)

App တစ်ခုကို compile လုပ်တဲ့အခါ — TypeScript project တစ်ခုအတွက် `moduleResolution` option ကို module resolution [host](https://www.typescriptlang.org/docs/handbook/modules) က ဘယ်သူလဲပေါ် အခြေခံပြီး ရွေးချယ်ပါတယ်။ Library တစ်ခုကို compile လုပ်တဲ့အခါမှာတော့ — output code က ဘယ်မှာ run မယ်ဆိုတာ မသိပေမယ့် — တတ်နိုင်သမျှ နေရာ အများကြီးမှာ run နိုင်စေချင်ပါတယ်။ `"module": "node18"` (အလိုလို ပါလာတဲ့ [`"moduleResolution": "node16"`](/docs/typescript/modules-reference) နဲ့အတူ) ကို သုံးတာက output JavaScript ရဲ့ module specifiers တွေရဲ့ လိုက်ဖက်ညီမှု (compatibility) ကို အမြင့်ဆုံး ဖြစ်စေဖို့ အကောင်းဆုံး ရွေးချယ်မှုပါ — ဘာလို့လဲဆိုတော့ `import` ရဲ့ module resolution အတွက် Node.js ရဲ့ တင်းကျပ်တဲ့ rules တွေကို လိုက်နာဖို့ အတင်းအကျပ် ဖြစ်စေလို့ပါ။ Library တစ်ခုက `"moduleResolution": "bundler"` (ဒါမှမဟုတ် ပိုဆိုးတဲ့ `"node10"`) နဲ့ compile လုပ်ရင် ဘာဖြစ်မလဲဆိုတာ ကြည့်ကြရအောင်:

```ts
export * from "./utils";
```

`./utils.ts` (ဒါမှမဟုတ် `./utils/index.ts`) ရှိတယ်လို့ ယူဆရင် — bundler တစ်ခုအတွက် ဒီ code က အဆင်ပြေတာမို့ — `"moduleResolution": "bundler"` က ဘာမှ မပြောပါဘူး။ `"module": "esnext"` နဲ့ compile လုပ်ထားရင် — ဒီ export statement အတွက် output JavaScript က input နဲ့ အတိအကျ တူနေမှာပါ။ အဲဒီ JavaScript ကို npm ပေါ်မှာ ထုတ်ဝေလိုက်မယ်ဆိုရင် — bundler တစ်ခုကို သုံးတဲ့ projects တွေအတွက် သုံးလို့ ရနိုင်ပေမယ့် — Node.js ထဲမှာ run လုပ်တဲ့အခါ error တစ်ခု ဖြစ်စေပါလိမ့်မယ်:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/dependency/utils' imported from .../node_modules/dependency/index.js
Did you mean to import ./utils.js?
```

တစ်ဖက်မှာလည်း — ဒီလိုမျိုး ရေးခဲ့မယ်ဆိုရင်:

```ts
export * from "./utils.js";
```

ဒါက Node.js ရော bundlers တွေရော နှစ်ခုလုံးမှာ အလုပ်လုပ်တဲ့ output တစ်ခုကို ထုတ်ပေးမှာ ဖြစ်ပါတယ်။

အတိုချုပ်ပြောရရင် — `"moduleResolution": "bundler"` က ကူးစက်တတ်ပါတယ် — bundlers တွေထဲမှာပဲ အလုပ်လုပ်တဲ့ code ကို ထုတ်လုပ်ခွင့် ပြုပါတယ်။ အလားတူပဲ — `"moduleResolution": "nodenext"` က output က Node.js ထဲမှာ အလုပ်လုပ်တာကိုပဲ စစ်ဆေးပေးပေမယ့် — အများစုသော ကိစ္စတွေမှာ Node.js ထဲမှာ အလုပ်လုပ်တဲ့ module code က တခြား runtimes တွေရော bundlers တွေရောထဲမှာပါ အလုပ်လုပ်ပါလိမ့်မယ်။

တကယ်တော့ — ဒီလမ်းညွှန်ချက်က library က `tsc` ကနေ outputs တွေ ထုတ်ပို့တဲ့ ကိစ္စတွေမှာပဲ သက်ရောက်နိုင်ပါတယ်။ Library ကို မထုတ်ပို့ခင် _အရင်_ bundle လုပ်နေတယ်ဆိုရင် — `"moduleResolution": "bundler"` က လက်ခံနိုင်လောက်ပါတယ်။ Library ရဲ့ နောက်ဆုံး build ကို ထုတ်လုပ်ဖို့ module format ဒါမှမဟုတ် module specifiers တွေကို ပြောင်းလဲတဲ့ ဘယ် build tool မဆို — ထုတ်ကုန်ရဲ့ module code ရဲ့ ဘေးကင်းမှုနဲ့ လိုက်ဖက်ညီမှုကို သေချာစေဖို့ တာဝန် ရှိပြီး — runtime မှာ ဘယ်လို module code ရှိမယ်ဆိုတာ မသိနိုင်တာမို့ — `tsc` က အဲဒီတာဝန်ထဲ ဆက်ပြီး ပါဝင်မှာ မဟုတ်တော့ပါဘူး။
