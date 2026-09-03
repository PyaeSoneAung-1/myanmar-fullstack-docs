---
title: "Postman Collections များကို မျှဝေခြင်းနဲ့ ပူးပေါင်းလုပ်ဆောင်ခြင်း"
description: "Postman Collections တွေကို team နဲ့ တခြား Postman users တွေဆီ မျှဝေခြင်း၊ collection တွေကို watch လုပ်ခြင်း၊ comment ထည့်ခြင်း၊ tag လုပ်ခြင်း၊ status သတ်မှတ်ခြင်း၊ fork လုပ်ခြင်းနဲ့ pull requests/forks/details တွေ ကြည့်ခြင်း"
order: 138
source: "https://learning.postman.com/docs/use/use-collections/collaborate-with-collections/"
status: translated
updated: 2026-09-03
---

Postman Collections တွေကို ကိုယ့် team နဲ့ တခြား Postman users တွေနဲ့အတူ ပူးပေါင်း လုပ်ဆောင်နိုင်ပါတယ်။ Collections တွေကို တခြားသူတွေဆီ မျှဝေနိုင်သလို — collection တစ်ခုကို watch လုပ်ထားရင် အပြောင်းအလဲတွေ ဖြစ်တိုင်း အသိပေးချက် ရနိုင်ပြီး၊ ကိုယ့်အမြင်ကို တခြားသူတွေ သိစေဖို့ collection တွေမှာ comment တွေလည်း ထည့်နိုင်ပါတယ်။ Collections တွေကို စုစည်းပြီး ရှာရလွယ်အောင် collection tags တွေကိုလည်း သုံးနိုင်ပါတယ်။

Forking ကလည်း collections တွေမှာ ပူးပေါင်း လုပ်ဆောင်နိုင်တဲ့ နောက်ထပ် နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။ Collection တစ်ခုကို ကိုယ့် workspace ထဲ fork လုပ်ပြီး — အပြောင်းအလဲတွေ လုပ်နိုင်သလို၊ ကိုယ့်ရဲ့ အပြောင်းအလဲတွေကို မူရင်း collection ထဲ ပြန်ပေါင်းဖို့ pull request တစ်ခုလည်း ဖန်တီးနိုင်ပါတယ်။

## Collection တစ်ခုကို မျှဝေခြင်း

Postman Collection တစ်ခုကို တခြား Postman users တွေဆီ မျှဝေဖို့ အောက်ပါ နည်းလမ်းတွေထဲက ဘယ်နည်းကိုမဆို သုံးနိုင်ပါတယ်:

* Sidebar ထဲက collection တစ်ခုကို ရွေးပြီး workbench ထဲက **Share** ကို နှိပ်ပါ။ Collection ကို မျှဝေချင်တဲ့ users တွေကို ထည့်နိုင်သလို — တခြားသူတွေနဲ့ မျှဝေဖို့ link တစ်ခုကိုလည်း copy လုပ်နိုင်ပါတယ်။ [Postman မှာ elements တွေ မျှဝေခြင်း](/docs/postman/sharing) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

  ကိုယ့် Postman team ထဲ မပါတဲ့ users တွေနဲ့ link မျှဝေချင်ရင် — **Allow guests to view collection via link** ကို ဖွင့်ပါ။ [Guests တွေနဲ့ collections တွေ မျှဝေခြင်း](/docs/postman/sharing) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

* Workbench ထဲမှာ collection ရဲ့ နာမည်ဘေးက ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-link-stroke.svg#icon) **Copy link** ကို နှိပ်ပါ။ ပြီးရင် အဲဒီ link ကို တခြားသူတွေနဲ့ မျှဝေနိုင်ပါတယ်။

  Active environment တစ်ခု ရွေးထားတဲ့အတိုင်း collection, folder, request ဒါမှမဟုတ် example တစ်ခုရဲ့ link ကို မျှဝေချင်ရင် — [environment selector ကို သုံးပြီး environment တစ်ခု ရွေးပါ](/docs/postman/managing-environments)။ Element ရဲ့ link က clipboard ထဲကို copy ဖြစ်သွားပြီး — အဲဒီ link ကို တခြားသူတွေနဲ့ မျှဝေနိုင်ပါတယ်။

