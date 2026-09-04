---
title: "SET SESSION AUTHORIZATION (session ရဲ့ user/role ကို သတ်မှတ်ခြင်း)"
description: "လက်ရှိ SQL session ရဲ့ session user identifier နဲ့ current user identifier ကို သတ်မှတ်ပေးတဲ့ command — SESSION/LOCAL modifiers များ၊ DEFAULT/RESET ပုံစံများ၊ ပြောင်းလဲနိုင်ရန် superuser privilege လိုအပ်ချက်တို့အကြောင်း"
order: 171
source: "https://www.postgresql.org/docs/current/sql-set-session-authorization.html"
status: translated
updated: 2026-09-04
---

## SET SESSION AUTHORIZATION (session ရဲ့ user/role ကို သတ်မှတ်ခြင်း)

SET SESSION AUTHORIZATION — လက်ရှိ session ရဲ့ session user identifier နဲ့ current user identifier ကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SET [ SESSION | LOCAL ] SESSION AUTHORIZATION user_name
SET [ SESSION | LOCAL ] SESSION AUTHORIZATION DEFAULT
RESET SESSION AUTHORIZATION
```

## Description (အသေးစိတ် ဖော်ပြချက်)

ဒီ command က လက်ရှိ SQL session ရဲ့ session user identifier နဲ့ current user identifier ကို `user_name` အဖြစ် သတ်မှတ်ပေးပါတယ်။ User name ကို identifier တစ်ခုအနေနဲ့ ဖြစ်စေ — string literal တစ်ခုအနေနဲ့ ဖြစ်စေ — ရေးနိုင်ပါတယ်။ ဒီ command ကို သုံးပြီး ဥပမာ — privilege မရှိတဲ့ (unprivileged) user တစ်ယောက်အနေနဲ့ ခေတ္တ ပြောင်းလဲ နေပြီး — နောက်ပိုင်းမှာ superuser အနေနဲ့ ပြန်ပြောင်းဖို့ ဖြစ်နိုင်ပါတယ်။

Session user identifier ကို ကနဦးမှာ client က ပေးတဲ့ (authentication လုပ်ထားနိုင်တဲ့) user name အဖြစ် သတ်မှတ်ပါတယ်။ Current user identifier က ပုံမှန်အားဖြင့် session user identifier နဲ့ တူညီပေမယ့် — `SECURITY DEFINER` functions တွေနဲ့ အလားတူ ယန္တရားတွေရဲ့ ကိစ္စတွေမှာ ခေတ္တ ပြောင်းလဲနိုင်ပါတယ်; [`SET ROLE`](/docs/postgresql/sql-set-role) ကလည်း ဒါကို ပြောင်းလဲနိုင်ပါတယ်။ Current user identifier က permission စစ်ဆေးမှုတွေအတွက် သက်ဆိုင်ပါတယ်။

Session user identifier ကို — ကနဦး session user (*authenticated user* — authentication ခံထားရတဲ့ user) မှာ superuser privilege ရှိမှသာ — ပြောင်းလဲနိုင်ပါတယ်။ ဒါမဟုတ်ရင် — authenticated user name ကို သတ်မှတ်ပေးထားမှသာ — command ကို လက်ခံပါတယ်။

`SESSION` နဲ့ `LOCAL` modifiers တွေက ပုံမှန် [`SET`](https://www.postgresql.org/docs/current/sql-set.html) command မှာ လုပ်ဆောင်သလိုမျိုးပဲ အလုပ်လုပ်ပါတယ်။

`DEFAULT` နဲ့ `RESET` ပုံစံတွေက session နဲ့ current user identifiers တွေကို မူလ authentication လုပ်ထားတဲ့ user name အဖြစ် ပြန်လည် သတ်မှတ်ပေးပါတယ်။ ဒီ ပုံစံတွေကို user တိုင်း execute လုပ်နိုင်ပါတယ်။

## Notes (မှတ်စုများ)

`SET SESSION AUTHORIZATION` ကို `SECURITY DEFINER` function တစ်ခုအတွင်းမှာ သုံးလို့ မရပါဘူး။

## Examples (ဥပမာများ)

```sql
SELECT SESSION_USER, CURRENT_USER;

 session_user | current_user
--------------+--------------
 peter        | peter

SET SESSION AUTHORIZATION 'paul';

SELECT SESSION_USER, CURRENT_USER;

 session_user | current_user
--------------+--------------
 paul         | paul
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က literal `user_name` နေရာမှာ တခြား expressions တချို့ ပေါ်လာခွင့် ပြုပေမယ့် — ဒီ options တွေက လက်တွေ့မှာတော့ အရေးမကြီးပါဘူး။ PostgreSQL က identifier syntax (`"username"`) ကို ခွင့်ပြုပါတယ် — SQL ကတော့ မခွင့်ပြုပါဘူး။ SQL က transaction တစ်ခုအတွင်းမှာ ဒီ command ကို ခွင့်မပြုပါဘူး; PostgreSQL ကတော့ — အကြောင်းပြချက် မရှိလို့ — ဒီ ကန့်သတ်ချက်ကို မပြုလုပ်ပါဘူး။ `SESSION` နဲ့ `LOCAL` modifiers တွေက PostgreSQL extension တစ်ခု ဖြစ်သလို — `RESET` syntax ကလည်း ဒီအတိုင်းပါပဲ။

ဒီ command ကို execute လုပ်ဖို့ လိုအပ်တဲ့ privileges တွေကိုတော့ standard က implementation-defined (အကောင်အထည်ဖော်မှု တစ်ခုချင်းစီအလိုက် သတ်မှတ်) အဖြစ် ချန်ထားပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[SET ROLE](/docs/postgresql/sql-set-role)
