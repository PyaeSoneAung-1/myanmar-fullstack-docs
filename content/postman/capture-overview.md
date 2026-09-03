---
title: "Postman မှာ HTTP traffic တွေကို ဖမ်းယူပြီး cookies တွေကို sync လုပ်ခြင်း"
description: "Postman ရဲ့ built-in proxy နဲ့ Postman Interceptor သုံးပြီး HTTP/HTTPS traffic နဲ့ cookies တွေကို ဖမ်းယူနည်း အကျဉ်းချုပ် — session တွေအကြောင်း, Postman proxy, Interceptor, Browser Tool နဲ့ cookie sync လုပ်ခြင်း"
order: 111
source: "https://learning.postman.com/docs/use/capturing-request-data/capture-overview/"
status: translated
updated: 2026-09-03
---

HTTP traffic တွေကို ဖမ်းယူခြင်းက API development နဲ့ testing အတွက် အရေးကြီးတဲ့ ကိရိယာတစ်ခုပါ။ Postman က client application တွေနဲ့ ကိုယ့် API အကြား ဖြတ်သန်းသွားတဲ့ requests တွေကို စစ်ဆေးကြည့်ရှုနိုင်အောင် လုပ်ပေးပြီး — အဲဒီ requests တွေကို collection တစ်ခုထဲမှာ သိမ်းဆည်းလို့လည်း ရပါတယ်။ သိမ်းထားတဲ့ requests တွေကို သုံးပြီး — ကိုယ့် API က ဘယ်လို အပြုအမူ ရှိနေလဲ နားလည်နိုင်သလို — debugging လုပ်ရာမှာလည်း အထောက်အကူ ပြုနိုင်ပါတယ်။

Postman ရဲ့ built-in proxy နဲ့ Postman Interceptor က Postman ထဲမှာ HTTP နဲ့ HTTPS traffic တွေကို ဖမ်းယူဖို့ နည်းလမ်း နှစ်မျိုး ပေးပါတယ်။ ပြီးတော့ proxy ဒါမှမဟုတ် Interceptor ကို သုံးပြီး — cookies တွေကိုလည်း ဖမ်းယူပြီး Postman cookie jar ထဲကို sync လုပ်နိုင်ပါတယ်။

Traffic တွေ ဖမ်းယူဖို့ — proxy ဒါမှမဟုတ် Interceptor session တစ်ခုကို စတင်ပါ။ Session တစ်ခုဆိုတာ — traffic တွေကို ဖမ်းယူလိုတဲ့ သတ်မှတ်ထားတဲ့ အချိန်ကာလတစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဥပမာ — client application တစ်ခုက ကြည့်ရှု ဒါမှမဟုတ် debug လုပ်ချင်တဲ့ requests တွေ ဆက်တိုက် ပို့နေတဲ့အချိန်မှာ — traffic တွေကို ဖမ်းယူနိုင်ပါတယ်။

Session ကို ရပ်လိုက်ပြီးနောက်မှာ — ဖမ်းယူထားတဲ့ requests တွေကို Postman ထဲမှာ ကြည့်ရှုနိုင်ပါတယ်။ ပြီးတော့ Postman ရဲ့ search နဲ့ filtering လုပ်ဆောင်ချက်တွေကို သုံးပြီး — ကိုယ် ရွေးချယ်ထားတဲ့ စံနှုန်းတွေနဲ့အညီ requests တွေကို ကျဉ်းမြောင်းအောင် စစ်ထုတ် ကြည့်ရှုနိုင်ပါတယ်။

## Postman proxy ဆိုတာ ဘာလဲ

Proxy ဆိုတာ — client application တစ်ခု (ဥပမာ mobile app) နဲ့ client က ဆက်သွယ်နေတဲ့ ဦးတည်ရာ server (ဥပမာ API တစ်ခု) အကြားမှာ တည်ရှိတဲ့ ကြားခံ server တစ်ခုပါ။ Postman proxy ကို enable လုပ်ထားပြီး client တစ်ခုက proxy သုံးဖို့ configure လုပ်ထားတယ်ဆိုရင် — client ဆီက request တစ်ခုက အရင်ဆုံး Postman ဆီ ရောက်လာပြီး — Postman က အဲဒီ request ကို ဦးတည်ရာ server ဆီ ဆက်ပို့ပေးပါတယ်။

Proxy ကို enable လုပ်ထားချိန်မှာ proxy session တစ်ခု စတင်လိုက်ရင် — Postman က proxy ကို ဖြတ်သန်းသွားတဲ့ HTTP ဒါမှမဟုတ် HTTPS traffic တွေ အားလုံးကို ဖမ်းယူနိုင်ပါတယ်။ ပြီးရင် requests တွေကို search ဒါမှမဟုတ် filter လုပ်နိုင်သလို — collection တစ်ခုထဲမှာလည်း သိမ်းဆည်းနိုင်ပါတယ်။

Postman proxy ကို သုံးပြီး requests တွေ ဖမ်းယူဖို့ — ကိုယ့် operating system နဲ့ Postman version အတွက် ညွှန်ကြားချက်တွေကို ကြည့်ပါ:

* macOS (Postman v10.17 နဲ့ ၎င်းနောက်ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.18 နဲ့ ၎င်းနောက်ပိုင်း) ပေါ်မှာဆိုရင် — [Postman built-in proxy သုံးပြီး traffic တွေကို ဖမ်းယူခြင်း](/docs/postman/capture-with-proxy) ကို သွားပါ။

