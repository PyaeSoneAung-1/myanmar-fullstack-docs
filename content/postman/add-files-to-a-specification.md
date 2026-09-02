---
title: "Multi-file API specification တစ်ခုကို စီမံခန့်ခွဲခြင်း (Manage a multi-file API specification)"
description: "Spec Hub ထဲမှာ multi-file API specification တွေ စီမံခန့်ခွဲခြင်း — supported formats, files နဲ့ folders ထည့်ခြင်း/rename/delete လုပ်ခြင်း, root file ပြောင်းလဲခြင်း"
order: 58
source: "https://learning.postman.com/docs/design-apis/specifications/add-files-to-a-specification/"
status: translated
updated: 2026-09-02
---

Spec Hub ထဲက *multi-file API specification* တစ်ခုနဲ့ဆိုရင် — ကိုယ့် specification က files နဲ့ folders အများအပြားကို ဖြန့်ကျက် လွှမ်းခြုံနိုင်တာကြောင့် — ပိုကောင်းအောင် စုစည်း, စီမံခန့်ခွဲနိုင်ပါတယ်။ ဥပမာ — operations, schemas, parameters စတဲ့ component တစ်ခုချင်းစီအတွက် ကိုယ့် API specification ကို files အများအပြားအဖြစ် ခွဲနိုင်ပါတယ်။ ဆက်စပ်နေတဲ့ files တွေကို အုပ်စုဖွဲ့ဖို့ folders တွေလည်း ဖန်တီးနိုင်ပါတယ်။

## ပံ့ပိုးပေးထားတဲ့ multi-file specification formats တွေ

Spec Hub မှာ Postman က အောက်ပါ multi-file specifications တွေကို ပံ့ပိုးပေးပါတယ်:

* OpenAPI 2.0, 3.0 နဲ့ 3.1
* protobuf 2 နဲ့ protobuf 3

## Multi-file specifications တွေ အကြောင်း

Multi-file specification တစ်ခုထဲက files အားလုံးကို API specification အပြည့်အစုံအဖြစ် သတ်မှတ်ပါတယ်။ Multi-file specification တစ်ခုချင်းစီမှာ — root object ကို define လုပ်ထားတဲ့ ကိုယ့် specification ရဲ့ အပေါ်ဆုံး level file ဖြစ်တဲ့ root file တစ်ခု ပါပါတယ်။ Root file က API က define လုပ်ထားတဲ့ operations တွေကို နေရာချပေးပြီး — ကိုယ့် specification ထဲက တခြား files တွေကို reference လုပ်နိုင်ပါတယ်။

ပုံမှန်အားဖြင့် — specification အသစ်တစ်ခု ဖန်တီးတဲ့အခါ Postman က root index file တစ်ခုပါတဲ့ single-file specification တစ်ခုကို generate လုပ်ပေးပါတယ်။

