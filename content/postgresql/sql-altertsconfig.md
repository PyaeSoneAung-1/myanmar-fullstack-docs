---
title: "ALTER TEXT SEARCH CONFIGURATION (text search configuration တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Text search configuration တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးတဲ့ command — token types များအတွက် dictionary mappings (token type အလိုက် dictionary စာရင်း သတ်မှတ်ချက်များ) ထပ်ဖြည့်ခြင်း/ပြောင်းလဲခြင်း/ဖယ်ရှားခြင်း (ADD/ALTER/DROP MAPPING)၊ REPLACE ဖြင့် dictionary အစားထိုးခြင်း၊ RENAME TO/OWNER TO/SET SCHEMA တို့ဖြင့် နာမည်/ပိုင်ရှင်/schema ပြောင်းလဲခြင်း — configuration ၏ owner ဖြစ်ရန် လိုအပ်သော command"
order: 258
source: "https://www.postgresql.org/docs/current/sql-altertsconfig.html"
status: translated
updated: 2026-09-04
---

## ALTER TEXT SEARCH CONFIGURATION (text search configuration တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER TEXT SEARCH CONFIGURATION — text search configuration တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TEXT SEARCH CONFIGURATION name
    ADD MAPPING FOR token_type [, ... ] WITH dictionary_name [, ... ]
ALTER TEXT SEARCH CONFIGURATION name
    ALTER MAPPING FOR token_type [, ... ] WITH dictionary_name [, ... ]
ALTER TEXT SEARCH CONFIGURATION name
    ALTER MAPPING REPLACE old_dictionary WITH new_dictionary
ALTER TEXT SEARCH CONFIGURATION name
    ALTER MAPPING FOR token_type [, ... ] REPLACE old_dictionary WITH new_dictionary
ALTER TEXT SEARCH CONFIGURATION name
    DROP MAPPING [ IF EXISTS ] FOR token_type [, ... ]
ALTER TEXT SEARCH CONFIGURATION name RENAME TO new_name
ALTER TEXT SEARCH CONFIGURATION name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER TEXT SEARCH CONFIGURATION name SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER TEXT SEARCH CONFIGURATION` က text search configuration တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။ Token types တွေကနေ dictionaries တွေဆီကို သွားတဲ့ ၎င်းရဲ့ mappings တွေကို ပြုပြင်နိုင်သလို — configuration ရဲ့ နာမည် ဒါမှမဟုတ် owner (ပိုင်ရှင်) ကိုလည်း ပြောင်းလဲနိုင်ပါတယ်။

`ALTER TEXT SEARCH CONFIGURATION` ကို သုံးဖို့ဆိုရင် — သင်က configuration ရဲ့ owner ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **name** — ရှိပြီးသား text search configuration တစ်ခုရဲ့ နာမည် (schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) ပုံစံလည်း ဖြစ်နိုင်) ဖြစ်ပါတယ်။
- **token_type** — Configuration ရဲ့ parser က ထုတ်လွှတ်ပေးတဲ့ (emit) token type တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **dictionary_name** — သတ်မှတ်ထားတဲ့ token type(s) အတွက် တိုင်ပင်ဆွေးနွေးရမယ့် (consult) text search dictionary တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ Dictionary အများအပြား စာရင်းပြုထားမယ်ဆိုရင် — သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း တိုင်ပင်ဆွေးနွေးပါတယ်။
- **old_dictionary** — Mapping ထဲမှာ အစားထိုးရမယ့် text search dictionary တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **new_dictionary** — `old_dictionary` နေရာမှာ အစားထိုး သုံးစွဲရမယ့် text search dictionary တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **new_name** — Text search configuration ရဲ့ နာမည် အသစ် ဖြစ်ပါတယ်။
- **new_owner** — Text search configuration ရဲ့ owner အသစ် ဖြစ်ပါတယ်။
- **new_schema** — Text search configuration အတွက် schema အသစ် ဖြစ်ပါတယ်။

`ADD MAPPING FOR` ပုံစံက — သတ်မှတ်ထားတဲ့ token type(s) အတွက် တိုင်ပင်ရမယ့် dictionary စာရင်း တစ်ခုကို ထည့်သွင်းပေးပါတယ်; token type တစ်ခုခုအတွက် mapping တစ်ခု အရင်ကတည်းက ရှိပြီးသားဆိုရင် — error တစ်ခု ဖြစ်ပါတယ်။ `ALTER MAPPING FOR` ပုံစံကလည်း အလားတူပဲ လုပ်ဆောင်ပေမယ့် — အဲဒီ token types တွေအတွက် ရှိပြီးသား mapping တွေကို အရင်ဆုံး ဖယ်ရှားပါတယ်။ `ALTER MAPPING REPLACE` ပုံစံတွေက — `old_dictionary` ပေါ်လာတဲ့ နေရာတိုင်းမှာ — ၎င်းနေရာကို `new_dictionary` နဲ့ အစားထိုးပါတယ်။ `FOR` ပါဝင်နေမယ်ဆိုရင် — သတ်မှတ်ထားတဲ့ token types တွေအတွက်သာ လုပ်ဆောင်ပြီး — မပါဝင်ဘူးဆိုရင် — configuration ရဲ့ mappings အားလုံးအတွက် လုပ်ဆောင်ပါတယ်။ `DROP MAPPING` ပုံစံက — သတ်မှတ်ထားတဲ့ token type(s) အတွက် dictionary တွေ အားလုံးကို ဖယ်ရှားလိုက်လို့ — အဲဒီ type တွေရဲ့ tokens တွေကို text search configuration က လျစ်လျူရှုသွားစေပါတယ်။ Token types တွေအတွက် mapping မရှိဘူးဆိုရင် — error တစ်ခု ဖြစ်ပြီး — `IF EXISTS` ပါဝင်နေမှသာ error မဖြစ်ပါဘူး။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာက — `my_config` ထဲမှာ `english` dictionary ကို သုံးထားတဲ့ နေရာတိုင်းမှာ — ၎င်းနေရာကို `swedish` dictionary နဲ့ အစားထိုးပေးပါတယ်။

```sql
ALTER TEXT SEARCH CONFIGURATION my_config
  ALTER MAPPING REPLACE english WITH swedish;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER TEXT SEARCH CONFIGURATION` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TEXT SEARCH CONFIGURATION](/docs/postgresql/sql-createtsconfig), [DROP TEXT SEARCH CONFIGURATION](/docs/postgresql/sql-droptsconfig)
