---
title: "VALUES (rows အစုတစ်ခု တွက်ချက်ခြင်း)"
description: "Value expressions များဖြင့် row value သို့မဟုတ် row values အစုတစ်ခုကို တွက်ချက်ပေးသော command — ORDER BY, LIMIT, OFFSET, FETCH clauses အသေးစိတ်နှင့် INSERT, FROM clause စသည့် context များတွင် VALUES သုံးစွဲပုံ ဥပမာများ"
order: 218
source: "https://www.postgresql.org/docs/current/sql-values.html"
status: translated
updated: 2026-09-04
---

## VALUES (rows အစုတစ်ခု တွက်ချက်ခြင်း)

VALUES — rows အစုတစ်ခုကို တွက်ချက်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
VALUES ( expression [, ...] ) [, ...]
    [ ORDER BY sort_expression [ ASC | DESC | USING operator ] [, ...] ]
    [ LIMIT { count | ALL } ]
    [ OFFSET start [ ROW | ROWS ] ]
    [ FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } ONLY ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`VALUES` က — value expressions တွေနဲ့ သတ်မှတ်ထားတဲ့ row value တစ်ခု ဒါမှမဟုတ် row values အစုတစ်ခုကို တွက်ချက်ပေးပါတယ်။ ပိုကြီးတဲ့ command တစ်ခုအတွင်းမှာ “constant table” (စဉ်ဆက်မပြတ် တန်ဖိုးရှိတဲ့ table) တစ်ခု ထုတ်လုပ်ဖို့ အသုံးအများဆုံး ဖြစ်ပေမယ့် — သူ့ဘာသာသူ သီးခြားလည်း သုံးလို့ ရပါတယ်။

Rows တစ်ခုထက်ပို သတ်မှတ်ထားရင် — rows တွေ အားလုံးမှာ element အရေအတွက် အတူတူ ရှိရပါမယ်။ ရလဒ် table ရဲ့ columns တွေရဲ့ data types တွေကို — အဲဒီ column ထဲမှာ ပေါ်နေတဲ့ expressions တွေရဲ့ explicit ဒါမှမဟုတ် inferred (ကောက်ချက်ချ သတ်မှတ်ထား) types တွေကို — `UNION` အတွက် သုံးတဲ့ စည်းမျဉ်းတွေနဲ့ပဲ — ပေါင်းစပ်ပြီး ဆုံးဖြတ်ပါတယ် ([အပိုင်း 10.5](/docs/postgresql/typeconv-union-case) ကို ကြည့်ပါ)။

ပိုကြီးတဲ့ commands တွေအတွင်းမှာ — `SELECT` သုံးလို့ရတဲ့ နေရာ ဘယ်နေရာမှာမဆို — `VALUES` ကို syntax အရ ခွင့်ပြုပါတယ်။ Grammar အရ `SELECT` တစ်ခုလိုပဲ သဘောထားခံရတာမို့ — `VALUES` command တစ်ခုနဲ့ `ORDER BY`၊ `LIMIT` (ဒါမှမဟုတ် ညီမျှတဲ့ `FETCH FIRST`) နဲ့ `OFFSET` clauses တွေကို သုံးလို့ ရပါတယ်။

## Parameters (parameter များ)

