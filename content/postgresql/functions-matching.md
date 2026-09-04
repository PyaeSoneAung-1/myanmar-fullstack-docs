---
title: "Pattern Matching (pattern ကိုက်ညီမှု စစ်ဆေးခြင်း)"
description: "PostgreSQL ရဲ့ pattern matching နည်းလမ်း သုံးမျိုး — LIKE, SIMILAR TO နဲ့ POSIX regular expression တွေအကြောင်း အသေးစိတ်"
order: 74
source: "https://www.postgresql.org/docs/current/functions-matching.html"
status: translated
updated: 2026-09-04
---

## 9.7. Pattern Matching (pattern ကိုက်ညီမှု စစ်ဆေးခြင်း)

- **9.7.1. `LIKE` (LIKE operator)**
- **9.7.2. `SIMILAR TO` Regular Expressions (`SIMILAR TO` regular expression များ)**
- **9.7.3. POSIX Regular Expressions (POSIX regular expression များ)**

PostgreSQL မှာ pattern matching အတွက် သီးခြား ချဉ်းကပ်နည်း သုံးမျိုး ရှိပါတယ်: သမားရိုးကျ SQL `LIKE` operator၊ ပိုမကြာသေးတဲ့ `SIMILAR TO` operator (SQL:1999 မှာ ထည့်သွင်းခဲ့တာ) နဲ့ POSIX-style regular expression တွေပဲ ဖြစ်ပါတယ်။ “ဒီ string က ဒီ pattern နဲ့ ကိုက်ညီလား” ဆိုတဲ့ အခြေခံ operator တွေအပြင် — ကိုက်ညီတဲ့ substring တွေကို ထုတ်ယူခြင်း သို့မဟုတ် အစားထိုးခြင်းနဲ့ string တစ်ခုကို ကိုက်ညီတဲ့ နေရာတွေမှာ ခွဲခြမ်းခြင်းတို့အတွက် function တွေလည်း ရနိုင်ပါတယ်။

> **အကြံပြုချက်:** ဒီထက်ပိုတဲ့ pattern matching လိုအပ်ချက်တွေ ရှိရင် — Perl သို့မဟုတ် Tcl နဲ့ user-defined function တစ်ခု ရေးသားဖို့ စဉ်းစားကြည့်ပါ။

> **သတိပြုရန်:** Regular-expression search အများစုကို အလွန် လျင်မြန်စွာ execute လုပ်နိုင်ပေမယ့် — စီစဉ်ဖန်တီးထားတဲ့ regular expression တချို့က လုပ်ဆောင်ဖို့ အချိန်နဲ့ memory ဘယ်လောက်မဆို ယူနိုင်ပါတယ်။ Hostile source (ရန်လိုသော ရင်းမြစ်) တွေကနေ လာတဲ့ regular-expression search pattern တွေကို လက်ခံတဲ့အခါ သတိထားပါ။ မလုပ်မဖြစ် လိုအပ်ရင်တော့ statement timeout တစ်ခု သတ်မှတ်ထားဖို့ အကြံပြုလိုပါတယ်။
> 
> `SIMILAR TO` pattern တွေနဲ့ ရှာဖွေတာကလည်း — `SIMILAR TO` က POSIX-style regular expression တွေရဲ့ စွမ်းဆောင်ရည် အများအပြားကို ပေးစွမ်းနိုင်လို့ — security အန္တရာယ် အတူတူ ရှိပါတယ်။
> 
> `LIKE` search တွေကတော့ တခြား option နှစ်ခုထက် များစွာ ရိုးရှင်းလို့ — hostile ဖြစ်နိုင်တဲ့ pattern source တွေနဲ့ သုံးရာမှာ ပိုလုံခြုံပါတယ်။

`SIMILAR TO` နဲ့ POSIX-style regular expression တွေက nondeterministic collation တွေကို မထောက်ပံ့ပါဘူး။ လိုအပ်ရင် — ဒီကန့်သတ်ချက်ကို ကျော်လွှားဖို့ `LIKE` ကို သုံးပါ သို့မဟုတ် expression ကို တခြား collation တစ်ခုနဲ့ အသုံးချပါ။

### 9.7.1. `LIKE` (LIKE operator)

```sql
string LIKE pattern [ESCAPE escape-character]
string NOT LIKE pattern [ESCAPE escape-character]
```

`LIKE` expression က `string` က ပေးထားတဲ့ `pattern` နဲ့ ကိုက်ညီရင် true ပြန်ပေးပါတယ်။ (မျှော်လင့်ထားသလိုပဲ — `LIKE` က true ပြန်ပေးရင် `NOT LIKE` က false ပြန်ပေးပြီး အပြန်အလှန်လည်း ဒီအတိုင်းပါ။ ညီမျှတဲ့ expression တစ်ခုက `NOT (string LIKE pattern)` ဖြစ်ပါတယ်။)

`pattern` မှာ percent sign သို့မဟုတ် underscore မပါရင် — pattern က string ကိုယ်တိုင်ကိုပဲ ကိုယ်စားပြုပြီး — အဲဒီအခါ `LIKE` က equals operator လိုပဲ ပြုမူပါတယ်။ `pattern` ထဲက underscore (`_`) တစ်ခုက character တစ်ခုခုကို ကိုယ်စားပြု (match) ပြီး — percent sign (`%`) တစ်ခုကတော့ သုည သို့မဟုတ် ထို့ထက်ပိုတဲ့ character အစုအဝေး ဘာမဆိုနဲ့ ကိုက်ညီပါတယ်။

ဥပမာအချို့:

```sql
'abc' LIKE 'abc'    true
'abc' LIKE 'a%'     true
'abc' LIKE '_b_'    true
'abc' LIKE 'c'      false
```

