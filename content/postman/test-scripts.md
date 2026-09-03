---
title: "Postman မှာ API response data တွေကို test လုပ်ဖို့ scripts တွေ ရေးခြင်း (Write scripts to test API response data in Postman)"
description: "Post-response scripts တွေနဲ့ API tests တွေ ဘယ်လို ရေးလဲ — requests/collections/folders တွေမှာ tests ထည့်ခြင်း၊ gRPC requests တွေမှာ tests ထည့်ခြင်း၊ responses တွေကို validate လုပ်ခြင်း၊ request ပြန်မပို့ဘဲ tests တွေကို ပြန် run ခြင်း၊ Agent Mode နဲ့ tests ရေးခြင်း၊ JSDoc နဲ့ documentation ထည့်ခြင်း၊ tests တွေကို debug လုပ်ခြင်း"
order: 122
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/"
status: translated
updated: 2026-09-03
---

Postman မှာ post-response scripts တွေကို သုံးပြီး — request တစ်ခု run ပြီးနောက်မှာ JavaScript တွေ run လုပ်နိုင်ပါတယ်။ Request, collection ဒါမှမဟုတ် folder တစ်ခုအတွက် **Scripts > Post-response** tab ထဲမှာ code တွေ ထည့်ခြင်းအားဖြင့် — API tests တွေကို ရေးပြီး validate လုပ်နိုင်ပါတယ်။ Post-response scripts တွေကို ကိုယ့် tests တွေကို debug လုပ်ဖို့အတွက်လည်း သုံးနိုင်ပါတယ်။

## Testing အကြောင်း (Testing in Postman)

