---
title: "Privileges (ခွင့်ပြုချက်များ)"
description: "Privilege (ခွင့်ပြုချက်) များအကြောင်း — owner နှင့် GRANT/REVOKE, grant option, PUBLIC, privilege အမျိုးအစားများနှင့် ACL အတိုကောက်များ"
order: 29
source: "https://www.postgresql.org/docs/current/ddl-priv.html"
status: translated
updated: 2026-09-03
---

## 5.8. Privileges (ခွင့်ပြုချက်များ)

Object တစ်ခုကို ဖန်တီးလိုက်တဲ့အခါ — အဲဒီ object ကို owner (ပိုင်ရှင်) တစ်ဦးဆီမှာ သတ်မှတ်ပေးပါတယ်။ Owner ဆိုတာက ပုံမှန်အားဖြင့် — အဲဒီ object ကို ဖန်တီးတဲ့ statement ကို လုပ်ဆောင်ခဲ့တဲ့ role ပဲ ဖြစ်ပါတယ်။ Object အမျိုးအစား အများစုမှာ — ကနဦး အခြေအနေအနေနဲ့ — owner (သို့မဟုတ် superuser) တစ်ဦးတည်းကသာ object နဲ့ ပတ်သက်ပြီး ဘာမဆို လုပ်နိုင်ပါတယ်။ တခြား role တွေ အသုံးပြုနိုင်ဖို့ဆိုရင် — *privileges* (ခွင့်ပြုချက်များ) တွေကို grant (ပေးအပ်) လုပ်ပေးရပါတယ်။

