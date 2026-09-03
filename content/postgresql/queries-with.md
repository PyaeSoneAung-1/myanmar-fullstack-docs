---
title: "WITH Queries (WITH query များ — Common Table Expressions)"
description: "WITH query (CTE) အကြောင်း — WITH ထဲ SELECT သုံးခြင်း၊ recursive query များ (SEARCH/CYCLE clause အပါအဝင်)၊ CTE materialization နဲ့ WITH ထဲ data-modifying statement (INSERT/UPDATE/DELETE/MERGE, RETURNING ပါ) သုံးခြင်း"
order: 47
source: "https://www.postgresql.org/docs/current/queries-with.html"
status: translated
updated: 2026-09-03
---

## 7.8. `WITH` Queries (WITH query များ — Common Table Expressions)

- **7.8.1. SELECT in WITH (WITH ထဲမှာ SELECT သုံးခြင်း)**
- **7.8.2. Recursive Queries (recursive query များ)**
- **7.8.3. Common Table Expression Materialization (CTE ကို materialize လုပ်ခြင်း)**
- **7.8.4. Data-Modifying Statements in WITH (WITH ထဲမှာ data ပြုပြင်သည့် statement များ)**

`WITH` က — ပိုကြီးတဲ့ query တစ်ခုအတွင်းမှာ သုံးဖို့ အရန် (auxiliary) statement တွေကို ရေးသားနိုင်တဲ့ နည်းလမ်းတစ်ခု ပေးပါတယ်။ မကြာခဏ Common Table Expression (CTE) လို့ ရည်ညွှန်းလေ့ရှိတဲ့ ဒီ statement တွေကို — query တစ်ခုတည်းအတွက်ပဲ တည်ရှိတဲ့ temporary table (ယာယီ table) တွေကို သတ်မှတ်ပေးတာလို့ မှတ်ယူလို့ရပါတယ်။ `WITH` clause ထဲက အရန် statement တစ်ခုစီဟာ `SELECT`, `INSERT`, `UPDATE`, `DELETE` သို့မဟုတ် `MERGE` ဖြစ်နိုင်ပြီး — `WITH` clause ကိုယ်တိုင်ကိုလည်း — `SELECT`, `INSERT`, `UPDATE`, `DELETE` သို့မဟုတ် `MERGE` ဖြစ်နိုင်တဲ့ primary statement (ပင်မ statement) တစ်ခုဆီမှာ တွဲထားပါတယ်။

### 7.8.1. `SELECT` in `WITH` (WITH ထဲမှာ SELECT သုံးခြင်း)

`WITH` ထဲမှာ `SELECT` သုံးခြင်းရဲ့ အခြေခံ တန်ဖိုးက — ရှုပ်ထွေးတဲ့ query တွေကို ပိုရိုးရှင်းတဲ့ အပိုင်းလေးတွေအဖြစ် ခွဲချနိုင်တာပဲ ဖြစ်ပါတယ်။ ဥပမာတစ်ခုကတော့:

```sql
WITH regional_sales AS (
    SELECT region, SUM(amount) AS total_sales
    FROM orders
    GROUP BY region
), top_regions AS (
    SELECT region
    FROM regional_sales
    WHERE total_sales > (SELECT SUM(total_sales)/10 FROM regional_sales)
)
SELECT region,
       product,
       SUM(quantity) AS product_units,
       SUM(amount) AS product_sales
FROM orders
WHERE region IN (SELECT region FROM top_regions)
GROUP BY region, product;
```

ဒီ query က — ထိပ်တန်း ရောင်းအားရှိတဲ့ ဒေသ (top sales regions) တွေမှာပဲ — ထုတ်ကုန်တစ်ခုချင်းစီရဲ့ စုစုပေါင်း ရောင်းအား (per-product sales totals) တွေကို ပြသပါတယ်။ `WITH` clause က `regional_sales` နဲ့ `top_regions` လို့ နာမည်ပေးထားတဲ့ အရန် statement နှစ်ခုကို သတ်မှတ်ပေးပြီး — `regional_sales` ရဲ့ output ကို `top_regions` ထဲမှာ သုံးထားပြီး — `top_regions` ရဲ့ output ကိုတော့ primary `SELECT` query ထဲမှာ သုံးပါတယ်။ ဒီဥပမာကို `WITH` မသုံးဘဲလည်း ရေးလို့ရနိုင်ပေမယ့် — အဲဒီအခါ sub-`SELECT` အသိုက်လိုက် (nested) အလွှာ နှစ်လွှာ လိုအပ်မှာ ဖြစ်ပါတယ်။ ဒီနည်းနဲ့ ရေးတာက နားလည်ရ အနည်းငယ် လွယ်ကူပါတယ်။

### 7.8.2. Recursive Queries (recursive query များ)

Optional `RECURSIVE` modifier က `WITH` ကို — သာမာန် syntax ပိုင်းဆိုင်ရာ အဆင်ပြေမှု (mere syntactic convenience) သက်သက်ကနေ — standard SQL မှာ တခြားနည်းနဲ့ မလုပ်ဆောင်နိုင်တဲ့ အရာတွေကို ပြီးမြောက်အောင် လုပ်ပေးနိုင်တဲ့ feature တစ်ခုအဖြစ် ပြောင်းလဲပေးပါတယ်။ `RECURSIVE` ကို သုံးခြင်းအားဖြင့် — `WITH` query တစ်ခုက သူ့ရဲ့ ကိုယ်ပိုင် output ကိုပဲ ရည်ညွှန်းနိုင်ပါတယ်။ အလွန် ရိုးရှင်းတဲ့ ဥပမာတစ်ခုကတော့ — 1 ကနေ 100 အထိ integer တွေကို ပေါင်းတဲ့ ဒီ query ပါ:

```sql
WITH RECURSIVE t(n) AS (
    VALUES (1)
  UNION ALL
    SELECT n+1 FROM t WHERE n < 100
)
SELECT sum(n) FROM t;
```

