---
title: "Numeric Types (ဂဏန်း type များ)"
description: "ဂဏန်း (numeric) type များ — integer, numeric/decimal, floating-point နှင့် serial type များ; range နှင့် သိုလှောင်မှု ဇယားများ ပါဝင်"
order: 48
source: "https://www.postgresql.org/docs/current/datatype-numeric.html"
status: translated
updated: 2026-09-03
---

## 8.1. Numeric Types (ဂဏန်း type များ)

- **8.1.1. Integer Types (ကိန်းပြည့် type များ)**
- **8.1.2. Arbitrary Precision Numbers (precision ကို လိုသလို သတ်မှတ်နိုင်သော ဂဏန်းများ)**
- **8.1.3. Floating-Point Types (floating-point type များ)**
- **8.1.4. Serial Types (serial type များ)**

Numeric type တွေမှာ — 2-byte, 4-byte နဲ့ 8-byte ရှိတဲ့ integer (ကိန်းပြည့်) တွေ၊ 4-byte နဲ့ 8-byte ရှိတဲ့ floating-point ဂဏန်းတွေ၊ ပြီးတော့ precision ရွေးချယ် သတ်မှတ်နိုင်တဲ့ decimal ဂဏန်းတွေ ပါဝင်ပါတယ်။ ရနိုင်တဲ့ type တွေကို [ဇယား 8.2](/docs/postgresql/datatype-numeric) မှာ စာရင်းပြထားပါတယ်။

**ဇယား 8.2. Numeric Types (ဂဏန်း type များ)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် | Range (အကွာအဝေး) |
| --- | --- | --- | --- |
| `smallint` | 2 bytes | range သေးငယ်သော integer | -32768 မှ +32767 |
| `integer` | 4 bytes | integer အတွက် ပုံမှန် ရွေးချယ်မှု | -2147483648 မှ +2147483647 |
| `bigint` | 8 bytes | range ကြီးမားသော integer | -9223372036854775808 မှ +9223372036854775807 |
| `decimal` | variable | user သတ်မှတ်နိုင်သော precision၊ အတိအကျ (exact) | ဒသမ (decimal point) ရှေ့မှာ ဂဏန်း 131072 လုံး အထိ; ဒသမ နောက်မှာ ဂဏန်း 16383 လုံး အထိ |
| `numeric` | variable | user သတ်မှတ်နိုင်သော precision၊ အတိအကျ (exact) | ဒသမ (decimal point) ရှေ့မှာ ဂဏန်း 131072 လုံး အထိ; ဒသမ နောက်မှာ ဂဏန်း 16383 လုံး အထိ |
| `real` | 4 bytes | precision ပြောင်းလဲနိုင်၊ အတိအကျ မဟုတ် (inexact) | decimal digit 6 လုံး precision |
| `double precision` | 8 bytes | precision ပြောင်းလဲနိုင်၊ အတိအကျ မဟုတ် (inexact) | decimal digit 15 လုံး precision |
| `smallserial` | 2 bytes | autoincrementing (အလိုအလျောက် တိုးသော) သေးငယ်သည့် integer | 1 မှ 32767 |
| `serial` | 4 bytes | autoincrementing (အလိုအလျောက် တိုးသော) integer | 1 မှ 2147483647 |
| `bigserial` | 8 bytes | autoincrementing (အလိုအလျောက် တိုးသော) ကြီးမားသည့် integer | 1 မှ 9223372036854775807 |

