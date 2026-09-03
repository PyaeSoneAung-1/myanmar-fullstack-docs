---
title: "Postman မှာ HTTP requests တွေကို ဖမ်းယူခြင်း"
description: "Linux (Postman version အားလုံး), macOS (Postman v10.16 နဲ့ ၎င်းရှေ့ပိုင်း) နဲ့ Windows (Postman v10.17 နဲ့ ၎င်းရှေ့ပိုင်း) ပေါ်မှာ Postman ရဲ့ built-in proxy သုံးပြီး HTTP requests တွေ ဖမ်းယူနည်း — proxy enable လုပ်ခြင်း, proxy debug session စတင်ခြင်း, client device ပေါ်မှာ proxy configure လုပ်ခြင်း စတဲ့ အဆင့်တွေကို အပြည့်အစုံ ရှင်းပြထားပါတယ်။"
order: 112
source: "https://learning.postman.com/docs/use/capturing-request-data/capturing-http-requests/"
status: translated
updated: 2026-09-03
---

**ဒီအဆင့်တွေက Linux (Postman version အားလုံး), macOS (Postman v10.16 နဲ့ ၎င်းရှေ့ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.17 နဲ့ ၎င်းရှေ့ပိုင်း) ပေါ်မှာ ဆိုရင် လိုက်နာပါ။** macOS (Postman v10.17 နဲ့ ၎င်းနောက်ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.18 နဲ့ ၎င်းနောက်ပိုင်း) ပေါ်မှာဆိုရင်တော့ — [Postman proxy သုံးပြီး requests တွေကို ဖမ်းယူခြင်း](/docs/postman/capture-with-proxy) ကို သွားပါ။ ကိုယ့် Postman version က ဘယ်ဟာလဲ စစ်ဆေးဖို့ — header ထဲက **Settings** ကို ရွေးပြီး — **Settings > About** ကို ရွေးပါ။

Websites တွေ, mobile နဲ့ desktop apps တွေလို client-side applications တွေကို APIs တွေသုံးပြီး တည်ဆောက်တဲ့အခါ — HTTP နဲ့ HTTPS request traffic တွေကို စစ်ဆေးကြည့်ချင်စိတ် ဖြစ်လာနိုင်ပါတယ်။ တစ်ခါတစ်ရံမှာ documentation မရှိတဲ့ APIs တွေကိုလည်း ရှာဖွေတွေ့ရှိနိုင်ပါတယ်။ Postman ထဲမှာ built-in ပါတဲ့ proxy ကို သုံးပြီး — requests, responses နဲ့ cookies တွေ အပါအဝင် network traffic တွေကို ဖမ်းယူနိုင်ပါတယ်။

Postman proxy ကို သုံးပြီး browser တစ်ခုကနေ Postman cookie jar ထဲကို cookies တွေကို အလိုအလျောက် sync လုပ်နိုင်ပါတယ်။ [cookies တွေကို sync လုပ်ခြင်း](/docs/postman/syncing-cookies) အကြောင်း ပိုလေ့လာပါ။

## Built-in proxy က ဘယ်လို အလုပ်လုပ်လဲ

Postman app ထဲမှာ HTTP နဲ့ HTTPS traffic တွေကို ဖမ်းယူနိုင်တဲ့ built-in proxy တစ်ခု ပါဝင်ပါတယ်။ ဒါက ဘယ်လို အလုပ်လုပ်လဲ ဆိုတာက:

1. Postman app က proxy ကို သုံးနေတဲ့ client app ဒါမှမဟုတ် device တစ်ခုကနေ ပြုလုပ်လိုက်တဲ့ calls တွေ အားလုံးကို နားထောင် (listen) လုပ်ပါတယ်။
2. Postman proxy က request ကို ဖမ်းယူပြီး server ဆီ ဆက်ပို့ပေးပါတယ်။
3. Server က Postman proxy ဆီ response ပြန်ပို့ပါတယ် — အဲဒီမှာ response ကို သိမ်းဆည်းလို့လည်း ရပါတယ်။
4. Response က client ဆီ ပြန်ရောက်သွားပါတယ်။

