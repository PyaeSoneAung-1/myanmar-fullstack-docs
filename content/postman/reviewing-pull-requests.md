---
title: "Postman မှာ pull requests တွေကို ပြန်သုံးသပ်ခြင်း (Review Pull Requests in Postman)"
description: "Pull request တစ်ခုပေါ်မှာ reviewer တစ်ယောက်အနေနဲ့ ဘာတွေ လုပ်နိုင်လဲ — changes တွေ ကြည့်ခြင်း, diff ကြည့်ခြင်း, comment, approve, decline, updates ဆွဲယူခြင်း, merge လုပ်ခြင်း နဲ့ conflicts ဖြေရှင်းခြင်း"
order: 52
source: "https://learning.postman.com/docs/collaborating-in-postman/using-version-control/reviewing-pull-requests/"
status: translated
updated: 2026-09-02
---

Pull request တစ်ခုပေါ်မှာ reviewer အဖြစ် tag လုပ်ခံထားရရင် — အပြောင်းအလဲတွေကို ကြည့်နိုင်, comment လုပ်နိုင်, request ကို approve ဒါမှမဟုတ် decline လုပ်နိုင် ပြီး — fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် environment ကို parent element ထဲကို merge လုပ်နိုင်ပါတယ်။

## Pull requests တွေကို ပြန်သုံးသပ်ခြင်း

