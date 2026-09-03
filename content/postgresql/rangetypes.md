---
title: "Range Types (range type များ)"
description: "Range type (အပိုင်းအခြား type) များအကြောင်း — built-in range/multirange type များ၊ inclusive/exclusive bound နဲ့ input/output ပုံစံများ၊ constructor များ၊ operator/function များ၊ index ပြုလုပ်ခြင်းနဲ့ exclusion constraint များ"
order: 64
source: "https://www.postgresql.org/docs/current/rangetypes.html"
status: translated
updated: 2026-09-03
---

## 8.17. Range Types (range type များ)

- **8.17.1. Built-in Range and Multirange Types (built-in range နဲ့ multirange type များ)**
- **8.17.2. Examples (ဥပမာများ)**
- **8.17.3. Inclusive and Exclusive Bounds (inclusive နဲ့ exclusive bound များ)**
- **8.17.4. Infinite (Unbounded) Ranges (အဆုံးမဲ့ (unbounded) range များ)**
- **8.17.5. Range Input/Output (range input/output)**
- **8.17.6. Constructing Ranges and Multiranges (range နဲ့ multirange များ တည်ဆောက်ခြင်း)**
- **8.17.7. Discrete Range Types (discrete range type များ)**
- **8.17.8. Defining New Range Types (range type အသစ်များ သတ်မှတ်ခြင်း)**
- **8.17.9. Indexing (index ပြုလုပ်ခြင်း)**
- **8.17.10. Constraints on Ranges (range များပေါ်က constraint များ)**

Range type တွေဆိုတာ — element type တစ်ခုခုရဲ့ တန်ဖိုး အပိုင်းအခြား (range) တစ်ခုကို ကိုယ်စားပြုတဲ့ data type များ ဖြစ်ပါတယ် (အဲဒီ element type ကို range ရဲ့ *subtype* လို့ ခေါ်ပါတယ်)။ ဥပမာ — အစည်းအဝေး ခန်းမတစ်ခုကို ကြိုတင် သိမ်းထားတဲ့ အချိန် အပိုင်းအခြားတွေကို ကိုယ်စားပြုဖို့ `timestamp` range တွေကို သုံးနိုင်ပါတယ်။ ဒီကိစ္စမှာ data type က `tsrange` ("timestamp range" ရဲ့ အတိုကောက်) ဖြစ်ပြီး — `timestamp` က subtype ဖြစ်ပါတယ်။ Subtype မှာ total order (စုစုပေါင်း အစီအစဉ်) ရှိရပါမယ် — element တန်ဖိုးတွေက range တစ်ခုရဲ့ အတွင်းမှာ လား၊ ရှေ့မှာ လား၊ နောက်မှာ လားဆိုတာ ရှင်းရှင်းလင်းလင်း သတ်မှတ်နိုင်ဖို့ပါ။

Range type တွေက — element တန်ဖိုး အများအပြားကို range တန်ဖိုး တစ်ခုတည်းထဲမှာ ကိုယ်စားပြုနိုင်တာကြောင့်ရော — ထပ်နေတဲ့ (overlapping) range တွေလို အယူအဆတွေကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်တာကြောင့်ပါ အသုံးဝင်ပါတယ်။ အချိန်ဇယား (schedule) ချရာမှာ time နဲ့ date range တွေ သုံးတာက အကောင်းဆုံး ဥပမာပါ; ဒါပေမယ့် ဈေးနှုန်း range တွေ၊ တိုင်းတာရေး ကိရိယာတစ်ခုရဲ့ တိုင်းတာမှု range တွေ စသဖြင့်လည်း အသုံးဝင်နိုင်ပါတယ်။

Range type တိုင်းမှာ သူနဲ့ ကိုက်ညီတဲ့ multirange type တစ်ခုစီ ရှိပါတယ်။ Multirange ဆိုတာ — ကပ်လျက် (contiguous) မဟုတ်တဲ့၊ ဗလာ (empty) မဟုတ်တဲ့၊ null မဟုတ်တဲ့ range တွေကို အစီအစဉ်တကျ စာရင်းပြုထားတဲ့ ပုံစံတစ်ခု ဖြစ်ပါတယ်။ Range operator အများစုက multirange တွေပေါ်မှာလည်း အလုပ်လုပ်နိုင်ပြီး — multirange တွေမှာ ကိုယ်ပိုင် function အနည်းငယ်လည်း ရှိပါတယ်။

### 8.17.1. Built-in Range and Multirange Types (built-in range နဲ့ multirange type များ)

PostgreSQL မှာ အောက်ပါ built-in range type တွေ ပါဝင်ပါတယ်:

- int4range — integer ၏ range, int4multirange — သက်ဆိုင်ရာ multirange
- int8range — bigint ၏ range, int8multirange — သက်ဆိုင်ရာ multirange
- numrange — numeric ၏ range, nummultirange — သက်ဆိုင်ရာ multirange
- tsrange — timestamp without time zone ၏ range, tsmultirange — သက်ဆိုင်ရာ multirange
- tstzrange — timestamp with time zone ၏ range, tstzmultirange — သက်ဆိုင်ရာ multirange
- daterange — date ၏ range, datemultirange — သက်ဆိုင်ရာ multirange

ဒါတွေအပြင် — သင်ကိုယ်တိုင်လည်း ကိုယ်ပိုင် range type တွေကို သတ်မှတ်နိုင်ပါတယ်; အသေးစိတ်အတွက် [CREATE TYPE](https://www.postgresql.org/docs/current/sql-createtype.html) ကို ကြည့်ပါ။

### 8.17.2. Examples (ဥပမာများ)

```sql
CREATE TABLE reservation (room int, during tsrange);
INSERT INTO reservation VALUES
    (1108, '[2010-01-01 14:30, 2010-01-01 15:30)');

-- Containment
SELECT int4range(10, 20) @> 3;

-- Overlaps
SELECT numrange(11.1, 22.2) && numrange(20.0, 30.0);

-- Extract the upper bound
SELECT upper(int8range(15, 25));

-- Compute the intersection
SELECT int4range(10, 20) * int4range(15, 25);

-- Is the range empty?
SELECT isempty(numrange(1, 5));
```

Range type တွေပေါ်မှာ သုံးတဲ့ operator နဲ့ function တွေရဲ့ အပြည့်အစုံ စာရင်းအတွက် [ဇယား 9.58](https://www.postgresql.org/docs/current/functions-range.html#RANGE-OPERATORS-TABLE) နဲ့ [ဇယား 9.60](https://www.postgresql.org/docs/current/functions-range.html#RANGE-FUNCTIONS-TABLE) တို့ကို ကြည့်ပါ။

### 8.17.3. Inclusive and Exclusive Bounds (inclusive နဲ့ exclusive bound များ)

ဗလာ (empty) မဟုတ်တဲ့ range တိုင်းမှာ bound နှစ်ခု ရှိပါတယ် — အောက် bound (lower bound) နဲ့ အပေါ် bound (upper bound) ပါ။ ဒီတန်ဖိုး နှစ်ခုကြားက အမှတ် (point) တွေ အားလုံးကို range ထဲမှာ ထည့်သွင်းပါတယ်။ Inclusive bound ဆိုတာ — နယ်နိမိတ် (boundary) အမှတ်ကိုယ်တိုင်ကိုပါ range ထဲမှာ ထည့်သွင်းတာကို ဆိုလိုပြီး — exclusive bound ကတော့ — နယ်နိမိတ် အမှတ်ကို range ထဲမှာ မထည့်သွင်းတာကို ဆိုလိုပါတယ်။

Range တစ်ခုရဲ့ text ပုံစံမှာ — inclusive ဖြစ်တဲ့ အောက် bound ကို “[” နဲ့ ကိုယ်စားပြုပြီး — exclusive ဖြစ်တဲ့ အောက် bound ကို “(” နဲ့ ကိုယ်စားပြုပါတယ်။ အလားတူပဲ — inclusive ဖြစ်တဲ့ အပေါ် bound ကို “]” နဲ့ ကိုယ်စားပြုပြီး — exclusive ဖြစ်တဲ့ အပေါ် bound ကို “)” နဲ့ ကိုယ်စားပြုပါတယ်။ (အသေးစိတ်အတွက် [အပိုင်း 8.17.5](/docs/postgresql/rangetypes) ကို ကြည့်ပါ။)

`lower_inc` နဲ့ `upper_inc` function တွေက — range တန်ဖိုးတစ်ခုရဲ့ အောက် bound နဲ့ အပေါ် bound တွေ inclusive ဟုတ်မဟုတ်ကို အသီးသီး စစ်ဆေးပေးပါတယ်။

### 8.17.4. Infinite (Unbounded) Ranges (အဆုံးမဲ့ (unbounded) range များ)

Range တစ်ခုရဲ့ အောက် bound ကို ချန်လိုက်လို့ ရပါတယ် — ဒါဆိုရင် အပေါ် bound ထက် ငယ်တဲ့ တန်ဖိုး အားလုံးကို range ထဲမှာ ထည့်သွင်းတာကို ဆိုလိုပါတယ် — ဥပမာ `(,3]` လိုမျိုးပါ။ အလားတူပဲ — range ရဲ့ အပေါ် bound ကို ချန်လိုက်ရင်လည်း — အောက် bound ထက် ကြီးတဲ့ တန်ဖိုး အားလုံးကို range ထဲမှာ ထည့်သွင်းပါတယ်။ အောက် bound ရော အပေါ် bound ပါ နှစ်ခုလုံး ချန်လိုက်ရင် — element type ရဲ့ တန်ဖိုး အားလုံးကို range ထဲမှာ ရှိတယ်လို့ သတ်မှတ်ပါတယ်။ ပျောက်နေတဲ့ bound တစ်ခုကို inclusive အနေနဲ့ သတ်မှတ်ရင်တောင် — အလိုအလျောက် exclusive အဖြစ် ပြောင်းလဲပေးပါတယ် — ဥပမာ `[,]` ကို `(,)` အဖြစ် ပြောင်းလဲပေးပါတယ်။ ဒီ ပျောက်နေတဲ့ တန်ဖိုးတွေကို +/-infinity လို့ ထင်မှတ်လို့ ရပေမယ့် — ဒါတွေက အထူး range type တန်ဖိုးတွေ ဖြစ်ပြီး — ဘယ် range element type ရဲ့ +/-infinity တန်ဖိုးတွေထက်ကိုမဆို ကျော်လွန်တယ်လို့ သတ်မှတ်ပါတယ်။

“Infinity” ဆိုတဲ့ အယူအဆ ရှိတဲ့ element type တွေကတော့ — infinity ကို ရှင်းလင်းတဲ့ bound တန်ဖိုးတွေအနေနဲ့ သုံးနိုင်ပါတယ်။ ဥပမာ — timestamp range တွေမှာ `[today,infinity)` က အထူး `timestamp` တန်ဖိုး `infinity` ကို ဖယ်ထုတ်ပြီး — `[today,infinity]` ကတော့ ၎င်းကို ထည့်သွင်းပါတယ် — `[today,)` နဲ့ `[today,]` တွေကလည်း အတူတူပါပဲ။

`lower_inf` နဲ့ `upper_inf` function တွေက — range တစ်ခုရဲ့ အောက် bound နဲ့ အပေါ် bound တွေ infinite (အဆုံးမရှိ) ဟုတ်မဟုတ်ကို အသီးသီး စစ်ဆေးပေးပါတယ်။

### 8.17.5. Range Input/Output (range input/output)

Range တန်ဖိုးတစ်ခုရဲ့ input က အောက်ပါ ပုံစံတွေထဲက တစ်ခုကို လိုက်နာရပါမယ်:

```sql
(lower-bound,upper-bound)
(lower-bound,upper-bound]
[lower-bound,upper-bound)
[lower-bound,upper-bound]
empty
```

Parentheses “( )” တို့ bracket “[ ]” တို့က — အရင်က ဖော်ပြခဲ့သလို — အောက် bound နဲ့ အပေါ် bound တွေ exclusive လား inclusive လားကို ညွှန်ပြပါတယ်။ နောက်ဆုံး ပုံစံ `empty` က — အမှတ် (point) တစ်ခုမှ မပါဝင်တဲ့ ဗလာ range တစ်ခုကို ကိုယ်စားပြုတာကို သတိပြုပါ။

`lower-bound` ကတော့ — subtype အတွက် valid input ဖြစ်တဲ့ string တစ်ခု ဖြစ်နိုင်သလို — အောက် bound မရှိဘူးလို့ ညွှန်ပြဖို့ ဗလာ ဖြစ်နိုင်ပါတယ်။ `upper-bound` ကလည်း အလားတူပဲ — subtype အတွက် valid input ဖြစ်တဲ့ string တစ်ခု သို့မဟုတ် — အပေါ် bound မရှိဘူးလို့ ညွှန်ပြဖို့ ဗလာ ဖြစ်နိုင်ပါတယ်။

Bound တန်ဖိုး တစ်ခုချင်းစီကို `"` (double quote) character တွေနဲ့ quote လုပ်လို့ ရပါတယ်။ Bound တန်ဖိုးထဲမှာ parentheses၊ bracket၊ comma၊ double quote သို့မဟုတ် backslash တွေ ပါနေရင် ဒါ လိုအပ်ပါတယ် — အကြောင်းကတော့ ဒီ character တွေကို တခြားနည်းနဲ့ ဆိုရင် range syntax ရဲ့ အစိတ်အပိုင်းအဖြစ် မှတ်ယူခံရမှာမို့ပါ။ Quote လုပ်ထားတဲ့ bound တန်ဖိုးထဲမှာ double quote သို့မဟုတ် backslash ထည့်ချင်ရင် — ၎င်းရဲ့ ရှေ့မှာ backslash ထည့်ပေးရပါတယ်။ (ပြီးတော့ — double-quoted bound တန်ဖိုးတစ်ခုထဲမှာရှိတဲ့ double quote အတွဲကို — SQL literal string တွေထဲမှာ single quote တွေအတွက် စည်းမျဉ်းတွေနဲ့ ဆင်တူစွာ — double quote character တစ်ခုကို ကိုယ်စားပြုတယ်လို့ မှတ်ယူပါတယ်။) တနည်းအားဖြင့် — quote လုပ်တာကို ရှောင်ပြီး — range syntax အဖြစ် မှတ်ယူခံရမယ့် data character တွေ အားလုံးကို ကာကွယ်ဖို့ backslash-escaping ကို သုံးနိုင်ပါတယ်။ ပြီးတော့ — ဗလာ string ဖြစ်တဲ့ bound တန်ဖိုးတစ်ခုကို ရေးဖို့ကတော့ `""` လို့ ရေးရပါတယ် — ဘာမှ မရေးတာက infinite bound ကို ဆိုလိုလို့ပါ။

Range တန်ဖိုးရဲ့ ရှေ့နဲ့ နောက်မှာတော့ whitespace (နေရာလွတ်) ခွင့်ပြုပါတယ် — ဒါပေမယ့် parentheses သို့မဟုတ် bracket တွေကြားထဲက whitespace တွေကတော့ — အောက် သို့မဟုတ် အပေါ် bound တန်ဖိုးရဲ့ အစိတ်အပိုင်းအဖြစ် မှတ်ယူပါတယ်။ (Element type ပေါ်မူတည်ပြီး — ဒါက အဓိပ္ပာယ် ရှိချင်မှ ရှိပါလိမ့်မယ်။)

> **မှတ်ချက်:** ဒီ စည်းမျဉ်းတွေက — composite-type literal တွေထဲမှာ field တန်ဖိုးတွေ ရေးသားခြင်းအတွက် စည်းမျဉ်းတွေနဲ့ အလွန် ဆင်တူပါတယ်။ နောက်ထပ် ရှင်းလင်းချက်တွေအတွက် [အပိုင်း 8.16.6](/docs/postgresql/rowtypes) ကို ကြည့်ပါ။

ဥပမာများ:

```sql
-- includes 3, does not include 7, and does include all points in between
SELECT '[3,7)'::int4range;

-- does not include either 3 or 7, but includes all points in between
SELECT '(3,7)'::int4range;

-- includes only the single point 4
SELECT '[4,4]'::int4range;

-- includes no points (and will be normalized to 'empty')
SELECT '[4,4)'::int4range;
```

Multirange တစ်ခုရဲ့ input ကတော့ — curly bracket (`{` နဲ့ `}`) တွေထဲမှာ valid range သုည ခု သို့မဟုတ် ထိုထက်ပို ကို comma တွေနဲ့ ခြားပြီး ထည့်ထားတဲ့ ပုံစံ ဖြစ်ပါတယ်။ Bracket နဲ့ comma တွေရဲ့ ဝန်းကျင်မှာ whitespace ခွင့်ပြုပါတယ်။ ဒါက array syntax ကို အမှတ်ရစေဖို့ ရည်ရွယ်ထားတာပါ — multirange တွေက အများကြီး ပိုရိုးရှင်းပေမယ့်ပေါ့: သူတို့မှာ dimension တစ်ခုပဲ ရှိပြီး — ပါဝင်တဲ့ အရာတွေကို quote လုပ်ဖို့ မလိုပါဘူး။ (ဒါပေမယ့် သူတို့ရဲ့ range တွေရဲ့ bound တွေကိုတော့ အပေါ်မှာ ဖော်ပြခဲ့သလို quote လုပ်လို့ ရပါတယ်။)

ဥပမာများ:

```sql
SELECT '{}'::int4multirange;
SELECT '{[3,7)}'::int4multirange;
SELECT '{[3,7), [8,9)}'::int4multirange;
```

### 8.17.6. Constructing Ranges and Multiranges (range နဲ့ multirange များ တည်ဆောက်ခြင်း)

Range type တစ်ခုချင်းစီမှာ — သူ့ရဲ့ range type နဲ့ နာမည်တူတဲ့ constructor function တစ်ခု ရှိပါတယ်။ Constructor function ကို သုံးတာက — range literal constant တစ်ခု ရေးတာထက် မကြာခဏဆိုသလို ပိုအဆင်ပြေပါတယ် — အကြောင်းကတော့ bound တန်ဖိုးတွေကို အပို quote လုပ်ဖို့ မလိုတာကြောင့်ပါ။ Constructor function က argument နှစ်ခု သို့မဟုတ် သုံးခု လက်ခံပါတယ်။ Argument နှစ်ခု ပုံစံက — range တစ်ခုကို standard ပုံစံနဲ့ တည်ဆောက်ပေးပါတယ် (အောက် bound inclusive၊ အပေါ် bound exclusive) — argument သုံးခု ပုံစံကတော့ — တတိယ argument က သတ်မှတ်ပေးတဲ့ ပုံစံအတိုင်း bound တွေနဲ့ range တစ်ခုကို တည်ဆောက်ပေးပါတယ်။ တတိယ argument က “()”, “(]”, “[)”, သို့မဟုတ် “[]” ဆိုတဲ့ string တွေထဲက တစ်ခု ဖြစ်ရပါမယ်။ ဥပမာ:

```sql
-- The full form is: lower bound, upper bound, and text argument indicating
-- inclusivity/exclusivity of bounds.
SELECT numrange(1.0, 14.0, '(]');

-- If the third argument is omitted, '[)' is assumed.
SELECT numrange(1.0, 14.0);

-- Although '(]' is specified here, on display the value will be converted to
-- canonical form, since int8range is a discrete range type (see below).
SELECT int8range(1, 14, '(]');

-- Using NULL for either bound causes the range to be unbounded on that side.
SELECT numrange(NULL, 2.2);
```

Range type တိုင်းမှာ — multirange type နဲ့ နာမည်တူတဲ့ multirange constructor တစ်ခုလည်း ရှိပါတယ်။ ဒီ constructor function က — သင့်လျော်တဲ့ type ရဲ့ range တွေ ဖြစ်တဲ့ — argument သုည ခု သို့မဟုတ် ထိုထက်ပို လက်ခံပါတယ်။ ဥပမာ:

```sql
SELECT nummultirange();
SELECT nummultirange(numrange(1.0, 14.0));
SELECT nummultirange(numrange(1.0, 14.0), numrange(20.0, 25.0));
```

### 8.17.7. Discrete Range Types (discrete range type များ)

Discrete range ဆိုတာ — element type မှာ ကောင်းစွာ သတ်မှတ်ထားတဲ့ “step” (တစ်ဆင့်ချင်း တိုးနှုန်း) ရှိတဲ့ range မျိုး ဖြစ်ပါတယ် — `integer` သို့မဟုတ် `date` လိုမျိုးပါ။ ဒီ type တွေမှာ — သူတို့ကြားမှာ valid တန်ဖိုး ဘာမှ မရှိတဲ့အခါ — element နှစ်ခုကို ကပ်လျက် (adjacent) လို့ ပြောနိုင်ပါတယ်။ ဒါက continuous range တွေနဲ့ ဆန့်ကျင်ဘက်ပါ — continuous range မှာတော့ ပေးထားတဲ့ တန်ဖိုး နှစ်ခုကြားမှာ တခြား element တန်ဖိုးတွေကို ဖော်ထုတ်ဖို့ အမြဲလိုလို (သို့မဟုတ် နီးပါး အမြဲ) ဖြစ်နိုင်ပါတယ်။ ဥပမာ — `numeric` type ပေါ်က range တစ်ခုက continuous ဖြစ်သလို — `timestamp` ပေါ်က range တစ်ခုလည်း continuous ဖြစ်ပါတယ်။ (`timestamp` မှာ precision အကန့်အသတ် ရှိလို့ — သီအိုရီအရ discrete အဖြစ် သဘောထားလို့ ရနိုင်ပေမယ့် — step size က ပုံမှန်အားဖြင့် စိတ်ဝင်စားစရာ မဟုတ်လို့ — continuous အဖြစ်ပဲ သတ်မှတ်တာ ပိုကောင်းပါတယ်။)

Discrete range type တစ်ခုကို တွေးကြည့်နိုင်တဲ့ နောက်တစ်နည်းကတော့ — element တန်ဖိုး တစ်ခုချင်းစီအတွက် “next” (နောက်တစ်ခု) သို့မဟုတ် “previous” (ယခင်) တန်ဖိုးဆိုတာ ရှင်းရှင်းလင်းလင်း ရှိနေတာပါ။ ဒါကို သိထားရင် — မူရင်း ပေးထားတဲ့ တန်ဖိုးအစား နောက်တစ်ခု သို့မဟုတ် ယခင် element တန်ဖိုးကို ရွေးချယ်ပြီး — range တစ်ခုရဲ့ bound တွေရဲ့ inclusive နဲ့ exclusive ကိုယ်စားပြုမှုတွေကြား ပြောင်းလဲလို့ ရပါတယ်။ ဥပမာ — integer range type တစ်ခုမှာ `[4,8]` နဲ့ `(3,9)` က တန်ဖိုး အစုတစ်ခုတည်းကို ရည်ညွှန်းပါတယ်; ဒါပေမယ့် numeric ပေါ်က range တစ်ခုအတွက်တော့ ဒီလို မဟုတ်ပါဘူး။

Discrete range type တစ်ခုမှာ — element type အတွက် လိုချင်တဲ့ step size ကို သိမြင်တဲ့ *canonicalization* function တစ်ခု ရှိသင့်ပါတယ်။ Canonicalization function ရဲ့ တာဝန်က — range type ရဲ့ ညီမျှတဲ့ (equivalent) တန်ဖိုးတွေကို — တူညီတဲ့ ကိုယ်စားပြုမှုပုံစံ ရှိအောင်၊ အထူးသဖြင့် တသမတ်တည်း inclusive သို့မဟုတ် exclusive bound တွေ ဖြစ်အောင် — ပြောင်းလဲပေးဖို့ ဖြစ်ပါတယ်။ Canonicalization function ကို သတ်မှတ်မထားရင် — တကယ်တမ်းမှာ တန်ဖိုး အစုတစ်ခုတည်းကို ကိုယ်စားပြုနေပေမယ့် — ပုံစံ မတူတဲ့ range တွေကို အမြဲတမ်း မညီမျှဘူးလို့ သတ်မှတ်ခံရမှာ ဖြစ်ပါတယ်။

Built-in range type တွေဖြစ်တဲ့ `int4range`, `int8range` နဲ့ `daterange` တွေ အားလုံးက — အောက် bound ပါဝင်ပြီး အပေါ် bound ဖယ်ထုတ်တဲ့ canonical ပုံစံကို သုံးပါတယ်; ဆိုလိုတာက `[)` ပုံစံပါ။ ဒါပေမယ့် user-defined range type တွေကတော့ တခြား convention တွေကို သုံးလို့ ရပါတယ်။

### 8.17.8. Defining New Range Types (range type အသစ်များ သတ်မှတ်ခြင်း)

User တွေက ကိုယ်ပိုင် range type တွေကို သတ်မှတ်နိုင်ပါတယ်။ ဒီလို လုပ်ရတဲ့ အဖြစ်အများဆုံး အကြောင်းရင်းကတော့ — built-in range type တွေထဲမှာ မပါဝင်တဲ့ subtype တွေပေါ်မှာ range တွေ သုံးချင်လို့ပါ။ ဥပမာ — subtype `float8` ရှိတဲ့ range type အသစ်တစ်ခု သတ်မှတ်ဖို့:

```sql
CREATE TYPE floatrange AS RANGE (
    subtype = float8,
    subtype_diff = float8mi
);

SELECT '[1.234, 5.678]'::floatrange;
```

`float8` မှာ အဓိပ္ပာယ် ရှိတဲ့ “step” မရှိတာကြောင့် — ဒီ ဥပမာမှာ canonicalization function တစ်ခုကို မသတ်မှတ်ပါဘူး။

ကိုယ်ပိုင် range တစ်ခု သတ်မှတ်လိုက်ရင် — သက်ဆိုင်ရာ multirange type တစ်ခုကိုပါ အလိုအလျောက် ရရှိပါတယ်။

ကိုယ်ပိုင် range type သတ်မှတ်ခြင်းက — သုံးစွဲရမယ့် မတူညီတဲ့ subtype B-tree operator class သို့မဟုတ် collation တစ်ခုကို သတ်မှတ်ခွင့်လည်း ပေးပါတယ် — ဒါကြောင့် ဘယ်တန်ဖိုးတွေ ဘယ် range ထဲ ကျရောက်မလဲဆိုတာကို ဆုံးဖြတ်ပေးတဲ့ sort ordering (စီစဉ်မှု အစီအစဉ်) ကို ပြောင်းလဲနိုင်ပါတယ်။

Subtype ရဲ့ တန်ဖိုးတွေက continuous မဟုတ်ဘဲ discrete လို့ သတ်မှတ်ရင် — `CREATE TYPE` command မှာ `canonical` function တစ်ခုကို သတ်မှတ်ပေးသင့်ပါတယ်။ Canonicalization function က input range တန်ဖိုးတစ်ခုကို ယူပြီး — bound နဲ့ ပုံစံ (formatting) မတူညီနိုင်တဲ့ ညီမျှတဲ့ range တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါမယ်။ တန်ဖိုး အစုတစ်ခုတည်းကို ကိုယ်စားပြုတဲ့ range နှစ်ခုရဲ့ canonical output က ထပ်တူကျရပါမယ် — ဥပမာ integer range `[1, 7]` နဲ့ `[1, 8)` တို့လိုမျိုးပါ။ ဘယ် ကိုယ်စားပြုမှုကို canonical အဖြစ် ရွေးမလဲဆိုတာ အရေးမကြီးပါဘူး — ပုံစံ မတူတဲ့ ညီမျှတန်ဖိုး နှစ်ခုက ပုံစံတူတဲ့ တန်ဖိုးတစ်ခုတည်းဆီကို အမြဲတမ်း ပုံဖော်ခံရသရွေ့တော့ပါ။ Inclusive/exclusive bound ပုံစံကို ချိန်ညှိတာအပြင် — canonicalization function က bound တန်ဖိုးတွေကို ပတ်ဖြတ် (round off) လုပ်ပေးနိုင်ပါတယ် — လိုချင်တဲ့ step size က subtype မှာ သိမ်းဆည်းနိုင်တာထက် ပိုကြီးနေတဲ့ အခါမျိုးမှာပါ။ ဥပမာ — `timestamp` ပေါ်က range type တစ်ခုကို step size တစ်နာရီနဲ့ သတ်မှတ်နိုင်ပြီး — အဲဒီအခါ canonicalization function က တစ်နာရီရဲ့ အဆ မဟုတ်တဲ့ bound တွေကို ပတ်ဖြတ်ဖို့ လိုအပ်ပါလိမ့်မယ် — ဒါမှမဟုတ် အဲဒီအစား error တစ်ခု ပစ်တင်နိုင်ပါတယ်။

ဒါအပြင် — GiST သို့မဟုတ် SP-GiST index တွေနဲ့ တွဲသုံးဖို့ ရည်ရွယ်ထားတဲ့ range type တိုင်းမှာ subtype difference function — `subtype_diff` — တစ်ခုကို သတ်မှတ်ပေးသင့်ပါတယ်။ (`subtype_diff` မပါဘဲနဲ့လည်း index က အလုပ်လုပ်ပါသေးတယ် — ဒါပေမယ့် difference function ပါဝင်တာထက် သိသိသာသာ ထိရောက်မှု နည်းနိုင်ပါတယ်။) Subtype difference function က subtype ရဲ့ input တန်ဖိုး နှစ်ခုကို ယူပြီး — သူတို့ရဲ့ ခြားနားချက် (ဆိုလိုတာက `X` အနှုတ် `Y`) ကို `float8` တန်ဖိုးအနေနဲ့ ပြန်ပေးပါတယ်။ အပေါ်က ဥပမာမှာဆိုရင် — သာမန် `float8` minus operator ရဲ့ အောက်ခံဖြစ်တဲ့ `float8mi` function ကို သုံးနိုင်ပါတယ်; ဒါပေမယ့် တခြား subtype တစ်ခုခုအတွက်တော့ type conversion တစ်ခုခု လိုအပ်ပါလိမ့်မယ်။ ခြားနားချက်တွေကို ကိန်းဂဏန်းတွေအနေနဲ့ ဘယ်လို ကိုယ်စားပြုမလဲဆိုတာနဲ့ ပတ်သက်ပြီး ဖန်တီးမှု ဆန်ဆန် တွေးခေါ်ဖို့လည်း လိုနိုင်ပါတယ်။ ဖြစ်နိုင်သမျှ အတိုင်းအတာအထိ — `subtype_diff` function က ရွေးချယ်ထားတဲ့ operator class နဲ့ collation တို့က ညွှန်ပြတဲ့ sort ordering နဲ့ ကိုက်ညီသင့်ပါတယ်; ဆိုလိုတာက — သူ့ရဲ့ ပထမ argument က ဒုတိယ argument ထက် sort ordering အရ ကြီးတဲ့အခါတိုင်း — သူ့ရဲ့ ရလဒ်က positive (အပေါင်းတန်ဖိုး) ဖြစ်သင့်ပါတယ်။

ရိုးရှင်းလွန်းမှု နည်းတဲ့ `subtype_diff` function ဥပမာတစ်ခုကတော့:

```sql
CREATE FUNCTION time_subtype_diff(x time, y time) RETURNS float8 AS
'SELECT EXTRACT(EPOCH FROM (x - y))' LANGUAGE sql STRICT IMMUTABLE;

CREATE TYPE timerange AS RANGE (
    subtype = time,
    subtype_diff = time_subtype_diff
);

SELECT '[11:10, 23:00]'::timerange;
```

Range type တွေ ဖန်တီးခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [CREATE TYPE](https://www.postgresql.org/docs/current/sql-createtype.html) ကို ကြည့်ပါ။

### 8.17.9. Indexing (index ပြုလုပ်ခြင်း)

GiST နဲ့ SP-GiST index တွေကို range type တွေရဲ့ table column တွေအတွက် ဖန်တီးနိုင်ပါတယ်။ GiST index တွေကို multirange type တွေရဲ့ table column တွေအတွက်လည်း ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — GiST index တစ်ခု ဖန်တီးဖို့:

```sql
CREATE INDEX reservation_idx ON reservation USING GIST (during);
```

Range တွေပေါ်က GiST သို့မဟုတ် SP-GiST index တစ်ခုက — ဒီ range operator တွေ ပါဝင်တဲ့ query တွေကို မြန်ဆန်စေနိုင်ပါတယ်: `=`, `&&`, `<@`, `@>`, `<<`, `>>`, `-|-`, `&<`, နဲ့ `&>` တို့ပါ။ Multirange တွေပေါ်က GiST index တစ်ခုကလည်း — အဲဒီ multirange operator အစုတစ်ခုတည်း ပါဝင်တဲ့ query တွေကို မြန်ဆန်စေနိုင်ပါတယ်။ Range တွေပေါ်က GiST index နဲ့ multirange တွေပေါ်က GiST index တွေက — ဒီ cross-type range-to-multirange နဲ့ multirange-to-range operator တွေ ပါဝင်တဲ့ query တွေကိုလည်း အသီးသီး မြန်ဆန်စေနိုင်ပါတယ်: `&&`, `<@`, `@>`, `<<`, `>>`, `-|-`, `&<`, နဲ့ `&>` တို့ပါ။ နောက်ထပ် အချက်အလက်အတွက် [ဇယား 9.58](https://www.postgresql.org/docs/current/functions-range.html#RANGE-OPERATORS-TABLE) ကို ကြည့်ပါ။

ဒါအပြင် — B-tree နဲ့ hash index တွေကိုလည်း range type တွေရဲ့ table column တွေအတွက် ဖန်တီးနိုင်ပါတယ်။ ဒီ index type တွေအတွက်တော့ — အခြေခံအားဖြင့် အသုံးဝင်တဲ့ range operation က equality (တူညီမှု) တစ်ခုတည်းပါ။ Range တန်ဖိုးတွေအတွက် — သက်ဆိုင်ရာ `<` နဲ့ `>` operator တွေပါတဲ့ B-tree sort ordering တစ်ခု သတ်မှတ်ထားပေမယ့် — အဲဒီ ordering က အတော်လေး ထင်သလို ဖြစ်ပြီး — လက်တွေ့ ကမ္ဘာမှာ သိပ်အသုံးမဝင်ပါဘူး။ Range type တွေရဲ့ B-tree နဲ့ hash ထောက်ပံ့မှုက — အဓိကအားဖြင့် query တွေထဲမှာ အတွင်းပိုင်း sorting နဲ့ hashing လုပ်နိုင်ဖို့ ရည်ရွယ်တာပါ — index အစစ်တွေ ဖန်တီးဖို့ မဟုတ်ပါဘူး။

### 8.17.10. Constraints on Ranges (range များပေါ်က constraint များ)

`UNIQUE` က scalar တန်ဖိုးတွေအတွက် သဘာဝကျတဲ့ constraint တစ်ခု ဖြစ်ပေမယ့် — range type တွေအတွက်တော့ ပုံမှန်အားဖြင့် မသင့်လျော်ပါဘူး။ အဲဒီအစား — exclusion constraint (ဖယ်ထုတ် ကန့်သတ်ချက်) တစ်ခုက မကြာခဏဆိုသလို ပိုသင့်လျော်ပါတယ် ([CREATE TABLE ... CONSTRAINT ... EXCLUDE](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-EXCLUDE) ကို ကြည့်ပါ)။ Exclusion constraint တွေက — range type တစ်ခုပေါ်မှာ “non-overlapping” (ထပ်နေမှု မရှိခြင်း) လိုမျိုး constraint တွေကို သတ်မှတ်ခွင့် ပေးပါတယ်။ ဥပမာ:

```sql
CREATE TABLE reservation (
    during tsrange,
    EXCLUDE USING GIST (during WITH &&)
);
```

ဒီ constraint က — table ထဲမှာ ထပ်နေတဲ့ (overlapping) တန်ဖိုးတွေ တစ်ချိန်တည်း မရှိနိုင်အောင် တားဆီးပေးပါလိမ့်မယ်:

```sql
INSERT INTO reservation VALUES
    ('[2010-01-01 11:30, 2010-01-01 15:00)');
INSERT 0 1

INSERT INTO reservation VALUES
    ('[2010-01-01 14:45, 2010-01-01 15:45)');
ERROR:  conflicting key value violates exclusion constraint "reservation_during_excl"
DETAIL:  Key (during)=(["2010-01-01 14:45:00","2010-01-01 15:45:00")) conflicts
with existing key (during)=(["2010-01-01 11:30:00","2010-01-01 15:00:00")).
```

သာမန် scalar data type တွေပေါ်မှာ exclusion constraint တွေ သတ်မှတ်ဖို့ [`btree_gist`](https://www.postgresql.org/docs/current/btree-gist.html) extension ကို သုံးနိုင်ပြီး — အမြင့်ဆုံး ပြောင်းလွယ်ပြင်လွယ် ရရှိဖို့ range exclusion တွေနဲ့ ပေါင်းစပ်သုံးနိုင်ပါတယ်။ ဥပမာ — `btree_gist` ကို install လုပ်ပြီးရင် — အောက်ပါ constraint က အစည်းအဝေး ခန်းနံပါတ်တွေ တူမှသာ ထပ်နေတဲ့ range တွေကို ငြင်းပယ်ပါလိမ့်မယ်:

```sql
CREATE EXTENSION btree_gist;
CREATE TABLE room_reservation (
    room text,
    during tsrange,
    EXCLUDE USING GIST (room WITH =, during WITH &&)
);

INSERT INTO room_reservation VALUES
    ('123A', '[2010-01-01 14:00, 2010-01-01 15:00)');
INSERT 0 1

INSERT INTO room_reservation VALUES
    ('123A', '[2010-01-01 14:30, 2010-01-01 15:30)');
ERROR:  conflicting key value violates exclusion constraint "room_reservation_room_during_excl"
DETAIL:  Key (room, during)=(123A, ["2010-01-01 14:30:00","2010-01-01 15:30:00")) conflicts
with existing key (room, during)=(123A, ["2010-01-01 14:00:00","2010-01-01 15:00:00")).

INSERT INTO room_reservation VALUES
    ('123B', '[2010-01-01 14:30, 2010-01-01 15:30)');
INSERT 0 1
```
