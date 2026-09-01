---
title: "Prefetching"
description: "preload API နဲ့ data ကြိုတင်ယူခြင်း — React ပြင်ပ/event/effect တွေမှာ၊ mutate နဲ့ prefetch၊ SSR/SSG data ကို fallbackData နဲ့ ပြခြင်း"
order: 9
source: "https://swr.vercel.app/docs/prefetching"
status: translated
updated: 2026-09-01
---

## preload — programmatic prefetch

SWR က `preload` API ကို ပေးထားပြီး — `preload(key, fetcher)` ပုံစံနဲ့ resource တွေကို ကြိုတင်ယူပြီး cache ထဲ သိမ်းပေးပါတယ်။ React ရဲ့ ပြင်ပကနေတောင် ခေါ်လို့ရပါတယ်:

```jsx
import { useState } from 'react'
import useSWR, { preload } from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

// User component ကို render မလုပ်ခင် resource ကို ကြိုတင်ယူထားမယ် —
// ဒါက app ထဲက waterfall တွေကို ကာကွယ်ပေးပါတယ်။
preload('/api/user', fetcher)

function User() {
  const { data } = useSWR('/api/user', fetcher)
  // ...
}

export default function App() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button onClick={() => setShow(true)}>Show User</button>
      {show ? <User /> : null}
    </div>
  )
}
```

ဒီလိုဆိုရင် — button နှိပ်ပြီး `User` ပေါ်လာတဲ့အခါ data က cache ထဲ အဆင်သင့် ရှိနေလို့ loading မစောင့်ရပါဘူး။

## Top-level data — `<link rel="preload">`

ထိပ်တန်း (top-level) request တွေအတွက် — browser ရဲ့ native `rel="preload"` ကို သုံးတာ အလွယ်ဆုံးပါ — HTML `<head>` ထဲမှာ `<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">` လို ထည့်လိုက်ရုံပါပဲ။ ဒါက HTML load ဖြစ်တာနဲ့ — JavaScript မဆင်းခင်ကတည်းက data ကို ကြိုတင်ယူပေးပြီး — URL တူတဲ့ fetch request အားလုံးက (SWR အပါအဝင်) အဲဒီရလဒ်ကို ပြန်သုံးပါတယ်။ မြန်ဆန်ပြီး native ဖြစ်လို့ — top-level data တွေအတွက် ဦးစားပေး သုံးသင့်ပါတယ်။

## Event / effect တွေမှာ prefetch

`preload` က React render tree ထဲမှာလည်း — event handler (ဥပမာ hover/focus) နဲ့ effect တွေထဲမှာ သုံးလို့ရပါတယ်:

```jsx
function App({ userId }) {
  const [show, setShow] = useState(false)

  // effect ထဲမှာ preload လုပ်ခြင်း
  useEffect(() => {
    preload('/api/user?id=' + userId, fetcher)
  }, [userId])

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        onMouseEnter={() => preload('/api/user?id=' + userId, fetcher)}
      >
        Show User
      </button>
      {show ? <User /> : null}
    </div>
  )
}
```

Mouse hover (mouse enter) ဖြစ်တာနဲ့ preload လုပ်ထားလို့ — user က click လုပ်တဲ့အခါ data အဆင်သင့် ရှိနေပါတယ်။ Focus ဖြစ်တာနဲ့ preload လုပ်ချင်ရင်လည်း `onFocus` handler ထဲမှာ အလားတူ ခေါ်လို့ရပါတယ်။ ဒါကို page prefetching (Next.js ရဲ့ `router.prefetch` လို) နဲ့ တွဲသုံးရင် — နောက် page ရော data ရော instant ပေါ်စေနိုင်ပါတယ်။

## Key အများကြီး prefetch လုပ်ခြင်း

Data အများကြီးကို ကြိုတင်ယူချင်ရင် — `preload` ကို key တစ်ခုချင်းစီအတွက် ခေါ်ပါတယ် — ဥပမာ `preload('/api/user', fetcher)` နဲ့ `preload('/api/movies', fetcher)` လို နှစ်ကြောင်း ဆက်ရေးလိုက်ရုံပါပဲ။ `preload` တစ်ခုချင်းစီက promise ပြန်တာမို့ — အားလုံး ပြီးတာကို စောင့်ချင်ရင် promise တွေရဲ့ array ကို `Promise.all([preload('/api/user', fetcher), preload('/api/movies', fetcher)])` လို ပုံစံနဲ့ တစ်ပြိုင်နက် စောင့်လို့လည်း ရပါတယ်။ Suspense mode မှာဆိုရင် — component ကို render မလုပ်ခင် preload လုပ်ထားမှ waterfall မဖြစ်အောင် ကာကွယ်လို့ရပါတယ်: render လုပ်တာနဲ့ `useSWR` hook တွေက suspend ဖြစ်ပေမယ့် — request တွေက preload ကြောင့် စပြီးသား ဖြစ်နေလို့ ဆင့်စောင့်စရာ မရှိတော့ပါဘူး။

## mutate နဲ့ prefetch

`preload` API ရှိလာခင် သုံးခဲ့ကြတဲ့ (ပြီးတော့ အခုလည်း အလုပ်လုပ်တဲ့) နည်းတစ်ခုက — global `mutate` ကို သုံးပြီး cache ထဲ data ကြိုထည့်တာပါ:

```js
import { useSWRConfig } from 'swr'

function App() {
  const { mutate } = useSWRConfig()

  // fetcher ရဲ့ promise resolve ဖြစ်တာနဲ့ — cache ထဲ data ဝင်သွားမယ်
  mutate('/api/user', fetcher('/api/user'))
}
```

`mutate` ရဲ့ ဒုတိယ argument အနေနဲ့ promise ပေးလိုက်ရင် — resolve ဖြစ်တာနဲ့ cache ထဲ အလိုအလျောက် ထည့်ပေးပါတယ်။ (mutate အကြောင်း အသေးစိတ်ကို [Data Fetching](/docs/swr/data-fetching) မှာ ကြည့်ပါ။)

## SSR/SSG — fallbackData

Server-side rendering (SSR) / static generation (SSG) ကရတဲ့ data ကို client ဘက်မှာ cache ထဲ ကြိုထည့်ထားနိုင်ပါတယ် — hook တစ်ခုချင်းအတွက် `fallbackData` option:

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

SWR က ဒီ key အတွက် fetch မလုပ်ရသေးရင် — `prefetchedData` ကို data အဖြစ် ချက်ချင်း ပြန်ပေးပါတယ်။ Hook အားလုံးအတွက် တစ်ပြိုင်နက် သတ်မှတ်ချင်ရင် — `SWRConfig` ရဲ့ `fallback` option ကို သုံးပါတယ် ([Global Configuration](/docs/swr/global-config) မှာ ကြည့်ပါ)။ Next.js နဲ့ SSG/SSR တွဲသုံးတာကို [Next.js မိတ်ဆက်](/docs/nextjs/getting-started) မှာ ဆက်ဖတ်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Global Configuration](/docs/swr/global-config) — SWRConfig နဲ့ fallback option
- [Pagination](/docs/swr/pagination) — နောက် page ကို ကြိုတင်ယူခြင်း (preload)
