---
title: "SAVEPOINT (transaction အတွင်း ပြန်ဆုတ်နိုင်သော အမှတ် သတ်မှတ်ခြင်း)"
description: "လက်ရှိ transaction အတွင်းမှာ savepoint အသစ်တစ်ခု သတ်မှတ်ခြင်း — SAVEPOINT ၏ syntax နှင့် parameters၊ ROLLBACK TO / RELEASE SAVEPOINT ဖြင့် savepoint ကို ပြန်ဆုတ်ခြင်းနှင့် ဖျက်သိမ်းခြင်း ဥပမာများ၊ SQL standard လိုက်ဖက်ညီမှုအကြောင်း"
order: 161
source: "https://www.postgresql.org/docs/current/sql-savepoint.html"
status: translated
updated: 2026-09-04
---

## SAVEPOINT (transaction အတွင်း ပြန်ဆုတ်နိုင်သော အမှတ် သတ်မှတ်ခြင်း)

SAVEPOINT — လက်ရှိ transaction အတွင်းမှာ savepoint အသစ်တစ်ခု သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SAVEPOINT savepoint_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SAVEPOINT` က လက်ရှိ transaction အတွင်းမှာ savepoint အသစ်တစ်ခုကို ထူထောင်ပေးပါတယ်။

Savepoint ဆိုတာက transaction အတွင်းက အထူး အမှတ်အသားတစ်ခုပါ — သူ့ကို ထူထောင်ပြီးနောက်မှာ execute လုပ်ခဲ့တဲ့ command တွေ အားလုံးကို roll back လုပ်နိုင်စေပြီး — transaction ရဲ့ အခြေအနေကို savepoint အချိန်က ရှိခဲ့တဲ့ အနေအထားအတိုင်း ပြန်လည် တည်ဆောက်ပေးပါတယ်။

## Parameters (parameter များ)

- **savepoint_name** — Savepoint အသစ်အတွက် ပေးရမယ့် နာမည်။ နာမည်တူ savepoint တွေ ရှိပြီးသား ဖြစ်နေရင် — နောက်ပိုင်းမှာ ထပ်တူ နာမည်နဲ့ သတ်မှတ်လိုက်တဲ့ savepoint အသစ်တွေကို release လုပ်ပြီးတဲ့အထိ — အဲဒီ savepoint အဟောင်းတွေဆီ ဝင်ရောက်လို့ မရတော့ပါဘူး။

## Notes (မှတ်စုများ)

Savepoint တစ်ခုဆီ ပြန်ဆုတ်ဖို့ [`ROLLBACK TO`](https://www.postgresql.org/docs/current/sql-rollback-to.html) ကို သုံးပါ။ Savepoint တစ်ခုကို ဖျက်ဆီးပစ်ဖို့ — သူ့ကို ထူထောင်ပြီးနောက်မှာ execute လုပ်ခဲ့တဲ့ command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေကို ထိန်းသိမ်းထားရင်း — [`RELEASE SAVEPOINT`](https://www.postgresql.org/docs/current/sql-release-savepoint.html) ကို သုံးပါ။

Savepoint တွေကို transaction block အတွင်းမှာပဲ ထူထောင်လို့ ရပါတယ်။ Transaction တစ်ခုအတွင်းမှာ savepoint အများကြီး သတ်မှတ်ထားလို့ ရပါတယ်။

## Examples (ဥပမာများ)

Savepoint တစ်ခုကို ထူထောင်ပြီး — နောက်ပိုင်းမှာ ထို savepoint ထူထောင်ပြီးနောက် execute လုပ်ခဲ့တဲ့ command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေ အားလုံးကို ပျက်ပြယ်စေဖို့:

```sql
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    ROLLBACK TO SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);
COMMIT;
```

အပေါ်က transaction က တန်ဖိုး 1 နဲ့ 3 ကို insert လုပ်မှာ ဖြစ်ပြီး — 2 ကိုတော့ မလုပ်ပါဘူး။

Savepoint တစ်ခုကို ထူထောင်ပြီး — နောက်ပိုင်းမှာ ဖျက်ဆီးပစ်ဖို့:

```sql
BEGIN;
    INSERT INTO table1 VALUES (3);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (4);
    RELEASE SAVEPOINT my_savepoint;
COMMIT;
```

အပေါ်က transaction က 3 ရော 4 ရော — နှစ်ခုလုံးကို insert လုပ်ပါတယ်။

Savepoint နာမည်တစ်ခုတည်းကို ထပ်ခါထပ်ခါ သုံးဖို့:

```sql
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);

    -- rollback to the second savepoint
    ROLLBACK TO SAVEPOINT my_savepoint;
    SELECT * FROM table1;               -- shows rows 1 and 2

    -- release the second savepoint
    RELEASE SAVEPOINT my_savepoint;

    -- rollback to the first savepoint
    ROLLBACK TO SAVEPOINT my_savepoint;
    SELECT * FROM table1;               -- shows only row 1
COMMIT;
```

အပေါ်က transaction က — row 3 ကို အရင်ဆုံး roll back လုပ်ပြီး — နောက်မှ row 2 ကို ပြန်ဆုတ်သွားတာကို ပြသပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

နာမည်တူ savepoint တစ်ခု ထူထောင်လိုက်တဲ့အခါ — အရင် savepoint ကို အလိုအလျောက် ဖျက်ဆီးပစ်ဖို့ SQL က လိုအပ်ပါတယ်။ PostgreSQL မှာတော့ — savepoint အဟောင်းကို ထိန်းသိမ်းထားပေမယ့် — roll back ဒါမှမဟုတ် release လုပ်တဲ့အခါ — အသစ်ဆုံး savepoint ကိုပဲ သုံးပါတယ်။ (savepoint အသစ်ကို `RELEASE SAVEPOINT` နဲ့ release လုပ်လိုက်ရင် — savepoint အဟောင်းက `ROLLBACK TO SAVEPOINT` နဲ့ `RELEASE SAVEPOINT` တွေအတွက် နောက်တစ်ကြိမ် ဝင်ရောက်လို့ ရလာပါလိမ့်မယ်။) ဒါကလွဲလို့ — `SAVEPOINT` က SQL နဲ့ အပြည့်အဝ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [COMMIT](/docs/postgresql/sql-commit), [RELEASE SAVEPOINT](https://www.postgresql.org/docs/current/sql-release-savepoint.html), [ROLLBACK](/docs/postgresql/sql-rollback), [ROLLBACK TO SAVEPOINT](https://www.postgresql.org/docs/current/sql-rollback-to.html)
