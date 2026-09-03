---
title: "Configuration Example (configuration ဥပမာ)"
description: "ကိုယ်ပိုင် text search configuration ဖန်တီးခြင်း ဥပမာ — built-in english configuration ကို ကူးယူပြီး synonym/Ispell dictionary များနှင့် mapping သတ်မှတ်ပုံ"
order: 92
source: "https://www.postgresql.org/docs/current/textsearch-configuration.html"
status: translated
updated: 2026-09-03
---

## 12.7. Configuration Example (configuration ဥပမာ)

Text search configuration တစ်ခုက — document (စာတမ်း) တစ်ခုကို `tsvector` အဖြစ် ပြောင်းလဲဖို့ လိုအပ်တဲ့ option အားလုံးကို သတ်မှတ်ပေးပါတယ်: text ကို tokens (စာသား အပိုင်းအစများ) အဖြစ် ခွဲဖို့ သုံးရမယ့် parser နဲ့ — token တစ်ခုချင်းစီကို lexeme (စကားလုံး ပုံစံကွဲများ ပေါင်းစုထားသော ယူနစ်) အဖြစ် ပြောင်းလဲဖို့ သုံးရမယ့် dictionaries (အဘိဓာန်များ) တို့ ဖြစ်ပါတယ်။ `to_tsvector` ဒါမှမဟုတ် `to_tsquery` ကို ခေါ်တိုင်း — ကိုယ့်ရဲ့ လုပ်ဆောင်မှုတွေ ဆောင်ရွက်ဖို့ text search configuration တစ်ခု လိုအပ်ပါတယ်။ Configuration parameter [default_text_search_config](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TEXT-SEARCH-CONFIG) က default configuration ရဲ့ နာမည်ကို သတ်မှတ်ပေးပါတယ် — text search function တွေကို explicit configuration parameter (ရှင်းလင်းစွာ သတ်မှတ်ထားသော configuration parameter) မပါဘဲ ခေါ်တဲ့အခါ သုံးမယ့်ဟာက ဒီ default configuration ပဲ ဖြစ်ပါတယ်။ ဒါကို `postgresql.conf` ထဲမှာ သတ်မှတ်လို့ရသလို — `SET` command ကို သုံးပြီး session တစ်ခုချင်းစီအတွက်လည်း သတ်မှတ်လို့ရပါတယ်။

ကြိုတင် သတ်မှတ်ထားတဲ့ (predefined) text search configuration အများအပြား ရနိုင်ပြီး — ကိုယ်ပိုင် custom configuration တွေကိုလည်း လွယ်ကူစွာ ဖန်တီးနိုင်ပါတယ်။ Text search object တွေကို စီမံခန့်ခွဲရတာ အဆင်ပြေစေဖို့ — SQL command အစုတစ်စု ရနိုင်ပြီး — text search object တွေအကြောင်း အချက်အလက်တွေ ပြသပေးတဲ့ psql command တချို့လည်း ရှိပါတယ် ([အပိုင်း 12.10](/docs/postgresql/textsearch-psql))။

ဥပမာအနေနဲ့ — built-in `english` configuration ကို ကူးယူ (duplicate) ပြုလုပ်ရာကနေ စတင်ပြီး `pg` ဆိုတဲ့ configuration တစ်ခုကို ဖန်တီးကြည့်ပါမယ်:

```sql
CREATE TEXT SEARCH CONFIGURATION public.pg ( COPY = pg_catalog.english );
```

PostgreSQL အတွက် သီးသန့် (PostgreSQL-specific) synonym စာရင်းတစ်ခုကို သုံးပြီး `$SHAREDIR/tsearch_data/pg_dict.syn` မှာ သိမ်းပါမယ်။ File ရဲ့ အကြောင်းအရာက ဒီလိုပုံ ရှိပါတယ်:

```sql
postgres    pg
pgsql       pg
postgresql  pg
```

Synonym dictionary ကို ဒီလို သတ်မှတ်ပါတယ်:

```sql
CREATE TEXT SEARCH DICTIONARY pg_dict (
    TEMPLATE = synonym,
    SYNONYMS = pg_dict
);
```

နောက်တစ်ဆင့်မှာ — ကိုယ်ပိုင် configuration file တွေ ရှိတဲ့ Ispell dictionary `english_ispell` ကို register (မှတ်ပုံတင်) လုပ်ပါတယ်:

```sql
CREATE TEXT SEARCH DICTIONARY english_ispell (
    TEMPLATE = ispell,
    DictFile = english,
    AffFile = english,
    StopWords = english
);
```

အခု `pg` configuration ထဲမှာ စကားလုံးတွေအတွက် mappings (ပုံဖော် သတ်မှတ်ချက်များ) တွေကို စနစ်တကျ သတ်မှတ်လို့ရပါပြီ:

```sql
ALTER TEXT SEARCH CONFIGURATION pg
    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart,
                      word, hword, hword_part
    WITH pg_dict, english_ispell, english_stem;
```

Built-in configuration က ကိုင်တွယ်ပေးနိုင်တဲ့ token type တချို့အတွက် — index လုပ်ခြင်းနဲ့ ရှာဖွေခြင်း မပြုလုပ်ဖို့ ရွေးချယ်ပါတယ်:

```sql
ALTER TEXT SEARCH CONFIGURATION pg
    DROP MAPPING FOR email, url, url_path, sfloat, float;
```

အခု ကိုယ့် configuration ကို စမ်းသပ်ကြည့်လို့ ရပါပြီ:

```sql
SELECT * FROM ts_debug('public.pg', '
PostgreSQL, the highly scalable, SQL compliant, open source object-relational
database management system, is now undergoing beta testing of the next
version of our software.
');
```

နောက်တစ်ဆင့်က — `public` schema ထဲမှာ ဖန်တီးထားတဲ့ configuration အသစ်ကို session က သုံးစေဖို့ သတ်မှတ်တာပါ:

```
=> \dF
   List of text search configurations
 Schema  | Name | Description
---------+------+-------------
 public  | pg   |

SET default_text_search_config = 'public.pg';
SET

SHOW default_text_search_config;
 default_text_search_config
----------------------------
 public.pg
```
