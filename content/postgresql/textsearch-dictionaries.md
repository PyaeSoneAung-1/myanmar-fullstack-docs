---
title: "Dictionaries (dictionary များ)"
description: "Text search (စာသားရှာဖွေမှု) အတွက် dictionary များ — stop words ဖယ်ရှားခြင်းနှင့် simple, synonym, thesaurus, Ispell, snowball dictionary များကို ဖန်တီးသုံးစွဲခြင်း"
order: 122
source: "https://www.postgresql.org/docs/current/textsearch-dictionaries.html"
status: translated
updated: 2026-09-03
---

## 12.6. Dictionaries (dictionary များ)

- **12.6.1. Stop Words (ဖယ်ထုတ်ရန် စကားလုံးများ)**
- **12.6.2. Simple Dictionary (ရိုးရှင်းသော dictionary)**
- **12.6.3. Synonym Dictionary (synonym ဖြင့် အစားထိုးသော dictionary)**
- **12.6.4. Thesaurus Dictionary (phrase များပါ အစားထိုးနိုင်သော thesaurus dictionary)**
- **12.6.5. Ispell Dictionary (Ispell morphological dictionary)**
- **12.6.6. Snowball Dictionary (Snowball stemming dictionary)**

Dictionaries တွေကို — ရှာဖွေမှုမှာ ထည့်သွင်းစဉ်းစားစရာ မလိုတဲ့ စကားလုံးတွေ (*stop words*) ကို ဖယ်ရှားဖို့နဲ့ — စကားလုံးတစ်လုံးတည်းရဲ့ ဆင်းသက်လာတဲ့ ပုံစံကွဲ (derived form) တွေ အချင်းချင်း ကိုက်ညီနိုင်အောင် — စကားလုံးတွေကို *normalize* (ပုံစံတစ်ခုတည်းသို့ ပြောင်းလဲခြင်း) လုပ်ဖို့ သုံးပါတယ်။ အောင်မြင်စွာ normalize လုပ်ပြီးသား စကားလုံးကို *lexeme* လို့ ခေါ်ပါတယ်။ ရှာဖွေမှု အရည်အသွေး တိုးတက်စေတာအပြင် — normalize လုပ်ခြင်းနဲ့ stop words ဖယ်ရှားခြင်းက document တစ်ခုရဲ့ `tsvector` ကိုယ်စားပြုမှုရဲ့ အရွယ်အစားကို လျှော့ချပေးလို့ — performance (စွမ်းဆောင်ရည်) ကိုလည်း တိုးတက်စေပါတယ်။ Normalization က ဘာသာစကားအရ အဓိပ္ပာယ် ရှိဖို့ အမြဲတမ်း မလိုအပ်ဘဲ — ပုံမှန်အားဖြင့် application ရဲ့ semantics (အဓိပ္ပာယ်) ပေါ်မှာ မူတည်ပါတယ်။

Normalization ရဲ့ ဥပမာတချို့:

- Linguistic (ဘာသာစကားဆိုင်ရာ) — Ispell dictionary တွေက input စကားလုံးတွေကို ပုံမှန် ပုံစံတစ်ခုတည်းဆီ လျှော့ချဖို့ ကြိုးစားပြီး — stemmer dictionary (စကားလုံး၏ နောက်ဆက်တွဲ ဖယ်ရှားသည့် dictionary) တွေကတော့ စကားလုံးရဲ့ အဆုံးသတ် စာလုံးတွေကို ဖယ်ရှားပါတယ်
- URL နေရာတွေကို canonicalize (စံပုံစံချခြင်း) လုပ်ပြီး — ညီမျှတဲ့ URL တွေ အချင်းချင်း ကိုက်ညီအောင် လုပ်နိုင်ပါတယ်:
  
  http://www.pgsql.ru/db/mw/index.html
  
  
  http://www.pgsql.ru/db/mw/
  
  
  http://www.pgsql.ru/db/../db/mw/index.html
- အရောင် နာမည်တွေကို hexadecimal (ဆယ့်ခြောက်လုံးကိန်းစနစ်) တန်ဖိုးတွေနဲ့ အစားထိုးနိုင်ပါတယ် — ဥပမာ red, green, blue, magenta -> FF0000, 00FF00, 0000FF, FF00FF
- ကိန်းဂဏန်းတွေကို index လုပ်နေတယ်ဆိုရင် — ဖြစ်နိုင်ခြေရှိတဲ့ ကိန်းဂဏန်း အပိုင်းအခြားကို ကျဉ်းစေဖို့ — အပိုင်းကိန်း ဂဏန်း (fractional digit) တချို့ကို ဖယ်ရှားလို့ရပါတယ် — ဥပမာ ဒဿမ ကိန်း (decimal point) နောက်မှာ ဂဏန်း နှစ်လုံးပဲ ထားမယ်ဆိုရင် 3.14159265359, 3.1415926, 3.14 တို့ဟာ normalize လုပ်ပြီးတဲ့ နောက်မှာ အတူတူပဲ ဖြစ်သွားမှာ ဖြစ်ပါတယ်။

Dictionary တစ်ခုဆိုတာ token တစ်ခုကို input အဖြစ် လက်ခံပြီး အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးတဲ့ program တစ်ခု ဖြစ်ပါတယ်:

- input token ကို dictionary က သိတဲ့ စကားလုံးဆိုရင် — lexemes တစ်ခုရဲ့ array တစ်ခု (token တစ်ခုတည်းက lexeme တစ်ခုထက်ပို ထုတ်လုပ်နိုင်တာ သတိပြုပါ)
- TSL_FILTER flag သတ်မှတ်ထားတဲ့ lexeme တစ်ခုတည်း — မူရင်း token ကို token အသစ်တစ်ခုနဲ့ အစားထိုးပြီး နောက် dictionary တွေဆီ ဆက်ပို့ဖို့ ဖြစ်ပါတယ် (ဒီလို လုပ်တဲ့ dictionary ကို filtering dictionary လို့ ခေါ်ပါတယ်)
- dictionary က token ကို သိပေမယ့် — အဲဒါက stop word ဖြစ်နေရင် — empty array တစ်ခု
- dictionary က input token ကို မမှတ်မိဘူးဆိုရင် NULL

