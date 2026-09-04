---
title: "DROP EXTENSION (extension တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Database ထဲကနေ extension များကို ဖယ်ရှားခြင်း — extension ၏ member objects များနှင့် ၎င်းပေါ် မှီခိုနေသော object များကိုပါ drop လုပ်ပေးခြင်း — CASCADE/RESTRICT option များပါဝင်ပြီး — extension ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သော command"
order: 252
source: "https://www.postgresql.org/docs/current/sql-dropextension.html"
status: translated
updated: 2026-09-04
---

## DROP EXTENSION (extension တစ်ခုကို ဖယ်ရှားခြင်း)

DROP EXTENSION — extension တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP EXTENSION [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP EXTENSION` က database ထဲကနေ extensions တွေကို ဖယ်ရှားပေးပါတယ်။ Extension တစ်ခုကို drop လုပ်တာက — ၎င်းရဲ့ member objects တွေနဲ့ — တခြား အတိအကျ မှီခိုနေတဲ့ (explicitly dependent) routines တွေ (see [ALTER ROUTINE](/docs/postgresql/sql-alterroutine)၊ `DEPENDS ON EXTENSION extension_name` action) ကိုပါ drop လုပ်စေပါတယ်။

`DROP EXTENSION` ကို သုံးဖို့ — extension ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Extension မရှိရင် error တစ်ခု မပစ်ပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — Install လုပ်ထားတဲ့ extension တစ်ခုရဲ့ နာမည်။
- **CASCADE** — Extension ပေါ် မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ် မှီခိုနေတဲ့ objects တွေအားလုံးကိုလည်း အလှည့်ကျ drop လုပ်ပေးပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — ဒီ option က — ဒီ extensions တွေ၊ သူတို့ရဲ့ members တွေနဲ့ သူတို့ရဲ့ အတိအကျ မှီခိုနေတဲ့ routines တွေ မဟုတ်တဲ့ — တခြား objects တွေက ၎င်းတို့ပေါ် မှီခိုနေရင် — သတ်မှတ်ထားတဲ့ extensions တွေကို drop လုပ်တာကို တားဆီးပေးပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

လက်ရှိ database ကနေ `hstore` extension ကို ဖယ်ရှားဖို့:

```sql
DROP EXTENSION hstore;
```

`hstore` ရဲ့ objects တစ်ခုခုကို database ထဲမှာ အသုံးပြုနေရရင် — ဥပမာ tables တစ်ခုခုမှာ `hstore` type ရဲ့ columns တွေ ရှိနေရင် — ဒီ command က မအောင်မြင်ပါဘူး။ ဒီလို မှီခိုနေတဲ့ objects တွေကိုပါ အတင်းအကျပ် ဖယ်ရှားဖို့ `CASCADE` option ကို ထည့်သွင်းပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP EXTENSION` က PostgreSQL extension (PostgreSQL မှာပဲ ရှိတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html), [ALTER EXTENSION](/docs/postgresql/sql-alterextension)
