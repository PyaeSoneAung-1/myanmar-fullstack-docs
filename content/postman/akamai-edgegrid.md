---
title: "Akamai EdgeGrid ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with Akamai EdgeGrid)"
description: "Akamai EdgeGrid ဆိုတာ ဘာလဲ — Postman မှာ Akamai EdgeGrid auth configure လုပ်နည်း (Access Token, Client Token, Client Secret) အကြောင်း"
order: 44
source: "https://learning.postman.com/docs/use/send-requests/authorization/akamai-edgegrid/"
status: translated
updated: 2026-09-02
---

[Akamai EdgeGrid](https://techdocs.akamai.com/home/) ဆိုတာ Akamai က ကိုယ်တိုင် တီထွင်ပြီး အသုံးပြုနေတဲ့ authorization helper တစ်ခုပါ။

Akamai EdgeGrid သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **Akamai EdgeGrid** ကို ရွေးပါ။
2. ကိုယ့်ရဲ့ **Access Token**, **Client Token** နဲ့ **Client Secret** တွေကို ရိုက်ထည့်ပါ — ပိုလုံခြုံစေဖို့ variables တွေကို သုံးပါ။ ဒီ details တွေကို Akamai မှာ client application တစ်ခု register လုပ်တဲ့အခါ ရရှိပါလိမ့်မယ်။
3. **Advanced configuration** section ထဲမှာ လိုအပ်တဲ့ အချက်အလက်တွေ ရိုက်ထည့်ပါ။ ဒီ section ထဲက fields တွေကို သတ်မှတ်တာက optional ပါ — ကိုယ့် request run တဲ့အခါ Postman က ဒီ fields တွေထဲကို default values တွေကို အလိုအလျောက် ဖြည့်ပေးပါတယ်။

ကိုယ့် request ရဲ့ **Authorization** tab ထဲမှာ လိုအပ်တဲ့ details တွေ ပြည့်စုံသွားတဲ့အခါ — Postman က ၎င်းတို့ကို **Headers** ထဲကို ထည့်ပေးပါလိမ့်မယ်။

ကိုယ့်ရဲ့ credentials တွေကို ဘယ်လို ရယူမလဲဆိုတဲ့ အချက်အလက်အတွက် — [Akamai ရဲ့ developer documentation](https://techdocs.akamai.com/developer/docs/edgegrid) ကို ကြည့်ပါ။
