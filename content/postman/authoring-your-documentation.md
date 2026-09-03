---
title: "Postman မှာ documentation ရေးသားခြင်း (Write documentation in Postman)"
description: "Collection တွေနဲ့ ၎င်းတို့ရဲ့ requests, parameters, headers တွေကို descriptions ထည့်နည်း — Postman editor နဲ့ Markdown editor သုံးနည်း, authorization details နဲ့ examples တွေ ထည့်ခြင်း, လင့်ခ်တွေ, ပုံတွေနဲ့ ဗီဒီယိုတွေ ထည့်ခြင်း"
order: 144
source: "https://learning.postman.com/docs/publishing-your-api/authoring-your-documentation/"
status: translated
updated: 2026-09-03
---

Postman က ကိုယ် ဖန်တီးတဲ့ collection တိုင်းအတွက် — [API တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ collections](/docs/postman/documenting-your-api) တွေ အပါအဝင် — [documentation တွေကို အလိုအလျောက် generate လုပ်](https://learning.postman.com/docs/publishing-your-api/document-a-collection/)ပေးပါတယ်။ ကိုယ် ရေးလိုက်တဲ့ description တိုင်းက — ကိုယ့် collection ထဲက requests တွေ အားလုံး, examples, authorization details နဲ့ example code တွေနဲ့အတူ — collection ရဲ့ documentation အပြည့်အစုံထဲမှာ ပါဝင်ပါတယ်။

ကိုယ် တည်ဆောက်နေတာတွေကို ကိုယ့် teammates တွေ ([ဒါမှမဟုတ် ကမ္ဘာပေါ်က လူတွေ](/docs/postman/publishing-your-docs)) ပိုပြီး နားလည်စေဖို့ — ကိုယ့် collection နဲ့ ၎င်းရဲ့ [requests](/docs/postman/create-requests) တွေကို description အသေးစိတ်တွေ ထည့်ပါ။ ရေးနေတုန်း ကိုယ့် content က ဘယ်လိုပုံစံ ပေါ်မလဲ ကြည့်နိုင်ဖို့ Postman editor ကို သုံးနိုင်သလို — description တွေကို Markdown syntax နဲ့ ဖွဲ့စည်း format လုပ်ဖို့ Markdown editor ကိုလည်း သုံးနိုင်ပါတယ်။ နှစ်မျိုးလုံးက တစ်ခုနဲ့တစ်ခု လိုက်ဖက်ညီတာမို့ — အလုပ်လုပ်နေစဉ်မှာ editor နှစ်ခုကြား ပြောင်းလဲသုံးနိုင်ပါတယ်။

## Documentation တွေထဲ description တွေ ထည့်ခြင်း

Description တွေကို သုံးပြီး — collection က ဘာလုပ်ပေးတာလဲ ဆိုတာနဲ့ request တစ်ခုချင်းစီရဲ့ ရည်ရွယ်ချက်ကို collection ရဲ့ users တွေ သိအောင် ပြောပြနိုင်ပါတယ်။ Headings တွေနဲ့ ကိုယ့် descriptions တွေကို ဖွဲ့စည်းနိုင်သလို — text, tables, images နဲ့ links လို content တွေလည်း ထည့်နိုင်ပါတယ်။

Collection တစ်ခု ဒါမှမဟုတ် folder တစ်ခုကို description ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ဘယ်ဘက် sidebar ထဲမှာ — collection တစ်ခုကို ရွေးပါ။
2. **Overview** tab ထဲမှာ — visual [Postman editor](#postman-editor-နဲ့-description-တစ်ခု-ရေးသားခြင်း) ဒါမှမဟုတ် [Markdown editor](#markdown-နဲ့-description-တစ်ခု-ရေးသားခြင်း) နဲ့ description တစ်ခု ရိုက်ထည့်ပါ။
3. Editor ရဲ့ အပြင်ဘက်ကို နှိပ်ပြီး — ကိုယ့် content အသစ်ကို သိမ်းပါ။

Request တစ်ခုကို description ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ဘယ်ဘက် sidebar ထဲမှာ — collection တစ်ခုကို ရွေးပြီး request တစ်ခုကို ရွေးပါ။
2. **Docs** tab ကို နှိပ်ပါ။
3. Visual [Postman editor](#postman-editor-နဲ့-description-တစ်ခု-ရေးသားခြင်း) ဒါမှမဟုတ် [Markdown editor](#markdown-နဲ့-description-တစ်ခု-ရေးသားခြင်း) နဲ့ description တစ်ခု ရိုက်ထည့်ပါ။
4. Editor ရဲ့ အပြင်ဘက်ကို နှိပ်ပြီး — ကိုယ့် content အသစ်ကို သိမ်းပါ။

#### အကြံပြုချက်

Collection ထဲက requests တွေအကြောင်း users တွေကို အသေးစိတ် ပိုပေးနိုင်ဖို့ — request ရဲ့ [parameters နဲ့ headers](#parameters-နဲ့-headers-တွေထဲ-description-တွေ-ထည့်ခြင်း) တွေကိုလည်း descriptions တွေ ထည့်ပါ။

### Postman editor နဲ့ description တစ်ခု ရေးသားခြင်း

Rich text editing tools တွေသုံးပြီး description တစ်ခု ရေးဖို့ — **Postman editor** ကို ရွေးပါ။ Markdown code တစ်ကြောင်းမှ မရေးဘဲ description တစ်ခု ရေးနိုင်တာမို့ Postman editor ကို သုံးနိုင်ပါတယ်။ Toolbar ပေါ်က tools တွေနဲ့ — သာမန် word processor တစ်ခုမှာ လုပ်သလိုပဲ — text နဲ့ တခြား content တွေကို အလုပ်လုပ်နိုင်ပါတယ်။ ဒါမှမဟုတ် — text တွေ bold လုပ်ဖို့ **⌘+B** ဒါမှမဟုတ် **Ctrl+B** လို သုံးလေ့ရှိတဲ့ keyboard shortcuts တွေကို သုံးပြီး text တွေ format လုပ်နိုင်ပါတယ်။

**အလုပ်လုပ်နေရင်း အကူအညီရဖို့ tooltips တွေကို ကြည့်ပါ။** Toolbar ပေါ်က item တစ်ခုပေါ်မှာ cursor ကို ခဏရပ်ထားရင် — tool ရဲ့ ရှင်းလင်းချက်နဲ့ ဆက်စပ်နေတဲ့ keyboard shortcut ကို မြင်ရပါတယ်။

**Markdown မလိုဘဲ tables တွေ ဖန်တီးနိုင်ပါတယ်။** Tables တွေ အလုပ်ဖြစ်အောင် Markdown code နဲ့ ရှုပ်ဖို့ မလိုပါဘူး။ Table တစ်ခု ထည့်ဖို့ — ![Table icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-table-stroke.svg#icon) **Table** ကို နှိပ်ပါ။ Columns ဒါမှမဟုတ် rows တွေ ထည့်ဖို့, ဖယ်ဖို့, ဒါမှမဟုတ် table ကို ဖျက်ဖို့ — cell တစ်ခုကို နှိပ်ပြီး shortcut menu ကို နှိပ်ပါ။

**Postman editor က Markdown syntax ကို နားလည်ပါတယ်။** Markdown သုံးနေကျဆိုရင် — text တွေ format လုပ်ဖို့ standard Markdown code ဘယ်ဟာကိုမဆို ရိုက်ထည့်နိုင်ပါတယ်။ ဥပမာ — heading အသစ်တစ်ခု စဖို့ `#` နဲ့အလိုက် space တစ်ခု ရိုက်ထည့်ပါ၊ ဒါမှမဟုတ် horizontal line တစ်ကြောင်း ထည့်ဖို့ `---` ရိုက်ထည့်ပါ။ Markdown နဲ့ ရေးထားပြီးသား documentation တွေ ပြန်သုံးချင်ရင် — ရှိပြီးသား Markdown code ကို copy လုပ်ပြီး editor ထဲ paste လုပ်လိုက်ရုံနဲ့ ချက်ချင်း format ဖြစ်သွားပါတယ်။

#### မှတ်ချက်

Postman editor ကနေ content တစ်ခုကို copy လုပ်ရင် — word processor တစ်ခု ဒါမှမဟုတ် email လို တခြား application တစ်ခုထဲ paste လုပ်တဲ့အခါ content ရဲ့ formatting က အတိုင်းအတာ ကျန်နေပါတယ်။

### Markdown နဲ့ description တစ်ခု ရေးသားခြင်း

Markdown သုံးပြီး description တစ်ခု ရေးဖို့ — **Markdown editor** option ကို ရွေးပါ။ ကိုယ့် content ကို ဖန်တီးဖို့ standard Markdown syntax ကို သုံးပါ:

* Content တွေကို headings, lists နဲ့ tables တွေနဲ့ ဖွဲ့စည်းပါ။
* Text တွေကို bold, emphasis နဲ့ block quotes တွေနဲ့ format လုပ်ပါ။
* Images, links နဲ့ code blocks တွေ ထည့်ပါ။

အလုပ်လုပ်နေစဉ် — ကိုယ့် documentation က ဘယ်လိုပုံစံ ပေါ်မလဲ ဆိုတာနဲ့ formatting မှန်မမှန် သေချာကြည့်ဖို့ **Preview** tab ကို နှိပ်ပါ။ ဆက်ပြီး တည်းဖြတ်ဖို့ — **Markdown** tab ကို နှိပ်ပါ။

#### အကြံပြုချက်

Formatting ပြဿနာတွေ မဖြစ်အောင် — headings, paragraphs နဲ့ lists လို block elements တွေရဲ့ ရှေ့နဲ့ နောက်မှာ blank line တစ်ကြောင်း ချန်ထားပါ။

### Default documentation editor တစ်ခု ရွေးချယ်ခြင်း

Postman မှာ documentation descriptions တွေကို တည်းဖြတ်တဲ့အခါ သုံးချင်တဲ့ default editor ကို ရွေးချယ်နိုင်ပါတယ်။ Description တစ်ခုကို တည်းဖြတ်တဲ့အခါ — Postman က ကိုယ် ကြိုက်နှစ်သက်ရာ editor ဆီ အလိုအလျောက် ပြောင်းပေးပါတယ်။ Description တစ်ခုကို တည်းဖြတ်နေစဉ်မှာ Postman နဲ့ Markdown editors နှစ်ခုကြား ပြောင်းလဲသုံးနေနိုင်ပါတယ်။

ကိုယ့် default editor ကို ပြောင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Postman header ထဲမှာ — ![Setting icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-setting-stroke.svg#icon) **Settings** > **App settings** ကို နှိပ်ပါ။
2. **General** tab ထဲမှာ — **User Interface** ဆီ အောက်ကို ဆင်းပါ။
3. **Default documentation editor** setting အတွက် — **Postman editor** ဒါမှမဟုတ် **Markdown editor** ကို ရွေးပါ။

### Parameters နဲ့ headers တွေထဲ description တွေ ထည့်ခြင်း

တခြားသူတွေ ကိုယ့် collection ရဲ့ requests တွေကို နားလည်ပြီး သုံးနိုင်အောင် — parameters နဲ့ headers တွေကို descriptions တွေ ထည့်ပါ။ Request တစ်ခုကို ဖွင့်ပြီး — key-value pair ရဲ့ ဘေးနားက box ထဲမှာ description ကို ရိုက်ထည့်ပါ။ ကိုယ့် request ရဲ့ [parameters](/docs/postman/parameters) နဲ့ [headers](/docs/postman/headers) တွေကို ပိုပြီး သတ်မှတ်နိုင်ဖို့ — data type, format နဲ့ default values တွေလို [types](https://learning.postman.com/docs/design-apis/collections/add-properties-to-parameters-and-headers/) တွေကိုလည်း ထည့်နိုင်ပါတယ်။

Parameter နဲ့ header descriptions တွေကို — ကိုယ့် collection ကို access ရှိတဲ့ သူတွေ ဒါမှမဟုတ် ကိုယ့် [published documentation](/docs/postman/publishing-your-docs) ကို ကြည့်နေတဲ့ ဘယ်သူမဆို မြင်နိုင်ပါတယ်။ Descriptions တွေက documentation ထဲမှာ — request နဲ့အတူ — parameter ဒါမှမဟုတ် header ရဲ့ နာမည်ဘေးမှာ ပေါ်လာပါတယ်။

Key-value pair တိုင်းက ကိုယ့် documentation ထဲမှာ ပါဝင်ပါတယ်။ Required parameters နဲ့ headers တွေကို သတ်မှတ်ဖို့ [types](https://learning.postman.com/docs/design-apis/collections/add-properties-to-parameters-and-headers/) တွေကို သုံးပါ။ ကိုယ့် collection ကို သုံးနေတဲ့ ဘယ်သူမဆို — requests တွေ ပို့တဲ့အခါ ဒါမှမဟုတ် [code snippets တွေ generate လုပ်တဲ့အခါ](/docs/postman/generate-code-snippets) ဘယ် key-value pairs တွေ ထည့်ရမလဲ ဆိုတာ ရွေးချယ်နိုင်ပါတယ်။

## Authorization details တွေ ထည့်သွင်းခြင်း

ကိုယ့် documentation ထဲမှာ — ကိုယ့် endpoints တွေကို access လုပ်ဖို့ လိုအပ်တဲ့ authorization type က အလိုအလျောက် ပါဝင်ပါတယ်။ Authorization details တွေက documentation ထဲမှာ — collection description ရဲ့ အောက်မှာရော, request တစ်ခုချင်းစီရဲ့ အောက်မှာပါ ပေါ်လာပါတယ်။

Collection အတွက် [authorization details တွေကို သတ်မှတ်](/docs/postman/specifying-authorization-details)ထားရင် — အဲဒီ authorization requirements တွေကို collection ထဲက request တိုင်းက အမွေဆက်ခံပါတယ်။ ကိုယ့် endpoints တစ်ခုက တခြား authorization type တစ်ခု လိုအပ်နေရင် — request ကို ဖွင့်ပြီး [authorization details တွေကို ပြောင်းလဲ](/docs/postman/specifying-authorization-details)ပါ။ ဒီအပြောင်းအလဲတွေက ကိုယ့် documentation ထဲမှာ ထင်ဟပ်ပါတယ်။

## Examples တွေ ထည့်သွင်းခြင်း

Examples တွေက — ကိုယ့် endpoints တွေ အလုပ်လုပ်ပုံကို ပြသပေးတဲ့ — paired requests နဲ့ responses တွေ ဖြစ်ပါတယ်။ Collection တစ်ခုကို ကိုယ် [ထည့်လိုက်တဲ့ example တိုင်း](/docs/postman/examples#example-တစ်ခု-ထည့်ခြင်း) က documentation ထဲမှာ ပါဝင်ပါတယ်။ Request တစ်ခုချင်းစီအတွက် — ကိုယ့် documentation က example code snippets တွေရော, example response body နဲ့ headers တွေကိုပါ ပြသပေးပါတယ်။

Examples တွေက collection တစ်ခုရဲ့ [documentation အပြည့်အစုံကို ကြည့်တဲ့အခါ](/docs/postman/viewing-documentation#collection-တစ်ခုရဲ့-documentation-ကို-ကြည့်ရှုခြင်း) ဒါမှမဟုတ် [published documentation ကို ကြည့်တဲ့အခါ](/docs/postman/viewing-documentation#public-documentation-ကြည့်ရှုခြင်း) မှာ ပေါ်လာပါတယ်။

## လင့်ခ်တွေ ထည့်ခြင်း

Users တွေကို ကိုယ့် repository, website ဒါမှမဟုတ် တခြား online resources တွေဆီ ညွှန်းဖို့ လင့်ခ်တွေကို သုံးပါ။

Postman editor နဲ့ လင့်ခ်တစ်ခု ထည့်ဖို့ — ![Link icon](https://assets.postman.com/postman-docs/aether-icons/action-link-stroke.svg#icon) **Link** ကို နှိပ်ပါ။ URL နဲ့ လင့်ခ် text ကို paste လုပ်ပါ ဒါမှမဟုတ် ရိုက်ထည့်ပြီး — **Add** ကို နှိပ်ပါ။ နောက်ပိုင်းမှာ လင့်ခ်ကို ပြောင်းဖို့ လိုအပ်ရင် — လင့်ခ်ကို ရွေးပြီး ![Edit icon](https://assets.postman.com/postman-docs/aether-icons/action-edit-stroke.svg#icon) **Edit link** ကို နှိပ်ပါ။

Markdown editor နဲ့ လင့်ခ်တစ်ခု ထည့်ဖို့ အောက်ပါ syntax ကို သုံးပါ:

```md
[link text to display](https://your-link-url.com)
```

## ပုံတွေ ထည့်ခြင်း

ပုံတွေက ကိုယ့် documentation ကို ပိုပြီး အသက်ဝင်စေသလို — ကိုယ့် အကြံဥာဏ်တွေကို ပိုပြီး ရှင်းလင်းစွာ ဖော်ပြနိုင်အောင်လည်း ကူညီပေးပါတယ်။ ကိုယ့် computer ကနေ image ဖိုင်တစ်ခု upload လုပ်နိုင်သလို — online မှာ host လုပ်ထားတဲ့ ပုံတစ်ပုံကိုလည်း embed လုပ်နိုင်ပါတယ်။

### ပုံတစ်ပုံ upload လုပ်ခြင်း

Postman editor နဲ့ ပုံတစ်ပုံ upload လုပ်ဖို့ — ![Image icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-image-stroke.svg#icon) **Image** ကို နှိပ်ပြီး — **Browse** ကို နှိပ်ပါ။ Upload လုပ်ချင်တဲ့ ပုံကို ရွေးပြီး — **Open** ကို နှိပ်ပါ။ ပုံတစ်ပုံကို copy လုပ်ပြီး Postman editor ထဲ paste လုပ်ခြင်း ဒါမှမဟုတ် ပုံဖိုင်တစ်ခုကို Postman editor ထဲ ဆွဲချခြင်းနဲ့လည်း upload လုပ်နိုင်ပါတယ်။

Postman editor က PNG, JPG, SVG နဲ့ GIF formats တွေကို ပံ့ပိုးပေးပါတယ်။ ပံ့ပိုးထားတဲ့ အများဆုံး image size က 5 MB ဖြစ်ပါတယ်။

### ပုံတစ်ပုံ embed လုပ်ခြင်း

ကိုယ့် documentation ထဲမှာ embed မလုပ်ခင် — ကိုယ့် ပုံကို online မှာ (ဥပမာ — website တစ်ခုပေါ်မှာ) host လုပ်ထားရပါမယ်။

Postman editor နဲ့ ပုံတစ်ပုံ embed လုပ်ဖို့ — ![Image icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-image-stroke.svg#icon) **Image** ကို နှိပ်ပြီး — **Embed URL** ကို နှိပ်ပါ။ ပုံရဲ့ URL ကို paste လုပ်ပါ ဒါမှမဟုတ် ရိုက်ထည့်ပြီး — **Embed** ကို နှိပ်ပါ။

Markdown editor နဲ့ ပုံတစ်ပုံ embed လုပ်ဖို့ အောက်ပါ syntax ကို သုံးပါ:

```md
![image alt text](https://your-image-location.com)
```

### ပုံတွေကို တည်းဖြတ်ခြင်း

ပုံတစ်ပုံ upload လုပ်ပြီး ဒါမှမဟုတ် embed လုပ်ပြီးတဲ့နောက်မှာ — အဲဒီပုံကို ပြောင်းလဲနိုင်ပါတယ်:

* Postman editor ထဲမှာ ပုံတစ်ပုံ ပြောင်းဖို့ — ပုံကို နှိပ်ပြီး ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/action-delete-stroke.svg#icon) **Delete image** ကို နှိပ်ပါ။ ပြီးရင် ပုံအသစ်တစ်ခုကို upload လုပ်ပါ ဒါမှမဟုတ် embed လုပ်ပါ။
* Markdown editor ထဲမှာ ပုံတစ်ပုံ ပြောင်းဖို့ — Markdown code ကို တည်းဖြတ်ပါ။
* ပုံတစ်ပုံကို ချဲ့ဖို့/ချုံ့ဖို့ (resize) — Postman editor ထဲမှာ ပုံကို နှိပ်ပြီး resize handles တွေကို ဆွဲပါ။ Markdown editor ထဲမှာ `width` အတွက် တန်ဖိုးအသစ်တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။
* Caption တစ်ခု ထည့်ဖို့ ဒါမှမဟုတ် တည်းဖြတ်ဖို့ — Postman editor ထဲမှာ ပုံကို နှိပ်ပြီး ပုံရဲ့ အောက်မှာ caption တစ်ခု ရိုက်ထည့်ပါ။ Markdown editor ထဲမှာ — brackets (`![]`) ထဲက alt text ကို ရိုက်ထည့်ပါ။

### ပုံ သိမ်းဆည်းမှု ကန့်သတ်ချက်

[Postman Free plan](https://www.postman.com/pricing/) ပေါ်မှာ ရှိပြီး team တစ်ခုရဲ့ အစိတ်အပိုင်း မဟုတ်ဘူးဆိုရင် — ကိုယ် upload လုပ်ထားတဲ့ ပုံတွေရဲ့ စုစုပေါင်း size က 20 MB နဲ့ ကန့်သတ်ထားပါတယ်။ Team တစ်ခုရဲ့ အစိတ်အပိုင်း ([paid plans](https://www.postman.com/pricing/)) ဖြစ်နေရင်တော့ — ကိုယ့် team ရဲ့ upload လုပ်ထားတဲ့ ပုံတွေရဲ့ စုစုပေါင်း size က 100 MB နဲ့ ကန့်သတ်ထားပါတယ်။

Storage ဘယ်လောက် သုံးနေလဲ စစ်ကြည့်ဖို့ — ကိုယ့် [billing dashboard](http://go.postman.co/billing) ကို သွားပြီး — **Resource Usage** ကို နှိပ်ပါ။ Upload လုပ်ထားတဲ့ ပုံတွေနဲ့ files တွေ သုံးထားတဲ့ နေရာပမာဏက **Storage Usage** section ထဲမှာ ပေါ်လာပါတယ်။ ရနိုင်တဲ့ storage ကို မြှင့်တင်ဖို့ — [Postman support](https://www.postman.com/support/) ကို ဆက်သွယ်ပါ။

#### မှတ်ချက်

ကိုယ့် storage limit ရဲ့ 90% ကို ရောက်တဲ့အခါ — ပုံတစ်ပုံ ထည့်ဖို့ ကြိုးစားတိုင်း သတိပေးချက်တစ်ခု ရပါလိမ့်မယ်။ ကိုယ့် Postman plan မှာ ပါဝင်တဲ့ resources တွေအကြောင်းနဲ့ ကိုယ့် usage limits တွေကို ရောက်တဲ့အခါ ဘာဖြစ်မလဲ ဆိုတာ ပိုလေ့လာဖို့ — [About resource usage](https://learning.postman.com/docs/billing/resource-usage/) ကို ကြည့်ပါ။

## ဗီဒီယိုတွေ embed လုပ်ခြင်း

YouTube ဒါမှမဟုတ် Vimeo ပေါ်မှာ host လုပ်ထားတဲ့ ဗီဒီယိုတွေကို ကိုယ့် documentation ထဲမှာ embed လုပ်နိုင်ပါတယ်။ ကိုယ့် documentation က ဗီဒီယိုရဲ့ preview တစ်ခုကို ပြသပေးပြီး — users တွေက Postman ကနေ မထွက်ဘဲ playback စလုပ်ဖို့ preview ကို နှိပ်နိုင်ပါတယ်။

#### မှတ်ချက်

YouTube နဲ့ Vimeo ကလွဲပြီး တခြား service တစ်ခုပေါ်မှာ host လုပ်ထားတဲ့ ဗီဒီယိုတစ်ခုကိုတော့ embed လုပ်လို့ မရပါဘူး။ ဒါပေမယ့် — ဗီဒီယိုဆီ [လင့်ခ်တစ်ခု ထည့်](#လင့်ခ်တွေ-ထည့်ခြင်း)နိုင်ပါတယ်။

Postman editor နဲ့ ဗီဒီယိုတစ်ခု embed လုပ်ဖို့ — ![Run icon](https://assets.postman.com/postman-docs/aether-icons/action-run-stroke.svg#icon) **Video** ကို နှိပ်ပါ။ ဗီဒီယိုရဲ့ URL ကို paste လုပ်ပါ ဒါမှမဟုတ် ရိုက်ထည့်ပြီး — **Embed** ကို နှိပ်ပါ။

Markdown editor နဲ့ ဗီဒီယိုတစ်ခု embed လုပ်ဖို့ အောက်ပါ syntax ကို သုံးပါ:

```md
<video src="https://www.youtube.com/embed/FeqSWgx6FxY?si=-5pR5tgUQtPN8P6z" alt="View Public Workspace Metrics" width="340" height="170"></video>
```

Documentation တွေကို တည်းဖြတ်နေစဉ်မှာ ဗီဒီယိုတွေကို ဖွင့်လို့ မရပါဘူး။ **Save** ကို နှိပ်ပြီးမှ — playback စဖို့ ဗီဒီယိုကို နှိပ်နိုင်ပါတယ်။

ဗီဒီယိုတစ်ခုကို upload လုပ်ပြီး ဒါမှမဟုတ် embed လုပ်ပြီးတဲ့နောက်မှာ — အဲဒီဗီဒီယိုကို ပြောင်းလဲနိုင်ပါတယ်:

* Postman editor ထဲမှာ ဗီဒီယိုတစ်ခု ပြောင်းဖို့ — ဗီဒီယိုကို နှိပ်ပြီး ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/action-delete-stroke.svg#icon) ကို နှိပ်ပါ။ ပြီးရင် ဗီဒီယိုအသစ်တစ်ခုကို embed လုပ်ပါ။
* Markdown editor ထဲမှာ ဗီဒီယိုတစ်ခု ပြောင်းဖို့ — လိုအပ်သလို Markdown code ကို တည်းဖြတ်ပါ။
* ဗီဒီယို preview တစ်ခုကို ချဲ့ဖို့/ချုံ့ဖို့ (resize) — Postman editor ထဲမှာ ဗီဒီယိုကို နှိပ်ပြီး resize handles တွေကို ဆွဲပါ။ Markdown editor ထဲမှာ `width` အတွက် တန်ဖိုးအသစ်တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။
* Caption တစ်ခု ထည့်ဖို့ ဒါမှမဟုတ် တည်းဖြတ်ဖို့ — Postman editor ထဲမှာ ဗီဒီယိုကို နှိပ်ပြီး ဗီဒီယိုရဲ့ အောက်မှာ caption တစ်ခု ရိုက်ထည့်ပါ။

## နောက်ထပ် ဆောင်ရွက်စရာများ

Documentation တွေအတွက် စိတ်ကူးတွေ ရှာနေတာလား။ Postman မှာ ဖန်တီးထားတဲ့ ကောင်းမွန်တဲ့ documentation တွေရဲ့ ဥပမာတွေ ရှာဖို့ — [Postman API Network](https://www.postman.com/explore/) ကို လှန်ကြည့်ပါ။
