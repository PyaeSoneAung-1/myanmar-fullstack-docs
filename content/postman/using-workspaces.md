---
title: "Workspaces များ အသုံးပြုခြင်း ခြုံငုံသုံးသပ်ချက် (Workspaces Overview)"
description: "Postman workspaces ဆိုတာ ဘာလဲ — workspace types (internal/private, partner, public), workspace visibility ပြောင်းလဲခြင်း နဲ့ users တွေ ထပ်ထည့်ခြင်း"
order: 27
source: "https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/overview/"
status: translated
updated: 2026-09-02
---

Postman မှာ *workspace* တွေက — ကိုယ့်ရဲ့ Postman အလုပ်တွေကို စုစည်းပြီး teammates တွေနဲ့ ပူးပေါင်းလုပ်ဆောင်နိုင်အောင် ကူညီပေးပါတယ်။ ဆက်စပ်နေတဲ့ APIs, collections, environments, mocks, monitors နဲ့ တခြား linked elements တွေအတွက် workspace က single source of truth တစ်ခုအနေနဲ့ ဆောင်ရွက်ပြီး — ကိုယ့်ရဲ့ projects တွေကို အုပ်စုဖွဲ့နိုင်ပါတယ်။ Workspace တစ်ခုထဲမှာ ပူးပေါင်းလုပ်ဆောင်တဲ့အခါ — ကိုယ့်ရဲ့ တည်းဖြတ်မှုတွေက team နဲ့ real time အတိုင်း sync ဖြစ်ပါတယ်။

## Workspace types တွေ

[Postman account](https://learning.postman.com/docs/getting-started/installation/account/overview/) တစ်ခုနဲ့ — အောက်ပါ workspace types တွေကို ဖန်တီးနိုင်ပါတယ်:

* **Internal** — [Internal workspaces](/docs/postman/creating-workspaces) တွေကို ကိုယ်တိုင်နဲ့ ကိုယ် ဖိတ်ခေါ်ထားသူတွေပဲ မြင်နိုင်သလို — ကိုယ့် team (Enterprise plan ပေါ်ဆိုရင် organization တစ်ခုလုံး) ကပါ မြင်နိုင်အောင်လည်း လုပ်နိုင်ပါတယ်။ Enterprise team တစ်ခုပေါ်မှာဆိုရင် — [Super Admins](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) တွေကလည်း team ထဲမှာ ဖန်တီးထားတဲ့ internal workspaces တွေကို access လုပ်နိုင်ပါတယ်။
  * **Private workspaces (ကိုယ်ပိုင် workspaces)** — Team member တိုင်းက invite-only workspace တစ်ခု ဖန်တီးနိုင်ပေမယ့် — [Team plan](https://www.postman.com/pricing/) ပေါ်မှာ private workspace တစ်ခုထဲကို တခြားလူတစ်ယောက် ထပ်ထည့်လိုက်တာနဲ့ — workspace ရဲ့ visibility က အလိုအလျောက် Team အဖြစ် ပြောင်းသွားပါတယ်။ [Enterprise plan](https://www.postman.com/pricing/) ကတော့ — team members တခြားသူတွေ ထည့်ထားရင်တောင် private အဖြစ် ဆက်ရှိနေမယ့် private workspaces တွေ ဖန်တီးခွင့် ပေးပါတယ်။
* **Partner** — ဖိတ်ခေါ်ထားတဲ့ team users တွေနဲ့ [partners](/docs/postman/creating-workspaces) တွေက Partner Workspaces တွေကို access လုပ်နိုင်ပါတယ် ([Enterprise plans](https://www.postman.com/pricing/) မှာပဲ ရပါတယ်)။
* **Public** — [Public workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) တွေနဲ့ — ကမ္ဘာပေါ်က ဘယ်သူနဲ့မဆို elements တွေပေါ်မှာ ပူးပေါင်းလုပ်ဆောင်နိုင်ပြီး [Postman API Network](https://learning.postman.com/docs/postman-api-network/overview/) ကိုလည်း အသုံးချနိုင်ပါတယ်။

Workspace ရဲ့ type ကို ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ် — workspace settings ဆီ သွားပြီး **Workspace type > Change** ကို ရွေးပါ။ Internal, partner နဲ့ public API collaboration တွေအတွက် workspaces တွေ setup လုပ်ရာမှာ လမ်းညွှန်ချက်တွေ ရဖို့ — [workspace types အမျိုးမျိုးအတွက် Postman Best Practices](https://www.postman.com/postman-best-practices/) ကို ကြည့်ရှုပါ။

Workspace ထဲကို users အသစ်တွေ ထပ်ထည့်ဖို့ — Postman header ထဲက **Invite** ကို ရွေးပါ။

[Workspaces တွေ ဖန်တီးခြင်း](/docs/postman/creating-workspaces) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။ Workspace permissions တွေကို ဘယ်လို စီမံခန့်ခွဲလဲ သိချင်ရင် — [Internal workspaces တွေ စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/administration/managing-your-team/manage-team-workspaces/) ကို ကြည့်ပါ။
