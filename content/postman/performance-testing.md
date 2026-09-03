---
title: "Postman မှာ သင့် API ရဲ့ performance ကို စမ်းသပ်ခြင်း (Test your API's performance in Postman)"
description: "Performance testing ဆိုတာ ဘာလဲ — virtual users တွေနဲ့ load အောက်မှာ API ရဲ့ performance ကို စမ်းသပ်ခြင်း — test setup framework နဲ့ Collection Runner သုံးပြီး run လုပ်နည်း"
order: 133
source: "https://learning.postman.com/docs/tests-and-scripts/test-apis/performance-testing/"
status: translated
updated: 2026-09-03
---

အသုံးပြုသူတွေ အောင်မြင်စေဖို့ဆိုရင် — သင့် APIs တွေက လိုအပ်တဲ့ လုပ်ဆောင်ချက်တွေကို ထောက်ပံ့ပေးရုံနဲ့ မလုံလောက်ပါဘူး။ သင့် APIs တွေက မျှော်လင့်ထားတဲ့ traffic ပမာဏကိုလည်း ကိုင်တွယ်နိုင်ဖို့ လိုပါတယ်။ *Performance testing* က user traffic တွေကို simulate လုပ်နိုင်စေတာကြောင့် — သင့် API က load အောက်မှာ ဘယ်လို ပြုမူလဲဆိုတာ စောင့်ကြည့်ပြီး — ပြဿနာတွေ ဒါမှမဟုတ် bottlenecks တွေကို ဖော်ထုတ်နိုင်ပါတယ်။

## Performance testing အကြောင်း

Performance testing မှာ virtual users တွေနဲ့ လက်တွေ့ကမ္ဘာ့ traffic ကို simulate လုပ်ပါတယ်။ Virtual users တွေက သင့် API ကို calls တွေ လုပ်တဲ့အခါ — load အောက်မှာ သင့် API က ဘယ်လို ပြုမူလဲဆိုတာ စောင့်ကြည့်နိုင်ပါတယ်။ ဒါက — အခြေအနေ အမျိုးမျိုးအောက်မှာ response time, throughput နဲ့ availability အတွက် မျှော်လင့်ချက်တွေကို သင့် API က ဘယ်လောက်ထိ ပြည့်မီလဲ ဆန်းစစ်နိုင်စေပါတယ်။

API performance testing က အောက်ပါတို့ကို လုပ်ဆောင်ဖို့ ကူညီပေးနိုင်ပါတယ်:

* **User traffic တွေကို simulate လုပ်ခြင်း** — သင့် API က မျှော်လင့်ထားတဲ့ traffic ကို ကိုင်တွယ်နိုင်မလား အတည်ပြုပြီး — load အပြောင်းအလဲတွေကို သင့် API က ဘယ်လို တုံ့ပြန်လဲ စစ်ဆေးပါတယ်။

* **Bottlenecks တွေကို ရှာဖွေခြင်း** — latency နဲ့ errors တွေလိုမျိုး ပြဿနာတွေကို ဖော်ထုတ်ပြီး — သင့် API က load အောက်မှာ scale ဖြစ်နိုင်ဖို့ သေချာစေပါတယ်။

* **User experience ကို ပိုကောင်းအောင် လုပ်ခြင်း** — ပိုကောင်းတဲ့ user experience တစ်ခု ဖန်တီးနိုင်ဖို့ — သင့် API ရဲ့ performance ကို optimize လုပ်ပါတယ်။

Postman မှာ — [Collection Runner](/docs/postman/intro-to-collection-runs) ကို သုံးပြီး သင့် API ရဲ့ performance ကို စမ်းသပ်နိုင်ပါတယ်။ Collection တစ်ခု ရွေးလိုက်ရင် — virtual users အားလုံးက collection ထဲက requests တွေကို parallel အနေနဲ့ loop လုပ်ပါတယ်။ Collection Runner ထဲမှာ — test ရဲ့ ကြာချိန် (duration) နဲ့ virtual users အရေအတွက်ကို သတ်မှတ်နိုင်ပါတယ်။ Virtual users အရေအတွက်က test တစ်လျှောက်လုံး ပုံသေ ဖြစ်နေမလား — ဒါမှမဟုတ် test အတွင်းမှာ အပေါ်အောက် တက်ဆင်း (ramp up and down) ဖြစ်နေမလားဆိုတာကိုလည်း ရွေးချယ်နိုင်ပါတယ်။

