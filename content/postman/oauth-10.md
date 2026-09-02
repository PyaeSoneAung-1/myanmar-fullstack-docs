---
title: "OAuth 1.0 ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with OAuth 1.0)"
description: "OAuth 1.0 နဲ့ ဘယ်လို authenticate လုပ်မလဲ — OAuth 1.0 flow အကြောင်း, signature methods (HMAC, PLAINTEXT, RSA), authorization data ပို့နည်း နဲ့ advanced configuration"
order: 43
source: "https://learning.postman.com/docs/use/send-requests/authorization/oauth-10/"
status: translated
updated: 2026-09-02
---

OAuth 1.0 က client applications တွေကို third-party API တစ်ခုက ထောက်ပံ့ပေးတဲ့ data တွေကို ဝင်ရောက်သုံးနိုင်စေပါတယ်။ ဥပမာ — ဝန်ဆောင်မှုတစ်ခုရဲ့ user တစ်ယောက်အနေနဲ့ ကိုယ့်ရဲ့ username နဲ့ password လိုမျိုး အသေးစိတ်တွေကို ဖော်မပြဘဲ — အခြား application တစ်ခုကို ကိုယ့် data တွေ သုံးခွင့် ပေးနိုင်ပါတယ်။ OAuth 1.0 နဲ့ user data တွေ ရယူတာက client application, user နဲ့ service provider ကြားမှာ requests တွေ အကြိမ်အနည်းငယ် ပို့လိုက်ပြန်လိုက် လုပ်ရပါတယ်။

## OAuth 1.0 ခြုံငုံသုံးသပ်ချက်

OAuth 1.0 ကို တခါတရံ "two-legged" (client နဲ့ server ကြားမှာပဲ auth လုပ်တာ) ဒါမှမဟုတ် "three-legged" (client တစ်ခုက third-party service တစ်ခုရဲ့ user တစ်ယောက်အတွက် data တွေ request လုပ်တာ) လို့ ခေါ်ပါတယ်။ OAuth 1.0 flow တစ်ခု ဥပမာအနေနဲ့ ဒီလို ဖြစ်နိုင်ပါတယ်:

* Third-party service တစ်ခုနဲ့ user data တွေ request လုပ်ဖို့ — consumer (client application) တစ်ခုက key နဲ့ secret လိုမျိုး credentials တွေကို သုံးပြီး access token တစ်ခုကို request လုပ်ပါတယ်။
* Service provider က ကနဦး token တစ်ခုကို ထုတ်ပေးပြီး (ဒီ token က user data တွေဆီ access မပေးပါဘူး) — consumer က user ဆီကနေ authorization ကို request လုပ်ပါတယ်။
* User က auth ခွင့်ပြုလိုက်တဲ့အခါ — consumer က user auth ကနေ ရတဲ့ verification ကို ထည့်ပြီး — ယာယီ token ကို access token တစ်ခုနဲ့ လဲလှယ်ဖို့ request တစ်ခု လုပ်ပါတယ်။
* Service provider က access token ကို ပြန်ပို့လိုက်ပြီး — consumer က user ရဲ့ data တွေကို ရယူဖို့ service provider ဆီ requests တွေ လုပ်နိုင်ပါတယ်။

