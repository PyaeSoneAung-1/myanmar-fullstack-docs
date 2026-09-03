---
title: "Constraints (table data ကန့်သတ်ချက်များ)"
description: "Check, NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, EXCLUDE စတဲ့ constraint တွေနဲ့ table data ကို ကန့်သတ်ချုပ်ချယ်နည်း — column constraint နဲ့ table constraint syntax များ"
order: 23
source: "https://www.postgresql.org/docs/current/ddl-constraints.html"
status: translated
updated: 2026-09-03
---

## 5.5. Constraints (table data ကန့်သတ်ချက်များ)

- **5.5.1. Check Constraints (စစ်ဆေးမှု ကန့်သတ်ချက်များ)**
- **5.5.2. Not-Null Constraints (null မဖြစ်ရေး ကန့်သတ်ချက်များ)**
- **5.5.3. Unique Constraints (ထူးခြားမှု ကန့်သတ်ချက်များ)**
- **5.5.4. Primary Keys (row တွေကို ထူးခြားစေတဲ့ key)**
- **5.5.5. Foreign Keys (တခြား table ရဲ့ row တွေနဲ့ ချိတ်ဆက်တဲ့ key)**
- **5.5.6. Exclusion Constraints (exclusion ကန့်သတ်ချက်များ)**

Data type တွေက table တစ်ခုထဲမှာ သိမ်းလို့ရတဲ့ data အမျိုးအစားကို ကန့်သတ်ဖို့ နည်းလမ်း တစ်ခုပါ။ ဒါပေမယ့် application အများစုအတွက်တော့ သူတို့ ပေးတဲ့ ကန့်သတ်မှုက အကြမ်းဖျင်း ကြမ်းလွန်းပါတယ်။ ဥပမာ — product price (ကုန်ပစ္စည်း ဈေးနှုန်း) တစ်ခု သိမ်းတဲ့ column က positive value (အပေါင်း တန်ဖိုး) တွေကိုပဲ လက်ခံသင့်ပါတယ်။ ဒါပေမယ့် positive ကိန်းတွေကိုပဲ လက်ခံတဲ့ standard data type ဆိုတာ မရှိပါဘူး။ နောက်ထပ် ကိစ္စ တစ်ခုက — column ရဲ့ data ကို တခြား column တွေ ဒါမှမဟုတ် row တွေနဲ့ ဆက်စပ်ပြီး ကန့်သတ်ချင်တာမျိုးပါ။ ဥပမာ — product အချက်အလက်တွေ ပါတဲ့ table တစ်ခုမှာ product number တစ်ခုအတွက် row တစ်ခုပဲ ရှိသင့်ပါတယ်။

ဒီအတွက် SQL က column တွေနဲ့ table တွေအပေါ်မှာ constraint (ကန့်သတ်ချက်) တွေ သတ်မှတ်ခွင့် ပေးပါတယ်။ Constraint တွေနဲ့ သင်ရဲ့ table တွေထဲက data အပေါ် သင်လိုသလောက် ထိန်းချုပ်နိုင်ပါတယ်။ User တစ်ယောက်က constraint တစ်ခုကို ချိုးဖောက်မယ့် data ကို column ထဲ သိမ်းဖို့ ကြိုးစားရင် error (အမှား) တစ်ခု ထွက်ပါတယ်။ Value က default value definition ကနေ လာတာပဲ ဖြစ်ဖြစ် ဒီအတိုင်းပဲ သက်ရောက်ပါတယ်။

### 5.5.1. Check Constraints (စစ်ဆေးမှု ကန့်သတ်ချက်များ)

Check constraint က အသုံးအများဆုံး (အထွေထွေဆုံး) constraint type ပါ။ ဒါက column တစ်ခုထဲက value ဟာ Boolean (truth-value — အမှန်/အမှား တန်ဖိုး) expression တစ်ခုကို ကျေနပ်စေရမယ်လို့ သတ်မှတ်ခွင့် ပေးပါတယ်။ ဥပမာ — product price တွေ positive ဖြစ်ဖို့ လိုအပ်ရင် ဒီလို သုံးနိုင်ပါတယ်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0)
);
```

အပေါ်မှာ မြင်ရတဲ့အတိုင်း — constraint definition က default value definition တွေလိုပဲ data type ရဲ့ နောက်မှာ လာပါတယ်။ Default value တွေနဲ့ constraint တွေကို ကြိုက်ရာ အစီအစဉ်နဲ့ စာရင်းပြုလို့ ရပါတယ်။ Check constraint တစ်ခုက `CHECK` ဆိုတဲ့ key word နဲ့ စပြီး — နောက်မှာ parentheses ထဲက expression တစ်ခု ပါဝင်ပါတယ်။ Check constraint ရဲ့ expression က ဒီလို ကန့်သတ်ခံထားရတဲ့ column ကိုပဲ ပါဝင်စေသင့်ပါတယ် — မပါရင် constraint က အဓိပ္ပာယ် သိပ်မရှိပါဘူး။

Constraint ကို သီးခြား နာမည် တစ်ခုလည်း ပေးလို့ရပါတယ်။ ဒါက error message တွေကို ရှင်းလင်းစေပြီး — constraint ကို ပြောင်းလဲဖို့ လိုအပ်တဲ့အခါ နာမည်နဲ့ ညွှန်းပြနိုင်ပါတယ်။ Syntax က:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CONSTRAINT positive_price CHECK (price > 0)
);
```

ဒါကြောင့် နာမည်ပါတဲ့ constraint တစ်ခု သတ်မှတ်ဖို့ — `CONSTRAINT` key word ပြီးရင် identifier တစ်ခု၊ ပြီးရင် constraint definition ကို ရေးပါ။ (ဒီနည်းနဲ့ constraint နာမည် မသတ်မှတ်ရင် system က သင့်အတွက် နာမည် တစ်ခု ရွေးပေးပါတယ်။)

