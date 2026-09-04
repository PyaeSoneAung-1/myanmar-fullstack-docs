---
title: "Subquery Expressions (subquery expression များ)"
description: "PostgreSQL မှာ ရနိုင်တဲ့ SQL-compliant subquery expressions များ — EXISTS, IN, NOT IN, ANY/SOME, ALL နှင့် single-row comparison — ၎င်းတို့၏ အဓိပ္ပာယ်နှင့် null တန်ဖိုးများကို ကိုင်တွယ်ပုံ၊ row constructor နှင့် တွဲသုံးသည့် ပုံစံများ"
order: 91
source: "https://www.postgresql.org/docs/current/functions-subquery.html"
status: translated
updated: 2026-09-04
---

## 9.24. Subquery Expressions (subquery expression များ)

- **9.24.1. EXISTS (row တစ်ခုခု ပြန်ပေးမပြန်ပေး စစ်ဆေးခြင်း)**
- **9.24.2. IN (subquery ရလဒ်ထဲမှာ ညီမျှမှု ရှိမရှိ စစ်ဆေးခြင်း)**
- **9.24.3. NOT IN (subquery ရလဒ်ထဲမှာ ညီမျှမှု မရှိခြင်း စစ်ဆေးခြင်း)**
- **9.24.4. ANY/SOME (subquery row တစ်ခုခုနှင့် နှိုင်းယှဉ်ခြင်း)**
- **9.24.5. ALL (subquery row အားလုံးနှင့် နှိုင်းယှဉ်ခြင်း)**
- **9.24.6. Single-Row Comparison (row တစ်ခုတည်း နှိုင်းယှဉ်ခြင်း)**

ဒီ section က PostgreSQL မှာ ရနိုင်တဲ့ SQL-compliant subquery expressions (SQL စံနှုန်းနဲ့ ကိုက်ညီသော subquery expression များ) တွေကို ဖော်ပြပါတယ်။ ဒီ section ထဲမှာ မှတ်တမ်းပြုထားတဲ့ expression ပုံစံ (form) တွေ အားလုံးက Boolean (true/false) ရလဒ်တွေကို ပြန်ပေးပါတယ်။

### 9.24.1. `EXISTS` (row တစ်ခုခု ပြန်ပေးမပြန်ပေး စစ်ဆေးခြင်း)

```sql
EXISTS (subquery)
```

`EXISTS` ရဲ့ argument က — *subquery* လို့ ခေါ်တဲ့ — မည်သည့် `SELECT` statement မဆို ဖြစ်နိုင်ပါတယ်။ Subquery က row တစ်ခုခု ပြန်ပေးမပြန်ပေးဆိုတာကို ဆုံးဖြတ်ဖို့အတွက် အကဲဖြတ်ပါတယ်။ Row အနည်းဆုံး တစ်ခု ပြန်ပေးခဲ့ရင် — `EXISTS` ရဲ့ ရလဒ်က “true” ဖြစ်ပြီး — subquery က row ဘာမှ မပြန်ပေးဘူးဆိုရင် — `EXISTS` ရဲ့ ရလဒ်က “false” ဖြစ်ပါတယ်။

Subquery က ဝန်းရံထားတဲ့ query ထဲက variable တွေကို ရည်ညွှန်းနိုင်ပြီး — အဲဒီ variable တွေက subquery ရဲ့ အကဲဖြတ်မှု (evaluation) တစ်ခုခုအတွင်းမှာ constant တွေအနေနဲ့ ပြုမူပါတယ်။

Subquery က ယေဘုယျအားဖြင့် — row အနည်းဆုံး တစ်ခု ပြန်ပေးမပြန်ပေးကို ဆုံးဖြတ်ဖို့ လိုသလောက်ပဲ execute လုပ်ပြီး — အဆုံးအထိ (to completion) run ခံရလေ့ မရှိပါဘူး။ Side effects (ဘေးထွက် သက်ရောက်မှု) ရှိတဲ့ subquery တစ်ခု (ဥပမာ — sequence functions တွေကို ခေါ်ယူတာမျိုး) ကို ရေးတာက မသင့်ပါဘူး: side effects တွေ ဖြစ်ပေါ်မလားဆိုတာ ကြိုတင် ခန့်မှန်းလို့ မရနိုင်လို့ပါ။

