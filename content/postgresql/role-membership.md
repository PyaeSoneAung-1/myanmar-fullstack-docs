---
title: "Role Membership (role အဖွဲ့ဝင် ဖြစ်မှု)"
description: "Group role (group အဖြစ် သုံးသော role) တစ်ခုအတွင်း user roles များကို membership ပေးခြင်း/ရုပ်သိမ်းခြင်း — GRANT/REVOKE ဖြင့် အဖွဲ့ဝင် စီမံနည်း၊ SET ROLE နှင့် INHERIT option တို့၏ လုပ်ဆောင်ပုံ၊ SQL standard နှင့် ကွာခြားချက်များ"
order: 174
source: "https://www.postgresql.org/docs/current/role-membership.html"
status: translated
updated: 2026-09-06
---

## 21.3. Role Membership (role အဖွဲ့ဝင် ဖြစ်မှု)

Privileges တွေကို စီမံခန့်ခွဲရတာ လွယ်ကူအောင် user တွေကို စုစည်းပြီး group လုပ်ထားတာက မကြာခဏ အဆင်ပြေပါတယ်: အဲဒီလို ဆိုရင် — privileges တွေကို group တစ်ခုလုံးအနေနဲ့ တစ်ပြိုင်နက် grant (ပေးအပ်) လုပ်လို့လည်း ရသလို — revoke (ပြန်ရုတ်သိမ်း) လုပ်လို့လည်း ရပါတယ်။ PostgreSQL မှာ ဒါကို — group ကို ကိုယ်စားပြုတဲ့ role တစ်ခု ဖန်တီးပြီး — အဲဒီ group role ထဲက *membership* (အဖွဲ့ဝင် ဖြစ်မှု) ကို — user role တစ်ခုချင်းစီဆီ grant လုပ်ခြင်းအားဖြင့် လုပ်ဆောင်ပါတယ်။

Group role တစ်ခု တည်ဆောက်ဖို့ — ပထမဆုံး role ကို ဖန်တီးပါ:

```sql
CREATE ROLE name;
```

ပုံမှန်အားဖြင့် group အဖြစ် သုံးနေတဲ့ role တစ်ခုမှာ `LOGIN` attribute ရှိလေ့ မရှိပါဘူး — ဒါပေမယ့် လိုချင်ရင်တော့ သတ်မှတ်လို့ ရပါတယ်။

Group role တည်ရှိပြီဆိုတာနဲ့ — [`GRANT`](/docs/postgresql/sql-grant) နဲ့ [`REVOKE`](/docs/postgresql/sql-revoke) commands တွေသုံးပြီး — အဖွဲ့ဝင်တွေကို ထည့်လို့လည်း ရသလို ဖယ်ရှားလို့လည်း ရပါတယ်:

```sql
GRANT group_role TO role1, ... ;
REVOKE group_role FROM role1, ... ;
```

တခြား group roles တွေဆီကိုလည်း membership grant လုပ်လို့ ရပါတယ် (group roles နဲ့ non-group roles ကြားမှာ တကယ်တော့ ခွဲခြားမှု မရှိလို့ပါ)။ Circular membership loops (စက်ဝိုင်းသဘော ပတ်နေတဲ့ အဖွဲ့ဝင် ကွင်းဆက်များ) တည်ဆောက်ဖို့ကိုတော့ database က ခွင့်မပြုပါဘူး။ ပြီးတော့ — role တစ်ခုထဲက membership ကို `PUBLIC` ဆီ grant လုပ်တာလည်း ခွင့်မပြုပါဘူး။