Check constraint က column အများကြီးကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။ ပုံမှန် price (regular price) နဲ့ ဈေးလျှော့ထားတဲ့ price (discounted price) ကို သိမ်းပြီး — discounted price က regular price ထက် နိမ့်ကြောင်း သေချာစေချင်တယ်ဆိုရင်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0),
    discounted_price numeric CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);
```

ပထမ constraint နှစ်ခုကတော့ အကျွမ်းတဝင် ရှိမယ်ထင်ပါတယ်။ တတိယ တစ်ခုကတော့ syntax အသစ် တစ်ခုကို သုံးထားပါတယ်။ ဒါက column တစ်ခုခုကို တွဲထားတာ မဟုတ်ဘဲ — comma နဲ့ ခွဲထားတဲ့ column list ထဲမှာ သီးခြား item တစ်ခုအနေနဲ့ ပေါ်ပါတယ်။ Column definition တွေနဲ့ ဒီ constraint definition တွေကို ရောပြီး ဘယ်လို အစီအစဉ်မဆို စာရင်းပြုလို့ ရပါတယ်။

ပထမ constraint နှစ်ခုကို column constraints တွေလို့ ခေါ်ပြီး — တတိယ တစ်ခုကတော့ column definition တစ်ခုခုနဲ့မှ သီးခြား ရေးထားလို့ table constraint လို့ ခေါ်ပါတယ်။ Column constraints တွေကို table constraints ပုံစံနဲ့လည်း ရေးလို့ရပြီး — အပြန်အလှန်ကတော့ မဖြစ်နိုင်ပါဘူး။ အကြောင်းက column constraint က သူတွဲထားတဲ့ column ကိုပဲ ရည်ညွှန်းရမှာ ဖြစ်လို့ပါ။ (PostgreSQL က ဒီစည်းမျဉ်းကို အတင်းအကျပ် မလုပ်ဆောင်ပါဘူး — ဒါပေမယ့် သင့်ရဲ့ table definitions တွေ တခြား database systems တွေမှာပါ အလုပ်လုပ်စေချင်ရင် လိုက်နာသင့်ပါတယ်။) အပေါ်က ဥပမာကို ဒီလိုလည်း ရေးလို့ရပါတယ်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric,
    CHECK (price > 0),
    discounted_price numeric,
    CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);
```

ဒါမှမဟုတ် ဒီလိုတောင် ရေးလို့ရပါတယ်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0),
    discounted_price numeric,
    CHECK (discounted_price > 0 AND price > discounted_price)
);
```

ဒါကတော့ ကြိုက်နှစ်သက်ရာ ရွေးချယ်စရာပါ။

Table constraints တွေကိုလည်း column constraints တွေလိုပဲ နာမည် ပေးလို့ရပါတယ်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric,
    CHECK (price > 0),
    discounted_price numeric,
    CHECK (discounted_price > 0),
    CONSTRAINT valid_discount CHECK (price > discounted_price)
);
```

