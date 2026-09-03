---
title: "Postman မှာ documentation ကြည့်ရှုခြင်း (View documentation in Postman)"
description: "Collection တစ်ခု ဒါမှမဟုတ် API တစ်ခုရဲ့ documentation ကို Postman မှာ ကြည့်ရှုနည်း — collection documentation, API documentation နဲ့ public documentation တွေ ကြည့်ရှုခြင်း, public documentation ရဲ့ sections တွေဆီ တိုက်ရိုက် လင့်ခ်ချိတ်ခြင်း"
order: 146
source: "https://learning.postman.com/docs/publishing-your-api/viewing-documentation/"
status: translated
updated: 2026-09-03
---

[Documentation](/docs/postman/api-documentation-overview) က — Postman မှာ ကိုယ် အလုပ်လုပ်နေတဲ့ collections နဲ့ APIs တွေကနေ ပိုပြီး အကျိုးရယူနိုင်အောင် ကူညီပေးပါတယ်။ Collection တစ်ခုထဲက requests တွေအကြောင်း ဒါမှမဟုတ် API တစ်ခုရဲ့ endpoints တွေနဲ့ ဘယ်လို interact လုပ်ရမလဲ ဆိုတာ လေ့လာဖို့ documentation တွေကို ကြည့်ရှုပါ။

ပုံမှန်အားဖြင့် — collection တစ်ခု ဒါမှမဟုတ် API တစ်ခုရဲ့ documentation က private ဖြစ်ပါတယ်။ ကိုယ့်ဆီ တိုက်ရိုက် ဒါမှမဟုတ် internal workspace တစ်ခုကနေ share လုပ်ထားတဲ့ collection ဒါမှမဟုတ် API တစ်ခုခုရဲ့ documentation တွေကို ကြည့်ရှုနိုင်ပါတယ်။

Documentation ရေးသူ (writers) တွေက [သူတို့ရဲ့ documentation တွေကို publish](/docs/postman/publishing-your-docs) လုပ်ပြီး public ဖြစ်အောင်လည်း လုပ်နိုင်ပါတယ်။ ကမ္ဘာပေါ်က ဘယ်သူမဆို browser တစ်ခုသုံးပြီး public documentation ကို ကြည့်ရှုနိုင်ပါတယ်။ ဆက်စပ်နေတဲ့ collection က public workspace တစ်ခုထဲမှာ ရှိနေရင် — လူတွေက Postman ထဲမှာလည်း collection ကို ကြည့်ရှုနိုင်ပါတယ်။

## Collection တစ်ခုရဲ့ documentation ကို ကြည့်ရှုခြင်း

ကိုယ် ဖန်တီးထားတဲ့ collection တစ်ခုခု ဒါမှမဟုတ် ကိုယ့်ဆီ [share လုပ်ထားတဲ့](/docs/postman/sharing) collections တွေရဲ့ documentation တွေကို ကြည့်ရှုနိုင်ပါတယ်။

