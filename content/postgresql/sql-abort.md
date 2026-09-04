---
title: "ABORT (transaction တစ်ခုကို ပယ်ဖျက်ခြင်း)"
description: "လက်ရှိ transaction ကို roll back လုပ်ပြီး — transaction အတွင်း ပြုလုပ်ခဲ့တဲ့ update တွေ အားလုံးကို ပယ်ဖျက်ပေးတဲ့ command — standard SQL command ဖြစ်တဲ့ ROLLBACK နဲ့ အပြုအမူ အတူတူပဲ ရှိပြီး သမိုင်းကြောင်းဆိုင်ရာ အကြောင်းပြချက်တွေကြောင့် ရှိနေတဲ့ PostgreSQL extension"
order: 208
source: "https://www.postgresql.org/docs/current/sql-abort.html"
status: translated
updated: 2026-09-04
---

## ABORT (transaction တစ်ခုကို ပယ်ဖျက်ခြင်း)

ABORT — လက်ရှိ transaction ကို ပယ်ဖျက်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ABORT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ABORT` က လက်ရှိ transaction ကို roll back လုပ်ပြီး — အဲဒီ transaction က ပြုလုပ်ခဲ့တဲ့ update တွေ အားလုံးကို ပယ်ဖျက်ပစ်ပါတယ်။ ဒီ command က standard SQL command ဖြစ်တဲ့ [`ROLLBACK`](/docs/postgresql/sql-rollback) နဲ့ အပြုအမူ အတူတူပဲ ဖြစ်ပြီး — သမိုင်းကြောင်းဆိုင်ရာ အကြောင်းပြချက်တွေကြောင့်သာ ရှိနေတာပါ။

## Parameters (parameter များ)

- **WORK**, **TRANSACTION** — Optional ဖြစ်တဲ့ key words တွေပါ။ သူတို့က ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။
- **AND CHAIN** — `AND CHAIN` ကို သတ်မှတ်ထားရင် — ပြီးဆုံးသွားတဲ့ transaction ရဲ့ transaction characteristics တွေ အတိုင်းပဲ (SET TRANSACTION ကို ကြည့်ပါ) — transaction အသစ်တစ်ခုကို ချက်ချင်း စတင်ပါတယ်။ မဟုတ်ရင် — transaction အသစ် မစတင်ပါဘူး။

## Notes (မှတ်စုများ)

Transaction တစ်ခုကို အောင်မြင်စွာ အဆုံးသတ်ဖို့ [COMMIT](/docs/postgresql/sql-commit) ကို သုံးပါ။

Transaction block အပြင်မှာ `ABORT` ကို ထုတ်ပေးရင် — warning တစ်ခု ထုတ်လွှတ်ပြီး — တခြား ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Examples (ဥပမာများ)

ပြောင်းလဲမှုတွေ အားလုံးကို ပယ်ဖျက်ဖို့:

```sql
ABORT;
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က သမိုင်းကြောင်းဆိုင်ရာ အကြောင်းပြချက်တွေကြောင့် ရှိနေတဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ `ROLLBACK` ကတော့ ညီမျှတဲ့ standard SQL command ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [COMMIT](/docs/postgresql/sql-commit), [ROLLBACK](/docs/postgresql/sql-rollback)
