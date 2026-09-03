---
title: "APIs တွေကို documentation လုပ်ခြင်း (Document your APIs)"
description: "API documentation ရဲ့ အရေးပါပုံ, API reference တွေကို မြန်မြန် မျှဝေခြင်း, Fern နဲ့ documentation site အပြည့်အစုံ ဖန်တီးခြင်း စတဲ့ ကိုယ့် collection တွေအတွက် documentation ထုတ်ဝေနည်း နှစ်မျိုး"
order: 142
source: "https://learning.postman.com/docs/publishing-your-api/api-documentation-overview/"
status: translated
updated: 2026-09-03
---

[Documentation](https://www.postman.com/api-platform/api-documentation/) က ကိုယ့် API ရဲ့ အရေးပါတဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်ပြီး — ဘယ် endpoints တွေ ရနိုင်လဲ ဆိုတာနဲ့ သူတို့နဲ့ ဘယ်လို interact လုပ်ရမလဲ ဆိုတာကို consumers တွေ နားလည်အောင် ကူညီပေးပါတယ်။ ကိုယ့် collections တွေအတွက် documentation တွေ ထုတ်ဝေဖို့ Postman က နည်းလမ်း နှစ်မျိုး ပေးထားပါတယ် — API reference တွေကို မြန်မြန် ထုတ်ဝေဖို့ [Postman documentation](/docs/postman/publishing-your-docs), ပြီးတော့ guides တွေနဲ့ AI-powered အင်္ဂါရပ်တွေ ပါတဲ့ documentation site အပြည့်အစုံ အတွက် Fern documentation တို့ ဖြစ်ပါတယ်။

## API reference တွေကို မြန်မြန် မျှဝေခြင်း

Postman က ကိုယ် ဖန်တီးလိုက်တဲ့ collection တိုင်းအတွက် — request details, authorization type နဲ့ sample code တွေ အပါအဝင် — အခြေခံ documentation တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ Users တွေကို context ပိုပေးဖို့ ကိုယ့် collection ထဲက items တွေကို descriptions တွေ ထည့်နိုင်ပါတယ်။ ဒါက setup အနည်းငယ်နဲ့ API reference documentation တွေကို မြန်မြန် ထုတ်ဝေနိုင်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။

Postman documentation နဲ့ဆိုရင် — built-in editor ကို သုံးပြီး descriptions, images နဲ့ videos တွေ ထည့်နိုင်ပါတယ်။ Postbot ကလည်း ကိုယ့်အတွက် documentation ရေးပေးနိုင်ပြီး — parameters နဲ့ response examples တွေ အပါအဝင် ကိုယ့် API requests တွေကို descriptions တွေ အလိုအလျောက် ထည့်ပေးပါတယ်။

[Postman မှာ APIs တွေကို documentation လုပ်ခြင်း](/docs/postman/postman-documentation-overview) မှာ ပိုလေ့လာပါ။

## Documentation site အပြည့်အစုံ တစ်ခု ဖန်တီးခြင်း

Fern က docs-as-code platform တစ်ခု ဖြစ်ပြီး — ကိုယ့် Postman collection ကနေ documentation site တစ်ခုကို generate လုပ်ပေးပါတယ်။ Publish လုပ်လိုက်တဲ့အခါ — Fern က ကိုယ့် API reference ကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ အဲဒီကနေ — guides, tutorials နဲ့ တခြား content တွေ ထည့်ပြီး documentation site တစ်ခု အပြည့်အစုံ တည်ဆောက်နိုင်ပါတယ်။

ကိုယ့် documentation ကို — ကိုယ့် team ပိုင်တဲ့ GitHub repository တစ်ခုနဲ့ ကျောထောက်နောက်ခံပြုထားတဲ့ live site တစ်ခုပေါ်မှာ deploy လုပ်ပေးပါတယ်။ Full edit rights တွေ ရရှိသလို — custom branding, custom domains နဲ့ intelligent search လို AI-powered အင်္ဂါရပ်တွေနဲ့ ကိုယ့် site ကို customize လုပ်နိုင်တဲ့ လွတ်လပ်မှုလည်း ရှိပါတယ်။

[Fern နဲ့ APIs တွေကို documentation လုပ်ခြင်း](https://learning.postman.com/docs/fern/overview/) မှာ ပိုလေ့လာပါ။

## ကိုယ့် options တွေကို နှိုင်းယှဉ်ခြင်း

|                   | Postman documentation            | Fern documentation                                    |
| ----------------- | -------------------------------- | ----------------------------------------------------- |
| **ဘာအတွက် အကောင်းဆုံးလဲ** | API reference တွေကို မြန်မြန် မျှဝေခြင်း | Documentation site အပြည့်အစုံ တည်ဆောက်ခြင်း        |
| **Setup လုပ်ချိန်** | အနည်းငယ်မျှသာ                     | အဆင့် အနည်းငယ် ပိုလိုပါတယ်                       |
| **အကြောင်းအရာ**    | API reference                    | API reference + guides                               |
| **AI အင်္ဂါရပ်များ** | Description တွေ ရေးဖို့ Postbot   | Content မူကြမ်း ရေးဖို့ Fern Writer, llms.txt, AI search |
| **Customize လုပ်နိုင်မှု** | Branding အခြေခံ               | GitHub ကနေ အပြည့်အဝ ထိန်းချုပ်နိုင်မှု            |
| **Hosting**       | Postman က host လုပ်ပေးသည်        | ကိုယ့် GitHub repository                              |

## Run in Postman button တစ်ခု ဖန်တီးခြင်း

Collection တစ်ခုနဲ့ ၎င်းရဲ့ documentation ကို users တွေဆီ မျှဝေဖို့ [Run in Postman button တစ်ခု ဖန်တီး](https://learning.postman.com/docs/publishing-your-api/run-in-postman/introduction-run-button/)နိုင်ပါတယ်။ Users တွေက button ကို နှိပ်လိုက်တဲ့အခါ — collection ကို သူတို့ရဲ့ workspace ထဲ fork လုပ်ခြင်း, public workspace တစ်ခုထဲမှာ collection ကို ကြည့်ရှုခြင်း, ဒါမှမဟုတ် collection ကို Postman ထဲ import လုပ်ခြင်း စတဲ့ option တွေထဲက ရွေးချယ်နိုင်ပါတယ်။
