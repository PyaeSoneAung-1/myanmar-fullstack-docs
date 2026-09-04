---
title: "DROP CAST (cast တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ယခင် သတ်မှတ်ထားသော cast တစ်ခုကို ဖယ်ရှားခြင်း — IF EXISTS option ၊ source_type နှင့် target_type parameter များ ၊ CASCADE/RESTRICT ၏ အကျိုးသက်ရောက်မှု မရှိခြင်း အကြောင်း — SQL standard နှင့် ကိုက်ညီသော command"
order: 283
source: "https://www.postgresql.org/docs/current/sql-dropcast.html"
status: translated
updated: 2026-09-04
---

## DROP CAST (cast တစ်ခုကို ဖယ်ရှားခြင်း)

DROP CAST — cast တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP CAST [ IF EXISTS ] (source_type AS target_type) [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP CAST` က ယခင် သတ်မှတ်ခဲ့ဖူးတဲ့ cast တစ်ခုကို ဖယ်ရှားပေးပါတယ်။

Cast တစ်ခုကို drop လုပ်နိုင်ဖို့ဆိုရင် — သင်က source ဒါမှမဟုတ် target data type ကို ပိုင်ဆိုင်ထားရပါမယ်။ ဒါတွေက cast တစ်ခု ဖန်တီးဖို့ လိုအပ်တဲ့ privileges တွေနဲ့ အတူတူပါပဲ။

## Parameters (parameter များ)

- **IF EXISTS** — Cast မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **source_type** — Cast ရဲ့ source data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **target_type** — Cast ရဲ့ target data type ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **CASCADE** / **RESTRICT** — Casts တွေပေါ်မှာ မှီခိုမှု (dependencies) တွေ မရှိတာမို့ — ဒီ key words နှစ်ခုလုံးက ဘယ် အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Examples (ဥပမာများ)

`text` type ကနေ `int` type ဆီကို ပြောင်းတဲ့ cast ကို ဖယ်ရှားရန်:

```sql
DROP CAST (text AS int);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP CAST` command က SQL standard နဲ့ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE CAST](https://www.postgresql.org/docs/current/sql-createcast.html)
