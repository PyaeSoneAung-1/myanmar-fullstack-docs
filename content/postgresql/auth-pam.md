---
title: "PAM Authentication (PAM ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)"
description: "PAM (Pluggable Authentication Modules) ကို authentication ယန္တရားအဖြစ် သုံးသည့် `pam` authentication method — user name/password အတွဲများကို စစ်ဆေး အတည်ပြုခြင်း၊ pamservice နှင့် pam_use_hostname configuration options များအကြောင်း"
order: 168
source: "https://www.postgresql.org/docs/current/auth-pam.html"
status: translated
updated: 2026-09-06
---

## 20.13. PAM Authentication (PAM ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)

ဒီ authentication method က `password` နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် authentication ယန္တရားအဖြစ် PAM (Pluggable Authentication Modules — ချိတ်တပ်အသုံးပြုနိုင်သော authentication module များ) ကို သုံးတာ ကွာပါတယ်။ Default PAM service name က `postgresql` ဖြစ်ပါတယ်။ PAM ကို user name/password အတွဲတွေကို စစ်ဆေး အတည်ပြုဖို့ရော — optional အနေနဲ့ ချိတ်ဆက်ထားတဲ့ remote host name ဒါမှမဟုတ် IP address ကိုပါ စစ်ဆေး အတည်ပြုဖို့ သုံးပါတယ်။ ဒါကြောင့် PAM ကို authentication အတွက် မသုံးခင် — user က database ထဲမှာ အရင်ကတည်းက ရှိပြီးသား ဖြစ်ရပါမယ်။ PAM အကြောင်း ပိုမို သိရှိလိုပါက [Linux-PAM Page](https://www.kernel.org/pub/linux/libs/pam/) ကို ဖတ်ပါ။

PAM အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **pamservice** — PAM service name (PAM ဝန်ဆောင်မှု အမည်)။
- **pam_use_hostname** — remote IP address လား host name လားကို PAM_RHOST item ကနေတစ်ဆင့် PAM modules တွေဆီ ပေးအပ်မလားဆိုတာ ဆုံးဖြတ်ပါတယ်။ Default အနေနဲ့ IP address ကို သုံးပါတယ်။ ဒီ option ကို 1 လို့ သတ်မှတ်ရင် — အဲဒီအစား ဖြေရှင်းပြီးသား (resolved) host name ကို သုံးပါလိမ့်မယ်။ Host name resolution က login နှောင့်နှေးမှုတွေ ဖြစ်စေနိုင်ပါတယ်။ (PAM configuration အများစုက ဒီအချက်အလက်ကို မသုံးကြလို့ — ဒီ setting ကို အသုံးပြုဖို့ အထူး ဖန်တီးထားတဲ့ PAM configuration တစ်ခု ရှိမှသာ ဒီ setting ကို ထည့်သွင်း စဉ်းစားဖို့ လိုအပ်ပါတယ်။)

> **မှတ်ချက်:** PAM ကို `/etc/shadow` ဖတ်ဖို့ သတ်မှတ်ထားရင် — PostgreSQL server ကို root မဟုတ်တဲ့ user က စတင်ထားလို့ — authentication မအောင်မြင်ပါဘူး။ ဒါပေမယ့် PAM ကို LDAP ဒါမှမဟုတ် တခြား authentication methods တွေ သုံးဖို့ configure လုပ်ထားရင်တော့ ဒါက ပြဿနာ မဟုတ်ပါဘူး။
