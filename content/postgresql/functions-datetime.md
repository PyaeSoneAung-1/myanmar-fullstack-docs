---
title: "Date/Time Functions and Operators (ရက်စွဲ/အချိန် လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ရဲ့ date/time (ရက်စွဲ/အချိန်) လုပ်ဆောင်ချက်များနှင့် operator များ — date/time arithmetic operator များ၊ EXTRACT/date_part၊ date_trunc၊ date_bin၊ AT TIME ZONE/AT LOCAL၊ လက်ရှိ ရက်စွဲ/အချိန် ရယူခြင်းနှင့် လုပ်ဆောင်မှု နှောင့်နှေးစေခြင်း (pg_sleep စသည်)"
order: 76
source: "https://www.postgresql.org/docs/current/functions-datetime.html"
status: translated
updated: 2026-09-04
---

## 9.9. Date/Time Functions and Operators (ရက်စွဲ/အချိန် လုပ်ဆောင်ချက်များနှင့် operator များ)

- **9.9.1. `EXTRACT`, date_part (date/time တန်ဖိုးများမှ subfield များ ထုတ်ယူခြင်း)**
- **9.9.2. `date_trunc` (date/time တန်ဖိုးကို သတ်မှတ် precision သို့ ဖြတ်တောက်ခြင်း)**
- **9.9.3. `date_bin` (timestamp ကို သတ်မှတ် interval အလိုက် bin လုပ်ခြင်း)**
- **9.9.4. `AT TIME ZONE` and `AT LOCAL` (AT TIME ZONE နှင့် AT LOCAL)**
- **9.9.5. Current Date/Time (လက်ရှိ ရက်စွဲ/အချိန်)**
- **9.9.6. Delaying Execution (လုပ်ဆောင်မှု နှောင့်နှေးစေခြင်း)**

ဇယား 9.33 မှာ date/time (ရက်စွဲ/အချိန်) တန်ဖိုးတွေကို process လုပ်ဖို့ ရနိုင်တဲ့ လုပ်ဆောင်ချက်တွေကို ပြသထားပြီး — အသေးစိတ် အချက်အလက်တွေကို အောက်က subsection တွေမှာ ဖော်ပြထားပါတယ်။ ဇယား 9.32 မှာတော့ အခြေခံ ဂဏန်းသင်္ချာ operator တွေရဲ့ (`+`, `*` စသည်) အပြုအမူတွေကို သရုပ်ဖော်ထားပါတယ်။ Formatting လုပ်ဆောင်ချက်တွေအတွက်တော့ [အပိုင်း 9.8](/docs/postgresql/functions-formatting) ကို ရည်ညွှန်းပါ။ date/time data type တွေရဲ့ နောက်ခံ အချက်အလက်တွေကို [အပိုင်း 8.5](/docs/postgresql/datatype-datetime) မှာ သိရှိထားသင့်ပါတယ်။

ဒါ့အပြင် — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ ပုံမှန် comparison operator တွေကိုလည်း date/time type တွေအတွက် သုံးလို့ ရပါတယ်။ Date တွေနဲ့ timestamp တွေ (time zone ပါသည်ဖြစ်စေ၊ မပါသည်ဖြစ်စေ) အားလုံးကို တစ်ခုနဲ့တစ်ခု နှိုင်းယှဉ်လို့ ရပြီး — time တွေ (time zone ပါ/မပါ) နဲ့ interval တွေကတော့ တူညီတဲ့ data type ထဲက တခြား တန်ဖိုးတွေနဲ့သာ နှိုင်းယှဉ်လို့ ရပါတယ်။ Time zone မပါတဲ့ timestamp ကို time zone ပါတဲ့ timestamp နဲ့ နှိုင်းယှဉ်တဲ့အခါ — ရှေ့က တန်ဖိုးကို [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) configuration parameter က သတ်မှတ်တဲ့ time zone မှာ ပေးထားတယ်လို့ ယူဆပြီး — နောက်က တန်ဖိုး (အတွင်းပိုင်းမှာ UTC ဖြစ်နေပြီးသား) နဲ့ နှိုင်းယှဉ်ဖို့ UTC အဖြစ် လှည့်ပတ် (rotate) လုပ်ပါတယ်။ အလားတူပဲ — date တန်ဖိုးတစ်ခုကို timestamp တစ်ခုနဲ့ နှိုင်းယှဉ်တဲ့အခါ အဲဒီ date က `TimeZone` zone ထဲက သန်းခေါင်ယံ (midnight) အချိန်ကို ကိုယ်စားပြုတယ်လို့ ယူဆပါတယ်။

အောက်မှာ ဖော်ပြထားတဲ့ — `time` သို့မဟုတ် `timestamp` input တွေကို လက်ခံတဲ့ လုပ်ဆောင်ချက်တွေနဲ့ operator တွေ အားလုံးက တကယ်တော့ မျိုးကွဲ နှစ်မျိုး ရှိပါတယ်: တစ်မျိုးက `time with time zone` သို့မဟုတ် `timestamp with time zone` ကို လက်ခံပြီး — နောက်တစ်မျိုးက `time without time zone` သို့မဟုတ် `timestamp without time zone` ကို လက်ခံပါတယ်။ အတိုချုံးဖို့အတွက် — ဒီ မျိုးကွဲတွေကို သပ်သပ်စီ ပြမထားပါဘူး။ ဒါ့အပြင် — `+` နဲ့ `*` operator တွေက commutative (နေရာလဲလှယ်၍ ရသော) အတွဲတွေ အနေနဲ့ ရှိပါတယ် (ဥပမာ — `date` `+` `integer` ရော `integer` `+` `date` ရော နှစ်မျိုးလုံး)။ အဲဒီလို အတွဲတစ်ခုစီထဲက တစ်ခုကိုပဲ ဒီမှာ ပြထားပါတယ်။

**ဇယား 9.32. Date/Time Operators (ရက်စွဲ/အချိန် operator များ)**

| Operator ဖော်ပြချက်နှင့် ဥပမာ(များ) |
| --- |
| date + integer → date ရက်စွဲတစ်ခုသို့ ရက်အရေအတွက် တစ်ခု ပေါင်းထည့်ပါတယ်။ ဥပမာ — date '2001-09-28' + 7 → 2001-10-05 |
| date + interval → timestamp ရက်စွဲတစ်ခုသို့ interval တစ်ခု ပေါင်းထည့်ပါတယ်။ ဥပမာ — date '2001-09-28' + interval '1 hour' → 2001-09-28 01:00:00 |
| date + time → timestamp ရက်စွဲတစ်ခုသို့ time-of-day (နေ့အချိန်) တစ်ခု ပေါင်းထည့်ပါတယ်။ ဥပမာ — date '2001-09-28' + time '03:00' → 2001-09-28 03:00:00 |
| interval + interval → interval interval များ ပေါင်းထည့်ပါတယ်။ ဥပမာ — interval '1 day' + interval '1 hour' → 1 day 01:00:00 |
| timestamp + interval → timestamp timestamp တစ်ခုသို့ interval တစ်ခု ပေါင်းထည့်ပါတယ်။ ဥပမာ — timestamp '2001-09-28 01:00' + interval '23 hours' → 2001-09-29 00:00:00 |
| time + interval → time time တစ်ခုသို့ interval တစ်ခု ပေါင်းထည့်ပါတယ်။ ဥပမာ — time '01:00' + interval '3 hours' → 04:00:00 |
| - interval → interval interval တစ်ခုကို အနုတ် ပြောင်းပါတယ်။ ဥပမာ — - interval '23 hours' → -23:00:00 |
| date - date → integer ရက်စွဲများ နုတ်ပြီး — ကုန်လွန်ခဲ့သော ရက် အရေအတွက်ကို ထုတ်ပေးပါတယ်။ ဥပမာ — date '2001-10-01' - date '2001-09-28' → 3 |
| date - integer → date ရက်စွဲတစ်ခုမှ ရက်အရေအတွက် တစ်ခုကို နုတ်ပါတယ်။ ဥပမာ — date '2001-10-01' - 7 → 2001-09-24 |
| date - interval → timestamp ရက်စွဲတစ်ခုမှ interval တစ်ခုကို နုတ်ပါတယ်။ ဥပမာ — date '2001-09-28' - interval '1 hour' → 2001-09-27 23:00:00 |
| time - time → interval time များ နုတ်ပါတယ်။ ဥပမာ — time '05:00' - time '03:00' → 02:00:00 |
| time - interval → time time တစ်ခုမှ interval တစ်ခုကို နုတ်ပါတယ်။ ဥပမာ — time '05:00' - interval '2 hours' → 03:00:00 |
| timestamp - interval → timestamp timestamp တစ်ခုမှ interval တစ်ခုကို နုတ်ပါတယ်။ ဥပမာ — timestamp '2001-09-28 23:00' - interval '23 hours' → 2001-09-28 00:00:00 |
| interval - interval → interval interval များ နုတ်ပါတယ်။ ဥပမာ — interval '1 day' - interval '1 hour' → 1 day -01:00:00 |
| timestamp - timestamp → interval timestamp များ နုတ်ပါတယ် (နာရီ 24 နာရီစီ ပါဝင်တဲ့ interval များကို justify_hours() ကဲ့သို့ပဲ ရက်များအဖြစ် ပြောင်းပေးသည်)။ ဥပမာ — timestamp '2001-09-29 03:00' - timestamp '2001-07-27 12:00' → 63 days 15:00:00 |
| interval * double precision → interval interval တစ်ခုကို scalar (ကိန်းတစ်ခု) ဖြင့် မြှောက်ပါတယ်။ ဥပမာ — interval '1 second' * 900 → 00:15:00 interval '1 day' * 21 → 21 days interval '1 hour' * 3.5 → 03:30:00 |
| interval / double precision → interval interval တစ်ခုကို scalar (ကိန်းတစ်ခု) ဖြင့် စားပါတယ်။ ဥပမာ — interval '1 hour' / 1.5 → 00:40:00 |

