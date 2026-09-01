---
title: "Postman မှာ API authentication နဲ့ authorization"
description: "API requests တွေမှာ authentication နဲ့ authorization ဆိုတာ ဘာလဲ — request authorization သတ်မှတ်နည်း၊ certificate တွေ ထည့်နည်း၊ auth details တွေကို variables နဲ့ collections မှာ သိမ်းနည်း"
order: 6
source: "https://learning.postman.com/docs/use/send-requests/authorization/authorization/"
status: translated
updated: 2026-09-01
---

Postman က API requests တွေနဲ့အတူ auth details တွေ ပို့နိုင်အောင် လုပ်ပေးပါတယ်။ APIs တွေက client requests တွေ data တွေကို လုံခြုံစွာ သုံးနိုင်ဖို့ authentication နဲ့ authorization ကို အသုံးပြုပါတယ်။ Authentication ဆိုတာ request ပို့သူရဲ့ အထောက်အထားကို စစ်ဆေးတာဖြစ်ပြီး — authorization ကတော့ ပို့သူမှာ endpoint ရဲ့ operation ကို လုပ်ဆောင်ဖို့ ခွင့်ပြုချက် ရှိမရှိကို အတည်ပြုတာပါ။

ကိုယ့်ကိုယ်တိုင် API တစ်ခု တည်ဆောက်နေရင် — auth models အမျိုးမျိုးကနေ ရွေးချယ်နိုင်ပါတယ်။ Third-party API တစ်ခုနဲ့ ပေါင်းစပ်နေရင်တော့ — လိုအပ်တဲ့ authorization ကို API provider က သတ်မှတ်ပေးပါလိမ့်မယ်။

## Postman မှာ authentication

တချို့ APIs တွေက client ရဲ့ အထောက်အထားကို digital certificate နဲ့ သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။ Certificate authority (CA) ဒါမှမဟုတ် client certificates တွေကို Postman ထဲကို ထည့်နိုင်ပြီး — authentication လိုအပ်တဲ့ APIs တွေကို သုံးနိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Postman မှာ CA နဲ့ client certificates တွေ ထည့်ခြင်း နဲ့ စီမံခြင်း](https://learning.postman.com/docs/use/send-requests/authorization/certificates/) ကို ကြည့်ပါ။

## Postman မှာ request authorization

Postman မှာ ပို့တဲ့ request တိုင်းနဲ့အတူ auth details တွေ ပေးပို့နိုင်ပါတယ်။ Auth data ကို header, body, ဒါမှမဟုတ် request ရဲ့ parameters တွေထဲမှာ ထည့်နိုင်ပါတယ်။ Request ရဲ့ **Authorization** tab ထဲမှာ auth details တွေ ထည့်လိုက်ရင် — Postman က ရွေးထားတဲ့ auth type အတွက် request ရဲ့ သက်ဆိုင်ရာ အပိုင်းတွေကို အလိုအလျောက် ဖြည့်ပေးပါတယ်။ Authorization details တွေကို သိမ်းဖို့ variables နဲ့ collections တွေကို သုံးနိုင်ပြီး — တူညီတဲ့ အချက်အလက်တွေကို နေရာမျိုးစုံမှာ ပြန်သုံးနိုင်ပါတယ်။

Postman မှာ request authorization အကြောင်း ပိုလေ့လာဖို့ အောက်ပါ topics တွေကို ကြည့်ပါ:

* Auth type တစ်ခုကို ရွေးပြီး သက်ဆိုင်ရာ details တွေ ဖြည့်ဖို့ — request ဒါမှမဟုတ် collection ရဲ့ **Authorization** tab ကို သုံးပါ။ ပိုလေ့လာဖို့ — [Postman မှာ API requests တွေဆီ authorization details တွေ ထည့်ခြင်း](https://learning.postman.com/docs/use/send-requests/authorization/specifying-authorization-details/) ကို သွားပါ။ သုံးလို့ရတဲ့ authorization types အသေးစိတ်အတွက် — [Postman က ပံ့ပိုးထားတဲ့ authorization types](https://learning.postman.com/docs/use/send-requests/authorization/authorization-types/) ကို ကြည့်ပါ။
* Guided Auth ပါတဲ့ public API တစ်ခုဆီ request တစ်ခု ဖန်တီးတဲ့အခါ — Postman က authorization ကို အလိုအလျောက် သတ်မှတ်ဖို့ option တစ်ခု ပေးပါတယ်။ ပိုလေ့လာဖို့ — [Guided Auth သုံးပြီး public APIs တွေအတွက် authorization သတ်မှတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/authorization/authentication-for-public-apis/) ကို ကြည့်ပါ။
* တချို့ APIs တွေက authentication details တွေကို query parameters အဖြစ် ပို့နိုင်စေပါတယ်။ ဒါ့အပြင် Postman က auth setup အပေါ်မူတည်ပြီး request ထဲကို headers တွေ အလိုအလျောက် ထည့်နိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Postman မှာ API requests တွေနဲ့ parameters နဲ့ body data တွေ ပို့ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/parameters/) ဒါမှမဟုတ် [Postman မှာ API requests တွေအတွက် headers တွေ configure လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/headers/) ကို ကြည့်ပါ။
* Browser ထဲမှာ session cookies တွေ ရှိရင် — Postman Interceptor သုံးပြီး အဲဒီ cookies တွေကို Postman ဆီ sync လုပ်နိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Postman Interceptor သုံးပြီး web browser ကနေ traffic တွေ ဖမ်းယူခြင်း](https://learning.postman.com/docs/use/capturing-request-data/interceptor/) နဲ့ [Postman ရဲ့ cookie manager သုံးပြီး cookies တွေ ဖန်တီး ဖမ်းယူခြင်း](https://learning.postman.com/docs/use/send-requests/response-data/cookies/) ကို ကြည့်ပါ။
* Request တစ်ခု authenticate လုပ်ပြီး run ဖို့ အခက်အခဲ ရှိနေရင် — [Postman Console သုံးပြီး API requests တွေကို debug လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) ထဲက tips တွေကို ပြန်သုံးသပ်ပါ။ Auth ပြဿနာတွေ ဆက်ရှိနေသေးရင် — Postman Community forum မှာ [authentication tag](https://community.postman.com/tags/authentication) ပါတဲ့ topics တွေကို ကြည့်ပါ။