Privilege အမျိုးအစား အမျိုးမျိုး ရှိပါတယ်: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER`, `CREATE`, `CONNECT`, `TEMPORARY`, `EXECUTE`, `USAGE`, `SET`, `ALTER SYSTEM` နဲ့ `MAINTAIN` တို့ ဖြစ်ပါတယ်။ Object တစ်ခုအတွက် သက်ရောက်နိုင်တဲ့ privilege တွေက — object ရဲ့ အမျိုးအစား (table, function စသည်) ပေါ်မှာ မူတည်ပြီး ကွဲပြားပါတယ်။ ဒီ privilege တွေရဲ့ အဓိပ္ပာယ် အသေးစိတ်ကို အောက်မှာ ဖော်ပြထားပါတယ်။ နောက်လာမယ့် section တွေနဲ့ chapter တွေမှာလည်း — ဒီ privilege တွေကို ဘယ်လို အသုံးပြုလဲဆိုတာ — တွေ့ရမှာ ဖြစ်ပါတယ်။

Object တစ်ခုကို ပြုပြင်ဖို့ ဒါမှမဟုတ် ဖျက်ဆီးဖို့ ရှိတဲ့ အခွင့်အရေးကတော့ — object ရဲ့ owner ဖြစ်ခြင်းနဲ့အတူ မွေးရာပါ ပါလာတာ ဖြစ်ပြီး — အဲဒီ အခွင့်အရေးကို သူ့အလိုလို (in itself) အနေနဲ့တော့ grant ဒါမှမဟုတ် revoke လုပ်လို့ မရပါဘူး။ (ဒါပေမယ့် — တခြား privilege တွေလိုပဲ — ဒီ အခွင့်အရေးကို owner role ရဲ့ အဖွဲ့ဝင်တွေက အမွေဆက်ခံနိုင်ပါတယ်; [အပိုင်း 21.3](https://www.postgresql.org/docs/current/role-membership.html) ကို ကြည့်ပါ။)

Object တစ်ခုကို — အဲဒီ object အတွက် သင့်လျော်တဲ့ `ALTER` command အမျိုးအစားနဲ့ — owner အသစ် တစ်ဦးဆီ ပြောင်းအပ်နိုင်ပါတယ်။ ဥပမာ

```sql
ALTER TABLE table_name OWNER TO new_owner;
```

Superuser တွေကတော့ ဒါကို အမြဲတမ်း လုပ်နိုင်ပါတယ်; သာမန် role တွေကတော့ — သူတို့က object ရဲ့ လက်ရှိ owner ဖြစ်နေတာ (ဒါမှမဟုတ် owner role ရဲ့ privilege တွေကို အမွေရထားတာ) ဖြစ်ပြီး — owner အသစ်ဆီ `SET ROLE` လုပ်နိုင်တဲ့အခါမှသာ ဒါကို လုပ်နိုင်ပါတယ်။ Owner အဟောင်းရဲ့ object privilege တွေ အားလုံးက — ပိုင်ဆိုင်မှု (ownership) နဲ့အတူ — owner အသစ်ဆီ လွှဲပြောင်းသွားပါတယ်။

Privilege တွေ သတ်မှတ်ပေးဖို့ဆိုရင် — [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command ကို အသုံးပြုပါတယ်။ ဥပမာ — `joe` က ရှိပြီးသား role တစ်ခု ဖြစ်ပြီး `accounts` က ရှိပြီးသား table တစ်ခု ဆိုရင် — table ကို update လုပ်ဖို့ privilege ကို ဒီလို grant လုပ်နိုင်ပါတယ်:

```sql
GRANT UPDATE ON accounts TO joe;
```

တိကျတဲ့ privilege တစ်ခု နေရာမှာ `ALL` လို့ ရေးလိုက်ရင် — object type အတွက် သက်ဆိုင်တဲ့ privilege တွေ အားလုံးကို grant လုပ်ပါတယ်။

“role” ဆိုတဲ့ အထူးနာမည် `PUBLIC` ကို သုံးပြီး — system ပေါ်က role တိုင်းကို privilege တစ်ခု grant လုပ်နိုင်ပါတယ်။ ဒါ့အပြင် — database တစ်ခုမှာ user အများကြီး ရှိတဲ့အခါ privilege တွေ စီမံခန့်ခွဲရာမှာ ကူညီဖို့ — “group” role တွေကိုလည်း ဖွဲ့စည်းထားနိုင်ပါတယ် — အသေးစိတ်ကို [အခန်း 21](https://www.postgresql.org/docs/current/user-manag.html) မှာ ကြည့်ပါ။

အရင်က grant လုပ်ထားခဲ့တဲ့ privilege တစ်ခုကို ပြန်ရုတ်သိမ်းဖို့ဆိုရင် — နာမည်နဲ့လိုက်ဖက်တဲ့ [REVOKE](https://www.postgresql.org/docs/current/sql-revoke.html) command ကို အသုံးပြုပါတယ်:

```sql
REVOKE ALL ON accounts FROM PUBLIC;
```

ပုံမှန်အားဖြင့် — object ရဲ့ owner (သို့မဟုတ် superuser) တစ်ဦးတည်းကသာ object တစ်ခုပေါ်က privilege တွေကို grant ဒါမှမဟုတ် revoke လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် — privilege တစ်ခုကို “with grant option” (grant option ပါဝင်စွာ) ဆိုပြီး grant လုပ်ဖို့ ဖြစ်နိုင်ပါတယ် — ဒါက လက်ခံသူ (recipient) ကို — အဲဒီ privilege ကို သူ့အလှည့်မှာ တခြားသူတွေဆီ ပြန် grant လုပ်ပိုင်ခွင့် ပေးပါတယ်။ နောက်ပိုင်းမှာ grant option ကို revoke လုပ်လိုက်ရင် — အဲဒီ recipient ဆီကနေ (တိုက်ရိုက် ဒါမှမဟုတ် grant ကွင်းဆက် (chain) တစ်ခုကတစ်ဆင့်) privilege ရရှိခဲ့သူတွေ အားလုံး — privilege ဆုံးရှုံးသွားပါလိမ့်မယ်။ အသေးစိတ်အတွက် [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) နဲ့ [REVOKE](https://www.postgresql.org/docs/current/sql-revoke.html) reference page တွေကို ကြည့်ပါ။

Object တစ်ခုရဲ့ owner က — ကိုယ့်ရဲ့ သာမန် privilege တွေကို ကိုယ်တိုင် revoke လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ် — ဥပမာ — table ကို တခြားသူတွေအတွက်ရော ကိုယ့်အတွက်ပါ — read-only (ဖတ်ရန်သာ) ဖြစ်အောင် လုပ်ထားတာမျိုးပါ။ ဒါပေမယ့် — owner တွေကို grant option တွေ အားလုံး ကိုင်ထားသူအဖြစ် အမြဲတမ်း သတ်မှတ်ခံရလို့ — ကိုယ့်ရဲ့ privilege တွေကို အချိန်မရွေး ပြန် grant လုပ်နိုင်ပါတယ်။

ရရှိနိုင်တဲ့ privilege တွေကတော့:

- **SELECT** — Table, view, materialized view ဒါမှမဟုတ် table နဲ့ဆင်တူတဲ့ (table-like) တခြား object တစ်ခုရဲ့ — ဘယ် column ကနေမဆို ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ column (တစ်ခု သို့မဟုတ် အများ) တွေကနေ — SELECT လုပ်ခွင့် ပေးပါတယ်။ COPY TO သုံးခွင့်ကိုလည်း ပေးပါတယ်။ UPDATE, DELETE ဒါမှမဟုတ် MERGE တွေမှာ ရှိပြီးသား column တန်ဖိုးတွေကို ရည်ညွှန်းဖို့အတွက်လည်း ဒီ privilege လိုအပ်ပါတယ်။ Sequence တွေအတွက်ဆိုရင် — ဒီ privilege က currval function သုံးခွင့်ကိုလည်း ပေးပါတယ်။ Large object တွေအတွက်ကတော့ — ဒီ privilege က object ကို ဖတ်ခွင့် ပေးပါတယ်။
- **INSERT** — Table, view စတာတွေထဲကို row အသစ် တစ်ခု INSERT လုပ်ခွင့် ပေးပါတယ်။ သတ်မှတ်ထားတဲ့ column (တစ်ခု သို့မဟုတ် အများ) တွေပေါ်မှာလည်း grant လုပ်လို့ရပါတယ် — အဲဒီလို ဆိုရင် INSERT command ထဲမှာ အဲဒီ column တွေကိုပဲ တန်ဖိုး သတ်မှတ်ခွင့် ရှိပါတယ် (ကျန်တဲ့ column တွေကတော့ default value တွေ ရရှိမှာ ဖြစ်ပါတယ်)။ COPY FROM သုံးခွင့်ကိုလည်း ပေးပါတယ်။
- **UPDATE** — Table, view စတာတွေရဲ့ — ဘယ် column မဆို ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ column (တစ်ခု သို့မဟုတ် အများ) တွေကို — UPDATE လုပ်ခွင့် ပေးပါတယ်။ (လက်တွေ့မှာတော့ — ဘယ် row တွေကို update လုပ်ရမလဲ ဆုံးဖြတ်ဖို့ ဒါမှမဟုတ် column တွေအတွက် တန်ဖိုးအသစ်တွေ တွက်ချက်ဖို့ — table column တွေကို ရည်ညွှန်းရတဲ့အတွက် — သိသာထင်ရှားတဲ့ UPDATE command တိုင်းနီးပါးက SELECT privilege လည်း လိုအပ်ပါတယ်။) SELECT ... FOR UPDATE နဲ့ SELECT ... FOR SHARE တွေကလည်း — SELECT privilege အပြင် — column အနည်းဆုံး တစ်ခုပေါ်မှာ ဒီ privilege ကို လိုအပ်ပါတယ်။ Sequence တွေအတွက်ဆိုရင် — ဒီ privilege က nextval နဲ့ setval function တွေ သုံးခွင့် ပေးပါတယ်။ Large object တွေအတွက်ကတော့ — ဒီ privilege က object ကို ရေးသားခွင့် (write) ဒါမှမဟုတ် truncate လုပ်ခွင့် ပေးပါတယ်။
- **DELETE** — Table, view စတာတွေကနေ row တစ်ခုကို DELETE လုပ်ခွင့် ပေးပါတယ်။ (လက်တွေ့မှာတော့ — ဘယ် row တွေကို ဖျက်ရမလဲ ဆုံးဖြတ်ဖို့ table column တွေကို ရည်ညွှန်းရတဲ့အတွက် — သိသာထင်ရှားတဲ့ DELETE command တိုင်းနီးပါးက SELECT privilege လည်း လိုအပ်ပါတယ်။)
- **TRUNCATE** — Table တစ်ခုပေါ်မှာ TRUNCATE လုပ်ခွင့် ပေးပါတယ်။
- **REFERENCES** — Table တစ်ခုကို ဒါမှမဟုတ် table ရဲ့ သတ်မှတ်ထားတဲ့ column (တစ်ခု သို့မဟုတ် အများ) တွေကို ရည်ညွှန်းတဲ့ foreign key constraint တစ်ခု ဖန်တီးခွင့် ပေးပါတယ်။ ဒီ privilege ကို grant လုပ်တဲ့အခါ အထူး ဂရုစိုက်ရပါမယ် — foreign key တစ်ခုကို ဖန်တီးတဲ့ user က — cast function လိုမျိုး — ကြိုက်ရာ function တစ်ခုကို အဲဒီ foreign key ရဲ့ enforcement (လိုက်နာစစ်ဆေးမှု) က ခေါ်ယူဖို့ စီစဉ်နိုင်ပြီး — အဲဒီ function တွေကို table owner ရဲ့ privilege တွေနဲ့ ခေါ်ယူခံရလို့ပါ။
- **TRIGGER** — Table, view စတာတွေပေါ်မှာ trigger တစ်ခု ဖန်တီးခွင့် ပေးပါတယ်။ ဒီ privilege ကို grant လုပ်တဲ့အခါ အထူး ဂရုစိုက်ရပါမယ် — table ဒါမှမဟုတ် view တစ်ခုပေါ် ထပ်ထည့်လိုက်တဲ့ trigger တွေက — အဲဒါကို ပြုပြင်မွမ်းမံသူ user တွေရဲ့ privilege တွေနဲ့ execute (လုပ်ဆောင်) လုပ်ခံရလို့ပါ။
- **CREATE** — Database တွေအတွက်ဆိုရင် — database ထဲမှာ schema အသစ်တွေနဲ့ publication အသစ်တွေ ဖန်တီးခွင့်၊ ပြီးတော့ database ထဲမှာ trusted extension တွေ install လုပ်ခွင့် ပေးပါတယ်။
Schema တွေအတွက်ဆိုရင် — schema ထဲမှာ object အသစ်တွေ ဖန်တီးခွင့် ပေးပါတယ်။ ရှိပြီးသား object တစ်ခုကို နာမည်ပြောင်းဖို့ဆိုရင် — object ကို ကိုယ်ပိုင် ပိုင်ဆိုင်ထားရမယ် ပြီးတော့ object ပါဝင်နေတဲ့ schema အတွက် ဒီ privilege ရှိရပါမယ်။
Tablespace တွေအတွက်ဆိုရင် — tablespace ထဲမှာ table, index နဲ့ temporary file တွေ ဖန်တီးခွင့်၊ ပြီးတော့ အဲဒီ tablespace ကို default tablespace အဖြစ် သုံးတဲ့ database တွေ ဖန်တီးခွင့် ပေးပါတယ်။
ဒီ privilege ကို revoke လုပ်တာက ရှိပြီးသား object တွေရဲ့ တည်ရှိမှု (existence) ဒါမှမဟုတ် တည်နေရာကို ပြောင်းလဲစေမှာ မဟုတ်တာ သတိပြုပါ။
- **CONNECT** — Grant ခံရသူ (grantee) ကို database ဆီ connect လုပ်ခွင့် ပေးပါတယ်။ ဒီ privilege ကို connection စတင်ချိန်မှာ စစ်ဆေးပါတယ် (pg_hba.conf က ချမှတ်ထားတဲ့ ကန့်သတ်ချက်တွေ စစ်ဆေးတာအပြင်)။
- **TEMPORARY** — Database ကို အသုံးပြုနေစဉ်မှာ temporary table တွေ ဖန်တီးခွင့် ပေးပါတယ်။
- **EXECUTE** — Function ဒါမှမဟုတ် procedure တစ်ခုကို ခေါ်ယူခွင့် ပေးပါတယ် — function ပေါ်မှာ အခြေခံပြီး implement လုပ်ထားတဲ့ operator တွေ အသုံးပြုတာအပါအဝင်ပါ။ ဒါက function နဲ့ procedure တွေအတွက် သက်ရောက်နိုင်တဲ့ တစ်ခုတည်းသော privilege အမျိုးအစား ဖြစ်ပါတယ်။
- **USAGE** — Procedural language တွေအတွက်ဆိုရင် — အဲဒီ language နဲ့ function တွေ ဖန်တီးဖို့ language ကို အသုံးပြုခွင့် ပေးပါတယ်။ ဒါက procedural language တွေအတွက် သက်ရောက်နိုင်တဲ့ တစ်ခုတည်းသော privilege အမျိုးအစား ဖြစ်ပါတယ်။
Schema တွေအတွက်ဆိုရင် — schema ထဲမှာ ပါဝင်တဲ့ object တွေကို access လုပ်ခွင့် ပေးပါတယ် (object တွေရဲ့ ကိုယ်ပိုင် privilege လိုအပ်ချက်တွေလည်း ပြည့်မီနေတယ်လို့ ယူဆပါတယ်)။ အခြေခံအားဖြင့် — ဒါက grantee ကို schema ထဲက object တွေကို “ရှာဖွေကြည့်ရှု” (look up) လုပ်ခွင့် ပေးပါတယ်။ ဒီခွင့်ပြုချက် မရှိဘဲနဲ့တောင် — system catalog တွေကို query လုပ်ပြီး — object နာမည်တွေကို မြင်ရဖို့ ဖြစ်နိုင်ပါသေးတယ်။ ဒါ့အပြင် — ဒီခွင့်ပြုချက်ကို revoke လုပ်ပြီးနောက်မှာတောင် — ရှိပြီးသား session တွေထဲမှာ ဒီ lookup ကို အရင်က လုပ်ဆောင်ခဲ့ပြီးသား statement တွေ ရှိနေနိုင်လို့ — object access ကို တားဆီးဖို့ ဒါက လုံးဝ လုံခြုံတဲ့ နည်းလမ်း မဟုတ်ပါဘူး။
Sequence တွေအတွက်ဆိုရင် — currval နဲ့ nextval function တွေ အသုံးပြုခွင့် ပေးပါတယ်။
Type နဲ့ domain တွေအတွက်ဆိုရင် — table, function နဲ့ တခြား schema object တွေ ဖန်တီးရာမှာ အဲဒီ type ဒါမှမဟုတ် domain ကို အသုံးပြုခွင့် ပေးပါတယ်။ (ဒီ privilege က type ရဲ့ “usage” (အသုံးပြုမှု) အားလုံးကို ထိန်းချုပ်တာ မဟုတ်တာ သတိပြုပါ — ဥပမာ — query တွေထဲမှာ အဲဒီ type ရဲ့ တန်ဖိုးတွေ ပေါ်လာတာမျိုး ပါဝင်ပါတယ်။ Type ပေါ်မှာ မှီခိုနေတဲ့ object တွေ ဖန်တီးခံရတာကိုပဲ တားဆီးတာပါ။ ဒီ privilege ရဲ့ အဓိက ရည်ရွယ်ချက်က — type တစ်ခုပေါ်မှာ dependency (မှီခိုမှု) တွေကို ဘယ် user တွေ ဖန်တီးနိုင်လဲ ထိန်းချုပ်ဖို့ ဖြစ်ပြီး — ဒါက နောက်ပိုင်းမှာ type ကို ပြောင်းလဲဖို့ owner အတွက် အနှောင့်အယှက် ဖြစ်စေနိုင်လို့ပါ။)
Foreign-data wrapper တွေအတွက်ဆိုရင် — foreign-data wrapper ကို အသုံးပြုပြီး server အသစ်တွေ ဖန်တီးခွင့် ပေးပါတယ်။
Foreign server တွေအတွက်ဆိုရင် — server ကို အသုံးပြုပြီး foreign table တွေ ဖန်တီးခွင့် ပေးပါတယ်။ Grantee တွေက အဲဒီ server နဲ့ ဆက်စပ်တဲ့ ကိုယ်ပိုင် user mapping တွေကိုလည်း ဖန်တီး၊ ပြုပြင် ဒါမှမဟုတ် ဖျက်နိုင်ပါတယ်။
- **SET** — Server configuration parameter တစ်ခုကို — လက်ရှိ session အတွင်း — တန်ဖိုးအသစ် တစ်ခု သတ်မှတ်ခွင့် ပေးပါတယ်။ (ဒီ privilege ကို parameter ဘယ်ခုပေါ်မှာမဆို grant လုပ်လို့ရပေမယ့် — ပုံမှန်အားဖြင့် superuser privilege လိုအပ်တဲ့ parameter တွေအတွက်သာ အဓိပ္ပာယ် ရှိပါတယ်။)
- **ALTER SYSTEM** — ALTER SYSTEM command ကို သုံးပြီး server configuration parameter တစ်ခုကို တန်ဖိုးအသစ် တစ်ခုနဲ့ configure (ပြင်ဆင်သတ်မှတ်) လုပ်ခွင့် ပေးပါတယ်။
- **MAINTAIN** — Relation (table ကဲ့သို့သော database object) တစ်ခုပေါ်မှာ VACUUM, ANALYZE, CLUSTER, REFRESH MATERIALIZED VIEW, REINDEX, LOCK TABLE တွေ လုပ်ဆောင်ခွင့်နဲ့ — database object statistics တွေကို ကိုင်တွယ်တဲ့ function တွေ သုံးခွင့် (ဇယား 9.105 ကို ကြည့်ပါ) ပေးပါတယ်။

တခြား command တွေ လိုအပ်တဲ့ privilege တွေကို — သက်ဆိုင်ရာ command တစ်ခုချင်းစီရဲ့ reference page တွေမှာ ဖော်ပြထားပါတယ်။

PostgreSQL က object အမျိုးအစား တချို့ပေါ်မှာ — object တွေ ဖန်တီးလိုက်တဲ့အခါ — `PUBLIC` ကို default အနေနဲ့ privilege တွေ grant လုပ်ပေးပါတယ်။ Table, table column, sequence, foreign data wrapper, foreign server, large object, schema, tablespace ဒါမှမဟုတ် configuration parameter တွေပေါ်မှာတော့ — `PUBLIC` ကို default အနေနဲ့ ဘာ privilege မှ မပေးပါဘူး။ တခြား object အမျိုးအစားတွေအတွက်ကတော့ — `PUBLIC` ကို default ပေးထားတဲ့ privilege တွေက ဒီလိုပါ: database တွေအတွက် `CONNECT` နဲ့ `TEMPORARY` (temporary table ဖန်တီးခွင့်) privilege တွေ; function နဲ့ procedure တွေအတွက် `EXECUTE` privilege; ပြီးတော့ language နဲ့ data type (domain အပါအဝင်) တွေအတွက် `USAGE` privilege တို့ ဖြစ်ပါတယ်။ Object owner ကတော့ — default privilege တွေရော အတိအကျ grant လုပ်ထားတဲ့ privilege တွေရော — နှစ်မျိုးလုံးကို `REVOKE` လုပ်နိုင်ပါတယ်။ (လုံခြုံရေး အမြင့်ဆုံး ရဖို့ဆိုရင် — object ကို ဖန်တီးတဲ့ transaction ထဲမှာပဲ `REVOKE` ကို ထုတ်လိုက်ပါ; ဒါဆိုရင် — တခြား user တစ်ယောက်က object ကို အသုံးပြုနိုင်တဲ့ အချိန်ကွာဟချက် (window) တစ်ခုမျှ မရှိတော့ပါဘူး။) ဒါ့အပြင် — ဒီ default privilege ဆက်တင်တွေကို [ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html) command နဲ့ ပြောင်းလဲ (override) လုပ်နိုင်ပါတယ်။

ဇယား 5.1 က — *ACL* တန်ဖိုးတွေထဲမှာ ဒီ privilege အမျိုးအစားတွေအတွက် သုံးတဲ့ — စာလုံးတစ်လုံး အတိုကောက်တွေကို ပြပါတယ်။ ဒီစာလုံးတွေကို အောက်မှာ ဖော်ပြမယ့် [psql](https://www.postgresql.org/docs/current/app-psql.html) command တွေရဲ့ output တွေမှာ ဒါမှမဟုတ် system catalog တွေရဲ့ ACL column တွေကို ကြည့်တဲ့အခါ တွေ့ရမှာ ဖြစ်ပါတယ်။

**ဇယား 5.1. ACL Privilege အတိုကောက်များ**

| Privilege | Abbreviation | Applicable Object Types |
| --- | --- | --- |
| `SELECT` | `r` (“read” — ဖတ်ခြင်း) | `LARGE OBJECT`, `SEQUENCE`, `TABLE` (နှင့် table နဲ့ဆင်တူသော object များ), table column (table ၏ column) |
| `INSERT` | `a` (“append” — ထည့်သွင်းခြင်း) | `TABLE`, table column |
| `UPDATE` | `w` (“write” — ရေးသားခြင်း) | `LARGE OBJECT`, `SEQUENCE`, `TABLE`, table column |
| `DELETE` | `d` | `TABLE` |
| `TRUNCATE` | `D` | `TABLE` |
| `REFERENCES` | `x` | `TABLE`, table column |
| `TRIGGER` | `t` | `TABLE` |
| `CREATE` | `C` | `DATABASE`, `SCHEMA`, `TABLESPACE` |
| `CONNECT` | `c` | `DATABASE` |
| `TEMPORARY` | `T` | `DATABASE` |
| `EXECUTE` | `X` | `FUNCTION`, `PROCEDURE` |
| `USAGE` | `U` | `DOMAIN`, `FOREIGN DATA WRAPPER`, `FOREIGN SERVER`, `LANGUAGE`, `SCHEMA`, `SEQUENCE`, `TYPE` |
| `SET` | `s` | `PARAMETER` |
| `ALTER SYSTEM` | `A` | `PARAMETER` |
| `MAINTAIN` | `m` | `TABLE` |

ဇယား 5.2 က — အပေါ်မှာ ပြထားတဲ့ အတိုကောက်တွေကို သုံးပြီး — SQL object အမျိုးအစား တစ်ခုချင်းစီအတွက် ရရှိနိုင်တဲ့ privilege တွေကို အကျဉ်းချုပ် ဖော်ပြပါတယ်။ Object type တစ်ခုချင်းစီအတွက် privilege ဆက်တင်တွေကို စစ်ဆေးဖို့ သုံးနိုင်တဲ့ psql command တွေကိုလည်း ပြပါတယ်။

**ဇယား 5.2. Access Privileges အကျဉ်းချုပ်**

| Object Type | All Privileges | Default `PUBLIC` Privileges | psql Command |
| --- | --- | --- | --- |
| `DATABASE` | `CTc` | `Tc` | `\l` |
| `DOMAIN` | `U` | `U` | `\dD+` |
| `FUNCTION` or `PROCEDURE` | `X` | `X` | `\df+` |
| `FOREIGN DATA WRAPPER` | `U` | မရှိ | `\dew+` |
| `FOREIGN SERVER` | `U` | မရှိ | `\des+` |
| `LANGUAGE` | `U` | `U` | `\dL+` |
| `LARGE OBJECT` | `rw` | မရှိ | `\dl+` |
| `PARAMETER` | `sA` | မရှိ | `\dconfig+` |
| `SCHEMA` | `UC` | မရှိ | `\dn+` |
| `SEQUENCE` | `rwU` | မရှိ | `\dp` |
| `TABLE` (နှင့် table နဲ့ဆင်တူသော object များ) | `arwdDxtm` | မရှိ | `\dp` |
| Table column | `arwx` | မရှိ | `\dp` |
| `TABLESPACE` | `C` | မရှိ | `\db+` |
| `TYPE` | `U` | `U` | `\dT+` |

Object တစ်ခုအတွက် grant လုပ်ထားပြီးသား privilege တွေကို `aclitem` entry တွေရဲ့ list အဖြစ် ပြသပါတယ် — entry တစ်ခုချင်းစီမှာ ဒီပုံစံ ရှိပါတယ်:

```sql
grantee=privilege-abbreviation[*].../grantor
```

`aclitem` entry တစ်ခုချင်းစီက — grantor တစ်ဦးက grantee တစ်ဦးကို ပေးထားတဲ့ — ခွင့်ပြုချက် (permission) တွေ အားလုံးကို စာရင်းပြုပါတယ်။ တိကျတဲ့ privilege တွေကို ဇယား 5.1 ထဲက စာလုံးတစ်လုံး အတိုကောက်တွေနဲ့ ကိုယ်စားပြုပြီး — privilege ကို grant option ပါ grant လုပ်ထားတယ်ဆိုရင် `*` ကို နောက်ကပ် ထည့်ပါတယ်။ ဥပမာ — `calvin=r*w/hobbes` ဆိုတာ — role `calvin` မှာ — grant option (`*`) ပါတဲ့ `SELECT` (`r`) privilege ရော — grant option မပါတဲ့ (non-grantable) `UPDATE` (`w`) privilege ရော ရှိပြီး — နှစ်ခုလုံးကို role `hobbes` က grant လုပ်ထားတာ ဖြစ်တယ်လို့ ဖော်ပြပါတယ်။ `calvin` မှာ အဲဒီ object ပေါ်မှာပဲ — grantor တခြားတစ်ဦးက grant လုပ်ထားတဲ့ privilege တချို့လည်း ရှိရင် — အဲဒါတွေက သီးခြား `aclitem` entry တစ်ခုအနေနဲ့ ပေါ်ပါလိမ့်မယ်။ `aclitem` တစ်ခုထဲက grantee နေရာ (field) ဗလာဖြစ်နေရင် — `PUBLIC` ကို ကိုယ်စားပြုပါတယ်။

ဥပမာအနေနဲ့ — user `miriam` က table `mytable` ကို ဖန်တီးပြီး ဒီလို လုပ်တယ်ဆိုပါစို့:

```sql
GRANT SELECT ON mytable TO PUBLIC;
GRANT SELECT, UPDATE, INSERT ON mytable TO admin;
GRANT SELECT (col1), UPDATE (col1) ON mytable TO miriam_rw;
```

ဒါဆိုရင် psql ရဲ့ `\dp` command က ဒီလို ပြသပါလိမ့်မယ်:

```
=> \dp mytable
                                  Access privileges
 Schema |  Name   | Type  |   Access privileges    |   Column privileges   | Policies
