---
title: "CREATE SCHEMA (schema အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Schema အသစ်တစ်ခုကို လက်ရှိ database ထဲ ဖန်တီးခြင်း — AUTHORIZATION နှင့် IF NOT EXISTS option များ၊ schema အတွင်း object များ ဖန်တီးရန် subcommands များ"
order: 143
source: "https://www.postgresql.org/docs/current/sql-createschema.html"
status: translated
updated: 2026-09-04
---

## CREATE SCHEMA (schema အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE SCHEMA — schema အသစ်တစ်ခုကို ဖန်တီးပေးတဲ့ command

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE SCHEMA schema_name [ AUTHORIZATION role_specification ] [ schema_element [ ... ] ]
CREATE SCHEMA AUTHORIZATION role_specification [ schema_element [ ... ] ]
CREATE SCHEMA IF NOT EXISTS schema_name [ AUTHORIZATION role_specification ]
CREATE SCHEMA IF NOT EXISTS AUTHORIZATION role_specification

where role_specification can be:

    user_name
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE SCHEMA` က လက်ရှိ database ထဲကို schema အသစ်တစ်ခု ထည့်သွင်းပေးပါတယ်။ Schema ရဲ့ နာမည်က — လက်ရှိ database ထဲမှာ ရှိပြီးသား schema တွေရဲ့ နာမည်တွေနဲ့ မတူညီရပါဘူး (distinct ဖြစ်ရပါမယ်)။

Schema တစ်ခုက အနှစ်သာရအားဖြင့် namespace တစ်ခုပါ: ၎င်းမှာ နာမည်တပ်ထားတဲ့ object တွေ (table တွေ၊ data type တွေ၊ function တွေနဲ့ operator တွေ) ပါဝင်ပြီး — အဲဒီ object တွေရဲ့ နာမည်တွေက တခြား schema တွေထဲမှာ ရှိတဲ့ object တွေရဲ့ နာမည်တွေနဲ့ ထပ်တူကျနေလို့ ရပါတယ်။ နာမည်တပ်ထားတဲ့ object တွေကို access လုပ်ဖို့ဆိုရင် — သူတို့ရဲ့ နာမည်တွေကို schema နာမည်နဲ့ ရှေ့ဆက်ပြီး qualify လုပ်တာ ဒါမှမဟုတ် လိုချင်တဲ့ schema(s) တွေ ပါဝင်တဲ့ search path တစ်ခု သတ်မှတ်တာ — ဒီနည်းနှစ်မျိုးထဲက တစ်မျိုးမျိုးနဲ့ ရည်ညွှန်းပါတယ်။ Schema နာမည်နဲ့ qualify မလုပ်ထားတဲ့ (unqualified) object နာမည်တစ်ခုကို သတ်မှတ်ထားတဲ့ `CREATE` command တစ်ခုက — အဲဒီ object ကို လက်ရှိ schema ထဲမှာ ဖန်တီးပေးပါတယ် (လက်ရှိ schema ဆိုတာ search path ရဲ့ ရှေ့ဆုံးမှာ ရှိတဲ့ တစ်ခုဖြစ်ပြီး — `current_schema` function နဲ့ ဆုံးဖြတ်နိုင်ပါတယ်)။

ရွေးချယ်စရာအနေနဲ့ — `CREATE SCHEMA` မှာ schema အသစ်အတွင်းမှာ object တွေ ဖန်တီးဖို့ subcommand တွေ ထည့်သွင်းနိုင်ပါတယ်။ Subcommand တွေကို — schema ဖန်တီးပြီးမှ သီးခြား command တွေအနေနဲ့ ထုတ်ပေးတာနဲ့ အနှစ်သာရအားဖြင့် အတူတူပဲ သဘောထားပါတယ် — `AUTHORIZATION` clause ကို သုံးထားရင်တော့ ဖန်တီးလိုက်တဲ့ object တွေ အားလုံးက အဲဒီ user ရဲ့ ပိုင်ဆိုင်မှု ဖြစ်သွားတာပဲ ကွာပါတယ်။

## Parameters (parameter များ)

- **schema_name** — ဖန်တီးရမယ့် schema ရဲ့ နာမည် ဖြစ်ပါတယ်။ ဒါကို ချန်လိုက်ရင် — user_name ကို schema နာမည်အဖြစ် သုံးပါတယ်။ ဒီလို နာမည်တွေက system schema တွေအတွက် သီးသန့် ထားလို့ — နာမည်က pg_ နဲ့ စလို့ မရပါဘူး။
- **user_name** — schema အသစ်ကို ပိုင်ဆိုင်မယ့် user ရဲ့ role name ဖြစ်ပါတယ်။ ချန်လိုက်ရင် — command ကို execute လုပ်နေတဲ့ user ကို မူရင်း (default) အဖြစ် သုံးပါတယ်။ တခြား role တစ်ခု ပိုင်ဆိုင်တဲ့ schema တစ်ခုကို ဖန်တီးဖို့ဆိုရင် — အဲဒီ role ဆီ SET ROLE လုပ်နိုင်စွမ်း ရှိရပါမယ်။
- **schema_element** — schema အတွင်းမှာ ဖန်တီးရမယ့် object တစ်ခုကို သတ်မှတ်ပေးတဲ့ SQL statement တစ်ခု ဖြစ်ပါတယ်။ လောလောဆယ် — CREATE TABLE, CREATE VIEW, CREATE INDEX, CREATE SEQUENCE, CREATE TRIGGER နဲ့ GRANT တွေကိုပဲ CREATE SCHEMA အတွင်းမှာ clause တွေအဖြစ် လက်ခံပါတယ်။ တခြား object အမျိုးအစားတွေကိုတော့ schema ဖန်တီးပြီးနောက် သီးခြား command တွေနဲ့ ဖန်တီးနိုင်ပါတယ်။
- **IF NOT EXISTS** — နာမည်တူတဲ့ schema တစ်ခု ရှိပြီးသားဆိုရင် — (notice တစ်ခု ထုတ်ပေးတာကလွဲပြီး) ဘာမှ မလုပ်ပါဘူး။ ဒီ option ကို သုံးတဲ့အခါ — schema_element subcommand တွေ ထည့်သွင်းလို့ မရပါဘူး။

## Notes (မှတ်စုများ)

Schema တစ်ခု ဖန်တီးဖို့အတွက် — command ကို ခေါ်ယူ သုံးစွဲတဲ့ user က လက်ရှိ database အတွက် `CREATE` privilege ရှိရပါမယ်။ (superuser တွေကတော့ ဒီစစ်ဆေးမှုကို ကျော်လွှားနိုင်တာ သေချာပါတယ်။)

## Examples (ဥပမာများ)

Schema တစ်ခု ဖန်တီးတာက:

```sql
CREATE SCHEMA myschema;
```

User `joe` အတွက် schema တစ်ခု ဖန်တီးတာက — အဲဒီ schema ကိုလည်း `joe` လို့ပဲ နာမည်ပေးပါလိမ့်မယ်:

```sql
CREATE SCHEMA AUTHORIZATION joe;
```

`test` ဆိုတဲ့ နာမည်နဲ့ schema တစ်ခု ဖန်တီးတာက — user `joe` က ပိုင်ဆိုင်ပါလိမ့်မယ် — `test` ဆိုတဲ့ နာမည်နဲ့ schema တစ်ခု ရှိပြီးသား မဟုတ်ဘူးဆိုရင်ပေါ့။ (`joe` က အရင်ရှိပြီးသား schema ကို ပိုင်ဆိုင်လား ဆိုတာက အရေးမကြီးပါဘူး။)

```sql
CREATE SCHEMA IF NOT EXISTS test AUTHORIZATION joe;
```

Schema တစ်ခု ဖန်တီးပြီး ၎င်းအတွင်းမှာ table နဲ့ view တစ်ခု ဖန်တီးတာက:

```sql
CREATE SCHEMA hollywood
    CREATE TABLE films (title text, release date, awards text[])
    CREATE VIEW winners AS
        SELECT title, release FROM films WHERE awards IS NOT NULL;
