---
title: "UUID Functions (UUID လုပ်ဆောင်ချက်များ)"
description: "UUID များ ထုတ်လုပ်ရန် (gen_random_uuid, uuidv4, uuidv7) နှင့် UUID များမှ အချက်အလက် ထုတ်ယူရန် (uuid_extract_timestamp, uuid_extract_version) functions များ"
order: 81
source: "https://www.postgresql.org/docs/current/functions-uuid.html"
status: translated
updated: 2026-09-04
---

## 9.14. UUID Functions (UUID လုပ်ဆောင်ချက်များ)

UUID တွေ ထုတ်လုပ်ဖို့ သုံးနိုင်တဲ့ PostgreSQL functions တွေကို ဇယား 9.45 မှာ ပြသထားပါတယ်။

**ဇယား 9.45. UUID Generation Functions (UUID ထုတ်လုပ်သည့် functions များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| gen_random_uuid ( ) → uuid uuidv4 ( ) → uuid version 4 (random — ကျပန်း) UUID တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ gen_random_uuid() → 5b30857f-0bfa-48b5-ac0b-5c64e28078d1 uuidv4() → b42410ee-132f-42ee-9e4f-09a6485c95b8 |
| uuidv7 ( [ shift interval ] ) → uuid version 7 (time-ordered — အချိန်အလိုက် စီထားသော) UUID တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Timestamp ကို — millisecond တိကျမှု ရှိတဲ့ UNIX timestamp + sub-millisecond timestamp + random — တို့နဲ့ တွက်ချက်ပါတယ်။ Optional parameter ဖြစ်တဲ့ shift က တွက်ချက်ပြီးသား timestamp ကို ပေးထားတဲ့ interval အတိုင်း ရွှေ့ပြောင်းပေးပါလိမ့်မယ်။ Infinite (အဆုံးမရှိ) interval တန်ဖိုးတွေကိုတော့ လက်မခံပါဘူး။ ရွှေ့ပြောင်းပြီးသား timestamp က UUID version 7 ရဲ့ 48-bit millisecond timestamp field က ထောက်ပံ့တဲ့ range အတွင်းမှာ ကျရောက်ရပါမယ်: 1970-01-01 00:00:00 UTC ကနေ ခန့်မှန်းခြေအားဖြင့် ခရစ်နှစ် 10889 အထိ။ ရလဒ် timestamp က ဒီ range ရဲ့ အပြင်ဘက်ကို ရောက်နေရင် error တစ်ခု ထွက်လာပါလိမ့်မယ်။ uuidv7() → 019535d9-3df7-79fb-b466-fa907fa17f9e |

> **မှတ်ချက်:** [uuid-ossp](https://www.postgresql.org/docs/current/uuid-ossp.html) module က — UUID တွေ ထုတ်လုပ်ဖို့အတွက် တခြား standard algorithms တွေကို implement လုပ်ပေးတဲ့ functions တွေ ထပ်ဆောင်း ပံ့ပိုးပေးပါတယ်။

UUID တွေကနေ အချက်အလက် ထုတ်ယူဖို့ သုံးနိုင်တဲ့ PostgreSQL functions တွေကို ဇယား 9.46 မှာ ပြသထားပါတယ်။

**ဇယား 9.46. UUID Extraction Functions (UUID ထုတ်ယူသည့် functions များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| uuid_extract_timestamp ( uuid ) → timestamp with time zone version 1 သို့မဟုတ် 7 ဖြစ်တဲ့ UUID တစ်ခုကနေ timestamp with time zone ကို ထုတ်ယူပါတယ်။ တခြား version တွေအတွက်တော့ — ဒီ function က null ပြန်ပေးပါတယ်။ ထုတ်ယူလိုက်တဲ့ timestamp က UUID ကို ထုတ်လုပ်ခဲ့တဲ့ အချိန်နဲ့ အတိအကျ တူညီတယ်လို့တော့ မဆိုနိုင်ဘူးဆိုတာ သတိပြုပါ; ဒါက UUID ကို ထုတ်လုပ်ခဲ့တဲ့ implementation အပေါ်မှာ မူတည်ပါတယ်။ uuid_extract_timestamp('019535d9-3df7-79fb-b466-fa907fa17f9e'::uuid) → 2025-02-23 21:46:24.503-05 |
| uuid_extract_version ( uuid ) → smallint RFC 9562 မှာ ဖော်ပြထားတဲ့ variants တစ်ခုခုထဲက UUID တစ်ခုကနေ version ကို ထုတ်ယူပါတယ်။ တခြား variants တွေအတွက်တော့ — ဒီ function က null ပြန်ပေးပါတယ်။ ဥပမာ — gen_random_uuid() နဲ့ ထုတ်လုပ်ထားတဲ့ UUID တစ်ခုအတွက်ဆိုရင် ဒီ function က 4 ကို ပြန်ပေးပါလိမ့်မယ်။ uuid_extract_version('41db1265-8bc1-4ab3-992f-885799a4af1d'::uuid) → 4 uuid_extract_version('019535d9-3df7-79fb-b466-fa907fa17f9e'::uuid) → 7 |

UUID တွေအတွက် — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ — ပုံမှန် comparison operators တွေကိုလည်း PostgreSQL က ထောက်ပံ့ပေးပါတယ်။

PostgreSQL ထဲက `uuid` data type အကြောင်း အသေးစိတ်ကို [အပိုင်း 8.12](/docs/postgresql/datatype-uuid) မှာ ကြည့်ပါ။
