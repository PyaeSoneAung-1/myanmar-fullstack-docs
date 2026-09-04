---
title: "Controlling Text Search (text search ထိန်းချုပ်ခြင်း)"
description: "Full text search ထိန်းချုပ်ခြင်း — document နှင့် query များကို parse လုပ်ခြင်း၊ ts_rank/ts_rank_cd ဖြင့် search result များ အဆင့်သတ်မှတ်ခြင်း၊ ts_headline ဖြင့် highlight ပြုလုပ်ခြင်း"
order: 119
source: "https://www.postgresql.org/docs/current/textsearch-controls.html"
status: translated
updated: 2026-09-03
---

## 12.3. Controlling Text Search (text search ထိန်းချုပ်ခြင်း)

- **12.3.1. Parsing Documents (document များကို parse လုပ်ခြင်း)**
- **12.3.2. Parsing Queries (query များကို parse လုပ်ခြင်း)**
- **12.3.3. Ranking Search Results (search result များကို အဆင့်သတ်မှတ်ခြင်း)**
- **12.3.4. Highlighting Results (ရလဒ်များကို highlight ပြုလုပ်ခြင်း)**

Full text search (စာသား အပြည့်အစုံ ရှာဖွေမှု) ကို အကောင်အထည် ဖော်နိုင်ဖို့ဆိုရင် — document တစ်ခုကနေ `tsvector` ကို ဖန်တီးပေးတဲ့ function တစ်ခုနဲ့ — user ရဲ့ query တစ်ခုကနေ `tsquery` ကို ဖန်တီးပေးတဲ့ function တစ်ခု ရှိရပါမယ်။ ဒါ့အပြင် — result တွေကို အသုံးဝင်တဲ့ အစီအစဉ်နဲ့ ပြန်ပေးနိုင်ဖို့ — document တွေကို query နဲ့ ဆက်စပ်မှု (relevance) အရ နှိုင်းယှဉ်ပေးတဲ့ function တစ်ခုလည်း လိုအပ်ပါတယ်။ Result တွေကို ကောင်းမွန်စွာ ပြသနိုင်ဖို့ကလည်း အရေးကြီးပါတယ်။ ဒီ function တွေ အားလုံးအတွက် PostgreSQL က ပံ့ပိုးမှု ပေးထားပါတယ်။

### 12.3.1. Parsing Documents (document များကို parse လုပ်ခြင်း)

PostgreSQL က document တစ်ခုကို `tsvector` data type အဖြစ် ပြောင်းလဲဖို့အတွက် `to_tsvector` ဆိုတဲ့ function ကို ပံ့ပိုးပေးပါတယ်။

```sql
to_tsvector([ config regconfig, ] document text) returns tsvector
```

`to_tsvector` က စာသား document တစ်ခုကို token တွေအဖြစ် parse လုပ်ပြီး — token တွေကို lexeme တွေအဖြစ် လျှော့ချကာ — document ထဲမှာ သူတို့ရဲ့ တည်နေရာ (position) တွေနဲ့အတူ lexeme တွေကို စာရင်းပြုစုထားတဲ့ `tsvector` တစ်ခုကို ပြန်ပေးပါတယ်။ Document ကို သတ်မှတ်ထားတဲ့ (သို့) ပုံသေ text search configuration အတိုင်း process လုပ်ပါတယ်။ ရိုးရှင်းတဲ့ ဥပမာ တစ်ခု ကြည့်ကြရအောင် —

```sql
SELECT to_tsvector('english', 'a fat  cat sat on a mat - it ate a fat rats');
                  to_tsvector
-----------------------------------------------------
 'ate':9 'cat':3 'fat':2,11 'mat':7 'rat':12 'sat':4
```

အပေါ်က ဥပမာမှာ — ရလာတဲ့ `tsvector` ထဲမှာ `a`၊ `on` နဲ့ `it` ဆိုတဲ့ စကားလုံးတွေ မပါဝင်တာကို တွေ့ရပြီး — `rats` ဆိုတဲ့ စကားလုံးက `rat` ဖြစ်သွားကာ — `-` ဆိုတဲ့ ပုဒ်ဖြတ် သင်္ကေတ (punctuation sign) ကိုတော့ လျစ်လျူရှုလိုက်ပါတယ်။