ရလဒ်က row တွေ ပြန်ပေးမပြန်ပေးပေါ်မှာပဲ မူတည်ပြီး — အဲဒီ row တွေရဲ့ ပါဝင်မှု (contents) အပေါ်မှာ မမူတည်လို့ — subquery ရဲ့ output list က ပုံမှန်အားဖြင့် အရေးမပါပါဘူး။ အသုံးများတဲ့ coding convention (ရေးသားနည်း စည်းမျဉ်း) တစ်ခုကတော့ — `EXISTS` စစ်ဆေးမှုတွေ အားလုံးကို `EXISTS(SELECT 1 WHERE ...)` ပုံစံနဲ့ ရေးတာပါ။ ဒါပေမယ့် — `INTERSECT` သုံးထားတဲ့ subquery တွေလို — ဒီစည်းမျဉ်းအတွက် ခြွင်းချက်တွေလည်း ရှိပါတယ်။

ဒီ ရိုးရှင်းတဲ့ ဥပမာက `col2` ပေါ်မှာ inner join လုပ်တာနဲ့ ဆင်ပါတယ် — ဒါပေမယ့် `tab2` ထဲမှာ ကိုက်ညီတဲ့ row အများကြီး ရှိနေရင်တောင် — `tab1` row တစ်ခုစီအတွက် output row တစ်ခုထက် ပိုပြီး ထွက်ပေးမှာ မဟုတ်ပါဘူး:

```sql
SELECT col1
FROM tab1
WHERE EXISTS (SELECT 1 FROM tab2 WHERE col2 = tab1.col2);
```

### 9.24.2. `IN` (subquery ရလဒ်ထဲမှာ ညီမျှမှု ရှိမရှိ စစ်ဆေးခြင်း)

```sql
expression IN (subquery)
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — column တစ်ခုတည်းကိုပဲ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expression ကို အကဲဖြတ်ပြီး — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်ပါတယ်။ ညီမျှတဲ့ subquery row တစ်ခုခု တွေ့ရှိရင် — `IN` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ ညီမျှတဲ့ row ဘာမှ မတွေ့ရဘူးဆိုရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — ရလဒ်က “false” ဖြစ်ပါတယ်။

ဘယ်ဘက်ခြမ်း expression က null ထွက်ပေးရင် — သို့မဟုတ် ညီမျှတဲ့ ညာဘက်ခြမ်း တန်ဖိုး ဘာမှ မရှိဘဲ ညာဘက်ခြမ်း row အနည်းဆုံး တစ်ခုက null ထွက်ပေးရင် — `IN` construct ရဲ့ ရလဒ်က false မဟုတ်ဘဲ null ဖြစ်မယ်ဆိုတာ သတိပြုပါ။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

`EXISTS` မှာလိုပဲ — subquery ကို အပြည့်အဝ အကဲဖြတ်ခံရမယ်လို့ ယူဆတာက မသင့်ပါဘူး။

```sql
row_constructor IN (subquery)
```

ဒီ `IN` ပုံစံရဲ့ ဘယ်ဘက်ခြမ်းက — [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — row constructor တစ်ခု ဖြစ်ပါတယ်။ ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — ဘယ်ဘက် row ထဲမှာ ရှိတဲ့ expression အရေအတွက်နဲ့ ကိုက်ညီတဲ့ column အရေအတွက်ကိုပဲ အတိအကျ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expressions တွေကို အကဲဖြတ်ပြီး — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ row-wise (row အလိုက်) နှိုင်းယှဉ်ပါတယ်။ ညီမျှတဲ့ subquery row တစ်ခုခု တွေ့ရှိရင် — `IN` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ ညီမျှတဲ့ row ဘာမှ မတွေ့ရဘူးဆိုရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — ရလဒ်က “false” ဖြစ်ပါတယ်။

ထုံးစံအတိုင်းပဲ — row တွေထဲက null တန်ဖိုးတွေကို SQL Boolean expressions ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့အညီ ပေါင်းစပ်ပါတယ်။ Row နှစ်ခုကို — သူတို့ရဲ့ သက်ဆိုင်ရာ (corresponding) member တွေ အားလုံး null မဟုတ်ပြီး ညီမျှနေရင် — ညီမျှတယ်လို့ သတ်မှတ်ပါတယ်; သက်ဆိုင်ရာ member တစ်ခုခုက null မဟုတ်ပြီး မညီမျှဘူးဆိုရင် row တွေက မညီမျှပါဘူး; ဒါမှမဟုတ်ရင်တော့ အဲဒီ row နှိုင်းယှဉ်မှုရဲ့ ရလဒ်က unknown (null) ဖြစ်ပါတယ်။ Row တစ်ခုချင်းစီရဲ့ ရလဒ်တွေ အားလုံးက မညီမျှ သို့မဟုတ် null တွေချည်းပဲ ဖြစ်ပြီး — null အနည်းဆုံး တစ်ခု ပါနေရင် — `IN` ရဲ့ ရလဒ်က null ဖြစ်ပါတယ်။

### 9.24.3. `NOT IN` (subquery ရလဒ်ထဲမှာ ညီမျှမှု မရှိခြင်း စစ်ဆေးခြင်း)

```sql
expression NOT IN (subquery)
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — column တစ်ခုတည်းကိုပဲ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expression ကို အကဲဖြတ်ပြီး — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်ပါတယ်။ မညီမျှတဲ့ subquery rows တွေပဲ ရှိနေရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — `NOT IN` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ ညီမျှတဲ့ row တစ်ခုခု တွေ့ရှိရင် — ရလဒ်က “false” ဖြစ်ပါတယ်။

