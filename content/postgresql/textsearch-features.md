---
title: "Additional Features (နောက်ထပ် feature များ)"
description: "tsvector/tsquery တန်ဖိုးများကို ကိုင်တွယ်ရန် နောက်ထပ် function နှင့် operator များ — concatenation, setweight, strip, query rewriting, အလိုအလျောက် update triggers နှင့် document statistics စုဆောင်းခြင်း"
order: 89
source: "https://www.postgresql.org/docs/current/textsearch-features.html"
status: translated
updated: 2026-09-03
---

## 12.4. Additional Features (နောက်ထပ် feature များ)

- **12.4.1. Manipulating Documents (document များကို ကိုင်တွယ်ခြင်း)**
- **12.4.2. Manipulating Queries (query များကို ကိုင်တွယ်ခြင်း)**
- **12.4.3. Triggers for Automatic Updates (အလိုအလျောက် update လုပ်ရန် triggers)**
- **12.4.4. Gathering Document Statistics (document statistics စုဆောင်းခြင်း)**

ဒီ section က text search နဲ့ ဆက်စပ်ပြီး အသုံးဝင်တဲ့ နောက်ထပ် function တွေနဲ့ operator တွေအကြောင်း ဖော်ပြပါတယ်။

### 12.4.1. Manipulating Documents (document များကို ကိုင်တွယ်ခြင်း)

[အပိုင်း 12.3.1](/docs/postgresql/textsearch-controls) မှာ — မူရင်း (raw) textual document တွေကို `tsvector` value တွေအဖြစ် ဘယ်လို ပြောင်းလဲနိုင်တယ်ဆိုတာ ပြခဲ့ပါတယ်။ PostgreSQL မှာ `tsvector` ပုံစံဖြစ်နေပြီးသား document တွေကို ကိုင်တွယ်ဖို့ သုံးလို့ရတဲ့ function တွေနဲ့ operator တွေလည်း ပါဝင်ပါတယ်။

- **tsvector || tsvector** — tsvector concatenation operator (ပေါင်းစည်းသည့် operator) က — argument နှစ်ခုအဖြစ် ပေးလိုက်တဲ့ vector နှစ်ခုရဲ့ lexemes (စကားလုံး ပုံစံကွဲများ ပေါင်းစုထားသော ယူနစ်) တွေနဲ့ position အချက်အလက်တွေကို ပေါင်းစပ်ထားတဲ့ vector တစ်ခုကို ပြန်ပေးပါတယ်။ Concatenation လုပ်ချိန်မှာ positions တွေနဲ့ weight အမှတ်အသားတွေကို ထိန်းသိမ်းထားပါတယ်။ ညာဘက် vector ထဲက positions တွေကို — ဘယ်ဘက် vector ထဲမှာ ဖော်ပြထားတဲ့ အကြီးဆုံး position ပေါ်ကို အခြေခံပြီး offset (နေရာရွှေ့ခြင်း) လုပ်လိုက်တဲ့အတွက် — ရလဒ်က မူရင်း document string နှစ်ခုကို concatenate (ပေါင်းစပ်) လုပ်ပြီးမှ `to_tsvector` လုပ်တဲ့ ရလဒ်နဲ့ အနီးစပ်ဆုံး ညီမျှပါတယ်။ (ညီမျှမှုက အတိအကျတော့ မဟုတ်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ ဘယ်ဘက် argument ရဲ့ အဆုံးကနေ ဖယ်လိုက်တဲ့ stop words (ရှာဖွေမှုမှ ဖယ်ထုတ်ထားသော စကားလုံးများ) တွေက ရလဒ်ကို သက်ရောက်မှု မရှိပေမယ့် — text concatenation သုံးခဲ့မယ်ဆိုရင် အဲဒါတွေက ညာဘက် argument ထဲက lexemes တွေရဲ့ positions တွေကို သက်ရောက်စေနိုင်လို့ပါ။)

  `to_tsvector` မလုပ်ခင် text ကို concatenate လုပ်တာထက် — vector ပုံစံနဲ့ concatenation သုံးခြင်းရဲ့ အားသာချက်တစ်ခုက — document ရဲ့ မတူညီတဲ့ အပိုင်းတွေကို parse လုပ်ဖို့ မတူညီတဲ့ configurations တွေကို သုံးလို့ရတာပါ။ ဒါ့အပြင် `setweight` function က ပေးလိုက်တဲ့ vector ရဲ့ lexemes အားလုံးကို တစ်ပုံစံတည်း အမှတ်အသား လုပ်တာကြောင့် — document ရဲ့ မတူညီတဲ့ အပိုင်းတွေကို မတူညီတဲ့ weights တွေနဲ့ အမှတ်အသား လုပ်ချင်ရင် — text ကို parse လုပ်ပြီး concatenate မလုပ်ခင် `setweight` ကို အရင်လုပ်ထားဖို့ လိုပါတယ်။
