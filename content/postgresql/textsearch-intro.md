---
title: "Introduction (နိဒါန်း)"
description: "Full text search (စာသား အပြည့်အစုံ ရှာဖွေမှု) ရဲ့ မိတ်ဆက် — document ဆိုတာ ဘာလဲ၊ အခြေခံ text matching (tsvector/tsquery နဲ့ @@ operator) နဲ့ text search configurations အကြောင်း"
order: 117
source: "https://www.postgresql.org/docs/current/textsearch-intro.html"
status: translated
updated: 2026-09-03
---

## 12.1. Introduction (နိဒါန်း)

- **12.1.1. What Is a Document? (document ဆိုတာ ဘာလဲ)**
- **12.1.2. Basic Text Matching (အခြေခံ text ကိုက်ညီမှု စစ်ဆေးခြင်း)**
- **12.1.3. Configurations (configuration များ)**

Full Text Searching (သို့မဟုတ် ရိုးရိုး *text search*) ဆိုတာ — သဘာဝ ဘာသာစကားနဲ့ ရေးထားတဲ့ *documents* (စာတမ်းများ) တွေထဲက — *query* (ရှာဖွေမေးခွန်း) တစ်ခုနဲ့ ကိုက်ညီတဲ့ဟာတွေကို ခွဲခြား ဖော်ထုတ်ပေးနိုင်ပြီး — လိုအပ်ရင် query နဲ့ ဆီလျော်မှု (relevance) အလိုက် စီပေးနိုင်တဲ့ စွမ်းရည် တစ်ခု ဖြစ်ပါတယ်။ အသုံးအများဆုံး ရှာဖွေမှု ပုံစံကတော့ — ပေးထားတဲ့ *query terms* (ရှာဖွေမှု စကားလုံးများ) တွေ ပါဝင်တဲ့ document တွေ အားလုံးကို ရှာဖွေပြီး — query နဲ့ *similarity* (တူညီမှု) အလိုက် အစီအစဉ်နဲ့ ပြန်ပေးတာ ဖြစ်ပါတယ်။ `query` နဲ့ `similarity` ဆိုတဲ့ အယူအဆတွေက အလွန် ပြောင်းလွယ်ပြင်လွယ် ရှိပြီး — application တစ်ခုချင်းစီပေါ်မှာ မူတည်ပါတယ်။ အရိုးရှင်းဆုံး ရှာဖွေမှုကတော့ — `query` ကို စကားလုံး အစုတစ်ခုအနေနဲ့လည်းကောင်း — `similarity` ကို document ထဲမှာ query ရဲ့ စကားလုံးတွေ ပါဝင်နေတဲ့ အကြိမ်ရေ (frequency) အနေနဲ့လည်းကောင်း သတ်မှတ်ပါတယ်။

Textual search operator တွေက database တွေထဲမှာ နှစ်ပေါင်းများစွာ တည်ရှိခဲ့ပါတယ်။ PostgreSQL မှာလည်း textual data type တွေအတွက် `~`, `~*`, `LIKE`, `ILIKE` operator တွေ ရှိပါတယ် — ဒါပေမယ့် ၎င်းတို့မှာ ခေတ်မီ information systems တွေ လိုအပ်တဲ့ မရှိမဖြစ် ဂုဏ်သတ္တိ (essential properties) တွေ အများကြီး ချို့တဲ့နေပါတယ်:

- English အတွက်တောင် — ဘာသာစကား ဆိုင်ရာ ထောက်ကူ (linguistic support) လုံးဝ မပါပါဘူး။ Regular expressions တွေကလည်း မလုံလောက်ပါဘူး — အကြောင်းကတော့ ၎င်းတို့က ဆင်းသက်လာသော စကားလုံး (derived word) တွေဖြစ်တဲ့ satisfies နဲ့ satisfy လိုမျိုးတွေကို အလွယ်တကူ ကိုင်တွယ်လို့ မရလို့ပါ။ Satisfy ကို ရှာနေတဲ့အခါ — satisfies ပါတဲ့ document တွေကိုပါ တွေ့စေချင်စိတ် ရှိနိုင်ပေမယ့် — regular expression သုံးရင် satisfies ပါတဲ့ document တွေကို လွတ်သွားစေနိုင်ပါတယ်။ ဆင်းသက်ပုံစံ (derived forms) အမျိုးမျိုးကို OR သုံးပြီး ရှာဖို့ ကြိုးစားလို့ ရပေမယ့် — အဲဒါက ငြီးငွေ့စရာ ကောင်းပြီး အမှား များတတ်ပါတယ် (စကားလုံး တချို့မှာ ဆင်းသက်ပုံစံ ထောင်ပေါင်းများစွာ အထိ ရှိနိုင်ပါတယ်)။
- ရှာဖွေမှု ရလဒ် (search results) တွေကို အစဉ်လိုက် စီပေးခြင်း (ranking — အဆင့်သတ်မှတ်ခြင်း) လုံးဝ မပါတဲ့အတွက် — ကိုက်ညီတဲ့ document တွေ ထောင်ပေါင်းများစွာ တွေ့တဲ့အခါ ထိရောက်မှု မရှိပါဘူး။
- Index ထောက်ကူ မရှိတဲ့အတွက် — ရှာဖွေမှု တစ်ခုချင်းစီမှာ document တွေ အားလုံးကို process လုပ်ရတာကြောင့် — ၎င်းတို့က နှေးတတ်ပါတယ်။

