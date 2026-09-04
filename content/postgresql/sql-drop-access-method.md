---
title: "DROP ACCESS METHOD (access method တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား access method တစ်ခုကို ဖယ်ရှားပေးသည့် command — superuser များသာ ဖယ်ရှားနိုင်ခြင်း၊ IF EXISTS / CASCADE / RESTRICT option များ၊ PostgreSQL extension အကြောင်း"
order: 305
source: "https://www.postgresql.org/docs/current/sql-drop-access-method.html"
status: translated
updated: 2026-09-04
---

## DROP ACCESS METHOD (access method တစ်ခုကို ဖယ်ရှားခြင်း)

DROP ACCESS METHOD — access method တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP ACCESS METHOD [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP ACCESS METHOD` က ရှိပြီးသား access method တစ်ခုကို ဖယ်ရှားပေးပါတယ်။ Access methods တွေကို superusers တွေပဲ ဖယ်ရှားလို့ ရပါတယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Access method မရှိရင် error တစ်ခု မထုတ်ဘဲ နေပါ။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား access method တစ်ခုရဲ့ နာမည်ပါ။
- **CASCADE** — Access method ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ operator classes တွေ၊ operator families တွေနဲ့ indexes တွေ) ကို အလိုအလျောက် ဖယ်ရှားပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေကိုပါ အလှည့်ကျ အားလုံး ဖယ်ရှားပါတယ် (Section 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Access method ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — ၎င်းကို ဖယ်ရှားဖို့ ငြင်းဆန်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`heptree` access method ကို ဖယ်ရှားဖို့:

```sql
DROP ACCESS METHOD heptree;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP ACCESS METHOD` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE ACCESS METHOD](/docs/postgresql/sql-create-access-method)
