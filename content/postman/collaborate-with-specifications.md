---
title: "Postman မှာ specifications တွေနဲ့ ပူးပေါင်းဆောင်ရွက်ခြင်း (Collaborate with specifications in Postman)"
description: "Postman မှာ specifications တွေ ပူးပေါင်းဆောင်ရွက်ခြင်း — specification share လုပ်ခြင်း, version control (fork), changelog ကြည့်ရှုခြင်း, version tag ထည့်ခြင်း နဲ့ comment လုပ်ခြင်း"
order: 59
source: "https://learning.postman.com/docs/design-apis/specifications/collaborate-with-specifications/"
status: translated
updated: 2026-09-02
---

Postman မှာ API တစ်ခု ဒီဇိုင်းလုပ်တဲ့အခါ — ကိုယ့် team နဲ့အတူ specification ပေါ်မှာ အလုပ်လုပ်နိုင်ပါတယ်။ ကိုယ့် specifications တွေကို share လုပ်ပြီး — ဒီဇိုင်းကို context နဲ့အညီ ဆွေးနွေးဖို့ comments တွေ ထားခဲ့နိုင်ပါတယ်။ တည်းဖြတ်မှုတွေကို ခြေရာခံဖို့, ဘယ်သူက အပြောင်းအလဲတွေ လုပ်ခဲ့လဲ ကြည့်ဖို့ နဲ့ revision တစ်ခုချင်းစီကို tag လုပ်ဖို့ changelog ကို သုံးပါ။ Specification တစ်ခုကို fork လုပ်ပြီး — မူရင်းကို မထိခိုက်စေဘဲ ကိုယ့် workspace ထဲမှာ အလုပ်လုပ်နိုင်ပါတယ်။

## Specification တစ်ခုကို share လုပ်ခြင်း

Specification တစ်ခုကို collaborators တွေနဲ့ share လုပ်နိုင်ပါတယ်။ Sidebar ထဲက **Specs** ကို ချဲ့ပြီး specification တစ်ခုကို ရွေးပါ။ ပြီးရင် workbench ထဲက ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-link-stroke.svg#icon) **Copy link** ကို နှိပ်ပါ။

