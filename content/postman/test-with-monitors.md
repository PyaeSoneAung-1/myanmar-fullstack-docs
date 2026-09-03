---
title: "Postman Monitors သုံးပြီး API tests တွေ run လုပ်ခြင်း (Run API tests using Postman Monitors)"
description: "Postman Monitors တွေနဲ့ API ရဲ့ health နဲ့ performance ကို ဆက်တိုက် စောင့်ကြည့်နည်း — endpoint/API တစ်ခုလုံး စောင့်ကြည့်ခြင်း၊ tests run လုပ်ခြင်း၊ HTTP response codes နဲ့ latency တွေကို validate လုပ်ခြင်း"
order: 136
source: "https://learning.postman.com/docs/tests-and-scripts/run-tests/test-with-monitors/"
status: translated
updated: 2026-09-03
---

Postman Monitors တွေနဲ့ဆိုရင် — monitor တစ်ခုကို run ဖို့ trigger လုပ်လိုက်တိုင်း Postman tests တွေကို အလိုအလျောက် run လုပ်ပြီး — သင့် APIs တွေရဲ့ health နဲ့ performance ကို ဆက်တိုက် စစ်ဆေးနိုင်ပါတယ်။ [Monitor တစ်ခု ပြင်ဆင်သတ်မှတ်တဲ့အခါ](/docs/postman/setting-up-monitor) — run လုပ်ချင်တဲ့ requests နဲ့ tests တွေ ပါဝင်တဲ့ collection တစ်ခုကို ရွေးချယ်ပါ။ Monitor ကို schedule တစ်ခုနဲ့ run စေချင်လား — ဒါမှမဟုတ် Postman CLI က trigger လုပ်တဲ့အခါမှပဲ run စေချင်လားဆိုတာကိုလည်း ရွေးချယ်နိုင်ပါတယ်။ Test တစ်ခု fail ဖြစ်တာ၊ error ကြုံရတာ ဒါမှမဟုတ် timeout ဖြစ်တာတွေ ရှိရင် သင့်ကို အသိပေးပြီး — ရလဒ်အားလုံးကို [monitor ရဲ့ results](/docs/postman/viewing-monitor-results) တွေထဲမှာ မှတ်တမ်းတင်ထားပါတယ်။

သင့် APIs တွေကို စမ်းသပ်ပြီး မှန်ကန်စွာ လုပ်ဆောင်နေကြောင်း သေချာစေဖို့ monitors တွေကို သုံးနိုင်တဲ့ နည်းလမ်းတချို့က အောက်ပါအတိုင်းပါ။

