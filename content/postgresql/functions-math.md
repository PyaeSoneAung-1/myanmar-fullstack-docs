---
title: "Mathematical Functions and Operators (သင်္ချာ လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ သင်္ချာ (mathematical) functions နှင့် operators များ — သင်္ချာ operators နှင့် functions ဇယားများ၊ random (ကျပန်း) functions များ၊ trigonometric နှင့် hyperbolic functions များအကြောင်း ဖော်ပြချက်များ"
order: 70
source: "https://www.postgresql.org/docs/current/functions-math.html"
status: translated
updated: 2026-09-04
---

## 9.3. Mathematical Functions and Operators (သင်္ချာ လုပ်ဆောင်ချက်များနှင့် operator များ)

Mathematical operators (သင်္ချာ operator များ) တွေကို PostgreSQL types အများအပြားအတွက် ထောက်ပံ့ပေးထားပါတယ်။ ပုံမှန် သင်္ချာ စည်းမျဉ်းတွေ (standard mathematical conventions) မရှိတဲ့ types တွေ (ဥပမာ — date/time types) အတွက်ကတော့ — နောက်အပိုင်းတွေမှာ တကယ့် အပြုအမူ (actual behavior) တွေကို ဖော်ပြထားပါတယ်။

ဇယား 9.4 မှာ standard numeric types (စံ ကိန်းဂဏန်း types) တွေအတွက် ရနိုင်တဲ့ သင်္ချာ operators တွေကို ပြသထားပါတယ်။ `numeric_type` ကို လက်ခံတယ်လို့ ပြထားတဲ့ operators တွေက — အထူး ဖော်ပြထားခြင်း မရှိဘူးဆိုရင် — `smallint`, `integer`, `bigint`, `numeric`, `real` နဲ့ `double precision` types တွေ အားလုံးအတွက် ရနိုင်ပါတယ်။ `integral_type` ကို လက်ခံတယ်လို့ ပြထားတဲ့ operators တွေကတော့ `smallint`, `integer` နဲ့ `bigint` types တွေအတွက် ရပါတယ်။ Operator ပုံစံ (form) တစ်ခုချင်းစီက — အထူး ဖော်ပြထားတဲ့ နေရာတွေကလွဲရင် — သူ့ရဲ့ argument(s) တွေနဲ့ တူညီတဲ့ data type ကို ပြန်ပေးပါတယ်။ Argument data types အများအပြား ပါဝင်တဲ့ ခေါ်ဆိုမှု (call) တွေ — ဥပမာ `integer` `+` `numeric` — ကိုတော့ ဒီစာရင်းတွေထဲမှာ နောက်ကျမှ ပေါ်လာတဲ့ type ကို သုံးပြီး ဖြေရှင်းပါတယ် (resolved)။

**ဇယား 9.4. Mathematical Operators (သင်္ချာ operators များ)**

| Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| numeric_type + numeric_type → numeric_type addition (ပေါင်းခြင်း) 2 + 3 → 5 |
| + numeric_type → numeric_type unary plus (တစ်ဖက်သတ် ပေါင်းခြင်း; ဘာမှ လုပ်ဆောင်မှု မရှိပါ) + 3.5 → 3.5 |
| numeric_type - numeric_type → numeric_type subtraction (နုတ်ခြင်း) 2 - 3 → -1 |
| - numeric_type → numeric_type negation (အနုတ်ပြောင်းခြင်း) - (-4) → 4 |
| numeric_type * numeric_type → numeric_type multiplication (မြှောက်ခြင်း) 2 * 3 → 6 |
| numeric_type / numeric_type → numeric_type division (စားခြင်း); integral types တွေအတွက်တော့ — ရလဒ်ကို သုညဆီ ဦးတည်၍ ဖြတ်တောက် (truncate) လုပ်ပါတယ် 5.0 / 2 → 2.5000000000000000 5 / 2 → 2 (-5) / 2 → -2 |
| numeric_type % numeric_type → numeric_type modulo (အကြွင်း ရှာခြင်း); smallint, integer, bigint နဲ့ numeric တို့အတွက် ရနိုင်ပါတယ် 5 % 4 → 1 |
| numeric ^ numeric → numeric double precision ^ double precision → double precision exponentiation (ထပ်ကိန်း တွက်ခြင်း) 2 ^ 3 → 8 ပုံမှန် သင်္ချာ ကျင့်သုံးမှုနဲ့ မတူဘဲ — `^` ကို အကြိမ်များစွာ သုံးထားရင် default အားဖြင့် ဘယ်မှ ညာသို့ (left to right) တွဲဖတ်ပါတယ် (associate): 2 ^ 3 ^ 3 → 512 2 ^ (3 ^ 3) → 134217728 |
| \|/ double precision → double precision square root (နှစ်ထပ်ကိန်းရင်း) \|/ 25.0 → 5 |
| \|\|/ double precision → double precision cube root (သုံးထပ်ကိန်းရင်း) \|\|/ 64.0 → 4 |
| @ numeric_type → numeric_type absolute value (ပကတိ တန်ဖိုး) @ -5.0 → 5.0 |
| integral_type & integral_type → integral_type bitwise AND (bit အလိုက် AND) 91 & 15 → 11 |
| integral_type \| integral_type → integral_type bitwise OR (bit အလိုက် OR) 32 \| 3 → 35 |
| integral_type # integral_type → integral_type bitwise exclusive OR (bit အလိုက် XOR) 17 # 5 → 20 |
| ~ integral_type → integral_type bitwise NOT (bit အလိုက် NOT) ~1 → -2 |
| integral_type << integer → integral_type bitwise shift left (bit များကို ဘယ်သို့ ရွှေ့ခြင်း) 1 << 4 → 16 |
| integral_type >> integer → integral_type bitwise shift right (bit များကို ညာသို့ ရွှေ့ခြင်း) 8 >> 2 → 2 |

ဇယား 9.5 မှာ ရနိုင်တဲ့ သင်္ချာ functions တွေကို ပြသထားပါတယ်။ ဒီ functions တွေ အများစုကို — argument types မတူညီတဲ့ ပုံစံ (form) အများအပြားနဲ့ ထောက်ပံ့ထားပါတယ်။ Function ပုံစံ တစ်ခုချင်းစီက — အထူး ဖော်ပြထားတဲ့ နေရာကလွဲရင် — သူ့ရဲ့ argument(s) တွေနဲ့ တူညီတဲ့ data type ကို ပြန်ပေးပြီး — type ချင်း ကွဲပြားတဲ့ (cross-type) ကိစ္စတွေကိုတော့ operators တွေအတွက် အထက်မှာ ရှင်းပြထားတဲ့ နည်းအတိုင်းပဲ ဖြေရှင်းပါတယ်။ `double precision` data တွေနဲ့ အလုပ်လုပ်တဲ့ functions တွေကို အများအားဖြင့် host system ရဲ့ C library အပေါ်မှာ implement လုပ်ထားပါတယ်; ဒါကြောင့် boundary cases (နယ်နိမိတ် ကိစ္စများ) တွေမှာ တိကျမှု (accuracy) နဲ့ အပြုအမူ (behavior) တွေက host system ပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။

