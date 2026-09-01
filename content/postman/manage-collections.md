---
title: "Postman Collections များ စီမံခြင်း နဲ့ စုစည်းခြင်း"
description: "Collection ထဲက requests တွေကို folders တွေနဲ့ အုပ်စုဖွဲ့ခြင်း၊ requests တွေ ပြန်စီခြင်း၊ collection ဖျက်ခြင်း၊ ဖျက်ထားတဲ့ collection တွေ ကြည့်ခြင်း နဲ့ ပြန်ယူခြင်း၊ changelog သုံးခြင်း"
order: 7
source: "https://learning.postman.com/docs/use/use-collections/manage-collections/"
status: translated
updated: 2026-09-01
---

Postman Collections တွေထဲမှာ ကိုယ့်ရဲ့ API requests အားလုံးကို သိမ်းဆည်း၊ စနစ်တကျ ထားရှိ၊ ရှာဖွေနိုင်ပါတယ်။ Collection ထဲမှာ folders တွေသုံးပြီး requests တွေကို type ဒါမှမဟုတ် use case အလိုက် အုပ်စုဖွဲ့နိုင်သလို — workflows တွေကို ပြန်ထုတ်နိုင်ဖို့ requests တွေကိုလည်း ပြန်စီနိုင်ပါတယ်။ Requests တွေကို အက္ခရာစဉ်အလိုက်လည်း ပြန်စီနိုင်ပါတယ်။ အပြောင်းအလဲတစ်ခုကို မသိမ်းချင်ဘူးဆိုရင် — collection ကို အရင် state တစ်ခုဆီ ပြန်ပြောင်းနိုင်ပါတယ်။

## Collection အခြေခံများ

လက်ရှိ workspace ထဲက collection အားလုံးကို ကြည့်ဖို့ — ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး sidebar ထဲမှာ **Collections** ကို ချဲ့ပါ။ ဒီကနေ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

* Collection တစ်ခုကို နှိပ်ပြီး workbench မှာ သူ့ရဲ့ overview ကို ဖွင့်ပြီး အကြောင်းအရာတွေကို ချဲ့ကြည့်နိုင်ပါတယ်။
* Collection တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Favorite icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-favorite-stroke.svg#icon) **Add to favorites** ကို နှိပ်ရင် — အဲဒီ collection ကို စာရင်းရဲ့ ထိပ်ဆုံးကို ရွှေ့ပေးပါတယ်။
* Sidebar ထဲက search box ကို သုံးပြီး collections တွေနဲ့ သူတို့ရဲ့ အကြောင်းအရာတွေကို စစ်ထုတ်နိုင်ပါတယ်။
* Collection တစ်ခုထဲက requests, folders, examples တွေကို drag and drop လုပ်ပြီး ပြန်စီနိုင်ပါတယ်။
* Collection ရဲ့ folders နဲ့ requests တွေကို အက္ခရာစဉ်အလိုက် စီဖို့ — collection ပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions > Sort** ကို ရွေးပြီး sort option တစ်ခုကို ရွေးပါ။
* **⌘** ဒါမှမဟုတ် **Ctrl** ကို ဖိထားပြီး bulk select လုပ်ချင်တဲ့ HTTP collection elements တွေကို နှိပ်နိုင်ပါတယ်။

## Collection တစ်ခုထဲ folders တွေ ထည့်ခြင်း

Collection တစ်ခုထဲက requests နဲ့ examples တွေကို စနစ်တကျထားဖို့ folders တွေကို သုံးပါ။ Nesting အဆင့်တွေ ပိုရှိစေဖို့ subfolders တွေလည်း ထည့်နိုင်ပါတယ်။

* Folder တစ်ခု ထည့်ဖို့ — collection ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး **Add folder** ကို နှိပ်ပါ။

* Subfolder တစ်ခု ထည့်ဖို့ — folder တစ်ခုဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး **Add folder** ကို နှိပ်ပါ။

Collection items တွေကို drag and drop လုပ်ပြီး folders ဒါမှမဟုတ် subfolders တွေထဲကို ထည့်နိုင်ပါတယ်။

