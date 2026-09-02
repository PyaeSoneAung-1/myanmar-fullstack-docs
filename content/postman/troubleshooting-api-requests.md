---
title: "Postman မှာ API requests များကို debug လုပ်ခြင်း"
description: "API request တွေ မမှန်ကန်တဲ့အခါ troubleshoot လုပ်နည်း — Agent Mode နဲ့ debug လုပ်ခြင်း, Postman Console အသုံးပြုခြင်း, HTTP version အလိုက် debug လုပ်ခြင်း, request history နှိုင်းယှဉ်ခြင်း နဲ့ အဖြစ်များတဲ့ ပြဿနာများ"
order: 78
source: "https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/"
status: translated
updated: 2026-09-02
---

API request တစ်ခုက မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်မလုပ်ဘူးဆိုရင် — အကြောင်းရင်း အများကြီး ရှိနိုင်ပါတယ်။ ပြဿနာက ဘာလဲဆိုတာ ရှာဖို့ Agent Mode ကို အကူအညီ တောင်းနိုင်သလို — request ကို troubleshoot လုပ်ဖို့ Postman Console ကိုလည်း သုံးနိုင်ပါတယ်။ ဒီ guide မှာ အဖြစ်များတဲ့ ပြဿနာအချို့နဲ့ သူတို့ရဲ့ အကြောင်းရင်းတွေကိုလည်း ဖော်ပြထားပါတယ်။

