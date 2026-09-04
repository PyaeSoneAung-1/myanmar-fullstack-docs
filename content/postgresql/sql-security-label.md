---
title: "SECURITY LABEL (လုံခြုံရေး label တစ်ခုကို သတ်မှတ်ခြင်း သို့မဟုတ် ပြောင်းလဲခြင်း)"
description: "Database object တစ်ခုပေါ်မှာ သက်ရောက်စေမည့် security label တစ်ခုကို သတ်မှတ်ခြင်း/ပြောင်းလဲခြင်း/ဖယ်ရှားခြင်း — label provider (ဥပမာ SELinux ကဲ့သို့ MAC စနစ်များ) များနှင့် object အမျိုးအစားအားလုံးအတွက် SECURITY LABEL syntax နှင့် parameter အသေးစိတ်များ"
order: 211
source: "https://www.postgresql.org/docs/current/sql-security-label.html"
status: translated
updated: 2026-09-04
---

## SECURITY LABEL (လုံခြုံရေး label တစ်ခုကို သတ်မှတ်ခြင်း သို့မဟုတ် ပြောင်းလဲခြင်း)

SECURITY LABEL — object တစ်ခုပေါ်မှာ သက်ရောက်စေတဲ့ security label တစ်ခုကို သတ်မှတ်ခြင်း သို့မဟုတ် ပြောင်းလဲခြင်း ဖြစ်ပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SECURITY LABEL [ FOR provider ] ON
{
  TABLE object_name |
  COLUMN table_name.column_name |
  AGGREGATE aggregate_name ( aggregate_signature ) |
  DATABASE object_name |
  DOMAIN object_name |
  EVENT TRIGGER object_name |
  FOREIGN TABLE object_name |
  FUNCTION function_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  LARGE OBJECT large_object_oid |
  MATERIALIZED VIEW object_name |
  [ PROCEDURAL ] LANGUAGE object_name |
  PROCEDURE procedure_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  PUBLICATION object_name |
  ROLE object_name |
  ROUTINE routine_name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] |
  SCHEMA object_name |
  SEQUENCE object_name |
  SUBSCRIPTION object_name |
  TABLESPACE object_name |
  TYPE object_name |
  VIEW object_name
} IS { string_literal | NULL }

where aggregate_signature is:

