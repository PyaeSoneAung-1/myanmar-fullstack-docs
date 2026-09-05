---
title: "TypeScript for the New Programmer (စတင်သူအသစ်များအတွက် TypeScript)"
description: "TypeScript ကို ပထမဆုံး programming language အဖြစ် စတင်လေ့လာသူများအတွက် — JavaScript ၏ သမိုင်းကြောင်း, static type checking, TypeScript ၏ typed superset သဘောတရားနှင့် runtime behavior မပြောင်းလဲခြင်းအကြောင်း"
order: 40
source: "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html"
status: translated
updated: 2026-09-05
---

TypeScript ကို သင့်ရဲ့ ပထမဆုံး programming language တွေထဲက တစ်ခုအဖြစ် ရွေးချယ်လိုက်လို့ ဝမ်းသာပါတယ် — သင်ဟာ ကောင်းမွန်တဲ့ ဆုံးဖြတ်ချက်တွေ ချနေပြီးသားပါ!

TypeScript က JavaScript ရဲ့ "flavor" (အရသာ) ဒါမှမဟုတ် "variant" (မျိုးကွဲတစ်မျိုး) ဖြစ်တယ်လို့ သင်ကြားဖူးနားဝ ရှိမှာပါ။ TypeScript (TS) နဲ့ JavaScript (JS) ကြားက ဆက်စပ်မှုက ခေတ်သစ် programming language တွေကြားမှာ အတော်လေး ထူးခြားပါတယ် — ဒါကြောင့် ဒီဆက်စပ်မှုအကြောင်း ပိုလေ့လာထားတာက — TypeScript က JavaScript အပေါ်မှာ ဘာတွေ ထပ်ဖြည့်ပေးလဲဆိုတာကို နားလည်ဖို့ ကူညီပါလိမ့်မယ်။

## What is JavaScript? A Brief History (JavaScript ဆိုတာ ဘာလဲ? သမိုင်းအကျဉ်း)

JavaScript (ECMAScript လို့လည်း ခေါ်ပါတယ်) က browser တွေအတွက် ရိုးရှင်းတဲ့ scripting language အဖြစ် စတင်ခဲ့တာပါ။
စတင်တီထွင်ခဲ့တဲ့အချိန်တုန်းကတော့ — web page တစ်ခုထဲမှာ မြှုပ်သွင်းထားတဲ့ code အပိုင်းအစတိုတွေအတွက်သာ သုံးဖို့ မျှော်မှန်းထားခဲ့တာပါ — line အနည်းငယ်ထက် ပိုရေးတာတောင် ထူးဆန်းတဲ့ခေတ်ပါ။
ဒါကြောင့် — အစောပိုင်း web browser တွေက ဒီလို code တွေကို အတော်လေး နှေးကွေးစွာပဲ execute လုပ်ခဲ့ပါတယ်။
အချိန်ကြာလာတာနဲ့အမျှ — JS က ပိုပိုပြီး ရေပန်းစားလာကာ — web developer တွေက interactive ဖြစ်တဲ့ အတွေ့အကြုံတွေ ဖန်တီးဖို့ စတင် သုံးလာကြပါတယ်။

Web browser developer တွေကလည်း — ဒီလို တိုးလာတဲ့ JS အသုံးပြုမှုကို တုံ့ပြန်တဲ့အနေနဲ့ — သူတို့ရဲ့ execution engines တွေကို optimize လုပ်ခြင်း (dynamic compilation) နဲ့ JS နဲ့ လုပ်လို့ရတာတွေကို တိုးချဲ့ခြင်း (APIs တွေ ထည့်ပေးခြင်း) အားဖြင့် ဖြေရှင်းခဲ့ကြပါတယ်။ အဲဒါက — တစ်ဖန်ပြန်ပြီး — web developer တွေကို JS ပိုသုံးလာစေခဲ့ပါတယ်။
ခေတ်သစ် website တွေမှာဆိုရင် — သင့် browser က code line သိန်းနဲ့ချီ ပါဝင်တဲ့ application တွေကို မကြာခဏ run နေရပါတယ်။
ဒါဟာ "the web" ရဲ့ ရှည်လျားပြီး တဖြည်းဖြည်း ကြီးထွားလာတဲ့ ဖြစ်စဉ်ပါ — static pages တွေရဲ့ ရိုးရှင်းတဲ့ network အဖြစ်က စတင်ပြီး — မျိုးစုံသော ကြွယ်ဝတဲ့ _application_ တွေအတွက် platform တစ်ခုအထိ ပြောင်းလဲလာခဲ့တာပါ။

