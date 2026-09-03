---
title: "Generated Columns (အလိုအလျောက် တွက်ချက်သော column များ)"
description: "Generated column — အခြား column များမှ အလိုအလျောက် တွက်ချက်ပေးသော column — အကြောင်း၊ stored/virtual အမျိုးအစားများ၊ default နှင့် ကွာခြားချက်နှင့် ကန့်သတ်ချက်များ"
order: 25
source: "https://www.postgresql.org/docs/current/ddl-generated-columns.html"
status: translated
updated: 2026-09-03
---

## 5.4. Generated Columns (အလိုအလျောက် တွက်ချက်သော column များ)

Generated column ဆိုတာ — တခြား column တွေကနေ အမြဲတမ်း တွက်ချက်ယူရတဲ့ အထူး column တစ်မျိုး ဖြစ်ပါတယ်။ ဒါကြောင့် — view က table တွေအတွက် ဆောင်ရွက်ပေးသလိုမျိုး — generated column က column တွေအတွက် ဆောင်ရွက်ပေးပါတယ်။ Generated column မှာ နှစ်မျိုး ရှိပါတယ် — stored နဲ့ virtual။ Stored generated column ကို row ကို ရေးသားတဲ့အခါ (insert သို့မဟုတ် update လုပ်တဲ့အခါ) တွက်ချက်ပြီး — သာမန် column တစ်ခုလိုပဲ storage နေရာ ယူပါတယ်။ Virtual generated column ကတော့ storage မယူဘဲ — column ကို ဖတ်တဲ့အခါမှသာ တွက်ချက်ပါတယ်။ ဒါကြောင့် — virtual generated column က view နဲ့ ဆင်တူပြီး — stored generated column ကတော့ materialized view နဲ့ ဆင်တူပါတယ် (ကွာခြားချက်က သူက အမြဲတမ်း အလိုအလျောက် update လုပ်ခံရတာပါ)။

Generated column တစ်ခု ဖန်တီးဖို့ — `CREATE TABLE` ထဲမှာ `GENERATED ALWAYS AS` clause ကို သုံးပါ၊ ဥပမာ:

```sql
CREATE TABLE people (
    ...,
    height_cm numeric,
    height_in numeric GENERATED ALWAYS AS (height_cm / 2.54)
);
```

Generated column က ပုံမှန်အားဖြင့် virtual အမျိုးအစား ဖြစ်ပါတယ်။ ရွေးချယ်မှုကို ရှင်းလင်းစွာ ဖော်ပြချင်ရင် `VIRTUAL` သို့မဟုတ် `STORED` keyword ကို သုံးပါ။ အသေးစိတ်အတွက် [CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) ကို ကြည့်ပါ။

Generated column တစ်ခုကို တိုက်ရိုက် တန်ဖိုး ရေးသားလို့ မရပါဘူး။ `INSERT` သို့မဟုတ် `UPDATE` command တွေမှာ generated column အတွက် တန်ဖိုး သတ်မှတ်လို့ မရပေမယ့် — `DEFAULT` keyword ကိုတော့ သတ်မှတ်ခွင့် ရှိပါတယ်။

Default ရှိတဲ့ column တစ်ခုနဲ့ generated column တစ်ခုကြားက ခြားနားချက်တွေကို သုံးသပ်ကြည့်ပါ။ Column default ကို — တခြား တန်ဖိုး တစ်ခုမှ မပေးခဲ့ဘူးဆိုရင် — row ကို ပထမဆုံး insert လုပ်တဲ့အခါ တစ်ကြိမ်တည်းသာ တွက်ချက်ပါတယ်။ Generated column ကတော့ — row ပြောင်းလဲတိုင်း update လုပ်ပြီး — override လုပ်လို့ မရပါဘူး။ Column default က table ရဲ့ တခြား column တွေကို ရည်ညွှန်းလို့ မရပေမယ့် — generation expression ကတော့ ပုံမှန်အားဖြင့် အဲဒီလို ရည်ညွှန်းပါတယ်။ Column default မှာ volatile function တွေ သုံးလို့ရပါတယ် — ဥပမာ `random()` ဒါမှမဟုတ် လက်ရှိ အချိန်ကို ရည်ညွှန်းတဲ့ function တွေ — ဒါပေမယ့် generated column တွေမှာတော့ ဒါကို ခွင့်မပြုပါဘူး။

