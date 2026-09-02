---
title: "Workflows (Collection အစီအစဉ်)"
description: "pm.execution.setNextRequest() သုံးပြီး collection run ထဲက request order ကို ပြောင်းလဲခြင်း — requests chain လုပ်ခြင်း, looping, branching, workflow ရပ်တန့်ခြင်း"
order: 11
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/building-workflows/"
status: translated
updated: 2026-09-02
---

Collection တစ်ခုကို [run လုပ်တဲ့အခါ](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/) — Postman က collection ထဲမှာ ပေါ်နေတဲ့ အစဉ်အတိုင်း requests တွေအားလုံးကို run ပါတယ်။ Folders တွေထဲက requests တွေက အရင်ဆုံး run ပြီး — collection ရဲ့ root မှာ တည့်တည့်ရှိတဲ့ requests တွေက နောက်မှ run ပါတယ်။ Collection run နေစဉ်အတွင်း requests တွေရဲ့ အစဉ်ကို လိုအပ်သလို ပြောင်းလဲချင်ရင် — [post-response script](/docs/postman/testing) တစ်ခုထဲမှာ `pm.execution.setNextRequest()` function ကို သုံးပါတယ်။

ဒီ function ကို သုံးပြီး — requests တွေကို chain လုပ်ကာ တစ်ခုပြီးတစ်ခု ကိုယ်သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း run စေမယ့် workflows တွေကို တည်ဆောက်နိုင်ပါတယ်။ Collection run တစ်ခုစတိုင်းမှာလည်း requests တွေရဲ့ အစဉ်ကို အလိုအလျောက် ပြောင်းလဲနိုင်ပါတယ်။

## Next request ကို သတ်မှတ်ခြင်း

နောက် run စေချင်တဲ့ request ကို သတ်မှတ်ဖို့ — request တစ်ခုရဲ့ **Scripts > Post-response** tab မှာ အောက်ပါ code ကို ထည့်ပါ။ `request_name` နေရာမှာ run စေချင်တဲ့ request ရဲ့ နာမည် ဒါမှမဟုတ် ID ကို quotes နဲ့ ရေးထည့်ပါ။

```js
pm.execution.setNextRequest("request_name");
```

လက်ရှိ request ပြီးသွားတဲ့အခါ Postman က သတ်မှတ်ထားတဲ့ request ကို run ပါတယ်။

## Request တစ်ခုကို loop လုပ်ခြင်း

`setNextRequest` function ထဲကို လက်ရှိ request ရဲ့ နာမည် ဒါမှမဟုတ် ID ကိုပဲ ထည့်လိုက်ရင် — ဒီ request က ပြီးတိုင်း နောက်တစ်ကြိမ် ထပ်ပြီး run ပါတယ်။

Request က အကန့်အသတ်မရှိ loop ဖြစ်မသွားအောင် — `setNextRequest` function ထဲမှာ အပိုဆောင်း logic တွေ ထည့်ပေးပါ။ ဥပမာ — iteration အကြိမ်ရေ တစ်ခုရောက်တဲ့အခါ ဒါမှမဟုတ် တခြား condition တစ်ခု ပြည့်မီတဲ့အခါ loop ကနေ ထွက်စေတာမျိုးပါ။ မဟုတ်ရင် — loop အဆုံးသတ်ဖို့ Collection Runner ကို ကိုယ်တိုင် အတင်းပိတ်ရပါမယ်။

အောက်ပါဥပမာမှာ — post-response script က request run ခဲ့တဲ့ အကြိမ်ရေကို ရေတွက်ပြီး request သုံးကြိမ် run ပြီးတာနဲ့ loop ကို ရပ်လိုက်ပါတယ်။ Workflow ရပ်တန့်ပုံအကြောင်း ဒီအောက်မှာ ကြည့်ပါ။

```js wordWrap
var i = !pm.variables.get("i") ? 1 : Number(pm.variables.get("i"));

console.log("this is run " + i + " for request " + pm.execution.location.current);

if (i < 3) {
    pm.variables.set("i", i + 1);
    pm.execution.setNextRequest(pm.execution.location.current);
} else {
    pm.variables.unset("i"); // optional cleanup
    pm.execution.setNextRequest(null);
}
```

## Workflow ကို ရပ်တန့်ခြင်း

Workflow တစ်ခုကို ရပ်တန့်ဖို့ — post-response script ထဲက `pm.execution.setNextRequest()` function ရဲ့ argument နေရာမှာ `"null"` လို့ ထည့်နိုင်ပါတယ်။ လက်ရှိ request run ပြီးနောက်မှာ collection run က ရပ်သွားပါတယ်။ Collection run ကို iteration တစ်ခုထက်ပိုပြီး run ဖို့ configure လုပ်ထားရင်လည်း — iteration တစ်ခုချင်းစီက လက်ရှိ request ပြီးတာနဲ့ ရပ်ပါတယ်။

```js
pm.execution.setNextRequest(null);
```

