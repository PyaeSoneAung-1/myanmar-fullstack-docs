---
title: "Text Search Types (text search type များ)"
description: "Full text search အတွက် data type နှစ်မျိုး — tsvector (lexeme နှင့် position/weight ပါဝင်သော document) နှင့် tsquery (search operator များဖြင့် ပေါင်းစပ်ထားသော query)"
order: 58
source: "https://www.postgresql.org/docs/current/datatype-textsearch.html"
status: translated
updated: 2026-09-03
---

## 8.11. Text Search Types (text search type များ)

- **8.11.1. tsvector (tsvector type)**
- **8.11.2. tsquery (tsquery type)**

Full text search (စာသား အပြည့်အစုံ ရှာဖွေမှု) ဆိုတာ — သဘာဝ ဘာသာစကားနဲ့ ရေးထားတဲ့ *documents* (စာတမ်းများ) အစုတစ်စုထဲကနေ — ပေးထားတဲ့ *query* (ရှာဖွေမေးခွန်း) တစ်ခုနဲ့ အကောင်းဆုံး ကိုက်ညီတဲ့ဟာတွေကို ရှာဖွေတဲ့ လုပ်ဆောင်ချက် ဖြစ်ပါတယ်။ ဒီလို full text search ကို ထောက်ကူဖို့ PostgreSQL က data type နှစ်မျိုး ပံ့ပိုးပေးထားပါတယ်။ `tsvector` type က document တစ်ခုကို text search အတွက် optimize (ပုံစံချွေတာ ပြင်ဆင်) လုပ်ထားတဲ့ ပုံစံနဲ့ ကိုယ်စားပြုပြီး — `tsquery` type ကလည်း text query တစ်ခုကို အလားတူ ကိုယ်စားပြုပါတယ်။ ဒီစွမ်းဆောင်နိုင်မှုရဲ့ အသေးစိတ် ရှင်းလင်းချက်ကို [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) မှာ ဖော်ပြထားပြီး — ဆက်စပ် function နဲ့ operator တွေရဲ့ အကျဉ်းချုပ်ကို [အပိုင်း 9.13](https://www.postgresql.org/docs/current/functions-textsearch.html) မှာ ဖော်ပြထားပါတယ်။

### 8.11.1. `tsvector` (tsvector type)

`tsvector` value တစ်ခုဆိုတာ — ထူးခြားတဲ့ (distinct) *lexemes* တွေကို စီစဉ်ထားတဲ့ စာရင်း တစ်ခု ဖြစ်ပါတယ်။ Lexeme (စကားလုံး ပုံစံကွဲများ ပေါင်းစုထားသော ယူနစ်) တွေဆိုတာ — စကားလုံး တစ်လုံးတည်းရဲ့ ပုံစံကွဲတွေ အားလုံး တစ်ခုတည်းအဖြစ် ပေါင်းစည်းမိအောင် *normalized* (ပုံမှန် စံပုံစံတစ်ခုသို့ ပြောင်းလဲ) လုပ်ထားတဲ့ စကားလုံးတွေ ဖြစ်ပါတယ် (အသေးစိတ်အတွက် [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) ကို ကြည့်ပါ)။ စီစဉ်ပေးခြင်းနဲ့ ထပ်နေတဲ့ဟာတွေ ဖယ်ရှားပေးခြင်း (duplicate-elimination) တို့ကို input လုပ်ဆောင်ချိန်မှာ အလိုအလျောက် လုပ်ပေးပါတယ် — အောက်က ဥပမာမှာ ပြထားပါတယ်:

```sql
SELECT 'a fat cat sat on a mat and ate a fat rat'::tsvector;
                      tsvector
----------------------------------------------------
 'a' 'and' 'ate' 'cat' 'fat' 'mat' 'on' 'rat' 'sat'
```

White space (နေရာလွတ်) ဒါမှမဟုတ် punctuation (ပုဒ်ဖြတ် သင်္ကေတ) တွေ ပါဝင်တဲ့ lexemes တွေကို ကိုယ်စားပြုဖို့ — အဲဒါတွေကို quotes (ကိုးကားအမှတ်အသား) တွေနဲ့ ဝန်းရံပေးပါ:

```sql
SELECT $$the lexeme '    ' contains spaces$$::tsvector;
                 tsvector
-------------------------------------------
 '    ' 'contains' 'lexeme' 'spaces' 'the'
```

(ဒီဥပမာနဲ့ နောက်ဥပမာမှာ dollar-quoted string literals တွေကို သုံးထားတာက — literals တွေအတွင်းမှာ quote အမှတ်အသားတွေကို နှစ်ထပ် ရေးရတဲ့ ရှုပ်ထွေးမှုကို ရှောင်ရှားဖို့ ဖြစ်ပါတယ်။) Literal တွေထဲမှာ ပါဝင်တဲ့ (embedded) quotes နဲ့ backslashes တွေကိုတော့ နှစ်ထပ် ရေးပေးရပါတယ်:

```sql
SELECT $$the lexeme 'Joe''s' contains a quote$$::tsvector;
                    tsvector
------------------------------------------------
 'Joe''s' 'a' 'contains' 'lexeme' 'quote' 'the'
```

လိုအပ်ရင် lexemes တွေမှာ integer (ကိန်းပြည့်) *positions* (နေရာ အမှတ်များ) တွေကို တွဲပေးလို့ ရပါတယ်:

```sql
SELECT 'a:1 fat:2 cat:3 sat:4 on:5 a:6 mat:7 and:8 ate:9 a:10 fat:11 rat:12'::tsvector;
                                  tsvector
-------------------------------------------------------------------​------------
 'a':1,6,10 'and':8 'ate':9 'cat':3 'fat':2,11 'mat':7 'on':5 'rat':12 'sat':4
```

Position တစ်ခုက ပုံမှန်အားဖြင့် document ထဲမှာ မူရင်း စကားလုံး တည်ရှိတဲ့ နေရာကို ဖော်ပြပါတယ်။ Position ဆိုင်ရာ အချက်အလက်တွေကို *proximity ranking* (အနီးကပ်မှုအလိုက် အဆင့်သတ်မှတ်ခြင်း) အတွက် သုံးနိုင်ပါတယ်။ Position တန်ဖိုးတွေက 1 ကနေ 16383 အထိ ရှိနိုင်ပြီး — ဒီထက်ကြီးတဲ့ ဂဏန်းတွေကိုတော့ 16383 အဖြစ် တိတ်တဆိတ် (silently) သတ်မှတ်လိုက်ပါတယ်။ Lexeme တစ်ခုတည်းအတွက် position ထပ်နေတာတွေကိုတော့ ဖယ်ပစ်ပါတယ်။

Position ရှိတဲ့ lexemes တွေကို *weight* (အလေးချိန် အဆင့်) တစ်ခုနဲ့ပါ ထပ်မံ သတ်မှတ်နိုင်ပါတယ် — `A`, `B`, `C` ဒါမှမဟုတ် `D` ဖြစ်နိုင်ပါတယ်။ `D` က default ဖြစ်လို့ output မှာ ပြသမပေးပါဘူး:

```sql
SELECT 'a:1A fat:2B,4C cat:5D'::tsvector;
          tsvector
----------------------------
 'a':1A 'cat':5 'fat':2B,4C
```

Weights တွေကို ပုံမှန်အားဖြင့် document ရဲ့ တည်ဆောက်ပုံကို ထင်ဟပ်စေဖို့ သုံးပါတယ် — ဥပမာ — ခေါင်းစဉ် (title) ထဲက စကားလုံးတွေနဲ့ ကိုယ်ထည် (body) ထဲက စကားလုံးတွေကို မတူညီအောင် အမှတ်အသား လုပ်တာမျိုးပါ။ Text search ranking functions တွေက weight အမှတ်အသား တစ်ခုချင်းစီအတွက် မတူညီတဲ့ priority (ဦးစားပေးမှု) တွေ သတ်မှတ်ပေးနိုင်ပါတယ်။

`tsvector` type ကိုယ်တိုင် ဘယ် word normalization ကိုမှ မလုပ်ပေးဘူးဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ် — ၎င်းကို ပေးလိုက်တဲ့ စကားလုံးတွေက application အတွက် သင့်လျော်စွာ normalized လုပ်ပြီးသားလို့ ၎င်းက ယူဆထားပါတယ်။ ဥပမာ:

```sql
SELECT 'The Fat Rats'::tsvector;
      tsvector
--------------------
 'Fat' 'Rats' 'The'
```

အပေါ်က စကားလုံးတွေကို English စာသား ရှာဖွေတဲ့ application အများစုအတွက်ဆိုရင် non-normalized (ပုံမှန် စံပုံစံသို့ ပြောင်းမထားသော) အဖြစ် သတ်မှတ်ပါလိမ့်မယ် — ဒါပေမယ့် `tsvector` ကတော့ ဂရုမစိုက်ပါဘူး။ Document တစ်ခုရဲ့ မူရင်း (raw) text ကို ရှာဖွေမှုအတွက် သင့်လျော်အောင် normalize လုပ်ဖို့ — ပုံမှန်အားဖြင့် `to_tsvector` ကနေ ဖြတ်သန်း ပေးသင့်ပါတယ်:

```sql
SELECT to_tsvector('english', 'The Fat Rats');
   to_tsvector
-----------------
 'fat':2 'rat':3
```

နောက်ထပ် အသေးစိတ်တွေအတွက် [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) ကို ထပ်ကြည့်ပါ။

### 8.11.2. `tsquery` (tsquery type)

`tsquery` value တစ်ခုက ရှာဖွေရမယ့် lexemes တွေကို သိမ်းဆည်းပြီး — ၎င်းတို့ကို Boolean operators တွေဖြစ်တဲ့ `&` (AND), `|` (OR), `!` (NOT) တွေနဲ့သာမက — phrase search operator `<->` (FOLLOWED BY — နောက်မှ လိုက်သည်) နဲ့ပါ ပေါင်းစပ်နိုင်ပါတယ်။ FOLLOWED BY operator ရဲ့ မူကွဲ (variant) တစ်မျိုးအနေနဲ့ `<N>` လည်း ရှိပါတယ် — အဲဒီမှာ `N` က ရှာဖွေနေတဲ့ lexeme နှစ်ခုကြားက အကွာအဝေး (distance) ကို သတ်မှတ်ပေးတဲ့ integer constant ဖြစ်ပါတယ်။ `<->` က `<1>` နဲ့ ညီမျှပါတယ်။

ဒီ operators တွေကို အုပ်စုဖွဲ့ (group) ဖို့ Parentheses (လက်ကွင်း) တွေကို သုံးနိုင်ပါတယ်။ Parentheses မပါဘူးဆိုရင် — `!` (NOT) က အခိုင်မာဆုံး ချိတ်ဆက်ပြီး — `<->` (FOLLOWED BY) က ၎င်းနောက် အခိုင်မာဆုံး၊ ထို့နောက် `&` (AND)၊ ပြီးတော့ `|` (OR) က အနည်းဆုံး အခိုင်မာဆုံး ချိတ်ဆက်ပါတယ်။

ဥပမာတချို့ ကြည့်ရအောင်:

```sql
SELECT 'fat & rat'::tsquery;
    tsquery
---------------
 'fat' & 'rat'

SELECT 'fat & (rat | cat)'::tsquery;
          tsquery
---------------------------
 'fat' & ( 'rat' | 'cat' )

SELECT 'fat & rat & ! cat'::tsquery;
        tsquery
------------------------
 'fat' & 'rat' & !'cat'
```

`tsquery` ထဲက lexemes တွေကို weight စာလုံး တစ်လုံး ဒါမှမဟုတ် တစ်လုံးထက်ပို သတ်မှတ်လို့လည်း ရပါတယ် — ဒါက ၎င်းတို့ကို အဲဒီ weights တွေထဲက တစ်ခုခု ရှိတဲ့ `tsvector` lexemes တွေနဲ့ပဲ ကိုက်ညီအောင် ကန့်သတ်ပေးပါတယ်:

```sql
SELECT 'fat:ab & cat'::tsquery;
    tsquery
------------------
 'fat':AB & 'cat'
```

ဒါ့အပြင် — `tsquery` ထဲက lexemes တွေကို prefix matching (ရှေ့ဆက် ကိုက်ညီမှု) သတ်မှတ်ဖို့ `*` နဲ့လည်း အမှတ်အသား လုပ်လို့ ရပါတယ်:

```sql
SELECT 'super:*'::tsquery;
  tsquery
-----------
 'super':*
```

ဒီ query က `tsvector` တစ်ခုထဲမှာ “super” နဲ့ စတင်တဲ့ စကားလုံး ဘယ်ဟာနဲ့မဆို ကိုက်ညီပါလိမ့်မယ်။

Lexemes တွေအတွက် quoting (quote သုံးခြင်း) စည်းမျဉ်းတွေက `tsvector` ထဲက lexemes တွေအတွက် အရင်က ဖော်ပြခဲ့တာတွေနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။ ပြီးတော့ — `tsvector` မှာလိုပဲ — `tsquery` type အဖြစ် မပြောင်းခင် လိုအပ်တဲ့ word normalization တွေကို ကြိုတင် လုပ်ထားရပါမယ်။ ဒီလို normalization တွေ လုပ်ဖို့ `to_tsquery` function က အဆင်ပြေပါတယ်:

```sql
SELECT to_tsquery('Fat:ab & Cats');
    to_tsquery
------------------
 'fat':AB & 'cat'
```

`to_tsquery` က prefixes တွေကို တခြား စကားလုံးတွေလိုပဲ process လုပ်တယ်ဆိုတာ သတိပြုပါ — ဆိုလိုတာက ဒီနှိုင်းယှဉ်ချက်က true ပြန်ပါတယ်:

```sql
SELECT to_tsvector( 'postgraduate' ) @@ to_tsquery( 'postgres:*' );
 ?column?
----------
 t
```

အကြောင်းကတော့ `postgres` ကို stem (စကားလုံး ရင်းမြစ် ပုံစံသို့ လျှော့ချ) လုပ်လိုက်တဲ့အခါ `postgr` ဖြစ်သွားလို့ပါ:

```sql
SELECT to_tsvector( 'postgraduate' ), to_tsquery( 'postgres:*' );
  to_tsvector  | to_tsquery
---------------+------------
 'postgradu':1 | 'postgr':*
```

အဲဒီလို stem လုပ်ထားတဲ့ `postgr` က `postgraduate` ရဲ့ stemmed (ရင်းမြစ် ပုံစံသို့ လျှော့ချထားသော) ပုံစံနဲ့ ကိုက်ညီပါတယ်။
