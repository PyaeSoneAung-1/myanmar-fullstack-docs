---
title: "Webhooks တွေကို သုံးပြီး collection runs တွေကို trigger လုပ်ခြင်း (Trigger Collection Runs Using Webhooks)"
description: "Collection webhooks တွေ ဘယ်လို အလုပ်လုပ်လဲ — Postman API နဲ့ webhook ဖန်တီးနည်း, scripts တွေထဲမှာ request body ရယူနည်း, payload data သုံးပြီး output တခြား API ဆီ ပို့နည်း"
order: 48
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/collection-webhooks/"
status: translated
updated: 2026-09-02
---

Webhook ဆိုတာ — application တစ်ခုကနေ အခြား application တစ်ခုဆီကို data တွေကို အလိုအလျောက် ပို့ပေးဖို့ နည်းလမ်းတစ်ခုပါ။ Postman API ရဲ့ POST `/webhooks` endpoint ကို သုံးပြီး — collection တစ်ခုအတွက် webhook တစ်ခု ဖန်တီးနိုင်ပါတယ်။ ဒါက webhook ကို သတ်မှတ်ထားတဲ့ အချိန်တစ်ခု ဒါမှမဟုတ် event တစ်ခု ဖြစ်ပေါ်တဲ့အခါ — collection ကို run စေမယ့် monitor တစ်ခုကို ဖန်တီးပေးပါတယ်။

ဒါ့အပြင် webhook ဆီကို custom payload တစ်ခုလည်း ပို့နိုင်ပြီး — collection run လုပ်တဲ့အခါ Postman က အဲဒီ data တွေကို ဝင်ရောက်သုံးနိုင်ပါတယ်။ ဒါဆိုရင် — environment တစ်ခု မလိုဘဲ collection တစ်ခုကို run လုပ်နိုင်ပြီး — အဲဒီအစား webhook ဆီကို ပို့လိုက်တဲ့ data တွေပေါ်မှာပဲ မှီခိုနိုင်ပါတယ်။

## Webhook တစ်ခု ဖန်တီးခြင်း

