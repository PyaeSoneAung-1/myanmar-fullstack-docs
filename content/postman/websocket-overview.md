---
title: "Postman နဲ့ WebSocket requests တွေ ပို့ခြင်း (Send WebSocket requests with Postman)"
description: "WebSocket protocol ဆိုတာ ဘာလဲ, Postman မှာ WebSocket request ဖန်တီးပြီး messages တွေ ပို့/လက်ခံနည်း — persistent, bidirectional ချိတ်ဆက်မှုအကြောင်း မိတ်ဆက်"
order: 109
source: "https://learning.postman.com/docs/use/send-requests/protocols/websocket/websocket-overview/"
status: translated
updated: 2026-09-03
---

Postman က WebSocket protocol ကို ထောက်ပံ့ပါတယ်။ WebSocket protocol က client နဲ့ server အကြား — အမြဲတည်မြဲတဲ့ ချိတ်ဆက်မှု (persistent connection) တစ်ခုကနေ data တွေ ဖလှယ်နိုင်တဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။ Data တွေကို နှစ်ဖက်စလုံးကနေ — latency နည်းနည်းနဲ့ overhead နည်းနည်းနဲ့ — ချိတ်ဆက်မှု မပြတ်ဘဲ ပို့လို့ရပါတယ်။

WebSocket က TCP socket connection တစ်ခုတည်းကနေ HTTP အပေါ်မှာ အလုပ်လုပ်တဲ့ — bidirectional, full-duplex (နှစ်ဖက်စလုံးက တစ်ပြိုင်နက် အပြန်အလှန် ဆက်သွယ်နိုင်တဲ့) communications channel တစ်ခုကို ပေးပါတယ်။ ဆိုလိုတာက — client က တောင်းစရာ မလိုဘဲ server က client ဆီ data တွေကို သီးခြား ပို့နိုင်သလို — client ကလည်း server ဆီ အလားတူ ပို့နိုင်ပါတယ်။

Postman မှာ WebSocket request တစ်ခု ဖန်တီးပြီး — WebSocket connection တစ်ခုကနေ messages တွေ ပို့, လက်ခံဖို့ သုံးနိုင်ပါတယ်။ အခုထိ မလုပ်ရသေးဘူးဆိုရင် — စတင်ဖို့ [Postman desktop app ကို download လုပ်ပြီး install လုပ်ပါ](https://learning.postman.com/docs/getting-started/installation/install-app/)။

#### [အခမဲ့ realtime clients တွေကို စမ်းသုံးကြည့်ပါ — signup မလိုပါ](https://www.postman.com/tools?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta)

Setup အဆင့်တွေ ကျော်ပြီး ကျွန်တော်တို့ရဲ့ အခမဲ့ browser tools တွေကို စမ်းသုံးကြည့်နိုင်ပါတယ်: [WebSocket server တစ်ခုနဲ့ ချိတ်ဆက်ပြီး messages တွေ ပို့/လက်ခံခြင်း](https://www.postman.com/tools/websocket-client?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta), ဒါမှမဟုတ် [Socket.IO events တွေကို publish နဲ့ subscribe လုပ်ခြင်း](https://www.postman.com/tools/socketio-client?utm_source=docs&utm_medium=link&utm_campaign=signed_out_tools_cta)။ Account မလိုအပ်ပါဘူး။

## နောက်ထပ်အဆင့်များ

WebSocket ကို စတင်ဖို့ — [WebSocket request တစ်ခု ဖန်တီးခြင်း](/docs/postman/create-a-websocket-request) ကို ကြည့်ပါ။
