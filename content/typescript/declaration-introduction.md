---
title: "Introduction (Declaration Files မိတ်ဆက်)"
description: "အရည်အသွေးမြင့် TypeScript Declaration Files (.d.ts) တွေ ရေးနည်းကို သင်ပေးတဲ့ Declaration Files section ရဲ့ မိတ်ဆက် — Declaration Reference, Library Structures, Do's and Don'ts, Deep Dive, Publishing, Consumption စတဲ့ section ခွဲများဆီ လမ်းညွှန်ချက်"
order: 28
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html"
status: translated
updated: 2026-09-05
---

Declaration Files section က — အရည်အသွေးမြင့် (high-quality) TypeScript Declaration File တစ်ခုကို ဘယ်လို ရေးရမလဲ သင်ပေးဖို့ ရည်ရွယ်ထားတာပါ။ စတင်နိုင်ဖို့အတွက် — TypeScript ဘာသာစကားကို အခြေခံအဆင့် သိပြီးသား (basic familiarity) ရှိမယ်လို့ ယူဆထားပါတယ်။

မဖတ်ရသေးဘူးဆိုရင် — types နဲ့ modules တွေ အပါအဝင် အခြေခံ concepts တွေကို သိရှိဖို့ [TypeScript Handbook](/docs/typescript/basic-types) ကို အရင်ဖတ်ထားသင့်ပါတယ်။

`.d.ts` files တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ လေ့လာဖို့ အဖြစ်အများဆုံး အကြောင်းရင်းကတော့ — types မပါတဲ့ npm package တစ်ခုကို သင်ကိုယ်တိုင် typing (type သတ်မှတ်) လုပ်နေရလို့ပါ။ အဲဒီလိုဆိုရင် — [Modules .d.ts](/docs/typescript/module-d-ts) ဆီ တိုက်ရိုက် သွားနိုင်ပါတယ်။

Declaration Files section ကို အောက်ပါ section တွေအဖြစ် ခွဲထားပါတယ်။

## [Declaration Files ဥပမာများ (Declaration Reference)](/docs/typescript/declaration-reference)

လက်အောက်ခံ (underlying) library ရဲ့ ဥပမာ (example) တွေကိုပဲ ကြည့်ပြီး declaration file တစ်ခု ရေးရတဲ့ အခြေအနေမျိုးကို မကြာခဏ ရင်ဆိုင်ရပါတယ်။ [Declaration Files ဥပမာများ (Declaration Reference)](/docs/typescript/declaration-reference) section က — အသုံးများတဲ့ API patterns တွေကို ပြသပြီး — pattern တစ်ခုချင်းစီအတွက် declarations တွေ ဘယ်လို ရေးရမလဲ ဖော်ပြထားပါတယ်။ ဒီ guide က — TypeScript ရဲ့ language construct (ဘာသာစကား တည်ဆောက်ပုံ) တိုင်းကို သေချာ မသိသေးတဲ့ TypeScript အသစ်လူသစ် (novice) တွေကို ရည်ရွယ်ထားပါတယ်။

## [Library ဖွဲ့စည်းပုံများ (Library Structures)](/docs/typescript/declaration-library-structures)

[Library ဖွဲ့စည်းပုံများ (Library Structures)](/docs/typescript/declaration-library-structures) guide က — အသုံးများတဲ့ library format တွေကို နားလည်စေပြီး — format တစ်ခုချင်းစီအတွက် မှန်ကန်တဲ့ declaration file တစ်ခု ဘယ်လို ရေးရမလဲ ကူညီပေးပါတယ်။ ရှိပြီးသား file တစ်ခုကို တည်းဖြတ်နေတာဆိုရင် — ဒီ section ကို ဖတ်စရာ မလိုနိုင်ပါဘူး။ Declaration file အသစ်တွေ ရေးမယ့်သူတွေကတော့ — library ရဲ့ format က declaration file ရေးသားပုံအပေါ် ဘယ်လို သက်ရောက်မှုရှိတယ်ဆိုတာ ကောင်းကောင်း နားလည်ဖို့ ဒီ section ကို ဖတ်ဖို့ အထူး တိုက်တွန်းလိုပါတယ်။

