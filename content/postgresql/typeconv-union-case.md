---
title: "UNION, CASE, and Related Constructs (UNION, CASE နှင့် ဆက်စပ်တည်ဆောက်မှုများ)"
description: "UNION ၊ CASE ၊ INTERSECT ၊ EXCEPT စသည့် construct များတွင် မတူညီသော type များကို result data type တစ်ခုတည်း အဖြစ် ဖြေရှင်းပုံ — type resolution algorithm ၏ စည်းမျဉ်းများနှင့် ဥပမာများ ပါဝင်သည်"
order: 72
source: "https://www.postgresql.org/docs/current/typeconv-union-case.html"
status: translated
updated: 2026-09-03
---

## 10.5. UNION, CASE, and Related Constructs (UNION, CASE နှင့် ဆက်စပ်တည်ဆောက်မှုများ)

SQL ရဲ့ `UNION` construct တွေက — မတူညီနိုင်တဲ့ type တွေကို ကိုက်ညီစေပြီး result set တစ်ခုတည်း ဖြစ်အောင် ပေါင်းစည်းရပါတယ်။ Resolution algorithm (type ဖြေရှင်းမှု algorithm) ကို union query တစ်ခုရဲ့ output column (ရလဒ် column) တစ်ခုချင်းစီအလိုက် သီးခြားစီ ကျင့်သုံးပါတယ်။ `INTERSECT` နဲ့ `EXCEPT` construct တွေကလည်း — မတူညီတဲ့ type တွေကို `UNION` နည်းအတိုင်းပဲ ဖြေရှင်းပါတယ်။ `CASE` ၊ `ARRAY` ၊ `VALUES` နဲ့ `GREATEST` ၊ `LEAST` function တွေ အပါအဝင် တခြား construct တချို့ကလည်း — သူတို့ရဲ့ component expression တွေကို ကိုက်ညီစေပြီး result data type တစ်ခု ရွေးချယ်ဖို့ — တူညီတဲ့ algorithm ကို အတိအကျ သုံးပါတယ်။

**Type Resolution for UNION, CASE, and Related Constructs (UNION, CASE နှင့် ဆက်စပ်တည်ဆောက်မှုများအတွက် type resolution)**

1. Input အားလုံးက type တစ်မျိုးတည်း ဖြစ်ပြီး — အဲဒါက unknown မဟုတ်ရင် — အဲဒီ type အဖြစ် ဖြေရှင်းပါ။
2. Input တစ်ခုခုက domain type (base type တစ်ခုပေါ်မှာ constraint တွေ ထပ်ဖြည့်ထားတဲ့ type) ဖြစ်ရင် — နောက်အဆင့်တွေ အားလုံးအတွက် အဲဒါကို domain ရဲ့ base type (အခြေခံ type) အဖြစ် သဘောထားပါ။ [12]
3. Input အားလုံးက unknown type ဖြစ်ရင် — type text (string category ရဲ့ preferred type (ဦးစားပေး type)) အဖြစ် ဖြေရှင်းပါ။ ဒါမဟုတ်ရင် — ကျန်တဲ့ စည်းမျဉ်းတွေအတွက် unknown input တွေကို ထည့်တွက်မှာ မဟုတ်ပါဘူး။
4. Non-unknown input (unknown မဟုတ်တဲ့ input) တွေအားလုံးက type category (type အုပ်စု) တစ်ခုတည်း မဟုတ်ရင် — မအောင်မြင်ပါ။
5. ပထမဆုံး non-unknown input type ကို candidate type (ကိုယ်စားပြု type) အဖြစ် ရွေးပြီး — ကျန်တဲ့ non-unknown input type တစ်ခုချင်းစီကို ဘယ်ကနေ ညာဘက် အစဉ်လိုက် စဉ်းစားပါ။ [13] Candidate type ကို တခြား type ဆီ implicitly (သွယ်ဝိုက်၍) ပြောင်းလဲလို့ ရပြီး — ပြောင်းပြန်ကတော့ မရဘူးဆိုရင် — အဲဒီ တခြား type ကို candidate type အသစ် အဖြစ် ရွေးပါ။ ပြီးတော့ ကျန်နေတဲ့ input တွေကို ဆက်ပြီး စဉ်းစားပါ။ ဒီဖြစ်စဉ်ရဲ့ ဘယ်အဆင့်မှာမဆို preferred type တစ်ခု ရွေးလိုက်ရပြီ ဆိုရင် — နောက်ထပ် input တွေကို စဉ်းစားတာ ရပ်လိုက်ပါ။
6. Input အားလုံးကို နောက်ဆုံး candidate type အဖြစ် ပြောင်းပါ။ ပေးထားတဲ့ input type တစ်ခုကနေ candidate type ဆီ implicit conversion မရှိရင် — မအောင်မြင်ပါ။

ဥပမာ အချို့ကို အောက်တွင် ဖော်ပြထားပါတယ်။

**ဥပမာ 10.10. Type Resolution with Underspecified Types in a Union (type အတိအကျ မသတ်မှတ်ရသေးသော union တစ်ခုတွင် type resolution)**

