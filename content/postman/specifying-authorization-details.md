---
title: "Postman မှာ API requests တွေဆီ authorization details တွေ ထည့်ခြင်း (Add Authorization Details to API Requests in Postman)"
description: "Request တစ်ခုရဲ့ Authorization tab ကနေ auth type ရွေးပြီး details တွေ ဖြည့်နည်း, authorization details တွေ ကြည့်ရှုခြင်း, parent collection/folder ကနေ authorization အမွေဆက်ခံခြင်း"
order: 34
source: "https://learning.postman.com/docs/use/send-requests/authorization/specifying-authorization-details/"
status: translated
updated: 2026-09-02
---

Postman မှာ request တစ်ခု ဖွင့်ထားရင် — **Authorization** tab ကို သုံးပြီး auth type တစ်ခု ရွေးကာ ကိုယ့်ရွေးထားတဲ့ type အတွက် သက်ဆိုင်ရာ details တွေကို ဖြည့်ပါ။ မှန်ကန်တဲ့ data values တွေကို server ဘက်က ကိုယ့် API က သတ်မှတ်ပါတယ်။ Third-party API တစ်ခု သုံးနေရင် — လိုအပ်တဲ့ auth details တွေအတွက် provider ရဲ့ documentation ကို ကိုးကားပါ။

Guided Auth ကို သုံးပြီး supported public APIs တွေအတွက် authentication credentials တွေ setup လုပ်နိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Guided Auth သုံးပြီး public APIs တွေအတွက် authorization သတ်မှတ်ခြင်း](/docs/postman/authentication-for-public-apis) ကို ကြည့်ပါ။

## Authorization type တစ်ခု ရွေးချယ်ခြင်း

**Auth Type** dropdown list ကနေ auth type တစ်ခု ရွေးလိုက်ရင် — ကိုယ့်ရဲ့ details တွေကို request ရဲ့ ဘယ်အပိုင်းတွေမှာ ထည့်မလဲ ဆိုတာကို Postman က ညွှန်ပြပါတယ်။ ဥပမာ — header, body, URL ဒါမှမဟုတ် query parameters တွေပါ။ ကိုယ်က ရွေးလိုက်တဲ့အခါ ဒါမှမဟုတ် ရိုက်ထည့်လိုက်တဲ့အခါ — Postman က ကိုယ့်ရဲ့ auth details တွေကို request ရဲ့ သက်ဆိုင်ရာ အပိုင်းတွေထဲကို ထည့်ပေးပါတယ်။ ဒါကြောင့် request ကို run မလုပ်ခင် — Postman က ကိုယ့် data တွေကို ဘယ်လို ပို့မလဲ ဆိုတာ ကြိုကြည့်လို့ရပါတယ်။

Authorization type တစ်ခုချင်းစီ setup လုပ်နည်း အသေးစိတ်အတွက် — [Postman က ပံ့ပိုးထားတဲ့ authorization types](/docs/postman/authorization-types) ကို ကြည့်ပါ။

ဒီ auth types တွေကို Postman မှာရော — [monitors](/docs/postman/intro-monitors) တွေမှာရော [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) မှာပါ သုံးနိုင်ပါတယ်။

## Authorization details တွေကို ကြည့်ရှုခြင်း

Authorization type တစ်ခုကို ရွေးပြီး setup လုပ်ပြီးတာနဲ့ — ကိုယ့်ရဲ့ data တွေက request ရဲ့ သက်ဆိုင်ရာ အပိုင်းတွေမှာ ပေါ်ပါတယ်။ ဥပမာ — **Headers** tab ထဲမှာ အလိုအလျောက် ထည့်လိုက်တဲ့ headers တွေကို ကြည့်ဖို့ **hidden** ကို နှိပ်ပါ။

Header တစ်ခုပေါ်မှာ mouse ချ (hover) လုပ်ရင် — အဲဒီ header ကို ဘယ်နေရာကနေ ထည့်လိုက်တာလဲ ဆိုတဲ့ အချက်အလက်ကို မြင်ရပါတယ်။ Auth header တစ်ခုကို ပြောင်းချင်ရင် — **Authorization** tab ဆီ ပြန်သွားပြီး ကိုယ့်ရဲ့ configuration ကို update လုပ်ပါ။

**Headers** tab ထဲမှာ — **Authorization** ရွေးချယ်မှုတွေကနေ ထည့်လိုက်တဲ့ headers တွေကို override လုပ်လို့ မရပါဘူး။ Postman က generate လုပ်တဲ့ headers တွေနဲ့ မတူတဲ့ auth headers တွေ လိုအပ်ရင် — **Authorization** ထဲမှာ ကိုယ့်ရဲ့ setup ကို ပြောင်းပါ။ ဒါမှမဟုတ် ကိုယ့်ရဲ့ auth setup ကို ဖယ်ရှားပြီး headers တွေကို ကိုယ်တိုင် manual အနေနဲ့ ထည့်နိုင်ပါတယ်။

Request auth မှာ environment, collection နဲ့ global [variables](/docs/postman/variables) တွေကို သုံးနိုင်ပါတယ်။ API keys စတဲ့ sensitive data တွေ ပေါ်မသွားအောင် — Postman က header data တွေ ဒါမှမဟုတ် query parameters တွေကို save မလုပ်ပါဘူး။

Sensitive data တွေကို vault secrets အနေနဲ့ သိမ်းဖို့ — ကိုယ့်ရဲ့ [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) ကို သုံးဖို့ အကြံပြုပါတယ်။

Request ပို့ပြီးတာနဲ့ — auth data အပါအဝင် request တစ်ခုလုံးရဲ့ raw dump ကို Postman Console မှာ စစ်ဆေးကြည့်ရှုနိုင်ပါတယ်။

## Authorization ကို parent ကနေ အမွေဆက်ခံခြင်း (Inherit authorization)

Parent [collection](/docs/postman/intro-to-collections) ဒါမှမဟုတ် folder တစ်ခုထဲမှာ auth details တွေ သတ်မှတ်ပြီး — အုပ်စုဖွဲ့ထားတဲ့ requests တွေအားလုံးမှာ parent ရဲ့ auth details တွေကို ပြန်သုံးနိုင်ပါတယ်။

**Auth Type** dropdown list ကနေ **Inherit auth from parent** ကို ရွေးလိုက်ရင် — collection ဒါမှမဟုတ် folder တစ်ခုထဲမှာ အုပ်စုဖွဲ့ထားတဲ့ requests တွေက parent ဆီကနေ auth details တွေကို အမွေဆက်ခံပါတယ်။ ဆိုလိုတာက — grouped requests တွေက collection ဒါမှမဟုတ် folder အဆင့်မှာ သင်သတ်မှတ်ထားတဲ့ auth ကိုပဲ သုံးမှာ ဖြစ်ပါတယ်။ Grouped request တစ်ခုချင်းစီရဲ့ **Authorization** tab ထဲမှာ — parent collection ဒါမှမဟုတ် folder ရဲ့ auth details တွေကို ကြည့်လို့ရပါတယ်။ ဒါ့အပြင် — parent collection ဒါမှမဟုတ် folder ကို ဖွင့်ပြီး auth details တွေ တည်းဖြတ်ဖို့ **Edit Auth in collection** ကိုလည်း ရွေးနိုင်ပါတယ်။

Request တစ်ခုချင်းစီရဲ့ auth ကို ပြောင်းချင်ရင် — အဲဒီ request ရဲ့ **Authorization** tab ထဲမှာ တခြား auth type တစ်ခုကို ရွေးလိုက်ပါ။
