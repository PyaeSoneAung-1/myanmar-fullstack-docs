---
title: "Postman မှာ Variables များ သတ်မှတ်ခြင်း (Define Variables in Postman)"
description: "Postman မှာ variables သတ်မှတ်နည်းများ — scope မရှိတဲ့ variables စမ်းသုံးခြင်း၊ variables တွေကို scope ထဲ ထည့်ခြင်း၊ response body တန်ဖိုးများ၊ global/environment/collection variables နဲ့ scripts ထဲမှာ variables သတ်မှတ်ခြင်း"
order: 21
source: "https://learning.postman.com/docs/use/send-requests/variables/define-variables/"
status: translated
updated: 2026-09-02
---

Variable တန်ဖိုးတွေက default အနေနဲ့ local ဖြစ်ပြီး — ကိုယ့် Postman instance ထဲမှာပဲ ကိုယ့်အတွက်သာ ရနိုင်ပါတယ်။ ဒီတန်ဖိုးတွေကို Postman cloud ဆီ sync လုပ်ပေးမှာ မဟုတ်ပါဘူး။ Local value တစ်ခုကို သတ်မှတ်ပြီးတာနဲ့ — လိုအပ်ရင် [variable တန်ဖိုးတွေကို share လုပ်ပြီး](https://learning.postman.com/docs/use/send-requests/variables/share-variables/) — အဲဒီတန်ဖိုးကို Postman cloud ဆီ sync လုပ်နိုင်ပါတယ်။

သုံးတော့မယ်လို့ မရှိတော့တဲ့ variables တွေကို ဖျက်ပစ်ဖို့ မမေ့ပါနဲ့။

Request builder ထဲမှာ scope မရွေးဘဲ variable တစ်ခု သတ်မှတ်ချင်ရင်:

1. ဥပမာ — address, parameters, headers ဒါမှမဟုတ် body ထဲက လိုအပ်တဲ့ data ကို ရွေးပါ။
2. Selection ပေါ်မှာ right-click နှိပ်ပြီး **Set as variable** ကို နှိပ်ပါ။
3. **Set as new variable** ကို နှိပ်ပါ။
4. **Name** တစ်ခု ရိုက်ထည့်ပြီး — **Value** မှန်ကန်ကြောင်း သေချာအောင် စစ်ဆေးကာ — **Scope** တစ်ခုကို ရွေးပါ။ Postman ထဲက [variable scopes (နယ်ပယ်များ)](/docs/postman/variables) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
5. Variable ကို သိမ်းဖို့ **Set Variable** ကို နှိပ်ပါ။

Variables တွေကို အောက်ပါ နည်းတွေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်:

* [Scope မထည့်ဘဲ variable တစ်ခုကို local မှာ စမ်းသုံးကြည့်ပြီး](#scope-မရှိတဲ့-variables-တွေအတွက်-တန်ဖိုး-သတ်မှတ်ခြင်း) — နောက်မှ [variable ကို scope တစ်ခုထဲ ထည့်နိုင်ပါတယ်](#variables-တွေကို-scope-တစ်ခုထဲ-ထည့်ခြင်း)။
* [Response body ထဲက တန်ဖိုးတစ်ခုကို variable အဖြစ် သတ်မှတ်ခြင်း](#response-body-တန်ဖိုးတွေကို-variables-အဖြစ်-သတ်မှတ်ခြင်း)။
* Variable တစ်ခုကို [global](#global-variables-သတ်မှတ်ခြင်း), [environment](#environment-variables-သတ်မှတ်ခြင်း) ဒါမှမဟုတ် [collection](#collection-variables-သတ်မှတ်ခြင်း) scope မှာ သတ်မှတ်ခြင်း။
* [Scripts တွေသုံးပြီး variables တွေ သတ်မှတ်ခြင်း](#scripts-တွေထဲမှာ-variables-သတ်မှတ်ခြင်း)။
* [VS Code extension ကနေ variables တွေ သတ်မှတ်ခြင်း](https://learning.postman.com/docs/reference/vs-code-extension/send-requests/#store-variables)။

ကိုယ့် variables တွေမှာ လုပ်တဲ့ ပြောင်းလဲမှုတွေကို အလိုအလျောက် သိမ်းပေးပါတယ်။

## Scope မရှိတဲ့ variables တွေအတွက် တန်ဖိုး သတ်မှတ်ခြင်း

[variable scope](/docs/postman/variables) မရှိတဲ့ variables တွေက — [variable ကို scope တစ်ခုထဲ မထည့်ခင်](#variables-တွေကို-scope-တစ်ခုထဲ-ထည့်ခြင်း) တန်ဖိုးကို အရင် စမ်းကြည့်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ Default value (ပုံသေတန်ဖိုး) ထားစရာ မလိုတဲ့ data တွေကို request နဲ့အတူ ပို့ချင်တဲ့အခါမှာလည်း အသုံးဝင်ပါတယ်။ ဥပမာ — scope မရှိတဲ့ variable တစ်ခုက request ပို့တိုင်း ပြောင်းလဲနေတဲ့ user-specific (အသုံးပြုသူနဲ့ ဆိုင်သော) data တွေကို ပို့ပေးနိုင်ပါတယ်။ Scope မရှိတဲ့ variables တွေက — variable တစ်ခုကို ဘယ် scope တစ်ခုမှာမှ သတ်မှတ်စရာ မလိုဘဲ — ကိုယ့် API ကို သုံးသူတွေ (API consumers) အတွက် placeholder variable (နေရာခံ variable) တစ်ခုအနေနဲ့ ဖန်တီးပေးနိုင်အောင်လည်း လုပ်ပေးပါတယ်။

Request builder ထဲမှာ variable ကို variable scope တစ်ခုထဲ မထည့်ဘဲ ဖန်တီးနိုင်ပါတယ်။ ဒီ variable အတွက် သင်ထည့်တဲ့ တန်ဖိုးကို local မှာ သိမ်းထားပြီး — သတ်မှတ်ထားတဲ့ request ထဲမှာပဲ ရနိုင်ပါတယ်။ **Variables** ကို နှိပ်လိုက်ရင် — variable က **Variables in request** အောက်မှာ scope တစ်ခုနဲ့ မဆက်စပ်ဘဲ (အရောင်နဲ့ ခွဲခြားဖော်ပြထား) တွေ့ရမှာ ဖြစ်ပါတယ်။

Request builder ကနေ variable တစ်ခု ဖန်တီးဖို့ — request ထဲမှာ မရှိသေးတဲ့ ဒါမှမဟုတ် မရနိုင်တဲ့ variable တစ်ခုကို [double curly braces (`{{` နဲ့ `}}`) နဲ့ ကိုးကားပါ](https://learning.postman.com/docs/use/send-requests/variables/use-variables/)။ ဥပမာ — scope မရှိတဲ့ username variable တစ်ခု ဖန်တီးဖို့ `{{username}}` လို့ ရိုက်ထည့်နိုင်ပါတယ်။

Scope မရှိတဲ့ variable တစ်ခုရဲ့ တန်ဖိုး သတ်မှတ်ဖို့ — variable ပေါ်မှာ hover လုပ်ပြီး text box ကို နှိပ်ကာ တန်ဖိုးတစ်ခု ရိုက်ထည့်ပါ။ ဒါမှမဟုတ် [workbench](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#environment-selector-and-variables-pane) ထဲက **Variables** ကို နှိပ်ပြီး variables pane ကို ဖွင့်နိုင်ပါတယ်။ Variable ဘေးက **Enter value** ကို နှိပ်ပြီး တန်ဖိုးတစ်ခု ထည့်ပါ။

Scripts တွေထဲမှာတော့ scope မရှိတဲ့ variables တွေကို ရယူဖို့ `pm.variables.get(variableName)` ကို သုံးနိုင်ပါတယ်။ [Scripts တွေထဲမှာ variables တွေ သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-variables/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Scope မရှိတဲ့ variable တန်ဖိုးတွေကို — request ရဲ့ tab ကို မပိတ်ခင် ဒါမှမဟုတ် Postman ကနေ မထွက်ခင် အထိ — request ထဲမှာ local အနေနဲ့ သိမ်းထားပါတယ်။ Request ကို ပြန်ဖွင့်တဲ့အခါ variable ရဲ့ တန်ဖိုးက အလွတ် ဖြစ်နေပါလိမ့်မယ်။ တန်ဖိုးကို သိမ်းထားပြီး requests တွေထဲမှာ ပြန်သုံးချင်ရင် — [variable နဲ့ သူ့တန်ဖိုးကို scope တစ်ခုထဲ ထည့်နိုင်ပါတယ်](#variables-တွေကို-scope-တစ်ခုထဲ-ထည့်ခြင်း)။

## Variables တွေကို scope တစ်ခုထဲ ထည့်ခြင်း

Request ဒါမှမဟုတ် collection လိုမျိုး Postman element တစ်ခုကနေ — variable တစ်ခု ဖန်တီးပြီး ကိုယ့် requests တွေအနှံ့ ပြန်သုံးနိုင်ဖို့ — [variable scope](/docs/postman/variables) တစ်ခုထဲ ထည့်နိုင်ပါတယ်။ Team ထဲက [scope မရှိတဲ့ variable](#scope-မရှိတဲ့-variables-တွေအတွက်-တန်ဖိုး-သတ်မှတ်ခြင်း) တစ်ခုကိုလည်း variable scope တစ်ခုထဲ ထည့်နိုင်ပါတယ်။ Element ကနေ — variable အတွက် local မှာ သိမ်းထားမယ့် တန်ဖိုးတစ်ခုကိုလည်း ထည့်နိုင်ပါတယ်။

Environment ဒါမှမဟုတ် collection တစ်ခုထဲ variables တွေ ထည့်ဖို့ — အဲဒီ element ပေါ်မှာ Editor access ရှိဖို့ လိုအပ်ပါတယ်။

Element ထဲမှာ မရှိသေးတဲ့ ဒါမှမဟုတ် မရနိုင်တဲ့ variable တစ်ခုကို [double curly braces (`{{` နဲ့ `}}`) နဲ့ ကိုးကားပါ](https://learning.postman.com/docs/use/send-requests/variables/use-variables/)။ Variable ရဲ့ reference ပေါ်မှာ hover လုပ်ပြီး — တန်ဖိုး မထည့်ရသေးရင် text box ကို နှိပ်ကာ တန်ဖိုးတစ်ခု ထည့်ပါ။ **Add to** dropdown list ကနေ — variable ထည့်ချင်တဲ့ scope ကို ရွေးပါ။

**Authorization** tab ကနေလည်း ဘယ် scope မှာမဆို variables တွေ သတ်မှတ်နိုင်ပါတယ်။ **Auth Type** dropdown list ကို ရွေးပြီး authorization တစ်ခုကို ရွေးကာ — password ဒါမှမဟုတ် token လိုမျိုး sensitive data (ထိခိုက်နိုင်သော data) ပါတဲ့ field တစ်ခုထဲ တန်ဖိုး ထည့်ပါ။ **Sensitive value** ပေါ်မှာ hover လုပ်ပြီး — **Set as Variable** ကို နှိပ်ကာ variable အတွက် နာမည်တစ်ခု ထည့်ပြီး — ထည့်ချင်တဲ့ scope ကို ရွေးပါ။

Workbench ထဲက **Variables** ကိုလည်း နှိပ်ပြီး — ကိုယ့် request ထဲမှာ သုံးထားတဲ့ variables နဲ့ vault secrets တွေကို ကြည့်နိုင်ပါတယ်။ ပြီးရင် — scope မရှိတဲ့ variable အတွက် text box ထဲ တန်ဖိုး ထည့်ပြီး — **Add to** ကို နှိပ်ကာ ထည့်ချင်တဲ့ scope ကို ရွေးနိုင်ပါတယ်။

Sensitive data တွေကို ကိုယ့် Postman Vault ထဲမှာ vault secret အဖြစ်လည်း ထည့်နိုင်ပါတယ်။ Postman Vault ထဲမှာ vault secret အဖြစ် ထည့်ဖို့ — အရင် [ကိုယ့် Postman Vault ကို ဖွင့်ပါ](https://learning.postman.com/docs/use/postman-vault/postman-vault-key/)။

Variable ထည့်ချင်တဲ့ environment က environment selector ထဲမှာ active (ရွေးချယ်ထားသော) ဖြစ်နေရပါမယ်။ Environment active မဖြစ်ရင် — dropdown list ထဲက အောက်ပါ option တွေနဲ့ environment တစ်ခုထဲ variable ထည့်နိုင်ပါတယ်:

* **Select an existing environment** — **Select** ကို နှိပ်ပြီး environment တစ်ခုကို ရွေးကာ active ဖြစ်အောင် လုပ်ပါ။ Variable က ရွေးထားတဲ့ environment ထဲကို ထည့်ပေးပါတယ်။
* **Create a new environment** — **Create One** ကို နှိပ်ပြီး environment ရဲ့ နာမည် ထည့်ကာ — **Create** ကို ရွေးပါ။ Variable အသစ် ဖန်တီးပြီး environment အသစ်ထဲကို ထည့်ပေးပါတယ်။

[Variable တန်ဖိုးတစ်ခုကို လုံခြုံအောင် ပြုလုပ်နိုင်ပါတယ်](#variable-တန်ဖိုးကို-လုံခြုံအောင်-ပြုလုပ်ခြင်း) — Postman က အဲဒီတန်ဖိုးကို encrypt (စာဝှက်) လုပ်ပေးပါတယ်။

Scope မရှိတဲ့ variable ရဲ့ prefix က "vault:" ဖြစ်နေရင် (ဥပမာ — "vault:postman-api-key") — အဲဒီ variable ကို ကိုယ့် Postman Vault ထဲမှာ vault secret အဖြစ်ပဲ ထည့်လို့ရပါတယ်။

Collaborators တွေနဲ့ share လုပ်လို့ရတဲ့ local value တစ်ခုကို variable ထဲ ထည့်ချင်ရင် — variables တွေကို [global](#global-variables-သတ်မှတ်ခြင်း), [environment](#environment-variables-သတ်မှတ်ခြင်း) နဲ့ [collection](#collection-variables-သတ်မှတ်ခြင်း) scope တွေထဲမှာ တိုက်ရိုက် တည်းဖြတ်နည်းကို လေ့လာပါ။

## Response body တန်ဖိုးတွေကို variables အဖြစ် သတ်မှတ်ခြင်း

Request တစ်ခုရဲ့ response body ကနေ ဘယ် scope မှာမဆို variables တွေ သတ်မှတ်ဖို့:

1. (Optional) Environment variable တစ်ခုအတွက် တန်ဖိုး သတ်မှတ်နေရင် — workbench ရဲ့ ညာဘက်အပေါ်ထောင့်က dropdown list ကနေ [variable ရဲ့ environment ကို ရွေးပါ](/docs/postman/managing-environments)။
2. Response ထဲမှာ selection လုပ်ပြီး — right-click နှိပ်ကာ **Set as variable** ကို နှိပ်ပါ။
3. **Set as new variable** ကို နှိပ်ပါ။
4. **Name** တစ်ခု ရိုက်ထည့်ပြီး — **Value** မှန်ကန်ကြောင်း သေချာအောင် စစ်ဆေးကာ — **Scope** တစ်ခုကို ရွေးပါ။
5. Variable ကို သိမ်းဖို့ **Set Variable** ကို နှိပ်ပါ။

## Global variables သတ်မှတ်ခြင်း

Global variables တွေကို ကြည့်ဖို့ — footer ထဲက **Globals** ကို နှိပ်ပါ။

Global variable အသစ်တစ်ခု ထည့်ဖို့:

1. **Add variable** text box ကို နှိပ်ပြီး variable နာမည်တစ်ခု ရိုက်ထည့်ပါ။
2. (Optional) Variable နာမည်ဘေးက **Secure** ကို နှိပ်ပြီး — variable ကို secure variable (လုံခြုံသော variable) အဖြစ် ပြုလုပ်နိုင်ပါတယ်။ [Variable တန်ဖိုးတစ်ခုကို လုံခြုံအောင် ပြုလုပ်ခြင်း](#variable-တန်ဖိုးကို-လုံခြုံအောင်-ပြုလုပ်ခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
3. Variable ရဲ့ တန်ဖိုးကို ထည့်ပါ။
4. (Optional) Variable နာမည်ဘေးက **Add description** ကို နှိပ်ပြီး — variable ရဲ့ ဖော်ပြချက် (description) တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။ ဖော်ပြချက်ကို သီးခြား column တစ်ခုမှာ ပြချင်ရင် — **More** ကို နှိပ်ပြီး **Description** ကို ရွေးပါ။
5. (Optional) တန်ဖိုးဘေးက **Share** ကို နှိပ်ပြီး — teammates တွေနဲ့ share လုပ်ကာ monitors နဲ့ scheduled runs တွေမှာ သုံးနိုင်ပါတယ်။ Shared value (မျှဝေထားသော တန်ဖိုး) ကို သီးခြား column တစ်ခုမှာ ပြချင်ရင် — **More** ကို နှိပ်ပြီး **Shared Value** ကို ရွေးပါ။

Global variable တစ်ခုကို တည်းဖြတ်ဖို့ — လိုချင်တဲ့ variable နာမည်, တန်ဖိုး ဒါမှမဟုတ် ဖော်ပြချက်ကို ပြောင်းလိုက်ရုံပါပဲ။ Global variable တစ်ခုကို နာမည် ဒါမှမဟုတ် တန်ဖိုးနဲ့ ရှာဖို့ — **Search** ကို နှိပ်ပြီး ရှာစရာကို ရိုက်ထည့်ပါ။

Global variables တွေကို download လုပ်ဖို့ — workbench ရဲ့ ညာဘက်အပေါ်ထောင့်က **Export** ကို နှိပ်ပါ။

[Scripts တွေထဲမှာ global variables သတ်မှတ်ခြင်း](#scripts-တွေထဲမှာ-variables-သတ်မှတ်ခြင်း) နဲ့ Postman element တစ်ခုကနေ တိုက်ရိုက် [variables တွေကို ကြည့်ရှု တည်းဖြတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/view-variables/) အကြောင်းတွေလည်း လေ့လာနိုင်ပါတယ်။

## Environment variables သတ်မှတ်ခြင်း

Environment variables တွေကို ကြည့်ဖို့ — sidebar ထဲက **Environments** ကို နှိပ်ပြီး ကြည့်ချင်တဲ့ environment ကို ရွေးပါ။

Environment variable အသစ်တစ်ခု ထည့်ဖို့:

1. **Add variable** text box ကို နှိပ်ပြီး variable နာမည်တစ်ခု ရိုက်ထည့်ပါ။
2. (Optional) Variable နာမည်ဘေးက **Secure** ကို နှိပ်ပြီး — variable ကို secure variable အဖြစ် ပြုလုပ်နိုင်ပါတယ်။ [Variable တန်ဖိုးတစ်ခုကို လုံခြုံအောင် ပြုလုပ်ခြင်း](#variable-တန်ဖိုးကို-လုံခြုံအောင်-ပြုလုပ်ခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
3. Variable ရဲ့ တန်ဖိုးကို ထည့်ပါ။
4. (Optional) Variable နာမည်ဘေးက **Add description** ကို နှိပ်ပြီး — variable ရဲ့ ဖော်ပြချက် တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။ ဖော်ပြချက်ကို သီးခြား column တစ်ခုမှာ ပြချင်ရင် — **More** ကို နှိပ်ပြီး **Description** ကို ရွေးပါ။
5. (Optional) တန်ဖိုးဘေးက **Share** ကို နှိပ်ပြီး — teammates တွေနဲ့ share လုပ်ကာ monitors နဲ့ scheduled runs တွေမှာ သုံးနိုင်ပါတယ်။ Shared value ကို သီးခြား column တစ်ခုမှာ ပြချင်ရင် — **More** ကို နှိပ်ပြီး **Shared Value** ကို ရွေးပါ။

Environment variable တစ်ခုကို တည်းဖြတ်ဖို့ — လိုချင်တဲ့ variable နာမည်, တန်ဖိုး ဒါမှမဟုတ် ဖော်ပြချက်ကို ပြောင်းလိုက်ရုံပါပဲ။ Environment variable တစ်ခုကို နာမည် ဒါမှမဟုတ် တန်ဖိုးနဲ့ ရှာဖို့ — **Search** ကို နှိပ်ပြီး ရှာစရာကို ရိုက်ထည့်ပါ။

Environment variables တွေကို download လုပ်ဖို့ — environment တစ်ခုဘေးက **View more actions** ကို နှိပ်ပြီး **Export** ကို ရွေးပါ။

Environment တစ်ခုပေါ်မှာ Editor access ရှိရင် — variables တွေ ထည့်နိုင်ပြီး တည်းဖြတ်နိုင်ပါတယ်။ Viewer access ပဲ ရှိရင်တော့ — ရှိပြီးသား variables တွေရဲ့ local value ကို update လုပ်တာပဲ လုပ်နိုင်ပါတယ်။ ကိုယ် တည်းဖြတ်လိုက်တဲ့ variables တွေက ကိုယ့်အတွက်ပဲ ရနိုင်ပြီး — ကိုယ့် [workspace](/docs/postman/creating-workspaces) ထဲက collaborators တွေ မြင်နိုင်မှာ မဟုတ်ပါဘူး။ Team ထဲမှာ [environments တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/managing-environments) နဲ့ [scripts တွေထဲမှာ environment variables သတ်မှတ်ခြင်း](#scripts-တွေထဲမှာ-variables-သတ်မှတ်ခြင်း) အကြောင်း လေ့လာနိုင်ပါတယ်။

Postman element တစ်ခုကနေ တိုက်ရိုက် [variables တွေကို ကြည့်ရှု တည်းဖြတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/view-variables/) အကြောင်းကိုလည်း လေ့လာနိုင်ပါတယ်။

## Collection variables သတ်မှတ်ခြင်း

Collection variable အသစ်တစ်ခု ထည့်ဖို့:

1. Sidebar ထဲက **Collections** ကို နှိပ်ပြီး — collection တစ်ခုကို ရွေးကာ — **Variables** tab ကို ရွေးပါ။
2. **Add variable** text box ကို နှိပ်ပြီး variable နာမည်တစ်ခု ရိုက်ထည့်ပါ။
3. (Optional) Variable နာမည်ဘေးက **Secure** ကို နှိပ်ပြီး — variable ကို secure variable အဖြစ် ပြုလုပ်နိုင်ပါတယ်။ [Variable တန်ဖိုးတစ်ခုကို လုံခြုံအောင် ပြုလုပ်ခြင်း](#variable-တန်ဖိုးကို-လုံခြုံအောင်-ပြုလုပ်ခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
4. Variable ရဲ့ တန်ဖိုးကို ထည့်ပါ။
5. (Optional) Variable နာမည်ဘေးက **Add description** ကို နှိပ်ပြီး — variable ရဲ့ ဖော်ပြချက် တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။ ဖော်ပြချက်ကို သီးခြား column တစ်ခုမှာ ပြချင်ရင် — **More** ကို နှိပ်ပြီး **Description** ကို ရွေးပါ။
6. (Optional) တန်ဖိုးဘေးက **Share** ကို နှိပ်ပြီး — teammates တွေနဲ့ share လုပ်ကာ monitors နဲ့ scheduled runs တွေမှာ သုံးနိုင်ပါတယ်။ Shared value ကို သီးခြား column တစ်ခုမှာ ပြချင်ရင် — **More** ကို နှိပ်ပြီး **Shared Value** ကို ရွေးပါ။

Collection variable တစ်ခုကို တည်းဖြတ်ဖို့ — လိုချင်တဲ့ variable နာမည်, တန်ဖိုး ဒါမှမဟုတ် ဖော်ပြချက်ကို ပြောင်းလိုက်ရုံပါပဲ။ Collection variable တစ်ခုကို နာမည် ဒါမှမဟုတ် တန်ဖိုးနဲ့ ရှာဖို့ — **Search** ကို နှိပ်ပြီး ရှာစရာကို ရိုက်ထည့်ပါ။

Collection variables တွေကို download လုပ်ဖို့ — collection တစ်ခုဘေးက **View more actions** ကို နှိပ်ပြီး — **More** ကို ရွေးကာ — **Export collection** ကို ရွေးပါ။ [Collection တစ်ခု export လုပ်ခြင်း](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Collection တစ်ခုပေါ်မှာ Editor access ရှိရင် — collection variables အသစ်တွေ ထည့်နိုင်, teammates တွေနဲ့ တန်ဖိုးတွေ share လုပ်နိုင် ပြီး shared values တွေကိုလည်း update လုပ်နိုင်ပါတယ်။ [Scripts တွေထဲမှာ collection variables သတ်မှတ်ခြင်း](#scripts-တွေထဲမှာ-variables-သတ်မှတ်ခြင်း) လည်း လုပ်နိုင်ပါတယ်။ Collection တစ်ခုပေါ်မှာ Viewer access ပဲ ရှိရင်တော့ — ရှိပြီးသား collection variables တွေရဲ့ local value ကိုပဲ update လုပ်နိုင်ပါတယ်။ [Collection တစ်ခုအတွက် Editor access တောင်းခံနည်း](https://learning.postman.com/docs/collaborating-in-postman/requesting-access-to-elements/#request-editor-access) ကို လေ့လာနိုင်ပါတယ်။

Postman element တစ်ခုကနေ တိုက်ရိုက် [variables တွေကို ကြည့်ရှု တည်းဖြတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/view-variables/) အကြောင်းကိုလည်း လေ့လာနိုင်ပါတယ်။

## Scripts တွေထဲမှာ variables သတ်မှတ်ခြင်း

ကိုယ့် request scripts တွေထဲမှာ variables နဲ့ vault secrets တွေကို programmatically (ကုဒ်ဖြင့်) သတ်မှတ်နိုင်ပါတယ်။

| Method                   | ဘာအတွက် သုံးလဲ                                            | ဥပမာ                                                             |
| ------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `pm.globals`             | Global variable တစ်ခု သတ်မှတ်ရန်။                        | `pm.globals.set("variable_key", "variable_value");`              |
| `pm.collectionVariables` | Collection variable တစ်ခု သတ်မှတ်ရန်။                    | `pm.collectionVariables.set("variable_key", "variable_value");`  |
| `pm.environment`         | လက်ရှိ environment ထဲမှာ environment variable သတ်မှတ်ရန်။ | `pm.environment.set("variable_key", "variable_value");`          |
| `pm.variables`           | Local variable တစ်ခု သတ်မှတ်ရန်။                          | `pm.variables.set("variable_key", "variable_value");`            |
| `pm.vault`               | Postman Local Vault ထဲမှာ vault secret တစ်ခု သတ်မှတ်ရန်။ | `await pm.vault.set("secret_key", "secret_value");`              |
| `unset`                  | Variable တစ်ခုကို ဖယ်ရှားရန်။                              | `pm.environment.unset("variable_key");`                          |

Environment တစ်ခုပေါ်မှာ Editor access မရှိရင် — ကိုယ့် script code က local value ကိုပဲ သက်ရောက်မှာ ဖြစ်ပြီး — team နဲ့ sync ဒါမှမဟုတ် share ဖြစ်မှာ မဟုတ်ပါဘူး။

Scripts တွေ ကိုယ့် vault secrets တွေကို ဝင်ရောက်နိုင်အောင် [ဖွင့်ထားဖို့ သေချာပါစေ](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-vault/)။ မဟုတ်ရင် — Postman Console ထဲမှာ error တစ်ခု ရပြီး method ရဲ့ နောက်မှာ ရှိတဲ့ code တွေ run မှာ မဟုတ်ပါဘူး။ ဒါ့အပြင် — `pm.vault` method တိုင်းရဲ့ ရှေ့မှာ `await` operator ကို သုံးဖို့ လိုအပ်ပါတယ်။

Pre-request ဒါမှမဟုတ် post-response scripts တွေထဲမှာ variables တွေ သုံးနည်း ညွှန်ကြားချက်တွေအတွက် — [Scripts တွေထဲမှာ variables တွေ သုံးခြင်း](https://learning.postman.com/docs/use/send-requests/variables/use-variables/#use-variables-in-scripts) ကို ကြည့်ပါ။

## Variable တန်ဖိုးကို လုံခြုံအောင် ပြုလုပ်ခြင်း

[Editor](https://learning.postman.com/docs/administration/roles-and-permissions/) access ရှိရင် — global, environment ဒါမှမဟုတ် collection variable တစ်ခုကို secure အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ Secure အဖြစ် သတ်မှတ်ထားတဲ့ variable တန်ဖိုးတွေက — [Postman Local Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-key#postman-local-vault) နဲ့ တူညီတဲ့ encryption (စာဝှက်စနစ်) ကို သုံးပါတယ်။ ဆိုလိုတာက — secure variables တွေကို Advanced Encryption Standard (AES) ကို 256-bit key length နဲ့ သုံးပြီး encrypt လုပ်ထားတာ ဖြစ်ပါတယ်။

Variable တစ်ခုကို secure အဖြစ် သတ်မှတ်ဖို့:

1. မလုပ်ရသေးရင် — ကိုယ့် [Postman Local Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-key#postman-local-vault) ကို vault key နဲ့ setup လုပ်ပါ။ Secure variable တန်ဖိုးတွေကို ဝင်ရောက်ဖို့ ကိုယ့် vault key က လိုအပ်ပါတယ်။
2. [Global](#global-variables-သတ်မှတ်ခြင်း), [environment](#environment-variables-သတ်မှတ်ခြင်း) ဒါမှမဟုတ် [collection](#collection-variables-သတ်မှတ်ခြင်း) variable တစ်ခုကို ဖွင့်ပါ။
3. Variable နာမည်ဘေးက **Secure** ကို နှိပ်ပြီး — variable ကို secure variable အဖြစ် ပြုလုပ်ပါ။

Secure အဖြစ် သတ်မှတ်ထားတဲ့ variables တွေကို local မှာ သိမ်းထားပြီး — team နဲ့ share မလုပ်ပါဘူး။ Workspace တစ်ခုရဲ့ Postman Shared Vault ထဲမှာ တန်ဖိုးကို သိမ်းထားခြင်းအားဖြင့် — teammates တွေနဲ့ share လုပ်နိုင်ပါတယ်။ [ကိုယ့် shared vault ထဲကို secure variable တစ်ခု ထည့်နည်း](https://learning.postman.com/docs/use/send-requests/variables/share-variables/#create-a-shared-value) ကို လေ့လာနိုင်ပါတယ်။

ကိုယ့် local ဒါမှမဟုတ် shared vault ထဲမှာ vault secret တစ်ခု ရှိပြီးသားဆိုရင် — secure variable ရဲ့ တန်ဖိုးအနေနဲ့ အဲဒီ vault secret ကို ကိုးကားနိုင်ပါတယ်။ ဒါက variable နာမည်ကို သုံးပြီး ကိုယ့် requests တွေထဲမှာ vault secrets တွေကို ကိုးကားနိုင်စေပါတယ်။ [Vault secrets တွေ သုံးနည်း](https://learning.postman.com/docs/use/postman-vault/use-vault-secrets#use-vault-secrets-in-requests) ကို လေ့လာနိုင်ပါတယ်။

Variable တစ်ခုကို secure အဖြစ်ကနေ ပြန်ဖျက်ချင်ရင် — variable နာမည်ဘေးက **Not a secret** ကို နှိပ်ပါ။ ဒါဆိုရင် တန်ဖိုးက နောက်ထပ် encrypt မလုပ်တော့ပါဘူး။

[VS Code extension ကနေ တန်ဖိုးတစ်ခုကို secure အဖြစ် သတ်မှတ်နည်း](https://learning.postman.com/docs/reference/vs-code-extension/send-requests/#store-variables) ကိုလည်း လေ့လာနိုင်ပါတယ်။

## Variables သတ်မှတ်ခြင်းရဲ့ အရင်နည်းလမ်း

Postman က collection, environment နဲ့ global variables တွေအတွက် — တစ်ခုနဲ့တစ်ခု မသက်ဆိုင်တဲ့ တန်ဖိုးများစွာကို ထိန်းသိမ်းတာကို နောက်ထပ် ထောက်ပံ့တော့မှာ မဟုတ်ပါဘူး။ အရင်က — ကိုယ့် variables တွေအတွက် *current value* (local) နဲ့ *initial value* (shared) ဆိုပြီး ပေးကာ သီးခြားစီ update လုပ်နိုင်ခဲ့ပါတယ်။

Initial နဲ့ current values တွေကို Postman VS Code extension မှာတော့ ထောက်ပံ့ပေးပါသေးတယ်။ [VS Code extension ထဲက variables တွေ](https://learning.postman.com/docs/reference/vs-code-extension/send-requests/#store-variables) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

ဒီအပြောင်းအလဲနဲ့ဆို — variables တွေအတွက် default အနေနဲ့ local ဖြစ်တဲ့ (အရင်က current value လို့ ခေါ်တဲ့) တန်ဖိုးတစ်ခုတည်းကိုပဲ ထည့်ဖို့ လိုပါတယ်။

Share လုပ်တဲ့အချိန်မှာ ရှိနေတဲ့ local value ကို အခြေခံပြီး — [variable တစ်ခုရဲ့ တန်ဖိုးကို teammates တွေနဲ့ share လုပ်နိုင်ပါတယ်](https://learning.postman.com/docs/use/send-requests/variables/share-variables/) (အရင်က initial value လို့ ခေါ်တဲ့ဟာ)။ ကိုယ့် local value ကို share မလုပ်ဘဲ ဆက်ပြီး update လုပ်သုံးစွဲနိုင်ပါတယ်။ Local value ထဲက update တွေက — အသစ်တန်ဖိုးကို ကိုယ်တိုင် share လုပ်ဖို့ ရွေးချယ်မှသာ — teammates တွေဆီ ရောက်သွားပါတယ်။
