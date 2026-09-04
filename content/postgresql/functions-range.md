---
title: "Range/Multirange Functions and Operators (Range/Multirange လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "Range နှင့် multirange type များအတွက် အထူးပြု operator များနှင့် function များ — containment (ပါဝင်မှု), overlap (ထပ်နေမှု), union (ပေါင်းစည်းမှု), intersection (ဖြတ်ဆုံမှု) စသည့် လုပ်ဆောင်မှုများနှင့် lower/upper bound ဆိုင်ရာ function များအကြောင်း"
order: 87
source: "https://www.postgresql.org/docs/current/functions-range.html"
status: translated
updated: 2026-09-04
---

## 9.20. Range/Multirange Functions and Operators (Range/Multirange လုပ်ဆောင်ချက်များနှင့် operator များ)

Range type တွေရဲ့ ခြုံငုံ သုံးသပ်ချက်အတွက် [အပိုင်း 8.17](/docs/postgresql/rangetypes) ကို ကြည့်ပါ။

ဇယား 9.58 မှာ range type တွေအတွက် ရနိုင်တဲ့ အထူးပြု (specialized) operator တွေကို ပြထားပြီး — ဇယား 9.59 မှာတော့ multirange type တွေအတွက် ရနိုင်တဲ့ အထူးပြု operator တွေကို ပြထားပါတယ်။ ဒါတွေအပြင် — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ ပုံမှန် comparison operator တွေကိုလည်း range နဲ့ multirange type နှစ်မျိုးလုံးအတွက် သုံးလို့ ရပါတယ်။ Comparison operator တွေက range တွေရဲ့ အောက် bound (lower bound) တွေအလိုက် ပထမဆုံး အစီအစဉ် စီပေးပြီး — အောက် bound တွေ တူညီနေမှသာ အပေါ် bound (upper bound) တွေကို နှိုင်းယှဉ်ပါတယ်။ Multirange operator တွေကတော့ — range တစ်ခုက မညီမျှ ဖြစ်သွားတဲ့အထိ — range တစ်ခုချင်းစီကို နှိုင်းယှဉ်သွားပါတယ်။ ဒါက ပုံမှန်အားဖြင့် အသုံးဝင်တဲ့ စုစုပေါင်း အစီအစဉ် (ordering) တစ်ခုကို ဖြစ်ပေါ်စေလေ့ မရှိပေမယ့် — range တွေပေါ်မှာ unique index တွေ တည်ဆောက်နိုင်ဖို့အတွက် ဒီ operator တွေကို ထောက်ပံ့ပေးထားတာပါ။

**ဇယား 9.58. Range Operators (range operator များ)**

| Operator | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| anyrange @> anyrange → boolean | ပထမ range ထဲမှာ ဒုတိယ range ပါဝင်နေသလား? | int4range(2,4) @> int4range(2,3) → t |
| anyrange @> anyelement → boolean | Range ထဲမှာ element ပါဝင်နေသလား? | '[2011-01-01,2011-03-01)'::tsrange @> '2011-01-10'::timestamp → t |
| anyrange <@ anyrange → boolean | ပထမ range က ဒုတိယ range ထဲမှာ ပါဝင်နေသလား? | int4range(2,4) <@ int4range(1,7) → t |
| anyelement <@ anyrange → boolean | Element က range ထဲမှာ ပါဝင်နေသလား? | 42 <@ int4range(1,7) → f |
| anyrange && anyrange → boolean | Range တွေ တစ်ခုနဲ့တစ်ခု ထပ်နေသလား (ဆိုလိုတာက — element တစ်ခုခု အတူတူ ပါဝင်နေသလား)? | int8range(3,7) && int8range(4,12) → t |
| anyrange << anyrange → boolean | ပထမ range က ဒုတိယ range ရဲ့ ဘယ်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | int8range(1,10) << int8range(100,110) → t |
| anyrange >> anyrange → boolean | ပထမ range က ဒုတိယ range ရဲ့ ညာဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | int8range(50,60) >> int8range(20,30) → t |
| anyrange &< anyrange → boolean | ပထမ range က ဒုတိယ range ရဲ့ ညာဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | int8range(1,20) &< int8range(18,20) → t |
| anyrange &> anyrange → boolean | ပထမ range က ဒုတိယ range ရဲ့ ဘယ်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | int8range(7,20) &> int8range(5,10) → t |
| anyrange -\|- anyrange → boolean | Range တွေ တစ်ခုနဲ့တစ်ခု ကပ်လျက် (adjacent) ဖြစ်နေသလား? | numrange(1.1,2.2) -\|- numrange(2.2,3.3) → t |
| anyrange + anyrange → anyrange | Range တွေရဲ့ union (ပေါင်းစည်းမှု) ကို တွက်ပေးပါတယ်။ Range တွေက ထပ်နေရမယ် သို့မဟုတ် ကပ်လျက် ဖြစ်နေရမယ် — ဒါမှသာ union ရလဒ်က range တစ်ခုတည်း ဖြစ်မှာပါ (range_merge() ကိုလည်း ကြည့်ပါ)။ | numrange(5,15) + numrange(10,20) → [5,20) |
| anyrange * anyrange → anyrange | Range တွေရဲ့ intersection (ဖြတ်ဆုံမှု) ကို တွက်ပေးပါတယ်။ | int8range(5,15) * int8range(10,20) → [10,15) |
| anyrange - anyrange → anyrange | Range တွေရဲ့ difference (ခြားနားချက်) ကို တွက်ပေးပါတယ်။ ဒုတိယ range က ပထမ range ထဲမှာ — ရလဒ် difference က range တစ်ခုတည်း မဖြစ်တော့ဘူးလို့ ဖြစ်စေမယ့် နည်းလမ်းနဲ့ — ပါဝင်မနေရပါဘူး။ | int8range(5,15) - int8range(10,20) → [5,10) |

