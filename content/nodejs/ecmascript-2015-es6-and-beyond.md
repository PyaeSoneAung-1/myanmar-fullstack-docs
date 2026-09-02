---
title: "ECMAScript 2015 (ES6) နဲ့ နောက်ပိုင်း Features များ"
description: "ECMAScript 2015 (ES6) features တွေကို Node.js က ဘယ်လို ပံ့ပိုးသလဲ — shipping / staged / in progress အုပ်စု သုံးစု၊ --harmony flag သုံးစရာ လိုလား၊ V8 version ရှာနည်း"
order: 39
source: "https://nodejs.org/learn/getting-started/ecmascript-2015-es6-and-beyond"
status: translated
updated: 2026-09-02
---

## ECMAScript 2015 (ES6) နဲ့ နောက်ပိုင်း Features များ

Node.js ကို [V8](https://v8.dev/) ရဲ့ ခေတ်မီ version တွေပေါ်မှာ တည်ဆောက်ထားပါတယ်။ ဒီ engine ရဲ့ နောက်ဆုံး release တွေနဲ့ အမြဲတစ်ပြေးညီ လိုက်လျောညီထွေ နေခြင်းအားဖြင့် — [JavaScript ECMA-262 specification](http://www.ecma-international.org/publications/standards/Ecma-262.htm) ထဲက feature အသစ်တွေကို Node.js developer တွေဆီ အချိန်မီ ရောက်ရှိစေနိုင်သလို — performance နဲ့ stability တိုးတက်မှုတွေကိုလည်း ဆက်လက် ရရှိစေပါတယ်။

ECMAScript 2015 (ES6) features (အင်္ဂါရပ်များ) အားလုံးကို **shipping** (ပုံမှန် ပါဝင်ပြီးသား)၊ **staged** (အဆင့်လိုက် စမ်းသပ်နေဆဲ) နဲ့ **in progress** (လုပ်ဆောင်ဆဲ) ဆိုတဲ့ အုပ်စု သုံးစု ခွဲထားပါတယ်:

- **Shipping** features တွေကတော့ — V8 က stable လို့ သတ်မှတ်ထားတာတွေ ဖြစ်ပြီး Node.js မှာ **default အနေနဲ့ ဖွင့်ထားပါတယ်**။ ဘယ် runtime flag မှ မလိုအပ်ပါဘူး။
- **Staged** features တွေကတော့ — V8 team က stable လို့ မသတ်မှတ်ရသေးတဲ့ ပြီးစီးခါနီး features တွေ ဖြစ်ပြီး — `--harmony` ဆိုတဲ့ runtime flag တစ်ခု လိုအပ်ပါတယ်။
- **In progress** features တွေကတော့ — သူတို့နဲ့ သက်ဆိုင်တဲ့ harmony flag တစ်ခုချင်းစီနဲ့ activate လုပ်လို့ရပါတယ်။ ဒါပေမယ့် testing (စမ်းသပ်မှု) ရည်ရွယ်ချက်ကလွဲရင် ဒီလိုလုပ်ဖို့ အလွန် အကြံမပြုပါဘူး။ သတိပြုရန်မှာ — ဒီ flags တွေကို V8 က ဖော်ထုတ်ထားတာဖြစ်ပြီး deprecation notice (အသုံးမပြုတော့ကြောင်း အကြောင်းကြားစာ) မရှိဘဲ ပြောင်းလဲသွားနိုင်တာပါ။

### Node.js version အလိုက် default ပါဝင်တဲ့ features တွေက ဘာတွေလဲ

[node.green](https://node.green/) website က Node.js version အမျိုးမျိုးမှာ ထောက်ပံ့ထားတဲ့ ECMAScript features တွေရဲ့ အလွန်ကောင်းတဲ့ ခြုံငုံသုံးသပ်ချက်တစ်ခုကို ပေးပါတယ် — kangax ရဲ့ compat-table ကို အခြေခံထားတာပါ။

### In progress ဖြစ်နေတဲ့ features တွေက ဘာတွေလဲ

V8 engine ထဲကို feature အသစ်တွေ အဆက်မပြတ် ထည့်သွင်းနေပါတယ်။ ယေဘုယျအားဖြင့် — အချိန်အတိအကျတော့ မသိရသေးပေမယ့် — နောင် Node.js release တစ်ခုခုမှာ ဒါတွေ ပါဝင်လာဖို့ မျှော်လင့်နိုင်ပါတယ်။

Node.js release တစ်ခုချင်းစီမှာ ရနိုင်တဲ့ _in progress_ features တွေ အားလုံးကို `--v8-options` argument ထဲမှာ grep လုပ်ပြီး စာရင်းထုတ်ကြည့်လို့ရပါတယ်။ ဒါတွေက V8 ရဲ့ မပြည့်စုံသေးတဲ့ — ဖြစ်နိုင်ခြေရှိတဲ့ ပြဿနာရှိနိုင်တဲ့ — features တွေ ဖြစ်တာမို့ ကိုယ့်ဘာသာ တာဝန်ယူပြီးမှ သုံးပါ:

```bash
node --v8-options | grep "in progress"
```

### Infrastructure က `--harmony` flag ကို သုံးဖို့ တည်ဆောက်ထားတယ် — ဖြုတ်သင့်လား

Node.js မှာ `--harmony` flag ရဲ့ လက်ရှိ အပြုအမူကတော့ — **staged** features တွေကိုပဲ ဖွင့်ပေးတာ ဖြစ်ပါတယ်။ တကယ်တော့ အခုဆိုရင် ဒီ flag က `--es_staging` ရဲ့ synonym (အဓိပ္ပာယ်တူ စကားလုံး) ဖြစ်နေပါပြီ။ အပေါ်မှာ ဖော်ပြခဲ့သလို — ဒါတွေက ပြီးစီးပေမယ့် stable လို့ မသတ်မှတ်ရသေးတဲ့ features တွေပါ။ လုံခြုံချင်တယ်ဆိုရင် — အထူးသဖြင့် production environment တွေမှာ — ဒီ runtime flag ကို V8 မှာ၊ နောက်ဆုံးမှာ Node.js မှာပါ default အနေနဲ့ မပါဝင်မချင်း ဖြုတ်ထားဖို့ စဉ်းစားပါ။ ဒီ flag ကို ဆက်ဖွင့်ထားမယ်ဆိုရင် — V8 က standard နဲ့ ပိုနီးကပ်အောင် ဒီ features တွေရဲ့ semantics (အဓိပ္ပာယ်ဖွင့်ဆိုချက်) ကို ပြောင်းလဲလိုက်ရင် — နောင် Node.js upgrade တွေမှာ ကိုယ့် code တွေ ပျက်သွားနိုင်တာကို ကြိုတင် ပြင်ဆင်ထားသင့်ပါတယ်။

### Node.js version တစ်ခုချင်းစီနဲ့ ပါလာတဲ့ V8 version ကို ဘယ်လို ရှာမလဲ

Node.js က `process` global object ကနေတစ်ဆင့် — သီးခြား binary တစ်ခုနဲ့အတူ ပါလာတဲ့ dependency အားလုံးနဲ့ သူတို့ရဲ့ သက်ဆိုင်ရာ version တွေကို စာရင်းပြနိုင်ဖို့ ရိုးရှင်းတဲ့ နည်းလမ်းတစ်ခု ပေးထားပါတယ်။ V8 engine ရဲ့ ကိစ္စမှာဆိုရင် — သူ့ရဲ့ version ကို ရယူဖို့ terminal ထဲမှာ အောက်ပါအတိုင်း ရိုက်ထည့်ပါ:

```bash
node -p process.versions.v8
```

## ဆက်ဖတ်ရန်

- [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) — Node.js runtime အကြောင်း နောက်ခံသမိုင်း
- [V8 JavaScript Engine](/docs/nodejs/the-v8-javascript-engine) — Node.js ကို အားဖြည့်ပေးတဲ့ JavaScript engine
- [Node.js နဲ့ Browser ကွာခြားချက်များ](/docs/nodejs/differences-between-nodejs-and-the-browser) — ES2015+ features တွေကို ထောက်ပံ့မှု ကွာခြားပုံ