* Linux (Postman version အားလုံး), macOS (Postman v10.16 နဲ့ ၎င်းရှေ့ပိုင်း) ဒါမှမဟုတ် Windows (Postman v10.17 နဲ့ ၎င်းရှေ့ပိုင်း) ပေါ်မှာဆိုရင် — [Postman ထဲမှာ HTTP requests တွေကို ဖမ်းယူခြင်း](/docs/postman/capturing-http-requests) ကို သွားပါ။

* ဖုန်းလို client device တစ်ခုကနေ secure HTTPS traffic တွေကို ဖမ်းယူချင်ရင် — device ပေါ်မှာ Postman security certificate ကို install လုပ်ဖို့ လိုပါတယ်။ အသေးစိတ်အတွက် — [Postman built-in proxy သုံးပြီး HTTPS traffic တွေကို ဖမ်းယူခြင်း](/docs/postman/capturing-https-traffic) ကို ကြည့်ပါ။

ကိုယ့် Postman version က ဘယ်ဟာလဲ စစ်ဆေးဖို့ — header ထဲက **Settings** ကို နှိပ်ပြီး — **Settings**, ပြီးရင် **About** ကို နှိပ်ပါ။

## Postman Interceptor

Postman Interceptor က client နဲ့ server အကြား ပို့လိုက်တဲ့ requests တွေကို ဖမ်းယူဖို့ နောက်ထပ် နည်းလမ်းတစ်ခု ပေးပါတယ်။ Interceptor က Postman ရဲ့ built-in proxy အစား browser extension တစ်ခုကို သုံးပါတယ်။ Postman Interceptor နဲ့ဆိုရင် — web browser တစ်ခုကနေ ပို့လိုက်တဲ့ HTTP နဲ့ HTTPS requests တွေကို ဖမ်းယူနိုင်ပါတယ်။

[Postman Interceptor သုံးခြင်း](/docs/postman/interceptor) အကြောင်း ပိုလေ့လာပါ။

## Postman Browser Tool နဲ့ traffic တွေကို ဖမ်းယူခြင်း

Postman Browser Tool က Postman ထဲမှာ API traffic တွေနဲ့ အလုပ်လုပ်ဖို့ နောက်ထပ် နည်းလမ်းတစ်ခု ပေးပါတယ်။ Web application တစ်ခုနဲ့ အပြန်အလှန် ဆက်သွယ်နေစဉ် — Browser Tool က အဲဒီ page က ပြုလုပ်လိုက်တဲ့ requests တွေကို record လုပ်ပေးတာကြောင့် — network traffic တွေကို စစ်ဆေးနိုင်, API တွေရဲ့ အပြုအမူကို စူးစမ်းနိုင်, requests တွေကို Postman ထဲမှာ တိုက်ရိုက် ဖွင့်နိုင်ပါတယ်။

Request အသေးစိတ်တွေကို ပြန်လည်သုံးသပ်နိုင်, traffic တွေကို filter လုပ်နိုင်, developer tools တွေ သုံးနိုင်ပြီး — လေ့လာတွေ့ရှိရတဲ့ network activity တွေကနေ Postman ထဲမှာ HTTP requests အသစ်တွေလည်း ဖန်တီးနိုင်ပါတယ်။

Browser Tool နဲ့ Agent Mode ကိုလည်း သုံးနိုင်ပါတယ် — browser workflows တွေကို အလိုအလျောက် လုပ်ဆောင်ဖို့, tests နဲ့ documentation တွေ generate လုပ်ဖို့ နဲ့ real application interactions တွေကနေ APIs တွေကို စူးစမ်းလေ့လာဖို့ပါ။

[Browser Tool နဲ့ traffic တွေကို ဖမ်းယူခြင်း](https://learning.postman.com/docs/use/capturing-request-data/browser-tool/overview/) အကြောင်း ပိုလေ့လာပါ။

## Cookies တွေကို ဖမ်းယူပြီး sync လုပ်ခြင်း

Requests တွေကို ဖမ်းယူတာအပြင် — Postman က proxy ဒါမှမဟုတ် Interceptor session အတွင်းမှာ cookies တွေကိုလည်း ဖမ်းယူနိုင်ပါတယ်။ ဖမ်းယူလိုက်တဲ့ cookies တွေကို [Postman cookie jar](/docs/postman/cookies) ထဲကို ကိုယ်တိုင် ထည့်နိုင်ပြီး — Postman ကနေ requests တွေ ပို့တဲ့အခါ သုံးနိုင်ပါတယ်။

Postman ရဲ့ built-in proxy နဲ့ Interceptor က cookies တွေကို စဉ်ဆက်မပြတ် sync လုပ်ပေးတာကိုလည်း ထောက်ပံ့ပါတယ်။ ဒါကို enable လုပ်ထားလိုက်ရင် — ကိုယ် သတ်မှတ်ထားတဲ့ domains တွေအတွက် ဖမ်းယူလိုက်တဲ့ cookies အားလုံးက Postman cookie jar ထဲကို အလိုအလျောက် sync လုပ်ပေးပါတယ်။

[cookies တွေကို sync လုပ်ခြင်း](/docs/postman/syncing-cookies) အကြောင်း ပိုလေ့လာပါ။
