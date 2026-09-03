---
title: "Tables and Indexes (table နဲ့ index များ)"
description: "Table data တွေကို full text search လုပ်ခြင်း — index မပါဘဲ ရှာဖွေခြင်း၊ GIN index များ ဖန်တီးခြင်းနဲ့ expression index / သီးခြား tsvector column ချဉ်းကပ်နည်း နှစ်မျိုး"
order: 87
source: "https://www.postgresql.org/docs/current/textsearch-tables.html"
status: translated
updated: 2026-09-03
---

## 12.2. Tables and Indexes (table နဲ့ index များ)

- **12.2.1. Searching a Table (table တစ်ခုထဲမှာ ရှာဖွေခြင်း)**
- **12.2.2. Creating Indexes (index များ ဖန်တီးခြင်း)**

အရင် section က ဥပမာတွေက — ရိုးရှင်းတဲ့ constant strings တွေကို သုံးပြီး full text matching ကို သရုပ်ပြခဲ့ပါတယ်။ ဒီ section မှာတော့ — လိုအပ်ရင် index တွေကိုပါ သုံးပြီး — table data တွေကို ဘယ်လို ရှာဖွေမလဲဆိုတာ ပြပါမယ်။

### 12.2.1. Searching a Table (table တစ်ခုထဲမှာ ရှာဖွေခြင်း)

Index မပါဘဲလည်း full text search လုပ်လို့ ရပါတယ်။ `body` field ထဲမှာ `friend` ဆိုတဲ့ စကားလုံး ပါဝင်တဲ့ row တစ်ခုချင်းစီရဲ့ `title` ကို ထုတ်ပြမယ့် ရိုးရှင်းတဲ့ query တစ်ခုကတော့:

```sql
SELECT title
FROM pgweb
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'friend');
```

ဒါက `friends` နဲ့ `friendly` လို ဆက်စပ် စကားလုံးတွေကိုပါ တွေ့ရှိစေပါတယ် — အကြောင်းကတော့ ၎င်းတို့ အားလုံးကို normalized lexeme တစ်ခုတည်းအဖြစ် လျှော့ချလိုက်လို့ပါ။

အပေါ်က query က strings တွေကို parse လုပ်ပြီး normalize လုပ်ဖို့ `english` configuration ကို သုံးမယ်လို့ သတ်မှတ်ထားပါတယ်။ တနည်းအားဖြင့် — configuration parameter တွေကို ချန်လှပ်လိုက်လို့လည်း ရပါတယ်:

```sql
SELECT title
FROM pgweb
WHERE to_tsvector(body) @@ to_tsquery('friend');
```

ဒီ query ကတော့ [default_text_search_config](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TEXT-SEARCH-CONFIG) နဲ့ သတ်မှတ်ထားတဲ့ configuration ကို အသုံးပြုပါလိမ့်မယ်။

ပိုပြီး ရှုပ်ထွေးတဲ့ ဥပမာ တစ်ခုကတော့ — `title` ဒါမှမဟုတ် `body` ထဲမှာ `create` နဲ့ `table` ပါဝင်တဲ့ — အသစ်ဆုံး document ဆယ်ခုကို ရွေးထုတ်တာ ဖြစ်ပါတယ်:

```sql
SELECT title
FROM pgweb
WHERE to_tsvector(title || ' ' || body) @@ to_tsquery('create & table')
ORDER BY last_mod_date DESC
LIMIT 10;
```

ရှင်းလင်းမှု အတွက် — field နှစ်ခုထဲက တစ်ခုမှာ `NULL` ပါဝင်တဲ့ row တွေကိုပါ တွေ့ရှိဖို့ လိုအပ်မယ့် `coalesce` function calls တွေကို ဒီမှာ ချန်လှပ်ထားပါတယ်။

ဒီ queries တွေက index မပါဘဲလည်း အလုပ်လုပ်နိုင်ပေမယ့် — ရံဖန်ရံခါ ad-hoc (ကြိုတင် စီစဉ်မထားသော) ရှာဖွေမှုတွေ ကလွဲလို့ — application အများစုအတွက်တော့ ဒီနည်းလမ်းက အလွန် နှေးလွန်းတာကို တွေ့ရပါလိမ့်မယ်။ Text searching ကို လက်တွေ့ ကျကျ သုံးဖို့ဆိုရင် ပုံမှန်အားဖြင့် index တစ်ခု ဖန်တီးဖို့ လိုအပ်ပါတယ်။

