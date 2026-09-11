---
title: "Secure TCP/IP Connections with GSSAPI Encryption (GSSAPI encryption ဖြင့် လုံခြုံသော TCP/IP ချိတ်ဆက်မှုများ)"
description: "PostgreSQL ၏ GSSAPI ဖြင့် client/server ဆက်သွယ်ရေးကို encrypt လုပ်ခြင်း — basic setup၊ TCP port တစ်ခုတည်းပေါ်တွင် GSSAPI-encrypted connections အတွက် ညှိနှိုင်းမှု၊ GSSAPI authentication နှင့် တွဲဖက် အသုံးပြုပုံ အကြောင်း"
order: 153
source: "https://www.postgresql.org/docs/current/gssapi-enc.html"
status: translated
updated: 2026-09-06
---

## 18.10. Secure TCP/IP Connections with GSSAPI Encryption (GSSAPI encryption ဖြင့် လုံခြုံသော TCP/IP ချိတ်ဆက်မှုများ)

- **18.10.1. Basic Setup (အခြေခံ ပြင်ဆင်ခြင်း)**

PostgreSQL မှာ — client/server ဆက်သွယ်ရေးတွေကို encrypt (ကုဒ်ဝှက်) လုပ်ပြီး လုံခြုံမှု မြှင့်တင်ဖို့ — GSSAPI ကို သုံးတဲ့ native (ပါဝင်ပြီးသား) ထောက်ပံ့မှု တစ်ခုလည်း ရှိပါတယ်။ ဒီထောက်ပံ့မှုအတွက် — GSSAPI implementation တစ်ခု (MIT Kerberos လို ဟာမျိုး) ကို client ရော server system နှစ်ခုလုံးမှာပါ တပ်ဆင်ထားရပြီး — PostgreSQL ထဲမှာ ဒီထောက်ပံ့မှုကို build (တည်ဆောက်) လုပ်ချိန်မှာ enable (ဖွင့်) လုပ်ထားဖို့ လိုအပ်ပါတယ် ([အခန်း 17](https://www.postgresql.org/docs/current/installation.html) ကို ကြည့်ပါ)။

### 18.10.1. Basic Setup (အခြေခံ ပြင်ဆင်ခြင်း)

PostgreSQL server က TCP port တစ်ခုတည်းပေါ်မှာ — normal connections ရော GSSAPI နဲ့ encrypt လုပ်ထားတဲ့ connections တွေကိုပါ listen (နားဆင်) လုပ်ပြီး — ချိတ်ဆက်လာတဲ့ client တစ်ခုချင်းစီနဲ့ — encryption အတွက် (ရော authentication အတွက်ပါ) GSSAPI ကို သုံးမသုံး ညှိနှိုင်း (negotiate) ပါလိမ့်မယ်။ Default အားဖြင့် — ဒီဆုံးဖြတ်ချက်က client အပေါ် မူတည်ပါတယ် (ဆိုလိုတာက — attacker (တိုက်ခိုက်သူ) တစ်ယောက်က ဒါကို အဆင့်နိမ့် ပြောင်းလဲ (downgrade) လုပ်နိုင်ပါတယ်); connections တချို့ ဒါမှမဟုတ် အားလုံးအတွက် GSSAPI ကို မဖြစ်မနေ သုံးစေဖို့ server ကို သတ်မှတ်ခြင်းအကြောင်း [အပိုင်း 20.1](/docs/postgresql/auth-pg-hba-conf) မှာ ကြည့်ပါ။

GSSAPI ကို encryption အတွက် သုံးတဲ့အခါ — authentication အတွက်ပါ GSSAPI ကိုပဲ သုံးတာ သာမန် ဖြစ်ပါတယ် — အကြောင်းကတော့ — အရင်းခံ ယန္တရား (underlying mechanism) က — (GSSAPI implementation အရ) client ရော server ရဲ့ identity (မည်သူမည်ဝါ ဖြစ်ကြောင်း) နှစ်ခုလုံးကို — ဘယ်လိုပဲ ဖြစ်ဖြစ် ဆုံးဖြတ်ပေးမှာ မို့လို့ပါ။ ဒါပေမယ့် — ဒါက မလိုအပ်ပါဘူး; ထပ်ဆောင်း စစ်ဆေး အတည်ပြုမှုတွေ လုပ်ဆောင်ဖို့ — တခြား PostgreSQL authentication method တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်။

Negotiation (ညှိနှိုင်းမှု) အပြုအမူရဲ့ configuration ကလွဲရင် — GSSAPI encryption က — GSSAPI authentication အတွက် လိုအပ်တဲ့အရာတွေထက် ပိုပြီး — ဘာ setup မှ မလိုအပ်ပါဘူး။ (ဒါကို configure လုပ်ခြင်းအကြောင်း ပိုပြီး အသေးစိတ်အတွက် [အပိုင်း 20.6](/docs/postgresql/gssapi-auth) ကို ကြည့်ပါ။)
