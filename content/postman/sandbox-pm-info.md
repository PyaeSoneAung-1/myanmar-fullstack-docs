---
title: "Scripts တွေထဲမှာ request metadata တွေကို ကိုးကားခြင်း (Reference request metadata in scripts)"
description: "pm.info object ရဲ့ properties တွေ (eventName, iteration, iterationCount, requestName, requestId) နဲ့ request နဲ့ script ကိုယ်တိုင် နဲ့ ဆက်စပ်တဲ့ meta information တွေကို ကိုးကားခြင်း"
order: 117
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-info/"
status: translated
updated: 2026-09-03
---

`pm.info` object က request နဲ့ script ကိုယ်တိုင် နဲ့ ဆက်စပ်နေတဲ့ meta information တွေကို ပေးပါတယ်။

## pm.info properties တွေ

`pm.info` object ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:

* `pm.info.eventName:String` — HTTP requests တွေအတွက် — script က request ထဲက ဘယ်နေရာမှာ run နေလဲပေါ် မူတည်ပြီး `prerequest` ဒါမှမဟုတ် `test` ဖြစ်ပါတယ်။ gRPC အတွက်ဆိုရင် — script က **Before invoke**, **On message** ဒါမှမဟုတ် **After response** hook တစ်ခုခုမှာ run နေလားပေါ် မူတည်ပြီး အသီးသီး `beforeInvoke`, `onIncomingMessage` ဒါမှမဟုတ် `afterResponse` ဖြစ်ပါတယ်။

* `pm.info.iteration:Number` — လက်ရှိ [iteration](/docs/postman/intro-to-collection-runs) ရဲ့ တန်ဖိုးပါ။

* `pm.info.iterationCount:Number` — run လုပ်ဖို့ စီစဉ်ထားတဲ့ iterations တွေရဲ့ စုစုပေါင်း အရေအတွက်ပါ။

* `pm.info.requestName:String` — Run နေတဲ့ request ရဲ့ သိမ်းထားတဲ့ နာမည်ပါ။

* `pm.info.requestId:String` — Run နေတဲ့ request ကို ခွဲခြားသတ်မှတ်ပေးတဲ့ သီးသန့် GUID တစ်ခုပါ။
