---
title: "CREATE FOREIGN DATA WRAPPER (foreign-data wrapper အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Foreign-data wrapper (ပြင်ပ data source တစ်ခုကို ဝင်ရောက်ရန် သုံးသော library) အသစ်တစ်ခုကို သတ်မှတ်ပေးသော command — HANDLER, VALIDATOR, OPTIONS clause များဖြင့် handler function, validator function နှင့် options များကို သတ်မှတ်နိုင်ပြီး — superusers များသာ ဖန်တီးနိုင်သော command"
order: 269
source: "https://www.postgresql.org/docs/current/sql-createforeigndatawrapper.html"
status: translated
updated: 2026-09-04
---

## CREATE FOREIGN DATA WRAPPER (foreign-data wrapper အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE FOREIGN DATA WRAPPER — foreign-data wrapper အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE FOREIGN DATA WRAPPER name
    [ HANDLER handler_function | NO HANDLER ]
    [ VALIDATOR validator_function | NO VALIDATOR ]
    [ OPTIONS ( option 'value' [, ... ] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE FOREIGN DATA WRAPPER` က foreign-data wrapper အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Foreign-data wrapper တစ်ခုကို သတ်မှတ်တဲ့ user က ၎င်းရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

Foreign-data wrapper ရဲ့ နာမည်က database အတွင်းမှာ unique (ထူးခြား) ဖြစ်ရပါမယ်။

Foreign-data wrappers တွေကို superusers တွေပဲ ဖန်တီးနိုင်ပါတယ်။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် foreign-data wrapper ရဲ့ နာမည်။
- **HANDLER handler_function** — handler_function က — foreign tables တွေအတွက် execution functions တွေကို ရယူဖို့ ခေါ်ယူမယ့် — အရင်က register လုပ်ထားပြီးသား function တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ Handler function က arguments တွေ ဘာမှ ယူလို့ မရဘဲ — ၎င်းရဲ့ return type က `fdw_handler` ဖြစ်ရပါမယ်။
Handler function မပါဘဲ foreign-data wrapper တစ်ခုကို ဖန်တီးဖို့ ဖြစ်နိုင်ပါတယ် — ဒါပေမယ့် — ဒီလို wrapper တစ်ခုကို သုံးထားတဲ့ foreign tables တွေကို — ကြေညာ (declare) လုပ်ရုံကလွဲလို့ — ဝင်ရောက် (access) လုပ်လို့ မရပါဘူး။
- **VALIDATOR validator_function** — validator_function က — foreign-data wrapper ကို ပေးထားတဲ့ generic options တွေကိုရော — ဒီ foreign-data wrapper ကို သုံးနေတဲ့ foreign servers, user mappings နဲ့ foreign tables တွေအတွက် options တွေကိုပါ — စစ်ဆေးဖို့ ခေါ်ယူမယ့် — အရင်က register လုပ်ထားပြီးသား function တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ Validator function သို့မဟုတ် `NO VALIDATOR` ကို သတ်မှတ်မထားဘူးဆိုရင် — options တွေကို ဖန်တီးချိန်မှာ စစ်ဆေးမှာ မဟုတ်ပါဘူး။ (Foreign-data wrappers တွေက — implementation ပေါ် မူတည်ပြီး — run time (လည်ပတ်ချိန်) မှာ မမှန်ကန်တဲ့ option specifications တွေကို လျစ်လျူရှုတာ သို့မဟုတ် ငြင်းပယ်တာ ဖြစ်နိုင်ပါတယ်။) Validator function က arguments နှစ်ခု ယူရပါမယ်: တစ်ခုက type `text[]` ဖြစ်ပြီး — system catalogs တွေထဲမှာ သိမ်းဆည်းထားသလို — options တွေရဲ့ array ပါဝင်မှာ ဖြစ်ကာ — နောက်တစ်ခုက type `oid` ဖြစ်ပြီး — options တွေ ပါဝင်တဲ့ system catalog ရဲ့ OID ဖြစ်ပါလိမ့်မယ်။ Return type ကိုတော့ လျစ်လျူရှုပါတယ်; function က မမှန်ကန်တဲ့ options တွေကို `ereport(ERROR)` function ကို သုံးပြီး အစီရင်ခံသင့်ပါတယ်။
- **OPTIONS ( option 'value' [, ... ] )** — ဒီ clause က foreign-data wrapper အသစ်အတွက် options တွေကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ option names နဲ့ values တွေက foreign data wrapper တစ်ခုချင်းစီနဲ့ သက်ဆိုင်ပြီး — foreign-data wrapper ရဲ့ validator function ကို သုံးပြီး စစ်ဆေးပါတယ်။ Option names တွေက unique ဖြစ်ရပါမယ်။

## Notes (မှတ်စုများ)

PostgreSQL ရဲ့ foreign-data လုပ်ဆောင်ချက် (functionality) က လောလောဆယ် တက်ကြွစွာ ဖွံ့ဖြိုးတိုးတက်နေဆဲ (under active development) အဆင့်မှာ ရှိပါသေးတယ်။ Queries တွေရဲ့ optimization ကလည်း အခြေခံအဆင့်ပဲ ရှိပါသေးတယ် (ပြီးတော့ — အများစုကို wrapper ဆီကိုပဲ အပ်ထားပါတယ်)။ ဒါကြောင့် — နောင်မှာ စွမ်းဆောင်ရည် (performance) ပိုမိုကောင်းမွန်အောင် တိုးတက်လုပ်ဆောင်ဖို့ နေရာ အတော်များများ ကျန်ရှိနေပါသေးတယ်။

## Examples (ဥပမာများ)

`dummy` ဆိုတဲ့ အသုံးမဝင်တဲ့ foreign-data wrapper တစ်ခု ဖန်တီးဖို့:

```sql
CREATE FOREIGN DATA WRAPPER dummy;
```

Handler function `file_fdw_handler` ပါတဲ့ `file` foreign-data wrapper တစ်ခု ဖန်တီးဖို့:

```sql
CREATE FOREIGN DATA WRAPPER file HANDLER file_fdw_handler;
```

Options တချို့ ပါဝင်တဲ့ `mywrapper` foreign-data wrapper တစ်ခု ဖန်တီးဖို့:

```sql
CREATE FOREIGN DATA WRAPPER mywrapper
    OPTIONS (debug 'true');
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE FOREIGN DATA WRAPPER` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ် — ခြွင်းချက်ကတော့ `HANDLER` နဲ့ `VALIDATOR` clauses တွေက extensions တွေ ဖြစ်ပြီး — standard ရဲ့ `LIBRARY` နဲ့ `LANGUAGE` clauses တွေကိုတော့ PostgreSQL မှာ implement (အကောင်အထည် ဖော်) မထားပါဘူး။

သို့ပေမယ့် — SQL/MED ရဲ့ လုပ်ဆောင်ချက်တစ်ခုလုံးကတော့ လောလောဆယ် conforming (လိုက်ဖက်ညီ) အခြေအနေ မရောက်သေးဘူးဆိုတာ သတိပြုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER FOREIGN DATA WRAPPER](/docs/postgresql/sql-alterforeigndatawrapper), [DROP FOREIGN DATA WRAPPER](/docs/postgresql/sql-dropforeigndatawrapper), [CREATE SERVER](/docs/postgresql/sql-createserver), [CREATE USER MAPPING](/docs/postgresql/sql-createusermapping), [CREATE FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-createforeigntable.html)