Group role တစ်ခုရဲ့ အဖွဲ့ဝင်တွေက အဲဒီ role ရဲ့ privileges တွေကို နည်းလမ်း နှစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်။ ပထမ — `SET` option နဲ့ membership ပေးအပ်ခံရတဲ့ member roles တွေက — [`SET ROLE`](/docs/postgresql/sql-set-role) ကို လုပ်ပြီး — ခဏတာ group role “ဖြစ်သွား” နိုင်ပါတယ်။ ဒီအခြေအနေမှာ — database session က မူလ login role ရဲ့ privileges တွေ မဟုတ်ဘဲ — group role ရဲ့ privileges တွေကို ဝင်ရောက် သုံးစွဲနိုင်ပြီး — ဖန်တီးလိုက်တဲ့ database objects တွေကိုလည်း login role ရဲ့ ပိုင်ဆိုင်မှု မဟုတ်ဘဲ — group role ရဲ့ ပိုင်ဆိုင်မှုအဖြစ် သတ်မှတ်ခံရပါတယ်။ ဒုတိယ — `INHERIT` option နဲ့ membership ပေးအပ်ခံရတဲ့ member roles တွေက — သူတို့ တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက်ပြီး အဖွဲ့ဝင် ဖြစ်နေတဲ့ roles တွေရဲ့ privileges တွေကို — အလိုအလျောက် သုံးစွဲခွင့် ရှိပါတယ် — ဒါပေမယ့် inherit option မပါတဲ့ memberships တွေမှာတော့ ဒီကွင်းဆက် (chain) က ရပ်သွားပါတယ်။ ဥပမာအနေနဲ့ — အောက်ပါအတိုင်း လုပ်ထားတယ် ဆိုပါစို့:

```sql
CREATE ROLE joe LOGIN;
CREATE ROLE admin;
CREATE ROLE wheel;
CREATE ROLE island;
GRANT admin TO joe WITH INHERIT TRUE;
GRANT wheel TO admin WITH INHERIT FALSE;
GRANT island TO joe WITH INHERIT TRUE, SET FALSE;
```

Role `joe` အဖြစ် connect လုပ်ပြီး ချက်ချင်းမှာ — database session တစ်ခုက `joe` ဆီ တိုက်ရိုက် ပေးအပ်ထားတဲ့ privileges တွေ အားလုံးကို ရရှိပြီး — `admin` နဲ့ `island` ဆီ ပေးအပ်ထားတဲ့ privileges တွေကိုပါ ရရှိပါတယ် — ဘာကြောင့်လဲဆိုတော့ `joe` က အဲဒီ privileges တွေကို “inherit” လုပ်လို့ပါ။ ဒါပေမယ့် — `wheel` ဆီ ပေးအပ်ထားတဲ့ privileges တွေကတော့ မရရှိနိုင်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ `joe` က `wheel` ရဲ့ သွယ်ဝိုက် အဖွဲ့ဝင် ဖြစ်ပေမယ့် — အဲဒီ membership က `WITH INHERIT FALSE` နဲ့ ပေးအပ်ထားတဲ့ `admin` ကနေတစ်ဆင့် ဖြစ်နေလို့ပါ။ နောက်တစ်ဆင့်အနေနဲ့:

```sql
SET ROLE admin;
```

session က `admin` ဆီ ပေးအပ်ထားတဲ့ privileges တွေကိုပဲ သုံးစွဲနိုင်ပြီး — `joe` ဒါမှမဟုတ် `island` ဆီ ပေးအပ်ထားတဲ့ privileges တွေကိုတော့ မသုံးစွဲနိုင်ပါဘူး။ နောက်တစ်ဆင့်:

```sql
SET ROLE wheel;
```

session က `wheel` ဆီ ပေးအပ်ထားတဲ့ privileges တွေကိုပဲ သုံးစွဲနိုင်ပြီး — `joe` ဒါမှမဟုတ် `admin` ဆီ ပေးအပ်ထားတဲ့ privileges တွေကိုတော့ မသုံးစွဲနိုင်ပါဘူး။ မူလ privilege အခြေအနေကို အောက်ပါ ဘယ်ဟာနဲ့မဆို ပြန်လည် ရယူနိုင်ပါတယ်:

```sql
SET ROLE joe;
SET ROLE NONE;
RESET ROLE;
```

