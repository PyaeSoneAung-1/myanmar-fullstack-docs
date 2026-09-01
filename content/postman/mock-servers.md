---
title: "Mock server တစ်ခုဖြင့် Postman မှာ API ကို simulate လုပ်ခြင်း"
description: "Mock နဲ့ mock server ဆိုတာ ဘာလဲ — mock server တွေ စတင်သုံးနည်း၊ step-by-step guides တွေ၊ Postman mock servers တွေ ဘယ်လို အလုပ်လုပ်သလဲ"
order: 9
source: "https://learning.postman.com/docs/design-apis/mock-apis/overview/"
status: translated
updated: 2026-09-01
---

Postman က mocks နဲ့ mock servers တွေကို သုံးပြီး — real backend မလိုဘဲ ကိုယ့် API ကို simulate လုပ်နိုင်စေပါတယ်:

* **Mocks** တွေက JavaScript request handlers နဲ့ response logic တွေကို သုံးပြီး dynamic responses တွေ ပြန်ပေးပါတယ်။ Custom behavior, stateful responses, ဒါမှမဟုတ် requests တွေကို ဘယ်လို handle လုပ်မလဲ ဆိုတာအပေါ် ပိုထိန်းချုပ်မှု လိုအပ်တဲ့အခါ mock တစ်ခုကို သုံးပါ။ Mock တစ်ခုကို local မှာ စတင်ပြီး requests တွေ ပို့နိုင်သလို — mock server အဖြစ်လည်း deploy လုပ်နိုင်ပါတယ်။
* **Mock servers** တွေက Postman cloud မှာ deploy လုပ်ထားပြီး requests တွေကို handle လုပ်ဖို့ အမြဲ ရရှိနိုင်ပါတယ်။ Mock တစ်ခုကနေ ဒါမှမဟုတ် existing collection တစ်ခုကနေ mock server တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

## Postman မှာ mock servers တွေကို စတင်ခြင်း

Mock တစ်ခု ဖန်တီးဖို့ — [JavaScript နဲ့ API mocks တွေ တည်ဆောက်ခြင်း](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers/) ကို ကြည့်ပါ။

Mock server တစ်ခု ဖန်တီးဖို့ — [mock တစ်ခု ဒါမှမဟုတ် existing collection တစ်ခုကနေ ဖန်တီးနိုင်သလို](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/),  [request history](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/#create-from-history) ကနေလည်း တည်ဆောက်နိုင်ပါတယ်။

Mock server တစ်ခု တည်ဆောက်ပြီးတာနဲ့ — Postman ကနေ ဒါမှမဟုတ် client application တစ်ခုကနေ [calls တွေ လုပ်နိုင်ပါတယ်](https://learning.postman.com/docs/design-apis/mock-apis/mock-server-calls/)။ Mock server က ကိုယ့် API ရဲ့ အပြုအမူကို simulate လုပ်ပါတယ် — ဒါကြောင့် API production ready မဖြစ်ခင် ကိုယ့် API ကို test လုပ်နိုင်သလို functionality အသစ်တွေလည်း တည်ဆောက်နိုင်ပါတယ်။

Dependencies အများကြီး တစ်ပြိုင်နက် fail ဖြစ်တဲ့အခါ ကိုယ့် service က ဘယ်လို တုံ့ပြန်လဲ test ကြည့်ချင်ရင် — Postman Simulator နဲ့ [simulations တွေ ဖန်တီး run လုပ်နိုင်ပါတယ်](https://learning.postman.com/docs/design-apis/simulate-conditions)။

Collection တစ်ခုကနေ ဖန်တီးထားတဲ့ mock servers တွေက variables နဲ့ templates တွေကို သုံးပြီး [dynamic responses တွေ ထုတ်ပေးနိုင်ပါတယ်](https://learning.postman.com/docs/design-apis/mock-apis/create-dynamic-responses/)။

#### [အခမဲ့ mocking tools တွေ စမ်းသုံးကြည့်ပါ — signup မလိုပါ](https://www.postman.com/tools?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta)

Setup အဆင့်တွေ ကျော်ပြီး ကိုယ့်ရဲ့ အခမဲ့ browser tools တွေကို စမ်းကြည့်ပါ: [OpenAPI spec တစ်ခုကနေ endpoint တိုင်းကို တစ်ပြိုင်နက် mock လုပ်ခြင်း](https://www.postman.com/tools/mock-from-spec?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta),  [resource template တစ်ခုကနေ live mock endpoint တစ်ခု အလျင်အမြန် ဖန်တီးခြင်း](https://www.postman.com/tools/instant-mock-api?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta),  ဒါမှမဟုတ် [JSON ကို paste လုပ်ပြီး editable mock endpoint တစ်ခု ရယူခြင်း](https://www.postman.com/tools/editable-mock?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta)။ Account မလိုအပ်ပါဘူး။

## Step-by-step guides တွေနဲ့ ပိုတိုးတက်အောင် လုပ်ခြင်း

Mock server တစ်ခု တည်ဆောက်ဖို့ နောက်ထပ် အကူအညီ လိုအပ်ရင် — [saved response examples တွေသုံးပြီး ကိုယ့် API ကို mock လုပ်ခြင်း](https://learning.postman.com/docs/design-apis/mock-apis/tutorials/mock-with-examples/) ဆိုတဲ့ step-by-step guide ကို လိုက်လုပ်ပါ။ Collection ထဲကို requests နဲ့ examples တွေ ထည့်နည်း၊ ပြီးတော့ collection ကို သုံးပြီး mock server တစ်ခု configure လုပ်ပြီး သုံးနည်းတွေကို သင်ရပါမယ်။

Mock servers တွေကို အလိုအလျောက် လုပ်ချင်ရင် — [Postman API သုံးပြီး mock servers တွေ တည်ဆောက်ခြင်း](https://learning.postman.com/docs/design-apis/mock-apis/tutorials/mock-with-api/) ဆိုတဲ့ step-by-step guide ကို လိုက်လုပ်ပါ။ Collection တစ်ခုကို mock လုပ်ပြီး mock server URL တစ်ခု ရယူဖို့ [Postman API](https://learning.postman.com/docs/reference/postman-api/intro-api/) ကို ဘယ်လို သုံးလဲ သင်ရပါမယ်။

## Postman mock servers တွေ ဘယ်လို အလုပ်လုပ်သလဲ

Mock server တစ်ခုဆီ request တစ်ခု ပို့လိုက်တဲ့အခါ — Postman က request နဲ့ အကိုက်ညီဆုံး saved example တစ်ခုကို ရွေးဖို့ algorithm တစ်ခုကို သုံးပါတယ်။ ပြီးရင် mock server က saved example ထဲက data တွေကို သုံးပြီး response တစ်ခု ပြန်ပေးပါတယ်။

[Matching algorithm အကြောင်း ပိုနက်နက်နဲနဲ လေ့လာပြီး](https://learning.postman.com/docs/design-apis/mock-apis/matching-algorithm/) — mock server ကနေ ကိုယ်မျှော်လင့်ထားတဲ့ responses တွေ အမြဲ ရနိုင်အောင် examples တွေ ဖန်တီးနည်းကို သင်ယူပါ။
