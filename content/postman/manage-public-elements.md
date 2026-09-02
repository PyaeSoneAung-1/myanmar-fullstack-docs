---
title: "Postman မှာ Public Elements များကို စီမံခန့်ခွဲခြင်း (Manage Public Elements in Postman)"
description: "Manage public elements dashboard နဲ့ ကိုယ့် team ရဲ့ public elements တွေကို စီမံခန့်ခွဲနည်း — public workspaces, public documentation, collection access keys နဲ့ collection JSON links"
order: 99
source: "https://learning.postman.com/docs/collaborating-in-postman/manage-public-elements/"
status: translated
updated: 2026-09-02
---

Manage public elements dashboard feature ကို Postman Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်ကို [pricing page](https://www.postman.com/pricing/) မှာ ကြည့်ပါ။

Postman ထဲက *public elements* တွေဆိုတာ — ကိုယ်နဲ့ ကိုယ့် team က အများပြည်သူဆီ မျှဝေထားတဲ့ workspaces, documentation နဲ့ collections တွေ ဖြစ်ပါတယ်။ [Super Admin ဒါမှမဟုတ် Community Manager role](https://learning.postman.com/docs/administration/roles-and-permissions/) ရှိတဲ့ Users တွေက **Manage public elements** dashboard ကို သုံးပြီး — team ပိုင်ဆိုင်တဲ့ elements တွေရဲ့ public visibility (အများမြင်နိုင်မှု) ကို စီမံခန့်ခွဲနိုင်ပါတယ်။

Dashboard ကို သုံးပြီး — public workspaces တွေ ဖန်တီးခြင်း, documentation publish လုပ်ဖို့ requests တွေ နဲ့ ကိုယ့် public workspace ထဲမှာ team members တွေရဲ့ collection access keys ဖန်တီးခြင်းတွေကို စီမံနိုင်ပါတယ်။ နောက်တော့ public အနေနဲ့ မထားချင်တော့တဲ့ collections တွေဆီ links တွေကိုလည်း ဖျက်နိုင်ပါတယ်။

Collection access keys တွေက ကိုယ့် public workspace collections တွေဆီ — secure, read-only access ရရှိစေပါတယ်။

**Manage public elements** dashboard ကို ဝင်ရောက်ဖို့ — Postman header ထဲက ကိုယ့် avatar ကို နှိပ်ပြီး **Public elements** ကို ရွေးပါ။

## Public workspaces တွေ

**Workspaces** tab ထဲမှာ — ကိုယ့် team က ဖန်တီးထားတဲ့ public workspaces အားလုံးကို access လုပ်နိုင်ပါတယ်။ Workspaces တွေကို public ဖြစ်အောင် လုပ်ဖို့ဆိုတဲ့ requests တွေကိုလည်း ကြည့်ရှု, တုံ့ပြန်နိုင်ပါတယ်။

Request တစ်ခုကို တုံ့ပြန်ဖို့ — workspace ပေါ်မှာ mouse ချပြီး **Respond** ဒါမှမဟုတ် workspace ရဲ့ နာမည်ကို ရွေးပါ။ Workspace settings ဆီ ခေါ်သွားပါလိမ့်မယ် — အဲဒီမှာ workspace တစ်ခုကို public workspace အဖြစ် ပြောင်းဖို့ဆိုတဲ့ request ကို approve ဒါမှမဟုတ် deny လုပ်နိုင်ပါတယ်။

Workspaces တွေအကြောင်း ပိုသိချင်ရင် — [Postman မှာ workspaces တွေ ဖန်တီးခြင်း](/docs/postman/creating-workspaces) နဲ့ [Postman workspaces တွေ စီမံခန့်ခွဲခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/) ကို ကြည့်ပါ။ Public workspace တစ်ခု ဘယ်လို ဖန်တီးမလဲဆိုတဲ့ အသေးစိတ်အတွက် — [Public workspaces တွေနဲ့ Postman community နဲ့ ပူးပေါင်းခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) ဆီ သွားပါ။

## Public documentation တွေ

**Documentation** tab က — documentation publish လုပ်ပြီးသား collections အားလုံးကို ပြသပြီး — ကိုယ့် team members တွေဆီက documentation publish လုပ်ဖို့ဆိုတဲ့ requests တွေကိုလည်း ပြသပါတယ်။ Documentation set တစ်ခုကို ကြည့်ဖို့ collection ရဲ့ နာမည်ကို ရွေးပါ။

Publish request တစ်ခုကို approve ဒါမှမဟုတ် deny လုပ်ဖို့ — request တစ်ခုပေါ်မှာ mouse ချပြီး **Review Request** ကို ရွေးပါ။ Documentation ကို [publish လုပ်ပြီး](https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/) public ဖြစ်စေချင်ရင် **Approve** ကို ရွေးပါ — documentation ကို private အနေနဲ့ ထားချင်ရင်တော့ **Deny** ကို ရွေးပါ။

## Collection access keys တွေ

**Collection Access Keys** tab က ကိုယ့် team ရဲ့ collection access keys တွေကို ပြသပါတယ်။ Key တစ်ခုက ဘယ် collection နဲ့ သက်ဆိုင်လဲ, ဘယ်တုန်းက ဖန်တီးခဲ့လဲ နဲ့ ဘယ်သူ ဖန်တီးခဲ့လဲဆိုတာ ကြည့်ရှုနိုင်ပါတယ်။ ကိုယ့် collection access keys တွေရဲ့ စာရင်းကို ကိုယ့် [API keys page](https://go.postman.co/settings/me/api-keys/) မှာ ရှာတွေ့နိုင်ပါတယ်။

**Allow creation of Collection Access Keys** setting ကို ပိတ်ထားရင် — ကိုယ့် team members တွေက [collection access keys အသစ်တွေ ဖန်တီးနိုင်တော့မှာ မဟုတ်ပါဘူး](/docs/postman/sharing)။

Key တစ်ခုကို revoke လုပ်ဖို့ — key ပေါ်မှာ mouse ချပြီး **Delete** ကို ရွေးပါ။

Team ရဲ့ ရှိပြီးသား keys အားလုံးကို ဖယ်ရှားဖို့ **Revoke All Keys** ကို နှိပ်ပါ။

အတည်ပြုဖို့ **Revoke All Keys** ကို နှိပ်ပါ။ မလုပ်တော့ဘူးဆိုရင် — **Keep All Keys** ကို နှိပ်ပါ ဒါမှမဟုတ် window ကို ပိတ်ပါ။

**Collection access keys တွေ revoke လုပ်ခြင်းက နောက်ပြန် မဆုတ်နိုင်ပါဘူး။** ဒီ လုပ်ဆောင်ချက်ကို ပြန်ပြင် မရနိုင်ပါဘူး။

## Collection JSON links တွေ

Public link တစ်ခုကို သုံးပြီး collection JSON files တွေ မျှဝေခြင်းကို ရပ်ဆိုင်းလိုက်ပါပြီ။ Links အသစ်တွေ ထုတ်လုပ်လို့ မရတော့ဘဲ — ရှိပြီးသား links တွေကိုလည်း ပြင်ဆင် ဒါမှမဟုတ် တည်းဖြတ်လို့ မရတော့ပါဘူး။ ရှိပြီးသား collection JSON links တွေကိုတော့ Users တွေ ဆက်လက် access လုပ်နိုင်ပါသေးတယ်။

Collection တစ်ခုကို JSON format နဲ့ မျှဝေဖို့ဆိုရင် — Postman API ကို သုံးနိုင်ပါတယ်။ အသေးစိတ်ကို [Postman API သုံးပြီး share လုပ်ခြင်း](/docs/postman/sharing) မှာ ကြည့်ပါ။

Dashboard ရဲ့ **Collection JSON Links** tab က — JSON links ရှိပြီးသား collections အားလုံးကို ပြသပါတယ်။

Community Manager တစ်ယောက် ဒါမှမဟုတ် Super Admin တစ်ယောက်က collection JSON link တစ်ခုကို ကြည့်ရှု ဒါမှမဟုတ် ဖျက်နိုင်ပါတယ်။ Collection ရဲ့ နာမည်အပြင် — dashboard က link ကို ဘယ်တုန်းက update လုပ်ခဲ့လဲ, ဘယ်သူ update လုပ်ခဲ့လဲ နဲ့ JSON link အကြောင်း အချက်အလက်တွေကိုပါ ပြသပါတယ်။
