---
title: "Postman requests များမှာ logic နဲ့ tests ထည့်ရန် scripts သုံးခြင်း"
description: "Scripts ဆိုတာ ဘာလဲ — pre-request နဲ့ post-response scripts တွေ ဘယ်အချိန်မှာ run လဲ၊ script run order၊ Postman Sandbox, scripts ပြန်သုံးခြင်း၊ debugging, dynamic variables နဲ့ pm API"
order: 8
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/intro-to-scripts/"
status: translated
updated: 2026-09-01
---

Postman ရဲ့ runtime က [Node.js](https://nodejs.org/en/about) ကို အခြေခံထားပါတယ်။ ဒါကို သုံးပြီး requests နဲ့ collections တွေမှာ dynamic behavior တွေ ထည့်ပေးတဲ့ scripts တွေ ရေးနိုင်ပါတယ်။ API tests တွေ ရေးဖို့၊ dynamic parameters တွေ ပါတဲ့ requests တွေ တည်ဆောက်ဖို့၊ ဒါမှမဟုတ် requests တွေကြားမှာ data တွေ ပို့ဆောင်ဖို့ — pre-request နဲ့ post-response scripts တွေကို သုံးနိုင်ပါတယ်။

Scripts တွေက asynchronously run ပါတယ်။ ဆိုလိုတာက — အရင် script တစ်ခု ပြီးတာကို မစောင့်ဘဲ scripts အများကြီးကို run နိုင်ပါတယ်။ Scripts တွေကို အစဉ်လိုက် run ချင်ရင် — callback function တစ်ခုကို သုံးနိုင်ပါတယ်။

## Postman မှာ scripts

Standard HTTP request တစ်ခုအတွက် — flow ထဲက ဖြစ်ရပ် နှစ်ခုမှာ run ဖို့ JavaScript code တွေ ထည့်နိုင်ပါတယ်:

* Request တစ်ခုကို server ဆီ မပို့ခင် — **Scripts > Pre-request** tab အောက်မှာ [pre-request script](https://learning.postman.com/docs/tests-and-scripts/write-scripts/pre-request-scripts/) အဖြစ် run ပါတယ်။
* Response တစ်ခု ရရှိပြီးနောက် — **Scripts > Post-response** tab အောက်မှာ [post-response script](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/) အဖြစ် run ပါတယ်။

တခြား request နဲ့ event types တွေကတော့ flow ထဲက ကိုယ်ပိုင် အချိန်တွေမှာ ကိုယ်ပိုင် tabs တွေအောက်မှာ scripts တွေကို run ပါတယ်:

* GraphQL requests တွေက query တစ်ခု မလုပ်ခင် (**Scripts > Before query**) ဒါမှမဟုတ် response ရပြီးနောက် (**Scripts > After response** tab) scripts တွေ run ပါတယ်။
* gRPC requests တွေက invoke မလုပ်ခင် (**Scripts > Before invoke**), message ရှိနေစဉ် (**Scripts > On message**), ဒါမှမဟုတ် response ရပြီးနောက် (**Scripts > After response**) scripts တွေ run ပါတယ်။
* Webhook listeners တွေက event တစ်ခု ရောက်လာတဲ့အခါ (**On event** tab) ဒါမှမဟုတ် Postman က response တစ်ခုကို source ဆီ ပြန်ပို့ပြီးနောက် (**After response** tab) scripts တွေ run ပါတယ်။

စာသား ရိုက်ထည့်နေတုန်း Postman က suggestions တွေ ပြပါတယ်။ တစ်ခုကို ရွေးလိုက်ရင် code ကို autocomplete လုပ်ပေးပါတယ်။

![Script autocomplete](https://assets.postman.com/postman-docs/v12/test-script-autocomplete.png)

Requests တွေအပြင် — collection ဒါမှမဟုတ် folder တစ်ခုထဲကိုလည်း pre-request နဲ့ post-response scripts တွေ ထည့်နိုင်ပါတယ်။

## Scripts တွေရဲ့ run order

Postman မှာ request တစ်ခုတည်းအတွက် script run order က ဒီလိုပါ:

* Request တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ pre-request script တစ်ခုက request ကို မပို့ခင် run ပါတယ်။
* Request တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ post-response script တစ်ခုက request ပို့ပြီးနောက် run ပါတယ်။

![Workflow for single request](https://assets.postman.com/postman-docs/v11/req-resp-v11.jpg)

Collection တစ်ခုထဲက request တိုင်းအတွက် scripts တွေက အောက်ပါအတိုင်း run ပါတယ်:

* Collection တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ pre-request script တစ်ခုက collection ထဲက request တိုင်း မတိုင်ခင် run ပါတယ်။
* Folder တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ pre-request script တစ်ခုက folder ထဲက direct child request တိုင်း မတိုင်ခင် run ပါတယ်။
* Collection တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ post-response script တစ်ခုက collection ထဲက request တိုင်း ပြီးနောက် run ပါတယ်။
* Folder တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ post-response script တစ်ခုက folder ထဲက direct child request တိုင်း ပြီးနောက် run ပါတယ်။

![workflow for request in collection](https://assets.postman.com/postman-docs/v11/execOrder-v11.jpg)

Collection တစ်ခုထဲက request တိုင်းအတွက် scripts တွေက အမြဲတမ်း တူညီတဲ့ hierarchy အတိုင်း run ပါတယ်။ Collection-level scripts တွေက အရင်ဆုံး run ပြီး — folder-level scripts တွေ၊ ပြီးမှ request-level scripts တွေ run ပါတယ်။ ဒီ run order က pre-request ရော post-response scripts တွေအတွက်ပါ သက်ဆိုင်ပါတယ်။

ဥပမာ — အောက်ပါ collection က folder တစ်ခုတည်းနဲ့ အဲဒီ folder ထဲမှာ requests နှစ်ခု ပါဝင်တဲ့ ပုံစံဖွဲ့ထားပါတယ်။

![Collection with nested folder and requests](https://assets.postman.com/postman-docs/v11/console-log-statement-v11-2-v4.jpg)

Collection, folder နဲ့ requests တွေအတွက် pre-request နဲ့ post-response script sections တွေထဲမှာ log statements တွေ ဖန်တီးထားရင် — run order ကို [Postman Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) မှာ ပြန်ကြည့်နိုင်ပါတယ်။

![Logs in the Console](https://assets.postman.com/postman-docs/v11/logs-in-console-v11-v3.jpg)

### ဘယ်လို အလုပ်လုပ်လဲ

Pre-request နဲ့ post-response scripts တွေ ရေးတဲ့အခါ — [Postman Sandbox](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) ကို သုံးနိုင်ပါတယ်။ Sandbox ဆိုတာ Postman နဲ့ [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) အတွက် JavaScript runtime environment တစ်ခုပါ။

![Collections icon](https://assets.postman.com/postman-docs/Collections.png#icon) Collection တစ်ခုကို သုံးပြီး API scenario အမျိုးမျိုးကို test လုပ်ဖို့ workflows တွေ တည်ဆောက်နိုင်ပြီး — requests အစုတစ်စုအပေါ်မှာ branch ခွဲပြီး loop လုပ်နိုင်ပါတယ်။ ဒီ collection template ကို စမ်းကြည့်ချင်ရင် — [API scenario testing](https://www.postman.com/templates/collections/api-scenario-testing/) ကို ရွေးပါ။

## Scripts တွေကို ပြန်သုံးခြင်း

အသုံးများတဲ့ scripts နဲ့ tests တွေကို ကိုယ့် team ရဲ့ Postman Package Library ထဲက packages တွေထဲ ထည့်နိုင်ပါတယ်။ ဒါက ကိုယ့် team ရဲ့ HTTP, gRPC, GraphQL requests တွေနဲ့ [webhook listeners](https://learning.postman.com/docs/use/send-requests/protocols/webhooks/#scripts) တွေထဲမှာ internal scripts တွေကို ပြန်သုံးနိုင်စေပါတယ်။ [Postman မှာ scripts နဲ့ tests တွေကို ပြန်သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) အကြောင်း လေ့လာပါ။

npm နဲ့ JSR package registries တွေကနေ [external packages တွေကို import လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) နဲ့ — ကိုယ့် team ရဲ့ HTTP, gRPC, GraphQL requests တွေနဲ့ webhook listeners တွေထဲမှာလည်း သုံးနိုင်ပါတယ်။

## Scripts တွေကို debug လုပ်ခြင်း

Debugging scripts တွေကို **Pre-request** tab ဒါမှမဟုတ် **Post-response** tab အောက်မှာ ရေးနိုင်ပါတယ်။ [Postman Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) မှာ debugging messages တွေကို log လုပ်နိုင်ပါတယ်။

## Test ဥပမာများ

Requests, folders နဲ့ collections တွေအတွက် ကိုယ်ပိုင် tests တွေ ရေးဖို့ post-response [script examples](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples/) တွေကို သုံးနိုင်ပါတယ်။ Post-response scripts တွေက — request ပို့လိုက်တဲ့ API ကနေ Postman response တစ်ခု ရရှိတဲ့အခါ run ပါတယ်။ Folder ဒါမှမဟုတ် collection တစ်ခုထဲကို tests တွေ ထည့်လိုက်ရင် — အဲဒီထဲက request တစ်ခုစီ ပြီးနောက် run ပါတယ်။

## Dynamic variables

Postman က random names, addresses, email addresses စတဲ့ sample data တွေ ထုတ်ဖို့ [Faker](https://www.npmjs.com/package/@faker-js/faker) library ကို သုံးပါတယ်။ ဒီ predefined variables တွေကို သုံးပြီး request တစ်ခုစီအတွက် တန်ဖိုးအမျိုးမျိုး ပြန်ပေးနိုင်ပါတယ်။ [Dynamic variables တွေ သုံးနည်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/variables-list/) အကြောင်း လေ့လာပါ။

## Postman JavaScript APIs

Postman က ကိုယ့်ရဲ့ request scripts တွေနဲ့ webhooks တွေထဲမှာ သုံးလို့ရတဲ့ [JavaScript APIs](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) တွေ ပေးပါတယ်။ `pm` object က request နဲ့ response data တွေကို test လုပ်ဖို့ functionality တွေ ပေးပါတယ်။
