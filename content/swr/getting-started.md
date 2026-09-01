---
title: "SWR စတင်ခြင်း"
description: "SWR ဆိုတာ ဘာလဲ၊ ဘယ်လို install လုပ်မလဲ၊ useSWR hook နဲ့ data fetching — loading/error state တွေနဲ့အတူ"
order: 1
source: "https://swr.vercel.app/docs/getting-started"
status: translated
updated: 2026-09-01
---

## SWR ဆိုတာ ဘာလဲ

**SWR** က React အတွက် data fetching (ဒေတာယူခြင်း) library တစ်ခုပါ။ React Hooks
တွေနဲ့ အလုပ်လုပ်ပြီး — component တစ်ခုထဲမှာ data ရယူတာ၊ cache (ကက်ရှ်) လုပ်တာ၊
revalidation (ဒေတာကို နောက်တစ်ကြိမ် ပြန်စစ်ဆေးခြင်း) လုပ်တာတွေကို အလွယ်တကူ
လုပ်လို့ရပါတယ်။

SWR ဆိုတဲ့ နာမည်က **stale-while-revalidate** — HTTP RFC 5861 မှာ လူသိများတဲ့
cache invalidation strategy တစ်ခုကနေ ဆင်းသက်လာတာပါ။ သဘောတရားကတော့ —
ဒေတာအဟောင်း (stale) ကို အရင်ပြပြီး၊ နောက်ကွယ်မှာ (background) ဒေတာအသစ်
ပြန်ယူကာ ရလာတဲ့အခါ UI ကို ပြန်လည် မွမ်းမံတာပါ။ ဒါကြောင့် app က
ချက်ချင်း respond လုပ်နိုင်ပြီး — loading screen တွေကို စောင့်စရာမလိုဘဲ
သုံးစွဲသူဆီ အမြဲလတ်ဆတ်တဲ့ data ရောက်နေပါတယ်။

## Installation

React project ထဲမှာ npm နဲ့ install လုပ်လိုက်ရုံပါပဲ:

```bash
npm i swr
```

## fetcher function

RESTful API ကနေ JSON data ယူမယ်ဆိုရင် — native `fetch` ကို wrap လုပ်ထားတဲ့
`fetcher` function လေးတစ်ခု အရင်ဆောက်ရပါတယ်:

```js
const fetcher = (...args) => fetch(...args).then(res => res.json())
```

GraphQL API သို့မဟုတ် Axios လိုမျိုး library တွေ သုံးချင်ရင်လည်း ကိုယ်ပိုင်
`fetcher` function ရေးလို့ရပါတယ်။

## useSWR hook — signature

`useSWR` က SWR ရဲ့ အဓိက hook ဖြစ်ပြီး `useSWR(key, fetcher)` ဆိုတဲ့ signature
နဲ့ ခေါ်ပါတယ်။ `key` က request ရဲ့ ထူးခြားတဲ့ identifier (cache key) ဖြစ်ပြီး
`fetcher` က data ပြန်ပေးတဲ့ function ပါ။ Component တစ်ခုထဲမှာ ဒီလို သုံးပါတယ်:

```jsx
import useSWR from 'swr'

function Profile ({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/user/${userId}`, fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  // render data
  return <div>hello {data.name}!</div>
}
```

Request တစ်ခုမှာ ဖြစ်နိုင်တဲ့ state ၃ မျိုးရှိပါတယ် — **loading**, **ready**, နဲ့
**error**။ အပေါ်က code မှာဆိုရင် `error` ရှိရင် error UI ပြ၊ `isLoading` ဆိုရင်
loading UI ပြပြီး — နှစ်ခုလုံး မရှိမှ data ကို render လုပ်ပါတယ်။

## Data hook ပြန်သုံးလို့ရအောင် လုပ်ခြင်း

SWR ရဲ့ အားသာချက်တစ်ခုက data fetching logic တွေကို custom hook အဖြစ်
ထုပ်ပြီး နေရာမျိုးစုံမှာ ပြန်သုံးလို့ရတာပါ:

```jsx
function useUser (id) {
  const { data, error, isLoading } = useSWR(`/api/user/${id}`, fetcher)

  return {
    user: data,
    isLoading,
    isError: error
  }
}
```

ဒီပုံစံနဲ့ဆိုရင် component တွေက "ဘယ် data ကို လိုလဲ" ဆိုတာကိုပဲ ကြေညာရုံပါ —
request စတာ၊ loading state စီမံတာ စတဲ့ imperative (အဆင့်ဆင့် ညွှန်ကြားတဲ့)
အလုပ်တွေကို SWR က ကိုယ်စား လုပ်ပေးပါတယ်။

ထူးခြားတာတစ်ခုက — key တူတဲ့ hook တွေ နေရာမျိုးစုံမှာ သုံးထားရင်တောင် API ကို
**request ၁ ခုပဲ** သွားပါတယ်။ Request တွေကို SWR က **dedupe** (ထပ်နေတာ ဖယ်),
**cache** လုပ်ပြီး component တွေကြားမှာ **share** လုပ်ပေးလို့ပါ။ ပြီးတော့ user က
tab ပြောင်းလိုက်တာ၊ laptop wake ဖြစ်လိုက်တာလိုမျိုး အချိန်တွေမှာလည်း data ကို
အလိုအလျောက် ပြန်ယူပေးပါတယ် (revalidate on focus / reconnect)။

## ဆက်ဖတ်ရန်

- [Data Fetching](/docs/swr/data-fetching) — request key, global fetcher, conditional fetching
- [Error & Loading အခြေအနေများ](/docs/swr/error-handling) — error handling အသေးစိတ်
