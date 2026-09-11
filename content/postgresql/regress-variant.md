---
title: "Variant Comparison Files (ပုံစံကွဲ နှိုင်းယှဉ် ဖိုင်များ)"
description: "PostgreSQL regression tests များအတွက် variant comparison files (ပုံစံကွဲ နှိုင်းယှဉ် ဖိုင်များ) အကြောင်း — tests အချို့၏ environment-dependent ရလဒ်များကို ကိုင်တွယ်ရန် alternate “expected” result files သတ်မှတ်ခြင်း, platform-specific ရွေးချယ်မှု ယန္တရား (`src/test/regress/resultmap` mapping file, line ပုံစံ `testname:output:platformpattern=comparisonfilename`, Unix `expr` ပုံစံ platform pattern, `config.guess` output နှင့် နှိုင်းယှဉ်ခြင်း, `strtof`/`float4` ဥပမာ, Cygwin ပေါ်မှာ အတုအယောင် “failure” message ကို တိတ်ဆိတ်စေခြင်း), automatic “best match” ရွေးချယ်မှု ယန္တရား (`testname.out` နှင့် `testname_digit.out` variant files, `char`/`char_1.out` locale ဥပမာ) နှင့် ယင်း၏ ကန့်သတ်ချက်များ အကြောင်း ရှင်းလင်းချက်"
order: 229
source: "https://www.postgresql.org/docs/current/regress-variant.html"
status: translated
updated: 2026-09-06
---

## 31.3. Variant Comparison Files (ပုံစံကွဲ နှိုင်းယှဉ် ဖိုင်များ)

Tests တချို့က သဘာဝအားဖြင့် environment-dependent (environment အလိုက် မူတည်သော) ရလဒ်တွေကို ထုတ်လုပ်တာမို့ — alternate “expected” (မျှော်မှန်းထားသော) result files တွေကို သတ်မှတ်နိုင်တဲ့ နည်းလမ်းတွေကို ကျွန်ုပ်တို့ ထောက်ပံ့ပေးထားပါတယ်။ Regression test တစ်ခုချင်းစီမှာ — platform အမျိုးမျိုးပေါ်မှာ ဖြစ်နိုင်တဲ့ ရလဒ်တွေကို ပြသပေးတဲ့ — comparison files (နှိုင်းယှဉ် ဖိုင်များ) အများအပြား ရှိနိုင်ပါတယ်။ Test တစ်ခုချင်းစီအတွက် ဘယ် comparison file ကို သုံးမလဲ ဆုံးဖြတ်ပေးတဲ့ — ယန္တရား သီးခြား နှစ်ခု ရှိပါတယ်။

ပထမ ယန္တရားက — platform တစ်ခုချင်းစီအတွက် comparison files တွေကို ရွေးချယ် သုံးစွဲနိုင်စေပါတယ်။ `src/test/regress/resultmap` ဆိုတဲ့ mapping file (ပုံဖော် ချိတ်ဆက်မှု ဖိုင်) တစ်ခု ရှိပြီး — platform တစ်ခုချင်းစီအတွက် ဘယ် comparison file ကို သုံးရမလဲ အဲဒီဖိုင်က သတ်မှတ်ပေးပါတယ်။ သီးခြား platform တစ်ခုအတွက် အတုအယောင် test “failures” တွေကို ဖယ်ရှားဖို့ဆိုရင် — ဦးစွာ variant result file (ပုံစံကွဲ ရလဒ် ဖိုင်) တစ်ခုကို ရွေးချယ် ဒါမှမဟုတ် ဖန်တီးပြီး — `resultmap` ဖိုင်ထဲကို line တစ်ကြောင်း ထည့်သွင်းပါ။

Mapping ဖိုင်ထဲက line တစ်ကြောင်းချင်းစီက အောက်ပါ ပုံစံ ဖြစ်ပါတယ်:

```sql
testname:output:platformpattern=comparisonfilename
```

Test name ဆိုတာက — သက်ဆိုင်ရာ regression test module ရဲ့ နာမည် သက်သက်ပဲ ဖြစ်ပါတယ်။ Output value ကတော့ ဘယ် output file ကို စစ်ဆေးရမလဲ ညွှန်ပြပါတယ်။ Standard regression tests တွေအတွက်ဆိုရင် ဒါက အမြဲတမ်း `out` ဖြစ်ပြီး — ဒီ တန်ဖိုးက output file ရဲ့ file extension နဲ့ ကိုက်ညီပါတယ်။ Platform pattern ကတော့ — Unix tool ဖြစ်တဲ့ `expr` ရဲ့ ပုံစံနဲ့ ဆင်တူတဲ့ pattern တစ်ခု ဖြစ်ပါတယ် (ဆိုလိုတာက — စတင်ရာမှာ implicit `^` anchor တစ်ခု ပါဝင်တဲ့ regular expression ဖြစ်ပါတယ်)။ ဒါကို — `config.guess` က ရိုက်ထုတ်ပေးတဲ့ platform name နဲ့ နှိုင်းယှဉ် စစ်ဆေးပါတယ်။ Comparison file name ကတော့ — အစားထိုး result comparison file ရဲ့ base name (အခြေခံ နာမည်) ဖြစ်ပါတယ်။

