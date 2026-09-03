---
title: "Object Identifier Types (object identifier type များ)"
description: "OID နှင့် reg* alias type များ — system table column များတွင် သုံးခြင်းနှင့် cast ပြုလုပ်ခြင်း၊ xid/xid8/cid/tid ကဲ့သို့သော အခြား identifier type များ"
order: 66
source: "https://www.postgresql.org/docs/current/datatype-oid.html"
status: translated
updated: 2026-09-03
---

## 8.19. Object Identifier Types (object identifier type များ)

Object identifier (OID) တွေကို PostgreSQL က အတွင်းပိုင်းမှာ — system table အမျိုးမျိုးရဲ့ primary key (အဓိက သော့) တွေအဖြစ် — သုံးပါတယ်။ `oid` type က object identifier တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ပြီးတော့ `oid` အတွက် alias type (အမည်တစ်မျိုးဖြင့် ညွှန်းနိုင်သော type) တွေ အများအပြားလည်း ရှိပြီး — တစ်ခုချင်းစီကို `regsomething` ပုံစံနဲ့ နာမည်ပေးထားပါတယ်။ အကျဉ်းချုပ်ကို [ဇယား 8.26](/docs/postgresql/datatype-oid) မှာ ကြည့်နိုင်ပါတယ်။

`oid` type ကို လောလောဆယ် unsigned (အနုတ်မပါ) four-byte integer အဖြစ် implement (အကောင်အထည်ဖော်) ထားပါတယ်။ ဒါကြောင့် — database ကြီးတွေ ဒါမှမဟုတ် table တစ်ခုတည်း ကြီးကြီးမားမားတွေမှာတောင် — database တစ်ခုလုံး အတိုင်းအတာနဲ့ uniqueness (ထူးခြားမှု) ကို ပေးစွမ်းနိုင်လောက်အောင် မလုံလောက်ပါဘူး။

`oid` type ကိုယ်တိုင်မှာတော့ comparison (နှိုင်းယှဉ်ခြင်း) ကလွဲရင် — လုပ်ဆောင်ချက် (operation) အနည်းငယ်ပဲ ရှိပါတယ်။ ဒါပေမယ့် ၎င်းကို integer အဖြစ် cast လုပ်ပြီး — standard integer operator တွေနဲ့ ကိုင်တွယ် သုံးစွဲလို့ ရပါတယ်။ (ဒီလိုလုပ်ရင် signed နဲ့ unsigned ရောထွေးသွားနိုင်တာကို သတိထားပါ။)

OID alias type တွေမှာတော့ — အထူးပြု လုပ်ထားတဲ့ input နဲ့ output routine တွေကလွဲရင် — ကိုယ်ပိုင် လုပ်ဆောင်ချက်တွေ မရှိပါဘူး။ ဒီ routine တွေက system object တွေအတွက် — `oid` type က သုံးမယ့် ကုန်ကြမ်း numeric တန်ဖိုး (raw numeric value) အစား — symbolic name (သင်္ကေတ နာမည်) တွေကို လက်ခံပြီး ပြသနိုင်ပါတယ်။ Alias type တွေက object တွေရဲ့ OID တန်ဖိုးတွေကို ရှာဖွေတာကို ရိုးရှင်းစေပါတယ်။ ဥပမာ — `mytable` ဆိုတဲ့ table တစ်ခုနဲ့ သက်ဆိုင်တဲ့ `pg_attribute` row တွေကို စစ်ဆေးကြည့်ချင်ရင် — ဒီလိုရေးနိုင်ပါတယ်:

```sql
SELECT * FROM pg_attribute WHERE attrelid = 'mytable'::regclass;
```

ဒီလိုရေးမယ့်အစား:

```sql
SELECT * FROM pg_attribute
  WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = 'mytable');
```

ဒီအပေါ်က နည်းက တစ်ခုတည်း ကြည့်ရင် သိပ်မဆိုးဘူးလို့ ထင်ရပေမယ့် — တကယ်တော့ အလွန်အကျွံ ရိုးရှင်းအောင် လုပ်ထားတာ ဖြစ်ပါတယ်။ Schema အမျိုးမျိုးထဲမှာ `mytable` နာမည်တူ table တွေ အများအပြား ရှိနေရင် — မှန်ကန်တဲ့ OID ကို ရွေးဖို့ — အများကြီး ပိုရှုပ်ထွေးတဲ့ sub-select တစ်ခု လိုအပ်ပါလိမ့်မယ်။ `regclass` ရဲ့ input converter ကတော့ schema path setting (သတ်မှတ်ချက်) အတိုင်း table ရှာဖွေမှုကို ကိုင်တွယ်ပေးလို့ — “right thing” (မှန်ကန်သော အရာ) ကို အလိုအလျောက် လုပ်ပေးပါတယ်။ အလားတူပဲ — table တစ်ခုရဲ့ OID ကို `regclass` အဖြစ် cast လုပ်တာက — numeric OID တစ်ခုကို symbolic ပုံစံနဲ့ ပြသဖို့ အဆင်ပြေပါတယ်။

