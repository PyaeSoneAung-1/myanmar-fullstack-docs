---
title: "Postman CLI commands နဲ့ options ခြုံငုံသုံးသပ်ချက်"
description: "Postman CLI ရဲ့ command တွေကို category အလိုက် ခြုံငုံဖော်ပြချက် — authentication, workspace, collection, environment, globals, flows, governance, mock, dataset, search, webhooks စတဲ့ command အမျိုးအစားအားလုံး ပါဝင်သည်"
order: 158
source: "https://learning.postman.com/docs/postman-cli/postman-cli-options/"
status: translated
updated: 2026-09-03
---

Postman CLI command တချို့ ရနိုင်မှုက ကိုယ့် [Postman plan](https://www.postman.com/pricing/) ပေါ်မှာ မူတည်ပါတယ်။

[Postman CLI](/docs/postman/postman-cli-overview) က command line ကနေ Postman နဲ့ အလုပ်လုပ်ဖို့ command အစုံအလင်ကို ပေးပါတယ်။ ဒီ commands တွေကို လုပ်ဆောင်ချက် (functionality) အလိုက် စုစည်းထားတာကြောင့် — ကိုယ့် workflow အတွက် လိုအပ်တဲ့ tools တွေကို မြန်မြန် ရှာတွေ့နိုင်ပါတယ်။

## Command categories (Command အမျိုးအစားများ)

Postman CLI commands တွေကို အောက်ပါ category တွေအဖြစ် စုစည်းထားပါတယ်:

### Basic CLI commands

* [`postman --help`](https://learning.postman.com/docs/postman-cli/postman-cli-basic/#postman) — Help အချက်အလက်တွေကို ပြသပါတယ်။
* [`postman --version`](https://learning.postman.com/docs/postman-cli/postman-cli-basic/#postman) — Version အချက်အလက်ကို ပြသပါတယ်။

### Authentication commands

* [`postman login`](https://learning.postman.com/docs/postman-cli/postman-cli-auth/#postman-login) — Postman ထဲကို sign in လုပ်ပါတယ်။
* [`postman logout`](https://learning.postman.com/docs/postman-cli/postman-cli-auth/#postman-logout) — Postman ကနေ sign out လုပ်ပါတယ်။

### Workspace commands

* [`postman workspace list`](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-list) — ကိုယ် ဝင်ရောက်ခွင့် ရှိတဲ့ Postman workspaces အားလုံးကို စာရင်းပြုစုပါတယ်။
* [`postman workspace prepare`](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-prepare) — Local collections နဲ့ environments တွေကို validate လုပ်ပြီး ပြင်ဆင်ပါတယ်။
* [`postman workspace lint`](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-lint) — Workspace configuration နဲ့ ၎င်းရဲ့ elements တွေကို lint လုပ်ပါတယ်။
* [`postman workspace push`](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-push) — Local အပြောင်းအလဲတွေကို Postman workspaces တွေဆီ push လုပ်ပါတယ်။
* [`postman workspace connect-git`](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-connect-git) — Workspace တစ်ခုကို Git repository တစ်ခုနဲ့ ချိတ်ဆက်ပါတယ်။
* [`postman workspace pull`](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-pull) — Workspace တစ်ခုရဲ့ elements တွေကို ကိုယ့် local folder ထဲကို ဆွဲယူ (pull) ပါတယ်။

### Collection commands

* [`postman collection run`](https://learning.postman.com/docs/postman-cli/postman-cli-collections/#postman-collection-run) — Options နဲ့ configurations အများအပြားနဲ့ collections တွေကို run လုပ်ပါတယ်။
* [`postman collection migrate`](https://learning.postman.com/docs/postman-cli/postman-cli-collections/#postman-collection-migrate) — Collections တွေကို v2.1 ကနေ v3 format ဆီ migrate လုပ်ပါတယ်။
* [`postman collection lint`](https://learning.postman.com/docs/postman-cli/postman-cli-collections/#postman-collection-lint) — Collection တစ်ခုကို v3 format schema နဲ့ ကိုက်ညီမှု ရှိမရှိ validate လုပ်ပါတယ်။

### Environment commands

* [`postman environment lint`](https://learning.postman.com/docs/postman-cli/postman-cli-environments/#postman-environment-lint) — Local environment file တစ်ခုကို ၎င်းရဲ့ schema နဲ့ ကိုက်ညီမှု ရှိမရှိ validate လုပ်ပါတယ်။

### Globals commands

* [`postman globals lint`](https://learning.postman.com/docs/postman-cli/postman-cli-globals/#postman-globals-lint) — Local global variables file တစ်ခုကို ၎င်းရဲ့ schema နဲ့ ကိုက်ညီမှု ရှိမရှိ validate လုပ်ပါတယ်။

### Request commands

* [`postman request`](https://learning.postman.com/docs/postman-cli/postman-cli-requests/#postman-request) — Command line ကနေ HTTP requests တစ်ခုချင်းစီကို test လုပ်ပြီး debug လုပ်ပါတယ်။

### Monitoring and performance commands

* [`postman monitor run`](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-monitor-run) — CI/CD pipelines တွေမှာ monitor runs တွေကို trigger လုပ်ပါတယ်။
* [`postman runner start`](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-runner-start) — Private API monitoring runners တွေကို စတင်ပါတယ်။
* [`postman performance run`](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-performance-run) — Performance tests တွေကို configure လုပ်ပြီး run လုပ်ပါတယ်။

### Application commands

* [`postman app test`](https://learning.postman.com/docs/postman-cli/postman-cli-application/#postman-app-test) — ကိုယ့် application ရဲ့ ရှိပြီးသား UI test command ကို run လုပ်ပြီး — run အတွင်း ထွက်လာတဲ့ network traffic ကို ဖမ်းယူကာ — ကိုယ့် collections ထဲက requests တွေနဲ့ တွေ့ရှိရတဲ့ API calls တွေ ကိုက်ညီမှု ရှိမရှိ validate လုပ်ပါတယ်။

* [`postman app setup-capture`](https://learning.postman.com/docs/postman-cli/postman-cli-application/#postman-app-setup-capture) — ကိုယ့် Playwright tests တွေအတွက် automatic network capture ကို setup လုပ်ပါတယ်။

* [`postman app init`](https://learning.postman.com/docs/postman-cli/postman-cli-application/#postman-app-init) — Deprecated (အသုံးမပြုတော့ပါ)။ ကိုယ့် project ကို Application Inventory application အဖြစ် initialize လုပ်ပါတယ်။

### Flows commands

* [`postman flows list`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-list) — Workspace တစ်ခုထဲက flows တွေကို စာရင်းပြုစုပါတယ်။
* [`postman flows trigger`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-trigger) — Deploy လုပ်ထားတဲ့ flows တွေကို run ဖို့ trigger လုပ်ပါတယ်။
* [`postman flows deploy`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-deploy) — Flows တွေကို Postman cloud ထဲကို deploy လုပ်ပါတယ်။
* [`postman flows run`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-run) — ကိုယ့် repo ကနေ flows တွေကို local မှာ run လုပ်ပါတယ်။
* [`postman flows update`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-update) — Flow settings တွေကို update လုပ်ပါတယ်။
* [`postman flows list-runs`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-list-runs) — Flow run history တွေကို ကြည့်ရှုပါတယ်။
* [`postman flows get-run`](https://learning.postman.com/docs/postman-cli/postman-cli-flows/#postman-flows-get-run) — Flow runs တစ်ခုချင်းစီကို ခွဲခြမ်းစိတ်ဖြာပါတယ်။

### API governance commands

* [`postman spec lint`](https://learning.postman.com/docs/postman-cli/postman-cli-governance/#postman-spec-lint) — API specifications တွေကို governance rules တွေနဲ့ validate လုပ်ပါတယ်။

  Postman CLI version 1.39.1 နဲ့ ၎င်းနောက်ပိုင်းမှာ — ဒီ command က API governance အတွေ့အကြုံအသစ်ကိုလည်း ထောက်ပံ့ပေးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် — [Define and enforce API standards with governance groups in Postman](https://learning.postman.com/docs/api-catalog/governance-groups/overview/) ကို ကြည့်ပါ။

* [`postman api lint`](https://learning.postman.com/docs/postman-cli/postman-cli-governance/#postman-api-lint) — Postman API Builder specifications တွေကို စစ်ဆေးပါတယ် (Postman v11 မှာပဲ ရပါတယ်)။

### Mock server commands

* [`postman mock run`](https://learning.postman.com/docs/postman-cli/postman-cli-mock/#postman-mock-run) — Configuration files တွေကနေ mock servers တွေကို စတင်ပါတယ်။
* [`postman mock generate`](https://learning.postman.com/docs/postman-cli/postman-cli-mock/#postman-mock-generate) — Collection ဒါမှမဟုတ် OpenAPI specification တစ်ခုကနေ run လို့ရတဲ့ mock တစ်ခုကို ထုတ်ပေးပါတယ်။
* [`postman mock get`](https://learning.postman.com/docs/postman-cli/postman-cli-mock/#postman-mock-get) — Mock တစ်ခုရဲ့ အသေးစိတ်နဲ့ run status ကို ပြသပါတယ်။
* [`postman mock list`](https://learning.postman.com/docs/postman-cli/postman-cli-mock/#postman-mock-list) — Directory တစ်ခုအောက်မှာ တွေ့ရတဲ့ mocks တွေကို စာရင်းပြုစုပါတယ်။
* [`postman mock delete`](https://learning.postman.com/docs/postman-cli/postman-cli-mock/#postman-mock-delete) — Mock တစ်ခုကို အပြီးတိုင် ဖယ်ရှားပါတယ်။

### Dataset commands

* [`postman dataset create`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-create) — Dataset အသစ်တစ်ခု ဖန်တီးပါတယ်။

* [`postman dataset source`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-source) — Dataset တစ်ခုအတွက် configure လုပ်ထားတဲ့ data sources တွေကို စီမံခန့်ခွဲပါတယ်။

* [`postman dataset list`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-list) — Directory တစ်ခုထဲက datasets တွေကို စာရင်းပြုစုတာ ဒါမှမဟုတ် dataset တစ်ခုရဲ့ summary အချက်အလက်ကို ပြသပါတယ်။

* [`postman dataset get`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-get) — Dataset တစ်ခုရဲ့ metadata ကို ပြသပါတယ်။

* [`postman dataset query`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-query) — Dataset တစ်ခုပေါ်မှာ SQL query တစ်ခု run လုပ်ပါတယ်။

* [`postman dataset view`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-view) — Saved SQL queries တွေကို ဖန်တီး, စီမံပြီး run လုပ်ပါတယ်။

* [`postman dataset delete`](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/#postman-dataset-delete) — Dataset တစ်ခုကို ဖျက်ပစ်ပါတယ်။

### Search commands

* [`postman search`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search) — ကိုယ့် workspace တစ်ခွင်လုံးမှာ Postman entities တွေကို ရှာဖွေပါတယ်။

* [`postman search requests`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-requests) — Requests တွေကို name, keyword ဒါမှမဟုတ် URL နဲ့ ရှာဖွေပါတယ်။

* [`postman search collections`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-collections) — Collections တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

* [`postman search workspaces`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-workspaces) — Workspaces တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

* [`postman search flows`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-flows) — Flows တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

* [`postman search mocks`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-mocks) — Mocks တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

* [`postman search environments`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-environments) — Environments တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

* [`postman search specs`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-specs) — API specifications တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

* [`postman search documents`](https://learning.postman.com/docs/postman-cli/postman-cli-search/#postman-search-documents) — Documents တွေကို name ဒါမှမဟုတ် keyword နဲ့ ရှာဖွေပါတယ်။

### Simulator commands

* [`postman simulate run`](https://learning.postman.com/docs/postman-cli/postman-cli-simulator/#postman-simulate-run) — Configuration file တစ်ခုကို သုံးပြီး simulation တစ်ခု run လုပ်ပါတယ်။

### Publish API versions commands

* [`postman api publish`](https://learning.postman.com/docs/postman-cli/postman-cli-publish-api-versions/) — Postman API Builder ထဲမှာ API versions တွေကို publish လုပ်ပါတယ် (Postman v11 မှာပဲ ရပါတယ်)။

### SDK commands

* [`postman sdk init`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-init) — `.postman/config.json` SDK configuration file ကို ဖန်တီး ဒါမှမဟုတ် update လုပ်ပါတယ်။
* [`postman sdk generate`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-generate) — Collection ဒါမှမဟုတ် API specification တစ်ခုကနေ client SDK တစ်ခု ထုတ်ပေးပါတယ်။
* [`postman sdk track`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-track) — ထုတ်ပေးလိုက်တဲ့ SDK တစ်ခုအတွက် change-tracking manifest ကို update လုပ်ပါတယ်။
* [`postman sdk list`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-list) — SDK build jobs တွေနဲ့ ၎င်းတို့ရဲ့ status တွေကို စာရင်းပြုစုပါတယ်။
* [`postman sdk fetch`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-fetch) — Server-side build တစ်ခုကနေ ထုတ်ပေးထားတဲ့ SDK တစ်ခုကို download လုပ်ပါတယ်။
* [`postman sdk connect github`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-connect-github) — Automated SDK regeneration အတွက် Postman entity တစ်ခုကို GitHub repository တစ်ခုနဲ့ ချိတ်ဆက်ပါတယ်။
* [`postman sdk connections list`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-connections-list) — Collection ဒါမှမဟုတ် specification တစ်ခုအတွက် GitHub connections တွေကို စာရင်းပြုစုပါတယ်။
* [`postman sdk connections delete`](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/#postman-sdk-connections-delete) — GitHub connection တစ်ခုကို ၎င်းရဲ့ numeric connection ID နဲ့ ဖျက်ပစ်ပါတယ်။

### Coding agents တွေအတွက် CLI commands

* [`postman context`](https://learning.postman.com/docs/postman-cli/postman-cli-context/#postman-context) — Coding agent တစ်ခုက တိကျတဲ့ code ထုတ်လုပ်ဖို့ လိုအပ်တဲ့ အချက်အလက်အားလုံးကို စုစည်းပေးပါတယ်။

### Webhooks commands

* [`postman webhook create`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-create) — သတ်မှတ်ထားတဲ့ workspace ထဲမှာ webhook အသစ်တစ်ခု ဖန်တီးပါတယ်။

* [`postman webhook list`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-list) — သတ်မှတ်ထားတဲ့ workspace ထဲက webhooks အားလုံးကို စာရင်းပြုစုပါတယ်။

* [`postman webhook delete`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-delete) — Webhook တစ်ခုကို ဖျက်ပစ်ပါတယ်။

* [`postman webhook status`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-status) — Webhook တစ်ခုရဲ့ အသေးစိတ်ကို ပြသပါတယ် — ၎င်းရဲ့ title, လက်ရှိ status (active ဒါမှမဟုတ် inactive), invoke URL နဲ့ ဖန်တီးခဲ့တဲ့ ရက်စွဲ အပါအဝင်။

* [`postman webhook start`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-start) — Pause လုပ်ထား ဒါမှမဟုတ် inactive ဖြစ်နေတဲ့ webhook တစ်ခုကို စတင်ပြီး — events တွေ စတင် လက်ခံနိုင်စေပါတယ်။

* [`postman webhook pause`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-pause) — Active ဖြစ်နေတဲ့ webhook တစ်ခုကို pause လုပ်ပြီး — events တွေ လက်ခံတာကို ရပ်တန့်စေပါတယ်။

* [`postman webhook forward`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-forward) — External services (Stripe ဒါမှမဟုတ် Slack စတာတွေ) ကနေ webhook တစ်ခုပေါ်မှာ လက်ခံရရှိတဲ့ events တွေကို ကိုယ့် local server ရဲ့ port တစ်ခုဆီ forward လုပ်ပါတယ်။

* [`postman webhook requests`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-requests) — Webhook တစ်ခု လက်ခံရရှိထားတဲ့ requests တွေကို စာရင်းပြုစု, စစ်ဆေးပြီး ပြန် run (replay) လုပ်ပါတယ်။

* [`postman webhook scripts set`](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks#postman-webhook-scripts-set) — Webhook တစ်ခု run လုပ်တဲ့ script ကို ဖန်တီး ဒါမှမဟုတ် update လုပ်ပါတယ်။

## စတင်အသုံးပြုခြင်း (Get started)

Postman CLI ကို စတင်သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. [Postman CLI ကို install လုပ်ပါ](/docs/postman/postman-cli-installation)။
2. ကိုယ့် workflow နဲ့ ကိုက်ညီတဲ့ command categories တွေကို လေ့လာပါ။

Category page တစ်ခုချင်းစီမှာ — Postman CLI ကို ကိုယ့် development နဲ့ testing workflows တွေထဲ ပေါင်းစပ်ဖို့ ကူညီပေးမယ့် အသေးစိတ် options, examples နဲ့ use cases တွေ ပါဝင်ပါတယ်။