**ဇယား 9.5. Mathematical Functions (သင်္ချာ လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| abs ( numeric_type ) → numeric_type absolute value (ပကတိ တန်ဖိုး) abs(-17.4) → 17.4 |
| cbrt ( double precision ) → double precision cube root (သုံးထပ်ကိန်းရင်း) cbrt(64.0) → 4 |
| ceil ( numeric ) → numeric ceil ( double precision ) → double precision argument ထက် ကြီးသည် သို့မဟုတ် ညီသော အနီးဆုံး ကိန်းပြည့် (nearest integer) ceil(42.2) → 43 ceil(-42.8) → -42 |
| ceiling ( numeric ) → numeric ceiling ( double precision ) → double precision argument ထက် ကြီးသည် သို့မဟုတ် ညီသော အနီးဆုံး ကိန်းပြည့် (ceil နဲ့ တူညီပါတယ်) ceiling(95.3) → 96 |
| degrees ( double precision ) → double precision radians တန်ဖိုးတွေကို degrees အဖြစ် ပြောင်းပေးပါတယ် degrees(0.5) → 28.64788975654116 |
| div ( y numeric, x numeric ) → numeric y/x ၏ ကိန်းပြည့် စားလဒ် (integer quotient; သုညဆီ ဦးတည်၍ ဖြတ်တောက်ပါတယ်) div(9, 4) → 2 |
| erf ( double precision ) → double precision error function (အမှားဆိုင်ရာ function) erf(1.0) → 0.8427007929497149 |
| erfc ( double precision ) → double precision complementary error function (1 - erf(x) — ကြီးမားတဲ့ inputs တွေအတွက် တိကျမှု မဆုံးရှုံးဘဲ) erfc(1.0) → 0.15729920705028513 |
| exp ( numeric ) → numeric exp ( double precision ) → double precision exponential — e ကို ပေးထားတဲ့ ထပ်ကိန်း (power) အတိုင်း မြှင့်တင်ခြင်း exp(1.0) → 2.7182818284590452 |
| factorial ( bigint ) → numeric factorial (စဉ်ဆက် မြှောက်လဒ်) factorial(5) → 120 |
| floor ( numeric ) → numeric floor ( double precision ) → double precision argument ထက် ငယ်သည် သို့မဟုတ် ညီသော အနီးဆုံး ကိန်းပြည့် floor(42.8) → 42 floor(-42.8) → -43 |
| gamma ( double precision ) → double precision gamma function (Γ) — ဂမ်မာ လုပ်ဆောင်ချက် gamma(0.5) → 1.772453850905516 gamma(6) → 120 |
| gcd ( numeric_type, numeric_type ) → numeric_type အကြီးဆုံး ဘုံဆတ္တူ စားကိန်း (greatest common divisor — input နှစ်ခုလုံးကို အကြွင်းမရှိ စားနိုင်တဲ့ အကြီးဆုံး အပေါင်းကိန်း); input နှစ်ခုလုံး သုည ဖြစ်ရင် 0 ပြန်ပေးပါတယ်; integer, bigint နဲ့ numeric တို့အတွက် ရနိုင်ပါတယ် gcd(1071, 462) → 21 |
| lcm ( numeric_type, numeric_type ) → numeric_type အငယ်ဆုံး ဘုံဆတ္တူ မြှောက်လဒ် (least common multiple — input နှစ်ခုလုံး၏ ကိန်းပြည့် မြှောက်လဒ်ဖြစ်သော အနည်းဆုံး အပေါင်း ကိန်း); input တစ်ခုခု သုည ဖြစ်ရင် 0 ပြန်ပေးပါတယ်; integer, bigint နဲ့ numeric တို့အတွက် ရနိုင်ပါတယ် lcm(1071, 462) → 23562 |
| lgamma ( double precision ) → double precision gamma function ၏ ပကတိ တန်ဖိုးရဲ့ natural logarithm (သဘာဝ လော်ဂရစ်သမ်) lgamma(1000) → 5905.220423209181 |
| ln ( numeric ) → numeric ln ( double precision ) → double precision natural logarithm (သဘာဝ လော်ဂရစ်သမ်) ln(2.0) → 0.6931471805599453 |
| log ( numeric ) → numeric log ( double precision ) → double precision base 10 logarithm (အခြေ 10 လော်ဂရစ်သမ်) log(100) → 2 |
| log10 ( numeric ) → numeric log10 ( double precision ) → double precision base 10 logarithm (log နဲ့ တူညီပါတယ်) log10(1000) → 3 |
| log ( b numeric, x numeric ) → numeric x ၏ base b logarithm (b အခြေပြု လော်ဂရစ်သမ်) log(2.0, 64.0) → 6.0000000000000000 |
| min_scale ( numeric ) → integer ပေးထားတဲ့ တန်ဖိုးကို တိကျစွာ (precisely) ကိုယ်စားပြုဖို့ လိုအပ်တဲ့ အနည်းဆုံး scale (ဒသမ ဂဏန်း အရေအတွက်) min_scale(8.4100) → 2 |
| mod ( y numeric_type, x numeric_type ) → numeric_type y/x ၏ အကြွင်း (remainder); smallint, integer, bigint နဲ့ numeric တို့အတွက် ရနိုင်ပါတယ် mod(9, 4) → 1 |
| pi ( ) → double precision π ၏ ခန့်မှန်း တန်ဖိုး (approximate value) pi() → 3.141592653589793 |
| power ( a numeric, b numeric ) → numeric power ( a double precision, b double precision ) → double precision a ကို b ထပ်ကိန်း မြှင့်တင်ခြင်း (a raised to the power of b) power(9, 3) → 729 |
| radians ( double precision ) → double precision degrees တန်ဖိုးတွေကို radians အဖြစ် ပြောင်းပေးပါတယ် radians(45.0) → 0.7853981633974483 |
| round ( numeric ) → numeric round ( double precision ) → double precision အနီးဆုံး ကိန်းပြည့်အဖြစ် ဝိုင်း (round) ပေးပါတယ်။ numeric အတွက်တော့ — ties (နှစ်ဘက် တူညီညီ ဖြစ်နေသော အနေအထား) တွေကို သုညကနေ ဝေးရာကို ဝိုင်းပြီး ဖြေရှင်းပါတယ် (rounding away from zero)။ double precision အတွက်တော့ — tie-breaking အပြုအမူက platform ပေါ် မူတည်ပေမယ့် — “round to nearest even” (အနီးဆုံး စုံကိန်းဆီ ဝိုင်းခြင်း) စည်းမျဉ်းက အသုံးအများဆုံး ဖြစ်ပါတယ်။ round(42.4) → 42 |
| round ( v numeric, s integer ) → numeric v ကို ဒသမ နေရာ s ခုအထိ ဝိုင်းပေးပါတယ်။ Ties တွေကို သုညကနေ ဝေးရာကို ဝိုင်းပြီး ဖြေရှင်းပါတယ်။ round(42.4382, 2) → 42.44 round(1234.56, -1) → 1230 |
| scale ( numeric ) → integer argument ၏ scale (ဒသမ အပိုင်းထဲက ဂဏန်း အရေအတွက်) scale(8.4100) → 4 |
| sign ( numeric ) → numeric sign ( double precision ) → double precision argument ၏ sign (နိမိတ် — -1, 0 သို့မဟုတ် +1) sign(-8.4) → -1 |
| sqrt ( numeric ) → numeric sqrt ( double precision ) → double precision square root (နှစ်ထပ်ကိန်းရင်း) sqrt(2) → 1.4142135623730951 |
| trim_scale ( numeric ) → numeric နောက်ဆုံးက သုညတွေကို ဖယ်ရှားခြင်းဖြင့် တန်ဖိုးရဲ့ scale (ဒသမ ဂဏန်း အရေအတွက်) ကို လျှော့ချပေးပါတယ် trim_scale(8.4100) → 8.41 |
| trunc ( numeric ) → numeric trunc ( double precision ) → double precision ကိန်းပြည့်အဖြစ် ဖြတ်တောက် (truncate — သုညဆီ ဦးတည်၍) လုပ်ပါတယ် trunc(42.8) → 42 trunc(-42.8) → -42 |
| trunc ( v numeric, s integer ) → numeric v ကို ဒသမ နေရာ s ခုအထိ ဖြတ်တောက်ပါတယ် trunc(42.4382, 2) → 42.43 |
| width_bucket ( operand numeric, low numeric, high numeric, count integer ) → integer width_bucket ( operand double precision, low double precision, high double precision, count integer ) → integer low ကနေ high အထိ ကျယ်ပြန့်တဲ့ range ကို အနံတူ (equal-width) buckets အရေအတွက် count ခု ခွဲထားတဲ့ histogram တစ်ခုမှာ operand က ကျရောက်တဲ့ bucket ရဲ့ နံပါတ်ကို ပြန်ပေးပါတယ်။ Buckets တွေရဲ့ lower bounds တွေက အပါအဝင် (inclusive) ဖြစ်ပြီး — upper bounds တွေက ကလွဲ (exclusive) ဖြစ်ပါတယ်။ low ထက် ငယ်တဲ့ input အတွက် 0 ပြန်ပေးပြီး — high ထက် ကြီးသည် သို့မဟုတ် ညီတဲ့ input အတွက်တော့ count+1 ပြန်ပေးပါတယ်။ low > high ဖြစ်ရင် — အပြုအမူက မှန်ထဲက ပြောင်းပြန် (mirror-reversed) ဖြစ်သွားပြီး — bucket 1 က low ရဲ့ အောက်နားက bucket ဖြစ်လာကာ — အပါအဝင် bounds တွေက ဒီအခါ upper side မှာ ရှိပါတယ်။ width_bucket(5.35, 0.024, 10.06, 5) → 3 width_bucket(9, 10, 0, 10) → 2 |
| width_bucket ( operand anycompatible, thresholds anycompatiblearray ) → integer buckets တွေရဲ့ အပါအဝင် (inclusive) lower bounds တွေကို စာရင်းပြုထားတဲ့ array တစ်ခု ပေးထားတဲ့အခါ operand က ကျရောက်တဲ့ bucket ရဲ့ နံပါတ်ကို ပြန်ပေးပါတယ်။ ပထမ lower bound ထက် ငယ်တဲ့ input အတွက် 0 ပြန်ပေးပါတယ်။ operand နဲ့ array elements တွေက standard comparison operators ရှိတဲ့ type တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ thresholds array ကို — အငယ်ဆုံး ရှေ့မှာ ထား၍ — စီထားရပါမယ် (sorted); မဟုတ်ရင် မမျှော်လင့်တဲ့ ရလဒ်တွေ ရနိုင်ပါတယ်။ width_bucket(now(), array['yesterday', 'today', 'tomorrow']::timestamptz[]) → 2 |

ဇယား 9.6 မှာ random numbers (ကျပန်း ကိန်းများ) ထုတ်ပေးတဲ့ functions တွေကို ပြသထားပါတယ်။

**ဇယား 9.6. Random Functions (random လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| random ( ) → double precision range 0.0 <= x < 1.0 အတွင်းမှာ ကျပန်း တန်ဖိုး တစ်ခုကို ပြန်ပေးပါတယ် random() → 0.897124072839091 |
| random ( min integer, max integer ) → integer random ( min bigint, max bigint ) → bigint random ( min numeric, max numeric ) → numeric range min <= x <= max အတွင်းမှာ ကျပန်း တန်ဖိုး တစ်ခုကို ပြန်ပေးပါတယ်။ numeric type အတွက်တော့ — ရလဒ်မှာ min သို့မဟုတ် max ထဲက ဒသမ ဂဏန်း အရေအတွက် ပိုများတဲ့ဘက်နဲ့ တူညီတဲ့ ဒသမ ဂဏန်း အရေအတွက် ရှိပါလိမ့်မယ်။ random(1, 10) → 7 random(-0.499, 0.499) → 0.347 |
| random_normal ( [ mean double precision [, stddev double precision ]] ) → double precision သတ်မှတ်ထားတဲ့ parameters တွေနဲ့ normal distribution (ပုံမှန် ဖြန့်ဖြူးမှု) ကနေ ကျပန်း တန်ဖိုး တစ်ခုကို ပြန်ပေးပါတယ်; mean က default အားဖြင့် 0.0 ဖြစ်ပြီး — stddev က default အားဖြင့် 1.0 ဖြစ်ပါတယ် random_normal(0.0, 1.0) → 0.051285419 |
| setseed ( double precision ) → void နောက်ပိုင်း random() နဲ့ random_normal() ခေါ်ဆိုမှုတွေအတွက် seed ကို သတ်မှတ်ပေးပါတယ်; argument က -1.0 နဲ့ 1.0 ကြား (နှစ်ဖက်စလုံး အပါအဝင် — inclusive) ဖြစ်ရပါမယ် setseed(0.12345) |

ဇယား 9.6 မှာ စာရင်းပြထားတဲ့ `random()` နဲ့ `random_normal()` functions တွေက deterministic (ကြိုတင် ဆုံးဖြတ်ထားသော) pseudo-random number generator (အတုအယောင် ကျပန်း ကိန်းထုတ် ယန္တရား) တစ်ခုကို သုံးပါတယ်။ ၎င်းက မြန်ဆန်ပေမယ့် — cryptographic (လျှို့ဝှက်ကုဒ်ဆိုင်ရာ) application တွေအတွက်တော့ မသင့်လျော်ပါဘူး; ပိုလုံခြုံတဲ့ အခြားရွေးချယ်စရာ (alternative) အတွက် [pgcrypto](https://www.postgresql.org/docs/current/pgcrypto.html) module ကို ကြည့်ပါ။ `setseed()` ကို ခေါ်လိုက်ရင် — လက်ရှိ session ထဲမှာ ဒီ functions တွေကို နောက်ပိုင်း ခေါ်ဆိုမှုတွေရဲ့ ရလဒ် အစီအစဉ် (series) ကို — argument တူတူနဲ့ `setseed()` ကို ပြန်လည် ခေါ်ဆိုခြင်း (re-issuing) ဖြင့် — ထပ်တူထပ်မျှ ပြန်လုပ်လို့ ရပါတယ်။ Session တစ်ခုတည်းထဲမှာ အရင် `setseed()` ခေါ်ဆိုမှု မရှိဘဲနဲ့ — ဒီ functions တစ်ခုခုကို ပထမဆုံး ခေါ်လိုက်တာက — platform ပေါ် မူတည်တဲ့ (platform-dependent) random bits အရင်းအမြစ် တစ်ခုကနေ seed ကို ရယူပါတယ်။

ဇယား 9.7 မှာ ရနိုင်တဲ့ trigonometric functions (တြိဂံ တိုင်းတာရေး လုပ်ဆောင်ချက်များ) တွေကို ပြသထားပါတယ်။ ဒီ function တစ်ခုချင်းစီမှာ ပုံစံကွဲ (variant) နှစ်မျိုး ရှိပါတယ် — တစ်မျိုးက ထောင့်တွေကို radians နဲ့ တိုင်းပြီး — နောက်တစ်မျိုးက degrees နဲ့ တိုင်းပါတယ်။

**ဇယား 9.7. Trigonometric Functions (trigonometric လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| acos ( double precision ) → double precision ပြောင်းပြန် cosine (inverse cosine) — ရလဒ်က radians ဖြစ်ပါတယ် acos(1) → 0 |
| acosd ( double precision ) → double precision ပြောင်းပြန် cosine — ရလဒ်က degrees ဖြစ်ပါတယ် acosd(0.5) → 60 |
| asin ( double precision ) → double precision ပြောင်းပြန် sine (inverse sine) — ရလဒ်က radians ဖြစ်ပါတယ် asin(1) → 1.5707963267948966 |
| asind ( double precision ) → double precision ပြောင်းပြန် sine — ရလဒ်က degrees ဖြစ်ပါတယ် asind(0.5) → 30 |
| atan ( double precision ) → double precision ပြောင်းပြန် tangent (inverse tangent) — ရလဒ်က radians ဖြစ်ပါတယ် atan(1) → 0.7853981633974483 |
| atand ( double precision ) → double precision ပြောင်းပြန် tangent — ရလဒ်က degrees ဖြစ်ပါတယ် atand(1) → 45 |
| atan2 ( y double precision, x double precision ) → double precision y/x ၏ ပြောင်းပြန် tangent — ရလဒ်က radians ဖြစ်ပါတယ် atan2(1, 0) → 1.5707963267948966 |
| atan2d ( y double precision, x double precision ) → double precision y/x ၏ ပြောင်းပြန် tangent — ရလဒ်က degrees ဖြစ်ပါတယ် atan2d(1, 0) → 90 |
| cos ( double precision ) → double precision cosine — argument က radians ဖြစ်ပါတယ် cos(0) → 1 |
| cosd ( double precision ) → double precision cosine — argument က degrees ဖြစ်ပါတယ် cosd(60) → 0.5 |
| cot ( double precision ) → double precision cotangent — argument က radians ဖြစ်ပါတယ် cot(0.5) → 1.830487721712452 |
| cotd ( double precision ) → double precision cotangent — argument က degrees ဖြစ်ပါတယ် cotd(45) → 1 |
| sin ( double precision ) → double precision sine — argument က radians ဖြစ်ပါတယ် sin(1) → 0.8414709848078965 |
| sind ( double precision ) → double precision sine — argument က degrees ဖြစ်ပါတယ် sind(30) → 0.5 |
| tan ( double precision ) → double precision tangent — argument က radians ဖြစ်ပါတယ် tan(1) → 1.5574077246549023 |
| tand ( double precision ) → double precision tangent — argument က degrees ဖြစ်ပါတယ် tand(45) → 1 |

> **မှတ်ချက်:** degrees နဲ့ တိုင်းထားတဲ့ ထောင့်တွေနဲ့ အလုပ်လုပ်ဖို့ နောက်ထပ် နည်းလမ်းတစ်ခုကတော့ — အထက်မှာ ပြထားတဲ့ unit transformation functions ဖြစ်တဲ့ `radians()` နဲ့ `degrees()` တို့ကို သုံးတာပါ။ ဒါပေမယ့် — degree-based trigonometric functions တွေကို သုံးတာက ပိုကောင်းပါတယ် — အကြောင်းကတော့ ဒီနည်းက `sind(30)` လိုမျိုး အထူး ကိစ္စ (special case) တွေမှာ round-off error (ပတ်ဖြတ်တွက်ချက်မှု အမှား) တွေကို ရှောင်ရှားပေးလို့ပါ။

ဇယား 9.8 မှာ ရနိုင်တဲ့ hyperbolic functions (hyperbolic လုပ်ဆောင်ချက်များ) တွေကို ပြသထားပါတယ်။

**ဇယား 9.8. Hyperbolic Functions (hyperbolic လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| sinh ( double precision ) → double precision hyperbolic sine (ဟိုက်ပါဘောလစ် sine) sinh(1) → 1.1752011936438014 |
| cosh ( double precision ) → double precision hyperbolic cosine (ဟိုက်ပါဘောလစ် cosine) cosh(0) → 1 |
| tanh ( double precision ) → double precision hyperbolic tangent (ဟိုက်ပါဘောလစ် tangent) tanh(1) → 0.7615941559557649 |
| asinh ( double precision ) → double precision ပြောင်းပြန် hyperbolic sine (inverse hyperbolic sine) asinh(1) → 0.881373587019543 |
| acosh ( double precision ) → double precision ပြောင်းပြန် hyperbolic cosine (inverse hyperbolic cosine) acosh(1) → 0 |
| atanh ( double precision ) → double precision ပြောင်းပြန် hyperbolic tangent (inverse hyperbolic tangent) atanh(0.5) → 0.5493061443340548 |
