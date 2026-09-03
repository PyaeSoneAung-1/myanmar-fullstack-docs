---
title: "ကိုယ့် API consumers တွေအတွက် Run in Postman button တစ်ခု ဖန်တီးခြင်း (Create a Run in Postman button for your API consumers)"
description: "Run in Postman button တစ်ခု ဖန်တီးနည်း — users တွေ ကိုယ့် Postman Collections တွေကို ချက်ချင်း fork လုပ်နိုင်အောင် website ဒါမှမဟုတ် README ထဲမှာ embed လုပ်ခြင်း၊ HTML/Markdown embed code formats တွေ ရွေးချယ်ခြင်းနဲ့ button အသုံးပြုပုံ"
order: 165
source: "https://learning.postman.com/docs/publishing-your-api/run-in-postman/creating-run-button/"
status: translated
updated: 2026-09-03
---

**Run in Postman** button တစ်ခု ဖန်တီးခြင်းအားဖြင့် — users တွေ ကိုယ့် Postman Collections တွေကို သူတို့ရဲ့ workspaces တွေထဲမှာ ချက်ချင်း fork လုပ်နိုင်ပါတယ်။ Developers တွေ ကိုယ့် API နဲ့ interact လုပ်နိုင်ဖို့ — ဒီ button ကို ကိုယ့် website ဒါမှမဟုတ် README တစ်ခုထဲမှာ embed လုပ်နိုင်ပါတယ်။

#### သတိပြုရန်

**Run in Postman** button က HTTP requests တွေ ပါဝင်တဲ့ collections တွေအတွက်သာ ရနိုင်ပါတယ်။

Active ဖြစ်နေတဲ့ **Run in Postman** buttons တွေကို — original collection ထဲက ဘယ်အပြောင်းအလဲနဲ့မဆို အလိုအလျောက် update လုပ်ပေးပါတယ်။ ဒါကြောင့် — publishers တွေအနေနဲ့ collection ရဲ့ လင့်ခ်ကို ကိုယ်တိုင် update လုပ်စရာ မလိုဘဲ — ကိုယ့် consumers တွေဆီ collection ရဲ့ နောက်ဆုံး ဗားရှင်းကို အမြဲ ရောက်ရှိစေပါတယ်။ ဥပမာ — အောက်က **Run in Postman** button ကို click လုပ်ပြီး Postman API collection ရဲ့ နောက်ဆုံး ဗားရှင်းကို fork လုပ်နိုင်ပါတယ်:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a?action=collection%2Ffork\&source=rip_markdown\&collection-url=entityId%3D12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a%26entityType%3Dcollection%26workspaceId%3D405e0480-49cf-463b-8052-6c0d05a8e8f3)

**Run in Postman** buttons တွေနဲ့ share လုပ်ထားတဲ့ collections တွေ အားလုံးမှာ [fork counts](/docs/postman/forking-elements) တွေ ပါဝင်တာမို့ — developer တွေ ကိုယ့် API ကို ဘယ်လို အသုံးပြုနေလဲဆိုတာ ကိုယ်ရော ကိုယ့် consumers တွေပါ နားလည်နိုင်ပါတယ်။

**Run in Postman** button တစ်ခု ဖန်တီးဖို့ — ကိုယ့် collection က public workspace တစ်ခုထဲမှာ ရှိနေရပါမယ်။ မရှိသေးဘူးဆိုရင် — [workspace ရဲ့ visibility ကို public အဖြစ် ပြောင်းဖို့](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/#convert-an-existing-workspace-to-a-public-workspace) ဒါမှမဟုတ် [collection ကို public workspace တစ်ခုဆီ ရွှေ့ဖို့](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#move-elements-to-workspaces) လိုအပ်ပါလိမ့်မယ်။

#### မှတ်ချက်

OpenAPI နဲ့ RAML လို API specification formats တွေကနေလည်း **Run in Postman** button တစ်ခု ဖန်တီးနိုင်ပါတယ်။ အရင်ဆုံး — file ကို [Postman ထဲကို import လုပ်ပြီး](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/) collection အဖြစ် ပြောင်းလဲပါ။ ဒါမှမဟုတ် — [Spec Hub](/docs/postman/generate-collections) မှာ ကိုယ့် API ကနေ collection တစ်ခု generate လုပ်ပါ။

## Run in Postman button တစ်ခု ဖန်တီးခြင်း

**Run in Postman** button တစ်ခု ဖန်တီးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Postman header ထဲမှာ — navigation menu ကို ဖွင့်ပါ။ ပြီးရင် ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/state-published-stroke.svg#icon) **Public API Network** ကို နှိပ်ပါ။

2. ဘယ်ဘက် အောက်ထောင့်မှာ — ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Create New** ကို နှိပ်ပါ။ ပြီးရင် ![Run icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-run-stroke.svg#icon) **Run in Postman button** ကို နှိပ်ပါ။

3. Collection တစ်ခုနဲ့ (optional) environment တစ်ခုကို ရွေးပါ။

4. **Next** ကို နှိပ်ပါ။

5. HTML ဒါမှမဟုတ် Markdown နဲ့ လိုက်ဖက်တဲ့ embed code format တစ်ခုကို ရွေးပါ:

   * **HTML friendly** — ဒီ embed code က JavaScript, HTML နဲ့ CSS တွေကို အသုံးပြုထားတာမို့ — website တစ်ခုအတွက် button ကို customize လုပ်နိုင်ပါတယ်။ Environments တွေကို dynamically (လှုပ်ရှားမှုရှိရှိ) ဖန်တီး/update လုပ်ပြီး — user တစ်ယောက်ရဲ့ workspace ထဲကို environment variables တွေ ထည့်နိုင်အောင် [embed code ကို customize လုပ်နိုင်ပါတယ်](/docs/postman/customize-run-button)။

   * **Markdown friendly** — ဒီ embed code က Markdown ကို အသုံးပြုထားတာမို့ — README, blog ဒါမှမဟုတ် တခြား Markdown document တစ်ခုမှာ ပြသနိုင်ပါတယ်။

6. ![Copy icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-copy-stroke.svg#icon) **Copy Code** ကို နှိပ်ပါ။

7. Code ကို — button ပြသချင်တဲ့ နေရာမှာ embed လုပ်ပါ။ ဥပမာ — ကိုယ့် organization ရဲ့ public API documentation။

#### အကြံပြုချက်

Public workspace တစ်ခုထဲမှာဆိုရင် — collection တစ်ခုကို ဖွင့်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** > **Share** ကို နှိပ်လို့လည်း ရပါတယ်။ ပြီးရင် ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-options-stroke.svg#icon) **View more actions** > **Run in Postman** ကို နှိပ်ပါ။

## Run in Postman button တစ်ခုကို အသုံးပြုခြင်း

**Run in Postman** button ကို click လုပ်လိုက်ရင် — collection ကို ၎င်းရဲ့ public workspace ထဲမှာ အရင်ဆုံး ကြည့်ရှုဖို့ ဒါမှမဟုတ် ကိုယ့် workspace ထဲကို fork လုပ်ဖို့ ရွေးချယ်နိုင်တဲ့ page တစ်ခု ဖွင့်ပေးပါတယ်။

[Collection ကို ကိုယ့် workspace ထဲ fork လုပ်ခြင်း](/docs/postman/forking-elements) က — source collection ဆီ pull requests တွေ တင်သွင်းနိုင်စေပါတယ်။