ဘယ်ဘက်ခြမ်း expression က null ထွက်ပေးရင် — သို့မဟုတ် ညီမျှတဲ့ ညာဘက်ခြမ်း တန်ဖိုး ဘာမှ မရှိဘဲ ညာဘက်ခြမ်း row အနည်းဆုံး တစ်ခုက null ထွက်ပေးရင် — `NOT IN` construct ရဲ့ ရလဒ်က true မဟုတ်ဘဲ null ဖြစ်မယ်ဆိုတာ သတိပြုပါ။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

`EXISTS` မှာလိုပဲ — subquery ကို အပြည့်အဝ အကဲဖြတ်ခံရမယ်လို့ ယူဆတာက မသင့်ပါဘူး။

```sql
row_constructor NOT IN (subquery)
```

ဒီ `NOT IN` ပုံစံရဲ့ ဘယ်ဘက်ခြမ်းက — [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — row constructor တစ်ခု ဖြစ်ပါတယ်။ ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — ဘယ်ဘက် row ထဲမှာ ရှိတဲ့ expression အရေအတွက်နဲ့ ကိုက်ညီတဲ့ column အရေအတွက်ကိုပဲ အတိအကျ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expressions တွေကို အကဲဖြတ်ပြီး — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ row-wise (row အလိုက်) နှိုင်းယှဉ်ပါတယ်။ မညီမျှတဲ့ subquery rows တွေပဲ ရှိနေရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — `NOT IN` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ ညီမျှတဲ့ row တစ်ခုခု တွေ့ရှိရင် — ရလဒ်က “false” ဖြစ်ပါတယ်။

ထုံးစံအတိုင်းပဲ — row တွေထဲက null တန်ဖိုးတွေကို SQL Boolean expressions ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့အညီ ပေါင်းစပ်ပါတယ်။ Row နှစ်ခုကို — သူတို့ရဲ့ သက်ဆိုင်ရာ (corresponding) member တွေ အားလုံး null မဟုတ်ပြီး ညီမျှနေရင် — ညီမျှတယ်လို့ သတ်မှတ်ပါတယ်; သက်ဆိုင်ရာ member တစ်ခုခုက null မဟုတ်ပြီး မညီမျှဘူးဆိုရင် row တွေက မညီမျှပါဘူး; ဒါမှမဟုတ်ရင်တော့ အဲဒီ row နှိုင်းယှဉ်မှုရဲ့ ရလဒ်က unknown (null) ဖြစ်ပါတယ်။ Row တစ်ခုချင်းစီရဲ့ ရလဒ်တွေ အားလုံးက မညီမျှ သို့မဟုတ် null တွေချည်းပဲ ဖြစ်ပြီး — null အနည်းဆုံး တစ်ခု ပါနေရင် — `NOT IN` ရဲ့ ရလဒ်က null ဖြစ်ပါတယ်။

### 9.24.4. `ANY`/`SOME` (subquery row တစ်ခုခုနှင့် နှိုင်းယှဉ်ခြင်း)

```sql
expression operator ANY (subquery)
expression operator SOME (subquery)
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — column တစ်ခုတည်းကိုပဲ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expression ကို အကဲဖြတ်ပြီး — Boolean ရလဒ် ထွက်ပေးရမယ့် ပေးထားတဲ့ `operator` ကို သုံးကာ — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်ပါတယ်။ true ရလဒ် တစ်ခုခု ရရှိခဲ့ရင် — `ANY` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ true ရလဒ် ဘာမှ မတွေ့ရဘူးဆိုရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — ရလဒ်က “false” ဖြစ်ပါတယ်။

`SOME` က `ANY` ရဲ့ synonym (တူညီသော အဓိပ္ပာယ်ရှိသည့် အသုံးအနှုန်း) တစ်ခု ဖြစ်ပါတယ်။ `IN` က `= ANY` နဲ့ ညီမျှပါတယ်။

အောင်မြင်မှု (success) ရလဒ် ဘာမှ မရှိဘဲ — operator ရဲ့ ရလဒ်အတွက် ညာဘက်ခြမ်း row အနည်းဆုံး တစ်ခုက null ထွက်ပေးနေရင် — `ANY` construct ရဲ့ ရလဒ်က false မဟုတ်ဘဲ null ဖြစ်မယ်ဆိုတာ သတိပြုပါ။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

`EXISTS` မှာလိုပဲ — subquery ကို အပြည့်အဝ အကဲဖြတ်ခံရမယ်လို့ ယူဆတာက မသင့်ပါဘူး။

```sql
row_constructor operator ANY (subquery)
row_constructor operator SOME (subquery)
```

ဒီ `ANY` ပုံစံရဲ့ ဘယ်ဘက်ခြမ်းက — [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — row constructor တစ်ခု ဖြစ်ပါတယ်။ ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — ဘယ်ဘက် row ထဲမှာ ရှိတဲ့ expression အရေအတွက်နဲ့ ကိုက်ညီတဲ့ column အရေအတွက်ကိုပဲ အတိကျ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expressions တွေကို အကဲဖြတ်ပြီး — ပေးထားတဲ့ `operator` ကို သုံးကာ — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ row-wise (row အလိုက်) နှိုင်းယှဉ်ပါတယ်။ နှိုင်းယှဉ်မှုက subquery row တစ်ခုခုအတွက် true ပြန်ရင် — `ANY` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ နှိုင်းယှဉ်မှုက subquery row တိုင်းအတွက် false ပြန်ရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — ရလဒ်က “false” ဖြစ်ပါတယ်။ Subquery row တစ်ခုနဲ့မှ နှိုင်းယှဉ်မှုက true မပြန်ဘဲ — နှိုင်းယှဉ်မှု အနည်းဆုံး တစ်ခုက NULL ပြန်နေရင် — ရလဒ်က NULL ဖြစ်ပါတယ်။

Row constructor နှိုင်းယှဉ်မှုတစ်ခုရဲ့ အဓိပ္ပာယ် အသေးစိတ်အတွက် [အပိုင်း 9.25.5](/docs/postgresql/functions-comparisons) ကို ကြည့်ပါ။

### 9.24.5. `ALL` (subquery row အားလုံးနှင့် နှိုင်းယှဉ်ခြင်း)

```sql
expression operator ALL (subquery)
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — column တစ်ခုတည်းကိုပဲ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expression ကို အကဲဖြတ်ပြီး — Boolean ရလဒ် ထွက်ပေးရမယ့် ပေးထားတဲ့ `operator` ကို သုံးကာ — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်ပါတယ်။ နှိုင်းယှဉ်မှု အားလုံးက true ထွက်ပေးခဲ့ရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — `ALL` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ false ရလဒ် တစ်ခုခု တွေ့ရှိရတယ်ဆိုရင် — ရလဒ်က “false” ဖြစ်ပါတယ်။ Subquery row တစ်ခုနဲ့မှ နှိုင်းယှဉ်မှုက false မပြန်ဘဲ — နှိုင်းယှဉ်မှု အနည်းဆုံး တစ်ခုက NULL ပြန်နေရင် — ရလဒ်က NULL ဖြစ်ပါတယ်။

`NOT IN` က `<> ALL` နဲ့ ညီမျှပါတယ်။

`EXISTS` မှာလိုပဲ — subquery ကို အပြည့်အဝ အကဲဖြတ်ခံရမယ်လို့ ယူဆတာက မသင့်ပါဘူး။

```sql
row_constructor operator ALL (subquery)
```

ဒီ `ALL` ပုံစံရဲ့ ဘယ်ဘက်ခြမ်းက — [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — row constructor တစ်ခု ဖြစ်ပါတယ်။ ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — ဘယ်ဘက် row ထဲမှာ ရှိတဲ့ expression အရေအတွက်နဲ့ ကိုက်ညီတဲ့ column အရေအတွက်ကိုပဲ အတိအကျ ပြန်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expressions တွေကို အကဲဖြတ်ပြီး — ပေးထားတဲ့ `operator` ကို သုံးကာ — subquery ရလဒ်ရဲ့ row တစ်ခုချင်းစီနဲ့ row-wise (row အလိုက်) နှိုင်းယှဉ်ပါတယ်။ နှိုင်းယှဉ်မှုက subquery row တိုင်းအတွက် true ပြန်ရင် (subquery က row ဘာမှ မပြန်တဲ့ ကိစ္စလည်း အပါအဝင်) — `ALL` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ နှိုင်းယှဉ်မှုက subquery row တစ်ခုခုအတွက် false ပြန်ရင် — ရလဒ်က “false” ဖြစ်ပါတယ်။ Subquery row တစ်ခုနဲ့မှ နှိုင်းယှဉ်မှုက false မပြန်ဘဲ — နှိုင်းယှဉ်မှု အနည်းဆုံး တစ်ခုက NULL ပြန်နေရင် — ရလဒ်က NULL ဖြစ်ပါတယ်။

Row constructor နှိုင်းယှဉ်မှုတစ်ခုရဲ့ အဓိပ္ပာယ် အသေးစိတ်အတွက် [အပိုင်း 9.25.5](/docs/postgresql/functions-comparisons) ကို ကြည့်ပါ။

### 9.24.6. Single-Row Comparison (row တစ်ခုတည်း နှိုင်းယှဉ်ခြင်း)

```sql
row_constructor operator (subquery)
```

ဘယ်ဘက်ခြမ်းက — [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — row constructor တစ်ခု ဖြစ်ပါတယ်။ ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ subquery တစ်ခု ဖြစ်ပြီး — ဘယ်ဘက် row ထဲမှာ ရှိတဲ့ expression အရေအတွက်နဲ့ ကိုက်ညီတဲ့ column အရေအတွက်ကိုပဲ အတိအကျ ပြန်ပေးရပါမယ်။ ထို့ပြင် — subquery က row တစ်ခုထက်ပိုပြီး ပြန်လို့ မရပါဘူး။ (Row သုညခု ပြန်ရင် — ရလဒ်ကို null လို့ မှတ်ယူပါတယ်။) ဘယ်ဘက်ခြမ်းကို အကဲဖြတ်ပြီး — subquery ရဲ့ တစ်ခုတည်းသော (single) result row နဲ့ row-wise (row အလိုက်) နှိုင်းယှဉ်ပါတယ်။

Row constructor နှိုင်းယှဉ်မှုတစ်ခုရဲ့ အဓိပ္ပာယ် အသေးစိတ်အတွက် [အပိုင်း 9.25.5](/docs/postgresql/functions-comparisons) ကို ကြည့်ပါ။