**ဇယား 9.59. Multirange Operators (multirange operator များ)**

| Operator | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| anymultirange @> anymultirange → boolean | ပထမ multirange ထဲမှာ ဒုတိယ multirange ပါဝင်နေသလား? | '{[2,4)}'::int4multirange @> '{[2,3)}'::int4multirange → t |
| anymultirange @> anyrange → boolean | Multirange ထဲမှာ range ပါဝင်နေသလား? | '{[2,4)}'::int4multirange @> int4range(2,3) → t |
| anymultirange @> anyelement → boolean | Multirange ထဲမှာ element ပါဝင်နေသလား? | '{[2011-01-01,2011-03-01)}'::tsmultirange @> '2011-01-10'::timestamp → t |
| anyrange @> anymultirange → boolean | Range ထဲမှာ multirange ပါဝင်နေသလား? | '[2,4)'::int4range @> '{[2,3)}'::int4multirange → t |
| anymultirange <@ anymultirange → boolean | ပထမ multirange က ဒုတိယ multirange ထဲမှာ ပါဝင်နေသလား? | '{[2,4)}'::int4multirange <@ '{[1,7)}'::int4multirange → t |
| anymultirange <@ anyrange → boolean | Multirange က range ထဲမှာ ပါဝင်နေသလား? | '{[2,4)}'::int4multirange <@ int4range(1,7) → t |
| anyrange <@ anymultirange → boolean | Range က multirange ထဲမှာ ပါဝင်နေသလား? | int4range(2,4) <@ '{[1,7)}'::int4multirange → t |
| anyelement <@ anymultirange → boolean | Element က multirange ထဲမှာ ပါဝင်နေသလား? | 4 <@ '{[1,7)}'::int4multirange → t |
| anymultirange && anymultirange → boolean | Multirange တွေ တစ်ခုနဲ့တစ်ခု ထပ်နေသလား (ဆိုလိုတာက — element တစ်ခုခု အတူတူ ပါဝင်နေသလား)? | '{[3,7)}'::int8multirange && '{[4,12)}'::int8multirange → t |
| anymultirange && anyrange → boolean | Multirange က range နဲ့ ထပ်နေသလား? | '{[3,7)}'::int8multirange && int8range(4,12) → t |
| anyrange && anymultirange → boolean | Range က multirange နဲ့ ထပ်နေသလား? | int8range(3,7) && '{[4,12)}'::int8multirange → t |
| anymultirange << anymultirange → boolean | ပထမ multirange က ဒုတိယ multirange ရဲ့ ဘယ်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | '{[1,10)}'::int8multirange << '{[100,110)}'::int8multirange → t |
| anymultirange << anyrange → boolean | Multirange က range ရဲ့ ဘယ်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | '{[1,10)}'::int8multirange << int8range(100,110) → t |
| anyrange << anymultirange → boolean | Range က multirange ရဲ့ ဘယ်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | int8range(1,10) << '{[100,110)}'::int8multirange → t |
| anymultirange >> anymultirange → boolean | ပထမ multirange က ဒုတိယ multirange ရဲ့ ညာဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | '{[50,60)}'::int8multirange >> '{[20,30)}'::int8multirange → t |
| anymultirange >> anyrange → boolean | Multirange က range ရဲ့ ညာဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | '{[50,60)}'::int8multirange >> int8range(20,30) → t |
| anyrange >> anymultirange → boolean | Range က multirange ရဲ့ ညာဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? | int8range(50,60) >> '{[20,30)}'::int8multirange → t |
| anymultirange &< anymultirange → boolean | ပထမ multirange က ဒုတိယ multirange ရဲ့ ညာဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | '{[1,20)}'::int8multirange &< '{[18,20)}'::int8multirange → t |
| anymultirange &< anyrange → boolean | Multirange က range ရဲ့ ညာဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | '{[1,20)}'::int8multirange &< int8range(18,20) → t |
| anyrange &< anymultirange → boolean | Range က multirange ရဲ့ ညာဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | int8range(1,20) &< '{[18,20)}'::int8multirange → t |
| anymultirange &> anymultirange → boolean | ပထမ multirange က ဒုတိယ multirange ရဲ့ ဘယ်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | '{[7,20)}'::int8multirange &> '{[5,10)}'::int8multirange → t |
| anymultirange &> anyrange → boolean | Multirange က range ရဲ့ ဘယ်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | '{[7,20)}'::int8multirange &> int8range(5,10) → t |
| anyrange &> anymultirange → boolean | Range က multirange ရဲ့ ဘယ်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? | int8range(7,20) &> '{[5,10)}'::int8multirange → t |
| anymultirange -\|- anymultirange → boolean | Multirange တွေ တစ်ခုနဲ့တစ်ခု ကပ်လျက် (adjacent) ဖြစ်နေသလား? | '{[1.1,2.2)}'::nummultirange -\|- '{[2.2,3.3)}'::nummultirange → t |
| anymultirange -\|- anyrange → boolean | Multirange က range နဲ့ ကပ်လျက် (adjacent) ဖြစ်နေသလား? | '{[1.1,2.2)}'::nummultirange -\|- numrange(2.2,3.3) → t |
| anyrange -\|- anymultirange → boolean | Range က multirange နဲ့ ကပ်လျက် (adjacent) ဖြစ်နေသလား? | numrange(1.1,2.2) -\|- '{[2.2,3.3)}'::nummultirange → t |
| anymultirange + anymultirange → anymultirange | Multirange တွေရဲ့ union (ပေါင်းစည်းမှု) ကို တွက်ပေးပါတယ်။ Multirange တွေက ထပ်နေဖို့ သို့မဟုတ် ကပ်လျက် ဖြစ်နေဖို့ မလိုပါဘူး။ | '{[5,10)}'::nummultirange + '{[15,20)}'::nummultirange → {[5,10), [15,20)} |
| anymultirange * anymultirange → anymultirange | Multirange တွေရဲ့ intersection (ဖြတ်ဆုံမှု) ကို တွက်ပေးပါတယ်။ | '{[5,15)}'::int8multirange * '{[10,20)}'::int8multirange → {[10,15)} |
| anymultirange - anymultirange → anymultirange | Multirange တွေရဲ့ difference (ခြားနားချက်) ကို တွက်ပေးပါတယ်။ | '{[5,20)}'::int8multirange - '{[10,15)}'::int8multirange → {[5,10), [15,20)} |

