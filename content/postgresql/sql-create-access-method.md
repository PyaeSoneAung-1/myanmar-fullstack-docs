---
title: "CREATE ACCESS METHOD (access method အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Access method အသစ်တစ်ခုကို သတ်မှတ်ပေးသည့် command — TABLE နှင့် INDEX အမျိုးအစား နှစ်မျိုး၊ handler function ၏ လိုအပ်ချက်များ၊ superuser များသာ သတ်မှတ်နိုင်ခြင်း၊ PostgreSQL extension အကြောင်း"
order: 304
source: "https://www.postgresql.org/docs/current/sql-create-access-method.html"
status: translated
updated: 2026-09-04
---

## CREATE ACCESS METHOD (access method အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE ACCESS METHOD — access method အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE ACCESS METHOD name
    TYPE access_method_type
    HANDLER handler_function
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE ACCESS METHOD` က access method အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

Access method ရဲ့ နာမည်က database အတွင်းမှာ တစ်ခုတည်းသော (unique) ဖြစ်ရပါမယ်။

Access methods အသစ်တွေကို superusers တွေပဲ သတ်မှတ်လို့ ရပါတယ်။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် access method ရဲ့ နာမည်ပါ။
- **access_method_type** — ဒီ clause က သတ်မှတ်ရမယ့် access method ရဲ့ အမျိုးအစားကို သတ်မှတ်ပေးပါတယ်။ လောလောဆယ်မှာ TABLE နဲ့ INDEX တို့ကိုပဲ ထောက်ပံ့ထားပါတယ်။
- **handler_function** — handler_function ဆိုတာ — access method ကို ကိုယ်စားပြုတဲ့ — အရင်က register လုပ်ထားပြီးသား function တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်သည်) ပါ။ Handler function ကို `internal` type ရဲ့ argument တစ်ခုတည်း ယူမယ်လို့ declare လုပ်ရမှာ ဖြစ်ပြီး — ၎င်းရဲ့ return type က access method ရဲ့ အမျိုးအစားပေါ် မူတည်ပါတယ်; TABLE access methods တွေအတွက် — `table_am_handler` ဖြစ်ရမှာ ဖြစ်ပြီး — INDEX access methods တွေအတွက် — `index_am_handler` ဖြစ်ရပါတယ်။ Handler function က implement လုပ်ရမယ့် C-level API က access method ရဲ့ အမျိုးအစားပေါ် မူတည်ပြီး ကွဲပြားပါတယ်။ Table access method API ကို Chapter 62 မှာ ဖော်ပြထားပြီး — index access method API ကို Chapter 63 မှာ ဖော်ပြထားပါတယ်။

## Examples (ဥပမာများ)

`heptree_handler` ဆိုတဲ့ handler function ပါတဲ့ — `heptree` index access method တစ်ခုကို ဖန်တီးဖို့:

```sql
CREATE ACCESS METHOD heptree TYPE INDEX HANDLER heptree_handler;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE ACCESS METHOD` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DROP ACCESS METHOD](/docs/postgresql/sql-drop-access-method), [CREATE OPERATOR CLASS](https://www.postgresql.org/docs/current/sql-createopclass.html), [CREATE OPERATOR FAMILY](/docs/postgresql/sql-createopfamily)
