---
title: "Postman မှာ environment variables များကို တည်းဖြတ်ခြင်းနဲ့ သတ်မှတ်ခြင်း"
description: "Environment variables တွေကို တည်းဖြတ်ခြင်း — variables ထည့်/ပြင်/ဖျက်ခြင်း, secure သတ်မှတ်ခြင်း, variables pane ကနေ တည်းဖြတ်ခြင်း နဲ့ scripts ကနေ environment variables သတ်မှတ်ခြင်း"
order: 80
source: "https://learning.postman.com/docs/use/send-requests/variables/environment-variables/"
status: translated
updated: 2026-09-02
---

[environment](/docs/postman/managing-environments) ဆိုတာ — Postman မှာ ကိုယ့်ရဲ့ အလုပ်လုပ်တဲ့ context ပေါ်မူတည်ပြီး values တွေ ပြောင်းလဲနိုင်တဲ့ variables အစုတစ်စု ဖြစ်ပါတယ်။ [environment တစ်ခု ဖန်တီးပြီး](/docs/postman/managing-environments)တာနဲ့ — environment variables အသစ်တွေ ထည့်ခြင်း၊ သူတို့ရဲ့ values တွေကို update လုပ်ခြင်း ဒါမှမဟုတ် variables တွေကို ဖျက်ခြင်း စတာတွေ လုပ်နိုင်ပါတယ်။ Scripts တွေ သုံးပြီးလည်း environment values တွေကို သတ်မှတ်နိုင်သလို — variable values တွေကို team ထဲ ရနိုင်အောင် share လုပ်နိုင်ပါတယ်။

## Environment variables တွေကို တည်းဖြတ်ခြင်း

Environment variables တွေကို — variables အသစ်တွေ ထည့်ခြင်း၊ variable တစ်ခုရဲ့ value ကို ပြောင်းလဲခြင်း၊ value တစ်ခုကို secure အဖြစ် မှတ်သားခြင်း ဒါမှမဟုတ် variables တွေကို ဖျက်ခြင်း အားဖြင့် တည်းဖြတ်နိုင်ပါတယ်။

