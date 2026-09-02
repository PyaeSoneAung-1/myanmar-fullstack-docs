---
title: "Atlassian S2S (ASAP) ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with Atlassian S2S)"
description: "ASAP (Atlassian S2S) ဆိုတာ ဘာလဲ — Postman မှာ ASAP configure လုပ်နည်း နဲ့ parameters (Algorithm, Issuer, Audience, Key ID, Private key, optional claims) အကြောင်း"
order: 45
source: "https://learning.postman.com/docs/use/send-requests/authorization/atlassian/"
status: translated
updated: 2026-09-02
---

Atlassian S2S Authentication Protocol (ASAP) ဆိုတာ — API server တစ်ခုက client ဆီကလာတဲ့ requests တွေကို authenticate လုပ်ဖို့ သုံးနိုင်တဲ့ [JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519) (JWT) bearer token တစ်ခုပါ။

ASAP သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Type** dropdown list ကနေ **ASAP (Atlassian)** ကို ရွေးပါ။
2. Fields တွေထဲမှာ ကိုယ့်ရဲ့ details တွေကို ရိုက်ထည့်ပါ။ Optional settings တွေကို သတ်မှတ်နိုင်ပါတယ် — ဒါပေမဲ့ လိုအပ်ရင် Postman က အဲဒီအတွက် values တွေကို generate လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

အောက်ပါ ASAP parameters တွေကို ရိုက်ထည့်ပါ:

* **Algorithm** — JWT token ကို sign လုပ်ဖို့ သုံးမယ့် asymmetric key algorithm တစ်ခုကို ရွေးပါ။ Algorithm က header parameter တစ်ခုပါ။ ပံ့ပိုးထားတဲ့ algorithms တွေက:

  * **RS** — RSA (RSASSA-PKCS1-v1\_5) with SHA
  * **PS** — RSA (RSASSA-PSS) with SHA
  * **ES** — ECDSA with SHA

* **Issuer** — JWT token ကို ထုတ်ပေးပြီး — header နဲ့ payload ကို ကိုယ့်ရဲ့ private key နဲ့ sign လုပ်ခဲ့တဲ့ service ကို ခွဲခြားသတ်မှတ်တဲ့ claim တစ်ခုပါ။

* **Audience** — JWT token ရဲ့ ရည်ရွယ်ထားတဲ့ လက်ခံသူ (recipient) ကို ခွဲခြားသတ်မှတ်တဲ့ claim တစ်ခုပါ။

* **Key ID** — Issuer ရဲ့ public key အတွက် identifier ပါ။ JWT token ရဲ့ signature ကို verify လုပ်ဖို့ သုံးပါတယ်။ Key ID က header parameter တစ်ခုပါ။

* **Private key** — JWT token ကို sign လုပ်ခဲ့တဲ့ issuer ရဲ့ private key ပါ။ PKCS #8 ဒါမှမဟုတ် Base64 DER format နဲ့ private key တစ်ခု upload လုပ်ဖို့ **Select File** ကို ရွေးပါ — ဒါမှမဟုတ် ကိုယ့် key ကို text area ထဲမှာ paste လုပ်နိုင်ပါတယ်။

* Optional parameters တွေ:

  * **Subject** — JWT token ကို ထုတ်ပေးလိုက်တဲ့ user ကို ခွဲခြားသတ်မှတ်တဲ့ claim တစ်ခုပါ။ Subject ကို သတ်မှတ်မထားရင် — default value က issuer ပဲ ဖြစ်ပါတယ်။

  * **Additional claims** — ကိုယ့် payload ထဲမှာ ထည့်ချင်တဲ့ နောက်ထပ် claims တွေ — JSON format နဲ့ပါ။ [JWT claims အကြောင်း ပိုလေ့လာနိုင်ပါတယ်](https://datatracker.ietf.org/doc/html/rfc7519#section-4)။

    ဒီ configuration ထဲမှာ သတ်မှတ်ပြီးသား claims တွေကို ထပ်ထည့်မိရင် — key-value pair တစ်ခုချင်းစီထဲမှာ သတ်မှတ်ထားတဲ့ values တွေက ပိုဦးစားပေး ခံရပါတယ်။ ဥပမာ — **Issuer** field ထဲမှာ issuer တစ်ခု သတ်မှတ်ထားပြီး — key-value pair တစ်ခုထဲမှာလည်း issuer (`iss`) တစ်ခု သတ်မှတ်ထားရင် — key-value pair ထဲက value က ပိုဦးစားပေး ခံရပါတယ်။

  * **Expiry** — JWT token ဘယ်အချိန်မှာ သက်တမ်းကုန်မလဲဆိုတာကို စက္ကန့်နဲ့ သတ်မှတ်တဲ့ claim တစ်ခုပါ။ Default expiration timestamp က `3600` စက္ကန့်ပါ — ဒါက တစ်နာရီနဲ့ ညီမျှပါတယ်။

ASAP အကြောင်း ပိုသိချင်ရင် — [Atlassian S2S Authentication Protocol](https://s2sauth.bitbucket.io/) ကို ကြည့်ပါ။
