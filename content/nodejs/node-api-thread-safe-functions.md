---
title: "Thread-Safe Functions (Native Thread များမှ JavaScript ခေါ်ဆိုခြင်း)"
description: "JavaScript functions တွေကို main thread မဟုတ်တဲ့ native threads တွေကနေ လုံခြုံစွာ ခေါ်နိုင်အောင် လုပ်ပေးတဲ့ thread-safe function APIs — message queue, finalizer, Thread Management, [Non]BlockingCall, ဥပမာ နဲ့ FAQ"
order: 86
source: "https://nodejs.org/en/learn/node-api/special-topics/thread-safe-functions"
status: translated
updated: 2026-09-03
---

JavaScript functions တွေကို ပုံမှန်အားဖြင့် native addon ရဲ့ main thread ကနေပဲ ခေါ်လို့ ရပါတယ်။ Addon တစ်ခုက နောက်ထပ် threads တွေ ဖန်တီးမယ်ဆိုရင် — `Napi::Env`, `Napi::Value` (သို့) `Napi::Reference` တစ်ခုခု လိုအပ်တဲ့ node-addon-api functions တွေကို အဲဒီ threads တွေကနေ ခေါ်လို့ မရပါဘူး။

Addon တစ်ခုမှာ နောက်ထပ် threads တွေ ရှိပြီး — အဲဒီ threads တွေက လုပ်ဆောင်ပြီးစီးမှု (processing) အပေါ် အခြေခံပြီး JavaScript functions တွေကို ခေါ်ဖို့ လိုအပ်တဲ့အခါ — အဲဒီ threads တွေက addon ရဲ့ main thread နဲ့ ဆက်သွယ်ပြီး — main thread က သူတို့ ကိုယ်စား JavaScript function ကို ခေါ်ပေးရပါမယ်။ Thread-safe function APIs တွေက ဒါကို လွယ်ကူတဲ့ နည်းလမ်းတစ်ခုနဲ့ လုပ်ဆောင်ပေးပါတယ်။

