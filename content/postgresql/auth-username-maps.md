---
title: "User Name Maps (user အမည်များကို ဆက်စပ်သတ်မှတ်ခြင်း)"
description: "Ident သို့မဟုတ် GSSAPI လို external authentication system တွေကနေ ရရှိတဲ့ operating system user အမည်တွေကို database user အမည်တွေနဲ့ ချိတ်ဆက်သတ်မှတ်ပေးတဲ့ user name maps အကြောင်း — pg_ident.conf ဖိုင် ပုံစံ၊ include directives၊ regular expression သုံးပြီး user အမည်များစွာကို တစ်ကြောင်းတည်းနဲ့ map လုပ်နည်း စသည်တို့"
order: 141
source: "https://www.postgresql.org/docs/current/auth-username-maps.html"
status: translated
updated: 2026-09-06
---

## 20.2. User Name Maps (user အမည်များကို ဆက်စပ်သတ်မှတ်ခြင်း)

Ident သို့မဟုတ် GSSAPI လို external authentication system (ပြင်ပ authentication စနစ်) တစ်ခုကို သုံးတဲ့အခါ — connection ကို စတင်ခဲ့တဲ့ operating system user ရဲ့ အမည်က — အသုံးပြုမယ့် database user (role) နဲ့ တူညီမှု မရှိနိုင်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ — user name map (user အမည် ဆက်စပ်သတ်မှတ်မှု) တစ်ခုကို သုံးပြီး operating system user အမည်ကို database user အမည်နဲ့ map လုပ်နိုင်ပါတယ်။ User name mapping ကို သုံးဖို့ဆိုရင် — `pg_hba.conf` ထဲက options field မှာ `map`=`map-name` လို့ သတ်မှတ်ပါ။ ဒီ option ကို — external user အမည်တွေ လက်ခံရရှိတဲ့ authentication method တွေ အားလုံးအတွက် ထောက်ပံ့ပေးထားပါတယ်။ Connection တစ်ခုနဲ့တစ်ခု မတူညီတဲ့ mapping တွေ လိုအပ်နိုင်တာမို့ — သုံးမယ့် map ရဲ့ အမည်ကို `pg_hba.conf` ထဲက `map-name` parameter မှာ သတ်မှတ်ပြီး — connection တစ်ခုချင်းစီအတွက် ဘယ် map ကို သုံးရမလဲဆိုတာ ညွှန်ပြပါတယ်။