- **setweight(vector tsvector, weight "char") returns tsvector** — `setweight` က — position တိုင်းကို ပေးထားတဲ့ weight (`A`, `B`, `C` ဒါမှမဟုတ် `D`) တစ်ခုခုနဲ့ အမှတ်အသား လုပ်ထားတဲ့ input vector ရဲ့ မိတ္တူ (copy) တစ်ခုကို ပြန်ပေးပါတယ်။ (`D` က vector အသစ်တွေအတွက် default ဖြစ်လို့ output မှာ ပြသမပေးပါဘူး။) Vector တွေကို concatenate လုပ်တဲ့အခါ ဒီအမှတ်အသားတွေ ထိန်းသိမ်းထားတာကြောင့် — document ရဲ့ မတူညီတဲ့ အပိုင်းတွေက စကားလုံးတွေကို ranking functions တွေက မတူညီတဲ့ weight တွေနဲ့ အလေးချိန် သတ်မှတ်လို့ ရပါတယ်။

  Weight အမှတ်အသားတွေက lexemes တွေကို မဟုတ်ဘဲ positions တွေကို သက်ရောက်တယ်ဆိုတာ သတိပြုပါ။ Input vector ကနေ positions တွေ ဖယ်ထားပြီးသား (stripped) ဖြစ်နေရင် `setweight` က ဘာမှ လုပ်မပေးပါဘူး။
- **length(vector tsvector) returns integer** — Vector ထဲမှာ သိမ်းထားတဲ့ lexemes အရေအတွက်ကို ပြန်ပေးပါတယ်။
- **strip(vector tsvector) returns tsvector** — ပေးလိုက်တဲ့ vector ထဲက lexemes တွေအတိုင်း စာရင်းပြုစုထားပေမယ့် — position ဒါမှမဟုတ် weight အချက်အလက် မပါဝင်တဲ့ vector တစ်ခုကို ပြန်ပေးပါတယ်။ ရလဒ်က ပုံမှန်အားဖြင့် unstripped vector ထက် အများကြီး သေးငယ်ပေမယ့် — အသုံးဝင်မှုကလည်း လျော့နည်းပါတယ်။ Relevance ranking (ဆီလျော်မှုအလိုက် အဆင့်သတ်မှတ်ခြင်း) က stripped vector တွေမှာ unstripped vector တွေလောက် ကောင်းကောင်း အလုပ် မလုပ်ပါဘူး။ ဒါ့အပြင် `<->` (FOLLOWED BY) tsquery operator က — lexeme တွေရဲ့ ဖြစ်ပေါ်မှုကြားက အကွာအဝေးကို ဆုံးဖြတ်လို့ မရတာကြောင့် — stripped input နဲ့ဆိုရင် ဘယ်တော့မှ ကိုက်ညီမှု ရှိမှာ မဟုတ်ပါဘူး။

