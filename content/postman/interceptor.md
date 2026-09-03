---
title: "Postman Interceptor သုံးပြီး web browser ကနေ traffic တွေကို ဖမ်းယူခြင်း"
description: "Postman Interceptor browser extension သုံးပြီး web browser တစ်ခုကနေ requests, responses နဲ့ cookies တွေကို ဖမ်းယူနည်း — extension တပ်ဆင်ခြင်း, Interceptor session စတင်ခြင်း, Postman ထဲမှာ ရလဒ်တွေ ကြည့်ခြင်း, requests တွေကို collection ထဲ သိမ်းခြင်းနဲ့ Interceptor Bridge တပ်ဆင်ခြင်း"
order: 115
source: "https://learning.postman.com/docs/use/capturing-request-data/interceptor/"
status: translated
updated: 2026-09-03
---

Postman Interceptor က Postman ရဲ့ အဖော် (companion) အနေနဲ့ အလုပ်လုပ်တဲ့ browser extension တစ်ခုပါ။ Interceptor ကို သုံးပြီး — web browser တစ်ခုကနေ requests နဲ့ cookies တွေ အပါအဝင် API traffic တွေကို ဖမ်းယူနိုင်ပါတယ်။ Requests ဒါမှမဟုတ် cookies တွေကို ဖမ်းယူပြီးတာနဲ့ — Postman ထဲမှာ အဲဒါတွေကို ကြည့်ရှု လုပ်ဆောင်နိုင်ပါတယ်။

စတင်ဖို့ — Interceptor extension ကို install လုပ်ပါ။ ပြီးရင် *Interceptor session* တစ်ခုကို စတင်နိုင်ပါတယ် — ဒါက traffic တွေကို သတ်မှတ်ထားတဲ့ အချိန်ကာလတစ်ခုအတွင်း ဖမ်းယူတာပါ။ Interceptor session ကို ခဏရပ်ထားတာ, ပြန်စတာတာ, ရပ်တန့်တာတွေ လုပ်နိုင်ပြီး — နောက်မှ နောက်တစ်ခု ထပ်စတင်နိုင်ပါတယ်။ Session တစ်ခုစီကို ကိုယ့် Postman ရဲ့ **History** ထဲမှာ မှတ်တမ်းတင်ပြီး — session ရဲ့ စုစုပေါင်း အချိန်, traffic အကျဉ်းချုပ်နဲ့ ဖမ်းယူထားတဲ့ traffic တွေ အားလုံးကို ပြသပါတယ်။ ပြီးသွားရင် — ဖမ်းယူထားတဲ့ requests နဲ့ responses တွေကို collection တစ်ခုထဲမှာ သိမ်းနိုင်သလို — ဖမ်းယူထားတဲ့ cookies တွေကို Postman cookie jar ထဲမှာလည်း သိမ်းနိုင်ပါတယ်။

Postman Interceptor ကို သုံးပြီး — web browser တစ်ခုကနေ Postman cookie jar ထဲကို cookies တွေကို အလိုအလျောက် sync လုပ်နိုင်ပါတယ်။ [cookies တွေကို sync လုပ်ခြင်း](/docs/postman/syncing-cookies) အကြောင်း ပိုလေ့လာပါ။

## Interceptor တပ်ဆင်ခြင်း

အောက်က links တွေကို သုံးပြီး — ကိုယ့် web browser အတွက် Interceptor extension ရဲ့ နောက်ဆုံး version ကို download လုပ်ပြီး install လုပ်ပါ။ Interceptor ကို အောက်ပါ browsers တွေအတွက် ရနိုင်ပါတယ်:

