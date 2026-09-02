---
title: "API specification တစ်ခုကနေ collections တွေ generate လုပ်ခြင်း (Generate collections from your API specification)"
description: "API specification တစ်ခုကနေ collection generate လုပ်ခြင်း — generate settings တွေ, OpenAPI specification နဲ့ collection sync လုပ်ခြင်း, sync settings တွေ configure လုပ်ခြင်း"
order: 60
source: "https://learning.postman.com/docs/design-apis/specifications/generate-collections/"
status: translated
updated: 2026-09-02
---

ကိုယ့် team members တွေနဲ့ consumers တွေကို မျှဝေဖို့ [specification တစ်ခုကနေ collection တစ်ခု generate လုပ်](#specification-တစ်ခုကနေ-collections-generate-လုပ်ခြင်း)နိုင်ပါတယ်။ Generated collection နဲ့ဆိုရင် — သူတို့က ကိုယ့် API ကို test လုပ်နိုင်သလို ၎င်းရဲ့ စွမ်းဆောင်နိုင်ချက်တွေကိုလည်း စူးစမ်းနိုင်ပါတယ်။ Collection ကို OpenAPI 2.0, 3.0 ဒါမှမဟုတ် 3.1 specification တစ်ခုကနေ generate လုပ်ထားတယ်ဆိုရင် — [collection ကို ၎င်းရဲ့ specification နဲ့ sync လုပ်ထား](#collections-တွေကို-openapi-specification-နဲ့-sync-လုပ်ထားခြင်း)နိုင်ပါတယ်။

Collections တွေ generate လုပ်ခြင်းနဲ့ sync လုပ်ခြင်းအကြောင်း ပိုလေ့လာဖို့ — [Sync collections and specifications reference](https://learning.postman.com/docs/design-apis/sync-specifications-reference/) ကို ကြည့်ပါ။

## Specification တစ်ခုကနေ collections generate လုပ်ခြင်း

WebSocket protocol သုံးတဲ့ ကိုယ့် OpenAPI, AsyncAPI နဲ့ Smithy [specifications](/docs/postman/specifications-overview) တွေကနေ [Postman Collection](/docs/use/use-collections/overview/) တစ်ခု generate လုပ်နိုင်ပါတယ်။ Specification အပေါ် အခြေခံပြီး — folders, requests နဲ့ response examples တွေပါတဲ့ collection တစ်ခုကို Postman က အလိုအလျောက် ဖန်တီးပေးပါတယ်။ Specification တစ်ခုတည်းကနေ collection တစ်ခုထက်ပိုပြီးလည်း generate လုပ်နိုင်ပါတယ်။

Specification တစ်ခုကနေ collection တစ်ခု generate လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Specs** ကို ချဲ့ပြီး — ပံ့ပိုးထားတဲ့ specification တစ်ခုကို ရွေးပါ။

2. Workbench ထဲမှာ — ညာဘက်အပေါ်က ![New collection icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-newCollection-stroke.svg#icon) **Generate Collection** ကို နှိပ်ပါ။ Specification ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **More actions** ကို နှိပ်ပြီး **Generate Collection** ကို ရွေးလည်း ရပါတယ်။

   ![Generate a collection from a specification](https://assets.postman.com/postman-docs/v12/specs-generate-collection-v12-03.png)

3. ကိုယ့် collection အတွက် နာမည်တစ်ခု ရိုက်ထည့်ပါ။

4. (OpenAPI specifications တွေအတွက်ပဲ) Collection အသစ်ကို customize လုပ်ဖို့ settings တွေ ပြောင်းပါ:

   * **Naming requests** — Generated collection ထဲက request names တွေကို ဘယ်လို သတ်မှတ်မလဲ ဆုံးဖြတ်ပေးပါတယ်။ Request names တွေကို `summary`, `operationId`, `description` ဒါမှမဟုတ် `url` schema values တွေအပေါ် အခြေခံပြီး သတ်မှတ်ဖို့ **Fallback** (default) ကို ရွေးပါ။ Path parameter အပေါ် အခြေခံပြီး request names တွေ သတ်မှတ်ဖို့ **URL** ကို ရွေးပါ။

   * **Folder organization** — Specification ရဲ့ **Paths** (default) ဒါမှမဟုတ် **Tags** တွေအပေါ် အခြေခံပြီး folders တွေ ဖန်တီးမလား ရွေးပါ။

   * **Nested folder organization using tags** — Specification ရဲ့ tags တွေအပေါ် အခြေခံပြီး folders တွေ ဖန်တီးထားရင် — operations တွေကို အုပ်စုဖွဲ့ဖို့ သုံးထားတဲ့ tags တွေရဲ့ အစဉ်အတိုင်း nested folder structure တစ်ခု ဖန်တီးဖို့ ဒါကို ဖွင့်ပါ။

   * **Set indent character** — Character indentation ကို **Space** (default) ဒါမှမဟုတ် **Tab** အဖြစ် သတ်မှတ်ပါ။

   * **Include auth info in example requests** — Example requests တွေကနေ authentication parameters တွေ ထည့်သွင်းဖို့ ဒါကို ဖွင့်ပါ။

   * **Enable optional parameters** — Generated collection နဲ့ ၎င်းရဲ့ requests တွေထဲမှာ optional parameters တွေ သုံးနိုင်စေဖို့ ဒါကို ဖွင့်ပါ။

   * **Keep implicit headers** — Generated collection နဲ့ ၎င်းရဲ့ requests တွေထဲမှာ implicit headers တွေ ထည့်သွင်းဖို့ ဒါကို ဖွင့်ပါ။ ပုံမှန်အားဖြင့် ဒါက ပိတ်ထားပါတယ်။

   * **Include deprecated properties** — Generated collection ထဲမှာ deprecated operations, parameters နဲ့ properties တွေ ထည့်သွင်းဖို့ ဒါကို ဖွင့်ပါ။

   * **Always inherit authentication** — Request တိုင်းထဲမှာ authentication details တွေ ထည့်ပြီး parent collection ကနေ authentication details တွေကို အမွေဆက်ခံဖို့ ဒါကို ဖွင့်ပါ။ ပုံမှန်အားဖြင့် ဒါက ပိတ်ထားပါတယ်။

   **Parameter generation** setting က deprecated ဖြစ်ပါတယ်။ Generated collections တွေက ပုံမှန်အားဖြင့် parameter generation အတွက် examples တွေကို သုံးပါလိမ့်မယ်။ Schema parameter generation ကို သုံးပြီး generate လုပ်ထားတဲ့ ရှိပြီးသား collections တွေကတော့ — သူတို့ရဲ့ လက်ရှိ strategy အတိုင်း sync ဆက်လုပ်နေပါလိမ့်မယ်။

5. **Generate collection** ကို နှိပ်ပါ။

Generated collection ကို ကြည့်ဖို့ — ![New collection icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-newCollection-stroke.svg#icon) **Collections** ကို နှိပ်ပြီး generated collection ရဲ့ နာမည်ကို နှိပ်ပါ။ Sidebar ထဲက **Collections** ကို နှိပ်ပြီး — ကိုယ့် generated collection ဆီ သွားလို့လည်း ရပါတယ်။

## Collections တွေကို OpenAPI specification နဲ့ sync လုပ်ထားခြင်း

AsyncAPI ဒါမှမဟုတ် Smithy specifications တွေကနေ generate လုပ်ထားတဲ့ collections တွေအတွက် — syncing ကို မရနိုင်ပါဘူး။

ကိုယ့် OpenAPI specifications တွေကနေ [collection တစ်ခု generate လုပ်](#specification-တစ်ခုကနေ-collections-generate-လုပ်ခြင်း)တဲ့အခါ — specification ထဲမှာ define လုပ်ထားတာတွေနဲ့ ကိုက်ညီတဲ့ requests တွေပါတဲ့ collection တစ်ခုကို Postman က ဖန်တီးပေးပါတယ်။ Collection ဒါမှမဟုတ် specification ကို — request အသစ် ဒါမှမဟုတ် path အသစ် ထည့်တာမျိုး update လုပ်ရင် — generated collection က specification နဲ့ sync မဖြစ်တော့ဘူးဆိုတာ Postman က သတိပေးပါတယ်။

ပုံမှန်အားဖြင့် — specification နဲ့ sync လုပ်တဲ့အခါ generated collection ထဲက elements တွေကို Postman က ဖျက်ပစ်မှာ မဟုတ်ပါဘူး။ **Remove orphan requests** [setting](#sync-settings-တွေ) ကို ဖွင့်ထားရင် — specification ထဲက endpoint ဘယ်ဟာနဲ့မှ မကိုက်ညီတဲ့ requests တွေကို sync လုပ်နေစဉ်မှာ ဖျက်ပစ်ပါတယ်။ ဥပမာ — ကိုယ့် specification ထဲက ရှိပြီးသား path တစ်ခုကို နာမည်ပြောင်းရင် — နာမည်ပြောင်းထားတဲ့ path အတွက် request အသစ်တစ်ခုကို ကိုယ့် collection ထဲမှာ Postman က ဖန်တီးပေးပါတယ်။ **Remove orphan requests** setting ကို ဖွင့်ထားမှသာလွဲပြီး — အရင်က path အတွက် request က ကျန်နေပါတယ်။

### Collection တစ်ခုဆီကို အပြောင်းအလဲတွေ sync လုပ်ခြင်း

OpenAPI specification တစ်ခုထဲမှာ လုပ်ထားတဲ့ အပြောင်းအလဲတွေကို generated collection တစ်ခုဆီ sync လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Specs** ကို ချဲ့ပြီး — OpenAPI specification တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ — ညာဘက်အပေါ်က ![Warning icon](https://assets.postman.com/postman-docs/aether-icons/v12/state-warning-stroke.svg#icon) **Update Collection** ကို နှိပ်ပါ။
3. Generated collection ဘေးက **Update** ကို နှိပ်ပါ။

### Specification တစ်ခုဆီကို အပြောင်းအလဲတွေ sync လုပ်ခြင်း

Collections တွေကို [multi-file OpenAPI specifications](/docs/postman/add-files-to-a-specification) တွေဆီ sync လုပ်တာကို မပံ့ပိုးပါဘူး။

Generated collection တစ်ခုထဲမှာ လုပ်ထားတဲ့ အပြောင်းအလဲတွေကို ကိုယ့် OpenAPI specification ဆီ sync လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး — sync လုပ်ချင်တဲ့ collection ကို ရွေးပါ။
2. Collection ရဲ့ **Overview** tab ထဲမှာ — ![Update icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-update-stroke.svg#icon) **Sync specification** ကို နှိပ်ပါ။

![Update a specification from a collection](https://assets.postman.com/postman-docs/v12/collection-sync-specification-12-02.png)

Specification ဆီကို တိုက်ရိုက် လုပ်ထားတဲ့ vendor extensions, operations နဲ့ requests တွေဆီက အပြောင်းအလဲတွေကို — collection က ပြန်လည် မဖျက်ဆီးပါဘူး။

## Sync settings တွေ configure လုပ်ခြင်း

Collections တွေနဲ့ OpenAPI specifications တွေကြားက syncing အပြုအမူကို customize လုပ်နိုင်စေမယ့် settings တွေကို configure လုပ်နိုင်ပါတယ်။

Sync settings တွေ configure လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Specs** ကို ချဲ့ပြီး — generated collection တစ်ခုပါတဲ့ OpenAPI specification တစ်ခုကို ရွေးပါ။
2. Workbench ထဲမှာ — ညာဘက်အပေါ်က ![New collection icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-newCollection-stroke.svg#icon) **Collections** ကို နှိပ်ပါ။
3. Collection တစ်ခုဘေးက ![Setting icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-setting-stroke.svg#icon) **Configure update settings** ကို နှိပ်ပါ။
4. Collection နဲ့ specification ကြားက [sync settings တွေကို configure လုပ်ပါ](#sync-settings-တွေ)။
5. **Save** ကို နှိပ်ပါ။

#### အကြံပြုချက်

Collection တစ်ခုကနေလည်း [sync settings တွေကို configure လုပ်](https://learning.postman.com/docs/design-apis/collections/generate-specifications/#configure-sync-settings)နိုင်ပါတယ်။

### Sync settings တွေ

Collections တွေနဲ့ OpenAPI specifications တွေကြားမှာ အောက်ပါ sync settings တွေကို configure လုပ်နိုင်ပါတယ်:

* **Sync example values between Spec and Collection** — Specification ထဲက examples တွေနဲ့ collection ထဲက values တွေကို sync လုပ်ထားဖို့ ဒါကို ဖွင့်ပါ။
* **Remove orphan requests** — ဖွင့်ထားရင် — update လုပ်ထားတဲ့ specification နဲ့ ကိုက်ညီဖို့ specification ထဲက endpoint ဘယ်ဟာနဲ့မှ မကိုက်ညီတဲ့ requests တွေကို sync လုပ်နေစဉ်မှာ collection ကနေ ဖျက်ပစ်ပါတယ်။