`LIKE` pattern matching က nondeterministic collation တွေကို ထောက်ပံ့ပါတယ် — ဥပမာ case-insensitive collation တွေ သို့မဟုတ် punctuation တွေကို လျစ်လျူရှုတဲ့ collation တွေလိုမျိုးပါ ([အပိုင်း 23.2.2.4](https://www.postgresql.org/docs/current/collation.html#COLLATION-NONDETERMINISTIC) ကို ကြည့်ပါ)။ ဒါကြောင့် case-insensitive collation တစ်ခုနဲ့ဆိုရင် — ဒီလိုမျိုး ရှိနိုင်ပါတယ်:

```sql
'AbC' LIKE 'abc' COLLATE case_insensitive    true
'AbC' LIKE 'a%' COLLATE case_insensitive     true
```

Character တချို့ကို လျစ်လျူရှုတဲ့ collation တွေ သို့မဟုတ် ယေဘုယျအားဖြင့် မတူညီတဲ့ အလျား (length) ရှိတဲ့ string တွေကို တူညီတယ်လို့ ယူဆတဲ့ collation တွေနဲ့ဆိုရင် — semantics (အဓိပ္ပာယ် သတ်မှတ်ချက်များ) က နည်းနည်း ပိုရှုပ်ထွေးလာနိုင်ပါတယ်။ ဒီဥပမာတွေကို ကြည့်ပါ:

```sql
'.foo.' LIKE 'foo' COLLATE ign_punct    true
'.foo.' LIKE 'f_o' COLLATE ign_punct    true
'.foo.' LIKE '_oo' COLLATE ign_punct    false
```

Matching အလုပ်လုပ်ပုံက — pattern ကို wildcard အစုတွေနဲ့ wildcard မဟုတ်တဲ့ string အစုတွေအဖြစ် ပိုင်းခြားလိုက်တာပါ (wildcard တွေက `_` နဲ့ `%`)။ ဥပမာ — `f_o` ဆိုတဲ့ pattern ကို `f, _, o` ဆိုပြီး ပိုင်းပြီး — `_oo` ကိုတော့ `_, oo` လို့ ပိုင်းပါတယ်။ Wildcard တွေက character တစ်ခု သို့မဟုတ် ဘယ်နှစ်ခုမဆို character အသီးသီးနဲ့ ကိုက်ညီပြီး — wildcard မဟုတ်တဲ့ အပိုင်းတွေက သက်ဆိုင်ရာ collation အောက်မှာ တူညီနေရင် — input string က pattern နဲ့ ကိုက်ညီတယ်လို့ ဆိုပါတယ်။ ဒါကြောင့် ဥပမာ — `'.foo.' LIKE 'f_o' COLLATE ign_punct` က true ဖြစ်ပါတယ်: `.foo.` ကို `.f, o, o.` ဆိုပြီး ပိုင်းလို့ ရလို့ပါ — အဲဒီအခါ `'.f' = 'f' COLLATE ign_punct` ဖြစ်ပြီး — `'o'` က `_` wildcard နဲ့ ကိုက်ညီကာ — `'o.' = 'o' COLLATE ign_punct` ဖြစ်လို့ပါ။ ဒါပေမယ့် `'.foo.' LIKE '_oo' COLLATE ign_punct` ကတော့ false ပါ — `.foo.` ကို ပထမ character က ဘယ် character မဆို ဖြစ်ပြီး ကျန်တဲ့ string က `oo` နဲ့ တူညီတဲ့ ပုံစံမျိုးနဲ့ ပိုင်းလို့ မရလို့ပါ။ (Character တစ်ခုတည်းနဲ့ ကိုက်ညီတဲ့ wildcard က collation မသက်ဆိုင်ဘဲ character တစ်ခုတည်းနဲ့ပဲ အမြဲ ကိုက်ညီတာကို သတိပြုပါ။ ဒါကြောင့် ဒီဥပမာမှာ `_` က `.` နဲ့ ကိုက်ညီပေမယ့် — ကျန် input string က ကျန် pattern နဲ့ ကိုက်ညီတော့ မည် မဟုတ်ပါဘူး။)

`LIKE` pattern matching က string တစ်ခုလုံးကို အမြဲ လွှမ်းခြုံပါတယ်။ ဒါကြောင့် string တစ်ခုရဲ့ ဘယ်နေရာမှာမဆို ရှိတဲ့ sequence တစ်ခုကို ကိုက်ညီစေချင်ရင် — pattern က percent sign နဲ့ စပြီး percent sign နဲ့ ဆုံးရပါမယ်။

တခြား character တွေကို မကိုက်ညီစေဘဲ literal underscore သို့မဟုတ် percent sign တစ်ခုကို ကိုက်ညီစေချင်ရင် — `pattern` ထဲက သက်ဆိုင်ရာ character ရဲ့ ရှေ့မှာ escape character ထားရပါမယ်။ Default escape character က backslash ဖြစ်ပြီး — `ESCAPE` clause ကို သုံးပြီး တခြားတစ်ခုကို ရွေးချယ်လို့ ရပါတယ်။ Escape character ကိုယ်တိုင်နဲ့ ကိုက်ညီစေဖို့ဆိုရင် — escape character နှစ်ခု ရေးပါ။

> **မှတ်ချက်:** [standard_conforming_strings](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-STANDARD-CONFORMING-STRINGS) ကို ပိတ်ထားရင် — literal string constant တွေထဲမှာ သင်ရေးတဲ့ backslash တိုင်းကို နှစ်ဆ ရေးရပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 4.1.2.1](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။

`ESCAPE ''` လို့ ရေးပြီး escape character မရှိဘဲလည်း ရွေးချယ်လို့ ရပါတယ်။ ဒါက escape ယန္တရားကို ထိရောက်စွာ ပိတ်ပစ်လိုက်တာဖြစ်ပြီး — pattern ထဲက underscore နဲ့ percent sign တွေရဲ့ အထူး အဓိပ္ပာယ်ကို ပိတ်ဖို့ မဖြစ်နိုင်တော့ပါဘူး။

SQL standard အရဆိုရင် — `ESCAPE` ကို ချန်လိုက်တာက escape character မရှိဘူးလို့ ဆိုလိုပြီး (backslash ကို default လုပ်တာ မဟုတ်ဘူး) — အလျား သုညရှိတဲ့ `ESCAPE` တန်ဖိုးကိုလည်း ခွင့်မပြုပါဘူး။ ဒါကြောင့် ဒီကိစ္စမှာ PostgreSQL ရဲ့ အပြုအမူက standard နဲ့ နည်းနည်း ကွဲပြားပါတယ်။

`LIKE` အစား `ILIKE` ဆိုတဲ့ key word ကို သုံးရင် — active locale အရ case-insensitive (စာလုံးကြီး/ငယ် ခွဲခြားမှု မရှိဘဲ) ကိုက်ညီအောင် လုပ်ပေးပါတယ်။ (ဒါပေမယ့် nondeterministic collation တွေကိုတော့ မထောက်ပံ့ပါဘူး။) ဒါက SQL standard ထဲမှာ မပါဝင်ဘဲ — PostgreSQL ရဲ့ extension တစ်ခုပါ။

`~~` operator က `LIKE` နဲ့ ညီမျှပြီး — `~~*` က `ILIKE` နဲ့ သက်ဆိုင်ပါတယ်။ `NOT LIKE` နဲ့ `NOT ILIKE` တွေကို အသီးသီး ကိုယ်စားပြုတဲ့ `!~~` နဲ့ `!~~*` operator တွေလည်း ရှိပါတယ်။ ဒီ operator တွေ အားလုံးက PostgreSQL-specific တွေပါ။ Parser က တကယ်တော့ `LIKE` စတာတွေကို ဒီ operator တွေအဖြစ် ဘာသာပြန်သုံးလို့ — `EXPLAIN` output နဲ့ အလားတူ နေရာတွေမှာ ဒီ operator နာမည်တွေကို တွေ့ရနိုင်ပါတယ်။

`LIKE`, `ILIKE`, `NOT LIKE`, `NOT ILIKE` ဆိုတဲ့ phrase တွေကို PostgreSQL syntax မှာ ယေဘုယျအားဖြင့် operator တွေအဖြစ် သဘောထားပါတယ်; ဥပမာ — `expression` `operator` ANY (`subquery`) construct တွေမှာ သုံးလို့ ရပါတယ် — ဒါပေမယ့် အဲဒီနေရာမှာ `ESCAPE` clause ကိုတော့ ထည့်လို့ မရပါဘူး။ ရှုပ်ထွေးတဲ့ ကိစ္စတချို့မှာ အောက်ခံ operator နာမည်တွေကိုပဲ သုံးဖို့ လိုအပ်နိုင်ပါတယ်။

String တစ်ခုရဲ့ အစပိုင်းကိုပဲ ရိုးရိုး ကိုက်ညီစစ်ဆေးဖို့ လိုအပ်တဲ့ ကိစ္စတွေမှာ အသုံးဝင်တဲ့ — starts-with operator `^@` နဲ့ ၎င်းနဲ့ သက်ဆိုင်တဲ့ `starts_with()` function ကိုလည်း ကြည့်ပါ။

### 9.7.2. `SIMILAR TO` Regular Expressions (`SIMILAR TO` regular expression များ)

```sql
string SIMILAR TO pattern [ESCAPE escape-character]
string NOT SIMILAR TO pattern [ESCAPE escape-character]
```

`SIMILAR TO` operator က — သူ့ရဲ့ pattern က ပေးထားတဲ့ string နဲ့ ကိုက်ညီမကိုက်ညီပေါ် မူတည်ပြီး — true သို့မဟုတ် false ပြန်ပေးပါတယ်။ `LIKE` နဲ့ ဆင်ပေမယ့် — pattern ကို SQL standard ရဲ့ regular expression အဓိပ္ပာယ် ဖွင့်ဆိုချက်နဲ့ အနက်ဖွင့်တာပဲ ကွာပါတယ်။ SQL regular expression တွေက `LIKE` notation နဲ့ သာမန် (POSIX) regular expression notation ကြားက ထူးဆန်းတဲ့ ရောစပ်မှု တစ်မျိုးပါ။

`LIKE` လိုပဲ — `SIMILAR TO` operator က သူ့ရဲ့ pattern က string တစ်ခုလုံးနဲ့ ကိုက်ညီမှသာ အောင်မြင်ပါတယ်; ဒါက pattern က string ရဲ့ ဘယ်အပိုင်းမဆို ကိုက်ညီနိုင်တဲ့ သာမန် regular expression အပြုအမူနဲ့ မတူပါဘူး။ `LIKE` မှာလိုပဲ — `SIMILAR TO` ကလည်း `_` နဲ့ `%` တွေကို wildcard character တွေအဖြစ် သုံးပါတယ် — `_` က character တစ်ခုခုကို ကိုယ်စားပြုပြီး `%` က string တစ်ခုခုကို ကိုယ်စားပြုပါတယ် (ဒါတွေက POSIX regular expression တွေထဲက `.` နဲ့ `.*` တို့နဲ့ ယှဉ်နိုင်ပါတယ်)။

`LIKE` ကနေ ငှားယူထားတဲ့ ဒီစွမ်းရည်တွေအပြင် — `SIMILAR TO` က POSIX regular expression တွေကနေ ငှားယူထားတဲ့ အောက်ပါ pattern-matching metacharacter တွေကိုလည်း ထောက်ပံ့ပါတယ်:

- | က alternation (ရွေးစရာ နှစ်ခုထဲက တစ်ခုခုနဲ့ ကိုက်ညီခြင်း) ကို ဖော်ပြပါတယ်။
- * က ရှေ့က item ကို သုည ကြိမ် သို့မဟုတ် ထို့ထက်ပို ထပ်ခါထပ်ခါ ကိုက်ညီခြင်းကို ဖော်ပြပါတယ်။
- + က ရှေ့က item ကို တစ်ကြိမ် သို့မဟုတ် တစ်ကြိမ်ထက်ပို ထပ်ခါထပ်ခါ ကိုက်ညီခြင်းကို ဖော်ပြပါတယ်။
- ? က ရှေ့က item ကို သုည ကြိမ် သို့မဟုတ် တစ်ကြိမ် ထပ်ခါထပ်ခါ ကိုက်ညီခြင်းကို ဖော်ပြပါတယ်။
- {m} က ရှေ့က item ကို အတိအကျ m ကြိမ် ထပ်ခါထပ်ခါ ကိုက်ညီခြင်းကို ဖော်ပြပါတယ်။
- {m,} က ရှေ့က item ကို m ကြိမ် သို့မဟုတ် ထို့ထက်ပို ထပ်ခါထပ်ခါ ကိုက်ညီခြင်းကို ဖော်ပြပါတယ်။
- {m,n} က ရှေ့က item ကို အနည်းဆုံး m ကြိမ်၊ အများဆုံး n ကြိမ် ထပ်ခါထပ်ခါ ကိုက်ညီခြင်းကို ဖော်ပြပါတယ်။
- Parentheses () က item တွေကို logical item တစ်ခုတည်းအဖြစ် အုပ်စုဖွဲ့ဖို့ သုံးလို့ ရပါတယ်။
- Bracket expression [...] က — POSIX regular expression တွေမှာလိုပဲ — character class (စာလုံးအုပ်စု) တစ်ခုကို သတ်မှတ်ပါတယ်။

Period (`.`) က `SIMILAR TO` အတွက် metacharacter မဟုတ်တာကို သတိပြုပါ။

`LIKE` မှာလိုပဲ — backslash က ဒီ metacharacter တွေထဲက ဘယ်ဟာရဲ့ အထူး အဓိပ္ပာယ်ကိုမဆို ပိတ်ပါတယ်။ `ESCAPE` နဲ့ တခြား escape character ကို သတ်မှတ်လို့ ရပြီး — `ESCAPE ''` လို့ ရေးပြီး escape စွမ်းရည်ကို ပိတ်လိုက်လို့လည်း ရပါတယ်။

SQL standard အရဆိုရင် — `ESCAPE` ကို ချန်လိုက်တာက escape character မရှိဘူးလို့ ဆိုလိုပြီး (backslash ကို default လုပ်တာ မဟုတ်ဘူး) — အလျား သုညရှိတဲ့ `ESCAPE` တန်ဖိုးကိုလည်း ခွင့်မပြုပါဘူး။ ဒါကြောင့် ဒီကိစ္စမှာ PostgreSQL ရဲ့ အပြုအမူက standard နဲ့ နည်းနည်း ကွဲပြားပါတယ်။

နောက်ထပ် nonstandard extension တစ်ခုကတော့ — escape character နောက်မှာ letter သို့မဟုတ် digit တစ်ခု လိုက်ရင် — POSIX regular expression တွေအတွက် သတ်မှတ်ထားတဲ့ escape sequence တွေကို သုံးခွင့် ရတာပါ; အောက်မှာ ဖော်ပြထားတဲ့ [ဇယား 9.20], [ဇယား 9.21] နဲ့ [ဇယား 9.22] တို့ကို ကြည့်ပါ။

ဥပမာအချို့:

```sql
'abc' SIMILAR TO 'abc'          true
'abc' SIMILAR TO 'a'            false
'abc' SIMILAR TO '%(b|d)%'      true
'abc' SIMILAR TO '(b|c)%'       false
'-abc-' SIMILAR TO '%\mabc\M%'  true
'xabcy' SIMILAR TO '%\mabc\M%'  false
```

Parameter သုံးခုပါတဲ့ `substring` function က SQL regular expression pattern တစ်ခုနဲ့ ကိုက်ညီတဲ့ substring တစ်ခုကို ထုတ်ယူပေးပါတယ်။ ဒီ function ကို standard SQL syntax နဲ့ ဒီလို ရေးလို့ ရပါတယ်:

```sql
substring(string similar pattern escape escape-character)
```

ဒါမှမဟုတ် အခု obsolete (အသုံးမပြုတော့သော) SQL:1999 syntax ကို သုံးပြီး:

```sql
substring(string from pattern for escape-character)
```

ဒါမှမဟုတ် သာမန် argument သုံးခုပါတဲ့ function တစ်ခုအနေနဲ့:

```sql
substring(string, pattern, escape-character)
```

`SIMILAR TO` မှာလိုပဲ — သတ်မှတ်ထားတဲ့ pattern က data string တစ်ခုလုံးနဲ့ ကိုက်ညီရပါမယ် — မဟုတ်ရင် function က မအောင်မြင်ဘဲ null ပြန်ပေးပါတယ်။ ကိုယ် စိတ်ဝင်စားတဲ့ matching data sub-string က pattern ရဲ့ ဘယ်အပိုင်းနဲ့ ကိုက်ညီလဲ ဖော်ပြဖို့ — pattern ထဲမှာ escape character တစ်ခုနဲ့ ၎င်းနောက်မှာ double quote (`"`) လိုက်တဲ့ နေရာ နှစ်ခု ပါဝင်ရပါမယ်။ Match အောင်မြင်တဲ့အခါ — ဒီ separator တွေကြားက pattern အပိုင်းနဲ့ ကိုက်ညီတဲ့ စာသားကို ပြန်ပေးပါတယ်။

Escape-double-quote separator တွေက တကယ်တော့ `substring` ရဲ့ pattern ကို သီးခြား regular expression သုံးခုအဖြစ် ပိုင်းခြားပေးပါတယ်; ဥပမာ — အပိုင်း သုံးပိုင်းထဲက ဘယ်အပိုင်းမှာပဲ ရှိရှိ vertical bar (`|`) တစ်ခုက အဲဒီအပိုင်းကိုပဲ သက်ရောက်ပါတယ်။ ဒါ့အပြင် — data string ရဲ့ ဘယ်လောက်ကို ဘယ် pattern နဲ့ ကိုက်ညီတယ်ဆိုတာ မရှင်းလင်းတဲ့အခါ — ပထမ နဲ့ တတိယ regular expression တွေက စာသား အများဆုံး ပမာဏ မဟုတ်ဘဲ — အနည်းဆုံး ပမာဏကိုပဲ ကိုက်ညီဖို့ သတ်မှတ်ထားပါတယ်။ (POSIX အသုံးအနှုန်းအရ — ပထမ နဲ့ တတိယ regular expression တွေကို non-greedy ဖြစ်အောင် အတင်း လုပ်ထားတာပါ။)

SQL standard ရဲ့ extension တစ်ခုအနေနဲ့ — PostgreSQL က escape-double-quote separator တစ်ခုတည်း ရှိတာကိုလည်း ခွင့်ပြုပါတယ် — အဲဒီအခါ တတိယ regular expression ကို empty အဖြစ် မှတ်ယူပြီး — separator လုံးဝ မရှိရင်တော့ ပထမ နဲ့ တတိယ regular expression တွေကို empty အဖြစ် မှတ်ယူပါတယ်။

`#"` နဲ့ return string ကို ခြားပြထားတဲ့ ဥပမာအချို့:

```sql
substring('foobar' similar '%#"o_b#"%' escape '#')   oob
substring('foobar' similar '#"o_b#"%' escape '#')    NULL
```

### 9.7.3. POSIX Regular Expressions (POSIX regular expression များ)

[ဇယား 9.16] မှာ POSIX regular expression တွေကို သုံးပြီး pattern matching လုပ်ဖို့ ရနိုင်တဲ့ operator တွေကို စာရင်းပြုထားပါတယ်။

**ဇယား 9.16. Regular Expression Match Operators (regular expression ကိုက်ညီမှု စစ်ဆေးရန် operator များ)**

| Operator | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| `text ~ text → boolean` | String က regular expression နဲ့ — case sensitively (စာလုံးကြီး/ငယ် ခွဲခြားပြီး) — ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးသည် | `'thomas' ~ 't.*ma' → t` |
| `text ~* text → boolean` | String က regular expression နဲ့ — case-insensitively (စာလုံးကြီး/ငယ် မခွဲခြားဘဲ) — ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးသည် | `'thomas' ~* 'T.*ma' → t` |
| `text !~ text → boolean` | String က regular expression နဲ့ — case sensitively — ကိုက်ညီမှု မရှိခြင်းကို စစ်ဆေးသည် | `'thomas' !~ 't.*max' → t` |
| `text !~* text → boolean` | String က regular expression နဲ့ — case-insensitively — ကိုက်ညီမှု မရှိခြင်းကို စစ်ဆေးသည် | `'thomas' !~* 'T.*ma' → f` |

POSIX regular expression တွေက `LIKE` နဲ့ `SIMILAR TO` operator တွေထက် ပိုအားကောင်းတဲ့ pattern matching နည်းလမ်းကို ပေးပါတယ်။ `egrep`, `sed`, `awk` စတဲ့ Unix tool တွေ အများအပြားက ဒီမှာ ဖော်ပြထားတာနဲ့ ဆင်တူတဲ့ pattern matching language တစ်ခုကို သုံးပါတယ်။

Regular expression ဆိုတာ — string အစုတစ်ခု (*regular set*) ရဲ့ အကျဉ်းချုပ် သတ်မှတ်ချက် ဖြစ်တဲ့ character sequence တစ်ခုပါ။ String တစ်ခုက regular expression နဲ့ ကိုက်ညီတယ်ဆိုတာ — အဲဒီ string က regular expression ဖော်ပြတဲ့ regular set ရဲ့ အဖွဲ့ဝင် ဖြစ်နေရင် ဖြစ်ပါတယ်။ `LIKE` မှာလိုပဲ — pattern character တွေက regular expression language ထဲမှာ special character တွေ မဟုတ်ရင် string character တွေနဲ့ အတိအကျ ကိုက်ညီပါတယ် — ဒါပေမယ့် regular expression တွေက `LIKE` သုံးတဲ့ special character တွေနဲ့ မတူညီပါဘူး။ `LIKE` pattern တွေနဲ့ မတူဘဲ — regular expression ကို string ရဲ့ အစ သို့မဟုတ် အဆုံးမှာ ရှင်းရှင်းလင်းလင်း anchor လုပ်မထားရင် — string ထဲက ဘယ်နေရာမှာမဆို ကိုက်ညီခွင့် ရှိပါတယ်။

ဥပမာအချို့:

```sql
'abcd' ~ 'bc'     true
'abcd' ~ 'a.c'    true — dot matches any character
'abcd' ~ 'a.*d'   true — * repeats the preceding pattern item
'abcd' ~ '(b|x)'  true — | means OR, parentheses group
'abcd' ~ '^a'     true — ^ anchors to start of string
'abcd' ~ '^(b|c)' false — would match except for anchoring
```

POSIX pattern language ကို အောက်မှာ ပိုပြီး အသေးစိတ် ဖော်ပြပါမယ်။

Parameter နှစ်ခုပါတဲ့ `substring` function — `substring(string from pattern)` — က POSIX regular expression pattern တစ်ခုနဲ့ ကိုက်ညီတဲ့ substring တစ်ခုကို ထုတ်ယူပေးပါတယ်။ Match မရှိရင် null ပြန်ပြီး — မဟုတ်ရင် pattern နဲ့ ကိုက်ညီတဲ့ စာသားရဲ့ ပထမဆုံး အပိုင်းကို ပြန်ပေးပါတယ်။ ဒါပေမယ့် pattern ထဲမှာ parentheses တွေ ပါရင် — ပထမဆုံး parenthesized subexpression (ဘယ်ဘက် parenthesis အစောဆုံး လာတဲ့ဟာ) နဲ့ ကိုက်ညီတဲ့ စာသားအပိုင်းကို ပြန်ပေးပါတယ်။ ဒီခြွင်းချက် မသက်ရောက်စေဘဲ အတွင်းမှာ parentheses သုံးချင်ရင် — expression တစ်ခုလုံးကို parentheses နဲ့ ဝန်းရံထားလို့ ရပါတယ်။ ထုတ်ယူချင်တဲ့ subexpression ရဲ့ ရှေ့မှာ pattern ထဲ parentheses တွေ လိုအပ်ရင် — အောက်မှာ ဖော်ပြထားတဲ့ non-capturing parentheses တွေကို ကြည့်ပါ။

ဥပမာအချို့:

```sql
substring('foobar' from 'o.b')     oob
substring('foobar' from 'o(.)b')   o
```

`regexp_count` function က POSIX regular expression pattern တစ်ခု string တစ်ခုနဲ့ ကိုက်ညီတဲ့ နေရာ အရေအတွက်ကို ရေတွက်ပေးပါတယ်။ Syntax က `regexp_count`(`string`, `pattern` [, start [, flags ]]) ဖြစ်ပါတယ်။ `pattern` ကို `string` ထဲမှာ — ပုံမှန်အားဖြင့် string ရဲ့ အစကနေ — ရှာဖွေပြီး — `start` parameter ပေးထားရင်တော့ အဲဒီ character index ကနေ စပြီး ရှာဖွေပါတယ်။ `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ ဥပမာ — `flags` ထဲမှာ `i` ထည့်ရင် case-insensitive matching ကို သတ်မှတ်ပါတယ်။ ထောက်ပံ့ထားတဲ့ flag တွေကို [ဇယား 9.24] မှာ ဖော်ပြထားပါတယ်။

ဥပမာအချို့:

```sql
regexp_count('ABCABCAXYaxy', 'A.')          3
regexp_count('ABCABCAXYaxy', 'A.', 1, 'i')  4
```

`regexp_instr` function က POSIX regular expression pattern တစ်ခုရဲ့ `N`'th match ရဲ့ စတင်တဲ့ သို့မဟုတ် ဆုံးတဲ့ အနေအထား (position) ကို ပြန်ပေးပါတယ် — အဲဒီလို match မရှိရင်တော့ သုည ပြန်ပေးပါတယ်။ Syntax က `regexp_instr`(`string`, `pattern` [, start [, N [, endoption [, flags [, subexpr ]]]]]) ဖြစ်ပါတယ်။ `pattern` ကို `string` ထဲမှာ — ပုံမှန်အားဖြင့် string ရဲ့ အစကနေ — ရှာဖွေပြီး — `start` parameter ပေးထားရင်တော့ အဲဒီ character index ကနေ စပြီး ရှာဖွေပါတယ်။ `N` သတ်မှတ်ထားရင် pattern ရဲ့ `N`'th match ကို ရှာဖွေပြီး — မဟုတ်ရင် ပထမဆုံး match ကို ရှာဖွေပါတယ်။ `endoption` parameter ကို ချန်လိုက်ရင် သို့မဟုတ် သုညလို့ သတ်မှတ်ရင် — function က match ရဲ့ ပထမဆုံး character ရဲ့ အနေအထားကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် `endoption` က တစ် (one) ဖြစ်ရပြီး — function က match နောက်ကို လိုက်တဲ့ character ရဲ့ အနေအထားကို ပြန်ပေးပါတယ်။ `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ ထောက်ပံ့ထားတဲ့ flag တွေကို [ဇယား 9.24] မှာ ဖော်ပြထားပါတယ်။ Parenthesized subexpression တွေ ပါတဲ့ pattern တစ်ခုအတွက် — `subexpr` က ဘယ် subexpression ကို စိတ်ဝင်စားလဲ ဖော်ပြတဲ့ integer ဖြစ်ပါတယ်: ရလဒ်က အဲဒီ subexpression နဲ့ ကိုက်ညီတဲ့ substring ရဲ့ အနေအထားကို ဖော်ပြပါတယ်။ Subexpression တွေကို သူတို့ရဲ့ ရှေ့ဆုံး (leading) parentheses တွေရဲ့ အစဉ်အတိုင်း နံပါတ် တပ်ပါတယ်။ `subexpr` ကို ချန်လိုက်ရင် သို့မဟုတ် သုည ဆိုရင် — parenthesized subexpression တွေ ရှိရှိမရှိ — ရလဒ်က match တစ်ခုလုံးရဲ့ အနေအထားကို ဖော်ပြပါတယ်။

ဥပမာအချို့:

```sql
regexp_instr('number of your street, town zip, FR', '[^,]+', 1, 2)
                                   23
regexp_instr(string=>'ABCDEFGHI', pattern=>'(c..)(...)', start=>1, "N"=>1, endoption=>0, flags=>'i', subexpr=>2)
                                   6
```

`regexp_like` function က POSIX regular expression pattern တစ်ခုရဲ့ match က string တစ်ခုထဲမှာ ရှိမရှိ စစ်ဆေးပြီး — boolean true သို့မဟုတ် false ပြန်ပေးပါတယ်။ Syntax က `regexp_like`(`string`, `pattern` [, flags ]) ဖြစ်ပါတယ်။ `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ ထောက်ပံ့ထားတဲ့ flag တွေကို [ဇယား 9.24] မှာ ဖော်ပြထားပါတယ်။ Flag ဘာမှ မသတ်မှတ်ရင် ဒီ function က `~` operator နဲ့ ရလဒ် အတူတူပါ။ `i` flag တစ်ခုတည်းပဲ သတ်မှတ်ရင် `~*` operator နဲ့ ရလဒ် အတူတူပါ။

ဥပမာအချို့:

```sql
regexp_like('Hello World', 'world')       false
regexp_like('Hello World', 'world', 'i')  true
```

`regexp_match` function က POSIX regular expression pattern တစ်ခုရဲ့ string တစ်ခုနဲ့ ပထမဆုံး match အတွင်းက matching substring (များ) ပါဝင်တဲ့ text array တစ်ခုကို ပြန်ပေးပါတယ်။ Syntax က `regexp_match`(`string`, `pattern` [, flags ]) ဖြစ်ပါတယ်။ Match မရှိရင် ရလဒ်က `NULL` ပါ။ Match တစ်ခု တွေ့ပြီး — `pattern` မှာ parenthesized subexpression မပါရင် — ရလဒ်က pattern တစ်ခုလုံးနဲ့ ကိုက်ညီတဲ့ substring ပါဝင်တဲ့ element တစ်ခုတည်း text array ပါ။ Match တစ်ခု တွေ့ပြီး — `pattern` မှာ parenthesized subexpression တွေ ပါရင် — ရလဒ်က `pattern` ရဲ့ `n`'th parenthesized subexpression နဲ့ ကိုက်ညီတဲ့ substring ကို `n`'th element အဖြစ် ထားတဲ့ text array တစ်ခုပါ (“non-capturing” parentheses တွေကို ရေတွက်မပါဘူး — အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ)။ `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ ထောက်ပံ့ထားတဲ့ flag တွေကို [ဇယား 9.24] မှာ ဖော်ပြထားပါတယ်။

ဥပမာအချို့:

```sql
SELECT regexp_match('foobarbequebaz', 'bar.*que');
 regexp_match
--------------
 {barbeque}
(1 row)

SELECT regexp_match('foobarbequebaz', '(bar)(beque)');
 regexp_match
--------------
 {bar,beque}
(1 row)
```

> **အကြံပြုချက်:** ကိုက်ညီတဲ့ substring တစ်ခုလုံး ဒါမှမဟုတ် match မရှိရင် `NULL` ပဲ လိုချင်တဲ့ သာမန်ကိစ္စတွေမှာ — `regexp_substr()` ကို သုံးတာ အကောင်းဆုံးပါ။ ဒါပေမယ့် `regexp_substr()` က PostgreSQL version 15 နဲ့ အထက်မှာပဲ ရှိပါသေးတယ်။ အဟောင်း version တွေမှာ အလုပ်လုပ်တဲ့အခါ — `regexp_match()` ရလဒ်ရဲ့ ပထမဆုံး element ကို ထုတ်ယူလို့ ရပါတယ် — ဥပမာ:
> 
> ```sql
> SELECT (regexp_match('foobarbequebaz', 'bar.*que'))[1];
>  regexp_match
> --------------
>  barbeque
> (1 row)
> ```

`regexp_matches` function က POSIX regular expression pattern တစ်ခု string တစ်ခုနဲ့ ကိုက်ညီတဲ့ match တွေထဲက matching substring (များ) ပါဝင်တဲ့ text array အစုတစ်ခုကို ပြန်ပေးပါတယ်။ Syntax က `regexp_match` နဲ့ အတူတူပါ။ Match မရှိရင် ဒီ function က row ဘာမှ မပြန်ဘဲ — match ရှိပြီး `g` flag မပေးထားရင် row တစ်ခု ပြန်ပြီး — match `N` ခု ရှိပြီး `g` flag ပေးထားရင် row `N` ခု ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ row တစ်ခုချင်းစီက — `regexp_match` အတွက် အပေါ်မှာ ဖော်ပြခဲ့သလိုပဲ — pattern တစ်ခုလုံးနဲ့ ကိုက်ညီတဲ့ substring သို့မဟုတ် `pattern` ရဲ့ parenthesized subexpression တွေနဲ့ ကိုက်ညီတဲ့ substring တွေ ပါဝင်တဲ့ text array တစ်ခုပါ။ `regexp_matches` က [ဇယား 9.24] မှာ ပြထားတဲ့ flag တွေ အားလုံးကို လက်ခံပြီး — ပထမဆုံး match တစ်ခုတည်း မဟုတ်ဘဲ match တွေ အားလုံးကို ပြန်ပေးဖို့ ညွှန်ကြားတဲ့ `g` flag ကိုပါ ထပ်ပြီး လက်ခံပါတယ်။

ဥပမာအချို့:

```sql
SELECT regexp_matches('foo', 'not there');
 regexp_matches
----------------
(0 rows)

SELECT regexp_matches('foobarbequebazilbarfbonk', '(b[^b]+)(b[^b]+)', 'g');
 regexp_matches
----------------
 {bar,beque}
 {bazil,barf}
(2 rows)
```

> **အကြံပြုချက်:** ကိစ္စ အများစုမှာ `regexp_matches()` ကို `g` flag နဲ့ သုံးသင့်ပါတယ် — ပထမဆုံး match တစ်ခုတည်းပဲ လိုချင်ရင် `regexp_match()` က ပိုလွယ်ပြီး ပိုထိရောက်လို့ပါ။ ဒါပေမယ့် `regexp_match()` က PostgreSQL version 10 နဲ့ အထက်မှာပဲ ရှိပါသေးတယ်။ အဟောင်း version တွေမှာ အလုပ်လုပ်တဲ့အခါ — `regexp_matches()` call တစ်ခုကို sub-select ထဲမှာ ထည့်တာက သာမန် နည်းလမ်းကောင်း တစ်ခုပါ — ဥပမာ:
> 
> ```sql
> SELECT col1, (SELECT regexp_matches(col2, '(bar)(beque)')) FROM tab;
> ```
> 
> ဒါက match ရှိရင် text array တစ်ခုကို ထုတ်ပေးပြီး — မရှိရင် `NULL` ထုတ်ပေးပါတယ် — `regexp_match()` လုပ်ပေးမယ့်အတိုင်းပါပဲ။ Sub-select မပါဘဲဆိုရင် — ဒီ query က match မရှိတဲ့ table row တွေအတွက် output လုံးဝ မထုတ်ပေးဘဲ ဖြစ်နေမှာမို့ — ပုံမှန်အားဖြင့် လိုချင်တဲ့ အပြုအမူ မဟုတ်ပါဘူး။

`regexp_replace` function က POSIX regular expression pattern တွေနဲ့ ကိုက်ညီတဲ့ substring တွေနေရာမှာ စာသားအသစ် အစားထိုးခြင်းကို ပေးပါတယ်။ Syntax က `regexp_replace`(`string`, `pattern`, `replacement` [, flags ]) သို့မဟုတ် `regexp_replace`(`string`, `pattern`, `replacement`, `start` [, N [, flags ]]) ဖြစ်ပါတယ်။ `pattern` နဲ့ ကိုက်ညီမှု မရှိရင် မူရင်း `string` ကို ပြောင်းလဲမှု မရှိဘဲ ပြန်ပေးပါတယ်။ Match တစ်ခု ရှိရင် — `string` ကို matching substring နေရာမှာ `replacement` string နဲ့ အစားထိုးပြီး ပြန်ပေးပါတယ်။ `replacement` string မှာ `\``n` ပါဝင်နိုင်ပါတယ် — `n` က 1 ကနေ 9 အထိ ဖြစ်ပြီး — pattern ရဲ့ `n`'th parenthesized subexpression နဲ့ ကိုက်ညီတဲ့ မူရင်း substring ကို ထည့်သွင်းသင့်တယ်လို့ ဖော်ပြတာပါ — ပြီးတော့ `\&` ကိုလည်း ပါဝင်စေနိုင်ပါတယ် — ဒါက pattern တစ်ခုလုံးနဲ့ ကိုက်ညီတဲ့ substring ကို ထည့်သွင်းသင့်တယ်လို့ ဖော်ပြတာပါ။ Replacement စာသားထဲမှာ literal backslash ထည့်ဖို့ လိုရင် `\\` လို့ ရေးပါ။ `pattern` ကို `string` ထဲမှာ — ပုံမှန်အားဖြင့် string ရဲ့ အစကနေ — ရှာဖွေပြီး — `start` parameter ပေးထားရင်တော့ အဲဒီ character index ကနေ စပြီး ရှာဖွေပါတယ်။ ပုံမှန်အားဖြင့် pattern ရဲ့ ပထမဆုံး match ကိုပဲ အစားထိုးပါတယ်။ `N` ကို သတ်မှတ်ပြီး သုညထက် ကြီးရင် — pattern ရဲ့ `N`'th match ကို အစားထိုးပါတယ်။ `g` flag ပေးထားရင် သို့မဟုတ် `N` ကို သုညလို့ သတ်မှတ်ရင် — `start` အနေအထားမှာ သို့မဟုတ် ၎င်းနောက်မှာ ရှိတဲ့ match တွေ အားလုံးကို အစားထိုးပါတယ်။ (`N` သတ်မှတ်ထားတဲ့အခါ `g` flag ကို လျစ်လျူရှုပါတယ်။) `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ ထောက်ပံ့ထားတဲ့ flag တွေ (`g` မပါဝင်ဘူး) ကို [ဇယား 9.24] မှာ ဖော်ပြထားပါတယ်။

ဥပမာအချို့:

```sql
regexp_replace('foobarbaz', 'b..', 'X')
                                   fooXbaz
regexp_replace('foobarbaz', 'b..', 'X', 'g')
                                   fooXX
regexp_replace('foobarbaz', 'b(..)', 'X\1Y', 'g')
                                   fooXarYXazY
regexp_replace('A PostgreSQL function', 'a|e|i|o|u', 'X', 1, 0, 'i')
                                   X PXstgrXSQL fXnctXXn
regexp_replace(string=>'A PostgreSQL function', pattern=>'a|e|i|o|u', replacement=>'X', start=>1, "N"=>3, flags=>'i')
                                   A PostgrXSQL function
```

`regexp_split_to_table` function က POSIX regular expression pattern တစ်ခုကို delimiter (ပိုင်းခြားစာ) အဖြစ် သုံးပြီး string တစ်ခုကို ခွဲခြမ်းပေးပါတယ်။ Syntax က `regexp_split_to_table`(`string`, `pattern` [, flags ]) ဖြစ်ပါတယ်။ `pattern` နဲ့ ကိုက်ညီမှု မရှိရင် — function က `string` ကိုပဲ ပြန်ပေးပါတယ်။ Match အနည်းဆုံး တစ်ခု ရှိရင် — match တစ်ခုချင်းစီအတွက် — နောက်ဆုံး match ရဲ့ အဆုံး (သို့မဟုတ် string ရဲ့ အစ) ကနေ match ရဲ့ အစအထိ ရှိတဲ့ စာသားကို ပြန်ပေးပါတယ်။ Match တွေ မကျန်တော့တဲ့အခါ — နောက်ဆုံး match ရဲ့ အဆုံးကနေ string ရဲ့ အဆုံးအထိ စာသားကို ပြန်ပေးပါတယ်။ `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ `regexp_split_to_table` က [ဇယား 9.24] မှာ ဖော်ပြထားတဲ့ flag တွေကို ထောက်ပံ့ပါတယ်။

`regexp_split_to_array` function က `regexp_split_to_table` နဲ့ အတူတူပဲ ပြုမူပါတယ် — ခြားနားချက်က `regexp_split_to_array` က သူ့ရဲ့ ရလဒ်ကို `text` array တစ်ခုအနေနဲ့ ပြန်ပေးတာပါ။ Syntax က `regexp_split_to_array`(`string`, `pattern` [, flags ]) ဖြစ်ပါတယ်။ Parameter တွေက `regexp_split_to_table` အတွက်နဲ့ အတူတူပါ။

ဥပမာအချို့:

```sql
SELECT foo FROM regexp_split_to_table('the quick brown fox jumps over the lazy dog', '\s+') AS foo;
  foo
-------
 the
 quick
 brown
 fox
 jumps
 over
 the
 lazy
 dog
(9 rows)

SELECT regexp_split_to_array('the quick brown fox jumps over the lazy dog', '\s+');
              regexp_split_to_array
-----------------------------------------------
 {the,quick,brown,fox,jumps,over,the,lazy,dog}
(1 row)

SELECT foo FROM regexp_split_to_table('the quick brown fox', '\s*') AS foo;
 foo
-----
 t
 h
 e
 q
 u
 i
 c
 k
 b
 r
 o
 w
 n
 f
 o
 x
(16 rows)
```

နောက်ဆုံး ဥပမာက ပြသသလို — regexp split function တွေက string ရဲ့ အစ သို့မဟုတ် အဆုံးမှာ ဒါမှမဟုတ် ယခင် match တစ်ခုရဲ့ နောက်မှာ ချက်ချင်း ဖြစ်ပေါ်တဲ့ zero-length match တွေကို လျစ်လျူရှုပါတယ်။ ဒါက တခြား regexp function တွေက အကောင်အထည်ဖော်တဲ့ တင်းကျပ်တဲ့ regexp matching အဓိပ္ပာယ် သတ်မှတ်ချက်နဲ့ ဆန့်ကျင်ပေမယ့် — လက်တွေ့မှာတော့ ပုံမှန်အားဖြင့် အဆင်ပြေဆုံး အပြုအမူ ဖြစ်ပါတယ်။ Perl လို တခြား software system တွေကလည်း အလားတူ အဓိပ္ပာယ် သတ်မှတ်ချက်တွေ သုံးပါတယ်။

`regexp_substr` function က POSIX regular expression pattern တစ်ခုနဲ့ ကိုက်ညီတဲ့ substring ကို ပြန်ပေးပါတယ် — match မရှိရင်တော့ `NULL` ပြန်ပေးပါတယ်။ Syntax က `regexp_substr`(`string`, `pattern` [, start [, N [, flags [, subexpr ]]]]) ဖြစ်ပါတယ်။ `pattern` ကို `string` ထဲမှာ — ပုံမှန်အားဖြင့် string ရဲ့ အစကနေ — ရှာဖွေပြီး — `start` parameter ပေးထားရင်တော့ အဲဒီ character index ကနေ စပြီး ရှာဖွေပါတယ်။ `N` သတ်မှတ်ထားရင် pattern ရဲ့ `N`'th match ကို ပြန်ပေးပြီး — မဟုတ်ရင် ပထမဆုံး match ကို ပြန်ပေးပါတယ်။ `flags` parameter က function ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ single-letter flag သုည ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်နိုင်တဲ့ optional text string တစ်ခုပါ။ ထောက်ပံ့ထားတဲ့ flag တွေကို [ဇယား 9.24] မှာ ဖော်ပြထားပါတယ်။ Parenthesized subexpression တွေ ပါတဲ့ pattern တစ်ခုအတွက် — `subexpr` က ဘယ် subexpression ကို စိတ်ဝင်စားလဲ ဖော်ပြတဲ့ integer ဖြစ်ပါတယ်: ရလဒ်က အဲဒီ subexpression နဲ့ ကိုက်ညီတဲ့ substring ပါ။ Subexpression တွေကို သူတို့ရဲ့ ရှေ့ဆုံး parentheses တွေရဲ့ အစဉ်အတိုင်း နံပါတ် တပ်ပါတယ်။ `subexpr` ကို ချန်လိုက်ရင် သို့မဟုတ် သုည ဆိုရင် — parenthesized subexpression တွေ ရှိရှိမရှိ — ရလဒ်က match တစ်ခုလုံးပါ။

ဥပမာအချို့:

```sql
regexp_substr('number of your street, town zip, FR', '[^,]+', 1, 2)
                                    town zip
regexp_substr('ABCDEFGHI', '(c..)(...)', 1, 1, 'i', 2)
                                   FGH
```

#### 9.7.3.1. Regular Expression Details (regular expression အသေးစိတ်)

PostgreSQL ရဲ့ regular expression တွေကို Henry Spencer ရေးသားတဲ့ software package တစ်ခုနဲ့ အကောင်အထည်ဖော်ထားပါတယ်။ အောက်က regular expression ဖော်ပြချက် အများစုကို သူ့ရဲ့ manual ကနေ တိုက်ရိုက် ကူးယူထားတာပါ။

POSIX 1003.2 မှာ သတ်မှတ်ထားတဲ့အတိုင်း regular expression (RE) တွေက ပုံစံ နှစ်မျိုး ရှိပါတယ်: *extended* RE (ERE) — အကြမ်းဖျင်းအားဖြင့် `egrep` ရဲ့ ပုံစံ — နဲ့ *basic* RE (BRE) — အကြမ်းဖျင်းအားဖြင့် `ed` ရဲ့ ပုံစံ — တို့ပါ။ PostgreSQL က ပုံစံ နှစ်မျိုးလုံးကို ထောက်ပံ့ပြီး — POSIX standard ထဲမှာ မပါပေမယ့် Perl နဲ့ Tcl လို programming language တွေမှာ ရနိုင်လို့ ကျယ်ကျယ်ပြန့်ပြန့် သုံးစွဲလာတဲ့ extension တချို့ကိုလည်း အကောင်အထည်ဖော်ပါတယ်။ ဒီ non-POSIX extension တွေကို သုံးထားတဲ့ RE တွေကို ဒီ documentation မှာ *advanced* RE (ARE) လို့ ခေါ်ပါတယ်။ ARE တွေက ERE တွေရဲ့ superset (အစုအဝေး အပြည့်) နီးပါး ဖြစ်ပေမယ့် — BRE တွေမှာတော့ (အများကြီး ပိုအကန့်အသတ် ရှိတာအပြင်) notation ပိုင်းဆိုင်ရာ မကိုက်ညီမှုတွေ အများအပြား ရှိပါတယ်။ ARE နဲ့ ERE ပုံစံတွေကို အရင်ဆုံး ဖော်ပြပြီး — ARE တွေမှာပဲ သက်ရောက်တဲ့ feature တွေကို မှတ်သားကာ — နောက်မှ BRE တွေ ဘယ်လို ကွဲပြားလဲ ဖော်ပြပါမယ်။

> **မှတ်ချက်:** PostgreSQL က regular expression တစ်ခုကို ကနဦးမှာ ARE စည်းမျဉ်းတွေနဲ့ပဲ အမြဲ ယူဆပါတယ်။ ဒါပေမယ့် — [အပိုင်း 9.7.3.4] မှာ ဖော်ပြထားသလို — RE pattern ရဲ့ ရှေ့မှာ *embedded option* တစ်ခု ထည့်ပြီး ပိုအကန့်အသတ် ရှိတဲ့ ERE သို့မဟုတ် BRE စည်းမျဉ်းတွေကို ရွေးချယ်လို့ ရပါတယ်။ POSIX 1003.2 စည်းမျဉ်းတွေကို အတိအကျ မျှော်လင့်ထားတဲ့ application တွေနဲ့ လိုက်ဖက်ညီမှုအတွက် ဒါက အသုံးဝင်နိုင်ပါတယ်။

Regular expression တစ်ခုကို `|` တွေနဲ့ ခြားထားတဲ့ *branch* တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို အဖြစ် သတ်မှတ်ပါတယ်။ ၎င်းက branch တစ်ခုခုနဲ့ ကိုက်ညီတဲ့ ဘာကိုမဆို ကိုက်ညီပါတယ်။

Branch တစ်ခုက *quantified atom* သို့မဟုတ် *constraint* သုည ခု သို့မဟုတ် ထို့ထက်ပို ဆက်တိုက် ပါဝင်တာပါ။ ပထမ အတွက် ကိုက်ညီမှု၊ ၎င်းနောက် ဒုတိယ အတွက် ကိုက်ညီမှု စသဖြင့် ကိုက်ညီပြီး — empty branch က empty string နဲ့ ကိုက်ညီပါတယ်။

Quantified atom တစ်ခုက *atom* တစ်ခု ဖြစ်ပြီး — ၎င်းနောက်မှာ *quantifier* တစ်ခုတည်း လိုက်နိုင်ပါတယ်။ Quantifier မပါဘဲနဲ့ atom အတွက် ကိုက်ညီမှု တစ်ခုနဲ့ ကိုက်ညီပါတယ်။ Quantifier ပါရင် atom ရဲ့ ကိုက်ညီမှု အရေအတွက် တစ်ခုခုနဲ့ ကိုက်ညီနိုင်ပါတယ်။ *atom* တစ်ခုက [ဇယား 9.17] မှာ ပြထားတဲ့ ဖြစ်နိုင်ခြေတွေထဲက ဘယ်ဟာမဆို ဖြစ်နိုင်ပါတယ်။ ဖြစ်နိုင်တဲ့ quantifier တွေနဲ့ သူတို့ရဲ့ အဓိပ္ပာယ်တွေကို [ဇယား 9.18] မှာ ပြထားပါတယ်။

*constraint* တစ်ခုက empty string နဲ့ ကိုက်ညီပေမယ့် — သတ်မှတ်ထားတဲ့ အခြေအနေတွေ ပြည့်မှသာ ကိုက်ညီပါတယ်။ Constraint ကို atom သုံးလို့ ရတဲ့ နေရာမှာ သုံးလို့ ရပေမယ့် — ၎င်းနောက်မှာ quantifier လိုက်လို့တော့ မရပါဘူး။ ရိုးရှင်းတဲ့ constraint တွေကို [ဇယား 9.19] မှာ ပြထားပြီး — နောက်ထပ် constraint တချို့ကို နောက်မှာ ဖော်ပြပါမယ်။

**ဇယား 9.17. Regular Expression Atoms (regular expression atom များ)**

| Atom | ဖော်ပြချက် |
| --- | --- |
| `(``re``)` | (`re` က ဘယ် regular expression မဆို ဖြစ်တဲ့အခါ) `re` အတွက် ကိုက်ညီမှု တစ်ခုနဲ့ ကိုက်ညီပြီး — ဒီ match ကို နောက်မှာ သတင်းပို့နိုင်ဖို့ မှတ်သားထားပါတယ် |
| `(?:``re``)` | အပေါ်အတိုင်းပဲ — ဒါပေမယ့် match ကို သတင်းပို့ရန်အတွက် မှတ်သားမထားပါဘူး (“non-capturing” parentheses အစုတစ်ခု) (AREs တွေမှာပဲ) |
| `.` | character တစ်ခုခုနဲ့ ကိုက်ညီသည် |
| `[``chars``]` | *bracket expression* တစ်ခု — `chars` ထဲက တစ်ခုခုနဲ့ ကိုက်ညီသည် (အသေးစိတ်အတွက် [အပိုင်း 9.7.3.2] ကို ကြည့်ပါ) |
| `\``k` | (`k` က alphanumeric မဟုတ်တဲ့ character တစ်ခု ဖြစ်တဲ့အခါ) အဲဒီ character ကို သာမန် character တစ်ခုအနေနဲ့ ကိုက်ညီသည် — ဥပမာ `\\` က backslash character တစ်ခုနဲ့ ကိုက်ညီသည် |
| `\``c` | `c` က alphanumeric (နောက်မှာ တခြား character တွေ လိုက်နိုင်) ဖြစ်တဲ့အခါ — *escape* တစ်ခု ဖြစ်သည် — [အပိုင်း 9.7.3.3] ကို ကြည့်ပါ (AREs တွေမှာပဲ; EREs နဲ့ BREs တွေမှာတော့ ဒါက `c` နဲ့ ကိုက်ညီသည်) |
| `{` | digit မဟုတ်တဲ့ character တစ်ခုရဲ့ နောက်မှာ လာရင် left-brace character `{` နဲ့ ကိုက်ညီပြီး — digit တစ်ခုရဲ့ နောက်မှာ လာရင် `bound` တစ်ခုရဲ့ အစ ဖြစ်သည် (အောက်မှာ ကြည့်ပါ) |
| `x` | `x` က တခြား အဓိပ္ပာယ် မရှိတဲ့ character တစ်ခုတည်း ဖြစ်တဲ့အခါ — အဲဒီ character နဲ့ ကိုက်ညီသည် |

RE တစ်ခုက backslash (`\`) နဲ့ အဆုံးသတ်လို့ မရပါဘူး။

> **မှတ်ချက်:** [standard_conforming_strings](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-STANDARD-CONFORMING-STRINGS) ကို ပိတ်ထားရင် — literal string constant တွေထဲမှာ သင်ရေးတဲ့ backslash တိုင်းကို နှစ်ဆ ရေးရပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 4.1.2.1](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။

**ဇယား 9.18. Regular Expression Quantifiers (regular expression quantifier များ)**

| Quantifier | ကိုက်ညီမှု (Matches) |
| --- | --- |
| `*` | atom ရဲ့ match 0 ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်တဲ့ sequence |
| `+` | atom ရဲ့ match 1 ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်တဲ့ sequence |
| `?` | atom ရဲ့ match 0 ခု သို့မဟုတ် 1 ခု ပါဝင်တဲ့ sequence |
| `{``m``}` | atom ရဲ့ match အတိအကျ `m` ခု ပါဝင်တဲ့ sequence |
| `{``m``,}` | atom ရဲ့ match `m` ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်တဲ့ sequence |
| `{``m``,``n``}` | atom ရဲ့ match `m` ခုကနေ `n` ခု (`n` ပါအပါအဝင်) အထိ ပါဝင်တဲ့ sequence; `m` က `n` ထက် မများရပါဘူး |
| `*?` | `*` ၏ non-greedy ဗားရှင်း |
| `+?` | `+` ၏ non-greedy ဗားရှင်း |
| `??` | `?` ၏ non-greedy ဗားရှင်း |
| `{``m``}?` | `{``m``}` ၏ non-greedy ဗားရှင်း |
| `{``m``,}?` | `{``m``,}` ၏ non-greedy ဗားရှင်း |
| `{``m``,``n``}?` | `{``m``,``n``}` ၏ non-greedy ဗားရှင်း |

`{``...``}` သုံးထားတဲ့ ပုံစံတွေကို *bounds* လို့ ခေါ်ပါတယ်။ Bound တစ်ခုထဲက `m` နဲ့ `n` ဂဏန်းတွေက 0 ကနေ 255 အထိ (255 ပါအပါအဝင်) တန်ဖိုး ယူနိုင်တဲ့ unsigned decimal integer တွေပါ။

*Non-greedy* quantifier တွေ (AREs တွေမှာပဲ ရနိုင်တာ) က သူတို့နဲ့ သက်ဆိုင်တဲ့ သာမန် (*greedy*) quantifier တွေနဲ့ ဖြစ်နိုင်ခြေ အတူတူပဲ ရှိပေမယ့် — match အရေအတွက် အများဆုံး မဟုတ်ဘဲ — အနည်းဆုံးကို ဦးစားပေးပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 9.7.3.5] ကို ကြည့်ပါ။

> **မှတ်ချက်:** Quantifier တစ်ခုက နောက် quantifier တစ်ခုရဲ့ နောက်မှာ ချက်ချင်း လိုက်လို့ မရပါဘူး — ဥပမာ `**` က invalid ပါ။ Quantifier တစ်ခုက expression သို့မဟုတ် subexpression တစ်ခုကို စတင်လို့ မရသလို — `^` သို့မဟုတ် `|` ရဲ့ နောက်မှာလည်း လိုက်လို့ မရပါဘူး။

**ဇယား 9.19. Regular Expression Constraints (regular expression constraint များ)**

| Constraint | ဖော်ပြချက် |
| --- | --- |
| `^` | string ရဲ့ အစမှာ ကိုက်ညီသည် |
| `$` | string ရဲ့ အဆုံးမှာ ကိုက်ညီသည် |
| `(?=``re``)` | *positive lookahead* — `re` နဲ့ ကိုက်ညီတဲ့ substring တစ်ခု စတင်တဲ့ နေရာတိုင်းမှာ ကိုက်ညီသည် (AREs တွေမှာပဲ) |
| `(?!``re``)` | *negative lookahead* — `re` နဲ့ ကိုက်ညီတဲ့ substring မစတင်တဲ့ နေရာတိုင်းမှာ ကိုက်ညီသည် (AREs တွေမှာပဲ) |
| `(?<=``re``)` | *positive lookbehind* — `re` နဲ့ ကိုက်ညီတဲ့ substring တစ်ခု ဆုံးတဲ့ နေရာတိုင်းမှာ ကိုက်ညီသည် (AREs တွေမှာပဲ) |
| `(?<!``re``)` | *negative lookbehind* — `re` နဲ့ ကိုက်ညီတဲ့ substring မဆုံးတဲ့ နေရာတိုင်းမှာ ကိုက်ညီသည် (AREs တွေမှာပဲ) |

Lookahead နဲ့ lookbehind constraint တွေထဲမှာ *back reference* တွေ ([အပိုင်း 9.7.3.3] ကို ကြည့်ပါ) မပါဝင်နိုင်ပြီး — သူတို့ထဲက parentheses တွေ အားလုံးကို non-capturing အဖြစ် သတ်မှတ်ပါတယ်။

#### 9.7.3.2. Bracket Expressions (bracket expression များ)

*bracket expression* ဆိုတာ `[]` ထဲမှာ ဝန်းရံထားတဲ့ character စာရင်း တစ်ခုပါ။ ၎င်းက ပုံမှန်အားဖြင့် စာရင်းထဲက character တစ်ခုခုနဲ့ ကိုက်ညီပါတယ် (ဒါပေမယ့် အောက်မှာ ကြည့်ပါ)။ စာရင်းက `^` နဲ့ စတင်ရင် — ကျန် စာရင်းထဲက မဟုတ်တဲ့ character တစ်ခုခုနဲ့ ကိုက်ညီပါတယ်။ စာရင်းထဲက character နှစ်ခုကို `-` နဲ့ ခြားထားရင် — ဒါက collating sequence ထဲမှာ အဲဒီ character နှစ်ခုကြား (နှစ်ခုလုံး ပါအပါအဝင်) ရှိတဲ့ character အပြည့် အကွာအဝေး (range) ရဲ့ အတိုကောက် ဖြစ်ပါတယ် — ဥပမာ ASCII မှာ `[0-9]` က decimal digit တစ်ခုခုနဲ့ ကိုက်ညီပါတယ်။ Range နှစ်ခုက အဆုံးမှတ် (endpoint) တစ်ခုတည်းကို မျှဝေသုံးစွဲတာ — ဥပမာ `a-c-e` — ဆိုရင် မတရားပါဘူး။ Range တွေက collating sequence အပေါ် အလွန် မူတည်လို့ — portable program တွေက ဒါတွေကို အားကိုးတာ ရှောင်သင့်ပါတယ်။

စာရင်းထဲမှာ literal `]` တစ်ခု ထည့်ဖို့ဆိုရင် — ၎င်းကို ပထမဆုံး character အဖြစ် ထားပါ (`^` သုံးထားရင် ၎င်းရဲ့ နောက်မှာ)။ Literal `-` တစ်ခု ထည့်ဖို့ဆိုရင် — ၎င်းကို ပထမ သို့မဟုတ် နောက်ဆုံး character အဖြစ် ဒါမှမဟုတ် range တစ်ခုရဲ့ ဒုတိယ အဆုံးမှတ်အဖြစ် ထားပါ။ Literal `-` ကို range တစ်ခုရဲ့ ပထမ အဆုံးမှတ်အဖြစ် သုံးချင်ရင် — collating element တစ်ခု ဖြစ်အောင် `[.` နဲ့ `.]` ထဲမှာ ဝန်းရံထားပါ (အောက်မှာ ကြည့်ပါ)။ ဒီ character တွေ၊ `[` သုံးတဲ့ ပေါင်းစပ်မှုတချို့ (နောက် paragraph တွေမှာ ကြည့်ပါ) နဲ့ escape တွေ (AREs တွေမှာပဲ) ကလွဲလို့ — တခြား special character တွေ အားလုံးက bracket expression တစ်ခုအတွင်းမှာ သူတို့ရဲ့ အထူး အဓိပ္ပာယ်ကို ဆုံးရှုံးပါတယ်။ အထူးသဖြင့် — `\\` က ERE သို့မဟုတ် BRE စည်းမျဉ်းတွေ အောက်မှာ special မဟုတ်ပေမယ့် — AREs တွေမှာတော့ (escape တစ်ခုကို မိတ်ဆက်ပေးတဲ့အနေနဲ့) special ဖြစ်ပါတယ်။

Bracket expression တစ်ခုအတွင်းမှာ — `[.` နဲ့ `.]` ထဲမှာ ဝန်းရံထားတဲ့ collating element တစ်ခု (character တစ်ခု၊ character တစ်ခုတည်းလိုပဲ စုစည်းစီစဉ်ခံရတဲ့ character အများအပြား sequence တစ်ခု၊ ဒါမှမဟုတ် နှစ်ခုလုံးထဲက တစ်ခုအတွက် collating-sequence နာမည်) က အဲဒီ collating element ရဲ့ character sequence ကို ကိုယ်စားပြုပါတယ်။ ဒီ sequence ကို bracket expression ရဲ့ စာရင်းထဲက element တစ်ခုတည်းအနေနဲ့ သဘောထားပါတယ်။ ဒါက character အများအပြား ပါတဲ့ collating element ပါဝင်တဲ့ bracket expression တစ်ခုကို character တစ်ခုထက်ပိုနဲ့ ကိုက်ညီစေနိုင်ပါတယ် — ဥပမာ collating sequence မှာ `ch` collating element ပါရင် — RE `[[.ch.]]*c` က `chchcc` ရဲ့ ပထမ character ငါးခုနဲ့ ကိုက်ညီပါတယ်။

> **မှတ်ချက်:** PostgreSQL က လောလောဆယ် character အများအပြား ပါတဲ့ collating element တွေကို မထောက်ပံ့ပါသေးဘူး။ ဒီအချက်အလက်က နောက်ပိုင်း ဖြစ်နိုင်ခြေ ရှိတဲ့ အပြုအမူကို ဖော်ပြတာပါ။

Bracket expression တစ်ခုအတွင်းမှာ — `[=` နဲ့ `=]` ထဲမှာ ဝန်းရံထားတဲ့ collating element တစ်ခုက *equivalence class* (ညီမျှအုပ်စု) တစ်ခု ဖြစ်ပြီး — ၎င်းနဲ့ ညီမျှတဲ့ collating element တွေ အားလုံး (၎င်းကိုယ်တိုင် အပါအဝင်) ရဲ့ character sequence တွေကို ကိုယ်စားပြုပါတယ်။ (တခြား ညီမျှတဲ့ collating element တွေ မရှိရင် — ဝန်းရံတဲ့ delimiter တွေက `[.` နဲ့ `.]` ဖြစ်နေသလိုပဲ သဘောထားပါတယ်။) ဥပမာ — `o` နဲ့ `^` တို့က equivalence class တစ်ခုရဲ့ အဖွဲ့ဝင်တွေ ဆိုရင် — `[[=o=]]`, `[[=^=]]` နဲ့ `[o^]` တို့က အားလုံး တူညီပါတယ်။ Equivalence class တစ်ခုက range တစ်ခုရဲ့ အဆုံးမှတ် ဖြစ်လို့ မရပါဘူး။

Bracket expression တစ်ခုအတွင်းမှာ — `[:` နဲ့ `:]` ထဲမှာ ဝန်းရံထားတဲ့ character class တစ်ခုရဲ့ နာမည်က အဲဒီ class ထဲက character တွေ အားလုံးရဲ့ စာရင်းကို ကိုယ်စားပြုပါတယ်။ Character class တစ်ခုက range တစ်ခုရဲ့ အဆုံးမှတ်အဖြစ် သုံးလို့ မရပါဘူး။ POSIX standard က ဒီ character class နာမည်တွေကို သတ်မှတ်ထားပါတယ်: `alnum` (letter နဲ့ numeric digit), `alpha` (letter), `blank` (space နဲ့ tab), `cntrl` (control character), `digit` (numeric digit), `graph` (space မပါတဲ့ printable character), `lower` (lower-case letter), `print` (space အပါအဝင် printable character), `punct` (punctuation), `space` (white space ဘာမဆို), `upper` (upper-case letter), နဲ့ `xdigit` (hexadecimal digit) တို့ပါ။ ဒီ standard character class တွေရဲ့ အပြုအမူက 7-bit ASCII set ထဲက character တွေအတွက်တော့ platform တွေကြားမှာ ယေဘုယျအားဖြင့် တသမတ်တည်း ဖြစ်ပါတယ်။ Non-ASCII character တစ်ခုက ဒီ class တွေထဲက တစ်ခုခုထဲ ပါဝင်တယ်လို့ သတ်မှတ်ခြင်း ရှိမရှိက — regular-expression function သို့မဟုတ် operator အတွက် သုံးတဲ့ *collation* ([အပိုင်း 23.2](https://www.postgresql.org/docs/current/collation.html) ကို ကြည့်ပါ) အပေါ် မူတည်ပြီး — ပုံမှန်အားဖြင့်တော့ database ရဲ့ `LC_CTYPE` locale setting ([အပိုင်း 23.1](https://www.postgresql.org/docs/current/locale.html) ကို ကြည့်ပါ) အပေါ် မူတည်ပါတယ်။ Non-ASCII character တွေရဲ့ အမျိုးအစား ခွဲခြားမှုက နာမည် ဆင်တူတဲ့ locale တွေမှာတောင် platform တစ်ခုနဲ့ တစ်ခု ကွဲပြားနိုင်ပါတယ်။ (ဒါပေမယ့် `C` locale က non-ASCII character တွေကို ဒီ class တွေထဲက ဘယ်ဟာထဲမှာမှ ဘယ်တော့မှ မပါဝင်စေပါဘူး။) ဒီ standard character class တွေအပြင် — PostgreSQL က `word` character class ကိုလည်း သတ်မှတ်ပါတယ် — ဒါက `alnum` ပေါ်မှာ underscore (`_`) character ထပ်ထည့်ထားတာနဲ့ အတူတူပါ — ပြီးတော့ 7-bit ASCII set အတိအကျ ပါဝင်တဲ့ `ascii` character class လည်း ရှိပါတယ်။

Bracket expression တွေရဲ့ အထူးကိစ္စ နှစ်ခု ရှိပါတယ်: `[[:<:]]` နဲ့ `[[:>:]]` ဆိုတဲ့ bracket expression တွေက constraint တွေ ဖြစ်ပြီး — word တစ်ခုရဲ့ အစနဲ့ အဆုံးမှာ အသီးသီး empty string တွေနဲ့ ကိုက်ညီပါတယ်။ Word ဆိုတာက — word character တွေရဲ့ ရှေ့မှာရော နောက်မှာပါ word character တွေ မရှိတဲ့ sequence တစ်ခုအဖြစ် သတ်မှတ်ပါတယ်။ Word character ဆိုတာ `word` character class ထဲက character ဘာမဆို — ဆိုလိုတာက letter, digit သို့မဟုတ် underscore ဘာမဆို — ဖြစ်ပါတယ်။ ဒါက POSIX 1003.2 နဲ့ လိုက်ဖက်ညီပေမယ့် အဲဒီမှာ သတ်မှတ်မထားတဲ့ extension တစ်ခုဖြစ်လို့ — တခြား system တွေဆီ portable ဖြစ်ဖို့ ရည်ရွယ်ထားတဲ့ software တွေမှာ သတိထား သုံးသင့်ပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့ constraint escape တွေက ပုံမှန်အားဖြင့် ပိုသင့်လျော်ပါတယ် — သူတို့က standard ပိုမဟုတ်ပေမယ့် — ရိုက်ဖို့ ပိုလွယ်ပါတယ်။

#### 9.7.3.3. Regular Expression Escapes (regular expression escape များ)

*Escape* တွေက `\` နဲ့ စပြီး — ၎င်းနောက်မှာ alphanumeric character တစ်ခု လိုက်တဲ့ အထူး sequence တွေပါ။ Escape တွေက မျိုးကွဲ အများအပြား ရှိပါတယ်: character entry, class shorthand, constraint escape နဲ့ back reference တို့ပါ။ `\` နောက်မှာ alphanumeric character တစ်ခု လိုက်ပေမယ့် — valid escape တစ်ခု မဖြစ်ရင် AREs တွေမှာ မတရားပါဘူး။ EREs တွေမှာတော့ escape ဆိုတာ မရှိပါဘူး: bracket expression တစ်ခုရဲ့ အပြင်မှာ — `\` နောက်က alphanumeric character က အဲဒီ character ကို သာမန် character တစ်ခုအနေနဲ့ပဲ ကိုယ်စားပြုပြီး — bracket expression တစ်ခုရဲ့ အတွင်းမှာတော့ `\` က သာမန် character တစ်ခုပါ။ (နောက်ဆုံးအချက်က EREs နဲ့ AREs ကြားက တကယ့် မကိုက်ညီမှု တစ်ခုတည်း ဖြစ်ပါတယ်။)

*Character-entry escape* တွေက REs တွေမှာ ပုံနှိပ်လို့ မရတဲ့ သို့မဟုတ် တခြား အဆင်မပြေတဲ့ character တွေကို သတ်မှတ်ရတာ ပိုလွယ်ကူအောင် ရှိနေတာပါ။ သူတို့ကို [ဇယား 9.20] မှာ ပြထားပါတယ်။

*Class-shorthand escape* တွေက သုံးလေ့ရှိတဲ့ character class တချို့အတွက် အတိုကောက်တွေ ပေးပါတယ်။ သူတို့ကို [ဇယား 9.21] မှာ ပြထားပါတယ်။

*constraint escape* တစ်ခုက — escape တစ်ခုအနေနဲ့ ရေးထားတဲ့ constraint တစ်ခု ဖြစ်ပြီး — သတ်မှတ်ထားတဲ့ အခြေအနေတွေ ပြည့်ရင် empty string နဲ့ ကိုက်ညီပါတယ်။ သူတို့ကို [ဇယား 9.22] မှာ ပြထားပါတယ်။

*back reference* တစ်ခု (`\``n`) က — နံပါတ် `n` နဲ့ သတ်မှတ်ထားတဲ့ ယခင် parenthesized subexpression က ကိုက်ညီခဲ့တဲ့ string အတိုင်းပဲ ကိုက်ညီပါတယ် ([ဇယား 9.23] ကို ကြည့်ပါ)။ ဥပမာ — `([bc])\1` က `bb` သို့မဟုတ် `cc` နဲ့ ကိုက်ညီပြီး — `bc` သို့မဟုတ် `cb` နဲ့တော့ မကိုက်ညီပါဘူး။ Subexpression က RE ထဲမှာ back reference ရဲ့ ရှေ့မှာ အပြည့်အစုံ ရှိနေရပါမယ်။ Subexpression တွေကို သူတို့ရဲ့ ရှေ့ဆုံး parentheses တွေရဲ့ အစဉ်အတိုင်း နံပါတ် တပ်ပါတယ်။ Non-capturing parentheses တွေက subexpression တွေကို မသတ်မှတ်ပါဘူး။ Back reference က ရည်ညွှန်းထားတဲ့ subexpression နဲ့ ကိုက်ညီခဲ့တဲ့ string character တွေကိုပဲ ထည့်စဉ်းစားပြီး — ၎င်းထဲမှာ ပါဝင်တဲ့ constraint တွေကို မစဉ်းစားပါဘူး။ ဥပမာ — `(^\d)\1` က `22` နဲ့ ကိုက်ညီပါမယ်။

**ဇယား 9.20. Regular Expression Character-Entry Escapes (regular expression character-entry escape များ)**

| Escape | ဖော်ပြချက် |
| --- | --- |
| `\a` | alert (bell) character — C မှာလိုပါ |
| `\b` | backspace — C မှာလိုပါ |
| `\B` | backslash (`\`) အတွက် synonym — backslash နှစ်ဆ ရေးစရာ မလိုအောင် ကူညီပေးသည် |
| `\c``X` | (`X` က ဘယ် character မဆို ဖြစ်တဲ့အခါ) `X` ရဲ့ low-order bit 5 ခုနဲ့ တူညီပြီး — ကျန် bit တွေ အားလုံး သုည ဖြစ်တဲ့ character |
| `\e` | collating-sequence နာမည် `ESC` ဖြစ်တဲ့ character — မရှိရင်တော့ octal တန်ဖိုး `033` ရှိတဲ့ character |
| `\f` | form feed — C မှာလိုပါ |
| `\n` | newline — C မှာလိုပါ |
| `\r` | carriage return — C မှာလိုပါ |
| `\t` | horizontal tab — C မှာလိုပါ |
| `\u``wxyz` | (`wxyz` က hexadecimal digit အတိအကျ လေးခု ဖြစ်တဲ့အခါ) hexadecimal တန်ဖိုး `0x``wxyz` ရှိတဲ့ character |
| `\U``stuvwxyz` | (`stuvwxyz` က hexadecimal digit အတိအကျ ရှစ်ခု ဖြစ်တဲ့အခါ) hexadecimal တန်ဖိုး `0x``stuvwxyz` ရှိတဲ့ character |
| `\v` | vertical tab — C မှာလိုပါ |
| `\x``hhh` | (`hhh` က hexadecimal digit sequence ဘာမဆို ဖြစ်တဲ့အခါ) hexadecimal တန်ဖိုး `0x``hhh` ရှိတဲ့ character (hexadecimal digit ဘယ်နှစ်ခု သုံးသုံး character တစ်ခုတည်းပါ) |
| `\0` | တန်ဖိုး `0` ရှိတဲ့ character (null byte) |
| `\``xy` | (`xy` က octal digit အတိအကျ နှစ်ခု ဖြစ်ပြီး *back reference* မဟုတ်တဲ့အခါ) octal တန်ဖိုး `0``xy` ရှိတဲ့ character |
| `\``xyz` | (`xyz` က octal digit အတိအကျ သုံးခု ဖြစ်ပြီး *back reference* မဟုတ်တဲ့အခါ) octal တန်ဖိုး `0``xyz` ရှိတဲ့ character |

Hexadecimal digit တွေက `0`-`9`, `a`-`f` နဲ့ `A`-`F` ပါ။ Octal digit တွေက `0`-`7` ပါ။

ASCII range (0–127) ပြင်ပ တန်ဖိုးတွေကို သတ်မှတ်တဲ့ numeric character-entry escape တွေရဲ့ အဓိပ္ပာယ်က database encoding အပေါ် မူတည်ပါတယ်။ Encoding က UTF-8 ဖြစ်တဲ့အခါ — escape တန်ဖိုးတွေက Unicode code point တွေနဲ့ ညီမျှပါတယ် — ဥပမာ `\u1234` က `U+1234` ဆိုတဲ့ character ကို ဆိုလိုပါတယ်။ တခြား multibyte encoding တွေမှာတော့ character-entry escape တွေက ပုံမှန်အားဖြင့် character အတွက် byte တန်ဖိုးတွေရဲ့ ဆက်စပ်မှုကိုပဲ သတ်မှတ်ပါတယ်။ Escape တန်ဖိုးက database encoding ထဲက တရားဝင် character တစ်ခုခုနဲ့ မကိုက်ညီရင် — error တက်မှာ မဟုတ်ပေမယ့် — data ဘယ်တစ်ခုနဲ့မှ ကိုက်ညီတော့ မည် မဟုတ်ပါဘူး။

Character-entry escape တွေကို အမြဲတမ်း သာမန် character တွေအနေနဲ့ သဘောထားပါတယ်။ ဥပမာ — `\135` က ASCII မှာ `]` ဖြစ်ပေမယ့် — `\135` က bracket expression တစ်ခုကို အဆုံးသတ်တာ မဟုတ်ပါဘူး။

**ဇယား 9.21. Regular Expression Class-Shorthand Escapes (regular expression class-shorthand escape များ)**

| Escape | ဖော်ပြချက် |
| --- | --- |
| `\d` | digit ဘာမဆိုနဲ့ ကိုက်ညီသည် — `[[:digit:]]` လိုပါ |
| `\s` | whitespace character ဘာမဆိုနဲ့ ကိုက်ညီသည် — `[[:space:]]` လိုပါ |
| `\w` | word character ဘာမဆိုနဲ့ ကိုက်ညီသည် — `[[:word:]]` လိုပါ |
| `\D` | digit မဟုတ်တာ ဘာမဆိုနဲ့ ကိုက်ညီသည် — `[^[:digit:]]` လိုပါ |
| `\S` | whitespace မဟုတ်တဲ့ character ဘာမဆိုနဲ့ ကိုက်ညီသည် — `[^[:space:]]` လိုပါ |
| `\W` | word မဟုတ်တဲ့ character ဘာမဆိုနဲ့ ကိုက်ညီသည် — `[^[:word:]]` လိုပါ |

Class-shorthand escape တွေက bracket expression တွေအတွင်းမှာလည်း အလုပ်လုပ်ပါတယ် — အပေါ်မှာ ပြထားတဲ့ သတ်မှတ်ချက်တွေက အဲဒီ context မှာတော့ syntax အရ သိပ် valid မဟုတ်ပေမယ့်ပေါ့။ ဥပမာ — `[a-c\d]` က `[a-c[:digit:]]` နဲ့ ညီမျှပါတယ်။

**ဇယား 9.22. Regular Expression Constraint Escapes (regular expression constraint escape များ)**

| Escape | ဖော်ပြချက် |
| --- | --- |
| `\A` | string ရဲ့ အစမှာပဲ ကိုက်ညီသည် (`^` နဲ့ ဘယ်လို ကွာခြားလဲအတွက် [အပိုင်း 9.7.3.5] ကို ကြည့်ပါ) |
| `\m` | word တစ်ခုရဲ့ အစမှာပဲ ကိုက်ညီသည် |
| `\M` | word တစ်ခုရဲ့ အဆုံးမှာပဲ ကိုက်ညီသည် |
| `\y` | word တစ်ခုရဲ့ အစ သို့မဟုတ် အဆုံးမှာပဲ ကိုက်ညီသည် |
| `\Y` | word တစ်ခုရဲ့ အစ သို့မဟုတ် အဆုံး မဟုတ်တဲ့ နေရာမှာပဲ ကိုက်ညီသည် |
| `\Z` | string ရဲ့ အဆုံးမှာပဲ ကိုက်ညီသည် (`$` နဲ့ ဘယ်လို ကွာခြားလဲအတွက် [အပိုင်း 9.7.3.5] ကို ကြည့်ပါ) |

Word ဆိုတာက အပေါ်က `[[:<:]]` နဲ့ `[[:>:]]` တွေရဲ့ သတ်မှတ်ချက်အတိုင်းပါ။ Constraint escape တွေက bracket expression တွေအတွင်းမှာ မတရားပါဘူး။

**ဇယား 9.23. Regular Expression Back References (regular expression back reference များ)**

| Escape | ဖော်ပြချက် |
| --- | --- |
| `\``m` | (`m` က သုည မဟုတ်တဲ့ digit တစ်ခု ဖြစ်တဲ့အခါ) `m`'th subexpression ဆီကို back reference |
| `\``mnn` | (`m` က သုည မဟုတ်တဲ့ digit တစ်ခု၊ `nn` က နောက်ထပ် digit တချို့ ဖြစ်ပြီး — `mnn` ရဲ့ decimal တန်ဖိုးက အခုထိ တွေ့ခဲ့တဲ့ closing capturing parentheses အရေအတွက်ထက် မများတဲ့အခါ) `mnn`'th subexpression ဆီကို back reference |

> **မှတ်ချက်:** Octal character-entry escape တွေနဲ့ back reference တွေကြားမှာ မွေးရာပါ မရှင်းလင်းမှု (ambiguity) ရှိပြီး — အပေါ်မှာ အရိပ်အမြွက် ပြထားသလို — အောက်ပါ heuristic တွေနဲ့ ဖြေရှင်းပါတယ်။ ရှေ့ဆုံး digit က သုည ဆိုရင် အမြဲတမ်း octal escape ကို ညွှန်ပြပါတယ်။ သုည မဟုတ်တဲ့ digit တစ်ခုတည်း — နောက်မှာ digit တစ်ခုခု မလိုက်တဲ့ဟာ — ကို အမြဲတမ်း back reference အဖြစ် ယူပါတယ်။ သုည နဲ့ မစတင်တဲ့ digit အများအပြား sequence တစ်ခုက — သင့်လျော်တဲ့ subexpression တစ်ခုရဲ့ နောက်မှာ လာရင် (ဆိုလိုတာက နံပါတ်က back reference အတွက် တရားဝင် range ထဲမှာ ရှိရင်) back reference အဖြစ် ယူပြီး — မဟုတ်ရင် octal အဖြစ် ယူပါတယ်။

#### 9.7.3.4. Regular Expression Metasyntax (regular expression metasyntax)

အပေါ်မှာ ဖော်ပြထားတဲ့ အဓိက syntax တွေအပြင် — အထူး ပုံစံတွေနဲ့ ရံဖန်ရံခါ သုံးရတဲ့ syntactic စွမ်းဆောင်ရည် တချို့လည်း ရနိုင်ပါတယ်။

RE တစ်ခုက အထူး *director* ရှေ့ဆက်စကားလုံး (prefix) နှစ်မျိုးထဲက တစ်ခုနဲ့ စတင်နိုင်ပါတယ်။ RE တစ်ခုက `***:` နဲ့ စတင်ရင် — ကျန် RE ကို ARE အဖြစ် ယူပါတယ်။ (ဒါက PostgreSQL မှာ ပုံမှန်အားဖြင့် သက်ရောက်မှု မရှိပါဘူး — RE တွေကို ARE တွေလို့ ယူဆလို့ပါ; ဒါပေမယ့် regex function တစ်ခုရဲ့ `flags` parameter နဲ့ ERE သို့မဟုတ် BRE mode ကို သတ်မှတ်ထားခဲ့ရင်တော့ သက်ရောက်မှု ရှိပါတယ်။) RE တစ်ခုက `***=` နဲ့ စတင်ရင် — ကျန် RE ကို literal string အဖြစ် ယူပြီး — character တွေ အားလုံးကို သာမန် character တွေလို့ သတ်မှတ်ပါတယ်။

ARE တစ်ခုက *embedded options* တွေနဲ့ စတင်နိုင်ပါတယ်: `(?``xyz``)` ဆိုတဲ့ sequence တစ်ခု (`xyz` က alphabetic character တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို ဖြစ်တဲ့အခါ) က ကျန် RE ကို သက်ရောက်တဲ့ option တွေကို သတ်မှတ်ပါတယ်။ ဒီ option တွေက အရင်က သတ်မှတ်ပြီးသား option တွေကို ကျော်လွန် သတ်မှတ်ပါတယ် — အထူးသဖြင့် regex operator တစ်ခုက ညွှန်ပြတဲ့ case-sensitivity အပြုအမူ သို့မဟုတ် regex function တစ်ခုရဲ့ `flags` parameter ကို ကျော်လွန် သတ်မှတ်နိုင်ပါတယ်။ ရနိုင်တဲ့ option letter တွေကို [ဇယား 9.24] မှာ ပြထားပါတယ်။ ဒီ option letter တွေကိုပဲ regex function တွေရဲ့ `flags` parameter တွေမှာလည်း သုံးတာကို သတိပြုပါ။

**ဇယား 9.24. ARE Embedded-Option Letters (ARE embedded-option letter များ)**

| Option | ဖော်ပြချက် |
| --- | --- |
| `b` | ကျန် RE က BRE တစ်ခု |
| `c` | case-sensitive matching (operator type ကို ကျော်လွန် သတ်မှတ်သည်) |
| `e` | ကျန် RE က ERE တစ်ခု |
| `i` | case-insensitive matching ([အပိုင်း 9.7.3.5] ကို ကြည့်ပါ) (operator type ကို ကျော်လွန် သတ်မှတ်သည်) |
| `m` | `n` အတွက် သမိုင်းဝင် synonym |
| `n` | newline-sensitive matching ([အပိုင်း 9.7.3.5] ကို ကြည့်ပါ) |
| `p` | partial newline-sensitive matching ([အပိုင်း 9.7.3.5] ကို ကြည့်ပါ) |
| `q` | ကျန် RE က literal (“quoted”) string တစ်ခု — character တွေ အားလုံး သာမန် |
| `s` | non-newline-sensitive matching (newline character တွေကို အထူး သဘောမထားဘဲ ကိုက်ညီခြင်း — ပုံမှန်) |
| `t` | tight syntax (default; အောက်မှာ ကြည့်ပါ) |
| `w` | inverse partial newline-sensitive (“weird”) matching ([အပိုင်း 9.7.3.5] ကို ကြည့်ပါ) |
| `x` | expanded syntax (အောက်မှာ ကြည့်ပါ) |

Embedded options တွေက sequence ကို အဆုံးသတ်တဲ့ `)` မှာ စတင် သက်ရောက်ပါတယ်။ သူတို့က ARE တစ်ခုရဲ့ အစမှာပဲ ပေါ်နိုင်ပါတယ် (`***:` director ရှိရင် ၎င်းရဲ့ နောက်မှာ)။

သာမန် (*tight*) RE syntax မှာ character တွေ အားလုံး အဓိပ္ပာယ် ရှိပါတယ် — အဲဒါအပြင် embedded `x` option ကို သတ်မှတ်ခြင်းဖြင့် ရနိုင်တဲ့ *expanded* syntax တစ်ခုလည်း ရှိပါတယ်။ Expanded syntax မှာ — RE ထဲက white-space character တွေကို လျစ်လျူရှုပြီး — `#` တစ်ခုနဲ့ ၎င်းနောက်က newline (သို့မဟုတ် RE ရဲ့ အဆုံး) ကြားက character တွေ အားလုံးကိုလည်း လျစ်လျူရှုပါတယ်။ ဒါက ရှုပ်ထွေးတဲ့ RE တစ်ခုကို စာပိုဒ်ခွဲပြီး comment တွေ ရေးခွင့် ပေးပါတယ်။ ဒီအခြေခံ စည်းမျဉ်းအတွက် ခြွင်းချက် သုံးခု ရှိပါတယ်:

- `\` နဲ့ ရှေ့ဆွဲထားတဲ့ white-space character သို့မဟုတ် # က ထိန်းသိမ်းခံရသည်
- bracket expression တစ်ခုအတွင်းက white space သို့မဟုတ် # က ထိန်းသိမ်းခံရသည်
- character အများအပြား ပါတဲ့ symbol တွေ — `(?:` လိုမျိုး — ထဲမှာတော့ white space နဲ့ comment တွေ မပါဝင်နိုင်ပါဘူး

ဒီကိစ္စအတွက် — white-space character တွေက blank, tab, newline နဲ့ `space` character class ထဲက character ဘာမဆို ဖြစ်ပါတယ်။

နောက်ဆုံးအနေနဲ့ — ARE တစ်ခုမှာ bracket expression တွေရဲ့ အပြင်ဘက်မှာ — `(?#``ttt``)` ဆိုတဲ့ sequence (`ttt` က `)` မပါဝင်တဲ့ ဘယ်စာသားမဆို ဖြစ်တဲ့အခါ) က comment တစ်ခု ဖြစ်ပြီး — လုံးဝ လျစ်လျူရှုပါတယ်။ ဒါလည်း character အများအပြား ပါတဲ့ symbol တွေရဲ့ — `(?:` လိုမျိုး — character တွေကြားမှာတော့ ခွင့်မပြုပါဘူး။ ဒီလို comment တွေက အသုံးဝင်တဲ့ စွမ်းဆောင်ရည်ထက် သမိုင်းဝင် အမွေအနှစ်တစ်ခုလို ပိုဖြစ်ပြီး — သူတို့ရဲ့ သုံးစွဲမှုကို deprecated (မသုံးတော့ရန်) လို့ မှတ်ယူပါတယ်; အဲဒီအစား expanded syntax ကို သုံးပါ။

ကနဦး `***=` director က user ရဲ့ input ကို RE အဖြစ် မဟုတ်ဘဲ literal string အဖြစ် သဘောထားဖို့ သတ်မှတ်ထားရင် — ဒီ metasyntax extension တွေ ဘာမှ မရနိုင်ပါဘူး။

#### 9.7.3.5. Regular Expression Matching Rules (regular expression ကိုက်ညီမှု စည်းမျဉ်းများ)

RE တစ်ခုက ပေးထားတဲ့ string တစ်ခုရဲ့ substring တစ်ခုထက်ပိုနဲ့ ကိုက်ညီနိုင်ရင် — RE က string ထဲမှာ အစောဆုံး စတင်တဲ့ substring နဲ့ ကိုက်ညီပါတယ်။ RE က အဲဒီနေရာမှာ စတင်တဲ့ substring တစ်ခုထက်ပိုနဲ့ ကိုက်ညီနိုင်ရင် — RE က *greedy* လား *non-greedy* လားပေါ် မူတည်ပြီး — ဖြစ်နိုင်သမျှ အရှည်ဆုံး match ဒါမှမဟုတ် ဖြစ်နိုင်သမျှ အတိုဆုံး match ကို ယူပါတယ်။

RE တစ်ခု greedy ဟုတ်မဟုတ်ကို အောက်ပါ စည်းမျဉ်းတွေနဲ့ ဆုံးဖြတ်ပါတယ်:

- Atom အများစုနဲ့ constraint တွေ အားလုံးမှာ greediness attribute (ပမာဏ ရွေးချယ်မှု အရည်အချင်း) မရှိပါဘူး (ဘာပဲဖြစ်ဖြစ် သူတို့က variable ပမာဏ စာသားတွေနဲ့ ကိုက်ညီလို့ မရလို့ပါ)။
- RE တစ်ခုကို parentheses တွေနဲ့ ဝန်းရံလိုက်တာက သူ့ရဲ့ greediness ကို မပြောင်းလဲပါဘူး။
- Fixed-repetition quantifier ({m} သို့မဟုတ် {m}?) ပါတဲ့ quantified atom တစ်ခုက atom ကိုယ်တိုင်ရဲ့ greediness အတိုင်းပဲ ရှိပါတယ် (greediness မရှိတာလည်း ဖြစ်နိုင်ပါတယ်)။
- တခြား သာမန် quantifier တွေ ({m,n} မှာ m နဲ့ n တူနေတာလည်း ပါအပါအဝင်) ပါတဲ့ quantified atom တစ်ခုက greedy ပါ (အရှည်ဆုံး match ကို ဦးစားပေးသည်)။
- Non-greedy quantifier တစ်ခု ({m,n}? မှာ m နဲ့ n တူနေတာလည်း ပါအပါအဝင်) ပါတဲ့ quantified atom တစ်ခုက non-greedy ပါ (အတိုဆုံး match ကို ဦးစားပေးသည်)။
- Branch တစ်ခု — ဆိုလိုတာက top-level | operator မရှိတဲ့ RE — က သူ့ထဲက greediness attribute ရှိတဲ့ ပထမဆုံး quantified atom ရဲ့ greediness အတိုင်း ရှိပါတယ်။
- | operator နဲ့ ဆက်ထားတဲ့ branch နှစ်ခု သို့မဟုတ် ထို့ထက်ပို ပါဝင်တဲ့ RE တစ်ခုက အမြဲတမ်း greedy ပါ။

အပေါ်က စည်းမျဉ်းတွေက greediness attribute တွေကို quantified atom တစ်ခုချင်းစီနဲ့ပဲ မဟုတ်ဘဲ — quantified atom တွေ ပါဝင်တဲ့ branch တွေနဲ့ RE တစ်ခုလုံးနဲ့ပါ တွဲပေးပါတယ်။ ဆိုလိုတာက — matching ကို branch သို့မဟုတ် RE တစ်ခုလုံးက ဖြစ်နိုင်သမျှ အရှည်ဆုံး သို့မဟုတ် အတိုဆုံး substring ကို တစ်ခုလုံးအနေနဲ့ ကိုက်ညီမယ့်ပုံစံနဲ့ လုပ်ဆောင်တာပါ။ Match တစ်ခုလုံးရဲ့ အလျားကို ဆုံးဖြတ်ပြီးတာနဲ့ — ၎င်းထဲက ဘယ်အပိုင်းက ဘယ် subexpression နဲ့ ကိုက်ညီလဲဆိုတာကို အဲဒီ subexpression ရဲ့ greediness attribute အပေါ် မူတည်ပြီး ဆုံးဖြတ်ပြီး — RE ထဲမှာ စောစော စတင်တဲ့ subexpression တွေက နောက်မှ စတင်တာတွေထက် ဦးစားပေး ခံရပါတယ်။

ဒါက ဘာကို ဆိုလိုလဲ ဆိုတဲ့ ဥပမာ:

```sql
SELECT SUBSTRING('XY1234Z', 'Y*([0-9]{1,3})');
Result: 123
SELECT SUBSTRING('XY1234Z', 'Y*?([0-9]{1,3})');
Result: 1
```

ပထမ ကိစ္စမှာ — `Y*` က greedy ဖြစ်လို့ RE တစ်ခုလုံး အနေနဲ့လည်း greedy ပါ။ ၎င်းက `Y` မှာ စတင် ကိုက်ညီနိုင်ပြီး — အဲဒီမှာ စတင်တဲ့ ဖြစ်နိုင်သမျှ အရှည်ဆုံး string — ဆိုလိုတာက `Y123` — နဲ့ ကိုက်ညီပါတယ်။ Output က အဲဒီထဲက parenthesized အပိုင်း — `123` — ပါ။ ဒုတိယ ကိစ္စမှာ — `Y*?` က non-greedy ဖြစ်လို့ RE တစ်ခုလုံး အနေနဲ့လည်း non-greedy ပါ။ ၎င်းက `Y` မှာ စတင် ကိုက်ညီနိုင်ပြီး — အဲဒီမှာ စတင်တဲ့ ဖြစ်နိုင်သမျှ အတိုဆုံး string — `Y1` — နဲ့ ကိုက်ညီပါတယ်။ `[0-9]{1,3}` ဆိုတဲ့ subexpression က greedy ဖြစ်ပေမယ့် — match တစ်ခုလုံးရဲ့ အလျားနဲ့ ပတ်သက်တဲ့ ဆုံးဖြတ်ချက်ကို မပြောင်းလဲနိုင်လို့ — `1` တစ်ခုတည်းနဲ့ပဲ ကိုက်ညီဖို့ အတင်းဖြစ်နေပါတယ်။

အတိုချုပ်ပြောရရင် — RE တစ်ခုထဲမှာ greedy နဲ့ non-greedy subexpression တွေ ရောပါနေရင် — RE တစ်ခုလုံးကို သတ်မှတ်ထားတဲ့ attribute ပေါ် မူတည်ပြီး — total match length က ဖြစ်နိုင်သမျှ အရှည်ဆုံး ဒါမှမဟုတ် အတိုဆုံး ဖြစ်ပါတယ်။ Subexpression တွေကို သတ်မှတ်ထားတဲ့ attribute တွေက အဲဒီ match ထဲက ဘယ်လောက်ကို တစ်ခုနဲ့ တစ်ခု ဆက်စပ်ပြီး “စားသုံး” ခွင့် ရှိလဲဆိုတာကိုပဲ သက်ရောက်ပါတယ်။

`{1,1}` နဲ့ `{1,1}?` quantifier တွေကို သုံးပြီး subexpression တစ်ခု သို့မဟုတ် RE တစ်ခုလုံးအပေါ်မှာ greediness သို့မဟုတ် non-greediness ကို အသီးသီး အတင်း သတ်မှတ်လို့ ရပါတယ်။ RE တစ်ခုလုံးမှာ သူ့ရဲ့ အစိတ်အပိုင်းတွေကနေ ကောက်ချက်ချလို့ ရတာနဲ့ မတူတဲ့ greediness attribute တစ်ခု လိုအပ်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ ဥပမာတစ်ခုအနေနဲ့ — digit တချို့ ပါဝင်တဲ့ string တစ်ခုကို digit တွေနဲ့ သူတို့ရဲ့ ရှေ့နောက်က အပိုင်းတွေအဖြစ် ခွဲခြားဖို့ ကြိုးစားနေတယ် ဆိုပါစို့။ ဒီလိုမျိုး ကြိုးစားကြည့်နိုင်ပါတယ်:

```sql
SELECT regexp_match('abc01234xyz', '(.*)(\d+)(.*)');
Result: {abc0123,4,xyz}
```

ဒါက အလုပ်မဖြစ်ပါဘူး: ပထမ `.*` က greedy ဖြစ်လို့ သူတတ်နိုင်သလောက် အကုန် “စားသုံး” လိုက်ပြီး — `\d+` ကို နောက်ဆုံး ဖြစ်နိုင်တဲ့ နေရာ — နောက်ဆုံး digit — မှာပဲ ကိုက်ညီဖို့ ကျန်ခဲ့ပါတယ်။ Non-greedy ဖြစ်အောင် လုပ်ပြီး ပြင်ကြည့်နိုင်ပါတယ်:

```sql
SELECT regexp_match('abc01234xyz', '(.*?)(\d+)(.*)');
Result: {abc,0,""}
```

ဒါလည်း အလုပ် မဖြစ်ပါဘူး — အကြောင်းကတော့ အခု RE တစ်ခုလုံးက non-greedy ဖြစ်နေလို့ match တစ်ခုလုံးကို ဖြစ်နိုင်သမျှ မြန်မြန် အဆုံးသတ်လိုက်လို့ပါ။ RE တစ်ခုလုံးကို greedy ဖြစ်အောင် အတင်း လုပ်ပြီး လိုချင်တာကို ရနိုင်ပါတယ်:

```sql
SELECT regexp_match('abc01234xyz', '(?:(.*?)(\d+)(.*)){1,1}');
Result: {abc,01234,xyz}
```

RE ရဲ့ overall greediness ကို သူ့ရဲ့ အစိတ်အပိုင်း တွေရဲ့ greediness နဲ့ သီးခြားစီ ထိန်းချုပ်နိုင်တာက — variable-length pattern တွေကို ကိုင်တွယ်ရာမှာ များစွာ ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေပါတယ်။

ဘယ်ဟာက ပိုရှည်တဲ့ သို့မဟုတ် ပိုတိုတဲ့ match လဲ ဆုံးဖြတ်တဲ့အခါ — match length တွေကို collating element တွေနဲ့ မဟုတ်ဘဲ — character တွေနဲ့ တိုင်းတာပါတယ်။ Empty string တစ်ခုက match လုံးဝ မရှိတာထက် ပိုရှည်တယ်လို့ သတ်မှတ်ပါတယ်။ ဥပမာ: `bb*` က `abbbc` ရဲ့ အလယ် character သုံးခုနဲ့ ကိုက်ညီပြီး — `(week|wee)(night|knights)` က `weeknights` ရဲ့ character ဆယ်ခုလုံးနဲ့ ကိုက်ညီပါတယ်; `(.*).*` ကို `abc` နဲ့ ယှဉ်ကြည့်ရင် parenthesized subexpression က character သုံးခုလုံးနဲ့ ကိုက်ညီပြီး — `(a*)*` ကို `bc` နဲ့ ယှဉ်ကြည့်ရင် RE တစ်ခုလုံးရော parenthesized subexpression ပါ empty string တစ်ခုနဲ့ ကိုက်ညီပါတယ်။

Case-independent matching ကို သတ်မှတ်ထားရင် — alphabet ထဲက case ကွဲပြားမှုတွေ အားလုံး ပျောက်သွားသလိုမျိုး သက်ရောက်မှု ရှိပါတယ်။ Case မျိုးစုံနဲ့ ရှိနေတဲ့ alphabetic character တစ်ခုက bracket expression ရဲ့ အပြင်မှာ သာမန် character တစ်ခုအနေနဲ့ ပေါ်လာရင် — case နှစ်မျိုးလုံး ပါဝင်တဲ့ bracket expression တစ်ခုအဖြစ် ထိရောက်စွာ ပြောင်းလဲပါတယ် — ဥပမာ `x` က `[xX]` ဖြစ်သွားပါတယ်။ ၎င်းက bracket expression တစ်ခုရဲ့ အတွင်းမှာ ပေါ်လာရင် — သူ့ရဲ့ case counterpart တွေ အားလုံးကို bracket expression ထဲကို ထည့်ပေးပါတယ် — ဥပမာ `[x]` က `[xX]` ဖြစ်ပြီး `[^x]` က `[^xX]` ဖြစ်ပါတယ်။

Newline-sensitive matching ကို သတ်မှတ်ထားရင် — `.` နဲ့ `^` သုံးထားတဲ့ bracket expression တွေက newline character နဲ့ ဘယ်တော့မှ ကိုက်ညီမှာ မဟုတ်ပါဘူး (RE ထဲမှာ newline တစ်ခုကို ရှင်းရှင်းလင်းလင်း ထည့်မထားရင် match တွေ စာကြောင်း ဖြတ်ကျော်မှာ မဟုတ်ပါဘူး) — ပြီးတော့ `^` နဲ့ `$` တို့က string ရဲ့ အစနဲ့ အဆုံးမှာ ကိုက်ညီတာအပြင် — newline တစ်ခုရဲ့ နောက်မှာနဲ့ ရှေ့မှာ empty string တွေနဲ့လည်း အသီးသီး ကိုက်ညီပါတယ်။ ဒါပေမယ့် ARE escape တွေဖြစ်တဲ့ `\A` နဲ့ `\Z` ကတော့ string ရဲ့ အစ သို့မဟုတ် အဆုံးမှာပဲ ဆက်ပြီး ကိုက်ညီပါတယ်။ ဒါ့အပြင် — character class shorthand တွေဖြစ်တဲ့ `\D` နဲ့ `\W` တို့က ဒီ mode မသက်ဆိုင်ဘဲ newline တစ်ခုနဲ့ ကိုက်ညီပါလိမ့်မယ်။ (PostgreSQL 14 မတိုင်ခင် — သူတို့က newline-sensitive mode မှာ newline တွေနဲ့ မကိုက်ညီခဲ့ပါဘူး။ အဟောင်း အပြုအမူ ရဖို့ `[^[:digit:]]` သို့မဟုတ် `[^[:word:]]` လို့ ရေးပါ။)

Partial newline-sensitive matching ကို သတ်မှတ်ထားရင် — ဒါက newline-sensitive matching မှာလိုပဲ `.` နဲ့ bracket expression တွေကို သက်ရောက်ပေမယ့် — `^` နဲ့ `$` ကိုတော့ မသက်ရောက်ပါဘူး။

Inverse partial newline-sensitive matching ကို သတ်မှတ်ထားရင် — ဒါက newline-sensitive matching မှာလိုပဲ `^` နဲ့ `$` ကို သက်ရောက်ပေမယ့် — `.` နဲ့ bracket expression တွေကိုတော့ မသက်ရောက်ပါဘူး။ ဒါက သိပ် အသုံးမဝင်ပေမယ့် symmetry (အချိုးညီမှု) အတွက် ထည့်ပေးထားတာပါ။

#### 9.7.3.6. Limits and Compatibility (ကန့်သတ်ချက်များနှင့် လိုက်ဖက်ညီမှု)

ဒီ implementation မှာ RE တွေရဲ့ အလျားအတွက် သီးခြား ကန့်သတ်ချက် တစ်ခုခု သတ်မှတ်မထားပါဘူး။ ဒါပေမယ့် — အလွန် portable ဖြစ်ဖို့ ရည်ရွယ်ထားတဲ့ program တွေက 256 bytes ထက် ပိုရှည်တဲ့ RE တွေကို မသုံးသင့်ပါဘူး — POSIX-compliant implementation တစ်ခုက အဲဒီလို RE တွေကို လက်ခံဖို့ ငြင်းပယ်နိုင်လို့ပါ။

AREs တွေရဲ့ POSIX EREs တွေနဲ့ တကယ်တော့ မကိုက်ညီတဲ့ တစ်ခုတည်းသော feature က — `\` က bracket expression တွေအတွင်းမှာ သူ့ရဲ့ အထူး အဓိပ္ပာယ် မဆုံးရှုံးတာပါ။ တခြား ARE feature တွေ အားလုံးက POSIX EREs တွေမှာ မတရားတဲ့ သို့မဟုတ် သတ်မှတ်မထားတဲ့/မသတ်မှတ်ထားတဲ့ သက်ရောက်မှု ရှိတဲ့ syntax တွေကို သုံးပါတယ်; director တွေရဲ့ `***` syntax ကလည်း BREs ရော EREs ရော အတွက် POSIX syntax ရဲ့ အပြင်ဘက်မှာ ရှိပါတယ်။

ARE extension တွေ အများအပြားကို Perl ကနေ ငှားယူထားပေမယ့် — တချို့ကို သန့်ရှင်းအောင် ပြောင်းလဲထားပြီး — Perl extension တချို့ကတော့ မပါဝင်ပါဘူး။ သတိထားစရာ မကိုက်ညီမှုတွေထဲမှာ `\b`, `\B`, နောက်ဆုံး newline တစ်ခုအတွက် အထူး ကိုင်တွယ်မှု မရှိခြင်း, newline-sensitive matching ရဲ့ သက်ရောက်မှု စာရင်းထဲ complemented bracket expression တွေ ထပ်ထည့်ခံရခြင်း, lookahead/lookbehind constraint တွေထဲမှာ parentheses နဲ့ back reference တွေအပေါ် ကန့်သတ်ချက်တွေ, နဲ့ (first-match မဟုတ်ဘဲ) longest/shortest-match ကိုက်ညီမှု semantics တို့ ပါဝင်ပါတယ်။

#### 9.7.3.7. Basic Regular Expressions (basic regular expression များ (BRE))

BRE တွေက ERE တွေနဲ့ ကဏ္ဍ အများအပြားမှာ ကွဲပြားပါတယ်။ BRE တွေမှာ — `|`, `+` နဲ့ `?` တို့က သာမန် character တွေ ဖြစ်ပြီး — သူတို့ရဲ့ လုပ်ဆောင်ချက်အတွက် ညီမျှတဲ့ဟာ မရှိပါဘူး။ Bounds အတွက် delimiter တွေက `\{` နဲ့ `\}` ဖြစ်ပြီး — `{` နဲ့ `}` တစ်ခုတည်းကတော့ သာမန် character တွေပါ။ Nested subexpression တွေအတွက် parentheses တွေက `\(` နဲ့ `\)` ဖြစ်ပြီး — `(` နဲ့ `)` တစ်ခုတည်းကတော့ သာမန် character တွေပါ။ `^` က RE ရဲ့ အစ သို့မဟုတ် parenthesized subexpression တစ်ခုရဲ့ အစမှာကလွဲလို့ သာမန် character တစ်ခုပါ — `$` ကလည်း RE ရဲ့ အဆုံး သို့မဟုတ် parenthesized subexpression တစ်ခုရဲ့ အဆုံးမှာကလွဲလို့ သာမန် character တစ်ခုပါ — `*` ကတော့ RE ရဲ့ အစ သို့မဟုတ် parenthesized subexpression တစ်ခုရဲ့ အစမှာ (ဖြစ်နိုင်ရင် ရှေ့က `^` တစ်ခုရဲ့ နောက်မှာ) ပေါ်လာရင် သာမန် character တစ်ခုပါ။ နောက်ဆုံးအနေနဲ့ — digit တစ်လုံးတည်း back reference တွေ ရနိုင်ပြီး — `\<` နဲ့ `\>` တို့က `[[:<:]]` နဲ့ `[[:>:]]` တို့အတွက် synonym တွေပါ; BRE တွေမှာ တခြား escape တွေ မရနိုင်ပါဘူး။

#### 9.7.3.8. Differences from SQL Standard and XQuery (SQL standard နှင့် XQuery တို့နှင့် ကွဲပြားချက်များ)

SQL:2008 ကစပြီး — SQL standard မှာ XQuery regular expression standard အရ pattern matching ကို လုပ်ဆောင်ပေးတဲ့ regular expression operator နဲ့ function တွေ ပါဝင်ပါတယ်:

- LIKE_REGEX
- OCCURRENCES_REGEX
- POSITION_REGEX
- SUBSTRING_REGEX
- TRANSLATE_REGEX

PostgreSQL က လောလောဆယ် ဒီ operator နဲ့ function တွေကို အကောင်အထည် မဖော်ရသေးပါဘူး။ ကိစ္စတစ်ခုချင်းစီမှာ — [ဇယား 9.25] မှာ ပြထားသလို — အနီးစပ်ဆုံး ညီမျှတဲ့ လုပ်ဆောင်ချက်ကို ရနိုင်ပါတယ်။ (ဒီဇယားထဲမှာ နှစ်ဖက်စလုံးက optional clause အမျိုးမျိုးကို ချန်လိုက်ပါတယ်။)

**ဇယား 9.25. Regular Expression Functions Equivalencies (regular expression function တို့၏ ညီမျှမှုများ)**

| SQL standard | PostgreSQL |
| --- | --- |
| `string LIKE_REGEX pattern` | `regexp_like(string, pattern)` or `string ~ pattern` |
| `OCCURRENCES_REGEX(pattern IN string)` | `regexp_count(string, pattern)` |
| `POSITION_REGEX(pattern IN string)` | `regexp_instr(string, pattern)` |
| `SUBSTRING_REGEX(pattern IN string)` | `regexp_substr(string, pattern)` |
| `TRANSLATE_REGEX(pattern IN string WITH replacement)` | `regexp_replace(string, pattern, replacement)` |

PostgreSQL က ပေးတဲ့ ပုံစံနဲ့ ဆင်တူတဲ့ regular expression function တွေက တခြား SQL implementation တွေ အများအပြားမှာလည်း ရနိုင်ပြီး — SQL-standard function တွေကတော့ အဲလောက် ကျယ်ကျယ်ပြန့်ပြန့် အကောင်အထည် မဖော်ထားပါဘူး။ Regular expression syntax ရဲ့ အသေးစိတ် တချို့က implementation တစ်ခုနဲ့ တစ်ခု ကွဲပြားနိုင်ခြေ များပါတယ်။

SQL-standard operator နဲ့ function တွေက XQuery regular expression တွေကို သုံးပါတယ် — အဲဒါတွေက အပေါ်မှာ ဖော်ပြထားတဲ့ ARE syntax နဲ့ အတော်လေး နီးစပ်ပါတယ်။ လက်ရှိ POSIX-based regular-expression feature နဲ့ XQuery regular expression တွေကြားက သတိထားစရာ ကွဲပြားချက်တွေထဲမှာ အောက်ပါတို့ ပါဝင်ပါတယ်:

- XQuery character class subtraction ကို မထောက်ပံ့ပါဘူး။ ဒီ feature ရဲ့ ဥပမာက — English consonant တွေကိုပဲ ကိုက်ညီစေဖို့ အောက်ပါအတိုင်း သုံးတာပါ: [a-z-[aeiou]]။
- XQuery character class shorthand တွေဖြစ်တဲ့ \c, \C, \i နဲ့ \I တို့ကို မထောက်ပံ့ပါဘူး။
- \p{UnicodeProperty} သို့မဟုတ် ၎င်းရဲ့ ပြောင်းပြန် \P{UnicodeProperty} ကို သုံးတဲ့ XQuery character class element တွေကို မထောက်ပံ့ပါဘူး။
- POSIX က \w (ဇယား 9.21 ကို ကြည့်ပါ) လို character class တွေကို — လက်ရှိ locale အရ — အနက်ဖွင့်ပါတယ် (operator သို့မဟုတ် function တစ်ခုမှာ `COLLATE` clause တစ်ခု တွဲပြီး ဒါကို ထိန်းချုပ်လို့ ရပါတယ်)။ XQuery ကတော့ ဒီ class တွေကို Unicode character property တွေကို ရည်ညွှန်းပြီး သတ်မှတ်လို့ — Unicode စည်းမျဉ်းတွေကို လိုက်နာတဲ့ locale တစ်ခုနဲ့မှသာ ညီမျှတဲ့ အပြုအမူကို ရပါတယ်။
- SQL standard က (XQuery ကိုယ်တိုင် မဟုတ်ဘဲ) POSIX ထက် “newline” ရဲ့ မျိုးကွဲတွေ ပိုများများအတွက် ဖြည့်ဆည်းဖို့ ကြိုးစားပါတယ်။ အပေါ်မှာ ဖော်ပြထားတဲ့ newline-sensitive matching option တွေက ASCII NL (\n) ကိုပဲ newline အဖြစ် သတ်မှတ်ပေမယ့် — SQL အရဆိုရင် CR (\r), CRLF (\r\n) (Windows-style newline) နဲ့ LINE SEPARATOR (U+2028) လို Unicode character တွေကိုပါ newline တွေအနေနဲ့ သဘောထားစေချင်ပါတယ်။ အထူးသဖြင့် — SQL အရ . နဲ့ \s တို့က \r\n ကို character နှစ်ခု အနေနဲ့ မဟုတ်ဘဲ — character တစ်ခုအနေနဲ့ ရေတွက်သင့်ပါတယ်။
- ဇယား 9.20 မှာ ဖော်ပြထားတဲ့ character-entry escape တွေထဲက — XQuery က \n, \r နဲ့ \t တို့ကိုပဲ ထောက်ပံ့ပါတယ်။
- Bracket expression တွေအတွင်းမှာ character class တွေအတွက် [:name:] syntax ကို XQuery က မထောက်ပံ့ပါဘူး။
- XQuery မှာ lookahead သို့မဟုတ် lookbehind constraint တွေ မရှိသလို — ဇယား 9.22 မှာ ဖော်ပြထားတဲ့ constraint escape တွေလည်း မရှိပါဘူး။
- [အပိုင်း 9.7.3.4] မှာ ဖော်ပြထားတဲ့ metasyntax ပုံစံတွေက XQuery မှာ မရှိပါဘူး။
- XQuery က သတ်မှတ်ထားတဲ့ regular expression flag letter တွေက POSIX ရဲ့ option letter တွေ (ဇယား 9.24) နဲ့ ဆက်စပ်ပေမယ့် — အတိအကျတော့ မတူပါဘူး။ i နဲ့ q option တွေက အတူတူပဲ ပြုမူပေမယ့် — ကျန်တာတွေကတော့ မတူပါဘူး:
  - XQuery ရဲ့ s (dot ကို newline နဲ့ ကိုက်ညီခွင့်ပြုခြင်း) နဲ့ m (^ နဲ့ $ တွေကို newline တွေမှာ ကိုက်ညီခွင့်ပြုခြင်း) flag တွေက POSIX ရဲ့ n, p နဲ့ w flag တွေနဲ့ တူညီတဲ့ အပြုအမူတွေကို ရယူပေးနိုင်ပေမယ့် — POSIX ရဲ့ s နဲ့ m flag တွေရဲ့ အပြုအမူနဲ့တော့ မကိုက်ညီပါဘူး။ အထူးသဖြင့် — dot-matches-newline က POSIX မှာ default အပြုအမူ ဖြစ်ပေမယ့် XQuery မှာ မဟုတ်တာကို သတိပြုပါ။
  - XQuery ရဲ့ x (pattern ထဲက whitespace ကို လျစ်လျူရှုခြင်း) flag က POSIX ရဲ့ expanded-mode flag နဲ့ သိသိသာသာ ကွဲပြားပါတယ်။ POSIX ရဲ့ x flag က pattern ထဲမှာ # ကို သုံးပြီး comment တစ်ခု စတင်ခွင့်ပြုပြီး — POSIX က backslash နောက်က whitespace character တစ်ခုကိုတော့ လျစ်လျူရှုမှာ မဟုတ်ပါဘူး။