[API testing](https://www.postman.com/api-platform/api-testing/) ရဲ့ အသုံးအများဆုံး နည်းလမ်းတွေထဲမှာ contract testing, unit testing, end-to-end testing နဲ့ load testing တွေ ပါဝင်ပါတယ်။ Tests တွေက ကိုယ့် API က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေလား၊ services တွေကြားက integrations တွေက စိတ်ချရတဲ့အနေနဲ့ function လုပ်နေလား၊ ပြီးတော့ အပြောင်းအလဲတွေက ရှိပြီးသား functionality တွေကို မချိုးဖျက်လိုက်ဘူးလားဆိုတာကို အတည်ပြုပေးပါတယ်။

ကိုယ့် Postman API requests တွေအတွက် tests တွေကို **Post-response** tab ထဲမှာ JavaScript နဲ့ ရေးနိုင်ပါတယ်။ API project မှာ တစ်ခုခု မှားသွားတဲ့အခါ — debugging လုပ်ငန်းစဉ်ကို အထောက်အကူပြုဖို့ test code တွေကိုလည်း သုံးနိုင်ပါတယ်။ ဥပမာ — data အပြည့်အစုံ မပါတဲ့ ဒါမှမဟုတ် parameters တွေ မှားနေတဲ့ request တစ်ခု ပို့ပြီး ကိုယ့် API ရဲ့ error handling ကို validate လုပ်တဲ့ test တစ်ခု ရေးနိုင်ပါတယ်။

**Pre-request** နဲ့ **Post-response** tabs တွေက Postman Sandbox ကို သုံးပါတယ် — ဒါက Node.js ကို အခြေခံတဲ့ runtime တစ်ခုဖြစ်ပြီး requests နဲ့ collections တွေမှာ dynamic behavior တွေ ထည့်နိုင်စေပါတယ်။

* **Scripts > Pre-request** tab က request မပို့ခင် လိုအပ်တဲ့ လုပ်ဆောင်ချက်တွေ လုပ်နိုင်စေပါတယ် — ဥပမာ variable values တွေ သတ်မှတ်ခြင်း။ ဒီနေရာက code တွေက request မပို့ခင် run ပါတယ်။ ပိုသိချင်ရင် — [Postman မှာ dynamic behavior တွေ ထည့်ဖို့ pre-request scripts တွေ ရေးခြင်း](/docs/postman/pre-request-scripts) ကို ကြည့်ပါ။

* **Scripts > Post-response** tab က request ပို့ပြီးနောက်ပိုင်း post-processing တွေအတွက် ဖြစ်ပြီး — response data တွေကို အကဲဖြတ်တဲ့ tests တွေ ရေးနိုင်စွမ်း ပါဝင်ပါတယ်။ **Post-response** tab မှာ [Chai.js](https://www.chaijs.com/api/bdd/) library ကို built-in အနေနဲ့ ပါဝင်တာကြောင့် — ဖတ်ရလွယ်တဲ့ test assertions တွေ ဖန်တီးဖို့ Chai ရဲ့ behavior-driven development (BDD) syntax ကို သုံးနိုင်ပါတယ်။

Code editor ရဲ့ အောက်ညာဘက်မှာ ![Code icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-code-stroke.svg#icon) **Snippets** ကို ရွေးပြီး — test snippets တွေရဲ့ စာရင်းကို ကြည့်နိုင်ပါတယ်။ အရင်ရေးပြီးသား code blocks တွေကို ထည့်ဖို့ snippets တွေကို ရှာပြီး ရွေးချယ်နိုင်ပါတယ်။ တချို့က variables တွေကနေ data တွေ ပြန်ယူဖို့ ကူညီပေးပြီး — တချို့က boilerplate tests တွေ ဖြစ်ကာ တချို့ကတော့ အသုံးများတဲ့ utility functions တွေကို လုပ်ဆောင်ပေးပါတယ်။ Postman ရဲ့ AI assistant Agent Mode ကို ခိုင်းပြီးလည်း tests တွေ ရေးစေနိုင်ပါတယ်။

## Post-response test တစ်ခု ထည့်ခြင်း (Add a post-response test)

Collection တစ်ခုထဲက [requests](/docs/postman/create-requests), [collections](/docs/postman/intro-to-collections) နဲ့ folders တွေမှာ tests တွေ ထည့်နိုင်ပါတယ်။ Postman မှာ code snippets တွေ ပါဝင်ပြီး — အဲဒါတွေကို ထည့်ပြီးမှ ကိုယ့် test logic နဲ့ ကိုက်ညီအောင် ပြောင်းလဲနိုင်ပါတယ်။

Test တစ်ခု ထည့်ဖို့ — request, collection ဒါမှမဟုတ် folder ကို ဖွင့်ပြီး **Scripts > Post-response** tab ထဲမှာ ကိုယ့် code ကို ရိုက်ထည့်ပါ။ ကိုယ်ပိုင် JavaScript တွေ ရေးနိုင်သလို — code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ ![Code icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-code-stroke.svg#icon) **Snippets** ကို ရွေးပြီး snippet တစ်ခုကိုလည်း ရွေးချယ်နိုင်ပါတယ်။ ကိုယ့် code ကို ပိုဖတ်ရလွယ်အောင် — code editor ရဲ့ အောက်ညာဘက်မှာ ![Pretty icon](https://assets.postman.com/postman-docs/aether-icons/action-pretty-stroke.svg#icon) **Beautify** ကို ရွေးနိုင်ပါတယ်။

Post-response scripts တွေက dynamic variables တွေကို သုံးနိုင်ပြီး — response data တွေပေါ်မှာ test assertions တွေ လုပ်ဆောင်ကာ requests တွေကြားမှာ data တွေကို ပို့ဆောင်နိုင်ပါတယ်။ Tests တွေက request run ပြီး API ကနေ response တစ်ခု ရရှိတဲ့အခါ run ပါတယ်။ ရလဒ်တွေက response ရဲ့ **Test Results** tab မှာ ပေါ်ပါတယ်။

Response တစ်ခု ရရှိပြီးနောက်မှာ — request ကို ပြန်မပို့ဘဲ အဲဒီ response ပေါ်မှာ ကိုယ့် post-response scripts တွေကို ပြန် run လုပ်နိုင်ပါတယ်။ ပိုမိုသိရှိရန် — request ပြန်မပို့ဘဲ tests တွေကို ပြန် run လုပ်ခြင်း section ကို ကြည့်ပါ။

ကိုယ့် scripts တွေမှာ လိုအပ်သလောက် tests အများကြီး ထည့်နိုင်ပြီး — ![Save icon](https://assets.postman.com/postman-docs/aether-icons/action-save-stroke.svg#icon) **Save** ကို ရွေးတဲ့အခါ request အသေးစိတ်တွေနဲ့အတူ သိမ်းဆည်းသွားပါလိမ့်မယ်။ Collection တစ်ခုကို share လုပ်တာ၊ documentation ကို publish လုပ်တာ ဒါမှမဟုတ် **Run in Postman** button ကို သုံးတာတွေ လုပ်ရင် — ကိုယ့် collection ကို ကြည့်သူ ဒါမှမဟုတ် import လုပ်သူတိုင်း အတွက် ကိုယ့် test code တွေ ပါဝင်သွားပါလိမ့်မယ်။

### gRPC request တစ်ခုမှာ test ထည့်ခြင်း (Add a test to a gRPC request)

gRPC request တစ်ခုမှာ tests တွေကို — invoke မလုပ်ခင်၊ client က message တစ်ခု လက်ခံရရှိတဲ့အခါ ဒါမှမဟုတ် response ပြီးနောက်မှာ ထည့်နိုင်ပါတယ်။ Method type (unary, client streaming, server streaming ဒါမှမဟုတ် bidirectional streaming) ဘာပဲ ဖြစ်ဖြစ် — gRPC requests တွေအားလုံးအတွက် hooks တွေ အားလုံး ရနိုင်ပါတယ်။

gRPC request တစ်ခုမှာ test တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ကိုယ့် gRPC request ထဲက **Scripts** tab ကို သွားပါ။
2. Test ထည့်ချင်တဲ့ hook (**Before invoke**, **On message** ဒါမှမဟုတ် **After response**) ကို ရွေးပါ။
3. Code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ ![Code icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-code-stroke.svg#icon) **Snippets** ကို ရွေးပြီး test တစ်ခု ထည့်ပါ။ ကိုယ်ပိုင် custom assertion တစ်ခုကိုလည်း ရေးနိုင်ပါတယ်။

**Before invoke** script က request တစ်ခုစီ မပို့ခင် run ပါတယ်။

**On message** script က incoming message အသစ်တစ်ခု ရောက်လာတဲ့အခါ run ပါတယ်။ Unary ဒါမှမဟုတ် client streaming သုံးနေရင် — server response ရရှိမှသာ run ပါတယ်။ Server ဒါမှမဟုတ် bidirectional streaming သုံးနေရင်တော့ — incoming message တစ်ခုစီ ပြီးနောက်မှာ run ပါတယ်။

**After response** script က request ပြီးဆုံးတဲ့အခါ run ပါတယ် — request ပိတ်သွားတာ၊ အောင်မြင်စွာ ပြီးဆုံးတာ ဒါမှမဟုတ် cancel လုပ်ခံရတာ စတဲ့ အခြေအနေတွေ ပါဝင်ပါတယ်။

**Before invoke** script ထဲမှာ error တွေ ရှိနေရင် — request က ရပ်သွားပါလိမ့်မယ်။

## Request ပြန်မပို့ဘဲ tests တွေကို ပြန် run လုပ်ခြင်း (Rerun tests without resending the request)

ကိုယ့် tests တွေကို develop ဒါမှမဟုတ် debug လုပ်နေတဲ့အခါ — request ကို ပြန်မပို့ဘဲ နောက်ဆုံးရထားတဲ့ response ပေါ်မှာ ကိုယ့် post-response scripts တွေကို ပြန် run နိုင်ပါတယ်။ POST, PUT ဒါမှမဟုတ် DELETE လိုမျိုး server ပေါ်က data တွေကို ပြောင်းလဲစေတဲ့ requests တွေအတွက် ဒါက အသုံးဝင်ပါတယ်။ API ပြဿနာကြောင့်မဟုတ်ဘဲ — script ထဲက အမှားတစ်ခုကြောင့် test တစ်ခု fail ဖြစ်တဲ့အခါ ပြင်ဖို့ လိုတာက ရပြီးသား response ပဲ ဖြစ်ပါတယ်။ Server ပေါ်မှာ အပြောင်းအလဲကို ထပ်မလုပ်ရဘဲ — ကိုယ့် test logic ကို ပြင်ပြီး အဲဒီ response ပေါ်မှာ ကိုယ့် assertions တွေကို ပြန်စစ်နိုင်ပါတယ်။

နောက်ဆုံး response ပေါ်မှာ ကိုယ့် tests တွေကို ပြန် run ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Response တစ်ခု ရဖို့ request ကို ပို့ပါ။ ကိုယ့် post-response scripts တွေရဲ့ ရလဒ်တွေက response ရဲ့ **Test Results** tab မှာ ပေါ်ပါတယ်။
2. **Scripts > Post-response** tab ထဲမှာ ကိုယ့် tests တွေကို တည်းဖြတ်ပါ။
3. **Test Results** tab ထဲမှာ — response pane ရဲ့ အပေါ်ညာဘက်က ![Refresh icon](https://assets.postman.com/postman-docs/aether-icons/action-refresh-stroke.svg#icon) **Refresh results** ကို နှိပ်ပါ။

Postman က ရှိပြီးသား response ပေါ်မှာ ကိုယ့် post-response scripts တွေကို ပြန် run ပြီး **Test Results** tab ကို update လုပ်ပါတယ်။ Request ကို ပြန်မပို့တာကြောင့် — မူလ request က server ပေါ်မှာ လုပ်ခဲ့တဲ့ အပြောင်းအလဲတွေ ဘယ်တော့မှ ထပ်ဖြစ်မှာ မဟုတ်ပါဘူး။

## Responses တွေကို validate လုပ်ခြင်း (Validate responses)

Request တစ်ခုက ပြန်ပို့တဲ့ data တွေကို validate လုပ်ဖို့ — test တစ်ခုထဲမှာ `pm.response` object ကို သုံးနိုင်ပါတယ်။ Tests တွေကို `pm.test` function သုံးပြီး သတ်မှတ်ပါ။ Test က အောင်လား ကျလား (passed ဒါမှမဟုတ် failed) ဖော်ပြဖို့ boolean (`true` ဒါမှမဟုတ် `false`) တန်ဖိုး ပြန်ပေးတဲ့ နာမည်တစ်ခုနဲ့ function တစ်ခုကို ပေးပါ။ Response အသေးစိတ်တွေကို test လုပ်ဖို့ — ကိုယ့် assertions တွေထဲမှာ Chai.js BDD syntax နဲ့ `pm.expect` ကို သုံးပါ။

`.test` function ရဲ့ ပထမ parameter က test result output ထဲမှာ ပေါ်တဲ့ စာသား string တစ်ခု ဖြစ်ပါတယ်။ ဒါကို ကိုယ့် tests တွေကို ခွဲခြားသိဖို့နဲ့ — ရလဒ်တွေကို ကြည့်သူတိုင်းကို test တစ်ခုရဲ့ ရည်ရွယ်ချက် နားလည်စေဖို့ သုံးပါ။

ဥပမာ — request တစ်ခုရဲ့ response status code က `200` ဟုတ်မဟုတ် test လုပ်ဖို့ **Post-response** tab ထဲမှာ အောက်ပါအတိုင်း ရိုက်ထည့်ပါ:

```js
pm.test("Status test", function () {
    pm.response.to.have.status(200);
});
```

**Send** ကို ရွေးပြီး ကိုယ့် request ကို run ကာ — response ထဲက **Test Results** tab ကို ရွေးပါ။ Tab header မှာ tests ဘယ်နှစ်ခု passed ဖြစ်လဲ၊ စုစုပေါင်း ဘယ်နှစ်ခု run ခဲ့လဲ ပြသပါတယ်။ Test results တွေကို အမျိုးအစားအလိုက် (**Passed**, **Skipped** နဲ့ **Failed**) ကြည့်ဖို့ **Filter Results** dropdown list ကိုလည်း ရွေးနိုင်ပါတယ်။

Request က `200` status code တစ်ခု ပြန်ပို့ခဲ့ရင် — test က အောင်ပါတယ်။ တခြား status code တစ်ခုနဲ့ ဆို ဘာဖြစ်မလဲ ကြည့်ဖို့ — ကိုယ့် post-response script ထဲက မျှော်လင့်ထားတဲ့ status code ကို ပြောင်းပြီး request ကို ပြန် run ပါ။

## pm.expect ကို သုံးပြီး test result messages တွေ ဖော်မက်လုပ်ခြင်း (Format test result messages using pm.expect)

`pm.expect` syntax ကို သုံးခြင်းက ကိုယ့် test result messages တွေကို ဖော်မက်တစ်မျိုး ပြောင်းပေးပါတယ်။ ကိုယ့်အတွက် အသုံးအဝင်ဆုံး output ရအောင် options တွေနဲ့ စမ်းသပ်ကြည့်ပါ။

[Intro to writing tests collection](https://www.postman.com/postman/postman-team-collections/collection/9fqcfpk/intro-to-writing-tests-with-examples?action=share\&creator=16724969) ကို fork လုပ်ပြီး — ဥပမာ post-response scripts တချို့ ပါဝင်တဲ့ templates တွေကို Postman ထဲ import လုပ်ကာ code တွေနဲ့ စမ်းသပ်ကြည့်ပါ။

ကိုယ့် code က request ရဲ့ [environment](/docs/postman/managing-environments) ကိုလည်း test လုပ်နိုင်ပါတယ် — အောက်ပါ ဥပမာမှာ ပြထားပါတယ်:

```js
pm.test("environment to be production", function () {
    pm.expect(pm.environment.get("env")).to.equal("production");
});
```

ကိုယ့်အတွက် ဖတ်ရလွယ်ပြီး ကိုယ့် application နဲ့ testing logic နဲ့ ကိုက်ညီတဲ့ ပုံစံမျိုးနဲ့ tests တွေ ရေးဖို့ syntax အမျိုးမျိုးကို သုံးနိုင်ပါတယ်။ ဥပမာ:

```js
pm.test("response should be okay to process", function () {
    pm.response.to.not.be.error;
    pm.response.to.have.jsonBody("");
    pm.response.to.not.have.jsonBody("error");
});
```

ကိုယ့် tests တွေက response data ဖော်မက်နဲ့ ကိုက်ညီအောင် ချိန်ညှိထားတဲ့ syntax သုံးပြီး — request responses တွေကို validate လုပ်နိုင်ပါတယ်။ ဥပမာ:

```js
pm.test("response must be valid and have a body", function () {
     pm.response.to.be.ok;
     pm.response.to.be.withBody;
     pm.response.to.be.json;
});
```

## Collections နဲ့ folders တွေကို test လုပ်ခြင်း (Test collections and folders)

Collection တစ်ခု၊ folder တစ်ခု ဒါမှမဟုတ် collection ထဲက request တစ်ခုတည်းကိုပါ post-response scripts တွေ ထည့်နိုင်ပါတယ်။ Collection တစ်ခုနဲ့ ဆက်စပ်တဲ့ post-response script က — collection ထဲက request တိုင်း ပြီးနောက်မှာ run ပါတယ်။ Folder တစ်ခုနဲ့ ဆက်စပ်တဲ့ post-response script က — folder ထဲက direct child request တိုင်း ပြီးနောက်မှာ run ပါတယ်။ ဒါက requests တွေပြီးနောက်မှာ အသုံးများတဲ့ tests တွေကို ပြန်သုံးနိုင်စေပါတယ်။ Request တစ်ခုစီအတွက် run order ကတော့ — collection tests, folder tests ပြီးမှ request tests ဆိုတဲ့ အစဉ်အတိုင်း ဖြစ်ပါတယ်။

Post-response scripts တွေကို [Postman Package Library](/docs/postman/package-library) ထဲမှာလည်း သိမ်းဆည်းနိုင်ပါတယ်။ ဒါက အသုံးများတဲ့ scripts နဲ့ tests တွေကို တစ်နေရာတည်းမှာ ထိန်းသိမ်းပြီး — ကိုယ့် team နဲ့ မျှဝေကာ internal workspaces တွေမှာ ပြန်သုံးနိုင်စေပါတယ်။

Collections နဲ့ folders တွေထဲကို scripts တွေ ထည့်ခြင်းက — ကိုယ့် API project ထဲက workflows တွေကို test လုပ်နိုင်စေပါတယ်။ ဒါက ကိုယ့် requests တွေက ပုံမှန် အခြေအနေတွေကို လွှမ်းခြုံနိုင်အောင် ကူညီပေးပြီး — application သုံးစွဲသူတွေအတွက် စိတ်ချရတဲ့ အတွေ့အကြုံတစ်ခု ဖြစ်စေပါတယ်။

Collection နဲ့ folder tests တွေ ထည့်ဖို့ ဒါမှမဟုတ် တည်းဖြတ်ဖို့ — sidebar ထဲက collection ဒါမှမဟုတ် folder တစ်ခုကို ရွေးပြီး **Scripts > Post-response** tab ကို ရွေးပါ။

[Collection တစ်ခုကို run လုပ်တဲ့အခါ](/docs/postman/intro-to-collection-runs) — collection runner က tests တွေအားလုံးရဲ့ ရလဒ်တွေကို ပြသပါတယ်။ Test results တွေထဲမှာ milliseconds နဲ့ တိုင်းတဲ့ response time နဲ့ — collection ထဲက request တစ်ခုရဲ့ tests တွေ passed လား failed လား ဆိုတဲ့ အသေးစိတ်တွေ ပါဝင်ပါတယ်။

ကိုယ့် requests တွေ run မယ့် order ကို [branching နဲ့ looping](/docs/postman/building-workflows) သုံးပြီး ထိန်းချုပ်တဲ့ scripts တွေလည်း ရေးနိုင်ပါတယ်။

## Agent Mode ကို သုံးပြီး tests တွေ ရေးခြင်း (Write tests using Agent Mode)

Postman ရဲ့ AI assistant [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview/) ကို သုံးပြီး ကိုယ့် requests တွေအတွက် tests တွေ ရေးနိုင်ပါတယ်။ သဘာဝကျတဲ့ စကားပြော (natural language) နဲ့ Agent Mode ကို ဘာလုပ်ရမယ်ဆိုတာ ပြောလိုက်ရုံပါပဲ — ၎င်းက ကိုယ့်အတွက် post-response scripts တွေ ထုတ်ပေးပါတယ်။ Tests အစုအသစ်တွေ ထည့်ဖို့၊ responses တွေကို visualize လုပ်ဖို့၊ response တစ်ခုကနေ field တစ်ခု သိမ်းဖို့ ဒါမှမဟုတ် ရှိပြီးသား tests တွေကို ပြင်ဖို့ Agent Mode ကို သုံးပါ။

Agent Mode နဲ့ tests တွေ ရေးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုကို ဖွင့်ပြီး response တစ်ခု ရှိအောင် **Send** ကို ရွေးပါ။
2. **Scripts > Post response** tab ကို ရွေးပါ။
3. Right sidebar ထဲမှာ ![Ask Ai Chat icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-ask-ai-chat.svg#icon) **Agent Mode** ကို ရွေးပါ။
4. Agent Mode ကို ဘာလုပ်ချင်လဲ ပြောပြပြီး **Enter** ကို နှိပ်ပါ။

## Post-response scripts တွေကို documentation ထည့်ခြင်း (Add documentation to post-response scripts)

Postman က ကိုယ့် post-response scripts တွေထဲက JavaScript functions တွေကို document လုပ်ဖို့ JSDoc ကို ပံ့ပိုးပါတယ်။ JSDoc သုံးပြီး ကိုယ့် functions တွေဆီ ထည့်ထားတဲ့ documentation တွေက — function တွေကို ခေါ်တဲ့အခါ popup window တစ်ခုထဲမှာ ပေါ်ပါလိမ့်မယ်။ Post-response scripts တွေထဲကို documentation ဘယ်လို ထည့်လဲ လေ့လာဖို့ — တရားဝင် [JSDoc documentation](https://jsdoc.app/) ကို သုံးနိုင်ပါတယ်။

အောက်ပါ ဥပမာမှာ JSDoc သုံးပြီး `logger` function အတွက် documentation ပါပါတယ်။ Documentation က function က ဘာလုပ်သလဲ ရှင်းပြပြီး — `data` parameter ကို ဘာအတွက် သုံးလဲ၊ string data type တစ်ခုကို လက်ခံတယ်ဆိုတာ သတ်မှတ်ပါတယ်။

```js
/**
 * This function prints a string to the Postman Console.
 * @param {string} data - The text to print to the Postman Console.
 */
function logger (data) {
    console.log(`Logging information to the console, ${data}`)
}
```

## ကိုယ့် tests တွေကို debug လုပ်ခြင်း (Debug your tests)

ကိုယ့် tests တွေမှာ ပြဿနာ တစ်ခုခု ကြုံနေရရင် အောက်ပါအတိုင်း လုပ်ကြည့်ပါ:

* ကိုယ့် scripts တွေထဲမှာ error တွေ ရှိမရှိ စစ်ပါ။ ဖြစ်နိုင်တဲ့ error တွေကို အနီရောင် underline နဲ့ မျဉ်းသားပြပါလိမ့်မယ်။ Error ပေါ်မှာ hover လုပ်ပြီး **View Problem** ကို ရွေးရင် အကူအညီ ရပါတယ်။ တိကျတဲ့ errors တွေအတွက် response viewer ကိုလည်း စစ်ကြည့်နိုင်ပါတယ်။
* [log statements](/docs/postman/troubleshooting-api-requests) သုံးပြီး ကိုယ့် tests တွေကို debug လုပ်ပြီး — မှန်ကန်တဲ့ data တွေပေါ်မှာ assert လုပ်နေလားဆိုတာ သေချာအောင် လုပ်ပါ။

## နောက်ထပ် လုပ်ဆောင်ချက်များ (Next steps)

Postman မှာ ကိုယ့် ပထမဆုံး tests တွေ ရေးပြီးပြီဆိုရင် — ပိုရှုပ်ထွေးတဲ့ tests တွေ ရေးပြီး Postman ရဲ့ တခြား tools တွေနဲ့ တွဲသုံးနိုင်ပါတယ်။

* `pm` object နဲ့ ဘာတွေ လုပ်လို့ရလဲ ပိုသိချင်ရင် — post-response script [ဥပမာတွေ](/docs/postman/test-examples) ကို ကြည့်ပြီး [Postman Sandbox API reference](/docs/postman/sandbox-overview) ကို ဝင်ကြည့်ပါ။
* Postman Monitors တွေနဲ့ tests တွေကို ဘယ်လို သုံးပြီး ကိုယ့် API ရဲ့ ကျန်းမာရေးနဲ့ စွမ်းဆောင်ရည်ကို စစ်ဆေးလဲ သိချင်ရင် — [Postman မှာ ကိုယ့် APIs တွေရဲ့ ကျန်းမာရေးနဲ့ စွမ်းဆောင်ရည်ကို စောင့်ကြည့်ခြင်း](/docs/postman/intro-monitors) ကို သွားပါ။
* ကိုယ့် testing ကို [ဘယ်လို automate လုပ်မလဲ](https://www.postman.com/api-platform/api-test-automation/) သိချင်ရင် — [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) ကို သုံးပြီး collection runs တွေကို ကိုယ့် CI/CD configuration ထဲမှာ ပေါင်းစည်းလိုက်ပါ။
* အသုံးများတဲ့ scripts နဲ့ tests တွေကို သိမ်းဆည်းပြီး ပြန်သုံးခြင်း အကြောင်း ပိုသိချင်ရင် — Postman ထဲက [Package Library](/docs/postman/package-library) အကြောင်း လေ့လာပါ။
