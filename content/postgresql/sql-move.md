---
title: "MOVE (cursor တစ်ခုကို နေရာချခြင်း)"
description: "Data များကို ပြန်လည်ရယူခြင်း မပြုဘဲ cursor တစ်ခု၏ အနေအထားကို ပြောင်းရွှေ့ခြင်း — FETCH နှင့် တူညီသော parameters များ (direction ပုံစံများ, count, cursor_name)၊ command tag output (MOVE count) နှင့် ဥပမာများ"
order: 190
source: "https://www.postgresql.org/docs/current/sql-move.html"
status: translated
updated: 2026-09-04
---

## MOVE (cursor တစ်ခုကို နေရာချခြင်း)

MOVE — cursor တစ်ခုကို နေရာချပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
MOVE [ direction ] [ FROM | IN ] cursor_name

where direction can be one of:

    NEXT
    PRIOR
    FIRST
    LAST
    ABSOLUTE count
    RELATIVE count
    count
    ALL
    FORWARD
    FORWARD count
    FORWARD ALL
    BACKWARD
    BACKWARD count
    BACKWARD ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`MOVE` က data တွေ ဘာမှ ပြန်လည်ရယူခြင်း မရှိဘဲ — cursor တစ်ခုကို နေရာချရန် ရွှေ့ပြောင်းပေးပါတယ်။ `MOVE` က `FETCH` command လိုပဲ အတိအကျ အလုပ်လုပ်ပါတယ် — cursor ကို နေရာချပေးရုံပဲ ရှိပြီး — rows တွေကို ပြန်မပို့တာ ကလွဲလို့ပါ။

`MOVE` command ရဲ့ parameters တွေက `FETCH` command ရဲ့ဟာတွေနဲ့ အတူတူပဲ ဖြစ်ပါတယ်; syntax နဲ့ အသုံးပြုပုံ အသေးစိတ်အတွက် [FETCH](/docs/postgresql/sql-fetch) ကို ကိုးကားပါ။

## Outputs (output များ)

အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ — `MOVE` command တစ်ခုက အောက်ပါပုံစံ ရှိတဲ့ command tag တစ်ခုကို ပြန်ပို့ပါတယ်

```sql
MOVE count
```

`count` ဆိုတာ — parameters တွေ အတူတူနဲ့ `FETCH` command တစ်ခုက ပြန်ပို့ခဲ့မယ့် rows အရေအတွက်ပါ (zero လည်း ဖြစ်နိုင်ပါတယ်)။

## Examples (ဥပမာများ)

ဒီဥပမာမှာ — ပထမ rows 5 ခုကို ကျော်လိုက်ပြီး — cursor ကနေ ဆဋ္ဌမမြောက် row ကို ပြန်ယူထားပါတယ်:

```sql
BEGIN WORK;
DECLARE liahona CURSOR FOR SELECT * FROM films;

-- Skip the first 5 rows:
MOVE FORWARD 5 IN liahona;
MOVE 5

-- Fetch the 6th row from the cursor liahona:
FETCH 1 FROM liahona;
 code  | title  | did | date_prod  |  kind  |  len
-------+--------+-----+------------+--------+-------
 P_303 | 48 Hrs | 103 | 1982-10-22 | Action | 01:37
(1 row)

-- Close the cursor liahona and end the transaction:
CLOSE liahona;
COMMIT WORK;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `MOVE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CLOSE](/docs/postgresql/sql-close), [DECLARE](/docs/postgresql/sql-declare), [FETCH](/docs/postgresql/sql-fetch)
