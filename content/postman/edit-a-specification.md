---
title: "API specification တစ်ခုကို တည်းဖြတ်ခြင်း (Edit your API specification)"
description: "Specification တည်းဖြတ်ခြင်း — outline နဲ့ command palette သုံးပြီး navigate လုပ်ခြင်း, snippets တွေနဲ့ section အသစ်တွေ ထည့်ခြင်း, JSON body ကနေ schema generate လုပ်ခြင်း, autocomplete, duplicate/move လုပ်ခြင်း, files နဲ့ folders ထည့်ခြင်း"
order: 56
source: "https://learning.postman.com/docs/design-apis/specifications/edit-a-specification/"
status: translated
updated: 2026-09-02
---

Specification တစ်ခုကို တည်းဖြတ်ခြင်းအားဖြင့် — ကိုယ့် API ရဲ့ တည်ဆောက်ပုံနဲ့ ဒီဇိုင်းကို update လုပ်နိုင်ပါတယ်။ Sidebar ထဲက outline နဲ့ [command palette](#command-palette-နဲ့-navigate-လုပ်ခြင်း) ကို သုံးပြီး — section တစ်ခုချင်းစီကို ရှာဖွေ, ခုန်သွားနိုင်ဖို့ [ကိုယ့် specification ကို navigate လုပ်](#specification-တစ်ခုကို-navigate-လုပ်ခြင်း)နိုင်ပါတယ်။ ဖြည့်စွက်စရာ pre-formatted blocks တွေ ထည့်ဖို့ [snippets တွေနဲ့ section အသစ်တွေ ထည့်](#snippets-တွေနဲ့-section-အသစ်တွေ-ထည့်ခြင်း)နိုင်ပြီး — [JSON request ဒါမှမဟုတ် response body တစ်ခုကနေ schema တစ်ခု generate လုပ်](#json-body-တစ်ခုကနေ-schema-generate-လုပ်ခြင်း)ပြီး အဲဒီ schema ကို ကိုယ့် specification ထဲကို တိုက်ရိုက် ထည့်နိုင်ပါတယ်။ ကိုယ့် OpenAPI ဒါမှမဟုတ် protobuf specifications တွေကို [files နဲ့ folders အများအပြားအဖြစ်လည်း စုစည်း](#files-နဲ့-folders-တွေ-ထည့်ခြင်း)နိုင်ပါတယ်။

Specification ကို တည်းဖြတ်နေတုန်း — properties တွေနဲ့ တန်ဖိုးမှန်တွေအတွက် [autocomplete suggestions](#autocomplete-သုံးပြီး-specification-တည်းဖြတ်ခြင်း) တွေကို Postman က ပေးပါတယ်။

OpenAPI specifications တွေအတွက် — [Visual editor](https://learning.postman.com/docs/design-apis/specifications/spec-hub-visual-editor/) ကို သုံးပြီး ကိုယ့် API ကို interactively ဒီဇိုင်းလုပ်နိုင်ပါတယ်။

Postman က [syntax errors နဲ့ API governance ပြဿနာတွေကို ဖော်ထုတ်](/docs/postman/validate-a-specification)ပြီး — ပြုပြင်နိုင်ဖို့ အသေးစိတ်တွေကို ပြသပေးပါတယ်။ Specification ကို တည်းဖြတ်နေတုန်း — ညာဘက် sidebar မှာ ကိုယ့် API documentation ရဲ့ [live preview](/docs/postman/view-live-documentation) ကိုလည်း Postman က ပြသပေးပါတယ်။

## Specification တစ်ခုကို navigate လုပ်ခြင်း

ကိုယ့် specification က ကိုယ့် API ရဲ့ တည်ဆောက်ပုံကို သတ်မှတ်ပေးပါတယ်။ Sidebar ထဲက outline ကနေ ကိုယ့် specification ကို navigate လုပ်နိုင်ပါတယ်။ ကိုယ့် specification က files နဲ့ folders အများအပြားအဖြစ် စုစည်းထားရင် — အဲဒီ section ပါတဲ့ file ဆီ သွားဖို့ outline ကို သုံးနိုင်ပါတယ်။ Section တစ်ခုချင်းစီဆီ ခုန်သွားဖို့ [command palette](#command-palette-နဲ့-navigate-လုပ်ခြင်း) ကို သုံးပြီးလည်း navigate လုပ်နိုင်ပါတယ်။

Sidebar က ကိုယ့် API specification ရဲ့ outline တစ်ခုကို ပြသပေးပါတယ်။ Section တွေကို ချဲ့ဖို့ ဒါမှမဟုတ် ခေါက်သိမ်းဖို့ arrows တွေကို သုံးပါ။ Specification ထဲမှာ အဲဒီနေရာကို ခုန်သွားဖို့ outline ထဲက section တစ်ခုကို ရွေးပါ။ Specification ထဲကို section အသစ်တွေ ထည့်လိုက်တာနဲ့ — outline ထဲမှာလည်း ပေါ်လာပါတယ်။

![Spec Hub outline view](https://assets.postman.com/postman-docs/v12/specs-outline-view-v12-04.png)

Referenced component တစ်ခုဆီ ခုန်သွားဖို့ — `#ref` component တစ်ခုပေါ်မှာ mouse ချ (hover) ပြီး **⌘** ဒါမှမဟုတ် **Ctrl** ကို ဖိထားရင်း component ကို နှိပ်ပါ။

![Jumping to a referenced component](https://assets.postman.com/postman-docs/v12/specs-follow-ref-v12-01.png)

ညာဘက်အပေါ်မှာ — ကိုယ့် specification ရဲ့ format (JSON ဒါမှမဟုတ် YAML) ပြောင်းခြင်း, content တွေ beautify လုပ်ခြင်း, text ကို wrap လုပ်ခြင်း, specification ကို copy လုပ်ခြင်း နဲ့ ရှာဖွေခြင်း စတဲ့ option တွေ ရှိပါတယ်။ Specification ကို တည်းဖြတ်ပြီးသွားရင် — **Save** ကို နှိပ်ပါ။

![Spec Hub editing options](https://assets.postman.com/postman-docs/v12/specs-editor-options-v12-03.png)

OpenAPI ဒါမှမဟုတ် AsyncAPI specification တစ်ခုကနေ [collection တစ်ခု generate လုပ်ထားခဲ့ရင်](/docs/postman/generate-collections) — အပြောင်းအလဲတွေ ပြီးသွားတာနဲ့ [collection ကို update လုပ်ဖို့](/docs/postman/generate-collections) သေချာပါစေ။

### Command palette နဲ့ navigate လုပ်ခြင်း

Command palette ကို သုံးပြီး — ကိုယ့် specification ထဲက items တွေကို ရှာပြီး အဲဒီနေရာတွေဆီ ခုန်သွားနိုင်ပါတယ်။ Command palette ကို ပြသဖို့ — ညာဘက်အပေါ်က ![Console icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-console-stroke.svg#icon) **View Command Palette** ကို နှိပ်ပါ။ **⌘+Shift+O** ဒါမှမဟုတ် **Ctrl+Shift+O** ကိုလည်း နှိပ်နိုင်ပါတယ်။

Command palette ထဲမှာ — specification ထဲက အဲဒီ item ဆီ ခုန်သွားဖို့ list ထဲက item တစ်ခုကို နှိပ်ပါ။ List ကို filter လုပ်ဖို့ — "@" ကို ရိုက်ထည့်ပြီး ရှာချင်တဲ့ item ကို စတင် ရိုက်ပါ။

Specification ထဲက သတ်မှတ်ထားတဲ့ line နဲ့ character နံပါတ်ဆီ ခုန်သွားဖို့ colon ကို သုံးနိုင်ပါတယ်။ Line တစ်ခုဆီ ခုန်သွားဖို့ — colon နဲ့ line နံပါတ်ကို ရိုက်ထည့်ပါ၊ ဥပမာ ":20"။ Line ပေါ်က character တစ်ခုဆီ ခုန်သွားဖို့ — နောက် colon တစ်ခုနဲ့ character နံပါတ်ကို ထပ်ထည့်ပါ၊ ဥပမာ ":20:3"။ ပြီးရင် **Go to line \<number>** ဒါမှမဟုတ် **Go to line \<number> and character \<number>** ကို နှိပ်ပါ။

![Navigate with the command palette](https://assets.postman.com/postman-docs/v12/specs-command-palette-v12-03.png)

Editing commands တွေ လုပ်ဆောင်ဖို့လည်း command palette ကို သုံးနိုင်ပါတယ်။ Command palette ထဲမှာ ">" ကို ရိုက်ထည့်ပြီး — လုပ်ဆောင်ချင်တဲ့ editing command ကို နှိပ်ပါ။ ဥပမာ — specification ထဲက sections အားလုံးကို ခေါက်သိမ်းဖို့ **Fold All** ဒါမှမဟုတ် အားလုံး ချဲ့ဖို့ **Unfold All** ကို နှိပ်နိုင်ပါတယ်။

## Snippets တွေနဲ့ section အသစ်တွေ ထည့်ခြင်း

Snippets တွေကို protobuf, GraphQL ဒါမှမဟုတ် Smithy specifications တွေမှာ ပံ့ပိုးမပေးပါဘူး။

*Snippets* တွေဆိုတာ — ကိုယ့် OpenAPI ဒါမှမဟုတ် AsyncAPI specification ကို တည်ဆောက်ဖို့ ဖြည့်စွက်နိုင်တဲ့ pre-formatted blocks တွေပါ။ Snippet တစ်ခုနဲ့ section အသစ်တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Specification outline ထဲမှာ — ပံ့ပိုးထားတဲ့ section type တစ်ခုဘေးက ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) ကို နှိပ်ပြီး snippet တစ်ခုနဲ့ ကိုယ့် specification ထဲကို ထည့်ပါ။ Section က section type တစ်ခုထက်ပိုပြီး ပံ့ပိုးရင် — ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) ကို နှိပ်လိုက်တာနဲ့ dropdown list တစ်ခု ပေါ်လာပါတယ်။

   [Files နဲ့ folders အများအပြားပါတဲ့](#files-နဲ့-folders-တွေ-ထည့်ခြင်း) OpenAPI specification တစ်ခုထဲကို snippet တစ်ခု ထည့်နေတယ်ဆိုရင် — snippet ထည့်ဖို့ သင့်တော်တဲ့ file ကို Postman က ဖော်ထုတ်ပေးပါတယ်။

   ကိုယ့် OpenAPI specification ထဲမှာ **Servers** ဒါမှမဟုတ် **Tags** sections တွေ မပါရင် — specification outline ထဲမှာ ဒီ sections တွေကို ချဲ့ပြီး **Add** ကို နှိပ်နိုင်ပါတယ်။ ဒါက snippets တွေကို သုံးပြီး သက်ဆိုင်ရာ section ကို ကိုယ့် specification ထဲကို ထည့်ပေးပါတယ်။

2. Section က section type တစ်ခုထက်ပိုပြီး ပံ့ပိုးရင် dropdown list ကနေ တစ်ခုကို ရွေးပါ:

   * **Schemas** (OpenAPI 3.0 ဒါမှမဟုတ် 3.1) နဲ့ **Definitions** (OpenAPI 2.0) section ဘေးက ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) ကို နှိပ်တဲ့အခါ — schema အသစ်တစ်ခုကို အစကနေ ဖန်တီးနိုင်သလို [JSON body တစ်ခုကနေ schema တစ်ခု generate လုပ်](#json-body-တစ်ခုကနေ-schema-generate-လုပ်ခြင်း)လို့လည်း ရပါတယ်။
   * (OpenAPI 3.0 နဲ့ 3.1 အတွက်ပဲ) **Components** section ဘေးက ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) ကို နှိပ်တဲ့အခါ — ပံ့ပိုးထားတဲ့ section type တစ်ခုကို ရွေးပြီး snippet တစ်ခုနဲ့ ထည့်နိုင်ပါတယ်။

3. Section ထဲကို ကိုယ့် content တွေ ထည့်ပါ။ Generate လုပ်ထားတဲ့ snippet ထဲက fields တွေကြားမှာ ရွှေ့ဖို့ **Tab** key ကို သုံးနိုင်ပါတယ်။

Postman Enterprise plan တစ်ခုမှာ ဆိုရင် — ကိုယ့် team ရဲ့ Component Library ထဲမှာ OpenAPI specifications တွေအတွက် [reusable components တွေ ဖန်တီး](https://learning.postman.com/docs/design-apis/specifications/component-library/)နိုင်ပါတယ်။ ဒါက ကိုယ့် team ကို components တွေကို နေရာတစ်ခုတည်းမှာ ထိန်းသိမ်း, စံသတ်မှတ်နိုင်စေပါတယ်။

OpenAPI specifications တွေမှာ snippets တွေ သုံးတဲ့အခါ အောက်ပါတွေကို သတိပြုပါ:

* **Snippets တွေက valid syntax လိုအပ်ပါတယ်။** Postman က ကိုယ့် specification ထဲမှာ syntax errors တွေ တွေ့ရင် — အဲဒါတွေကို မဖြေရှင်းမချင်း snippets တွေနဲ့ sections တွေ ထည့်လို့ မရပါဘူး။ [ကိုယ့် specification ထဲက syntax errors တွေကို ကြည့်ရှု, ပြုပြင်နည်း](/docs/postman/validate-a-specification) ကို လေ့လာပါ။

* **Snippets တွေက duplicate sections တွေ ဖန်တီးပေးမှာ မဟုတ်ပါဘူး။** ကိုယ့် specification ထဲမှာ ရှိပြီးသား section တစ်ခုကို ထပ်ထည့်တာကို Postman က တားဆီးပါတယ်။ ဥပမာ — operation တစ်ခုမှာ request body တစ်ခု ရှိနေပြီးသားဆိုရင် — နောက် request body တစ်ခု ထည့်ဖို့ snippet တစ်ခုကို သုံးလို့ မရပါဘူး။

## JSON body တစ်ခုကနေ schema generate လုပ်ခြင်း

Snippet တစ်ခုနဲ့ schema အသစ်တစ်ခု ထည့်မယ့်အစား — JSON format နဲ့ request ဒါမှမဟုတ် response body တစ်ခုကနေ schema အသစ်တစ်ခုကို generate လုပ်နိုင်ပါတယ်။

JSON body တစ်ခုကို သုံးပြီး schema အသစ်တစ်ခု generate လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Specification အမျိုးအစားပေါ် အခြေခံပြီး အောက်ပါတစ်ခုကို ရွေးပါ:

   * **OpenAPI 3.0 ဒါမှမဟုတ် 3.1** — **Components > Schemas** ကို ရွေးပြီး ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add Schema** ကို နှိပ်ကာ **Generate from JSON body** ကို ရွေးပါ။
   * **OpenAPI 2.0** — **Definitions** ကို ရွေးပြီး ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add Definition** ကို နှိပ်ကာ **Generate from JSON body** ကို ရွေးပါ။
   * **AsyncAPI** — **Components > Schemas** ကို ရွေးပြီး ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Add schema** ကို နှိပ်ကာ **Generate from JSON body** ကို ရွေးပါ။

2. **Enter JSON body** pane ထဲမှာ — ကိုယ့် specification ထဲကို ထည့်ချင်တဲ့ schema ကို ကိုယ်စားပြုတဲ့ JSON format နဲ့ request ဒါမှမဟုတ် response body တစ်ခုကို ရိုက်ထည့်ပါ။ **Generated Schema Preview** pane ထဲမှာ — JSON body ကို specification ရဲ့ language နဲ့ format အဖြစ် ပြောင်းပေးပါတယ်။

3. Generate လုပ်ထားတဲ့ schema ကို ကိုယ့် specification ထဲကို ထည့်ဖို့ **Insert** ကို နှိပ်ပါ။

   [Files နဲ့ folders အများအပြားပါတဲ့](#files-နဲ့-folders-တွေ-ထည့်ခြင်း) OpenAPI specification တစ်ခုထဲကို generate လုပ်ထားတဲ့ schema တစ်ခု ထည့်နေတယ်ဆိုရင် — schema ထည့်ဖို့ သင့်တော်တဲ့ file ကို Postman က ဖော်ထုတ်ပေးပါတယ်။

4. ကိုယ့် schema အတွက် နာမည်တစ်ခု ရိုက်ထည့်ပါ။

![Generate schema from JSON body](https://assets.postman.com/postman-docs/v12/specs-generate-schema-from-json-v12-01.png)

## Specification တစ်ခုကို duplicate လုပ်ခြင်း

Specification တစ်ခုကို duplicate လုပ်ခြင်းအားဖြင့် — မူရင်းကို မထိခိုက်စေဘဲ တည်းဖြတ်နိုင်တဲ့ မိတ္တူတစ်ခု ဖန်တီးနိုင်ပါတယ်။ မူရင်းကို ကိုးကားချက်အဖြစ် ထားရင်းနဲ့ ကိုယ့် API ရဲ့ version အသစ်တစ်ခု ဖန်တီးချင်တဲ့အခါ ဒါမှမဟုတ် API အသစ်တစ်ခုအတွက် အစပြုချက်အဖြစ် ရှိပြီးသား specification တစ်ခုကို သုံးချင်တဲ့အခါ — ဒါက အသုံးဝင်ပါတယ်။

Specification တစ်ခုကို duplicate လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ — specification တစ်ခုအတွက် ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **More actions > Duplicate** ကို ရွေးပါ။
2. (ထည့်စရာမလို) Specification ကို နာမည်ပြောင်းပါ။

## Specification တစ်ခုကို ရွှေ့ပြောင်းခြင်း

Specification တစ်ခုကို workspace အသစ်တစ်ခုဆီ ရွှေ့ပြီး — ကိုယ့် team နဲ့ မျှဝေနိုင်သလို ကိုယ့် workspaces တွေကိုလည်း စုစည်းနိုင်ပါတယ်။ Specification တစ်ခုကို ရွှေ့ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ — specification တစ်ခုအတွက် ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **More actions > Move** ကို ရွေးပါ။
2. Specification ကို ရွှေ့မယ့် workspace ကို ရှာပြီး ရွေးကာ **Move Specification** ကို နှိပ်ပါ။

## Files နဲ့ folders တွေ ထည့်ခြင်း

OpenAPI ဒါမှမဟုတ် protobuf [format](/docs/postman/add-files-to-a-specification) file တစ်ခုထဲကို files နဲ့ folders တွေ ထည့်ပြီး — အဲဒါကို multi-file specification တစ်ခုအဖြစ် ပြောင်းလဲနိုင်ပါတယ်။ ဒါက ကိုယ့် specification ကို ပိုကောင်းအောင် စုစည်း, စီမံခန့်ခွဲနိုင်စေပါတယ်။ ပုံမှန်အားဖြင့် — OpenAPI ဒါမှမဟုတ် protobuf specification အသစ်တစ်ခု ဖန်တီးတဲ့အခါ Postman က root index file တစ်ခုပါတဲ့ single-file specification တစ်ခုကို ဖန်တီးပေးပါတယ်။

[Multi-file specification တစ်ခု ဖန်တီးပြီး စီမံခန့်ခွဲနည်း](/docs/postman/add-files-to-a-specification) ကို လေ့လာပါ။

## Autocomplete သုံးပြီး specification တည်းဖြတ်ခြင်း

Specification ကို တည်းဖြတ်နေတုန်း — autocomplete suggestions တွေကို Postman က ပေးပါတယ်။ Specification type နဲ့ ရှိပြီးသား content တွေအပေါ် အခြေခံပြီး — Postman က properties တွေနဲ့ တန်ဖိုးမှန်တွေကို အကြံပြုပေးပါတယ်။ [Syntax errors နဲ့ API governance ပြဿနာတွေကိုလည်း Postman က ဖော်ထုတ်](/docs/postman/validate-a-specification)ပြီး — ပြုပြင်နိုင်ဖို့ အသေးစိတ်တွေကို ပြသပေးပါတယ်။

![Edit a specification with autocomplete](https://assets.postman.com/postman-docs/v12/specs-autocomplete-v12-01.png)
