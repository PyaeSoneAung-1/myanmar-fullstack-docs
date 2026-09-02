---
title: "Variables များကို အသုံးပြုခြင်း (Use variables)"
description: "Variables တွေကို ဘယ်လို သုံးမလဲ — {{}} syntax နဲ့ ကိုးကားခြင်း, dynamic variables, scripts တွေထဲမှာ pm.variables.get() သုံးခြင်း, variables log လုပ်ခြင်း နဲ့ data variables"
order: 79
source: "https://learning.postman.com/docs/use/send-requests/variables/use-variables/"
status: translated
updated: 2026-09-02
---

Postman တစ်လျှောက်လုံးမှာ variables တွေကို ကိုးကားဖို့ double curly braces (`{{` နဲ့ `}}`) တွေကို သုံးနိုင်ပါတယ်။ ဥပမာ — request တစ်ခုရဲ့ authorization settings ထဲမှာ `username` variable တစ်ခုကို ကိုးကားဖို့ အောက်ပါ syntax ကို သုံးပါ:

```js
{{username}}
```

Request တစ်ခု run တဲ့အခါ — Postman က variable ကို ဖြေရှင်းပြီး ကိုယ့်ရဲ့ value နဲ့ အစားထိုးပါတယ်။ ဥပမာ — variable တစ်ခုကို ကိုးကားထားတဲ့ request URL တစ်ခု ရှိနိုင်ပါတယ်:

```js
https://postman-echo.com/get?customer_id={{cust_id}}
```

Request run တဲ့အခါ Postman က `cust_id` variable အတွက် သိမ်းထားတဲ့ value ကို ပို့ပေးပါတယ်။ `cust_id` မှာ `3` ဆိုတဲ့ value ရှိရင် — request ကို query parameter ပါတဲ့ အောက်ပါ URL ဆီ ပို့ပါတယ်:

```bash
https://postman-echo.com/get?customer_id=3
```

Request body တစ်ခုထဲကနေ variable တစ်ခုကို access လုပ်ဖို့ — သူ့ရဲ့ reference ကို double-quotes တွေအတွင်းမှာ ထည့်ပါ:

```js
{ "customer_id" : "{{cust_id}}" }
```

Variables တွေကို request URLs, parameters, headers, authorization, body နဲ့ header presets တွေထဲမှာ သုံးနိုင်ပါတယ်။ Variable တစ်ခုပေါ်မှာ hover လုပ်တဲ့အခါ — Postman က သူ့ရဲ့ value နဲ့ scope ကို ပြသပေးပါတယ်။ Requests တွေထဲကို variables တွေ ထည့်တဲ့အခါ — Postman က ရှိပြီးသား variables တွေကိုလည်း ပြသပေးပါတယ်။

ဒီ prompt က local value, scope (အရောင်နဲ့ မီးမောင်းထိုးထား) နဲ့ သက်ဆိုင်ရာ **Overridden** status တွေကို ဖော်ပြပေးပါတယ်။ Variable တစ်ခုကို [secure](/docs/postman/define-variables) အနေနဲ့ သတ်မှတ်ထားရင် — variable ပေါ်မှာ hover လုပ်ပြီး value ကို ပြသဖို့ view icon ကို နှိပ်နိုင်ပါတယ်။ Secure အနေနဲ့ သတ်မှတ်ထားတဲ့ variables အားလုံးရဲ့ values တွေကို ပြသဖို့ **⌘** ဒါမှမဟုတ် **Ctrl** ကို ဖိထားနိုင်ပါတယ်။

