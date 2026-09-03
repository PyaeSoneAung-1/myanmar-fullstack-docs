---
title: "Select Lists (select list များ)"
description: "SELECT ရဲ့ select list အကြောင်း — select list item များ, column label (output column နာမည် သတ်မှတ်ခြင်း), DISTINCT (ထပ်နေသော row များ ဖယ်ရှားခြင်း)"
order: 42
source: "https://www.postgresql.org/docs/current/queries-select-lists.html"
status: translated
updated: 2026-09-03
---

## 7.3. Select Lists (select list များ)

- **7.3.1. Select-List Items (select list ထဲက item များ)**
- **7.3.2. Column Labels (column label များ)**
- **7.3.3. DISTINCT (ထပ်နေသော row များ ဖယ်ရှားခြင်း)**

ပြီးခဲ့တဲ့ section မှာ ဖော်ပြခဲ့တဲ့အတိုင်း — `SELECT` command ထဲက table expression က table တွေ၊ view တွေ ပေါင်းစပ်ခြင်း၊ row တွေ ဖယ်ရှားခြင်း၊ grouping (အုပ်စုဖွဲ့ခြင်း) စတာတွေကို လုပ်ဆောင်ပြီး — intermediate virtual table (အလယ်အလတ် virtual table) တစ်ခုကို တည်ဆောက်ပါတယ်။ ဒီ table ကို နောက်ဆုံးမှာ *select list* က ဆက်လက် processing (လုပ်ဆောင်ခြင်း) လုပ်ဖို့ လွှဲပြောင်းပေးလိုက်ပါတယ်။ Select list က အဲဒီ intermediate table ရဲ့ ဘယ် column တွေကို တကယ် output (ထုတ်ပေး) မလဲဆိုတာကို ဆုံးဖြတ်ပါတယ်။

### 7.3.1. Select-List Items (select list ထဲက item များ)

အရိုးရှင်းဆုံး select list ကတော့ `*` ဖြစ်ပြီး — table expression က ထုတ်လုပ်တဲ့ column အားလုံးကို ထုတ်ပေးပါတယ်။ တခြားအနေနဲ့ဆိုရင် — select list ဆိုတာ value expression (တန်ဖိုး expression) တွေကို comma နဲ့ ခြားထားတဲ့ စာရင်း ဖြစ်ပါတယ် ([အပိုင်း 4.2](/docs/postgresql/sql-expressions) မှာ သတ်မှတ်ထားတဲ့အတိုင်း)။ ဥပမာ — column name တွေရဲ့ စာရင်း ဖြစ်နိုင်ပါတယ်:

```sql
SELECT a, b, c FROM ...
```

`a`, `b` နဲ့ `c` ဆိုတဲ့ column name တွေက — `FROM` clause ထဲမှာ ရည်ညွှန်းထားတဲ့ table တွေရဲ့ column တွေရဲ့ တကယ့် နာမည်တွေ ဖြစ်စေ၊ [အပိုင်း 7.2.1.2](/docs/postgresql/queries-table-expressions) မှာ ရှင်းပြထားတဲ့အတိုင်း သူတို့ကို ပေးထားတဲ့ alias တွေ ဖြစ်စေ — နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။ Select list ထဲမှာ ရနိုင်တဲ့ name space (နာမည် သုံးနိုင်တဲ့ နယ်ပယ်) က `WHERE` clause ထဲကနဲ့ အတူတူပဲ ဖြစ်ပါတယ် — grouping သုံးထားရင်တော့ — `HAVING` clause ထဲကနဲ့ အတူတူ ဖြစ်ပါတယ်။

Query ထဲမှာ table တစ်ခုထက်ပိုပြီး နာမည်တူတဲ့ column ပါနေရင် — column ရဲ့ table name ကိုပါ ထည့်ပေးရပါတယ် — ဥပမာ:

```sql
SELECT tbl1.a, tbl2.a, tbl1.b FROM ...
```

Table အများကြီးနဲ့ အလုပ်လုပ်တဲ့အခါ — table တစ်ခုတည်းရဲ့ column အားလုံးကို တောင်းခံတာကလည်း အသုံးဝင်ပါတယ်:

```sql
SELECT tbl1.*, tbl2.a FROM ...
```

