---
title: "DROP OWNED (role ပိုင်ဆိုင်သည့် database objects များ ဖယ်ရှားခြင်း)"
description: "Role တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေ ပိုင်ဆိုင်တဲ့ current database အတွင်းက database objects တွေ အားလုံးကို ဖယ်ရှားပေးပြီး — အဲဒီ roles တွေဆီ grant လုပ်ထားတဲ့ privileges တွေကိုပါ revoke လုပ်ပေးတဲ့ command — CASCADE/RESTRICT options များ ပါဝင်ပြီး role တစ်ခုကို မဖျက်ခင် ကြိုပြီး သုံးလေ့ ရှိသည်"
order: 174
source: "https://www.postgresql.org/docs/current/sql-drop-owned.html"
status: translated
updated: 2026-09-04
---

## DROP OWNED (role ပိုင်ဆိုင်သည့် database objects များ ဖယ်ရှားခြင်း)

DROP OWNED — database role တစ်ခုက ပိုင်ဆိုင်တဲ့ database objects တွေကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP OWNED BY { name | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP OWNED` က — သတ်မှတ်ထားတဲ့ roles တွေထဲက တစ်ခုခုက ပိုင်ဆိုင်တဲ့ — current database အတွင်းက objects တွေ အားလုံးကို ဖယ်ရှားပေးပါတယ်။ ပေးထားတဲ့ roles တွေဆီ — current database ထဲက objects တွေပေါ်မှာ ဒါမှမဟုတ် shared objects (databases, tablespaces, configuration parameters) တွေပေါ်မှာ — grant လုပ်ထားခဲ့တဲ့ privileges တွေကိုလည်း revoke လုပ်ပါလိမ့်မယ်။

## Parameters (parameter များ)

- **name** — objects တွေကို drop လုပ်ပြီး — privileges တွေကို revoke လုပ်မယ့် role တစ်ခုရဲ့ နာမည်။
- **CASCADE** — သက်ရောက်မှု ခံရတဲ့ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — သက်ရောက်မှု ခံရတဲ့ objects တွေထဲက တစ်ခုခုပေါ်မှာ တခြား database objects တွေက မှီခိုနေရင် — role တစ်ခု ပိုင်ဆိုင်တဲ့ objects တွေကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`DROP OWNED` ကို — role တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေကို ဖယ်ရှားဖို့ ပြင်ဆင်ရာမှာ မကြာခဏ သုံးပါတယ်။ `DROP OWNED` က current database အတွင်းက objects တွေကိုပဲ သက်ရောက်တာမို့ — ဖယ်ရှားရမယ့် role တစ်ခုက ပိုင်ဆိုင်တဲ့ objects တွေ ပါဝင်နေတဲ့ database တစ်ခုချင်းစီမှာ ဒီ command ကို execute လုပ်ဖို့ ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။

`CASCADE` option ကို သုံးတာက — command ကို တခြား users တွေ ပိုင်ဆိုင်တဲ့ objects တွေအထိ ဆင့်ပွား (recurse) သက်ရောက်စေနိုင်ပါတယ်။

[`REASSIGN OWNED`](/docs/postgresql/sql-reassign-owned) command က — role တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ roles တွေ ပိုင်ဆိုင်တဲ့ database objects တွေ အားလုံးရဲ့ ပိုင်ဆိုင်မှုကို တခြား role တစ်ခုဆီ လွှဲပြောင်းပေးတဲ့ alternative (အခြားရွေးချယ်စရာ) တစ်ခု ဖြစ်ပါတယ်။ ဒါပေမယ့် — `REASSIGN OWNED` က တခြား objects တွေရဲ့ privileges တွေကိုတော့ ကိုင်တွယ်မပေးပါဘူး။

Role(s) တွေ ပိုင်ဆိုင်တဲ့ databases နဲ့ tablespaces တွေကိုတော့ ဖယ်ရှားမှာ မဟုတ်ပါဘူး။

နောက်ထပ် ဆွေးနွေးချက်တွေအတွက် [အပိုင်း 21.4](https://www.postgresql.org/docs/current/role-removal.html) ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP OWNED` command က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[REASSIGN OWNED](/docs/postgresql/sql-reassign-owned), [DROP ROLE](/docs/postgresql/sql-droprole)