Full text indexing (full text search အတွက် index ပြုလုပ်ခြင်း) ကတော့ — document တွေကို ကြိုတင် process (preprocess) လုပ်ထားနိုင်ပြီး — နောက်ပိုင်း လျင်မြန်စွာ ရှာဖွေနိုင်ဖို့ index တစ်ခုကို သိမ်းထားနိုင်စေပါတယ်။ Preprocessing မှာ အောက်ပါတို့ ပါဝင်ပါတယ်:

- Document တွေကို tokens (စာသား အပိုင်းအစများ) တွေအဖြစ် ခွဲထုတ်ခြင်း (parsing)။ ဂဏန်းတွေ၊ စကားလုံးတွေ၊ ရှုပ်ထွေးတဲ့ စကားလုံးတွေ၊ email address တွေလို token class အမျိုးမျိုးကို ခွဲခြား သိရှိနိုင်တာက အသုံးဝင်ပါတယ် — အဲဒါတွေကို တစ်မျိုးချင်းစီ မတူညီတဲ့ နည်းနဲ့ process လုပ်နိုင်ဖို့ပါ။ အခြေခံအားဖြင့် token class တွေက application တစ်ခုချင်းစီပေါ် မူတည်ပေမယ့် — ရည်ရွယ်ချက် အများစုအတွက်တော့ ကြိုတင် သတ်မှတ်ထားတဲ့ class အစုတစ်ခုကို သုံးတာက လုံလောက်ပါတယ်။ PostgreSQL က ဒီအဆင့်ကို လုပ်ဆောင်ဖို့ parser တစ်ခုကို အသုံးပြုပါတယ်။ Standard parser တစ်ခုကို ပံ့ပိုးပေးထားပြီး — သီးခြား လိုအပ်ချက်တွေအတွက် custom parsers တွေကိုလည်း ဖန်တီးနိုင်ပါတယ်။
- Token တွေကို lexemes (စကားလုံး ပုံစံကွဲများ ပေါင်းစုထားသော စံစကားလုံး) တွေအဖြစ် ပြောင်းလဲခြင်း။ Lexeme တစ်ခုက token တစ်ခုလိုပဲ string တစ်ခု ဖြစ်ပေမယ့် — စကားလုံး တစ်လုံးတည်းရဲ့ ပုံစံကွဲတွေ အားလုံး တူညီသွားအောင် normalized (စံပုံစံတစ်ခုသို့ ပြောင်းလဲ) လုပ်ထားပါတယ်။ ဥပမာ — normalization မှာ စာလုံးကြီးတွေကို စာလုံးလေး (lower-case) တွေအဖြစ် ပြောင်းတာ (case folding) က နီးပါး အမြဲ ပါဝင်ပြီး — နောက်ဆက်တွဲ (suffix) တွေကို ဖယ်ရှားတာမျိုး (English မှာ s ဒါမှမဟုတ် es လိုမျိုး) လည်း မကြာခဏ ပါဝင်ပါတယ်။ ဒါက ဖြစ်နိုင်တဲ့ ပုံစံကွဲတွေ အားလုံးကို ငြီးငွေ့ဖွယ် ရိုက်ထည့်စရာ မလိုဘဲ — စကားလုံး တစ်လုံးရဲ့ ပုံစံကွဲတွေကို ရှာဖွေမှုတွေမှာ တွေ့ရှိနိုင်စေပါတယ်။ ဒါ့အပြင် ဒီအဆင့်မှာ — ရှာဖွေမှုအတွက် အသုံးမဝင်လောက်အောင် အသုံးများလွန်းတဲ့ stop words (ရပ်တန့်စကားလုံးများ) တွေကိုလည်း ပုံမှန်အားဖြင့် ဖယ်ရှားပါတယ်။ (အတိုချုပ် ပြောရရင် — tokens တွေက document text ရဲ့ မူရင်း (raw) အပိုင်းအစတွေ ဖြစ်ပြီး — lexemes တွေကတော့ index လုပ်ခြင်းနဲ့ ရှာဖွေခြင်းအတွက် အသုံးဝင်တယ်လို့ ယူဆရတဲ့ စကားလုံးတွေ ဖြစ်ပါတယ်။) PostgreSQL က ဒီအဆင့်ကို လုပ်ဆောင်ဖို့ dictionaries (အဘိဓာန်များ) တွေကို အသုံးပြုပါတယ်။ Standard dictionary အမျိုးမျိုးကို ပံ့ပိုးပေးထားပြီး — သီးခြား လိုအပ်ချက်တွေအတွက် custom dictionaries တွေကိုလည်း ဖန်တီးနိုင်ပါတယ်။
- ရှာဖွေမှုအတွက် optimize (အကောင်းဆုံး ဖြစ်အောင် ပြင်ဆင်) လုပ်ထားတဲ့ preprocessed document တွေကို သိမ်းဆည်းခြင်း။ ဥပမာ — document တစ်ခုချင်းစီကို normalized lexemes တွေရဲ့ စီထားသော array (ခင်းကျင်းစာရင်း) တစ်ခုအနေနဲ့ ကိုယ်စားပြုနိုင်ပါတယ်။ Lexemes တွေနဲ့အတူ — proximity ranking (အနီးကပ်မှုအလိုက် အဆင့်သတ်မှတ်ခြင်း) အတွက် သုံးနိုင်ဖို့ positional information (တည်နေရာ အချက်အလက်များ) တွေကိုပါ သိမ်းထားတာက မကြာခဏ နှစ်လိုဖွယ် ဖြစ်ပါတယ် — ဒါကြောင့် query ရဲ့ စကားလုံးတွေ ပိုသိပ်သည်းတဲ့ (“dense”) နေရာ ပါဝင်တဲ့ document တစ်ခုကို — စကားလုံးတွေ ကြဲကျဲနေတဲ့ document တစ်ခုထက် အဆင့် (rank) ပိုမြင့်စွာ သတ်မှတ်ပေးပါတယ်။

