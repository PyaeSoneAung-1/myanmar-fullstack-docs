---
title: "SELECT Output Columns (SELECT output column များ)"
description: "SELECT output list ထဲမှ unspecified-type literal များ၏ type ကို text အဖြစ် ဖြေရှင်းပုံ — UNION ၊ INSERT ... SELECT ၊ RETURNING အခြေအနေများအတွက် ခြွင်းချက်များ"
order: 104
source: "https://www.postgresql.org/docs/current/typeconv-select.html"
status: translated
updated: 2026-09-03
---

## 10.6. SELECT Output Columns (SELECT output column များ)

ရှေ့ပိုင်း section တွေမှာ ဖော်ပြထားတဲ့ စည်းမျဉ်းတွေက — SQL query တစ်ခုထဲက expression အားလုံးကို `unknown` မဟုတ်တဲ့ data type တွေ သတ်မှတ်ပေးမှာ ဖြစ်ပြီး — `SELECT` command တစ်ခုရဲ့ ရိုးရိုး output column (ရလဒ် column) တွေ အဖြစ် ပေါ်လာတဲ့ unspecified-type literal (type သတ်မှတ်မထားတဲ့ literal) တွေကတော့ ချွင်းချက်ပါ။ ဥပမာ —

```sql
SELECT 'Hello World';
```

ဒီမှာ — string literal ကို ဘယ် type အနေနဲ့ မှတ်ယူရမလဲ ဆိုတာကို ဖော်ပြနိုင်မယ့် အရာ တစ်ခုမှ မရှိပါဘူး။ ဒီလို အခြေအနေမျိုးမှာ PostgreSQL က literal ရဲ့ type ကို `text` အဖြစ် fallback လုပ်သွားပါလိမ့်မယ်။

`SELECT` က `UNION` (ဒါမှမဟုတ် `INTERSECT` ဒါမှမဟုတ် `EXCEPT`) construct တစ်ခုရဲ့ arm (လက်တံ) တစ်ခု ဖြစ်နေရင် — ဒါမှမဟုတ် — `INSERT ... SELECT` ထဲမှာ ပေါ်နေရင် — ဒီစည်းမျဉ်းကို ကျင့်သုံးမှာ မဟုတ်ပါဘူး — အကြောင်းကတော့ ရှေ့ပိုင်း section တွေရဲ့ စည်းမျဉ်းတွေက ဦးစားပေး အကျုံးဝင်လို့ပါ။ Unspecified-type literal တစ်ခုရဲ့ type ကို — ပထမ ကိစ္စမှာ တခြား `UNION` arm ကနေ ဖြစ်စေ — ဒုတိယ ကိစ္စမှာတော့ destination column (တန်ဖိုး သိမ်းဆည်းရာ column) ကနေ ဖြစ်စေ — ရယူနိုင်ပါတယ်။

`RETURNING` list တွေကိုလည်း ဒီရည်ရွယ်ချက်အတွက် `SELECT` output list တွေလိုပဲ သဘောထားပါတယ်။

> **မှတ်ချက်:** PostgreSQL 10 မတိုင်မီက ဒီစည်းမျဉ်း မရှိခဲ့ဘဲ — `SELECT` output list ထဲက unspecified-type literal တွေကို type `unknown` အဖြစ် ချန်ထားခဲ့ပါတယ်။ အဲဒါက ဆိုးကျိုး အမျိုးမျိုး ဖြစ်စေခဲ့တာကြောင့် — ပြောင်းလဲလိုက်တာပါ။
