---
title: "RADIUS Authentication (RADIUS ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)"
description: "RADIUS ကို password စစ်ဆေး အတည်ပြုရေး နည်းလမ်းအဖြစ် သုံးသည့် `radius` authentication method — Access Request/Access Accept/Access Reject ဖလှယ်မှု၊ RADIUS servers အများအပြား သတ်မှတ်ခြင်း၊ radiusservers/radiussecrets/radiusports/radiusidentifiers option များအကြောင်း"
order: 150
source: "https://www.postgresql.org/docs/current/auth-radius.html"
status: translated
updated: 2026-09-06
---

## 20.11. RADIUS Authentication (RADIUS ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)

ဒီ authentication method က `password` နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် password ကို စစ်ဆေး အတည်ပြုတဲ့ နည်းလမ်းအဖြစ် RADIUS ကို သုံးတာ ကွာပါတယ်။ RADIUS ကို user name/password အတွဲတွေကို စစ်ဆေး အတည်ပြုဖို့ပဲ သုံးပါတယ်။ ဒါကြောင့် RADIUS ကို authentication အတွက် မသုံးခင် — user က database ထဲမှာ အရင်ကတည်းက ရှိပြီးသား ဖြစ်ရပါမယ်။

RADIUS authentication ကို သုံးတဲ့အခါ — configure လုပ်ထားတဲ့ RADIUS server ဆီ Access Request message (ဝင်ရောက်ခွင့် တောင်းဆိုမှု message) တစ်ခု ပို့ပေးပါလိမ့်မယ်။ ဒီ request က `Authenticate Only` (အထောက်အထား စစ်ဆေးရန်အတွက်သာ) ဆိုတဲ့ type ဖြစ်ပြီး — `user name`, `password` (encrypt လုပ်ထားသော) နဲ့ `NAS Identifier` (NAS — Network Access Server — ၏ အမှတ်အသား) တို့အတွက် parameters တွေ ပါဝင်ပါလိမ့်မယ်။ Request ကို server နဲ့ မျှဝေထားတဲ့ secret (လျှို့ဝှက်သော့) တစ်ခုနဲ့ encrypt လုပ်ပါလိမ့်မယ်။ RADIUS server က ဒီ request ကို `Access Accept` (ဝင်ရောက်ခွင့် လက်ခံသည်) ဒါမှမဟုတ် `Access Reject` (ဝင်ရောက်ခွင့် ငြင်းပယ်သည်) ဆိုပြီး ပြန်ဖြေပါလိမ့်မယ်။ RADIUS accounting (မှတ်တမ်း ကိုင်တွယ်မှု) အတွက်တော့ ထောက်ပံ့မှု မရှိပါဘူး။

RADIUS servers အများအပြားကို သတ်မှတ်လို့ရပြီး — အဲဒီလိုဆိုရင် တစ်ခုပြီးတစ်ခု အစဉ်လိုက် (sequentially) စမ်းကြည့်ပါလိမ့်မယ်။ Server တစ်ခုဆီကနေ negative response (ငြင်းပယ်ကြောင်း ပြန်စကား) ရရင် — authentication က မအောင်မြင်ပါဘူး။ Response မရရင် — စာရင်းထဲက နောက် server တစ်ခုကို စမ်းကြည့်ပါလိမ့်မယ်။ Server အများအပြား သတ်မှတ်ဖို့ — server names တွေကို comma တွေနဲ့ ခွဲပြီး — စာရင်းတစ်ခုလုံးကို double quotes တွေနဲ့ ဝိုင်းထားပါ။ Server အများအပြား သတ်မှတ်ထားရင် — ကျန် RADIUS options တွေကိုလည်း — server တစ်ခုစီအတွက် တစ်ဦးချင်း တန်ဖိုးတွေ ပေးဖို့ — comma နဲ့ ခွဲထားတဲ့ စာရင်းတွေအနေနဲ့ ပေးလို့ရပါတယ်။ တန်ဖိုး တစ်ခုတည်းအနေနဲ့လည်း သတ်မှတ်လို့ရပြီး — အဲဒီလိုဆိုရင် အဲဒီ တန်ဖိုးက server အားလုံးအတွက် သက်ရောက်ပါလိမ့်မယ်။

