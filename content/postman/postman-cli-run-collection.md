---
title: "Postman CLI သုံးပြီး collection တစ်ခုကို run လုပ်ခြင်း"
description: "Postman CLI နဲ့ collections တွေကို ကိုယ်တိုင် ဒါမှမဟုတ် CI/CD pipeline ထဲမှာ run လုပ်နည်း — collection ID/file path သုံးခြင်း, ကိုယ်ပိုင် request order သတ်မှတ်ခြင်း, test data files နဲ့ packages သုံးခြင်း"
order: 159
source: "https://learning.postman.com/docs/postman-cli/postman-cli-run-collection/"
status: translated
updated: 2026-09-03
---

ကိုယ့် API ရဲ့ လုပ်ဆောင်ချက်တွေကို စမ်းသပ်ဖို့ [Postman CLI](/docs/postman/postman-cli-overview) ကို သုံးပြီး collections တွေကို ကိုယ်တိုင် run လုပ်နိုင်သလို — CI/CD pipelines တွေထဲမှာလည်း collection runs တွေကို automate လုပ်နိုင်ပါတယ်။

Postman CLI က collection တစ်ခုကို run လုပ်တဲ့အခါ — collection နဲ့ ၎င်းရဲ့ tests တွေက local မှာ run ဖြစ်ပြီး — ရလဒ်တွေကို Postman cloud ဆီ ပို့နိုင်ပါတယ်။

* Postman CLI က HTTP requests ပါတဲ့ collections တွေကို run လုပ်တာကို ထောက်ပံ့ပေးပါတယ်။ Paid plan တစ်ခုနဲ့ဆိုရင် — gRPC နဲ့ GraphQL requests ပါတဲ့ collections တွေကိုလည်း run လို့ရပါတယ်။ တခြား protocols တွေနဲ့တော့ collections တွေကို run လို့မရပါဘူး။
* Postman CLI က OAuth 2.0 authentication ကို ထောက်ပံ့မပေးပါဘူး။ Postman CLI နဲ့ OAuth 2.0 token တစ်ခု ဘယ်လို သုံးရမလဲ သိချင်ရင် — [OAuth 2.0 overview](/docs/postman/oauth-20) ကို ကြည့်ပါ။

## Postman CLI နဲ့ collection တစ်ခုကို local မှာ run လုပ်ခြင်း

