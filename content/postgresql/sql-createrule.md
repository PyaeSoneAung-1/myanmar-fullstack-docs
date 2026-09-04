---
title: "CREATE RULE (rewrite rule အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Table သို့မဟုတ် view တစ်ခုပေါ်တွင် သက်ရောက်မည့် rewrite rule (query ပြန်ရေးသားမှု စည်းမျဉ်း) အသစ်တစ်ခုကို သတ်မှတ်ပေးသော command — CREATE OR REPLACE RULE၊ ON event (SELECT/INSERT/UPDATE/DELETE) TO table_name၊ WHERE condition၊ DO ALSO/INSTEAD (NOTHING / command / commands အစုံ)၊ NEW/OLD အသုံးပြုမှုနှင့် view များပေါ်တွင် rule များ အသုံးချခြင်း အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 320
source: "https://www.postgresql.org/docs/current/sql-createrule.html"
status: translated
updated: 2026-09-04
---

## CREATE RULE (rewrite rule အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE RULE — rewrite rule အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] RULE name AS ON event
    TO table_name [ WHERE condition ]
    DO [ ALSO | INSTEAD ] { NOTHING | command | ( command ; command ... ) }

where event can be one of:

    SELECT | INSERT | UPDATE | DELETE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE RULE` က — သတ်မှတ်ထားတဲ့ table သို့မဟုတ် view တစ်ခုပေါ်မှာ သက်ရောက်မယ့် rule အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ `CREATE OR REPLACE RULE` က — rule အသစ်တစ်ခုကို ဖန်တီးပေးမှာ ဖြစ်သလို — table တစ်ခုတည်းအတွက် — နာမည်တူ ရှိပြီးသား rule တစ်ခုကို အစားထိုးလည်း ပေးနိုင်ပါတယ်။

PostgreSQL ရဲ့ rule system က — database tables တွေထဲကို insertions, updates သို့မဟုတ် deletions (ထည့်သွင်းမှု၊ ပြုပြင်မှု သို့မဟုတ် ဖယ်ရှားမှု) တွေ လုပ်ဆောင်တဲ့အခါ — အစားထိုး လုပ်ဆောင်ချက် (alternative action) တစ်ခုကို သတ်မှတ်နိုင်အောင် ခွင့်ပြုပေးပါတယ်။ အကြမ်းဖျင်း ပြောရရင် — rule တစ်ခုက — သတ်မှတ်ထားတဲ့ table တစ်ခုပေါ်မှာ ပေးထားတဲ့ command တစ်ခု လုပ်ဆောင်တဲ့အခါ — ထပ်ဆောင်း commands တွေကို လုပ်ဆောင်စေပါတယ်။ တနည်းအားဖြင့် — `INSTEAD` rule တစ်ခုက — ပေးထားတဲ့ command တစ်ခုကို နောက်တစ်ခုနဲ့ အစားထိုးနိုင်သလို — command တစ်ခုကို လုံးဝ မလုပ်ဆောင်ဘဲ ဖြစ်စေဖို့လည်း လုပ်နိုင်ပါတယ်။ Rules တွေကို SQL views တွေ implement လုပ်ဖို့လည်း သုံးပါတယ်။ Rule တစ်ခုက တကယ်တော့ — command transformation mechanism (command အသွင်ပြောင်း ယန္တရား) တစ်ခု သို့မဟုတ် command macro တစ်ခု ဖြစ်တယ်ဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်။ Transformation က — command ရဲ့ လုပ်ဆောင်မှု မစတင်ခင် ဖြစ်ပေါ်ပါတယ်။ Physical row (ရုပ်ပိုင်း row) တစ်ခုချင်းစီအတွက် — သီးခြားလွတ်လပ်စွာ လုပ်ဆောင်တဲ့ operation တစ်ခုကို တကယ် လိုချင်တယ်ဆိုရင် — rule အစား trigger တစ်ခုကို သုံးချင်ဖို့ များပါတယ်။ Rule system အကြောင်း နောက်ထပ် အချက်အလက်တွေက [အခန်း 39](https://www.postgresql.org/docs/current/rules.html) မှာ ရှိပါတယ်။

လောလောဆယ်မှာ — `ON SELECT` rules တွေကို views တွေပေါ်မှာပဲ တွဲဆက်လို့ ရပါတယ်။ ဒီလို rule တစ်ခုကို `"_RETURN"` လို့ အမည်ပေးရမှာ ဖြစ်ပြီး — condition မရှိတဲ့ (unconditional) `INSTEAD` rule တစ်ခု ဖြစ်ရမှာ ဖြစ်ကာ — `SELECT` command တစ်ခုတည်း ပါဝင်တဲ့ action တစ်ခု ရှိရပါမယ်။ ဒီ command က view ရဲ့ မြင်နိုင်တဲ့ အကြောင်းအရာတွေ (visible contents) ကို သတ်မှတ်ပေးပါတယ်။ (View ကိုယ်တိုင်ကတော့ — storage မရှိတဲ့ dummy table (အတုအယောင် table) တစ်ခု အခြေခံအားဖြင့် ဖြစ်ပါတယ်။) ဒီလို rule တစ်ခုကို implementation detail (အကောင်အထည်ဖော်မှု အသေးစိတ်) တစ်ခုအနေနဲ့ပဲ သဘောထားတာ အကောင်းဆုံး ဖြစ်ပါတယ်။ View တစ်ခုကို `CREATE OR REPLACE RULE "_RETURN" AS ...` ကနေတစ်ဆင့် ပြန်လည် သတ်မှတ်လို့ ရပေမယ့် — `CREATE OR REPLACE VIEW` ကို သုံးတာက ပိုကောင်းတဲ့ ပုံစံ (style) တစ်ခု ဖြစ်ပါတယ်။

View ပေါ်က update actions တွေကို — တခြား tables တွေပေါ်မှာ သင့်လျော်တဲ့ updates တွေနဲ့ အစားထိုးဖို့ — `ON INSERT`, `ON UPDATE` နဲ့ `ON DELETE` rules တွေ (သို့မဟုတ် — သင့်ရည်ရွယ်ချက်အတွက် လုံလောက်တဲ့ — အဲဒီထဲက subset တစ်ခုခု) ကို သတ်မှတ်ခြင်းအားဖြင့် — updatable view (update လုပ်လို့ရတဲ့ view) တစ်ခုရဲ့ အထင်အမြင် (illusion) ကို ဖန်တီးနိုင်ပါတယ်။ `INSERT RETURNING` စတာတွေကို ထောက်ပံ့ချင်တယ်ဆိုရင် — ဒီ rules တစ်ခုချင်းစီထဲမှာ သင့်လျော်တဲ့ `RETURNING` clause တစ်ခု ထည့်သွင်းဖို့ သေချာလုပ်ပါ။

ရှုပ်ထွေးတဲ့ view updates တွေအတွက် conditional rules (condition ပါတဲ့ rules) တွေကို သုံးဖို့ ကြိုးစားရင် ကွက်လပ် (catch) တစ်ခု ရှိပါတယ်: view ပေါ်မှာ ခွင့်ပြုချင်တဲ့ action တစ်ခုချင်းစီအတွက် — condition မရှိတဲ့ `INSTEAD` rule တစ်ခု ရှိရပါမယ်။ Rule က conditional ဖြစ်နေရင် သို့မဟုတ် `INSTEAD` မဟုတ်ဘူးဆိုရင် — system က update action ကို လုပ်ဆောင်ဖို့ ကြိုးစားမှုတွေကို ဆက်ပြီး ပယ်ချပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ — တချို့ ကိစ္စတွေမှာ — view ရဲ့ dummy table ပေါ်မှာ action ကို လုပ်ဆောင်ဖို့ ဖြစ်သွားနိုင်တယ်လို့ သူက ထင်မြင်နေလို့ပါ။ Conditional rules တွေထဲမှာ အသုံးဝင်တဲ့ ကိစ္စတွေ အားလုံးကို ကိုင်တွယ်ချင်တယ်ဆိုရင် — system က dummy table ကို update လုပ်ဖို့ ဘယ်တော့မှ မတောင်းဆိုခံရမှန်း နားလည်ကြောင်း သေချာစေဖို့ — condition မရှိတဲ့ `DO INSTEAD NOTHING` rule တစ်ခုကို ထပ်ပေါင်းပါ။ ပြီးရင် conditional rules တွေကို `INSTEAD` မဟုတ်အောင် ပြုလုပ်ပါ; သူတို့ သက်ရောက်တဲ့ ကိစ္စတွေမှာ — သူတို့က default `INSTEAD NOTHING` action ပေါ်ကို ထပ်ပေါင်းပါတယ်။ (ဒီနည်းလမ်းက `RETURNING` queries တွေကို ထောက်ပံ့ဖို့တော့ လက်ရှိမှာ အလုပ်မလုပ်ပါဘူး။)

> **မှတ်ချက်:** အလိုအလျောက် update လုပ်လို့ ရလောက်အောင် ရိုးရှင်းတဲ့ view တစ်ခုက ( [CREATE VIEW](/docs/postgresql/sql-createview) ကို ကြည့်ပါ) — updatable ဖြစ်ဖို့ user ဖန်တီးထားတဲ့ rule တစ်ခု မလိုအပ်ပါဘူး။ ဘယ်လိုပဲဖြစ်ဖြစ် — explicit rule တစ်ခုကို ဖန်တီးနိုင်ပေမယ့် — automatic update transformation (အလိုအလျောက် update အသွင်ပြောင်းမှု) က ယေဘုယျအားဖြင့် explicit rule တစ်ခုထက် စွမ်းဆောင်ရည် ပိုကောင်းပါလိမ့်မယ်။
> 
> ထည့်သွင်း စဉ်းစားသင့်တဲ့ နောက်ထပ် ရွေးချယ်စရာတစ်ခုကတော့ — rules တွေအစား `INSTEAD OF` triggers တွေကို သုံးတာ ဖြစ်ပါတယ် ( [CREATE TRIGGER](/docs/postgresql/sql-createtrigger) ကို ကြည့်ပါ)။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် rule တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။ ဒါက — table တစ်ခုတည်းအတွက် — တခြား rule တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။ Table တစ်ခုတည်းနဲ့ event type တစ်ခုတည်းပေါ်က rules အများအပြားကို — နာမည် အက္ခရာ စဉ်အလိုက် (alphabetical order) သက်ရောက်ပါတယ်။
- **event** — Event က SELECT, INSERT, UPDATE သို့မဟုတ် DELETE တွေထဲက တစ်ခု ဖြစ်ပါတယ်။ `ON CONFLICT` clause ပါဝင်တဲ့ INSERT တစ်ခုကို — INSERT သို့မဟုတ် UPDATE rules တွေ ရှိနေတဲ့ tables တွေပေါ်မှာ သုံးလို့ မရဘူးဆိုတာ သတိပြုပါ။ အဲဒီအစား updatable view တစ်ခုကို သုံးဖို့ စဉ်းစားပါ။
- **table_name** — Rule သက်ရောက်မယ့် table သို့မဟုတ် view ရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **condition** — SQL conditional expression (boolean ပြန်ပေးတဲ့) တစ်ခုခု ဖြစ်ပါတယ်။ Condition expression က — NEW နဲ့ OLD ကလွဲလို့ — ဘယ် tables တွေကိုမှ ရည်ညွှန်းလို့ မရဘဲ — aggregate functions တွေလည်း မပါဝင်နိုင်ပါဘူး။
- **INSTEAD** — INSTEAD က — commands တွေကို မူရင်း command အစား လုပ်ဆောင်သင့်တယ်လို့ ညွှန်ပြပါတယ်။
- **ALSO** — ALSO က — commands တွေကို မူရင်း command နဲ့အတူ ထပ်ဆောင်း လုပ်ဆောင်သင့်တယ်လို့ ညွှန်ပြပါတယ်။
ALSO ရော INSTEAD ရော နှစ်ခုလုံး သတ်မှတ်မထားဘူးဆိုရင် — ALSO က default ဖြစ်ပါတယ်။
- **command** — Rule action ကို ဖွဲ့စည်းပေးတဲ့ command သို့မဟုတ် commands တွေ ဖြစ်ပါတယ်။ တရားဝင် (valid) commands တွေက SELECT, INSERT, UPDATE, DELETE သို့မဟုတ် NOTIFY ဖြစ်ပါတယ်။

`condition` နဲ့ `command` အတွင်းမှာ — `NEW` နဲ့ `OLD` ဆိုတဲ့ အထူး table names တွေကို — ရည်ညွှန်းထားတဲ့ table ထဲက တန်ဖိုးတွေကို ရည်ညွှန်းဖို့ သုံးနိုင်ပါတယ်။ `NEW` က `ON INSERT` နဲ့ `ON UPDATE` rules တွေမှာ — insert သို့မဟုတ် update လုပ်နေတဲ့ row အသစ်ကို ရည်ညွှန်းဖို့ တရားဝင် သုံးနိုင်ပါတယ်။ `OLD` က `ON UPDATE` နဲ့ `ON DELETE` rules တွေမှာ — update သို့မဟုတ် delete လုပ်နေတဲ့ row အဟောင်းကို ရည်ညွှန်းဖို့ တရားဝင် သုံးနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုအတွက် rules တွေ ဖန်တီးဖို့ သို့မဟုတ် ပြောင်းလဲဖို့ — သင်ဟာ အဲဒီ table ရဲ့ owner ဖြစ်ရပါမယ်။

View တစ်ခုပေါ်က `INSERT`, `UPDATE` သို့မဟုတ် `DELETE` အတွက် rule တစ်ခုမှာ — view ရဲ့ columns တွေကို ထုတ်ပေးတဲ့ `RETURNING` clause တစ်ခုကို ထပ်ပေါင်းနိုင်ပါတယ်။ Rule ကို `INSERT RETURNING`, `UPDATE RETURNING` သို့မဟုတ် `DELETE RETURNING` command တစ်ခုက trigger လုပ်တဲ့အခါ — အသီးသီး outputs တွေကို တွက်ချက်ဖို့ ဒီ clause ကို သုံးပါလိမ့်မယ်။ Rule ကို `RETURNING` မပါတဲ့ command တစ်ခုက trigger လုပ်တဲ့အခါ — rule ရဲ့ `RETURNING` clause ကို လျစ်လျူရှုပါလိမ့်မယ်။ လက်ရှိ implementation က — condition မရှိတဲ့ `INSTEAD` rules တွေမှာသာ `RETURNING` ပါဝင်ခွင့် ပြုပါတယ်; ထို့ပြင် — event တစ်ခုတည်းအတွက် rules တွေ အားလုံးကြားမှာ — `RETURNING` clause တစ်ခုထက်ပို ရှိနေလို့ မရပါဘူး။ (ဒါက — ရလဒ်တွေကို တွက်ချက်ဖို့ သုံးမယ့် `RETURNING` clause ကိုယ်စားလှယ် (candidate) တစ်ခုတည်းသာ ရှိစေဖို့ သေချာစေပါတယ်။) View ပေါ်က `RETURNING` queries တွေက — ရရှိနိုင်တဲ့ rule တစ်ခုခုမှာ `RETURNING` clause မရှိဘူးဆိုရင် — ပယ်ချခံရပါလိမ့်မယ်။

Circular rules (သံသရာ လည်နေတဲ့ rules) တွေကို ရှောင်ရှားဖို့ — အထူး ဂရုစိုက်ဖို့ အလွန် အရေးကြီးပါတယ်။ ဥပမာ — အောက်က rule definition နှစ်ခုစလုံးကို PostgreSQL က လက်ခံပေမယ့် — `SELECT` command က — rule တစ်ခုရဲ့ recursive expansion (သံသရာ ချဲ့ထွင်မှု) ကြောင့် — PostgreSQL ကို error တစ်ခု အစီရင်ခံစေမှာ ဖြစ်ပါတယ်:

```sql
CREATE RULE "_RETURN" AS
    ON SELECT TO t1
    DO INSTEAD
        SELECT * FROM t2;

