---
title: "COMMIT (transaction တစ်ခုကို အောင်မြင်စွာ အဆုံးသတ်ခြင်း)"
description: "လက်ရှိ transaction ကို commit လုပ်ပြီး အပြောင်းအလဲတွေ အားလုံးကို တခြားသူတွေ မြင်နိုင်ပြီး durable ဖြစ်စေတဲ့ command — WORK/TRANSACTION နဲ့ AND [NO] CHAIN options အကြောင်း"
order: 159
source: "https://www.postgresql.org/docs/current/sql-commit.html"
status: translated
updated: 2026-09-04
---

## COMMIT (transaction တစ်ခုကို အောင်မြင်စွာ အဆုံးသတ်ခြင်း)

COMMIT — လက်ရှိ transaction ကို commit လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
COMMIT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`COMMIT` က လက်ရှိ transaction ကို commit လုပ်ပါတယ်။ Transaction က လုပ်လိုက်တဲ့ ပြောင်းလဲမှုတွေ အားလုံးကို တခြားသူတွေ မြင်နိုင်သွားပြီး — crash တစ်ခု ဖြစ်ခဲ့ရင်တောင် durable (တည်မြဲ) ဖြစ်မယ်လို့ အာမခံပါတယ်။

## Parameters (parameter များ)

- **WORK**, **TRANSACTION** — Optional ဖြစ်တဲ့ key words တွေပါ။ သူတို့က ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။
- **AND CHAIN** — `AND CHAIN` ကို သတ်မှတ်ထားရင် — ပြီးဆုံးသွားတဲ့ transaction ရဲ့ transaction characteristics တွေ အတိုင်းပဲ (SET TRANSACTION ကို ကြည့်ပါ) — transaction အသစ်တစ်ခုကို ချက်ချင်း စတင်ပါတယ်။ မဟုတ်ရင် — transaction အသစ် မစတင်ပါဘူး။

## Notes (မှတ်စုများ)

Transaction တစ်ခုကို ပယ်ဖျက်ဖို့ [ROLLBACK](/docs/postgresql/sql-rollback) ကို သုံးပါ။

Transaction တစ်ခုအတွင်းမှာ မဟုတ်ဘဲ `COMMIT` ကို ထုတ်ပေးရင် — ဘာအန္တရာယ်မှ မရှိပေမယ့် — warning message တစ်ခုတော့ ပေါ်လာပါလိမ့်မယ်။ Transaction တစ်ခုအတွင်းမှာ မဟုတ်ဘဲ `COMMIT AND CHAIN` ကိုတော့ error တစ်ခု ဖြစ်ပါတယ်။

## Examples (ဥပမာများ)

လက်ရှိ transaction ကို commit လုပ်ပြီး အပြောင်းအလဲတွေ အားလုံးကို အပြီးအပိုင် (permanent) ဖြစ်စေဖို့:

```sql
COMMIT;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`COMMIT` command က SQL standard နဲ့ ကိုက်ညီပါတယ်။ `COMMIT TRANSACTION` ဆိုတဲ့ ပုံစံကတော့ PostgreSQL extension (PostgreSQL မှာပဲ ပါဝင်တဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [ROLLBACK](/docs/postgresql/sql-rollback)
