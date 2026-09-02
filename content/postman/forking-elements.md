---
title: "Postman မှာ elements တွေကို fork လုပ်ခြင်း (Fork Elements in Postman)"
description: "Postman elements တွေကို ဘယ်လို fork လုပ်မလဲ — fork ဆိုတာ ဘာလဲ, fork ဖန်တီးနည်း, fork info ကြည့်ခြင်း, parent element ကနေ updates ဆွဲယူခြင်း, fork က merge လုပ်ခြင်း နဲ့ conflicts ဖြေရှင်းခြင်း"
order: 50
source: "https://learning.postman.com/docs/collaborating-in-postman/using-version-control/forking-elements/"
status: translated
updated: 2026-09-02
---

*Fork* ဆိုတာ element တစ်ခုရဲ့ instance အသစ်တစ်ခုပါ။ Fork တစ်ခုကို ပြောင်းလဲလိုက်တဲ့အခါ — သူ့ရဲ့ parent element ကတော့ မပြောင်းလဲဘဲ ရှိနေပါတယ်။ Postman မှာ collections, environments နဲ့ specifications တွေကို fork လုပ်နိုင်ပါတယ်။ Forking က အဲဒီ element အတွက် [Editor access](https://learning.postman.com/docs/administration/roles-and-permissions/#element-based-roles) မရှိဘဲ — element တစ်ခုထဲကို ပါဝင်ပံ့ပိုးနိုင်စေပါတယ်။

## Fork တစ်ခု ဖန်တီးခြင်း

Element တစ်ခုကို fork လုပ်တဲ့အခါ — အခြား workspace တစ်ခုထဲမှာ သူ့ရဲ့ copy တစ်ခုကို ဖန်တီးလိုက်တာပါ။ Fork တစ်ခု ဖန်တီးဖို့ Postman ထဲကို sign in လုပ်ထားရပါမယ်။ Public workspace တစ်ခုထဲမှာ element တစ်ခုကို fork လုပ်ဖို့ — ကိုယ့် profile ကို [public ဖြစ်အောင် လုပ်ထားရပါမယ်](https://learning.postman.com/docs/getting-started/installation/postman-profile#make-your-profile-public)။

Element တစ်ခုကို fork လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ element ကို ရွေးပါ။
2. Sidebar ထဲမှာ element ပေါ်မှာ hover လုပ်ပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Fork** ကို ရွေးပါ။ ဒါမှမဟုတ် — ညာဘက် အပေါ်ထောင့်မှာရှိတဲ့ ![Fork icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-fork-stroke.svg#icon) **Fork** ကို နှိပ်ပါ (collections နဲ့ environments တွေအတွက်ပဲ)။
3. ကိုယ့် fork အတွက် label တစ်ခု ရိုက်ထည့်ပြီး — သိမ်းမယ့် workspace တစ်ခုကို ရွေးပါ။
4. (Optional) Collection တစ်ခုကို fork လုပ်နေရင် — fork နဲ့အတူ ထည့်သွင်းစေချင်တဲ့ environments တွေကို ရွေးနိုင်ပါတယ်။
5. **Fork Collection**, **Fork Environment** ဒါမှမဟုတ် **Fork Specification** ကို နှိပ်ပါ။ Postman က ရွေးထားတဲ့ workspace ထဲမှာ ကိုယ့် fork ကို ဖန်တီးပေးပါတယ်။

Parent element နဲ့ ဆက်စပ်နေတဲ့ [mocks](https://learning.postman.com/docs/design-apis/mock-apis/overview) တွေ ဒါမှမဟုတ် [monitors](/docs/postman/intro-monitors) တွေ ရှိနေရင် — ဒါတွေက fork လုပ်ထားတဲ့ element နဲ့ ချိတ်ဆက်မထားပါဘူး။ လိုအပ်ရင် fork အတွက် သီးသန့် mocks တွေရော monitors တွေရော ဖန်တီးရပါမယ်။

## Fork တစ်ခုရဲ့ label ကို တည်းဖြတ်ခြင်း

Fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် environment ရဲ့ label ကို ပြောင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် environment ကို ရွေးပါ။
2. Workbench ထဲမှာ — fork ရဲ့ label ကို နှိပ်ပြီး တည်းဖြတ်ပါ။
3. ကိုယ့် အပြောင်းအလဲတွေကို သိမ်းဖို့ label ရဲ့ အပြင်ဘက် ဘယ်နေရာမှာမဆို နှိပ်ပါ။

## Fork information တွေကို ကြည့်ခြင်း

Sidebar ထဲမှာ fork လုပ်ထားတဲ့ element တစ်ခုရဲ့ label ပေါ်မှာ hover လုပ်တဲ့အခါ — fork အကြောင်း အချက်အလက်တွေကို ကြည့်နိုင်ပါတယ်။ Fork ရဲ့ မူရင်း (source), ဘယ်သူ ဖန်တီးခဲ့လဲ, ဘယ်အချိန်မှာ ဖန်တီးခဲ့လဲဆိုတာတွေ အပါအဝင် အချက်အလက်တွေ ပါဝင်ပါတယ်။ Source element ရဲ့ နာမည်ကို နှိပ်ပြီး ဖွင့်နိုင်ပါတယ်။ Fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် specification တစ်ခုကို collaborators တွေနဲ့ မျှဝေဖို့ — ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-link-stroke.svg#icon) **Copy URL** ကို နှိပ်ပါ။

Collections နဲ့ environments တွေအတွက် — forks တွေအကြောင်းရော သူတို့ကို ဖန်တီးထားတဲ့ users တွေအကြောင်းရော အသေးစိတ်တွေကိုလည်း ကြည့်နိုင်ပါတယ်။ ဒါက ကိုယ့် APIs တွေကို တက်တက်ကြွကြွ သုံးစွဲနေပြီး ပံ့ပိုးနေတဲ့ users တွေကို ခွဲခြားသိရှိနိုင်စေပါတယ်။

Collections ဒါမှမဟုတ် environments တွေအတွက် forks အားလုံးကို ကြည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ fork လုပ်ထားတဲ့ collection ဒါမှမဟုတ် environment ကို ရွေးပါ။
2. ညာဘက် sidebar ထဲမှာ ![Fork icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-fork-stroke.svg#icon) **Forks** ကို နှိပ်ပါ။ ဒါ့အပြင် workbench ရဲ့ ညာဘက် အပေါ်ထောင့်မှာရှိတဲ့ fork icon ![Fork icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-fork-stroke.svg#icon) ဘေးက ဂဏန်းကိုလည်း နှိပ်နိုင်ပါတယ်။

## Parent element ကနေ updates တွေ ဆွဲယူခြင်း

[Pull request process](/docs/postman/creating-pull-requests) ကို ဖြတ်စရာ မလိုဘဲ — parent element တစ်ခုကနေ fork ထဲကို updates တွေ ဆွဲယူနိုင်ပါတယ်။ Non-HTTP request အနည်းဆုံး တစ်ခု ပါဝင်တဲ့ fork လုပ်ထားတဲ့ collections တွေက — updates ဆွဲယူခြင်း, အပြောင်းအလဲတွေ merge လုပ်ခြင်း ဒါမှမဟုတ် conflicts တွေ ဖြေရှင်းခြင်းတွေကို ပံ့ပိုးမပေးပါဘူး။

1. Sidebar ထဲမှာ — fork လုပ်ထားတဲ့ element ရဲ့ ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Pull changes** ကို ရွေးပါ။
2. Diff ကို ပြန်သုံးသပ်ပြီး workbench ရဲ့ ညာဘက် အပေါ်ထောင့်မှာ **Pull Changes** ကို နှိပ်ပါ။

Pull request process အတွင်းမှာ parent collection ဒါမှမဟုတ် environment ကနေ updates တွေ ဆွဲယူဖို့ဆိုရင် — [Pull request အတွင်း updates တွေ ဆွဲယူခြင်း](/docs/postman/reviewing-pull-requests) ကို ကြည့်ပါ။

Specifications တွေက fast-forward merging ကို သုံးပြီး — updates တွေ ဆွဲယူတဲ့အခါ fork ထဲက အပြောင်းအလဲတွေကို parent element ကနေ လာတဲ့ အပြောင်းအလဲတွေနဲ့ အစားထိုးပါတယ်။

## Fork တစ်ခုကနေ အပြောင်းအလဲတွေ merge လုပ်ခြင်း

Element ပေါ်မှာ Editor access ရှိနေရင် — [pull request process](/docs/postman/creating-pull-requests) ကို ဖြတ်စရာ မလိုဘဲ fork တစ်ခုကို parent element ထဲကို merge လုပ်နိုင်ပါတယ်။ ဥပမာ — ကိုယ့် workspace ထဲက အလုပ်တွေကို စုစည်းဖို့ forks တွေကို သုံးနေရင် — fork တစ်ခုထဲက အပြောင်းအလဲတွေကို parent element ထဲကို တိုက်ရိုက် merge လုပ်နိုင်ပါတယ်။ တခြားသူတွေနဲ့ ပူးပေါင်းလုပ်နေရင်တော့ — တိုက်ရိုက် merge လုပ်တာက pull request process ထဲမှာ တည်ဆောက်ထားတဲ့ အကာအကွယ်တွေ (safeguards) မပါတာ သတိပြုပါ။ Team အများစုက သူတို့ရဲ့ [version control workflow](/docs/postman/creating-pull-requests) ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ pull requests တွေကို လိုအပ်ပါတယ်။

Fork တစ်ခုကနေ အပြောင်းအလဲတွေ merge လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ — fork လုပ်ထားတဲ့ element ရဲ့ ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Merge changes** ကို ရွေးပါ။

2. Diff ကို ပြန်သုံးသပ်ပြီး **Merge All Changes** ကို နှိပ်ပါ။

3. အောက်ပါ merge options တွေထဲက တစ်ခုကို ရွေးပါ:

   * **Merge changes** — အပြောင်းအလဲတွေကို parent element ထဲကို merge လုပ်ပါတယ်။ Fork ကိုတော့ ဘာမှ မပြောင်းပါဘူး။ Parent element ပေါ်မှာ Editor access ရှိရပါမယ်။
   * **Merge changes and update source** — အပြောင်းအလဲတွေကို parent element ထဲကို merge လုပ်ပါတယ်။ Parent element ထဲက ကွာခြားချက်တွေကို fork ထဲမှာလည်း ထည့်ပေးပါတယ်။ Parent ရော forked elements ရော နှစ်ခုလုံးပေါ်မှာ Editor access ရှိရပါမယ်။
   * **Merge changes and delete source** — အပြောင်းအလဲတွေကို parent element ထဲကို merge လုပ်ပါတယ်။ Merge process ပြီးသွားတဲ့အခါ — Postman က fork ကို ဖျက်ပစ်ပါတယ်။ Parent ရော forked elements ရော နှစ်ခုလုံးပေါ်မှာ Editor access ရှိရပါမယ်။

4. **Merge** ကို နှိပ်ပါ။

Pull request process အတွင်းမှာ အပြောင်းအလဲတွေ merge လုပ်ဖို့ဆိုရင် — [Pull request တစ်ခုကနေ အပြောင်းအလဲတွေ merge လုပ်ခြင်း](/docs/postman/reviewing-pull-requests) ကို ကြည့်ပါ။

## Fork တစ်ခုကနေ conflicts တွေ ဖြေရှင်းခြင်း

Update လုပ်ပြီးသား parent element တစ်ခုထဲကို အပြောင်းအလဲတွေ merge လုပ်ဖို့ ကြိုးစားတဲ့အခါ — Postman က နှစ်ခုကြားက ကွာခြားချက်တွေကို အလိုအလျောက် ဖြေရှင်းနိုင်စွမ်း မရှိရင် merge conflict တစ်ခု ဖြစ်ပေါ်ပါတယ်။ Fork တစ်ခုကို merge လုပ်ဖို့ ကြိုးစားတဲ့အခါ conflict တစ်ခု ရှိနေရင် — ဆက်မလုပ်ခင် အဲဒါကို ဘယ်လို ဖြေရှင်းချင်လဲ ဆုံးဖြတ်ဖို့ လိုပါတယ်။

Merge conflicts တွေမှာ workspace တစ်ခုထက်မက ပါဝင်တဲ့ အပြောင်းအလဲတွေ ပါနိုင်ပါတယ်။

Fork တစ်ခုကနေ merge conflict တစ်ခုကို ဖြေရှင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ — fork လုပ်ထားတဲ့ element ရဲ့ ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Merge changes** ကို ရွေးပါ။

2. Merge conflict တစ်ခုရဲ့ ဘေးမှာ — parent element ကနေ ကိုယ့် fork ထဲကို updates တွေ ဆွဲယူဖို့ **Pull the changes** ကို နှိပ်ပါ။

3. Merge လုပ်တဲ့အခါ ထည့်သွင်းချင်တဲ့ အပြောင်းအလဲတွေကို ရွေးပါ:

   * အပြောင်းအလဲကို ကိုယ့် fork ပေါ်မှာ ထားဖို့ **Keep Source** ကို နှိပ်ပါ။ အပြောင်းအလဲအားလုံးကို ကိုယ့် fork ပေါ်မှာ ထားဖို့ **Keep all changes to source** ကိုလည်း နှိပ်နိုင်ပါတယ်။
   * အပြောင်းအလဲကို parent element ပေါ်မှာ ထားဖို့ **Keep Destination** ကို နှိပ်ပါ။ အပြောင်းအလဲအားလုံးကို parent element ပေါ်မှာ ထားဖို့ **Keep all changes to destination** ကိုလည်း နှိပ်နိုင်ပါတယ်။

4. Parent element ကနေ ကိုယ့် fork ထဲကို updates တွေ ဆွဲယူဖို့ **Pull Changes** ကို နှိပ်ပါ။