> **မှတ်ချက်:** `SET ROLE` command က — မူလ login role က တိုက်ရိုက် ဒါမှမဟုတ် သွယ်ဝိုက်ပြီး အဖွဲ့ဝင် ဖြစ်နေတဲ့ role ဘယ်ဟာကိုမဆို — ရွေးချယ်ခွင့် အမြဲ ပေးပါတယ် — ဒါပေမယ့် membership grants တစ်ခုချင်းစီတိုင်းမှာ `SET TRUE` (ပုံမှန် default) ပါတဲ့ grant ကွင်းဆက် (chain) တစ်ခု ရှိနေမှသာ ဖြစ်ပါတယ်။ ဒါကြောင့် — အပေါ်က ဥပမာမှာ — `wheel` မဖြစ်ခင် `admin` အရင် ဖြစ်နေဖို့ မလိုအပ်ပါဘူး။ တစ်ဖက်မှာလည်း — `island` ဖြစ်ဖို့ကတော့ လုံးဝ မဖြစ်နိုင်ပါဘူး; `joe` က အဲဒီ privileges တွေကို inheritance ကနေတစ်ဆင့်ပဲ ဝင်ရောက် သုံးစွဲနိုင်လို့ပါ။

> **မှတ်ချက်:** SQL standard မှာ — users တွေနဲ့ roles တွေကြားမှာ ရှင်းလင်းတဲ့ ခွဲခြားမှု ရှိပြီး — users တွေက privileges တွေကို အလိုအလျောက် inherit မလုပ်ဘဲ — roles တွေကတော့ inherit လုပ်ပါတယ်။ ဒီအပြုအမူကို PostgreSQL မှာ — SQL roles တွေအနေနဲ့ သုံးမယ့် roles တွေကို `INHERIT` attribute ပေးပြီး — SQL users တွေအနေနဲ့ သုံးမယ့် roles တွေကိုတော့ `NOINHERIT` attribute ပေးခြင်းအားဖြင့် ရရှိနိုင်ပါတယ်။ ဒါပေမယ့် — pre-8.1 versions တွေမှာ users တွေက သူတို့ အဖွဲ့ဝင် ဖြစ်နေတဲ့ groups တွေဆီ ပေးအပ်ထားတဲ့ permissions တွေကို အမြဲတမ်း သုံးစွဲခွင့် ရှိခဲ့တာနဲ့ နောက်ပြန် လိုက်ဖက်ညီအောင် (backward compatibility) — PostgreSQL က roles တွေ အားလုံးကို `INHERIT` attribute ပေးတာကို ပုံမှန် default အဖြစ် သတ်မှတ်ထားပါတယ်။

`LOGIN`, `SUPERUSER`, `CREATEDB`, နဲ့ `CREATEROLE` ဆိုတဲ့ role attributes တွေကို — အထူး privileges တွေလို့ မှတ်ယူလို့ ရပေမယ့် — database objects တွေပေါ်က သာမန် privileges တွေ ဖြစ်သလိုမျိုး — ဘယ်တော့မှ inherit မလုပ်ပါဘူး။ ဒီ attributes တွေထဲက တစ်ခုကို အသုံးပြုဖို့ဆိုရင် — အဲဒီ attribute ရှိတဲ့ သီးခြား role တစ်ခုအဖြစ် — တကယ်တမ်း `SET ROLE` လုပ်ရပါမယ်။ အပေါ်က ဥပမာကို ဆက်ကြည့်ရင် — `admin` role ဆီ `CREATEDB` နဲ့ `CREATEROLE` တွေကို grant လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။ အဲဒီအခါ role `joe` အဖြစ် connect လုပ်ထားတဲ့ session တစ်ခုက — `SET ROLE admin` လုပ်ပြီးမှသာ — ဒီ privileges တွေကို ချက်ချင်း ရရှိမှာ မဟုတ်ပါဘူး။

Group role တစ်ခုကို ဖျက်ဆီးဖို့ (destroy) — [`DROP ROLE`](/docs/postgresql/sql-droprole) ကို သုံးပါ:

```sql
DROP ROLE name;
```

Group role ထဲက membership တွေ အားလုံးကို အလိုအလျောက် revoke လုပ်ပါတယ် (ဒါပေမယ့် member roles တွေကိုတော့ တခြား နည်းနဲ့ မထိခိုက်ပါဘူး)။
