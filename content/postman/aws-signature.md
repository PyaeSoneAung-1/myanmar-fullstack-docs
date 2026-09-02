---
title: "AWS Signature ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with AWS Signature)"
description: "AWS Signature ဆိုတာ ဘာလဲ — Postman မှာ AWS Signature auth configure လုပ်နည်း နဲ့ parameters (AWS Region, Service Name, Session Token) အကြောင်း"
order: 37
source: "https://learning.postman.com/docs/use/send-requests/authorization/aws-signature/"
status: translated
updated: 2026-09-02
---

AWS Signature ဆိုတာ — Amazon Web Services requests တွေရဲ့ authorization workflow ပါ။ AWS က authentication အတွက် keyed-HMAC (Hash Message Authentication Code) အခြေခံတဲ့ custom HTTP scheme တစ်ခုကို သုံးပါတယ်။

AWS Signature ရဲ့ official documentation မှာ အသေးစိတ် ပိုပြီး ဖော်ပြထားပါတယ်:

* [Signing and Authenticating REST Requests](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTAuthentication.html)
* [Invoke REST APIs in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html)

AWS Signature သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **AWS Signature** ကို ရွေးပါ။

2. **Add authorization data to** dropdown list ကနေ — Postman က ကိုယ့်ရဲ့ AWS auth details တွေကို ဘယ်နေရာမှာ ထည့်မလဲ ရွေးပါ။ **Request Headers** ဒါမှမဟုတ် **Request URL** ကို ရွေးနိုင်ပါတယ်။

   * **Request Headers** ကို ရွေးရင် — Postman က **Headers** tab ထဲမှာ `Authorization` နဲ့ `X-Amz-` prefix ပါတဲ့ fields တွေကို ထည့်ပေးပါတယ်။
   * **Request URL** ကို ရွေးရင် — Postman က auth details တွေကို `X-Amz-` prefix ပါတဲ့ keys တွေနဲ့ **Params** ထဲမှာ ထည့်ပေးပါတယ်။

3. ကိုယ့်ရဲ့ **AccessKey** နဲ့ **SecretKey** values တွေကို ရိုက်ထည့်ပါ။ ပိုပြီး လုံခြုံစေချင်ရင် — sensitive data တွေကို vault secrets အနေနဲ့ သိမ်းဖို့ ကိုယ့်ရဲ့ [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) ကို သုံးပါ။

4. **Advanced configuration** section ထဲမှာ advanced fields တွေကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ် — ဒါပေမဲ့ လိုအပ်ရင် Postman က ဒါတွေကို အလိုအလျောက် generate လုပ်ပေးပါတယ်။

AWS Signature ရဲ့ parameters တွေကတော့:

* **AWS Region** — Request ကို လက်ခံမယ့် region ပါ (default က `us-east-1`)။
* **Service Name** — Request ကို လက်ခံမယ့် service ပါ။
* **Session Token** — Temporary security credentials တွေ သုံးတဲ့အခါမှပဲ လိုအပ်ပါတယ်။