ဒီအကြောင်းအရာက API requests တွေကို troubleshoot လုပ်ခြင်းအကြောင်း ဖြစ်ပါတယ်။ Postman app ရဲ့ ပြဿနာတွေကို troubleshoot လုပ်ဖို့ — [Troubleshoot app issues](https://learning.postman.com/docs/getting-started/troubleshooting-inapp/) ကို ကြည့်ပါ။ Postman Monitors တွေရဲ့ ပြဿနာတွေကိုတော့ — [Troubleshooting monitors](/docs/postman/troubleshooting-monitors) မှာ ကြည့်ပါ။

## Requests တွေကို troubleshoot လုပ်ခြင်း

Postman က request ကို မပို့နိုင်ဘူး ဒါမှမဟုတ် response တစ်ခု မရဘူးဆိုရင် — error အကြောင်း အသေးစိတ်ပါတဲ့ message တစ်ခု ရပါလိမ့်မယ်။ Request ရဲ့ ခြုံငုံသုံးသပ်ချက်တစ်ခု ရပြီး — ပြဿနာရဲ့ အရင်းအမြစ်ကို ဖော်ထုတ်ဖို့ [Console ကို ဖွင့်](#console-ဖွင့်ခြင်း)ပါ။

## Agent Mode နဲ့ requests တွေကို debug လုပ်ခြင်း

Request တစ်ခု ပို့တဲ့အခါ မမျှော်လင့်ထားတဲ့ error တစ်ခု ရရင် — Agent Mode ဆီက အကူအညီ တောင်းနိုင်ပါတယ်။ Error message ထဲမှာ **Debug with AI** ကို နှိပ်ပါ။ Agent Mode က သူ ဖော်ထုတ်နိုင်တဲ့ ပြဿနာတွေအကြောင်း ပြောပြပြီး — ပြဿနာကို ဖြေရှင်းဖို့ ဖြစ်နိုင်ခြေရှိတဲ့ နည်းလမ်းတွေကိုလည်း အကြံပြုပေးပါတယ်။

Agent Mode အကြောင်း ပိုသိချင်ရင် — [About Agent Mode](https://learning.postman.com/docs/getting-started/basics/about-agent-mode/) ကို ကြည့်ပါ။

## Console ထဲမှာ debug လုပ်ခြင်း

Console logs တွေကို Console ထဲမှာပဲ local အနေနဲ့ သိမ်းဆည်းပြီး — cloud ဆီ sync မလုပ်ပါဘူး။

Postman က ပို့လိုက်တဲ့ request တိုင်းကို Console ထဲမှာ log တင်ပေးတဲ့အတွက် — request တစ်ခု ပို့တဲ့အခါ ဘာတွေ ဖြစ်ခဲ့လဲဆိုတဲ့ အသေးစိတ်တွေကို ကြည့်နိုင်ပါတယ်။ ဆိုလိုတာက — API တစ်ခုက မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်မလုပ်တဲ့အခါ request တွေကို debug လုပ်ဖို့ Console ကို သုံးနိုင်ပါတယ်။ အလုပ်လုပ်နေစဉ် Console ကို ဖွင့်ထားမယ်ဆိုရင် — debug လုပ်နေစဉ်မှာ network calls တွေနဲ့ log messages တွေကို ပိုပြီး မြင်သာစေပါတယ်။

Console က အောက်ပါ အချက်အလက်တွေကို log တင်ပါတယ်:

* ပို့လိုက်တဲ့ primary request — အောက်ခံ request headers တွေ, variable values တွေနဲ့ redirects တွေ အပါအဝင်။
* Request အတွက် သုံးထားတဲ့ proxy configuration နဲ့ certificates တွေ။
* IP addresses, ciphers နဲ့ protocols တွေလို network အချက်အလက်တွေ။
* Pre-request ဒါမှမဟုတ် post-response scripts တွေဆီက log statements တွေနဲ့ asynchronous requests တွေ။
* Postman က မလုပ်ဆောင်ခင် server က ပို့လိုက်တဲ့ raw response။

Monitor ရလဒ်တွေကိုတော့ သီးခြား console တစ်ခုထဲမှာ log တင်ပါတယ်။ Monitor run တစ်ခုကနေ logs တွေကို ဘယ်လို ကြည့်ရမလဲဆိုတဲ့ အချက်အလက်အတွက် — [View monitor results](/docs/postman/viewing-monitor-results) ကို ကြည့်ပါ။

### Console ဖွင့်ခြင်း

Console ကို ဖွင့်ဖို့ — Postman footer ထဲမှာ **Console** ကို နှိပ်ပါ။ Postman desktop app မှာဆိုရင် — **⌘+Option+C** ဒါမှမဟုတ် **Ctrl+Alt+C** ကို နှိပ်ပြီး window အသစ်တစ်ခုထဲမှာ Console ကို ဖွင့်နိုင်ပါတယ်။

### Console ကနေ request errors တွေကို ကြည့်ရှုခြင်း

Postman က request ကို မပို့နိုင်ဘူး ဒါမှမဟုတ် request ပို့လိုက်တဲ့ API ကနေ response တစ်ခု မရဘူးဆိုရင် — error message တစ်ခု ရပါလိမ့်မယ်။ ဒီ message ထဲမှာ ပြဿနာရဲ့ ခြုံငုံသုံးသပ်ချက် ပါဝင်ပါတယ်။

Request အသေးစိတ်တွေကို စစ်ဆေးပြီး — ဘာတွေ မှားသွားလဲဆိုတာ ပိုသိဖို့ Postman footer ထဲမှာ **Console** ကို နှိပ်ပါ။

### Console ထဲမှာ လမ်းညွှန်ခြင်း

Console က request တစ်ခုစီအတွက် network အချက်အလက်၊ request/response headers နဲ့ body — ပြီးတော့ scripts တွေကနေ ထွက်လာတဲ့ Console output messages တွေကို ပြသပါတယ်။

**All Logs** အောက်မှာ log message အမျိုးအစားအလိုက် စစ်ထုတ်နိုင်ပါတယ်။ Timestamps တွေနဲ့ network အချက်အလက်တွေကို ဖွင့်/ပိတ်ဖို့ options icon ကို နှိပ်ပါ။

Console က နောက်ဆုံး messages 5,000 ခုနဲ့ 24 နာရီအတွင်းက အချက်အလက်တွေကို ပုံမှန်အားဖြင့် log ထားပါတယ်။ စာရင်းကို ရှင်းဖို့ **Clear** ကို နှိပ်ပါ။

### Log statements တွေကို သုံးခြင်း

Post-response scripts တွေထဲက သင့်တော်တဲ့ နေရာတွေမှာ log statements တွေကို သုံးခြင်းက request တွေကို debug လုပ်ရာမှာ အထောက်အကူ ဖြစ်စေပါတယ်။ Postman က အောက်ပါ log statements တွေကို လက်ခံပါတယ်:

* `console.log()`
* `console.info()`
* `console.warn()`
* `console.error()`
* `console.clear()`

## HTTP version အလိုက် debug လုပ်ခြင်း

Requests တွေအတွက် သုံးမယ့် HTTP version ကို သတ်မှတ်နိုင်ပါတယ်။ Postman က HTTP versions 1.0, 1.1 နဲ့ 2.0 တွေကို support လုပ်ပါတယ်။ ကိုယ် ရွေးလိုက်တဲ့ HTTP version က HTTP requests တွေ ပို့ဖို့ global အနေနဲ့ ပုံမှန် သုံးမယ့် version ဖြစ်ပါတယ်။ Request တစ်ခုချင်းစီအတွက် ပုံမှန် version ကို override လုပ်နိုင်ပါတယ်။

API requests တွေကို debug လုပ်တဲ့အခါ HTTP version ကို သတ်မှတ်ထားခြင်းက — version အလိုက် requests တွေကို test လုပ်နိုင်လို့ အသုံးဝင်ပါတယ်။ API requests တွေက မျှော်လင့်ထားတဲ့ HTTP version ကို support လုပ်သလားဆိုတာ စစ်ဆေးဖို့လည်း အသုံးဝင်ပါတယ်။

API က HTTP version 2.0 ကို support လုပ်ရင် — request URL က `https` scheme ကို သုံးထားကြောင်း သေချာစေပါ။ Postman web app ကို သုံးနေတယ်ဆိုရင် — [Postman Desktop Agent](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/#postman-desktop-agent) နဲ့ requests တွေ ပို့ကြောင်းလည်း သေချာစေပါ။ အောက်ပါ အခြေအနေတွေမှာ supported 1.x HTTP version ကို သုံးပါတယ်:

* Request URL က `http` scheme ကို သုံးထားတဲ့အခါ။
* Request ကို [Postman Cloud Agent](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/#postman-cloud-agent) နဲ့ ပို့တဲ့အခါ။
* [proxy server](https://learning.postman.com/docs/getting-started/installation/proxy/) တစ်ခု သုံးဖို့ Postman ကို ပြင်ဆင်ထားတဲ့အခါ။

Postman က [နောက်ဆုံး version](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/#update-the-postman-desktop-agent) ရဲ့ Postman Desktop Agent ကို သုံးဖို့ အကြံပြုပါတယ် — ဒါကြောင့် နောက်ဆုံး အပြောင်းအလဲတွေနဲ့ တိုးတက်မှုတွေကို ရနိုင်မှာ ဖြစ်ပါတယ်။

Requests တွေအတွက် HTTP version တစ်ခုကို သတ်မှတ်ဖို့ —

1. Header ထဲမှာ **Settings** ကို နှိပ်ပြီး — HTTP version တစ်ခုကို global အနေနဲ့ သတ်မှတ်ဖို့ **App settings** ကို နှိပ်ပါ။ HTTP request တစ်ခုချင်းစီအတွက် version ကို သတ်မှတ်ချင်ရင်လည်း — request ကို ဖွင့်ပြီး **Settings** tab ကို နှိပ်နိုင်ပါတယ်။

2. **HTTP version** dropdown list ကို ရွေးပါ။

   Request တစ်ခုချင်းစီအတွက် HTTP version တစ်ခု သတ်မှတ်ထားရင် — **Restore Default** ကို နှိပ်နိုင်ပါတယ်။ ဒါက HTTP version ကို global အနေနဲ့ သတ်မှတ်ထားတဲ့ ပုံမှန် version အဖြစ် ပြောင်းပေးပါတယ်။

3. အောက်ပါ options တွေထဲက တစ်ခုကို ရွေးပါ:

   * **Auto** — Postman က API က support လုပ်ပြီး နှစ်သက်တဲ့ version ပေါ်မူတည်ပြီး HTTP version 1.0, 1.1 ဒါမှမဟုတ် 2.0 ကို အလိုအလျောက် ရွေးပေးပါတယ်။
   * **HTTP/1.x** — Request ကို HTTP version 1.0 ဒါမှမဟုတ် 1.1 သုံးပြီး ပို့ပါ။
   * **HTTP/2** — Request ကို HTTP version 2.0 သုံးပြီး ပို့ပါ။

   API က ကိုယ် ရွေးလိုက်တဲ့ HTTP version ကို support မလုပ်ဘူးဆိုရင် — response နေရာမှာ error တစ်ခု ပြသပါတယ်။ ဥပမာ — **HTTP/2** ကို ရွေးပြီး API က HTTP version 2.0 ကို support မလုပ်ဘူးဆိုရင် error ပြသမှာ ဖြစ်ပါတယ်။

Request တစ်ခု ပို့ပြီးနောက် — response pane ထဲမှာ HTTP version ကို စစ်ဆေးနိုင်ပါတယ်။ Request ပို့ဖို့ သုံးခဲ့တဲ့ HTTP version အကြောင်း အချက်အလက်ကို ကြည့်ဖို့ **Network** ပေါ်မှာ hover လုပ်ပါ။

## Request ရဲ့ history တွေကို နှိုင်းယှဉ်ခြင်း

HTTP request တစ်ခုက မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်မလုပ်ရင် — troubleshoot လုပ်ဖို့ ကူညီနိုင်တဲ့ request ရဲ့ history ထဲက အရင်က configuration တစ်ခုကို ကြည့်နိုင်ပါတယ်။ Request ပို့တဲ့အခါ [response history သိမ်းဆည်းခြင်း](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#saving-responses-in-history) ဖွင့်ထားမှပဲ — အရင်က request configuration တစ်ခုရဲ့ response ကို ကြည့်နိုင်မှာ ဖြစ်ပါတယ်။ Request ရဲ့ history ထဲကနေ response တစ်ခုကိုလည်း ဖျက်နိုင်ပါတယ်။

HTTP request က internal ဒါမှမဟုတ် Partner Workspace တစ်ခုထဲမှာ ရှိရပါမယ်။ Public workspaces တွေကနေ — request တစ်ခုရဲ့ အစောပိုင်း configuration နဲ့ response ကို ကြည့်ရှုခြင်းကို Postman က support မလုပ်ပါဘူး။ ဒါ့အပြင် [multi-partner mode ဖွင့်ထားတဲ့ Partner Workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/partner-workspaces/multipartner-workspaces/) ထဲက partners တွေလည်း — request တစ်ခုရဲ့ အစောပိုင်း configuration နဲ့ response ကို မကြည့်နိုင်ပါဘူး။

Request configuration အရင်တစ်ခုနဲ့ သူ့ရဲ့ response ကို ကြည့်ဖို့ —

1. ဘယ်ဘက် sidebar ထဲမှာ **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး HTTP request တစ်ခုကို ဖွင့်ပါ။
3. Response နေရာမှာ **History** ကို နှိပ်ပါ။ ဒါက ပို့ခဲ့တဲ့ request တွေရဲ့ timestamps တွေနဲ့ — system က ပြန်ပေးခဲ့တဲ့ status code တွေရဲ့ စာရင်းတစ်ခုကို ပြသပေးပါတယ်။

   **History** dropdown list ကနေ အရင်က response တစ်ခုကို ရွေးလိုက်တဲ့အခါ — response နေရာမှာ request ပို့ခဲ့တဲ့ ရက်စွဲနဲ့ အချိန်ကို ပြသပါတယ်။ Dropdown list ကို ပြန်ပြသဖို့ ရက်စွဲနဲ့ အချိန်ကို ရွေးပြီး — တခြား response တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်။ Request configuration ရဲ့ နောက်ဆုံး version ဆီ ပြန်သွားဖို့ **Current** ကို ရွေးနိုင်ပါတယ်။

4. ကြည့်ချင်တဲ့ response နဲ့ request configuration ကို dropdown list ကနေ ရွေးပါ။

History ကနေ request တစ်ခုနဲ့ သူ့ရဲ့ response ကို ဖျက်ဖို့ —

1. ဘယ်ဘက် sidebar ထဲမှာ **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး HTTP request တစ်ခုကို ဖွင့်ပါ။
3. Response နေရာမှာ **History** ကို နှိပ်ပါ။
4. Dropdown list ထဲက response တစ်ခုဘေးမှာ options icon ကို ရွေးပြီး **Delete** ကို ရွေးပါ။

HTTP request တစ်ခုနဲ့ သူ့ရဲ့ response ကို — team members တွေ ဒါမှမဟုတ် external partners တွေနဲ့ [link တစ်ခု share လုပ်](/docs/postman/sharing)နိုင်ပါတယ်။ Request history ထဲက လက်ရှိ response ဒါမှမဟုတ် အရင်က response တစ်ခုရဲ့ link ကို — request configuration နဲ့အတူ share လုပ်ပါ။

## အဖြစ်များတဲ့ ပြဿနာများ

ဒီမှာ မဖော်ပြထားတဲ့ request ပို့ခြင်းဆိုင်ရာ ပြဿနာတစ်ခုခု ရှိရင် — Postman support ကို ဘယ်လို ဆက်သွယ်ရမလဲဆိုတဲ့ အချက်အလက်တွေအတွက် [Getting help](#အကူအညီ-ရယူခြင်း) ကို ကြည့်ပါ။

| ပြဿနာ | ဖြေရှင်းနည်း |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Connectivity (ချိတ်ဆက်မှု)** | Postman က request ကို မပို့နိုင်ရင် — connectivity ပြဿနာတွေ ကြုံနေရတာ ဖြစ်နိုင်ပါတယ်။ Web browser ထဲမှာ page တစ်ခု ဖွင့်ကြည့်ပြီး ကိုယ့်ရဲ့ connection ကို စစ်ဆေးပါ။ |
| **Firewalls** | Firewall အချို့က browser မဟုတ်တဲ့ connections တွေကို block လုပ်ဖို့ ပြင်ဆင်ထားနိုင်ပါတယ်။ ဒီလိုဖြစ်ရင် Postman အလုပ်လုပ်ဖို့ network administrators တွေကို ဆက်သွယ်ရပါမယ်။ |
| **Proxy configuration (proxy ပြင်ဆင်မှု)** | Requests တွေ လုပ်ဖို့ proxy server တစ်ခု သုံးနေရင် — ကိုယ့်ရဲ့ configuration ကို စစ်ဆေးပါ။ ပုံမှန်အားဖြင့် Postman က ကိုယ့် operating system ရဲ့ network settings ထဲမှာ ပြင်ဆင်ထားတဲ့ proxy settings တွေကို သုံးပါတယ်။ Proxy servers တွေအကြောင်း debug အချက်အလက်တွေကို [Console](#console-ထဲမှာ-debug-လုပ်ခြင်း) မှာ ရနိုင်ပါတယ်။ |
| **SSL certificates** | HTTPS connections တွေ သုံးတဲ့အခါ ပြဿနာတွေ ကြုံရနိုင်ပါတယ်။ Header ထဲမှာ **Settings > App settings** ကို ရွေးပြီး [Settings](https://learning.postman.com/docs/getting-started/installation/settings/certificates/) ထဲမှာ **SSL certificate verification** ကို ပိတ်ထားနိုင်ပါတယ်။ ဒါနဲ့ မရသေးရင် — ကိုယ့် server က client-side SSL connection တစ်ခု သုံးနေတာ ဖြစ်နိုင်ပြီး၊ header ထဲမှာ **Settings > App settings** ကို ရွေးပြီး **Certificates** ကို ရွေးကာ configure လုပ်နိုင်ပါတယ်။ Server ဆီ မှန်ကန်တဲ့ SSL certificate ပို့နေကြောင်း သေချာဖို့ [Console](#console-ထဲမှာ-debug-လုပ်ခြင်း) ကို သုံးပါ။ [certificates တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/postman/certificates) အကြောင်း ပိုလေ့လာပါ။ |
| **Client certificates** | Client certificates တွေက ကိုယ့် API server အတွက် လိုအပ်နိုင်ပါတယ်။ Header ထဲမှာ **Settings > App settings** ကို နှိပ်ပြီး **Certificates** ကို ရွေးကာ [Settings](https://learning.postman.com/docs/getting-started/installation/settings/certificates/) ထဲမှာ [client certificate တစ်ခု ထည့်နိုင်](/docs/postman/certificates)ပါတယ်။ |
| **Wrong request URLs (request URL မှားခြင်း)** | Request တွေနဲ့အတူ variables ဒါမှမဟုတ် path parameters တွေ သုံးနေရင် — run တဲ့အခါ request ကို ပို့လိုက်တဲ့ URL ကို ပြသပေးတဲ့ [Console](#console-ဖွင့်ခြင်း) ကို ဖွင့်ပြီး နောက်ဆုံး address မှန်ကန်ကြောင်း သေချာစေပါ။ ဖြေရှင်းမရတဲ့ request variables တွေက server address တွေ မမှန်ကန်တာ ဖြစ်စေနိုင်ပါတယ်။ |
| **Wrong protocol (protocol မှားခြင်း)** | URL ထဲမှာ `https://` အစား `http://` သုံးထားလား (ဒါမှမဟုတ် အပြန်အလှန်) ဆိုတာ စစ်ဆေးပါ။ |
| **Short timeouts (timeout တိုလွန်းခြင်း)** | Postman မှာ timeout တိုတို configure လုပ်ထားရင် — request က မပြီးခင် time out ဖြစ်ပြီး error တစ်ခု ဖြစ်စေနိုင်ပါတယ်။ ဒီပြဿနာ မဖြစ်အောင် — header ထဲမှာ **Settings > App settings** ကို ရွေးပြီး [Settings](https://learning.postman.com/docs/getting-started/installation/settings/general-settings/#request) ထဲမှာ **Request timeout** ကို တိုးပေးပါ။ |
| **Invalid responses (မမှန်ကန်တဲ့ responses)** | Server က response encoding errors တွေ ဒါမှမဟုတ် invalid headers တွေ ပို့ရင် — Postman က response ကို အနက်ပြန်ဆိုဖို့ မအောင်မြင်နိုင်ပါဘူး။ |
| **TLS version** | Postman က TLS version 1.2 နဲ့ အထက်ကို support လုပ်ပါတယ် — browser ဒါမှမဟုတ် operating system အဟောင်းတစ်ခုကို သုံးနေရင် ဒါတွေကို support မလုပ်နိုင်ပါဘူး။ Supported browser နဲ့ operating system versions တွေအတွက် [Postman system requirements](https://learning.postman.com/docs/getting-started/installation/system-requirements/) ကို ကြည့်ပါ။ |
| **Postman errors (Postman error များ)** | Postman က ကိုယ့် API server ဆီ invalid requests တွေ လုပ်နေတာ ဖြစ်နိုင်ပါတယ်။ ရနိုင်ရင် ကိုယ့် server logs တွေကို စစ်ဆေးပြီး အတည်ပြုနိုင်ပါတယ်။ ဒီလိုမျိုး ဖြစ်နေတယ်လို့ ထင်ရင် — [GitHub issue tracker](https://github.com/postmanlabs/postman-app-support/issues) ကို သုံးပြီး Postman team ကို ဆက်သွယ်ပါ။ |
| **Empty variables (value မရှိတဲ့ variables)** | Empty variable ဆိုတာ — value မရှိဘဲ request တစ်ခုထဲမှာ ကိုးကားထားတဲ့ variable တစ်ခု ဖြစ်ပါတယ်။ ဒါ ဘာကြောင့် ဖြစ်လဲဆိုတာနဲ့ ဘယ်လို ဖြေရှင်းရမလဲဆိုတဲ့ အချက်အလက်တွေအတွက် — [Fix empty variables](https://learning.postman.com/docs/use/send-requests/variables/view-variables/#fix-empty-variables) ကို ကြည့်ပါ။ |
| **CORS** | [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) က request တစ်ခုကို မပို့နိုင်ရင် — cross-origin resource sharing (CORS) error တစ်ခု ကြုံနေရတာ ဖြစ်နိုင်ပါတယ်။ ကိုယ့် request အတွက် အကောင်းဆုံး [Postman Agent](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/) ကို သုံးနေကြောင်း သေချာစေပါ။ |

## အကူအညီ ရယူခြင်း

Request နဲ့ ပတ်သက်ပြီး ပြဿနာတွေ ရှိနေသေးရင် — အကူအညီ ရယူဖို့ နည်းလမ်းတွေ ရှိပါတယ်:

* [Postman Discord](https://postman-community.com/kmg) မှာ community အကူအညီကို တောင်းခံပါ။
* ပြဿနာက Postman ကိုယ်တိုင်နဲ့ ဆိုင်တယ်လို့ ထင်ရင် — GitHub ပေါ်က [issue tracker](https://github.com/postmanlabs/postman-app-support/issues) မှာ ရှာကြည့်ပြီး ဒီပြဿနာကို တစ်ယောက်ယောက်က သတင်းပို့ပြီးသား ရှိလား၊ သိထားတဲ့ ဖြေရှင်းနည်း ရှိလားဆိုတာ စစ်ဆေးပါ။
* Confidential data တွေ ထည့်သွင်းဖို့ လိုရင် — ကိုယ့်ရဲ့ Console logs တွေ ပါဝင်တဲ့ support ticket တစ်ခုကို [Postman support](https://support.postman.com/hc/en-us) ဆီ တင်သွင်းပါ။
