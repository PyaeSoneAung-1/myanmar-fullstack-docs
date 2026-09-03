---
title: "Composite Types (composite type များ)"
description: "Composite type (row/record တစ်ခု၏ ဖွဲ့စည်းပုံ) အကြောင်း — composite type ကြေညာခြင်း၊ composite value (ROW) တည်ဆောက်ခြင်း၊ field များ ဝင်ရောက်/ပြုပြင်ခြင်း၊ query များတွင် အသုံးပြုခြင်းနှင့် input/output syntax"
order: 63
source: "https://www.postgresql.org/docs/current/rowtypes.html"
status: translated
updated: 2026-09-03
---

## 8.16. Composite Types (composite type များ)

- **8.16.1. Declaration of Composite Types (composite type များ ကြေညာခြင်း)**
- **8.16.2. Constructing Composite Values (composite value များ တည်ဆောက်ခြင်း)**
- **8.16.3. Accessing Composite Types (composite type များ၏ field များကို ဝင်ရောက်ခြင်း)**
- **8.16.4. Modifying Composite Types (composite type များ ပြုပြင်ခြင်း)**
- **8.16.5. Using Composite Types in Queries (query များတွင် composite type များ အသုံးပြုခြင်း)**
- **8.16.6. Composite Type Input and Output Syntax (composite type ၏ input နှင့် output syntax)**

*Composite type* ဆိုတာ — row တစ်ခု သို့မဟုတ် record တစ်ခုရဲ့ ဖွဲ့စည်းပုံ (structure) ကို ကိုယ်စားပြုတဲ့ type တစ်ခု ဖြစ်ပါတယ်; အခြေခံအားဖြင့် ၎င်းက field name တွေနဲ့ ၎င်းတို့ရဲ့ data type တွေရဲ့ စာရင်းတစ်ခုပဲ ဖြစ်ပါတယ်။ PostgreSQL က composite type တွေကို — ရိုးရှင်းတဲ့ type တွေကို သုံးနိုင်တဲ့ နည်းလမ်း အများအပြားမှာပဲ — သုံးခွင့် ပြုပါတယ်။ ဥပမာ — table တစ်ခုရဲ့ column တစ်ခုကို composite type တစ်ခုအနေနဲ့ ကြေညာလို့ ရပါတယ်။

### 8.16.1. Declaration of Composite Types (composite type များ ကြေညာခြင်း)

Composite type တွေ သတ်မှတ်ခြင်းရဲ့ ရိုးရှင်းတဲ့ ဥပမာ နှစ်ခုကို ကြည့်ရအောင်:

```sql
CREATE TYPE complex AS (
    r       double precision,
    i       double precision
);

CREATE TYPE inventory_item AS (
    name            text,
    supplier_id     integer,
    price           numeric
);
```

ဒီ syntax က `CREATE TABLE` နဲ့ ဆင်တူပါတယ် — ဒါပေမယ့် field name တွေနဲ့ type တွေကိုပဲ သတ်မှတ်လို့ ရပြီး — လောလောဆယ်မှာတော့ constraint တွေ (`NOT NULL` လိုမျိုး) ထည့်သွင်းလို့ မရပါဘူး။ `AS` key word က မဖြစ်မနေ လိုအပ်တယ်ဆိုတာ သတိပြုပါ; ၎င်းမပါရင် — system က တခြား ပုံစံမျိုးရဲ့ `CREATE TYPE` command တစ်ခုလို့ ထင်မှတ်ပြီး — ထူးဆန်းတဲ့ syntax error တွေ ရပါလိမ့်မယ်။

Type တွေ သတ်မှတ်ပြီးတာနဲ့ — table တွေ ဖန်တီးဖို့ ၎င်းတို့ကို သုံးနိုင်ပါတယ်:

```sql
CREATE TABLE on_hand (
    item      inventory_item,
    count     integer
);

INSERT INTO on_hand VALUES (ROW('fuzzy dice', 42, 1.99), 1000);
```

ဒါမှမဟုတ် function တွေ ဖန်တီးဖို့:

```sql
CREATE FUNCTION price_extension(inventory_item, integer) RETURNS numeric
AS 'SELECT $1.price * $2' LANGUAGE SQL;

SELECT price_extension(item, 10) FROM on_hand;
```

Table တစ်ခု ဖန်တီးတိုင်း — table ရဲ့ row type ကို ကိုယ်စားပြုဖို့ — table နဲ့ နာမည်တူတဲ့ composite type တစ်ခုကိုလည်း အလိုအလျောက် ဖန်တီးပေးပါတယ်။ ဥပမာ — ဒီလိုမျိုး ရေးခဲ့မယ်ဆိုရင်:

```sql
CREATE TABLE inventory_item (
    name            text,
    supplier_id     integer REFERENCES suppliers,
    price           numeric CHECK (price > 0)
);
```