Generated column တွေရဲ့ definition နဲ့ — generated column တွေ ပါဝင်တဲ့ table တွေအတွက် — ကန့်သတ်ချက်တွေ အများအပြား သက်ရောက်ပါတယ်:

- Generation expression က immutable function တွေကိုသာ သုံးနိုင်ပြီး — subquery တွေ သုံးလို့ မရသလို — လက်ရှိ row ကလွဲပြီး တခြား ဘယ်အရာကိုမှ ဘယ်နည်းနဲ့မှ ရည်ညွှန်းလို့ မရပါဘူး။
- Generation expression တစ်ခုက တခြား generated column တစ်ခုကို ရည်ညွှန်းလို့ မရပါဘူး။
- Generation expression က system column တစ်ခုကို ရည်ညွှန်းလို့ မရပါဘူး — tableoid ကလွဲပြီး။
- Virtual generated column တစ်ခုမှာ user-defined type ရှိလို့ မရပါဘူး။ Virtual generated column ရဲ့ generation expression ကလည်း user-defined function တွေ သို့မဟုတ် type တွေကို ရည်ညွှန်းလို့ မရဘဲ — built-in function သို့မဟုတ် type တွေကိုသာ သုံးရပါတယ်။ ဒါက operator သို့မဟုတ် cast တွေရဲ့ အောက်ခံမှာ ရှိတဲ့ function သို့မဟုတ် type တွေလိုမျိုး — သွယ်ဝိုက်၍ သက်ရောက်တဲ့ နေရာတွေမှာလည်း အကျုံးဝင်ပါတယ်။ (ဒီကန့်သတ်ချက်က stored generated column တွေအတွက်တော့ မရှိပါဘူး။)
- Generated column တစ်ခုမှာ column default ဒါမှမဟုတ် identity definition ရှိလို့ မရပါဘူး။
- Generated column က partition key ရဲ့ အစိတ်အပိုင်း ဖြစ်လို့ မရပါဘူး။
- Foreign table တွေမှာ generated column တွေ ရှိနိုင်ပါတယ်။ အသေးစိတ်အတွက် CREATE FOREIGN TABLE ကို ကြည့်ပါ။
- Inheritance နဲ့ partitioning တွေအတွက်:
  - Parent column တစ်ခုက generated column ဖြစ်နေရင် — child column ကလည်း အမျိုးအစား တူညီတဲ့ (stored သို့မဟုတ် virtual) generated column ဖြစ်ရပါမယ်။ ဒါပေမယ့် child column မှာ မတူညီတဲ့ generation expression ရှိနိုင်ပါတယ်။
  - Stored generated column တွေအတွက် — row ကို insert သို့မဟုတ် update လုပ်တဲ့အခါ တကယ် အသုံးချတဲ့ generation expression က row ရုပ်ပိုင်းအရ ရှိနေတဲ့ table နဲ့ ဆက်စပ်နေတဲ့ expression ဖြစ်ပါတယ်။ (ဒါက column default တွေရဲ့ အပြုအမူနဲ့ မတူပါဘူး — default တွေအတွက်ကတော့ query ထဲမှာ နာမည် ဖော်ပြထားတဲ့ table နဲ့ ဆက်စပ်တဲ့ default value ကို အသုံးချပါတယ်။) Virtual generated column တွေအတွက်ကတော့ — table တစ်ခုကို ဖတ်တဲ့အခါ query ထဲမှာ နာမည် ဖော်ပြထားတဲ့ table ရဲ့ generation expression ကို အသုံးချပါတယ်။
  - Parent column က generated column မဟုတ်ဘူးဆိုရင် — child column ကလည်း generated မဖြစ်ရပါဘူး။
  - Inherited table တွေမှာ — `CREATE TABLE ... INHERITS` ထဲမှာ GENERATED clause မပါတဲ့ child column definition ကို ရေးရင် — GENERATED clause ကို parent ကနေ အလိုအလျောက် ကူးယူပါလိမ့်မယ်။ `ALTER TABLE ... INHERIT` က parent နဲ့ child column တွေရဲ့ generation status ကိုက်ညီနေဖို့ တောင်းဆိုပြီး — generation expression တွေ တူညီဖို့တော့ မလိုအပ်ပါဘူး။
  - Partitioned table တွေမှာလည်း အလားတူပါပဲ — `CREATE TABLE ... PARTITION OF` ထဲမှာ GENERATED clause မပါတဲ့ child column definition ကို ရေးရင် — GENERATED clause ကို parent ကနေ အလိုအလျောက် ကူးယူပါလိမ့်မယ်။ `ALTER TABLE ... ATTACH PARTITION` က parent နဲ့ child column တွေရဲ့ generation status ကိုက်ညီနေဖို့ တောင်းဆိုပြီး — generation expression တွေ တူညီဖို့တော့ မလိုအပ်ပါဘူး။
  - Multiple inheritance (မိဘ အများကနေ ဆက်ခံခြင်း) ဖြစ်ရင် — parent column တစ်ခုက generated column ဖြစ်နေရင် — parent column တွေ အားလုံး generated column တွေ ဖြစ်ရပါမယ်။ အားလုံးမှာ တူညီတဲ့ generation expression မရှိဘူးဆိုရင် — child အတွက် လိုချင်တဲ့ expression ကို ရှင်းလင်းစွာ သတ်မှတ်ပေးရပါမယ်။

