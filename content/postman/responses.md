---
title: "Postman မှာ API Response များ၏ တည်ဆောက်ပုံ (API Response Structure)"
description: "Response body, headers, cookies, status code စတဲ့ API response အစိတ်အပိုင်းတွေကို ကြည့်ရှုနည်း — search, filter, visualize လုပ်ခြင်း၊ test results နဲ့ network info ကြည့်ခြင်း၊ response တွေကို example/file အဖြစ် သိမ်းခြင်း"
order: 19
source: "https://learning.postman.com/docs/use/send-requests/response-data/responses/"
status: translated
updated: 2026-09-02
---

Postman ရဲ့ response viewer (response ကြည့်ရှုသူ) က API responses တွေကို မြင်သာအောင် ပြသပေးပြီး — မှန်ကန်မှု ရှိ၊ မရှိ စစ်ဆေးနိုင်အောင် ကူညီပေးပါတယ်။ API response တစ်ခုမှာ response body, headers, cookies နဲ့ HTTP status code တို့ ပါဝင်ပါတယ်။ Test results (စမ်းသပ်မှု ရလဒ်များ), network information (network အချက်အလက်), response size နဲ့ response time အပါအဝင် — response ရဲ့ အသေးစိတ်တွေကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။ Response တွေကို examples (နမူနာများ) ဒါမှမဟုတ် files အဖြစ်လည်း သိမ်းဆည်းနိုင်ပါတယ်။

## Response body

Response တွေကြည့်ရှုရာမှာ **Body** tab က — data type selector, preview, search, filter နဲ့ AI ကို အခြေခံတဲ့ visualization (မြင်သာ ဖော်ပြမှု) အပါအဝင် — response ကို နားလည်နိုင်အောင် ကူညီပေးတဲ့ tools အများအပြား ပါဝင်ပါတယ်။

### Data type selector

Request တစ်ခု ပို့လိုက်တဲ့အခါ Postman က ကိုယ့် response ရဲ့ data type ကို အလိုအလျောက် ဖော်ပြပေးပါတယ်။ ဥပမာ — JSON responses တွေကို JSON mode နဲ့ အလိုအလျောက် ပြသပေးပါတယ်။ Data type ပေါ် မူတည်ပြီး syntax highlighting (code အရောင်ခွဲပြခြင်း) လည်း လုပ်ပေးပါတယ်။ အောက်ပါ type တွေကနေ ရွေးချယ်နိုင်ပါတယ်:

* JSON
* XML
* HTML
* YAML
* JavaScript
* Markdown
* Raw
* Hex
* Base64

ကိုယ့် response ထဲမှာ link တစ်ခု ပါရင် အဲဒီ link ကို highlight လုပ်ပြပါတယ်။ Link ကို နှိပ်လိုက်ရင် `GET` request တစ်ခု run သွားပါတယ်။

**Force JSON formatting** — Postman က ကိုယ့် response ရဲ့ data type ကို အလိုအလျောက် ရွေးပေးတာ ဒါမှမဟုတ် JSON formatting ကို အတင်းအကျပ် သုံးတာမျိုး ရွေးချယ်နိုင်ပါတယ်။ ရွေးချယ်မှု ပြောင်းချင်ရင် — Postman header ထဲက **Settings** ကို သွားပြီး **App settings** ကို ရွေးပါ။ **General > Request > Response format detection** အောက်မှာ **JSON** ကို ရွေးပါ။

### Preview (အကြိုကြည့်ရှုခြင်း)

**Preview** tab က — ပို့နေတဲ့ data ကို ပိုရှင်းလင်းပြီး ကြည့်ရလွယ်တဲ့ မြင်ကွင်းတစ်ခု ပေးကာ — ဖြစ်ပေါ်လာတဲ့ error တွေကို နားလည်နိုင်အောင် ကူညီပေးပါတယ်။ **audio**, **video**, **script**, **image**, **plain** နဲ့ **embed** အပါအဝင် file format အများအပြားကို ထောက်ပံ့ပေးပါတယ်။ JSON နဲ့ XML data types တွေကိုတော့ table ပုံစံနဲ့ ပြသပေးပါတယ်။

### Search (ရှာဖွေခြင်း)

ကိုယ့် response ထဲမှာ လိုချင်တဲ့ အကြောင်းအရာကို ရှာဖို့ search phrase တွေ သုံးနိုင်ပါတယ်။ Response pane ထဲမှာ **Search** ကို နှိပ်ပါ။ ဒါမှမဟုတ် — response ထဲမှာ cursor ထားပြီး **⌘+F** (macOS) ဒါမှမဟုတ် **Ctrl+F** (Windows/Linux) ကို နှိပ်လည်း ရပါတယ်။

