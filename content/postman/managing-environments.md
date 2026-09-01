---
title: "Environment များဖြင့် variable အုပ်စုများ စီမံခြင်း"
description: "Environment ဆိုတာ ဘာလဲ — environment ဖန်တီးခြင်း၊ variable တွေ ထည့်ခြင်း၊ environment တွေကြား ပြောင်းခြင်း၊ requests နဲ့ scripts တွေထဲမှာ သုံးခြင်း"
order: 3
source: "https://learning.postman.com/docs/use/send-requests/variables/managing-environments/"
status: translated
updated: 2026-09-01
---

Postman မှာ *environment* ဆိုတာ — [requests တွေ ပို့တဲ့အခါ](https://learning.postman.com/docs/use/send-requests/create-requests/create-requests/),  [pre-request scripts တွေ ရေးတဲ့အခါ](https://learning.postman.com/docs/tests-and-scripts/write-scripts/pre-request-scripts/),  [post-response scripts တွေ ရေးတဲ့အခါ](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/) မှာ ကိုးကားသုံးလို့ရတဲ့ [variables](/docs/postman/variables) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး စုထားတဲ့ set တစ်ခုပါ။ Postman မှာ လုပ်ဆောင်နေတဲ့ အလုပ်အမျိုးမျိုးအတွက် environments တွေ ဖန်တီးနိုင်ပါတယ်။ Environment တစ်ခုကနေ နောက်တစ်ခုကို ပြောင်းလိုက်တဲ့အခါ — requests နဲ့ scripts တွေထဲက variable အားလုံးက လက်ရှိ environment ရဲ့ တန်ဖိုးတွေကို သုံးပါတယ်။ Context ပေါ်မူတည်ပြီး request တွေမှာ တန်ဖိုးအမျိုးမျိုး သုံးချင်တဲ့အခါ အသုံးဝင်ပါတယ် — ဥပမာ test server ဒါမှမဟုတ် production server ကို request ပို့တဲ့အခါမျိုးပါ။

Environments တွေက team အနေနဲ့ အလုပ်လုပ်နေရင် Postman data တွေပေါ်မှာ ပူးပေါင်းလုပ်ဆောင်ဖို့လည်း ကူညီပေးပါတယ်။ API keys, passwords, tokens စတဲ့ sensitive data တွေရဲ့ မြင်နိုင်မှုကို စီမံပြီး variables တွေကို share လုပ်ဖို့ environments တွေကို သုံးနိုင်ပါတယ်။ [Postman မှာ team အနေနဲ့ environments နဲ့ အလုပ်လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/team-environments/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Environment တစ်ခု ဖန်တီးခြင်း

Postman မှာ အလုပ် context အလိုက် variable တန်ဖိုးတွေကို ပြောင်းနိုင်ဖို့ ဒါမှမဟုတ် team ဝင်တွေနဲ့ တန်ဖိုးတွေကို share လုပ်ဖို့ environment အသစ်တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ Environment selector ကနေလည်း environment အသစ် ဖန်တီးပြီး active environment အဖြစ် သတ်မှတ်နိုင်ပါတယ်။

Environment အသစ်တစ်ခု ဖန်တီးဖို့:

1. Sidebar မှာ **Add** icon ကို နှိပ်ပြီး **Environments** ကို ရွေးပါ။ Workbench ရဲ့ ညာဘက်အပေါ်က environment selector ကိုလည်း ရွေးပြီး **Add** icon ကို နှိပ်လို့ရပါတယ်။
2. Environment အသစ်အတွက် နာမည်တစ်ခု ရိုက်ထည့်ပါ။
3. (Optional) Environment ကို [color သတ်မှတ်နိုင်ပါတယ်](https://learning.postman.com/docs/use/send-requests/variables/environment-colors/)။
4. Environment ထဲကို လိုချင်တဲ့ variables တွေ ထည့်ပါ။ နောက်မှလည်း variables တွေ ထပ်ထည့်လို့ရပါတယ်။ [Environment variables တွေ ထည့်ခြင်း](#environment-variables-တွေ-ထည့်ခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

   Variable တွေကို ပြောင်းလဲတာတွေက အလိုအလျောက် သိမ်းပါတယ်။

5. Environment အသစ်ကို သုံးဖို့ — workbench ရဲ့ ညာဘက်အပေါ်က environment selector ကနေ ရွေးပါ။ ဒါက သူ့ကို active environment ဖြစ်စေပြီး variable အားလုံးကို အဲဒီ environment ထဲက သတ်မှတ်ထားတဲ့ တန်ဖိုးတွေအတိုင်း သုံးစေပါတယ်။ [Environment တွေကြား ပြောင်းလဲခြင်း](#environment-တွေကြား-ပြောင်းလဲခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

![Environment selector](https://assets.postman.com/postman-docs/v12/environment-selector.png)

Requests တွေကို ပြောင်းလဲတာတွေကို အလိုအလျောက် သိမ်းဖို့ autosave ကို ဖွင့်ထားနိုင်ပါတယ်။ [Autosave](https://learning.postman.com/docs/getting-started/installation/settings/general-settings#application) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Environment variables တွေ ထည့်ခြင်း

Environment variable တစ်ခု ထည့်တဲ့အခါ local value တစ်ခု သတ်မှတ်နိုင်ပါတယ် — ဆိုလိုတာက အဲဒီတန်ဖိုးက Postman cloud ဆီ sync မလုပ်ဘဲ team ဝင်တွေနဲ့လည်း share မဖြစ်ပါဘူး။

Environment တစ်ခုထဲ variables တွေ ထည့်ဖို့:

1. Sidebar မှာ **Items** ကို နှိပ်ပါ။
2. **Environments** ကို နှိပ်ပြီး environment တစ်ခုကို ရွေးပါ။
3. Variable ရဲ့ နာမည်ကို ရိုက်ထည့်ပါ။
4. Data က sensitive ဆိုရင် — variable ရဲ့ နာမည်ဘေးက **Secure** ကို နှိပ်ပါ။
5. (Optional) Variable ရဲ့ နာမည်ဘေးက **Add description** ကို နှိပ်ပြီး variable အကြောင်း ဖော်ပြချက် ရေးနိုင်ပါတယ်။ Descriptions တွေကို ကိုယ်ပိုင် column မှာ ပြချင်ရင် **More** ကို နှိပ်ပြီး **Description** ကို ရွေးပါ။
6. Variable ရဲ့ တန်ဖိုးကို ရိုက်ထည့်ပါ။ Variable တွေကို ပြောင်းလဲတာတွေက အလိုအလျောက် သိမ်းပါတယ်။ [Shared values](https://learning.postman.com/docs/use/send-requests/variables/share-variables) တွေကို ကိုယ်ပိုင် column မှာ ပြချင်ရင် **More** ကို နှိပ်ပြီး **Shared Value** ကို ရွေးပါ။

ကိုယ့် workspace မှာ [environment variables တွေ သတ်မှတ်ခြင်းအတွက် နောက်ထပ် option တွေ](https://learning.postman.com/docs/use/send-requests/variables/define-variables/) အကြောင်း လေ့လာနိုင်ပါတယ်။

Editor access ရှိရင် [environment variable တစ်ခုရဲ့ တန်ဖိုးကို share လုပ်နိုင်ပါတယ်](https://learning.postman.com/docs/use/send-requests/variables/share-variables) — အဲဒီတန်ဖိုးက Postman cloud ဆီ sync ဖြစ်သွားပြီး team ဝင်တွေနဲ့ မျှဝေနိုင်ပါတယ်။ ဒါက Postman cloud ပေါ်မှာ run လုပ်တဲ့ Postman features တွေနဲ့လည်း variable ကို သုံးနိုင်စေပါတယ်။

## Environment တွေကြား ပြောင်းလဲခြင်း

Postman က active environment ကို workbench ရဲ့ ညာဘက်အပေါ်မှာရှိတဲ့ environment selector မှာ ပြပါတယ်။ Request ပို့တဲ့အခါ ဒါမှမဟုတ် script run တဲ့အခါ — Postman က active environment ထဲက variable အားလုံးရဲ့ local value တွေကို သုံးပါတယ်။ တခြား environment တစ်ခုကို active ဖြစ်စေချင်ရင် environment selector ကနေ ရွေးပါ။

Environment selector ထဲက **Add** icon ကို ရွေးပြီး environment အသစ် ဖန်တီးကာ active environment အဖြစ် သတ်မှတ်နိုင်ပါတယ်။

Sidebar ထဲက **Environments** ကို ရွေးပြီးလည်း environment တစ်ခုကို active ဖြစ်စေနိုင်ပါတယ်။ Environment တစ်ခုဘေးက **Set active** icon ကို နှိပ်ပြီး active environment အဖြစ် သတ်မှတ်နိုင်ပါတယ်။

![Active environment](https://assets.postman.com/postman-docs/v12/environment-set-active.png)

Variable တစ်ခုရဲ့ local value ကို စစ်ကြည့်ချင်ရင် — workbench ထဲက **Variables** ကို နှိပ်ပြီး variables pane ကို ဖွင့်ပါ။ Variables pane မှာ active environment ထဲက variable အားလုံးရဲ့ local value တွေကို စာရင်းပြပါတယ်။

ဘယ် environment က active ဖြစ်နေပါစေ variables တွေကို ရနိုင်စေချင်ရင် [global variables](https://learning.postman.com/docs/use/send-requests/variables/define-variables/#define-global-variables) တွေကို သုံးပါ။ Quick look မှာ ကိုယ်က သတ်မှတ်ထားတဲ့ ဒါမှမဟုတ် workspace ထဲမှာ share ထားတဲ့ global variables တွေကို စာရင်းပြပါတယ်။

## Requests နဲ့ scripts တွေထဲမှာ variables တွေကို သုံးခြင်း

Request တစ်ခုထဲမှာ environment variable ကို သုံးဖို့ — variable ရဲ့ နာမည်ကို [double curly braces](https://learning.postman.com/docs/use/send-requests/variables/use-variables/) နဲ့ ဝိုင်းပြီး ကိုးကားပါ:

```js
{{base_url}}
```

Environment variables တွေကို request URL တွေ၊ parameters တွေ၊ headers တွေ၊ body data တွေထဲမှာ ကိုးကားသုံးနိုင်ပါတယ်။ Variable reference ပေါ်မှာ hover လုပ်ရင် သူ့ရဲ့ local value ကို မြင်ရပါတယ်။

**Pre-request** နဲ့ **Post-response** scripts တွေထဲမှာလည်း လက်ရှိ environment variable တန်ဖိုးတွေကို [`pm.environment.get` method](https://learning.postman.com/docs/use/send-requests/variables/use-variables/#use-variables-in-scripts) နဲ့ ရယူနိုင်ပါတယ်:

```js
pm.environment.get("variable_name");
```

Request တစ်ခုအတွက် နာမည်တူ variable တစ်ခုထက်ပိုပြီး ရနိုင်ရင် — Postman က [scope](https://learning.postman.com/docs/use/send-requests/variables/variables/#variable-scopes) အကျဉ်းဆုံး variable ရဲ့ တန်ဖိုးကို သုံးပါတယ်။ ဒါကြောင့် collection ဒါမှမဟုတ် global variable နဲ့ နာမည်တူတဲ့ environment variable တစ်ခု ရှိရင် — environment variable ကို သုံးပါတယ်။ ဒါပေမယ့် local နဲ့ data variable တန်ဖိုးတွေကတော့ environment တန်ဖိုးတွေထက် သာလွန်ပါတယ်။ Override လုပ်ခံရတဲ့ variable တွေရဲ့ တန်ဖိုးကို strikethrough (စာသားပေါ် မျဉ်းကြောင်းထိုး) ပုံစံနဲ့ ပြပါတယ်။

[Postman မှာ environment variables တွေကို တည်းဖြတ် သတ်မှတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/environment-variables/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Environment တစ်ခုကို တည်းဖြတ်ခြင်း

Team အနေနဲ့ environments တွေနဲ့ အလုပ်လုပ်နေရင် — environment ကို တည်းဖြတ်ဖို့ ဒါမှမဟုတ် variable တွေရဲ့ shared values တွေကို ပြောင်းဖို့ Editor role ရှိရပါမယ်။ [Environments share လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/team-environments/#share-an-environment) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Environment တစ်ခုကို တည်းဖြတ်ဖို့ — sidebar မှာ **Environments** ကို ရွေးပြီး environment တစ်ခုကို ရွေးပါ။ ဒီကနေ အောက်ပါအတိုင်း လုပ်ဆောင်နိုင်ပါတယ်:

* Environment ကို နာမည်ပြောင်းဖို့ — environment ရဲ့ နာမည်ကို ရွေးပြီး နာမည်အသစ် ရိုက်ထည့်ပါ။
* Environment ကို duplicate လုပ်ဖို့ — **View more actions** ကို နှိပ်ပြီး **Duplicate** ကို ရွေးပါ။
* Environment ကို ဖျက်ဖို့ — **View more actions** ကို နှိပ်ပြီး **Delete** ကို ရွေးပါ။ Environment တစ်ခုကို ဖျက်ရင် အဲဒီ environment ထဲက variable တွေအားလုံးပါ ဖျက်ပါတယ်။
* Workspace ထဲက environments တွေကို စနစ်တကျထားနိုင်အောင် environment တစ်ခုကို [color](https://learning.postman.com/docs/use/send-requests/variables/environment-colors/) သတ်မှတ်ပေးနိုင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

Environments တွေက Postman မှာ data တွေကို share လုပ်ပြီး team နဲ့ ပူးပေါင်းလုပ်ဆောင်နိုင်အောင် ကူညီပေးပါတယ်။ Environments တွေကို team နဲ့ သုံးဖို့ နောက်ထပ် resources တချို့:

* Environment variables တွေနဲ့ အလုပ်လုပ်ခြင်းအကြောင်း — [Postman မှာ environment variables တွေကို တည်းဖြတ် သတ်မှတ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/environment-variables/)။
* Team နဲ့ ပူးပေါင်းဖို့ environments တွေ သုံးနည်း — [Postman မှာ team အနေနဲ့ environments တွေနဲ့ အလုပ်လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/variables/team-environments/)။
* Environments တွေ publish လုပ်နည်း — [Postman မှာ documentation publish လုပ်ခြင်း](https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/) ဒါမှမဟုတ် [Run in Postman buttons ဖန်တီးခြင်း](https://learning.postman.com/docs/publishing-your-api/run-in-postman/creating-run-button/)။
* Environments တွေကို color သတ်မှတ်ခြင်းအကြောင်း — [Workspace environments တွေကို colors နဲ့ စုစည်းခြင်း](https://learning.postman.com/docs/use/send-requests/variables/environment-colors/)။
