---
title: "ROLLBACK PREPARED (two-phase commit အတွက် ကြိုပြင်ဆင်ထားသော transaction တစ်ခုကို ပယ်ဖျက်ခြင်း)"
description: "Two-phase commit အတွက် အရင်က ပြင်ဆင်ထားသော transaction တစ်ခုကို roll back လုပ်ပေးသည့် command — prepared state ရှိ transaction ကို ပယ်ဖျက်ခြင်း၊ လိုအပ်သော အခွင့်အရေးများ၊ transaction block အပြင်မှ ထုတ်ပေးရမည့် ကန့်သတ်ချက်၊ pg_prepared_xacts system view အကြောင်း"
order: 241
source: "https://www.postgresql.org/docs/current/sql-rollback-prepared.html"
status: translated
updated: 2026-09-04
---

## ROLLBACK PREPARED (two-phase commit အတွက် ကြိုပြင်ဆင်ထားသော transaction တစ်ခုကို ပယ်ဖျက်ခြင်း)

ROLLBACK PREPARED — two-phase commit အတွက် အရင်က ပြင်ဆင်ထားခဲ့တဲ့ transaction တစ်ခုကို ပယ်ဖျက်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ROLLBACK PREPARED transaction_id
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ROLLBACK PREPARED` က prepared state ထဲမှာ ရှိနေတဲ့ transaction တစ်ခုကို roll back လုပ်ပေးပါတယ်။

## Parameters (parameter များ)

- **transaction_id** — Roll back လုပ်ရမယ့် transaction ရဲ့ transaction identifier ပါ။

## Notes (မှတ်စုများ)

Prepared transaction တစ်ခုကို roll back လုပ်ဖို့ — သင်ဟာ မူရင်း transaction ကို execute လုပ်ခဲ့တဲ့ user နဲ့ တူညီတဲ့ user ဒါမှမဟုတ် superuser တစ်ယောက် ဖြစ်ရပါမယ်။ ဒါပေမယ့် — transaction ကို execute လုပ်ခဲ့တဲ့ session တစ်ခုတည်းထဲမှာ ရှိနေဖို့တော့ မလိုအပ်ပါဘူး။

ဒီ command ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။ Prepared transaction ကို ချက်ချင်း roll back လုပ်လိုက်ပါတယ်။

လက်ရှိ ရရှိနိုင်တဲ့ prepared transactions တွေ အားလုံးကို — [`pg_prepared_xacts`](https://www.postgresql.org/docs/current/view-pg-prepared-xacts.html) system view ထဲမှာ စာရင်းပြုထားပါတယ်။

## Examples (ဥပမာများ)

`foobar` ဆိုတဲ့ transaction identifier နဲ့ သတ်မှတ်ထားတဲ့ transaction ကို roll back လုပ်ဖို့:

```sql
ROLLBACK PREPARED 'foobar';
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ROLLBACK PREPARED` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ ၎င်းကို external transaction management systems တွေမှာ သုံးဖို့ ရည်ရွယ်ထားပါတယ် — အဲဒီ system တွေထဲက တချို့ကို standards တွေ (ဥပမာ X/Open XA) နဲ့ လွှမ်းခြုံထားပေမယ့် — အဲဒီ system တွေရဲ့ SQL ဘက်ခြမ်းကတော့ standard သတ်မှတ်ခြင်း မခံရပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[PREPARE TRANSACTION](/docs/postgresql/sql-prepare-transaction), [COMMIT PREPARED](/docs/postgresql/sql-commit-prepared)