[Multi-file specification တစ်ခု ဖန်တီး](#multi-file-specification-တစ်ခု-ဖန်တီးခြင်း)တဲ့အခါ ဒါမှမဟုတ် [multi-file specification တစ်ခုကို import လုပ်](/docs/postman/import-a-specification)တဲ့အခါ — files တွေကြားက references တွေအပေါ် အခြေခံပြီး root file ကို Postman က သတ်မှတ်ပေးပါတယ်။ ကိုယ့် specification မှာ root file တစ်ခုပဲ ရှိနိုင်ပါတယ်။

ကိုယ့် multi-file specification ထဲက files အားလုံးကို OpenAPI file တစ်ခုတည်းအဖြစ် bundle လုပ်ဖို့ [Postman API](https://learning.postman.com/docs/reference/postman-api/intro-api/) ကို သုံးနိုင်ပါတယ်။ Response ထဲမှာ bundled specification ရဖို့ specification ID ကို ပေးပါ။ [Postman API နဲ့ multi-file specification တစ်ခုကို bundle လုပ်နည်း](https://learning.postman.com/docs/api-docs/api-reference/specs/get-spec-definition/) ကို လေ့လာပါ။

## Multi-file specification တစ်ခု ဖန်တီးခြင်း

OpenAPI ဒါမှမဟုတ် protobuf specification တစ်ခုထဲကို file တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ထည့်ပြီး — အဲဒါကို multi-file specification တစ်ခုအဖြစ် ပြောင်းလဲနိုင်ပါတယ်။ ပြီးရင် ကိုယ့် specification ထဲကို [files နဲ့ folders တွေ ထပ်ထည့်](#files-နဲ့-folders-တွေ-ထည့်ခြင်း)နိုင်ပါတယ်။

Multi-file specification တစ်ခု ဖန်တီးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက specification တစ်ခုကို ရွေးပါ။

   Specification မရှိဘူးဆိုရင် — sidebar ထဲက ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) ကို နှိပ်ပြီး **Spec** ကို ရွေးကာ ဖန်တီးချင်တဲ့ specification အမျိုးအစားကို ရွေးပါ။ [Specification တစ်ခုကို import လုပ်](/docs/postman/import-a-specification)တာလည်း လုပ်နိုင်ပါတယ်။

2. ကိုယ့် specification ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions > Add File** ကို ရွေးပါ။ ဒါက specification ထဲကို file အသစ်တစ်ခု ထည့်ပေးပါတယ်။ တနည်းအားဖြင့် — ကိုယ့် specification ရဲ့ **Files** section ထဲမှာ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add file or folder** ကို နှိပ်နိုင်ပါတယ်။

![Multi-file OpenAPI 3.0 specification](https://assets.postman.com/postman-docs/v12/multi-file-specification-v12-04.png)

## Files နဲ့ folders တွေ ထည့်ခြင်း

Multi-file OpenAPI ဒါမှမဟုတ် protobuf specification တစ်ခုကို ဖန်တီးပြီး ဒါမှမဟုတ် import လုပ်ပြီးတာနဲ့ — files နဲ့ folders တွေ ထပ်ထည့်နိုင်သလို — သူတို့ကို နာမည်နဲ့ ရှာဖွေလို့လည်း ရပါတယ်။ ကိုယ့် files နဲ့ folders တွေကို rename လုပ်ခြင်း, ဖျက်ခြင်းလည်း လုပ်နိုင်ပါတယ်။

ကိုယ့် specification ထဲကို files နဲ့ folders တွေ ထပ်ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Multi-file specification တစ်ခုကို ရွေးပါ။

2. Specification ရဲ့ **Files** section ထဲမှာ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add file or folder** ကို နှိပ်ပြီး အောက်ပါတစ်ခုကို ရွေးပါ:

   * **Add File** — File အသစ်တစ်ခု ထည့်ပေးပါတယ်။
   * **Add Folder** — Folder အသစ်တစ်ခု ထည့်ပေးပါတယ်။

3. Folder တစ်ခုဘေးမှာလည်း ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions** ကို နှိပ်ပြီး အောက်ပါတစ်ခုကို ရွေးနိုင်ပါတယ်:

   * **Add File** — Folder ထဲကို file အသစ်တစ်ခု ထည့်ပေးပါတယ်။
   * **Add Folder** — Folder ထဲမှာ folder အသစ်တစ်ခု ထည့်ပေးပါတယ်။

အောက်ပါ action တွေကိုလည်း လုပ်နိုင်ပါတယ်:

* Files နဲ့ folders တွေကို rename လုပ်ဖို့ — ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions > Rename** ကို ရွေးပါ။ နာမည်ကို update လုပ်ပြီး **Return** ဒါမှမဟုတ် **Enter** ကို နှိပ်ပါ။
* Files နဲ့ folders တွေကို ဖျက်ဖို့ — ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions > Delete** ကို ရွေးပါ။ ပြီးရင် အတည်ပြုဖို့ **Delete** ကို နှိပ်ပါ။
* Files နဲ့ folders တွေကို နာမည်နဲ့ ရှာဖို့ — sidebar ထဲက search bar ကို သုံးပါ။

## Root file ပြောင်းလဲခြင်း

ကိုယ့် multi-file specification မှာ — ကိုယ့် specification ထဲက တခြား files တွေကို reference လုပ်ဖို့ သုံးတဲ့ [root file](#multi-file-specifications-တွေ-အကြောင်း) တစ်ခုပဲ ရှိနိုင်ပါတယ်။ ကိုယ့် OpenAPI ဒါမှမဟုတ် protobuf 2 နဲ့ protobuf 3 multi-file specification ထဲက root file ကို ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ်။

Multi-file specification တစ်ခုထဲက root file ကို ပြောင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက multi-file specification တစ်ခုကို နှိပ်ပါ။
2. File တစ်ခုဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions > Mark as Root file** ကို ရွေးပါ။

Root OpenAPI object နဲ့ ကိုယ့် specification ထဲက တခြား files တွေဆီက references တွေပါအောင် — root file အသစ်ကို update လုပ်ဖို့ သေချာပါစေ။ မဟုတ်ရင် Postman က ကိုယ့် specification ကို parse လုပ်လို့ မရနိုင်ပါဘူး။
