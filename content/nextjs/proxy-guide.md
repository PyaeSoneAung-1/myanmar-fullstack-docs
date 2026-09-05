---
title: "Proxy (request မပြီးဆုံးခင် code များ run လုပ်ခြင်း)"
description: "Next.js 16 မှာ Middleware အစား နာမည်ပြောင်းလာတဲ့ Proxy — request မပြီးဆုံးခင် code run လုပ်ပြီး rewriting, redirecting, header ပြုပြင်ခြင်း စသည်ဖြင့် response ကို ပြောင်းလဲခြင်း; ဘယ်အခါ သုံးသင့်လဲ၊ proxy.ts ဖိုင် ဖန်တီးပုံနဲ့ matcher စစ်ထုတ်မှု"
order: 262
source: "https://nextjs.org/docs/app/getting-started/proxy"
status: translated
updated: 2026-09-05
---

## Proxy

> **သိထားသင့်သည်**: Next.js 16 ကစပြီး Middleware ကို — ၎င်းရဲ့ ရည်ရွယ်ချက်ကို ပိုမိုကောင်းမွန်စွာ ဖော်ပြနိုင်စေဖို့ — Proxy လို့ ပြောင်းလဲခေါ်ဆိုလာပါပြီ။ လုပ်ဆောင်ချက်တွေကတော့ အတူတူပဲ ဖြစ်ပါတယ်။

Proxy က request တစ်ခု မပြီးဆုံးခင် code တွေ run လုပ်နိုင်စေပါတယ်။ ပြီးတော့ — incoming request (ဝင်လာတဲ့ request) ပေါ်မူတည်ပြီး — rewriting လုပ်ခြင်း၊ redirecting လုပ်ခြင်း၊ request (သို့) response headers တွေကို ပြုပြင်ခြင်း၊ (သို့) တိုက်ရိုက် response ပြန်ပို့ခြင်း စတာတွေနဲ့ response ကို ပြောင်းလဲနိုင်ပါတယ်။

### အသုံးပြုသည့် အခြေအနေများ (Use cases)

Proxy က ထိရောက်မှုရှိတဲ့ သာမန် အခြေအနေအချို့ ပါဝင်ပါတယ်:

- Pages အားလုံး (သို့) pages အစိတ်အပိုင်းတစ်ခုအတွက် headers တွေကို ပြုပြင်ခြင်း
- A/B tests (သို့) experiments တွေပေါ်မူတည်ပြီး မတူညီတဲ့ pages တွေဆီ rewriting လုပ်ခြင်း
- Incoming request ရဲ့ properties တွေကို အခြေခံတဲ့ programmatic redirects (ပရိုဂရမ်ဖြင့် ပြန်ညွှန်ခြင်း)

ရိုးရှင်းတဲ့ redirects တွေအတွက်ဆိုရင် — `next.config.ts` ထဲက [`redirects`](/docs/nextjs/next-config-redirects) configuration ကို အရင်ဆုံး စဉ်းစားပါ။ Request data တွေကို ဝင်ရောက်ဖတ်ရှုဖို့ (သို့) ပိုရှုပ်ထွေးတဲ့ logic တွေ လိုအပ်တဲ့အခါမှာတော့ Proxy ကို သုံးသင့်ပါတယ်။

Proxy က နှေးကွေးတဲ့ data fetching တွေအတွက် ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ Permission-based redirects လိုမျိုး [optimistic checks](/docs/nextjs/authentication#optimistic-checks-with-proxy-optional) (ဦးစွာ ယူဆ၍ စစ်ဆေးခြင်း) တွေမှာ Proxy က အသုံးဝင်နိုင်ပေမယ့် — full session management (သို့) authorization ဖြေရှင်းနည်း (solution) အဖြစ်တော့ သုံးလို့ မရပါဘူး။

`options.cache`, `options.next.revalidate` (သို့) `options.next.tags` တွေနဲ့ fetch သုံးတာက Proxy ထဲမှာ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

### Convention (စည်းမျဉ်း)

Project root မှာ (သို့) သက်ဆိုင်ရာ `src` သုံးတယ်ဆိုရင် `src` ထဲမှာ — `pages` (သို့) `app` နဲ့ တစ်ဆင့်တူ (အဆင့်တူ) နေရာမှာ ရှိစေဖို့ `proxy.ts` (သို့ `.js`) file တစ်ခုကို ဖန်တီးပါ။

> **မှတ်ချက်**: Project တစ်ခုမှာ `proxy.ts` file တစ်ခုတည်းပဲ ထောက်ပံ့ပေးပေမယ့် — သင့် proxy logic တွေကို modules တွေအဖြစ် ခွဲထားလို့တော့ ရပါသေးတယ်။ Proxy လုပ်ဆောင်ချက်တွေကို သီးခြား `.ts` (သို့) `.js` files တွေထဲ ခွဲထုတ်ပြီး — သင့် main `proxy.ts` file ထဲကို import လုပ်နိုင်ပါတယ်။ ဒါက route-specific proxy တွေကို `proxy.ts` ထဲမှာ စုစည်းပြီး ဗဟိုမှ ထိန်းချုပ်နိုင်တာမို့ — ပိုရှင်းလင်းတဲ့ စီမံခန့်ခွဲမှုကို ရစေပါတယ်။ Proxy file တစ်ခုတည်းကို သတ်မှတ်တာက configuration ကို ရိုးရှင်းစေပြီး — ဖြစ်နိုင်ခြေရှိတဲ့ conflicts တွေကို ကာကွယ်ကာ — proxy layers အများအပြား ရှိနေတာကို ရှောင်ရှားခြင်းဖြင့် performance ကိုပါ optimize လုပ်ပေးပါတယ်။

### ဥပမာ (Example)

သင့် proxy function ကို default export (သို့) named `proxy` export အနေနဲ့ export လုပ်နိုင်ပါတယ်:

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// အတွင်းမှာ `await` သုံးမယ်ဆိုရင် ဒီ function ကို `async` လို့ မှတ်သားလို့ရပါတယ်
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// တစ်နည်းအားဖြင့် — default export တစ်ခုလည်း သုံးနိုင်ပါတယ်:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: '/about/:path*',
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

// အတွင်းမှာ `await` သုံးမယ်ဆိုရင် ဒီ function ကို `async` လို့ မှတ်သားလို့ရပါတယ်
export function proxy(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// တစ်နည်းအားဖြင့် — default export တစ်ခုလည်း သုံးနိုင်ပါတယ်:
// export default function proxy(request) { ... }

export const config = {
  matcher: '/about/:path*',
}
```

`matcher` config က Proxy ကို သီးခြား paths တွေမှာပဲ run ဖို့ စစ်ထုတ်နိုင်စေပါတယ်။ Path matching (လမ်းကြောင်း ကိုက်ညီမှု) အကြောင်း အသေးစိတ်အတွက် [Matcher](/docs/nextjs/file-conventions-proxy#matcher) documentation ကို ကြည့်ပါ။

[`proxy` အသုံးပြုခြင်း](/docs/nextjs/backend-for-frontend#proxy) အကြောင်း ဆက်ဖတ်ပါ (သို့) `proxy` ရဲ့ [API reference](/docs/nextjs/file-conventions-proxy) ကို ကိုးကားပါ။