Numeric type တွေအတွက် constant တွေရဲ့ syntax ကို [အပိုင်း 4.1.2](/docs/postgresql/sql-syntax-lexical) မှာ ဖော်ပြထားပါတယ်။ Numeric type တွေမှာ သက်ဆိုင်ရာ arithmetic operator နဲ့ function တွေ အစုံအလင် ရှိပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အခန်း 9](https://www.postgresql.org/docs/current/functions.html) ကို ကြည့်ပါ။ အောက်က section တွေမှာ type တစ်ခုချင်းစီကို အသေးစိတ် ဖော်ပြသွားပါမယ်။

### 8.1.1. Integer Types (ကိန်းပြည့် type များ)

`smallint`, `integer` နဲ့ `bigint` type တွေက — fractional (အပိုင်းဂဏန်း) အစိတ်အပိုင်း မပါတဲ့ ကိန်းပြည့် (whole number) တွေကို range အမျိုးမျိုးနဲ့ သိမ်းဆည်းပေးပါတယ်။ ခွင့်ပြုထားတဲ့ range ပြင်ပက တန်ဖိုးတွေကို သိမ်းဆည်းဖို့ ကြိုးစားရင် error ဖြစ်ပါတယ်။

`integer` type က — range, storage size (သိမ်းဆည်းမှု အရွယ်အစား) နဲ့ performance (စွမ်းဆောင်ရည်) ကြားမှာ အကောင်းဆုံး မျှတမှု ရှိလို့ — ပုံမှန် ရွေးချယ်လေ့ ရှိပါတယ်။ `smallint` type ကိုတော့ ယေဘုယျအားဖြင့် disk space (သိုလှောင်နေရာ) အဖိုးတန်တဲ့ အခါမျိုးမှာပဲ သုံးပါတယ်။ `bigint` type ကတော့ `integer` type ရဲ့ range မလုံလောက်တဲ့ အခါမျိုးမှာ သုံးဖို့ ဒီဇိုင်း ထုတ်ထားတာပါ။

SQL standard မှာ integer type တွေဖြစ်တဲ့ `integer` (သို့မဟုတ် `int`), `smallint` နဲ့ `bigint` တို့ကိုပဲ သတ်မှတ်ပါတယ်။ `int2`, `int4` နဲ့ `int8` ဆိုတဲ့ type name တွေကတော့ extension (တိုးချဲ့ချက်) တွေ ဖြစ်ပြီး — တခြား SQL database system တချို့မှာလည်း သုံးကြပါတယ်။

### 8.1.2. Arbitrary Precision Numbers (precision ကို လိုသလို သတ်မှတ်နိုင်သော ဂဏန်းများ)

`numeric` type က ဂဏန်း နေရာ (digit) အများအပြား ပါဝင်တဲ့ တန်ဖိုးတွေကို သိမ်းဆည်းနိုင်ပါတယ်။ အထူးသဖြင့် — တိကျမှု (exactness) လိုအပ်တဲ့ ငွေကြေး ပမာဏတွေနဲ့ တခြား ပမာဏတွေကို သိမ်းဆည်းရာမှာ သုံးဖို့ အကြံပြုထားပါတယ်။ `numeric` တန်ဖိုးတွေနဲ့ တွက်ချက်မှုတွေက — ဖြစ်နိုင်တဲ့ နေရာတွေမှာ — ဥပမာ ပေါင်းခြင်း (addition), နုတ်ခြင်း (subtraction), မြှောက်ခြင်း (multiplication) — အတိအကျ (exact) ရလဒ်တွေကို ထုတ်ပေးပါတယ်။ ဒါပေမယ့် — `numeric` တန်ဖိုးတွေအပေါ် တွက်ချက်မှုတွေက integer type တွေ ဒါမှမဟုတ် နောက် section မှာ ဖော်ပြမယ့် floating-point type တွေနဲ့ ယှဉ်ရင် အရမ်း နှေးပါတယ်။

အောက်မှာ ဒီဝေါဟာရတွေကို သုံးပါမယ်: `numeric` တစ်ခုရဲ့ *precision* ဆိုတာ ဂဏန်းတန်ဖိုး တစ်ခုလုံးထဲမှာ ပါဝင်တဲ့ significant digits (အဓိပ္ပာယ် ရှိသော ဂဏန်းများ) ရဲ့ စုစုပေါင်း အရေအတွက် — ဆိုလိုတာက decimal point ရဲ့ ဘယ်ဘက်၊ ညာဘက် နှစ်ဖက်စလုံးက ဂဏန်း အရေအတွက်ပါ။ `numeric` တစ်ခုရဲ့ *scale* ဆိုတာကတော့ decimal point ရဲ့ ညာဘက် — fractional (အပိုင်းဂဏန်း) အပိုင်းထဲမှာ — ရှိတဲ့ decimal ဂဏန်း အရေအတွက် ဖြစ်ပါတယ်။ ဒါကြောင့် 23.5141 ဆိုတဲ့ ဂဏန်းမှာ precision 6 နဲ့ scale 4 ရှိပါတယ်။ Integer တွေကိုတော့ scale သုည ရှိတယ်လို့ သတ်မှတ်နိုင်ပါတယ်။

`numeric` column တစ်ခုရဲ့ အများဆုံး precision ရော အများဆုံး scale ကိုပါ configure (သတ်မှတ်) လုပ်နိုင်ပါတယ်။ `numeric` type ရဲ့ column တစ်ခုကို declare (ကြေညာ) လုပ်ဖို့ ဒီ syntax ကို သုံးပါ:

```sql
NUMERIC(precision, scale)
```

Precision က positive (အပေါင်းကိန်း) ဖြစ်ရပြီး — scale ကတော့ positive သို့မဟုတ် negative (အနှုတ်ကိန်း) ဖြစ်နိုင်ပါတယ် (အောက်မှာ ကြည့်ပါ)။ တနည်းအားဖြင့်:

```sql
NUMERIC(precision)
```

ဆိုရင် scale 0 ကို ရွေးချယ်လိုက်တာ ဖြစ်ပါတယ်။ ဒီလိုမျိုး သတ်မှတ်ရင်တော့:

```sql
NUMERIC
```

precision ရော scale ပါ မပါဘဲ သတ်မှတ်တာက — implementation (အကောင်အထည်ဖော်မှု) ရဲ့ ကန့်သတ်ချက်တွေအထိ — အလျား (length) ဘယ်လောက်ပဲ ရှိရှိ numeric တန်ဖိုးတွေကို သိမ်းဆည်းနိုင်တဲ့ “unconstrained numeric” (ကန့်သတ်ချက် မရှိသော numeric) column တစ်ခုကို ဖန်တီးပါတယ်။ ဒီလို column မျိုးက input တန်ဖိုးတွေကို ဘယ် သီးခြား scale တစ်ခုခုအဖြစ်မှ coerce (အတင်းပြောင်းလဲ) လုပ်မှာ မဟုတ်ပါဘူး — သတ်မှတ်ထားတဲ့ scale ရှိတဲ့ `numeric` column တွေကတော့ input တန်ဖိုးတွေကို အဲဒီ scale အဖြစ် coerce လုပ်ပါတယ်။ (SQL standard က default scale 0 ဖြစ်ဖို့ လိုအပ်ပါတယ် — ဆိုလိုတာက integer precision အဖြစ် coerce လုပ်တာပါ။ ဒါက နည်းနည်း အသုံးမဝင်ဘူးလို့ ကျွန်ုပ်တို့ ထင်ပါတယ်။ Portability (တခြား system တွေဆီ ရွှေ့ပြောင်း သုံးနိုင်မှု) အတွက် စိုးရိမ်နေရင် — precision နဲ့ scale ကို အမြဲတမ်း ရှင်းရှင်းလင်းလင်း (explicitly) သတ်မှတ်ပါ။)

> **မှတ်ချက်:** `numeric` type declaration (ကြေညာချက်) တစ်ခုမှာ explicit သတ်မှတ်နိုင်တဲ့ အများဆုံး precision က 1000 ပဲ ဖြစ်ပါတယ်။ Unconstrained `numeric` column တစ်ခုကတော့ [ဇယား 8.2](/docs/postgresql/datatype-numeric) မှာ ဖော်ပြထားတဲ့ ကန့်သတ်ချက်တွေရဲ့ အောက်မှာ ရှိပါတယ်။

သိမ်းဆည်းမယ့် တန်ဖိုးတစ်ခုရဲ့ scale က column ရဲ့ သတ်မှတ်ထားတဲ့ (declared) scale ထက် ကြီးနေရင် — system က တန်ဖိုးကို သတ်မှတ်ထားတဲ့ fractional digit (ဒသမ နောက်ကိန်း) အရေအတွက်အထိ round (ပတ်ဖြတ်) လုပ်ပါလိမ့်မယ်။ ပြီးတော့ — decimal point ရဲ့ ဘယ်ဘက်က ဂဏန်း အရေအတွက်က သတ်မှတ်ထားတဲ့ precision အနုတ် သတ်မှတ်ထားတဲ့ scale ထက် ကျော်လွန်နေရင် error တက်ပါတယ်။ ဥပမာ — ဒီလိုမျိုး declare လုပ်ထားတဲ့ column ဆိုရင်:

```sql
NUMERIC(3, 1)
```

ဒါက တန်ဖိုးတွေကို decimal တစ်နေရာ (1 decimal place) အထိ round လုပ်ပြီး — -99.9 ကနေ 99.9 အထိ — နှစ်ဖက်စလုံး အပါအဝင် (inclusive) — တန်ဖိုးတွေကို သိမ်းဆည်းနိုင်ပါတယ်။

PostgreSQL 15 ကစပြီး — negative scale ရှိတဲ့ `numeric` column တစ်ခုကို declare လုပ်ခွင့် ရှိပါတယ်။ အဲဒီအခါ တန်ဖိုးတွေကို decimal point ရဲ့ ဘယ်ဘက်မှာ round လုပ်ပါတယ်။ Precision ကတော့ round မလုပ်ရသေးတဲ့ (non-rounded) ဂဏန်း အများဆုံး အရေအတွက်ကို ကိုယ်စားပြုဆဲ ဖြစ်ပါတယ်။ ဒါကြောင့် ဒီလိုမျိုး declare လုပ်ထားတဲ့ column ဆိုရင်:

```sql
NUMERIC(2, -3)
```

ဒါက တန်ဖိုးတွေကို အနီးဆုံး ထောင်ဂဏန်း (nearest thousand) အထိ round လုပ်ပြီး — -99000 ကနေ 99000 အထိ — နှစ်ဖက်စလုံး အပါအဝင် — တန်ဖိုးတွေကို သိမ်းဆည်းနိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ precision ထက် ကြီးတဲ့ scale တစ်ခုကို declare လုပ်တာကိုလည်း ခွင့်ပြုပါတယ်။ ဒီလို column မျိုးက fractional (အပိုင်းဂဏန်း) တန်ဖိုးတွေကိုပဲ သိမ်းဆည်းနိုင်ပြီး — decimal point ရဲ့ ညာဘက် ချက်ချင်းမှာ ရှိတဲ့ သုည (zero) ဂဏန်း အရေအတွက်က သတ်မှတ်ထားတဲ့ scale အနုတ် သတ်မှတ်ထားတဲ့ precision ထက် အနည်းဆုံး များနေဖို့ လိုအပ်ပါတယ်။ ဥပမာ — ဒီလိုမျိုး declare လုပ်ထားတဲ့ column ဆိုရင်:

```sql
NUMERIC(3, 5)
```

ဒါက တန်ဖိုးတွေကို decimal ငါးနေရာ (5 decimal places) အထိ round လုပ်ပြီး — -0.00999 ကနေ 0.00999 အထိ — နှစ်ဖက်စလုံး အပါအဝင် — တန်ဖိုးတွေကို သိမ်းဆည်းနိုင်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL က `numeric` type declaration တစ်ခုထဲမှာ scale ကို -1000 ကနေ 1000 အတွင်း ဘယ်တန်ဖိုးမဆို ဖြစ်ခွင့် ပြုပါတယ်။ ဒါပေမယ့် SQL standard ကတော့ scale ကို 0 ကနေ `precision` အတွင်းမှာ ရှိဖို့ လိုအပ်ပါတယ်။ အဲဒီ range အပြင်ဘက်က scale တွေကို သုံးတာက တခြား database system တွေဆီ portable (ရွှေ့ပြောင်း သုံးနိုင်) မဖြစ်နိုင်ပါဘူး။

Numeric တန်ဖိုးတွေကို — ရှေ့ဆုံး သို့မဟုတ် နောက်ဆုံးမှာ ပိုလျှံနေတဲ့ (leading/trailing) သုညတွေ မပါဘဲ — ရုပ်ပိုင်းအရ သိမ်းဆည်းပါတယ်။ ဒါကြောင့် column တစ်ခုရဲ့ သတ်မှတ်ထားတဲ့ precision နဲ့ scale တွေက ပုံသေ နေရာချပေးထားမှု (fixed allocation) မဟုတ်ဘဲ — အများဆုံး ကန့်သတ်ချက်တွေ (maximums) ဖြစ်ပါတယ်။ (ဒီသဘောအရ — `numeric` type က `char(n)` ထက် `varchar(n)` နဲ့ ပိုနီးစပ်ပါတယ်။) တကယ့် သိုလှောင်မှု လိုအပ်ချက်ကတော့ decimal ဂဏန်း လေးလုံး (4 decimal digits) တစ်စုစီအတွက် 2 bytes နှုန်း ဖြစ်ပြီး — overhead အဖြစ် 3 ကနေ 8 bytes ထပ်ပေါင်းပါတယ်။

သာမန် numeric တန်ဖိုးတွေအပြင် — `numeric` type မှာ special value (အထူး တန်ဖိုး) တွေ အများအပြား ရှိပါသေးတယ်:

`Infinity`

`-Infinity`

`NaN`

ဒါတွေက IEEE 754 standard ကနေ လိုက်လျောညီထွေ ပြုပြင် ယူထားတာတွေ ဖြစ်ပြီး — အသီးသီး “infinity” (အဆုံးမဲ့), “negative infinity” (အနှုတ် အဆုံးမဲ့) နဲ့ “not-a-number” (ဂဏန်း မဟုတ်သော တန်ဖိုး) တို့ကို ကိုယ်စားပြုပါတယ်။ ဒီတန်ဖိုးတွေကို SQL command တစ်ခုထဲမှာ constant အဖြစ် ရေးတဲ့အခါ — quote တွေနဲ့ ဝိုင်းထားရပါမယ် — ဥပမာ `UPDATE table SET x = '-Infinity'` လိုမျိုးပါ။ Input လုပ်တဲ့အခါ — ဒီ string တွေကို case-insensitive (စာလုံးကြီး/သေး ခွဲခြားမှု မရှိ) ပုံစံနဲ့ မှတ်မိပါတယ်။ Infinity တန်ဖိုးတွေကို `inf` နဲ့ `-inf` လို့လည်း တစ်မျိုး ရေးလို့ ရပါတယ်။

Infinity တန်ဖိုးတွေက သင်္ချာ မျှော်လင့်ချက်တွေအတိုင်းပဲ ပြုမူပါတယ်။ ဥပမာ — `Infinity` ကို ဘယ် finite (အကန့်အသတ် ရှိသော) တန်ဖိုးနဲ့မဆို ပေါင်းရင် `Infinity` ရပြီး — `Infinity` အချင်းချင်း ပေါင်းရင်လည်း `Infinity` ပါပဲ; ဒါပေမယ့် `Infinity` အနုတ် `Infinity` ကတော့ — ကောင်းစွာ သတ်မှတ်ထားတဲ့ (well-defined) အဓိပ္ပာယ် မရှိလို့ — `NaN` (not a number) ကို ထုတ်ပေးပါတယ်။ Infinity တစ်ခုကို — ၎င်းက အကန့်အသတ် ရှိတဲ့ precision ကန့်သတ်ချက် အားလုံးကို သဘောအရ ကျော်လွန်နေလို့ — unconstrained `numeric` column ထဲမှာပဲ သိမ်းဆည်းလို့ ရတယ်ဆိုတာ သတိပြုပါ။

`NaN` (not a number) တန်ဖိုးကို သတ်မှတ်မထားတဲ့ (undefined) တွက်ချက်မှု ရလဒ်တွေကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ ယေဘုယျအားဖြင့် — `NaN` input တစ်ခု ပါဝင်တဲ့ ဘယ် operation မဆို နောက် `NaN` တစ်ခုကိုပဲ ထုတ်ပေးပါတယ်။ ခြွင်းချက် တစ်ခုတည်းကတော့ — operation ရဲ့ တခြား input တွေက `NaN` နေရာမှာ ဘယ် finite သို့မဟုတ် infinite numeric တန်ဖိုး အစားထိုးထားရင်တောင် output အတူတူပဲ ရမယ့် အခြေအနေမျိုး ဖြစ်နေရင် ပါ — အဲဒီအခါ အဲဒီ output တန်ဖိုးကိုပဲ `NaN` အတွက်ပါ သုံးပါတယ်။ (ဒီနိယာမရဲ့ ဥပမာ တစ်ခုက — `NaN` ကို သုည ထပ်ကိန်း (zero power) တင်ရင် 1 ရတာပါ။)

> **မှတ်ချက်:** “not-a-number” သဘောတရားရဲ့ implementation အများစုမှာ — `NaN` က (`NaN` အပါအဝင်) တခြား ဘယ် numeric တန်ဖိုးနဲ့မှ တူညီတယ်လို့ မသတ်မှတ်ပါဘူး။ `numeric` တန်ဖိုးတွေကို sort လုပ်ပြီး tree-based index တွေမှာ သုံးနိုင်အောင် — PostgreSQL ကတော့ `NaN` တန်ဖိုးတွေကို တစ်ခုနဲ့တစ်ခု တူညီပြီး — `NaN` မဟုတ်တဲ့ တန်ဖိုး အားလုံးထက် ကြီးတယ်လို့ သတ်မှတ်ပါတယ်။

`decimal` နဲ့ `numeric` type တွေက ညီမျှပါတယ်။ Type နှစ်ခုစလုံးက SQL standard ရဲ့ အစိတ်အပိုင်း ဖြစ်ပါတယ်။

တန်ဖိုးတွေကို round လုပ်တဲ့အခါ — `numeric` type က tie (နှစ်ဖက် ညီတူညီမျှ ဖြစ်နေသော တန်ဖိုး) တွေကို သုညကနေ ဝေးရာဘက်ကို (away from zero) round လုပ်ပြီး — (machine အများစုမှာ) `real` နဲ့ `double precision` type တွေကတော့ tie တွေကို အနီးဆုံး စုံကိန်း (nearest even number) ဆီ round လုပ်ပါတယ်။ ဥပမာ:

```sql
SELECT x,
  round(x::numeric) AS num_round,
  round(x::double precision) AS dbl_round
FROM generate_series(-3.5, 3.5, 1) as x;
  x   | num_round | dbl_round
------+-----------+-----------
 -3.5 |        -4 |        -4
 -2.5 |        -3 |        -2
 -1.5 |        -2 |        -2
 -0.5 |        -1 |        -0
  0.5 |         1 |         0
  1.5 |         2 |         2
  2.5 |         3 |         2
  3.5 |         4 |         4
(8 rows)
```

### 8.1.3. Floating-Point Types (floating-point type များ)

`real` နဲ့ `double precision` data types တွေက — inexact (အတိအကျ မဟုတ်သော), variable-precision (precision ပြောင်းလဲနိုင်သော) numeric types တွေ ဖြစ်ပါတယ်။ လက်ရှိ ထောက်ပံ့ထားတဲ့ platform တွေ အားလုံးမှာ — ဒီ types တွေက Binary Floating-Point Arithmetic (binary floating-point ဂဏန်းသင်္ချာ) အတွက် IEEE Standard 754 ရဲ့ implementations တွေ ဖြစ်ပါတယ် (single နဲ့ double precision အသီးသီး) — အောက်ခံ processor, operating system နဲ့ compiler တွေက ထောက်ပံ့သလောက် ဖြစ်ပါတယ်။

Inexact ဆိုတာ — တန်ဖိုး တချို့ကို အတွင်းပိုင်း format အဖြစ် အတိအကျ ပြောင်းလို့ မရဘဲ — approximation (အနီးစပ်ဆုံး တန်ဖိုး) အနေနဲ့ သိမ်းဆည်းခံရလို့ — တန်ဖိုးတစ်ခုကို သိမ်းပြီး ပြန်ထုတ်ကြည့်ရင် နည်းနည်း ကွဲလွဲမှု (discrepancy) တွေ ပေါ်နိုင်တာကို ဆိုလိုပါတယ်။ ဒီ error တွေကို စီမံခန့်ခွဲတာနဲ့ ၎င်းတို့ တွက်ချက်မှုတွေထဲ ဘယ်လို ပျံ့နှံ့သွားတာက သင်္ချာနဲ့ ကွန်ပျူတာ သိပ္ပံရဲ့ ဘာသာရပ်ခွဲ တစ်ခုလုံး ဖြစ်လို့ — အောက်က အချက်တွေကလွဲရင် — ဒီမှာ ဆွေးနွေးမှာ မဟုတ်ပါဘူး:

- တိကျတဲ့ (exact) သိုလှောင်မှုနဲ့ တွက်ချက်မှုတွေ လိုအပ်ရင် (ဥပမာ ငွေကြေး ပမာဏတွေအတွက်) — အဲဒီအစား `numeric` type ကို သုံးပါ။
- ဒီ types တွေနဲ့ အရေးကြီးတဲ့ ကိစ္စတစ်ခုခုအတွက် ရှုပ်ထွေးတဲ့ တွက်ချက်မှုတွေ လုပ်ချင်ရင် — အထူးသဖြင့် boundary case (အစွန်းရောက် အခြေအနေ) တွေမှာ (infinity, underflow) တချို့ အပြုအမူတွေကို အားကိုးနေရင် — implementation ကို သေချာ အကဲဖြတ် (evaluate) သင့်ပါတယ်။
- Floating-point တန်ဖိုး နှစ်ခု တူညီမှု (equality) ရှိမရှိ နှိုင်းယှဉ်တာက မျှော်လင့်ထားသလို အမြဲတမ်း အလုပ် မဖြစ်နိုင်ပါဘူး။

လက်ရှိ ထောက်ပံ့ထားတဲ့ platform တွေ အားလုံးမှာ — `real` type ရဲ့ range က 1E-37 ကနေ 1E+37 ဝန်းကျင် ဖြစ်ပြီး — precision က အနည်းဆုံး decimal digit 6 လုံး ရှိပါတယ်။ `double precision` type ရဲ့ range ကတော့ 1E-307 ကနေ 1E+308 ဝန်းကျင် ဖြစ်ပြီး — precision က အနည်းဆုံး digit 15 လုံး ရှိပါတယ်။ အရမ်း ကြီးတဲ့ သို့မဟုတ် အရမ်း သေးတဲ့ တန်ဖိုးတွေဆိုရင် error ဖြစ်ပါတယ်။ Input ဂဏန်းတစ်ခုရဲ့ precision က အရမ်း မြင့်နေရင် rounding (ပတ်ဖြတ်ခြင်း) ဖြစ်နိုင်ပါတယ်။ သုညနဲ့ အရမ်း နီးကပ်နေပြီး — သုညနဲ့ ခွဲခြားလို့ မရတဲ့ — ဂဏန်းတွေဆိုရင် underflow error ဖြစ်ပါတယ်။

ပုံမှန်အားဖြင့် — floating point တန်ဖိုးတွေကို text ပုံစံနဲ့ output လုပ်တဲ့အခါ — ၎င်းတို့ရဲ့ အကျဉ်းဆုံး ဖြစ်ပြီး တိကျတဲ့ (shortest precise) decimal representation နဲ့ ထုတ်ပေးပါတယ်; ထုတ်လိုက်တဲ့ decimal တန်ဖိုးက — တူညီတဲ့ binary precision ထဲမှာ ကိုယ်စားပြုလို့ ရတဲ့ တခြား တန်ဖိုး တိုင်းထက် — အမှန်တကယ် သိမ်းထားတဲ့ binary တန်ဖိုးနဲ့ ပိုနီးစပ်ပါတယ်။ (ဒါပေမယ့် — လောလောဆယ် output တန်ဖိုးက ကိုယ်စားပြုလို့ ရတဲ့ တန်ဖိုး နှစ်ခုရဲ့ အတိအကျ အလယ်မှာ ဘယ်တော့မှ မဖြစ်ပါဘူး — အကြောင်းကတော့ input routine တွေက round-to-nearest-even စည်းမျဉ်းကို သင့်လျော်စွာ လိုက်နာမှု မရှိတဲ့ နေရာအနှံ့ ဖြစ်နေတဲ့ bug တစ်ခုကို ရှောင်ဖို့ပါ။) ဒီတန်ဖိုးက `float8` တန်ဖိုးတွေအတွက် အများဆုံး significant decimal digit 17 လုံး၊ `float4` တန်ဖိုးတွေအတွက်တော့ အများဆုံး digit 9 လုံး အသုံးပြုပါလိမ့်မယ်။

> **မှတ်ချက်:** ဒီ shortest-precise output format က သမိုင်းဝင် rounded format ထက် ထုတ်လုပ်ဖို့ အများကြီး ပိုမြန်ပါတယ်။

PostgreSQL ဗားရှင်း အဟောင်းတွေက ထုတ်ပေးတဲ့ output တွေနဲ့ လိုက်ဖက်ညီမှု (compatibility) ရဖို့ — ပြီးတော့ output precision ကို လျှော့ချခွင့် ပြုဖို့ — [extra_float_digits](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-EXTRA-FLOAT-DIGITS) parameter ကို သုံးပြီး အစား rounded decimal output ကို ရွေးချယ်နိုင်ပါတယ်။ တန်ဖိုး 0 သတ်မှတ်ရင် — တန်ဖိုးကို (`float4` အတွက်) 6 သို့မဟုတ် (`float8` အတွက်) 15 significant decimal digit အထိ round လုပ်တဲ့ — အရင်က default အတိုင်း ပြန်ဖြစ်သွားပါတယ်။ Negative တန်ဖိုး သတ်မှတ်ရင် digit အရေအတွက်ကို ပိုပြီး လျှော့ချပါတယ်; ဥပမာ -2 ဆိုရင် output ကို အသီးသီး digit 4 သို့မဟုတ် 13 အထိ round လုပ်ပါလိမ့်မယ်။

[extra_float_digits](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-EXTRA-FLOAT-DIGITS) ရဲ့ တန်ဖိုး 0 ထက် ကြီးတာတွေက shortest-precise format ကို ရွေးချယ်ပါတယ်။

> **မှတ်ချက်:** တိကျတဲ့ တန်ဖိုးတွေ လိုချင်တဲ့ application တွေက — သမိုင်းအရ — [extra_float_digits](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-EXTRA-FLOAT-DIGITS) ကို 3 လို့ သတ်မှတ်မှသာ အဲဒီတန်ဖိုးတွေကို ရခဲ့ပါတယ်။ Version တွေကြား အများဆုံး compatibility ရဖို့ — ဆက်ပြီး အဲဒီလိုပဲ လုပ်သင့်ပါတယ်။

သာမန် numeric တန်ဖိုးတွေအပြင် — floating-point types တွေမှာလည်း special value (အထူး တန်ဖိုး) တွေ အများအပြား ရှိပါသေးတယ်:

`Infinity`

`-Infinity`

`NaN`

ဒါတွေက IEEE 754 ရဲ့ special value တွေဖြစ်တဲ့ “infinity” (အဆုံးမဲ့), “negative infinity” (အနှုတ် အဆုံးမဲ့) နဲ့ “not-a-number” (ဂဏန်း မဟုတ်သော တန်ဖိုး) တို့ကို အသီးသီး ကိုယ်စားပြုပါတယ်။ ဒီတန်ဖိုးတွေကို SQL command တစ်ခုထဲမှာ constant အဖြစ် ရေးတဲ့အခါ — quote တွေနဲ့ ဝိုင်းထားရပါမယ် — ဥပမာ `UPDATE table SET x = '-Infinity'` လိုမျိုးပါ။ Input လုပ်တဲ့အခါ — ဒီ string တွေကို case-insensitive (စာလုံးကြီး/သေး ခွဲခြားမှု မရှိ) ပုံစံနဲ့ မှတ်မိပါတယ်။ Infinity တန်ဖိုးတွေကို `inf` နဲ့ `-inf` လို့လည်း တစ်မျိုး ရေးလို့ ရပါတယ်။

> **မှတ်ချက်:** IEEE 754 က `NaN` ကို (`NaN` အပါအဝင်) တခြား ဘယ် floating-point တန်ဖိုးနဲ့မှ တူညီတယ်လို့ နှိုင်းယှဉ် မရဘူးလို့ သတ်မှတ်ပါတယ်။ Floating-point တန်ဖိုးတွေကို sort လုပ်ပြီး tree-based index တွေမှာ သုံးနိုင်အောင် — PostgreSQL ကတော့ `NaN` တန်ဖိုးတွေကို တစ်ခုနဲ့တစ်ခု တူညီပြီး — `NaN` မဟုတ်တဲ့ တန်ဖိုး အားလုံးထက် ကြီးတယ်လို့ သတ်မှတ်ပါတယ်။

PostgreSQL က inexact numeric type တွေကို သတ်မှတ်ဖို့အတွက် SQL-standard notation တွေဖြစ်တဲ့ `float` နဲ့ `float(p)` တွေကိုလည်း ထောက်ပံ့ပါတယ်။ ဒီမှာ `p` က binary digit တွေနဲ့ တိုင်းတဲ့ အနည်းဆုံး လက်ခံနိုင်တဲ့ precision ကို သတ်မှတ်ပါတယ်။ PostgreSQL က `float(1)` ကနေ `float(24)` အထိကို `real` type ကို ရွေးချယ်တာအဖြစ် လက်ခံပြီး — `float(25)` ကနေ `float(53)` အထိကတော့ `double precision` ကို ရွေးချယ်ပါတယ်။ ခွင့်ပြုထားတဲ့ range ပြင်ပက `p` တန်ဖိုးတွေဆိုရင် error ဖြစ်ပါတယ်။ Precision သတ်မှတ်မထားတဲ့ `float` ကိုတော့ `double precision` လို့ သဘောမှတ်ပါတယ်။

### 8.1.4. Serial Types (serial type များ)

> **မှတ်ချက်:** ဒီ section က autoincrementing column (အလိုအလျောက် တိုးနေသော column) တစ်ခု ဖန်တီးဖို့ PostgreSQL မှာပဲ ရှိတဲ့ နည်းလမ်း တစ်ခုကို ဖော်ပြပါတယ်။ နောက်ထပ် နည်းလမ်း တစ်ခုကတော့ — [အပိုင်း 5.3](/docs/postgresql/ddl-identity-columns) မှာ ဖော်ပြထားတဲ့ — SQL-standard identity column feature ကို သုံးတာပဲ ဖြစ်ပါတယ်။

`smallserial`, `serial` နဲ့ `bigserial` data types တွေက type အစစ်တွေ မဟုတ်ဘဲ — unique identifier column (ထူးခြားသော identifier column) တွေ ဖန်တီးရာမှာ လွယ်ကူစေဖို့အတွက် notation (ရေးသားမှု ပုံစံ) သက်သက် ဖြစ်ပါတယ် (တခြား database တချို့က ထောက်ပံ့တဲ့ `AUTO_INCREMENT` property နဲ့ ဆင်တူပါတယ်)။ လက်ရှိ implementation မှာ — ဒီလိုမျိုး သတ်မှတ်တာက:

```sql
CREATE TABLE tablename (
    colname SERIAL
);
```

ဒါက ဒီလိုမျိုး သတ်မှတ်တာနဲ့ ညီမျှပါတယ်:

```sql
CREATE SEQUENCE tablename_colname_seq AS integer;
CREATE TABLE tablename (
    colname integer NOT NULL DEFAULT nextval('tablename_colname_seq')
);
ALTER SEQUENCE tablename_colname_seq OWNED BY tablename.colname;
```

ဒါဆိုရင် — integer column တစ်ခု ဖန်တီးပြီး — ၎င်းရဲ့ default တန်ဖိုးတွေကို sequence generator (အစဉ်လိုက် တန်ဖိုး ထုတ်ပေးသည့် ကိရိယာ) ကနေ သတ်မှတ်ပေးဖို့ စီစဉ်လိုက်တာ ဖြစ်ပါတယ်။ null တန်ဖိုး ထည့်သွင်းလို့ မရအောင် — `NOT NULL` constraint တစ်ခုကို သက်ရောက်စေပါတယ်။ (အများစုမှာ — duplicate (ထပ်နေသော) တန်ဖိုးတွေ မတော်တဆ ထည့်မိမှာ ကာကွယ်ဖို့ — `UNIQUE` သို့မဟုတ် `PRIMARY KEY` constraint တစ်ခုကိုလည်း တွဲထည့်ချင်ကြပါလိမ့်မယ် — ဒါပေမယ့် အဲဒါက အလိုအလျောက် မဟုတ်ပါဘူး။) နောက်ဆုံးအနေနဲ့ — column သို့မဟုတ် table ကို drop လုပ်လိုက်ရင် — sequence ကိုပါ အတူ drop ဖြစ်စေဖို့ — sequence ကို column ရဲ့ “owned by” (ပိုင်ဆိုင်သည်) အဖြစ် မှတ်သားထားပါတယ်။

> **မှတ်ချက်:** `smallserial`, `serial` နဲ့ `bigserial` တွေကို sequence တွေသုံးပြီး implement လုပ်ထားလို့ — row တွေ ဘယ်တော့မှ delete မလုပ်ရဘူးဆိုတောင် — column ထဲမှာ ပေါ်လာတဲ့ တန်ဖိုး အစဉ်အတန်းထဲမှာ “holes” (အပေါက်) သို့မဟုတ် gap (ကွက်လပ်) တွေ ရှိနိုင်ပါတယ်။ Sequence ကနေ ခွဲဝေလိုက်တဲ့ တန်ဖိုး တစ်ခုက — အဲဒီတန်ဖိုး ပါဝင်တဲ့ row ကို table column ထဲကို အောင်မြင်စွာ ထည့်သွင်းနိုင်ခဲ့ခြင်း မရှိရင်တောင် — “used up” (သုံးပြီးသား) ဖြစ်နေဆဲပါ။ ဥပမာ — insert လုပ်နေတဲ့ transaction က roll back ဖြစ်သွားရင် ဒီလို ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 9.17](/docs/postgresql/functions-sequence) ထဲက `nextval()` ကို ကြည့်ပါ။

