---
title: "DROP GROUP (database role တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Group (database role) တစ်ခုကို ဖယ်ရှားခြင်း — DROP GROUP သည် DROP ROLE ၏ alias ဖြစ်ပြီး IF EXISTS option ဖြင့် role မရှိပါက error မထုတ်ဘဲ role များစွာကို တစ်ပြိုင်နက် ဖယ်ရှားနိုင်သည်"
order: 286
source: "https://www.postgresql.org/docs/current/sql-dropgroup.html"
status: translated
updated: 2026-09-04
---

## DROP GROUP (database role တစ်ခုကို ဖယ်ရှားခြင်း)

DROP GROUP — database role တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP GROUP [ IF EXISTS ] name [, ...]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP GROUP` က ယခုအခါ [`DROP ROLE`](/docs/postgresql/sql-droprole) အတွက် alias (နာမည်တစ်မျိုးဖြင့် ခေါ်နိုင်သော ပုံစံ) တစ်ခု ဖြစ်နေပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `DROP GROUP` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DROP ROLE](/docs/postgresql/sql-droprole)