`to_tsvector` function က အတွင်းပိုင်းမှာ parser တစ်ခုကို ခေါ်ယူပြီး — အဲဒီ parser က document ရဲ့ စာသားကို token တွေအဖြစ် ခွဲထုတ်ကာ token တစ်ခုချင်းစီအတွက် type တစ်ခု သတ်မှတ်ပေးပါတယ်။ Token တစ်ခုချင်းစီအတွက် — dictionary စာရင်း ([အပိုင်း 12.6](/docs/postgresql/textsearch-dictionaries)) တစ်ခုကို တိုင်ပင်ဆွေးနွေးပြီး — အဲဒီစာရင်းက token ရဲ့ type ပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။ Token ကို *recognize* (မှတ်မိ) လုပ်နိုင်တဲ့ ပထမဆုံး dictionary က — အဲဒီ token ကို ကိုယ်စားပြုဖို့ *lexeme* (စကားလုံး ပုံစံကွဲများ ပေါင်းစုထားသော ယူနစ်) တစ်ခု ဒါမှမဟုတ် အများအပြားကို normalized (စံပုံစံ ပြုပြီးသား) အနေနဲ့ ထုတ်ပေးပါတယ်။ ဥပမာ — dictionary တစ်ခုက `rats` ဆိုတဲ့ စကားလုံးဟာ `rat` ရဲ့ အများကိန်း ပုံစံ ဖြစ်တာကို မှတ်မိလို့ `rats` က `rat` ဖြစ်သွားတာ ဖြစ်ပါတယ်။ စကားလုံး တချို့ကို *stop words* (ရှာဖွေမှုမှာ အသုံးမဝင်လောက်အောင် မကြာခဏ ပေါ်နေတဲ့ စကားလုံးများ) ([အပိုင်း 12.6.1](/docs/postgresql/textsearch-dictionaries)) အဖြစ် မှတ်မိပြီး — ဒါတွေကို လျစ်လျူရှုပါတယ်။ ဒီဥပမာထဲမှာတော့ ဒါတွေက `a`၊ `on` နဲ့ `it` ပဲ ဖြစ်ပါတယ်။ စာရင်းထဲက dictionary တစ်ခုမှ token ကို မမှတ်မိဘူးဆိုရင်လည်း အဲဒီ token ကို လျစ်လျူရှုပါတယ်။ ဒီဥပမာထဲမှာ `-` ဆိုတဲ့ ပုဒ်ဖြတ် သင်္ကေတက အဲဒီလို ဖြစ်သွားတာပါ — အကြောင်းကတော့ သူ့ရဲ့ token type (`Space symbols`) အတွက် dictionary တွေ သတ်မှတ်ထားခြင်း မရှိတာကြောင့် — space token တွေကို ဘယ်တော့မှ index လုပ်မှာ မဟုတ်ပါဘူး။ Parser ၊ dictionary တွေနဲ့ ဘယ် token type တွေကို index လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုတွေကို — ရွေးထားတဲ့ text search configuration ([အပိုင်း 12.7](/docs/postgresql/textsearch-configuration)) ကနေ ဆုံးဖြတ်ပါတယ်။ Database တစ်ခုတည်းထဲမှာတင် configuration အများအပြား ရှိနိုင်ပြီး — ဘာသာစကား အမျိုးမျိုးအတွက် ကြိုတင် သတ်မှတ်ထားတဲ့ configuration တွေလည်း ရရှိနိုင်ပါတယ်။ ဒီဥပမာမှာတော့ အင်္ဂလိပ် ဘာသာစကားအတွက် ပုံသေ configuration ဖြစ်တဲ့ `english` ကို သုံးထားပါတယ်။

`setweight` function ကို သုံးပြီး `tsvector` ထဲက entry တွေကို သတ်မှတ်ထားတဲ့ *weight* (အလေးချိန် အဆင့်) တစ်ခုနဲ့ တံဆိပ်ကပ် (label) လုပ်နိုင်ပါတယ် — weight ဆိုတာ `A`၊ `B`၊ `C` ဒါမှမဟုတ် `D` ဆိုတဲ့ စာလုံးတွေထဲက တစ်ခု ဖြစ်ပါတယ်။ ဒါကို ပုံမှန်အားဖြင့် — document ရဲ့ မတူညီတဲ့ အပိုင်းတွေကနေ လာတဲ့ entry တွေကို မှတ်သားဖို့ သုံးပါတယ် — ဥပမာ ခေါင်းစဉ် (title) နဲ့ ကိုယ်ထည် (body) လိုမျိုးပါ။ နောက်ပိုင်းမှာ ဒီအချက်အလက်ကို search result တွေရဲ့ ranking (အဆင့်သတ်မှတ်ခြင်း) အတွက် သုံးနိုင်ပါတယ်။

`to_tsvector`(`NULL`) က `NULL` ကို ပြန်ပေးမှာ ဖြစ်တဲ့အတွက် — field တစ်ခု null ဖြစ်နိုင်တဲ့ အခါတိုင်း `coalesce` ကို သုံးဖို့ အကြံပြုထားပါတယ်။ Structured document (ဖွဲ့စည်းပုံ ရှိသော စာတမ်း) တစ်ခုကနေ `tsvector` ဖန်တီးဖို့အတွက် အကြံပြုထားတဲ့ နည်းလမ်းက ဒီလိုပါ —

```sql
UPDATE tt SET ti =
    setweight(to_tsvector(coalesce(title,'')), 'A')    ||
    setweight(to_tsvector(coalesce(keyword,'')), 'B')  ||
    setweight(to_tsvector(coalesce(abstract,'')), 'C') ||
    setweight(to_tsvector(coalesce(body,'')), 'D');
```

ဒီမှာတော့ `setweight` ကို သုံးပြီး — ပြီးစီးတဲ့ `tsvector` ထဲက lexeme တစ်ခုချင်းစီရဲ့ ရင်းမြစ် (source) ကို တံဆိပ်ကပ်ထားပြီး — `tsvector` concatenation operator ဖြစ်တဲ့ `||` ကို သုံးကာ တံဆိပ်ကပ်ထားတဲ့ `tsvector` တန်ဖိုးတွေကို ပေါင်းစည်းထားပါတယ်။ ([အပိုင်း 12.4.1](/docs/postgresql/textsearch-features) မှာ ဒီ operation တွေရဲ့ အသေးစိတ်ကို ဖော်ပြထားပါတယ်။)

### 12.3.2. Parsing Queries (query များကို parse လုပ်ခြင်း)

PostgreSQL က query တစ်ခုကို `tsquery` data type အဖြစ် ပြောင်းလဲဖို့အတွက် `to_tsquery`၊ `plainto_tsquery`၊ `phraseto_tsquery` နဲ့ `websearch_to_tsquery` ဆိုတဲ့ function တွေကို ပံ့ပိုးပေးပါတယ်။ `to_tsquery` က `plainto_tsquery` ဒါမှမဟုတ် `phraseto_tsquery` ထက် feature တွေ ပိုပြီး သုံးခွင့်ပေးပေမယ့် — input နဲ့ ပတ်သက်ရင် ပိုပြီး တင်းကျပ်ပါတယ်။ `websearch_to_tsquery` ကတော့ — web search engine တွေ သုံးတဲ့ syntax နဲ့ ဆင်တူတဲ့ အခြားရွေးချယ်စရာ syntax (alternative syntax) တစ်ခု ပါဝင်တဲ့ `to_tsquery` ရဲ့ ရိုးရှင်းတဲ့ ဗားရှင်း (version) တစ်ခု ဖြစ်ပါတယ်။

