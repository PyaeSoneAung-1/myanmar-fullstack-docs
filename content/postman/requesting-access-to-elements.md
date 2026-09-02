---
title: "Postman Resources များဆီ Access တောင်းခံခြင်းနဲ့ အတည်ပြုခြင်း (Request and Approve Access to Postman Resources)"
description: "Postman ထဲမှာ access စီမံခန့်ခွဲနည်း — workspaces, elements နဲ့ team membership တွေအတွက် Editor access တောင်းခံခြင်း, requests တွေ အတည်ပြုခြင်း နဲ့ shared resources တွေကနေ team access စီမံခြင်း"
order: 100
source: "https://learning.postman.com/docs/collaborating-in-postman/requesting-access-to-elements/"
status: translated
updated: 2026-09-02
---

ဒီ topic က — resources တွေဆီ links တွေကို team အပြင်ဘက်ကို မျှဝေတဲ့အခါ Postman workspaces တွေ, သူတို့ထဲက elements တွေ နဲ့ team membership တွေဆီ access စီမံခန့်ခွဲခြင်းရဲ့ ခြုံငုံ သုံးသပ်ချက်ကို ပေးပါတယ်။ Access တောင်းခံခြင်းနဲ့ internal workspaces အတွင်းမှာ permissions စီမံခန့်ခွဲခြင်းတွေကို ခြုံငုံ ဖော်ပြထားပါတယ်။ ဒီလမ်းညွှန်ကို သုံးပြီး — users တွေရော workspace administrators တွေပါ — teams တွေကြား လုံခြုံတဲ့ ပူးပေါင်းဆောင်ရွက်မှုအတွက် workspaces တွေဆီ access ကို ထိန်းချုပ်နိုင်ပါတယ်။

## Editor access တောင်းခံခြင်း