CREATE RULE "_RETURN" AS
    ON SELECT TO t2
    DO INSTEAD
        SELECT * FROM t1;

SELECT * FROM t1;
```

လောလောဆယ်မှာ — rule action တစ်ခုမှာ `NOTIFY` command တစ်ခု ပါဝင်နေရင် — `NOTIFY` command ကို unconditionally (ခြွင်းချက် မရှိဘဲ) လုပ်ဆောင်ပါလိမ့်မယ် — ဆိုလိုတာက — rule သက်ရောက်သင့်တဲ့ rows တွေ ဘာမှ မရှိဘဲနဲ့တောင် — `NOTIFY` ကို ထုတ်ပြန်ပေးပါလိမ့်မယ်။ ဥပမာ — ဒီထဲမှာ:

```sql
CREATE RULE notify_me AS ON UPDATE TO mytable DO ALSO NOTIFY mytable;

UPDATE mytable SET name = 'foo' WHERE id = 42;
```

`id = 42` ဆိုတဲ့ condition နဲ့ ကိုက်ညီတဲ့ rows တွေ ရှိ မရှိ မသက်ဆိုင်ဘဲ — `UPDATE` အတွင်း — `NOTIFY` event တစ်ခု ပို့ပေးပါလိမ့်မယ်။ ဒါက — နောင်ထွက်ရှိမယ့် releases တွေမှာ ပြုပြင်ပေးနိုင်တဲ့ — implementation ဆိုင်ရာ ကန့်သတ်ချက်တစ်ခု ဖြစ်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE RULE` က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ် — query rewrite system တစ်ခုလုံးလိုပါပဲ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER RULE](/docs/postgresql/sql-alterrule), [DROP RULE](/docs/postgresql/sql-droprule)
