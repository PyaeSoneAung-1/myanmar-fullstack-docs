---
title: "DROP TEXT SEARCH CONFIGURATION (text search configuration တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား text search configuration တစ်ခုကို ဖယ်ရှား (drop) ပေးတဲ့ command — IF EXISTS option၊ CASCADE (မှီခို objects များပါ အလိုအလျောက် ဖယ်ရှားခြင်း) နှင့် RESTRICT (default) အပြုအမူများ၊ to_tsvector calls များထဲမှာ configuration ကို ရည်ညွှန်းနေသော index များ ရှိနေပါက drop မအောင်မြင်နိုင်ပုံ အကြောင်း — configuration ၏ owner ဖြစ်ရန် လိုအပ်သော command"
order: 259
source: "https://www.postgresql.org/docs/current/sql-droptsconfig.html"
status: translated
updated: 2026-09-04
---

## DROP TEXT SEARCH CONFIGURATION (text search configuration တစ်ခုကို ဖယ်ရှားခြင်း)

DROP TEXT SEARCH CONFIGURATION — text search configuration တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP TEXT SEARCH CONFIGURATION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP TEXT SEARCH CONFIGURATION` က ရှိပြီးသား text search configuration တစ်ခုကို ဖယ်ရှား (drop) ပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ဆိုရင် — သင်က configuration ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **IF EXISTS** — Text search configuration မရှိဘူးဆိုရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား text search configuration တစ်ခုရဲ့ နာမည် (schema-qualified (schema နာမည်ဖြင့် ရှေ့ဆွဲထားသော) ပုံစံလည်း ဖြစ်နိုင်) ဖြစ်ပါတယ်။
- **CASCADE** — Text search configuration အပေါ် မှီခိုနေတဲ့ (dependent) objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — ၎င်းတို့အပေါ် မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလှည့်ကျ ဆက်ပြီး drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Text search configuration အပေါ် objects တစ်ခုခု မှီခိုနေရင် — ၎င်းကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

`my_english` ဆိုတဲ့ text search configuration ကို ဖယ်ရှားရန်:

```sql
DROP TEXT SEARCH CONFIGURATION my_english;
```

`to_tsvector` calls တွေထဲမှာ configuration ကို ရည်ညွှန်းနေတဲ့ (reference) index တွေ ရှိပြီးသားဆိုရင် — ဒီ command က အောင်မြင်မှာ မဟုတ်ပါဘူး။ အဲဒီလို index တွေကို text search configuration နဲ့အတူ drop လုပ်ဖို့ — `CASCADE` ကို ထည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP TEXT SEARCH CONFIGURATION` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TEXT SEARCH CONFIGURATION](/docs/postgresql/sql-altertsconfig), [CREATE TEXT SEARCH CONFIGURATION](/docs/postgresql/sql-createtsconfig)
