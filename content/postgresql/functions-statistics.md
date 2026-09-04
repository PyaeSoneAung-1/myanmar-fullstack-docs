---
title: "Statistics Information Functions (Statistics အချက်အလက် လုပ်ဆောင်ချက်များ)"
description: "PostgreSQL ၏ statistics information functions များ — CREATE STATISTICS command ဖြင့် သတ်မှတ်ထားသော complex statistics များကို စစ်ဆေးရန် pg_mcv_list_items function အကြောင်း"
order: 98
source: "https://www.postgresql.org/docs/current/functions-statistics.html"
status: translated
updated: 2026-09-04
---

## 9.31. Statistics Information Functions (Statistics အချက်အလက် လုပ်ဆောင်ချက်များ)

- **9.31.1. Inspecting MCV Lists (MCV list များကို စစ်ဆေးခြင်း)**

PostgreSQL က — `CREATE STATISTICS` command ကို သုံးပြီး သတ်မှတ်ထားတဲ့ complex statistics (ရှုပ်ထွေးသော စာရင်းအင်း အချက်အလက်များ) တွေကို စစ်ဆေးဖို့ function တစ်ခု ထောက်ပံ့ပေးပါတယ်။

### 9.31.1. Inspecting MCV Lists (MCV list များကို စစ်ဆေးခြင်း)

```sql
pg_mcv_list_items ( pg_mcv_list ) → setof record
```

`pg_mcv_list_items` က — multi-column MCV list တစ်ခုထဲမှာ သိမ်းဆည်းထားတဲ့ items (အရာများ) အားလုံးကို ဖော်ပြတဲ့ records အစု (set of records) တစ်ခုကို ပြန်ပေးပါတယ်။ အောက်ပါ columns တွေကို ပြန်ပေးပါတယ်:

| နာမည် | Type | ဖော်ပြချက် |
| --- | --- | --- |
| `index` | `integer` | MCV list ထဲမှာ item ၏ index (နေရာစဉ်) |
| `values` | `text[]` | MCV item ထဲမှာ သိမ်းဆည်းထားတဲ့ values (တန်ဖိုးများ) |
| `nulls` | `boolean[]` | `NULL` values (NULL တန်ဖိုးများ) တွေကို ခွဲခြားဖော်ပြတဲ့ flags (အလံများ) |
| `frequency` | `double precision` | ဒီ MCV item ၏ frequency (ကြိမ်နှုန်း) |
| `base_frequency` | `double precision` | ဒီ MCV item ၏ base frequency (အခြေခံ ကြိမ်နှုန်း) |

`pg_mcv_list_items` function ကို အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```sql
SELECT m.* FROM pg_statistic_ext join pg_statistic_ext_data on (oid = stxoid),
                pg_mcv_list_items(stxdmcv) m WHERE stxname = 'stts';
```

`pg_mcv_list` type ၏ values (တန်ဖိုးများ) တွေကို — `pg_statistic_ext_data`.`stxdmcv` column ကနေပဲ ရယူလို့ ရပါတယ်။
