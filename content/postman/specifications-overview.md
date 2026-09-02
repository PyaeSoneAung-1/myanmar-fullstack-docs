---
title: "API specifications တွေကို Postman မှာ ဒီဇိုင်းလုပ်ခြင်း (Design API specifications in Postman)"
description: "Spec Hub အသုံးပြုပြီး API-first approach နဲ့ ဖွံ့ဖြိုးတိုးတက်အောင် လုပ်ခြင်း — OpenAPI, AsyncAPI, protobuf, GraphQL, Smithy specifications တွေ ဖန်တီး/import လုပ်ခြင်း, edit, validate, collaborate လုပ်ခြင်း နဲ့ collection generate လုပ်ခြင်း"
order: 53
source: "https://learning.postman.com/docs/design-apis/specifications/overview/"
status: translated
updated: 2026-09-02
---

Postman ရဲ့ *Spec Hub* ကို သုံးပြီး — development မှာ API-first approach ကို ကျင့်သုံးနိုင်ပါတယ်။ OpenAPI, AsyncAPI, protobuf, GraphQL နဲ့ Smithy specifications တွေကို ဖန်တီးနိုင်ပြီး — ရှိပြီးသား specifications တွေကိုလည်း Spec Hub ထဲကို import လုပ်နိုင်ပါတယ်။ Outline view ကို သုံးပြီး navigate လုပ်နိုင်သလို — snippets တွေနဲ့ section အသစ်တွေလည်း ထည့်နိုင်ပါတယ်။ OpenAPI နဲ့ AsyncAPI specifications တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — autocomplete, syntax checking နဲ့ live documentation preview စတဲ့ tools တွေက ကူညီပေးပါတယ်။ OpenAPI specifications တွေအတွက်ဆိုရင် — ကိုယ့် API ရဲ့ တည်ဆောက်ပုံကို မြင်သာစွာ ပြသပြီး OpenAPI specifications တွေရဲ့ ဒီဇိုင်းကို ရိုးရှင်းစေတဲ့ Postman ရဲ့ [Visual editor](https://learning.postman.com/docs/design-apis/specifications/spec-hub-visual-editor/) ကိုလည်း သုံးနိုင်ပါတယ်။

#### [Free specification tools တွေကို စမ်းသုံးကြည့်ပါ — signup မလိုပါဘူး](https://www.postman.com/tools?utm_source=docs\&utm_medium=link\&utm_campaign=signed_out_tools_cta)

Setup အဆင့်တွေ ကျော်ပြီး ကျွန်တော်တို့ရဲ့ free browser tools တွေကို စမ်းသုံးကြည့်နိုင်ပါတယ်: [prompt တစ်ခုကနေ API specification ဒီဇိုင်းလုပ်ခြင်း](https://www.postman.com/tools/api-designer?utm_source=docs\&utm_medium=link\&utm_campaign=signed_out_tools_cta), [OpenAPI specification ဘယ်ဟာကိုမဆို ရိုးရိုးရှင်းရှင်း English နဲ့ ရှင်းပြချက် ရယူခြင်း](https://www.postman.com/tools/understand-your-api?utm_source=docs\&utm_medium=link\&utm_campaign=signed_out_tools_cta), [specification တစ်ခုကို inline မှာ edit, lint လုပ်ပြီး visualize လုပ်ခြင်း](https://www.postman.com/tools/openapi-editor-and-visualizer?utm_source=docs\&utm_medium=link\&utm_campaign=signed_out_tools_cta), [specification တစ်ခုကို validate လုပ်ခြင်း, ၎င်းရဲ့ ဒီဇိုင်းကို အမှတ်ပေးခြင်း နဲ့ အဖြစ်များတဲ့ ပြဿနာတွေကို အလိုအလျောက် ပြုပြင်ခြင်း](https://www.postman.com/tools/openapi-validator?utm_source=docs\&utm_medium=link\&utm_campaign=signed_out_tools_cta), ဒါမှမဟုတ် [JSON ကို paste လုပ်ပြီး TypeScript, Python ဒါမှမဟုတ် Go types တွေ ရယူခြင်း](https://www.postman.com/tools/json-to-types?utm_source=docs\&utm_medium=link\&utm_campaign=signed_out_tools_cta) စသဖြင့် သုံးနိုင်ပါတယ်။ အကောင့် မလိုအပ်ပါဘူး။

OpenAPI, AsyncAPI ဒါမှမဟုတ် Smithy specifications တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — ကိုယ့် users တွေနဲ့ မျှဝေဖို့ Postman Collection တစ်ခု generate လုပ်ဖို့ Spec Hub ကို သုံးနိုင်ပါတယ်။ Generated collection ကို ကိုယ့် OpenAPI specification နဲ့အညီ sync လုပ်ထားနိုင်ပါတယ်။ Team members တွေနဲ့ consumers တွေက ဒီ collections တွေကို သုံးပြီး — ကိုယ့် API ကို စူးစမ်း (explore) လုပ်နိုင် ဒါမှမဟုတ် test လုပ်နိုင်ပါတယ်။

## ပံ့ပိုးပေးထားတဲ့ specification formats တွေ

Spec Hub မှာ Postman က အောက်ပါ formats တွေကို ပံ့ပိုးပေးပါတယ်:

* OpenAPI 2.0, 3.0 နဲ့ 3.1
* AsyncAPI 2.0 နဲ့ 3.0
* protobuf 2 နဲ့ protobuf 3
* GraphQL
* Smithy 2.0

## Specification တစ်ခုထဲမှာ API ဒီဇိုင်းလုပ်ခြင်း

Spec Hub မှာ — OpenAPI, AsyncAPI, protobuf, GraphQL နဲ့ Smithy specification formats တွေနဲ့ [specification တစ်ခုကို ဖန်တီး](/docs/postman/create-a-specification)နိုင်ပါတယ်။ ကိုယ့် computer ဒါမှမဟုတ် repository တစ်ခုကနေ [specification တစ်ခုကို import လုပ်](/docs/postman/import-a-specification)ပြီး — Spec Hub မှာ ဆက်ပြီး တည်ဆောက်နိုင်ပါတယ်။

Pre-formatted snippets တွေနဲ့ section အသစ်တွေ ထည့်ခြင်း, JSON body တစ်ခုကနေ schema တစ်ခု generate လုပ်ခြင်း ဒါမှမဟုတ် autocomplete suggestions တွေ သုံးခြင်း (OpenAPI နဲ့ AsyncAPI အတွက်ပဲ) တို့နဲ့ — [ကိုယ့် specification ကို တည်းဖြတ်](/docs/postman/edit-a-specification)နိုင်ပါတယ်။ OpenAPI specifications တွေအတွက်ဆိုရင် — YAML ဒါမှမဟုတ် JSON ရေးစရာ မလိုတဲ့ form-based view ဖြစ်တဲ့ [Visual editor](https://learning.postman.com/docs/design-apis/specifications/spec-hub-visual-editor/) နဲ့လည်း interactively တည်းဖြတ်နိုင်ပါတယ်။ ကိုယ့် OpenAPI နဲ့ protobuf specifications တွေကို [files နဲ့ folders အများအပြားအဖြစ် စုစည်း](/docs/postman/add-files-to-a-specification)လို့လည်း ရပါတယ်။ Specification ကို တည်ဆောက်နေတုန်း — Postman က ကိုယ့် team ရဲ့ configure လုပ်ထားတဲ့ rules တွေအပေါ် အခြေခံပြီး [syntax errors နဲ့ API governance ပြဿနာတွေကို ဖော်ထုတ်](/docs/postman/validate-a-specification)ပေးပါတယ် (OpenAPI နဲ့ AsyncAPI အတွက်ပဲ)။

Postman က ကိုယ့် API documentation ရဲ့ [live preview](/docs/postman/view-live-documentation) တစ်ခုကိုလည်း ပြသပေးတာကြောင့် — ကိုယ့် အပြောင်းအလဲတွေကို မြင်သာအောင် ကူညီပေးပါတယ်။

Postman Enterprise plan တစ်ခုမှာ ဆိုရင် — ကိုယ့် team ရဲ့ Component Library ထဲမှာ OpenAPI specifications တွေအတွက် [reusable components တွေ ဖန်တီး](https://learning.postman.com/docs/design-apis/specifications/component-library/)နိုင်ပါတယ်။ ဒါက ကိုယ့် team ကို components တွေကို နေရာတစ်ခုတည်းမှာ ထိန်းသိမ်း, စံသတ်မှတ်နိုင်စေပါတယ်။ Teammates တွေက publish လုပ်ထားတဲ့ components တွေကို သူတို့ရဲ့ specifications တွေမှာ ပြန်သုံးနိုင်ပါတယ်။

## တခြားသူတွေနဲ့ specification ပေါ်မှာ ပူးပေါင်းဆောင်ရွက်ခြင်း

Postman မှာ API specifications တွေကို ကိုယ့် team နဲ့ [ပူးပေါင်းဆောင်ရွက်](/docs/postman/collaborate-with-specifications)နိုင်ပါတယ်။ အကြံပြုချက်တွေ ရယူဖို့, အပြောင်းအလဲတွေ ညှိနှိုင်းဖို့ ဒါမှမဟုတ် တခြားသူတွေကို ပြန်သုံးသပ်ခိုင်းဖို့ — [ကိုယ့် specification ဆီကို link တစ်ခု share လုပ်](/docs/postman/collaborate-with-specifications)နိုင်ပါတယ်။

Postman ရဲ့ [version control](/docs/postman/collaborate-with-specifications) ကို သုံးပြီး — ကိုယ့် specification ကို fork လုပ်ပြီး fork ထဲမှာ အပြောင်းအလဲတွေ လုပ်နိုင်ပါတယ်။ Specification တိုးတက်ပြောင်းလဲလာတာနဲ့အမျှ — [version tags](/docs/postman/collaborate-with-specifications) တွေကို သုံးပြီး iterate လုပ်နိုင်ပါတယ်။ ဘယ်သူက, ဘယ်အချိန်မှာ, specification ရဲ့ ဘယ်နေရာမှာ တည်းဖြတ်မှုတွေ လုပ်ခဲ့လဲ ကြည့်ဖို့ — [changelog ကိုလည်း ကြည့်ရှု](/docs/postman/collaborate-with-specifications)နိုင်ပါတယ်။

Users တွေက Spec Hub ထဲက ကိုယ့် specification မှာ [comments တွေ ထည့်](/docs/postman/collaborate-with-specifications)နိုင်ပြီး — Postman ထဲမှာပဲ ဆွေးနွေး, ပူးပေါင်းဆောင်ရွက်နိုင်တာကြောင့် — စကားဝိုင်းက context ထဲမှာ ရှိနေပြီး တခြား users တွေလည်း မြင်နိုင်ပါတယ်။

## Specification တစ်ခုကနေ collection generate လုပ်ခြင်း

ကိုယ့် API ရဲ့ တည်ဆောက်ပုံကို specification တစ်ခုထဲမှာ ဒီဇိုင်းလုပ်ပြီး test လုပ်ပြီးတာနဲ့ — team members တွေနဲ့ consumers တွေကို မျှဝေဖို့ collection တစ်ခုကို အလိုအလျောက် generate လုပ်နိုင်ပါတယ်။ ကိုယ့် API specification ကနေ collection တစ်ခု generate လုပ်လိုက်ရင် — specification အပေါ် အခြေခံပြီး folders, requests နဲ့ response examples တွေပါတဲ့ collection တစ်ခု ဖန်တီးပေးပါတယ်။

OpenAPI specification တစ်ခုကနေ generate လုပ်ထားတယ်ဆိုရင် — collection နဲ့ ၎င်းရဲ့ specification ကို [sync လုပ်ထား](/docs/postman/generate-collections)နိုင်ပါတယ်။ OpenAPI specification ကို အပြောင်းအလဲတွေ လုပ်တဲ့အခါ — generated collection ကို နောက်ဆုံးအပြောင်းအလဲတွေနဲ့ update လုပ်နိုင်ပါတယ်။

Generated collection ထဲမှာ အပြောင်းအလဲတွေ လုပ်ခဲ့ရင် — collection ရဲ့ အပြောင်းအလဲတွေ ပါဝင်အောင် specification ကိုလည်း update လုပ်နိုင်ပါတယ်။ ဒါက team members တွေနဲ့ consumers တွေ ကိုယ့် API ရဲ့ နောက်ဆုံး iteration ကို စူးစမ်း, test လုပ်ပြီး ပူးပေါင်းဆောင်ရွက်နိုင်စေပါတယ်။

[Specification တစ်ခုကနေ collection generate လုပ်ပြီး sync လုပ်ထားနည်း](/docs/postman/generate-collections) ကို လေ့လာပါ။
