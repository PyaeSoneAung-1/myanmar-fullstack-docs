---
title: "CREATE USER MAPPING (user mapping အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)"
description: "Foreign server တစ်ခုနှင့် user တစ်ဦးကို ချိတ်ဆက်ပေးသည့် user mapping အသစ်တစ်ခုကို သတ်မှတ်ခြင်း — IF NOT EXISTS clause ၊ user_name ၊ server_name ၊ OPTIONS clause တို့အကြောင်း — SQL/MED နှင့် ကိုက်ညီသော command"
order: 276
source: "https://www.postgresql.org/docs/current/sql-createusermapping.html"
status: translated
updated: 2026-09-04
---

## CREATE USER MAPPING (user mapping အသစ်တစ်ခုကို သတ်မှတ်ခြင်း)

CREATE USER MAPPING — user တစ်ဦးကို foreign server တစ်ခုနှင့် ချိတ်ဆက်ပေးမယ့် mapping အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE USER MAPPING [ IF NOT EXISTS ] FOR { user_name | USER | CURRENT_ROLE | CURRENT_USER | PUBLIC }
    SERVER server_name
    [ OPTIONS ( option 'value' [ , ... ] ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE USER MAPPING` က user တစ်ဦးကို foreign server တစ်ခုနှင့် ချိတ်ဆက်တဲ့ mapping တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ User mapping တစ်ခုက ပုံမှန်အားဖြင့် — foreign-data wrapper (ပြင်ပ data ဝင်ရောက်ရေး wrapper) က ပြင်ပ data resource (ဒေတာ အရင်းအမြစ်) တစ်ခုကို ဝင်ရောက်ဖို့ — foreign server တစ်ခုက ဖုံးအုပ်ထားတဲ့ အချက်အလက်တွေနဲ့အတူ — အသုံးပြုတဲ့ connection (ချိတ်ဆက်မှု) အချက်အလက်တွေကို စုစည်း သိမ်းဆည်းပေးပါတယ်။

Foreign server တစ်ခုရဲ့ ပိုင်ရှင်က — အဲဒီ server အတွက် user mapping တွေကို user တိုင်းအတွက် ဖန်တီးနိုင်ပါတယ်။ ဒါ့အပြင် — server ပေါ်မှာ `USAGE` privilege ကို ပေးအပ်ခံထားရတဲ့ user တစ်ဦးကလည်း — သူ့ကိုယ်ပိုင် user name အတွက် user mapping တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

## Parameters (parameter များ)

- **IF NOT EXISTS** — ပေးထားတဲ့ user နဲ့ ပေးထားတဲ့ foreign server အတွက် mapping တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။ ရှိပြီးသား user mapping က — ဖန်တီးလိုက်မယ့် mapping နဲ့ တစ်စုံတစ်ရာ ဆင်တူမယ်လို့တော့ အာမခံချက် မရှိဘူးဆိုတာ သတိပြုပါ။
- **user_name** — Foreign server နှင့် ချိတ်ဆက်ပေးမယ့် ရှိပြီးသား user တစ်ဦးရဲ့ နာမည် ဖြစ်ပါတယ်။ CURRENT_ROLE, CURRENT_USER နဲ့ USER တို့က လက်ရှိ user ရဲ့ နာမည်နဲ့ ကိုက်ညီပါတယ်။ PUBLIC ကို သတ်မှတ်လိုက်ရင် — user-specific (user အတိအကျ သတ်မှတ်ထားသော) mapping တစ်ခုကို အသုံးမပြုနိုင်တဲ့ အခြေအနေမျိုးမှာ သုံးစွဲတဲ့ — so-called public mapping (public mapping ဟု ခေါ်သော mapping) တစ်ခုကို ဖန်တီးပေးပါတယ်။
- **server_name** — User mapping ကို ဖန်တီးရမယ့် ရှိပြီးသား server တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **OPTIONS ( option 'value' [, ... ] )** — ဒီ clause က user mapping ရဲ့ options တွေကို သတ်မှတ်ပေးပါတယ်။ Options တွေက ပုံမှန်အားဖြင့် mapping ရဲ့ တကယ့် user name နဲ့ password ကို သတ်မှတ်ပေးပါတယ်။ Option နာမည်တွေက တစ်ခုနှင့်တစ်ခု မတူညီ (unique) ရပါမယ်။ ခွင့်ပြုထားတဲ့ option နာမည်တွေနဲ့ တန်ဖိုးတွေက server ရဲ့ foreign-data wrapper အပေါ် မူတည်ပြီး ကွဲပြားပါတယ်။

## Examples (ဥပမာများ)

User `bob` အတွက် — server `foo` ပေါ်မှာ — user mapping တစ်ခု ဖန်တီးရန်:

```sql
CREATE USER MAPPING FOR bob SERVER foo OPTIONS (user 'bob', password 'secret');
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE USER MAPPING` က ISO/IEC 9075-9 (SQL/MED) နဲ့ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER USER MAPPING](/docs/postgresql/sql-alterusermapping), [DROP USER MAPPING](/docs/postgresql/sql-dropusermapping), [CREATE FOREIGN DATA WRAPPER](/docs/postgresql/sql-createforeigndatawrapper), [CREATE SERVER](/docs/postgresql/sql-createserver)