သတိပြုရမှာက — check expression က true ဒါမှမဟုတ် null value ကို အဖြေပေးရင် check constraint က ကျေနပ်မှု ပြည့်စုံပါတယ်။ Expression အများစုက operand တစ်ခုခု null ဆိုရင် null value ကို အဖြေပေးတတ်လို့ — ဒါတွေက ကန့်သတ်ထားတဲ့ column တွေထဲမှာ null values တွေ မရှိအောင် မတားဆီးနိုင်ပါဘူး။ Column တစ်ခုမှာ null values တွေ မပါအောင် သေချာစေချင်ရင် — နောက် section မှာ ဖော်ပြမယ့် not-null constraint ကို သုံးနိုင်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL က စစ်ဆေးနေတဲ့ row အသစ် ဒါမှမဟုတ် update လုပ်ထားတဲ့ row ကလွဲပြီး — တခြား table data တွေကို ရည်ညွှန်းတဲ့ `CHECK` constraints တွေကို မထောက်ပံ့ပါဘူး။ ဒီစည်းမျဉ်းကို ချိုးဖောက်တဲ့ `CHECK` constraint က ရိုးရှင်းတဲ့ စမ်းသပ်မှုတွေမှာ အလုပ်ဖြစ်ပုံ ရပေမယ့် — (ပါဝင်ပတ်သက်နေတဲ့ တခြား row တွေ နောက်ပိုင်း ပြောင်းလဲမှုတွေကြောင့်) constraint ရဲ့ အခြေအနေ false ဖြစ်တဲ့ state ဆီ database မရောက်ဘူးလို့ အာမခံလို့ မရပါဘူး။ ဒါက database dump နဲ့ restore ကို မအောင်မြင်စေနိုင်ပါတယ်။ ပြီးပြည့်စုံတဲ့ database state က constraint နဲ့ ကိုက်ညီနေရင်တောင် — row တွေကို constraint ကို ကျေနပ်စေမယ့် အစီအစဉ်အတိုင်း load မလုပ်မိလို့ restore က မအောင်မြင်နိုင်ပါတယ်။ ဖြစ်နိုင်ရင် — row အချင်းချင်းနဲ့ table အချင်းချင်း ကန့်သတ်မှုတွေကို ဖော်ပြဖို့ `UNIQUE`, `EXCLUDE` ဒါမှမဟုတ် `FOREIGN KEY` constraints တွေကို သုံးပါ။
>
> သင့်ရဲ့ လိုအပ်ချက်က — အချိန်ပြည့် ထိန်းသိမ်းထားတဲ့ consistency အာမခံချက်ထက် — row ထည့်တဲ့အခါ တခြား row တွေကို တစ်ခါတည်း စစ်ဆေးတာမျိုး ဖြစ်ရင် — custom [trigger](https://www.postgresql.org/docs/current/triggers.html) တစ်ခုနဲ့ အကောင်အထည် ဖော်နိုင်ပါတယ်။ (ဒီနည်းလမ်းက dump/restore ပြဿနာကို ရှောင်ပါတယ် — အကြောင်းက pg_dump က data တွေ restore ပြီးမှ trigger တွေကို ပြန်တပ်ဆင်တာမို့ dump/restore အတွင်း ဒီစစ်ဆေးမှုကို အတင်းအကျပ် မလုပ်ဆောင်လို့ပါ။)

> **မှတ်ချက်:** PostgreSQL က `CHECK` constraints တွေရဲ့ conditions တွေကို immutable (မပြောင်းလဲနိုင်သော) အဖြစ် မှတ်ယူပါတယ် — ဆိုလိုတာက input row တူရင် အမြဲတမ်း ရလဒ် အတူတူပါ။ Row တွေ insert ဒါမှမဟုတ် update လုပ်တဲ့အခါမှပဲ `CHECK` constraints တွေကို စစ်ဆေးပြီး — တခြား အချိန်တွေမှာ မစစ်ဆေးတာဟာ ဒီယူဆချက်ကြောင့်ပဲ မျှတပါတယ်။ (အပေါ်က တခြား table data တွေကို မရည်ညွှန်းရဆိုတဲ့ သတိပေးချက်က ဒီကန့်သတ်ချက်ရဲ့ အထူး အခြေအနေ (special case) တစ်ခုပါ။)
>
> ဒီယူဆချက်ကို ဖောက်ဖျက်တတ်တဲ့ နည်းလမ်း တစ်ခုက — `CHECK` expression ထဲမှာ user-defined function တစ်ခုကို ရည်ညွှန်းပြီး — အဲဒီ function ရဲ့ အပြုအမူကို နောက်မှ ပြောင်းလိုက်တာမျိုးပါ။ PostgreSQL က အဲဒါကို တားမြစ်တာ မဟုတ်ပေမယ့် — အခု `CHECK` constraint ကို ချိုးဖောက်နေတဲ့ row တွေ table ထဲမှာ ရှိနေရင်လည်း သူ သတိ မထားမိပါဘူး။ အဲဒါက နောက်ပိုင်း database dump နဲ့ restore ကို မအောင်မြင်စေနိုင်ပါတယ်။ ဒီလို ပြောင်းလဲမှုမျိုးကို ကိုင်တွယ်ဖို့ အကြံပြုထားတဲ့ နည်းလမ်းက — constraint ကို (`ALTER TABLE` သုံးပြီး) drop လုပ်ပြီး — function definition ကို ပြင်ဆင်ပြီး — constraint ကို ပြန်ထည့်တာပါ — ဒါဆို table ထဲက row အားလုံးနဲ့ ပြန်စစ်ဆေးပေးပါတယ်။

### 5.5.2. Not-Null Constraints (null မဖြစ်ရေး ကန့်သတ်ချက်များ)

Not-null constraint က column တစ်ခုမှာ null value မဖြစ်စေရဘူးလို့ ရိုးရိုးရှင်းရှင်း သတ်မှတ်ပေးတာပါ။ Syntax ဥပမာ တစ်ခုက:

```sql
CREATE TABLE products (
    product_no integer NOT NULL,
    name text NOT NULL,
    price numeric
);
```

Explicit (ထင်ရှားတဲ့) constraint နာမည် တစ်ခုကိုလည်း သတ်မှတ်လို့ရပြီး — ဥပမာ:

```sql
CREATE TABLE products (
    product_no integer NOT NULL,
    name text CONSTRAINT products_name_not_null NOT NULL,
    price numeric
);
```

Not-null constraint က အများအားဖြင့် column constraint အနေနဲ့ ရေးလေ့ ရှိပါတယ်။ Table constraint အနေနဲ့ ရေးတဲ့ syntax က:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric,
    NOT NULL product_no,
    NOT NULL name
);
```

ဒါပေမယ့် ဒီ syntax က standard မဟုတ်ဘဲ — အဓိကအားဖြင့် pg_dump အတွက် ရည်ရွယ်ထားတာပါ။

Not-null constraint က `CHECK (column_name IS NOT NULL)` ဆိုတဲ့ check constraint တစ်ခု ဖန်တီးတာနဲ့ လုပ်ဆောင်ချက်အရ ညီမျှပါတယ် — ဒါပေမယ့် PostgreSQL မှာတော့ explicit not-null constraint ကို ဖန်တီးတာက ပိုပြီး ထိရောက်ပါတယ်။

Column တစ်ခုမှာ constraint တစ်ခုထက်ပိုပြီး ရှိနိုင်တာ သေချာပါတယ်။ Constraint တွေကို တစ်ခုပြီးတစ်ခု ဆက်ရေးလိုက်ရုံပါပဲ:

```sql
CREATE TABLE products (
    product_no integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL CHECK (price > 0)
);
```

အစီအစဉ်က အရေးမကြီးပါဘူး။ Constraint တွေကို ဘယ်လို အစီအစဉ်နဲ့ စစ်ဆေးမလဲဆိုတာကိုလည်း အဲဒီအစီအစဉ်က သေချာပေါက် သတ်မှတ်ပေးတာ မဟုတ်ပါဘူး။

ဒါပေမယ့် — column တစ်ခုမှာ explicit not-null constraint ကတော့ အများဆုံး တစ်ခုပဲ ရှိနိုင်ပါတယ်။

`NOT NULL` constraint မှာ အပြန်အလှန် ဖြစ်တဲ့ `NULL` constraint ဆိုတာ ရှိပါတယ်။ ဒါက column က null ဖြစ်ရမယ်လို့ ဆိုလိုတာ မဟုတ်ပါဘူး — အဲဒါဆိုရင် အသုံးမဝင်တော့ဘူးပေါ့။ ဒါအစား — column က null ဖြစ်နိုင်တယ်ဆိုတဲ့ ပုံမှန် အပြုအမူ (default behavior) ကိုပဲ ရွေးချယ်လိုက်တာပါ။ `NULL` constraint က SQL standard ထဲမှာ မပါဝင်လို့ — portable applications တွေမှာ မသုံးသင့်ပါဘူး။ (တချို့ တခြား database systems တွေနဲ့ လိုက်ဖက်ညီအောင်ပဲ PostgreSQL မှာ ထည့်ထားတာပါ။) ဒါပေမယ့် user တချို့ကတော့ — script file တစ်ခုထဲမှာ constraint ကို အဖွင့်အပိတ် (toggle) လုပ်ရတာ လွယ်ကူလို့ ကြိုက်နှစ်သက်ကြပါတယ်။ ဥပမာ — ဒီလို စတင်နိုင်ပြီး:

```sql
CREATE TABLE products (
    product_no integer NULL,
    name text NULL,
    price numeric NULL
);
```

ပြီးရင် လိုချင်တဲ့ နေရာမှာ `NOT` key word ကို ထည့်နိုင်ပါတယ်။

> **အကြံပြုချက်:** Database designs အများစုမှာ column အများစုကို not null အဖြစ် မှတ်သားထားသင့်ပါတယ်။

### 5.5.3. Unique Constraints (ထူးခြားမှု ကန့်သတ်ချက်များ)

Unique constraints တွေက column တစ်ခု ဒါမှမဟုတ် column အုပ်စု တစ်ခုထဲမှာ ပါတဲ့ data တွေကို — table ထဲက row အားလုံးကြားမှာ ထူးခြားနေအောင် (unique) သေချာစေပါတယ်။ Syntax က:

```sql
CREATE TABLE products (
    product_no integer UNIQUE,
    name text,
    price numeric
);
```

ဒါက column constraint အနေနဲ့ ရေးတဲ့ syntax ဖြစ်ပြီး —

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric,
    UNIQUE (product_no)
);
```