```sql
to_tsquery([ config regconfig, ] querytext text) returns tsquery
```

`to_tsquery` က `querytext` ကနေ `tsquery` တန်ဖိုး တစ်ခုကို ဖန်တီးပါတယ် — `querytext` ထဲမှာ `tsquery` operator တွေဖြစ်တဲ့ `&` (AND)၊ `|` (OR)၊ `!` (NOT) နဲ့ `<->` (FOLLOWED BY) တို့နဲ့ ခြားထားတဲ့ token တစ်ခုချင်းစီ (single token) တွေ ပါဝင်ရပြီး — parentheses နဲ့ အုပ်စုဖွဲ့ထားတာလည်း ဖြစ်နိုင်ပါတယ်။ တစ်နည်းပြောရရင် — `to_tsquery` ရဲ့ input က [အပိုင်း 8.11.2](/docs/postgresql/datatype-textsearch) မှာ ဖော်ပြထားတဲ့အတိုင်း — `tsquery` input ရဲ့ ယေဘုယျ စည်းမျဉ်းတွေကို ကြိုတင် လိုက်နာထားရပါတယ်။ ကွာခြားချက်ကတော့ — အခြေခံ `tsquery` input က token တွေကို မူရင်းအတိုင်း လက်ခံပေမယ့် — `to_tsquery` ကတော့ သတ်မှတ်ထားတဲ့ (သို့) ပုံသေ configuration ကို သုံးပြီး token တစ်ခုချင်းစီကို lexeme အဖြစ် normalize လုပ်ကာ — configuration အရ stop words ဖြစ်နေတဲ့ token တွေကိုတော့ ဖယ်ပစ်လိုက်ပါတယ်။ ဥပမာ —

```sql
SELECT to_tsquery('english', 'The & Fat & Rats');
  to_tsquery
---------------
 'fat' & 'rat'
```

အခြေခံ `tsquery` input မှာလိုပဲ — lexeme တစ်ခုချင်းစီမှာ weight တွေ ထည့်တွဲပြီး — အဲဒီ weight တွေနဲ့ ကိုက်ညီတဲ့ `tsvector` lexeme တွေကိုပဲ match လုပ်စေဖို့ ကန့်သတ်နိုင်ပါတယ်။ ဥပမာ —

```sql
SELECT to_tsquery('english', 'Fat | Rats:AB');
    to_tsquery
------------------
 'fat' | 'rat':AB
```

ဒါ့အပြင် — prefix matching (ရှေ့ဆက်စာသား ကိုက်ညီမှု) ကို သတ်မှတ်ဖို့ lexeme တစ်ခုမှာ `*` ကိုလည်း ထည့်တွဲနိုင်ပါတယ် —

```sql
SELECT to_tsquery('supern:*A & star:A*B');
        to_tsquery
--------------------------
 'supern':*A & 'star':*AB
```

ဒီလို lexeme တစ်ခုက — `tsvector` ထဲမှာ ပေးထားတဲ့ string နဲ့ စတင်တဲ့ စကားလုံး မှန်သမျှနဲ့ ကိုက်ညီပါလိမ့်မယ်။

`to_tsquery` က single quote နဲ့ ဝန်းရံထားတဲ့ phrase တွေကိုလည်း လက်ခံပါတယ်။ Configuration ထဲမှာ ဒီလို phrase တွေကို ဖမ်းယူ (trigger) နိုင်တဲ့ thesaurus dictionary ပါဝင်နေတဲ့အခါ ဒါက အဓိက အသုံးဝင်ပါတယ်။ အောက်က ဥပမာမှာ thesaurus တစ်ခုထဲမှာ `supernovae stars : sn` ဆိုတဲ့ rule ပါဝင်နေပါတယ် —

```sql
SELECT to_tsquery('''supernovae stars'' & !crab');
  to_tsquery
---------------
 'sn' & !'crab'
```

Quote တွေ မပါဘဲ — AND၊ OR ဒါမှမဟုတ် FOLLOWED BY operator တစ်ခုခုနဲ့ မခြားထားတဲ့ token တွေအတွက် `to_tsquery` က syntax error ထုတ်ပေးပါလိမ့်မယ်။

```sql
plainto_tsquery([ config regconfig, ] querytext text) returns tsquery
```

`plainto_tsquery` က ပုံစံမကျတဲ့ (unformatted) `querytext` စာသားကို `tsquery` တန်ဖိုး အဖြစ် ပြောင်းလဲပေးပါတယ်။ `to_tsvector` မှာ လုပ်သလိုမျိုးပဲ — စာသားကို parse လုပ်ပြီး normalize လုပ်ကာ — ကျန်ရစ်တဲ့ စကားလုံးတွေကြားမှာ `&` (AND) `tsquery` operator ကို ထည့်သွင်းပေးပါတယ်။

ဥပမာ —

```sql
SELECT plainto_tsquery('english', 'The Fat Rats');
 plainto_tsquery
-----------------
 'fat' & 'rat'
```

`plainto_tsquery` က သူ့ရဲ့ input ထဲက `tsquery` operator တွေ၊ weight label တွေ ဒါမှမဟုတ် prefix-match label တွေကို မှတ်မိမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ —

```sql
SELECT plainto_tsquery('english', 'The Fat & Rats:C');
   plainto_tsquery
---------------------
 'fat' & 'rat' & 'c'
```

ဒီမှာတော့ input ထဲက punctuation အားလုံးကို ဖယ်ပစ်လိုက်ပါတယ်။

```sql
phraseto_tsquery([ config regconfig, ] querytext text) returns tsquery
```

