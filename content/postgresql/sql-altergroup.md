---
title: "ALTER GROUP (role နာမည် သို့မဟုတ် membership ပြောင်းလဲခြင်း)"
description: "User group (role) တစ်ခု၏ အဖွဲ့ဝင်စာရင်းနှင့် နာမည်ကို ပြောင်းလဲခြင်း — ADD USER/DROP USER/RENAME TO ပုံစံများ ပါဝင်ပြီး — groups (နှင့် users) များကို roles အယူအဆဖြင့် အစားထိုးလိုက်သောကြောင့် obsolete ဖြစ်သော်လည်း backwards compatibility အတွက် လက်ခံထားဆဲ command"
order: 285
source: "https://www.postgresql.org/docs/current/sql-altergroup.html"
status: translated
updated: 2026-09-04
---

## ALTER GROUP (role နာမည် သို့မဟုတ် membership ပြောင်းလဲခြင်း)

ALTER GROUP — role နာမည် သို့မဟုတ် membership ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER GROUP role_specification ADD USER user_name [, ... ]
ALTER GROUP role_specification DROP USER user_name [, ... ]

where role_specification can be:

    role_name
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER

ALTER GROUP group_name RENAME TO new_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER GROUP` က user group တစ်ခုရဲ့ attributes (ဂုဏ်ရည်များ) တွေကို ပြောင်းလဲပေးပါတယ်။ ဒါက obsolete (အသုံးမပြုတော့ပြီ) command တစ်ခု ဖြစ်ပေမယ့် — groups (users တွေပါ အပါအဝင်) တွေကို — ပိုပြီး ယေဘုယျကျတဲ့ roles အယူအဆ (concept) နဲ့ အစားထိုးလိုက်လို့ — နောက်ပြန် လိုက်ဖက်ညီမှု (backwards compatibility) အတွက် လက်ခံထားဆဲ ဖြစ်ပါတယ်။

ပထမ ပုံစံ နှစ်မျိုးက users တွေကို group တစ်ခုထဲကို ပေါင်းထည့်တာ ဒါမှမဟုတ် — group တစ်ခုကနေ ဖယ်ရှားတာ လုပ်ပါတယ်။ (ဒီရည်ရွယ်ချက်အတွက် — ဘယ် role မဆို “user” ဒါမှမဟုတ် “group” ရဲ့ အခန်းကဏ္ဍကို ဆောင်ရွက်နိုင်ပါတယ်။) ဒီ ပုံစံတွေက — “group” လို့ နာမည်ပေးထားတဲ့ role ထဲမှာ membership ကို grant (ပေးအပ်) လုပ်တာ ဒါမှမဟုတ် revoke (ပြန်ရုတ်သိမ်း) လုပ်တာနဲ့ — ထိရောက်စွာ ညီမျှပါတယ်။ ဒါကြောင့် ဒါကို လုပ်ဖို့ ဦးစားပေး နည်းလမ်းက [`GRANT`](/docs/postgresql/sql-grant) ဒါမှမဟုတ် [`REVOKE`](/docs/postgresql/sql-revoke) ကို သုံးတာ ဖြစ်ပါတယ်။ `GRANT` နဲ့ `REVOKE` တွေမှာ ဒီ command နဲ့ မရနိုင်တဲ့ — `ADMIN OPTION` ကို grant/revoke လုပ်နိုင်စွမ်း နဲ့ grantor (ပေးအပ်သူ) ကို သတ်မှတ်နိုင်စွမ်း စတဲ့ — ထပ်ဆောင်း options တွေ ရှိတယ်ဆိုတာ သတိပြုပါ။

တတိယ ပုံစံက group ရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။ ဒါက — [`ALTER ROLE`](/docs/postgresql/sql-alterrole) နဲ့ role ကို နာမည်ပြောင်းတာနဲ့ အတိအကျ ညီမျှပါတယ်။

## Parameters (parameter များ)

- **group_name** — ပြုပြင်မွမ်းမံရမယ့် group (role) ရဲ့ နာမည်။
- **user_name** — Group ထဲကို ပေါင်းထည့်ရမယ့် ဒါမှမဟုတ် group ကနေ ဖယ်ရှားရမယ့် users (roles) တွေ။ Users တွေက ကြိုတင် တည်ရှိနေရပါမယ်; ALTER GROUP က users တွေကို ဖန်တီးတာ ဒါမှမဟုတ် drop လုပ်တာ မလုပ်ပါဘူး။
- **new_name** — Group ရဲ့ နာမည် အသစ်။

## Examples (ဥပမာများ)

Users တွေကို group တစ်ခုထဲသို့ ပေါင်းထည့်ခြင်း:

```sql
ALTER GROUP staff ADD USER karl, john;
```

User တစ်ယောက်ကို group တစ်ခုကနေ ဖယ်ရှားခြင်း:

```sql
ALTER GROUP workers DROP USER beth;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER GROUP` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[GRANT](/docs/postgresql/sql-grant), [REVOKE](/docs/postgresql/sql-revoke), [ALTER ROLE](/docs/postgresql/sql-alterrole)