Dictionaries တွေက tokens တွေကို ဘယ်လို normalize လုပ်မလဲဆိုတာကို အနုစိတ် (fine-grained) ထိန်းချုပ်နိုင်စေပါတယ်။ သင့်လျော်တဲ့ dictionaries တွေနဲ့ဆိုရင် အောက်ပါတို့ကို လုပ်နိုင်ပါတယ်:

- Index မလုပ်သင့်တဲ့ stop words တွေကို သတ်မှတ်ခြင်း။
- Ispell ကို သုံးပြီး synonyms (အဓိပ္ပာယ်တူ စကားလုံးများ) တွေကို စကားလုံး တစ်လုံးတည်းအဖြစ် ပေါင်းစပ်ခြင်း။
- Thesaurus (အဓိပ္ပာယ်တူ ဝေါဟာရ အဘိဓာန်) ကို သုံးပြီး phrases (စကားစုများ) တွေကို စကားလုံး တစ်လုံးတည်းအဖြစ် ပေါင်းစပ်ခြင်း။
- Ispell dictionary ကို သုံးပြီး စကားလုံး တစ်လုံးရဲ့ ပုံစံကွဲတွေကို canonical (စံပြု) ပုံစံ တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ခြင်း။
- Snowball stemmer rules တွေကို သုံးပြီး စကားလုံး တစ်လုံးရဲ့ ပုံစံကွဲတွေကို canonical ပုံစံ တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ခြင်း။

Preprocessed document တွေကို သိမ်းဆည်းဖို့ data type တစ်ခုဖြစ်တဲ့ `tsvector` ကိုလည်းကောင်း — process လုပ်ပြီးသား queries တွေကို ကိုယ်စားပြုဖို့ `tsquery` type ကိုလည်းကောင်း ပံ့ပိုးပေးထားပါတယ် ([အပိုင်း 8.11](/docs/postgresql/datatype-textsearch))။ ဒီ data type တွေအတွက် function နဲ့ operator တွေ အများအပြား ရနိုင်ပါတယ် ([အပိုင်း 9.13](/docs/postgresql/functions-textsearch)) — အဲဒီထဲက အရေးအကြီးဆုံးကတော့ match operator `@@` ဖြစ်ပြီး — အဲဒါကို အပိုင်း 12.1.2 မှာ မိတ်ဆက် ပေးသွားပါမယ်။ Full text search တွေကို index တွေ သုံးပြီး မြန်ဆန်အောင် လုပ်နိုင်ပါတယ် ([အပိုင်း 12.9](/docs/postgresql/textsearch-indexes))။

### 12.1.1. What Is a Document? (document ဆိုတာ ဘာလဲ)

