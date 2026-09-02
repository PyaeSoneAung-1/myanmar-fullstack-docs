---
title: "API များကို Automated Tests ဖြင့် စမ်းသပ်ခြင်း (Testing)"
description: "pm.test နဲ့ pm.response သုံးပြီး post-response scripts များဖြင့် API test ရေးနည်း — status code, response body, JSON data စစ်ဆေးခြင်း၊ tests run လုပ်ပြီး ရလဒ်ကြည့်ရှုခြင်း"
order: 10
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/"
status: translated
updated: 2026-09-02
---

Postman မှာ post-response scripts တွေကို သုံးပြီး — request တစ်ခု run ပြီးနောက် JavaScript code တွေ run လို့ရပါတယ်။ Request, collection ဒါမှမဟုတ် folder တစ်ခုရဲ့ **Scripts > Post-response** tab ထဲမှာ code တွေ ထည့်ပြီး — API tests တွေ ရေးနိုင်သလို tests တွေ မှန်မမှန်လည်း validate လုပ်နိုင်ပြီး debugging အတွက်လည်း သုံးနိုင်ပါတယ်။

## Postman မှာ testing ဆိုတာ

[API testing](https://www.postman.com/api-platform/api-testing/) မှာ အသုံးအများဆုံး နည်းလမ်းတွေကတော့ — contract testing, unit testing, end-to-end testing နဲ့ load testing တွေပါ။ Tests တွေက — API က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေလား၊ service တွေကြားက integration တွေ ယုံကြည်စိတ်ချရလား၊ အပြောင်းအလဲတွေကြောင့် ရှိပြီးသား လုပ်ဆောင်ချက်တွေ မပျက်စီးသွားဘူးလားဆိုတာ သေချာစေပါတယ်။ **Post-response** tab မှာ JavaScript နဲ့ ကိုယ်ပိုင် API tests တွေ ရေးလို့ရပြီး — ဥပမာ data အပြည့်အစုံ မပါတဲ့ request တွေ ပို့ပြီး API ရဲ့ error handling ကို စစ်တဲ့ test မျိုးနဲ့ debugging လုပ်တာမျိုးပါ။

**Pre-request** နဲ့ **Post-response** tabs နှစ်ခုလုံးက [Postman Sandbox](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) — Node.js ကို အခြေခံတဲ့ runtime — ကို သုံးပါတယ်။ **Scripts > Pre-request** tab က request မပို့ခင် လိုအပ်တဲ့ အလုပ်တွေ (variable တန်ဖိုးတွေ သတ်မှတ်တာမျိုး) လုပ်ဖို့ ဖြစ်ပြီး — **Scripts > Post-response** tab ကတော့ request ပို့ပြီးနောက် response data တွေကို အကဲဖြတ်တဲ့ tests တွေ ရေးဖို့ပါ။ ဒီ tab မှာ [Chai.js](https://www.chaijs.com/api/bdd/) library က built-in ပါတာကြောင့် — Chai ရဲ့ BDD (behavior-driven development) syntax နဲ့ ဖတ်ရလွယ်တဲ့ test assertions တွေ ရေးလို့ရပါတယ်။ Code editor ရဲ့ အောက်ဘက်ညာဘက်က **Snippets** icon ကနေ — variables ကနေ data ယူတာ, boilerplate tests တွေ, အသုံးများတဲ့ utility functions တွေ ပါဝင်တဲ့ test snippets တွေကို ရှာရွေးပြီး ထည့်လို့ရပါတယ်။ [Scripts သုံးခြင်း မိတ်ဆက်](/docs/postman/intro-to-scripts) မှာ အသေးစိတ် ကြည့်နိုင်ပါတယ်။

## Post-response test တစ်ခု ထည့်ခြင်း

Request, collection ဒါမှမဟုတ် folder တစ်ခုကို ဖွင့်ပြီး — **Scripts > Post-response** tab မှာ code ရိုက်ထည့်ရုံနဲ့ test တစ်ခု ထည့်ပြီးပါပြီ။ ကိုယ်ပိုင် JavaScript ရေးလို့ရသလို **Snippets** ကနေ snippet တစ်ခု ရွေးလို့လည်း ရပါတယ်။ Post-response scripts တွေက dynamic variables တွေ သုံးလို့ရပြီး — response data အပေါ်မှာ test assertions တွေ လုပ်နိုင်ကာ requests တွေကြားမှာ data တွေကိုလည်း ပို့ဆောင်ပေးနိုင်ပါတယ်။ Tests တွေက request ပို့ပြီး API ကနေ response ရတဲ့အခါ run ဖြစ်ပြီး — ရလဒ်တွေက response ရဲ့ **Test Results** tab ထဲမှာ ပေါ်ပါတယ်။ Script တွေထဲမှာ test ဘယ်နှစ်ခုပဲ ဖြစ်ဖြစ် ထည့်လို့ရပြီး — **Save** icon နှိပ်လိုက်ရင် request details တွေနဲ့အတူ သိမ်းပါတယ်။ Collection ကို share လုပ်တာ, documentation publish လုပ်တာ ဒါမှမဟုတ် **Run in Postman** button သုံးတဲ့အခါ — collection ကို ကြည့်သူ/import လုပ်သူတွေအတွက် test code တွေပါ ပါဝင်သွားပါတယ်။

## Response ကို validate လုပ်ခြင်း (pm.test နဲ့ pm.response)

Tests တွေကို `pm.test` function နဲ့ သတ်မှတ်ပြီး — test နာမည် (text string) တစ်ခုနဲ့ boolean (`true` ဒါမှမဟုတ် `false`) တန်ဖိုး ပြန်ပေးတဲ့ function တစ်ခု ထည့်ပေးရပါတယ်။ Response data တွေကို validate လုပ်ဖို့ `pm.response` object ကို သုံးပြီး — assertions တွေမှာ Chai.js BDD syntax နဲ့ `pm.expect` ကို သုံးနိုင်ပါတယ်။ `.test` function ရဲ့ ပထမ parameter က test result output မှာ ပြသမယ့် စာသားဖြစ်ပြီး — tests တွေကို ခွဲခြားသိဖို့နဲ့ ရလဒ်ကြည့်ရှုသူတွေကို test ရဲ့ ရည်ရွယ်ချက် နားလည်စေဖို့ သုံးပါတယ်။

ဥပမာ — response ရဲ့ status code က `200` ဟုတ်မဟုတ် စစ်ဆေးဖို့ request ရဲ့ **Post-response** tab မှာ အောက်ပါအတိုင်း ရေးပါ:

```js
pm.test("Status test", function () {
    pm.response.to.have.status(200);
});
```

**Send** ကို နှိပ်ပြီး request run လိုက်ရင် — response ထဲက **Test Results** tab ကို ရွေးကြည့်ပါ။ Tab header မှာ test ဘယ်နှစ်ခု pass ဖြစ်ပြီး စုစုပေါင်း ဘယ်နှစ်ခု run လဲဆိုတာ ပြပါတယ်။ **Filter Results** dropdown ကနေ **Passed**, **Skipped**, **Failed** ဆိုပြီး test results တွေကို type အလိုက်လည်း ကြည့်လို့ရပါတယ်။ Response က `200` ပြန်လာရင် test က pass ဖြစ်ပြီး — မတူတဲ့ status code တစ်ခုနဲ့ ဆိုရင် ဘာဖြစ်လဲ ကြည့်ချင်ရင် script ထဲက မျှော်လင့်ထားတဲ့ status code ကို ပြောင်းပြီး request ကို ပြန် run ပါ။

`pm.expect` syntax ကို သုံးရင် test result messages တွေရဲ့ ပုံစံက ကွဲပြားပါတယ်။ ဥပမာ — request ရဲ့ [environment](/docs/postman/managing-environments) ကို စစ်ဆေးတဲ့ test:

```js
pm.test("environment to be production", function () {
    pm.expect(pm.environment.get("env")).to.equal("production");
});
```

Response body ထဲမှာ စာသားတစ်ခု ပါမပါ စစ်ချင်ရင် — `pm.response.text()` ကို သုံးနိုင်ပြီး၊ JSON data တွေကိုတော့ `pm.response.json()` နဲ့ ယူပြီး field တန်ဖိုးတွေကို assert လုပ်နိုင်ပါတယ်:

```js
pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include("string_you_want_to_search");
});
```

ဖတ်ရလွယ်ပြီး ကိုယ့် testing logic နဲ့ လိုက်ဖက်အောင် syntax ပုံစံအမျိုးမျိုးလည်း သုံးလို့ရပါတယ်:

```js
pm.test("response should be okay to process", function () {
    pm.response.to.not.be.error;
    pm.response.to.have.jsonBody("");
    pm.response.to.not.have.jsonBody("error");
});
```

```js
pm.test("response must be valid and have a body", function () {
     pm.response.to.be.ok;
     pm.response.to.be.withBody;
     pm.response.to.be.json;
});
```

ဒီနမူနာတွေအပြင် တခြား response data ပုံစံအမျိုးမျိုးအတွက် — [post-response script examples](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples/) မှာ ကြည့်နိုင်ပါတယ်။

## Collections နဲ့ folders တွေကို test လုပ်ခြင်း

Collection တစ်ခုနဲ့ ဆက်စပ်ထားတဲ့ post-response script က collection ထဲက request တိုင်း ပြီးနောက် run ပြီး — folder တစ်ခုနဲ့ ဆက်စပ်ထားတဲ့ script က folder ထဲက direct child request တိုင်း ပြီးနောက် run ပါတယ်။ Request တစ်ခုအတွက် run order ကတော့ — collection tests, folder tests, ပြီးမှ request tests ဆိုတဲ့ အစဉ်အတိုင်းပါ။ ဒါကြောင့် အသုံးများတဲ့ tests တွေကို request တစ်ခုချင်းစီမှာ ထပ်ခါထပ်ခါ မရေးဘဲ — collection/folder အဆင့်မှာ တစ်ခါတည်း ထည့်ပြီး ပြန်သုံးနိုင်ပါတယ်။ Sidebar ထဲက collection ဒါမှမဟုတ် folder ကို ရွေးပြီး **Scripts > Post-response** tab ကနေ ထည့်/ပြင်လို့ရပါတယ်။ အသုံးများတဲ့ scripts နဲ့ tests တွေကို တစ်နေရာတည်းမှာ ထိန်းသိမ်း၊ team နဲ့ share လုပ်ပြီး internal workspaces တွေမှာ ပြန်သုံးချင်ရင်တော့ — [Package Library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) ကို သုံးနိုင်ပါတယ်။

[Collection တစ်ခုကို run](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/) တဲ့အခါ — collection runner က test အားလုံးရဲ့ ရလဒ်တွေကို ပြပါတယ်။ Test results တွေထဲမှာ response time (millisecond) နဲ့ collection ထဲက request တစ်ခုချင်းစီရဲ့ tests တွေ pass ဒါမှမဟုတ် fail ဖြစ်လားဆိုတဲ့ အသေးစိတ်တွေ ပါဝင်ပါတယ်။ Requests တွေ run မယ့် အစဉ်ကို ကိုယ်တိုင် ထိန်းချုပ်ချင်ရင် — [branching နဲ့ looping သုံးပြီး workflows တည်ဆောက်ခြင်း](/docs/postman/building-workflows) ကို ကြည့်ပါ။

## Request ကို ပြန်မပို့ဘဲ tests တွေကို ပြန် run ခြင်း

Tests တွေ develop ဒါမှမဟုတ် debug လုပ်နေချိန်မှာ — request ကို နောက်တစ်ကြိမ် မပို့ဘဲ အရင်ရထားတဲ့ response အပေါ်မှာ post-response scripts တွေကို ပြန် run လို့ရပါတယ်။ Server ပေါ်မှာ data တွေ ပြောင်းလဲစေတဲ့ POST, PUT, DELETE လိုမျိုး requests တွေအတွက် အထူးအသုံးဝင်ပါတယ် — test fail ဖြစ်ရတဲ့ အကြောင်းရင်းက API ကြောင့် မဟုတ်ဘဲ script ထဲက အမှားကြောင့်ဆိုရင် ရထားပြီးသား response နဲ့တင် ပြန်ပြင်လို့ရလို့ပါ။

1. Request ကို run ပြီး response ရယူပါ။ Post-response scripts တွေရဲ့ ရလဒ်တွေက **Test Results** tab မှာ ပေါ်ပါတယ်။
2. **Scripts > Post-response** tab မှာ tests တွေကို ပြင်ဆင်ပါ။
3. **Test Results** tab ထဲမှာ response pane ရဲ့ ညာဘက်အပေါ်က **Refresh results** icon ကို နှိပ်ပါ။

ဒါဆိုရင် Postman က ရထားပြီးသား response အပေါ်မှာ post-response scripts တွေကို ပြန် run ပြီး **Test Results** tab ကို update လုပ်ပါတယ်။ Request ကို ပြန်မပို့တာကြောင့် — မူလ request က server ပေါ်မှာ လုပ်ခဲ့တဲ့ အပြောင်းအလဲတွေ ထပ်မဖြစ်တော့ပါဘူး။

## Tests တွေကို debug လုပ်ခြင်း

* Error ဖြစ်နိုင်ခြေရှိတဲ့ script တွေကို အနီရောင် underline နဲ့ ပြပါတယ် — error အပေါ် hover လုပ်ပြီး **View Problem** ကို ရွေးရင် အကူအညီ ရပါတယ်။
* [Log statements](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) တွေ သုံးပြီး — ကိုယ် assert လုပ်နေတဲ့ data ပေါ်မှာ မှန်ကန်စွာ စစ်ဆေးနေကြောင်း သေချာစေနိုင်ပါတယ်။

## နောက်ထပ်အဆင့်များ

* `pm` object နဲ့ လုပ်လို့ရတဲ့ အရာတွေအကြောင်း — [post-response script examples](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples/) နဲ့ [Postman Sandbox API reference](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) တွေမှာ ကြည့်နိုင်ပါတယ်။
* Tests တွေကို [Postman Monitors](https://learning.postman.com/docs/monitoring-your-api/intro-monitors/) နဲ့ တွဲသုံးပြီး API ရဲ့ health နဲ့ performance ကို စောင့်ကြည့်နိုင်သလို — [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) နဲ့ CI/CD configuration ထဲမှာလည်း အလိုအလျောက် run နိုင်ပါတယ်။
