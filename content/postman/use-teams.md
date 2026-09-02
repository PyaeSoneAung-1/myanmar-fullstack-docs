---
title: "Postman မှာ ကိုယ့် Team နဲ့ ပူးပေါင်း ဆောင်ရွက်ခြင်း (Collaborate with Your Team in Postman)"
description: "Postman မှာ team တစ်ခုကို ဘယ်လို ရှာဖွေ, ဝင်ရောက်, ပြောင်းလဲ ဒါမှမဟုတ် ထွက်ခွာမလဲ — workspaces တွေ လွှဲပြောင်းခြင်း နဲ့ team ထွက်ခွာချိန်မှာ ကိုယ့် workspaces တွေ ဘာဖြစ်လဲဆိုတာ အပါအဝင်"
order: 97
source: "https://learning.postman.com/docs/collaborating-in-postman/use-teams/"
status: translated
updated: 2026-09-02
---

Internal workspaces တွေကို သုံးပြီး Postman ထဲမှာ တခြားသူတွေနဲ့ ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်။ ကိုယ့် organization အတွင်းမှာ [team တစ်ခုကို ရှာတွေ့နိုင်သလို](#ကိုယ့်-organization-အတွင်းမှာ-teams-တွေကို-ရှာဖွေခြင်း) — ကိုယ့် organization က ဖွင့်ပေးထားတဲ့ [တခြားနည်းလမ်းတွေနဲ့လည်း ဝင်ရောက်နိုင်ပါတယ်](#team-တစ်ခုသို့-ဝင်ရောက်ခြင်း)။

Team တွေ ဖန်တီးခြင်းအကြောင်း ပိုသိချင်ရင် — [Postman မှာ team တစ်ခု ဖန်တီးခြင်း](https://learning.postman.com/docs/administration/managing-your-team/create-teams/) ကို ကြည့်ပါ။

Postman မှာ team တစ်ခုထဲ ဝင်လိုက်တဲ့အခါ — ကိုယ့် workspaces တွေကို ရွှေ့ပြီး ပိုင်ဆိုင်မှုကို team ဆီ လွှဲပြောင်းနိုင်သလို — ကိုယ့် workspaces တွေကို သပ်သပ်ရေး ထားပြီး ကိုယ့် account ထဲမှာပဲ ပိုင်ဆိုင်မှု ထိန်းသိမ်းထားနိုင်ပါတယ်။

Team တစ်ခုထဲ ဝင်တာက ကိုယ့် account ကို အောက်ပါအတိုင်း သက်ရောက်မှု ရှိပါတယ်:

* ကိုယ့် workspaces တွေကို team ဆီ ရွှေ့လိုက်ရင် — ကိုယ့် account က နောက်တော့ မရှိတော့ပါဘူး။ Account တစ်ခုထဲမှာ အလုပ်လုပ်ရတာမျိုးထက် — teams တွေကြားမှာ ပြောင်းလဲ ရွေးချယ်နိုင်တဲ့ option ကို ရရှိပါလိမ့်မယ်။
* Workspaces တွေကို ကိုယ့်ဆီမှာပဲ ထားမယ်ဆိုရင် — ကိုယ့် account ကို ဆက်ထိန်းထားပါလိမ့်မယ်။ အချိန်မရွေး team နဲ့ ကိုယ့် account ကြားမှာ ပြောင်းလဲနိုင်ပါတယ်။

အချို့အခြေအနေတွေမှာ — team တစ်ခုထဲ ဝင်တဲ့အခါ ကိုယ့် workspaces တွေနဲ့ သူတို့ထဲက data တွေ အလိုအလျောက် လွှဲပြောင်းသွားပါတယ်။ အသေးစိတ်ကို [Team တစ်ခုသို့ ဝင်ရောက်ခြင်း](#team-တစ်ခုသို့-ဝင်ရောက်ခြင်း) မှာ ကြည့်ပါ။

[Team တစ်ခုကနေ ထွက်ခွာတဲ့အခါ](#team-တစ်ခုမှ-ထွက်ခွာခြင်း) — ကိုယ့်မှာ ရှိပြီးသား account တစ်ခု မရှိသေးရင် သင့်အတွက် [Postman account](https://learning.postman.com/docs/getting-started/installation/account/overview/) တစ်ခု ဖန်တီးပေးပါတယ်။ [SCIM (System for Cross-domain Identity Management)](https://learning.postman.com/docs/administration/scim-provisioning/scim-provisioning-overview/) ကနေတစ်ဆင့် deactivate လုပ်ခံရပေမယ့် တခြား teams တွေရဲ့ member ဖြစ်နေသေးရင် — ကိုယ့် account နဲ့ ကိုယ် ပါဝင်နေတဲ့ တခြား teams တွေဆီ access ကို ဆက်ထိန်းထားပါလိမ့်မယ်။ တခြား team တစ်ခုမှာမှ member မဟုတ်ဘဲ account တစ်ခုမှ မရှိဘူးဆိုရင် — authenticate လုပ်နိုင်တော့မှာ မဟုတ်ဘဲ [support ကို ဆက်သွယ်](https://www.postman.com/support/) ဖို့ လိုအပ်ပါလိမ့်မယ်။

## ကိုယ့် organization အတွင်းမှာ teams တွေကို ရှာဖွေခြင်း

Team ဒါမှမဟုတ် Enterprise plan တစ်ခုပေါ်မှာ ကုမ္ပဏီ email နဲ့ Postman ကို ပထမဆုံး ဝင်တဲ့အခါ — ကိုယ့် organization အတွင်းမှာ ဝင်လို့ရတဲ့ teams တွေကို Postman က စာရင်းပြပါတယ်။ Teams စာရင်း အပြည့်အစုံ ကြည့်ဖို့ **Show More** ကို နှိပ်ပါ။

ကိုယ့် organization ထဲက ရှာဖွေတွေ့ရှိနိုင်တဲ့ teams အားလုံးကို ကြည့်ဖို့ — [Postman Home](https://go.postman.co/home) စာမျက်နှာမှာ **Teams** ကို နှိပ်ပါ။ ကိုယ့် profile settings အောက်က **Teams** ကနေလည်း ရှာဖွေတွေ့ရှိနိုင်တဲ့ teams အားလုံးကို ကြည့်ရှုနိုင်ပါတယ်။

Team တစ်ခုဘေးက **Join** ကို နှိပ်ပါ။ Admin တစ်ယောက်က မဖြစ်မနေ မေးခွန်းတစ်ခု သတ်မှတ်ထားရင် — အဲဒီမေးခွန်းကို ဖြေပြီး **Submit** ကို နှိပ်ပါ။ Admins တွေက ကိုယ့် request ကို အတည်ပြုလိုက်တဲ့အခါ — team ကို access လုပ်နိုင်ပြီး အတွင်းမှာရှိတဲ့ API ပရောဂျက်တွေပေါ်မှာ ပူးပေါင်း လုပ်ဆောင်နိုင်ပါလိမ့်မယ်။

## Team တစ်ခုသို့ ဝင်ရောက်ခြင်း

Postman team တစ်ခုထဲ ဝင်ရောက်ဖို့ နည်းလမ်း အများအပြား ရှိပါတယ်:

* **Email invite** — Email invite ထဲမှာ **Join Team** ကို နှိပ်ပါ။ Postman account အသစ်တစ်ခု ဖန်တီးပါ ဒါမှမဟုတ် ရှိပြီးသား account တစ်ခုနဲ့ sign in လုပ်ပါ။ Sign in ပြီးတာနဲ့ — ကိုယ့် team အသစ်ဆီ ပြန်ညွှန်းခံရပါလိမ့်မယ်။
* **Invite link** — Link ကို ဖွင့်ပြီး **Accept Invite** ကို နှိပ်ပါ။ Postman account အသစ်တစ်ခု ဖန်တီးပါ ဒါမှမဟုတ် ရှိပြီးသား account တစ်ခုနဲ့ sign in လုပ်ပါ။ Sign in ပြီးတာနဲ့ — ကိုယ့် team အသစ်ဆီ ပြန်ညွှန်းခံရပါလိမ့်မယ်။
* **Team discovery** — ကိုယ့် organization အတွင်းမှာ [ဝင်ရောက်ဖို့ teams တွေကို ရှာနိုင်ပါတယ်](#ကိုယ့်-organization-အတွင်းမှာ-teams-တွေကို-ရှာဖွေခြင်း)။
* **Team Request for Access (RFA)** — ကိုယ် မပါဝင်ထားတဲ့ team တစ်ခုက resource တစ်ခုဆီ (ဥပမာ — collection ဒါမှမဟုတ် request တစ်ခုဆီ) link တစ်ခုကို access လုပ်ရင် — အဲဒီ team ဆီ access တောင်းခံဖို့ ရွေးချယ်နိုင်ပါတယ်။ Admin တစ်ယောက်က ကိုယ့် request ကို အတည်ပြုရပါမယ်။ Team plans တွေမှာ team settings ထဲ ဖွင့်ထားရင် — shared link တစ်ခုကို သုံးပြီး team တစ်ခုထဲကို အလိုအလျောက် ဝင်လို့ရပါတယ်။ အသေးစိတ်ကို [Shared resources တွေကနေ team access စီမံခန့်ခွဲခြင်း](/docs/postman/requesting-access-to-elements) မှာ ကြည့်ပါ။
* **SSO automatic provisioning** — ကိုယ့် organization ထဲက team တစ်ခုက သူတို့ရဲ့ SSO configuration ထဲမှာ [automatic provisioning](https://learning.postman.com/docs/administration/sso/admin-sso/) ဖွင့်ထားရင် — [Postman ထဲကို SSO နဲ့ sign in လုပ်ခြင်း](https://learning.postman.com/docs/administration/sso/user-sso/) အားဖြင့် team ထဲ ဝင်နိုင်ပါတယ်။
* **SCIM provisioning** — ကိုယ့် organization က [SCIM provisioning](https://learning.postman.com/docs/administration/scim-provisioning/scim-provisioning-overview/) ဖွင့်ထားရင် — ကိုယ့် organization ရဲ့ Postman team ထဲ ထည့်သွင်းခံရပြီး email invite တစ်ခု ရရှိနိုင်ပါတယ်။ Email ထဲက **Join Team** ကို နှိပ်ပြီး [Postman ထဲကို SSO နဲ့ sign in လုပ်ပါ](https://learning.postman.com/docs/administration/sso/user-sso/)။
* **Domain capture** — ကိုယ့် organization က [domain capture](https://learning.postman.com/docs/administration/domain-verification-and-capture/domain-capture-overview/) ကို ပြင်ဆင်ထားပြီး — အတည်ပြုပြီးသား domain တစ်ခုနဲ့ ဆက်စပ်တဲ့ account တစ်ခုကို ကိုယ် သုံးနေတာ ဒါမှမဟုတ် ဖန်တီးနေတာဆိုရင် — နောက်တစ်ကြိမ် sign in လုပ်တဲ့အခါ ကိုယ့် account ကို ကိုယ့် organization က စီမံခန့်ခွဲနေကြောင်း Postman က အသိပေးပါလိမ့်မယ်။

Team plan ပေါ်မှာပဲ ဖြစ်ဖြစ် Enterprise plan ပေါ်မှာပဲ ဖြစ်ဖြစ် — Postman teams ဆယ်ခုအထိ member ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် ကိုယ့် organization ထဲက Enterprise team တစ်ခုက domain capture ကို သုံးနေတယ်ဆိုရင် — captured accounts တွေနဲ့ Postman teams တွေ ထပ်ထည့်ဖို့ ဒါမှမဟုတ် ဆက်ပြီး ပါဝင်နေဖို့ မဖြစ်နိုင်တော့ပါဘူး။

### Workspaces တွေကို team တစ်ခုဆီ လွှဲပြောင်းခြင်း

ကိုယ့်မှာ account တစ်ခု ရှိပြီး team တစ်ခုထဲ ဝင်မယ်ဆိုရင် — ကိုယ့် workspaces တွေနဲ့ သူတို့ထဲက data တွေကို team ဆီ လွှဲပြောင်းဖို့ ဒါမှမဟုတ် သပ်သပ်ရေ ထားဖို့ ရွေးချယ်နိုင်ပါတယ်။ အောက်ပါ အခြေအနေတွေမှာတော့ — team တစ်ခုထဲ ဝင်တဲ့အခါ ကိုယ့် workspaces တွေနဲ့ သူတို့ထဲက data တွေ အလိုအလျောက် လွှဲပြောင်းသွားပါတယ်:

* [Team တစ်ခုထဲ ဝင်ဖို့ request လုပ်ပြီး](#team-တစ်ခုသို့-ဝင်ရောက်ခြင်း) Admin တစ်ယောက်က အတည်ပြုပေးတဲ့အခါ။
* Team မှာ [SCIM provisioning](https://learning.postman.com/docs/administration/scim-provisioning/scim-provisioning-overview/) ဖွင့်ထားရင်။
* Team မှာ [domain capture](https://learning.postman.com/docs/administration/domain-verification-and-capture/domain-capture-overview/) ဖွင့်ထားရင်။

Enterprise team တစ်ခုထဲ ဝင်တဲ့အခါ — [Super Admins](https://learning.postman.com/docs/administration/roles-and-permissions/) တွေက ကိုယ် လွှဲပြောင်းပေးတဲ့ workspaces အားလုံးနဲ့ — နောက်ပိုင်းမှာ team အတွင်းမှာ ကိုယ် ဖန်တီးတဲ့ workspaces တွေကိုပါ access ရှိပါတယ်။

Team တစ်ခုကနေ ထွက်ခွာတဲ့အခါ — team ထဲက ကိုယ့် workspaces တွေနဲ့ သူတို့ရဲ့ data တွေက team မှာ ကျန်ရစ်ပြီး — အချို့အခြေအနေတွေမှာ ကိုယ် ဆက်လက် access လုပ်လို့ မရတော့ပါဘူး။ အသေးစိတ်ကို [Team တစ်ခုမှ ထွက်ခွာခြင်း](#team-တစ်ခုမှ-ထွက်ခွာခြင်း) မှာ ကြည့်ပါ။ Team တစ်ခုထဲက workspaces ဆိုတာ workspace visibility ကို ရည်ညွှန်းတာဖြစ်ပြီး — data ပိုင်ဆိုင်မှုကို ရည်ညွှန်းတာ မဟုတ်ပါဘူး။

## Teams တွေကြား ပြောင်းလဲခြင်း

Team အများအပြားရဲ့ member ဖြစ်နေရင် — ကိုယ့် Postman account တစ်ခုတည်းနဲ့ အချိန်တစ်ပြိုင်တည်း အားလုံးထဲ sign in လုပ်နိုင်ပါတယ်။ Teams တွေကြား ပြောင်းဖို့ — Postman header ထဲက ကိုယ့် avatar ကို ရွေးပြီး **Switch to** ကို ရွေးကာ တခြား team တစ်ခုကို ရွေးချယ်ပါ။

## Team တစ်ခုမှ ထွက်ခွာခြင်း

Postman team တစ်ခုကနေ ထွက်ခွာဖို့ — ညာဘက်အပေါ်က ကိုယ့် avatar ကို နှိပ်ပြီး **Settings** ကို ရွေးပါ။ ဘယ်ဘက်မှာ **Teams** ကို နှိပ်ပါ။

Team တစ်ခုရဲ့ ညာဘက်မှာ **Leave** ကို နှိပ်ပြီး ထွက်ခွာနိုင်ပါတယ်။ [SCIM ပြင်ဆင်ထားတဲ့](https://learning.postman.com/docs/administration/scim-provisioning/scim-provisioning-overview/) Enterprise team တစ်ခုရဲ့ member ဖြစ်နေရင်တော့ — team ကနေ ဖယ်ရှားပေးဖို့ Admin တစ်ယောက်ကို ဆက်သွယ်ရပါမယ်။

### Team တစ်ခုကနေ ထွက်ခွာတဲ့အခါ Postman က ကိုယ့် workspaces တွေကို ဘယ်လို စီမံလဲ

Team တစ်ခုကနေ ထွက်ခွာတဲ့အခါ — ကိုယ့်မှာ account တစ်ခု ရှိ မရှိပေါ်မူတည်ပြီး Postman က ကိုယ့် workspaces တွေနဲ့ သူတို့ရဲ့ data တွေကို ကွဲပြားစွာ စီမံပါတယ်:

* Team တစ်ခုကနေ ထွက်ခွာတဲ့အခါ — team ရဲ့ workspaces တွေ ဒါမှမဟုတ် သူတို့ထဲက elements တစ်ခုခုကို ဆက်လက် access လုပ်လို့ မရတော့ပါဘူး။ ဒါပေမယ့် — ကိုယ့်အတွက် အသစ် ဖန်တီးပေးမယ့် team တစ်ခုထဲမှာ ကိုယ် ဖန်တီးခဲ့တဲ့ workspaces တွေကို ကိုယ့်တစ်ယောက်တည်း access အတွက် သိမ်းထားနိုင်ပါတယ်။ ကိုယ့်မှာ team မဟုတ်တဲ့ ကိုယ်ပိုင် account တစ်ခု မရှိသေးရင် — team မဟုတ်တဲ့ ကိုယ်ပိုင် account တစ်ခုကို ဖန်တီးပေးပါတယ်။

* Enterprise team တစ်ခုရဲ့ member ဖြစ်နေရင် — မထွက်ခွာခင် ကိုယ့် team workspaces တွေကို ကျန်နေတဲ့ team member တစ်ယောက်ဆီ ပြန်လွှဲပေးရပါမယ်။

  Account တစ်ခုက team တစ်ခုနဲ့ ဆက်စပ်မှု မရှိဘဲ — ကိုယ့်တစ်ယောက်တည်းပဲ access လုပ်နိုင်ပါတယ်။ ကိုယ့် account ကို access လုပ်ဖို့ [Teams တွေကြား ပြောင်းလဲခြင်း](#teams-တွေကြား-ပြောင်းလဲခြင်း) ကို ကြည့်ပါ။

* Team တစ်ခုပေါ်မှာ ရှိပြီး account မရှိဘူးဆိုရင် — team ကနေ ထွက်ခွာတဲ့အခါ ကိုယ့် workspaces တွေနဲ့ သူတို့နဲ့ ဆက်စပ်တဲ့ data တွေကို account အသစ်တစ်ခုဆီ ရွှေ့ဖို့ ရွေးချယ်နိုင်ပါတယ်။

* Team တစ်ခုကနေ ထွက်ခွာတဲ့ နောက်ဆုံး member ဖြစ်နေရင် — team ကို ဖျက်လိုက်ပါတယ်။ ကိုယ့်တစ်ယောက်တည်း access လုပ်ဖို့ သတ်မှတ်ထားတဲ့ workspaces တွေအပါအဝင် — team ရဲ့ workspaces တွေ ဒါမှမဟုတ် သူတို့ထဲက elements တွေကို နောက်တော့ access လုပ်လို့ မရတော့ပါဘူး။ Admins ဒါမှမဟုတ် Super Admins တွေက — data တွေ သိမ်းထားဖို့ team ကနေ မထွက်ခွာခင် [data dump တစ်ခု export](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/) လုပ်နိုင်ပါတယ်။