- **expression** — ရလဒ် table (rows အစု) ထဲက ညွှန်ပြထားတဲ့ နေရာမှာ တွက်ချက် ထည့်သွင်းဖို့ constant တစ်ခု ဒါမှမဟုတ် expression တစ်ခု။ `INSERT` တစ်ခုရဲ့ အပေါ်ဆုံး အဆင့်မှာ ပေါ်နေတဲ့ VALUES list တစ်ခုထဲမှာ — expression တစ်ခုကို — destination column ရဲ့ default တန်ဖိုးကို ထည့်သွင်းသင့်တယ်လို့ ညွှန်ပြဖို့ — `DEFAULT` နဲ့ အစားထိုးလို့ ရပါတယ်။ `VALUES` က တခြား context တွေမှာ ပေါ်နေရင်တော့ `DEFAULT` ကို သုံးလို့ မရပါဘူး။
- **sort_expression** — ရလဒ် rows တွေကို ဘယ်လို sort (စီစဉ်) လုပ်ရမလဲ ညွှန်ပြတဲ့ expression တစ်ခု ဒါမှမဟုတ် integer constant တစ်ခု။ ဒီ expression က — `VALUES` ရလဒ်ရဲ့ columns တွေကို column1, column2 စသဖြင့်အနေနဲ့ ရည်ညွှန်းနိုင်ပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် SELECT documentation ထဲက ORDER BY Clause ကို ကြည့်ပါ။
- **operator** — Sorting operator တစ်ခု။ အသေးစိတ်အတွက် SELECT documentation ထဲက ORDER BY Clause ကို ကြည့်ပါ။
- **count** — ပြန်ပေးမယ့် rows အများဆုံး အရေအတွက်။ အသေးစိတ်အတွက် SELECT documentation ထဲက LIMIT Clause ကို ကြည့်ပါ။
- **start** — Rows တွေ ပြန်စ ထုတ်ပေးတာမတိုင်ခင် ကျော်လိုက်ရမယ့် rows အရေအတွက်။ အသေးစိတ်အတွက် SELECT documentation ထဲက LIMIT Clause ကို ကြည့်ပါ။

## Notes (မှတ်စုများ)

Rows အရေအတွက် အလွန် များတဲ့ `VALUES` lists တွေကို ရှောင်သင့်ပါတယ် — out-of-memory (memory လုံလောက်မှု မရှိခြင်း) failures တွေ ဒါမှမဟုတ် performance ညံ့ဖျင်းမှုတွေ ကြုံရနိုင်လို့ပါ။ `INSERT` အတွင်းမှာ ပေါ်နေတဲ့ `VALUES` က အထူး ကိစ္စတစ်ခု ဖြစ်ပါတယ် (လိုချင်တဲ့ column types တွေကို `INSERT` ရဲ့ target table ကနေ သိပြီးသား ဖြစ်လို့ — `VALUES` list ကို scan လုပ်ပြီး ကောက်ချက်ချစရာ မလိုလို့ပါ) — ဒါကြောင့် — တခြား context တွေမှာ လက်တွေ့ ကျင့်သုံးလို့ရတာထက် ပိုကြီးတဲ့ lists တွေကို ကိုင်တွယ်နိုင်ပါတယ်။

## Examples (ဥပမာများ)

`VALUES` command တစ်ခု တည်းသက်သက်:

```sql
VALUES (1, 'one'), (2, 'two'), (3, 'three');
```

ဒါက column နှစ်ခုနဲ့ row သုံးခု ပါတဲ့ table တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ၎င်းက အောက်ပါအတိုင်း ရေးထားတာနဲ့ တကယ့်ကို ညီမျှပါတယ်:

```sql
SELECT 1 AS column1, 'one' AS column2
UNION ALL
SELECT 2, 'two'
UNION ALL
SELECT 3, 'three';
```

ပိုပြီး အဖြစ်များတာကတော့ — `VALUES` ကို ပိုကြီးတဲ့ SQL command တစ်ခုရဲ့ အတွင်းမှာ သုံးပါတယ်။ အသုံးအများဆုံးက `INSERT` ထဲမှာပါ:

```sql
INSERT INTO films (code, title, did, date_prod, kind)
    VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');
```

`INSERT` ရဲ့ context ထဲမှာ — VALUES list တစ်ခုရဲ့ entries တွေက — တန်ဖိုးတစ်ခု သတ်မှတ်ပေးမယ့်အစား — ဒီနေရာမှာ column default ကို သုံးသင့်တယ်လို့ ညွှန်ပြဖို့ `DEFAULT` ဖြစ်နိုင်ပါတယ်:

```sql
INSERT INTO films VALUES
    ('UA502', 'Bananas', 105, DEFAULT, 'Comedy', '82 minutes'),
    ('T_601', 'Yojimbo', 106, DEFAULT, 'Drama', DEFAULT);
```

Sub-`SELECT` တစ်ခု ရေးလို့ရမယ့် နေရာမှာလည်း `VALUES` ကို သုံးနိုင်ပါတယ် — ဥပမာ — `FROM` clause တစ်ခုထဲမှာ:

```sql
SELECT f.*
  FROM films f, (VALUES('MGM', 'Horror'), ('UA', 'Sci-Fi')) AS t (studio, kind)
  WHERE f.studio = t.studio AND f.kind = t.kind;

UPDATE employees SET salary = salary * v.increase
  FROM (VALUES(1, 200000, 1.2), (2, 400000, 1.4)) AS v (depno, target, increase)
  WHERE employees.depno = v.depno AND employees.sales >= v.target;
```

`VALUES` ကို `FROM` clause တစ်ခုထဲမှာ သုံးတဲ့အခါ — `SELECT` အတွက် မှန်သလိုပဲ — `AS` clause တစ်ခု လိုအပ်တယ်ဆိုတာ သတိပြုပါ။ `AS` clause က columns တွေ အားလုံးအတွက် နာမည်တွေ သတ်မှတ်ပေးဖို့ မလိုအပ်ပါဘူး — ဒါပေမယ့် အဲဒီလို လုပ်တာက ကောင်းတဲ့ အလေ့အကျင့် (good practice) တစ်ခုပါ။ (`VALUES` အတွက် default column နာမည်တွေက PostgreSQL မှာ column1, column2 စသဖြင့် ဖြစ်ပေမယ့် — တခြား database systems တွေမှာတော့ ဒီနာမည်တွေ ကွဲပြားနိုင်ပါတယ်။)

`VALUES` ကို `INSERT` ထဲမှာ သုံးတဲ့အခါ — values တွေ အားလုံးကို သက်ဆိုင်ရာ destination column ရဲ့ data type ဆီ အလိုအလျောက် coerce (ပြောင်းလဲ) လုပ်ပါတယ်။ တခြား context တွေမှာ သုံးတဲ့အခါ — မှန်ကန်တဲ့ data type ကို သတ်မှတ်ပေးဖို့ လိုအပ်နိုင်ပါတယ်။ Entries တွေ အားလုံး quote လုပ်ထားတဲ့ literal constants တွေ ဖြစ်နေရင် — ပထမဆုံး တစ်ခုကို coerce လုပ်လိုက်တာနဲ့ — ကျန်တာ အားလုံးအတွက် ယူဆရမယ့် type ကို ဆုံးဖြတ်ဖို့ လုံလောက်ပါတယ်:

```sql
SELECT * FROM machines
WHERE ip_address IN (VALUES('192.168.0.1'::inet), ('192.168.0.10'), ('192.168.1.43'));
```

> **အကြံပြုချက်:** ရိုးရှင်းတဲ့ `IN` tests တွေအတွက်တော့ — အထက်မှာ ပြထားသလို `VALUES` query တစ်ခု ရေးမယ့်အစား — `IN` ရဲ့ [list-of-scalars](/docs/postgresql/functions-comparisons) ပုံစံကို အားကိုးတာ ပိုကောင်းပါတယ်။ List of scalars method က ရေးစရာ ပိုနည်းပြီး — မကြာခဏဆိုသလို ပိုပြီး ထိရောက်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`VALUES` က SQL standard နဲ့ ကိုက်ညီပါတယ်။ `LIMIT` နဲ့ `OFFSET` တွေကတော့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်; [SELECT](/docs/postgresql/sql-select) အောက်မှာလည်း ကြည့်ပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[INSERT](/docs/postgresql/sql-insert), [SELECT](/docs/postgresql/sql-select)
