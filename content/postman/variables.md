---
title: "Variables များဖြင့် တန်ဖိုးများ သိမ်းဆည်း ပြန်သုံးခြင်း"
description: "Variables ဆိုတာ ဘာလဲ — variable scopes (global, collection, environment, data, local) တွေ၊ variable values (local/shared) နဲ့ Postman မှာ တန်ဖိုးတွေကို ပြန်သုံးနိုင်အောင် သိမ်းနည်း"
order: 4
source: "https://learning.postman.com/docs/use/send-requests/variables/variables/"
status: translated
updated: 2026-09-01
---

*Variables* တွေက Postman မှာ တန်ဖိုးတွေကို သိမ်းပြီး ပြန်သုံးနိုင်အောင် လုပ်ပေးပါတယ်။ တန်ဖိုးတစ်ခုကို variable အဖြစ် သိမ်းထားခြင်းအားဖြင့် — collections, environments, requests, scripts တွေအနှံ့မှာ ကိုးကားသုံးနိုင်ပါတယ်။ Variables တွေက ပိုထိရောက်စွာ အလုပ်လုပ်နိုင်အောင်၊ team ဝင်တွေနဲ့ ပူးပေါင်းဆောင်ရွက်နိုင်အောင်၊ dynamic workflows တွေ ဖန်တီးနိုင်အောင် ကူညီပေးပါတယ်။

## Variable အခြေခံသဘောတရား

Variable ဆိုတာ data ရဲ့ သင်္ကေတပုံစံ (symbolic representation) တစ်ခုပါ — လိုအပ်တဲ့ နေရာတိုင်းမှာ တန်ဖိုးကို ကိုယ်တိုင် ရိုက်ထည့်စရာမလိုဘဲ ရယူသုံးနိုင်စေပါတယ်။ နေရာများစွာမှာ တန်ဖိုးတစ်ခုတည်းကို သုံးနေရရင် အသုံးဝင်ပါတယ်။ Variables တွေက အသေးစိတ်တွေကို ဖုံးကွယ်ပေးတာကြောင့် requests တွေကို ပိုပြီး လိုက်လျောညီထွေဖြစ်စေပြီး ဖတ်ရလွယ်ကူစေပါတယ်။

ဥပမာ — request တစ်ခုထက်ပိုပြီး URL တစ်ခုတည်းကို သုံးနေရပြီး အဲဒီ URL က ပြောင်းနိုင်တယ်ဆိုရင် — URL ကို `base_url` variable ထဲမှာ သိမ်းထားလို့ရပါတယ်။ ပြီးရင် requests တွေထဲမှာ variable ကို ကိုးကားဖို့ `{{base_url}}` ကို သုံးပါတယ်။ URL ပြောင်းလိုက်ရင် variable ရဲ့ တန်ဖိုးကို ပြောင်းလိုက်ရုံပါပဲ — variable နာမည်ကို သုံးထားတဲ့ collection တစ်ခုလုံးမှာ အလိုအလျောက် ပြောင်းသွားပါမယ်။

Variables တွေကို ပြောင်းလဲလိုက်တာတွေက အလိုအလျောက် သိမ်းပါတယ်။

ဒီနည်းသဘောတရားက request ထဲမှာ data ထပ်ခါထပ်ခါ ပါနေတဲ့ ဘယ်အစိတ်အပိုင်းမှာမဆို သက်ရောက်ပါတယ်။ Request တွေ run တဲ့အခါ — variable ထဲမှာ သိမ်းထားတဲ့ တန်ဖိုးက variable ကို ကိုးကားထားတဲ့ နေရာတိုင်းမှာ ပါဝင်ပါမယ်။ Variable တန်ဖိုးက `https://postman-echo.com` ဖြစ်ပြီး request က `{{base_url}}/get` URL ကို သုံးတယ်ဆိုရင် — Postman က request ကို `https://postman-echo.com/get` ဆီ ပို့ပါတယ်။