ဥပမာ: system တချို့မှာ အလုပ်လုပ်တဲ့ `strtof` function မရှိပါဘူး — အဲဒီအတွက် ကျွန်ုပ်တို့ရဲ့ workaround (ဖြေရှင်း နည်းလမ်း) က `float4` regression test ထဲမှာ rounding errors (ဂဏန်း ဝိုင်းလုံးမှု အမှားများ) တွေ ဖြစ်စေပါတယ်။ ဒါကြောင့် — အဲဒီ systems တွေပေါ်မှာ မျှော်လင့်ရမယ့် ရလဒ်တွေ ပါဝင်တဲ့ — `float4-misrounded-input.out` ဆိုတဲ့ variant comparison file (ပုံစံကွဲ comparison file) တစ်ခုကို ကျွန်ုပ်တို့ ထောက်ပံ့ပေးပါတယ်။ Cygwin platforms တွေပေါ်မှာ အတုအယောင် “failure” message ကို တိတ်ဆိတ်စေဖို့ (silence) — `resultmap` ထဲမှာ အောက်ပါအတိုင်း ပါဝင်ပါတယ်:

```sql
float4:out:.*-.*-cygwin.*=float4-misrounded-input.out
```

ဒီ line က — `config.guess` ရဲ့ output က `.*-.*-cygwin.*` နဲ့ ကိုက်ညီတဲ့ — ဘယ် machine ပေါ်မှာမဆို အလုပ်လုပ် (trigger) ပါလိမ့်မယ်။ `resultmap` ထဲက တခြား lines တွေကတော့ — သင့်လျော်တဲ့ platform အခြားများအတွက် — variant comparison file တွေကို ရွေးချယ်ပေးပါတယ်။

Variant comparison files တွေအတွက် ဒုတိယ ရွေးချယ်မှု ယန္တရားကတော့ အများကြီး ပိုပြီး အလိုအလျောက် ကျပါတယ်: ဒါက — ထောက်ပံ့ပေးထားတဲ့ comparison files အများအပြားထဲက “best match” (အကောင်းဆုံး ကိုက်ညီမှု) ကိုပဲ ရိုးရိုးရှင်းရှင်း အသုံးပြုပါတယ်။ Regression test driver script က — test တစ်ခုအတွက် standard comparison file ဖြစ်တဲ့ `testname.out` ရော — `testname_digit.out` လို့ နာမည်ပေးထားတဲ့ variant files တွေကိုပါ (ဒီမှာ `digit` က ဂဏန်း တစ်လုံးတည်း `0`-`9` ဖြစ်ပါတယ်) ထည့်သွင်း စဉ်းစားပါတယ်။ အဲဒီလို ဖိုင်တစ်ခုခုက အတိအကျ ကိုက်ညီခဲ့ရင် — test က pass ဖြစ်တယ်လို့ မှတ်ယူပြီး — မဟုတ်ရင်တော့ — diff အတိုဆုံး ထုတ်ပေးတဲ့ ဖိုင်ကို — failure report (ကျရှုံးမှု အစီရင်ခံစာ) ဖန်တီးဖို့ သုံးပါတယ်။ (သီးခြား test တစ်ခုအတွက် `resultmap` ထဲမှာ entry တစ်ခု ပါဝင်နေရင် — base `testname` က `resultmap` ထဲမှာ ပေးထားတဲ့ substitute name (အစားထိုး နာမည်) ဖြစ်ပါတယ်။)

ဥပမာ — `char` test အတွက်ဆိုရင် — `char.out` comparison file က `C` နဲ့ `POSIX` locales တွေမှာ မျှော်လင့်ရတဲ့ ရလဒ်တွေ ပါဝင်ပြီး — `char_1.out` ဖိုင်ကတော့ — အခြား locales အများအပြားမှာ ပေါ်လာတဲ့အတိုင်း စီစဉ်ထားတဲ့ (sorted) ရလဒ်တွေ ပါဝင်ပါတယ်။

Best-match ယန္တရားကို — locale-dependent (locale အလိုက် မူတည်သော) ရလဒ်တွေကို ကိုင်တွယ်ဖို့ ရည်ရွယ် ဒီဇိုင်းထုတ်ထားတာ ဖြစ်ပေမယ့် — platform name တစ်ခုတည်းကနေ test ရလဒ်တွေကို အလွယ်တကူ ကြိုတင် ခန့်မှန်းလို့ မရတဲ့ — ဘယ် အခြေအနေမှာမဆို သုံးနိုင်ပါတယ်။ ဒီ ယန္တရားရဲ့ ကန့်သတ်ချက် တစ်ခုကတော့ — test driver က လက်ရှိ environment အတွက် ဘယ် variant က တကယ်တော့ “correct” (မှန်ကန်) လဲဆိုတာ ပြောပြနိုင်စွမ်း မရှိတာ ဖြစ်ပြီး — အကောင်းဆုံး အလုပ်လုပ်ပုံ ရတဲ့ variant ကိုပဲ ရွေးချယ်မှာ ဖြစ်ပါတယ်။ ဒါကြောင့် — ဒီ ယန္တရားကို — context တိုင်းမှာ အညီအမျှ valid (မှန်ကန်သည်) လို့ သင်ကိုယ်တိုင် လက်ခံနိုင်တဲ့ variant results တွေအတွက်ပဲ သုံးတာ အလုံခြုံဆုံး ဖြစ်ပါတယ်။
