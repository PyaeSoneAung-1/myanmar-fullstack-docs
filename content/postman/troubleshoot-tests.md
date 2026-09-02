---
title: "အများသုံး Test အမှားများကို ဖြေရှင်းခြင်း (Troubleshoot Test Errors)"
description: "Post-response scripts တွေမှာ error တွေ ဖြစ်တဲ့အခါ troubleshoot လုပ်နည်း — Postman Console logs သုံးခြင်း၊ deep equality/undefined errors၊ variable not defined၊ test fail မဖြစ်ခြင်း"
order: 30
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/troubleshoot-tests/"
status: translated
updated: 2026-09-02
---

Post-response scripts တွေမှာ error တွေ ဒါမှမဟုတ် မျှော်လင့်မထားတဲ့ အပြုအမူတွေ ကြုံရတဲ့အခါ — [Postman Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) က ပြဿနာရဲ့ ရင်းမြစ်ကို ရှာဖွေဖို့ ကူညီပေးနိုင်ပါတယ်။

## Postman Console logs တွေကို သုံးခြင်း

`console.log()`, `console.info()`, `console.warn()` နဲ့ `console.error()` စတဲ့ debug statements တွေကို ကိုယ့်ရဲ့ test assertions တွေနဲ့ တွဲသုံးပြီး — HTTP requests နဲ့ responses တွေရဲ့ content, variables လိုမျိုး Postman data items တွေကို စစ်ဆေးနိုင်ပါတယ်။ Console ထဲက အချက်အလက်တွေကို ရှင်းလင်းဖို့ `console.clear()` method ကိုလည်း သုံးနိုင်ပါတယ်။ Console ကို ဖွင့်ဖို့ — Postman ရဲ့ footer က ![Console icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-console-stroke.svg#icon) **Console** ကို ရွေးပါ။

![Console info](https://assets.postman.com/postman-docs/v12/console-logs-in-pane.png)

Variable တစ်ခု ဒါမှမဟုတ် response property တစ်ခုရဲ့ တန်ဖိုးကို log လုပ်ခြင်း:

```js
console.log(pm.collectionVariables.get("name"));
console.log(pm.response.json().name);
```

Variable တစ်ခု ဒါမှမဟုတ် response property တစ်ခုရဲ့ type ကို log လုပ်ခြင်း:

```js
console.log(typeof pm.response.json().id);
```

Console logs တွေကို code execution ကို အမှတ်အသားပြုဖို့ ("trace statements" လို့လည်း ခေါ်ပါတယ်) အနေနဲ့လည်း သုံးနိုင်ပါတယ်:

```js
if (pm.response.json().id) {
  console.log("id was found!");
  // တစ်ခုခု လုပ်ပါ
} else {
  console.log("no id ...");
  // တခြားတစ်ခုခု လုပ်ပါ
}
```

## Assertion deep equality error

`AssertionError: expected <value> to deeply equal '<value>'` ဆိုတဲ့ error မျိုး ကြုံရနိုင်ပါတယ်။ ဥပမာ — အောက်ပါ code နဲ့ဆိုရင် ဒီ error ဖြစ်တတ်ပါတယ်:

```js
pm.expect(1).to.eql("1");
```

ဒါက — test က number တစ်ခုကို string value တစ်ခုနဲ့ ယှဉ်နေလို့ ဖြစ်တာပါ။ Type ရော value ရော နှစ်ခုလုံး တူညီမှသာ test က true ပြန်ပါတယ်။

## Variable not defined error

`ReferenceError: <variable> is not defined` ဆိုတဲ့ error မျိုး ကြုံရနိုင်ပါတယ်။ ဒါက များသောအားဖြင့် — ကြေညာထားခြင်း (declare) မရှိသေးတဲ့ ဒါမှမဟုတ် ကိုယ့် test code ရဲ့ scope အပြင်ဘက်မှာ ရှိနေတဲ့ variable တစ်ခုကို ကိုးကားဖို့ ကြိုးစားတဲ့အခါ ဖြစ်တတ်ပါတယ်။

အောက်က ဥပမာမှာ — ပထမ test ထဲမှာ JSON object တစ်ခုက variable တစ်ခုရဲ့ တန်ဖိုး ဖြစ်နေပြီး — ဒုတိယ test က အဲဒီ variable ကို ကိုးကားဖို့ ကြိုးစားပေမယ့် — variable က ဒုတိယ test ရဲ့ code scope အပြင်ဘက်မှာ ရှိနေလို့ မရနိုင်ပါဘူး။

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "name": "John",
  "age": 29
},
*/
pm.test("Test 1", () => {
  const jsonData = pm.response.json();
  pm.expect(jsonData.name).to.eql("John");
});

pm.test("Test 2", () => {
  pm.expect(jsonData.age).to.eql(29); // ReferenceError: jsonData is not defined
});
```

Test functions တွေက variable တစ်ခုကို ကိုးကားဖို့ လိုအပ်ရင် — variable က global scope မှာ ရနိုင်အောင် သေချာ လုပ်ထားပါ။ အပေါ်က ဥပမာမှာ — `const jsonData = pm.response.json();` ကို ပထမ `pm.test` ရဲ့ အရှေ့မှာ ရွှေ့ထားရင် test function နှစ်ခုလုံးအတွက် ရနိုင်ပါပြီ။

## Assertion undefined error

`AssertionError: expected undefined to deeply equal <value>` ဆိုတဲ့ error မျိုး ကြုံရနိုင်ပါတယ်။ ဒါက များသောအားဖြင့် — မရှိတဲ့ ဒါမှမဟုတ် scope အပြင်ဘက်က property တစ်ခုကို ကိုးကားနေတဲ့အခါ ဖြစ်တတ်ပါတယ်။

```js
const jsonData = pm.response.json();
pm.expect(jsonData.name).to.eql("John");
```

ဒီဥပမာမှာ `AssertionError: expected undefined to deeply equal 'John'` ဆိုတဲ့ error ရရင် — `name` property က `jsonData` object ထဲမှာ သတ်မှတ်ထားခြင်း မရှိဘူးလို့ ဆိုလိုပါတယ်။

## Test က fail မဖြစ်တဲ့ ပြဿနာ

Test တစ်ခု fail ဖြစ်မယ်လို့ မျှော်လင့်ထားပေမယ့် — fail မဖြစ်တဲ့ အခြေအနေမျိုးတွေ ရှိနိုင်ပါတယ်။ ကိုယ့် test code က syntax ပိုင်း မှန်ကန်ကြောင်း သေချာပြီးမှ — request ကို ပြန်ပို့ကြည့်ပါ။

အောက်က ဥပမာမှာ — `true` က `false` နဲ့ မတူတာကြောင့် test က fail ဖြစ်ရမှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — `pm.test` function ကို မှန်ကန်စွာ သတ်မှတ်မထားလို့ test က တကယ်တော့ pass ဖြစ်နေပါတယ်။ `pm.test` function မှာ — test result output ထဲမှာ ပြသမယ့် text string ဖြစ်တဲ့ ပထမ parameter ပျောက်နေပါတယ်။ [`pm.test` function သုံးပြီး tests တွေ သတ်မှတ်ခြင်း](/docs/postman/testing) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

```js
pm.test( function () {
    pm.expect(true).to.eql(false);
});
```
