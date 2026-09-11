---
title: "Peer Authentication (kernel မှ OS user name ရယူ၍ အထောက်အထား စိစစ်ခြင်း)"
description: "kernel မှ client ၏ operating system user name ကို တိုက်ရိုက် ရယူပြီး ထို user name ကို database user name အဖြစ် ခွင့်ပြုသည့် `peer` authentication method — local connections များတွင်သာ ထောက်ပံ့ခြင်းနှင့် map option အကြောင်း"
order: 164
source: "https://www.postgresql.org/docs/current/auth-peer.html"
status: translated
updated: 2026-09-06
---

## 20.9. Peer Authentication (kernel မှ OS user name ရယူ၍ အထောက်အထား စိစစ်ခြင်း)

`peer` authentication method (အထောက်အထား စိစစ်ခြင်း နည်းလမ်း) က — kernel ဆီကနေ client ရဲ့ operating system user name (လည်ပတ်စနစ် အသုံးပြုသူ အမည်) ကို ရယူပြီး — (optional ဖြစ်တဲ့ user name mapping နဲ့အတူ) — အဲဒီ user name ကို ခွင့်ပြုထားတဲ့ database user name အဖြစ် သုံးတာပါ။ ဒီနည်းလမ်းကို local connections တွေမှာပဲ ထောက်ပံ့ပါတယ်။

`peer` အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **map** — system နဲ့ database user names တွေကြားမှာ mapping (ချိတ်ဆက် သတ်မှတ်ခြင်း) လုပ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.2 ကို ကြည့်ပါ။

Peer authentication ကို — `getpeereid()` function, `SO_PEERCRED` socket parameter ဒါမှမဟုတ် အလားတူ mechanisms တွေကို ပံ့ပိုးပေးတဲ့ operating systems တွေမှာပဲ ရနိုင်ပါတယ်။ လောလောဆယ် အဲဒီထဲမှာ Linux, macOS အပါအဝင် BSD ရဲ့ flavor (မျိုးကွဲ) အများစုနဲ့ Solaris တို့ ပါဝင်ပါတယ်။
