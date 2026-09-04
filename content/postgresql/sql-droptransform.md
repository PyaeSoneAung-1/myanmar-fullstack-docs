---
title: "DROP TRANSFORM (transform တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "အရင်က သတ်မှတ်ထားသော transform တစ်ခုကို ဖယ်ရှားပေးသည့် command — type နှင့် language ပိုင်ဆိုင်ရန် လိုအပ်ခြင်း၊ IF EXISTS / CASCADE / RESTRICT option များအကြောင်း"
order: 307
source: "https://www.postgresql.org/docs/current/sql-droptransform.html"
status: translated
updated: 2026-09-04
---

## DROP TRANSFORM (transform တစ်ခုကို ဖယ်ရှားခြင်း)

DROP TRANSFORM — transform တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TRANSFORM [ IF EXISTS ] FOR type_name LANGUAGE lang_name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TRANSFORM` က အရင်က သတ်မှတ်ထားသော transform တစ်ခုကို ဖယ်ရှားပေးပါတယ်။

Transform တစ်ခုကို ဖယ်ရှားနိုင်ဖို့ — သင်ဟာ type နဲ့ language ကို ပိုင်ဆိုင်ရပါမယ်။ ဒါတွေက transform တစ်ခုကို ဖန်တီးဖို့ လိုအပ်တဲ့ privileges တွေနဲ့ အတူတူပါပဲ။

## Parameters (parameter များ)

- **IF EXISTS** — Transform မရှိရင် error တစ်ခု မထုတ်ဘဲ နေပါ။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **type_name** — Transform ရဲ့ data type နာမည်ပါ။
- **lang_name** — Transform ရဲ့ language နာမည်ပါ။
- **CASCADE** — Transform ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် ဖယ်ရှားပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေကိုပါ အလှည့်ကျ အားလုံး ဖယ်ရှားပါတယ် (Section 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Transform ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — ၎င်းကို ဖယ်ရှားဖို့ ငြင်းဆန်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`hstore` type နဲ့ `plpython3u` language အတွက် transform ကို ဖယ်ရှားဖို့:

```sql
DROP TRANSFORM FOR hstore LANGUAGE plpython3u;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ ပုံစံဖြစ်တဲ့ `DROP TRANSFORM` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် [CREATE TRANSFORM](/docs/postgresql/sql-createtransform) ကို ကြည့်ပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TRANSFORM](/docs/postgresql/sql-createtransform)
