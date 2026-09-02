---
title: "Simulation တစ်ခုနဲ့ Collection တစ်ခုကို Run လုပ်ခြင်း (Run a Collection with a Simulation)"
description: "Postman Simulator ကို သုံးပြီး collection run တစ်ခုကို simulation နဲ့ run လုပ်နည်း — latency, errors, rate limits လိုမျိုး အခြေအနေတွေကို mock ပေါ်မှာ အသုံးချပြီး လက်တွေ့ကမ္ဘာ့ အခြေအနေတွေအောက်မှာ ကိုယ့် service ရဲ့ အပြုအမူကို စမ်းသပ်ခြင်း"
order: 103
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/run-collection-with-simulation/"
status: translated
updated: 2026-09-02
---

Postman Simulator ကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်ကို [pricing page](https://www.postman.com/pricing/) မှာ ကြည့်ပါ။

[mock](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers/) တစ်ခုနဲ့ဆိုရင် — ကိုယ့် API ရဲ့ dependencies တွေကို simulate လုပ်ပြီး — real services တွေကို မခေါ်ဘဲ ကိုယ့် service ရဲ့ အပြုအမူကို စမ်းသပ်နိုင်ပါတယ်။ [Postman Simulator](https://learning.postman.com/docs/design-apis/simulate-conditions) ကို သုံးပြီး — latency (ကြန့်ကြာချိန်), errors နဲ့ rate limits လိုမျိုး အခြေအနေတွေကို ကိုယ့် mock ပေါ်မှာ အသုံးချကာ — လက်တွေ့ကမ္ဘာ့ အခြေအနေတွေကို ပြန်ထုတ်နိုင်ပါတယ်။ ဒါက ကိုယ့် service က အနှောင့်အယှက်တွေနဲ့ performance ကန့်သတ်ချက်တွေကို ဘယ်လို တုံ့ပြန်လဲဆိုတာ လေ့လာနိုင်စေပါတယ်။

## Simulation တစ်ခုနဲ့ collection run တစ်ခုကို configure လုပ်ခြင်း

သင့် service က လက်တွေ့ကမ္ဘာ့ အခြေအနေတွေအောက်မှာ ဘယ်လို ပြုမူလဲ စမ်းသပ်ဖို့ — collection တစ်ခုကို simulation တစ်ခုနဲ့ run လုပ်ပါ။ Run ကို စတင်တဲ့အခါ — requests တွေ run လုပ်နေစဉ်မှာ Postman က ရွေးထားတဲ့ simulation ကို အသုံးချပါတယ်။ Local View မှာ — Postman က collection run ကြာချိန်အတွက် mock ကို အလိုအလျောက် စတင်ပြီး — run ပြီးဆုံးတဲ့အခါ ရပ်တန့်ပေးပါတယ်။ Cloud View မှာတော့ — mock က အမြဲတမ်း run နေတာမို့ — စတင်စရာ မလိုဘဲ requests တွေ ပို့နိုင်ပါတယ်။

Simulation တစ်ခုနဲ့ collection တစ်ခုကို run လုပ်ခင် — requests တွေရဲ့ base URL က mock URL ဆီ သတ်မှတ်ထားဖို့ သေချာပါစေ။

Simulation တစ်ခုနဲ့ collection တစ်ခုကို run လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. ဘယ်ဘက် sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး simulation တစ်ခုနဲ့ run လုပ်ချင်တဲ့ collection ကို ရွေးပါ။
3. **Run** ကို နှိပ်ပါ။
4. **Functional** ကို ရွေးပြီး — **Local** ကို ရွေးပါ။
5. Iterations အရေအတွက်, delay ဒါမှမဟုတ် test data file လိုမျိုး — collection run settings တွေကို လိုအပ်သလို configure လုပ်ပါ။
6. Dropdown menu ကနေ simulation configuration တစ်ခုကို ရွေးပါ။ Simulation အသစ်တစ်ခု ဖန်တီးဖို့ **Create new simulation** ကိုလည်း နှိပ်နိုင်ပါတယ် — [simulation တစ်ခု ဖန်တီးခြင်း](https://learning.postman.com/docs/design-apis/simulate-conditions/) အကြောင်း ကြည့်ပါ။
7. (ထည့်စရာမလို) Simulation ကို တည်းဖြတ်ဖို့ ဘယ်ဘက် pane ထဲက **Simulator** tab ကို နှိပ်ပါ။
8. **Start run** ကို နှိပ်ပါ။

Postman CLI နဲ့လည်း — [`postman collection run --simulate` command](https://learning.postman.com/docs/postman-cli/postman-cli-collections/) ကို သုံးပြီး simulation တစ်ခုနဲ့ collection တစ်ခုကို run လုပ်နိုင်ပါတယ်။

## Simulation events တွေကို ကြည့်ရှုခြင်း

Collection တစ်ခုကို simulation တစ်ခုနဲ့ run လုပ်ပြီးတဲ့နောက် — collection run results တွေထဲမှာ ရလဒ်တွေကို ပြန်လည် သုံးသပ်နိုင်ပါတယ်။ Test results, errors နဲ့ request metrics တွေ အပါအဝင် — standard run details အားလုံး ပုံမှန်အတိုင်း ရရှိနိုင်ပါတယ်။

Collection run results တွေထဲမှာ — run အတွင်း request တစ်ခုချင်းစီပေါ်မှာ အသုံးချထားတဲ့ scenarios တွေ ဘယ်လို သက်ရောက်ခဲ့လဲ ပြသဖို့ **Simulation events** tab ကို နှိပ်ပါ။ ဒီ tab မှာ — အချိန်, event, အသုံးချထားတဲ့ scenario နဲ့ နောက်ထပ် context တွေလိုမျိုး အသေးစိတ်တွေပါတဲ့ events တွေရဲ့ timeline တစ်ခု ပါဝင်ပါတယ်။ Event တစ်ခုချင်းစီအတွက် — tests တွေ ဘယ်နှစ်ခု passed ဒါမှမဟုတ် failed ဖြစ်ခဲ့လဲဆိုတာကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။

Failure conditions တွေကို ဘယ်အချိန် ဘယ်လို စတင်ခဲ့လဲ — ကိုယ့် service က သူတို့ကို ဘယ်လို တုံ့ပြန်ခဲ့လဲ နားလည်ဖို့ **Simulation events** tab ကို နှိပ်ပါ။

[Collection run results တွေကို ကြည့်ရှုခြင်း](/docs/postman/intro-to-collection-runs) အကြောင်း ပိုလေ့လာပါ။
