---
title: "Postman Interceptor နဲ့ Postman proxy သုံးပြီး cookies တွေကို sync လုပ်ခြင်း"
description: "Postman Interceptor နဲ့ Postman proxy ကို သုံးပြီး web browser ဒါမှမဟုတ် client application တွေကနေ Postman cookie jar ထဲကို cookies တွေ စဉ်ဆက်မပြတ် sync လုပ်နည်း — domains သတ်မှတ်ခြင်း, subdomains တွေအတွက်ပါ sync လုပ်ပုံနဲ့ sync လုပ်တာ ရပ်တန့်ခြင်း"
order: 116
source: "https://learning.postman.com/docs/use/capturing-request-data/syncing-cookies/"
status: translated
updated: 2026-09-03
---

Web browser တစ်ခု ဒါမှမဟုတ် တခြား client application တစ်ခုကနေ [Postman cookie jar](/docs/postman/cookies) ထဲကို — cookies တွေကို ဖမ်းယူပြီး sync လုပ်နိုင်အောင် Postman က လုပ်ပေးပါတယ်။ [Proxy ဒါမှမဟုတ် Interceptor session](/docs/postman/capture-overview) တစ်ခု စတင်စရာ မလိုဘဲ — Postman proxy ဒါမှမဟုတ် Postman Interceptor ကို သုံးပြီး ဘယ်အချိန်မဆို cookies တွေကို sync လုပ်နိုင်ပါတယ်။

Configure လုပ်ပြီးသွားရင် — Postman က browser ဒါမှမဟုတ် client applications တွေကနေ cookies တွေကို စဉ်ဆက်မပြတ် ဖမ်းယူပါတယ်။ ကိုယ် သတ်မှတ်ထားတဲ့ domains တွေအတွက် — ဖမ်းယူလိုက်တဲ့ cookies တွေကို Postman cookie jar ထဲကို အလိုအလျောက် sync လုပ်ပေးပါတယ်။ ပြီးရင် Postman ကနေ requests တွေ ပို့တဲ့အခါ — [အဲဒီ cookies တွေကို သုံး](/docs/postman/cookies)နိုင်ပါတယ်။

Proxy ဒါမှမဟုတ် Interceptor session တစ်ခုအတွင်းမှာလည်း requests နဲ့ cookies တွေကို ဖမ်းယူနိုင်ပါတယ်။ [Postman proxy](/docs/postman/capturing-http-requests) ဒါမှမဟုတ် [Postman Interceptor](/docs/postman/interceptor) နဲ့ requests နဲ့ cookies တွေ ဖမ်းယူခြင်းအကြောင်း ပိုလေ့လာပါ။

## Postman Interceptor နဲ့ cookies တွေကို sync လုပ်ခြင်း