Variable တစ်ခုမှာ value မရှိဘူးဆိုရင် — Postman က အနီရောင်နဲ့ မီးမောင်းထိုးပြပါတယ်။ ဒါ့အပြင် — workbench ရဲ့ ညာဘက်အပေါ်မှာ ရှိတဲ့ **Variables** ပေါ်မှာလည်း အနီရောင် exclamation point တစ်ခု ပြသပါတယ်။ ဒါကို ဘယ်လို ဖြေရှင်းရမလဲဆိုတဲ့ အချက်အလက်တွေအတွက် — [Fix empty variables](https://learning.postman.com/docs/use/send-requests/variables/view-variables/#fix-empty-variables) ကို ကြည့်ပါ။

## Dynamic variables တွေကို သုံးခြင်း

Postman က requests တွေထဲမှာ သုံးနိုင်တဲ့ dynamic variables တွေ ပေးပါတယ်။ Dynamic variables တွေရဲ့ ဥပမာတွေကတော့:

* `{{$guid}}` — v4-style GUID တစ်ခု။
* `{{$timestamp}}` — လက်ရှိ Unix timestamp — စက္ကန့်ပိုင်းနဲ့။
* `{{$randomInt}}` — 0 ကနေ 1000 ကြားက random integer တစ်ခု။

Value တွေရဲ့ စာရင်း အပြည့်အစုံအတွက် — [random data တွေကို ပြန်ပေးဖို့ dynamic variables တွေ သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/variables-list/) ကို ကြည့်ပါ။

## Scripts တွေထဲမှာ variables တွေကို သုံးခြင်း

Scripts တွေထဲမှာ scope level ကို ကိုယ်စားပြုတဲ့ object နဲ့ `.get` method ကို သုံးပြီး variable တစ်ခုရဲ့ local value ကို ရယူနိုင်ပါတယ်:

```js
// local အပါအဝင် scope တိုင်းမှာ variable တစ်ခုကို access လုပ်ပါ
pm.variables.get("variable_key");
// global variable တစ်ခုကို access လုပ်ပါ
pm.globals.get("variable_key");
// collection variable တစ်ခုကို access လုပ်ပါ
pm.collectionVariables.get("variable_key");
// environment variable တစ်ခုကို access လုပ်ပါ
pm.environment.get("variable_key");
// ကိုယ့် local vault ထဲက vault secret တစ်ခုကို access လုပ်ပါ
await pm.vault.get("secret_key")
```

Scripts တွေထဲမှာ variables တွေကို access လုပ်ဖို့ `pm.variables.get()` ကို သုံးခြင်းက — script ရဲ့ လုပ်ဆောင်နိုင်စွမ်းကို မထိခိုက်စေဘဲ variable scope ကို ပြောင်းလဲနိုင်စေပါတယ်။ ဒီ method က အမြင့်ဆုံး precedence (ဒါမှမဟုတ် အကျဉ်းဆုံး scope) ရှိတဲ့ variable ကို ပြန်ပေးပါတယ်။

Postman က vault secrets တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ `pm.variables` ကို support မလုပ်ပါဘူး။

Pre-request ဒါမှမဟုတ် post-response scripts တွေထဲမှာ [dynamic variables](#dynamic-variables-တွေကို-သုံးခြင်း) တွေကို သုံးဖို့ — `pm.variables.replaceIn()` ကို သုံးပါ။ ဥပမာ:

```js
pm.variables.replaceIn('{{$randomFirstName}}')
```

Variables တွေနဲ့ scripting လုပ်ခြင်း အကြောင်း အသေးစိတ်အတွက် — [Postman Sandbox API reference](/docs/postman/sandbox-overview) ကို ကြည့်ပါ။

### Variables တွေကို log လုပ်ခြင်း

Requests တွေ run နေစဉ်မှာ variable values တွေကို [Postman Console](/docs/postman/troubleshooting-api-requests) ထဲကို log လုပ်နိုင်ပါတယ်။ Variable တစ်ခုရဲ့ value ကို log လုပ်ဖို့ script ထဲမှာ အောက်ပါ syntax ကို သုံးပါ:

```js
console.log(pm.variables.get("variable_key"));
```

ရလဒ်တွေကို ကြည့်ဖို့ — footer ထဲမှာ **Console** ကို နှိပ်ပါ။ **View > Show Postman Console** ကို ရွေးပြီးလည်း Console ကို access လုပ်နိုင်ပါတယ်။

## Data variables တွေကို သုံးခြင်း

Collection Runner က CSV ဒါမှမဟုတ် JSON file တစ်ခုကို import လုပ်ပြီး — data file ထဲက values တွေကို requests နဲ့ scripts တွေထဲမှာ သုံးနိုင်စေပါတယ်။ Data variable တစ်ခုကို Postman ထဲမှာ သတ်မှတ်လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ သူက data file ကနေ လာတာမို့ပါ။ ဒါပေမယ့် — ဥပမာ `pm.iterationData.get("variable_name")` ကို သုံးပြီး scripts တွေထဲမှာ data variables တွေကို access လုပ်နိုင်ပါတယ်။

ပိုအသေးစိတ်အတွက် — [data files တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/working-with-data-files) နဲ့ [Postman Sandbox API reference](/docs/postman/sandbox-overview) တို့ကို ကြည့်ပါ။