```sql
SELECT text 'a' AS "text" UNION SELECT 'b';

 text
------
 a
 b
(2 rows)
```

ဒီမှာ — unknown-type literal `'b'` ကို type `text` အဖြစ် ဖြေရှင်းသွားမှာ ဖြစ်ပါတယ်။

**ဥပမာ 10.11. Type Resolution in a Simple Union (ရိုးရိုး union တစ်ခုတွင် type resolution)**

```sql
SELECT 1.2 AS "numeric" UNION SELECT 1;

 numeric
---------
       1
     1.2
(2 rows)
```

`1.2` literal က `numeric` type ဖြစ်ပြီး — `integer` တန်ဖိုး `1` ကို `numeric` ဆီ implicitly cast လုပ်လို့ ရတာကြောင့် — အဲဒီ type ကို သုံးလိုက်တာပါ။

**ဥပမာ 10.12. Type Resolution in a Transposed Union (type အစီအစဉ် ပြောင်းပြန် ဖြစ်နေသော union တစ်ခုတွင် type resolution)**

```sql
SELECT 1 AS "real" UNION SELECT CAST('2.2' AS REAL);

 real
------
    1
  2.2
(2 rows)
```

ဒီမှာ — type `real` ကို `integer` ဆီ implicitly cast လုပ်လို့ မရပေမယ့် — `integer` ကတော့ `real` ဆီ implicitly cast လုပ်လို့ ရတာကြောင့် — union ရဲ့ result type ကို `real` အဖြစ် ဖြေရှင်းလိုက်ပါတယ်။

**ဥပမာ 10.13. Type Resolution in a Nested Union (union ထဲမှာ union ပါနေသော အခြေအနေတွင် type resolution)**

```sql
SELECT NULL UNION SELECT NULL UNION SELECT 1;

ERROR:  UNION types text and integer cannot be matched
```

ဒီ failure ဖြစ်ရတာက — PostgreSQL က `UNION` အများကြီးကို pairwise operation (အတွဲလိုက် လုပ်ဆောင်မှု) တွေရဲ့ အသိုက်အမြုံ (nest) အဖြစ် သဘောထားလို့ပါ — ဆိုလိုတာက — ဒီ input က အောက်က ပုံစံနဲ့ အတူတူပါ:

```sql
(SELECT NULL UNION SELECT NULL) UNION SELECT 1;
```

အပေါ်က စည်းမျဉ်းတွေအတိုင်း — အတွင်းဘက် `UNION` ကို type `text` ထုတ်ပေးတဲ့ အဖြစ် ဖြေရှင်းပါတယ်။ ပြီးတော့ အပြင်ဘက် `UNION` မှာ `text` နဲ့ `integer` type input တွေ ရှိနေတာကြောင့် — မြင်ရတဲ့ error ဖြစ်ပေါ်လာတာပါ။ ဒီပြဿနာကို — ဘယ်ဘက် အကျဆုံး `UNION` မှာ လိုချင်တဲ့ result type ရဲ့ input အနည်းဆုံး တစ်ခု ပါအောင် သေချာ လုပ်ခြင်းအားဖြင့် ဖြေရှင်းလို့ ရပါတယ်။

`INTERSECT` နဲ့ `EXCEPT` operation တွေကိုလည်း အလားတူ — pairwise (အတွဲလိုက်) ဖြေရှင်းပါတယ်။ ဒါပေမယ့် — ဒီ section ထဲက တခြား construct တွေကတော့ သူတို့ရဲ့ input အားလုံးကို ဖြေရှင်းမှု အဆင့်တစ်ခုတည်းမှာ ထည့်သွင်း စဉ်းစားပါတယ်။

---

[12] Operator နဲ့ function တွေအတွက် domain input တွေကို ကိုင်တွယ်ပုံနဲ့ အနည်းငယ် ဆင်တူပြီး — ဒီအပြုအမူက user က input အားလုံး ထို type အတိအကျနဲ့ — implicitly ဖြစ်စေ — explicitly (တိုက်ရိုက်) ဖြစ်စေ — ကိုက်ညီကြောင်း သေချာ လုပ်ထားသရွေ့ — domain type တစ်ခုကို `UNION` ဒါမှမဟုတ် အလားတူ construct တစ်ခုမှတစ်ဆင့် ထိန်းသိမ်း ထားနိုင်စေပါတယ်။ ဒါမှမဟုတ်ရင် — domain ရဲ့ base type ကိုသာ သုံးသွားမှာ ဖြစ်ပါတယ်။

[13] သမိုင်းကြောင်းအရ ဆိုရင် — `CASE` က သူ့ရဲ့ `ELSE` clause (ရှိရင်) ကို “ပထမ” input အဖြစ် သဘောထားပြီး — အဲဒီနောက်မှ `THEN` clause တွေကို စဉ်းစားပါတယ်။ တခြား ကိစ္စတွေ အားလုံးမှာတော့ — “ဘယ်ကနေ ညာ” ဆိုတာ — expression တွေ query text ထဲမှာ ပေါ်လာတဲ့ အစီအစဉ်ကို ဆိုလိုပါတယ်။
