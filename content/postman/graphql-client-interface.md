---
title: "Postman ရဲ့ GraphQL client interface အကြောင်း (The GraphQL client interface)"
description: "Postman ရဲ့ GraphQL client interface အကြောင်း — request section, response section နဲ့ right sidebar တို့ရဲ့ အစိတ်အပိုင်းတွေနဲ့ GraphQL requests တွေကို ပိုမို ထိရောက်စွာ ဖန်တီး, run လုပ်နည်း"
order: 108
source: "https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-client-interface/"
status: translated
updated: 2026-09-03
---

Postman မှာ GraphQL requests တွေအတွက် GraphQL client လို့ခေါ်တဲ့ အထူး client တစ်ခု ရှိပါတယ်။ Postman မှာ GraphQL request တစ်ခု ဖန်တီးလိုက်တာနဲ့ — GraphQL client က အလိုအလျောက် load ဖြစ်သွားပါတယ်။ GraphQL client မှာ GraphQL requests တွေကို ပိုမို ထိရောက်စွာ ဖန်တီး, run လုပ်နိုင်အောင် ကူညီတဲ့ features တွေ ပါဝင်ပါတယ်။

GraphQL client က GraphQL API တစ်ခုရဲ့ schema ကို အလိုအလျောက် ရယူပြီး — introspection ကို သုံးကာ ရနိုင်တဲ့ data fields တွေကို ပြသပေးပါတယ်။ GraphQL API တစ်ခုရဲ့ data fields တွေကို ရှာဖွေပြီး — fields တွေ ရွေးချယ်ခြင်း ဒါမှမဟုတ် editor ထဲမှာ code ရိုက်ထည့်ခြင်းအားဖြင့် queries တွေ တည်ဆောက်နိုင်ပါတယ်။ Queries အများကြီး ပါတဲ့ requests တွေအတွက်ဆိုရင် — ကိုယ်လိုချင်တဲ့ queries တွေကို ရွေးပြီး တစ်ခုချင်းစီ သပ်သပ်စီ run နိုင်ပါတယ်။

