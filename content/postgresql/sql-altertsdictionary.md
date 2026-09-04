---
title: "ALTER TEXT SEARCH DICTIONARY (text search dictionary တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Text search dictionary တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးတဲ့ command — template-သီးသန့် options များ သတ်မှတ်ခြင်း/ပြောင်းလဲခြင်း (option [ = value ] — value ချန်လိုက်ပါက ယခင် သတ်မှတ်ချက် ဖယ်ရှားခံရခြင်း)၊ RENAME TO/OWNER TO/SET SCHEMA တို့ဖြင့် နာမည်/ပိုင်ရှင်/schema ပြောင်းလဲခြင်း — configuration files များ ပြောင်းလဲပြီးနောက် sessions များကို ပြန်လည်ဖတ်စေရန် dummy update ပြုလုပ်နိုင်ပုံ အပါအဝင် — dictionary ၏ owner ဖြစ်ရန် လိုအပ်သော command"
order: 261
source: "https://www.postgresql.org/docs/current/sql-altertsdictionary.html"
status: translated
updated: 2026-09-04
---

## ALTER TEXT SEARCH DICTIONARY (text search dictionary တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER TEXT SEARCH DICTIONARY — text search dictionary တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TEXT SEARCH DICTIONARY name (
    option [ = value ] [, ... ]
)
ALTER TEXT SEARCH DICTIONARY name RENAME TO new_name
ALTER TEXT SEARCH DICTIONARY name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER TEXT SEARCH DICTIONARY name SET SCHEMA new_schema
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER TEXT SEARCH DICTIONARY` က text search dictionary တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။ Dictionary ရဲ့ template-သီးသန့် (template-specific) options တွေကို ပြောင်းလဲနိုင်သလို — dictionary ရဲ့ နာမည် ဒါမှမဟုတ် owner (ပိုင်ရှင်) ကိုလည်း ပြောင်းလဲနိုင်ပါတယ်။

`ALTER TEXT SEARCH DICTIONARY` ကို သုံးဖို့ဆိုရင် — သင်က dictionary ရဲ့ owner ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **name** — ရှိပြီးသား text search dictionary တစ်ခုရဲ့ နာမည် (schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) ပုံစံလည်း ဖြစ်နိုင်) ဖြစ်ပါတယ်။
- **option** — ဒီ dictionary အတွက် သတ်မှတ်ရမယ့် template-သီးသန့် option တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **value** — Template-သီးသန့် option တစ်ခုအတွက် သုံးရမယ့် တန်ဖိုး အသစ် ဖြစ်ပါတယ်။ Equal sign (မျဉ်းညီ အမှတ်အသား `=`) နဲ့ တန်ဖိုးကို ချန်လိုက်မယ်ဆိုရင် — အဲဒီ option အတွက် အရင်က သတ်မှတ်ထားခဲ့တဲ့ အရာတွေ အားလုံးကို dictionary ကနေ ဖယ်ရှားလိုက်ပြီး — default ကို သုံးစွဲခွင့် ပြုလိုက်တာ ဖြစ်ပါတယ်။
- **new_name** — Text search dictionary ရဲ့ နာမည် အသစ် ဖြစ်ပါတယ်။
- **new_owner** — Text search dictionary ရဲ့ owner အသစ် ဖြစ်ပါတယ်။
- **new_schema** — Text search dictionary အတွက် schema အသစ် ဖြစ်ပါတယ်။

Template-သီးသန့် options တွေကို ဘယ်လို အစဉ်လိုက်နဲ့မဆို ထားနိုင်ပါတယ်။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာ command က — Snowball-based dictionary တစ်ခုရဲ့ stopword list ကို ပြောင်းလဲပေးပါတယ်။ တခြား parameters တွေကတော့ မပြောင်းလဲဘဲ ရှိနေပါတယ်။

```sql
ALTER TEXT SEARCH DICTIONARY my_dict ( StopWords = newrussian );
```

အောက်ပါ ဥပမာ command က — language option ကို `dutch` အဖြစ် ပြောင်းလဲပြီး — stopword option ကိုတော့ လုံးဝ ဖယ်ရှားပါတယ်။

```sql
ALTER TEXT SEARCH DICTIONARY my_dict ( language = dutch, StopWords );
```

အောက်ပါ ဥပမာ command က — dictionary ရဲ့ definition ကို — ဘာမှ တကယ်တမ်း မပြောင်းလဲဘဲ — “updates” လုပ်ပေးပါတယ်။

```sql
ALTER TEXT SEARCH DICTIONARY my_dict ( dummy );
```

(ဒါ အလုပ်လုပ်တဲ့ အကြောင်းရင်းက — option ဖယ်ရှားရေး code က အဲဒီလို option မရှိဘူးဆိုရင်တောင် ဘာမှ မကန့်ကွက်လို့ပါ။) ဒီလှည့်ကွက် (trick) က dictionary အတွက် configuration files တွေကို ပြောင်းလဲတဲ့အခါ အသုံးဝင်ပါတယ်: အဲဒီ `ALTER` က ရှိပြီးသား database sessions တွေကို configuration files တွေကို ပြန်လည် ဖတ်စေမှာ ဖြစ်ပြီး — သူတို့က အဲဒီ files တွေကို အရင်က ဖတ်ပြီးသားဆိုရင် — ဒီလိုမဟုတ်ရင် ဘယ်တော့မှ ပြန်ဖတ်မှာ မဟုတ်လို့ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER TEXT SEARCH DICTIONARY` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE TEXT SEARCH DICTIONARY](/docs/postgresql/sql-createtsdictionary), [DROP TEXT SEARCH DICTIONARY](/docs/postgresql/sql-droptsdictionary)
