---
title: "Postman မှာ အလုပ်များကို Share လုပ်ခြင်း (Share Your Work in Postman)"
description: "Postman မှာ ကိုယ့်အလုပ်တွေကို ဘယ်လို share လုပ်မလဲ — workspace မျှဝေခြင်း, collections/elements တွေကို link, Run in Postman button, Postman API, URL တွေနဲ့ မျှဝေခြင်း, request-response sharing, Guests နဲ့ share လုပ်ခြင်း"
order: 26
source: "https://learning.postman.com/docs/collaborating-in-postman/sharing/"
status: translated
updated: 2026-09-02
---

Postman နဲ့ — developers, testers, architects နဲ့ တခြား business stakeholders တွေနဲ့အတူ ကိုယ့် APIs တွေကို [ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်](https://www.postman.com/api-platform/api-collaboration/)။ ကိုယ့် workspace ကို share လုပ်ခြင်းအားဖြင့် Postman ထဲက ကိုယ့်အလုပ်တွေကို မျှဝေနိုင်ပါတယ်။ Collections, requests, examples နဲ့ [flows](https://learning.postman.com/flows/overview/) တွေအပါအဝင် — Postman elements တစ်ခုချင်းစီကိုလည်း သပ်သပ်ရေ share လုပ်နိုင်ပါတယ်။

## ကိုယ့် Postman workspace ကို share လုပ်ခြင်း

Workspace တစ်ခုကို — **Invite** option ကို သုံးပြီး ဒါမှမဟုတ် ကိုယ့် workspace ဆီ link တစ်ခု ကူးယူပြီး share လုပ်နိုင်ပါတယ်။ အသေးစိတ်ကို [Workspaces တွေ share လုပ်ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#share-workspaces) မှာ ကြည့်ပါ။

ပြင်ပ partners တွေနဲ့ အလုပ်တွေ မျှဝေချင်ရင် — [Partner Workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/partner-workspaces/overview/) တစ်ခုကို သုံးပါ။ ကမ္ဘာတစ်ဝှမ်းက developers တွေနဲ့ မျှဝေချင်ရင် — [public workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) တစ်ခုကို သုံးပါ။

## Postman collections နဲ့ တခြား elements တွေကို share လုပ်ခြင်း

Collections, APIs, flows နဲ့ environments တွေကို ကိုယ့် team အတွင်းရော အပြင်ကိုပါ share လုပ်နိုင်ပြီး — ကိုယ့် organization ထဲက [Guests (ဧည့်သည်များ)](#guests-တွေနဲ့-collections-share-လုပ်ခြင်း) တွေကိုလည်း ကိုယ့် collections တွေကို ကြည့်ရှုခွင့် ပေးနိုင်ပါတယ်။

တခြား Postman elements တွေကိုတော့ နည်းလမ်း ကွဲပြားစွာ share လုပ်ပါတယ်:

* Flow တစ်ခုကို share လုပ်ဖို့ — [flows တွေဆီ links မျှဝေခြင်းနဲ့ websites တွေမှာ flows တွေ embed လုပ်ခြင်း](https://learning.postman.com/flows/build-flows/organize/share-and-embed-flows/) ကို ကြည့်ပါ။
* Collection run တစ်ခုကို share လုပ်ဖို့ — [Collection Runner ဖြင့် Collection Runs လုပ်ခြင်း](/docs/postman/intro-to-collection-runs) ကို ကြည့်ပါ။
* Collection တစ်ခုကို file အဖြစ် share လုပ်ဖို့ — [Postman မှာ data import နဲ့ export လုပ်ခြင်း](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-and-exporting-overview/) ကို ကြည့်ပါ။
* Monitor တစ်ခုကို share လုပ်ဖို့ — [Monitors တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/setting-up-monitor) ကို ကြည့်ပါ။

Postman elements တွေကို — လူတစ်ယောက်ချင်းစီ ရွေးပြီး ဒါမှမဟုတ် **Run in Postman** button, [Postman API](https://learning.postman.com/api-docs/api-reference/) ဒါမှမဟုတ် link တစ်ခု share လုပ်ခြင်းအားဖြင့် ကိုယ့် team နဲ့ မျှဝေနိုင်ပါတယ်။

**Run in Postman** button ကလွဲလို့ — တခြား sharing options အားလုံးမှာ link ကို လက်ခံရရှိတဲ့ user က link ကို Postman desktop app ထဲမှာ ဖွင့်ဖို့ option ရှိပါတယ်။ ဒီ setting ကို ပြောင်းချင်ရင်:

1. Postman header ထဲက **Settings** ဆီ သွားပါ
2. **Settings > General** ကို နှိပ်ပြီး **Application** အောက်မှာ **Always open in desktop app** ကို ပိတ်ပါ။

### Elements တွေကို team members တစ်ဦးချင်းစီအလိုက် share လုပ်ခြင်း

Team members တွေကို ရွေးပြီး Postman elements တွေ share လုပ်ဖို့:

1. Share လုပ်ချင်တဲ့ element ဘေးက **View more actions** ကို နှိပ်ပြီး **Share** ကို နှိပ်ပါ။

   Collection ထဲမှာ save မလုပ်ရသေးတဲ့ အပြောင်းအလဲတွေ ရှိရင် — save ပြီး share လုပ်မလား၊ save မလုပ်ဘဲ share လုပ်မလား ဒါမှမဟုတ် save ပြီး overwrite လုပ်မလား ဆိုပြီး prompt လုပ်ပါတယ်။

2. နာမည်, email address ဒါမှမဟုတ် [group နာမည်](https://learning.postman.com/docs/administration/managing-your-team/user-groups/) တစ်ခုကို ထည့်ပါ။
3. Editor role ရှိရင် — Viewer ဒါမှမဟုတ် Editor [role](https://learning.postman.com/docs/administration/roles-and-permissions/#element-based-roles) တစ်ခုကို သတ်မှတ်နိုင်သလို — share လုပ်နေတဲ့ element ကို [organization](https://learning.postman.com/docs/administration/managing-your-team/create-org/) တစ်ခုလုံး access လုပ်နိုင်သလားဆိုတာကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

   Request တစ်ခု ဒါမှမဟုတ် saved response တစ်ခုကို share လုပ်ရင် — ရှိပြီးသား roles တွေက collection ကနေ အမွေဆက်ခံပါတယ်။

4. Collection, collection folder, request ဒါမှမဟုတ် example တစ်ခုကို share လုပ်နေရင် — active environment တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ **Include environment** ကို နှိပ်ပြီး environment ကို ရွေးပါ။

   Share လုပ်မယ့် team members နဲ့ groups တွေအတွက် active environment ကို ပြောင်းချင်ရင် — collection, collection folder, request ဒါမှမဟုတ် example ကို သူတို့ဆီ နောက်တစ်ကြိမ် ပြန် share လုပ်ရပါမယ်။ Environment dropdown စာရင်းထဲက environment အသစ်တစ်ခုကို ရွေးပြီး **Invite** ကို နှိပ်ပါ။

5. **Invite** ကို နှိပ်ပါ။

Postman က element ကို share လုပ်ထားတဲ့ ရွေးထားသူတွေဆီ email ပို့ပေးပါတယ်။

### Run in Postman button သုံးပြီး share လုပ်ခြင်း

Website ဒါမှမဟုတ် README လိုမျိုး public page တစ်ခုမှာ **Run in Postman** button တစ်ခု embed လုပ်ပြီး collections တွေကို share လုပ်နိုင်ပါတယ်။

1. Share လုပ်ချင်တဲ့ collection ကနေ — **View more actions** ကို နှိပ်ပြီး **Share** ကို နှိပ်ပါ။
2. Share dialog ထဲကနေ **View more actions** ကို နှိပ်ပြီး **Run in Postman** ကို နှိပ်ပါ။
3. Code format တစ်ခု ရွေးပြီး **Copy Code** ကို နှိပ်ပါ။

Postman API Network ပေါ်က ကိုယ့် public collections တစ်ခုခုအတွက် **Run in Postman** button တစ်ခု ဖန်တီးနိုင်ပါတယ်။ **Run in Postman** button ဖန်တီးခြင်းနဲ့ သုံးခြင်းအကြောင်း ပိုသိချင်ရင် — [Run in Postman button တစ်ခု ဖန်တီးခြင်း](https://learning.postman.com/docs/publishing-your-api/run-in-postman/creating-run-button/) ကို ဝင်ကြည့်ပါ။

### Postman API သုံးပြီး share လုပ်ခြင်း

Postman API ကို သုံးပြီး collection JSON ကို share လုပ်ဖို့:

1. Share လုပ်ချင်တဲ့ collection ကနေ **Share** ကို နှိပ်ပါ။
2. **Via API** ကို နှိပ်ပါ။
3. **Get collection JSON using Collection Access Key** ကို နှိပ်ပါ။
4. Read-only collection access key တစ်ခု ဖန်တီးဖို့ **Generate New Key** ကို နှိပ်ပါ။ ဒီ key က လှုပ်ရှားမှု မရှိဘဲ ရက် ၆၀ ကြာရင် သက်တမ်းကုန်ပါတယ်။

   **Collection access keys တွေ share လုပ်ခြင်းမပြုမီ — ကိုယ့် collection ထဲက sensitive information တွေကို ဖယ်ရှားထားဖို့ သေချာပါစေ။**

5. (ထည့်စရာမလို) [Public elements တွေ စီမံခန့်ခွဲခွင့်](https://learning.postman.com/docs/collaborating-in-postman/manage-public-elements/) ရှိရင် — ဒီ collection access key ကို ကြည့်ရှု ဒါမှမဟုတ် revoke လုပ်ဖို့ [Manage public elements page](https://go.postman.co/manage-public) ပေါ်မှာ **Manage keys** ကို နှိပ်နိုင်ပါတယ်။ ကိုယ် ဖန်တီးထားတဲ့ collection access keys တွေကို ကိုယ့် [API keys page](https://go.postman.co/settings/me/api-keys) ပေါ်မှာလည်း ကြည့်ရှု ဒါမှမဟုတ် revoke လုပ်နိုင်ပါတယ်။ Collection access keys အကြောင်း ပိုလေ့လာချင်ရင် — [collection access key တစ်ခု generate လုပ်ခြင်း](https://learning.postman.com/docs/reference/postman-api/authentication/#generate-a-collection-access-key) ကို ဝင်ကြည့်ပါ။

ဒီ link ရှိတဲ့သူတိုင်း collection ရဲ့ JSON ကို read-only access ရပါတယ်။ ဒီ Postman API endpoint က ဆောင်ရွက်ပေးတဲ့ data က collection ရဲ့ လက်ရှိ အခြေအနေကို ထင်ဟပ်ပါတယ်။

တခြား users တွေနဲ့ link တစ်ခု share လုပ်ချင်ရင် — collection ဆီ link တစ်ခု ပေးဖို့ **Link to collection in public workspace** ကို နှိပ်ပါ။ Collection က public workspace တစ်ခုထဲမှာ ရှိရပါမယ်။ Collection က public workspace တစ်ခုထဲမှာ မရှိရင် — **Move Collection** ကို နှိပ်ပြီး ရွှေ့မယ့် public workspace တစ်ခု ရွေးပါ။ Link ကို clipboard ထဲ ကူးဖို့ **Copy link** ကို နှိပ်ပြီး — တခြားသူတွေနဲ့ share လုပ်ပါ။ ဒီ link ရှိတဲ့သူတိုင်း ကိုယ့် public collection ကို ကြည့်ရှု fork လုပ်နိုင်ပါတယ်။

### URL တစ်ခု သုံးပြီး share လုပ်ခြင်း

Collections နဲ့ တခြား elements တွေကို ကိုယ့် team နဲ့ရော — team ထဲမပါတဲ့ coworkers တွေနဲ့ပါ share လုပ်နိုင်ပါတယ်။

Collection, folder, request ဒါမှမဟုတ် example တစ်ခုကို ရွေးပြီး **View more actions** ကို နှိပ်ပါ၊ ပြီးရင် collection ဒါမှမဟုတ် request ရဲ့ နာမည်ဘေးက **Copy link** ကို နှိပ်ပြီး — messaging app ဒါမှမဟုတ် email တစ်ခုမှာ ကူးထည့်လို့ရတဲ့ URL တစ်ခု ရယူပါ။

Environment တစ်ခု ရွေးထားပြီးသား collection, folder, request ဒါမှမဟုတ် example တစ်ခုဆီ URL တစ်ခု share လုပ်ဖို့ — **View more actions > Share** ကို နှိပ်ပါ။

Collection နဲ့ environment တစ်ခု ဒါမှမဟုတ် collection နဲ့ environment တစ်ခုဆီ URL တစ်ခု share လုပ်ဖို့ [Postman VS Code extension](https://learning.postman.com/docs/reference/vs-code-extension/overview/) ကိုလည်း သုံးနိုင်ပါတယ်။

Link ကို share လုပ်လိုက်တဲ့သူက ကိုယ့် team ထဲမပါရင် — team ထဲဝင်ဖို့ request လုပ်ဖို့ prompt လုပ်ပါတယ်။

[Team settings](https://learning.postman.com/docs/collaborating-in-postman/requesting-access-to-elements/#manage-team-access-through-shared-resources) မှာ ဖွင့်ထားရင် — verified domains ကနေ Team plans ပေါ်က users တွေက shared link တစ်ခုကို သုံးပြီး ကိုယ့် team ထဲကို အလိုအလျောက် ဝင်လို့ရပါတယ်။

[Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) တစ်ယောက်က ဒီ request ကို approve ဒါမှမဟုတ် deny လုပ်ပါလိမ့်မယ်။

Team members အသစ်တွေ ဖိတ်ခေါ်ဖို့ ကိုယ့် team မှာ [available seats](https://learning.postman.com/docs/billing/billing/#changing-your-plan) တွေ ရှိရပါမယ် ဒါမှမဟုတ် [Auto-Flex ဖွင့်ထားရပါမယ်](https://learning.postman.com/docs/billing/billing/#using-auto-flex)။ Team မှာ [SSO ဖွင့်ထားရင်](https://learning.postman.com/docs/administration/sso/intro-sso/) — team ထဲမပါတဲ့ users တွေက ကိုယ့် team ရဲ့ SSO ကို သုံးပြီး sign in လုပ်ဖို့ လိုအပ်ပါတယ်။

## Request တစ်ခုကို သူ့ response နဲ့အတူ share လုပ်ခြင်း

HTTP request တစ်ခုနဲ့ သူ့ရဲ့ [response ကို team members တွေ ဒါမှမဟုတ် ပြင်ပ partners တွေနဲ့ share လုပ်နိုင်ပါတယ်](#collaborators-တွေနဲ့-request-တစ်ခုနဲ့-သူ့-response-share-လုပ်ခြင်း)။ Request ရဲ့ history ထဲက အရင်က response တစ်ခုကိုလည်း share လုပ်နိုင်ပါတယ်။ Response တစ်ခုကို share လုပ်ဖို့ — request တစ်ခု ဖွင့်ပြီး send လုပ်ပါ၊ ပြီးရင် response ဆီ link ကို ကူးပါ။ တခြားသူတွေက ဒီ link ကို သုံးပြီး — [ကိုယ် ရနေတဲ့ response အတိုင်း](#shared-request-တစ်ခုနဲ့-သူ့-response-ကို-ကြည့်ရှုခြင်း) request configuration နဲ့အတူ ကြည့်ရှုနိုင်ပါတယ်။ Collaborators တွေ ဒီ shared response ကို မလိုတော့ရင် — [link ကို stop sharing လုပ်နိုင်ပါတယ်](#shared-request-တစ်ခုနဲ့-သူ့-response-စီမံခန့်ခွဲခြင်း)။

၂၀၂၄ ခုနှစ်၊ အောက်တိုဘာ ၇ ရက်နဲ့ နောက်ပိုင်း ဖန်တီးခဲ့တဲ့ HTTP requests တွေရဲ့ responses တွေကိုပဲ share လုပ်နိုင်ပါတယ်။ အဲဒီရက်စွဲ မတိုင်ခင် ဖန်တီးခဲ့တဲ့ HTTP requests တွေရဲ့ responses တွေကိုတော့ share လုပ်လို့မရပါဘူး။

Response sharing က — အလုပ်လုပ်နေတဲ့ နမူနာတစ်ခုကို collaborators တွေနဲ့ မျှဝေဖို့နဲ့ တခြားသူတွေရဲ့ အကူအညီနဲ့ ကိုယ့် request ကို debug လုပ်ဖို့ အသုံးဝင်ပါတယ်။ ကြုံတွေ့နေရတဲ့ မမျှော်လင့်ထားတဲ့ response တစ်ခုကို collaborators တွေဆီ report လုပ်ဖို့လည်း share လုပ်နိုင်ပါတယ်။

Response တစ်ခု share လုပ်ဖို့ဆိုရင် — HTTP request က share လုပ်မယ့် collaborators တွေ ဝင်လို့ရတဲ့ internal workspace ဒါမှမဟုတ် Partner Workspace တစ်ခုထဲမှာ ရှိရပါမယ်။ Postman က public workspaces တွေကနေ request နဲ့ response ကို share လုပ်တာကို မပံ့ပိုးပါဘူး။ ဒါ့အပြင် [multi-partner mode ဖွင့်ထားတဲ့ Partner Workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/partner-workspaces/multipartner-workspaces/) ထဲက partners တွေလည်း request နဲ့ response ကို share လုပ်နိုင်မှာ မဟုတ်ပါဘူး။

[Postman app for Slack](https://learning.postman.com/docs/integrations/available-integrations/slack/slack-application/) ဒါမှမဟုတ် [Postman app in Teams](https://learning.postman.com/docs/integrations/available-integrations/microsoft-teams/) ကို install လုပ်ထားရင် — Slack ဒါမှမဟုတ် Teams ထဲမှာ share လုပ်ထားတဲ့ HTTP responses တွေရဲ့ links တွေမှာ request URL နဲ့ response code စတဲ့ အပိုအချက်အလက်တွေ ပြသပါလိမ့်မယ်။ Unrestricted workspaces တွေကနေ share လုပ်ထားတဲ့ HTTP responses တွေမှာပဲ response body ကို ပြသမှာ ဖြစ်ပါတယ်။

* Response က sensitive data တွေ ပြန်ပို့ရင် — share လုပ်ထားတဲ့ collaborators တွေကို မြင်ရပါလိမ့်မယ်။ ဘယ် collaborators တွေနဲ့ share လုပ်မလဲ ဆုံးဖြတ်တဲ့အခါ — response ထဲက data တွေရဲ့ sensitivity ကို သေချာ စဉ်းစားပါ။ ဘာတွေက sensitive data အဖြစ် သတ်မှတ်လဲ နားလည်ဖို့ ကိုယ့် organization ရဲ့ policies တွေကို စစ်ဆေးဖို့ Postman က အကြံပြုပါတယ်။

* ပုံမှန်အားဖြင့် ကိုယ့် request ရဲ့ history ထဲက responses တွေကို ကိုယ်တစ်ယောက်တည်းပဲ မြင်နိုင်ပါတယ်။ Internal workspace ဒါမှမဟုတ် Partner Workspace တစ်ခုထဲက Collaborators တွေက — [ကိုယ် share လုပ်ထားတဲ့ responses](#collaborators-တွေနဲ့-request-တစ်ခုနဲ့-သူ့-response-share-လုပ်ခြင်း) တွေကိုပဲ ကြည့်ရှုနိုင်ပါတယ်။

### Collaborators တွေနဲ့ request တစ်ခုနဲ့ သူ့ response share လုပ်ခြင်း

HTTP request တစ်ခု send လုပ်ပြီးတာနဲ့ — လက်ရှိ response ကို request configuration နဲ့အတူ တခြားသူတွေကို share လုပ်နိုင်ပါတယ်။ Request က collection တစ်ခုထဲမှာ save မလုပ်ရသေးရင် — save လုပ်ဖို့ prompt လုပ်ပါလိမ့်မယ်။ [Responses တွေကို history မှာ သိမ်းခြင်း](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#saving-responses-in-history) ကို request send လုပ်တဲ့အချိန်တုန်းက ဖွင့်ထားရင် — request ရဲ့ history ထဲက အရင်က response တစ်ခုကိုလည်း share လုပ်နိုင်ပါတယ်။

Request ကနေ လက်ရှိ response ကို share လုပ်ဖို့:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး HTTP request တစ်ခု ဖွင့်ပါ။
2. Request ပို့ဖို့ **Send** ကို နှိပ်ပြီး response ကို ကြည့်ပါ။
3. Response area ထဲက **Copy link** ကို နှိပ်ပါ။ ဒါက link ကို clipboard ထဲ ကူးပေးပြီး — **Shared** tag ကို ပြသပါတယ်။
4. Request ကို access လုပ်ခွင့်ရှိတဲ့ collaborator တစ်ယောက်ဆီ link ကို share လုပ်ပါ။

Request ရဲ့ history ထဲက အရင်က response တစ်ခုကို share လုပ်ဖို့:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး HTTP request တစ်ခု ဖွင့်ပါ။
2. Response area ထဲက **History** ကို နှိပ်ပါ။ ဒါက request ကို အရင်က ပို့ခဲ့တဲ့ နေ့စွဲနဲ့ အချိန်တစ်ခုချင်းစီ၊ ပြန်ရခဲ့တဲ့ response status code တွေပါတဲ့ dropdown စာရင်းတစ်ခုကို ပြပါတယ်။ Item တစ်ခုချင်းစီပေါ်မှာ mouse ချရင် — request method နဲ့ URL ကို ကြည့်ရပါတယ်။
3. Dropdown စာရင်းထဲက response တစ်ခုကို ရွေးပြီး — response နဲ့ request configuration ကို ကြည့်ပါ။
4. Response area ထဲက **Copy link** ကို နှိပ်ပါ။ ဒါက link ကို clipboard ထဲ ကူးပေးပြီး — **Shared** tag ကို ပြသပါတယ်။
5. Request ကို access လုပ်ခွင့်ရှိတဲ့ collaborator တစ်ယောက်ဆီ link ကို share လုပ်ပါ။

Shared response တစ်ခုဆီ တိုက်ရိုက် link ကို နောက်မှ ပြန်သုံးဖို့ **Copy link** ကို နှိပ်ပါ။ Dropdown စာရင်းထဲက shared response ဘေးမှာရှိတဲ့ **Options > Copy Link** ကိုလည်း ရွေးနိုင်ပါတယ်။

**History** dropdown စာရင်းကနေ အရင်က response တစ်ခုကို ရွေးတဲ့အခါ — request ပို့ခဲ့တဲ့ နေ့စွဲနဲ့ အချိန်ကို response area မှာ ပြပါတယ်။ ဒီ နေ့စွဲ/အချိန်ကို ရွေးပြီး dropdown စာရင်းကို ပြန်ဖွင့်ကာ — ကိုယ်ကြိုက်ရင် တခြား response တစ်ခု ရွေးနိုင်ပါတယ်။ Request configuration ရဲ့ နောက်ဆုံး version ဆီ ပြန်သွားဖို့ **Current** ကို ရွေးနိုင်ပါတယ်။ ဘေးမှာ **Shared** icon ပါတဲ့ response ကို အရင်က share လုပ်ပြီးသား ဖြစ်တာ သတိပြုပါ။

Sidebar ထဲက **History** ကနေ response တစ်ခုကို share လုပ်ဖို့ ကြိုးစားရင် — အရင်ဆုံး collection တစ်ခုထဲမှာ save လုပ်ဖို့ prompt လုပ်ပါလိမ့်မယ်။ Request ရဲ့ history ထဲမှာ responses တွေ save ဖြစ်မှာ မဟုတ်ပါဘူး။ Request ကို နောက်တစ်ကြိမ် send လုပ်ပြီးမှ — response တစ်ခုကို share လုပ်ဖို့ အောက်ပါအဆင့်တွေအတိုင်း လုပ်ဆောင်ရပါမယ်။

### Shared request တစ်ခုနဲ့ သူ့ response ကို ကြည့်ရှုခြင်း

Collaborator တစ်ယောက် share လုပ်ထားတဲ့ link ကို ဖွင့်ပြီး — request configuration နဲ့အတူ response ကို Postman ထဲမှာ ကြည့်ရှုနိုင်ပါတယ်။ Response area ကနေ request-response pair ကို နောက်တစ်ကြိမ် ပြန်ဖွင့်နိုင်ပါတယ်။ Collaborator တစ်ယောက်က response တစ်ခုကို [stop sharing လုပ်လိုက်ရင်](#shared-request-တစ်ခုနဲ့-သူ့-response-စီမံခန့်ခွဲခြင်း) — နောက်ပိုင်းမှာ ကိုယ် ကြည့်လို့ မရတော့ပါဘူး။

Link တစ်ခုသုံးပြီး shared response တစ်ခုကို ကြည့်ဖို့:

1. Browser ထဲမှာ collaborator တစ်ယောက် share လုပ်ထားတဲ့ response တစ်ခုဆီ link ကို ရိုက်ထည့်ပါ။ Link က [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) နဲ့ request ရဲ့ workspace ကို ဖွင့်ပေးပါတယ်။
2. Shared response နဲ့ သူ့ရဲ့ request configuration ကို ပြန်လည် သုံးသပ်ပါ။

Response area ကနေ shared response တစ်ခုဆီ ပြန်သွားဖို့:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး — collaborator တစ်ယောက် share လုပ်ထားတဲ့ response တစ်ခုပါတဲ့ HTTP request တစ်ခု ဖွင့်ပါ။ Browser ထဲမှာ response ဆီ link ကို အရင်က ဖွင့်ထားဖို့ သေချာပါစေ။
2. Response area ထဲက **History** ကို နှိပ်ပြီး collaborator တစ်ယောက် အရင်က share လုပ်ထားတဲ့ response တစ်ခုကို ရွေးပါ။ Collaborator တစ်ယောက်ရဲ့ avatar ဘေးမှာရှိတဲ့ response က — ကိုယ့်ဆီ share လုပ်ထားတဲ့ response ဖြစ်ပါတယ်။ Avatar ပေါ်မှာ mouse ချရင် သူတို့ရဲ့ username ကို ပြပါတယ်။

   Collaborator တစ်ယောက်က response ကို stop sharing လုပ်လိုက်ရင် — dropdown စာရင်းထဲမှာ မပေါ်တော့ပါဘူး။

3. Shared request configuration နဲ့ သူ့ရဲ့ response ကို ပြန်လည် သုံးသပ်ပါ။

**History** dropdown စာရင်းကနေ shared response တစ်ခုကို ရွေးတဲ့အခါ — collaborator က request ပို့ခဲ့တဲ့ နေ့စွဲနဲ့ အချိန်ကို သူတို့ရဲ့ avatar နဲ့အတူ response area မှာ ပြပါတယ်။

Shared response ဆီ တိုက်ရိုက် link ကို နောက်မှ ပြန်သုံးဖို့ **Copy link** ကို နှိပ်ပါ။ Dropdown စာရင်းထဲက shared response ဘေးမှာရှိတဲ့ **Options > Copy Link** ကိုလည်း ရွေးနိုင်ပါတယ်။

### Shared request တစ်ခုနဲ့ သူ့ response စီမံခန့်ခွဲခြင်း

Collaborators တွေ မလိုတော့ဘူးဆိုရင် — response တစ်ခုနဲ့ သူ့ရဲ့ request configuration ကို stop sharing လုပ်နိုင်ပါတယ်။ Request ရဲ့ history ထဲက response တစ်ခုကိုလည်း ဖျက်ပစ်နိုင်ပါတယ်။

Collaborators တွေနဲ့ response တစ်ခုကို stop sharing လုပ်ဖို့:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး — ကိုယ့် history ကနေ share လုပ်ထားတဲ့ response တစ်ခုပါတဲ့ HTTP request တစ်ခု ဖွင့်ပါ။
2. Response area ထဲက **History** ကို နှိပ်ပြီး ဘေးမှာ **Shared** icon ပါတဲ့ response တစ်ခုကို ရွေးပါ။ ဒီ icon ပါတဲ့ response ကို — ကိုယ် share လုပ်ထားတဲ့ collaborators တွေ ကြည့်ရှုနိုင်ပါတယ်။
3. Response area ထဲက **Shared** tag ပေါ်မှာ mouse ချပြီး **Stop Sharing** ကို နှိပ်ပါ။ Response တစ်ခုကို stop sharing လုပ်ပြီးတာနဲ့ — link က collaborators တွေကို သက်ဆိုင်ရာ workspace ဆီ ဆက်ပြီး ခေါ်သွားပါလိမ့်မယ်။ ကိုယ့် history ထဲက request နဲ့ သူ့ရဲ့ response ကိုတော့ collaborators တွေ နောက်ပိုင်းမှာ မမြင်ရတော့ပါဘူး။

   Dropdown စာရင်းထဲက shared response ဘေးမှာရှိတဲ့ **Options > Stop Sharing** ကိုလည်း ရွေးနိုင်ပါတယ်။

Request ရဲ့ history ထဲက response တစ်ခုကို ဖျက်ဖို့:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး HTTP request တစ်ခု ဖွင့်ပါ။
2. Response area ထဲက **History** ကို နှိပ်ပါ။
3. Dropdown စာရင်းထဲက response တစ်ခုဘေးမှာ **Options > Delete** ကို ရွေးပါ။

## Guests တွေနဲ့ collections share လုပ်ခြင်း

Collection Editors တွေက — ကိုယ့် Postman team ထဲမပါတဲ့ Guests တွေကို collection တစ်ခု ကြည့်ရှုပြီး requests တွေ ပို့ခွင့် ပေးနိုင်ပါတယ်။ Guests တွေနဲ့ share လုပ်ချင်တဲ့ collection ထဲမှာ Editor role ရှိရပါမယ်။ Guests တွေက team ထဲကို SSO နဲ့ ဝင်နိုင်ရပါမယ်။

Enterprise team တစ်ခုပေါ်မှာဆိုရင် — [Admins နဲ့ Super Admins](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) တွေက internal workspaces တွေထဲမှာ Collection Editors တွေ [Guests တွေနဲ့ collections တွေ share လုပ်တာ](https://learning.postman.com/docs/administration/managing-your-team/manage-team-workspaces/#share-with-guests) ကို ဖွင့်ပေး ဒါမှမဟုတ် တားမြစ်နိုင်ပါတယ်။

Guests တွေကို collection တစ်ခုခုကို ကြည့်ရှုခွင့် ဖွင့်ပေးပြီးတာနဲ့ — collection ကို ကြည့်ဖို့ sign in လုပ်နိုင်အောင် collection URL ကို သူတို့ဆီ ပို့ပါ။ Collection URL ကို သုံးပြီး Postman ထဲ sign in လုပ်တဲ့ Guest users တွေကို — team level မှာ [Guest role](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) နဲ့ collection level မှာ ကန့်သတ်ထားတဲ့ [Viewer role](https://learning.postman.com/docs/administration/roles-and-permissions/#collection-roles) တစ်ခု သတ်မှတ်ပေးပါတယ်။

User တစ်ယောက်ကို Guest role သတ်မှတ်ပေးတာက paid seats တွေကို မသုံးစွဲပါဘူး။

Guest တစ်ယောက်ကို collection တစ်ခု ကြည့်ရှုခွင့် ဖွင့်ပေးဖို့:

1. Share လုပ်ချင်တဲ့ collection ကနေ **Share** ကို နှိပ်ပါ။
2. **Guests can view collection via link** ကို နှိပ်ပါ။
3. Collection URL ကို ကူးဖို့ **Copy Link** ကို နှိပ်ပါ။
4. Collection ကို ကြည့်စေချင်တဲ့ Guests တွေဆီ collection URL ကို ပို့ပါ။ Collection ကို မကြည့်ရသေးခင် Postman ထဲ sign in လုပ်ဖို့ Guests တွေကို Postman က တောင်းဆိုပါတယ်။

### Guests တွေနဲ့ share လုပ်ခြင်းရဲ့ စည်းမျဉ်းများ

**Allow guests to view collection via link** ဖွင့်ထားရင် — collection URL ကို access ရှိတဲ့သူတိုင်း ဒီ collection ကို ကြည့်ရှုနိုင်ပါတယ်။

Team members အသစ်တွေ ဖိတ်ခေါ်ဖို့ ကိုယ့် team မှာ [available seats](https://learning.postman.com/docs/billing/billing/#changing-your-plan) တွေ ရှိရပါမယ် ဒါမှမဟုတ် [Auto-Flex ဖွင့်ထားရပါမယ်](https://learning.postman.com/docs/billing/billing/#using-auto-flex)။ Team မှာ [SSO ဖွင့်ထားရင်](https://learning.postman.com/docs/administration/sso/intro-sso/) — team ထဲမပါတဲ့ users တွေက ကိုယ့် team ရဲ့ SSO ကို သုံးပြီး sign in လုပ်ဖို့ လိုအပ်ပါတယ်။

Collection တစ်ခုကို Guests တွေနဲ့ share လုပ်တဲ့အခါ role အလိုက် အောက်ပါ permissions တွေ သက်ရောက်ပါတယ်:

| Role                                                                                            | Permissions                                                                                                                    |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [Admin ဒါမှမဟုတ် Super Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) | ကိုယ့် Postman team ထဲမပါတဲ့ Users တွေက team ထဲဝင်ဖို့ invitation တစ်ခု လက်ခံရရှိပါတယ်။ |
| Team plan ပေါ်က ကိုယ့် team ထဲက [Developer](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) | ကိုယ် element တစ်ခု share လုပ်တဲ့ Users တွေကို Admin တစ်ယောက်ရဲ့ အတည်ပြုချက် မလိုဘဲ — Developers အဖြစ် team ထဲ အလိုအလျောက် ထည့်ပေးပါတယ်။ |
| Team plan ပေါ်က Developer မဟုတ်သူ ဒါမှမဟုတ် ဘယ် plan ပေါ်မှာမဆို Admin မဟုတ်သူ | Team ထဲမပါတဲ့ user တစ်ယောက်နဲ့ element တစ်ခု share လုပ်ဖို့ ကိုယ့် request ကို Admin တစ်ယောက်က အတည်ပြုပေးရပါတယ်။ |

### Collections တွေဆီ Guest access ပြောင်းလဲခြင်း

Guest role ကို team level နဲ့ collection level နှစ်ခုလုံးမှာ ပြောင်းလဲနိုင်ပါတယ်။ Guest အသစ်တွေရော ရှိပြီးသား Guests တွေအတွက်ပါ — collections တွေကို ကြည့်ရှုတဲ့ access ကိုလည်း ရုပ်သိမ်းနိုင်ပါတယ်။

Guest တစ်ယောက်ရဲ့ team role ပြောင်းနည်းကို [Guests တွေ စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/administration/managing-your-team/team-members/manage-roles/#manage-guests) မှာ ကြည့်ပါ။ Guest တစ်ယောက်က role ပြောင်းဖို့ ဘယ်လို request လုပ်နိုင်လဲဆိုတာကို — [Guest တစ်ယောက်အနေနဲ့ collection တစ်ခုအတွက် Editor role access request လုပ်ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/requesting-access-to-elements/#request-editor-access-to-a-collection-as-a-guest) မှာ ကြည့်ပါ။

**Allow Guests to join your team and view this collection with the link** ကို ပိတ်နိုင်ပါတယ်။ ဒါကို ပိတ်လိုက်ရင် — Guest အသစ်တွေကို Guest role သတ်မှတ်ပေးလို့ မရတော့ပါဘူး။ Guest role သတ်မှတ်ပြီးသား Guest users တွေကတော့ collection ကို ဆက်ပြီး access ရှိနေပါလိမ့်မယ်။

Team level မှာ Guests တွေကို ဖယ်ရှားဖို့ — [Members တွေ ဖယ်ရှားခြင်း](https://learning.postman.com/docs/administration/managing-your-team/team-members/scale-team/#remove-members) ကို ကြည့်ပါ။ အချို့အခြေအနေတွေမှာ — collection တစ်ခုတည်းကိုပဲ access ရှိတဲ့ Guests တွေကို team ကနေ အလိုအလျောက် ဖယ်ရှားပါတယ်:

* Workspace Admin က သူတို့ကို collection ထဲကနေ ဖယ်ရှားလိုက်ရင်။
* Workspace Admin က Guest ကို collection ရှိတဲ့ workspace ထဲကနေ ဖယ်ရှားလိုက်ရင်။
* Workspace Admin က collection ရှိတဲ့ workspace ကို ဖျက်ပစ်လိုက်ရင်။

Collection level မှာ Guests တွေကို ဖယ်ရှားဖို့:

1. Collection နာမည်ဘေးက **View more actions** ကို နှိပ်ပြီး **Share** ကို နှိပ်ပါ။
2. User ရဲ့ နာမည်ဘေးက dropdown ကနေ **Remove** ကို ရွေးပါ။

Collections တွေကနေ Guests တွေကို ဖယ်ရှားတာက — collection ရှိတဲ့ workspace ဆီ သူတို့ရဲ့ access ကိုတော့ မရုပ်သိမ်းပါဘူး။ Team ဆီ သူတို့ရဲ့ access တစ်ခုလုံး ရုပ်သိမ်းဖို့ — [Members တွေ ဖယ်ရှားခြင်း](https://learning.postman.com/docs/administration/managing-your-team/team-members/scale-team/#remove-members) ကို ကြည့်ပါ။
