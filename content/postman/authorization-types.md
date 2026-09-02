---
title: "Postman က ပံ့ပိုးထားတဲ့ authorization types (Authorization Types Supported by Postman)"
description: "Postman မှာ သုံးလို့ရတဲ့ authorization types တွေအကြောင်း — No Auth, API key, Bearer token, JWT bearer, Basic auth စတာတွေကို ဘယ်လို configure လုပ်မလဲ"
order: 33
source: "https://learning.postman.com/docs/use/send-requests/authorization/authorization-types/"
status: translated
updated: 2026-09-02
---

Postman က authorization အမျိုးအစားများစွာကို ပံ့ပိုးပေးပါတယ်။ Request တစ်ခုရဲ့ **Authorization** tab ထဲက **Auth Type** dropdown list ကနေ type တစ်ခုကို ရွေးပါ။ Requests, collections ဒါမှမဟုတ် folders တွေမှာလည်း authorization type တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်။

## No Auth

Postman က auth type တစ်ခု သတ်မှတ်မပေးထားရင် — request တစ်ခုနဲ့အတူ authorization details တွေကို မပို့ပါဘူး။ Request က authorization မလိုအပ်ဘူးဆိုရင် — **Authorization** tab ကို ရွေးပြီး **Auth Type** dropdown list ကနေ **No Auth** ကို ရွေးပါ။

## API key

API key auth နဲ့ဆိုရင် — API ဆီကို key-value pair တစ်ခုကို request headers ဒါမှမဟုတ် query parameters တွေထဲမှာ ပို့ပါတယ်။ Request ရဲ့ **Authorization** tab ထဲမှာ **Auth Type** list ကနေ **API Key** ကို ရွေးပါ။ ကိုယ့်ရဲ့ key name နဲ့ value ကို ရိုက်ထည့်ပြီး — **Add to** dropdown list ကနေ **Header** ဒါမှမဟုတ် **Query Params** ကို ရွေးပါ။ ပိုပြီး လုံခြုံစေချင်ရင် ကိုယ့်ရဲ့ values တွေကို [variables](/docs/use/send-requests/variables/variables-intro/) တွေထဲမှာ သိမ်းထားနိုင်ပါတယ်။

Postman က သက်ဆိုင်ရာ အချက်အလက်တွေကို request ရဲ့ **Headers** ဒါမှမဟုတ် URL query string ထဲကို ထည့်ပေးပါတယ်။

## Bearer token

Bearer tokens တွေက requests တွေကို access key တစ်ခုနဲ့ authenticate လုပ်နိုင်စေပါတယ် — ဥပမာ JSON Web Token (JWT) မျိုးပါ။ Token က request header ထဲမှာ ထည့်သွင်းရတဲ့ cryptic string တစ်ခုပါ။ Request ရဲ့ **Authorization** tab ထဲမှာ **Auth Type** dropdown list ကနေ **Bearer Token** ကို ရွေးပါ။ **Token** field ထဲမှာ ကိုယ့်ရဲ့ bearer token value ကို ရိုက်ထည့်ပါ။ ပိုပြီး လုံခြုံစေချင်ရင် — variable တစ်ခုထဲမှာ သိမ်းပြီး variable နာမည်နဲ့ ညွှန်းပါ။

Postman က token value ကို request ရဲ့ Authorization header ထဲမှာ လိုအပ်တဲ့ ပုံစံအတိုင်း `Bearer` ဆိုတဲ့ text နောက်မှာ ဒီအတိုင်း ထည့်ပေးပါတယ်:

```shell
Bearer <Your API key>
```

