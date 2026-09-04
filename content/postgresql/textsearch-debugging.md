---
title: "Testing and Debugging Text Search (text search စမ်းသပ်ခြင်းနဲ့ ပြဿနာရှာဖွေခြင်း)"
description: "Text search configuration/parser/dictionary များကို စမ်းသပ်ရန် ts_debug, ts_parse, ts_token_type, ts_lexize function များ — နမူနာ output များနှင့်တကွ"
order: 124
source: "https://www.postgresql.org/docs/current/textsearch-debugging.html"
status: translated
updated: 2026-09-03
---

## 12.8. Testing and Debugging Text Search (text search စမ်းသပ်ခြင်းနဲ့ ပြဿနာရှာဖွေခြင်း)

- **12.8.1. Configuration Testing (configuration စမ်းသပ်ခြင်း)**
- **12.8.2. Parser Testing (parser စမ်းသပ်ခြင်း)**
- **12.8.3. Dictionary Testing (dictionary စမ်းသပ်ခြင်း)**

ကိုယ်ပိုင် custom text search configuration တစ်ခုရဲ့ အပြုအမူ (behavior) က လွယ်လွယ်နဲ့တော့ ရှုပ်ထွေးစရာ ဖြစ်နိုင်ပါတယ်။ ဒီ section မှာ ဖော်ပြထားတဲ့ function တွေက text search object တွေကို စမ်းသပ်ဖို့ အသုံးဝင်ပါတယ်။ Configuration တစ်ခုလုံးကို စမ်းသပ်နိုင်သလို — parser နဲ့ dictionary တွေကိုလည်း သီးခြားစီ စမ်းသပ်နိုင်ပါတယ်။

### 12.8.1. Configuration Testing (configuration စမ်းသပ်ခြင်း)

`ts_debug` function က text search configuration တစ်ခုကို လွယ်ကူစွာ စမ်းသပ်နိုင်အောင် လုပ်ပေးပါတယ်။

```sql
ts_debug([ config regconfig, ] document text,
         OUT alias text,
         OUT description text,
         OUT token text,
         OUT dictionaries regdictionary[],
         OUT dictionary regdictionary,
         OUT lexemes text[])
         returns setof record
```

`ts_debug` က — parser က ထုတ်လုပ်ပြီး — configuration ထဲမှာ သတ်မှတ်ထားတဲ့ dictionaries တွေက စီမံဆောင်ရွက်ခဲ့တဲ့ — `document` ရဲ့ token တိုင်းအကြောင်း အချက်အလက်တွေကို ပြသပါတယ်။ `config` argument နဲ့ သတ်မှတ်ထားတဲ့ configuration ကို အသုံးပြုပြီး — အဲဒီ argument ကို ချန်လှပ်လိုက်ရင် `default_text_search_config` ကို သုံးပါတယ်။

`ts_debug` က — parser က text ထဲမှာ ခွဲထုတ်လိုက်တဲ့ token တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ column တွေကတော့

- alias text — token type ရဲ့ အတို နာမည်
- description text — token type ရဲ့ ဖော်ပြချက်
- token text — token ရဲ့ စာသား
- dictionaries regdictionary[] — ဒီ token type အတွက် configuration က ရွေးချယ်ထားတဲ့ dictionaries
- dictionary regdictionary — token ကို မှတ်မိတဲ့ dictionary — ဘယ်ဟာမှ မမှတ်မိရင် NULL
- lexemes text[] — token ကို မှတ်မိတဲ့ dictionary က ထုတ်ပေးတဲ့ lexeme (များ) — ဘယ်ဟာမှ မမှတ်မိရင် NULL; empty array ({}) ဆိုရင်တော့ အဲဒါကို stop word အဖြစ် မှတ်မိခဲ့တယ်လို့ ဆိုလိုပါတယ်

ရိုးရှင်းတဲ့ ဥပမာတစ်ခု ကြည့်ကြရအောင်:

```sql
SELECT * FROM ts_debug('english', 'a fat  cat sat on a mat - it ate a fat rats');
   alias   |   description   | token |  dictionaries  |  dictionary  | lexemes
-----------+-----------------+-------+----------------+--------------+---------
 asciiword | Word, all ASCII | a     | {english_stem} | english_stem | {}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | fat   | {english_stem} | english_stem | {fat}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | cat   | {english_stem} | english_stem | {cat}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | sat   | {english_stem} | english_stem | {sat}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | on    | {english_stem} | english_stem | {}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | a     | {english_stem} | english_stem | {}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | mat   | {english_stem} | english_stem | {mat}
 blank     | Space symbols   |       | {}             |              |
 blank     | Space symbols   | -     | {}             |              |
 asciiword | Word, all ASCII | it    | {english_stem} | english_stem | {}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | ate   | {english_stem} | english_stem | {ate}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | a     | {english_stem} | english_stem | {}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | fat   | {english_stem} | english_stem | {fat}
 blank     | Space symbols   |       | {}             |              |
 asciiword | Word, all ASCII | rats  | {english_stem} | english_stem | {rat}
```

