---
title: "Postman မှာ GraphQL requests တွေ ဖန်တီးခြင်း (Create GraphQL requests in Postman)"
description: "Postman ရဲ့ GraphQL client ကို သုံးပြီး query တစ်ခု ဒါမှမဟုတ် queries အများကြီး ပါတဲ့ GraphQL requests တွေကို schema explorer နဲ့ ဖန်တီး, run လုပ်နည်း"
order: 107
source: "https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-client-first-request/"
status: translated
updated: 2026-09-03
---

Postman ရဲ့ GraphQL client ကို သုံးပြီး — query တစ်ခု ဒါမှမဟုတ် queries အများကြီး ပါဝင်တဲ့ GraphQL requests တွေကို ဖန်တီးနိုင်ပါတယ်။ GraphQL client interface က GraphQL requests တွေ ရေးဆွဲဖို့အတွက် အထူးဒီဇိုင်းထုတ်ထားတာပါ။ ၎င်းက GraphQL API တစ်ခုရဲ့ data fields တွေကို ရှာဖွေနိုင်စေပြီး — fields တွေ ရွေးချယ်ခြင်း ဒါမှမဟုတ် editor ထဲမှာ code ရိုက်ထည့်ခြင်းအားဖြင့် queries တွေ တည်ဆောက်နိုင်စေပါတယ်။ Queries အများကြီး ပါတဲ့ requests တွေအတွက်ဆိုရင် — ကိုယ်လိုချင်တဲ့ queries တွေကို ရွေးပြီး တစ်ခုချင်းစီ သပ်သပ်စီ run နိုင်ပါတယ်။

Postman ရဲ့ [HTTP interface](/docs/postman/graphql-http) ကို သုံးပြီးလည်း GraphQL requests တွေ ဖန်တီးနိုင်ပါတယ် — GraphQL ကို ထောက်ပံ့ပေးပေမယ့် GraphQL client ထက် အဆင့်တွေ ပိုလိုအပ်ပါတယ်။

## Query တစ်ခုတည်းနဲ့ GraphQL request ဖန်တီးခြင်း

ဒီဥပမာက schema explorer ကို သုံးပြီး GraphQL query တစ်ခုကို ဖန်တီး, run လုပ်ပါတယ်။

Postman web app ကို သုံးနေတယ်ဆိုရင် — Postman Desktop Agent ကို သုံးရပါမယ်။ [Postman Agent အကြောင်း](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/) မှာ ပိုပြီး သိရှိနိုင်ပါတယ်။

1. Sidebar ထဲမှာ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) icon ကို နှိပ်ပြီး — **GraphQL** ကို ရွေးပါ။ Postman desktop app မှာဆိုရင် — **⌘+N** ဒါမှမဟုတ် **Ctrl+N** ကို နှိပ်ပြီး **GraphQL** ကို ရွေးနိုင်ပါတယ်။
2. URL box ကို နှိပ်ပြီး — dropdown list ကနေ `https://graphql.postman-echo.com/graphql` ကို ရွေးပါ။ Postman က introspection ကို သုံးပြီး schema ကို load လုပ်ကာ — schema explorer ထဲမှာ data fields တွေနဲ့ ဖြည့်ပေးပါတယ်။

   Schema explorer ထဲမှာ — data fields တွေက ၎င်းတို့နဲ့ သက်ဆိုင်တဲ့ types တွေအောက်မှာ အုပ်စုဖွဲ့ပြီး ပြထားပါတယ်: **Query**, **Mutation** နဲ့ **Subscription**။
3. Schema explorer ထဲမှာ `hello` checkbox ကို ရွေးပြီး — `person`, `name` နဲ့ `age` checkboxes တွေကို ရွေးပါ။ ကိုယ့် ရွေးချယ်မှုတွေအပေါ် အခြေခံတဲ့ query တစ်ခု — query editor ထဲမှာ ပေါ်လာပါတယ်။

   Query editor ထဲမှာ code ရိုက်ထည့်ပြီးလည်း query တစ်ခု တည်ဆောက်နိုင်ပါတယ်။
4. `age` နဲ့ `name` ဘေးက text boxes တွေထဲမှာ ဒါမှမဟုတ် query editor ထဲမှာ — ကိုယ့် age နဲ့ name ကို ရိုက်ထည့်ပါ။
5. **Query** ကို နှိပ်ပါ။

   ![GraphQL request with a single query](https://assets.postman.com/postman-docs/v12/graphql-single-query-v12-01.png)

## Queries အများကြီးနဲ့ GraphQL request ဖန်တီးခြင်း

ဒီ request မှာ queries အများကြီး ပါဝင်ပြီး — တစ်ကြိမ်မှာ တစ်ခုစီ စီစဉ်ပြီး run ပါတယ်။ ရွေးထားတဲ့ query တစ်ခုတည်းကိုပဲ run ချင်ရင် — schema explorer ထဲမှာ checkbox တစ်ခု ရွေးပြီး **Query** ကို နှိပ်ပါ။

1. Sidebar ထဲမှာ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) icon ကို နှိပ်ပြီး — **GraphQL** ကို ရွေးပါ။ Postman desktop app မှာဆိုရင် — **⌘+N** ဒါမှမဟုတ် **Ctrl+N** ကို နှိပ်ပြီး **GraphQL** ကို ရွေးနိုင်ပါတယ်။

2. URL box ကို နှိပ်ပြီး — dropdown list ကနေ `https://graphql.postman-echo.com/graphql` ကို ရွေးပါ။ Postman က introspection ကို သုံးပြီး schema ကို load လုပ်ကာ — schema explorer ထဲမှာ data fields တွေနဲ့ ဖြည့်ပေးပါတယ်။

3. Schema explorer ထဲမှာ `hello`, `person` နဲ့ `name` checkboxes တွေကို ရွေးပါ။ `name` field ထဲမှာ ကိုယ့် name ကို ရိုက်ထည့်ပါ။ Query တစ်ခု — query editor ထဲမှာ ပေါ်လာပါတယ်။

4. Schema explorer ထဲမှာ အောက်ကို ဆင်းပြီး — `greetings` checkbox ကို ရွေးပါ။ Query editor ထဲမှာ ဒုတိယ query တစ်ခု ပေါ်လာပြီး — ပထမ query က မှိန်သွားပါတယ်။

5. Query editor ထဲမှာ ပထမ query ရဲ့ ဘယ်နေရာမဆို နှိပ်ပြီး — အဲဒါကို activate လုပ်ကာ **Query** ကို နှိပ်ပါ။

6. ဒုတိယ query ရဲ့ ဘယ်နေရာမဆို နှိပ်ပြီး — **Query** ကို နှိပ်ပါ။ Queries အများကြီး ပါတဲ့ request တစ်ခုထဲက queries တွေကို ကြည့်ရှု ရွေးချယ်ဖို့ — **Query** button ရဲ့ dropdown list ကိုလည်း သုံးနိုင်ပါတယ်။

   ![GraphQL request with multiple queries](https://assets.postman.com/postman-docs/v12/graphql-multi-query-v12-01.png)