ဒါကတော့ table constraint အနေနဲ့ ရေးတဲ့ syntax ပါ။

Column အုပ်စု တစ်ခုအတွက် unique constraint သတ်မှတ်ဖို့ — column names တွေကို comma နဲ့ ခွဲပြီး table constraint အနေနဲ့ ရေးပါ:

```sql
CREATE TABLE example (
    a integer,
    b integer,
    c integer,
    UNIQUE (a, c)
);
```

ဒါက ဖော်ပြထားတဲ့ column တွေထဲက values တွေရဲ့ ပေါင်းစပ်မှုကို table တစ်ခုလုံးမှာ ထူးခြားစေပါတယ် — column တစ်ခုချင်းစီကတော့ unique ဖြစ်စရာ (သာမန်အားဖြင့်လည်း မဖြစ်ပါဘူး) မလိုပါဘူး။

Unique constraint အတွက်လည်း ပုံမှန် နည်းအတိုင်း ကိုယ်ပိုင် နာမည် ပေးလို့ရပါတယ်:

```sql
CREATE TABLE products (
    product_no integer CONSTRAINT must_be_different UNIQUE,
    name text,
    price numeric
);
```

Unique constraint တစ်ခု ထည့်လိုက်ရင် — constraint ထဲမှာ စာရင်းပြုထားတဲ့ column ဒါမှမဟုတ် column အုပ်စုအပေါ်မှာ unique B-tree index တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ Row တချို့ကိုပဲ အကျုံးဝင်တဲ့ uniqueness ကန့်သတ်မှုကို unique constraint အနေနဲ့တော့ ရေးလို့မရပါဘူး — ဒါပေမယ့် unique [partial index](https://www.postgresql.org/docs/current/indexes-partial.html) တစ်ခုကို ဖန်တီးပြီး အဲဒီလို ကန့်သတ်မှုမျိုးကို အတင်းအကျပ် လုပ်ဆောင်လို့ရပါတယ်။

ယေဘုယျအားဖြင့် — constraint ထဲ ပါဝင်တဲ့ column တွေအားလုံးရဲ့ values တွေ တူညီနေတဲ့ row တစ်ခုထက်ပိုပြီး table ထဲမှာ ရှိနေရင် unique constraint ကို ချိုးဖောက်တာ ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် ဒီနှိုင်းယှဉ်မှုမှာ null value နှစ်ခုကို တူညီတယ်လို့ မမှတ်ယူပါဘူး။ ဆိုလိုတာက — unique constraint ရှိနေတာတောင် — ကန့်သတ်ထားတဲ့ column တွေထဲက အနည်းဆုံး တစ်ခုမှာ null value ပါတဲ့ duplicate rows တွေကို သိမ်းထားနိုင်ပါတယ်။ ဒီအပြုအမူကို `NULLS NOT DISTINCT` ဆိုတဲ့ clause ထည့်ပြီး ပြောင်းလဲနိုင်ပါတယ် — ဒီလိုမျိုး:

```sql
CREATE TABLE products (
    product_no integer UNIQUE NULLS NOT DISTINCT,
    name text,
    price numeric
);
```

ဒါမှမဟုတ်:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric,
    UNIQUE NULLS NOT DISTINCT (product_no)
);
```

ပုံမှန် အပြုအမူကို `NULLS DISTINCT` သုံးပြီး ထင်ရှားစွာ (explicitly) သတ်မှတ်လို့လည်း ရပါတယ်။ SQL standard အရ unique constraints တွေမှာ null တွေကို ကိုင်တွယ်ပုံ ပုံမှန် သတ်မှတ်ချက်က implementation တစ်ခုချင်းအလိုက် သတ်မှတ်တာ ဖြစ်ပြီး — တခြား implementations တွေမှာ မတူညီတဲ့ အပြုအမူတွေ ရှိပါတယ်။ ဒါကြောင့် portable ဖြစ်ဖို့ ရည်ရွယ်ထားတဲ့ applications တွေ တည်ဆောက်တဲ့အခါ သတိထားပါ။

### 5.5.4. Primary Keys (row တွေကို ထူးခြားစေတဲ့ key)

Primary key constraint က column တစ်ခု ဒါမှမဟုတ် column အုပ်စု တစ်ခုကို — table ထဲက rows တွေအတွက် ထူးခြားတဲ့ သတ်မှတ်ကိရိယာ (unique identifier) အဖြစ် သုံးနိုင်တယ်လို့ ညွှန်ပြပါတယ်။ ဒါအတွက် values တွေက unique လည်း ဖြစ်ရမယ် — null လည်း မဖြစ်ရပါဘူး။ ဒါကြောင့် အောက်က table definitions နှစ်ခုလုံးက data အတူတူကို လက်ခံပါတယ်:

```sql
CREATE TABLE products (
    product_no integer UNIQUE NOT NULL,
    name text,
    price numeric
);
```

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);
```