User name maps တွေကို ident map file ထဲမှာ သတ်မှတ်ပါတယ် — ဒီ file ကို ပုံမှန်အားဖြင့် `pg_ident.conf` လို့ နာမည်ပေးထားပြီး — cluster ရဲ့ data directory ထဲမှာ သိမ်းဆည်းထားပါတယ်။ (ဒါပေမယ့် — map file ကို တခြားနေရာမှာ ထားဖို့လည်း ဖြစ်နိုင်ပါတယ်; [ident_file](https://www.postgresql.org/docs/current/runtime-config-file-locations.html#GUC-IDENT-FILE) configuration parameter ကို ကြည့်ပါ။) Ident map file မှာ ယေဘုယျ ပုံစံတွေ ဖြစ်တဲ့ အောက်ပါ line တွေ ပါဝင်ပါတယ်:

```sql
map-name system-username database-username
include file
include_if_exists file
include_dir directory
```

Comments (မှတ်ချက်များ), whitespace (နေရာလွတ်များ) နဲ့ line continuation (စာကြောင်း ဆက်လုပ်ခြင်း) တွေကို `pg_hba.conf` မှာ ကိုင်တွယ်သလိုမျိုးပဲ ကိုင်တွယ်ပါတယ်။ `map-name` က — ဒီ mapping ကို `pg_hba.conf` ထဲမှာ ရည်ညွှန်းဖို့ သုံးမယ့် ကြိုက်ရာ အမည် တစ်ခု ဖြစ်ပါတယ်။ ကျန် field နှစ်ခုက operating system user အမည် တစ်ခုနဲ့ ကိုက်ညီတဲ့ database user အမည် တစ်ခုကို သတ်မှတ်ပါတယ်။ `map-name` တစ်ခုတည်းကို ထပ်ခါထပ်ခါ သုံးပြီး — map တစ်ခုတည်းအတွင်းမှာ user-mapping အများအပြားကို သတ်မှတ်နိုင်ပါတယ်။

`pg_hba.conf` မှာလိုပဲ — ဒီ file ထဲက line တွေက include directive (ဖိုင်ထည့်သွင်းမှု ညွှန်ကြားချက်) တွေ ဖြစ်နိုင်ပြီး — စည်းမျဉ်း အတူတူပဲ လိုက်နာပါတယ်။

`pg_ident.conf` file ကို — server စတင်ချိန်မှာရော — main server process က SIGHUP signal လက်ခံရရှိတဲ့အခါမှာပါ ဖတ်ပါတယ်။ လည်ပတ်နေတဲ့ system တစ်ခုမှာ ဒီ file ကို တည်းဖြတ်မယ်ဆိုရင် — file ကို ပြန်ဖတ်စေဖို့ postmaster ကို signal ပို့ဖို့ လိုအပ်ပါတယ် (`pg_ctl reload` သုံးတာ၊ SQL function `pg_reload_conf()` ကို ခေါ်တာ ဒါမှမဟုတ် `kill -HUP` သုံးတာ စသည်ဖြင့်)။

System view တစ်ခုဖြစ်တဲ့ [`pg_ident_file_mappings`](https://www.postgresql.org/docs/current/view-pg-ident-file-mappings.html) က — `pg_ident.conf` file ထဲက ပြောင်းလဲမှုတွေကို ကြိုတင် စမ်းသပ်ဖို့ ဒါမှမဟုတ် — file ကို load လုပ်တာက လိုချင်တဲ့ ရလဒ်တွေ မဖြစ်ထွန်းခဲ့ရင် ပြဿနာတွေကို စစ်ဆေး ဖော်ထုတ်ဖို့ အသုံးဝင်ပါတယ်။ View ထဲမှာ `error` field တွေ non-null ဖြစ်နေတဲ့ row တွေက — file ရဲ့ သက်ဆိုင်ရာ line တွေမှာ ပြဿနာတွေ ရှိနေတာကို ညွှန်ပြပါတယ်။

Operating system user တစ်ယောက်က database user ဘယ်နှစ်ယောက်အထိ ကိုက်ညီနိုင်လဲ — ဒါမှမဟုတ် — အပြန်အလှန်အားဖြင့် database user တစ်ယောက်က operating system user ဘယ်နှစ်ယောက်အထိ ကိုက်ညီနိုင်လဲဆိုတာကို ကန့်သတ်ချက် မရှိပါဘူး။ ဒါကြောင့် — map ထဲက entries တွေကို “ဒီ operating system user က ဒီ database user အဖြစ် connect လုပ်ခွင့် ရှိတယ်” လို့ အဓိပ္ပာယ် ဖွင့်ဆိုသင့်ပါတယ် — သူတို့ ညီမျှတယ်လို့ ဆိုလိုတာ မဟုတ်ပါဘူး။ External authentication system ကနေ ရရှိတဲ့ user အမည်ကို — user က connect လုပ်ဖို့ တောင်းဆိုထားတဲ့ database user အမည်နဲ့ တွဲဖော်ပြတဲ့ map entry တစ်ခုခု ရှိနေရင် connection ကို ခွင့်ပြုပါတယ်။ `database-username` အနေနဲ့ `all` ဆိုတဲ့ တန်ဖိုးကို သုံးနိုင်ပါတယ် — ဒါက — `system-username` နဲ့ ကိုက်ညီမယ်ဆိုရင် — ဒီ user က ရှိနေတဲ့ database user တွေ အားလုံးရဲ့ ဘယ်သူ့အဖြစ်နဲ့မဆို log in လုပ်ခွင့် ရှိတယ်လို့ သတ်မှတ်တာပါ။ `all` ကို quote လုပ်လိုက်ရင် keyword ရဲ့ အထူး အဓိပ္ပာယ် ပျောက်သွားပါတယ်။

`database-username` က `+` character နဲ့ စတယ်ဆိုရင် — operating system user က — `pg_hba.conf` မှာ `+` နဲ့ စတဲ့ user အမည်တွေကို ကိုင်တွယ်သလိုပဲ — အဲဒီ role ထဲက ဘယ် user အဖြစ်နဲ့မဆို login လုပ်နိုင်ပါတယ်။ ဒါကြောင့် — `+` အမှတ်အသားက “ဒီ role ရဲ့ တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက် အဖွဲ့ဝင် ဖြစ်နေတဲ့ roles တွေထဲက ဘယ်ဟာနဲ့မဆို ကိုက်ညီမှု” ကို ဆိုလိုပြီး — `+` အမှတ်အသား မပါတဲ့ အမည်ကတော့ အဲဒီ role တစ်ခုတည်းနဲ့ပဲ ကိုက်ညီပါတယ်။ `+` နဲ့ စတဲ့ username တစ်ခုကို quote လုပ်လိုက်ရင် `+` ရဲ့ အထူး အဓိပ္ပာယ် ပျောက်သွားပါတယ်။

`system-username` field က slash (`/`) နဲ့ စတယ်ဆိုရင် — field ရဲ့ ကျန် အပိုင်းကို regular expression (စာသားပုံစံ ကိုက်ညီမှု စကားရပ်) အနေနဲ့ သတ်မှတ်ပါတယ်။ (PostgreSQL ရဲ့ regular expression syntax အသေးစိတ်အတွက် [အပိုင်း 9.7.3.1](/docs/postgresql/functions-matching) ကို ကြည့်ပါ။) Regular expression ထဲမှာ capture (ဖမ်းယူမှု) တစ်ခုတည်း — ဒါမှမဟုတ် — parentheses နဲ့ ဝိုင်းထားတဲ့ subexpression တစ်ခု ပါဝင်နိုင်ပါတယ်။ Capture နဲ့ ကိုက်ညီခဲ့တဲ့ system user အမည်ရဲ့ အပိုင်းကို — `database-username` field ထဲမှာ `\1` (backslash-one) အနေနဲ့ ရည်ညွှန်းနိုင်ပါတယ်။ ဒါက line တစ်ကြောင်းတည်းနဲ့ user အမည် အများအပြားကို map လုပ်နိုင်စေပြီး — ရိုးရှင်းတဲ့ syntax substitutions တွေအတွက် အထူး အသုံးဝင်ပါတယ်။ ဥပမာ — ဒီ entries တွေက

```sql
mymap   /^(.*)@mydomain\.com$      \1
mymap   /^(.*)@otherdomain\.com$   guest
```

`@mydomain.com` နဲ့ အဆုံးသတ်တဲ့ system user အမည်တွေ ရှိတဲ့ users တွေအတွက် domain အပိုင်းကို ဖယ်ရှားပေးပြီး — `@otherdomain.com` နဲ့ အဆုံးသတ်တဲ့ system အမည် ရှိတဲ့ user တိုင်းကို `guest` အဖြစ် log in လုပ်ခွင့် ပေးပါလိမ့်မယ်။ `\1` ပါဝင်တဲ့ `database-username` တစ်ခုကို quote လုပ်တာက `\1` ရဲ့ အထူး အဓိပ္ပာယ်ကို ပျောက်စေမှာ မဟုတ်ပါဘူး။

`database-username` field က slash (`/`) နဲ့ စတယ်ဆိုရင်လည်း — field ရဲ့ ကျန် အပိုင်းကို regular expression အနေနဲ့ သတ်မှတ်ပါတယ်။ `database-username` field က regular expression ဖြစ်နေတဲ့အခါ — ၎င်းအတွင်းမှာ `system-username` field က capture တစ်ခုကို ရည်ညွှန်းဖို့ `\1` ကို သုံးလို့ မရပါဘူး။

> **အကြံပြုချက်:** ပုံမှန်အားဖြင့် — regular expression တစ်ခုက string တစ်ခုရဲ့ အစိတ်အပိုင်း တစ်ခုကိုပဲ ကိုက်ညီနိုင်တာ သတိပြုပါ။ အပေါ်က ဥပမာမှာ ပြထားသလို — `^` နဲ့ `$` တွေကို သုံးပြီး — system user အမည် တစ်ခုလုံးနဲ့ပဲ ကိုက်ညီအောင် အတင်းအကျပ် လုပ်တာက များသောအားဖြင့် ပညာရှိရာ ရောက်ပါတယ်။

[ဥပမာ 20.1](/docs/postgresql/auth-pg-hba-conf) ထဲက `pg_hba.conf` file နဲ့ တွဲသုံးလို့ရမယ့် `pg_ident.conf` file တစ်ခုကို [ဥပမာ 20.2](/docs/postgresql/auth-username-maps) မှာ ပြထားပါတယ်။ ဒီ ဥပမာမှာ — 192.168 network ပေါ်က machine တစ်ခုမှာ log in လုပ်ထားပြီး — `bryanh`, `ann` ဒါမှမဟုတ် `robert` ဆိုတဲ့ operating system user အမည် မရှိတဲ့ ဘယ်သူ့ကိုမဆို access ခွင့် ပေးမှာ မဟုတ်ပါဘူး။ Unix user `robert` ကတော့ — PostgreSQL user `bob` အဖြစ် connect လုပ်ဖို့ ကြိုးစားတဲ့အခါမှပဲ access ခွင့် ရမှာ ဖြစ်ပြီး — `robert` ဒါမှမဟုတ် တခြား ဘယ်သူ့အဖြစ်နဲ့မဆို ရမှာ မဟုတ်ပါဘူး။ `ann` ကတော့ `ann` အဖြစ်ပဲ connect လုပ်ခွင့် ရှိပါတယ်။ User `bryanh` ကတော့ `bryanh` ဒါမှမဟုတ် `guest1` — တစ်ခုခုအဖြစ် connect လုပ်ခွင့် ရှိပါလိမ့်မယ်။

**ဥပမာ 20.2. pg_ident.conf File ဥပမာ တစ်ခု**

```sql
# MAPNAME       SYSTEM-USERNAME         PG-USERNAME

omicron         bryanh                  bryanh
omicron         ann                     ann
# bob has user name robert on these machines
omicron         robert                  bob
# bryanh can also connect as guest1
omicron         bryanh                  guest1
```
