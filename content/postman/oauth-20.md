---
title: "OAuth 2.0 ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with OAuth 2.0)"
description: "OAuth 2.0 နဲ့ ဘယ်လို authenticate လုပ်မလဲ — access token request လုပ်ခြင်း, grant types (authorization code, PKCE, implicit, password, client credentials), token refresh လုပ်ခြင်း နဲ့ share လုပ်ခြင်း"
order: 36
source: "https://learning.postman.com/docs/use/send-requests/authorization/oauth-20/"
status: translated
updated: 2026-09-02
---

OAuth 2.0 နဲ့ဆိုရင် — ပထမဆုံး API အတွက် access token တစ်ခုကို ရယူပြီး — အဲဒီ token ကို သုံးပြီး နောက်ပိုင်း requests တွေကို authenticate လုပ်ပါတယ်။ Access tokens တွေက ပုံမှန်အားဖြင့် သက်တမ်းတိုပါတယ် — ဒါပေမဲ့ authorization server က သက်တမ်းရှည် refresh token တစ်ခုကိုလည်း ပေးနိုင်ပါတယ်။ Client application တစ်ခုက refresh token ကို သုံးပြီး access token ကို အလိုအလျောက် [refresh လုပ်နိုင်ပါတယ်](#oauth-20-token-တစ်ခုကို-refresh-လုပ်ခြင်း)။

## OAuth 2.0 ခြုံငုံသုံးသပ်ချက်

OAuth 2.0 နဲ့ data တွေ ရယူတာက API service providers တစ်ခုနဲ့တစ်ခု အများကြီး ကွာခြားပါတယ် — ဒါပေမဲ့ ပုံမှန်အားဖြင့် client application, user နဲ့ API ကြားမှာ requests တွေ အကြိမ်အနည်းငယ် ပို့လိုက်ပြန်လိုက် လုပ်ရပါတယ်။ OAuth 2.0 flow တစ်ခု ဥပမာအနေနဲ့ ဒီလို ဖြစ်နိုင်ပါတယ်:

* Client application တစ်ခုက — user ရဲ့ data တွေကို သုံးခွင့် (authorize) ပေးဖို့ request တစ်ခု လုပ်ပါတယ်။
* User က ခွင့်ပြုလိုက်ရင် — application က user ဆီကရတဲ့ access grant နဲ့ client ကို ခွဲခြားဖို့ authentication details တွေကို ပေးပြီး — service provider ဆီကနေ access token တစ်ခု request လုပ်ပါတယ်။
* Service provider က ဒီ details တွေကို စစ်ဆေးပြီး — သက်တမ်းတို access token တစ်ခုနဲ့ သက်တမ်းရှည် refresh token တစ်ခုကို ပြန်ပို့ပါတယ်။
* Client က access token ကို သုံးပြီး — service provider ဆီကနေ user data တွေကို request လုပ်ပါတယ်။
* Access token သက်တမ်းကုန်သွားတဲ့အခါ — client က refresh token ကို သုံးပြီး access token အသစ်တစ်ခုကို အလိုအလျောက် request လုပ်နိုင်ပါတယ်။

Scheduled runs, monitors, Postman CLI နဲ့ Newman တွေက OAuth 2.0 authentication ကို ပံ့ပိုးမပေးပါဘူး။ OAuth 2.0 token တစ်ခုကို ဒီ Postman features တွေနဲ့ သုံးချင်ရင် အောက်ပါ အချက်တွေကို သတိပြုပါ:

* ဒီ features တွေနဲ့ သုံးဖို့ token ကို Postman app ထဲမှာ [sync လုပ်ထားရပါမယ်](#oauth-20-access-token-တစ်ခုကို-share-လုပ်ခြင်း)။
* ဒီ features တွေက token ကို အလိုအလျောက် refresh လုပ်တာကို မပံ့ပိုးတာကြောင့် — token သက်တမ်းကုန်သွားရင် ပြဿနာ ကြုံရနိုင်ပါတယ်။ Token သက်တမ်းကုန်ပြီးနောက်မှာ ဒီ Postman features တွေ ဆက်သုံးချင်ရင် — token ကို [manual အနေနဲ့ refresh လုပ်](#oauth-20-token-တစ်ခုကို-refresh-လုပ်ခြင်း)ပြီး Postman app ထဲမှာ token ကို [ပြန် sync လုပ်ပါ](#oauth-20-access-token-တစ်ခုကို-share-လုပ်ခြင်း)။

## OAuth 2.0 သုံးခြင်း

OAuth 2.0 သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Collection ဒါမှမဟုတ် request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **OAuth 2.0** ကို ရွေးပါ။ Auth details တွေကို request URL မှာ ပို့မလား headers တွေမှာ ပို့မလား သတ်မှတ်ပါ။

   ပုံမှန်အားဖြင့် — Postman က access token ကို ကိုယ့် request ရဲ့ Authorization header ထဲမှာ `Bearer` နောက်မှာ ထည့်ပေးပါတယ် — ဒါပေမဲ့ ကိုယ့် server implementation က တခြား prefix တစ်ခု လိုအပ်ရင် **Header Prefix** field ထဲမှာ သတ်မှတ်နိုင်ပါတယ်။

2. Access token တစ်ခု request လုပ်ဖို့ — **Configure New Token** section ထဲက fields တွေကို ဖြည့်ပြီး **Get New Access Token** ကို ရွေးပါ။ Token ကို ကိုယ့် request ဒါမှမဟုတ် collection နဲ့ သုံးဖို့ — **Proceed** ကို ရွေးပြီး **Use token** ကို ရွေးပါ။ Token ကို generate လုပ်ဖို့ သုံးခဲ့တဲ့ details တွေကို ကိုယ့် request ဒါမှမဟုတ် collection နဲ့အတူ save လုပ်ပေးပါတယ်။ ဒါ့အပြင် collection ကို ဝင်လို့ရတဲ့ တခြားသူတွေပါ token ကို သုံးနိုင်အောင် [token ကို share လုပ်](#oauth-20-access-token-တစ်ခုကို-share-လုပ်ခြင်း)နိုင်ပါတယ်။

   Token value တစ်ခု generate လုပ်ပြီး ထည့်ပြီးတာနဲ့ — request ရဲ့ **Headers** ထဲမှာ ပေါ်လာပါလိမ့်မယ်။

3. ကိုယ့် client application အတွက် details တွေ နဲ့ service provider ဆီက auth details တွေကို ရိုက်ထည့်ပါ။ ဒါက authenticated requests တွေကို test လုပ်ဖို့ — ကိုယ့် application ရဲ့ auth flow ကို Postman ထဲမှာ ပြန်ပုံဖော်နိုင်စေပါတယ်။

   Token credentials တွေကို ကိုယ့် team နဲ့ share လုပ်နိုင်ပါတယ်။ **Share Token** toggle ကို ဖွင့်ပြီး **Sync Token** ကို ရွေးပါ။ ပုံမှန်အားဖြင့် — share မလုပ်ချင်တဲ့အခါမျိုးအတွက် Postman က token ကို sync မလုပ်ပေးပါဘူး။

4. OAuth 2.0 ရဲ့ **Grant Type** ပေါ်မူတည်ပြီး Postman က ကိုယ့်ဆီကနေ သီးခြား details တွေ တောင်းပါလိမ့်မယ် — grant type က [authorization code](#authorization-code-တစ်ခု-သတ်မှတ်ခြင်း), [PKCE](#pkce-ပါတဲ့-authorization-code-သတ်မှတ်ခြင်း), [implicit](#implicit-grant-type-သုံးခြင်း), [password credentials](#password-credentials-သုံးခြင်း) ဒါမှမဟုတ် [client credentials](#client-credentials-သုံးခြင်း) ဖြစ်နိုင်ပါတယ်။

## Authorization code တစ်ခု သတ်မှတ်ခြင်း

Authorization code grant type က user ကို provider နဲ့ authenticate လုပ်ဖို့ လိုအပ်ပါတယ် — အဲဒီနောက် authorization code တစ်ခုကို client app ဆီကို ပြန်ပို့ပြီး — extract လုပ်ကာ နောက်ပိုင်း requests တွေကို authenticate ဖို့ access token တစ်ခုနဲ့ လဲလှယ်ဖို့ provider ဆီ ပို့ပေးပါတယ်။

Authorization code grant type သုံးဖို့ — API provider မှာ register လုပ်ထားရမယ့် ကိုယ့် client application ရဲ့ **Callback URL** တစ်ခုကို ရိုက်ထည့်ပါ။ ဒါ့အပြင် API service က ပေးတဲ့ details တွေဖြစ်တဲ့ **Auth URL**, **Access Token URL**, **Client ID** နဲ့ **Client Secret** တို့လည်း ထည့်ပါ။

Postman desktop app ကို သုံးနေရင် — **Authorize using browser** ကို ရွေးပြီး Postman ထဲမှာ မဟုတ်ဘဲ ကိုယ့် web browser ထဲမှာ auth details တွေ ရိုက်ထည့်နိုင်ပါတယ်။

## PKCE ပါတဲ့ authorization code သတ်မှတ်ခြင်း

OAuth 2.0 မှာ Proof Key for Code Exchange (PKCE) ကို သုံးနိုင်ပါတယ်။ **Authorization Code (With PKCE)** ကို ရွေးလိုက်ရင် — **Code Challenge Method** နဲ့ **Code Verifier** ဆိုတဲ့ fields နှစ်ခု ထပ်ပေါ်လာပါတယ်။ Code challenge ကို generate လုပ်ဖို့ `SHA-256` ဒါမှမဟုတ် `Plain` algorithms တွေထဲက တစ်ခုကို ရွေးနိုင်ပါတယ်။ Verifier က authorization request ကို token request နဲ့ ချိတ်ဆက်ဖို့ သုံးတဲ့ optional 43-128 character ရှိတဲ့ string တစ်ခုပါ။

**Authorization Code (With PKCE)** grant type ကို **Authorize using browser** နဲ့ တွဲသုံးတာကို — auth code interception attacks တွေ မဖြစ်အောင် အကြံပြုပါတယ်။

## Implicit grant type သုံးခြင်း

Implicit grant type က — နောက်ထပ် auth code အဆင့်တစ်ခု မလိုအပ်ဘဲ access token တစ်ခုကို client ဆီကို ပြန်ပေးပါတယ် (ဒါကြောင့် လုံခြုံမှု ပိုနည်းပါတယ်)။

Implicit grant type ကို ကိုယ့် requests တွေမှာ သုံးဖို့ — API provider မှာ register လုပ်ထားတဲ့ **Callback URL** တစ်ခု, provider ရဲ့ **Auth URL** နဲ့ register လုပ်ထားတဲ့ app အတွက် **Client ID** တစ်ခုကို ရိုက်ထည့်ပါ။

Postman desktop app ကို သုံးနေရင် — **Authorize using browser** ကို ရွေးပြီး Postman ထဲမှာ မဟုတ်ဘဲ ကိုယ့် web browser ထဲမှာ auth details တွေ ရိုက်ထည့်နိုင်ပါတယ်။

## Password credentials သုံးခြင်း

OAuth 2.0 Password grant type က — username နဲ့ password ကို client ကနေ တိုက်ရိုက် ပို့တာဖြစ်လို့ — third-party data တွေနဲ့ ဆက်ဆံနေရရင် ဒီ grant type ကို မသုံးဖို့ အကြံပြုပါတယ်။

Password grant type သုံးဖို့ — ကိုယ့် API provider ရဲ့ **Access Token URL** ကို **Username** နဲ့ **Password** တို့နဲ့အတူ ရိုက်ထည့်ပါ။ တချို့ကိစ္စတွေမှာ client ID နဲ့ secret တစ်ခုလည်း ပေးဖို့ လိုနိုင်ပါတယ်။

## Client credentials သုံးခြင်း

Client credentials grant type က ပုံမှန်အားဖြင့် user data တွေ ရယူဖို့ မဟုတ်ဘဲ — client application နဲ့ ဆက်စပ်နေတဲ့ data တွေအတွက် သုံးပါတယ်။

Provider ရဲ့ **Access Token URL** ကို ကိုယ့် register လုပ်ထားတဲ့ application ရဲ့ **Client ID** နဲ့ **Client Secret** တို့နဲ့အတူ ရိုက်ထည့်ပါ။

## OAuth 2.0 token တစ်ခု request လုပ်ခြင်း

Access token အသစ်တစ်ခု request လုပ်ဖို့ လိုအပ်တဲ့ parameters အပြည့်အစုံက အောက်ပါအတိုင်းပါ — grant type ပေါ်မူတည်ပြီး ကွာခြားနိုင်ပါတယ်။

**Configure New Token** အောက်မှာ token အကြောင်း details တွေ ရိုက်ထည့်ပါ:

* **Token Name** — Token အတွက် သုံးချင်တဲ့ နာမည်ပါ။

* **Grant type** — Options တွေရဲ့ dropdown list တစ်ခုပါ။ API service provider ရဲ့ လိုအပ်ချက်ပေါ်မှာ မူတည်ပါတယ်။

* **Callback URL** — Auth ပြီးသွားရင် redirect လုပ်ဖို့ client application ရဲ့ callback URL ပါ။ ဒါက API provider မှာ register လုပ်ထားရပါမယ်။ မပေးထားရင် — Postman က default အနေနဲ့ ဗလာ URL တစ်ခု သုံးပြီး အဲဒီကနေ code ဒါမှမဟုတ် access token ကို extract လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ ကိုယ့် API အတွက် ဒါက အလုပ်မဖြစ်ရင် — အောက်ပါ URL ကို သုံးနိုင်ပါတယ်: `https://oauth.pstmn.io/v1/browser-callback`

  Postman desktop app ကို သုံးနေရင် — **Authorize using browser** ကို ရွေးပြီး Postman ထဲမှာ မဟုတ်ဘဲ ကိုယ့် web browser ထဲမှာ auth details တွေ ရိုက်ထည့်နိုင်ပါတယ်။ **Authorization Code** ဒါမှမဟုတ် **Implicit** grant type သုံးတဲ့အခါ — ဒီ checkbox ကို ရွေးထားရင် **Callback URL** က Postman ဆီကို ပြန်လာမှာ ဖြစ်ပါတယ်။ Browser နဲ့ authorize လုပ်ဖို့ ရွေးထားရင် — callback URL အတွက် pop-ups တွေကို ပိတ်ထားတာမျိုး မရှိအောင် သေချာပါစေ — မဟုတ်ရင် ဒီ option အလုပ်မလုပ်ပါဘူး။

* **Auth URL** — Auth code ရယူဖို့ API provider ရဲ့ authorization server ရဲ့ endpoint ပါ။

* **Access Token URL** — Authorization code တစ်ခုကို access token တစ်ခုနဲ့ လဲလှယ်ဖို့ provider ရဲ့ authentication server ပါ။

* **Client ID** — API provider မှာ register လုပ်ထားတဲ့ ကိုယ့် client application ရဲ့ ID ပါ။

* **Client Secret** — API provider က ကိုယ့်ကို ပေးထားတဲ့ client secret ပါ။

* **Scope** — ကိုယ် request လုပ်နေတဲ့ access ရဲ့ scope ပါ — space နဲ့ ခြားထားတဲ့ values အများကြီး ပါဝင်နိုင်ပါတယ်။

* **State** — Cross-site request forgery တွေ မဖြစ်အောင် ကာကွယ်ဖို့ opaque value တစ်ခုပါ။

* **Client Authentication** — Header ထဲမှာ Basic Auth request တစ်ခု ပို့ပါ ဒါမှမဟုတ် request body ထဲမှာ client credentials တွေ ပို့ပါ။ Version အသစ်တစ်ခုဆီ upgrade လုပ်ပြီးနောက်မှာ — client authentication ပြဿနာတွေ မဖြစ်အောင် ဒီနေရာက value ကို ပြောင်းပါ။

Token ကို customize လုပ်ချင်ရင် **Advanced Options** ကို ရွေးပါ:

* **Refresh Token URL** — Refresh token ကို access token တစ်ခုနဲ့ လဲလှယ်ဖို့ refresh server ရဲ့ endpoint ပါ။ ဗလာဖြစ်နေရင် — refresh token URL က access token URL အတိုင်းပဲ ဖြစ်ပါလိမ့်မယ်။
* **Auth Request**, **Token Request** နဲ့ **Refresh Request** — Auth requests, token requests ဒါမှမဟုတ် refresh requests တွေနဲ့အတူ ပို့စေချင်တဲ့ custom parameters တွေကို သတ်မှတ်ပါ။ သတ်မှတ်လိုက်တဲ့ key-value pair တစ်ခုချင်းစီအတွက် — parameter ကို request body ထဲမှာ, request URL ထဲမှာ ဒါမှမဟုတ် request headers တွေထဲမှာ ပို့ဖို့ option တစ်ခု ရွေးပါ။ အောက်ပါ အချက်တွေကို သတိပြုပါ:

  * Key နာမည်တူတဲ့ keys အများကြီး ထည့်ထားရင် — ဒါတွေကို request နဲ့အတူ array တစ်ခုအနေနဲ့ ပို့ပေးပါတယ်။
  * Postman ရဲ့ အစောပိုင်း version တစ်ခုမှာ resource ဒါမှမဟုတ် audience URIs တွေ ထည့်ထားခဲ့ရင် — ဒါတွေကို custom parameters အဖြစ် import လုပ်နိုင်ပါတယ်။ Resources နဲ့ audiences တွေကို ပြန်သုံးသပ်ဖို့ **Audience and Resource** tab ကို ရွေးပြီး **Move Audience and Resource** ကို ရွေးပါ။ Implicit ကလွဲပြီး grant types တွေအားလုံးအတွက် — parameters တွေကို token request ထဲကို ထည့်ပေးပါတယ်။ Implicit grant types အတွက်တော့ — parameters တွေကို auth request ထဲကို ထည့်ပေးပါတယ်။

Configuration ပြီးသွားရင် — **Get New Access Token** ကို ရွေးပါ။ Configuration information တွေကို access token နဲ့အတူ save လုပ်ထားပြီး — token ကို refresh လုပ်တိုင်း ပြန်သုံးပါလိမ့်မယ်။

**Authorization Code** ဒါမှမဟုတ် **Implicit** grant type သုံးတဲ့အခါ — နောက်ပိုင်း requests တွေမှာ သုံးဖို့ access token တစ်ခု ရယူဖို့ ကိုယ့်ရဲ့ credentials တွေ ထည့်ဖို့ တောင်းဆိုပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် — **Request Token** ကို ရွေးတဲ့အခါ Postman က pop-up window တစ်ခု ပြသပါတယ်။ Postman desktop app ကို သုံးနေရင် — ဒီအစား ကိုယ့် system ရဲ့ default web browser ကို သုံးပြီး authenticate လုပ်ဖို့ ရွေးနိုင်ပါတယ်။ Browser ထဲမှာ auth ပြီးသွားတဲ့အခါ — **Callback URL** က Postman ဆီကို ပြန်လာအောင် **Authorize using browser** ကို ရွေးပါ။ ဒါဆိုရင် — အောင်မြင်စွာ authenticate လုပ်ပြီးတဲ့အခါ ပြန်ရလာတဲ့ token ကို ကိုယ့် requests တွေမှာ သုံးနိုင်ပါတယ်။

API ကနေ ရလာတဲ့ token တစ်ခုထဲမှာ — token ရဲ့ details တွေ, သက်တမ်းကုန်ဆုံးချိန် (expiration) နဲ့ optional အနေနဲ့ — လက်ရှိ token သက်တမ်းကုန်တဲ့အခါ access token အသစ်တစ်ခု ရယူဖို့ သုံးလို့ရတဲ့ refresh token တစ်ခုပါ ပါဝင်ပါတယ်။ ပြန်ရလာတဲ့ token ကို သုံးဖို့ — **Proceed** ကို ရွေးပြီး **Use Token** ကို ရွေးပါ။

အောင်မြင်စွာ ရယူထားတဲ့ tokens တွေကို request ရဲ့ **Available Tokens** dropdown list ထဲမှာ စာရင်းပြပါတယ်။ Request နဲ့အတူ ပို့ဖို့ တစ်ခုကို ရွေးပါ။ အသေးစိတ်တွေ ကြည့်ဖို့ ဒါမှမဟုတ် tokens တွေ ဖျက်ဖို့ dropdown list ထဲက **Manage Tokens** ကို ရွေးပါ။

Authentication မအောင်မြင်ဘူး ဒါမှမဟုတ် timeout ဖြစ်ရင် — Postman က error message တစ်ခု ပြသပါတယ်။ Postman Console ထဲမှာ error အသေးစိတ်တွေကို စစ်ဆေးနိုင်သလို — authentication ကို နောက်တစ်ကြိမ် ကြိုးစားဖို့ **Retry** ကို ရွေးနိုင်ပါတယ်။ ဒါမှမဟုတ် ဆက်မလုပ်ခင် ကိုယ့်ရဲ့ auth details တွေကို တည်းဖြတ်နိုင်ပါတယ်။

Postman ထဲမှာ token တစ်ခုကို ဖျက်လိုက်တာက access ကို revoke လုပ်တာ မဟုတ်ပါဘူး။ Token ကို revoke လုပ်နိုင်တာ — token ကို ထုတ်ပေးတဲ့ server ပဲ ဖြစ်ပါတယ်။

### OAuth 2.0 token တစ်ခုကို refresh လုပ်ခြင်း

Postman မှာ generate လုပ်ထားတဲ့ OAuth 2.0 token တစ်ခု သက်တမ်းမကုန်ခင် — အဲဒီ token ကို သုံးတဲ့ request တစ်ခု မပို့ခင် Postman က token ကို background မှာ အလိုအလျောက် refresh လုပ်ပေးပါတယ်။ Refresh လုပ်ထားတဲ့ access token ကို — အဲဒီ token သုံးထားတဲ့ requests တွေအားလုံးထဲမှာ update လုပ်ပေးပါတယ်။ [Token ကို generate လုပ်တုန်းက](#oauth-20-token-တစ်ခု-request-လုပ်ခြင်း) custom parameters တွေ ထည့်ထားခဲ့ရင် — refresh လုပ်ထားတဲ့ token အတွက်ပါ အဲဒီ parameters တွေကိုပဲ သုံးပါလိမ့်မယ်။

Scheduled runs, monitors, Postman CLI နဲ့ Newman တွေက token ကို အလိုအလျောက် refresh လုပ်တာကို မပံ့ပိုးတာကြောင့် — token သက်တမ်းကုန်သွားရင် ပြဿနာ ကြုံရနိုင်ပါတယ်။ Token သက်တမ်းကုန်ပြီးနောက်မှာ ဒီ Postman features တွေ ဆက်သုံးချင်ရင် — token ကို manual အနေနဲ့ refresh လုပ်ပြီး Postman app ထဲမှာ [token ကို ပြန် sync လုပ်ပါ](#oauth-20-access-token-တစ်ခုကို-share-လုပ်ခြင်း)။

Auto-refresh လုပ်တာက default အပြုအမူပါ။ ဒီ feature ကို ပိတ်ချင်ရင် ဒါမှမဟုတ် ဖွင့်ချင်ရင် — **Auto-refresh access token** ကို ရွေးပါ။ Token တစ်ခုကို manual အနေနဲ့ refresh လုပ်ချင်ရင် — **Refresh** ကို ရွေးပါ။ Token က နောက်တစ်ရက်အတွင်း သက်တမ်းကုန်မယ်ဆိုရင် — token ရဲ့ expiration time ကို ပြသပေးပါတယ်။

Auto-refresh က refresh token တစ်ခု ရှိနေမှပဲ ရနိုင်ပါတယ်။ Refresh token မရှိရင် — **Auto-refresh access token** toggle ရော manual **Refresh** option ရော ရနိုင်မှာ မဟုတ်ပါဘူး။ Refresh token ရှိမရှိ စစ်ဆေးဖို့ — **Token** dropdown list ထဲက **Manage Tokens** ကို ရွေးပါ။ Refresh token မရှိရင် — authorization service နဲ့ စစ်ဆေးကြည့်ပါ။ Refresh token မရှိဘဲ Postman က access tokens တွေကို refresh လုပ်လို့ မရပါဘူး။

Request ကို manual အနေနဲ့ ပို့တဲ့အခါမှာလည်း auto-refresh ကို သုံးနိုင်ပါတယ်။

## OAuth 2.0 access token တစ်ခုကို share လုပ်ခြင်း

တခြား Postman users တွေ OAuth 2.0 access token တစ်ခုကို ကြည့်နိုင် သုံးနိုင်စေဖို့ — **Share Token** ဘေးက toggle ကို ဖွင့်ပြီး **Sync Token** ကို ရွေးပါ။

Scheduled runs, monitors, Postman CLI ဒါမှမဟုတ် Newman တွေနဲ့ သုံးဖို့ဆိုရင် — ကိုယ့်ရဲ့ OAuth 2.0 token ကို sync လုပ်ထားရပါမယ်။ Token ကို [manual အနေနဲ့ refresh လုပ်ခဲ့ရင်](#oauth-20-token-တစ်ခုကို-refresh-လုပ်ခြင်း) — token ကိုလည်း ပြန် sync လုပ်ရပါမယ်။

Synced token တစ်ခုဆီ တခြား users တွေရဲ့ access ကို revoke လုပ်ချင်ရင် အောက်ပါအတိုင်း လုပ်ပါ:

1. **Share Token** ဘေးက toggle ကို ပိတ်ပါ။
2. **Remove Synced Token** ကို ရွေးပါ။

Access ကို revoke လုပ်ပြီးတာနဲ့ — request ကို ဝင်လို့ရတဲ့ တခြား users တွေက token ကို မမြင်ရတော့ဘဲ မသုံးနိုင်တော့ပါဘူး။

## OAuth 2.0 token type ပြောင်းခြင်း

Postman က OAuth 2.0 authorization အတွက် access tokens တွေရော ID tokens တွေရော သုံးတာကို ပံ့ပိုးပေးပါတယ်။ *Access token* တစ်ခုက OAuth client တစ်ခုကို API တစ်ခုဆီ calls တွေ လုပ်နိုင်စေပါတယ်။ *ID token* တစ်ခုထဲမှာတော့ — authenticated user အကြောင်း အချက်အလက်တွေ ပါဝင်ပါတယ်။ OAuth client တစ်ခုက ဒီအချက်အလက်တွေကို သုံးပြီး user အတွေ့အကြုံကို customize လုပ်နိုင်ပါတယ်။

ID token တစ်ခု ရှိနေရင် — **Use Token Type** dropdown list ထဲမှာ token type (**Access token** ဒါမှမဟုတ် **ID token**) ကို ရွေးနိုင်ပါတယ်။ ID token မရှိရင် — ဒီ dropdown list က ရနိုင်မှာ မဟုတ်ပါဘူး။ ID token ရှိမရှိ စစ်ဆေးဖို့ — **Token** dropdown list ထဲက **Manage Tokens** ကို ရွေးပါ။