### 12.2.2. Creating Indexes (index များ ဖန်တီးခြင်း)

Text searches တွေ မြန်ဆန်စေဖို့ GIN index တစ်ခု ([အပိုင်း 12.9](/docs/postgresql/textsearch-indexes)) ဖန်တီးနိုင်ပါတယ်:

```sql
CREATE INDEX pgweb_idx ON pgweb USING GIN (to_tsvector('english', body));
```

ဒီမှာ `to_tsvector` ရဲ့ argument နှစ်ခု ပါတဲ့ (2-argument) မူကွဲကို သုံးထားတာ သတိပြုပါ။ Configuration နာမည် တစ်ခုကို သတ်မှတ်ပေးတဲ့ text search functions တွေသာ expression indexes ([အပိုင်း 11.7](/docs/postgresql/indexes-expressional)) တွေမှာ သုံးနိုင်ပါတယ်။ အကြောင်းကတော့ — index ရဲ့ ပါဝင်မှု (index contents) တွေက [default_text_search_config](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TEXT-SEARCH-CONFIG) ရဲ့ သက်ရောက်မှု ကင်းရှင်းနေရလို့ပါ။ သက်ရောက်မှု ရှိခဲ့မယ်ဆိုရင် — entry တစ်ခုချင်းစီက မတူညီတဲ့ text search configurations တွေနဲ့ ဖန်တီးထားတဲ့ `tsvector` တွေ ပါဝင်နေနိုင်ပြီး — ဘယ်ဟာက ဘယ် configuration နဲ့ ဖန်တီးထားလဲဆိုတာ ခန့်မှန်းဖို့ နည်းလမ်း လုံးဝ မရှိတာကြောင့် — index ရဲ့ ပါဝင်မှုတွေက မညီမညွတ် (inconsistent) ဖြစ်သွားနိုင်ပါတယ်။ အဲဒီလို index တစ်ခုကို dump လုပ်ပြီး restore လုပ်တာကလည်း မှန်ကန်စွာ မဖြစ်နိုင်ပါဘူး။

အပေါ်က index မှာ `to_tsvector` ရဲ့ argument နှစ်ခု မူကွဲကို သုံးထားတာကြောင့် — configuration နာမည် တစ်ခုတည်းနဲ့ `to_tsvector` ရဲ့ argument နှစ်ခု မူကွဲကို သုံးထားတဲ့ query reference တွေသာ အဲဒီ index ကို အသုံးပြုနိုင်ပါတယ်။ ဆိုလိုတာက — `WHERE to_tsvector('english', body) @@ 'a & b'` က index ကို သုံးနိုင်ပေမယ့် — `WHERE to_tsvector(body) @@ 'a & b'` ကတော့ မသုံးနိုင်ပါဘူး။ ဒါက index တစ်ခုကို — index entries တွေ ဖန်တီးတုန်းက သုံးခဲ့တဲ့ configuration နဲ့ တစ်ခုတည်းသာ အသုံးပြုနိုင်အောင် အာမခံပေးပါတယ်။

Configuration နာမည်ကို တခြား column တစ်ခုက သတ်မှတ်ပေးတဲ့ — ပိုပြီး ရှုပ်ထွေးတဲ့ expression indexes တွေကိုလည်း တည်ဆောက်နိုင်ပါတယ်၊ ဥပမာ:

```sql
CREATE INDEX pgweb_idx ON pgweb USING GIN (to_tsvector(config_name, body));
```

