---
title: "Generated Column Replication (generated column များ replication လုပ်ခြင်း)"
description: "Logical replication တွင် generated column များ မည်သို့ ကိုင်တွယ်သည် — subscriber မှ တန်ဖိုးယူခြင်း၊ publish_generated_columns နှင့် column list ရွေးချယ်မှုများ၊ ရလဒ် အနှစ်ချုပ် ဇယားနှင့် သတိပေးချက်များ"
order: 214
source: "https://www.postgresql.org/docs/current/logical-replication-gencols.html"
status: translated
updated: 2026-09-11
---

## 29.6. Generated Column Replication (generated column များ replication လုပ်ခြင်း)

ပုံမှန်အားဖြင့် — subscriber ဘက်က table ကို publisher table နဲ့ တူညီအောင် သတ်မှတ်လေ့ ရှိပါတယ်။ ဒါကြောင့် publisher table မှာ [`GENERATED column`](/docs/postgresql/ddl-generated-columns) တစ်ခု ရှိရင် — subscriber table မှာလည်း ကိုက်ညီတဲ့ generated column တစ်ခု ရှိပါလိမ့်မယ်။ ဒီအခြေအနေမှာ — အမြဲတမ်း subscriber table ရဲ့ generated column တန်ဖိုးကိုသာ သုံးပါတယ်။

ဥပမာအနေနဲ့ — အောက်မှာ subscriber table ရဲ့ generated column တန်ဖိုးက subscriber column ရဲ့ တွက်ချက်မှုကနေ ရလာတာကို သတိပြုပါ။

```sql
/* pub # */ CREATE TABLE tab_gen_to_gen (a int, b int GENERATED ALWAYS AS (a + 1) STORED);
/* pub # */ INSERT INTO tab_gen_to_gen VALUES (1),(2),(3);
/* pub # */ CREATE PUBLICATION pub1 FOR TABLE tab_gen_to_gen;
/* pub # */ SELECT * FROM tab_gen_to_gen;
 a | b
---+---
 1 | 2
 2 | 3
 3 | 4
(3 rows)

/* sub # */ CREATE TABLE tab_gen_to_gen (a int, b int GENERATED ALWAYS AS (a * 100) STORED);
/* sub # */ CREATE SUBSCRIPTION sub1 CONNECTION 'dbname=test_pub' PUBLICATION pub1;
/* sub # */ SELECT * from tab_gen_to_gen;
 a | b
---+----
 1 | 100
 2 | 200
 3 | 300
(3 rows)
```

တကယ်တော့ — version 18.0 မတိုင်မီမှာ — logical replication က `GENERATED` column တွေကို လုံးဝ ထုတ်ဝေ (publish) မလုပ်ပါဘူး။

ဒါပေမယ့် — generated column တစ်ခုကို သာမန် column တစ်ခုဆီ replicate လုပ်တာက တခါတရံ အလိုရှိအပ်ပါတယ်။

> **အကြံပြုချက်:** ဒီ feature က — output plugin ကတစ်ဆင့် — PostgreSQL မဟုတ်တဲ့ database တစ်ခုဆီ data တွေ replicate လုပ်တဲ့အခါ အသုံးဝင်နိုင်ပါတယ် — အထူးသဖြင့် target database က generated column တွေကို support မလုပ်ရင်ပါ။

Generated column တွေကို default အားဖြင့် ထုတ်ဝေတာ မဟုတ်ပေမယ့် — အသုံးပြုသူတွေက stored generated column တွေကို သာမန် column တွေလိုပဲ ထုတ်ဝေဖို့ ရွေးချယ်နိုင်ပါတယ်။

ဒါကို လုပ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်။

- `PUBLICATION` parameter ဖြစ်တဲ့ `publish_generated_columns` ကို `stored` သတ်မှတ်ပါ။ ဒါက PostgreSQL logical replication ကို — publication ရဲ့ table တွေရဲ့ လက်ရှိနဲ့ အနာဂတ် stored generated column တွေကို — ထုတ်ဝေဖို့ ညွှန်ကြားပါတယ်။
- ဘယ် stored generated column တွေကို ထုတ်ဝေမလဲဆိုတာ တိုက်ရိုက် သတ်မှတ်ဖို့ table column list တစ်ခုကို ဖော်ပြပါ။
  
  > **မှတ်ချက်:** ဘယ် table column တွေကို ထုတ်ဝေမလဲ ဆုံးဖြတ်တဲ့အခါ — column list က ဦးစားပေးပြီး — `publish_generated_columns` parameter ရဲ့ အကျိုးသက်ရောက်မှုကို လွှမ်းမိုး (override) ပါတယ်။

အောက်ပါ ဇယားက logical replication မှာ generated column တွေ ပါဝင်တဲ့အခါ ဖြစ်ပေါ်တဲ့ အပြုအမူကို အကျဉ်းချုပ် ဖော်ပြပါတယ်။ Generated column ထုတ်ဝေမှုကို enable မလုပ်ထားတဲ့အခါနဲ့ enable လုပ်ထားတဲ့အခါ ရလဒ်တွေကို ပြသထားပါတယ်။

**ဇယား 29.2. Replication Result Summary (replication ရလဒ် အနှစ်ချုပ်)**

| Publish generated columns? | Publisher table column | Subscriber table column | Result |
| --- | --- | --- | --- |
| No | GENERATED | GENERATED | Publisher table column ကို replicate မလုပ်ပါ။ Subscriber table ရဲ့ generated column တန်ဖိုးကို သုံးပါ။ |
| No | GENERATED | regular | Publisher table column ကို replicate မလုပ်ပါ။ Subscriber table ရဲ့ သာမန် column default တန်ဖိုးကို သုံးပါ။ |
| No | GENERATED | --missing-- | Publisher table column ကို replicate မလုပ်ပါ။ ဘာမှ ဖြစ်မလာပါ။ |
| Yes | GENERATED | GENERATED | ERROR ဖြစ်ပါတယ်။ Support မလုပ်ပါ။ |
| Yes | GENERATED | regular | Publisher table column တန်ဖိုးကို subscriber table column ဆီ replicate လုပ်ပါတယ်။ |
| Yes | GENERATED | --missing-- | ERROR ဖြစ်ပါတယ်။ Column က subscriber table မှာ ပျောက်နေတယ်လို့ အစီရင်ခံပါတယ်။ |

> **သတိပေးချက်:** တူညီတဲ့ table ကို column list မတူညီတဲ့ ပုံစံနဲ့ ထုတ်ဝေထားတဲ့ publication အများအပြား ပါဝင်တဲ့ subscription တွေအတွက် လက်ရှိမှာ support မရှိပါဘူး။ [အပိုင်း 29.5](/docs/postgresql/logical-replication-col-lists) ကို ကြည့်ပါ။
> 
> တူညီတဲ့ subscription ထဲက publication တစ်ခုက generated column တွေကို ထုတ်ဝေနေပြီး — နောက်တစ်ခုက အဲဒီ table အတွက် generated column တွေကို မထုတ်ဝေရင်လည်း ဒီအခြေအနေမျိုး ဖြစ်နိုင်ပါတယ်။

> **မှတ်ချက်:** Subscriber က release 18 မတိုင်မီက ဖြစ်နေရင် — publisher မှာ generated column တွေ သတ်မှတ်ထားရင်တောင် — အစပိုင်း table synchronization က generated column တွေကို copy မလုပ်ပါဘူး။
