---
title: "Collection runs တွေကို အချိန်ဇယားနဲ့ အလိုအလျောက် run လုပ်ခြင်း (Automate Collection Runs on a Schedule)"
description: "Collections တွေကို schedule တစ်ခုပေါ်မှာ ဘယ်လို run လုပ်မလဲ — scheduled runs အကြောင်း, schedule configure လုပ်နည်း, run ရလဒ်တွေ ကြည့်ခြင်း, pause/resume, run order ပြောင်းခြင်း နဲ့ ဖျက်ခြင်း"
order: 46
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/"
status: translated
updated: 2026-09-02
---

Collections တွေကို manual အနေနဲ့ run လုပ်နေစရာ မလိုတော့ဘဲ — Postman က collections တွေကို schedule တစ်ခုပေါ်မှာ ကိုယ့်အတွက် run လုပ်ပေးနိုင်ပါတယ်။ Collection Runner ကို သုံးပြီး collection တစ်ခုကို ရွေးကာ schedule တစ်ခု configure လုပ်ပါ။ ဥပမာ — ကိုယ့် API ရဲ့ လုပ်ဆောင်နိုင်မှုကို စမ်းသပ်တဲ့ collection တစ်ခုကို နေ့တိုင်း သတ်မှတ်ထားတဲ့ အချိန်တစ်ခုမှာ run လုပ်နိုင်ပါတယ်။

Collection Runner နဲ့ collection run တစ်ခုကို schedule လုပ်တဲ့အခါ — scheduled run က collection ထဲက **Runs > Scheduled** tab ထဲကို ပေါင်းထည့်ပါတယ်။ အဲဒီကနေ scheduled collection runs တွေကို ကြည့်နိုင်, pause လုပ်နိုင်, တည်းဖြတ်နိုင် ပြီး ဖျက်နိုင်ပါတယ်။

Collection runs တွေကို [monitors](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs-monitors/) တွေနဲ့လည်း schedule လုပ်နိုင်ပါတယ်။ Failures တွေအတွက် on-call alerts တွေ trigger လုပ်တာလိုမျိုး — alerts တွေ သတ်မှတ်ချင်တဲ့အခါ monitors တွေနဲ့ runs တွေကို schedule လုပ်ပါ။ API tests တွေကို automate လုပ်တာလိုမျိုး တခြား use cases တွေအတွက်တော့ — [Collection Runner](/docs/postman/intro-to-collection-runs) နဲ့ runs တွေကို schedule လုပ်ပါ။

## Scheduled collection runs အကြောင်း

Scheduled collection runs တွေနဲ့ အလုပ်လုပ်တဲ့အခါ အောက်ပါ အချက်တွေကို သတိပြုပါ:

* Scheduled collections တွေက Postman Cloud ထဲမှာ run ပါတယ် — local မှာ မဟုတ်ပါဘူး။
* Scheduled runs တွေက ကိုယ့် local [working directory](https://learning.postman.com/docs/getting-started/installation/settings/working-directory/) ထဲက files တွေကို သုံးပြီး [body data](/docs/postman/parameters) ပို့တဲ့ requests တွေကို ပံ့ပိုးမပေးပါဘူး။ အဲဒီအစား — cloud ထဲက scheduled runs တွေအတွက် ရနိုင်အောင် ကိုယ့်ရဲ့ [test data files တွေကို upload](/docs/postman/test-data) လုပ်ပါ။
* Schedules တွေက သူတို့ရဲ့ collections တွေနဲ့ အတူ permissions တွေကို မျှဝေပါတယ်။ ဥပမာ — collection တစ်ခုကို တည်းဖြတ်ဖို့ permission ရှိရင် — အဲဒီ collection ရဲ့ schedules တွေကိုလည်း တည်းဖြတ်နိုင်ပါတယ်။
* Personal, private နဲ့ team [workspaces](/docs/postman/creating-workspaces) တွေထဲမှာ collection runs တွေကို schedule လုပ်နိုင်ပါတယ်။
* Collection တစ်ခုကို import ဒါမှမဟုတ် export လုပ်ရင် — သူ့ရဲ့ schedules တွေပါ ပါသွားတာ မဟုတ်ပါဘူး။ ဒါပေမဲ့ collection တစ်ခုကို ဖျက်လိုက်ရင်တော့ — သူ့ရဲ့ schedules တွေလည်း ဖျက်ပစ်ခံရပါတယ်။
* Scheduled collection runs တွေက [monitors တွေနဲ့ အတူတူပဲ ဖြစ်တဲ့ usage limits](https://learning.postman.com/docs/monitoring-your-api/monitor-usage/) တွေကို မျှဝေသုံးပါတယ်။
* Scheduled runs တွေက OAuth 2.0 authentication ကို ပံ့ပိုးမပေးပါဘူး။ Scheduled runs တွေနဲ့ OAuth 2.0 token တစ်ခုကို ဘယ်လို သုံးမလဲဆိုတာ သိဖို့ — [OAuth 2.0 overview](/docs/postman/oauth-20) ကို ကြည့်ပါ။

ကိုယ့် team ရဲ့ [Postman Package Library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) ကနေ packages တွေ import လုပ်တဲ့ scripts တွေပါတဲ့ collections တွေကိုလည်း run နိုင်ပါတယ်။ Package library ထဲကို [packages တွေ ထည့်နည်း](https://learning.postman.comhttps://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#add-a-package) နဲ့ ကိုယ့် scripts တွေထဲကို [packages တွေ import လုပ်နည်း](https://learning.postman.comhttps://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#import-a-package) တွေကို လေ့လာပါ။

## Collection run တစ်ခု schedule လုပ်ခြင်း

[Collection](/docs/postman/create-collections) တစ်ခု ဒါမှမဟုတ် [folder](/docs/postman/manage-collections) တစ်ခုထဲက requests တွေအတွက် run တစ်ခုကို schedule လုပ်နိုင်ပါတယ်။

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Schedule လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။

2. ![Run icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-run-stroke.svg#icon) **Run** ကို နှိပ်ပါ။ ဒါမှမဟုတ် — Postman ရဲ့ footer ထဲက **Tools > ![Run icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-run-stroke.svg#icon) Runner** ကို နှိပ်ပြီး sidebar ထဲက **Collections** ကနေ collection တစ်ခုကို ဆွဲချပါ။

3. **Run type** အောက်မှာ **Functional** ကို ရွေးပါ။ ပြီးရင် **Run method** အောက်မှာ **Schedule** ကို နှိပ်ပါ။

   Scheduling က [Cloud View](https://learning.postman.com/docs/use/native-git/overview/) မှာပဲ ရနိုင်ပါတယ်။

4. အောက်ပါ configuration options တွေထဲက လိုတာတွေကို ရွေးပါ:

   * **Schedule name** — ကိုယ့် scheduled run အတွက် နာမည်တစ်ခုပါ။

   * **Run Frequency** — Collection ကို ဘယ်အချိန် ဘယ်နှစ်ကြိမ် run ချင်လဲဆိုတာပါ။ Status page တစ်ခုအတွက် ငါးမိနစ်တစ်ခါလောက် မကြာခဏ ဖြစ်နိုင်သလို — ကိုယ့် endpoints တွေအတွက် တစ်ပတ် ဒါမှမဟုတ် တစ်လ တစ်ခါ basic check အနေနဲ့လည်း ဖြစ်နိုင်ပါတယ်။

     Minute-based schedule runs တွေကို paid plans တွေမှာပဲ schedule လုပ်နိုင်ပါတယ်။ Enterprise plans တွေအတွက်တော့ — တစ်မိနစ်တိုင်း run မယ့် minute-based scheduled runs တွေကို schedule လုပ်နိုင်ပါတယ်။

   * **Environment** — (Optional) Collection က သုံးစေချင်တဲ့ variables တွေပါတဲ့ [environment](/docs/postman/managing-environments) ပါ။

   * **Iterations (max 50)** — Collection ကို run လုပ်ရမယ့် အကြိမ်အရေအတွက်ပါ။

   * **Data file** — Scheduled run အတွက် [data file](/docs/postman/working-with-data-files) တစ်ခုပါ။

   * **Email notification recipients** — Scheduled run အတွက် notifications တွေ ရရှိမယ့် team members အများဆုံး ငါးယောက်ပါ။

   * **Stop notifications after** *N* **consecutive failures** — Failures တွေ ဘယ်နှစ်ကြိမ် ဆက်တိုက် ဖြစ်ပြီးတဲ့နောက် Postman က notifications တွေ ပို့တာ ရပ်လိုက်မလဲဆိုတာပါ။ Default က သုံးကြိမ်ပါ။

   * ![Right icon](https://assets.postman.com/postman-docs/aether-icons/direction-right.svg#icon) **Advanced settings** ကို နှိပ်ပြီး နောက်ထပ် configuration options တွေ ကြည့်နိုင်ပါတယ်:
     * **Retry if run fails** — Request တစ်ခု fail ဖြစ်ပြီးနောက် ပြန်ကြိုးစားဖို့ ဒီ checkbox ကို ရွေးပြီး — request ကို ဘယ်နှစ်ကြိမ် ပြန် ကြိုးစားရမလဲ ရိုက်ထည့်ပါ။ Retry တစ်ခါချင်းစီက ကိုယ့်ရဲ့ [monitoring usage](https://learning.postman.com/docs/billing/resource-usage/) ထဲမှာ ရေတွက်ပါတယ်။
     * **Set request timeout** — Request တစ်ခု timeout ဖြစ်သွားရင် ကျော်လိုက်ဖို့ ဒီ checkbox ကို ရွေးပြီး — timeout period ကို milliseconds နဲ့ ရိုက်ထည့်ပါ။ Scheduled run တစ်ခုက စုစုပေါင်း ကြာချိန် 15 မိနစ်ထက် မကျော်နိုင်ပါဘူး။
     * **Set delay before requests** — Requests တွေ မပို့ခင် စောင့်ဖို့ ဒီ checkbox ကို ရွေးပြီး — interval delay ကို milliseconds နဲ့ ရိုက်ထည့်ပါ။
     * **Follow redirects** — 3xx series response ပြန်ပို့တဲ့ requests တွေ အလိုအလျောက် redirect မဖြစ်စေဖို့ ဒီ checkbox ကို ရှင်းလိုက်ပါ။
     * **Enable SSL validation** — Requests တွေ လုပ်တဲ့အခါ SSL certificates တွေရဲ့ တရားဝင်မှုကို Postman က စစ်ဆေးတာ မလုပ်စေချင်ရင် ဒီ checkbox ကို ရှင်းလိုက်ပါ။

5. Default အနေနဲ့ — ကိုယ့် requests တွေက collection ထဲမှာ စာရင်းပြထားတဲ့ အစဉ်အတိုင်း run ပါတယ်။ Run order ပြောင်းဖို့ လိုရင် — ![Menu icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-menu-stroke.svg#icon) ကို နှိပ်ပြီး request တစ်ခုကို order အသစ်ထဲက နေရာတစ်ခုဆီ ဆွဲချပါ။ ဒါ့အပြင် request တစ်ခုချင်းစီရဲ့ ဘေးက checkbox ကို ရှင်းလိုက်ခြင်းဖြင့် — run ထဲကနေ request တစ်ခုချင်းကိုလည်း ဖယ်ထုတ်နိုင်ပါတယ်။ ပိုသိချင်ရင် — [Run order ပြောင်းခြင်း](#run-order-ပြောင်းခြင်း) ကို ကြည့်ပါ။

6. **Schedule Run** ကို နှိပ်ပါ။

Scheduled collection runs တွေက ပို့တဲ့ requests တွေကို ကိုယ့်ရဲ့ maximum monitoring API calls အရေအတွက်ကနေ နုတ်ပါတယ်။ ကိုယ့် monitor usage ကို စစ်ဆေးခြင်းအကြောင်း ပိုသိချင်ရင် — [Postman မှာ monitor usage စီမံခြင်း](https://learning.postman.com/docs/monitoring-your-api/monitor-usage/) ကို ကြည့်ပါ။

## Scheduled run တစ်ခုကို ကြည့်ခြင်း

ပြီးခဲ့တဲ့ scheduled runs တွေရဲ့ ရလဒ်တွေကို ကြည့်နိုင်ပါတယ်။

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ ကြည့်ချင်တဲ့ scheduled run ပါတဲ့ collection ကို ရွေးပါ။
2. **Runs > Scheduled** tab ကို ရွေးပါ။
3. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး **View** ကို နှိပ်ပါ။
4. Graph ထဲက column တစ်ခုချင်းစီက run တစ်ခုချင်းစီကို ကိုယ်စားပြုပါတယ်။ အဲဒီ run အတွက် test results တွေနဲ့ Console log ကို ကြည့်ဖို့ column တစ်ခုကို နှိပ်ပါ။ ပိုသိချင်ရင် — [Postman မှာ scheduled collection runs တွေကို ကြည့်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/viewing-scheduled-collection-runs/) ကို ကြည့်ပါ။

   ![Scheduled runs view results](https://assets.postman.com/postman-docs/v12/view-scheduled-run-results-v12-01.png)

## Scheduled run တစ်ခုကို manual အနေနဲ့ run လုပ်ခြင်း

Scheduled run တစ်ခုကို manual အနေနဲ့ trigger လုပ်တဲ့အခါ — Postman Cloud ထဲမှာ run ပါတယ်။ Bugs တွေ ပြင်နေချိန် ဒါမှမဟုတ် issues တွေ ပြန်ထုတ်ကြည့်နေချိန်မျိုးမှာ — scheduled runs တွေကို manual အနေနဲ့ run လုပ်တာ အသုံးဝင်ပါတယ်။

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Manual အနေနဲ့ run လုပ်ချင်တဲ့ scheduled run ပါတဲ့ collection ကို ရွေးပါ။

2. **Runs > Scheduled** tab ကို ရွေးပါ။

3. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး **View** ကို နှိပ်ပါ။

   ![Scheduled runs tab](https://assets.postman.com/postman-docs/v12/scheduled-runs-tab-view-v12-01.png)

4. **Run** ကို နှိပ်ပါ။

## Scheduled run တစ်ခုကို pause ဒါမှမဟုတ် resume လုပ်ခြင်း

Scheduled run တစ်ခုကို pause လုပ်လိုက်တဲ့အခါ — ကိုယ်က schedule ကို ပြန် resume မလုပ်မချင်း Postman က collection ကို ထပ် run မှာ မဟုတ်ပါဘူး။

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Pause ဒါမှမဟုတ် resume လုပ်ချင်တဲ့ scheduled run ပါတဲ့ collection ကို ရွေးပါ။
2. **Runs > Scheduled** tab ကို ရွေးပါ။
3. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ကာ **Pause** ဒါမှမဟုတ် **Resume** ကို ရွေးပါ။

## Scheduled run တစ်ခုကို တည်းဖြတ်ခြင်း

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ တည်းဖြတ်ချင်တဲ့ schedule ပါတဲ့ collection ကို ရွေးပါ။
2. **Runs > Scheduled** tab ကို ရွေးပါ။
3. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions > Edit** ကို ရွေးပါ။
4. Scheduled run ရဲ့ [configuration](#collection-run-တစ်ခု-schedule-လုပ်ခြင်း) ထဲမှာ လိုသလို ပြောင်းလဲမှုတွေ လုပ်ပြီးနောက် — **Save Changes** ကို နှိပ်ပါ။

## Run order ပြောင်းခြင်း

Collection တစ်ခုထဲက requests တွေကို workflow အမျိုးမျိုး simulate လုပ်ဖို့ — ပေါင်းစပ်မှု ဒါမှမဟုတ် အစဉ်လိုက်ပုံစံ အမျိုးမျိုးနဲ့ ပို့နိုင်ပါတယ်။ Collection Runner ထဲမှာ — requests တွေကို ဆွဲချပြီး order ပြောင်းနိုင်သလို — request တစ်ခုကို ကျော်လိုက်ဖို့ သူ့ဘေးက checkbox ကိုလည်း ရှင်းနိုင်ပါတယ်။

Collection run တစ်ခုကို schedule လုပ်တဲ့အခါ — ကိုယ့် requests တွေရဲ့ order ကို ပြောင်းပြီး schedule တစ်ခုပေါ်မှာ run ဖို့ custom order ကို သိမ်းနိုင်ပါတယ်။ ဒီနည်းနဲ့ — collection တစ်ခုတည်းကိုပဲ သုံးပြီး test scenarios အမျိုးမျိုးကို automate လုပ်နိုင်ပါတယ်။

Scheduled run တစ်ခုထဲက request order ကို ပြောင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Run order ပြောင်းချင်တဲ့ collection ကို ရွေးပါ။
2. **Runs > Scheduled** tab ကို ရွေးပါ။
3. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions > Edit** ကို နှိပ်ပါ။
4. **Run Sequence** အောက်မှာ ![Menu icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-menu-stroke.svg#icon) ကို နှိပ်ပြီး requests တွေကို ဆွဲချလဲလှယ်ခြင်းဖြင့် order ကို ပြောင်းပါ။ Request တစ်ခုကို ကျော်လိုက်ချင်ရင် သူ့ရဲ့ checkbox ကို ရှင်းပါ။
5. **Schedule Run** ကို နှိပ်ပါ။

**Runs > Scheduled** tab ပေါ်မှာ — **Custom run order** ဆိုတဲ့ message က scheduled run တစ်ခုက custom request order တစ်ခုကို သုံးနေတယ်ဆိုတာ ညွှန်ပြပါတယ်။ Scheduled collection တစ်ခုထဲကို request တစ်ခု ထပ်ထည့်တာ ဒါမှမဟုတ် ဖျက်လိုက်တာမျိုး ဖြစ်ရင် — scheduled run ရဲ့ ဘေးမှာ **Review Changes** link တစ်ခု ပေါ်လာပါတယ်။ အပြောင်းအလဲတွေကို ပြန်သုံးသပ်ပြီး တည်းဖြတ်ဖို့ အဲဒီ link ကို နှိပ်ပါ။

![Review changes for scheduled runs](https://assets.postman.com/postman-docs/v12/scheduled-runs-review-changes-v12-01.png)

Scheduled collection runs တွေက ပို့တဲ့ requests တွေကို ကိုယ့်ရဲ့ maximum monitoring API calls အရေအတွက်ကနေ နုတ်ပါတယ်။ ကိုယ့် monitor usage ကို စစ်ဆေးခြင်းအကြောင်း ပိုသိချင်ရင် — [Postman မှာ monitor usage စီမံခြင်း](https://learning.postman.com/docs/monitoring-your-api/monitor-usage/) ကို ကြည့်ပါ။

## Scheduled run တစ်ခုကို ဖျက်ခြင်း

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ ဖျက်ချင်တဲ့ scheduled run ပါတဲ့ collection ကို ရွေးပါ။
2. **Runs > Scheduled** tab ကို ရွေးပါ။
3. Scheduled run တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions > Delete** ကို နှိပ်ပါ။
