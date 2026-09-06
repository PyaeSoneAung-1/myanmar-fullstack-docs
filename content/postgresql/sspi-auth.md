---
title: "SSPI Authentication (SSPI ဖြင့် စစ်ဆေး အတည်ပြုခြင်း)"
description: "Windows ၏ single sign-on ပါသော လုံခြုံသည့် authentication နည်းပညာ SSPI အကြောင်း — negotiate mode, GSSAPI နှင့် အပြန်အလှန် လုပ်ဆောင်နိုင်မှု၊ နှင့် SSPI configuration options (include_realm, compat_realm, upn_username, map, krb_realm) များ"
order: 158
source: "https://www.postgresql.org/docs/current/sspi-auth.html"
status: translated
updated: 2026-09-06
---

## 20.7. SSPI Authentication (SSPI ဖြင့် စစ်ဆေး အတည်ပြုခြင်း)

SSPI က single sign-on (တစ်ကြိမ်တည်း ဝင်ရောက်မှုဖြင့် အသုံးပြုနိုင်သော စနစ်) ပါတဲ့ — လုံခြုံတဲ့ authentication (အထောက်အထား စစ်ဆေး အတည်ပြုခြင်း) အတွက် — Windows နည်းပညာ တစ်ခု ဖြစ်ပါတယ်။ PostgreSQL က SSPI ကို `negotiate` mode နဲ့ သုံးမှာ ဖြစ်ပြီး — ဖြစ်နိုင်ရင် Kerberos ကို သုံးကာ — တခြား အခြေအနေတွေမှာတော့ NTLM ဆီ အလိုအလျောက် ပြန်ကျသွား (fall back) ပါလိမ့်မယ်။ SSPI နဲ့ GSSAPI တို့က client ရော server အနေနဲ့ပါ အပြန်အလှန် ဆက်သွယ် လုပ်ဆောင်နိုင်ပါတယ် — ဥပမာ — SSPI client တစ်ခုက GSSAPI server တစ်ခုဆီ authenticate လုပ်နိုင်ပါတယ်။ Windows client နဲ့ server တွေမှာ SSPI ကို သုံးဖို့၊ non-Windows platform တွေမှာတော့ GSSAPI ကို သုံးဖို့ အကြံပြုပါတယ်။

Kerberos authentication သုံးတဲ့အခါ — SSPI က GSSAPI လိုပဲ အလုပ်လုပ်ပါတယ်; အသေးစိတ်အတွက် [အပိုင်း 20.6](/docs/postgresql/gssapi-auth) ကို ကြည့်ပါ။

SSPI အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **include_realm** — 0 လို့ သတ်မှတ်ထားရင် — authentication လုပ်ပြီးသား user principal ကနေ realm နာမည်ကို ဖယ်ထုတ်ပြီးမှ user name mapping (အပိုင်း 20.2) ကနေတစ်ဆင့် ပို့လွှတ်ပါတယ်။ ဒါက မထောက်ခံထားတဲ့ အချက် ဖြစ်ပြီး — အဓိကအားဖြင့် နောက်ကြောင်း လိုက်ဖက်ညီမှုအတွက်ပဲ ရရှိနိုင်တာပါ — အကြောင်းကတော့ krb_realm ကိုပါ သုံးမထားဘူးဆိုရင် multi-realm environment တွေမှာ လုံခြုံမှု မရှိလို့ပါ။ include_realm ကို default (1) အတိုင်း ထားပြီး — principal နာမည်တွေကို PostgreSQL user နာမည်တွေအဖြစ် ပြောင်းဖို့ pg_ident.conf မှာ explicit mapping ပေးထားဖို့ အကြံပြုပါတယ်။
- **compat_realm** — 1 လို့ သတ်မှတ်ထားရင် — domain ရဲ့ SAM-compatible name (NetBIOS name လို့လည်း သိကြပါတယ်) ကို include_realm option အတွက် သုံးပါတယ်။ ဒါက default ဖြစ်ပါတယ်။ 0 လို့ သတ်မှတ်ထားရင်တော့ — Kerberos user principal နာမည်ထဲက တကယ့် realm နာမည် (true realm name) ကို သုံးပါတယ်။

  ဒီ option ကို disable လုပ်တာက — သင့်ရဲ့ server က domain account (domain member system ပေါ်က virtual service accounts တွေ အပါအဝင်) အောက်မှာ run နေပြီး — SSPI ကနေတစ်ဆင့် authenticate လုပ်နေတဲ့ client တွေ အားလုံးကလည်း domain accounts တွေ သုံးနေမှသာလျှင် လုပ်သင့်ပါတယ် — မဟုတ်ရင် authentication က မအောင်မြင်ပါဘူး။
- **upn_username** — ဒီ option ကို compat_realm နဲ့အတူ enable လုပ်ထားရင် — Kerberos UPN ထဲက user နာမည်ကို authentication အတွက် သုံးပါတယ်။ Disable လုပ်ထားရင် (default က ဒါပါ) — SAM-compatible user နာမည်ကို သုံးပါတယ်။ Default အနေနဲ့ — user account အသစ်တွေအတွက် ဒီနာမည် နှစ်ခုက အတူတူပဲ ဖြစ်ပါတယ်။

  Explicit user နာမည် သတ်မှတ်မထားရင် libpq က SAM-compatible နာမည်ကို သုံးတာ သတိပြုပါ။ libpq ဒါမှမဟုတ် အဲဒါကို အခြေခံတဲ့ driver တစ်ခုကို သုံးနေတယ်ဆိုရင် — ဒီ option ကို disabled အတိုင်း ထားသင့်ပြီး — ဒါမှမဟုတ် connection string ထဲမှာ user နာမည်ကို အတိအကျ (explicitly) သတ်မှတ်သင့်ပါတယ်။
- **map** — system နဲ့ database user နာမည်တွေကြား map လုပ်တာကို ခွင့်ပြုပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.2 ကို ကြည့်ပါ။ SSPI/Kerberos principal တစ်ခုအတွက် — ဥပမာ username@EXAMPLE.COM (ဒါမှမဟုတ် — ပိုနည်းတဲ့ အနေနဲ့ — username/hostbased@EXAMPLE.COM) — map လုပ်ဖို့ သုံးတဲ့ user နာမည်က username@EXAMPLE.COM (ဒါမှမဟုတ် — အသီးသီး — username/hostbased@EXAMPLE.COM) ဖြစ်ပြီး — include_realm ကို 0 လို့ သတ်မှတ်ထားတယ်ဆိုရင်တော့ — map လုပ်တဲ့အခါ username (ဒါမှမဟုတ် username/hostbased) ကို system user နာမည် အနေနဲ့ မြင်ရမှာ ဖြစ်ပါတယ်။
- **krb_realm** — user principal နာမည်တွေကို နှိုင်းယှဉ် စစ်ဆေးဖို့ realm ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို သတ်မှတ်ထားရင် — အဲဒီ realm က user တွေကိုပဲ လက်ခံမှာ ဖြစ်ပါတယ်။ မသတ်မှတ်ထားရင်တော့ — ဘယ် realm က user မဆို — လုပ်ဆောင်ထားတဲ့ user name mapping အတိုင်း — ချိတ်ဆက်နိုင်ပါတယ်။
