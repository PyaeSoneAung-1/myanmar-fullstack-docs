---
title: "Postman မှာ Pre-request scripts ရေးသားပြီး dynamic behavior ထည့်သွင်းခြင်း"
description: "Pre-request scripts ဆိုတာ ဘာလဲ — request, collection နဲ့ folder များအတွက် pre-request script ရေးနည်း၊ JSDoc ဖြင့် documentation ထည့်ခြင်း နဲ့ scripts များ ပြန်သုံးခြင်း"
order: 17
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/pre-request-scripts/"
status: translated
updated: 2026-09-02
---

Postman မှာ pre-request scripts တွေကို သုံးပြီး — request တစ်ခု run မလုပ်ခင် JavaScript ကို run လုပ်နိုင်ပါတယ်။ Request, collection ဒါမှမဟုတ် folder တစ်ခုရဲ့ **Pre-request** tab ထဲမှာ code ထည့်ထားခြင်းအားဖြင့် — variable တန်ဖိုးတွေ, parameters, headers နဲ့ body data တွေ သတ်မှတ်ခြင်းလိုမျိုး pre-processing (request မပို့မီ ကြိုတင် လုပ်ဆောင်ခြင်း) တွေကို လုပ်ဆောင်နိုင်ပါတယ်။ ဥပမာ — Postman Console ထဲကို output တွေ log လုပ်ပြီး code တွေ debug လုပ်ဖို့လည်း pre-request scripts တွေကို သုံးနိုင်ပါတယ်။

Scripts တွေ ဘယ်အချိန်မှာ run လဲ၊ collection နဲ့ folder အဆင့်တွေမှာ ဘယ်လို အလုပ်လုပ်လဲ အပါအဝင် — Postman မှာ scripts ရေးခြင်းရဲ့ အခြေခံသဘောတရားတွေအတွက် [Scripts သုံးခြင်း မိတ်ဆက်](/docs/postman/intro-to-scripts) ကို ကြည့်နိုင်ပါတယ်။

## Pre-request script ဥပမာ

Pre-request scripts တွေကို သုံးတဲ့ ဥပမာတစ်ခုက အောက်ပါအတိုင်းပါ:

* Collection တစ်ခုထဲမှာ requests တွေ အစဉ်လိုက် ရှိပြီး — [Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/) ကို သုံးနေသလိုမျိုး — အဲဒါတွေကို အစဉ်လိုက် run နေပါတယ်။
* ဒုတိယ request ကတော့ ပထမ request ကနေ ပြန်ရတဲ့ တန်ဖိုးတစ်ခုအပေါ် မှီခိုနေပါတယ်။
* အဲဒီတန်ဖိုးကို ဒုတိယ request ဆီ မပို့ခင် — အရင်ဆုံး process လုပ်ဖို့ လိုပါတယ်။
* ပထမ request က သူ့ရဲ့ post-response script ထဲမှာ — response ထဲက field တစ်ခုရဲ့ data တန်ဖိုးကို variable တစ်ခုထဲ သိမ်းလိုက်ပါတယ်။
* ဒုတိယ request ကတော့ သူ့ရဲ့ pre-request script ထဲမှာ အဲဒီတန်ဖိုးကို ပြန်ယူပြီး process လုပ်ကာ — ရလာတဲ့ တန်ဖိုးကို variable တစ်ခုထဲ သိမ်းပါတယ်။ နောက်ပိုင်းမှာ ဒီ variable ကို ဒုတိယ request ထဲမှာ (ဥပမာ — သူ့ရဲ့ parameters တွေထဲမှာ) ကိုးကား သုံးပါတယ်။

## Request မပို့မီ scripting လုပ်ဆောင်ခြင်း

