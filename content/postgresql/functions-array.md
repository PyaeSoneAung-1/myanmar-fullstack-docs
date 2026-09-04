---
title: "Array Functions and Operators (array လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ array types များအတွက် operators နှင့် functions များ — array operator များ (ဇယား 9.56) နှင့် array function များ (ဇယား 9.57) စာရင်းအပြည့်အစုံ"
order: 86
source: "https://www.postgresql.org/docs/current/functions-array.html"
status: translated
updated: 2026-09-04
---

## 9.19. Array Functions and Operators (array လုပ်ဆောင်ချက်များနှင့် operator များ)

ဇယား 9.56 မှာ array types တွေအတွက် ရနိုင်တဲ့ — အထူးပြု (specialized) operator တွေကို ပြထားပါတယ်။ ဒါတွေအပြင် — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ — သာမန် comparison operator တွေကိုလည်း array တွေအတွက် သုံးလို့ ရပါတယ်။ Comparison operator တွေက array ရဲ့ ပါဝင်မှုတွေကို — element data type အတွက် ပုံမှန် (default) B-tree comparison function ကို သုံးပြီး — element-by-element (element တစ်ခုချင်းစီ) နှိုင်းယှဉ်ပြီး — ပထမဆုံး ကွာခြားချက်ကို အခြေခံပြီး အစီအစဉ် စီပါတယ်။ Multidimensional array တွေမှာ element တွေကို row-major order (အတန်းလိုက် အလျင်ထား စီသည့် အစီအစဉ်) အတိုင်း ဖတ်ပါတယ် — ဆိုလိုတာက နောက်ဆုံး subscript က အမြန်ဆုံး ပြောင်းလဲပါတယ်။ Array နှစ်ခုရဲ့ ပါဝင်မှုတွေ တူညီပေမယ့် dimensionality (အတိုင်းအတာ အရေအတွက်) ကွာခြားနေရင် — dimensionality အချက်အလက်ထဲက ပထမဆုံး ကွာခြားချက်က အစီအစဉ် စီတာကို ဆုံးဖြတ်ပါတယ်။

**ဇယား 9.56. Array Operators (array operator များ)**

| Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| anyarray @> anyarray → boolean ပထမ array ထဲမှာ ဒုတိယ array ပါဝင်နေသလား — ဆိုလိုတာက ဒုတိယ array ထဲမှာ ပေါ်လာတဲ့ element တစ်ခုချင်းစီက ပထမ array ရဲ့ element တစ်ခုခုနဲ့ ညီမျှနေသလား ဆိုတာပါ။ (Duplicates (ထပ်နေသော တန်ဖိုးများ) တွေကို အထူး သဘောမထားပါဘူး — ဒါကြောင့် ARRAY[1] နဲ့ ARRAY[1,1] တို့က တစ်ခုကိုတစ်ခု ပါဝင်သည်လို့ အသီးသီး သတ်မှတ်ပါတယ်။) ARRAY[1,4,3] @> ARRAY[3,1,3] → t |
| anyarray <@ anyarray → boolean ပထမ array က ဒုတိယ array ထဲမှာ ပါဝင်နေသလား။ ARRAY[2,2,7] <@ ARRAY[1,7,4,2,6] → t |
| anyarray && anyarray → boolean ဒီ array တွေ ထပ်နေသလား (overlap) — ဆိုလိုတာက ဘုံ element (common elements) တစ်ခုခု မျှဝေထားသလား ဆိုတာပါ။ ARRAY[1,4,3] && ARRAY[2,1] → t |
| anycompatiblearray \|\| anycompatiblearray → anycompatiblearray Array နှစ်ခုကို ဆက်စပ် (concatenate) ပေးပါတယ်။ Null သို့မဟုတ် empty array တစ်ခုကို ဆက်စပ်တာက no-op (အကျိုးသက်ရောက်မှု မရှိခြင်း) ပါ; မဟုတ်ရင် — array တွေမှာ dimension အရေအတွက် တူညီနေရပါမယ် (ပထမ ဥပမာမှာ ပြထားသလို) ဒါမှမဟုတ် dimension အရေအတွက် တစ်ခုနဲ့ ကွာခြားနေရပါမယ် (ဒုတိယ ဥပမာမှာ ပြထားသလို)။ Array တွေရဲ့ element types တွေ တစ်ထပ်တည်း မဟုတ်ဘူးဆိုရင် — ၎င်းတို့ကို common type (ဘုံ type) တစ်ခုဆီသို့ coerce (ပြောင်းလဲ) လုပ်ခံရပါလိမ့်မယ် (အပိုင်း 10.5 ကို ကြည့်ပါ)။ ARRAY[1,2,3] \|\| ARRAY[4,5,6,7] → {1,2,3,4,5,6,7} ARRAY[1,2,3] \|\| ARRAY[[4,5,6],[7,8,9.9]] → {{1,2,3},{4,5,6},{7,8,9.9}} |
| anycompatible \|\| anycompatiblearray → anycompatiblearray Element တစ်ခုကို array တစ်ခုရဲ့ ရှေ့ဆုံး (front) မှာ ထပ်ဖြည့် ဆက်စပ်ပေးပါတယ် (array က empty သို့မဟုတ် one-dimensional ဖြစ်ရပါမယ်)။ 3 \|\| ARRAY[4,5,6] → {3,4,5,6} |
| anycompatiblearray \|\| anycompatible → anycompatiblearray Element တစ်ခုကို array တစ်ခုရဲ့ နောက်ဆုံး (end) မှာ ထပ်ဖြည့် ဆက်စပ်ပေးပါတယ် (array က empty သို့မဟုတ် one-dimensional ဖြစ်ရပါမယ်)။ ARRAY[4,5,6] \|\| 7 → {4,5,6,7} |