[Interceptor extension](/docs/postman/interceptor) လိုပဲ — Postman app ရဲ့ proxy က ကိုယ့် requests တွေကို intercept လုပ်ပြီး ဖမ်းယူပါတယ်။ Responses နဲ့ cookies တွေကိုလည်း ဖမ်းယူနိုင်ပါတယ်။

Postman proxy ကို စတင်ပြီးတဲ့နောက်မှာ — traffic တွေကို သတ်မှတ်ထားတဲ့ အချိန်ကာလတစ်ခုအတွင်း ဖမ်းယူတဲ့ proxy debug session တစ်ခုကို စတင်နိုင်ပါတယ်။ Proxy debug session ကို စတင်လို့ရသလို — ခဏရပ်ထားတာ (pause), ရပ်တန့်တာ (stop) တွေလည်း လုပ်နိုင်ပြီး နောက်မှ နောက်တစ်ခု ထပ်စတင်နိုင်ပါတယ်။ Debug session တစ်ခုစီကို **History** tab ထဲမှာ မှတ်တမ်းတင်ပြီး — session ရဲ့ စုစုပေါင်း အချိန်, traffic အကျဉ်းချုပ်နဲ့ ဖမ်းယူထားတဲ့ traffic တွေ အားလုံးကို ပြသပါတယ်။ Requests နဲ့ responses တွေကို collection တစ်ခုထဲကို ပို့နိုင်သလို — cookies တွေကို Postman cookie jar ထဲမှာလည်း သိမ်းဆည်းနိုင်ပါတယ်။

## Postman proxy ကို အသုံးပြုခြင်း

အောက်က အဆင့်တွေမှာ — ဖုန်းတစ်လုံးဆီ ရောက်လာတဲ့ ဒါမှမဟုတ် ဖုန်းကနေ ထွက်သွားတဲ့ HTTP communication တွေကို စစ်ဆေးဖို့ Postman app ရဲ့ proxy ကို သုံးပါမယ်။ စတင်ဖို့ — ကိုယ့် computer နဲ့ ဖုန်းက local wireless network တစ်ခုတည်းကို ချိတ်ဆက်ထားဖို့ သေချာလုပ်ပါ။

### အဆင့် 1: Proxy ကို enable လုပ်ခြင်း

[Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#web-limitations) နဲ့ဆိုရင် Postman proxy ကို သုံးလို့ မရပါဘူး။ [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို install လုပ်ထားဖို့ သေချာလုပ်ပါ။

1. Postman footer ထဲက **Capture requests** ကို ရွေးပါ။
2. **Capture requests** window ထဲမှာ **Via Proxy** tab ကို ရွေးပါ။
3. ညာဘက်အပေါ်မှာ — **Enable proxy** ကို ရွေးပါ။
4. Port number တစ်ခု ရိုက်ထည့်ပါ။ Default အနေနဲ့ port 5555 ကို သုံးထားပါတယ်။ သုံးထားတဲ့ port number ကို မှတ်ထားပါ — နောက်မှာ clients တွေ configure လုပ်တဲ့အခါ သုံးရမှာမို့ပါ။
5. **Enable Proxy** ကို ရွေးပါ။

ဒါဆိုရင် proxy က run နေပါပြီ — ဒါပေမယ့် proxy debug session တစ်ခု မစတင်မချင်း traffic တွေကို ဖမ်းယူမှာ မဟုတ်ပါဘူး။

### အဆင့် 2: Proxy debug session ကို စတင်ခြင်း

Proxy က run နေပြီဆိုရင် — proxy debug session တစ်ခု စတင်နိုင်ပါတယ်။ ဒါက သတ်မှတ်ထားတဲ့ အချိန်ကာလတစ်ခုအတွင်း ဖမ်းယူတဲ့ session ဖြစ်ပြီး — ဖမ်းယူလိုက်တဲ့ traffic တွေကို **History** tab ထဲက entry တစ်ခုအနေနဲ့ သိမ်းဆည်းပြီး လိုချင်ရင် collection တစ်ခုထဲကိုလည်း သိမ်းပါတယ်။ Proxy debug session တစ်ခု စတင်ပြီးတာနဲ့ — ခဏရပ်ထားတာ, ပြန်စတာတာ, ရပ်တန့်တာတွေ လုပ်လို့ရပါတယ်။ Session မစတင်ခင် — ဘယ် traffic တွေကို session ထဲ ထည့်ချင်လဲ ရွေးချယ်နိုင်ပါတယ်။

တစ်ချိန်တည်းမှာ proxy ဒါမှမဟုတ် Interceptor debug session တစ်ခုတည်းကိုပဲ run လုပ်နိုင်ပါတယ်။

Proxy debug session တစ်ခု စတင်ဖို့:

1. **Capture requests** window ရဲ့ **Via Proxy** tab ကို သွားပါ။
2. Request တစ်ခုချင်းစီရဲ့ responses တွေကိုပါ သိမ်းဖို့ **Save Responses for Requests** ကို ရွေးပါ။ အဲဒီ responses တွေကို ဖမ်းယူထားတဲ့ requests တွေနဲ့အတူ သိမ်းဆည်းပေးပါတယ်။

   Images, audio ဒါမှမဟုတ် video တွေ ပါဝင်တဲ့ `content-type` ရှိတဲ့ responses တွေမှာ — content ကို intercept လုပ်ပြီး capture လုပ်မထားပါဘူး။ Response headers, ကြာချိန်နဲ့ status code တွေကိုပဲ ဖမ်းယူပါတယ်။

3. Debug session အတွင်းမှာ requests တွေအပြင် cookies တွေကိုပါ ဖမ်းယူချင်ရင် — **Capture Cookies** ကို ရွေးပါ။

   Debug session မစတင်ဘဲလည်း cookies တွေကို ဖမ်းယူပြီး Postman ထဲကို sync လုပ်နိုင်ပါတယ်။ [cookies တွေကို sync လုပ်ခြင်း](/docs/postman/syncing-cookies) အကြောင်း ပိုလေ့လာပါ။

4. Requests တွေကို sidebar ထဲက **History** tab ထဲက debug session တစ်ခုထဲမှာ သိမ်းပါတယ်။ Requests တွေကို collection တစ်ခုထဲမှာပါ သိမ်းချင်ရင် — **Save requests to a collection** ကို ရွေးပြီး စာရင်းထဲကနေ collection တစ်ခု ရွေးပါ။ Requests တွေ သိမ်းဖို့ collection အသစ်တစ်ခု ဖန်တီးချင်ရင် — collection အသစ်ရဲ့ နာမည်တစ်ခု ရိုက်ထည့်ပြီး **Create** ကို ရွေးပါ။
5. Requests နဲ့ responses တွေကို collection တစ်ခုထဲ သိမ်းရင် — default အနေနဲ့ အချိန်စဉ်အလိုက် ထည့်ပေးပါတယ်။ ဒါမှမဟုတ် domain name ဒါမှမဟုတ် endpoints အလိုက် folders တွေထဲမှာ စုစည်းနိုင်ပါတယ်။ **Organize requests by** အောက်မှာ — **Domain name**, **Endpoints** ဒါမှမဟုတ် နှစ်ခုလုံးကို ရွေးပါ။ အဲဒါဆိုရင် ကိုယ့် requests နဲ့ responses တွေကို ရွေးထားတဲ့ collection ထဲက folders တွေထဲမှာ စုစည်းပေးပါတယ်။
6. **Configure Incoming Requests** အောက်မှာ — ဖမ်းယူမယ့် requests နဲ့ responses တွေကို ကန့်သတ်ဖို့ နောက်ထပ် option တွေလည်း ရှိပါတယ်:

   * **URL must contain** — သတ်မှတ်ထားတဲ့ string ဒါမှမဟုတ် regular expression ပါဝင်တဲ့ URLs တွေကိုပဲ ဖမ်းယူပါ။
   * **URL cannot contain** — သတ်မှတ်ထားတဲ့ string ဒါမှမဟုတ် regular expression ပါဝင်တဲ့ URLs တွေကို မဖမ်းယူပါ။
   * **Methods** — ရွေးထားတဲ့ methods တွေကိုပဲ ဖမ်းယူပါ။
   * **Resources** — image, JS ဒါမှမဟုတ် CSS responses တွေရှိတဲ့ requests တွေကို ချန်လှပ်ပါ။

7. **Start Capture** ကို ရွေးပါ။

Proxy debug session က စတင်သွားပါပြီ — ဒါပေမယ့် device တစ်ခုကို proxy နဲ့ configure မလုပ်ရသေးသရွေ့ ဘာမှ ဖမ်းယူမှာ မဟုတ်ပါဘူး။

### အဆင့် 3: Client device ပေါ်မှာ proxy ကို configure လုပ်ခြင်း

1. Proxy ကို run နေတဲ့ machine ရဲ့ local IP address ကို ရှာပါ:

   * macOS မှာ — **System Preferences > Network** ထဲမှာ computer ရဲ့ IP address ကို ရှာနိုင်ပါတယ်။ Network interface တစ်ခုကို ရွေးလိုက်ရင် — system ရဲ့ IP address က ညာဘက်မှာ ပေါ်လာပါလိမ့်မယ်။
   * Windows မှာ — **Start > Settings > Network & internet > Wi-Fi** ဒါမှမဟုတ် **Ethernet** ကို ရွေးပါ။ ကိုယ့် IP address က **Properties** အောက်မှာ ဖော်ပြထားပါတယ်။

2. ကိုယ့် client device ရဲ့ wireless settings တွေကို ဖွင့်ပြီး — network connection က HTTP Proxy သုံးအောင် configuration ကို ပြင်ဆင်ပါ။ ဥပမာ — iOS မှာ:

   1. **Settings > Wi-Fi** ကို ရွေးပါ။
   2. Wi-Fi connection တစ်ခုရဲ့ ဘေးက info icon ကို ရွေးပါ။
   3. **HTTP Proxy > Configure Proxy > Manual** ကို ရွေးပါ။
   4. **Server** နဲ့ **Port** နေရာမှာ local IP address နဲ့ proxy port ကို ထည့်ပါ။
   5. **Save** ကို ရွေးပါ။

3. Postman app ထဲမှာ — **Proxy debug session** window ကို ဖွင့်ပါ။ Device ရဲ့ web browser ဒါမှမဟုတ် application ကို ဖွင့်လိုက်တာနဲ့ — HTTP traffic တွေက app ဒါမှမဟုတ် browser ကို ဖြတ်သန်းစပြုပါလိမ့်မယ်။

#### တခြား devices တွေပေါ်မှာ proxy ကို configure လုပ်ခြင်း

Developer community အသိုင်းအဝိုင်းကလည်း — operating system အမျိုးမျိုးပေါ်မှာ proxy server တစ်ခု တည်ဆောက်ဖို့ အသုံးဝင်တဲ့ tutorials တွေ ထုတ်ဝေထားပါတယ်:

* [Windows](https://support.microsoft.com/en-us/windows/use-a-proxy-server-in-windows-03096c53-0554-4ffe-b6ab-8b1deee8dae1)
* [Linux](https://www.shellhacks.com/linux-proxy-server-settings-set-proxy-command-line/)
* [macOS](https://support.apple.com/en-gb/guide/mac-help/mchlp2591/mac)
* [Android](https://www.howtogeek.com/295048/how-to-configure-a-proxy-server-on-android/)

### အဆင့် 4: Proxy debug session ကို run လုပ်ခြင်း

Capture session run နေချိန်မှာ — client device ပေါ်မှာ browser ဒါမှမဟုတ် apps တွေ သုံးလိုက်တိုင်း **Proxy Debug Session** window က ဖမ်းယူထားတဲ့ traffic တွေကို ပြသပေးပါတယ်။

Traffic တွေကို ဖမ်းယူနေစဉ် — ကန့်သတ်ဖို့, စုစည်းဖို့ နဲ့ စူးစမ်းလေ့လာဖို့ သုံးလို့ရတဲ့ controls တွေ အများကြီး ရှိပါတယ်:

* **Proxy debug session** ကို ရွေးပြီး session ကို နာမည်ပြောင်းဖို့ နာမည်အသစ်တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။
* Window ရဲ့ အပေါ်မှာရှိတဲ့ **Configure incoming requests** controls တွေက — ဖမ်းယူတဲ့ traffic တွေကို ကန့်သတ်နိုင်အောင် လုပ်ပေးပါတယ်။ Traffic ကန့်သတ်ဖို့ **Methods**, **Status Codes**, **Resources** နဲ့ **URL** ကနေ items တွေ ရွေးပါ။ ဒီ controls တွေက အဆင့် 2 မှာ အစပိုင်း သတ်မှတ်ခဲ့တဲ့ဟာတွေနဲ့ ဆင်တူပါတယ် — ဒါပေမယ့် proxy ကို ဖြတ်သန်းသွားတာတွေအစား — ဘာတွေကို ဖမ်းယူနေလဲ ဆိုတာကို ကန့်သတ်ပေးတာ ဖြစ်ပါတယ်။
* Responses ဒါမှမဟုတ် cookies တွေ စုဆောင်းချင်လား ဆိုတာ ရွေးဖို့ — **Save Responses for Requests** နဲ့ **Capture Cookies** ကို select ဒါမှမဟုတ် deselect လုပ်ပါ။
* ဝင်လာတဲ့ requests နဲ့ responses တွေအကြောင်း အချက်အလက်တွေ ကြည့်ဖို့ **Requests** tab ကို ရွေးပါ — ဒါမှမဟုတ် ဖမ်းယူထားတဲ့ cookies တွေအကြောင်း ကြည့်ဖို့ **Cookies** tab ကို ရွေးပါ။
* သီးခြား requests တွေကို ရှာဖို့ search box ကို သုံးပါ။
* Request တစ်ခုရဲ့ ဘေးက **>** ကို ရွေးပြီး — အသေးစိတ်တွေ ကြည့်ဖို့ ချဲ့နိုင်ပါတယ်။
* **URL** column ထဲက URL တစ်ခုကို ရွေးလိုက်ရင် — request ကို Postman ထဲမှာ API request အသစ်တစ်ခုအနေနဲ့ ဖွင့်ပေးပါတယ်။
* Request list ရဲ့ အောက်မှာ — traffic တွေ ပို့နေတဲ့ collection ကို ပြောင်းဖို့နဲ့ domain name ဒါမှမဟုတ် endpoints အလိုက် စုစည်းဖို့ လိုမလိုကို သတ်မှတ်ဖို့ controls တွေ ရှိပါတယ်။

**Requests** tab ထဲက စာရင်းထဲကနေ request တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရွေးလိုက်ရင် — အောက်ပါ controls တွေကို သုံးနိုင်ပါတယ်:

* **Delete** — request ကို ဖျက်ပါ။

**Cookies** tab ထဲက စာရင်းထဲကနေ cookie တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရွေးလိုက်ရင် — အောက်ပါ controls တွေကို သုံးနိုင်ပါတယ်:

* **+ Add to Cookie Jar** — cookie ကို [Postman cookie jar](/docs/postman/cookies) ထဲကို ထည့်ပါ။
* **Delete** — cookie ကို ဖျက်ပါ။

အောက်ညာဘက် ထောင့်မှာ — capture session ရဲ့ စုစုပေါင်း အချိန်နဲ့ ဖမ်းယူထားတဲ့ traffic တွေရဲ့ စုစုပေါင်း အရွယ်အစားကို ပြသပါတယ်။ Capture session ကို ခဏတာ ရပ်ထားချင်ရင် — **Pause** ကို ရွေးပါ။ Session ကို ပြန်စချင်ရင် **Resume** ကို ရွေးပါ။

### အဆင့် 5: Debug session နဲ့ proxy ကို ရပ်တန့်ခြင်း

Debug session ပြီးသွားရင် — အောက်ညာဘက် ထောင့်က **Stop** ကို ရွေးပါ။ ဒါက session ကို ရပ်တန့်ပေးပြီး — debug session ရဲ့ ရလဒ်တွေကို **History** tab ထဲမှာ သိမ်းဆည်းပေးပါတယ်။

Session ရပ်ပြီးနောက်မှာတော့ proxy က ဆက်ပြီး run နေပါသေးတယ်။ Postman footer ထဲက **Capture requests** ကို ရွေးပြီး — debug session အသစ်တစ်ခု စတင်နိုင်သလို — proxy ပိတ်ချင်ရင် **Disable proxy** ကိုလည်း ရွေးနိုင်ပါတယ်။

### အဆင့် 6: Proxy debug session ရဲ့ ရလဒ်တွေကို ကြည့်ခြင်း

Debug session တစ်ခု ပြီးသွားရင် — session ရဲ့ အသေးစိတ်တွေကို **History** tab ထဲမှာ **Proxy debug session** ဆိုတဲ့ နာမည်နဲ့ သိမ်းထားပါတယ်။ သိမ်းထားတဲ့ debug session တစ်ခု ဖွင့်လိုက်ရင် — အပေါ်ဆုံး header မှာ session စတင်ခဲ့တဲ့ အချိန်, စုစုပေါင်း အရွယ်အစား, ကြာချိန်နဲ့ source ကို ပြသပါတယ်။

**Overview** tab မှာ — session ထဲမှာ ဖမ်းယူထားတဲ့ traffic တွေရဲ့ အကျဉ်းချုပ် graphs တွေကို ပြသပါတယ်။ Method, domain, data mode ဒါမှမဟုတ် return status code အလိုက် traffic အကျဉ်းချုပ် ဖော်ပြတဲ့ graphs တွေကို ရွေးကြည့်နိုင်ပါတယ်။

**Requests** နဲ့ **Cookies** tabs တွေက — capture session အတွင်းမှာ ရနိုင်တဲ့ tabs တွေလိုပဲ requests, responses နဲ့ cookies တွေကို ပြသပါတယ်။ အဆင့် 4 မှာ ဖော်ပြထားတဲ့ — items တွေကို ရှာဖွေခြင်း, ချဲ့ကြည့်ခြင်း, သိမ်းခြင်း, ဖျက်ခြင်း option တွေကိုပဲ သုံးနိုင်ပါတယ်။ ရွေးထားတဲ့ requests တွေကို collection တစ်ခုထဲကိုလည်း ထည့်နိုင်ပါတယ်။ Table ရဲ့ အောက်မှာရှိတဲ့ controls တွေကို သုံးပြီး — တစ်မျက်နှာမှာ ပြမယ့် items အရေအတွက်ကို ကန့်သတ်နိုင်သလို ရလဒ်တွေရဲ့ စာမျက်နှာတွေကိုလည်း ကြည့်နိုင်ပါတယ်။

Window ရဲ့ အပေါ်မှာရှိတဲ့ နာမည်ကို ရွေးပြီး နာမည်အသစ်တစ်ခု ရိုက်ထည့်ခြင်းအားဖြင့် — proxy debug session တစ်ခုကို နာမည်ပြောင်းနိုင်ပါတယ်။ Session ကို နာမည်ပြောင်းဖို့ ဒါမှမဟုတ် ဖျက်ဖို့ — debug session နာမည်ဘေးက **View more actions** ကို ရွေးပါ။

## နောက်တစ်ဆင့်များ

ကိုယ့် client devices တွေကနေ HTTPS data တွေကိုပါ ဖမ်းယူချင်ရင် — client ပေါ်မှာ certificate တစ်ခု ထည့်ဖို့ လိုပါတယ်။ အသေးစိတ်အတွက် — [Postman built-in proxy သုံးပြီး HTTPS traffic တွေကို ဖမ်းယူခြင်း](/docs/postman/capturing-https-traffic) ကို ကြည့်ပါ။