`phraseto_tsquery` က `plainto_tsquery` နဲ့ အတော်လေး ဆင်တူစွာ ပြုမူပါတယ် — ခြားနားချက်ကတော့ `&` (AND) operator အစား ကျန်ရစ်တဲ့ စကားလုံးတွေကြားမှာ `<->` (FOLLOWED BY) operator ကို ထည့်သွင်းပေးတာ ဖြစ်ပါတယ်။ ဒါ့အပြင် — stop words တွေကို ရိုးရိုး ဖယ်ပစ်တာ မဟုတ်ဘဲ — `<->` operator တွေ အစား `<N>` operator တွေ ထည့်သွင်းခြင်းအားဖြင့် ထည့်သွင်း တွက်ချက်ပေးပါတယ်။ FOLLOWED BY operator တွေက lexeme တွေ အားလုံး ရှိနေခြင်း သက်သက် မဟုတ်ဘဲ — lexeme တွေရဲ့ အစီအစဉ်ကိုပါ စစ်ဆေးတာမို့ — ဒီ function က အတိအကျ ဖြစ်တဲ့ lexeme အစီအစဉ်တွေကို ရှာဖွေတဲ့အခါ အသုံးဝင်ပါတယ်။

```sql
SELECT phraseto_tsquery('english', 'The Fat Rats');
 phraseto_tsquery
------------------
 'fat' <-> 'rat'
```

`plainto_tsquery` လိုပဲ — `phraseto_tsquery` function ကလည်း သူ့ရဲ့ input ထဲက `tsquery` operator တွေ၊ weight label တွေ ဒါမှမဟုတ် prefix-match label တွေကို မှတ်မိမှာ မဟုတ်ပါဘူး —

```sql
SELECT phraseto_tsquery('english', 'The Fat & Rats:C');
      phraseto_tsquery
-----------------------------
 'fat' <-> 'rat' <-> 'c'
```

```sql
websearch_to_tsquery([ config regconfig, ] querytext text) returns tsquery
```

`websearch_to_tsquery` က — ရိုးရှင်းတဲ့ unformatted စာသား ကိုယ်တိုင် ခိုင်လုံတဲ့ query တစ်ခု ဖြစ်နိုင်တဲ့ အခြားရွေးချယ်စရာ syntax တစ်ခုကို သုံးပြီး `querytext` ကနေ `tsquery` တန်ဖိုး တစ်ခုကို ဖန်တီးပါတယ်။ `plainto_tsquery` နဲ့ `phraseto_tsquery` တို့နဲ့ မတူဘဲ — ဒါက operator အချို့ကိုလည်း မှတ်မိပါတယ်။ ဒါ့အပြင် — ဒီ function က syntax error တွေကို ဘယ်တော့မှ မထုတ်လွှတ်တာကြောင့် — ရှာဖွေမှုအတွက် user က ထည့်သွင်းလိုက်တဲ့ မူရင်း (raw) input ကို တိုက်ရိုက် သုံးနိုင်ပါတယ်။ အောက်ပါ syntax တွေကို ထောက်ပံ့ပေးပါတယ် —

- unquoted text — quote mark (ကိုးကားအမှတ်) တွေ အတွင်းမှာ မရှိတဲ့ စာသားကို — `plainto_tsquery` နဲ့ process လုပ်ထားသလိုမျိုး — `&` operator တွေနဲ့ ခြားထားတဲ့ term တွေအဖြစ် ပြောင်းလဲပေးပါတယ်။
- “quoted text” — quote mark တွေ အတွင်းမှာ ရှိတဲ့ စာသားကို — `phraseto_tsquery` နဲ့ process လုပ်ထားသလိုမျိုး — `<->` operator တွေနဲ့ ခြားထားတဲ့ term တွေအဖြစ် ပြောင်းလဲပေးပါတယ်။
- OR — “or” ဆိုတဲ့ စကားလုံးကို `|` operator အဖြစ် ပြောင်းလဲပေးပါတယ်။
- `-` — dash (မျဉ်းတို) တစ်ခုကို `!` operator အဖြစ် ပြောင်းလဲပေးပါတယ်။

ကျန် punctuation တွေကိုတော့ လျစ်လျူရှုပါတယ်။ ဒါကြောင့် `plainto_tsquery` နဲ့ `phraseto_tsquery` လိုပဲ — `websearch_to_tsquery` function ကလည်း သူ့ရဲ့ input ထဲက `tsquery` operator တွေ၊ weight label တွေ ဒါမှမဟုတ် prefix-match label တွေကို မှတ်မိမှာ မဟုတ်ပါဘူး။

ဥပမာများ —

```sql
SELECT websearch_to_tsquery('english', 'The fat rats');
 websearch_to_tsquery
----------------------
 'fat' & 'rat'
(1 row)

SELECT websearch_to_tsquery('english', '"supernovae stars" -crab');
       websearch_to_tsquery
----------------------------------
 'supernova' <-> 'star' & !'crab'
(1 row)

SELECT websearch_to_tsquery('english', '"sad cat" or "fat rat"');
       websearch_to_tsquery
-----------------------------------
 'sad' <-> 'cat' | 'fat' <-> 'rat'
(1 row)

SELECT websearch_to_tsquery('english', 'signal -"segmentation fault"');
         websearch_to_tsquery
---------------------------------------
 'signal' & !( 'segment' <-> 'fault' )
(1 row)

SELECT websearch_to_tsquery('english', '""" )( dummy \\ query <->');
 websearch_to_tsquery
----------------------
 'dummi' & 'queri'
(1 row)
```

### 12.3.3. Ranking Search Results (search result များကို အဆင့်သတ်မှတ်ခြင်း)

