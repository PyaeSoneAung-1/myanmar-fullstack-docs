---
title: "Value Expressions (တန်ဖိုး expression များ)"
description: "Value expression (တန်ဖိုး expression) အမျိုးအစားများ — column reference, positional parameter, operator invocation, function call, aggregate, type cast, collation, scalar subquery, array/row constructor စသည်"
order: 20
source: "https://www.postgresql.org/docs/current/sql-expressions.html"
status: translated
updated: 2026-09-03
---

## 4.2. Value Expressions (တန်ဖိုး expression များ)

- **4.2.1. Column References (column ရည်ညွှန်းချက်များ)**
- **4.2.2. Positional Parameters (positional parameter များ)**
- **4.2.3. Subscripts (subscript များ)**
- **4.2.4. Field Selection (field ရွေးချယ်ခြင်း)**
- **4.2.5. Operator Invocations (operator ခေါ်ယူခြင်း)**
- **4.2.6. Function Calls (function ခေါ်ဆိုခြင်း)**
- **4.2.7. Aggregate Expressions (aggregate expression များ)**
- **4.2.8. Window Function Calls (window function ခေါ်ဆိုခြင်း)**
- **4.2.9. Type Casts (type cast များ)**
- **4.2.10. Collation Expressions (collation expression များ)**
- **4.2.11. Scalar Subqueries (scalar subquery များ)**
- **4.2.12. Array Constructors (array constructor များ)**
- **4.2.13. Row Constructors (row constructor များ)**
- **4.2.14. Expression Evaluation Rules (expression အကဲဖြတ်ခြင်း စည်းမျဉ်းများ)**

Value expression တွေကို — `SELECT` command ရဲ့ target list (ရွေးထုတ်မည့် column စာရင်း) ထဲမှာ၊ `INSERT` သို့မဟုတ် `UPDATE` အတွက် column တန်ဖိုး အသစ်တွေအဖြစ်၊ ဒါမှမဟုတ် command အများအပြားရဲ့ search condition (ရှာဖွေရေး အခြေအနေ) တွေမှာ စသည်ဖြင့် — နေရာ အမျိုးမျိုးမှာ သုံးပါတယ်။ Value expression တစ်ခုရဲ့ ရလဒ်ကို — table expression ရဲ့ ရလဒ် (table တစ်ခု ဖြစ်တဲ့) နဲ့ ခွဲခြားဖို့ — *scalar* လို့ တခါတရံ ခေါ်ပါတယ်။ ဒါကြောင့် value expression တွေကို *scalar expressions* (သို့မဟုတ် ရိုးရိုး *expressions*) လို့လည်း ခေါ်ပါတယ်။ ဒီ expression syntax က primitive (အခြေခံ) အစိတ်အပိုင်းတွေကနေ — arithmetic (ဂဏန်းသင်္ချာ), logical (ယုတ္တိ), set (အစု) နဲ့ တခြား operation တွေကို သုံးပြီး — တန်ဖိုးတွေ တွက်ချက်နိုင်စေပါတယ်။

Value expression တစ်ခုက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

- Constant (ကိန်းသေတန်ဖိုး) သို့မဟုတ် literal value
- Column reference တစ်ခု
- Function definition သို့မဟုတ် prepared statement တစ်ခုရဲ့ ကိုယ်ထဲမှာ ရှိတဲ့ positional parameter reference တစ်ခု
- Subscripted expression တစ်ခု
- Field selection expression တစ်ခု
- Operator invocation တစ်ခု
- Function call တစ်ခု
- Aggregate expression တစ်ခု
- Window function call တစ်ခု
- Type cast တစ်ခု
- Collation expression တစ်ခု
- Scalar subquery တစ်ခု
- Array constructor တစ်ခု
- Row constructor တစ်ခု
- Parentheses ထဲမှာ ထည့်ထားတဲ့ တခြား value expression တစ်ခု (subexpression တွေကို အုပ်စုဖွဲ့ပြီး precedence (ဦးစားပေး အစဉ်) ကို ကျော်လွန်သတ်မှတ်ဖို့ သုံးပါတယ်)