သင့် API အတွက် performance tests တွေကို Postman နဲ့ ဘယ်လို ပြင်ဆင်ပြီး run မလဲဆိုတဲ့ နမူနာကို ကြည့်ဖို့ — [Performance testing](https://www.postman.com/templates/collections/performance-testing/) collection template ကို ကြည့်ပါ။

## Postman မှာ performance tests တွေ ပြင်ဆင်သတ်မှတ်ခြင်း

Postman မှာ သင့် application ကို performance testing လုပ်ဖို့ အသင့်ပြင်ဆင်ရာမှာ — အောက်ပါ framework ကို သုံးပါ:

* **Testing ရဲ့ အခြေခံ unit က API request တစ်ခုပါ။** Request တစ်ခုစီက API endpoint တစ်ခုကို ခေါ်ယူပြီး — လုပ်ဆောင်ချက် တစ်ခုချင်းစီကို စမ်းသပ်ပါတယ်။ လိုအပ်သလို request authorization ကို configure လုပ်နိုင်ပြီး — parameters, headers နဲ့ body data လိုမျိုး လိုအပ်တဲ့ test data တွေကိုလည်း ပို့နိုင်ပါတယ်။ [requests တွေ ဖန်တီးပြီး ပို့ခြင်း](/docs/postman/requests) အကြောင်း ပိုလေ့လာပါ။

* **Requests တွေမှာ test logic ထည့်ဖို့ scripts တွေ ရေးပါ။** Request တစ်ခုစီအတွက် — request ပို့တဲ့အခါ မျှော်လင့်ထားတဲ့ data ရလား စစ်ဆေးတဲ့ test scripts တွေ ရေးနိုင်ပါတယ်။ Response code, headers, body data စတာတွေကို test လုပ်ပြီး validate လုပ်နိုင်ပါတယ်။ [test scripts ရေးသားခြင်း](/docs/postman/intro-to-scripts) အကြောင်း ပိုလေ့လာပါ။

* **Collections တွေနဲ့ test suites တွေကို စုစည်းပါ။** Requests အများကြီးကို collection တစ်ခုထဲ သိမ်းပြီး — category တွေအလိုက် စုစည်းနိုင်ပါတယ်။ Collections တွေက — ကိုယ်ရွေးချယ်တဲ့ အစဉ်အတိုင်း test group တစ်ခုကို run ပြီး ပြန် run လုပ်နိုင်စေပါတယ်။ ဒါ့အပြင် — data files တွေ upload လုပ်ပြီး — run တစ်ကြိမ်ချင်းစီမှာ data အမျိုးမျိုး သုံးကာ tests တွေကို အကြိမ်ကြိမ် run လုပ်နိုင်ပါတယ်။ [collections တွေ ဖန်တီးခြင်း](https://learning.postman.com/docs/use/use-collections/overview/) အကြောင်း ပိုလေ့လာပါ။

* **ရှုပ်ထွေးတဲ့ workflows တွေ တည်ဆောက်ဖို့ scripts တွေကို သုံးပါ။** Scripts တွေနဲ့ — request တစ်ခုရဲ့ response data ကို လုပ်ဆောင်ပြီး — data flow ကို စမ်းသပ်ဖို့ နောက် request တစ်ခုရဲ့ input အဖြစ် သုံးနိုင်ပါတယ်။ Requests တွေရဲ့ အစဉ်ကို dynamically ထိန်းချုပ်ဖို့လည်း scripts တွေကို သုံးနိုင်ပါတယ်။ ဥပမာ — user account အသစ်တစ်ခု ဖန်တီးဖို့ request တစ်ခု ပို့ပြီး — account အသစ် ရပြီလားဆိုတာ စစ်ဆေးဖို့ နောက် request တစ်ခု ထပ်ပို့နိုင်ပါတယ်။ [scripts တွေနဲ့ data တွေကို လုပ်ဆောင်ပြီး workflows တည်ဆောက်ခြင်း](/docs/postman/sandbox-overview) အကြောင်း ပိုလေ့လာပါ။

* **သင့် tests တွေကို environment အမျိုးမျိုးမှာ run လုပ်ပါ။** Postman မှာ environments တွေက — requests တွေထဲမှာ သုံးလို့ရတဲ့ ဆက်စပ်နေတဲ့ variables အုပ်စုတွေပါ။ Environments တွေက — context အမျိုးမျိုးမှာ test suite တစ်ခုတည်းကို ပြန်သုံးနိုင်စေပါတယ်။ ဥပမာ — သင့် test နဲ့ production setups တွေက မတူညီတဲ့ URLs တွေ ဒါမှမဟုတ် configuration values တွေ လိုအပ်ရင် — Postman environments တွေကို သုံးပြီး သူတို့ကြားမှာ ပြောင်းနိုင်ပါတယ်။ [environments နဲ့ variables တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/variables-intro) အကြောင်း ပိုလေ့လာပါ။

* **Mock servers တွေနဲ့ တခြား system တွေကို simulate လုပ်ပါ။** အမှန်တကယ် resources တွေဆီ ချိတ်ဆက်စရာ မလိုဘဲ — သင့် application က တခြား APIs နဲ့ systems တွေနဲ့ ဘယ်လို ဆက်သွယ်လဲဆိုတာ စမ်းသပ်နိုင်ပါတယ်။ အဲဒီအစား — requests တွေကို လက်ခံပြီး responses တွေ ပြန်ပေးခြင်းအားဖြင့် — real API server တစ်ခုရဲ့ အပြုအမူကို simulate လုပ်တဲ့ mock server တစ်ခုကို Postman နဲ့ တည်ဆောက်နိုင်ပါတယ်။ [mock servers တွေ ပြင်ဆင်သတ်မှတ်ခြင်း](/docs/postman/mock-servers) အကြောင်း ပိုလေ့လာပါ။

## Postman မှာ performance tests တွေ run လုပ်ခြင်း

အသင့်ဖြစ်ပြီဆိုရင် — Collection Runner ကို သုံးပြီး သင့် performance tests တွေကို Postman မှာ အောက်ပါအတိုင်း run လုပ်နိုင်ပါတယ်:

1. **Virtual users တွေအတွက် သုံးမယ့် collection ကို ပြင်ဆင်ပါ။** Collection ထဲက requests တွေက လက်တွေ့ကမ္ဘာ့ user actions တွေကို simulate လုပ်နိုင်ပါတယ်။ Performance test အတွင်းမှာ — virtual user တစ်ယောက်ချင်းစီက collection ထဲက requests တွေကို — တခြား virtual users တွေနဲ့ parallel အနေနဲ့ loop လုပ်ပါတယ်။ [collections တွေ ဖန်တီးခြင်း](https://learning.postman.com/docs/use/use-collections/overview/) အကြောင်း ပိုလေ့လာပါ။

2. **Performance test အတွက် settings တွေကို configure လုပ်ပါ။** Test ရဲ့ ကြာချိန်နဲ့ virtual users အရေအတွက်ကို သတ်မှတ်နိုင်ပါတယ်။ Load အခြေအနေ အမျိုးမျိုးကို simulate လုပ်ဖို့ profile တစ်ခုကိုလည်း ရွေးချယ်နိုင်ပြီး — virtual user တစ်ယောက်ချင်းစီအတွက် မတူညီတဲ့ data တွေ သုံးဖို့ data file တစ်ခုကိုလည်း upload လုပ်နိုင်ပါတယ်။ [Postman မှာ performance test တစ်ခု run လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/performance-testing/performance-test-configuration/) အကြောင်း ပိုလေ့လာပါ။

3. **Real-time performance metrics နဲ့ errors တွေကို ကြည့်ပါ။** Test run နေချိန်မှာ — throughput နဲ့ response time လိုမျိုး metrics တွေကို ကြည့်ရှုနိုင်ပါတယ်။ Test ပြီးဆုံးတာနဲ့ — error trends နဲ့ failed test assertion trends တွေကို ကြည့်ပြီး — ပြဿနာတွေကို debug လုပ်ဖို့ အသေးစိတ် အချက်အလက်တွေ ရယူနိုင်ပါတယ်။ [performance test metrics တွေကို ကြည့်ရှုခြင်း](https://learning.postman.com/docs/tests-and-scripts/performance-testing/performance-test-metrics/), [performance test errors တွေကို debug လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/performance-testing/performance-test-errors/) နဲ့ [failed test assertions တွေကို debug လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/performance-testing/test-assertions/overview) အကြောင်း ပိုလေ့လာပါ။
