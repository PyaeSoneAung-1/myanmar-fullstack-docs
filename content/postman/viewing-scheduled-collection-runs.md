---
title: "Postman မှာ Scheduled Collection Runs တွေကို ကြည့်ရှုခြင်း (View Scheduled Collection Runs in Postman)"
description: "Scheduled collection runs တွေကို ဘယ်လို ကြည့်ရှုမလဲ — run summary graph, filters, test results, errors နဲ့ console log တွေကနေ API တွေရဲ့ ကျန်းမာရေးကို အချိန်နဲ့အမျှ စောင့်ကြည့်ခြင်း"
order: 104
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/viewing-scheduled-collection-runs/"
status: translated
updated: 2026-09-02
---

Postman က ကိုယ့် collections တွေကို နေ့စဉ် ဒါမှမဟုတ် အပတ်စဉ် သတ်မှတ်ထားတဲ့ အချိန်တွေမှာ run လုပ်ပေးနိုင်ပါတယ်။ ဥပမာ — ကိုယ့် API ကို နေ့တိုင်း test လုပ်တဲ့ collection တစ်ခုကို run ချင်နိုင်ပါတယ်။ Collection Runner ကို သုံးပြီး သတ်မှတ်ထားတဲ့ နေ့ရက်နဲ့ အချိန်တွေမှာ [collections တွေကို အလိုအလျောက် run ဖို့ schedule လုပ်နိုင်ပါတယ်](/docs/postman/scheduling-collection-runs)။

Postman ထဲမှာ scheduled collection runs တွေကို ကြည့်ဖို့ — sidebar ထဲက collection တစ်ခုကို နှိပ်ပြီး **Runs > Scheduled** tab ကို ရွေးပါ။ Scheduled collection run တစ်ခုရဲ့ ရလဒ်တွေကို ကြည့်ဖို့ — run ပေါ်မှာ mouse ချပြီး **View** ကို နှိပ်ပါ။

Workspaces တွေထဲက Scheduled collection runs တွေကို workspace ရဲ့ members အားလုံး မြင်နိုင်ပါတယ်။

## Scheduled collection run အကျဉ်းချုပ်

အချိန်ကြာလာတာနဲ့အမျှ ကိုယ့် APIs တွေရဲ့ ကျန်းမာရေးကို နားလည်ဖို့ graph ကို သုံးပါ။ Graph ထဲက bar တစ်ခုချင်းစီက collection run တစ်ခုကို ကိုယ်စားပြုပါတယ်။

အပေါ်ပိုင်း section က scheduled collection run တစ်ခုချင်းစီအတွက် ပျမ်းမျှ response time ကို ပြသပြီး — အောက်ပိုင်း section က region အားလုံးမှာ run တစ်ခုချင်းစီအတွက် failed tests အရေအတွက်ကို ပြသပါတယ်။ Failed percentage နဲ့ response time တို့ရဲ့ တိကျတဲ့ တန်ဖိုးတွေကို ကြည့်ဖို့ — run တစ်ခုပေါ်မှာ mouse ချပါ။

