---
title: "What Is JIT compilation? (JIT compilation ဆိုတာ ဘာလဲ)"
description: "PostgreSQL ရဲ့ Just-in-Time (JIT) compilation အကြောင်း — interpreted program evaluation ကို run time မှာ native program အဖြစ် ပြောင်းလဲခြင်း၊ JIT ဖြင့် အရှိန်မြှင့်နိုင်သော လုပ်ဆောင်ချက်များ (expression evaluation နှင့် tuple deforming)၊ inlining နှင့် LLVM optimization အကြောင်း ရှင်းလင်းချက်"
order: 241
source: "https://www.postgresql.org/docs/current/jit-reason.html"
status: translated
updated: 2026-09-11
---

## 30.1. What Is JIT compilation? (JIT compilation ဆိုတာ ဘာလဲ)

- **30.1.1. JIT Accelerated Operations (JIT ဖြင့် အရှိန်မြှင့်ထားသော လုပ်ဆောင်ချက်များ)**
- **30.1.2. Inlining (inlining / function ကို အတွင်းသို့ ထည့်သွင်းခြင်း)**
- **30.1.3. Optimization (optimization / အကောင်းဆုံးဖြစ်အောင် ပြုပြင်ခြင်း)**

Just-in-Time (JIT) compilation ဆိုတာ interpreted program evaluation ပုံစံ တစ်မျိုးမျိုးကို native program အဖြစ် ပြောင်းလဲပြီး — run time (လည်ပတ်ချိန်) မှာ လုပ်ဆောင်တဲ့ လုပ်ငန်းစဉ် ဖြစ်ပါတယ်။ ဥပမာ — `WHERE a.col = 3` ကဲ့သို့ SQL predicate တစ်ခုကို evaluate လုပ်ဖို့ — မည်သည့် SQL expression ကိုမဆို evaluate လုပ်နိုင်တဲ့ general-purpose code ကို သုံးမယ့်အစား — အဲဒီ expression အတွက် သီးသန့် ဖြစ်တဲ့ function တစ်ခုကို generate လုပ်ပြီး — CPU က native အနေနဲ့ execute လုပ်နိုင်စေတာဖြင့် — အရှိန်မြှင့်မှု (speedup) ရရှိနိုင်ပါတယ်။

PostgreSQL ကို [`--with-llvm`](https://www.postgresql.org/docs/current/install-make.html#CONFIGURE-WITH-LLVM) နဲ့ build လုပ်ထားတဲ့အခါ — [LLVM](https://llvm.org/) ကို သုံးပြီး JIT compilation လုပ်ဖို့ builtin support ကို PostgreSQL မှာ ထည့်သွင်း ပေးထားပါတယ်။

အသေးစိတ် အချက်အလက်တွေအတွက် `src/backend/jit/README` ကို ကြည့်ပါ။

### 30.1.1. JIT Accelerated Operations (JIT ဖြင့် အရှိန်မြှင့်ထားသော လုပ်ဆောင်ချက်များ)

လက်ရှိမှာ PostgreSQL ရဲ့ JIT implementation က expression evaluation နဲ့ tuple deforming တို့ကို အရှိန်မြှင့်ဖို့ support လုပ်ထားပါတယ်။ နောက်ထပ် လုပ်ဆောင်ချက် အတော်များများကိုလည်း အနာဂတ်မှာ အရှိန်မြှင့်နိုင်ပါလိမ့်မယ်။

Expression evaluation ကို `WHERE` clause တွေ၊ target list တွေ၊ aggregate တွေ နဲ့ projection တွေကို evaluate လုပ်ရာမှာ သုံးပါတယ်။ ဒါကို case တစ်ခုချင်းစီအတွက် သီးသန့် code generate လုပ်ခြင်းအားဖြင့် အရှိန်မြှင့်နိုင်ပါတယ်။

Tuple deforming ဆိုတာ on-disk tuple တစ်ခုကို ([အပိုင်း 66.6.1](https://www.postgresql.org/docs/current/storage-page-layout.html#STORAGE-TUPLE-LAYOUT) ကို ကြည့်ပါ) သူ့ရဲ့ in-memory ပုံစံအဖြစ် ပြောင်းလဲတဲ့ လုပ်ငန်းစဉ် ဖြစ်ပါတယ်။ ဒါကို table layout နဲ့ ထုတ်ယူရမယ့် column အရေအတွက်အတွက် သီးသန့် function တစ်ခု ဖန်တီးခြင်းအားဖြင့် အရှိန်မြှင့်နိုင်ပါတယ်။

### 30.1.2. Inlining (inlining / function ကို အတွင်းသို့ ထည့်သွင်းခြင်း)

PostgreSQL က အလွန် extensible ဖြစ်ပြီး — data type အသစ်တွေ၊ function တွေ၊ operator တွေ နဲ့ အခြား database object တွေကို define လုပ်ခွင့် ပေးထားပါတယ်; [အခန်း 36](https://www.postgresql.org/docs/current/extend.html) ကို ကြည့်ပါ။ တကယ်တော့ — built-in object တွေကို နီးပါး တူညီတဲ့ ယန္တရားတွေနဲ့ပဲ အကောင်အထည်ဖော်ထားပါတယ်။ ဒီ extensibility က overhead တချို့ကို ဖြစ်စေပါတယ် — ဥပမာ function call တွေကြောင့်ပါ ([အပိုင်း 36.3](https://www.postgresql.org/docs/current/xfunc.html) ကို ကြည့်ပါ)။ အဲဒီ overhead ကို လျှော့ချဖို့ — JIT compilation က function သေးသေးလေးတွေရဲ့ body တွေကို သူတို့ကို သုံးနေတဲ့ expression တွေထဲ inlining လုပ်နိုင်ပါတယ်။ ဒါက overhead ရဲ့ သိသာတဲ့ ရာခိုင်နှုန်း တစ်ခုကို optimize လုပ်ပြီး ဖယ်ရှားနိုင်စေပါတယ်။

### 30.1.3. Optimization (optimization / အကောင်းဆုံးဖြစ်အောင် ပြုပြင်ခြင်း)

LLVM က generate လုပ်ထားတဲ့ code ကို optimize လုပ်ဖို့ support ရှိပါတယ်။ Optimization တချို့က JIT ကို သုံးတိုင်း လုပ်ဆောင်နိုင်လောက်အောင် ကုန်ကျစရိတ် သက်သာပြီး — အခြားတချို့ကတော့ အချိန်ကြာကြာ run လုပ်တဲ့ query တွေအတွက်သာ အကျိုးရှိပါတယ်။ Optimization တွေအကြောင်း အသေးစိတ်ကို [https://llvm.org/docs/Passes.html#transform-passes](https://llvm.org/docs/Passes.html#transform-passes) မှာ ကြည့်ပါ။
