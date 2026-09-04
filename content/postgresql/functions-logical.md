---
title: "Logical Operators (ယုတ္တိ operator များ)"
description: "PostgreSQL ၏ logical operators (ယုတ္တိ operator များ) — AND, OR, NOT တို့နှင့် three-valued logic (တန်ဖိုး သုံးမျိုး ယုတ္တိ) စနစ်၊ truth tables (မှန်ကန်မှု ဇယားများ) အကြောင်း"
order: 68
source: "https://www.postgresql.org/docs/current/functions-logical.html"
status: translated
updated: 2026-09-04
---

## 9.1. Logical Operators (ယုတ္တိ operator များ)

ပုံမှန် logical operators တွေကို ရရှိနိုင်ပါတယ်:

```sql
boolean AND boolean → boolean
boolean OR boolean → boolean
NOT boolean → boolean
```

SQL က true, false နဲ့ “unknown” (မသိ) ကို ကိုယ်စားပြုတဲ့ `null` တို့ ပါဝင်တဲ့ three-valued logic system (တန်ဖိုး သုံးမျိုး ယုတ္တိ စနစ်) ကို သုံးပါတယ်။ အောက်ပါ truth tables (မှန်ကန်မှု ဇယားများ) တွေကို ကြည့်ပါ:

| `a` | `b` | `a` AND `b` | `a` OR `b` |
| --- | --- | --- | --- |
| TRUE | TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE | TRUE |
| TRUE | NULL | NULL | TRUE |
| FALSE | FALSE | FALSE | FALSE |
| FALSE | NULL | FALSE | NULL |
| NULL | NULL | NULL | NULL |

| `a` | NOT `a` |
| --- | --- |
| TRUE | FALSE |
| FALSE | TRUE |
| NULL | NULL |

`AND` နဲ့ `OR` operators တွေက commutative (operands များ လဲလှယ်နိုင်သော) ဖြစ်ပါတယ် — ဆိုလိုတာက left နဲ့ right operands တွေကို လဲလှယ်လိုက်ရင်လည်း ရလဒ်ကို ထိခိုက်မှု မရှိပါဘူး။ (ဒါပေမယ့် — left operand ကို right operand ထက် အရင်ဆုံး အကဲဖြတ်မယ်လို့တော့ အာမခံထားတာ မဟုတ်ပါဘူး။ Subexpressions တွေရဲ့ အကဲဖြတ်မှု အစဉ်အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 4.2.14](/docs/postgresql/sql-expressions) ကို ကြည့်ပါ။)
