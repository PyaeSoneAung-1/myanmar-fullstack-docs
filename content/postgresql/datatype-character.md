---
title: "Character Types (စာလုံး type များ)"
description: "PostgreSQL ရဲ့ character type များ — character varying/varchar, char, text; သိုလှောင်မှုနှင့် နှိုင်းယှဉ်မှု အပြုအမူ"
order: 50
source: "https://www.postgresql.org/docs/current/datatype-character.html"
status: translated
updated: 2026-09-03
---

## 8.3. Character Types (စာလုံး type များ)

**ဇယား 8.4. Character Types (စာလုံး type များ)**

| နာမည် | ဖော်ပြချက် |
| --- | --- |
| `character varying(n)`, `varchar(n)` | အလျား ကန့်သတ်ချက် ပါရှိသော variable-length (အလျား ပြောင်းလဲနိုင်သော) |
| `character(n)`, `char(n)`, `bpchar(n)` | fixed-length (ပုံသေ အလျား) ဖြစ်ပြီး space (နေရာလပ်) တို့ဖြင့် ဖြည့်ပေးသည် (blank-padded) |
| `bpchar` | အလျား ကန့်သတ်ချက် မရှိသော variable-length; trailing space (နောက်ဆုံး နေရာလပ်) များ ဖယ်ရှားပေးသည် (blank-trimmed) |
| `text` | အလျား ကန့်သတ်ချက် မရှိသော variable-length |

[ဇယား 8.4](/docs/postgresql/datatype-character) က PostgreSQL မှာ ရနိုင်တဲ့ general-purpose (ယေဘုယျ ရည်ရွယ်ချက်) character type တွေကို ပြပါတယ်။

SQL က character type ပင်မ (primary) နှစ်မျိုး သတ်မှတ်ပါတယ်: `character varying(n)` နဲ့ `character(n)` — ဒီမှာ `n` က positive integer (အပေါင်း ကိန်းပြည့်) ဖြစ်ပါတယ်။ Type နှစ်ခုလုံးက `n` characters (bytes မဟုတ်) အထိ အလျားရှိတဲ့ string တွေကို သိမ်းဆည်းနိုင်ပါတယ်။ ဒီ type တွေရဲ့ column တစ်ခုထဲကို ပိုရှည်တဲ့ string တစ်ခု သိမ်းဖို့ ကြိုးစားရင် error ဖြစ်ပါတယ် — ပိုနေတဲ့ စာလုံးတွေ အားလုံးက space တွေ ဖြစ်နေရင်တော့ ခြွင်းချက် ဖြစ်ပြီး — အဲဒီအခါမှာ string ကို အများဆုံး အလျားအထိ ဖြတ်တောက် (truncate) လုပ်လိုက်ပါတယ်။ (ဒီထူးဆန်းတဲ့ ခြွင်းချက်ကို SQL standard က လိုအပ်လို့ပါ။) ဒါပေမယ့် — value တစ်ခုကို `character varying(n)` သို့မဟုတ် `character(n)` အဖြစ် explicit နဲ့ cast လုပ်ရင် — အလျား ပိုနေတဲ့ value ကို error မတက်စေဘဲ `n` characters အထိ ဖြတ်တောက်ပါလိမ့်မယ်။ (ဒါလည်း SQL standard က လိုအပ်တာပါပဲ။) သိမ်းမယ့် string က သတ်မှတ်ထားတဲ့ အလျားထက် တိုနေရင် — `character` type ရဲ့ value တွေကို space တွေနဲ့ ဖြည့်ပေးပြီး (space-padded) — `character varying` type ရဲ့ value တွေကတော့ ပိုတိုတဲ့ string ကိုပဲ ရိုးရိုး သိမ်းပါတယ်။

