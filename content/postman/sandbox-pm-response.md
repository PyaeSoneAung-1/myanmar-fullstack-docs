---
title: "Scripts တွေထဲမှာ Postman responses တွေကို ကိုးကားခြင်း (Reference Postman responses in scripts)"
description: "pm.response object နဲ့ responses တွေကို ကိုးကားခြင်း — text()/json() methods, properties တွေ (code, status, headers, responseTime, responseSize, metadata, trailers, messages) နဲ့ JSON Schema validation"
order: 74
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-response/"
status: translated
updated: 2026-09-02
---

`pm.response` object က လက်ရှိ request အတွက် response ထဲမှာ ပြန်ရလာတဲ့ data တွေကို access ပေးပါတယ်။ ဒီ object ကို **Post-response** scripts တွေမှာပဲ ရနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — Postman Collection SDK [Response](https://www.postmanlabs.com/postman-collection/Response.html) reference ကို ကြည့်ပါ။

## pm.response

Responses တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.response` methods တွေကို သုံးပါ။

### pm.response.text():Function

Response text string ကို ရယူပါတယ်။

### pm.response.json():Function

Response JSON object ကို ရယူပါတယ် — ပြန်ရလာတဲ့ properties တွေကို ရဖို့ ၎င်းကို သုံးနိုင်ပါတယ်။

## pm.response properties တွေ

`pm.response` object ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:

* `pm.response.code:Number` — Response status code ပါ။

* `pm.response.status:String` — Status text string ပါ။

* `pm.response.headers:HeaderList` — [Response headers ရဲ့ စာရင်း](https://www.postmanlabs.com/postman-collection/HeaderList.html) ပါ။

* `pm.response.responseTime:Number` — Response ကို လက်ခံရရှိဖို့ ကြာတဲ့ အချိန် — milliseconds နဲ့ ဖြစ်ပါတယ်။ Streaming methods တွေရှိတဲ့ requests တွေအတွက် — `responseTime` က အဲဒီ request execution တစ်ခုလုံးရဲ့ စုစုပေါင်း ကြာချိန်ကို ဖော်ပြပါတယ်။

* `pm.response.responseSize:Number` — လက်ခံရရှိတဲ့ response ရဲ့ အရွယ်အစားပါ။

- `pm.response.metadata` — Response နဲ့အတူ လက်ခံရရှိတဲ့ metadata ရဲ့ စာရင်းပါ။ Metadata item တစ်ခုချင်းစီက `key` နဲ့ `value` properties တွေ ပါဝင်တဲ့ [`PropertyList`](https://www.postmanlabs.com/postman-collection/PropertyList.html) object တစ်ခုပါ။

- `pm.response.trailers` — Response နဲ့အတူ လက်ခံရရှိတဲ့ trailers ရဲ့ စာရင်းပါ။ Trailer item တစ်ခုချင်းစီက `key` နဲ့ `value` properties တွေ ပါဝင်တဲ့ `PropertyList` object တစ်ခုပါ။

- `pm.response.messages` — ထွက်သွားတဲ့ messages ရဲ့ စာရင်းပါ။ Message တစ်ခုချင်းစီက အောက်ပါ properties တွေ ပါဝင်တဲ့ `PropertyList` object တစ်ခုပါ:

  * `data` — လက်ခံရရှိတဲ့ message ရဲ့ contents တွေပါ။
  * `timestamp` — Message ကို လက်ခံရရှိတဲ့ အချိန်ပါ — `Date` object တစ်ခုအနေနဲ့ ကိုယ်စားပြုပါတယ်။

  Unary နဲ့ client streaming methods တွေရှိတဲ့ requests တွေအတွက် — `pm.response.messages` ထဲမှာ index `0` မှာ message တစ်ခုပဲ ပါဝင်ပြီး — `pm.response.messages.idx(0)` နဲ့ access လုပ်နိုင်ပါတယ်။

## JSON Schema တစ်ခုနဲ့ response data တွေကို validate လုပ်ခြင်း

`jsonSchema` method က JSON Schema တစ်ခုနဲ့ response data တွေကို validate လုပ်တဲ့ [test assertion တစ်ခု ရေးသားနိုင်စေပါတယ်](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-test-expect/#pmtest)။ Postman က response data တွေကို JSON Schema တစ်ခုနဲ့ validate လုပ်ဖို့ [Ajv JSON Schema validator](https://www.npmjs.com/package/ajv/v/6.12.5) ရဲ့ version 6.12.5 ကို သုံးပါတယ်။

ကိုယ့် test assertion ကို ရေးဖို့ — response ထဲမှာ ပြန်ရလာတဲ့ data တွေကို access လုပ်ဖို့ `pm.response` object နဲ့ [Chai Assertion Library BDD](https://www.chaijs.com/api/bdd/) syntax ကို သုံးပါ။

`jsonSchema` method က ပထမ argument မှာ JSON Schema တစ်ခုကို object တစ်ခုအနေနဲ့ လက်ခံပါတယ်။ ဒုတိယ argument မှာလည်း optional [Ajv options](https://www.npmjs.com/package/ajv/v/6.12.5#options) တွေရဲ့ object တစ်ခုကို လက်ခံပါတယ်:

```js
pm.response.<bdd-syntax>.jsonSchema(schema, options);
```

Postman ထဲမှာ — request တစ်ခုရဲ့ **Scripts** tab လိုမျိုး နေရာမှာ JSON Schema တစ်ခုကို define လုပ်နိုင်ပါတယ်။ ပြီးရင် — ကိုယ့် response data ထဲက properties တွေကို define လုပ်ထားတဲ့ JSON Schema နဲ့ validate လုပ်တဲ့ test တစ်ခု ရေးနိုင်ပါတယ်။

### Examples

ဒီဥပမာထဲမှာ — JSON Schema က response data ထဲမှာ Boolean data type တစ်ခုဖြစ်တဲ့ `alpha` property တစ်ခု ပါဝင်ဖို့ လိုအပ်ပါတယ်။ Response data ထဲမှာ ဒီ property မရှိဘူးဆိုရင် ဒါမှမဟုတ် data type မတူညီရင် — test က fail ဖြစ်ပါတယ်။ ဒီဥပမာက assertion ကို ဖော်ပြဖို့ BDD syntax `to.have` ကို သုံးထားပါတယ်:

```js
const schema = {
  "type": "object",
  "properties": {
    "alpha": {
      "type": "boolean"
    }
  },
  "required": ["alpha"]
};

pm.test('Response is valid', function() {
  pm.response.to.have.jsonSchema(schema);
});
```