ဒါတင်မကဘူး — JS က browser တွေရဲ့ နယ်ပယ်အပြင်ဘက်မှာပါ သုံးလောက်အောင် ရေပန်းစားလာပါတယ်။ ဥပမာ — node.js သုံးပြီး JS servers တွေ ရေးတာမျိုးပါ။
JS ရဲ့ "run anywhere (နေရာတိုင်းမှာ run လို့ရတဲ့)" သဘောသဘာဝက — cross-platform development အတွက် ဆွဲဆောင်မှုရှိတဲ့ ရွေးချယ်မှုတစ်ခု ဖြစ်စေပါတယ်။
ဒီနေ့ခေတ်မှာ — သူတို့ရဲ့ stack တစ်ခုလုံးကို JavaScript _တစ်ခုတည်းနဲ့ပဲ_ ရေးသားနေတဲ့ developer တွေ အများကြီး ရှိပါတယ်!

အနှစ်ချုပ်ပြောရရင် — လျင်မြန်စွာ အသုံးပြုဖို့ ဒီဇိုင်းထုတ်ခဲ့တဲ့ language တစ်ခုဟာ — line သန်းနဲ့ချီတဲ့ application တွေကို ရေးဖို့ အပြည့်အဝ စွမ်းဆောင်နိုင်တဲ့ tool တစ်ခုအထိ ကြီးထွားလာခဲ့ပါတယ်။
Language တိုင်းမှာ ကိုယ်ပိုင် _quirk_ တွေ — ထူးဆန်းမှုတွေနဲ့ အံ့အားသင့်စရာတွေ — ရှိကြပါတယ်။ JavaScript ရဲ့ နှိမ့်ချတဲ့ အစပြုမှုကြောင့် ဒီလိုဟာမျိုးတွေ _အများကြီး_ ရှိနေတာပါ။ ဥပမာအချို့:

- JavaScript ရဲ့ equality operator (`==`) က သူ့ရဲ့ operands တွေကို _coerce_ (အလိုအလျောက် type ပြောင်းလဲ) လုပ်တာမို့ — မမျှော်လင့်တဲ့ အပြုအမူတွေ ဖြစ်စေနိုင်ပါတယ်:

  ```js
  if ("" == 0) {
    // It is! But why??
  }
  if (1 < x < 3) {
    // True for *any* value of x!
  }
  ```

- JavaScript က မရှိတဲ့ properties တွေကို ဝင်ရောက်ကြည့်ရှုတာကိုလည်း ခွင့်ပြုပါတယ်:

  ```js
  const obj = { width: 10, height: 15 };
  // Why is this NaN? Spelling is hard!
  const area = obj.width * obj.heigth;
  ```

Programming language အများစုဆိုရင် — ဒီလိုမျိုး error တွေ ဖြစ်ပွားလာရင် error ထုတ်ပစ်မှာပါ — တစ်ချို့ကတော့ code မစတင်ခင် compilation အဆင့်မှာတည်းက ထုတ်ပစ်မှာပါ။
ပရိုဂရမ်အသေးစားတွေ ရေးတဲ့အခါ — ဒီလို quirks တွေက စိတ်တိုစရာပဲ ရှိပြီး ထိန်းလို့ရပါသေးတယ်။ ဒါပေမယ့် line ရာနဲ့ချီ ထောင်နဲ့ချီ ပါတဲ့ application တွေ ရေးတဲ့အခါမှာတော့ — ဒီလို အဆက်မပြတ် အံ့အားသင့်စရာတွေက ဆိုးရွားတဲ့ ပြဿနာတစ်ခု ဖြစ်လာပါတယ်။

## TypeScript: A Static Type Checker (TypeScript — static type checker တစ်ခု)

အစောပိုင်းမှာ — language တစ်ချို့က bug ပါတဲ့ ဒီလို program တွေကို လုံးဝ run ခွင့် မပေးဘူးလို့ ကျွန်တော်တို့ ပြောခဲ့ပါတယ်။
Code ကို run မလုပ်ဘဲ — error တွေကို ရှာဖွေတွေ့ရှိတာကို _static checking_ (code မဖွင့်ဘဲ စစ်ဆေးခြင်း) လို့ ခေါ်ပါတယ်။
လုပ်ဆောင်နေတဲ့ values တွေရဲ့ အမျိုးအစားတွေကို အခြေခံပြီး — ဘာက error လဲ၊ ဘာက error မဟုတ်ဘူးလဲ ဆုံးဖြတ်တာကို static _type_ checking လို့ သိကြပါတယ်။

