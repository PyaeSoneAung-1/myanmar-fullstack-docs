---
title: "Overview (ခြုံငုံသုံးသပ်ချက်)"
description: "Type conversion (type ပြောင်းလဲခြင်း) စည်းမျဉ်းများ ခြုံငုံသုံးသပ်ချက် — function call, operator, value storage, UNION/CASE စသည့် construct များအတွက် parser က type ကို မည်သို့ ဖြေရှင်းသည်နှင့် cast, type category, preferred type အကြောင်း"
order: 68
source: "https://www.postgresql.org/docs/current/typeconv-overview.html"
status: translated
updated: 2026-09-03
---

## 10.1. Overview (ခြုံငုံသုံးသပ်ချက်)

SQL က strongly typed language တစ်ခု ဖြစ်ပါတယ်။ ဆိုလိုတာက — data item (ဒေတာ အစိတ်အပိုင်း) တိုင်းမှာ ၎င်းရဲ့ အပြုအမူ (behavior) နဲ့ ခွင့်ပြုထားတဲ့ အသုံးပြုပုံတွေကို သတ်မှတ်ပေးတဲ့ data type တစ်ခု ဆက်စပ်ပါတယ်။ PostgreSQL မှာ တခြား SQL implementation တွေထက် ပိုပြီး ယေဘုယျကျပြီး ပြောင်းလွယ်ပြင်လွယ် ရှိတဲ့ extensible type system (တိုးချဲ့နိုင်သော type system) တစ်ခု ရှိပါတယ်။ ဒါကြောင့် PostgreSQL ထဲမှာ type conversion (type ပြောင်းလဲခြင်း) အပြုအမူ အများစုကို ad hoc heuristic (ကိစ္စအလိုက် ခန့်မှန်း နည်းစနစ်) တွေနဲ့ မဟုတ်ဘဲ — ယေဘုယျ စည်းမျဉ်းတွေနဲ့ ထိန်းချုပ်ထားပါတယ်။ ဒါကြောင့် user-defined type (သုံးစွဲသူ သတ်မှတ်သည့် type) တွေနဲ့တောင် — type အမျိုးမျိုး ရောနှောပါတဲ့ expression (mixed-type expression) တွေကို သုံးနိုင်ပါတယ်။

PostgreSQL ရဲ့ scanner/parser က lexical element တွေကို အခြေခံ အမျိုးအစား ငါးမျိုး ခွဲခြားပါတယ်: integers (ကိန်းပြည့်များ)၊ non-integer numbers (ကိန်းပြည့် မဟုတ်သော ကိန်းများ)၊ strings (စာတန်းများ)၊ identifiers (နာမည်မှတ်ပုံများ) နဲ့ key words (ကြိုတင် သတ်မှတ်ထားသော စာလုံးများ) တို့ ဖြစ်ပါတယ်။ Non-numeric type အများစုရဲ့ constant တွေကို ပထမဆုံး strings အဖြစ် ခွဲခြား သတ်မှတ်ပါတယ်။ SQL language ရဲ့ အဓိပ္ပာယ် ဖွင့်ဆိုချက်က type နာမည်တွေကို strings တွေနဲ့ တွဲပြီး သတ်မှတ်ခွင့် ပြုပြီး — ဒီယန္တရားကို PostgreSQL မှာ parser ကို မှန်ကန်တဲ့ လမ်းကြောင်းပေါ် ဦးတည်ပေးဖို့ သုံးနိုင်ပါတယ်။ ဥပမာ — ဒီ query ကို ကြည့်ပါ:

```sql
SELECT text 'Origin' AS "label", point '(0,0)' AS "value";

 label  | value
--------+-------
 Origin | (0,0)
(1 row)
```

ဒီ query မှာ literal constant နှစ်ခု ပါဝင်ပြီး — type တွေက `text` နဲ့ `point` ဖြစ်ပါတယ်။ String literal တစ်ခုအတွက် type ကို သတ်မှတ်မပေးဘူးဆိုရင် — အောက်မှာ ဖော်ပြမယ့်အတိုင်း နောက်ပိုင်း အဆင့်တွေမှာ ဖြေရှင်းဖို့အတွက် — placeholder (နေရာခံ) type ဖြစ်တဲ့ `unknown` ကို ကနဦး သတ်မှတ်ပေးပါတယ်။

