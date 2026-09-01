---
title: "Performance"
description: "SWR ရဲ့ performance optimization များ — deduplication နဲ့ network request လျှော့ချခြင်း၊ deep comparison နဲ့ re-render ရှောင်ခြင်း၊ dependency collection နဲ့ tree shaking"
order: 17
source: "https://swr.vercel.app/docs/advanced/performance"
status: translated
updated: 2026-09-01
---

SWR က web app အမျိုးမျိုးမှာ အရေးပါတဲ့ လုပ်ဆောင်ချက်တွေကို ပေးနေတာမို့ — **performance** က ထိပ်တန်း ဦးစားပေးဖြစ်ပါတယ်။

SWR ရဲ့ built-in **caching** နဲ့ **[deduplication](#deduplication)** က မလိုအပ်တဲ့ network request တွေကို ကျော်သွားစေပါတယ် — ဒါပေမယ့် `useSWR` hook ကိုယ်တိုင်ရဲ့ performance ကလည်း အရေးကြီးနေဆဲပါ။ ရှုပ်ထွေးတဲ့ app တစ်ခုမှာ — page တစ်ခု render လုပ်တာတည်းနဲ့ `useSWR` ခေါ်မှု ရာနဲ့ချီ ရှိနေနိုင်ပါတယ်။

SWR က သင့် app မှာ အောက်ပါတွေ ရှိစေဖို့ အာမခံပါတယ်:

- _မလိုအပ်တဲ့ request တွေ မရှိခြင်း_
- _မလိုအပ်တဲ့ re-render တွေ မရှိခြင်း_
- _မလိုအပ်တဲ့ code import မရှိခြင်း_

ကိုယ့်ဘက်က code ပြောင်းစရာ တစ်ကြောင်းမှ မလိုဘဲပါ။

## Deduplication

App ထဲမှာ SWR hook တွေကို ပြန်သုံးတာ အလွန်အဖြစ်များပါတယ်။ ဥပမာ — လက်ရှိ user ရဲ့ avatar ကို ၅ ကြိမ် render လုပ်တဲ့ app တစ်ခု:

```jsx
function useUser () {
  return useSWR('/api/user', fetcher)
}

function Avatar () {
  const { data, error } = useUser()

  if (error) return <Error />
  if (!data) return <Spinner />

  return <img src={data.avatar_url} />
}

function App () {
  return <>
    <Avatar />
    <Avatar />
    <Avatar />
    <Avatar />
    <Avatar />
  </>
}
```

`<Avatar>` component တစ်ခုချင်းစီထဲမှာ `useSWR` hook ပါပါတယ်။ သူတို့မှာ SWR key တူတူ ရှိပြီး — တစ်ချိန်တည်း နီးပါး render ဖြစ်တာမို့ — **network request ၁ ခုပဲ** လုပ်ပါတယ်။

Data hooks တွေ (အပေါ်က `useUser` လို) ကို နေရာတိုင်းမှာ ပြန်သုံးနိုင်ပါတယ် — performance ဒါမှမဟုတ် request ထပ်နေတာတွေကို ပူစရာ မလိုပါဘူး။

Default deduplication interval ကို ပြောင်းဖို့ [`dedupingInterval` option](https://swr.vercel.app/docs/api) လည်း ရှိပါတယ်။

## Deep Comparison

SWR က data ပြောင်းလဲမှုတွေကို default အားဖြင့် **deep compare** လုပ်ပါတယ်။ `data` value မပြောင်းရင် — re-render ဖြစ်မှာ မဟုတ်ပါဘူး။

အပြုအမူ ပြောင်းချင်ရင် [`compare` option](https://swr.vercel.app/docs/api) နဲ့ comparison function ကို ကိုယ်တိုင် customize လုပ်လို့ရပါတယ်။ ဥပမာ — API response တချို့မှာ server timestamp ပါတတ်ပြီး — data diff ထဲကနေ ဖယ်ထုတ်ချင်တာမျိုးပါ။

## Dependency Collection

`useSWR` က stateful value ၄ ခု ပြန်ပေးပါတယ်: `data`, `error`, `isLoading` နဲ့ `isValidating` — တစ်ခုချင်းစီကို သီးခြား update လုပ်နိုင်ပါတယ်။ ဥပမာ — ဒီ values တွေကို data-fetching lifecycle တစ်ခုလုံးမှာ ပုံနှိပ်ကြည့်ရင် ဒီလို ဖြစ်ပါမယ်:

```jsx
function App () {
  const { data, error, isLoading, isValidating } = useSWR('/api', fetcher)
  console.log(data, error, isLoading, isValidating)
  return null
}
```

အဆိုးဆုံး အခြေအနေမှာ (ပထမဆုံး request ကျရှုံးပြီး retry အောင်မြင်တာ) — log ၄ ကြောင်း တွေ့ရပါမယ်:

```js
// console.log(data, error, isLoading, isValidating)
undefined undefined true true  // => fetch စတင်ခြင်း
undefined Error false false    // => fetch ပြီးဆုံး၊ error ရတယ်
undefined Error true true      // => retry စတင်ခြင်း
Data undefined false false     // => retry ပြီးဆုံး၊ data ရတယ်
```

State ပြောင်းလဲမှုတွေက ကျိုးကြောင်းဆီလျော်ပါတယ်။ ဒါပေမယ့် ဒါက component ကို **၄ ကြိမ် render** ဖြစ်စေတာကို ဆိုလိုပါတယ်။

Component ကို `data` တစ်ခုတည်းပဲ သုံးအောင် ပြောင်းလိုက်ရင်:

```jsx
function App () {
  const { data } = useSWR('/api', fetcher)
  console.log(data)
  return null
}
```

မှော်ဆန်တဲ့ အရာက ဖြစ်လာပါတယ် — အခုဆို **re-render ၂ ကြိမ်ပဲ** ရှိပါတော့တယ်:

```js
// console.log(data)
undefined // => hydration / initial render
Data      // => retry ပြီးဆုံး၊ data ရတယ်
```

အတွင်းမှာ ဖြစ်စဉ်က အတိအကျ အတူတူပါပဲ — ပထမဆုံး request ကနေ error ရပြီး — retry ကနေ data ရတယ်။ ဒါပေမယ့် **SWR က component သုံးနေတဲ့ state တွေကိုပဲ update လုပ်ပါတယ်** — အခုတော့ `data` တစ်ခုတည်းပါ။

ဒီ state ၃ ခုလုံးကို အမြဲတမ်း မသုံးဘူးဆိုရင် — ဒီ feature ကနေ အကျိုးရှိနေပြီးသားပါ။ [Vercel](https://vercel.com) မှာ — ဒီ optimization က re-render တွေကို ~60% လျှော့ချပေးနိုင်ခဲ့ပါတယ်။

## Tree Shaking

SWR package က [tree-shakeable](https://webpack.js.org/guides/tree-shaking) ဖြစ်ပြီး side-effect free ပါ။ ဆိုလိုတာက — core `useSWR` API ကိုပဲ import လုပ်ရင် — `useSWRInfinite` လို မသုံးတဲ့ API တွေက သင့် application ထဲမှာ bundle ဖြစ်မှာ မဟုတ်ပါဘူး။
