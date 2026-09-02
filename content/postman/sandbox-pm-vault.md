---
title: "Postman scripts တွေထဲမှာ vault secrets တွေကို ကိုးကားခြင်း (Reference vault secrets in Postman scripts)"
description: "pm.vault methods သုံးပြီး Postman Local Vault ထဲက vault secrets တွေကို access လုပ်ခြင်း — scripts တွေမှာ support ဖွင့်ခြင်း, ဝင်ရောက်ခွင့် ပေးခြင်း/စီမံခြင်း, get, set, unset"
order: 91
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-vault/"
status: translated
updated: 2026-09-02
---

`pm.vault` methods တွေကို သုံးပြီး သင့် scripts တွေထဲမှာ သင့် Postman Local Vault ထဲက [vault secrets](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) တွေကို access လုပ်ပြီး ကိုင်တွယ်နိုင်ပါတယ်။ Scripts တွေထဲမှာ vault secrets တွေအတွက် support ကို အရင် ဖွင့်ထားရပါမယ်။ `pm.vault` methods တွေကို သုံးထားတဲ့ request တစ်ခုကို ပို့တဲ့အခါ ဒါမှမဟုတ် collection တစ်ခုကို ကိုယ်တိုင် run လုပ်တဲ့အခါ — သင့် vault secrets တွေကို scripts တွေနဲ့ သုံးခွင့်အတွက် collection ဒါမှမဟုတ် workspace ကို ဝင်ရောက်ခွင့် ပေးမလား ငြင်းမလား ဆိုတဲ့ prompt ပေါ်လာပါလိမ့်မယ်။

