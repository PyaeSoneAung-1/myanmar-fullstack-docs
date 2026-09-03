---
title: "Postman built-in proxy သုံးပြီး traffic တွေကို ဖမ်းယူခြင်း"
description: "macOS (Postman v10.17 နဲ့ ၎င်းနောက်ပိုင်း) နဲ့ Windows (Postman v10.18 နဲ့ ၎င်းနောက်ပိုင်း) ပေါ်မှာ Postman ရဲ့ built-in proxy သုံးပြီး HTTP/HTTPS traffic တွေ ဖမ်းယူနည်း — proxy session စတင်ခြင်း, ထိန်းချုပ်ခြင်း, ရလဒ်တွေ ကြည့်ခြင်း, requests တွေကို collection ထဲ သိမ်းခြင်းနဲ့ client device ပေါ်မှာ proxy configure လုပ်ခြင်း"
order: 114
source: "https://learning.postman.com/docs/use/capturing-request-data/capture-with-proxy/"
status: translated
updated: 2026-09-03
---

Mobile နဲ့ desktop apps တွေ ဒါမှမဟုတ် websites တွေလို client-side applications တွေကို APIs တွေသုံးပြီး တည်ဆောက်နေရင် — app ထဲမှာ ပို့လွှတ်လိုက်တဲ့ ဒါမှမဟုတ် လက်ခံလိုက်ရတဲ့ HTTP နဲ့ HTTPS request traffic တွေကို စစ်ဆေးချင်စိတ် ဖြစ်လာနိုင်ပါတယ်။ တစ်ခါတစ်ရံမှာ documentation မရှိတဲ့ APIs တွေကိုလည်း ရှာဖွေတွေ့ရှိနိုင်ပါတယ်။ Postman ထဲမှာ built-in ပါတဲ့ proxy ကို သုံးပြီး — requests, responses နဲ့ cookies တွေ အပါအဝင် network traffic တွေကို ဖမ်းယူနိုင်ပါတယ်။

## Built-in proxy က ဘယ်လို အလုပ်လုပ်လဲ

Postman desktop app ထဲမှာ HTTP နဲ့ HTTPS traffic တွေကို ဖမ်းယူနိုင်တဲ့ built-in proxy တစ်ခု ပါဝင်ပါတယ်။ ဒါက ဘယ်လို အလုပ်လုပ်လဲ ဆိုတာက:

1. Postman desktop app က proxy ကို သုံးနေတဲ့ client app ဒါမှမဟုတ် device တစ်ခုကနေ ပြုလုပ်လိုက်တဲ့ calls တွေ အားလုံးကို နားထောင် (listen) လုပ်ပါတယ်။
2. Postman proxy က request ကို ဖမ်းယူပြီး server ဆီ ဆက်ပို့ပေးပါတယ်။
3. Server က Postman proxy ဆီ response ပြန်ပို့ပါတယ် — အဲဒီမှာ response ကို သိမ်းဆည်းလို့လည်း ရပါတယ်။
4. Response က client ဆီ ပြန်ရောက်သွားပါတယ်။

[Interceptor extension](/docs/postman/interceptor) လိုပဲ — Postman proxy က ကိုယ့် requests တွေကို intercept လုပ်ပြီး ဖမ်းယူပါတယ်။ Responses နဲ့ cookies တွေကိုလည်း ဖမ်းယူနိုင်ပါတယ်။

Postman proxy ကို စတင်လိုက်တာနဲ့ *proxy session* တစ်ခု စတင်ပါတယ် — ဒါက traffic တွေကို သတ်မှတ်ထားတဲ့ အချိန်ကာလတစ်ခုအတွင်း ဖမ်းယူတာပါ။ Proxy session ကို ခဏရပ်ထားတာ, ပြန်စတာတာ, ရပ်တန့်တာတွေ လုပ်နိုင်ပြီး — နောက်မှ နောက်တစ်ခု ထပ်စတင်နိုင်ပါတယ်။ Session တစ်ခုစီကို **History** tab ထဲမှာ မှတ်တမ်းတင်ပြီး — session ရဲ့ စုစုပေါင်း အချိန်, traffic အကျဉ်းချုပ်နဲ့ ဖမ်းယူထားတဲ့ traffic တွေ အားလုံးကို ပြသပါတယ်။ Requests နဲ့ responses တွေကို collection တစ်ခုထဲကို ပို့နိုင်သလို — [cookies တွေကို Postman cookie jar ထဲမှာ သိမ်းဆည်း](/docs/postman/syncing-cookies)တာလည်း လုပ်နိုင်ပါတယ်။

