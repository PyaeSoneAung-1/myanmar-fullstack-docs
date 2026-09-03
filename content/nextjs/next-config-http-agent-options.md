---
title: "httpAgentOptions (HTTP Keep-Alive သတ်မှတ်ချက်)"
description: "httpAgentOptions option — Node.js 18 မတိုင်မီ ဗားရှင်းများတွင် `fetch()` ခေါ်ဆိုမှုများအတွက် default HTTP Keep-Alive ကို ပိတ်ရန် သတ်မှတ်ချက်"
order: 156
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/httpAgentOptions"
status: translated
updated: 2026-09-03
---

Node.js 18 မတိုင်မီက versions တွေမှာ — Next.js က `fetch()` ကို [undici](https://nextjs.org/docs/architecture/supported-browsers#polyfills) နဲ့ အလိုအလျောက် polyfill လုပ်ပြီး [HTTP Keep-Alive](https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive) ကို default အားဖြင့် ဖွင့်ပေးပါတယ်။

Server-side မှာရှိတဲ့ `fetch()` ခေါ်ဆိုမှုတွေ အားလုံးအတွက် HTTP Keep-Alive ကို ပိတ်ချင်ရင် — `next.config.js` ကို ဖွင့်ပြီး `httpAgentOptions` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  httpAgentOptions: {
    keepAlive: false,
  },
}
```