Ranking (အဆင့်သတ်မှတ်ခြင်း) က — document တွေက query တစ်ခုနဲ့ ဘယ်လောက် ဆက်စပ်မှု ရှိလဲဆိုတာကို တိုင်းတာဖို့ ကြိုးစားပြီး — match တွေ အများကြီး ရှိနေတဲ့အခါ အဆက်စပ်ဆုံး (most relevant) ဖြစ်တဲ့ဟာတွေကို ရှေ့ဆုံးကနေ ပြသနိုင်ဖို့ ဖြစ်ပါတယ်။ PostgreSQL က ကြိုတင် သတ်မှတ်ထားတဲ့ ranking function နှစ်ခုကို ပံ့ပိုးပေးပါတယ် — ဒီ function တွေက lexical (ဝေါဟာရဆိုင်ရာ) ၊ proximity (နီးကပ်မှုဆိုင်ရာ) နဲ့ structural (ဖွဲ့စည်းပုံဆိုင်ရာ) အချက်အလက်တွေကို ထည့်သွင်း စဉ်းစားပါတယ်။ ဆိုလိုတာက — query term တွေ document ထဲမှာ ဘယ်နှစ်ကြိမ် ပေါ်လဲ၊ term တွေက document ထဲမှာ တစ်ခုနဲ့တစ်ခု ဘယ်လောက် နီးကပ်လဲ နဲ့ သူတို့ ပေါ်ပေါက်ရာ document ရဲ့ အပိုင်းက ဘယ်လောက် အရေးပါလဲ ဆိုတာတွေကို ထည့်သွင်း စဉ်းစားတာပါ။ ဒါပေမယ့် — relevance (ဆက်စပ်မှု) ဆိုတဲ့ အယူအဆက မရေရာပြီး application တစ်ခုချင်းစီအလိုက် အလွန် ကွဲပြားပါတယ်။ Application အမျိုးမျိုးက ranking အတွက် နောက်ထပ် အချက်အလက်တွေ လိုအပ်နိုင်ပါတယ် — ဥပမာ document ရဲ့ ပြုပြင်မွမ်းမံချိန် (modification time) လိုမျိုးပါ။ Built-in ranking function တွေက ဥပမာ သက်သက်သာ ဖြစ်ပါတယ်။ ကိုယ်ပိုင် ranking function တွေ ရေးနိုင်သလို — ဒါမှမဟုတ် သူတို့ရဲ့ ရလဒ်တွေကို နောက်ထပ် အချက်အလက်တွေနဲ့ ပေါင်းစပ်ပြီး ကိုယ့်ရဲ့ သီးခြား လိုအပ်ချက်တွေနဲ့ ကိုက်ညီအောင် ပြုလုပ်နိုင်ပါတယ်။

လက်ရှိ ရရှိနိုင်တဲ့ ranking function နှစ်ခုကတော့ —

- **ts_rank([ weights float4[], ] vector tsvector, query tsquery [, normalization integer ]) returns float4** — vector တွေကို — match ဖြစ်တဲ့ သူတို့ရဲ့ lexeme တွေရဲ့ ကြိမ်နှုန်း (frequency) ပေါ် အခြေခံပြီး အဆင့်သတ်မှတ်ပေးပါတယ်။
- **ts_rank_cd([ weights float4[], ] vector tsvector, query tsquery [, normalization integer ]) returns float4** — ဒီ function က ပေးထားတဲ့ document vector နဲ့ query အတွက် cover density ranking (လွှမ်းခြုံမှု သိပ်သည်းဆ အလိုက် အဆင့်သတ်မှတ်ခြင်း) ကို တွက်ချက်ပေးပါတယ် — Clarke ၊ Cormack နဲ့ Tudhope တို့ရဲ့ “Relevance Ranking for One to Three Term Queries” ဆိုတဲ့ စာတမ်းမှာ ဖော်ပြထားတဲ့အတိုင်း ဖြစ်ပြီး — အဲဒါက “Information Processing and Management” ဂျာနယ် (1999) မှာ ဖော်ပြခဲ့တာ ဖြစ်ပါတယ်။ Cover density က `ts_rank` ranking နဲ့ ဆင်တူပေမယ့် — match ဖြစ်တဲ့ lexeme တွေ တစ်ခုနဲ့တစ်ခု နီးကပ်မှုကိုပါ ထည့်သွင်း စဉ်းစားတာ ကွာခြားပါတယ်။

ဒီ function က တွက်ချက်မှု လုပ်ဆောင်ဖို့ lexeme တွေရဲ့ position (တည်နေရာ) အချက်အလက် လိုအပ်ပါတယ်။ ဒါကြောင့် — `tsvector` ထဲက “stripped” (position အချက်အလက် ဖယ်ထုတ်ထားသော) lexeme တွေကို လျစ်လျူရှုပါတယ်။ Input ထဲမှာ unstripped lexeme မရှိဘူးဆိုရင် — ရလဒ်က သုည ဖြစ်ပါလိမ့်မယ်။ (strip function နဲ့ `tsvector` တွေထဲက position အချက်အလက်တွေအကြောင်း ပိုမို သိရှိရန် [အပိုင်း 12.4.1](/docs/postgresql/textsearch-features) ကို ကြည့်ပါ။)

Function နှစ်ခုလုံးအတွက် — optional ဖြစ်တဲ့ `weights` argument က word instance တွေကို သူတို့ ဘယ်လို တံဆိပ်ကပ်ထားလဲပေါ် မူတည်ပြီး — ပိုလေး ဒါမှမဟုတ် ပေါ့ပါးစွာ ချိန်ဆနိုင်တဲ့ စွမ်းရည်ကို ပေးပါတယ်။ Weight array တွေက စကားလုံး category တစ်ခုချင်းစီကို ဘယ်လောက် အလေးပေး ချိန်ဆမလဲဆိုတာကို အောက်ပါ အစီအစဉ်အတိုင်း သတ်မှတ်ပါတယ် —

```sql
{D-weight, C-weight, B-weight, A-weight}
```

`weights` မပေးထားဘူးဆိုရင် — ဒီ ပုံသေတန်ဖိုးတွေကို သုံးပါတယ် —

```sql
{0.1, 0.2, 0.4, 1.0}
```