PostgreSQL မှာ ဘာသာစကား အများအပြားအတွက် ကြိုတင် သတ်မှတ်ထားတဲ့ (predefined) dictionary တွေ ပါဝင်ပါတယ်။ ကိုယ်ပိုင် parameters (parameter များ) နဲ့ dictionary အသစ်တွေ ဖန်တီးဖို့ သုံးလို့ရတဲ့ predefined template (ပုံစံပြား) တချို့လည်း ရှိပါတယ်။ Predefined dictionary template တစ်ခုချင်းစီကို အောက်မှာ ဖော်ပြထားပါတယ်။ ရှိပြီးသား template တစ်ခုမှ မသင့်တော်ဘူးဆိုရင် — အသစ်တွေလည်း ဖန်တီးလို့ ရပါတယ်; PostgreSQL distribution ရဲ့ `contrib/` နေရာမှာ ဥပမာတွေ ကြည့်နိုင်ပါတယ်။

Text search configuration တစ်ခုက parser တစ်ခုကို dictionary အစုတစ်စုနဲ့ ချိတ်ဆက်ပြီး — parser ရဲ့ output token တွေကို process လုပ်ပါတယ်။ Parser က ပြန်ပေးနိုင်တဲ့ token type တစ်ခုချင်းစီအတွက် — dictionary တွေရဲ့ သီးခြား list တစ်ခုကို configuration က သတ်မှတ်ပေးပါတယ်။ Parser က အဲဒီ type ရဲ့ token တစ်ခုကို တွေ့တဲ့အခါ — list ထဲက dictionary တစ်ခုချင်းစီကို — တစ်ခုခုက အဲဒါကို သိပြီးသား စကားလုံး (known word) အဖြစ် မမှတ်မိမချင်း — အစဉ်လိုက် စစ်ဆေးပါတယ်။ အဲဒါကို stop word အဖြစ် ဖော်ထုတ်ခံရရင် ဒါမှမဟုတ် — dictionary တစ်ခုမှ token ကို မမှတ်မိဘူးဆိုရင် — အဲဒါကို စွန့်ပစ်လိုက်ပြီး — index လုပ်ခြင်း ဒါမှမဟုတ် ရှာဖွေခြင်း မပြုတော့ပါဘူး။ ပုံမှန်အားဖြင့် — non-`NULL` output ကို ပထမဆုံး ပြန်ပေးတဲ့ dictionary က ရလဒ်ကို ဆုံးဖြတ်ပြီး — ကျန်တဲ့ dictionary တွေကို ဆက်မစစ်တော့ပါဘူး; ဒါပေမယ့် filtering dictionary က ပေးထားတဲ့ စကားလုံးကို ပြုပြင်ထားတဲ့ စကားလုံးတစ်လုံးနဲ့ အစားထိုးနိုင်ပြီး — အဲဒါကို နောက် dictionary တွေဆီ ဆက်ပို့ပါတယ်။

Dictionary list တစ်ခုကို configure လုပ်ဖို့ ယေဘုယျ စည်းမျဉ်းကတော့ — အကျဉ်းဆုံး၊ အသေးစိတ်အကျဆုံး (most specific) dictionary ကို ရှေ့ဆုံးမှာ ထားပြီး — နောက်မှာ ပိုပြီး ယေဘုယျကျတဲ့ dictionary တွေ ထားကာ — နောက်ဆုံးမှာတော့ Snowball stemmer ဒါမှမဟုတ် `simple` လိုမျိုး — အရာအားလုံးကို မှတ်မိတဲ့ — အလွန် ယေဘုယျကျတဲ့ dictionary တစ်ခုနဲ့ အဆုံးသတ်ဖို့ ဖြစ်ပါတယ်။ ဥပမာ — နက္ခတ္တဗေဒ (astronomy) ဆိုင်ရာ ရှာဖွေမှု (`astro_en` configuration) တစ်ခုအတွက်ဆိုရင် — token type `asciiword` (ASCII word) ကို နက္ခတ္တဗေဒ ဝေါဟာရတွေရဲ့ synonym dictionary တစ်ခု၊ ယေဘုယျ အင်္ဂလိပ် dictionary တစ်ခုနဲ့ Snowball English stemmer တစ်ခုဆီ ချိတ်ဆက်နိုင်ပါတယ်:

```sql
ALTER TEXT SEARCH CONFIGURATION astro_en
    ADD MAPPING FOR asciiword WITH astrosyn, english_ispell, english_stem;
```