Primary keys တွေက column တစ်ခုထက်ပိုပြီး လွှမ်းခြုံနိုင်ပါတယ် — syntax က unique constraints တွေနဲ့ ဆင်တူပါတယ်:

```sql
CREATE TABLE example (
    a integer,
    b integer,
    c integer,
    PRIMARY KEY (a, c)
);
```

Primary key တစ်ခု ထည့်လိုက်ရင် — primary key ထဲမှာ စာရင်းပြုထားတဲ့ column ဒါမှမဟုတ် column အုပ်စုအပေါ်မှာ unique B-tree index တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပြီး — အဲဒီ column (တွေ) ကို `NOT NULL` အဖြစ် မှတ်သားစေပါတယ်။

Table တစ်ခုမှာ primary key က အများဆုံး တစ်ခုပဲ ရှိနိုင်ပါတယ်။ (Unique constraints တွေကတော့ ဘယ်နှစ်ခုမဆို ရှိနိုင်ပြီး — not-null constraints တွေနဲ့ ပေါင်းရင် လုပ်ဆောင်ချက်အရ အတူတူနီးပါး ဖြစ်ပေမယ့် — primary key အဖြစ်တော့ တစ်ခုတည်းပဲ သတ်မှတ်လို့ရပါတယ်။) Relational database theory အရ table တိုင်းမှာ primary key ရှိရမယ်လို့ သတ်မှတ်ပါတယ်။ ဒီစည်းမျဉ်းကို PostgreSQL က အတင်းအကျပ် မလုပ်ဆောင်ပါဘူး — ဒါပေမယ့် လိုက်နာတာက များသောအားဖြင့် အကောင်းဆုံးပါ။

Primary keys တွေက documentation ရည်ရွယ်ချက်အတွက်ရော — client applications တွေအတွက်ပါ အသုံးဝင်ပါတယ်။ ဥပမာ — row values တွေကို ပြုပြင်ခွင့်ပေးတဲ့ GUI application တစ်ခုက — rows တွေကို ထူးခြားစွာ ခွဲခြားသိဖို့ table ရဲ့ primary key ကို သိဖို့ လိုနိုင်ပါတယ်။ ပြီးတော့ primary key တစ်ခု ကြေညာထားရင် database system က အဲဒါကို နည်းလမ်း အမျိုးမျိုးနဲ့ အသုံးပြုပါတယ် — ဥပမာ — primary key က သူ့ table ကို ရည်ညွှန်းတဲ့ foreign keys တွေအတွက် ပုံမှန် target column (တွေ) ကို သတ်မှတ်ပေးပါတယ်။

### 5.5.5. Foreign Keys (တခြား table ရဲ့ row တွေနဲ့ ချိတ်ဆက်တဲ့ key)

Foreign key constraint က column တစ်ခု (ဒါမှမဟုတ် column အုပ်စု တစ်ခု) ထဲက values တွေကို — တခြား table တစ်ခုရဲ့ row တစ်ခုခုထဲမှာ ရှိတဲ့ values တွေနဲ့ ကိုက်ညီရမယ်လို့ သတ်မှတ်ပါတယ်။ ဒါက ဆက်စပ်နေတဲ့ table နှစ်ခုကြားမှာ *referential integrity* (ကိုးကားချက်များ ဆက်စပ်မှု ခိုင်မာမှု) ကို ထိန်းသိမ်းပေးတာလို့ ဆိုပါတယ်။

