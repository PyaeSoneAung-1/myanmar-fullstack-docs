---
title: "Postman မှာ သင့် API တွေကို regression ရှိမရှိ စမ်းသပ်ခြင်း (Test your APIs for regressions in Postman)"
description: "Regression testing ဆိုတာ ဘာလဲ — API ရဲ့ အရည်အသွေးနဲ့ performance ကို ထိန်းသိမ်းဖို့ regression tests တွေ ပြင်ဆင်သတ်မှတ်ခြင်းနဲ့ run လုပ်နည်း"
order: 132
source: "https://learning.postman.com/docs/tests-and-scripts/test-apis/regression-testing/"
status: translated
updated: 2026-09-03
---

*Regression testing* က သင့် API ရဲ့ အလုံးစုံ အရည်အသွေးနဲ့ performance ကို ထိန်းသိမ်းရာမှာ အရေးပါတဲ့ အခန်းကဏ္ဍကနေ ပါဝင်ပါတယ်။ Regression tests တွေက — update တွေ ဒါမှမဟုတ် အပြောင်းအလဲတွေ လုပ်ပြီးနောက်မှာလည်း — သင့် API က မျှော်လင့်ထားတဲ့အတိုင်း ဆက်လက် အလုပ်လုပ်နေကြောင်း သေချာစေပါတယ်။ ဒါ့အပြင် development လုပ်ငန်းစဉ်အတွင်း ဝင်လာတဲ့ bug အသစ်တွေ ဒါမှမဟုတ် ပြဿနာအသစ်တွေကိုလည်း ဖော်ထုတ်နိုင်ပြီး — သင့် changes တွေ နောက်ပြန် လိုက်ဖက်မှု (backwards compatible) ရှိမရှိကိုလည်း အတည်ပြုပေးပါတယ်။

## Regression testing အကြောင်း

Application တစ်ခုကို update လုပ်တဲ့အခါ ဒါမှမဟုတ် ပိုကောင်းအောင် မြှင့်တင်တဲ့အခါ — အဲဒီအပြောင်းအလဲတွေက ရှိပြီးသား လုပ်ဆောင်ချက်တွေကို ဆိုးကျိုး မသက်ရောက်ဘူးဆိုတာ အတည်ပြုဖို့ အရေးကြီးပါတယ်။ Regression testing မှာ — ပြောင်းလဲလိုက်တဲ့ component တွေက application ရဲ့ ကျန်အစိတ်အပိုင်းတွေနဲ့အတူ ကောင်းကောင်း အလုပ်လုပ်ပြီး — defect အသစ်တွေ မဖြစ်ပေါ်စေဘူးဆိုတာ သေချာစေဖို့ — tests တွေ ဆက်တိုက် run လုပ်ပါတယ်။ ဒီလို defect မျိုးကို *regressions* လို့ အများအားဖြင့် ခေါ်ပါတယ်။

API တစ်ခုအတွက်ဆိုရင် — regression testing ဆိုတာ API ကို ဒါမှမဟုတ် ၎င်းရဲ့ environment ကို ပြုလုပ်တဲ့ update တွေက — ၎င်းအပေါ် မှီခိုနေတဲ့ တခြား component တွေကို မထိခိုက်စေဘူးဆိုတာ အတည်ပြုခြင်းပါ။ Bug တစ်ခု ပြင်တာ ဒါမှမဟုတ် feature အသစ်တစ်ခု ထည့်တာလိုမျိုး — ဘယ်လို အပြောင်းအလဲမျိုးပြီးနောက်မဆို regression tests တွေကို run လို့ရပါတယ်။ ဒီ tests တွေက အောက်ပါ API element အမျိုးအစားတွေကို အကျုံးဝင်နိုင်ပါတယ်:

* **Status code** — request အမျိုးအစား အမျိုးမျိုးအတွက် API က မျှော်လင့်ထားတဲ့ status codes တွေ ပြန်ပို့လားဆိုတာ အတည်ပြုပါတယ်။
* **JSON schema** — response ရဲ့ တည်ဆောက်ပုံနဲ့ ပုံစံ (structure and format) က API definition နဲ့ ကိုက်ညီမှု ရှိမရှိ အတည်ပြုပါတယ်။
* **Response time** — API ရဲ့ response time က လက်ခံနိုင်တဲ့ ကန့်သတ်ချက်တွေအတွင်းမှာ ရှိမရှိ အတည်ပြုပါတယ်။
* **Response body** — response body ရဲ့ တည်ဆောက်ပုံနဲ့ အကြောင်းအရာ (content) တွေက မျှော်လင့်ချက်တွေနဲ့ ကိုက်ညီမှု ရှိမရှိ အတည်ပြုပါတယ်။
* **Headers** — response headers တွေ ပါဝင်မှု ရှိမရှိ၊ မှန်ကန်မှု ရှိမရှိ အတည်ပြုပါတယ်။