Bar တစ်ခု အနီရောင် ဖြစ်နေရင် — run အတွင်းမှာ tests တွေ failed ဖြစ်ခဲ့တာ ဒါမှမဟုတ် errors တွေ ဖြစ်ခဲ့တာကို ညွှန်ပြပါတယ်။ အသေးစိတ်အတွက် [Console log](#console-log-ကို-ကြည့်ရှုခြင်း) ကို ကြည့်ပါ။

## Filters (စစ်ထုတ်မှုများ)

Run type နဲ့ result အချို့ကို နှိပ်ပြီး — ကိုယ့် scheduled collection runs တွေထဲက ထပ်တလဲလဲ ဖြစ်နေတဲ့ ပုံစံတွေကို ဖော်ထုတ်ဖို့ filters တွေကို သုံးပါ။

မူရင်း dashboard view ဆီ ပြန်သွားဖို့ **Clear Filters** ကို နှိပ်ပါ။

### Type အလိုက် စစ်ထုတ်ခြင်း

Runs အားလုံး, manual runs နဲ့ scheduled runs တွေကြားမှာ response times တွေ ဘယ်လို ပြောင်းလဲခဲ့လဲ နှိုင်းယှဉ်ဖို့ — run type အလိုက် စစ်ထုတ်ပါ။ **Type** dropdown list ကို နှိပ်ပြီး — ကြည့်ချင်တဲ့ run type ကို ရွေးပါ။

Manual runs တွေကို Postman ထဲမှာ ကိုယ်တိုင် စတင်တာပါ။ Scheduled runs တွေကို — ကိုယ့် scheduled run ကို ဖန်တီးတုန်း ဒါမှမဟုတ် တည်းဖြတ်တုန်းက သတ်မှတ်ထားတဲ့ schedule ကနေ စတင်တာပါ။ Webhook runs တွေကို — ကိုယ် ဖန်တီးထားတဲ့ integrations တွေကနေ စတင်တာပါ။

### Run result အလိုက် စစ်ထုတ်ခြင်း

Scheduled run တစ်ခုချင်းစီကို သူ့ရဲ့ result ပေါ်မူတည်ပြီး တံဆိပ်တပ်ပါတယ်:

* **Successful** — Scheduled collection run က ပြဿနာ တစ်စုံတစ်ရာ မရှိဘဲ ပြီးဆုံးပြီး tests အားလုံး passed ဖြစ်ခဲ့ပါတယ်။
* **Failure** — Scheduled collection run က ပြီးဆုံးခဲ့ပေမယ့် — tests တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး failed ဖြစ်ခဲ့ပါတယ်။
* **Error** — Scheduled collection run က error တစ်ခုကြောင့် ပြီးဆုံးအောင် မလုပ်နိုင်ခဲ့ပါဘူး။ Test code ထဲမှာ syntax error တစ်ခု, network error တစ်ခု ဒါမှမဟုတ် အခြားသော အကြောင်းရင်း အမျိုးမျိုးကြောင့် error တစ်ခု ဖြစ်နိုင်ပါတယ်။ Error တစ်ခု ရတဲ့အခါ — [Console log](#console-log-ကို-ကြည့်ရှုခြင်း) က ဘာကြောင့် ဖြစ်တာလဲ ဖော်ထုတ်ဖို့ ကူညီနိုင်ပါတယ်။

- **Abort** — Scheduled collection run က သတ်မှတ်ထားတဲ့ အချိန်အတွင်း မပြီးဆုံးလို့ timeout ဖြစ်ခဲ့ပါတယ်။

Result တူညီတဲ့ runs တွေကြားမှာ ဘယ်လို ကွဲပြားလဲ နှိုင်းယှဉ်ဖို့ — run result အလိုက် စစ်ထုတ်ပါ။ **Run result** dropdown list ကို ရွေးပြီး — ကြည့်ချင်တဲ့ run result type တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရွေးပါ။

## Time traverse (အချိန်ကာလ လှည့်လည်ကြည့်ရှုခြင်း)

အချိန်တစ်ခုတည်းမှာ ဘာတွေ ဖြစ်ခဲ့လဲ နားလည်ဖို့ — အရင်က run results တွေကို ပြန်သုံးသပ်ပါ။ သတ်မှတ်ထားတဲ့ အချိန်တစ်ခုဆီ သွားဖို့ — graph ပေါ်မှာ **Go to** ကို နှိပ်ပြီး — အချိန်နဲ့ နေ့စွဲတစ်ခု ရွေးကာ **Apply** ကို နှိပ်ပါ။

View ကို နောက်ဆုံး runs တွေဆီ ပြန်ပြောင်းဖို့ — graph ပေါ်မှာ အချိန်နဲ့ နေ့စွဲကို ရွေးပြီး **Reset** ကို နှိပ်ပါ။

## Test results (စမ်းသပ်မှု ရလဒ်များ)

Scheduled run တစ်ခုရဲ့ tests တွေအကြောင်း အသေးစိတ် ပိုသိဖို့ — graph ထဲက bar တစ်ခုကို နှိပ်ပါ။ Passed ဒါမှမဟုတ် failed tests တွေ, response codes တွေ, response times တွေ နဲ့ failed test assertions တွေ အပါအဝင် အသေးစိတ်တွေ ပါဝင်ပါတယ်။

Scheduled run တစ်ခုရဲ့ test results တွေအကြောင်း ပိုလေ့လာဖို့ — အောက်ပါတွေကို ကြည့်ရှုနိုင်ပါတယ်:

* **All** tab ကို နှိပ်ပြီး — scheduled run ထဲက tests တွေ passed, failed, errors ဒါမှမဟုတ် skipped ဖြစ်ခဲ့တဲ့ requests အားလုံးကို ကြည့်ပါ — tests လုံးဝမရှိတဲ့ requests တွေ အပါအဝင်။ အဲဒီ category ထဲက tests တွေပဲ ကြည့်ချင်ရင် **Passed**, **Failed**, **Skipped** ဒါမှမဟုတ် **Errors** tab ကို နှိပ်ပါ။ Category တစ်ခုထဲက tests အရေအတွက်ကို tab တစ်ခုချင်းစီရဲ့ ဘေးမှာ ပြသပါတယ်။
* Request တစ်ခုချင်းစီရဲ့ ဘေးမှာ — response code, time နဲ့ size တွေကို ကြည့်ရှုနိုင်ပါတယ်။ Passed (အစိမ်း), failed (အနီ) ဒါမှမဟုတ် skipped (မီးခိုးရောင်) ဖြစ်ခဲ့တဲ့ tests အရေအတွက်တွေကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။ ဒီ ဂဏန်းတွေထဲက တစ်ခုပေါ်မှာ mouse ချရင် — request ထဲက tests တွေရဲ့ အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာချက်ကို ကြည့်ရပါတယ်။
* Request တစ်ခုကို နှိပ်ပြီး — ဘယ် tests တွေ passed, failed ဒါမှမဟုတ် skipped ဖြစ်ခဲ့လဲ ကြည့်ပါ။
* Request တစ်ခုရဲ့ နာမည်ကို နှိပ်ပြီး — request ကို tab အသစ်တစ်ခုမှာ ဖွင့်ပါ။
* Requests တွေက folder တစ်ခုထဲမှာ ရှိနေရင် — folder ရဲ့ နာမည်ကို နှိပ်ပြီး folder ကို tab အသစ်တစ်ခုမှာ ဖွင့်ပါ။

## Errors (အမှားများ)

**Errors** tab ကို နှိပ်ပြီး — errors ကြုံခဲ့တဲ့ requests တွေအတိုင်း ရလဒ်တွေကို စစ်ထုတ်ပါ။ Errors တွေက — timeout ဒါမှမဟုတ် TLS handshake errors လိုမျိုး runtime ပြဿနာတွေကို ညွှန်ပြပါတယ်။ Failed requests တွေက — user က သတ်မှတ်ထားတဲ့ checks တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး (post-request scripts လိုမျိုး) မျှော်လင့်ချက်တွေနဲ့ မကိုက်ညီတဲ့အခါ ဖြစ်ပေါ်ပါတယ်။

သင့် scheduled run ထဲမှာ errors ရှိတဲ့ requests တွေက — run results စာမျက်နှာပေါ်မှာ error badge နဲ့ error message တွေနဲ့အတူ ပေါ်လာပါတယ်။ Badges တွေက errors တွေကို network, request ဒါမှမဟုတ် script ပြဿနာတွေအဖြစ် ခွဲခြားဖော်ပြပါတယ်။

## Console log ကို ကြည့်ရှုခြင်း

**Console Log** tab ကို နှိပ်ပြီး — ကိုယ့် pre-request နဲ့ post-response scripts တွေထဲက [log statements](/docs/postman/troubleshooting-api-requests) တွေနဲ့အတူ scheduled run အသေးစိတ်တွေကို ကြည့်ရှု, ရှာဖွေနိုင်ပါတယ်။ ပြဿနာတွေကို ဖြေရှင်းဖို့နဲ့ run တစ်ခုရဲ့ အပြုအမူအကြောင်း ပိုလေ့လာဖို့ log ကို သုံးပါ။ Scheduled run တစ်ခုရဲ့ log ကို ကြည့်ဖို့ — graph ထဲက bar တစ်ခုကို နှိပ်ပြီး graph အောက်က **Console Log** ကို နှိပ်ပါ။

Log အသေးစိတ်တွေထဲမှာ — preparing run, running နဲ့ run complete လိုမျိုး collection run တစ်ခုရဲ့ အဆင့်တွေ ပါဝင်ပါတယ်။ Log က errors တွေနဲ့ test failures တွေကိုလည်း ပြသပါတယ်။ Console log ထဲမှာ request တစ်ခုကို ရွေးရင် — tab အသစ်တစ်ခုမှာ ဖွင့်ပေးတာမို့ request ကို လိုအပ်သလို ပြန်သုံးသပ်, တည်းဖြတ်နိုင်ပါတယ်။

Console log ရဲ့ search feature နဲ့ သီးခြား string တွေကို ရှာဖွေနိုင်ပါတယ်။ ရှာဖွေခြင်းက — log ကို ကိုယ်တိုင် လိုက်ရှာစရာ မလိုဘဲ error messages တွေနဲ့ codes တွေကို အလိုအလျောက် highlight လုပ်ပြီး တစ်ခုပြီးတစ်ခု လှည့်ကြည့်နိုင်စေပါတယ်။

**Search console logs** ကို နှိပ်ပြီး string တစ်ခု ရိုက်ထည့်ပါ။ ကိုက်ညီတဲ့နေရာတွေက log ထဲမှာ highlight ဖြစ်ပြီး — **Next match** နဲ့ **Previous match** တွေကို နှိပ်ပြီး တစ်ခုပြီးတစ်ခု လှည့်ကြည့်နိုင်ပါတယ်။ ရှာဖွေမှုနဲ့ ရလဒ်တွေကို ရှင်းလင်းဖို့ **Clear search** ကို နှိပ်ပါ။

**Scheduled collection run logs တွေကို ခြောက်လ ကာလအတွက် သိမ်းဆည်းထားပါတယ်။** Retention ကာလထက် ကျော်လွန်နေတဲ့ scheduled collection run တစ်ခုကို ရွေးရင် — failed tests နဲ့ errors အရေအတွက်ကို ကြည့်ရှုနိုင်ပါသေးတယ်။ တခြား collection run အသေးစိတ်တွေကတော့ မရနိုင်တော့ပါဘူး။ ဒီ အချက်အလက်တွေ တောင်းခံဖို့ — [Postman support](https://www.postman.com/support/) ကို ဆက်သွယ်ပါ။