*Document* (စာတမ်း) ဆိုတာ full text search system တစ်ခုမှာ ရှာဖွေမှုရဲ့ ယူနစ် (unit) တစ်ခု ဖြစ်ပါတယ် — ဥပမာ — မဂ္ဂဇင်း ဆောင်းပါး တစ်ပုဒ် ဒါမှမဟုတ် email message တစ်စောင် ဖြစ်နိုင်ပါတယ်။ Text search engine က document တွေကို parse လုပ်ပြီး — lexemes (အဓိက စကားလုံးများ) တွေနဲ့ ၎င်းတို့ ပါဝင်တဲ့ document (parent document) တို့ရဲ့ ဆက်စပ်မှု (association) တွေကို သိမ်းဆည်းနိုင်ရပါမယ်။ နောက်ပိုင်းမှာ ဒီဆက်စပ်မှုတွေကို — query ရဲ့ စကားလုံးတွေ ပါဝင်တဲ့ document တွေကို ရှာဖွေဖို့ အသုံးပြုပါတယ်။

PostgreSQL အတွင်းမှာ ရှာဖွေမှုတွေအတွက်ဆိုရင် — document ဆိုတာ ပုံမှန်အားဖြင့် database table တစ်ခုရဲ့ row တစ်ခုထဲက textual field (စာသား အကွက်) တစ်ခု ဖြစ်ပြီး — ဒါမှမဟုတ် အဲဒီလို field တွေရဲ့ ပေါင်းစပ်မှု (concatenation) တစ်ခုလည်း ဖြစ်နိုင်ပါတယ် — table အများအပြားမှာ သိမ်းထားတာ ဒါမှမဟုတ် dynamically (လုပ်ဆောင်ချိန်မှာ) ရယူတာမျိုး ဖြစ်နိုင်ပါတယ်။ တနည်းပြောရရင် — document တစ်ခုကို index လုပ်ဖို့အတွက် မတူညီတဲ့ အစိတ်အပိုင်းတွေကနေ တည်ဆောက်နိုင်ပြီး — တစ်နေရာရာမှာ တစ်ခုလုံး အနေနဲ့ သိမ်းထားဖို့ မလိုအပ်ပါဘူး။ ဥပမာ:

```sql
SELECT title || ' ' ||  author || ' ' ||  abstract || ' ' || body AS document
FROM messages
WHERE mid = 12;

SELECT m.title || ' ' || m.author || ' ' || m.abstract || ' ' || d.body AS document
FROM messages m, docs d
WHERE m.mid = d.did AND m.mid = 12;
```

> **မှတ်ချက်:** တကယ်တော့ — ဒီဥပမာ query တွေမှာ — attribute တစ်ခုတည်း `NULL` ဖြစ်နေရုံနဲ့ document တစ်ခုလုံး `NULL` ရလဒ် (result) ဖြစ်မသွားအောင် `coalesce` ကို သုံးသင့်ပါတယ်။

နောက်ထပ် ဖြစ်နိုင်ခြေ တစ်ခုကတော့ — document တွေကို file system ထဲမှာ ရိုးရိုး text files တွေအနေနဲ့ သိမ်းထားတာ ဖြစ်ပါတယ်။ ဒီလိုဆိုရင် — full text index ကို သိမ်းဆည်းဖို့နဲ့ ရှာဖွေမှုတွေ လုပ်ဆောင်ဖို့ database ကို အသုံးပြုနိုင်ပြီး — file system ကနေ document ကို ပြန်ယူဖို့ unique identifier (ထူးခြားသော သတ်မှတ်ကိန်း) တစ်ခုခုကို အသုံးပြုနိုင်ပါတယ်။ ဒါပေမယ့် — database အပြင်ဘက်က file တွေကို ပြန်ယူတာက superuser permissions (အထူးအခွင့်အရေးများ) ဒါမှမဟုတ် အထူး function ထောက်ကူတွေ လိုအပ်တာကြောင့် — data အားလုံးကို PostgreSQL အတွင်းမှာပဲ ထားတာထက် ပုံမှန်အားဖြင့် အဆင်ပြေမှု နည်းပါတယ်။ ဒါ့အပြင် — အရာအားလုံးကို database ထဲမှာ ထားတာက — index လုပ်ခြင်းနဲ့ ပြသခြင်းတွေမှာ အထောက်အကူ ဖြစ်စေဖို့ document ရဲ့ metadata (ဖော်ပြချက် အချက်အလက်) တွေကို အလွယ်တကူ ဝင်ရောက်နိုင်စေပါတယ်။

