---
title: "RESET (run-time parameter များကို default တန်ဖိုးသို့ ပြန်လည်သတ်မှတ်ခြင်း)"
description: "Run-time parameter တစ်ခုကို ၎င်း၏ default တန်ဖိုးဆီသို့ ပြန်လည်သတ်မှတ်ပေးသည့် command — SET configuration_parameter TO DEFAULT ၏ အခြားရေးသားနည်းတစ်မျိုး ဖြစ်ပြီး default တန်ဖိုး၏ ဖြစ်နိုင်သော အရင်းအမြစ်များနှင့် RESET ၏ transactional အပြုအမူကို ရှင်းပြထားသည်"
order: 184
source: "https://www.postgresql.org/docs/current/sql-reset.html"
status: translated
updated: 2026-09-04
---

## RESET (run-time parameter များကို default တန်ဖိုးသို့ ပြန်လည်သတ်မှတ်ခြင်း)

RESET — run-time parameter (runtime သတ်မှတ်ချက်) တစ်ခုရဲ့ တန်ဖိုးကို default တန်ဖိုးဆီ ပြန်လည်သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
RESET configuration_parameter
RESET ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`RESET` က run-time parameters (runtime သတ်မှတ်ချက်များ) တွေကို သူတို့ရဲ့ default တန်ဖိုးတွေဆီ ပြန်လည်သတ်မှတ်ပေးပါတယ်။ `RESET` က အောက်ပါအတွက် အခြားရေးသားနည်း (alternative spelling) တစ်ခု ဖြစ်ပါတယ်:

```sql
SET configuration_parameter TO DEFAULT
```

အသေးစိတ်တွေအတွက် [SET](/docs/postgresql/sql-set) ကို ကြည့်ပါ။

Default တန်ဖိုးဆိုတာ — လက်ရှိ session ထဲမှာ ဒီ parameter အတွက် `SET` တစ်ခါမှ ထုတ်ပြန်ခဲ့ဖူးခြင်း မရှိဘူးဆိုရင် — အဲဒီ parameter မှာ ရှိနေမယ့် တန်ဖိုးလို့ သတ်မှတ်ပါတယ်။ ဒီတန်ဖိုးရဲ့ တကယ့် အရင်းအမြစ်က — compile လုပ်ချိန်မှာ ထည့်သွင်းထားတဲ့ default (compiled-in default), configuration file, command-line options (command line ရွေးချယ်စရာများ), ဒါမှမဟုတ် per-database ဒါမှမဟုတ် per-user default settings တွေ ဖြစ်နိုင်ပါတယ်။ ဒါက “session စတင်ချိန်မှာ parameter မှာ ရှိခဲ့တဲ့ တန်ဖိုး” လို့ သတ်မှတ်တာနဲ့ — သိမ်မွေ့စွာ ကွဲပြားပါတယ်; အကြောင်းကတော့ — တန်ဖိုးက configuration file ကနေ လာတာဆိုရင် — လက်ရှိ configuration file က သတ်မှတ်ထားတဲ့ တန်ဖိုး ဘာပဲဖြစ်ဖြစ် အဲဒီဆီ ပြန်လည်သတ်မှတ်ခံရမှာ ဖြစ်လို့ပါ။ အသေးစိတ်တွေအတွက် [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) ကို ကြည့်ပါ။

`RESET` ရဲ့ transactional အပြုအမူက `SET` နဲ့ အတူတူပဲ ဖြစ်ပါတယ်: ၎င်းရဲ့ အကျိုးသက်ရောက်မှုတွေကို transaction rollback (transaction ပြန်လှည့်ဖျက်ခြင်း) က ပြန်ဖျက်သိမ်းပါလိမ့်မယ်။

## Parameters (parameter များ)

- **configuration_parameter** — သတ်မှတ်လို့ ရတဲ့ run-time parameter တစ်ခုရဲ့ နာမည်။ ရရှိနိုင်တဲ့ parameters တွေကို အခန်း 19 နဲ့ SET reference page (SET ကိုးကားစာမျက်နှာ) ပေါ်မှာ ဖော်ပြထားပါတယ်။
- **ALL** — သတ်မှတ်လို့ ရတဲ့ run-time parameters တွေ အားလုံးကို default တန်ဖိုးတွေဆီ ပြန်လည်သတ်မှတ်ပေးပါတယ်။

## Examples (ဥပမာများ)

`timezone` configuration variable ကို ၎င်းရဲ့ default တန်ဖိုးဆီ သတ်မှတ်လိုက်တာကို အောက်မှာ ပြထားပါတယ်:

```sql
RESET timezone;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`RESET` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[SET](/docs/postgresql/sql-set), [SHOW](/docs/postgresql/sql-show)
