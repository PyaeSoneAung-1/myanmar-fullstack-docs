---
title: "Postman မှာ API tests တွေကို schedule တစ်ခုနဲ့ run လုပ်ခြင်း (Run API tests on a schedule in Postman)"
description: "Postman မှာ API tests တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်နည်း — test suite schedule လုပ်ခြင်း၊ scheduled test results တွေ ကြည့်ရှုခြင်း"
order: 135
source: "https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests-on-schedule/"
status: translated
updated: 2026-09-03
---

Postman မှာ — သင့် [functional API tests](/docs/postman/test-apis) တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်နိုင်ပါတယ်။ Collection Runner ကို သုံးပြီး test suite တစ်ခု ရွေးချယ်ကာ — tests တွေရဲ့ run order ကို ပြောင်းလဲပြီး — run schedule ကို သတ်မှတ်နိုင်ပါတယ်။ Collection run တိုင်းမှာ — tests တစ်ခုခု fail ဖြစ်ရင် သင့်ကို အသိပေးပါတယ်။

API development လုပ်ငန်းစဉ်အတွင်းမှာ — အရည်အသွေး သေချာစေဖို့ tests တွေကို မကြာခဏ ထပ်ခါထပ်ခါ run ဖို့ လိုအပ်ပါတယ်။ Test တစ်ခုချင်းစီကို ကိုယ်တိုင် run ရတာက အချိန်ကုန်နိုင်ပြီး — testing မှာ ကွက်လပ်တွေ ဖြစ်စေနိုင်ပါတယ်။ Tests တွေကို schedule တစ်ခုနဲ့ run လုပ်ခြင်းက — အချိန်နဲ့ အားစိုက်မှုတွေ သက်သာစေပြီး — သင့် test coverage ကို တိုးမြှင့်နိုင်စေပါတယ်။ ဒါ့အပြင် — အချိန်ကြာလာတာနဲ့အမျှ သင့် API ရဲ့ အရည်အသွေး လမ်းကြောင်း (trends) တွေကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။

## Tests တွေကို schedule တစ်ခုနဲ့ run လုပ်ခြင်း

API requests တစ်ခုချင်းစီကို test suite တစ်ခုအဖြစ် စုစည်းဖို့ [Postman Collections](https://learning.postman.com/docs/use/use-collections/overview/) ကို သုံးနိုင်ပါတယ်။ ပြီးရင် — tests တွေ ဘယ်အချိန်၊ ဘယ်နှစ်ကြိမ် run မလဲဆိုတာ configure လုပ်ဖို့ [Collection Runner](/docs/postman/scheduling-collection-runs) ကို သုံးနိုင်ပါတယ်။ Postman ရဲ့ paid plan တစ်ခုနဲ့ဆိုရင် — run တစ်ကြိမ်ချင်းစီမှာ data အမျိုးမျိုး သုံးပြီး tests တွေကို အကြိမ်ကြိမ် run ဖို့ [data files တွေလည်း upload လုပ်နိုင်ပါတယ်](/docs/postman/working-with-data-files)။ Scheduled runs တွေကို Postman Cloud ထဲမှာပဲ ထောက်ပံ့ပေးပါတယ်။

Test suite တစ်ခုကို schedule တစ်ခုနဲ့ run လုပ်ဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး collection တစ်ခု ရွေးကာ — schedule လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို နှိပ်ပါ။
3. **Run** ကို နှိပ်ပါ။
4. **Functional** tab ကို နှိပ်ပြီး — **Schedule runs** ကို နှိပ်ပါ။
5. Scheduled run ရဲ့ နာမည်ကို ထည့်ပြီး — run frequency နဲ့ အချိန်ကို သတ်မှတ်ပါ။
6. Run လုပ်ချင်တဲ့ iteration အရေအတွက်နဲ့ သုံးမယ့် [environment](/docs/postman/managing-environments) လိုမျိုး — သင့် configuration options တွေကို ရွေးပါ။ သင့် Postman plan ပေါ် မူတည်ပြီး — scheduled runs တွေမှာ သုံးဖို့ JSON ဒါမှမဟုတ် CSV data file တစ်ခုကိုလည်း upload လုပ်နိုင်ပါတယ်။
7. (Optional) Test failures နဲ့ errors တွေအကြောင်း အသိပေးချင်တဲ့ users တွေကို ရွေးပါ။
8. **Schedule Run** ကို နှိပ်ပါ။

[Collection runs တွေကို schedule တစ်ခုနဲ့ အလိုအလျောက် run လုပ်ခြင်း](/docs/postman/scheduling-collection-runs) မှာ ပိုလေ့လာနိုင်ပါတယ်။

## Scheduled test results တွေကို ကြည့်ရှုခြင်း

Postman က Collection Runner ထဲမှာ သင်သတ်မှတ်ထားတဲ့ schedule အတိုင်း သင့် test suite ကို run ပေးပါတယ်။ အရင်က run ခဲ့တဲ့ test runs တွေရဲ့ ရလဒ်တွေကို ကြည့်ရှုနိုင်ပါတယ်။ ဒါ့အပြင် — configuration options တွေကို ပြောင်းလဲနိုင်သလို — test schedule ကို pause ဒါမှမဟုတ် resume လည်း လုပ်နိုင်ပါတယ်။

Scheduled test runs တွေကို ကြည့်ရှုဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး collection တစ်ခု ရွေးကာ — test results တွေ ကြည့်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို နှိပ်ပါ။
3. **Runs** tab ကို နှိပ်ပြီး — **Scheduled** tab ကို နှိပ်ပါ။
4. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး — runs အားလုံးရဲ့ graph တစ်ခု ပြသဖို့ **View** ကို နှိပ်ပါ။

Graph ထဲက bar တစ်ခုချင်းစီက collection run iteration တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒီ graph ကို သုံးပြီး — သင့် APIs တွေ အချိန်ကြာလာတာနဲ့အမျှ ဘယ်လို လုပ်ဆောင်ခဲ့လဲဆိုတာ နားလည်နိုင်ပါတယ်။ အဲဒီ iteration အတွင်း run ခဲ့တဲ့ tests တွေအကြောင်း — ဘယ်ဟာတွေ pass ဒါမှမဟုတ် fail ဖြစ်ခဲ့လဲဆိုတာလိုမျိုး — ပိုသိချင်ရင် graph ထဲက bar တစ်ခုကို နှိပ်ပါ။

[Postman မှာ scheduled collection runs တွေကို ကြည့်ရှုခြင်း](/docs/postman/viewing-scheduled-collection-runs) မှာ ပိုလေ့လာနိုင်ပါတယ်။
