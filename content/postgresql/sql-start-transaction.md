---
title: "START TRANSACTION (transaction block စတင်ခြင်း)"
description: "Transaction block အသစ်တစ်ခုကို စတင်ပေးတဲ့ command — BEGIN ရဲ့ SQL-standard ညီမျှပုံစံဖြစ်ပြီး — ISOLATION LEVEL, READ WRITE/READ ONLY, DEFERRABLE စတဲ့ transaction modes တွေကို တစ်ပြိုင်နက် သတ်မှတ်လို့ ရပါတယ် — SQL standard ရဲ့ autocommit အပြုအမူနဲ့ DEFERRABLE extension အကြောင်း"
order: 206
source: "https://www.postgresql.org/docs/current/sql-start-transaction.html"
status: translated
updated: 2026-09-04
---

## START TRANSACTION (transaction block စတင်ခြင်း)

START TRANSACTION — transaction block တစ်ခုကို စတင်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
START TRANSACTION [ transaction_mode [, ...] ]

where transaction_mode is one of:

    ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED }
    READ WRITE | READ ONLY
    [ NOT ] DEFERRABLE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

ဒီ command က transaction block အသစ်တစ်ခုကို စတင်ပေးပါတယ်။ Isolation level ၊ read/write mode ဒါမှမဟုတ် deferrable mode ကို သတ်မှတ်ထားရင် — [`SET TRANSACTION`](/docs/postgresql/sql-set-transaction) ကို execute လုပ်လိုက်သလိုပဲ — transaction အသစ်က အဲဒီ လက္ခဏာတွေနဲ့ ဖြစ်လာပါတယ်။ ဒါက [`BEGIN`](/docs/postgresql/sql-begin) command နဲ့ အတူတူပဲ ဖြစ်ပါတယ်။

## Parameters (parameter များ)

ဒီ statement ရဲ့ parameters တွေရဲ့ အဓိပ္ပါယ်အတွက် [SET TRANSACTION](/docs/postgresql/sql-set-transaction) ကို ကိုးကားကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard အရတော့ — transaction block တစ်ခု စတင်ဖို့ `START TRANSACTION` ကို ထုတ်ပေးဖို့ မလိုအပ်ပါဘူး: SQL command တိုင်းက block တစ်ခုကို implicitly (သွယ်ဝိုက်၍) စတင်ပေးပါတယ်။ PostgreSQL ရဲ့ အပြုအမူကို — `START TRANSACTION` (ဒါမှမဟုတ် `BEGIN`) နောက်မှာ မပါတဲ့ command တစ်ခုစီ ပြီးဆုံးတိုင်း — `COMMIT` တစ်ခုကို implicitly ထုတ်ပေးနေသလိုမျိုး မြင်နိုင်ပြီး — အဲဒါကြောင့် မကြာခဏဆိုသလို “autocommit” လို့ ခေါ်ဝေါ်ပါတယ်။ တခြား relational database systems တွေကလည်း — အဆင်ပြေစေဖို့အတွက် autocommit feature တစ်ခုကို ပေးထားနိုင်ပါတယ်။

`DEFERRABLE` `transaction_mode` ကတော့ PostgreSQL language extension (PostgreSQL မှာပဲ ပါဝင်တဲ့ ထပ်ဆောင်း လုပ်ဆောင်ချက်) တစ်ခု ဖြစ်ပါတယ်။

SQL standard က ဆက်တိုက်လာတဲ့ `transaction_modes` တွေကြားမှာ commas တွေ ထည့်ဖို့ လိုအပ်ပါတယ် — ဒါပေမယ့် သမိုင်းကြောင်းဆိုင်ရာ အကြောင်းပြချက်တွေကြောင့် — PostgreSQL က commas တွေကို ချန်လိုက်တာကိုပါ ခွင့်ပြုပါတယ်။

[SET TRANSACTION](/docs/postgresql/sql-set-transaction) ရဲ့ compatibility section ကိုလည်း ကြည့်ပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[BEGIN](/docs/postgresql/sql-begin), [COMMIT](/docs/postgresql/sql-commit), [ROLLBACK](/docs/postgresql/sql-rollback), [SAVEPOINT](/docs/postgresql/sql-savepoint), [SET TRANSACTION](/docs/postgresql/sql-set-transaction)
