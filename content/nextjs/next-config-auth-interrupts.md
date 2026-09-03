---
title: "authInterrupts (forbidden နှင့် unauthorized APIs အတွက် သတ်မှတ်ချက်)"
description: "authInterrupts option — `forbidden` (ခွင့်မပြုသည့် အခြေအနေ) နှင့် `unauthorized` (ခွင့်ပြုချက်မရှိသည့် အခြေအနေ) APIs များကို အသုံးပြုနိုင်ရန် ဖွင့်ပေးသော configuration; ယင်းတို့ experimental ဖြစ်စဉ် next.config.js တွင် experimental.authInterrupts: true သတ်မှတ်ရန် လိုအပ်"
order: 162
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts"
status: translated
updated: 2026-09-03
---

`authInterrupts` configuration option က သင့် application ထဲမှာ [`forbidden`](/docs/nextjs/forbidden) နဲ့ [`unauthorized`](/docs/nextjs/unauthorized) APIs တွေကို သုံးနိုင်အောင် ခွင့်ပြုပေးပါတယ်။ ဒီ functions တွေက experimental ဖြစ်နေတုန်း ဖြစ်တာမို့ — ၎င်းတို့ကို သုံးဖို့အတွက် သင့် `next.config.js` file ထဲမှာ `authInterrupts` option ကို ဖွင့်ထားရပါမယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  experimental: {
    authInterrupts: true,
  },
}
```
