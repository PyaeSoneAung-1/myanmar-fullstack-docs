---
title: "Suspense"
description: "React Suspense နဲ့ SWR တွဲသုံးခြင်း — suspense option ဖွင့်နည်း၊ error boundary သုံးပုံ၊ conditional fetching နဲ့ server-side rendering မှာ သတိထားရမှာများ"
order: 13
source: "https://swr.vercel.app/docs/suspense"
status: translated
updated: 2026-09-01
---

SWR ကို React [Suspense](https://react.dev/reference/react/Suspense) နဲ့ တွဲသုံးဖို့ `suspense` option ကို ဖွင့်နိုင်ပါတယ်:

```jsx
import { Suspense } from 'react'
import useSWR from 'swr'

function Profile () {
  const { data } = useSWR('/api/user', fetcher, { suspense: true })
  return <div>hello, {data.name}</div>
}

function App () {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Profile/>
    </Suspense>
  )
}
```

> မှတ်ချက်: `suspense` option က component ရဲ့ lifecycle ထဲမှာ ပြောင်းလဲခွင့် မရှိပါဘူး။

Suspense mode မှာ — `data` က အမြဲတမ်း fetch response ဖြစ်နေတာမို့ (undefined လား မလား စစ်စရာ မလိုပါဘူး)။ ဒါပေမယ့် error ဖြစ်ခဲ့ရင်တော့ — အဲဒါကို ဖမ်းဖို့ [error boundary](https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors) သုံးဖို့ လိုပါတယ်:

```jsx
<ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
  <Suspense fallback={<h1>Loading posts...</h1>}>
    <Profile />
  </Suspense>
</ErrorBoundary>
```

> Suspense mode က data အဆင်သင့် မဖြစ်မချင်း rendering ကို ဆိုင်းငံ့ (suspend) ထားတာမို့ — waterfall (ဆင့်ဆင့် စောင့်နေရတဲ့) ပြဿနာတွေ အလွယ်တကူ ဖြစ်စေနိုင်ပါတယ်။ ဒါကို ရှောင်ဖို့ — rendering မလုပ်ခင် resource တွေကို ကြိုတင်ယူ (prefetch) ထားသင့်ပါတယ်။ [အသေးစိတ်](/docs/swr/prefetching)

---

### မှတ်ချက်: Conditional Fetching နဲ့ တွဲသုံးခြင်း

သာမန်အားဖြင့် — `suspense` ဖွင့်ထားရင် `data` က render လုပ်တဲ့အခါ အမြဲ အဆင်သင့် ဖြစ်နေမယ်လို့ အာမခံပါတယ်:

```jsx
function Profile () {
  const { data } = useSWR('/api/user', fetcher, { suspense: true })

  // `data` က ဘယ်တော့မှ `undefined` ဖြစ်မှာ မဟုတ်ပါဘူး
  // ...
}
```

ဒါပေမယ့် — conditional fetching သို့မဟုတ် dependent fetching နဲ့ တွဲသုံးတဲ့အခါ — request က **paused** ဖြစ်နေရင် `data` က `undefined` ဖြစ်နေပါမယ်:

```jsx
function Profile () {
  const { data } = useSWR(isReady ? '/api/user' : null, fetcher, { suspense: true })

  // `isReady` က false ဆိုရင် `data` က `undefined` ဖြစ်နေပါမယ်
  // ...
}
```

ဒီကန့်သတ်ချက်ရဲ့ နည်းပညာပိုင်း အသေးစိတ်တွေ ထပ်ဖတ်ချင်ရင် [ဒီ discussion](https://github.com/vercel/swr/pull/357#issuecomment-627089889) ကို ကြည့်ပါ။

### Server-Side Rendering

Server-side (Next.js မှာ pre-rendering လုပ်တာ အပါအဝင်) မှာ suspense mode သုံးတဲ့အခါ — [fallbackData သို့မဟုတ် fallback](/docs/swr/with-nextjs#pre-rendering-with-default-data) ကနေ initial data ပေးဖို့ **မဖြစ်မနေ လိုအပ်ပါတယ်**။ ဆိုလိုတာက — server side မှာ `Suspense` ကို သုံးပြီး data fetch လုပ်လို့ မရပါဘူး — client-side data fetching အပြည့်အစုံ လုပ်ရမှာ ဒါမှမဟုတ် framework level ရဲ့ data fetching method တွေ (Next.js ရဲ့ getStaticProps လို) ကနေ fetch လုပ်ရမှာပါ။ နောက်ထပ် discussion တွေကို [ဒီနေရာ](https://github.com/vercel/swr/issues/1906) မှာ ဖတ်နိုင်ပါတယ်။
