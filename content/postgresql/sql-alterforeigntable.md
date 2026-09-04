---
title: "ALTER FOREIGN TABLE (foreign table တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)"
description: "ရှိပြီးသား foreign table တစ်ခုရဲ့ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးသည့် command — column များ ထပ်ထည့်ခြင်း/ဖယ်ရှားခြင်း (ADD/DROP COLUMN)၊ column ၏ type, default, NOT NULL, statistics, attribute options နှင့် storage mode များ ပြောင်းလဲခြင်း၊ CHECK/NOT NULL constraints များ ထပ်ပေါင်းခြင်း/ဖယ်ရှားခြင်း၊ triggers များ စီမံခြင်း၊ OPTIONS, OWNER, RENAME, SET SCHEMA စသည့် ပုံစံကွဲ (subform) အများအပြား ပါဝင်သည် — command ကို သုံးရန် table ၏ ပိုင်ရှင် ဖြစ်ရန် လိုအပ်သည်"
order: 308
source: "https://www.postgresql.org/docs/current/sql-alterforeigntable.html"
status: translated
updated: 2026-09-04
---

## ALTER FOREIGN TABLE (foreign table တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲခြင်း)

ALTER FOREIGN TABLE — foreign table တစ်ခုရဲ့ သတ်မှတ်ချက် (definition) ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER FOREIGN TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    action [, ... ]
ALTER FOREIGN TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
    RENAME [ COLUMN ] column_name TO new_column_name
ALTER FOREIGN TABLE [ IF EXISTS ] name
    RENAME TO new_name
ALTER FOREIGN TABLE [ IF EXISTS ] name
    SET SCHEMA new_schema

