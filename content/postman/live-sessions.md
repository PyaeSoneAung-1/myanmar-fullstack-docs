---
title: "Postman မှာ Live Sessions နဲ့ ပူးပေါင်း ဆောင်ရွက်ခြင်း (Collaborate in Postman with Live Sessions)"
description: "Live Sessions နဲ့ Postman မှာ teammates နဲ့ partners တွေနဲ့အတူ HTTP collections တွေထဲမှာ အချိန်နဲ့တပြေးညီ ပူးပေါင်း လုပ်ဆောင်နည်း — live session စတင်ခြင်း, session အတွင်း ပူးပေါင်းခြင်း, session အဆုံးသတ်ခြင်း"
order: 96
source: "https://learning.postman.com/docs/collaborating-in-postman/live-sessions/"
status: translated
updated: 2026-09-02
---

Live Sessions နဲ့ဆိုရင် — ကိုယ့် workspace ထဲက HTTP collections အားလုံးမှာ teammates တွေနဲ့ ပြင်ပ partners တွေနဲ့အတူ အချိန်နဲ့တပြေးညီ (real time) ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်။ Live session တစ်ခုအတွင်း API lifecycle တစ်လျှောက်လုံး — ကိုယ့် team က collection, folder နဲ့ request တစ်ခုတည်းကနေ တစ်ယောက်နဲ့တစ်ယောက်ရဲ့ အပြောင်းအလဲတွေကို live ကြည့်ရှုရင်း ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်။ Collaborators တွေက API tests တွေကို အပြန်အလှန် ရေးသားနိုင်, request တစ်ခု failed ဖြစ်တာကို debug လုပ်နိုင်, collaborator တစ်ယောက်ရဲ့ local machine ပေါ်မှာ run နေတဲ့ APIs တွေကို test နဲ့ debug လုပ်နိုင်တဲ့အပြင် — အခြားအရာတွေလည်း များစွာ လုပ်နိုင်ပါတယ်။