`table_name.*` ဆိုတဲ့ notation (ရေးသားပုံ) အကြောင်း ပိုပြီး သိချင်ရင် [အပိုင်း 8.16.5](https://www.postgresql.org/docs/current/rowtypes.html#ROWTYPES-USAGE) ကို ကြည့်ပါ။

Select list ထဲမှာ ကြိုက်ရာရာ (arbitrary) value expression တစ်ခုကို သုံးမယ်ဆိုရင် — သဘောတရားအရ ၎င်းက ပြန်ပေးမယ့် table ထဲကို virtual column (စိတ်ကူးယဉ် column) အသစ် တစ်ခု ထပ်ဖြည့်ပေးပါတယ်။ Value expression ကို ရလဒ် row တစ်ခုချင်းစီအတွက် တစ်ကြိမ်စီ အကဲဖြတ် (evaluate) လုပ်ပြီး — column reference တွေ နေရာမှာ အဲဒီ row ရဲ့ တန်ဖိုးတွေကို အစားထိုးပါတယ်။ ဒါပေမယ့် — select list ထဲက expression တွေက `FROM` clause ရဲ့ table expression ထဲက column တွေကို ရည်ညွှန်းစရာ မလိုပါဘူး — ဥပမာ — constant arithmetic expression (ပုံသေ ဂဏန်းသင်္ချာ expression) တွေ ဖြစ်နိုင်ပါတယ်။

### 7.3.2. Column Labels (column label များ)

Select list ထဲက entry တွေကို — နောက်ဆက်တွဲ processing အတွက် — ဥပမာ — `ORDER BY` clause ထဲမှာ သုံးဖို့ ဒါမှမဟုတ် client application က display (ပြသ) ဖို့အတွက် — နာမည်တွေ သတ်မှတ်ပေးလို့ ရပါတယ်။ ဥပမာ:

```sql
SELECT a AS value, b + c AS sum FROM ...
```

`AS` သုံးပြီး output column name (ထုတ်ပေးမယ့် column ရဲ့ နာမည်) ကို မသတ်မှတ်ရင် — system က ပုံမှန် (default) column name တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ရိုးရှင်းတဲ့ column reference တွေအတွက်ဆိုရင် — ဒါက ရည်ညွှန်းထားတဲ့ column ရဲ့ နာမည် ဖြစ်ပါတယ်။ Function call တွေအတွက်ဆိုရင် — function ရဲ့ နာမည် ဖြစ်ပါတယ်။ ရှုပ်ထွေးတဲ့ expression တွေအတွက်ကတော့ — system က ယေဘုယျ နာမည် (generic name) တစ်ခုကို ဖန်တီး (generate) ပေးပါတယ်။

`AS` key word က များသောအားဖြင့် ချန်လိုက်လို့ ရပါတယ် — ဒါပေမယ့် လိုချင်တဲ့ column name က PostgreSQL ရဲ့ key word တစ်ခုနဲ့ တိုက်ဆိုင်နေတဲ့ အခြေအနေတချို့မှာတော့ — မရှင်းလင်းမှု (ambiguity) မဖြစ်အောင် — `AS` ကို ရေးရပါမယ် ဒါမှမဟုတ် column name ကို double quote နဲ့ ထည့်ရေးရပါတယ်။ (ဘယ် key word တွေက column label အဖြစ် သုံးဖို့ `AS` လိုအပ်လဲဆိုတာကို [နောက်ဆက်တွဲ C](https://www.postgresql.org/docs/current/sql-keywords-appendix.html) မှာ ပြထားပါတယ်။) ဥပမာ — `FROM` က အဲဒီလို key word တစ်ခု ဖြစ်လို့ — အောက်က ပုံစံက အလုပ်မလုပ်ပါဘူး:

```sql
SELECT a from, b + c AS sum FROM ...
```

ဒါပေမယ့် အောက်က ပုံစံ နှစ်ခုလုံးကတော့ အလုပ်လုပ်ပါတယ်:

```sql
SELECT a AS from, b + c AS sum FROM ...
SELECT a "from", b + c AS sum FROM ...
```

နောင်မှာ key word အသစ်တွေ ထပ်တိုးလာနိုင်တာကို အပြည့်အဝ ကြိုတင် ကာကွယ်နိုင်ဖို့ — output column name ကို `AS` နဲ့ ရေးတာပဲဖြစ်ဖြစ်၊ double quote နဲ့ ထည့်တာပဲဖြစ်ဖြစ် — အမြဲတမ်း လုပ်ဆောင်ဖို့ အကြံပြုပါတယ်။

> **မှတ်ချက်:** ဒီနေရာမှာ output column တွေကို နာမည်ပေးပုံက `FROM` clause မှာ နာမည်ပေးပုံနဲ့ မတူပါဘူး ([အပိုင်း 7.2.1.2](/docs/postgresql/queries-table-expressions) ကို ကြည့်ပါ)။ Column တစ်ခုတည်းကို နာမည် နှစ်ကြိမ် ပြောင်းလဲဖို့ ဖြစ်နိုင်ပေမယ့် — select list ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်ကသာ ရှေ့ဆက် သယ်ဆောင်သွားမယ့် နာမည် ဖြစ်ပါတယ်။

### 7.3.3. DISTINCT (ထပ်နေသော row များ ဖယ်ရှားခြင်း)

Select list ကို လုပ်ဆောင်ပြီးသွားပြီဆိုရင် — result table ကို duplicate row (ထပ်နေတဲ့ row) တွေ ဖယ်ရှားဖို့ — လိုအပ်ရင် — ရွေးချယ်နိုင်ပါတယ်။ ဒါကို သတ်မှတ်ဖို့ `DISTINCT` key word ကို `SELECT` ရဲ့ နောက်မှာ တိုက်ရိုက် ရေးပါတယ်:

```sql
SELECT DISTINCT select_list ...
```

(`DISTINCT` အစား — row အားလုံးကို ထိန်းထားတဲ့ ပုံမှန် အပြုအမူကို သတ်မှတ်ဖို့ — `ALL` key word ကိုလည်း သုံးနိုင်ပါတယ်။)

ရှင်းနေတာက — row နှစ်ခုဟာ column value အနည်းဆုံး တစ်ခုမှာ ကွဲပြားနေရင် — distinct (မတူညီသော) လို့ မှတ်ယူပါတယ်။ ဒီနှိုင်းယှဉ်မှုမှာတော့ null value တွေကို တူညီတယ်လို့ မှတ်ယူပါတယ်။

တနည်းအားဖြင့် — ဘယ် row တွေကို distinct အဖြစ် မှတ်ယူမလဲဆိုတာကို ကြိုက်ရာရာ expression တစ်ခုနဲ့လည်း ဆုံးဖြတ်နိုင်ပါတယ်:

```sql
SELECT DISTINCT ON (expression [, expression ...]) select_list ...
```

ဒီနေရာမှာ `expression` က row အားလုံးအတွက် အကဲဖြတ်ခံရတဲ့ ကြိုက်ရာရာ value expression တစ်ခု ဖြစ်ပါတယ်။ Expression အားလုံး တူညီနေတဲ့ row အစုတစ်စုကို duplicate (ထပ်နေသော) လို့ မှတ်ယူပြီး — အဲဒီအစုထဲက ပထမဆုံး row တစ်ခုကိုပဲ output ထဲမှာ ထားရှိပါတယ်။ `DISTINCT` filter ဆီ ရောက်လာတဲ့ row တွေရဲ့ အစဉ်ကို အာမခံနိုင်လောက်အောင် — query ကို column အလုံအလောက်နဲ့ စီထားမှသာလည်း — အစုထဲက "ပထမဆုံး row" က ကြိုတင် ခန့်မှန်းလို့ ရနိုင်တယ်ဆိုတာ သတိပြုပါ။ (`DISTINCT ON` ရဲ့ လုပ်ဆောင်မှုက `ORDER BY` နဲ့ စီပြီးမှသာ ဖြစ်ပေါ်ပါတယ်။)

`DISTINCT ON` clause က SQL standard ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး — ပြီးတော့ ၎င်းရဲ့ ရလဒ်တွေက မသေချာမရေရာတဲ့ (indeterminate) သဘော ရှိနိုင်လို့ — တခါတရံမှာ style မကောင်းဘူးလို့လည်း မှတ်ယူခံရပါတယ်။ `GROUP BY` နဲ့ `FROM` ထဲက subquery တွေကို ဆင်ခြင်ဉာဏ်ရှိရှိ သုံးမယ်ဆိုရင် — ဒီ construct (တည်ဆောက်ပုံ) ကို ရှောင်လို့ ရပါတယ် — ဒါပေမယ့် မကြာခဏဆိုသလို ၎င်းက အဆင်ပြေဆုံး ရွေးချယ်စရာ ဖြစ်နေတတ်ပါတယ်။