ပုံမှန်အားဖြင့် — weight တွေကို document ရဲ့ အထူး နေရာတွေကနေ လာတဲ့ စကားလုံးတွေကို မှတ်သားဖို့ သုံးပါတယ် — ဥပမာ ခေါင်းစဉ် (title) ဒါမှမဟုတ် ကနဦး abstract လိုမျိုးပါ — ဒါမှ သူတို့ကို document ရဲ့ ကိုယ်ထည် (body) ထဲက စကားလုံးတွေထက် အရေးပါမှု ပိုသည် သို့မဟုတ် နည်းသည်ဟု သတ်မှတ်နိုင်မှာ ဖြစ်ပါတယ်။

Document တစ်ခု ပိုရှည်လေ — query term တစ်ခု ပါဝင်နိုင်တဲ့ အခွင့်အလမ်း ပိုများလေမို့ — document ရဲ့ အရွယ်အစားကို ထည့်သွင်း စဉ်းစားတာ ကျိုးကြောင်းဆီလျော်ပါတယ်။ ဥပမာ — စကားလုံး ၁၀၀ ပါတဲ့ document တစ်ခုထဲမှာ ရှာဖွေစရာ စကားလုံး ငါးကြိမ် ပါဝင်တာက — စကားလုံး ၁၀၀၀ ပါတဲ့ document တစ်ခုထဲမှာ ငါးကြိမ် ပါဝင်တာထက် — ပိုပြီး ဆက်စပ်မှု ရှိနိုင်ပါတယ်။ Ranking function နှစ်ခုလုံးက integer ဖြစ်တဲ့ `normalization` option တစ်ခုကို လက်ခံပြီး — အဲဒါက document တစ်ခုရဲ့ အလျားက သူ့ရဲ့ rank ကို ထိခိုက်သင့်လား၊ ထိခိုက်မယ်ဆိုရင် ဘယ်လို ထိခိုက်သင့်လဲဆိုတာကို သတ်မှတ်ပေးပါတယ်။ Integer option က အပြုအမူ (behavior) အများအပြားကို ထိန်းချုပ်တာမို့ — bit mask (ဘစ် ပေါင်းစပ် ရွေးချယ်မှု ပုံစံ) တစ်ခု ဖြစ်ပါတယ် — `|` ကို သုံးပြီး behavior တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို သတ်မှတ်နိုင်ပါတယ် (ဥပမာ — `2|4`)။

- 0 (ပုံသေ) — document ရဲ့ အလျားကို လျစ်လျူရှုပါတယ်
- 1 — rank ကို document အလျား၏ logarithm + 1 နဲ့ စားပါတယ်
- 2 — rank ကို document အလျားနဲ့ စားပါတယ်
- 4 — rank ကို extents (အပိုင်းအပိုင်း) တွေကြားက mean harmonic distance (ပျမ်းမျှ ဟာမိုနစ် အကွာအဝေး) နဲ့ စားပါတယ် (ဒါကို `ts_rank_cd` မှာပဲ အကောင်အထည် ဖော်ထားပါတယ်)
- 8 — rank ကို document ထဲက ထူးခြားတဲ့ (unique) စကားလုံး အရေအတွက်နဲ့ စားပါတယ်
- 16 — rank ကို document ထဲက unique စကားလုံး အရေအတွက်၏ logarithm + 1 နဲ့ စားပါတယ်
- 32 — rank ကို သူ့ဘာသာသူ + 1 နဲ့ စားပါတယ်

Flag bit တစ်ခုထက်ပိုပြီး သတ်မှတ်ထားရင် — အသွင်ပြောင်း (transformation) တွေကို စာရင်းထဲက အစီအစဉ်အတိုင်း လုပ်ဆောင်ပါတယ်။

Ranking function တွေက ကမ္ဘာလုံးဆိုင်ရာ (global) အချက်အလက် တစ်စုံတစ်ရာကို မသုံးဘူးဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ် — ဒါကြောင့် တစ်ခါတစ်ရံ လိုချင်ကြတဲ့အတိုင်း 1% ဒါမှမဟုတ် 100% အထိ တရားမျှတတဲ့ normalization (စံပြုညှိခြင်း) ကို ထုတ်လုပ်ဖို့က မဖြစ်နိုင်ပါဘူး။ Normalization option 32 (`rank/(rank+1)`) ကို သုံးပြီး rank အားလုံးကို သုညကနေ တစ်ကြား အကွာအဝေး (range) ထဲ စကေး (scale) ချနိုင်ပါတယ် — ဒါပေမယ့် ဒါက အသွင်အပြင် သက်သက် ပြောင်းလဲမှု ဖြစ်ပြီး — search result တွေရဲ့ အစီအစဉ်ကိုတော့ ထိခိုက်မှာ မဟုတ်ပါဘူး။

အဆင့်အမြင့်ဆုံး match ဆယ်ခုကိုပဲ ရွေးထုတ်တဲ့ ဥပမာ တစ်ခုက ဒီလိုပါ —

```sql
SELECT title, ts_rank_cd(textsearch, query) AS rank
FROM apod, to_tsquery('neutrino|(dark & matter)') query
WHERE query @@ textsearch
ORDER BY rank DESC
LIMIT 10;
                     title                     |   rank
-----------------------------------------------+----------
 Neutrinos in the Sun                          |      3.1
 The Sudbury Neutrino Detector                 |      2.4
 A MACHO View of Galactic Dark Matter          |  2.01317
 Hot Gas and Dark Matter                       |  1.91171
 The Virgo Cluster: Hot Plasma and Dark Matter |  1.90953
 Rafting for Solar Neutrinos                   |      1.9
 NGC 4650A: Strange Galaxy and Dark Matter     |  1.85774
 Hot Gas and Dark Matter                       |   1.6123
 Ice Fishing for Cosmic Neutrinos              |      1.6
 Weak Lensing Distorts the Universe            | 0.818218
```

ဒါကတော့ normalized ranking ကို သုံးထားတဲ့ အလားတူ ဥပမာပါ —

