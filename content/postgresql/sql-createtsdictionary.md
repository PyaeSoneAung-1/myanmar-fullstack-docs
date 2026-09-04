---
title: "CREATE TEXT SEARCH DICTIONARY (text search dictionary အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "Text search dictionary အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးတဲ့ command — တကယ်တမ်း အလုပ်လုပ်ဆောင်ပေးတဲ့ functions များကို သတ်မှတ်ပေးသည့် text search template ပေါ်တွင် မှီခိုခြင်းနှင့် template-သီးသန့် options များ သတ်မှတ်နိုင်ခြင်း (TEMPLATE, option, value) — dictionary ကို define လုပ်သူ user က owner ဖြစ်လာခြင်း အကြောင်း ဖော်ပြထားသည်"
order: 260
source: "https://www.postgresql.org/docs/current/sql-createtsdictionary.html"
status: translated
updated: 2026-09-04
---

## CREATE TEXT SEARCH DICTIONARY (text search dictionary အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE TEXT SEARCH DICTIONARY — text search dictionary အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE TEXT SEARCH DICTIONARY name (
    TEMPLATE = template
    [, option = value [, ... ]]
)
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TEXT SEARCH DICTIONARY` က text search dictionary အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Text search dictionary တစ်ခုက — ရှာဖွေမှုအတွက် စိတ်ဝင်စားစရာ (interesting) ဒါမှမဟုတ် စိတ်ဝင်စားစရာ မဟုတ်တဲ့ (uninteresting) စကားလုံးတွေကို မှတ်မိနိုင်တဲ့ နည်းလမ်းတစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Dictionary တစ်ခုက text search template တစ်ခုအပေါ်မှာ မှီခိုပြီး — အဲဒီ template က တကယ်တမ်း အလုပ်လုပ်ဆောင်ပေးတဲ့ functions တွေကို သတ်မှတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် dictionary က — template ရဲ့ functions တွေရဲ့ အသေးစိတ် အပြုအမူကို ထိန်းချုပ်ပေးတဲ့ options တချို့ကို ပံ့ပိုးပေးပါတယ်။

Schema နာမည် ပေးထားမယ်ဆိုရင် — text search dictionary ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပြီး — မပေးထားဘူးဆိုရင် — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။

Text search dictionary တစ်ခုကို define လုပ်တဲ့ user က ၎င်းရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် text search dictionary ရဲ့ နာမည် ဖြစ်ပါတယ်။ နာမည်ကို schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) ပုံစံနဲ့ ဖြစ်စေနိုင်ပါတယ်။
- **template** — ဒီ dictionary ရဲ့ အခြေခံ အပြုအမူကို သတ်မှတ်ပေးမယ့် text search template ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **option** — ဒီ dictionary အတွက် သတ်မှတ်ရမယ့် template-သီးသန့် (template-specific) option တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **value** — Template-သီးသန့် option တစ်ခုအတွက် သုံးရမယ့် တန်ဖိုး ဖြစ်ပါတယ်။ တန်ဖိုးက ရိုးရှင်းတဲ့ identifier ဒါမှမဟုတ် ဂဏန်း မဟုတ်ဘူးဆိုရင် — quote လုပ်ရပါမယ် (ဒါပေမယ့် — အလိုရှိရင် — ဘယ်အချိန်မဆို quote လုပ်လို့ ရပါတယ်)။

Options တွေကို ဘယ်လို အစဉ်လိုက်နဲ့မဆို ထားနိုင်ပါတယ်။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာ command က — ပုံမှန် မဟုတ်တဲ့ (nonstandard) stop words စာရင်း တစ်ခုနဲ့အတူ — Snowball-based dictionary တစ်ခုကို ဖန်တီးပေးပါတယ်။

```sql
CREATE TEXT SEARCH DICTIONARY my_russian (
    template = snowball,
    language = russian,
    stopwords = myrussian
);
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE TEXT SEARCH DICTIONARY` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TEXT SEARCH DICTIONARY](/docs/postgresql/sql-altertsdictionary), [DROP TEXT SEARCH DICTIONARY](/docs/postgresql/sql-droptsdictionary)
