---
title: "Comments များဖြင့် Postman မှာ ပူးပေါင်းဆောင်ရွက်ခြင်း (Collaborate with Comments)"
description: "Postman မှာ comments သုံးပြီး team နဲ့ ပူးပေါင်းလုပ်ဆောင်နည်း — global/inline comments ထည့်ခြင်း၊ @mentions၊ reply/react လုပ်ခြင်းနဲ့ comments resolve လုပ်ခြင်း"
order: 32
source: "https://learning.postman.com/docs/collaborating-in-postman/comments/"
status: translated
updated: 2026-09-02
---

Commenting က Postman ရဲ့ လက်တွေ့အကျဆုံး collaboration tools တွေထဲက တစ်ခု ဖြစ်ပြီး — APIs တွေရဲ့ publisher ရော consumer ဘက်မှာပါ သုံးနိုင်ပါတယ်။ Interactive communication ကနေတစ်ဆင့် — commenting က ရှင်းလင်းပြတ်သားမှု မရှိတာတွေကို ဖယ်ရှားပေးပြီး user experience ကောင်းမွန်စေကာ API-based services တွေရဲ့ အသုံးပြုမှု ပိုကျယ်ပြန့်လာစေဖို့ ကူညီပါတယ်။

API publishers တွေက API ရဲ့ lifecycle တစ်လျှောက် commenting ကို သုံးပြီး — API design တွေ ပိုကောင်းအောင် လုပ်နိုင်သလို API consumers တွေရဲ့ ပြဿနာတွေကိုလည်း ဖြေရှင်းပေးနိုင်ပါတယ်။ API consumers တွေကတော့ — သူတို့ သုံးနေတဲ့ APIs အကြောင်း API publishers တွေကို မေးခွန်းတွေ မေးပြီး အကူအညီ ရယူဖို့ commenting ကို သုံးနိုင်ပါတယ်။

Comments တွေက collection အဆင့်မှာ စုစည်းပါတယ် — ဒါကြောင့် collection ရဲ့ အစိတ်အပိုင်းအမျိုးမျိုးအကြောင်း ပြောဆိုမှုအားလုံးကို တစ်နေရာတည်းမှာ စစ်ဆေးနိုင်ပါတယ်။ Comment တစ်ခုရဲ့ header ကို နှိပ်လိုက်ရင် — comment တင်ထားတဲ့ element ဆီကို ခုန်သွားပါတယ်။