* [Google Chrome](https://go.pstmn.io/interceptor-chrome)
* [Apple Safari](https://go.pstmn.io/interceptor-safari)
* [Mozilla Firefox](https://go.pstmn.io/interceptor-firefox)
* [Microsoft Edge](https://go.pstmn.io/interceptor-edge)

Interceptor extension ကို ဖွင့်ဖို့ — ကိုယ့် browser ရဲ့ toolbar ထဲက Interceptor icon ကို ရွေးပါ။

## Interceptor session စတင်ခြင်း

Interceptor session တစ်ခု စတင်ပြီး — ကိုယ့် web browser ကနေ traffic နဲ့ cookies တွေကို ဖမ်းယူပါ။ Session ကို ရပ်လိုက်တဲ့အခါ — ဖမ်းယူထားတဲ့ traffic တွေက Postman ထဲမှာ ဖွင့်ပေးပါတယ်။ Interceptor နဲ့ Postman အကြား ဆက်သွယ်မှု အားလုံးကို encrypt လုပ်ထားပါတယ်။

တစ်ချိန်တည်းမှာ proxy ဒါမှမဟုတ် Interceptor session တစ်ခုထက်ပိုပြီး run လုပ်လို့ မရပါဘူး။

Interceptor session တစ်ခု စတင်ဖို့:

1. Extension ဖွင့်ဖို့ — ကိုယ့် browser ရဲ့ toolbar ထဲက Interceptor icon ကို နှိပ်ပါ။
2. Interceptor window ရဲ့ အောက်ခြေမှာ **Ready to capture** ဆိုတဲ့ message ပေါ်နေဖို့ သေချာလုပ်ပါ။

   **Interceptor disconnected** ဆိုတဲ့ message ပေါ်နေရင် — [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) run နေတာ ဒါမှမဟုတ် [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) ကို ကိုယ့် browser ထဲမှာ ဖွင့်ထားတာ သေချာလုပ်ပါ။ ဒါ့အပြင် Postman ထဲမှာ — edit access ရှိတဲ့ internal [workspace](/docs/postman/creating-workspaces) တစ်ခုထဲမှာ ရှိနေဖို့လည်း သေချာလုပ်ပါ။

   Postman desktop app ရဲ့ နောက်ဆုံး version ကို run မထားဘူးဆိုရင် — ဒါမှမဟုတ် desktop app ကို Linux ပေါ်မှာ run နေရင် — Interceptor ကို သုံးဖို့ [Interceptor Bridge တပ်ဆင်](#interceptor-bridge-တပ်ဆင်ခြင်း)ဖို့ လိုနိုင်ပါတယ်။

3. (Optional) **Capture Requests** tab ပေါ်မှာ — session active ဖြစ်နေချိန်မှာ ဖမ်းယူမယ့် requests နဲ့ responses တွေကို ကန့်သတ်ဖို့ dropdown menus တွေကို သုံးပါ။ Postman က ရွေးထားတဲ့ စံနှုန်းတွေနဲ့ ကိုက်ညီတဲ့ requests တွေကိုပဲ ဖမ်းယူပြီး — မကိုက်ညီတာတွေကို လျစ်လျူရှုပါတယ်။ Session အတွင်း ဘယ်အချိန်မဆို filters တွေကို ပြောင်းလဲနိုင်ပါတယ်:

   * **Methods** — ဖမ်းယူတဲ့ requests တွေကို ရွေးထားတဲ့ methods တွေနဲ့ ကန့်သတ်ပါ။
   * **All Domains & URL** — ဖမ်းယူတဲ့ requests တွေကို သတ်မှတ်ထားတဲ့ စံနှုန်းတွေနဲ့ ကိုက်ညီတဲ့ domains နဲ့ URLs တွေနဲ့ ကန့်သတ်ပါ။ Regular expressions တွေလည်း သုံးနိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ filters တွေကို သက်ရောက်စေဖို့ **Enter** ကို နှိပ်ပါ။ Filter တစ်ခုကို ဖယ်ရှားဖို့ — filter ဘေးက close icon ကို နှိပ်ပါ။

4. **Capture Requests** tab ပေါ်မှာ — **Start Capture** ကို နှိပ်ပါ။

   Web browser ကို သုံးလိုက်တာနဲ့ — Interceptor က requests နဲ့ cookies တွေကို စတင် ဖမ်းယူပါတယ်။ Interceptor extension မှာ — မကြာသေးတဲ့ requests တွေနဲ့ session ရဲ့ ကြာချိန်ကို ပြသပါတယ်။

5. Traffic တွေ ဖမ်းယူပြီးသွားရင် — session အဆုံးသတ်ဖို့ **Stop Capture** ကို နှိပ်ပါ။

Interceptor session တစ်ခု စတင်စရာ မလိုဘဲ — Interceptor extension ကို သုံးပြီး ကိုယ့် browser ကနေ Postman cookie jar ထဲကို cookies တွေကို အလိုအလျောက် sync လုပ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် — [Postman Interceptor နဲ့ Postman proxy သုံးပြီး cookies တွေကို sync လုပ်ခြင်း](/docs/postman/syncing-cookies) ကို ကြည့်ပါ။

## Postman ထဲမှာ Interceptor ရလဒ်တွေကို ကြည့်ခြင်း

Interceptor session တစ်ခုကို ရပ်လိုက်တဲ့အခါ — Postman က ရလဒ်တွေကို Postman ထဲမှာ အလိုအလျောက် ဖွင့်ပေးပါတယ်။ Session ရလဒ်တွေကို Postman ထဲမှာ ဖွင့်ဖို့ — **View in Postman** ကိုလည်း နှိပ်နိုင်ပါတယ်။

Postman web app ဖွင့်ထားရင် — session ရလဒ်တွေက web app ဒါမှမဟုတ် desktop app ထဲမှာ ဖွင့်ပါတယ် — ဘယ်ဟာက Interceptor နဲ့ နောက်ဆုံး ချိတ်ဆက်ထားလဲ ပေါ်မူတည်ပါတယ်။ Web app မဖွင့်ထားဘူးဆိုရင် — ရလဒ်တွေက Postman desktop app ထဲမှာ ဖွင့်ပါတယ်။

နောက်မှ Interceptor session ကို ပြန်ကြည့်ချင်ရင် — sidebar ထဲက **History tab** ကို နှိပ်ပြီး Interceptor session တစ်ခုကို ရွေးပါ။ Interceptor session tab ပေါ်က **View Past Sessions** ကိုလည်း နှိပ်နိုင်ပါတယ်။

**Overview** tab မှာ — Interceptor session ထဲမှာ ဖမ်းယူထားတဲ့ traffic တွေရဲ့ အကျဉ်းချုပ် graphs တွေကို ပြသပါတယ်။ Dropdown menu ကို သုံးပြီး — requests တွေကို method, domain ဒါမှမဟုတ် content type အလိုက် စုစည်းနိုင်ပါတယ်။ Header မှာလည်း — session စတင်ခဲ့တဲ့ အချိန်, session ရဲ့ အရွယ်အစား, ကြာချိန်နဲ့ source ကို ပြသပါတယ်။

Interceptor session ရဲ့ ရလဒ်တွေကို အောက်ပါ နည်းလမ်းတွေနဲ့ လုပ်ဆောင်နိုင်ပါတယ်:

* Interceptor session ကို နာမည်ပြောင်းဖို့ — **Interceptor debug session** ဆိုတဲ့ နာမည်ကို နှိပ်ပြီး နာမည်အသစ်တစ်ခု ရိုက်ထည့်ပါ။
* ဝင်လာတဲ့ requests နဲ့ responses တွေအကြောင်း အချက်အလက်တွေ ကြည့်ဖို့ **Requests** tab ကို ရွေးပါ — ဒါမှမဟုတ် ဖမ်းယူထားတဲ့ cookies တွေအကြောင်း ကြည့်ဖို့ **Cookies** tab ကို ရွေးပါ။
* သီးခြား requests ဒါမှမဟုတ် cookies တွေကို ရှာဖို့ search box ကို သုံးပါ။
* Column headers တွေထဲက sort icon ကို နှိပ်ပြီး — ရလဒ်တွေကို အစဉ်လိုက် (ascending) ဒါမှမဟုတ် ပြောင်းပြန် (descending) စီနိုင်ပါတယ်။
* Request list ကို filter လုပ်ဖို့ — column headers တွေထဲက filter icon ကို နှိပ်ပါ။ Postman က ရွေးထားတဲ့ filters တွေနဲ့ ကိုက်ညီတဲ့ requests တွေကိုပဲ ပြပြီး — မကိုက်ညီတာတွေကို ဝှက်ထားပါတယ်။
* Request တစ်ခုကို နှိပ်ပြီး အသေးစိတ်တွေ ကြည့်ပါ။
* Request တစ်ခုရဲ့ URL ကို နှိပ်လိုက်ရင် — Postman ထဲမှာ API request အသစ်တစ်ခုအနေနဲ့ ဖွင့်ပေးပါတယ်။
* Request ဒါမှမဟုတ် cookie တစ်ခုကို ဖျက်ဖို့ — အဲဒါကို ရွေးပြီး **Delete** ကို နှိပ်ပါ။
* [Postman cookie jar](/docs/postman/cookies) ထဲကို cookie တစ်ခု ထည့်ဖို့ — အဲဒါကို ရွေးပြီး **+ Add to Cookie Jar** ကို နှိပ်ပါ။

## ဖမ်းယူထားတဲ့ requests တွေကို collection တစ်ခုထဲ သိမ်းခြင်း

Interceptor session တစ်ခုအတွင်းမှာ ဖမ်းယူထားတဲ့ requests တွေကို collection တစ်ခုထဲကို သိမ်းနိုင်ပါတယ်။

1. Sidebar ထဲက **History tab** ကို နှိပ်ပြီး — requests တွေ သိမ်းချင်တဲ့ Interceptor session ကို ရွေးပါ။
2. သိမ်းချင်တဲ့ requests တွေဘေးက checkbox ကို ရွေးပါ — ဒါမှမဟုတ် requests အားလုံး ရွေးချင်ရင် column header ထဲက checkbox ကို ရွေးပါ။
3. **Save Requests** ကို နှိပ်ပါ။
4. Requests တွေ သိမ်းချင်တဲ့ collection ကို ရွေးပါ — ဒါမှမဟုတ် collection အသစ်တစ်ခု ဖန်တီးဖို့ **New collection** ကို နှိပ်ပါ။
5. Collection ထဲမှာ requests တွေကို ဘယ်လို စုစည်းမလဲ ရွေးပါ။ **Domain name**, **Endpoints** ဒါမှမဟုတ် နှစ်ခုလုံးအလိုက် folders တွေထဲမှာ requests တွေကို စုစည်းဖို့ checkboxes တွေ ရွေးနိုင်ပါတယ်။
6. **Save Requests** ကို နှိပ်ပါ။

## Interceptor Bridge တပ်ဆင်ခြင်း

သုံးနေတဲ့ [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ရဲ့ version ပေါ်မူတည်ပြီး — Postman Interceptor ကို မသုံးခင် Interceptor Bridge ကို install လုပ်ဖို့ လိုနိုင်ပါတယ်:

* [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) သုံးနေရင် — ဒီအဆင့်ကို ကျော်လို့ရပါတယ်။ Interceptor Bridge မလိုပါဘူး။
* macOS (Postman v10.17.4 ဒါမှမဟုတ် ၎င်းနောက်ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.18 ဒါမှမဟုတ် ၎င်းနောက်ပိုင်း) ပေါ်မှာဆိုရင်လည်း — ဒီအဆင့်ကို ကျော်လို့ရပါတယ်။ Interceptor Bridge က ကိုယ့် Postman version ထဲမှာ built-in ပါပြီးသားပါ။
* Linux (Postman version အားလုံး), macOS (Postman v10.16 နဲ့ ၎င်းရှေ့ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.17 နဲ့ ၎င်းရှေ့ပိုင်း) ပေါ်မှာဆိုရင်တော့ — requests နဲ့ cookies တွေ မဖမ်းယူခင် Interceptor Bridge ကို အရင် install လုပ်ရပါမယ်။

ကိုယ့် Postman version က ဘယ်ဟာလဲ စစ်ဆေးဖို့ — header ထဲက **Settings** ကို နှိပ်ပြီး — **App settings > About** ကို ရွေးပါ။

Interceptor Bridge install လုပ်ဖို့ — Postman footer ထဲက **Capture requests** ကို နှိပ်ပါ။ ပြီးရင် **Via Interceptor** tab ကို ရွေးပြီး — **Install Interceptor Bridge** ကို ရွေးပါ။
