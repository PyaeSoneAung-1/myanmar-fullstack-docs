---
title: "CREATE SERVER (foreign server အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Foreign server အသစ်တစ်ခုကို သတ်မှတ်ပေးသော command — foreign-data wrapper တစ်ခုက ပြင်ပ data resource တစ်ခုကို ဝင်ရောက်ရန် သုံးသော connection အချက်အလက်များကို ဖုံးအုပ်ထားပြီး — IF NOT EXISTS, TYPE, VERSION, OPTIONS clause များဖြင့် သတ်မှတ်နိုင်သော command"
order: 273
source: "https://www.postgresql.org/docs/current/sql-createserver.html"
status: translated
updated: 2026-09-04
---

## CREATE SERVER (foreign server အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE SERVER — foreign server အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE SERVER [ IF NOT EXISTS ] server_name [ TYPE 'server_type' ] [ VERSION 'server_version' ]
    FOREIGN DATA WRAPPER fdw_name
    [ OPTIONS ( option 'value' [, ... ] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE SERVER` က foreign server အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်။ Server တစ်ခုကို သတ်မှတ်တဲ့ user က ၎င်းရဲ့ owner (ပိုင်ရှင်) ဖြစ်လာပါတယ်။

Foreign server တစ်ခုက ပုံမှန်အားဖြင့် — foreign-data wrapper တစ်ခုက ပြင်ပ data resource တစ်ခုကို ဝင်ရောက်ဖို့ သုံးတဲ့ — connection အချက်အလက်တွေကို ဖုံးအုပ် (encapsulate) ထားပါတယ်။ User တစ်ဦးချင်းစီနဲ့ သက်ဆိုင်တဲ့ နောက်ထပ် connection အချက်အလက်တွေကိုတော့ user mappings တွေကနေတစ်ဆင့် သတ်မှတ်နိုင်ပါတယ်။

Server ရဲ့ နာမည်က database အတွင်းမှာ unique (ထူးခြား) ဖြစ်ရပါမယ်။

Server တစ်ခု ဖန်တီးဖို့ဆိုရင် — သုံးစွဲနေတဲ့ foreign-data wrapper ပေါ်မှာ `USAGE` privilege ရှိဖို့ လိုအပ်ပါတယ်။

## Parameters (parameter များ)

- **IF NOT EXISTS** — နာမည် တူညီတဲ့ server တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ပစ်ချခြင်း မပြုပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။ ရှိပြီးသား server က — ဖန်တီးမယ့် server နဲ့ တစ်စုံတစ်ရာ ဆင်တူမယ်ဆိုတဲ့ အာမခံချက် (guarantee) မရှိဘူးဆိုတာ သတိပြုပါ။
- **server_name** — ဖန်တီးရမယ့် foreign server ရဲ့ နာမည်။
- **server_type** — Optional ဖြစ်တဲ့ server type — foreign-data wrappers တွေအတွက် အသုံးဝင်နိုင်ပါတယ်။
- **server_version** — Optional ဖြစ်တဲ့ server version — foreign-data wrappers တွေအတွက် အသုံးဝင်နိုင်ပါတယ်။
- **fdw_name** — Server ကို စီမံခန့်ခွဲတဲ့ (manage) foreign-data wrapper ရဲ့ နာမည်။
- **OPTIONS ( option 'value' [, ... ] )** — ဒီ clause က server အတွက် options တွေကို သတ်မှတ်ပေးပါတယ်။ Options တွေက ပုံမှန်အားဖြင့် server ရဲ့ connection အသေးစိတ် အချက်အလက်တွေကို သတ်မှတ်ပေမယ့် — တကယ့် names နဲ့ values တွေကတော့ server ရဲ့ foreign-data wrapper အပေါ်မှာ မှီခိုပါတယ်။

## Notes (မှတ်စုများ)

[dblink](https://www.postgresql.org/docs/current/dblink.html) module ကို သုံးတဲ့အခါ — foreign server တစ်ခုရဲ့ နာမည်ကို — connection parameters တွေကို ညွှန်ပြဖို့ — [dblink_connect](https://www.postgresql.org/docs/current/contrib-dblink-connect.html) function ရဲ့ argument တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။ ဒီနည်းနဲ့ သုံးနိုင်ဖို့ဆိုရင် — foreign server ပေါ်မှာ `USAGE` privilege ရှိဖို့ လိုအပ်ပါတယ်။

Foreign server က sort pushdown (စီစဉ်မှု အောက်သို့ တွန်းချခြင်း) ကို ထောက်ပံ့တယ်ဆိုရင် — ၎င်းမှာ local server နဲ့ အတူတူ ဖြစ်တဲ့ sort ordering (စီစဉ်မှု အစီအစဉ်) ရှိဖို့ လိုအပ်ပါတယ်။

## Examples (ဥပမာများ)

`postgres_fdw` foreign-data wrapper ကို သုံးတဲ့ `myserver` server တစ်ခု ဖန်တီးဖို့:

```sql
CREATE SERVER myserver FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'foo', dbname 'foodb', port '5432');
```

အသေးစိတ် အချက်အလက်တွေအတွက် [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE SERVER` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER SERVER](/docs/postgresql/sql-alterserver), [DROP SERVER](/docs/postgresql/sql-dropserver), [CREATE FOREIGN DATA WRAPPER](/docs/postgresql/sql-createforeigndatawrapper), [CREATE FOREIGN TABLE](https://www.postgresql.org/docs/current/sql-createforeigntable.html), [CREATE USER MAPPING](/docs/postgresql/sql-createusermapping)