Pull requests စာရင်းကို ဝင်ရောက်ဖို့ — collection ဒါမှမဟုတ် environment ဆီ သွားပြီး ညာဘက် sidebar ထဲမှာ ![Merge icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-merge-stroke.svg#icon) **Pull Requests** ကို နှိပ်ပါ။ Item တစ်ခုချင်းစီက pull request ရဲ့ status ကို ပြပါတယ် — merge ဖြစ်တာ ဒါမှမဟုတ် decline ဖြစ်တာ မရှိသေးတဲ့ ဘယ်ဟာမဆို **OPEN** ဖြစ်နေပါတယ်။ Pull request တစ်ခုကို ဖွင့်ဖို့ သူ့ရဲ့ နာမည်ကို နှိပ်ပါ။

![Pull request list](https://assets.postman.com/postman-docs/v10/open-pull-request-list-v10.jpg)

Pull request တစ်ခုပေါ်မှာ reviewer အဖြစ် tag လုပ်ခံထားရရင် — team member တစ်ယောက်က pull request တစ်ခု ဖန်တီးတဲ့အခါ Postman က ကိုယ့်ဆီကို အသိပေးပါတယ်:

* Postman ရဲ့ header ထဲမှာ ![Notification icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-notification-stroke.svg#icon) **Notifications** ကို နှိပ်ပြီး notification ကို ကြည့်ပါ။ Pull request ကို ကြည့်ဖို့ **View Pull Request** ကို နှိပ်ပါ။
* Pull request ရဲ့ title, pull request ထဲမှာ ပါဝင်တဲ့ element နဲ့ pull request ကို ဖန်တီးခဲ့သူအကြောင်း အချက်အလက်တွေပါတဲ့ email တစ်စောင်ကိုလည်း ရရှိပါလိမ့်မယ်။ Postman ထဲမှာ pull request ကို ဝင်ရောက်ဖို့ email ထဲက **Review Changes** ကို နှိပ်ပါ။

ကိုယ့်ကိုယ်တိုင် pull request တစ်ခု ဖန်တီးပြီး — Postman account တစ်ခုတည်းကနေပဲ အဲဒီ pull request ကို အပြောင်းအလဲတွေ လုပ်နေရင် — pull request ထဲကို လုပ်တဲ့ အပြောင်းအလဲတွေအကြောင်း notifications တွေ ကိုယ့်ဆီ ရောက်လာမှာ မဟုတ်ပါဘူး။

## Diff ကို ကြည့်ခြင်း

Pull request တစ်ခုကို ပြန်သုံးသပ်တဲ့အခါ — pull request က parent element ထဲကို ယူဆောင်လာမယ့် အပြောင်းအလဲတွေကို နားလည်ဖို့ အရေးကြီးပါတယ်။

Pull request ထဲမှာ — **Changes** ခေါင်းစဉ်အောက်မှာ fork နဲ့ parent element ကြားက ကွာခြားချက် (*diff*) ကို ကြည့်ပါ။

![View diff when reviewing pull request](https://assets.postman.com/postman-docs/v11/pull-request-review-view-diff-v11.jpg)

Diff က အပြောင်းအလဲတစ်ခုက ပေါင်းထည့်ခြင်း (addition), ဖျက်ခြင်း (deletion) ဒါမှမဟုတ် ပြုပြင်ခြင်း (modification) လားဆိုတာကို ပြောပြပါတယ်။

ဒါ့အပြင် pull request ရဲ့ ညာဘက် အောက်ခြေမှာရှိတဲ့ ![Menu icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-menu-stroke.svg#icon) **Jump to** ကို နှိပ်ပြီး — အပြောင်းအလဲတွေ ပါဝင်တဲ့ section ဆီကို တိုက်ရိုက် သွားနိုင်ပါတယ်။ အပြောင်းအလဲစာရင်း တစ်ခုလုံးကို တစ်ခါတည်း ကြည့်လို့ မလွယ်လောက်အောင် ရှည်နေတဲ့အခါ — **Jump to** option က ရနိုင်ပါတယ်။

Pull request တစ်ခုထဲက အပြောင်းအလဲတစ်ခုပေါ်မှာ comment လုပ်ဖို့ inline comments တွေကို သုံးပါ။

[Commenting အကြောင်း](/docs/postman/comments) ပိုလေ့လာနိုင်ပါတယ်။

## Pull request တစ်ခုကို တည်းဖြတ်ခြင်း ဒါမှမဟုတ် decline လုပ်ခြင်း

Pull request တစ်ခုကို approve မလုပ်ခင် — သူ့ရဲ့ details တွေကို တည်းဖြတ်နိုင်သလို — ဒါမှမဟုတ် decline လုပ်နိုင်ပါတယ်။

![Refresh, edit, or decline a pull request](https://assets.postman.com/postman-docs/v11/refresh-edit-decline-pull-request-v11.jpg)

Pull request details တွေကို တည်းဖြတ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ညာဘက် အပေါ်မှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို ရွေးပြီး **Edit** ကို ရွေးပါ။
2. Pull request ရဲ့ title, description နဲ့ reviewers စာရင်းထဲမှာ လိုသလို အပြောင်းအလဲတွေ လုပ်ပါ။
3. **Save Changes** ကို ရွေးပါ။

Pull request ကို parent element ထဲကို merge မလုပ်ချင်ဘူးဆိုရင် — decline လုပ်နိုင်ပါတယ်။ Decline လုပ်ပြီးသား pull request တစ်ခုကို ပြန်ဖွင့်လို့ မရပါဘူး — ဒါကြောင့် edits တွေ တောင်းချင်တာ ဒါမှမဟုတ် feedback ပေးချင်တာဆိုရင် — [comment တစ်ခု ထည့်တာ](/docs/postman/comments) ကို သုံးပါ။

Pull request ကို decline လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ညာဘက် အပေါ်မှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို ရွေးပြီး **Decline** ကို ရွေးပါ။
2. **Decline Pull Request** ကို ရွေးပါ။

## Pull request တစ်ခုကို approve လုပ်ခြင်း

Pull request တစ်ခုပေါ်မှာ reviewer အဖြစ် tag လုပ်ခံထားရရင် — pull request ကို approve လုပ်နိုင်ပါတယ်။

Pull request တစ်ခုကို approve လုပ်ဖို့ — **Approve** ကို ရွေးပါ။

ကိုယ့် approval ကို ပြန်ရုတ်သိမ်းချင်ရင် — **Unapprove** ကို ရွေးပါ။

![Approve a pull request](https://assets.postman.com/postman-docs/v11/pull-request-approve-v11.jpg)

Pull request ကို approve လုပ်ပြီးတဲ့နောက် — pull requests စာရင်းထဲမှာ သူ့ရဲ့ status က **APPROVED** ဖြစ်သွားပါတယ်။

![Approved pull request](https://assets.postman.com/postman-docs/v10/pull-request-list-approved-v10.jpg)

## Pull request အတွင်း updates တွေ ဆွဲယူခြင်း

Parent element ထဲကို တခြား team member တစ်ယောက်က အပြောင်းအလဲတွေ merge လုပ်လိုက်တာမျိုးလို — parent element ရဲ့ ဘယ်အပြောင်းအလဲနဲ့မဆို ကိုယ့် forked elements တွေကို အပ်ဒိတ် ဖြစ်နေအောင် ထားနိုင်ပါတယ်။

1. [Pull request ကို ဖန်တီးပါ။](/docs/postman/creating-pull-requests) ကိုယ် နောက်ဆုံး update လုပ်ပြီးကတည်းက parent element ပြောင်းလဲသွားပြီဆိုတာ Postman က ကိုယ့်ကို သတိပေးပါတယ်။

2. Parent element ထဲက အပြောင်းအလဲတွေနဲ့ ကိုယ့် fork ကို update လုပ်ဖို့ **Pull Changes** ကို ရွေးပါ။

   ![Pull recent changes](https://assets.postman.com/postman-docs/v11/pr-pull-changes-v11.jpg)

3. Diff ကို ပြန်သုံးသပ်ပြီး **Pull changes** ကို ရွေးပါ။

   ![Pull changes into fork](https://assets.postman.com/postman-docs/v11/pull-changes-v11.jpg)

Pull request တစ်ခု ဖွင့်စရာ မလိုဘဲ parent element တစ်ခုကနေ updates တွေ ဆွဲယူဖို့ — [Parent element တစ်ခုကနေ updates တွေ ဆွဲယူခြင်း](/docs/postman/forking-elements) ကို ကြည့်ပါ။

## Pull request တစ်ခုကနေ အပြောင်းအလဲတွေ merge လုပ်ခြင်း

Pull request တစ်ခုထဲက အပြောင်းအလဲတွေကို ထည့်သွင်းဖို့ အဆင်သင့် ဖြစ်တဲ့အခါ — သူတို့ကို parent element ထဲကို *merge* လုပ်ပါလိမ့်မယ်။ တောင်းဆိုထားတဲ့ reviewer က pull request တစ်ခုကို approve လုပ်ပြီးတဲ့နောက် — သူ့ကို parent element ထဲကို merge လုပ်နိုင်ပါတယ်။

1. Approve လုပ်ပြီးသား pull request ကနေ — **Merge** ကို ရွေးပါ။

   Parent element ထဲမှာ ကိုယ် fork ကို နောက်ဆုံး update လုပ်ပြီးကတည်းက အပြောင်းအလဲတွေ ရှိနေရင် — merge မလုပ်ခင် အဲဒီ [အပြောင်းအလဲတွေကို ဆွဲယူနိုင်ပါတယ်](/docs/postman/forking-elements)။

2. အောက်ပါ merge options တွေထဲက တစ်ခုကို ရွေးပါ:

   * **Merge changes** — အပြောင်းအလဲတွေကို parent element ထဲကို merge လုပ်ပါတယ်။ Fork ကိုတော့ ဘာမှ မပြောင်းပါဘူး။ Parent element ပေါ်မှာ Editor access ရှိရပါမယ်။
   * **Merge changes and update source** — အပြောင်းအလဲတွေကို parent element ထဲကို merge လုပ်ပါတယ်။ Parent element ထဲက ကွာခြားချက်တွေကို fork ထဲမှာလည်း ထည့်ပေးပါတယ်။ Parent ရော forked elements ရော နှစ်ခုလုံးပေါ်မှာ Editor access ရှိရပါမယ်။
   * **Merge changes and delete source** — အပြောင်းအလဲတွေကို parent element ထဲကို merge လုပ်ပါတယ်။ Merge process ပြီးသွားတဲ့အခါ — Postman က fork ကို ဖျက်ပစ်ပါတယ်။ Parent ရော forked elements ရော နှစ်ခုလုံးပေါ်မှာ Editor access ရှိရပါမယ်။

   ![Merge Fork Options](https://assets.postman.com/postman-docs/merge-fork-options-v9.12.jpg)

3. **Merge** ကို နှိပ်ပါ။

Pull request တစ်ခု ဖွင့်စရာ မလိုဘဲ fork တစ်ခုကနေ အပြောင်းအလဲတွေ merge လုပ်ဖို့ — [Fork တစ်ခုကနေ အပြောင်းအလဲတွေ merge လုပ်ခြင်း](/docs/postman/forking-elements) ကို ကြည့်ပါ။

## Pull request တစ်ခုကနေ conflicts တွေ ဖြေရှင်းခြင်း

Update လုပ်ပြီးသား parent element တစ်ခုထဲကို အပြောင်းအလဲတွေ merge လုပ်ဖို့ ကြိုးစားတဲ့အခါ — Postman က နှစ်ခုကြားက ကွာခြားချက်တွေကို အလိုအလျောက် ဖြေရှင်းနိုင်စွမ်း မရှိရင် merge conflict တစ်ခု ဖြစ်ပေါ်ပါတယ်။ Pull request တစ်ခုကို merge လုပ်ဖို့ ကြိုးစားတဲ့အခါ conflict တစ်ခု ရှိနေရင် — ဆက်မလုပ်ခင် အဲဒါတွေကို ဘယ်လို ဖြေရှင်းချင်လဲ ဆုံးဖြတ်ဖို့ လိုပါတယ်။

Merge conflicts တွေမှာ workspace တစ်ခုထက်မက ပါဝင်တဲ့ အပြောင်းအလဲတွေ ပါနိုင်ပါတယ်။

Pull request တစ်ခုကနေ merge conflict တစ်ခုကို ဖြေရှင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. [Pull requests တွေ ဖန်တီးခြင်း](/docs/postman/creating-pull-requests) မှာ ဖော်ပြထားတဲ့ pull request process ကို စတင်ပါ။

2. Merge conflict ထဲက အပြောင်းအလဲတွေကို ပြန်သုံးသပ်ဖို့ **Changes** ကို ရွေးပါ။

3. Fork နဲ့ parent element ကြားက merge conflicts တွေကို ဖြေရှင်းဖို့ **Resolve Conflicts** ကို ရွေးပါ။

   Conflict တစ်ခုခုအတွက် **Pull the changes** ကိုလည်း ရွေးနိုင်ပါတယ်။

   ![Resolve conflicts](https://assets.postman.com/postman-docs/v10/resolve-conflicts-v10-2.jpg)

4. Conflict တစ်ခုချင်းစီအတွက် — merge လုပ်တဲ့အခါ ထည့်သွင်းချင်တဲ့ version ကို ရွေးပါ။ အပြောင်းအလဲကို parent element ပေါ်မှာ ထားဖို့ **Keep Source** ကို ရွေးပါ။ အပြောင်းအလဲကို ကိုယ့် fork ပေါ်မှာ ထားဖို့ **Keep Destination** ကို ရွေးပါ။ Conflict တစ်ခုချင်းစီအတွက် ထားချင်တဲ့ version ကိုလည်း ရွေးနိုင်ပါတယ်။

   ![Pull Changes](https://assets.postman.com/postman-docs/v10/conflicts-keep-source-or-destination-v10-2.jpg)

အပြောင်းအလဲအားလုံးကို ကိုယ့် fork ပေါ်မှာ ထားဖို့ — **Keep all changes to source** ကို ရွေးပါ။ အပြောင်းအလဲအားလုံးကို parent element ပေါ်မှာ ထားဖို့ — **Keep all changes to destination** ကို ရွေးပါ။

Conflicts တွေကို ဖြေရှင်းပြီးတဲ့နောက် — [updates တွေကို ဆွဲယူဖို့](#pull-request-အတွင်း-updates-တွေ-ဆွဲယူခြင်း) **Pull changes** ကို ရွေးပါ။
