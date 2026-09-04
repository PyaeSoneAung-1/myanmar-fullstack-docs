---
title: "CREATE TEXT SEARCH CONFIGURATION (text search configuration အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "Text search configuration အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးတဲ့ command — text ကို tokens (စာသား အပိုင်းအစများ) အဖြစ် ပိုင်းခြားပေးမယ့် parser တစ်ခုကိုဖြစ်စေ၊ ရှိပြီးသား configuration တစ်ခုကို COPY ဖြင့် ကူးယူ၍ဖြစ်စေ သတ်မှတ်နိုင်ခြင်း — PARSER နှင့် COPY option များ အပြန်အလှန် သီးသန့် ဖြစ်ခြင်း၊ configuration ကို define လုပ်သူ user က owner ဖြစ်လာခြင်း အကြောင်း ဖော်ပြထားသည်"
order: 257
source: "https://www.postgresql.org/docs/current/sql-createtsconfig.html"
status: translated
updated: 2026-09-04
---

## CREATE TEXT SEARCH CONFIGURATION (text search configuration အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE TEXT SEARCH CONFIGURATION — text search configuration အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE TEXT SEARCH CONFIGURATION name (
    PARSER = parser_name |
    COPY = source_config
)
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TEXT SEARCH CONFIGURATION` က text search configuration အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Text search configuration တစ်ခုက — string (စာသားကြိုး) တစ်ခုကို tokens (စာသား အပိုင်းအစများ) အဖြစ် ပိုင်းခြားပေးနိုင်တဲ့ text search parser တစ်ခုနဲ့ — ရှာဖွေမှုအတွက် စိတ်ဝင်စားစရာ token တွေက ဘယ်ဟာတွေလဲ ဆုံးဖြတ်ဖို့ သုံးနိုင်တဲ့ dictionaries (အဘိဓာန်များ) တို့ကို သတ်မှတ်ပေးပါတယ်။

Parser တစ်ခုကိုပဲ သတ်မှတ်မယ်ဆိုရင် — text search configuration အသစ်မှာ အစပိုင်းမှာ token types တွေကနေ dictionaries တွေဆီကို သွားတဲ့ mappings (ပုံဖော် သတ်မှတ်ချက်များ) တွေ ဘာမှ မရှိတာကြောင့် — စကားလုံးတွေ အားလုံးကို လျစ်လျူရှုသွားမှာ ဖြစ်ပါတယ်။ Configuration ကို အသုံးဝင်အောင် mappings တွေ ဖန်တီးဖို့ဆိုရင် — နောက်ပိုင်းမှာ `ALTER TEXT SEARCH CONFIGURATION` command တွေကို သုံးရပါမယ်။ တနည်းအားဖြင့် — ရှိပြီးသား text search configuration တစ်ခုကို ကူးယူ (copy) လုပ်လို့လည်း ရပါတယ်။

Schema နာမည် ပေးထားမယ်ဆိုရင် — text search configuration ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပြီး — မပေးထားဘူးဆိုရင် — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။

Text search configuration တစ်ခုကို define လုပ်တဲ့ user က ၎င်းရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် text search configuration ရဲ့ နာမည် ဖြစ်ပါတယ်။ နာမည်ကို schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) ပုံစံနဲ့ ဖြစ်စေနိုင်ပါတယ်။
- **parser_name** — ဒီ configuration အတွက် သုံးရမယ့် text search parser ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **source_config** — ကူးယူရမယ့် ရှိပြီးသား text search configuration တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`PARSER` နဲ့ `COPY` option တွေက အချင်းချင်း သီးသန့် (mutually exclusive) ဖြစ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ ရှိပြီးသား configuration တစ်ခုကို ကူးယူတဲ့အခါ — ၎င်းရဲ့ parser ရွေးချယ်မှုကိုပါ အတူတူ ကူးယူလိုက်လို့ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE TEXT SEARCH CONFIGURATION` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TEXT SEARCH CONFIGURATION](/docs/postgresql/sql-altertsconfig), [DROP TEXT SEARCH CONFIGURATION](/docs/postgresql/sql-droptsconfig)