Custom prefix တစ်ခု လိုအပ်ရင် — `Authorization` ဆိုတဲ့ key နာမည်နဲ့ [API key](#api-key) ကို သုံးပါ။

## JWT bearer

JWT ဆိုတာ JSON Web Token ရဲ့ အတိုကောက်ဖြစ်ပြီး — parties တွေကြားမှာ JSON data တွေကို လုံခြုံစွာ share လုပ်ဖို့ open standard တစ်ခုပါ။ Data တွေကို encode လုပ်ပြီး digitally sign လုပ်ထားတာကြောင့် — အဲဒီ data တွေရဲ့ စစ်မှန်မှု (authenticity) ကို အာမခံနိုင်ပါတယ်။ API authentication နဲ့ authorization workflows တွေမှာရော — client နဲ့ server တွေကြားက data transfer အတွက်ပါ JWT ကို ကျယ်ကျယ်ပြန့်ပြန့် သုံးကြပါတယ်။

Postman က requests တွေကို authorize လုပ်ဖို့ JWT bearer tokens တွေ generate လုပ်တာကို ပံ့ပိုးပေးပါတယ်။ Editor တစ်ခုထဲမှာ payload တစ်ခု ရိုက်ထည့်နိုင်ပြီး — JWT tokens တွေကို generate လုပ်ပြီး request ထဲကို အလိုအလျောက် ထည့်ပေးပါတယ်။ Request ရဲ့ **Authorization** tab ထဲမှာ **Auth Type** dropdown list ကနေ **JWT Bearer** ကို ရွေးပါ။

* **Add JWT token to** — JWT token ကို request ထဲမှာ ဘယ်လို ထည့်မလဲ သတ်မှတ်ဖို့ **Request Header** ဒါမှမဟုတ် **Query Param** ကို ရွေးပါ။

* **Algorithm** — JWT token အတွက် sign လုပ်မယ့် algorithm တစ်ခု ရွေးပါ။ ပံ့ပိုးထားတဲ့ algorithms တွေကတော့:

  * **HS** — HMAC with SHA
  * **RS** — RSA (RSASSA-PKCS1-v1\_5) with SHA
  * **ES** — ECDSA with SHA
  * **PS** — RSA (RSASSA-PSS) with SHA

* **Secret** — HMAC-SHA algorithm နဲ့ သုံးတဲ့ secret ပါ။

* **Secret Base64 encoded** — Secret ကို base-64 ပုံစံနဲ့ encode လုပ်ထားရင် ဒီ option ကို ရွေးပါ။

* **Private key** — RS, ES နဲ့ PS algorithms တွေအတွက် token ကို sign လုပ်မယ့် private key ပါ။ PKCS #8 ပုံစံနဲ့ private key တစ်ခု upload လုပ်ဖို့ **Select file** ကို ရွေးပါ။

* **Payload** — JWT token အတွက် payload data ကို JSON ပုံစံနဲ့ ရိုက်ထည့်ပါ။

**Advanced configuration** section ထဲမှာ အောက်ပါ items တွေကိုလည်း configure လုပ်နိုင်ပါတယ်။ ဒါတွေကို configure မလုပ်ထားရင် — အလိုအလျောက် generate လုပ်ပေးပါတယ်။

* **Request header prefix** — Headers ရဲ့ အစမှာ သုံးမယ့် optional prefix တစ်ခုပါ။ ဒီ header prefix က request ရဲ့ အစိတ်အပိုင်းဖြစ်ပြီး — JWT ရဲ့ အစိတ်အပိုင်းတော့ မဟုတ်ပါဘူး။
* **JWT headers** — JWT token ထဲမှာပါ ထည့်ပို့စေချင်တဲ့ custom headers တွေပါ။ ရွေးထားတဲ့ algorithm နဲ့ ဆိုင်တဲ့ headers တွေကိုတော့ အလိုအလျောက် ထည့်ပေးပါတယ်။

## Basic auth

Basic authentication က request နဲ့အတူ အတည်ပြုပြီးသား (verified) username နဲ့ password တစ်စုံ ပို့တာပါ။ Request ရဲ့ **Authorization** tab ထဲမှာ **Auth Type** dropdown list ကနေ **Basic Auth** ကို ရွေးပါ။

**Username** နဲ့ **Password** fields တွေထဲမှာ ကိုယ့်ရဲ့ API username နဲ့ password ကို ရိုက်ထည့်ပါ။ ပိုပြီး လုံခြုံစေချင်ရင် — ဒါတွေကို [variables](/docs/use/send-requests/variables/variables-intro/) တွေထဲမှာ သိမ်းပါ။

Request ရဲ့ **Headers** ထဲမှာ — Authorization header က username နဲ့ password values တွေရဲ့ Base64 encode လုပ်ထားတဲ့ string ကို `Basic` ဆိုတဲ့ text နောက်မှာ ဒီအတိုင်း ပို့ပေးပါတယ်:

```shell
Basic <Base64 encoded username and password>
```