အရင်က အကြိမ်ကြိမ် သုံးခဲ့တဲ့ product table ရှိတယ် ဆိုပါစို့:

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);
```

ပြီးတော့ အဲဒီ products တွေရဲ့ orders (မှာယူမှုများ) တွေကို သိမ်းတဲ့ table တစ်ခုလည်း ရှိတယ် ဆိုပါစို့။ Orders table ထဲမှာ တကယ်ရှိတဲ့ products တွေရဲ့ orders တွေပဲ ပါအောင် သေချာစေချင်ပါတယ်။ ဒါကြောင့် orders table ထဲမှာ — products table ကို ရည်ညွှန်းတဲ့ foreign key constraint တစ်ခု သတ်မှတ်ပါတယ်:

```sql
CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    product_no integer REFERENCES products (product_no),
    quantity integer
);
```

အခုဆိုရင် — products table ထဲမှာ မပါတဲ့ non-NULL `product_no` entries တွေနဲ့ orders တွေ ဖန်တီးလို့ မဖြစ်တော့ပါဘူး။

ဒီအခြေအနေမှာ orders table ကို *referencing* (ရည်ညွှန်းသော) table လို့ ခေါ်ပြီး — products table ကို *referenced* (ရည်ညွှန်းခံရသော) table လို့ ခေါ်ပါတယ်။ အလားတူပဲ — referencing columns တွေနဲ့ referenced columns တွေလည်း ရှိပါတယ်။

အပေါ်က command ကိုလည်း ဒီလို အတိုချုံးလို့ရပါတယ်:

```sql
CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    product_no integer REFERENCES products,
    quantity integer
);
```

အကြောင်းက — column list မပါရင် referenced table ရဲ့ primary key ကို referenced column (တွေ) အနေနဲ့ သုံးလို့ပါ။

Foreign key constraint အတွက်လည်း ပုံမှန် နည်းအတိုင်း ကိုယ်ပိုင် နာမည် ပေးလို့ရပါတယ်။

Foreign key က column အုပ်စု တစ်ခုကိုလည်း ကန့်သတ်ပြီး ရည်ညွှန်းနိုင်ပါတယ်။ ဒီအခါ ပုံမှန်အတိုင်း table constraint ပုံစံနဲ့ ရေးဖို့ လိုပါတယ်။ ဥပမာသက်သက် syntax ဥပမာ တစ်ခုက:

```sql
CREATE TABLE t1 (
  a integer PRIMARY KEY,
  b integer,
  c integer,
  FOREIGN KEY (b, c) REFERENCES other_table (c1, c2)
);
```

ကန့်သတ်ခံရတဲ့ column တွေရဲ့ အရေအတွက်နဲ့ type က — referenced column တွေရဲ့ အရေအတွက်နဲ့ type နဲ့ ကိုက်ညီဖို့ လိုတာ သေချာပါတယ်။

Foreign key constraint ရဲ့ "တခြား table" က table ကိုယ်တိုင် ဖြစ်နေတာက တခါတရံ အသုံးဝင်ပါတယ် — ဒါကို *self-referential* (မိမိကိုယ်ကို ရည်ညွှန်းသော) foreign key လို့ ခေါ်ပါတယ်။ ဥပမာ — table တစ်ခုရဲ့ rows တွေက tree structure (သစ်ပင် ပုံစံ) တစ်ခုရဲ့ nodes တွေကို ကိုယ်စားပြုစေချင်ရင် ဒီလို ရေးနိုင်ပါတယ်:

```sql
CREATE TABLE tree (
    node_id integer PRIMARY KEY,
    parent_id integer REFERENCES tree,
    name text,
    ...
);
```

ထိပ်ဆုံး (top-level) node တစ်ခုရဲ့ `parent_id` က NULL ဖြစ်ပြီး — non-NULL `parent_id` entries တွေကတော့ table ရဲ့ valid rows တွေကိုပဲ ရည်ညွှန်းဖို့ ကန့်သတ်ခံရပါတယ်။

Table တစ်ခုမှာ foreign key constraints တစ်ခုထက်ပိုပြီး ရှိနိုင်ပါတယ်။ ဒါကို table တွေကြားက many-to-many (အများနှင့်အများ) ဆက်စပ်မှုတွေ အကောင်အထည် ဖော်ဖို့ သုံးပါတယ်။ Products နဲ့ orders အကြောင်း table တွေ ရှိတယ် ဆိုပါစို့ — ဒါပေမယ့် အခု order တစ်ခုမှာ product အများကြီး ပါဝင်ခွင့် ပြုချင်တယ်ဆိုရင် (အပေါ်က structure က မခွင့်ပြုပါဘူး) — ဒီ table structure ကို သုံးနိုင်ပါတယ်:

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);

CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    shipping_address text,
    ...
);

CREATE TABLE order_items (
    product_no integer REFERENCES products,
    order_id integer REFERENCES orders,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
```

နောက်ဆုံး table မှာ primary key က foreign keys တွေနဲ့ ထပ်နေတာကို သတိပြုပါ။

Foreign keys တွေက ဘယ် product နဲ့မှ မဆက်စပ်တဲ့ orders တွေ ဖန်တီးတာကို တားမြစ်တာ သိပြီးသားပါ။ ဒါပေမယ့် — order တစ်ခုက ရည်ညွှန်းထားတဲ့ product တစ်ခုကို — အဲဒီ order ဖန်တီးပြီးမှ ဖယ်ရှားလိုက်ရင်ကော ဘယ်လိုလဲ။ SQL က ဒါကိုပါ ကိုင်တွယ်ခွင့် ပေးပါတယ်။ ယုတ္တိအရ ရွေးစရာ အနည်းငယ် ရှိပါတယ်:

- Referenced product တစ်ခုကို ဖျက်တာကို တားမြစ်ခြင်း
- Orders တွေကိုပါ ဖျက်လိုက်ခြင်း
- တခြား တစ်ခုခုလား?

ဒါကို ရှင်းပြဖို့ — အပေါ်က many-to-many ဆက်စပ်မှု ဥပမာမှာ အောက်ပါ policy ကို အကောင်အထည် ဖော်ကြည့်ရအောင်: တစ်ယောက်ယောက်က order တစ်ခု (`order_items` ကတစ်ဆင့်) က ဆက်လက် ရည်ညွှန်းနေတဲ့ product တစ်ခုကို ဖယ်ရှားချင်ရင် ငါတို့က တားမြစ်ပါတယ်။ တစ်ယောက်ယောက်က order တစ်ခုကို ဖယ်ရှားရင်တော့ order items တွေကိုပါ ဖယ်ရှားလိုက်ပါတယ်:

```sql
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);

CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    shipping_address text,
    ...
);

CREATE TABLE order_items (
    product_no integer REFERENCES products ON DELETE RESTRICT,
    order_id integer REFERENCES orders ON DELETE CASCADE,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
```

ပုံမှန် `ON DELETE` action က `ON DELETE NO ACTION` ဖြစ်ပြီး — ဒါကို ရေးဖို့ မလိုပါဘူး။ ဒါက referenced table ထဲမှာ ဖျက်တာကို ဆက်လုပ်ခွင့် ပေးတာပါ။ ဒါပေမယ့် foreign-key constraint က ကျေနပ်မှု ပြည့်စုံဖို့တော့ လိုနေသေးတာမို့ — ဒီလုပ်ဆောင်ချက်က များသောအားဖြင့် error ဖြစ်စေပါတယ်။ ဒါပေမယ့် foreign-key constraints တွေကို စစ်ဆေးတာကို transaction ထဲမှာ နောက်ပိုင်းအထိ ရွှေ့ဆိုင်းထားလို့လည်း ရပါတယ် (ဒီအခန်းမှာ အကျယ်တဝင့် မဖော်ပြပါဘူး)။ ဒီလို အခြေအနေမှာ `NO ACTION` setting က constraint မစစ်ဆေးခင် — တခြား commands တွေနဲ့ အခြေအနေကို "ပြုပြင်" ခွင့် ပေးပါတယ် — ဥပမာ referenced table ထဲကို သင့်လျော်တဲ့ row တစ်ခု ထပ်ထည့်တာ ဒါမှမဟုတ် referencing table ကနေ အခု dangling (ချိတ်ဆက်မှု မဲ့နေတဲ့) rows တွေကို ဖျက်လိုက်တာမျိုးပါ။

