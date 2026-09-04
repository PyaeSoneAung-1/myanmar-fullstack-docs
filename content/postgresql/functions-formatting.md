---
title: "Data Type Formatting Functions (data type formatting လုပ်ဆောင်ချက်များ)"
description: "PostgreSQL ရဲ့ formatting functions များ — to_char, to_date, to_number, to_timestamp တို့ဖြင့် date/time နှင့် ကိန်းဂဏန်း data types များကို formatted strings အဖြစ်လည်းကောင်း၊ formatted strings များမှ data types အဖြစ်လည်းကောင်း ပြောင်းလဲခြင်း — date/time နှင့် numeric formatting အတွက် template pattern နှင့် modifier ဇယားများ"
order: 75
source: "https://www.postgresql.org/docs/current/functions-formatting.html"
status: translated
updated: 2026-09-04
---

## 9.8. Data Type Formatting Functions (data type formatting လုပ်ဆောင်ချက်များ)

PostgreSQL ရဲ့ formatting functions တွေက — data types အမျိုးမျိုး (date/time၊ integer၊ floating point၊ numeric) ကို format လုပ်ထားတဲ့ strings (formatted strings) တွေအဖြစ် ပြောင်းဖို့နဲ့ — format လုပ်ထားတဲ့ strings တွေကနေ သတ်မှတ်ထားတဲ့ data types တွေဆီ ပြန်ပြောင်းဖို့အတွက် — စွမ်းအားပြည့် tool အစုတစ်စုကို ပေးပါတယ်။ ဒီ functions တွေအားလုံးကို ဇယား 9.26 မှာ စာရင်းပြထားပါတယ်။ Functions တွေအားလုံးက ဘုံ ခေါ်ဆိုမှု စည်းမျဉ်း (calling convention) တစ်ခုကို လိုက်နာပါတယ်: ပထမ argument က format လုပ်ရမယ့် တန်ဖိုး ဖြစ်ပြီး — ဒုတိယ argument ကတော့ output (သို့မဟုတ် input) format ကို သတ်မှတ်ပေးတဲ့ template တစ်ခု ဖြစ်ပါတယ်။