* |
[ argmode ] [ argname ] argtype [ , ... ] |
[ [ argmode ] [ argname ] argtype [ , ... ] ] ORDER BY [ argmode ] [ argname ] argtype [ , ... ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SECURITY LABEL` က database object တစ်ခုပေါ်မှာ security label တစ်ခုကို သက်ရောက်စေပါတယ်။ Label provider တစ်ခုစီအတွက် label တစ်ခုစီနှုန်းနဲ့ — ပေးထားတဲ့ database object တစ်ခုနဲ့ ဆက်စပ်လို့ ရတဲ့ security labels တွေက အရေအတွက် ကန့်သတ်ချက် မရှိ များပြားနိုင်ပါတယ်။ Label providers တွေက — `register_label_provider` function ကို သုံးပြီး သူတို့ကိုယ်သူတို့ register လုပ်တဲ့ — loadable modules (ဝင်ရောက် တင်သွင်းနိုင်သော module များ) ဖြစ်ပါတယ်။

> **သတိပြုရန်:** `register_label_provider` က SQL function တစ်ခု မဟုတ်ပါဘူး; backend ထဲကို load လုပ်ထားတဲ့ C code ကနေပဲ ခေါ်ဆိုလို့ ရပါတယ်။

Label provider ကပဲ — ပေးထားတဲ့ label တစ်ခု မှန်ကန်မှု ရှိ/မရှိ နဲ့ — အဲဒီ label ကို ပေးထားတဲ့ object တစ်ခုပေါ်မှာ သတ်မှတ်ဖို့ ခွင့်ပြုလား မပြုလားဆိုတာကို ဆုံးဖြတ်ပါတယ်။ ပေးထားတဲ့ label တစ်ခုရဲ့ အဓိပ္ပါယ်ကလည်း label provider ရဲ့ ဆုံးဖြတ်ချက်အတိုင်းပါပဲ။ PostgreSQL က — label provider တစ်ခုက security labels တွေကို ဘယ်လို အနက်ဖွင့်ရမယ် ဒါမှမဟုတ် မဖွင့်ရဘူးဆိုတဲ့ ကန့်သတ်ချက် တစ်စုံတစ်ရာ ချမှတ်မထားပါဘူး; သိမ်းဆည်းဖို့ ယန္တရား (mechanism) တစ်ခုကိုပဲ ပေးအပ်ထားတာပါ။ လက်တွေ့မှာ — ဒီ facility က SELinux လိုမျိုး — label အခြေခံတဲ့ mandatory access control (MAC) စနစ်တွေနဲ့ ပေါင်းစည်းမှု ရစေဖို့ ရည်ရွယ်ထားတာ ဖြစ်ပါတယ်။ အဲဒီလို စနစ်တွေက users နဲ့ groups တွေလို ရိုးရာ discretionary access control (DAC) concept တွေအပေါ် မူတည်မနေဘဲ — access control ဆုံးဖြတ်ချက်တွေ အားလုံးကို object labels တွေအပေါ် အခြေခံပြီး ချမှတ်ပါတယ်။

`SECURITY LABEL` ကို သုံးဖို့ဆိုရင် သင်ဟာ database object ရဲ့ owner ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **object_name**, **table_name.column_name**, **aggregate_name**, **function_name**, **procedure_name**, **routine_name** — Label သတ်မှတ်ရမယ့် object ရဲ့ နာမည် ဖြစ်ပါတယ်။ Schema တွေထဲမှာ နေထိုင်တဲ့ objects တွေရဲ့ (table တွေ၊ function တွေ စသဖြင့်) နာမည်တွေကို schema-qualified (schema နာမည်နဲ့ ရှေ့ဆက် သတ်မှတ်ထားသော) လုပ်နိုင်ပါတယ်။
- **provider** — ဒီ label နဲ့ ဆက်စပ် သတ်မှတ်ရမယ့် provider ရဲ့ နာမည် ဖြစ်ပါတယ်။ နာမည်ပေးထားတဲ့ provider က load လုပ်ထားရပါမယ် ပြီးတော့ — အဆိုပြုထားတဲ့ labeling လုပ်ဆောင်ချက်ကို သဘောတူညီမှု ပေးရပါမယ်။ Provider တစ်ခုတည်းပဲ load လုပ်ထားရင် — အတိုချုံးတဲ့ အနေနဲ့ provider နာမည်ကို ချန်လိုက်လို့ ရပါတယ်။
- **argmode** — Function တစ်ခု၊ procedure တစ်ခု ဒါမှမဟုတ် aggregate တစ်ခုရဲ့ argument တစ်ခုရဲ့ mode ဖြစ်ပါတယ်: IN, OUT, INOUT ဒါမှမဟုတ် VARIADIC။ ချန်လိုက်ရင် — မူရင်း default က IN ပါ။ SECURITY LABEL က OUT arguments တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ မည်သူမည်ဝါ ဖြစ်ကြောင်း (identity) ကို ဆုံးဖြတ်ဖို့ input arguments တွေပဲ လိုအပ်လို့ပါ။ ဒါကြောင့် IN, INOUT နဲ့ VARIADIC arguments တွေကိုပဲ စာရင်းပြုစုရင် လုံလောက်ပါတယ်။
- **argname** — Function တစ်ခု၊ procedure တစ်ခု ဒါမှမဟုတ် aggregate တစ်ခုရဲ့ argument တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ SECURITY LABEL က argument နာမည်တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — function ရဲ့ မည်သူမည်ဝါ ဖြစ်ကြောင်း ဆုံးဖြတ်ဖို့ argument ရဲ့ data types တွေပဲ လိုအပ်လို့ပါ။
- **argtype** — Function တစ်ခု၊ procedure တစ်ခု ဒါမှမဟုတ် aggregate တစ်ခုရဲ့ argument တစ်ခုရဲ့ data type ဖြစ်ပါတယ်။
- **large_object_oid** — Large object ရဲ့ OID ဖြစ်ပါတယ်။
- **PROCEDURAL** — ဒါက noise word (အဓိပ္ပါယ် မရှိဘဲ သဒ္ဒါအရ ထည့်ထားတဲ့ စကားလုံး) တစ်ခုပါ။
- **string_literal** — Security label ရဲ့ သတ်မှတ်ချက် အသစ် ဖြစ်ပြီး — string literal တစ်ခုအနေနဲ့ ရေးပါတယ်။
- **NULL** — Security label ကို ဖယ်ရှားဖို့ NULL လို့ ရေးပါ။

## Examples (ဥပမာများ)

အောက်က ဥပမာက table တစ်ခုရဲ့ security label ကို ဘယ်လို သတ်မှတ် ဒါမှမဟုတ် ပြောင်းလဲနိုင်တယ်ဆိုတာ ပြပါတယ်:

```sql
SECURITY LABEL FOR selinux ON TABLE mytable IS 'system_u:object_r:sepgsql_table_t:s0';
```

Label ကို ဖယ်ရှားဖို့:

```sql
SECURITY LABEL FOR selinux ON TABLE mytable IS NULL;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `SECURITY LABEL` command ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[sepgsql](https://www.postgresql.org/docs/current/sepgsql.html), `src/test/modules/dummy_seclabel`