ဒါဆိုရင် အပေါ်မှာ ပြထားတဲ့ `inventory_item` composite type ကိုယ်တိုင်က ဘေးထွက် ရလဒ် (byproduct) အနေနဲ့ ပေါ်ပေါက်လာပြီး — အပေါ်မှာ ပြထားသလိုပဲ သုံးလို့ ရပါတယ်။ ဒါပေမယ့် လက်ရှိ implementation ရဲ့ အရေးကြီးတဲ့ ကန့်သတ်ချက် တစ်ခုကိုတော့ သတိပြုပါ: composite type တစ်ခုနဲ့ ဆက်စပ်ထားတဲ့ constraint တွေ မရှိတာကြောင့် — table definition ထဲမှာ ပြထားတဲ့ constraint တွေက table အပြင်ဘက်မှာ ရှိတဲ့ composite type ရဲ့ တန်ဖိုးတွေကို သက်ရောက်မှု မရှိပါဘူး။ (ဒါကို ရှောင်လွှဲဖို့ — composite type ပေါ်မှာ [domain](https://www.postgresql.org/docs/current/glossary.html#GLOSSARY-DOMAIN) (data type တစ်ခုပေါ် အခြေခံကာ constraint များ ထပ်ဖြည့်နိုင်သော type) တစ်ခုကို ဖန်တီးပြီး — လိုချင်တဲ့ constraint တွေကို domain ရဲ့ `CHECK` constraint တွေအနေနဲ့ အသုံးချပါ။)

### 8.16.2. Constructing Composite Values (composite value များ တည်ဆောက်ခြင်း)

Composite value တစ်ခုကို literal constant (စာသားအတိုင်း ရေးသော ကိန်းသေတန်ဖိုး) အနေနဲ့ ရေးဖို့ — field value တွေကို parentheses ထဲမှာ ထည့်ပြီး comma တွေနဲ့ ခြားရေးပါ။ Field value တိုင်းကို double quote တွေနဲ့ ဝိုင်းရံလို့ ရပြီး — ၎င်းထဲမှာ comma သို့မဟုတ် parentheses ပါနေရင် မဖြစ်မနေ ဝိုင်းရံရပါတယ်။ (နောက်ထပ် အသေးစိတ်ကို [အောက်မှာ](/docs/postgresql/rowtypes) ဖော်ပြထားပါတယ်။) ဒါကြောင့် composite constant တစ်ခုရဲ့ ယေဘုယျ ပုံစံက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```sql
'( val1 , val2 , ... )'
```

ဥပမာတစ်ခုကတော့:

```sql
'("fuzzy dice",42,1.99)'
```

ဒါက အပေါ်မှာ သတ်မှတ်ခဲ့တဲ့ `inventory_item` type ရဲ့ valid value (တရားဝင် တန်ဖိုး) တစ်ခု ဖြစ်ပါတယ်။ Field တစ်ခုကို NULL ဖြစ်စေချင်ရင် — list ထဲက ၎င်းရဲ့ နေရာမှာ စာလုံး ဘာမှ မရေးပါနဲ့။ ဥပမာ — ဒီ constant က NULL ဖြစ်တဲ့ တတိယ field တစ်ခုကို သတ်မှတ်ပါတယ်:

```sql
'("fuzzy dice",42,)'
```

NULL အစား empty string (စာလုံးမဲ့ string) တစ်ခုကို လိုချင်ရင် — double quotes တွေ ရေးပါ:

```sql
'("",42,)'
```

ဒီမှာ ပထမ field က NULL မဟုတ်တဲ့ empty string ဖြစ်ပြီး — တတိယ field ကတော့ NULL ပါ။

(ဒီ constant တွေက တကယ်တော့ [အပိုင်း 4.1.2.7](/docs/postgresql/sql-syntax-lexical) မှာ ဆွေးနွေးထားတဲ့ generic type constants (type သတ်မှတ်ပေးရသော ယေဘုယျ ကိန်းသေတန်ဖိုးများ) တွေရဲ့ အထူးကိစ္စ (special case) တစ်ခုပဲ ဖြစ်ပါတယ်။ Constant ကို ကနဦးမှာ string တစ်ခုအနေနဲ့ သဘောထားပြီး — composite type ရဲ့ input conversion routine (ဝင်လာသော တန်ဖိုးကို ပြောင်းလဲပေးသော လုပ်ရိုးလုပ်စဉ်) ဆီ ပို့ပါတယ်။ Constant ကို ဘယ် type အဖြစ် ပြောင်းရမလဲ သတ်မှတ်ဖို့ — explicit type specification (ရှင်းလင်းစွာ type သတ်မှတ်ချက်) တစ်ခု လိုအပ်နိုင်ပါတယ်။)

`ROW` expression syntax ကိုလည်း composite value တွေ တည်ဆောက်ဖို့ သုံးလို့ ရပါတယ်။ ကိစ္စ အများစုမှာ ဒါက string-literal syntax ထက် သိသိသာသာ သုံးရ လွယ်ပါတယ် — အကြောင်းကတော့ quoting (ကိုးကား အမှတ်အသား) အလွှာ မျိုးစုံအတွက် စိုးရိမ်စရာ မလိုလို့ပါ။ ဒီနည်းကို အပေါ်မှာ ကျွန်ုပ်တို့ သုံးပြီးသား ဖြစ်ပါတယ်:

```sql
ROW('fuzzy dice', 42, 1.99)
ROW('', 42, NULL)
```

`ROW` key word က expression ထဲမှာ field တစ်ခုထက်ပို ရှိနေသရွေ့တော့ တကယ်တော့ optional ပါ — ဒါကြောင့် ဒါတွေကို ဒီလိုမျိုး ရိုးရှင်းအောင် ရေးလို့ ရပါတယ်:

```sql
('fuzzy dice', 42, 1.99)
('', 42, NULL)
```

`ROW` expression syntax ကို [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ပိုပြီး အသေးစိတ် ဆွေးနွေးထားပါတယ်။

### 8.16.3. Accessing Composite Types (composite type များ၏ field များကို ဝင်ရောက်ခြင်း)

Composite column တစ်ခုရဲ့ field တစ်ခုကို ဝင်ရောက်ဖို့ — table name တစ်ခုကနေ field ရွေးတာနဲ့ ဆင်ဆင်ပဲ — dot နဲ့ field name ကို ရေးပါတယ်။ တကယ်တော့ ဒါက table name ကနေ ရွေးတာနဲ့ အရမ်းတူလို့ — parser ကို မရှုပ်ထွေးအောင် — မကြာခဏဆိုသလို parentheses တွေ သုံးရပါတယ်။ ဥပမာ — ကျွန်ုပ်တို့ရဲ့ `on_hand` ဥပမာ table ကနေ subfield (အတွင်းပိုင်း field) တချို့ကို ဒီလိုမျိုး select လုပ်ဖို့ ကြိုးစားချင်နိုင်ပါတယ်:

```sql
SELECT item.name FROM on_hand WHERE item.price > 9.99;
```

ဒါက အလုပ်မလုပ်ပါဘူး — အကြောင်းကတော့ SQL syntax စည်းမျဉ်းတွေအရ — `item` ဆိုတဲ့ နာမည်ကို `on_hand` ရဲ့ column name အဖြစ် မဟုတ်ဘဲ — table name တစ်ခုအနေနဲ့ ယူဆလို့ပါ။ ဒီလိုမျိုး ရေးရပါတယ်:

```sql
SELECT (item).name FROM on_hand WHERE (item).price > 9.99;
```

ဒါမှမဟုတ် table name ကိုပါ ထည့်သုံးဖို့ လိုရင် (ဥပမာ — table အများအပြား ပါဝင်တဲ့ query တစ်ခုမှာ) — ဒီလိုမျိုး ရေးပါ:

```sql
SELECT (on_hand.item).name FROM on_hand WHERE (on_hand.item).price > 9.99;
```

အခုတော့ parentheses ထဲ ထည့်ထားတဲ့ object ကို `item` column ဆီ ရည်ညွှန်းချက် (reference) တစ်ခုအနေနဲ့ မှန်ကန်စွာ အဓိပ္ပာယ် ကောက်ယူပြီး — ၎င်းကနေ subfield ကို ရွေးထုတ်လို့ ရပါတယ်။

Composite value တစ်ခုကနေ field တစ်ခု ရွေးတဲ့အခါတိုင်းမှာလည်း — အလားတူ syntax ဆိုင်ရာ ပြဿနာတွေ သက်ရောက်ပါတယ်။ ဥပမာ — composite value တစ်ခု ပြန်ပေးတဲ့ function တစ်ခုရဲ့ ရလဒ်ကနေ field တစ်ခုတည်းကို ရွေးချင်ရင် — ဒီလိုမျိုး ရေးဖို့ လိုပါတယ်:

```sql
SELECT (my_func(...)).field FROM ...
```

အပိုထည့်ထားတဲ့ parentheses တွေ မပါရင် — ဒါက syntax error တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။

`*` ဆိုတဲ့ အထူး field name က “field အားလုံး” လို့ ဆိုလိုပြီး — [အပိုင်း 8.16.5](/docs/postgresql/rowtypes) မှာ ထပ်ပြီး ရှင်းပြထားပါတယ်။

### 8.16.4. Modifying Composite Types (composite type များ ပြုပြင်ခြင်း)

Composite column တွေထဲကို ထည့်သွင်းခြင်းနဲ့ update လုပ်ခြင်းအတွက် သင့်လျော်တဲ့ syntax ရဲ့ ဥပမာတချို့ ဒီမှာ ဖော်ပြပါမယ်။ ပထမဆုံး — column တစ်ခုလုံးကို ထည့်သွင်း သို့မဟုတ် update လုပ်ခြင်း:

```sql
INSERT INTO mytab (complex_col) VALUES((1.1,2.2));

UPDATE mytab SET complex_col = ROW(1.1,2.2) WHERE ...;
```

ပထမ ဥပမာက `ROW` ကို ချန်လိုက်ပြီး — ဒုတိယ ဥပမာကတော့ သုံးထားပါတယ်; နည်းနှစ်နည်းလုံးနဲ့ပဲ လုပ်လို့ ရပါတယ်။

Composite column တစ်ခုရဲ့ subfield တစ်ခုချင်းစီကိုလည်း update လုပ်လို့ ရပါတယ်:

```sql
UPDATE mytab SET complex_col.r = (complex_col).r + 1 WHERE ...;
```

ဒီမှာ `SET` ရဲ့ နောက်မှာ လိုက်တဲ့ column name ကို parentheses တွေနဲ့ ဝိုင်းရံဖို့ မလိုအပ်ဘူး (တကယ်တော့ မဝိုင်းရံနိုင်ဘူး) ဆိုတာ သတိပြုပါ — ဒါပေမယ့် equal sign ရဲ့ ညာဘက်က expression ထဲမှာ အဲဒီ column တစ်ခုတည်းကို ရည်ညွှန်းတဲ့အခါမှာတော့ parentheses တွေ လိုအပ်ပါတယ်။

ပြီးတော့ `INSERT` အတွက် target (ဦးတည်ရာ) တွေအနေနဲ့ subfield တွေကိုလည်း သတ်မှတ်လို့ ရပါတယ်:

```sql
INSERT INTO mytab (complex_col.r, complex_col.i) VALUES(1.1, 2.2);
```

Column ရဲ့ subfield တွေ အားလုံးအတွက် တန်ဖိုးတွေ မပေးခဲ့ဘူးဆိုရင် — ကျန်ရှိနေတဲ့ subfield တွေကို null value တွေနဲ့ ဖြည့်ပေးပါလိမ့်မယ်။

### 8.16.5. Using Composite Types in Queries (query များတွင် composite type များ အသုံးပြုခြင်း)

Query တွေထဲမှာ composite type တွေနဲ့ ဆက်စပ်နေတဲ့ အထူး syntax စည်းမျဉ်းတွေနဲ့ အပြုအမူ အမျိုးမျိုး ရှိပါတယ်။ ဒီစည်းမျဉ်းတွေက အသုံးဝင်တဲ့ shortcut တွေ (တိုတောင်းသော နည်းလမ်းများ) ပေးစွမ်းပေမယ့် — နောက်ကွယ်က ယုတ္တိကို မသိရင် ရှုပ်ထွေးစေနိုင်ပါတယ်။

PostgreSQL မှာ query တစ်ခုထဲက table name (သို့မဟုတ် alias) ဆီ ရည်ညွှန်းချက်တစ်ခုက — ထိရောက်စွာ ဆိုရရင် — အဲဒီ table ရဲ့ လက်ရှိ row ရဲ့ composite value ဆီ ရည်ညွှန်းချက်တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ — [အထက်မှာ](/docs/postgresql/rowtypes) ပြထားသလို `inventory_item` table တစ်ခု ရှိခဲ့မယ်ဆိုရင် — ဒီလိုမျိုး ရေးလို့ ရပါတယ်:

```sql
SELECT c FROM inventory_item c;
```

ဒီ query က composite type ဖြစ်တဲ့ column တစ်ခုတည်းကို ထုတ်ပေးလို့ — ဒီလိုမျိုး output တစ်ခု ရနိုင်ပါတယ်:

```sql
           c
------------------------
 ("fuzzy dice",42,1.99)
(1 row)
```

ဒါပေမယ့် — ရိုးရှင်းတဲ့ နာမည်တွေကို table name တွေထက် column name တွေနဲ့ အရင်ဆုံး ကိုက်ညီအောင် လုပ်တာကို သတိပြုပါ — ဒါကြောင့် ဒီဥပမာက query ရဲ့ table တွေထဲမှာ `c` လို့ နာမည်တပ်ထားတဲ့ column မရှိလို့မှသာ အလုပ်လုပ်တာ ဖြစ်ပါတယ်။

သာမန် qualified-column-name syntax ဖြစ်တဲ့ `table_name``.``column_name` ကို — table ရဲ့ လက်ရှိ row ရဲ့ composite value အပေါ်မှာ [field selection](/docs/postgresql/sql-expressions) (field ရွေးချယ်ခြင်း) ကို အသုံးချတာလို့ နားလည်နိုင်ပါတယ်။ (Efficiency (စွမ်းဆောင်ရည်) အကြောင်းပြချက်တွေကြောင့် — တကယ်တော့ ဒီနည်းအတိုင်း implement လုပ်ထားတာ မဟုတ်ပါဘူး။)

ဒီလိုရေးတဲ့အခါ

```sql
SELECT c.* FROM inventory_item c;
```

SQL standard အရ — table ရဲ့ ပါဝင်မှုတွေကို column တစ်ခုချင်းစီအဖြစ် ချဲ့ထွင်ပြီး ရသင့်ပါတယ်:

```sql
    name    | supplier_id | price
------------+-------------+-------
 fuzzy dice |          42 |  1.99
(1 row)
```

query က ဒီလိုရေးထားသလိုမျိုးပေါ့:

```sql
SELECT c.name, c.supplier_id, c.price FROM inventory_item c;
```

PostgreSQL က ဒီ expansion (ချဲ့ထွင်ခြင်း) အပြုအမူကို ဘယ် composite-valued expression ပေါ်မှာမဆို အသုံးချပါတယ် — [အထက်မှာ](/docs/postgresql/rowtypes) ပြထားသလိုပဲ — `.*` ကို အသုံးချတဲ့ တန်ဖိုးက ရိုးရှင်းတဲ့ table name မဟုတ်ဘူးဆိုရင် — အဲဒီ တန်ဖိုးကို parentheses တွေနဲ့ ဝိုင်းရံဖို့ လိုအပ်ပါတယ်။ ဥပမာ — `myfunc()` က column `a`, `b`, `c` တွေ ပါဝင်တဲ့ composite type တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုဆိုရင် — ဒီ query နှစ်ခုက ရလဒ် အတူတူပါပဲ:

```sql
SELECT (myfunc(x)).* FROM some_table;
SELECT (myfunc(x)).a, (myfunc(x)).b, (myfunc(x)).c FROM some_table;
```

> **အကြံပြုချက်:** PostgreSQL က column expansion ကို — ပထမ ပုံစံကို ဒုတိယ ပုံစံအဖြစ် တကယ် ပြောင်းလဲခြင်းအားဖြင့် — ဆောင်ရွက်ပါတယ်။ ဒါကြောင့် ဒီဥပမာမှာ — syntax နှစ်ခုလုံးနဲ့ဆိုရင် — `myfunc()` က row တစ်ခုစီအတွက် သုံးကြိမ် ခေါ်ယူခံရမှာ ဖြစ်ပါတယ်။ Function က expensive (တွက်ချက်စရိတ် များသော) function တစ်ခုဆိုရင် ဒါကို ရှောင်ချင်နိုင်ပါတယ် — ဒီလိုမျိုး query တစ်ခုနဲ့ ရှောင်လို့ ရပါတယ်:
> 
> ```sql
> SELECT m.* FROM some_table, LATERAL myfunc(x) AS m;
> ```
> 
> Function ကို `LATERAL` `FROM` item တစ်ခုထဲမှာ ထားခြင်းက — row တစ်ခုစီအတွက် တစ်ကြိမ်ထက်ပိုပြီး ခေါ်ယူခံရခြင်းကနေ ကာကွယ်ပေးပါတယ်။ `m.*` က `m.a, m.b, m.c` အဖြစ် ဆက်လက် ချဲ့ထွင်ခံရဆဲပဲ ဖြစ်ပေမယ့် — အခုတော့ အဲဒီ variable တွေက `FROM` item ရဲ့ output ဆီ ရည်ညွှန်းချက်တွေပဲ ဖြစ်ပါတယ်။ (ဒီမှာ `LATERAL` key word က optional ပါ — ဒါပေမယ့် function က `x` ကို `some_table` ကနေ ရယူနေတာကို ရှင်းလင်းစေဖို့ ကျွန်ုပ်တို့ ပြသထားတာပါ။)

`composite_value``.*` ဆိုတဲ့ syntax က — [`SELECT` output list](/docs/postgresql/queries-select-lists) (output စာရင်း)၊ `INSERT`/`UPDATE`/`DELETE`/`MERGE` တွေထဲက [`RETURNING` list](/docs/postgresql/dml-returning)၊ [`VALUES` clause](/docs/postgresql/queries-values) သို့မဟုတ် [row constructor](/docs/postgresql/sql-expressions) (row တည်ဆောက်မှု) တစ်ခုရဲ့ ထိပ်ဆုံး အဆင့်မှာ ပေါ်လာတဲ့အခါ — ဒီလို column expansion ရလဒ်ကို ဖြစ်ပေါ်စေပါတယ်။ တခြား context တွေ အားလုံးမှာတော့ (အဲဒီ construct တွေထဲမှာ အသိုက်လိုက် ထည့်ထားတဲ့ အခါတွေအပါအဝင်) — composite value တစ်ခုပေါ်မှာ `.*` တွဲထည့်တာက တန်ဖိုးကို မပြောင်းလဲစေပါဘူး — အကြောင်းကတော့ ၎င်းက “column အားလုံး” လို့ ဆိုလိုပြီး — composite value တစ်ခုတည်းကိုပဲ နောက်တစ်ကြိမ် ထုတ်လုပ်လို့ပါ။ ဥပမာ — `somefunc()` က composite-valued argument တစ်ခုကို လက်ခံတယ်ဆိုရင် — ဒီ query တွေက အတူတူပါပဲ:

```sql
SELECT somefunc(c.*) FROM inventory_item c;
SELECT somefunc(c) FROM inventory_item c;
```

ကိစ္စ နှစ်ခုလုံးမှာ — `inventory_item` ရဲ့ လက်ရှိ row ကို composite-valued argument တစ်ခုတည်းအနေနဲ့ function ဆီ ပို့ပါတယ်။ ဒီလို ကိစ္စတွေမှာ `.*` က ဘာမှ မလုပ်ပေမယ့် — composite value တစ်ခုကို ရည်ရွယ်ထားတာကို ရှင်းလင်းစေလို့ — ၎င်းကို သုံးတာက ပုံစံကောင်း (good style) တစ်ခုပါ။ အထူးသဖြင့် — parser က `c.*` ထဲက `c` ကို column name မဟုတ်ဘဲ — table name သို့မဟုတ် alias တစ်ခုအဖြစ် မှတ်ယူလို့ — မရှင်းလင်းမှု (ambiguity) လုံးဝ မရှိပါဘူး; `.*` မပါဘဲဆိုရင်တော့ `c` က table name လား column name လား မရှင်းလင်းဘဲ — တကယ်တော့ `c` လို့ နာမည်တပ်ထားတဲ့ column တစ်ခု ရှိနေရင် — column-name အဓိပ္ပာယ်ကောက်ယူမှုကို ဦးစားပေးမှာ ဖြစ်ပါတယ်။

ဒီသဘောတရားတွေကို သရုပ်ပြတဲ့ နောက် ဥပမာတစ်ခုကတော့ — အောက်ပါ query တွေ အားလုံးက အဓိပ္ပာယ် အတူတူပဲ ဖြစ်တာပါ:

```sql
SELECT * FROM inventory_item c ORDER BY c;
SELECT * FROM inventory_item c ORDER BY c.*;
SELECT * FROM inventory_item c ORDER BY ROW(c.*);
```

ဒီ `ORDER BY` clause တွေ အားလုံးက row ရဲ့ composite value ကို သတ်မှတ်ပေးလို့ — [အပိုင်း 9.25.6](https://www.postgresql.org/docs/current/functions-comparisons.html#COMPOSITE-TYPE-COMPARISON) မှာ ဖော်ပြထားတဲ့ စည်းမျဉ်းတွေနဲ့အညီ — row တွေကို စီခြင်း ရလဒ် ထွက်ပေါ်စေပါတယ်။ ဒါပေမယ့် `inventory_item` မှာ `c` လို့ နာမည်တပ်ထားတဲ့ column တစ်ခု ပါဝင်နေခဲ့ရင် — ပထမ ကိစ္စက တခြားဟာတွေနဲ့ ကွဲပြားမှာ ဖြစ်ပါတယ် — အကြောင်းကတော့ ၎င်းက အဲဒီ column တစ်ခုတည်းနဲ့ပဲ စီမှာ ဖြစ်လို့ပါ။ အရင်က ပြထားတဲ့ column name တွေနဲ့ဆိုရင် — ဒီ query တွေကလည်း အပေါ်က ဟာတွေနဲ့ ညီမျှပါတယ်:

```sql
SELECT * FROM inventory_item c ORDER BY ROW(c.name, c.supplier_id, c.price);
SELECT * FROM inventory_item c ORDER BY (c.name, c.supplier_id, c.price);
```

(နောက်ဆုံး ကိစ္စမှာ `ROW` key word ကို ချန်လိုက်တဲ့ row constructor တစ်ခုကို သုံးထားပါတယ်။)

Composite value တွေနဲ့ ဆက်စပ်နေတဲ့ နောက် အထူး syntactical အပြုအမူ တစ်ခုကတော့ — composite value တစ်ခုရဲ့ field တစ်ခုကို ထုတ်ယူရာမှာ *functional notation* (function ပုံစံ သင်္ကေတ) ကို သုံးနိုင်တာပါ။ ရိုးရှင်းစွာ ရှင်းပြရရင် — `field(table)` နဲ့ `table.field` ဆိုတဲ့ notation နှစ်ခုက အပြန်အလှန် လဲသုံးလို့ ရပါတယ်။ ဥပမာ — ဒီ query တွေက ညီမျှပါတယ်:

```sql
SELECT c.name FROM inventory_item c WHERE c.price > 1000;
SELECT name(c) FROM inventory_item c WHERE price(c) > 1000;
```

ထို့ပြင် — composite type တစ်ခုရဲ့ argument တစ်ခုတည်း လက်ခံတဲ့ function တစ်ခု ရှိရင် — ၎င်းကို notation နှစ်မျိုးလုံးနဲ့ ခေါ်ယူလို့ ရပါတယ်။ ဒီ query တွေ အားလုံးက ညီမျှပါတယ်:

```sql
SELECT somefunc(c) FROM inventory_item c;
SELECT somefunc(c.*) FROM inventory_item c;
SELECT c.somefunc FROM inventory_item c;
```

Functional notation နဲ့ field notation ကြားက ဒီညီမျှမှုက — composite type တွေပေါ်မှာ function တွေကို သုံးပြီး “computed fields” (တွက်ချက်ထားသော field များ) တွေကို implement (အကောင်အထည်ဖော်) လုပ်နိုင်စေပါတယ်။ အပေါ်က နောက်ဆုံး query ကို သုံးတဲ့ application တစ်ခုက — `somefunc` က table ရဲ့ အစစ်အမှန် column တစ်ခု မဟုတ်ဘူးဆိုတာကို တိုက်ရိုက် သိစရာ မလိုပါဘူး။

> **အကြံပြုချက်:** ဒီအပြုအမူကြောင့် — composite-type argument တစ်ခုတည်း ယူတဲ့ function တစ်ခုကို — အဲဒီ composite type ရဲ့ field တွေထဲက တစ်ခုခုနဲ့ နာမည်တူ ပေးတာက မသင့်ပါဘူး။ မရှင်းလင်းမှု (ambiguity) ရှိနေရင် — field-name syntax သုံးထားရင် field-name အဓိပ္ပာယ်ကောက်ယူမှုကို ရွေးချယ်မှာ ဖြစ်ပြီး — function-call syntax သုံးထားရင်တော့ function ကို ရွေးချယ်မှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် PostgreSQL 11 မတိုင်ခင် version တွေမှာတော့ — call ရဲ့ syntax က function call တစ်ခု ဖြစ်ဖို့ မဖြစ်မနေ လိုအပ်နေမှသာ လွဲပြီး — အမြဲတမ်း field-name အဓိပ္ပာယ်ကောက်ယူမှုကိုပဲ ရွေးချယ်ပါတယ်။ Version အဟောင်းတွေမှာ function အဓိပ္ပာယ်ကောက်ယူမှုကို အတင်းအကျပ် လုပ်ဖို့ နည်းလမ်းတစ်ခုကတော့ — function name ကို schema-qualify (schema နာမည်နဲ့ ရှေ့ဆွဲ) လုပ်ဖို့ပဲ ဖြစ်ပြီး — `schema.func(compositevalue)` လို့ ရေးပါ။

### 8.16.6. Composite Type Input and Output Syntax (composite type ၏ input နှင့် output syntax)

Composite value တစ်ခုရဲ့ အပြင်ပန်း text representation (စာသား ဖော်ပြမှု) က — field type တစ်ခုချင်းစီအတွက် I/O conversion စည်းမျဉ်းတွေနဲ့အညီ အဓိပ္ပာယ် ကောက်ယူတဲ့ item တွေ — အပြင် — composite ဖွဲ့စည်းပုံကို ညွှန်ပြတဲ့ အလှဆင် သင်္ကေတတွေ (decoration) ပါဝင်ပါတယ်။ အလှဆင် သင်္ကေတတွေက — တန်ဖိုးတစ်ခုလုံးကို ဝိုင်းရံထားတဲ့ parentheses (`(` နဲ့ `)`) — အပြင် — ကပ်လျက် item တွေကြားမှာ ရှိတဲ့ comma (`,`) တွေ ဖြစ်ပါတယ်။ Parentheses အပြင်ဘက်က whitespace (နေရာလွတ်) တွေကို လျစ်လျူရှုပေမယ့် — parentheses အတွင်းဘက်မှာတော့ field value ရဲ့ အစိတ်အပိုင်းတစ်ခုအဖြစ် သတ်မှတ်ပြီး — field ရဲ့ data type အတွက် input conversion စည်းမျဉ်းတွေပေါ် မူတည်ပြီး — အဓိပ္ပာယ် ရှိချင်မှ ရှိပါတယ်။ ဥပမာ:

```sql
'(  42)'
```

ဒီထဲက whitespace က field type က integer ဆိုရင် လျစ်လျူရှုခံရပေမယ့် — text ဆိုရင်တော့ မဟုတ်ပါဘူး။

အရင်က ပြခဲ့သလိုပဲ — composite value တစ်ခု ရေးတဲ့အခါ — field value တစ်ခုချင်းစီကို double quote တွေနဲ့ ဝိုင်းရံလို့ ရပါတယ်။ Field value က composite-value parser ကို ရှုပ်ထွေးစေနိုင်မယ်ဆိုရင် — မဖြစ်မနေ ဝိုင်းရံရပါတယ်။ အထူးသဖြင့် — parentheses, comma, double quote သို့မဟုတ် backslash တွေ ပါဝင်တဲ့ field တွေကို double-quote လုပ်ရပါမယ်။ Quoted composite field value တစ်ခုထဲမှာ double quote သို့မဟုတ် backslash တစ်ခု ထည့်ဖို့ — ၎င်းရဲ့ ရှေ့မှာ backslash တစ်ခု ရှေ့ဆွဲပါ။ (ထို့ပြင် — double-quoted field value တစ်ခုထဲမှာ double quote အတွဲတစ်တွဲကို — SQL literal string တွေထဲမှာ single quote တွေအတွက် စည်းမျဉ်းတွေနဲ့ နှိုင်းယှဉ်နိုင်တဲ့အတိုင်း — double quote character တစ်ခုကို ကိုယ်စားပြုတာအဖြစ် ယူဆပါတယ်။) တနည်းအားဖြင့် — quoting မလုပ်ဘဲ — composite syntax အဖြစ် အဓိပ္ပာယ် ကောက်ယူခံရမယ့် data character တွေ အားလုံးကို ကာကွယ်ဖို့ backslash-escaping ကို သုံးနိုင်ပါတယ်။

လုံးဝ ဗလာ ဖြစ်နေတဲ့ field value (comma တွေ သို့မဟုတ် parentheses တွေကြားမှာ စာလုံး လုံးဝ မရှိတာ) က NULL တစ်ခုကို ကိုယ်စားပြုပါတယ်။ NULL အစား empty string တစ်ခု ဖြစ်တဲ့ တန်ဖိုးတစ်ခုကို ရေးဖို့ — `""` လို့ ရေးပါ။

Composite output routine က — field value တွေက empty string တွေ ဖြစ်နေရင် သို့မဟုတ် parentheses, comma, double quote, backslash ဒါမှမဟုတ် white space တွေ ပါဝင်နေရင် — ၎င်းတို့ကို double quote တွေနဲ့ ဝိုင်းရံပေးပါလိမ့်မယ်။ (White space အတွက် ဒီလိုလုပ်တာက မရှိမဖြစ် မဟုတ်ပေမယ့် — ဖတ်ရ ရှင်းလင်းစေဖို့ အထောက်အကူ ပြုပါတယ်။) Field value တွေထဲမှာ မြှုပ်နှံထားတဲ့ (embedded) double quote တွေနဲ့ backslash တွေကို နှစ်ဆ ထပ်ရေးပေးပါလိမ့်မယ်။

> **မှတ်ချက်:** SQL command တစ်ခုထဲမှာ သင်ရေးလိုက်တာကို — ပထမဆုံး string literal တစ်ခုအနေနဲ့ — ပြီးမှ composite တစ်ခုအနေနဲ့ အဓိပ္ပာယ် ကောက်ယူမယ်ဆိုတာ သတိရပါ။ ဒါက သင်လိုအပ်တဲ့ backslash အရေအတွက်ကို နှစ်ဆ ဖြစ်စေပါတယ် (escape string syntax ကို သုံးတယ်လို့ ယူဆရင်)။ ဥပမာ — composite value တစ်ခုထဲမှာ double quote တစ်ခုနဲ့ backslash တစ်ခု ပါဝင်တဲ့ `text` field တစ်ခုကို ထည့်သွင်းဖို့ — ဒီလိုမျိုး ရေးဖို့ လိုပါတယ်:
> 
> ```sql
> INSERT ... VALUES ('("\"\\")');
> ```
> 
> String-literal processor က backslash အလွှာ တစ်ခုကို ဖယ်ရှားလိုက်လို့ — composite-value parser ဆီ ရောက်တဲ့အခါ `("\"\\")` ပုံစံမျိုး ဖြစ်နေပါတယ်။ နောက်ဆုံးမှာတော့ `text` data type ရဲ့ input routine ဆီ ကျွေးလိုက်တဲ့ string က `"\` ဖြစ်သွားပါတယ်။ (Input routine က backslash တွေကို အထူး သဘောထားတဲ့ data type တစ်ခုနဲ့ အလုပ်လုပ်နေရရင် — ဥပမာ `bytea` — သိမ်းထားတဲ့ composite field ထဲကို backslash တစ်ခု ရဖို့ command ထဲမှာ backslash ရှစ်ခုအထိ လိုအပ်နိုင်ပါတယ်။) Dollar quoting (dollar သင်္ကေတ ကိုးကားခြင်း) — [အပိုင်း 4.1.2.4](/docs/postgresql/sql-syntax-lexical) မှာ ကြည့်ပါ — ကို backslash တွေ နှစ်ဆ လုပ်စရာ မလိုအောင် ရှောင်ရှားဖို့ သုံးနိုင်ပါတယ်။

> **အကြံပြုချက်:** SQL command တွေထဲမှာ composite value တွေ ရေးတဲ့အခါ — `ROW` constructor syntax က composite-literal syntax ထက် ပုံမှန်အားဖြင့် အလုပ်လုပ်ရ ပိုလွယ်ပါတယ်။ `ROW` ထဲမှာ — field value တစ်ခုချင်းစီကို composite တစ်ခုရဲ့ အဖွဲ့ဝင် မဟုတ်တဲ့အခါ ရေးသလိုမျိုးပဲ ရေးပါတယ်။
