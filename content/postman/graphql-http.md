---
title: "HTTP request တစ်ခုနဲ့ GraphQL call ပြုလုပ်ခြင်း (Make a GraphQL call with an HTTP request)"
description: "Postman ရဲ့ HTTP request interface ကို သုံးပြီး GraphQL queries တွေ ပို့နည်း — GraphQL body type, GraphQL variables, schema import, JSON body, content type header နဲ့ cURL import အထိ"
order: 106
source: "https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-http/"
status: translated
updated: 2026-09-03
---

Postman ရဲ့ [GraphQL client](/docs/postman/graphql-overview) က GraphQL requests တွေ လုပ်ဖို့ အထူးသင့်လျော်ပေမယ့် — Postman ရဲ့ [HTTP request interface](/docs/postman/request-basics) ကို သုံးပြီးလည်း GraphQL requests တွေ ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — legacy systems တွေ ဒါမှမဟုတ် GraphQL ရော non-GraphQL APIs ရော ပါဝင်တဲ့ projects တွေနဲ့ အလုပ်လုပ်ရတာမျိုးမှာ HTTP request interface က ပိုအဆင်ပြေနိုင်ပါတယ်။

## GraphQL အတွက် Postman ရဲ့ HTTP request ကို သုံးခြင်း

Postman မှာ — [HTTP request body ထဲ GraphQL queries တွေ ပို့ခြင်း](#http-request-body-ထဲမှာ-graphql-queries-တွေ-ပို့ခြင်း), [GraphQL variables တွေ သုံးခြင်း](#graphql-variables-တွေ-သုံးခြင်း) နဲ့ [introspection လုပ်ပြီး GraphQL schemas တွေ import လုပ်ခြင်း](#graphql-schemas-တွေ-import-လုပ်ခြင်း) တို့အတွက် built-in support တွေ ပါဝင်ပါတယ်။

### HTTP request body ထဲမှာ GraphQL queries တွေ ပို့ခြင်း

1. ![Add icon](https://assets.postman.com/postman-docs/aether-icons/action-add-stroke.svg#icon) icon ကို နှိပ်ပြီး **HTTP** ကို ရွေးကာ — URL box ထဲမှာ GraphQL endpoint URL တစ်ခု ရိုက်ထည့်ပါ။
2. Request method dropdown list ကနေ **POST** ကို ရွေးပါ။
3. **Body** tab အောက်မှာ **GraphQL** body type ကို ရွေးပါ။
4. **Query** editor ထဲမှာ ကိုယ့် GraphQL query ကို ရိုက်ထည့်ပါ။ Editor က queries နဲ့ variables တွေကို သပ်သပ်စီ ရေးသား, တည်းဖြတ်နိုင်စေပါတယ်။
5. **Send** ကို နှိပ်ပါ။

### GraphQL variables တွေ သုံးခြင်း

1. **GraphQL variables** editor ထဲမှာ ကိုယ့် GraphQL variables တွေကို ရိုက်ထည့်ပါ။
2. **Query** editor ထဲမှာ — ကိုယ့် query ထဲက GraphQL variable ကို declare (ကြေညာ) လုပ်ပါ။ GraphQL variables တွေ ဘယ်လို သုံးရမလဲဆိုတဲ့ အချက်အလက်တွေ ပိုရဖို့ — [GraphQL variables documentation](https://graphql.org/learn/queries/#variables) ကို ကြည့်ပါ။

   ![Using GraphQL variables](https://assets.postman.com/postman-docs/v11/graphql-http-variables-v11-2.png)

`{{variable}}` syntax ကို သုံးပြီး — [Postman variables](/docs/postman/variables) တွေကို GraphQL variables တွေအတွက် data inputs အဖြစ်လည်း သုံးနိုင်ပါတယ်။

### GraphQL schemas တွေ import လုပ်ခြင်း

Queries တွေ ရေးနေတုန်း autocompletion ရဖို့ — ကိုယ့် request မှာ GraphQL schema တစ်ခု လိုအပ်ပါတယ်။ URL box ထဲမှာ GraphQL endpoint URL တစ်ခု ရိုက်ထည့်လိုက်တဲ့အခါ — Postman က introspection ကို သုံးပြီး GraphQL schema ကို အလိုအလျောက် ရယူပါတယ်။ Postman က schema တစ်ခုကို အလိုအလျောက် အောင်မြင်စွာ ရယူနိုင်တဲ့အခါ — schema ရွေးချယ်မှု စာရင်းရဲ့ ဘေးမှာ အသိပေးချက် (notification) တစ်ခု ပေါ်လာပါတယ်။ Schema ပြောင်းသွားပြီဆိုရင် — အပြောင်းအလဲတွေကို ရယူဖို့ ![Refresh icon](https://assets.postman.com/postman-docs/aether-icons/action-refresh-stroke.svg#icon) **Refresh** ကို နှိပ်ပါ။

ကိုယ့် request ထဲကို schema တစ်ခုကို ကိုယ်တိုင် manually import လုပ်တဲ့ option လည်း ရှိပါတယ်။ ကိုယ့် workspace ထဲမှာ GraphQL API တစ်ခုကို ဖန်တီး ဒါမှမဟုတ် import လုပ်ပြီးတာနဲ့ — auto-fetched schema အစား အဲဒီ API ရဲ့ schema ကို ကိုယ့် request အတွက် သုံးနိုင်ပါတယ်။

ကိုယ့် request ထဲကို GraphQL schema တစ်ခုကို manually import လုပ်ဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. ကိုယ့် workspace ထဲမှာ GraphQL API တစ်ခုကို [ဖန်တီးပါ](/docs/postman/create-a-specification) ဒါမှမဟုတ် [import လုပ်ပါ](/docs/postman/import-a-specification)။
2. ![Add icon](https://assets.postman.com/postman-docs/aether-icons/action-add-stroke.svg#icon) icon ကို နှိပ်ပြီး **HTTP** ကို ရွေးကာ — URL box ထဲမှာ GraphQL endpoint URL တစ်ခု ရိုက်ထည့်ပါ။
3. Request method dropdown list ကနေ **POST** ကို ရွေးပါ။
4. **Body** tab အောက်မှာ **GraphQL** body type ကို ရွေးပါ။
5. Schema ရွေးချယ်မှု dropdown list ဖွင့်ဖို့ — **Auto Fetch** ဘေးက ![Down Large icon](https://assets.postman.com/postman-docs/aether-icons/direction-down-large.svg#icon) icon ကို နှိပ်ပါ။
6. Dropdown list ကနေ ကိုယ့် schema ကို ရွေးပါ။

   ![Refresh icon](https://assets.postman.com/postman-docs/aether-icons/action-refresh-stroke.svg#icon) **Refresh** ကို နှိပ်ပြီး refresh လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

Query ရေးတဲ့အခါ — Postman က ရွေးထားတဲ့ GraphQL schema ထဲက data တွေကနေ autocomplete options တွေကို အကြံပြုပေးပါတယ်။

## Request body ထဲမှာ JSON သုံးခြင်း

1. Postman မှာ request tab အသစ်တစ်ခု ဖွင့်ပြီး — address field ထဲမှာ ကိုယ့် GraphQL endpoint URL ကို ရိုက်ထည့်ပါ။
2. Request method dropdown list ကနေ **POST** ကို ရွေးပါ။
3. **Headers** tab အောက်မှာ — `Content-type` key အတွက် `application/graphql` value ကို ထည့်ပါ။
4. **Body** tab အောက်မှာ **raw** body type ကို ရွေးပါ။ Format dropdown list ကနေ **JSON** ကို ရွေးပါ။
5. စနစ်ကျတဲ့ JSON formatting နဲ့ ကိုယ့် query ကို request body ထဲမှာ တည်ဆောက်ပါ။

## GraphQL content type header သုံးခြင်း

1. **New > HTTP** ကို နှိပ်ပြီး — URL box ထဲမှာ GraphQL endpoint URL တစ်ခု ရိုက်ထည့်ပါ။
2. Request method dropdown list ကနေ **POST** ကို ရွေးပါ။
3. **Body** tab အောက်မှာ **GraphQL** body type ကို ရွေးပါ။
4. **Headers** tab အောက်မှာ — `Content-type` key အတွက် `application/graphql` value ကို ထည့်ပါ။
5. **Body** tab အောက်မှာ **raw** body type ကို ရွေးပါ။ Format dropdown list ကနေ **Text** ကို ရွေးပါ။
6. Standard GraphQL formatting နဲ့ ကိုယ့် query ကို request body ထဲမှာ တည်ဆောက်ပါ။

## Query ကို cURL request အဖြစ် import လုပ်ခြင်း

1. **Import** ကို နှိပ်ပါ။
2. Request bar ထဲမှာ ကိုယ့် cURL command ကို paste လုပ်ပါ။ ကိုယ့် cURL command မှာ GraphQL endpoint URL တစ်ခု ပါဝင်ပြီး — `POST` request method ကို သတ်မှတ်ထားရပါမယ်။ Postman က သတ်မှတ်ထားတဲ့ GraphQL endpoint URL နဲ့ `POST` request method ပါတဲ့ request ကို tab အသစ်တစ်ခုမှာ ဖွင့်ပေးပါတယ်။
