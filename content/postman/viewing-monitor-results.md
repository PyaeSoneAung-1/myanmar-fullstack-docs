---
title: "Monitor results တွေကို ကြည့်ရှုခြင်း (View monitor results)"
description: "Monitor results တွေကို ကြည့်ရှုခြင်း — monitor statuses, summary, individual requests, filters, time traverse, test results, errors, console log, history နဲ့ details"
order: 63
source: "https://learning.postman.com/docs/monitoring-your-api/viewing-monitor-results/"
status: translated
updated: 2026-09-02
---

[Monitors](/docs/postman/setting-up-monitor) တွေက ကိုယ့် APIs တွေရဲ့ ကျန်းမာရေးနဲ့ performance ကို အဆက်မပြတ် ခြေရာခံပေးပါတယ်။ Postman နဲ့ဆိုရင် — ကိုယ့် workspace ထဲက monitors အားလုံးမှာ ဘာတွေ ဖြစ်နေလဲ နောက်ဆုံး အခြေအနေကို သိရှိနေနိုင်ပါတယ်။ ဒါမှမဟုတ် — အချိန်ကြာလာတာနဲ့အမျှ test results တွေနဲ့ performance တွေကို စစ်ဆေးဖို့ monitor တစ်ခုချင်းစီကိုလည်း ပြန်သုံးသပ်နိုင်ပါတယ်။

Postman မှာ ကိုယ့် monitors တွေကို ကြည့်ဖို့ — ကိုယ့် workspace ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon) **Services** ကို နှိပ်ပြီး sidebar ထဲက **Monitors** ကို ချဲ့ပါ။ Monitor တစ်ခုကို ရွေးလိုက်ရင် — ၎င်းရဲ့ နောက်ဆုံး performance အသေးစိတ်ပါတဲ့ tab တစ်ခု ဖွင့်ပေးပါတယ်။