`tsvector` နဲ့ ဆက်စပ်တဲ့ function တွေရဲ့ အပြည့်အစုံ စာရင်းကို [ဇယား 9.43](https://www.postgresql.org/docs/current/functions-textsearch.html#TEXTSEARCH-FUNCTIONS-TABLE) မှာ ကြည့်ရှုနိုင်ပါတယ်။

### 12.4.2. Manipulating Queries (query များကို ကိုင်တွယ်ခြင်း)

[အပိုင်း 12.3.2](/docs/postgresql/textsearch-controls) မှာ — မူရင်း textual query တွေကို `tsquery` value တွေအဖြစ် ဘယ်လို ပြောင်းလဲနိုင်တယ်ဆိုတာ ပြခဲ့ပါတယ်။ PostgreSQL မှာ `tsquery` ပုံစံဖြစ်နေပြီးသား query တွေကို ကိုင်တွယ်ဖို့ သုံးလို့ရတဲ့ function တွေနဲ့ operator တွေလည်း ပါဝင်ပါတယ်။

- **tsquery && tsquery** — ပေးထားတဲ့ query နှစ်ခုရဲ့ AND ပေါင်းစပ်မှု (AND-combination) ကို ပြန်ပေးပါတယ်။
- **tsquery || tsquery** — ပေးထားတဲ့ query နှစ်ခုရဲ့ OR ပေါင်းစပ်မှုကို ပြန်ပေးပါတယ်။
- **!! tsquery** — ပေးထားတဲ့ query ရဲ့ negation (NOT — ငြင်းပယ်ခြင်း) ကို ပြန်ပေးပါတယ်။
- **tsquery <-> tsquery** — ပထမ query နဲ့ ကိုက်ညီမှု (match) ရှိတဲ့ နေရာရဲ့ နောက်မှာ ချက်ချင်း ဒုတိယ query နဲ့ ကိုက်ညီမှု ရှိတာကို ရှာဖွေပေးမယ့် query တစ်ခုကို — `<->` (FOLLOWED BY) tsquery operator ကို သုံးပြီး — ပြန်ပေးပါတယ်။ ဥပမာ:

```sql
SELECT to_tsquery('fat') <-> to_tsquery('cat | rat');
          ?column?
----------------------------
 'fat' <-> ( 'cat' | 'rat' )
```

- **tsquery_phrase(query1 tsquery, query2 tsquery [, distance integer ]) returns tsquery** — ပထမ query နဲ့ ကိုက်ညီမှု ရှိတဲ့ နေရာရဲ့ နောက်မှာ — အတိအကျ `distance` lexemes အကွာအဝေးမှာ — ဒုတိယ query နဲ့ ကိုက်ညီမှု ရှိတာကို ရှာဖွေပေးမယ့် query တစ်ခုကို — `<N>` tsquery operator ကို သုံးပြီး — ပြန်ပေးပါတယ်။ ဥပမာ:

```sql
SELECT tsquery_phrase(to_tsquery('fat'), to_tsquery('cat'), 10);
  tsquery_phrase
------------------
 'fat' <10> 'cat'
```

- **numnode(query tsquery) returns integer** — tsquery တစ်ခုထဲက node (lexemes တွေ အပေါင်း operator တွေ) အရေအတွက်ကို ပြန်ပေးပါတယ်။ Query က အဓိပ္ပာယ် ရှိမရှိ (0 ထက် ကြီးတဲ့ တန်ဖိုး ပြန်လား) — ဒါမှမဟုတ် stop words တွေပဲ ပါဝင်နေလား (0 ပြန်လား) ဆိုတာ ဆုံးဖြတ်ဖို့ ဒီ function က အသုံးဝင်ပါတယ်။ ဥပမာများ:

```sql
SELECT numnode(plainto_tsquery('the any'));
NOTICE:  query contains only stopword(s) or doesn't contain lexeme(s), ignored
 numnode
---------
       0

SELECT numnode('foo & bar'::tsquery);
 numnode
---------
       3
```

- **querytree(query tsquery) returns text** — Index တစ်ခုကို ရှာဖွေရာမှာ သုံးလို့ရတဲ့ tsquery ရဲ့ အပိုင်းကို ပြန်ပေးပါတယ်။ ဒီ function က — unindexable (index သုံးပြီး မရှာနိုင်သော) query တွေ — ဥပမာ stop words တွေပဲ ပါဝင်တာ ဒါမှမဟုတ် negated (ငြင်းပယ်ထားသော) terms တွေပဲ ပါဝင်တာမျိုး — ကို ရှာဖွေတွေ့ရှိဖို့ အသုံးဝင်ပါတယ်။ ဥပမာ:

```sql
SELECT querytree(to_tsquery('defined'));
 querytree
-----------
 'defin'

SELECT querytree(to_tsquery('!defined'));
 querytree
-----------
 T
```

#### 12.4.2.1. Query Rewriting (query ပြန်ရေးခြင်း)

`ts_rewrite` function မိသားစုက — ပေးထားတဲ့ `tsquery` တစ်ခုထဲမှာ target subquery ပါဝင်တဲ့ နေရာတွေကို ရှာပြီး — ဖြစ်ပေါ်မှု (occurrence) တစ်ခုချင်းစီကို substitute subquery နဲ့ အစားထိုးပါတယ်။ အနှစ်သာရအားဖြင့် ဒီ operation က — substring အစားထိုးခြင်းရဲ့ `tsquery` အတွက် သီးသန့် မူကွဲတစ်မျိုးပဲ ဖြစ်ပါတယ်။ Target နဲ့ substitute တွဲစပ်မှုတစ်ခုကို *query rewrite rule* (query ပြန်ရေး စည်းမျဉ်း) အဖြစ် မှတ်ယူလို့ ရပါတယ်။ ဒီလို rewrite rule တွေ စုစည်းထားတာက — ရှာဖွေမှုအတွက် အစွမ်းထက်တဲ့ အကူအညီတစ်ခု ဖြစ်နိုင်ပါတယ်။ ဥပမာ — synonyms (အဓိပ္ပာယ်တူ စကားလုံးများ) တွေကို သုံးပြီး ရှာဖွေမှုကို ကျယ်ချဲ့နိုင်သလို (ဥပမာ `new york`, `big apple`, `nyc`, `gotham`) — user တွေကို လူကြိုက်များနေတဲ့ အကြောင်းအရာတစ်ခုဆီ ညွှန်ပြဖို့ ရှာဖွေမှုကို ကျဉ်းမြောင်းအောင်လည်း လုပ်နိုင်ပါတယ်။ ဒီ feature နဲ့ thesaurus dictionaries ([အပိုင်း 12.6.4](/docs/postgresql/textsearch-dictionaries)) တို့ကြားမှာ လုပ်ဆောင်ချက်ပိုင်း ထပ်နေမှု အနည်းငယ် ရှိပါတယ်။ ဒါပေမယ့် — rewrite rule အစုတစ်ခုကို reindexing (index ပြန်တည်ဆောက်ခြင်း) မလုပ်ဘဲ ချက်ချင်း ပြုပြင်လို့ ရပေမယ့် — thesaurus တစ်ခုကို update လုပ်ဖို့ကတော့ အကျိုးသက်ရောက်ဖို့ reindexing လိုအပ်ပါတယ်။

- **ts_rewrite (query tsquery, target tsquery, substitute tsquery) returns tsquery** — ဒီ ts_rewrite ပုံစံက rewrite rule တစ်ခုတည်းကိုပဲ ရိုးရှင်းစွာ ကျင့်သုံးပါတယ်: query ထဲမှာ target ပေါ်လာတဲ့ နေရာတိုင်းကို substitute နဲ့ အစားထိုးပါတယ်။ ဥပမာ:

```sql
SELECT ts_rewrite('a & b'::tsquery, 'a'::tsquery, 'c'::tsquery);
 ts_rewrite
------------
 'b' & 'c'
```

- **ts_rewrite (query tsquery, select text) returns tsquery** — ဒီ ts_rewrite ပုံစံက — စတင် query တစ်ခုနဲ့ text string အနေနဲ့ ပေးထားတဲ့ SQL select command တစ်ခုကို လက်ခံပါတယ်။ Select က tsquery type ရဲ့ column နှစ်ခုကို ထုတ်ပေးရပါမယ်။ Select ရလဒ်ရဲ့ row တစ်ခုချင်းစီအတွက် — လက်ရှိ query value ထဲမှာ ပထမ column တန်ဖိုး (target) ပေါ်လာတဲ့ နေရာတိုင်းကို ဒုတိယ column တန်ဖိုး (substitute) နဲ့ အစားထိုးပါတယ်။ ဥပမာ:

```sql
CREATE TABLE aliases (t tsquery PRIMARY KEY, s tsquery);
INSERT INTO aliases VALUES('a', 'c');

SELECT ts_rewrite('a & b'::tsquery, 'SELECT t,s FROM aliases');
 ts_rewrite
------------
 'b' & 'c'
```

ဒီလိုနည်းနဲ့ rewrite rule အများအပြားကို ကျင့်သုံးတဲ့အခါ — ကျင့်သုံးတဲ့ အစီအစဉ်က အရေးကြီးနိုင်တယ်ဆိုတာ သတိပြုပါ; ဒါကြောင့် လက်တွေ့မှာ source query ကို ordering key တစ်ခုခုနဲ့ `ORDER BY` လုပ်ထားစေချင်ပါလိမ့်မယ်။

လက်တွေ့ နက္ခတ္တဗေဒ (astronomical) ဥပမာတစ်ခုကို ကြည့်ကြရအောင်။ Table ကနေ မောင်းနှင်တဲ့ (table-driven) rewrite rules တွေကို သုံးပြီး `supernovae` query ကို ကျယ်ချဲ့ကြည့်ပါမယ်:

```sql
CREATE TABLE aliases (t tsquery primary key, s tsquery);
INSERT INTO aliases VALUES(to_tsquery('supernovae'), to_tsquery('supernovae|sn'));

SELECT ts_rewrite(to_tsquery('supernovae & crab'), 'SELECT * FROM aliases');
           ts_rewrite
---------------------------------
 'crab' & ( 'supernova' | 'sn' )
```

Rewrite rule တွေကို table ကို update လုပ်ရုံနဲ့တင် ပြောင်းလဲလို့ရပါတယ်:

```sql
UPDATE aliases
SET s = to_tsquery('supernovae|sn & !nebulae')
WHERE t = to_tsquery('supernovae');

SELECT ts_rewrite(to_tsquery('supernovae & crab'), 'SELECT * FROM aliases');
                 ts_rewrite
---------------------------------------------
 'crab' & ( 'supernova' | 'sn' & !'nebula' )
```

Rewrite rule တွေ အများကြီး ရှိတဲ့အခါ — rule တစ်ခုချင်းစီမှာ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးတာကြောင့် — rewriting က နှေးကွေးနိုင်ပါတယ်။ သိသာထင်ရှားတဲ့ ကိုယ်စားလှယ်လောင်း (non-candidate) မဟုတ်တဲ့ rule တွေကို စစ်ထုတ်ဖို့ — `tsquery` type ရဲ့ containment operators (ပါဝင်မှု စစ်ဆေးသည့် operator များ) ကို သုံးနိုင်ပါတယ်။ အောက်က ဥပမာမှာ — မူရင်း query နဲ့ ကိုက်ညီနိုင်တဲ့ rule တွေကိုပဲ ရွေးထုတ်ထားပါတယ်:

```sql
SELECT ts_rewrite('a & b'::tsquery,
                  'SELECT t,s FROM aliases WHERE ''a & b''::tsquery @> t');
 ts_rewrite
------------
 'b' & 'c'
```

### 12.4.3. Triggers for Automatic Updates (အလိုအလျောက် update လုပ်ရန် triggers)

> **မှတ်ချက်:** ဒီ section မှာ ဖော်ပြထားတဲ့ နည်းလမ်းက — [အပိုင်း 12.2.2](/docs/postgresql/textsearch-tables) မှာ ဖော်ပြထားတဲ့အတိုင်း — stored generated columns တွေ သုံးခြင်းကြောင့် အသုံးမလိုတော့ဘဲ (obsoleted) ဖြစ်သွားပါပြီ။

Document တွေရဲ့ `tsvector` ကိုယ်စားပြုမှုကို သီးခြား column တစ်ခုမှာ သိမ်းတဲ့အခါ — document content column တွေ ပြောင်းလဲတဲ့အခါ `tsvector` column ကို update လုပ်ဖို့ trigger (ဖြစ်ရပ် တစ်ခုပေါ်မှာ အလိုအလျောက် လုပ်ဆောင်ပေးသော ယန္တရား) တစ်ခု ဖန်တီးဖို့ လိုအပ်ပါတယ်။ ဒီအတွက် built-in trigger function နှစ်ခု ရနိုင်ပြီး — ကိုယ်တိုင်လည်း ရေးလို့ရပါတယ်။

```sql
tsvector_update_trigger(tsvector_column_name,​ config_name, text_column_name [, ... ])
tsvector_update_trigger_column(tsvector_column_name,​ config_column_name, text_column_name [, ... ])
```

ဒီ trigger function တွေက — `CREATE TRIGGER` command ထဲမှာ သတ်မှတ်ထားတဲ့ parameters တွေရဲ့ ထိန်းချုပ်မှုအောက်မှာ — textual column တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုကနေ `tsvector` column တစ်ခုကို အလိုအလျောက် တွက်ချက်ပေးပါတယ်။ သုံးပုံ ဥပမာတစ်ခုကတော့:

```sql
CREATE TABLE messages (
    title       text,
    body        text,
    tsv         tsvector
);

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON messages FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(tsv, 'pg_catalog.english', title, body);

INSERT INTO messages VALUES('title here', 'the body text is here');

SELECT * FROM messages;
   title    |         body          |            tsv
------------+-----------------------+----------------------------
 title here | the body text is here | 'bodi':4 'text':5 'titl':1

SELECT title, body FROM messages WHERE tsv @@ to_tsquery('title & body');
   title    |         body
------------+-----------------------
 title here | the body text is here
```

ဒီ trigger ကို ဖန်တီးပြီးတာနဲ့ — `title` ဒါမှမဟုတ် `body` မှာ ပြောင်းလဲမှု တစ်ခုခု ဖြစ်ရင် — application အနေနဲ့ ကိုယ်တိုင် စိတ်ပူစရာ မလိုဘဲ — `tsv` ထဲမှာ အလိုအလျောက် ထင်ဟပ်သွားပါတယ်။

Trigger ရဲ့ ပထမ argument က update လုပ်ရမယ့် `tsvector` column ရဲ့ နာမည် ဖြစ်ရပါမယ်။ ဒုတိယ argument က — ပြောင်းလဲခြင်း (conversion) လုပ်ဖို့ သုံးရမယ့် text search configuration ကို သတ်မှတ်ပါတယ်။ `tsvector_update_trigger` အတွက်ဆိုရင် — configuration နာမည်ကို ဒုတိယ trigger argument အဖြစ် ရိုးရိုး ပေးရုံပါပဲ။ Trigger ရဲ့ အပြုအမူက `search_path` ပြောင်းလဲမှုတွေနဲ့ မပြောင်းလဲစေဖို့ — အပေါ်မှာ ပြထားသလို schema-qualified (schema နဲ့ တွဲဖော်ပြထားသော) ဖြစ်ရပါမယ်။ `tsvector_update_trigger_column` အတွက်ဆိုရင် — ဒုတိယ trigger argument က `regconfig` type ဖြစ်ရမယ့် တခြား table column တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ ဒါက row တစ်ခုချင်းစီအလိုက် configuration ရွေးချယ်လို့ ရစေပါတယ်။ ကျန်တဲ့ argument(များ) ကတော့ textual column တွေ (`text`, `varchar`, ဒါမှမဟုတ် `char` type) ရဲ့ နာမည်တွေ ဖြစ်ပါတယ်။ ဒါတွေကို ပေးထားတဲ့ အစီအစဉ်အတိုင်း document ထဲမှာ ထည့်သွင်းပါတယ်။ NULL တန်ဖိုးတွေကိုတော့ ကျော်သွားမှာ ဖြစ်ပေမယ့် (ကျန်တဲ့ column တွေကတော့ index လုပ်ခံရဆဲ ဖြစ်ပါတယ်)။

ဒီ built-in trigger တွေရဲ့ ကန့်သတ်ချက်တစ်ခုက — input column အားလုံးကို တစ်ပုံစံတည်း သဘောထားတာပါ။ Column တွေကို မတူညီအောင် process လုပ်ဖို့ — ဥပမာ title ကို body နဲ့ မတူတဲ့ weight ပေးဖို့ — ဆိုရင် ကိုယ်ပိုင် custom trigger တစ်ခု ရေးဖို့ လိုပါတယ်။ PL/pgSQL ကို trigger language အဖြစ် သုံးထားတဲ့ ဥပမာတစ်ခုက:

```
CREATE FUNCTION messages_trigger() RETURNS trigger AS $$
begin
  new.tsv :=
     setweight(to_tsvector('pg_catalog.english', coalesce(new.title,'')), 'A') ||
     setweight(to_tsvector('pg_catalog.english', coalesce(new.body,'')), 'D');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON messages FOR EACH ROW EXECUTE FUNCTION messages_trigger();
```

Trigger တွေထဲမှာ `tsvector` value တွေ ဖန်တီးတဲ့အခါ — column ရဲ့ အကြောင်းအရာတွေ `default_text_search_config` ပြောင်းလဲမှုတွေရဲ့ သက်ရောက်မှု မခံရစေဖို့ — configuration နာမည်ကို ရှင်းလင်းစွာ (explicitly) သတ်မှတ်ဖို့ အရေးကြီးတယ်ဆိုတာ သတိပြုထားပါ။ ဒီလို မလုပ်ပါက — dump နဲ့ restore လုပ်ပြီးနောက်မှာ search results တွေ ပြောင်းလဲသွားတာမျိုး ပြဿနာတွေ ဖြစ်နိုင်ခြေ များပါတယ်။

### 12.4.4. Gathering Document Statistics (document statistics စုဆောင်းခြင်း)

`ts_stat` function က — ကိုယ့် configuration ကို စစ်ဆေးဖို့နဲ့ stop-word ကိုယ်စားလှယ်လောင်း (candidate) တွေ ရှာဖွေဖို့ အသုံးဝင်ပါတယ်။

```sql
ts_stat(sqlquery text, [ weights text, ]
        OUT word text, OUT ndoc integer,
        OUT nentry integer) returns setof record
```

`sqlquery` က — `tsvector` column တစ်ခုတည်းကို ပြန်ပေးရမယ့် SQL query တစ်ခု ပါဝင်တဲ့ text value တစ်ခု ဖြစ်ပါတယ်။ `ts_stat` က query ကို run လုပ်ပြီး — `tsvector` data ထဲမှာ ပါဝင်တဲ့ ထူးခြားတဲ့ (distinct) lexeme (စကားလုံး) တစ်ခုချင်းစီအကြောင်း statistics တွေကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ column တွေကတော့

- word text — lexeme တစ်ခုရဲ့ တန်ဖိုး
- ndoc integer — စကားလုံး ပါဝင်ခဲ့တဲ့ document (tsvectors) အရေအတွက်
- nentry integer — စကားလုံးရဲ့ စုစုပေါင်း ဖြစ်ပေါ်မှု အရေအတွက်

`weights` ကို ပေးထားရင် — အဲဒီ weights တွေထဲက တစ်ခုခု ရှိတဲ့ ဖြစ်ပေါ်မှုတွေကိုပဲ ရေတွက်ပါတယ်။

ဥပမာ — document အစုတစ်ခုထဲမှာ အသုံးအများဆုံး စကားလုံး ဆယ်လုံးကို ရှာဖွေဖို့ဆိုရင်:

```sql
SELECT * FROM ts_stat('SELECT vector FROM apod')
ORDER BY nentry DESC, ndoc DESC, word
LIMIT 10;
```

အပေါ်အတိုင်းပဲ — ဒါပေမယ့် `A` ဒါမှမဟုတ် `B` weight ရှိတဲ့ စကားလုံး ဖြစ်ပေါ်မှုတွေကိုပဲ ရေတွက်မယ်ဆိုရင်:

```sql
SELECT * FROM ts_stat('SELECT vector FROM apod', 'ab')
ORDER BY nentry DESC, ndoc DESC, word
LIMIT 10;
```
