---
title: "Postman မှာ GraphQL (GraphQL in Postman)"
description: "Postman ကို သုံးပြီး GraphQL requests တွေ ပို့ခြင်း — GraphQL ဆိုတာ ဘာလဲ, GraphQL request တွေရဲ့ operation အမျိုးအစားတွေ (query, mutation, subscription) နဲ့ Postman GraphQL client အကြောင်း မိတ်ဆက်"
order: 105
source: "https://learning.postman.com/docs/use/send-requests/protocols/graphql/graphql-overview/"
status: translated
updated: 2026-09-03
---

Postman က GraphQL နဲ့ requests တွေ ပို့လို့ရပါတယ်။ GraphQL က APIs တွေအတွက် သုံးတဲ့ open-source query language နဲ့ runtime တစ်ခုပါ။

## GraphQL အကြောင်း

GraphQL ကို ထောက်ပံ့တဲ့ APIs တွေက — client တွေကိုယ်လိုအပ်တဲ့ data တွေကိုပဲ server ဆီကနေ တောင်းယူနိုင်အောင် — GraphQL ရဲ့ အစွမ်းထက်တဲ့ query language နဲ့ runtime ကို သုံးပါတယ်။ Data set အမျိုးမျိုးကို ရယူဖို့ endpoint အများကြီး သုံးရတဲ့ REST နဲ့ မတူဘဲ — GraphQL က data အားလုံးကို endpoint တစ်ခုတည်းကနေ ရယူပြီး querying လုပ်ငန်းစဉ်ကို ပိုမို ချောမွေ့စေပါတယ်။

GraphQL က schema ကို အခြေခံပြီး အလုပ်လုပ်တဲ့အတွက် — API တစ်ခုရဲ့ လုပ်ဆောင်နိုင်စွမ်းတွေကို ထိုးထွင်းသိမြင်စေပြီး client နဲ့ server ကို တည်ဆောက်နေတဲ့ team တွေကြားက မှီခိုမှုတွေကိုလည်း လျှော့ချပေးပါတယ်။ Client တစ်ခုက server ဆီကနေ schema ကို introspect (အတွင်းပိုင်း စစ်ဆေးကြည့်ရှု) လုပ်ပြီး — ရနိုင်တဲ့ data fields တွေကို မြင်နိုင်ကာ — ဘယ် fields တွေကို ရယူမယ် ဒါမှမဟုတ် ပြုပြင်မယ်ဆိုတာ သတ်မှတ်တဲ့ queries တွေ ပို့နိုင်ပါတယ်။ Server ကလည်း query ထဲမှာ တောင်းထားတဲ့ data ကိုပဲ ပြန်ပေး ဒါမှမဟုတ် ပြုပြင်တာမို့ — data အလွန်အကျွံ ဒါမှမဟုတ် မလုံလောက်ဘဲ ရယူမိတာမျိုး မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။

## GraphQL requests တွေ

GraphQL request တိုင်းမှာ URL တစ်ခုနဲ့ query တစ်ခု ပါဝင်ပါတယ်။ URL က data တည်ရှိရာ endpoint ဖြစ်ပြီး — query က ဘယ် data တွေကို ရယူမယ် ဒါမှမဟုတ် ပြုပြင်မယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ API ရဲ့ schema က ရနိုင်တဲ့ data fields တွေကို သတ်မှတ်ပေးပါတယ်။ Request ထဲမှာ API ရဲ့ သတ်မှတ်ချက်တွေအပေါ် မူတည်ပြီး — authentication, headers နဲ့ settings တွေလည်း ပါဝင်နိုင်ပါတယ်။

GraphQL requests တွေက operation အမျိုးအစား သုံးမျိုး လုပ်ဆောင်နိုင်ပါတယ်:

* **Query** — Server ဆီကနေ data တွေကို ရယူပါတယ်။ Queries တွေက လိုအပ်တဲ့ data fields တွေကို သတ်မှတ်ပြီး — ပိုမို တိကျတဲ့ data ရယူမှုအတွက် arguments တွေလည်း ထည့်နိုင်ပါတယ်။

* **Mutation** — Records တွေ ဖန်တီးခြင်း, update လုပ်ခြင်း, ဖျက်ခြင်း အပါအဝင် — server ပေါ်မှာ data တွေကို ပြုပြင်ပါတယ်။ Mutations တွေက operation ပြီးနောက် ပြန်ပို့စေချင်တဲ့ fields တွေကို သတ်မှတ်ပြီး — ဘယ်လို ပြုပြင်မလဲဆိုတာကို အသေးစိတ် ဖော်ပြဖို့ arguments တွေ သုံးပါတယ်။

* **Subscription** — Server ဆီကနေ real-time data updates တွေကို ရယူပါတယ်။ Subscriptions တွေက client တွေကို ကိုယ်စိတ်ဝင်စားတဲ့ data fields တွေကို နားထောင်နိုင်စေပြီး — အမြဲတည်မြဲတဲ့ ချိတ်ဆက်မှု (persistent connection) တစ်ခုကနေ updates တွေကို အလိုအလျောက် လက်ခံရရှိစေပါတယ်။

## Postman GraphQL client

GraphQL request အသစ်တစ်ခု ဖန်တီးလိုက်တာနဲ့ — Postman ရဲ့ [GraphQL client](/docs/postman/graphql-client-interface) က အလိုအလျောက် load ဖြစ်သွားပါတယ်။ GraphQL client interface က GraphQL requests တွေ ရေးဆွဲဖို့အတွက် အထူးဒီဇိုင်းထုတ်ထားတာဖြစ်ပြီး — API တစ်ခုရဲ့ data fields တွေကို ရှာဖွေကာ fields တွေ ရွေးချယ်ခြင်းအားဖြင့် queries တွေ တည်ဆောက်နိုင်စေပါတယ်။

GraphQL requests, collections နဲ့ folders တွေထဲမှာလည်း — API tests တွေ လုပ်ဆောင်ဖို့ ကိုယ်ရေးထားတဲ့ scripts တွေ ပါဝင်နိုင်ပါတယ်။ ဒါတွေက query တစ်ခု မလုပ်ဆောင်ခင် ဒါမှမဟုတ် response ရပြီးနောက်မှာ run လို့ရပါတယ်။ ပိုလေ့လာဖို့ — [Postman requests တွေမှာ logic နဲ့ tests တွေ ထည့်ဖို့ scripts တွေ သုံးခြင်း](/docs/postman/intro-to-scripts) ကို ကြည့်ပါ။

Postman ရဲ့ HTTP request interface ကို သုံးပြီးလည်း GraphQL requests တွေ လုပ်လို့ရပါတယ်။ ပိုလေ့လာဖို့ — [HTTP request တစ်ခုနဲ့ GraphQL call လုပ်ခြင်း](/docs/postman/graphql-http) ကို ကြည့်ပါ။

#### [အခမဲ့ GraphQL Client ကို စမ်းသုံးကြည့်ပါ — signup မလိုပါ](https://www.postman.com/tools?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta)

Setup အဆင့်တွေ ကျော်ပြီး — [GraphQL queries နဲ့ mutations တွေကို ကိုယ့် browser ထဲမှာ ဖန်တီး, run လုပ်ကြည့်ပါ](https://www.postman.com/tools/graphql-client?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta)။ Browser ထဲမှာ run လုပ်ရတာဖြစ်ပြီး — account မလိုအပ်ပါဘူး။