Collection webhook တစ်ခုနဲ့ဆိုရင် — သတ်မှတ်ထားတဲ့ events တွေ trigger ဖြစ်တဲ့အခါ data တွေကို webhook URL ဆီကို POST request တစ်ခုနဲ့ ပို့ပေးပါတယ်။ Data တွေ ပို့ပေးမယ့် application ကိုရော trigger events တွေကိုရော ကိုယ်တိုင် configure လုပ်ရပါမယ်။ Collection တစ်ခုအတွက် webhooks တွေကို [Postman API](https://learning.postman.com/docs/reference/postman-api/intro-api/) ကို သုံးပြီးမှ ဖန်တီးရပါတယ်။ Postman API ကို သုံးပြီး [webhook တစ်ခု ဖန်တီးနည်း](https://learning.postman.com/api-docs/api-reference/webhooks/create-webhook/) ကို လေ့လာပါ။

Webhook ဆီကို ပို့လိုက်တဲ့ data တွေကို ဝင်ရောက်သုံးဖို့ — [`pm.globals.get` method](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-variables/#pmglobals) ကို `previousRequest` global variable နဲ့အတူ သုံးပါ။ [Scripts](/docs/postman/intro-to-scripts) တွေကို သုံးပြီး — အဲဒီ data တွေကို parse လုပ်ကာ collection run အတွင်း လိုသလို မည်သည့်နည်းနဲ့မဆို သုံးနိုင်ပါတယ်။

## Scripts တွေထဲမှာ request body ကို ရယူခြင်း

Webhook ကို trigger လုပ်တဲ့အခါ — `previousRequest` global [variable](/docs/postman/variables) ကို ယာယီ ဖန်တီးလိုက်ပြီး — သူ့ရဲ့ value က webhook ရဲ့ POST request body ကို JSON string တစ်ခုအနေနဲ့ ဖြစ်ပါတယ်။ Webhook ရဲ့ request body ကို ရယူဖို့ `pm.globals.get('previousRequest')` method ကို သုံးပြီး — `JSON.parse()` နဲ့ parse လုပ်ပါ။ Webhook ဆီကို ပို့လိုက်တဲ့ data တွေက parse လုပ်ပြီးသား object ထဲက `data` parameter ထဲမှာ ရနိုင်ပါတယ် — အောက်က ဥပမာ code မှာ ပြထားတဲ့အတိုင်းပါ:

```js
var previousRequest = JSON.parse(pm.globals.get('previousRequest'));

var webhookRequestData = previousRequest.data;

// webhookRequestData contains the data sent to your webhook.
console.log(JSON.stringify(webhookRequestData));
```

Webhook ဆီကို ပို့တဲ့ request body က JSON format နဲ့ ဖြစ်ရပါမယ်။

[Postman API](https://learning.postman.com/docs/reference/postman-api/intro-api/) ကို သုံးပြီး [webhook တစ်ခု ဖန်တီး](#webhook-တစ်ခု-ဖန်တီးခြင်း) လုပ်တဲ့အခါ — webhook အတွက် monitor တစ်ခုကိုပါ ဖန်တီးပေးပါတယ်။ Monitor ကို သုံးပြီး ဥပမာ code ကို run ဖို့ — သီးခြား request တစ်ခုထဲမှာ webhook ကို trigger လုပ်ရပါမယ်။ ပြီးရင် Console ထဲကို log တင်ထားတဲ့ [monitor run details တွေကို ကြည့်နိုင်ပါတယ်](https://learning.postman.com/docs/monitoring-your-api/viewing-monitor-results/#console-log)။ Monitor results အကြောင်း ပိုသိချင်ရင် — [Monitor results တွေကို ကြည့်ခြင်း](https://learning.postman.com/docs/monitoring-your-api/viewing-monitor-results/) ကို ကြည့်ပါ။

## Output တွေကို အခြား API တစ်ခုဆီ ပို့ခြင်း

Collection webhook ဆီကို ပို့လိုက်တဲ့ data တွေကို သုံးပြီး — logic တစ်ခု သတ်မှတ်ကာ အခြား API တစ်ခုကို trigger လုပ်နိုင်ပါတယ်။ ဥပမာ — ကိုယ့် GitHub repository အတွက် webhook တစ်ခု သတ်မှတ်ထားနိုင်ပါတယ်။ Repository ထဲမှာ ဖြစ်ပေါ်နေတဲ့ updates တွေအပေါ် အခြေခံပြီး — custom build pipelines တွေ run ဖို့ ဒါမှမဟုတ် CI tests တွေ လုပ်ဆောင်ဖို့ webhook ကို သုံးနိုင်ပါတယ်။

## Collection run တစ်ခုကို trigger လုပ်ဖို့ တခြားနည်းလမ်းများ

Webhooks တွေအပြင် — collection run တစ်ခုကို အောက်ပါနည်းလမ်းတွေနဲ့လည်း trigger လုပ်နိုင်ပါတယ်:

* **Monitor တစ်ခုကို schedule လုပ်ခြင်း** — ကိုယ့် collection ကို schedule တစ်ခုပေါ်မှာ run ဖို့ monitor တစ်ခု သတ်မှတ်ပါ။ ပိုသိချင်ရင် — [Postman မှာ monitor တစ်ခု သတ်မှတ်ခြင်း](/docs/postman/setting-up-monitor) ကို ကြည့်ပါ။

* **Postman CLI နဲ့ monitor တစ်ခုကို trigger လုပ်ခြင်း** — Postman CLI က trigger လုပ်တဲ့အခါ run ဖို့ monitor တစ်ခုကို configure လုပ်ပါ။ ပိုသိချင်ရင် — [Monitors တွေကို run လုပ်ခြင်း](https://learning.postman.com/docs/monitoring-your-api/setting-up-monitor/) နဲ့ [Postman CLI ကို သုံးပြီး monitor တစ်ခု run လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-run-monitor/) တို့ကို ကြည့်ပါ။

* **Collection run တစ်ခုကို schedule လုပ်ခြင်း** — Collection Runner ကနေ သတ်မှတ်ထားတဲ့ အချိန်တစ်ခုမှာ collection တစ်ခုကို run လုပ်ပါ။ ပိုသိချင်ရင် — [Collection runs တွေကို အချိန်ဇယားနဲ့ အလိုအလျောက် run လုပ်ခြင်း](/docs/postman/scheduling-collection-runs) ကို ကြည့်ပါ။

* **Postman CLI နဲ့ collection တစ်ခုကို run လုပ်ခြင်း** — ကိုယ့် development pipeline ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ collections တွေကို run ဖို့ Postman CLI ကို သုံးပါ။ ပိုသိချင်ရင် — [Postman CLI overview](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) ကို ကြည့်ပါ။
