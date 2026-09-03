---
title: "Postman မှာ API documentation ထည့်ခြင်း (Add API documentation in Postman)"
description: "Collections တွေနဲ့ API documentation ထည့်သွင်းနည်း — types သုံးပြီး request parameters, headers နဲ့ bodies တွေကို အသေးစိတ် ထည့်ခြင်း, documentation ကြည့်ရှုနည်းနဲ့ နောက်ထပ် ဆောင်ရွက်စရာတွေ"
order: 143
source: "https://learning.postman.com/docs/publishing-your-api/documenting-your-api/"
status: translated
updated: 2026-09-03
---

Collections တွေနဲ့ ကိုယ့် API ရဲ့ documentation ကို ကြည့်ရှု, ဖန်တီး, စီမံခန့်ခွဲနိုင်ပါတယ်။ Types တွေပါတဲ့ collection တစ်ခုဆီ API documentation အသေးစိတ် ထည့်နိုင်ပါတယ်။ ဒါက HTTP collection တစ်ခုထဲမှာ request parameters, headers နဲ့ bodies တွေကို အသေးစိတ် ပိုထည့်နိုင်အောင် လုပ်ပေးပါတယ်။

API documentation မှာ — authentication methods, parameters, request bodies, response bodies နဲ့ headers, examples စတဲ့ API, path နဲ့ operation အချက်အလက် အပြည့်အစုံ ပါဝင်ပါတယ်။ ဒါ့အပြင် — required attributes, default values, minimum နဲ့ maximum values, တခြား constraints တွေလို data model အမျိုးမျိုးအတွက် အချက်အလက်တွေလည်း documentation ထဲမှာ ပါဝင်ပါတယ်။

## Collections တွေနဲ့ API documentation ထည့်ခြင်း

Postman က ကိုယ် ဖန်တီးလိုက်တဲ့ [collection တစ်ခုအတွက် documentation](https://learning.postman.com/docs/publishing-your-api/document-a-collection/) ကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ [Collections တွေထဲမှာ types](https://learning.postman.com/docs/design-apis/collections/overview/) တွေနဲ့ဆိုရင် — Postman Collection format နဲ့ ကိုယ့် API ကို ဒီဇိုင်းလုပ်ပြီး ဒီ documentation ကို ပိုပြီး အသေးစိတ် တည်ဆောက်နိုင်ပါတယ်။ Collection ထဲမှာ request parameters, headers နဲ့ bodies တွေကို — data type နဲ့ ဖြစ်နိုင်တဲ့ values တွေလို အသေးစိတ်တွေ ပိုထည့်နိုင်ပါတယ်။ ကိုယ် ထည့်လိုက်တဲ့ အသေးစိတ်တွေက ကိုယ့် collection ရဲ့ documentation ထဲမှာ ပေါ်လာပါတယ်။

စလုပ်ဖို့ — [parameters နဲ့ headers တွေကို types ထည့်ပါ](https://learning.postman.com/docs/design-apis/collections/add-properties-to-parameters-and-headers/)။ ကိုယ့် requests တွေထဲက [body data တွေကိုလည်း types ထည့်](https://learning.postman.com/docs/design-apis/collections/add-properties-to-body-data/)နိုင်ပါတယ်။

Types တွေပါတဲ့ collection တစ်ခုရဲ့ documentation ကို ကြည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ဘယ်ဘက် sidebar ထဲမှာ — types တွေပါတဲ့ collection တစ်ခုကို ရွေးပါ။
2. Collection ရဲ့ **Overview** tab ကို နှိပ်ပြီး — **View complete documentation** ကို နှိပ်ပါ။

![View documentation for a collection with types](https://assets.postman.com/postman-docs/v11/type-definition-view-docs-v11-12.jpg)

## နောက်ထပ် ဆောင်ရွက်စရာများ

Postman မှာ API တစ်ခုကို documentation ထည့်ပြီးတာနဲ့ — docs တွေကို တည်းဖြတ်ပြီး format လုပ်နိုင်ပါတယ်။ Documentation အပါအဝင် ကိုယ့် API ကိုလည်း publish လုပ်နိုင်ပါတယ်။

* Collection တစ်ခုကို — API တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ collections တွေ အပါအဝင် — descriptions တွေ ဘယ်လို ထည့်ရမလဲ ဆိုတာ လေ့လာဖို့ [Postman မှာ collection တစ်ခုကို documentation လုပ်ခြင်း](https://learning.postman.com/docs/publishing-your-api/document-a-collection/) ကို ကြည့်ပါ။
* Documentation တွေကို တည်းဖြတ်ခြင်းနဲ့ format လုပ်ခြင်း အကြောင်း လေ့လာဖို့ [Postman မှာ documentation ရေးသားခြင်း](/docs/postman/authoring-your-documentation) ကို ကြည့်ပါ။
* Users တွေ ကိုယ့် documentation ကို ဘယ်လို ဝင်ကြည့်နိုင်လဲ ဆိုတာ လေ့လာဖို့ [Postman မှာ documentation ကြည့်ရှုခြင်း](/docs/postman/viewing-documentation) ကို ကြည့်ပါ။ ပုံမှန်အားဖြင့် ကိုယ့် documentation က private ဖြစ်နေတာမို့ — တခြားသူတွေ ဝင်ကြည့်နိုင်ဖို့ API တစ်ခုကို သူတို့ဆီ မမျှဝေခင် အရင်မျှဝေထားရပါမယ်။