### Filter (စစ်ထုတ်ခြင်း)

ဖတ်ရလွယ်ကူအောင်အတွက် — သက်ဆိုင်တဲ့ အချက်အလက်တွေပဲ ကျန်အောင် response တွေကို filter လုပ်နိုင်ပါတယ်။ JSON responses တွေကို filter လုပ်ဖို့ [JSONPath](https://datatracker.ietf.org/doc/html/rfc9535/) ကို သုံးပြီး — XML နဲ့ HTML responses တွေကိုတော့ [XPath](https://www.w3.org/TR/2010/REC-xpath20-20101214/) ကို သုံးပါတယ်။

Data type selector ထဲမှာ **JSON**, **XML** ဒါမှမဟုတ် **HTML** ရွေးထားတယ်ဆိုရင် — response pane ထဲက **Filter** ကို နှိပ်ပြီး — JSON ကို filter ဖို့ JSONPath expression တစ်ခု၊ XML ဒါမှမဟုတ် HTML ကို filter ဖို့ XPath expression တစ်ခု ရိုက်ထည့်ပါ။ JSONPath expressions တွေအတွက် — response ထဲက keys တွေကို အခြေခံပြီး autocomplete options တွေကို Postman က အကြံပြုပေးပါတယ်။ Response ထဲမှာ ကိုယ့် expression ရဲ့ ရလဒ်ကို အလိုအလျောက် ပြသပေးပါတယ်။

ရလဒ် မထွက်တဲ့ expression တစ်ခု ရိုက်ထည့်ရင် — Postman က အဝါရောင် မျဉ်းသားနဲ့ ပြပေးပါတယ်။ Valid မဟုတ်တဲ့ expression ဆိုရင်တော့ အနီရောင် မျဉ်းသားနဲ့ ပြပါတယ်။ Expression ပေါ်မှာ hover လုပ်ရင် ပြဿနာအကြောင်း tooltip တစ်ခု မြင်ရပါတယ်။

Expression က — request ကို မပိတ်ခင် ဒါမှမဟုတ် expression ကို ရှင်းမပစ်ခင် အထိ — response ထဲမှာ ဆက်ရှိနေပါတယ်။ **Filter** ပေါ်မှာ green dot (အစိမ်းရောင် အစက်) ရှိနေရင် — response ကို expression တစ်ခုနဲ့ filter လုပ်နေတယ်လို့ ဆိုလိုပါတယ်။ Expression ကို ရှင်းပြီး response အပြည့်အစုံ ပြချင်ရင် — Clear icon ကို နှိပ်ပါ။

XPath expression ကို **XML** နဲ့ **HTML** data types နှစ်ခုလုံးမှာ သုံးနိုင်ပါတယ်။

### Visualization (မြင်သာ ဖော်ပြခြင်း)

**Visualize** tab က — **Scripts > Post-response** tab ထဲမှာ ကိုယ်ထည့်ထားတဲ့ visualization code အရ — API response ထဲက data တွေကို render (ပုံဖော်ဖော်ပြ) လုပ်ပေးပါတယ်။ ကိုယ့်အတွက် visualizations တွေ ဖန်တီးပေးဖို့ Agent Mode ကိုလည်း သုံးနိုင်ပါတယ်။ Visualization code တွေ ထည့်နည်း, သုံးနည်း နဲ့ debug လုပ်နည်း အသေးစိတ်အတွက် — [Postman Visualizer သုံးပြီး request responses တွေကို visualize လုပ်ခြင်း](https://learning.postman.com/docs/use/send-requests/response-data/visualizer/) ကို ကြည့်ပါ။

## Server-sent events (SSE)

Server-sent events (SSE) ဆိုတာ — HTTP/S ကနေ client နဲ့ server အကြား real-time (ချက်ချင်း) ဆက်သွယ်မှုအတွက် standard server-push နည်းပညာတစ်ခု ဖြစ်ပါတယ်။ SSE က low-latency (နှောင့်နှေးမှုနည်း) နဲ့ ထိရောက်တဲ့ data ပို့လွှတ်မှုကို ထောက်ပံ့ပေးတာကြောင့် — chat apps နဲ့ live sports updates လိုမျိုး real-time updates လိုအပ်တဲ့ applications တွေမှာ ရေပန်းစားပါတယ်။

ကိုယ့် တခြား APIs တွေနဲ့အတူ SSE အခြေခံတဲ့ APIs တွေကိုလည်း Postman မှာ test, debug နဲ့ document လုပ်နိုင်ပါတယ်။

HTTP request အသစ်တစ်ခု ဖန်တီးခြင်းအားဖြင့် server-sent events တွေကို လက်ခံယူ (consume) နိုင်ပါတယ်။ Postman က SSE connection ကို တည်ဆောက်ပြီး — events တွေကို stream လုပ်ကာ ပြသပေးပါတယ်။ Response section ထဲမှာ SSE messages တွေကို အသေးစိတ် ဝင်ကြည့်ခြင်း, ရှာဖွေခြင်း နဲ့ ရှင်းလင်းခြင်းတွေ လုပ်နိုင်ပါတယ်။ Response ကိုလည်း သိမ်းနိုင်ပါတယ်။

SSE communication ကို စမ်းကြည့်ချင်ရင် — အောက်ပါ Postman Echo service endpoint ကို သုံးပါ:

```
https://postman-echo.com/server-events/:numberOfEvents
```

## Cookies

Server က ပို့လိုက်တဲ့ cookies တွေကို စစ်ဆေးဖို့ **Cookies** ကို ရွေးနိုင်ပါတယ်။ Cookie entry တစ်ခုမှာ — cookie ရဲ့ name, value, ဆက်စပ်နေတဲ့ domain နဲ့ path, နဲ့ cookie အကြောင်း တခြား အချက်အလက်တွေ ပါဝင်ပါတယ်။

Postman မှာ cookies တွေနဲ့ အလုပ်လုပ်ပုံအကြောင်း ပိုလေ့လာချင်ရင် — [Postman ရဲ့ cookie manager သုံးပြီး cookies တွေ ဖန်တီး ဖမ်းယူခြင်း](https://learning.postman.com/docs/use/send-requests/response-data/cookies/) ကို ကြည့်ပါ။

## Headers

Headers တွေကို **Headers** tab အောက်မှာ key-value pairs အနေနဲ့ ပြသပေးပါတယ်။ Header နာမည်ဘေးက information icon ပေါ်မှာ hover လုပ်ရင် — HTTP specification အရ အဲဒီ header ရဲ့ ဖော်ပြချက်ကို ကြည့်ရှုနိုင်ပါတယ်။

## Test results

ကြည့်နေတဲ့ API request မှာ tests တွေ ပါခဲ့ရင် — ရလဒ်တွေကို **Test Results** tab ထဲမှာ ပြသပေးပါတယ်။ Tab ရဲ့ header မှာ run လုပ်ခဲ့တဲ့ စုစုပေါင်း test အရေအတွက်ထဲက ဘယ်နှစ်ခု passed (အောင်မြင်) ခဲ့လဲဆိုတာ ပြပေးပါတယ်။ ရလဒ်တွေကို **Passed**, **Skipped** (ကျော်လိုက်သည်) ဒါမှမဟုတ် **Failed** (မအောင်မြင်) အုပ်စုတွေနဲ့ ကြည့်ဖို့ **Filter Results** ကို ရွေးပါ။

Request ကို နောက်တစ်ကြိမ် မပို့ဘဲ — လက်ရှိ response ပေါ်မှာ ကိုယ့် tests တွေကို ပြန် run ချင်ရင် — response pane ရဲ့ ညာဘက်အပေါ်ထောင့်က **Refresh results** ကို နှိပ်ပါ။ Server ပေါ်မှာ data တွေ ပြောင်းလဲစေတဲ့ request တစ်ခုကို ထပ်ခါထပ်ခါ run မလုပ်ချင်ဘဲ — ကိုယ့် test logic တွေကို ထပ်ကာ ထပ်ကာ ပြင်နေတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။

Postman မှာ API requests တွေကို test လုပ်တဲ့ scripts တွေ ရေးနည်းအကြောင်း ပိုလေ့လာချင်ရင် — [Postman မှာ API response data တွေကို test လုပ်ဖို့ scripts တွေ ရေးခြင်း](/docs/postman/testing) ကို ကြည့်ပါ။

## Network information

API က response ပြန်လာတဲ့အခါ Postman က network information တွေကို ပြသပေးပါတယ်။ Network icon ပေါ်မှာ hover လုပ်ရင် — သင်ပို့လိုက်တဲ့ request ရဲ့ local နဲ့ remote IP addresses တွေကို ကြည့်ရှုနိုင်ပါတယ်။

`https` request တစ်ခု လုပ်တဲ့အခါ network icon မှာ padlock (သော့ခုံပုံ) တစ်ခု ပါလာပါတယ်။ Icon ပေါ်မှာ hover လုပ်ရင် — network information မှာ [HTTP version](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/#debugging-by-http-version) နဲ့ [certificate verification](https://learning.postman.com/docs/use/send-requests/authorization/certificates/) အသေးစိတ်တွေ အပါအဝင် — အချက်အလက် ပိုပြသပေးပါတယ်။

### SSL verification errors

SSL verification ဖွင့်ထားပြီး verification မအောင်မြင်ရင် — response ပြသရာနေရာမှာ error message တစ်ခု ပြသပေးပါတယ်။ Error အကြောင်း အသေးစိတ် ကြည့်ဖို့ — link ကို ရွေးပြီး Console ကို ဖွင့်နိုင်ပါတယ်။

လိုအပ်ရင် — request အတွက်ဖြစ်စေ, Postman ထဲမှာ တစ်ခုလုံးအတွက်ဖြစ်စေ SSL verification ကို ပိတ်နိုင်ပါတယ်:

* Request တစ်ခုအတွက် SSL verification ပိတ်ဖို့ — response ထဲက error message မှာ **Disable SSL verification** ကို နှိပ်ပါ။
* SSL verification ကို တစ်ခုလုံးအတွက် ပိတ်ဖို့ — header ထဲက **Settings > App settings** ကို သွားပြီး **General > Request** အောက်မှာ **SSL certificate verification** ကို ပိတ်ပါ။

**SSL verification** ပိတ်ထားပြီး request က certificate verification error တစ်ခု ပြန်လာရင် — error အကြောင်း အသေးစိတ်အတွက် network information ပေါ်မှာ hover လုပ်နိုင်ပါတယ်။

အောင်မြင်ပြီး data တွေ ပြန်လာတဲ့ request တွေမှာ certificate verification failure ရှိရင် — [Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) ထဲမှာ warning တစ်ခု ပြသပေးပါတယ်။

## Response code

Postman က API ကနေ ပြန်လာတဲ့ response code ကို ပြသပေးပါတယ်။ Response code ပေါ်မှာ hover လုပ်ရင် — အဲဒီ code က ဘာကို ဆိုလိုတယ်ဆိုတဲ့ အတိုချုပ် ဖော်ပြချက်တစ်ခုကို ရပါတယ်။

API responses တချို့မှာ response codes တွေကို နားလည်နိုင်အောင် ကူညီတဲ့ custom messages (ကိုယ်ပိုင် message များ) တွေလည်း ပါဝင်တတ်ပါတယ်။ ဥပမာ — `401 Unauthorized` response တစ်ခု ရတယ်ဆိုရင် — အဲဒီ message က request ထဲမှာ သုံးထားတဲ့ token ကို စစ်ကြည့်ဖို့ ပြောလာနိုင်ပါတယ်။ Custom messages ပြန်လာရင် — response ရဲ့ **Body** ထဲမှာ ပြသပေးပါတယ်။

## Response time

Response က server ကနေ ရောက်လာဖို့ ကြာတဲ့ အချိန်ကို milliseconds (မီလီစက္ကန့်) နဲ့ Postman က အလိုအလျောက် တွက်ပေးပါတယ်။ ဒီအချက်အလက်က ကနဦး performance testing (စွမ်းဆောင်ရည် စမ်းသပ်မှု) တချို့အတွက် အသုံးဝင်နိုင်ပါတယ်။ Response time ပေါ်မှာ hover လုပ်ရင် — ဖြစ်စဉ်ထဲက event တစ်ခုစီ ဘယ်လောက်ကြာကြာ လုပ်ဆောင်ခဲ့လဲဆိုတဲ့ graph တစ်ခုကို ပြသပေးပါတယ်။

## Response size

Postman က response ရဲ့ size ကို ပြသပေးပါတယ်။ Response size ပေါ်မှာ hover လုပ်ရင် — body နဲ့ headers sizes တွေ သီးခြားစီ ခွဲပြီး ပြသပေးပါတယ်။

## Responses တွေကို သိမ်းခြင်း

Request တစ်ခုကို collection တစ်ခုထဲမှာ သိမ်းထားပြီးသားဆိုရင် — အဲဒီ request အတွက် responses တွေကို သိမ်းနိုင်ပါတယ်။ Response ရောက်လာပြီးတာနဲ့:

* **Save Response** ကို နှိပ်ပြီး — response ကို နောက်ပိုင်း ပြန်ကြည့်လို့ရတဲ့ [example](https://learning.postman.com/docs/use/send-requests/response-data/examples/) တစ်ခုအနေနဲ့ သိမ်းနိုင်ပါတယ်။
* **View more actions > Save response to file** ကို ရွေးပြီး — response ကို JSON file တစ်ခုအနေနဲ့ သိမ်းနိုင်ပါတယ်။
* **View more actions > Clear response** ကို ရွေးပြီး — response viewer ထဲက data တွေ အားလုံးကို ဖယ်ရှားနိုင်ပါတယ်။ Event-based requests တွေမှာတော့ — stream ပိတ်သွားပြီးမှသာ ဒီ option ကို သုံးလို့ရတာကို သတိပြု          