---
title: "DROP INDEX (index တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Index တစ်ခုကို database system မှ ဖယ်ရှားပေးသည့် command — CONCURRENTLY, IF EXISTS, CASCADE/RESTRICT options များ ပါဝင်ပြီး index ၏ owner ဖြစ်မှသာ execute လုပ်နိုင်သည်; SQL standard တွင် index အတွက် ပြဋ္ဌာန်းချက်များ မပါဝင်ပါ"
order: 178
source: "https://www.postgresql.org/docs/current/sql-dropindex.html"
status: translated
updated: 2026-09-04
---

## DROP INDEX (index တစ်ခုကို ဖယ်ရှားခြင်း)

DROP INDEX — index (အညွှန်း) တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP INDEX [ CONCURRENTLY ] [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP INDEX` က database system ထဲက တည်ရှိပြီးသား index တစ်ခုကို drop (ဖျက်သိမ်း) လုပ်ပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — index ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **CONCURRENTLY** — Index ရဲ့ table ပေါ်က concurrent selects, inserts, updates နဲ့ deletes တွေကို lock လုပ်မထားဘဲ — index ကို drop လုပ်ပါတယ်။ ပုံမှန် `DROP INDEX` က table ပေါ်မှာ ACCESS EXCLUSIVE lock တစ်ခုကို ရယူပြီး — index drop ပြီးဆုံးတဲ့အထိ တခြား accesses တွေကို ပိတ်ဆို့ထားပါတယ်။ ဒီ option နဲ့ဆိုရင်တော့ — command က ပဋိပက္ခ ဖြစ်နေတဲ့ (conflicting) transactions တွေ ပြီးဆုံးတဲ့အထိ စောင့်ဆိုင်းပါတယ်။
ဒီ option ကို သုံးတဲ့အခါ သတိထားရမယ့် ကိစ္စတွေ အများအပြား ရှိပါတယ်။ Index နာမည် တစ်ခုတည်းကိုသာ သတ်မှတ်လို့ ရပြီး — CASCADE option ကိုတော့ ထောက်ပံ့မထားပါဘူး။ (ဒါကြောင့် — UNIQUE ဒါမှမဟုတ် PRIMARY KEY constraint တစ်ခုကို ထောက်ပံ့ပေးနေတဲ့ index တစ်ခုကို ဒီနည်းနဲ့ drop လုပ်လို့ မရပါဘူး။) ဒါ့အပြင် — ပုံမှန် `DROP INDEX` commands တွေကို transaction block တစ်ခုရဲ့ အတွင်းမှာ လုပ်ဆောင်လို့ ရပေမယ့် — `DROP INDEX CONCURRENTLY` ကတော့ မရပါဘူး။ နောက်ဆုံးအနေနဲ့ — partitioned tables (partition ခွဲထားသော ဇယားများ) တွေပေါ်က indexes တွေကို ဒီ option သုံးပြီး drop လုပ်လို့ မရပါဘူး။
Temporary tables (ယာယီဇယားများ) တွေအတွက်ကတော့ — `DROP INDEX` က အမြဲတမ်း non-concurrent ဖြစ်ပါတယ်; တခြား session တစ်ခုကမှ သူတို့ကို ဝင်ရောက်လို့ မရနိုင်တာကြောင့် ဖြစ်ပြီး — non-concurrent index drop က ပိုပြီး စရိတ်သက်သာလို့ ဖြစ်ပါတယ်။
- **IF EXISTS** — Index မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် index တစ်ခုရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်)။
- **CASCADE** — Index ပေါ်မှာ မှီခိုနေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ အဆင့်ဆင့် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Index ပေါ်မှာ objects တစ်ခုခု မှီခိုနေရင် — index ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

ဒီ command က `title_idx` ဆိုတဲ့ index ကို ဖယ်ရှားပေးပါလိမ့်မယ်:

```sql
DROP INDEX title_idx;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP INDEX` က PostgreSQL ရဲ့ language extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard မှာတော့ indexes တွေအတွက် ပြဋ္ဌာန်းချက် (provisions) တွေ မပါဝင်ပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE INDEX](/docs/postgresql/sql-createindex)
