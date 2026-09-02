---
title: "API Requests များမှာ Parameters နဲ့ Body Data ပို့ခြင်း"
description: "Postman မှာ request တွေနဲ့အတူ query/path parameters တွေ ထည့်ခြင်း၊ body data types (form-data, urlencoded, raw, binary, GraphQL) အမျိုးမျိုး ပို့ခြင်း"
order: 15
source: "https://learning.postman.com/docs/use/send-requests/create-requests/parameters/"
status: translated
updated: 2026-09-02
---

Postman API client က HTTP requests တွေနဲ့အတူ data တွေ ပို့နိုင်အောင် လုပ်ပေးပါတယ်။ Request တစ်ခုမှာ query parameters (request URL ရဲ့ အဆုံးမှာ key-value အတွဲတွေအနေနဲ့ ပေါင်းထည့်တဲ့ parameters) နဲ့ path parameters (URL ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ပါဝင်တဲ့ parameters) တွေကို ထည့်ပြီး သူတို့ရဲ့ တန်ဖိုးတွေကို သတ်မှတ်နိုင်ပါတယ်။ Form data, URL-encoded, raw နဲ့ binary အပါအဝင် — format အမျိုးမျိုးနဲ့ body data တွေကိုလည်း request တစ်ခုမှာ ထည့်နိုင်ပါတယ်။

## Request parameters ပို့ခြင်း

Request တစ်ခုအတွက် path နဲ့ query parameters တွေကို URL box ဒါမှမဟုတ် **Params** tab ကနေ သတ်မှတ်နိုင်ပါတယ်။

- Query parameters တွေက request URL ရဲ့ အဆုံးမှာ `?` ရဲ့ နောက်ကို ပေါင်းထည့်ပြီး — key-value အတွဲတွေကို `&` နဲ့ ခြားပြီး ဖော်ပြပါတယ် — `?id=1&type=new` လိုမျိုးပါ။
- Path parameters တွေက request URL ရဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်ပြီး — `:` ရှေ့ကချထားတဲ့ placeholders (နေရာခံ အမှတ်အသားများ) တွေနဲ့ ရည်ညွှန်းပါတယ် — `/customer/:id` လိုမျိုးပါ။

Query parameter တစ်ခု သတ်မှတ်ချင်ရင် URL ထဲကို တိုက်ရိုက် ထည့်လို့ရသလို — **Params** tab ကို ရွေးပြီး name နဲ့ value ကိုလည်း ထည့်နိုင်ပါတယ်။ Query parameters တွေကို URL ထဲမှာ ဖြစ်ဖြစ် **Params** tab ထဲမှာ ဖြစ်ဖြစ် ထည့်လိုက်တာနဲ့ — အဲဒီ တန်ဖိုးတွေက Postman ထဲမှာ သုံးနေတဲ့ နေရာတိုင်းမှာ update ဖြစ်သွားပါတယ်။

Parameters တွေကို URL-encode လုပ်ပေးတာ အလိုအလျောက် မဟုတ်ပါဘူး။ Parameter value တစ်ခုကို ကိုယ်တိုင် encode လုပ်ချင်ရင် — ရွေးထားတဲ့ text ပေါ်မှာ right-click နှိပ်ပြီး **EncodeURIComponent** ကို ရွေးပါ။

Path parameter တစ်ခု သတ်မှတ်ချင်ရင် URL box ထဲမှာ colon (`:`) ရဲ့ နောက်မှာ parameter name ကို ရိုက်ထည့်ပါ — `:id` လိုမျိုးပါ။ Path parameter ထည့်ချင်ရင် ဒါမှမဟုတ် တည်းဖြတ်ချင်ရင် **Params** tab ကို နှိပ်ပါ ဒါမှမဟုတ် URL ထဲက path ပေါ်မှာ hover လုပ်ကြည့်ပါ။

Parameters တွေကို description တွေနဲ့အတူ ထည့်နိုင်ပါတယ် — request ကို share လုပ်တဲ့သူတွေ (ဥပမာ — ကိုယ့် workspace ထဲမှာ) ဒါမှမဟုတ် ကိုယ့် API documentation ကို ကြည့်တဲ့သူတွေဆီမှာ အဲဒီ description တွေ ပေါ်လာပါမယ်။