Text search ရည်ရွယ်ချက်တွေအတွက် — document တစ်ခုချင်းစီကို preprocess လုပ်ထားပြီးသား `tsvector` format အဖြစ် လျှော့ချ (reduce) ထားရပါမယ်။ ရှာဖွေခြင်းနဲ့ အဆင့်သတ်မှတ်ခြင်း (ranking) တွေက document ရဲ့ `tsvector` ကိုယ်စားပြုမှုပေါ်မှာပဲ လုံးဝ လုပ်ဆောင်ပါတယ် — မူရင်း text ကိုတော့ — document ကို user အတွက် ပြသဖို့ ရွေးချယ်လိုက်ချိန်မှသာ ပြန်ယူဖို့ လိုပါတယ်။ ဒါကြောင့် — `tsvector` ကိုပဲ document အဖြစ် မကြာခဏ ပြောဆိုလေ့ ရှိကြပါတယ် — ဒါပေမယ့် တကယ်တော့ ၎င်းက document အပြည့်အစုံရဲ့ compact (ကျစ်လျစ်သော) ကိုယ်စားပြုမှု တစ်ခုသာ ဖြစ်ပါတယ်။

### 12.1.2. Basic Text Matching (အခြေခံ text ကိုက်ညီမှု စစ်ဆေးခြင်း)

PostgreSQL မှာ full text searching က match operator `@@` ကို အခြေခံထားပါတယ် — `tsvector` (document) တစ်ခုက `tsquery` (query) တစ်ခုနဲ့ ကိုက်ညီရင် `true` ပြန်ပေးပါတယ်။ ဘယ် data type ကို အရင်ရေးလဲဆိုတာ အရေးမကြီးပါဘူး:

```sql
SELECT 'a fat cat sat on a mat and ate a fat rat'::tsvector @@ 'cat & rat'::tsquery;
 ?column?
----------
 t

SELECT 'fat & cow'::tsquery @@ 'a fat cat sat on a mat and ate a fat rat'::tsvector;
 ?column?
----------
 f
```

အပေါ်က ဥပမာက ဖော်ပြတဲ့အတိုင်း — `tsquery` ဆိုတာလည်း `tsvector` လိုပဲ — မူရင်း (raw) text သက်သက် မဟုတ်ပါဘူး။ `tsquery` တစ်ခုမှာ search terms (ရှာဖွေမှု စကားလုံးများ) တွေ ပါဝင်ပြီး — ၎င်းတို့က ကြိုတင် normalize လုပ်ပြီးသား (already-normalized) lexemes တွေ ဖြစ်ရပြီး — term အများအပြားကို AND, OR, NOT နဲ့ FOLLOWED BY operator တွေ သုံးပြီး ပေါင်းစပ်နိုင်ပါတယ်။ (Syntax အသေးစိတ်အတွက် [အပိုင်း 8.11.2](/docs/postgresql/datatype-textsearch) ကို ကြည့်ပါ။) User ရေးသားတဲ့ text ကို သင့်လျော်တဲ့ `tsquery` တစ်ခုအဖြစ် ပြောင်းပေးရာမှာ အထောက်အကူ ပြုတဲ့ function တွေဖြစ်တဲ့ `to_tsquery`, `plainto_tsquery`, `phraseto_tsquery` တွေ ရှိပါတယ် — အဓိကအားဖြင့် text ထဲမှာ ပါဝင်တဲ့ စကားလုံးတွေကို normalize လုပ်ပေးခြင်းအားဖြင့် ဖြစ်ပါတယ်။ အလားတူ — `to_tsvector` ကိုလည်း document string တစ်ခုကို parse လုပ်ပြီး normalize လုပ်ဖို့ အသုံးပြုပါတယ်။ ဒါကြောင့် လက်တွေ့မှာ text search match တစ်ခုက ဒီလိုမျိုး ပိုဆင်ပါလိမ့်မယ်:

```sql
SELECT to_tsvector('fat cats ate fat rats') @@ to_tsquery('fat & rat');
 ?column?
----------
 t
```

အောက်ပါအတိုင်း ရေးလိုက်ရင်တော့ ဒီ match က အောင်မြင်မှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ:

```sql
SELECT 'fat cats ate fat rats'::tsvector @@ to_tsquery('fat & rat');
 ?column?
----------
 f
```

အကြောင်းကတော့ — ဒီမှာ `rats` ဆိုတဲ့ စကားလုံးကို normalization လုပ်ပေးမှာ မဟုတ်လို့ပါ။ `tsvector` တစ်ခုရဲ့ အစိတ်အပိုင်းတွေက lexemes တွေ ဖြစ်ပြီး — ၎င်းတို့က normalize လုပ်ပြီးသားလို့ ယူဆထားတာကြောင့် — `rats` က `rat` နဲ့ ကိုက်ညီမှာ မဟုတ်ပါဘူး။

`@@` operator က `text` input ကိုလည်း ထောက်ကူပေးပါတယ် — ရိုးရှင်းတဲ့ အခြေအနေတွေမှာ text string တစ်ခုကို `tsvector` ဒါမှမဟုတ် `tsquery` အဖြစ် အတိအကျ (explicitly) ပြောင်းခြင်းကို ကျော်လိုက်နိုင်စေပါတယ်။ ရနိုင်တဲ့ ပုံစံကွဲ (variants) တွေကတော့:

