---
title: "ALTER PUBLICATION (publication တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "Publication (ထုတ်ဝေမှု) တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးသည့် command — ADD/SET/DROP clauses များဖြင့် publication ထဲက table နှင့် schema များကို ထည့်သွင်း/အစားထိုး/ဖယ်ရှားနိုင်ပြီး SET (publication_parameter) ဖြင့် publish options များကို ပြောင်းလဲနိုင်; OWNER TO ဖြင့် ပိုင်ရှင် လဲလှယ်ခြင်းနှင့် RENAME TO ဖြင့် နာမည်ပြောင်းခြင်းတို့ကိုလည်း ပြုလုပ်နိုင်"
order: 310
source: "https://www.postgresql.org/docs/current/sql-alterpublication.html"
status: translated
updated: 2026-09-04
---

## ALTER PUBLICATION (publication တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER PUBLICATION — publication (ထုတ်ဝေမှု) တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER PUBLICATION name ADD publication_object [, ...]
ALTER PUBLICATION name SET publication_object [, ...]
ALTER PUBLICATION name DROP publication_drop_object [, ...]
ALTER PUBLICATION name SET ( publication_parameter [= value] [, ... ] )
ALTER PUBLICATION name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER PUBLICATION name RENAME TO new_name

where publication_object is one of:

    TABLE table_and_columns [, ... ]
    TABLES IN SCHEMA { schema_name | CURRENT_SCHEMA } [, ... ]

and publication_drop_object is one of:

    TABLE [ ONLY ] table_name [ * ] [, ... ]
    TABLES IN SCHEMA { schema_name | CURRENT_SCHEMA } [, ... ]