Parameters တွေ ထည့်ပြီးတာနဲ့ **Send** ကို နှိပ်ပြီး request ကို ပို့လိုက်ပါ။ [Postman မှာ requests တွေ ဖန်တီး ပို့ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/request-basics/) အကြောင်း ဆက်လေ့လာနိုင်ပါတယ်။

Request builder ကို မသုံးဘဲ parameters တွေကို plain text နဲ့ ရိုက်ထည့်ချင်တယ်ဆိုရင်တော့ **Bulk Edit** option ကို သုံးနိုင်ပါတယ်။

## Request body data ပို့ခြင်း

Structured data (ဖွဲ့စည်းပုံရှိတဲ့ data) အသစ် ထည့်ချင်တဲ့အခါ ဒါမှမဟုတ် update လုပ်ချင်တဲ့အခါ — requests တွေနဲ့အတူ body data ပို့ဖို့ လိုအပ်ပါတယ်။ ဥပမာ — database တစ်ခုထဲ customer အသစ်တစ်ယောက် ထည့်ဖို့ request ပို့နေတယ်ဆိုရင် customer ရဲ့ အချက်အလက်တွေကို JSON အနေနဲ့ ထည့်သွင်းနိုင်ပါတယ်။ Body data ကို အများအားဖြင့် `PUT`, `POST` နဲ့ `PATCH` requests တွေမှာ သုံးပါတယ်။

**Body** tab က request နဲ့အတူ ပို့ချင်တဲ့ data ကို သတ်မှတ်နိုင်အောင် လုပ်ပေးပါတယ်။ ကိုယ့် API နဲ့ ကိုက်ညီတဲ့ body data type အမျိုးမျိုးကို ပို့နိုင်ပါတယ်။

