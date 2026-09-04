---
title: "SET ROLE (session အတွင်း role ပြောင်းလဲခြင်း)"
description: "လက်ရှိ session ၏ user identifier (current user) ကို ပြောင်းလဲခြင်း — SET [SESSION|LOCAL] ROLE role_name, SET ROLE NONE နှင့် RESET ROLE ပုံစံများ၊ role ရွေးချယ်ရန် SET option လိုအပ်ချက်၊ privileges များ ထပ်တိုး/ကန့်သတ်ရန် အသုံးပြုပုံနှင့် SET SESSION AUTHORIZATION နှင့် ကွာခြားချက်များ"
order: 170
source: "https://www.postgresql.org/docs/current/sql-set-role.html"
status: translated
updated: 2026-09-04
---

## SET ROLE (session အတွင်း role ပြောင်းလဲခြင်း)

SET ROLE — လက်ရှိ session ရဲ့ လက်ရှိ user identifier ကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SET [ SESSION | LOCAL ] ROLE role_name
SET [ SESSION | LOCAL ] ROLE NONE
RESET ROLE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

ဒီ command က လက်ရှိ SQL session ရဲ့ လက်ရှိ user identifier ကို `role_name` အဖြစ် သတ်မှတ်ပေးပါတယ်။ Role နာမည်ကို identifier အနေနဲ့ ဖြစ်စေ၊ string literal အနေနဲ့ ဖြစ်စေ ရေးနိုင်ပါတယ်။ `SET ROLE` ပြီးနောက်မှာ — SQL commands တွေအတွက် permissions စစ်ဆေးခြင်းကို — နာမည်ပေးထားတဲ့ role ကပဲ မူလက login ဝင်ခဲ့သူ ဖြစ်နေသလိုမျိုး — ဆောင်ရွက်ပါတယ်။ `SET ROLE` နဲ့ `SET SESSION AUTHORIZATION` တို့ကတော့ ချွင်းချက်တွေ ဖြစ်တယ်ဆိုတာ သတိပြုပါ; အဲဒီနှစ်ခုအတွက် permissions စစ်ဆေးခြင်းက — အသီးသီး — လက်ရှိ session user နဲ့ ကနဦး (initial) session user (ခေါ် *authenticated user*) တို့ကိုပဲ ဆက်လက် အသုံးပြုပါတယ်။

လက်ရှိ session user မှာ သတ်မှတ်ထားတဲ့ `role_name` အတွက် `SET` option ရှိရပါမယ် — တိုက်ရိုက် ဖြစ်စေ၊ `SET` option ပါဝင်တဲ့ memberships (အဖွဲ့ဝင်အဆင့်များ) တစ်ခုချင်းစီရဲ့ ကွင်းဆက်ကနေ သွယ်ဝိုက်၍ ဖြစ်စေ ရရှိထားရပါမယ်။ (Session user က superuser ဆိုရင်တော့ — ဘယ် role ကိုမဆို ရွေးချယ်နိုင်ပါတယ်။)

