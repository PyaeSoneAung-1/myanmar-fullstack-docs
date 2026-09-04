---
title: "BEGIN (transaction block စတင်ခြင်း)"
description: "Transaction block တစ်ခုကို စတင်ပေးတဲ့ command — BEGIN နောက်မှာ ပါတဲ့ statement တွေ အားလုံးကို transaction တစ်ခုတည်းထဲမှာ execute လုပ်ပြီး COMMIT/ROLLBACK ပေးတဲ့အထိ ဆက်သွားပါတယ် — transaction_mode (ISOLATION LEVEL, READ WRITE/READ ONLY, DEFERRABLE) နဲ့ START TRANSACTION alias အကြောင်း"
order: 158
source: "https://www.postgresql.org/docs/current/sql-begin.html"
status: translated
updated: 2026-09-04
---

## BEGIN (transaction block စတင်ခြင်း)

BEGIN — transaction block တစ်ခုကို စတင်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
BEGIN [ WORK | TRANSACTION ] [ transaction_mode [, ...] ]

where transaction_mode is one of:

    ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED }
    READ WRITE | READ ONLY
    [ NOT ] DEFERRABLE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`BEGIN` က transaction block တစ်ခုကို စတင်ပေးပါတယ် — ဆိုလိုတာက — `BEGIN` command ပြီးနောက်က statement တွေ အားလုံးကို — explicit ဖြစ်တဲ့ [`COMMIT`](/docs/postgresql/sql-commit) ဒါမှမဟုတ် [`ROLLBACK`](/docs/postgresql/sql-rollback) ပေးလိုက်တဲ့အထိ — transaction တစ်ခုတည်းထဲမှာ execute လုပ်ပါတယ်။ Default အနေနဲ့ (`BEGIN` မပါဘဲ) — PostgreSQL က transaction တွေကို “autocommit” mode နဲ့ execute လုပ်ပါတယ် — ဆိုလိုတာက statement တစ်ခုချင်းစီကို ကိုယ်ပိုင် transaction တစ်ခုထဲမှာ execute လုပ်ပြီး — statement ရဲ့ အဆုံးမှာ commit ကို implicitly (သွယ်ဝိုက်၍) လုပ်ပေးပါတယ် (execute လုပ်တာ အောင်မြင်ခဲ့ရင် — မအောင်မြင်ခဲ့ရင်တော့ rollback လုပ်ပါတယ်)။

Statement တွေက transaction block ထဲမှာ ပိုမြန်မြန် execute လုပ်ပါတယ် — ဘာလို့လဲဆိုတော့ transaction စတင်ခြင်း/commit လုပ်ခြင်းက CPU နဲ့ disk လုပ်ဆောင်မှု သိသိသာသာ လိုအပ်လို့ပါ။ Transaction တစ်ခုထဲမှာ statement အများအပြား execute လုပ်တာက — ဆက်စပ်နေတဲ့ ပြောင်းလဲမှုတွေ အများအပြား လုပ်တဲ့အခါ consistency (တစ်သမတ်တည်း ဖြစ်မှု) သေချာစေဖို့လည်း အသုံးဝင်ပါတယ်: ဆက်စပ်နေတဲ့ update တွေ အားလုံး မပြီးသေးတဲ့ ကြားအခြေအနေတွေကို တခြား session တွေ မြင်နိုင်မှာ မဟုတ်ပါဘူး။

Isolation level, read/write mode ဒါမှမဟုတ် deferrable mode ကို သတ်မှတ်ထားရင် — [`SET TRANSACTION`](/docs/postgresql/sql-set-transaction) ကို execute လုပ်လိုက်သလိုပဲ — transaction အသစ်က အဲဒီ လက္ခဏာတွေနဲ့ ဖြစ်ပါတယ်။

## Parameters (parameter များ)

- **WORK**, **TRANSACTION** — Optional ဖြစ်တဲ့ key words တွေပါ။ သူတို့က ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

ဒီ statement ရဲ့ တခြား parameters တွေရဲ့ အဓိပ္ပါယ်အတွက် [SET TRANSACTION](/docs/postgresql/sql-set-transaction) ကို ကိုးကားကြည့်ပါ။

## Notes (မှတ်စုများ)

[`START TRANSACTION`](https://www.postgresql.org/docs/current/sql-start-transaction.html) က `BEGIN` နဲ့ လုပ်ဆောင်ချက် အတူတူပါပဲ။

Transaction block တစ်ခုကို အဆုံးသတ်ဖို့ [`COMMIT`](/docs/postgresql/sql-commit) ဒါမှမဟုတ် [`ROLLBACK`](/docs/postgresql/sql-rollback) ကို သုံးပါ။

Transaction block တစ်ခုထဲမှာ ရှိနေပြီးသား အချိန်မှာ `BEGIN` ကို ထုတ်ပေးရင် — warning message တစ်ခု ပေါ်လာပါလိမ့်မယ်။ Transaction ရဲ့ state ကိုတော့ သက်ရောက်မှု မရှိပါဘူး။ Transaction block တစ်ခုအတွင်းမှာ transactions တွေကို nest (အသိုက်အမြှုပ်) လုပ်ဖို့ — savepoints တွေကို သုံးပါ ([SAVEPOINT](/docs/postgresql/sql-savepoint) ကို ကြည့်ပါ)။

နောက်ပြန် လိုက်ဖက်ညီမှု (backwards compatibility) အကြောင်းပြချက်တွေကြောင့် — ဆက်တိုက်လာတဲ့ `transaction_modes` တွေကြားက commas တွေကို ချန်လိုက်လို့ ရပါတယ်။

## Examples (ဥပမာများ)

Transaction block တစ်ခု စတင်ဖို့:

```sql
BEGIN;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`BEGIN` က PostgreSQL language extension (PostgreSQL မှာပဲ ပါဝင်တဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။ ဒါက SQL-standard command ဖြစ်တဲ့ [`START TRANSACTION`](https://www.postgresql.org/docs/current/sql-start-transaction.html) နဲ့ ညီမျှပြီး — အဲဒီ reference page မှာ နောက်ထပ် compatibility အချက်အလက်တွေ ပါဝင်ပါတယ်။

`DEFERRABLE` `transaction_mode` ကတော့ PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ်။

စကားစပ်အားဖြင့် — `BEGIN` key word ကို embedded SQL မှာ မတူညီတဲ့ ရည်ရွယ်ချက်တစ်ခုအတွက် သုံးပါတယ်။ Database applications တွေကို port (ပြောင်းရွှေ့) လုပ်တဲ့အခါ transaction semantics တွေကို သတိထားဖို့ အကြံပြုလိုပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[COMMIT](/docs/postgresql/sql-commit), [ROLLBACK](/docs/postgresql/sql-rollback), [START TRANSACTION](https://www.postgresql.org/docs/current/sql-start-transaction.html), [SAVEPOINT](/docs/postgresql/sql-savepoint)
