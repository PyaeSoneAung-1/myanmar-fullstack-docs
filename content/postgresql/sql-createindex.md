---
title: "CREATE INDEX (index အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "Table သို့မဟုတ် materialized view တစ်ခုရဲ့ သတ်မှတ်ထားတဲ့ column(s) များပေါ်တွင် index အသစ်တစ်ခု ဖန်တီးပေးသော command — UNIQUE, CONCURRENTLY, IF NOT EXISTS, INCLUDE, WITH (storage parameters), TABLESPACE, WHERE (partial index) စသည့် options များအပြင် index method တစ်ခုချင်းစီအတွက် storage parameters (fillfactor, deduplicate_items, buffering, fastupdate, gin_pending_list_limit, pages_per_range, autosummarize) များနှင့် concurrent index build အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 176
source: "https://www.postgresql.org/docs/current/sql-createindex.html"
status: translated
updated: 2026-09-04
---

## CREATE INDEX (index အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE INDEX — index အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ [ IF NOT EXISTS ] name ] ON [ ONLY ] table_name [ USING method ]
    ( { column_name | ( expression ) } [ COLLATE collation ] [ opclass [ ( opclass_parameter = value [, ... ] ) ] ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
    [ INCLUDE ( column_name [, ...] ) ]
    [ NULLS [ NOT ] DISTINCT ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    [ WHERE predicate ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE INDEX` က — table တစ်ခု သို့မဟုတ် materialized view တစ်ခု ဖြစ်နိုင်တဲ့ — သတ်မှတ်ထားတဲ့ relation တစ်ခုရဲ့ သတ်မှတ်ထားတဲ့ column(s) တွေပေါ်မှာ index တစ်ခုကို တည်ဆောက် (construct) ပေးပါတယ်။ Index တွေကို အဓိကအားဖြင့် database ရဲ့ စွမ်းဆောင်ရည် (performance) ကို မြှင့်တင်ဖို့ သုံးပါတယ် (မသင့်လျော်တဲ့ အသုံးပြုမှုကတော့ စွမ်းဆောင်ရည်ကို ပိုနှေးကွေးစေနိုင်ပါတယ်)။

Index အတွက် key field(s) တွေကို column names တွေအနေနဲ့ သို့မဟုတ် — တနည်းအားဖြင့် — parentheses ထဲမှာ ရေးထားတဲ့ expressions တွေအနေနဲ့ သတ်မှတ်ပါတယ်။ Index method က multicolumn indexes (column အများအပြား ပါတဲ့ indexes) တွေကို ထောက်ပံ့မယ်ဆိုရင် — field အများအပြားကိုလည်း သတ်မှတ်လို့ ရပါတယ်။

Index field တစ်ခုက — table row ရဲ့ column တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ columns တွေရဲ့ တန်ဖိုးတွေကနေ တွက်ချက်ထားတဲ့ expression တစ်ခု ဖြစ်နိုင်ပါတယ်။ ဒီ feature ကို — အခြေခံ data ရဲ့ အသွင်ပြောင်းမှု (transformation) တစ်ခုခုကို အခြေခံပြီး — data တွေဆီ မြန်ဆန်စွာ ဝင်ရောက်နိုင်ဖို့ သုံးနိုင်ပါတယ်။ ဥပမာ — `upper(col)` ပေါ်မှာ တွက်ချက်ထားတဲ့ index တစ်ခုက — `WHERE upper(col) = 'JIM'` ဆိုတဲ့ clause ကို index သုံးခွင့် ပြုနိုင်ပါလိမ့်မယ်။

PostgreSQL က B-tree, hash, GiST, SP-GiST, GIN နဲ့ BRIN ဆိုတဲ့ index methods တွေကို ပံ့ပိုးပေးပါတယ်။ User တွေက ကိုယ်ပိုင် index methods တွေကိုလည်း သတ်မှတ်နိုင်ပေမယ့် — အဲဒါက အတော်လေး ရှုပ်ထွေးတဲ့ အလုပ်ပါ။

`WHERE` clause ပါဝင်နေတဲ့အခါ — *partial index* (တစ်စိတ်တစ်ပိုင်း index) တစ်ခုကို ဖန်တီးပါတယ်။ Partial index ဆိုတာ — table တစ်ခုရဲ့ အစိတ်အပိုင်းတစ်ခုအတွက်ပဲ entry တွေ ပါဝင်တဲ့ index တစ်ခု ဖြစ်ပြီး — ပုံမှန်အားဖြင့် — table ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေထက် indexing အတွက် ပိုပြီး အသုံးဝင်တဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်ပါတယ်။ ဥပမာ — bill ပေးပြီးသား (billed) နဲ့ မပေးရသေးတဲ့ (unbilled) orders တွေ နှစ်မျိုးလုံး ပါဝင်တဲ့ table တစ်ခု ရှိတယ်ဆိုပါစို့ — အဲဒီမှာ unbilled orders တွေက table တစ်ခုလုံးရဲ့ သေးငယ်တဲ့ အပိုင်းလေးတစ်ခုကိုပဲ ယူထားပေမယ့် — မကြာခဏ သုံးနေရတဲ့ အပိုင်း ဖြစ်နေတယ်ဆိုရင် — အဲဒီ အစိတ်အပိုင်းပေါ်မှာပဲ index တစ်ခု ဖန်တီးခြင်းအားဖြင့် စွမ်းဆောင်ရည်ကို မြှင့်တင်နိုင်ပါတယ်။ နောက်ထပ် အသုံးပြုနိုင်တဲ့ နေရာတစ်ခုကတော့ — table တစ်ခုရဲ့ subset (အခွဲ) တစ်ခုပေါ်မှာ uniqueness ကို သေချာစေဖို့ `WHERE` ကို `UNIQUE` နဲ့ တွဲသုံးတာ ဖြစ်ပါတယ်။ နောက်ထပ် ဆွေးနွေးချက်တွေအတွက် [အပိုင်း 11.8](/docs/postgresql/indexes-partial) ကို ကြည့်ပါ။

`WHERE` clause ထဲမှာ သုံးထားတဲ့ expression က — အောက်ခံ table ရဲ့ columns တွေကိုပဲ ရည်ညွှန်းနိုင်ပြီး — ဒါပေမယ့် — index တင်နေတဲ့ columns တွေတင် မဟုတ်ဘဲ — columns အားလုံးကို သုံးနိုင်ပါတယ်။ လောလောဆယ်တော့ — subqueries နဲ့ aggregate expressions တွေကိုလည်း `WHERE` ထဲမှာ တားမြစ်ထားပါတယ်။ ဒီ ကန့်သတ်ချက်တွေက — expressions တွေဖြစ်တဲ့ index fields တွေအတွက်လည်း အလားတူ သက်ရောက်ပါတယ်။

Index definition တစ်ခုမှာ သုံးတဲ့ functions နဲ့ operators တွေ အားလုံးက “immutable” (မပြောင်းလဲနိုင်သော) ဖြစ်ရပါမယ် — ဆိုလိုတာက — သူတို့ရဲ့ ရလဒ်တွေက သူတို့ရဲ့ arguments တွေပေါ်မှာပဲ မူတည်ရပြီး — ပြင်ပ လွှမ်းမိုးမှု တစ်စုံတစ်ရာ (ဥပမာ — တခြား table တစ်ခုရဲ့ ပါဝင်ပစ္စည်းတွေ သို့မဟုတ် လက်ရှိ အချိန်) အပေါ်မှာ ဘယ်တော့မှ မမူတည်ရပါဘူး။ ဒီ ကန့်သတ်ချက်က index ရဲ့ အပြုအမူဟာ ကောင်းမွန်စွာ သတ်မှတ်ထားတာ (well-defined) ဖြစ်ကြောင်း သေချာစေပါတယ်။ Index expression တစ်ခု သို့မဟုတ် `WHERE` clause ထဲမှာ user-defined function တစ်ခုကို သုံးဖို့ဆိုရင် — function ကို ဖန်တီးတဲ့အခါ — immutable အဖြစ် အမှတ်အသား လုပ်ထားဖို့ သတိရပါ။

## Parameters (parameter များ)

- **UNIQUE** — Index ကို ဖန်တီးတဲ့အခါ (data တွေ ရှိပြီးသား ဖြစ်နေရင်) နဲ့ — data တွေ ထပ်ထည့်လိုက်တိုင်း — table ထဲမှာ ထပ်နေတဲ့ (duplicate) တန်ဖိုးတွေ ရှိမရှိ system က စစ်ဆေးစေပါတယ်။ Duplicate entries (ထပ်နေတဲ့ entries) တွေ ဖြစ်ပေါ်စေမယ့် data တွေကို insert သို့မဟုတ် update လုပ်ဖို့ ကြိုးစားရင် — error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။
Unique indexes တွေကို partitioned tables တွေပေါ်မှာ အသုံးပြုတဲ့အခါ နောက်ထပ် ကန့်သတ်ချက်တွေ သက်ရောက်ပါတယ်; CREATE TABLE ကို ကြည့်ပါ။
- **CONCURRENTLY** — ဒီ option ကို သုံးတဲ့အခါ — PostgreSQL က — table ပေါ်မှာ တစ်ပြိုင်နက် (concurrent) inserts, updates သို့မဟုတ် deletes တွေကို တားဆီးနိုင်တဲ့ locks တစ်စုံတစ်ရာ မယူဘဲ — index ကို တည်ဆောက်ပါတယ်; သာမန် index build တစ်ခုကတော့ — ပြီးဆုံးတဲ့အထိ — table ပေါ်က writes တွေကို (reads တွေ မဟုတ်ဘဲ) lock ချထားပါတယ်။ ဒီ option ကို သုံးတဲ့အခါ သတိထားရမယ့် အချက်များစွာ ရှိပါတယ် — အောက်က Building Indexes Concurrently ကို ကြည့်ပါ။
Temporary tables တွေအတွက်ကတော့ — တခြား session တွေက သူတို့ကို ဝင်ရောက်လို့ မရနိုင်တာကြောင့် — `CREATE INDEX` က အမြဲတမ်း non-concurrent ဖြစ်ပြီး — non-concurrent index creation က စရိတ် ပိုသက်သာပါတယ်။
- **IF NOT EXISTS** — တူညီတဲ့ နာမည်နဲ့ relation တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။ ရှိပြီးသား index က — ဖန်တီးမယ့် index နဲ့ တစ်စုံတစ်ရာ ဆင်တူမယ်ဆိုတဲ့ အာမခံချက် (guarantee) မရှိဘူးဆိုတာ သတိပြုပါ။ `IF NOT EXISTS` ကို သတ်မှတ်ထားတဲ့အခါ index name က မဖြစ်မနေ လိုအပ်ပါတယ်။
- **INCLUDE** — Optional ဖြစ်တဲ့ `INCLUDE` clause က — index ထဲမှာ non-key columns တွေအနေနဲ့ ပါဝင်စေမယ့် columns တွေရဲ့ စာရင်းကို သတ်မှတ်ပါတယ်။ Non-key column တစ်ခုကို — index scan ရဲ့ search qualification (ရှာဖွေမှု အရည်အချင်း သတ်မှတ်ချက်) မှာ သုံးလို့ မရပါဘူး — ပြီးတော့ — index က အတင်းအကျပ် လုပ်ဆောင်တဲ့ uniqueness သို့မဟုတ် exclusion constraint တစ်ခုခုရဲ့ ရည်ရွယ်ချက်တွေအတွက်လည်း ထည့်တွက်ခြင်း မခံပါဘူး။ ဒါပေမယ့် — index-only scan တစ်ခုက — non-key columns တွေရဲ့ ပါဝင်ပစ္စည်းတွေကို — index ရဲ့ table ဆီ သွားရောက်စရာ မလိုဘဲ — ပြန်ပေးနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒါတွေက index entry ကနေ တိုက်ရိုက် ရနိုင်လို့ပါ။ ဒါကြောင့် — non-key columns တွေ ထပ်ထည့်တာက — တခြားနည်းနဲ့ဆိုရင် index-only scans တွေကို မသုံးနိုင်တဲ့ queries တွေအတွက် — index-only scans တွေ သုံးနိုင်အောင် လုပ်ပေးပါတယ်။
Index တစ်ခုဆီ non-key columns တွေ ထပ်ထည့်ရာမှာ — အထူးသဖြင့် ကျယ်ပြန့်တဲ့ (wide) columns တွေဆိုရင် — ရှောင်ရှားတတ်တဲ့ (conservative) သဘောထား ထားတာ ပညာရှိရာရောက်ပါတယ်။ Index tuple တစ်ခုက — index type အတွက် ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားကို ကျော်လွန်သွားရင် — data insertion က မအောင်မြင်ပါဘူး။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — non-key columns တွေက index ရဲ့ table ကနေ data တွေကို ပုံတူပွားပြီး — index ရဲ့ အရွယ်အစားကို ဖောင်းပွစေတာကြောင့် — ရှာဖွေမှုတွေကို နှေးကွေးစေနိုင်ပါတယ်။ ဒါ့အပြင် — B-tree deduplication ကို — non-key column တစ်ခု ပါတဲ့ indexes တွေမှာ ဘယ်တော့မှ မသုံးပါဘူး။
`INCLUDE` clause ထဲမှာ စာရင်းပြုထားတဲ့ columns တွေက သင့်လျော်တဲ့ operator classes တွေ ရှိဖို့ မလိုပါဘူး; ဒီ clause ထဲမှာ — ပေးထားတဲ့ access method တစ်ခုအတွက် operator classes တွေ သတ်မှတ်ထားခြင်း မရှိတဲ့ data types တွေရဲ့ columns တွေကို ထည့်သွင်းနိုင်ပါတယ်။
Expressions တွေကို included columns တွေအနေနဲ့တော့ ထောက်ပံ့မပေးပါဘူး — ဘာလို့လဲဆိုတော့ သူတို့ကို index-only scans တွေမှာ သုံးလို့ မရလို့ပါ။
လောလောဆယ်တော့ — B-tree, GiST နဲ့ SP-GiST index access methods တွေက ဒီ feature ကို ထောက်ပံ့ပါတယ်။ ဒီ indexes တွေမှာ — `INCLUDE` clause ထဲမှာ စာရင်းပြုထားတဲ့ columns တွေရဲ့ တန်ဖိုးတွေကို — heap tuples တွေနဲ့ ကိုက်ညီတဲ့ — leaf tuples တွေထဲမှာ ထည့်သွင်းပေမယ့် — tree navigation (သစ်ပင် လမ်းညွှန် သွားလာမှု) အတွက် သုံးတဲ့ အထက်အဆင့် index entries တွေထဲမှာတော့ ထည့်သွင်းခြင်း မရှိပါဘူး။
- **name** — ဖန်တီးရမယ့် index ရဲ့ နာမည်။ ဒီနေရာမှာ schema name ထည့်လို့ မရပါဘူး; index ကို — သူ့ရဲ့ parent table ရှိတဲ့ schema ထဲမှာပဲ — အမြဲတမ်း ဖန်တီးပါတယ်။ Index ရဲ့ နာမည်က — အဲဒီ schema ထဲက တခြား relation (table, sequence, index, view, materialized view သို့မဟုတ် foreign table) တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။ နာမည် ချန်လိုက်ရင် — PostgreSQL က — parent table ရဲ့ နာမည်နဲ့ index တင်ထားတဲ့ column name(s) တွေကို အခြေခံပြီး — သင့်လျော်တဲ့ နာမည်တစ်ခုကို ရွေးချယ်ပေးပါတယ်။
- **ONLY** — Table က partitioned ဖြစ်နေရင် — partitions တွေပေါ်မှာ indexes တွေ ဖန်တီးတာကို recurse (ဆင့်ပွား ဆက်လုပ်) မလုပ်ဖို့ ညွှန်ပြပါတယ်။ Default ကတော့ recurse လုပ်ပါတယ်။
- **table_name** — Index တင်ရမယ့် table ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်ပါတယ်)။
- **method** — သုံးရမယ့် index method ရဲ့ နာမည်။ ရွေးချယ်စရာတွေကတော့ btree, hash, gist, spgist, gin, brin သို့မဟုတ် — bloom လို — user ကိုယ်တိုင် install လုပ်ထားတဲ့ access methods တွေ ဖြစ်ပါတယ်။ Default method ကတော့ btree ဖြစ်ပါတယ်။
- **column_name** — Table ရဲ့ column တစ်ခုရဲ့ နာမည်။
- **expression** — Table ရဲ့ column တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ columns တွေကို အခြေခံထားတဲ့ expression တစ်ခု။ Syntax မှာ ပြထားသလို — expression ကို ပုံမှန်အားဖြင့် ဝန်းရံထားတဲ့ parentheses တွေနဲ့ ရေးရပါတယ်။ ဒါပေမယ့် — expression က function call တစ်ခုရဲ့ ပုံစံမျိုး ဖြစ်နေရင်တော့ — parentheses တွေကို ချန်လိုက်လို့ ရပါတယ်။
- **collation** — Index အတွက် သုံးရမယ့် collation ရဲ့ နာမည်။ Default အနေနဲ့ — index က — index တင်မယ့် column အတွက် ကြေညာထားတဲ့ collation ကို ဒါမှမဟုတ် — index တင်မယ့် expression ရဲ့ result collation ကို သုံးပါတယ်။ Non-default collations ပါတဲ့ indexes တွေက — non-default collations တွေ ပါဝင်တဲ့ expressions တွေကို သုံးထားတဲ့ queries တွေအတွက် အသုံးဝင်နိုင်ပါတယ်။
- **opclass** — Operator class တစ်ခုရဲ့ နာမည်။ အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ။
- **opclass_parameter** — Operator class parameter တစ်ခုရဲ့ နာမည်။ အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ။
- **ASC** — Ascending (ငယ်စဉ်ကြီးလိုက်) sort order ကို သတ်မှတ်ပါတယ် (ဒါကတော့ default ဖြစ်ပါတယ်)။
- **DESC** — Descending (ကြီးစဉ်ငယ်လိုက်) sort order ကို သတ်မှတ်ပါတယ်။
- **NULLS FIRST** — Nulls တွေက non-nulls တွေရဲ့ ရှေ့မှာ sort လုပ်မယ်လို့ သတ်မှတ်ပါတယ်။ `DESC` ကို သတ်မှတ်ထားတဲ့အခါ ဒါကတော့ default ဖြစ်ပါတယ်။
- **NULLS LAST** — Nulls တွေက non-nulls တွေရဲ့ နောက်မှာ sort လုပ်မယ်လို့ သတ်မှတ်ပါတယ်။ `DESC` ကို မသတ်မှတ်ထားတဲ့အခါ ဒါကတော့ default ဖြစ်ပါတယ်။
- **NULLS DISTINCT**/**NULLS NOT DISTINCT** — Unique index တစ်ခုအတွက် — null values တွေကို distinct (ကွဲပြားသည် — တစ်ခုနဲ့တစ်ခု တူညီသည်ဟု မယူဆ) လို့ ယူဆသင့်သလားဆိုတာ သတ်မှတ်ပါတယ်။ Default ကတော့ သူတို့ကို distinct လို့ ယူဆတာပါ — ဒါကြောင့် — unique index တစ်ခုထဲမှာ column တစ်ခုအတွက် null values အများအပြား ပါဝင်နိုင်ပါတယ်။
- **storage_parameter** — Index method တစ်ခုချင်းစီနဲ့ သက်ဆိုင်တဲ့ (index-method-specific) storage parameter တစ်ခုရဲ့ နာမည်။ အသေးစိတ်အတွက် အောက်က Index Storage Parameters ကို ကြည့်ပါ။
- **tablespace_name** — Index ကို ဖန်တီးရမယ့် tablespace။ မသတ်မှတ်ထားဘူးဆိုရင် — default_tablespace ကို တိုင်ပင်ပါတယ် — ဒါမှမဟုတ် — temporary tables တွေပေါ်က indexes တွေအတွက်ဆိုရင် — temp_tablespaces ကို တိုင်ပင်ပါတယ်။
- **predicate** — Partial index တစ်ခုအတွက် constraint expression (ကန့်သတ်ချက် ဖော်ပြချက်)။

### Index Storage Parameters (index storage parameters များ)

Optional ဖြစ်တဲ့ `WITH` clause က index အတွက် *storage parameters* (သိုလှောင် parameter များ) တွေကို သတ်မှတ်ပါတယ်။ Index method တစ်ခုချင်းစီမှာ — ခွင့်ပြုထားတဲ့ storage parameters တွေရဲ့ ကိုယ်ပိုင် အစုတစ်ခု ရှိပါတယ်။

B-tree, hash, GiST နဲ့ SP-GiST index methods တွေ အားလုံးက ဒီ parameter ကို လက်ခံပါတယ်:

- **fillfactor (integer)  #** — Index method က index pages တွေကို ဘယ်လောက် ပြည့်အောင် ထုပ်ပိုး (pack) ဖို့ ကြိုးစားမလဲဆိုတာကို ထိန်းချုပ်ပါတယ်။ B-trees တွေအတွက် — leaf pages တွေကို — ကနဦး index builds တွေမှာ ရော — index ကို ညာဘက်မှာ ချဲ့ထွင်တဲ့အခါ (အကြီးဆုံး key values အသစ်တွေ ထပ်ပေါင်းတဲ့အခါ) ပါ — ဒီ percentage အတိုင်း ဖြည့်ပါတယ်။ Pages တွေက နောက်ပိုင်းမှာ လုံးဝ ပြည့်သွားခဲ့ရင် — သူတို့ကို split လုပ်ပြီး — on-disk index structure ရဲ့ fragmentation (အပိုင်းပိုင်း ကွဲအက်မှု) ကို ဖြစ်စေပါတယ်။ B-trees တွေက default fillfactor 90 ကို သုံးပေမယ့် — 10 ကနေ 100 ကြားက ဘယ် integer တန်ဖိုးကိုမဆို ရွေးချယ်လို့ ရပါတယ်။

Inserts နဲ့/သို့မဟုတ် updates အများအပြား မျှော်လင့်ထားတဲ့ tables တွေပေါ်က B-tree indexes တွေက — `CREATE INDEX` အချိန်မှာ (table ထဲကို bulk loading (data အမြောက်အများ တင်ခြင်း) လုပ်ပြီးတဲ့ နောက်) — fillfactor ကို ပိုနိမ့်တဲ့ settings တွေ သတ်မှတ်တာကနေ အကျိုးရှိနိုင်ပါတယ်။ 50 ကနေ 90 အကွာအဝေးထဲက တန်ဖိုးတွေက — B-tree index ရဲ့ အစောပိုင်း သက်တမ်းအတွင်း page splits တွေရဲ့ နှုန်းကို အသုံးဝင်စွာ “ချောမွေ့အောင် ညှိပေး” (smooth out) နိုင်ပါတယ် (ဒီလို fillfactor ကို နိမ့်အောင် လုပ်တာက — page splits တွေရဲ့ အကြွင်းမဲ့ အရေအတွက်ကိုတောင် လျှော့ချပေးနိုင်ပေမယ့် — ဒီ အကျိုးသက်ရောက်မှုက workload အပေါ် အများကြီး မူတည်ပါတယ်)။ အပိုင်း 65.1.4.2 မှာ ဖော်ပြထားတဲ့ B-tree bottom-up index deletion technique က — pages တွေပေါ်မှာ “အပို” (extra) tuple versions တွေ သိမ်းထားဖို့ “အပို” နေရာလွတ် တချို့ ရှိနေတာပေါ်မှာ မှီခိုလို့ — fillfactor ရဲ့ သက်ရောက်မှုကို ခံရနိုင်ပါတယ် (ဒါပေမယ့် ဒီ အကျိုးသက်ရောက်မှုက ပုံမှန်အားဖြင့် သိပ်မသိသာပါဘူး)။
တခြား တိကျတဲ့ ကိစ္စတွေမှာ — space အသုံးချမှုကို အများဆုံး ဖြစ်စေဖို့ — `CREATE INDEX` အချိန်မှာ fillfactor ကို 100 အထိ တိုးမြှင့်တာက အသုံးဝင်နိုင်ပါတယ်။ Table က static (ငြိမ်သက်နေတဲ့ — inserts ရော updates ရော ဘယ်တော့မှ သက်ရောက်မှု မခံရမယ့်အရာ) ဆိုတာ လုံးဝ သေချာမှသာ — ဒါကို စဉ်းစားသင့်ပါတယ်။ မဟုတ်ရင် — fillfactor 100 setting က performance ကို ထိခိုက်စေနိုင်ပါတယ်: updates ဒါမှမဟုတ် inserts အနည်းငယ်လေးတောင် — page splits တွေရဲ့ ရုတ်တရက် လှိုင်းလုံးကြီး (sudden flood) တစ်ခုကို ဖြစ်စေပါလိမ့်မယ်။
တခြား index methods တွေက fillfactor ကို — ကွဲပြားပေမယ့် အကြမ်းဖျင်း ဆင်တူတဲ့ — နည်းလမ်းတွေနဲ့ သုံးပါတယ်; default fillfactor က method တစ်ခုနဲ့တစ်ခု ကွဲပြားပါတယ်။

B-tree indexes တွေက ဒီ parameter ကိုပါ ထပ်ပြီး လက်ခံပါတယ်:

- **deduplicate_items (boolean)  #** — အပိုင်း 65.1.4.3 မှာ ဖော်ပြထားတဲ့ B-tree deduplication technique (ထပ်နေသော entries များကို ပေါင်းစည်းခြင်း နည်းပညာ) ကို သုံးမသုံး ထိန်းချုပ်ပါတယ်။ Optimization ကို enable လုပ်ဖို့ သို့မဟုတ် disable လုပ်ဖို့ ON သို့မဟုတ် OFF လို့ သတ်မှတ်ပါ။ (ON နဲ့ OFF ရဲ့ အခြားသော စာလုံးပေါင်း ပုံစံတွေကို အပိုင်း 19.1 မှာ ဖော်ပြထားတဲ့အတိုင်း ခွင့်ပြုပါတယ်။) Default ကတော့ ON ဖြစ်ပါတယ်။

> **သတိပြုရန်:** `ALTER INDEX` ကနေတစ်ဆင့် deduplicate_items ကို off လုပ်လိုက်တာက — နောင်လာမယ့် insertions တွေကို deduplication စတင်စေခြင်းကနေ တားဆီးပေးပေမယ့် — ရှိပြီးသား posting list tuples တွေကို standard tuple representation (စံ tuple ကိုယ်စားပြုပုံ) သုံးအောင် — သူ့ဘာသာသူတော့ ပြောင်းလဲပေးခြင်း မရှိပါဘူး။

GiST indexes တွေက ဒီ parameter ကိုပါ ထပ်ပြီး လက်ခံပါတယ်:

- **buffering (enum)  #** — အပိုင်း 65.2.4.1 မှာ ဖော်ပြထားတဲ့ buffered build technique ကို index တည်ဆောက်ဖို့ သုံးမသုံး ထိန်းချုပ်ပါတယ်။ OFF ဆိုရင် buffering ကို disable လုပ်ပြီး — ON ဆိုရင် enable လုပ်ပါတယ် — AUTO ဆိုရင်တော့ — အစပိုင်းမှာ disable ဖြစ်ပေမယ့် — index ရဲ့ အရွယ်အစားက effective_cache_size ကို ရောက်ရှိတာနဲ့ — လုပ်ဆောင်နေစဉ်အတွင်း (on-the-fly) — အလိုအလျောက် ဖွင့်ပေးပါတယ်။ Default ကတော့ AUTO ဖြစ်ပါတယ်။ Sorted build ဖြစ်နိုင်မယ်ဆိုရင် — buffering=ON လို့ အတိအကျ သတ်မှတ်ထားခြင်း မရှိဘူးဆိုရင် — buffered build အစား sorted build ကို သုံးမှာ ဖြစ်တယ်ဆိုတာ သတိပြုပါ။

GIN indexes တွေက ဒီ parameters တွေကို လက်ခံပါတယ်:

- **fastupdate (boolean)  #** — အပိုင်း 65.4.4.1 မှာ ဖော်ပြထားတဲ့ fast update technique ကို သုံးမသုံး ထိန်းချုပ်ပါတယ်။ ON က fast update ကို enable လုပ်ပြီး — OFF က disable လုပ်ပါတယ်။ Default ကတော့ ON ဖြစ်ပါတယ်။

> **သတိပြုရန်:** `ALTER INDEX` ကနေတစ်ဆင့် fastupdate ကို off လုပ်လိုက်တာက — နောင်လာမယ့် insertions တွေကို pending index entries စာရင်းထဲ ဝင်ရောက်ခြင်းကနေ တားဆီးပေးပေမယ့် — ရှိပြီးသား entries တွေကို သူ့ဘာသာသူတော့ flush လုပ်ပေးခြင်း မရှိပါဘူး။ Pending list ကို လုံးဝ ရှင်းလင်းပြီးကြောင်း သေချာဖို့ — နောက်ပိုင်းမှာ table ကို `VACUUM` လုပ်တာ သို့မဟုတ် gin_clean_pending_list function ကို ခေါ်တာ ပြုလုပ်ချင်နိုင်ပါတယ်။

- **gin_pending_list_limit (integer)  #** — ဒီ index အတွက် gin_pending_list_limit ရဲ့ global setting ကို ကျော်လွန် (override) လုပ်ပါတယ်။ ဒီ တန်ဖိုးကို kilobytes နဲ့ သတ်မှတ်ပါတယ်။

BRIN indexes တွေက ဒီ parameters တွေကို လက်ခံပါတယ်:

- **pages_per_range (integer)  #** — BRIN index တစ်ခုရဲ့ entry တစ်ခုချင်းစီအတွက် — block range (block အုပ်စု) တစ်ခုကို ဖွဲ့စည်းပေးတဲ့ — table blocks အရေအတွက်ကို သတ်မှတ်ပါတယ် (အသေးစိတ်အတွက် အပိုင်း 65.5.1 ကို ကြည့်ပါ)။ Default ကတော့ 128 ဖြစ်ပါတယ်။
- **autosummarize (boolean)  #** — နောက် page range တစ်ခုပေါ်မှာ insertion တစ်ခုကို စစ်ဆေးတွေ့ရှိရတိုင်း — အရင် page range အတွက် summarization run တစ်ခုကို queue (တန်းစီ) လုပ်မလားဆိုတာ သတ်မှတ်ပါတယ် (အသေးစိတ်အတွက် အပိုင်း 65.5.1.1 ကို ကြည့်ပါ)။ Default ကတော့ off ဖြစ်ပါတယ်။

### Building Indexes Concurrently (index များကို တစ်ပြိုင်နက် တည်ဆောက်ခြင်း)

Index တစ်ခု ဖန်တီးတာက database တစ်ခုရဲ့ ပုံမှန် လည်ပတ်မှုကို နှောင့်ယှက်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — PostgreSQL က — index တင်ရမယ့် table ကို writes တွေဆန့်ကျင် lock လုပ်ပြီး — index build တစ်ခုလုံးကို table ရဲ့ scan တစ်ခုတည်းနဲ့ ဆောင်ရွက်ပါတယ်။ တခြား transactions တွေက table ကို ဆက်ပြီး ဖတ်နိုင်ပါသေးတယ် — ဒါပေမယ့် — table ထဲက rows တွေကို insert, update သို့မဟုတ် delete လုပ်ဖို့ ကြိုးစားရင်တော့ — index build ပြီးဆုံးသည်အထိ ပိတ်ဆို့ခံရပါလိမ့်မယ်။ System က live production database တစ်ခု ဖြစ်နေရင် ဒါက ပြင်းထန်တဲ့ သက်ရောက်မှု ရှိနိုင်ပါတယ်။ အလွန် ကြီးမားတဲ့ tables တွေက index တင်ဖို့ နာရီများစွာ ကြာနိုင်ပြီး — သေးငယ်တဲ့ tables တွေအတွက်တောင် — index build တစ်ခုက production system တစ်ခုအတွက် လက်မခံနိုင်လောက်အောင် ကြာမြင့်တဲ့ အချိန်အတိုင်းအတာအထိ — writers တွေကို lock ချထားနိုင်ပါတယ်။

PostgreSQL က — writes တွေကို lock ချခြင်း မရှိဘဲ — indexes တွေ တည်ဆောက်တာကို ထောက်ပံ့ပါတယ်။ ဒီ နည်းလမ်းကို `CREATE INDEX` ရဲ့ `CONCURRENTLY` option ကို သတ်မှတ်ခြင်းအားဖြင့် ခေါ်ယူပါတယ်။ ဒီ option ကို သုံးတဲ့အခါ — PostgreSQL က table ကို scan နှစ်ကြိမ် လုပ်ရပြီး — ထို့အပြင် — index ကို ပြုပြင် သို့မဟုတ် အသုံးပြုနိုင်ခြေ ရှိတဲ့ ရှိပြီးသား transactions တွေ အားလုံး ပြီးဆုံးသည်အထိ စောင့်ဆိုင်းရပါတယ်။ ဒါကြောင့် — ဒီ နည်းလမ်းက — သာမန် index build တစ်ခုထက် စုစုပေါင်း အလုပ် ပိုလိုအပ်ပြီး — ပြီးဆုံးဖို့လည်း သိသိသာသာ ပိုကြာပါတယ်။ ဒါပေမယ့် — index တည်ဆောက်နေစဉ်မှာ ပုံမှန် လည်ပတ်မှုတွေကို ဆက်လုပ်ခွင့် ပြုတာကြောင့် — ဒီ နည်းလမ်းက production environment တစ်ခုမှာ indexes အသစ်တွေ ထပ်ပေါင်းဖို့ အသုံးဝင်ပါတယ်။ သေချာတာကတော့ — index creation ကြောင့် သက်ရောက်လာတဲ့ အပို CPU နဲ့ I/O load က တခြား operations တွေကို နှေးကွေးစေနိုင်ပါတယ်။

Concurrent index build တစ်ခုမှာ — index ကို — transaction တစ်ခုအတွင်းမှာ system catalogs တွေထဲကို “invalid” index တစ်ခုအနေနဲ့ အမှန်တကယ် ထည့်သွင်းပြီး — နောက် transaction နှစ်ခုထဲမှာ table scan နှစ်ခု ဖြစ်ပေါ်ပါတယ်။ Table scan တစ်ခုချင်းစီ မတိုင်ခင် — index build က — table ကို ပြုပြင်ခဲ့တဲ့ ရှိပြီးသား transactions တွေ ပြီးဆုံးဖို့ စောင့်ဆိုင်းရပါတယ်။ ဒုတိယ scan ပြီးတဲ့ နောက်မှာ — index build က — ဒုတိယ scan ထက် စောတဲ့ snapshot (ရုပ်ပုံ — [အခန်း 13](https://www.postgresql.org/docs/current/mvcc.html) ကို ကြည့်ပါ) တစ်ခု ရှိနေတဲ့ transactions တွေ အားလုံး ပြီးဆုံးဖို့ စောင့်ဆိုင်းရပါတယ် — ပါဝင်နေတဲ့ indexes တွေက partial တွေ ဖြစ်နေရင် သို့မဟုတ် ရိုးရှင်းတဲ့ column references တွေ မဟုတ်တဲ့ columns တွေ ရှိနေရင် — တခြား tables တွေပေါ်က concurrent index builds တွေရဲ့ phase တစ်ခုခုမှာ သုံးထားတဲ့ transactions တွေ အပါအဝင် ဖြစ်ပါတယ်။ ပြီးတော့မှ — index ကို “valid” လို့ အမှတ်အသား လုပ်ပြီး သုံးစွဲဖို့ အသင့် ဖြစ်စေနိုင်ပြီး — `CREATE INDEX` command က ပြီးဆုံးပါတယ်။ ဒါတောင် — index က queries တွေအတွက် ချက်ချင်း သုံးလို့ မရနိုင်သေးပါဘူး: အဆိုးဆုံး အခြေအနေမှာ — index build စတင်တာထက် စောတဲ့ transactions တွေ တည်ရှိနေသရွေ့ — သူ့ကို မသုံးနိုင်ပါဘူး။

Table ကို scan လုပ်နေစဉ်မှာ ပြဿနာတစ်ခု ပေါ်ပေါက်လာခဲ့ရင် — ဥပမာ — unique index တစ်ခုမှာ deadlock (သေကြောင်းကန်း ပိတ်ဆို့မှု) သို့မဟုတ် uniqueness violation (ထူးခြားမှု စည်းမျဉ်း ချိုးဖောက်မှု) မျိုးဆိုရင် — `CREATE INDEX` command က မအောင်မြင်ပေမယ့် — “invalid” index တစ်ခုကို နောက်မှာ ကျန်ရစ်စေပါတယ်။ ဒီ index က မပြည့်စုံနိုင်တာကြောင့် — query လုပ်ရာမှာ လျစ်လျူရှုခံရပါလိမ့်မယ်; ဒါပေမယ့် — update overhead ကိုတော့ ဆက်ပြီး စားသုံးနေဦးမှာ ဖြစ်ပါတယ်။ psql ရဲ့ `\d` command က ဒီလို index တစ်ခုကို `INVALID` အနေနဲ့ အစီရင်ခံပါလိမ့်မယ်:

```
postgres=# \d tab
       Table "public.tab"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 col    | integer |           |          |
Indexes:
    "idx" btree (col) INVALID
```

ဒီလို ကိစ္စမျိုးတွေမှာ အကြံပြုထားတဲ့ ပြန်လည် ကုစားနည်း (recovery method) ကတော့ — index ကို drop လုပ်ပြီး — `CREATE INDEX CONCURRENTLY` ကို နောက်တစ်ကြိမ် ပြန်ကြိုးစားဖို့ ဖြစ်ပါတယ်။ (နောက်ထပ် ဖြစ်နိုင်ခြေတစ်ခုကတော့ — `REINDEX INDEX CONCURRENTLY` နဲ့ index ကို ပြန်တည်ဆောက်တာ ဖြစ်ပါတယ်)။

Unique index တစ်ခုကို concurrently တည်ဆောက်တဲ့အခါ နောက်ထပ် သတိထားရမယ့် အချက်ကတော့ — ဒုတိယ table scan စတင်တဲ့အခါ — uniqueness constraint ကို တခြား transactions တွေအပေါ်မှာ စတင် အတင်းအကျပ် လုပ်ဆောင်နေပြီ ဖြစ်ပါတယ်။ ဒါက ဆိုလိုတာက — constraint violations တွေက — index ကို အသုံးပြုလို့ မရသေးခင် — တခြား queries တွေမှာ အစီရင်ခံခံရနိုင်သလို — index build က နောက်ဆုံးမှာ မအောင်မြင်တဲ့ ကိစ္စတွေမှာတောင် ဖြစ်နိုင်ပါတယ်။ ဒါ့အပြင် — ဒုတိယ scan မှာ failure တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — “invalid” index က နောက်ပိုင်းမှာ သူ့ရဲ့ uniqueness constraint ကို ဆက်ပြီး အတင်းအကျပ် လုပ်ဆောင်နေဦးမှာ ဖြစ်ပါတယ်။

Expression indexes နဲ့ partial indexes တွေရဲ့ concurrent builds တွေကို ထောက်ပံ့ပါတယ်။ ဒီ expressions တွေကို အကဲဖြတ်ရာမှာ ဖြစ်ပေါ်တဲ့ errors တွေက — အပေါ်မှာ unique constraint violations အတွက် ဖော်ပြခဲ့တဲ့ အပြုအမူမျိုးကို ဖြစ်စေနိုင်ပါတယ်။

သာမန် (regular) index builds တွေက — တူညီတဲ့ table ပေါ်မှာ တခြား regular index builds တွေ တစ်ပြိုင်နက် ဖြစ်ပေါ်တာကို ခွင့်ပြုပေမယ့် — table တစ်ခုပေါ်မှာ concurrent index build တစ်ခုတည်းသာ တစ်ကြိမ်မှာ ဖြစ်ပေါ်နိုင်ပါတယ်။ ဘယ်အခြေအနေမှာပဲ ဖြစ်ဖြစ် — index တည်ဆောက်နေစဉ်မှာ table ရဲ့ schema ကို ပြုပြင်မွမ်းမံခြင်းကို ခွင့်မပြုပါဘူး။ နောက်ထပ် ကွာခြားချက်တစ်ခုကတော့ — သာမန် `CREATE INDEX` command ကို transaction block တစ်ခုအတွင်းမှာ လုပ်ဆောင်လို့ ရပေမယ့် — `CREATE INDEX CONCURRENTLY` ကတော့ မရပါဘူး။

Partitioned tables တွေပေါ်က indexes တွေရဲ့ concurrent builds တွေကို လောလောဆယ် ထောက်ပံ့မထားပါဘူး။ ဒါပေမယ့် — partitioned table ဆီ writes တွေ lock ချခံရမယ့် အချိန်ကို လျှော့ချနိုင်ဖို့ — partition တစ်ခုချင်းစီပေါ်မှာ index ကို တစ်ဦးချင်းစီ concurrently တည်ဆောက်ပြီး — နောက်ဆုံးမှာ partitioned index ကို non-concurrently ဖန်တီးနိုင်ပါတယ်။ ဒီကိစ္စမှာ — partitioned index တည်ဆောက်တာက metadata သက်သက် ပါဝင်တဲ့ operation တစ်ခုသာ ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

Index တွေကို ဘယ်အချိန်တွေမှာ သုံးနိုင်လဲ၊ ဘယ်အချိန်တွေမှာ မသုံးဘူးလဲ၊ ဘယ်လို သီးခြား အခြေအနေတွေမှာ အသုံးဝင်နိုင်လဲဆိုတဲ့ အချက်အလက်တွေအတွက် [အခန်း 11](/docs/postgresql/indexes) ကို ကြည့်ပါ။

လောလောဆယ်တော့ — B-tree, GiST, GIN နဲ့ BRIN index methods တွေကပဲ — multiple-key-column indexes (key column အများအပြား ပါတဲ့ indexes) တွေကို ထောက်ပံ့ပါတယ်။ Key columns အများအပြား ရှိနိုင်လားဆိုတာက — `INCLUDE` columns တွေကို index ဆီ ထပ်ပေါင်းလို့ ရနိုင်လားဆိုတာနဲ့ သီးခြား လွတ်လပ်ပါတယ်။ Indexes တွေမှာ — `INCLUDE` columns တွေ အပါအဝင် — column 32 ခုအထိ ရှိနိုင်ပါတယ်။ (ဒီ ကန့်သတ်ချက်ကို PostgreSQL တည်ဆောက်တဲ့အခါ ပြောင်းလဲလို့ ရပါတယ်။) လောလောဆယ် B-tree တစ်ခုတည်းကပဲ unique indexes တွေကို ထောက်ပံ့ပါတယ်။

Index တစ်ခုရဲ့ column တစ်ခုချင်းစီအတွက် — optional parameters တွေ ပါတဲ့ *operator class* (operator အတန်းအစား) တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ Operator class က — အဲဒီ column အတွက် index က သုံးမယ့် operators တွေကို သတ်မှတ်ပေးပါတယ်။ ဥပမာ — four-byte integers တွေပေါ်က B-tree index တစ်ခုက `int4_ops` class ကို သုံးပါလိမ့်မယ်; ဒီ operator class ထဲမှာ four-byte integers တွေအတွက် comparison functions တွေ ပါဝင်ပါတယ်။ လက်တွေ့မှာတော့ — column ရဲ့ data type အတွက် default operator class ကပဲ ပုံမှန်အားဖြင့် လုံလောက်ပါတယ်။ Operator classes တွေ ထားရှိရတဲ့ အဓိက ရည်ရွယ်ချက်ကတော့ — data type တချို့အတွက် — အဓိပ္ပာယ်ရှိတဲ့ ordering (စီစဉ်မှု) တစ်ခုထက်ပို ရှိနိုင်လို့ ဖြစ်ပါတယ်။ ဥပမာ — complex-number data type တစ်ခုကို absolute value (ပကတိ တန်ဖိုး) အလိုက် ဒါမှမဟုတ် real part (ကိန်းစစ် အစိတ်အပိုင်း) အလိုက် စီချင်တာ ဖြစ်နိုင်ပါတယ်။ အဲဒါကို — data type အတွက် operator class နှစ်ခု သတ်မှတ်ပြီး — index တစ်ခု ဖန်တီးတဲ့အခါ သင့်လျော်တဲ့ class ကို ရွေးချယ်ခြင်းအားဖြင့် လုပ်နိုင်ပါတယ်။ Operator classes တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေက [အပိုင်း 11.10](/docs/postgresql/indexes-opclass) နဲ့ [အပိုင်း 36.16](https://www.postgresql.org/docs/current/xindex.html) မှာ ရှိပါတယ်။

`CREATE INDEX` ကို partitioned table တစ်ခုပေါ်မှာ ခေါ်ယူတဲ့အခါ — default အပြုအမူကတော့ — partitions တွေ အားလုံးမှာ ကိုက်ညီတဲ့ indexes တွေ ရှိစေဖို့ — partitions အားလုံးဆီ recurse (ဆင့်ပွား ဆက်လုပ်) လုပ်ပါတယ်။ Partition တစ်ခုချင်းစီကို — ညီမျှတဲ့ (equivalent) index တစ်ခု ရှိပြီးသားလားဆိုတာ အရင်ဆုံး စစ်ဆေးပြီး — ရှိပြီးသားဆိုရင် — အဲဒီ index ကို — ဖန်တီးနေတဲ့ index ရဲ့ partition index အဖြစ် attach လုပ်ပြီး — ဖန်တီးနေတဲ့ index ကလည်း သူ့ရဲ့ parent index ဖြစ်လာပါတယ်။ ကိုက်ညီတဲ့ index မရှိဘူးဆိုရင် — index အသစ်တစ်ခုကို ဖန်တီးပြီး အလိုအလျောက် attach လုပ်ပါတယ်; partition တစ်ခုချင်းစီမှာရှိတဲ့ index အသစ်ရဲ့ နာမည်ကို — command ထဲမှာ index name သတ်မှတ်ထားခြင်း မရှိသလိုမျိုး — ဆုံးဖြတ်ပါတယ်။ `ONLY` option ကို သတ်မှတ်ထားရင် — recursion မလုပ်ဘဲ — index ကို invalid လို့ အမှတ်အသား လုပ်ပါတယ်။ (Partitions တွေ အားလုံး ကိုက်ညီတဲ့ indexes တွေ ရရှိပြီးတာနဲ့ — `ALTER INDEX ... ATTACH PARTITION` က index ကို valid လို့ အမှတ်အသား လုပ်ပေးပါတယ်။) ဒါပေမယ့် — နောင်မှာ `CREATE TABLE ... PARTITION OF` သုံးပြီး ဖန်တီးခံရမယ့် ဘယ် partition မဆို — `ONLY` ကို သတ်မှတ်ထားလား မသတ်မှတ်ထားဘူးလား မသက်ဆိုင်ဘဲ — အလိုအလျောက် ကိုက်ညီတဲ့ index တစ်ခု ရှိလာမယ်ဆိုတာ သတိပြုပါ။

Ordered scans တွေကို ထောက်ပံ့တဲ့ index methods တွေအတွက် (လောလောဆယ် B-tree တစ်ခုတည်း) — index ရဲ့ sort ordering ကို ပြုပြင်ဖို့ — optional clauses တွေဖြစ်တဲ့ `ASC`, `DESC`, `NULLS FIRST` နဲ့/သို့မဟုတ် `NULLS LAST` တွေကို သတ်မှတ်နိုင်ပါတယ်။ Ordered index တစ်ခုကို ရှေ့ကနေ ဒါမှမဟုတ် နောက်ကနေ scan လုပ်လို့ ရတာကြောင့် — column တစ်ခုတည်း ပါတဲ့ `DESC` index တစ်ခုကို ဖန်တီးတာက ပုံမှန်အားဖြင့် အသုံးမဝင်ပါဘူး — အဲဒီ sort ordering က သာမန် index တစ်ခုနဲ့တင် ရနေပြီးသားမို့ပါ။ ဒီ options တွေရဲ့ တန်ဖိုးကတော့ — mixed-ordering query တစ်ခု (ဥပမာ — `SELECT ... ORDER BY x ASC, y DESC`) က တောင်းဆိုထားတဲ့ sort ordering နဲ့ ကိုက်ညီတဲ့ multicolumn indexes တွေကို ဖန်တီးနိုင်စေတာ ဖြစ်ပါတယ်။ `NULLS` options တွေကတော့ — sorting steps တွေကို ရှောင်ရှားဖို့ indexes တွေကို မှီခိုနေတဲ့ queries တွေမှာ — default ဖြစ်တဲ့ “nulls sort high” အပြုအမူ အစား — “nulls sort low” (nulls တွေကို အနိမ့်ဆုံး အနေနဲ့ စီခြင်း) အပြုအမူကို ထောက်ပံ့ဖို့ လိုအပ်ရင် အသုံးဝင်ပါတယ်။

System က table တစ်ခုရဲ့ columns တွေ အားလုံးပေါ်မှာ statistics (စာရင်းအင်း အချက်အလက်များ) တွေကို ပုံမှန် စုဆောင်းပါတယ်။ အသစ် ဖန်တီးထားတဲ့ — expression မဟုတ်တဲ့ indexes တွေက — index တစ်ခုရဲ့ အသုံးဝင်မှုကို ဆုံးဖြတ်ဖို့ ဒီ statistics တွေကို ချက်ချင်း သုံးနိုင်ပါတယ်။ Expression indexes အသစ်တွေအတွက်တော့ — ဒီ indexes တွေအတွက် statistics တွေ ထုတ်ပေးဖို့ — [`ANALYZE`](/docs/postgresql/sql-analyze) ကို run လုပ်ဖို့ သို့မဟုတ် [autovacuum daemon](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) က table ကို analyze လုပ်ဖို့ စောင့်ဆိုင်းဖို့ လိုအပ်ပါတယ်။

`CREATE INDEX` run လုပ်နေစဉ်အတွင်း — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။

Index methods အများစုအတွက် — index တစ်ခု ဖန်တီးတဲ့ မြန်နှုန်းက [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) ရဲ့ setting ပေါ်မှာ မှီခိုပါတယ်။ တန်ဖိုး ပိုကြီးလေ — index creation အတွက် လိုအပ်တဲ့ အချိန် လျော့ကျလေလေ ဖြစ်ပါတယ် — machine ကို swapping (memory လဲလှယ် သုံးစွဲမှု) ဆီ တွန်းပို့စေမယ့် — တကယ် ရနိုင်တဲ့ memory ပမာဏထက် ပိုကြီးအောင်တော့ မလုပ်ထားသရွေ့ပေါ့။

PostgreSQL က — table rows တွေကို ပိုမြန်မြန် process လုပ်နိုင်ဖို့ — CPUs အများအပြားကို အသုံးချပြီး indexes တွေကို တည်ဆောက်နိုင်ပါတယ်။ ဒီ feature ကို *parallel index build* (အပြိုင် index တည်ဆောက်ခြင်း) လို့ ခေါ်ပါတယ်။ Index တွေကို parallel အနေနဲ့ တည်ဆောက်တာကို ထောက်ပံ့တဲ့ index methods တွေအတွက် (လောလောဆယ် — B-tree, GIN နဲ့ BRIN) — `maintenance_work_mem` က — worker processes ဘယ်နှစ်ခု စတင်ခဲ့လဲ မသက်ဆိုင်ဘဲ — index build operation တစ်ခုချင်းစီ တစ်ခုလုံးအတွက် သုံးနိုင်တဲ့ memory ရဲ့ အများဆုံး ပမာဏကို သတ်မှတ်ပါတယ်။ ယေဘုယျအားဖြင့် — cost model (ကုန်ကျစရိတ် ပုံစံ) တစ်ခုက — worker processes ဘယ်နှစ်ခု တောင်းဆိုသင့်လဲဆိုတာကို — တောင်းဆိုသင့်ရင် — အလိုအလျောက် ဆုံးဖြတ်ပေးပါတယ်။

Parallel index builds တွေက — ညီမျှတဲ့ serial index build တစ်ခုမှာ အကျိုးရှိမှု နည်းပါးမယ့်နေရာမှာ — `maintenance_work_mem` ကို တိုးမြှင့်ခြင်းကနေ အကျိုးရှိနိုင်ပါတယ်။ `maintenance_work_mem` က တောင်းဆိုခံရတဲ့ worker processes အရေအတွက်ကို လွှမ်းမိုးနိုင်တယ်ဆိုတာ သတိပြုပါ — ဘာလို့လဲဆိုတော့ — parallel workers တွေက စုစုပေါင်း `maintenance_work_mem` budget ရဲ့ အနည်းဆုံး `32MB` အစုဝေစု တစ်ခု ရှိရမှာ ဖြစ်လို့ပါ။ Leader process အတွက်လည်း ကျန်တဲ့ `32MB` အစုဝေစု တစ်ခု ရှိရပါမယ်။ [max_parallel_maintenance_workers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-MAINTENANCE-WORKERS) ကို တိုးမြှင့်တာက — workers တွေ ပိုသုံးနိုင်အောင် ခွင့်ပြုနိုင်ပြီး — index build က I/O bound (I/O ကြောင့် နှောင့်နှေးနေတာ) မဖြစ်နေသရွေ့ — index creation အတွက် လိုအပ်တဲ့ အချိန်ကို လျှော့ချပေးနိုင်ပါတယ်။ သေချာတာကတော့ — တခြားနည်း အားလပ်နေမယ့် — လုံလောက်တဲ့ CPU capacity လည်း ရှိသင့်ပါတယ်။

[`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) ကနေတစ်ဆင့် `parallel_workers` အတွက် တန်ဖိုးတစ်ခု သတ်မှတ်တာက — table တစ်ခုအပေါ် `CREATE INDEX` တစ်ခုက parallel worker processes ဘယ်နှစ်ခု တောင်းဆိုမလဲဆိုတာကို တိုက်ရိုက် ထိန်းချုပ်ပါတယ်။ ဒါက cost model ကို လုံးဝ ရှောင်ကွင်းလိုက်ပြီး — `maintenance_work_mem` က parallel workers ဘယ်နှစ်ခု တောင်းဆိုမလဲဆိုတာကို သက်ရောက်မှု ရှိစေတာကိုလည်း တားဆီးပါတယ်။ `ALTER TABLE` ကနေတစ်ဆင့် `parallel_workers` ကို 0 လို့ သတ်မှတ်တာက — table ပေါ်မှာ parallel index builds တွေကို ကိစ္စ အားလုံးမှာ disable လုပ်ပါလိမ့်မယ်။

> **အကြံပြုချက်:** Index build တစ်ခုကို ချိန်ညှိ (tune) တဲ့ အစိတ်အပိုင်းအနေနဲ့ `parallel_workers` ကို သတ်မှတ်ပြီးတဲ့ နောက်မှာ — ၎င်းကို ပြန်လည် reset လုပ်ချင်နိုင်ပါတယ်။ ဒါက query plans တွေမှာ မရည်ရွယ်ဘဲ ပြောင်းလဲမှုတွေ ဖြစ်ပေါ်တာကို ရှောင်ရှားပေးပါတယ် — ဘာလို့လဲဆိုတော့ `parallel_workers` က parallel table scans တွေ အားလုံးကို သက်ရောက်လို့ပါ။

`CONCURRENTLY` option ပါတဲ့ `CREATE INDEX` က parallel builds တွေကို အထူး ကန့်သတ်ချက် မရှိဘဲ ထောက်ပံ့ပေးပေမယ့် — table scan ပထမတစ်ခုကသာ တကယ်တော့ parallel အနေနဲ့ လုပ်ဆောင်တာ ဖြစ်ပါတယ်။

Index တစ်ခုကို ဖယ်ရှားဖို့ [`DROP INDEX`](/docs/postgresql/sql-dropindex) ကို သုံးပါ။

ကြာမြင့်တဲ့ transaction တစ်ခုခုလိုပဲ — table တစ်ခုပေါ်က `CREATE INDEX` က — တခြား table တစ်ခုခုပေါ်မှာ concurrent `VACUUM` တစ်ခုက ဖယ်ရှားနိုင်တဲ့ tuples တွေကို သက်ရောက်မှု ရှိနိုင်ပါတယ်။

PostgreSQL ရဲ့ အရင် releases တွေမှာ R-tree index method တစ်ခုလည်း ရှိခဲ့ပါတယ်။ ဒီ method ကို — GiST method အပေါ်မှာ သိသာတဲ့ အားသာချက်တွေ မရှိတာကြောင့် — ဖယ်ရှားလိုက်ပါပြီ။ `USING rtree` ကို သတ်မှတ်ထားရင် — `CREATE INDEX` က ၎င်းကို `USING gist` အနေနဲ့ အဓိပ္ပာယ် ကောက်ယူပြီး — databases အဟောင်းတွေကို GiST ဆီ ပြောင်းလဲရတာ ရိုးရှင်းစေပါတယ်။

`CREATE INDEX` run လုပ်နေတဲ့ backend တစ်ခုချင်းစီက — `pg_stat_progress_create_index` view ထဲမှာ — သူ့ရဲ့ တိုးတက်မှု (progress) ကို အစီရင်ခံပါလိမ့်မယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.4.4](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`films` table ထဲက `title` column ပေါ်မှာ unique B-tree index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE UNIQUE INDEX title_idx ON films (title);
```

`films` table ထဲက `title` column ပေါ်မှာ — included columns တွေဖြစ်တဲ့ `director` နဲ့ `rating` တွေ ပါဝင်တဲ့ — unique B-tree index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE UNIQUE INDEX title_idx ON films (title) INCLUDE (director, rating);
```

Deduplication ကို disable လုပ်ထားတဲ့ B-Tree index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX title_idx ON films (title) WITH (deduplicate_items = off);
```

`lower(title)` expression ပေါ်မှာ — case-insensitive (စာလုံး အကြီး/အသေး ခွဲခြားမှု မရှိတဲ့) ရှာဖွေမှုတွေကို ထိရောက်စေဖို့ — index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX ON films ((lower(title)));
```

(ဒီဥပမာမှာ index name ကို ချန်လိုက်ဖို့ ရွေးချယ်ထားတာမို့ — system က နာမည်တစ်ခုကို ရွေးချယ်ပေးပါလိမ့်မယ် — ပုံမှန်အားဖြင့် `films_lower_idx` ဖြစ်ပါတယ်။)

Non-default collation တစ်ခုနဲ့ index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX title_idx_german ON films (title COLLATE "de_DE");
```

Nulls တွေရဲ့ non-default sort ordering နဲ့ index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX title_idx_nulls_low ON films (title NULLS FIRST);
```

Non-default fill factor နဲ့ index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE UNIQUE INDEX title_idx ON films (title) WITH (fillfactor = 70);
```

Fast updates တွေကို disable လုပ်ထားတဲ့ GIN index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX gin_idx ON documents_table USING GIN (locations) WITH (fastupdate = off);
```

`films` table ထဲက `code` column ပေါ်မှာ index တစ်ခု ဖန်တီးပြီး — index ကို `indexspace` tablespace ထဲမှာ နေရာချထားဖို့:

```sql
CREATE INDEX code_idx ON films (code) TABLESPACE indexspace;
```

Conversion function ရဲ့ ရလဒ်ပေါ်မှာ box operators တွေကို ထိရောက်စွာ သုံးနိုင်အောင် — point attribute တစ်ခုပေါ်မှာ GiST index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX pointloc
    ON points USING gist (box(location,location));
SELECT * FROM points
    WHERE box(location,location) && '(0,0),(1,1)'::box;
```

Table ဆီ writes တွေ lock ချခြင်း မရှိဘဲ index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX CONCURRENTLY sales_quantity_index ON sales_table (quantity);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE INDEX` က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ထဲမှာ indexes တွေအတွက် ပြဋ္ဌာန်းချက် (provisions) တွေ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER INDEX](/docs/postgresql/sql-alterindex), [DROP INDEX](/docs/postgresql/sql-dropindex), [REINDEX](/docs/postgresql/sql-reindex), [အပိုင်း 27.4.4](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)