Body data ပို့မယ်ဆိုရင် — API က လက်ခံရရှိတဲ့ data ရဲ့ content type ကို သိနိုင်ဖို့ [မှန်ကန်တဲ့ headers တွေ](https://learning.postman.com/docs/use/send-requests/create-requests/headers/) ရွေးထားဖို့ သေချာပါစေ။

- `form-data` နဲ့ `urlencoded` body types တွေအတွက် — Postman က မှန်ကန်တဲ့ `Content-Type` header ကို အလိုအလျောက် တွဲပေးပါတယ်။
- Body data အတွက် raw mode သုံးရင် — Postman က ကိုယ်ရွေးထားတဲ့ type (text ဒါမှမဟုတ် json စသဖြင့်) ပေါ် မူတည်ပြီး header တစ်ခု သတ်မှတ်ပေးပါတယ်။
- `Content-Type` header ကို ကိုယ်တိုင် ရွေးထားရင် — အဲဒီ value က Postman သတ်မှတ်ပေးတာထက် ဦးစားပေး အသုံးပြုပါတယ်။
- Binary body type အတွက်တော့ Postman က header type တစ်ခုမှ သတ်မှတ်ပေးမှာ မဟုတ်ပါဘူး။

ပုံမှန်အားဖြင့် Postman က body data အတွက် **none** ကို ရွေးထားပေးပါတယ်။ Request နဲ့အတူ body ပို့စရာ မလိုဘူးဆိုရင် အဲဒီအတိုင်း ထားလိုက်ပါ။ လိုအပ်ရင်တော့ request body အတွက် ကိုယ်လိုအပ်တဲ့ data type ကို ရွေးလိုက်ပါ — [form data](#form-data), [URL-encoded](#url-encoded), [raw](#raw-data), [binary](#binary-data) ဒါမှမဟုတ် [GraphQL](#graphql)။

Body data တွေ ထည့်ပြီးတာနဲ့ **Send** ကို နှိပ်ပြီး request ကို ပို့လိုက်ပါ။ [Postman မှာ requests တွေ ဖန်တီး ပို့ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/request-basics/) အကြောင်း ဆက်လေ့လာနိုင်ပါတယ်။

### Form data

Website forms တွေက data တွေကို `multipart/form-data` အနေနဲ့ APIs တွေဆီ ပို့လေ့ရှိပါတယ်။ Request ရဲ့ **Body** tab ထဲက `form-data` option ကို သုံးပြီး Postman မှာ အဲဒီပုံစံအတိုင်း ပြန်လုပ်နိုင်ပါတယ်။ Form data နဲ့ key-value အတွဲတွေ ပို့နိုင်ပြီး — content type ကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

Form data သုံးပြီး file တစ်ခုကိုလည်း request နဲ့အတူ တွဲပို့နိုင်ပါတယ်။ Key name ဘေးက dropdown list ထဲမှာ **File** ကို ရွေးပြီး — ပို့ချင်တဲ့ file ကို ရွေးပါ။ ကိုယ့် local system ကနေ file ရွေးနိုင်ပြီး — Postman က file path ကို request ထဲမှာ သိမ်းပေးပါတယ်။ အဲဒီ file path က ကိုယ့် local [working directory](https://learning.postman.com/docs/getting-started/installation/settings/working-directory/) နဲ့ ဆက်စပ် (relative) ပြီး သိမ်းထားတာ ဖြစ်ပါတယ်။

Test data ပါတဲ့ file တစ်ခုကို ကိုယ့် Postman team ထဲကိုလည်း upload လုပ်နိုင်ပါတယ်။ Request ကို team ထဲက တခြားသူတွေနဲ့ share လုပ်ချင်တဲ့အခါ ဒါမှမဟုတ် — monitor ဒါမှမဟုတ် scheduled collection run တစ်ခုမှာ အဲဒီ request ကို သုံးချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ [Shared requests တွေနဲ့ cloud runs တွေအတွက် files တွေ upload လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/test-data/) အကြောင်း ဆက်လေ့လာနိုင်ပါတယ်။

### URL-encoded

URL-encoded data က URL parameters တွေလိုပဲ encoding (ပို့လို့ရအောင် စာလုံးတွေကို ပြောင်းလဲခြင်း) ကို သုံးပါတယ်။ ကိုယ့် API က URL-encoded data လိုအပ်တယ်ဆိုရင် request ရဲ့ **Body** tab ထဲမှာ `x-www-form-urlencoded` ကို ရွေးပါ။ Request နဲ့အတူ ပို့ချင်တဲ့ key-value အတွဲတွေကို ထည့်လိုက်ရင် — Postman က မပို့ခင် encode လုပ်ပေးပါတယ်။

Form data နဲ့ URL-encoded ကြားမှာ တစ်ခါတလေ ရှုပ်ထွေးမှု ရှိတတ်ပါတယ်။ ဘယ်ဟာကို သုံးရမလဲ မသေချာရင် — ကိုယ့် API provider ကို မေးကြည့်ပါ။

### Raw data

Raw body data ကို သုံးပြီး text အနေနဲ့ ရိုက်ထည့်လို့ရတဲ့ ဘာကိုမဆို ပို့နိုင်ပါတယ်။ Request ရဲ့ **Body** tab ထဲမှာ **raw** option ကို ရွေးပြီး — data ရဲ့ format (**Text**, **JavaScript**, **JSON**, **HTML**, ဒါမှမဟုတ် **XML**) ကို dropdown list ကနေ ရွေးချယ် ဖော်ပြပါ။ Postman က syntax highlighting (code တွေကို အရောင်ခွဲပြခြင်း) လုပ်ပေးပြီး — သက်ဆိုင်ရာ headers တွေကိုလည်း request ထဲ ထည့်ပေးပါတယ်။

Postman က အလိုအလျောက် ပို့ပေးတဲ့ header ကို override လုပ်ဖို့ လိုအပ်ရင် — [content type header တစ်ခုကို ကိုယ်တိုင် သတ်မှတ်နိုင်ပါတယ်](https://learning.postman.com/docs/use/send-requests/create-requests/headers/)။

Body data ထဲမှာ [variables တွေကို သုံးနိုင်ပြီး](/docs/postman/variables) — Postman က request ပို့တဲ့အခါ သူတို့ရဲ့ တန်ဖိုးတွေကို ဖြည့်ပေးပါတယ်။ ဒါမှာ [variable တစ်ခုထဲမှာ လုံခြုံစွာ သိမ်းထားတဲ့ vault secrets တွေ](https://learning.postman.com/docs/use/postman-vault/use-vault-secrets#use-vault-secrets-in-requests) လည်း ပါဝင်ပါတယ်။

Body data ထဲမှာ [scope မရှိတဲ့ variables တွေကို သုံးလို့ရသလို](https://learning.postman.com/docs/use/send-requests/variables/define-variables/#set-values-for-variables-without-a-scope) — [vault secrets တွေကို local မှာ စမ်းသုံးကြည့်လို့လည်း ရပါတယ်](https://learning.postman.com/docs/use/postman-vault/use-vault-secrets#try-a-vault-secret-in-a-request)။ ဒီနည်းတွေက တန်ဖိုးတစ်ခုဟာ မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်ဖြစ်၊ မဖြစ် စမ်းသပ်ကြည့်နိုင်အောင် ကူညီပေးပါတယ်။

JSON raw body data ထဲမှာ comments တွေ ထည့်လို့ရပြီး — request ပို့တဲ့အခါ အဲဒီ comments တွေကို ဖယ်ရှားပေးပါတယ်။ `//` နဲ့ စတင်တဲ့ single-line comments တွေနဲ့ `/* */` နဲ့ ပိုင်းခြားထားတဲ့ multi-line comments တွေကို request ထဲကနေ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။

XML ဒါမှမဟုတ် JSON ကို လှပ စနစ်ကျအောင် (beautify) လုပ်ချင်ရင် — editor ထဲက text ကို ရွေးပြီး **⌘+Option+B** ဒါမှမဟုတ် **Ctrl+Alt+B** ကို နှိပ်ပါ။

### Binary data

Postman editor ထဲမှာ လက်နဲ့ ရိုက်ထည့်လို့ မရတဲ့ data တွေ — ဥပမာ image, audio နဲ့ video files တွေကို request body နဲ့အတူ binary data အနေနဲ့ ပို့နိုင်ပါတယ်။ (Text files တွေကိုလည်း ပို့လို့ရပါတယ်။)

Request ရဲ့ **Body** tab ထဲမှာ **binary** option ကို ရွေးပြီး — request နဲ့အတူ ပို့ချင်တဲ့ file ကို ရွေးပါ။ ကိုယ့် local system ကနေ file ရွေးနိုင်ပြီး — Postman က file path ကို request ထဲမှာ သိမ်းပေးပါတယ်။ အဲဒီ file path က ကိုယ့် local [working directory](https://learning.postman.com/docs/getting-started/installation/settings/working-directory/) နဲ့ ဆက်စပ် (relative) ပြီး သိမ်းထားတာ ဖြစ်ပါတယ်။

Test data ပါတဲ့ file တစ်ခုကို ကိုယ့် Postman team ထဲကိုလည်း upload လုပ်နိုင်ပါတယ်။ Request ကို team ထဲက တခြားသူတွေနဲ့ share လုပ်ချင်တဲ့အခါ ဒါမှမဟုတ် — monitor ဒါမှမဟုတ် scheduled collection run တစ်ခုမှာ အဲဒီ request ကို သုံးချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ [Shared requests တွေနဲ့ cloud runs တွေအတွက် files တွေ upload လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/create-requests/test-data/) အကြောင်း ဆက်လေ့လာနိုင်ပါတယ်။

### GraphQL

Request ရဲ့ **Body** tab ထဲက **GraphQL** option ကို ရွေးပြီး — Postman requests တွေနဲ့အတူ GraphQL queries တွေ ပို့နိုင်ပါတယ်။ **Query** pane ထဲမှာ ကိုယ့် code ကို ရိုက်ထည့်ပြီး — **GraphQL Variables** pane ထဲမှာ variables တွေ ထည့်ပါ။

GraphQL အကြောင်း ပိုမို သိရှိလိုပါက — Postman API schemas တွေကို အခြေခံတဲ့ **Autocomplete** ကို ဘယ်လို ဖွင့်ရမလဲ အပါအဝင် — [Postman မှာ GraphQL](https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-overview/) ကို ကြည့်ပါ။