[Internal workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/) တစ်ခုကနေ live session တစ်ခု စတင်နိုင်ပါတယ်။ [Postman Enterprise plan](https://www.postman.com/pricing/) တစ်ခုပေါ်မှာ ဆိုရင် — ကိုယ့် private APIs တွေဆီ ပြင်ပ partners တွေကို onboarding လုပ်နိုင်ဖို့ [Partner Workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/partner-workspaces/overview/) တစ်ခုကနေလည်း live session တစ်ခု စတင်နိုင်ပါတယ်။ Live Sessions က [multi-partner mode](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/partner-workspaces/multipartner-workspaces/) ဖွင့်ထားတဲ့ Partner Workspaces တွေကိုတော့ မပံ့ပိုးပါဘူး။

## Live session တစ်ခု စတင်ခြင်း

Internal workspace တစ်ခု ဒါမှမဟုတ် Partner Workspace တစ်ခုကနေ live session တစ်ခု စတင်နိုင်ပါတယ်။ Live session တစ်ခု စတင်ဖို့ collection တစ်ခုပေါ်မှာ အနည်းဆုံး Viewer permissions တွေ ရှိရပါမယ်။ Live session တစ်ခုမှာ ပါဝင်ဖို့ Collaborators တွေက collection တစ်ခုပေါ်မှာ အနည်းဆုံး Viewer permissions တွေ ရှိရပါမယ်။ Live session ကို စတင်တဲ့ user က session ကြာချိန်တစ်လျှောက်လုံး host ဖြစ်ပါတယ်။ Requests တွေကို — ဘယ် user က ပို့ပေးပေါ့ — host ရဲ့ local machine ကနေပဲ ပို့ပေးပါတယ်။

**အရေးကြီးသည်:**

Live session တစ်ခုမှာ ပါဝင်သူတိုင်းက host ရဲ့ local machine ပေါ်က API response ကို ကြည့်ရှုနိုင်ပါတယ်။ ဘယ်သူတွေကို live session တစ်ခုထဲ ထည့်မလဲ ဆုံးဖြတ်တဲ့အခါ — response တစ်ခုထဲမှာ ပြသတဲ့ data တွေရဲ့ sensitivity (ထိခိုက်လွယ်မှု) ကို သေချာ စဉ်းစားပါ။ [Live session အတွင်း ပူးပေါင်း လုပ်ဆောင်ခြင်း](#live-session-အတွင်း-ပူးပေါင်း-လုပ်ဆောင်ခြင်း) အကြောင်း ပိုလေ့လာပါ။

Live session တစ်ခု စတင်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. ကိုယ့် workspace ကို ဖွင့်ပါ။

2. Postman header ထဲမှာ **Invite** ဘေးက workspace members တွေကို နှိပ်ပါ။

3. **Start Live Session** ကို နှိပ်ပါ။ Postman က ကိုယ့် live session ဆီ link တစ်ခုကို clipboard ထဲ ကူးပေးပါတယ်။

4. Link ကို ကိုယ့် teammates ဒါမှမဟုတ် partners တွေနဲ့ မျှဝေပါ။ ပူးပေါင်း လုပ်ဆောင်ဖို့ — link ကို မျှဝေလိုက်တဲ့သူက အနည်းဆုံး Viewer permissions တွေ ရှိရပါမယ်။

**အကြံပြုချက်:** Collection, folder ဒါမှမဟုတ် request တစ်ခုကနေလည်း live session တစ်ခု စတင်နိုင်ပါတယ်။ ဒီလို စတင်ဖို့ HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပြီး — ညာဘက်အပေါ်မှာ **Share** ကို နှိပ်ပါ။ ပြီးရင် **Live Session** ဘေးက **Start** ကို နှိပ်ပါ။

Postman က Postman header ထဲမှာ **Live** indicator ကို ထည့်ပေးပါတယ်။ ဒါဆိုရင် [အချိန်နဲ့တပြေးညီ ပူးပေါင်း လုပ်ဆောင်ဖို့](#live-session-အတွင်း-ပူးပေါင်း-လုပ်ဆောင်ခြင်း) အသင့်ဖြစ်ပါပြီ။ ပြီးတဲ့အခါ [session ကို အဆုံးသတ်ပါ](#live-session-တစ်ခုကို-အဆုံးသတ်ခြင်း)။

Live session link ကို နောက်တစ်ကြိမ် လိုအပ်ရင် — [live session link ကို ကူးယူပြီး](#live-session-ဆီ-link-တစ်ခု-share-လုပ်ခြင်း) ကိုယ့် team နဲ့ partners တွေဆီ မျှဝေပါ။

## Live session အတွင်း ပူးပေါင်း လုပ်ဆောင်ခြင်း

Host က [live session ကို စတင်ပြီးတာနဲ့](#live-session-တစ်ခု-စတင်ခြင်း) — ကိုယ့် team က workspace ထဲက HTTP collections, folders နဲ့ requests တွေကို အတူတကွ သုံးပြီး ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်။ Live session အတွင်း collaborators တွေရဲ့ အပြောင်းအလဲတွေကို ကြည့်ရှုနိုင်တာကြောင့် — လူတိုင်း real time မှာ အတူတကွ လုပ်ဆောင်နိုင်ပါတယ်။ Request method ပြောင်းခြင်း, request parameters တွေ ထည့်ခြင်း, response ကြည့်ခြင်း စတဲ့ — collection တစ်ခုထဲမှာ ပုံမှန် လုပ်ဆောင်ရတဲ့ အလုပ်တွေကို ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်။ [Host က workspace ကို ပိတ်လိုက်တဲ့အခါ ဒါမှမဟုတ် live session ကို အဆုံးသတ်လိုက်တဲ့အခါ](#live-session-တစ်ခုကို-အဆုံးသတ်ခြင်း) — live session က ပါဝင်သူအားလုံးအတွက် အဆုံးသတ်သွားပါတယ်။

Collections ထဲက [types in collections](https://learning.postman.com/docs/design-apis/collections/overview/) features တွေဆီ လုပ်တဲ့ edits တွေကိုတော့ live session အတွင်း မျှဝေပေးမှာ မဟုတ်ပါဘူး။

Postman က requests တွေကို host ရဲ့ local machine ကနေ ပို့ပေးပါတယ်။ ကိုယ်က host ဖြစ်ပြီး ပါဝင်သူတစ်ယောက်က request တစ်ခု ပို့ချင်တယ်ဆိုရင် — အဲဒီ request ကို ကိုယ့် local machine ပေါ်မှာ ဖွင့်ထားပါ။ ဒါက collaborator တစ်ယောက်ရဲ့ machine ပေါ်မှာ local အနေနဲ့ run နေတဲ့ APIs တွေကို test နဲ့ debug လုပ်ချင်တဲ့ နေရာစုံက collaborators တွေအတွက် အသုံးဝင်ပါတယ်။ Request ကို ပို့တဲ့အခါ Variables တွေနဲ့ vault secrets တွေက host ရဲ့ local machine ကနေ resolve လုပ်ပါတယ်။ Host ရဲ့ variables တွေနဲ့ vault secrets တွေနဲ့ ဆက်စပ်တဲ့ တန်ဖိုးတွေကိုတော့ Collaborators တွေ ကြည့်လို့ မရပါဘူး။

Live session အတွင်းမှာ Postman က Postman header ထဲမှာ မှိတ်တုတ်မှိတ်တုတ် ဖြစ်နေတဲ့ အပြာရောင် dot တစ်ခုကို ပြသပါတယ်။ ဘယ် collaborators တွေ live session ထဲမှာ ရှိနေလဲ ကြည့်ဖို့နဲ့ — [live session ဆီ link တစ်ခု share လုပ်ခြင်း](#live-session-ဆီ-link-တစ်ခု-share-လုပ်ခြင်း) ဒါမှမဟုတ် [live session ကနေ ထွက်ခွာခြင်း](#live-session-တစ်ခုမှ-ထွက်ခွာခြင်း) လိုမျိုး နောက်ထပ် လုပ်ဆောင်ချက်တွေ လုပ်ဖို့ — **Live** ကို နှိပ်ပါ။ Live session အတွင်း မျှဝေထားတဲ့ — HTTP collection တစ်ခုထဲက folder တစ်ခုလိုမျိုး — ဖွင့်ထားတဲ့ tabs တွေရဲ့ အောက်ခြေမှာ Postman က အပြာရောင် underline တစ်ခု ပြသပါတယ်။

User တစ်ယောက်ချင်းစီရဲ့ presence ကို — သူတို့ တက်ကြွစွာ တည်းဖြတ်နေတဲ့အခါ ပြသလာတဲ့ အရောင်တစ်ရောင်နဲ့ သူတို့ရဲ့ အမည်အတိုကောက် (initials) တွေနဲ့ ကိုယ်စားပြုပါတယ်။ User တစ်ယောက်ရဲ့ အရောင်က သူတို့ တည်းဖြတ်နေတဲ့ နေရာ ဒါမှမဟုတ် editor တစ်ခုထဲက သူတို့ရဲ့ cursor ကို မျဉ်းသားပြပါတယ်။ သူတို့ရဲ့ initials တွေက သူတို့ တည်းဖြတ်နေတဲ့ နေရာရဲ့ ဘေးမှာ ပြသပါတယ်။ Live session အတွင်း user တစ်ယောက်နဲ့ ဆက်စပ်နေတဲ့ အရောင်ကို ကြည့်ဖို့ — **Live** ကို နှိပ်ပြီး သူတို့ရဲ့ avatar ကို မျဉ်းသားထားတဲ့ အရောင်ကို ကြည့်ပါ။

## Live session ဆီ link တစ်ခု share လုပ်ခြင်း

Live session တစ်ခုအတွင်းမှာ — အနည်းဆုံး Viewer permissions ရှိတဲ့ ကိုယ့် collaborators တွေဆီ session ဆီ link တစ်ခုကို share လုပ်နိုင်ပါတယ်။

Live session ဆီ link တစ်ခု share လုပ်ဖို့ — Postman header ကနေ **Live** ကို နှိပ်ပြီး **Copy Live Link** ကို နှိပ်ပါ။

## Session တစ်ခုကို အဆုံးသတ်ခြင်း ဒါမှမဟုတ် ထွက်ခွာခြင်း

Live session host တစ်ယောက်က session တစ်ခုကို အဆုံးသတ်နိုင်ပါတယ်။ ပါဝင်သူတစ်ယောက်ကတော့ ထွက်ခွာနိုင်ပါတယ်။

### Live session တစ်ခုကို အဆုံးသတ်ခြင်း

ကိုယ်က host ဆိုရင် — ပါဝင်သူအားလုံးအတွက် live session တစ်ခုကို အဆုံးသတ်နိုင်ပါတယ်။ Host က workspace ဒါမှမဟုတ် Postman app ကို ပိတ်လိုက်တဲ့အခါ live session တစ်ခုက အလိုအလျောက် အဆုံးသတ်သွားပါတယ်။

Live session တစ်ခုကို အဆုံးသတ်ဖို့ — Postman header ကနေ **Live** ကို နှိပ်ပြီး **End Session** ကို နှိပ်ပါ။

### Live session တစ်ခုမှ ထွက်ခွာခြင်း

ကိုယ်က ပါဝင်သူတစ်ယောက်ဆိုရင် — session ကနေ ထွက်ခွာနိုင်ပါတယ်။

Live session တစ်ခုကနေ ထွက်ခွာဖို့ — Postman header ကနေ **Live** ကို နှိပ်ပြီး **Leave Session** ကို နှိပ်ပါ။
