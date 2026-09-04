---
title: "REASSIGN OWNED (role ပိုင်ဆိုင်သည့် objects များကို အခြား role သို့ လွှဲပြောင်းခြင်း)"
description: "Role တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေ ပိုင်ဆိုင်တဲ့ database objects တွေရဲ့ ပိုင်ဆိုင်မှု (ownership) ကို အခြား role တစ်ခုဆီ ပြောင်းလဲပေးတဲ့ command — objects တွေကို ဖျက်စရာ မလိုဘဲ role အသစ်တစ်ခုဆီ လွှဲပြောင်းလိုတဲ့အခါ သုံးပြီး source role(s) နှင့် target role နှစ်ခုလုံးပေါ်တွင် membership လိုအပ်သည်"
order: 175
source: "https://www.postgresql.org/docs/current/sql-reassign-owned.html"
status: translated
updated: 2026-09-04
---

## REASSIGN OWNED (role ပိုင်ဆိုင်သည့် objects များကို အခြား role သို့ လွှဲပြောင်းခြင်း)

REASSIGN OWNED — database role တစ်ခုက ပိုင်ဆိုင်တဲ့ database objects တွေရဲ့ ပိုင်ဆိုင်မှုကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
REASSIGN OWNED BY { old_role | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...]
               TO { new_role | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`REASSIGN OWNED` က — `old_roles` တွေထဲက တစ်ခုခုက ပိုင်ဆိုင်တဲ့ database objects တွေရဲ့ ပိုင်ဆိုင်မှုကို `new_role` ဆီ ပြောင်းလဲပေးဖို့ system ကို ညွှန်ကြားပါတယ်။

## Parameters (parameter များ)

- **old_role** — role တစ်ခုရဲ့ နာမည်။ ဒီ role က ပိုင်ဆိုင်တဲ့ — current database အတွင်းက objects တွေ အားလုံးရဲ့ ရော — shared objects (databases, tablespaces) တွေ အားလုံးရဲ့ ပါ — ပိုင်ဆိုင်မှုကို new_role ဆီ လွှဲပြောင်းပေးပါလိမ့်မယ်။
- **new_role** — သက်ရောက်မှု ခံရတဲ့ objects တွေရဲ့ owner အသစ် ဖြစ်လာမယ့် role ရဲ့ နာမည်။

## Notes (မှတ်စုများ)

`REASSIGN OWNED` ကို — role တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေကို ဖယ်ရှားဖို့ ပြင်ဆင်ရာမှာ မကြာခဏ သုံးပါတယ်။ `REASSIGN OWNED` က တခြား databases တွေအတွင်းက objects တွေကို သက်ရောက်မှု မရှိတာမို့ — ဖယ်ရှားရမယ့် role တစ်ခုက ပိုင်ဆိုင်တဲ့ objects တွေ ပါဝင်နေတဲ့ database တစ်ခုချင်းစီမှာ ဒီ command ကို execute လုပ်ဖို့ ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။

`REASSIGN OWNED` က source role(s) တွေပေါ်မှာရော target role ပေါ်မှာပါ membership လိုအပ်ပါတယ်။

[`DROP OWNED`](/docs/postgresql/sql-drop-owned) command က — role တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေ ပိုင်ဆိုင်တဲ့ database objects တွေ အားလုံးကို ရိုးရိုးရှင်းရှင်း drop လုပ်ပစ်တဲ့ alternative (အခြားရွေးချယ်စရာ) တစ်ခု ဖြစ်ပါတယ်။

`REASSIGN OWNED` command က — `old_roles` တွေဆီ — သူတို့ မပိုင်ဆိုင်တဲ့ objects တွေပေါ်မှာ grant လုပ်ထားတဲ့ privileges တွေကို သက်ရောက်မှု မရှိပါဘူး။ အလားတူပဲ — `ALTER DEFAULT PRIVILEGES` နဲ့ ဖန်တီးထားတဲ့ default privileges တွေကိုလည်း သက်ရောက်မှု မရှိပါဘူး။ အဲဒီလို privileges တွေကို revoke လုပ်ဖို့ `DROP OWNED` ကို သုံးပါ။

နောက်ထပ် ဆွေးနွေးချက်တွေအတွက် [အပိုင်း 21.4](https://www.postgresql.org/docs/current/role-removal.html) ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`REASSIGN OWNED` command က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DROP OWNED](/docs/postgresql/sql-drop-owned), [DROP ROLE](/docs/postgresql/sql-droprole), [ALTER DATABASE](/docs/postgresql/sql-alterdatabase)
