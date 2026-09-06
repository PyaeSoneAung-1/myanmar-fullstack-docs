---
title: "Test Evaluation (Test ရလဒ်များကို အကဲဖြတ်ခြင်း)"
description: "PostgreSQL regression tests (နောက်ပြန် စစ်ဆေးမှု tests) ၏ ရလဒ်များကို အကဲဖြတ်ခြင်း — regression test “failures” များ၏ အဖြစ်များသော အကြောင်းရင်းများနှင့် ၎င်းတို့ကို စစ်ဆေး အတည်ပြုနိုင်ပုံ (error message ကွဲလွဲမှုများ, locale ကွဲလွဲမှုများ, date/time နှင့် floating-point ကွဲလွဲမှုများ, row အစီအစဉ် ကွဲလွဲမှုများ, stack depth မလုံလောက်ခြင်း, “random” test, configuration parameters), `diff` outputs များကို ကြည့်ရှုရန် `src/test/regress/results`, `expected` နှင့် `regression.diffs` ဖိုင်များ, `PG_REGRESS_DIFF_OPTS` environment variable, alternate comparison files, `make check` နှင့် locale-related environment variables များ, `PGTZ` time zone setting, `max_stack_depth` ဆိုင်ရာ ရှင်းလင်းချက်"
order: 200
source: "https://www.postgresql.org/docs/current/regress-evaluation.html"
status: translated
updated: 2026-09-06
---

## 31.2. Test Evaluation (Test ရလဒ်များကို အကဲဖြတ်ခြင်း)

- **31.2.1. Error Message Differences (error message ကွဲလွဲမှုများ)**
- **31.2.2. Locale Differences (locale ကွဲလွဲမှုများ)**
- **31.2.3. Date and Time Differences (ရက်စွဲနှင့် အချိန် ကွဲလွဲမှုများ)**
- **31.2.4. Floating-Point Differences (floating-point ကွဲလွဲမှုများ)**
- **31.2.5. Row Ordering Differences (row အစီအစဉ် ကွဲလွဲမှုများ)**
- **31.2.6. Insufficient Stack Depth (stack depth မလုံလောက်ခြင်း)**
- **31.2.7. The “random” Test (“random” test အကြောင်း)**
- **31.2.8. Configuration Parameters (configuration parameters များ)**

ကောင်းမွန်စွာ install လုပ်ထားပြီး အပြည့်အဝ အလုပ်လုပ်နေတဲ့ PostgreSQL installation တချို့ဟာ — floating-point ကိုယ်စားပြုပုံ ကွဲပြားမှုတွေ နဲ့ message စကားလုံး ကွဲပြားမှုတွေလို — platform-specific (ပလက်ဖောင်း အလိုက် သီးသန့်) ဖြစ်စဉ်တွေကြောင့် ဒီ regression tests တွေထဲက တချို့မှာ “fail” ဖြစ်နိုင်ပါတယ်။ လက်ရှိမှာ ဒီ tests တွေကို — reference system (ရည်ညွှန်း system — စံပြု system) တစ်ခုပေါ်မှာ ထုတ်လုပ်ထားတဲ့ outputs တွေနဲ့ ရိုးရိုး `diff` နှိုင်းယှဉ်မှုကို သုံးပြီး အကဲဖြတ်တာမို့ — ရလဒ်တွေက system ကွဲပြားမှု အနည်းငယ်ကိုတောင် ခံစားလွယ် (sensitive) ပါတယ်။ Test တစ်ခုက “failed” လို့ အစီရင်ခံတဲ့အခါ — expected (မျှော်မှန်းထားသော) နဲ့ actual (ရလဒ်အမှန်) outputs တွေကြားက ကွာခြားချက်တွေကို အမြဲ စစ်ဆေးကြည့်ပါ; အဲဒီ ကွာခြားချက်တွေက သိသာထင်ရှားမှု မရှိဘူးဆိုတာ သင် တွေ့ရှိနိုင်ပါတယ်။ ဒါပေမယ့် — supported platforms (ထောက်ပံ့ထားသော ပလက်ဖောင်းများ) အားလုံးပေါ်မှာ တိကျတဲ့ reference files တွေကို ထိန်းသိမ်းထားဖို့ ကျွန်ုပ်တို့ ကြိုးပမ်းနေဆဲ ဖြစ်လို့ — tests အားလုံး pass ဖြစ်တာကို မျှော်လင့်နိုင်ပါတယ်။