ဗလာ (empty) range သို့မဟုတ် multirange တစ်ခု ပါဝင်ပတ်သက်နေရင် — left-of/right-of (ဘယ်ဘက်/ညာဘက်မှာ ရှိခြင်း) နဲ့ adjacent (ကပ်လျက်) operator တွေက အမြဲတမ်း false ပြန်ပေးပါတယ်; ဆိုလိုတာက — ဗလာ range တစ်ခုကို တခြား range တစ်ခုခုရဲ့ ရှေ့မှာ သို့မဟုတ် နောက်မှာ ရှိတယ်လို့ ဘယ်တော့မှ သတ်မှတ် မခံရပါဘူး။

ဒါကလွဲလို့ တခြားနေရာတွေမှာတော့ — ဗလာ range နဲ့ multirange တွေကို additive identity (ပေါင်းလိုက်ရင် မူလတန်ဖိုးကိုယ်တိုင် ပြန်ရစေတဲ့ တန်ဖိုး) အနေနဲ့ သတ်မှတ် ကိုင်တွယ်ပါတယ်: ဘယ်အရာကိုမဆို ဗလာ တန်ဖိုးတစ်ခုနဲ့ union လုပ်ရင် အဲဒီအရာကိုယ်တိုင်ပဲ ရပြီး — ဘယ်အရာကနေမဆို ဗလာ တန်ဖိုးတစ်ခုကို နုတ်လိုက်ရင်လည်း အဲဒီအရာကိုယ်တိုင်ပဲ ရပါတယ်။ ဗလာ multirange တစ်ခုမှာ ဗလာ range တစ်ခုနဲ့ အတိအကျ တူညီတဲ့ point (အမှတ်) တွေပဲ ရှိပါတယ်။ Range တိုင်းက ဗလာ range ကို ပါဝင်ပြီး — multirange တိုင်းထဲမှာလည်း ကြိုက်သလောက် များများစားစား ဗလာ range တွေ ပါဝင်နိုင်ပါတယ်။

