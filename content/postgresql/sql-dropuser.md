---
title: "DROP USER (user တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "User (database role) တစ်ခုကို ဖယ်ရှားခြင်း — DROP USER သည် DROP ROLE ၏ အခြားရေးသားပုံစံ (alternate spelling) ဖြစ်ပြီး IF EXISTS option ဖြင့် role မရှိပါက error မထုတ်ဘဲ role များစွာကို တစ်ပြိုင်နက် ဖယ်ရှားနိုင်သည်"
order: 169
source: "https://www.postgresql.org/docs/current/sql-dropuser.html"
status: translated
updated: 2026-09-04
---

## DROP USER (user တစ်ခုကို ဖယ်ရှားခြင်း)

DROP USER — database role တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP USER [ IF EXISTS ] name [, ...]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP USER` က [`DROP ROLE`](/docs/postgresql/sql-droprole) ရဲ့ ရိုးရှင်းတဲ့ အခြားရေးသားပုံစံ (alternate spelling) တစ်ခုပဲ ဖြစ်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP USER` statement က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ SQL standard ကတော့ users တွေရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို implementation (အကောင်အထည်ဖော်မှု) တစ်ခုချင်းစီဆီ ချန်ထားပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DROP ROLE](/docs/postgresql/sql-droprole)