where action is one of:

    ADD [ COLUMN ] [ IF NOT EXISTS ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
    DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
    ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ]
    ALTER [ COLUMN ] column_name SET DEFAULT expression
    ALTER [ COLUMN ] column_name DROP DEFAULT
    ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
    ALTER [ COLUMN ] column_name SET STATISTICS integer
    ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
    ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
    ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN | DEFAULT }
    ALTER [ COLUMN ] column_name OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ])
    ADD table_constraint [ NOT VALID ]
    VALIDATE CONSTRAINT constraint_name
    DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
    DISABLE TRIGGER [ trigger_name | ALL | USER ]
    ENABLE TRIGGER [ trigger_name | ALL | USER ]
    ENABLE REPLICA TRIGGER trigger_name
    ENABLE ALWAYS TRIGGER trigger_name
    SET WITHOUT OIDS
    INHERIT parent_table
    NO INHERIT parent_table
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
    OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ])
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER FOREIGN TABLE` က — တည်ရှိပြီးသား foreign table တစ်ခုရဲ့ သတ်မှတ်ချက်ကို ပြောင်းလဲပေးပါတယ်။ ပုံစံကွဲ (subform) များစွာ ရှိပါတယ်:

- **ADD [ COLUMN ] [ IF NOT EXISTS ]** — ဒီ form က — `CREATE FOREIGN TABLE` မှာ သုံးတဲ့ syntax အတိုင်းပဲ — foreign table ဆီ column အသစ်တစ်ခုကို ထပ်ပေါင်းပါတယ်။ `IF NOT EXISTS` ကို သတ်မှတ်ထားပြီး — ဒီနာမည်နဲ့ column တစ်ခု ရှိပြီးသား ဖြစ်နေရင် — error မပစ်ပါဘူး။ သာမန် table တစ်ခုဆီ column ထပ်ပေါင်းတဲ့ ကိစ္စနဲ့ မတူဘဲ — အောက်ခံ storage (သိုလှောင်မှု) မှာ ဘာမှ မဖြစ်ပါဘူး: ဒီ action က — column အသစ်တစ်ခုကို အခု foreign table ကနေတစ်ဆင့် ဝင်ရောက်လို့ ရပြီဆိုတာကိုပဲ — ကြေညာ (declare) လုပ်တာ ဖြစ်ပါတယ်။
- **DROP [ COLUMN ] [ IF EXISTS ]** — ဒီ form က foreign table ကနေ column တစ်ခုကို ဖယ်ရှားပါတယ်။ Table ရဲ့ အပြင်ဘက်က တစ်စုံတစ်ခုက column ပေါ်မှာ မှီခိုနေရင် — ဥပမာ views — `CASCADE` ကို သင်ပြောရပါမယ်။ `IF EXISTS` ကို သတ်မှတ်ထားပြီး — column မရှိဘူးဆိုရင် — error မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခုကို အစား ထုတ်ပေးပါတယ်။
- **SET DATA TYPE** — ဒီ form က foreign table တစ်ခုရဲ့ column တစ်ခုရဲ့ type ကို ပြောင်းလဲပါတယ်။ ဒါကလည်း — အောက်ခံ storage ပေါ်မှာ သက်ရောက်မှု မရှိပါဘူး: ဒီ action က — PostgreSQL က column မှာ ရှိတယ်လို့ ယူဆတဲ့ type ကိုပဲ ပြောင်းလဲလိုက်တာ ဖြစ်ပါတယ်။
- **SET/DROP DEFAULT** — ဒီ forms တွေက column တစ်ခုအတွက် default value ကို သတ်မှတ် သို့မဟုတ် ဖယ်ရှားပါတယ်။ Default values တွေက နောက်ပိုင်း `INSERT` သို့မဟုတ် `UPDATE` commands တွေမှာပဲ သက်ရောက်ပြီး — table ထဲမှာ ရှိပြီးသား rows တွေကို ပြောင်းလဲစေတာ မဟုတ်ပါဘူး။
- **SET/DROP NOT NULL** — Column တစ်ခုကို null values တွေ ခွင့်ပြုတဲ့ (သို့မဟုတ် မခွင့်ပြုတဲ့) အဖြစ် အမှတ်အသား လုပ်ပါတယ်။
- **SET STATISTICS** — ဒီ form က — နောက်ပိုင်း `ANALYZE` operations တွေအတွက် — per-column statistics-gathering target (column အလိုက် စာရင်းအင်း စုဆောင်းမှု ပစ်မှတ်) ကို သတ်မှတ်ပါတယ်။ အသေးစိတ်အတွက် — `ALTER TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။
- **SET ( attribute_option = value [, ... ] ) / RESET ( attribute_option [, ... ] )** — ဒီ form က per-attribute options တွေကို သတ်မှတ် သို့မဟုတ် ပြန်လည် သတ်မှတ် (reset) ပါတယ်။ အသေးစိတ်အတွက် — `ALTER TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။
- **SET STORAGE** — ဒီ form က column တစ်ခုအတွက် storage mode ကို သတ်မှတ်ပါတယ်။ အသေးစိတ်အတွက် — `ALTER TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။ Storage mode က — table ရဲ့ foreign-data wrapper က ၎င်းကို ဂရုစိုက် လိုက်နာဖို့ ရွေးချယ်မှသာ — သက်ရောက်မှု ရှိတယ်ဆိုတာ သတိပြုပါ။
- **ADD table_constraint [ NOT VALID ]** — ဒီ form က — `CREATE FOREIGN TABLE` မှာ သုံးတဲ့ syntax အတိုင်းပဲ — foreign table ဆီ constraint အသစ်တစ်ခုကို ထပ်ပေါင်းပါတယ်။ လောလောဆယ် `CHECK` နဲ့ `NOT NULL` constraints တွေကိုပဲ ထောက်ပံ့ပါတယ်။
  သာမန် table တစ်ခုဆီ constraint ထပ်ပေါင်းတဲ့ ကိစ္စနဲ့ မတူဘဲ — constraint မှန်ကန်ကြောင်း စစ်ဆေးဖို့ ဘာမှ မလုပ်ပါဘူး; ဒီ action က — foreign table ထဲက rows တွေ အားလုံးအတွက် အခြေအနေအသစ်တစ်ခု မှန်ကန်တယ်လို့ ယူဆသင့်တယ်ဆိုတာကို — ကြေညာရုံပဲ လုပ်တာ ဖြစ်ပါတယ်။ (`CREATE FOREIGN TABLE` ထဲက ဆွေးနွေးချက်ကို ကြည့်ပါ။) Constraint ကို `NOT VALID` အဖြစ် အမှတ်အသား လုပ်ထားရင် (`CHECK` ကိစ္စမှာပဲ ခွင့်ပြုပါတယ်) — သူ မှန်ကန်တယ်လို့ မယူဆဘဲ — နောင်မှာ သုံးဖို့ ဖြစ်နိုင်ခြေရှိတဲ့အတွက် — မှတ်တမ်း (record) တင်ရုံပဲ လုပ်ပါတယ်။