Recursive `WITH` query တစ်ခုရဲ့ ယေဘုယျ ပုံစံကတော့ — အမြဲတမ်း *non-recursive term* (ကိုယ်တိုင် ပြန်မရည်ညွှန်းတဲ့ အပိုင်း) တစ်ခု၊ ပြီးရင် `UNION` (သို့မဟုတ် `UNION ALL`)၊ ပြီးရင် *recursive term* (ကိုယ်တိုင် ပြန်ရည်ညွှန်းတဲ့ အပိုင်း) တစ်ခု ဖြစ်ပြီး — recursive term ထဲမှာပဲ query ရဲ့ ကိုယ်ပိုင် output ကို ရည်ညွှန်းလို့ရပါတယ်။ အဲဒီလို query တစ်ခုကို အောက်ပါအတိုင်း execute (လုပ်ဆောင်) ပါတယ်:

**Recursive Query Evaluation (recursive query ကို အကဲဖြတ်လုပ်ဆောင်ခြင်း)**

1. Non-recursive term ကို အကဲဖြတ်ပါ။ `UNION` အတွက် (`UNION ALL` မဟုတ်ပဲ) — duplicate (ထပ်နေတဲ့) row တွေကို ဖယ်ရှားပါ။ ကျန်တဲ့ row တွေ အားလုံးကို recursive query ရဲ့ ရလဒ်ထဲမှာ ထည့်ပြီး — temporary working table (ယာယီ လုပ်ဆောင်နေသည့် table) တစ်ခုထဲမှာလည်း ထားပါ။
2. Working table မလွတ်သေးသရွေ့ — အောက်ပါ အဆင့်တွေကို ထပ်ခါထပ်ခါ လုပ်ပါ:

  1. Recursive term ကို အကဲဖြတ်ပါ — recursive ကိုယ်တိုင် ရည်ညွှန်းမှုနေရာမှာ working table ရဲ့ လက်ရှိ ပါဝင်မှုတွေကို အစားထိုး ထည့်ပြီး လုပ်ပါ။ `UNION` အတွက် (`UNION ALL` မဟုတ်ပဲ) — duplicate row တွေနဲ့ အရင်က ရလဒ် row တစ်ခုခုကို ထပ်နေတဲ့ row တွေကို ဖယ်ရှားပါ။ ကျန်တဲ့ row တွေ အားလုံးကို recursive query ရဲ့ ရလဒ်ထဲမှာ ထည့်ပြီး — temporary intermediate table (ယာယီ အလယ်အလတ် table) တစ်ခုထဲမှာလည်း ထားပါ။
  2. Working table ရဲ့ ပါဝင်မှုတွေကို intermediate table ရဲ့ ပါဝင်မှုတွေနဲ့ အစားထိုးပြီး — intermediate table ကို ရှင်းလိုက်ပါ။

> **မှတ်ချက်:** `RECURSIVE` က query တွေကို recursive ပုံစံနဲ့ သတ်မှတ်ခွင့်ပြုပေမယ့် — အတွင်းပိုင်းမှာတော့ အဲဒီလို query တွေကို iterative (ထပ်ခါထပ်ခါ) ပုံစံနဲ့ အကဲဖြတ်ပါတယ်။

အပေါ်က ဥပမာမှာ — working table က အဆင့်တိုင်းမှာ row တစ်ကြောင်းတည်းပဲ ပါဝင်ပြီး — ဆက်တိုက်ဖြစ်တဲ့ အဆင့်တွေမှာ 1 ကနေ 100 အထိ တန်ဖိုးတွေကို ယူပါတယ်။ 100 ခုမြောက် အဆင့်မှာတော့ `WHERE` clause ကြောင့် output ဘာမှ မထွက်တော့ဘဲ — query က ရပ်တန့်သွားပါတယ်။

Recursive query တွေကို ပုံမှန်အားဖြင့် hierarchical (အဆင့်ဆင့် ဖွဲ့စည်းထားသော) သို့မဟုတ် tree-structured (သစ်ပင်ပုံစံ) data တွေကို ကိုင်တွယ်ဖို့ သုံးပါတယ်။ အသုံးဝင်တဲ့ ဥပမာတစ်ခုကတော့ — တိုက်ရိုက် ပါဝင်မှု (immediate inclusions) တွေကိုပဲ ပြတဲ့ table တစ်ခုကို ပေးထားချိန်မှာ — product တစ်ခုရဲ့ တိုက်ရိုက် နဲ့ သွယ်ဝိုက် sub-part (အစိတ်အပိုင်းခွဲ) တွေ အားလုံးကို ရှာဖွေတဲ့ query ပါ:

```sql
WITH RECURSIVE included_parts(sub_part, part, quantity) AS (
    SELECT sub_part, part, quantity FROM parts WHERE part = 'our_product'
  UNION ALL
    SELECT p.sub_part, p.part, p.quantity * pr.quantity
    FROM included_parts pr, parts p
    WHERE p.part = pr.sub_part
)
SELECT sub_part, SUM(quantity) as total_quantity
FROM included_parts
GROUP BY sub_part
```

#### 7.8.2.1. Search Order (ရှာဖွေမှု အစဉ်)

Tree တစ်ခုကို recursive query နဲ့ traverse (ဖြတ်လျှောက်) လုပ်တဲ့အခါ — ရလဒ်တွေကို depth-first (နက်ရှိုင်းရာ အရင်ဦးစားပေး) ဒါမှမဟုတ် breadth-first (အကျယ်အပြန့် အရင်ဦးစားပေး) အစဉ်နဲ့ စီစဉ်ချင်စိတ် ဖြစ်နိုင်ပါတယ်။ ဒါကို — တခြား data column တွေနဲ့အတူ ordering column (စီစဉ်ပေးသည့် column) တစ်ခုကို တွက်ချက်ပြီး — အဲဒါကို နောက်ဆုံးမှာ ရလဒ်တွေ စီရဖို့ သုံးခြင်းအားဖြင့် လုပ်ဆောင်လို့ရပါတယ်။ ဒါက query အကဲဖြတ်မှုက row တွေကို ဘယ်လို အစဉ်နဲ့ လည်ပတ်သွားလဲဆိုတာကို တကယ်တော့ ထိန်းချုပ်ပေးတာ မဟုတ်ပါဘူး — အဲဒါက SQL မှာ အမြဲလိုလို implementation-dependent (ဘယ်လို implement လုပ်ထားလဲပေါ် မူတည်) ပါ။ ဒီနည်းလမ်းက ရလဒ်တွေကို နောက်ပိုင်းမှာ စီရဖို့ အဆင်ပြေတဲ့ နည်းလမ်းတစ်ခုကိုပဲ ပေးတာပါ။