TypeScript က program တစ်ခုကို execution မလုပ်ခင် — _values တွေရဲ့ အမျိုးအစားတွေ_ ကို အခြေခံပြီး error ရှိမရှိ စစ်ဆေးပါတယ် — ဒါကြောင့် သူ့ကို _static type checker_ လို့ ခေါ်တာပါ။
ဥပမာ — အပေါ်က နောက်ဆုံး ဥပမာမှာ `obj` ရဲ့ _type_ ကြောင့် error တစ်ခု ရှိနေပါတယ်။
TypeScript တွေ့လိုက်တဲ့ error က ဒီမှာပါ:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### A Typed Superset of JavaScript (JavaScript ရဲ့ type ပါတဲ့ Superset)

ဒါဆိုရင် — TypeScript က JavaScript နဲ့ ဘယ်လို ဆက်စပ်နေလဲ?

#### Syntax (Syntax — ရေးသားပုံစံ)

TypeScript က JavaScript ရဲ့ _superset_ (အစုအဝေး ချဲ့ထွင်မှု) ဖြစ်တဲ့ language တစ်ခုပါ — ဒါကြောင့် JS syntax တွေဟာ TS မှာလည်း တရားဝင် (legal) ပါ။
_Syntax_ ဆိုတာ program တစ်ခု ဖွဲ့စည်းဖို့ — စာသားတွေကို ဘယ်လို ရေးသားလဲဆိုတဲ့ နည်းလမ်းကို ဆိုလိုပါတယ်။
ဥပမာ — ဒီ code က `)` တစ်လုံး လိုနေလို့ _syntax_ error တစ်ခု ဖြစ်နေပါတယ်:

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript က JavaScript code ဘယ်ဟာကိုမှ — သူ့ရဲ့ syntax ကြောင့် error အဖြစ် သတ်မှတ်တာ မရှိပါဘူး။
ဆိုလိုတာက — အလုပ်လုပ်နေတဲ့ JavaScript code ဘယ်ဟာကိုမဆို — ဘယ်လို ရေးထားလဲဆိုတာကို ပူစရာမလိုဘဲ — TypeScript file တစ်ခုထဲ ထည့်လို့ရပါတယ်။

#### Types (Type များ)

ဒါပေမယ့် — TypeScript က _typed_ (type ပါတဲ့) superset တစ်ခုပါ — ဆိုလိုတာက — value အမျိုးအစား အမျိုးမျိုးကို ဘယ်လို သုံးနိုင်လဲဆိုတဲ့ စည်းမျဉ်းတွေကို သူက ထပ်ဖြည့်ပေးပါတယ်။
အစောပိုင်းက `obj.heigth` နဲ့ ပတ်သက်တဲ့ error က _syntax_ error မဟုတ်ပါဘူး: ဒါဟာ value တစ်မျိုး (_type_ တစ်ခု) ကို မမှန်ကန်တဲ့ နည်းလမ်းနဲ့ သုံးမိတဲ့ error ပါ။

နောက်ထပ် ဥပမာတစ်ခုအနေနဲ့ — ဒါက သင့် browser မှာ run လို့ရတဲ့ JavaScript code ပါ — value တစ်ခုကို log ထုတ်ပေးမှာ _သေချာ_ ပါတယ်:

```js
console.log(4 / []);
```

ဒီ syntax ပိုင်းအရ တရားဝင်တဲ့ program က `Infinity` ကို log ထုတ်ပါတယ်။
ဒါပေမယ့် TypeScript ကတော့ — number တစ်ခုကို array တစ်ခုနဲ့ စားတာကို အဓိပ္ပာယ်မရှိတဲ့ operation အဖြစ် သတ်မှတ်ပြီး — error ထုတ်ပေးပါလိမ့်မယ်:

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

number တစ်ခုကို array တစ်ခုနဲ့ စားဖို့ — ဘာဖြစ်မလဲ ကြည့်ချင်လို့ — သင်တကယ်ပဲ ရည်ရွယ်ချက်ရှိရှိ ကြံရွယ်ထားတာ ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် အများစုမှာတော့ ဒါဟာ programming အမှားတစ်ခုပါ။
TypeScript ရဲ့ type checker က — မှန်ကန်တဲ့ program တွေကို အတားအဆီးမရှိ ဖြတ်သန်းခွင့် ပေးရင်း — တတ်နိုင်သမျှ များများ အဖြစ်များတဲ့ error တွေကို ဖမ်းမိစေဖို့ ဒီဇိုင်းထုတ်ထားတာပါ။
(နောက်ပိုင်းမှာ — TypeScript က သင့် code ကို ဘယ်လောက် တင်းကျပ်စွာ စစ်ဆေးလဲဆိုတာကို ပြင်ဆင်သတ်မှတ်ဖို့ သုံးလို့ရတဲ့ settings တွေအကြောင်း လေ့လာရပါမယ်။)