Postman CLI လိုမျိုး automation tools တွေကို သုံးပြီး — code updates တွေ မထုတ်ပြန်ခင် regression tests တွေကို run လုပ်နိုင်ပြီး — breaking changes တွေ production ထဲ မရောက်သွားအောင် သေချာစေနိုင်ပါတယ်။ ဒါ့အပြင် [Collection Runner](/docs/postman/run-tests-on-schedule) သုံးပြီး tests တွေကို schedule လုပ်ကာ — အချိန်ကြာလာတာနဲ့အမျှ test results တွေကို စောင့်ကြည့်ပြီး — သင့် API ရဲ့ ယုံကြည်စိတ်ချရမှုအကြောင်း ထိုးထွင်းသိမြင်မှုတွေ (insights) ရယူနိုင်ပါတယ်။

သင့် API အတွက် regression tests တွေကို Postman နဲ့ ဘယ်လို ပြင်ဆင်ပြီး run မလဲဆိုတဲ့ နမူနာကို ကြည့်ဖို့ — Postman ရဲ့ [Regression testing](https://www.postman.com/templates/collections/regression-testing/) template collection ကို သုံးကြည့်နိုင်ပါတယ်။

## Postman မှာ regression tests တွေ ပြင်ဆင်သတ်မှတ်ခြင်း

Postman မှာ သင့် application အတွက် regression tests တွေ ပြင်ဆင်သတ်မှတ်ဖို့ — အောက်ပါ framework ကို သုံးပါ:

* **Testing ရဲ့ အခြေခံ unit က API request တစ်ခုပါ။** Request တစ်ခုစီက API endpoint တစ်ခုကို ခေါ်ယူပြီး — လုပ်ဆောင်ချက် တစ်ခုချင်းစီကို စမ်းသပ်ပါတယ်။ လိုအပ်သလို request authorization ကို configure လုပ်နိုင်ပြီး — parameters, headers နဲ့ body data လိုမျိုး လိုအပ်တဲ့ test data တွေကိုလည်း ပို့နိုင်ပါတယ်။ [requests တွေ ဖန်တီးပြီး ပို့ခြင်း](/docs/postman/requests) အကြောင်း ပိုလေ့လာပါ။

* **Requests တွေမှာ test logic ထည့်ဖို့ scripts တွေ ရေးပါ။** Request တစ်ခုစီအတွက် — request ပို့တဲ့အခါ မျှော်လင့်ထားတဲ့ data ရလား စစ်ဆေးတဲ့ test scripts တွေ ရေးနိုင်ပါတယ်။ Response code, headers, body data စတာတွေကို test လုပ်ပြီး validate လုပ်နိုင်ပါတယ်။ [test scripts ရေးသားခြင်း](/docs/postman/intro-to-scripts) အကြောင်း ပိုလေ့လာပါ။

* **Collections တွေနဲ့ test suites တွေကို စုစည်းပါ။** Requests အများကြီးကို collection တစ်ခုထဲ သိမ်းပြီး — category တွေအလိုက် စုစည်းနိုင်ပါတယ်။ Collections တွေက — ကိုယ်ရွေးချယ်တဲ့ အစဉ်အတိုင်း test group တစ်ခုကို run ပြီး ပြန် run လုပ်နိုင်စေပါတယ်။ ဒါ့အပြင် — data files တွေ upload လုပ်ပြီး — run တစ်ကြိမ်ချင်းစီမှာ data အမျိုးမျိုး သုံးကာ tests တွေကို အကြိမ်ကြိမ် run လုပ်နိုင်ပါတယ်။ [collections တွေ ဖန်တီးခြင်း](https://learning.postman.com/docs/use/use-collections/overview/) အကြောင်း ပိုလေ့လာပါ။

* **ရှုပ်ထွေးတဲ့ workflows တွေ တည်ဆောက်ဖို့ scripts တွေကို သုံးပါ။** Scripts တွေနဲ့ — request တစ်ခုရဲ့ response data ကို လုပ်ဆောင်ပြီး — data flow ကို စမ်းသပ်ဖို့ နောက် request တစ်ခုရဲ့ input အဖြစ် သုံးနိုင်ပါတယ်။ Requests တွေရဲ့ အစဉ်ကို dynamically ထိန်းချုပ်ဖို့လည်း scripts တွေကို သုံးနိုင်ပါတယ်။ ဥပမာ — user account အသစ်တစ်ခု ဖန်တီးဖို့ request တစ်ခု ပို့ပြီး — account အသစ် ရပြီလားဆိုတာ စစ်ဆေးဖို့ နောက် request တစ်ခု ထပ်ပို့နိုင်ပါတယ်။ [scripts တွေနဲ့ data တွေကို လုပ်ဆောင်ပြီး workflows တည်ဆောက်ခြင်း](/docs/postman/sandbox-overview) အကြောင်း ပိုလေ့လာပါ။

* **သင့် tests တွေကို environment အမျိုးမျိုးမှာ run လုပ်ပါ။** Postman မှာ environments တွေက — requests တွေထဲမှာ သုံးလို့ရတဲ့ ဆက်စပ်နေတဲ့ variables အုပ်စုတွေပါ။ Environments တွေက — context အမျိုးမျိုးမှာ test suite တစ်ခုတည်းကို ပြန်သုံးနိုင်စေပါတယ်။ ဥပမာ — သင့် test နဲ့ production setups တွေက မတူညီတဲ့ URLs တွေ ဒါမှမဟုတ် configuration values တွေ လိုအပ်ရင် — Postman environments တွေကို သုံးပြီး သူတို့ကြားမှာ ပြောင်းနိုင်ပါတယ်။ [environments နဲ့ variables တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/variables-intro) အကြောင်း ပိုလေ့လာပါ။

* **Mock servers တွေနဲ့ တခြား system တွေကို simulate လုပ်ပါ။** အမှန်တကယ် resources တွေဆီ ချိတ်ဆက်စရာ မလိုဘဲ — သင့် application က တခြား APIs နဲ့ systems တွေနဲ့ ဘယ်လို ဆက်သွယ်လဲဆိုတာ စမ်းသပ်နိုင်ပါတယ်။ အဲဒီအစား — requests တွေကို လက်ခံပြီး responses တွေ ပြန်ပေးခြင်းအားဖြင့် — real API server တစ်ခုရဲ့ အပြုအမူကို simulate လုပ်တဲ့ mock server တစ်ခုကို Postman နဲ့ တည်ဆောက်နိုင်ပါတယ်။ [mock servers တွေ ပြင်ဆင်သတ်မှတ်ခြင်း](/docs/postman/mock-servers) အကြောင်း ပိုလေ့လာပါ။

## Postman မှာ regression tests တွေ run လုပ်ခြင်း

Postman မှာ သင့် regression tests တွေ ပြင်ဆင်သတ်မှတ်ပြီးတာနဲ့ — အောက်ပါ နည်းလမ်းတွေနဲ့ run လုပ်နိုင်ပါတယ်:

* **Tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း** — Test တစ်ခုတည်း run လုပ်ဖို့ — request တစ်ခုကို ဖွင့်ပြီး ပို့လိုက်ပါ။ Workbench ထဲမှာ test results တွေကို ကြည့်နိုင်ပါတယ်။ Test suite တစ်ခုလုံး run လုပ်ဖို့ဆိုရင် — [Collection Runner](/docs/postman/run-tests-manually) ကို သုံးပါ။ Collection run နေချိန်မှာ Postman က test results တွေကို real time မှာ ပြသပါတယ်။ [Postman မှာ API tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း](/docs/postman/run-tests-manually) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်ခြင်း** — [Collection Runner](/docs/postman/run-tests-on-schedule) ကို သုံးပြီး test suites တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်နိုင်ပါတယ်။ Tests တွေ fail ဖြစ်တဲ့အခါ အသိပေးချက်တွေ ရပြီး — Postman ထဲမှာ test results တွေကို ကြည့်နိုင်ပါတယ်။ [Postman မှာ API tests တွေကို schedule တစ်ခုနဲ့ run လုပ်ခြင်း](/docs/postman/run-tests-on-schedule) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို သင့် CI/CD pipeline ထဲမှာ run လုပ်ခြင်း** — Postman CLI ကို သုံးပြီး — ပုံမှန် application build process ရဲ့ အစိတ်အပိုင်းအနေနဲ့ tests တွေကို run လုပ်နိုင်ပါတယ်။ Code push တိုင်း သင့် test suites တွေကို run လုပ်ပြီး — Postman ထဲမှာ test reports တွေကို ကြည့်နိုင်ပါတယ်။ [Postman သုံးပြီး သင့် CI/CD pipeline ထဲမှာ API tests တွေ run လုပ်ခြင်း](/docs/postman/run-tests-with-ci-cd) မှာ ပိုလေ့လာပါ။
