---
title: "Row and Array Comparisons (row နှင့် array နှိုင်းယှဉ်ခြင်းများ)"
description: "Row (တန်း) နှင့် array (ခင်းကျင်း) တန်ဖိုးအုပ်စုများကြား နှိုင်းယှဉ်မှု အများအပြား ပြုလုပ်ရန် construct များ — IN, NOT IN, ANY/SOME, ALL (array) နှင့် row constructor / composite type နှိုင်းယှဉ်ခြင်းများ"
order: 92
source: "https://www.postgresql.org/docs/current/functions-comparisons.html"
status: translated
updated: 2026-09-04
---

## 9.25. Row and Array Comparisons (row နှင့် array နှိုင်းယှဉ်ခြင်းများ)

- **9.25.1. IN (value list ထဲမှာ ပါဝင်မှု စစ်ဆေးခြင်း)**
- **9.25.2. NOT IN (value list ထဲမှာ မပါဝင်မှု စစ်ဆေးခြင်း)**
- **9.25.3. ANY/SOME (array) (array element တစ်ခုခုနှင့် နှိုင်းယှဉ်ခြင်း)**
- **9.25.4. ALL (array) (array element အားလုံးနှင့် နှိုင်းယှဉ်ခြင်း)**
- **9.25.5. Row Constructor Comparison (row constructor နှိုင်းယှဉ်ခြင်း)**
- **9.25.6. Composite Type Comparison (composite type နှိုင်းယှဉ်ခြင်း)**

ဒီ section က — တန်ဖိုးအုပ်စုတွေကြားမှာ နှိုင်းယှဉ်မှု အများအပြား ပြုလုပ်နိုင်ဖို့အတွက် အထူးပြု (specialized) construct တွေ အများအပြားကို ဖော်ပြပါတယ်။ ဒီပုံစံတွေက အရင် section ထဲက subquery ပုံစံတွေနဲ့ syntax အရ ဆက်စပ်မှု ရှိပေမယ့် — subquery တွေ မပါဝင်ပါဘူး။ Array subexpression တွေ ပါဝင်တဲ့ ပုံစံတွေက PostgreSQL extensions တွေ ဖြစ်ပြီး — ကျန်တဲ့ ပုံစံတွေကတော့ SQL နဲ့ ကိုက်ညီပါတယ်။ ဒီ section မှာ ဖော်ပြထားတဲ့ expression ပုံစံ အားလုံးက Boolean (true/false) ရလဒ်တွေကို ပြန်ပေးပါတယ်။

### 9.25.1. `IN` (value list ထဲမှာ ပါဝင်မှု စစ်ဆေးခြင်း)

```sql
expression IN (value [, ...])
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ expression စာရင်း တစ်ခု ဖြစ်ပါတယ်။ ဘယ်ဘက်ခြမ်း expression ရဲ့ ရလဒ်က ညာဘက်ခြမ်း expression တွေထဲက တစ်ခုခုနဲ့ ညီမျှနေရင် ရလဒ်က “true” ဖြစ်ပါတယ်။ ဒါက အောက်ပါအတွက် အတိုကောက် (shorthand) သင်္ကေတတစ်ခု ဖြစ်ပါတယ်:

```sql
expression = value1
OR
expression = value2
OR
...
```

ဘယ်ဘက်ခြမ်း expression က null ထွက်ပေးရင် — သို့မဟုတ် ညီမျှတဲ့ ညာဘက်ခြမ်း တန်ဖိုး ဘာမှ မရှိဘဲ ညာဘက်ခြမ်း expression အနည်းဆုံး တစ်ခုက null ထွက်ပေးရင် — `IN` construct ရဲ့ ရလဒ်က false မဟုတ်ဘဲ null ဖြစ်မယ်ဆိုတာ သတိပြုပါ။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

### 9.25.2. `NOT IN` (value list ထဲမှာ မပါဝင်မှု စစ်ဆေးခြင်း)

```sql
expression NOT IN (value [, ...])
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ expression စာရင်း တစ်ခု ဖြစ်ပါတယ်။ ဘယ်ဘက်ခြမ်း expression ရဲ့ ရလဒ်က ညာဘက်ခြမ်း expression တွေ အားလုံးနဲ့ မညီမျှနေရင် ရလဒ်က “true” ဖြစ်ပါတယ်။ ဒါက အောက်ပါအတွက် အတိုကောက် (shorthand) သင်္ကေတတစ်ခု ဖြစ်ပါတယ်:

