---
title: "Fork လုပ်ထားတဲ့ element တစ်ခုထဲကို ပံ့ပိုးဖို့ pull request တစ်ခု ဖန်တီးခြင်း (Create a Pull Request to Contribute to an Element You Forked)"
description: "Postman မှာ pull requests တွေ ဘယ်လို ဖန်တီးမလဲ — fork လုပ်ထားတဲ့ collection/environment ကနေ pull request ဖန်တီးနည်း, reviewer permissions စီမံခြင်း နဲ့ merge checks သတ်မှတ်ခြင်း"
order: 51
source: "https://learning.postman.com/docs/collaborating-in-postman/using-version-control/creating-pull-requests/"
status: translated
updated: 2026-09-02
---

ကိုယ် fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် environment တစ်ခုထဲကို *pull request* တစ်ခုနဲ့ ပံ့ပိုးနိုင်ပါတယ် ([Postman Flows](https://learning.postman.com/flows/overview/) ကတော့ ဒီ feature ကို ပံ့ပိုးမပေးပါဘူး)။ Pull request တစ်ခု ဖန်တီးတဲ့အခါ — ကိုယ် fork လုပ်ထားတဲ့ element ထဲက ကိုယ့်ရဲ့ အပြောင်းအလဲတွေကို တခြားသူတွေ ပြန်သုံးသပ်ပေးဖို့ တောင်းဆိုလိုက်တာပါ။ အဲဒီ reviewers တွေက request ထဲမှာ comments တွေ ထည့်နိုင်ပြီး — ကိုယ် merge မလုပ်ခင် ကိုယ့်ရဲ့ အပြောင်းအလဲတွေကို approve လုပ်နိုင်ပါတယ်။ ဒါက version control ရဲ့ ဥပမာတစ်ခုပါ။

Default အနေနဲ့ — approvals တွေက optional ပါ။ Approvals တွေကို required ဖြစ်အောင်လည်း လုပ်နိုင်ပါတယ်။

## Pull requests တွေ ဖန်တီးခြင်း

Pull requests တွေ ဖန်တီးတာက collections နဲ့ environments တွေအတွက်ပဲ ရနိုင်ပါတယ်။

Fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် environment တစ်ခုထဲမှာ လုပ်ထားတဲ့ အပြောင်းအလဲတွေကို merge လုပ်ဖို့ — pull request တစ်ခု ဖန်တီးနိုင်ပါတယ်။

Reviewers တွေက ကိုယ့် pull request ကို ပြန်သုံးသပ်ဖို့ — source element ကို ဝင်လို့ရနိုင်ရပါမယ်။ Parent element က ကိုယ့် Postman team ထဲမှာ မပါတဲ့ public workspace တစ်ခုထဲမှာ ရှိနေရင် — [source element ကို public workspace တစ်ခုဆီ ရွှေ့ရပါမယ်](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#move-elements-to-workspaces)။ Pull request တစ်ခု ဖန်တီးတဲ့အခါ reviewers တွေက source element ကို ဝင်လို့ မရနိုင်ဘူးဆိုရင် — ကိုယ့်ဆီကို အသိပေးပါလိမ့်မယ်။ အဲဒီ notification ထဲမှာ — source element ကို public workspace တစ်ခုဆီ ရွှေ့ဖို့ **Move** ကို နှိပ်နိုင်ပါတယ်။

Pull request တစ်ခု ဖန်တီးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ element ပေါ်မှာ hover လုပ်ပါ။

2. သူ့နာမည်ရဲ့ ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပါ။

3. **Create pull request** ကို ရွေးပါ။

4. Pull request ထဲက အပြောင်းအလဲတွေကို ပြန်သုံးသပ်ဖို့ **Changes** ကို နှိပ်ပါ။

   ![Pull Request Changes](https://assets.postman.com/postman-docs/v11/pull-request-changes-v11.jpg)

   * Parent element ထဲမှာ ကိုယ် fork ကို နောက်ဆုံး update လုပ်ပြီးကတည်းက အပြောင်းအလဲတွေ ရှိနေရင် — merge မလုပ်ခင် အဲဒီ [အပြောင်းအလဲတွေကို ကိုယ့် fork ထဲကို ဆွဲယူနိုင်ပါတယ်](/docs/postman/reviewing-pull-requests)။

   * Fork နဲ့ parent element ကြားမှာ conflicts တွေ ရှိနေရင် — ကိုယ် [ဖြေရှင်းနိုင်အောင်](/docs/postman/reviewing-pull-requests) Postman က သူတို့ကို မီးမောင်းထိုးပြပေးပါတယ်။

5. **Overview** ကို နှိပ်ပြီး — ကိုယ့် pull request အတွက် title တစ်ခုရော description တစ်ခုရော ရိုက်ထည့်ပါ။

6. Dropdown list ကနေ reviewers အများဆုံး 50 ယောက် ဒါမှမဟုတ် [user groups](https://learning.postman.com/docs/administration/managing-your-team/user-groups/) တွေကို ရွေးပါ။ Reviewers တွေရော user groups တွေရော — ကိုယ့် အပြောင်းအလဲတွေကို merge လုပ်ဖို့ parent element အတွက် [Editor access](https://learning.postman.com/docs/administration/roles-and-permissions/#element-based-roles) ရှိရပါမယ်။

7. **Create Pull Request** ကို နှိပ်ပါ။

   ![Create Pull Request](https://assets.postman.com/postman-docs/v11/pull-request-overview-v11.jpg)

ကိုယ်ရွေးထားတဲ့ [reviewers တွေကို Postman က ကိုယ့် pull request အကြောင်း အသိပေး](/docs/postman/reviewing-pull-requests)ပါတယ်။ Reviewers တွေက pull request ကို [comment လုပ်တဲ့အခါ](/docs/postman/comments), [approve လုပ်တဲ့အခါ](/docs/postman/reviewing-pull-requests) ဒါမှမဟုတ် [merge လုပ်တဲ့အခါ](/docs/postman/reviewing-pull-requests) — ကိုယ့်ဆီကို notification တစ်ခု ရောက်လာပါလိမ့်မယ်။

Reviewer ဒါမှမဟုတ် group တစ်ခုက အပြောင်းအလဲတွေ merge လုပ်ဖို့ — element အတွက် Editor role ရှိရပါမယ်။ Editor access မရှိတဲ့ user ဒါမှမဟုတ် group တစ်ခုကို reviewer အဖြစ် ထည့်လိုက်ရင် — နာမည်ရဲ့ ဘေးမှာ warning icon တစ်ခု ပေါ်လာပါလိမ့်မယ်။ Viewer role ရှိတဲ့ reviewers တွေနဲ့ groups တွေက PRs တွေကို approve လုပ်နိုင်ပေမဲ့ — PRs တွေကို merge လုပ်လို့ မရပါဘူး။

![Reviewer permission](https://assets.postman.com/postman-docs/pull-request-reviewer-permission.jpg)

## Pull request ဆက်တင်များ

Pull request settings တွေကနေ — reviewers တွေအတွက် permissions တွေကို စီမံနိုင်ပြီး merge checks တွေကို သတ်မှတ်နိုင်ပါတယ်။

### Reviewer permissions တွေကို စီမံခြင်း

1. Sidebar ထဲမှာ element ပေါ်မှာ hover လုပ်ပါ။
2. သူ့နာမည်ရဲ့ ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပါ။
3. **Share** ကို ရွေးပါ။
4. (Optional) Element ထဲကို ထည့်ဖို့ — workspace ထဲက team members တွေနဲ့ [user groups](https://learning.postman.com/docs/administration/managing-your-team/user-groups/) တွေရဲ့ နာမည်တွေကို ရိုက်ထည့်ပါ။
5. နာမည်ရဲ့ ဘေးမှာ **Editor** role ကို ရွေးပါ။ ပထမဆုံးအကြိမ် ထည့်နေတာဆိုရင် **Invite** ကို နှိပ်ပါ။ မဟုတ်ရင် role ကို update လုပ်ပါ။ Element ထဲကနေ team member ဒါမှမဟုတ် user group တစ်ခုကို ဖယ်ရှားချင်ရင်လည်း **Remove** ကို နှိပ်နိုင်ပါတယ်။

   ![Manage Roles](https://assets.postman.com/postman-docs/v12/manage-roles-collection-v12-10.png)

### Merge checks တွေ သတ်မှတ်ခြင်း

Collections တွေအတွက် — အပြောင်းအလဲတွေကို approve မလုပ်ခင် merge checks တွေကို သတ်မှတ်နိုင်ပါတယ်။

Pull request တစ်ခုအတွက် သတ်မှတ်လို့ရတဲ့ checks အမျိုးအစား နှစ်မျိုး ရှိပါတယ်:

* **Approved once** — Pull request ကို merge လုပ်ဖို့ approval အနည်းဆုံး တစ်ခု လိုပါတယ်။
* **Approved by a collection editor** — Pull request ကို merge လုပ်ဖို့ — collection အတွက် [Editor access](https://learning.postman.com/docs/administration/roles-and-permissions/#collection-roles) ရှိတဲ့ user တစ်ယောက်ရဲ့ approval လိုပါတယ်။

Collection တစ်ခုသီးသန့်ပေါ်မှာ pull requests တွေအတွက် merge checks တွေ သတ်မှတ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Collection ကို ရွေးပါ။
2. ![Right Sidebar Visible icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-right-sidebar-visible-stroke.svg#icon) **Toggle right sidebar** ကို နှိပ်ပါ။
3. ညာဘက် sidebar ထဲမှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/action-options-stroke.svg#icon) **3 more tabs** ကို နှိပ်ပြီး ![Merge icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-merge-stroke.svg#icon) **Pull Requests** ကို ရွေးပါ။
4. ![Setting icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-setting-stroke.svg#icon) **View merge conditions** ကို နှိပ်ပါ။
5. Collection အတွက် သတ်မှတ်ချင်တဲ့ merge checks တွေကို ရွေးပါ။

   ![Merge Check](https://assets.postman.com/postman-docs/v12/manage-roles-set-merge-checks-v12-10.png)

Pull request တစ်ခုရဲ့ merge conditions တွေ ပြည့်မီမနေရင် — သူ့ကို parent collection ထဲကို **Merge** လုပ်ဖို့ option က အလုပ်မလုပ်ဘဲ ဖြစ်နေပါလိမ့်မယ်။

![Merge option isn't active](https://assets.postman.com/postman-docs/view-merge-conditions-v9.12.jpg)

Pull request ရဲ့ merge conditions တွေအကြောင်း သိချင်ရင် — **View Merge Conditions** ကို နှိပ်ပါ။
