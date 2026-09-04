---
title: "ALTER STATISTICS (extended statistics object တစ်ခု၏ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား extended statistics object တစ်ခု၏ parameters များကို ပြောင်းလဲပေးသည့် command — owner ပြောင်းလဲခြင်း, rename လုပ်ခြင်း, schema ပြောင်းလဲခြင်းနှင့် statistics target (0–10000) သတ်မှတ်ခြင်းတို့ ပါဝင်သည် — statistics object ၏ owner ဖြစ်ရန် လိုအပ်ပြီး SQL standard တွင် မပါဝင်ပါ"
order: 300
source: "https://www.postgresql.org/docs/current/sql-alterstatistics.html"
status: translated
updated: 2026-09-04
---

## ALTER STATISTICS (extended statistics object တစ်ခု၏ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER STATISTICS — extended statistics object တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER STATISTICS name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER STATISTICS name RENAME TO new_name
ALTER STATISTICS name SET SCHEMA new_schema
ALTER STATISTICS name SET STATISTICS { new_target | DEFAULT }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER STATISTICS` က — တည်ရှိပြီးသား extended statistics object (တိုးချဲ့ထားသော statistics object) တစ်ခုရဲ့ parameters တွေကို ပြောင်းလဲပေးပါတယ်။ `ALTER STATISTICS` command ထဲမှာ တိတိကျကျ သတ်မှတ်မထားတဲ့ parameters တွေကတော့ — အရင်က သတ်မှတ်ချက်တွေအတိုင်း ဆက်လက် ထိန်းသိမ်းထားပါတယ်။

`ALTER STATISTICS` ကို သုံးဖို့ — သင်ဟာ statistics object ကို ပိုင်ဆိုင်ရပါမယ်။ Statistics object တစ်ခုရဲ့ schema ကို ပြောင်းလဲဖို့ — schema အသစ်ပေါ်မှာ `CREATE` privilege လည်း ရှိရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ — သင်ဟာ owner အသစ် ဖြစ်လာမယ့် role ဆီကို `SET ROLE` လုပ်နိုင်ရပြီး — အဲဒီ role မှာ statistics object ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ကို ပြောင်းလဲတာဟာ သင်က statistics object ကို drop လုပ်ပြီး ပြန်လည် ဖန်တီးလိုက်ရင် မလုပ်နိုင်တာမျိုး ဘာမှ မဟုတ်ဘူးဆိုတာ သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် statistics object ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် statistics object ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **new_owner** — statistics object ရဲ့ owner အသစ် ဖြစ်လာမယ့် user ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **new_name** — statistics object အတွက် နာမည်အသစ် ဖြစ်ပါတယ်။
- **new_schema** — statistics object အတွက် schema အသစ် ဖြစ်ပါတယ်။
- **new_target** — နောက်ပိုင်း `ANALYZE` operations တွေအတွက် ဒီ statistics object ရဲ့ statistic-gathering target (ကိန်းဂဏန်း အချက်အလက် စုဆောင်းမှု ပစ်မှတ်) ဖြစ်ပါတယ်။ Target ကို 0 ကနေ 10000 အတွင်း သတ်မှတ်နိုင်ပါတယ်။ System ရဲ့ default statistics target (default_statistics_target) ကို ပြန်လည် အသုံးပြုဖို့ DEFAULT လို့ သတ်မှတ်ပါ။ (-1 တန်ဖိုး သတ်မှတ်တာက — အလားတူ ရလဒ်ကို ရရှိဖို့ နည်းလမ်းဟောင်း (obsolete) တစ်ခု ဖြစ်ပါတယ်။) PostgreSQL query planner က statistics တွေကို အသုံးပြုပုံအကြောင်း ပိုမို သိရှိလိုရင် — အပိုင်း 14.2 ကို ကိုးကားကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER STATISTICS` command ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE STATISTICS](https://www.postgresql.org/docs/current/sql-createstatistics.html), [DROP STATISTICS](/docs/postgresql/sql-dropstatistics)