PostgreSQL parser ထဲမှာ သီးခြား type conversion စည်းမျဉ်းတွေ လိုအပ်တဲ့ အခြေခံ SQL construct လေးမျိုး ရှိပါတယ်:

- **Function calls (function ခေါ်ဆိုမှုများ)** — PostgreSQL ရဲ့ type system အများစုက function အစုအဝေး ကြွယ်ဝစွာ ပါဝင်တာပေါ်မှာ တည်ဆောက်ထားပါတယ်။ Function တစ်ခုမှာ argument တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရှိနိုင်ပါတယ်။ PostgreSQL က function overloading (နာမည်တူ function အများအပြားကို argument type မျိုးစုံနဲ့ သတ်မှတ်ခြင်း) ကို ခွင့်ပြုတဲ့အတွက် — function နာမည် တစ်ခုတည်းနဲ့ ဘယ် function ကို ခေါ်ရမယ်ဆိုတာ ထူးခြားစွာ သတ်မှတ်လို့ မရပါဘူး; parser က ထည့်သွင်းလိုက်တဲ့ argument တွေရဲ့ data type တွေပေါ် အခြေခံပြီး မှန်ကန်တဲ့ function ကို ရွေးချယ်ရပါတယ်။
- **Operators** — PostgreSQL က prefix (ရှေ့ဆွဲ — argument တစ်ခု) operator တွေအပြင် infix (အလယ်တွင် သုံးသော — argument နှစ်ခု) operator တွေ ပါတဲ့ expression တွေကိုပါ ခွင့်ပြုပါတယ်။ Function တွေလိုပဲ operator တွေလည်း overload လုပ်လို့ရတာကြောင့် — မှန်ကန်တဲ့ operator ကို ရွေးချယ်ရမယ့် ပြဿနာ အတူတူပဲ ရှိပါတယ်။
- **Value Storage (တန်ဖိုး သိမ်းဆည်းခြင်း)** — SQL ရဲ့ INSERT နဲ့ UPDATE statement တွေက expression တွေရဲ့ ရလဒ်တွေကို table ထဲကို ထည့်ပေးပါတယ်။ Statement ထဲက expression တွေကို target column တွေရဲ့ type တွေနဲ့ ကိုက်ညီအောင် လုပ်ပြီး — လိုအပ်ရင် အဲဒီ type တွေဆီ ပြောင်းလဲ (convert) ပေးရပါတယ်။
- **UNION, CASE နဲ့ ဆက်စပ် construct များ** — union လုပ်ထားတဲ့ SELECT statement တစ်ခုရဲ့ query result တွေ အားလုံးက column အစု တစ်စုတည်းထဲမှာ ပေါ်လာရတာမို့ — SELECT clause တစ်ခုချင်းစီရဲ့ result တွေရဲ့ type တွေကို ကိုက်ညီအောင် လုပ်ပြီး — တစ်ပြေးညီ (uniform) အစုတစ်ခုအဖြစ် ပြောင်းလဲပေးရပါတယ်။ အလားတူပဲ — CASE construct တစ်ခုရဲ့ result expression တွေကို — CASE expression တစ်ခုလုံး သိထားပြီးသား (known) output type တစ်ခု ရှိစေဖို့ — common type (ဘုံ type) တစ်ခုဆီ ပြောင်းလဲပေးရပါတယ်။ `ARRAY[]` နဲ့ GREATEST နဲ့ LEAST function တွေလို တခြား construct တချို့ကလည်း — subexpression အများအပြားအတွက် common type တစ်ခု သတ်မှတ်ဖို့ အလားတူ လိုအပ်ပါတယ်။

