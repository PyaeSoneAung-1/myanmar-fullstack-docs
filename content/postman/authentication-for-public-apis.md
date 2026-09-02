---
title: "Guided Auth သုံးပြီး public APIs တွေအတွက် authorization သတ်မှတ်ခြင်း (Set Up Authorization for Public APIs Using Guided Auth)"
description: "Guided Auth ဆိုတာ ဘာလဲ — Guided Auth ပါတဲ့ public API တစ်ခုအတွက် authorization setup လုပ်နည်း, credentials တွေကို variables ဒါမှမဟုတ် Postman Vault မှာ သိမ်းနည်း"
order: 40
source: "https://learning.postman.com/docs/use/send-requests/authorization/authentication-for-public-apis/"
status: translated
updated: 2026-09-02
---

Public APIs အများအပြားက Postman မှာ Guided Auth ကို ပေးပါတယ် — ဥပမာ Stripe, Open AI, Notion နဲ့ Spotify တို့ပါ။ Guided Auth ကို ပံ့ပိုးပေးတဲ့ API တစ်ခုဆီ HTTP request တစ်ခု ဖန်တီးတဲ့အခါ — API က authentication လိုအပ်မလား ဆိုတာကို Postman က အလိုအလျောက် သိရှိပါတယ်။

API publisher တစ်ယောက်ဆိုရင် — ကိုယ့် team dashboard ထဲမှာ ကိုယ့်ရဲ့ public APIs တွေအတွက် Guided Auth ကို setup လုပ်နိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [public APIs တွေအတွက် Guided Auth setup လုပ်ခြင်း](https://learning.postman.com/docs/publishing-your-api/setting-up-authentication-for-public-apis/) ကို ကြည့်ပါ။

## Authorization setup လုပ်ခြင်း

1. Guided Auth သုံးတဲ့ public API တစ်ခုဆီပို့တဲ့ HTTP request ရဲ့ **Authorization** tab ကို ရွေးပါ။

2. **Auth Type** dropdown list ထဲမှာ **No Auth** ကို ရွေးပါ။

3. **Quick Setup** အောက်မှာ — Guided Auth နဲ့ API အတွက် configure လုပ်ထားတဲ့ authentication options တွေထဲက ရွေးနိုင်ပါတယ်။

   Guided Auth က bearer, basic, API key ဒါမှမဟုတ် OAuth 2.0 authentication credentials တွေ လိုအပ်တဲ့ public APIs တွေကို ပံ့ပိုးပေးပါတယ်။

4. ကိုယ့်ရဲ့ credentials တွေ ရဖို့ ညွှန်ကြားချက်တွေ အတိုင်း လုပ်ပြီး — သက်ဆိုင်ရာ fields တွေထဲမှာ ရိုက်ထည့်ပါ။

Credentials တွေ ရိုက်ထည့်ပြီးတာနဲ့ — ဒါတွေကို variables တွေအဖြစ် ဒါမှမဟုတ် [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) ထဲမှာ vault secret တစ်ခုအနေနဲ့ သိမ်းနိုင်ပါတယ်။ ![Secret warning icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-secretWarning-stroke.svg#icon) **Sensitive value** ပေါ်မှာ mouse ချ (hover) လုပ်ပြီး — **Set as Variable** ကို နှိပ်ပါ။ နာမည်တစ်ခု ရိုက်ထည့်ပြီး — ထည့်လိုတဲ့ scope ကို ရွေးပါ။