and table_and_columns is:

    [ ONLY ] table_name [ * ] [ ( column_name [, ... ] ) ] [ WHERE ( expression ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER PUBLICATION` command က — publication တစ်ခုရဲ့ attributes (ဂုဏ်ရည်များ) တွေကို ပြောင်းလဲနိုင်ပါတယ်။

ပထမ variants သုံးခုက — ဘယ် tables/schemas တွေ publication ရဲ့ အစိတ်အပိုင်း ဖြစ်မလဲဆိုတာကို ပြောင်းလဲပါတယ်။ `SET` clause က — publication ထဲက tables/schemas စာရင်းကို — သတ်မှတ်လိုက်တဲ့ စာရင်းနဲ့ အစားထိုးပါတယ်; publication ထဲမှာ ရှိပြီးသား tables/schemas တွေကို ဖယ်ရှားခံရပါလိမ့်မယ်။ `ADD` နဲ့ `DROP` clauses တွေက — publication ထဲကို tables/schemas တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို ထပ်ပေါင်းခြင်း သို့မဟုတ် ဖယ်ရှားခြင်း ပြုလုပ်ပါတယ်။ Subscription လုပ်ပြီးသား publication တစ်ခုထဲကို tables/schemas တွေ ထပ်ပေါင်းတာက — အကျိုးသက်ရောက်မှု ရှိဖို့အတွက် — subscribing (စာရင်းသွင်းနေတဲ့) ဘက်ခြမ်းမှာ [`ALTER SUBSCRIPTION ... REFRESH PUBLICATION`](/docs/postgresql/sql-altersubscription) action တစ်ခု လိုအပ်ပါလိမ့်မယ်ဆိုတာ သတိပြုပါ။ ထို့အပြင် — `DROP TABLES IN SCHEMA` က — [`FOR TABLE`](/docs/postgresql/sql-createpublication)/ `ADD TABLE` ကို သုံးပြီး သတ်မှတ်ထားခဲ့တဲ့ schema tables တွေကို drop လုပ်မှာ မဟုတ်ဘူးဆိုတာလည်း သတိပြုပါ။

Synopsis မှာ ဖော်ပြထားတဲ့ ဒီ command ရဲ့ စတုတ္ထ variant က — [CREATE PUBLICATION](/docs/postgresql/sql-createpublication) မှာ သတ်မှတ်နိုင်တဲ့ publication properties တွေ အားလုံးကို ပြောင်းလဲနိုင်ပါတယ်။ Command ထဲမှာ ဖော်ပြမထားတဲ့ properties တွေကတော့ — သူတို့ရဲ့ ယခင် settings တွေကို ထိန်းသိမ်းထားပါတယ်။

ကျန်တဲ့ variants တွေက — publication ရဲ့ owner (ပိုင်ရှင်) နဲ့ နာမည်ကို ပြောင်းလဲပါတယ်။

`ALTER PUBLICATION` ကို သုံးဖို့ — သင်ဟာ publication ကို ပိုင်ဆိုင်ရပါမယ်။ Publication ထဲကို table တစ်ခု ထပ်ပေါင်းတာက — အဲဒီ table ကိုပါ ပိုင်ဆိုင်ဖို့ ထပ်ဆောင်း လိုအပ်ပါတယ်။ Publication တစ်ခုထဲကို `ADD TABLES IN SCHEMA` နဲ့ `SET TABLES IN SCHEMA` လုပ်တာက — command ကို run လုပ်တဲ့ user က superuser ဖြစ်ဖို့ လိုအပ်ပါတယ်။ Owner ကို ပြောင်းလဲဖို့ — သင်ဟာ owner အသစ် ဖြစ်လာမယ့် role ဆီ `SET ROLE` လုပ်နိုင်ရပါမယ် — ပြီးတော့ အဲဒီ role က database ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ ထို့အပြင် — [`FOR ALL TABLES`](/docs/postgresql/sql-createpublication) သို့မဟုတ် [`FOR TABLES IN SCHEMA`](/docs/postgresql/sql-createpublication) publication တစ်ခုရဲ့ owner အသစ်က superuser ဖြစ်ရပါမယ်။ ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ — ဒီ ကန့်သတ်ချက်တွေ မသက်ဆိုင်ဘဲ — publication တစ်ခုရဲ့ ownership ကို ပြောင်းလဲနိုင်ပါတယ်။

Publication က column list တစ်ခုပါတဲ့ table တစ်ခုကိုပါ publish လုပ်နေချိန်မှာ schema တစ်ခုခုကို ထပ်ပေါင်းခြင်း/သတ်မှတ်ခြင်း — နဲ့ — အပြန်အလှန် အနေနဲ့လည်း — ထောက်ပံ့မထားပါဘူး။

## Parameters (parameter များ)

- **name** — သတ်မှတ်ချက်ကို ပြောင်းလဲရမယ့် တည်ရှိပြီးသား publication တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **table_name** — တည်ရှိပြီးသား table တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ Table နာမည် ရှေ့မှာ ONLY ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုတည်းကိုပဲ သက်ရောက်ပါတယ်။ ONLY ကို မသတ်မှတ်ထားရင် — table ရော ၎င်းရဲ့ descendant tables (ဆင်းသက်လာသော tables) အားလုံးပါ (ရှိရင်) သက်ရောက်ပါတယ်။ Optional အနေနဲ့ — table နာမည် နောက်မှာ * ကို သတ်မှတ်ပြီး — descendant tables တွေ ပါဝင်တယ်ဆိုတာကို ရှင်းလင်းစွာ ညွှန်ပြနိုင်ပါတယ်။
Optional အနေနဲ့ — column list တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် CREATE PUBLICATION ကို ကြည့်ပါ။ Table တစ်ခုတည်းကို — column list မတူညီတာတွေနဲ့ publish လုပ်ထားတဲ့ — publication အများအပြား ပါဝင်တဲ့ subscription တစ်ခုကိုတော့ ထောက်ပံ့မထားဘူးဆိုတာ သတိပြုပါ။ Column lists တွေကို ပြောင်းလဲရာမှာ ဖြစ်နိုင်ခြေ ရှိတဲ့ ပြဿနာများရဲ့ အသေးစိတ်အတွက် — Warning: Combining Column Lists from Multiple Publications (သတိပေးချက် — Publication အများအပြားမှ Column Lists များ ပေါင်းစပ်ခြင်း) ကို ကြည့်ပါ။
Optional ဖြစ်တဲ့ WHERE clause ကို သတ်မှတ်ထားရင် — expression က false သို့မဟုတ် null လို့ အကဲဖြတ်တဲ့ rows တွေကို publish လုပ်မှာ မဟုတ်ပါဘူး။ Expression ပတ်လည်မှာ parentheses တွေ လိုအပ်တာ သတိပြုပါ။ Expression ကို — replication connection အတွက် သုံးတဲ့ role နဲ့ အကဲဖြတ်ပါတယ်။
- **schema_name** — တည်ရှိပြီးသား schema တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **SET ( publication_parameter [= value] [, ... ] )** — ဒီ clause က — `CREATE PUBLICATION` က မူလ သတ်မှတ်ခဲ့တဲ့ publication parameters တွေကို ပြောင်းလဲပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် အဲဒီနေရာမှာ ကြည့်ပါ။

> **သတိပြုရန်:** publish_via_partition_root parameter ကို ပြောင်းလဲတာက — publish လုပ်ထားတဲ့ tables တွေရဲ့ identity နဲ့ schema ကို ပြောင်းလဲစေတာကြောင့် — subscriber မှာ data ဆုံးရှုံးမှု သို့မဟုတ် ပုံတူပွားမှု (duplication) ဖြစ်စေနိုင်ပါတယ်။ ဒါက — partition root table တစ်ခုကို replication target အဖြစ် သတ်မှတ်ထားတဲ့အခါမှပဲ ဖြစ်တယ်ဆိုတာ သတိပြုပါ။
> 
> ဒီ ပြဿနာကို — `ALTER PUBLICATION ... SET` ပြီးနောက်မှာ `ALTER SUBSCRIPTION ... REFRESH PUBLICATION` ကို execute မလုပ်မချင်း — partition leaf tables တွေကို ပြုပြင်မွမ်းမံတာကို ရှောင်ကြဉ်ခြင်းနဲ့ — copy_data = off option ကိုပဲ သုံးပြီး refresh လုပ်ခြင်းအားဖြင့် — ရှောင်ရှားနိုင်ပါတယ်။

- **new_owner** — Publication ရဲ့ owner အသစ် ဖြစ်လာမယ့် user ရဲ့ နာမည် ဖြစ်ပါတယ်။
- **new_name** — Publication အတွက် နာမည်အသစ် ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

Publication ကို deletes နဲ့ updates တွေကိုပဲ publish လုပ်မယ့်ပုံ ပြောင်းလဲဖို့:

```sql
ALTER PUBLICATION noinsert SET (publish = 'update, delete');
```

Publication ထဲကို tables တချို့ ထပ်ပေါင်းဖို့:

```sql
ALTER PUBLICATION mypublication ADD TABLE users (user_id, firstname), departments;
```

Table တစ်ခုအတွက် publish လုပ်တဲ့ columns အစုကို ပြောင်းလဲဖို့:

```sql
ALTER PUBLICATION mypublication SET TABLE users (user_id, firstname, lastname), TABLE departments;
```

`sales_publication` publication ထဲကို `marketing` နဲ့ `sales` schemas တွေ ထပ်ပေါင်းဖို့:

```sql
ALTER PUBLICATION sales_publication ADD TABLES IN SCHEMA marketing, sales;
```

`production_publication` publication ထဲကို `users`, `departments` tables တွေနဲ့ `production` schema ကို ထပ်ပေါင်းဖို့:

```sql
ALTER PUBLICATION production_publication ADD TABLE users, departments, TABLES IN SCHEMA production;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER PUBLICATION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE PUBLICATION](/docs/postgresql/sql-createpublication), [DROP PUBLICATION](/docs/postgresql/sql-droppublication), [CREATE SUBSCRIPTION](/docs/postgresql/sql-createsubscription), [ALTER SUBSCRIPTION](/docs/postgresql/sql-altersubscription)
