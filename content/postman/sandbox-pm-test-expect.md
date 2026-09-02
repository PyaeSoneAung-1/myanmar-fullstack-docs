---
title: "Scripts တွေထဲမှာ tests နဲ့ assertions တွေ ရေးခြင်း (Writing tests and assertions in scripts)"
description: "pm.test နဲ့ pm.expect methods တွေသုံးပြီး test specifications နဲ့ assertions တွေ ရေးခြင်း — ChaiJS expect BDD syntax, response data ပေါ်မှာ assertions လုပ်ခြင်း"
order: 88
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-test-expect/"
status: translated
updated: 2026-09-02
---

[pm.test](#pmtest) နဲ့ [pm.expect](#pmexpect) methods တွေကို သုံးပြီး သင့် scripts တွေထဲမှာ test specifications တွေနဲ့ assertions တွေ ထည့်နိုင်ပါတယ်။

## pm.test

HTTP အတွက် **Pre-request** ဒါမှမဟုတ် **Post-response** scripts တွေထဲမှာ (gRPC အတွက်ဆိုရင် **Before invoke**, **On message** ဒါမှမဟုတ် **After response** scripts တွေထဲမှာ) test specifications တွေ ထည့်ဖို့ `pm.test` method ကို သုံးပါ။ Tests တွေမှာ နာမည်တစ်ခုနဲ့ assertion function တစ်ခု ပါဝင်ပါတယ်။

HTTP request တစ်ခုအတွက် test တစ်ခုက အောက်ပါပုံစံမျိုး ဖြစ်ပါတယ်:

```js
pm.test(testName , specFunction)
```

အဲဒီမှာ:

* `testName` — Test ရဲ့ နာမည် ပါဝင်တဲ့ string တစ်ခုပါ။
* `specFunction` — Test logic ကို သတ်မှတ်တဲ့ function ပါ။

Postman က test results တွေကို response ရဲ့ အစိတ်အပိုင်းအနေနဲ့ output လုပ်ပါတယ်။ `pm.test` method က `pm` object ကို ပြန်ပေးပြီး — calls တွေကို chain လုပ်နိုင်စေပါတယ်။

### ဥပမာများ (Examples)

Response တစ်ခုက ဆက်လုပ်ဖို့ သင့်တင့်မသင့် စစ်ဆေးပါ:

```js
pm.test("response should be okay to process", function () {
  pm.response.to.not.be.error;
  pm.response.to.have.jsonBody('data') // JSON response ထဲမှာ property တစ်ခု ရှိမရှိ စစ်ဆေးသည်
  pm.response.to.have.jsonBody('data', { "id" : 1 }); // Deep comparison လုပ်သည်
});
```

Optional `done` callback တစ်ခုကို သုံးပြီး asynchronous function တစ်ခုကို test လုပ်ပါ:

```js
pm.test('async test', function (done) {
  setTimeout(() => {
    pm.expect(pm.response.code).to.equal(200);
    done();
  }, 1500);
});
```

Code ထဲက သီးခြား location တစ်ခုကနေ run လုပ်ခဲ့တဲ့ tests တွေရဲ့ စုစုပေါင်း အရေအတွက်ကို ရယူပါ:

```js
pm.test.index(); // Number
```

ဆက်စပ်နေတဲ့ assertions တွေကို gRPC test တစ်ခုတည်းထဲမှာ စုဖွဲ့ဖို့ assertions အများအပြား ထည့်ပါ:

```js
pm.test("Should receive update events for both users", function () {
  pm.response.messages.to.include({ action: 'update', userId: 'user1' });
  pm.response.messages.to.include({ action: 'update', userId: 'user2' });
});
```

Code ထဲက သီးခြား location တစ်ခုကနေ run လုပ်ခဲ့တဲ့ tests တွေရဲ့ စုစုပေါင်း အရေအတွက်ကို ရယူပါ:

```js
pm.test.index; () =>number
```

Test တစ်ခုကို ကျော်လိုက်ပါ:

```js
pm.test.skip: (testName, specFunction) => pm
```

## pm.expect

[ChaiJS expect BDD](https://www.chaijs.com/api/bdd/) syntax ကို သုံးပြီး သင့် response data ပေါ်မှာ assertions တွေ ရေးဖို့ `pm.expect` method က ခွင့်ပြုပါတယ်။

```js
pm.expect(value: *): Assertion
```

* `value` — သင် test လုပ်ချင်တဲ့အရာပါ။ `*` က string ဒါမှမဟုတ် integer လိုမျိုး — value မဆို မည်သည့် type မဆို ဖြစ်နိုင်ပါတယ်။
* `Assertion` — Chainable methods တွေ ပါဝင်တဲ့ Chai Assertion object တစ်ခုပါ။

သင့် assertions တွေကို တည်ဆောက်ဖို့ `pm.response.to.have.*` နဲ့ `pm.response.to.be.*` တွေကိုလည်း သုံးနိုင်ပါတယ်။

နောက်ထပ် assertions တွေအတွက် — [Postman test script နမူနာများ](/docs/postman/test-examples) ကို ကြည့်ပါ။

### ဥပမာများ (Examples)

Response က HTTP 200 OK response တစ်ခု ပြန်ပေးမပေး စစ်ဆေးပါ:

```js
pm.test("Response status code is 200", function () {
    // value: pm.response.code (ကိန်းတစ်ခု)
    // Assertion: 200 နဲ့ တူမတူ စစ်ဆေးသည်
    pm.expect(pm.response.code).to.eql(200);
});
```

Request ရဲ့ response body ထဲမှာ `true` တန်ဖိုး ပါမပါ စစ်ဆေးပါ:

```js
pm.test("Response body has success = true", function () {
    const jsonData = pm.response.json();
    // value: jsonData.success (boolean တစ်ခု)
    // Assertion: true နဲ့ တူမတူ စစ်ဆေးသည်
    pm.expect(jsonData.success).to.eql(true);
});
```
