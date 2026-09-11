---
title: "BSD Authentication (BSD Authentication ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)"
description: "`password` နှင့် ဆင်တူသော်လည်း password စစ်ဆေးရန် BSD Authentication ကို သုံးသည့် authentication method — OpenBSD တွင်သာ ရရှိနိုင်ခြင်း၊ auth-postgresql login type နှင့် login.conf ရှိ postgresql login class အကြောင်း"
order: 169
source: "https://www.postgresql.org/docs/current/auth-bsd.html"
status: translated
updated: 2026-09-06
---

## 20.14. BSD Authentication (BSD Authentication ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)

ဒီ authentication method က `password` နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် password ကို စစ်ဆေး အတည်ပြုဖို့ BSD Authentication ကို သုံးတာ ကွာပါတယ်။ BSD Authentication ကို user name/password အတွဲတွေကို စစ်ဆေး အတည်ပြုဖို့ပဲ သုံးပါတယ်။ ဒါကြောင့် BSD Authentication ကို authentication အတွက် မသုံးခင် — user ရဲ့ role က database ထဲမှာ အရင်ကတည်းက ရှိပြီးသား ဖြစ်ရပါမယ်။ BSD Authentication framework က လောလောဆယ် OpenBSD မှာပဲ ရရှိနိုင်ပါတယ်။

PostgreSQL ထဲက BSD Authentication က `auth-postgresql` login type ကို သုံးပြီး — `login.conf` ထဲမှာ သတ်မှတ်ထားရင် `postgresql` login class နဲ့ authentication လုပ်ပါတယ်။ Default အနေနဲ့ ဒီ login class က မရှိတာမို့ — PostgreSQL က default login class ကို သုံးပါလိမ့်မယ်။

> **မှတ်ချက်:** BSD Authentication သုံးဖို့ဆိုရင် — PostgreSQL user account (ဆိုလိုတာက server ကို run နေတဲ့ operating system user) ကို `auth` group ထဲ အရင်ဆုံး ထည့်သွင်းထားရပါမယ်။ `auth` group က OpenBSD systems တွေမှာ default အနေနဲ့ ရှိပါတယ်။
