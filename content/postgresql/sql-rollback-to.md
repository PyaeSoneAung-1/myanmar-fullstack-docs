---
title: "ROLLBACK TO SAVEPOINT (savepoint တစ်ခုဆီ ပြန်ဆုတ်ခြင်း)"
description: "Savepoint တစ်ခုကို ထူထောင်ပြီးနောက်မှာ execute လုပ်ခဲ့သော command များ အားလုံးကို roll back လုပ်ပေးသည့် command — subtransaction အသစ်တစ်ခု စတင်ခြင်း၊ savepoint နောက်ပိုင်း သတ်မှတ်ခဲ့သော savepoints များကို ဖျက်ဆီးခြင်း၊ cursor များပေါ်ရှိ အပြုအမူ၊ SQL standard နှင့် ကွာခြားချက်များအကြောင်း"
order: 243
source: "https://www.postgresql.org/docs/current/sql-rollback-to.html"
status: translated
updated: 2026-09-04
---

## ROLLBACK TO SAVEPOINT (savepoint တစ်ခုဆီ ပြန်ဆုတ်ခြင်း)

ROLLBACK TO SAVEPOINT — savepoint တစ်ခုဆီ ပြန်ဆုတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ROLLBACK [ WORK | TRANSACTION ] TO [ SAVEPOINT ] savepoint_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

Savepoint ကို ထူထောင်ပြီးနောက်မှာ execute လုပ်ခဲ့တဲ့ command တွေ အားလုံးကို roll back လုပ်ပြီး — တူညီတဲ့ transaction level မှာ — subtransaction (လက်အောက်ခံ transaction) အသစ်တစ်ခုကို စတင်ပါတယ်။ Savepoint က တရားဝင် (valid) ဖြစ်နေဆဲ ဖြစ်ပြီး — လိုအပ်ရင် — နောက်ပိုင်းမှာ နောက်တစ်ကြိမ် ထပ်ပြီး roll back လုပ်လို့ ရပါသေးတယ်။

`ROLLBACK TO SAVEPOINT` က — သတ်မှတ်ထားတဲ့ savepoint ပြီးနောက်မှာ ထူထောင်ခဲ့တဲ့ — savepoints တွေ အားလုံးကို သွယ်ဝိုက်၍ (implicitly) ဖျက်ဆီးပစ်ပါတယ်။

## Parameters (parameter များ)

- **savepoint_name** — ပြန်ဆုတ်ရမယ့် savepoint ပါ။

## Notes (မှတ်စုများ)

Savepoint တစ်ခုကို — သူ့ကို ထူထောင်ပြီးနောက်မှာ execute လုပ်ခဲ့တဲ့ command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေကို မစွန့်ပစ်ဘဲ — ဖျက်ဆီးပစ်ဖို့ [`RELEASE SAVEPOINT`](/docs/postgresql/sql-release-savepoint) ကို သုံးပါ။

ထူထောင်မထားရသေးတဲ့ savepoint နာမည်တစ်ခုကို သတ်မှတ်ပေးတာက error တစ်ခု ဖြစ်ပါတယ်။

Cursors တွေက savepoints တွေနဲ့ ပတ်သက်ပြီး — transaction သဘောသဘာဝ အပြည့်အဝ မဟုတ်တဲ့ — အပြုအမူ တစ်ချို့ ရှိပါတယ်။ Savepoint တစ်ခုရဲ့ အတွင်းမှာ ဖွင့်လိုက်တဲ့ cursor တိုင်းက — savepoint ကို roll back လုပ်တဲ့အခါ — ပိတ်ပစ်ခံရပါလိမ့်မယ်။ နောက်ပိုင်းမှာ roll back ခံရမယ့် savepoint တစ်ခုရဲ့ အတွင်းမှာ — အရင်က ဖွင့်ထားပြီးသား cursor တစ်ခုကို `FETCH` ဒါမှမဟုတ် `MOVE` command တစ်ခုက သက်ရောက်မှု ရှိခဲ့ရင် — cursor က `FETCH` က ညွှန်ပြခဲ့တဲ့ နေရာအတိုင်း — ဆက်ရှိနေပါတယ် (ဆိုလိုတာက — `FETCH` ကြောင့် ဖြစ်ပေါ်တဲ့ cursor ရဲ့ ရွေ့လျားမှုကို roll back လုပ်မပေးပါဘူး)။ Cursor တစ်ခုကို ပိတ်လိုက်တာကိုလည်း roll back လုပ်တာက ပြန်မပြောင်းပေးပါဘူး။ ဒါပေမယ့် — cursor ရဲ့ query ကြောင့် ဖြစ်ပေါ်တဲ့ — အခြား side-effects (ဘေးထွက် သက်ရောက်မှုများ) တွေက (ဥပမာ — query က ခေါ်ယူသုံးစွဲတဲ့ volatile functions တွေရဲ့ side-effects) — ၎င်းတို့ ဖြစ်ပေါ်ခဲ့တဲ့ ကာလအတွင်း savepoint တစ်ခုကို နောက်ပိုင်းမှာ roll back လုပ်ခဲ့ရင် — roll back လုပ်ခံရပါတယ်။ ၎င်းရဲ့ execution က transaction တစ်ခုကို abort ဖြစ်စေတဲ့ cursor တစ်ခုကို — cannot-execute state (execute လုပ်လို့မရသော အခြေအနေ) ထဲမှာ ထားလိုက်ပါတယ် — ဒါကြောင့် — transaction ကို `ROLLBACK TO SAVEPOINT` သုံးပြီး ပြန်လည် တည်ဆောက်လို့ ရနိုင်ပေမယ့် — cursor ကိုတော့ နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

## Examples (ဥပမာများ)

`my_savepoint` ကို ထူထောင်ပြီးနောက်မှာ execute လုပ်ခဲ့တဲ့ command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေကို ပျက်ပြယ်စေဖို့:

```sql
ROLLBACK TO SAVEPOINT my_savepoint;
```

Cursor တည်နေရာတွေကို savepoint rollback က သက်ရောက်မှု မရှိပါဘူး:

```sql
BEGIN;

DECLARE foo CURSOR FOR SELECT 1 UNION SELECT 2;

SAVEPOINT foo;

FETCH 1 FROM foo;
 ?column?
----------
        1

ROLLBACK TO SAVEPOINT foo;

FETCH 1 FROM foo;
 ?column?
----------
        2

COMMIT;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က `SAVEPOINT` ဆိုတဲ့ key word ကို မဖြစ်မနေ သုံးရန် သတ်မှတ်ထားပေမယ့် — PostgreSQL နဲ့ Oracle တို့ကတော့ ၎င်းကို ချန်လိုက်တာကို ခွင့်ပြုပါတယ်။ SQL က `ROLLBACK` ပြီးနောက်မှာ noise word (အဓိပ္ပါယ် မရှိသော စကားလုံး) အဖြစ် — `WORK` ကိုပဲ ခွင့်ပြုပြီး — `TRANSACTION` ကို ခွင့်မပြုပါဘူး။ ဒါ့အပြင် — SQL မှာ PostgreSQL က လောလောဆယ် မထောက်ပံ့ရသေးတဲ့ — optional clause `AND [ NO ] CHAIN` တစ်ခု ရှိပါတယ်။ ဒါတွေကလွဲလို့ — ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [COMMIT](/docs/postgresql/sql-commit), [RELEASE SAVEPOINT](/docs/postgresql/sql-release-savepoint), [ROLLBACK](/docs/postgresql/sql-rollback), [SAVEPOINT](/docs/postgresql/sql-savepoint)
