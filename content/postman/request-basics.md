---
title: "Request အခြေခံများ (Request Basics)"
description: "Postman API client နဲ့ HTTP request တွေ ဖန်တီး ပို့နည်း — request URL နဲ့ method သတ်မှတ်ခြင်း၊ request ပို့ခြင်း၊ requests တွေ ပြန်သုံးခြင်းနဲ့ share လုပ်ခြင်း"
order: 14
source: "https://learning.postman.com/docs/use/send-requests/create-requests/request-basics/"
status: translated
updated: 2026-09-02
---

Postman က protocol (ဆက်သွယ်ရေး စည်းမျဉ်း) အမျိုးမျိုးနဲ့ requests တွေ ပို့တာကို ထောက်ပံ့ပါတယ် — HTTP, [GraphQL](https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-overview/), [gRPC](https://learning.postman.com/docs/use/send-requests/protocols/grpc/grpc-client-overview/), [WebSocket](https://learning.postman.com/docs/use/send-requests/protocols/websocket/websocket-overview/), [MQTT](https://learning.postman.com/docs/use/send-requests/protocols/mqtt-client/mqtt-client-overview/) တို့ ပါဝင်ပါတယ်။ AI ကို အခြေခံတဲ့ development အတွက်လည်း — [collections တွေထဲက AI requests](https://learning.postman.com/docs/use/send-requests/protocols/ai-requests/overview/) နဲ့ [Postman Flows ထဲက AI Request blocks](https://learning.postman.com/docs/flows/build-flows/ai/ai-request-blocks/overview/) တွေကို Postman က ထောက်ပံ့ပါတယ်။ Postman ကို Model Context Protocol (MCP) client အဖြစ်လည်း သုံးပြီး — [MCP servers တွေဆီ requests တွေ ပို့နိုင်ပါတယ်](https://learning.postman.com/docs/use/send-requests/protocols/mcp-requests/overview/)။

Request အသစ်တစ်ခုကို စတင်ဖို့ — request type (request အမျိုးအစား) ကို သတ်မှတ်ပြီး — အသေးစိတ်တွေ ဖြည့်ပြီးနောက် **Send** ကို နှိပ်ကာ request ကို စမ်းသပ်နိုင်ပါတယ်။ Request ကို သိမ်းပြီးတာနဲ့ — team နဲ့ မျှဝေနိုင်ပါတယ်။ ဒါ့အပြင် — သင်စမ်းသပ်နေတဲ့ ဒါမှမဟုတ် integrate လုပ်နေတဲ့ APIs တွေအတွက် — publicly maintained workspaces တွေကနေ requests တွေကိုလည်း ကိုးကား သုံးနိုင်ပါတယ်။

ဒီ topic က အဓိကအားဖြင့် HTTP requests တွေကို ဖန်တီးခြင်းနဲ့ မျှဝေခြင်းအကြောင်း ဖော်ပြပါတယ်။ တခြား protocols တွေနဲ့ requests ပို့တာရဲ့ အသေးစိတ်အတွက် — အပေါ်က link တွေကို လိုက်ကြည့်နိုင်ပါတယ်။

## Request အသစ်တစ်ခု ဖန်တီးခြင်း

ကိုယ့် request တွေထဲမှာ — Postman က သင်အလုပ်လုပ်နေတဲ့ API ဆီ ပို့မယ့် data ကို သတ်မှတ်ပေးတဲ့ အသေးစိတ်အချက်အလက်တွေ အများကြီး ပါဝင်နိုင်ပါတယ်။ Request type ပေါ် မူတည်ပြီး — URL တစ်ခု ရိုက်ထည့်ပြီး method (HTTP, GraphQL, gRPC, WebSocket, Socket.IO ဒါမှမဟုတ် MQTT request) တစ်ခု ရွေးချယ်ရပါတယ်။ AI request ဆိုရင် model တစ်ခု ရွေးရပြီး — MCP request ဆိုရင် command တစ်ခု ရိုက်ထည့်ရပါတယ်။ ပြီးရင် request ထဲမှာ တခြား အသေးစိတ်တွေကိုပါ သတ်မှတ်နိုင်ပါတယ်။

HTTP request တစ်ခု ဖန်တီးဖို့:

1. အောက်ပါနည်းတွေထဲက တစ်နည်းနည်းနဲ့ HTTP request တစ်ခု ဖန်တီးပါ:

   * ဘယ်ဘက် sidebar ထဲက **Add** icon (**+**) ကို နှိပ်ပြီး request type အဖြစ် **HTTP** ကို ရွေးပါ။
   * Workbench ထဲမှာ **Create new request** ကို နှိပ်ပါ။ Request icon ကို နှိပ်ပြီး request type အဖြစ် **HTTP** ကို ရွေးပါ။
   * HTTP collection တစ်ခု ရှိပြီးသားဆိုရင် — sidebar ထဲက collection တစ်ခုရဲ့ ဘေးက **Add request** ကို နှိပ်ပါ။

2. [Request URL](#request-urls-သတ်မှတ်ခြင်း) ကို ရိုက်ထည့်ပြီး [request method](#request-methods-ရွေးချယ်ခြင်း) ကို ရွေးချယ်ပါ။

3. Authorization, parameters, body data နဲ့ headers စတဲ့ တန်ဖိုးတွေကို သတ်မှတ်ပါ။

4. Request ကို သိမ်းဖို့ **Save** ကို နှိပ်ပါ။ Request ကို နာမည်နဲ့ ဖော်ပြချက် (description) ပေးနိုင်ပါတယ်။ မရှိသေးဘူးဆိုရင် — [collection](https://learning.postman.com/docs/use/send-requests/create-requests/intro-to-collections/) တစ်ခုကို ရွေးပါ ဒါမှမဟုတ် အသစ် ဖန်တီးပြီး အဲဒီထဲမှာ သိမ်းနိုင်ပါတယ်။ Request ကို သိမ်းပြီးတာနဲ့ — request ရဲ့ protocol ကို နောက်ထပ် ပြောင်းလို့ မရတော့ပါဘူး။

Requests တွေမှာ ကိုယ့် ပြောင်းလဲမှုတွေကို အလိုအလျောက် သိမ်းပေးဖို့ autosave ကို ဖွင့်ထားနိုင်ပါတယ်။ [Autosave အကြောင်း ပိုလေ့လာရန်](https://learning.postman.com/docs/getting-started/installation/settings/general-settings#application)။

Postman မှာ request ပို့တာကို စမ်းကြည့်ချင်ရင် — URL ကို [Postman Echo](https://learning.postman.com/docs/reference/developer-resources/echo-api/) ရဲ့ `https://postman-echo.com/get` endpoint ဆီ ထားပြီး — GET method ကို ရွေးကာ — **Send** ကို နှိပ်ပါ။ ဒီပုံမှာ မြင်ရတဲ့အတိုင်း — request tab အသစ်တစ်ခုမှာ method dropdown က **GET** ဖြစ်ပြီး URL box ထဲမှာ `https://postman-echo.com/get` ဆိုပြီး ထည့်ထားပါတယ်။ **Send** နှိပ်လိုက်တဲ့အခါ — အောက်က **Response** pane ထဲမှာ server ရဲ့ response (`200 OK` status နဲ့ JSON body) ကို မြင်ရပါတယ်။

### Request URLs သတ်မှတ်ခြင်း

Postman မှာ သင်ပို့တဲ့ request အများစုက — သင်အလုပ်လုပ်နေတဲ့ API endpoint ကို ကိုယ်စားပြုတဲ့ URL တစ်ခု လိုအပ်ပါတယ်။ API တစ်ခုနဲ့ လုပ်လို့ရတဲ့ operation တစ်ခုစီဟာ ပုံမှန်အားဖြင့် endpoint တစ်ခုနဲ့ ဆက်စပ်နေပြီး — API ထဲက endpoint တစ်ခုစီကို တိကျတဲ့ URL တစ်ခုမှာ ရနိုင်ပါတယ်။ ဒါဟာ — API ကို ဝင်ရောက်ဖို့ Postman ထဲမှာ သင်ရိုက်ထည့်ရတဲ့ အရာပါ။

* API တစ်ခုကို ကိုယ်တိုင် build လုပ်နေတယ်ဆိုရင် — URL က ပုံမှန်အားဖြင့် base location နဲ့ path ပေါင်းထားတာပါ။ ဥပမာ — `https://postman-echo.com/get` request မှာ `https://postman-echo.com` က base URL ဖြစ်ပြီး `/get` က endpoint path ပါ။
* Public API တစ်ခုကို သုံးနေတယ်ဆိုရင် — API provider က လိုအပ်တဲ့ URLs တွေကို ပေးပါတယ်။ အများအားဖြင့် သူတို့ရဲ့ developer documentation တွေထဲမှာ တွေ့ရပါတယ်။

URL box ထဲမှာ စရိုက်လိုက်တာနဲ့ — Postman က လက်ရှိ workspace ထဲမှာ သင်အရင်က သုံးဖူးတဲ့ requests တွေရဲ့ dropdown list တစ်ခု ပြပေးပါတယ်။ လက်ရှိ workspace ထဲက collections တွေထဲမှာ သုံးထားတဲ့ requests တွေလည်း အဲဒီ list ထဲမှာ ပါပါတယ်။ Suggestions list ထဲက request တစ်ခုကို ရွေးလိုက်ရင် — parameters နဲ့ authorization စတဲ့ အသေးစိတ်တွေပါ request ထဲကို autofill ဖြစ်သွားပါတယ်။

[Verified team](https://learning.postman.com/docs/postman-api-network/explore/consume/#choose-public-elements) တစ်ခုရဲ့ public API ကို သုံးနေတယ်ဆိုရင် — `https://api.getpostman.com` လိုမျိုး base URL ရိုက်ပြီးတာနဲ့ URL box ထဲမှာ suggestions တွေ ပေါ်လာပါတယ်။ Suggested endpoint တစ်ခုကို နှိပ်လိုက်ရင် — parameters နဲ့ authorization စတဲ့ စတင်ဖို့ လိုအပ်တာတွေပါတဲ့ template တစ်ခုနဲ့ request ကို autofill လုပ်ပေးပါတယ်။ API publisher က variable တစ်ခုအတွက် တန်ဖိုး မသတ်မှတ်ထားဘူးဆိုရင် — ကိုယ့် request ထဲမှာ empty variable (တန်ဖိုးမရှိသေးတဲ့ variable) တစ်ခု autofill ဖြစ်သွားနိုင်ပါတယ်။ [Empty variable တစ်ခုအတွက် တန်ဖိုး သတ်မှတ်နည်း](https://learning.postman.com/docs/use/send-requests/variables/define-variables/#set-values-for-variables-without-a-scope) ကို လေ့လာနိုင်ပါတယ်။

URL ထဲမှာ protocol (ဥပမာ `http://`) မထည့်ထားဘူးဆိုရင် — Postman က URL ရဲ့ အစမှာ `http://` ကို အလိုအလျောက် ပေါင်းထည့်ပေးပါတယ်။

*Query* parameters တွေကို URL box ထဲမှာ ရိုက်ထည့်နိုင်သလို — **Params** tab ထဲမှာလည်း ထည့်နိုင်ပါတယ်။ Request မှာ *path* parameters တွေ သုံးနေတယ်ဆိုရင် — URL box ထဲမှာ ရိုက်ထည့်နိုင်ပါတယ်။ [API requests တွေနဲ့ parameters နဲ့ body data ပို့ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/parameters/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

ကိုယ့် requests တွေမှာ [next generation URL encoding](https://learning.postman.com/docs/use/send-requests/create-requests/request-settings/#encode-your-request-urls) ကိုလည်း သုံးနိုင်ပါတယ်။

### Request methods ရွေးချယ်ခြင်း

Request အသစ်တစ်ခုအတွက် Postman က GET method ကို default အနေနဲ့ ရွေးပေးထားပါတယ်။ GET methods တွေက ပုံမှန်အားဖြင့် API တစ်ခုကနေ data တွေ ရယူဖို့ သုံးပါတယ်။ API ဆီ data ပို့ဖို့ တခြား methods တွေကိုလည်း အများကြီး သုံးနိုင်ပါတယ်:

* **POST** — data အသစ် ထည့်ခြင်း။
* **PUT** — ရှိပြီးသား data ကို အစားထိုးခြင်း။
* **PATCH** — ရှိပြီးသား data fields တွေကို update လုပ်ခြင်း။
* **DELETE** — ရှိပြီးသား data ကို ဖျက်ခြင်း။

ဥပမာ — to-do list application တစ်ခုရဲ့ API နဲ့ အလုပ်လုပ်နေတယ်ဆိုရင် — လက်ရှိ task list ကို ရဖို့ GET method ကို သုံးနိုင်ပါတယ်။ Task အသစ်တစ်ခု ဖန်တီးဖို့ POST method ကို သုံးနိုင်သလို — ရှိပြီးသား task တစ်ခုကို တည်းဖြတ်ဖို့ PUT ဒါမှမဟုတ် PATCH method ကို သုံးနိုင်ပါတယ်။

Postman က နောက်ထပ် request methods တွေကိုလည်း default အနေနဲ့ အများအပြား ထောက်ပံ့ပေးပြီး — custom methods တွေလည်း သုံးလို့ရပါတယ်။ Method dropdown list ကို နှိပ်ပြီး — method နာမည်ကို တည်းဖြတ်ကာ ကိုယ့် method အသစ်ကို သိမ်းနိုင်ပါတယ်။ Method တစ်ခုကို ဖျက်ချင်ရင် — list ထဲမှာ အဲဒီ method အပေါ် hover လုပ်ပြီး delete icon ကို နှိပ်ပါ။

နေရာတစ်ခုတည်း (တစ်ခါတစ်ရံ *route* လို့ ခေါ်ပါတယ်) မှာ — method အမျိုးမျိုးကို လက်ခံတာကြောင့် endpoint တစ်ခုထက်ပိုပြီး ရှိနိုင်ပါတယ်။ ဥပမာ — API တစ်ခုမှာ customer အသစ်တစ်ယောက် ထည့်ဖို့ POST `/customer` endpoint တစ်ခုနဲ့ — ရှိပြီးသား customer တစ်ယောက်ကို ရယူဖို့ GET `/customer` endpoint တစ်ခု ရှိနိုင်ပါတယ်။

## Request ပို့ခြင်း

Request ရဲ့ protocol, method နဲ့ URL ကို သတ်မှတ်ပြီးတာနဲ့ — request ပို့မယ့် API က လိုအပ်တဲ့ တခြား အသေးစိတ်တွေ ထပ်ဖြည့်ပါ:

* Request နဲ့အတူ ပို့ဖို့လိုတဲ့ [parameters နဲ့ body data](https://learning.postman.com/docs/use/send-requests/create-requests/parameters/) တွေ ဒါမှမဟုတ် [headers](https://learning.postman.com/docs/use/send-requests/create-requests/headers/) တွေကို သတ်မှတ်ပါ။
* လိုအပ်တဲ့ [authentication နဲ့ authorization](/docs/postman/authorization) တွေကို configure လုပ်ပါ။
* **Send** အောက်က **Cookies** ကို နှိပ်ပြီး — [ကိုယ့် requests တွေမှာ cookies တွေ သုံးနိုင်ပါတယ်](https://learning.postman.com/docs/use/send-requests/response-data/cookies/)။

Password တွေ၊ API keys တွေလိုမျိုး ထိခိုက်နိုင်တဲ့ (sensitive) data တွေကို — requests တွေထဲမှာ တိုက်ရိုက် ရိုက်ထည့်မယ့်အစား [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets) ထဲမှာ သိမ်းထားဖို့ Postman က အကြံပြုပါတယ်။ ဒါဆိုရင် requests တွေထဲမှာ secure variables တွေ သုံးနိုင်ပြီး — sensitive data တွေ ပေါ်ထွက်မလာစေဖို့ ရှောင်ရှားနိုင်ပါတယ်။

Request အသေးစိတ်တွေ အားလုံး ဖြည့်ပြီးတာနဲ့ — request ကို API server ဆီ ပို့ဖို့ **Send** ကို နှိပ်ပါ။

Server ရဲ့ response ကို response pane ထဲမှာ ကြည့်နိုင်ပါတယ်။ Response ကို နားလည်ဖို့ — [တိကျတဲ့ စကားစုတွေ ရှာတာ](https://learning.postman.com/docs/use/send-requests/response-data/responses/#search) ဒါမှမဟုတ် JSONPath နဲ့ XPath သုံးပြီး [သက်ဆိုင်တဲ့ အချက်အလက်တွေကို filter လုပ်တာ](https://learning.postman.com/docs/use/send-requests/response-data/responses/#filter) လိုမျိုး tools တွေကို အဲဒီမှာ သုံးနိုင်ပါတယ်။ [Postman မှာ API response တွေရဲ့ တည်ဆောက်ပုံ](https://learning.postman.com/docs/use/send-requests/response-data/responses/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Sidebar ထဲက **History** မှာ — သင်ပို့ခဲ့ဖူးတဲ့ requests တွေကို ကြည့်ပြီး နောက်တစ်ကြိမ် ပြန်ပို့နိုင်ပါတယ်။ Requests တွေကို [collection](https://learning.postman.com/docs/use/send-requests/create-requests/intro-to-collections/) တစ်ခုထဲမှာ သိမ်းပြီး စနစ်တကျ ထားနိုင်ပါတယ်။

## Requests တွေကို ပြန်သုံးခြင်း

အလုပ် ထပ်ခါထပ်ခါ လုပ်နေရတာကို ရှောင်ဖို့ — workspace ထဲက တခြား collections တွေကနေ ပြန်သုံးလို့ရတဲ့ requests တွေနဲ့ collections တွေကို တည်ဆောက်နိုင်ပါတယ်။ Workspace တစ်ခုတည်းထဲမှာဆိုရင် — collections တွေကြားမှာ requests တွေကို ပြန်သုံးနိုင်ပါတယ်။ Request နာမည်ဘေးက workbench card မှာ — source request နဲ့ link လုပ်ထားတဲ့ requests တွေကို ပြပေးပါတယ်။

Linked requests တွေက Collection Runner နဲ့ Monitors တွေထဲမှာ အဆင်ပြေချောမွေ့စွာ run ပါတယ်။ Linked requests တွေ ပါတဲ့ collections တွေကို — link တွေ မပျက်ဘဲ fork လုပ်နိုင်ပါတယ်။

Request တစ်ခုကို ပြန်သုံးဖို့:

1. Request ကနေ — request ဘေးက **View more actions** ကို နှိပ်ပြီး **Copy** ကို ရွေးပါ။
2. Collection အသစ်ထဲမှာ — request ဘေးက **View more actions** ကို နှိပ်ပြီး **Paste > Paste** ဒါမှမဟုတ် **Paste > Paste linked copy** ကို ရွေးပါ။

Request တစ်ခုကို copy တစ်ခုအနေနဲ့ ပြန်သုံးဖို့ **⌘+Drag** (macOS) ဒါမှမဟုတ် **Ctrl+Drag** (Windows/Linux) ကိုလည်း သုံးနိုင်ပါတယ်။

Source ကနေ API blueprint နဲ့ permissions တွေကို ထိန်းသိမ်းထားဖို့ — linked copy ကို အပြည့်အဝ edit လုပ်လို့တော့ မရပါဘူး။ ဒါပေမယ့် Enterprise plans တွေမှာ — ကိုယ့် custom use cases တွေအတွက် name, query parameters, body နဲ့ scripts တွေကိုတော့ ပြောင်းလဲနိုင်ပါတယ်။

## Requests တွေကို share လုပ်ခြင်း

Requests တွေကို ပူးပေါင်းလုပ်ဆောင်သူတွေနဲ့ share လုပ်ဖို့:

1. Request ကနေ — ညာဘက်အပေါ်ထောင့်က **Share** ကို နှိပ်ပါ။
2. Users တွေ ထည့်ပြီး သူတို့ရဲ့ access ကို configure လုပ်ပါ။
3. (Optional) Request နဲ့အတူ ထည့်သွင်းဖို့ environment တစ်ခုကို ရွေးပါ။
4. **Invite** ကို နှိပ်ပါ။

Request ဆီ link တစ်ခုကို copy လုပ်ပြီးလည်း share လုပ်နိုင်ပါတယ်။ [Postman မှာ ကိုယ့်အလုပ်တွေကို share လုပ်ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/sharing/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
