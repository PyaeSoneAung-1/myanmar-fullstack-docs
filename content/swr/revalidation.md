---
title: "အလိုအလျောက် Revalidation"
description: "focus, interval နဲ့ reconnect စတာတွေနဲ့ stale data ကို အလိုအလျောက် ပြန်လည်စစ်ဆေးခြင်း (revalidation) — ရွေးချယ်စရာ option တွေ အပြည့်အစုံ"
order: 11
source: "https://swr.vercel.app/docs/revalidation"
status: translated
updated: 2026-09-01
---

> Data ကို ကိုယ်တိုင် (manually) revalidate လုပ်ချင်ရင် [mutation](/docs/swr/mutation) ကို ကြည့်ပါ။

## Focus ဖြစ်တဲ့အခါ Revalidate လုပ်ခြင်း

Page တစ်ခုကို ပြန် focus လုပ်တဲ့အခါ သို့မဟုတ် tab တွေကြား ပြောင်းလိုက်တဲ့အခါ — SWR က data ကို အလိုအလျောက် revalidate လုပ်ပေးပါတယ်။

ဒါက နောက်ဆုံး state ဆီ ချက်ချင်း ထပ်တူကျအောင် (synchronize) လုပ်ဖို့ အသုံးဝင်ပါတယ်။ Stale ဖြစ်နေတဲ့ mobile tab တွေ၊ ဒါမှမဟုတ် **အိပ်ပျော်သွားခဲ့တဲ့ (sleep)** laptop တွေလို အခြေအနေမျိုးမှာ data ကို refresh လုပ်ဖို့ အထူးအသုံးဝင်ပါတယ်။

> 🎬 Video: focus revalidation ကို သုံးပြီး page တွေကြား login state ကို အလိုအလျောက် sync လုပ်ပေးပုံ