Postman Interceptor က web browser တစ်ခုကနေ network requests တွေကို ဖမ်းယူပြီး Postman ထဲကို သိမ်းပေးတဲ့ browser extension တစ်ခုပါ။ Interceptor ကို သုံးပြီး — ကိုယ့် browser ထဲက cookies တွေကို Postman cookie jar ထဲကို စဉ်ဆက်မပြတ် sync လုပ်နိုင်ပါတယ်။ ဒီ option က [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ဒါမှမဟုတ် [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) — နှစ်ခုလုံးနဲ့ အလုပ်လုပ်ပါတယ်။

Postman cookie jar ထဲမှာ — cookie တစ်ခုအတွက် နောက်ဆုံး တန်ဖိုးကို အမြဲ သိမ်းထားပါတယ်။ Request flow တစ်ခုအတွင်းမှာ cookie တန်ဖိုးတွေ ဘယ်လို ပြောင်းလဲလဲ စောင့်ကြည့်ချင်ရင် — [Interceptor session](/docs/postman/interceptor) တစ်ခုကို စတင်ပါ။

Postman Interceptor သုံးပြီး cookies တွေ sync လုပ်ဖို့:

1. [Interceptor တပ်ဆင်ခြင်း](/docs/postman/interceptor#interceptor-တပ်ဆင်ခြင်း) ထဲက အဆင့်တွေအတိုင်း — Postman Interceptor extension ကို install လုပ်ပါ။
2. Postman footer ထဲက **Tools** ကို နှိပ်ပြီး — **Cookies** ကို ရွေးပါ။
3. **Cookies** window ထဲမှာ — **Sync Cookies** ကို နှိပ်ပါ။ Postman desktop app သုံးနေရင် — **Interceptor** ကို နှိပ်ပါ။

   "No connection to Interceptor" ဆိုတဲ့ message ရရင် — ကိုယ့် browser ဖွင့်ထားပြီး [Interceptor extension တပ်ဆင်ထား](/docs/postman/interceptor#interceptor-တပ်ဆင်ခြင်း)ဖို့ သေချာလုပ်ပါ။ Postman desktop app သုံးနေရင် — Postman web app ဖွင့်ထားတဲ့ browser tabs တွေကို ပိတ်ကြည့်ပါ။

4. **Domains** တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရိုက်ထည့်ပါ။ Postman က သတ်မှတ်ထားတဲ့ domains တွေအတွက် cookies တွေကို Postman cookie jar ထဲကို sync လုပ်ပေးပါတယ်။

   Domain တစ်ခု ထည့်လိုက်ရင် — အဲဒီ domain ရဲ့ subdomains တွေအတွက် cookies တွေကိုပါ အလိုအလျောက် sync လုပ်ပေးပါတယ်။ ဥပမာ — `postman-echo.com` domain ကို ထည့်လိုက်ရင် `docs.postman-echo.com` subdomain ကနေ cookies တွေကိုပါ sync လုပ်ပေးပါတယ်။ Domain အတွက်ပဲ cookies တွေ sync ချင်ရင် — domain ရဲ့ ရှေ့မှာ `https://` ထည့်ပါ — ဥပမာ `https://postman-echo.com` ပေါ့။

5. **Start Syncing** ကို နှိပ်ပါ။ ကိုယ် သတ်မှတ်ထားတဲ့ domains တွေအတွက် cookies တွေကို — ကိုယ့် browser ကနေ Postman ထဲကို အလိုအလျောက် sync လုပ်ပေးပါတယ်။

   * Domain တစ်ခုအတွက် cookies တွေ sync လုပ်တာ ရပ်ဖို့ — domain နာမည်ဘေးက close icon ကို နှိပ်ပါ။
   * Cookies တွေ အားလုံး ဖမ်းယူပြီး sync လုပ်တာ ရပ်ဖို့ — **Stop Syncing** ကို နှိပ်ပါ။

## Interceptor extension ကနေ cookies တွေကို sync လုပ်ခြင်း

Interceptor session တစ်ခု မစတင်ဘဲ — Postman Interceptor extension ကို သုံးပြီး ကိုယ့် browser ကနေ Postman cookie jar ထဲကို cookies တွေ sync လုပ်နိုင်ပါတယ်။ ဒီ option က [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ဒါမှမဟုတ် [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) — နှစ်ခုလုံးနဲ့ အလုပ်လုပ်ပါတယ်။

Interceptor extension ကနေ cookies တွေ sync လုပ်ဖို့:

1. [Interceptor တပ်ဆင်ခြင်း](/docs/postman/interceptor#interceptor-တပ်ဆင်ခြင်း) ထဲက အဆင့်တွေအတိုင်း — Postman Interceptor extension ကို install လုပ်ပါ။
2. Interceptor extension ဖွင့်ဖို့ — ကိုယ့် browser ရဲ့ toolbar ထဲက Interceptor icon ကို နှိပ်ပါ။
3. **Sync Cookies** ကို နှိပ်ပါ။

   Interceptor window ရဲ့ အောက်ခြေမှာ **Ready to sync** ဆိုတဲ့ message ပေါ်နေဖို့ သေချာလုပ်ပါ။ **Interceptor disconnected** ဆိုတဲ့ message ပေါ်နေရင် — Postman desktop app run နေတာ ဒါမှမဟုတ် Postman web app ကို ကိုယ့် browser ထဲမှာ ဖွင့်ထားတာ သေချာလုပ်ပါ။

4. **Domains** တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရိုက်ထည့်ပါ။ Postman က သတ်မှတ်ထားတဲ့ domains တွေအတွက် cookies တွေကို Postman cookie jar ထဲကို sync လုပ်ပေးပါတယ်။

   Domain တစ်ခု ထည့်လိုက်ရင် — အဲဒီ domain ရဲ့ subdomains တွေအတွက် cookies တွေကိုပါ အလိုအလျောက် sync လုပ်ပေးပါတယ်။ ဥပမာ — `postman-echo.com` domain ကို ထည့်လိုက်ရင် `docs.postman-echo.com` subdomain ကနေ cookies တွေကိုပါ sync လုပ်ပေးပါတယ်။ Domain အတွက်ပဲ cookies တွေ sync ချင်ရင် — domain ရဲ့ ရှေ့မှာ `https://` ထည့်ပါ — ဥပမာ `https://postman-echo.com` ပေါ့။

5. **Sync Cookies** ကို နှိပ်ပါ။ ကိုယ် သတ်မှတ်ထားတဲ့ domains တွေအတွက် cookies တွေကို ကိုယ့် browser ကနေ Postman ထဲကို အလိုအလျောက် sync လုပ်ပေးပါတယ်။

   * Domain တစ်ခုအတွက် cookies တွေ sync လုပ်တာ ရပ်ဖို့ — domain နာမည်ဘေးက close icon ကို နှိပ်ပါ။
   * Cookies တွေ အားလုံး ဖမ်းယူပြီး sync လုပ်တာ ရပ်ဖို့ — **Stop Syncing** ကို နှိပ်ပါ။

## Postman proxy နဲ့ cookies တွေကို sync လုပ်ခြင်း

Proxy က client application တစ်ခု (ဥပမာ mobile app) နဲ့ server တစ်ခု (ဥပမာ API) အကြားမှာ ကြားခံအနေနဲ့ အလုပ်လုပ်ပါတယ်။ Postman ရဲ့ built-in proxy ကို သုံးပြီး — client နဲ့ server အကြား ဖြတ်သန်းသွားတဲ့ cookies တွေ အားလုံးကို ဖမ်းယူနိုင်ပါတယ်။ ဖမ်းယူလိုက်တဲ့ cookies တွေကို နောက်မှ သုံးဖို့ Postman cookie jar ထဲကို sync လုပ်ပေးပါတယ်။ ဒီ option က [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) နဲ့ အလုပ်မလုပ်တာမို့ — [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို သေချာသုံးပါ။

Postman cookie jar ထဲမှာ — cookie တစ်ခုအတွက် နောက်ဆုံး တန်ဖိုးကို အမြဲ သိမ်းထားပါတယ်။ Request flow တစ်ခုအတွင်းမှာ cookie တန်ဖိုးတွေ ဘယ်လို ပြောင်းလဲလဲ စောင့်ကြည့်ချင်ရင် — [proxy session](/docs/postman/capturing-http-requests) တစ်ခုကို စတင်ပါ။

Postman proxy သုံးပြီး cookies တွေ sync လုပ်ဖို့:

1. Postman desktop app ကို ဖွင့်ပြီး Postman footer ထဲက **Tools** ကို နှိပ်ကာ — **Cookies** ကို ရွေးပါ။
2. **Cookies** window ထဲမှာ — **Sync Cookies** ကို နှိပ်ပြီး **Proxy** ကို နှိပ်ပါ။
3. **Port** number တစ်ခု ရိုက်ထည့်ပါ။ Default တန်ဖိုးက 5559 ပါ။ ဒီ port number ကို clients တွေ configure လုပ်တဲ့အခါ သုံးရမှာပါ။

   Proxy enable ဖြစ်နေချိန်မှာ port number ကို ပြောင်းလို့ မရပါဘူး။

4. **Enable Postman as a proxy** ကို ဖွင့်ပါ။
5. **Domains** တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရိုက်ထည့်ပါ။ Postman က သတ်မှတ်ထားတဲ့ domains တွေအတွက် cookies တွေကို Postman cookie jar ထဲကို sync လုပ်ပေးပါတယ်။

   Domain တစ်ခု ထည့်လိုက်ရင် — အဲဒီ domain ရဲ့ subdomains တွေအတွက် cookies တွေကိုပါ အလိုအလျောက် sync လုပ်ပေးပါတယ်။ ဥပမာ — `postman-echo.com` domain ကို ထည့်လိုက်ရင် `docs.postman-echo.com` subdomain ကနေ cookies တွေကိုပါ sync လုပ်ပေးပါတယ်။ Domain အတွက်ပဲ cookies တွေ sync ချင်ရင် — domain ရဲ့ ရှေ့မှာ `https://` ထည့်ပါ — ဥပမာ `https://postman-echo.com` ပေါ့။

6. **Start Syncing** ကို နှိပ်ပါ။

   * Cookies တွေ sync လုပ်တာ စဖို့ — client တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး Postman proxy သုံးအောင် configure လုပ်ပါ။ [Client device ပေါ်မှာ proxy ကို configure လုပ်ခြင်း](/docs/postman/capturing-http-requests#အဆင့်-3-client-device-ပေါ်မှာ-proxy-ကို-configure-လုပ်ခြင်း) အကြောင်း ပိုလေ့လာပါ။
   * Domain တစ်ခုအတွက် cookies တွေ sync လုပ်တာ ရပ်ဖို့ — domain နာမည်ဘေးက close icon ကို နှိပ်ပါ။
   * Cookies တွေ အားလုံး ဖမ်းယူပြီး sync လုပ်တာ ရပ်ဖို့ — **Stop Syncing** ကို နှိပ်ပါ။
