---
title: "Lexical Structure (ဝါကျဖွဲ့စည်းပုံ)"
description: "SQL input ရဲ့ lexical structure (ဝါကျဖွဲ့စည်းပုံ) — identifier/key word များ, constant (string, bit-string, numeric) များ, operator များ, အထူး သင်္ကေတ စာလုံးများ, comment များနှင့် operator precedence အကြောင်း"
order: 19
source: "https://www.postgresql.org/docs/current/sql-syntax-lexical.html"
status: translated
updated: 2026-09-03
---

## 4.1. Lexical Structure (ဝါကျဖွဲ့စည်းပုံ)

- **4.1.1. Identifiers and Key Words (identifier များနှင့် key word များ)**
- **4.1.2. Constants (ကိန်းသေတန်ဖိုးများ)**
- **4.1.3. Operators (operator များ)**
- **4.1.4. Special Characters (အထူး သင်္ကေတ စာလုံးများ)**
- **4.1.5. Comments (comment ရေးသားခြင်း)**
- **4.1.6. Operator Precedence (operator ဦးစားပေးအစဉ်)**

SQL input (ထည့်သွင်းစာသား) ဆိုတာ *command* တွေရဲ့ အစီအစဉ် (sequence) တစ်ခုပါ။ Command တစ်ခုကို *token* (syntax ရဲ့ အခြေခံ အစိတ်အပိုင်း) တွေနဲ့ ဖွဲ့စည်းထားပြီး — semicolon (“;”) နဲ့ အဆုံးသတ်ပါတယ်။ Input stream (ထည့်သွင်းစာသား စီးကြောင်း) ရဲ့ အဆုံးကလည်း command တစ်ခုကို အဆုံးသတ်ပေးပါတယ်။ ဘယ် token တွေ valid (တရားဝင်) လဲဆိုတာက — သက်ဆိုင်ရာ command တစ်ခုချင်းစီရဲ့ syntax အပေါ်မှာ မူတည်ပါတယ်။

Token တစ်ခုက — *key word* (SQL မှာ သတ်မှတ်ပြီးသား အဓိပ္ပာယ်ရှိသည့် စကားလုံး) တစ်ခု၊ *identifier* (object နာမည်များ) တစ်ခု၊ *quoted identifier* (quote ပြုထားသော identifier) တစ်ခု၊ *literal* (ပကတိ တန်ဖိုး — constant) တစ်ခု ဒါမှမဟုတ် အထူး သင်္ကေတ စာလုံး (special character symbol) တစ်ခု ဖြစ်နိုင်ပါတယ်။ Token တွေကို ပုံမှန်အားဖြင့် whitespace (space, tab, newline) တွေနဲ့ ခြားပါတယ် — ဒါပေမယ့် မရှင်းလင်းမှု (ambiguity) မရှိရင်တော့ ခြားစရာ မလိုပါဘူး (ဒါက ယေဘုယျအားဖြင့် — အထူး သင်္ကေတ စာလုံးတစ်ခုက တခြား token အမျိုးအစားတစ်ခုနဲ့ ကပ်နေမှသာ ဖြစ်တတ်ပါတယ်)။

ဥပမာ — အောက်ပါဟာ (syntax ပိုင်းအရ) valid ဖြစ်တဲ့ SQL input တစ်ခုပါ:

```sql
SELECT * FROM MY_TABLE;
UPDATE MY_TABLE SET A = 5;
INSERT INTO MY_TABLE VALUES (3, 'hi there');
```

ဒါက command သုံးခုရဲ့ အစီအစဉ်တစ်ခု ဖြစ်ပြီး — တစ်ကြောင်းမှာ command တစ်ခုစီ ပါပါတယ် (ဒါက မဖြစ်မနေ လိုအပ်တာတော့ မဟုတ်ပါဘူး — တစ်ကြောင်းတည်းမှာ command တစ်ခုထက်ပိုပြီး ရေးလို့ရသလို — command တစ်ခုကို စာကြောင်း အများအပြားပေါ်မှာ ခွဲပြီးလည်း အဆင်ပြေပြေ ရေးလို့ရပါတယ်)။

ထို့အပြင် — SQL input ထဲမှာ *comment* တွေလည်း ပါဝင်နိုင်ပါတယ်။ Comment တွေက token တွေ မဟုတ်ပါဘူး — သူတို့က whitespace နဲ့ ထိရောက်စွာ ညီမျှပါတယ်။