ရလဒ် range ထဲမှာ — ထပ်မနေတဲ့ (disjoint) sub-range နှစ်ခု ပါဝင်နေဖို့ လိုအပ်လာမယ်ဆိုရင် — range union နဲ့ difference operator တွေက fail (မအောင်မြင်) ဖြစ်သွားပါတယ် — အကြောင်းကတော့ အဲဒီလို range မျိုးကို ကိုယ်စားပြုလို့ မရလို့ပါ။ Union နဲ့ difference အတွက် — multirange parameters တွေကို လက်ခံပြီး multirange ပြန်ပေးတဲ့ — သီးခြား operator တွေ ရှိပြီး — အဲဒါတွေကတော့ arguments တွေ ထပ်မနေဘူးဆိုရင်တောင် fail မဖြစ်ပါဘူး။ ဒါကြောင့် — ထပ်မနေနိုင်တဲ့ range တွေအတွက် union သို့မဟုတ် difference လုပ်ဆောင်မှု လိုအပ်ရင် — ကိုယ့်ရဲ့ range တွေကို ပထမဆုံး multirange အဖြစ် cast (ပြောင်းလဲ) လုပ်ခြင်းအားဖြင့် error တွေကို ရှောင်ရှားနိုင်ပါတယ်။

ဇယား 9.60 မှာ range type တွေနဲ့ တွဲသုံးဖို့ ရနိုင်တဲ့ function တွေကို ပြထားပြီး — ဇယား 9.61 မှာတော့ multirange type တွေနဲ့ တွဲသုံးဖို့ ရနိုင်တဲ့ function တွေကို ပြထားပါတယ်။

**ဇယား 9.60. Range Functions (range လုပ်ဆောင်ချက်များ)**

| Function | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| lower ( anyrange ) → anyelement | Range ရဲ့ အောက် bound (lower bound) ကို ထုတ်ယူပါတယ် (range က ဗလာ ဖြစ်နေရင် သို့မဟုတ် အောက် bound မရှိရင် NULL ပြန်ပေးပါတယ်)။ | lower(numrange(1.1,2.2)) → 1.1 |
| upper ( anyrange ) → anyelement | Range ရဲ့ အပေါ် bound (upper bound) ကို ထုတ်ယူပါတယ် (range က ဗလာ ဖြစ်နေရင် သို့မဟုတ် အပေါ် bound မရှိရင် NULL ပြန်ပေးပါတယ်)။ | upper(numrange(1.1,2.2)) → 2.2 |
| isempty ( anyrange ) → boolean | Range က ဗလာ (empty) ဖြစ်နေသလား? | isempty(numrange(1.1,2.2)) → f |
| lower_inc ( anyrange ) → boolean | Range ရဲ့ အောက် bound က inclusive ဖြစ်နေသလား? | lower_inc(numrange(1.1,2.2)) → t |
| upper_inc ( anyrange ) → boolean | Range ရဲ့ အပေါ် bound က inclusive ဖြစ်နေသလား? | upper_inc(numrange(1.1,2.2)) → f |
| lower_inf ( anyrange ) → boolean | Range မှာ အောက် bound မရှိဘူးလား? (အောက် bound က -Infinity ဆိုရင်တော့ false ပြန်ပေးပါတယ်။) | lower_inf('(,)'::daterange) → t |
| upper_inf ( anyrange ) → boolean | Range မှာ အပေါ် bound မရှိဘူးလား? (အပေါ် bound က Infinity ဆိုရင်တော့ false ပြန်ပေးပါတယ်။) | upper_inf('(,)'::daterange) → t |
| range_merge ( anyrange, anyrange ) → anyrange | ပေးထားတဲ့ range နှစ်ခုလုံးကို ပါဝင်တဲ့ အသေးဆုံး range ကို တွက်ပေးပါတယ်။ | range_merge('[1,2)'::int4range, '[3,4)'::int4range) → [1,4) |

