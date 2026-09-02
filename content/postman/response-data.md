---
title: "Postman မှာ API response data နဲ့ cookies များကို ကိုင်တွယ်ခြင်း"
description: "API response data တွေနဲ့ အလုပ်လုပ်ခြင်း — responses တွေကို ကြည့်ရှု/သိမ်းခြင်း, examples သိမ်းခြင်း, cookies စီမံခြင်း နဲ့ requests တွေကို debug လုပ်ခြင်း"
order: 75
source: "https://learning.postman.com/docs/use/send-requests/response-data/response-data/"
status: translated
updated: 2026-09-02
---

*API response* ဆိုတာ — client တစ်ခုဆီကနေ request တစ်ခု လက်ခံရရှိပြီးနောက် API server က ပြန်ပို့ပေးတဲ့ data ပဲ ဖြစ်ပါတယ်။ Postman ကို သုံးပြီး response data တွေကို စစ်ဆေးကြည့်ရှုခြင်း၊ visualizations ဖန်တီးခြင်း နဲ့ ပြဿနာတွေကို troubleshoot လုပ်ခြင်း စတာတွေ လုပ်နိုင်ပါတယ်။ Response တွေကို examples တွေအဖြစ် သိမ်းဆည်းပြီး ကိုးကားနိုင်သလို — ဆက်စပ်နေတဲ့ cookies တွေကိုလည်း ကြည့်ရှုပြီး စီမံခန့်ခွဲနိုင်ပါတယ်။

## Response တွေကို ကြည့်ရှုခြင်းနဲ့ သိမ်းဆည်းခြင်း

API request တစ်ခု ပို့လိုက်တဲ့အခါ — Postman က API server ကနေ ပြန်လာတဲ့ response ကို ပြသပေးပါတယ်။ Response code, response body နဲ့ headers စတဲ့ response အသေးစိတ်တွေကို response viewer ထဲမှာ [ကြည့်ရှုနိုင်](/docs/postman/responses)ပြီး — [Postman Visualizer](/docs/postman/visualizer) ကို သုံးပြီး response data တွေရဲ့ ကြွယ်ဝတဲ့ graphic visualizations တွေကိုလည်း ဖန်တီးနိုင်ပါတယ်။

## Examples တွေကို သိမ်းဆည်းခြင်း

Example ဆိုတာ — API endpoint တစ်ခုကို ဘယ်လို သုံးနိုင်တယ်ဆိုတာ သရုပ်ပြတဲ့ request တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ response တစ်ခု ဖြစ်ပါတယ်။ Response တစ်ခုကို သိမ်းဆည်းပြီး ဒါမှမဟုတ် အစကနေ ဖန်တီးပြီး [example တစ်ခု ဖန်တီး](/docs/postman/examples)နိုင်ပါတယ်။ Examples တွေက ကိုယ့်ရဲ့ API documentation ထဲမှာ ပါဝင်ပြီး — mock server တစ်ခု သတ်မှတ်ဖို့လည်း သုံးနိုင်ပါတယ်။

## Cookies တွေကို စီမံခန့်ခွဲခြင်း

Websites တွေက user တစ်ယောက်ရဲ့ session အချက်အလက်တွေကို သိမ်းဆည်းပြီး — အဲဒီ user အတွက် page content တွေကို စိတ်ကြိုက် ပြင်ဆင်ပေးဖို့ cookies တွေကို သုံးပါတယ်။ Domain အမျိုးမျိုးအတွက် cookies တွေကို ကြည့်ရှုပြီး API requests တွေနဲ့အတူ cookies တွေ ပို့ဖို့ Postman ရဲ့ [cookie manager](/docs/postman/cookies) ကို သုံးနိုင်ပါတယ်။ Cookies တွေကို အစကနေ ဖန်တီးနိုင်သလို — Postman proxy ဒါမှမဟုတ် Postman Interceptor ကို သုံးပြီး [cookies တွေကို capture လုပ်နိုင်ပါတယ်](https://learning.postman.com/docs/use/capturing-request-data/capture-overview/)။

## Requests တွေကို debug လုပ်ခြင်း

[ကိုယ့်ရဲ့ API requests တွေကို debug လုပ်ပြီး](/docs/postman/troubleshooting-api-requests) ပြဿနာတွေကို ဖြေရှင်းဖို့ Postman က tools တွေ ပေးထားပါတယ်။ Request တစ်ခု ဖန်တီးနေစဉ်မှာ — Postman က invalid ဖြစ်တဲ့ characters တွေကို မီးမောင်းထိုးပြပေးပါတယ်။ Request ပို့ပြီးနောက်မှာတော့ — error တွေကို ကြည့်ရှုပြီး troubleshoot လုပ်ဖို့ Postman Console ကို စစ်ဆေးနိုင်ပါတယ်။