ဒါ့အပြင် PostgreSQL က `text` type ကိုပါ ထောက်ပံ့ပါတယ် — ဒါက ဘယ်အလျား မဆို string တွေကို သိမ်းဆည်းပေးပါတယ်။ `text` type က SQL standard ထဲမှာ မပါဝင်ပေမယ့် — တခြား SQL database management system တွေ အများအပြားမှာလည်း ရှိပါတယ်။ `text` က PostgreSQL ရဲ့ ဇာတိ (native) string data type ဖြစ်ပါတယ် — ဆိုလိုတာက string တွေပေါ်မှာ အလုပ်လုပ်တဲ့ built-in function တွေ အများစုကို `character varying` မဟုတ်ဘဲ `text` ကို လက်ခံရန်/ပြန်ပေးရန် အနေနဲ့ ကြေညာ (declare) ထားပါတယ်။ ရည်ရွယ်ချက် အများစုအတွက်တော့ — `character varying` က `text` ပေါ်မှာ သတ်မှတ်ထားတဲ့ [domain](/docs/postgresql/domains) တစ်ခုလိုပဲ ပြုမူပါတယ်။

`varchar` ဆိုတဲ့ type name က `character varying` ရဲ့ alias (အမည်တစ်မျိုး) ဖြစ်ပြီး — `bpchar` (length specifier ပါရှိသော) နဲ့ `char` တို့ကတော့ `character` ရဲ့ aliases တွေ ဖြစ်ပါတယ်။ `varchar` နဲ့ `char` aliases တွေကို SQL standard မှာ သတ်မှတ်ထားပြီး — `bpchar` ကတော့ PostgreSQL extension (PostgreSQL မှာပဲ ပါတဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခုပါ။

အလျား `n` ကို သတ်မှတ်ထားရင် — ၎င်းက သုညထက် ကြီးရပြီး 10,485,760 ထက် မကျော်ရပါဘူး။ `character varying` (သို့မဟုတ် `varchar`) ကို length specifier မပါဘဲ သုံးရင် — type က ဘယ်အလျား မဆို string တွေကို လက်ခံပါတယ်။ `bpchar` မှာ length specifier မရှိရင်လည်း ဘယ်အလျား မဆို string တွေကို လက်ခံပါတယ် — ဒါပေမယ့် trailing spaces (string အဆုံးမှ နေရာလပ်များ) ကို အဓိပ္ပာယ် အရေးမပါသော (semantically insignificant) အဖြစ် သဘောထားပါတယ်။ `character` (သို့မဟုတ် `char`) မှာ specifier မရှိရင် — `character(1)` နဲ့ ညီမျှပါတယ်။

`character` type ရဲ့ value တွေကို — သတ်မှတ်ထားတဲ့ အကျယ် `n` အထိ — space တွေနဲ့ ရုပ်ပိုင်း (physically) ဖြည့်ပြီး — အဲဒီပုံစံအတိုင်း သိမ်းကာ ပြသပါတယ်။ ဒါပေမယ့် — `character` type တန်ဖိုး နှစ်ခုကို နှိုင်းယှဉ်တဲ့အခါ trailing spaces တွေကို အဓိပ္ပာယ် အရေးမပါသော အဖြစ် သဘောထားပြီး လျစ်လျူရှုပါတယ်။ White space (နေရာလပ်) ကို အဓိပ္ပာယ် ရှိသည်ဟု ယူဆတဲ့ collation (စာလုံး စီစဉ်မှု စည်းမျဉ်း) တွေမှာ — ဒီအပြုအမူက မမျှော်လင့်တဲ့ ရလဒ်တွေ ဖြစ်စေနိုင်ပါတယ်; ဥပမာ — `C` locale က space ကို newline (စာကြောင်းသစ်) ထက် ကြီးသည်ဟု ယူဆမယ်ဆိုရင်တောင် — `SELECT 'a '::CHAR(2) collate "C" < E'a\n'::CHAR(2)` က true ပြန်ပေးပါတယ်။ `character` value တစ်ခုကို တခြား string type တစ်ခုအဖြစ် ပြောင်းတဲ့အခါ — trailing spaces တွေကို ဖယ်ရှားပါတယ်။ `character varying` နဲ့ `text` value တွေမှာတော့ — pattern matching (`LIKE` နဲ့ regular expressions) သုံးတဲ့အခါ အပါအဝင် — trailing spaces တွေက အဓိပ္ပာယ် ရှိတယ်ဆိုတာ သတိပြုပါ။

ဒီ data type တွေထဲမှာ သိမ်းဆည်းလို့ ရတဲ့ character တွေကို — database ဖန်တီးတဲ့အခါ ရွေးချယ်လိုက်တဲ့ — database character set (database ၏ စာလုံး အစုအဝေး) က သတ်မှတ်ပါတယ်။ Character set ဘယ်လိုပဲ ဖြစ်ဖြစ် — code zero (တခါတရံ NUL လို့ ခေါ်တဲ့) character ကိုတော့ သိမ်းဆည်းလို့ မရပါဘူး။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 23.3](https://www.postgresql.org/docs/current/multibyte.html) ကို ကြည့်ပါ။

တိုတဲ့ string (126 bytes အထိ) တစ်ခုအတွက် သိုလှောင်မှု လိုအပ်ချက်က — actual string အပေါ် 1 byte ထပ်ပေါင်းရပြီး — `character` ဆိုရင် space padding ပါ ပါဝင်ပါတယ်။ ပိုရှည်တဲ့ string တွေမှာတော့ overhead က 1 အစား 4 bytes ဖြစ်ပါတယ်။ ရှည်လျားတဲ့ string တွေကို system က အလိုအလျောက် compress (ချုံ့) လုပ်ပေးလို့ — disk ပေါ်မှာ ရုပ်ပိုင်း လိုအပ်ချက်က ပိုနည်းနိုင်ပါတယ်။ အလွန် ရှည်လျားတဲ့ value တွေကိုလည်း — ပိုတိုတဲ့ column value တွေဆီ မြန်မြန် ဝင်ရောက်နိုင်မှုကို အနှောင့်အယှက် မဖြစ်စေဖို့ — background tables တွေမှာ သိမ်းထားပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — သိမ်းဆည်းလို့ ရနိုင်တဲ့ အရှည်ဆုံး character string က 1 GB ဝန်းကျင် ဖြစ်ပါတယ်။ (Data type declaration ထဲမှာ `n` အတွက် ခွင့်ပြုထားတဲ့ အများဆုံး တန်ဖိုးက အဲဒါထက် ငယ်ပါတယ်။ ဒါကို ပြောင်းလဲဖို့ အသုံးမဝင်ပါဘူး — multibyte character encoding (စာလုံး ကုဒ်ပြောင်း စနစ်) တွေနဲ့ဆိုရင် character အရေအတွက်နဲ့ byte အရေအတွက်က အတော်ကို ကွဲပြားနိုင်လို့ပါ။ တိကျတဲ့ အပေါ်ဆုံး ကန့်သတ်ချက် မရှိဘဲ ရှည်လျားတဲ့ string တွေ သိမ်းချင်ရင် — ကိုယ်ပိုင် ကန့်သတ်ချက် တစ်ခုခု လုပ်ထားမယ့်အစား — length specifier မပါတဲ့ `text` သို့မဟုတ် `character varying` ကို သုံးပါ။)

> **အကြံပြုချက်:** ဒီ type သုံးမျိုးကြားမှာ performance (စွမ်းဆောင်ရည်) ကွာခြားမှု မရှိပါဘူး — blank-padded type ကို သုံးရင် သိမ်းဆည်းမှု နေရာ ပိုများတာနဲ့ — length-constrained column တစ်ခုထဲကို သိမ်းတဲ့အခါ အလျားကို စစ်ဆေးဖို့ CPU cycles နည်းနည်း ပိုကုန်တာကလွဲလို့ပါ။ `character(n)` က တခြား database system တချို့မှာ performance အားသာချက် ရှိနိုင်ပေမယ့် — PostgreSQL မှာတော့ အဲဒီလို အားသာချက် မရှိပါဘူး; တကယ်တော့ `character(n)` က ထပ်ဆောင်း သိုလှောင်မှု စရိတ် ရှိလို့ — သုံးမျိုးထဲမှာ များသောအားဖြင့် အနှေးဆုံး ဖြစ်ပါတယ်။ အခြေအနေ အများစုမှာ `text` သို့မဟုတ် `character varying` ကို အသုံးပြုသင့်ပါတယ်။

String literals တွေရဲ့ syntax (ရေးသားပုံ) အကြောင်း အချက်အလက်အတွက် [အပိုင်း 4.1.2.1](/docs/postgresql/sql-syntax-lexical) ကို ရည်ညွှန်းပြီး — ရနိုင်တဲ့ operator နဲ့ function တွေရဲ့ အချက်အလက်အတွက် [အခန်း 9](https://www.postgresql.org/docs/current/functions.html) ကို ကြည့်ပါ။

**ဥပမာ 8.1. Using the Character Types (စာလုံး type များ အသုံးပြုခြင်း)**

```sql
CREATE TABLE test1 (a character(4));
INSERT INTO test1 VALUES ('ok');
SELECT a, char_length(a) FROM test1; -- (1)

  a   | char_length
------+-------------
 ok   |           2

CREATE TABLE test2 (b varchar(5));
INSERT INTO test2 VALUES ('ok');
INSERT INTO test2 VALUES ('good      ');
INSERT INTO test2 VALUES ('too long');
ERROR:  value too long for type character varying(5)
INSERT INTO test2 VALUES ('too long'::varchar(5)); -- explicit truncation
SELECT b, char_length(b) FROM test2;

   b   | char_length
-------+-------------
 ok    |           2
 good  |           5
 too l |           5
```

| (1) | char_length function အကြောင်းကို အပိုင်း 9.4 မှာ ဆွေးနွေးထားပါတယ်။ |
| --- | --- |

PostgreSQL မှာ တခြား fixed-length character type နှစ်ခု ထပ်ရှိပါသေးတယ် — [ဇယား 8.5](/docs/postgresql/datatype-character) မှာ ပြထားပါတယ်။ ဒါတွေက ယေဘုယျ သုံးစွဲမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်ဘဲ — internal system catalogs (အတွင်းပိုင်း စနစ် ကက်တလောက်များ) ထဲမှာပဲ သုံးဖို့ ဖြစ်ပါတယ်။ `name` type ကို identifiers (နာမည်များ) သိမ်းဆည်းဖို့ သုံးပါတယ်။ ၎င်းရဲ့ အလျားက လောလောဆယ် 64 bytes (အသုံးပြုလို့ ရတဲ့ စာလုံး 63 လုံး အပေါင်း terminator) အဖြစ် သတ်မှတ်ထားပြီး — `C` source code ထဲမှာ `NAMEDATALEN` constant ကို သုံးပြီး ရည်ညွှန်းသင့်ပါတယ်။ အလျားကို compile လုပ်ချိန်မှာ သတ်မှတ်တာမို့ (အထူး သုံးစွဲမှုတွေအတွက် ချိန်ညှိလို့ ရပါတယ်); default အများဆုံး အလျားကတော့ နောင်ထွက်မယ့် release တွေမှာ ပြောင်းလဲနိုင်ပါတယ်။ `"char"` (quote တွေ ပါဝင်တာကို သတိပြုပါ) type က `char(1)` နဲ့ မတူညီပါဘူး — အကြောင်းကတော့ ၎င်းက 1 byte ပဲ သိုလှောင်လို့ ASCII character တစ်လုံးတည်းကိုပဲ သိမ်းဆည်းနိုင်လို့ပါ။ System catalogs တွေထဲမှာ ရိုးရှင်းတဲ့ enumeration type (စာရင်းပြု type) အဖြစ် သုံးပါတယ်။

**ဇယား 8.5. Special Character Types (အထူး character type များ)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် |
| --- | --- | --- |
| `"char"` | 1 byte | single-byte (1 byte တည်း) သုံးသော အတွင်းပိုင်း type |
| `name` | 64 bytes | object names (object နာမည်များ) အတွက် အတွင်းပိုင်း type |