--------+---------+-------+------------------------+-----------------------+----------
 public | mytable | table | miriam=arwdDxtm/miriam+| col1:                +|
        |         |       | =r/miriam             +|   miriam_rw=rw/miriam |
        |         |       | admin=arw/miriam       |                       |
(1 row)
```

Object တစ်ခုအတွက် “Access privileges” column ဗလာဖြစ်နေရင် — အဲဒီ object မှာ default privilege တွေ ရှိတယ်လို့ ဆိုလိုပါတယ် (ဆိုလိုတာက — သက်ဆိုင်ရာ system catalog ထဲက သူ့ရဲ့ privileges entry က null ဖြစ်နေတာပါ)။ Default privilege တွေမှာ owner အတွက် privilege အားလုံး အမြဲ ပါဝင်ပြီး — object type ပေါ် မူတည်ပြီး `PUBLIC` အတွက် privilege တချို့လည်း ပါဝင်နိုင်ပါတယ် — အပေါ်မှာ ရှင်းပြခဲ့သလိုပါ။ Object တစ်ခုပေါ်မှာ ပထမဆုံး `GRANT` ဒါမှမဟုတ် `REVOKE` လုပ်လိုက်တာနဲ့ — default privilege တွေကို စတင် အသက်သွင်းပြီး (ဥပမာ — `miriam=arwdDxt/miriam` လိုမျိုး ထုတ်ပေးပြီး) — တောင်းဆိုထားတဲ့ သတ်မှတ်ချက်အတိုင်း ပြုပြင်ပါတယ်။ အလားတူပဲ — “Column privileges” ထဲမှာ — default မဟုတ်တဲ့ privilege တွေ ရှိတဲ့ column တွေအတွက်သာ entry တွေ ပြသပါတယ်။ (မှတ်ချက် — ဒီနေရာမှာ “default privileges” ဆိုတာ — object ရဲ့ type အတွက် built-in default privilege တွေကို အမြဲ ဆိုလိုပါတယ်။ `ALTER DEFAULT PRIVILEGES` command ရဲ့ သက်ရောက်မှု ခံထားရတဲ့ object တစ်ခုကိုတော့ — `ALTER` ရဲ့ အကျိုးသက်ရောက်မှုတွေ ပါဝင်တဲ့ — ရှင်းလင်းတဲ့ privilege entry တစ်ခုနဲ့ အမြဲ ပြသပါလိမ့်မယ်။)

Owner ရဲ့ implicit (မွေးရာပါ) grant option တွေကို access privileges ပြသမှုထဲမှာ အမှတ်အသား မပြုတာ သတိပြုပါ။ `*` က — grant option တွေကို တစ်ယောက်ယောက်ကို အတိအကျ grant လုပ်ထားမှသာ ပေါ်ပါတယ်။

“Access privileges” column က — object ရဲ့ privileges entry က null မဟုတ်ပေမယ့် ဗလာဖြစ်နေရင် — `(none)` လို့ ပြပါတယ်။ ဒါက — privilege တွေ လုံးဝ မရှိဘူးလို့ ဆိုလိုတာပါ — object ရဲ့ owner အတွက်တောင် မရှိဘူးဆိုတဲ့ — ရှားပါးတဲ့ အခြေအနေတစ်ခုပါ။ (ဒီအခြေအနေမှာ owner မှာ implicit grant option တွေ ရှိနေသေးလို့ — ကိုယ့်ရဲ့ privilege တွေကို ပြန် grant လုပ်နိုင်ပါသေးတယ်; ဒါပေမယ့် လောလောဆယ်မှာတော့ သူ့မှာ ဘာ privilege မှ မရှိပါဘူး။)
