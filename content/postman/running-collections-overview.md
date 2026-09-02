---
title: "Collection runs တွေနဲ့ API ကို စမ်းသပ်ခြင်း (Test Your API Functionality)"
description: "API တွေကို test ဖို့ collections တွေ ဘယ်လို run နိုင်မလဲ — manual collection runs, scheduled runs, Postman CLI, monitors, performance testing, webhooks စတဲ့ နည်းလမ်းတွေ ခြုံငုံကြည့်ခြင်း"
order: 42
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/running-collections-overview/"
status: translated
updated: 2026-09-02
---

Postman Collections တွေကို run လုပ်ပြီး ကိုယ့်ရဲ့ APIs တွေကို test လုပ်ပြီး interact လုပ်နိုင်ပါတယ်။ Postman မှာ collection တစ်ခုဆိုတာ — သိမ်းထားတဲ့ [requests](/docs/postman/quick-start) တစ်စု, [workflow](/docs/postman/building-workflows) တစ်ခု ဒါမှမဟုတ် [test suite](/docs/postman/testing) တစ်ခု ဖြစ်နိုင်ပါတယ်။ Collection တစ်ခုကို run လုပ်တဲ့အခါ — Postman က collection ထဲက requests တွေကို ကိုယ်ရွေးထားတဲ့ အစဉ်အတိုင်း ပို့ပေးပါတယ်။

Postman မှာ collections တွေကို အောက်ပါ နည်းလမ်းတွေနဲ့ run နိုင်ပါတယ်:

* **Manual collection runs** — [Collection Runner နဲ့ collections တွေကို manual အနေနဲ့ run](/docs/postman/intro-to-collection-runs) လုပ်နိုင်ပါတယ်။ Collection ကို ပုံမှန် schedule တစ်ခုနဲ့ run ဖို့ မလိုအပ်တဲ့အခါမျိုးမှာ ဒါက အသုံးဝင်ပါတယ်။

  ဒါ့အပြင် — APIs တွေ develop လုပ်နေတဲ့ application တစ်ခုတည်းထဲကနေ collections တွေကို manual အနေနဲ့ run ဖို့ [Postman VS Code extension](https://learning.postman.com/docs/reference/vs-code-extension/overview/) ကိုလည်း သုံးနိုင်ပါတယ်။

* **Scheduled collection runs** — Collections တွေကို အလိုအလျောက် run ဖို့ schedule လုပ်နိုင်ပါတယ်။ [Scheduled collection runs](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/) တွေက — တစ်ပတ်တစ်ခါ ဒါမှမဟုတ် တစ်လတစ်ခါလို ပုံမှန် schedule တွေနဲ့ ကိုယ့် API tests တွေကို automate လုပ်ဖို့ အသုံးဝင်ပါတယ်။

* **The Postman CLI** — ကိုယ့်ရဲ့ CI/CD pipeline ထဲမှာ [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) နဲ့ collection runs တွေကို automate လုပ်နိုင်ပါတယ်။ Collections, monitors နဲ့ performance tests တွေကို run လို့ရပါတယ်။

* **Monitors** — APIs တွေရဲ့ health နဲ့ performance တွေကို စစ်ဆေးပြီး collections တွေကို အဆက်မပြတ် run ဖို့ [Postman Monitors](/docs/postman/intro-monitors) ကို သုံးနိုင်ပါတယ်။ Monitors တွေကို schedule တစ်ခုပေါ်မှာ run ဖို့ ရွေးနိုင်သလို — Postman CLI နဲ့လည်း trigger လုပ်နိုင်ပါတယ်။

* **Performance testing** — Real-world traffic တွေကို simulate လုပ်ပြီး load အောက်မှာ ကိုယ့် API ရဲ့ [performance ကို test](https://learning.postman.com/docs/tests-and-scripts/performance-testing/testing-api-performance/) လုပ်ဖို့ collections တွေကို run နိုင်ပါတယ်။

* **Webhooks** — သတ်မှတ်ထားတဲ့ အချိန်တွေမှာ ဒါမှမဟုတ် ကိုယ့် application ထဲမှာ ဖြစ်ရပ်တစ်ခုခု ဖြစ်တဲ့အခါ collection runs တွေ trigger လုပ်ဖို့ [webhooks](https://learning.postman.com/docs/tests-and-scripts/running-collections/collection-webhooks/) တွေကို သုံးနိုင်ပါတယ်။
