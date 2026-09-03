---
title: "AsyncWorker (Background Thread တွင် Long-running C/C++ Code များ Run လုပ်ခြင်း)"
description: "node-addon-api ရဲ့ AsyncWorker class ကို သုံးပြီး ကြာမြင့်ချိန် ရှည်လျားတဲ့ C/C++ code တွေကို background thread ပေါ်မှာ run လုပ်နည်း — SimpleAsyncWorker ဥပမာ, Execute/OnOK/OnError methods များ, JavaScript ဘက်က run ပုံ နဲ့ caveats"
order: 83
source: "https://nodejs.org/en/learn/node-api/special-topics/asyncworker"
status: translated
updated: 2026-09-03
---

သင့်မှာ — Node ရဲ့ main event loop ပေါ်မှာ run လုပ်မယ့်အစား background မှာ run လုပ်ချင်တဲ့ — ကြာမြင့်ချိန် ရှည်လျားတဲ့ C/C++ code တစ်ပိုင်း ပါဝင်တဲ့ project တစ်ခု ရှိနေနိုင်ပါတယ်။ Node-API ရဲ့ [`AsyncWorker`](https://github.com/nodejs/node-addon-api/blob/main/doc/async_worker.md) class က ဒီလိုကိစ္စမျိုးအတွက် အတိအကျ ဒီဇိုင်းထုတ်ထားတာ ဖြစ်ပါတယ်။

Programmer တစ်ယောက်အနေနဲ့ သင့်ရဲ့ အလုပ်က — အနှစ်သာရအားဖြင့် `AsyncWorker` ကို subclass လုပ်ပြီး `Execute` method ကို implement လုပ်ဖို့ပဲ ဖြစ်ပါတယ်။ `AsyncWorker` ကို သုံးရ ပိုလွယ်ကူစေဖို့ wrapper function တစ်ခုကိုလည်း သင်က implement လုပ်နိုင်ပါတယ်။

ဒီဥပမာမှာ — `AsyncWorker` ကို subclass လုပ်တဲ့ `SimpleAsyncWorker` class တစ်ခုကို ဖန်တီးသွားပါမယ်။ Worker က — သူ "အလုပ်လုပ်" ရမယ့် ကြာချိန် ဘယ်လောက်လဲဆိုတာကို ညွှန်ပြတဲ့ integer value တစ်ခုကို လက်ခံပါတယ်။ Worker က ပြီးစီးသွားတဲ့အခါ — ဘယ်လောက်ကြာကြာ အလုပ်လုပ်ခဲ့လဲဆိုတာ ညွှန်ပြတဲ့ text string တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ဖြစ်ရပ်တစ်ခုမှာတော့ worker က error တစ်ခုကို ညွှန်ပြပါလိမ့်မယ်။

## SimpleAsyncWorker

[**SimpleAsyncWorker.h**](https://github.com/nodejs/node-addon-examples/blob/main/src/5-async-work/napi-asyncworker-example/node-addon-api/src/SimpleAsyncWorker.h) က `SimpleAsyncWorker` ရဲ့ C++ header ဖြစ်ပါတယ်။ ၎င်းက — `SimpleAsyncWorker` run ရမယ့် ကြာချိန် (seconds) ကို argument အဖြစ် လက်ခံတဲ့ constructor တစ်ခုကို ကြေညာပါတယ်။ ဒီတန်ဖိုးကို သိမ်းဆည်းထားဖို့ private data member တစ်ခုကိုလည်း ကြေညာထားပါတယ်။

Header က `AsyncWorker` က ကြေညာထားတဲ့ methods တွေကို override လုပ်တဲ့ — `Execute` နဲ့ `OnOK` ဆိုတဲ့ method နှစ်ခုကိုလည်း ကြေညာပြီး — ၎င်းတို့ကို အောက်မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

[**SimpleAsyncWorker.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/5-async-work/napi-asyncworker-example/node-addon-api/src/SimpleAsyncWorker.cc) က C++ implementation ဖြစ်ပါတယ်။ Constructor က argument နှစ်ခုကို လက်ခံပါတယ်။ `callback` က — `Execute` method က ပြန်လာတဲ့အခါ ခေါ်ခံရတဲ့ JavaScript function ဖြစ်ပြီး — error ရှိသည်ဖြစ်စေ မရှိသည်ဖြစ်စေ `callback` ကို ခေါ်ပါတယ်။ ဒုတိယ constructor argument ဖြစ်တဲ့ `runTime` က — worker က ဘယ်လောက်ကြာကြာ (seconds) run ရမယ်ဆိုတာကို ညွှန်ပြတဲ့ integer value ဖြစ်ပါတယ်။

Node က `Execute` method ရဲ့ code ကို — Node ရဲ့ main event loop ကို run နေတဲ့ thread နဲ့ သီးခြားဖြစ်တဲ့ thread တစ်ခုပေါ်မှာ run ပေးပါတယ်။ `Execute` method က Node-API environment ရဲ့ ဘယ်အစိတ်အပိုင်းကိုမှ _ဝင်ရောက်ခွင့် မရှိပါဘူး_။ ဒါကြောင့်ပဲ `runTime` input value ကို constructor က private data member တစ်ခုအနေနဲ့ သိမ်းဆည်းထားတာ ဖြစ်ပါတယ်။

ဒီ implementation မှာ `Execute` method က — အစောပိုင်းက `runTime` မှာ သတ်မှတ်ထားတဲ့ seconds အရေအတွက်ကို ရိုးရိုးလေး စောင့်ဆိုင်းပေးပါတယ်။ တကယ့် implementation တစ်ခုမှာတော့ long-running code ကို ထည့်ရမယ့် နေရာက ဒီနေရာပဲ ဖြစ်ပါတယ်။ Error handling က ဘယ်လို အလုပ်လုပ်လဲ သရုပ်ပြဖို့ — ဒီ `Execute` method က 4 seconds run လုပ်ဖို့ တောင်းဆိုခံရတဲ့အခါ error တစ်ခုကို ကြေညာပါတယ်။

`OnOK` method ကို — `Execute` method က `SetError` ကို မခေါ်ဘူးဆိုရင် (ဒါမှမဟုတ် — C++ exceptions enable လုပ်ထားပြီး exception တစ်ခု throw မဖြစ်ဘူးဆိုရင်) — `Execute` method က ပြန်လာပြီးနောက်မှာ ခေါ်ပါတယ်။ Error ဖြစ်တဲ့ကိစ္စမှာတော့ `OnOK` အစား `OnError` method ကို ခေါ်ပါတယ်။ ပုံမှန် `OnError` implementation က `AsyncWorker` callback function ကို — error ကို တစ်ခုတည်းသော argument အဖြစ် ပေးပြီး — ခေါ်လိုက်ရုံပါပဲ။

ဒီ implementation မှာ `OnOK` method က string value တစ်ခုကို ပုံဖော်ပြီး — constructor မှာ သတ်မှတ်ထားတဲ့ `callback` function ဆီ _ဒုတိယ_ argument အဖြစ် ပေးပို့ပါတယ်။ `callback` function ဆီ ပေးပို့တဲ့ ပထမ argument ကတော့ JavaScript `null` value တစ်ခု ဖြစ်ပါတယ်။ အကြောင်းရင်းက — error ဖြစ်သည်ဖြစ်စေ မဖြစ်သည်ဖြစ်စေ callback function တစ်ခုတည်းကိုပဲ ခေါ်လို့ ဖြစ်ပါတယ်။ `SimpleAsyncWorker` က override မလုပ်ထားတဲ့ ပုံမှန် `OnError` method က error ကို callback ရဲ့ ပထမ argument အဖြစ် ပေးပို့ပါတယ်။ ဒါက နောက် section မှာ ပိုပြီး ရှင်းလင်းသွားပါလိမ့်မယ်။

`Execute` နဲ့ မတူဘဲ — `OnOK` နဲ့ `OnError` methods တွေကတော့ Node-API environment ကို _ဝင်ရောက်ခွင့် ရှိပါတယ်_ ဆိုတာ သတိပြုပါ။

## RunSimpleAsyncWorker

`SimpleAsyncWorker` objects တွေကို instantiate လုပ်ပြီး — queue ထဲ ထည့်ဖို့ တောင်းဆိုပေးမယ့် C++ function တစ်ခု လိုအပ်ပါတယ်။ ဒီ function ကို JavaScript code ကနေ ဝင်ရောက် ခေါ်ဆိုနိုင်ဖို့ Node-API နဲ့ register လုပ်ထားရပါမယ်။ [**RunSimpleAsyncWorker.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/5-async-work/napi-asyncworker-example/node-addon-api/src/RunSimpleAsyncWorker.cc) က ဒီ wrapper ကို ထောက်ပံ့ပေးပါတယ်။

JavaScript ကနေ ဝင်ရောက် ခေါ်ဆိုနိုင်တဲ့ `runSimpleAsyncWorker` function က — `info` argument ကနေတစ်ဆင့် ပေးပို့ခံရတဲ့ argument နှစ်ခုကို လက်ခံပါတယ်။ `info[0]` အနေနဲ့ ပေးပို့တဲ့ ပထမ argument က `runTime` ဖြစ်ပြီး — ဒုတိယ argument ကတော့ `Execute` method က ပြန်လာတဲ့အခါ ခေါ်ခံရမယ့် JavaScript callback function ဖြစ်ပါတယ်။

ပြီးတော့ code က `SimpleAsyncWorker` object တစ်ခုကို instantiate လုပ်ပြီး — next tick မှာ ဖြစ်နိုင်တဲ့ execution အတွက် queue ထဲ ထည့်ဖို့ တောင်းဆိုပါတယ်။ `SimpleAsyncWorker` object ကို queue ထဲ မထည့်ထားဘူးဆိုရင် — သူ့ရဲ့ `Execute` method ကို ဘယ်တော့မှ ခေါ်မှာ မဟုတ်ပါဘူး။

`SimpleAsyncWorker` object ကို queue ထဲ ထည့်လိုက်ပြီးတာနဲ့ — `runSimpleAsyncWorker` က text string တစ်ခုကို ပုံဖော်ပြီး caller ဆီ ပြန်ပေးပါတယ်။

## JavaScript ထဲမှာ Run လုပ်ခြင်း (Running in JavaScript)

[**Test.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/5-async-work/napi-asyncworker-example/node-addon-api/test/Test.js) က `SimpleAsyncWorker` instance တွေကို ဘယ်လို run လုပ်ရမယ်ဆိုတာ ပြသပေးတဲ့ ရိုးရှင်းတဲ့ JavaScript program တစ်ခု ဖြစ်ပါတယ်။ ၎င်းက `runSimpleAsyncWorker` ကို — `runTime` parameter မတူညီတဲ့ တန်ဖိုးတွေနဲ့ — သုံးကြိမ် ခေါ်ပါတယ်။ ခေါ်မှု တစ်ခုချင်းစီမှာ `AsyncWorkerCompletion` ကို callback function အဖြစ် သတ်မှတ်ပါတယ်။

`AsyncWorkerCompletion` function က — `Execute` method က error တစ်ခုကို သတင်းပို့တဲ့ကိစ္စ နဲ့ မပို့တဲ့ကိစ္စ နှစ်မျိုးစလုံးကို ကိုင်တွယ်ဖို့ ရေးထားပါတယ်။ ၎င်းကို ခေါ်လိုက်တဲ့အခါ console ပေါ်ကို log လုပ်ရုံပါပဲ။

JavaScript က အောင်မြင်စွာ run တဲ့အခါ output က ဒီလိုမျိုး ပေါ်ပါတယ်:

```
runSimpleAsyncWorker returned 'SimpleAsyncWorker for 2 seconds queued.'.
runSimpleAsyncWorker returned 'SimpleAsyncWorker for 4 seconds queued.'.
runSimpleAsyncWorker returned 'SimpleAsyncWorker for 8 seconds queued.'.
SimpleAsyncWorker returned 'SimpleAsyncWorker returning after 'working' 2 seconds.'.
SimpleAsyncWorker returned an error:  [Error: Oops! Failed after 'working' 4 seconds.]
SimpleAsyncWorker returned 'SimpleAsyncWorker returning after 'working' 8 seconds.'.
```

မျှော်လင့်ထားသလိုပဲ — `runSimpleAsyncWorker` ကို ခေါ်တာတိုင်း ချက်ချင်း ပြန်လာပါတယ်။ `SimpleAsyncWorker` တစ်ခုချင်းစီ ပြီးစီးသွားတဲ့အခါ `AsyncWorkerCompletion` function ကို ခေါ်ပါတယ်။

## သတိပြုရမည့်အချက်များ (Caveats)

- `Execute` method က Node-API call တွေ လုံးဝ မလုပ်တာက _မရှိမဖြစ်_ လိုအပ်ပါတယ်။ ဆိုလိုတာက `Execute` method က JavaScript code ကနေ ပေးပို့လိုက်တဲ့ input value တွေဆီ _ဝင်ရောက်ခွင့် မရှိပါဘူး_။

  ပုံမှန်အားဖြင့် — `AsyncWorker` class ရဲ့ constructor က JavaScript objects တွေကနေ လိုအပ်တဲ့ အချက်အလက်တွေကို စုဆောင်းပြီး — အဲဒီအချက်အလက်တွေရဲ့ _မိတ္တူများ (copies)_ ကို data members အဖြစ် သိမ်းဆည်းပါတယ်။ ပြီးရင် `Execute` method ရဲ့ ရလဒ်တွေကို `OnOK` method ထဲမှာ JavaScript objects တွေအဖြစ် ပြန်ပြောင်းနိုင်ပါတယ်။

- Node process က run နေဆဲ `Execute` methods တွေ အားလုံးကို သတိပြုမိနေပြီး — run နေဆဲ `Execute` methods တွေ အားလုံး ပြန်မလာမချင်း terminate လုပ်မှာ မဟုတ်ပါဘူး။

- AsyncWorker တစ်ခုကို — main thread ကနေ `AsyncWorker::Cancel` call တစ်ခုနဲ့ လုံခြုံစွာ ရပ်တန့်နိုင်ပါတယ်။