ဒီ feature က default အားဖြင့် ဖွင့်ထားပါတယ်။ [`revalidateOnFocus`](https://swr.vercel.app/docs/api) option နဲ့ ပိတ်လို့ရပါတယ်။

## Interval နဲ့ Revalidate လုပ်ခြင်း

Device များစွာ၊ user များစွာ၊ tab များစွာကြောင့် data တွေ ပြောင်းလဲနေတတ်ပါတယ်။ အချိန်ကြာလာတာနဲ့အမျှ screen ပေါ်က data ကို ဘယ်လို update လုပ်မလဲ?

SWR က data ကို အလိုအလျောက် ပြန်ယူဖို့ option တစ်ခု ပေးထားပါတယ်။ ဒါက **smart** ပါ — ဘာလို့ဆိုတော့ hook နဲ့ ဆက်စပ်နေတဲ့ component က **screen ပေါ်မှာ ရှိနေမှသာ** refetch လုပ်တာမို့ပါ။

> 🎬 Video: user တစ်ယောက် ပြောင်းလဲမှု လုပ်လိုက်တဲ့အခါ session နှစ်ခုလုံးက နောက်ဆုံးမှာ data တူတူပဲ render ဖြစ်သွားပုံ

[`refreshInterval`](https://swr.vercel.app/docs/api) value သတ်မှတ်လိုက်ရုံနဲ့ ဖွင့်လို့ရပါတယ်:

```js
useSWR('/api/todos', fetcher, { refreshInterval: 1000 })
```

`refreshWhenHidden` နဲ့ `refreshWhenOffline` ဆိုတဲ့ option တွေလည်း ရှိပါသေးတယ်။ နှစ်ခုလုံးက default အားဖြင့် ပိတ်ထားတာမို့ — webpage က screen ပေါ် မရှိတဲ့အခါ ဒါမှမဟုတ် network connection မရှိတဲ့အခါ SWR က fetch လုပ်မှာ မဟုတ်ပါဘူး။

## Reconnect ဖြစ်တဲ့အခါ Revalidate လုပ်ခြင်း

User က internet ပြန်ရတဲ့အခါ revalidate လုပ်တာလည်း အသုံးဝင်ပါတယ်။ ဒီအခြေအနေမျိုးက — user က computer ကို unlock လုပ်လိုက်ပေမယ့် — အဲဒီအချိန်မှာ internet က ချက်ချင်း မချိတ်ရသေးတာမျိုးမှာ မကြာခဏ ဖြစ်တတ်ပါတယ်။

Data က အမြဲ up-to-date ဖြစ်နေစေဖို့ — network ပြန်ကောင်းလာတာနဲ့ SWR က အလိုအလျောက် revalidate လုပ်ပေးပါတယ်။

ဒီ feature က default အားဖြင့် ဖွင့်ထားပါတယ်။ [`revalidateOnReconnect`](https://swr.vercel.app/docs/api) option နဲ့ ပိတ်လို့ရပါတယ်။

## အလိုအလျောက် Revalidation တွေကို ပိတ်ခြင်း

Resource တစ်ခုက **immutable** (ဘယ်တော့မှ မပြောင်းလဲတဲ့) ဆိုရင် — ဘယ်လောက်ပဲ revalidate လုပ်လုပ် ပြောင်းလဲမှာ မဟုတ်တာမို့ — အလိုအလျောက် revalidation အမျိုးအစားအားလုံးကို ပိတ်ထားလို့ရပါတယ်။

SWR က version 1.0 ကစပြီး — resource ကို immutable အဖြစ် မှတ်သားဖို့ `useSWRImmutable` ဆိုတဲ့ helper hook ကို ပေးထားပါတယ်:

```js
import useSWRImmutable from 'swr/immutable'

// ...
useSWRImmutable(key, fetcher, options)
```

ဒါက သာမန် `useSWR` hook နဲ့ API interface အတူတူပါပဲ။ အောက်ပါ revalidation option တွေကို ပိတ်ပြီးလည်း အလားတူ လုပ်လို့ရပါတယ်:

```js
useSWR(key, fetcher, {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
})

// အပေါ်ကနဲ့ အတူတူပါပဲ
useSWRImmutable(key, fetcher)
```

`revalidateIfStale` က — SWR က mount ဖြစ်တဲ့အခါ stale data ရှိနေရင် revalidate လုပ်သင့်လား ဆိုတာကို ထိန်းချုပ်ပါတယ်။

အပေါ်က hook နှစ်ခုက **အတိအကျ တူညီတဲ့** အလုပ်ပါပဲ။ Data ကို cache လုပ်ပြီးတာနဲ့ — ဒီဟာတွေက နောက်တစ်ခါ ဘယ်တော့မှ request မလုပ်တော့ပါဘူး။

## Mount ဖြစ်တဲ့အခါ Revalidate လုပ်ခြင်း

Mounting ဖြစ်စဉ်မှာ SWR ရဲ့ revalidation ကို အတင်းအကျပ် override လုပ်ချင်ရင် အသုံးဝင်ပါတယ်။ Default အားဖြင့် `revalidateOnMount` ရဲ့ value က undefined ဖြစ်ပါတယ်။

SWR hook တစ်ခု mount ဖြစ်တဲ့အခါ:

- အရင်ဆုံး `revalidateOnMount` သတ်မှတ်ထားလား စစ်ပါတယ်။ True ဆိုရင် request စတင်ပြီး — false ဆိုရင် ရပ်လိုက်ပါတယ်။

Mount ရဲ့ အပြုအမူကို ထိန်းချုပ်ဖို့ `revalidateIfStale` က အသုံးဝင်ပါတယ်။ Default အားဖြင့် `revalidateIfStale` က true ဖြစ်ပါတယ်။

`revalidateIfStale` ကို true ထားရင် — cache data ရှိနေရင်မှသာ refetch လုပ်ပြီး — cache data မရှိရင်တော့ refetch မလုပ်ပါဘူး။