![Copy a link to a specification](https://assets.postman.com/postman-docs/v12/specs-copy-link-v12-03.png)

Elements တွေ share လုပ်ခြင်းအကြောင်း အသေးစိတ်အတွက် — [Postman မှာ ကိုယ့်အလုပ်တွေကို share လုပ်ခြင်း](/docs/postman/sharing) ကို ကြည့်ပါ။

## Specifications တွေအတွက် version control

Specifications တွေအတွက် [version control](/docs/postman/version-control-overview) က — specification တစ်ခုကို fork လုပ်ပြီး fork လုပ်ထားတဲ့ specification ထဲမှာ အပြောင်းအလဲတွေ လုပ်နိုင်စေပါတယ်။ ဒါက မူရင်းကို မထိခိုက်စေဘဲ — specifications တွေပေါ်မှာ ကိုယ့် team နဲ့ ပူးပေါင်းဆောင်ရွက်နိုင်စေပါတယ်။ Fork တစ်ခုထဲမှာ လုပ်ထားတဲ့ အပြောင်းအလဲတွေကို ပြန်သုံးသပ်ပြီး parent specification ထဲကို merge လုပ်နိုင်ပါတယ်။

Elements တွေ fork လုပ်ခြင်းအကြောင်း အချက်အလက်အတွက် — [Postman မှာ elements တွေကို fork လုပ်ခြင်း](/docs/postman/forking-elements) ကို ကြည့်ပါ။

Pull requests တွေကို specifications တွေအတွက် လက်ရှိမှာ မရနိုင်သေးပါဘူး။

## Specification အပြောင်းအလဲတွေကို changelog နဲ့ ကြည့်ရှုခြင်း

Changelog က — specification တစ်ခုဆီက အပြောင်းအလဲတွေနဲ့ revisions တွေရဲ့ ပြည့်စုံတဲ့ စာရင်းကို အချိန်အစဉ်လိုက် ပေးပါတယ်။ အပြောင်းအလဲတွေ ဖြစ်ခဲ့တဲ့ အချိန်နဲ့ ရက်စွဲ, အပြောင်းအလဲတွေ လုပ်ခဲ့တဲ့ users တွေ နဲ့ specification ထဲက ဘယ်နေရာမှာ တည်းဖြတ်ခဲ့လဲ ဆိုတာတွေကို ကြည့်ရှုဖို့ သုံးနိုင်ပါတယ်။ Changelog ကို ကြည့်ဖို့ — ညာဘက် sidebar ထဲက ![Changelog icon](https://assets.postman.com/postman-docs/v12/icon-changelog-v12.jpg#icon) **Changelog** ကို နှိပ်ပါ။

စာဖတ်ရလွယ်ကူစေဖို့ — မိနစ်အနည်းငယ်အတွင်း လုပ်ထားတဲ့ အပြောင်းအလဲတွေကို Postman က sessions တွေအဖြစ် အုပ်စုဖွဲ့ပေးပါတယ်။ Changelog ထဲက session တစ်ခုကို နှိပ်ပြီး — ၎င်းရဲ့ အပြောင်းအလဲတွေကို ပြန်သုံးသပ်နိုင်ပါတယ်။ Diff တစ်ခုက changelog ထဲမှာ ကြည့်လို့ မဆန့်လောက်အောင် ကြီးနေရင် — diff ပေါ်မှာ mouse ချပြီး နှိပ်ကာ window အသစ်တစ်ခုမှာ diff အပြည့်အစုံကို ဖွင့်နိုင်ပါတယ်။

Changelog ထဲက နောက်ဆုံး အပြောင်းအလဲတွေနဲ့ revisions တွေမှာ [version tag တစ်ခုလည်း ထည့်](#changelog-ထဲ-version-tag-တစ်ခု-ထည့်ခြင်း)နိုင်ပါတယ်။

Changelog ကို refresh လုပ်ဖို့ — ![Refresh icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-refresh-stroke.svg#icon) **Refresh changelog** ကို နှိပ်ပါ။

### Changelog ထဲ version tag တစ်ခု ထည့်ခြင်း

ကိုယ့် API specification ရဲ့ version တစ်ခုကို သတ်မှတ်ဖို့ — changelog ထဲက နောက်ဆုံး အပြောင်းအလဲတွေနဲ့ revisions တွေမှာ version tag တစ်ခု ထည့်နိုင်ပါတယ်။

Version tag တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ညာဘက် sidebar ထဲက ![Changelog icon](https://assets.postman.com/postman-docs/v12/icon-changelog-v12.jpg#icon) **Changelog** ကို နှိပ်ပါ။
2. Changelog ထဲမှာ **Add Version Tag** ကို နှိပ်ပါ။ နောက်ဆုံး အပြောင်းအလဲတွေမှာ version tag တစ်ခု ရှိနေပြီးသားဆိုရင် ဒါမှမဟုတ် tag လုပ်စရာ အပြောင်းအလဲတွေ မရှိရင် — version tag ထည့်လို့ မရပါဘူး။
3. ကိုယ့် version tag ကို ရိုက်ထည့်ပါ။
4. **Add Version Tag** ကို နှိပ်ပါ။

Version tag တစ်ခုက — ၎င်း သက်ရောက်တဲ့ အပြောင်းအလဲတွေဘေးမှာ changelog ထဲမှာ ပြသပေးပါတယ်။ အဲဒီ version ထဲ ပါဝင်တဲ့ အပြောင်းအလဲတွေကို read-only mode နဲ့ ကြည့်ဖို့ version tag တစ်ခုကို နှိပ်ပါ။ Teammates တွေနဲ့ မျှဝေလို့ရတဲ့ version ဆီက link တစ်ခု copy လုပ်ဖို့ ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-link-stroke.svg#icon) **Copy version link** ကိုလည်း နှိပ်နိုင်ပါတယ်။

## Specification တစ်ခုမှာ comment လုပ်ခြင်း

Spec Hub ထဲက specification တစ်ခုမှာ [comments](/docs/postman/comments) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ထည့်နိုင်ပါတယ်။ Postman ထဲမှာ ကိုယ့် specifications တွေကို collaborators တွေနဲ့ ဆွေးနွေးဖို့ comments တွေကို သုံးပါ — စကားဝိုင်းက context ထဲမှာ ရှိနေပြီး တခြား stakeholders တွေလည်း မြင်နိုင်ပါတယ်။

Specification တစ်ခုမှာ comment တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Specs** ကို နှိပ်ပြီး — comment လုပ်ချင်တဲ့ specification ကို ရွေးပါ။
2. ညာဘက် sidebar ထဲက ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-comments-stroke.svg#icon) **Comments** ကို နှိပ်ပါ။
3. ကိုယ့် comment ကို ရိုက်ထည့်ပြီး **Comment** ကို နှိပ်ပါ။

ကိုယ့် API ထဲကို ထည့်ထားတဲ့ collections တွေ နဲ့ အဲဒီ collection ထဲက requests, folders တွေမှာလည်း comments တွေ ထည့်နိုင်ပါတယ်။ [Collection တစ်ခုမှာ comment လုပ်ခြင်း](/docs/postman/comments) အကြောင်း ပိုလေ့လာပါ။