Postman CLI နဲ့ဆိုရင် — [collection](/docs/postman/create-collections) တစ်ခု ဒါမှမဟုတ် [folder](/docs/postman/manage-collections) တစ်ခုထဲက requests တွေကို run လုပ်ဖို့ [`postman collection run` command](https://learning.postman.com/docs/postman-cli/postman-cli-collections/#postman-collection-run) ကို သုံးနိုင်ပါတယ်။

`postman collection run` ကို local မှာ run တဲ့အခါ — collection ကို ၎င်းရဲ့ file path နဲ့ သတ်မှတ်ပြီး run results တွေကို ကိုယ့် terminal ထဲမှာ ပြသနိုင်ပါတယ်။ ဒါပေမဲ့ run results တွေကို Postman cloud ဆီ ပို့ချင်ရင်တော့ — [`postman login` command](https://learning.postman.com/docs/postman-cli/postman-cli-auth/#postman-login) နဲ့ Postman ထဲကို sign in လုပ်ပြီး collection ကို ၎င်းရဲ့ ID နဲ့ သတ်မှတ်ပေးရပါမယ်။

Collection တစ်ခုကို local မှာ run လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. [Postman CLI ကို download လုပ်ပြီး install လုပ်ပါ](/docs/postman/postman-cli-installation)။

2. Sidebar ထဲက **Items** tab ကို နှိပ်ပြီး **Collections** ကို နှိပ်ကာ — run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။

3. **Run** ကို နှိပ်ပါ။

4. **Functional** tab ပေါ်မှာ **Automate runs via CLI** ကို နှိပ်ပါ။

5. (ထည့်စရာမလို) Cloud View ထဲမှာ ရှိနေပြီး ရလဒ်တွေကို Postman cloud ဆီ ပို့ချင်ရင် — **Add API Key** ကို နှိပ်ပါ။ အောက်ပါတစ်ခုခုကို လုပ်ပါ:

   * API key အသစ်တစ်ခု ဖန်တီးဖို့ **Generate Key** ကို နှိပ်ပါ။ API key အတွက် နာမည်တစ်ခု ရိုက်ထည့်ပြီး **Generate** ကို နှိပ်ပါ။ Key ကို ကူးယူဖို့ **Copy** ကို နှိပ်ပြီး လုံခြုံတဲ့ နေရာတစ်ခုမှာ သိမ်းထားပါ။ ပြီးရင် **Insert Key** ကို နှိပ်ပါ။
   * **Use Existing Key** ကို နှိပ်ပြီး ခိုင်လုံတဲ့ API key တစ်ခု ရိုက်ထည့်ကာ — **Insert Key** ကို နှိပ်ပါ။

   Local View မှာတော့ API key မလိုအပ်ပါဘူး — ဘာလို့လဲဆိုတော့ command က ကိုယ့် local Git repository ထဲက collection ရဲ့ path ကို သုံးလို့ပါ။ Local View မှာ run results တွေကို Postman cloud ဆီ မပို့ပါဘူး။

6. Commands တွေကို ကူးယူဖို့ **Copy** ကို နှိပ်ပါ။

7. Commands တွေကို ကိုယ့် terminal ထဲမှာ paste လုပ်ပြီး run လုပ်ပါ။ Commands တွေ run ပြီးနောက် — Postman CLI က run report တစ်ခုနဲ့ Postman ထဲက run results တွေဆီ သွားတဲ့ link တစ်ခုကို ထုတ်ပေးပါတယ်။

   Run report ထဲမှာ `test-scripts` ဆိုတာ [post-response scripts](/docs/postman/test-scripts) ကို ရည်ညွှန်းပါတယ်။

8. Link ကို လိုက်ပြီး [Postman ထဲမှာ results တွေကို ကြည့်ရှုပါ](/docs/postman/intro-to-collection-runs)။

## Collection တစ်ခုကို CI/CD ထဲမှာ run လုပ်ခြင်း

Collection က ကိုယ့်စိတ်တိုင်းကျ run ဖြစ်နေပြီဆိုရင် — [`postman collection run` command](https://learning.postman.com/docs/postman-cli/postman-cli-collections/#postman-collection-run) ကို ကိုယ့် CI/CD script ထဲ ကူးထည့်ပြီး ကိုယ့် workflows တွေထဲ ပေါင်းစပ်နိုင်ပါတယ်။ Command ကို CI/CD script ထဲ ထည့်တဲ့အခါ — API key ကို variable တစ်ခုနဲ့ အစားထိုးဖို့ အကြံပြုပါတယ်။

`postman collection run` command ကို ကိုယ့် CI/CD pipeline ထဲမှာ run တဲ့အခါ — collection ကို ၎င်းရဲ့ file path နဲ့ သတ်မှတ်နိုင်ပါတယ်။ ဒါပေမဲ့ run results တွေကို Postman cloud ဆီ ပို့ချင်ရင်တော့ — [`postman login` command](https://learning.postman.com/docs/postman-cli/postman-cli-auth/#postman-login) နဲ့ sign in လုပ်ပြီး collection ကို ၎င်းရဲ့ ID နဲ့ သတ်မှတ်ပေးရပါမယ်။

Collection တစ်ခုကို CI/CD ထဲမှာ run လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. **Items** tab ကို နှိပ်ပါ။

2. Sidebar ထဲက **Collections** ကို နှိပ်ပြီး run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။

3. **Run** ကို နှိပ်ပါ။

4. **Functional** tab ပေါ်မှာ **Automate runs via CLI** ကို နှိပ်ပါ။

5. **Run on CI/CD** အောက်မှာ **Configure command** ကို နှိပ်ပါ။

6. Pipeline builds တွေအတွင်း run ဖို့ **Collection** တစ်ခုကို နှိပ်ပါ။ သုံးချင်တဲ့ **Environment** တစ်ခုကိုလည်း ရွေးနိုင်ပြီး — collections အများကြီး ရွေးဖို့ **Add Another Collection** ကို နှိပ်နိုင်ပါတယ်။

7. ကိုယ့် CI/CD pipeline အတွက် **CI/CD Provider** နဲ့ **Operating system** ကို ရွေးပါ။

8. Postman CLI configuration ကို ကူးယူဖို့ — **Copy** ဒါမှမဟုတ် **Copy Postman CLI Command** ကို နှိပ်ပါ။

9. Postman CLI configuration ကို ကိုယ့် CI/CD script ထဲ ထည့်ပါ။ ဒီလုပ်ငန်းစဉ်က ကိုယ့် CI tool ပေါ်မှာ မူတည်ပါတယ်။

## Collection တစ်ခုကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း run လုပ်ခြင်း

ပုံမှန်အားဖြင့် — Collection Runner ကနေ collection တစ်ခုကို run ဖို့ command ထုတ်တဲ့အခါ collection အတွက် Collection ID တစ်ခုတည်းကိုပဲ သတ်မှတ်ပေးပါတယ်။ ဒါက အဲဒီ collection ထဲက folders နဲ့ requests တွေကို collection ထဲမှာ စာရင်းပြုထားတဲ့ အစဉ်အတိုင်း run စေပါတယ်။

Request order ပြောင်းချင်ရင် — Collection Runner ထဲမှာ request တစ်ခုကို ရွေးပြီး အစဉ်လိုက် နေရာအသစ်ဆီ ဆွဲချ (drag) လုပ်နိုင်ပါတယ်။ Run ထဲကနေ request တစ်ခုကို ဖယ်ချင်ရင်လည်း — ၎င်းရဲ့ နာမည်ဘေးက checkbox ကို ရှင်းလိုက်ရုံပါပဲ။

Folder နဲ့ request sequence ကို ပြောင်းလိုက်တဲ့အခါ — ထုတ်ပေးလိုက်တဲ့ command ကလည်း လိုက်ပြောင်းပါတယ်။ Collection ID အပြင် — command က folder နဲ့ request UIDs တွေကို `-i` option နဲ့ သတ်မှတ်ပေးတာကြောင့် — folders ဒါမှမဟုတ် requests တစ်ခုချင်းစီကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း run စေပါတယ်။

[Collection run တစ်ခုထဲက request order ကို customize လုပ်ခြင်း](/docs/postman/building-workflows) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Test data files တွေ သုံးတဲ့ collection တစ်ခုကို run လုပ်ခြင်း

Postman CLI က — ကိုယ့် local [working directory](https://learning.postman.com/docs/getting-started/installation/settings/working-directory/) ထဲက files တွေကို သုံးပြီး [body data](/docs/postman/parameters) ပို့တဲ့ requests တွေကို run လုပ်လို့မရပါဘူး။ ကိုယ့် collection ထဲမှာ files တွေ သုံးတဲ့ requests တွေ ရှိနေရင် — Postman CLI အတွက် ရနိုင်စေဖို့ [ကိုယ့် test data files တွေကို upload လုပ်ပါ](/docs/postman/test-data)။

## Packages တွေ သုံးတဲ့ collection တစ်ခုကို run လုပ်ခြင်း

ကိုယ့် team ရဲ့ Postman Package Library ကနေ packages တွေကို run လုပ်ဖို့ Postman CLI သုံးခြင်းက [Postman Solo, Team နဲ့ Enterprise plans](https://www.postman.com/pricing/) တွေမှာ ရပါတယ်။

ကိုယ့် team ရဲ့ [package library](/docs/postman/package-library) ကနေ packages တွေ import လုပ်တဲ့ scripts ပါတဲ့ collections တွေကို Postman CLI နဲ့ run လုပ်နိုင်ပါတယ်။ Package library ထဲကို [packages တွေ ထည့်နည်း](/docs/postman/package-library) နဲ့ ကိုယ့် scripts တွေထဲ [packages တွေ import လုပ်နည်း](/docs/postman/package-library) ကို လေ့လာနိုင်ပါတယ်။

npm ဒါမှမဟုတ် JSR package registries ကနေ [external packages တွေ import လုပ်တဲ့](/docs/postman/external-package-registries) collections တွေကိုလည်း Postman CLI နဲ့ run လုပ်နိုင်ပါတယ်။