Template section ထဲမှာတော့ — file အသစ်တစ်ခု ရေးတဲ့အခါ အသုံးဝင်တဲ့ စမှတ် (starting point) တွေအနေနဲ့ ဆောင်ရွက်ပေးနိုင်တဲ့ declaration files တစ်ချို့ကို တွေ့ရမှာ ဖြစ်ပါတယ်။ ကိုယ့်ရဲ့ structure က ဘာလဲဆိုတာ သိပြီးသားဆိုရင် — sidebar ထဲက d.ts Template section ကို ကြည့်ပါ။

## [လုပ်သင့် မလုပ်သင့် အချက်များ (Do's and Don'ts)](/docs/typescript/declaration-dos-and-donts)

Declaration files တွေထဲမှာ အဖြစ်များတဲ့ အမှားတွေ အများစုကို လွယ်ကူစွာ ရှောင်ရှားနိုင်ပါတယ်။ [လုပ်သင့် မလုပ်သင့် အချက်များ (Do's and Don'ts)](/docs/typescript/declaration-dos-and-donts) section က — အဖြစ်များတဲ့ error တွေကို ဖော်ထုတ်ပြီး — အဲဒါတွေကို ဘယ်လို ရှာဖွေတွေ့ရှိမလဲ၊ ဘယ်လို ပြုပြင်ရမလဲဆိုတာတွေကို ဖော်ပြထားပါတယ်။ လူတိုင်း ဒီ section ကို ဖတ်ထားခြင်းအားဖြင့် အဖြစ်များတဲ့ အမှားတွေကို ရှောင်ရှားနိုင်မှာ ဖြစ်ပါတယ်။

## [နက်ရှိုင်းစွာ လေ့လာခြင်း (Deep Dive)](/docs/typescript/declaration-deep-dive)

Declaration files တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ နောက်ကွယ်က ယန္တရား (underlying mechanics) တွေကို စိတ်ဝင်စားတဲ့ အတွေ့အကြုံရင့် (seasoned) ရေးသားသူတွေအတွက် — [နက်ရှိုင်းစွာ လေ့လာခြင်း (Deep Dive)](/docs/typescript/declaration-deep-dive) section က declaration ရေးသားခြင်းဆိုင်ရာ ဆန်းပြား (advanced) သော concepts တွေ အများကြီးကို ရှင်းပြပြီး — အဲဒီ concepts တွေကို အသုံးချပြီး ပိုသန့်ရှင်းပြီး ပိုအလိုလို နားလည်လွယ်တဲ့ (intuitive) declaration files တွေ ဘယ်လို ဖန်တီးမလဲ ပြသထားပါတယ်။

## [npm ပေါ် ဖြန့်ချိခြင်း (Publish to npm)](/docs/typescript/declaration-publishing)

[ဖြန့်ချိခြင်း (Publishing)](/docs/typescript/declaration-publishing) section က — သင့် declaration files တွေကို npm package အနေနဲ့ ဘယ်လို publish (ဖြန့်ချိ) လုပ်မလဲ၊ သင့် dependent packages တွေကို ဘယ်လို စီမံခန့်ခွဲရမလဲဆိုတာတွေကို ရှင်းပြထားပါတယ်။

## [Declaration Files ရှာဖွေခြင်းနှင့် တပ်ဆင်ခြင်း (Find and Install Declaration Files)](/docs/typescript/declaration-consumption)

JavaScript library သုံးစွဲသူတွေအတွက် — [သုံးစွဲခြင်း (Consumption)](/docs/typescript/declaration-consumption) section က သက်ဆိုင်ရာ declaration files တွေကို ရှာဖွေ install လုပ်ဖို့ ရိုးရှင်းတဲ့ အဆင့်အနည်းငယ်ကို ပေးထားပါတယ်။