Regression tests တွေရဲ့ တကယ့် outputs တွေက `src/test/regress/results` directory ထဲက ဖိုင်တွေထဲမှာ ရှိပါတယ်။ Test script က output ဖိုင် တစ်ခုချင်းစီကို — `src/test/regress/expected` directory ထဲမှာ သိမ်းဆည်းထားတဲ့ reference outputs တွေနဲ့ နှိုင်းယှဉ်ဖို့ `diff` ကို သုံးပါတယ်။ ကွာခြားချက်တွေ အားလုံးကို သင့် စစ်ဆေးမှုအတွက် `src/test/regress/regression.diffs` ထဲမှာ သိမ်းဆည်းပါတယ်။ (Core tests တွေကလွဲလို့ တခြား test suite တစ်ခုကို run လုပ်တဲ့အခါ — ဒီ ဖိုင်တွေက `src/test/regress` ထဲမှာ မဟုတ်ဘဲ — သက်ဆိုင်ရာ subdirectory ထဲမှာ ပေါ်လာတာ သေချာပါတယ်။)

Default အနေနဲ့ သုံးတဲ့ `diff` options တွေကို မကြိုက်ဘူးဆိုရင် — `PG_REGRESS_DIFF_OPTS` environment variable (ပတ်ဝန်းကျင် variable) ကို သတ်မှတ်ပါ — ဥပမာ `PG_REGRESS_DIFF_OPTS='-c'` လိုမျိုးပါ။ (ဒါမှမဟုတ် ကြိုက်နှစ်သက်ရင် `diff` ကို ကိုယ်တိုင် run လုပ်လို့လည်း ရပါတယ်။)