တခြားနည်းတစ်ခုအနေနဲ့ — `pm.execution.skipRequest()` method ကို သုံးပြီး request တစ်ခုကို ကျော်သွားလို့လည်း ရပါတယ်။ [Skipping requests](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-execution/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Workflows တည်ဆောက်ရာမှာ သတိထားရမယ့် အချက်များ

`pm.execution.setNextRequest()` function သုံးတဲ့အခါ အောက်ပါအချက်တွေကို မှတ်ထားပါ။

### Collection တစ်ခုလုံး run လုပ်တဲ့အခါမှာ setNextRequest() ကို သုံးပါ

`pm.execution.setNextRequest()` က Collection Runner, Postman CLI ဒါမှမဟုတ် Newman နဲ့ collection တစ်ခုလုံး run လုပ်တဲ့အခါမှသာ အလုပ်လုပ်ပါတယ်။ Postman မှာ request တစ်ခုချင်း send လုပ်တဲ့အခါ — ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

### Pre-request ဒါမှမဟုတ် post-response scripts တွေမှာ setNextRequest() သုံးနိုင်ပါတယ်

`pm.execution.setNextRequest()` ကို request ရဲ့ pre-request script ဒါမှမဟုတ် post-response script ထဲမှာ သုံးလို့ရပါတယ်။ Value တစ်ခုထက်ပိုပြီး သတ်မှတ်မိခဲ့ရင် — နောက်ဆုံး သတ်မှတ်ထားတဲ့ value က အသာစီးရပါတယ်။

### Next request ကို request ID နဲ့ သတ်မှတ်ပါ

Request ရဲ့ နာမည်က ပြောင်းလဲလို့ရပေမယ့် — နာမည်ပြောင်းလိုက်တာက ID ကို မပြောင်းလဲစေပါဘူး။ ဒါကြောင့် next request ကို သတ်မှတ်တဲ့အခါ request ID ကို သုံးတာ အကောင်းဆုံးပါ။ ID ကို သတ်မှတ်တဲ့အခါ quotes ထဲမှာ ထည့်ပေးရပါမယ်။ ဥပမာ:

```js wordWrap
pm.execution.setNextRequest("1ab12345-4ab4-4124-c000-12341abc1234");
```

လက်ရှိ run နေတဲ့ request ရဲ့ ID ကို ရယူဖို့ — `pm.info.requestId` ကို သုံးပါ။ ဥပမာ `console.log(pm.info.requestId)` ဆိုပြီး run လုပ်ကြည့်ရင် လက်ရှိ request ရဲ့ ID ကို တွေ့ရပါမယ်။ [Script Workflows](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-info/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Postman UI ကနေလည်း request ID ကို ရယူလို့ရပါတယ် — request ကို ဖွင့်ပြီး right sidebar က **Info** icon ကို နှိပ်ပါ။ Request ID ရဲ့ ရှေ့မှာ user ID (ပထမ character block) က ရှေ့ဆက်ထည့်ပြီး ပြပါတယ်။

### setNextRequest() က အမြဲတမ်း နောက်ဆုံးမှ run ပါတယ်

`pm.execution.setNextRequest()` function က — script ထဲက ဘယ်နေရာမှာ ရှိနေပါစေ — လက်ရှိ request ပြီးတဲ့အခါမှသာ run ပါတယ်။ ဒီ function ရဲ့ နောက်မှာ code တွေ ထည့်ထားရင်တောင် — အဲဒီ code တွေက `pm.execution.setNextRequest()` မတိုင်ခင် run သွားပါတယ်။

### setNextRequest() ရဲ့ scope က collection ထဲမှာပဲ ကန့်သတ်ပါတယ်

`pm.execution.setNextRequest()` ရဲ့ scope က — ကိုယ့် collection run ရဲ့ source ဖြစ်ပါတယ်:

* Collection တစ်ခုလုံး run မယ်ဆိုရင် — collection ထဲက request ဘယ်ဟာကိုမဆို (folder တွေထဲက requests တွေ အပါအဝင်) next request အဖြစ် သတ်မှတ်လို့ရပါတယ်။
* Folder တစ်ခုပဲ run မယ်ဆိုရင် — `pm.execution.setNextRequest()` ရဲ့ scope က အဲဒီ folder ထဲမှာပဲ ကန့်သတ်ပါတယ်။ ဒီအခါ folder တစ်ခုထဲက requests တွေကိုပဲ next request အဖြစ် သတ်မှတ်လို့ရပြီး — တခြား folders တွေ ဒါမှမဟုတ် collection root မှာရှိတဲ့ requests တွေကိုတော့ သတ်မှတ်လို့မရပါဘူး။

ဒီပုံစံ branching နဲ့ looping ကို သုံးပြီး — requests တွေကြားမှာ data တွေ ပို့ဆောင်ကာ API scenario အမျိုးမျိုးကို လွှမ်းခြုံနိုင်တဲ့ [API scenario testing](https://www.postman.com/templates/collections/api-scenario-testing/) workflows တွေ တည်ဆောက်နိုင်ပါတယ်။

## နောက်ထပ်အဆင့်များ

Request workflows တည်ဆောက်ပုံ အခြေခံကို သိပြီးပြီဆိုရင် — scripts တွေ ရေးကြည့်နိုင်ပါပြီ။ Pre-request နဲ့ post-response scripts တွေ ရေးနည်း၊ script run order အသေးစိတ်ကို [Postman requests တွေမှာ logic နဲ့ tests ထည့်ရန် scripts သုံးခြင်း](/docs/postman/intro-to-scripts) မှာ ကြည့်နိုင်ပြီး — [Collection tests တွေ ရေးတာနဲ့တွဲပြီး](/docs/postman/testing) workflow တွေကို စမ်းသပ်နိုင်ပါတယ်။
