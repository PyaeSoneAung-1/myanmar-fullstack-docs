---
title: "Variables နဲ့ environments များဖြင့် data များကို ပြန်လည်အသုံးပြုခြင်း (Postman)"
description: "Variables နဲ့ environments အကြောင်း မိတ်ဆက် — variable ဆိုတာ ဘာလဲ, quick start နမူနာ, environments တွေ ဖန်တီးပြီး ပြောင်းလဲနည်း"
order: 81
source: "https://learning.postman.com/docs/use/send-requests/variables/variables-intro/"
status: translated
updated: 2026-09-02
---

*variable* ဆိုတာ — API requests တွေနဲ့ scripts တွေထဲမှာ သုံးနိုင်တဲ့ reusable value တစ်ခု ဖြစ်ပါတယ်။ Request ဒါမှမဟုတ် script တစ်ခု run တဲ့အခါ Postman က variable ရဲ့ local value ကို သုံးပါတယ်။ Variables တွေကို *environment* တစ်ခုထဲမှာ စုစည်းထားနိုင်ပြီး — ကိုယ့်ရဲ့ အလုပ်လုပ်နေတဲ့ context ပေါ်မူတည်ပြီး variable values တွေကို ပြောင်းလဲရတာ ပိုလွယ်ကူစေပါတယ်။

## Variables အမြန် စတင်ခြင်း

Variable တစ်ခုကို ဖန်တီးပြီး သုံးဖို့ —

1. Footer ထဲမှာ **Globals** ကို နှိပ်ပါ။
2. `my_variable` ဆိုတဲ့ နာမည်နဲ့ variable တစ်ခု ထည့်ပြီး `Hello` ဆိုတဲ့ value ပေးပါ။
3. Request tab အသစ်တစ်ခု ဖွင့်ပြီး URL အဖြစ် `https://postman-echo.com/get?var={{my_variable}}` ကို ရိုက်ထည့်ပါ။ Variable ရဲ့ value နဲ့ scope ကို စစ်ဆေးဖို့ variable နာမည်ပေါ်မှာ hover လုပ်ပါ။
4. **Send** ကို နှိပ်ပြီး request ကို ပို့ပါ။ Postman က variable value ကို API ဆီ ပို့လိုက်ကြောင်း အတည်ပြုတဲ့ response ကို စစ်ဆေးကြည့်ပါ။
5. Variables pane ကို ဖွင့်ဖို့ [workbench](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#environment-selector-and-variables-pane) ထဲမှာ **Variables** ကို နှိပ်ပါ။
6. **Variables in request** အောက်မှာ `my_variable` ရဲ့ value ကို ပြောင်းပြီး request ကို နောက်တစ်ကြိမ် ပို့ကြည့်ပါ။

Postman မှာ variables တွေ သုံးခြင်းအကြောင်း ပိုသိချင်ရင် — [variables တွေ သုံးပြီး values တွေကို သိမ်းဆည်းပြီး ပြန်သုံးခြင်း](/docs/postman/variables) ကို သွားပါ။

## Environments တွေကို ဖန်တီးခြင်းနဲ့ ပြောင်းခြင်း

Environments တွေနဲ့ဆိုရင် — Postman မှာ ကိုယ် လုပ်တဲ့ အလုပ်အမျိုးမျိုးအတွက် variables အစုံတွေ ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — test server တစ်ခုဆီ ဒါမှမဟုတ် production server တစ်ခုဆီ requests တွေ ပို့တဲ့အခါ value အမျိုးမျိုး သုံးချင်နိုင်ပါတယ်။

စတင်ဖို့ — Postman မှာ [environments တွေကို ဖန်တီးပြီး ပြောင်းလဲနည်း](/docs/postman/managing-environments) ကို လေ့လာပါ။ ပြီးရင် — environment တစ်ခုချင်းစီမှာ [variables တွေကို ထည့်ပြီး တည်းဖြတ်နိုင်](/docs/postman/environment-variables)ပါတယ်။ Team နဲ့ ပူးပေါင်းဆောင်ရွက်ဖို့ [environments တွေကို သုံးပြီး](https://learning.postman.com/docs/use/send-requests/variables/team-environments/) — sensitive data တွေကို share လုပ်ပြီး စီမံခန့်ခွဲနိုင်ပါတယ်။