```sql
tsvector @@ tsquery
tsquery  @@ tsvector
text @@ tsquery
text @@ text
```

ဒီထဲက ပထမ နှစ်မျိုးကို အပေါ်မှာ မြင်ပြီးသား ဖြစ်ပါတယ်။ `text` `@@` `tsquery` ပုံစံက `to_tsvector(x) @@ y` နဲ့ ညီမျှပြီး — `text` `@@` `text` ပုံစံကတော့ `to_tsvector(x) @@ plainto_tsquery(y)` နဲ့ ညီမျှပါတယ်။

`tsquery` တစ်ခုအတွင်းမှာ `&` (AND) operator က — match ဖြစ်ဖို့ ၎င်းရဲ့ argument နှစ်ခုလုံး document ထဲမှာ ပါဝင်ရမယ်လို့ သတ်မှတ်ပါတယ်။ အလားတူ — `|` (OR) operator က argument တွေထဲက အနည်းဆုံး တစ်ခု ပါဝင်ရမယ်လို့ သတ်မှတ်ပြီး — `!` (NOT) operator ကတော့ match ဖြစ်ဖို့အတွက် ၎င်းရဲ့ argument မပါဝင်ရဘူးလို့ သတ်မှတ်ပါတယ်။ ဥပမာ — `fat & ! rat` ဆိုတဲ့ query က `fat` ပါဝင်ပြီး `rat` မပါဝင်တဲ့ document တွေနဲ့ ကိုက်ညီပါတယ်။

Phrase (စကားစု) တွေကို ရှာဖွေတာကတော့ — `<->` (FOLLOWED BY) `tsquery` operator ရဲ့ အကူအညီနဲ့ လုပ်နိုင်ပါတယ် — ၎င်းရဲ့ argument တွေရဲ့ match ဖြစ်တဲ့ နေရာတွေက ကပ်လျက် (adjacent) ဖြစ်ပြီး ပေးထားတဲ့ အစီအစဉ်အတိုင်း ဆိုမှသာ match ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT to_tsvector('fatal error') @@ to_tsquery('fatal <-> error');
 ?column?
----------
 t

SELECT to_tsvector('error is not fatal') @@ to_tsquery('fatal <-> error');
 ?column?
----------
 f
```

FOLLOWED BY operator ရဲ့ ပိုပြီး ယေဘုယျကျတဲ့ မူကွဲတစ်ခုလည်း ရှိပါတယ် — `<N>` ပုံစံ ဖြစ်ပြီး — `N` က match ဖြစ်နေတဲ့ lexemes တွေရဲ့ position (နေရာ) တွေကြားက ကွာခြားချက်ကို ကိုယ်စားပြုတဲ့ integer (ကိန်းပြည့်) တစ်ခု ဖြစ်ပါတယ်။ `<1>` က `<->` နဲ့ အတူတူပဲ ဖြစ်ပြီး — `<2>` ကတော့ match နှစ်ခုကြားမှာ တခြား lexeme အတိအကျ တစ်လုံး ရှိနေခွင့် ပြုပြီး — ဒီအတိုင်း ဆက်သွားပါတယ်။ `phraseto_tsquery` function က — စကားလုံး တချို့က stop words တွေ ဖြစ်နေတဲ့အခါ — စကားလုံး အများအပြား ပါဝင်တဲ့ phrase တစ်ခုကို match လုပ်နိုင်တဲ့ `tsquery` တစ်ခု တည်ဆောက်ဖို့ ဒီ operator ကို အသုံးပြုပါတယ်။ ဥပမာ:

```sql
SELECT phraseto_tsquery('cats ate rats');
       phraseto_tsquery
-------------------------------
 'cat' <-> 'ate' <-> 'rat'

SELECT phraseto_tsquery('the cats ate the rats');
       phraseto_tsquery
-------------------------------
 'cat' <-> 'ate' <2> 'rat'