```sql
SELECT title, ts_rank_cd(textsearch, query, 32 /* rank/(rank+1) */ ) AS rank
FROM apod, to_tsquery('neutrino|(dark & matter)') query
WHERE  query @@ textsearch
ORDER BY rank DESC
LIMIT 10;
                     title                     |        rank
-----------------------------------------------+-------------------
 Neutrinos in the Sun                          | 0.756097569485493
 The Sudbury Neutrino Detector                 | 0.705882361190954
 A MACHO View of Galactic Dark Matter          | 0.668123210574724
 Hot Gas and Dark Matter                       |  0.65655958650282
 The Virgo Cluster: Hot Plasma and Dark Matter | 0.656301290640973
 Rafting for Solar Neutrinos                   | 0.655172410958162
 NGC 4650A: Strange Galaxy and Dark Matter     | 0.650072921219637
 Hot Gas and Dark Matter                       | 0.617195790024749
 Ice Fishing for Cosmic Neutrinos              | 0.615384618911517
 Weak Lensing Distorts the Universe            | 0.450010798361481
```

Ranking က ဈေးကြီးတဲ့ (expensive) လုပ်ဆောင်ချက် ဖြစ်နိုင်ပါတယ် — အကြောင်းကတော့ match ဖြစ်တဲ့ document တစ်ခုချင်းစီရဲ့ `tsvector` ကို တိုင်ပင်ရတာကြောင့် — I/O bound ဖြစ်ပြီး နှေးကွေးနိုင်လို့ပါ။ ကံမကောင်းစွာပဲ — လက်တွေ့ကျတဲ့ query တွေက match အများအပြားကို ထွက်စေလေ့ ရှိတာမို့ — ဒါကို ရှောင်လွှဲဖို့ကလည်း မဖြစ်နိုင်လုနီးပါးပါ။

### 12.3.4. Highlighting Results (ရလဒ်များကို highlight ပြုလုပ်ခြင်း)

Search result တွေကို တင်ပြဖို့ဆိုရင် — document တစ်ခုချင်းစီရဲ့ အပိုင်း တစ်ပိုင်းနဲ့ — အဲဒါ query နဲ့ ဘယ်လို ဆက်စပ်လဲဆိုတာကို ပြသဖို့က အကောင်းဆုံး ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — search engine တွေက search term တွေ အမှတ်အသား ပြုထားတဲ့ document fragment တွေကို ပြသပါတယ်။ PostgreSQL က ဒီလုပ်ဆောင်ချက်ကို အကောင်အထည် ဖော်ပေးတဲ့ `ts_headline` ဆိုတဲ့ function တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

```sql
ts_headline([ config regconfig, ] document text, query tsquery [, options text ]) returns text
```

`ts_headline` က document တစ်ခုကို query တစ်ခုနဲ့အတူ လက်ခံပြီး — query ထဲက term တွေ highlighted (ထင်ရှားအောင် မှတ်သားပြသ) လုပ်ထားတဲ့ — document ထဲက ကောက်နုတ်ချက် (excerpt) တစ်ခုကို ပြန်ပေးပါတယ်။ တိတိကျကျ ဆိုရရင် — function က query ကို သုံးပြီး ဆက်စပ်တဲ့ text fragment တွေကို ရွေးချယ်ကာ — ပြီးရင် query ထဲမှာ ပေါ်လာတဲ့ စကားလုံး အားလုံးကို highlight လုပ်ပါတယ် — အဲဒီ စကားလုံးတွေရဲ့ position တွေက query ရဲ့ ကန့်သတ်ချက်တွေနဲ့ မကိုက်ညီဘူးဆိုရင်တောင် ဖြစ်ပါတယ်။ Document ကို parse လုပ်ဖို့ သုံးမယ့် configuration ကို `config` နဲ့ သတ်မှတ်နိုင်ပြီး — `config` ကို ချန်လှပ်ထားရင် — `default_text_search_config` configuration ကို သုံးပါတယ်။

`options` string တစ်ခု သတ်မှတ်ထားရင် — အဲဒါမှာ comma နဲ့ ခြားထားတဲ့ `option`=`value` အတွဲ တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို ပါဝင်ရပါမယ်။ ရရှိနိုင်တဲ့ option တွေကတော့ —

- `MaxWords` ၊ `MinWords` (integers) — ဒီဂဏန်းတွေက output ထုတ်မယ့် headline တွေရဲ့ အရှည်ဆုံးနဲ့ အတိုဆုံး ကန့်သတ်ချက်တွေကို သတ်မှတ်ပေးပါတယ်။ ပုံသေတန်ဖိုးတွေက 35 နဲ့ 15 ဖြစ်ပါတယ်။
- `ShortWord` (integer) — ဒီအလျား (သို့) ဒီထက် တိုတဲ့ စကားလုံးတွေကို headline တစ်ခုရဲ့ အစ နဲ့ အဆုံးကနေ ဖယ်ပစ်ပါတယ် — query term ဖြစ်နေရင်တော့ လွဲပါတယ်။ ပုံသေတန်ဖိုး သုံးက အင်္ဂလိပ်လို အသုံးများတဲ့ article တွေကို ဖယ်ရှားပေးပါတယ်။
- `HighlightAll` (boolean) — true ဆိုရင် document တစ်ခုလုံးကို headline အဖြစ် သုံးပြီး — အပေါ်က parameter သုံးခုကို လျစ်လျူရှုပါတယ်။ ပုံသေက false ဖြစ်ပါတယ်။
- `MaxFragments` (integer) — ပြသမယ့် text fragment အများဆုံး အရေအတွက်ပါ။ ပုံသေတန်ဖိုး သုညက fragment-based မဟုတ်တဲ့ headline ထုတ်လုပ်မှု နည်းလမ်းကို ရွေးချယ်ပြီး — သုညထက် ကြီးတဲ့ တန်ဖိုးက fragment-based headline ထုတ်လုပ်မှုကို ရွေးချယ်ပါတယ် (အောက်တွင် ကြည့်ပါ)။
- `StartSel` ၊ `StopSel` (strings) — document ထဲမှာ ပေါ်လာတဲ့ query စကားလုံးတွေကို — တခြား ကောက်နုတ်ထားတဲ့ စကားလုံးတွေနဲ့ ခွဲခြားသိစေဖို့ — ဝန်းရံ (delimit) လုပ်ဖို့ သုံးတဲ့ string တွေပါ။ ပုံသေတန်ဖိုးတွေက “<b>” နဲ့ “</b>” ဖြစ်ပြီး — HTML output အတွက် သင့်လျော်နိုင်ပါတယ် (ဒါပေမယ့် အောက်က သတိပေးချက်ကို ကြည့်ပါ)။
- `FragmentDelimiter` (string) — fragment တစ်ခုထက်ပိုပြီး ပြသတဲ့အခါ — fragment တွေကို ဒီ string နဲ့ ခြားပါတယ်။ ပုံသေက “ ... ” ဖြစ်ပါတယ်။

