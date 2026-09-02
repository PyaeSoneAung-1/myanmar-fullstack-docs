---
title: "Postman မှာ Monitor တစ်ခု Setup လုပ်ခြင်း (Set up a Monitor in Postman)"
description: "Monitor တစ်ခု ဖန်တီး configure လုပ်နည်း — collection ရွေးချယ်ခြင်း, schedule သတ်မှတ်ခြင်း, regions/runners, notifications, advanced settings နဲ့ monitor စီမံခန့်ခွဲခြင်း"
order: 25
source: "https://learning.postman.com/docs/monitoring-your-api/setting-up-monitor/"
status: translated
updated: 2026-09-02
---

Monitor တစ်ခုကို ဖန်တီးပြီး — ကိုယ့် API ရဲ့ health ကို စဉ်ဆက်မပြတ် စစ်ဆေးနိုင်၊ responses တွေ မှန်ကန်မှု ရှိမရှိ validate လုပ်နိုင်၊ ပြီးတော့ အရေးကြီးတဲ့ workflows တွေအတွက် tests တွေ run နိုင်ပါတယ်။ Monitors တွေက ကိုယ့် collection ကို schedule တစ်ခုအရ run ပေးတာကြောင့် — အချိန်ကြာလာတာနဲ့အမျှ failures နဲ့ performance ပြဿနာတွေကို ရှာဖွေတွေ့ရှိနိုင်ပါတယ်။ Postman CLI နဲ့ runs တွေကို trigger လုပ်ပြီး monitors တွေကို ကိုယ့် CI/CD workflows ထဲမှာလည်း ပေါင်းစပ်နိုင်ပါတယ်။

Monitors တွေကို ပုံမှန်အားဖြင့် — test တစ်ခု ကျဆုံးတဲ့အခါ team ကို အကြောင်းကြားတာလိုမျိုး စဉ်ဆက်မပြတ် validation နဲ့ alerting အတွက် သုံးပါတယ်။ Alerts တွေ မလိုဘဲ collection runs တွေကိုပဲ schedule လုပ်ချင်ရင် — [Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/) ကို သုံးနိုင်ပါတယ်။

