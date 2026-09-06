---
title: "Certificate Authentication (SSL client certificate ဖြင့် အထောက်အထား စိစစ်ခြင်း)"
description: "SSL client certificate ကို အသုံးပြု၍ authentication လုပ်သည့် `cert` authentication method — SSL connections တွင်သာ ရရှိနိုင်ခြင်း၊ certificate ၏ `cn` (Common Name) ကို database user name နှင့် နှိုင်းယှဉ် စစ်ဆေးခြင်းနှင့် map option အကြောင်း"
order: 163
source: "https://www.postgresql.org/docs/current/auth-cert.html"
status: translated
updated: 2026-09-06
---

## 20.12. Certificate Authentication (SSL client certificate ဖြင့် အထောက်အထား စိစစ်ခြင်း)

ဒီ authentication method က SSL client certificates တွေကို သုံးပြီး authentication (အထောက်အထား စိစစ်ခြင်း) ကို ဆောင်ရွက်ပါတယ်။ ဒါကြောင့် SSL connections တွေမှာပဲ ရရှိနိုင်ပြီး — SSL configuration ညွှန်ကြားချက်တွေအတွက် [အပိုင်း 18.9.2](https://www.postgresql.org/docs/current/ssl-tcp.html#SSL-OPENSSL-CONFIG) ကို ကြည့်ပါ။ ဒီ authentication method ကို သုံးတဲ့အခါ — server က client ဆီမှာ valid (တရားဝင်) ဖြစ်ပြီး ယုံကြည်စိတ်ချရတဲ့ (trusted) certificate တစ်ခု ရှိရန် လိုအပ်ပါလိမ့်မယ်။ Client ဆီကို password prompt (စကားဝှက် တောင်းခံမှု) ဘာမှ ပို့ပေးမှာ မဟုတ်ပါဘူး။ Certificate ရဲ့ `cn` (Common Name) attribute ကို တောင်းဆိုထားတဲ့ database user name နဲ့ နှိုင်းယှဉ်ပြီး — ကိုက်ညီရင် login ကို ခွင့်ပြုပါလိမ့်မယ်။ `cn` က database user name နဲ့ မတူညီဘဲ ဖြစ်နေစေဖို့ user name mapping ကို သုံးနိုင်ပါတယ်။

SSL certificate authentication အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **map** — system နဲ့ database user names တွေကြားမှာ mapping (ချိတ်ဆက် သတ်မှတ်ခြင်း) လုပ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.2 ကို ကြည့်ပါ။

`cert` authentication နဲ့အတူ `clientcert` option ကို သုံးတာက ထပ်နေတဲ့ (redundant) အလုပ် ဖြစ်ပါတယ် — အကြောင်းကတော့ `cert` authentication က ထိရောက်စွာဆိုရင် `clientcert=verify-full` ပါတဲ့ `trust` authentication ပဲ ဖြစ်လို့ပါ။
