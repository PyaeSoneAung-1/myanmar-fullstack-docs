---
title: "Index Types (index အမျိုးအစားများ)"
description: "PostgreSQL ၏ index type အမျိုးမျိုး — B-tree, Hash, GiST, SP-GiST, GIN, BRIN တို့၏ သဘောတရား၊ တစ်ခုချင်းစီက ထောက်ပံ့နိုင်သော query နှင့် operator အမျိုးအစားများ"
order: 69
source: "https://www.postgresql.org/docs/current/indexes-types.html"
status: translated
updated: 2026-09-03
---

## 11.2. Index Types (index အမျိုးအစားများ)

- **11.2.1. B-Tree**
- **11.2.2. Hash**
- **11.2.3. GiST**
- **11.2.4. SP-GiST**
- **11.2.5. GIN**
- **11.2.6. BRIN**

PostgreSQL မှာ index type အမျိုးမျိုး ပံ့ပိုးပေးထားပါတယ် — B-tree, Hash, GiST, SP-GiST, GIN, BRIN နဲ့ [bloom](https://www.postgresql.org/docs/current/bloom.html) extension တို့ ဖြစ်ပါတယ်။ Index type တစ်ခုချင်းစီက မတူညီတဲ့ algorithm ကို သုံးပြီး — တစ်ခုချင်းစီဟာ indexable clause (index သုံးလို့ရတဲ့ clause) အမျိုးအစား အသီးသီးအတွက် အသင့်တော်ဆုံး ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — [`CREATE INDEX`](https://www.postgresql.org/docs/current/sql-createindex.html) command က အဖြစ်အများဆုံး အခြေအနေတွေနဲ့ ကိုက်ညီတဲ့ B-tree index တွေကို ဖန်တီးပေးပါတယ်။ ကျန်တဲ့ index type တွေကတော့ `USING` ဆိုတဲ့ keyword နောက်မှာ index type ရဲ့ နာမည်ကို ရေးပြီး ရွေးချယ်ပါတယ်။ ဥပမာ — Hash index တစ်ခု ဖန်တီးဖို့ဆိုရင် —

```sql
CREATE INDEX name ON table USING HASH (column);
```

### 11.2.1. B-Tree (စီစဉ်နိုင်သော ဒေတာအတွက် ညီမျှမှုနှင့် range query ကို ထောက်ပံ့သော index)

B-tree တွေက ပုံစံတစ်မျိုးမျိုးနဲ့ စီစဉ်လို့ရတဲ့ (sortable) ဒေတာအပေါ်မှာ equality (ညီမျှမှု) နဲ့ range query (အပိုင်းအခြား ရှာဖွေမှု) တွေကို ကိုင်တွယ်နိုင်ပါတယ်။ အထူးသဖြင့် — index လုပ်ထားတဲ့ column တစ်ခု အောက်ပါ operator တွေထဲက တစ်ခုခုနဲ့ comparison (နှိုင်းယှဉ်မှု) လုပ်တာမှာ ပါဝင်နေတိုင်း — PostgreSQL ရဲ့ query planner (query ကို အကောင်းဆုံး စီစဉ်ပေးသည့် စနစ်) က B-tree index သုံးဖို့ စဉ်းစားပါလိမ့်မယ် —

```sql
<   <=   =   >=   >
```

ဒီ operator တွေရဲ့ ပေါင်းစပ်မှုနဲ့ ညီမျှတဲ့ construct တွေ — ဥပမာ `BETWEEN` နဲ့ `IN` — ကိုလည်း B-tree index ရှာဖွေမှုနဲ့ အကောင်အထည် ဖော်လို့ရပါတယ်။ ဒါ့အပြင် — index column တစ်ခုပေါ်က `IS NULL` ဒါမှမဟုတ် `IS NOT NULL` အခြေအနေ (condition) ကိုလည်း B-tree index နဲ့တွဲ သုံးလို့ရပါတယ်။

Pattern တစ်ခုက constant (ပုံသေတန်ဖိုး) ဖြစ်ပြီး — string ရဲ့ အစမှာ မြဲနေတယ်ဆိုရင် — pattern matching (ပုံစံ ကိုက်ညီမှု စစ်ဆေးခြင်း) operator တွေဖြစ်တဲ့ `LIKE` နဲ့ `~` ပါဝင်တဲ့ query တွေအတွက်လည်း optimizer က B-tree index ကို သုံးနိုင်ပါတယ်။ ဥပမာ — `col LIKE 'foo%'` ဒါမှမဟုတ် `col ~ '^foo'` ဆိုရင် ရပြီး — `col LIKE '%bar'` ဆိုရင်တော့ မရပါဘူး။ ဒါပေမယ့် — သင့် database က C locale ကို မသုံးဘူးဆိုရင် — pattern-matching query တွေကို index လုပ်နိုင်ဖို့ — special operator class (အထူး operator အတန်းအစား) တစ်ခုနဲ့ index ကို ဖန်တီးဖို့ လိုပါလိမ့်မယ်။ [အပိုင်း 11.10](/docs/postgresql/indexes-opclass) ကို ကြည့်ပါ။ `ILIKE` နဲ့ `~*` တို့အတွက်လည်း B-tree index ကို သုံးလို့ရပါတယ် — ဒါပေမယ့် pattern က upper/lower case ပြောင်းလဲမှုရဲ့ သက်ရောက်မှု မရှိတဲ့ စာလုံးမဟုတ်သည့် (non-alphabetic) character တွေနဲ့ စတင်မှသာ ဖြစ်ပါတယ်။

B-tree index တွေကို ဒေတာတွေကို စီထားပြီးသား အစီအစဉ် (sorted order) အတိုင်း ပြန်ယူဖို့အတွက်လည်း သုံးလို့ရပါတယ်။ ဒါက ရိုးရိုး scan လုပ်ပြီးမှ sort လုပ်တာထက် အမြဲတမ်း မြန်တာတော့ မဟုတ်ပါဘူး — ဒါပေမယ့် မကြာခဏဆိုသလို အသုံးဝင်ပါတယ်။

### 11.2.2. Hash (hash code ကို အခြေခံသော index)

Hash index တွေက index လုပ်ထားတဲ့ column ရဲ့ တန်ဖိုးကနေ ထုတ်ယူထားတဲ့ 32-bit hash code ကို သိမ်းဆည်းပါတယ်။ ဒါကြောင့် — ဒီလို index တွေက ရိုးရှင်းတဲ့ equality comparison (ညီမျှမှု နှိုင်းယှဉ်မှု) တွေကိုပဲ ကိုင်တွယ်နိုင်ပါတယ်။ Query planner က — index လုပ်ထားတဲ့ column တစ်ခု အောက်ပါ equal operator ပါတဲ့ comparison တစ်ခုမှာ ပါဝင်နေတိုင်း — hash index သုံးဖို့ စဉ်းစားပါလိမ့်မယ် —

```sql
=
```

### 11.2.3. GiST (indexing strategy အမျိုးမျိုး အကောင်အထည်ဖော်နိုင်သော မူဘောင်)

GiST index တွေက index အမျိုးအစား တစ်ခုတည်း မဟုတ်ပါဘူး — indexing strategy (index ပြုလုပ်သည့် နည်းဗျူဟာ) အမျိုးမျိုးကို အကောင်အထည် ဖော်လို့ရတဲ့ infrastructure (မူဘောင်) တစ်ခု ဖြစ်ပါတယ်။ ဒါကြောင့် — GiST index တစ်ခုနဲ့ သုံးလို့ရတဲ့ operator တွေဟာ — indexing strategy (တနည်းအားဖြင့် *operator class*) ပေါ် မူတည်ပြီး ကွဲပြားပါတယ်။ ဥပမာအနေနဲ့ — PostgreSQL ရဲ့ စံ distribution (standard distribution) ထဲမှာ နှစ်ဘက်မြင် (two-dimensional) geometric data type တချို့အတွက် GiST operator class တွေ ပါဝင်ပြီး — အဲဒါတွေက အောက်ပါ operator တွေကို သုံးပြီး index နဲ့ ရှာဖွေတဲ့ query တွေကို ထောက်ပံ့ပါတယ် —

```sql
<<   &<   &>   >>   <<|   &<|   |&>   |>>   @>   <@   ~=   &&
```

(ဒီ operator တွေရဲ့ အဓိပ္ပာယ်အတွက် [အပိုင်း 9.11](https://www.postgresql.org/docs/current/functions-geometry.html) ကို ကြည့်ပါ။) စံ distribution ထဲမှာ ပါဝင်တဲ့ GiST operator class တွေကို [ဇယား 65.1](https://www.postgresql.org/docs/current/gist.html#GIST-BUILTIN-OPCLASSES-TABLE) မှာ မှတ်တမ်းတင်ထားပါတယ်။ `contrib` collection ထဲမှာ ဒါမှမဟုတ် သီးခြား project တွေအနေနဲ့ — တခြား GiST operator class တွေ အများကြီးလည်း ရနိုင်ပါသေးတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 65.2](https://www.postgresql.org/docs/current/gist.html) ကို ကြည့်ပါ။

GiST index တွေက “nearest-neighbor” (အနီးဆုံး အိမ်နီးချင်း) ရှာဖွေမှုတွေကိုလည်း optimize (အကောင်းဆုံးဖြစ်အောင် ပြုလုပ်) နိုင်ပါတယ် — ဥပမာ —

```sql
SELECT * FROM places ORDER BY location <-> point '(101,456)' LIMIT 10;
```

ဒီ query က ပေးထားတဲ့ target point တစ်ခုနဲ့ အနီးဆုံး နေရာ (place) ဆယ်ခုကို ရှာဖွေပေးပါတယ်။ ဒီလို လုပ်နိုင်စွမ်းကလည်း သုံးနေတဲ့ operator class ပေါ်မှာပဲ မူတည်ပါတယ်။ [ဇယား 65.1](https://www.postgresql.org/docs/current/gist.html#GIST-BUILTIN-OPCLASSES-TABLE) ထဲမှာ — ဒီနည်းနဲ့ သုံးလို့ရတဲ့ operator တွေကို “Ordering Operators” ဆိုတဲ့ column မှာ စာရင်းပြုစုထားပါတယ်။

### 11.2.4. SP-GiST (disk-based ဒေတာတည်ဆောက်ပုံ အမျိုးမျိုးအတွက် မူဘောင်)

SP-GiST index တွေက GiST index တွေလိုပဲ — ရှာဖွေမှု အမျိုးမျိုးကို ထောက်ပံ့တဲ့ infrastructure တစ်ခုကို ပေးပါတယ်။ SP-GiST က balanced မဟုတ်တဲ့ (non-balanced) disk-based ဒေတာတည်ဆောက်ပုံ (data structure) အမျိုးမျိုး — ဥပမာ quadtree, k-d tree နဲ့ radix tree (trie) စတာတွေ — ကို အကောင်အထည် ဖော်နိုင်စေပါတယ်။ ဥပမာအနေနဲ့ — PostgreSQL ရဲ့ စံ distribution ထဲမှာ နှစ်ဘက်မြင် point တွေအတွက် SP-GiST operator class တွေ ပါဝင်ပြီး — အဲဒါတွေက အောက်ပါ operator တွေကို သုံးပြီး index နဲ့ ရှာဖွေတဲ့ query တွေကို ထောက်ပံ့ပါတယ် —

```sql
<<   >>   ~=   <@   <<|   |>>
```

(ဒီ operator တွေရဲ့ အဓိပ္ပာယ်အတွက် [အပိုင်း 9.11](https://www.postgresql.org/docs/current/functions-geometry.html) ကို ကြည့်ပါ။) စံ distribution ထဲမှာ ပါဝင်တဲ့ SP-GiST operator class တွေကို [ဇယား 65.2](https://www.postgresql.org/docs/current/spgist.html#SPGIST-BUILTIN-OPCLASSES-TABLE) မှာ မှတ်တမ်းတင်ထားပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 65.3](https://www.postgresql.org/docs/current/spgist.html) ကို ကြည့်ပါ။

GiST လိုပဲ — SP-GiST ကလည်း “nearest-neighbor” ရှာဖွေမှုတွေကို ထောက်ပံ့ပါတယ်။ Distance (အကွာအဝေး) အလိုက် စီစဉ်မှု (distance ordering) ကို ထောက်ပံ့တဲ့ SP-GiST operator class တွေအတွက် — သက်ဆိုင်ရာ operator ကို [ဇယား 65.2](https://www.postgresql.org/docs/current/spgist.html#SPGIST-BUILTIN-OPCLASSES-TABLE) ထဲက “Ordering Operators” column မှာ စာရင်းပြုစုထားပါတယ်။

### 11.2.5. GIN (အစိတ်အပိုင်း တန်ဖိုးများစွာ ပါဝင်သော ဒေတာအတွက် inverted index)

GIN index တွေက “inverted index” (ပြောင်းပြန် index) တွေ ဖြစ်ပြီး — array လို component value (အစိတ်အပိုင်း တန်ဖိုး) အများအပြား ပါဝင်တဲ့ ဒေတာတန်ဖိုးတွေအတွက် သင့်လျော်ပါတယ်။ Inverted index တစ်ခုထဲမှာ component value တစ်ခုချင်းစီအတွက် သီးခြား entry တစ်ခုစီ ပါဝင်ပြီး — သတ်မှတ်ထားတဲ့ component value တွေ ရှိ/မရှိ စစ်ဆေးတဲ့ query တွေကို ထိရောက်စွာ ကိုင်တွယ်နိုင်ပါတယ်။

GiST နဲ့ SP-GiST လိုပဲ — GIN ကလည်း user-defined (အသုံးပြုသူ သတ်မှတ်သော) indexing strategy အမျိုးမျိုးကို ထောက်ပံ့နိုင်ပြီး — GIN index တစ်ခုနဲ့ သုံးလို့ရတဲ့ operator တွေဟာ indexing strategy ပေါ် မူတည်ပြီး ကွဲပြားပါတယ်။ ဥပမာအနေနဲ့ — PostgreSQL ရဲ့ စံ distribution ထဲမှာ array တွေအတွက် GIN operator class တစ်ခု ပါဝင်ပြီး — အဲဒါက အောက်ပါ operator တွေကို သုံးပြီး index နဲ့ ရှာဖွေတဲ့ query တွေကို ထောက်ပံ့ပါတယ် —

```sql
<@   @>   =   &&
```

(ဒီ operator တွေရဲ့ အဓိပ္ပာယ်အတွက် [အပိုင်း 9.19](https://www.postgresql.org/docs/current/functions-array.html) ကို ကြည့်ပါ။) စံ distribution ထဲမှာ ပါဝင်တဲ့ GIN operator class တွေကို [ဇယား 65.3](https://www.postgresql.org/docs/current/gin.html#GIN-BUILTIN-OPCLASSES-TABLE) မှာ မှတ်တမ်းတင်ထားပါတယ်။ `contrib` collection ထဲမှာ ဒါမှမဟုတ် သီးခြား project တွေအနေနဲ့ — တခြား GIN operator class တွေ အများကြီးလည်း ရနိုင်ပါသေးတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 65.4](https://www.postgresql.org/docs/current/gin.html) ကို ကြည့်ပါ။

### 11.2.6. BRIN (block range တစ်ခုချင်းစီအလိုက် အကျဉ်းချုပ်များ သိမ်းဆည်းသော index)

BRIN index တွေ (Block Range INdexes ရဲ့ အတိုကောက်) က — table ထဲက ဆက်တိုက်ဖြစ်တဲ့ physical block range (block အပိုင်းအခြား) တစ်ခုချင်းစီထဲမှာ သိမ်းထားတဲ့ တန်ဖိုးတွေရဲ့ အကျဉ်းချုပ် (summary) အချက်အလက်တွေကို သိမ်းဆည်းပါတယ်။ ဒါကြောင့် — ဒီ index တွေက column ထဲက တန်ဖိုးတွေ table row တွေရဲ့ physical အစီအစဉ်နဲ့ ကောင်းစွာ ဆက်စပ်နေတဲ့ (well-correlated) column တွေအတွက် အထိရောက်ဆုံး ဖြစ်ပါတယ်။ GiST, SP-GiST နဲ့ GIN လိုပဲ — BRIN ကလည်း indexing strategy အမျိုးမျိုးကို ထောက်ပံ့နိုင်ပြီး — BRIN index တစ်ခုနဲ့ သုံးလို့ရတဲ့ operator တွေဟာ indexing strategy ပေါ် မူတည်ပြီး ကွဲပြားပါတယ်။ Linear sort order (မျဉ်းဖြောင့်သဘော စီစဉ်မှု အစီအစဉ်) ရှိတဲ့ data type တွေအတွက်ဆိုရင် — index လုပ်ထားတဲ့ ဒေတာက block range တစ်ခုချင်းစီအတွက် — column ထဲက တန်ဖိုးတွေရဲ့ အနိမ့်ဆုံးနဲ့ အမြင့်ဆုံး (minimum နဲ့ maximum) တန်ဖိုးတွေကို ကိုယ်စားပြုပါတယ်။ ဒါက အောက်ပါ operator တွေကို သုံးပြီး index နဲ့ ရှာဖွေတဲ့ query တွေကို ထောက်ပံ့ပေးပါတယ် —

```sql
<   <=   =   >=   >
```

စံ distribution ထဲမှာ ပါဝင်တဲ့ BRIN operator class တွေကို [ဇယား 65.4](https://www.postgresql.org/docs/current/brin.html#BRIN-BUILTIN-OPCLASSES-TABLE) မှာ မှတ်တမ်းတင်ထားပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 65.5](https://www.postgresql.org/docs/current/brin.html) ကို ကြည့်ပါ။