> **သတိပြုရန်:** `ts_headline` ရဲ့ output က web page တွေထဲ တိုက်ရိုက် ထည့်သွင်းဖို့အတွက် လုံခြုံတယ်လို့ အာမခံချက် မရှိပါဘူး။ `HighlightAll` က `false` (ပုံသေ) ဖြစ်နေတဲ့အခါ — document ထဲက ရိုးရှင်းတဲ့ XML tag တချို့ကို ဖယ်ရှားပေးပေမယ့် — HTML markup အားလုံးကို ဖယ်ရှားပေးနိုင်မယ်လို့တော့ အာမခံချက် မရှိပါဘူး။ ဒါကြောင့် — မယုံကြည်ရတဲ့ (untrusted) input တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — cross-site scripting (XSS) attack လိုမျိုး တိုက်ခိုက်မှုတွေကို ကာကွယ်ဖို့ ဒါက ထိရောက်တဲ့ အကာအကွယ် မဟုတ်ပါဘူး။ ဒီလို တိုက်ခိုက်မှုတွေကနေ ကာကွယ်ဖို့ဆိုရင် — input document ထဲက HTML markup အားလုံးကို ဖယ်ရှားသင့်သလို — ဒါမှမဟုတ် output ပေါ်မှာ HTML sanitizer တစ်ခုကို သုံးသင့်ပါတယ်။

ဒီ option နာမည်တွေကို case-insensitive (စာလုံး အကြီး/အသေး ခွဲခြားမှု မရှိဘဲ) အနေနဲ့ မှတ်မိပါတယ်။ String တန်ဖိုးတွေထဲမှာ space ဒါမှမဟုတ် comma တွေ ပါဝင်နေရင် — ဒီတန်ဖိုးတွေကို double quote (“ ”) နဲ့ ဝန်းရံပေးရပါမယ်။

Fragment-based မဟုတ်တဲ့ headline ထုတ်လုပ်မှုမှာ — `ts_headline` က ပေးထားတဲ့ `query` အတွက် match တွေကို ရှာဖွေပြီး — ခွင့်ပြုထားတဲ့ headline အလျား အတွင်းမှာ query စကားလုံး ပိုများတဲ့ match တွေကို ဦးစားပေးကာ — ပြသဖို့ တစ်ခုတည်းကို ရွေးချယ်ပါတယ်။ Fragment-based headline ထုတ်လုပ်မှုမှာတော့ — `ts_headline` က query match တွေကို ရှာဖွေပြီး — match တစ်ခုချင်းစီကို `MaxWords` ထက် မပိုတဲ့ “fragments” (အပိုင်းအစများ) တစ်ခုချင်းစီအဖြစ် ခွဲခြမ်းပေးပါတယ် — query စကားလုံး ပိုများတဲ့ fragment တွေကို ဦးစားပေးပြီး — ဖြစ်နိုင်ရင် ဝန်းကျင်က စကားလုံးတွေ ပါဝင်အောင် fragment တွေကို “stretching” (ဆန့်ထုတ်) လုပ်ပေးပါတယ်။ ဒါကြောင့် — query match တွေက document ရဲ့ ကြီးမားတဲ့ အပိုင်းတွေကို လွှမ်းခြုံနေတဲ့အခါ ဒါမှမဟုတ် match အများအပြားကို ပြသချင်တဲ့အခါ — fragment-based mode က ပိုပြီး အသုံးဝင်ပါတယ်။ Mode နှစ်ခုလုံးမှာ — query match တစ်ခုမှ ဖော်ထုတ်လို့ မရဘူးဆိုရင် — document ထဲက ပထမ `MinWords` စကားလုံးတွေ ပါဝင်တဲ့ fragment တစ်ခုတည်းကို ပြသပါလိမ့်မယ်။

ဥပမာ —

```sql
SELECT ts_headline('english',
  'The most common type of search
is to find all documents containing given query terms
and return them in order of their similarity to the
query.',
  to_tsquery('english', 'query & similarity'));
                        ts_headline
------------------------------------------------------------
 containing given <b>query</b> terms                       +
 and return them in order of their <b>similarity</b> to the+
 <b>query</b>.

SELECT ts_headline('english',
  'Search terms may occur
many times in a document,
requiring ranking of the search matches to decide which
occurrences to display in the result.',
  to_tsquery('english', 'search & term'),
  'MaxFragments=10, MaxWords=7, MinWords=3, StartSel=<<, StopSel=>>');
                        ts_headline
------------------------------------------------------------
 <<Search>> <<terms>> may occur                            +
 many times ... ranking of the <<search>> matches to decide
```

`ts_headline` က `tsvector` အကျဉ်းချုပ် မဟုတ်ဘဲ — မူရင်း document ကို အသုံးပြုတာမို့ — နှေးကွေးနိုင်ပြီး သတိထား သုံးသင့်ပါတယ်။
