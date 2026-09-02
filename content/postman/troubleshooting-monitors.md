---
title: "Postman မှာ monitors တွေကို troubleshoot လုပ်ခြင်း (Troubleshoot monitors in Postman)"
description: "Monitor ပြဿနာတွေကို ဖော်ထုတ် ဖြေရှင်းနည်း — failed monitor runs တွေကို Console Log နဲ့ ကြည့်ရှုခြင်း, local run attempts နဲ့ variable ပြဿနာတွေကို debug လုပ်ခြင်း, အချက်အလက်တွေ log လုပ်ခြင်း နဲ့ uncaught errors"
order: 68
source: "https://learning.postman.com/docs/monitoring-your-api/troubleshooting-monitors/"
status: translated
updated: 2026-09-02
---

Monitor တစ်ခုမှာ ပြဿနာတစ်ခု ကြုံရရင် — အောက်ပါ troubleshooting အဆင့်တွေက ပြဿနာကို ဖော်ထုတ်ပြီး ဖြေရှင်းဖို့ ကူညီပေးနိုင်ပါတယ်။

## Failed monitors တွေကို ကြည့်ရှုခြင်း

[Console Log](/docs/postman/viewing-monitor-results#console-log) က ကိုယ့် monitors တွေမှာ ကြုံရနိုင်တဲ့ ပြဿနာတွေကို debug လုပ်ဖို့ ကူညီပေးနိုင်ပါတယ်။

1. ကိုယ့် workspace ကို သွားပြီး sidebar ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon) **Services** tab ကို နှိပ်ကာ **Monitors** ကို ချဲ့ပါ။
2. Monitor တစ်ခုကို ရွေးပြီး — performance graph ထဲက failed monitor run တစ်ခုကို နှိပ်ပါ။
3. ကိုယ့် pre-request နဲ့ post-response scripts တွေထဲမှာ ထည့်ထားတဲ့ `console.log()` statements တွေနဲ့အတူ monitor run အသေးစိတ်တွေကို ကြည့်ဖို့ **Console Log** ကို နှိပ်ပါ။
4. (ထည့်စရာမလို) **Search console logs** ကို နှိပ်ပြီး "error" ဒါမှမဟုတ် "failed" လိုမျိုး search term တစ်ခု ရိုက်ထည့်ပါ။ Log ထဲမှာ Matches တွေကို highlight လုပ်ပေးပါတယ်။ သူတို့ကြားမှာ ဖြတ်သန်းဖို့ ![Down Large icon](https://assets.postman.com/postman-docs/aether-icons/direction-down-large.svg#icon) **Next match** နဲ့ ![Up Large icon](https://assets.postman.com/postman-docs/aether-icons/direction-up-large.svg#icon) **Previous match** ကိုလည်း နှိပ်နိုင်ပါတယ်။

![Failed monitor run Console log](https://assets.postman.com/postman-docs/v11/monitor-console-log-failed-run-v11-75-2.png)

Postman Console နဲ့ debug လုပ်ခြင်းအကြောင်း ပိုသိချင်ရင် — [Troubleshooting API requests](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) ကို ကြည့်ပါ။

## Local run attempts တွေကို debug လုပ်ခြင်း

* Failure ဖြစ်နေတဲ့ monitor ရဲ့ collection ကို ၎င်းရဲ့ environment နဲ့အတူ Postman ဒါမှမဟုတ် [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) ထဲမှာ run ကြည့်ပါ။
* Local run က အောင်မြင်သွားရင် — ကိုယ့် ပြောင်းလဲမှုတွေကို Postman Cloud ဆီ [sync](https://learning.postman.com/docs/getting-started/basics/syncing/) လုပ်နေလား စစ်ဆေးပါ။

## Variable ပြဿနာတွေကို debug လုပ်ခြင်း

* Local runs တွေရော monitor runs တွေရောမှာ တူညီတဲ့ environment ကို သုံးနေကြောင်း သေချာပါစေ။ ဒါကို အတည်ပြုဖို့ — ကိုယ့် request scripts တွေထဲမှာ `console.log(environment);` ကို ထည့်ပြီး monitoring နဲ့ local runs နှစ်ခုလုံးမှာ ရလဒ်တွေကို နှိုင်းယှဉ်ကြည့်ပါ။
* ကိုယ့် collection run က မှီခိုနေတဲ့ collection ဒါမှမဟုတ် environment variables တွေကို [share](/docs/use/send-requests/variables/share-variables) လုပ်ထားကြောင်း သေချာပါစေ။ Monitors တွေက Postman cloud ထဲမှာ run တာကြောင့် — values တွေကို share လုပ်ထားတဲ့ variables တွေကိုပဲ သုံးနိုင်ပါတယ်။ (Sharing လုပ်တာက variable values တွေကို Postman cloud ဆီ sync လုပ်ပေးပါတယ်။)
* ကိုယ့် collection run က save ထားတဲ့ global variable တစ်ခုပေါ် မှီခိုနေရင် — အဲဒါကို environment variable တစ်ခုအဖြစ် ပြောင်းပြီး ၎င်းရဲ့ value ကို [share](/docs/use/send-requests/variables/share-variables) လုပ်ပါ။ Save ထားတဲ့ global variables တွေကို monitors တွေမှာ ပံ့ပိုးမပေးပါဘူး။

## သက်ဆိုင်ရာ အချက်အလက်တွေကို log လုပ်ခြင်း

* မျှော်လင့်မထားတဲ့ response bodies တွေ ဒါမှမဟုတ် header values တွေက monitor ပြဿနာတွေရဲ့ အရင်းအမြစ် ဖြစ်နိုင်ပါတယ်။ ဒါတွေကို အောက်ပါ code နဲ့ log လုပ်နိုင်ပါတယ်:

  ```js
  console.log(JSON.stringify(responseBody, null, 2));
  console.log(JSON.stringify(responseHeaders, null, 2));
  ```

## Uncaught errors တွေ

* ကိုယ့် collection ထဲက test နဲ့ pre-request scripts တွေ အပြည့်အဝ run ပြီးမြောက်ကြောင်း သေချာစေဖို့ — သံသယဖြစ်စရာ code တွေကို `try - catch` block တစ်ခုထဲမှာ ထည့်ပါ။