Depth-first order တစ်ခု ဖန်တီးဖို့ — ရလဒ် row တစ်ခုစီအတွက် — အခုအထိ လည်ပတ်ခဲ့ပြီးသား row တွေရဲ့ array တစ်ခုကို တွက်ချက်ပါတယ်။ ဥပမာ — `link` field တစ်ခုကို သုံးပြီး `tree` table တစ်ခုကို ရှာဖွေတဲ့ အောက်ပါ query ကို ကြည့်ပါ:

```sql
WITH RECURSIVE search_tree(id, link, data) AS (
    SELECT t.id, t.link, t.data
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data
    FROM tree t, search_tree st
    WHERE t.id = st.link
)
SELECT * FROM search_tree;
```

Depth-first ordering (နက်ရှိုင်းရာ အရင်ဦးစားပေး စီစဉ်မှု) အချက်အလက်တွေ ထည့်ဖို့ — ဒီလိုမျိုး ရေးနိုင်ပါတယ်:

```sql
WITH RECURSIVE search_tree(id, link, data, path) AS (
    SELECT t.id, t.link, t.data, ARRAY[t.id]
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data, path || t.id
    FROM tree t, search_tree st
    WHERE t.id = st.link
)
SELECT * FROM search_tree ORDER BY path;
```

Row တစ်ခုကို ခွဲခြားဖို့ field တစ်ခုထက်ပိုပြီး သုံးရတဲ့ ယေဘုယျ အခြေအနေမှာတော့ — row တွေရဲ့ array ကို သုံးပါ။ ဥပမာ — `f1` နဲ့ `f2` field တွေကို track (ခြေရာခံ) လုပ်ဖို့ လိုအပ်ရင်:

```sql
WITH RECURSIVE search_tree(id, link, data, path) AS (
    SELECT t.id, t.link, t.data, ARRAY[ROW(t.f1, t.f2)]
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data, path || ROW(t.f1, t.f2)
    FROM tree t, search_tree st
    WHERE t.id = st.link
)
SELECT * FROM search_tree ORDER BY path;
```

> **အကြံပြုချက်:** field တစ်ခုတည်းကိုပဲ track လုပ်ဖို့လိုတဲ့ အများအားဖြင့် ကြုံရတတ်တဲ့ အခြေအနေမျိုးမှာတော့ `ROW()` syntax ကို ချန်လိုက်ပါ။ ဒါက composite-type array အစား ရိုးရိုး array ကို သုံးလို့ရစေပြီး — ထိရောက်မှု (efficiency) ပိုကောင်းစေပါတယ်။

Breadth-first order တစ်ခု ဖန်တီးဖို့ — ရှာဖွေမှုရဲ့ အနက် (depth) ကို track လုပ်တဲ့ column တစ်ခု ပေါင်းထည့်လို့ရပါတယ် — ဥပမာ:

```sql
WITH RECURSIVE search_tree(id, link, data, depth) AS (
    SELECT t.id, t.link, t.data, 0
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data, depth + 1
    FROM tree t, search_tree st
    WHERE t.id = st.link
)
SELECT * FROM search_tree ORDER BY depth;
```

Stable sort (တည်ငြိမ်တဲ့ စီစဉ်မှု) တစ်ခု ရဖို့ — data column တွေကို secondary sorting column (ဒုတိယအဆင့် စီစဉ်ရေး column) တွေအနေနဲ့ ထပ်ထည့်ပါ။

> **အကြံပြုချက်:** Recursive query evaluation algorithm (recursive query အကဲဖြတ် နည်းလမ်း) က သူ့ရဲ့ output ကို breadth-first search order နဲ့ ထုတ်ပေးပါတယ်။ ဒါပေမယ့် — ဒါက implementation ရဲ့ အသေးစိတ် (implementation detail) တစ်ခု ဖြစ်ပြီး — အဲဒါကို အားကိုးတာက မသင့်လျော်လှပါဘူး။ Level (အဆင့်) တစ်ခုစီအတွင်းက row တွေရဲ့ အစဉ်ကတော့ သေချာပေါက် undefined (သတ်မှတ်ထားခြင်း မရှိ) ဖြစ်လို့ — ဘယ်လိုပဲဖြစ်ဖြစ် ရှင်းလင်းတဲ့ ordering (စီစဉ်မှု) တစ်ခုခုကို လိုချင်နေတတ်ပါတယ်။

Depth- ဒါမှမဟုတ် breadth-first sort column တစ်ခုကို တွက်ချက်ပေးဖို့ built-in syntax (ပါဝင်ပြီးသား syntax) တစ်ခုလည်း ရှိပါတယ် — ဥပမာ:

```sql
WITH RECURSIVE search_tree(id, link, data) AS (
    SELECT t.id, t.link, t.data
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data
    FROM tree t, search_tree st
    WHERE t.id = st.link
) SEARCH DEPTH FIRST BY id SET ordercol
SELECT * FROM search_tree ORDER BY ordercol;

WITH RECURSIVE search_tree(id, link, data) AS (
    SELECT t.id, t.link, t.data
    FROM tree t
  UNION ALL
    SELECT t.id, t.link, t.data
    FROM tree t, search_tree st
    WHERE t.id = st.link
) SEARCH BREADTH FIRST BY id SET ordercol
SELECT * FROM search_tree ORDER BY ordercol;
```

ဒီ syntax ကို အတွင်းပိုင်းမှာ — အပေါ်က လက်နဲ့ရေးထားတဲ့ ပုံစံတွေနဲ့ ဆင်တူတဲ့ ပုံစံအဖြစ် ချဲ့ထွင်ပါတယ်။ `SEARCH` clause က — depth-first လား breadth-first လား ဘယ်လို ရှာချင်လဲဆိုတာ၊ စီစဉ်ဖို့ track လုပ်ရမယ့် column တွေရဲ့ စာရင်း၊ ပြီးတော့ စီစဉ်ဖို့အတွက် သုံးလို့ရတဲ့ ရလဒ် data ပါဝင်မယ့် column name တစ်ခုကို သတ်မှတ်ပါတယ်။ အဲဒီ column ကို CTE ရဲ့ output row တွေထဲကို သွယ်ဝိုက်အားဖြင့် (implicitly) ပေါင်းထည့်သွားမှာ ဖြစ်ပါတယ်။

