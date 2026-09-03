---
title: "Table Basics (table အခြေခံ)"
description: "Relational database ထဲက table ရဲ့ အခြေခံ — row/column သဘောတရား၊ data type များ၊ CREATE TABLE နဲ့ table ဖန်တီးခြင်း၊ DROP TABLE နဲ့ table ဖျက်ခြင်း"
order: 19
source: "https://www.postgresql.org/docs/current/ddl-basics.html"
status: translated
updated: 2026-09-03
---

## 5.1. Table Basics (table အခြေခံ)

Relational database တစ်ခုထဲက table က စာရွက်ပေါ်က table (ဇယား) တစ်ခုနဲ့ တော်တော်လေး ဆင်တူပါတယ် — row တွေနဲ့ column တွေ ပါဝင်ပါတယ်။ Column တွေရဲ့ အရေအတွက်နဲ့ အစီအစဉ်က ပုံသေ ဖြစ်ပြီး — column တစ်ခုချင်းစီမှာ နာမည် ရှိပါတယ်။ Row တွေရဲ့ အရေအတွက်ကတော့ ပြောင်းလဲနိုင်ပါတယ် — အဲဒါက သတ်မှတ်ထားတဲ့ အချိန်တစ်ခုမှာ data ဘယ်လောက် သိမ်းထားလဲဆိုတာကို ထင်ဟပ်ပါတယ်။ SQL က table ထဲက row တွေရဲ့ အစီအစဉ်နဲ့ ပတ်သက်ပြီး အာမခံချက် (guarantee) တစ်စုံတစ်ရာ မပေးပါဘူး — table တစ်ခုကို ဖတ်တဲ့အခါ — sorting ကို အတိအကျ တောင်းဆိုထားခြင်း မရှိရင် — row တွေက ကြိုသိနိုင်ခြင်း မရှိတဲ့ အစီအစဉ် (unspecified order) နဲ့ ပေါ်လာပါတယ်။ ဒါကို [အခန်း 7](https://www.postgresql.org/docs/current/queries.html) မှာ ဖော်ပြထားပါတယ်။ ဒါ့အပြင် SQL က row တွေကို unique identifier သတ်မှတ်ပေးခြင်း မရှိတဲ့အတွက် — table တစ်ခုထဲမှာ လုံးဝတူညီတဲ့ row တွေ အများအပြား ရှိနေနိုင်ပါတယ်။ ဒါက SQL ရဲ့ အခြေခံအုတ်မြစ် ဖြစ်တဲ့ သင်္ချာ model ရဲ့ အကျိုးဆက်တစ်ခု ဖြစ်ပေမယ့် — ပုံမှန်အားဖြင့်တော့ မလိုလားအပ်တဲ့ အခြေအနေပါ။ ဒီ chapter ရဲ့ နောက်ပိုင်း section တွေမှာ ဒီပြဿနာကို ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာ တွေ့ရမှာ ဖြစ်ပါတယ်။

Column တစ်ခုချင်းစီမှာ data type တစ်ခု ရှိပါတယ်။ Data type က column တစ်ခုကို သတ်မှတ်ပေးလို့ရတဲ့ possible value တွေရဲ့ အစုကို ကန့်သတ်ပေးပြီး — column ထဲ သိမ်းထားတဲ့ data ကို တွက်ချက်မှုတွေမှာ သုံးနိုင်အောင် semantics (အဓိပ္ပာယ်) သတ်မှတ်ပေးပါတယ်။ ဥပမာ — numerical type လို့ သတ်မှတ်ထားတဲ့ column က ကြိုက်ရာ text string တွေကို လက်မခံပါဘူး — ဒါပေမယ့် အဲဒီလို column ထဲ သိမ်းထားတဲ့ data တွေကိုတော့ သင်္ချာ တွက်ချက်မှုတွေမှာ သုံးလို့ရပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — character string type လို့ သတ်မှတ်ထားတဲ့ column က data အမျိုးအစား အားလုံးနီးပါးကို လက်ခံပေမယ့် — string concatenation လို တခြား operation တွေ ရနိုင်ပေမဲ့ — သင်္ချာ တွက်ချက်မှုတွေအတွက်တော့ မသင့်လျော်ပါဘူး။

PostgreSQL မှာ application အများအပြားအတွက် လုံလောက်တဲ့ built-in data type အစုအဝေး အတော်များများ ပါဝင်ပါတယ်။ User တွေက ကိုယ်ပိုင် data type တွေကိုလည်း သတ်မှတ်လို့ရပါတယ်။ Built-in data type အများစုရဲ့ နာမည်နဲ့ semantics တွေက ရှင်းလင်းတာကြောင့် — အသေးစိတ် ရှင်းလင်းချက်ကို [အခန်း 8](https://www.postgresql.org/docs/current/datatype.html) မှာ ဖော်ပြထားပါတယ်။ မကြာခဏ သုံးလေ့ရှိတဲ့ data type တချို့ကတော့ — ကိန်းပြည့်တွေအတွက် `integer`၊ အပိုင်းကိန်း ပါနိုင်တဲ့ ကိန်းတွေအတွက် `numeric`၊ စာလုံး string တွေအတွက် `text`၊ ရက်စွဲတွေအတွက် `date`၊ နေ့အချိန် (time-of-day) တန်ဖိုးတွေအတွက် `time` နဲ့ ရက်စွဲနဲ့ အချိန် နှစ်မျိုးလုံး ပါဝင်တဲ့ တန်ဖိုးတွေအတွက် `timestamp` တို့ ဖြစ်ပါတယ်။

Table တစ်ခု ဖန်တီးဖို့ဆိုရင် — နာမည်နဲ့ ရည်ရွယ်ချက် ကိုက်ညီတဲ့ [CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) command ကို သုံးပါတယ်။ ဒီ command မှာ — table အသစ်အတွက် နာမည်၊ column တွေရဲ့ နာမည်တွေနဲ့ column တစ်ခုချင်းစီရဲ့ data type ကို အနည်းဆုံး သတ်မှတ်ပေးရပါတယ်။ ဥပမာ —

```sql
CREATE TABLE my_first_table (
    first_column text,
    second_column integer
);
```

ဒါက `my_first_table` ဆိုတဲ့ နာမည်နဲ့ column နှစ်ခု ပါတဲ့ table တစ်ခုကို ဖန်တီးပါတယ်။ ပထမ column က `first_column` — data type က `text` ဖြစ်ပြီး — ဒုတိယ column ကတော့ `second_column` ဆိုတဲ့ နာမည်နဲ့ `integer` type ဖြစ်ပါတယ်။ Table နဲ့ column နာမည်တွေက [အပိုင်း 4.1.1](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS) မှာ ရှင်းပြထားတဲ့ identifier syntax ကို လိုက်နာပါတယ်။ Type နာမည်တွေကလည်း ပုံမှန်အားဖြင့် identifier တွေပဲ ဖြစ်ပေမယ့် — ချွင်းချက် (exception) တချို့တော့ ရှိပါတယ်။ Column list က comma နဲ့ ခြားပြီး — parentheses နဲ့ ဝန်းရံထားတာကိုလည်း သတိပြုပါ။

ဟုတ်ပါတယ် — အပေါ်က ဥပမာက အတုအယောင် (contrived) သက်သက် ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — table နဲ့ column တွေကို သူတို့ သိမ်းမယ့် data အမျိုးအစားကို ဖော်ပြတဲ့ နာမည်မျိုး ပေးလေ့ ရှိပါတယ်။ ဒါကြောင့် — ပိုပြီး လက်တွေ့ကျတဲ့ ဥပမာ တစ်ခုကို ကြည့်ကြရအောင် —

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric
);
```

(`numeric` type က အပိုင်းကိန်း အစိတ်အပိုင်းတွေကို သိမ်းနိုင်ပါတယ် — ငွေကြေး ပမာဏတွေမှာ ပုံမှန်အားဖြင့် တွေ့ရလေ့ ရှိတဲ့အတိုင်းပါ။)

> **အကြံပြုချက်:** ဆက်စပ်နေတဲ့ table တွေ အများကြီး ဖန်တီးတဲ့အခါ — table နဲ့ column နာမည်တွေအတွက် တစ်သမတ်တည်း ဖြစ်တဲ့ naming pattern (နာမည်ပေးစနစ်) တစ်ခုကို ရွေးထားတာ ပညာရှိရာရောက်ပါတယ်။ ဥပမာ — table နာမည်တွေအတွက် singular (အနည်းကိန်း) noun လား plural (အများကိန်း) noun လား သုံးမလဲ ဆိုတာ ရွေးစရာ ရှိပါတယ် — ပုံစံ နှစ်မျိုးစလုံးကို သီအိုရီ ပညာရှင် တစ်ယောက်ယောက်က ထောက်ခံနေတတ်ပါတယ်။

Table တစ်ခုမှာ ပါဝင်နိုင်တဲ့ column အရေအတွက်ကို ကန့်သတ်ချက် ရှိပါတယ် — column type တွေပေါ် မူတည်ပြီး 250 ကနေ 1600 ကြား ဖြစ်ပါတယ်။ ဒါပေမယ့် — ဒီအရေအတွက် အနားကပ်လောက်တဲ့ column တွေ ပါတဲ့ table တစ်ခုကို သတ်မှတ်တာက အလွန် ရှားပါးပြီး — မကြာခဏဆိုသလို design အရ မေးခွန်းထုတ်စရာ ကောင်းပါတယ်။

Table တစ်ခုကို မလိုတော့ဘူးဆိုရင် — [DROP TABLE](https://www.postgresql.org/docs/current/sql-droptable.html) command နဲ့ ဖယ်ရှားလို့ရပါတယ်။ ဥပမာ —

```sql
DROP TABLE my_first_table;
DROP TABLE products;
```

မရှိတဲ့ table တစ်ခုကို drop (ဖျက်) ဖို့ ကြိုးစားရင် — error တစ်ခု ဖြစ်ပါတယ်။ ဒါပေမယ့် — SQL script file တွေမှာ — table မရှိလည်း ဖြစ်၊ ရှိလည်း ဖြစ် script အလုပ်လုပ်နိုင်ဖို့အတွက် — error message တွေကို ဂရုမစိုက်ဘဲ — table တစ်ခုချင်းစီကို မဖန်တီးခင် အခြေအနေ မရွေး (unconditionally) drop လုပ်ကြည့်တာက ပုံမှန် အလေ့အထတစ်ခုပါ။ (လိုချင်ရင် — error message တွေ မပေါ်အောင် `DROP TABLE IF EXISTS` variant ကို သုံးလို့ရပါတယ် — ဒါပေမယ့် ဒါက standard SQL မဟုတ်ပါဘူး။)

ရှိပြီးသား table တစ်ခုကို ပြုပြင်မွမ်းမံဖို့ လိုရင် — ဒီ chapter ရဲ့ နောက်ပိုင်း [အပိုင်း 5.7](/docs/postgresql/ddl-alter) ကို ကြည့်ပါ။

အခုအထိ ဆွေးနွေးခဲ့တဲ့ tools တွေနဲ့ဆိုရင် — အပြည့်အဝ အလုပ်လုပ်နိုင်တဲ့ table တွေကို ဖန်တီးနိုင်ပါပြီ။ ဒီ chapter ရဲ့ ကျန်တဲ့ အပိုင်းတွေကတော့ — data integrity (ဒေတာ မှန်ကန်ခိုင်မာမှု)၊ security (လုံခြုံရေး) နဲ့ convenience (အဆင်ပြေမှု) တွေ ရှိစေဖို့ — table definition ထဲကို feature တွေ ထပ်ဖြည့်ခြင်း အကြောင်း ဖြစ်ပါတယ်။ Table တွေထဲကို data တွေ ဖြည့်ချင်စိတ် ပြင်းပြင်းထန်ထန် ရှိနေရင် — [အခန်း 6](https://www.postgresql.org/docs/current/dml.html) ကို ကျော်သွားပြီး — ဒီ chapter ရဲ့ ကျန်တာတွေကို နောက်မှ ပြန်ဖတ်လို့ရပါတယ်။
