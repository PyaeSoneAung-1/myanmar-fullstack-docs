---
title: "Postman မှာ API tests တွေကို ကိုယ်တိုင် run လုပ်ခြင်း (Run API tests manually in Postman)"
description: "Postman မှာ API tests တွေကို ကိုယ်တိုင် run လုပ်နည်း — test တစ်ခုတည်း run လုပ်ခြင်း၊ Collection Runner နဲ့ test suite တစ်ခုလုံး run လုပ်ခြင်း"
order: 134
source: "https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests-manually/"
status: translated
updated: 2026-09-03
---

Postman မှာ — သင့် [functional API tests](/docs/postman/test-apis) တွေကို ကိုယ်တိုင် run လုပ်ပြီး — လိုအပ်သလို on demand စမ်းသပ်ကာ ချက်ချင်း ရလဒ်တွေ ရယူနိုင်ပါတယ်။ Endpoint တစ်ခုအတွက် tests တွေကို ကိုယ်တိုင် run လုပ်ဖို့ API request တစ်ခုကို သုံးပါ။ Collection တစ်ခု ဒါမှမဟုတ် folder တစ်ခုအတွက် test suite တစ်ခု run လုပ်ဖို့ Collection Runner ကို သုံးပြီး — requests တွေရဲ့ run order ကိုတောင် ပြောင်းလဲနိုင်ပါတယ်။

Manual API testing က — သင့်ရဲ့ ပရောဂျက် လိုအပ်ချက်တွေ ပြောင်းလဲလာတာနဲ့အမျှ — သင့် test plans တွေကို ညှိယူနိုင်တဲ့ လိုက်လျောညီထွေမှုကို ပေးပါတယ်။ ရှုပ်ထွေးတဲ့ ပြဿနာတွေကို စူးစမ်းလေ့လာပြီး — root causes တွေနဲ့ ဖြစ်နိုင်ခြေရှိတဲ့ အဖြေတွေကို ရှာဖွေဖို့လည်း manual testing ကို သုံးနိုင်ပါတယ်။

## Test တစ်ခုတည်း run လုပ်ခြင်း

Postman မှာ testing ရဲ့ အခြေခံ unit က [API request](/docs/postman/requests) တစ်ခုပါ။ Request တစ်ခုစီက API endpoint တစ်ခုကို ခေါ်ယူပြီး — လုပ်ဆောင်ချက် တစ်ခုချင်းစီကို စမ်းသပ်ပါတယ်။ Request တစ်ခုမှာ test logic ထည့်ဖို့ scripts တွေကို သုံးနိုင်ပါတယ်။ ဥပမာ — request ပို့တဲ့အခါ မျှော်လင့်ထားတဲ့ data ရလားဆိုတာ စစ်ဆေးဖို့ [test scripts တွေ ရေးသားနိုင်ပါတယ်](/docs/postman/intro-to-scripts)။

Test တစ်ခုတည်းကို ကိုယ်တိုင် run လုပ်ဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး collection တစ်ခု ရွေးကာ — run လုပ်ချင်တဲ့ test ပါတဲ့ request တစ်ခုကို နှိပ်ပါ။
3. (Optional) Request ကို [environment](/docs/postman/managing-environments) တစ်ခုနဲ့ ပို့ချင်ရင် — workbench ရဲ့ ညာဘက်အပေါ်က environment selector ကနေ ရွေးပါ။
4. **Send** ကို နှိပ်ပါ။
5. ရလဒ်တွေ ကြည့်ဖို့ request ရဲ့ response ထဲက **Test Results** tab ကို နှိပ်ပါ။

[Postman API client နဲ့ request တစ်ခု ပို့ခြင်း](/docs/postman/request-basics) မှာ ပိုလေ့လာနိုင်ပါတယ်။

## Test suite တစ်ခု run လုပ်ခြင်း

API requests တစ်ခုချင်းစီကို test suite တစ်ခုအဖြစ် စုစည်းဖို့ [Postman Collections](https://learning.postman.com/docs/use/use-collections/overview/) ကို သုံးပါ။ ပြီးရင် — ကိုယ်ရွေးချယ်တဲ့ အစဉ်အတိုင်း tests တွေ run လုပ်ဖို့ [Collection Runner](/docs/postman/intro-to-collection-runs) ကို သုံးပါ။ Postman ရဲ့ paid plan တစ်ခုနဲ့ဆိုရင် — run တစ်ကြိမ်ချင်းစီမှာ data အမျိုးမျိုး သုံးပြီး tests တွေကို အကြိမ်ကြိမ် run ဖို့ [data files တွေလည်း upload လုပ်နိုင်ပါတယ်](/docs/postman/working-with-data-files)။

Test suite တစ်ခုကို ကိုယ်တိုင် run လုပ်ဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး collection တစ်ခု ရွေးကာ — run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို နှိပ်ပါ။
3. **Run** ကို နှိပ်ပါ။
4. **Functional** tab ပေါ်မှာ **Run manually** ကို ရွေးပါ။
5. (Optional) Collection ကို [environment](/docs/postman/managing-environments) တစ်ခုနဲ့ run ချင်ရင် — workbench ရဲ့ ညာဘက်အပေါ်က environment selector ကနေ ရွေးပါ။
6. Run လုပ်ချင်တဲ့ iteration အရေအတွက်လိုမျိုး — သင့် configuration options တွေကို ရွေးပါ။
7. **Start run** ကို နှိပ်ပါ။ Postman က test results တွေကို real time မှာ ပြသပါတယ်။

Collection ကို [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview/) နဲ့ run လုပ်ဖို့ — magic icon ကို နှိပ်ပြီး dropdown list ထဲက suggested task တစ်ခုကို ရွေးပါ။ ဥပမာ — **Add tests based on the response** ကို ရွေးလိုက်ရင် Agent Mode က collection ကို run လုပ်ပြီး — run results တွေအပေါ် အခြေခံကာ tests တွေကို အကြံပြုပေးပါတယ်။

[Collection Runner သုံးပြီး သင့် API ကို စမ်းသပ်ခြင်း](/docs/postman/intro-to-collection-runs) မှာ ပိုလေ့လာနိုင်ပါတယ်။