#### 7.8.2.2. Cycle Detection (cycle ရှာဖွေခြင်း)

Recursive query တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — query ရဲ့ recursive အပိုင်းက နောက်ဆုံးမှာ tuple (row) တစ်ခုမှ ပြန်မပေးတော့ဘူးဆိုတာ သေချာစေဖို့ အရေးကြီးပါတယ် — မဟုတ်ရင် query က အကန့်အသတ်မဲ့ loop (လည်နေခြင်း) ဖြစ်နေမှာမို့ပါ။ တခါတရံမှာ `UNION ALL` အစား `UNION` ကို သုံးတာက — အရင် output row တွေကို ထပ်နေတဲ့ row တွေကို ဖယ်ရှားခြင်းအားဖြင့် — ဒီကိစ္စကို ဖြေရှင်းပေးနိုင်ပါတယ်။ ဒါပေမယ့် — မကြာခဏဆိုသလို cycle (လည်ပတ်သံသရာ) တစ်ခုက လုံးလုံး duplicate ဖြစ်နေတဲ့ output row တွေနဲ့ မသက်ဆိုင်ပါဘူး — တူညီတဲ့ နေရာကို အရင်က ရောက်ခဲ့လားဆိုတာ သိဖို့ field တစ်ခု ဒါမှမဟုတ် အနည်းငယ်ကိုပဲ စစ်ဆေးဖို့ လိုအပ်တာ ဖြစ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေတွေကို ကိုင်တွယ်ဖို့ စံနည်းလမ်း (standard method) ကတော့ — သွားရောက်ပြီးသား တန်ဖိုးတွေရဲ့ array တစ်ခုကို တွက်ချက်ခြင်းပဲ ဖြစ်ပါတယ်။ ဥပမာ — `link` field တစ်ခုကို သုံးပြီး `graph` table တစ်ခုကို ရှာဖွေတဲ့ အောက်ပါ query ကို နောက်တစ်ခါ ကြည့်ပါ:

```sql
WITH RECURSIVE search_graph(id, link, data, depth) AS (
    SELECT g.id, g.link, g.data, 0
    FROM graph g
  UNION ALL
    SELECT g.id, g.link, g.data, sg.depth + 1
    FROM graph g, search_graph sg
    WHERE g.id = sg.link
)
SELECT * FROM search_graph;
```

`link` ရဲ့ ဆက်သွယ်မှု (relationship) တွေထဲမှာ cycle တွေ ပါနေရင် — ဒီ query က loop ဖြစ်မှာ ဖြစ်ပါတယ်။ "depth" output တစ်ခု လိုအပ်နေလို့ — `UNION ALL` ကို `UNION` အဖြစ်ပဲ ပြောင်းလိုက်ရုံနဲ့တော့ loop ကို မဖယ်ရှားနိုင်ပါဘူး။ အဲဒီအစား — link တွေရဲ့ လမ်းကြောင်း (path) တစ်ခုအတိုင်း လိုက်နေစဉ်မှာ — တူညီတဲ့ row ကို နောက်တစ်ခါ ရောက်ခဲ့လားဆိုတာကို မှတ်မိဖို့ လိုပါတယ်။ Loop ဖြစ်နိုင်ခြေရှိတဲ့ query ထဲကို `is_cycle` နဲ့ `path` column နှစ်ခု ထပ်ထည့်ပါတယ်:

```sql
WITH RECURSIVE search_graph(id, link, data, depth, is_cycle, path) AS (
    SELECT g.id, g.link, g.data, 0,
      false,
      ARRAY[g.id]
    FROM graph g
  UNION ALL
    SELECT g.id, g.link, g.data, sg.depth + 1,
      g.id = ANY(path),
      path || g.id
    FROM graph g, search_graph sg
    WHERE g.id = sg.link AND NOT is_cycle
)
SELECT * FROM search_graph;
```

Cycle တွေကို ကာကွယ်ပေးတာအပြင် — ဒီ array တန်ဖိုးက — ဘယ် row တစ်ခုကိုမဆို ရောက်ရှိဖို့ လျှောက်ခဲ့တဲ့ "path" (လမ်းကြောင်း) ကို ကိုယ်စားပြုတဲ့အနေနဲ့ — သူ့ဘာသာသူ အနေနဲ့လည်း မကြာခဏ အသုံးဝင်ပါတယ်။

Cycle တစ်ခုကို မှတ်မိဖို့ field တစ်ခုထက်ပိုပြီး စစ်ဆေးဖို့လိုတဲ့ ယေဘုယျ အခြေအနေမှာတော့ — row တွေရဲ့ array ကို သုံးပါ။ ဥပမာ — `f1` နဲ့ `f2` field တွေကို နှိုင်းယှဉ်ဖို့ လိုအပ်ရင်:

```sql
WITH RECURSIVE search_graph(id, link, data, depth, is_cycle, path) AS (
    SELECT g.id, g.link, g.data, 0,
      false,
      ARRAY[ROW(g.f1, g.f2)]
    FROM graph g
  UNION ALL
    SELECT g.id, g.link, g.data, sg.depth + 1,
      ROW(g.f1, g.f2) = ANY(path),
      path || ROW(g.f1, g.f2)
    FROM graph g, search_graph sg
    WHERE g.id = sg.link AND NOT is_cycle
)
SELECT * FROM search_graph;
```

> **အကြံပြုချက်:** Cycle တစ်ခုကို မှတ်မိဖို့ field တစ်ခုတည်းကိုပဲ စစ်ဆေးဖို့လိုတဲ့ အများအားဖြင့် ကြုံရတတ်တဲ့ အခြေအနေမျိုးမှာတော့ `ROW()` syntax ကို ချန်လိုက်ပါ။ ဒါက composite-type array အစား ရိုးရိုး array ကို သုံးလို့ရစေပြီး — ထိရောက်မှု ပိုကောင်းစေပါတယ်။