ကိုယ့် [workspace ကို Git repository တစ်ခုနဲ့ ချိတ်ဆက်ထားပြီး](https://learning.postman.com/docs/use/native-git/overview/) team က Enterprise plan ပေါ်မှာဆိုရင် — API Catalog ထဲမှာ ကိုယ့် monitor ရဲ့ performance တွေကို ကြည့်ရှုနိုင်ပါတယ်။ ပိုလေ့လာချင်ရင် [API Catalog အကြောင်း](https://learning.postman.com/docs/api-catalog/overview/) နဲ့ [Test tab](https://learning.postman.com/docs/api-catalog/explore#test) ကို ကြည့်ပါ။ API Catalog ထဲမှာ ကိုယ့် monitors တွေရဲ့ pass/fail status, response times နဲ့ run history တွေကို စစ်ဆေးပြီး — ကိုယ့် APIs တွေမှာရှိတဲ့ ပြဿနာတွေကို ရှာဖွေ troubleshoot လုပ်ဖို့ သုံးနိုင်ပါတယ်။

Monitoring ရလဒ်တွေ API Catalog ထဲမှာ ပေါ်ဖို့ဆိုရင် — monitor က system environment တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ environment တစ်ခုနဲ့ ဆက်စပ်နေရပါမယ်။ ဒါက development lifecycle ရဲ့ အဆင့်အမျိုးမျိုး (ဥပမာ — testing နဲ့ production) အပေါ် အခြေခံပြီး monitoring ရလဒ်တွေကို categorize လုပ်ပြီး filter လုပ်နိုင်စေပါတယ်။ အသေးစိတ်ကို [Monitor တစ်ခု configure လုပ်ခြင်း](#monitor-တစ်ခု-configure-လုပ်ခြင်း) မှာ ကြည့်ပါ။

API Catalog ထဲက monitoring ရလဒ်တွေကို ဝင်ရောက်ခွင့်က workspace-level permissions တွေအပေါ် အခြေခံပါတယ်။ Monitor တည်ရှိတဲ့ workspace ကို access ရှိတဲ့ users တွေပဲ — API Catalog ထဲမှာ သူ့ရဲ့ ရလဒ်တွေကို ကြည့်ရှုနိုင်ပါတယ်။

## Supported request types (ပံ့ပိုးပေးထားသော request အမျိုးအစားများ)

Monitors တွေက HTTP, GraphQL နဲ့ gRPC requests တွေကို run ပေးပါတယ်။ GraphQL နဲ့ gRPC requests တွေအတွက် ပံ့ပိုးမှုက **beta** အဆင့်မှာ ရှိပါတယ်။

GraphQL နဲ့ gRPC requests တွေ ပါဝင်နိုင်တဲ့ collection တစ်ခု ဖန်တီးနည်းကို [collection အသစ်တစ်ခု ဖန်တီးခြင်း](/docs/postman/create-collections) မှာ ကြည့်ပါ။

## Monitor တစ်ခု ဖန်တီးခြင်း

Sidebar ကနေ ဒါမှမဟုတ် collection တစ်ခုကို ရွေးပြီး monitor အသစ်တစ်ခု ဖန်တီးနိုင်ပါတယ်။ Sidebar ကနေ monitor အသစ် ဖန်တီးဖို့:

1. **Services** ကို နှိပ်ပါ။
2. **+** (Add) ကို နှိပ်ပြီး dropdown စာရင်းထဲက **Monitor** ကို ရွေးပါ။
3. ကိုယ့် monitor အသစ်ကို [configure](#monitor-တစ်ခု-configure-လုပ်ခြင်း) လုပ်ပါ။

Collection တစ်ခုကနေ monitor ဖန်တီးဖို့:

1. **Items** tab ကို နှိပ်ပါ။
2. Sidebar ထဲက **Collections** ကို ချဲ့ပါ။
3. Collection တစ်ခုပေါ်မှာ mouse ချပြီး **View more actions > More > Create monitor** ကို နှိပ်ပါ။
4. ကိုယ့် monitor အသစ်ကို [configure](#monitor-တစ်ခု-configure-လုပ်ခြင်း) လုပ်ပါ။

Postman API ကို သုံးပြီးလည်း monitor ဖန်တီးလို့ရပါတယ်။ ပိုလေ့လာချင်ရင် [Postman API documentation](https://learning.postman.com/api-docs/api-reference/monitors/create-monitor/) ကို ကြည့်ပါ။

## Monitor တစ်ခု configure လုပ်ခြင်း

Monitor အသစ်ကို configure လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. **Monitor name** တစ်ခု ထည့်ပြီး monitor က run စေချင်တဲ့ **Collection** ကို ရွေးပါ။ Monitor ဖန်တီးတဲ့ နည်းလမ်းပေါ် မူတည်ပြီး collection က အရင်ကတည်းက ရွေးပြီးသား ဖြစ်နေနိုင်ပါတယ်။

   Monitors တွေက OAuth 2.0 authentication ကို မပံ့ပိုးပါဘူး။ Monitors တွေနဲ့ OAuth 2.0 token သုံးနည်းကို [OAuth 2.0 overview](https://learning.postman.com/docs/use/send-requests/authorization/oauth-20/#oauth-20-overview) မှာ ကြည့်ပါ။

2. Collection မှာ tags အများကြီး ရှိရင် — သုံးမယ့် **Collection tag** ကို ရွေးပါ။ (Postman v10 နဲ့ နောက်ပိုင်းမှာ collections တွေအတွက် release tags တွေကို ဖန်တီးလို့မရတော့ပါဘူး။)
3. Monitor က environment တစ်ခု သုံးစေချင်ရင် **Environment** တစ်ခု ရွေးပါ။

   Monitors တွေက Postman cloud မှာ run တာကြောင့် — [body data](https://learning.postman.com/docs/use/send-requests/create-requests/parameters/) ပို့ဖို့ ကိုယ့် local [working directory](https://learning.postman.com/docs/getting-started/installation/settings/working-directory/) ထဲက files တွေ သုံးတဲ့ requests တွေကို မပံ့ပိုးပါဘူး။ အဲဒီအစား — cloud ထဲမှာ monitors တွေ သုံးနိုင်ဖို့ ကိုယ့် [test data files](/docs/postman/test-data) တွေကို upload လုပ်ပါ။

4. (ထည့်စရာမလို) **Dataset** အောက်မှာ — monitor run အတွက် test data အဖြစ် သုံးဖို့ ရှိပြီးသား dataset နဲ့ view တစ်ခု ရွေးပါ ဒါမှမဟုတ် CSV/JSON file တစ်ခု ပေးဖို့ **Upload a datafile** ကို နှိပ်ပါ။ Datasets တွေက ကိုယ့် data တွေကို define လုပ်ပြီး — views တွေက အဲဒီ data တွေကို ဘယ်လို ပြန်ယူမလဲ ထိန်းချုပ်ပါတယ်။ [monitor တစ်ခုနဲ့ dataset သုံးခြင်း](https://learning.postman.com/docs/monitoring-your-api/test-data/monitors-datasets/) နဲ့ [monitor တစ်ခုနဲ့ data file သုံးခြင်း](https://learning.postman.com/docs/monitoring-your-api/test-data/monitors-data-files/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

5. **Run** အောက်မှာ — monitor ကို schedule တစ်ခုအရ run စေမလား၊ Postman CLI က trigger လုပ်မှပဲ run စေမလား ရွေးပါ။ **Schedule** ကို ရွေးရင် — ပထမ dropdown စာရင်းကနေ timer increment တစ်ခု ရွေးပြီး နောက် dropdown ကနေ timer ရဲ့ frequency ကို ရွေးပါ (ဥပမာ — ၅ မိနစ်တိုင်း ဒါမှမဟုတ် တနင်္လာနေ့တိုင်း မနက် ၁ နာရီ)။ **Postman CLI** ကို ရွေးရင် — monitor ဖန်တီးပြီးတာနဲ့ CLI install လုပ်ဖို့နဲ့ monitor run လုပ်ဖို့ commands တွေကို Postman က ပြသပေးပါတယ်။ အသေးစိတ်ကို [Monitors run ခြင်း](#monitors-run-လုပ်ခြင်း) မှာ ကြည့်ပါ။
6. **Runner** အောက်မှာ — monitor ကို ဘယ်မှာ run စေချင်လဲ dropdown စာရင်းကနေ ရွေးပါ။ Postman က runner တစ်ခုကို အလိုအလျောက် ရွေးပေးဖို့ **Auto-select** ကို ရွေးနိုင်သလို — ကိုယ့် requests တွေကို ဘယ်ကနေ [monitor လုပ်မလဲ သတ်မှတ်ဖို့](#regions-နဲ့-runners-တွေ-configure-လုပ်ခြင်း) **Private** ဒါမှမဟုတ် **Cloud** sections တွေကနေ runner တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရွေးနိုင်ပါတယ်။ လိုချင်တဲ့ runner က စာရင်းထဲမှာ မရှိရင် — setup လုပ်ဖို့ **Add Runner** ကို နှိပ်ပါ။
7. Failure နဲ့ error [notifications](#monitor-notifications-ရယူခြင်း) တွေကို email, Slack ဒါမှမဟုတ် Microsoft Teams ကနေ ရယူဖို့ ရွေးချယ်နိုင်ပါတယ်။

   * ကိုယ့် ဒါမှမဟုတ် team member တစ်ယောက်ရဲ့ email address ဆီ notifications ပို့စေချင်ရင် — **Notifications** အောက်မှာ **Receive email notifications for run failures and errors** checkbox ကို ရွေးပါ။ Teammates အများဆုံး ငါးယောက်ကို နာမည် ဒါမှမဟုတ် profile picture နဲ့ ရှာပြီး ရွေးပါ၊ ဒါမှမဟုတ် email address တစ်ခု ရိုက်ပြီး team ထဲမပါတဲ့သူကို အကြောင်းကြားဖို့ **Create "[email]"** ကို ရွေးပါ — ပြီးရင် notifications မပို့တော့ခင် ဆက်တိုက် failure ဘယ်နှစ်ကြိမ် ဖြစ်ရင် trigger လုပ်မလဲ သတ်မှတ်ပါ။
   * Slack channel တစ်ခုဆီ notifications ပို့စေချင်ရင် — **Notify a Slack or Microsoft Teams channel or chat** ကို ရွေးပါ။ **Connect Slack** ကို နှိပ်ပြီး [notifications](#monitor-notifications-ရယူခြင်း) တွေ လက်ခံမယ့် channel တစ်ခု ရွေးပါ။ Slack ထဲ sign in လုပ်ဖို့ တောင်းဆိုတဲ့ browser tab တစ်ခု ဖွင့်ပါတယ်။ **Continue** ကို နှိပ်ပြီး — ကိုယ့် workspace URL ထည့်ကာ email ဒါမှမဟုတ် SSO နဲ့ sign in လုပ်ပါ။

   Team ထဲက တစ်ယောက်ယောက်က Slack အတွက် [installed app](https://learning.postman.com/docs/integrations/installed-apps/) တစ်ခု ဖန်တီးထားတာ ဒါမှမဟုတ် [Slack channel တစ်ခု ချိတ်ဆက်ထားတာ](https://learning.postman.com/docs/integrations/available-integrations/slack/slack-monitoring/) ရှိရင် — message တစ်ခုနဲ့ အစိမ်းရောင် checkmark က ကိုယ့် Slack workspace နဲ့ ချိတ်ဆက်ပြီးသားဆိုတာ အသိပေးပါတယ်။ နောက်တစ်ကြိမ် sign in လုပ်ဖို့ ဒါမှမဟုတ် permissions တွေ ပြန်ကြည့်ဖို့ မလိုပါဘူး။

   * Microsoft Teams channel တစ်ခု ဒါမှမဟုတ် group chat တစ်ခုဆီ notifications ပို့စေချင်ရင် — **Notify a Slack or Microsoft Teams channel or chat** ကို ရွေးပါ။ **Connect Microsoft Teams** ကို နှိပ်ပါ။ Microsoft site ပေါ်မှာ authorization ပြီးမြောက်ဖို့ redirect လုပ်ခံနေရတယ်ဆိုတဲ့ warning ပါတဲ့ browser tab တစ်ခု ဖွင့်ပါတယ်။ **Continue** ကို နှိပ်ပါ။ App ကို Teams ထဲမှာ မှန်ကန်စွာ configure လုပ်ထားရင် authorization က အောင်မြင်ပြီး Postman ဆီ ပြန် redirect လုပ်ပါတယ်။ Postman ထဲမှာ [notifications](#monitor-notifications-ရယူခြင်း) တွေ လက်ခံမယ့် channel ဒါမှမဟုတ် group chat တစ်ခု ရွေးပါ။

   Postman ကနေ [Microsoft Teams ကို ပထမဆုံးအကြိမ် ချိတ်ဆက်တဲ့အခါ](https://learning.postman.com/docs/integrations/available-integrations/teams/teams-monitoring/) — ကိုယ့် Microsoft Teams admin က Postman app ကို approve လုပ်ဖို့ prompt လုပ်ပါတယ်။ App ကို approve မလုပ်ရသေးရင် Teams ကို ချိတ်ဆက်လို့မရပါဘူး။ ကိုယ့် Postman team ကနေ user တစ်ယောက်အတွက် app ကို approve လုပ်ပြီးတာနဲ့ — team ရဲ့ members အားလုံးအတွက်ပါ approve ဖြစ်သွားပါတယ်။

8. (ထည့်စရာမလို) အောက်ပါ **Advanced Settings** တွေထဲက လိုအပ်တာတွေကို ရွေးပြီး values တွေ သတ်မှတ်ပါ:

   * **[Retry if run fails (ဒါက ကိုယ့် billing ကို သက်ရောက်နိုင်ပါတယ်)](#failure-ဖြစ်ရင်-retry-လုပ်ခြင်း)**
   * **[Set request timeout](#request-timeouts-ထည့်ခြင်း)**
   * **[Set delay before requests](#requests-မတိုင်ခင်-delay-တွေ-ထည့်ခြင်း)**
   * **[Follow redirects](#redirect-behavior-စီမံခန့်ခွဲခြင်း)**
   * **[Enable SSL validation](#ssl-validation-ပိတ်ခြင်း)**

Postman က team နဲ့ user actions အမျိုးမျိုးအတွက် limits တွေ ထားရှိပြီး — monitor ဖန်တီးခြင်းလည်း အပါအဝင်ပါ။ အသေးစိတ်ကို [Monitor activity limits](https://learning.postman.com/docs/monitoring-your-api/monitor-usage/#monitor-activity-limits) မှာ ကြည့်ပါ။

## Monitors run လုပ်ခြင်း

**Run** အောက်မှာ — monitor ကို schedule တစ်ခုအရ run စေချင်လား ဒါမှမဟုတ် Postman CLI က trigger လုပ်မှပဲ run စေချင်လား ရွေးပါ:

* **Schedule** ကို ရွေးပြီး — Postman က monitor ကို ဘယ်နှစ်ကြိမ် run မလဲ သတ်မှတ်ပါ။ Status page တစ်ခုအတွက်ဆို ငါးမိနစ်တိုင်းလောက်အထိ မကြာခဏ ဖြစ်နိုင်သလို — ကိုယ့် endpoints တွေမှာ အခြေခံ check တစ်ခုအနေနဲ့ တစ်ပတ် ဒါမှမဟုတ် တစ်လ တစ်ခါလောက်လည်း ဖြစ်နိုင်ပါတယ်။
* **Postman CLI** ကို ရွေးပြီး — Postman CLI က trigger လုပ်မှသာ monitor ကို run စေနိုင်ပါတယ်။ ဒါက Postman CLI install လုပ်ဖို့နဲ့ monitor ရဲ့ ID ကို သုံးပြီး run လုပ်ဖို့ commands တွေကို ပြသပေးပါတယ်။ Postman CLI ကို သုံးပြီး ကိုယ့် CI/CD pipeline ထဲမှာ monitors တွေ run လုပ်နိုင်ပြီး — ကိုယ့် Postman tests တွေကို သုံးကာ regressions နဲ့ configuration ပြဿနာတွေကို team က ဖမ်းမိနိုင်ပါတယ်။ [Postman CLI နဲ့ monitor run လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-run-monitor/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Scheduled နဲ့ on-demand monitors တွေကို သုံးပြီး ကိုယ့် APIs တွေရဲ့ health တွေကို စဉ်ဆက်မပြတ် validate လုပ်နည်းအတွက် Postman နဲ့ [API observability အတွက် best practices](https://www.postman.com/postman-best-practices/api-observability/) ကို ကြည့်ပါ။

Minute-based monitor runs တွေကို schedule လုပ်နိုင်တာ paid plans တွေမှာပဲ ဖြစ်ပါတယ်။ Enterprise plans တွေမှာတော့ — တစ်မိနစ်တိုင်း run တဲ့ minute-based monitor runs တွေကို schedule လုပ်နိုင်ပါတယ်။

## Regions နဲ့ runners တွေ configure လုပ်ခြင်း

Postman Monitors တွေက runners တွေပေါ်မှာ run ပါတယ် — runners တွေက ကိုယ့် collection နဲ့ tests တွေကို run ပေးတဲ့သူတွေပါ။ ပုံမှန်အားဖြင့် Postman က ကိုယ့် monitor အတွက် runner တစ်ခုကို အလိုအလျောက် ရွေးပေးပါတယ်။

ကိုယ့် organization ရဲ့ လိုအပ်ချက်ပေါ် မူတည်ပြီး — monitor run မယ့် [regions တွေကို ကိုယ်တိုင်လည်း ရွေးနိုင်ပါတယ်](#monitors-တွေကို-region-အမျိုးမျိုးမှာ-run-လုပ်ခြင်း)။ Public APIs တွေအတွက်ဆိုရင် — region အမျိုးမျိုးမှာရှိတဲ့ [Postman-hosted runners တွေကို ရွေးနိုင်ပြီး](#monitors-တွေကို-region-အမျိုးမျိုးမှာ-run-လုပ်ခြင်း) — internal APIs တွေအတွက်ဆိုရင် ကိုယ့် network ထဲက runners တွေပေါ်မှာ monitor run ဖို့ [Private API Monitoring](#runners-တွေနဲ့-internal-apis-တွေကို-monitor-လုပ်ခြင်း) ကို သုံးနိုင်ပါတယ်။

### Monitors တွေကို region အမျိုးမျိုးမှာ run လုပ်ခြင်း

ကိုယ့် users တွေ ဒါမှမဟုတ် infrastructure တွေနဲ့ ပိုနီးတဲ့ နေရာတွေကနေ APIs တွေကို test လုပ်ဖို့ — specific regions တွေကနေ monitors တွေ run လုပ်နိုင်ပါတယ်။ ဥပမာ — ကိုယ့် users တွေရှိတဲ့ region ကနေပဲ monitor လုပ်ပြီး သူတို့ရဲ့ experience ကို ပိုတိကျစွာ ထင်ဟပ်စေနိုင်သလို — ကိုယ့် services တွေ deploy ထားတဲ့ နေရာကနေ စောစီးစွာ ပြဿနာတွေ ရှာဖွေနိုင်ပါတယ်။

Region အများအပြားကိုလည်း ရွေးပြီး — locations အမျိုးမျိုးကြားမှာ performance တွေ နှိုင်းယှဉ်ကာ ကိုယ့် API ရဲ့ health ကို ပိုပြည့်စုံတဲ့ မြင်ကွင်းနဲ့ ကြည့်ရှုနိုင်ပါတယ်။

Region တစ်ခုဘေးက ဂဏန်းက — အဲဒီ region ကနေ run နေတဲ့ ကိုယ့် monitors အရေအတွက်ကို ဖော်ပြပါတယ်။

Postman က အောက်ပါ regions တွေကို ပံ့ပိုးပါတယ်:

* Africa (Cape Town)
* Asia Pacific
* Asia Pacific (Hong Kong)
* Asia Pacific (Jakarta)
* Asia Pacific (Seoul)
* Australia (Sydney)
* Canada (Central)
* Europe (Central)
* Europe (Ireland)
* Europe (Milan)
* Europe (Paris)
* Europe (Stockholm)
* India (Mumbai)
* Japan (Osaka)
* Japan (Tokyo)
* South America
* United Kingdom
* US (East)
* US (West)
* US East (Ohio)

ရွေးထားတဲ့ region တစ်ခုစီက — ကိုယ့် schedule အတိုင်း monitor ကို run ပြီး ကိုယ့် [monitor usage](https://learning.postman.com/docs/monitoring-your-api/monitor-usage/#view-monitor-usage) ထဲမှာ ရေတွက်ပါတယ်။

### Runners တွေနဲ့ internal APIs တွေကို monitor လုပ်ခြင်း

Private API Monitoring က Postman Enterprise plans တွေမှာ ရပါတယ်။ အသေးစိတ်ကို [pricing page](https://www.postman.com/pricing/) မှာ ကြည့်ပါ။

[Private API Monitoring](https://learning.postman.com/docs/monitoring-your-api/runners/overview/) နဲ့ — အများသိအောင် ဖွင့်မထားတဲ့ (publicly accessible မဟုတ်တဲ့) APIs တွေကို monitor လုပ်ဖို့ ကိုယ့် internal network ထဲမှာ runners တွေ setup လုပ်နိုင်ပါတယ်။ ဒါက endpoints တွေကို public internet ပေါ် မဖော်ထုတ်ဘဲ — security နဲ့ compliance လိုအပ်ချက်တွေကို လိုက်နာရင်း ကိုယ့် internal network ကနေ monitors တွေ run နိုင်စေပါတယ်။ ရလဒ်တွေကို Postman cloud ဆီ ပို့ပေးပါတယ်။

### Static IPs တွေ သုံးခြင်း

Static IPs တွေက Postman Enterprise plans တွေမှာ ရပါတယ်။ အသေးစိတ်ကို [pricing page](https://www.postman.com/pricing/) မှာ ကြည့်ပါ။

IP allowlists ဒါမှမဟုတ် firewall rules တွေနဲ့ ကာကွယ်ထားတဲ့ APIs တွေကို monitor လုပ်ဖို့ static IPs တွေ သုံးနိုင်ပါတယ်။

Postman က အောက်ပါ regions တွေအတွက် static IP addresses တွေကို ပံ့ပိုးပါတယ်:

* US (East)
* US (West)

[Static IPs တွေသုံးပြီး APIs တွေကို monitor လုပ်နည်း](https://learning.postman.com/docs/monitoring-your-api/using-static-IPs-to-monitor/) ကို လေ့လာနိုင်ပါတယ်။

## Monitor notifications ရယူခြင်း

Monitor တစ်ခု configure လုပ်တဲ့အခါ — monitor run failures နဲ့ errors တွေအတွက် email, Slack နဲ့ Microsoft Teams notifications တွေ လက်ခံဖို့ ရွေးနိုင်ပါတယ်။

Email notifications ကို ရွေးရင် — notifications လက်ခံမယ့် email recipients အများဆုံး ငါးယောက်အထိ ထည့်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် Postman က ဆက်တိုက် failure သုံးကြိမ် ဖြစ်ပြီးနောက်မှာ failure notifications ပို့တာ ရပ်လိုက်ပါတယ်။ Monitor တစ်ခု failure ဖြစ်တဲ့အခါ emails ပိုလိုတာ ဒါမှမဟုတ် လျှော့လိုတာ ရှိရင် — တခြား value တစ်ခု သတ်မှတ်နိုင်ပါတယ်။ Monitor run တစ်ခု အောင်မြင်တာနဲ့ — monitor ပြန်ကောင်းသွားပြီဆိုတာ အသိပေးဖို့ Postman က email notification တစ်ခု ပို့ပါတယ်။ သတိပြုရမှာက — monitor failure အရေအတွက်က consecutive failure limit ထက် နည်းနေရင် — monitor အောင်မြင်တဲ့အခါ recovery email ကို မရပါဘူး။

Active monitors တွေရဲ့ daily နဲ့ weekly summaries တွေကို email နဲ့ ရပါတယ်။ Daily ဒါမှမဟုတ် weekly summaries တွေကို မလိုချင်ရင် — Postman header ထဲက **Notifications** ကို နှိပ်ပြီး **Manage notifications** ကို ရွေးပါ။

Slack channel တစ်ခု ဒါမှမဟုတ် Microsoft Teams channel/group chat တစ်ခုကို ချိတ်ဆက်ဖို့ ရွေးရင် — monitor run failure နဲ့ error notifications တွေ ပို့မယ့် သက်ဆိုင်ရာ channel ကို ရွေးနိုင်ပါတယ်။ Monitor တစ်ခုကနေ Slack ဒါမှမဟုတ် Microsoft Teams ကို ချိတ်ဆက်ပြီးတာနဲ့ — အဲဒီ monitor အတွက် notifications တွေ စာရင်းသွင်းပြီးပြီဆိုတဲ့ confirmation တစ်ခုကို ရွေးထားတဲ့ channel ထဲမှာ ရပါတယ်။ Run တိုင်းပြီးတိုင်း notifications ပို့နိုင်သလို — ဆက်တိုက် failure သုံးကြိမ်နဲ့ အဲဒီနောက် ပထမဆုံး အောင်မြင်တဲ့ run အတွက်လည်း ပို့နိုင်ပါတယ်။ [Postman Monitor ရလဒ်တွေကို Slack ဒါမှမဟုတ် Microsoft Teams ဆီ ပို့ခြင်း](https://learning.postman.com/docs/monitoring-your-api/setting-up-monitor/#configure-a-monitor) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Advanced settings (အဆင့်မြင့် ဆက်တင်များ)

ကိုယ့် monitor ကို configure လုပ်ဖို့ advanced settings တွေကို ရွေး ဒါမှမဟုတ် သတ်မှတ်နိုင်ပါတယ်။

### Failure ဖြစ်ရင် retry လုပ်ခြင်း

Failure ဒါမှမဟုတ် error ဖြစ်ပြီးနောက် monitor ကို နောက်တစ်ကြိမ် run စေချင်ရင် — **Retry if run fails** option ကို ရွေးပါ။ ဒါကို ဖွင့်ထားရင် Postman က ကျဆုံးခဲ့တဲ့ request ကို အလိုအလျောက် နောက်တစ်ကြိမ် run ပေးပါတယ်။ ဒါက transient (ယာယီ) ပြဿနာတွေကြောင့် false alarms တွေ မဖြစ်အောင် ကူညီနိုင်ပါတယ်။ Postman က ကနဦး failure ကို log လုပ်ပြီး — run က ဆက်ပြီး failure ဖြစ်နေရင် အသိပေးပါတယ်။

ဒီ option ကို ဖွင့်ထားတာက ကိုယ့် [monitor usage](https://learning.postman.com/docs/monitoring-your-api/monitor-usage/#view-monitor-usage) ကို သက်ရောက်နိုင်ပါတယ်။ ဥပမာ — request သုံးခုပါတဲ့ collection တစ်ခုမှာ ပထမ request က failure ဖြစ်ပြီး retry လုပ်တဲ့အခါ အောင်မြင်သွားရင် — အဲဒီ run က စုစုပေါင်း request လေးခုအဖြစ် ရေတွက်ပါတယ်။

### Request timeouts ထည့်ခြင်း

ကိုယ့် requests အားလုံး သတ်မှတ်ထားတဲ့ အချိန်အတွင်းမှာ run ပြီးစေချင်ရင် — **Set request timeout** ကို ရွေးနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် monitor run တစ်ခုချင်းစီမှာ timeout ၁၀ မိနစ် (Postman Free plan) ဒါမှမဟုတ် ၁၅ မိနစ် (Postman paid plans) ရှိပါတယ်။ ဒီ timeout values တွေက monitor run တစ်ခုလုံးကို သက်ရောက်ပြီး — HTTP requests, responses, pre-request scripts နဲ့ post-response scripts အားလုံး အပါအဝင်ပါ။

Postman Free plan နဲ့ဆိုရင် monitor timeout က ၁၀ မိနစ် (600000 ms) ထက် မကျော်နိုင်ပါဘူး။ Postman paid plans တွေနဲ့ဆိုရင် monitor timeout က ၁၅ မိနစ် (900000 ms) ထက် မကျော်နိုင်ပါဘူး။

### Requests မတိုင်ခင် delay တွေ ထည့်ခြင်း

**Set delay before requests** ကို ဖွင့်ထားရင် — collection ထဲက request တစ်ခုချင်းစီ မတိုင်ခင် delay တစ်ခု ထည့်ပေးပါတယ်။ Request တစ်ခုချင်းစီအတွက် delay ကို သပ်သပ်ရေ configure လုပ်ချင်ရင် — ကိုယ့် [pre-request ဒါမှမဟုတ် post-response scripts](/docs/postman/intro-to-scripts) တွေထဲမှာ `setTimeout()` ကို သုံးပြီး delay တစ်ခု ထည့်နိုင်ပါတယ်။

Postman Free plan နဲ့ဆိုရင် requests မတိုင်ခင် delay က ၁၀ မိနစ် (600000 ms) ထက် မကျော်နိုင်ပါဘူး။ Postman paid plans တွေနဲ့ဆိုရင် ၁၅ မိနစ် (900000 ms) ထက် မကျော်နိုင်ပါဘူး။ ဒီ values တွေက monitor တစ်ခုရဲ့ အများဆုံး runtime နဲ့ အတူတူပဲ ဖြစ်တာ သတိပြုပါ။

### Redirect behavior စီမံခန့်ခွဲခြင်း

**Follow redirects** option က ပုံမှန်အားဖြင့် ရွေးထားပြီးသားပါ။ ဖွင့်ထားတဲ့အခါ — monitor က HTTP redirects တွေကို အလိုအလျောက် လိုက်ပြီး redirected URL ဆီ requests တွေ ပို့ပါတယ်။

### SSL validation ပိတ်ခြင်း

**Enable SSL validation** option က ပုံမှန်အားဖြင့် ဖွင့်ထားပါတယ်။ Self-signed certificates တွေ သုံးနေပြီး SSL certificates တွေရဲ့ validation တွေကို ရပ်တန့်စေချင်ရင် SSL validation ကို ပိတ်နိုင်ပါတယ်။ အသေးစိတ်ကို [Certificates တွေနဲ့ အလုပ်လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/authorization/certificates/) နဲ့ [SSL Certificate & Server Connection ပြဿနာတွေ troubleshoot လုပ်နည်း](https://blog.postman.com/self-signed-ssl-certificate-troubleshooting/) မှာ ကြည့်ပါ။

## Monitors တွေ ဘယ်လို run လဲ

Monitor တစ်ခု run တဲ့အခါ — collection ထဲမှာ သတ်မှတ်ထားတဲ့အတိုင်း collection ထဲက requests တွေက အစဉ်လိုက် run ပါတယ်။ Monitors တွေက requests တွေကို parallel (အပြိုင်) run မလုပ်ပါဘူး။

Monitor run တစ်ခု မပြီးသေးဘဲ နောက်တစ်ခု စတင်ဖို့ အချိန်ကျလာရင် — လက်ရှိ run ပြီးတဲ့အထိ run အသစ်က မစတင်ပါဘူး။ Requests တွေက မျှော်လင့်ထားတာထက် ကြာနေရင် — ဒါက runs တွေကြားမှာ ကွာဟချက်တွေ (gaps) ဖြစ်စေနိုင်ပါတယ်။

ကြာမြင့်နေတဲ့ requests တွေက နောက် monitor runs တွေကို မနှောင့်နှေးစေဖို့ — [request timeout](#request-timeouts-ထည့်ခြင်း) တစ်ခု သတ်မှတ်နိုင်ပါတယ်။ ဒါက run တစ်ခုချင်းစီ သတ်မှတ်ထားတဲ့ အချိန်အတွင်း ပြီးစေပြီး — နောက် runs တွေ အချိန်မှန် စတင်စေပါတယ်။

## Monitors တွေနဲ့ အလုပ်လုပ်ခြင်း

Monitor တစ်ခုနဲ့ အလုပ်လုပ်ဖို့ — **Services** tab ကို နှိပ်ပြီး sidebar ထဲက **Monitors** dropdown list ကို ချဲ့ပါ။ ပြီးရင် monitor တစ်ခုကို ရွေးပြီး သူ့ရဲ့ [ရလဒ်တွေ](https://learning.postman.com/docs/monitoring-your-api/viewing-monitor-results/) ကို ကြည့်ရှုနိုင်ပါတယ်။ အဲဒီကနေ အောက်ပါတွေ လုပ်နိုင်ပါတယ်:

* **Monitor တစ်ခု run လုပ်ခြင်း** — Monitor တစ်ခုက monitor configure လုပ်တုန်းက ရွေးထားတဲ့ run schedule အရ သတ်မှတ်ထားတဲ့ interval တွေမှာ အလိုအလျောက် run ပါတယ်။ Postman CLI က trigger လုပ်မှပဲ run တဲ့ monitor တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ Monitor တစ်ခုကို ဘယ်အချိန်မဆို ကိုယ်တိုင် run ချင်ရင် **Run** ကို နှိပ်ပါ။
* **Monitor တစ်ခု share လုပ်ခြင်း** — ရလဒ်တွေကို team member တစ်ယောက်နဲ့ share လုပ်ဖို့ ညာဘက်အပေါ်က **Share** ကို နှိပ်ပါ။ ဒါက monitor ရလဒ်တွေကို ကြည့်ဖို့ တခြား team members တွေကို ပေးလို့ရတဲ့ link တစ်ခု ထုတ်ပေးပါတယ်။ [Teammates တွေကို ကိုယ့် workspace ဆီ invite လုပ်ဖို့](/docs/postman/creating-workspaces) **Invite** ကိုလည်း နှိပ်နိုင်ပါတယ်။
* **Monitor တစ်ခု pause လုပ်ခြင်း** — Pause လုပ်ထားစဉ်အတွင်း monitor က သတ်မှတ်ထားတဲ့ URL ဆီ calls တွေ မလုပ်တော့ပါဘူး။ Monitor ကို pause လုပ်ဖို့ **View more actions > Pause** ကို ရွေးပါ။ ပြန် resume လုပ်ဖို့ **View more actions > Resume** ကို ရွေးပါ။
* **Monitor တစ်ခု rename လုပ်ခြင်း** — Monitor ကို တည်းဖြတ်စရာမလိုဘဲ နာမည်ပြောင်းနိုင်ပါတယ်။ **View more actions > Rename** ကို ရွေးပါ။
* **Monitor တစ်ခု edit လုပ်ခြင်း** — Monitor တစ်ခုကို edit လုပ်ပြီး သူ့ရဲ့ နာမည်, collection ဒါမှမဟုတ် တခြား configuration options တွေ update လုပ်နိုင်ပါတယ်။ **View more actions > Edit** ကို ရွေးပြီး configuration options တွေ ပြောင်းကာ **Update Monitor** ကို နှိပ်ပါ။
* **Postman CLI သုံးပြီး monitor တစ်ခု run လုပ်ခြင်း** — Postman CLI install လုပ်ဖို့နဲ့ monitor run လုပ်ဖို့ commands တွေကို ပြသပေးပါတယ်။ **View more actions > Run using Postman CLI** ကို ရွေးပါ။
* **Monitor roles တွေ စီမံခန့်ခွဲခြင်း** — Monitor ကို access လုပ်နိုင်တဲ့ teammates တွေနဲ့ သူတို့ရဲ့ [monitor role](https://learning.postman.com/docs/administration/roles-and-permissions/#monitor-roles) တွေကို စီမံခန့်ခွဲပါ။ **View more actions > Manage roles** ကို ရွေးပါ။
* **Monitor တစ်ခု ဖျက်ခြင်း** — Monitor မလိုတော့ရင် ဖျက်ပစ်နိုင်ပါတယ်။ **View more actions > Delete** ကို ရွေးပါ။

## Packages သုံးတဲ့ collection တစ်ခု run လုပ်ခြင်း

ကိုယ့် team ရဲ့ [Postman Package Library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) ကနေ packages တွေ import လုပ်တဲ့ scripts တွေပါတဲ့ collections တွေကို run ဖို့ monitors တွေ သုံးနိုင်ပါတယ်။ Package library ထဲ [packages တွေ ထည့်နည်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#add-a-package) နဲ့ [scripts တွေထဲ packages import လုပ်နည်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#import-a-package) ကို လေ့လာနိုင်ပါတယ်။

npm ဒါမှမဟုတ် JSR package registries ကနေ [external packages တွေ import လုပ်တဲ့](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) collections တွေကို run ဖို့လည်း monitors တွေ သုံးနိုင်ပါတယ်။

## နောက်ထပ်အဆင့်များ

Monitor တစ်ခု ဖန်တီးပြီးတာနဲ့ — monitor ရလဒ်တွေကို ကြည့်ရှုနိုင်ပြီး monitor data တွေကို တခြား platforms တွေဆီ ပို့ဖို့ integrations တွေလည်း setup လုပ်နိုင်ပါတယ်:

* Monitor runs တွေအကြောင်း အသေးစိတ် သိရှိဖို့ monitor ရလဒ်တွေ ကြည့်ရှုနည်းကို [Monitor ရလဒ်များ ကြည့်ရှုခြင်း](https://learning.postman.com/docs/monitoring-your-api/viewing-monitor-results/) မှာ လေ့လာပါ။
* Monitor data နဲ့ notifications တွေကို တခြား platforms တွေဆီ ပို့ဖို့ integrations setup လုပ်နည်းကို [Postman ကို third-party solutions တွေနဲ့ ပေါင်းစပ်ခြင်း](https://learning.postman.com/docs/integrations/intro-integrations/) မှာ လေ့လာပါ။