ဒီစာရင်းအပြင် — expression အဖြစ် သတ်မှတ်လို့ ရပေမယ့် ယေဘုယျ syntax စည်းမျဉ်း တစ်ခုခုကိုတော့ မလိုက်နာတဲ့ construct တွေ အများအပြားလည်း ရှိပါသေးတယ်။ ဒါတွေက ယေဘုယျအားဖြင့် function သို့မဟုတ် operator တစ်ခုရဲ့ အဓိပ္ပာယ် (semantics) ရှိပြီး — [အခန်း 9](https://www.postgresql.org/docs/current/functions.html) ထဲက သင့်လျော်တဲ့ နေရာတွေမှာ ရှင်းပြထားပါတယ်။ ဥပမာ — `IS NULL` clause ပါ။

Constant တွေကို [အပိုင်း 4.1.2](/docs/postgresql/sql-syntax-lexical) မှာ ဆွေးနွေးပြီးသား ဖြစ်ပါတယ်။ အောက်က section တွေမှာတော့ ကျန်ရှိနေတဲ့ option တွေကို ဆွေးနွေးသွားပါမယ်။

### 4.2.1. Column References (column ရည်ညွှန်းချက်များ)

Column တစ်ခုကို ဒီပုံစံနဲ့ ရည်ညွှန်းလို့ ရပါတယ်:

```sql
correlation.columnname
```

`correlation` ဆိုတာ table တစ်ခုရဲ့ နာမည် (schema name နဲ့ ရှေ့ဆွဲထားနိုင်) သို့မဟုတ် `FROM` clause နဲ့ သတ်မှတ်ထားတဲ့ table တစ်ခုအတွက် alias (အမည်ပြား) ဖြစ်ပါတယ်။ လက်ရှိ query ထဲမှာ သုံးနေတဲ့ table တွေ အားလုံးကြားမှာ column name က ထူးခြားနေရင် (unique ဖြစ်ရင်) correlation name နဲ့ ၎င်းတို့ကို ခြားပေးတဲ့ dot ကို ချန်လိုက်လို့ ရပါတယ်။ ([အခန်း 7](https://www.postgresql.org/docs/current/queries.html) ကိုလည်း ကြည့်ပါ။)

### 4.2.2. Positional Parameters (positional parameter များ)

Positional parameter reference ဆိုတာ — SQL statement တစ်ခုကို အပြင်ကနေ ထောက်ပံ့ပေးတဲ့ တန်ဖိုးတစ်ခုကို ညွှန်ပြဖို့ သုံးပါတယ်။ Parameter တွေကို SQL function definition တွေနဲ့ prepared query တွေမှာ သုံးပါတယ်။ Client library တချို့က — SQL command string နဲ့ သီးခြား — data value တွေကို သတ်မှတ်ပေးတာကိုလည်း ထောက်ပံ့ပါတယ် — အဲဒီအခါမျိုးမှာ out-of-line data value တွေကို ညွှန်းဖို့ parameter တွေကို သုံးပါတယ်။ Parameter reference ရဲ့ ပုံစံက:

```
$number
```

ဥပမာ — `dept` ဆိုတဲ့ function တစ်ခုရဲ့ definition ကို ကြည့်ရအောင်:

```sql
CREATE FUNCTION dept(text) RETURNS dept
    AS $$ SELECT * FROM dept WHERE name = $1 $$
    LANGUAGE SQL;
```

ဒီမှာ `$1` က — function ကို ခေါ်ယူတိုင်း — ပထမ function argument ရဲ့ တန်ဖိုးကို ရည်ညွှန်းပါတယ်။

### 4.2.3. Subscripts (subscript များ)

Expression တစ်ခုရဲ့ ရလဒ်က array type တစ်ခုရဲ့ တန်ဖိုး ဖြစ်နေရင် — ဒီလိုရေးပြီး အဲဒီ array တန်ဖိုးထဲက element တစ်ခုကို ထုတ်ယူလို့ ရပါတယ်:

```sql
expression[subscript]
```

ဒါမှမဟုတ် — ဒီလိုရေးပြီး — ကပ်လျက် (adjacent) element အများအပြား (“array slice”) ကိုလည်း ထုတ်ယူလို့ ရပါတယ်:

```sql
expression[lower_subscript:upper_subscript]
```

(ဒီမှာ `[ ]` bracket တွေကို စာလုံးအလျောက် (literally) ရေးရမှာ ဖြစ်ပါတယ်။) `subscript` တစ်ခုချင်းစီကလည်း expression တစ်ခုပဲ ဖြစ်ပြီး — အနီးဆုံး integer တန်ဖိုးအဖြစ် rounding (ပတ်ဖြတ်) လုပ်ပါတယ်။

ယေဘုယျအားဖြင့် array `expression` ကို parentheses ထဲ ထည့်ထားရပါမယ် — ဒါပေမယ့် subscript လုပ်မယ့် expression က column reference သို့မဟုတ် positional parameter အရိုးရိုးဆိုရင်တော့ parentheses တွေကို ချန်လိုက်လို့ ရပါတယ်။ ပြီးတော့ — မူရင်း array က multidimensional (အတိုင်းအတာ မျိုးစုံ) ဖြစ်နေရင် subscript အများအပြားကို ဆက်တိုက် ရေးလို့လည်း ရပါတယ်။ ဥပမာ:

```
mytable.arraycolumn[4]
mytable.two_d_column[17][34]
$1[10:42]
(arrayfunction(a,b))[42]
```

နောက်ဆုံး ဥပမာထဲက parentheses တွေက မဖြစ်မနေ လိုအပ်ပါတယ်။ Array တွေအကြောင်း ပိုသိရဖို့ [အပိုင်း 8.15](https://www.postgresql.org/docs/current/arrays.html) ကို ကြည့်ပါ။

### 4.2.4. Field Selection (field ရွေးချယ်ခြင်း)

Expression တစ်ခုရဲ့ ရလဒ်က composite type (row type — စုပေါင်း type) တစ်ခုရဲ့ တန်ဖိုး ဖြစ်နေရင် — ဒီလိုရေးပြီး row ထဲက field တစ်ခုကို ထုတ်ယူလို့ ရပါတယ်:

```sql
expression.fieldname
```

ယေဘုယျအားဖြင့် row `expression` ကို parentheses ထဲ ထည့်ထားရပါမယ် — ဒါပေမယ့် field ထုတ်ယူမယ့် expression က table reference သို့မဟုတ် positional parameter အရိုးရိုးဆိုရင်တော့ parentheses တွေကို ချန်လိုက်လို့ ရပါတယ်။ ဥပမာ:

```
mytable.mycolumn
$1.somecolumn
(rowfunction(a,b)).col3
```

(ဒါကြောင့် qualified column reference ဆိုတာ တကယ်တော့ field selection syntax ရဲ့ အထူးကိစ္စ (special case) တစ်ခုပဲ ဖြစ်ပါတယ်။) အရေးကြီးတဲ့ အထူးကိစ္စ တစ်ခုကတော့ — composite type တစ်ခုဖြစ်တဲ့ table column တစ်ခုကနေ field တစ်ခုကို ထုတ်ယူတာပါ:

```sql
(compositecol).somefield
(mytable.compositecol).somefield
```

ဒီနေရာမှာ parentheses တွေက မဖြစ်မနေ လိုအပ်ပါတယ် — `compositecol` က table name မဟုတ်ဘဲ column name ဆိုတာကို ဖြစ်စေ၊ ဒုတိယ ကိစ္စမှာ `mytable` က schema name မဟုတ်ဘဲ table name ဆိုတာကို ဖြစ်စေ ပြသဖို့ပါ။

Composite value တစ်ခုရဲ့ field တွေ အားလုံးကို `.*` ရေးပြီးလည်း တောင်းခံလို့ ရပါတယ်:

```sql
(compositecol).*
```

ဒီ notation က context ပေါ်မူတည်ပြီး မတူညီတဲ့ ပုံစံနဲ့ ပြုမူပါတယ်; အသေးစိတ်အတွက် [အပိုင်း 8.16.5](https://www.postgresql.org/docs/current/rowtypes.html#ROWTYPES-USAGE) ကို ကြည့်ပါ။

### 4.2.5. Operator Invocations (operator ခေါ်ယူခြင်း)

Operator invocation အတွက် syntax နှစ်မျိုး ရှိပါတယ်:

| `expression` `operator` `expression` (binary infix operator ပုံစံ) |
| --- |
| `operator` `expression` (unary prefix operator ပုံစံ) |

ဒီမှာ `operator` token က [အပိုင်း 4.1.3](/docs/postgresql/sql-syntax-lexical) ရဲ့ syntax စည်းမျဉ်းတွေကို လိုက်နာရပြီး — `AND`, `OR`, `NOT` ဆိုတဲ့ key word တွေထဲက တစ်ခု ဒါမှမဟုတ် — အောက်ပါပုံစံနဲ့ ဖြစ်တဲ့ qualified operator name (schema နဲ့ အရည်အချင်းပြည့်တဲ့ operator name) တစ်ခု ဖြစ်နိုင်ပါတယ်:

```sql
OPERATOR(schema.operatorname)
```

ဘယ် operator တွေ ရှိသလဲ၊ unary လား binary လားဆိုတာက system သို့မဟုတ် user က ဘယ် operator တွေကို သတ်မှတ်ထားလဲပေါ်မှာ မူတည်ပါတယ်။ Built-in operator တွေကို [အခန်း 9](https://www.postgresql.org/docs/current/functions.html) မှာ ဖော်ပြထားပါတယ်။

### 4.2.6. Function Calls (function ခေါ်ဆိုခြင်း)

Function call ရဲ့ syntax က — function တစ်ခုရဲ့ နာမည် (schema name နဲ့ ရှေ့ဆွဲနိုင်) နဲ့ ၎င်းနောက်မှာ parentheses ထဲမှာ ထည့်ထားတဲ့ argument list — ဖြစ်ပါတယ်:

```sql
function_name ([expression [, expression ... ]] )
```

ဥပမာ — အောက်ပါအတိုင်း 2 ရဲ့ square root (နှစ်ထပ်ကိန်းရင်း) ကို တွက်နိုင်ပါတယ်:

```sql
sqrt(2)
```

Built-in function တွေရဲ့ စာရင်းက [အခန်း 9](https://www.postgresql.org/docs/current/functions.html) မှာ ရှိပါတယ်။ User က တခြား function တွေကိုလည်း ထပ်ပေါင်းထည့်လို့ ရပါတယ်။

User တချို့က တခြား user တွေကို မယုံကြည်တဲ့ database တစ်ခုမှာ query တွေ ထုတ်တဲ့အခါ — function call တွေ ရေးရာမှာ [အပိုင်း 10.3](https://www.postgresql.org/docs/current/typeconv-func.html) က security ကြိုတင်ကာကွယ်မှု တွေကို လိုက်နာပါ။

Argument တွေမှာ နာမည်တွေ တွဲပေးလို့လည်း ရပါတယ် (named arguments)။ အသေးစိတ်အတွက် [အပိုင်း 4.3](/docs/postgresql/sql-syntax-calling-funcs) ကို ကြည့်ပါ။

> **မှတ်ချက်:** Composite type တစ်ခုရဲ့ argument တစ်ခုတည်း ယူတဲ့ function တစ်ခုကို field-selection syntax နဲ့လည်း ခေါ်ယူလို့ ရပါတယ် — အပြန်အလှန်အားဖြင့် field selection ကိုလည်း function ပုံစံနဲ့ ရေးလို့ ရပါတယ်။ ဆိုလိုတာက `col(table)` နဲ့ `table.col` ဆိုတဲ့ notation နှစ်ခုက အပြန်အလှန် လဲသုံးလို့ ရပါတယ်။ ဒီအပြုအမူက SQL standard မဟုတ်ပေမယ့် — “computed fields” (တွက်ချက်ထားသော field များ) ကို emulate (တုပ) ဖို့ function တွေကို သုံးခွင့် ရှိစေလို့ — PostgreSQL မှာ ထည့်သွင်း ထောက်ပံ့ထားတာပါ။ နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 8.16.5](https://www.postgresql.org/docs/current/rowtypes.html#ROWTYPES-USAGE) ကို ကြည့်ပါ။

### 4.2.7. Aggregate Expressions (aggregate expression များ)

*aggregate expression* ဆိုတာ — query တစ်ခုက ရွေးထုတ်လိုက်တဲ့ row တွေအပေါ်မှာ aggregate function တစ်ခုကို အသုံးချတာကို ကိုယ်စားပြုပါတယ်။ Aggregate function က input အများကြီးကို output တန်ဖိုး တစ်ခုတည်း — ဥပမာ input တွေရဲ့ ပေါင်းလဒ် (sum) သို့မဟုတ် ပျမ်းမျှ (average) — အဖြစ် လျှော့ချပေးပါတယ်။ Aggregate expression ရဲ့ syntax က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

```sql
aggregate_name (expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name (ALL expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name (DISTINCT expression [ , ... ] [ order_by_clause ] ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name ( * ) [ FILTER ( WHERE filter_clause ) ]
aggregate_name ( [ expression [ , ... ] ] ) WITHIN GROUP ( order_by_clause ) [ FILTER ( WHERE filter_clause ) ]
```

ဒီမှာ `aggregate_name` က ကြိုတင် သတ်မှတ်ပြီးသား aggregate (schema name နဲ့ ရှေ့ဆွဲနိုင်) ဖြစ်ပြီး — `expression` ကတော့ ကိုယ်တိုင် aggregate expression သို့မဟုတ် window function call မပါဝင်တဲ့ ဘယ် value expression မဆို ဖြစ်ပါတယ်။ Optional ဖြစ်တဲ့ `order_by_clause` နဲ့ `filter_clause` တွေကို အောက်မှာ ဖော်ပြပါမယ်။

Aggregate expression ရဲ့ ပထမ ပုံစံက input row တစ်ခုချင်းစီအတွက် aggregate ကို တစ်ခါ ခေါ်ယူပါတယ်။ ဒုတိယ ပုံစံက ပထမနဲ့ အတူတူပဲ ဖြစ်ပါတယ် — `ALL` က default ဖြစ်လို့ပါ။ တတိယ ပုံစံကတော့ — input row တွေထဲမှာ တွေ့ရတဲ့ expression ရဲ့ distinct (မတူညီသော) တန်ဖိုး တစ်ခုချင်းစီအတွက် (expression အများအပြား ရှိရင်တော့ distinct တန်ဖိုး အစုတစ်စုစီအတွက်) aggregate ကို တစ်ခါ ခေါ်ယူပါတယ်။ စတုတ္ထ ပုံစံက input row တစ်ခုချင်းစီအတွက် aggregate ကို တစ်ခါ ခေါ်ယူပါတယ် — သတ်မှတ်ထားတဲ့ input တန်ဖိုး မပါဝင်လို့ — ယေဘုယျအားဖြင့် `count(*)` aggregate function အတွက်ပဲ အသုံးဝင်ပါတယ်။ နောက်ဆုံး ပုံစံကိုတော့ အောက်မှာ ဖော်ပြမယ့် *ordered-set* aggregate function တွေနဲ့ သုံးပါတယ်။

Aggregate function အများစုက null input တွေကို လျစ်လျူရှုပါတယ် — ဒါကြောင့် expression တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ expression တွေက null ထွက်တဲ့ row တွေကို ဖယ်ပစ်ပါတယ်။ Built-in aggregate တွေ အားလုံးအတွက်တော့ — တခြားသတ်မှတ်ချက် မရှိဘူးဆိုရင် — ဒါကို မှန်တယ်လို့ ယူဆနိုင်ပါတယ်။

ဥပမာ — `count(*)` က input row တွေရဲ့ စုစုပေါင်း အရေအတွက်ကို ပေးပြီး — `count(f1)` က `f1` null မဟုတ်တဲ့ input row အရေအတွက်ကို ပေးပါတယ် (`count` က null တွေကို လျစ်လျူရှုလို့); `count(distinct f1)` ကတော့ `f1` ရဲ့ distinct ဖြစ်ပြီး null မဟုတ်တဲ့ တန်ဖိုး အရေအတွက်ကို ပေးပါတယ်။

ပုံမှန်အားဖြင့် — input row တွေကို သတ်မှတ်မထားတဲ့ အစဉ်နဲ့ aggregate function ဆီ ပို့ပါတယ်။ အများစုမှာ ဒါက ပြဿနာ မဟုတ်ပါဘူး — ဥပမာ `min` က input တွေကို ဘယ်အစဉ်နဲ့ ရရ ရလဒ် အတူတူပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် aggregate function တချို့က (`array_agg` နဲ့ `string_agg` လိုမျိုး) input row တွေရဲ့ အစဉ်ပေါ် မူတည်တဲ့ ရလဒ်တွေ ထုတ်ပေးပါတယ်။ အဲဒီလို aggregate ကို သုံးတဲ့အခါ — optional `order_by_clause` ကို သုံးပြီး လိုချင်တဲ့ အစဉ်ကို သတ်မှတ်နိုင်ပါတယ်။ `order_by_clause` က query-level `ORDER BY` clause ရဲ့ syntax အတိုင်းပဲ ဖြစ်ပြီး ([အပိုင်း 7.5](/docs/postgresql/queries-order) မှာ ဖော်ပြထားသလို) — သူ့ရဲ့ expression တွေက အမြဲတမ်း expression အစစ်တွေပဲ ဖြစ်ပြီး output column နာမည် ဒါမှမဟုတ် နံပါတ်တွေ မဖြစ်နိုင်တာပဲ ကွာပါတယ်။ ဥပမာ:

```sql
WITH vals (v) AS ( VALUES (1),(3),(4),(3),(2) )
SELECT array_agg(v ORDER BY v DESC) FROM vals;
  array_agg
-------------
 {4,3,3,2,1}
```

`jsonb` က နောက်ဆုံး ကိုက်ညီတဲ့ key ကိုပဲ သိမ်းထားလို့ — သူ့ရဲ့ key တွေရဲ့ အစဉ်က အရေးပါနိုင်ပါတယ်:

```sql
WITH vals (k, v) AS ( VALUES ('key0','1'), ('key1','3'), ('key1','2') )
SELECT jsonb_object_agg(k, v ORDER BY v) FROM vals;
      jsonb_object_agg
----------------------------
 {"key0": "1", "key1": "3"}
```

Argument အများအပြား ယူတဲ့ aggregate function တွေနဲ့ ဆက်ဆံရာမှာ — `ORDER BY` clause က aggregate argument တွေ အားလုံးရဲ့ နောက်မှာ လိုက်ရတာကို သတိပြုပါ။ ဥပမာ — ဒီလို ရေးပါ:

```sql
SELECT string_agg(a, ',' ORDER BY a) FROM table;
```

ဒီလိုတော့ မရေးပါနဲ့:

```sql
SELECT string_agg(a ORDER BY a, ',') FROM table;  -- incorrect
```

နောက် ပုံစံကလည်း syntax အရတော့ valid ပါ — ဒါပေမယ့် ဒါက `ORDER BY` key နှစ်ခုပါတဲ့ single-argument aggregate function ရဲ့ call တစ်ခုကို ကိုယ်စားပြုပါတယ် (ဒုတိယ key က constant ဖြစ်နေလို့ အတော်လေး အသုံးမဝင်ပါဘူး)။

`DISTINCT` ကို `order_by_clause` နဲ့ တွဲသတ်မှတ်ထားရင် — `ORDER BY` expression တွေက `DISTINCT` list ထဲက column တွေကိုပဲ ရည်ညွှန်းလို့ ရပါတယ်။ ဥပမာ:

```sql
WITH vals (v) AS ( VALUES (1),(3),(4),(3),(2) )
SELECT array_agg(DISTINCT v ORDER BY v DESC) FROM vals;
 array_agg
-----------
 {4,3,2,1}
```

အခုထိ ဖော်ပြခဲ့တဲ့အတိုင်း — aggregate ရဲ့ ပုံမှန် argument list ထဲမှာ `ORDER BY` ထည့်တာက — ordering က optional ဖြစ်တဲ့ — general-purpose နဲ့ statistical aggregate တွေအတွက် input row တွေကို စီရာမှာ သုံးပါတယ်။ *ordered-set aggregates* လို့ ခေါ်တဲ့ aggregate function အမျိုးအစားခွဲ တစ်ခုလည်း ရှိပါသေးတယ် — ဒီအတွက် `order_by_clause` က မဖြစ်မနေ လိုအပ်ပါတယ် — အကြောင်းကတော့ ဒီလို aggregate တွေရဲ့ တွက်ချက်မှုက သူ့ရဲ့ input row တွေရဲ့ သီးခြား အစဉ်တစ်ခုနဲ့မှသာ အဓိပ္ပာယ် ရှိလို့ပါ။ Ordered-set aggregate တွေရဲ့ ပုံမှန် ဥပမာတွေက rank နဲ့ percentile တွက်ချက်မှုတွေ ပါဝင်ပါတယ်။ Ordered-set aggregate တစ်ခုအတွက် — `order_by_clause` ကို အပေါ်က syntax ရဲ့ နောက်ဆုံး alternative မှာ ပြထားသလို — `WITHIN GROUP (...)` ထဲမှာ ရေးပါတယ်။ `order_by_clause` ထဲက expression တွေကို — ပုံမှန် aggregate argument တွေလိုပဲ — input row တစ်ခုချင်းစီအတွက် တစ်ခါစီ အကဲဖြတ်ပြီး — `order_by_clause` ရဲ့ လိုအပ်ချက်အတိုင်း စီကာ — aggregate function ဆီ input argument တွေအဖြစ် ပို့ပါတယ်။ (ဒါက `WITHIN GROUP` မပါတဲ့ `order_by_clause` နဲ့တော့ မတူပါဘူး — အဲဒီဟာက aggregate function ရဲ့ argument(s) အဖြစ် သဘောမထားပါဘူး။) `WITHIN GROUP` ရဲ့ ရှေ့မှာ ရှိတဲ့ argument expression တွေကို — `order_by_clause` ထဲမှာ စာရင်းပြုထားတဲ့ *aggregated arguments* တွေနဲ့ ခွဲခြားဖို့ — *direct arguments* လို့ ခေါ်ပါတယ်။ ပုံမှန် aggregate argument တွေနဲ့ မတူဘဲ — direct argument တွေကို input row တစ်ခုချင်းစီအတွက် မဟုတ်ဘဲ — aggregate call တစ်ခုစီအတွက် တစ်ခါပဲ အကဲဖြတ်ပါတယ်။ ဆိုလိုတာက — ဒီထဲမှာ variable တွေ ပါနိုင်တာက အဲဒီ variable တွေကို `GROUP BY` နဲ့ group လုပ်ထားမှသာ ဖြစ်ပါတယ်; ဒီကန့်သတ်ချက်က direct argument တွေကို aggregate expression ထဲမှာ လုံးဝ မထည့်ထားရင်ရော အတူတူပဲ ဖြစ်ပါတယ်။ Direct argument တွေကို ပုံမှန်အားဖြင့် — aggregation တွက်ချက်မှု တစ်ခုစီအတွက် တန်ဖိုးတစ်ခုတည်းအနေနဲ့သာ အဓိပ္ပာယ် ရှိတဲ့ — percentile fraction လိုမျိုး အရာတွေအတွက် သုံးပါတယ်။ Direct argument list က ဗလာ (empty) ဖြစ်လို့လည်း ရပါတယ် — အဲဒီအခါ `(*)` မဟုတ်ဘဲ `()` လို့ပဲ ရေးပါ။ (PostgreSQL က spelling နှစ်မျိုးလုံးကို လက်ခံပါတယ် — ဒါပေမယ့် SQL standard နဲ့ ကိုက်ညီတာက ပထမ နည်းပဲ ဖြစ်ပါတယ်။)

Ordered-set aggregate call တစ်ခုရဲ့ ဥပမာက:

```sql
SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY income) FROM households;
 percentile_cont
-----------------
           50489
```

ဒါက `households` table ရဲ့ `income` column ကနေ — 50th percentile ဒါမှမဟုတ် median (အလယ်ကိန်း) တန်ဖိုးကို ရယူပါတယ်။ ဒီမှာ `0.5` က direct argument ဖြစ်ပါတယ် — percentile fraction က row အလိုက် ပြောင်းလဲနေတဲ့ တန်ဖိုး ဖြစ်တာက အဓိပ္ပာယ် မရှိလို့ပါ။

`FILTER` ကို သတ်မှတ်ထားရင် — `filter_clause` က true လို့ အကဲဖြတ်တဲ့ input row တွေကိုပဲ aggregate function ဆီ ပို့ပြီး — တခြား row တွေကို ဖယ်ပစ်ပါတယ်။ ဥပမာ:

```sql
SELECT
    count(*) AS unfiltered,
    count(*) FILTER (WHERE i < 5) AS filtered
FROM generate_series(1,10) AS s(i);
 unfiltered | filtered
------------+----------
         10 |        4
(1 row)
```

ကြိုတင် သတ်မှတ်ထားတဲ့ (predefined) aggregate function တွေကို [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) မှာ ဖော်ပြထားပါတယ်။ User က တခြား aggregate function တွေကိုလည်း ထပ်ပေါင်းထည့်လို့ ရပါတယ်။

Aggregate expression တစ်ခုကို `SELECT` command ရဲ့ result list သို့မဟုတ် `HAVING` clause ထဲမှာပဲ ထည့်လို့ ရပါတယ်။ `WHERE` စတဲ့ တခြား clause တွေမှာတော့ တားမြစ်ပါတယ် — အကြောင်းကတော့ အဲဒီ clause တွေကို aggregate တွေရဲ့ ရလဒ်တွေ မပေါ်ပေါက်ခင် logical အရ အရင်ဆုံး အကဲဖြတ်လို့ပါ။

Aggregate expression တစ်ခုက subquery ထဲမှာ ပေါ်လာရင် ([အပိုင်း 4.2.11](/docs/postgresql/sql-expressions) နဲ့ [အပိုင်း 9.24](/docs/postgresql/functions-subquery) ကို ကြည့်ပါ) — aggregate ကို ပုံမှန်အားဖြင့် subquery ရဲ့ row တွေအပေါ်မှာ အကဲဖြတ်ပါတယ်။ ဒါပေမယ့် — aggregate ရဲ့ argument တွေ (နဲ့ `filter_clause` ရှိရင် ၎င်းပါ) က outer-level variable တွေပဲ ပါဝင်နေရင်တော့ ခြွင်းချက် ဖြစ်ပါတယ်: အဲဒီအခါ aggregate က အနီးဆုံး ဖြစ်တဲ့ အဲဒီလို outer level နဲ့ သက်ဆိုင်ပြီး — အဲဒီ query ရဲ့ row တွေအပေါ်မှာ အကဲဖြတ်ပါတယ်။ အဲဒီအခါ aggregate expression တစ်ခုလုံးက သူပါဝင်နေတဲ့ subquery အတွက် outer reference ဖြစ်လာပြီး — အဲဒီ subquery ရဲ့ အကဲဖြတ်မှု တစ်ခုခုအပေါ်မှာ constant အဖြစ် ပြုမူပါတယ်။ Result list သို့မဟုတ် `HAVING` clause ထဲမှာပဲ ပေါ်နိုင်တဲ့ ကန့်သတ်ချက်က aggregate သက်ဆိုင်တဲ့ query level အပေါ်မှာ သက်ရောက်ပါတယ်။

### 4.2.8. Window Function Calls (window function ခေါ်ဆိုခြင်း)

*window function call* ဆိုတာ — query တစ်ခုက ရွေးထုတ်လိုက်တဲ့ row တွေထဲက အပိုင်းတစ်ပိုင်းအပေါ်မှာ aggregate နဲ့တူတဲ့ function တစ်ခုကို အသုံးချတာကို ကိုယ်စားပြုပါတယ်။ Non-window aggregate call တွေနဲ့ မတူဘဲ — ဒါက ရွေးထုတ်ထားတဲ့ row တွေကို output row တစ်ခုတည်းထဲ group လုပ်တာနဲ့ မသက်ဆိုင်ပါဘူး — row တစ်ခုချင်းစီက query output ထဲမှာ သီးခြား ဆက်ရှိနေပါတယ်။ ဒါပေမယ့် window function က — window function call ရဲ့ grouping specification (`PARTITION BY` list) အရ — လက်ရှိ row ရဲ့ group ထဲ ပါဝင်မယ့် row တွေ အားလုံးကို ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်။ Window function call ရဲ့ syntax က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

```sql
function_name ([expression [, expression ... ]]) [ FILTER ( WHERE filter_clause ) ] OVER window_name
function_name ([expression [, expression ... ]]) [ FILTER ( WHERE filter_clause ) ] OVER ( window_definition )
function_name ( * ) [ FILTER ( WHERE filter_clause ) ] OVER window_name
function_name ( * ) [ FILTER ( WHERE filter_clause ) ] OVER ( window_definition )
```

ဒီမှာ `window_definition` ရဲ့ syntax က:

```sql
[ existing_window_name ]
[ PARTITION BY expression [, ...] ]
[ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ frame_clause ]
```

Optional `frame_clause` က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

```sql
{ RANGE | ROWS | GROUPS } frame_start [ frame_exclusion ]
{ RANGE | ROWS | GROUPS } BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

`frame_start` နဲ့ `frame_end` တို့က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပြီး —

```sql
UNBOUNDED PRECEDING
offset PRECEDING
CURRENT ROW
offset FOLLOWING
UNBOUNDED FOLLOWING
```

`frame_exclusion` ကတော့ အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

```sql
EXCLUDE CURRENT ROW
EXCLUDE GROUP
EXCLUDE TIES
EXCLUDE NO OTHERS
```

ဒီမှာ `expression` က ကိုယ်တိုင် window function call တွေ မပါဝင်တဲ့ ဘယ် value expression မဆို ဖြစ်ပါတယ်။

`window_name` က query ရဲ့ `WINDOW` clause ထဲမှာ သတ်မှတ်ထားတဲ့ named window specification တစ်ခုကို ရည်ညွှန်းခြင်း ဖြစ်ပါတယ်။ တနည်းအားဖြင့် — `WINDOW` clause ထဲမှာ named window တစ်ခု သတ်မှတ်တဲ့ syntax အတိုင်းပဲ — parentheses ထဲမှာ `window_definition` အပြည့်အစုံ ပေးလို့လည်း ရပါတယ်; အသေးစိတ်အတွက် [SELECT](https://www.postgresql.org/docs/current/sql-select.html) reference page ကို ကြည့်ပါ။ `OVER wname` က `OVER (wname ...)` နဲ့ အတိအကျတော့ ညီမျှမှာ မဟုတ်ဘူးဆိုတာ ထောက်ပြဖို့ သင့်ပါတယ်; နောက်တစ်ခုက window definition ကို ကူးယူပြီး ပြုပြင်ခြင်းကို ဆိုလိုတာဖြစ်ပြီး — ရည်ညွှန်းထားတဲ့ window specification မှာ frame clause ပါနေရင် ငြင်းပယ်ခံရပါလိမ့်မယ်။

`PARTITION BY` clause က query ရဲ့ row တွေကို *partitions* တွေအဖြစ် group လုပ်ပါတယ် — window function က partition တစ်ခုချင်းစီကို သီးခြားစီ ဆောင်ရွက်ပါတယ်။ `PARTITION BY` က query-level `GROUP BY` clause နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် သူ့ရဲ့ expression တွေက အမြဲတမ်း expression အစစ်တွေပဲ ဖြစ်ပြီး output column နာမည် ဒါမှမဟုတ် နံပါတ်တွေ မဖြစ်နိုင်တာပဲ ကွာပါတယ်။ `PARTITION BY` မပါဘဲနဲ့တော့ — query က ထုတ်လုပ်တဲ့ row တွေ အားလုံးကို partition တစ်ခုတည်းအဖြစ် သဘောထားပါတယ်။ `ORDER BY` clause က partition တစ်ခုရဲ့ row တွေကို window function က ဆောင်ရွက်တဲ့ အစဉ်ကို သတ်မှတ်ပါတယ်။ ဒါကလည်း query-level `ORDER BY` clause နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပေမယ့် — အလားတူပဲ output column နာမည် သို့မဟုတ် နံပါတ်တွေကို သုံးလို့ မရပါဘူး။ `ORDER BY` မပါဘဲနဲ့တော့ — row တွေကို သတ်မှတ်မထားတဲ့ အစဉ်နဲ့ ဆောင်ရွက်ပါတယ်။

`frame_clause` က — partition တစ်ခုလုံးအစား frame အပေါ်မှာ ဆောင်ရွက်တဲ့ window function တွေအတွက် — လက်ရှိ partition ရဲ့ အစုအဝေးခွဲ (subset) တစ်ခုဖြစ်တဲ့ *window frame* ကို ဖွဲ့စည်းတဲ့ row အစုကို သတ်မှတ်ပါတယ်။ Frame ထဲက row အစုက ဘယ် row က လက်ရှိ row လဲပေါ်မူတည်ပြီး ပြောင်းလဲနိုင်ပါတယ်။ Frame ကို `RANGE`, `ROWS` သို့မဟုတ် `GROUPS` mode တစ်ခုခုနဲ့ သတ်မှတ်လို့ ရပြီး — mode တိုင်းမှာ frame က `frame_start` ကနေ `frame_end` အထိ ကျယ်ပြန့်ပါတယ်။ `frame_end` ကို ချန်လိုက်ရင် — အဆုံးကို `CURRENT ROW` လို့ ပုံမှန် သတ်မှတ်ပါတယ်။

`frame_start` က `UNBOUNDED PRECEDING` ဆိုရင် frame က partition ရဲ့ ပထမဆုံး row ကနေ စတင်တယ်လို့ ဆိုလိုပြီး — အလားတူပဲ `frame_end` က `UNBOUNDED FOLLOWING` ဆိုရင် frame က partition ရဲ့ နောက်ဆုံး row မှာ ဆုံးတယ်လို့ ဆိုလိုပါတယ်။

`RANGE` သို့မဟုတ် `GROUPS` mode မှာ — `CURRENT ROW` ဆိုတဲ့ `frame_start` က frame က လက်ရှိ row ရဲ့ ပထမဆုံး *peer* row (window ရဲ့ `ORDER BY` clause အရ လက်ရှိ row နဲ့ ညီမျှတယ်လို့ စီထားတဲ့ row) ကနေ စတင်တယ်လို့ ဆိုလိုပြီး — `CURRENT ROW` ဆိုတဲ့ `frame_end` က frame က လက်ရှိ row ရဲ့ နောက်ဆုံး peer row မှာ ဆုံးတယ်လို့ ဆိုလိုပါတယ်။ `ROWS` mode မှာတော့ `CURRENT ROW` က ရိုးရိုး လက်ရှိ row ကိုပဲ ဆိုလိုပါတယ်။

`offset` `PRECEDING` နဲ့ `offset` `FOLLOWING` frame option တွေမှာ — `offset` က variable၊ aggregate function သို့မဟုတ် window function တစ်ခုခုမှ မပါဝင်တဲ့ expression တစ်ခု ဖြစ်ရပါမယ်။ `offset` ရဲ့ အဓိပ္ပာယ်က frame mode ပေါ်မှာ မူတည်ပါတယ်:

- ROWS mode မှာ — offset က null မဟုတ်တဲ့၊ အနုတ်မဟုတ်တဲ့ integer ကို ထွက်ပေးရပြီး — frame က လက်ရှိ row ရဲ့ ရှေ့ သို့မဟုတ် နောက် သတ်မှတ်ထားတဲ့ row အရေအတွက် အကွာမှာ စတင်တာ သို့မဟုတ် ဆုံးတာကို ဆိုလိုပါတယ်။
- GROUPS mode မှာ — offset က အလားတူ null မဟုတ်တဲ့၊ အနုတ်မဟုတ်တဲ့ integer ကို ထွက်ပေးရပြီး — frame က လက်ရှိ row ရဲ့ peer group ရဲ့ ရှေ့ သို့မဟုတ် နောက် သတ်မှတ်ထားတဲ့ peer group အရေအတွက် အကွာမှာ စတင်တာ သို့မဟုတ် ဆုံးတာကို ဆိုလိုပါတယ် — peer group ဆိုတာ `ORDER BY` အစဉ်အရ ညီမျှတဲ့ row အစုတစ်ခု ဖြစ်ပါတယ်။ (GROUPS mode သုံးဖို့ window definition ထဲမှာ `ORDER BY` clause ရှိရပါမယ်။)
- RANGE mode မှာ — ဒီ option တွေက `ORDER BY` clause က column တစ်ခုတည်းကိုပဲ သတ်မှတ်ဖို့ လိုအပ်ပါတယ်။ Offset က frame ထဲက ရှေ့ သို့မဟုတ် နောက် row တွေမှာ အဲဒီ column ရဲ့ တန်ဖိုးနဲ့ လက်ရှိ row မှာ အဲဒီ column ရဲ့ တန်ဖိုးကြားက အများဆုံး ခြားနားချက်ကို သတ်မှတ်ပါတယ်။ Offset expression ရဲ့ data type က ordering column ရဲ့ data type ပေါ်မှာ မူတည်ပါတယ်။ Numeric ordering column တွေအတွက် — ပုံမှန်အားဖြင့် ordering column ရဲ့ type နဲ့ အတူတူ ဖြစ်ပေမယ့် — datetime ordering column တွေအတွက်တော့ interval type ဖြစ်ပါတယ်။ ဥပမာ — ordering column က date သို့မဟုတ် timestamp type ဆိုရင် — `RANGE BETWEEN '1 day' PRECEDING AND '10 days' FOLLOWING` လို့ ရေးနိုင်ပါတယ်။ Offset က null မဟုတ်ဘဲ အနုတ်မဟုတ်ဖို့တော့ လိုအပ်ဆဲပါ — “non-negative (အနုတ်မဟုတ်ခြင်း)” ရဲ့ အဓိပ္ပာယ်က သူ့ရဲ့ data type ပေါ်မှာ မူတည်ပေမယ့်ပေါ့။

ဘယ်လိုပဲ ဖြစ်ဖြစ် — frame ရဲ့ အဆုံးအထိ အကွာအဝေးက partition ရဲ့ အဆုံးအထိ အကွာအဝေးနဲ့ ကန့်သတ်ခံရလို့ — partition ရဲ့ အနားတွေနဲ့ နီးတဲ့ row တွေအတွက်တော့ frame ထဲမှာ တခြားနေရာတွေထက် row တွေ နည်းနိုင်ပါတယ်။

`ROWS` နဲ့ `GROUPS` mode နှစ်ခုလုံးမှာ `0 PRECEDING` နဲ့ `0 FOLLOWING` တို့က `CURRENT ROW` နဲ့ ညီမျှတာကို သတိပြုပါ။ ဒါက ပုံမှန်အားဖြင့် `RANGE` mode မှာလည်း — data type အလိုက် သင့်လျော်တဲ့ “zero” ရဲ့ အဓိပ္ပာယ်နဲ့ဆိုရင် — အလားတူ ဖြစ်ပါတယ်။

`frame_exclusion` option က — frame start နဲ့ frame end option တွေအရ ပါဝင်စရာ ဖြစ်နေရင်တောင် — လက်ရှိ row ဝန်းကျင်က row တွေကို frame ထဲကနေ ဖယ်ထုတ်ခွင့် ပြုပါတယ်။ `EXCLUDE CURRENT ROW` က လက်ရှိ row ကို frame ထဲကနေ ဖယ်ထုတ်ပါတယ်။ `EXCLUDE GROUP` က လက်ရှိ row နဲ့ သူ့ရဲ့ ordering peer တွေကို frame ထဲကနေ ဖယ်ထုတ်ပါတယ်။ `EXCLUDE TIES` က လက်ရှိ row ရဲ့ peer တွေကို frame ထဲကနေ ဖယ်ထုတ်ပေမယ့် — လက်ရှိ row ကိုယ်တိုင်ကတော့ မဖယ်ပါဘူး။ `EXCLUDE NO OTHERS` ကတော့ — လက်ရှိ row ဒါမှမဟုတ် သူ့ရဲ့ peer တွေကို မဖယ်ထုတ်တဲ့ default အပြုအမူကို ရှင်းရှင်းလင်းလင်း ဖော်ပြရုံပဲ ဖြစ်ပါတယ်။

Default framing option က `RANGE UNBOUNDED PRECEDING` ဖြစ်ပြီး — `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` နဲ့ အတူတူပါပဲ။ `ORDER BY` ရှိနေရင် — frame က partition ရဲ့ အစကနေ လက်ရှိ row ရဲ့ နောက်ဆုံး `ORDER BY` peer အထိ row တွေ အားလုံး ဖြစ်ပါတယ်။ `ORDER BY` မရှိရင်တော့ — row တွေ အားလုံးက လက်ရှိ row ရဲ့ peer တွေ ဖြစ်သွားလို့ — partition ရဲ့ row တွေ အားလုံးက window frame ထဲမှာ ပါဝင်တယ်လို့ ဆိုလိုပါတယ်။

ကန့်သတ်ချက်တွေကတော့ — `frame_start` က `UNBOUNDED FOLLOWING` မဖြစ်နိုင်သလို — `frame_end` က `UNBOUNDED PRECEDING` မဖြစ်နိုင်ပါဘူး။ ပြီးတော့ `frame_end` ရဲ့ ရွေးချယ်မှုက အပေါ်က `frame_start` နဲ့ `frame_end` option စာရင်းထဲမှာ `frame_start` ရဲ့ ရွေးချယ်မှုထက် စောတဲ့ နေရာမှာ ရှိနေလို့ မရပါဘူး — ဥပမာ `RANGE BETWEEN CURRENT ROW AND offset PRECEDING` က ခွင့်မပြုပါဘူး။ ဒါပေမယ့် — ဥပမာ — `ROWS BETWEEN 7 PRECEDING AND 8 PRECEDING` ကတော့ — row တစ်ခုမှ ရွေးလို့ မရနိုင်ပေမယ့် — ခွင့်ပြုပါတယ်။

`FILTER` ကို သတ်မှတ်ထားရင် — `filter_clause` က true လို့ အကဲဖြတ်တဲ့ input row တွေကိုပဲ window function ဆီ ပို့ပြီး — တခြား row တွေကို ဖယ်ပစ်ပါတယ်။ Aggregate တွေဖြစ်တဲ့ window function တွေကပဲ `FILTER` clause ကို လက်ခံပါတယ်။

Built-in window function တွေကို [ဇယား 9.67](/docs/postgresql/functions-window) မှာ ဖော်ပြထားပါတယ်။ User က တခြား window function တွေကိုလည်း ထပ်ပေါင်းထည့်လို့ ရပါတယ်။ ပြီးတော့ — built-in ဖြစ်စေ user-defined ဖြစ်စေ — general-purpose သို့မဟုတ် statistical aggregate တစ်ခုခုကိုလည်း window function အဖြစ် သုံးနိုင်ပါတယ်။ (Ordered-set နဲ့ hypothetical-set aggregate တွေကိုတော့ လောလောဆယ် window function အဖြစ် သုံးလို့ မရသေးပါဘူး။)

`*` သုံးထားတဲ့ syntax တွေက — parameter မလိုတဲ့ (parameter-less) aggregate function တွေကို window function အဖြစ် ခေါ်ယူဖို့ သုံးပါတယ် — ဥပမာ `count(*) OVER (PARTITION BY x ORDER BY y)` လိုမျိုးပေါ့။ Asterisk (`*`) ကို window-specific function တွေမှာတော့ ထုံးစံအတိုင်း မသုံးပါဘူး။ Window-specific function တွေက function argument list ထဲမှာ `DISTINCT` သို့မဟုတ် `ORDER BY` သုံးတာကို ခွင့်မပြုပါဘူး။

Window function call တွေကို query ရဲ့ `SELECT` list နဲ့ `ORDER BY` clause ထဲမှာပဲ ခွင့်ပြုပါတယ်။

Window function တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အပိုင်း 3.5](/docs/postgresql/window-functions), [အပိုင်း 9.22](/docs/postgresql/functions-window) နဲ့ [အပိုင်း 7.2.5](/docs/postgresql/queries-table-expressions) တို့မှာ တွေ့နိုင်ပါတယ်။

### 4.2.9. Type Casts (type cast များ)

Type cast ဆိုတာ data type တစ်ခုကနေ နောက် data type တစ်ခုကို ပြောင်းလဲခြင်းကို သတ်မှတ်ပေးတာပါ။ Type cast အတွက် PostgreSQL က ညီမျှတဲ့ syntax နှစ်မျိုး လက်ခံပါတယ်:

```sql
CAST ( expression AS type )
expression::type
```

`CAST` syntax က SQL နဲ့ ကိုက်ညီပြီး — `::` ပါတဲ့ syntax ကတော့ PostgreSQL ရဲ့ သမိုင်းဝင် သုံးစွဲမှု တစ်ခုပါ။

လူသိများတဲ့ type တစ်ခုရဲ့ value expression ပေါ်မှာ cast ကို အသုံးချတဲ့အခါ — ဒါက run-time type conversion (လည်ပတ်ချိန် type ပြောင်းလဲခြင်း) ကို ကိုယ်စားပြုပါတယ်။ သင့်လျော်တဲ့ type conversion operation တစ်ခုကို သတ်မှတ်ထားမှသာ cast က အောင်မြင်ပါတယ်။ ဒါက — [အပိုင်း 4.1.2.7](/docs/postgresql/sql-syntax-lexical) မှာ ပြထားတဲ့ — constant တွေနဲ့ cast သုံးတာနဲ့ သိမ်မွေ့စွာ ကွဲပြားတာကို သတိပြုပါ။ အလှဆင် (unadorned) string literal တစ်ခုပေါ်မှာ အသုံးချတဲ့ cast က literal constant value တစ်ခုကို type တစ်ခု ကနဦး သတ်မှတ်ပေးခြင်းကို ကိုယ်စားပြုလို့ — (string literal ရဲ့ ပါဝင်မှုက အဲဒီ data type အတွက် လက်ခံနိုင်တဲ့ input syntax ဖြစ်ရင်) — type တိုင်းအတွက် အောင်မြင်ပါတယ်။

Value expression တစ်ခု ထုတ်ပေးရမယ့် type နဲ့ ပတ်သက်ပြီး မရှင်းလင်းမှု (ambiguity) မရှိရင် (ဥပမာ — table column တစ်ခုကို assign လုပ်နေတဲ့အခါ) — explicit type cast ကို များသောအားဖြင့် ချန်လိုက်လို့ ရပါတယ်; အဲဒီလို ကိစ္စတွေမှာ system က type cast ကို အလိုအလျောက် အသုံးချပေးပါတယ်။ ဒါပေမယ့် — system catalog တွေထဲမှာ “OK to apply implicitly” (သွယ်ဝိုက်၍ အသုံးချရန် သင့်လျော်သည်) လို့ မှတ်သားထားတဲ့ cast တွေကိုပဲ အလိုအလျောက် cast လုပ်ပေးတာပါ။ တခြား cast တွေကတော့ explicit casting syntax နဲ့ပဲ ခေါ်ယူရပါတယ်။ ဒီကန့်သတ်ချက်က — အံ့အားသင့်စရာ conversion တွေကို တိတ်တဆိတ် အသုံးချမိခြင်းကနေ ကာကွယ်ဖို့ ရည်ရွယ်တာပါ။

Function နဲ့တူတဲ့ (function-like) syntax သုံးပြီးလည်း type cast တစ်ခုကို သတ်မှတ်လို့ ရပါတယ်:

```sql
typename ( expression )
```

ဒါပေမယ့် — ဒါက function name အဖြစ်လည်း valid ဖြစ်တဲ့ type name တွေအတွက်ပဲ အလုပ်လုပ်ပါတယ်။ ဥပမာ — `double precision` ကို ဒီနည်းနဲ့ သုံးလို့ မရပေမယ့် — ညီမျှတဲ့ `float8` ကတော့ ရပါတယ်။ ပြီးတော့ `interval`, `time`, `timestamp` ဆိုတဲ့ နာမည်တွေက syntax ဆန့်ကျင်မှုတွေကြောင့် — double-quoted လုပ်ထားမှသာ ဒီပုံစံနဲ့ သုံးလို့ ရပါတယ်။ ဒါကြောင့် function-like cast syntax ကို သုံးတာက မညီမညွတ် ဖြစ်စေနိုင်လို့ — ရှောင်သင့်ပါတယ်။

> **မှတ်ချက်:** Function-like syntax က တကယ်တော့ function call တစ်ခုပဲ ဖြစ်ပါတယ်။ Standard cast syntax နှစ်မျိုးထဲက တစ်ခုကို run-time conversion လုပ်ဖို့ သုံးတဲ့အခါ — ၎င်းက conversion ဆောင်ရွက်ဖို့ မှတ်ပုံတင်ထားတဲ့ (registered) function တစ်ခုကို အတွင်းပိုင်းမှာ ခေါ်ယူပါတယ်။ ထုံးစံအရ — ဒီ conversion function တွေက သူတို့ရဲ့ output type နဲ့ နာမည်တူညီလို့ — “function-like syntax” ဆိုတာ အောက်ခံ conversion function ကို တိုက်ရိုက် ခေါ်ယူတာထက် ပိုဘာမှ မဟုတ်ပါဘူး။ ဒါက portable application တစ်ခုက အားကိုးသင့်တဲ့ အရာတော့ မဟုတ်ဘူးဆိုတာ သိသာပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် [CREATE CAST](https://www.postgresql.org/docs/current/sql-createcast.html) ကို ကြည့်ပါ။

### 4.2.10. Collation Expressions (collation expression များ)

`COLLATE` clause က expression တစ်ခုရဲ့ collation (စာလုံး စီစဉ်မှု စည်းမျဉ်း) ကို ကျော်လွန် သတ်မှတ်ပေးပါတယ်။ ၎င်းကို သက်ရောက်စေချင်တဲ့ expression ရဲ့ နောက်မှာ ဆက်ထည့်ပါတယ်:

```sql
expr COLLATE collation
```

ဒီမှာ `collation` က schema-qualified ဖြစ်နိုင်တဲ့ identifier တစ်ခုပါ။ `COLLATE` clause က operator တွေထက် ပိုတင်းကျပ်စွာ (tighter) ချိတ်ဆက်လို့ — လိုအပ်ရင် parentheses သုံးနိုင်ပါတယ်။

Collation ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်မထားရင် — database system က expression ထဲမှာ ပါဝင်တဲ့ column တွေကနေ collation တစ်ခုကို ဆင်းသက် ရယူပါတယ် — expression ထဲမှာ column တစ်ခုမှ မပါရင်တော့ database ရဲ့ default collation ကို သုံးပါတယ်။

`COLLATE` clause ရဲ့ အသုံးများတဲ့ ကိစ္စ နှစ်ခုကတော့ — `ORDER BY` clause ထဲမှာ sort order ကို ကျော်လွန် သတ်မှတ်ခြင်း ဖြစ်ပြီး — ဥပမာ:

```sql
SELECT a, b, c FROM tbl WHERE ... ORDER BY a COLLATE "C";
```

ပြီးတော့ — locale-sensitive (နေရာဒေသအလိုက် ပြောင်းလဲတတ်တဲ့) ရလဒ်တွေ ထုတ်ပေးတဲ့ function သို့မဟုတ် operator call တစ်ခုရဲ့ collation ကို ကျော်လွန် သတ်မှတ်ခြင်း — ဥပမာ:

```sql
SELECT * FROM tbl WHERE a > 'foo' COLLATE "C";
```

နောက်ဆုံး ကိစ္စမှာ `COLLATE` clause က ကျွန်ုပ်တို့ သက်ရောက်ချင်တဲ့ operator ရဲ့ input argument တစ်ခုပေါ်မှာ တွဲထားတာကို သတိပြုပါ။ `COLLATE` clause က operator သို့မဟုတ် function call ရဲ့ ဘယ် argument ပေါ်မှာ တွဲထားတယ်ဆိုတာ အရေးမကြီးပါဘူး — အကြောင်းကတော့ operator သို့မဟုတ် function က အသုံးချတဲ့ collation ကို argument တွေ အားလုံးကို ထည့်စဉ်းစားပြီး ဆင်းသက် ရယူလို့ ဖြစ်ပြီး — explicit `COLLATE` clause တစ်ခုက တခြား argument တွေ အားလုံးရဲ့ collation တွေကို ကျော်လွန် သတ်မှတ်ပေးလို့ပါ။ (ဒါပေမယ့် — argument တစ်ခုထက်ပိုတဲ့ နေရာမှာ မကိုက်ညီတဲ့ `COLLATE` clause တွေ တွဲထားရင်တော့ error ပါ။ နောက်ထပ် အသေးစိတ်အတွက် [အပိုင်း 23.2](https://www.postgresql.org/docs/current/collation.html) ကို ကြည့်ပါ။) ဒါကြောင့် — အောက်ပါအတိုင်း ရေးရင်လည်း — အပေါ်က ဥပမာနဲ့ ရလဒ် အတူတူပါပဲ:

```sql
SELECT * FROM tbl WHERE a COLLATE "C" > 'foo';
```

ဒါပေမယ့် ဒါကတော့ error ပါ:

```sql
SELECT * FROM tbl WHERE (a > 'foo') COLLATE "C";
```

အကြောင်းကတော့ — `>` operator ရဲ့ ရလဒ်ပေါ်မှာ collation ကို အသုံးချဖို့ ကြိုးစားနေလို့ပါ — အဲဒီရလဒ်က collatable မဟုတ်တဲ့ `boolean` data type ဖြစ်ပါတယ်။

### 4.2.11. Scalar Subqueries (scalar subquery များ)

Scalar subquery ဆိုတာ — row တစ်ခုတည်းနဲ့ column တစ်ခုတည်းကို ပြန်ပေးတဲ့ — parentheses ထဲမှာ ထည့်ထားတဲ့ သာမန် `SELECT` query တစ်ခု ဖြစ်ပါတယ်။ (Query တွေ ရေးနည်း အချက်အလက်အတွက် [အခန်း 7](https://www.postgresql.org/docs/current/queries.html) ကို ကြည့်ပါ။) အဲဒီ `SELECT` query ကို execute လုပ်ပြီး — ပြန်လာတဲ့ တန်ဖိုးတစ်ခုတည်းကို ဝန်းရံထားတဲ့ value expression ထဲမှာ သုံးပါတယ်။ Row တစ်ခုထက်ပို သို့မဟုတ် column တစ်ခုထက်ပို ပြန်ပေးတဲ့ query ကို scalar subquery အဖြစ် သုံးရင် error ပါ။ (ဒါပေမယ့် — သီးခြား execution တစ်ခုအတွင်းမှာ subquery က row ဘာမှ မပြန်ခဲ့ရင်တော့ error မဟုတ်ဘဲ — scalar ရလဒ်ကို null လို့ မှတ်ယူပါတယ်။) Subquery က ဝန်းရံထားတဲ့ query ကနေ variable တွေကို ရည်ညွှန်းနိုင်ပြီး — အဲဒီ variable တွေက subquery ရဲ့ အကဲဖြတ်မှု တစ်ခုခုအတွင်း constant တွေအဖြစ် ပြုမူပါတယ်။ Subquery တွေ ပါဝင်တဲ့ တခြား expression တွေအတွက် [အပိုင်း 9.24](/docs/postgresql/functions-subquery) ကိုလည်း ကြည့်ပါ။

ဥပမာ — အောက်ပါ query က state တစ်ခုချင်းစီထဲမှာ လူဦးရေ အများဆုံး city ကို ရှာဖွေပေးပါတယ်:

```sql
SELECT name, (SELECT max(pop) FROM cities WHERE cities.state = states.name)
    FROM states;
```

### 4.2.12. Array Constructors (array constructor များ)

Array constructor ဆိုတာ — member element တွေအတွက် တန်ဖိုးတွေကို သုံးပြီး array value တစ်ခု တည်ဆောက်ပေးတဲ့ expression တစ်ခုပါ။ ရိုးရှင်းတဲ့ array constructor တစ်ခုမှာ — key word `ARRAY`, left square bracket `[`, array element value တွေအတွက် (comma တွေနဲ့ ခြားထားတဲ့) expression စာရင်း၊ နောက်ဆုံးမှာ right square bracket `]` တို့ ပါဝင်ပါတယ်။ ဥပမာ:

```sql
SELECT ARRAY[1,2,3+4];
  array
---------
 {1,2,7}
(1 row)
```

ပုံမှန်အားဖြင့် — array element type က member expression တွေရဲ့ common type ဖြစ်ပြီး — `UNION` သို့မဟုတ် `CASE` construct တွေအတွက် သုံးတဲ့ စည်းမျဉ်း အတိုင်းပဲ သတ်မှတ်ပါတယ် ([အပိုင်း 10.5](https://www.postgresql.org/docs/current/typeconv-union-case.html) ကို ကြည့်ပါ)။ Array constructor ကို လိုချင်တဲ့ type အဖြစ် explicit cast လုပ်ပြီး ဒါကို ကျော်လွန် သတ်မှတ်လို့လည်း ရပါတယ် — ဥပမာ:

```sql
SELECT ARRAY[1,2,22.7]::integer[];
  array
----------
 {1,2,23}
(1 row)
```

ဒါက expression တစ်ခုချင်းစီကို array element type အဖြစ် တစ်ခုချင်း cast လုပ်တာနဲ့ ရလဒ် အတူတူပါပဲ။ Casting အကြောင်း ပိုသိရဖို့ [အပိုင်း 4.2.9](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ။

Multidimensional array value တွေကို array constructor တွေ အသိုက်လိုက် (nest) ထည့်ပြီး တည်ဆောက်နိုင်ပါတယ်။ အတွင်းဘက် constructor တွေမှာတော့ key word `ARRAY` ကို ချန်လိုက်လို့ ရပါတယ်။ ဥပမာ — အောက်ပါတို့က ရလဒ် အတူတူ ထုတ်ပေးပါတယ်:

```sql
SELECT ARRAY[ARRAY[1,2], ARRAY[3,4]];
     array
---------------
 {{1,2},{3,4}}
(1 row)

SELECT ARRAY[[1,2],[3,4]];
     array
---------------
 {{1,2},{3,4}}
(1 row)
```

Multidimensional array တွေက rectangular (စတုဂံပုံ ညီညာ) ဖြစ်ရမှာမို့ — အဆင့်တူ အတွင်းဘက် constructor တွေက အတိုင်းအတာ (dimension) အတူတူရှိတဲ့ sub-array တွေကို ထုတ်ပေးရပါတယ်။ အပြင်ဘက် `ARRAY` constructor ပေါ်မှာ အသုံးချလိုက်တဲ့ cast တစ်ခုခုက အတွင်းဘက် constructor တွေ အားလုံးဆီ အလိုအလျောက် ကူးသွားပါတယ်။

Multidimensional array constructor ရဲ့ element တွေက — sub-`ARRAY` construct တစ်ခုပဲ မဟုတ်ဘဲ — သင့်လျော်တဲ့ ပုံစံ array တစ်ခုကို ထွက်ပေးတဲ့ ဘယ်အရာမဆို ဖြစ်နိုင်ပါတယ်။ ဥပမာ:

```sql
CREATE TABLE arr(f1 int[], f2 int[]);

INSERT INTO arr VALUES (ARRAY[[1,2],[3,4]], ARRAY[[5,6],[7,8]]);

SELECT ARRAY[f1, f2, '{{9,10},{11,12}}'::int[]] FROM arr;
                     array
------------------------------------------------
 {{{1,2},{3,4}},{{5,6},{7,8}},{{9,10},{11,12}}}
(1 row)
```

Empty array တစ်ခုကိုလည်း တည်ဆောက်လို့ ရပါတယ် — ဒါပေမယ့် type မရှိတဲ့ array ဆိုတာ မဖြစ်နိုင်လို့ — empty array ကို လိုချင်တဲ့ type အဖြစ် explicit cast လုပ်ပေးဖို့ မဖြစ်မနေ လိုအပ်ပါတယ်။ ဥပမာ:

```sql
SELECT ARRAY[]::integer[];
 array
-------
 {}
(1 row)
```

Subquery တစ်ခုရဲ့ ရလဒ်တွေကနေလည်း array တစ်ခုကို တည်ဆောက်လို့ ရပါတယ်။ ဒီပုံစံမှာ — array constructor ကို key word `ARRAY` နဲ့ ရေးပြီး — ၎င်းနောက်မှာ (bracket မဟုတ်ဘဲ) parentheses ထဲမှာ ထည့်ထားတဲ့ subquery လိုက်ပါတယ်။ ဥပမာ:

```sql
SELECT ARRAY(SELECT oid FROM pg_proc WHERE proname LIKE 'bytea%');
                              array
------------------------------------------------------------------
 {2011,1954,1948,1952,1951,1244,1950,2005,1949,1953,2006,31,2412}
(1 row)

SELECT ARRAY(SELECT ARRAY[i, i*2] FROM generate_series(1,5) AS a(i));
              array
----------------------------------
 {{1,2},{2,4},{3,6},{4,8},{5,10}}
(1 row)
```

Subquery က column တစ်ခုတည်းကိုပဲ ပြန်ပေးရပါမယ်။ Subquery ရဲ့ output column က non-array type ဖြစ်ရင် — ရလဒ် one-dimensional array မှာ subquery ရလဒ်ထဲက row တစ်ခုချင်းစီအတွက် element တစ်ခုစီ ပါဝင်ပြီး — element type က subquery ရဲ့ output column ရဲ့ type နဲ့ ကိုက်ညီပါတယ်။ Subquery ရဲ့ output column က array type ဖြစ်ရင်တော့ — ရလဒ်က type အတူတူပေမယ့် အတိုင်းအတာ တစ်ခု ပိုမြင့်တဲ့ array ဖြစ်ပါတယ်; ဒီကိစ္စမှာ subquery ရဲ့ row တွေ အားလုံးက အတိုင်းအတာ အတူတူရှိတဲ့ array တွေကို ထွက်ပေးရပါမယ် — မဟုတ်ရင် ရလဒ်က rectangular မဖြစ်နိုင်ပါဘူး။

`ARRAY` နဲ့ တည်ဆောက်ထားတဲ့ array value တစ်ခုရဲ့ subscript တွေက အမြဲတမ်း 1 ကနေ စတင်ပါတယ်။ Array တွေအကြောင်း ပိုသိရဖို့ [အပိုင်း 8.15](https://www.postgresql.org/docs/current/arrays.html) ကို ကြည့်ပါ။

### 4.2.13. Row Constructors (row constructor များ)

Row constructor ဆိုတာ — member field တွေအတွက် တန်ဖိုးတွေကို သုံးပြီး row value (composite value လို့လည်း ခေါ်) တစ်ခု တည်ဆောက်ပေးတဲ့ expression တစ်ခုပါ။ Row constructor တစ်ခုမှာ — key word `ROW`, left parenthesis, row field value တွေအတွက် (comma တွေနဲ့ ခြားထားတဲ့) expression သုည ခု သို့မဟုတ် ထိုထက်ပို၊ နောက်ဆုံးမှာ right parenthesis တို့ ပါဝင်ပါတယ်။ ဥပမာ:

```sql
SELECT ROW(1,2.5,'this is a test');
```

List ထဲမှာ expression တစ်ခုထက်ပို ရှိနေရင် key word `ROW` က optional ပါ။

Row constructor တစ်ခုမှာ `rowvalue.*` ဆိုတဲ့ syntax ပါဝင်နိုင်ပြီး — `.*` syntax ကို `SELECT` list ရဲ့ ထိပ်ဆုံး အဆင့်မှာ သုံးတဲ့အခါ ဖြစ်သလိုပဲ — row value ရဲ့ element တွေရဲ့ စာရင်းအဖြစ် ချဲ့ထွက်ပေးပါတယ် ([အပိုင်း 8.16.5](https://www.postgresql.org/docs/current/rowtypes.html#ROWTYPES-USAGE) ကို ကြည့်ပါ)။ ဥပမာ — table `t` မှာ column `f1` နဲ့ `f2` ရှိရင် — အောက်ပါတို့က အတူတူပါ:

```sql
SELECT ROW(t.*, 42) FROM t;
SELECT ROW(t.f1, t.f2, 42) FROM t;
```

> **မှတ်ချက်:** PostgreSQL 8.2 မတိုင်ခင် — `.*` syntax ကို row constructor တွေမှာ ချဲ့ထွက်မပေးခဲ့လို့ — `ROW(t.*, 42)` လို့ ရေးတာက — ပထမ field က နောက် row value တစ်ခု ဖြစ်တဲ့ — field နှစ်ခုပါတဲ့ row တစ်ခုကို ဖန်တီးပေးပါတယ်။ အပြုအမူ အသစ်ကတော့ များသောအားဖြင့် ပိုအသုံးဝင်ပါတယ်။ Nested row value တွေရဲ့ အပြုအမူ အဟောင်း လိုအပ်ရင်တော့ — inner row value ကို `.*` မပါဘဲ ရေးပါ — ဥပမာ `ROW(t, 42)` လိုမျိုးပေါ့။

ပုံမှန်အားဖြင့် — `ROW` expression တစ်ခုက ဖန်တီးတဲ့ value က anonymous record type တစ်ခု ဖြစ်ပါတယ်။ လိုအပ်ရင် — ၎င်းကို named composite type တစ်ခုအဖြစ် cast လုပ်လို့ ရပါတယ် — table တစ်ခုရဲ့ row type ဖြစ်စေ၊ `CREATE TYPE AS` နဲ့ ဖန်တီးထားတဲ့ composite type ဖြစ်စေပါ။ မရှင်းလင်းမှု (ambiguity) ရှောင်ဖို့ explicit cast လိုအပ်နိုင်ပါတယ်။ ဥပမာ:

```sql
CREATE TABLE mytable(f1 int, f2 float, f3 text);

CREATE FUNCTION getf1(mytable) RETURNS int AS 'SELECT $1.f1' LANGUAGE SQL;

-- No cast needed since only one getf1() exists
SELECT getf1(ROW(1,2.5,'this is a test'));
 getf1
-------
     1
(1 row)

CREATE TYPE myrowtype AS (f1 int, f2 text, f3 numeric);

CREATE FUNCTION getf1(myrowtype) RETURNS int AS 'SELECT $1.f1' LANGUAGE SQL;

-- Now we need a cast to indicate which function to call:
SELECT getf1(ROW(1,2.5,'this is a test'));
ERROR:  function getf1(record) is not unique

SELECT getf1(ROW(1,2.5,'this is a test')::mytable);
 getf1
-------
     1
(1 row)

SELECT getf1(CAST(ROW(11,'this is a test',2.5) AS myrowtype));
 getf1
-------
    11
(1 row)
```

Row constructor တွေကို — composite-type table column တစ်ခုထဲမှာ သိမ်းဆည်းဖို့ ဒါမှမဟုတ် composite parameter လက်ခံတဲ့ function တစ်ခုဆီ ပို့ဖို့ — composite value တွေ တည်ဆောက်ရာမှာ သုံးနိုင်ပါတယ်။ ပြီးတော့ — [အပိုင်း 9.2](/docs/postgresql/functions-comparison) မှာ ဖော်ပြထားတဲ့အတိုင်း standard comparison operator တွေ သုံးပြီး row တစ်ခုချင်းစီကို စမ်းသပ်ဖို့လည်း ဖြစ်နိုင်ပြီး — [အပိုင်း 9.25](/docs/postgresql/functions-comparisons) မှာ ဖော်ပြထားသလို row တစ်ခုကို နောက် row တစ်ခုနဲ့ နှိုင်းယှဉ်ဖို့လည်း ရပါတယ်။ Subquery တွေနဲ့ တွဲသုံးတာကိုလည်း — [အပိုင်း 9.24](/docs/postgresql/functions-subquery) မှာ ဆွေးနွေးထားသလို — လုပ်နိုင်ပါတယ်။

### 4.2.14. Expression Evaluation Rules (expression အကဲဖြတ်ခြင်း စည်းမျဉ်းများ)

Subexpression တွေကို အကဲဖြတ်တဲ့ အစဉ်က သတ်မှတ်ထားတာ မဟုတ်ပါဘူး။ အထူးသဖြင့် — operator သို့မဟုတ် function တစ်ခုရဲ့ input တွေကို ဘယ်ဘက်ကနေ ညာဘက် (left-to-right) ဒါမှမဟုတ် တခြား ပုံသေ အစဉ်တစ်ခုခုနဲ့ အကဲဖြတ်ဖို့ မလိုအပ်ပါဘူး။

ပြီးတော့ — expression တစ်ခုရဲ့ ရလဒ်ကို သူ့ရဲ့ အစိတ်အပိုင်း တချို့ကိုပဲ အကဲဖြတ်ပြီး ဆုံးဖြတ်လို့ ရနိုင်ရင် — တခြား subexpression တွေကို လုံးဝ အကဲဖြတ်ချင်မှ မဖြတ်ဘဲ ထားလိုက်နိုင်ပါတယ်။ ဥပမာ — ဒီလိုရေးခဲ့မယ်ဆိုရင်:

```sql
SELECT true OR somefunc();
```

`somefunc()` က (ဖြစ်နိုင်ခြေ များပြီး) လုံးဝ ခေါ်ယူခံရမှာ မဟုတ်ပါဘူး။ ဒီလိုရေးခဲ့မယ်ဆိုရင်လည်း အလားတူပဲ:

```sql
SELECT somefunc() OR true;
```

ဒါက — programming language တချို့မှာ တွေ့ရတဲ့ — Boolean operator တွေရဲ့ left-to-right “short-circuiting” နဲ့တော့ အတူတူ မဟုတ်ပါဘူးဆိုတာ သတိပြုပါ။

အကျိုးဆက်အနေနဲ့ — side effect (ဘေးထွက် သက်ရောက်မှု) ရှိတဲ့ function တွေကို ရှုပ်ထွေးတဲ့ expression တွေရဲ့ အစိတ်အပိုင်းအဖြစ် သုံးတာက မသင့်ပါဘူး။ `WHERE` နဲ့ `HAVING` clause တွေမှာ side effect သို့မဟုတ် အကဲဖြတ်မှု အစဉ်ကို အားကိုးတာက အထူးသဖြင့် အန္တရာယ် များပါတယ် — အဲဒီ clause တွေကို execution plan တစ်ခု ရေးဆွဲရာမှာ ကျယ်ကျယ်ပြန့်ပြန့် ပြန်လည် ဆောင်ရွားလေ့ ရှိလို့ပါ။ အဲဒီ clause တွေထဲက Boolean expression တွေ (`AND`/`OR`/`NOT` ပေါင်းစပ်မှုများ) ကို Boolean algebra ရဲ့ နိယာမတွေက ခွင့်ပြုတဲ့ ဘယ်ပုံစံနဲ့မဆို ပြန်စီပြောင်းလဲနိုင်ပါတယ်။

အကဲဖြတ်မှု အစဉ်ကို အတင်းအကျပ် သတ်မှတ်ဖို့ မရှိမဖြစ် လိုအပ်တဲ့အခါ — `CASE` construct ([အပိုင်း 9.18](/docs/postgresql/functions-conditional) ကို ကြည့်ပါ) ကို သုံးနိုင်ပါတယ်။ ဥပမာ — ဒါက `WHERE` clause ထဲမှာ zero နဲ့ စားတာကို ရှောင်ဖို့ ကြိုးစားတဲ့ မယုံကြည်ထိုက်တဲ့ နည်းလမ်း တစ်ခုပါ:

```sql
SELECT ... WHERE x > 0 AND y/x > 1.5;
```

ဒါပေမယ့် ဒါကတော့ အန္တရာယ် ကင်းပါတယ်:

```sql
SELECT ... WHERE CASE WHEN x > 0 THEN y/x > 1.5 ELSE false END;
```

ဒီလိုပုံစံနဲ့ သုံးတဲ့ `CASE` construct က optimization ကြိုးစားမှုတွေကို အနှောင့်အယှက် ဖြစ်စေလို့ — မလိုအပ်ဘဲ မသုံးသင့်ပါဘူး။ (ဒီ သီးခြား ဥပမာမှာတော့ — `y > 1.5*x` လို့ ရေးပြီး ပြဿနာကို ရှောင်လွှဲတာက ပိုကောင်းပါတယ်။)

ဒါပေမယ့် `CASE` က ဒီလို ပြဿနာတွေအတွက် ကုသနည်း (cure-all) တော့ မဟုတ်ပါဘူး။ အပေါ်မှာ သရုပ်ပြထားတဲ့ နည်းစနစ်ရဲ့ ကန့်သတ်ချက် တစ်ခုက — constant subexpression တွေကို စောစော အကဲဖြတ်တာကို မကာကွယ်နိုင်တာပါ။ [အပိုင်း 36.7](https://www.postgresql.org/docs/current/xfunc-volatility.html) မှာ ဖော်ပြထားသလို — `IMMUTABLE` လို့ မှတ်သားထားတဲ့ function တွေနဲ့ operator တွေကို — execute လုပ်ချိန်မှာ မဟုတ်ဘဲ — query planning လုပ်ချိန်မှာ အကဲဖြတ်နိုင်ပါတယ်။ ဒါကြောင့် ဥပမာ —

```sql
SELECT CASE WHEN x > 0 THEN x ELSE 1/0 END FROM tab;
```

ဆိုတာ — table ထဲက row တိုင်းမှာ `x > 0` ဖြစ်ပြီး run time မှာ `ELSE` ဘာသာရပ် (arm) ထဲ ဘယ်တော့မှ မရောက်ဘူးဆိုတောင် — planner က constant subexpression ကို ရိုးရှင်းအောင် လုပ်ဖို့ ကြိုးစားတာကြောင့် — division-by-zero failure (သုညနဲ့ စားလို့ မအောင်မြင်မှု) ဖြစ်နိုင်ခြေ များပါတယ်။

အဲဒီ သီးခြား ဥပမာက ရယ်စရာ ပုံစံလို ထင်ရပေမယ့် — constant တွေ ပါဝင်နေတာကို သိသာစွာ မမြင်ရတဲ့ ဆက်စပ် ကိစ္စတွေက function တွေထဲမှာ execute လုပ်တဲ့ query တွေမှာ ဖြစ်ပွားနိုင်ပါတယ် — အကြောင်းကတော့ function argument တွေနဲ့ local variable တွေရဲ့ တန်ဖိုးတွေကို planning အတွက် constant တွေအဖြစ် query ထဲကို ထည့်သွင်းနိုင်လို့ပါ။ PL/pgSQL function တွေထဲမှာ ဥပမာ — အန္တရာယ် များတဲ့ တွက်ချက်မှုတစ်ခုကို ကာကွယ်ဖို့ `IF`-`THEN`-`ELSE` statement ကို သုံးတာက — `CASE` expression ထဲမှာ အသိုက်လိုက် ထည့်ထားတာထက် များစွာ ပိုလုံခြုံပါတယ်။

အလားတူ ကန့်သတ်ချက် နောက်တစ်ခုကတော့ — `CASE` က သူ့ထဲမှာ ပါဝင်တဲ့ aggregate expression တစ်ခုရဲ့ အကဲဖြတ်မှုကို မကာကွယ်နိုင်တာပါ — aggregate expression တွေက `SELECT` list သို့မဟုတ် `HAVING` clause ထဲက တခြား expression တွေကို မစဉ်းစားခင် ကြိုတင် တွက်ချက်ခံရလို့ပါ။ ဥပမာ — အောက်ပါ query က ကာကွယ်ထားပုံ ပေါက်ပေမယ့် — division-by-zero error ဖြစ်စေနိုင်ပါတယ်:

```sql
SELECT CASE WHEN min(employees) > 0
            THEN avg(expenses / employees)
       END
    FROM departments;
```

`min()` နဲ့ `avg()` aggregate တွေက input row တွေ အားလုံးအပေါ်မှာ တစ်ပြိုင်တည်း (concurrently) တွက်ချက်လို့ — row တစ်ခုခုမှာ `employees` က zero ဖြစ်နေရင် — `min()` ရဲ့ ရလဒ်ကို စမ်းသပ်ဖို့ အခွင့်အရေး မရရှိခင် division-by-zero error ဖြစ်သွားပါလိမ့်မယ်။ အဲဒီအစား — ပြဿနာ ရှိတဲ့ input row တွေ aggregate function ဆီ ပထမနေရာကတည်းက မရောက်အောင် — `WHERE` သို့မဟုတ် `FILTER` clause ကို သုံးပါ။