Cycle detection ကို ရိုးရှင်းစေဖို့ built-in syntax တစ်ခုလည်း ရှိပါတယ်။ အပေါ်က query ကို ဒီလိုမျိုးလည်း ရေးလို့ရပါတယ်:

```sql
WITH RECURSIVE search_graph(id, link, data, depth) AS (
    SELECT g.id, g.link, g.data, 1
    FROM graph g
  UNION ALL
    SELECT g.id, g.link, g.data, sg.depth + 1
    FROM graph g, search_graph sg
    WHERE g.id = sg.link
) CYCLE id SET is_cycle USING path
SELECT * FROM search_graph;
```

ပြီးတော့ ဒါကို အတွင်းပိုင်းမှာ အပေါ်က ပုံစံအဖြစ် ပြန်လည် ရေးလုပ်ပေးမှာ ဖြစ်ပါတယ်။ `CYCLE` clause က — ပထမဆုံး cycle detection အတွက် track လုပ်ရမယ့် column တွေရဲ့ စာရင်း၊ ပြီးရင် cycle တစ်ခု detect (တွေ့ရှိ) ခဲ့လားဆိုတာကို ပြမယ့် column name တစ်ခု၊ နောက်ဆုံးမှာတော့ path ကို track လုပ်မယ့် နောက်ထပ် column တစ်ခုရဲ့ နာမည်ကို သတ်မှတ်ပါတယ်။ Cycle နဲ့ path column တွေကို CTE ရဲ့ output row တွေထဲကို သွယ်ဝိုက်အားဖြင့် ပေါင်းထည့်သွားမှာ ဖြစ်ပါတယ်။

> **အကြံပြုချက်:** Cycle path column ကို — အရင်က section မှာ ပြထားတဲ့ depth-first ordering column နဲ့ အတူတူ နည်းလမ်းနဲ့ပဲ တွက်ချက်ပါတယ်။ Query တစ်ခုမှာ `SEARCH` နဲ့ `CYCLE` clause နှစ်ခုလုံး ပါဝင်လို့ရပါတယ် — ဒါပေမယ့် — depth-first search specification ရော cycle detection specification ရော နှစ်ခုလုံး ပါနေရင် — ထပ်နေတဲ့ (redundant) တွက်ချက်မှုတွေ ဖြစ်စေလို့ — `CYCLE` clause တစ်ခုတည်းကို သုံးပြီး path column နဲ့ စီလိုက်တာက ပိုပြီး ထိရောက်ပါတယ်။ Breadth-first ordering လိုချင်ရင်တော့ — `SEARCH` ရော `CYCLE` ရော နှစ်ခုလုံးကို သတ်မှတ်တာ အသုံးဝင်နိုင်ပါတယ်။

Query တွေ loop ဖြစ်နိုင်လားဆိုတာ မသေချာတဲ့အခါ — စမ်းသပ်ဖို့ အသုံးဝင်တဲ့ နည်းလမ်းတစ်ခုကတော့ parent query ထဲမှာ `LIMIT` တစ်ခု ထည့်ထားဖို့ပါ။ ဥပမာ — ဒီ query က `LIMIT` မပါရင် အကန့်အသတ်မဲ့ loop ဖြစ်နေမှာပါ:

```sql
WITH RECURSIVE t(n) AS (
    SELECT 1
  UNION ALL
    SELECT n+1 FROM t
)
SELECT n FROM t LIMIT 100;
```

ဒါက အလုပ်ဖြစ်တာက — PostgreSQL ရဲ့ implementation က `WITH` query တစ်ခုရဲ့ row တွေကို — parent query က တကယ်ရယူ (fetch) တဲ့ အရေအတွက်လောက်ကိုပဲ အကဲဖြတ်လို့ပါ။ Production (လက်တွေ့ လုပ်ငန်းသုံး) မှာတော့ ဒီနည်းလမ်းကို သုံးဖို့ အကြံပြုမထားပါဘူး — တခြား system တွေက မတူညီတဲ့ နည်းနဲ့ အလုပ်လုပ်နိုင်လို့ပါ။ ဒါ့အပြင် — outer query က recursive query ရဲ့ ရလဒ်တွေကို စီတာပဲဖြစ်ဖြစ်၊ တခြား table တစ်ခုနဲ့ join လုပ်တာပဲဖြစ်ဖြစ် လုပ်မယ်ဆိုရင်လည်း — ဒီနည်းက များသောအားဖြင့် အလုပ်မဖြစ်ပါဘူး — အကြောင်းကတော့ အဲဒီလို အခြေအနေမျိုးမှာ outer query က `WITH` query ရဲ့ output အားလုံးကို ပဲဖြစ်ဖြစ် ရယူဖို့ ကြိုးစားမှာ ဖြစ်လို့ပါ။

### 7.8.3. Common Table Expression Materialization (CTE ကို materialize လုပ်ခြင်း)

