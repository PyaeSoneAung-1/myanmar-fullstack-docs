---
title: "Workspaces (Postman အလုပ်နေရာများ) ဖန်တီးခြင်း"
description: "Workspace types (private/team, partner, public) အကြောင်း — workspace အသစ် ဖန်တီးနည်း၊ လူများ ဖိတ်ခေါ်နည်း၊ elements များကို workspace များကြား ရွှေ့ပြောင်းနည်း"
order: 12
source: "https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/create-workspaces/"
status: translated
updated: 2026-09-02
---

Postman မှာ *workspace* တွေက ကိုယ့်ရဲ့ Postman အလုပ်တွေကို စုစည်းပြီး team သားတွေနဲ့ ပူးပေါင်းလုပ်ဆောင်နိုင်အောင် ကူညီပေးပါတယ်။ ဆက်စပ်နေတဲ့ APIs, collections, environments, mocks, monitors နဲ့ တခြား linked elements တွေအတွက် — workspace က single source of truth တစ်ခုအနေနဲ့ ဆောင်ရွက်ပြီး ကိုယ့်ရဲ့ project တွေကို အုပ်စုဖွဲ့နိုင်ပါတယ်။ Workspace တစ်ခုထဲမှာ ပူးပေါင်းလုပ်ဆောင်တဲ့အခါ — ကိုယ့်ရဲ့ တည်းဖြတ်မှုတွေက team နဲ့ real time အတိုင်း sync ဖြစ်ပါတယ်။

Postman ထဲကို ပထမဆုံး sign in ဝင်လိုက်တာနဲ့ — [internal workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/overview/) တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ အဲဒီကနေ workspace အလွတ်တစ်ခု ဖန်တီးလို့ရသလို — ကိုယ့် local Git repository ထဲက files တွေနဲ့ ပြည့်စေတဲ့ workspace တစ်ခုကိုလည်း ဖန်တီးနိုင်ပါတယ်။

## Workspace types တွေ

Postman account တစ်ခုနဲ့ အောက်ပါ workspace types တွေကို ဖန်တီးလို့ရပါတယ်:

