---
title: "Postman မှာ API integrations နဲ့ data flow တွေကို စမ်းသပ်ခြင်း (Test API integrations and data flow in Postman)"
description: "Integration testing ဆိုတာ ဘာလဲ — Postman မှာ requests, collections, mock servers တွေ သုံးပြီး integration tests တွေ ပြင်ဆင်သတ်မှတ်ခြင်းနဲ့ run လုပ်နည်း"
order: 131
source: "https://learning.postman.com/docs/tests-and-scripts/test-apis/integration-testing/"
status: translated
updated: 2026-09-03
---

Application တစ်ခု ကြီးထွားလာတာနဲ့အမျှ — ၎င်းရဲ့ component တစ်ခုချင်းစီက တစ်ခုနဲ့တစ်ခု မျှော်လင့်ထားတဲ့အတိုင်း အတူတကွ အလုပ်လုပ်ကြောင်း သေချာစေဖို့ အရေးကြီးပါတယ်။ *Integration testing* က သင့် application ရဲ့ မတူညီတဲ့ အစိတ်အပိုင်းတွေ တစ်ခုနဲ့တစ်ခု လိုက်ဖက်ညီမှု ရှိမရှိ သေချာစေပါတယ်။ ဒါ့အပြင် — databases နဲ့ third-party services တွေလိုမျိုး တခြား system တွေနဲ့ — သင့် application ဘယ်လို အလုပ်လုပ်လဲဆိုတာကိုလည်း စမ်းသပ်ပေးပါတယ်။

## Integration testing အကြောင်း

Application တစ်ခုလုံးကို တစ်ပြိုင်နက် test လုပ်ဖို့ ကြိုးစားမယ့်အစား — integration testing က component တစ်ခုချင်းစီနဲ့ ၎င်းတို့ တစ်ခုနဲ့တစ်ခု ဘယ်လို ဆက်သွယ်လဲဆိုတာကို အာရုံစိုက်ပါတယ်။ ဒါက — သင့် application ထဲက ဆက်သွယ်မှု မလုပ်နိုင်တဲ့ အစိတ်အပိုင်းတွေ ဒါမှမဟုတ် — component တွေကြားမှာ data တွေ လိုအပ်သလို မစီးဆင်းတဲ့ နေရာတွေကို ရှာဖွေဖော်ထုတ်ဖို့ ပိုလွယ်ကူစေပါတယ်။

Postman မှာ requests နဲ့ collections တွေကို သုံးပြီး — သင့် application ရဲ့ APIs တွေ တစ်ခုနဲ့တစ်ခု ဘယ်လို အတူတကွ အလုပ်လုပ်လဲဆိုတာ စမ်းသပ်နိုင်ပါတယ်။ ရှုပ်ထွေးတဲ့ လုပ်ဆောင်ချက်တွေကို စမ်းသပ်ဖို့ API requests တွေကို ကြိုသတ်မှတ်ထားတဲ့ အစဉ်တစ်ခုနဲ့ ပို့နိုင်ပြီး — endpoints တွေဆီ ဝင်ထွက်နေတဲ့ data flow တွေကိုလည်း စောင့်ကြည့်နိုင်ပါတယ်။ ဒါ့အပြင် သင့် application က လိုအပ်သလို — တခြား system တွေ ဒါမှမဟုတ် services တွေနဲ့ ပေါင်းစည်းနိုင်ဖို့ — အဲဒီ system တွေဆီကိုလည်း API requests တွေ ပို့ပြီး စမ်းသပ်နိုင်ပါတယ်။

