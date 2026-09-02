---
title: "src Folder (application code များကို src အောက်တွင် ထားခြင်း)"
description: "Special Next.js app (သို့) pages directories တွေကို project root မှာ ထားမယ့်အစား — src/app (သို့) src/pages အဖြစ် src folder အောက်မှာ ထားနိုင်ပုံ; config files နဲ့ /public နေရာချထားမှုဆိုင်ရာ သိထားသင့်ချက်များ"
order: 105
source: "https://nextjs.org/docs/app/api-reference/file-conventions/src-folder"
status: translated
updated: 2026-09-02
---

သင့် project ရဲ့ root မှာ special Next.js `app` (သို့) `pages` directories တွေ ထားမယ့်အစား — Next.js က application code တွေကို `src` folder အောက်မှာ ထားတဲ့ အသုံးများတဲ့ pattern ကိုလည်း ထောက်ပံ့ပါတယ်။

ဒါက application code နဲ့ — project တစ်ခုရဲ့ root မှာ အများအားဖြင့် ရှိတတ်တဲ့ — project configuration files တွေကို ခွဲခြားပေးပါတယ်။ ဒါက လူတချို့နဲ့ team တချို့ နှစ်သက်တဲ့ ပုံစံတစ်ခုပါ။

`src` folder ကို သုံးဖို့ — `app` Router folder (သို့) `pages` Router folder ကို `src/app` (သို့) `src/pages` ဆီ အသီးသီး ရွှေ့ပါ။

> **သိထားသင့်သည်:**
>
> - `/public` directory က သင့် project ရဲ့ root မှာ ဆက်ရှိနေရပါမယ်။
> - `package.json`, `next.config.js` နဲ့ `tsconfig.json` လို config files တွေက root မှာ ဆက်ရှိနေရပါမယ်။
> - `.env.*` files တွေက root မှာ ဆက်ရှိနေရပါမယ်။
> - Root directory ထဲမှာ `app` (သို့) `pages` ရှိနေရင် — `src/app` (သို့) `src/pages` ကို ignore လုပ်ပါလိမ့်မယ်။
> - `src` သုံးနေရင် — `/components` (သို့) `/lib` လို application folders တွေကိုပါ ရွှေ့ဖို့ ဖြစ်နိုင်ပါတယ်။
> - Proxy သုံးနေရင် — `src` folder ရဲ့ အတွင်းမှာ ထားဖို့ သေချာပါစေ။
> - Tailwind CSS သုံးနေရင် — `tailwind.config.js` file ရဲ့ [content section](https://tailwindcss.com/docs/content-configuration) ထဲမှာ `/src` prefix ထည့်ဖို့ လိုအပ်ပါတယ်။
> - `@/*` လို imports တွေအတွက် TypeScript paths သုံးနေရင် — `tsconfig.json` ထဲက `paths` object ကို `src/` ပါဝင်အောင် update လုပ်သင့်ပါတယ်။
