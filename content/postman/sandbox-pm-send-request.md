---
title: "Scripts တွေထဲကနေ requests ပို့ခြင်း (Use scripts to send requests in Postman)"
description: "pm.sendRequest method နဲ့ scripts တွေထဲကနေ request ပို့ခြင်း — URL string ဒါမှမဟုတ် request configuration အပြည့်အစုံ ပို့ခြင်း, callback နဲ့ asynchronously run လုပ်ခြင်း, response ကို test လုပ်ခြင်း"
order: 85
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-send-request/"
status: translated
updated: 2026-09-02
---

`pm.sendRequest` method ကို သုံးပြီး HTTP requests တွေရဲ့ **Pre-request** ဒါမှမဟုတ် **Post-response** script တစ်ခုကနေ request တစ်ခုကို asynchronously (တစ်ပြိုင်နက် run လုပ်နိုင်အောင်) ပို့နိုင်ပါတယ်။ gRPC scripts တွေအတွက်ဆိုရင် ဒီ method ကို **Before invoke**, **On message** နဲ့ **After response** scripts တွေမှာ သုံးနိုင်ပါတယ်။

ဒီ method က တွက်ချက်မှုတွေ လုပ်နေချိန် ဒါမှမဟုတ် request အများကြီးကို တစ်ခုချင်းစီ ပြီးစီးဖို့ မစောင့်ဘဲ တစ်ပြိုင်နက် ပို့နေချိန်မှာ — background မှာ logic တွေ run လုပ်နိုင်စေပါတယ်။ Callback function တစ်ခု ထည့်ပေးခြင်းဖြင့် — Postman က response ရတဲ့အခါ သင့် code က တုံ့ပြန်နိုင်လို့ blocking (ပိတ်ဆို့ခြင်း) ပြဿနာတွေကို ရှောင်ရှားနိုင်ပါတယ်။ ပြီးရင် response data ပေါ်မှာ လိုအပ်တဲ့ နောက်ထပ် processing တွေကိုလည်း လုပ်ဆောင်နိုင်ပါတယ်။

Collection ထဲက request တစ်ခုကို ၎င်းရဲ့ request ID သုံးပြီး ပို့ချင်ရင်တော့ — [pm.execution.runRequest method](/docs/postman/sandbox-pm-execution) ကို သုံးပါ။

## pm.sendRequest

`pm.sendRequest` method ကို URL string တစ်ခုအနေနဲ့ ဖြစ်စေ၊ headers, method, body [စတဲ့ အချက်အလက်တွေ](http://www.postmanlabs.com/postman-collection/Request.html#~definition) ပါဝင်တဲ့ JSON request configuration အပြည့်အစုံအနေနဲ့ ဖြစ်စေ ပေးပို့နိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [Request definition](http://www.postmanlabs.com/postman-collection/Request.html#~definition) နဲ့ [Response structure](http://www.postmanlabs.com/postman-collection/Response.html) reference documentation တွေကို ကြည့်ပါ။

အောက်ပါ ဥပမာတွေက `pm.sendRequest` method ရဲ့ အသုံးပြုပုံတွေကို ပြပါတယ်:

### ဥပမာများ (Examples)

URL string ရိုးရိုးတစ်ခုနဲ့ ဥပမာ:

```js
try {
    const response = await pm.sendRequest('https://postman-echo.com/get');

    console.log(response.json());
}
catch (error) {
    console.log(error)
}
```

အသေးစိတ် အပြည့်အစုံ ပါတဲ့ request တစ်ခုနဲ့ ဥပမာ:

```js
const postRequest = {
  url: 'https://postman-echo.com/post',
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
    'X-Foo': 'bar'
  },
  body: {
    mode: 'raw',
    raw: JSON.stringify({ key: 'this is json' })
  }
};
pm.sendRequest(postRequest, (error, response) => {
  console.log(error ? error : response.json());
});
```

Test တစ်ခု ပါဝင်တဲ့ ဥပမာ:

```js
pm.sendRequest('https://postman-echo.com/get', (error, response) => {
  if (error) {
    console.log(error);
  }

  pm.test('response should be okay to process', () => {
    pm.expect(error).to.equal(null);
    pm.expect(response).to.have.property('code', 200);
    pm.expect(response).to.have.property('status', 'OK');
  });
});
```
