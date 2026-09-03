---
title: "Postman မှာ APIs တွေကို documentation လုပ်ခြင်း (Document your APIs in Postman)"
description: "Postman က collections နဲ့ APIs တွေအတွက် documentation တွေကို အလိုအလျောက် ဖန်တီးပေးပုံ, description တွေ ရေးသားခြင်း, documentation တွေ publish လုပ်ခြင်းနဲ့ ကြည့်ရှုခြင်း, Run in Postman button ဖန်တီးခြင်း အကြောင်း ခြုံငုံ ရှင်းလင်းချက်"
order: 141
source: "https://learning.postman.com/docs/publishing-your-api/postman-documentation-overview/"
status: translated
updated: 2026-09-03
---

Postman က ကိုယ့် collections နဲ့ APIs တွေအတွက် documentation တွေကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ Users တွေကို ပိုပြီး အထောက်အကူဖြစ်စေမယ့် အချက်အလက်တွေ ပေးနိုင်ဖို့ — Postman ရဲ့ built-in editing tools တွေကို သုံးပြီး ကိုယ့် documentation ထဲမှာ descriptions, images, videos စတာတွေ ထည့်နိုင်ပါတယ်။

## Collections နဲ့ APIs တွေကို documentation လုပ်ခြင်း

Postman က ကိုယ့် collections တွေအတွက် documentation တွေကို — request details, authorization type နဲ့ sample code တွေ အပါအဝင် — အလိုအလျောက် ဖန်တီးပေးပါတယ်။ Users တွေကို အချက်အလက် ပိုပေးနိုင်ဖို့ — collection ထဲက items တွေကို [description တွေ ထည့်လို့](https://learning.postman.com/docs/publishing-your-api/document-a-collection/) ရပါတယ်။ Collections တွေထဲမှာ types တွေ သုံးထားရင် — [Postman Collection format နဲ့ ကိုယ့် API အကြောင်း အသေးစိတ်တွေ ထည့်လို့](/docs/postman/documenting-your-api) ရပါတယ်။

Postman က ကိုယ့် [API specification](https://learning.postman.com/docs/design-apis/overview/) ပေါ်မှာ အခြေခံပြီးလည်း documentation တွေကို ဖန်တီးပေးပါတယ်။ ပိုပြီး အသေးစိတ်ကျတဲ့ API documentation တစ်ခု ဖန်တီးနိုင်ဖို့ — collection တစ်ခုကနေ [specification တစ်ခု generate လုပ်](https://learning.postman.com/docs/design-apis/collections/generate-specifications/)နိုင်ပါတယ်။ ကိုယ့် collection ရဲ့ requests နဲ့ responses တွေထဲမှာ descriptions တွေနဲ့ property [types](https://learning.postman.com/docs/design-apis/collections/overview/#define-types-in-your-collections) တွေ ထည့်နိုင်ပါတယ်။

## Documentation တွေကို ရေးသားခြင်း

ကိုယ့် documentation ကို ပိုကောင်းအောင် ပြင်ဆင်ပြီး အသေးစိတ် ပိုဖော်ပြနိုင်ဖို့ — collections တွေကို [description တွေ ထည့်လို့](/docs/postman/authoring-your-documentation) ရပါတယ်။ ရေးနေတုန်း ကိုယ့် content က ဘယ်လိုပုံစံ ပေါ်မလဲ ဆိုတာ ကြည့်နိုင်ဖို့ Postman editor ကို သုံးနိုင်သလို — content တွေ ရေးဖို့ standard Markdown syntax ကိုလည်း သုံးနိုင်ပါတယ်။ Editor နှစ်မျိုးလုံးနဲ့ — text ကို format လုပ်ခြင်း, လင့်ခ်တွေ ထည့်ခြင်း, ပုံတွေနဲ့ ဗီဒီယိုတွေ ထည့်ခြင်း စတာတွေ လုပ်နိုင်ပါတယ်။

## Documentation publish လုပ်ခြင်းနဲ့ ကြည့်ရှုခြင်း

Collection တစ်ခု ဒါမှမဟုတ် API တစ်ခုကို ဘယ်လို သုံးရမလဲ ဆိုတာ ပိုလေ့လာနိုင်ဖို့ — [Postman ထဲမှာ documentation ကို ကြည့်ရှု](/docs/postman/viewing-documentation)နိုင်ပါတယ်။ Collection documentation တွေက — sample code တွေနဲ့အတူ — request တစ်ခုချင်းစီအတွက် အသေးစိတ်တွေကို ဖော်ပြပေးပါတယ်။ API documentation ကြည့်ရှုဖို့ — Postman ထဲမှာ API တစ်ခု ဖွင့်ပါ၊ ဒါမှမဟုတ် ကိုယ့် [Private API Network](https://go.postman.co/network/private) ဒါမှမဟုတ် [Postman API Network](https://www.postman.com/explore/apis/) ပေါ်မှာ APIs တွေကို ရှာဖွေပါ။

[Collection တစ်ခု publish လုပ်ခြင်း](/docs/postman/publishing-your-docs) က ကိုယ့် documentation ကို getpostman.com ဒါမှမဟုတ် ကိုယ့်ပိုင် [custom domain](/docs/postman/custom-doc-domains) ပေါ်မှာ public အနေနဲ့ ရရှိနိုင်အောင် လုပ်ပေးပါတယ်။ Collection ကို update လုပ်တဲ့အခါ — published documentation ကလည်း ကိုယ့် နောက်ဆုံး အပြောင်းအလဲတွေနဲ့ အလိုအလျောက် sync ဖြစ်နေပါတယ်။ အပြောင်းအလဲတွေ လုပ်ပြီးတိုင်း documentation ကို နောက်တစ်ကြိမ် publish ပြန်လုပ်စရာ မလိုပါဘူး။

API တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ collection တစ်ခုကိုတော့ publish လုပ်လို့ မရပါဘူး။

## Run in Postman button တစ်ခု ဖန်တီးခြင်း

Collection တစ်ခုနဲ့ ၎င်းရဲ့ documentation ကို users တွေဆီ မျှဝေဖို့ [**Run in Postman** button တစ်ခု ဖန်တီး](https://learning.postman.com/docs/publishing-your-api/run-in-postman/introduction-run-button/)နိုင်ပါတယ်။ Users တွေက button ကို ရွေးလိုက်တဲ့အခါ — collection ကို သူတို့ရဲ့ workspace ထဲ fork လုပ်ခြင်း, public workspace တစ်ခုထဲမှာ collection ကို ကြည့်ရှုခြင်း, ဒါမှမဟုတ် collection ကို Postman ထဲ import လုပ်ခြင်း စတဲ့ option တွေထဲက ရွေးချယ်နိုင်ပါတယ်။