SQL syntax က — ဘယ် token တွေက command ကို ဖော်ပြပြီး ဘယ်ဟာတွေက operand (တန်ဖိုးခံယူသည့် အရာ) သို့မဟုတ် parameter တွေလဲဆိုတာနဲ့ ပတ်သက်ပြီး သိပ်ပြီး ညီညွတ်မှု မရှိပါဘူး။ ပထမဆုံး token အနည်းငယ်က ယေဘုယျအားဖြင့် command နာမည် ဖြစ်တာကြောင့် — အပေါ်က ဥပမာမှာ “SELECT”၊ “UPDATE” နဲ့ “INSERT” command တွေလို့ များသောအားဖြင့် ပြောလေ့ရှိပါတယ်။ ဒါပေမယ့် — ဥပမာ `UPDATE` command က သတ်မှတ်ထားတဲ့ နေရာတစ်ခုမှာ `SET` token ပါဝင်နေဖို့ အမြဲ လိုအပ်ပြီး — `INSERT` ရဲ့ ဒီပုံစံကလည်း ပြည့်စုံဖို့ `VALUES` ကို လိုအပ်ပါတယ်။ Command တစ်ခုချင်းစီအတွက် တိကျတဲ့ syntax စည်းမျဉ်းတွေကို [အပိုင်း VI](https://www.postgresql.org/docs/current/reference.html) မှာ ဖော်ပြထားပါတယ်။

### 4.1.1. Identifiers and Key Words (identifier များနှင့် key word များ)

အပေါ်က ဥပမာထဲက `SELECT`, `UPDATE` သို့မဟုတ် `VALUES` လို token တွေက *key word* တွေရဲ့ ဥပမာတွေပါ — ဆိုလိုတာက SQL language ထဲမှာ သတ်မှတ်ပြီးသား အဓိပ္ပာယ် (fixed meaning) ရှိတဲ့ စကားလုံးတွေ ဖြစ်ပါတယ်။ `MY_TABLE` နဲ့ `A` token တွေကတော့ *identifier* တွေရဲ့ ဥပမာတွေပါ။ Identifier တွေက — သူတို့ကို သုံးထားတဲ့ command အပေါ် မူတည်ပြီး — table, column သို့မဟုတ် တခြား database object တွေရဲ့ နာမည်တွေကို သတ်မှတ်ပေးပါတယ်။ ဒါကြောင့် တခါတရံ သူတို့ကို ရိုးရိုး “နာမည်များ” လို့လည်း ခေါ်ပါတယ်။ Key word တွေနဲ့ identifier တွေက lexical structure အတူတူ ရှိတာကြောင့် — language (ဘာသာစကား) ကို မသိရဘဲနဲ့ token တစ်ခုက identifier လား key word လားဆိုတာကို မသိနိုင်ပါဘူး။ Key word တွေရဲ့ စာရင်း အပြည့်အစုံကို [နောက်ဆက်တွဲ C](https://www.postgresql.org/docs/current/sql-keywords-appendix.html) မှာ တွေ့နိုင်ပါတယ်။

SQL identifier တွေနဲ့ key word တွေက — စာလုံးတစ်လုံး (`a`-`z`၊ ဒါ့အပြင် diacritical marks (စာလုံးအပေါ် အသံပြောင်း သင်္ကေတ) ပါတဲ့ စာလုံးတွေနဲ့ Latin မဟုတ်တဲ့ စာလုံးတွေလည်း ပါဝင်) ဒါမှမဟုတ် underscore (`_`) နဲ့ စတင်ရပါတယ်။ Identifier သို့မဟုတ် key word တစ်ခုထဲမှာ နောက်ဆက်တွဲ character တွေကတော့ — စာလုံးတွေ, underscore တွေ, ဂဏန်း (`0`-`9`) တွေ သို့မဟုတ် dollar sign (`$`) တွေ ဖြစ်နိုင်ပါတယ်။ SQL standard ရဲ့ စာသားအရ identifier တွေမှာ dollar sign ကို ခွင့်မပြုတာကြောင့် — dollar sign သုံးထားရင် application တွေရဲ့ portability (တခြား system သို့ ရွှေ့ပြောင်းသုံးနိုင်မှု) ကျဆင်းသွားနိုင်တာ သတိပြုပါ။ SQL standard က ဂဏန်းတွေ ပါဝင်တဲ့ ဒါမှမဟုတ် underscore နဲ့ စတင်တဲ့/အဆုံးသတ်တဲ့ key word တွေကို သတ်မှတ်မှာ မဟုတ်တာကြောင့် — ဒီပုံစံ identifier တွေက standard ရဲ့ အနာဂတ် တိုးချဲ့မှုတွေနဲ့ ဖြစ်နိုင်တဲ့ ပဋိပက္ခ (conflict) တွေကနေ ကင်းရှင်းပါတယ်။

System က identifier တစ်ခုရဲ့ `NAMEDATALEN`-1 bytes အထိပဲ သုံးပါတယ် — ဒီထက်ရှည်တဲ့ နာမည်တွေကို command တွေထဲမှာ ရေးလို့ရပေမယ့် — ဖြတ်တောက်ခံရပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် `NAMEDATALEN` က 64 ဖြစ်လို့ — identifier ရဲ့ အများဆုံး အရှည်က 63 bytes ဖြစ်ပါတယ်။ ဒီကန့်သတ်ချက်က ပြဿနာဖြစ်ရင် — `src/include/pg_config_manual.h` ထဲက `NAMEDATALEN` constant ကို ပြောင်းပြီး မြှင့်တင်လို့ရပါတယ်။

Key word တွေနဲ့ unquoted identifier (quote မလုပ်ထားတဲ့ identifier) တွေက case-insensitive (အကြီး/အသေး မခွဲခြား) ဖြစ်ပါတယ်။ ဒါကြောင့်:

```sql
UPDATE MY_TABLE SET A = 5;
```

ဆိုတာကို အောက်ပါအတိုင်း တူညီစွာ ရေးလို့ရပါတယ်:

```sql
uPDaTE my_TabLE SeT a = 5;
```

မကြာခဏ သုံးလေ့ရှိတဲ့ စည်းမျဉ်း (convention) တစ်ခုကတော့ — key word တွေကို upper case (စာလုံးကြီး) နဲ့ ရေးပြီး — နာမည်တွေကို lower case (စာလုံးသေး) နဲ့ ရေးတာပါ။ ဥပမာ:

```sql
UPDATE my_table SET a = 5;
```

နောက်ထပ် identifier အမျိုးအစား တစ်မျိုးလည်း ရှိပါသေးတယ် — *delimited identifier* လို့လည်း ခေါ်တဲ့ *quoted identifier* ပါ။ သူ့ကို — ကြိုက်ရာ character အစီအစဉ် (arbitrary sequence) တစ်ခုကို double-quote (`"`) နှစ်ခုကြားမှာ ထည့်ပြီး ဖွဲ့စည်းပါတယ်။ Delimited identifier က အမြဲတမ်း identifier တစ်ခုပဲ ဖြစ်ပြီး — key word ဘယ်တော့မှ မဖြစ်ပါဘူး။ ဒါကြောင့် — “select” ဆိုတဲ့ နာမည်ရှိတဲ့ column သို့မဟုတ် table တစ်ခုကို ရည်ညွှန်းဖို့ `"select"` ကို သုံးလို့ရပါတယ်။ Unquoted `select` ကတော့ key word တစ်ခုအဖြစ် ယူဆခံရမှာ ဖြစ်လို့ — table သို့မဟုတ် column နာမည် မျှော်လင့်ထားတဲ့ နေရာမှာ သုံးမိရင် parse error (ခွဲခြမ်းစိတ်ဖြာမှု အမှား) ဖြစ်စေပါလိမ့်မယ်။ ဒီဥပမာကို quoted identifier တွေနဲ့ ဒီလိုရေးလို့ရပါတယ်:

```sql
UPDATE "my_table" SET "a" = 5;
```

Quoted identifier တွေထဲမှာ — code zero ဖြစ်တဲ့ character ကလွဲရင် ဘယ် character မဆို ပါဝင်နိုင်ပါတယ်။ (Double quote တစ်ခု ထည့်ချင်ရင်တော့ double quote နှစ်ခု ဆက်ရေးပါ။) ဒါက — space တွေ ဒါမှမဟုတ် ampersand (&) တွေ ပါဝင်တဲ့ နာမည်တွေလို — တခြားနည်းနဲ့ဆို မဖန်တီးနိုင်တဲ့ table သို့မဟုတ် column နာမည်တွေကို ဆောက်လုပ်ခွင့် ပေးပါတယ်။ Length (အရှည်) ကန့်သတ်ချက်ကတော့ အကျုံးဝင်ဆဲ ဖြစ်ပါတယ်။

Identifier တစ်ခုကို quote လုပ်လိုက်ရင် — အဲဒါက case-sensitive (အကြီး/အသေး ခွဲခြား) ဖြစ်သွားပြီး — unquoted နာမည်တွေကတော့ အမြဲတမ်း lower case အဖြစ် ပြောင်းလဲခံရပါတယ်။ ဥပမာ — `FOO`, `foo`, `"foo"` တို့ကို PostgreSQL က တစ်ခုတည်းအဖြစ် သတ်မှတ်ပေမယ့် — `"Foo"` နဲ့ `"FOO"` တို့ကတော့ ဒီသုံးခုနဲ့ရော အချင်းချင်းပါ ကွဲပြားပါတယ်။ (PostgreSQL မှာ unquoted နာမည်တွေကို lower case အဖြစ် ပြောင်းတာက SQL standard နဲ့ မကိုက်ညီပါဘူး — standard အရဆိုရင် unquoted နာမည်တွေကို upper case အဖြစ် ပြောင်းသင့်ပါတယ်။ ဒါကြောင့် standard အရဆိုရင် `foo` က `"foo"` နဲ့ မဟုတ်ဘဲ `"FOO"` နဲ့ ညီမျှသင့်ပါတယ်။ Portable (ရွှေ့ပြောင်းသုံးလို့ရတဲ့) application တွေ ရေးချင်ရင် — နာမည်တစ်ခုကို အမြဲတမ်း quote လုပ်ပါ ဒါမှမဟုတ် ဘယ်တော့မှ quote မလုပ်ပါဆိုတာကို လိုက်နာဖို့ အကြံပြုပါတယ်။)

Quoted identifier ရဲ့ မူကွဲ (variant) တစ်ခုက — code point (character ရဲ့ ကုဒ်နံပါတ်) အလိုက် သတ်မှတ်ထားတဲ့ escaped Unicode character တွေကို ထည့်သွင်းခွင့် ပေးပါတယ်။ ဒီမူကွဲက — အဖွင့် double quote မတိုင်ခင် ကြားမှာ space ဘာမှ မပါဘဲ `U&` (စာလုံးကြီး သို့မဟုတ် စာလုံးသေး U နောက်မှာ ampersand) နဲ့ စတင်ပါတယ် — ဥပမာ `U&"foo"`။ (`&` operator နဲ့ ရှုပ်ထွေးမှု (ambiguity) ဖြစ်စေနိုင်တာ သတိပြုပါ — ဒီပြဿနာကို ရှောင်ဖို့ operator ရဲ့ ပတ်လည်မှာ space တွေ ထည့်သုံးပါ။) Quote တွေရဲ့ အတွင်းမှာ — Unicode character တွေကို backslash တစ်ခု နောက်မှာ ဂဏန်းလေးလုံးပါတဲ့ hexadecimal code point နံပါတ် ဒါမှမဟုတ် backslash တစ်ခု နောက်မှာ plus sign နဲ့ ဂဏန်းခြောက်လုံးပါတဲ့ hexadecimal code point နံပါတ် ရေးပြီး escaped ပုံစံနဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — `"data"` ဆိုတဲ့ identifier ကို ဒီလိုရေးလို့ရပါတယ်:

```sql
U&"d\0061t\+000061"
```

ဒီထက်နည်းနည်း ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခုကတော့ — Russian စကားလုံး “slon” (elephant — ဆင်) ကို Cyrillic အက္ခရာတွေနဲ့ ရေးတာပါ:

```sql
U&"\0441\043B\043E\043D"
```

Backslash မဟုတ်တဲ့ တခြား escape character တစ်ခုကို သုံးချင်ရင် — string ပြီးနောက်မှာ `UESCAPE` clause နဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ:

```sql
U&"d!0061t!+000061" UESCAPE '!'
```

Escape character က — hexadecimal ဂဏန်း, plus sign, single quote, double quote ဒါမှမဟုတ် whitespace character ကလွဲရင် — ဘယ် character တစ်လုံးတည်း မဆို ဖြစ်နိုင်ပါတယ်။ `UESCAPE` ရဲ့ နောက်မှာ escape character ကို double quote မဟုတ်ဘဲ single quote တွေနဲ့ ရေးတယ်ဆိုတာ သတိပြုပါ။

Identifier ထဲမှာ escape character ကို ပကတိ ထည့်သွင်းချင်ရင် — အဲဒါကို နှစ်ခါ ဆက်ရေးပါ။

Code point U+FFFF ထက် ကြီးတဲ့ character တွေကို ဖွဲ့စည်းဖို့ UTF-16 surrogate pair တွေကို သတ်မှတ်ရာမှာ — ဂဏန်းလေးလုံး ပုံစံပဲ ဖြစ်စေ၊ ခြောက်လုံး ပုံစံပဲ ဖြစ်စေ escape ပုံစံ နှစ်မျိုးလုံး သုံးလို့ရပါတယ် — ခြောက်လုံး ပုံစံ ရှိနေတာကြောင့် ဒါက နည်းပညာအရတော့ မလိုအပ်ပါဘူး။ (Surrogate pair တွေကို တိုက်ရိုက် သိမ်းဆည်းမထားဘဲ — code point တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ပါတယ်။)

Server encoding က UTF-8 မဟုတ်ရင် — ဒီ escape sequence တွေထဲက တစ်ခုနဲ့ သတ်မှတ်လိုက်တဲ့ Unicode code point ကို တကယ့် server encoding အဖြစ် ပြောင်းလဲပေးပြီး — မပြောင်းလဲနိုင်ရင် error တစ်ခု တင်ပြပါတယ်။

### 4.1.2. Constants (ကိန်းသေတန်ဖိုးများ)

PostgreSQL မှာ *implicitly-typed constant* (type အတိအကျ သတ်မှတ်မထားသော ကိန်းသေတန်ဖိုး) အမျိုးအစား သုံးမျိုး ရှိပါတယ် — string တွေ, bit string တွေနဲ့ ဂဏန်းတွေပါ။ Constant တွေကို explicit type (ရှင်းရှင်းလင်းလင်း သတ်မှတ်ထားသော type) တွေနဲ့လည်း သတ်မှတ်လို့ရပြီး — ဒါက system ကို ပိုတိကျတဲ့ ကိုယ်စားပြုမှု (representation) နဲ့ ပိုထိရောက်တဲ့ ကိုင်တွယ်ဆောင်ရွက်မှု (handling) တွေ ပြုလုပ်နိုင်စေပါတယ်။ ဒီနည်းလမ်း ရွေးစရာတွေကို အောက်က subsection တွေမှာ ဆွေးနွေးထားပါတယ်။

#### 4.1.2.1. String Constants (string ကိန်းသေတန်ဖိုးများ)

SQL ထဲက string constant ဆိုတာ — single quote (`'`) နှစ်ခုကြားမှာ ညှပ်ထားတဲ့ ကြိုက်ရာ character အစီအစဉ်တစ်ခုပါ — ဥပမာ `'This is a string'`။ String constant တစ်ခုထဲမှာ single quote character ထည့်သွင်းချင်ရင် — single quote နှစ်ခုကို ဆက်တိုက် ရေးပါ — ဥပမာ `'Dianne''s horse'`။ ဒါက double quote character (`"`) နဲ့ မတူဘူးဆိုတာ သတိပြုပါ။

အနည်းဆုံး newline တစ်ခု ပါဝင်တဲ့ whitespace နဲ့ပဲ ခြားထားတဲ့ string constant နှစ်ခုက — ပေါင်းစပ်ပြီး — constant တစ်ခုတည်းအဖြစ် ရေးထားသလိုမျိုး ထိရောက်စွာ သတ်မှတ်ခံရပါတယ်။ ဥပမာ:

```sql
SELECT 'foo'
'bar';
```

ဆိုတာ ဒါနဲ့ ညီမျှပါတယ်:

```sql
SELECT 'foobar';
```

ဒါပေမယ့်:

```sql
SELECT 'foo'      'bar';
```

ကတော့ valid syntax မဟုတ်ပါဘူး။ (နည်းနည်း ထူးဆန်းတဲ့ ဒီအပြုအမူကို SQL က သတ်မှတ်ထားတာ ဖြစ်ပြီး — PostgreSQL က standard ကို လိုက်နာနေတာပါ။)

#### 4.1.2.2. String Constants with C-Style Escapes (C-style escape ပါသော string ကိန်းသေတန်ဖိုးများ)

PostgreSQL က SQL standard ရဲ့ တိုးချဲ့မှုတစ်ခု ဖြစ်တဲ့ “escape” string constant တွေကိုလည်း လက်ခံပါတယ်။ Escape string constant တစ်ခုကို — အဖွင့် single quote ရဲ့ ရှေ့မှာ `E` စာလုံး (အကြီး ဒါမှမဟုတ် အသေး) ရေးပြီး သတ်မှတ်ပါတယ် — ဥပမာ `E'foo'`။ (Escape string constant တစ်ခုကို စာကြောင်း အများအပြားပေါ် ဆက်ရေးတဲ့အခါ — ပထမ အဖွင့် quote ရဲ့ ရှေ့မှာပဲ `E` ကို ရေးပါ။) Escape string တစ်ခုထဲမှာ — backslash character (`\`) က C နဲ့ဆင်တဲ့ *backslash escape* sequence တစ်ခုကို စတင်ပေးပါတယ် — အဲဒီမှာ backslash နဲ့ ၎င်းနောက်က character (များ) ရဲ့ ပေါင်းစပ်မှုက အထူး byte တန်ဖိုးတစ်ခုကို ကိုယ်စားပြုပါတယ် — [ဇယား 4.1](/docs/postgresql/sql-syntax-lexical) မှာ ပြထားတဲ့အတိုင်းပါ။

**ဇယား 4.1. Backslash Escape အစီအစဉ်များ**

| Backslash Escape Sequence | Interpretation |
| --- | --- |
| `\b` | backspace (နောက်သို့ ရွေ့ခြင်း) |
| `\f` | form feed (စာမျက်နှာ ရွေ့ခြင်း) |
| `\n` | newline (စာကြောင်းသစ်) |
| `\r` | carriage return (စာကြောင်းအစသို့ ပြန်သွားခြင်း) |
| `\t` | tab (နေရာလွတ် ချန်ခြင်း) |
| `\o`, `\oo`, `\ooo` (`o` = 0–7) | octal byte value (octal byte တန်ဖိုး) |
| `\xh`, `\xhh` (`h` = 0–9, A–F) | hexadecimal byte value (hexadecimal byte တန်ဖိုး) |
| `\uxxxx`, `\Uxxxxxxxx` (`x` = 0–9, A–F) | 16-bit သို့မဟုတ် 32-bit hexadecimal Unicode character တန်ဖိုး |

Backslash နောက်မှာ လာတဲ့ တခြား character မှန်သမျှကို ပကတိအတိုင်း ယူပါတယ်။ ဒါကြောင့် backslash character တစ်ခု ထည့်သွင်းချင်ရင် — backslash နှစ်ခု (`\\`) ဆက်ရေးပါ။ အလားတူပဲ — escape string တစ်ခုထဲမှာ single quote တစ်ခုကို ပုံမှန် `''` နည်းအပြင် `\'` ရေးပြီးလည်း ထည့်သွင်းနိုင်ပါတယ်။

သင်ဖန်တီးလိုက်တဲ့ byte sequence တွေ — အထူးသဖြင့် octal ဒါမှမဟုတ် hexadecimal escape တွေ သုံးတဲ့အခါ — server character set encoding ထဲမှာ valid character တွေ ဖွဲ့စည်းဖြစ်မြောက်ဖို့ဆိုတာ သင့်တာဝန်ပါ။ အသုံးဝင်တဲ့ ရွေးချယ်စရာတစ်ခုကတော့ — [အပိုင်း 4.1.2.3](/docs/postgresql/sql-syntax-lexical) မှာ ရှင်းပြထားတဲ့ Unicode escape တွေ ဒါမှမဟုတ် အခြားသော Unicode escape syntax ကို သုံးတာပါ — အဲဒီအခါ character ပြောင်းလဲမှု ဖြစ်နိုင်မဖြစ်ကို server က စစ်ဆေးပေးပါလိမ့်မယ်။

> **သတိပြုရန်:** Configuration parameter [standard_conforming_strings](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-STANDARD-CONFORMING-STRINGS) က `off` ဖြစ်နေရင် — PostgreSQL က backslash escape တွေကို ပုံမှန် string constant ရော escape string constant နှစ်မျိုးလုံးမှာပါ မှတ်မိပါတယ်။ ဒါပေမယ့် — PostgreSQL 9.1 ကစပြီး default က `on` ဖြစ်တာကြောင့် — backslash escape တွေကို escape string constant တွေမှာပဲ မှတ်မိတော့ပါတယ်။ ဒီအပြုအမူက standard နဲ့ ပိုကိုက်ညီပေမယ့် — backslash escape တွေကို အမြဲ မှတ်မိတဲ့ သမိုင်းဝင် အပြုအမူပေါ် မှီခိုနေတဲ့ application တွေကို ပျက်စီးစေနိုင်ပါတယ်။ ယာယီ ဖြေရှင်းနည်း (workaround) အနေနဲ့ ဒီ parameter ကို `off` လုပ်ထားလို့ရပေမယ့် — backslash escape တွေ သုံးတာကနေ ရွှေ့ပြောင်းဖို့ကတော့ ပိုကောင်းပါတယ်။ အထူး character တစ်ခုကို ကိုယ်စားပြုဖို့ backslash escape သုံးဖို့ လိုအပ်ရင် — string constant ကို `E` နဲ့ ရေးပါ။
>
> `standard_conforming_strings` အပြင် — configuration parameter [escape_string_warning](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-ESCAPE-STRING-WARNING) နဲ့ [backslash_quote](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-BACKSLASH-QUOTE) တို့က string constant တွေထဲမှာ backslash တွေကို ကိုင်တွယ်ပုံကို ထိန်းချုပ်ပါတယ်။

Code zero (ကုဒ် 0) ဖြစ်တဲ့ character ကတော့ string constant တစ်ခုထဲမှာ မပါဝင်နိုင်ပါဘူး။

#### 4.1.2.3. String Constants with Unicode Escapes (Unicode escape ပါသော string ကိန်းသေတန်ဖိုးများ)

PostgreSQL က string တွေအတွက် — code point အလိုက် ကြိုက်ရာ Unicode character တွေကို သတ်မှတ်ခွင့်ပေးတဲ့ နောက်ထပ် escape syntax အမျိုးအစားတစ်ခုကိုလည်း ပံ့ပိုးပါတယ်။ Unicode escape string constant တစ်ခုက — အဖွင့် quote မတိုင်ခင် ကြားမှာ space ဘာမှ မပါဘဲ `U&` (စာလုံးကြီး သို့မဟုတ် စာလုံးသေး U နောက်မှာ ampersand) နဲ့ စတင်ပါတယ် — ဥပမာ `U&'foo'`။ (`&` operator နဲ့ ရှုပ်ထွေးမှု ဖြစ်စေနိုင်တာ သတိပြုပါ — ဒီပြဿနာကို ရှောင်ဖို့ operator ရဲ့ ပတ်လည်မှာ space တွေ ထည့်သုံးပါ။) Quote တွေရဲ့ အတွင်းမှာ — Unicode character တွေကို backslash တစ်ခု နောက်မှာ ဂဏန်းလေးလုံးပါတဲ့ hexadecimal code point နံပါတ် ဒါမှမဟုတ် backslash တစ်ခု နောက်မှာ plus sign နဲ့ ဂဏန်းခြောက်လုံးပါတဲ့ hexadecimal code point နံပါတ် ရေးပြီး escaped ပုံစံနဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — `'data'` ဆိုတဲ့ string ကို ဒီလိုရေးလို့ရပါတယ်:

```sql
U&'d\0061t\+000061'
```

ဒီထက်နည်းနည်း ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခုကတော့ — Russian စကားလုံး “slon” (elephant — ဆင်) ကို Cyrillic အက္ခရာတွေနဲ့ ရေးတာပါ:

```sql
U&'\0441\043B\043E\043D'
```

Backslash မဟုတ်တဲ့ တခြား escape character တစ်ခုကို သုံးချင်ရင် — string ပြီးနောက်မှာ `UESCAPE` clause နဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ:

```sql
U&'d!0061t!+000061' UESCAPE '!'
```

Escape character က — hexadecimal ဂဏန်း, plus sign, single quote, double quote ဒါမှမဟုတ် whitespace character ကလွဲရင် — ဘယ် character တစ်လုံးတည်း မဆို ဖြစ်နိုင်ပါတယ်။

String ထဲမှာ escape character ကို ပကတိ ထည့်သွင်းချင်ရင် — အဲဒါကို နှစ်ခါ ဆက်ရေးပါ။

Code point U+FFFF ထက် ကြီးတဲ့ character တွေကို ဖွဲ့စည်းဖို့ UTF-16 surrogate pair တွေကို သတ်မှတ်ရာမှာ — ဂဏန်းလေးလုံး ပုံစံပဲ ဖြစ်စေ၊ ခြောက်လုံး ပုံစံပဲ ဖြစ်စေ escape ပုံစံ နှစ်မျိုးလုံး သုံးလို့ရပါတယ် — ခြောက်လုံး ပုံစံ ရှိနေတာကြောင့် ဒါက နည်းပညာအရတော့ မလိုအပ်ပါဘူး။ (Surrogate pair တွေကို တိုက်ရိုက် သိမ်းဆည်းမထားဘဲ — code point တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ပါတယ်။)

Server encoding က UTF-8 မဟုတ်ရင် — ဒီ escape sequence တွေထဲက တစ်ခုနဲ့ သတ်မှတ်လိုက်တဲ့ Unicode code point ကို တကယ့် server encoding အဖြစ် ပြောင်းလဲပေးပြီး — မပြောင်းလဲနိုင်ရင် error တစ်ခု တင်ပြပါတယ်။

ဒါ့အပြင် — string constant တွေအတွက် Unicode escape syntax က configuration parameter [standard_conforming_strings](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-STANDARD-CONFORMING-STRINGS) ဖွင့်ထားမှသာ အလုပ်လုပ်ပါတယ်။ အကြောင်းကတော့ — ဒီ syntax ရှိနေရင် SQL statement တွေကို parse (ခွဲခြမ်းစိတ်ဖြာ) လုပ်တဲ့ client တွေကို ရှုပ်ထွေးစေနိုင်ပြီး — SQL injection နဲ့ ဆင်တဲ့ security ပြဿနာတွေအထိ ဖြစ်စေနိုင်လို့ပါ။ Parameter က `off` လုပ်ထားရင် — ဒီ syntax ကို error message တစ်ခုနဲ့ ပယ်ချပါလိမ့်မယ်။

#### 4.1.2.4. Dollar-Quoted String Constants (dollar-quoted string ကိန်းသေတန်ဖိုးများ)

String constant တွေကို သတ်မှတ်တဲ့ standard syntax က များသောအားဖြင့် အဆင်ပြေပေမယ့် — လိုချင်တဲ့ string ထဲမှာ single quote တွေ အများကြီး ပါနေရင် — quote တစ်ခုချင်းစီကို နှစ်ဆ ရေးရတာကြောင့် — နားလည်ရ ခက်ခဲနိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ ပိုဖတ်ရလွယ်တဲ့ query တွေ ရေးနိုင်ဖို့ — PostgreSQL က string constant တွေကို ရေးသားဖို့ “dollar quoting” လို့ခေါ်တဲ့ နောက်ထပ် နည်းလမ်းတစ်ခု ပံ့ပိုးပေးပါတယ်။ Dollar-quoted string constant တစ်ခုမှာ — dollar sign (`$`) တစ်ခု, စာလုံး သုည သို့မဟုတ် ထို့ထက်ပိုပါတဲ့ “tag” (တံဆိပ်) တစ်ခု, နောက်ထပ် dollar sign တစ်ခု, string ရဲ့ အကြောင်းအရာ ဖြစ်တဲ့ ကြိုက်ရာ character အစီအစဉ်တစ်ခု, dollar sign တစ်ခု, ဒီ dollar quote ကို စတင်ခဲ့တဲ့ tag အတိုင်းပဲ ဖြစ်တဲ့ tag တစ်ခုနဲ့ နောက်ဆုံး dollar sign တစ်ခု ပါဝင်ပါတယ်။ ဥပမာ — “Dianne's horse” ဆိုတဲ့ string ကို dollar quoting သုံးပြီး သတ်မှတ်တဲ့ မတူညီတဲ့ နည်း နှစ်နည်း ရှိပါတယ်:

```
$$Dianne's horse$$
$SomeTag$Dianne's horse$SomeTag$
```

Dollar-quoted string ရဲ့ အတွင်းမှာ — single quote တွေကို escape လုပ်စရာ မလိုဘဲ သုံးလို့ရတယ်ဆိုတာ သတိပြုပါ။ တကယ်တော့ dollar-quoted string တစ်ခုထဲမှာ ဘယ် character ကိုမှ escape လုပ်စရာ မလိုပါဘူး — string ရဲ့ အကြောင်းအရာကို အမြဲတမ်း ပကတိ (literally) အတိုင်း ရေးပါတယ်။ Backslash တွေက အထူး အဓိပ္ပာယ် မရှိသလို — dollar sign တွေကလည်း — အဖွင့် tag နဲ့ ကိုက်ညီတဲ့ sequence ရဲ့ အစိတ်အပိုင်း မဟုတ်ရင် — အထူး အဓိပ္ပာယ် မရှိပါဘူး။

Dollar-quoted string constant တွေကို — အဆင့်တစ်ခုချင်းစီမှာ tag မတူအောင် ရွေးချယ်ပြီး — အသိုက်လိုက် (nest) လုပ်လို့ ရပါတယ်။ Function definition တွေ ရေးတဲ့အခါမှာ ဒါကို အသုံးအများဆုံး ဖြစ်ပါတယ်။ ဥပမာ:

```
$function$
BEGIN
    RETURN ($1 ~ $q$[\t\r\n\v\\]$q$);
END;
$function$
```

ဒီနေရာမှာ — `$q$[\t\r\n\v\\]$q$` ဆိုတဲ့ sequence က `[\t\r\n\v\\]` ဆိုတဲ့ dollar-quoted literal string တစ်ခုကို ကိုယ်စားပြုပြီး — function body ကို PostgreSQL က execute လုပ်တဲ့အခါ အဲဒါကို မှတ်မိမှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — ဒီ sequence က အပြင်ဘက် dollar quoting delimiter `$function$` နဲ့ မကိုက်ညီတာကြောင့် — အပြင်ဘက် string အတွက်တော့ ဒါက constant ထဲက နောက်ထပ် character တချို့ပဲ ဖြစ်ပါတယ်။

Dollar-quoted string တစ်ခုရဲ့ tag (ရှိရင်) က — dollar sign မပါဝင်နိုင်တာကလွဲရင် — unquoted identifier နဲ့ အတူတူ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်။ Tag တွေက case-sensitive ဖြစ်တာကြောင့် — `$tag$String content$tag$` က မှန်ကန်ပေမယ့် — `$TAG$String content$tag$` ကတော့ မမှန်ပါဘူး။

Keyword ဒါမှမဟုတ် identifier တစ်ခုရဲ့ နောက်မှာ လိုက်တဲ့ dollar-quoted string တစ်ခုကို — ရှေ့က အရာနဲ့ whitespace နဲ့ ခြားထားရပါမယ် — မဟုတ်ရင် dollar quoting delimiter ကို ရှေ့က identifier ရဲ့ အစိတ်အပိုင်းအဖြစ် မှတ်ယူခံရပါလိမ့်မယ်။

Dollar quoting က SQL standard ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး — ဒါပေမယ့် ရှုပ်ထွေးတဲ့ string literal တွေကို standard နဲ့ ကိုက်ညီတဲ့ single quote syntax ထက် ပိုပြီး အဆင်ပြေပြေ ရေးလို့ရတဲ့ နည်းလမ်းတစ်ခု မကြာခဏ ဖြစ်ပါတယ်။ အထူးသဖြင့် — procedural function definition တွေမှာ မကြာခဏ လိုအပ်သလို — တခြား constant တွေရဲ့ အတွင်းမှာ string constant တွေကို ကိုယ်စားပြုတဲ့အခါ အသုံးဝင်ပါတယ်။ Single quote syntax နဲ့ဆိုရင် — အပေါ်က ဥပမာထဲက backslash တစ်ခုချင်းစီကို backslash လေးခု ရေးရမှာ ဖြစ်ပြီး — မူရင်း string constant ကို parse လုပ်တဲ့အခါ backslash နှစ်ခုအဖြစ် လျော့ကျသွားကာ — function execution အတွင်း အတွင်းဘက် string constant ကို ပြန် parse လုပ်တဲ့အခါ backslash တစ်ခုအဖြစ် ထပ်လျော့ကျသွားမှာ ဖြစ်ပါတယ်။

#### 4.1.2.5. Bit-String Constants (bit-string ကိန်းသေတန်ဖိုးများ)

Bit-string constant တွေက — ပုံမှန် string constant တွေနဲ့ တူပေမယ့် — အဖွင့် quote ရဲ့ ရှေ့မှာ `B` (အကြီး သို့မဟုတ် အသေး) ရှိပါတယ် (ကြားထဲမှာ whitespace မပါဘူး) — ဥပမာ `B'1001'`။ Bit-string constant တွေထဲမှာ ခွင့်ပြုထားတဲ့ character တွေက `0` နဲ့ `1` ပဲ ဖြစ်ပါတယ်။

တနည်းအားဖြင့် — bit-string constant တွေကို hexadecimal notation (ဖော်ပြနည်း) နဲ့လည်း — ရှေ့မှာ `X` (အကြီး သို့မဟုတ် အသေး) တပ်ပြီး သတ်မှတ်လို့ရပါတယ် — ဥပမာ `X'1FF'`။ ဒီဖော်ပြနည်းက — hexadecimal ဂဏန်းတစ်လုံးစီအတွက် binary ဂဏန်း လေးလုံးစီနဲ့ ညီမျှတဲ့ bit-string constant တစ်ခုနဲ့ တူညီပါတယ်။

Bit-string constant ပုံစံ နှစ်မျိုးလုံးကို — ပုံမှန် string constant တွေလိုပဲ — စာကြောင်း အများအပြားပေါ် ဆက်ရေးလို့ရပါတယ်။ Dollar quoting ကတော့ bit-string constant တစ်ခုထဲမှာ သုံးလို့ မရပါဘူး။

#### 4.1.2.6. Numeric Constants (ကိန်းဂဏန်း ကိန်းသေတန်ဖိုးများ)

Numeric constant (ကိန်းဂဏန်း ကိန်းသေတန်ဖိုး) တွေကို ဒီယေဘုယျ ပုံစံတွေနဲ့ လက်ခံပါတယ်:

```sql
digits
digits.[digits][e[+-]digits]
[digits].digits[e[+-]digits]
digitse[+-]digits
```

ဒီမှာ `digits` ဆိုတာ ဒဿမ ဂဏန်း (0 ကနေ 9) တစ်လုံး သို့မဟုတ် တစ်ခုထက်ပို ဖြစ်ပါတယ်။ ဒဿမ အမှတ် (decimal point) သုံးမယ်ဆိုရင် — အဲဒီအမှတ်ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ အနည်းဆုံး ဂဏန်းတစ်လုံး ရှိရပါမယ်။ Exponent marker (`e`) ပါမယ်ဆိုရင် — အဲဒီနောက်မှာ အနည်းဆုံး ဂဏန်းတစ်လုံး လိုက်ရပါမယ်။ Constant ထဲမှာ space ဒါမှမဟုတ် တခြား character တွေ ထည့်သွင်းလို့ မရပါဘူး — အောက်မှာ ဖော်ပြထားသလို အမြင်ပိုင်း အုပ်စုဖွဲ့မှု (visual grouping) အတွက် သုံးလို့ရတဲ့ underscore တွေကလွဲရင်။ Constant ရဲ့ ရှေ့ဆုံးမှာ ပါတဲ့ plus သို့မဟုတ် minus sign က constant ရဲ့ အစိတ်အပိုင်း မဟုတ်ဘဲ — constant ပေါ်မှာ သက်ရောက်တဲ့ operator တစ်ခု ဖြစ်တယ်ဆိုတာ သတိပြုပါ။

ဒါတွေကတော့ valid numeric constant တွေရဲ့ ဥပမာ အချို့ပါ:

42

        3.5

        4.

        .001

        5e2

        1.925e-3

ထို့အပြင် — ဒဿမ မဟုတ်တဲ့ (non-decimal) ကိန်းပြည့် (integer) constant တွေကို ဒီပုံစံတွေနဲ့ လက်ခံပါတယ်:

```sql
0xhexdigits
0ooctdigits
0bbindigits
```

ဒီမှာ `hexdigits` ဆိုတာ hexadecimal ဂဏန်း (0-9, A-F) တစ်လုံး သို့မဟုတ် တစ်ခုထက်ပို၊ `octdigits` ဆိုတာ octal ဂဏန်း (0-7) တစ်လုံး သို့မဟုတ် တစ်ခုထက်ပို၊ `bindigits` ဆိုတာ binary ဂဏန်း (0 သို့မဟုတ် 1) တစ်လုံး သို့မဟုတ် တစ်ခုထက်ပို ဖြစ်ပါတယ်။ Hexadecimal ဂဏန်းတွေနဲ့ radix prefix (ဂဏန်း အခြေစနစ် ရှေ့ဆက်) တွေက အကြီး/အသေး နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။ Non-decimal ပုံစံတွေက ကိန်းပြည့်တွေအတွက်ပဲ ဖြစ်ပြီး — အပိုင်းကိန်း (fractional part) ပါတဲ့ ဂဏန်းတွေအတွက် မဟုတ်ဘူးဆိုတာ သတိပြုပါ။

ဒါတွေကတော့ valid non-decimal integer constant တွေရဲ့ ဥပမာ အချို့ပါ:

0b100101

        0B10011001

        0o273

        0O755

        0x42f

        0XFFFF

အမြင်ပိုင်း အုပ်စုဖွဲ့မှုအတွက် — underscore တွေကို ဂဏန်းတွေကြားမှာ ထည့်သွင်းနိုင်ပါတယ်။ ဒါတွေက constant ရဲ့ တန်ဖိုးအပေါ် နောက်ထပ် သက်ရောက်မှု ဘာမှ မရှိပါဘူး။ ဥပမာ:

1_500_000_000

        0b10001000_00000000

        0o_1_755

        0xFFFF_FFFF

        1.618_034

Underscore တွေက numeric constant တစ်ခု ဒါမှမဟုတ် ဂဏန်းအုပ်စုတစ်ခုရဲ့ အစ ဒါမှမဟုတ် အဆုံးမှာ (ဆိုလိုတာက — ဒဿမ အမှတ် ဒါမှမဟုတ် exponent marker ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ တိုက်ရိုက်) ထားလို့ မရသလို — underscore တစ်ခုထက်ပိုပြီး ဆက်တိုက် ထားလို့လည်း မရပါဘူး။

ဒဿမ အမှတ် ရော exponent ပါ မပါတဲ့ numeric constant တစ်ခုကို — သူ့ရဲ့ တန်ဖိုးက `integer` type (32 bits) ထဲ ဝင်ဆံ့ရင် ကနဦးမှာ `integer` type လို့ မှန်းဆပြီး — မဝင်ဆံ့ဘဲ `bigint` type (64 bits) ထဲ ဝင်ဆံ့ရင်တော့ `bigint` လို့ မှန်းဆပါတယ် — ဒီနှစ်ခုနဲ့မှ မဝင်ဆံ့ရင် `numeric` type အဖြစ် ယူပါတယ်။ ဒဿမ အမှတ် နဲ့/သို့မဟုတ် exponent ပါတဲ့ constant တွေကိုတော့ အမြဲတမ်း ကနဦးမှာ `numeric` type လို့ မှန်းဆပါတယ်။

Numeric constant တစ်ခုကို ကနဦး သတ်မှတ်ပေးလိုက်တဲ့ data type က type resolution (type ဖြေရှင်းခြင်း) algorithm တွေအတွက် စမှတ် (starting point) တစ်ခုပဲ ဖြစ်ပါတယ်။ အခြေအနေ အများစုမှာ — constant က context အပေါ် မူတည်ပြီး အသင့်တော်ဆုံး type အဖြစ် အလိုအလျောက် ပြောင်းလဲခံရပါလိမ့်မယ်။ လိုအပ်ရင် — numeric တန်ဖိုးတစ်ခုကို သတ်မှတ်ထားတဲ့ data type တစ်ခုအနေနဲ့ အနက်ဖွင့်ဖို့ cast (type ပြောင်းလဲခြင်း) လုပ်ပြီး အတင်းအကျပ် သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — numeric တန်ဖိုးတစ်ခုကို `real` (`float4`) type အနေနဲ့ သတ်မှတ်ချင်ရင် ဒီလို ရေးပါ:

```sql
REAL '1.23'  -- string style
1.23::REAL   -- PostgreSQL (historical) style
```

ဒါတွေက တကယ်တော့ — နောက်မှာ ဆွေးနွေးမယ့် ယေဘုယျ cast ဖော်ပြနည်း (notation) တွေရဲ့ အထူး အခြေအနေတွေပဲ ဖြစ်ပါတယ်။

#### 4.1.2.7. Constants of Other Types (အခြား type များ၏ ကိန်းသေတန်ဖိုးများ)

ကြိုက်ရာ type တစ်ခုရဲ့ constant တစ်ခုကို — အောက်ပါ ဖော်ပြနည်း တစ်ခုခုနဲ့ ထည့်သွင်းနိုင်ပါတယ်:

```sql
type 'string'
'string'::type
CAST ( 'string' AS type )
```

`type` လို့ခေါ်တဲ့ type အတွက် input conversion routine (ထည့်သွင်း ပြောင်းလဲသည့် လုပ်ရိုးလုပ်စဉ်) ထဲကို string constant ရဲ့ စာသားကို ပို့ပေးပါတယ်။ ရလဒ်က — ညွှန်ပြထားတဲ့ type ရဲ့ constant တစ်ခု ဖြစ်ပါတယ်။ Constant ရဲ့ type က ဘာဖြစ်ရမယ်ဆိုတာ မရှင်းလင်းမှု (ambiguity) မရှိရင် (ဥပမာ — table column တစ်ခုဆီ တိုက်ရိုက် သတ်မှတ်ပေးတဲ့အခါ) — explicit type cast ကို ချန်လိုက်လို့ရပြီး — အဲဒီအခါ အလိုအလျောက် ပြောင်းလဲပေးပါတယ်။

String constant ကို — ပုံမှန် SQL ဖော်ပြနည်းနဲ့ ဖြစ်စေ၊ dollar-quoting နဲ့ ဖြစ်စေ ရေးနိုင်ပါတယ်။

Function နဲ့တူတဲ့ syntax သုံးပြီး type coercion (type အတင်းအကျပ် ပြောင်းခြင်း) တစ်ခုကို သတ်မှတ်ဖို့လည်း ဖြစ်နိုင်ပါတယ်:

```sql
typename ( 'string' )
```

ဒါပေမယ့် — type နာမည် အားလုံးကို ဒီနည်းနဲ့တော့ သုံးလို့ မရပါဘူး — အသေးစိတ်အတွက် [အပိုင်း 4.2.9](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ။

`::`, `CAST()`, function-call syntax တွေကို — [အပိုင်း 4.2.9](/docs/postgresql/sql-expressions) မှာ ဆွေးနွေးထားသလို — ကြိုက်ရာ expression တွေရဲ့ run-time type conversion (လည်ပတ်ချိန် type ပြောင်းလဲခြင်း) တွေကို သတ်မှတ်ဖို့လည်း သုံးနိုင်ပါတယ်။ Syntax ရှုပ်ထွေးမှု မဖြစ်အောင် — `type 'string'` syntax ကို ရိုးရှင်းတဲ့ literal constant တစ်ခုရဲ့ type ကို သတ်မှတ်ဖို့ပဲ သုံးလို့ရပါတယ်။ `type 'string'` syntax ရဲ့ နောက်ထပ် ကန့်သတ်ချက်တစ်ခုက — array type တွေအတွက် အလုပ်မလုပ်တာပါ — array constant တစ်ခုရဲ့ type ကို သတ်မှတ်ဖို့ `::` သို့မဟုတ် `CAST()` ကို သုံးပါ။

`CAST()` syntax က SQL နဲ့ ကိုက်ညီပါတယ်။ `type 'string'` syntax ကတော့ standard ရဲ့ ယေဘုယျပြုမှု (generalization) တစ်ခုပါ — SQL က ဒီ syntax ကို data type အနည်းငယ်အတွက်ပဲ သတ်မှတ်ပေးပေမယ့် — PostgreSQL ကတော့ type အားလုံးအတွက် ခွင့်ပြုပါတယ်။ `::` နဲ့ တွဲတဲ့ syntax က သမိုင်းဝင် PostgreSQL သုံးနှုန်းမှု ဖြစ်ပြီး — function-call syntax လည်း အလားတူပဲ ဖြစ်ပါတယ်။

### 4.1.3. Operators (operator များ)

Operator နာမည်တစ်ခုက — အောက်ပါ စာရင်းထဲက character တွေနဲ့ ဖွဲ့စည်းထားပြီး — `NAMEDATALEN`-1 (default အရ 63) အထိ ရှည်နိုင်ပါတယ်:

+ - * / < > = ~ ! @ # % ^ & | ` ?

တကယ်တော့ operator နာမည်တွေအတွက် ကန့်သတ်ချက် အနည်းငယ် ရှိပါတယ်:

- -- နဲ့ /* တို့က operator နာမည်တစ်ခုရဲ့ ဘယ်နေရာမှာမှ မပါဝင်နိုင်ပါဘူး — အကြောင်းကတော့ သူတို့ကို comment တစ်ခုရဲ့ အစအဖြစ် မှတ်ယူခံရလို့ပါ။
- Multiple-character (စာလုံးများစွာပါ) operator နာမည်တစ်ခုက + ဒါမှမဟုတ် - နဲ့ အဆုံးမသတ်နိုင်ပါဘူး — နာမည်ထဲမှာ အောက်ပါ character တွေထဲက အနည်းဆုံး တစ်ခု ပါဝင်နေမှသာ ရပါတယ်:
  
  
              ~ ! @ # % ^ & | ` ?
  
  ဥပမာ — @- က ခွင့်ပြုထားတဲ့ operator နာမည်တစ်ခု ဖြစ်ပေမယ့် — *- ကတော့ မဟုတ်ပါဘူး။ ဒီကန့်သတ်ချက်က — PostgreSQL က SQL နဲ့ ကိုက်ညီတဲ့ query တွေကို token တွေကြားမှာ space မလိုအပ်ဘဲ parse လုပ်နိုင်အောင် လုပ်ပေးပါတယ်။

Non-SQL-standard operator နာမည်တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — ရှုပ်ထွေးမှု မဖြစ်အောင် ကပ်နေတဲ့ operator တွေကို space တွေနဲ့ ခြားဖို့ များသောအားဖြင့် လိုအပ်ပါတယ်။ ဥပမာ — `@` လို့ အမည်ရတဲ့ prefix operator တစ်ခု သတ်မှတ်ထားရင် — `X*@Y` လို့ မရေးနိုင်ပါဘူး — PostgreSQL က အဲဒါကို operator နာမည် နှစ်ခုမဟုတ်ဘဲ တစ်ခုတည်းအဖြစ် ဖတ်မိမှာ မဟုတ်အောင် — `X* @Y` လို့ ရေးရပါမယ်။

### 4.1.4. Special Characters (အထူး သင်္ကေတ စာလုံးများ)

Alphanumeric (စာလုံးနဲ့ ဂဏန်း) မဟုတ်တဲ့ character တချို့က — operator တစ်ခုအနေနဲ့ မဟုတ်ဘဲ — အထူး အဓိပ္ပာယ် တစ်မျိုးစီ ရှိပါတယ်။ အသုံးပြုပုံ အသေးစိတ်တွေကို — သက်ဆိုင်ရာ syntax element တစ်ခုချင်းစီကို ဖော်ပြထားတဲ့ နေရာတွေမှာ တွေ့နိုင်ပါတယ်။ ဒီ section က — ဒီ character တွေ ရှိနေကြောင်း အသိပေးပြီး — သူတို့ရဲ့ ရည်ရွယ်ချက်တွေကို အကျဉ်းချုပ် ဖော်ပြဖို့အတွက်ပဲ ရှိပါတယ်။

- Dollar sign ($) တစ်ခု နောက်မှာ ဂဏန်းတွေ လိုက်ရင် — function definition တစ်ခု ဒါမှမဟုတ် prepared statement (ကြိုတင်ပြင်ဆင် သိမ်းဆည်းထားသော statement) တစ်ခုရဲ့ body ထဲမှာ positional parameter (နေရာအလိုက် parameter) တစ်ခုကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ တခြား အခြေအနေတွေမှာတော့ dollar sign က identifier တစ်ခု ဒါမှမဟုတ် dollar-quoted string constant တစ်ခုရဲ့ အစိတ်အပိုင်း ဖြစ်နိုင်ပါတယ်။
- Parentheses (()) တွေက — expression တွေကို အုပ်စုဖွဲ့ပြီး precedence (ဦးစားပေး အစဉ်) ကို အတင်းအကျပ် သတ်မှတ်တဲ့ ပုံမှန် အဓိပ္ပာယ်နဲ့ သုံးပါတယ်။ အချို့သော အခြေအနေတွေမှာ parentheses တွေက SQL command တစ်ခုရဲ့ ပုံသေ syntax ရဲ့ အစိတ်အပိုင်းအနေနဲ့ လိုအပ်ပါတယ်။
- Brackets ([]) တွေကို array တစ်ခုရဲ့ element တွေကို ရွေးချယ်ဖို့ သုံးပါတယ်။ Array တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် အပိုင်း 8.15 ကို ကြည့်ပါ။
- Commas (,) တွေကို syntax တည်ဆောက်မှု (construct) အချို့မှာ list တစ်ခုရဲ့ element တွေကို ခြားနားဖို့ သုံးပါတယ်။
- Semicolon (;) က SQL command တစ်ခုကို အဆုံးသတ်ပါတယ်။ သူ့ကို command တစ်ခုရဲ့ အတွင်းမှာ ဘယ်နေရာမှာမှ မပါဝင်နိုင်ပါဘူး — string constant တစ်ခု ဒါမှမဟုတ် quoted identifier တစ်ခုရဲ့ အတွင်းကလွဲရင်။
- Colon (:) ကို array တွေကနေ “slice” (အပိုင်းအစ) တွေကို ရွေးချယ်ဖို့ သုံးပါတယ်။ (အပိုင်း 8.15 ကို ကြည့်ပါ။) SQL dialect အချို့မှာ (ဥပမာ — Embedded SQL) — colon ကို variable နာမည်တွေရဲ့ ရှေ့မှာ prefix (ရှေ့ဆက်) အနေနဲ့ သုံးပါတယ်။
- Asterisk (*) ကို အချို့သော context တွေမှာ — table row တစ်ခု ဒါမှမဟုတ် composite value တစ်ခုရဲ့ field အားလုံးကို ဖော်ပြဖို့ သုံးပါတယ်။ သူ့ကို aggregate function တစ်ခုရဲ့ argument အနေနဲ့ သုံးတဲ့အခါမှာလည်း အထူး အဓိပ္ပာယ် ရှိပါတယ် — အဲဒါက aggregate က explicit parameter ဘာမှ မလိုအပ်ဘူးဆိုတာကို ဖော်ပြတာပါ။
- Period (.) ကို numeric constant တွေမှာ သုံးပြီး — schema, table နဲ့ column နာမည်တွေကို ခြားနားဖို့လည်း သုံးပါတယ်။

### 4.1.5. Comments (comment ရေးသားခြင်း)

Comment ဆိုတာ — double dash (--) နှစ်ခုနဲ့ စပြီး — စာကြောင်းရဲ့ အဆုံးအထိ ဆက်သွားတဲ့ character အစီအစဉ်တစ်ခုပါ။ ဥပမာ:

```sql
-- This is a standard SQL comment
```

တနည်းအားဖြင့် — C-style block comment တွေကိုလည်း သုံးလို့ရပါတယ်:

```sql
/* multiline comment
 * with nesting: /* nested block comment */
 */
```

ဒီမှာ comment က `/*` နဲ့ စပြီး — ကိုက်ညီတဲ့ `*/` ပေါ်လာတဲ့ နေရာအထိ ဆက်သွားပါတယ်။ ဒီ block comment တွေက — C နဲ့ မတူဘဲ — SQL standard မှာ သတ်မှတ်ထားသလို — အသိုက်လိုက် (nest) လုပ်လို့ရပါတယ်။ ဒါကြောင့် ရှိပြီးသား block comment တွေ ပါဝင်နိုင်တဲ့ code တုံးကြီးတွေကိုပါ comment လုပ်ထားလို့ ရပါတယ်။

Comment တစ်ခုကို နောက်ထပ် syntax ခွဲခြမ်းစိတ်ဖြာမှု (syntax analysis) မလုပ်ခင် input stream ကနေ ဖယ်ရှားပြီး — whitespace နဲ့ အစားထိုးလိုက်သလိုမျိုး ထိရောက်စွာ သက်ရောက်ပါတယ်။

### 4.1.6. Operator Precedence (operator ဦးစားပေးအစဉ်)

[ဇယား 4.2](/docs/postgresql/sql-syntax-lexical) က PostgreSQL ထဲက operator တွေရဲ့ precedence (ဦးစားပေး အစဉ်) နဲ့ associativity (ပေါင်းစည်းမှု ဦးတည်ချက်) ကို ပြသပါတယ်။ Operator အများစုက precedence အတူတူ ရှိပြီး — left-associative (ဘယ်ဘက်မှ စတင် ပေါင်းစည်းသွားသော) ဖြစ်ပါတယ်။ Operator တွေရဲ့ precedence နဲ့ associativity က parser ထဲမှာ ပုံသေ (hard-wired) ထည့်သွင်းထားပါတယ်။ Operator အများအပြား ပါဝင်တဲ့ expression တစ်ခုကို — precedence စည်းမျဉ်းတွေ ရည်ရွယ်ထားတာထက် တခြားနည်းနဲ့ parse လုပ်စေချင်ရင် — parentheses ထည့်ပါ။

**ဇယား 4.2. Operator Precedence (operator ဦးစားပေး အစဉ် — အမြင့်ဆုံးမှ အနိမ့်ဆုံးအထိ)**

| Operator/Element | Associativity | Description |
| --- | --- | --- |
| `.` | left | table/column နာမည် ခြားနားပေးသော separator |
| `::` | left | PostgreSQL ပုံစံ typecast (type ပြောင်းလဲခြင်း) |
| `[` `]` | left | array element ရွေးချယ်ခြင်း |
| `+` `-` | right | unary plus (တစ်ဖက်သတ် ပေါင်းခြင်း), unary minus (တစ်ဖက်သတ် နုတ်ခြင်း) |
| `COLLATE` | left | collation ရွေးချယ်ခြင်း |
| `AT` | left | `AT TIME ZONE`, `AT LOCAL` |
| `^` | left | exponentiation (ထပ်ကိန်း တွက်ခြင်း) |
| `*` `/` `%` | left | multiplication (မြှောက်ခြင်း), division (စားခြင်း), modulo (အကြွင်း ရှာခြင်း) |
| `+` `-` | left | addition (ပေါင်းခြင်း), subtraction (နုတ်ခြင်း) |
| (အခြား operator များ) | left | ကျန် native နှင့် user-defined operator များ အားလုံး |
| `BETWEEN` `IN` `LIKE` `ILIKE` `SIMILAR` |  | range containment (အကွာအဝေး အကျုံးဝင်မှု), set membership (set ဝင်မှု), string matching (string ကိုက်ညီမှု) |
| `<` `>` `=` `<=` `>=` `<>` |  | comparison (နှိုင်းယှဉ်ခြင်း) operator များ |
| `IS` `ISNULL` `NOTNULL` |  | `IS TRUE`, `IS FALSE`, `IS NULL`, `IS DISTINCT FROM`, စသည် |
| `NOT` | right | logical negation (ယုတ္တိ ဆန့်ကျင်မှု) |
| `AND` | left | logical conjunction (ယုတ္တိ ပေါင်းစပ်မှု) |
| `OR` | left | logical disjunction (ယုတ္တိ ခွဲထွက်မှု) |

Operator precedence စည်းမျဉ်းတွေက — အပေါ်မှာ ဖော်ပြခဲ့တဲ့ built-in operator တွေနဲ့ နာမည်တူတဲ့ user-defined operator တွေအပေါ်မှာလည်း သက်ရောက်တယ်ဆိုတာ သတိပြုပါ။ ဥပမာ — custom data type တစ်ခုအတွက် “+” operator တစ်ခု သတ်မှတ်လိုက်ရင် — သင့် operator က ဘာပဲ လုပ်လုပ် — built-in “+” operator ရဲ့ precedence အတိုင်းပဲ ရှိပါလိမ့်မယ်။

Schema-qualified operator နာမည်တစ်ခုကို `OPERATOR` syntax ထဲမှာ သုံးတဲ့အခါ — ဥပမာ အောက်မှာ ပြထားသလိုပါ:

```sql
SELECT 3 OPERATOR(pg_catalog.+) 4;
```

`OPERATOR` construct ကို — [ဇယား 4.2](/docs/postgresql/sql-syntax-lexical) ထဲမှာ “အခြား operator” အတွက် ပြထားတဲ့ default precedence ရှိတယ်လို့ မှတ်ယူပါတယ်။ `OPERATOR()` ရဲ့ အတွင်းမှာ ဘယ် operator တိကျတိကျ ပါဝင်နေပါစေ — ဒါက အမြဲတမ်း မှန်ကန်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL 9.5 မတိုင်ခင် ဗားရှင်းတွေက နည်းနည်း ကွဲပြားတဲ့ operator precedence စည်းမျဉ်းတွေ သုံးခဲ့ပါတယ်။ အထူးသဖြင့် — `<=`, `>=` နဲ့ `<>` တို့ကို generic operator တွေအနေနဲ့ သတ်မှတ်ခဲ့ပြီး — `IS` test တွေက precedence ပိုမြင့်ခဲ့ပါတယ် — `NOT BETWEEN` နဲ့ ဆက်စပ်တဲ့ construct တွေကလည်း — အချို့သော အခြေအနေတွေမှာ `BETWEEN` ရဲ့ precedence အစား `NOT` ရဲ့ precedence ရှိတယ်လို့ မှတ်ယူခံရတာမျိုးနဲ့ — မညီညွတ်စွာ ပြုမူခဲ့ပါတယ်။ ဒီစည်းမျဉ်းတွေကို — SQL standard နဲ့ ပိုကောင်းအောင် ကိုက်ညီစေဖို့နဲ့ ယုတ္တိအရ ညီမျှတဲ့ construct တွေကို မညီညွတ်စွာ ဆက်ဆံတာကြောင့် ဖြစ်ပေါ်တဲ့ ရှုပ်ထွေးမှုတွေ လျှော့ချဖို့ — ပြောင်းလဲခဲ့ပါတယ်။ အခြေအနေ အများစုမှာ — ဒီပြောင်းလဲမှုတွေက အပြုအမူ ပြောင်းလဲမှု ဘာမှ ဖြစ်စေမှာ မဟုတ်ပါဘူး — ဒါမှမဟုတ် “no such operator” ဆိုတဲ့ failure တွေ ဖြစ်စေနိုင်ပြီး — အဲဒါတွေကို parentheses ထည့်သွင်းပြီး ဖြေရှင်းလို့ရပါတယ်။ ဒါပေမယ့် — parse error ဘာမှ မတင်ပြဘဲ query တစ်ခုရဲ့ အပြုအမူ ပြောင်းလဲသွားနိုင်တဲ့ corner case (ဘေးဘောင်အစွန်း အခြေအနေ) တွေကတော့ ရှိပါတယ်။