Workspace တစ်ခု ဒါမှမဟုတ် သူ့ရဲ့ elements တွေကို တည်းဖြတ်ဖို့ — users တွေက workspace အတွက် Admin access ဒါမှမဟုတ် element တစ်ခုအတွက် Editor access ရှိတဲ့ team member တစ်ယောက်ဆီကနေ Editor access တောင်းခံနိုင်ပါတယ်။ သူတို့မှာ [Slack အတွက် integration](https://learning.postman.com/docs/integrations/available-integrations/slack/) ဖွင့်ထားရင် — element တစ်ခုကို သူတို့ဆီ share လုပ်လိုက်တဲ့အခါ ရရှိတဲ့ Slack message တစ်ခုကနေတစ်ဆင့် users တွေ access တောင်းခံနိုင်ပါတယ်။

**Slack ကနေ access တောင်းခံခြင်း** — Users တွေက သူတို့ မပါဝင်ထားတဲ့ team တစ်ခုရဲ့ workspace တစ်ခုထဲမှာ ရှိတဲ့ element တစ်ခုဆီ access တောင်းခံရင် — နှစ်ကြိမ် တောင်းခံဖို့ လိုပါတယ်: ပထမအကြိမ်မှာ team access တောင်းဖို့ ညွှန်ကြားခံရပြီး — ဒုတိယအကြိမ်မှာ workspace access တောင်းဖို့ ဖြစ်ပါတယ်။

Roles နဲ့ access အမျိုးအစားတွေအကြောင်း ပိုသိချင်ရင် — [Postman team တစ်ခုအတွင်းမှာ roles နဲ့ permissions တွေ သတ်မှတ်ခြင်း](https://learning.postman.com/docs/administration/roles-and-permissions/) ကို ကြည့်ပါ။ [Guest တစ်ယောက်အနေနဲ့ collection တစ်ခုကို ကြည့်ရှုခြင်း](/docs/postman/sharing) အကြောင်းလည်း ပိုလေ့လာနိုင်ပါတယ်။

Roles နဲ့ permissions တွေက ကိုယ့် [Postman plan](https://www.postman.com/pricing/) ပေါ်မှာ မူတည်ပါတယ်။

### Workspace တစ်ခုအတွက် Editor access တောင်းခံခြင်း

Workspace တစ်ခုအတွက် Editor access တောင်းခံဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Workspace overview ကို ဖွင့်ပြီး — ညာဘက်အပေါ်ထောင့်က **Request to Edit** ကို ရွေးပါ။ ဘယ်ဘက် sidebar ထဲက **Add** ကို ရွေးပြီး — workspace ထဲမှာ element တစ်ခု ဖန်တီးဖို့ ကြိုးစားတဲ့အခါမှာလည်း access တောင်းခံနိုင်ပါတယ်။

2. Workspace Admins တွေဆီ note တစ်ခု ထည့်ပါ။

3. **Send Request** ကို ရွေးပါ။

Workspace Admins တွေက ကိုယ့် request အသေးစိတ်ပါတဲ့ in-app နဲ့ email notification တွေ ရရှိပါတယ်။ Team မှာ [auto-join](https://learning.postman.com/docs/administration/managing-your-team/team-settings/) ဖွင့်ထားရင် — users တွေ workspace ဆီ access ကို အလိုအလျောက် ရရှိပါလိမ့်မယ်။ ကိုယ့် request ကို [အတည်ပြု ဒါမှမဟုတ် ငြင်းပယ်လိုက်တဲ့အခါ](#access-requests-တွေကို-အတည်ပြုခြင်း) — သူတို့ရဲ့ တုံ့ပြန်ချက်ကို in-app နဲ့ email နှစ်မျိုးလုံးနဲ့ အကြောင်းကြားပါတယ်။

[Slack အတွက် personal notifications](https://learning.postman.com/docs/integrations/available-integrations/slack/slack-notifications/) ဖွင့်ထားရင် Slack ထဲမှာလည်း အကြောင်းကြားခံရပါလိမ့်မယ်။

### Restricted workspace တစ်ခုဆီ access တောင်းခံခြင်း

*Restricted workspace* ဆိုတာ — ဖန်တီးခဲ့တဲ့ user နဲ့ အဲဒီထဲ ပါဝင်ဖို့ ဖိတ်ခေါ်ခံထားရတဲ့ team members တွေပဲ မြင်နိုင်တဲ့ workspace တစ်ခု ဖြစ်ပါတယ်။ Restricted workspaces တွေက — အုပ်စုတစ်ခုအတွက်ပဲ သက်ဆိုင်တဲ့ elements တွေဆီ access ကို ကန့်သတ်နိုင်စေပါတယ်။

Restricted workspace တစ်ခုထဲမှာ ပူးပေါင်း လုပ်ဆောင်ဖို့ — workspace Editor ဒါမှမဟုတ် Admin တစ်ယောက်က ကိုယ့်ကို [ဖိတ်ခေါ်ပေးရပါမယ်](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/)။ ဒါမှမဟုတ် workspace တစ်ခုဆီ access တောင်းခံပြီး အတည်ပြုခံယူနိုင်ပါတယ်။ [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို သုံးနေရင် — teammate တစ်ယောက် restricted workspace တစ်ခု ဒါမှမဟုတ် အထဲက element တစ်ခုဆီ share လုပ်ထားတဲ့ link တစ်ခုဆီ သွားနိုင်ပါတယ်။ အဲဒီမှာ workspace ဆီ access တောင်းခံဖို့ option ရှိပါတယ်။

Note တစ်ခု ထည့်ပြီး — request တင်ဖို့ **Request Access** ကို ရွေးနိုင်ပါတယ်။ Workspace Admins အားလုံးက ကိုယ့် request ကို ပြန်သုံးသပ်ဖို့ notification တစ်ခု ရရှိပြီး — ကိုယ့် request ကို အတည်ပြု ဒါမှမဟုတ် ငြင်းပယ်လိုက်တဲ့အခါ **Notifications** နဲ့ email နှစ်မျိုးလုံးနဲ့ အသိပေးခံရပါလိမ့်မယ်။

ကိုယ့် request ကို ရက် ၁၅ အတွင်း ပြန်သုံးသပ်မှု မရှိရင် — သက်တမ်းကုန်ဆုံးပြီး — access အတွက် ကိုယ့် request ကို ပြန်တင်ပေးဖို့ Postman နဲ့ email နှစ်မျိုးလုံးနဲ့ အကြောင်းကြားခံရပါလိမ့်မယ်။

### Guest တစ်ယောက်အနေနဲ့ collection တစ်ခုအတွက် Editor access တောင်းခံခြင်း

[Collection တစ်ခုကို ကြည့်ရှုခွင့် ရှိတဲ့ Guest](/docs/postman/sharing) တစ်ယောက်ဆိုရင် — collection တစ်ခုအတွက် Editor access တောင်းခံနိုင်ပါတယ်။ Collection တစ်ခုအတွက် Editor access ရတဲ့အခါ — ကိုယ့် [team role](https://learning.postman.com/docs/administration/roles-and-permissions/) က Guest role ကနေ Developer role အဖြစ် ပြောင်းသွားပါတယ်။ ဒီ team role အပြောင်းအလဲက ကိုယ့်ကို team ထဲ ထည့်သွင်းပြီး — team resources နဲ့ workspaces အားလုံးဆီ access ပေးပါတယ်။

1. Sidebar ထဲက **Collections** ကို ရွေးပါ။
2. Collection ကို ရွေးပါ။
3. **Request to Edit** ကို ရွေးပါ။

Guest user တစ်ယောက်ကို collection တစ်ခုအတွက် Editor access ပေးဖို့ — ကိုယ့် team မှာ [available seats](https://learning.postman.com/docs/billing/billing/) တွေ ရှိရပါမယ် ဒါမှမဟုတ် [Auto-Flex ဖွင့်ထားရပါမယ်](https://learning.postman.com/docs/billing/billing/)။

Collection အတွက် Editor access ရှိတဲ့ team members တွေဆီ Postman က in-app နဲ့ email notifications တွေ ပို့ပါတယ်။

## Access requests တွေကို အတည်ပြုခြင်း

Workspace Admin တစ်ယောက် ဒါမှမဟုတ် element တစ်ခုရဲ့ Editor တစ်ယောက်ဆိုရင် — access requests တွေကို လက်ခံရရှိပါတယ်။

### Editor access ကို အတည်ပြုခြင်း

Teammate တစ်ယောက်က API, collection, environment, mock server ဒါမှမဟုတ် monitor တစ်ခုအတွက် Editor access တောင်းခံတဲ့အခါ — request အသေးစိတ်ပါတဲ့ in-app နဲ့ email notification တစ်ခု ရရှိပါလိမ့်မယ်။ Teammate ကို collection, API, environment, mock server ဒါမှမဟုတ် monitor အတွက် Editor access ပေးချင်ရင် **Approve Request** ကို ရွေးပါ။ Editor access မပေးချင်ဘူးဆိုရင် — request ကို လျစ်လျူရှုထားနိုင်ပါတယ်။ Request က ရက် ၃၀ ပြည့်ရင် သက်တမ်းကုန်ပါလိမ့်မယ်။

Teammate တစ်ယောက်က workspace တစ်ခုအတွက် Editor access တောင်းခံတဲ့အခါ — request အသေးစိတ်ပါတဲ့ in-app နဲ့ email notification တစ်ခု ရရှိပါလိမ့်မယ်။ Workspace settings ဖွင့်ဖို့ **Respond to Request** ကို ရွေးပါ။ User ကို ပေးချင်တဲ့ role ကို ရွေးပြီး — request ကို **Approve** ဒါမှမဟုတ် **Deny** လုပ်နိုင်ပါတယ်။

### Restricted workspaces တွေဆီ access requests တွေကို အတည်ပြုခြင်း

Access ရှိတဲ့ user တစ်ယောက်က link တစ်ခု ပေးမယ်ဆိုရင် — team members တွေက restricted workspace တစ်ခုဆီ access တောင်းခံနိုင်ပါတယ်။ Workspace Admins အားလုံးကို **Notifications** နဲ့ email နှစ်မျိုးလုံးနဲ့ access requests တွေအကြောင်း အကြောင်းကြားပါတယ်။ Access requests တွေကို ပြန်သုံးသပ်ဖို့ **Respond to Request** ကို ရွေးပါ။

Workspace အတွင်းမှာ user တစ်ယောက်ရဲ့ permissions တွေကို သတ်မှတ်ဖို့ [workspace role](https://learning.postman.com/docs/administration/roles-and-permissions/) တစ်ခု သတ်မှတ်ပြီး — သူတို့ကို access ပေးဖို့ **Approve** ကို ရွေးနိုင်ပါတယ်။ **Deny** ကို ရွေးပြီး access တောင်းခံမှုတစ်ခုကို ငြင်းပယ်လည်း ရွေးချယ်နိုင်ပါတယ်။ Access တောင်းခံထားတဲ့ team members တွေကို ကိုယ့် ဆုံးဖြတ်ချက်ကို Postman ထဲမှာရော email နဲ့ပါ အကြောင်းကြားပါတယ်။

Restricted workspaces တွေဆီ access requests တွေက — ရက် ၁၅ အတွင်း ပြန်သုံးသပ်မှု မရှိရင် သက်တမ်းကုန်ဆုံးပါတယ်။ ဒီလိုဖြစ်ရင် — Postman က သက်ဆိုင်တဲ့ users တွေကို သူတို့ရဲ့ access တောင်းခံမှုကို ပြန်တင်ပေးဖို့ အသိပေးပါတယ်။

## Shared resources တွေကနေ team access စီမံခန့်ခွဲခြင်း

ကိုယ့် [team dashboard](https://go.postman.co/settings/team/members) ထဲမှာ အချိန်မရွေး — collaborators တွေကို ဖိတ်ခေါ်ခြင်း, ရှိပြီးသား team members တွေကို ဖယ်ရှားခြင်း နဲ့ user roles တွေ update လုပ်ခြင်းတွေ လုပ်ဆောင်နိုင်ပါတယ်။ အသေးစိတ်ကို [Team members တွေ စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/administration/managing-your-team/team-members/overview/) နဲ့ [Team settings များ ပြင်ဆင်သတ်မှတ်ခြင်း](https://learning.postman.com/docs/administration/managing-your-team/team-settings/) မှာ ကြည့်ပါ။

Collections တွေနဲ့ တခြား elements တွေကို ကိုယ့် team နဲ့ရော — team ထဲမပါတဲ့ users တွေနဲ့ပါ မျှဝေနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — team ထဲမပါတဲ့သူတစ်ယောက်ဆီ link တစ်ခု share လုပ်တဲ့အခါ — သူတို့က team ထဲ ဝင်ဖို့ request လုပ်ဖို့ prompt လုပ်ပါတယ်။

အတည်ပြုပြီးတာနဲ့ — team member အသစ်ကို Developer role တစ်ခု သတ်မှတ်ပေးပါတယ်။

Team members တွေ ထပ်ဖိတ်ဖို့ ကိုယ့် team မှာ available seats တွေ ရှိရပါမယ် ဒါမှမဟုတ် Auto-Flex ဖွင့်ထားရပါမယ်။ Team မှာ SSO ဖွင့်ထားရင် — team ထဲမပါတဲ့ users တွေက ကိုယ့် team ရဲ့ SSO ကို သုံးပြီး sign in လုပ်ဖို့ လိုအပ်ပါတယ်။