## Postman proxy ကို အသုံးပြုခြင်း

အောက်က အဆင့်တွေမှာ — ကိုယ့် computer နဲ့ ဖုန်းဆီ ရောက်လာတဲ့ ဒါမှမဟုတ် ဖုန်းကနေ ထွက်သွားတဲ့ HTTP နဲ့ HTTPS communication တွေကို စစ်ဆေးဖို့ Postman proxy ကို သုံးပါမယ်။ စတင်ဖို့ — ကိုယ့် computer နဲ့ ဖုန်းက local wireless network တစ်ခုတည်းကို ချိတ်ဆက်ထားဖို့ သေချာလုပ်ပါ။

**ဒီအဆင့်တွေက macOS (Postman v10.17 နဲ့ ၎င်းနောက်ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.18 နဲ့ ၎င်းနောက်ပိုင်း) ပေါ်မှာဆိုရင် လိုက်နာပါ။** Linux (Postman version အားလုံး), macOS (Postman v10.16 နဲ့ ၎င်းရှေ့ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.17 နဲ့ ၎င်းရှေ့ပိုင်း) ပေါ်မှာဆိုရင်တော့ — [Postman မှာ HTTP requests တွေကို ဖမ်းယူခြင်း](/docs/postman/capturing-http-requests) ကို သွားပါ။ ကိုယ့် Postman version က ဘယ်ဟာလဲ စစ်ဆေးဖို့ — header ထဲက **Settings** ကို ရွေးပြီး **Settings > About** ကို ရွေးပါ။

### အဆင့် 1: Proxy session စတင်ခြင်း

[Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#web-limitations) နဲ့ဆိုရင် Postman proxy ကို သုံးလို့ မရပါဘူး။ [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို install လုပ်ထားဖို့ သေချာလုပ်ပါ။

1. Postman footer ထဲက **Tools** ကို နှိပ်ပြီး — **Proxy** ကို ရွေးပါ။
2. (Optional) Port number ကို ပြောင်းချင်ရင် အဲဒါကို နှိပ်ပါ။ Default အနေနဲ့ port 5559 ကို သုံးထားပါတယ်။ Port number ကို မှတ်ထားပါ — နောက်မှာ clients တွေ configure လုပ်တဲ့အခါ သုံးရမှာမို့ပါ။
3. **Start Proxy Session** ကို နှိပ်ပါ။

Proxy session တစ်ခုကို ပထမဆုံးအကြိမ် စတင်တဲ့အခါ — Postman က **Postman Proxy CA** certificate ကို ကိုယ့် computer ပေါ်မှာ install လုပ်ပေးပါတယ်။ Prompt လာရင် — certificate install လုပ်ဖို့ ကိုယ့် computer ရဲ့ password ကို ရိုက်ထည့်ပါ။ Certificate install လုပ်ထားခြင်းက — Postman proxy ကို ကိုယ့် computer ပေါ်က browsers တွေနဲ့ တခြား client apps တွေကနေ ပို့လိုက်တဲ့ secure HTTPS traffic တွေကို ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။

### အဆင့် 2: Proxy session ကို ထိန်းချုပ်ခြင်း

တစ်ချိန်တည်းမှာ proxy ဒါမှမဟုတ် Interceptor session တစ်ခုထက်ပိုပြီး run လုပ်လို့ မရပါဘူး။

Proxy session ကို စတင်လိုက်တာနဲ့ — Postman proxy က ကိုယ့် computer ကနေ ပို့လိုက်တဲ့ traffic တွေကို စတင် ဖမ်းယူပါတယ်။ Proxy session တစ်ခု စတင်ပြီးတာနဲ့ — ခဏရပ်ထားတာ, ပြန်စတာတာ, ရပ်တန့်တာတွေ လုပ်နိုင်ပြီး — session အတွင်းမှာ ဘယ် traffic တွေကို ဖမ်းယူချင်လဲ ဆိုတာကိုလည်း ရွေးချယ်နိုင်ပါတယ်။

အလုပ်လုပ်နေတဲ့ ဒါမှမဟုတ် ခဏရပ်ထားတဲ့ proxy session တစ်ခုကို ထိန်းချုပ်ဖို့ — Postman footer ပေါ်က **Tools** ကို နှိပ်ပြီး footer ထဲက **Proxy** ကို ရွေးလိုက်ရင် proxy session tab ပေါ်လာပါတယ်။ Proxy tab မှာ — session ရဲ့ စုစုပေါင်း ကြာချိန်နဲ့ ဖမ်းယူထားတဲ့ data တွေရဲ့ အရွယ်အစားကို ပြသပါတယ်။

Proxy က active ဖြစ်နေတုန်း — web browser တစ်ခုကို ဖွင့်ပြီး website တစ်ခုဆီ သွားပါ၊ ဒါမှမဟုတ် server တစ်ခုနဲ့ ဆက်သွယ်တဲ့ app တစ်ခုကို ဖွင့်ပါ။ Requests တွေကို ဖမ်းယူလိုက်တာနဲ့ — proxy session tab ထဲမှာ ပေါ်လာပါတယ်။

Proxy session tab ကနေ အောက်ပါ လုပ်ဆောင်ချက်တွေကို လုပ်နိုင်ပါတယ်:

* Traffic တွေ ဖမ်းယူတာ ခဏရပ်ဖို့ **Pause** ကို နှိပ်ပြီး — ပြန်စဖို့ အသင့်ဖြစ်တဲ့အခါ **Resume** ကို နှိပ်ပါ။ Traffic တွေ ဖမ်းယူပြီးသွားရင် — proxy session အဆုံးသတ်ဖို့ **Stop** ကို နှိပ်ပါ။
* Request တစ်ခုချင်းစီရဲ့ response ကို ဖမ်းယူထားတဲ့ request နဲ့အတူ သိမ်းဖို့ — **Save responses for requests** ကို နှိပ်ပါ။
* Proxy session အတွင်းမှာ requests တွေနဲ့အတူ cookies တွေကိုပါ ဖမ်းယူချင်ရင် — **Capture cookies** ကို နှိပ်ပါ။

  Proxy session မစတင်ဘဲလည်း cookies တွေကို ဖမ်းယူပြီး Postman ထဲကို sync လုပ်နိုင်ပါတယ်။ [cookies တွေကို sync လုပ်ခြင်း](/docs/postman/syncing-cookies) အကြောင်း ပိုလေ့လာပါ။

* Column headers တွေထဲက sort icon ကို နှိပ်ပြီး — ရလဒ်တွေကို အစဉ်လိုက် (ascending) ဒါမှမဟုတ် ပြောင်းပြန် (descending) စီနိုင်ပါတယ်။
* Session active ဖြစ်နေချိန်မှာ ဖမ်းယူမယ့် requests နဲ့ responses တွေကို ကန့်သတ်ဖို့ — column headers တွေထဲက filter icon ကို နှိပ်ပါ။ Postman က ရွေးထားတဲ့ စံနှုန်းတွေနဲ့ ကိုက်ညီတဲ့ requests တွေကိုပဲ ဖမ်းယူပြီး — မကိုက်ညီတာတွေကို လျစ်လျူရှုပါတယ်။ Session အတွင်း ဘယ်အချိန်မဆို filters တွေကို ပြောင်းလဲနိုင်ပါတယ်:

  * **Status** — ဖမ်းယူတဲ့ requests တွေကို ရွေးထားတဲ့ status codes တွေနဲ့ ကန့်သတ်ပါ။
  * **Method** — ဖမ်းယူတဲ့ requests တွေကို ရွေးထားတဲ့ methods တွေနဲ့ ကန့်သတ်ပါ။
  * **URL** — ဖမ်းယူတဲ့ requests တွေကို သတ်မှတ်ထားတဲ့ စံနှုန်းတွေနဲ့ ကိုက်ညီတဲ့ URLs တွေနဲ့ ကန့်သတ်ပါ။ URLs တွေမှာ ပါဝင်ရမယ့် ဒါမှမဟုတ် မပါဝင်ရမယ့် text တွေကို သတ်မှတ်နိုင်ပြီး — regular expressions တွေလည်း သုံးနိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ filters တွေကို သက်ရောက်စေဖို့ **Enter** ကို နှိပ်ပါ။ Filter တစ်ခုကို ဖယ်ရှားဖို့ — filter ဘေးက close icon ကို နှိပ်ပါ။
  * **Type** — ဖမ်းယူတဲ့ requests တွေကို ရွေးထားတဲ့ content types တွေနဲ့ ကန့်သတ်ပါ။

  Images, audio ဒါမှမဟုတ် video တွေ ပါဝင်တဲ့ `content-type` ရှိတဲ့ responses တွေမှာ — content ကို intercept လုပ်ပြီး capture လုပ်မထားပါဘူး။ Response headers, ကြာချိန်နဲ့ status code တွေကိုပဲ ဖမ်းယူပါတယ်။

### အဆင့် 3: Proxy session ရလဒ်တွေကို ကြည့်ခြင်း

Proxy session run နေချိန်မှာ — client device ပေါ်မှာ browser ဒါမှမဟုတ် apps တွေ သုံးလိုက်တိုင်း proxy session tab က ဖမ်းယူထားတဲ့ traffic တွေကို ပြသပေးပါတယ်။ ဖမ်းယူထားတဲ့ request တစ်ခုချင်းစီရဲ့ status, method, URL, type, response size, response time နဲ့ timestamp တွေကို ကြည့်ရှုနိုင်ပါတယ်။

Proxy session ရဲ့ ရလဒ်တွေကို — session active ဖြစ်နေချိန်, ခဏရပ်ထားချိန် ဒါမှမဟုတ် session ရပ်ပြီးချိန်တွေမှာ ကြည့်ရှု လုပ်ဆောင်နိုင်ပါတယ်။

* Proxy session ကို နာမည်ပြောင်းဖို့ — **Proxy debug session** ကို နှိပ်ပြီး နာမည်အသစ်တစ်ခု ရိုက်ထည့်ပါ။
* ဝင်လာတဲ့ requests နဲ့ responses တွေအကြောင်း အချက်အလက်တွေ ကြည့်ဖို့ **Requests** tab ကို ရွေးပါ — ဒါမှမဟုတ် ဖမ်းယူထားတဲ့ cookies တွေအကြောင်း ကြည့်ဖို့ **Cookies** tab ကို ရွေးပါ။
* သီးခြား requests ဒါမှမဟုတ် cookies တွေကို ရှာဖို့ search box ကို သုံးပါ။
* Request တစ်ခုကို နှိပ်ပြီး အသေးစိတ်တွေ ကြည့်ပါ။
* Request တစ်ခုရဲ့ URL ကို နှိပ်လိုက်ရင် — Postman ထဲမှာ API request အသစ်တစ်ခုအနေနဲ့ ဖွင့်ပေးပါတယ်။
* Request ဒါမှမဟုတ် cookie တစ်ခုကို ဖျက်ဖို့ — အဲဒါကို ရွေးပြီး **Delete** ကို နှိပ်ပါ။
* [Postman cookie jar](/docs/postman/cookies) ထဲကို cookie တစ်ခု ထည့်ဖို့ — အဲဒါကို ရွေးပြီး **+ Add to Cookie Jar** ကို နှိပ်ပါ။

### အဆင့် 4: Proxy session ကို ရပ်တန့်ခြင်း

Traffic တွေ ဖမ်းယူပြီးသွားရင် — proxy session အဆုံးသတ်ဖို့ **Stop** ကို နှိပ်ပါ။ နောက်မှ proxy session ကို ပြန်ကြည့်ချင်ရင် — sidebar ထဲက **History** ကို နှိပ်ပြီး proxy session ကို ရွေးပါ။ Proxy session tab ပေါ်က **View Past Sessions** ကိုလည်း နှိပ်နိုင်ပါတယ်။

**Overview** tab မှာ — proxy session ထဲမှာ ဖမ်းယူထားတဲ့ traffic တွေရဲ့ အကျဉ်းချုပ် graphs တွေကို ပြသပါတယ်။ Dropdown menu ကို သုံးပြီး — requests တွေကို method, domain, content type ဒါမှမဟုတ် status code အလိုက် စုစည်းနိုင်ပါတယ်။ Header မှာလည်း — session စတင်ခဲ့တဲ့ အချိန်, session ရဲ့ အရွယ်အစား, ကြာချိန်နဲ့ source ကို ပြသပါတယ်။

Request list ကို filter လုပ်ဖို့ — column headers တွေထဲက filter icon ကို နှိပ်ပါ။ Postman က ရွေးထားတဲ့ filters တွေနဲ့ ကိုက်ညီတဲ့ requests တွေကိုပဲ ပြပြီး — မကိုက်ညီတာတွေကို ဝှက်ထားပါတယ်။

ဖမ်းယူထားတဲ့ requests တွေကို collection တစ်ခုထဲ သိမ်းဖို့:

1. Proxy session က active ဖြစ်နေသေးရင် အရင်ရပ်ပါ။
2. သိမ်းချင်တဲ့ requests တွေဘေးက checkbox ကို ရွေးပါ — ဒါမှမဟုတ် requests အားလုံး ရွေးချင်ရင် column header ထဲက checkbox ကို ရွေးပါ။
3. **Save Requests** ကို နှိပ်ပါ။
4. Requests တွေ သိမ်းချင်တဲ့ collection ကို ရွေးပါ — ဒါမှမဟုတ် collection အသစ်တစ်ခု ဖန်တီးဖို့ **New collection** ကို နှိပ်ပါ။
5. Collection ထဲမှာ requests တွေကို ဘယ်လို စုစည်းမလဲ ရွေးပါ။ **Domain name**, **Endpoints** ဒါမှမဟုတ် နှစ်ခုလုံးအလိုက် folders တွေထဲမှာ requests တွေကို စုစည်းဖို့ checkboxes တွေ ရွေးနိုင်ပါတယ်။
6. **Save** ကို နှိပ်ပါ။

### အဆင့် 5: Client device ပေါ်မှာ proxy ကို configure လုပ်ခြင်း

Postman proxy ကို သုံးပြီး — ဖုန်းလို client device တစ်ခုကနေ traffic တွေကို ဖမ်းယူနိုင်ပါတယ်။

1. Proxy session အသစ်တစ်ခု စတင်ပါ။ Postman footer ထဲက **Tools** ကို နှိပ်ပြီး — **Proxy** ကို ရွေးကာ **Start Proxy Session** ကို နှိပ်ပါ။
2. Proxy ကို run နေတဲ့ computer ရဲ့ local IP address ကို ရှာပါ:

   * macOS မှာ — **System Settings > Network** ထဲမှာ ကိုယ့် computer ရဲ့ IP address ကို ရှာနိုင်ပါတယ်။ Network interface တစ်ခုကို ရွေးပြီး — လိုအပ်ရင် system ရဲ့ IP address ကြည့်ဖို့ **Details > TCP/IP** ကို ရွေးပါ။
   * Windows မှာ — **Start > Settings > Network & Internet > Wi-Fi** ဒါမှမဟုတ် **Ethernet** ကို ရွေးပြီး — ကိုယ့် connection ကို ရွေးပါ။ ကိုယ့် IP address က **Properties** အောက်မှာ ဖော်ပြထားပါတယ်။

3. ကိုယ့် client device ရဲ့ wireless settings တွေကို ဖွင့်ပြီး — network connection က HTTP Proxy သုံးအောင် configuration ကို ပြင်ဆင်ပါ။ ဥပမာ — iOS မှာ:

   1. **Settings > Wi-Fi** ကို ရွေးပါ။
   2. Wi-Fi connection တစ်ခုရဲ့ ဘေးက info icon ကို နှိပ်ပါ။
   3. **Configure Proxy > Manual** ကို ရွေးပါ။
   4. **Server** နဲ့ **Port** နေရာမှာ local IP address နဲ့ proxy port ကို ထည့်ပါ။
   5. **Save** ကို နှိပ်ပါ။

4. Device ပေါ်မှာ web browser ဒါမှမဟုတ် app တစ်ခုကို ဖွင့်ပြီး — Postman ထဲက proxy session tab ပေါ်မှာ ဖမ်းယူထားတဲ့ traffic တွေကို ကြည့်ပါ။

Secure HTTPS traffic တွေကို ဖမ်းယူဖို့ — client device ပေါ်မှာ `postman-proxy-ca.crt` certificate ကို install လုပ်ထားဖို့ လိုပါတယ်။ ကိုယ့် device ပေါ်မှာ certificate ဘယ်လို install လုပ်ရမလဲ ဆိုတာ သိဖို့ — [Postman built-in proxy သုံးပြီး HTTPS traffic တွေကို ဖမ်းယူခြင်း](/docs/postman/capturing-https-traffic) ကို သွားပါ။

#### တခြား devices တွေပေါ်မှာ proxy ကို configure လုပ်ခြင်း

Developer community အသိုင်းအဝိုင်းကလည်း — operating system အမျိုးမျိုးပေါ်မှာ proxy server တစ်ခု တည်ဆောက်ဖို့ အသုံးဝင်တဲ့ tutorials တွေ ထုတ်ဝေထားပါတယ်:

* [macOS](https://support.apple.com/en-gb/guide/mac-help/mchlp2591/mac)
* [Windows](https://support.microsoft.com/en-us/windows/use-a-proxy-server-in-windows-03096c53-0554-4ffe-b6ab-8b1deee8dae1#ID0EFD=Windows_10/)
* [Linux](https://www.shellhacks.com/linux-proxy-server-settings-set-proxy-command-line/)
* [Android](https://proxyway.com/guides/android-proxy-settings)