- **VALIDATE CONSTRAINT** — ဒီ form က — အရင်က `NOT VALID` အဖြစ် အမှတ်အသား လုပ်ထားခဲ့တဲ့ constraint တစ်ခုကို — valid အဖြစ် အမှတ်အသား လုပ်ပါတယ်။ Constraint ကို စစ်ဆေးဖို့ action တစ်ခုမှ မလုပ်ပေမယ့် — နောင်က queries တွေက သူ မှန်ကန်တယ်လို့ ယူဆပါလိမ့်မယ်။
- **DROP CONSTRAINT [ IF EXISTS ]** — ဒီ form က foreign table ပေါ်က သတ်မှတ်ထားတဲ့ constraint ကို ဖယ်ရှားပါတယ်။ `IF EXISTS` ကို သတ်မှတ်ထားပြီး — constraint မရှိဘူးဆိုရင် — error မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခုကို အစား ထုတ်ပေးပါတယ်။
- **DISABLE/ENABLE [ REPLICA | ALWAYS ] TRIGGER** — ဒီ forms တွေက foreign table နဲ့ သက်ဆိုင်တဲ့ trigger(s) တွေရဲ့ ပစ်ခတ်မှု (firing) ကို ပြင်ဆင် သတ်မှတ်ပါတယ်။ အသေးစိတ်အတွက် — `ALTER TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။
- **SET WITHOUT OIDS** — `oid` system column ကို ဖယ်ရှားဖို့အတွက် နောက်ကြောင်း ပြန် လိုက်ဖက်ညီမှု (backward compatibility) ရှိတဲ့ syntax ဖြစ်ပါတယ်။ `oid` system columns တွေကို နောက်ထပ် ထပ်ဖြည့်လို့ မရတော့တာကြောင့် — ဒါက ဘယ်တော့မှ သက်ရောက်မှု မရှိပါဘူး။
- **INHERIT parent_table** — ဒီ form က — target foreign table ကို — သတ်မှတ်ထားတဲ့ parent table ရဲ့ child အသစ်တစ်ခုအဖြစ် ထပ်ပေါင်းပါတယ်။ အသေးစိတ်အတွက် — `ALTER TABLE` ရဲ့ အလားတူ form ကို ကြည့်ပါ။
- **NO INHERIT parent_table** — ဒီ form က — target foreign table ကို — သတ်မှတ်ထားတဲ့ parent table ရဲ့ children စာရင်းကနေ ဖယ်ရှားပါတယ်။
- **OWNER** — ဒီ form က foreign table ရဲ့ owner ကို — သတ်မှတ်ထားတဲ့ user အဖြစ် — ပြောင်းလဲပါတယ်။
- **OPTIONS ( [ ADD | SET | DROP ] option ['value'] [, ... ] )** — Foreign table အတွက် သို့မဟုတ် ၎င်းရဲ့ column တစ်ခုအတွက် options တွေကို ပြောင်းလဲပါတယ်။ `ADD`, `SET` နဲ့ `DROP` တို့က လုပ်ဆောင်ရမယ့် action ကို သတ်မှတ်ပါတယ်။ Operation တစ်ခုကို အတိအကျ သတ်မှတ်မထားရင် `ADD` လို့ ယူဆပါတယ်။ Option နာမည် ထပ်နေတာတွေကို ခွင့်မပြုပါဘူး (table option တစ်ခုနဲ့ column option တစ်ခုမှာ နာမည် တူနေတာကတော့ ရပါတယ်)။ Option names နဲ့ values တွေကိုလည်း — foreign data wrapper library ကို သုံးပြီး — တရားဝင်မှု စစ်ဆေး (validate) လုပ်ပါတယ်။
- **RENAME** — RENAME forms တွေက foreign table တစ်ခုရဲ့ နာမည် သို့မဟုတ် foreign table တစ်ခုထဲက column တစ်ခုချင်းစီရဲ့ နာမည်ကို ပြောင်းလဲပါတယ်။
- **SET SCHEMA** — ဒီ form က foreign table ကို တခြား schema တစ်ခုဆီ ရွှေ့ပြောင်းပါတယ်။

`RENAME` နဲ့ `SET SCHEMA` ကလွဲလို့ — action တွေ အားလုံးကို — တစ်ပြိုင်နက် သက်ရောက်စေဖို့ — ပြောင်းလဲမှု (alteration) အများအပြားရဲ့ စာရင်းတစ်ခုထဲ ပေါင်းစပ်နိုင်ပါတယ်။ ဥပမာ — command တစ်ခုတည်းနဲ့ column အများအပြား ထပ်ပေါင်းတာ သို့မဟုတ် column အများအပြားရဲ့ type တွေကို ပြောင်းလဲတာ လုပ်နိုင်ပါတယ်။

Command ကို `ALTER FOREIGN TABLE IF EXISTS ...` အနေနဲ့ ရေးပြီး — foreign table မရှိဘူးဆိုရင် — error မပစ်ပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။

`ALTER FOREIGN TABLE` ကို သုံးဖို့ — သင်ဟာ table ကို ပိုင်ဆိုင်ရပါမယ်။ Foreign table တစ်ခုရဲ့ schema ကို ပြောင်းလဲဖို့ — schema အသစ်ပေါ်မှာ `CREATE` privilege လည်း ရှိရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ — သင်ဟာ owner အသစ် ဖြစ်လာမယ့် role ဆီကို `SET ROLE` လုပ်နိုင်ရမှာ ဖြစ်ပြီး — အဲဒီ role က table ရဲ့ schema ပေါ်မှာ `CREATE` privilege ရှိရပါမယ်။ (ဒီ ကန့်သတ်ချက်တွေက — owner ပြောင်းလဲတာက — table ကို drop လုပ်ပြီး ပြန်လည် ဖန်တီးခြင်းအားဖြင့် သင်လုပ်နိုင်တာထက် ပိုတဲ့ ဘာမှ မလုပ်နိုင်အောင် — အတင်းအကျပ် သေချာစေပါတယ်။ ဒါပေမယ့် — superuser တစ်ယောက်က ဘယ် table ရဲ့ ownership ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။) Column တစ်ခု ထပ်ပေါင်းဖို့ သို့မဟုတ် column type တစ်ခုကို ပြောင်းလဲဖို့ — data type ပေါ်မှာ `USAGE` privilege လည်း ရှိရပါမယ်။

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် တည်ရှိပြီးသား foreign table တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။ Table နာမည် မတိုင်ခင် `ONLY` ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုတည်းကိုပဲ ပြောင်းလဲပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — table နဲ့ ၎င်းရဲ့ descendant tables တွေ အားလုံး (ရှိရင်) ပြောင်းလဲပါတယ်။ Option အနေနဲ့ — descendant tables တွေ ပါဝင်တယ်ဆိုတာကို အတိအကျ ညွှန်ပြဖို့ — table နာမည် နောက်မှာ `*` ကို သတ်မှတ်နိုင်ပါတယ်။
- **column_name** — အသစ် သို့မဟုတ် ရှိပြီးသား column တစ်ခုရဲ့ နာမည်။
- **new_column_name** — ရှိပြီးသား column တစ်ခုအတွက် နာမည်အသစ်။
- **new_name** — Table အတွက် နာမည်အသစ်။
- **data_type** — Column အသစ်ရဲ့ data type၊ သို့မဟုတ် ရှိပြီးသား column တစ်ခုအတွက် data type အသစ်။
- **table_constraint** — Foreign table အတွက် table constraint အသစ်။
- **constraint_name** — ဖယ်ရှားရမယ့် တည်ရှိပြီးသား constraint တစ်ခုရဲ့ နာမည်။
- **CASCADE** — Drop လုပ်လိုက်တဲ့ column ဒါမှမဟုတ် constraint ပေါ်မှာ မှီခိုနေတဲ့ objects တွေ (ဥပမာ — column ကို ရည်ညွှန်းထားတဲ့ views) ကိုရော — အဲဒီ objects တွေပေါ်မှာ မှီခိုနေတဲ့ objects တွေ အားလုံးကိုပါ — အလိုအလျောက် drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — မှီခိုနေတဲ့ (dependent) objects တွေ ရှိနေရင် column ဒါမှမဟုတ် constraint ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default အပြုအမူ ဖြစ်ပါတယ်။
- **trigger_name** — Disable သို့မဟုတ် enable လုပ်ရမယ့် trigger တစ်ခုတည်းရဲ့ နာမည်။
- **ALL** — Foreign table နဲ့ သက်ဆိုင်တဲ့ triggers တွေ အားလုံးကို disable သို့မဟုတ် enable လုပ်ပါတယ်။ (Triggers တွေထဲက တစ်ခုခုက internally generated triggers (အတွင်းပိုင်းမှ ထုတ်လုပ်ထားသော triggers) တွေ ဆိုရင် — ဒါက superuser privilege လိုအပ်ပါတယ်။ Core system က foreign tables တွေဆီ ဒီလို triggers တွေကို ထပ်မဖြည့်ပါဘူး — ဒါပေမယ့် add-on code တွေက ဖြည့်နိုင်ပါတယ်။)
- **USER** — Internally generated triggers တွေ ကလွဲလို့ — foreign table နဲ့ သက်ဆိုင်တဲ့ triggers တွေ အားလုံးကို disable သို့မဟုတ် enable လုပ်ပါတယ်။
- **parent_table** — ဒီ foreign table နဲ့ ချိတ်ဆက် (associate) ရန် သို့မဟုတ် ချိတ်ဆက်မှု ဖြုတ် (de-associate) ရန် parent table တစ်ခု။
- **new_owner** — Table ရဲ့ owner အသစ်ရဲ့ user name။
- **new_schema** — Table ကို ရွှေ့ပြောင်းမယ့် schema ရဲ့ နာမည်။

## Notes (မှတ်စုများ)

`COLUMN` ဆိုတဲ့ key word က noise (ထည့်လည်း ရ မထည့်လည်း ရတဲ့ စကားလုံး) ဖြစ်ပြီး — ချန်လှပ်လို့ ရပါတယ်။

Column တစ်ခုကို `ADD COLUMN` သို့မဟုတ် `DROP COLUMN` နဲ့ ထပ်ပေါင်း/ဖယ်ရှားတဲ့အခါ၊ `NOT NULL` သို့မဟုတ် `CHECK` constraint တစ်ခု ထပ်ပေါင်းတဲ့အခါ၊ ဒါမှမဟုတ် column type တစ်ခုကို `SET DATA TYPE` နဲ့ ပြောင်းလဲတဲ့အခါ — foreign server နဲ့ ကိုက်ညီမှု (consistency) ကို စစ်ဆေးတာ မရှိပါဘူး။ Table definition က remote ဘက်ခြမ်းနဲ့ ကိုက်ညီကြောင်း သေချာစေဖို့ဆိုတာ user ရဲ့ တာဝန် ဖြစ်ပါတယ်။

Valid parameters တွေရဲ့ နောက်ထပ် ဖော်ပြချက်အတွက် [CREATE FOREIGN TABLE](/docs/postgresql/sql-createforeigntable) ကို ရည်ညွှန်းပါ။

## Examples (ဥပမာများ)

Column တစ်ခုကို not-null အဖြစ် အမှတ်အသား လုပ်ဖို့:

```sql
ALTER FOREIGN TABLE distributors ALTER COLUMN street SET NOT NULL;
```

Foreign table တစ်ခုရဲ့ options တွေကို ပြောင်းလဲဖို့:

```sql
ALTER FOREIGN TABLE myschema.distributors OPTIONS (ADD opt1 'value', SET opt2 'value2', DROP opt3);
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ADD`, `DROP` နဲ့ `SET DATA TYPE` forms တွေက SQL standard နဲ့ ကိုက်ညီပါတယ်။ တခြား forms တွေကတော့ — SQL standard ရဲ့ PostgreSQL extensions တွေ ဖြစ်ပါတယ်။ ထို့အပြင် — `ALTER FOREIGN TABLE` command တစ်ခုတည်းမှာ manipulation တစ်ခုထက်ပို သတ်မှတ်နိုင်တာကလည်း extension တစ်ခု ဖြစ်ပါတယ်။

`ALTER FOREIGN TABLE DROP COLUMN` ကို — foreign table တစ်ခုရဲ့ တစ်ခုတည်းသော column ကို drop လုပ်ဖို့ သုံးနိုင်ပြီး — column မရှိတဲ့ (zero-column) table တစ်ခု ကျန်ရစ်စေပါတယ်။ ဒါက — zero-column foreign tables တွေကို တားမြစ်ထားတဲ့ — SQL ရဲ့ extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FOREIGN TABLE](/docs/postgresql/sql-createforeigntable), [DROP FOREIGN TABLE](/docs/postgresql/sql-dropforeigntable)