Postman က request တစ်ခု မပို့ခင် run ချင်တဲ့ code ထည့်ဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar မှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။
2. Request ကို ဖွင့်ပြီး **Scripts** tab ကို ရွေးပါ။
3. **Pre-request** tab ကို နှိပ်ပါ။
4. Request run မလုပ်ခင် process လုပ်ဖို့ လိုတဲ့ JavaScript ကို ရိုက်ထည့်ပြီး ![Save icon](https://assets.postman.com/postman-docs/aether-icons/action-save-stroke.svg#icon) **Save** ကို နှိပ်ပါ။
5. Request ပို့ဖို့ **Send** ကို နှိပ်ပါ။ Postman က request ကို API ဆီ မပို့ခင် — ဒီ code က run ပါတယ်။

Code ကို ပိုဖတ်ရလွယ်အောင် — code editor ရဲ့ အောက်ဘက်ညာဘက်မှာ ![Pretty icon](https://assets.postman.com/postman-docs/aether-icons/action-pretty-stroke.svg#icon) **Beautify** ကို နှိပ်နိုင်ပါတယ်။

## Pre-request scripts များကို documentation ထည့်ခြင်း

Postman က ကိုယ့်ရဲ့ pre-request scripts ထဲက JavaScript functions တွေကို document လုပ်ဖို့ JSDoc ကို ထောက်ပံ့ပေးပါတယ်။ JSDoc သုံးပြီး ကိုယ့် function တွေထဲ ထည့်ထားတဲ့ documentation တွေက — function ကို ခေါ်လိုက်တဲ့အခါ popup window တစ်ခုမှာ ပြသပါတယ်။ Pre-request scripts တွေကို documentation ဘယ်လို ထည့်ရမလဲဆိုတာ လေ့လာဖို့ — တရားဝင် [JSDoc documentation](https://jsdoc.app/) ကို သုံးနိုင်ပါတယ်။

အောက်ပါ ဥပမာက `logger` function ကို JSDoc သုံးပြီး documentation ထည့်ထားတာပါ။ ဒီ documentation က function က ဘာတွေ လုပ်လဲဆိုတာ ရှင်းပြပြီး — `data` parameter ကို ဘာအတွက် သုံးလဲ၊ သူက string data type တစ်ခုကို လက်ခံတယ်ဆိုတာကိုလည်း သတ်မှတ်ပေးပါတယ်။

```js
/**
 * This function prints a string to the Postman Console.
 * @param {string} data - The text to print to the Postman Console.
 */
function logger (data) {
    console.log(`Logging information to the console, ${data}`)
}
```

## Pre-request scripts များကို ပြန်သုံးခြင်း

Pre-request scripts တွေကို collection တစ်ခုလုံး ဒါမှမဟုတ် collection ထဲက folders တွေထဲကိုပါ ထည့်နိုင်ပါတယ်။ နှစ်မျိုးလုံးမှာ — ကိုယ့်ရဲ့ pre-request script က collection ထဲက request တိုင်း ဒါမှမဟုတ် folder ထဲက direct child request (တိုက်ရိုက် ပါဝင်တဲ့ request) တိုင်း မတိုင်ခင် run ပါတယ်။ ဒါကြောင့် requests အများကြီးအတွက် run ဖို့ လိုအပ်တဲ့ — အသုံးများတဲ့ pre-processing ဒါမှမဟုတ် debugging အဆင့်တွေကို တစ်နေရာတည်းမှာ သတ်မှတ်ထားနိုင်ပါတယ်။

Collection ဒါမှမဟုတ် folder တစ်ခုကို စဖန်တီးတုန်းမှာပဲ ဖြစ်စေ၊ အဲဒီနောက် ဘယ်အချိန်မှာပဲ ဖြစ်စေ — pre-request script တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ [Pre-request scripts တွေကို Postman Package Library ထဲမှာလည်း သိမ်းထားနိုင်ပါတယ်](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/)။ ဒါက အသုံးများတဲ့ scripts တွေကို နေရာတစ်ခုတည်းမှာ ထိန်းသိမ်း၊ team နဲ့ share လုပ်ပြီး — ကိုယ့် internal workspaces တွေထဲမှာ ပြန်သုံးနိုင်စေပါတယ်။

Collection ဒါမှမဟုတ် folder တစ်ခုထဲကို pre-request script ထည့်ဖို့ — အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar မှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။
2. Collection တစ်ခု ဒါမှမဟုတ် folder တစ်ခုကို ရွေးပါ။
3. **Scripts** tab ကို နှိပ်ပါ။
4. **Pre-request** tab ကို နှိပ်ပြီး — collection ထဲက request တိုင်း ဒါမှမဟုတ် folder ထဲက direct child request တိုင်း မတိုင်ခင် run မယ့် code ကို ရိုက်ထည့်ပါ။

## နောက်ထပ်အဆင့်များ

Pre-request scripts ရေးခြင်းရဲ့ အခြေခံတွေ လေ့လာပြီးပြီဆိုရင် — ကိုယ့် scripts တွေကို အောက်ပါအတိုင်း ထပ်ချဲ့နိုင်ပါတယ်:

* `pm` object ကို ဘယ်လို သုံးရမလဲဆိုတာ ပိုလေ့လာချင်ရင် — [Postman JavaScript reference](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) ကို ကြည့်ပါ။
* အသုံးများတဲ့ scripts တွေကို သိမ်းဆည်း ပြန်သုံးခြင်းအကြောင်း ပိုသိချင်ရင် — Postman ထဲက [package library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) အကြောင်း လေ့လာပါ။
