---
title: "Collation Support (Collation ထောက်ပံ့မှု)"
description: "Collation (စာလုံးများကို စီစဉ် နှိုင်းယှဉ်သည့် စည်းမျဉ်း) ထောက်ပံ့မှု အကြောင်း — collatable data types များနှင့် collation derivation (implicit/explicit) သဘောတရားများ၊ collations ပေါင်းစပ်ခြင်း စည်းမျဉ်းများ (COLLATE clause, ORDER BY, operator/function calls)၊ collation providers (libc နှင့် icu)၊ platform အားလုံးတွင် ထောက်ပံ့သည့် standard collations (unicode, ucs_basic, pg_unicode_fast, pg_c_utf8, C/POSIX, default)၊ initdb မှ pg_collation catalog တွင် ကြိုတင် သတ်မှတ်ပေးသည့် libc/ICU collations များနှင့် BCP 47 language tags (-x-icu)၊ CREATE COLLATION ဖြင့် collation အသစ်များ ဖန်တီးခြင်း/ကူးယူခြင်း၊ nondeterministic collations (deterministic = false) နှင့် ၎င်းတို့၏ အားနည်းချက်များ၊ ICU စိတ်ကြိုက် collations များ (comparison levels, ICU collation settings ဇယား, tailoring rules, external references) အကြောင်း ရှင်းလင်းချက်"
order: 181
source: "https://www.postgresql.org/docs/current/collation.html"
status: translated
updated: 2026-09-06
---

## 23.2. Collation Support (Collation ထောက်ပံ့မှု)

- **23.2.1. Concepts (အခြေခံ သဘောတရားများ)**
- **23.2.2. Managing Collations (Collations များကို စီမံခန့်ခွဲခြင်း)**
- **23.2.3. ICU Custom Collations (ICU စိတ်ကြိုက် collations များ)**

Collation (စာလုံးများကို စီစဉ် နှိုင်းယှဉ်သည့် စည်းမျဉ်း) feature က — data ရဲ့ စီစဉ်မှု အစဉ် (sort order) နဲ့ စာလုံး အမျိုးအစား ခွဲခြားမှု (character classification) အပြုအမူကို — column အလိုက် (per-column) — ဒါမှမဟုတ် — လုပ်ဆောင်မှု (operation) တစ်ခုချင်းအလိုက်တောင် သတ်မှတ်ခွင့် ပြုပါတယ်။ ဒါက database တစ်ခုရဲ့ `LC_COLLATE` နဲ့ `LC_CTYPE` ဆက်တင်တွေကို — ဖန်တီးပြီးတဲ့နောက် ပြောင်းလဲလို့ မရတော့ဘူးဆိုတဲ့ — ကန့်သတ်ချက်ကို သက်သာစေပါတယ်။

### 23.2.1. Concepts (အခြေခံ သဘောတရားများ)