RADIUS အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **radiusservers** — ဆက်သွယ်ရမယ့် RADIUS servers တွေရဲ့ DNS names (အမည်များ) သို့မဟုတ် IP addresses တွေပါ။ ဒီ parameter က မဖြစ်မနေ လိုအပ်ပါတယ်။
- **radiussecrets** — RADIUS servers တွေနဲ့ လုံခြုံစွာ ဆက်သွယ်ပြောဆိုတဲ့အခါ သုံးတဲ့ shared secrets (မျှဝေသုံး လျှို့ဝှက်သော့များ) ပါ။ ဒါက PostgreSQL server နဲ့ RADIUS server ပေါ်မှာ တန်ဖိုး အတိအကျ တူညီနေရပါမယ်။ အနည်းဆုံး character ၁၆ လုံး ပါတဲ့ string တစ်ခု ဖြစ်ဖို့ အကြံပြုထားပါတယ်။ ဒီ parameter က မဖြစ်မနေ လိုအပ်ပါတယ်။

> **မှတ်ချက်:** သုံးမယ့် encryption vector (ကုဒ်ဝှက်ရေး vector) က PostgreSQL ကို OpenSSL အတွက် support နဲ့ build လုပ်ထားမှသာ ကုဒ်ဝှက်ရေး ပိုင်းမှာ အားကောင်း (cryptographically strong) ပါလိမ့်မယ်။ တခြား အခြေအနေတွေမှာတော့ — RADIUS server ဆီကို ပို့လွှတ်မှု (transmission) ကို secured (လုံခြုံသည်) လို့ မဟုတ်ဘဲ — obfuscated (ရှုပ်ထွေးအောင် ဖုံးကွယ်ထားသည်) လို့ပဲ မှတ်ယူသင့်ပြီး — လိုအပ်ရင် ပြင်ပ (external) လုံခြုံရေး အစီအမံတွေကို သုံးသင့်ပါတယ်။

- **radiusports** — RADIUS servers တွေပေါ်က ဆက်သွယ်ရမယ့် port numbers တွေပါ။ Port ကို မသတ်မှတ်ထားရင် — default RADIUS port (1812) ကို သုံးပါလိမ့်မယ်။
- **radiusidentifiers** — RADIUS requests တွေထဲမှာ NAS Identifier အဖြစ် သုံးရမယ့် strings တွေပါ။ ဒီ parameter ကို — ဥပမာ — user က ဘယ် database cluster ဆီ ဆက်သွယ်ဖို့ ကြိုးစားနေလဲဆိုတာကို ဖော်ပြဖို့ သုံးနိုင်ပြီး — RADIUS server ပေါ်မှာ policy တိုက်စစ်ခြင်း (policy matching) အတွက် အသုံးဝင်နိုင်ပါတယ်။ Identifier ကို မသတ်မှတ်ထားရင် — default ဖြစ်တဲ့ postgresql ကို သုံးပါလိမ့်မယ်။

RADIUS parameter တန်ဖိုးတစ်ခုထဲမှာ comma ဒါမှမဟုတ် whitespace (နေရာလွတ်) ထည့်ဖို့ လိုအပ်ရင် — တန်ဖိုးကို double quotes တွေနဲ့ ဝိုင်းထားခြင်းဖြင့် လုပ်နိုင်ပါတယ် — ဒါပေမယ့် double-quoting အလွှာ နှစ်ထပ် လိုအပ်လာလို့ ငြီးငွေ့စရာ ကောင်းပါတယ်။ RADIUS secret strings တွေထဲမှာ whitespace ထည့်တဲ့ ဥပမာ တစ်ခုကတော့:

```sql
host ... radius radiusservers="server1,server2" radiussecrets="""secret one"",""secret two"""
```
