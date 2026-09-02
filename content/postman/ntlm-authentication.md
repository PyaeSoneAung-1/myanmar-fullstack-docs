---
title: "Windows NTLM Authentication ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with Windows NTLM)"
description: "Windows NTLM authentication ဆိုတာ ဘာလဲ — Postman မှာ NTLM auth configure လုပ်နည်း နဲ့ advanced parameters (Domain, Workstation) အကြောင်း"
order: 38
source: "https://learning.postman.com/docs/use/send-requests/authorization/ntlm-authentication/"
status: translated
updated: 2026-09-02
---

Windows NTLM ဆိုတာ — Windows operating system နဲ့ standalone systems တွေအတွက် authorization flow ပါ။ NTLM က challenge-response ပုံစံ authentication protocol တစ်ခုပါ။

NTLM authentication သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **NTLM Authentication** ကို ရွေးပါ။

2. NTLM access အတွက် ကိုယ့်ရဲ့ **Username** နဲ့ **Password** ကို ရိုက်ထည့်ပါ။ Advanced details တွေကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ် — လိုအပ်ရင် Postman က ဒီ values တွေကို generate လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

ပုံမှန်အားဖြင့် — ပထမ request ကနေ ရလာတဲ့ data တွေကို extract လုပ်ပြီး ကိုယ့် request က ဒုတိယအကြိမ် run လုပ်ပါလိမ့်မယ်။ **Yes, disable retrying the request** checkbox ကို ရွေးပြီး ဒီအပြုအမူကို ပိတ်နိုင်ပါတယ်။

NTLM auth ရဲ့ advanced parameters တွေကတော့:

* **Domain** — Authentication လုပ်ရမယ့် domain ဒါမှမဟုတ် host ပါ။
* **Workstation** — ကိုယ့် PC ရဲ့ hostname ပါ။
