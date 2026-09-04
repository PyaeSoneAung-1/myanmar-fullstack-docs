---
title: "DROP ROLE (role တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Role တစ်ခု သို့မဟုတ် အများအပြားကို ဖယ်ရှားပေးတဲ့ command — DROP ROLE ၏ syntax နှင့် parameters (IF EXISTS)၊ လိုအပ်သော privileges နှင့် role မဖျက်မီ ၎င်းပိုင်ဆိုင်သော objects/privileges များ ကိုင်တွယ်ရန် အချက်များ"
order: 166
source: "https://www.postgresql.org/docs/current/sql-droprole.html"
status: translated
updated: 2026-09-04
---

## DROP ROLE (role တစ်ခုကို ဖယ်ရှားခြင်း)

DROP ROLE — database role တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP ROLE [ IF EXISTS ] name [, ...]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP ROLE` က သတ်မှတ်ထားတဲ့ role(များ) ကို ဖယ်ရှားပေးပါတယ်။ Superuser role တစ်ခုကို drop လုပ်ဖို့ — သင်ကိုယ်တိုင် superuser ဖြစ်ရပါမယ်; superuser မဟုတ်တဲ့ roles တွေကို drop လုပ်ဖို့တော့ — သင်မှာ `CREATEROLE` privilege ရှိရပြီး — အဲဒီ role ပေါ်မှာ `ADMIN OPTION` ပေးအပ်ခံထားရပါမယ်။

Cluster ထဲက database တစ်ခုခုမှာ role တစ်ခုကို ရည်ညွှန်းနေတုန်း (still referenced) ဆိုရင် — အဲဒီ role ကို ဖယ်ရှားလို့ မရပါဘူး; ဒီလို ဖြစ်ရင် error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။ Role ကို drop မလုပ်ခင် — ၎င်း ပိုင်ဆိုင်တဲ့ objects တွေ အားလုံးကို drop လုပ်ရပါမယ် (ဒါမှမဟုတ် သူတို့ရဲ့ ownership ကို ပြန်သတ်မှတ် (reassign) ပေးရပါမယ်) ပြီးတော့ — role က တခြား objects တွေပေါ်မှာ ရရှိထားတဲ့ privileges တွေကိုလည်း revoke (ပြန်ရုတ်သိမ်း) လုပ်ရပါမယ်။ ဒီရည်ရွယ်ချက်အတွက် [`REASSIGN OWNED`](/docs/postgresql/sql-reassign-owned) နဲ့ [`DROP OWNED`](/docs/postgresql/sql-drop-owned) commands တွေက အသုံးဝင်နိုင်ပါတယ်; နောက်ထပ် ဆွေးနွေးချက်အတွက် [အပိုင်း 21.4](https://www.postgresql.org/docs/current/role-removal.html) ကို ကြည့်ပါ။

ဒါပေမယ့် — role ပါဝင်နေတဲ့ role memberships တွေကို ဖယ်ရှားဖို့တော့ မလိုအပ်ပါဘူး; `DROP ROLE` က target role ရဲ့ တခြား roles တွေထဲက memberships တွေကိုရော — တခြား roles တွေရဲ့ target role ထဲက memberships တွေကိုပါ — အလိုအလျောက် revoke လုပ်ပေးပါတယ်။ တခြား roles တွေကတော့ drop မလုပ်ခံရသလို — တခြားနည်းနဲ့မှ သက်ရောက်မှု မရှိပါဘူး။

## Parameters (parameter များ)

- **IF EXISTS** — Role မရှိရင် error တစ်ခု မထုတ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် role ရဲ့ နာမည်။

## Notes (မှတ်စုများ)

PostgreSQL မှာ [dropuser](https://www.postgresql.org/docs/current/app-dropuser.html) ဆိုတဲ့ program တစ်ခု ပါဝင်ပြီး — ၎င်းက ဒီ command နဲ့ လုပ်ဆောင်ချက် အတူတူပဲ (တကယ်တော့ ဒီ command ကို ခေါ်ပါတယ်) ဖြစ်ပေမယ့် — command shell ကနေ run လို့ ရပါတယ်။

## Examples (ဥပမာများ)

Role တစ်ခုကို drop လုပ်ဖို့:

```sql
DROP ROLE jonathan;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က `DROP ROLE` ကို သတ်မှတ်ထားပေမယ့် — standard က တစ်ကြိမ်မှာ role တစ်ခုတည်းကိုပဲ drop လုပ်ခွင့် ပြုပြီး — PostgreSQL သုံးတာနဲ့ မတူညီတဲ့ privilege လိုအပ်ချက်တွေကို သတ်မှတ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE ROLE](/docs/postgresql/sql-createrole), [ALTER ROLE](/docs/postgresql/sql-alterrole), [SET ROLE](/docs/postgresql/sql-set-role)