Thread-safe function တစ်ခုကို main thread ပေါ်မှာ [ThreadSafeFunction::New](https://github.com/nodejs/node-addon-api/blob/main/doc/threadsafe_function.md#new) ကနေတစ်ဆင့် ဖန်တီးပါတယ်:

```cpp
New(napi_env env,
    const Function& callback,
    const Object& resource,
    ResourceString resourceName,
    size_t maxQueueSize,
    size_t initialThreadCount,
    ContextType* context,
    Finalizer finalizeCallback,
    FinalizerDataType* data);
```

Thread-safe function တစ်ခုက အောက်ပါတို့ကို စုစည်း (encapsulate) ထားပါတယ်:

- **Message queue** — JavaScript function ကို run လုပ်ဖို့ တောင်းဆိုချက်တွေ (requests) ကို queue တစ်ခုထဲ ထည့်ထားပြီး — main thread က ၎င်းတို့ကို asynchronous အနေနဲ့ လုပ်ဆောင်ပါတယ်။ Queue ထဲမှာ — `NonBlockingCall()` ပေါ်မှာ "queue full" error တစ်ခု ပြန်မပို့ခင် ဝင်ခွင့်ရှိတဲ့ entry အရေအတွက်ကို `maxQueueSize` parameter နဲ့ ထိန်းချုပ်ပါတယ် (queue အကန့်အသတ်မရှိဖို့ `0` ကို သတ်မှတ်ပါ)
- **JavaScript function** — Run လုပ်ရမယ့် callback (`callback` parameter)။ ဒီ function က (a) argument မပါတဲ့ `[Non]BlockingCall()` overload တွေနဲ့ ခေါ်တဲ့အခါ argument မပါဘဲ အလိုအလျောက် run ခံရတာ (သို့) (b) `[Non]BlockingCall(DataType* data, Callback callback)` overload တွေမှာ ပေးထားတဲ့ callback function ဆီ argument တစ်ခုအနေနဲ့ ပေးပို့ခံရတာ ဖြစ်ပါတယ်
- **Context** — Thread-safe function နဲ့ ဆက်စပ်ဖို့ optional ဖြစ်ပြီး လိုသလို သတ်မှတ်နိုင်တဲ့ data (`context` parameter)
- **Finalizer** — Thread-safe function ကို ဖျက်ဆီးတဲ့အခါ — threads အားလုံး ၎င်းကို သုံးပြီးသွားချိန်မှာ run လုပ်ဖို့ optional callback (`finalizeCallback` parameter)
- **Finalizer data** — Finalizer callback ဆီ ပေးပို့ဖို့ optional data (`data` parameter)

## Thread-Safe Function ကို ခေါ်ဆိုခြင်း (Calling the Thread-Safe Function)

Threads တွေက [`[Non]BlockingCall`](https://github.com/nodejs/node-addon-api/blob/main/doc/threadsafe_function.md#blockingcall--nonblockingcall) ကနေတစ်ဆင့် JavaScript ထဲကို ဝင်ရောက် ခေါ်ဆိုနိုင်ပါတယ်။ ဒါက အောက်ခံ thread-safe function ရဲ့ queue ထဲကို entry တစ်ခု ထည့်ပေးပြီး — event loop ကို လုပ်ဆောင်နေစဉ်အတွင်း main thread က ၎င်းကို asynchronous အနေနဲ့ ကိုင်တွယ်ပါလိမ့်မယ်။

## Thread စီမံခန့်ခွဲမှု (Thread Management)

Thread အများအပြားက thread-safe function ကို တပြိုင်နက် (simultaneously) သုံးနိုင်ပါတယ်။ Thread-safe function က — ၎င်းကို တက်ကြွစွာ သုံးနေတဲ့ threads အရေအတွက်ကို ရေတွက်ပြီး ကိုယ့်ရဲ့ lifecycle ကို စီမံပါတယ်။ ဒီအရေအတွက်က `New()` ထဲက initial thread count parameter ကနေ စတင်ပြီး — `Acquire()` နဲ့ တိုးလာကာ — `Release()` နဲ့ လျှော့ချပါတယ်။ တက်ကြွတဲ့ threads အရေအတွက် သုညကို ရောက်တာနဲ့ — thread-safe function ကို ဖျက်ဆီးပြီး — သတ်မှတ်ထားရင် main thread ပေါ်မှာ finalizer callback ကို run လုပ်ပါတယ်။

Application တွေအတွင်း thread-safe functions တွေကို သုံးဖို့ ယေဘုယျ နည်းလမ်း နှစ်ခု ဒီမှာ ဖော်ပြထားပါတယ်:

### Thread အရေအတွက် ကြိုသိထားခြင်း (Known Number of Threads)

Thread အရေအတွက်ကို thread-safe function ဖန်တီးချိန်မှာ သိထားရင် — `New()` ကို ခေါ်တဲ့အခါ `initial_thread_count` parameter ကို အဲဒီအရေအတွက်နဲ့ သတ်မှတ်ပါ။ Thread တစ်ခုချင်းစီက `Release()` ကို မခေါ်မချင်း thread-safe function ဆီ ကိုယ်ပိုင် ဝင်ရောက်ခွင့် ရှိပါတယ်။ Thread တွေ အားလုံး `Release()` ကို ခေါ်ပြီးတာနဲ့ — thread-safe function ကို ဖျက်ဆီးလိုက်ပါတယ်။

### Threads များ ဖန်တီးခြင်း (Creating Threads)

နောက်ထပ် အသုံးများတဲ့ ကိစ္စတစ်ခုက — run-time မှာ logic အမျိုးမျိုးအပေါ် အခြေခံပြီး threads တွေကို ရွေ့လျားစွာ (dynamically) ဖန်တီးခြင်း၊ ဖျက်ဆီးခြင်းပါ။ ဒီအခြေအနေကို ကိုင်တွယ်ဖို့ နည်းလမ်းတစ်ခုက — thread-safe function APIs တွေနဲ့ အပြန်အလှန် ဆက်သွယ်တဲ့ native JavaScript functions တော်တော်များများကို ဖော်ထုတ်ပေးခြင်းပါ:

1. `New()` ကို initial thread count `1` နဲ့ သုံးပြီး thread-safe function တစ်ခု ဖန်တီးပါ။
2. `Acquire()` ကို ခေါ်ပြီး native thread အသစ်တစ်ခု ဖန်တီးပါ။ Thread အသစ်က အခု `[Non]BlockingCall()` ကို သုံးနိုင်ပါပြီ။
3. ဥပမာ — အောက်ပါ နည်းတွေနဲ့ cleanup/destruction ကို စတင်ပါ:
   - `Abort()` ကို ခေါ်ပြီး — thread တစ်ခုချင်းစီကို `[Non]BlockingCall()` (သို့) `Release()` ခေါ်စေခြင်း
   - တက်ကြွတဲ့ thread count ကို `0` အထိ လျှော့ချနိုင်ဖို့ — threads တွေ အားလုံး `Release()` ခေါ်ကြောင်း သေချာစေဖို့ အခြား thread-safe APIs တွေနဲ့ custom logic ကို သုံးခြင်း

## ဥပမာ (Example)

ဒီဥပမာက — thread-safe function တစ်ခုနဲ့ native thread တစ်ခုကို ဖန်တီးပေးတဲ့ function တစ်ခုတည်းကို ဖော်ထုတ်ပေးထားပါတယ်။ ဒီ function က — native thread က JavaScript ထဲကို ဆယ်ကြိမ် ခေါ်ပြီးတဲ့နောက်မှာ resolve လုပ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။ ဥပမာက source file သုံးခု ပါဝင်ပါတယ်: [**binding.gyp**](https://github.com/nodejs/node-addon-examples/blob/main/src/6-threadsafe-function/thread_safe_function_counting/node-addon-api/binding.gyp) က build ကို configure လုပ်ပြီး — [**addon.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/6-threadsafe-function/thread_safe_function_counting/node-addon-api/addon.cc) က native module ကို implement လုပ်ကာ — [**addon.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/6-threadsafe-function/thread_safe_function_counting/node-addon-api/addon.js) က JavaScript ဘက်ကနေ ၎င်းကို စမ်းသုံးပါတယ်။

`addon.js` ကို run လိုက်ရင် ဒီလိုမျိုး output ထွက်ပါတယ်:

```
2019-11-25T22:14:56.175Z 0
2019-11-25T22:14:56.380Z 1
2019-11-25T22:14:56.582Z 2
2019-11-25T22:14:56.787Z 3
2019-11-25T22:14:56.987Z 4
2019-11-25T22:14:57.187Z 5
2019-11-25T22:14:57.388Z 6
2019-11-25T22:14:57.591Z 7
2019-11-25T22:14:57.796Z 8
2019-11-25T22:14:58.001Z 9
true
```

## မေးလေ့ရှိသော မေးခွန်းများ (Frequently Asked Questions)

### Q: ကျွန်တော့် application က မှန်ကန်စွာ မထွက်နိုင်ဘဲ ရပ်တည်နေတယ် (hang)

ပုံမှန်အားဖြင့် — Node က thread-safe function တစ်ခု finalize မဖြစ်မချင်း cleanup လုပ်ပြီး မထွက်ခွာဘဲ စောင့်ဆိုင်းပါတယ်။ အထက်က Thread စီမံခန့်ခွဲမှု (Thread Management) section ကို ကြည့်ပါ။ ဒီ behavior ကို `Unref()` call တစ်ခုနဲ့ ပြောင်းလဲနိုင်ပြီး — thread count သုည မရောက်ဘဲနဲ့တောင် Node ကို cleanup လုပ်ပြီး ထွက်ခွာခွင့် ပြုပါတယ်။ `Ref()` call တစ်ခုက thread-safe function ကို ယခင် ထွက်ခွာမှု behavior ဆီ ပြန်ပို့ပေးပြီး — ၎င်းကို သုံးနေတဲ့ threads တွေ အားလုံးက `Release()` (သို့) `Abort()` လုပ်ဖို့ လိုအပ်စေပါတယ်။

### Q: Thread တစ်ခုက `[Non]BlockingCall()` call တစ်ခုကနေ `napi_closing` ကို လက်ခံရရှိရင် — သူက `Release()` ကို ခေါ်ဖို့ လိုသေးလား

မလိုပါဘူး။ `napi_closing` ဆိုတဲ့ return value က thread ကို — thread-safe function ကို နောက်ထပ် အသုံးပြုလို့ မရတော့ဘူးဆိုတာ အချက်ပြသင့်ပါတယ်။ ဒါမှာ `Release()` ကို ခေါ်တာလည်း _ပါဝင်ပါတယ်_။
