---
title: "Collection Runner ဖြင့် Collection Runs လုပ်ခြင်း (Test your API using the Collection Runner)"
description: "Collection Runner သုံးပြီး collection runs တွေ run လုပ်ခြင်း — collection run configure လုပ်နည်း, run results/debug ကြည့်ခြင်း, errors, run history, export, troubleshooting"
order: 24
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/"
status: translated
updated: 2026-09-02
---

Collection Runner ကို သုံးပြီး — Postman Collection တစ်ခုထဲက API requests တွေ တစ်ချို့ ဒါမှမဟုတ် အားလုံးကို ကိုယ်ရွေးထားတဲ့ အစဉ်အတိုင်း run လုပ်နိုင်ပါတယ်။ Collection Runner က request တစ်ခုချင်းစီအတွက် [test results](/docs/postman/testing) တွေကို log လုပ်ပေးပြီး — requests တွေကြားမှာ data တွေ ပေးပို့ဖို့နဲ့ request workflow ကို ပြောင်းလဲဖို့ [scripts](/docs/postman/intro-to-scripts) တွေကိုလည်း သုံးနိုင်ပါတယ်။

Collection runs တွေကို သုံးပြီး — functional GraphQL, gRPC နဲ့ HTTP API testing တွေကို automate လုပ်နိုင်ပါတယ်။ Collections တွေကို ကိုယ်တိုင် run လုပ်နိုင်သလို — [Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/) ဒါမှမဟုတ် [monitors](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs-monitors/) နဲ့ Postman cloud မှာ schedule လုပ်ပြီးလည်း run လို့ရပါတယ်။ Postman ရဲ့ command line tool ဖြစ်တဲ့ [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) ကို သုံးပြီး collection runs တွေကို ကိုယ့် CI/CD pipeline နဲ့လည်း ပေါင်းစပ်နိုင်ပါတယ်။

