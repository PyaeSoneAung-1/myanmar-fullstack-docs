---
title: "REFRESH MATERIALIZED VIEW (materialized view တစ်ခုကို ပြန်လည် ဖြည့်တင်ခြင်း)"
description: "Materialized view တစ်ခုရဲ့ အကြောင်းအရာတွေကို လုံးလုံး အစားထိုး ပြန်လည် ဖြည့်တင်ပေးတဲ့ command — CONCURRENTLY option (တစ်ပြိုင်နက် selects များကို lock မပိတ်ဘဲ refresh လုပ်ခြင်း၊ UNIQUE index လိုအပ်ချက်နှင့် ကန့်သတ်ချက်များ) နှင့် WITH [NO] DATA ပုံစံများအကြောင်း အသေးစိတ် — MAINTAIN privilege လိုအပ်ပြီး ORDER BY အစီအစဉ် ထိန်းသိမ်းမပေးနိုင်ခြင်း စသည့် မှတ်စုများလည်း ပါဝင်သည်"
order: 202
source: "https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html"
status: translated
updated: 2026-09-04
---

## REFRESH MATERIALIZED VIEW (materialized view တစ်ခုကို ပြန်လည် ဖြည့်တင်ခြင်း)

REFRESH MATERIALIZED VIEW — materialized view တစ်ခုရဲ့ အကြောင်းအရာတွေကို အစားထိုးခြင်း

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
REFRESH MATERIALIZED VIEW [ CONCURRENTLY ] name
    [ WITH [ NO ] DATA ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`REFRESH MATERIALIZED VIEW` က materialized view တစ်ခုရဲ့ အကြောင်းအရာတွေကို လုံးလုံး အစားထိုးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — သင်က materialized view ပေါ်မှာ `MAINTAIN` privilege ရှိရပါမယ်။ အကြောင်းအရာ အဟောင်းတွေကို စွန့်ပစ်ပါတယ်။ `WITH DATA` ကို သတ်မှတ်ထားရင် (ဒါမှမဟုတ် default အနေနဲ့ ဖြစ်နေရင်) — view ကို သတ်မှတ်ထားတဲ့ (backing) query ကို execute လုပ်ပြီး — data အသစ်တွေကို ထောက်ပံ့ပေးပြီး — materialized view ကို scannable အခြေအနေ (scan လုပ်လို့ ရတဲ့ အခြေအနေ) မှာ ထားခဲ့ပါတယ်။ `WITH NO DATA` ကို သတ်မှတ်ထားရင်တော့ — data အသစ် ဘာမှ ထုတ်လုပ်မှာ မဟုတ်ဘဲ — materialized view ကို unscannable အခြေအနေ (scan လုပ်လို့ မရတဲ့ အခြေအနေ) မှာ ထားခဲ့ပါတယ်။

`CONCURRENTLY` နဲ့ `WITH NO DATA` ကို အတူတူ သတ်မှတ်လို့ မရပါဘူး။

## Parameters (parameter များ)

- **CONCURRENTLY** — Materialized view ကို — materialized view ပေါ်မှာ တစ်ပြိုင်နက် (concurrently) လုပ်ဆောင်နေတဲ့ selects တွေကို lock ပိတ်မထားဘဲ — refresh လုပ်ပါတယ်။ ဒီ option မပါဘဲ ဆိုရင် — rows အများကြီးကို သက်ရောက်တဲ့ refresh တစ်ခုက — resources တွေ ပိုနည်းနည်းနဲ့ သုံးပြီး ပိုမြန်မြန် ပြီးဆုံးတတ်ပေမယ့် — materialized view ကနေ ဖတ်ရှုဖို့ ကြိုးစားနေတဲ့ တခြား connections တွေကိုတော့ ပိတ်ဆို့နိုင်ပါတယ်။ Rows အနည်းငယ်ကိုပဲ သက်ရောက်တဲ့ ကိစ္စတွေမှာတော့ — ဒီ option က ပိုမြန်ဆန်နိုင်ပါတယ်။

ဒီ option ကို — materialized view ပေါ်မှာ — column နာမည်တွေကိုပဲ သုံးပြီး — rows အားလုံးကို လွှမ်းခြုံတဲ့ — UNIQUE index အနည်းဆုံး တစ်ခု ရှိနေမှသာ ခွင့်ပြုပါတယ်; ဆိုလိုတာက — အဲဒါက expression index (expression ကို အခြေခံတဲ့ index) ဒါမှမဟုတ် WHERE clause ပါတဲ့ index ဖြစ်လို့ မရပါဘူး။

ဒီ option ကို — materialized view က data ဖြည့်ပြီးသား (populated) ဖြစ်နေမှသာ သုံးလို့ ရပါတယ်။

ဒီ option နဲ့ဆိုရင်တောင် — materialized view တစ်ခုတည်းပေါ်မှာ — တစ်ကြိမ်မှာ REFRESH တစ်ခုပဲ run လို့ ရပါတယ်။

- **name** — Refresh လုပ်ရမယ့် materialized view ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။

## Notes (မှတ်စုများ)

Materialized view ကို သတ်မှတ်တဲ့ (defining) query ထဲမှာ `ORDER BY` clause ပါနေရင် — materialized view ရဲ့ မူလ အကြောင်းအရာတွေက အဲဒီအတိုင်း စီထားခံရမှာ ဖြစ်ပါတယ်; ဒါပေမယ့် — `REFRESH MATERIALIZED VIEW` က အဲဒီ အစီအစဉ်ကို ထိန်းသိမ်းပေးမယ်လို့တော့ အာမခံချက် မရှိပါဘူး။

`REFRESH MATERIALIZED VIEW` run လုပ်နေတဲ့အချိန်အတွင်း — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။

## Examples (ဥပမာများ)

ဒီ command က `order_summary` လို့ ခေါ်တဲ့ materialized view ရဲ့ အကြောင်းအရာတွေကို — materialized view ရဲ့ definition ကနေ ရတဲ့ query ကို သုံးပြီး — အစားထိုးပြီး — scannable အခြေအနေမှာ ထားခဲ့ပါလိမ့်မယ်:

```sql
REFRESH MATERIALIZED VIEW order_summary;
```

ဒီ command က `annual_statistics_basis` materialized view နဲ့ ဆက်စပ်နေတဲ့ storage ကို လွတ်ကင်းစေပြီး — unscannable အခြေအနေမှာ ထားခဲ့ပါလိမ့်မယ်:

```sql
REFRESH MATERIALIZED VIEW annual_statistics_basis WITH NO DATA;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`REFRESH MATERIALIZED VIEW` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE MATERIALIZED VIEW](/docs/postgresql/sql-creatematerializedview), [ALTER MATERIALIZED VIEW](/docs/postgresql/sql-altermaterializedview), [DROP MATERIALIZED VIEW](/docs/postgresql/sql-dropmaterializedview)