**ဇယား 8.26. Object Identifier Types (object identifier type များ)**

| နာမည် | ရည်ညွှန်းချက် | ဖော်ပြချက် | တန်ဖိုး ဥပမာ |
| --- | --- | --- | --- |
| `oid` | မည်သည့်ခုမဆို (any) | numeric (ဂဏန်း) object identifier | `564182` |
| `regclass` | `pg_class` | relation (ဇယား) နာမည် | `pg_type` |
| `regcollation` | `pg_collation` | collation (စာလုံး စီစဉ်မှု စည်းမျဉ်း) နာမည် | `"POSIX"` |
| `regconfig` | `pg_ts_config` | text search configuration (စာသား ရှာဖွေရေး ဖွဲ့စည်းမှု) နာမည် | `english` |
| `regdictionary` | `pg_ts_dict` | text search dictionary (စာသား ရှာဖွေရေး အဘိဓာန်) နာမည် | `simple` |
| `regnamespace` | `pg_namespace` | namespace (schema) နာမည် | `pg_catalog` |
| `regoper` | `pg_operator` | operator နာမည် | `+` |
| `regoperator` | `pg_operator` | argument type များ ပါဝင်သော operator | `*(integer,​integer)` သို့မဟုတ် `-(NONE,​integer)` |
| `regproc` | `pg_proc` | function နာမည် | `sum` |
| `regprocedure` | `pg_proc` | argument type များ ပါဝင်သော function | `sum(int4)` |
| `regrole` | `pg_authid` | role (အခန်းကဏ္ဍ) နာမည် | `smithee` |
| `regtype` | `pg_type` | data type နာမည် | `integer` |

Namespace (နေရာသတ်မှတ်မှု) အလိုက် အုပ်စုဖွဲ့ထားတဲ့ object တွေအတွက် OID alias type တွေ အားလုံးက schema-qualified name (schema နဲ့ ရှေ့ဆွဲထားသော နာမည်) တွေကို လက်ခံပြီး — object တစ်ခုကို qualify (ရှေ့ဆွဲ) လုပ်မှသာ လက်ရှိ search path ထဲမှာ တွေ့နိုင်မယ့် အခြေအနေမျိုးဆိုရင် — output မှာလည်း schema-qualified နာမည်တွေနဲ့ ပြသပါတယ်။ ဥပမာ — `myschema.mytable` ဆိုတာက `regclass` အတွက် လက်ခံနိုင်တဲ့ input တစ်ခုပါ (ဒီလို table တစ်ခု တကယ် ရှိနေရင်)။ အဲဒီတန်ဖိုးကို လက်ရှိ search path ပေါ် မူတည်ပြီး `myschema.mytable` သို့မဟုတ် `mytable` ဆိုပြီး output လုပ်နိုင်ပါတယ်။ `regproc` နဲ့ `regoper` alias type တွေကတော့ unique (ထူးခြားသော — overload မဖြစ်သော) နာမည်တွေကိုပဲ input အဖြစ် လက်ခံလို့ — အသုံးဝင်မှု အကန့်အသတ် ရှိပါတယ်; အများစုအတွက်တော့ `regprocedure` သို့မဟုတ် `regoperator` တွေက ပိုသင့်လျော်ပါတယ်။ `regoperator` အတွက်ကတော့ unary operator တွေကို — အသုံးမပြုတဲ့ operand နေရာမှာ `NONE` လို့ ရေးပြီး — ခွဲခြား သတ်မှတ်ပါတယ်။

ဒီ type တွေရဲ့ input function တွေက token တွေကြားမှာ whitespace (နေရာလွတ်) တွေကို ခွင့်ပြုပြီး — double quote အတွင်းမှာ ကလွဲရင် — upper-case (စာလုံးကြီး) တွေကို lower case (စာလုံးသေး) အဖြစ် ပြောင်းပေးပါတယ်; ဒါက object နာမည်တွေကို SQL မှာ ရေးတဲ့ syntax စည်းမျဉ်းတွေနဲ့ ဆင်တူဖြစ်စေဖို့ လုပ်ထားတာပါ။ အပြန်အလှန်အားဖြင့် — output function တွေက output က valid SQL identifier တစ်ခု ဖြစ်စေဖို့ လိုအပ်ရင် double quote တွေကို သုံးပါတယ်။ ဥပမာ — integer argument နှစ်ခု လက်ခံတဲ့ `Foo` (စာလုံးကြီး `F` နဲ့) ဆိုတဲ့ function တစ်ခုရဲ့ OID ကို `' "Foo" ( int, integer ) '::regprocedure` လို့ ရေးထည့်လို့ ရပါတယ်။ Output ကတော့ `"Foo"(integer,integer)` ပုံစံ ဖြစ်မှာပါ။ Function နာမည်ရော argument type နာမည်တွေပါ schema-qualified ဖြစ်အောင်လည်း လုပ်လို့ ရပါတယ်။