**ဇယား 9.61. Multirange Functions (multirange လုပ်ဆောင်ချက်များ)**

| Function | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| lower ( anymultirange ) → anyelement | Multirange ရဲ့ အောက် bound (lower bound) ကို ထုတ်ယူပါတယ် (multirange က ဗလာ ဖြစ်နေရင် သို့မဟုတ် အောက် bound မရှိရင် NULL ပြန်ပေးပါတယ်)။ | lower('{[1.1,2.2)}'::nummultirange) → 1.1 |
| upper ( anymultirange ) → anyelement | Multirange ရဲ့ အပေါ် bound (upper bound) ကို ထုတ်ယူပါတယ် (multirange က ဗလာ ဖြစ်နေရင် သို့မဟုတ် အပေါ် bound မရှိရင် NULL ပြန်ပေးပါတယ်)။ | upper('{[1.1,2.2)}'::nummultirange) → 2.2 |
| isempty ( anymultirange ) → boolean | Multirange က ဗလာ (empty) ဖြစ်နေသလား? | isempty('{[1.1,2.2)}'::nummultirange) → f |
| lower_inc ( anymultirange ) → boolean | Multirange ရဲ့ အောက် bound က inclusive ဖြစ်နေသလား? | lower_inc('{[1.1,2.2)}'::nummultirange) → t |
| upper_inc ( anymultirange ) → boolean | Multirange ရဲ့ အပေါ် bound က inclusive ဖြစ်နေသလား? | upper_inc('{[1.1,2.2)}'::nummultirange) → f |
| lower_inf ( anymultirange ) → boolean | Multirange မှာ အောက် bound မရှိဘူးလား? (အောက် bound က -Infinity ဆိုရင်တော့ false ပြန်ပေးပါတယ်။) | lower_inf('{(,)}'::datemultirange) → t |
| upper_inf ( anymultirange ) → boolean | Multirange မှာ အပေါ် bound မရှိဘူးလား? (အပေါ် bound က Infinity ဆိုရင်တော့ false ပြန်ပေးပါတယ်။) | upper_inf('{(,)}'::datemultirange) → t |
| range_merge ( anymultirange ) → anyrange | Multirange တစ်ခုလုံးကို ပါဝင်တဲ့ အသေးဆုံး range ကို တွက်ပေးပါတယ်။ | range_merge('{[1,2), [3,4)}'::int4multirange) → [1,4) |
| multirange ( anyrange ) → anymultirange | ပေးထားတဲ့ range တစ်ခုတည်းကိုပဲ ပါဝင်တဲ့ multirange တစ်ခုကို ပြန်ပေးပါတယ်။ | multirange('[1,2)'::int4range) → {[1,2)} |
| unnest ( anymultirange ) → setof anyrange | Multirange တစ်ခုကို — ကြီးစဉ်ငယ်လိုက် (ascending) အစီအစဉ်အတိုင်း — range တွေရဲ့ set (အစု) တစ်ခုအဖြစ် ချဲ့ထွက်ပေးပါတယ်။ | unnest('{[1,2), [3,4)}'::int4multirange) →   [1,2)  [3,4) |

`lower_inc`, `upper_inc`, `lower_inf` နဲ့ `upper_inf` function တွေ အားလုံးက — ဗလာ range သို့မဟုတ် ဗလာ multirange တစ်ခုအတွက်ဆိုရင် — false ပြန်ပေးပါတယ်။