![Variable ဥပမာ](https://assets.postman.com/postman-docs/v12/variables-editor-v12.png)

Postman မှာ variables တွေက key-value pairs တွေပါ။ Variable နာမည်တစ်ခုစီက key ကို ကိုယ်စားပြုတာဖြစ်လို့ — variable နာမည်ကို ကိုးကားရင် သူ့ရဲ့ တန်ဖိုးကို ရယူနိုင်ပါတယ်။ [Requests တွေကို chain လုပ်တာ](https://www.postman.com/postman/postman-team-collections/collection/fa2fdwg/extract-data-to-chain-requests) လိုမျိုး — requests နဲ့ tests တွေကြားမှာ data တွေ ပေးပို့ဖို့ variables တွေကို သုံးနိုင်ပါတယ်။

Sensitive data တွေကို vault secrets အဖြစ် သိမ်းပြီး Postman workspaces တွေအနှံ့ ပြန်သုံးဖို့ [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) ကို သုံးပါ။ Postman Vault မှာ vault type အမျိုးမျိုး ပါဝင်ပြီး — secrets တွေကို local မှာ သိမ်းဖို့ ဒါမှမဟုတ် team နဲ့ share လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။ အဲဒါတွေက sensitive values တွေကို collections, environments နဲ့ တခြား Postman elements တွေကနေ သီးခြား ခွဲထားပေးပါတယ်။

Postman က variables တွေကို strings အဖြစ် သိမ်းပါတယ်။ Objects ဒါမှမဟုတ် arrays တွေကို သိမ်းချင်ရင် — မသိမ်းခင် `JSON.stringify()` လုပ်ပြီး၊ ပြန်ယူတဲ့အခါ `JSON.parse()` လုပ်ဖို့ မမေ့ပါနဲ့။

Variables တွေကို အုပ်စုဖွဲ့ပြီး collaborators တွေနဲ့ share လုပ်ဖို့ environments တွေကို သုံးပါ။ ဥပမာ — production server အတွက် config details တစ်စုံ၊ testing အတွက် နောက်တစ်စုံ သုံးနေရတာမျိုးပါ။ Team workflows တွေထဲမှာ environments တွေကို ဘယ်လို ထည့်သွင်းသုံးနိုင်လဲဆိုတာ — [Postman မှာ environment များဖြင့် variable အုပ်စုများ စီမံခြင်း](/docs/postman/managing-environments) မှာ ကြည့်နိုင်ပါတယ်။

## Variable scopes (နယ်ပယ်များ)

Postman က variables တွေကို scope အမျိုးမျိုးနဲ့ ထောက်ပံ့ပေးပြီး — development, testing, collaboration လုပ်ငန်းအမျိုးမျိုးအတွက် လိုက်လျောညီထွေ စီမံနိုင်ပါတယ်။ Scopes တွေက requests တွေ run လုပ်တဲ့ context အမျိုးမျိုးနဲ့ ဆက်စပ်နေပြီး — variable scope တစ်ခုစီက မတူတဲ့ အလုပ်တွေအတွက် သင့်တော်ပါတယ်။

Variable scope မပါဘဲလည်း variable တစ်ခုကို ဖန်တီးနိုင်ပါတယ် — default value ထားစရာ မလိုတဲ့အခါ ဒါမှမဟုတ် scope တစ်ခုထဲ မထည့်ခင် တန်ဖိုးကို အရင်စမ်းကြည့်ချင်တဲ့အခါမျိုးပါ။ [Scope မပါဘဲ variables တွေ ဖန်တီးခြင်း](https://learning.postman.com/docs/use/send-requests/variables/define-variables/#set-values-for-variables-without-a-scope) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Scope နှစ်ခုမှာ နာမည်တူ variable တစ်ခု သတ်မှတ်ထားရင် — scope အကျဉ်းဆုံး variable ထဲမှာ သိမ်းထားတဲ့ တန်ဖိုးကို သုံးပါတယ်။ ဥပမာ — "username" global variable နဲ့ "username" local variable တစ်ခု ရှိရင် — request run တဲ့အခါ local value ကို သုံးပါတယ်။

အကျယ်ဆုံးကနေ အကျဉ်းဆုံး အစဉ်လိုက်ကတော့: *global*, *collection*, *environment*, *data*, *local* ပါ။

* **Global variables** က collections, requests, scripts, environments တွေကြားမှာ data တွေကို ရယူသုံးနိုင်အောင် လုပ်ပေးပါတယ်။ Global variables တွေက [workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/create-workspaces/) တစ်ခုလုံးမှာ ရနိုင်ပါတယ်။ Postman မှာ scope အကျယ်ဆုံး ဖြစ်တာကြောင့် — testing နဲ့ prototyping အတွက် သင့်တော်ပါတယ်။ နောက်ပိုင်း development အဆင့်တွေမှာတော့ ပိုတိကျတဲ့ scopes တွေကို သုံးပါ။
* **Collection variables** တွေက collection တစ်ခုထဲက requests တွေအနှံ့မှာ ရနိုင်ပြီး environments တွေနဲ့ သီးခြား ဖြစ်ပါတယ်။ Collection variables တွေက ရွေးထားတဲ့ environment ပေါ် မူတည်ပြီး မပြောင်းပါဘူး။ Environment တစ်ခုတည်းပဲ သုံးနေတဲ့အခါ — auth ဒါမှမဟုတ် URL details လိုမျိုးဆိုရင် collection variables တွေ သင့်တော်ပါတယ်။
* **Environment variables** တွေက local development နဲ့ testing ဒါမှမဟုတ် production environments တွေလို — အလုပ်အမျိုးမျိုးအတွက် scope သတ်မှတ်နိုင်စေပါတယ်။ တစ်ချိန်မှာ environment တစ်ခုပဲ active ဖြစ်နိုင်ပါတယ်။ Environment တစ်ခုတည်း ရှိတယ်ဆိုရင် collection variables တွေ သုံးတာ ပိုထိရောက်နိုင်ပေမယ့် — environments တွေက [role-based access levels](https://learning.postman.com/docs/use/send-requests/variables/team-environments/#share-an-environment) တွေကို သတ်မှတ်နိုင်စေပါတယ်။
* **Data variables** တွေက external CSV နဲ့ JSON files တွေကနေ လာပြီး — [Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/) ဒါမှမဟုတ် [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) နဲ့ collections တွေ run တဲ့အခါ သုံးဖို့ data sets တွေကို သတ်မှတ်ပေးပါတယ်။ Data variables တွေမှာ local values တွေ ရှိပြီး — request ဒါမှမဟုတ် collection run တွေထက် ကျော်လွန် မတည်မြဲပါဘူး။
* **Local variables** တွေက request scripts တွေထဲမှာ သုံးလို့ရတဲ့ ယာယီ variables တွေပါ။ Local variables တွေက request တစ်ခု ဒါမှမဟုတ် collection run တစ်ခုတည်းအတွက် scope သတ်မှတ်ထားပြီး — run ပြီးသွားရင် နောက်ထပ် မရနိုင်တော့ပါဘူး။ တခြား variable scopes အားလုံးကို override လုပ်ချင်ပေမယ့် run ပြီးတာနဲ့ တန်ဖိုး မတည်မြဲစေချင်တဲ့အခါ local variables တွေ သင့်တော်ပါတယ်။

![Variable scope](https://assets.postman.com/postman-docs/v10/var-scope-v10.jpg)

## Variable တန်ဖိုးများ

Default အနေနဲ့ — collection, environment နဲ့ global variable တန်ဖိုးတွေက ကိုယ့် Postman instance ထဲမှာပဲ local အနေနဲ့ ရနိုင်ပါတယ်။ Request တွေ ပို့တဲ့အခါ local value ကို သုံးပြီး — Postman cloud ဆီ sync မလုပ်ပါဘူး။ Team ဝင်တွေနဲ့ မမျှဝေဘဲ ကိုယ့် local value ကို ကြိုက်သလို ပြောင်းနိုင်ပါတယ်။ [Variables တွေအတွက် local value သတ်မှတ်နည်း](https://learning.postman.com/docs/use/send-requests/variables/define-variables/) ကို လေ့လာနိုင်ပါတယ်။

Element ပေါ်မှာ Editor access ရှိရင် [variable တစ်ခုရဲ့ တန်ဖိုးကို share လုပ်နိုင်ပြီး](https://learning.postman.com/docs/use/send-requests/variables/share-variables/) — အဲဒီတန်ဖိုးက Postman cloud ဆီ sync ဖြစ်ပါတယ်။ Variable တစ်ခုရဲ့ တန်ဖိုးကို share လုပ်ထားခြင်းအားဖြင့် — team ဝင်တွေက ကိုယ့် API ကို request တွေ စပို့ဖို့ သုံးနိုင်တဲ့ default value တစ်ခုကို ပေးထားတာ ဖြစ်ပါတယ်။ Team ဝင်တွေက သူတို့ရဲ့ local value ကို share မလုပ်ဘဲ ဆက်ပြောင်းနိုင်ပြီး — ဘယ်အချိန်မဆို shared value ဆီ ပြန်လည် reset လုပ်နိုင်ပါတယ်။

Postman cloud ပေါ်မှာ run လုပ်တဲ့ Postman features တချို့ကလည်း request တွေ ပို့တဲ့အခါ shared value ကို သုံးပါတယ်။ ဒီ features တွေထဲမှာ scheduled collection runs, monitors နဲ့ Postman CLI တွေ ပါဝင်ပါတယ်။

Current values နဲ့ initial values ဆိုတဲ့ အရင်က သတ်မှတ်နည်းနဲ့ ပိုရင်းနှီးတယ်ဆိုရင် — [variables တွေ သတ်မှတ်ခြင်းရဲ့ အရင်နည်းလမ်း](https://learning.postman.com/docs/use/send-requests/variables/define-variables/#previous-way-of-defining-variables) အကြောင်း လေ့လာနိုင်ပါတယ်။