System catalog တွေက — data type အတွဲတွေကြားမှာ ဘယ်လို conversion (တနည်း *cast*) တွေ တည်ရှိပြီး အဲဒီ conversion တွေကို ဘယ်လို လုပ်ဆောင်ရမယ်ဆိုတဲ့ အချက်အလက်တွေကို သိမ်းဆည်းပါတယ်။ User တွေက [CREATE CAST](https://www.postgresql.org/docs/current/sql-createcast.html) command နဲ့ cast အသစ်တွေကို ထပ်ထည့်နိုင်ပါတယ်။ (ဒါက ပုံမှန်အားဖြင့် data type အသစ်တွေ သတ်မှတ်တာနဲ့ တွဲပြီး လုပ်လေ့ ရှိပါတယ်။ Built-in type တွေကြားက cast အစုကိုတော့ ဂရုတစိုက် ဒီဇိုင်းလုပ်ထားပြီးသား ဖြစ်လို့ — ပြောင်းလဲခြင်း မပြုတာ အကောင်းဆုံး ဖြစ်ပါတယ်။)

Parser က ထောက်ပံ့ပေးတဲ့ နောက်ထပ် heuristic တစ်ခုက — implicit cast (သွယ်ဝိုက် cast) တွေ ရှိတဲ့ type အုပ်စုတွေကြားမှာ သင့်လျော်တဲ့ casting အပြုအမူကို ပိုမို ကောင်းမွန်စွာ ဆုံးဖြတ်နိုင်အောင် လုပ်ပေးပါတယ်။ Data type တွေကို အခြေခံ *type category* (type အမျိုးအစား အုပ်စု) အများအပြား ခွဲခြားထားပြီး — `boolean`, `numeric`, `string`, `bitstring`, `datetime`, `timespan`, `geometric`, `network` နဲ့ user-defined တို့ ပါဝင်ပါတယ်။ (စာရင်းအပြည့်အစုံအတွက် [ဇယား 52.65](https://www.postgresql.org/docs/current/catalog-pg-type.html#CATALOG-TYPCATEGORY-TABLE) ကို ကြည့်ပါ; ဒါပေမယ့် custom type category တွေလည်း ဖန်တီးလို့ရတယ်ဆိုတာ သတိပြုပါ။) Category တစ်ခုစီထဲမှာ — ဖြစ်နိုင်ခြေ ရှိတဲ့ type ရွေးစရာတွေ ကြားမှာ ဦးစားပေးခံရတဲ့ *preferred type* (နှစ်သက်ရာ type) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရှိနိုင်ပါတယ်။ Preferred type တွေနဲ့ ရရှိနိုင်တဲ့ implicit cast တွေကို ဂရုတစိုက် ရွေးချယ်ထားခြင်းအားဖြင့် — ambiguous (မရှင်းလင်းသော) expression တွေ (parse ဖြေရှင်းမှုအတွက် candidate အများအပြား ရှိတဲ့ သူတွေ) ကို အသုံးဝင်တဲ့ ပုံစံနဲ့ ဖြေရှင်းနိုင်အောင် သေချာစေနိုင်ပါတယ်။

Type conversion စည်းမျဉ်း အားလုံးကို အောက်ပါ အခြေခံမူ (principle) တွေကို စိတ်ထဲ ထားပြီး ဒီဇိုင်းလုပ်ထားပါတယ်:

- Implicit conversion (သွယ်ဝိုက် ပြောင်းလဲခြင်း) တွေက ဘယ်တော့မှ အံ့အားသင့်စရာ သို့မဟုတ် ကြိုတင် ခန့်မှန်းလို့မရတဲ့ ရလဒ်တွေကို မဖြစ်စေရပါဘူး။
- Query တစ်ခုက implicit type conversion မလိုအပ်ဘူးဆိုရင် — parser ဒါမှမဟုတ် executor ထဲမှာ အပိုဝန်ထုပ် (extra overhead) တစ်စုံတစ်ရာ မရှိစေရပါဘူး။ ဆိုလိုတာက — query တစ်ခုက ကောင်းမွန်စွာ ဖွဲ့စည်းထားပြီး type တွေက ကတည်းက ကိုက်ညီနေရင် — parser ထဲမှာ အချိန်ပို မကုန်စေဘဲ၊ query ထဲမှာ မလိုအပ်တဲ့ implicit conversion call တွေ ထည့်မသွင်းဘဲ — အဲဒီ query က run ဖြစ်စေရပါတယ်။
- ထို့အပြင် — query တစ်ခုက function တစ်ခုအတွက် ပုံမှန်အားဖြင့် implicit conversion လိုအပ်နေပြီး — user က မှန်ကန်တဲ့ argument type တွေနဲ့ function အသစ်တစ်ခုကို သတ်မှတ်လိုက်ရင် — parser က function အသစ်ဖြစ်တဲ့ အဲဒီဟာကို သုံးပြီး — function အဟောင်းကို သုံးဖို့ implicit conversion တွေ ထပ်မလုပ်တော့ဘဲ နေရပါမယ်။