ဒီမှာ `config_name` က `pgweb` table ထဲက column တစ်ခု ဖြစ်ပါတယ်။ ဒါက index entry တစ်ခုချင်းစီအတွက် ဘယ် configuration ကို သုံးခဲ့လဲဆိုတာ မှတ်တမ်းတင်ထားရင်း — index တစ်ခုတည်းအတွင်းမှာ configurations အမျိုးမျိုး ရောနှော အသုံးပြုနိုင်စေပါတယ်။ ဥပမာ — document အစုအဝေး (collection) ထဲမှာ ဘာသာစကား အမျိုးမျိုးနဲ့ ရေးထားတဲ့ documents တွေ ပါဝင်နေမယ်ဆိုရင် ဒါက အသုံးဝင်ပါလိမ့်မယ်။ ထပ်ပြောရရင် — index ကို သုံးဖို့ ရည်ရွယ်ထားတဲ့ queries တွေကလည်း — ဥပမာ — `WHERE to_tsvector(config_name, body) @@ 'a & b'` လိုမျိုး — ကိုက်ညီအောင် ရေးဖွဲ့ထားရပါမယ်။

Index တွေက column တွေကို concatenate (ပေါင်းစပ်) လုပ်တာတောင် လုပ်နိုင်ပါတယ်:

```sql
CREATE INDEX pgweb_idx ON pgweb USING GIN (to_tsvector('english', title || ' ' || body));
```

နောက်ထပ် ချဉ်းကပ်နည်း (approach) တစ်ခုကတော့ — `to_tsvector` ရဲ့ output ကို သိမ်းထားဖို့ သီးခြား `tsvector` column တစ်ခု ဖန်တီးတာ ဖြစ်ပါတယ်။ ဒီ column ကို ၎င်းရဲ့ မူရင်း data (source data) နဲ့ အလိုအလျောက် တစ်ပြေးညီ နေစေဖို့ — stored generated column (သိမ်းဆည်းထားသော generated column) တစ်ခုကို သုံးပါ။ ဒီဥပမာက `title` နဲ့ `body` ရဲ့ concatenation ဖြစ်ပြီး — field တစ်ခုက `NULL` ဖြစ်နေရင်တောင် — ကျန်တဲ့ တစ်ခုကို index လုပ်နိုင်သေးအောင် `coalesce` ကို အသုံးပြုထားပါတယ်:

```sql
ALTER TABLE pgweb
    ADD COLUMN textsearchable_index_col tsvector
               GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))) STORED;
```

ပြီးရင် ရှာဖွေမှု မြန်ဆန်စေဖို့ GIN index တစ်ခု ဖန်တီးပါတယ်:

```sql
CREATE INDEX textsearch_idx ON pgweb USING GIN (textsearchable_index_col);
```

အခုဆိုရင် မြန်ဆန်တဲ့ full text search တစ်ခုကို လုပ်ဆောင်ဖို့ အသင့် ဖြစ်နေပါပြီ:

```sql
SELECT title
FROM pgweb
WHERE textsearchable_index_col @@ to_tsquery('create & table')
ORDER BY last_mod_date DESC
LIMIT 10;
```

Expression index တစ်ခုနဲ့ ယှဉ်ရင် သီးခြား column ချဉ်းကပ်နည်းရဲ့ အားသာချက် တစ်ခုကတော့ — index ကို အသုံးပြုဖို့အတွက် query တွေထဲမှာ text search configuration ကို အတိအကျ သတ်မှတ်စရာ မလိုတာ ဖြစ်ပါတယ်။ အပေါ်က ဥပမာမှာ ပြထားတဲ့အတိုင်း — query က `default_text_search_config` ပေါ်မှာ မှီခိုနိုင်ပါတယ်။ နောက် အားသာချက် တစ်ခုကတော့ — index match တွေကို စစ်ဆေးဖို့ `to_tsvector` calls တွေကို ပြန်လုပ်စရာ မလိုတဲ့အတွက် — ရှာဖွေမှုတွေ ပိုမြန်ဆန်လာတာ ဖြစ်ပါတယ်။ (ဒါက GIN index ထက် GiST index ကို သုံးတဲ့အခါ ပိုအရေးကြီးပါတယ် — [အပိုင်း 12.9](/docs/postgresql/textsearch-indexes) ကို ကြည့်ပါ။) ဒါပေမယ့် — expression-index ချဉ်းကပ်နည်းကတော့ တည်ဆောက်ရတာ ပိုရိုးရှင်းပြီး — `tsvector` ကိုယ်စားပြုမှုကို သီးခြား သိမ်းဆည်းမထားတဲ့အတွက် — disk space (သိုလှောင်မှု နေရာ) လည်း ပိုနည်းပါးစွာ လိုအပ်ပါတယ်။