Viewer role ရှိတဲ့ Postman teammates တွေက documentation တွေကို ကြည့်ရှုနိုင်ပြီး — Editor role ရှိတဲ့ teammates တွေကတော့ documentation တွေကို ဖန်တီးပြီး update လုပ်နိုင်ပါတယ်။ [Roles နဲ့ permissions](https://learning.postman.com/docs/administration/roles-and-permissions/) အကြောင်း ပိုလေ့လာပါ။

Collection တစ်ခုရဲ့ documentation ကို ကြည့်ရှုဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ဘယ်ဘက် sidebar ထဲမှာ — collection တစ်ခုကို ရွေးပါ။

   [Postman API Network](https://www.postman.com/explore/collections/) ပေါ်မှာလည်း collections တွေကို ရှာဖွေနိုင်ပါတယ်။

2. **Overview** tab ထဲမှာ — **View complete documentation** ကို နှိပ်ပါ။

Documentation ထဲမှာ — request တစ်ခုချင်းစီရဲ့ [description](/docs/postman/authoring-your-documentation#documentation-တွေထဲ-description-တွေ-ထည့်ခြင်း), method နဲ့ URL, လိုအပ်တဲ့ authorization type, headers တွေ ဒါမှမဟုတ် parameters တွေလို အသေးစိတ်တွေ ပါဝင်ပါတယ်။ Request တစ်ခုချင်းစီအတွက် — client language အမျိုးမျိုးနဲ့ sample code တွေကို example response bodies နဲ့ headers တွေနဲ့အတူ ကြည့်ရှုနိုင်ပါတယ်။

Sample code တွေအတွက် သုံးချင်တဲ့ language တစ်ခုကို ရွေးနိုင်ပါတယ်။

Documentation တွေကို ကြည့်ရှုဖို့ နောက်ထပ်နည်းလမ်းတစ်ခုက — ကိုယ့် [user profile](https://postman.co/me/collections) ကို ဝင်ကြည့်ခြင်း ဖြစ်ပါတယ်။ ကိုယ့်ဆီ share လုပ်ထားတဲ့ collections တွေနဲ့ ကိုယ့်ပိုင် collections တွေရဲ့ စာရင်းအတွက် **Collections** tab ကို နှိပ်ပါ။ Collection တစ်ခုကို ရွေးပြီး — documentation ကြည့်ဖို့ **View complete documentation** ကို နှိပ်ပါ။

## API documentation ကြည့်ရှုခြင်း

Postman က ကိုယ် ဖန်တီးလိုက်တဲ့ [collection တစ်ခုအတွက် documentation](#collection-တစ်ခုရဲ့-documentation-ကို-ကြည့်ရှုခြင်း) ကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ [Collections တွေထဲမှာ types](https://learning.postman.com/docs/design-apis/collections/overview/) တွေနဲ့ဆိုရင် — collection တစ်ခုကို သုံးပြီး ကိုယ့် API ကို ဒီဇိုင်းလုပ်ကာ ဒီ documentation ကို ပိုပြီး အသေးစိတ် တည်ဆောက်နိုင်ပါတယ်။ HTTP collection တစ်ခုထဲမှာ request parameters, headers နဲ့ bodies တွေကို — data type နဲ့ ဖြစ်နိုင်တဲ့ values တွေလို အသေးစိတ်တွေ ပိုထည့်နိုင်ပါတယ်။

API developer တွေက — consumers တွေ ကိုယ့် API ရဲ့ endpoints တွေကို နားလည်ပြီး interact လုပ်နိုင်အောင် — ဘယ် API အတွက်မဆို [documentation အသေးစိတ် ဖန်တီး](/docs/postman/documenting-your-api)နိုင်ပါတယ်။

Types တွေပါတဲ့ collection တစ်ခုကနေ API documentation ကို ကြည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ဘယ်ဘက် sidebar ထဲမှာ — types တွေပါတဲ့ collection တစ်ခုကို ရွေးပါ။
2. Collection ရဲ့ **Overview** tab ကို နှိပ်ပြီး — **View complete documentation** ကို နှိပ်ပါ။

## Public documentation ကြည့်ရှုခြင်း

Public documentation တွေကို Postman က host လုပ်ပေးပါတယ်။ Public documentation ကို ဝင်ကြည့်ဖို့ — documentation URL ကို ကိုယ့် browser ရဲ့ address bar ထဲမှာ ရိုက်ထည့်ပါ။ ဒီ URL ကို [publication process](/docs/postman/publishing-your-docs#ကိုယ့်-public-docs-တွေကို-မျှဝေခြင်း) အတွင်းမှာ Postman က generate လုပ်ပေးတာပါ။

Request entry တစ်ခုချင်းစီမှာ အောက်ပါတွေ ရှိနိုင်ပါတယ်:

* Request ရဲ့ description
* လိုအပ်တဲ့ authorization type
* Method နဲ့ URL
* Headers တွေ ဒါမှမဟုတ် parameters တွေ
* Request အတွက် sample client code
* Example response bodies နဲ့ headers

Header ထဲက options တွေကို သုံးပြီး documentation ရဲ့ အသွင်အပြင်ကို customize လုပ်နိုင်ပါတယ်:

* **Version** — Current. Postman v10 ကစပြီး — collections တွေအတွက် versions ဒါမှမဟုတ် releases တွေ ဖန်တီးလို့ မရတော့ပါဘူး။
* **Environment** — Documentation နဲ့အတူ [environment](https://learning.postman.com/docs/publishing-your-api/document-a-collection/#associate-environments-with-documentation) တစ်ခုကို publish လုပ်ထားရင် — variables တွေ ဖြည့်ပေးဖို့ အဲဒီ environment ကို ရွေးနိုင်ပါတယ်။
* **URL** (Optional) — Documentation ကို host လုပ်ထားတဲ့ domain တစ်ခု။
* **Appearance** — **Double column** က documentation ဘေးမှာ column တစ်ခုနဲ့ sample code တွေကို ပြသပြီး — **Single column** က request တစ်ခုချင်းစီရဲ့ အောက်မှာ inline အနေနဲ့ sample code တွေကို ပြသပါတယ်။ Documentation အတွက် default theme တစ်ခုကိုလည်း ရွေးနိုင်ပါတယ်။
* **SEO** — Title နဲ့ description အပါအဝင် documentation ရဲ့ search engine optimization settings တွေကို customize လုပ်ပါ။

## Public documentation ကို လင့်ခ်ချိတ်ခြင်း

Specific endpoint တစ်ခုကို တစ်ယောက်ယောက်ဆီ မျှဝေချင်လား ဒါမှမဟုတ် နောက်ပိုင်းအတွက် bookmark လုပ်ထားချင်လား။ Introduction, requests, folders နဲ့ responses တွေ အပါအဝင် public documentation ထဲက sections တွေဆီ လင့်ခ်တွေ သိမ်းထားနိုင်ပါတယ်။

လင့်ခ်တစ်ခု သိမ်းဖို့ — sidebar ထဲမှာ section တစ်ခု, folder တစ်ခု ဒါမှမဟုတ် request တစ်ခုကို ရွေးပါ။ ကိုယ့် browser ရဲ့ address bar ထဲက URL ကို copy လုပ်ပါ၊ ဒါမှမဟုတ် bookmark တစ်ခုအနေနဲ့ သိမ်းပါ။ နောက်တစ်ခါ — ရွေးထားတဲ့ section ဆီ တိုက်ရိုက် သွားဖို့ ဒီ URL ကို သုံးနိုင်ပါတယ်။