```sql
expression <> value1
AND
expression <> value2
AND
...
```

ဘယ်ဘက်ခြမ်း expression က null ထွက်ပေးရင် — သို့မဟုတ် ညီမျှတဲ့ ညာဘက်ခြမ်း တန်ဖိုး ဘာမှ မရှိဘဲ ညာဘက်ခြမ်း expression အနည်းဆုံး တစ်ခုက null ထွက်ပေးရင် — `NOT IN` construct ရဲ့ ရလဒ်က — နုံအတွေးနဲ့ မျှော်လင့်မိနိုင်တဲ့ true မဟုတ်ဘဲ — null ဖြစ်ပါတယ်။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

> **အကြံပြုချက်:** `x NOT IN y` က ကိစ္စအားလုံးမှာ `NOT (x IN y)` နဲ့ ညီမျှပါတယ်။ ဒါပေမယ့် — `IN` နဲ့ အလုပ်လုပ်တာထက် `NOT IN` နဲ့ အလုပ်လုပ်တဲ့အခါ null တန်ဖိုးတွေက novice (အစပြုသူ) တွေကို အမှားဖြစ်စေဖို့ အလားအလာ များစွာ ပိုများပါတယ်။ ဖြစ်နိုင်ရင် condition ကို positive (အပြုသဘော) ပုံစံနဲ့ ဖော်ပြတာ အကောင်းဆုံး ဖြစ်ပါတယ်။

### 9.25.3. `ANY`/`SOME` (array) (array element တစ်ခုခုနှင့် နှိုင်းယှဉ်ခြင်း)