Generated column တွေကို အသုံးပြုရာမှာ ထည့်သွင်း စဉ်းစားစရာ နောက်ထပ် အချက်တွေလည်း ရှိပါသေးတယ်။

- Generated column တွေက access privilege တွေကို — သူတို့ရဲ့ အောက်ခံ base column တွေနဲ့ သီးခြားစီ ထိန်းသိမ်းထားပါတယ်။ ဒါကြောင့် — role တစ်ခုအနေနဲ့ base column တွေကို မဖတ်နိုင်ဘဲ — generated column တစ်ခုကိုတော့ ဖတ်နိုင်အောင် စီစဉ်ထားဖို့ ဖြစ်နိုင်ပါတယ်။

  Virtual generated column တွေအတွက်တော့ — generation expression က leakproof function တွေကိုသာ သုံးထားမှသာ ဒါက လုံးဝ လုံခြုံပါတယ် (CREATE FUNCTION ကို ကြည့်ပါ) — ဒါပေမယ့် ဒါကို system က enforce လုပ်ပေးတာ မဟုတ်ပါဘူး။
- Generation expression တွေထဲမှာ သုံးထားတဲ့ function တွေရဲ့ privilege ကို — expression ကို တကယ် execute လုပ်တဲ့အခါ — write ဖြစ်ဖြစ် read ဖြစ်ဖြစ် — generation expression ကို generated column သုံးတဲ့ query ကနေ တိုက်ရိုက် ခေါ်ထားသလိုမျိုး စစ်ဆေးပါတယ်။ Generated column ကို သုံးသူဟာ generation expression ထဲမှာ သုံးထားတဲ့ function တွေ အားလုံးကို ခေါ်ယူခွင့် (permission) ရှိရပါမယ်။ Generation expression ထဲက function တွေကို — function တွေကို SECURITY INVOKER အဖြစ် ဒါမှမဟုတ် SECURITY DEFINER အဖြစ် သတ်မှတ်ထားလားပေါ် မူတည်ပြီး — query ကို execute လုပ်နေတဲ့ user ရဲ့ privilege နဲ့ ဒါမှမဟုတ် function ပိုင်ရှင်ရဲ့ privilege နဲ့ execute လုပ်ပါတယ်။
- Generated column တွေက — concept အရဆိုရင် — BEFORE trigger တွေ run ပြီးမှ update လုပ်ခံရပါတယ်။ ဒါကြောင့် — BEFORE trigger တစ်ခုထဲမှာ base column တွေကို ပြောင်းလဲမှုတွေ လုပ်ရင် — generated column တွေထဲမှာ ပြန်ထင်ဟပ်ပါတယ်။ ဒါပေမယ့် အပြန်အလှန်အနေနဲ့ — BEFORE trigger တွေထဲမှာ generated column တွေကို access လုပ်တာတော့ ခွင့်မပြုပါဘူး။
- Generated column တွေကို logical replication လုပ်ချိန်မှာ — CREATE PUBLICATION ရဲ့ publish_generated_columns parameter အရ ဒါမှမဟုတ် CREATE PUBLICATION command ရဲ့ column list ထဲမှာ ထည့်သွင်းခြင်းအားဖြင့် — replicate လုပ်ခွင့် ရှိပါတယ်။ ဒါက လောလောဆယ်မှာ stored generated column တွေအတွက်သာ ထောက်ပံ့ပါသေးတယ်။ အသေးစိတ်အတွက် အပိုင်း 29.6 ကို ကြည့်ပါ။