Team တစ်ခုရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ environments တွေနဲ့ အလုပ်လုပ်နေရင် — environment နဲ့ သူ့ရဲ့ values တွေကို တည်းဖြတ်ဖို့ Editor role ရှိရပါမယ်။ [Environments တွေကို share လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/team-environments/#share-an-environment) အကြောင်း ပိုလေ့လာပါ။

Environment variables တွေကို တည်းဖြတ်ဖို့ — sidebar ထဲမှာ **Environments** ကို ရွေးပြီး environment တစ်ခုကို ရွေးပါ။ ဒီကနေ အောက်ပါ လုပ်ဆောင်ချက်တွေ လုပ်နိုင်ပါတယ်:

* Environment variables တွေရဲ့ စာရင်းကို နာမည် ဒါမှမဟုတ် value အလိုက် စစ်ထုတ်ဖို့ — **Search** ကို နှိပ်ပြီး ရှာဖွေစရာ စာသားကို ရိုက်ထည့်ပါ။
* Environment variables တွေရဲ့ စာရင်းကို စီဖို့ — column header တစ်ခုကို ရွေးပါ။ Ascending နဲ့ descending အစဉ်ကြား ပြောင်းနိုင်ပါတယ်။ စာရင်းကို ကိုယ်တိုင် စီချင်ရင် — လိုအပ်ရင် column header တစ်ခုကို ရွေးပြီး sort order ကို ရှင်းလင်းကာ handles တွေနဲ့ rows တွေကို ဆွဲယူပါ။
* Environment variable အသစ်တစ်ခု ထည့်ဖို့ — table ရဲ့ အောက်ဆုံး row မှာ **Add variable** ကို နှိပ်ပါ။
* Environment variable တစ်ခုကို ဖျက်ဖို့ — variable တစ်ခုပေါ်မှာ hover လုပ်ပြီး **Delete** ကို နှိပ်ပါ။
* Environment variable တစ်ခုကို မဖျက်ဘဲ မရနိုင်အောင် လုပ်ဖို့ — variable ဘေးက checkbox ကို ရှင်းလင်းပါ။ Variable ကို ကိုးကားထားတဲ့ နေရာတွေက value မရှိတဲ့ empty variables တွေ ဖြစ်သွားပါလိမ့်မယ်။ Variable ကို ပြန်ရနိုင်အောင် လုပ်ဖို့ — checkbox ကို ရွေးပါ။

Environment variable တစ်ခုကို တည်းဖြတ်ဖို့ — variable ကို ရွေးပြီး အောက်ပါတွေထဲက တစ်ခုခုကို ပြောင်းလဲပါ:

* **Variable** — variable ရဲ့ နာမည်။ ဒီနာမည်ကို requests နဲ့ scripts တွေထဲမှာ [variable ကို ကိုးကားဖို့](/docs/postman/managing-environments) သုံးပါ။
* **Secure** — variable နာမည်ဘေးက **Secure** ကို နှိပ်ပြီး variable ကို secure အဖြစ် သတ်မှတ်ပါ။ [variable တစ်ခုကို secure အဖြစ် သတ်မှတ်ခြင်း](/docs/postman/define-variables) အကြောင်း ပိုလေ့လာပါ။
* **Value** — ဒီ value ကို ကိုယ့်ရဲ့ local Postman instance ထဲမှာ requests တွေ ပို့တဲ့အခါ သုံးပါတယ်။ ဒါကို Postman cloud ဆီ ဘယ်တော့မှ sync မလုပ်ဘဲ — team နဲ့လည်း မျှဝေမှာ မဟုတ်ပါဘူး။ [environment variable ရဲ့ value ကို share လုပ်ပြီး](/docs/postman/share-variables) Postman cloud နဲ့ sync လုပ်နိုင်ပါတယ်။

ဒီအပြောင်းအလဲတွေက ကိုယ့်ရဲ့ variables တွေကို အလိုအလျောက် သိမ်းဆည်းပေးပါတယ်။

## Variables pane ကနေ variables တွေကို တည်းဖြတ်ခြင်း

[active environment](/docs/postman/managing-environments) ထဲက variables တွေရဲ့ local value ကို ကြည့်ရှုပြီး တည်းဖြတ်ဖို့ variables pane ကို သုံးပါ။ ဖွင့်ထားတဲ့ request ထဲမှာ သုံးထားတဲ့ environment variables တွေကို ကြည့်နိုင်ပါတယ်။ Postman element တစ်ခုကနေလည်း active environment ထဲက environment variables တွေကို ကြည့်နိုင်ပါတယ်။

Environment selector ကနေ environment တစ်ခုကို ရွေးပြီး — variables pane ကို ဖွင့်ဖို့ **Variables** ကို နှိပ်ပါ။ Environment variable တစ်ခုရဲ့ ရှိပြီးသား value ကို ဖျက်ပြီး value အသစ်တစ်ခု ရိုက်ထည့်ပါ။

Environment variable ရဲ့ reference ပေါ်မှာလည်း hover လုပ်ပြီး — ရှိပြီးသား value ကို ဖျက်ကာ value အသစ်တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။

Element တစ်ခုကနေ [variables တွေကို ကြည့်ရှုခြင်းနဲ့ တည်းဖြတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/view-variables/) အကြောင်း ပိုလေ့လာပါ။

## Scripts တွေကနေ environment variables တွေကို သတ်မှတ်ခြင်း

**Pre-request** နဲ့ **Post-response** scripts တွေကနေ environment variables တွေရဲ့ values တွေကို ပြောင်းလဲနိုင်ပါတယ်။ [active environment](/docs/postman/managing-environments) ထဲမှာ environment variable တစ်ခုကို သတ်မှတ်ဖို့ [`pm.environment` method](/docs/postman/sandbox-pm-variables) ကို သုံးပါ:

```js
pm.environment.set("variable_key", "variable_value");
```

Environment variables တွေအတွက် values တွေ သတ်မှတ်ဖို့ scripts တွေကို သုံးရင် — ဒီ values တွေက variable တွေကို ကိုးကားထားတဲ့ requests အားလုံးမှာ ထင်ဟပ်ပါလိမ့်မယ်။ ဥပမာ — run တစ်ခုအတွင်း နဲ့ run ပြီးနောက်မှာ requests အစုတစ်စုအတွက် update လုပ်ထားတဲ့ values တွေကို သုံးဖို့ — [collection runner](/docs/postman/intro-to-collection-runs) နဲ့ [monitors](/docs/postman/intro-monitors) တွေနဲ့ တွဲပြီး environments တွေကို သုံးနိုင်ပါတယ်။

Script တစ်ခုကနေ environment variables အသစ်တွေ ဖန်တီးဖို့ — environment အတွက် Editor access ရှိရပါမယ်။ Viewer access နဲ့ script ထဲမှာ value တစ်ခုကို update ဒါမှမဟုတ် unset လုပ်ရင် — အဲဒီအပြောင်းအလဲက ကိုယ့်အတွက်တော့ မြင်ရပေမယ့် — team members တွေနဲ့ မျှဝေမှာ မဟုတ်ပါဘူး။ [Environments တွေကို share လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/team-environments/#share-an-environment) အကြောင်း ပိုလေ့လာပါ။
