---
title: "middleware.js (deprecated — proxy.js သို့ အမည်ပြောင်း)"
description: "middleware.js file convention — Next.js 16 မှာ deprecated ဖြစ်ပြီး proxy.js အဖြစ် အမည်ပြောင်းလဲ; functionality အားလုံး အတူတူ၊ middleware-to-proxy codemod နဲ့ အလိုအလျောက် migrate လုပ်နည်း"
order: 76
source: "https://nextjs.org/docs/app/api-reference/file-conventions/middleware"
status: translated
updated: 2026-09-02
---

`middleware.js` file convention ကို Next.js 16 မှာ **deprecated** လုပ်လိုက်ပြီး — [`proxy.js`](/docs/nextjs/file-conventions-proxy) ဆိုပြီး အမည်ပြောင်းလိုက်ပါပြီ။

Functionality အားလုံးကတော့ အတူတူပဲ ဖြစ်ပါတယ် — file name ရော export name ပဲ ပြောင်းသွားတာပါ။ ဘယ်လို migrate လုပ်ရမလဲ အသေးစိတ်အတွက် [Migration to Proxy](/docs/nextjs/file-conventions-proxy#migration-to-proxy) section ကို ကြည့်ပါ။

အောက်ပါ command ကို run ပြီး အလိုအလျောက် migrate လုပ်နိုင်ပါတယ်:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

အပြည့်အစုံ documentation အတွက် [`proxy.js` API reference](/docs/nextjs/file-conventions-proxy) ကို ကြည့်ပါ။