Monitors တွေ လက်တွေ့မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ ဥပမာတွေအတွက် — [Postman API Monitoring Examples public workspace](https://www.postman.com/postman/postman-api-monitoring-examples/overview) ကို သွားကြည့်ပြီး — အသုံးများတဲ့ monitoring use cases တချို့အတွက် ဥပမာ collections တွေကို ရှာဖွေနိုင်ပါတယ်။ ကိုယ်ပိုင် workspace ထဲမှာ ပူးပေါင်း လုပ်ဆောင်ဖို့ [collection ကို fork လုပ်နိုင်ပါတယ်](/docs/postman/forking-elements)။

## API endpoint တစ်ခုကို စောင့်ကြည့်ခြင်း

API endpoint တစ်ခုကို စောင့်ကြည့်ဖို့ — အဲဒီ endpoint အတွက် request တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ requests တွေ ပါဝင်တဲ့ collection တစ်ခုကို — responses တွေကို validate လုပ်ဖို့ tests တွေနဲ့အတူ — ဖန်တီးပါ။ Query parameters, headers ဒါမှမဟုတ် request bodies လိုမျိုး — request ရဲ့ ပုံစံကွဲတွေ အမျိုးမျိုး ထည့်နိုင်ပါတယ်။ ဒါက — endpoint က အခြေအနေ အမျိုးမျိုးအောက်မှာ ဘယ်လို ပြုမူလဲဆိုတာ အတည်ပြုနိုင်စေပါတယ်။

Monitors တွေက collection နဲ့ သင့် tests တွေကို run လုပ်ပြီး — endpoint က အချိန်ကြာလာတာနဲ့အမျှ မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေကြောင်း သေချာစေဖို့ ကူညီပေးပါတယ်။ Tests တွေ ရေးသားခြင်းအကြောင်း ပိုလေ့လာဖို့ — [Postman မှာ API response data တွေကို စမ်းသပ်ဖို့ scripts ရေးသားခြင်း](/docs/postman/testing) ကို ကြည့်ပါ။

## API တစ်ခုလုံးကို စောင့်ကြည့်ခြင်း

API တစ်ခုလုံးကို စောင့်ကြည့်ဖို့ — အရေးကြီးတဲ့ endpoints တွေနဲ့ workflows တွေကို ကိုယ်စားပြုတဲ့ requests အများကြီး ပါဝင်တဲ့ collection တစ်ခုကို ဖန်တီးပါ။ Base URL လိုမျိုး မျှဝေသုံးတဲ့ တန်ဖိုးတွေကို စီမံခန့်ခွဲဖို့ environment variables တွေကို သုံးပါ။

ဒါ့အပြင် — လက်တွေ့ကမ္ဘာ့ အသုံးပြုမှုကို simulate လုပ်ဖို့ requests တွေကြားမှာ data တွေ ပေးပို့နိုင်ပါတယ်။ ဒါက — သင့် API ရဲ့ အစိတ်အပိုင်း အမျိုးမျိုး တစ်ခုနဲ့တစ်ခု ဘယ်လို ဆက်သွယ်လဲဆိုတာ validate လုပ်ပြီး — အရာအားလုံး မျှော်လင့်ထားတဲ့အတိုင်း အတူတကွ အလုပ်လုပ်ကြောင်း သေချာစေနိုင်ပါတယ်။

## API tests တွေ run လုပ်ခြင်း

ဆက်စပ်မှုရှိတဲ့ requests တွေနဲ့ APIs တွေကို test လုပ်တဲ့အခါ — response ရဲ့ တစ်စိတ်တစ်ပိုင်း ဒါမှမဟုတ် တစ်ခုလုံးကို variable တစ်ခုအနေနဲ့ သိမ်းပြီး — နောက် requests တွေထဲမှာ ပြန်သုံးနိုင်ပါတယ်။ IDs, tokens ဒါမှမဟုတ် တခြားတန်ဖိုးတွေလိုမျိုး data တွေကို requests တွေကြားမှာ ပေးပို့ဖို့ ဒါက အသုံးဝင်ပါတယ်။

Postman က variables တွေကို strings တွေအနေနဲ့ သိမ်းပါတယ်။ Objects ဒါမှမဟုတ် arrays လိုမျိုး ရှုပ်ထွေးတဲ့ data တွေနဲ့ အလုပ်လုပ်ဖို့ — မသိမ်းခင် `JSON.stringify()` ကို သုံးပြီး string တစ်ခုအဖြစ် ပြောင်းပြီး — နောက်ပိုင်း ဖတ်ဖို့ `JSON.parse()` ကို သုံးပါ။ သိမ်းပြီးတာနဲ့ — ဒီတန်ဖိုးကို နောက် requests တွေထဲမှာ — ဥပမာ request body ရဲ့ အစိတ်အပိုင်းအနေနဲ့ — ပြန်သုံးနိုင်ပါတယ်။

```js
// တန်ဖိုး သတ်မှတ်ခြင်း
pm.environment.set("data", JSON.stringify({ id: 123 }));

// တန်ဖိုး ရယူခြင်း
const data = JSON.parse(pm.environment.get("data"));
```

## HTTP response codes တွေကို စောင့်ကြည့်ခြင်း

သင့် post-response scripts တွေထဲမှာ HTTP response status codes တွေကို validate လုပ်နိုင်ပါတယ်။

```js
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

## Latency ကို စောင့်ကြည့်ခြင်း

Post-response scripts တွေထဲမှာ requests တွေ ပြီးမြောက်ဖို့ ဘယ်လောက်ကြာလဲဆိုတာကိုလည်း validate လုပ်နိုင်ပါတယ်။ Response times တွေ လက်ခံနိုင်တဲ့ ကန့်သတ်ချက်တစ်ခုအတွင်းမှာ ရှိနေကြောင်း သေချာစေဖို့ tests တွေ ထည့်ပါ:

```js
pm.test("Response time is acceptable", function () {
    // responseTime က milliseconds နဲ့ပါ
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```