[`pm.vault` methods](#pmvault) တွေကို သင့် HTTP collections နဲ့ requests တွေ၊ manual collection runs တွေထဲက pre-request နဲ့ post-response scripts တွေမှာ သုံးနိုင်ပါတယ်။

Scheduled collection runs, monitors, Postman CLI နဲ့ Newman တွေက `pm.vault` methods တွေကို ပံ့ပိုးမထားပါဘူး။ GraphQL ဒါမှမဟုတ် gRPC လိုမျိုး — HTTP မဟုတ်တဲ့ requests တွေမှာလည်း ဒီ methods တွေကို ပံ့ပိုးမထားပါဘူး။

`pm.vault` methods တွေကို သုံးတဲ့အခါ အောက်ပါတို့ကို သတိပြုပါ:

* [External vaults တွေနဲ့ ချိတ်ဆက်ထားတဲ့ vault secrets](https://learning.postman.com/docs/use/postman-vault/postman-vault-integrations/) တွေကို access လုပ်ဖို့ [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို သုံးပါ။
* [Postman web app](https://learning.postman.com/docs/getting-started/installation/install-app/#use-the-postman-web-app) ကို သုံးပြီး vault secrets တွေကို access လုပ်နေရင် — [Postman Desktop Agent](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/#postman-desktop-agent) ကို သုံးပါ။ နောက်ဆုံးရတဲ့ အပြောင်းအလဲတွေနဲ့ တိုးတက်မှုတွေကို ရဖို့ Postman က [Postman Desktop Agent ရဲ့ နောက်ဆုံးဗားရှင်း](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/#update-the-postman-desktop-agent) ကို သုံးဖို့ အကြံပြုပါတယ်။

## Scripts တွေထဲမှာ vault secrets တွေအတွက် support ဖွင့်ခြင်း (Enable support for vault secrets in scripts)

Scripts တွေထဲမှာ vault secrets တွေအတွက် support ကို ဖွင့်ထားရပါမယ်။ [`pm.vault` methods](#pmvault) တွေကို မသုံးခင် collection တစ်ခု ဒါမှမဟုတ် workspace တစ်ခုကို သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးမလား ငြင်းမလား ဆိုတဲ့ prompt ပေါ်လာပါလိမ့်မယ်။

Support မဖွင့်ဘဲ `pm.vault` methods တွေကို သုံးထားတဲ့ requests တွေ ပို့ဖို့ ကြိုးစားရင် — Postman Console ထဲမှာ error တစ်ခု ရပါလိမ့်မယ်။ ဒါ့အပြင် `pm.vault` method တစ်ခုရဲ့ နောက်မှာ ရှိတဲ့ code တွေ ဘာမှ run မှာ မဟုတ်ပါဘူး။

Scripts တွေထဲမှာ vault secrets တွေအတွက် support ဖွင့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. သင့် [Postman Local Vault ကို ဖွင့်ပါ](https://learning.postman.com/docs/use/postman-vault/postman-vault-key/).
2. သင့် local vault ရဲ့ အပေါ်ညာဘက်မှာ ရှိတဲ့ **Settings** ကို နှိပ်ပါ။
3. **Settings** tab ထဲမှာ **Enable support in scripts** ဘေးက toggle ကို ဖွင့်ပါ။
4. အတည်ပြုဖို့ **Enable** ကို နှိပ်ပါ။

## Scripts တွေကို သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးခြင်း (Grant scripts access to your vault secrets)

Postman က သင်ဝင်ရောက်ခွင့် ပေးထားတဲ့ collections ဒါမှမဟုတ် workspaces တွေကနေသာ [`pm.vault` methods](#pmvault) တွေကို run လုပ်ခွင့် ပြုပါတယ်။ Methods တွေကို သုံးထားတဲ့ request တစ်ခု ပို့တဲ့အခါ ဒါမှမဟုတ် collection တစ်ခုကို ကိုယ်တိုင် run လုပ်တဲ့အခါ — scripts တွေနဲ့ သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးမလား ငြင်းမလား ဆိုတဲ့ prompt ပေါ်လာပါလိမ့်မယ်။ သင့် Postman Local Vault ကနေ collection ဒါမှမဟုတ် workspace ရဲ့ ဝင်ရောက်ခွင့်ကို စီမံခန့်ခွဲနိုင်ပါတယ်။

Scripts တွေထဲမှာ vault secrets တွေအတွက် support ဖွင့်ထားမှသာ — ဝင်ရောက်ခွင့် ပေးမလား ငြင်းမလား prompt ပေါ်လာမှာ ဖြစ်ပါတယ်။

Collection တစ်ခုထဲမှာ မသိမ်းရသေးတဲ့ HTTP request အသစ်တစ်ခုကတော့ — သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့်ကို အလိုအလျောက် ရသွားလို့ prompt မပေါ်ပါဘူး။

### ဝင်ရောက်ခွင့် ပေးခြင်း သို့မဟုတ် ငြင်းပယ်ခြင်း (Grant or deny access)

Collection တစ်ခု ဒါမှမဟုတ် workspace တစ်ခုကို scripts တွေနဲ့ သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးနိုင်သလို ငြင်းပယ်လည်း လုပ်နိုင်ပါတယ်။ သင့် Postman Local Vault ထဲက vault secrets တွေကို လုံခြုံအောင် ထားဖို့ — သင်ယုံကြည်ရတဲ့ scripts တွေကိုသာ run လုပ်ပါ။

Collection ဒါမှမဟုတ် workspace တစ်ခုကို သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ငြင်းပယ်ထားရင် — ငြင်းထားတဲ့ အဆင့်မှာ request တစ်ခု ပို့တဲ့အခါ Postman Console ထဲမှာ error တစ်ခု ရပါလိမ့်မယ်။ ဒါ့အပြင် request တစ်ခု ပို့တဲ့အခါ ဒါမှမဟုတ် collection တစ်ခုကို ကိုယ်တိုင် run လုပ်တဲ့အခါ — `pm.vault` method တစ်ခုရဲ့ နောက်မှာ ရှိတဲ့ code တွေ ဘာမှ run မှာ မဟုတ်ပါဘူး။

Scripts တွေနဲ့ သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးဖို့ ဒါမှမဟုတ် ငြင်းဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Collections** ကို နှိပ်ပြီး — သင့် vault secrets တွေကို access လုပ်တဲ့ ဒါမှမဟုတ် ကိုင်တွယ်တဲ့ script တစ်ခု ပါဝင်တဲ့ HTTP collection ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။

2. [Request ကို ပို့ပါ](/docs/postman/request-basics) ဒါမှမဟုတ် [collection ကို ကိုယ်တိုင် run လုပ်ပါ](/docs/postman/intro-to-collection-runs)။

3. ဝင်ရောက်ခွင့် ပေးချင်တဲ့ ဒါမှမဟုတ် ငြင်းချင်တဲ့ element ကို ရွေးပါ:

   * **Only this collection** — Collection ထဲက requests တွေအားလုံးကို ဝင်ရောက်ခွင့် ပေးဖို့ ဒါမှမဟုတ် ငြင်းဖို့။
   * **Entire Workspace** — Workspace ထဲက collections နဲ့ requests တွေအားလုံးကို ဝင်ရောက်ခွင့် ပေးဖို့ ဒါမှမဟုတ် ငြင်းဖို့။

4. **Grant Access** (ဝင်ရောက်ခွင့် ပေးမလား) ဒါမှမဟုတ် **Deny Access** (ဝင်ရောက်ခွင့် ငြင်းမလား) ကို ရွေးပါ။

ဝင်ရောက်ခွင့် ပေးဖို့ ဒါမှမဟုတ် ငြင်းဖို့ ရွေးလိုက်ပြီဆိုရင် — ရွေးထားတဲ့ အဆင့်မှာ Postman က နောက်တစ်ခါ မမေးတော့ပါဘူး။ ဥပမာ — collection တစ်ခုကို ဝင်ရောက်ခွင့် ငြင်းထားရင် — workspace ထဲက တခြား collection တစ်ခုကနေ ပြန်ပို့တဲ့အခါ Postman က နောက်တစ်ခါ မေးပါလိမ့်မယ်။ ဝင်ရောက်ခွင့် ပေးထားတဲ့ ဒါမှမဟုတ် ငြင်းထားတဲ့ collections နဲ့ workspaces တွေကို စီမံခန့်ခွဲနိုင်ပါတယ်။

### သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့်ကို စီမံခန့်ခွဲခြင်း (Manage access to your vault secrets)

Collection တစ်ခု ဒါမှမဟုတ် workspace တစ်ခုရဲ့ သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့်ကို စီမံခန့်ခွဲဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. သင့် [Postman Local Vault ကို ဖွင့်ပါ](https://learning.postman.com/docs/use/postman-vault/postman-vault-key/).
2. သင့် local vault ရဲ့ အပေါ်ညာဘက်မှာ ရှိတဲ့ **Settings** ကို နှိပ်ပါ။
3. **Manage access** tab ကို နှိပ်ပါ။
4. Collection တစ်ခု ဒါမှမဟုတ် workspace တစ်ခုဘေးမှာ — အရင်က ဝင်ရောက်ခွင့် ပေးခဲ့လား ငြင်းခဲ့လားပေါ် မူတည်ပြီး အောက်ပါတို့ထဲက တစ်ခုကို နှိပ်ပါ:

   * **Reset Access** — Collection ဒါမှမဟုတ် workspace ထဲက scripts တွေကို သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးဖို့ သင့်ရဲ့ ဆုံးဖြတ်ချက်ကို ပြန်သတ်မှတ်ပါတယ်။ Collection ဒါမှမဟုတ် workspace ထဲမှာ request တစ်ခု ပို့တဲ့အခါ — ဝင်ရောက်ခွင့် ပေးမလား ငြင်းမလား prompt နောက်တစ်ခါ ပေါ်လာပါလိမ့်မယ်။
   * **Grant Access** — Collection ဒါမှမဟုတ် workspace ထဲက scripts တွေအားလုံးကို သင့် vault secrets တွေဆီ ဝင်ရောက်ခွင့် ပေးပါတယ်။ Collection ဒါမှမဟုတ် workspace ထဲက scripts တွေကို ဝင်ရောက်ခွင့် ငြင်းထားရင် ဒီ option က ရနိုင်ပါတယ်။

## pm.vault

သင့် local vault ထဲက [vault secrets](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) တွေကို ရယူဖို့၊ သတ်မှတ်ဖို့ ဒါမှမဟုတ် ဖယ်ရှားဖို့ သင့် scripts တွေထဲမှာ `pm.vault` methods တွေကို သုံးပါ။

`pm.vault` methods တွေက သင့် scripts တွေထဲမှာ asynchronously run လုပ်ပါတယ်။ Method တစ်ခုစီကလည်း method ရဲ့ ပြီးစီးမှု ဒါမှမဟုတ် မအောင်မြင်မှုကို ကိုယ်စားပြုတဲ့ Promise object တစ်ခုကို ပြန်ပေးပါတယ်။ Promise နဲ့ ၎င်းရဲ့ ရလဒ်တန်ဖိုးကို စောင့်ဖို့ `pm.vault` method တစ်ခုစီရဲ့ ရှေ့မှာ `await` operator ကို ထည့်ပါ။ `await` operator မပါတဲ့ method တစ်ခုက သင့် script ထဲမှာ run နိုင်ပေမယ့် — မျှော်လင့်ထားတဲ့အတိုင်း အပြုအမူ မဖြစ်နိုင်တာ သတိပြုပါ။

အောက်ပါ ဥပမာတွေထဲမှာ ပြထားတဲ့ syntax ကို သုံးပါ:

```js
console.log(await pm.vault.get("secretKey"));
await pm.vault.set("secretKey", "newValue");
await pm.vault.unset("secretKey");
```

`console.log` သုံးပြီး vault secret တစ်ခုရဲ့ တန်ဖိုးကို log လုပ်ရင် — Postman Console ထဲမှာ အဲဒီတန်ဖိုးကို default အနေနဲ့ mask (ဖုံးကွယ်) ထားပါတယ်။ Console ထဲမှာ vault secrets တွေရဲ့ တန်ဖိုးကို mask မချင်ရင် — သင့် [local vault ကို ဖွင့်ပြီး](https://learning.postman.com/docs/use/postman-vault/postman-vault-key/) **Settings** ကို ရွေးကာ **Settings** tab ကနေ **Mask vault secrets** ဘေးက toggle ကို ပိတ်ပါ။

### pm.vault.get(secretKey:String)

သင့် local vault ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ vault secret ရဲ့ တန်ဖိုးကို ရယူပါတယ်။

Vault secret ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး vault secret တစ်ခုရဲ့ တန်ဖိုးကို string တစ်ခုနဲ့ ဆက်စပ်နိုင်ပါတယ်။

### pm.vault.set(secretKey:String, secretValue:\*)

သင့် local vault ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ တန်ဖိုးရှိတဲ့ vault secret တစ်ခုကို သတ်မှတ်ပါတယ်။

[External vaults တွေနဲ့ ချိတ်ဆက်ထားတဲ့ vault secrets](https://learning.postman.com/docs/use/postman-vault/postman-vault-integrations/) တွေရဲ့ တန်ဖိုးကို သတ်မှတ်တာကို Postman က ပံ့ပိုးမထားပါဘူး။

### pm.vault.unset(secretKey:String)

သင့် local vault ကနေ သတ်မှတ်ထားတဲ့ vault secret တစ်ခုကို ဖယ်ရှားပါတယ်။