ပိုပြီး အကျယ်တဝင့် သရုပ်ပြဖို့ — English ဘာသာစကားအတွက် `public.english` configuration တစ်ခုနဲ့ Ispell dictionary တစ်ခုကို အရင်ဆုံး ဖန်တီးလိုက်ပါမယ်:

```sql
CREATE TEXT SEARCH CONFIGURATION public.english ( COPY = pg_catalog.english );

CREATE TEXT SEARCH DICTIONARY english_ispell (
    TEMPLATE = ispell,
    DictFile = english,
    AffFile = english,
    StopWords = english
);

ALTER TEXT SEARCH CONFIGURATION public.english
   ALTER MAPPING FOR asciiword WITH english_ispell, english_stem;
```

```sql
SELECT * FROM ts_debug('public.english', 'The Brightest supernovaes');
   alias   |   description   |    token    |         dictionaries          |   dictionary   |   lexemes
-----------+-----------------+-------------+-------------------------------+----------------+-------------
 asciiword | Word, all ASCII | The         | {english_ispell,english_stem} | english_ispell | {}
 blank     | Space symbols   |             | {}                            |                |
 asciiword | Word, all ASCII | Brightest   | {english_ispell,english_stem} | english_ispell | {bright}
 blank     | Space symbols   |             | {}                            |                |
 asciiword | Word, all ASCII | supernovaes | {english_ispell,english_stem} | english_stem   | {supernova}
```

ဒီဥပမာထဲမှာ — `Brightest` ဆိုတဲ့ စကားလုံးကို parser က `ASCII word` (alias `asciiword`) အဖြစ် မှတ်မိပါတယ်။ ဒီ token type အတွက် dictionary စာရင်းကတော့ `english_ispell` နဲ့ `english_stem` ဖြစ်ပါတယ်။ အဲဒီစကားလုံးကို `english_ispell` က မှတ်မိပြီး — noun (နာမ်) `bright` အဖြစ် လျှော့ချပေးပါတယ်။ `supernovaes` ဆိုတဲ့ စကားလုံးကတော့ `english_ispell` dictionary အတွက် မသိတဲ့ စကားလုံး ဖြစ်လို့ — နောက် dictionary ဆီ ဆက်ပို့လိုက်ပြီး — ကံကောင်းချင်တော့ အဲဒီမှာ မှတ်မိသွားပါတယ် (တကယ်တော့ `english_stem` က အရာအားလုံးကို မှတ်မိတဲ့ Snowball dictionary တစ်ခု ဖြစ်လို့ — dictionary စာရင်းရဲ့ အဆုံးမှာ ထားလိုက်တာ ဖြစ်ပါတယ်)။

`The` ဆိုတဲ့ စကားလုံးကိုတော့ `english_ispell` dictionary က stop word ([အပိုင်း 12.6.1](/docs/postgresql/textsearch-dictionaries)) အဖြစ် မှတ်မိလို့ — index လုပ်ခံရမှာ မဟုတ်ပါဘူး။ Space တွေကိုလည်း — configuration က သူတို့အတွက် dictionary လုံးဝ မပေးထားတာကြောင့် — ပစ်ပယ်လိုက်ပါတယ်။

ကြည့်ချင်တဲ့ column တွေကို အတိအကျ သတ်မှတ်ခြင်းအားဖြင့် output ရဲ့ အကျယ်ကို လျှော့ချလို့ရပါတယ်:

```sql
SELECT alias, token, dictionary, lexemes
FROM ts_debug('public.english', 'The Brightest supernovaes');
   alias   |    token    |   dictionary   |   lexemes
-----------+-------------+----------------+-------------
 asciiword | The         | english_ispell | {}
 blank     |             |                |
 asciiword | Brightest   | english_ispell | {bright}
 blank     |             |                |
 asciiword | supernovaes | english_stem   | {supernova}
```

### 12.8.2. Parser Testing (parser စမ်းသပ်ခြင်း)

အောက်ပါ function တွေက text search parser တစ်ခုကို တိုက်ရိုက် စမ်းသပ်နိုင်အောင် လုပ်ပေးပါတယ်။

```sql
ts_parse(parser_name text, document text,
         OUT tokid integer, OUT token text) returns setof record
ts_parse(parser_oid oid, document text,
         OUT tokid integer, OUT token text) returns setof record
```