```sql
expression operator ANY (array expression)
expression operator SOME (array expression)
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ expression တစ်ခု ဖြစ်ပြီး — array တန်ဖိုး တစ်ခုကို ထွက်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expression ကို အကဲဖြတ်ပြီး — Boolean ရလဒ် ထွက်ပေးရမယ့် ပေးထားတဲ့ `operator` ကို သုံးကာ — array ရဲ့ element တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်ပါတယ်။ true ရလဒ် တစ်ခုခု ရရှိခဲ့ရင် `ANY` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ true ရလဒ် ဘာမှ မတွေ့ရဘူးဆိုရင် (array မှာ element သုညခု ရှိတဲ့ ကိစ္စလည်း အပါအဝင်) ရလဒ်က “false” ဖြစ်ပါတယ်။

Array expression က null array တစ်ခုကို ထွက်ပေးရင် — `ANY` ရဲ့ ရလဒ်က null ဖြစ်ပါလိမ့်မယ်။ ဘယ်ဘက်ခြမ်း expression က null ထွက်ပေးရင် — `ANY` ရဲ့ ရလဒ်က ပုံမှန်အားဖြင့် null ဖြစ်ပါတယ် (non-strict comparison operator တစ်ခုကတော့ မတူညီတဲ့ ရလဒ်တစ်ခု ထွက်ပေးနိုင်ခြေ ရှိပါတယ်)။ ပြီးတော့ — ညာဘက်ခြမ်း array ထဲမှာ null element တွေ ပါဝင်ပြီး true နှိုင်းယှဉ်မှု ရလဒ် ဘာမှ မရရှိဘူးဆိုရင် — `ANY` ရဲ့ ရလဒ်က false မဟုတ်ဘဲ null ဖြစ်ပါလိမ့်မယ် (strict comparison operator တစ်ခုလို့ ယူဆထားရင်)။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

`SOME` က `ANY` ရဲ့ synonym (တူညီသော အဓိပ္ပာယ်ရှိသည့် အသုံးအနှုန်း) တစ်ခု ဖြစ်ပါတယ်။

### 9.25.4. `ALL` (array) (array element အားလုံးနှင့် နှိုင်းယှဉ်ခြင်း)

```sql
expression operator ALL (array expression)
```

ညာဘက်ခြမ်းက parentheses ထဲမှာ ထည့်ထားတဲ့ expression တစ်ခု ဖြစ်ပြီး — array တန်ဖိုး တစ်ခုကို ထွက်ပေးရပါမယ်။ ဘယ်ဘက်ခြမ်း expression ကို အကဲဖြတ်ပြီး — Boolean ရလဒ် ထွက်ပေးရမယ့် ပေးထားတဲ့ `operator` ကို သုံးကာ — array ရဲ့ element တစ်ခုချင်းစီနဲ့ နှိုင်းယှဉ်ပါတယ်။ နှိုင်းယှဉ်မှု အားလုံးက true ထွက်ပေးခဲ့ရင် (array မှာ element သုညခု ရှိတဲ့ ကိစ္စလည်း အပါအဝင်) `ALL` ရဲ့ ရလဒ်က “true” ဖြစ်ပါတယ်။ false ရလဒ် တစ်ခုခု တွေ့ရတယ်ဆိုရင်တော့ ရလဒ်က “false” ဖြစ်ပါတယ်။

Array expression က null array တစ်ခုကို ထွက်ပေးရင် — `ALL` ရဲ့ ရလဒ်က null ဖြစ်ပါလိမ့်မယ်။ ဘယ်ဘက်ခြမ်း expression က null ထွက်ပေးရင် — `ALL` ရဲ့ ရလဒ်က ပုံမှန်အားဖြင့် null ဖြစ်ပါတယ် (non-strict comparison operator တစ်ခုကတော့ မတူညီတဲ့ ရလဒ်တစ်ခု ထွက်ပေးနိုင်ခြေ ရှိပါတယ်)။ ပြီးတော့ — ညာဘက်ခြမ်း array ထဲမှာ null element တွေ ပါဝင်ပြီး false နှိုင်းယှဉ်မှု ရလဒ် ဘာမှ မရရှိဘူးဆိုရင် — `ALL` ရဲ့ ရလဒ်က true မဟုတ်ဘဲ null ဖြစ်ပါလိမ့်မယ် (strict comparison operator တစ်ခုလို့ ယူဆထားရင်)။ ဒါက null တန်ဖိုးတွေရဲ့ Boolean ပေါင်းစပ်မှုတွေအတွက် SQL ရဲ့ ပုံမှန် စည်းမျဉ်းတွေနဲ့ ကိုက်ညီပါတယ်။

### 9.25.5. Row Constructor Comparison (row constructor နှိုင်းယှဉ်ခြင်း)

```sql
row_constructor operator row_constructor
```

ဘက်တစ်ဖက်စီက — [အပိုင်း 4.2.13](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — row constructor တစ်ခု ဖြစ်ပါတယ်။ Row constructor နှစ်ခုမှာ field အရေအတွက် အတူတူ ရှိရပါမယ်။ ပေးထားတဲ့ `operator` ကို — သက်ဆိုင်ရာ (corresponding) field အတွဲ တစ်တွဲချင်းစီပေါ်မှာ အသုံးချပါတယ်။ (Field တွေက type မတူညီနိုင်တဲ့အတွက် — ဒါက အတွဲတစ်တွဲချင်းစီအတွက် မတူညီတဲ့ သီးခြား operator တစ်ခုကို ရွေးချယ်ခံရနိုင်တယ်လို့ ဆိုလိုပါတယ်။) ရွေးချယ်လိုက်တဲ့ operator တွေ အားလုံးက B-tree operator class တစ်ခုခုရဲ့ member တွေ ဖြစ်ရပါမယ် — သို့မဟုတ် B-tree operator class တစ်ခုရဲ့ `=` member ရဲ့ negator (ငြင်းဆိုချက်) ဖြစ်ရပါမယ် — ဆိုလိုတာက row constructor နှိုင်းယှဉ်ခြင်းက `operator` က `=`, `<>`, `<`, `<=`, `>` သို့မဟုတ် `>=` ဖြစ်တဲ့အခါ — သို့မဟုတ် ၎င်းတို့ထဲက တစ်ခုနဲ့ ဆင်တူတဲ့ အဓိပ္ပာယ် (semantics) ရှိတဲ့အခါ — မှသာ ဖြစ်နိုင်တာပါ။

`=` နဲ့ `<>` ကိစ္စတွေကတော့ တခြားဟာတွေနဲ့ နည်းနည်း ကွဲပြားစွာ အလုပ်လုပ်ပါတယ်။ Row နှစ်ခုကို — သူတို့ရဲ့ သက်ဆိုင်ရာ member တွေ အားလုံး null မဟုတ်ပြီး ညီမျှနေရင် — ညီမျှတယ်လို့ သတ်မှတ်ပါတယ်; သက်ဆိုင်ရာ member တစ်ခုခုက null မဟုတ်ပြီး မညီမျှဘူးဆိုရင် row တွေက မညီမျှပါဘူး; ဒါမှမဟုတ်ရင်တော့ row နှိုင်းယှဉ်မှုရဲ့ ရလဒ်က unknown (null) ဖြစ်ပါတယ်။

`<`, `<=`, `>` နဲ့ `>=` ကိစ္စတွေမှာတော့ — row element တွေကို ဘယ်ကနေ ညာ (left-to-right) နှိုင်းယှဉ်သွားပြီး — မညီမျှတဲ့ သို့မဟုတ် null ဖြစ်တဲ့ element အတွဲ တစ်တွဲကို တွေ့တာနဲ့ ရပ်တန့်လိုက်ပါတယ်။ ဒီအတွဲထဲက element တစ်ခုခုက null ဆိုရင် — row နှိုင်းယှဉ်မှုရဲ့ ရလဒ်က unknown (null) ဖြစ်ပြီး — မဟုတ်ရင်တော့ ဒီ element အတွဲရဲ့ နှိုင်းယှဉ်မှုက ရလဒ်ကို ဆုံးဖြတ်ပေးပါတယ်။ ဥပမာ — `ROW(1,2,NULL) < ROW(1,3,0)` က null မဟုတ်ဘဲ true ကို ထွက်ပေးပါတယ် — အကြောင်းကတော့ တတိယ element အတွဲကို ထည့်သွင်း စဉ်းစားခြင်း မရှိလို့ပါ။

```sql
row_constructor IS DISTINCT FROM row_constructor
```

ဒီ construct က `<>` row နှိုင်းယှဉ်မှုနဲ့ ဆင်တူပေမယ့် — null inputs တွေအတွက် null ကို မထွက်ပေးပါဘူး။ အဲဒီအစား — null တန်ဖိုး တစ်ခုခုကို null မဟုတ်တဲ့ တန်ဖိုးတစ်ခုခုနဲ့ မညီမျှ (distinct — ကွဲပြား) တယ်လို့ သတ်မှတ်ပြီး — null နှစ်ခုကိုတော့ ညီမျှ (not distinct — မကွဲပြား) တယ်လို့ သတ်မှတ်ပါတယ်။ ဒါကြောင့် ရလဒ်က true သို့မဟုတ် false ဖြစ်ပြီး — null ဘယ်တော့မှ မဖြစ်ပါဘူး။

```sql
row_constructor IS NOT DISTINCT FROM row_constructor
```

ဒီ construct က `=` row နှိုင်းယှဉ်မှုနဲ့ ဆင်တူပေမယ့် — null inputs တွေအတွက် null ကို မထွက်ပေးပါဘူး။ အဲဒီအစား — null တန်ဖိုး တစ်ခုခုကို null မဟုတ်တဲ့ တန်ဖိုးတစ်ခုခုနဲ့ မညီမျှ (distinct) တယ်လို့ သတ်မှတ်ပြီး — null နှစ်ခုကိုတော့ ညီမျှ (not distinct) တယ်လို့ သတ်မှတ်ပါတယ်။ ဒါကြောင့် ရလဒ်က အမြဲတမ်း true သို့မဟုတ် false ဖြစ်ပြီး — null ဘယ်တော့မှ မဖြစ်ပါဘူး။

### 9.25.6. Composite Type Comparison (composite type နှိုင်းယှဉ်ခြင်း)

```sql
record operator record
```

SQL specification က — ရလဒ်က NULL တန်ဖိုး နှစ်ခု သို့မဟုတ် NULL နဲ့ non-NULL တစ်ခုကို နှိုင်းယှဉ်တာပေါ်မှာ မူတည်နေရင် — row-wise (row အလိုက်) နှိုင်းယှဉ်မှုက NULL ကို ပြန်ပေးဖို့ လိုအပ်ပါတယ်။ PostgreSQL က ဒါကို — row constructor နှစ်ခုရဲ့ ရလဒ်တွေကို နှိုင်းယှဉ်တဲ့အခါ (အပိုင်း 9.25.5 မှာ ပြထားသလို) သို့မဟုတ် row constructor တစ်ခုကို subquery တစ်ခုရဲ့ output နဲ့ နှိုင်းယှဉ်တဲ့အခါ ([အပိုင်း 9.24](/docs/postgresql/functions-subquery) မှာ ပြထားသလို) — ဒီကိစ္စတွေမှာပဲ လုပ်ဆောင်ပါတယ်။ Composite-type တန်ဖိုး နှစ်ခုကို နှိုင်းယှဉ်တဲ့ တခြား context တွေမှာတော့ — NULL field တန်ဖိုး နှစ်ခုကို ညီမျှတယ်လို့ သတ်မှတ်ပြီး — NULL တစ်ခုကို non-NULL တစ်ခုထက် ကြီးတယ်လို့ သတ်မှတ်ပါတယ်။ Composite types တွေအတွက် ညီညွတ်တဲ့ (consistent) sorting နဲ့ indexing အပြုအမူ ရှိဖို့ ဒါ လိုအပ်ပါတယ်။

ဘက်တစ်ဖက်စီကို အကဲဖြတ်ပြီး — row-wise နှိုင်းယှဉ်ပါတယ်။ Composite type နှိုင်းယှဉ်မှုတွေက `operator` က `=`, `<>`, `<`, `<=`, `>` သို့မဟုတ် `>=` ဖြစ်တဲ့အခါ — သို့မဟုတ် ၎င်းတို့ထဲက တစ်ခုနဲ့ ဆင်တူတဲ့ အဓိပ္ပာယ် ရှိတဲ့အခါ — ခွင့်ပြုပါတယ်။ (အတိအကျ ဆိုရရင် — operator တစ်ခုက B-tree operator class တစ်ခုရဲ့ member ဖြစ်ရင် — သို့မဟုတ် B-tree operator class တစ်ခုရဲ့ `=` member ရဲ့ negator ဖြစ်ရင် — row comparison operator အဖြစ် သုံးနိုင်ပါတယ်။) အပေါ်က operator တွေရဲ့ default အပြုအမူက row constructor တွေအတွက် `IS [ NOT ] DISTINCT FROM` ရဲ့ အပြုအမူနဲ့ အတူတူပဲ ဖြစ်ပါတယ် (အပိုင်း 9.25.5 ကို ကြည့်ပါ)။

Default B-tree operator class မရှိတဲ့ element တွေ ပါဝင်တဲ့ row တွေရဲ့ ကိုက်ညီမှု (matching) ကို ထောက်ပံ့ဖို့ — composite type နှိုင်းယှဉ်မှုအတွက် အောက်ပါ operator တွေကို သတ်မှတ်ထားပါတယ်: `*=`, `*<>`, `*<`, `*<=`, `*>`, နဲ့ `*>=`။ ဒီ operator တွေက row နှစ်ခုရဲ့ အတွင်းပိုင်း binary representation (ကိုယ်စားပြုပုံ) ကို နှိုင်းယှဉ်ပါတယ်။ Row နှစ်ခုက equality operator နဲ့ နှိုင်းယှဉ်မှု true ဖြစ်နေရင်တောင် — binary representation မတူညီတာ ဖြစ်နိုင်ပါတယ်။ ဒီ comparison operator တွေအောက်မှာ row တွေရဲ့ အစီအစဉ် (ordering) က deterministic (ကြိုတင် ဆုံးဖြတ်နိုင်သော) ဖြစ်ပေမယ့် — ဒီထက်ပိုတဲ့ အဓိပ္ပာယ်တော့ မရှိပါဘူး။ ဒီ operator တွေကို materialized views တွေအတွက် အတွင်းပိုင်းမှာ သုံးပြီး — replication နဲ့ B-Tree deduplication (ထပ်နေသော entry များ ဖယ်ရှားခြင်း) ([အပိုင်း 65.1.4.3](https://www.postgresql.org/docs/current/btree.html#BTREE-DEDUPLICATION)) လိုမျိုး တခြား အထူးပြု ရည်ရွယ်ချက်တွေအတွက်လည်း အသုံးဝင်နိုင်ပါတယ်။ ဒါတွေက query တွေ ရေးသားရာမှာ ယေဘုယျအားဖြင့် အသုံးဝင်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။