## Collection တစ်ခုကို ဖျက်ခြင်း

Collection တစ်ခုကို မလိုတော့ဘူးဆိုရင် ဖျက်နိုင်ပါတယ်။ Editor permissions ရှိတဲ့ collections တွေကို ဖျက်နိုင်ပါတယ်။

Collection တစ်ခုကို ဖျက်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Collection ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး **Delete** ကို နှိပ်ပါ။ Collection ကို နှိပ်ပြီး keyboard ပေါ်က **Delete** ကို နှိပ်လို့လည်း ရပါတယ်။

2. Delete dialog ထဲမှာ collection ကို ပြန်သုံးသပ်ပါ။ မဖျက်ခင် အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

   * Collection ရဲ့ forks တွေနဲ့ အဲဒါတွေကို ဖန်တီးထားတဲ့ users တွေအကြောင်း အသေးစိတ်ကြည့်ဖို့ — **forks** ကို နှိပ်ပါ။
   * Collection ကနေ ဖန်တီးထားတဲ့ monitors တွေကို ကြည့်ဖို့ — **monitors** ကို နှိပ်ပါ။
   * Collection နဲ့ ဆက်စပ်နေတဲ့ mock servers တွေကို ကြည့်ဖို့ — **mock servers** ကို နှိပ်ပါ။
   * Collection က 30 MB ထက် ပိုကြီးရင် — မဖျက်ခင် collection ကို [back up လုပ်ဖို့](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/#export-collections) **Export** ကို နှိပ်နိုင်ပါတယ်။ 30 MB ထက် ကြီးတဲ့ collection ကိုတော့ [ဖျက်ပြီးမှ ပြန်ယူလို့](#collection-တစ်ခုကို-ပြန်ယူခြင်း-ဒါမှမဟုတ်-အပြီးတိုင်-ဖျက်ခြင်း) မရနိုင်ပါဘူး။

   Collection တစ်ခုက 30 MB ထက် ပိုကြီးရင် — collection ရဲ့ အကြောင်းအရာတွေကို သေးငယ်တဲ့ collections အများကြီးအဖြစ် ခွဲပြီးမှ ဖျက်နိုင်ပါတယ်။ ဒါက နောက်ပိုင်းမှာ collections တွေကို ပြန်ယူနိုင်ဖို့ option ပေးပါတယ်။

3. **Delete** ကို နှိပ်ပါ။

4. Collection ထဲမှာ requests တွေ ရှိရင် — "delete" လို့ ရိုက်ထည့်ပြီး **Delete Collection** ကို နှိပ်ပါ။

Collections အများကြီးကို တစ်ပြိုင်နက် ဖျက်ဖို့ bulk select လုပ်နိုင်ပါတယ်။ **⌘** ဒါမှမဟုတ် **Ctrl** ကို ဖိထားပြီး bulk select လုပ်ချင်တဲ့ collections တွေကို နှိပ်ပါ၊ ပြီးရင် keyboard ပေါ်က **Delete** ကို နှိပ်ပါ။

## ဖျက်လိုက်တဲ့ collection တစ်ခုကို ကြည့်ခြင်း

ကိုယ်ရော team ဝင်တခြားသူတွေပါ ဖျက်လိုက်တဲ့ HTTP collections တွေကို ကြည့်နိုင်ပါတယ်။ ဖျက်လိုက်တဲ့ collections တွေကို ကိုယ့်ရဲ့ [Postman plan](https://www.postman.com/pricing/) ပေါ်မူတည်ပြီး အချိန်အတိုင်းအတာ တစ်ခုအထိ သိမ်းထားပေးပါတယ်။

ကိုယ်ရော team ဝင်တွေပါ ဖျက်လိုက်တဲ့ collections တွေကို ကြည့်ဖို့ — Postman footer ထဲက **Tools > ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-delete-stroke.svg#icon) Trash** ကို နှိပ်ပါ။

ကိုယ်ဖျက်လိုက်တဲ့ workspaces တွေထဲက collections တွေ အပါအဝင် — ကိုယ်ရော team ဝင်တခြားသူတွေပါ ဖျက်လိုက်တဲ့ collections တွေကို ကြည့်နိုင်ပါတယ်။ Collection တစ်ခုစီအတွက် — collection ရဲ့ နာမည်၊ ဘယ် workspace ကနေ ဖျက်ခဲ့လဲ၊ ဘယ်သူ ဖျက်ခဲ့လဲ၊ ဘယ်ရက်မှာ ဖျက်ခဲ့လဲ ဆိုတာတွေကို ကြည့်နိုင်ပါတယ်။ Collection ကို ဘယ်ရက်မှာ အပြီးတိုင် ဖျက်မယ်ဆိုတဲ့ ရက်စွဲကိုလည်း ကြည့်နိုင်ပါတယ်။

Team ရဲ့ ဖျက်လိုက်တဲ့ collections တွေကို စီမံဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

* **Search collections** box ကို နှိပ်ပြီး collection တစ်ခုကို နာမည်နဲ့ ရှာပါ။
* **Workspaces** dropdown list ကို နှိပ်ပြီး collection တစ်ခုကို ဖျက်ခဲ့တဲ့ workspace ကို ရွေးပါ။
* **Deleted by** dropdown list ကို နှိပ်ပြီး collection ကို ဖျက်ခဲ့တဲ့ user တစ်ယောက်ကို ရွေးပါ။
* Collection တစ်ခုကို နှိပ်ပြီး — အကြိမ်ရေ ဘယ်လောက် fork လုပ်ခဲ့လဲ ဆိုတာလို အချက်အလက်တွေ ပိုကြည့်နိုင်ပါတယ်။
* Collection တစ်ခုကို ပြန်ယူဖို့ — အဲဒီပေါ်မှာ hover လုပ်ပြီး ![Undo icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-undo-stroke.svg#icon) **Restore** ကို နှိပ်ပါ။
* Collection တစ်ခုကို အပြီးတိုင် ဖျက်ဖို့ — အဲဒီပေါ်မှာ hover လုပ်ပြီး ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-delete-stroke.svg#icon) **Delete permanently** ကို နှိပ်ပါ။

![Team trash dashboard](https://assets.postman.com/postman-docs/v12/team-trash-v12-01.png)

Trash ထဲမှာ ရှိမယ်လို့ ထင်ထားတဲ့ collection တစ်ခု မတွေ့ရဘူးဆိုရင် — အဲဒါ ဖျက်လိုက်တာမဟုတ်ဘဲ တခြား workspace တစ်ခုဆီ ရွှေ့သွားတာ ဖြစ်နိုင်ပါတယ်။ [elements တွေကို workspaces ဆီ ရွှေ့ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#move-elements-to-workspaces) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Changelog ကို သုံးခြင်း

Postman မှာ collection တစ်ခုရဲ့ changelog ကို ပြန်ကြည့်ဖို့ — collection ကို ဖွင့်ပြီး collection overview ထဲက ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **Last updated** ကို နှိပ်ပါ။ ဒါမှမဟုတ် ညာဘက် sidebar ထဲက ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **Changelog** ကို နှိပ်ပါ။

Changelog က collection ရဲ့ လုပ်ဆောင်ချက်တွေကို အချိန်စဉ်အလိုက် စာရင်းပြပါတယ်။ အပြောင်းအလဲတွေ ဖြစ်ပွားခဲ့တဲ့ အချိန်နဲ့ ရက်စွဲ၊ အပြောင်းအလဲ လုပ်ခဲ့တဲ့ users တွေ၊ ပြောင်းလဲခဲ့တဲ့ collection ရဲ့ အစိတ်အပိုင်းတွေကို ကြည့်နိုင်ပါတယ်။

![Collection changelog](https://assets.postman.com/postman-docs/v12/changelog-view-v12-02.png)

တစ်ခုနဲ့တစ်ခု မိနစ်အနည်းငယ်အတွင်း လုပ်ခဲ့တဲ့ အပြောင်းအလဲတွေကို ဖတ်ရလွယ်အောင် sessions အဖြစ် အုပ်စုဖွဲ့ပြထားပါတယ်။ Changelog ထဲမှာ session တစ်ခုကို ရွေးပြီး အဲဒီထဲက အပြောင်းအလဲတွေကို ပြန်သုံးသပ်နိုင်ပါတယ်။

**View diff** ကို နှိပ်ပြီး collection ရဲ့ diff ကို ကြည့်နိုင်ပါတယ်။ Diff က changelog ထဲမှာ ကြည့်ဖို့ ကြီးလွန်းရင် — diff ပေါ်မှာ hover လုပ်ပြီး **View more** ကို နှိပ်ပြီး tab အသစ်တစ်ခုမှာ ဖွင့်နိုင်ပါတယ်။

### Changelog ထဲက diffs တွေကို ဝှက်ခြင်း

Collection တစ်ခုအတွက် [Editor role](https://learning.postman.com/docs/administration/roles-and-permissions/#collection-roles) ရှိရင် — သူ့ရဲ့ [changelog](#changelog-ကို-သုံးခြင်း) ထဲမှာ သီးခြား actions တွေကို ဝှက်နိုင်ပါတယ်။ Changelog entry တစ်ခုရဲ့ diff ကို ဝှက်လိုက်ရင် — collection ပေါ်မှာ Editor permissions မရှိတဲ့ users တွေက အဲဒီ diff ကို changelog ထဲမှာ ကြည့်လို့ မရတော့ပါဘူး။ ဒါက public collection တစ်ခုထဲမှာ sensitive data တွေကို ကာကွယ်နိုင်စေပါတယ်။

* Diff တစ်ခုကို ဝှက်ဖို့ — changelog entry အတွက် ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) ကို နှိပ်ပြီး **Hide diff for this change** ကို နှိပ်ပါ။

* Diff တစ်ခုရဲ့ မြင်နိုင်မှုကို ပြန်ထားဖို့ — changelog entry အတွက် ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) ကို နှိပ်ပြီး **Show diff to all users** ကို နှိပ်ပါ။ Diff ရဲ့ မြင်နိုင်မှုကို ပြန်ထားလိုက်တာနဲ့ — users အားလုံး အဲဒါကို changelog ထဲမှာ ကြည့်လို့ရပါပြီ။

## Collection တစ်ခုကို ပြန်ယူခြင်း ဒါမှမဟုတ် အပြီးတိုင် ဖျက်ခြင်း

Admin ဒါမှမဟုတ် Editor permissions ရှိခဲ့တဲ့ ကိုယ်ရော team ဝင်တခြားသူတွေပါ ဖျက်လိုက်တဲ့ HTTP collections တွေကို ပြန်ယူနိုင်သလို အပြီးတိုင်လည်း ဖျက်နိုင်ပါတယ်။ ဖျက်လိုက်တဲ့ collection ပေါ်မှာ လုပ်ဆောင်နိုင်တဲ့ actions တွေက collection ကို ဖျက်ခဲ့တုန်းက ကိုယ်ကို သတ်မှတ်ပေးထားတဲ့ roles တွေအပေါ် မူတည်ပါတယ်။ ဖျက်လိုက်တဲ့ collections တွေကို ကိုယ့်ရဲ့ [Postman plan](https://www.postman.com/pricing/) ပေါ်မူတည်ပြီး အချိန်အတိုင်းအတာ တစ်ခုအထိ သိမ်းထားပေးပါတယ်။

ကိုယ်ဖျက်လိုက်တဲ့ workspaces တွေထဲမှာ ရှိခဲ့တဲ့ collections တွေကိုလည်း ပြန်ယူနိုင်သလို အပြီးတိုင်လည်း ဖျက်နိုင်ပါတယ်။ Team ဝင်တစ်ယောက်က workspace တစ်ခုကို ဖျက်လိုက်ရင် — ကိုယ့်မှာ Admin ဒါမှမဟုတ် Editor permissions ရှိခဲ့ရင်တောင် အဲဒီ workspace ထဲက ဖျက်လိုက်တဲ့ collections တွေကို ကြည့်လို့ ဒါမှမဟုတ် ဘာ action မှ လုပ်လို့ မရတော့ပါဘူး။

Paid plans ပေါ်က users တွေက collections တွေ team ကနေ အပြီးတိုင် ဖျက်တော့မယ့်အချိန် အသိပေးတဲ့ emails တွေ ရရှိပါတယ်။ Collection တစ်ခု အပြီးတိုင် ဖျက်လိုက်တာနဲ့ — ဘယ်တော့မှ ပြန်ယူလို့ မရတော့ပါဘူး။ အဲဒီ email ထဲမှာ ကိုယ် ဖန်တီးခဲ့တဲ့ ဒါမှမဟုတ် ဖျက်ခဲ့တဲ့ collections တွေ ပါဝင်ပါတယ်။

30 MB ထက် ကြီးတဲ့ ဖျက်လိုက်တဲ့ collections တွေကိုတော့ ပြန်ယူလို့ မရနိုင်ပါဘူး။

### ဖျက်ထားတဲ့ collection တစ်ခုကို ပြန်ယူခြင်း

ဖျက်ထားတဲ့ collection တစ်ခုကို ပြန်ယူဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Postman footer ထဲမှာ **Tools > ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-delete-stroke.svg#icon) Trash** ကို နှိပ်ပါ။
2. Collection တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Undo icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-undo-stroke.svg#icon) **Restore** ကို နှိပ်ပါ။ ဒါမှမဟုတ် collection ကို နှိပ်ပြီး **Restore** ကို ရွေးပါ။
3. Collection ကို ပြန်ယူချင်တဲ့ workspace ကို ရွေးပါ။
4. **Restore Collection** ကို နှိပ်ပါ။

### Collection တစ်ခုကို အပြီးတိုင် ဖျက်ခြင်း

Collection တစ်ခုကို အပြီးတိုင် ဖျက်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ:

1. Postman footer ထဲမှာ **Tools > ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-delete-stroke.svg#icon) Trash** ကို နှိပ်ပါ။
2. Collection တစ်ခုပေါ်မှာ hover လုပ်ပြီး ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-delete-stroke.svg#icon) **Delete permanently** ကို နှိပ်ပါ။ ဒါမှမဟုတ် collection ကို နှိပ်ပြီး **Delete** ကို ရွေးပါ။
3. အတည်ပြုဖို့ **Delete** ကို နှိပ်ပါ။

## Collection အပြောင်းအလဲတွေကို ပြန်ပြောင်းခြင်း

Postman က collection တစ်ခုကို ပြုလုပ်ခဲ့တဲ့ အပြောင်းအလဲတွေရဲ့ changelog ကို သိမ်းထားပါတယ်။ လိုအပ်ရင် collection ကို အရင် state တစ်ခုဆီ ပြန်ပြောင်းနိုင်ပါတယ်။

1. Collection overview ထဲက ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **Last updated** ကို နှိပ်ပါ။ ဒါမှမဟုတ် ညာဘက် sidebar ထဲက ![History icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-history-stroke.svg#icon) **Changelog** ကို နှိပ်ပါ။
2. Changelog entry တစ်ခုကို နှိပ်ပြီး ချဲ့ပါ။
3. အပြောင်းအလဲတစ်ခုဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) ကို နှိပ်ပြီး **Restore to this change** ကို နှိပ်ပါ။

Collection က ရွေးလိုက်တဲ့ အပြောင်းအလဲ ပြီးတဲ့နောက် ရှိခဲ့တဲ့ state ဆီ ပြန်ရောက်သွားပါတယ်။

ဖျက်လိုက်တဲ့ collection တစ်ခုကို ပြန်ယူဖို့ — [Collection တစ်ခုကို ပြန်ယူခြင်း ဒါမှမဟုတ် အပြီးတိုင် ဖျက်ခြင်း](#collection-တစ်ခုကို-ပြန်ယူခြင်း-ဒါမှမဟုတ်-အပြီးတိုင်-ဖျက်ခြင်း) ကို ကြည့်ပါ။