JavaScript file တစ်ခုကနေ TypeScript file တစ်ခုဆီ code တွေ ရွှေ့လိုက်ရင် — code ရေးထားပုံပေါ် မူတည်ပြီး — _type errors_ တွေ တွေ့ရနိုင်ပါတယ်။
ဒါတွေဟာ code ထဲက တကယ့် ပြဿနာတွေလည်း ဖြစ်နိုင်သလို — TypeScript က အလွန်အကျွံ ရှေးရိုးစွဲ ဖြစ်နေလို့လည်း ဖြစ်နိုင်ပါတယ်။
ဒီ guide တစ်လျှောက်လုံးမှာ — ဒီလို errors တွေကို ဖယ်ရှားဖို့ TypeScript syntax အမျိုးမျိုးကို ဘယ်လို ထည့်သွင်းရမလဲဆိုတာ သရုပ်ပြသွားပါမယ်။

#### Runtime Behavior (Runtime Behavior — run ချိန် အပြုအမူ)

TypeScript က JavaScript ရဲ့ _runtime behavior_ (run ချိန် အပြုအမူ) ကို ထိန်းသိမ်းပေးတဲ့ programming language တစ်ခုလည်း ဖြစ်ပါတယ်။
ဥပမာ — JavaScript မှာ သုညနဲ့ စားရင် runtime exception တစ်ခု ထုတ်ပစ်မယ့်အစား — `Infinity` ကို ထုတ်ပေးပါတယ်။
စည်းမျဉ်းတစ်ခုအနေနဲ့ — TypeScript က JavaScript code ရဲ့ runtime behavior ကို **ဘယ်တော့မှ** ပြောင်းလဲပစ်မှာ မဟုတ်ပါဘူး။

ဆိုလိုတာက — JavaScript ကနေ TypeScript ဆီ code ရွှေ့လိုက်ရင် — TypeScript က code ထဲမှာ type errors တွေ ရှိတယ်လို့ ထင်ရင်တောင် — code က တစ်နည်းတည်းနဲ့ပဲ run မယ်လို့ **အာမခံထား** ပါတယ်။

JavaScript နဲ့ runtime behavior တူညီနေအောင် ထားတာက TypeScript ရဲ့ အခြေခံအုတ်မြစ် ကတိတစ်ခုပါ — ဘာလို့လဲဆိုတော့ — သင့် program ကို ရပ်တန့်သွားစေနိုင်တဲ့ သိမ်မွေ့တဲ့ ကွာခြားချက်တွေကို ပူစရာမလိုဘဲ — language နှစ်ခုကြား အလွယ်တကူ ကူးပြောင်းနိုင်လို့ပါ။

#### Erased Types (Erased Types — ဖျက်ပစ်ခံရတဲ့ Types)

အကြမ်းဖျင်း ပြောရရင် — TypeScript ရဲ့ compiler က သင့် code ကို စစ်ဆေးပြီးသွားတာနဲ့ — ရလာတဲ့ "compiled" code ကို ထုတ်ဖို့ — types တွေကို _erase_ (ဖျောက်ပစ်) လုပ်ပါတယ်။
ဆိုလိုတာက — သင့် code compile ပြီးသွားတာနဲ့ — ထွက်လာတဲ့ plain JS code ထဲမှာ type information လုံးဝ ပါတော့မှာ မဟုတ်ပါဘူး။

ဒါက TypeScript က — သူ infer လုပ်လိုက်တဲ့ types တွေကို အခြေခံပြီး — သင့် program ရဲ့ _behavior_ (အပြုအမူ) ကို ဘယ်တော့မှ ပြောင်းလဲမှာ မဟုတ်ဘူးလို့လည်း ဆိုလိုပါတယ်။
အဓိက ဆုံးဖြတ်ချက်ကတော့ — compilation လုပ်နေတုန်း type errors တွေ မြင်ရနိုင်ပေမယ့် — type system ကိုယ်တိုင်က သင့် program run ချိန်မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတာအပေါ် သက်ရောက်မှု လုံးဝ မရှိပါဘူး။

