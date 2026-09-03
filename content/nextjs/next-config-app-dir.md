---
title: "appDir (App Router ဖွင့်ရန် သတ်မှတ်ချက်)"
description: "appDir option — App Router ၏ layouts, Server Components, streaming, colocated data fetching ပံ့ပိုးမှုများကို ဖွင့်ပေးသော သတ်မှတ်ချက်; React Strict Mode ကို အလိုအလျောက် ဖွင့်ပေးပြီး Next.js 13.4 မှစ၍ မလိုအပ်တော့သော legacy option"
order: 190
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/appDir"
status: translated
updated: 2026-09-03
---

> **သိထားသင့်သည် (Good to know):** ဒီ option က Next.js 13.4 ကစပြီး **မလိုအပ်တော့ပါဘူး**။ App Router က အခုဆိုရင် stable ဖြစ်နေပါပြီ။

App Router ([`app` directory](https://nextjs.org/docs/app)) က [layouts](/docs/nextjs/file-conventions-layout) တွေ၊ [Server Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) တွေ၊ [streaming](/docs/nextjs/file-conventions-loading) နဲ့ [colocated data fetching](https://nextjs.org/docs/app/getting-started/fetching-data) (component တည်ရှိရာ နေရာမှာပဲ ဒေတာ ယူခြင်း) တို့အတွက် ပံ့ပိုးမှုကို ဖွင့်ပေးပါတယ်။

`app` directory ကို သုံးခြင်းက [React Strict Mode](https://react.dev/reference/react/StrictMode) ကို အလိုအလျောက် ဖွင့်ပေးပါတယ်။ [`app` router ကို တဖြည်းဖြည်းချင်း စတင် အသုံးပြုခြင်း](https://nextjs.org/docs/app/guides/migrating/app-router-migration#migrating-from-pages-to-app) အကြောင်း လေ့လာကြည့်ပါ။
