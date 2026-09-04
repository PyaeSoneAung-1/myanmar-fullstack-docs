---
title: "CREATE TEXT SEARCH PARSER (text search parser အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Text search parser (စာသား ရှာဖွေရေး parser) အသစ်တစ်ခုကို ဖန်တီးခြင်း — text string ကို tokens အဖြစ် ပိုင်းခြားပြီး type သတ်မှတ်ပေးမည့် parser အတွက် START, GETTOKEN, END, LEXTYPES (နှင့် optional HEADLINE) functions များ သတ်မှတ်ခြင်း — superuser သာ အသုံးပြုနိုင်သော command"
order: 263
source: "https://www.postgresql.org/docs/current/sql-createtsparser.html"
status: translated
updated: 2026-09-04
---

## CREATE TEXT SEARCH PARSER (text search parser အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE TEXT SEARCH PARSER — text search parser အသစ်တစ်ခုကို define (သတ်မှတ်) လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE TEXT SEARCH PARSER name (
    START = start_function ,
    GETTOKEN = gettoken_function ,
    END = end_function ,
    LEXTYPES = lextypes_function
    [, HEADLINE = headline_function ]
)
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TEXT SEARCH PARSER` က text search parser (စာသား ရှာဖွေရေး parser) အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Text search parser တစ်ခုက — text string (စာသား ကြိုးတန်း) တစ်ခုကို tokens (စာသား အပိုင်းအစများ) အဖြစ် ပိုင်းခြားပြီး — token တစ်ခုချင်းစီကို types (categories — အမျိုးအစားများ) တွေ သတ်မှတ်ပေးတဲ့ နည်းလမ်း (method) တစ်ခုကို define လုပ်ပါတယ်။ Parser တစ်ခုက သူ့ဘာသာသူ အသုံးဝင်လှတာ မဟုတ်ဘဲ — ရှာဖွေမှုတွေမှာ အသုံးပြုဖို့ — text search dictionaries (အဘိဓာန်များ) အချို့နဲ့အတူ — text search configuration (စာသား ရှာဖွေမှု ပုံစံ သတ်မှတ်ချက်) တစ်ခုထဲကို bind (ချိတ်ဆက်) လုပ်ထားရပါတယ်။

Schema နာမည် ပေးထားရင် — text search parser ကို အဲဒီ သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပေးထားရင် လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။

`CREATE TEXT SEARCH PARSER` ကို သုံးဖို့ — superuser ဖြစ်ရပါမယ်။ (ဒီကန့်သတ်ချက်ကို — မှားယွင်းနေတဲ့ text search parser definition တစ်ခုက server ကို ရှုပ်ထွေးစေနိုင်လို့ ဖြစ်စေ — crash ဖြစ်စေနိုင်လို့ ဖြစ်စေ — ပြုလုပ်ထားတာပါ။)

နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် text search parser ရဲ့ နာမည်။ နာမည်ကို schema-qualified (schema နာမည်နဲ့ တွဲဖက် သတ်မှတ်) လုပ်နိုင်ပါတယ်။
- **start_function** — Parser အတွက် start function ရဲ့ နာမည်။
- **gettoken_function** — Parser အတွက် get-next-token function ရဲ့ နာမည်။
- **end_function** — Parser အတွက် end function ရဲ့ နာမည်။
- **lextypes_function** — Parser အတွက် lextypes function ရဲ့ နာမည် (ထုတ်လုပ်ပေးတဲ့ token types အစုအကြောင်း အချက်အလက်တွေကို ပြန်ပေးတဲ့ function တစ်ခု)။
- **headline_function** — Parser အတွက် headline function ရဲ့ နာမည် (token အစုတစ်ခုကို အနှစ်ချုပ် (summarize) လုပ်ပေးတဲ့ function တစ်ခု)။

Function နာမည်တွေက လိုအပ်ရင် schema-qualified လုပ်ထားနိုင်ပါတယ်။ Function type တစ်ခုချင်းစီအတွက် argument list က ကြိုတင် သတ်မှတ်ပြီးသား ဖြစ်လို့ — argument types တွေကို ပေးထားတာ မဟုတ်ပါဘူး။ Headline function ကလွဲလို့ — ကျန်တဲ့ function တွေ အားလုံး လိုအပ်ပါတယ်။

Arguments တွေက အပေါ်မှာ ပြထားတဲ့ အစီအစဉ်အတိုင်း မဟုတ်ဘဲ — ဘယ် အစီအစဉ်နဲ့မဆို ပေါ်လာနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE TEXT SEARCH PARSER` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TEXT SEARCH PARSER](/docs/postgresql/sql-altertsparser), [DROP TEXT SEARCH PARSER](/docs/postgresql/sql-droptsparser)
