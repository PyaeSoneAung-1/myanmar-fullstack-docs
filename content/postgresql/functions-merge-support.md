---
title: "Merge Support Functions (merge support လုပ်ဆောင်ချက်များ)"
description: "MERGE command ၏ RETURNING list တွင် သုံးနိုင်သော merge support function — row တစ်ခုစီအတွက် လုပ်ဆောင်ခဲ့သော action ကို ဖော်ပြပေးသည့် merge_action() function အကြောင်း"
order: 90
source: "https://www.postgresql.org/docs/current/functions-merge-support.html"
status: translated
updated: 2026-09-04
---

## 9.23. Merge Support Functions (merge support လုပ်ဆောင်ချက်များ)

PostgreSQL မှာ merge support function တစ်ခု ပါဝင်ပါတယ် — ၎င်းကို [MERGE](https://www.postgresql.org/docs/current/sql-merge.html) command တစ်ခုရဲ့ `RETURNING` list ထဲမှာ — row တစ်ခုစီအတွက် လုပ်ဆောင်လိုက်တဲ့ action ကို ဖော်ထုတ်ဖို့ — သုံးနိုင်ပါတယ်; ဇယား 9.68 ကို ကြည့်ပါ။

**ဇယား 9.68. Merge Support Functions (merge support လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| merge_action ( ) → text လက်ရှိ row အတွက် လုပ်ဆောင်လိုက်တဲ့ merge action command ကို ပြန်ပေးပါတယ်။ ဒါက 'INSERT'၊ 'UPDATE' ဒါမှမဟုတ် 'DELETE' ဖြစ်ပါလိမ့်မယ်။ |

ဥပမာ:

```sql
MERGE INTO products p
  USING stock s ON p.product_id = s.product_id
  WHEN MATCHED AND s.quantity > 0 THEN
    UPDATE SET in_stock = true, quantity = s.quantity
  WHEN MATCHED THEN
    UPDATE SET in_stock = false, quantity = 0
  WHEN NOT MATCHED THEN
    INSERT (product_id, in_stock, quantity)
      VALUES (s.product_id, true, s.quantity)
  RETURNING merge_action(), p.*;

 merge_action | product_id | in_stock | quantity
--------------+------------+----------+----------
 UPDATE       |       1001 | t        |       50
 UPDATE       |       1002 | f        |        0
 INSERT       |       1003 | t        |       10
```

ဒီ function ကို `MERGE` command တစ်ခုရဲ့ `RETURNING` list ထဲမှာပဲ သုံးလို့ ရမယ်ဆိုတာ သတိပြုပါ။ Query တစ်ခုရဲ့ တခြား ဘယ်အပိုင်းမှာမဆို သုံးရင် error ဖြစ်ပါတယ်။
