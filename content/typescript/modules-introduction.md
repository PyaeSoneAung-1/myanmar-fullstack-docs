---
title: "Modules: Introduction (Modules မိတ်ဆက်)"
description: "TypeScript modules handbook ရဲ့ မိတ်ဆက် — theory ၊ guides ၊ reference နဲ့ appendices section လေးခုက ဘာတွေ ပါဝင်သလဲဆိုတဲ့ ခြုံငုံ ရှင်းလင်းချက်"
order: 48
source: "https://www.typescriptlang.org/docs/handbook/modules/introduction.html"
status: translated
updated: 2026-09-05
---

ဒီ document ကို section လေးခု ခွဲထားပါတယ်:

1. ပထမ section က — TypeScript က modules တွေကို ဘယ်လို ချဉ်းကပ်သလဲဆိုတဲ့ [**theory** (သီအိုရီ)](/docs/typescript/modules-theory) ရဲ့ နောက်ကွယ်က အကြောင်းတရားတွေကို တည်ဆောက် ရှင်းပြပေးပါတယ်။ ဘယ် situation အတွက်မဆို မှန်ကန်တဲ့ module-related compiler options တွေကို ရေးနိုင်ချင်တယ် ၊ TypeScript ကို တခြား tools တွေနဲ့ ဘယ်လို ပေါင်းစပ်မလဲ ဆိုတာ တွေးတောချင်တယ် ၊ ဒါမှမဟုတ် TypeScript က dependency packages တွေကို ဘယ်လို process လုပ်လဲ နားလည်ချင်တယ်ဆိုရင် — ဒီကနေ စတင်သင့်ပါတယ်။ ဒီ topics တွေအတွက် guides ရော reference pages တွေရော ရှိတယ်ဆိုပေမယ့် — အဲဒီအခြေခံသဘောတရားတွေကို နားလည်ထားခြင်းက guides တွေကို ဖတ်ရတာ ပိုလွယ်ကူစေပြီး — ဒီမှာ အတိအကျ မဖော်ပြထားတဲ့ လက်တွေ့ကမ္ဘာ့ ပြဿနာတွေကို ကိုင်တွယ်ဖို့ စိတ်ပိုင်းဆိုင်ရာ မူဘောင် (mental framework) တစ်ခုလည်း ရရှိစေပါတယ်။
2. [**guides** (လမ်းညွှန်များ)](/docs/typescript/modules-choosing-compiler-options) တွေက — project အသစ်တစ်ခုအတွက် မှန်ကန်တဲ့ compilation settings တွေ ရွေးချယ်ခြင်းကအစ — လက်တွေ့ကမ္ဘာမှာ လုပ်ရလေ့ရှိတဲ့ အလုပ်တွေကို ဘယ်လို ပြီးမြောက်အောင် လုပ်ရမလဲဆိုတာ ပြသပါတယ်။ အမြန်ဆုံး စတင်လိုတဲ့ beginner တွေအတွက်ရော — theory ကို ကောင်းကောင်း နားလည်ထားပေမယ့် ရှုပ်ထွေးတဲ့ အလုပ်တစ်ခုအတွက် တိကျတဲ့ လမ်းညွှန်ချက် လိုချင်နေတဲ့ expert တွေအတွက်ပါ guides တွေက စတင်ဖို့ သင့်တော်တဲ့ နေရာတစ်ခု ဖြစ်ပါတယ်။
3. [**reference** (ရည်ညွှန်း)](/docs/typescript/modules-reference) section က ရှေ့ section တွေမှာ တင်ပြခဲ့တဲ့ syntaxes နဲ့ configurations တွေကို ပိုပြီး အသေးစိတ် ကြည့်ရှုနိုင်အောင် ဖော်ပြပေးပါတယ်။
4. [**appendices** (နောက်ဆက်တွဲများ)](/docs/typescript/modules-esm-cjs-interop) တွေက — theory ဒါမှမဟုတ် reference sections တွေထက် ပိုပြီး အသေးစိတ် ရှင်းပြဖို့ ထိုက်တန်တဲ့ ရှုပ်ထွေးတဲ့ topics တွေကို လွှမ်းခြုံ ဖော်ပြပါတယ်။
