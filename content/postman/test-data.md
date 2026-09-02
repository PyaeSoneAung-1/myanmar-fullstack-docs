---
title: "Shared Requests များနဲ့ Cloud Runs များအတွက် Files များ Upload လုပ်ခြင်း (Upload Files for Shared Requests and Cloud Runs)"
description: "Postman မှာ test data ဆိုတာ ဘာလဲ — CSV/JSON test data files တွေကို team ထဲ upload လုပ်နည်း၊ shared requests, monitors နဲ့ scheduled collection runs တွေမှာ သုံးနိုင်ပုံ၊ file တွေကို စီမံခြင်း"
order: 22
source: "https://learning.postman.com/docs/use/send-requests/create-requests/test-data/"
status: translated
updated: 2026-09-02
---

*Test data* တွေဆိုတာ — ကိုယ့် API အတွက် အခြေအနေ (scenario) အမျိုးမျိုးကို test လုပ်ဖို့ သုံးတဲ့ data files တွေ ဖြစ်ပါတယ်။ Postman က test data storage တစ်ခု ပေးထားတာကြောင့် — data files တွေကို ကိုယ့် Postman team ထဲကို upload လုပ်နိုင်ပါတယ်။ ပြီးရင် — team ထဲက ဘယ်သူမဆို API requests တွေ ပို့တဲ့အခါ အဲဒီ files တွေကို သုံးနိုင်ပါတယ်။