`ts_parse` က ပေးထားတဲ့ `document` ကို parse လုပ်ပြီး — parse လုပ်ရာက ထွက်လာတဲ့ token တစ်ခုချင်းစီအတွက် record တစ်ခုစီ ပါဝင်တဲ့ record စီးရီး (series) တစ်ခုကို ပြန်ပေးပါတယ်။ Record တစ်ခုစီမှာ — သတ်မှတ်လိုက်တဲ့ token type ကို ပြသပေးတဲ့ `tokid` နဲ့ — token ရဲ့ စာသားဖြစ်တဲ့ `token` တို့ ပါဝင်ပါတယ်။ ဥပမာ:

```sql
SELECT * FROM ts_parse('default', '123 - a number');
 tokid | token
-------+--------
    22 | 123
    12 |
    12 | -
     1 | a
    12 |
     1 | number
```

```sql
ts_token_type(parser_name text, OUT tokid integer,
              OUT alias text, OUT description text) returns setof record
ts_token_type(parser_oid oid, OUT tokid integer,
              OUT alias text, OUT description text) returns setof record
```

`ts_token_type` က — သတ်မှတ်ထားတဲ့ parser က မှတ်မိနိုင်တဲ့ token type တစ်ခုချင်းစီကို ဖော်ပြတဲ့ table တစ်ခုကို ပြန်ပေးပါတယ်။ Token type တစ်ခုစီအတွက် — table က အဲဒီ type ရဲ့ token တစ်ခုကို အညွှန်းတပ်ဖို့ parser က သုံးတဲ့ integer `tokid`၊ configuration command တွေထဲမှာ token type ကို နာမည်ပေးတဲ့ `alias` နဲ့ — အတို ဖော်ပြချက် `description` တို့ကို ပေးပါတယ်။ ဥပမာ:

```sql
SELECT * FROM ts_token_type('default');
 tokid |      alias      |               description
-------+-----------------+------------------------------------------
     1 | asciiword       | Word, all ASCII
     2 | word            | Word, all letters
     3 | numword         | Word, letters and digits
     4 | email           | Email address
     5 | url             | URL
     6 | host            | Host
     7 | sfloat          | Scientific notation
     8 | version         | Version number
     9 | hword_numpart   | Hyphenated word part, letters and digits
    10 | hword_part      | Hyphenated word part, all letters
    11 | hword_asciipart | Hyphenated word part, all ASCII
    12 | blank           | Space symbols
    13 | tag             | XML tag
    14 | protocol        | Protocol head
    15 | numhword        | Hyphenated word, letters and digits
    16 | asciihword      | Hyphenated word, all ASCII
    17 | hword           | Hyphenated word, all letters
    18 | url_path        | URL path
    19 | file            | File or path name
    20 | float           | Decimal notation
    21 | int             | Signed integer
    22 | uint            | Unsigned integer
    23 | entity          | XML entity
```

### 12.8.3. Dictionary Testing (dictionary စမ်းသပ်ခြင်း)

`ts_lexize` function က dictionary စမ်းသပ်ခြင်းကို အဆင်ပြေချောမွေ့စေပါတယ်။

```sql
ts_lexize(dict regdictionary, token text) returns text[]
```

`ts_lexize` က — input `token` ကို dictionary က သိတယ်ဆိုရင် lexemes တွေရဲ့ array တစ်ခုကို ပြန်ပေးပြီး — token ကို dictionary က သိပေမယ့် stop word ဖြစ်နေရင်တော့ empty array တစ်ခု — မသိတဲ့ စကားလုံး ဖြစ်ရင်တော့ `NULL` ကို ပြန်ပေးပါတယ်။

ဥပမာများ:

```sql
SELECT ts_lexize('english_stem', 'stars');
 ts_lexize
-----------
 {star}

SELECT ts_lexize('english_stem', 'a');
 ts_lexize
-----------
 {}
```

> **မှတ်ချက်:** `ts_lexize` function က text တစ်ခုလုံး မဟုတ်ဘဲ — token တစ်ခုတည်းကိုပဲ မျှော်လင့်ပါတယ်။ ဒါက ရှုပ်ထွေးစေနိုင်တဲ့ ဖြစ်ရပ်တစ်ခုကတော့:
> 
> ```sql
> SELECT ts_lexize('thesaurus_astro', 'supernovae stars') is null;
>  ?column?
> ----------
>  t
> ```
> 
> Thesaurus dictionary `thesaurus_astro` က `supernovae stars` ဆိုတဲ့ phrase (စကားစု) ကို တကယ် သိပါတယ် — ဒါပေမယ့် `ts_lexize` ကတော့ — input text ကို parse လုပ်မယ့်အစား token တစ်ခုတည်းအဖြစ် သဘောထားလို့ — အလုပ်မဖြစ်ပါဘူး။ Thesaurus dictionary တွေကို စမ်းသပ်ဖို့ဆိုရင် `plainto_tsquery` ဒါမှမဟုတ် `to_tsvector` ကို သုံးပါ။ ဥပမာ:
> 
> ```sql
> SELECT plainto_tsquery('supernovae stars');
>  plainto_tsquery
> -----------------
>  'sn'
> ```
