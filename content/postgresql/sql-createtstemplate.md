---
title: "CREATE TEXT SEARCH TEMPLATE (text search template အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Text search template (စာသား ရှာဖွေမှု template) အသစ်တစ်ခုကို ဖန်တီးခြင်း — text search dictionaries များကို implement လုပ်ပေးသည့် functions များ သတ်မှတ်ခြင်း — optional INIT နှင့် မဖြစ်မနေ LEXIZE functions ပါဝင်ပြီး — superuser သာ အသုံးပြုနိုင်သော command"
order: 266
source: "https://www.postgresql.org/docs/current/sql-createtstemplate.html"
status: translated
updated: 2026-09-04
---

## CREATE TEXT SEARCH TEMPLATE (text search template အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE TEXT SEARCH TEMPLATE — text search template အသစ်တစ်ခုကို define (သတ်မှတ်) လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE TEXT SEARCH TEMPLATE name (
    [ INIT = init_function , ]
    LEXIZE = lexize_function
)
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE TEXT SEARCH TEMPLATE` က text search template (စာသား ရှာဖွေမှု template) အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Text search templates တွေက — text search dictionaries တွေကို implement (အကောင်အထည်ဖော်) လုပ်ပေးတဲ့ functions တွေကို define လုပ်ပါတယ်။ Template တစ်ခုက သူ့ဘာသာသူ အသုံးဝင်တာ မဟုတ်ဘဲ — အသုံးပြုနိုင်ဖို့ dictionary တစ်ခုအနေနဲ့ instantiate (ဖွဲ့စည်း တည်ဆောက်) လုပ်ထားရပါတယ်။ Dictionary က ပုံမှန်အားဖြင့် — template functions တွေဆီ ပေးအပ်ရမယ့် parameters တွေကို သတ်မှတ်ပေးပါတယ်။

Schema နာမည် ပေးထားရင် — text search template ကို အဲဒီ သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပေးထားရင် လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။

`CREATE TEXT SEARCH TEMPLATE` ကို သုံးဖို့ — superuser ဖြစ်ရပါမယ်။ ဒီကန့်သတ်ချက်ကို — မှားယွင်းနေတဲ့ text search template definition တစ်ခုက server ကို ရှုပ်ထွေးစေနိုင်လို့ ဖြစ်စေ — crash ဖြစ်စေနိုင်လို့ ဖြစ်စေ — ပြုလုပ်ထားတာပါ။ Templates တွေကို dictionaries တွေကနေ သီးခြားခွဲထားရတဲ့ အကြောင်းရင်းက — template တစ်ခုက dictionary တစ်ခုကို define လုပ်ခြင်းရဲ့ “unsafe” (မလုံခြုံသော) သွင်ပြင်တွေကို ခြုံထည့် (encapsulate) ထားလို့ပါ။ Dictionary တစ်ခုကို define လုပ်တဲ့အခါ သတ်မှတ်လို့ရတဲ့ parameters တွေက — privilege မရှိတဲ့ (unprivileged) users တွေ သတ်မှတ်ဖို့ အန္တရာယ် ကင်းပြီး — အဲဒါကြောင့် dictionary တစ်ခု ဖန်တီးတာက privileged operation (အခွင့်ထူးခံ လုပ်ဆောင်ချက်) ဖြစ်စရာ မလိုပါဘူး။

နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) ကို ကိုးကားကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် text search template ရဲ့ နာမည်။ နာမည်ကို schema-qualified (schema နာမည်နဲ့ တွဲဖက် သတ်မှတ်) လုပ်နိုင်ပါတယ်။
- **init_function** — Template အတွက် init function ရဲ့ နာမည်။
- **lexize_function** — Template အတွက် lexize function ရဲ့ နာမည်။

Function နာမည်တွေက လိုအပ်ရင် schema-qualified လုပ်ထားနိုင်ပါတယ်။ Function type တစ်ခုချင်းစီအတွက် argument list က ကြိုတင် သတ်မှတ်ပြီးသား ဖြစ်လို့ — argument types တွေကို ပေးထားတာ မဟုတ်ပါဘူး။ Lexize function က လိုအပ်ပြီး — init function ကတော့ optional ပါ။

Arguments တွေက အပေါ်မှာ ပြထားတဲ့ အစီအစဉ်အတိုင်း မဟုတ်ဘဲ — ဘယ် အစီအစဉ်နဲ့မဆို ပေါ်လာနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `CREATE TEXT SEARCH TEMPLATE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TEXT SEARCH TEMPLATE](/docs/postgresql/sql-altertstemplate), [DROP TEXT SEARCH TEMPLATE](/docs/postgresql/sql-droptstemplate)