PostgreSQL ရဲ့ built-in function (အတွင်းသွင်း function) တွေ အများအပြားက table တစ်ခု သို့မဟုတ် တခြား database object တစ်ခုခုရဲ့ OID ကို လက်ခံပြီး — အဆင်ပြေစေဖို့ `regclass` (သို့မဟုတ် သင့်လျော်တဲ့ OID alias type) ကို လက်ခံတဲ့ပုံစံနဲ့ ကြေညာထားပါတယ်။ ဆိုလိုတာက — object ရဲ့ OID ကို လက်နဲ့ ရှာဖွေနေစရာ မလိုဘဲ — သူ့ရဲ့ နာမည်ကို string literal တစ်ခုအနေနဲ့ပဲ ရိုက်ထည့်လို့ ရပါတယ်။ ဥပမာ — `nextval(regclass)` function က sequence relation တစ်ခုရဲ့ OID ကို လက်ခံလို့ — ဒီလိုမျိုး ခေါ်ယူနိုင်ပါတယ်:

```sql
nextval('foo')              operates on sequence foo
nextval('FOO')              same as above
nextval('"Foo"')            operates on sequence Foo
nextval('myschema.foo')     operates on myschema.foo
nextval('"myschema".foo')   same as above
nextval('foo')              searches search path for foo
```

> **မှတ်ချက်:** အလှဆင် (unadorned) string literal အနေနဲ့ ဒီလို function တစ်ခုရဲ့ argument ကို ရေးတဲ့အခါ — ၎င်းက `regclass` (သို့မဟုတ် သင့်လျော်တဲ့ type) တစ်ခုရဲ့ constant တစ်ခု ဖြစ်သွားပါတယ်။ ဒါက တကယ်တော့ OID တစ်ခုပဲ ဖြစ်လို့ — နောက်ပိုင်းမှာ rename လုပ်တာ၊ schema ပြောင်းရွှေ့ သတ်မှတ်တာ စတာတွေ ဖြစ်ခဲ့ရင်တောင် — မူလ ခွဲခြားသတ်မှတ်ထားခဲ့တဲ့ object ကိုပဲ လိုက်ပါ ခြေရာခံနေမှာ ဖြစ်ပါတယ်။ ဒီ “early binding” (ကြိုတင် ချိတ်ဆက်ခြင်း) အပြုအမူကတော့ column default တွေနဲ့ view တွေထဲက object reference တွေအတွက် ပုံမှန်အားဖြင့် နှစ်လိုဖွယ် ကောင်းပါတယ်။ ဒါပေမယ့် တခါတရံမှာ object reference ကို run time မှာ ဖြေရှင်းပေးတဲ့ “late binding” (နောက်ကျမှ ချိတ်ဆက်ခြင်း) ကို လိုချင်နိုင်ပါတယ်။ Late-binding အပြုအမူ ရဖို့ — constant ကို `regclass` အစား `text` constant အဖြစ် သိမ်းဆည်းဖို့ အတင်းပြုလုပ်ပါ:
> 
> ```sql
> nextval('foo'::text)      foo is looked up at runtime
> ```
> 
> `to_regclass()` function နဲ့ ၎င်းရဲ့ ညီအစ်ကို (sibling) function တွေကိုလည်း run-time lookup (လည်ပတ်ချိန် ရှာဖွေမှု) တွေ လုပ်ဖို့ သုံးနိုင်ပါတယ်။ [ဇယား 9.76](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE) ကို ကြည့်ပါ။

`regclass` ကို သုံးတဲ့ နောက်ထပ် လက်တွေ့ ဥပမာ တစ်ခုကတော့ — OID တွေကို တိုက်ရိုက် မပေးတဲ့ `information_schema` view တွေထဲမှာ စာရင်းပြုထားတဲ့ table တစ်ခုရဲ့ OID ကို ရှာဖွေတာပါ။ ဥပမာ — table OID လိုအပ်တဲ့ `pg_relation_size()` function ကို ခေါ်ယူချင်တယ် ဆိုပါစို့။ အပေါ်က စည်းမျဉ်းတွေကို ထည့်သွင်း စဉ်းစားရင် — ဒီလိုလုပ်တာက မှန်ကန်တဲ့ နည်းလမ်း ဖြစ်ပါတယ်:

```sql
SELECT table_schema, table_name,
       pg_relation_size((quote_ident(table_schema) || '.' ||
                         quote_ident(table_name))::regclass)
FROM information_schema.tables
WHERE ...
```

