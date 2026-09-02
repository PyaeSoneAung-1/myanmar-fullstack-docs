---
title: "Hawk Authentication ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with Hawk Access Authentication)"
description: "Hawk authentication ဆိုတာ ဘာလဲ — Postman မှာ Hawk auth configure လုပ်နည်း နဲ့ parameters တွေ (Hawk Auth ID, Hawk Auth Key, Algorithm, advanced parameters) အကြောင်း"
order: 39
source: "https://learning.postman.com/docs/use/send-requests/authorization/hawk-authentication/"
status: translated
updated: 2026-09-02
---

Hawk authentication က — partial cryptographic verification (တစ်စိတ်တစ်ပိုင်း cryptographic စစ်ဆေးခြင်း) သုံးပြီး requests တွေကို authorize လုပ်နိုင်စေပါတယ်။

Hawk authentication သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **Hawk Authentication** ကို ရွေးပါ။

2. **Hawk Auth ID**, **Hawk Auth Key** နဲ့ **Algorithm** fields တွေထဲမှာ ကိုယ့်ရဲ့ details တွေကို ရိုက်ထည့်ပါ။ Advanced details တွေကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ် — လိုအပ်ရင် Postman က ဒီ values တွေကို generate လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

Request ရဲ့ **Authorization** tab ထဲမှာ လိုအပ်တဲ့ details တွေ ပြည့်စုံပြီဆိုရင် — Postman က ဒါတွေကို **Headers** tab ထဲကို ထည့်ပေးပါတယ်။

Hawk Authentication ရဲ့ parameters တွေကတော့:

* **Hawk Auth ID** — ကိုယ့်ရဲ့ API authentication ID value ပါ။
* **Hawk Auth Key** — ကိုယ့်ရဲ့ API authentication key value ပါ။
* **Algorithm** — Message authentication code (MAC) ဖန်တီးဖို့ သုံးတဲ့ hash algorithm ပါ။
* Advanced parameters:
  * **User** — Username ပါ။
  * **Nonce** — Client က random အနေနဲ့ generate လုပ်တဲ့ string ပါ။
  * **ext** — Request နဲ့အတူ ပို့စေချင်တဲ့ application-specific information တွေပါ။
  * **app** — တခြားသူတစ်ယောက်အတွက် ထုတ်ပေးထားတဲ့ credentials တွေကို attacker က သုံးစွဲတာမျိုး မဖြစ်အောင် credentials နဲ့ application ကြားက binding ပါ။
  * **dlg** — Credentials တွေကို ထုတ်ပေးခဲ့တဲ့ application ရဲ့ ID ပါ။
  * **Timestamp** — Time window အပြင်ဘက်က replay attacks တွေ မဖြစ်အောင် server က သုံးတဲ့ timestamp ပါ။
  * **Include payload hash** — ဖွင့်ထားရင် — signature ထဲမှာ request payload ရဲ့ hash ကိုပါ ထည့်ပေးပါတယ်။