![Aggregated comments](https://assets.postman.com/postman-docs/v12/comment-aggregate-v12.png)

Git နဲ့ ချိတ်ဆက်ထားတဲ့ (Git-connected) workspaces တွေရဲ့ local mode မှာတော့ comments တွေ မရနိုင်ပါဘူး။ Comments တွေ သုံးဖို့ဆိုရင် — workspace ထဲက အပြောင်းအလဲတွေကို Postman cloud ဆီ sync လုပ်ထားရပါမယ်။ အသေးစိတ်အတွက် — [Native Git](https://learning.postman.com/docs/use/native-git/overview/) ကို ကြည့်ပါ။

## Postman မှာ comments တွေ သုံးခြင်း

Postman မှာ commenting အမျိုးအစား နှစ်မျိုး ရှိပါတယ်: [global](#global-comments) နဲ့ [inline](#inline-comments)။ Comment တစ်ခု ထည့်တဲ့အခါ — Postman က collection ထဲက တခြား contributors တွေကို ကိုယ့် comment အကြောင်း အသိပေး (notify) ပါတယ်။ Teammate တစ်ယောက်ကို သတ်မှတ်ဖို့ `@` ကို သုံးပြီး — စာရင်းထဲကနေ အဲဒီလူကို ရွေးပါ။ သူတို့ဆီ email ရော in-app notification ပါ ရောက်ပါတယ်။ In-app notifications တွေ ကြည့်ဖို့ — Postman header ထဲက notifications icon ![Notifications icon](https://assets.postman.com/postman-docs/icon-notification-bell-v9.jpg#icon) ကို နှိပ်ပါ။ Comment တစ်ခုရဲ့ link ကို copy လုပ်ပြီး ကိုယ့် team channels တွေထဲမှာလည်း paste လုပ်နိုင်ပါတယ်။

Teammate တစ်ယောက်ကို mention လုပ်ထားပေမယ့် — သူ့မှာ collection ကို access မရှိဘူးဆိုရင် comment ကို မဖတ်ခင် [access တောင်းခံဖို့](https://learning.postman.com/docs/collaborating-in-postman/requesting-access-to-elements/) လိုအပ်ပါတယ်။

Collection နဲ့ ၎င်းရဲ့ elements တွေအကြောင်း ယေဘုယျမေးခွန်းတွေအတွက် — ညာဘက် sidebar ထဲမှာ global comments တွေကို သုံးနိုင်ပါတယ်။

အောက်ပါ items တွေပေါ်မှာ inline comments တွေ ထည့်နိုင်ပါတယ်:

* Request တစ်ခု ဒါမှမဟုတ် example response ရဲ့ တစ်စိတ်တစ်ပိုင်း ဖြစ်တဲ့ — parameters, request body နဲ့ scripts

* Forked collections တွေထဲက pull requests

API specifications တွေပေါ်မှာလည်း Spec Hub ထဲမှာ comments ထည့်နိုင်ပါတယ်။ [Specifications](https://learning.postman.com/docs/design-apis/specifications/collaborate-with-specifications/#comment-on-a-specification) တွေပေါ်မှာ commenting လုပ်ခြင်းအကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Commenting အတွက် အကောင်းဆုံး အလေ့အကျင့်များ

Postman ထဲမှာ ကိုယ့် teammates တွေနဲ့ အလုပ်အကြောင်း ဆွေးနွေးဖို့ comments တွေကို သုံးပါ။ ဆွေးနွေးမှု ဆက်သွားစေဖို့ comment တစ်ခုကို reply လုပ်ပါ — ဒါမှမဟုတ် ဖြေရှင်းပြီးသွားပြီဆိုရင် comment ကို resolve လုပ်ပါ။ မေးခွန်းတွေ ဒါမှမဟုတ် feedback တွေ ရှိရင် — comments တွေထဲမှာ teammates တွေကို mention လုပ်ပြီး အသိပေးနိုင်ပါတယ်။

Public workspace ဒါမှမဟုတ် Partner Workspace ထဲက users တွေ — error တစ်ခုခု ကြုံရတဲ့အခါ ဒါမှမဟုတ် မေးခွန်းတွေ ရှိတဲ့အခါ comments သုံးဖို့ အားပေးပါ။ ဒါက users တွေနဲ့ ဆက်ဆံရေး ကောင်းမွန်စေပြီး သူတို့ရဲ့ errors တွေကို မြန်မြန် ဖြေရှင်းပေးနိုင်ဖို့ ကူညီပါတယ်။ ဥပမာ — ကိုယ့် users တွေက `400` response တစ်ခု ရပြီး ဘာကြောင့်လဲ သိချင်တာ ဒါမှမဟုတ် API key တစ်ခုကို ဘယ်လို ထည့်ရမလဲ ဆိုတာမျိုး မေးချင်နိုင်ပါတယ်။

APIs တွေကို document လုပ်ဖို့တော့ comments တွေကို မသုံးပါနဲ့။ Postman က collection အတွက် [documentation](https://learning.postman.com/docs/publishing-your-api/api-documentation-overview/) တွေကို အလိုအလျောက် generate လုပ်ပါတယ်။ ကြည့်ချင်ရင် — sidebar ထဲက collection ကို ရွေးပြီး workbench ထဲမှာ **View complete documentation** ကို ရွေးပါ။ ကိုယ့် documentation ကို users တွေအတွက် ပိုကောင်းအောင် edit လုပ်ပြီး တိုးတက်အောင် တည်ဆောက်နိုင်ပါတယ်။

## Global comments

Postman မှာ collection, folder, request, example, manual collection run ဒါမှမဟုတ် pull request တစ်ခုပေါ်မှာ global comments တွေ ထည့်နိုင်ပါတယ်။

Collection တစ်ခုကို comment လုပ်ဖို့ — အဲဒီ collection ကို access ရှိရပါမယ်။

Collection တစ်ခုကို comment ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Collections** ကို ချဲ့ပြီး comment လုပ်ချင်တဲ့ collection, folder, request, example, manual collection run ဒါမှမဟုတ် pull request ကို နှိပ်ပါ။

2. ညာဘက် sidebar ထဲက ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/action-comments-stroke.svg#icon) **Comments** ကို နှိပ်ပြီး ကိုယ့် comment ကို ရိုက်ထည့်ပါ။

   Postman က comments တွေထဲမှာ Markdown ကို support လုပ်ပါတယ်။ Formatting tips တွေအတွက် — [GitHub ပေါ်က Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) ကို ကြည့်ပါ။

3. Comment ထည့်ဖို့ **Comment** ကို ရွေးပါ။

### Comments တွေကို format လုပ်ခြင်း

Comments တွေက ([inline comments](#inline-comments) အပါအဝင်) — [Postman editor](https://learning.postman.com/docs/publishing-your-api/authoring-your-documentation/#write-descriptions-in-the-postman-editor) မှာ ရနိုင်တဲ့ formatting features တွေအတိုင်း support လုပ်ပါတယ်။ Text format လုပ်ဖို့ အသုံးများတဲ့ keyboard shortcuts တွေ သုံးနိုင်ပါတယ် — ဥပမာ **⌘+B** ဒါမှမဟုတ် **Ctrl+B** နဲ့ bold လုပ်ခြင်း၊ word processor တစ်ခု ဒါမှမဟုတ် တခြား source တစ်ခုကနေ formatted text နဲ့ tables တွေ paste လုပ်ခြင်းတွေပါ။ Comment ထဲကို image တစ်ခု drag လုပ်တာ paste လုပ်တာလည်း လုပ်နိုင်သလို — links တွေ ထည့်ခြင်း၊ တည်းဖြတ်ခြင်းလည်း လုပ်နိုင်ပါတယ်။

Postman က comments တွေထဲမှာ [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) ကို support လုပ်ပါတယ်။ ဥပမာ — heading အသစ်တစ်ခု စဖို့ `#` ပြီးနောက် space တစ်ခု ရိုက်ထည့်ပါ — ဒါမှမဟုတ် horizontal line တစ်ခု ထည့်ဖို့ `---` ကို ရိုက်ထည့်ပါ။ Lists နဲ့ tables တွေ အပါအဝင် — ရှိပြီးသား Markdown code တွေကို copy လုပ်ပြီး editor ထဲ paste လုပ်ရင်လည်း ချက်ချင်း format ဖြစ်သွားပါတယ်။

Content formatting အကြောင်း ပိုလေ့လာချင်ရင် — [Postman editor ထဲမှာ descriptions တွေ ရေးခြင်း](https://learning.postman.com/docs/publishing-your-api/authoring-your-documentation/#write-descriptions-in-the-postman-editor) ကို ကြည့်ပါ။

## Inline comments

Request, example ဒါမှမဟုတ် script တစ်ခုရဲ့ သီးခြား အစိတ်အပိုင်းတစ်ခုကို comment လုပ်ဖို့ inline comments တွေကို သုံးပါ။ Parameters, headers, request bodies နဲ့ scripts တွေထဲက code line တွေပေါ်မှာ comments တွေ ထည့်နိုင်ပါတယ်။

### Request ဒါမှမဟုတ် example တစ်ခုရဲ့ အစိတ်အပိုင်းကို comment လုပ်ခြင်း

Request ဒါမှမဟုတ် example တစ်ခုကို inline comment ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request ဒါမှမဟုတ် example ကို ဖွင့်ပါ။

2. Comment လုပ်ချင်တဲ့ request ဒါမှမဟုတ် example ရဲ့ အစိတ်အပိုင်းကို ရွေးပါ။ Query parameter, path parameter, header နဲ့ request body (**form-data**, **x-www-form-urlencoded**, **raw**) ထဲက text တစ်ခုခုကို ရွေးနိုင်ပါတယ်။

3. ရွေးထားတဲ့နေရာပေါ်မှာ right-click လုပ်ပြီး **Comment** ကို ရွေးပါ။

   ![Adding an inline comment](https://assets.postman.com/postman-docs/v11/commenting-inline-v11-44.jpg)

4. ကိုယ့် comment ကို ရိုက်ထည့်ပါ။

5. Comment ထည့်ဖို့ **Comment** ကို ရွေးပါ။

### Script တစ်ခုကို comment လုပ်ခြင်း

Script တစ်ခုကို inline comment ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. [Pre-request](/docs/postman/pre-request-scripts) ဒါမှမဟုတ် [post-response](/docs/postman/testing) script တစ်ခုကို ဖွင့်ပါ။
2. Script ထဲက code line တစ်ကြောင်းကို ရွေးပါ။ Code line ရဲ့ ဘေးမှာ comments icon ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/action-comments-stroke.svg#icon) ပေါ်လာပါတယ်။
3. Comments icon ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/action-comments-stroke.svg#icon) ကို ရွေးပါ။
4. ကိုယ့် comment ကို ရိုက်ထည့်ပြီး **Comment** ကို ရွေးပါ။ Comment ရှိတဲ့ line တစ်ကြောင်းချင်းစီရဲ့ ဘေးမှာ comments icon ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/action-comments-stroke.svg#icon) ကျန်နေပါမယ်။

### Pull request တစ်ခုကို comment လုပ်ခြင်း

Pull request တစ်ခုကို inline comment ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Pull request ကို ဖွင့်ပါ။
2. Change တစ်ခုရဲ့ ဘေးက comments icon ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/action-comments-stroke.svg#icon) ကို နှိပ်ပြီး ကိုယ့် comment ကို ရိုက်ထည့်ပါ။
3. Comment ထည့်ဖို့ **Comment** ကို နှိပ်ပါ။

   ![Add an inline comment to a pull review](https://assets.postman.com/postman-docs/v11/pr-add-comment-inline-v11.64.png)

Postman မှာ collections တွေ fork လုပ်ခြင်းနဲ့ version control သုံးခြင်းအကြောင်း ပိုလေ့လာချင်ရင် — [Postman elements တွေအတွက် version control](https://learning.postman.com/docs/collaborating-in-postman/using-version-control/version-control-overview/) ကို ကြည့်ပါ။

## Comment တစ်ခုရဲ့ link ကို share လုပ်ခြင်း

တခြားသူတွေနဲ့ share လို့ရတဲ့ comment link တစ်ခုကို ရယူနိုင်ပါတယ်။ Comment တစ်ခုကို edit ဒါမှမဟုတ် delete လုပ်လို့လည်း ရပါတယ်။

1. Collection, folder, request, example ဒါမှမဟုတ် pull request တစ်ခုကို ရွေးပြီး — ညာဘက် sidebar ထဲက ![Comments icon](https://assets.postman.com/postman-docs/aether-icons/action-comments-stroke.svg#icon) **Comments** ကို နှိပ်ပါ။ ဒါမှမဟုတ် [inline comment](#inline-comments) တစ်ခုကို ရွေးပါ။
2. Comment ဆီ တည့်တည့် သွားတဲ့ link တစ်ခုကို clipboard ထဲ copy လုပ်ဖို့ ![Link icon](https://assets.postman.com/postman-docs/aether-icons/action-link-stroke.svg#icon) **Copy link** ကို နှိပ်ပါ။

   ![Copy a comment](https://assets.postman.com/postman-docs/v12/comment-copy-v12.png)

[Workspace Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#workspace-roles) တစ်ယောက်ဆိုရင် — contributors တွေရဲ့ comments တွေကို delete လုပ်နိုင်ပေမယ့် edit လုပ်တော့ မလုပ်နိုင်ပါဘူး။

## Comments တွေကို ပြန်လည် ဖြေကြားခြင်း

ဆွေးနွေးမှု ဆက်သွားစေဖို့ comment တစ်ခုကို reply လုပ်နိုင်သလို react လုပ်လည်း ရပါတယ်။ Replies တွေက မူရင်း comment နဲ့အတူ အုပ်စုဖွဲ့ပြထားတာမို့ — collection, folder, request, example ဒါမှမဟုတ် pull request တစ်ခုပေါ်မှာ comment thread တစ်ခုထက်ပိုပြီး ရှိနိုင်ပါတယ်။ Comment တစ်ခုကို reply လုပ်တဲ့အခါ — comment ကို ထည့်ခဲ့တဲ့သူဆီ ကိုယ့် reply အကြောင်း notification ရောက်ပါတယ်။ Comment ကို ဖြေရှင်းပြီးသွားရင် resolve လုပ်နိုင်ပြီး — နောက်တစ်ခါ ပြန်ဖွင့် (reopen) လုပ်လို့လည်း ရပါတယ်။

Reply လုပ်ဖို့ comment တစ်ခုကို နှိပ်ပါ ဒါမှမဟုတ် **Add Reaction** ကို နှိပ်ပါ။

Request ဒါမှမဟုတ် example တစ်ခုပေါ်က inline comment တစ်ခုကို reply လုပ်နေရင် — request ဒါမှမဟုတ် example ထဲက highlight လုပ်ထားတဲ့ အစိတ်အပိုင်းကိုလည်း နှိပ်လို့ရပါတယ်။

![Reply to an inline comment on a request or example](https://assets.postman.com/postman-docs/v12/request-reply-to-inline-comment-v12.png)

Pull request တစ်ခုထဲက change တစ်ခုပေါ်က comment တစ်ခုကို reply လုပ်နေရင် — change ရဲ့ ဘေးက notification comments icon ![Comments notification icon](https://assets.postman.com/postman-docs/v10/icon-comments-notification-v10.jpg#icon) ကိုလည်း နှိပ်နိုင်ပါတယ်။

![Reply to an inline comment on a pull review](https://assets.postman.com/postman-docs/v11/pr-reply-to-inline-comment-v11.64b.png)

Comment နဲ့ ဆက်စပ်နေတဲ့ replies တွေကို ပိတ်ဖို့ ![Success icon](https://assets.postman.com/postman-docs/aether-icons/state-success-stroke.svg#icon) **Resolve comment** ကို နှိပ်ပါ။

Comment တစ်ခုကို ပြန်ဖွင့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Comments pane ထဲက filter icon ![Filter icon](https://assets.postman.com/postman-docs/aether-icons/action-filter-stroke.svg#icon) ကို နှိပ်ပြီး **Show resolved comments** ကို ရွေးပါ။

2. Comment ဘေးက **Reopen** ကို နှိပ်ပါ။