```

ဒီမှာ သတိပြုရမှာက — subcommand တစ်ခုချင်းစီက semicolon (;) နဲ့ မဆုံးပါဘူး။

အောက်ပါကတော့ — အလားတူ ရလဒ်ကို ရရှိဖို့ ညီမျှတဲ့ နည်းလမ်းတစ်ခုပါ:

```sql
CREATE SCHEMA hollywood;
CREATE TABLE hollywood.films (title text, release date, awards text[]);
CREATE VIEW hollywood.winners AS
    SELECT title, release FROM hollywood.films WHERE awards IS NOT NULL;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က `CREATE SCHEMA` ထဲမှာ `DEFAULT CHARACTER SET` clause တစ်ခုကို ခွင့်ပြုပြီး — PostgreSQL က လောလောဆယ် လက်ခံထားတာထက် ပိုများတဲ့ subcommand အမျိုးအစားတွေကိုလည်း ခွင့်ပြုပါတယ်။

SQL standard က `CREATE SCHEMA` ထဲက subcommand တွေ ဘယ်လို အစီအစဉ်နဲ့မဆို ပေါ်လာနိုင်တယ်လို့ သတ်မှတ်ပါတယ်။ လက်ရှိ PostgreSQL implementation ကတော့ — subcommand တွေထဲမှာ forward reference (ရှေ့မှာ ရည်ညွှန်းချက်) တွေရဲ့ ကိစ္စ အားလုံးကို မကိုင်တွယ်နိုင်ပါဘူး; forward reference တွေ မဖြစ်အောင် — subcommand တွေရဲ့ အစီအစဉ်ကို တစ်ခါတစ်ရံ ပြန်စီပေးဖို့ လိုနိုင်ပါတယ်။

SQL standard အရ — schema တစ်ခုရဲ့ ပိုင်ရှင်က ၎င်းအတွင်းမှာ ရှိတဲ့ object တွေ အားလုံးကိုလည်း အမြဲ ပိုင်ဆိုင်ပါတယ်။ PostgreSQL ကတော့ — schema ထဲမှာ schema ပိုင်ရှင် မဟုတ်တဲ့ တခြား user တွေ ပိုင်ဆိုင်တဲ့ object တွေ ပါဝင်ခွင့်ပြုပါတယ်။ ဒါက — schema ပိုင်ရှင်က သူ့ရဲ့ schema ပေါ်က `CREATE` privilege ကို တခြားတစ်ယောက်ယောက်ကို ပေးတာ ဒါမှမဟုတ် superuser တစ်ယောက်က ၎င်းထဲမှာ object တွေ ဖန်တီးဖို့ ရွေးချယ်တာ — ဒီလို အခြေအနေမျိုးမှာပဲ ဖြစ်နိုင်ပါတယ်။

`IF NOT EXISTS` option က PostgreSQL extension (PostgreSQL မှာပဲ ပါတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER SCHEMA](https://www.postgresql.org/docs/current/sql-alterschema.html), [DROP SCHEMA](/docs/postgresql/sql-dropschema)