နောက်ဆုံးအနေနဲ့ — TypeScript က runtime library အပိုတွေ ဘာမှ မပေးပါဘူး။
သင့် program တွေက JavaScript program တွေလိုပဲ — တူညီတဲ့ standard library (ဒါမှမဟုတ် external libraries) တွေကိုပဲ သုံးမှာမို့ — သင်ယူစရာ TypeScript အတွက်သီးသန့် framework အပို ဘာမှ မရှိပါဘူး။

## Learning JavaScript and TypeScript (JavaScript နဲ့ TypeScript သင်ယူခြင်း)

ကျွန်တော်တို့ မကြာခဏ တွေ့ရတဲ့ မေးခွန်းတစ်ခုက — "JavaScript ကို လေ့လာသင့်လား TypeScript ကို လေ့လာသင့်လား?" ဆိုတာပါ။

အဖြေကတော့ — JavaScript မလေ့လာဘဲ TypeScript ကို မလေ့လာနိုင်ပါဘူး!
TypeScript က JavaScript နဲ့ syntax ရော runtime behavior ပါ အတူတူ မျှဝေထားတာမို့ — JavaScript အကြောင်း သင်လေ့လာသမျှဟာ — တစ်ချိန်တည်းမှာပဲ TypeScript ကို သင်ယူနေတာနဲ့ အတူတူပါပဲ။

JavaScript သင်ယူဖို့ programmer တွေအတွက် ရင်းမြစ်တွေ အများကြီး အများကြီး ရှိပါတယ် — TypeScript ရေးနေတယ်ဆိုရင် ဒီရင်းမြစ်တွေကို လျစ်လျူရှုထားဖို့ _မလိုပါဘူး_။
ဥပမာ — StackOverflow မှာ `typescript` tag နဲ့ မေးခွန်းတွေထက် — `javascript` tag နဲ့ မေးခွန်းတွေက အဆ ၂၀ လောက် ပိုများပါတယ် — ဒါပေမယ့် `javascript` မေးခွန်း _အားလုံး_ က TypeScript အတွက်လည်း အကျုံးဝင်ပါတယ်။

"how to sort a list in TypeScript" လိုမျိုး ရှာဖွေနေတာကို ကိုယ့်ကိုယ်ကို တွေ့ရရင် သတိရပါ: **TypeScript က compile-time type checker ပါတဲ့ JavaScript ရဲ့ runtime ပဲ ဖြစ်ပါတယ်**။
TypeScript မှာ list တစ်ခုကို sort လုပ်တဲ့ နည်းလမ်းက JavaScript မှာ လုပ်တဲ့ နည်းလမ်းနဲ့ အတူတူပါပဲ။
TypeScript ကို တိုက်ရိုက် သုံးထားတဲ့ ရင်းမြစ်တစ်ခု တွေ့ရင်လည်း ကောင်းပါတယ် — ဒါပေမယ့် — runtime task တွေကို ဘယ်လို ပြီးမြောက်အောင် လုပ်မလဲဆိုတဲ့ နေ့စဉ် မေးခွန်းတွေအတွက် TypeScript အတွက်သီးသန့် အဖြေတွေပဲ လိုတယ်လို့ — ကိုယ့်ကိုယ်ကို ကန့်သတ်မထားပါနဲ့။

## Next Steps (နောက်ထပ် ဆက်လုပ်ရန် အဆင့်များ)

ဒါဟာ နေ့စဉ် TypeScript မှာ သုံးတဲ့ syntax နဲ့ tools တွေရဲ့ အကျဉ်းချုပ် ခြုံငုံသုံးသပ်ချက်ပါ။ ဒီကနေ သင်လုပ်နိုင်တာတွေက:

- JavaScript အခြေခံသဘောတရား အချို့ကို လေ့လာနိုင်ပါတယ် — အောက်ပါတို့ထဲက တစ်ခုခုကို အကြံပြုပါတယ်:

  - [Microsoft ရဲ့ JavaScript Resources](https://developer.microsoft.com/javascript/) ဒါမှမဟုတ်
  - [Mozilla Web Docs မှ JavaScript guide](https://developer.mozilla.org/docs/Web/JavaScript/Guide)

- ဆက်ပြီး [TypeScript for JavaScript Programmers](/docs/typescript/typescript-in-5-minutes) ကို သွားပါ
- Handbook တစ်အုပ်လုံးကို [အစအဆုံး](/docs/typescript/getting-started) ဖတ်ရှုပါ
- [Playground ဥပမာများ](https://www.typescriptlang.org/play) ကို စူးစမ်းလေ့လာပါ