[အပိုင်း 8.15](/docs/postgresql/arrays) မှာ — array operator တွေရဲ့ အပြုအမူ (behavior) အကြောင်း — အသေးစိတ် ကြည့်ပါ။ ဘယ် operator တွေက indexed operations (index သုံး၍ ပြုလုပ်သည့် လုပ်ဆောင်ချက်များ) ကို ထောက်ပံ့ပေးလဲဆိုတဲ့ အသေးစိတ်ကိုတော့ [အပိုင်း 11.2](/docs/postgresql/indexes-types) မှာ ကြည့်ပါ။

ဇယား 9.57 မှာ array types တွေနဲ့ တွဲဖက် အသုံးပြုလို့ ရတဲ့ functions တွေကို ပြထားပါတယ်။ ဒီ functions တွေရဲ့ အသုံးပြုပုံဆိုင်ရာ နောက်ထပ် အချက်အလက်တွေနဲ့ ဥပမာတွေအတွက် [အပိုင်း 8.15](/docs/postgresql/arrays) ကို ကြည့်ပါ။

**ဇယား 9.57. Array Functions (array function များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| array_append ( anycompatiblearray, anycompatible ) → anycompatiblearray Element တစ်ခုကို array တစ်ခုရဲ့ အဆုံးမှာ ထပ်ဖြည့်ပေးပါတယ် (anycompatiblearray \|\| anycompatible operator နဲ့ အတူတူပါ)။ array_append(ARRAY[1,2], 3) → {1,2,3} |
| array_cat ( anycompatiblearray, anycompatiblearray ) → anycompatiblearray Array နှစ်ခုကို ဆက်စပ်ပေးပါတယ် (anycompatiblearray \|\| anycompatiblearray operator နဲ့ အတူတူပါ)။ array_cat(ARRAY[1,2,3], ARRAY[4,5]) → {1,2,3,4,5} |
| array_dims ( anyarray ) → text Array ရဲ့ dimensions တွေရဲ့ text ကိုယ်စားပြုပုံ (representation) တစ်ခုကို ပြန်ပေးပါတယ်။ array_dims(ARRAY[[1,2,3], [4,5,6]]) → [1:2][1:3] |
| array_fill ( anyelement, integer[] [, integer[] ] ) → anyarray ပေးထားတဲ့ တန်ဖိုးရဲ့ copies (မိတ္တူများ) တွေနဲ့ ပြည့်နေတဲ့ array တစ်ခုကို ပြန်ပေးပါတယ် — ဒုတိယ argument က သတ်မှတ်တဲ့ lengths (အလျားများ) တွေကို dimensions အဖြစ်ထားပါတယ်။ Optional ဖြစ်တဲ့ တတိယ argument က dimension တစ်ခုချင်းစီအတွက် lower-bound တန်ဖိုးတွေကို ပေးပါတယ် (ပုံမှန်အားဖြင့် အားလုံး 1 ဖြစ်ပါတယ်)။ array_fill(11, ARRAY[2,3]) → {{11,11,11},{11,11,11}} array_fill(7, ARRAY[3], ARRAY[2]) → [2:4]={7,7,7} |
| array_length ( anyarray, integer ) → integer တောင်းဆိုထားတဲ့ array dimension ရဲ့ အလျားကို ပြန်ပေးပါတယ်။ (Empty သို့မဟုတ် မရှိတဲ့ array dimensions တွေအတွက် 0 အစား NULL ထုတ်ပေးပါတယ်။) array_length(array[1,2,3], 1) → 3 array_length(array[]::int[], 1) → NULL array_length(array['text'], 2) → NULL |
| array_lower ( anyarray, integer ) → integer တောင်းဆိုထားတဲ့ array dimension ရဲ့ lower bound (အောက် နယ်နိမိတ်) ကို ပြန်ပေးပါတယ်။ array_lower('[0:2]={1,2,3}'::integer[], 1) → 0 |
| array_ndims ( anyarray ) → integer Array ရဲ့ dimension အရေအတွက်ကို ပြန်ပေးပါတယ်။ array_ndims(ARRAY[[1,2,3], [4,5,6]]) → 2 |
| array_position ( anycompatiblearray, anycompatible [, integer ] ) → integer Array ထဲမှာ ဒုတိယ argument ပထမဆုံး ပေါ်လာတဲ့ နေရာရဲ့ subscript (အညွှန်းကိန်း) ကို ပြန်ပေးပါတယ် — မရှိဘူးဆိုရင် NULL ပါ။ တတိယ argument ကို ပေးထားရင် — ရှာဖွေမှုက အဲဒီ subscript ကနေ စတင်ပါတယ်။ Array က one-dimensional ဖြစ်ရပါမယ်။ နှိုင်းယှဉ်မှုတွေကို IS NOT DISTINCT FROM semantics နဲ့ လုပ်ပါတယ် — ဒါကြောင့် NULL ကိုပါ ရှာဖွေလို့ ရပါတယ်။ array_position(ARRAY['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], 'mon') → 2 |
| array_positions ( anycompatiblearray, anycompatible ) → integer[] ပထမ argument အနေနဲ့ ပေးထားတဲ့ array ထဲမှာ ဒုတိယ argument ပေါ်ပေါက်တဲ့ နေရာ အားလုံးရဲ့ subscripts (အညွှန်းကိန်းများ) တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Array က one-dimensional ဖြစ်ရပါမယ်။ နှိုင်းယှဉ်မှုတွေကို IS NOT DISTINCT FROM semantics နဲ့ လုပ်ပါတယ် — ဒါကြောင့် NULL ကိုပါ ရှာဖွေလို့ ရပါတယ်။ Array ကိုယ်တိုင် NULL ဖြစ်နေမှသာ NULL ကို ပြန်ပေးပါတယ်; array ထဲမှာ တန်ဖိုးကို မတွေ့ရရင် — empty array တစ်ခုကို ပြန်ပေးပါတယ်။ array_positions(ARRAY['A','A','B','A'], 'A') → {1,2,4} |
| array_prepend ( anycompatible, anycompatiblearray ) → anycompatiblearray Element တစ်ခုကို array တစ်ခုရဲ့ အစမှာ ရှေ့ကနေ ထည့်ပေးပါတယ် (anycompatible \|\| anycompatiblearray operator နဲ့ အတူတူပါ)။ array_prepend(1, ARRAY[2,3]) → {1,2,3} |
| array_remove ( anycompatiblearray, anycompatible ) → anycompatiblearray ပေးထားတဲ့ တန်ဖိုးနဲ့ ညီမျှတဲ့ element တွေ အားလုံးကို array ထဲကနေ ဖယ်ရှားပေးပါတယ်။ Array က one-dimensional ဖြစ်ရပါမယ်။ နှိုင်းယှဉ်မှုတွေကို IS NOT DISTINCT FROM semantics နဲ့ လုပ်ပါတယ် — ဒါကြောင့် NULL တွေကိုပါ ဖယ်ရှားလို့ ရပါတယ်။ array_remove(ARRAY[1,2,3,2], 2) → {1,3} |
| array_replace ( anycompatiblearray, anycompatible, anycompatible ) → anycompatiblearray ဒုတိယ argument နဲ့ ညီမျှတဲ့ array element တစ်ခုချင်းစီကို တတိယ argument နဲ့ အစားထိုးပေးပါတယ်။ array_replace(ARRAY[1,2,5,4], 5, 3) → {1,2,3,4} |
| array_reverse ( anyarray ) → anyarray Array ရဲ့ ပထမ dimension ကို ပြောင်းပြန် လှန်ပေးပါတယ် (reverses)။ array_reverse(ARRAY[[1,2],[3,4],[5,6]]) → {{5,6},{3,4},{1,2}} |
| array_sample ( array anyarray, n integer ) → anyarray array ထဲကနေ ကျပန်း (randomly) ရွေးချယ်ထားတဲ့ item အရေအတွက် n ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ n က array ရဲ့ ပထမ dimension ရဲ့ အလျားကို ကျော်လွန်လို့ မရပါဘူး။ array က multi-dimensional ဖြစ်နေရင် — “item” ဆိုတာ သတ်မှတ်ထားတဲ့ ပထမ subscript တစ်ခု ရှိတဲ့ slice (အပိုင်းအစ) တစ်ခုပါ။ array_sample(ARRAY[1,2,3,4,5,6], 3) → {2,6,1} array_sample(ARRAY[[1,2],[3,4],[5,6]], 2) → {{5,6},{1,2}} |
| array_shuffle ( anyarray ) → anyarray Array ရဲ့ ပထမ dimension ကို ကျပန်း ရောမွှေ (shuffle) ပေးပါတယ်။ array_shuffle(ARRAY[[1,2],[3,4],[5,6]]) → {{5,6},{1,2},{3,4}} |
| array_sort ( array anyarray [, descending boolean [, nulls_first boolean ]] ) → anyarray Array ရဲ့ ပထမ dimension ကို စီပေးပါတယ် (sorts)။ စီခြင်း အစီအစဉ်ကို array ရဲ့ element type ရဲ့ ပုံမှန် (default) sort ordering က ဆုံးဖြတ်ပါတယ်; ဒါပေမယ့် — element type က collatable (စီစဉ် နှိုင်းယှဉ်လို့ ရသော) ဖြစ်နေရင် — သုံးရမယ့် collation ကို array argument ဆီ COLLATE clause တစ်ခု ထည့်ပြီး သတ်မှတ်နိုင်ပါတယ်။ descending က true ဖြစ်ရင် — descending order (ဆင်းသက်သည့် အစီအစဉ်) နဲ့ စီပေးပြီး — မဟုတ်ရင် ascending order (တက်သည့် အစီအစဉ်) နဲ့ စီပါတယ်။ ချန်လိုက်ရင် — ပုံမှန်အားဖြင့် ascending order ပါ။ nulls_first က true ဖြစ်ရင် — null တွေက non-null တန်ဖိုးတွေရဲ့ ရှေ့မှာ ပေါ်ပြီး — မဟုတ်ရင် null တွေက non-null တန်ဖိုးတွေရဲ့ နောက်မှာ ပေါ်ပါတယ်။ nulls_first ကို ချန်လိုက်ရင် — descending ရဲ့ တန်ဖိုးနဲ့ အတူတူပဲ ယူဆပါတယ်။ array_sort(ARRAY[[2,4],[2,1],[6,5]]) → {{2,1},{2,4},{6,5}} |
| array_to_string ( array anyarray, delimiter text [, null_string text ] ) → text Array element တစ်ခုချင်းစီကို ၎င်းရဲ့ text ကိုယ်စားပြုပုံအဖြစ် ပြောင်းပြီး — delimiter string နဲ့ ခြားကာ — ဆက်စပ်ပေးပါတယ်။ null_string ကို ပေးထားပြီး NULL မဟုတ်ရင် — NULL array entries တွေကို အဲဒီ string နဲ့ ကိုယ်စားပြုပါတယ်; မဟုတ်ရင် — ၎င်းတို့ကို ချန်လိုက်ပါတယ် (omitted)။ string_to_array ကိုလည်း ကြည့်ပါ။ array_to_string(ARRAY[1, 2, 3, NULL, 5], ',', '*') → 1,2,3,*,5 |
| array_upper ( anyarray, integer ) → integer တောင်းဆိုထားတဲ့ array dimension ရဲ့ upper bound (အထက် နယ်နိမိတ်) ကို ပြန်ပေးပါတယ်။ array_upper(ARRAY[1,8,3,7], 1) → 4 |
| cardinality ( anyarray ) → integer Array ထဲမှာ ရှိတဲ့ element စုစုပေါင်း အရေအတွက်ကို ပြန်ပေးပါတယ် — array က empty ဖြစ်ရင် 0 ပါ။ cardinality(ARRAY[[1,2],[3,4]]) → 4 |
| trim_array ( array anyarray, n integer ) → anyarray Array ရဲ့ နောက်ဆုံး element အရေအတွက် n ခုကို ဖယ်ရှားပြီး ဖြတ်တောက်ပေးပါတယ် (trims)။ Array က multidimensional ဖြစ်နေရင် — ပထမ dimension တစ်ခုတည်းကိုပဲ ဖြတ်တောက်ပါတယ်။ trim_array(ARRAY[1,2,3,4,5,6], 2) → {1,2,3,4} |
| unnest ( anyarray ) → setof anyelement Array တစ်ခုကို row set (row အစု) တစ်ခုအဖြစ် ချဲ့ထွက်ပေးပါတယ် (expands)။ Array ရဲ့ element တွေကို storage order (သိမ်းဆည်းထားသည့် အစီအစဉ်) အတိုင်း ဖတ်ထုတ်ပါတယ်။ unnest(ARRAY[1,2]) →   1  2  unnest(ARRAY[['foo','bar'],['baz','quux']]) →   foo  bar  baz  quux |
| unnest ( anyarray, anyarray [, ... ] ) → setof anyelement, anyelement [, ... ] Array အများအပြား (data types ကွဲပြားနိုင်ပါတယ်) ကို row set တစ်ခုအဖြစ် ချဲ့ထွက်ပေးပါတယ်။ Array တွေ အားလုံး တူညီတဲ့ အလျား မရှိဘူးဆိုရင် — ပိုတိုတဲ့ array တွေကို NULL တွေနဲ့ ဖြည့်ပေးပါတယ် (padded)။ ဒီ form ကို query တစ်ခုရဲ့ FROM clause ထဲမှာပဲ သုံးလို့ ရပါတယ်; အပိုင်း 7.2.1.4 ကို ကြည့်ပါ။ select * from unnest(ARRAY[1,2], ARRAY['foo','bar','baz']) as x(a,b) →   a \|  b ---+-----  1 \| foo  2 \| bar    \| baz |

Array တွေနဲ့ တွဲသုံးတဲ့ aggregate function `array_agg` အကြောင်းကို [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) မှာလည်း ကြည့်နိုင်ပါတယ်။