**ဇယား 9.33. Date/Time Functions (ရက်စွဲ/အချိန် လုပ်ဆောင်ချက်များ)**

| လုပ်ဆောင်ချက် ဖော်ပြချက်နှင့် ဥပမာ(များ) |
| --- |
| age ( timestamp, timestamp ) → interval arguments များကို နုတ်ပြီး — ရက်များသက်သက် မဟုတ်ဘဲ နှစ်နှင့် လများကို သုံးသော “symbolic” ရလဒ်ကို ထုတ်ပေးပါတယ်။ ဥပမာ — age(timestamp '2001-04-10', timestamp '1957-06-13') → 43 years 9 mons 27 days |
| age ( timestamp ) → interval argument ကို current_date (သန်းခေါင်ယံ အချိန်၌) မှ နုတ်ပါတယ်။ ဥပမာ — age(timestamp '1957-06-13') → 62 years 6 mons 10 days |
| clock_timestamp ( ) → timestamp with time zone လက်ရှိ ရက်စွဲနှင့် အချိန် (statement တစ်ခု execute လုပ်နေစဉ်အတွင်း ပြောင်းလဲပါသည်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — clock_timestamp() → 2019-12-23 14:39:53.662522-05 |
| current_date → date လက်ရှိ ရက်စွဲ; အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — current_date → 2019-12-23 |
| current_time → time with time zone လက်ရှိ နေ့အချိန်; အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — current_time → 14:39:53.662522-05 |
| current_time ( integer ) → time with time zone အကန့်အသတ်ရှိသော precision ဖြင့် လက်ရှိ နေ့အချိန်; အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — current_time(2) → 14:39:53.66-05 |
| current_timestamp → timestamp with time zone လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ transaction ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — current_timestamp → 2019-12-23 14:39:53.662522-05 |
| current_timestamp ( integer ) → timestamp with time zone အကန့်အသတ်ရှိသော precision ဖြင့် လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ transaction ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — current_timestamp(0) → 2019-12-23 14:39:53-05 |
| date_add ( timestamp with time zone, interval [, text ] ) → timestamp with time zone timestamp with time zone တစ်ခုသို့ interval တစ်ခုကို ပေါင်းထည့်ပြီး — တတိယ argument က နာမည်ပေးထားတဲ့ time zone (သို့မဟုတ် ၎င်းကို ချန်လှပ်ထားရင် လက်ရှိ TimeZone setting) အရ နေ့အချိန်နှင့် daylight-savings ချိန်ညှိမှုများကို တွက်ချက်ပါတယ်။ Argument နှစ်ခုပါသော ပုံစံက timestamp with time zone + interval operator နှင့် ညီမျှပါတယ်။ ဥပမာ — date_add('2021-10-31 00:00:00+02'::timestamptz, '1 day'::interval, 'Europe/Warsaw') → 2021-10-31 23:00:00+00 |
| date_bin ( interval, timestamp, timestamp ) → timestamp input ကို သတ်မှတ်ထားသော origin နှင့် ညှိထားသည့် သတ်မှတ် interval အလိုက် bin လုပ်ပါတယ်; အပိုင်း 9.9.3 ကို ကြည့်ပါ။ ဥပမာ — date_bin('15 minutes', timestamp '2001-02-16 20:38:40', timestamp '2001-02-16 20:05:00') → 2001-02-16 20:35:00 |
| date_part ( text, timestamp ) → double precision timestamp ၏ subfield ကို ရယူပါတယ် (extract နှင့် ညီမျှ); အပိုင်း 9.9.1 ကို ကြည့်ပါ။ ဥပမာ — date_part('hour', timestamp '2001-02-16 20:38:40') → 20 |
| date_part ( text, interval ) → double precision interval ၏ subfield ကို ရယူပါတယ် (extract နှင့် ညီမျှ); အပိုင်း 9.9.1 ကို ကြည့်ပါ။ ဥပမာ — date_part('month', interval '2 years 3 months') → 3 |
| date_subtract ( timestamp with time zone, interval [, text ] ) → timestamp with time zone timestamp with time zone တစ်ခုမှ interval တစ်ခုကို နုတ်ပြီး — တတိယ argument က နာမည်ပေးထားတဲ့ time zone (သို့မဟုတ် ၎င်းကို ချန်လှပ်ထားရင် လက်ရှိ TimeZone setting) အရ နေ့အချိန်နှင့် daylight-savings ချိန်ညှိမှုများကို တွက်ချက်ပါတယ်။ Argument နှစ်ခုပါသော ပုံစံက timestamp with time zone - interval operator နှင့် ညီမျှပါတယ်။ ဥပမာ — date_subtract('2021-11-01 00:00:00+01'::timestamptz, '1 day'::interval, 'Europe/Warsaw') → 2021-10-30 22:00:00+00 |
| date_trunc ( text, timestamp ) → timestamp သတ်မှတ်ထားသော precision အထိ ဖြတ်တောက်ပါတယ်; အပိုင်း 9.9.2 ကို ကြည့်ပါ။ ဥပမာ — date_trunc('hour', timestamp '2001-02-16 20:38:40') → 2001-02-16 20:00:00 |
| date_trunc ( text, timestamp with time zone, text ) → timestamp with time zone သတ်မှတ်ထားသော time zone တွင် သတ်မှတ်ထားသော precision အထိ ဖြတ်တောက်ပါတယ်; အပိုင်း 9.9.2 ကို ကြည့်ပါ။ ဥပမာ — date_trunc('day', timestamptz '2001-02-16 20:38:40+00', 'Australia/Sydney') → 2001-02-16 13:00:00+00 |
| date_trunc ( text, interval ) → interval သတ်မှတ်ထားသော precision အထိ ဖြတ်တောက်ပါတယ်; အပိုင်း 9.9.2 ကို ကြည့်ပါ။ ဥပမာ — date_trunc('hour', interval '2 days 3 hours 40 minutes') → 2 days 03:00:00 |
| extract ( field from timestamp ) → numeric timestamp ၏ subfield ကို ရယူပါတယ်; အပိုင်း 9.9.1 ကို ကြည့်ပါ။ ဥပမာ — extract(hour from timestamp '2001-02-16 20:38:40') → 20 |
| extract ( field from interval ) → numeric interval ၏ subfield ကို ရယူပါတယ်; အပိုင်း 9.9.1 ကို ကြည့်ပါ။ ဥပမာ — extract(month from interval '2 years 3 months') → 3 |
| isfinite ( date ) → boolean finite (အကန့်အသတ်ရှိသော) ရက်စွဲ ဟုတ်မဟုတ် စစ်ဆေးပါတယ် (+/-infinity မဟုတ်သည်)။ ဥပမာ — isfinite(date '2001-02-16') → true |
| isfinite ( timestamp ) → boolean finite timestamp ဟုတ်မဟုတ် စစ်ဆေးပါတယ် (+/-infinity မဟုတ်သည်)။ ဥပမာ — isfinite(timestamp 'infinity') → false |
| isfinite ( interval ) → boolean finite interval ဟုတ်မဟုတ် စစ်ဆေးပါတယ် (+/-infinity မဟုတ်သည်)။ ဥပမာ — isfinite(interval '4 hours') → true |
| justify_days ( interval ) → interval ရက် 30 ပါဝင်သော အချိန်ကာလများကို လများအဖြစ် ပြောင်းပြီး interval ကို ချိန်ညှိပါတယ်။ ဥပမာ — justify_days(interval '1 year 65 days') → 1 year 2 mons 5 days |
| justify_hours ( interval ) → interval နာရီ 24 ပါဝင်သော အချိန်ကာလများကို ရက်များအဖြစ် ပြောင်းပြီး interval ကို ချိန်ညှိပါတယ်။ ဥပမာ — justify_hours(interval '50 hours 10 minutes') → 2 days 02:10:00 |
| justify_interval ( interval ) → interval justify_days နှင့် justify_hours ကို သုံးပြီး — ထပ်ဆောင်း sign ချိန်ညှိမှုများဖြင့် interval ကို ချိန်ညှိပါတယ်။ ဥပမာ — justify_interval(interval '1 mon -1 hour') → 29 days 23:00:00 |
| localtime → time လက်ရှိ နေ့အချိန်; အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — localtime → 14:39:53.662522 |
| localtime ( integer ) → time အကန့်အသတ်ရှိသော precision ဖြင့် လက်ရှိ နေ့အချိန်; အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — localtime(0) → 14:39:53 |
| localtimestamp → timestamp လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ transaction ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — localtimestamp → 2019-12-23 14:39:53.662522 |
| localtimestamp ( integer ) → timestamp အကန့်အသတ်ရှိသော precision ဖြင့် လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ transaction ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — localtimestamp(2) → 2019-12-23 14:39:53.66 |
| make_date ( year int, month int, day int ) → date year, month နှင့် day fields များမှ ရက်စွဲကို ဖန်တီးပါတယ် (အနုတ် year များက BC ကို ညွှန်ပြသည်)။ ဥပမာ — make_date(2013, 7, 15) → 2013-07-15 |
| make_interval ( [ years int [, months int [, weeks int [, days int [, hours int [, mins int [, secs double precision ]]]]]]] ) → interval year, months, weeks, days, hours, minutes နှင့် seconds fields များမှ interval ကို ဖန်တီးပါတယ် — field တစ်ခုစီသည် zero အဖြစ် default ဖြစ်နိုင်သည်။ ဥပမာ — make_interval(days => 10) → 10 days |
| make_time ( hour int, min int, sec double precision ) → time hour, minute နှင့် seconds fields များမှ time ကို ဖန်တီးပါတယ်။ ဥပမာ — make_time(8, 15, 23.5) → 08:15:23.5 |
| make_timestamp ( year int, month int, day int, hour int, min int, sec double precision ) → timestamp year, month, day, hour, minute နှင့် seconds fields များမှ timestamp ကို ဖန်တီးပါတယ် (အနုတ် year များက BC ကို ညွှန်ပြသည်)။ ဥပမာ — make_timestamp(2013, 7, 15, 8, 15, 23.5) → 2013-07-15 08:15:23.5 |
| make_timestamptz ( year int, month int, day int, hour int, min int, sec double precision [, timezone text ] ) → timestamp with time zone year, month, day, hour, minute နှင့် seconds fields များမှ timestamp with time zone ကို ဖန်တီးပါတယ် (အနုတ် year များက BC ကို ညွှန်ပြသည်)။ timezone ကို သတ်မှတ်မထားရင် လက်ရှိ time zone ကို သုံးပါတယ်; ဥပမာများတွင် session time zone သည် Europe/London ဖြစ်သည်ဟု ယူဆထားသည်။ ဥပမာ — make_timestamptz(2013, 7, 15, 8, 15, 23.5) → 2013-07-15 08:15:23.5+01 make_timestamptz(2013, 7, 15, 8, 15, 23.5, 'America/New_York') → 2013-07-15 13:15:23.5+01 |
| now ( ) → timestamp with time zone လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ transaction ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — now() → 2019-12-23 14:39:53.662522-05 |
| statement_timestamp ( ) → timestamp with time zone လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ statement ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — statement_timestamp() → 2019-12-23 14:39:53.662522-05 |
| timeofday ( ) → text လက်ရှိ ရက်စွဲနှင့် အချိန် (clock_timestamp ကဲ့သို့ပင် — သို့သော် text string အနေနှင့်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — timeofday() → Mon Dec 23 14:39:53.662522 2019 EST |
| transaction_timestamp ( ) → timestamp with time zone လက်ရှိ ရက်စွဲနှင့် အချိန် (လက်ရှိ transaction ၏ စတင်ချိန်); အပိုင်း 9.9.5 ကို ကြည့်ပါ။ ဥပမာ — transaction_timestamp() → 2019-12-23 14:39:53.662522-05 |
| to_timestamp ( double precision ) → timestamp with time zone Unix epoch (1970-01-01 00:00:00+00 မှ စက္ကန့် အရေအတွက်) ကို timestamp with time zone အဖြစ် ပြောင်းပေးပါတယ်။ ဥပမာ — to_timestamp(1284352323) → 2010-09-13 04:32:03+00 |

ဒီ လုပ်ဆောင်ချက်တွေအပြင် — SQL ရဲ့ `OVERLAPS` operator ကိုလည်း ထောက်ပံ့ထားပါတယ်:

```sql
(start1, end1) OVERLAPS (start2, end2)
(start1, length1) OVERLAPS (start2, length2)
```

ဒီ expression က — အဆုံးမှတ် (endpoint) များဖြင့် သတ်မှတ်ထားတဲ့ အချိန်ကာလ နှစ်ခု တစ်ခုနဲ့တစ်ခု ထပ်နေရင် true ပြန်ပေးပြီး — ထပ်မနေရင် false ပြန်ပေးပါတယ်။ အဆုံးမှတ်တွေကို date, time, သို့မဟုတ် timestamp အတွဲများအနေနှင့် ဖြစ်စေ — date, time, သို့မဟုတ် timestamp တစ်ခုနောက်မှ interval တစ်ခု လိုက်သော ပုံစံဖြင့် ဖြစ်စေ သတ်မှတ်နိုင်ပါတယ်။ တန်ဖိုးအတွဲတစ်ခု ပေးတဲ့အခါ — start ကို ရှေ့မှာ ရေးသည်ဖြစ်စေ end ကို ရှေ့မှာ ရေးသည်ဖြစ်စေ ရပါတယ်; `OVERLAPS` က အတွဲထဲက စောသော တန်ဖိုးကို start အဖြစ် အလိုအလျောက် ယူပါတယ်။ အချိန်ကာလ တစ်ခုစီကို — `start` `<=` `time` `<` `end` ဖြစ်သော half-open interval (တစ်ဖက်ပွင့် interval) ကို ကိုယ်စားပြုသည်ဟု မှတ်ယူပြီး — `start` နဲ့ `end` တူညီနေသော ကိစ္စမှာတော့ အဲဒီ တစ်ခုတည်းသော အချိန်မှတ် (time instant) ကို ကိုယ်စားပြုပါတယ်။ ဆိုလိုတာက — ဥပမာ — အဆုံးမှတ်တစ်ခုတည်းသာ တူညီနေတဲ့ အချိန်ကာလ နှစ်ခုသည် ထပ်နေခြင်း မရှိပါဘူး။

```sql
SELECT (DATE '2001-02-16', DATE '2001-12-21') OVERLAPS
       (DATE '2001-10-30', DATE '2002-10-30');
Result: true
SELECT (DATE '2001-02-16', INTERVAL '100 days') OVERLAPS
       (DATE '2001-10-30', DATE '2002-10-30');
Result: false
SELECT (DATE '2001-10-29', DATE '2001-10-30') OVERLAPS
       (DATE '2001-10-30', DATE '2001-10-31');
Result: false
SELECT (DATE '2001-10-30', DATE '2001-10-30') OVERLAPS
       (DATE '2001-10-30', DATE '2001-10-31');
Result: true
```

`timestamp` သို့မဟုတ် `timestamp with time zone` တန်ဖိုးတစ်ခုသို့ `interval` တန်ဖိုးတစ်ခုကို ပေါင်းတဲ့အခါ (သို့မဟုတ် ၎င်းမှ `interval` တန်ဖိုးတစ်ခုကို နုတ်တဲ့အခါ) — interval တန်ဖိုးရဲ့ months, days နဲ့ microseconds field များကို အစဉ်လိုက် ကိုင်တွယ်ပါတယ်။ ပထမဆုံး — သုည မဟုတ်သော months field က timestamp ၏ ရက်စွဲကို ညွှန်ပြထားတဲ့ လအရေအတွက်အတိုင်း ရှေ့သို့ ရွှေ့သည် သို့မဟုတ် နောက်သို့ ရွှေ့ပြီး — လ၏ ရက်ကို တူညီအောင် ထားပါတယ်; သို့သော် အဲဒီရက်သည် လသစ်၏ နောက်ဆုံးရက်ထက် ကျော်လွန်သွားမည်ဆိုပါက — အဲဒီလ၏ နောက်ဆုံးရက်ကို သုံးပါတယ်။ (ဥပမာ — March 31 ပေါင်း 1 month က April 30 ဖြစ်လာပြီး March 31 ပေါင်း 2 months ကတော့ May 31 ဖြစ်ပါတယ်။) ထို့နောက် days field က timestamp ၏ ရက်စွဲကို ညွှန်ပြထားတဲ့ ရက်အရေအတွက်အတိုင်း ရှေ့သို့ ရွှေ့သည် သို့မဟုတ် နောက်သို့ ရွှေ့ပါတယ်။ ဒီအဆင့် နှစ်ခုလုံးတွင် — ထိုနေ့၏ local time (နေ့အချိန်) ကို တူညီအောင် ထားပါတယ်။ နောက်ဆုံးအနေနှင့် — သုည မဟုတ်သော microseconds field ရှိပါက — ၎င်းကို စာသားအတိုင်း (literally) ပေါင်းသည် သို့မဟုတ် နုတ်ပါတယ်။ DST (နေ့အလင်းရောင် ချွေတာချိန် — daylight saving time) ကို အသိအမှတ်ပြုသော time zone တစ်ခုတွင် `timestamp with time zone` တန်ဖိုးဖြင့် ဂဏန်းသင်္ချာ လုပ်ဆောင်သည့်အခါ — ဒါက `interval '1 day'` ကို ပေါင်းခြင်း/နုတ်ခြင်းသည် `interval '24 hours'` ကို ပေါင်းခြင်း/နုတ်ခြင်းနှင့် ရလဒ် မတူညီနိုင်ဟု ဆိုလိုပါတယ်။ ဥပမာ — session time zone ကို `America/Denver` အဖြစ် သတ်မှတ်ထားလျှင်:

```sql
SELECT timestamp with time zone '2005-04-02 12:00:00-07' + interval '1 day';
Result: 2005-04-03 12:00:00-06
SELECT timestamp with time zone '2005-04-02 12:00:00-07' + interval '24 hours';
Result: 2005-04-03 13:00:00-06
```

ဒါဖြစ်ရတာက — `America/Denver` time zone တွင် 2005-04-03 02:00:00 ၌ daylight saving time ပြောင်းလဲမှုကြောင့် နာရီတစ်နာရီ ခုန်ကျော် (skip) ခံခဲ့ရလို့ ဖြစ်ပါတယ်။

`age` က ပြန်ပေးသော months field တွင် မရှင်းလင်းမှု (ambiguity) ရှိနိုင်တာ သတိပြုပါ — ဘာကြောင့်လဲဆိုတော့ လတစ်လစီတွင် ရက်အရေအတွက် မတူညီလို့ ဖြစ်ပါတယ်။ PostgreSQL ၏ ချဉ်းကပ်ပုံမှာ — လတစ်စိတ်တစ်ပိုင်း (partial months) တွက်ချက်ရာတွင် ရက်စွဲ နှစ်ခုထဲက စောသော တစ်ခု၏ လကို သုံးပါတယ်။ ဥပမာ — `age('2004-06-01', '2004-04-30')` သည် April ကို သုံးသဖြင့် `1 mon 1 day` ရပြီး — May ကို သုံးမည်ဆိုပါက `1 mon 2 days` ရမည် ဖြစ်ပါတယ်။ အကြောင်းမှာ May တွင် 31 ရက် ရှိပြီး April တွင် 30 ရက်သာ ရှိလို့ ဖြစ်ပါတယ်။

Date နဲ့ timestamp များ၏ နုတ်ခြင်းသည်လည်း ရှုပ်ထွေးနိုင်ပါတယ်။ နုတ်ရန် သဘောတရားအရ ရိုးရှင်းသော နည်းလမ်းတစ်ခုမှာ — တန်ဖိုးတစ်ခုစီကို `EXTRACT(EPOCH FROM ...)` သုံး၍ စက္ကန့် အရေအတွက်အဖြစ် ပြောင်းပြီးမှ — ရလဒ်များကို နုတ်လိုက်ခြင်း ဖြစ်ပါတယ်; ဒါက တန်ဖိုး နှစ်ခုကြားရှိ စက္ကန့် အရေအတွက်ကို ထုတ်ပေးပါတယ်။ ဤနည်းလမ်းသည် လတစ်လစီရှိ ရက်အရေအတွက်၊ time zone ပြောင်းလဲမှုများနှင့် daylight saving time ချိန်ညှိမှုများအတွက်ပါ ထည့်သွင်း ချိန်ညှိပေးပါတယ်။ `-` operator ဖြင့် date သို့မဟုတ် timestamp တန်ဖိုးများကို နုတ်ခြင်းက — တန်ဖိုးများကြားရှိ ရက် (နာရီ 24 နာရီစီ) အရေအတွက်နှင့် နာရီ/မိနစ်/စက္ကန့်များကို ပြန်ပေးပြီး — အလားတူ ချိန်ညှိမှုများကိုပါ ပြုလုပ်ပါတယ်။ `age` function ကမူ — field အလိုက် နုတ်ယူပြီး အနုတ်တန်ဖိုး ဖြစ်နေသော field များအတွက် ချိန်ညှိမှုများ ပြုလုပ်ကာ — နှစ်၊ လ၊ ရက်နှင့် နာရီ/မိနစ်/စက္ကန့်များကို ပြန်ပေးပါတယ်။ အောက်ပါ query များသည် ဤချဉ်းကပ်နည်းများ၏ ကွာခြားချက်များကို သရုပ်ဖော်ပါတယ်။ နမူနာ ရလဒ်များကို `timezone = 'US/Eastern'` ဖြင့် ထုတ်ထားခြင်း ဖြစ်ပြီး — အသုံးပြုထားသော ရက်စွဲ နှစ်ခုကြားတွင် daylight saving time ပြောင်းလဲမှုတစ်ခု ရှိပါတယ်:

```sql
SELECT EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
       EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00');
Result: 10537200.000000
SELECT (EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
        EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00'))
        / 60 / 60 / 24;
Result: 121.9583333333333333
SELECT timestamptz '2013-07-01 12:00:00' - timestamptz '2013-03-01 12:00:00';
Result: 121 days 23:00:00
SELECT age(timestamptz '2013-07-01 12:00:00', timestamptz '2013-03-01 12:00:00');
Result: 4 mons
```

### 9.9.1. `EXTRACT`, date_part (date/time တန်ဖိုးများမှ subfield များ ထုတ်ယူခြင်း)

```sql
EXTRACT(field FROM source)
```

`extract` function သည် date/time တန်ဖိုးများမှ year သို့မဟုတ် hour ကဲ့သို့သော subfield များကို ထုတ်ယူပါတယ်။ `source` သည် `timestamp`, `date`, `time`, သို့မဟုတ် `interval` type ရှိသော value expression တစ်ခု ဖြစ်ရပါမယ်။ (Timestamp နှင့် time များသည် time zone ပါသည်ဖြစ်စေ၊ မပါသည်ဖြစ်စေ ရပါတယ်။) `field` သည် source တန်ဖိုးမှ မည်သည့် field ကို ထုတ်ယူမည်ကို ရွေးချယ်ပေးသော identifier တစ်ခု သို့မဟုတ် string တစ်ခု ဖြစ်ပါတယ်။ field တိုင်းသည် input data type တိုင်းအတွက် တရားဝင် (valid) မဟုတ်ပါဘူး; ဥပမာ — ရက်ထက် သေးငယ်သော field များကို `date` တစ်ခုမှ ထုတ်၍ မရသလို — ရက် သို့မဟုတ် ထိုထက်ကြီးသော field များကိုလည်း `time` တစ်ခုမှ ထုတ်၍ မရပါဘူး။ `extract` function သည် `numeric` type တန်ဖိုးများကို ပြန်ပေးပါတယ်။

အောက်ပါတို့သည် တရားဝင် field name များ ဖြစ်ပါတယ်:

- **century** — ရာစုနှစ်; interval တန်ဖိုးများအတွက်မူ year field ကို 100 ဖြင့် စားထားသော တန်ဖိုး

SELECT EXTRACT(CENTURY FROM TIMESTAMP '2000-12-16 12:21:13');
Result: 20
SELECT EXTRACT(CENTURY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 21
SELECT EXTRACT(CENTURY FROM DATE '0001-01-01 AD');
Result: 1
SELECT EXTRACT(CENTURY FROM DATE '0001-12-31 BC');
Result: -1
SELECT EXTRACT(CENTURY FROM INTERVAL '2001 years');
Result: 20
- **day** — လထဲရှိ ရက် (1–31); interval တန်ဖိုးများအတွက်မူ ရက်အရေအတွက်

SELECT EXTRACT(DAY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 16
SELECT EXTRACT(DAY FROM INTERVAL '40 days 1 minute');
Result: 40
- **decade** — year field ကို 10 ဖြင့် စားထားသော တန်ဖိုး

SELECT EXTRACT(DECADE FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 200
- **dow** — Sunday (0) မှ Saturday (6) အထိ တစ်ပတ်၏ ရက်

SELECT EXTRACT(DOW FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 5

extract ၏ day-of-week နံပါတ်စဉ်သည် to_char(..., 'D') function ၏ နံပါတ်စဉ်နှင့် ကွဲပြားကြောင်း သတိပြုပါ။
- **doy** — တစ်နှစ်တာအတွင်းရှိ ရက် (1–365/366)

SELECT EXTRACT(DOY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 47
- **epoch** — `timestamp with time zone` တန်ဖိုးများအတွက် — 1970-01-01 00:00:00 UTC မှစ၍ စက္ကန့် အရေအတွက် (ထိုအချိန်ထက် စောသော timestamp များအတွက် အနုတ်); date နှင့် timestamp တန်ဖိုးများအတွက် — timezone သို့မဟုတ် daylight-savings စည်းမျဉ်းများကို ထည့်မတွက်ဘဲ 1970-01-01 00:00:00 မှစ၍ အမည်ခံ (nominal) စက္ကန့် အရေအတွက်; interval တန်ဖိုးများအတွက်မူ interval အတွင်းရှိ စုစုပေါင်း စက္ကန့် အရေအတွက်

SELECT EXTRACT(EPOCH FROM TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40.12-08');
Result: 982384720.120000
SELECT EXTRACT(EPOCH FROM TIMESTAMP '2001-02-16 20:38:40.12');
Result: 982355920.120000
SELECT EXTRACT(EPOCH FROM INTERVAL '5 days 3 hours');
Result: 442800.000000

epoch တန်ဖိုးတစ်ခုကို to_timestamp ဖြင့် timestamp with time zone အဖြစ် ပြန်ပြောင်းနိုင်ပါတယ်:

SELECT to_timestamp(982384720.12);
Result: 2001-02-17 04:38:40.12+00

date သို့မဟုတ် timestamp တန်ဖိုးတစ်ခုမှ ထုတ်ယူထားသော epoch တစ်ခုကို to_timestamp သို့ အသုံးပြုခြင်းသည် လှည့်ဖြားဖွယ် ရလဒ်တစ်ခုကို ဖြစ်ပေါ်စေနိုင်သည်ကို သတိထားပါ: ရလဒ်သည် မူလတန်ဖိုးကို UTC တွင် ပေးထားခဲ့သည်ဟု ထိရောက်စွာ ယူဆမည် ဖြစ်ပြီး — ၎င်းသည် အမှန်တကယ် မဟုတ်နိုင်ပါဘူး။
- **hour** — hour field (timestamp များတွင် 0–23၊ interval များတွင်မူ အကန့်အသတ်မရှိ)

SELECT EXTRACT(HOUR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 20
- **isodow** — Monday (1) မှ Sunday (7) အထိ တစ်ပတ်၏ ရက်

SELECT EXTRACT(ISODOW FROM TIMESTAMP '2001-02-18 20:38:40');
Result: 7

ဤသည်မှာ Sunday မှလွဲ၍ dow နှင့် တူညီပါတယ်။ ၎င်းသည် ISO 8601 ၏ day-of-week နံပါတ်စဉ်နှင့် ကိုက်ညီပါတယ်။
- **isoyear** — ရက်စွဲ ကျရောက်သည့် ISO 8601 week-numbering year

SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-01');
Result: 2005
SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-02');
Result: 2006

ISO 8601 week-numbering year တစ်ခုစီသည် — ဇန်နဝါရီ 4 ရက် ပါဝင်သော ရက်သတ္တပတ်၏ တနင်္လာနေ့တွင် စတင်ပါတယ် — ထို့ကြောင့် ဇန်နဝါရီ အစောပိုင်း သို့မဟုတ် ဒီဇင်ဘာ နှောင်းပိုင်းတွင် ISO year သည် Gregorian year နှင့် ကွဲပြားနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် week field ကို ကြည့်ပါ။
- **julian** — date သို့မဟုတ် timestamp နှင့် သက်ဆိုင်သော Julian Date (ဂျူလီယန် ရက်စွဲ)။ Local midnight မဟုတ်သော timestamp များသည် ဒသမ (fractional) တန်ဖိုး ရလဒ်ထွက်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် အပိုင်း B.7 ကို ကြည့်ပါ။

SELECT EXTRACT(JULIAN FROM DATE '2006-01-01');
Result: 2453737
SELECT EXTRACT(JULIAN FROM TIMESTAMP '2006-01-01 12:00');
Result: 2453737.50000000000000000000
- **microseconds** — ဒသမအပိုင်းများ အပါအဝင် seconds field ကို 1 000 000 ဖြင့် မြှောက်ထားသော တန်ဖိုး; ၎င်းတွင် စက္ကန့် အပြည့်များပါ ပါဝင်ကြောင်း သတိပြုပါ

SELECT EXTRACT(MICROSECONDS FROM TIME '17:12:28.5');
Result: 28500000
- **millennium** — ထောင်စုနှစ်; interval တန်ဖိုးများအတွက်မူ year field ကို 1000 ဖြင့် စားထားသော တန်ဖိုး

SELECT EXTRACT(MILLENNIUM FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 3
SELECT EXTRACT(MILLENNIUM FROM INTERVAL '2001 years');
Result: 2

1900 ပြည့်လွန် နှစ်များသည် ဒုတိယ ထောင်စုနှစ်အတွင်းတွင် ရှိပါတယ်။ တတိယ ထောင်စုနှစ်သည် 2001 ခုနှစ် ဇန်နဝါရီ 1 ရက်တွင် စတင်ခဲ့ပါတယ်။
- **milliseconds** — ဒသမအပိုင်းများ အပါအဝင် seconds field ကို 1000 ဖြင့် မြှောက်ထားသော တန်ဖိုး။ ၎င်းတွင် စက္ကန့် အပြည့်များပါ ပါဝင်ကြောင်း သတိပြုပါ။

SELECT EXTRACT(MILLISECONDS FROM TIME '17:12:28.5');
Result: 28500.000
- **minute** — မိနစ်များကို ရည်ညွှန်းသော field (0–59)

SELECT EXTRACT(MINUTE FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 38
- **month** — တစ်နှစ်အတွင်းရှိ လ၏ နံပါတ် (1–12); interval တန်ဖိုးများအတွက်မူ months အရေအတွက်ကို 12 ဖြင့် modulo တွက်ထားသော တန်ဖိုး (0–11)

SELECT EXTRACT(MONTH FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 2
SELECT EXTRACT(MONTH FROM INTERVAL '2 years 3 months');
Result: 3
SELECT EXTRACT(MONTH FROM INTERVAL '2 years 13 months');
Result: 1
- **quarter** — ရက်စွဲ ကျရောက်နေသော နှစ်၏ သုံးလပတ် (1–4); interval တန်ဖိုးများအတွက်မူ month field ကို 3 ဖြင့် စားပြီး 1 ပေါင်းထားသော တန်ဖိုး

SELECT EXTRACT(QUARTER FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 1
SELECT EXTRACT(QUARTER FROM INTERVAL '1 year 6 months');
Result: 3
- **second** — ဒသမစက္ကန့်များ အပါအဝင် seconds field

SELECT EXTRACT(SECOND FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 40.000000
SELECT EXTRACT(SECOND FROM TIME '17:12:28.5');
Result: 28.500000
- **timezone** — UTC မှ time zone offset ကို စက္ကန့်ဖြင့် တိုင်းတာသော တန်ဖိုး။ Positive တန်ဖိုးများသည် UTC ၏ အရှေ့ဘက် time zone များနှင့် သက်ဆိုင်ပြီး — negative တန်ဖိုးများသည် UTC ၏ အနောက်ဘက် zone များနှင့် သက်ဆိုင်ပါတယ်။ (နည်းပညာအရ — PostgreSQL သည် leap second (ရက်ပို စက္ကန့်) များကို ကိုင်တွယ်မှု မရှိသောကြောင့် UTC ကို အတိအကျ အသုံးမပြုပါဘူး။)
- **timezone_hour** — time zone offset ၏ hour အစိတ်အပိုင်း
- **timezone_minute** — time zone offset ၏ minute အစိတ်အပိုင်း
- **week** — ISO 8601 week-numbering စနစ်အရ တစ်နှစ်တာအတွင်း ရက်သတ္တပတ် ၏ နံပါတ်။ အဓိပ္ပာယ်ဖွင့်ဆိုချက်အရ — ISO ရက်သတ္တပတ်များသည် တနင်္လာနေ့များတွင် စတင်ပြီး — တစ်နှစ်၏ ပထမဆုံး ရက်သတ္တပတ်တွင် ထိုနှစ်၏ ဇန်နဝါရီ 4 ရက် ပါဝင်ပါတယ်။ တနည်းအားဖြင့် — တစ်နှစ်၏ ပထမဆုံး ကြာသပတေးနေ့သည် ထိုနှစ်၏ week 1 တွင် ရှိပါတယ်။
ISO week-numbering စနစ်တွင် — ဇန်နဝါရီ အစောပိုင်း ရက်စွဲများသည် ယခင် နှစ်၏ 52 သို့မဟုတ် 53 ခုမြောက် ရက်သတ္တပတ်တွင် ပါဝင်နိုင်သကဲ့သို့ — ဒီဇင်ဘာ နှောင်းပိုင်း ရက်စွဲများသည်လည်း နောက်နှစ်၏ ပထမ ရက်သတ္တပတ်တွင် ပါဝင်နိုင်ပါတယ်။ ဥပမာ — 2005-01-01 သည် 2004 ခုနှစ်၏ 53 ခုမြောက် ရက်သတ္တပတ်တွင် ပါဝင်ပြီး — 2006-01-01 သည် 2005 ခုနှစ်၏ 52 ခုမြောက် ရက်သတ္တပတ်တွင် ပါဝင်ကာ — 2012-12-31 သည် 2013 ခုနှစ်၏ ပထမ ရက်သတ္တပတ်တွင် ပါဝင်ပါတယ်။ တသမတ်တည်း ရလဒ်များ ရရှိရန်အတွက် week နှင့်အတူ isoyear field ကို တွဲသုံးရန် အကြံပြုပါတယ်။
interval တန်ဖိုးများအတွက်မူ week field သည် ရက်အပြည့် အရေအတွက်ကို 7 ဖြင့် စားထားသော တန်ဖိုး သက်သက် ဖြစ်ပါတယ်။

SELECT EXTRACT(WEEK FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 7
SELECT EXTRACT(WEEK FROM INTERVAL '13 days 24 hours');
Result: 1
- **year** — year field။ 0 AD ဟူ၍ မရှိကြောင်း သတိရပါ — ထို့ကြောင့် AD နှစ်များမှ BC နှစ်များကို နုတ်ရာတွင် ဂရုတစိုက် ဆောင်ရွက်သင့်ပါတယ်။

SELECT EXTRACT(YEAR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 2001

`interval` တန်ဖိုးတစ်ခုကို process လုပ်သည့်အခါ — `extract` function သည် interval output function သုံးသည့် အဓိပ္ပာယ်ဖွင့်ဆိုမှုနှင့် ကိုက်ညီသော field တန်ဖိုးများကို ထုတ်ပေးပါတယ်။ ၎င်းသည် non-normalized interval ပုံစံတစ်ခုမှ စတင်ပါက အံ့အားသင့်ဖွယ် ရလဒ်များ ထွက်နိုင်ပါတယ် — ဥပမာ:

```sql
SELECT INTERVAL '80 minutes';
Result: 01:20:00
SELECT EXTRACT(MINUTES FROM INTERVAL '80 minutes');
Result: 20
```

> **မှတ်ချက်:** Input တန်ဖိုးသည် +/-Infinity ဖြစ်နေပါက — `extract` သည် monotonically-increasing (အမြဲတိုးနေသော) field များအတွက် +/-Infinity ကို ပြန်ပေးပါတယ် (`timestamp` input များအတွက် `epoch`, `julian`, `year`, `isoyear`, `decade`, `century`, နှင့် `millennium`; `interval` input များအတွက် `epoch`, `hour`, `day`, `year`, `decade`, `century`, နှင့် `millennium`)။ အခြား field များအတွက်မူ NULL ပြန်ပေးပါတယ်။ PostgreSQL 9.6 မတိုင်မီ version များသည် infinite input ဖြစ်သော ကိစ္စအားလုံးအတွက် zero ကို ပြန်ပေးခဲ့ပါတယ်။

`extract` function သည် အဓိကအားဖြင့် တွက်ချက်မှု (computational) ဆိုင်ရာ process လုပ်ရန်အတွက် ရည်ရွယ်ထားခြင်း ဖြစ်ပါတယ်။ ပြသရန်အတွက် date/time တန်ဖိုးများကို formatting လုပ်လိုပါက [အပိုင်း 9.8](/docs/postgresql/functions-formatting) ကို ကြည့်ပါ။

`date_part` function သည် SQL-standard function `extract` ၏ ရိုးရာ Ingres နှင့် ညီမျှသော ပုံစံကို မှီငြမ်းထားခြင်း ဖြစ်ပါတယ်:

```sql
date_part('field', source)
```

ဤနေရာတွင် `field` parameter သည် နာမည် (name) မဟုတ်ဘဲ string တန်ဖိုးတစ်ခု ဖြစ်ရန် လိုအပ်ကြောင်း သတိပြုပါ။ `date_part` အတွက် တရားဝင် field name များသည် `extract` အတွက် အတူတူပင် ဖြစ်ပါတယ်။ သမိုင်းကြောင်း အကြောင်းပြချက်များကြောင့် — `date_part` function သည် `double precision` type တန်ဖိုးများကို ပြန်ပေးပါတယ်။ ၎င်းသည် အချို့သော အသုံးပြုမှုများတွင် precision ဆုံးရှုံးမှုကို ဖြစ်စေနိုင်ပါတယ်။ ထို့ကြောင့် `extract` ကို သုံးရန် အကြံပြုပါတယ်။

```sql
SELECT date_part('day', TIMESTAMP '2001-02-16 20:38:40');
Result: 16
SELECT date_part('hour', INTERVAL '4 hours 3 minutes');
Result: 4
```

### 9.9.2. `date_trunc` (date/time တန်ဖိုးကို သတ်မှတ် precision သို့ ဖြတ်တောက်ခြင်း)

`date_trunc` function သည် ဂဏန်းများအတွက် ရှိသော `trunc` function နှင့် သဘောတရားအရ ဆင်တူပါတယ်။

```sql
date_trunc(field, source [, time_zone ])
```

`source` သည် `timestamp`, `timestamp with time zone`, သို့မဟုတ် `interval` type ရှိသော value expression တစ်ခု ဖြစ်ပါတယ်။ (`date` နှင့် `time` type တန်ဖိုးများကို အသီးသီး `timestamp` သို့မဟုတ် `interval` အဖြစ် အလိုအလျောက် cast လုပ်ပါတယ်။) `field` သည် input တန်ဖိုးကို မည်သည့် precision အထိ ဖြတ်တောက်မည်ကို ရွေးချယ်ပေးပါတယ်။ ပြန်ပေးသော တန်ဖိုးသည်လည်း `timestamp`, `timestamp with time zone`, သို့မဟုတ် `interval` type ဖြစ်ပြီး — ရွေးချယ်ထားသော field ထက် အရေးပါမှု နည်းသော (less significant) field အားလုံးကို zero အဖြစ် (day နှင့် month အတွက်မူ one အဖြစ်) သတ်မှတ်ထားပါတယ်။

`field` အတွက် တရားဝင် တန်ဖိုးများမှာ:

| `microseconds` |
| --- |
| `milliseconds` |
| `second` |
| `minute` |
| `hour` |
| `day` |
| `week` |
| `month` |
| `quarter` |
| `year` |
| `decade` |
| `century` |
| `millennium` |

Input တန်ဖိုးသည် `timestamp with time zone` type ဖြစ်ပါက — ဖြတ်တောက်မှုကို သီးခြား time zone တစ်ခုနှင့် ဆက်စပ်၍ လုပ်ဆောင်ပါတယ်; ဥပမာ — `day` အထိ ဖြတ်တောက်ခြင်းသည် ထို zone တွင် သန်းခေါင်ယံ (midnight) အချိန် ဖြစ်သော တန်ဖိုးကို ထုတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် — ဖြတ်တောက်မှုကို လက်ရှိ [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) setting နှင့် ဆက်စပ်၍ လုပ်ဆောင်သော်လည်း — မတူညီသော time zone တစ်ခုကို သတ်မှတ်ရန် optional `time_zone` argument ကို ပေးနိုင်ပါတယ်။ Time zone နာမည်ကို [အပိုင်း 8.5.3](/docs/postgresql/datatype-datetime) တွင် ဖော်ပြထားသော နည်းလမ်းများထဲမှ မည်သည့်နည်းဖြင့်မဆို သတ်မှတ်နိုင်ပါတယ်။

`timestamp without time zone` သို့မဟုတ် `interval` input များကို process လုပ်သည့်အခါ time zone ကို သတ်မှတ်၍ မရပါဘူး။ ၎င်းတို့ကို တန်ဖိုးအတိုင်း (face value) အမြဲ ယူပါတယ်။

ဥပမာများ (local time zone သည် `America/New_York` ဖြစ်သည်ဟု ယူဆထားသည်):

```sql
SELECT date_trunc('hour', TIMESTAMP '2001-02-16 20:38:40');
Result: 2001-02-16 20:00:00
SELECT date_trunc('year', TIMESTAMP '2001-02-16 20:38:40');
Result: 2001-01-01 00:00:00
SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00');
Result: 2001-02-16 00:00:00-05
SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00', 'Australia/Sydney');
Result: 2001-02-16 08:00:00-05
SELECT date_trunc('hour', INTERVAL '3 days 02:47:33');
Result: 3 days 02:00:00
```

### 9.9.3. `date_bin` (timestamp ကို သတ်မှတ် interval အလိုက် bin လုပ်ခြင်း)

`date_bin` function သည် input timestamp ကို — သတ်မှတ်ထားသော origin တစ်ခုနှင့် ညှိထားသည့် — သတ်မှတ်ထားသော interval (အဆင့် *stride*) အတွင်းသို့ bin (ပုံးခွဲ) လုပ်ပါတယ်။

```sql
date_bin(stride, source, origin)
```

`source` သည် `timestamp` သို့မဟုတ် `timestamp with time zone` type ရှိသော value expression တစ်ခု ဖြစ်ပါတယ်။ (`date` type တန်ဖိုးများကို `timestamp` အဖြစ် အလိုအလျောက် cast လုပ်ပါတယ်။) `stride` သည် `interval` type ရှိသော value expression တစ်ခု ဖြစ်ပါတယ်။ ပြန်ပေးသော တန်ဖိုးသည်လည်း `timestamp` သို့မဟုတ် `timestamp with time zone` type ဖြစ်ပြီး — `source` ထည့်သွင်းခံရသည့် bin ၏ အစပိုင်းကို မှတ်သားပေးပါတယ်။

ဥပမာများ:

```sql
SELECT date_bin('15 minutes', TIMESTAMP '2020-02-11 15:44:17', TIMESTAMP '2001-01-01');
Result: 2020-02-11 15:30:00
SELECT date_bin('15 minutes', TIMESTAMP '2020-02-11 15:44:17', TIMESTAMP '2001-01-01 00:02:30');
Result: 2020-02-11 15:32:30
```

ပြည့်စုံသော ယူနစ်များ (1 minute, 1 hour စသည်) ၏ ကိစ္စတွင် — ၎င်းသည် ဆင်တူသော `date_trunc` ခေါ်ဆိုမှုနှင့် ရလဒ်တူညီသော်လည်း — `date_bin` သည် ကြိုက်ရာမဆို interval တစ်ခုအထိ ဖြတ်တောက်နိုင်သည်ဟူသော အချက်တွင် ကွာခြားပါတယ်။

*stride* interval သည် သုညထက် ကြီးရမည် ဖြစ်ပြီး — month သို့မဟုတ် ထိုထက်ကြီးသော ယူနစ်များ ပါဝင်၍ မရပါဘူး။

### 9.9.4. `AT TIME ZONE` and `AT LOCAL` (AT TIME ZONE နှင့် AT LOCAL)

`AT TIME ZONE` operator သည် time zone မပါသော time stamp ကို time zone ပါသော time stamp သို့ ဖြစ်စေ၊ ၎င်းမှ ပြန်၍ ဖြစ်စေ ပြောင်းလဲပေးပြီး — `time with time zone` တန်ဖိုးများကို မတူညီသော time zone များသို့ ပြောင်းလဲပေးပါတယ်။ ဇယား 9.34 တွင် ၎င်း၏ မျိုးကွဲများကို ပြထားပါတယ်။

**ဇယား 9.34. AT TIME ZONE and AT LOCAL Variants (AT TIME ZONE နှင့် AT LOCAL မျိုးကွဲများ)**

| Operator ဖော်ပြချက်နှင့် ဥပမာ(များ) |
| --- |
| timestamp without time zone AT TIME ZONE zone → timestamp with time zone ပေးထားသော time stamp without time zone ကို — ထိုတန်ဖိုးသည် နာမည်ပေးထားသော time zone တွင် ရှိသည်ဟု ယူဆ၍ — time stamp with time zone အဖြစ် ပြောင်းပေးပါတယ်။ ဥပမာ — timestamp '2001-02-16 20:38:40' at time zone 'America/Denver' → 2001-02-17 03:38:40+00 |
| timestamp without time zone AT LOCAL → timestamp with time zone ပေးထားသော time stamp without time zone ကို — session ၏ TimeZone တန်ဖိုးကို time zone အဖြစ် ယူဆ၍ — time stamp with time zone အဖြစ် ပြောင်းပေးပါတယ်။ ဥပမာ — timestamp '2001-02-16 20:38:40' at local → 2001-02-17 03:38:40+00 |
| timestamp with time zone AT TIME ZONE zone → timestamp without time zone ပေးထားသော time stamp with time zone ကို — ထို zone တွင် ပေါ်လာမည့် အချိန်အတိုင်း — time stamp without time zone အဖြစ် ပြောင်းပေးပါတယ်။ ဥပမာ — timestamp with time zone '2001-02-16 20:38:40-05' at time zone 'America/Denver' → 2001-02-16 18:38:40 |
| timestamp with time zone AT LOCAL → timestamp without time zone ပေးထားသော time stamp with time zone ကို — session ၏ TimeZone တန်ဖိုးကို time zone အဖြစ် ယူဆပါက ပေါ်လာမည့် အချိန်အတိုင်း — time stamp without time zone အဖြစ် ပြောင်းပေးပါတယ်။ ဥပမာ — timestamp with time zone '2001-02-16 20:38:40-05' at local → 2001-02-16 18:38:40 |
| time with time zone AT TIME ZONE zone → time with time zone ပေးထားသော time with time zone ကို time zone အသစ်တစ်ခုသို့ ပြောင်းပေးပါတယ်။ ရက်စွဲ ပေးမထားသောကြောင့် — ၎င်းသည် နာမည်ပေးထားသော ဦးတည်ရာ (destination) zone အတွက် လက်ရှိ သက်ဝင်နေသော UTC offset ကို အသုံးပြုပါတယ်။ ဥပမာ — time with time zone '05:34:17-05' at time zone 'UTC' → 10:34:17+00 |
| time with time zone AT LOCAL → time with time zone ပေးထားသော time with time zone ကို time zone အသစ်တစ်ခုသို့ ပြောင်းပေးပါတယ်။ ရက်စွဲ ပေးမထားသောကြောင့် — ၎င်းသည် session ၏ TimeZone တန်ဖိုးအတွက် လက်ရှိ သက်ဝင်နေသော UTC offset ကို အသုံးပြုပါတယ်။ Session ၏ TimeZone ကို UTC အဖြစ် သတ်မှတ်ထားသည်ဟု ယူဆပါက: ဥပမာ — time with time zone '05:34:17-05' at local → 10:34:17+00 |

ဤ expression များတွင် — လိုချင်သော time zone `zone` ကို text တန်ဖိုး အနေနှင့် ဖြစ်စေ (ဥပမာ — `'America/Los_Angeles'`) — interval အနေနှင့် ဖြစ်စေ (ဥပမာ — `INTERVAL '-08:00'`) သတ်မှတ်နိုင်ပါတယ်။ Text ကိစ္စတွင် — time zone နာမည်ကို [အပိုင်း 8.5.3](/docs/postgresql/datatype-datetime) တွင် ဖော်ပြထားသော နည်းလမ်းများထဲမှ မည်သည့်နည်းဖြင့်မဆို သတ်မှတ်နိုင်ပါတယ်။ Interval ကိစ္စသည် UTC မှ ပုံသေ offset ရှိသော zone များအတွက်သာ အသုံးဝင်သောကြောင့် — လက်တွေ့တွင် သိပ်အသုံးမများပါဘူး။

`AT LOCAL` syntax ကို `AT TIME ZONE local` ၏ အတိုကောက်အဖြစ် သုံးနိုင်ပြီး — ထို `local` သည် session ၏ `TimeZone` တန်ဖိုး ဖြစ်ပါတယ်။

ဥပမာများ (လက်ရှိ [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) setting သည် `America/Los_Angeles` ဖြစ်သည်ဟု ယူဆထားသည်):

```sql
SELECT TIMESTAMP '2001-02-16 20:38:40' AT TIME ZONE 'America/Denver';
Result: 2001-02-16 19:38:40-08
SELECT TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40-05' AT TIME ZONE 'America/Denver';
Result: 2001-02-16 18:38:40
SELECT TIMESTAMP '2001-02-16 20:38:40' AT TIME ZONE 'Asia/Tokyo' AT TIME ZONE 'America/Chicago';
Result: 2001-02-16 05:38:40
SELECT TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40-05' AT LOCAL;
Result: 2001-02-16 17:38:40
SELECT TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40-05' AT TIME ZONE '+05';
Result: 2001-02-16 20:38:40
SELECT TIME WITH TIME ZONE '20:38:40-05' AT LOCAL;
Result: 17:38:40
```

ပထမ ဥပမာသည် time zone မရှိသော တန်ဖိုးတစ်ခုသို့ time zone ကို ပေါင်းထည့်ပြီး — လက်ရှိ `TimeZone` setting ကို အသုံးပြု၍ တန်ဖိုးကို ပြသပါတယ်။ ဒုတိယ ဥပမာသည် time stamp with time zone တန်ဖိုးကို သတ်မှတ်ထားသော time zone သို့ ရွှေ့ပြီး — time zone မပါသော တန်ဖိုးအဖြစ် ပြန်ပေးပါတယ်။ ၎င်းသည် လက်ရှိ `TimeZone` setting နှင့် မတူညီသော တန်ဖိုးများကို သိမ်းဆည်းခြင်းနှင့် ပြသခြင်းကို ခွင့်ပြုပါတယ်။ တတိယ ဥပမာသည် Tokyo အချိန်ကို Chicago အချိန်အဖြစ် ပြောင်းပေးပါတယ်။ စတုတ္ထ ဥပမာသည် time stamp with time zone တန်ဖိုးကို `TimeZone` setting မှ လက်ရှိ သတ်မှတ်ထားသော time zone သို့ ရွှေ့ပြီး — time zone မပါသော တန်ဖိုးအဖြစ် ပြန်ပေးပါတယ်။ ပဉ္စမ ဥပမာသည် — POSIX ပုံစံ time zone specification တစ်ခုတွင် ရှိသော sign သည် ISO-8601 datetime literal တစ်ခုတွင် ရှိသော sign ၏ ဆန့်ကျင်ဘက် အဓိပ္ပာယ်ရှိကြောင်းကို သရုပ်ပြပါတယ် — [အပိုင်း 8.5.3](/docs/postgresql/datatype-datetime) နှင့် [နောက်ဆက်တွဲ B](https://www.postgresql.org/docs/current/datetime-appendix.html) တွင် ဖော်ပြထားသည့်အတိုင်း ဖြစ်ပါတယ်။

ဆဋ္ဌမ ဥပမာသည် သတိပေးစရာ ဥပမာတစ်ခု ဖြစ်ပါတယ်။ Input တန်ဖိုးနှင့် ဆက်စပ်ထားသော ရက်စွဲ မရှိသည့်အတွက် — ပြောင်းလဲမှုကို session ၏ လက်ရှိ ရက်စွဲကို အသုံးပြု၍ လုပ်ဆောင်ပါတယ်။ ထို့ကြောင့် — ဤ static ဥပမာသည် ၎င်းကို ကြည့်ရှုသည့် နှစ်၏ အချိန်ကာလပေါ် မူတည်၍ မှားယွင်းသော ရလဒ်ကို ပြသနိုင်ပါတယ် — အကြောင်းမှာ `'America/Los_Angeles'` သည် Daylight Savings Time ကို ကျင့်သုံးသောကြောင့် ဖြစ်ပါတယ်။

`timezone(zone, timestamp)` function သည် SQL နှင့် ကိုက်ညီသော `timestamp AT TIME ZONE zone` construct နှင့် ညီမျှပါတယ်။

`timezone(zone, time)` function သည် SQL နှင့် ကိုက်ညီသော `time AT TIME ZONE zone` construct နှင့် ညီမျှပါတယ်။

`timezone(timestamp)` function သည် SQL နှင့် ကိုက်ညီသော `timestamp AT LOCAL` construct နှင့် ညီမျှပါတယ်။

`timezone(time)` function သည် SQL နှင့် ကိုက်ညီသော `time AT LOCAL` construct နှင့် ညီမျှပါတယ်။

### 9.9.5. Current Date/Time (လက်ရှိ ရက်စွဲ/အချိန်)

PostgreSQL သည် လက်ရှိ ရက်စွဲနှင့် အချိန်နှင့် သက်ဆိုင်သော တန်ဖိုးများကို ပြန်ပေးသည့် လုပ်ဆောင်ချက် အများအပြားကို ထောက်ပံ့ပေးပါတယ်။ ဤ SQL-standard လုပ်ဆောင်ချက်များ အားလုံးသည် လက်ရှိ transaction ၏ စတင်ချိန်ကို အခြေခံ၍ တန်ဖိုးများကို ပြန်ပေးပါတယ်:

```sql
CURRENT_DATE
CURRENT_TIME
CURRENT_TIMESTAMP
CURRENT_TIME(precision)
CURRENT_TIMESTAMP(precision)
LOCALTIME
LOCALTIMESTAMP
LOCALTIME(precision)
LOCALTIMESTAMP(precision)
```

`CURRENT_TIME` နှင့် `CURRENT_TIMESTAMP` တို့သည် time zone ပါသော တန်ဖိုးများကို ပေးပြီး — `LOCALTIME` နှင့် `LOCALTIMESTAMP` တို့သည် time zone မပါသော တန်ဖိုးများကို ပေးပါတယ်။

`CURRENT_TIME`, `CURRENT_TIMESTAMP`, `LOCALTIME`, နှင့် `LOCALTIMESTAMP` တို့သည် optional အနေဖြင့် precision parameter တစ်ခုကို လက်ခံနိုင်ပြီး — ၎င်းသည် ရလဒ်ကို seconds field ၏ ဒသမဂဏန်း ထိုအရေအတွက်အထိ ဝိုင်းစေပါတယ်။ Precision parameter မပါဘဲဆိုပါက — ရလဒ်ကို ရရှိနိုင်သော precision အပြည့်ဖြင့် ပေးပါတယ်။

ဥပမာအချို့:

```sql
SELECT CURRENT_TIME;
Result: 14:39:53.662522-05
SELECT CURRENT_DATE;
Result: 2019-12-23
SELECT CURRENT_TIMESTAMP;
Result: 2019-12-23 14:39:53.662522-05
SELECT CURRENT_TIMESTAMP(2);
Result: 2019-12-23 14:39:53.66-05
SELECT LOCALTIMESTAMP;
Result: 2019-12-23 14:39:53.662522
```

ဤ လုပ်ဆောင်ချက်များသည် လက်ရှိ transaction ၏ စတင်ချိန်ကို ပြန်ပေးသောကြောင့် — ၎င်းတို့၏ တန်ဖိုးများသည် transaction အတွင်း ပြောင်းလဲမှု မရှိပါဘူး။ ၎င်းကို feature (အင်္ဂါရပ်) တစ်ခုအဖြစ် မှတ်ယူပါတယ်: ရည်ရွယ်ချက်မှာ — transaction တစ်ခုတည်းသည် “လက်ရှိ” အချိန်နှင့် ပတ်သက်၍ တသမတ်တည်း ရှိသော အယူအဆတစ်ခုကို ထားရှိနိုင်ရန် ဖြစ်ပြီး — ထို့ကြောင့် transaction တစ်ခုတည်း အတွင်းရှိ ပြုပြင်ပြောင်းလဲမှု အများအပြားသည် တူညီသော time stamp တစ်ခုကို သယ်ဆောင်သွားမည် ဖြစ်ပါတယ်။

> **မှတ်ချက်:** အခြား database system များသည် ဤတန်ဖိုးများကို ပို၍ မကြာခဏ ရှေ့သို့ ရွှေ့ (advance) စေနိုင်ပါတယ်။

PostgreSQL သည် လက်ရှိ statement ၏ စတင်ချိန်နှင့် — function ကို ခေါ်ဆိုသည့် ခဏတွင် ရှိသော တကယ့် လက်ရှိ အချိန်ကို ပြန်ပေးသည့် လုပ်ဆောင်ချက်များကိုလည်း ထောက်ပံ့ပေးပါတယ်။ SQL-standard မဟုတ်သော အချိန် လုပ်ဆောင်ချက်များ၏ စာရင်း အပြည့်အစုံမှာ:

```sql
transaction_timestamp()
statement_timestamp()
clock_timestamp()
timeofday()
now()
```

`transaction_timestamp()` သည် `CURRENT_TIMESTAMP` နှင့် ညီမျှသော်လည်း — ၎င်း ပြန်ပေးသည့်အရာကို ရှင်းလင်းစွာ ထင်ဟပ်စေရန် ထိုနည်းအတိုင်း နာမည်ပေးထားခြင်း ဖြစ်ပါတယ်။ `statement_timestamp()` သည် လက်ရှိ statement ၏ စတင်ချိန်ကို ပြန်ပေးပါတယ် (ပို၍ တိကျစွာ ဆိုရလျှင် — client ထံမှ နောက်ဆုံး command message ကို လက်ခံရရှိသည့် အချိန်)။ `statement_timestamp()` နှင့် `transaction_timestamp()` တို့သည် transaction တစ်ခု၏ ပထမ statement အတွင်း တူညီသော တန်ဖိုးကို ပြန်ပေးသော်လည်း — နောက်ဆက်တွဲ statement များတွင် ကွဲပြားနိုင်ပါတယ်။ `clock_timestamp()` သည် တကယ့် လက်ရှိ အချိန်ကို ပြန်ပေးသောကြောင့် — SQL statement တစ်ခုတည်း အတွင်းမှာပင် ၎င်း၏ တန်ဖိုး ပြောင်းလဲပါတယ်။ `timeofday()` သည် သမိုင်းဝင် PostgreSQL လုပ်ဆောင်ချက်တစ်ခု ဖြစ်ပါတယ်။ `clock_timestamp()` ကဲ့သို့ပင် — တကယ့် လက်ရှိ အချိန်ကို ပြန်ပေးသော်လည်း — `timestamp with time zone` တန်ဖိုးအဖြစ် မဟုတ်ဘဲ format လုပ်ထားသော `text` string တစ်ခုအဖြစ် ပြန်ပေးပါတယ်။ `now()` သည် `transaction_timestamp()` ၏ ရိုးရာ PostgreSQL ညီမျှမှုတစ်ခု ဖြစ်ပါတယ်။

date/time data type များ အားလုံးသည်လည်း လက်ရှိ ရက်စွဲနှင့် အချိန်ကို သတ်မှတ်ရန် အထူး literal တန်ဖိုး `now` ကို လက်ခံပါတယ် (ဤတွင်လည်း transaction ၏ စတင်ချိန်အဖြစ် အဓိပ္ပာယ်ဖွင့်ဆိုသည်)။ ထို့ကြောင့် — အောက်ပါ သုံးခုစလုံးသည် တူညီသော ရလဒ်ကို ပြန်ပေးပါတယ်:

```sql
SELECT CURRENT_TIMESTAMP;
SELECT now();
SELECT TIMESTAMP 'now';  -- but see tip below
```

> **အကြံပြုချက်:** နောက်ပိုင်းတွင် evaluate လုပ်မည့် တန်ဖိုးတစ်ခုကို သတ်မှတ်သည့်အခါ — ဥပမာ table column တစ်ခု၏ `DEFAULT` clause တွင် — တတိယ ပုံစံကို အသုံးမပြုပါနှင့်။ Constant ကို parse လုပ်လိုက်သည်နှင့် system သည် `now` ကို `timestamp` အဖြစ် ချက်ချင်း ပြောင်းလဲပစ်မည် ဖြစ်သောကြောင့် — default တန်ဖိုး လိုအပ်လာသည့်အခါ table ကို ဖန်တီးခဲ့သည့် အချိန်ကို အသုံးပြုမိသွားမည် ဖြစ်ပါတယ်! ပထမ ပုံစံ နှစ်ခုသည် function call များ ဖြစ်သောကြောင့် — default တန်ဖိုးကို အသုံးပြုသည့်အထိ evaluate လုပ်မည် မဟုတ်ပါဘူး။ ထို့ကြောင့် ၎င်းတို့သည် row ထည့်သွင်းချိန်ကို default အဖြစ် သုံးစေသည့် လိုချင်သော အပြုအမူကို ပေးပါလိမ့်မယ်။ (ထို့ပြင် [အပိုင်း 8.5.1.4](/docs/postgresql/datatype-datetime) ကိုလည်း ကြည့်ပါ။)

### 9.9.6. Delaying Execution (လုပ်ဆောင်မှု နှောင့်နှေးစေခြင်း)

Server process ၏ လုပ်ဆောင်မှုကို နှောင့်နှေးစေရန်အတွက် အောက်ပါ လုပ်ဆောင်ချက်များကို ရရှိနိုင်ပါတယ်:

```sql
pg_sleep ( double precision )
pg_sleep_for ( interval )
pg_sleep_until ( timestamp with time zone )
```

`pg_sleep` သည် လက်ရှိ session ၏ process ကို — ပေးထားသော စက္ကန့် အရေအတွက် ကုန်ဆုံးသည့်အထိ sleep (ရပ်နား) စေပါတယ်။ ဒသမစက္ကန့် (fractional-second) နှောင့်နှေးမှုများကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ `pg_sleep_for` သည် sleep ချိန်ကို `interval` တစ်ခုအနေဖြင့် သတ်မှတ်ခွင့်ပြုသည့် အဆင်ပြေ (convenience) လုပ်ဆောင်ချက်တစ်ခု ဖြစ်ပါတယ်။ `pg_sleep_until` သည် တိကျသော နိုးထချိန် (wake-up time) တစ်ခု လိုချင်သည့်အခါအတွက် အဆင်ပြေ လုပ်ဆောင်ချက်တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT pg_sleep(1.5);
SELECT pg_sleep_for('5 minutes');
SELECT pg_sleep_until('tomorrow 03:00');
```

> **မှတ်ချက်:** Sleep interval ၏ ထိရောက်သော resolution သည် platform အလိုက် ကွဲပြားပြီး — 0.01 စက္ကန့်သည် အသုံးများသော တန်ဖိုးတစ်ခု ဖြစ်ပါတယ်။ Sleep နှောင့်နှေးချိန်သည် သတ်မှတ်ထားသည်ထက် အနည်းဆုံး ကြာမြင့်မည် ဖြစ်ပါတယ်။ Server load ကဲ့သို့သော အချက်များပေါ် မူတည်၍ ပို၍ ကြာနိုင်ပါတယ်။ အထူးသဖြင့် — `pg_sleep_until` သည် သတ်မှတ်ထားသော အချိန်တွင် အတိအကျ နိုးထမည်ဟု အာမခံချက် မရှိသော်လည်း — စော၍ နိုးထတော့ မည် မဟုတ်ပါဘူး။

> **သတိပေးချက်:** `pg_sleep` သို့မဟုတ် ၎င်း၏ မျိုးကွဲများကို ခေါ်ဆိုသည့်အခါ — session သည် လိုအပ်သည်ထက် ပိုသော lock များကို မကိုင်ထားမိစေရန် သေချာပါစေ။ မဟုတ်ပါက — အခြား session များသည် သင့်၏ sleep ဖြစ်နေသော process ကို စောင့်ဆိုင်းရန် လိုအပ်လာပြီး — system တစ်ခုလုံးကို နှေးကွေးစေနိုင်ပါတယ်။