`serial` column ထဲကို sequence ရဲ့ နောက်တန်ဖိုး ထည့်သွင်းဖို့ — `serial` column ကို ၎င်းရဲ့ default တန်ဖိုး သတ်မှတ်ပေးဖို့ သတ်မှတ်ပါ။ ဒါကို `INSERT` statement ထဲက column စာရင်းကနေ အဲဒီ column ကို ဖယ်ထုတ်ပြီး တစ်နည်း — ဒါမှမဟုတ် `DEFAULT` key word ကို သုံးပြီး တစ်နည်း — လုပ်နိုင်ပါတယ်။

`serial` နဲ့ `serial4` type name တွေက ညီမျှပါတယ်: နှစ်ခုစလုံးက `integer` column တွေကို ဖန်တီးပါတယ်။ `bigserial` နဲ့ `serial8` type name တွေကလည်း — `bigint` column တစ်ခုကို ဖန်တီးတာကလွဲရင် — အလားတူပဲ အလုပ်လုပ်ပါတယ်။ Table ရဲ့ သက်တမ်း တစ်လျှောက်လုံးမှာ identifier 2^31 ခု ထက်ပို သုံးဖို့ မျှော်လင့်ထားရင် `bigserial` ကို သုံးသင့်ပါတယ်။ `smallserial` နဲ့ `serial2` type name တွေကလည်း — `smallint` column တစ်ခုကို ဖန်တီးတာကလွဲရင် — အလားတူပဲ အလုပ်လုပ်ပါတယ်။

`serial` column တစ်ခုအတွက် ဖန်တီးထားတဲ့ sequence က — ပိုင်ဆိုင်တဲ့ (owning) column ကို drop လုပ်လိုက်တဲ့အခါ — အလိုအလျောက် အတူ drop ဖြစ်ပါတယ်။ Column ကို မဖျက်ဘဲ sequence ကိုပဲ သီးသန့် drop လုပ်လို့လည်း ရပါတယ် — ဒါပေမယ့် အဲဒါက column ရဲ့ default expression ကို ဖယ်ရှားလိုက်တာမျိုး အတင်းအကျပ် ဖြစ်စေပါလိမ့်မယ်။