**ဇယား 9.26. Formatting Functions (formatting လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| to_char ( timestamp, text ) → text to_char ( timestamp with time zone, text ) → text ပေးထားတဲ့ format အတိုင်း time stamp ကို string အဖြစ် ပြောင်းပေးပါတယ်။ to_char(timestamp '2002-04-20 17:31:12.66', 'HH12:MI:SS') → 05:31:12 |
| to_char ( interval, text ) → text ပေးထားတဲ့ format အတိုင်း interval ကို string အဖြစ် ပြောင်းပေးပါတယ်။ to_char(interval '15h 2m 12s', 'HH24:MI:SS') → 15:02:12 |
| to_char ( numeric_type, text ) → text ပေးထားတဲ့ format အတိုင်း ဂဏန်း (number) ကို string အဖြစ် ပြောင်းပေးပါတယ်; integer, bigint, numeric, real, double precision တို့အတွက် ရနိုင်ပါတယ်။ to_char(125, '999') → 125 to_char(125.8::real, '999D9') → 125.8 to_char(-125.8, '999D99S') → 125.80- |
| to_date ( text, text ) → date ပေးထားတဲ့ format အတိုင်း string ကို date အဖြစ် ပြောင်းပေးပါတယ်။ to_date('05 Dec 2000', 'DD Mon YYYY') → 2000-12-05 |
| to_number ( text, text ) → numeric ပေးထားတဲ့ format အတိုင်း string ကို numeric အဖြစ် ပြောင်းပေးပါတယ်။ to_number('12,454.8-', '99G999D9S') → -12454.8 |
| to_timestamp ( text, text ) → timestamp with time zone ပေးထားတဲ့ format အတိုင်း string ကို time stamp အဖြစ် ပြောင်းပေးပါတယ်။ ([ဇယား 9.33](/docs/postgresql/functions-datetime) ထဲက to_timestamp(double precision) ကိုလည်း ကြည့်ပါ။) to_timestamp('05 Dec 2000', 'DD Mon YYYY') → 2000-12-05 00:00:00-05 |

> **အကြံပြုချက်:** `to_timestamp` နဲ့ `to_date` တို့က — ရိုးရိုး casting နဲ့ ပြောင်းလို့ မရတဲ့ input formats တွေကို ကိုင်တွယ်ဖို့အတွက် ရှိနေတာပါ။ Standard date/time formats အများစုအတွက်တော့ — source string ကို လိုအပ်တဲ့ data type ဆီ casting လုပ်ရုံနဲ့ ရပြီး — ပိုပြီးလည်း လွယ်ကူပါတယ်။ အလားတူပဲ — standard numeric representations တွေအတွက် `to_number` က မလိုအပ်ပါဘူး။

`to_char` ရဲ့ output template string ထဲမှာ — ပေးထားတဲ့ တန်ဖိုးပေါ် မူတည်ပြီး အသင့်လျော်ဆုံး format နဲ့ ဒေတာအဖြစ် အသိအမှတ်ပြု၍ အစားထိုးခံရတဲ့ pattern တချို့ ရှိပါတယ်။ Template pattern မဟုတ်တဲ့ ဘယ် text ကိုမဆို မူရင်းအတိုင်း ပြန်ကူးထုတ်လိုက်ပါတယ် (copied verbatim)။ အလားတူ — input template string (တခြား functions တွေအတွက်) တွေထဲမှာတော့ — template patterns တွေက input data string ကနေ ဖြည့်သွင်းရမယ့် တန်ဖိုးတွေရဲ့ နေရာတွေကို ညွှန်ပြပါတယ်။ Template string ထဲမှာ template pattern မဟုတ်တဲ့ character တွေ ရှိခဲ့ရင် — input data string ထဲက သက်ဆိုင်ရာ characters တွေကို (template string ရဲ့ characters တွေနဲ့ တူသည် ဖြစ်စေ၊ မတူသည် ဖြစ်စေ) ရိုးရိုး ကျော်လိုက်ပါတယ် (skipped over)။

date နဲ့ time တန်ဖိုးတွေကို format လုပ်ရာမှာ သုံးလို့ရတဲ့ template patterns တွေကို ဇယား 9.27 မှာ ပြထားပါတယ်။

**ဇယား 9.27. Template Patterns for Date/Time Formatting (date/time formatting အတွက် template patterns များ)**

| Pattern | ဖော်ပြချက် |
| --- | --- |
| `HH` | နေ့ထဲက နာရီ (01–12) |
| `HH12` | နေ့ထဲက နာရီ (01–12) |
| `HH24` | နေ့ထဲက နာရီ (00–23) |
| `MI` | မိနစ် (00–59) |
| `SS` | စက္ကန့် (00–59) |
| `MS` | မီလီစက္ကန့် (000–999) |
| `US` | မိုက်ခရိုစက္ကန့် (000000–999999) |
| `FF1` | စက္ကန့်ရဲ့ ဆယ်ပုံတစ်ပုံ (0–9) |
| `FF2` | စက္ကန့်ရဲ့ ရာပုံတစ်ပုံ (00–99) |
| `FF3` | မီလီစက္ကန့် (000–999) |
| `FF4` | မီလီစက္ကန့်ရဲ့ ဆယ်ပုံတစ်ပုံ (0000–9999) |
| `FF5` | မီလီစက္ကန့်ရဲ့ ရာပုံတစ်ပုံ (00000–99999) |
| `FF6` | မိုက်ခရိုစက္ကန့် (000000–999999) |
| `SSSS`, `SSSSS` | သန်းခေါင်ယံကျော်ပြီးနောက် စက္ကန့် (0–86399) |
| `AM`, `am`, `PM` or `pm` | meridiem ညွှန်ပြချက် (period မပါဘဲ) |
| `A.M.`, `a.m.`, `P.M.` or `p.m.` | meridiem ညွှန်ပြချက် (period ပါဝင်သည်) |
| `Y,YYY` | ကော်မာပါသော နှစ် (ဂဏန်း 4 လုံး သို့မဟုတ် ပိုများ) |
| `YYYY` | နှစ် (ဂဏန်း 4 လုံး သို့မဟုတ် ပိုများ) |
| `YYY` | နှစ်၏ နောက်ဆုံး ဂဏန်း 3 လုံး |
| `YY` | နှစ်၏ နောက်ဆုံး ဂဏန်း 2 လုံး |
| `Y` | နှစ်၏ နောက်ဆုံး ဂဏန်း |
| `IYYY` | ISO 8601 week-numbering နှစ် (ဂဏန်း 4 လုံး သို့မဟုတ် ပိုများ) |
| `IYY` | ISO 8601 week-numbering နှစ်၏ နောက်ဆုံး ဂဏန်း 3 လုံး |
| `IY` | ISO 8601 week-numbering နှစ်၏ နောက်ဆုံး ဂဏန်း 2 လုံး |
| `I` | ISO 8601 week-numbering နှစ်၏ နောက်ဆုံး ဂဏန်း |
| `BC`, `bc`, `AD` or `ad` | ခေတ် (era) ညွှန်ပြချက် (period မပါဘဲ) |
| `B.C.`, `b.c.`, `A.D.` or `a.d.` | ခေတ် (era) ညွှန်ပြချက် (period ပါဝင်သည်) |
| `MONTH` | လအမည် အပြည့် — စာလုံးကြီး (space ဖြည့်၍ စာလုံး 9 လုံး ထိ ချဲ့ထားသည်) |
| `Month` | လအမည် အပြည့် — ပထမစာလုံးကြီး (space ဖြည့်၍ စာလုံး 9 လုံး ထိ ချဲ့ထားသည်) |
| `month` | လအမည် အပြည့် — စာလုံးငယ် (space ဖြည့်၍ စာလုံး 9 လုံး ထိ ချဲ့ထားသည်) |
| `MON` | လအမည် အတိုကောက် — စာလုံးကြီး (အင်္ဂလိပ်တွင် 3 လုံး; locale အလိုက် အရှည် ကွဲပြားနိုင်သည်) |
| `Mon` | လအမည် အတိုကောက် — ပထမစာလုံးကြီး (အင်္ဂလိပ်တွင် 3 လုံး; locale အလိုက် အရှည် ကွဲပြားနိုင်သည်) |
| `mon` | လအမည် အတိုကောက် — စာလုံးငယ် (အင်္ဂလိပ်တွင် 3 လုံး; locale အလိုက် အရှည် ကွဲပြားနိုင်သည်) |
| `MM` | လအမှတ် (01–12) |
| `DAY` | နေ့အမည် အပြည့် — စာလုံးကြီး (space ဖြည့်၍ စာလုံး 9 လုံး ထိ ချဲ့ထားသည်) |
| `Day` | နေ့အမည် အပြည့် — ပထမစာလုံးကြီး (space ဖြည့်၍ စာလုံး 9 လုံး ထိ ချဲ့ထားသည်) |
| `day` | နေ့အမည် အပြည့် — စာလုံးငယ် (space ဖြည့်၍ စာလုံး 9 လုံး ထိ ချဲ့ထားသည်) |
| `DY` | နေ့အမည် အတိုကောက် — စာလုံးကြီး (အင်္ဂလိပ်တွင် 3 လုံး; locale အလိုက် အရှည် ကွဲပြားနိုင်သည်) |
| `Dy` | နေ့အမည် အတိုကောက် — ပထမစာလုံးကြီး (အင်္ဂလိပ်တွင် 3 လုံး; locale အလိုက် အရှည် ကွဲပြားနိုင်သည်) |
| `dy` | နေ့အမည် အတိုကောက် — စာလုံးငယ် (အင်္ဂလိပ်တွင် 3 လုံး; locale အလိုက် အရှည် ကွဲပြားနိုင်သည်) |
| `DDD` | နှစ်ထဲက ရက် (001–366) |
| `IDDD` | ISO 8601 week-numbering နှစ်ထဲက ရက် (001–371; နှစ်၏ ရက် 1 သည် ပထမ ISO week ၏ တနင်္လာနေ့ ဖြစ်သည်) |
| `DD` | လထဲက ရက် (01–31) |
| `D` | တစ်ပတ်ထဲက ရက် — Sunday (`1`) မှ Saturday (`7`) အထိ |
| `ID` | ISO 8601 တစ်ပတ်ထဲက ရက် — Monday (`1`) မှ Sunday (`7`) အထိ |
| `W` | လထဲက ရက်သတ္တပတ် (1–5) (ပထမ ရက်သတ္တပတ်သည် လ၏ ပထမရက်နေ့မှ စတင်သည်) |
| `WW` | နှစ်ထဲက ရက်သတ္တပတ် အမှတ် (1–53) (ပထမ ရက်သတ္တပတ်သည် နှစ်၏ ပထမရက်နေ့မှ စတင်သည်) |
| `IW` | ISO 8601 week-numbering နှစ်၏ ရက်သတ္တပတ် အမှတ် (01–53; နှစ်၏ ပထမဆုံး ကြာသပတေးနေ့သည် week 1 တွင် ရှိသည်) |
| `CC` | ရာစုနှစ် (ဂဏန်း 2 လုံး) (နှစ်ဆယ့်တစ်ရာစုသည် 2001-01-01 တွင် စတင်သည်) |
| `J` | Julian Date (ဒေသစံတော်ချိန် သန်းခေါင်ယံ ဘီစီ 4714 ခုနှစ် နိုဝင်ဘာ 24 ရက်မှ စ၍ ရေတွက်သော ကိန်းပြည့် ရက်ပေါင်း; [အပိုင်း B.7](https://www.postgresql.org/docs/current/datetime-julian-dates.html) ကို ကြည့်ပါ) |
| `Q` | quarter (သုံးလပတ်) |
| `RM` | လ — ရောမ ဂဏန်း စာလုံးကြီးဖြင့် (I–XII; I=January) |
| `rm` | လ — ရောမ ဂဏန်း စာလုံးငယ်ဖြင့် (i–xii; i=January) |
| `TZ` | time-zone အတိုကောက် — စာလုံးကြီး |
| `tz` | time-zone အတိုကောက် — စာလုံးငယ် |
| `TZH` | time-zone နာရီများ |
| `TZM` | time-zone မိနစ်များ |
| `OF` | UTC မှ time-zone offset (`HH` သို့မဟုတ် `HH`:`MM`) |

Modifier တွေကို ဘယ် template pattern မဆို အပေါ်မှာ သက်ရောက်စေနိုင်ပြီး — pattern ရဲ့ အပြုအမူကို ပြောင်းလဲပေးပါတယ်။ ဥပမာ — `FMMonth` ဆိုတာ `FM` modifier ပါတဲ့ `Month` pattern ဖြစ်ပါတယ်။ date/time formatting အတွက် modifier patterns တွေကို ဇယား 9.28 မှာ ပြထားပါတယ်။

**ဇယား 9.28. Template Pattern Modifiers for Date/Time Formatting (date/time formatting အတွက် template pattern modifiers များ)**

| Modifier | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| `FM` prefix | fill mode (ရှေ့ဆုံးက သုညတွေနဲ့ padding space တွေကို ဖျောက်သည်) | `FMMonth` |
| `TH` suffix | ordinal နံပါတ် နောက်ဆက် — စာလုံးကြီး | `DDTH`, e.g., `12TH` |
| `th` suffix | ordinal နံပါတ် နောက်ဆက် — စာလုံးငယ် | `DDth`, e.g., `12th` |
| `FX` prefix | fixed format အတွက် global option (အသုံးပြုပုံ မှတ်စုများ ကြည့်ပါ) | `FX Month DD Day` |
| `TM` prefix | translation mode ([lc_time](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-TIME) အပေါ် မူတည်၍ ဒေသစံ (localized) နေ့နဲ့ လအမည်တွေကို သုံးသည်) | `TMMonth` |
| `SP` suffix | spell mode (implement မလုပ်ရသေးပါ) | `DDSP` |

date/time formatting အတွက် အသုံးပြုပုံ မှတ်စုများ:

- `FM` က — pattern တစ်ခုရဲ့ output ကို အနံ သတ်မှတ်ထားတဲ့ပုံစံ (fixed-width) ဖြစ်အောင် တခြားနည်းဖြင့် ထည့်ပေးမယ့် — ရှေ့ဆုံး သုညတွေနဲ့ နောက်ဆုံး space တွေ (trailing blanks) ကို — ဖျောက်ပေးပါတယ်။ PostgreSQL မှာ `FM` က နောက်လာမယ့် specification တစ်ခုတည်းကိုပဲ ပြုပြင်ပေးပြီး — Oracle မှာတော့ `FM` က နောက် specifications တွေ အားလုံးအပေါ် သက်ရောက်မှု ရှိပြီး — `FM` modifier ကို ထပ်ခါထပ်ခါ သုံးရင် fill mode ကို ဖွင့်/ပိတ် လုပ်ပါတယ်။

- `TM` က — `FM` သတ်မှတ်ထားသည် ဖြစ်စေ၊ မသတ်မှတ်ထားသည် ဖြစ်စေ — နောက်ဆုံးက space တွေကို ဖျောက်ပေးပါတယ်။

- `to_timestamp` နဲ့ `to_date` တို့က input ထဲက စာလုံးကြီး/ငယ် (letter case) ကို ဂရုမစိုက်ပါဘူး — ဒါကြောင့် ဥပမာ — `MON`၊ `Mon` နဲ့ `mon` တွေ အားလုံးက တူညီတဲ့ strings တွေကို လက်ခံပါတယ်။ `TM` modifier သုံးတဲ့အခါ — case-folding ကို function ရဲ့ input collation ရဲ့ စည်းမျဉ်းတွေအတိုင်း လုပ်ဆောင်ပါတယ် (အပိုင်း 23.2 ကို ကြည့်ပါ)။

- `to_timestamp` နဲ့ `to_date` တို့က — `FX` option မသုံးထားရင် — input string ရဲ့ အစပိုင်းနဲ့ date/time တန်ဖိုးတွေရဲ့ ဘေးပတ်လည်မှာ ရှိတဲ့ space အလွတ် များစွာကို ကျော်သွားပါတယ်။ ဥပမာ — `to_timestamp(' 2000    JUN', 'YYYY MON')` နဲ့ `to_timestamp('2000 - JUN', 'YYYY-MON')` တို့က အလုပ်လုပ်ပြီး — `to_timestamp('2000    JUN', 'FXYYYY MON')` ကတော့ — `to_timestamp` က space တစ်ခုတည်းကိုပဲ မျှော်လင့်လို့ — error ပြန်ပေးပါတယ်။ `FX` ကို template ထဲမှာ ပထမဆုံး item အဖြစ် သတ်မှတ်ပေးရပါမယ်။

- `to_timestamp` နဲ့ `to_date` ရဲ့ template string ထဲက separator တစ်ခု (space သို့မဟုတ် စာလုံး/ဂဏန်း မဟုတ်တဲ့ character) က — `FX` option မသုံးထားရင် — input string ထဲက separator တစ်ခုခုနဲ့ ကိုက်ညီမယ် ဒါမှမဟုတ် ကျော်သွားပါတယ်။ ဥပမာ — `to_timestamp('2000JUN', 'YYYY///MON')` နဲ့ `to_timestamp('2000/JUN', 'YYYY MON')` တို့က အလုပ်လုပ်ပြီး — `to_timestamp('2000//JUN', 'YYYY/MON')` ကတော့ — input string ထဲက separator အရေအတွက်က template ထဲက separator အရေအတွက်ထက် ပိုများနေလို့ — error ပြန်ပေးပါတယ်။

- `FX` သတ်မှတ်ထားရင်တော့ — template string ထဲက separator တစ်ခုက input string ထဲက character အတိအကျ တစ်ခုနဲ့ပဲ ကိုက်ညီပါတယ်။ ဒါပေမယ့် — input string ထဲက character က template string ရဲ့ separator နဲ့ တူညီနေစရာ မလိုဘူးဆိုတာ သတိပြုပါ။ ဥပမာ — `to_timestamp('2000/JUN', 'FXYYYY MON')` က အလုပ်လုပ်ပြီး — `to_timestamp('2000/JUN', 'FXYYYY  MON')` ကတော့ — template string ထဲက ဒုတိယ space က input string ထဲက J စာလုံးကို စားသုံးလိုက်လို့ — error ပြန်ပေးပါတယ်။

- `TZH` template pattern က sign ပါတဲ့ ဂဏန်း (signed number) နဲ့ ကိုက်ညီနိုင်ပါတယ်။ `FX` option မရှိရင် — minus sign တွေက မရှင်းလင်းဘဲ — separator အဖြစ် အဓိပ္ပာယ်ကောက်ခံရနိုင်ပါတယ်။ ဒီမရှင်းလင်းမှုကို ဒီလို ဖြေရှင်းပါတယ်: template string ထဲမှာ `TZH` မတိုင်ခင် ရှိတဲ့ separator အရေအတွက်က — input string ထဲမှာ minus sign မတိုင်ခင် ရှိတဲ့ separator အရေအတွက်ထက် နည်းနေရင် — minus sign ကို `TZH` ရဲ့ အစိတ်အပိုင်းအဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။ မဟုတ်ရင်တော့ minus sign ကို တန်ဖိုးတွေကြားက separator အဖြစ် သတ်မှတ်ပါတယ်။ ဥပမာ — `to_timestamp('2000 -10', 'YYYY TZH')` က -10 ကို `TZH` နဲ့ ကိုက်ညီစေပြီး — `to_timestamp('2000 -10', 'YYYY  TZH')` ကတော့ 10 ကို `TZH` နဲ့ ကိုက်ညီစေပါတယ်။

- `to_char` templates တွေထဲမှာ ရိုးရိုး text တွေ ထည့်လို့ ရပြီး — literal အတိုင်း ပြန်ထုတ်ပေးပါတယ်။ Template patterns တွေ ပါဝင်နေရင်တောင် — literal text အဖြစ် အဓိပ္ပာယ်ကောက်စေချင်တဲ့ substring ကို double quotes (") အတွင်း ထည့်နိုင်ပါတယ်။ ဥပမာ — `'"Hello Year "YYYY'` ထဲမှာ `YYYY` ကို နှစ်ဒေတာနဲ့ အစားထိုးမှာ ဖြစ်ပြီး — `Year` ထဲက Y တစ်လုံးတည်းကတော့ အစားထိုးခံရမှာ မဟုတ်ပါဘူး။ `to_date`၊ `to_number` နဲ့ `to_timestamp` တွေမှာတော့ — literal text နဲ့ double-quoted strings တွေက ၎င်းတို့ထဲမှာ ပါဝင်တဲ့ character အရေအတွက်ကို ကျော်သွားစေပါတယ်; ဥပမာ — `"XX"` က input character နှစ်လုံးကို ကျော်ပါတယ် (အဲဒီနှစ်လုံးက XX ဟုတ်မဟုတ်နဲ့ မသက်ဆိုင်ဘဲ)။

  > **အကြံပြုချက်:** PostgreSQL 12 မတိုင်မီက — input string ထဲက မလိုအပ်တဲ့ text တွေကို စာလုံး ဒါမှမဟုတ် ဂဏန်း မဟုတ်တဲ့ characters တွေနဲ့ ကျော်ဖို့ ဖြစ်နိုင်ခဲ့ပါတယ်။ ဥပမာ — `to_timestamp('2000y6m1d', 'yyyy-MM-DD')` က အရင်က အလုပ်လုပ်ခဲ့ပါတယ်။ အခုတော့ ဒီရည်ရွယ်ချက်အတွက် စာလုံး (letters) တွေကိုပဲ သုံးလို့ရပါတယ်။ ဥပမာ — `to_timestamp('2000y6m1d', 'yyyytMMtDDt')` နဲ့ `to_timestamp('2000y6m1d', 'yyyy"y"MM"m"DD"d"')` တို့က y၊ m နဲ့ d တွေကို ကျော်သွားပါတယ်။

- Output ထဲမှာ double quote တစ်ခု ထည့်ချင်ရင် — အဲဒီ့ရှေ့မှာ backslash တစ်ခု ထည့်ပေးရပါမယ် — ဥပမာ — `'\"YYYY Month\"'`။ Double-quoted strings တွေရဲ့ အပြင်ဘက်မှာတော့ backslash တွေက အထူး အဓိပ္ပာယ် မရှိပါဘူး။ Double-quoted string တစ်ခုအတွင်းမှာတော့ — backslash တစ်ခုက နောက်က character (ဘာပဲဖြစ်ဖြစ်) ကို literal အနေနဲ့ ယူစေပါတယ် (ဒါပေမယ့် — နောက် character က double quote ဒါမှမဟုတ် နောက်ထပ် backslash တစ်ခု မဟုတ်ရင်တော့ — အထူး သက်ရောက်မှု မရှိပါဘူး)။

- `to_timestamp` နဲ့ `to_date` တွေမှာ — year format သတ်မှတ်ချက်က ဂဏန်း 4 လုံး အောက်ဆိုရင် (ဥပမာ — `YYY`) ပြီးတော့ ပေးလိုက်တဲ့ နှစ်ကလည်း ဂဏန်း 4 လုံး အောက်ဆိုရင် — အဲဒီနှစ်ကို 2020 နဲ့ အနီးဆုံး ဖြစ်အောင် ချိန်ညှိပေးပါတယ် — ဥပမာ — 95 က 1995 ဖြစ်သွားပါတယ်။

- `to_timestamp` နဲ့ `to_date` တွေမှာ — အနုတ် (negative) နှစ်တွေကို BC ကို ရည်ညွှန်းတာအဖြစ် သဘောထားပါတယ်။ အနုတ် နှစ်နဲ့အတူ ရှင်းလင်းတဲ့ BC field တစ်ခုကိုပါ ရေးလိုက်ရင် — AD ပြန်ဖြစ်သွားပါတယ်။ သုည နှစ်ရဲ့ input ကို 1 BC အဖြစ် သဘောထားပါတယ်။

- `to_timestamp` နဲ့ `to_date` တွေမှာ — ဂဏန်း 4 လုံးထက် ပိုများတဲ့ နှစ်တွေကို process လုပ်တဲ့အခါ `YYYY` conversion မှာ ကန့်သတ်ချက်တစ်ခု ရှိပါတယ်။ `YYYY` နောက်မှာ ဂဏန်း မဟုတ်တဲ့ character တစ်ခု ဒါမှမဟုတ် template တစ်ခု သုံးပေးရပါမယ် — မဟုတ်ရင် နှစ်ကို ဂဏန်း 4 လုံးအနေနဲ့ပဲ အမြဲ အဓိပ္ပာယ်ကောက်ပါလိမ့်မယ်။ ဥပမာ (နှစ် 20000 အတွက်): `to_date('200001130', 'YYYYMMDD')` ကို ဂဏန်း 4 လုံး နှစ်အနေနဲ့ အဓိပ္ပာယ်ကောက်မှာ ဖြစ်ပြီး — ဒါကြောင့် နှစ်ရဲ့ နောက်မှာ ဂဏန်း မဟုတ်တဲ့ separator တစ်ခုကို သုံးပါ — ဥပမာ — `to_date('20000-1130', 'YYYY-MMDD')` ဒါမှမဟုတ် `to_date('20000Nov30', 'YYYYMonDD')`။

- `to_timestamp` နဲ့ `to_date` တွေမှာ — `CC` (century/ရာစုနှစ်) field ကို လက်ခံပေမယ့် — `YYY`၊ `YYYY` ဒါမှမဟုတ် `Y,YYY` field တစ်ခုခု ရှိနေရင် — လျစ်လျူရှုပါတယ်။ `CC` ကို `YY` ဒါမှမဟုတ် `Y` နဲ့ တွဲသုံးရင်တော့ — ရလဒ်ကို သတ်မှတ်ထားတဲ့ ရာစုနှစ်ထဲက အဲဒီနှစ်အနေနဲ့ တွက်ချက်ပါတယ်။ ရာစုနှစ်ကို သတ်မှတ်ပေမယ့် နှစ်ကို မသတ်မှတ်ရဘူးဆိုရင် — ရာစုနှစ်ရဲ့ ပထမနှစ်လို့ ယူဆပါတယ်။

- `to_timestamp` နဲ့ `to_date` တွေမှာ — weekday အမည်တွေ ဒါမှမဟုတ် နံပါတ်တွေ (`DAY`၊ `D` နဲ့ ဆက်စပ် field types) ကို လက်ခံပေမယ့် — ရလဒ် တွက်ချက်ရာမှာတော့ လျစ်လျူရှုပါတယ်။ quarter (`Q`) fields တွေအတွက်လည်း ဒီအတိုင်းပါပဲ။

- `to_timestamp` နဲ့ `to_date` တွေမှာ — ISO 8601 week-numbering date (Gregorian date နဲ့ မတူဘဲ) တစ်ခုကို — နည်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သတ်မှတ်နိုင်ပါတယ်:

  - နှစ်၊ ရက်သတ္တပတ် အမှတ် နဲ့ weekday: ဥပမာ — `to_date('2006-42-4', 'IYYY-IW-ID')` က date `2006-10-19` ကို ပြန်ပေးပါတယ်။ Weekday ကို ချန်လိုက်ရင် 1 (Monday) လို့ ယူဆပါတယ်။

  - နှစ် နဲ့ နှစ်ထဲက ရက်: ဥပမာ — `to_date('2006-291', 'IYYY-IDDD')` ကလည်း `2006-10-19` ကို ပြန်ပေးပါတယ်။

  ISO 8601 week-numbering fields တွေနဲ့ Gregorian date fields တွေကို ရောနှောပြီး date တစ်ခု ထည့်သွင်းဖို့ ကြိုးစားတာက အဓိပ္ပာယ် မရှိတဲ့အပြင် — error လည်း ဖြစ်စေပါတယ်။ ISO 8601 week-numbering နှစ်ရဲ့ ဆက်စပ်အခြေအနေမှာ — “month” ဒါမှမဟုတ် “day of month” ဆိုတဲ့ အယူအဆတွေက အဓိပ္ပာယ် မရှိပါဘူး။ Gregorian နှစ်ရဲ့ ဆက်စပ်အခြေအနေမှာတော့ — ISO week က အဓိပ္ပာယ် မရှိပါဘူး။

  > **သတိပြုရန်:** `to_date` က Gregorian နဲ့ ISO week-numbering date fields တွေ ရောနှောမှုကို ငြင်းပယ်ပေမယ့် — `to_char` ကတော့ ငြင်းပယ်မှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ `YYYY-MM-DD (IYYY-IDDD)` လို output format သတ်မှတ်ချက်တွေက အသုံးဝင်နိုင်လို့ပါ။ ဒါပေမယ့် — `IYYY-MM-DD` လိုမျိုး ရေးတာကို ရှောင်ပါ — ဒါမျိုးက နှစ်အစပိုင်း အနီးမှာ မမျှော်လင့်တဲ့ ရလဒ်တွေ ထွက်စေနိုင်လို့ပါ။ (အသေးစိတ်အတွက် [အပိုင်း 9.9.1](/docs/postgresql/functions-datetime) ကို ကြည့်ပါ။)

- `to_timestamp` မှာ — millisecond (`MS`) ဒါမှမဟုတ် microsecond (`US`) fields တွေကို decimal point ရဲ့ နောက်မှာရှိတဲ့ စက္ကန့် ဂဏန်းတွေအနေနဲ့ သုံးပါတယ်။ ဥပမာ — `to_timestamp('12.3', 'SS.MS')` က millisecond 3 ခု မဟုတ်ဘဲ — 300 ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ conversion က ဒါကို 12 + 0.3 စက္ကန့်အနေနဲ့ သဘောထားလို့ပါ။ ဒါကြောင့် `SS.MS` format အတွက် — input values 12.3၊ 12.30 နဲ့ 12.300 တို့က millisecond အရေအတွက် တူညီတာကို သတ်မှတ်ပါတယ်။ millisecond သုံးခု ရဖို့ဆိုရင် 12.003 လို့ ရေးရမှာ ဖြစ်ပြီး — conversion က ဒါကို 12 + 0.003 = 12.003 စက္ကန့်အနေနဲ့ သဘောထားပါတယ်။

  ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခု ကြည့်ရအောင်: `to_timestamp('15:12:02.020.001230', 'HH24:MI:SS.MS.US')` က နာရီ 15 ၊ မိနစ် 12 နဲ့ စက္ကန့် 2 + မီလီစက္ကန့် 20 + မိုက်ခရိုစက္ကန့် 1230 = 2.021230 စက္ကန့် ဖြစ်ပါတယ်။

- `to_char(..., 'ID')` ရဲ့ တစ်ပတ်ထဲက ရက် နံပါတ်စဉ်က `extract(isodow from ...)` function နဲ့ ကိုက်ညီပြီး — `to_char(..., 'D')` ကတော့ `extract(dow from ...)` ရဲ့ ရက် နံပါတ်စဉ်နဲ့ မကိုက်ညီပါဘူး။

- `to_char(interval)` က `HH` နဲ့ `HH12` တွေကို နာရီ 12 ပြဒိုင်း (12-hour clock) အတိုင်း format လုပ်ပါတယ် — ဥပမာ — နာရီ သုည နဲ့ နာရီ 36 နှစ်ခုစလုံးက 12 အဖြစ် ထွက်ပြီး — `HH24` ကတော့ နာရီတန်ဖိုး အပြည့်ကို ထုတ်ပေးပါတယ် — interval တန်ဖိုးတစ်ခုမှာ ဒါက 23 ထက် ကျော်လွန်နိုင်ပါတယ်။

numeric တန်ဖိုးတွေကို format လုပ်ရာမှာ သုံးလို့ရတဲ့ template patterns တွေကို ဇယား 9.29 မှာ ပြထားပါတယ်။

**ဇယား 9.29. Template Patterns for Numeric Formatting (numeric formatting အတွက် template patterns များ)**

| Pattern | ဖော်ပြချက် |
| --- | --- |
| `9` | ဂဏန်း နေရာ (insignificant (တန်ဖိုးမဲ့) ဖြစ်ရင် ဖျောက်ပစ်နိုင်သည်) |
| `0` | ဂဏန်း နေရာ (insignificant ဖြစ်နေရင်တောင် ဖျောက်ပစ်မည် မဟုတ်) |
| `.` (period) | decimal point (ဒသမ အမှတ်) |
| `,` (comma) | group (ထောင်ဂဏန်း) separator (ခွဲခြားသင်္ကေတ) |
| `PR` | အနုတ်တန်ဖိုးကို angle brackets (< >) အတွင်းမှာ ပြသည် |
| `S` | ဂဏန်းနဲ့ ကပ်လျက် ရှိတဲ့ sign (locale သုံးသည်) |
| `L` | currency သင်္ကေတ (locale သုံးသည်) |
| `D` | decimal point (locale သုံးသည်) |
| `G` | group separator (locale သုံးသည်) |
| `MI` | သတ်မှတ်ထားတဲ့ နေရာမှာ minus sign (number < 0 ဖြစ်ရင်) |
| `PL` | သတ်မှတ်ထားတဲ့ နေရာမှာ plus sign (number > 0 ဖြစ်ရင်) |
| `SG` | သတ်မှတ်ထားတဲ့ နေရာမှာ plus/minus sign |
| `RN` or `rn` | ရောမ ဂဏန်း (တန်ဖိုး 1 နဲ့ 3999 ကြား) |
| `TH` or `th` | ordinal နံပါတ် နောက်ဆက် |
| `V` | သတ်မှတ်ထားတဲ့ ဂဏန်း အရေအတွက်အလိုက် shift လုပ်သည် (မှတ်စုများ ကြည့်ပါ) |
| `EEEE` | scientific notation (သိပ္ပံနည်း အမှတ်အသား) အတွက် exponent |

numeric formatting အတွက် အသုံးပြုပုံ မှတ်စုများ:

- `0` က အမြဲ ပုံနှိပ်ခံရမယ့် ဂဏန်းနေရာကို သတ်မှတ်ပါတယ် — ရှေ့ဆုံး/နောက်ဆုံးမှာ သုည ပါနေရင်တောင် ဖြစ်ပါတယ်။ `9` ကလည်း ဂဏန်းနေရာကို သတ်မှတ်ပေမယ့် — ရှေ့ဆုံးက သုည ဖြစ်ရင် space နဲ့ အစားထိုးပြီး — နောက်ဆုံးက သုည ဖြစ်ပြီး fill mode သတ်မှတ်ထားရင်တော့ ဖျက်ပစ်ပါတယ်။ (`to_number()` အတွက်တော့ — ဒီ pattern character နှစ်ခုက ညီမျှပါတယ်။)

- Format က format လုပ်နေတဲ့ ဂဏန်းထက် ဒသမ နောက် ဂဏန်း (fractional digits) နည်းနည်းပဲ ပေးထားရင် — `to_char()` က သတ်မှတ်ထားတဲ့ ဒသမ ဂဏန်း အရေအတွက်အထိ ဂဏန်းကို ဝိုင်း (round) ပေးပါတယ်။

- Pattern characters `S`၊ `L`၊ `D` နဲ့ `G` တို့က — လက်ရှိ locale က သတ်မှတ်ထားတဲ့ sign၊ currency သင်္ကေတ၊ decimal point နဲ့ ထောင်ဂဏန်း separator characters တွေကို ကိုယ်စားပြုပါတယ် (lc_monetary နဲ့ lc_numeric ကို ကြည့်ပါ)။ Period နဲ့ comma ဆိုတဲ့ pattern characters တွေကတော့ — locale ဘယ်လိုပဲ ဖြစ်ဖြစ် — decimal point နဲ့ ထောင်ဂဏန်း separator ရဲ့ အဓိပ္ပာယ်တွေနဲ့အတူ — အဲဒီ character အတိအကျတွေကို ကိုယ်စားပြုပါတယ်။

- `to_char()` ရဲ့ pattern ထဲမှာ sign အတွက် ရှင်းလင်းစွာ နေရာ ချန်မထားရင် — sign အတွက် ကော်လံတစ်ခု သီးသန့် ချန်ထားပြီး — ဂဏန်းနဲ့ ကပ်လျက် (ဂဏန်းရဲ့ ဘယ်ဘက် ချက်ချင်း) မှာ ထားပါတယ်။ `S` က `9` တွေရဲ့ ဘယ်ဘက် ချက်ချင်းမှာ ပေါ်ရင်လည်း — အလားတူ ဂဏန်းနဲ့ ကပ်လျက် ထားပါတယ်။

- `SG`၊ `PL` ဒါမှမဟုတ် `MI` နဲ့ format လုပ်ထားတဲ့ sign က ဂဏန်းနဲ့ ကပ်လျက် မဟုတ်ပါဘူး; ဥပမာ — `to_char(-12, 'MI9999')` က `'-  12'` ကို ထုတ်ပေးပြီး — `to_char(-12, 'S9999')` ကတော့ `'  -12'` ကို ထုတ်ပေးပါတယ်။ (Oracle ရဲ့ implementation က `9` မတိုင်ခင် `MI` သုံးတာကို ခွင့်မပြုဘဲ — `9` က `MI` ရဲ့ ရှေ့မှာ ရှိရမယ်လို့ လိုအပ်ပါတယ်။)

- `TH` က သုညအောက် တန်ဖိုးတွေကို မပြောင်းပေးသလို — ဒသမ ကိန်းတွေ (fractional numbers) ကိုလည်း မပြောင်းပေးပါဘူး။

- `PL`၊ `SG` နဲ့ `TH` တို့က PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

- `to_number` မှာ — `L` ဒါမှမဟုတ် `TH` လို data မဟုတ်တဲ့ template patterns တွေ သုံးထားရင် — input characters တွေက data characters (ဂဏန်း၊ sign၊ decimal point ဒါမှမဟုတ် comma) မဟုတ်ဘူးဆိုရင် — template pattern နဲ့ ကိုက်ညီသည်ဖြစ်စေ၊ မကိုက်ညီသည်ဖြစ်စေ — သက်ဆိုင်ရာ input character အရေအတွက်ကို ကျော်သွားပါတယ်။ ဥပမာ — `TH` က data မဟုတ်တဲ့ character နှစ်လုံးကို ကျော်သွားမှာ ဖြစ်ပါတယ်။

- `V` က `to_char` နဲ့ဆိုရင် input values တွေကို 10^n နဲ့ မြှောက်ပေးပါတယ် — ဒီမှာ n က `V` နောက်မှာ လိုက်တဲ့ ဂဏန်း အရေအတွက် ဖြစ်ပါတယ်။ `V` က `to_number` နဲ့ဆိုရင်တော့ အလားတူ ပုံစံနဲ့ စားပေးပါတယ်။ `V` ကို input ဒါမှမဟုတ် output string ထဲက သွယ်ဝိုက်တဲ့ (implicit) decimal point ရဲ့ နေရာကို အမှတ်အသားလုပ်တာအဖြစ် ယူဆနိုင်ပါတယ်။ `to_char` နဲ့ `to_number` တို့က `V` ကို decimal point နဲ့ တွဲသုံးတာကို မထောက်ပံ့ပါဘူး (ဥပမာ — 99.9V99 က ခွင့်မပြုပါ)။

- `EEEE` (scientific notation) ကို — ဂဏန်း နဲ့ decimal point patterns တွေကလွဲပြီး — တခြား formatting patterns ဒါမှမဟုတ် modifiers တစ်ခုခုနဲ့ တွဲသုံးလို့ မရပါဘူး — ပြီးတော့ format string ရဲ့ အဆုံးမှာ ရှိရပါမယ် (ဥပမာ — 9.99EEEE က valid pattern တစ်ခု ဖြစ်ပါတယ်)။

- `to_number()` မှာ — `RN` pattern က ရောမ ဂဏန်းတွေ (standard ပုံစံအတိုင်း) ကို ဂဏန်းတွေအဖြစ် ပြောင်းပေးပါတယ်။ Input က case-insensitive (စာလုံးကြီး/ငယ် မခွဲခြား) ဖြစ်လို့ — `RN` နဲ့ `rn` တို့က ညီမျှပါတယ်။ `RN` ကို — `FM` ကလွဲပြီး — တခြား formatting patterns ဒါမှမဟုတ် modifiers တစ်ခုခုနဲ့ တွဲသုံးလို့ မရပါဘူး။ `FM` က `to_char()` မှာပဲ သက်ဆိုင်ပြီး — `to_number()` မှာတော့ လျစ်လျူရှုပါတယ်။

Modifier အချို့ကို ဘယ် template pattern မဆို အပေါ်မှာ သက်ရောက်စေပြီး — pattern ရဲ့ အပြုအမူကို ပြောင်းလဲပေးနိုင်ပါတယ်။ ဥပမာ — `FM99.99` ဆိုတာ `FM` modifier ပါတဲ့ `99.99` pattern ဖြစ်ပါတယ်။ numeric formatting အတွက် modifier patterns တွေကို ဇယား 9.30 မှာ ပြထားပါတယ်။

**ဇယား 9.30. Template Pattern Modifiers for Numeric Formatting (numeric formatting အတွက် template pattern modifiers များ)**

| Modifier | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| `FM` prefix | fill mode (နောက်ဆုံးက သုညတွေနဲ့ padding space တွေကို ဖျောက်သည်) | `FM99.99` |
| `TH` suffix | ordinal နံပါတ် နောက်ဆက် — စာလုံးကြီး | `999TH` |
| `th` suffix | ordinal နံပါတ် နောက်ဆက် — စာလုံးငယ် | `999th` |

`to_char` function သုံးပုံ ဥပမာအချို့ကို ဇယား 9.31 မှာ ပြထားပါတယ်။

**ဇယား 9.31. to_char Examples (to_char ဥပမာများ)**

| Expression | ရလဒ် |
| --- | --- |
| `to_char(current_timestamp, 'Day, DD  HH12:MI:SS')` | `'Tuesday  , 06  05:39:18'` |
| `to_char(current_timestamp, 'FMDay, FMDD  HH12:MI:SS')` | `'Tuesday, 6  05:39:18'` |
| `to_char(current_timestamp AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')` | `'2022-12-06T05:39:18Z'`, ISO 8601 extended format (ISO 8601 ၏ ချဲ့ထားသော ပုံစံ) |
| `to_char(-0.1, '99.99')` | `'  -.10'` |
| `to_char(-0.1, 'FM9.99')` | `'-.1'` |
| `to_char(-0.1, 'FM90.99')` | `'-0.1'` |
| `to_char(0.1, '0.9')` | `' 0.1'` |
| `to_char(12, '9990999.9')` | `'    0012.0'` |
| `to_char(12, 'FM9990999.9')` | `'0012.'` |
| `to_char(485, '999')` | `' 485'` |
| `to_char(-485, '999')` | `'-485'` |
| `to_char(485, '9 9 9')` | `' 4 8 5'` |
| `to_char(1485, '9,999')` | `' 1,485'` |
| `to_char(1485, '9G999')` | `' 1 485'` |
| `to_char(148.5, '999.999')` | `' 148.500'` |
| `to_char(148.5, 'FM999.999')` | `'148.5'` |
| `to_char(148.5, 'FM999.990')` | `'148.500'` |
| `to_char(148.5, '999D999')` | `' 148,500'` |
| `to_char(3148.5, '9G999D999')` | `' 3 148,500'` |
| `to_char(-485, '999S')` | `'485-'` |
| `to_char(-485, '999MI')` | `'485-'` |
| `to_char(485, '999MI')` | `'485 '` |
| `to_char(485, 'FM999MI')` | `'485'` |
| `to_char(485, 'PL999')` | `'+485'` |
| `to_char(485, 'SG999')` | `'+485'` |
| `to_char(-485, 'SG999')` | `'-485'` |
| `to_char(-485, '9SG99')` | `'4-85'` |
| `to_char(-485, '999PR')` | `'<485>'` |
| `to_char(485, 'L999')` | `'DM 485'` |
| `to_char(485, 'RN')` | `'        CDLXXXV'` |
| `to_char(485, 'FMRN')` | `'CDLXXXV'` |
| `to_char(5.2, 'FMRN')` | `'V'` |
| `to_char(482, '999th')` | `' 482nd'` |
| `to_char(485, '"Good number:"999')` | `'Good number: 485'` |
| `to_char(485.8, '"Pre:"999" Post:" .999')` | `'Pre: 485 Post: .800'` |
| `to_char(12, '99V999')` | `' 12000'` |
| `to_char(12.4, '99V999')` | `' 12400'` |
| `to_char(12.45, '99V9')` | `' 125'` |
| `to_char(0.0004859, '9.99EEEE')` | `' 4.86e-04'` |
