---
title: "Postman ရဲ့ command-line companion (Postman CLI) ကို လေ့လာခြင်း"
description: "Postman CLI ရဲ့ မိတ်ဆက် — Postman CLI နဲ့ လုပ်ဆောင်နိုင်တဲ့ commands, collections, datasets, flows, mock servers, monitors, webhooks စတဲ့ feature အမျိုးမျိုးရဲ့ ခြုံငုံသုံးသပ်ချက်"
order: 156
source: "https://learning.postman.com/docs/postman-cli/postman-cli-overview/"
status: translated
updated: 2026-09-03
---

Postman CLI က Postman အတွက် လုံခြုံစိတ်ချရတဲ့ command-line companion တစ်ခုပါ။ Postman app လိုပဲ — Postman CLI ကိုလည်း Postman ကိုယ်တိုင် လက်မှတ်ရေးထိုး (signed) ပြီး တရားဝင် ပံ့ပိုးပေးထားပါတယ်။ Postman CLI မှာ အောက်ပါ feature တွေ ပါဝင်ပါတယ်:

* [အခြေခံ CLI commands တွေ run လုပ်ပြီး](https://learning.postman.com/docs/postman-cli/postman-cli-basic/) help နဲ့ version အချက်အလက်တွေ ရယူနိုင်ပါတယ်။
* Command line ကနေ [Postman နဲ့ authenticate လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-auth/)။
* Configure လုပ်ထားတဲ့ [API governance rules တွေနဲ့ API specifications တွေကို စစ်ဆေးခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-governance/)။
* Configuration options အများအပြားနဲ့ built-in reporters တွေ သုံးပြီး [collections တွေကို run လုပ်ပြီး စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-collections/)။
* ပြန်သုံးလို့ရတဲ့ data sources, SQL queries နဲ့ saved views တွေနဲ့ [datasets တွေကို ဖန်တီးပြီး စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-datasets/)။
* API workflow automation အတွက် [Postman Flows တွေကို deploy လုပ်ပြီး trigger လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-flows/)။
* Testing နဲ့ development အတွက် API အပြုအမူတွေကို simulate လုပ်ဖို့ [mock servers တွေ စတင်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-mock/)။
* ကိုယ့် API ရဲ့ ကျန်းမာရေးနဲ့ performance ကို စစ်ဆေးပြီး regressions တွေကို ဖမ်းမိဖို့ [monitors](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-monitor-run) နဲ့ [performance tests](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-performance-run) တွေ run လုပ်ခြင်း။
* Private endpoints တွေ ရှိတဲ့ APIs တွေကို စောင့်ကြည့်ဖို့ ကိုယ့် internal network ထဲမှာ [monitoring runners တွေ စတင်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-runner-start)။
* Network capture နဲ့ Application Inventory reporting ပါတဲ့ [application configuration တွေကို စတင်ပြီး application tests တွေ run လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-application/)။
* API discovery, code generation နဲ့ maintenance လုပ်ငန်းတွေအတွက် [coding agents တွေကို Postman CLI context ပေးခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-context/)။
* Command line ကနေ Postman v11 API Builder ထဲမှာ [API versions တွေ publish လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-publish-api-versions/)။
* Command line ကနေ တိုက်ရိုက် [HTTP requests တစ်ခုချင်းစီကို test လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-requests/)။
* ကိုယ့် Postman Collections နဲ့ API specifications တွေကနေ [client SDKs တွေကို ထုတ်လုပ်ပြီး စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-sdk-gen/)။
* Requests, collections, workspaces, flows, mocks, environments နဲ့ specifications စတဲ့ [Postman elements တွေကို ရှာဖွေခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-search/)။
* ကိုယ့် service က disruptions နဲ့ performance constraints တွေကို ဘယ်လို တုံ့ပြန်လဲ test လုပ်ဖို့ local mock servers တွေပေါ်မှာ [simulations တွေ run လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-simulator/)။
* Event-driven integrations နဲ့ local development အတွက် [webhooks တွေကို ဖန်တီး, စီမံပြီး forward လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-webhooks/)။
* Postman cloud ထဲက workspaces တွေဆီ local Postman elements တွေကို [validate, synchronize လုပ်ပြီး push လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/)။

[Native Git](https://learning.postman.com/docs/use/native-git/overview/) သုံးနေတဲ့အခါ — Postman desktop app ထဲက built-in terminal ကို သုံးပြီး Postman CLI commands တွေကို မြန်မြန်ဆန်ဆန် run လုပ်နိုင်ပါတယ်။
