---
title: "API specification တစ်ခု import လုပ်ခြင်း (Import an API specification)"
description: "ရှိပြီးသား API specification တစ်ခုကို Spec Hub ထဲကို ယူဆောင်လာခြင်း — files, folders, link, raw text, remote repository (GitHub, Bitbucket, GitLab, Azure DevOps) ကနေ import လုပ်ခြင်း"
order: 55
source: "https://learning.postman.com/docs/design-apis/specifications/import-a-specification/"
status: translated
updated: 2026-09-02
---

ရှိပြီးသား API specification တစ်ခုရှိလား။ ဒါဆိုရင် — Postman မှာ ဒီဇိုင်း, test လုပ်ပြီး ပူးပေါင်းဆောင်ရွက်ဖို့ အဲဒါကို Spec Hub ထဲကို ယူဆောင်လာနိုင်ပါတယ်။ Spec Hub က OpenAPI, AsyncAPI, protobuf, GraphQL နဲ့ Smithy [specifications](/docs/postman/specifications-overview) တွေကို import လုပ်တာကို ပံ့ပိုးပေးပါတယ်။ OpenAPI ကို collection အဖြစ် ဒါမှမဟုတ် specification နဲ့ collection နှစ်ခုလုံးအဖြစ် import လုပ်နိုင်ပြီး — အခြား formats အားလုံးကိုတော့ Spec Hub မှာ specification အဖြစ်ပဲ import လုပ်နိုင်ပါတယ်။

1. Sidebar ထဲမှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) ကို နှိပ်ပြီး **Import** ကို ရွေးပါ။

2. Specification file တစ်ခု import လုပ်ဖို့ အောက်ပါ option တွေထဲက တစ်ခုကို ရွေးပါ:

   * **files** ကို နှိပ်ပြီး — specification file တစ်ခုကို ရွေးပါ။ Single-file OpenAPI, AsyncAPI, protobuf, GraphQL ဒါမှမဟုတ် Smithy specifications တွေကို import လုပ်ဖို့ ဒါကို သုံးပါ။

   * **folders** ကို နှိပ်ပြီး — [multi-file OpenAPI ဒါမှမဟုတ် protobuf specification](/docs/postman/add-files-to-a-specification) တစ်ခုပါတဲ့ folder တစ်ခုကို ရွေးပါ။

     Multi-file OpenAPI ဒါမှမဟုတ် protobuf specification တစ်ခုထက်ပိုပြီးလည်း တစ်ချိန်တည်း import လုပ်နိုင်ပါတယ်။

   * Specification file တစ်ခုဆီကို link တစ်ခု ရိုက်ထည့်ပါ။

   * Raw text ကို paste လုပ်ပါ။

   * Remote GitHub, Bitbucket, GitLab ဒါမှမဟုတ် Azure DevOps repository တစ်ခုကနေ import လုပ်ပါ။ **Other Sources** ကို နှိပ်ပြီး — **GitHub**, **Bitbucket**, **GitLab** ဒါမှမဟုတ် **Azure** ကို ရွေးပါ။ ကိုယ့် repository ထဲကို sign in လုပ်ဖို့ ညွှန်ကြားချက်တွေကို လိုက်နာပါ။ ပြီးရင် repository နဲ့ တခြား သက်ဆိုင်ရာ အသေးစိတ်တွေကို ရွေးပြီး — import လုပ်ချင်တဲ့ branch ကို ရွေးပါ။

3. Single ဒါမှမဟုတ် multi-file OpenAPI specification တစ်ခုကို import လုပ်နေတယ်ဆိုရင် — Postman ထဲကို ဘယ်လို import လုပ်ချင်လဲ ရွေးပြီး **Import** ကို နှိပ်ပါ။ AsyncAPI နဲ့ protobuf specifications တွေကို Spec Hub မှာ specification အသစ်တစ်ခုအဖြစ် အလိုအလျောက် import လုပ်ပေးတာ သတိပြုပါ။

   * **Postman Collection** — Specification အပေါ် အခြေခံပြီး folders, requests နဲ့ response examples တွေပါတဲ့ collection တစ်ခုကို generate လုပ်ပေးပါတယ်။ Spec Hub မှာ specification အသစ်တစ်ခုကိုတော့ မဖန်တီးပေးပါဘူး။

   * **Specification with a Postman Collection** — ပေးထားတဲ့ OpenAPI, GraphQL ဒါမှမဟုတ် Smithy specification ကနေ collection တစ်ခု generate လုပ်ပြီး — Spec Hub မှာ specification အသစ်တစ်ခုကိုလည်း ဖန်တီးပေးပါတယ်။ OpenAPI 3.0 specifications တွေအတွက် — ကိုယ်က ၎င်းကို update လုပ်ရင် နောက်ပိုင်းမှာ specification ထဲက နောက်ဆုံး အပြောင်းအလဲတွေနဲ့ collection ကိုပါ update လုပ်နိုင်ပါတယ်။ [OpenAPI collections တွေကို specification တစ်ခုနဲ့ sync လုပ်ထားခြင်း](/docs/postman/generate-collections) အကြောင်း ပိုလေ့လာပါ။

     Multi-file OpenAPI specification တစ်ခုထက်ပိုပြီး import လုပ်နေတယ်ဆိုရင် — သူတို့ကို Postman ထဲကို ဘယ်လို import လုပ်ချင်လဲလည်း ရွေးနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — Postman က specification တစ်ခုချင်းစီအပေါ် အခြေခံပြီး collection တစ်ခု generate လုပ်ပေးပါတယ်။ Multi-file specification တစ်ခုချင်းစီအတွက် Spec Hub မှာ specification အသစ်တစ်ခု ဖန်တီးချင်ရင် **Import these as specs** checkbox ကို ရွေးနိုင်ပါတယ်။

   နောက်ထပ် configuration option တွေအတွက် ![Setting icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-setting-stroke.svg#icon) **View Import Settings** ကိုလည်း နှိပ်နိုင်ပါတယ်။ ဒီ options တွေက ကိုယ့် specification ပေါ်မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။

4. Postman footer မှာ ပေါ်လာတဲ့ **Importing** message ထဲမှာ — specification တစ်ခုဘေးက ![Open in Postman icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-openInPostman-stroke.svg#icon) **Go to Specification** ဒါမှမဟုတ် collection တစ်ခုဘေးက ![Open in Postman icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-openInPostman-stroke.svg#icon) **Go to Collection** ကို နှိပ်ပါ။

ကိုယ့် [Postman plan](https://www.postman.com/pricing/) က ကိုယ့် team ရဲ့ internal workspaces တွေမှာ specifications အရေအတွက် အကန့်အသတ်တစ်ခုပဲ ပေးပါတယ်။ [Postman မှာ resource usage အကြောင်း](https://learning.postman.com/docs/billing/resource-usage/#specifications) ပိုလေ့လာပါ။

Postman က ကိုယ့် authorize လုပ်ထားတဲ့ accounts တွေကို သိမ်းဆည်းထားတာကြောင့် — တခြား repositories နဲ့ services တွေကို ချိတ်ဆက်ဖို့ သူတို့ကို ပြန်သုံးနိုင်ပါတယ်။ Remote repositories တွေအတွက် [connected accounts တွေကို စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/getting-started/installation/settings/connected-accounts/) အကြောင်း ပိုလေ့လာပါ။
