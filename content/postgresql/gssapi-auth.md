---
title: "GSSAPI Authentication (GSSAPI ဖြင့် စစ်ဆေး အတည်ပြုခြင်း)"
description: "GSSAPI/Kerberos authentication အလုပ်လုပ်ပုံ — service principal နှင့် keytab ဖိုင်၊ client principal များကို user နာမည်များဆီ map လုပ်ခြင်း၊ နှင့် GSSAPI authentication options (include_realm, map, krb_realm) များ"
order: 179
source: "https://www.postgresql.org/docs/current/gssapi-auth.html"
status: translated
updated: 2026-09-06
---

## 20.6. GSSAPI Authentication (GSSAPI ဖြင့် စစ်ဆေး အတည်ပြုခြင်း)

GSSAPI က [RFC 2743](https://datatracker.ietf.org/doc/html/rfc2743) မှာ သတ်မှတ်ထားတဲ့ — လုံခြုံတဲ့ authentication (အထောက်အထား စစ်ဆေး အတည်ပြုခြင်း) အတွက် — industry-standard (စက်မှုလုပ်ငန်း စံနှုန်း) protocol တစ်ခု ဖြစ်ပါတယ်။ PostgreSQL က GSSAPI ကို authentication အတွက်၊ communications encryption (ဆက်သွယ်ရေး ကုဒ်ဝှက်ခြင်း) အတွက် ဒါမှမဟုတ် နှစ်ခုလုံးအတွက် ထောက်ပံ့ပါတယ်။ GSSAPI က ထောက်ပံ့တဲ့ system တွေအတွက် automatic authentication (single sign-on — တစ်ကြိမ်တည်း ဝင်ရောက်မှုဖြင့် အသုံးပြုနိုင်သော စနစ်) ကို ပေးပါတယ်။ Authentication ကိုယ်တိုင်ကတော့ လုံခြုံပါတယ်။ GSSAPI encryption ဒါမှမဟုတ် SSL encryption ကို သုံးထားရင် — database connection တစ်လျှောက် ပို့လွှတ်တဲ့ data တွေကို encrypt လုပ်မှာ ဖြစ်ပြီး — မသုံးထားရင်တော့ encrypt လုပ်မှာ မဟုတ်ပါဘူး။

GSSAPI အတွက် ပံ့ပိုးမှုကို PostgreSQL တည်ဆောက်တဲ့ (build) အချိန်မှာ enable လုပ်ထားရပါတယ်; အသေးစိတ်အတွက် [အခန်း 17](https://www.postgresql.org/docs/current/installation.html) ကို ကြည့်ပါ။

GSSAPI က Kerberos ကို သုံးတဲ့အခါ — `servicename/hostname@realm` ပုံစံရှိတဲ့ standard service principal (authentication identity — စစ်ဆေး အတည်ပြုရေး လက္ခဏာ) နာမည် တစ်ခုကို သုံးပါတယ်။ Installation တစ်ခုချင်းစီက သုံးတဲ့ principal နာမည်ကို PostgreSQL server ထဲမှာ ဘယ်လိုမှ ထည့်သွင်းထားတာ မဟုတ်ပါဘူး; အဲဒီအစား — server က သူ့ရဲ့ လက္ခဏာ (identity) ကို ဆုံးဖြတ်ဖို့ ဖတ်ရှုတဲ့ *keytab* (Kerberos key များ ပါဝင်သော ဖိုင်) ထဲမှာ သတ်မှတ်ထားပါတယ်။ Keytab ဖိုင်ထဲမှာ principal အများကြီး စာရင်းပြုထားရင် — server က အဲဒီထဲက ဘယ်ဟာကိုမဆို လက်ခံပါလိမ့်မယ်။ Server ရဲ့ realm (Kerberos အုပ်ချုပ်ရေး နယ်ပယ်) နာမည်ကတော့ — server က ဝင်ရောက် ဖတ်ရှုနိုင်တဲ့ Kerberos configuration ဖိုင်(များ)ထဲမှာ သတ်မှတ်ထားတဲ့ preferred realm (ဦးစားပေး realm) ဖြစ်ပါတယ်။

ချိတ်ဆက်တဲ့အခါ — client က သူ ချိတ်ဆက်ဖို့ ရည်ရွယ်ထားတဲ့ server ရဲ့ principal နာမည်ကို သိထားရပါမယ်။ Principal ရဲ့ `servicename` အပိုင်းက သာမန်အားဖြင့် `postgres` ဖြစ်ပြီး — တခြား တန်ဖိုး တစ်ခုကိုတော့ libpq ရဲ့ [krbsrvname](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-KRBSRVNAME) connection parameter (ချိတ်ဆက်မှု ကန့်သတ်ချက်) ကနေတစ်ဆင့် ရွေးချယ်နိုင်ပါတယ်။ `hostname` အပိုင်းကတော့ libpq ကို ချိတ်ဆက်ဖို့ ပြောထားတဲ့ fully qualified host name (အပြည့်အစုံ သတ်မှတ်ထားသော host အမည်) ဖြစ်ပါတယ်။ Realm နာမည်ကတော့ — client က ဝင်ရောက် ဖတ်ရှုနိုင်တဲ့ Kerberos configuration ဖိုင်(များ)ထဲမှာ သတ်မှတ်ထားတဲ့ preferred realm ဖြစ်ပါတယ်။

Client မှာလည်း သူ့ကိုယ်ပိုင် လက္ခဏာအတွက် principal နာမည် တစ်ခု ရှိပါလိမ့်မယ် (ပြီးတော့ ဒီ principal အတွက် valid ticket (တရားဝင် လက်မှတ်) တစ်ခု ရှိရပါမယ်)။ GSSAPI ကို authentication အတွက် သုံးဖို့ဆိုရင် — client principal က PostgreSQL database user နာမည် တစ်ခုနဲ့ ဆက်စပ်နေရပါမယ်။ `pg_ident.conf` configuration ဖိုင်ကို principal တွေကို user နာမည်တွေဆီ map (ချိတ်ဆက် သတ်မှတ်) လုပ်ဖို့ သုံးနိုင်ပါတယ်; ဥပမာ — `pgusername@realm` ကို `pgusername` သက်သက်အဖြစ် map လုပ်နိုင်ပါတယ်။ တနည်းအားဖြင့် — full `username@realm` principal ကိုပဲ — ဘာ mapping မှ မလုပ်ဘဲ — PostgreSQL ထဲက role နာမည် အနေနဲ့ သုံးနိုင်ပါတယ်။

PostgreSQL က principal ကနေ realm ကိုပဲ ဖယ်ထုတ်လိုက်ပြီး — client principal တွေကို user နာမည်တွေဆီ map လုပ်တာကိုလည်း ထောက်ပံ့ပါတယ်။ ဒီနည်းလမ်းကို နောက်ကြောင်း လိုက်ဖက်ညီမှု (backwards compatibility) အတွက် ထောက်ပံ့ထားတာ ဖြစ်ပြီး — ပြင်းပြင်းထန်ထန် မထောက်ခံပါဘူး — အကြောင်းကတော့ ဒီလိုဆိုရင် — user နာမည် တူညီပေမယ့် realm မတူညီတဲ့ user တွေကို ခွဲခြားဖို့ မဖြစ်နိုင်တော့လို့ပါ။ ဒါကို enable လုပ်ဖို့ဆိုရင် `include_realm` ကို 0 လို့ သတ်မှတ်ပါ။ ရိုးရှင်းတဲ့ single-realm installation တွေအတွက်တော့ — ဒီလိုလုပ်တာကို `krb_realm` parameter သတ်မှတ်တာနဲ့ ပေါင်းလုပ်ရင် (ဒါက principal ရဲ့ realm က `krb_realm` parameter ထဲမှာ ရှိတာနဲ့ အတိအကျ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါတယ်) — လုံခြုံနေဦးမှာပါ; ဒါပေမယ့် — ဒါက `pg_ident.conf` မှာ explicit mapping (အတိအကျ map လုပ်ချက်) သတ်မှတ်တာနဲ့ ယှဉ်ရင် — စွမ်းဆောင်နိုင်မှု နည်းတဲ့ နည်းလမ်း တစ်ခု ဖြစ်ပါတယ်။

Server ရဲ့ keytab ဖိုင် တည်ရှိရာ နေရာကို [krb_server_keyfile](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-KRB-SERVER-KEYFILE) configuration parameter (ဖွဲ့စည်းမှု ကန့်သတ်ချက်) နဲ့ သတ်မှတ်ပါတယ်။ လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် — server ကို system keytab ဖိုင်ကို ဖတ်ခွင့် ပြုတာထက် — PostgreSQL server အတွက်ပဲ သီးသန့် keytab တစ်ခု သုံးဖို့ အကြံပြုပါတယ်။ သင့်ရဲ့ server keytab ဖိုင်ကို PostgreSQL server account က ဖတ်လို့ ရနေအောင် (ဖြစ်နိုင်ရင် ဖတ်လို့ပဲ ရပြီး — ရေးလို့ မရအောင်) သေချာစေပါ။ (ဆက်စပ်ပြီး [အပိုင်း 18.1](https://www.postgresql.org/docs/current/postgres-user.html) ကိုလည်း ကြည့်ပါ။)

Keytab ဖိုင်ကို Kerberos software သုံးပြီး ထုတ်လုပ်ပါတယ်; အသေးစိတ်အတွက် Kerberos documentation ကို ကြည့်ပါ။ အောက်က ဥပမာက MIT Kerberos ရဲ့ kadmin tool ကို သုံးပြီး ဒါကို လုပ်ပုံကို ပြထားပါတယ်:

```sql
kadmin% addprinc -randkey postgres/server.my.domain.org
kadmin% ktadd -k krb5.keytab postgres/server.my.domain.org
```

GSSAPI authentication method အတွက် အောက်ပါ authentication options တွေကို ထောက်ပံ့ပါတယ်:

- **include_realm** — 0 လို့ သတ်မှတ်ထားရင် — authentication လုပ်ပြီးသား user principal ကနေ realm နာမည်ကို ဖယ်ထုတ်ပြီးမှ user name mapping (အပိုင်း 20.2) ကနေတစ်ဆင့် ပို့လွှတ်ပါတယ်။ ဒါက မထောက်ခံထားတဲ့ အချက် ဖြစ်ပြီး — အဓိကအားဖြင့် နောက်ကြောင်း လိုက်ဖက်ညီမှုအတွက်ပဲ ရရှိနိုင်တာပါ — အကြောင်းကတော့ krb_realm ကိုပါ သုံးမထားဘူးဆိုရင် multi-realm environment တွေမှာ လုံခြုံမှု မရှိလို့ပါ။ include_realm ကို default (1) အတိုင်း ထားပြီး — principal နာမည်တွေကို PostgreSQL user နာမည်တွေအဖြစ် ပြောင်းဖို့ pg_ident.conf မှာ explicit mapping ပေးထားဖို့ အကြံပြုပါတယ်။
- **map** — client principal တွေကနေ database user နာမည်တွေဆီ map လုပ်တာကို ခွင့်ပြုပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.2 ကို ကြည့်ပါ။ GSSAPI/Kerberos principal တစ်ခုအတွက် — ဥပမာ username@EXAMPLE.COM (ဒါမှမဟုတ် — ပိုနည်းတဲ့ အနေနဲ့ — username/hostbased@EXAMPLE.COM) — map လုပ်ဖို့ သုံးတဲ့ user နာမည်က username@EXAMPLE.COM (ဒါမှမဟုတ် — အသီးသီး — username/hostbased@EXAMPLE.COM) ဖြစ်ပြီး — include_realm ကို 0 လို့ သတ်မှတ်ထားတယ်ဆိုရင်တော့ — map လုပ်တဲ့အခါ username (ဒါမှမဟုတ် username/hostbased) ကို system user နာမည် အနေနဲ့ မြင်ရမှာ ဖြစ်ပါတယ်။
- **krb_realm** — user principal နာမည်တွေကို နှိုင်းယှဉ် စစ်ဆေးဖို့ realm ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို သတ်မှတ်ထားရင် — အဲဒီ realm က user တွေကိုပဲ လက်ခံမှာ ဖြစ်ပါတယ်။ မသတ်မှတ်ထားရင်တော့ — ဘယ် realm က user မဆို — လုပ်ဆောင်ထားတဲ့ user name mapping အတိုင်း — ချိတ်ဆက်နိုင်ပါတယ်။

`pg_hba.conf` entry (စာကြောင်း) အမျိုးမျိုးအတွက် မတူညီနိုင်တဲ့ ဒီ settings တွေအပြင် — server တစ်ခုလုံး သက်ရောက်တဲ့ [krb_caseins_users](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-KRB-CASEINS-USERS) configuration parameter လည်း ရှိပါတယ်။ အဲဒါကို true လို့ သတ်မှတ်ထားရင် — client principal တွေကို user map entries တွေနဲ့ case-insensitive (စာလုံး အကြီးအသေး မခွဲခြားဘဲ) နည်းနဲ့ ကိုက်ညီစေပါတယ်။ `krb_realm` ကိုလည်း — သတ်မှတ်ထားရင် — case-insensitive နည်းနဲ့ပဲ ကိုက်ညီစေပါတယ်။