`SESSION` နဲ့ `LOCAL` modifiers တွေက ပုံမှန် [`SET`](https://www.postgresql.org/docs/current/sql-set.html) command မှာ ပြုမူသလိုပဲ ပြုမူပါတယ်။

`SET ROLE NONE` က — `session_user` က ပြန်ပေးတဲ့ လက်ရှိ session user identifier ဆီ — လက်ရှိ user identifier ကို သတ်မှတ်ပေးပါတယ်။ `RESET ROLE` ကတော့ — အဲဒီလို settings တွေ တည်ရှိနေခဲ့ရင် — [command-line options](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-OPTIONS), [`ALTER ROLE`](/docs/postgresql/sql-alterrole) ဒါမှမဟုတ် [`ALTER DATABASE`](/docs/postgresql/sql-alterdatabase) တို့က သတ်မှတ်ပေးထားတဲ့ connection-time setting ဆီ — လက်ရှိ user identifier ကို သတ်မှတ်ပေးပါတယ်။ ဒီလို settings တွေ မရှိရင်တော့ — `RESET ROLE` က လက်ရှိ user identifier ကို လက်ရှိ session user identifier ဆီ သတ်မှတ်ပေးပါတယ်။ ဒီပုံစံ (form) တွေကို user တိုင်း execute လုပ်နိုင်ပါတယ်။

## Notes (မှတ်စုများ)

ဒီ command ကို သုံးပြီး — ကိုယ်ရဲ့ privileges တွေကို ပေါင်းထည့်တာဖြစ်စေ၊ ကန့်သတ်တာဖြစ်စေ လုပ်နိုင်ပါတယ်။ Session user role ကို `WITH INHERIT TRUE` နဲ့ memberships တွေ ပေးအပ်ထားရင် — အဲဒီ role တစ်ခုချင်းစီရဲ့ privileges တွေ အားလုံးကို အလိုအလျောက် ရရှိပါတယ်။ ဒီကိစ္စမှာ — `SET ROLE` က — target role က တိုက်ရိုက် ပိုင်ဆိုင်တဲ့ ဒါမှမဟုတ် အမွေဆက်ခံ (inherit) တဲ့ privileges တွေကလွဲလို့ — ကျန်တဲ့ privileges တွေ အားလုံးကို ထိရောက်စွာ ဖယ်ရှားလိုက်ပါတယ်။ အခြားတစ်ဖက်မှာ — session user role ကို `WITH INHERIT FALSE` နဲ့ memberships တွေ ပေးအပ်ထားရင် — ပေးအပ်ထားတဲ့ roles တွေရဲ့ privileges တွေကို default အနေနဲ့ ဝင်ရောက် အသုံးပြုလို့ မရပါဘူး။ ဒါပေမယ့် — role ကို `WITH SET TRUE` နဲ့ ပေးအပ်ထားခဲ့ရင်တော့ — session user က `SET ROLE` ကို သုံးပြီး — session user ဆီ တိုက်ရိုက် သတ်မှတ်ပေးထားတဲ့ privileges တွေကို ဖယ်ရှားကာ — နာမည်ပေးထားတဲ့ role မှာ ရရှိနိုင်တဲ့ privileges တွေကို အစားထိုး ရယူနိုင်ပါတယ်။ Role ကို `WITH INHERIT FALSE, SET FALSE` နဲ့ ပေးအပ်ထားခဲ့ရင်တော့ — အဲဒီ role ရဲ့ privileges တွေကို `SET ROLE` သုံးသည်ဖြစ်စေ၊ မသုံးဘဲ ဖြစ်စေ — ကျင့်သုံးလို့ မရပါဘူး။

`SET ROLE` ရဲ့ အကျိုးသက်ရောက်မှုတွေက [`SET SESSION AUTHORIZATION`](/docs/postgresql/sql-set-session-authorization) နဲ့ နှိုင်းယှဉ်လို့ ရနိုင်ပေမယ့် — ပါဝင်တဲ့ privilege checks (ခွင့်ပြုချက် စစ်ဆေးမှုများ) တွေကတော့ အတော်ကို ကွဲပြားပါတယ်။ ဒါ့အပြင် — `SET SESSION AUTHORIZATION` က နောက်ပိုင်း `SET ROLE` commands တွေအတွက် ဘယ် roles တွေ ခွင့်ပြုမလဲဆိုတာကို ဆုံးဖြတ်ပေးပေမယ့် — `SET ROLE` နဲ့ role ပြောင်းလဲခြင်းကတော့ — နောက်ပိုင်း `SET ROLE` တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ roles အစုကို ပြောင်းလဲပေးတာ မဟုတ်ပါဘူး။

`SET ROLE` က — role ရဲ့ [`ALTER ROLE`](/docs/postgresql/sql-alterrole) settings တွေအရ သတ်မှတ်ထားတဲ့ session variables တွေကို လုပ်ဆောင်ပေးတာ မဟုတ်ပါဘူး; ဒါက login ဝင်ချိန်မှာပဲ ဖြစ်ပေါ်ပါတယ်။

`SET ROLE` ကို `SECURITY DEFINER` function တစ်ခုရဲ့ အတွင်းမှာ သုံးလို့ မရပါဘူး။

## Examples (ဥပမာများ)

`SET ROLE` က လက်ရှိ user identifier ကို ဘယ်လို ပြောင်းလဲပေးလဲဆိုတာကို အောက်မှာ ပြထားပါတယ်:

```sql
SELECT SESSION_USER, CURRENT_USER;

 session_user | current_user
--------------+--------------
 peter        | peter

SET ROLE 'paul';

SELECT SESSION_USER, CURRENT_USER;

 session_user | current_user
--------------+--------------
 peter        | paul
```

## Compatibility (လိုက်ဖက်ညီမှု)

PostgreSQL က identifier syntax (`"rolename"`) ကို ခွင့်ပြုပေမယ့် — SQL standard ကတော့ role နာမည်ကို string literal အနေနဲ့ ရေးသားဖို့ လိုအပ်ပါတယ်။ SQL က ဒီ command ကို transaction တစ်ခုရဲ့ အတွင်းမှာ ခွင့်မပြုပါဘူး; PostgreSQL ကတော့ — အကြောင်းပြချက် မရှိလို့ — ဒီကန့်သတ်ချက်ကို မပြုလုပ်ပါဘူး။ `SESSION` နဲ့ `LOCAL` modifiers တွေက PostgreSQL extension တစ်ခု ဖြစ်သလို — `RESET` syntax ကလည်း အလားတူပဲ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[SET SESSION AUTHORIZATION](/docs/postgresql/sql-set-session-authorization)
