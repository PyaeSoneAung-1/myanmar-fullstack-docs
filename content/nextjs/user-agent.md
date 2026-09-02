---
title: "userAgent (request ရဲ့ user agent object နဲ့ အလုပ်လုပ်ခြင်း)"
description: "userAgent helper — Web Request API ကို request ထဲက user agent object နဲ့ ဆက်သွယ်ဖို့ properties/methods အပိုတွေနဲ့ တိုးချဲ့ပေးပုံ; isBot, browser, device, engine, os, cpu အကြောင်း"
order: 65
source: "https://nextjs.org/docs/app/api-reference/functions/userAgent"
status: translated
updated: 2026-09-02
---

`userAgent` helper က [Web Request API](https://developer.mozilla.org/docs/Web/API/Request) ကို — request ထဲက user agent object နဲ့ ဆက်သွယ်ဖို့ properties နဲ့ methods အပိုတွေ ထည့်ပေးခြင်းဖြင့် တိုးချဲ့ပေးပါတယ်။

```ts filename="proxy.ts" switcher
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)

  // device.type can be: 'mobile', 'tablet', 'console', 'smarttv',
  // 'wearable', 'embedded', or undefined (for desktop browsers)
  const viewport = device.type || 'desktop'

  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

```js filename="proxy.js" switcher
import { NextResponse, userAgent } from 'next/server'

export function proxy(request) {
  const url = request.nextUrl
  const { device } = userAgent(request)

  // device.type can be: 'mobile', 'tablet', 'console', 'smarttv',
  // 'wearable', 'embedded', or undefined (for desktop browsers)
  const viewport = device.type || 'desktop'

  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

## `isBot`

Request တစ်ခုက သိထားတဲ့ (known) bot တစ်ခုဆီကလား ဆိုတာကို ဖော်ပြတဲ့ boolean တန်ဖိုးတစ်ခုပါ။

## `browser`

Request ထဲမှာ သုံးထားတဲ့ browser အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

- `name`: Browser ရဲ့ နာမည်ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် ခွဲခြားလို့မရရင် `undefined`။
- `version`: Browser ရဲ့ version ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် `undefined`။

## `device`

Request ထဲမှာ သုံးထားတဲ့ device အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

- `model`: Device ရဲ့ model ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် `undefined`။
- `type`: Device ရဲ့ type ကို ကိုယ်စားပြုတဲ့ string တစ်ခု — ဥပမာ `console`, `mobile`, `tablet`, `smarttv`, `wearable`, `embedded`, ဒါမှမဟုတ် `undefined`။
- `vendor`: Device ရဲ့ vendor (ထုတ်လုပ်သူ) ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် `undefined`။

## `engine`

Browser ရဲ့ engine အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

- `name`: Engine ရဲ့ နာမည်ကို ကိုယ်စားပြုတဲ့ string တစ်ခု။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့: `Amaya`, `Blink`, `EdgeHTML`, `Flow`, `Gecko`, `Goanna`, `iCab`, `KHTML`, `Links`, `Lynx`, `NetFront`, `NetSurf`, `Presto`, `Tasman`, `Trident`, `w3m`, `WebKit` (သို့) `undefined`။
- `version`: Engine ရဲ့ version ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် `undefined`။

## `os`

Operating system အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

- `name`: OS ရဲ့ နာမည်ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် `undefined`။
- `version`: OS ရဲ့ version ကို ကိုယ်စားပြုတဲ့ string တစ်ခု၊ ဒါမှမဟုတ် `undefined`။

## `cpu`

CPU architecture အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

- `architecture`: CPU ရဲ့ architecture ကို ကိုယ်စားပြုတဲ့ string တစ်ခု။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့: `68k`, `amd64`, `arm`, `arm64`, `armhf`, `avr`, `ia32`, `ia64`, `irix`, `irix64`, `mips`, `mips64`, `pa-risc`, `ppc`, `sparc`, `sparc64` (သို့) `undefined`