သင့် API အတွက် integration tests တွေကို Postman နဲ့ ဘယ်လို ပြင်ဆင်ပြီး run မလဲဆိုတဲ့ နမူနာကို ကြည့်ဖို့ — [Integration testing basics](https://www.postman.com/templates/collections/integration-testing-basics/) collection template ကို ကြည့်ပါ။

## Postman မှာ integration tests တွေ ပြင်ဆင်သတ်မှတ်ခြင်း

Postman မှာ သင့် application အတွက် integration tests တွေ ပြင်ဆင်သတ်မှတ်ဖို့ — အောက်ပါ framework ကို သုံးပါ:

* **Testing ရဲ့ အခြေခံ unit က API request တစ်ခုပါ။** Request တစ်ခုစီက API endpoint တစ်ခုကို ခေါ်ယူပြီး — လုပ်ဆောင်ချက် တစ်ခုချင်းစီကို စမ်းသပ်ပါတယ်။ လိုအပ်သလို request authorization ကို configure လုပ်နိုင်ပြီး — parameters, headers နဲ့ body data လိုမျိုး လိုအပ်တဲ့ test data တွေကိုလည်း ပို့နိုင်ပါတယ်။ [requests တွေ ဖန်တီးပြီး ပို့ခြင်း](/docs/postman/requests) အကြောင်း ပိုလေ့လာပါ။

* **Requests တွေမှာ test logic ထည့်ဖို့ scripts တွေ ရေးပါ။** Request တစ်ခုစီအတွက် — request ပို့တဲ့အခါ မျှော်လင့်ထားတဲ့ data ရလား စစ်ဆေးတဲ့ test scripts တွေ ရေးနိုင်ပါတယ်။ Response code, headers, body data စတာတွေကို test လုပ်ပြီး validate လုပ်နိုင်ပါတယ်။ [test scripts ရေးသားခြင်း](/docs/postman/intro-to-scripts) အကြောင်း ပိုလေ့လာပါ။

* **Collections တွေနဲ့ test suites တွေကို စုစည်းပါ။** Requests အများကြီးကို collection တစ်ခုထဲ သိမ်းပြီး — category တွေအလိုက် စုစည်းနိုင်ပါတယ်။ Collections တွေက — ကိုယ်ရွေးချယ်တဲ့ အစဉ်အတိုင်း test group တစ်ခုကို run ပြီး ပြန် run လုပ်နိုင်စေပါတယ်။ ဒါ့အပြင် — data files တွေ upload လုပ်ပြီး — run တစ်ကြိမ်ချင်းစီမှာ data အမျိုးမျိုး သုံးကာ tests တွေကို အကြိမ်ကြိမ် run လုပ်နိုင်ပါတယ်။ [collections တွေ ဖန်တီးခြင်း](https://learning.postman.com/docs/use/use-collections/overview/) အကြောင်း ပိုလေ့လာပါ။

* **ရှုပ်ထွေးတဲ့ workflows တွေ တည်ဆောက်ဖို့ scripts တွေကို သုံးပါ။** Scripts တွေနဲ့ — request တစ်ခုရဲ့ response data ကို လုပ်ဆောင်ပြီး — data flow ကို စမ်းသပ်ဖို့ နောက် request တစ်ခုရဲ့ input အဖြစ် သုံးနိုင်ပါတယ်။ Requests တွေရဲ့ အစဉ်ကို dynamically ထိန်းချုပ်ဖို့လည်း scripts တွေကို သုံးနိုင်ပါတယ်။ ဥပမာ — user account အသစ်တစ်ခု ဖန်တီးဖို့ request တစ်ခု ပို့ပြီး — account အသစ် ရပြီလားဆိုတာ စစ်ဆေးဖို့ နောက် request တစ်ခု ထပ်ပို့နိုင်ပါတယ်။ [Postman Sandbox API reference](/docs/postman/sandbox-overview) အကြောင်း ပိုလေ့လာပါ။

* **သင့် tests တွေကို environment အမျိုးမျိုးမှာ run လုပ်ပါ။** Postman မှာ environments တွေက — requests တွေထဲမှာ သုံးလို့ရတဲ့ ဆက်စပ်နေတဲ့ variables အုပ်စုတွေပါ။ Environments တွေက — context အမျိုးမျိုးမှာ test suite တစ်ခုတည်းကို ပြန်သုံးနိုင်စေပါတယ်။ ဥပမာ — သင့် test နဲ့ production setups တွေက မတူညီတဲ့ URLs တွေ ဒါမှမဟုတ် configuration values တွေ လိုအပ်ရင် — Postman environments တွေကို သုံးပြီး သူတို့ကြားမှာ ပြောင်းနိုင်ပါတယ်။ [environments နဲ့ variables တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/variables-intro) အကြောင်း ပိုလေ့လာပါ။

* **Mock servers တွေနဲ့ တခြား system တွေကို simulate လုပ်ပါ။** အမှန်တကယ် resources တွေဆီ ချိတ်ဆက်စရာ မလိုဘဲ — သင့် application က တခြား APIs နဲ့ systems တွေနဲ့ ဘယ်လို ဆက်သွယ်လဲဆိုတာ စမ်းသပ်နိုင်ပါတယ်။ အဲဒီအစား — requests တွေကို လက်ခံပြီး responses တွေ ပြန်ပေးခြင်းအားဖြင့် — real API server တစ်ခုရဲ့ အပြုအမူကို simulate လုပ်တဲ့ mock server တစ်ခုကို Postman နဲ့ တည်ဆောက်နိုင်ပါတယ်။ [mock servers တွေ ပြင်ဆင်သတ်မှတ်ခြင်း](/docs/postman/mock-servers) အကြောင်း ပိုလေ့လာပါ။

## Postman မှာ integration tests တွေ run လုပ်ခြင်း

Postman မှာ သင့် integration tests တွေ ပြင်ဆင်သတ်မှတ်ပြီးတာနဲ့ — အောက်ပါ နည်းလမ်းတွေနဲ့ run လုပ်နိုင်ပါတယ်:

* **Tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း** — Test တစ်ခုတည်း run လုပ်ဖို့ — request တစ်ခုကို ဖွင့်ပြီး ပို့လိုက်ပါ။ Workbench ထဲမှာ test results တွေကို ကြည့်နိုင်ပါတယ်။ Test suite တစ်ခုလုံး run လုပ်ဖို့ဆိုရင် — [Collection Runner](/docs/postman/run-tests-manually) ကို သုံးပါ။ Collection run နေချိန်မှာ Postman က test results တွေကို real time မှာ ပြသပါတယ်။ [Postman မှာ API tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း](/docs/postman/run-tests-manually) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်ခြင်း** — [Collection Runner](/docs/postman/run-tests-on-schedule) ကို သုံးပြီး test suites တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်နိုင်ပါတယ်။ Tests တွေ fail ဖြစ်တဲ့အခါ အသိပေးချက်တွေ ရပြီး — Postman ထဲမှာ test results တွေကို ကြည့်နိုင်ပါတယ်။ [Postman မှာ API tests တွေကို schedule တစ်ခုနဲ့ run လုပ်ခြင်း](/docs/postman/run-tests-on-schedule) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို သင့် CI/CD pipeline ထဲမှာ run လုပ်ခြင်း** — Postman CLI ကို သုံးပြီး — ပုံမှန် application build process ရဲ့ အစိတ်အပိုင်းအနေနဲ့ tests တွေကို run လုပ်နိုင်ပါတယ်။ Code push တိုင်း သင့် test suites တွေကို run လုပ်ပြီး — Postman ထဲမှာ test reports တွေကို ကြည့်နိုင်ပါတယ်။ [Postman သုံးပြီး သင့် CI/CD pipeline ထဲမှာ API tests တွေ run လုပ်ခြင်း](/docs/postman/run-tests-with-ci-cd) မှာ ပိုလေ့လာပါ။
