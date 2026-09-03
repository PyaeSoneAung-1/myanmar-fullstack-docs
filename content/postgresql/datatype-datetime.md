---
title: "Date/Time Types (ရက်စွဲ/အချိန် type များ)"
description: "PostgreSQL ရဲ့ date/time data type များ — timestamp, date, time, interval type တွေ၊ date/time input/output ပုံစံများ၊ special values (အထူး တန်ဖိုးများ) နဲ့ time zone (အချိန်ဇုန်) ကိုင်တွယ်ပုံ"
order: 52
source: "https://www.postgresql.org/docs/current/datatype-datetime.html"
status: translated
updated: 2026-09-03
---

## 8.5. Date/Time Types (ရက်စွဲ/အချိန် type များ)

- **8.5.1. Date/Time Input (ရက်စွဲ/အချိန် input)**
- **8.5.2. Date/Time Output (ရက်စွဲ/အချိန် output)**
- **8.5.3. Time Zones (အချိန်ဇုန်များ)**
- **8.5.4. Interval Input (interval input)**
- **8.5.5. Interval Output (interval output)**

PostgreSQL က SQL ရဲ့ date နဲ့ time type အစုအဝေး အပြည့်အစုံကို ထောက်ပံ့ပါတယ် — [ဇယား 8.9](/docs/postgresql/datatype-datetime) မှာ ပြထားပါတယ်။ ဒီ data type တွေပေါ်မှာ ရနိုင်တဲ့ operation တွေကို [အပိုင်း 9.9](https://www.postgresql.org/docs/current/functions-datetime.html) မှာ ဖော်ပြထားပါတယ်။ ရက်စွဲတွေကို Gregorian calendar (ဂရီဂေါရီးယန်း ပြက္ခဒိန်) အရ ရေတွက်ပါတယ် — အဲဒီ ပြက္ခဒိန် မပေါ်သေးတဲ့ နှစ်တွေအတွက်တောင် ဖြစ်ပါတယ် (အသေးစိတ်အတွက် [အပိုင်း B.6](https://www.postgresql.org/docs/current/datetime-units-history.html) ကို ကြည့်ပါ)။

**ဇယား 8.9. Date/Time Types (ရက်စွဲ/အချိန် type များ)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် | အနိမ့်ဆုံး တန်ဖိုး | အမြင့်ဆုံး တန်ဖိုး | Resolution |
| --- | --- | --- | --- | --- | --- |
| `timestamp [ (p) ] [ without time zone ]` | 8 bytes | ရက်စွဲနဲ့ အချိန် နှစ်မျိုးလုံး (time zone မပါ) | 4713 BC | 294276 AD | 1 microsecond |
| `timestamp [ (p) ] with time zone` | 8 bytes | ရက်စွဲနဲ့ အချိန် နှစ်မျိုးလုံး — time zone ပါ | 4713 BC | 294276 AD | 1 microsecond |
| `date` | 4 bytes | ရက်စွဲ (နေ့အချိန် မပါ) | 4713 BC | 5874897 AD | 1 day |
| `time [ (p) ] [ without time zone ]` | 8 bytes | နေ့အချိန် (ရက်စွဲ မပါ) | 00:00:00 | 24:00:00 | 1 microsecond |
| `time [ (p) ] with time zone` | 12 bytes | နေ့အချိန် (ရက်စွဲ မပါ) — time zone ပါ | 00:00:00+1559 | 24:00:00-1559 | 1 microsecond |
| `interval [ fields ] [ (p) ]` | 16 bytes | အချိန် ကာလပိုင်းခြား (time interval) | -178000000 years | 178000000 years | 1 microsecond |

> **မှတ်ချက်:** SQL standard အရ — `timestamp` လို့ပဲ ရေးရင် `timestamp without time zone` နဲ့ ညီမျှရမှာ ဖြစ်ပြီး — PostgreSQL က အဲဒီ အပြုအမူကို လိုက်နာပါတယ်။ `timestamptz` ကို `timestamp with time zone` ရဲ့ အတိုကောက်အဖြစ် လက်ခံပါတယ် — ဒါက PostgreSQL extension (PostgreSQL မှာပဲ ပါတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခုပါ။

`time`, `timestamp` နဲ့ `interval` တို့က optional precision (တိကျမှု အဆင့်) တန်ဖိုး `p` ကို လက်ခံပြီး — ၎င်းက seconds field (စက္ကန့် နေရာ) မှာ ထိန်းသိမ်းထားမယ့် ဒသမ ကိန်းဂဏန်း (fractional digit) အရေအတွက်ကို သတ်မှတ်ပါတယ်။ Default အရတော့ precision ပေါ်မှာ ရှင်းလင်းတဲ့ ကန့်သတ်ချက် မရှိပါဘူး။ `p` ရဲ့ ခွင့်ပြုထားတဲ့ အကွာအဝေးက 0 ကနေ 6 အထိ ဖြစ်ပါတယ်။

`interval` type မှာ ထပ်ဆောင်း option တစ်ခု ရှိပါတယ် — အောက်ပါ phrase တွေထဲက တစ်ခု ရေးပြီး သိမ်းဆည်းမယ့် field အစုကို ကန့်သတ်နိုင်ပါတယ်:

```sql
YEAR
MONTH
DAY
HOUR
MINUTE
SECOND
YEAR TO MONTH
DAY TO HOUR
DAY TO MINUTE
DAY TO SECOND
HOUR TO MINUTE
HOUR TO SECOND
MINUTE TO SECOND
```

`fields` ရော `p` ပါ သတ်မှတ်ထားရင် — precision က seconds ပေါ်မှာပဲ သက်ရောက်လို့ — `fields` ထဲမှာ `SECOND` ပါဝင်ရမယ်ဆိုတာ သတိပြုပါ။

`time with time zone` type ကို SQL standard မှာ သတ်မှတ်ထားပေမယ့် — အဲဒီ သတ်မှတ်ချက်မှာ အသုံးဝင်မှု သံသယဖြစ်စရာ ဂုဏ်သတ္တိတွေ ပါဝင်နေပါတယ်။ အများစုမှာ — `date`, `time`, `timestamp without time zone` နဲ့ `timestamp with time zone` တို့ရဲ့ ပေါင်းစပ်မှုက — application တစ်ခုခု လိုအပ်တဲ့ date/time လုပ်ဆောင်ချက် အကွာအဝေး အပြည့်အစုံကို ဖြည့်ဆည်းပေးနိုင်ပါတယ်။

### 8.5.1. Date/Time Input (ရက်စွဲ/အချိန် input)

Date နဲ့ time input တွေကို — ISO 8601, SQL-compatible, ရိုးရာ POSTGRES စတဲ့ — ကျိုးကြောင်းဆီလျော်တဲ့ ပုံစံ တွေထဲက နီးပါး အားလုံးမှာ လက်ခံပါတယ်။ ပုံစံ တချို့မှာ date input ထဲက day, month နဲ့ year တို့ရဲ့ အစဉ်က မရှင်းလင်းတတ်လို့ — ဒီ field တွေရဲ့ မျှော်လင့်ထားတဲ့ အစဉ်ကို သတ်မှတ်ပေးဖို့ ထောက်ပံ့ပေးထားပါတယ်။ [DateStyle](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DATESTYLE) parameter ကို — month-day-year အဓိပ္ပာယ်ဖွင့်ဆိုမှုအတွက် `MDY`, day-month-year အဓိပ္ပာယ်ဖွင့်ဆိုမှုအတွက် `DMY`, year-month-day အဓိပ္ပာယ်ဖွင့်ဆိုမှုအတွက် `YMD` — စသဖြင့် သတ်မှတ်နိုင်ပါတယ်။

PostgreSQL က date/time input တွေကို ကိုင်တွယ်ရာမှာ SQL standard လိုအပ်တာထက် ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ရှိပါတယ်။ Date/time input ရဲ့ တိကျတဲ့ parsing (ခွဲခြမ်းဖတ်ခြင်း) စည်းမျဉ်းတွေနဲ့ — months, days of the week (ရက်သတ္တပတ်၏ ရက်များ), time zones အပါအဝင် — အသိအမှတ်ပြုထားတဲ့ text field တွေအတွက် [နောက်ဆက်တွဲ B](https://www.postgresql.org/docs/current/datetime-appendix.html) ကို ကြည့်ပါ။

Date သို့မဟုတ် time literal input တိုင်းကို — text string တွေလိုပဲ — single quote (`'`) တွေနဲ့ ဝိုင်းရံထားရမယ်ဆိုတာ သတိရပါ။ အသေးစိတ်အတွက် [အပိုင်း 4.1.2.7](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။ SQL က အောက်ပါ syntax လိုအပ်ပါတယ်:

```sql
type [ (p) ] 'value'
```

ဒီမှာ `p` က seconds field ထဲက ဒသမ ကိန်းဂဏန်း အရေအတွက်ကို ပေးတဲ့ optional precision specification တစ်ခု ဖြစ်ပါတယ်။ Precision ကို `time`, `timestamp` နဲ့ `interval` type တွေအတွက် သတ်မှတ်လို့ ရပြီး — 0 ကနေ 6 အထိ ရှိနိုင်ပါတယ်။ Constant specification ထဲမှာ precision သတ်မှတ်မထားရင် — literal value ရဲ့ precision ကို default အနေနဲ့ ယူပါတယ် (ဒါပေမယ့် 6 digits ထက် မပိုပါဘူး)။

#### 8.5.1.1. Dates (ရက်စွဲများ)

[ဇယား 8.10](/docs/postgresql/datatype-datetime) က `date` type အတွက် ဖြစ်နိုင်တဲ့ input ဥပမာ တချို့ကို ပြပါတယ်။

**ဇယား 8.10. Date Input (ရက်စွဲ input)**

| ဥပမာ | ဖော်ပြချက် |
| --- | --- |
| 1999-01-08 | ISO 8601; mode မရွေး January 8 (အကြံပြုထားသော ပုံစံ) |
| January 8, 1999 | `datestyle` input mode တိုင်းမှာ ရှင်းလင်းပြတ်သား |
| 1/8/1999 | `MDY` mode မှာ January 8; `DMY` mode မှာ August 1 |
| 1/18/1999 | `MDY` mode မှာ January 18; တခြား mode တွေမှာ ပယ်ချခံရ |
| 01/02/03 | `MDY` mode မှာ January 2, 2003; `DMY` mode မှာ February 1, 2003; `YMD` mode မှာ February 3, 2001 |
| 1999-Jan-08 | mode မရွေး January 8 |
| Jan-08-1999 | mode မရွေး January 8 |
| 08-Jan-1999 | mode မရွေး January 8 |
| 99-Jan-08 | `YMD` mode မှာ January 8 — မဟုတ်ရင် error |
| 08-Jan-99 | `YMD` mode မှာ error ဖြစ်တာကလွဲလို့ January 8 |
| Jan-08-99 | `YMD` mode မှာ error ဖြစ်တာကလွဲလို့ January 8 |
| 19990108 | ISO 8601; mode မရွေး January 8, 1999 |
| 990108 | ISO 8601; mode မရွေး January 8, 1999 |
| 1999.008 | နှစ် နဲ့ တစ်နှစ်တာ ရက်မြောက် (day of year) |
| J2451187 | Julian date (ဂျူလီယန် ရက်စွဲ) |
| January 8, 99 BC | ဘီစီ (BC) 99 ခုနှစ် |

#### 8.5.1.2. Times (နေ့အချိန်များ)

နေ့အချိန် (time-of-day) type တွေကတော့ `time [ (p) ] without time zone` နဲ့ `time [ (p) ] with time zone` ဖြစ်ပါတယ်။ `time` တစ်ခုတည်းက `time without time zone` နဲ့ ညီမျှပါတယ်။

ဒီ type တွေအတွက် valid input ကတော့ — နေ့အချိန် တစ်ခု နဲ့ ၎င်းနောက်မှာ optional time zone တစ်ခု ပါဝင်ပါတယ်။ ([ဇယား 8.11](/docs/postgresql/datatype-datetime) နဲ့ [ဇယား 8.12](/docs/postgresql/datatype-datetime) ကို ကြည့်ပါ။) `time without time zone` အတွက် input ထဲမှာ time zone သတ်မှတ်ထားရင်တောင် — အဲဒါကို တိတ်တဆိတ် လျစ်လျူရှုပါတယ်။ Date တစ်ခုကိုလည်း သတ်မှတ်လို့ ရပေမယ့် — `America/New_York` လို daylight-savings စည်းမျဉ်း ပါဝင်တဲ့ time zone နာမည် သုံးတဲ့အခါကလွဲလို့ — လျစ်လျူရှုခံရပါလိမ့်မယ်။ အဲဒီကိစ္စမှာ standard time လား daylight-savings time လား သက်ရောက်မယ်ဆိုတာ ဆုံးဖြတ်ဖို့ date ကို သတ်မှတ်ပေးဖို့ လိုအပ်ပါတယ်။ သင့်လျော်တဲ့ time zone offset ကို `time with time zone` value ထဲမှာ မှတ်တမ်းတင်ပြီး — သိမ်းထားတဲ့အတိုင်း output လုပ်ပါတယ်; active time zone နဲ့ ညှိပြင်ပေးတာ မဟုတ်ပါဘူး။

**ဇယား 8.11. Time Input (အချိန် input)**

| ဥပမာ | ဖော်ပြချက် |
| --- | --- |
| `04:05:06.789` | ISO 8601 |
| `04:05:06` | ISO 8601 |
| `04:05` | ISO 8601 |
| `040506` | ISO 8601 |
| `04:05 AM` | 04:05 နဲ့ အတူတူ; AM က တန်ဖိုးကို သက်ရောက်မှု မရှိ |
| `04:05 PM` | 16:05 နဲ့ အတူတူ; input hour က 12 ထက် မပိုရ (<= 12) |
| `04:05:06.789-8` | ISO 8601 — time zone ကို UTC offset အဖြစ် ဖော်ပြထား |
| `04:05:06-08:00` | ISO 8601 — time zone ကို UTC offset အဖြစ် ဖော်ပြထား |
| `04:05-08:00` | ISO 8601 — time zone ကို UTC offset အဖြစ် ဖော်ပြထား |
| `040506-08` | ISO 8601 — time zone ကို UTC offset အဖြစ် ဖော်ပြထား |
| `040506+0730` | ISO 8601 — နာရီ အပိုင်းကိန်း ပါဝင်တဲ့ time zone ကို UTC offset အဖြစ် ဖော်ပြထား |
| `040506+07:30:00` | UTC offset ကို စက္ကန့်အထိ သတ်မှတ်ထား (ISO 8601 မှာ ခွင့်မပြု) |
| `04:05:06 PST` | time zone ကို abbreviation (အတိုကောက်) နဲ့ သတ်မှတ်ထား |
| `2003-04-12 04:05:06 America/New_York` | time zone ကို နာမည် အပြည့်အစုံနဲ့ သတ်မှတ်ထား |

**ဇယား 8.12. Time Zone Input (time zone input)**

| ဥပမာ | ဖော်ပြချက် |
| --- | --- |
| `PST` | Abbreviation (Pacific Standard Time အတွက်) |
| `America/New_York` | time zone နာမည် အပြည့်အစုံ |
| `PST8PDT` | POSIX-style time zone specification (POSIX ပုံစံ time zone သတ်မှတ်ချက်) |
| `-8:00:00` | PST အတွက် UTC offset |
| `-8:00` | PST အတွက် UTC offset (ISO 8601 extended format) |
| `-800` | PST အတွက် UTC offset (ISO 8601 basic format) |
| `-8` | PST အတွက် UTC offset (ISO 8601 basic format) |
| `zulu` | UTC အတွက် military (စစ်ဘက်) abbreviation |
| `z` | `zulu` ရဲ့ အတိုပုံစံ (ISO 8601 မှာလည်း ပါဝင်) |

Time zone တွေ သတ်မှတ်ပုံ အသေးစိတ်အတွက် [အပိုင်း 8.5.3](/docs/postgresql/datatype-datetime) ကို ကြည့်ပါ။

#### 8.5.1.3. Time Stamps (time stamp များ)

Time stamp type တွေအတွက် valid input ကတော့ — date တစ်ခုနဲ့ time တစ်ခုကို ဆက်စပ်ထားတာ ဖြစ်ပြီး — ၎င်းနောက်မှာ optional time zone တစ်ခု၊ ပြီးတော့ optional `AD` သို့မဟုတ် `BC` တစ်ခု လိုက်နိုင်ပါတယ်။ (တနည်းအားဖြင့် — `AD`/`BC` က time zone ရဲ့ ရှေ့မှာ လာလို့လည်း ရပေမယ့် — အဲဒါက ဦးစားပေး အစဉ်တော့ မဟုတ်ပါဘူး။) ဒါကြောင့်:

```sql
1999-01-08 04:05:06
```

နဲ့:

```sql
1999-01-08 04:05:06 -8:00
```

ဆိုတာတွေက ISO 8601 standard ကို လိုက်နာတဲ့ valid value တွေ ဖြစ်ပါတယ်။ ဒါ့အပြင် — အောက်ပါ အသုံးများတဲ့ ပုံစံကိုလည်း ထောက်ပံ့ပါတယ်:

```sql
January 8 04:05:06 1999 PST
```

SQL standard က `timestamp without time zone` နဲ့ `timestamp with time zone` literal တွေကို — time ရဲ့ နောက်မှာ “+” သို့မဟုတ် “-” သင်္ကေတ နဲ့ time zone offset ပါမပါပေါ် မူတည်ပြီး — ခွဲခြားပါတယ်။ ဒါကြောင့် standard အရ:

```sql
TIMESTAMP '2004-10-19 10:23:54'
```

က `timestamp without time zone` ဖြစ်ပြီး —

```sql
TIMESTAMP '2004-10-19 10:23:54+02'
```

ကတော့ `timestamp with time zone` ဖြစ်ပါတယ်။ PostgreSQL က literal string တစ်ခုရဲ့ type ကို ဆုံးဖြတ်ရာမှာ string ရဲ့ ပါဝင်မှုကို ဘယ်တော့မှ စစ်ဆေးလေ့ မရှိလို့ — အပေါ်က နှစ်ခုလုံးကို `timestamp without time zone` အနေနဲ့ပဲ သဘောထားပါလိမ့်မယ်။ Literal တစ်ခုကို `timestamp with time zone` အနေနဲ့ သဘောထားခံစေချင်ရင် — မှန်ကန်တဲ့ explicit type ကို ပေးလိုက်ပါ:

```sql
TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02'
```

`timestamp without time zone` လို့ သတ်မှတ်ခံရတဲ့ value တစ်ခုထဲမှာ — PostgreSQL က time zone ဖော်ပြချက် ဘာကိုမဆို တိတ်တဆိတ် လျစ်လျူရှုပါလိမ့်မယ်။ ဆိုလိုတာက — ရလဒ် value က input string ထဲက date/time field တွေကနေ ဆင်းသက်ပြီး — time zone အတွက် ညှိပြင်ပေးတာ မဟုတ်ပါဘူး။

`timestamp with time zone` value တွေအတွက်တော့ — explicit time zone ပါဝင်တဲ့ input string ကို အဲဒီ time zone အတွက် သင့်လျော်တဲ့ offset သုံးပြီး UTC ([Universal Coordinated Time](https://www.postgresql.org/docs/current/glossary.html#GLOSSARY-UTC)) အဖြစ် ပြောင်းလဲပါလိမ့်မယ်။ Input string ထဲမှာ time zone ဖော်ပြမထားရင် — system ရဲ့ [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) parameter က ညွှန်ပြတဲ့ time zone မှာ ရှိတယ်လို့ ယူဆပြီး — `timezone` zone အတွက် offset သုံးကာ UTC အဖြစ် ပြောင်းပါတယ်။ ကိစ္စ နှစ်မျိုးလုံးမှာ value ကို အတွင်းပိုင်းမှာ UTC အဖြစ် သိမ်းပြီး — မူလ ဖော်ပြထားတဲ့ သို့မဟုတ် ယူဆထားတဲ့ time zone ကိုတော့ ထိန်းသိမ်းမထားပါဘူး။

`timestamp with time zone` value တစ်ခုကို output လုပ်တဲ့အခါ — ၎င်းကို UTC ကနေ လက်ရှိ `timezone` zone ဆီ အမြဲ ပြောင်းပြီး — အဲဒီ zone ထဲက local time အဖြစ် ပြသပါတယ်။ တခြား time zone တစ်ခုထဲက အချိန်ကို ကြည့်ချင်ရင် — `timezone` ကို ပြောင်းလိုက်ပါ ဒါမှမဟုတ် `AT TIME ZONE` construct ကို သုံးပါ ([အပိုင်း 9.9.4](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT) ကို ကြည့်ပါ)။

`timestamp without time zone` နဲ့ `timestamp with time zone` အကြား ပြောင်းလဲမှုတွေမှာ — `timestamp without time zone` value ကို `timezone` local time အဖြစ် ယူဆပြီး ယူတာ သို့မဟုတ် ပေးတာ ဖြစ်ပါတယ်။ Conversion အတွက် တခြား time zone တစ်ခုကို `AT TIME ZONE` သုံးပြီး သတ်မှတ်လို့ ရပါတယ်။

#### 8.5.1.4. Special Values (အထူး တန်ဖိုးများ)

အဆင်ပြေစေဖို့ PostgreSQL က အထူး date/time input value တချို့ကို ထောက်ပံ့ပါတယ် — [ဇယား 8.13](/docs/postgresql/datatype-datetime) မှာ ပြထားပါတယ်။ `infinity` နဲ့ `-infinity` value တွေကို system ထဲမှာ အထူးနည်းနဲ့ ကိုယ်စားပြုပြီး — မပြောင်းလဲဘဲ ပြသပါတယ်; ကျန်တာတွေကတော့ — ဖတ်လိုက်တာနဲ့ သာမန် date/time value တွေအဖြစ် ပြောင်းလဲခံရမယ့် — ရိုးရှင်းတဲ့ သင်္ကေတ အတိုကောက် (notational shorthand) တွေပဲ ဖြစ်ပါတယ်။ (အထူးသဖြင့် `now` နဲ့ ဆက်စပ်တဲ့ string တွေကို ဖတ်လိုက်တာနဲ့ — တိကျတဲ့ အချိန်တန်ဖိုး တစ်ခုအဖြစ် ချက်ချင်း ပြောင်းလဲပါတယ်။) ဒီ value တွေ အားလုံးကို SQL command တွေထဲမှာ constant အဖြစ် သုံးတဲ့အခါ — single quote နဲ့ ဝိုင်းရံထားဖို့ လိုပါတယ်။

**ဇယား 8.13. Special Date/Time Inputs (အထူး ရက်စွဲ/အချိန် input များ)**

| Input String (ထည့်သွင်း string) | Valid Types (ရနိုင်သော type များ) | ဖော်ပြချက် |
| --- | --- | --- |
| `epoch` | `date`, `timestamp` | 1970-01-01 00:00:00+00 (Unix system time ၏ စမှတ် — zero) |
| `infinity` | `date`, `timestamp`, `interval` | တခြား time stamp တွေ အားလုံးထက် နောက်ကျသော အချိန် |
| `-infinity` | `date`, `timestamp`, `interval` | တခြား time stamp တွေ အားလုံးထက် စောသော အချိန် |
| `now` | `date`, `time`, `timestamp` | လက်ရှိ transaction ရဲ့ စတင်ချိန် |
| `today` | `date`, `timestamp` | ယနေ့ သန်းခေါင်ယံ (`00:00`) |
| `tomorrow` | `date`, `timestamp` | မနက်ဖြန် သန်းခေါင်ယံ (`00:00`) |
| `yesterday` | `date`, `timestamp` | မနေ့က သန်းခေါင်ယံ (`00:00`) |
| `allballs` | `time` | 00:00:00.00 UTC |

သက်ဆိုင်ရာ data type အတွက် လက်ရှိ အချိန် တန်ဖိုးကို ရဖို့ အောက်ပါ SQL-compatible function တွေကိုလည်း သုံးနိုင်ပါတယ်: `CURRENT_DATE`, `CURRENT_TIME`, `CURRENT_TIMESTAMP`, `LOCALTIME`, `LOCALTIMESTAMP`။ ([အပိုင်း 9.9.5](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT) ကို ကြည့်ပါ။) ဒါတွေက SQL function တွေ ဖြစ်ပြီး — data input string တွေထဲမှာတော့ အသိအမှတ်ပြုမခံရဘူးဆိုတာ သတိပြုပါ။

> **သတိပြုရန်:** `now`, `today`, `tomorrow` နဲ့ `yesterday` input string တွေက interactive SQL command တွေမှာ သုံးလို့ အဆင်ပြေပေမယ့် — command ကို နောက်မှ execute လုပ်ဖို့ သိမ်းထားတဲ့အခါ — ဥပမာ prepared statements, views နဲ့ function definitions တွေမှာ — မမျှော်လင့်တဲ့ အပြုအမူတွေ ဖြစ်စေနိုင်ပါတယ်။ String က သီးခြား အချိန်တန်ဖိုး တစ်ခုအဖြစ် ပြောင်းလဲခံရပြီး — ခေတ်မမီ (stale) ဖြစ်သွားပြီးချိန် ကြာမြင့်စွာ ဆက်သုံးနေနိုင်ပါတယ်။ အဲဒီလို context တွေမှာ SQL function တွေထဲက တစ်ခုကို အစားထိုး သုံးပါ။ ဥပမာ — `CURRENT_DATE + 1` က `'tomorrow'::date` ထက် ပိုလုံခြုံပါတယ်။

### 8.5.2. Date/Time Output (ရက်စွဲ/အချိန် output)

Date/time type တွေရဲ့ output ပုံစံကို — ISO 8601, SQL (Ingres), ရိုးရာ POSTGRES (Unix date format), German ဆိုတဲ့ ပုံစံ လေးမျိုးထဲက တစ်ခုအဖြစ် သတ်မှတ်နိုင်ပါတယ်။ Default ကတော့ ISO ပုံစံ ဖြစ်ပါတယ်။ (SQL standard က ISO 8601 ပုံစံ သုံးဖို့ လိုအပ်ပါတယ်။ “SQL” output format ဆိုတဲ့ နာမည်က သမိုင်းကြောင်း မတော်တဆမှု (historical accident) တစ်ခုပါ။) [ဇယား 8.14](/docs/postgresql/datatype-datetime) က output ပုံစံ တစ်ခုချင်းစီအတွက် ဥပမာတွေ ပြပါတယ်။ `date` နဲ့ `time` type တွေရဲ့ output က ယေဘုယျအားဖြင့် ပေးထားတဲ့ ဥပမာတွေနဲ့အညီ date ဒါမှမဟုတ် time အပိုင်းပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — POSTGRES ပုံစံကတော့ date-only တန်ဖိုးတွေကို ISO ပုံစံနဲ့ output လုပ်ပါတယ်။

**ဇယား 8.14. Date/Time Output Styles (ရက်စွဲ/အချိန် output ပုံစံများ)**

| Style Specification (ပုံစံ သတ်မှတ်ချက်) | Description (ဖော်ပြချက်) | Example (ဥပမာ) |
| --- | --- | --- |
| `ISO` | ISO 8601, SQL standard | `1997-12-17 07:37:16-08` |
| `SQL` | ရိုးရာ ပုံစံ | `12/17/1997 07:37:16.00 PST` |
| `Postgres` | မူရင်း ပုံစံ | `Wed Dec 17 07:37:16 1997 PST` |
| `German` | ဒေသဆိုင်ရာ ပုံစံ | `17.12.1997 07:37:16.00 PST` |

> **မှတ်ချက်:** ISO 8601 က date နဲ့ time ကို ခြားဖို့ စာလုံးကြီး `T` သုံးဖို့ သတ်မှတ်ပါတယ်။ PostgreSQL က input မှာ အဲဒီ ပုံစံကို လက်ခံပေမယ့် — output မှာတော့ အပေါ်မှာ ပြထားသလို `T` အစား space ကို သုံးပါတယ်။ ဒါက ဖတ်ရလွယ်ကူစေဖို့ နဲ့ [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) နဲ့ရော တခြား database system တချို့နဲ့ပါ ညီညွတ်မှု ရှိစေဖို့ အတွက်ပါ။

SQL နဲ့ POSTGRES ပုံစံတွေမှာ — DMY field ordering သတ်မှတ်ထားရင် day က month ရဲ့ ရှေ့မှာ ပေါ်ပြီး — မဟုတ်ရင် month က day ရဲ့ ရှေ့မှာ ပေါ်ပါတယ်။ (ဒီ setting က input value တွေရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုမှုကိုပါ ဘယ်လို သက်ရောက်လဲဆိုတာ [အပိုင်း 8.5.1](/docs/postgresql/datatype-datetime) မှာ ကြည့်ပါ။) [ဇယား 8.15](/docs/postgresql/datatype-datetime) က ဥပမာတွေ ပြပါတယ်။

**ဇယား 8.15. Date Order Conventions (ရက်စွဲ အစဉ် စည်းမျဉ်းများ)**

| `datestyle` Setting (သတ်မှတ်ချက်) | Input Ordering (input အစဉ်) | Example Output (output ဥပမာ) |
| --- | --- | --- |
| `SQL, DMY` | `day`/`month`/`year` | `17/12/1997 15:37:16.00 CET` |
| `SQL, MDY` | `month`/`day`/`year` | `12/17/1997 07:37:16.00 PST` |
| `Postgres, DMY` | `day`/`month`/`year` | `Wed 17 Dec 07:37:16 1997 PST` |

ISO ပုံစံမှာ — time zone ကို UTC ကနေ signed numeric offset (အနုတ်/အပေါင်း သင်္ကေတ ပါတဲ့ ဂဏန်း offset) အနေနဲ့ အမြဲ ပြပြီး — Greenwich ရဲ့ အရှေ့ဘက် zone တွေအတွက် positive sign ကို သုံးပါတယ်။ Offset က နာရီ အတိအကျ ဆိုရင် `hh` (နာရီချည်းပဲ)၊ မိနစ် အတိအကျ ဆိုရင် `hh`:`mm`၊ မဟုတ်ရင် `hh`:`mm`:`ss` အနေနဲ့ ပြပါလိမ့်မယ်။ (တတိယ ကိစ္စက ခေတ်သစ် time zone standard တစ်ခုခုနဲ့ဆိုရင် မဖြစ်နိုင်ပေမယ့် — စံသတ်မှတ်ထားတဲ့ time zone တွေ မကျင့်သုံးခင် အချိန်က timestamp တွေနဲ့ အလုပ်လုပ်တဲ့အခါ ပေါ်လာနိုင်ပါတယ်။) တခြား date style တွေမှာတော့ — လက်ရှိ zone ထဲမှာ အသုံးများတဲ့ alphabetic abbreviation (စာလုံးဖြင့် အတိုကောက်) ရှိရင် time zone ကို အဲဒါနဲ့ ပြပါတယ်။ မရှိရင်တော့ ISO 8601 basic format (`hh` သို့မဟုတ် `hhmm`) နဲ့ signed numeric offset အဖြစ် ပေါ်ပါတယ်။ ဒီ style တွေမှာ ပြထားတဲ့ alphabetic abbreviation တွေကို [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) run-time parameter က လက်ရှိ ရွေးချယ်ထားတဲ့ IANA time zone database entry ကနေ ယူပြီး — [timezone_abbreviations](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE-ABBREVIATIONS) setting ရဲ့ သက်ရောက်မှုကို မခံပါဘူး။

User က date/time style ကို — `SET datestyle` command, `postgresql.conf` configuration file ထဲက [DateStyle](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DATESTYLE) parameter, ဒါမှမဟုတ် server ဒါမှမဟုတ် client ပေါ်က `PGDATESTYLE` environment variable — သုံးပြီး ရွေးချယ်နိုင်ပါတယ်။

`to_char` formatting function ([အပိုင်း 9.8](https://www.postgresql.org/docs/current/functions-formatting.html)) ကလည်း date/time output တွေကို ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ပုံစံချနိုင်ဖို့ ရနိုင်ပါတယ်။

### 8.5.3. Time Zones (အချိန်ဇုန်များ)

Time zone တွေနဲ့ time zone စည်းမျဉ်း (convention) တွေက ကမ္ဘာ့ ဂျီသြမေတြီ တစ်ခုတည်းကြောင့် မဟုတ်ဘဲ — နိုင်ငံရေး ဆုံးဖြတ်ချက်တွေရဲ့ လွှမ်းမိုးမှုလည်း ရှိပါတယ်။ ကမ္ဘာ့ time zone တွေက ၁၉၀၀ ပြည့်နှစ်များ အတွင်းမှာ အတိုင်းအတာ တစ်ခုအထိ စံသတ်မှတ်ခံခဲ့ရပေမယ့် — အထူးသဖြင့် daylight-savings စည်းမျဉ်းတွေနဲ့ ပတ်သက်ပြီး — မလိုလားဘဲ ပြောင်းလဲခံရနိုင်တုန်းပါပဲ။ သမိုင်းဝင် time zone စည်းမျဉ်းတွေအကြောင်း သတင်းအချက်အလက်အတွက် PostgreSQL က ကျယ်ကျယ်ပြန့်ပြန့် သုံးနေတဲ့ IANA (Olson) time zone database ကို သုံးပါတယ်။ အနာဂတ် အချိန်တွေအတွက်တော့ — time zone တစ်ခုအတွက် နောက်ဆုံး သိထားတဲ့ စည်းမျဉ်းတွေက အနာဂတ် ဘယ်လောက်ဝေးဝေးအထိပဲ ဖြစ်ဖြစ် ဆက်တည်မြဲနေမယ်လို့ ယူဆပါတယ်။

PostgreSQL က ပုံမှန် အသုံးပြုမှုတွေအတွက် SQL standard ရဲ့ သတ်မှတ်ချက်တွေနဲ့ ကိုက်ညီအောင် ကြိုးစားပါတယ်။ ဒါပေမယ့် — SQL standard မှာ date နဲ့ time type တွေရော စွမ်းဆောင်ရည်တွေပါ ထူးဆန်းစွာ ရောနှောပါဝင်နေပါတယ်။ ထင်ရှားတဲ့ ပြဿနာ နှစ်ခုကတော့:

- `date` type က time zone နဲ့ တွဲလို့ မရပေမယ့် — `time` type ကတော့ တွဲလို့ ရပါတယ်။ တကယ့် ကမ္ဘာမှာတော့ — offset က daylight-saving time နယ်နိမိတ်တွေနဲ့အတူ တစ်နှစ်ပတ်လုံး ပြောင်းလဲနိုင်လို့ — time zone က date ရော time ရော နှစ်ခုလုံးနဲ့ တွဲမှသာ အဓိပ္ပာယ် ရှိပါတယ်။
- Default time zone ကို UTC ကနေ constant numeric offset (ပုံသေ ဂဏန်း offset) တစ်ခုအနေနဲ့ သတ်မှတ်ထားပါတယ်။ ဒါကြောင့် DST နယ်နိမိတ်တွေကို ဖြတ်ပြီး date/time arithmetic လုပ်တဲ့အခါ daylight-saving time နဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်ဖို့ မဖြစ်နိုင်ပါဘူး။

ဒီအခက်အခဲတွေကို ဖြေရှင်းဖို့ — time zone သုံးတဲ့အခါ date ရော time ရော နှစ်မျိုးလုံး ပါဝင်တဲ့ date/time type တွေကို သုံးဖို့ အကြံပြုပါတယ်။ `time with time zone` type ကိုတော့ သုံးဖို့ အကြံမပြုပါဘူး (legacy application တွေအတွက်ရော SQL standard နဲ့ ကိုက်ညီမှု ရှိစေဖို့အတွက်ပါ PostgreSQL က ထောက်ပံ့ထားပေမယ့်)။ Date ဒါမှမဟုတ် time ပဲ ပါဝင်တဲ့ type တစ်ခုခုအတွက် — PostgreSQL က သင့်ရဲ့ local time zone ကိုပဲ ယူဆပါတယ်။

Timezone-aware ဖြစ်တဲ့ date နဲ့ time တွေ အားလုံးကို အတွင်းပိုင်းမှာ UTC နဲ့ သိမ်းပါတယ်။ Client ဆီ မပြသခင် — [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) configuration parameter က သတ်မှတ်တဲ့ zone ထဲက local time အဖြစ် ပြောင်းလဲပါတယ်။

PostgreSQL က time zone တွေကို ပုံစံ သုံးမျိုးနဲ့ သတ်မှတ်ခွင့် ပြုပါတယ်:

- Time zone နာမည် အပြည့်အစုံ — ဥပမာ America/New_York။ အသိအမှတ်ပြုထားတဲ့ time zone နာမည်တွေကို pg_timezone_names view မှာ စာရင်းပြုထားပါတယ် (အပိုင်း 53.34 ကို ကြည့်ပါ)။ ဒီရည်ရွယ်ချက်အတွက် PostgreSQL က ကျယ်ပြန့်စွာ သုံးနေတဲ့ IANA time zone data ကို သုံးလို့ — တခြား software တွေမှာလည်း အဲဒီ time zone နာမည်တွေကိုပဲ အသိအမှတ်ပြုပါတယ်။
- Time zone abbreviation — ဥပမာ PST။ ဒီလို သတ်မှတ်ချက်က UTC ကနေ သီးခြား offset တစ်ခုကိုပဲ သတ်မှတ်ပေးပါတယ် — daylight savings အကူးအပြောင်း စည်းမျဉ်း အစုတစ်ခုပါ ဆိုလိုနိုင်တဲ့ time zone နာမည် အပြည့်အစုံတွေနဲ့ ဆန့်ကျင်ဘက်ပါ။ အသိအမှတ်ပြုထားတဲ့ abbreviation တွေကို pg_timezone_abbrevs view မှာ စာရင်းပြုထားပါတယ် (အပိုင်း 53.33 ကို ကြည့်ပါ)။ TimeZone သို့မဟုတ် log_timezone configuration parameter တွေကို time zone abbreviation တစ်ခုအဖြစ် သတ်မှတ်လို့ မရပေမယ့် — date/time input value တွေနဲ့ AT TIME ZONE operator မှာတော့ abbreviation တွေကို သုံးနိုင်ပါတယ်။
- Time zone နာမည်တွေနဲ့ abbreviation တွေအပြင် — PostgreSQL က POSIX-style time zone specification တွေကိုလည်း လက်ခံပါတယ် — အပိုင်း B.5 မှာ ဖော်ပြထားသလိုပါ။ ဒီ option က နာမည်ပေးထားတဲ့ time zone သုံးတာထက် သာလွန်တယ်လို့ ယေဘုယျအားဖြင့် မဆိုနိုင်ပေမယ့် — သင့်လျော်တဲ့ IANA time zone entry မရှိဘူးဆိုရင် လိုအပ်လာနိုင်ပါတယ်။

အတိုချုပ်ပြောရရင် — abbreviation နဲ့ နာမည် အပြည့်အစုံကြားက ကွာခြားချက်က ဒီလိုပါ: abbreviation တွေက UTC ကနေ တိကျတဲ့ offset တစ်ခုကို ကိုယ်စားပြုပြီး — နာမည် အပြည့်အစုံ အများစုကတော့ local daylight-savings time စည်းမျဉ်း တစ်ခုကိုပါ ဆိုလိုလို့ — ဖြစ်နိုင်တဲ့ UTC offset နှစ်ခု ရှိပါတယ်။ ဥပမာ — `2014-06-04 12:00 America/New_York` က New York မှာ မွန်းတည့် (noon) local time ကို ကိုယ်စားပြုပါတယ် — အဲဒီ သီးခြား ရက်စွဲအတွက်တော့ Eastern Daylight Time (UTC-4) ဖြစ်ပါတယ်။ ဒါကြောင့် `2014-06-04 12:00 EDT` ကလည်း အဲဒီ အချိန်ကာလ အတိအကျကိုပဲ သတ်မှတ်ပါတယ်။ ဒါပေမယ့် `2014-06-04 12:00 EST` ကတော့ — အဲဒီရက်မှာ daylight savings နာမည်ခံ (nominally) သက်ရောက်မှု ရှိရှိမရှိ မသက်ဆိုင်ဘဲ — Eastern Standard Time (UTC-5) ရဲ့ မွန်းတည့်ချိန်ကို သတ်မှတ်ပါတယ်။

> **မှတ်ချက်:** POSIX-style time zone specification တွေထဲက sign က ISO-8601 datetime value တွေထဲက sign ရဲ့ ဆန့်ကျင်ဘက် အဓိပ္ပာယ် ရှိပါတယ်။ ဥပမာ — `2014-06-04 12:00+04` အတွက် POSIX time zone က UTC-4 ဖြစ်ပါလိမ့်မယ်။

ပိုရှုပ်ထွေးစေတာက — နယ်မြေ (jurisdiction) တချို့က timezone abbreviation တစ်ခုတည်းကို အချိန်အမျိုးမျိုးမှာ မတူညီတဲ့ UTC offset တွေကို ဆိုလိုဖို့ သုံးဖူးပါတယ်; ဥပမာ — Moscow မှာ `MSK` က နှစ်တချို့မှာ UTC+3 ကို ဆိုလိုပြီး — နှစ်တချို့မှာ UTC+4 ကို ဆိုလိုပါတယ်။ PostgreSQL က ဒီလို abbreviation တွေကို — သတ်မှတ်ထားတဲ့ ရက်စွဲမှာ သူတို့ ဆိုလိုခဲ့တဲ့ (သို့မဟုတ် မကြာသေးခင်က ဆိုလိုခဲ့တဲ့) အဓိပ္ပာယ်အတိုင်း အဓိပ္ပာယ်ဖွင့်ဆိုပါတယ်; ဒါပေမယ့် အပေါ်က `EST` ဥပမာမှာ ပြခဲ့သလိုပဲ — အဲဒီနေ့က local civil time နဲ့ မသေချာပေါက် တူနေမှာ မဟုတ်ပါဘူး။

ကိစ္စ အားလုံးမှာ — timezone နာမည်တွေနဲ့ abbreviation တွေကို case-insensitively (စာလုံးအကြီး/အသေး မခွဲခြားဘဲ) အသိအမှတ်ပြုပါတယ်။ (ဒါက PostgreSQL 8.2 မတိုင်ခင် ဗားရှင်းတွေနဲ့ ပြောင်းလဲသွားတာပါ — အဲဒီဗားရှင်းတွေက context တချို့မှာ case-sensitive ဖြစ်ပြီး — တချို့မှာ မဟုတ်ပါဘူး။)

Timezone နာမည်တွေရော abbreviation တွေပါ server ထဲမှာ ပုံသေ (hard-wired) မထည့်ထားပါဘူး; ၎င်းတို့ကို installation directory ရဲ့ `.../share/timezone/` နဲ့ `.../share/timezonesets/` အောက်မှာ သိမ်းထားတဲ့ configuration file တွေကနေ ရယူပါတယ် ([အပိုင်း B.4](https://www.postgresql.org/docs/current/datetime-config-files.html) ကို ကြည့်ပါ)။

[TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) configuration parameter ကို `postgresql.conf` file ထဲမှာ ဒါမှမဟုတ် [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) မှာ ဖော်ပြထားတဲ့ တခြား ပုံမှန် နည်းလမ်း တစ်ခုခုနဲ့ သတ်မှတ်လို့ ရပါတယ်။ သတ်မှတ်ဖို့ အထူး နည်းလမ်းတချို့လည်း ရှိပါသေးတယ်:

- SET TIME ZONE ဆိုတဲ့ SQL command က session အတွက် time zone ကို သတ်မှတ်ပေးပါတယ်။ ဒါက SET TIMEZONE TO ရဲ့ တနည်း ရေးသားပုံ (alternative spelling) ဖြစ်ပြီး — SQL spec နဲ့ ပိုပြီး လိုက်ဖက်တဲ့ syntax ပါဝင်ပါတယ်။
- libpq client တွေက ချိတ်ဆက်လိုက်ချိန်မှာ server ဆီ SET TIME ZONE command ပို့ဖို့ PGTZ environment variable ကို သုံးပါတယ်။

### 8.5.4. Interval Input (interval input)

`interval` value တွေကို အောက်ပါ verbose syntax (အသေးစိတ် ရေးသားပုံ) နဲ့ ရေးလို့ ရပါတယ်:

```sql
[@] quantity unit [quantity unit...] [direction]
```

ဒီမှာ `quantity` က ဂဏန်း တစ်ခု (sign ပါနိုင်); `unit` က `microsecond`, `millisecond`, `second`, `minute`, `hour`, `day`, `week`, `month`, `year`, `decade`, `century`, `millennium` ဒါမှမဟုတ် ဒီယူနစ်တွေရဲ့ abbreviation (အတိုကောက်) တွေ ဒါမှမဟုတ် အများကိန်း (plural) တွေ ဖြစ်နိုင်ပြီး; `direction` ကတော့ `ago` ဒါမှမဟုတ် ဗလာ ဖြစ်နိုင်ပါတယ်။ At sign (`@`) ကတော့ optional ဖြစ်တဲ့ အလှဆင် စာလုံးပါ။ မတူညီတဲ့ ယူနစ်တွေရဲ့ ပမာဏတွေကို သင့်လျော်တဲ့ sign တွက်ချက်မှုနဲ့အတူ သွယ်ဝိုက် (implicitly) ပေါင်းပါတယ်။ `ago` က field တွေ အားလုံးကို အနုတ်ပြုပါတယ်။ [IntervalStyle](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-INTERVALSTYLE) ကို `postgres_verbose` လို့ သတ်မှတ်ထားရင် — ဒီ syntax ကို interval output အတွက်လည်း သုံးပါတယ်။

Days, hours, minutes နဲ့ seconds ပမာဏတွေကို — ရှင်းလင်းတဲ့ ယူနစ် အမှတ်အသားတွေ မပါဘဲ သတ်မှတ်လို့ ရပါတယ်။ ဥပမာ — `'1 12:59:10'` ကို `'1 day 12 hours 59 min 10 sec'` နဲ့ အတူတူ ဖတ်ပါတယ်။ ဒါ့အပြင် — years နဲ့ months ပေါင်းစပ်မှုကို dash နဲ့လည်း သတ်မှတ်လို့ ရပါတယ်; ဥပမာ — `'200-10'` ကို `'200 years 10 months'` နဲ့ အတူတူ ဖတ်ပါတယ်။ (ဒီအတိုပုံစံတွေက တကယ်တော့ SQL standard က ခွင့်ပြုတဲ့ တစ်ခုတည်းသော ပုံစံတွေ ဖြစ်ပြီး — `IntervalStyle` ကို `sql_standard` လို့ သတ်မှတ်ထားရင် output အတွက် သုံးပါတယ်။)

Interval value တွေကို ISO 8601 time interval ပုံစံနဲ့လည်း ရေးလို့ ရပါတယ် — standard ရဲ့ section 4.4.3.2 က “format with designators” (သင်္ကေတဖြင့် ရေးသော ပုံစံ) ဖြစ်စေ၊ section 4.4.3.3 က “alternative format” (အခြားရွေးချယ် ပုံစံ) ဖြစ်စေ သုံးနိုင်ပါတယ်။ Format with designators က ဒီလိုပုံ ရှိပါတယ်:

```sql
P quantity unit [ quantity unit ...] [ T [ quantity unit ...]]
```

String က `P` နဲ့ စရပါမယ် — ပြီးတော့ နေ့အချိန်ပိုင်း (time-of-day) ယူနစ်တွေကို စတင်ပေးတဲ့ `T` တစ်ခု ပါဝင်နိုင်ပါတယ်။ ရနိုင်တဲ့ ယူနစ် အတိုကောက်တွေကို [ဇယား 8.16](/docs/postgresql/datatype-datetime) မှာ ပေးထားပါတယ်။ ယူနစ်တွေကို ချန်လိုက်လို့လည်း ရပြီး — ဘယ်အစဉ်နဲ့မဆို သတ်မှတ်လို့ ရပေမယ့် — တစ်ရက်ထက် သေးတဲ့ ယူနစ်တွေကတော့ `T` ရဲ့ နောက်မှာ လာရပါမယ်။ အထူးသဖြင့် — `M` ရဲ့ အဓိပ္ပာယ်က `T` ရဲ့ ရှေ့မှာ လား နောက်မှာ လားဆိုတာပေါ် မူတည်ပါတယ်။

**ဇယား 8.16. ISO 8601 Interval Unit Abbreviations (ISO 8601 interval ယူနစ် အတိုကောက်များ)**

| Abbreviation (အတိုကောက်) | Meaning (အဓိပ္ပာယ်) |
| --- | --- |
| Y | နှစ်များ |
| M | လများ (date အပိုင်းထဲမှာ) |
| W | ရက်သတ္တပတ်များ |
| D | ရက်များ |
| H | နာရီများ |
| M | မိနစ်များ (time အပိုင်းထဲမှာ) |
| S | စက္ကန့်များ |

Alternative format မှာ:

```sql
P [ years-months-days ] [ T hours:minutes:seconds ]
```

string က `P` နဲ့ စတင်ရပြီး — `T` က interval ရဲ့ date နဲ့ time အပိုင်းတွေကို ခြားပေးပါတယ်။ တန်ဖိုးတွေကို ISO 8601 date တွေနဲ့ ဆင်တဲ့ ဂဏန်းတွေအနေနဲ့ ပေးပါတယ်။

Interval constant တစ်ခုကို `fields` specification နဲ့ ရေးတဲ့အခါ ဒါမှမဟုတ် `fields` specification နဲ့ သတ်မှတ်ထားတဲ့ interval column တစ်ခုဆီ string တစ်ခု assign လုပ်တဲ့အခါ — unit အမှတ်အသား မပါတဲ့ quantity တွေရဲ့ အဓိပ္ပာယ်က `fields` ပေါ်မှာ မူတည်ပါတယ်။ ဥပမာ — `INTERVAL '1' YEAR` ကို 1 year (တစ်နှစ်) အဖြစ် ဖတ်ပြီး — `INTERVAL '1'` ကတော့ 1 second (တစ်စက္ကန့်) ကို ဆိုလိုပါတယ်။ ဒါ့အပြင် — `fields` specification က ခွင့်ပြုတဲ့ အနိမ့်ဆုံး အရေးပါမှု (least significant) ရှိတဲ့ field ရဲ့ “ညာဘက်” မှာ ရှိတဲ့ field တန်ဖိုးတွေကို တိတ်တဆိတ် ဖျက်ပစ်ပါတယ်။ ဥပမာ — `INTERVAL '1 day 2:03:04' HOUR TO MINUTE` လို့ ရေးရင် seconds field ကို ကျစေပြီး — day field ကတော့ မကျပါဘူး။

SQL standard အရ — interval value တစ်ခုရဲ့ field တွေ အားလုံးမှာ sign (အနုတ်/အပေါင်း သင်္ကေတ) အတူတူ ရှိရမှာ ဖြစ်လို့ — ရှေ့ဆုံးက အနုတ် sign က field တွေ အားလုံးကို သက်ရောက်ပါတယ်; ဥပမာ — `'-1 2:03:04'` ဆိုတဲ့ interval literal ထဲက အနုတ် sign က days အပိုင်းရော hour/minute/second အပိုင်းကိုပါ သက်ရောက်ပါတယ်။ PostgreSQL ကတော့ field တွေမှာ sign မတူညီတာတွေ ရှိခွင့် ပြုပြီး — အစဉ်အလာအရ — text ကိုယ်စားပြုမှုထဲက field တစ်ခုချင်းစီကို သီးခြား sign ရှိတယ်လို့ သဘောထားပါတယ် — ဒါကြောင့် ဒီဥပမာမှာ hour/minute/second အပိုင်းကို positive (အပေါင်း) လို့ မှတ်ယူပါတယ်။ `IntervalStyle` ကို `sql_standard` လို့ သတ်မှတ်ထားရင်တော့ — ရှေ့ဆုံး sign က field တွေ အားလုံးကို သက်ရောက်တယ်လို့ မှတ်ယူပါတယ် (နောက်ထပ် sign တွေ မပါရင်တော့)။ မဟုတ်ရင် အစဉ်အလာ PostgreSQL ရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုမှုကို သုံးပါတယ်။ မရှင်းလင်းမှု (ambiguity) ရှောင်ဖို့ — field တစ်ခုခု negative ဖြစ်နေရင် — field တစ်ခုချင်းစီကို explicit sign နဲ့ ရေးဖို့ အကြံပြုပါတယ်။

အတွင်းပိုင်းမှာ `interval` value တွေကို integer field သုံးခုအနေနဲ့ သိမ်းပါတယ်: months (လများ), days (ရက်များ) နဲ့ microseconds (မိုက်ခရိုစက္ကန့်များ)။ ဒီ field တွေကို သီးခြားစီ ထားပါတယ် — ဘာကြောင့်လဲဆိုတော့ လတစ်လမှာ ရက် အရေအတွက်က ပြောင်းလဲနေပြီး — daylight savings time အကူးအပြောင်း (transition) ပါဝင်နေရင် တစ်ရက်မှာ 23 နာရီ သို့မဟုတ် 25 နာရီ ရှိနိုင်လို့ပါ။ တခြား ယူနစ်တွေ သုံးထားတဲ့ interval input string ကို ဒီပုံစံအဖြစ် normalize (စံပြုပြောင်းလဲ) လုပ်ပြီး — output အတွက် စံသတ်မှတ်ထားတဲ့ ပုံစံနဲ့ ပြန်တည်ဆောက်ပါတယ် — ဥပမာ:

```sql
SELECT '2 years 15 months 100 weeks 99 hours 123456789 milliseconds'::interval;
               interval
---------------------------------------
 3 years 3 mons 700 days 133:17:36.789
```

ဒီနေရာမှာ “7 days” လို့ နားလည်ရတဲ့ weeks (ရက်သတ္တပတ်) တွေကို သီးခြား ထားခဲ့ပြီး — ပိုသေးတဲ့ နဲ့ ပိုကြီးတဲ့ အချိန် ယူနစ်တွေကိုတော့ ပေါင်းပြီး normalize လုပ်ထားပါတယ်။

Input field တန်ဖိုးတွေမှာ အပိုင်းကိန်း (fractional part) တွေ ပါနိုင်ပါတယ် — ဥပမာ `'1.5 weeks'` ဒါမှမဟုတ် `'01:02:03.45'` လိုမျိုးပါ။ ဒါပေမယ့် — `interval` က အတွင်းပိုင်းမှာ integer field တွေပဲ သိမ်းလို့ — အပိုင်းကိန်း တန်ဖိုးတွေကို ပိုသေးတဲ့ ယူနစ်တွေအဖြစ် ပြောင်းရပါတယ်။ Months ထက် ကြီးတဲ့ ယူနစ်တွေရဲ့ အပိုင်းကိန်း အစိတ်အပိုင်းတွေကို — ကိန်းပြည့် months အရေအတွက် ဖြစ်အောင် rounding (ပတ်ဖြတ်) လုပ်ပါတယ် — ဥပမာ `'1.5 years'` က `'1 year 6 mons'` ဖြစ်သွားပါတယ်။ Weeks နဲ့ days တွေရဲ့ အပိုင်းကိန်း အစိတ်အပိုင်းတွေကို — တစ်လကို ရက် 30 နဲ့ တစ်ရက်ကို နာရီ 24 လို့ ယူဆပြီး — ကိန်းပြည့် days နဲ့ microseconds အဖြစ် တွက်ပါတယ် — ဥပမာ `'1.75 months'` က `1 mon 22 days 12:00:00` ဖြစ်ပါတယ်။ Output မှာ အပိုင်းကိန်းအနေနဲ့ ပြမယ့်အရာက seconds တစ်ခုတည်းပဲ ဖြစ်ပါတယ်။

[ဇယား 8.17](/docs/postgresql/datatype-datetime) က valid `interval` input ဥပမာ တချို့ကို ပြပါတယ်။

**ဇယား 8.17. Interval Input (interval input)**

| ဥပမာ | ဖော်ပြချက် |
| --- | --- |
| `1-2` | SQL standard ပုံစံ: 1 year 2 months (၁ နှစ် ၂ လ) |
| `3 4:05:06` | SQL standard ပုံစံ: 3 days 4 hours 5 minutes 6 seconds (၃ ရက် ၄ နာရီ ၅ မိနစ် ၆ စက္ကန့်) |
| `1 year 2 months 3 days 4 hours 5 minutes 6 seconds` | ရိုးရာ Postgres ပုံစံ: 1 year 2 months 3 days 4 hours 5 minutes 6 seconds (၁ နှစ် ၂ လ ၃ ရက် ၄ နာရီ ၅ မိနစ် ၆ စက္ကန့်) |
| `P1Y2M3DT4H5M6S` | ISO 8601 “format with designators”: အပေါ်နဲ့ အဓိပ္ပာယ် အတူတူ |
| `P0001-02-03T04:05:06` | ISO 8601 “alternative format”: အပေါ်နဲ့ အဓိပ္ပာယ် အတူတူ |

### 8.5.5. Interval Output (interval output)

အရင်က ရှင်းပြခဲ့သလိုပဲ — PostgreSQL က `interval` value တွေကို months, days နဲ့ microseconds အနေနဲ့ သိမ်းပါတယ်။ Output အတွက်တော့ months field ကို 12 နဲ့ စားပြီး years နဲ့ months အဖြစ် ပြောင်းပါတယ်။ Days field ကတော့ ရှိတဲ့အတိုင်းပဲ ပြပါတယ်။ Microseconds field ကို hours, minutes, seconds နဲ့ fractional seconds အဖြစ် ပြောင်းပါတယ်။ ဒါကြောင့် months, minutes နဲ့ seconds တွေက ၎င်းတို့ရဲ့ အကွာအဝေး 0–11, 0–59 နဲ့ 0–59 တွေကို အသီးသီး ကျော်လွန်တာမျိုး ဘယ်တော့မှ ပြမှာ မဟုတ်ဘဲ — ပြနေတဲ့ years, days နဲ့ hours field တွေကတော့ အတော်လေး ကြီးနိုင်ပါတယ်။ (ကြီးမားတဲ့ days ဒါမှမဟုတ် hours တန်ဖိုးတွေကို နောက် ပိုမြင့်တဲ့ field တစ်ခုဆီ ပြောင်းချင်ရင် — [`justify_days`](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTION-JUSTIFY-DAYS) နဲ့ [`justify_hours`](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTION-JUSTIFY-HOURS) function တွေကို သုံးနိုင်ပါတယ်။)

`interval` type ရဲ့ output ပုံစံကို — `SET intervalstyle` command သုံးပြီး — `sql_standard`, `postgres`, `postgres_verbose` ဒါမှမဟုတ် `iso_8601` ဆိုတဲ့ ပုံစံ လေးမျိုးထဲက တစ်ခုအဖြစ် သတ်မှတ်နိုင်ပါတယ်။ Default ကတော့ `postgres` ပုံစံ ဖြစ်ပါတယ်။ [ဇယား 8.18](/docs/postgresql/datatype-datetime) က output ပုံစံ တစ်ခုချင်းစီအတွက် ဥပမာတွေ ပြပါတယ်။

`sql_standard` ပုံစံက — interval value က standard ရဲ့ ကန့်သတ်ချက်တွေနဲ့ ကိုက်ညီရင် (year-month သက်သက် ဒါမှမဟုတ် day-time သက်သက် ဖြစ်ပြီး — positive နဲ့ negative component တွေ ရောမနေရင်) — interval literal string တွေအတွက် SQL standard ရဲ့ သတ်မှတ်ချက်နဲ့ ကိုက်ညီတဲ့ output ကို ထုတ်ပေးပါတယ်။ မကိုက်ညီရင်တော့ — output က standard year-month literal string တစ်ခုရဲ့ နောက်မှာ day-time literal string တစ်ခု လိုက်တဲ့ ပုံစံမျိုး ဖြစ်ပြီး — mixed-sign interval တွေကို ရှင်းလင်းစေဖို့ explicit sign တွေ ထည့်ပေးထားပါတယ်။

`postgres` ပုံစံရဲ့ output က — [DateStyle](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DATESTYLE) parameter ကို `ISO` လို့ သတ်မှတ်ထားချိန် PostgreSQL 8.4 မတိုင်ခင် release တွေရဲ့ output နဲ့ ကိုက်ညီပါတယ်။

`postgres_verbose` ပုံစံရဲ့ output က — `DateStyle` parameter ကို non-`ISO` output လို့ သတ်မှတ်ထားချိန် PostgreSQL 8.4 မတိုင်ခင် release တွေရဲ့ output နဲ့ ကိုက်ညီပါတယ်။

`iso_8601` ပုံစံရဲ့ output က ISO 8601 standard ရဲ့ section 4.4.3.2 မှာ ဖော်ပြထားတဲ့ “format with designators” နဲ့ ကိုက်ညီပါတယ်။

**ဇယား 8.18. Interval Output Style Examples (interval output ပုံစံ ဥပမာများ)**

| Style Specification (ပုံစံ သတ်မှတ်ချက်) | Year-Month Interval (နှစ်-လ interval) | Day-Time Interval (ရက်-အချိန် interval) | Mixed Interval (ရောနှော interval) |
| --- | --- | --- | --- |
| `sql_standard` | 1-2 | 3 4:05:06 | -1-2 +3 -4:05:06 |
| `postgres` | 1 year 2 mons | 3 days 04:05:06 | -1 year -2 mons +3 days -04:05:06 |
| `postgres_verbose` | @ 1 year 2 mons | @ 3 days 4 hours 5 mins 6 secs | @ 1 year 2 mons -3 days 4 hours 5 mins 6 secs ago |
| `iso_8601` | P1Y2M | P3DT4H5M6S | P-1Y-2M3D​T-4H-5M-6S |