GraphQL client interface မှာ အဓိက အပိုင်း သုံးခု ပါဝင်ပါတယ်: [Request အပိုင်း](#request-အပိုင်း), [Response အပိုင်း](#response-အပိုင်း) နဲ့ [ညာဘက် sidebar](#ညာဘက်-sidebar)။

![Different sections of a GraphQL request](https://assets.postman.com/postman-docs/v12/graphql-request-full-view-v12-01.png)

Postman web app ကို သုံးနေတယ်ဆိုရင် — Postman Desktop Agent ကို သုံးရပါမယ်။ [Postman Agent အကြောင်း](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/) မှာ ပိုပြီး သိရှိနိုင်ပါတယ်။

## Request အပိုင်း

GraphQL client ရဲ့ request အပိုင်းမှာ — ပုံမှန် Postman request interface မှာ လုပ်သလိုပဲ URL box ထဲမှာ endpoint တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။ ဒါပေမယ့် GraphQL client မှာ — interactive schema explorer အပါအဝင် GraphQL အတွက် အထူးပြုထားတဲ့ features တွေ ထပ်ပါဝင်ပါတယ်။

![The request section](https://assets.postman.com/postman-docs/v12/graphql-request-section-v12-01.png)

* **Protocol dropdown list** — Request အသစ်တစ်ခုအတွက် protocol ကို ပြောင်းလဲပါ။ Protocol dropdown list ကို နှိပ်ပြီး — request protocol တစ်ခုကို ရွေးပါ။

  Request ကို save လုပ်ပြီးတာနဲ့ — request protocol ကို ပြောင်းလို့ မရတော့ပါဘူး။

* **URL** — GraphQL server ရဲ့ URL ကို ဒီမှာ ရိုက်ထည့်ပါ။ ဒီ box ကို နှိပ်ပြီး — ကိုယ် အရင်က သုံးဖူးတဲ့ URLs တွေကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။

* **Tabs** — အောက်ပါ tabs တွေ ရနိုင်ပါတယ်:
  * **Docs** — GraphQL schema documentation ကို ကြည့်ရှု ဒါမှမဟုတ် edit လုပ်ပါ။ Documentation က request အတွက် ကိုယ် ရွေးထားတဲ့ schema ကနေ အလိုအလျောက် generate လုပ်ထားတာပါ။ ကိုယ့် GraphQL request က ဘာတွေ လုပ်ဆောင်တယ်ဆိုတဲ့ description တစ်ခုကိုလည်း ထည့်နိုင်ပါတယ်။
  * **Query** — Schema explorer, query editor နဲ့ variables editor တွေ ပါဝင်ပါတယ်။
  * **Authorization** — ကိုယ့် authorization credentials တွေကို စီမံပါ။ API key, basic auth, bearer token အပါအဝင် — auth types စာရင်းကနေ ရွေးချယ်နိုင်ပါတယ်။ [requests တွေ authorize လုပ်ခြင်း](/docs/postman/authorization) အကြောင်း ပိုလေ့လာပါ။
  * **Headers** — Request နဲ့အတူ key-value pairs ပုံစံနဲ့ headers တွေ ပို့နိုင်စေပါတယ်။ Client က ဒီ headers တွေကို သုံးပြီး — call အကြောင်း အချက်အလက်တွေကို server ဆီ ပေးပို့ပါတယ်။
  * **Schema** — API တစ်ခုကို ရွေးပြီး request ထဲမှာ save လုပ်ပါ။ GraphQL introspection ကို သုံးနိုင်သလို — Postman workspace တစ်ခုကနေ API တစ်ခု ရွေးနိုင်ကာ — local file ဒါမှမဟုတ် URL တစ်ခုကနေ GraphQL schema တစ်ခုကိုလည်း import လုပ်နိုင်ပါတယ်။ GraphQL client က ကိုယ် ရွေးလိုက်တဲ့ schema ကနေ — schema explorer ထဲမှာ fields တွေနဲ့ ဖြည့်ပေးပါတယ်။
  * **Scripts** — GraphQL requests တွေမှာ JavaScript code (scripts) တွေ ထည့်နိုင်စေတဲ့ — Postman ရဲ့ အစွမ်းထက်တဲ့ scripting environment ကို access လုပ်ပါ။ API tests တွေ ရေးဖို့, [Postman Console](/docs/postman/troubleshooting-api-requests) မှာ log လုပ်ခြင်းအားဖြင့် ကိုယ့် requests တွေကို debug လုပ်ဖို့, ဒါမှမဟုတ် [variables](/docs/postman/variables) တွေရဲ့ values တွေကို dynamic ဖြစ်အောင် ဖတ်/update လုပ်ဖို့ scripts တွေကို သုံးပါ။ ကိုယ့် team ရဲ့ Postman Package Library ကနေ [packages တွေကို scripts နဲ့ tests တွေနဲ့အတူ import](/docs/postman/package-library) လုပ်နိုင်သလို — npm နဲ့ JSR လို [external package registries တွေကနေလည်း packages တွေ import](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) လုပ်နိုင်ပါတယ်။

* **Schema explorer** — **URL box** ထဲမှာ GraphQL server တစ်ခုရဲ့ endpoint ကို ရိုက်ထည့်လိုက်တဲ့အခါ — အဲဒီ endpoint ရဲ့ schema က ဒီမှာ ပေါ်လာပါတယ်။ Schema explorer က interactive visual query editor တစ်ခုလည်း ဖြစ်ပြီး — [query editor ထဲမှာ queries တွေ တည်ဆောက်ဖို့](/docs/postman/graphql-client-first-request#query-တစ်ခုတည်းနဲ့-graphql-request-ဖန်တီးခြင်း) fields နဲ့ arguments တွေကို ကြည့်ရှု ရွေးချယ်နိုင်ပါတယ်။

* ![Save icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-save-stroke.svg#icon) **Save** — Request ကို collection တစ်ခုထဲမှာ save လုပ်ပါ။ GraphQL requests တွေကို HTTP requests တွေ ပါဝင်တဲ့ collections တွေထဲမှာ save လုပ်လို့ မရပါဘူး။

* **Share** — Requests တွေကို team members, groups နဲ့ external users တွေနဲ့ share လုပ်ပြီး — အတူတကွ ပူးပေါင်း လုပ်ဆောင်ပါ။ [Postman မှာ ကိုယ့် အလုပ်တွေကို share လုပ်ခြင်း](/docs/postman/sharing) မှာ ပိုလေ့လာပါ။ Request ရဲ့ URL ကို copy လုပ်ဖို့ ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-link-stroke.svg#icon) **Copy link** ကို နှိပ်ပါ။

* **Query** — ရွေးထားတဲ့ query ကို run လုပ်ပါတယ်။ Queries အများကြီး ရှိနေရင် — တစ်ခုချင်းစီ ရွေးပြီး run လုပ်နိုင်တဲ့ dropdown list တစ်ခု ရနိုင်ပါတယ်။

* **Query editor** — ဒီမှာ queries တွေကို တည်ဆောက်, edit လုပ်ပါ။ Queries တွေကို ကိုယ်တိုင် ရိုက်ထည့်နိုင်သလို — schema explorer နဲ့လည်း တည်ဆောက်နိုင်ပါတယ်။ Query editor ထဲမှာ [queries အများကြီး ဖန်တီးပြီး](/docs/postman/graphql-client-first-request#queries-အများကြီးနဲ့-graphql-request-ဖန်တီးခြင်း) — တစ်ခုချင်းစီ သပ်သပ်စီ run နိုင်ပါတယ်။

* **Variables editor** — ဒီမှာ ကိုယ့် request ရဲ့ variables တွေကို ဖန်တီး, edit လုပ်ပါ။ Variables editor က ပုံမှန်အားဖြင့် ခေါက်ထားတဲ့ (collapsed) အနေအထားမှာ ရှိပါတယ်။ ၎င်းကို ချဲ့ဖို့ — **Variables** ဘေးက မြှားလေး (arrow) ကို ရွေးပါ။

## Response အပိုင်း

Query တစ်ခု run လိုက်တဲ့အခါ — server ကနေ ပြန်ပို့တဲ့ response က ဒီမှာ ပေါ်လာပါတယ်။ GraphQL client ရဲ့ response အပိုင်းက Postman ရဲ့ ပုံမှန် [response viewer](/docs/postman/responses) နဲ့ ဆင်တူပါတယ်။

GraphQL client ရဲ့ response အပိုင်းမှာ အောက်ပါ tabs တွေ ရှိပါတယ်:

* **Body** — Query ထဲက fields တွေအတွက် server က ပြန်ပို့လိုက်တဲ့ data တွေကို ပြသပါတယ်။ Body ကို **Pretty** နဲ့ **Table** ပုံစံတွေနဲ့ format လုပ်နိုင်ပါတယ်။
* **Headers** — Server က ပြန်ပို့လိုက်တဲ့ headers တွေကို ပြသပါတယ်။
* **Test Results** — Scripts section ထဲက assertions တွေရဲ့ ရလဒ်တွေကို ပြသပါတယ်။ ရလဒ်တွေက အမျိုးအစား သုံးမျိုး ရှိနိုင်ပါတယ်: Passed, Failed ဒါမှမဟုတ် Skipped။

### Responses အများကြီး လက်ခံရရှိခြင်း

အမြဲတည်မြဲတဲ့ ချိတ်ဆက်မှုတစ်ခုကနေ responses အများကြီး ပြန်ပို့တဲ့ subscription-type queries တွေအတွက်ဆိုရင် — response အပိုင်းမှာ messages တွေကို အသစ်ဆုံး message က ထိပ်မှာ ရှိတဲ့ပုံစံနဲ့ — အချိန်အစဉ်လိုက် ပြောင်းပြန် (reverse chronological order) အတိုင်း စီပြီး ပြသပါတယ်။ Messages တွေထဲမှာ server ကနေ ပြန်ပို့တဲ့ responses တွေ ဒါမှမဟုတ် — subscription confirmations, completion messages လို request နဲ့ ပတ်သက်တဲ့ အခြား အချက်အလက်တွေ ပါဝင်နိုင်ပါတယ်။

![Multiple responses](https://assets.postman.com/postman-docs/v12/graphql-multiple-responses-v12-01.png)

Message တစ်ခုကို ရွေးပြီး — ၎င်းကို ချဲ့ကာ အကြောင်းအရာတွေကို ကြည့်နိုင်ပါတယ်။ တိကျတဲ့ messages တွေ ရှာဖို့ search box ကို သုံးပါ။ Messages အားလုံး, responses တွေပဲ ဒါမှမဟုတ် အခြား message အမျိုးအစားတွေပဲ — ဆိုပြီးလည်း filter လုပ်နိုင်ပါတယ်။ ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-delete-stroke.svg#icon) **Clear messages** ကို နှိပ်ရင် — response အပိုင်းကနေ messages အားလုံး ဖယ်ရှားပါတယ်။ **Restore** ကို ရွေးပြီး — သူတို့ကို ပြန်ပြသနိုင်ပါတယ်။ Response ရဲ့ example တစ်ခု သိမ်းဖို့ ![Example icon](https://assets.postman.com/postman-docs/aether-icons/v12/entity-example-stroke.svg#icon) **Save Response** ကို နှိပ်ပါ။ Response ကို ရှင်းလင်းဖို့ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions > Clear Response** ကို နှိပ်ပါ။

## ညာဘက် sidebar

GraphQL client ရဲ့ ညာဘက် sidebar ကနေ — documentation, comments နဲ့ ကိုယ့် request အကြောင်း အချက်အလက်တွေကို ဝင်ရောက် ကြည့်ရှုနိုင်ပါတယ်။

* ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-comments-stroke.svg#icon) **Comments** — API တစ်ခုပေါ်မှာ အလုပ်လုပ်နေတုန်း — ကိုယ့် teammates တွေနဲ့ ပူးပေါင်း လုပ်ဆောင်ပါ။ မေးခွန်းတစ်ခု မေးဖို့, feedback ပေးဖို့ ဒါမှမဟုတ် API အကြောင်း ဆွေးနွေးဖို့ — တခြားသူတွေကို `@` နဲ့ tag လုပ်နိုင်ပါတယ်။
* ![Info icon](https://assets.postman.com/postman-docs/aether-icons/v12/state-info-stroke.svg#icon) **Info** — Request ID နဲ့ ဖန်တီးခဲ့တဲ့ ရက်စွဲလို — ကိုယ့် request အကြောင်း အသေးစိတ်တွေကို ကြည့်ရှုပါ။

## နောက်ထပ်အဆင့်များ

Basic interface elements တွေအကြောင်း လေ့လာပြီးပြီဆိုရင် — [ကိုယ့် ပထမဆုံး GraphQL query ကို ဖန်တီးကြည့်ပါ](/docs/postman/graphql-client-first-request)။