Filtering dictionary တစ်ခုကို list ထဲက ဘယ်နေရာမှာမဆို ထားလို့ရပါတယ် — အဆုံးမှာတော့ လွဲပါတယ် — အဲဒီမှာဆိုရင် အသုံးမဝင်လို့ပါ။ Filtering dictionary တွေက — နောက် dictionary တွေရဲ့ အလုပ်ကို ရိုးရှင်းစေဖို့ — စကားလုံးတွေကို တစ်စိတ်တစ်ပိုင်း normalize လုပ်ရာမှာ အသုံးဝင်ပါတယ်။ ဥပမာ — [unaccent](https://www.postgresql.org/docs/current/unaccent.html) module မှာ လုပ်ထားသလို — လေယူလေသိမ်း အမှတ်အသား (accent) ပါတဲ့ စာလုံးတွေကနေ accent တွေကို ဖယ်ရှားဖို့ filtering dictionary တစ်ခုကို သုံးနိုင်ပါတယ်။

### 12.6.1. Stop Words (ဖယ်ထုတ်ရန် စကားလုံးများ)

Stop words (ရှာဖွေမှုမှ ဖယ်ထုတ်ထားသော စကားလုံးများ) တွေဆိုတာ — အလွန် အသုံးများပြီး — document တိုင်းနီးပါးမှာ ပါဝင်နေတတ်ကာ — ခွဲခြားနိုင်စွမ်း တန်ဖိုး (discrimination value) မရှိတဲ့ စကားလုံးတွေ ဖြစ်ပါတယ်။ ဒါကြောင့် full text search (စာသား အပြည့်အစုံ ရှာဖွေခြင်း) ရဲ့ ကွက်လပ်ထဲမှာတော့ သူတို့ကို လျစ်လျူရှုလို့ ရပါတယ်။ ဥပမာ — အင်္ဂလိပ် text တိုင်းမှာ `a` နဲ့ `the` လို စကားလုံးတွေ ပါဝင်တာကြောင့် — အဲဒါတွေကို index ထဲမှာ သိမ်းထားတာ အသုံးမဝင်ပါဘူး။ ဒါပေမယ့် — stop words တွေက `tsvector` ထဲက positions (နေရာများ) တွေကို သက်ရောက်မှု ရှိပြီး — အဲဒါတွေက ranking (အဆင့်သတ်မှတ်ခြင်း) ကို ပြန်ပြီး သက်ရောက်ပါတယ်:

```sql
SELECT to_tsvector('english', 'in the list of stop words');
        to_tsvector
----------------------------
 'list':3 'stop':5 'word':6
```

ပျောက်နေတဲ့ positions 1, 2, 4 တွေက stop words တွေကြောင့် ဖြစ်ပါတယ်။ Stop words ပါတဲ့ document တွေနဲ့ မပါတဲ့ document တွေအတွက် တွက်ချက်ထားတဲ့ ranks (အဆင့်ရမှတ်များ) က အတော်လေး ကွာခြားပါတယ်:

```sql
SELECT ts_rank_cd (to_tsvector('english', 'in the list of stop words'), to_tsquery('list & stop'));
 ts_rank_cd
------------
       0.05

SELECT ts_rank_cd (to_tsvector('english', 'list stop words'), to_tsquery('list & stop'));
 ts_rank_cd
------------
        0.1
```

Stop words တွေကို ဘယ်လို သဘောထားမလဲဆိုတာ — dictionary တစ်ခုချင်းစီအပေါ်မှာ မူတည်ပါတယ်။ ဥပမာ — `ispell` dictionary တွေက စကားလုံးတွေကို အရင်ဆုံး normalize လုပ်ပြီးမှ stop words list ကို ကြည့်ပြီး — `Snowball` stemmer တွေကတော့ stop words list ကို အရင်ဆုံး စစ်ပါတယ်။ ဒီလို မတူညီတဲ့ အပြုအမူတွေ ရှိတဲ့ အကြောင်းရင်းက noise (ဆူညံမှု) ကို လျှော့ချဖို့ ကြိုးစားမှုတစ်ခု ဖြစ်ပါတယ်။

### 12.6.2. Simple Dictionary (ရိုးရှင်းသော dictionary)

`simple` dictionary template က — input token ကို lowercase (စာလုံးသေး) အဖြစ် ပြောင်းပြီး — stop words ပါဝင်တဲ့ file တစ်ခုနဲ့ စစ်ဆေးခြင်းဖြင့် အလုပ်လုပ်ပါတယ်။ File ထဲမှာ တွေ့ရင် — empty array ပြန်ပေးလို့ — token ကို စွန့်ပစ်သွားမှာ ဖြစ်ပါတယ်။ မတွေ့ရင် — စကားလုံးရဲ့ lowercase ပုံစံကို normalized lexeme အဖြစ် ပြန်ပေးပါတယ်။ တနည်းအားဖြင့် — stop word မဟုတ်တဲ့ စကားလုံးတွေကို မမှတ်မိဘူး (unrecognized) လို့ သတင်းပို့ဖို့လည်း dictionary ကို configure လုပ်လို့ရပြီး — အဲဒါဆိုရင် သူတို့ကို list ထဲက နောက် dictionary ဆီ ဆက်လွှဲပေးနိုင်ပါတယ်။

ဒီမှာ `simple` template ကို သုံးထားတဲ့ dictionary definition တစ်ခုရဲ့ ဥပမာ ဖြစ်ပါတယ်:

```sql
CREATE TEXT SEARCH DICTIONARY public.simple_dict (
    TEMPLATE = pg_catalog.simple,
    STOPWORDS = english
);
```

ဒီမှာ `english` က stop words file တစ်ခုရဲ့ base name (အခြေခံ နာမည်) ဖြစ်ပါတယ်။ File ရဲ့ အပြည့်အစုံ နာမည်က `$SHAREDIR/tsearch_data/english.stop` ဖြစ်မှာ ဖြစ်ပြီး — `$SHAREDIR` ဆိုတာ PostgreSQL installation ရဲ့ shared-data directory ကို ဆိုလိုကာ — မကြာခဏဆိုသလို `/usr/local/share/postgresql` ဖြစ်ပါတယ် (မသေချာရင် `pg_config --sharedir` နဲ့ စစ်ဆေးနိုင်ပါတယ်)။ File format ကတော့ — တစ်ကြောင်းကို စကားလုံးတစ်လုံးနှုန်း စာရင်းပြုစုထားတဲ့ ရိုးရိုး list တစ်ခု ဖြစ်ပါတယ်။ ဗလာ (blank) ကြောင်းတွေနဲ့ နောက်မှာ ပါလာတဲ့ space တွေကို လျစ်လျူရှုပြီး — စာလုံးကြီးတွေကို စာလုံးသေး အဖြစ် ပြောင်းပါတယ် — ဒါပေမယ့် file ရဲ့ အကြောင်းအရာပေါ်မှာ တခြား process လုပ်တာတွေ မရှိပါဘူး။

အခု ကိုယ့် dictionary ကို စမ်းသပ်ကြည့်လို့ ရပါပြီ:

```sql
SELECT ts_lexize('public.simple_dict', 'YeS');
 ts_lexize
-----------
 {yes}

SELECT ts_lexize('public.simple_dict', 'The');
 ts_lexize
-----------
 {}
```

Stop words file ထဲမှာ မတွေ့ရင် — lowercase လုပ်ထားတဲ့ စကားလုံး အစား `NULL` ကို ပြန်ပေးဖို့လည်း ရွေးချယ်လို့ ရပါတယ်။ ဒီအပြုအမူကို dictionary ရဲ့ `Accept` parameter ကို `false` အဖြစ် သတ်မှတ်ခြင်းဖြင့် ရွေးချယ်ပါတယ်။ ဥပမာကို ဆက်ကြည့်ရအောင်:

```sql
ALTER TEXT SEARCH DICTIONARY public.simple_dict ( Accept = false );

SELECT ts_lexize('public.simple_dict', 'YeS');
 ts_lexize
-----------

SELECT ts_lexize('public.simple_dict', 'The');
 ts_lexize
-----------
 {}
```

`Accept` = `true` ဆိုတဲ့ default သတ်မှတ်ချက်နဲ့ဆိုရင် — `simple` dictionary က token တစ်ခုကို နောက် dictionary ဆီ ဘယ်တော့မှ မလွှဲပေးတာကြောင့် — dictionary list တစ်ခုရဲ့ အဆုံးမှာပဲ `simple` dictionary ကို ထားတာ အဓိပ္ပာယ် ရှိပါတယ်။ အပြန်အလှန်အားဖြင့် — `Accept` = `false` ကတော့ နောက်မှာ dictionary အနည်းဆုံး တစ်ခု ရှိမှသာ အသုံးဝင်ပါတယ်။

> **သတိပြုရန်:** Dictionary အမျိုးအစား အများစုက stop words file တွေလို configuration file တွေပေါ်မှာ မှီခိုပါတယ်။ ဒီ file တွေကို UTF-8 encoding နဲ့ သိမ်းဆည်းထားရပါမယ်။ Server ထဲကို ဖတ်သွင်းတဲ့အခါ — database ရဲ့ encoding က မတူဘူးဆိုရင် — အဲဒီ encoding ဆီ အလိုအလျောက် ပြောင်းလဲ (translate) ပေးမှာ ဖြစ်ပါတယ်။

> **သတိပြုရန်:** ပုံမှန်အားဖြင့် — database session တစ်ခုက dictionary configuration file တစ်ခုကို — session ထဲမှာ ပထမဆုံး အသုံးပြုတဲ့အခါ — တစ်ကြိမ်တည်းသာ ဖတ်ပါတယ်။ Configuration file တစ်ခုကို ပြုပြင်ပြီး — ရှိပြီးသား session တွေကို အကြောင်းအရာ အသစ် လက်ခံစေချင်ရင် — အဲဒီ dictionary ပေါ်မှာ `ALTER TEXT SEARCH DICTIONARY` command တစ်ခု ထုတ်ပေးပါ။ ဒါက parameter တန်ဖိုး တစ်ခုကိုမှ တကယ် မပြောင်းလဲတဲ့ “dummy” update (အလဟသ update) တစ်ခု ဖြစ်နေလည်း ရပါတယ်။

### 12.6.3. Synonym Dictionary (synonym ဖြင့် အစားထိုးသော dictionary)

ဒီ dictionary template ကို — စကားလုံးတစ်လုံးကို အဓိပ္ပာယ်တူ စကားလုံး (synonym) တစ်ခုနဲ့ အစားထိုးတဲ့ dictionary တွေ ဖန်တီးဖို့ သုံးပါတယ်။ Phrase (စကားစုများ) တွေကိုတော့ မထောက်ခံပါဘူး (အဲဒါအတွက် thesaurus template (အပိုင်း 12.6.4) ကို သုံးပါ)။ Synonym dictionary ကို ဘာသာစကား ပိုင်းဆိုင်ရာ ပြဿနာတွေကို ကျော်လွှားဖို့ သုံးနိုင်ပါတယ် — ဥပမာ — အင်္ဂလိပ် stemmer dictionary တစ်ခုက “Paris” ဆိုတဲ့ စကားလုံးကို “pari” အဖြစ် လျှော့ချတာကို တားဆီးဖို့ပါ။ Synonym dictionary ထဲမှာ `Paris paris` ဆိုတဲ့ စာကြောင်း တစ်ကြောင်း ထားပြီး — အဲဒါကို `english_stem` dictionary ရဲ့ ရှေ့မှာ ထားရုံပါပဲ။ ဥပမာ:

```sql
SELECT * FROM ts_debug('english', 'Paris');
   alias   |   description   | token |  dictionaries  |  dictionary  | lexemes
-----------+-----------------+-------+----------------+--------------+---------
 asciiword | Word, all ASCII | Paris | {english_stem} | english_stem | {pari}

CREATE TEXT SEARCH DICTIONARY my_synonym (
    TEMPLATE = synonym,
    SYNONYMS = my_synonyms
);

ALTER TEXT SEARCH CONFIGURATION english
    ALTER MAPPING FOR asciiword
    WITH my_synonym, english_stem;

SELECT * FROM ts_debug('english', 'Paris');
   alias   |   description   | token |       dictionaries        | dictionary | lexemes
-----------+-----------------+-------+---------------------------+------------+---------
 asciiword | Word, all ASCII | Paris | {my_synonym,english_stem} | my_synonym | {paris}
```

`synonym` template အတွက် လိုအပ်တဲ့ တစ်ခုတည်းသော parameter က `SYNONYMS` ဖြစ်ပြီး — အဲဒါက ၎င်းရဲ့ configuration file ရဲ့ base name ဖြစ်ပါတယ် — အပေါ်က ဥပမာမှာဆိုရင် `my_synonyms` ပါ။ File ရဲ့ အပြည့်အစုံ နာမည်က `$SHAREDIR/tsearch_data/my_synonyms.syn` ဖြစ်မှာ ဖြစ်ပြီး (`$SHAREDIR` ဆိုတာ PostgreSQL installation ရဲ့ shared-data directory ကို ဆိုလိုပါတယ်)။ File format ကတော့ — အစားထိုးရမယ့် စကားလုံးတစ်လုံးချင်းစီအတွက် — စကားလုံးနောက်မှာ ၎င်းရဲ့ synonym ကို white space (နေရာလပ်) နဲ့ ခြားပြီး — တစ်ကြောင်းစီ ရေးထားတာ ဖြစ်ပါတယ်။ ဗလာ ကြောင်းတွေနဲ့ နောက်မှာ ပါလာတဲ့ space တွေကို လျစ်လျူရှုပါတယ်။

`synonym` template မှာ optional parameter `CaseSensitive` လည်း ရှိပြီး — default က `false` ဖြစ်ပါတယ်။ `CaseSensitive` က `false` ဖြစ်တဲ့အခါ — synonym file ထဲက စကားလုံးတွေကို input token တွေလိုပဲ lowercase အဖြစ် ပြောင်းပါတယ်။ `true` ဖြစ်တဲ့အခါမှာတော့ — စကားလုံးတွေနဲ့ token တွေကို lowercase မပြောင်းဘဲ — ရှိတဲ့အတိုင်း (as-is) နှိုင်းယှဉ်ပါတယ်။

Configuration file ထဲမှာ synonym တစ်ခုရဲ့ အဆုံးမှာ asterisk (`*`) တစ်ခု ထားလို့ရပါတယ်။ ဒါက synonym က prefix (ရှေ့ဆက်) တစ်ခု ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ Entry ကို `to_tsvector()` ထဲမှာ သုံးတဲ့အခါ asterisk ကို လျစ်လျူရှုပေမယ့် — `to_tsquery()` ထဲမှာ သုံးတဲ့အခါ — ရလဒ်က prefix match marker (ရှေ့ဆက် ကိုက်ညီမှု အမှတ်အသား) ပါဝင်တဲ့ query item တစ်ခု ဖြစ်လာမှာ ဖြစ်ပါတယ် ([အပိုင်း 12.3.2](/docs/postgresql/textsearch-controls) ကို ကြည့်ပါ)။ ဥပမာ — `$SHAREDIR/tsearch_data/synonym_sample.syn` ထဲမှာ ဒီ entry တွေ ရှိတယ် ဆိုပါစို့:

```sql
postgres        pgsql
postgresql      pgsql
postgre pgsql
gogle   googl
indices index*
```

ဒါဆိုရင် အောက်ပါ ရလဒ်တွေ ရမှာ ဖြစ်ပါတယ်:

```
mydb=# CREATE TEXT SEARCH DICTIONARY syn (template=synonym, synonyms='synonym_sample');
mydb=# SELECT ts_lexize('syn', 'indices');
 ts_lexize
-----------
 {index}
(1 row)

mydb=# CREATE TEXT SEARCH CONFIGURATION tst (copy=simple);
mydb=# ALTER TEXT SEARCH CONFIGURATION tst ALTER MAPPING FOR asciiword WITH syn;
mydb=# SELECT to_tsvector('tst', 'indices');
 to_tsvector
-------------
 'index':1
(1 row)

mydb=# SELECT to_tsquery('tst', 'indices');
 to_tsquery
------------
 'index':*
(1 row)

mydb=# SELECT 'indexes are very useful'::tsvector;
            tsvector
---------------------------------
 'are' 'indexes' 'useful' 'very'
(1 row)

mydb=# SELECT 'indexes are very useful'::tsvector @@ to_tsquery('tst', 'indices');
 ?column?
----------
 t
(1 row)
```

### 12.6.4. Thesaurus Dictionary (phrase များပါ အစားထိုးနိုင်သော thesaurus dictionary)

Thesaurus dictionary (တစ်ခါတရံ TZ လို့ အတိုကောက် ခေါ်ပါတယ်) ဆိုတာ — စကားလုံးတွေနဲ့ phrase တွေရဲ့ ဆက်စပ်မှု အချက်အလက်တွေ ပါဝင်တဲ့ စကားလုံး စုစည်းမှုတစ်ခု ဖြစ်ပြီး — ဥပမာ ပိုကျယ်ပြန့်တဲ့ ဝေါဟာရများ (broader terms — BT)၊ ပိုကျဉ်းမြောင်းတဲ့ ဝေါဟာရများ (narrower terms — NT)၊ ဦးစားပေး ဝေါဟာရများ (preferred terms)၊ ဦးစားမပေးသော ဝေါဟာရများ (non-preferred terms)၊ ဆက်စပ်ဝေါဟာရများ (related terms) စသဖြင့် ပါဝင်ပါတယ်။

အခြေခံအားဖြင့် thesaurus dictionary က — ဦးစားမပေးသော ဝေါဟာရတွေ အားလုံးကို ဦးစားပေး ဝေါဟာရတစ်ခုတည်းနဲ့ အစားထိုးပြီး — ရွေးချယ်နိုင်တဲ့ အနေနဲ့ — မူရင်း ဝေါဟာရတွေကို index လုပ်ဖို့အတွက်လည်း ထိန်းသိမ်းထားပါတယ်။ PostgreSQL မှာ thesaurus dictionary ရဲ့ လက်ရှိ အကောင်အထည်ဖော်မှုက — synonym dictionary ကို *phrase* (စကားစု) ထောက်ပံ့မှု ထပ်ဖြည့်ထားတဲ့ တိုးချဲ့မှုတစ်ခု ဖြစ်ပါတယ်။ Thesaurus dictionary တစ်ခုအတွက် အောက်ပါ ပုံစံရှိတဲ့ configuration file တစ်ခု လိုအပ်ပါတယ်:

```sql
# this is a comment
sample word(s) : indexed word(s)
more sample word(s) : more indexed word(s)
...
```

ဒီမှာ colon (`:`) သင်္ကေတက — phrase တစ်ခုနဲ့ ၎င်းရဲ့ အစားထိုး (replacement) ကြားမှာ delimiter (ခြားနားချက် အမှတ်အသား) အဖြစ် ဆောင်ရွက်ပါတယ်။

Thesaurus dictionary က phrase match စစ်ဆေးခြင်း မလုပ်ခင် input text ကို normalize လုပ်ဖို့ *subdictionary* (dictionary ရဲ့ configuration ထဲမှာ သတ်မှတ်ထားသော) တစ်ခုကို သုံးပါတယ်။ Subdictionary တစ်ခုတည်းကိုပဲ ရွေးချယ်လို့ ရပါတယ်။ Subdictionary က စကားလုံးတစ်လုံးကို မမှတ်မိရင် error တစ်ခု သတင်းပို့ပါတယ်။ အဲဒီအခါ — အဲဒီ စကားလုံး သုံးစွဲမှုကို ဖယ်ရှားသင့်ပါတယ် ဒါမှမဟုတ် — subdictionary ကို အဲဒီ စကားလုံးအကြောင်း သင်ပေးသင့်ပါတယ်။ Indexed word တစ်ခုရဲ့ အစမှာ asterisk (`*`) တစ်ခု ထားပြီး — အဲဒီ စကားလုံးကို subdictionary သုံးစရာ မလိုဘဲ ကျော်လိုက်နိုင်ပေမယ့် — sample words (နမူနာ စကားလုံးများ) အားလုံးကတော့ subdictionary အတွက် သိပြီးသား (known) ဖြစ်ရပါမယ်။

Thesaurus dictionary က — input နဲ့ ကိုက်ညီတဲ့ phrase အများအပြား ရှိရင် — အရှည်ဆုံး ကိုက်ညီမှု (longest match) ကို ရွေးပြီး — အရှည် တူညီနေရင်တော့ နောက်ဆုံး သတ်မှတ်ချက် (definition) ကို သုံးပါတယ်။

Subdictionary က မှတ်မိတဲ့ သီးခြား stop words တွေကိုတော့ သတ်မှတ်လို့ မရပါဘူး — အဲဒီအစား — ဘယ်နေရာမှာမဆို stop word တစ်ခု ပေါ်လာနိုင်တယ်ဆိုတာကို အမှတ်အသား လုပ်ဖို့ `?` ကို သုံးပါတယ်။ ဥပမာ — subdictionary အရ `a` နဲ့ `the` တို့က stop words တွေ ဖြစ်တယ် ဆိုပါစို့:

```sql
? one ? two : swsw
```

ဒါက `a one the two` နဲ့ `the one a two` နှစ်ခုလုံးကို ကိုက်ညီပြီး — နှစ်ခုလုံးကို `swsw` နဲ့ အစားထိုးမှာ ဖြစ်ပါတယ်။

Thesaurus dictionary က phrase တွေကို မှတ်မိနိုင်တာကြောင့် — ၎င်းရဲ့ state (အခြေအနေ) ကို မှတ်ထားပြီး — parser နဲ့ အပြန်အလှန် ဆက်သွယ်ရပါတယ်။ Thesaurus dictionary က — နောက် စကားလုံးတစ်လုံးကို ကိုင်တွယ်သင့်လား ဒါမှမဟုတ် စုဆောင်းမှု (accumulation) ရပ်သင့်လား ဆိုတာ စစ်ဆေးဖို့ — ဒီ assignments (တာဝန်ပေးမှုများ) တွေကို သုံးပါတယ်။ Thesaurus dictionary ကို သေချာ configure လုပ်ရပါမယ်။ ဥပမာ — thesaurus dictionary ကို `asciiword` token ကိုပဲ ကိုင်တွယ်ဖို့ တာဝန်ပေးထားရင် — `one 7` လို thesaurus dictionary definition တစ်ခုက အလုပ်လုပ်မှာ မဟုတ်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ token type `uint` ကို thesaurus dictionary ဆီ တာဝန်မပေးထားလို့ပါ။

> **သတိပြုရန်:** Thesaurus တွေကို indexing လုပ်ချိန်မှာ သုံးတာကြောင့် — thesaurus dictionary ရဲ့ parameters တွေမှာ ပြောင်းလဲမှု တစ်ခုခု ရှိရင် reindexing (index ပြန်တည်ဆောက်ခြင်း) လုပ်ဖို့ လိုအပ်ပါတယ်။ တခြား dictionary အမျိုးအစား အများစုအတွက်တော့ — stopwords ထပ်ထည့်တာ ဒါမှမဟုတ် ဖယ်ရှားတာလို သေးငယ်တဲ့ ပြောင်းလဲမှုတွေက reindexing ကို အတင်းအကျပ် မလိုအပ်ပါဘူး။

#### 12.6.4.1. Thesaurus Configuration (thesaurus သတ်မှတ်ပုံ)

Thesaurus dictionary အသစ်တစ်ခု သတ်မှတ်ဖို့ — `thesaurus` template ကို သုံးပါတယ်။ ဥပမာ:

```sql
CREATE TEXT SEARCH DICTIONARY thesaurus_simple (
    TEMPLATE = thesaurus,
    DictFile = mythesaurus,
    Dictionary = pg_catalog.english_stem
);
```

ဒီမှာ:

- `thesaurus_simple` က dictionary အသစ်ရဲ့ နာမည် ဖြစ်ပါတယ်
- `mythesaurus` က thesaurus configuration file ရဲ့ base name ဖြစ်ပါတယ် (အပြည့်အစုံ နာမည်က `$SHAREDIR/tsearch_data/mythesaurus.ths` ဖြစ်မှာ ဖြစ်ပြီး — `$SHAREDIR` ဆိုတာ installation ရဲ့ shared-data directory ကို ဆိုလိုပါတယ်)
- `pg_catalog.english_stem` က thesaurus normalization အတွက် သုံးမယ့် subdictionary (ဒီမှာတော့ Snowball English stemmer) ဖြစ်ပါတယ်။ Subdictionary မှာ ကိုယ်ပိုင် configuration (ဥပမာ — stop words) ရှိမယ်ဆိုတာ သတိပြုပါ — ဒီမှာတော့ ဖော်ပြမထားပါဘူး

အခုဆိုရင် thesaurus dictionary `thesaurus_simple` ကို configuration တစ်ခုထဲမှာ လိုချင်တဲ့ token types တွေဆီ ချိတ်ဆက်လို့ ရပါပြီ — ဥပမာ:

```sql
ALTER TEXT SEARCH CONFIGURATION russian
    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart
    WITH thesaurus_simple;
```

#### 12.6.4.2. Thesaurus Example (thesaurus ဥပမာ)

နက္ခတ္တဗေဒ စကားလုံး ပေါင်းစပ်မှုတချို့ ပါဝင်တဲ့ ရိုးရှင်းတဲ့ နက္ခတ္တဗေဒ thesaurus `thesaurus_astro` တစ်ခုကို စဉ်းစားကြည့်ပါ:

```sql
supernovae stars : sn
crab nebulae : crab
```

အောက်မှာတော့ — dictionary တစ်ခု ဖန်တီးပြီး — token types တချို့ကို နက္ခတ္တဗေဒ thesaurus တစ်ခုနဲ့ English stemmer ဆီ ချိတ်ဆက်ထားပါတယ်:

```sql
CREATE TEXT SEARCH DICTIONARY thesaurus_astro (
    TEMPLATE = thesaurus,
    DictFile = thesaurus_astro,
    Dictionary = english_stem
);

ALTER TEXT SEARCH CONFIGURATION russian
    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart
    WITH thesaurus_astro, english_stem;
```

အခု ဘယ်လို အလုပ်လုပ်လဲ ကြည့်လို့ ရပါပြီ။ Thesaurus တစ်ခုကို စမ်းသပ်ဖို့ `ts_lexize` က သိပ် အသုံးမဝင်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ ၎င်းက input ကို token တစ်ခုတည်းအနေနဲ့ သဘောထားလို့ပါ။ အဲဒီအစား — input string တွေကို token အများအပြား ခွဲပေးမယ့် `plainto_tsquery` နဲ့ `to_tsvector` တို့ကို သုံးနိုင်ပါတယ်:

```sql
SELECT plainto_tsquery('supernova star');
 plainto_tsquery
-----------------
 'sn'

SELECT to_tsvector('supernova star');
 to_tsvector
-------------
 'sn':1
```

မူအရအားဖြင့် — argument ကို quote လုပ်ပေးမယ်ဆိုရင် `to_tsquery` ကိုလည်း သုံးလို့ရပါတယ်:

```sql
SELECT to_tsquery('''supernova star''');
 to_tsquery
------------
 'sn'
```

`supernova star` က — thesaurus definition ထဲမှာ `english_stem` stemmer ကို သတ်မှတ်ထားလို့ — `thesaurus_astro` ထဲက `supernovae stars` နဲ့ ကိုက်ညီတာ သတိပြုပါ။ Stemmer က `e` နဲ့ `s` တို့ကို ဖယ်ရှားလိုက်လို့ပါ။

မူရင်း phrase ကိုပါ — အစားထိုး စကားလုံးနဲ့အတူ — index လုပ်ချင်ရင် — definition ရဲ့ ညာဘက် အပိုင်းမှာ ထည့်သွင်းလိုက်ရုံပါပဲ:

```sql
supernovae stars : sn supernovae stars

SELECT plainto_tsquery('supernova star');
       plainto_tsquery
-----------------------------
 'sn' & 'supernova' & 'star'
```

### 12.6.5. Ispell Dictionary (Ispell morphological dictionary)

Ispell dictionary template က *morphological dictionaries* (စကားလုံး ပုံစံပြောင်းလဲမှုဆိုင်ရာ dictionary များ) တွေကို ထောက်ပံ့ပါတယ် — အဲဒါတွေက စကားလုံးတစ်လုံးရဲ့ ဘာသာစကား ပုံစံကွဲ (linguistic form) အများအပြားကို lexeme တစ်ခုတည်းအဖြစ် normalize လုပ်နိုင်ပါတယ်။ ဥပမာ — အင်္ဂလိပ် Ispell dictionary တစ်ခုက — `bank` ဆိုတဲ့ ရှာဖွေမှု term ရဲ့ declension (နာမ် ပုံစံပြောင်းမှု) နဲ့ conjugation (ကြိယာ ပုံစံပြောင်းမှု) အားလုံးကို ကိုက်ညီစေနိုင်ပါတယ် — ဥပမာ `banking`, `banked`, `banks`, `banks'`, နဲ့ `bank's` တို့ပါ။

PostgreSQL ရဲ့ ပုံမှန် distribution မှာ Ispell configuration file တွေ မပါဝင်ပါဘူး။ ဘာသာစကား အများအပြားအတွက် dictionary တွေကို [Ispell](https://www.cs.hmc.edu/~geoff/ispell.html) ကနေ ရယူနိုင်ပါတယ်။ ဒါ့အပြင် — ပိုခေတ်မီတဲ့ dictionary file format တချို့လည်း ထောက်ပံ့ထားပါတယ် — [MySpell](https://en.wikipedia.org/wiki/MySpell) (OO < 2.0.1) နဲ့ [Hunspell](https://hunspell.github.io/) (OO >= 2.0.2) တို့ပါ။ Dictionary အများအပြားရဲ့ စာရင်းကို [OpenOffice Wiki](https://wiki.openoffice.org/wiki/Dictionaries) မှာ ရနိုင်ပါတယ်။

Ispell dictionary တစ်ခု ဖန်တီးဖို့ အောက်ပါ အဆင့်တွေကို လုပ်ဆောင်ပါ:

- Dictionary configuration file တွေကို download လုပ်ပါ။ OpenOffice extension file တွေမှာ `.oxt` extension ရှိပါတယ်။ `.aff` နဲ့ `.dic` file တွေကို extract (ဖော်ထုတ်) လုပ်ပြီး — extension တွေကို `.affix` နဲ့ `.dict` အဖြစ် ပြောင်းဖို့ လိုအပ်ပါတယ်။ Dictionary file တချို့အတွက်ဆိုရင် — command တွေနဲ့ စာလုံးတွေကို UTF-8 encoding အဖြစ် ပြောင်းဖို့လည်း လိုအပ်ပါတယ် (ဥပမာ — နော်ဝေ (Norwegian) ဘာသာစကား dictionary တစ်ခုအတွက်):
  
  iconv -f ISO_8859-1 -t UTF-8 -o nn_no.affix nn_NO.aff
  iconv -f ISO_8859-1 -t UTF-8 -o nn_no.dict nn_NO.dic
- file တွေကို `$SHAREDIR/tsearch_data` directory ထဲကို copy လုပ်ပါ
- file တွေကို အောက်ပါ command ဖြင့် PostgreSQL ထဲသို့ load လုပ်ပါ:
  
  CREATE TEXT SEARCH DICTIONARY english_hunspell (
      TEMPLATE = ispell,
      DictFile = en_us,
      AffFile = en_us,
      Stopwords = english);

ဒီမှာ `DictFile`, `AffFile`, နဲ့ `StopWords` တို့က dictionary, affixes (စကားလုံး ပုံစံပြောင်းရန် ပညတ်ချက်များ), နဲ့ stop-words file တွေရဲ့ base names တွေကို သတ်မှတ်ပါတယ်။ Stop-words file က `simple` dictionary type အတွက် အပေါ်မှာ ရှင်းပြထားတဲ့ format အတိုင်းပဲ ဖြစ်ပါတယ်။ တခြား file တွေရဲ့ format ကိုတော့ ဒီနေရာမှာ သတ်မှတ်မပေးထားဘဲ — အထက်မှာ ဖော်ပြခဲ့တဲ့ website တွေကနေ ရယူနိုင်ပါတယ်။

Ispell dictionary တွေက ပုံမှန်အားဖြင့် ကန့်သတ်ထားတဲ့ စကားလုံး အစုတစ်ခုကိုပဲ မှတ်မိတာကြောင့် — သူတို့နောက်မှာ ပိုကျယ်ပြန့်တဲ့ dictionary တစ်ခု ထပ်ထားသင့်ပါတယ် — ဥပမာ — အရာအားလုံးကို မှတ်မိတဲ့ Snowball dictionary မျိုးပါ။

Ispell ရဲ့ `.affix` file က အောက်ပါ ပုံစံ ရှိပါတယ်:

```sql
prefixes
flag *A:
    .           >   RE      # As in enter > reenter
suffixes
flag T:
    E           >   ST      # As in late > latest
    [^AEIOU]Y   >   -Y,IEST # As in dirty > dirtiest
    [AEIOU]Y    >   EST     # As in gray > grayest
    [^EY]       >   EST     # As in small > smallest
```

ပြီးတော့ `.dict` file က အောက်ပါ ပုံစံ ရှိပါတယ်:

```sql
lapse/ADGRS
lard/DGRS
large/PRTY
lark/MRS
```

`.dict` file ရဲ့ format ကတော့:

```sql
basic_form/affix_class_name
```

`.affix` file ထဲမှာ affix flag တစ်ခုချင်းစီကို အောက်ပါ format နဲ့ ဖော်ပြပါတယ်:

```sql
condition > [-stripping_letters,] adding_affix
```

ဒီမှာ condition က regular expression တွေရဲ့ format နဲ့ ဆင်တူတဲ့ format ရှိပါတယ်။ Grouping `[...]` နဲ့ `[^...]` တွေကို သုံးနိုင်ပါတယ်။ ဥပမာ — `[AEIOU]Y` ဆိုတာ စကားလုံးရဲ့ နောက်ဆုံး စာလုံးက `"y"` ဖြစ်ပြီး — နောက်ဆုံးကနေ ဒုတိယမြောက် စာလုံးက `"a"`, `"e"`, `"i"`, `"o"` ဒါမှမဟုတ် `"u"` ဖြစ်တယ်လို့ ဆိုလိုပါတယ်။ `[^EY]` ဆိုတာ နောက်ဆုံး စာလုံးက `"e"` ရော `"y"` ရော မဟုတ်ဘူးလို့ ဆိုလိုပါတယ်။

Ispell dictionary တွေက compound words (ပေါင်းစပ်ထားသော စကားလုံးများ) ကို ခွဲထုတ်ခြင်းကို ထောက်ပံ့ပါတယ် — အသုံးဝင်တဲ့ feature တစ်ခုပါ။ Affix file ထဲမှာ `compoundwords controlled` statement ကို သုံးပြီး — compound ဖွဲ့စည်းမှုမှာ ပါဝင်နိုင်တဲ့ dictionary စကားလုံးတွေကို အမှတ်အသား လုပ်တဲ့ flag အထူးတစ်ခုကို သတ်မှတ်ပေးရမယ်ဆိုတာ သတိပြုပါ:

```sql
compoundwords  controlled z
```

ဒီမှာ နော်ဝေ (Norwegian) ဘာသာစကားအတွက် ဥပမာတချို့ ဖြစ်ပါတယ်:

```sql
SELECT ts_lexize('norwegian_ispell', 'overbuljongterningpakkmesterassistent');
   {over,buljong,terning,pakk,mester,assistent}
SELECT ts_lexize('norwegian_ispell', 'sjokoladefabrikk');
   {sjokoladefabrikk,sjokolade,fabrikk}
```

MySpell format က Hunspell ရဲ့ အစိတ်အပိုင်းခွဲ (subset) တစ်ခု ဖြစ်ပါတယ်။ Hunspell ရဲ့ `.affix` file က အောက်ပါ ပုံစံ ရှိပါတယ်:

```sql
PFX A Y 1
PFX A   0     re         .
SFX T N 4
SFX T   0     st         e
SFX T   y     iest       [^aeiou]y
SFX T   0     est        [aeiou]y
SFX T   0     est        [^ey]
```

Affix class တစ်ခုရဲ့ ပထမ စာကြောင်းက header (ခေါင်းစီး) ဖြစ်ပါတယ်။ Affix rule တွေရဲ့ fields (ကွက်လပ်များ) တွေကို header ရဲ့ နောက်မှာ စာရင်းပြုစုပါတယ်:

- parameter name (PFX ဒါမှမဟုတ် SFX)
- flag (affix class ရဲ့ နာမည်)
- စကားလုံးရဲ့ အစ (prefix မှာ) ဒါမှမဟုတ် အဆုံး (suffix မှာ) ကနေ ဖယ်ရှားရမယ့် စာလုံးများ (stripping characters)
- ပေါင်းထည့်ရမယ့် affix (adding affix)
- regular expression တွေရဲ့ format နဲ့ ဆင်တူတဲ့ format ရှိတဲ့ condition

`.dict` file ကတော့ Ispell ရဲ့ `.dict` file လိုပဲ ပုံပေါက်ပါတယ်:

```sql
larder/M
lardy/RT
large/RSPMYT
largehearted
```

> **မှတ်ချက်:** MySpell က compound words တွေကို မထောက်ပံ့ပါဘူး။ Hunspell မှာတော့ compound words တွေအတွက် ဆန်းပြားတဲ့ (sophisticated) ထောက်ပံ့မှု ရှိပါတယ်။ လက်ရှိမှာ PostgreSQL က Hunspell ရဲ့ အခြေခံ compound word operation တွေကိုပဲ အကောင်အထည်ဖော်ထားပါတယ်။

### 12.6.6. Snowball Dictionary (Snowball stemming dictionary)

Snowball dictionary template က — အင်္ဂလိပ်ဘာသာအတွက် လူကြိုက်များတဲ့ Porter's stemming algorithm ကို တီထွင်ခဲ့တဲ့ Martin Porter ရဲ့ project တစ်ခုပေါ်မှာ အခြေခံထားပါတယ်။ Snowball က အခုဆိုရင် ဘာသာစကား အများအပြားအတွက် stemming algorithms တွေကို ပံ့ပိုးပေးပါတယ် (အသေးစိတ်ကို [Snowball site](https://snowballstem.org/) မှာ ကြည့်ပါ)။ Algorithm တစ်ခုချင်းစီက — သက်ဆိုင်ရာ ဘာသာစကားအတွင်း စကားလုံးတွေရဲ့ အသုံးများတဲ့ ပုံစံကွဲတွေကို base (အခြေခံ) ဒါမှမဟုတ် stem (ရင်းမြစ်) ပုံစံအဖြစ် ဘယ်လို လျှော့ချရမယ်ဆိုတာ နားလည်ထားပါတယ်။ Snowball dictionary တစ်ခုက — ဘယ် stemmer ကို သုံးမလဲ ဖော်ထုတ်ဖို့ `language` parameter တစ်ခု လိုအပ်ပြီး — ဖယ်ရှားရမယ့် စကားလုံး စာရင်းတစ်ခု ပေးတဲ့ `stopword` file နာမည်ကိုလည်း ရွေးချယ်သတ်မှတ်နိုင်ပါတယ်။ (PostgreSQL ရဲ့ ပုံမှန် stopword lists တွေကိုလည်း Snowball project က ပံ့ပိုးပေးထားပါတယ်။) ဥပမာ — အောက်ပါအတိုင်း ညီမျှတဲ့ built-in definition တစ်ခု ရှိပါတယ်:

```sql
CREATE TEXT SEARCH DICTIONARY english_stem (
    TEMPLATE = snowball,
    Language = english,
    StopWords = english
);
```

Stopword file ရဲ့ format ကတော့ အပေါ်မှာ ရှင်းပြပြီးသား format အတိုင်းပဲ ဖြစ်ပါတယ်။

Snowball dictionary က — စကားလုံးကို ရိုးရှင်းအောင် လုပ်နိုင်လား မလုပ်နိုင်ဘူးလားဆိုတာ မသက်ဆိုင်ဘဲ — အရာအားလုံးကို မှတ်မိတာကြောင့် — dictionary list ရဲ့ အဆုံးမှာ ထားသင့်ပါတယ်။ တခြား dictionary တစ်ခုခုရဲ့ ရှေ့မှာ ထားတာ အသုံးမဝင်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ token တစ်ခုက ၎င်းကို ဖြတ်ပြီး နောက် dictionary ဆီ ဘယ်တော့မှ ရောက်မှာ မဟုတ်လို့ပါ။
