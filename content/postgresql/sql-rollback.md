---
title: "ROLLBACK (transaction တစ်ခုကို ပယ်ဖျက်ခြင်း)"
description: "လက်ရှိ transaction ကို roll back လုပ်ပြီး — transaction အတွင်း ပြုလုပ်ခဲ့သော update များ အားလုံးကို ပယ်ဖျက်ပေးသည့် ROLLBACK ၏ syntax နှင့် parameters (WORK/TRANSACTION, AND CHAIN)၊ transaction block အပြင်တွင် အပြုအမူနှင့် SQL standard လိုက်ဖက်ညီမှု"
order: 160
source: "https://www.postgresql.org/docs/current/sql-rollback.html"
status: translated
updated: 2026-09-04
---

## ROLLBACK (transaction တစ်ခုကို ပယ်ဖျက်ခြင်း)

ROLLBACK — လက်ရှိ transaction ကို ပယ်ဖျက်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ROLLBACK [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ROLLBACK` က လက်ရှိ transaction ကို roll back လုပ်ပေးပြီး — အဲဒီ transaction က ပြုလုပ်ခဲ့တဲ့ update တွေ အားလုံးကို ပယ်ဖျက်ပစ်ပါတယ်။

## Parameters (parameter များ)

- **WORK, TRANSACTION** — Optional (ရွေးချယ်နိုင်သော) key words တွေပါ။ သူတို့မှာ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။
- **AND CHAIN** — `AND CHAIN` ကို သတ်မှတ်ထားရင် — ပြီးဆုံးသွားတဲ့ transaction ရဲ့ သတ်မှတ်ချက်တွေ (transaction characteristics) နဲ့ အတူတူပဲ ရှိတဲ့ — abort မလုပ်ရသေးတဲ့ transaction အသစ်တစ်ခုကို ချက်ချင်း စတင်ပါတယ် (SET TRANSACTION ကို ကြည့်ပါ)။ ဒါမှမဟုတ်ရင် — transaction အသစ် ဘာမှ မစတင်ပါဘူး။

## Notes (မှတ်စုများ)

Transaction တစ်ခုကို အောင်မြင်စွာ အဆုံးသတ်ဖို့ [`COMMIT`](/docs/postgresql/sql-commit) ကို သုံးပါ။

Transaction block အပြင်မှာ `ROLLBACK` ကို ထုတ်ပေးရင် warning တစ်ခု ထုတ်လွှတ်ပြီး — တခြား ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ Transaction block အပြင်မှာ `ROLLBACK AND CHAIN` ကိုတော့ error တစ်ခုပါ။

## Examples (ဥပမာများ)

ပြောင်းလဲမှုတွေ အားလုံးကို ပယ်ဖျက်ဖို့:

```sql
ROLLBACK;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ROLLBACK` command က SQL standard နဲ့ ကိုက်ညီပါတယ်။ `ROLLBACK TRANSACTION` ဆိုတဲ့ ပုံစံကတော့ PostgreSQL extension တစ်ခုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [COMMIT](/docs/postgresql/sql-commit), [ROLLBACK TO SAVEPOINT](https://www.postgresql.org/docs/current/sql-rollback-to.html)