`quote_ident()` function က identifier တွေကို လိုအပ်တဲ့နေရာတွေမှာ double-quote လုပ်ပေးပါလိမ့်မယ်။ ပိုလွယ်ပုံ ရတဲ့ ဒီအောက်က နည်းကတော့ —

```sql
SELECT pg_relation_size(table_name)
FROM information_schema.tables
WHERE ...
```

— အကြံပြုလို့ မရပါဘူး — အကြောင်းကတော့ သင့် search path ရဲ့ အပြင်ဘက်က table တွေ ဒါမှမဟုတ် quote လုပ်ဖို့ လိုအပ်တဲ့ နာမည်တွေ ရှိတဲ့ table တွေအတွက် မအောင်မြင်နိုင်လို့ပါ။

OID alias type အများစုရဲ့ နောက်ထပ် ဂုဏ်သတ္တိ တစ်ခုကတော့ dependency (မှီခိုမှု) တွေ ဖန်တီးပေးတာပါ။ ဒီ type တွေထဲက တစ်ခုရဲ့ constant တစ်ခုက stored expression (သိမ်းဆည်းထားသော expression — column default expression သို့မဟုတ် view လိုမျိုး) တစ်ခုထဲမှာ ပေါ်လာရင် — ၎င်းက ရည်ညွှန်းထားတဲ့ object အပေါ် dependency တစ်ခု ဖန်တီးပါတယ်။ ဥပမာ — column တစ်ခုမှာ `nextval('my_seq'::regclass)` ဆိုတဲ့ default expression ရှိနေရင် — PostgreSQL က အဲဒီ default expression က `my_seq` sequence အပေါ် မှီခိုနေတယ်ဆိုတာ နားလည်လို့ — default expression ကို အရင်မဖယ်ရှားဘဲ sequence ကို drop လုပ်ဖို့ system က ခွင့်မပြုပါဘူး။ `nextval('my_seq'::text)` ဆိုတဲ့ တနည်းရွေးစရာကတော့ dependency တစ်ခုကို မဖန်တီးပါဘူး။ (`regrole` ကတော့ ဒီဂုဏ်သတ္တိအတွက် ခြွင်းချက် ဖြစ်ပါတယ်။ ဒီ type ရဲ့ constant တွေကို stored expression တွေထဲမှာ ခွင့်မပြုပါဘူး။)

System က သုံးတဲ့ နောက် identifier type တစ်ခုကတော့ `xid` — transaction (xact လို့ အတိုကောက် ခေါ်သော) identifier ပါ။ ဒါက `xmin` နဲ့ `xmax` ဆိုတဲ့ system column တွေရဲ့ data type ပဲ ဖြစ်ပါတယ်။ Transaction identifier တွေက 32-bit ပမာဏတွေ ဖြစ်ပါတယ်။ Context (အခြေအနေ) တချို့မှာတော့ 64-bit မျိုးကွဲ `xid8` ကို သုံးပါတယ်။ `xid` တန်ဖိုးတွေနဲ့ မတူဘဲ — `xid8` တန်ဖိုးတွေက တင်းကြပ်စွာ monotonic (အမြဲ တိုးတက်သော) ပုံစံနဲ့ တိုးပြီး — database cluster တစ်ခုရဲ့ သက်တမ်း အတွင်းမှာ ပြန်လည် သုံးစွဲလို့ မရပါဘူး။ အသေးစိတ်အတွက် [အပိုင်း 67.1](https://www.postgresql.org/docs/current/transaction-id.html) ကို ကြည့်ပါ။

System က သုံးတဲ့ တတိယ identifier type ကတော့ `cid` — command identifier ပါ။ ဒါက `cmin` နဲ့ `cmax` system column တွေရဲ့ data type ပဲ ဖြစ်ပါတယ်။ Command identifier တွေကလည်း 32-bit ပမာဏတွေပါ။

System က သုံးတဲ့ နောက်ဆုံး identifier type ကတော့ `tid` — tuple identifier (row identifier) ပါ။ ဒါက `ctid` system column ရဲ့ data type ပဲ ဖြစ်ပါတယ်။ Tuple ID တစ်ခုက (block number, block အတွင်းက tuple index) ဆိုတဲ့ တွဲ (pair) တစ်ခု ဖြစ်ပြီး — row တစ်ခုက ၎င်းရဲ့ table ထဲမှာ ရှိတဲ့ ရုပ်ပိုင်း တည်နေရာ (physical location) ကို ခွဲခြား သတ်မှတ်ပေးပါတယ်။

(System column တွေကို [အပိုင်း 5.6](/docs/postgresql/ddl-system-columns) မှာ ထပ်ဆင့် ရှင်းပြထားပါတယ်။)