* **Internal** — ကိုယ်တိုင်နဲ့ ကိုယ် ဖိတ်ခေါ်ထားသူတွေပဲ မြင်နိုင်တဲ့ workspace ကနေ — team တစ်ခုလုံး (Enterprise plan ဆိုရင် organization တစ်ခုလုံး) မြင်နိုင်တဲ့ workspace အထိ သတ်မှတ်နိုင်ပါတယ်။
  * **Private (ကိုယ်ပိုင်) workspaces** — invite လုပ်ထားသူတွေပဲ ဝင်လို့ရတဲ့ workspace တွေပါ။ [Team plan](https://www.postman.com/pricing/) မှာ private workspace တစ်ခုထဲကို တခြားလူတစ်ယောက် ထပ်ထည့်လိုက်တာနဲ့ — workspace ရဲ့ visibility က အလိုအလျောက် Team အဖြစ် ပြောင်းသွားပါတယ်။ [Enterprise plan](https://www.postman.com/pricing/) မှာတော့ team members တွေ ထည့်ထားရင်တောင် private အဖြစ် ဆက်ထားလို့ရပါတယ်။
* **Partner** — ဖိတ်ခေါ်ထားတဲ့ team users တွေနဲ့ [partners](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/partner-workspaces/overview/) တွေကို access ပေးနိုင်တဲ့ workspace ပါ ([Enterprise plans](https://www.postman.com/pricing/) မှာပဲ ရပါတယ်)။
* **Public** — ကမ္ဘာပေါ်က ဘယ်သူနဲ့မဆို elements တွေကို ပူးပေါင်းလုပ်ဆောင်လို့ရပြီး [Postman API Network](https://learning.postman.com/docs/postman-api-network/overview/) ကို အသုံးချနိုင်တဲ့ workspace ပါ။

Workspace ရဲ့ type ကို ဘယ်အချိန်မဆို ပြောင်းလဲလို့ရပါတယ် — workspace settings ထဲက **Workspace type > Change** ကနေ ပြောင်းနိုင်ပါတယ်။ Workspace ထဲကို လူအသစ်တွေ ထပ်ထည့်ဖို့ဆိုရင် — Postman header ထဲက **Invite** ကို သုံးပါ။

## Workspace အသစ်တစ်ခု ဖန်တီးခြင်း

Workspace အသစ်တစ်ခုကို အောက်ပါနည်းတွေနဲ့ စတင်နိုင်ပါတယ်:

* Header ထဲက **Workspaces** ကို နှိပ်ပြီး **Create** ကို ရွေးပါ။
* [Workspaces dashboard](https://app.getpostman.com/dashboard) ထဲက **Create Workspace** ကို နှိပ်ပါ။

ပြီးရင် workspace တစ်ခုကို configure လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Workspace အတွက် **Name** တစ်ခု ထည့်ပါ။
2. [Enterprise plan](https://www.postman.com/pricing/) မှာ [Postman Organizations](https://learning.postman.com/docs/administration/enterprise/organizations) ဖွင့်ထားရင် — **Teams** field တစ်ခု ထပ်ပေါ်လာပြီး ဘယ် team ထဲမှာ workspace ဖန်တီးမလဲ ရွေးချယ်နိုင်ပါတယ်။ မူလအတိုင်းဆိုရင် လက်ရှိ team context ကို သုံးပါတယ်။
3. **Internal**, **Partner** ဒါမှမဟုတ် **Public** workspace type တစ်ခုကို ရွေးပါ။ Public workspace တစ်ခု ဖန်တီးဖို့ admin role မရှိရင် — access တောင်းခံဖို့ prompt ပေါ်လာပါမယ်။
4. **Blank workspace** (အလွတ် workspace) ဒါမှမဟုတ် **From a Git repository** (ကိုယ့် local files တွေကို sync ပြီး version control လုပ်ဖို့) ကို ရွေးပါ။ Git repository ချိတ်ဆက်တာက Internal workspaces တွေမှာပဲ ရပြီး — ဒီ option ကို ရွေးထားရင် Partner နဲ့ Public types တွေက မရတော့ပါဘူး။ Postman AI ကို သုံးပြီး natural language prompts တွေနဲ့လည်း workspace တစ်ခုကို ဖန်တီး/populate လုပ်လို့ရပါတယ် — ဥပမာ public collection တစ်ခုကို အခြေခံပြီး API တစ်ခု ဖန်တီးပေးဖို့ တောင်းဆိုတာမျိုးပါ။
5. Workspace ကို ဘယ်သူတွေ ဝင်ရောက်ခွင့် ရှိမလဲ ရွေးပါ — team တစ်ခုလုံး (Enterprise plan ဆိုရင် organization) လား၊ ကိုယ်တိုင်နဲ့ ကိုယ် ဖိတ်ခေါ်ထားသူတွေပဲ လားဆိုတာပါ။
6. **Create Workspace** ကို နှိပ်ပါ။

Workspace ဖန်တီးပြီးတာနဲ့ — elements အသစ်တွေ ထည့်နိုင်ပြီး တခြားသူတွေကိုလည်း ဖိတ်ခေါ်နိုင်ပါတယ်။ [API Request Collections များ ဖန်တီးခြင်း](/docs/postman/create-collections), [Postman မှာ environment များဖြင့် variable အုပ်စုများ စီမံခြင်း](/docs/postman/managing-environments), [Variables သုံးခြင်း](/docs/postman/variables) စတာတွေနဲ့ workspace ထဲကို အကြောင်းအရာတွေ ဖြည့်စွက်နိုင်ပါတယ်။

## လူများကို workspace ထဲ ဖိတ်ခေါ်ခြင်း

Team members, [groups](https://learning.postman.com/docs/administration/managing-your-team/user-groups/) တွေနဲ့ အပြင်လူ (external users) တွေကို workspace တစ်ခုထဲမှာ ပူးပေါင်းလုပ်ဆောင်ဖို့ ဖိတ်ခေါ်နိုင်ပါတယ်:

1. Workspace ဆီ သွားပြီး Postman header ထဲက **Invite** ကို နှိပ်ပါ။
2. Team member, group ဒါမှမဟုတ် external user တစ်ယောက်ကို ရှာပြီး ရွေးပါ။
3. Dropdown ကနေ role တစ်ခု (**Viewer**, **Editor** ဒါမှမဟုတ် **Admin**) ရွေးပါ။ Role က အဲဒီလူ workspace ထဲမှာ ဘာတွေ လုပ်လို့ရလဲ သတ်မှတ်ပေးပါတယ်။ Role တွေ သတ်မှတ်ပေးလို့ရတာ Admin တွေပဲ ဖြစ်ပါတယ်။ [Workspace roles](https://learning.postman.com/docs/administration/roles-and-permissions/#workspace-roles) အသေးစိတ် ကြည့်နိုင်ပါတယ်။
4. **Invite** ကို နှိပ်ပါ။

ကိုယ့်ရဲ့ workspace role အပေါ် မူတည်ပြီး workspaces တွေကို share လုပ်နိုင်စွမ်း ကွာခြားပါတယ်:

* **Admin** — Postman teammates ဒါမှမဟုတ် external users တွေကို internal နဲ့ public workspaces တွေထဲ ဖိတ်ခေါ်ပြီး workspace role တွေ သတ်မှတ်ပေးနိုင်ပါတယ်။ Admin တစ်ယောက်က external user တစ်ယောက်ကို workspace တစ်ခုထဲ ဖိတ်ခေါ်ရင် — Postman က ဒီတောင်းဆိုချက်ကို team [Admins](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) တွေဆီ ပို့ပြီး — အတည်ပြုချက် ရတဲ့အခါမှသာ အဲဒီလူဆီကို team ထဲ ဝင်ရန် invitation ပို့ပါတယ်။
* **Editor** — Internal နဲ့ public workspaces တွေထဲကို external users တွေ ဖိတ်ခေါ်လို့ရပေမယ့် — workspace roles တွေတော့ သတ်မှတ်ပေးလို့မရပါဘူး။
* **Viewer** — Internal workspaces တွေထဲကို teammates တွေ ဖိတ်ခေါ်လို့မရပါဘူး။

ဖိတ်ခေါ်လိုက်တဲ့ လူတစ်ဦးချင်းနဲ့ groups တွေကို ပူးပေါင်းလုပ်ဆောင်ဖို့ ဖိတ်ခေါ်တဲ့အကြောင်း အကြောင်းကြားစာ ပို့ပေးပါတယ်။ Postman team ထဲ မပါသေးတဲ့သူတစ်ယောက်ကို ဖိတ်ခေါ်ရင် — အဲဒီသူက team ထဲဝင်ဖို့ invitation ရပါတယ်။ Team [Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) ဒါမှမဟုတ် Super Admin ဖြစ်ရင် invitation ကို တိုက်ရိုက် ပို့ပေးပြီး — တခြားအခြေအနေတွေမှာတော့ external user တစ်ယောက် ထည့်ဖို့ တောင်းဆိုချက်ကို team Admins တွေဆီ အတည်ပြုချက်အတွက် ပို့ပါတယ်။

တခြားနည်းတစ်ခုအနေနဲ့ — **Copy invite link** icon ကို ရွေးပြီး link ကို Postman အပြင်မှာ share လုပ်လို့လည်း ရပါတယ်။ Link က invite dialog ထဲမှာ ရွေးထားတဲ့ role အတိုင်း အလုပ်လုပ်တာကြောင့် — link မကူးခင် role ကို အရင် ရွေးထားပါ။ ဒီ link ကို နှိပ်တဲ့အခါ Postman က sign in ဒါမှမဟုတ် sign up လုပ်ဖို့ prompt လုပ်ပါတယ်။

## Elements တွေကို workspace တစ်ခုကနေ နောက်တစ်ခုကို ရွှေ့ခြင်း

Workspaces တွေထဲမှာ collections, environments, mock servers, flows, specifications စတဲ့ elements တွေ ထည့်ထားလို့ရပါတယ်။ Element တစ်ခုက workspace တစ်ခုထဲမှာပဲ တည်ရှိနိုင်ပြီး — လိုအပ်ရင် element တွေကို တခြား workspace တစ်ခုဆီ ရွှေ့ပြောင်းလို့ရပါတယ်။ Collection, environment, mock server, flow ဒါမှမဟုတ် specification တစ်ခုကို ရွှေ့ဖို့ — team Super Admin ဒါမှမဟုတ် workspace Admin ဖြစ်ရပါမယ်။

ရွှေ့လိုက်တဲ့ element နဲ့ ဆက်စပ်နေတဲ့ အချို့အရာတွေက အလိုအလျောက် ပါမသွားတာကို သတိပြုပါ:

* Monitors တွေကို workspace အသစ်တစ်ခုဆီ ရွှေ့လို့မရပါဘူး။ Active monitor ရှိတဲ့ collection တစ်ခုကို ရွှေ့မယ်ဆိုရင် — ဆက်စပ်နေတဲ့ monitor က pause ဖြစ်သွားပြီး မူလ workspace ထဲမှာပဲ ကျန်နေပါတယ်။
* Element ဒါမှမဟုတ် integration တစ်ခုနဲ့ ဆက်စပ်ထားတဲ့ environment တစ်ခုကို ရွှေ့မယ်ဆိုရင် — အဲဒီ environment ကို သုံးနေတဲ့ element/integration က အလုပ်မလုပ်တော့ဘဲ ဖြစ်သွားနိုင်ပါတယ်။

Element တစ်ခုကို တခြား workspace တစ်ခုဆီ ရွှေ့ဖို့:

1. Sidebar ထဲက **Collections**, **Environments**, **Mock Servers**, **Flows** ဒါမှမဟုတ် **Specs** ကို နှိပ်ပါ။
2. Element ဘေးက **View more actions** icon ကို နှိပ်ပြီး **Move** ကို ရွေးပါ။
3. Element ကို ရွှေ့ချင်တဲ့ workspace ကို ရွေးပြီး **Move** ကို နှိပ်ပါ။

ကိုယ့်မှာ access ရှိတဲ့ partner နဲ့ public workspaces တွေဆီကိုတော့ elements တွေ ရွှေ့လို့ရပေမယ့် — partner ဒါမှမဟုတ် public workspace တစ်ခုကနေ internal workspace တစ်ခုဆီကိုတော့ elements တွေ ရွှေ့ပြောင်းလို့မရပါဘူး။

## နောက်ထပ်အဆင့်များ

Workspaces တွေ အသုံးပြုပုံနဲ့ စီမံခန့်ခွဲပုံ အသေးစိတ်ကို — [Use Postman workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/use-workspaces/) နဲ့ [Manage Postman workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/) တွေမှာ ကြည့်နိုင်ပါတယ်။ Public workspace တွေ publish လုပ်ပြီး API Network မှာ မျှဝေချင်ရင် — [Public workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) အကြောင်းကို ဆက်လေ့လာနိုင်ပါတယ်။
