---
title: "assetPrefix (CDN assets)"
description: "assetPrefix option — JavaScript/CSS assets များကို CDN မှ serve လုပ်ရန် prefix သတ်မှတ်ချက်; `.next/static` ကို CDN ပေါ်တွင် တင်ခြင်း"
order: 87
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်:** [Vercel မှာ deploy လုပ်ခြင်း](/docs/nextjs/deploying) က သင့် Next.js project အတွက် global CDN တစ်ခုကို အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။ Asset Prefix တစ်ခုကို ကိုယ်တိုင် သတ်မှတ်စရာ မလိုပါဘူး။

> **သိထားသင့်သည်:** Next.js 9.5+ ကစပြီး customize လုပ်လို့ရတဲ့ [Base Path](/docs/nextjs/next-config-base-path) ကို ထောက်ပံ့ပေးပါတယ် — `/docs` လိုမျိုး sub-path တစ်ခုမှာ application ကို host လုပ်ဖို့ ဒါက ပိုသင့်တော်ပါတယ်။ ဒီလို အသုံးပြုမှုအတွက် custom Asset Prefix ကို သုံးဖို့ အကြံ မပြုပါဘူး။

## CDN တစ်ခု သတ်မှတ်ခြင်း

[CDN](https://en.wikipedia.org/wiki/Content_delivery_network) တစ်ခု သတ်မှတ်ဖို့ — asset prefix တစ်ခု ထားရှိပြီး CDN ရဲ့ origin က Next.js ကို host လုပ်ထားတဲ့ domain ဆီ resolve လုပ်အောင် configure လုပ်နိုင်ပါတယ်။

`next.config.mjs` ကို ဖွင့်ပြီး [phase](https://nextjs.org/docs/app/api-reference/config/next-config-js#async-configuration) ပေါ် မူတည်ပြီး `assetPrefix` config ထည့်ပါ:

```js filename="next.config.mjs"
// @ts-check
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    assetPrefix: isDev ? undefined : 'https://cdn.mydomain.com',
  }
  return nextConfig
}
```

Next.js က `/_next/` path (`.next/static/` folder) ကနေ load လုပ်တဲ့ JavaScript နဲ့ CSS files တွေအတွက် သင့် asset prefix ကို အလိုအလျောက် သုံးပါလိမ့်မယ်။ ဥပမာ — အထက်ပါ configuration နဲ့ဆို အောက်ပါ JS chunk အတွက် request က:

```
/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

ဒီလို ဖြစ်သွားပါလိမ့်မယ်:

```
https://cdn.mydomain.com/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

Files တွေကို သတ်မှတ်ထားတဲ့ CDN တစ်ခုဆီ upload လုပ်ဖို့ အတိအကျ configuration ကတော့ သင်ရွေးချယ်တဲ့ CDN ပေါ် မူတည်ပါတယ်။ CDN ပေါ်မှာ host လုပ်ဖို့ လိုအပ်တဲ့ folder တစ်ခုတည်းကတော့ `.next/static/` ရဲ့ contents တွေပဲ ဖြစ်ပါတယ် — အထက်ပါ URL request မှာ ပြထားသလို `_next/static/` အဖြစ် upload လုပ်သင့်ပါတယ်။ သင့် `.next/` folder ရဲ့ ကျန် အစိတ်အပိုင်းတွေကို **upload မလုပ်ပါနဲ့** — server code တွေနဲ့ အခြား configuration တွေကို public မဖြစ်အောင် ထားသင့်လို့ပါ။

`assetPrefix` က `_next/static` ဆီ requests တွေကို ဖုံးအုပ်ပေးပေမယ့် — အောက်ပါ path တွေကိုတော့ သက်ရောက်မှု မရှိပါဘူး:

- [public](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) folder ထဲက files တွေ — အဲဒီ assets တွေကို CDN ကနေ serve လုပ်ချင်ရင် prefix ကို ကိုယ်တိုင် ထည့်ပေးရပါမယ်။
