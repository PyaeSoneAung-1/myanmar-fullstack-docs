---
title: "Value Storage (တန်ဖိုး သိမ်းဆည်းခြင်း)"
description: "Table ထဲသို့ ထည့်သွင်းမည့် value များကို destination column ၏ data type အဖြစ် ပြောင်းလဲ သိမ်းဆည်းပုံ — exact match ၊ assignment cast နှင့် sizing cast စည်းမျဉ်းများ"
order: 71
source: "https://www.postgresql.org/docs/current/typeconv-query.html"
status: translated
updated: 2026-09-03
---

## 10.4. Value Storage (တန်ဖိုး သိမ်းဆည်းခြင်း)

Table တစ်ခုထဲသို့ ထည့်သွင်းမယ့် value တွေကို — အောက်ပါ အဆင့်တွေအတိုင်း — destination column (တန်ဖိုး သိမ်းဆည်းရာ column) ရဲ့ data type အဖြစ် ပြောင်းလဲပေးပါတယ်။

**Value Storage Type Conversion (တန်ဖိုး သိမ်းဆည်းရာတွင် type conversion)**

1. Target type (ပစ်မှတ် type) နဲ့ အတိအကျ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါ။
2. ကိုက်ညီမှု မရှိပါက — expression ကို target type အဖြစ် ပြောင်းလဲဖို့ ကြိုးစားပါ။ Type နှစ်ခုကြားမှာ assignment cast (column တစ်ခုထဲသို့ တန်ဖိုး သိမ်းဆည်းရန် သုံးသော cast) တစ်ခုကို `pg_cast` catalog (cast မှတ်တမ်းများ သိမ်းရာ catalog) ထဲမှာ မှတ်ပုံတင်ထားရင် ဒီလို ပြောင်းလဲခြင်း ဖြစ်နိုင်ပါတယ် (`CREATE CAST` ကို ကြည့်ပါ)။ တနည်းအားဖြင့် — expression က unknown-type literal (type မသတ်မှတ်ရသေးသော literal) ဖြစ်နေရင် — literal string ရဲ့ အကြောင်းအရာတွေကို target type ရဲ့ input conversion routine (input ပြောင်းလဲရေး လုပ်ရိုးလုပ်စဉ်) ထံ ပို့ဆောင်ပေးပါတယ်။
3. Target type အတွက် sizing cast (အရွယ်အစား ချိန်ညှိရန် သုံးသော cast) ရှိမရှိ စစ်ဆေးပါ။ Sizing cast ဆိုတာ — အဲဒီ type ကနေ အဲဒီ type ကိုယ်တိုင်ဆီ ပြောင်းလဲတဲ့ cast ဖြစ်ပါတယ်။ `pg_cast` catalog ထဲမှာ တွေ့ရင် — destination column ထဲသို့ မသိမ်းဆည်းမီ expression ကို အဲဒီ cast နဲ့ ပြောင်းလဲပါ။ ဒီလို cast တစ်ခုရဲ့ implementation function က `integer` type ရဲ့ အပိုဆောင်း parameter တစ်ခုကို အမြဲ လက်ခံပြီး — အဲဒီ parameter က destination column ရဲ့ `atttypmod` value (ပုံမှန်အားဖြင့် ကြေညာထားတဲ့ length (အလျား) ဖြစ်တတ်ပြီး — `atttypmod` ရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကတော့ data type အလိုက် ကွဲပြားနိုင်ပါတယ်) ကို လက်ခံရရှိပါတယ်။ ဒါ့အပြင် — cast က explicit (တိုက်ရိုက် ဖော်ပြသော) လား implicit (သွယ်ဝိုက်သော) လား ဆိုတာကို ဖော်ပြတဲ့ တတိယမြောက် `boolean` parameter တစ်ခုလည်း ပါဝင်နိုင်ပါတယ်။ Cast function ကသာ — size checking (အရွယ်အစား စစ်ဆေးခြင်း) သို့မဟုတ် truncation (ဖြတ်တောက်ခြင်း) ကဲ့သို့ length နဲ့ သက်ဆိုင်တဲ့ semantics (အဓိပ္ပာယ် သတ်မှတ်ချက်များ) တွေကို ကျင့်သုံးရတဲ့ တာဝန် ရှိပါတယ်။

**ဥပမာ 10.9. character Storage Type Conversion (character type သို့ သိမ်းဆည်းရာတွင် type conversion)**

`character(20)` အဖြစ် ကြေညာထားတဲ့ target column တစ်ခုအတွက် — အောက်ပါ statement က သိမ်းဆည်းလိုက်တဲ့ value ကို အရွယ်အစား မှန်ကန်စွာ သတ်မှတ်ပေးကြောင်း ပြသပါတယ်:

```sql
CREATE TABLE vv (v character(20));
INSERT INTO vv SELECT 'abc' || 'def';
SELECT v, octet_length(v) FROM vv;

          v           | octet_length
----------------------+--------------
 abcdef               |           20
(1 row)
```

ဒီနေရာမှာ တကယ် ဖြစ်ပျက်ခဲ့တာက — unknown literal နှစ်ခုလုံးကို default အားဖြင့် `text` အဖြစ် ဖြေရှင်းလိုက်လို့ `||` operator ကို `text` concatenation အဖြစ် ဖြေရှင်းနိုင်ခဲ့တာပါ။ ပြီးတော့ operator ရဲ့ `text` ရလဒ်ကို — target column type နဲ့ ကိုက်ညီအောင် — `bpchar` (“blank-padded char” — `character` data type ရဲ့ အတွင်းပိုင်း နာမည်) အဖြစ် ပြောင်းလဲပါတယ်။ (`text` ကနေ `bpchar` ကို ပြောင်းတာက binary-coercible (function call တစ်ခုမျှ မလိုအပ်ဘဲ ပြောင်းလဲနိုင်ခြင်း) ဖြစ်လို့ — ဒီပြောင်းလဲမှုက တကယ့် function call တစ်ခုကို ထည့်သွင်းတာ မဟုတ်ပါဘူး။) နောက်ဆုံးမှာ — `bpchar(bpchar, integer, boolean)` ဆိုတဲ့ sizing function ကို system catalog ထဲမှာ ရှာတွေ့ပြီး — operator ရဲ့ ရလဒ်နဲ့ သိမ်းဆည်းမယ့် column length ပေါ် သက်ရောက်စေပါတယ်။ ဒီ type-specific function က — လိုအပ်တဲ့ length စစ်ဆေးမှုနဲ့ padding space (နေရာလွတ် ဖြည့်စွက်ခြင်း) ထည့်သွင်းခြင်းတွေကို လုပ်ဆောင်ပေးပါတယ်။