`RESTRICT` က `NO ACTION` ထက် ပိုတင်းကျပ်တဲ့ setting ပါ။ ဒါက referenced row တစ်ခုကို ဖျက်တာကို တားဆီးပါတယ်။ `RESTRICT` ကတော့ စစ်ဆေးမှုကို transaction ထဲမှာ နောက်ပိုင်းအထိ ရွှေ့ဆိုင်းခွင့် မပြုပါဘူး။

`CASCADE` က referenced row တစ်ခုကို ဖျက်လိုက်တဲ့အခါ — အဲဒါကို ရည်ညွှန်းနေတဲ့ row (တွေ) ကိုပါ အလိုအလျောက် ဖျက်ပစ်ဖို့ သတ်မှတ်ပါတယ်။

နောက်ထပ် ရွေးစရာ နှစ်ခု ရှိပါသေးတယ်: `SET NULL` နဲ့ `SET DEFAULT`။ ဒါတွေက referenced row ကို ဖျက်လိုက်တဲ့အခါ — referencing row (တွေ) ထဲက referencing column (တွေ) ကို null values တွေ ဒါမှမဟုတ် သူတို့ရဲ့ default values တွေ အသီးသီး ဖြစ်အောင် သတ်မှတ်ပေးပါတယ်။ ဒါတွေက constraint တွေကို လိုက်နာ စောင့်ထိန်းရာကနေ လွတ်ကင်းခွင့် မပေးဘူးဆိုတာ သတိပြုပါ။ ဥပမာ — action တစ်ခုက `SET DEFAULT` လို့ သတ်မှတ်ထားပေမယ့် default value က foreign key constraint ကို မကျေနပ်စေဘူးဆိုရင် — လုပ်ဆောင်ချက်က မအောင်မြင်ပါဘူး။

သင့်လျော်တဲ့ `ON DELETE` action ရွေးချယ်မှုက — ဆက်စပ်နေတဲ့ table တွေက ဘယ်လို object တွေကို ကိုယ်စားပြုလဲဆိုတာအပေါ် မူတည်ပါတယ်။ Referencing table က referenced table ရဲ့ အစိတ်အပိုင်း (component) တစ်ခုကို ကိုယ်စားပြုပြီး — သီးခြား တည်ရှိလို့ မရတဲ့ အရာဆိုရင် `CASCADE` က သင့်လျော်နိုင်ပါတယ်။ Table နှစ်ခုက သီးခြား objects တွေကို ကိုယ်စားပြုရင်တော့ `RESTRICT` ဒါမှမဟုတ် `NO ACTION` က ပိုသင့်လျော်ပါတယ် — object နှစ်ခုလုံးကို တကယ် ဖျက်ချင်တဲ့ application က ဒါကို ရှင်းရှင်းလင်းလင်း ဖော်ပြပြီး delete commands နှစ်ခု run ရမှာ ဖြစ်ပါတယ်။ အပေါ်က ဥပမာမှာ order items တွေက order ရဲ့ အစိတ်အပိုင်း ဖြစ်လို့ — order ဖျက်ရင် သူတို့ကိုပါ အလိုအလျောက် ဖျက်တာက အဆင်ပြေပါတယ်။ ဒါပေမယ့် products နဲ့ orders က မတူညီတဲ့ အရာတွေမို့ — product တစ်ခု ဖျက်တာက order items တချို့ကိုပါ အလိုအလျောက် ဖျက်စေတာက ပြဿနာ ရှိနိုင်တယ်လို့ ယူဆနိုင်ပါတယ်။ Foreign-key ဆက်စပ်မှုက optional (မဖြစ်မနေ မဟုတ်တဲ့) အချက်အလက်ကို ကိုယ်စားပြုရင်တော့ `SET NULL` ဒါမှမဟုတ် `SET DEFAULT` actions တွေက သင့်လျော်နိုင်ပါတယ်။ ဥပမာ — products table ထဲမှာ product manager တစ်ယောက်ဆီကို ရည်ညွှန်းချက် ပါပြီး — အဲဒီ product manager entry ကို ဖျက်လိုက်ရင် — product ရဲ့ product manager ကို null ဒါမှမဟုတ် default တစ်ခု ဖြစ်အောင် သတ်မှတ်တာက အသုံးဝင်နိုင်ပါတယ်။

`SET NULL` နဲ့ `SET DEFAULT` actions တွေက — ဘယ် columns တွေကို သတ်မှတ်မလဲ ဖော်ပြဖို့ column list တစ်ခု ယူနိုင်ပါတယ်။ သာမန်အားဖြင့် foreign-key constraint ရဲ့ columns အားလုံးကို သတ်မှတ်ပေးပြီး — အစိတ်အပိုင်း တချို့ကိုပဲ သတ်မှတ်တာက အထူး အခြေအနေတချို့မှာ အသုံးဝင်ပါတယ်။ အောက်ပါ ဥပမာကို ကြည့်ပါ:

```sql
CREATE TABLE tenants (
    tenant_id integer PRIMARY KEY
);

CREATE TABLE users (
    tenant_id integer REFERENCES tenants ON DELETE CASCADE,
    user_id integer NOT NULL,
    PRIMARY KEY (tenant_id, user_id)
);

CREATE TABLE posts (
    tenant_id integer REFERENCES tenants ON DELETE CASCADE,
    post_id integer NOT NULL,
    author_id integer,
    PRIMARY KEY (tenant_id, post_id),
    FOREIGN KEY (tenant_id, author_id) REFERENCES users ON DELETE SET NULL (author_id)
);
```

Column ကို သတ်မှတ်မထားရင် foreign key က `tenant_id` column ကိုပါ null ဖြစ်အောင် သတ်မှတ်ပေးမှာ ဖြစ်ပေမယ့် — အဲဒီ column က primary key ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ဆက်လက် လိုအပ်နေပါတယ်။

