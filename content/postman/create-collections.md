---
title: "API Request Collections များ ဖန်တီးခြင်း"
description: "Postman Collection ဆိုတာ ဘာလဲ — collection အသစ်တွေ ဖန်တီးနည်း၊ template ကနေ စတင်နည်း၊ collection ကို configure လုပ်နည်း (name, description, authorization, scripts, variables)"
order: 5
source: "https://learning.postman.com/docs/use/use-collections/create-collections"
status: translated
updated: 2026-09-01
---

Postman Collection တစ်ခုကို ဖန်တီးပြီး — ကိုယ်ကြိုက်တဲ့ requests တွေကို သိမ်း၊ share လုပ်နိုင်သလို — API တစ်ခုကို test လုပ်ဖို့ သုံးတဲ့ requests တွေကို အုပ်စုဖွဲ့နိုင်ပြီး၊ ကိုယ့် API ကို document လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်။ Collection အသစ်တစ်ခုကို အစကနေ စတင်ဖန်တီးနိုင်သလို template တစ်ခုကနေလည်း အရှိန်ယူ စတင်နိုင်ပါတယ်။

ဖန်တီးပြီးတာနဲ့ — collection ကို နာမည်နဲ့ ဖော်ပြချက် ထည့်ပြီး customize လုပ်နိုင်ပါတယ်။ Authorization details တွေ သတ်မှတ်တာ၊ scripts နဲ့ variables တွေ ထည့်တာတွေလည်း လုပ်နိုင်ပါတယ်။

## Collection အသစ်တစ်ခု ဖန်တီးခြင်း

Collection တစ်ခု ဖန်တီးဖို့ — [Postman account ထဲကို sign in ဝင်ထားရပါမယ်](https://learning.postman.com/docs/getting-started/installation/account/sign-up-for-postman/)။

Collection အသစ်တစ်ခုကို အောက်ပါနည်းတွေနဲ့ ဖန်တီးနိုင်ပါတယ်:

* Sidebar မှာ **Add** icon ကို နှိပ်ပြီး **Collection** ကို ရွေးပါ။
* Workspace အသစ်တစ်ခုမှာ sidebar ထဲက **Collections** ကို ချဲ့ပြီး **Create** ကို နှိပ်ပါ။

ဒီနည်းတွေနဲ့ ဖန်တီးတဲ့ collection က HTTP requests တွေပဲ ထည့်လို့ရတဲ့ collection တစ်ခု ဖြစ်ပါတယ်။ Non-HTTP requests တွေပါ ထည့်လို့ရတဲ့ collection တစ်ခု ဖန်တီးချင်ရင် — non-HTTP request တစ်ခုကို collection အသစ်တစ်ခုထဲမှာ save လုပ်ပါ။

Collection အသစ် ဖန်တီးပြီးတာနဲ့ — [API requests တွေ ထည့်နိုင်သလို](https://learning.postman.com/docs/use/use-collections/add-requests-to-collections/),  collection ကို [နာမည်ပေးပြီး configure](#collection-တစ်ခုကို-configure-လုပ်ခြင်း) လည်း လုပ်နိုင်ပါတယ်။

![Create new collection](https://assets.postman.com/postman-docs/v12/new-collection-v12-01.png)

## Template ကနေ collection တစ်ခု ဖန်တီးခြင်း

Collection ကို ဘယ်ကစရမလဲ မသေချာဘူးလား။ Collection အသစ်တစ်ခုကို အစကနေ မဖန်တီးဘဲ — predefined content ပါတဲ့ Postman template တစ်ခုကို သုံးနိုင်ပါတယ်။ Postman မှာ integration testing, API documentation, flows, agents စတာတွေအတွက် ဒီဇိုင်းလုပ်ထားတဲ့ templates တွေ ရှိပါတယ်။ Role ဒါမှမဟုတ် use case အလိုက် templates တွေကို ကြည့်နိုင်သလို — ကိုယ့်လိုအပ်ချက်နဲ့ ကိုက်ညီတဲ့ template တစ်ခုကို ရှာလို့လည်း ရပါတယ်။ အသေးစိတ်အတွက် — [Postman ရဲ့ collection templates](https://www.postman.com/templates/collections/) မှာ ကြည့်နိုင်ပါတယ်။

## Collection တစ်ခုကို configure လုပ်ခြင်း

Collection အသစ်ကို customize လုပ်ပြီး configure လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

* Collection ကို နာမည်ပြောင်းဖို့ — workbench ထဲက collection နာမည်ကို နှိပ်ပါ။ Sidebar ထဲက collection တစ်ခုကို ရွေးပြီး **Enter** ဒါမှမဟုတ် **Return** key နှိပ်ပြီးလည်း နာမည်ပြောင်းလို့ရပါတယ်။
* Collection အတွက် [description](https://learning.postman.com/docs/publishing-your-api/authoring-your-documentation/) တစ်ခုကို **Overview** tab ထဲမှာ ထည့်နိုင်ပါတယ်။ အဲဒီ description က collection ရဲ့ documentation ထဲမှာလည်း ပေါ်ပါတယ်။
* Collection ထဲက requests အားလုံးအတွက် [authorization details](https://learning.postman.com/docs/use/send-requests/authorization/specifying-authorization-details/) တွေ configure လုပ်ဖို့ **Authorization** ကို နှိပ်ပါ။
* Collection အတွက် [pre-request script](https://learning.postman.com/docs/tests-and-scripts/write-scripts/pre-request-scripts/) တစ်ခု ထည့်ဖို့ **Scripts > Pre-request** ကို ရွေးပါ။ အဲဒီ script က collection ထဲက request တစ်ခုစီ မပို့ခင် run ပါတယ်။
* Collection အတွက် [post-response script](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/) တစ်ခု ထည့်ဖို့ **Scripts > Post-response** ကို ရွေးပါ။ အဲဒီ script က collection ထဲက request တစ်ခုစီ ပို့ပြီးတိုင်း run ပါတယ်။
* [Collection variables](https://learning.postman.com/docs/use/send-requests/variables/variables/) တွေ သတ်မှတ်ဖို့ **Variables** ကို နှိပ်ပါ။ Collection variables တွေက collection တစ်ခုထဲက requests နဲ့ documentation အားလုံးမှာ ပြန်သုံးလို့ရတဲ့ တန်ဖိုးတွေပါ။

Requests တွေကို ပြောင်းလဲတာတွေကို အလိုအလျောက် သိမ်းဖို့ autosave ကို ဖွင့်ထားနိုင်ပါတယ်။ [Autosave](https://learning.postman.com/docs/getting-started/installation/settings/general-settings#application) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

![Edit collection details](https://assets.postman.com/postman-docs/v12/collection-details-v12-01.png)
