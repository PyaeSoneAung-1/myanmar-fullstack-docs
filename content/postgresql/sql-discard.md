---
title: "DISCARD (session state များကို ရှင်းလင်းဖယ်ရှားခြင်း)"
description: "Database session တစ်ခုနှင့် ဆက်စပ်နေသော internal resources များကို လွှတ်ပေးပြီး session state ကို တစ်စိတ်တစ်ပိုင်း သို့မဟုတ် အပြည့်အဝ ပြန်လည်သတ်မှတ်ပေးသည့် command — DISCARD ALL, PLANS, SEQUENCES, TEMPORARY/TEMP subcommands များ ပါဝင်ပြီး DISCARD ALL ကို transaction block အတွင်း execute လုပ်၍ မရပါ"
order: 186
source: "https://www.postgresql.org/docs/current/sql-discard.html"
status: translated
updated: 2026-09-04
---

## DISCARD (session state များကို ရှင်းလင်းဖယ်ရှားခြင်း)

DISCARD — session state (session ရဲ့ အခြေအနေ) များကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DISCARD { ALL | PLANS | SEQUENCES | TEMPORARY | TEMP }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DISCARD` က database session တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ internal resources (အတွင်းပိုင်း အရင်းအမြစ်များ) တွေကို လွှတ်ပေး (release) ပါတယ်။ ဒီ command က session ရဲ့ state ကို — တစ်စိတ်တစ်ပိုင်း ဒါမှမဟုတ် အပြည့်အဝ — ပြန်လည်သတ်မှတ်ရာမှာ အသုံးဝင်ပါတယ်။ မတူညီတဲ့ resource အမျိုးအစားတွေကို လွှတ်ပေးဖို့ subcommands (လက်အောက်ခံ commands) အများအပြား ရှိပါတယ်; `DISCARD ALL` ပုံစံက ကျန်တဲ့ subcommands တွေ အားလုံးကို လွှမ်းခြုံ (subsume) နိုင်ပြီး — နောက်ထပ် state အချို့ကိုပါ ပြန်လည်သတ်မှတ်ပေးပါတယ်။

## Parameters (parameter များ)

- **PLANS** — Cache လုပ်ထားတဲ့ query plans (query ဆောင်ရွက်မှု အစီအစဉ်များ) တွေ အားလုံးကို လွှတ်ပေးပြီး — ဆက်စပ်နေတဲ့ prepared statement ကို နောက်တစ်ကြိမ် သုံးတဲ့အခါ — re-planning (plan ပြန်လည်ရေးဆွဲခြင်း) ဖြစ်ပေါ်လာအောင် အတင်းလုပ်ပါတယ်။
- **SEQUENCES** — Cache လုပ်ထားတဲ့ sequence နဲ့ ဆက်စပ်တဲ့ state တွေ အားလုံးကို ဖယ်ရှားပါတယ် — currval()/lastval() အချက်အလက်တွေနဲ့ — nextval() က မပြန်ရသေးတဲ့ preallocated (ကြိုတင် ခွဲဝေထားသော) sequence values တွေ အပါအဝင် ဖြစ်ပါတယ်။ (Preallocated sequence values တွေရဲ့ ဖော်ပြချက်အတွက် CREATE SEQUENCE ကို ကြည့်ပါ။)
- **TEMPORARY or TEMP** — လက်ရှိ session ထဲမှာ ဖန်တီးထားတဲ့ temporary tables (ယာယီဇယားများ) တွေ အားလုံးကို drop လုပ်ပါတယ်။
- **ALL** — လက်ရှိ session နဲ့ ဆက်စပ်နေတဲ့ temporary resources (ယာယီ အရင်းအမြစ်များ) တွေ အားလုံးကို လွှတ်ပေးပြီး — session ကို ၎င်းရဲ့ ကနဦး (initial) state ဆီ ပြန်လည်သတ်မှတ်ပေးပါတယ်။ လက်ရှိမှာတော့ — ဒါက အောက်ပါ statement အစီအစဉ်တွေကို execute လုပ်ခြင်းနဲ့ အတူတူပဲ ဖြစ်ပါတယ်:

CLOSE ALL;
SET SESSION AUTHORIZATION DEFAULT;
RESET ALL;
DEALLOCATE ALL;
UNLISTEN *;
SELECT pg_advisory_unlock_all();
DISCARD PLANS;
DISCARD TEMP;
DISCARD SEQUENCES;

## Notes (မှတ်စုများ)

`DISCARD ALL` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

## Compatibility (လိုက်ဖက်ညီမှု)

`DISCARD` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။