`WITH` query တွေရဲ့ အသုံးဝင်တဲ့ ဂုဏ်သတ္တိတစ်ခုကတော့ — parent query က သူတို့ကို တစ်ကြိမ်ထက်ပိုပြီး ရည်ညွှန်းတာပဲဖြစ်ဖြစ်၊ sibling `WITH` query တွေက ရည်ညွှန်းတာပဲဖြစ်ဖြစ် — ပုံမှန်အားဖြင့် parent query တစ်ကြိမ် execute လုပ်တိုင်းကို တစ်ခါပဲ အကဲဖြတ်ခံရတာပါ။ ဒါကြောင့် — နေရာများစွာမှာ လိုအပ်တဲ့ စရိတ်ကြီးတဲ့ (expensive) တွက်ချက်မှုတွေကို — ထပ်နေတဲ့ အလုပ်တွေ ရှောင်ရှားနိုင်ဖို့ — `WITH` query တစ်ခုထဲမှာ ထည့်ထားလို့ရပါတယ်။ နောက်ထပ် ဖြစ်နိုင်ခြေတစ်ခုကတော့ — side effect (ဘေးထွက် သက်ရောက်မှု) ရှိတဲ့ function တွေကို မလိုအပ်ဘဲ အကြိမ်များစွာ အကဲဖြတ်မိတာတွေကို တားဆီးဖို့ပါ။ ဒါပေမယ့် — ဒီဒင်္ဂါးရဲ့ အခြားတစ်ဖက်ကတော့ — optimizer က parent query ကနေ multiply-referenced (အကြိမ်များစွာ ရည်ညွှန်းခံရတဲ့) `WITH` query တစ်ခုဆီကို restriction (ကန့်သတ်ချက်) တွေ အောက်ကို ဖိချ (push down) လုပ်လို့ မရတာပါ — အကြောင်းကတော့ အဲဒါက `WITH` query ရဲ့ output ကို သုံးတဲ့ နေရာ အားလုံးကို သက်ရောက်စေနိုင်ပြီး — တကယ်တမ်း နေရာတစ်ခုတည်းကိုပဲ သက်ရောက်သင့်တာမို့ပါ။ Multiply-referenced `WITH` query ကို — parent query က နောက်ပိုင်းမှာ စွန့်ပစ်လိုက်နိုင်တဲ့ row တွေကိုပါ မဖယ်ရှားဘဲ — ရေးထားတဲ့အတိုင်းအတိုင်း အကဲဖြတ်ခံရမှာ ဖြစ်ပါတယ်။ (ဒါပေမယ့် — အပေါ်မှာ ဖော်ပြခဲ့သလို — query ဆီက ရည်ညွှန်းမှု (reference) တွေက row အရေအတွက် အကန့်အသတ်တစ်ခုကိုပဲ တောင်းဆိုရင်တော့ — အကဲဖြတ်မှုက စောစီးစွာ ရပ်တန့်သွားနိုင်ပါတယ်။)

ဒါပေမယ့် — `WITH` query တစ်ခုက non-recursive ဖြစ်ပြီး — side-effect-free (ဘေးထွက် သက်ရောက်မှု ကင်းစင်) ဖြစ်နေရင် (ဆိုလိုတာက — volatile function (အချိန်အလိုက် ပြောင်းလဲနေတဲ့ function) တွေ မပါဝင်တဲ့ `SELECT` တစ်ခု ဖြစ်ရင်) — အဲဒါကို parent query ထဲကို fold (ပေါင်းစပ်သွင်း) လုပ်လိုက်ပြီး — query အလွှာ နှစ်ခုလုံးကို အတူတကွ optimize (အကောင်းဆုံးဖြစ်အောင် ပြုပြင်) လုပ်လို့ရပါတယ်။ ပုံမှန်အားဖြင့် — parent query က `WITH` query ကို တစ်ခါပဲ ရည်ညွှန်းရင် ဒီလို ဖြစ်ပေမယ့် — တစ်ခါထက်ပိုပြီး ရည်ညွှန်းရင်တော့ မဖြစ်ပါဘူး။ အဲဒီ ဆုံးဖြတ်ချက်ကို — `MATERIALIZED` ကို သတ်မှတ်ပြီး `WITH` query ကို သီးခြား တွက်ချက်ဖို့ အတင်းအကျပ် လုပ်နိုင်သလို — `NOT MATERIALIZED` ကို သတ်မှတ်ပြီး parent query ထဲကို ပေါင်းစပ်ဖို့ အတင်းအကျပ် လုပ်လည်း ရပါတယ်။ နောက်ဆုံး ရွေးစရာက `WITH` query ကို ထပ်ခါ ထပ်ခါ တွက်ချက်မိနိုင်တဲ့ အန္တရာယ် ရှိပေမယ့် — `WITH` query ရဲ့ သုံးတဲ့ နေရာတစ်ခုစီက `WITH` query ရဲ့ output အပြည့်အစုံထဲက သေးငယ်တဲ့ အပိုင်းလေးကိုပဲ လိုအပ်တယ်ဆိုရင် — အသားတင် ချွေတာမှု (net savings) ရနိုင်ပါသေးတယ်။

ဒီ စည်းမျဉ်းတွေရဲ့ ရိုးရှင်းတဲ့ ဥပမာတစ်ခုကတော့

```sql
WITH w AS (
    SELECT * FROM big_table
)
SELECT * FROM w WHERE key = 123;
```

ဒီ `WITH` query ကို fold လုပ်လိုက်မှာ ဖြစ်ပြီး — အောက်ပါအတိုင်း execution plan (လုပ်ဆောင်မှု အစီအစဉ်) အတူတူကို ထုတ်ပေးမှာပါ:

```sql
SELECT * FROM big_table WHERE key = 123;
```

အထူးသဖြင့် — `key` ပေါ်မှာ index တစ်ခု ရှိနေရင် — `key = 123` ရှိတဲ့ row တွေကိုပဲ ရယူဖို့ အဲဒီ index ကို သုံးဖွယ် ရှိပါတယ်။ အခြားတစ်ဖက်မှာ —

```sql
WITH w AS (
    SELECT * FROM big_table
)
SELECT * FROM w AS w1 JOIN w AS w2 ON w1.key = w2.ref
WHERE w2.key = 123;
```

— ဒီနေရာမှာတော့ `WITH` query ကို materialize (ပကတိ ရလဒ်အဖြစ် သိမ်းဆည်း) လုပ်လိုက်ပြီး — `big_table` ရဲ့ temporary copy တစ်ခု ဖန်တီးကာ — အဲဒါကို သူ့ဘာသာသူနဲ့ပဲ join လုပ်မှာ ဖြစ်ပါတယ် — index ဘယ်တစ်ခုရဲ့ အကျိုးခံစားခွင့်မှ မရှိပါဘူး။ ဒီ query ကို အောက်ပါအတိုင်း ရေးလိုက်ရင် ပိုပြီး ထိရောက်စွာ execute လုပ်နိုင်မှာ ဖြစ်ပါတယ်:

```sql
WITH w AS NOT MATERIALIZED (
    SELECT * FROM big_table
)
SELECT * FROM w AS w1 JOIN w AS w2 ON w1.key = w2.ref
WHERE w2.key = 123;
```

— ဒါဆိုရင် parent query ရဲ့ restriction တွေကို `big_table` ပေါ်က scan (ရှာဖွေဖတ်ခြင်း) တွေဆီ တိုက်ရိုက် သက်ရောက်စေလို့ပါ။

`NOT MATERIALIZED` က မလိုလားအပ်တဲ့ ဥပမာတစ်ခုကတော့

