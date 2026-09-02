---
title: "Scripts တွေထဲမှာ Postman requests တွေကို ကိုးကားခြင်း (Reference Postman requests in scripts)"
description: "pm.request object နဲ့ requests တွေကို ကိုးကားခြင်း — headers add/remove/upsert လုပ်ခြင်း, method နဲ့ properties တွေ (url, headers, method, body, auth, metadata, messages)"
order: 73
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-request/"
status: translated
updated: 2026-09-02
---

`pm.request` object က ၎င်းအတွင်းမှာ run နေတဲ့ script တစ်ခုကနေ request ရဲ့ data တွေကို access ပေးပါတယ်။ `pm.request` ကို **Before invoke** နဲ့ **After response** scripts နှစ်ခုလုံးမှာ ရနိုင်ပါတယ်။ **Pre-request** script တစ်ခုအတွက်ဆိုရင် — ဒါက မကြာခင် run တော့မယ့် request ပါ။ **Post-response** script တစ်ခုအတွက်ဆိုရင် — ဒါက run ပြီးသွားပြီဖြစ်တဲ့ request ပါ။

Request ကို မပြေးခင် ၎င်းရဲ့ configuration အပိုင်းအမျိုးမျိုးကို ပြောင်းလဲဖို့ pre-request scripts တွေထဲမှာ `pm.request` object ကို သုံးနိုင်ပါတယ်။

## pm.request

Collection requests တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.request` methods တွေကို သုံးပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် — Postman [Collection SDK Request reference](https://www.postmanlabs.com/postman-collection/Request.html) ကို ကြည့်ပါ။

### pm.request.headers.add(header:Header):function

လက်ရှိ request အတွက် ပေးထားတဲ့ နာမည်နဲ့ value နဲ့ header တစ်ခုကို ထည့်ပါတယ်။

### pm.request.headers.remove(headerName:String):function

ပေးထားတဲ့ နာမည်နဲ့ request header ကို ဖျက်ပါတယ်။

### pm.request.headers.upsert(\{key: headerName:String, value: headerValue:String}):function

Header မရှိသေးရင် — ပေးထားတဲ့ header နာမည်နဲ့ value ကို ထည့်ပါတယ်။ ရှိပြီးသားဆိုရင် — ရှိပြီးသား header ကို ပေးထားတဲ့ value နဲ့ update လုပ်ပါတယ်။

## Examples

လက်ရှိ request အတွက် ပေးထားတဲ့ နာမည်နဲ့ value နဲ့ header တစ်ခု ထည့်ပါ:

```js
pm.request.headers.add({
  key: "client-id",
  value: "abcdef"
});
```

## pm.request properties တွေ

`pm.request` object ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:

* `pm.request.url:Url` — Request ရဲ့ URL ပါ။

* `pm.request.headers:HeaderList` — လက်ရှိ request အတွက် headers ရဲ့ စာရင်းပါ။

* `pm.request.method:String` — HTTP request ရဲ့ method ပါ။

* `pm.request.methodPath` — `packageName.serviceName.methodName` format နဲ့ package, service နဲ့ method တို့ရဲ့ နာမည်ပါ။

* `pm.request.body:RequestBody` — Request body ရဲ့ data ပါ။ ဒီ object က immutable ဖြစ်ပြီး — scripts တွေကနေ ပြုပြင်လို့ မရပါဘူး။

* `pm.request.auth` — Request ရဲ့ authentication အသေးစိတ်တွေပါ။

* `pm.request.metadata` — Request နဲ့အတူ ပို့လိုက်တဲ့ metadata ရဲ့ စာရင်းပါ။ Metadata item တစ်ခုချင်းစီက `key` နဲ့ `value` properties တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ ဥပမာ — `PropertyList<{ key: string, value: string }>`။

* `pm.request.messages` — ထွက်သွားတဲ့ messages ရဲ့ စာရင်းပါ။ Message တစ်ခုချင်းစီက အောက်ပါ properties တွေ ပါဝင်တဲ့ [`PropertyList`](https://www.postmanlabs.com/postman-collection/PropertyList.html) object တစ်ခုပါ:

  * `data` — ပို့လိုက်တဲ့ message ရဲ့ contents တွေပါ။
  * `timestamp` — Message ကို ပို့လိုက်တဲ့ အချိန်ပါ — `Date` object တစ်ခုအနေနဲ့ ကိုယ်စားပြုပါတယ်။

  Unary နဲ့ server streaming methods တွေရှိတဲ့ requests တွေအတွက် — `pm.request.messages` ထဲမှာ index `0` မှာ message တစ်ခုပဲ ပါဝင်ပြီး — `pm.request.messages.idx(0)` နဲ့ access လုပ်နိုင်ပါတယ်။

`pm` object ထဲမှာ request mutation ကို ပံ့ပိုးမပေးပါဘူး။