တစ်ခုခုသော အကြောင်းပြချက်တွေကြောင့် ပလက်ဖောင်း တစ်ခုက ပေးထားတဲ့ test တစ်ခုအတွက် “failure” တစ်ခု ထုတ်လုပ်ပေမယ့် — output ကို စစ်ဆေးကြည့်လို့ ရလဒ်က valid (မှန်ကန်သည်) လို့ သင် ယုံကြည်တယ်ဆိုရင် — နောင်မှာ test runs တွေမှာ failure အစီရင်ခံမှုကို တိတ်တိတ်ဆိတ်ဆိတ် ဖြစ်စေဖို့ (silence) — comparison file အသစ်တစ်ခုကို ထည့်သွင်းနိုင်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 31.3](https://www.postgresql.org/docs/current/regress-variant.html) ကို ကြည့်ပါ။

### 31.2.1. Error Message Differences (error message ကွဲလွဲမှုများ)

Regression tests တချို့မှာ ရည်ရွယ်ချက်ရှိရှိ invalid (မမှန်ကန်သော) input values တွေ ပါဝင်ပါတယ်။ Error messages တွေက PostgreSQL code ကနေ ဒါမှမဟုတ် — host platform ရဲ့ system routines တွေကနေ လာနိုင်ပါတယ်။ နောက်ဆုံး ကိစ္စမှာဆိုရင် — messages တွေက platform အလိုက် ကွဲပြားနိုင်ပေမယ့် — အလားတူ အချက်အလက်တွေကို ထင်ဟပ်စေရပါမယ်။ Message တွေထဲက ဒီ ကွဲပြားမှုတွေက — စစ်ဆေး ကြည့်ရှု (inspection) လုပ်ပြီး အတည်ပြုလို့ ရတဲ့ — “failed” regression test တစ်ခုကို ရလဒ်အဖြစ် ဖြစ်ပေါ်စေပါလိမ့်မယ်။

### 31.2.2. Locale Differences (locale ကွဲလွဲမှုများ)

C ကလွဲပြီး တခြား collation-order locale တစ်ခုနဲ့ initialize (ကနဦး ပြင်ဆင်) လုပ်ထားတဲ့ server တစ်ခုကို ဆန့်ကျင်ပြီး ဒီ tests တွေကို run လုပ်မယ်ဆိုရင် — sort order (စီစဉ်မှု အစီအစဉ်) ကြောင့် ကွဲပြားမှုတွေနဲ့ နောက်ဆက်တွဲ failures တွေ ဖြစ်နိုင်ပါတယ်။ ဒီ ပြဿနာကို ကိုင်တွယ်ဖို့ — အတူတကွ ဆိုရင် locale အများအပြားကို ကိုင်တွယ်နိုင်တာ သိရှိထားတဲ့ — alternate result files (အစားထိုး ရလဒ် ဖိုင်များ) တွေကို ထောက်ပံ့ပေးခြင်းအားဖြင့် regression test suite ကို စနစ်တကျ ပြင်ဆင်ထားပါတယ်။

Temporary-installation method (ယာယီ installation နည်းလမ်း) ကို သုံးတဲ့အခါ — တခြား locale တစ်ခုနဲ့ ဒီ tests တွေကို run လုပ်ဖို့ဆိုရင် — locale နဲ့ ဆိုင်တဲ့ သင့်လျော်တဲ့ environment variables တွေကို `make` command line ပေါ်မှာ ပေးပို့ပါ — ဥပမာ:

```sql
make check LANG=de_DE.utf8
```

(Regression test driver က `LC_ALL` ကို unset လုပ်တာမို့ — အဲဒီ variable ကို သုံးပြီး locale ရွေးချယ်တာက အလုပ်မလုပ်ပါဘူး။) Locale မသုံးချင်ဘူးဆိုရင် — locale နဲ့ ဆိုင်တဲ့ environment variables တွေ အားလုံးကို unset လုပ်ပါ (ဒါမှမဟုတ် `C` လို့ သတ်မှတ်ပါ) ဒါမှမဟုတ် — အောက်ပါ အထူး invocation (အထူး ခေါ်ယူမှု) ကို သုံးပါ:

```sql
make check NO_LOCALE=1
```

ပြီးသား installation တစ်ခုကို ဆန့်ကျင်ပြီး tests တွေကို run လုပ်တဲ့အခါ — locale setup ကို အဲဒီ ရှိပြီးသား installation က ဆုံးဖြတ်ပါတယ်။ အဲဒါကို ပြောင်းလဲဖို့ဆိုရင် — `initdb` ဆီ သင့်လျော်တဲ့ options တွေ ပေးပို့ပြီး — database cluster ကို တခြား locale တစ်ခုနဲ့ initialize လုပ်ပါ။

ယေဘုယျအားဖြင့်တော့ — production (ထုတ်လုပ်မှု) မှာ လိုချင်တဲ့ locale setup နဲ့ပဲ regression tests တွေကို run လုပ်ဖို့ ကြိုးစားတာ ပညာရှိရာ ရောက်ပါတယ် — အကြောင်းကတော့ ဒါက production မှာ တကယ် အသုံးပြုမယ့် locale- နဲ့ encoding-ဆိုင်ရာ code အပိုင်းတွေကို လေ့ကျင့် စမ်းသပ်ပေးလို့ပါ။ Operating system environment ပေါ် မူတည်ပြီး — failures တွေ ကြုံရနိုင်ပေမယ့် — ဒါဆိုရင် တကယ့် applications တွေ run လုပ်တဲ့အခါ ဘယ် locale-သီးသန့် အပြုအမူတွေကို မျှော်လင့်ရမလဲ အနည်းဆုံး သိရှိမှာ ဖြစ်ပါတယ်။

### 31.2.3. Date and Time Differences (ရက်စွဲနှင့် အချိန် ကွဲလွဲမှုများ)

ရက်စွဲနဲ့ အချိန် ရလဒ် အများစုက time zone environment (အချိန်ဇုန် ပတ်ဝန်းကျင်) ပေါ်မှာ မူတည်ပါတယ်။ Reference files တွေကို `America/Los_Angeles` time zone အတွက် ထုတ်လုပ်ထားပြီး — tests တွေကို အဲဒီ time zone setting နဲ့ run မလုပ်ဘူးဆိုရင် — ထင်ရှားတဲ့ failures တွေ ရှိမှာ ဖြစ်ပါတယ်။ Regression test driver က `PGTZ` environment variable ကို `America/Los_Angeles` လို့ သတ်မှတ်ပေးပြီး — ဒါက ပုံမှန်အားဖြင့် မှန်ကန်တဲ့ ရလဒ်တွေကို သေချာ ဖြစ်စေပါတယ်။

### 31.2.4. Floating-Point Differences (floating-point ကွဲလွဲမှုများ)

Tests တချို့မှာ table columns တွေကနေ 64-bit floating-point ဂဏန်းတွေ (`double precision`) တွက်ချက်ခြင်း ပါဝင်ပါတယ်။ `double precision` columns တွေရဲ့ သင်္ချာ functions တွေ ပါဝင်တဲ့ ရလဒ်တွေထဲမှာ ကွဲပြားမှုတွေကို သတိပြုမိခဲ့ပါတယ်။ `float8` နဲ့ `geometry` tests တွေက — platforms အလိုက် ဒါမှမဟုတ် compiler optimization settings (compiler ပုံကောင်းအောင် ပြုလုပ်မှု settings) မတူညီတာတွေနဲ့တောင် — ကွဲပြားမှု အနည်းငယ်တွေ ဖြစ်နိုင်ခြေ အထူး များပါတယ်။ ဒီ ကွဲပြားမှုတွေရဲ့ တကယ့် အဓိပ္ပာယ် ပမာဏကို ဆုံးဖြတ်ဖို့ — လူတစ်ယောက်ရဲ့ မျက်စိနဲ့ နှိုင်းယှဉ် စစ်ဆေးမှု (human eyeball comparison) လိုအပ်ပါတယ် — အဲဒီ ကွဲပြားမှုတွေက များသောအားဖြင့် decimal point (ဒသမ ကိန်း အမှတ်) ရဲ့ ညာဘက် နေရာ 10 ခုလောက်မှာ ရှိတတ်ပါတယ်။

System တချို့က minus zero (အနုတ် သုည) ကို `-0` အနေနဲ့ ပြသပြီး — တချို့ကတော့ `0` ပဲ ပြသပါတယ်။

System တချို့က `pow()` နဲ့ `exp()` ကနေ error signals တွေကို — လက်ရှိ PostgreSQL code က မျှော်လင့်ထားတဲ့ ယန္တရားနဲ့ မတူညီတဲ့ နည်းလမ်းနဲ့ signal လုပ်ပါတယ်။

### 31.2.5. Row Ordering Differences (row အစီအစဉ် ကွဲလွဲမှုများ)

တူညီတဲ့ rows တွေကို — expected file ထဲမှာ ပေါ်လာတဲ့ အစီအစဉ်နဲ့ မတူညီတဲ့ အစီအစဉ်တစ်ခုနဲ့ output လုပ်တာမျိုး — ကွဲပြားမှုတွေကို သင် မြင်ရနိုင်ပါတယ်။ အများစုမှာတော့ ဒါက — အတိအကျ ဆိုရရင် — bug တစ်ခု မဟုတ်ပါဘူး။ Regression test scripts တွေ အများစုက `SELECT` တစ်ခုချင်းစီတိုင်းအတွက် `ORDER BY` သုံးလောက်အောင် ဇီဇာကြောင်မှု မရှိကြပါဘူး — ဒါကြောင့် သူတို့ရဲ့ ရလဒ် row အစီအစဉ်တွေက SQL specification အရ well-defined (ကောင်းစွာ သတ်မှတ်ထားသော) မဟုတ်ပါဘူး။ လက်တွေ့မှာတော့ — ဒီ queries တွေကို software တစ်ခုတည်းနဲ့ data တစ်ခုတည်းပေါ်မှာ execute လုပ်နေတာကို ကြည့်နေတာမို့ — platforms အားလုံးပေါ်မှာ ပုံမှန်အားဖြင့် တူညီတဲ့ result ordering ကို ရလေ့ ရှိလို့ — `ORDER BY` မရှိခြင်းက ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — queries တချို့က cross-platform ordering ကွဲပြားမှုတွေကို တကယ် ပြသပါတယ်။ ပြီးသား install လုပ်ထားတဲ့ server တစ်ခုကို ဆန့်ကျင်ပြီး စမ်းသပ်တဲ့အခါ — ordering ကွဲပြားမှုတွေက — non-C locale settings တွေ ဒါမှမဟုတ် `work_mem` ဒါမှမဟုတ် planner cost parameters တွေရဲ့ custom values (စိတ်ကြိုက် တန်ဖိုးများ) လို — default မဟုတ်တဲ့ parameter settings တွေကြောင့်လည်း ဖြစ်စေနိုင်ပါတယ်။

ဒါကြောင့် — ordering ကွဲပြားမှု တစ်ခုကို မြင်ရရင် — သင့် ရလဒ်က ချိုးဖောက်နေတဲ့ `ORDER BY` တစ်ခု query ထဲမှာ တကယ် ပါနေတာ မဟုတ်ဘူးဆိုရင် — ပူစရာ မလိုပါဘူး။ ဒါပေမယ့် — ဘာပဲဖြစ်ဖြစ် report လုပ်ပေးပါ — ဒါမှ နောင်ထွက်မယ့် releases တွေမှာ အတုအယောင် “failure” တွေကို ဖယ်ရှားဖို့ — အဲဒီ query အတွက် `ORDER BY` တစ်ခု ကျွန်ုပ်တို့ ထည့်နိုင်မှာ ဖြစ်ပါတယ်။

ဒီ ပြဿနာကို တစ်ကြိမ်တည်းနဲ့ အပြီး ဖယ်ရှားဖို့ — regression test queries တွေ အားလုံးကို ဘာကြောင့် ရှင်းရှင်းလင်းလင်း order မလုပ်ထားလဲလို့ သင် တွေးမိနိုင်ပါတယ်။ အကြောင်းရင်းကတော့ — ဒါက regression tests တွေကို ပိုပြီး အသုံးဝင်စေမယ့်အစား — အသုံးနည်းစေမှာ ဖြစ်လို့ပါ — အကြောင်းကတော့ အဲဒါတွေက ordered results တွေ ထုတ်ပေးတဲ့ query plan types တွေကိုပဲ — order မလုပ်တဲ့ plan types တွေကို ချန်လှပ်ပြီး — စမ်းသပ် ဖြစ်သွားလို့ပါ။

### 31.2.6. Insufficient Stack Depth (stack depth မလုံလောက်ခြင်း)

`errors` test က `select infinite_recurse()` command မှာ server crash တစ်ခု ရလဒ်ထွက်ခဲ့ရင် — ဒါက platform ရဲ့ process stack size အပေါ် ကန့်သတ်ချက်က [max_stack_depth](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-STACK-DEPTH) parameter ညွှန်ပြတာထက် ပိုငယ်တယ်လို့ ဆိုလိုပါတယ်။ ဒါကို — server ကို ပိုကြီးတဲ့ stack size limit တစ်ခုအောက်မှာ run လုပ်ခြင်းအားဖြင့် ပြုပြင်နိုင်ပါတယ် (default `max_stack_depth` တန်ဖိုးနဲ့ဆိုရင် 4MB ကို အကြံပြုပါတယ်)။ အဲဒါ မလုပ်နိုင်ဘူးဆိုရင် — အခြားနည်းလမ်း တစ်ခုကတော့ `max_stack_depth` ရဲ့ တန်ဖိုးကို လျှော့ချဖို့ ဖြစ်ပါတယ်။

`getrlimit()` ကို ထောက်ပံ့တဲ့ platforms တွေပေါ်မှာ — server က `max_stack_depth` ရဲ့ လုံခြုံတဲ့ တန်ဖိုး တစ်ခုကို အလိုအလျောက် ရွေးချယ်သင့်ပါတယ်; ဒါကြောင့် — ဒီ setting ကို သင်ကိုယ်တိုင် manually override (ကိုယ်တိုင် ကျော်လွန် သတ်မှတ်) မလုပ်ထားဘူးဆိုရင် — ဒီလို failure မျိုးက report လုပ်ထိုက်တဲ့ bug တစ်ခု ဖြစ်ပါတယ်။

### 31.2.7. The “random” Test (“random” test အကြောင်း)

`random` test script က random results တွေ ထုတ်လုပ်ဖို့ ရည်ရွယ်ထားပါတယ်။ အလွန် ရှားပါးတဲ့ ကိစ္စတွေမှာ — ဒါက အဲဒီ regression test ကို fail ဖြစ်စေပါတယ်။ အောက်ပါအတိုင်း ရိုက်ထည့်ခြင်းဖြင့်:

```sql
diff results/random.out expected/random.out
```

ကွာခြားချက် တစ်ကြောင်း ဒါမှမဟုတ် နှစ်ကြောင်းလောက်ပဲ ထွက်သင့်ပါတယ်။ Random test က အကြိမ်ကြိမ် fail မဖြစ်ဘူးဆိုရင် ပူစရာ မလိုပါဘူး။

### 31.2.8. Configuration Parameters (configuration parameters များ)

ပြီးသား installation တစ်ခုကို ဆန့်ကျင်ပြီး tests တွေကို run လုပ်တဲ့အခါ — default မဟုတ်တဲ့ parameter settings တချို့က tests တွေကို fail ဖြစ်စေနိုင်ပါတယ်။ ဥပမာ — `enable_seqscan` ဒါမှမဟုတ် `enable_indexscan` လို parameters တွေကို ပြောင်းလဲတာက — `EXPLAIN` သုံးတဲ့ tests တွေရဲ့ ရလဒ်တွေကို ထိခိုက်စေမယ့် plan changes တွေ ဖြစ်စေနိုင်ပါတယ်။