![View monitor results](https://assets.postman.com/postman-docs/v12/monitor-summary-v12-22-4.png)

Monitors တွေကို workspace ရဲ့ members အားလုံး မြင်နိုင်ပါတယ်။

## Monitor statuses တွေ

Sidebar ထဲမှာ — monitor တစ်ခုချင်းစီက ၎င်းရဲ့ လက်ရှိ အခြေအနေကို ဖော်ပြတဲ့ status icon တစ်ခု ပြသပေးပါတယ်:

* ![Healthy icon](https://assets.postman.com/postman-docs/aether-icons/v12/monitor-status-healthy.svg#icon) **Healthy** — အစိမ်းရောင် check icon က monitor ရဲ့ နောက်ဆုံး run က failed tests ဒါမှမဟုတ် errors တွေ မရှိဘဲ အောင်မြင်ခဲ့တယ်လို့ ဆိုလိုပါတယ်။
* ![Unhealthy icon](https://assets.postman.com/postman-docs/aether-icons/v12/monitor-status-unhealthy.svg#icon) **Unhealthy** — အနီရောင် exclamation mark icon က monitor ရဲ့ နောက်ဆုံး run မှာ failed tests ဒါမှမဟုတ် errors တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရှိခဲ့တယ်လို့ ဆိုလိုပါတယ်။
* ![Pause icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-pause-stroke-small.svg#icon) **Paused** — Pause icon က monitor ကို [pause လုပ်ထားပြီး](/docs/postman/setting-up-monitor) ၎င်းရဲ့ schedule အတိုင်း run မနေဘူးလို့ ဆိုလိုပါတယ်။
* ![Unknown icon](https://assets.postman.com/postman-docs/aether-icons/v12/monitor-status-unknown.svg#icon) **Unknown** — ဗလာ circle icon က monitor က မပြေးရသေးတာကြောင့် — သတင်းပို့စရာ results တွေ မရှိသေးဘူးလို့ ဆိုလိုပါတယ်။ ဒါက ပြဿနာတစ်ခုကို ညွှန်ပြတာ မဟုတ်ပါဘူး။ Monitor တစ်ခု run ဖြစ်ခဲ့ပေမဲ့ ၎င်းရဲ့ status ကို ဆုံးဖြတ်လို့ မရခဲ့ဘူးဆိုရင်လည်း ဒါ ပေါ်လာနိုင်ပါတယ်။ ဒီလိုဖြစ်ရင် — status ကို refresh လုပ်ဖို့ monitor ကို နောက်တစ်ကြိမ် run ပါ။

## Monitor summary

ကိုယ့် APIs တွေ အချိန်ကြာလာတာနဲ့အမျှ ဘယ်လို လုပ်ဆောင်ခဲ့လဲ နားလည်ဖို့ monitor summary ကို သုံးနိုင်ပါတယ်။ Monitor run တစ်ခုချင်းစီကို graph ထဲမှာ bar တစ်ခုနဲ့ ကိုယ်စားပြုပါတယ်။ ပုံမှန်အားဖြင့် — ဒါက monitor ရဲ့ **Run summary** view ကို ပြသပေးပါတယ်။

အပေါ်ပိုင်း section က run တစ်ခုချင်းစီအတွက် ကိုယ့် monitor ရဲ့ average response time ကို ဇယားရေးဆွဲပြပြီး — အောက်ပိုင်း section က region တွေအားလုံးမှာ run တစ်ခုချင်းစီအတွက် failed tests အရေအတွက်ကို မြင်သာစွာ ပြသပါတယ်။ Failed percentage နဲ့ response time ရဲ့ တိကျတဲ့ တန်ဖိုးတွေကို ကြည့်ဖို့ — run တစ်ခုချင်းစီပေါ်မှာ mouse ချ (hover) လုပ်ပါ။

![Monitor summary](https://assets.postman.com/postman-docs/v12/monitor-summary-tooltip-v12-22-4.png)

အနီရောင် bar တစ်ခုက — run အတွင်း tests တွေ failed ဖြစ်ခဲ့တယ် ဒါမှမဟုတ် errors တွေ ဖြစ်ခဲ့တယ်လို့ ဖော်ပြပါတယ်။ အသေးစိတ်အတွက် — ကိုယ့် [Console Log](#console-log) ကို ကြည့်ပါ။

### Requests တစ်ခုချင်းစီ

ကိုယ့် monitor summary ကို requests တစ်ခုချင်းစီအလိုက် ခွဲကြည့်ဖို့ **Individual requests** ကို ရွေးနိုင်ပါတယ်။

![Request split](https://assets.postman.com/postman-docs/v12/monitor-indiv-request-v12-22-4.png)

## Filters တွေ

သီးခြား requests, run types, results နဲ့ regions (သက်ဆိုင်ရင်) တွေကို ရွေးပြီး — ကိုယ့် monitoring runs တွေထဲက ထပ်တလဲလဲ ဖြစ်နေတဲ့ ပုံစံတွေကို ဖော်ထုတ်ဖို့ filters တွေကို သုံးနိုင်ပါတယ်။ မူရင်း dashboard view ဆီ ပြန်သွားဖို့ **Clear Filters** ကို နှိပ်ပါ။

### Request အလိုက် filter လုပ်ခြင်း

Run တစ်ခုချင်းစီမှာ ၎င်းရဲ့ response time ကို နှိုင်းယှဉ်ဖို့ — request တစ်ခုအတိအကျကို ရွေးပြီး filter လုပ်နိုင်ပါတယ်။

### Type အလိုက် filter လုပ်ခြင်း

Run type တစ်ခုကြားမှာ response time ဘယ်လို ပြောင်းလဲလဲ နှိုင်းယှဉ်ဖို့ — run type အလိုက် filter လုပ်နိုင်ပါတယ်:

* Manual runs တွေကို Postman ထဲမှာ စတင်တာပဲ ဖြစ်ဖြစ် [Postman API](/api-docs/api-reference/monitors/run-monitor/) ကနေ trigger လုပ်တာပဲ ဖြစ်ဖြစ် ပြုလုပ်ပါတယ်။
* Scheduled runs တွေကို — monitor တစ်ခု ဖန်တီးတဲ့အခါ ဒါမှမဟုတ် တည်းဖြတ်တဲ့အခါ ကိုယ် သတ်မှတ်ထားတဲ့ schedule ကနေ စတင်ပါတယ်။
* Webhook runs တွေကို ကိုယ် ဖန်တီးထားတဲ့ integrations တွေကနေ စတင်ပါတယ်။
* Postman CLI runs တွေကို [`postman monitor run` command](/docs/postman-cli/postman-cli-monitoring/#postman-monitor-run) ကနေ trigger လုပ်ပါတယ်။

ရွေးထားတဲ့ filters တွေကို ရှင်းဖို့ dropdown ထဲက **Clear selected** ကို နှိပ်ပါ။

### Run result အလိုက် filter လုပ်ခြင်း

Result တူညီတဲ့ ကိုယ့် runs တွေ ဘယ်လို ကွာခြားခဲ့လဲ နှိုင်းယှဉ်ဖို့ — run results အလိုက် filter လုပ်နိုင်ပါတယ်။ Run တစ်ခုချင်းစီကို ၎င်းရဲ့ result အပေါ် အခြေခံပြီး တံဆိပ်တပ်ပါတယ်:

* **Successful** — ကိုယ့် monitor က ပြဿနာတစ်စုံတစ်ရာ မရှိဘဲ run ကို ပြီးမြောက်ပြီး tests အားလုံး အောင်မြင်ခဲ့ပါတယ်။
* **Failure** — ကိုယ့် monitor က run ကို ပြီးမြောက်ခဲ့ပေမဲ့ — test တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး failed ဖြစ်ခဲ့ပါတယ်။
* **Error** — Error တစ်ခုကြောင့် ကိုယ့် monitor က ၎င်းရဲ့ run ကို ပြီးမြောက်အောင် မလုပ်နိုင်ခဲ့ပါဘူး။ ကိုယ် ရေးထားတဲ့ code ထဲမှာ syntax error တစ်ခု ရှိနေတာ, network error တစ်ခု ဒါမှမဟုတ် တခြား အကြောင်းရင်း အမျိုးမျိုးကြောင့် error တစ်ခု ဖြစ်နိုင်ပါတယ်။ Error တစ်ခု ရတဲ့အခါ — ဘာကြောင့် ဖြစ်လဲ ဖော်ထုတ်ဖို့ ကိုယ့် [Console Log](#console-log) က ကူညီပေးပါလိမ့်မယ်။
* **Abort** — သတ်မှတ်ထားတဲ့ မိနစ် ၁၀ (Postman Free plan) ဒါမှမဟုတ် မိနစ် ၁၅ (Postman paid plans) အတွင်းမှာ run ကို မပြီးမြောက်လို့ — ကိုယ့် monitor က timeout ဖြစ်ခဲ့ပါတယ်။

ရွေးထားတဲ့ filters တွေကို ရှင်းဖို့ dropdown ထဲက **Clear selected** ကို နှိပ်ပါ။

### Region ဒါမှမဟုတ် runner အလိုက် filter လုပ်ခြင်း

ပထဝီဝင် region အများအပြား ဒါမှမဟုတ် networks တစ်လျှောက် API ကျန်းမာရေး ဒါမှမဟုတ် performance ကို နှိုင်းယှဉ်ဖို့ — [regions ဒါမှမဟုတ် runners](/docs/postman/setting-up-monitor) အလိုက် filter လုပ်နိုင်ပါတယ်။

ဒီ feature က — monitor တစ်ခုကို ဖန်တီးတဲ့အခါ ဒါမှမဟုတ် နောက်ဆုံး တည်းဖြတ်တဲ့အခါ regions ဒါမှမဟုတ် runners အများအပြား ရွေးထားရင် ရနိုင်ပါတယ်။

## Time traverse လုပ်ခြင်း

သတ်မှတ်ထားတဲ့ အချိန်တစ်ခုမှာ ဘာတွေ ဖြစ်ခဲ့လဲ နားလည်ဖို့ — အရင်က run results တွေကို ပြန်လည် သုံးသပ်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ — **Individual requests** ကို ရွေးပြီး graph ထဲက **Go to** ကို နှိပ်ပါ။ အချိန်နဲ့ ရက်စွဲကို ရွေးပြီး — run တစ်ခုအတိအကျကို ကြည့်ဖို့ **Apply** ကို နှိပ်ပါ။

အခုနောက်ဆုံး runs တွေဆီ view ကို ပြန်ပြောင်းဖို့ — graph ရဲ့ ဘယ်ဘက်အပေါ် ထောင့်မှာ ကိုယ် သတ်မှတ်ခဲ့တဲ့ အချိန်နဲ့ ရက်စွဲကို ရွေးပြီး **Reset** ကို နှိပ်ပါ။

## Test results တွေ

ဘယ်ဟာတွေ passed ဒါမှမဟုတ် failed ဖြစ်ခဲ့လဲ, response codes တွေ, response times တွေ နဲ့ failed test assertions တွေ အပါအဝင် — ကိုယ့် tests တွေအကြောင်း ပိုပြီး အသေးစိတ် အချက်အလက်တွေ ရဖို့ **All Tests** ကို နှိပ်ပါ။

![Test results](https://assets.postman.com/postman-docs/v12/view-monitor-results-test-v12-01.png)

Request တစ်ခုချင်းစီအတွက် test results တွေအကြောင်း ပိုလေ့လာဖို့ အောက်ပါတွေကို ကြည့်နိုင်ပါတယ်:

* **Region** dropdown list ကနေ region တစ်ခုကို ရွေးပြီး — region တစ်ခုချင်းစီအတွက် test results တွေကို ကြည့်နိုင်ပါတယ်။ ကိုယ့် monitor က region အများအပြားမှာ run လုပ်ဖို့ configure လုပ်ထားရင် — region တစ်ခုခုကို ရွေးနိုင်ပါတယ်။
* **All** tab ကို နှိပ်ပြီး — tests တွေ passed ဒါမှမဟုတ် failed ဖြစ်ခဲ့တဲ့ monitor ထဲက requests အားလုံးကို ကြည့်နိုင်ပါတယ်၊ tests မပါတဲ့ requests တွေအပါအဝင်ပါ။ အဲဒီ category ထဲက tests ပါတဲ့ requests တွေကိုပဲ ကြည့်ဖို့ **Passed**, **Failed** ဒါမှမဟုတ် **Errors** tab ကို နှိပ်ပါ။ အဲဒီ category ထဲက tests အရေအတွက်ကို tab တစ်ခုချင်းစီဘေးမှာ ပြသပေးပါတယ်။
* Request တစ်ခုချင်းစီဘေးမှာ — response code, time နဲ့ size တို့ကို ကြည့်ရှုနိုင်ပါတယ်။ Passed (အစိမ်း) ဒါမှမဟုတ် failed (အနီ) ဖြစ်တဲ့ tests အရေအတွက်ကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။ Request ထဲက tests တွေရဲ့ အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာချက်ကို ကြည့်ဖို့ ဒီနံပါတ်တွေထဲက တစ်ခုပေါ်မှာ mouse ချ (hover) လုပ်ပါ။
* ဘယ် tests တွေ passed ဒါမှမဟုတ် failed ဖြစ်ခဲ့လဲ ကြည့်ဖို့ request တစ်ခုကို နှိပ်ပါ။
* Tab အသစ်တစ်ခုမှာ request ကို ဖွင့်ဖို့ request တစ်ခုရဲ့ နာမည်ကို နှိပ်ပါ။
* ကိုယ့် requests တွေက folder တစ်ခုထဲမှာဆိုရင် — tab အသစ်တစ်ခုမှာ ဖွင့်ဖို့ folder ရဲ့ နာမည်ကို နှိပ်ပါ။

## Errors တွေ

Errors ကြုံခဲ့တဲ့ requests တွေနဲ့ results တွေကို filter လုပ်ဖို့ — **Errors** tab ကို နှိပ်ပါ။ Errors တွေက timeout ဒါမှမဟုတ် TLS handshake error စတဲ့ runtime ပြဿနာတွေကို ဖော်ပြပါတယ်။ User သတ်မှတ်ထားတဲ့ checks တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး (post-request scripts စတာမျိုး) မျှော်လင့်ထားတဲ့အတိုင်း မဖြစ်တဲ့အခါ — failed requests တွေ ဖြစ်ပေါ်ပါတယ်။

Errors ရှိတဲ့ collection run ထဲက requests တွေက — error badge နဲ့ error message နဲ့အတူ run results စာမျက်နှာမှာ ပေါ်ပါတယ်။ Badges တွေက errors တွေကို network, request ဒါမှမဟုတ် script ပြဿနာတွေနဲ့ ဆက်စပ်ကြောင်း ဖော်ပြပါတယ်။

## Console log

Monitor run အသေးစိတ်တွေကို ကြည့်ရှုပြီး ရှာဖွေဖို့ — ကိုယ့် pre-request နဲ့ post-response scripts တွေရဲ့ အစိတ်အပိုင်းအဖြစ် Postman Console ထဲမှာ run လုပ်တဲ့ [`console.log`](/docs/use/send-requests/response-data/troubleshooting-api-requests/) statements တွေနဲ့အတူ **Console Log** tab ကို နှိပ်ပါ။ Run details တွေက — run ပြင်ဆင်ခြင်း, run လုပ်ခြင်း, ပြန် run လုပ်ခြင်း ([သက်ဆိုင်ရင်](/docs/postman/setting-up-monitor)) နဲ့ run result စတဲ့ monitor run တစ်ခုရဲ့ အဆင့်အမျိုးမျိုးကို — error နဲ့ test failure အချက်အလက်တွေနဲ့အတူ သတ်မှတ်ပေးပါတယ်။ Console log ထဲက request တစ်ခုကို နှိပ်လိုက်ရင် — အဲဒါကို tab တစ်ခုမှာ ဖွင့်ပေးပြီး လိုအပ်သလို request ကို ပြန်သုံးသပ်, တည်းဖြတ်နိုင်ပါတယ်။

ကိုယ့် monitor က region အများအပြားမှာ run လုပ်ဖို့ configure လုပ်ထားရင် — **Runner** menu ထဲမှာ region တစ်ခုခုကို ရွေးနိုင်ပါတယ်။

![Console log](https://assets.postman.com/postman-docs/v12/monitor-view-console-log-v12-01.png)

ပြဿနာတွေကို troubleshoot လုပ်ဖို့ရော run တစ်ခုချင်းစီရဲ့ အပြုအမူအကြောင်း ပိုလေ့လာဖို့ရော Console ကို သုံးနိုင်ပါတယ်။

Console log ရဲ့ search feature နဲ့ — သတ်မှတ်ထားတဲ့ strings တွေကို ရှာဖွေနိုင်ပါတယ်။ Searching က log ကို ကိုယ်တိုင် scan လုပ်မယ့်အစား — error messages တွေနဲ့ codes တွေကို အလိုအလျောက် highlight လုပ်ပြီး ဖြတ်သန်း ကြည့်ရှုနိုင်စေပါတယ်။

Matches တွေကို log ထဲမှာ highlight လုပ်ပေးပြီး — သူတို့ကြားမှာ ဖြတ်သန်းဖို့ ![Down Large icon](https://assets.postman.com/postman-docs/aether-icons/v12/direction-down-large.svg#icon) **Next match** နဲ့ ![Up Large icon](https://assets.postman.com/postman-docs/aether-icons/v12/direction-up-large.svg#icon) **Previous match** ကို နှိပ်နိုင်ပါတယ်။ Search field နဲ့ results တွေကို ရှင်းဖို့ ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-close-stroke.svg#icon) **Clear search** ကို နှိပ်ပါ။

**Monitor run logs တွေကို ခြောက်လ ကာလတစ်ခုအတွက် သိမ်းဆည်းထားပါတယ်။** Retention period ပြင်ပက monitor run တစ်ခုကို ရွေးထားရင် — failed tests နဲ့ errors အရေအတွက်ကိုတော့ ကြည့်လို့ ရပါတယ်။ တခြား monitor run အသေးစိတ်တွေကတော့ ရနိုင်တော့မှာ မဟုတ်ပါဘူး။ ဒီအချက်အလက်တွေ တောင်းခံဖို့ — [Postman support](https://www.postman.com/support/) ကို ဆက်သွယ်ပါ။

## Monitor history

Sidebar ထဲက ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **History** ကို နှိပ်ပြီး — monitor တစ်ခုရဲ့ history ကို ကြည့်ရှုနိုင်ပါတယ်။

Monitor တစ်ခုကို ဘယ်အချိန်မှာ ဖန်တီးခဲ့လဲ, တည်းဖြတ်ခဲ့လဲ, pause လုပ်ခဲ့လဲ ဒါမှမဟုတ် ပြန် run စေခဲ့လဲ နဲ့ action တစ်ခုချင်းစီကို ဘယ် team member က လုပ်ဆောင်ခဲ့လဲ — သိဖို့ ဒီ logs တွေကို စစ်ဆေးနိုင်ပါတယ်။

## Monitor details တွေ

ညာဘက် sidebar ထဲက ![Info icon](https://assets.postman.com/postman-docs/aether-icons/v12/state-info-stroke.svg#icon) **Monitor details** ကို နှိပ်ပြီး — monitor တစ်ခုအကြောင်း အသေးစိတ်တွေကို ကြည့်ရှုနိုင်ပါတယ်။ Monitor တစ်ခုရဲ့ ID, creator, ဖန်တီးခဲ့တဲ့ ရက်စွဲနဲ့ အချိန်, collection, environment နဲ့ integration options တွေကို ကြည့်နိုင်ပါတယ်။

## Troubleshooting လုပ်ခြင်း

[ကိုယ့် monitors တွေကို troubleshoot လုပ်နည်း](/docs/postman/troubleshooting-monitors) ကို လေ့လာပြီး — [Postman monitoring FAQs](/docs/postman/monitor-faqs) တွေကိုလည်း ကြည့်ပါ။