သဘောတရားအရဆိုရင် — collatable data type (collation သတ်မှတ်လို့ ရသော data type) တစ်ခုရဲ့ expression တိုင်းမှာ collation တစ်ခု ရှိပါတယ်။ (Built-in collatable data types တွေကတော့ `text`, `varchar` နဲ့ `char` တို့ ဖြစ်ပါတယ်။ User-defined base types တွေကိုလည်း collatable အဖြစ် မှတ်သားလို့ ရပြီး — collatable data type တစ်ခုအပေါ်က [domain](https://www.postgresql.org/docs/current/glossary.html#GLOSSARY-DOMAIN) တစ်ခုကလည်း သေချာပေါက် collatable ဖြစ်ပါတယ်။) Expression က column reference (column ရည်ညွှန်းချက်) တစ်ခု ဖြစ်နေတယ်ဆိုရင် — expression ရဲ့ collation က column ရဲ့ သတ်မှတ်ထားတဲ့ collation ဖြစ်ပါတယ်။ Expression က constant (ကိန်းသေ) တစ်ခု ဖြစ်နေတယ်ဆိုရင် — collation က constant ရဲ့ data type ရဲ့ default collation ဖြစ်ပါတယ်။ ပိုရှုပ်ထွေးတဲ့ expression တစ်ခုရဲ့ collation ကိုတော့ — အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း — ၎င်းရဲ့ inputs တွေရဲ့ collations တွေကနေ ဆင်းသက် (derive) လာပါတယ်။

Expression တစ်ခုရဲ့ collation က “default” collation ဖြစ်နိုင်ပြီး — အဲဒါက database အတွက် သတ်မှတ်ထားတဲ့ locale settings (locale ဆက်တင်များ) တွေကို ဆိုလိုပါတယ်။ Expression တစ်ခုရဲ့ collation က indeterminate (မသေချာမရေရာသော) ဖြစ်နေတာလည်း ဖြစ်နိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ — စီစဉ်မှု (ordering) လုပ်ဆောင်ချက်တွေနဲ့ collation ကို သိရှိရန် လိုအပ်တဲ့ တခြား လုပ်ဆောင်မှုတွေက ကျရှုံး (fail) ပါလိမ့်မယ်။

Database system က စီစဉ်မှု တစ်ခု ဒါမှမဟုတ် စာလုံး အမျိုးအစား ခွဲခြားမှု တစ်ခုကို လုပ်ဆောင်ရတဲ့အခါ — input expression ရဲ့ collation ကို သုံးပါတယ်။ ဒါက ဥပမာ — `ORDER BY` clauses တွေနဲ့ `<` လို function ဒါမှမဟုတ် operator call တွေမှာ ဖြစ်ပါတယ်။ `ORDER BY` clause တစ်ခုအတွက် သုံးရမယ့် collation က — sort key (စီစဉ်ရန် သော့) ရဲ့ collation ပဲ ရိုးရိုး ဖြစ်ပါတယ်။ Function ဒါမှမဟုတ် operator call တစ်ခုအတွက် သုံးရမယ့် collation ကိုတော့ — အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း — arguments (အငြင်းအခုံ တန်ဖိုးများ) တွေကနေ ဆင်းသက် လာပါတယ်။ Comparison operators တွေအပြင် — collations တွေကို `lower`, `upper` နဲ့ `initcap` လို — စာလုံး အသေး/အကြီး အကြား ပြောင်းလဲပေးတဲ့ functions တွေ၊ pattern matching operators တွေ နဲ့ `to_char` နဲ့ ဆက်စပ်တဲ့ functions တွေမှာလည်း ထည့်သွင်း စဉ်းစားပါတယ်။

Function ဒါမှမဟုတ် operator call တစ်ခုအတွက် — argument collations တွေကို စစ်ဆေးခြင်းအားဖြင့် ဆင်းသက်လာတဲ့ collation ကို — သတ်မှတ်ထားတဲ့ လုပ်ဆောင်မှုကို လုပ်ဆောင်ဖို့ — run time (လုပ်ဆောင်ချိန်) မှာ သုံးပါတယ်။ Function ဒါမှမဟုတ် operator call ရဲ့ ရလဒ်က collatable data type တစ်ခု ဖြစ်နေတယ်ဆိုရင် — ဒီ collation ကို — ပတ်လည်မှာ ၎င်းရဲ့ collation အကြောင်း သိရှိရန် လိုအပ်တဲ့ expression တစ်ခု ရှိနေတတ်တဲ့ ကိစ္စမျိုးအတွက် — function ဒါမှမဟုတ် operator expression ရဲ့ သတ်မှတ်ထားတဲ့ collation အဖြစ် — parse time (parse လုပ်ချိန်) မှာလည်း သုံးပါတယ်။

Expression တစ်ခုရဲ့ *collation derivation* (collation ဆင်းသက် ရယူမှု) က implicit (သွယ်ဝိုက်) ဒါမှမဟုတ် explicit (ထင်ရှား) ဖြစ်နိုင်ပါတယ်။ ဒီ ခြားနားချက်က — expression တစ်ခုထဲမှာ collation အမျိုးမျိုး ပေါ်လာတဲ့အခါ — collations တွေကို ဘယ်လို ပေါင်းစပ်မလဲဆိုတာကို သက်ရောက်ပါတယ်။ Explicit collation derivation က `COLLATE` clause တစ်ခု သုံးတဲ့အခါ ဖြစ်ပြီး — ကျန် collation derivations တွေ အားလုံးကတော့ implicit ဖြစ်ပါတယ်။ Collations အများအပြားကို ပေါင်းစပ်ဖို့ လိုအပ်တဲ့အခါ — ဥပမာ function call တစ်ခုထဲမှာဆိုရင် — အောက်ပါ စည်းမျဉ်းတွေကို သုံးပါတယ်:

1. Input expressions တွေထဲက တစ်ခုခုမှာ explicit collation derivation ရှိနေရင် — input expressions တွေကြားမှာ explicit အနေနဲ့ ဆင်းသက်လာတဲ့ collations တွေ အားလုံးက အတူတူ ဖြစ်ရပါမယ် — မဟုတ်ရင် error တစ်ခု ပေါ်ပေါက်ပါတယ်။ Explicit အနေနဲ့ ဆင်းသက်လာတဲ့ collation တစ်ခုခု ရှိနေရင် — အဲဒါက collation ပေါင်းစပ်မှုရဲ့ ရလဒ် ဖြစ်ပါတယ်။
2. မဟုတ်ရင် — input expressions တွေ အားလုံးက တူညီတဲ့ implicit collation derivation ဒါမှမဟုတ် default collation ရှိရပါမယ်။ Non-default collation တစ်ခုခု ရှိနေရင် — အဲဒါက collation ပေါင်းစပ်မှုရဲ့ ရလဒ် ဖြစ်ပါတယ်။ မရှိဘူးဆိုရင် — ရလဒ်က default collation ပဲ ဖြစ်ပါတယ်။
3. Input expressions တွေကြားမှာ ဆန့်ကျင်နေတဲ့ non-default implicit collations တွေ ရှိနေရင် — ဒီပေါင်းစပ်မှုက indeterminate collation (မသေချာမရေရာသော collation) ရှိတယ်လို့ သတ်မှတ်ပါတယ်။ ဒါက — ခေါ်ယူနေတဲ့ function က သူ သုံးသင့်တဲ့ collation အကြောင်း သိရှိရန် လိုအပ်တဲ့ ကိစ္စမျိုးကလွဲလို့ — error အခြေအနေ (error condition) တစ်ခု မဟုတ်ပါဘူး။ လိုအပ်တယ်ဆိုရင် — error တစ်ခုကို run time မှာ ပေါ်ပေါက်စေပါလိမ့်မယ်။

ဥပမာ — ဒီ table definition (table သတ်မှတ်ချက်) ကို ကြည့်ပါ:

```sql
CREATE TABLE test1 (
    a text COLLATE "de_DE",
    b text COLLATE "es_ES",
    ...
);
```

ဒီ query ထဲမှာဆိုရင်

```sql
SELECT a < 'foo' FROM test1;
```

ဆိုတဲ့ `<` နှိုင်းယှဉ်မှုကို `de_DE` စည်းမျဉ်းတွေအတိုင်း လုပ်ဆောင်ပါတယ် — အကြောင်းကတော့ expression က implicit အနေနဲ့ ဆင်းသက်လာတဲ့ collation တစ်ခုကို default collation နဲ့ ပေါင်းစပ်ထားလို့ပါ။ ဒါပေမယ့်

```sql
SELECT a < ('foo' COLLATE "fr_FR") FROM test1;
```

ဆိုတဲ့ query ထဲမှာတော့ — နှိုင်းယှဉ်မှုကို `fr_FR` စည်းမျဉ်းတွေနဲ့ လုပ်ဆောင်ပါတယ် — အကြောင်းကတော့ explicit collation derivation က implicit တစ်ခုကို ကျော်လွှား (override) လုပ်လို့ပါ။ ထို့အပြင် —

```sql
SELECT a < b FROM test1;
```

ဆိုတဲ့ query မျိုး ပေးထားတယ်ဆိုရင် — `a` နဲ့ `b` columns တွေမှာ ဆန့်ကျင်နေတဲ့ implicit collations တွေ ရှိနေလို့ — ဘယ် collation ကို သုံးရမလဲဆိုတာကို parser (စာကြောင်း ခွဲခြမ်း စိတ်ဖြာသူ) က ဆုံးဖြတ်လို့ မရပါဘူး။ `<` operator က ဘယ် collation သုံးရမယ်ဆိုတာ သိဖို့ တကယ် လိုအပ်တာမို့ — ဒါက error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။ ဒီ error ကို — input expressions နှစ်ခုထဲက တစ်ခုခုဆီ explicit collation specifier (collation သတ်မှတ်ချက်) တစ်ခု တွဲပေးခြင်းအားဖြင့် ဖြေရှင်းနိုင်ပါတယ် — ဒါမျိုးပေါ့:

```sql
SELECT a < b COLLATE "de_DE" FROM test1;
```

ဒါမှမဟုတ် — ညီမျှစွာနဲ့ —

```sql
SELECT a COLLATE "de_DE" < b FROM test1;
```

တဖက်မှာတော့ — ဖွဲ့စည်းပုံအရ ဆင်တူတဲ့ ဒီ query ကတော့ —

```sql
SELECT a || b FROM test1;
```

— error တစ်ခုကို မဖြစ်ပေါ်စေပါဘူး — အကြောင်းကတော့ `||` operator က collations တွေကို ဂရုမစိုက်လို့ပါ: collation ဘယ်လိုပဲ ရှိနေပါစေ — ၎င်းရဲ့ ရလဒ်က အတူတူပဲ ဖြစ်ပါတယ်။

Function ဒါမှမဟုတ် operator ရဲ့ ပေါင်းစပ်ထားတဲ့ input expressions တွေဆီ သတ်မှတ်ပေးထားတဲ့ collation ကို — function ဒါမှမဟုတ် operator က collatable data type တစ်ခုရဲ့ ရလဒ်ကို ပေးအပ်တယ်ဆိုရင် — function ဒါမှမဟုတ် operator ရဲ့ ရလဒ်အပေါ်မှာလည်း သက်ရောက်တယ်လို့ မှတ်ယူပါတယ်။ ဒါကြောင့် —

```sql
SELECT * FROM test1 ORDER BY a || 'foo';
```

— ဆိုတဲ့ query မှာ စီစဉ်မှုကို `de_DE` စည်းမျဉ်းတွေအတိုင်း လုပ်ဆောင်မှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် ဒီ query ကတော့ —

```sql
SELECT * FROM test1 ORDER BY a || b;
```

— error တစ်ခုကို ဖြစ်ပေါ်စေပါတယ် — အကြောင်းကတော့ `||` operator က collation တစ်ခုကို သိရန် မလိုအပ်ပေမယ့် — `ORDER BY` clause ကတော့ လိုအပ်လို့ပါ။ အရင်ကလိုပဲ — ဒီပဋိပက္ခကို explicit collation specifier တစ်ခုနဲ့ ဖြေရှင်းနိုင်ပါတယ်:

```sql
SELECT * FROM test1 ORDER BY a || b COLLATE "fr_FR";
```

### 23.2.2. Managing Collations (Collations များကို စီမံခန့်ခွဲခြင်း)

Collation တစ်ခုက — operating system ထဲမှာ တပ်ဆင်ထားတဲ့ libraries တွေက ထောက်ပံ့ပေးတဲ့ locales တွေဆီ SQL name တစ်ခုကို ပုံဖော် (map) ပေးတဲ့ — SQL schema object တစ်ခု ဖြစ်ပါတယ်။ Collation definition (collation သတ်မှတ်ချက်) တစ်ခုမှာ — locale data ကို ဘယ် library က ထောက်ပံ့ပေးလဲ သတ်မှတ်ပေးတဲ့ — *provider* (ထောက်ပံ့ပေးသူ) တစ်ခု ပါဝင်ပါတယ်။ Standard provider နာမည် တစ်ခုကတော့ `libc` ဖြစ်ပြီး — operating system ရဲ့ C library က ထောက်ပံ့ပေးတဲ့ locales တွေကို သုံးပါတယ်။ အဲဒါတွေက operating system က ထောက်ပံ့ပေးတဲ့ tools အများစု သုံးတဲ့ locales တွေ ဖြစ်ပါတယ်။ နောက် provider တစ်ခုကတော့ `icu` ဖြစ်ပြီး — ပြင်ပ ICU library ကို သုံးပါတယ်။ ICU locales တွေကို — PostgreSQL ကို တည်ဆောက်တဲ့အခါ ICU အတွက် support ကို configure (ပြင်ဆင် သတ်မှတ်) လုပ်ထားမှသာ သုံးလို့ ရပါတယ်။

`libc` က ထောက်ပံ့ပေးတဲ့ collation object တစ်ခုက — `setlocale()` system library call က လက်ခံတဲ့အတိုင်း — `LC_COLLATE` နဲ့ `LC_CTYPE` settings တွေရဲ့ ပေါင်းစပ်မှု တစ်ခုဆီ ပုံဖော်ပါတယ်။ (နာမည်က ညွှန်ပြနေသလိုပဲ — collation တစ်ခုရဲ့ အဓိက ရည်ရွယ်ချက်က စီစဉ်မှု အစဉ်ကို ထိန်းချုပ်တဲ့ `LC_COLLATE` ကို သတ်မှတ်ဖို့ ဖြစ်ပါတယ်။ ဒါပေမယ့် — လက်တွေ့မှာ `LC_COLLATE` နဲ့ မတူညီတဲ့ `LC_CTYPE` setting တစ်ခု ရှိဖို့ဆိုတာ ရှားပါတယ် — ဒါကြောင့် expression တစ်ခုချင်းစီအတွက် `LC_CTYPE` သတ်မှတ်ဖို့ နောက်ထပ် infrastructure (အခြေခံ အဆောက်အအုံစနစ်) တစ်ခု ဖန်တီးရတာထက် — ဒါတွေကို concept တစ်ခုတည်းအောက်မှာ စုစည်းထားတာက ပိုပြီး အဆင်ပြေပါတယ်။) ထို့ပြင် — `libc` collation တစ်ခုက character set encoding (စာလုံး အစုအဝေး encoding) တစ်ခုနဲ့ ချိတ်ဆက်ထားပါတယ် ([အပိုင်း 23.3](https://www.postgresql.org/docs/current/multibyte.html) ကို ကြည့်ပါ)။ Collation နာမည် တစ်ခုတည်းက encoding အမျိုးမျိုးအတွက် တည်ရှိနိုင်ပါတယ်။

`icu` က ထောက်ပံ့ပေးတဲ့ collation object တစ်ခုက — ICU library က ထောက်ပံ့ပေးတဲ့ — နာမည်တပ်ထားတဲ့ collator (နှိုင်းယှဉ် စုစည်းပေးသူ) တစ်ခုဆီ ပုံဖော်ပါတယ်။ ICU က သီးခြား “collate” နဲ့ “ctype” settings တွေကို မထောက်ပံ့ပါဘူး — ဒါကြောင့် အဲဒါတွေက အမြဲတမ်း အတူတူပဲ ဖြစ်ပါတယ်။ ထို့ပြင် — ICU collations တွေက encoding နဲ့ သီးခြား ကင်းလွတ်လို့ — database တစ်ခုထဲမှာ နာမည်ပေးထားတဲ့ ICU collation တစ်ခုရဲ့ — instance တစ်ခုတည်းပဲ အမြဲ ရှိပါတယ်။

#### 23.2.2.1. Standard Collations (Standard collations များ)

Platform (စနစ်) အားလုံးမှာ အောက်ပါ collations တွေကို ထောက်ပံ့ပါတယ်:

- **unicode** — ဒီ SQL standard collation က Default Unicode Collation Element Table နဲ့အတူ Unicode Collation Algorithm (Unicode collation အယ်လဂိုရစ်သမ်) ကို သုံးပြီး စီစဉ်ပါတယ်။ Encoding အားလုံးမှာ ရနိုင်ပါတယ်။ ဒီ collation ကို သုံးဖို့ဆိုရင် ICU support လိုအပ်ပြီး — PostgreSQL ကို ICU ရဲ့ မတူညီတဲ့ version တစ်ခုနဲ့ တည်ဆောက်ထားရင် အပြုအမူ ပြောင်းလဲနိုင်ပါတယ်။ (ဒီ collation က ICU root locale နဲ့ တူညီတဲ့ အပြုအမူ ရှိပါတယ်; und-x-icu (for “undefined”) ကို ကြည့်ပါ။)
- **ucs_basic** — ဒီ SQL standard collation က သဘာဝ ဘာသာစကား အစဉ်လိုက် (natural language order) မဟုတ်ဘဲ — Unicode code point တန်ဖိုးတွေကို သုံးပြီး စီစဉ်ပြီး — ASCII letters “A” ကနေ “Z” အထိပဲ စာလုံးတွေအဖြစ် သဘောထားပါတယ်။ အပြုအမူက version အားလုံးမှာ ထိရောက်ပြီး တည်ငြိမ်ပါတယ်။ Encoding UTF8 အတွက်ပဲ ရနိုင်ပါတယ်။ (ဒီ collation က UTF8 encoding ထဲက libc locale specification C နဲ့ တူညီတဲ့ အပြုအမူ ရှိပါတယ်။)
- **pg_unicode_fast** — ဒီ collation က သဘာဝ ဘာသာစကား အစဉ်လိုက် မဟုတ်ဘဲ — Unicode code point တန်ဖိုးတွေနဲ့ စီစဉ်ပါတယ်။ `lower`, `initcap` နဲ့ `upper` functions တွေအတွက် — Unicode full case mapping ကို သုံးပါတယ်။ Pattern matching (regular expressions တွေ အပါအဝင်) အတွက်တော့ — Unicode Compatibility Properties ရဲ့ Standard variant ကို သုံးပါတယ်။ အပြုအမူက Postgres major version တစ်ခုအတွင်း ထိရောက်ပြီး တည်ငြိမ်ပါတယ်။ Encoding UTF8 အတွက်ပဲ ရနိုင်ပါတယ်။
- **pg_c_utf8** — ဒီ collation က သဘာဝ ဘာသာစကား အစဉ်လိုက် မဟုတ်ဘဲ — Unicode code point တန်ဖိုးတွေနဲ့ စီစဉ်ပြီး — `lower`, `initcap` နဲ့ `upper` functions တွေအတွက်တော့ Unicode simple case mapping ကို သုံးပါတယ်။ Pattern matching (regular expressions တွေ အပါအဝင်) အတွက်တော့ — Unicode Compatibility Properties ရဲ့ POSIX Compatible variant ကို သုံးပါတယ်။ အပြုအမူက PostgreSQL major version တစ်ခုအတွင်း ထိရောက်ပြီး တည်ငြိမ်ပါတယ်။ ဒီ collation က encoding UTF8 အတွက်ပဲ ရနိုင်ပါတယ်။
- **C (equivalent to POSIX)** — C နဲ့ POSIX collations တွေက “traditional C” အပြုအမူအပေါ် အခြေခံပါတယ်။ ၎င်းတို့က သဘာဝ ဘာသာစကား အစဉ်လိုက် မဟုတ်ဘဲ — byte တန်ဖိုးတွေနဲ့ စီစဉ်ပြီး — ASCII letters “A” ကနေ “Z” အထိပဲ စာလုံးတွေအဖြစ် သဘောထားပါတယ်။ အပြုအမူက database encoding တစ်ခု ပေးထားချက်အတွက် version အားလုံးမှာ ထိရောက်ပြီး တည်ငြိမ်ပေမယ့် — database encodings အမျိုးမျိုးကြားမှာတော့ အပြုအမူ ကွဲပြားနိုင်ပါတယ်။
- **default** — default collation က database ဖန်တီးချိန်မှာ သတ်မှတ်ထားတဲ့ locale ကို ရွေးချယ်ပါတယ်။

Operating system ရဲ့ ထောက်ပံ့မှုပေါ် မူတည်ပြီး — နောက်ထပ် collations တွေလည်း ရနိုင်ပါသေးတယ်။ ဒီ နောက်ထပ် collations တွေရဲ့ ထိရောက်မှုနဲ့ တည်ငြိမ်မှုက collation provider၊ provider ရဲ့ version နဲ့ locale အပေါ်မှာ မူတည်ပါတယ်။

#### 23.2.2.2. Predefined Collations (ကြိုတင် သတ်မှတ်ထားသော collations များ)

Operating system က — program တစ်ခုတည်းအတွင်း locales အများအပြား သုံးခြင်းအတွက် (`newlocale` နဲ့ ဆက်စပ်တဲ့ functions တွေ) support ပေးတယ်ဆိုရင် — ဒါမှမဟုတ် ICU အတွက် support ကို configure လုပ်ထားတယ်ဆိုရင် — database cluster တစ်ခုကို initialize (ကနဦး ပြင်ဆင်) လုပ်တဲ့အခါ — `initdb` က — အဲဒီအချိန်မှာ operating system ထဲမှာ တွေ့ရှိတဲ့ locales တွေ အားလုံးကို အခြေခံပြီး — `pg_collation` system catalog (စနစ် ကက်တလောက်) ကို collations တွေနဲ့ ဖြည့်တင်း (populate) ပါတယ်။

လက်ရှိ ရနိုင်တဲ့ locales တွေကို စစ်ဆေးဖို့ — `SELECT * FROM pg_collation` query ဒါမှမဟုတ် psql ထဲက `\dOS+` command ကို သုံးပါ။

##### 23.2.2.2.1. libc Collations (libc collations များ)

ဥပမာ — operating system က `de_DE.utf8` လို့ နာမည်ရှိတဲ့ locale တစ်ခုကို ထောက်ပံ့ပေးနိုင်ပါတယ်။ `initdb` က အဲဒီအခါ — `LC_COLLATE` ရော `LC_CTYPE` ပါ `de_DE.utf8` လို့ သတ်မှတ်ထားတဲ့ — encoding `UTF8` အတွက် `de_DE.utf8` လို့ နာမည်ရှိတဲ့ collation တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။ နာမည်ကနေ `.utf8` tag ကို ဖယ်ထားတဲ့ (stripped) collation တစ်ခုကိုလည်း ဖန်တီးပါလိမ့်မယ်။ ဒါကြောင့် — collation ကို `de_DE` ဆိုတဲ့ နာမည်အောက်မှာလည်း သုံးနိုင်ပြီး — အဲဒါက ရေးရတာ ပိုလွယ်ကူပြီး — နာမည်ကို encoding အပေါ် မှီခိုမှု နည်းစေပါတယ်။ ဒါပေမယ့် — ကနဦး collation နာမည် အစုက platform အပေါ်မှာ မူတည်တယ်ဆိုတာ သတိပြုပါ။

`libc` က ထောက်ပံ့ပေးတဲ့ default collations အစုက operating system ထဲမှာ တပ်ဆင်ထားတဲ့ locales တွေဆီ တိုက်ရိုက် ပုံဖော်ပြီး — အဲဒါတွေကို `locale -a` command သုံးပြီး စာရင်းပြနိုင်ပါတယ်။ `LC_COLLATE` နဲ့ `LC_CTYPE` အတွက် မတူညီတဲ့ တန်ဖိုးတွေ ရှိတဲ့ `libc` collation တစ်ခု လိုအပ်တယ်ဆိုရင် — ဒါမှမဟုတ် database system ကို initialize လုပ်ပြီးမှ operating system ထဲမှာ locale အသစ်တွေ တပ်ဆင်လိုက်တယ်ဆိုရင် — [CREATE COLLATION](https://www.postgresql.org/docs/current/sql-createcollation.html) command ကို သုံးပြီး collation အသစ်တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ Operating system locale အသစ်တွေကို — [`pg_import_system_collations()`](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-COLLATION) function သုံးပြီး — အမြောက်အများ (en masse) တင်သွင်းလို့လည်း ရပါတယ်။

Database တစ်ခုချင်းစီအတွင်း — အဲဒီ database ရဲ့ encoding ကို သုံးတဲ့ collations တွေပဲ သက်ဆိုင်ပါတယ်။ `pg_collation` ထဲက တခြား entries တွေကိုတော့ လျစ်လျူရှုပါတယ်။ ဒါကြောင့် — `de_DE` လို tag ဖယ်ထားတဲ့ collation နာမည်တစ်ခုကို — ကမ္ဘာအနှံ့ (globally) မှာ ထူးခြားမှု ရှိမှာ မဟုတ်ပေမယ့် — database တစ်ခု ပေးထားချက်အတွင်းမှာတော့ ထူးခြားတယ်လို့ ယူဆနိုင်ပါတယ်။ နောက် database encoding တစ်ခုဆီ ပြောင်းဖို့ ဆုံးဖြတ်လိုက်ရင် — ပြောင်းစရာ တစ်ခု နည်းသွားစေတာမို့ — tag ဖယ်ထားတဲ့ collation နာမည်တွေကို သုံးဖို့ အကြံပြုပါတယ်။ ဒါပေမယ့် `default`, `C` နဲ့ `POSIX` collations တွေကတော့ — database encoding ဘာပဲ ဖြစ်ဖြစ် သုံးလို့ ရတယ်ဆိုတာ သတိပြုပါ။

PostgreSQL က — သီးခြား collation objects တွေကို — ဂုဏ်သတ္တိ (properties) အတူတူ ရှိနေရင်တောင် — တစ်ခုနဲ့တစ်ခု လိုက်ဖက် မညီဘူးလို့ မှတ်ယူပါတယ်။ ဥပမာ —

```sql
SELECT a COLLATE "C" < b COLLATE "POSIX" FROM test1;
```

— ဆိုတဲ့ query က — `C` နဲ့ `POSIX` collations တွေရဲ့ အပြုအမူတွေ အတူတူပဲ ဖြစ်နေပေမယ့် — error တစ်ခု ဖြစ်ပေါ်စေပါလိမ့်မယ်။ Tag ဖယ်ထားတဲ့ နဲ့ မဖယ်ထားတဲ့ collation နာမည်တွေ ရောနှော သုံးတာကို ဒါကြောင့် အကြံမပြုပါဘူး။

##### 23.2.2.2.2. ICU Collations (ICU collations များ)

ICU နဲ့ဆိုရင် — ဖြစ်နိုင်တဲ့ locale နာမည် အားလုံးကို စာရင်း ပြုစုတာက အဓိပ္ပာယ် မရှိပါဘူး။ ICU က locale တွေအတွက် သီးခြား နာမည်ပေးစနစ် တစ်ခု သုံးပေမယ့် — တကယ့် သီးခြား locales တွေထက် — locale တစ်ခုကို နာမည်ပေးလို့ ရတဲ့ နည်းလမ်းတွေက အများကြီး ပိုများပါတယ်။ `initdb` က ကနဦး collations အစုကို ဖြည့်တင်းဖို့ — သီးခြား locales အစုတစ်ခုကို ထုတ်ယူဖို့ ICU APIs တွေကို သုံးပါတယ်။ ICU က ထောက်ပံ့ပေးတဲ့ collations တွေကို — libc locales တွေနဲ့ ခွဲခြားဖို့ — “private use” extension `-x-icu` တစ်ခု နောက်မှာ ဆက်ထည့်ပြီး — BCP 47 language tag format နဲ့ နာမည်တွေကို သုံးပြီး — SQL environment ထဲမှာ ဖန်တီးပါတယ်။

ဖန်တီးခံရနိုင်တဲ့ ဥပမာ collations အချို့ကတော့:

- **de-x-icu #** — ဂျာမန် collation၊ default မူကွဲ
- **de-AT-x-icu #** — သြစတြီးယားအတွက် ဂျာမန် collation၊ default မူကွဲ
(ဥပမာ — de-DE-x-icu ဒါမှမဟုတ် de-CH-x-icu တွေလည်း ရှိပါသေးတယ် — ဒါပေမယ့် ဒီစာရေး နေတဲ့အချိန်အထိ — ၎င်းတို့က de-x-icu နဲ့ ညီမျှပါတယ်။)
- **und-x-icu (for “undefined”) #** — ICU ရဲ့ “root” collation ပါ။ ကျိုးကြောင်းဆီလျော်တဲ့ — ဘာသာစကား ကင်းလွတ်တဲ့ (language-agnostic) — စီစဉ်မှု အစဉ် တစ်ခုရဖို့ ဒါကို သုံးပါ။

ICU က — (သိပ် အသုံးမများတဲ့) encodings အချို့ကို မထောက်ပံ့ပါဘူး။ Database encoding က ဒီထဲက တစ်ခု ဖြစ်နေတဲ့အခါ — `pg_collation` ထဲက ICU collation entries တွေကို လျစ်လျူရှုပါတယ်။ အဲဒါတွေထဲက တစ်ခုကို သုံးဖို့ ကြိုးစားရင် — “collation "de-x-icu" for encoding "WIN874" does not exist” ဆိုတဲ့ ပုံစံမျိုး error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

#### 23.2.2.3. Creating New Collation Objects (Collation object အသစ်များ ဖန်တီးခြင်း)

Standard နဲ့ predefined collations တွေ မလုံလောက်ဘူးဆိုရင် — users တွေက [CREATE COLLATION](https://www.postgresql.org/docs/current/sql-createcollation.html) SQL command ကို သုံးပြီး — သူတို့ရဲ့ ကိုယ်ပိုင် collation objects တွေကို ဖန်တီးနိုင်ပါတယ်။

Standard နဲ့ predefined collations တွေက — တခြား predefined objects တွေလိုပဲ — `pg_catalog` schema ထဲမှာ ရှိပါတယ်။ User-defined collations တွေကိုတော့ user schemas တွေထဲမှာ ဖန်တီးသင့်ပါတယ်။ ဒါက ၎င်းတို့ကို `pg_dump` က သိမ်းဆည်း (save) နိုင်စေဖို့လည်း သေချာစေပါတယ်။

##### 23.2.2.3.1. libc Collations (libc collations များ)

libc collations အသစ်တွေကို ဒီလို ဖန်တီးနိုင်ပါတယ်:

```sql
CREATE COLLATION german (provider = libc, locale = 'de_DE');
```

ဒီ command ထဲက `locale` clause အတွက် လက်ခံနိုင်တဲ့ တိကျတဲ့ တန်ဖိုးတွေက operating system အပေါ်မှာ မူတည်ပါတယ်။ Unix နဲ့ ဆင်တူတဲ့ (Unix-like) system တွေမှာ — `locale -a` command က စာရင်းတစ်ခုကို ပြပါလိမ့်မယ်။

Database instance ကို initialize လုပ်တဲ့အခါ — operating system ထဲမှာ သတ်မှတ်ထားတဲ့ collations တွေ အားလုံးကို predefined libc collations တွေက ကြိုတင် ပါဝင်ပြီးသား ဖြစ်လို့ — အသစ်တွေကို လက်နဲ့ ဖန်တီးဖို့ မကြာခဏ လိုအပ်လေ့ မရှိပါဘူး။ ဖြစ်နိုင်တဲ့ အကြောင်းရင်းတွေကတော့ — မတူညီတဲ့ နာမည်ပေးစနစ် တစ်ခု လိုချင်တာ (ဒီကိစ္စမှာ [အပိုင်း 23.2.2.3.3](https://www.postgresql.org/docs/current/collation.html#COLLATION-COPY) ကိုလည်း ကြည့်ပါ) ဒါမှမဟုတ် — operating system က locale definitions အသစ်တွေ ထောက်ပံ့ဖို့ upgrade (အဆင့်မြှင့်) လုပ်ခံရတာ (ဒီကိစ္စမှာ [`pg_import_system_collations()`](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-COLLATION) ကိုလည်း ကြည့်ပါ) တို့ ဖြစ်ပါတယ်။

##### 23.2.2.3.2. ICU Collations (ICU collations များ)

ICU collations တွေကို ဒီလို ဖန်တီးနိုင်ပါတယ်:

```sql
CREATE COLLATION german (provider = icu, locale = 'de-DE');
```

ICU locales တွေကို BCP 47 [Language Tag](https://www.postgresql.org/docs/current/locale.html#ICU-LANGUAGE-TAG) တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး — libc ပုံစံ locale နာမည် (libc-style locale name) အများစုကိုလည်း လက်ခံပါတယ်။ ဖြစ်နိုင်ရင် — libc ပုံစံ locale နာမည်တွေကို language tags တွေအဖြစ် ပြောင်းလဲပေးပါတယ်။

ICU collations အသစ်တွေက — language tag ထဲမှာ collation attributes (collation ဂုဏ်ရည်များ) တွေ ထည့်သွင်းခြင်းအားဖြင့် — collation အပြုအမူကို ကျယ်ကျယ်ပြန့်ပြန့် စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။ အသေးစိတ်နဲ့ ဥပမာတွေအတွက် [အပိုင်း 23.2.3](https://www.postgresql.org/docs/current/collation.html#ICU-CUSTOM-COLLATIONS) ကို ကြည့်ပါ။

##### 23.2.2.3.3. Copying Collations (Collations များကို ကူးယူခြင်း)

[CREATE COLLATION](https://www.postgresql.org/docs/current/sql-createcollation.html) command ကို — ရှိပြီးသား collation တစ်ခုကနေ collation အသစ်တစ်ခု ဖန်တီးဖို့လည်း သုံးနိုင်ပါတယ် — ဒါက — application တွေထဲမှာ operating system နဲ့ သီးခြား ကင်းလွတ်တဲ့ collation နာမည်တွေ သုံးနိုင်ဖို့၊ compatibility နာမည်တွေ ဖန်တီးဖို့ ဒါမှမဟုတ် ICU က ထောက်ပံ့တဲ့ collation တစ်ခုကို ပိုဖတ်ရလွယ်တဲ့ နာမည်တစ်ခုအောက်မှာ သုံးနိုင်ဖို့ အသုံးဝင်နိုင်ပါတယ်။ ဥပမာ:

```sql
CREATE COLLATION german FROM "de_DE";
CREATE COLLATION french FROM "fr-x-icu";
```

#### 23.2.2.4. Nondeterministic Collations (Deterministic မဟုတ်သော collations များ)

Collation တစ်ခုက *deterministic* (ပြတ်သားသော) ဒါမှမဟုတ် *nondeterministic* (ပြတ်သားမှု မရှိသော) ဖြစ်ပါတယ်။ Deterministic collation တစ်ခုက deterministic comparisons (ပြတ်သားသော နှိုင်းယှဉ်မှုများ) တွေကို သုံးပြီး — ဆိုလိုတာက — strings တွေက တူညီတဲ့ byte sequence (byte အစီအစဉ်) တစ်ခုတည်းနဲ့ ဖွဲ့စည်းထားမှသာ ညီမျှတယ်လို့ သဘောထားပါတယ်။ Nondeterministic comparison ကတော့ — strings တွေက byte အမျိုးမျိုးနဲ့ ဖွဲ့စည်းထားရင်တောင် ညီမျှတယ်လို့ ဆုံးဖြတ်နိုင်ပါတယ်။ ပုံမှန် အခြေအနေတွေကတော့ — case-insensitive (စာလုံးအကြီး/အသေး အာရုံမခံသော) comparison၊ accent-insensitive (လေယူလေသိမ်း အာရုံမခံသော) comparison နဲ့ — Unicode normal forms (Unicode စံပုံစံများ) အမျိုးမျိုးထဲက strings တွေရဲ့ နှိုင်းယှဉ်မှု တို့ ဖြစ်ပါတယ်။ ဒီလို insensitive comparisons တွေကို တကယ် အကောင်အထည် ဖော်တာက collation provider ရဲ့ တာဝန် ဖြစ်ပြီး — deterministic flag က — သရေကျမှု (ties) တွေကို bytewise comparison (byte အလိုက် နှိုင်းယှဉ်မှု) နဲ့ ဖြေရှင်းရမလားဆိုတာကိုပဲ ဆုံးဖြတ်ပေးပါတယ်။ ဒီ terminology (ဝေါဟာရ) အကြောင်း နောက်ထပ် အချက်အလက်အတွက် [Unicode Technical Standard 10](https://www.unicode.org/reports/tr10) ကိုလည်း ကြည့်ပါ။

Nondeterministic collation တစ်ခု ဖန်တီးဖို့ — `CREATE COLLATION` ဆီ `deterministic = false` ဆိုတဲ့ property ကို သတ်မှတ်ပါ — ဥပမာ:

```sql
CREATE COLLATION ndcoll (provider = icu, locale = 'und', deterministic = false);
```

ဒီဥပမာက standard Unicode collation ကို nondeterministic နည်းနဲ့ သုံးမှာ ဖြစ်ပါတယ်။ အထူးသဖြင့် — ဒါက normal forms အမျိုးမျိုးထဲက strings တွေကို မှန်ကန်စွာ နှိုင်းယှဉ်နိုင်စေပါလိမ့်မယ်။ ပိုစိတ်ဝင်စားစရာ ကောင်းတဲ့ ဥပမာတွေကတော့ — အပေါ်မှာ ရှင်းပြထားတဲ့ ICU customization facilities (စိတ်ကြိုက် ပြင်ဆင်ရေး ယန္တရားများ) တွေကို အသုံးပြုပါတယ်။ ဥပမာ:

```sql
CREATE COLLATION case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
CREATE COLLATION ignore_accents (provider = icu, locale = 'und-u-ks-level1-kc-true', deterministic = false);
```

Standard နဲ့ predefined collations တွေ အားလုံးက deterministic ဖြစ်ပြီး — user-defined collations တွေ အားလုံးကလည်း default အနေနဲ့ deterministic ဖြစ်ပါတယ်။ Nondeterministic collations တွေက — အထူးသဖြင့် Unicode ရဲ့ အစွမ်း အပြည့်နဲ့ ၎င်းရဲ့ အထူး ကိစ္စ အများအပြားကို ထည့်သွင်း စဉ်းစားတဲ့အခါ — ပိုပြီး “မှန်ကန်” တဲ့ အပြုအမူတွေ ပေးစွမ်းပေမယ့် — အားနည်းချက်တွေလည်း ရှိပါတယ်။ ပထမဆုံး အချက်က — ၎င်းတို့ သုံးခြင်းက performance ထိခိုက်မှု (performance penalty) တစ်ခုကို ဖြစ်စေပါတယ်။ အထူးသဖြင့် — B-tree က nondeterministic collation တစ်ခုကို သုံးတဲ့ indexes တွေနဲ့ deduplication (ထပ်နေမှု ဖယ်ရှားခြင်း) ကို မသုံးနိုင်ဘူးဆိုတာ သတိပြုပါ။ ထို့ပြင် — nondeterministic collations တွေနဲ့ မလုပ်နိုင်တဲ့ လုပ်ဆောင်မှုတွေ ရှိပါတယ် — ဥပမာ pattern matching လုပ်ဆောင်မှု အချို့ပါ။ ဒါကြောင့် — ၎င်းတို့ကို အထူး လိုအပ်တဲ့ ကိစ္စတွေမှာပဲ သုံးသင့်ပါတယ်။

> **အကြံပြုချက်:** Unicode normalization forms အမျိုးမျိုးထဲက text တွေကို ကိုင်တွယ်ဖို့ — nondeterministic collations တွေ သုံးမည့်အစား — strings တွေကို ကြိုတင် ပြုပြင်ဖို့ (preprocess) ဒါမှမဟုတ် စစ်ဆေးဖို့ `normalize` နဲ့ `is normalized` functions/expressions တွေကို သုံးတာကလည်း option တစ်ခု ဖြစ်ပါတယ်။ နည်းလမ်း တစ်ခုချင်းစီအတွက် မတူညီတဲ့ trade-offs (အကျိုးအမြတ်နှင့် ဆုံးရှုံးမှု ချိန်ခွင်လျှာများ) ရှိပါတယ်။

### 23.2.3. ICU Custom Collations (ICU စိတ်ကြိုက် collations များ)

ICU က — collation settings တွေကို language tag ရဲ့ အစိတ်အပိုင်း တစ်ခုအနေနဲ့ ထည့်သွင်းထားတဲ့ collations အသစ်တွေ သတ်မှတ်ခြင်းအားဖြင့် — collation အပြုအမူအပေါ် ကျယ်ပြန့်တဲ့ ထိန်းချုပ်မှု ခွင့်ပြုပါတယ်။ ဒီ settings တွေက လိုအပ်ချက် အမျိုးမျိုးနဲ့ ကိုက်ညီအောင် collation order ကို ပြုပြင် နိုင်ပါတယ်။ ဥပမာ:

```sql
-- ignore differences in accents and case
CREATE COLLATION ignore_accent_case (provider = icu, deterministic = false, locale = 'und-u-ks-level1');
SELECT 'Å' = 'A' COLLATE ignore_accent_case; -- true
SELECT 'z' = 'Z' COLLATE ignore_accent_case; -- true

-- upper case letters sort before lower case.
CREATE COLLATION upper_first (provider = icu, locale = 'und-u-kf-upper');
SELECT 'B' < 'b' COLLATE upper_first; -- true

-- treat digits numerically and ignore punctuation
CREATE COLLATION num_ignore_punct (provider = icu, deterministic = false, locale = 'und-u-ka-shifted-kn');
SELECT 'id-45' < 'id-123' COLLATE num_ignore_punct; -- true
SELECT 'w;x*y-z' = 'wxyz' COLLATE num_ignore_punct; -- true
```

ရနိုင်တဲ့ options တွေ အများစုကို [အပိုင်း 23.2.3.2](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-SETTINGS) မှာ ဖော်ပြထားပြီး — နောက်ထပ် အသေးစိတ်တွေအတွက် [အပိုင်း 23.2.3.5](https://www.postgresql.org/docs/current/collation.html#ICU-EXTERNAL-REFERENCES) ကို ကြည့်ပါ။

#### 23.2.3.1. ICU Comparison Levels (ICU နှိုင်းယှဉ်မှု အဆင့်များ)

ICU မှာ strings နှစ်ခုရဲ့ နှိုင်းယှဉ်မှု (collation) ကို — textual features (စာသား သွင်ပြင်လက္ခဏာများ) တွေကို “levels” (အဆင့်များ) အဖြစ် အုပ်စုဖွဲ့ထားတဲ့ — အဆင့်ပေါင်းများစွာ ပါဝင်တဲ့ လုပ်ငန်းစဉ် (multi-level process) တစ်ခုက ဆုံးဖြတ်ပါတယ်။ အဆင့် တစ်ခုချင်းစီရဲ့ ကိုင်တွယ်ပုံကို [collation settings](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-SETTINGS-TABLE) တွေက ထိန်းချုပ်ပါတယ်။ အဆင့် မြင့်လေလေ — ပိုမို သိမ်မွေ့တဲ့ textual features တွေနဲ့ ဆက်စပ်လေလေ ဖြစ်ပါတယ်။

[ဇယား 23.1](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-LEVELS) က — ပေးထားတဲ့ အဆင့်မှာ ညီမျှမှု ဆုံးဖြတ်တဲ့အခါ — ဘယ် textual feature ခြားနားချက်တွေကို အရေးပါတယ်လို့ ယူဆလဲ ပြပါတယ်။ `U+2063` Unicode character က မမြင်ရတဲ့ separator (ခွဲခြားပေးသည့် အမှတ်) တစ်ခု ဖြစ်ပြီး — ဇယားထဲမှာ မြင်ရတဲ့အတိုင်း — `identic` ထက် နိမ့်တဲ့ နှိုင်းယှဉ်မှု အဆင့်တွေ အားလုံးမှာ လျစ်လျူရှုပါတယ်။

**Table 23.1. ICU Collation Levels (ICU collation အဆင့်များ)**

| Level (အဆင့်) | Description (ဖော်ပြချက်) | `'f' = 'f'` | `'ab' = U&'a\2063b'` | `'x-y' = 'x_y'` | `'g' = 'G'` | `'n' = 'ñ'` | `'y' = 'z'` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| level1 | Base Character (အခြေခံ စာလုံး) | `true` | `true` | `true` | `true` | `true` | `false` |
| level2 | Accents (လေယူလေသိမ်း အမှတ်များ) | `true` | `true` | `true` | `true` | `false` | `false` |
| level3 | Case/Variants (စာလုံး အကြီးအသေး/မူကွဲများ) | `true` | `true` | `true` | `false` | `false` | `false` |
| level4 | Punctuation[a] (ပုဒ်ဖြတ် သင်္ကေတများ) | `true` | `true` | `false` | `false` | `false` | `false` |
| identic | All (အားလုံး) | `true` | `false` | `false` | `false` | `false` | `false` |
| [a] ka-shifted ဖြင့်သာ; ဇယား 23.2 ကို ကြည့်ပါ |  |  |  |  |  |  |  |

အဆင့်တိုင်းမှာ — full normalization ပိတ်ထားရင်တောင် — basic normalization ကို လုပ်ဆောင်ပါတယ်။ ဥပမာ — `'á'` ကို code points `U&'\0061\0301'` တွေနဲ့ ဖြစ်စေ — ဒါမှမဟုတ် code point တစ်ခုတည်း `U&'\00E1'` နဲ့ ဖြစ်စေ ဖွဲ့စည်းထားနိုင်ပြီး — အဲဒီ sequences တွေကို `identic` အဆင့်မှာတောင် ညီမျှတယ်လို့ ယူဆပါတယ်။ Code point ကိုယ်စားပြုမှု ထဲမှာ ခြားနားချက် ရှိသမျှကို သီးခြား အဖြစ် သဘောထားချင်တယ်ဆိုရင် — `deterministic` ကို `true` လို့ သတ်မှတ်ပြီး ဖန်တီးထားတဲ့ collation တစ်ခုကို သုံးပါ။

##### 23.2.3.1.1. Collation Level Examples (Collation အဆင့် ဥပမာများ)

```sql
CREATE COLLATION level3 (provider = icu, deterministic = false, locale = 'und-u-ka-shifted-ks-level3');
CREATE COLLATION level4 (provider = icu, deterministic = false, locale = 'und-u-ka-shifted-ks-level4');
CREATE COLLATION identic (provider = icu, deterministic = false, locale = 'und-u-ka-shifted-ks-identic');

-- invisible separator ignored at all levels except identic
SELECT 'ab' = U&'a\2063b' COLLATE level4; -- true
SELECT 'ab' = U&'a\2063b' COLLATE identic; -- false

-- punctuation ignored at level3 but not at level 4
SELECT 'x-y' = 'x_y' COLLATE level3; -- true
SELECT 'x-y' = 'x_y' COLLATE level4; -- false
```

#### 23.2.3.2. Collation Settings for an ICU Locale (ICU locale တစ်ခုအတွက် collation ဆက်တင်များ)

[ဇယား 23.2](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-SETTINGS-TABLE) က — collation တစ်ခုကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ language tag တစ်ခုရဲ့ အစိတ်အပိုင်းအဖြစ် သုံးနိုင်တဲ့ — ရနိုင်တဲ့ collation settings တွေကို ပြပါတယ်။

**Table 23.2. ICU Collation Settings (ICU collation ဆက်တင်များ)**

| Key | Values | Default | Description |
| --- | --- | --- | --- |
| `co` | `emoji`, `phonebk`, `standard`, `...` | `standard` | Collation type (collation အမျိုးအစား)။ နောက်ထပ် options နဲ့ အသေးစိတ်တွေအတွက် [အပိုင်း 23.2.3.5](https://www.postgresql.org/docs/current/collation.html#ICU-EXTERNAL-REFERENCES) ကို ကြည့်ပါ။ |
| `ka` | `noignore`, `shifted` | `noignore` | `shifted` လို့ သတ်မှတ်ထားရင် — နှိုင်းယှဉ်မှုထဲမှာ character အချို့ (ဥပမာ — punctuation ဒါမှမဟုတ် space) ကို လျစ်လျူရှုစေပါတယ်။ အကျိုးသက်ရောက်ဖို့ဆိုရင် `ks` key ကို `level3` ဒါမှမဟုတ် ၎င်းထက် နိမ့်တဲ့ level လို့ သတ်မှတ်ထားရပါမယ်။ ဘယ် character classes တွေကို လျစ်လျူရှုမလဲ ထိန်းချုပ်ဖို့ `kv` key ကို သတ်မှတ်ပါ။ |
| `kb` | `true`, `false` | `false` | level 2 ခြားနားချက်တွေအတွက် backwards comparison (နောက်ပြန် နှိုင်းယှဉ်မှု) ဖြစ်ပါတယ်။ ဥပမာ — `und-u-kb` locale က `'àe'` ကို `'aé'` ရဲ့ ရှေ့မှာ စီပါတယ်။ |
| `kc` | `true`, `false` | `false` | case ကို — accents တွေနဲ့ တခြား level 3 features တွေကြားမှာ ကျရောက်တဲ့ “level 2.5” အဖြစ် ပိုင်းခြားပေးပါတယ်။ `true` လို့ သတ်မှတ်ပြီး ks ကို level1 လို့ သတ်မှတ်ထားရင် — accents တွေကို လျစ်လျူရှုပေမယ့် — case ကိုတော့ ထည့်သွင်း စဉ်းစားပါလိမ့်မယ်။ |
| `kf` | `upper`, `lower`, `false` | `false` | `upper` လို့ သတ်မှတ်ထားရင် — စာလုံးအကြီးတွေက စာလုံးအသေးတွေ ရှေ့မှာ စီပါတယ်။ `lower` လို့ သတ်မှတ်ထားရင် — စာလုံးအသေးတွေက စာလုံးအကြီးတွေ ရှေ့မှာ စီပါတယ်။ `false` လို့ သတ်မှတ်ထားရင် — စီစဉ်မှုက locale ရဲ့ စည်းမျဉ်းတွေပေါ်မှာ မူတည်ပါတယ်။ |
| `kn` | `true`, `false` | `false` | `true` လို့ သတ်မှတ်ထားရင် — string တစ်ခုအတွင်းက ဂဏန်းတွေကို — digit တွေရဲ့ အစီအစဉ် (sequence) တစ်ခုအနေနဲ့ မဟုတ်ဘဲ — ဂဏန်းတန်ဖိုး တစ်ခုတည်း (single numeric value) အနေနဲ့ သဘောထားပါတယ်။ ဥပမာ — `'id-45'` က `'id-123'` ရဲ့ ရှေ့မှာ စီပါတယ်။ |
| `kk` | `true`, `false` | `false` | full normalization ကို enable (ဖွင့်) လုပ်ပါတယ်; performance ကို သက်ရောက်နိုင်ပါတယ်။ `false` လို့ သတ်မှတ်ထားရင်တောင် basic normalization ကို လုပ်ဆောင်ပါတယ်။ Full normalization လိုအပ်တဲ့ ဘာသာစကားတွေရဲ့ locales တွေက ပုံမှန်အားဖြင့် ၎င်းကို default အနေနဲ့ enable လုပ်ပါတယ်။ Full normalization က အချို့ ကိစ္စတွေမှာ အရေးကြီးပါတယ် — ဥပမာ — character တစ်ခုတည်းပေါ်မှာ accent အများအပြား သက်ရောက်နေတဲ့အခါမျိုးပါ။ ဥပမာ — U&'\0065\0323\0302' နဲ့ U&'\0065\0302\0323' code point sequences တွေက — circumflex နဲ့ dot-below accents တွေကို အစီအစဉ် မတူညီဘဲ သက်ရောက်ထားတဲ့ e တစ်လုံးကို ကိုယ်စားပြုပါတယ်။ Full normalization ဖွင့်ထားရင် — ဒီ code point sequences တွေကို ညီမျှတယ်လို့ သဘောထားပြီး — မဟုတ်ရင်တော့ မညီမျှပါဘူး။ |
| `kr` | `space`, `punct`, `symbol`, `currency`, `digit`, `script-id` |  | valid values တွေထဲက တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို ဒါမှမဟုတ် — BCP 47 script-id ဘယ်ဟာမဆို — ဥပမာ latn (“Latin”) ဒါမှမဟုတ် grek (“Greek”) — လို့ သတ်မှတ်နိုင်ပါတယ်။ Values အများအပြားကို “-” နဲ့ ခွဲခြားပါတယ်။ Character class တွေရဲ့ အစီအစဉ်ကို ပြန်လည် သတ်မှတ်ပေးပြီး — စာရင်းထဲမှာ ရှေ့ကျတဲ့ class တစ်ခုထဲက characters တွေက — စာရင်းထဲမှာ နောက်ကျတဲ့ class တစ်ခုထဲက characters တွေ ရှေ့မှာ စီပါတယ်။ ဥပမာ — digit-currency-space ဆိုတဲ့ တန်ဖိုးက (und-u-kr-digit-currency-space လို language tag တစ်ခုရဲ့ အစိတ်အပိုင်းအဖြစ်) — punctuation တွေကို digits နဲ့ spaces တွေ ရှေ့မှာ စီစေပါတယ်။ |
| `ks` | `level1`, `level2`, `level3`, `level4`, `identic` | `level3` | ညီမျှမှု ဆုံးဖြတ်တဲ့အခါ — sensitivity (အာရုံခံနိုင်မှု) (သို့မဟုတ် “strength”) ဖြစ်ပြီး — `level1` က ခြားနားချက်တွေကို အာရုံခံနိုင်မှု အနည်းဆုံး ဖြစ်ပြီး — `identic` ကတော့ ခြားနားချက်တွေကို အာရုံခံနိုင်မှု အများဆုံး ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် [ဇယား 23.1](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-LEVELS) ကို ကြည့်ပါ။ |
| `kv` | `space`, `punct`, `symbol`, `currency` | `punct` | level 3 မှာ နှိုင်းယှဉ်မှုအတွင်း လျစ်လျူရှုတဲ့ character classes တွေ ဖြစ်ပါတယ်။ နောက်ကျတဲ့ တန်ဖိုး တစ်ခုကို သတ်မှတ်ရင် ရှေ့က တန်ဖိုးတွေကိုပါ ပါဝင်စေပါတယ် — ဥပမာ — `symbol` က လျစ်လျူရှုရမယ့် characters တွေထဲမှာ `punct` နဲ့ `space` တွေကိုပါ ထည့်သွင်းပါတယ်။ အကျိုးသက်ရောက်ဖို့ဆိုရင် `ka` key ကို `shifted` လို့ သတ်မှတ်ပြီး — `ks` key ကို `level3` ဒါမှမဟုတ် ၎င်းထက် နိမ့်တဲ့ level လို့ သတ်မှတ်ထားရပါမယ်။ |

Defaults တွေက locale ပေါ်မှာ မူတည်နိုင်ပါတယ်။ အပေါ်က ဇယားက ပြည့်စုံတယ်လို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ နောက်ထပ် options နဲ့ အသေးစိတ်တွေအတွက် [အပိုင်း 23.2.3.5](https://www.postgresql.org/docs/current/collation.html#ICU-EXTERNAL-REFERENCES) ကို ကြည့်ပါ။

> **မှတ်ချက်:** Collation settings အများအပြားအတွက် — setting က လိုချင်တဲ့ အာနိသင် ရှိဖို့ — collation ကို `deterministic` ကို `false` လို့ သတ်မှတ်ပြီး ဖန်တီးရပါမယ် ([အပိုင်း 23.2.2.4](https://www.postgresql.org/docs/current/collation.html#COLLATION-NONDETERMINISTIC) ကို ကြည့်ပါ)။ ထို့ပြင် — settings အချို့က `ka` key ကို `shifted` လို့ သတ်မှတ်ထားမှသာ အကျိုးသက်ရောက်ပါတယ် ([ဇယား 23.2](https://www.postgresql.org/docs/current/collation.html#ICU-COLLATION-SETTINGS-TABLE) ကို ကြည့်ပါ)။

#### 23.2.3.3. Collation Settings Examples (Collation ဆက်တင် ဥပမာများ)

- **CREATE COLLATION "de-u-co-phonebk-x-icu" (provider = icu, locale = 'de-u-co-phonebk'); #** — phone book collation type (phone book collation အမျိုးအစား) ပါတဲ့ ဂျာမန် collation
- **CREATE COLLATION "und-u-co-emoji-x-icu" (provider = icu, locale = 'und-u-co-emoji'); #** — Unicode Technical Standard #51 အရ — Emoji collation type ပါတဲ့ Root collation
- **CREATE COLLATION latinlast (provider = icu, locale = 'en-u-kr-grek-latn'); #** — ဂရိ စာလုံးတွေကို လက်တင် စာလုံးတွေ ရှေ့မှာ စီပါတယ်။ (Default ကတော့ လက်တင် စာလုံးတွေ ဂရိ စာလုံးတွေ ရှေ့မှာ ဖြစ်ပါတယ်။)
- **CREATE COLLATION upperfirst (provider = icu, locale = 'en-u-kf-upper'); #** — စာလုံးအကြီး (upper-case) တွေကို စာလုံးအသေး (lower-case) တွေ ရှေ့မှာ စီပါတယ်။ (Default ကတော့ စာလုံးအသေးတွေ ရှေ့မှာ ဖြစ်ပါတယ်။)
- **CREATE COLLATION special (provider = icu, locale = 'en-u-kf-upper-kr-grek-latn'); #** — အပေါ်က options နှစ်ခုလုံးကို ပေါင်းစပ်ထားပါတယ်။

#### 23.2.3.4. ICU Tailoring Rules (ICU tailoring စည်းမျဉ်းများ)

အပေါ်မှာ ပြထားတဲ့ collation settings တွေက ထောက်ပံ့တဲ့ options တွေ မလုံလောက်ဘူးဆိုရင် — collation elements တွေရဲ့ အစီအစဉ်ကို — tailoring rules (collation စည်းမျဉ်းများကို စိတ်ကြိုက် ပြုပြင်ရေး စည်းမျဉ်းများ) တွေနဲ့ ပြောင်းလဲနိုင်ပြီး — syntax အသေးစိတ်ကို [https://unicode-org.github.io/icu/userguide/collation/customization/](https://unicode-org.github.io/icu/userguide/collation/customization/) မှာ ဖော်ပြထားပါတယ်။

ဒီ ဥပမာငယ်လေးက — tailoring rule တစ်ခု ပါဝင်တဲ့ root locale အခြေပြု collation တစ်ခုကို ဖန်တီးပါတယ်:

```sql
CREATE COLLATION custom (provider = icu, locale = 'und', rules = '&V << w <<< W');
```

ဒီ rule နဲ့ဆိုရင် — “W” စာလုံးက “V” ရဲ့ နောက်မှာ စီခံရပေမယ့် — accent တစ်ခုနဲ့ ဆင်တူတဲ့ — secondary difference (ဒုတိယအဆင့် ခြားနားချက်) တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ ဒီလို rules တွေက ဘာသာစကား အချို့ရဲ့ locale definitions တွေထဲမှာ ပါဝင်ပါတယ်။ (တကယ်တော့ — locale definition တစ်ခုထဲမှာ လိုချင်တဲ့ rules တွေ ပါပြီးသားဆိုရင် — ၎င်းတို့ကို ထပ်ပြီး သီးခြား သတ်မှတ် စရာ မလိုပါဘူး။)

ဒီမှာ ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခု ရှိပါတယ်။ အောက်ပါ statement က — US-ASCII characters တွေကို EBCDIC encoding ရဲ့ အစီအစဉ်အတိုင်း စီဖို့ rules တွေ ပါဝင်တဲ့ — `ebcdic` လို့ နာမည်ရှိတဲ့ collation တစ်ခုကို ပြင်ဆင် သတ်မှတ်ပါတယ်။

```
CREATE COLLATION ebcdic (provider = icu, locale = 'und',
rules = $$
& ' ' < '.' < '<' < '(' < '+' < \|
< '&' < '!' < '$' < '*' < ')' < ';'
< '-' < '/' < ',' < '%' < '_' < '>' < '?'
< '`' < ':' < '#' < '@' < \' < '=' < '"'
<*a-r < '~' <*s-z < '^' < '[' < ']'
< '{' <*A-I < '}' <*J-R < '\' <*S-Z <*0-9
$$);

SELECT c
FROM (VALUES ('a'), ('b'), ('A'), ('B'), ('1'), ('2'), ('!'), ('^')) AS x(c)
ORDER BY c COLLATE ebcdic;
 c
---
 !
 a
 b
 ^
 A
 B
 1
 2
```

#### 23.2.3.5. External References for ICU (ICU အတွက် ပြင်ပ ကိုးကားချက်များ)

ဒီ section ([အပိုင်း 23.2.3](https://www.postgresql.org/docs/current/collation.html#ICU-CUSTOM-COLLATIONS)) က — ICU အပြုအမူ နဲ့ language tags တွေရဲ့ အကျဉ်းချုပ် ခြုံငုံ သုံးသပ်ချက် တစ်ခုပဲ ဖြစ်ပါတယ်။ နည်းပညာ အသေးစိတ်တွေ၊ နောက်ထပ် options တွေနဲ့ အပြုအမူ အသစ်တွေအတွက် အောက်ပါ စာရွက်စာတမ်းတွေကို ကိုးကား ကြည့်ရှုပါ:

- Unicode Technical Standard #35
- BCP 47
- CLDR repository
- https://unicode-org.github.io/icu/userguide/locale/
- https://unicode-org.github.io/icu/userguide/collation/