GraphQL နဲ့ gRPC collection runs တွေက Postman ရဲ့ paid plans တွေမှာ ရပါတယ်။ အသေးစိတ်ကို [pricing page](https://www.postman.com/pricing/) မှာ ကြည့်ပါ။

## Collection run တစ်ခု configure လုပ်ခြင်း

[Collection](/docs/postman/create-collections) တစ်ခု ဒါမှမဟုတ် [folder](/docs/postman/manage-collections) တစ်ခုထဲက requests တွေကို ကိုယ်တိုင် run လုပ်နိုင်ပါတယ်။

1. Sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး run စေချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။
3. **Run** ကို နှိပ်ပါ။

   Postman footer ထဲက **Tools > Runner** ကို နှိပ်ပြီး sidebar ကနေ collection တစ်ခုကို Collection Runner ထဲကို ဆွဲချ (drag) လုပ်ပြီးလည်း run လို့ရပါတယ်။

4. **Run type** အောက်မှာ **Functional** ကို ရွေးပြီး **Local** ကို ရွေးပါ။
5. Collection ကို [environment](/docs/postman/managing-environments) တစ်ခုနဲ့ run ချင်ရင် — Postman ရဲ့ ညာဘက်အပေါ် ထောင့်က environment selector ကနေ ရွေးပါ။
6. ကိုယ်လိုချင်တဲ့ configuration options တွေ ရွေးပါ:

   * **Run configuration** — Collection run ကို configure လုပ်ဖို့ အောက်ပါ option တွေ ရွေးပါ:
     * **Iterations** — Collection ကို run မယ့် အကြိမ်အရေအတွက်ပါ။ Data sets အမျိုးမျိုးနဲ့ collection တွေကို အကြိမ်များစွာ run ပြီး [workflows တွေ တည်ဆောက်](/docs/postman/building-workflows) လို့လည်း ရပါတယ်။
     * **Delay** — Request တစ်ခုချင်းစီ မတိုင်ခင် ထည့်မယ့် interval delay (မီလီစက္ကန့်) ပါ။
     * **Iteration data** — Collection run အတွက် iteration data ပေးဖို့ အောက်ပါတစ်ခုကို ရွေးပါ:
       * **Datafiles** — Collection run အတွက် ရှိပြီးသား [data file](/docs/postman/test-data) တစ်ခုကို upload လုပ်ပါ ဒါမှမဟုတ် ရွေးပါ။ အရင်က upload လုပ်ထားတဲ့ data file ဒါမှမဟုတ် ကိုယ့် local မှာရှိတဲ့ data file ကို ရွေးလို့ရပါတယ်။
       * **Datasets** — Collection run ထဲမှာ iteration data အဖြစ် သုံးဖို့ dataset နဲ့ view တစ်ခုကို ဖန်တီးပါ ဒါမှမဟုတ် ရွေးပါ။ Datasets တွေက ကိုယ့် data တွေကို define လုပ်ပြီး — views တွေက အဲဒီ data တွေကို ဘယ်လို ပြန်ယူမလဲ ထိန်းချုပ်ပါတယ်။ ပိုလေ့လာချင်ရင် [collection runs တွေမှာ datasets သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/datasets/use-datasets#use-datasets-in-collection-runs) ကို ကြည့်ပါ။

   * **Simulation configuration** (Postman desktop app ရဲ့ Local View မှာပဲ ရပါတယ်) — Collection run အတွင်း ကိုယ့် mock server ကို သက်ရောက်စေဖို့ simulation တစ်ခု ရွေးပြီး collection run အတွက် advanced settings တွေ configure လုပ်နိုင်ပါတယ်။ ရနိုင်တဲ့ option တွေကတော့:
     * **Select a simulation** — Collection run အတွင်း mock server ကို latency, errors, rate limits စတဲ့ scenarios တွေ သက်ရောက်စေဖို့ ရွေးပါ။ ဒါက real-world အခြေအနေတွေအောက်မှာ ကိုယ့် service ဘယ်လို ပြုမူလဲ test လုပ်နိုင်စေပါတယ်။ ပိုလေ့လာချင်ရင် [collection တစ်ခုကို simulation နဲ့ run ခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/run-collection-with-simulation/) ကို ကြည့်ပါ။

   * **Advanced settings** — အောက်ပါ advanced settings တွေထဲက ကြိုက်တာတွေကို ရွေးနိုင်ပါတယ်:
     * **Persist responses for a session** — ပုံမှန်အားဖြင့် response headers နဲ့ bodies တွေကို သိမ်းဆည်းပေးထားတာကြောင့် — collection run ပြီးနောက် [ပြန်လည်ကြည့်ရှုနိုင်ပါတယ်](#run-results-များ-debug-လုပ်ခြင်း)။ Request နဲ့ response bodies တွေက 300 KB ထက် ငယ်မှသာ သိမ်းပေးပါတယ်။

       Collection run အကြီးကြီးတွေအတွက် responses တွေ သိမ်းဖို့ — browser ဒါမှမဟုတ် ကိုယ့် computer မှာ memory မလုံလောက်တာ ဖြစ်နိုင်ပါတယ်။ Request နဲ့ response data အများအပြားကို ကိုယ့် computer ရဲ့ disk space နဲ့ သိမ်းပေးတဲ့ [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို သုံးဖို့ အကြံပြုပါတယ်။ [Collection run အကြီးကြီး troubleshoot လုပ်နည်း](#collection-run-အကြီးကြီးတွေ-troubleshoot-လုပ်ခြင်း) ကို လေ့လာနိုင်ပါတယ်။

       Request နဲ့ response အသေးစိတ်တွေကို လက်ရှိ Postman session အတွင်းမှာပဲ local မှာ သိမ်းထားပြီး — အမြဲတမ်း save မလုပ်ပါဘူး။ Postman ကနေ sign out လုပ်ခြင်း၊ တခြား device တစ်ခုကနေ ဒီ account နဲ့ sign in လုပ်ခြင်း ဒါမှမဟုတ် browser ကို refresh လုပ်ခြင်းတွေက session ကို အဆုံးသတ်ပြီး log လုပ်ထားတဲ့ data တွေကို ဖျက်ပစ်ပါတယ်။

       Response နဲ့ request အသေးစိတ်တွေက collection run ကို စတင်ခဲ့တဲ့ user အတွက်ပဲ ရပါတယ်။ တခြား team members တွေက ကိုယ် စတင်ခဲ့တဲ့ collection runs တွေရဲ့ အသေးစိတ်ကို ကြည့်လို့မရပါဘူး။

     * **Turn off logs during run** — Collection run အတွင်း [Postman Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/#debugging-in-the-console) ဆီကို logging လုပ်တာကို ပိတ်ပါ။ Method, URL, headers, body စတဲ့ request နဲ့ response အသေးစိတ်တွေကို Postman Console မှာ log လုပ်မှာ မဟုတ်တော့ပါဘူး။ ဒါ့အပြင် scripts တွေထဲက [log statements](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/#using-log-statements) အားလုံးကိုလည်း ဂရုမစိုက်တော့ပါဘူး။ Collection run အကြီးကြီးတွေအတွင်း Postman app ရဲ့ performance ကို ပိုကောင်းစေချင်ရင် ဒီ option ကို ရွေးနိုင်ပါတယ်။ [Run results](#run-results-များ-debug-လုပ်ခြင်း) ကနေတော့ request နဲ့ response အသေးစိတ်တွေကို ဆက်ပြီး ကြည့်လို့ရပါသေးတယ်။
     * **Stop run if an error occurs** — ပုံမှန်အားဖြင့် script တစ်ခုထဲမှာ exception တစ်ခုခု ကြုံရတဲ့အခါ ဒါမှမဟုတ် request ပို့တဲ့နေရာမှာ ပြဿနာရှိရင် collection run က ရပ်သွားပါတယ်။ Error ဖြစ်ပြီးနောက်မှာလည်း collection run ကို ဆက်လုပ်စေချင်ရင် ဒီ checkbox ကို ရှင်းလိုက်ပါ။
     * **Keep variable values** — Run ထဲမှာ သုံးထားတဲ့ variables တွေကို သိမ်းထားပေးတာကြောင့် — run က ပြောင်းလဲလိုက်တဲ့ variables တွေက run ပြီးသွားတဲ့နောက်မှာလည်း ပြောင်းလဲထားတဲ့အတိုင်း ကျန်နေပါတယ်။ Variables တွေကို မသိမ်းထားရင် run ပြီးနောက်မှာ အပြောင်းအလဲတွေက save မဖြစ်ပါဘူး။ Collection run ထဲမှာ variables တွေ သိမ်းတာက variable တွေရဲ့ local value ကို update လုပ်ပြီး — shared value ကိုတော့ မပြောင်းပါဘူး။ Collection run တစ်ခုထဲမှာ [scripts](/docs/postman/intro-to-scripts) နဲ့ variables တွေ update လုပ်နည်းကို လေ့လာနိုင်ပါတယ်။
     * **Run collection without using stored cookies** — ကိုယ့် requests တွေက [cookies](https://learning.postman.com/docs/use/send-requests/response-data/cookies/) တွေ သုံးရင် — collection run အတွက် cookies တွေကို deactivate လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။
     * **Save cookies after collection run** — ဒီ session ထဲမှာ သုံးခဲ့တဲ့ cookies တွေကို [cookie manager](https://learning.postman.com/docs/use/send-requests/response-data/cookies/#use-the-cookie-manager) ထဲကို သိမ်းပါ။ Run အတွင်း requests တွေက ပြောင်းလဲလိုက်တဲ့ values တွေက run ပြီးသွားတဲ့နောက်မှာလည်း ကျန်နေပါမယ်။

7. (ထည့်စရာမလို) Requests run မယ့် အစဉ် ပြောင်းချင်ရင် — request ကို ဆွဲပြီး နေရာအသစ်မှာ ချပါ။ Run ထဲကနေ request တစ်ခုကို ဖယ်ချင်ရင် နာမည်ဘေးက checkbox ကို ရှင်းလိုက်ပါ။ **Shift** ကို ဖိထားပြီး checkbox အများကြီးကို တစ်ပြိုင်နက် ရွေး/မရွေး လုပ်နိုင်ပါတယ်။

   Collection run နေစဉ်အတွင်း requests တွေရဲ့ အစဉ်ကို request scripts တွေထဲက `pm.execution.setNextRequest()` function နဲ့လည်း ပြောင်းလဲနိုင်ပါတယ်။ ပိုလေ့လာချင်ရင် [collection run တစ်ခုထဲက request order ကို customize လုပ်ခြင်း](/docs/postman/building-workflows) ကို ကြည့်ပါ။

8. **Start run** ကို နှိပ်ပါ။

   Collection ကို [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview/) နဲ့ run ချင်ရင် — dropdown ကနေ အကြံပြုထားတဲ့ task တစ်ခု ရွေးပါ။ ဥပမာ — Agent Mode က collection ကို run ပြီး run results အပေါ် အခြေခံပြီး tests တွေ အကြံပြုပေးစေဖို့ **Add tests based on the response** ကို ရွေးပါ။

## Run results များ debug လုပ်ခြင်း

Collections တွေကို ကိုယ်တိုင် run တဲ့အခါ — Postman က request runs တွေရဲ့ ရလဒ်တွေကို real time မှာ ပြသပါတယ်။ ဒီထဲမှာ test results, errors နဲ့ ကျဆုံးခဲ့တဲ့ (failed) test assertions တွေ ပါဝင်ပါတယ်။ Collection run ရဲ့ source, ရွေးထားတဲ့ environment, iteration အရေအတွက်, စုစုပေါင်း duration, test အရေအတွက်, error အရေအတွက် နဲ့ average response time တွေကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။

Collection run အတွင်း ဘာတွေ ဖြစ်ခဲ့လဲ ပိုသိချင်ရင် — [Test results](#test-results-တွေကို-ကြည့်ရှုခြင်း) နဲ့ [Errors](#errors-တွေကို-ကြည့်ရှုခြင်း) ကို ကြည့်ပါ။ Run results တွေကို team နဲ့လည်း [share လုပ်ပြီး comment တွေ ရေးနိုင်ပါတယ်](#sharing-နဲ့-commenting-လုပ်ခြင်း)။

### Test results တွေကို ကြည့်ရှုခြင်း

Collection run ပြီးတာနဲ့ — test တွေရဲ့ ရလဒ်တွေကို နည်းအမျိုးမျိုးနဲ့ ကြည့်ရှုနိုင်ပါတယ်:

Run results စာမျက်နှာရဲ့ ဘယ်နေရာမဆို နှိပ်ပြီး — အောက်ပါ keys/keyboard shortcuts တွေနဲ့ စာရင်းထဲ scroll လုပ်နိုင်ပါတယ်:

| Action    | **macOS**                                 | **Windows**   |
| --------- | ----------------------------------------- | ------------- |
| Home      | **Fn + Left Arrow** ဒါမှမဟုတ် **⌘ + Up Arrow** | **Home**      |
| End       | **Fn + Right Arrow** ဒါမှမဟုတ် **⌘ + Up Arrow** | **End**       |
| Page Up   | **Fn + Up Arrow**                         | **Page Up**   |
| Page Down | **Fn + Down Arrow**                       | **Page Down** |


* Request တစ်ခုကို နှိပ်ပြီး — request အကြောင်း အသေးစိတ်တွေ ကြည့်ရှုနိုင်ပါတယ်။ Request ရဲ့ ယေဘုယျ အချက်အလက်တွေ၊ request headers နဲ့ body ကို ကြည့်လို့ရပါတယ်။ [Collection run configure လုပ်တုန်းက](#collection-run-တစ်ခု-configure-လုပ်ခြင်း) **Persist responses for a session** checkbox ရွေးထားရင် — response headers နဲ့ body ကိုလည်း ကြည့်နိုင်ပါတယ်။
* Request တစ်ခုရဲ့ နာမည်ကို နှိပ်ရင် — request ကို tab အသစ်တစ်ခုမှာ ဖွင့်ပေးပါတယ်။ Post-response scripts တွေ ကြည့်နိုင်သလို — request ကို နောက်တစ်ကြိမ် ပို့ဖို့ **Send** ကိုလည်း နှိပ်နိုင်ပါတယ်။ Requests တွေက folder တစ်ခုထဲမှာဆိုရင် — folder ရဲ့ နာမည်ကို နှိပ်ပြီး tab အသစ်မှာ ဖွင့်နိုင်ပါတယ်။
* Collection run မှာ iteration တစ်ခုထက်ပိုပြီး ပါခဲ့ရင် — iteration နံပါတ်တစ်ခုကို နှိပ်ပြီး အဲဒီ iteration တစ်ခုချင်းစီရဲ့ ရလဒ်တွေဆီ ခုန်သွားနိုင်ပါတယ်။
* Request ဘေးက response status code ပေါ်မှာ mouse ကို ချ (hover) လုပ်ရင် — status code အပြည့်အစုံနဲ့ ဖော်ပြချက်ကို မြင်ရပါတယ်။
* **Console log** tab ကို နှိပ်ရင် — request အလိုက် အုပ်စုဖွဲ့ထားတဲ့ script-level console messages တွေကို ကြည့်ရပါတယ်။ Message တစ်ခုချင်းစီကို log, info, warning ဒါမှမဟုတ် error message အဖြစ် badges တွေနဲ့ ခွဲခြားပြပါတယ်။
* **View all runs** ကို နှိပ်ရင် — အရင်က run ခဲ့တဲ့ runs တွေရဲ့ စာရင်းကို ကြည့်ရပါတယ်။ [Run history ကြည့်ရှုခြင်း](#run-history-ကြည့်ရှုခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Run results တွေကို debug လုပ်ဖို့နဲ့ collection ထဲက requests တွေအတွက် tests တွေ ဖန်တီးဖို့ [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview/) ကိုလည်း သုံးနိုင်ပါတယ်:

* Request တစ်ခုခုမှာ failure ဒါမှမဟုတ် error ကြုံရရင် — Agent Mode ကို သုံးပြီး debug လုပ်ပြီး ပြုပြင်ပေးဖို့ **Debug with AI** ကို နှိပ်နိုင်ပါတယ်။
* Request တစ်ခုခုမှာ tests တွေ မပါရင် — Agent Mode ကို သုံးပြီး test assertions တွေ အကြံပြုခိုင်းနိုင်ပါတယ်။

### Errors တွေကို ကြည့်ရှုခြင်း

**Errors** tab ကို နှိပ်ရင် — errors ကြုံခဲ့တဲ့ requests တွေကိုပဲ filter လုပ်ပြပါတယ်။ ဒီမှာ *errors* ဆိုတာ — timeout ဒါမှမဟုတ် TLS handshake error စတဲ့ runtime ပြဿနာတွေကို ဆိုလိုပြီး — *failed* ဆိုတာက user သတ်မှတ်ထားတဲ့ checks တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး (post-request scripts စတာမျိုး) မျှော်လင့်ထားတဲ့အတိုင်း မဖြစ်တဲ့အခါ ဖြစ်ပါတယ်။

Collection run ထဲမှာ errors ရှိတဲ့ requests တွေက run results စာမျက်နှာမှာ error badge နဲ့ error message နဲ့အတူ ပေါ်ပါတယ်။ Badges တွေက errors တွေကို **NETWORK**, **REQUEST** ဒါမှမဟုတ် **SCRIPT** ပြဿနာတွေလို့ ခွဲခြားပြပါတယ်။

HTTP collection run, HTTP response ဒါမှမဟုတ် monitor run တစ်ခုမှာ ပြဿနာရှိရင် — Postman ကနေ Jira issue အသစ်တစ်ခု ဖန်တီးနိုင်ပါတယ်။ ပိုလေ့လာချင်ရင် [collection, collection run, response ဒါမှမဟုတ် monitor ကနေ Jira issue ဖန်တီးခြင်း](https://learning.postman.com/docs/integrations/available-integrations/jira/create-issue/#create-a-jira-issue-from-a-collection-collection-run-response-or-monitor) ကို ကြည့်ပါ။

### Simulation events တွေကို ကြည့်ရှုခြင်း

[Postman Simulator](https://learning.postman.com/docs/design-apis/simulate-conditions) နဲ့ — latency, errors, rate limits စတဲ့ scenarios တွေ သက်ရောက်စေပြီး real-world အခြေအနေတွေအောက်မှာ ကိုယ့် service ဘယ်လို ပြုမူလဲ test လုပ်ဖို့ simulations တွေ ဖန်တီးနိုင်ပါတယ်။ Simulations တွေကို — ကိုယ့် API ရဲ့ dependencies တွေကို simulate လုပ်ပေးတဲ့ [mocks](/docs/postman/mock-servers) တွေမှာ သက်ရောက်စေနိုင်လို့ — real services တွေကို မခေါ်ဘဲ အပြုအမူတွေကို test လုပ်နိုင်ပါတယ်။

Collection ကို [simulation နဲ့ run ခဲ့ရင်](https://learning.postman.com/docs/tests-and-scripts/running-collections/run-collection-with-simulation/) — run အတွင်း scenarios တွေက request တစ်ခုချင်းစီကို ဘယ်လို သက်ရောက်ခဲ့လဲ ကြည့်ဖို့ **Simulation events** tab ကို နှိပ်ပါ။ ဒီ tab က အချိန်, event type, သက်ရောက်ခဲ့တဲ့ scenario နဲ့ အပိုဆောင်း context စတဲ့ အသေးစိတ်တွေပါတဲ့ timeline တစ်ခုကို ပြသပါတယ်။ Event တစ်ခုချင်းစီအတွက် pass ဒါမှမဟုတ် fail ဖြစ်ခဲ့တဲ့ tests အရေအတွက်ကိုလည်း ပြပါတယ်။

### Sharing နဲ့ commenting လုပ်ခြင်း

Collection run တစ်ခုရဲ့ ရလဒ်တွေကို team နဲ့ share လုပ်နိုင်ပြီး run results တွေမှာ comments တွေ ထည့်နိုင်ပါတယ်။ Teammates တွေ ထည့်ထားတဲ့ comments တွေကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။

* Workbench ရဲ့ ညာဘက်အပေါ်က **Share** ကို နှိပ်ပြီး — team member တစ်ယောက်နဲ့ ရလဒ်တွေ share လုပ်နိုင်ပါတယ်။ ဒါက ဒီ run ရဲ့ အသေးစိတ်ကို ကြည့်ဖို့ တခြား team members တွေကို ပေးလို့ရတဲ့ link တစ်ခု ထုတ်ပေးပါတယ်။ **Copy link** ကို နှိပ်ပြီး [teammates တွေကို ကိုယ့် workspace ဆီ invite လုပ်ဖို့](/docs/postman/creating-workspaces) လည်း သုံးနိုင်ပါတယ်။ ကိုယ်တစ်ယောက်တည်းပဲ ဝင်လို့ရတဲ့ internal workspace တစ်ခုထဲမှာဆိုရင် — teammates တွေကို workspace ဆီ invite လုပ်ပြီး ရလဒ်တွေ share လုပ်ဖို့ **Invite people** ကို နှိပ်နိုင်ပါတယ်။
* Right sidebar ထဲက **Comments** ကို နှိပ်ပြီး ကိုယ့် comment ကို ရေးပါ။ Team နဲ့ မျှဝေဖို့ **Comment** ကို နှိပ်ပါ။ [Comments ထည့်ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/comments/#global-comments) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Collection run တစ်ခုကို ဖျက်ခြင်း

Collection run တစ်ခုကို ဖျက်ဖို့ — workbench ရဲ့ ညာဘက်အပေါ်က **View more actions** ကို နှိပ်ပြီး **Delete** ကို ရွေးပါ။ အတည်ပြုဖို့ **Delete** ကို ထပ်နှိပ်ပါ။

ကိုယ့် team ရဲ့ [Postman Package Library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) ကနေ packages တွေ import လုပ်တဲ့ scripts တွေပါတဲ့ collections တွေကိုလည်း run နိုင်ပါတယ်။ Package library ထဲ [packages တွေ ထည့်နည်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#add-a-package) နဲ့ [scripts တွေထဲ packages import လုပ်နည်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#import-a-package) ကို လေ့လာနိုင်ပါတယ်။ npm ဒါမှမဟုတ် JSR package registries ကနေ [external packages တွေ import လုပ်တဲ့](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) collections တွေကိုလည်း run နိုင်ပါတယ်။

## Collection ကို နောက်တစ်ကြိမ် run ခြင်း

Collection run ရဲ့ ရလဒ်တွေကို ပြန်သုံးသပ်ပြီးနောက် — collection ကို နောက်တစ်ကြိမ် run လို့ရပါတယ်။ ဥပမာ — ကျဆုံးခဲ့တဲ့ test တစ်ခုရဲ့ code ကို တည်းဖြတ်ပြီး test အောင်မြင်မလားဆိုတာ စစ်ဖို့ collection ကို နောက်တစ်ကြိမ် run နိုင်ပါတယ်။

Run results ကနေ collection ကို နောက်တစ်ကြိမ် run ဖို့ — အောက်ပါတစ်ခုခုကို လုပ်ပါ:

* Settings တွေ အတိုင်းပဲ collection ကို နောက်တစ်ကြိမ် run ဖို့ **Run Again** ကို နှိပ်ပါ။
* Collection အတွက် run အသစ်တစ်ခု configure လုပ်ဖို့ **New Run** ကို နှိပ်ပါ။ Settings တွေ ပြောင်းလဲပြီး **Start run** ကို ရွေးပြီး နောက်တစ်ကြိမ် run နိုင်ပါတယ်။
* Collection အတွက် runs တွေကို automate လုပ်ဖို့ **Automate Run** ကို နှိပ်ပါ။ [run တစ်ခု schedule လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/), [Postman CLI နဲ့ run လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-collections/) ဒါမှမဟုတ် [Postman CLI နဲ့ runs တွေကို CI/CD pipeline နဲ့ ပေါင်းစပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-run-collection/#run-a-collection-in-cicd) တို့ လုပ်နိုင်ပါတယ်။

Requests တွေရဲ့ ရွေးချယ်မှု၊ အစဉ် ဒါမှမဟုတ် တခြား settings တွေ ပြောင်းခဲ့ရင် — custom order နဲ့ configuration က run results တွေနဲ့အတူ save ဖြစ်ပါတယ်။

ဒီနောက်ပိုင်း ကိုယ့် custom configuration နဲ့ collection ကို ပြန် run ချင်ရင် — collection ထဲက **Runs** tab မှာ [အရင်က run ခဲ့တာတွေ ကြည့်ပြီး](#past-runs-တွေ-ကြည့်ရှုခြင်း) run တစ်ခုဘေးက **View Report** ကို နှိပ်ပြီး collection run results ကို ဖွင့်ပါ။ အဲဒီကနေ settings တွေ အတိုင်းပဲ နောက်တစ်ကြိမ် run ဖို့ **Run Again** ကို နှိပ်နိုင်ပါတယ်။

## Collection run အကြီးကြီးတွေ troubleshoot လုပ်ခြင်း

Collection run တစ်ခုက — requests အများကြီး ပါရင်၊ requests နဲ့ responses တွေက size ကြီးရင် ဒါမှမဟုတ် iterations အရေအတွက် များရင် run အကြီးကြီး ဖြစ်နိုင်ပါတယ်။ Collection run အကြီးကြီးတွေအတွင်း — ကိုယ့် browser ဒါမှမဟုတ် computer က memory ကုန်သွားပြီး collection runs တွေရဲ့ performance ကျဆင်းနိုင်ပါတယ်။

Postman web app ကို configuration အနည်းငယ် ပြောင်းပြီး collection run အကြီးကြီးတွေအတွက် သုံးနိုင်ပါတယ်။ Performance ပိုကောင်းချင်ရင် — collection run အကြီးကြီးတွေအတွက် Postman desktop app ကို သုံးဖို့ အကြံပြုပါတယ်။ Postman desktop app က ကိုယ့် computer ရဲ့ disk space ကို သုံးတာကြောင့် — run အကြီးကြီးတွေအတွင်း memory ပိုရနိုင်ပါတယ်။

[Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) ကို collection run အကြီးကြီးတွေနဲ့ သုံးနေရင် — browser ထဲ memory ပိုရအောင်နဲ့ collection runs တွေရဲ့ performance ကောင်းအောင် အောက်ပါတွေ လုပ်နိုင်ပါတယ်:

* [Collection run configure လုပ်တုန်းက](#collection-run-တစ်ခု-configure-လုပ်ခြင်း) **Persist responses for a session** checkbox ကို မရွေးထားပါနဲ့။
* [Collection run configure လုပ်တုန်းက](#collection-run-တစ်ခု-configure-လုပ်ခြင်း) **Turn off logs during run** checkbox ကို ရွေးပါ။

[Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို collection run အကြီးကြီးတွေနဲ့ သုံးနေရင် — computer ထဲ memory ပိုရအောင် အောက်ပါတွေ လုပ်နိုင်ပါတယ်:

* [Collection run configure လုပ်တုန်းက](#collection-run-တစ်ခု-configure-လုပ်ခြင်း) **Persist responses for a session** checkbox ကို မရွေးထားပါနဲ့။
* Local data တွေ ရှင်းပြီး Postman ကို ပြန်စပါ။ Postman desktop app ကို ဖွင့်ပြီး computer ရဲ့ menu bar ထဲက **Help** ကို နှိပ်ပါ၊ ပြီးရင် **Clear Cache and Reload** ကို နှိပ်ပါ။
* Computer ပေါ်က disk space တွေ ရှင်းထုတ်ပါ။
* [Collection run configure လုပ်တုန်းက](#collection-run-တစ်ခု-configure-လုပ်ခြင်း) **Turn off logs during run** checkbox ကို ရွေးပါ။
* Collection run ထဲမှာ requests အများကြီး ပါနေရင် — requests တွေကို collection ငယ်များစွာ ခွဲပြီး တစ်ခုချင်းစီ သပ်သပ်ရေ run ပါ။
* [Collection run configure လုပ်တုန်းက](#collection-run-တစ်ခု-configure-လုပ်ခြင်း) iterations အရေအတွက်ကို လျှော့ပါ။

Collection run အကြီးကြီးအတွင်း Postman desktop app ကို သုံးနေရင် — computer မှာ memory ကုန်သွားတဲ့အခါ responses တွေ သိမ်းလို့ မရတော့တာမျိုး ဖြစ်နိုင်ပါတယ်။ Responses အသစ်တွေ သိမ်းဖို့ နေရာရအောင် Postman က အစောပိုင်းက သိမ်းထားတဲ့ responses တွေကို ဖျက်ပစ်နိုင်ပါတယ်။ Run အတွင်း memory ကုန်ခဲ့ရင် run results ကနေ အကြောင်းကြားပေးပါတယ်။ အကြောင်းကြားချက်ထဲက **Retry Run** ကို နှိပ်ပြီး settings တွေ အတိုင်းပဲ collection ကို နောက်တစ်ကြိမ် run နိုင်ပါတယ်။

Collection run အကြီးကြီးတစ်ခုအတွက် နောက်ထပ် အကူအညီ လိုရင် — log files တွေကို ကိုယ့် request နဲ့အတူ [Postman support](https://www.postman.com/support/) ကို ဆက်သွယ်ပါ။ [Postman logs တွေကို ရှာဖွေနည်း](https://learning.postman.com/docs/getting-started/troubleshooting-inapp/#locating-postman-logs) ကို လေ့လာနိုင်ပါတယ်။

## Collection runs တွေကို export လုပ်ခြင်း

Collection Runner ကနေ ရလဒ်တွေကို export လုပ်ပြီး — collection run results တွေကို တခြားသူတွေနဲ့ share လုပ်နိုင်ပါတယ်။

Collection run report တစ်ခုကို export လုပ်နိုင်တဲ့ option က [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) မှာ ရပြီး — Postman web app မှာတော့ မရပါဘူး။

Collection run တစ်ခုကို export လုပ်ဖို့:

1. **Collection Runner** ထဲမှာ collection run ကို ဖွင့်ပါ။ Run မဖွင့်ထားရင် sidebar ထဲက **History** ကို သုံးပြီးလည်း collection run ကို ဝင်လို့ရပါတယ်။
2. ညာဘက်အပေါ်က **View more actions** ကို နှိပ်ပြီး collection run ကို download လုပ်ဖို့ **Export run results** ကို နှိပ်ပါ။
3. Collection run ကို သိမ်းမယ့် နေရာတစ်ခု ရွေးပြီး **Save** ကို နှိပ်ပါ။

File တစ်ခုအဖြစ် export လုပ်ထားတဲ့ collection run တစ်ခုရဲ့ ရလဒ်တွေကို import လုပ်နိုင်ပါတယ်။ Postman footer ထဲက **Tools > Runner** ကို နှိပ်ပြီး export လုပ်ထားတဲ့ file ကို Collection Runner ထဲကို ဆွဲချပါ။

## Run history ကြည့်ရှုခြင်း

Collection တစ်ခုချင်းစီမှာ **Runs** tab ပါပြီး — အရင်က run ခဲ့တဲ့ functional runs, scheduled runs နဲ့ performance runs တွေကို ကြည့်ရှုနိုင်ပါတယ်။ Test အရေအတွက်နဲ့ average response times စတဲ့ အသေးစိတ်တွေကိုလည်း ကြည့်နိုင်ပါတယ်။

### Past runs တွေ ကြည့်ရှုခြင်း

**Functional** tab မှာ — collection runs ဘယ်နှစ်ခု ပြမလဲ ရွေးချယ်ဖို့ controls တွေ ပါပါတယ်။ ပြသထားတဲ့ runs တွေကို user, run status နဲ့ source (Collection Runner ဒါမှမဟုတ် Postman CLI) အလိုက် filter လုပ်နိုင်ပါတယ်။

Collection run တစ်ခုချင်းစီအတွက် အောက်ပါတွေကို ပြသပါတယ်:

* Run တစ်ခုချင်းစီအတွက် checkbox တစ်ခုနဲ့ runs အားလုံး ရွေးဖို့ option တစ်ခု။ Run တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရွေးပြီး **Delete** ကို နှိပ်ရင် ဖျက်ပစ်ပါတယ်။
* Collection run စတင်ခဲ့တဲ့ အချိန်။
* Run ရဲ့ source, duration, tests အားလုံး, passed tests, failed tests, skipped tests နဲ့ average response time။ ဒီအရာတွေထဲက တစ်ခုခုကို နှိပ်ရင် table ကို အဲဒီအရာနဲ့ စီပါတယ်။ နောက်တစ်ခါ ထပ်နှိပ်ရင် စီထားတဲ့ အစဉ် ပြောင်းပါတယ်။
* Teammates တွေ collection run အကြောင်း ရေးထားတဲ့ comments စုစုပေါင်း အရေအတွက်။ Run results ဆီ သွားပြီး comments တွေကို sidebar မှာ ဖွင့်ဖို့ **(comments အရေအတွက်)** ကို နှိပ်ပါ။

Item တစ်ခုပေါ်မှာ mouse ချ (hover) ရင် အောက်ပါ option တွေ ပေါ်လာပါတယ်:

* **View Report** — Collection run အတွက် ရလဒ်အပြည့်အစုံ ဖွင့်ဖို့ နှိပ်ပါ။ [Run results များ debug လုပ်ခြင်း](#run-results-များ-debug-လုပ်ခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
* **Share collection run** — ရလဒ်တွေကို team member တစ်ယောက်နဲ့ share လုပ်ဖို့ နှိပ်ပါ။ Collection ရဲ့ run results တွေကို ကြည့်ဖို့ teammates တွေရဲ့ နာမည်, groups ဒါမှမဟုတ် email addresses တွေ ထည့်ပြီး invite လုပ်ပါ။ ဒါမှမဟုတ် teammates တွေနဲ့ share လုပ်ဖို့ link ရဖို့ **Copy Link** ကို နှိပ်ပါ။

### Scheduled runs တွေ ကြည့်ရှုခြင်း

**Scheduled** tab က လက်ရှိ collection အတွက် scheduled runs အားလုံးကို ပြပါတယ်။ Scheduled run တစ်ခုချင်းစီအတွက် အောက်ပါတွေကို ပြသပါတယ်:

* လာမယ့် run ရဲ့ scheduled time။
* Scheduled run ရဲ့ နာမည်။
* Scheduled run နဲ့ ဆက်စပ်ထားတဲ့ environment (ရှိရင်)။

Item တစ်ခုပေါ်မှာ mouse ချရင် အောက်ပါ controls တွေ ပေါ်လာပါတယ်:

* **View** — Scheduled collection run ရဲ့ နောက်ဆုံး ရလဒ်တွေ အသေးစိတ်ပါတဲ့ စာမျက်နှာတစ်ခု ဖွင့်ဖို့ နှိပ်ပါ။
* **View more actions** — Schedule ကို [pause, resume, edit ဒါမှမဟုတ် delete](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/#pause-or-resume-a-scheduled-run) လုပ်ဖို့ နှိပ်ပါ။

### Performance runs တွေ ကြည့်ရှုခြင်း

**Performance** tab က collection အတွက် အရင်က [performance runs](https://learning.postman.com/docs/tests-and-scripts/performance-testing/performance-test-configuration/) တွေကို ပြပါတယ်။ Run တစ်ခုချင်းစီအတွက် — virtual users (VUs) အရေအတွက်, duration, စုစုပေါင်း requests အရေအတွက်, တစ်စက္ကန့် requests အရေအတွက်, average response time နဲ့ error rate အပါအဝင် metrics တွေကို ကြည့်ရှုနိုင်ပါတယ်။

Run တစ်ခုကို နှိပ်ရင် — performance run အတွက် graph တစ်ခုနဲ့ အသေးစိတ်တွေ အပြည့်အစုံ ကြည့်ရပါတယ်။ [Performance metrics တွေ ကြည့်ရှုခြင်း](https://learning.postman.com/docs/tests-and-scripts/performance-testing/performance-test-metrics/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Collection runs တွေကို automate လုပ်ခြင်း

Collections တွေကို ကိုယ်တိုင် run လုပ်တာအပြင် — Postman cloud မှာ သတ်မှတ်ထားတဲ့ အချိန်တွေမှာ အလိုအလျောက် run ဖို့ [collections တွေ schedule လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/) ကိုလည်း လုပ်နိုင်ပါတယ်။ ကိုယ့် API projects တွေထဲ automation တည်ဆောက်ဖို့ collection runs တွေကို Postman ရဲ့ တခြား utilities တွေနဲ့လည်း သုံးနိုင်ပါတယ်:

* [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) command-line interface ကို သုံးပြီး — ကိုယ့် development pipeline ရဲ့ အစိတ်အပိုင်းအနေနဲ့ collections တွေ run လုပ်နိုင်သလို [monitor run တစ်ခုကို trigger လုပ်ပြီး](https://learning.postman.com/docs/postman-cli/postman-cli-run-monitor/) test outcomes တွေကို တုံ့ပြန်ပြီး ကိုယ့် API performance ကို အထောက်အကူပြုနိုင်ပါတယ်။
* Collection တစ်ခုကို [monitor](/docs/postman/intro-monitors) တစ်ခုနဲ့ ချိတ်ဆက်ထားရင် — collection runs တွေကို schedule လုပ်ပြီး ပြဿနာတစ်ခုခု ရှိရင် အသိပေးချက် ရနိုင်ပါတယ်။
* ကိုယ့်ရဲ့ custom payload တစ်ခုနဲ့ သတ်မှတ်ထားတဲ့ အချိန်မှာ collection run တစ်ခု trigger လုပ်ဖို့ [collection webhook](https://learning.postman.com/docs/tests-and-scripts/running-collections/collection-webhooks/) တစ်ခုကိုလည်း setup လုပ်နိုင်ပါတယ်။

## နောက်ထပ်အဆင့်များ

သင်ယူပြီးသား Collection Runner အခြေခံတွေကို အောက်ပါ topic တွေနဲ့ ဆက်ပြီး တည်ဆောက်နိုင်ပါတယ်:

* Collection ထဲက requests တွေကို run ဖို့ conditional sequences ပါတဲ့ workflows တည်ဆောက်ဖို့ scripts တွေ သုံးပါ။ ပိုလေ့လာချင်ရင် [collection run တစ်ခုထဲက request order ကို customize လုပ်ခြင်း](/docs/postman/building-workflows) ကို သွားပါ။

* ကိုယ့် APIs တွေရဲ့ လုပ်ဆောင်ချက်တွေကို အလိုအလျောက် test လုပ်ဖို့ — collections တွေကို schedule တစ်ခုပေါ်မှာ run ပါ။ ပိုလေ့လာချင်ရင် [collection runs တွေကို schedule ပေါ်မှာ automate လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/) ကို သွားပါ။

* Functional API tests တွေအတွက် သုံးနေတဲ့ requests, collections နဲ့ environments တွေနဲ့ပဲ — ကိုယ့် API ရဲ့ performance ကို test လုပ်ဖို့ Collection Runner ကို သုံးပါ။ ပိုလေ့လာချင်ရင် [API performance test လုပ်ဖို့ user traffic တွေ simulate လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/performance-testing/testing-api-performance/) ကို သွားပါ။