Data sources အများအပြားကို သုံးပြီး data တွေကို စီမံခန့်ခွဲဖို့နဲ့ query လုပ်ဖို့ [datasets တွေကိုလည်း သုံးနိုင်ပါတယ်](https://learning.postman.com/docs/tests-and-scripts/datasets/overview)။ ဒါက workflows တွေအနှံ့မှာ data တစ်ခုတည်းကို ပြန်သုံးနိုင်၊ ပိုပြီး လိုက်လျောညီထွေပြီး လက်တွေ့ကျတဲ့ tests တွေ run နိုင်၊ ပြီးတော့ — တန်ဖိုးတွေကို duplicate လုပ်ခြင်း ဒါမှမဟုတ် hardcode လုပ်ခြင်း မရှိဘဲ — data တွေကို ဘယ်လို ပြန်ယူမလဲ ထိန်းချုပ်နိုင်စေပါတယ်။

## Test data storage အကြောင်း

Test data ပါတဲ့ file တစ်ခုကို [form data](/docs/postman/parameters) ဒါမှမဟုတ် [binary data](/docs/postman/parameters) အနေနဲ့ request တစ်ခုမှာ တွဲထည့်နိုင်ပါတယ်။ Postman က file ရဲ့ path ကို — ကိုယ့် local [working directory](https://learning.postman.com/docs/getting-started/installation/settings/working-directory/) နဲ့ ဆက်စပ်တဲ့ (relative) ပုံစံနဲ့ သိမ်းထားပြီး — request ပို့တဲ့အခါ အဲဒီ file ကို သုံးပါတယ်။ ဒါပေမယ့် — request ကို [workspace](/docs/postman/creating-workspaces) တစ်ခုထဲမှာ share လုပ်လိုက်ရင် — local file က share မဖြစ်ပါဘူး။ ဒါကြောင့် — team ဝင်တခြားသူတွေက file ရဲ့ copy တစ်ခုကို သူတို့ရဲ့ ကိုယ်ပိုင် local working directory ထဲမှာ ထားပေးမှသာ request ကို ပို့နိုင်မှာ ဖြစ်ပါတယ်။ ဒါ့အပြင် — Postman cloud ပေါ်မှာ run လုပ်တဲ့ (local မှာ run လုပ်တာမဟုတ်တဲ့) [monitor](/docs/postman/intro-monitors) ဒါမှမဟုတ် [scheduled collection run](https://learning.postman.com/docs/tests-and-scripts/running-collections/scheduling-collection-runs/) တစ်ခုကနေ request ပို့တဲ့အခါ local file က ရနိုင်မှာ မဟုတ်ပါဘူး။

Test data files တွေ သုံးတဲ့ requests တွေကို share လုပ်နိုင်အောင် — files တွေကို ကိုယ့် Postman team ထဲကို upload လုပ်နိုင်ပါတယ်။ Upload လုပ်ထားတဲ့ files တွေက team ဝင်အားလုံး ရနိုင်ပြီး — workspace တစ်ခုထဲမှာ share လုပ်ထားတဲ့ requests တွေ ပို့တဲ့အခါ သုံးနိုင်ပါတယ်။ Upload လုပ်ထားတဲ့ files တွေက monitors နဲ့ scheduled collection runs တွေကနေ ပို့တဲ့ requests တွေမှာလည်း ရနိုင်ပြီး — [Postman Flows](https://learning.postman.com/flows/overview/) နဲ့ [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) တွေမှာလည်း သုံးနိုင်ပါတယ် (ဒါပေမယ့် [Newman](https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/) မှာတော့ မဟုတ်ပါဘူး)။

## File တစ်ခုကို Postman team ထဲ Upload လုပ်ခြင်း

Collection တစ်ခုထဲက request တစ်ခုအတွက် file upload လုပ်ဖို့ [Editor access](https://learning.postman.com/docs/administration/roles-and-permissions/#collection-roles) ရှိရပါမယ်။ Files တွေကို scripts တွေကနေ upload လုပ်လို့ မရပါဘူး။

Postman team ထဲကို file တစ်ခု upload လုပ်ဖို့:

1. Request တစ်ခုကို ဖွင့်ပြီး **Body** tab ကို နှိပ်ပါ။

2. Request နဲ့အတူ ပို့ချင်တဲ့ data ရဲ့ အမျိုးအစားပေါ် မူတည်ပြီး — **form-data** ဒါမှမဟုတ် **binary** ကို ရွေးပါ။

3. Form data တွဲထည့်နေတယ်ဆိုရင် — key name ဘေးက dropdown list ထဲမှာ **File** ကို နှိပ်ပါ။

4. Request အတွက် သုံးချင်တဲ့ test data file ကို ရွေးပါ:

   * Local file တစ်ခု သုံးဖို့ — **New file from local machine** ကို နှိပ်ပြီး file တစ်ခု ရွေးကာ **Open** ကို နှိပ်ပါ။ ထောက်ပံ့ပေးတဲ့ file types တွေက CSV, JSON နဲ့ binary တွေ ဖြစ်ပါတယ်။
   * အရင်က upload လုပ်ထားတဲ့ file တစ်ခု သုံးဖို့ — list ထဲကနေ file ကို ရွေးပါ။ Team ဝင်တစ်ယောက်ယောက် upload လုပ်ထားတဲ့ file မဆို သုံးနိုင်ပါတယ်။ File တစ်ခုကို ရှာဖို့ — file ရဲ့ နာမည်ကို စရိုက်ကြည့်ပါ။

5. File တစ်ခု upload လုပ်ဖို့ — file ဘေးက **Upload files to team** ကို နှိပ်ပြီး **Upload** ကို နှိပ်ပါ။ Upload လုပ်ထားတဲ့ files တွေက size 5 MB ထက် မကျော်ရပါဘူး။

File upload လုပ်ပြီးတာနဲ့ — team ဝင်တခြားသူတွေက file ရဲ့ copy တစ်ခုကို သူတို့ရဲ့ local working directory ထဲမှာ ထားစရာ မလိုဘဲ — request ကို ပို့နိုင်ပါတယ်။ အဲဒီအစား — request က upload လုပ်ထားတဲ့ file ကို သုံးပါတယ်။ ဒါ့အပြင် — monitor ဒါမှမဟုတ် scheduled collection run တစ်ခုကနေ request ပို့ရင်လည်း upload လုပ်ထားတဲ့ file ကို သုံးပါတယ်။

Upload လုပ်ထားတဲ့ files တွေကို — ကိုယ် ဒါမှမဟုတ် team ဝင်တခြားသူတွေ ဖန်တီးတဲ့ requests တွေမှာ သုံးနိုင်ပါတယ် (public workspaces တွေမှာတော့ မဟုတ်ပါဘူး)။ Runs တွေကို automate လုပ်တဲ့အခါ Postman Flows နဲ့ Postman CLI တွေကလည်း upload လုပ်ထားတဲ့ files တွေကို ဝင်ရောက်နိုင်ပါတယ်။ Test data files တွေ သုံးတဲ့ collection တစ်ခုကို fork လုပ်ရင် — team ထဲကို upload မလုပ်ရသေးတဲ့ files တွေကို upload လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

ကိုယ့် [Postman plan](https://www.postman.com/pricing/) က upload လုပ်ထားတဲ့ test data files တွေအတွက် — သုံးလို့ရတဲ့ storage space ပမာဏ ကန့်သတ်ချက် တစ်ခုကို ပေးပါတယ်။ Upload လုပ်ထားတဲ့ files တွေကို ပြန်ယူ (retrieve) လို့ရတဲ့ အကြိမ်အရေအတွက်ကိုလည်း ကန့်သတ်ပေးပါတယ်။ [Test data usage](https://learning.postman.com/docs/billing/resource-usage/#test-data-usage) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Upload လုပ်ထားတဲ့ Files တွေကို စီမံခြင်း

Postman team ထဲကို upload လုပ်ထားတဲ့ files တွေကို — team ရဲ့ **Resource usage** dashboard ထဲမှာ စီမံပါတယ်။ အသေးစိတ်အတွက် — [Test data usage](https://learning.postman.com/docs/billing/resource-usage#test-data-usage) ကို ကြည့်ပါ။

Test data usage အသေးစိတ်ကို ကြည့်ဖို့ ဒါမှမဟုတ် test data files တွေ ဖျက်ဖို့ — [Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) တစ်ယောက် ဖြစ်ရပါမယ်။