```

တစ်ခါတစ်ရံ အသုံးဝင်တဲ့ အထူး အခြေအနေ တစ်ခုကတော့ — `<0>` ကို သုံးပြီး pattern နှစ်ခုက စကားလုံး တစ်လုံးတည်းကိုပဲ match လုပ်ဖို့ တောင်းဆိုနိုင်တာ ဖြစ်ပါတယ်။

`tsquery` operator တွေရဲ့ nesting (အထပ်ထပ် ဖွဲ့စည်းမှု) ကို ထိန်းချုပ်ဖို့ Parentheses (လက်ကွင်း) တွေကို သုံးနိုင်ပါတယ်။ Parentheses မပါဘူးဆိုရင် — `|` က ချိတ်ဆက်မှု (binding) အပေါ့ဆုံး ဖြစ်ပြီး — ထို့နောက် `&`၊ ထို့နောက် `<->` — ပြီးတော့ `!` က အခိုင်မာဆုံး ဖြစ်ပါတယ်။

AND/OR/NOT operator တွေက FOLLOWED BY operator တစ်ခုရဲ့ argument တွေအတွင်းမှာ ရှိနေတဲ့အခါ — မရှိနေတဲ့အခါနဲ့ မတူဘဲ — အနည်းငယ် ကွဲပြားတဲ့ အဓိပ္ပာယ် သက်ရောက်တယ်ဆိုတာ သတိပြုသင့်ပါတယ် — အကြောင်းကတော့ FOLLOWED BY အတွင်းမှာ match ဖြစ်တဲ့ နေရာ (position) အတိအကျက အရေးပါလို့ပါ။ ဥပမာ — ပုံမှန်အားဖြင့် `!x` က `x` ဘယ်နေရာမှာမှ မပါဝင်တဲ့ document တွေနဲ့သာ match ဖြစ်ပါတယ်။ ဒါပေမယ့် `!x <-> y` ကတော့ — `x` တစ်ခုရဲ့ နောက်မှာ ချက်ချင်း (immediately) မဟုတ်တဲ့ `y` တစ်ခုနဲ့ match ဖြစ်ပါတယ် — document ထဲက တခြားနေရာမှာ `x` ရှိနေတာက match ဖြစ်တာကို မတားဆီးပါဘူး။ နောက်ဥပမာ တစ်ခုကတော့ — `x & y` က ပုံမှန်အားဖြင့် `x` နဲ့ `y` နှစ်ခုလုံး document ထဲမှာ တစ်နေရာရာမှာ ပေါ်ဖို့သာ လိုအပ်ပေမယ့် — `(x & y) <-> z` ကတော့ `x` နဲ့ `y` က `z` တစ်ခုရဲ့ ရှေ့မှာ ချက်ချင်း — တစ်နေရာတည်းမှာ match ဖြစ်ဖို့ လိုအပ်ပါတယ်။ ဒါကြောင့် ဒီ query က — `x z` နဲ့ `y z` ဆိုတဲ့ သီးခြား sequence နှစ်ခု ပါဝင်တဲ့ document တစ်ခုနဲ့ match ဖြစ်မယ့် `x <-> z & y <-> z` နဲ့ မတူဘဲ ပြုမူပါတယ်။ (ဒီ query ကို ရေးထားတဲ့အတိုင်းကတော့ — `x` နဲ့ `y` က တစ်နေရာတည်းမှာ match မဖြစ်နိုင်တာကြောင့် — အသုံးမဝင်ပါဘူး။ ဒါပေမယ့် prefix-match pattern တွေလို ပိုရှုပ်ထွေးတဲ့ အခြေအနေတွေမှာတော့ ဒီပုံစံ query က အသုံးဝင်နိုင်ပါတယ်။)

### 12.1.3. Configurations (configuration များ)

အပေါ်မှာ ပြခဲ့တာတွေက ရိုးရှင်းတဲ့ text search ဥပမာတွေ အားလုံး ဖြစ်ပါတယ်။ အရင်က ဖော်ပြခဲ့သလို — full text search ရဲ့ လုပ်ဆောင်နိုင်စွမ်းတွေထဲမှာ နောက်ထပ် အများကြီး ပါဝင်ပါတယ်: စကားလုံး တချို့ (stop words) ကို index မလုပ်ဘဲ ကျော်ခြင်း၊ synonyms တွေကို process လုပ်ခြင်း — ပြီးတော့ white space (နေရာလွတ်) တစ်ခုတည်းကိုသာ အခြေခံတာထက် ပိုမို ဆန်းပြားတဲ့ parsing မျိုး အသုံးပြုခြင်း (ဥပမာ — white space ထက်မက အခြေခံပြီး parse လုပ်ခြင်း) တို့ ဖြစ်ပါတယ်။ ဒီလုပ်ဆောင်နိုင်စွမ်းတွေကို *text search configurations* (text search configuration များ) က ထိန်းချုပ်ပါတယ်။ PostgreSQL မှာ ဘာသာစကား အများအပြားအတွက် ကြိုတင် သတ်မှတ်ထားတဲ့ (predefined) configurations တွေ ပါဝင်ပြီး — ကိုယ်ပိုင် configurations တွေကိုလည်း အလွယ်တကူ ဖန်တီးနိုင်ပါတယ်။ (psql ရဲ့ `\dF` command က ရရှိနိုင်တဲ့ configurations တွေ အားလုံးကို ပြသပါတယ်။)

Installation (တပ်ဆင်ခြင်း) ပြုလုပ်နေစဉ်အတွင်း သင့်လျော်တဲ့ configuration တစ်ခုကို ရွေးချယ်ပြီး — [default_text_search_config](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TEXT-SEARCH-CONFIG) ကို `postgresql.conf` ထဲမှာ အလိုက်သင့် သတ်မှတ်ပေးပါတယ်။ Cluster တစ်ခုလုံးအတွက် text search configuration တစ်ခုတည်းကိုပဲ သုံးနေတယ်ဆိုရင် — `postgresql.conf` ထဲက value ကို သုံးနိုင်ပါတယ်။ Cluster တစ်ခုလုံးမှာတော့ မတူညီတဲ့ configurations တွေ သုံးချင်ပေမယ့် — database တစ်ခုချင်းစီအတွင်းမှာတော့ configuration တစ်ခုတည်း ဖြစ်စေချင်ရင် — `ALTER DATABASE ... SET` ကို သုံးပါ။ မဟုတ်ရင် — session တစ်ခုချင်းစီမှာ `default_text_search_config` ကို သတ်မှတ်နိုင်ပါတယ်။

Configuration တစ်ခုပေါ်မှာ မူတည်တဲ့ text search function တစ်ခုချင်းစီမှာ optional (ချန်လှပ်နိုင်သော) `regconfig` argument တစ်ခု ရှိပါတယ် — ဒါကြောင့် သုံးမယ့် configuration ကို အတိအကျ (explicitly) သတ်မှတ်နိုင်ပါတယ်။ `default_text_search_config` ကို ဒီ argument ကို ချန်လှပ်လိုက်တဲ့အခါမှသာ အသုံးပြုပါတယ်။

Custom text search configurations တွေ တည်ဆောက်ရတာ လွယ်ကူစေဖို့ — configuration တစ်ခုကို ပိုရိုးရှင်းတဲ့ database objects (database အရာဝတ္ထုများ) တွေကနေ တည်ဆောက်ထားပါတယ်။ PostgreSQL ရဲ့ text search စနစ်က configuration နဲ့ ဆက်စပ်တဲ့ database object အမျိုးအစား လေးမျိုး ပံ့ပိုးပေးပါတယ်:

- Text search parsers တွေက document တွေကို tokens တွေအဖြစ် ခွဲထုတ်ပြီး — token တစ်ခုချင်းစီကို အမျိုးအစား ခွဲခြား (classify) ပေးပါတယ် (ဥပမာ — စကားလုံး ဒါမှမဟုတ် ဂဏန်း အနေနဲ့)။
- Text search dictionaries တွေက tokens တွေကို normalized ပုံစံအဖြစ် ပြောင်းလဲပေးပြီး — stop words တွေကို ပယ်ချပါတယ်။
- Text search templates တွေက dictionaries တွေရဲ့ အခြေခံ (underlying) function တွေကို ပံ့ပိုးပေးပါတယ်။ (Dictionary တစ်ခုက template တစ်ခုနဲ့ — အဲဒီ template အတွက် parameter အစုတစ်ခုကို ရိုးရိုးရှင်းရှင်း သတ်မှတ်ပေးရုံပါပဲ။)
- Text search configurations တွေက parser တစ်ခုနဲ့ — parser က ထုတ်လုပ်လိုက်တဲ့ tokens တွေကို normalize လုပ်ဖို့ သုံးမယ့် dictionary အစုတစ်ခုကို ရွေးချယ်ပါတယ်။

Text search parsers နဲ့ templates တွေကို low-level (အနိမ့်ဆင့်) C functions တွေနဲ့ တည်ဆောက်ထားပါတယ် — ဒါကြောင့် အသစ်တွေ တီထွင်ဖို့ C programming ကျွမ်းကျင်မှု လိုအပ်ပြီး — database တစ်ခုထဲကို တပ်ဆင်ဖို့ဆိုရင် superuser privileges တွေ လိုအပ်ပါတယ်။ (PostgreSQL distribution ရဲ့ `contrib/` နေရာမှာ add-on (ထပ်ဆောင်း) parsers နဲ့ templates တွေရဲ့ ဥပမာတွေ ရှိပါတယ်။) Dictionaries နဲ့ configurations တွေက အခြေခံ parsers နဲ့ templates တချို့ကို parameterize (parameter သတ်မှတ်) လုပ်ပြီး ချိတ်ဆက်ပေးရုံသာ ဖြစ်တာကြောင့် — dictionary ဒါမှမဟုတ် configuration အသစ် တစ်ခု ဖန်တီးဖို့ အထူး အခွင့်အရေး (special privilege) မလိုအပ်ပါဘူး။ Custom dictionaries နဲ့ configurations တွေ ဖန်တီးခြင်း ဥပမာတွေကို ဒီ chapter ရဲ့ နောက်ပိုင်းမှာ ဖော်ပြထားပါတယ်။
