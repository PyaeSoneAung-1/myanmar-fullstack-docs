---
title: "Postman မှာ API tests တွေကို run လုပ်ပြီး အလိုအလျောက် လုပ်ဆောင်ခြင်း (Run and automate API tests in Postman)"
description: "Postman မှာ API tests တွေ run လုပ်နိုင်တဲ့ နည်းလမ်းအမျိုးမျိုး — manual run လုပ်ခြင်း, schedule နဲ့ အလိုအလျောက် run လုပ်ခြင်း, CI/CD pipeline ထဲ run လုပ်ခြင်း, Postman Monitors နဲ့ run လုပ်ခြင်း"
order: 93
source: "https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests/"
status: translated
updated: 2026-09-02
---

Testing က API development lifecycle ရဲ့ အရေးပါတဲ့ အစိတ်အပိုင်းတစ်ခုပါ။ Postman က သင့် API tests တွေကို run လုပ်ဖို့ နည်းလမ်းအမျိုးမျိုး ပေးပါတယ်။ Postman မှာ [သင့် tests တွေကို သတ်မှတ်ပြီး](https://learning.postman.com/docs/tests-and-scripts/test-apis/test-apis/) ပြီးရင် — tests တွေကို လိုအပ်သလို ကိုယ်တိုင် run လုပ်နိုင်သလို — အချိန်ကုန်သက်သာပြီး test coverage တိုးလာအောင် tests တွေကို အလိုအလျောက်လည်း run လုပ်နိုင်ပါတယ်။

Postman မှာ သင့် API tests တွေကို run လုပ်နိုင်တဲ့ နည်းလမ်းအမျိုးမျိုးကတော့:

* **Tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း** — Test တစ်ခုတည်း run လုပ်ဖို့ — request တစ်ခုကို ဖွင့်ပြီး ပို့လိုက်ပါ။ Workbench ထဲမှာ test results တွေကို ကြည့်နိုင်ပါတယ်။ Test suite တစ်ခုလုံး run လုပ်ဖို့ဆိုရင် — Collection Runner ကို သုံးပါ။ Collection run လုပ်နေတုန်း Postman က test results တွေကို real time မှာ ပြသပါတယ်။ [Postman မှာ API tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests-manually/) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်ခြင်း** — Collection Runner ကို သုံးပြီး test suites တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်နိုင်ပါတယ်။ Tests တွေ fail ဖြစ်တဲ့အခါ အသိပေးချက်တွေ ရပြီး — Postman ထဲမှာ test results တွေကို ကြည့်နိုင်ပါတယ်။ [Postman မှာ API tests တွေကို schedule တစ်ခုနဲ့ run လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests-on-schedule/) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို သင့် CI/CD pipeline ထဲမှာ run လုပ်ခြင်း** — Postman CLI ကို သုံးပြီး သင့်ရဲ့ ပုံမှန် application build process ရဲ့ အစိတ်အပိုင်းအနေနဲ့ tests တွေကို run လုပ်နိုင်ပါတယ်။ သင့် deployment process အတွင်းမှာ သင့် test suites တွေကို run လုပ်ပြီး — Postman ထဲမှာ test reports တွေကို ကြည့်နိုင်ပါတယ်။ [Postman သုံးပြီး သင့် CI/CD pipeline ထဲမှာ API tests တွေ run လုပ်ခြင်း](/docs/postman/run-tests-with-ci-cd) မှာ ပိုလေ့လာပါ။

* **Tests တွေကို Postman Monitors နဲ့ run လုပ်ခြင်း** — Production environment တစ်ခုထဲမှာ သင့် APIs တွေ မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေမလား သေချာစေဖို့ monitor တစ်ခုထဲကို test logic တွေ ထည့်တာက အသုံးဝင်ပါတယ်။ [Postman Monitors သုံးပြီး API tests တွေ run လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/run-tests/test-with-monitors/) မှာ ပိုလေ့လာပါ။

Issues တွေ production ဆီကို မရောက်ခင် ဖမ်းမိပြီး — test automation ကို သုံးပြီး collaboration ကို ဘယ်လို ပိုကောင်းအောင် လုပ်မလဲဆိုတဲ့ လမ်းညွှန်ချက်တွေအတွက် — [Postman ထဲက API test automation အတွက် best practices](https://www.postman.com/postman-best-practices/api-test-automation/) ကို ကြည့်ပါ။
