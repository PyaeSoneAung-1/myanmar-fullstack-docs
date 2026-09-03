---
title: "API Requests များကို Postman Collections များထဲသို့ ထည့်သွင်းခြင်း"
description: "Postman Collection ဖန်တီးပြီးနောက် request တွေ ထည့်နည်း — collection အလွတ်တစ်ခုထဲ request ထည့်ခြင်း၊ request အသစ်တွေနဲ့ history ထဲက request တွေကို collection ထဲ သိမ်းခြင်း၊ ရှိပြီးသား request တွေကို အခြား collection တစ်ခုဆီ ရွှေ့ခြင်း"
order: 137
source: "https://learning.postman.com/docs/use/use-collections/add-requests-to-collections/"
status: translated
updated: 2026-09-03
---

[Postman Collection တစ်ခု ဖန်တီးပြီး](/docs/postman/create-collections) တာနဲ့ — အဲဒီ collection ကို သုံးပြီး API requests တွေကို သိမ်းဆည်းနိုင်သလို စနစ်တကျ စုစည်းထားနိုင်ပါတယ်။ Requests တွေကို collection ထဲ ထည့်ဖို့ အောက်ပါ နည်းလမ်းတွေထဲက ဘယ်နည်းကိုမဆို သုံးနိုင်ပါတယ်။

[Requests တွေ ဖန်တီးပြီး ပို့နည်း](/docs/postman/requests) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Collection အလွတ်တစ်ခုထဲ request တစ်ခု ထည့်ခြင်း

Collection အသစ်တစ်ခုထဲ request တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

* Sidebar ထဲက collection ပေါ်မှာ hover လုပ်ပြီး ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add request** ကို နှိပ်ပါ။
* Collection အသစ်ကို ချဲ့ပြီး ![Request icon](https://assets.postman.com/postman-docs/aether-icons/v12/entity-request-stroke.svg#icon) **Add Request** ကို နှိပ်ပါ။
* Sidebar ထဲက collection ပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး **Add request** ကို ရွေးပါ။

  ![Add a request to an empty collection](https://assets.postman.com/postman-docs/v12/add-collection-request-v12-01.png)

## Request အသစ်တစ်ခုကို collection ထဲ သိမ်းခြင်း

1. [Request အသစ်တစ်ခု](/docs/postman/request-basics) ဖွင့်ပါ။
2. ![Save icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-save-stroke.svg#icon) **Save** ကို နှိပ်ပါ။
3. Request ကို သိမ်းချင်တဲ့ collection ကို ရွေးပါ။ ဒါမှမဟုတ် collection အသစ်တစ်ခု ဖန်တီးဖို့ **New Collection** ကို နှိပ်ပါ။

ကိုယ် သိမ်းချင်တဲ့ collection က စာရင်းထဲမှာ မပါရင် — အဲဒီ collection ထဲမှာ HTTP requests တွေပဲ ထည့်လို့ရလို့ ဖြစ်ပါတယ်။ GraphQL, gRPC နဲ့ တခြား request types တွေပါ ထည့်လို့ရတဲ့ collection တစ်ခု ဖန်တီးချင်ရင် — [Collection အသစ်တစ်ခု ဖန်တီးခြင်း](/docs/postman/create-collections) ကို ကြည့်ပါ။

## Collection တစ်ခုထဲမှာ request အသစ်တစ်ခု ဖန်တီးခြင်း

Request အသစ်တစ်ခုကို collection တစ်ခုထဲ တိုက်ရိုက် သိမ်းဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

* Sidebar ထဲမှာ collection တစ်ခုဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး **Add request** ကို ရွေးပါ။
* Collection ပေါ်မှာ hover လုပ်ပြီး ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add request** ကို နှိပ်ပါ။

## ကိုယ့် history ထဲက request တစ်ခုကို collection ထဲ သိမ်းခြင်း

1. Sidebar ထဲမှာ ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **History** ကို နှိပ်ပါ။
2. Request ပေါ်မှာ hover လုပ်ပြီး **Save Request** ကို နှိပ်ပါ။
3. Request ကို သိမ်းချင်တဲ့ collection ကို ရွေးပါ။ Request ကို သိမ်းဖို့ collection အသစ်တစ်ခု ဖန်တီးချင်ရင် **New Collection** ကို နှိပ်ပါ။
4. **Save** ကို နှိပ်ပါ။

## ရှိပြီးသား request တစ်ခုကို တခြား collection တစ်ခုဆီ ရွှေ့ခြင်း

1. Sidebar ထဲမှာ ရွှေ့ချင်တဲ့ request ကို ရွေးပါ။ Requests အများကြီးကို ရွေးချင်ရင် **⌘** ဒါမှမဟုတ် **Ctrl** ကို ဖိထားနိုင်ပါတယ်။
2. Request ကို တခြား collection တစ်ခုထဲကို drag ဆွဲချပါ။

ဒါမှမဟုတ် request ကို ဖွင့်ပြီး ![Save icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-save-stroke.svg#icon) **Save > Save as** ကို ရွေးပြီး — ရွှေ့ချင်တဲ့ collection ကို ရွေးနိုင်ပါတယ်။