`ON DELETE` နဲ့ အလားတူ — `ON UPDATE` လည်း ရှိပြီး — referenced column တစ်ခုကို ပြောင်းလဲ (update) လုပ်တဲ့အခါ ဒါကို ခေါ်ယူပါတယ်။ ဖြစ်နိုင်တဲ့ actions တွေက အတူတူပဲ ဖြစ်ပြီး — `SET NULL` နဲ့ `SET DEFAULT` အတွက် column lists တွေကို သတ်မှတ်လို့ မရတာပဲ ခြားနားပါတယ်။ ဒီနေရာမှာ `CASCADE` ဆိုတာ — referenced column (တွေ) ရဲ့ update လုပ်ထားတဲ့ values တွေကို referencing row (တွေ) ထဲကို ကူးယူပေးတာပါ။ `ON UPDATE NO ACTION` (ပုံမှန်) နဲ့ `ON UPDATE RESTRICT` ကြားမှာလည်း သိသာတဲ့ ခြားနားချက် တစ်ခု ရှိပါတယ်။ ရှေ့တစ်ခုက update ကို ဆက်လုပ်ခွင့် ပေးပြီး — foreign-key constraint ကို update ပြီးနောက် state နဲ့ စစ်ဆေးပါတယ်။ နောက်တစ်ခုကတော့ — update ပြီးနောက် state က constraint ကို ကျေနပ်နေဦးမယ်ဆိုရင်တောင် update ကို run မလုပ်ခွင့်ပြုဘဲ တားဆီးပါတယ်။ ဒါက referenced row တစ်ခုကို — ကွဲပြားပေမယ့် နှိုင်းယှဉ်ရင် တူညီတယ်လို့ ယူဆရတဲ့ value (ဥပမာ — case-insensitive collation ပါတဲ့ character string type ကို သုံးထားရင် case မတူညီတဲ့ character string) ဆီ update လုပ်တာကို တားဆီးပေးပါတယ်။

သာမန်အားဖြင့် — referencing row ရဲ့ referencing columns တစ်ခုခု null ဖြစ်ရင် အဲဒီ row က foreign key constraint ကို ကျေနပ်စရာ မလိုပါဘူး။ Foreign key declaration မှာ `MATCH FULL` ထည့်ထားရင်တော့ — referencing row ရဲ့ referencing columns အားလုံး null ဖြစ်မှပဲ constraint ကျေနပ်မှုကနေ လွတ်မြောက်ပါတယ် (ဒါကြောင့် null နဲ့ non-null values တွေ ရောနေတာက `MATCH FULL` constraint ကို သေချာပေါက် မအောင်မြင်စေပါဘူး)။ Referencing rows တွေ foreign key constraint ကို ရှောင်လွှဲလို့ မရအောင် လုပ်ချင်ရင် — referencing column (တွေ) ကို `NOT NULL` အဖြစ် ကြေညာလိုက်ပါ။

Foreign key တစ်ခုက — primary key ဖြစ်တဲ့ ဒါမှမဟုတ် unique constraint တစ်ခု ဖွဲ့စည်းထားတဲ့ — ဒါမှမဟုတ် non-partial unique index တစ်ခုရဲ့ columns တွေ ဖြစ်တဲ့ columns တွေကိုပဲ ရည်ညွှန်းရပါမယ်။ ဆိုလိုတာက referenced columns တွေမှာ အမြဲ index ရှိနေလို့ — referencing row တစ်ခု match ရှိ/မရှိ ထိရောက်စွာ ရှာဖွေနိုင်ပါတယ်။ Referenced table ကနေ row တစ်ခု `DELETE` လုပ်တာ ဒါမှမဟုတ် referenced column တစ်ခုကို `UPDATE` လုပ်တာက — ဟောင်းနေတဲ့ value နဲ့ ကိုက်ညီတဲ့ rows တွေအတွက် referencing table ကို scan လုပ်ဖို့ လိုတာမို့ — referencing columns တွေကိုပါ index လုပ်ထားတာက မကြာခဏ ကောင်းမွန်တဲ့ အကြံ ဖြစ်ပါတယ်။ ဒါက အမြဲတမ်း မလိုအပ်တာမို့ ဖြစ်ပြီး — index ဘယ်လို လုပ်မလဲဆိုတာ ရွေးစရာ အများကြီး ရှိတာကြောင့် — foreign key constraint ရဲ့ ကြေညာချက်က referencing columns တွေအပေါ်မှာ index ကို အလိုအလျောက် မဖန်တီးပေးပါဘူး။

Data တွေ update လုပ်ခြင်းနဲ့ ဖျက်ခြင်းအကြောင်း ပိုပြီး အသေးစိတ်ကို [အခန်း 6](https://www.postgresql.org/docs/current/dml.html) မှာ ကြည့်ပါ။ Foreign key constraint syntax ရဲ့ ဖော်ပြချက်ကို [CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) အတွက် reference documentation မှာလည်း ကြည့်နိုင်ပါတယ်။

### 5.5.6. Exclusion Constraints (exclusion ကန့်သတ်ချက်များ)

Exclusion constraints တွေက — သတ်မှတ်ထားတဲ့ operators တွေကို သုံးပြီး row နှစ်ခုကို သတ်မှတ်ထားတဲ့ columns ဒါမှမဟုတ် expressions တွေအပေါ်မှာ နှိုင်းယှဉ်လိုက်ရင် — အဲဒီ operator နှိုင်းယှဉ်မှုတွေထဲက အနည်းဆုံး တစ်ခုက false ဒါမှမဟုတ် null ကို ပြန်ပေးမယ်လို့ သေချာစေပါတယ်။ Syntax က:

```sql
CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);
```

အသေးစိတ်အတွက် [`CREATE TABLE ... CONSTRAINT ... EXCLUDE`](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-EXCLUDE) ကိုလည်း ကြည့်ပါ။

Exclusion constraint တစ်ခု ထည့်လိုက်ရင် — constraint declaration ထဲမှာ သတ်မှတ်ထားတဲ့ type ရဲ့ index တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။
