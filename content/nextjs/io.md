---
title: "io function (IO operations တွေကို static shell ကနေ ဖယ်ထုတ်ခြင်း)"
description: "io() — Cache Components ဖွင့်ထားချိန်မှာ new Date(), Math.random() လို synchronous values တွေကို static shell ထဲ မထည့်ဘဲ request တိုင်းအတွက် fresh ဖြစ်အောင် ပြုလုပ်နည်း; connection() နဲ့ ကွာခြားချက်"
order: 63
source: "https://nextjs.org/docs/app/api-reference/functions/io"
status: translated
updated: 2026-09-02
---

[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို ဖွင့်ထားတဲ့အခါ — `new Date()` (သို့) `Math.random()` လိုမျိုး synchronous value တစ်ခုကို visitor တိုင်းအတွက် တစ်ကြိမ်တည်း ဖမ်းယူပြီး ပြန်သုံးမလား၊ ဒါမှမဟုတ် request တစ်ခုစီအတွက် အသစ် ထုတ်ပေးမလားဆိုတာ Next.js က သင်ဆုံးဖြတ်ပေးဖို့ လိုပါတယ်။

Value ကို [static shell](https://nextjs.org/docs/app/glossary#static-shell) ထဲမှာ ဖမ်းယူချင်ရင် — [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) နဲ့ wrap လုပ်ပါ။ Static shell ထဲကနေ ဖယ်ထုတ်ချင်ရင်တော့ `await io()` ကို သုံးပါ — ဒါက prerendering လုပ်ချိန်မှာ suspend ဖြစ်စေပါတယ်။

Request တစ်ခုအတွင်း၊ cached scopes တွေထဲမှာ၊ browser ထဲမှာ၊ နဲ့ Cache Components မပါတဲ့ apps တွေ (Pages Router အပါအဝင်) မှာ — `io()` ခေါ်ရင် ချက်ချင်း resolve ဖြစ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

IO operation တစ်ခု လိုက်လာမယ်ဆိုတာကို Next.js ကို အသိပေးဖို့ `io()` ကို ခေါ်ပါ။

Server Component တစ်ခုထဲမှာ — `new Date()`, `Math.random()`, `crypto.randomUUID()`, (သို့) [`node:sqlite`](https://nodejs.org/api/sqlite.html) လိုမျိုး synchronous database driver တစ်ခုကို ဖတ်ခြင်း မတိုင်ခင် `await io()` ကို ခေါ်ပါ:

```tsx filename="app/page.tsx" highlight={13} switcher
import { Suspense } from 'react'
import { io } from 'next/cache'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CurrentTime />
    </Suspense>
  )
}

async function CurrentTime() {
  await io()
  return <p>{new Date().toISOString()}</p>
}
```

```jsx filename="app/page.js" highlight={13} switcher
import { Suspense } from 'react'
import { io } from 'next/cache'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CurrentTime />
    </Suspense>
  )
}

async function CurrentTime() {
  await io()
  return <p>{new Date().toISOString()}</p>
}
```

ဒီ route မှာ `CurrentTime` ကို `<Suspense>` boundary တစ်ခုနဲ့ wrap ထားပါတယ် — prerender လုပ်ချိန်မှာ `await io()` က suspend ဖြစ်ပြီး fallback က static shell ထဲမှာ ပါဝင်သွားပါတယ်။ တကယ်လို့ `CurrentTime` ကို [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) scope တစ်ခုအတွင်းမှာ render လုပ်မယ်ဆိုရင်တော့ — `io()` က no-op ဖြစ်ပြီး value ကို static shell ထဲမှာ ဖမ်းယူပြီး `<Suspense>` boundary ဘာမှ မလိုအပ်ပါဘူး။

Client Component တစ်ခုထဲမှာတော့ — `Date.now()` လိုမျိုး synchronous source တစ်ခုကို ဖတ်ခြင်း မတိုင်ခင် React ရဲ့ [`use`](https://react.dev/reference/react/use) hook နဲ့အတူ `io()` ကို ခေါ်ပါ။ Client Components တွေက SSR လုပ်ချိန် server ပေါ်မှာ prerender လုပ်ခံရပြီး — ဒီလိုမဟုတ်ရင် အဲဒီ read က static shell ထဲမှာ ပါဝင်သွားလို့ပါ:

```tsx filename="app/components.tsx" highlight={6} switcher
'use client'
import { use } from 'react'
import { io } from 'next/cache'

export function CurrentTime() {
  use(io())
  return <div>{Date.now()}</div>
}
```

```jsx filename="app/components.js" highlight={6} switcher
'use client'
import { use } from 'react'
import { io } from 'next/cache'

export function CurrentTime() {
  use(io())
  return <div>{Date.now()}</div>
}
```

## `io()` မလိုအပ်တဲ့ အခြေအနေများ

- Component က `cookies()` (သို့) `headers()` လိုမျိုး [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) တစ်ခုကို သုံးနေပြီးသားဆိုရင်။ Request-time API ကိုယ်တိုင်က suspension point ဖြစ်နေလို့ပါ။
- Data က `<Suspense>` နဲ့ wrap ထားတဲ့ awaited `fetch` (သို့) async database query တစ်ခုကနေ ရလာတယ်ဆိုရင်။ `await` ကိုယ်တိုင်က suspension point ဖြစ်နေလို့ပါ။

## `io()` က `connection()` နဲ့ ဘယ်လို ကွာခြားသလဲ

[`connection()`](/docs/nextjs/connection) function က ၎င်းနောက်မှာရှိတဲ့ code တွေကို static shell ကနေ ဖယ်ထုတ်ပေးပေမယ့် — user navigation အပြည့်အစုံက server ဆီ မရောက်မချင်း suspend ဖြစ်နေတာမို့ [prefetches](https://nextjs.org/docs/app/guides/prefetching) တွေကိုလည်း ပိတ်ဆို့ပါတယ်။ `io()` ကတော့ အခြား asynchronous function တွေလိုပဲ suspend ဖြစ်လို့ — ၎င်းနောက်က code တွေကို [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) နဲ့ wrap လုပ်ပြီး client ဘက်မှာ prefetch လုပ်ကာ cache လုပ်ထားနိုင်ပါတယ်။ `connection()` ထက် `io()` ကို ဦးစားပေးပါ — တကယ့် user request တစ်ခုကို စောင့်ဆိုင်းဖို့ လိုအပ်တဲ့အခါမှာပဲ `connection()` ကို သုံးပါ။

## Reference

### Type

```ts
function io(): Promise<void>
```

### Parameters

- ဒီ function က parameter ဘာမှ လက်မခံပါဘူး။

### Returns

`Promise<void>` တစ်ခု ပြန်ပေးပါတယ်။ Cache Components ဖွင့်ထားချိန်မှာ ဒီ promise ကို await လုပ်လိုက်ရင် prerendering ရပ်တန့်သွားပြီး — ၎င်းနောက်က code တွေက prerender output ကနေ ဖယ်ထုတ်ခံရပါတယ်။ အခြား context တိုင်း (တကယ့် requests, cache scopes, [`generateStaticParams`](/docs/nextjs/generate-static-params), browser, နဲ့ Cache Components မပါတဲ့ routes) မှာတော့ ချက်ချင်း resolve ဖြစ်ပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ    |
| --------- | -------------- |
| `v16.3.0` | `io` ကို ထည့်သွင်း။ |