Postman က [OAuth Core 1.0 Revision A](https://oauth.net/core/1.0a/) ကို ပံ့ပိုးပါတယ်။

## OAuth 1.0 သုံးခြင်း

OAuth 1.0 သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **OAuth 1.0** ကို ရွေးပါ။

2. **Add authorization to** dropdown list ကနေ — [auth details တွေကို](#authorization-data-ထည့်ခြင်း) request headers တွေမှာ ပို့မလား body နဲ့ URL မှာ ပို့မလား သတ်မှတ်ပါ။

3. **Signature Method** dropdown list ကနေ — ကိုယ့် API က requests တွေကို authenticate လုပ်ဖို့ သုံးတဲ့ method ကို ရွေးပါ။ ပြီးရင် — HMAC, PLAINTEXT ဒါမှမဟုတ် RSA signature method ထဲက ဘယ်ဟာကို ရွေးလဲဆိုတာပေါ်မူတည်ပြီး သီးခြား details တွေ ရိုက်ထည့်ပါ။ [HMAC ဒါမှမဟုတ် PLAINTEXT signature](#hmac-ဒါမှမဟုတ်-plaintext-signature-သုံးခြင်း) နဲ့ [RSA signature](#rsa-signature-သုံးခြင်း) အတွက် လိုအပ်တဲ့ details တွေအကြောင်း လေ့လာပါ။

4. [Advanced details](#advanced-configuration-အဆင့်မြင့်-သတ်မှတ်ချက်များ) တွေကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ် — ဒါပေမဲ့ လိုအပ်ရင် Postman က အဲဒီအတွက် values တွေကို generate လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

## Authorization data ထည့်ခြင်း

**Add authorization to** dropdown list ကနေ — auth details တွေကို request headers တွေမှာ ပို့မလား body မှာ ပို့မလား ရွေးပါ။ Details တွေကို request နဲ့အတူ ဘယ်လို ထည့်သွားမလဲ စစ်ဆေးချင်ရင် — **Headers** ဒါမှမဟုတ် **Body** tab ကို ဖွင့်ကြည့်နိုင်ပါတယ်။

OAuth 1.0 data တွေကို headers တွေမှာ ပို့ရင် — ကိုယ့်ရဲ့ key နဲ့ secret values တွေ ပါတဲ့ Authorization header တစ်ခုကို `OAuth` ဆိုတဲ့ string ရဲ့ နောက်မှာ ထပ်ထည့်ပြီး — လိုအပ်တဲ့ အခြား details တွေကို comma နဲ့ ခြားပြီး ပေါင်းထည့်ပေးပါတယ်။ ကိုယ့်ရဲ့ **Authorization** setup ထဲက required fields တွေ အားလုံး ပြည့်စုံသွားတဲ့အခါ — Postman က OAuth 1.0 information တွေကို request ရဲ့ **Headers** ထဲကို ထည့်ပေးပါလိမ့်မယ်။

OAuth 1.0 data တွေကို body နဲ့ URL မှာ ပို့ရင် — request method ပေါ်မူတည်ပြီး data တွေကို request ရဲ့ **Body** ဒါမှမဟုတ် **Parameters** ထဲကို ထည့်ပေးပါတယ်။

Request method က `POST` ဒါမှမဟုတ် `PUT` ဖြစ်ပြီး — request body type က `x-www-form-urlencoded` ဖြစ်ရင် Postman က authorization parameters တွေကို request body ထဲကို ထည့်ပေးပါတယ်။ မဟုတ်ရင် — ဥပမာ `GET` request တစ်ခုမှာဆိုရင် — ကိုယ့်ရဲ့ key နဲ့ secret data တွေကို URL ရဲ့ query parameters တွေထဲမှာ ပို့ပေးပါတယ်။

## HMAC ဒါမှမဟုတ် PLAINTEXT signature သုံးခြင်း

HMAC ဒါမှမဟုတ် PLAINTEXT signature method သုံးဖို့ အောက်ပါ details တွေကို ရိုက်ထည့်ပါ:

* **Consumer Key** — Service provider ဆီမှာ consumer တစ်ယောက်ကို ခွဲခြားသတ်မှတ်ဖို့ သုံးတဲ့ value တစ်ခုပါ။
* **Consumer Secret** — Consumer က key ရဲ့ ပိုင်ဆိုင်မှုကို သက်သေပြဖို့ သုံးတဲ့ value တစ်ခုပါ။
* **Access Token** — Consumer မှာ user ရဲ့ data တွေကို ဝင်ရောက်ခွင့် ရှိတယ်ဆိုတာကို ကိုယ်စားပြုတဲ့ value တစ်ခုပါ။
* **Token Secret** — Consumer က ပေးထားတဲ့ token တစ်ခုရဲ့ ပိုင်ဆိုင်မှုကို သက်သေပြဖို့ သုံးတဲ့ value တစ်ခုပါ။

## RSA signature သုံးခြင်း

RSA signature method သုံးဖို့ အောက်ပါ details တွေကို ရိုက်ထည့်ပါ:

* **Consumer Key** — Service provider ဆီမှာ consumer တစ်ယောက်ကို ခွဲခြားသတ်မှတ်ဖို့ သုံးတဲ့ value တစ်ခုပါ။
* **Access Token** — Consumer မှာ user ရဲ့ data တွေကို ဝင်ရောက်ခွင့် ရှိတယ်ဆိုတာကို ကိုယ်စားပြုတဲ့ value တစ်ခုပါ။
* **Private Key** — Auth signature ကို generate လုပ်ဖို့ သုံးတဲ့ private key တစ်ခုပါ။

## Advanced configuration (အဆင့်မြင့် သတ်မှတ်ချက်များ)

Advanced parameters တွေက အောက်ပါအတိုင်းပါ:

* **Callback URL** — User authorization ပြီးသွားတဲ့အခါ service provider က redirect လုပ်မယ့် URL ပါ။ (ကိုယ့် server က OAuth 1.0 Revision A သုံးနေရင် လိုအပ်ပါတယ်။)
* **Verifier** — User auth ရပြီးနောက် service provider ဆီကရတဲ့ verification code ပါ။
* **Time Stamp** — Server က time window အပြင်မှာ replay attacks တွေ မဖြစ်အောင် ကာကွယ်ဖို့ သုံးတဲ့ timestamp ပါ။
* **Nonce** — Client က generate လုပ်တဲ့ ကျပန်း string တစ်ခုပါ။
* **Version** — OAuth authentication protocol ရဲ့ version (1.0) ပါ။
* **Realm** — Server က `WWW-Authenticate` response header ထဲမှာ သတ်မှတ်ပေးတဲ့ string တစ်ခုပါ။
* **Include body hash** — `application/x-www-form-urlencoded` *ကလွဲပြီး* တခြား request bodies တွေနဲ့ integrity check လုပ်ဖို့ သုံးတဲ့ hash ပါ။ (Callback URL / verifier သုံးနေတဲ့အခါ ပိတ်ထားပါတယ်။)

ကိုယ့် server ရဲ့ OAuth 1.0 implementation က လိုအပ်ရင် — **Add empty parameters to signature** ကို ရွေးပါ။

ဒါ့အပြင် ကိုယ့် request အတွက် **Encode the parameters in the authorization header** ဆိုတဲ့ checkbox ကိုလည်း ရွေးနိုင်ပါတယ်။
