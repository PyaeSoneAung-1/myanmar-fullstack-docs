---
title: "proxyClientMaxBodySize (proxy body အရွယ်အစား ကန့်သတ်ချက်)"
description: "experimental.proxyClientMaxBodySize option — proxy အသုံးပြုစဉ် မှတ်ဉာဏ်ထဲ buffer လုပ်ထားသော request body အတွက် အများဆုံး အရွယ်အစား ကန့်သတ်ချက်; string ('1mb') (သို့) bytes (number) ဖြင့် သတ်မှတ်နိုင်; default 10MB, ကျော်လွန်လျှင် partial body သာ ရရှိပြီး warning ပေး"
order: 214
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/proxyClientMaxBodySize"
status: translated
updated: 2026-09-03
---

Proxy သုံးတဲ့အခါ — Next.js က request body ကို အလိုအလျောက် clone လုပ်ပြီး multiple reads (proxy ရော အောက်ခံ route handler ရော နှစ်ခုလုံးမှာ ဖတ်လို့ရအောင်) ဖြစ်စေဖို့ memory ထဲ buffer လုပ်ပါတယ်။ Memory သုံးစွဲမှု အလွန်အကျွံ မဖြစ်စေဖို့ — ဒီ configuration option က buffered body ရဲ့ အရွယ်အစား ကန့်သတ်ချက် (limit) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။

Default အားဖြင့် body ရဲ့ အများဆုံး အရွယ်အစားက **10MB** ပါ။ Request body က ဒီ limit ကို ကျော်လွန်ရင် — body ကို limit အထိပဲ buffer လုပ်ပြီး — ဘယ် route က limit ကျော်သွားလဲ ဖော်ပြတဲ့ warning တစ်ခုကို log လုပ်ပါတယ်။

## Options

### String format (string ပုံစံ — အကြံပြုသည်)

အရွယ်အစားကို လူဖတ်လို့ရတဲ့ (human-readable) string format နဲ့ သတ်မှတ်ပါ:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: '1mb',
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: '1mb',
  },
}

module.exports = nextConfig
```

သုံးလို့ရတဲ့ units တွေက: `b`, `kb`, `mb`, `gb` ဖြစ်ပါတယ်။

### Number format (number ပုံစံ)

တနည်းအားဖြင့် — အရွယ်အစားကို number အနေနဲ့ bytes နဲ့ သတ်မှတ်လို့လည်း ရပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: 1048576, // 1MB ကို bytes နဲ့
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: 1048576, // 1MB ကို bytes နဲ့
  },
}

module.exports = nextConfig
```

## အပြုအမူ (Behavior)

Request body က သတ်မှတ်ထားတဲ့ limit ကို ကျော်လွန်တဲ့အခါ:

1. Next.js က ပထမ N bytes (limit အထိ) ကိုပဲ buffer လုပ်ပါတယ်
2. Limit ကျော်သွားတဲ့ route ကို ဖော်ပြတဲ့ warning တစ်ခုကို console မှာ log လုပ်ပါတယ်
3. Request က ပုံမှန်အတိုင်း ဆက်လုပ်ဆောင်ပေမယ့် — body ရဲ့ တစ်စိတ်တစ်ပိုင်း (partial body) ပဲ ရရှိနိုင်ပါတယ်
4. Request က **fail (သို့) client ဆီ error ပြန်ပို့တာ မဖြစ်ပါဘူး**

သင့် application က request body တစ်ခုလုံး လုပ်ဆောင်ဖို့ လိုအပ်ရင် — အောက်ပါတွေထဲက တစ်ခုခု လုပ်သင့်ပါတယ်:

- `proxyClientMaxBodySize` limit ကို တိုးပေးခြင်း
- သင့် application logic ထဲမှာ partial body ကို ချောမွေ့စွာ handle လုပ်ခြင်း

## ဥပမာ (Example)

```ts filename="proxy.ts"
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  // Next.js က သတ်မှတ်ထားတဲ့ size limit နဲ့ body ကို အလိုအလျောက် buffer လုပ်ပါတယ်
  // proxy ထဲမှာ body ကို ဖတ်လို့ ရပါတယ်...
  const body = await request.text()

  // Body က limit ကျော်သွားရင် — partial data ပဲ ရနိုင်ပါတယ်
  console.log('Body size:', body.length)

  return NextResponse.next()
}
```

```ts filename="app/api/upload/route.ts"
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // ...ပြီးတော့ body က သင့် route handler ထဲမှာလည်း ဆက်ရရှိနေပါတယ်
  const body = await request.text()

  console.log('Body in route handler:', body.length)

  return NextResponse.json({ received: body.length })
}
```

## သိထားသင့်သည် (Good to know)

- ဒီ setting က သင့် application မှာ proxy သုံးတဲ့အခါမှပဲ သက်ရောက်ပါတယ်
- Default 10MB limit က memory usage နဲ့ ပုံမှန် use cases တွေကို ချိန်ခွင်လျှာ ညှိဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်
- Limit က request တစ်ခုချင်းစီအလိုက် (per-request) သက်ရောက်ပြီး — concurrent requests အားလုံးအတွက် တစ်ပြိုင်နက် (globally) မဟုတ်ပါဘူး
- File upload အကြီးကြီးတွေ handle လုပ်တဲ့ applications တွေအတွက် — limit ကို လိုက်လျောညီထွေ တိုးပေးဖို့ စဉ်းစားပါ
