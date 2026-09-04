---
title: "DROP TEXT SEARCH TEMPLATE (text search template တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Text search template တစ်ခုကို ဖယ်ရှားခြင်း — IF EXISTS option ဖြင့် template မရှိပါက error မထုတ်ခြင်း ၊ CASCADE/RESTRICT ဖြင့် မှီခို objects များ ကိုင်တွယ်ခြင်း — superuser သာ အသုံးပြုနိုင်သော command"
order: 268
source: "https://www.postgresql.org/docs/current/sql-droptstemplate.html"
status: translated
updated: 2026-09-04
---

## DROP TEXT SEARCH TEMPLATE (text search template တစ်ခုကို ဖယ်ရှားခြင်း)

DROP TEXT SEARCH TEMPLATE — text search template တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TEXT SEARCH TEMPLATE [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TEXT SEARCH TEMPLATE` က ရှိပြီးသား text search template တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို သုံးဖို့ — superuser ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Text search template မရှိရင် error တစ်ခု မပစ်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား text search template တစ်ခုရဲ့ နာမည် (လိုအပ်ရင် schema-qualified)။
- **CASCADE** — Text search template ပေါ် မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ် မှီခိုနေတဲ့ objects တွေအားလုံးကိုလည်း အလှည့်ကျ drop လုပ်ပေးပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Objects တစ်ခုခုက text search template ပေါ် မှီခိုနေရင် — template ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

Text search template `thesaurus` ကို ဖယ်ရှားခြင်း:

```sql
DROP TEXT SEARCH TEMPLATE thesaurus;
```

Template ကို သုံးနေတဲ့ text search dictionaries တွေ ရှိနေသေးရင် — ဒီ command က အောင်မြင်မှာ မဟုတ်ပါဘူး။ အဲဒီလို dictionaries တွေကို template နဲ့အတူ drop လုပ်ဖို့ `CASCADE` ကို ထည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP TEXT SEARCH TEMPLATE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TEXT SEARCH TEMPLATE](/docs/postgresql/sql-altertstemplate), [CREATE TEXT SEARCH TEMPLATE](/docs/postgresql/sql-createtstemplate)
