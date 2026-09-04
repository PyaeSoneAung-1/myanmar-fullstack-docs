---
title: "RELEASE SAVEPOINT (ယခင် သတ်မှတ်ထားသော savepoint တစ်ခုကို release လုပ်ခြင်း)"
description: "အရင်က သတ်မှတ်ထားသော savepoint တစ်ခုကို release လုပ်ပြီး — savepoint နောက်ပိုင်း ဖန်တီးခဲ့သော savepoint များနှင့် ၎င်းတို့၏ resources များကို လွှတ်ပေးသည့် command — release ပြီးနောက် ပြောင်းလဲမှုများ ပေါင်းစည်းခြင်း၊ aborted state တွင် မဖြစ်နိုင်ခြင်း၊ နာမည်တူ savepoint များ၏ အပြုအမူ၊ SQL standard လိုက်ဖက်ညီမှုအကြောင်း"
order: 242
source: "https://www.postgresql.org/docs/current/sql-release-savepoint.html"
status: translated
updated: 2026-09-04
---

## RELEASE SAVEPOINT (ယခင် သတ်မှတ်ထားသော savepoint တစ်ခုကို release လုပ်ခြင်း)

RELEASE SAVEPOINT — ယခင် သတ်မှတ်ထားသော savepoint တစ်ခုကို release လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
RELEASE [ SAVEPOINT ] savepoint_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`RELEASE SAVEPOINT` က သတ်မှတ်ထားတဲ့ savepoint နဲ့ — ထို savepoint နာမည်ကို သတ်မှတ်ပြီးနောက်မှာ ဖန်တီးခဲ့တဲ့ — တက်ကြွနေတဲ့ savepoints တွေ အားလုံးကို release လုပ်ပြီး — ၎င်းတို့ရဲ့ resources တွေကို လွှတ်ပေးပါတယ်။ Savepoint ကို ဖန်တီးပြီးကတည်းက ပြုလုပ်ခဲ့ပြီး — အရင်ကတည်းက roll back မဖြစ်ခဲ့ရတဲ့ — ပြောင်းလဲမှုတွေ အားလုံးကို — သတ်မှတ်ထားတဲ့ savepoint ကို ဖန်တီးချိန်မှာ တက်ကြွနေခဲ့တဲ့ — transaction ဒါမှမဟုတ် savepoint ထဲကို ပေါင်းစည်းလိုက်ပါတယ်။ `RELEASE SAVEPOINT` ပြီးနောက်မှာ ပြုလုပ်တဲ့ ပြောင်းလဲမှုတွေကလည်း — ဒီ တက်ကြွနေတဲ့ transaction ဒါမှမဟုတ် savepoint ရဲ့ အစိတ်အပိုင်း ဖြစ်လာပါလိမ့်မယ်။

## Parameters (parameter များ)

- **savepoint_name** — Release လုပ်ရမယ့် savepoint ရဲ့ နာမည်ပါ။

## Notes (မှတ်စုများ)

အရင်က သတ်မှတ်မထားတဲ့ savepoint နာမည်တစ်ခုကို သတ်မှတ်ပေးတာက error တစ်ခု ဖြစ်ပါတယ်။

Transaction က aborted state (ဖျက်သိမ်းပြီး အခြေအနေ) ထဲမှာ ရှိနေချိန်မှာ savepoint တစ်ခုကို release လုပ်လို့ မရပါဘူး; အဲဒါကို လုပ်ဖို့ [ROLLBACK TO SAVEPOINT](/docs/postgresql/sql-rollback-to) ကို သုံးပါ။

Savepoint အများအပြားမှာ နာမည်တူ ရှိနေရင် — release မလုပ်ရသေးတဲ့ — အသစ်ဆုံး သတ်မှတ်ခဲ့တဲ့ savepoint ကိုပဲ release လုပ်ပါတယ်။ Command တွေကို ထပ်ခါထပ်ခါ ထုတ်ပေးတာက — တစ်ခုပြီးတစ်ခု — ပိုအသက်ကြီးတဲ့ savepoints တွေကို release လုပ်ပေးပါလိမ့်မယ်။

## Examples (ဥပမာများ)

Savepoint တစ်ခုကို ထူထောင်ပြီး — နောက်ပိုင်းမှာ release လုပ်ဖို့:

```sql
BEGIN;
    INSERT INTO table1 VALUES (3);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (4);
    RELEASE SAVEPOINT my_savepoint;
COMMIT;
```

အပေါ်က transaction က 3 ရော 4 ရော — နှစ်ခုလုံးကို insert လုပ်ပါလိမ့်မယ်။

Nested subtransactions အများအပြား ပါဝင်တဲ့ ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခု:

```sql
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT sp1;
    INSERT INTO table1 VALUES (2);
    SAVEPOINT sp2;
    INSERT INTO table1 VALUES (3);
    RELEASE SAVEPOINT sp2;
    INSERT INTO table1 VALUES (4))); -- generates an error
```

ဒီဥပမာမှာ — application က — 3 ကို insert လုပ်ခဲ့တဲ့ — `sp2` savepoint ရဲ့ release ကို တောင်းဆိုပါတယ်။ ဒါက insert ရဲ့ transaction context (အကြောင်းအရာ အနေအထား) ကို `sp1` အဖြစ် ပြောင်းလဲစေပါတယ်။ တန်ဖိုး 4 ကို insert လုပ်ဖို့ ကြိုးစားတဲ့ statement က error တစ်ခု ထုတ်ပေးတဲ့အခါ — 2 နဲ့ 4 တို့ရဲ့ insert တွေက ဆုံးရှုံးသွားပါတယ် — အကြောင်းကတော့ ၎င်းတို့ နှစ်ခုလုံးက — အခု roll back ဖြစ်သွားပြီဖြစ်တဲ့ — savepoint တစ်ခုတည်းထဲမှာ ရှိနေပြီး — 3 ကတော့ — transaction context တစ်ခုတည်းထဲမှာ ရှိနေလို့ပါ။ Application က အခုဆိုရင် — အောက်ပါ command နှစ်ခုထဲက တစ်ခုကိုပဲ ရွေးချယ်နိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ အခြား command တွေ အားလုံးကို လျစ်လျူရှုခံရမှာ ဖြစ်လို့ပါ:

```sql
ROLLBACK;
ROLLBACK TO SAVEPOINT sp1;
```

`ROLLBACK` ကို ရွေးချယ်တာက — တန်ဖိုး 1 အပါအဝင် — အရာအားလုံးကို ဖျက်သိမ်းပစ်မှာ ဖြစ်ပြီး — `ROLLBACK TO SAVEPOINT sp1` ကတော့ — တန်ဖိုး 1 ကို ထိန်းသိမ်းထားပြီး — transaction ကို ဆက်လက် လုပ်ဆောင်ခွင့် ပြုပါလိမ့်မယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ်။ Standard က `SAVEPOINT` ဆိုတဲ့ key word ကို မဖြစ်မနေ သုံးရန် သတ်မှတ်ထားပေမယ့် — PostgreSQL ကတော့ ၎င်းကို ချန်လိုက်တာကို ခွင့်ပြုပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [COMMIT](/docs/postgresql/sql-commit), [ROLLBACK](/docs/postgresql/sql-rollback), [ROLLBACK TO SAVEPOINT](/docs/postgresql/sql-rollback-to), [SAVEPOINT](/docs/postgresql/sql-savepoint)