* Collection ကို shared workspace တစ်ခုဆီ ရွှေ့ပါ။ Sidebar ထဲမှာ collection ပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions > Move** ကို နှိပ်ပါ။ [Postman elements တွေကို ရွှေ့ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#move-elements-to-workspaces) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

* [**Run in Postman**](https://learning.postman.com/docs/publishing-your-api/run-in-postman/creating-run-button/) button တစ်ခုကို publish လုပ်ပါ။ တခြားသူတွေက **Run in Postman** button ကို သုံးပြီး ကိုယ့် collection ကို သူတို့ရဲ့ ကိုယ်ပိုင် environment ထဲမှာ ကြည့်ရှုပြီး run နိုင်ပါတယ်။

## Collection တစ်ခုကို watch လုပ်ခြင်း

Collection တစ်ခုကို watch လုပ်ထားရင် — အဲဒီ collection မှာ အပြောင်းအလဲတစ်ခု လုပ်တိုင်း Postman က ကိုယ့်ကို အသိပေးပါတယ်။ Request တစ်ခု ထည့်တာ၊ request တစ်ခု ပြောင်းတာ၊ variables တွေ ထည့်တာ ဒါမှမဟုတ် update လုပ်တာ၊ pre-request ဒါမှမဟုတ် post-response scripts တွေ ပြင်တာ၊ folder တစ်ခု ထည့်တာ ဒါမှမဟုတ် ဖျက်တာ စတဲ့ အပြောင်းအလဲတွေအတွက် အသိပေးချက်တွေ ရပါတယ်။

Internal, partner နဲ့ public [workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/create-workspaces/) တွေထဲက collections တွေကို watch လုပ်နိုင်ပါတယ်။ ကိုယ်တစ်ယောက်တည်းအတွက်ပဲ ကန့်သတ်ထားတဲ့ workspaces တွေထဲက collections တွေကိုတော့ watch လုပ်လို့ မရပါဘူး။

Collection တစ်ခုကို watch လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ ![View icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-view-stroke.svg#icon) **Watch** ကို နှိပ်ပါ။

   ![Collection watching](https://assets.postman.com/postman-docs/v12/collection-watching-overview-v12-01.png)

အချိန်မရွေး collection တစ်ခုရဲ့ အပြောင်းအလဲတွေကို ကြည့်ချင်ရင် — sidebar ထဲက collection ကို ရွေးပြီး ညာဘက် sidebar ထဲက ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **Changelog** ကို နှိပ်ပါ။ ကိုယ့် collection အကြောင်း alerts တွေ ရဖို့ [Postman က တည်ဆောက်ထားတဲ့ integrations](https://learning.postman.com/docs/integrations/available-integrations/postman-integrations/) တွေကိုလည်း သုံးနိုင်ပါတယ်။

Collection တစ်ခုကို ဖန်တီးပြီး အဲဒီ collection မှာ အပြောင်းအလဲတွေကို ကိုယ့် Postman account ကနေပဲ လုပ်မယ်ဆိုရင် — ကိုယ်တိုင် လုပ်တဲ့ အပြောင်းအလဲတွေအတွက် အသိပေးချက်တွေတော့ မရပါဘူး။

## Collection တစ်ခုမှာ comment ထည့်ခြင်း

Team နဲ့ ပူးပေါင်းလုပ်ဆောင်ဖို့ ဒါမှမဟုတ် တခြား users တွေကို feedback ပေးဖို့ collection တစ်ခုမှာ comment ထည့်နိုင်ပါတယ်။

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. ညာဘက် sidebar ထဲက ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-comments-stroke.svg#icon) **Comments** ကို နှိပ်ပြီး ကိုယ့် comment ကို ရိုက်ထည့်ပါ။
3. Comment ထည့်ဖို့ **Comment** ကို နှိပ်ပါ။

Collections နဲ့ requests တွေမှာ comments တွေကို သုံးပြီး ပူးပေါင်းလုပ်ဆောင်နည်း အသေးစိတ်အတွက် — [Postman မှာ comments တွေနဲ့ ပူးပေါင်းလုပ်ဆောင်ခြင်း](/docs/postman/comments) ကို သွားပါ။

## Collection တစ်ခုကို tag လုပ်ခြင်း

[Tagging ကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ သုံးလို့ရပါတယ်။](https://www.postman.com/pricing/)

Tags တွေကို သုံးပြီး collections တွေကို စုစည်းနိုင်သလို ရှာဖွေနိုင်ပါတယ်။ Collection တစ်ခုမှာ tags တွေ ထည့်ပြီးတာနဲ့ — tag တစ်ခုကို ရွေးပြီး tag တူညီတဲ့ collections တွေနဲ့ တခြား elements တွေကို ရှာနိုင်ပါတယ်။

Collections တွေမှာ shared tags တွေကို သုံးနိုင်ပါတယ်။ Tags တွေက alphanumeric character တစ်လုံးနဲ့ စရပြီး — alphanumeric character တစ်လုံးနဲ့ပဲ အဆုံးသတ်ရပါတယ်။ Hyphen, underscore, slash နဲ့ period စတဲ့ သင်္ကေတတွေကိုတော့ ထည့်နိုင်ပါတယ်။ Tags တွေက case-sensitive မဟုတ်ဘဲ — space တွေလည်း ပါဝင်နိုင်ပါတယ်။ ဥပမာ — `Tag name` ဆိုတာ ရပါတယ်။ Tags တွေက Unicode characters တွေကို ထောက်ပံ့ပြီး — အရှည် 64 characters အထိ ရှိနိုင်ပါတယ်။ Collection တစ်ခုမှာ tags 10 ခုအထိ ထည့်နိုင်ပါတယ်။

Tag management ကို [Postman Enterprise plans](https://www.postman.com/pricing/) တွေမှာ သုံးလို့ရပါတယ်။ ကိုယ့် organization မှာ [tag management](https://learning.postman.com/docs/administration/managing-your-team/manage-team-workspaces/#manage-tags) ဖွင့်ထားရင် — tag တွေ ဖန်တီးတာကို Admins တွေပဲ လုပ်ခွင့်ရှိပြီး၊ ကိုယ့် team က ဖန်တီးထားတဲ့ tags တွေပဲ သုံးလို့ရနိုင်ပါတယ်။

Tags တွေကို သုံးပြီး Postman မှာ ရှာဖွေနည်း အကြောင်း ပိုလေ့လာချင်ရင် — [Postman မှာ ရှာဖွေခြင်း](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#search-postman) ကို သွားပါ။

Collection တစ်ခုကို tag လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ edit လုပ်ဖို့ **Select status or other tags** section ကို နှိပ်ပါ။

   ![Add tags to a collection](https://assets.postman.com/postman-docs/v12/add-tags-collection-v12-01.png)

3. ရှိပြီးသား tag တစ်ခုကို ရွေးပါ၊ ဒါမှမဟုတ် tag အသစ်တစ်ခု ထည့်ပါ။ Tag အသစ်တစ်ခု ထည့်ဖို့ — tag နာမည်ကို ရိုက်ထည့်ပြီး **Create "tag-name"** ကို နှိပ်ပါ။
4. အပြောင်းအလဲတွေ သိမ်းဖို့ **Select status or other tags** section ရဲ့ အပြင်ဘက်ကို နှိပ်ပါ။

Collection တစ်ခုကနေ tags တွေ ဖယ်ရှားဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. edit လုပ်ဖို့ **Select status or other tags** section ကို နှိပ်ပါ။
3. Tag တစ်ခုဘေးက ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-close-stroke.svg#icon) ကို နှိပ်ပါ။
4. အပြောင်းအလဲတွေ သိမ်းဖို့ **Select status or other tags** section ရဲ့ အပြင်ဘက်ကို နှိပ်ပါ။

## Collection တစ်ခုရဲ့ status သတ်မှတ်ခြင်း

**[Status tags တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ သုံးလို့ရပါတယ်။](https://www.postman.com/pricing/)** Internal collections တွေမှာ status tags တွေကို သုံးနိုင်ပါတယ်။

ကိုယ့် collection ရဲ့ lifecycle status ကို *status* tags တွေနဲ့ ဖော်ပြနိုင်ပါတယ်။ Status tags တွေက — collection တစ်ခုက ဖွံ့ဖြိုးဆဲ (in development), ပြန်လည်သုံးသပ်ဆဲ (in review), အသုံးပြုရန် အသင့် (ready to use), ဒါမှမဟုတ် အသုံးမပြုတော့ဘူး (deprecated) ဆိုတာတွေကို developers တွေ သိစေဖို့ ကူညီပေးတဲ့ အထူး tags တွေပါ။ Postman ရဲ့ ကြိုတင်သတ်မှတ်ထားတဲ့ status tags တွေကို သုံးနိုင်သလို — ကိုယ်ပိုင် status tags တွေကိုလည်း ဖန်တီးနိုင်ပါတယ်။ [တခြား tags တွေကို ရှာသလိုပဲ](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#search-postman) status tags တွေကိုလည်း ရှာနိုင်ပါတယ်။

Status tags တွေက အလျား 2 ကနေ 64 alphanumeric characters အထိ ရှိနိုင်ပြီး — alphabetical character တစ်လုံးနဲ့ စရပြီး emoji တစ်ခု ပါဝင်ရပါတယ်။ Status tags တွေမှာ dashes တွေ ပါဝင်နိုင်ပေမယ့် — တခြား special characters တွေ ဒါမှမဟုတ် space တွေတော့ မပါဝင်ရပါဘူး။ Collection တစ်ခုမှာ status tag တစ်ခုကိုပဲ တစ်ချိန်မှာ တစ်ခု သုံးနိုင်ပါတယ်။

Collection တစ်ခုမှာ status tag တစ်ခု သုံးဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ edit လုပ်ဖို့ **Select status or other tags** section ကို နှိပ်ပါ။
3. **Status** ပေါ်မှာ hover လုပ်ပြီး dropdown list ထဲက status tag တစ်ခုကို ရွေးပါ။

![Add a status to a collection](https://assets.postman.com/postman-docs/v12/add-status-collection-v12-01.png)

ကိုယ်ပိုင် status tag တစ်ခု ဖန်တီးဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ edit လုပ်ဖို့ **Select status or other tags** section ကို နှိပ်ပါ။
3. **Status** ပေါ်မှာ hover လုပ်ပြီး **+ Create custom status** ကို ရွေးပါ။
4. Status တစ်ခုကို ရိုက်ထည့်ပြီး emoji တစ်ခု ရွေးပါ။
5. **Create** ကို နှိပ်ပါ။

Collection တစ်ခုကနေ status tag တစ်ခုကို ဖယ်ရှားဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ edit လုပ်ဖို့ **Select status or other tags** section ကို နှိပ်ပါ။
3. Status tag တစ်ခုဘေးက ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-close-stroke.svg#icon) ကို နှိပ်ပါ။
4. အပြောင်းအလဲတွေ သိမ်းဖို့ **Select status or other tags** section ရဲ့ အပြင်ဘက်ကို နှိပ်ပါ။

## Collection တစ်ခုကို fork လုပ်ခြင်း

Collection တစ်ခုကို edit လုပ်ဖို့ access မရှိဘူးဆိုရင် — အဲဒီ collection ကို ကိုယ့် workspace ထဲ fork လုပ်ပြီး အပြောင်းအလဲတွေ လုပ်နိုင်ပါတယ်။ ပြီးရင် ကိုယ့်ရဲ့ အပြောင်းအလဲတွေကို မူရင်း collection ဆီ တင်သွင်းဖို့ pull request တစ်ခု ဖန်တီးနိုင်ပါတယ်။

Collection တစ်ခုကို fork လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Sidebar ထဲမှာ **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ ![Fork icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-fork-stroke.svg#icon) **Fork** ကို နှိပ်ပါ။

ပိုလေ့လာချင်ရင် — [Postman elements တွေအတွက် version control](/docs/postman/version-control-overview) ကို သွားပါ။

## Pull requests, forks နဲ့ collection အသေးစိတ်တွေကို ကြည့်ခြင်း

Collection တစ်ခုအကြောင်း အသေးစိတ်တွေ ပိုကြည့်ချင်ရင် — sidebar ထဲမှာ collection ကို ရွေးပြီး ညာဘက် sidebar ထဲမှာ အောက်ပါတွေထဲက ဘာကိုမဆို လုပ်နိုင်ပါတယ်:

* Collection အတွက် pull requests တွေ ကြည့်ဖို့ ![Merge icon](https://assets.postman.com/postman-docs/aether-icons/action-merge-stroke.svg#icon) **Pull Requests** ကို နှိပ်ပါ။
* Collection ကနေ ဖန်တီးထားတဲ့ forks တွေ ကြည့်ဖို့ ![Fork icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-fork-stroke.svg#icon) **Forks** ကို နှိပ်ပါ။
* Mock servers, monitors နဲ့ integrations တွေ အပါအဝင် — collection အကြောင်း အချက်အလက် ပိုကြည့်ဖို့ ![Info icon](https://assets.postman.com/postman-docs/aether-icons/v12/state-info-stroke.svg#icon) **Info** ကို နှိပ်ပါ။
