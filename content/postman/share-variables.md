---
title: "Postman မှာ variables များကို share လုပ်ခြင်း"
description: "Variables တွေကို share လုပ်ခြင်း — shared value ဖန်တီးခြင်း, secure variable value share လုပ်ခြင်း, shared value update လုပ်ခြင်း, share ရပ်တန့်ခြင်း နဲ့ local values တွေနဲ့ အလုပ်လုပ်ခြင်း"
order: 82
source: "https://learning.postman.com/docs/use/send-requests/variables/share-variables/"
status: translated
updated: 2026-09-02
---

Global, environment နဲ့ collection variables တွေကို share လုပ်ပြီး — values တွေကို Postman cloud နဲ့ sync လုပ်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် variables တွေမှာ — ကိုယ့်ရဲ့ Postman instance ထဲမှာ ကိုယ်တစ်ယောက်တည်းပဲ access လုပ်နိုင်တဲ့ local value တစ်ခု ရှိပါတယ်။ Team mates တွေ access လုပ်နိုင်တဲ့ သီးခြား shared value တစ်ခု ဖန်တီးဖို့ [variable value တစ်ခုကို share လုပ်](#variable-value-တစ်ခုကို-share-လုပ်ခြင်း)ပါ။ [shared value တစ်ခုကို update လုပ်](#shared-value-တစ်ခုကို-update-လုပ်ခြင်း)နိုင်သလို — [value တစ်ခုကို share လုပ်တာ ရပ်တန့်](#shared-value-တစ်ခုကို-share-လုပ်ခြင်းကို-ရပ်တန့်ခြင်း)နိုင်ပါတယ်။

Shared values တွေကို Postman cloud ပေါ်မှာ run တဲ့ Postman features တွေဖြစ်တဲ့ — scheduled collection runs, monitors နဲ့ Postman CLI တို့မှာ သုံးပါတယ်။

Value တစ်ခုကို share လုပ်ပြီးတာနဲ့ — ကိုယ်ရော team mates တွေရော development နဲ့ testing ကာလအတွင်း ကိုယ့်ကိုယ်ပိုင် [local values တွေနဲ့ ဆက်ပြီး အလုပ်လုပ်](#shared-values-တွေနဲ့-အလုပ်လုပ်ခြင်း)နိုင်ပြီး — shared value ကို မထိခိုက်စေပါဘူး။ လိုချင်ရင် — local value ကို shared value ဆီ ပြန်လည်သတ်မှတ်နိုင်ပါတယ်။

[VS Code extension ကနေ variable values တွေကို share လုပ်ခြင်း](https://learning.postman.com/docs/reference/vs-code-extension/send-requests/#store-variables) အကြောင်းလည်း လေ့လာနိုင်ပါတယ်။

## Shared value တစ်ခု ဖန်တီးခြင်း

Editor တစ်ယောက်အနေနဲ့ — variable values တွေကို Postman cloud ထဲက ကိုယ့် team ဆီ ရနိုင်အောင် shared values တွေ ဖန်တီးနိုင်ပါတယ်။ Shared values တွေက workspace တစ်လျှောက် sync လုပ်ပြီး — requests, collections နဲ့ တခြား Postman features တွေထဲမှာ team mates တွေ သုံးနိုင်ပါတယ်။

Variable တစ်ခုကို secure အနေနဲ့ သတ်မှတ်ထားရင် — workspace တစ်ခုရဲ့ Postman Shared Vault ထဲမှာ value တူညီတဲ့ vault secret တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

Variables တွေရဲ့ shared values အားလုံးကို [ကိုယ့်ရဲ့ documentation နဲ့အတူ publish](/docs/publishing-your-api/publishing-your-docs/) လုပ်မှာ ဖြစ်ကြောင်း သတိပြုပါ။ Shared values တွေထဲမှာ passwords ဒါမှမဟုတ် tokens တွေလို sensitive အချက်အလက်တွေ မပါအောင် သေချာစေပါ။ Sensitive အချက်အလက်တွေ သိမ်းဖို့ လိုရင် — [secure variable တစ်ခုကို share လုပ်](#secure-variable-value-တစ်ခုကို-share-လုပ်ခြင်း)ပါ။

### Variable value တစ်ခုကို share လုပ်ခြင်း

Variable value တစ်ခုကို Postman cloud ဆီ sync လုပ်ပြီး — team mates တွေဆီ ရနိုင်အောင် share လုပ်ပါ။ Value တစ်ခုကို share လုပ်တဲ့အခါ — workspace ထဲက တခြားသူတွေ access လုပ်နိုင်တဲ့ shared value တစ်ခုကို Postman က ဖန်တီးပေးပါတယ်။

Variable တစ်ခုကို share လုပ်ဖို့ —

1. [global](/docs/postman/define-variables)၊ [environment](/docs/postman/define-variables) ဒါမှမဟုတ် [collection](/docs/postman/define-variables) variable တစ်ခုကို ဖွင့်ပါ။
2. Share လုပ်ချင်တဲ့ variable ရဲ့ value ဘေးမှာ **Share** ကို နှိပ်ပါ။ Values အားလုံးကို share လုပ်ဖို့ — **More** ကို နှိပ်ပြီး **Share all** ကို ရွေးပါ။

   **More > Shared Value** view option ကို ရွေးထားရင် — **Shared Value** column ထဲမှာ value တစ်ခု ရိုက်ထည့်ပါ။ Shared values တွေ အလိုအလျောက် update ဖြစ်ပါတယ်။

### Secure variable value တစ်ခုကို share လုပ်ခြင်း

[secure variable](/docs/postman/define-variables) value တစ်ခုကို share လုပ်ခြင်းက — workspace တစ်ခုရဲ့ [Postman Shared Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) ထဲမှာ vault secret တစ်ခု ဖန်တီးပေးပါတယ်။ Secure variable က ကိုယ့်ရဲ့ shared vault ထဲက vault secret တစ်ခုကို ကိုးကားထားပြီးသားဆိုရင် — variable ကို မူလအတိုင်း share လုပ်နိုင်ပါတယ်။

ကိုယ့် local vault ကနေ vault secret တစ်ခုကို ကိုးကားထားတဲ့ secure variable တစ်ခုကိုတော့ share လုပ်လို့ မရပါဘူး။ Local vault ထဲမှာ သိမ်းထားတဲ့ vault secrets တွေကို ကိုယ်တစ်ယောက်တည်းပဲ access လုပ်နိုင်လို့ — team mates တွေနဲ့ မျှဝေလို့ မရနိုင်ပါဘူး။ Value ကို share လုပ်ပြီး — value တူညီတဲ့ vault secret အသစ်တစ်ခုကို shared vault ထဲမှာ ဖန်တီးပါ။

Secure variable တစ်ခုကို share လုပ်ဖို့ —

1. [global](/docs/postman/define-variables)၊ [environment](/docs/postman/define-variables) ဒါမှမဟုတ် [collection](/docs/postman/define-variables) variable တစ်ခုကို ဖွင့်ပါ။
2. Secure variable တစ်ခုဘေးမှာ **Share** ကို နှိပ်ပါ။ Secure variable တစ်ခုရဲ့ နာမည်ဘေးမှာ secure icon (သော့ခုံသင်္ကေတ) ရှိပါတယ်။
3. လိုချင်ရင် vault secret နာမည်ကို update လုပ်ပါ။
4. **Create** ကို နှိပ်ပါ။ Vault secret ကို workspace တစ်ခုရဲ့ Postman Shared Vault ထဲမှာ ဖန်တီးပြီး — variable ရဲ့ value ကို team mates တွေနဲ့ မျှဝေပါတယ်။

## Shared value တစ်ခုကို update လုပ်ခြင်း

Element တစ်ခုအတွက် Editor access ရှိရင် — variable တစ်ခုရဲ့ shared value ကို update လုပ်နိုင်ပါတယ်။ Shared value ကို ကိုယ့်ရဲ့ local value အပေါ် အခြေခံပြီး update လုပ်ကာ — team mates တွေနဲ့ မျှဝေပါတယ်။

Shared value တစ်ခုကို update လုပ်ဖို့ —

1. [global](/docs/postman/define-variables)၊ [environment](/docs/postman/define-variables) ဒါမှမဟုတ် [collection](/docs/postman/define-variables) variable တစ်ခုကို ဖွင့်ပါ။
2. Local value ကို shared value နဲ့ မတူအောင် update လုပ်ပါ။
3. Variable တစ်ခုရဲ့ value ဘေးမှာ edited icon ကို နှိပ်ပြီး **Update shared value** ကို ရွေးပါ။ Shared values အားလုံးကို update လုပ်ဖို့ — **More** ကို နှိပ်ပြီး **Update all shared values** ကို ရွေးပါ။

   **More > Shared Value** view option ကို ရွေးထားရင် — အဲဒီ value ကို update လုပ်ပါ။ Shared values တွေ အလိုအလျောက် update ဖြစ်ပါတယ်။

Shared value တစ်ခုကို clipboard ဆီ copy လုပ်ဖို့ — variable တစ်ခုရဲ့ value ဘေးမှာ edited icon ကို နှိပ်ပြီး copy icon ကို ရွေးပါ။

## Shared value တစ်ခုကို share လုပ်ခြင်းကို ရပ်တန့်ခြင်း

Shared value တစ်ခုကို share လုပ်တာ ရပ်တန့်နိုင်ပြီး — Postman cloud ကနေ ဖယ်ရှားနိုင်ပါတယ်။ Value တစ်ခုကို share လုပ်တာ ရပ်လိုက်တဲ့အခါ — အဲဒါကို မှီခိုနေတဲ့ API workflows တွေ ပျက်စီးသွားနိုင်ပါတယ်။ ဥပမာ — monitor တစ်ခုထဲမှာ သုံးထားတဲ့ variable တစ်ခုကို share လုပ်တာ ရပ်လိုက်ရင် — monitor က variable ရဲ့ value ကို access လုပ်နိုင်တော့မှာ မဟုတ်ဘဲ fail ဖြစ်နိုင်ပါတယ်။

Variable တစ်ခုကို team mates တွေနဲ့ share လုပ်တာ ရပ်တန့်ဖို့ —

1. [global](/docs/postman/define-variables)၊ [environment](/docs/postman/define-variables) ဒါမှမဟုတ် [collection](/docs/postman/define-variables) variable တစ်ခုကို ဖွင့်ပါ။
2. အောက်ပါတွေထဲက တစ်ခုကို ရွေးပါ:

   * Local value နဲ့ shared value တူနေရင် — variable ရဲ့ value ဘေးမှာ synced icon ကို နှိပ်ပြီး **Unshare** ကို နှိပ်ပါ။
   * Local value နဲ့ shared value မတူဘူးဆိုရင် — variable ရဲ့ value ဘေးမှာ edited icon ကို နှိပ်ပြီး **Unshare** ကို ရွေးပါ။
   * **More > Shared Value** view option ကို ရွေးထားရင် — value ကို ဖယ်ရှားပါ။

Values အားလုံးကို share လုပ်တာ ရပ်တန့်ဖို့ — **More** ကို နှိပ်ပြီး **Unshare all** ကို ရွေးပါ။

## Shared values တွေနဲ့ အလုပ်လုပ်ခြင်း

Variable တစ်ခုမှာ [shared value](#shared-value-တစ်ခု-ဖန်တီးခြင်း) ရှိပြီးတာနဲ့ — shared value ကို မထိခိုက်စေဘဲ local value ကို ဆက်ပြီး update လုပ်နိုင်ပါတယ်။ Local values တွေက ကိုယ့် team ထဲက တခြားသူတွေဆီ sensitive data တွေ ပေါက်ကြားမှာ စိုးရိမ်စရာ မလိုဘဲ — private credentials တွေ ဒါမှမဟုတ် စမ်းသပ်မှုဆိုင်ရာ values တွေနဲ့ develop လုပ်ပြီး test လုပ်နိုင်စေပါတယ်။ ပြီးတဲ့အခါ — Postman cloud ဆီ sync လုပ်ထားတဲ့ shared value ဆီ local value ကို ပြန်လည်သတ်မှတ်နိုင်ပါတယ်။

ဥပမာ — ကိုယ့် team မှာ shared API key တစ်ခုနဲ့ individual API keys တွေ ရှိနိုင်ပါတယ်။ Team collaboration အတွက် shared key ကို သုံးပေမယ့် — ကိုယ်ပိုင် key နဲ့ experimental development အလုပ်တွေကို local မှာ လုပ်နိုင်ပါတယ်။

Variable တစ်ခုရဲ့ value ကို ပြန်လည်သတ်မှတ်ဖို့ —

1. [global](/docs/postman/define-variables)၊ [environment](/docs/postman/define-variables) ဒါမှမဟုတ် [collection](/docs/postman/define-variables) variable တစ်ခုကို ဖွင့်ပါ။
2. Local value က shared value နဲ့ မတူအောင် [update လုပ်ထားတဲ့](#shared-value-တစ်ခုကို-update-လုပ်ခြင်း) variable တစ်ခုဆီ သွားပါ။ Update လုပ်ထားတဲ့ values တွေရဲ့ ဘေးမှာ edited icon ရှိပါတယ်။
3. Variable တစ်ခုရဲ့ value ဘေးမှာ edited icon ကို နှိပ်ပြီး **Reset value** ကို ရွေးပါ။ Shared values အားလုံးကို ပြန်လည်သတ်မှတ်ဖို့ — **More** ကို နှိပ်ပြီး **Reset all shared values** ကို ရွေးပါ။

ကိုယ့်ရဲ့ local value က shared value နဲ့ တိုက်ဆိုင်အောင် update ဖြစ်သွားပါတယ်။