```sql
WITH w AS (
    SELECT key, very_expensive_function(val) as f FROM some_table
)
SELECT * FROM w AS w1 JOIN w AS w2 ON w1.f = w2.f;
```

ဒီနေရာမှာ — `WITH` query ကို materialize လုပ်ခြင်းက `very_expensive_function` ကို — table row တစ်ခုချင်းစီအတွက် နှစ်ခါ မဟုတ်ဘဲ — တစ်ခါတည်းနဲ့ပဲ အကဲဖြတ်တာ သေချာစေပါတယ်။

အပေါ်က ဥပမာတွေက `WITH` ကို `SELECT` နဲ့ပဲ သုံးပြထားပေမယ့် — `INSERT`, `UPDATE`, `DELETE` ဒါမှမဟုတ် `MERGE` တွေဆီမှာလည်း အလားတူ နည်းနဲ့ တွဲလို့ရပါတယ်။ အခြေအနေတိုင်းမှာ — main command ထဲမှာ ရည်ညွှန်းလို့ရတဲ့ temporary table (များ) ကို ထိရောက်စွာ ထောက်ပံ့ပေးပါတယ်။

### 7.8.4. Data-Modifying Statements in WITH (WITH ထဲမှာ data ပြုပြင်သည့် statement များ)

`WITH` ထဲမှာ data-modifying statement (`INSERT`, `UPDATE`, `DELETE` ဒါမှမဟုတ် `MERGE`) တွေကို သုံးလို့ရပါတယ်။ ဒါက query တစ်ခုတည်းအတွင်းမှာ operation အမျိုးမျိုးကို လုပ်ဆောင်နိုင်စေပါတယ်။ ဥပမာတစ်ခုကတော့:

```sql
WITH moved_rows AS (
    DELETE FROM products
    WHERE
        "date" >= '2010-10-01' AND
        "date" < '2010-11-01'
    RETURNING *
)
INSERT INTO products_log
SELECT * FROM moved_rows;
```

ဒီ query က `products` ကနေ `products_log` ဆီ row တွေကို ထိရောက်စွာ ရွှေ့ပြောင်းပေးပါတယ်။ `WITH` ထဲက `DELETE` က `products` ကနေ သတ်မှတ်ထားတဲ့ row တွေကို ဖျက်ပြီး — သူ့ရဲ့ `RETURNING` clause ကတစ်ဆင့် အဲဒီ row တွေရဲ့ ပါဝင်မှုတွေကို ပြန်ပေးပါတယ်; ပြီးတော့ primary query က အဲဒီ output ကို ဖတ်ပြီး `products_log` ထဲကို ထည့်သွင်းပါတယ်။

အပေါ်က ဥပမာရဲ့ သိမ်မွေ့တဲ့ အချက်တစ်ခုကတော့ — `WITH` clause ကို `INSERT` ဆီမှာ တွဲထားတာပါ — `INSERT` ထဲက sub-`SELECT` ဆီ မဟုတ်ပါဘူး။ ဒါ လိုအပ်တာက — data-modifying statement တွေကို top-level statement (ထိပ်ဆုံးအဆင့် statement) ဆီ တွဲထားတဲ့ `WITH` clause တွေထဲမှာပဲ ခွင့်ပြုလို့ပါ။ ဒါပေမယ့် — သာမန် `WITH` visibility (မြင်နိုင်မှု) စည်းမျဉ်းတွေ သက်ရောက်နေတုန်းပဲ ဖြစ်လို့ — `WITH` statement ရဲ့ output ကို sub-`SELECT` ကနေ ရည်ညွှန်းလို့ရပါတယ်။

`WITH` ထဲက data-modifying statement တွေမှာ များသောအားဖြင့် `RETURNING` clause တွေ ပါတတ်ပါတယ် ([အပိုင်း 6.4](/docs/postgresql/dml-returning) ကို ကြည့်ပါ) — အပေါ်က ဥပမာမှာ ပြထားသလိုပါ။ Query ရဲ့ ကျန်အပိုင်းတွေက ရည်ညွှန်းလို့ရတဲ့ temporary table ကို ဖွဲ့စည်းပေးတာက — data-modifying statement ရဲ့ target table မဟုတ်ဘဲ — `RETURNING` clause ရဲ့ output ပဲ ဖြစ်ပါတယ်။ `WITH` ထဲက data-modifying statement တစ်ခုမှာ `RETURNING` clause မပါဘူးဆိုရင် — temporary table ကို ဘာမှ ဖွဲ့စည်းပေးမှာ မဟုတ်ဘဲ — query ရဲ့ ကျန်အပိုင်းတွေထဲမှာ ရည်ညွှန်းလို့လည်း မရပါဘူး။ အဲဒီလို statement ကို ဘာပဲဖြစ်ဖြစ် execute လုပ်သွားမှာ ဖြစ်ပါတယ်။ သိပ်အသုံးမဝင်တဲ့ ဥပမာတစ်ခုကတော့:

```sql
WITH t AS (
    DELETE FROM foo
)
DELETE FROM bar;
```

ဒီဥပမာက `foo` နဲ့ `bar` table နှစ်ခုလုံးကနေ row တွေ အားလုံးကို ဖယ်ရှားပစ်မှာ ဖြစ်ပါတယ်။ Client ဆီ သတင်းပို့တဲ့ သက်ရောက်ခံရတဲ့ row အရေအတွက်ထဲမှာတော့ — `bar` ကနေ ဖယ်ရှားလိုက်တဲ့ row တွေပဲ ပါမှာ ဖြစ်ပါတယ်။

Data-modifying statement တွေထဲမှာ recursive ကိုယ်တိုင် ရည်ညွှန်းမှု (recursive self-reference) တွေကို ခွင့်မပြုပါဘူး။ အခြေအနေတချို့မှာတော့ — recursive `WITH` တစ်ခုရဲ့ output ကို ရည်ညွှန်းခြင်းအားဖြင့် ဒီကန့်သတ်ချက်ကို ကျော်လွှားဖို့ ဖြစ်နိုင်ပါတယ် — ဥပမာ:

```sql
WITH RECURSIVE included_parts(sub_part, part) AS (
    SELECT sub_part, part FROM parts WHERE part = 'our_product'
  UNION ALL
    SELECT p.sub_part, p.part
    FROM included_parts pr, parts p
    WHERE p.part = pr.sub_part
)
DELETE FROM parts
  WHERE part IN (SELECT part FROM included_parts);
```

ဒီ query က product တစ်ခုရဲ့ တိုက်ရိုက် နဲ့ သွယ်ဝိုက် sub-part တွေ အားလုံးကို ဖယ်ရှားပေးမှာ ဖြစ်ပါတယ်။

`WITH` ထဲက data-modifying statement တွေကို — primary query က သူတို့ရဲ့ output တွေကို အားလုံး (ဒါမှမဟုတ် တစ်စိတ်တစ်ပိုင်းတောင်) ဖတ်လား၊ လုံးဝ မဖတ်ဘူးလားဆိုတာ နဲ့ မသက်ဆိုင်ဘဲ — အတိအကျ တစ်ကြိမ်တည်း — အမြဲတမ်း ပြီးဆုံးသည်အထိ execute လုပ်ပါတယ်။ ဒါက `WITH` ထဲက `SELECT` အတွက် စည်းမျဉ်းနဲ့ ကွဲပြားတယ်ဆိုတာ သတိပြုပါ — အရင်က section မှာ ဖော်ပြခဲ့သလို — `SELECT` တစ်ခုရဲ့ execute လုပ်မှုကို — primary query က သူ့ရဲ့ output ကို တောင်းဆိုသလောက်အထိပဲ ဆောင်ရွက်တာ ဖြစ်ပါတယ်။

`WITH` ထဲက sub-statement တွေကို — တစ်ခုနဲ့တစ်ခု တစ်ပြိုင်နက် (concurrently) ဖြစ်သလို — main query နဲ့လည်း တစ်ပြိုင်နက် execute လုပ်ပါတယ်။ ဒါကြောင့် — `WITH` ထဲမှာ data-modifying statement တွေ သုံးတဲ့အခါ — သတ်မှတ်ထားတဲ့ update တွေ တကယ် ဖြစ်ပေါ်တဲ့ အစဉ်က ကြိုတင် ခန့်မှန်းလို့ မရပါဘူး။ Statement တွေ အားလုံးကို တူညီတဲ့ *snapshot* (ရုပ်ပုံ) တစ်ခုနဲ့ execute လုပ်တာ ဖြစ်လို့ ([အခန်း 13](https://www.postgresql.org/docs/current/mvcc.html) ကို ကြည့်ပါ) — သူတို့က target table တွေပေါ်က တစ်ယောက်ရဲ့တစ်ယောက် သက်ရောက်မှုတွေကို "မြင်နိုင်" မှာ မဟုတ်ပါဘူး။ ဒါက row update တွေရဲ့ တကယ့် အစဉ် မသေချာမှုရဲ့ သက်ရောက်မှုတွေကို သက်သာစေပြီး — `WITH` sub-statement တွေကြားနဲ့ main query အကြား အပြောင်းအလဲတွေကို ဆက်သွယ်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက `RETURNING` data ပဲ ဆိုတာကို ဆိုလိုပါတယ်။ ဒီအတွက် ဥပမာတစ်ခုကတော့ —

```sql
WITH t AS (
    UPDATE products SET price = price * 1.05
    RETURNING *
)
SELECT * FROM products;
```

— ဒီနေရာမှာ outer `SELECT` က `UPDATE` ရဲ့ လုပ်ဆောင်မှု မတိုင်ခင် မူလ ဈေးနှုန်း (original prices) တွေကို ပြန်ပေးမှာ ဖြစ်ပြီး —

```sql
WITH t AS (
    UPDATE products SET price = price * 1.05
    RETURNING *
)
SELECT * FROM t;
```

— ဒီနေရာမှာတော့ outer `SELECT` က update လုပ်ပြီးသား data တွေကို ပြန်ပေးမှာ ဖြစ်ပါတယ်။

Statement တစ်ခုတည်း အတွင်းမှာ row တစ်ခုတည်းကို နှစ်ကြိမ် update လုပ်ဖို့ ကြိုးစားတာကို မထောက်ခံပါဘူး။ ပြုပြင်မှု (modification) တစ်ခုပဲ ဖြစ်ပေါ်မှာ ဖြစ်ပေမယ့် — ဘယ်ဟာ ဖြစ်မယ်ဆိုတာကို ယုံကြည်စိတ်ချစွာ ကြိုတင် ခန့်မှန်းဖို့က မလွယ်ကူပါဘူး (တခါတရံ မဖြစ်နိုင်လည်း ရှိပါတယ်)။ ဒါက — statement တစ်ခုတည်း အတွင်းမှာ update လုပ်ပြီးသား row တစ်ခုကို delete လုပ်တာကိုလည်း သက်ရောက်ပါတယ်: အဲဒီအခါ update ကိုပဲ လုပ်ဆောင်မှာ ဖြစ်ပါတယ်။ ဒါကြောင့် — statement တစ်ခုတည်း အတွင်းမှာ row တစ်ခုတည်းကို နှစ်ကြိမ် ပြုပြင်ဖို့ ကြိုးစားတာကို ယေဘုယျအားဖြင့် ရှောင်ကြဉ်သင့်ပါတယ်။ အထူးသဖြင့် — main statement ဒါမှမဟုတ် sibling sub-statement တစ်ခုက ပြောင်းလဲနိုင်တဲ့ row တွေကိုပဲ သက်ရောက်နိုင်မယ့် `WITH` sub-statement တွေကို ရေးတာကို ရှောင်ပါ။ အဲဒီလို statement တစ်ခုရဲ့ သက်ရောက်မှုတွေက ကြိုတင် ခန့်မှန်းလို့ ရမှာ မဟုတ်ပါဘူး။

လက်ရှိအချိန်မှာ — `WITH` ထဲက data-modifying statement တစ်ခုရဲ့ target အဖြစ် သုံးတဲ့ table မှာ — conditional rule (အခြေအနေပေါ် မူတည်တဲ့ rule)၊ `ALSO` rule ဒါမှမဟုတ် statement အများကြီးအဖြစ် ချဲ့ထွင်ပေးတဲ့ `INSTEAD` rule တွေ မရှိရပါဘူး။
