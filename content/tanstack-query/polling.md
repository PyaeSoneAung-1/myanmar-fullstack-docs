---
title: "Polling (ပုံမှန် ပြန်မေးမြန်းခြင်း)"
description: "refetchInterval နဲ့ query တွေကို timer ပေါ်မှာ ပုံမှန် refetch လုပ်စေခြင်း — interval ကို query state နဲ့ လိုက်လျောညီထွေ ဖြစ်အောင်လုပ်ခြင်း, background polling, polling pause, offline support, deduplication"
order: 18
source: "https://tanstack.com/query/latest/docs/framework/react/guides/polling"
status: translated
updated: 2026-09-01
---

`refetchInterval` က query တစ်ခုကို timer တစ်ခုပေါ်မှာ refetch လုပ်စေပါတယ်။ ဒါကို milliseconds နဲ့ ဂဏန်းတစ်ခု သတ်မှတ်လိုက်ရင် — အနည်းဆုံး active observer တစ်ခု ရှိနေသရွေ့ query က N ms တိုင်း run ပါလိမ့်မယ်:

```tsx
useQuery({
  queryKey: ['prices'],
  queryFn: fetchPrices,
  refetchInterval: 5_000, // ၅ စက္ကန့်တိုင်း
})
```

Polling က `staleTime` နဲ့ သီးခြား ဖြစ်ပါတယ်။ Query တစ်ခုက fresh ဖြစ်နေရင်တောင် schedule အတိုင်း poll လုပ်နေနိုင်ပါတယ်; `staleTime` က တခြား refetch behaviors တွေနဲ့ ဘယ်လို ဆက်စပ်လဲဆိုတာ [Important Defaults](/docs/tanstack-query/important-defaults) မှာ ကြည့်ပါ။ `refetchInterval` က freshness နဲ့ မသက်ဆိုင်ဘဲ — သူ့ရဲ့ ကိုယ်ပိုင် clock ပေါ်မှာ fire ပါတယ်။

## Interval ကို query state နဲ့ လိုက်လျောညီထွေ ဖြစ်အောင်လုပ်ခြင်း

ဂဏန်း အစား function တစ်ခု ထည့်ပြီး — လက်ရှိ query ကနေ interval ကို တွက်ချက်နိုင်ပါတယ်။ Function က `Query` object ကို လက်ခံရရှိပြီး — ms နဲ့ ဂဏန်းတစ်ခု ဒါမှမဟုတ် polling ရပ်ဖို့ `false` ကို ပြန်ပေးရပါမယ်:

```tsx
useQuery({
  queryKey: ['job', jobId],
  queryFn: () => fetchJobStatus(jobId),
  refetchInterval: (query) => {
    // Job ပြီးသွားရင် polling ကို ရပ်မယ်
    if (query.state.data?.status === 'complete') return false
    return 2_000
  },
})
```

`false` ပြန်ပေးလိုက်ရင် interval timer ကို ရှင်းလိုက်ပါတယ်။ Query result ပြောင်းသွားလို့ function က positive ဂဏန်း ပြန်ပေးနိုင်တဲ့ အခြေအနေ ရောက်လာရင် — polling က အလိုအလျောက် ပြန်စပါတယ်။

## Background မှာ polling လုပ်ခြင်း

Default အနေနဲ့ — browser tab က focus ပျောက်သွားရင် polling က pause ဖြစ်ပါတယ်။ Dashboard တွေ ဒါမှမဟုတ် user က တခြား tab မှာ ရှိနေရင်တောင် data က လက်ရှိ (current) အနေနဲ့ ရှိနေဖို့ လိုတဲ့ interface တွေအတွက် — ဒီ behavior ကို disable လုပ်နိုင်ပါတယ်:

```tsx
useQuery({
  queryKey: ['portfolio'],
  queryFn: fetchPortfolio,
  refetchInterval: 30_000,
  refetchIntervalInBackground: true,
})
```

## Polling ကို pause လုပ်ခြင်း

`refetchInterval` ကို function တစ်ခု ထည့်ပြီး — polling ဘယ်အချိန် run သင့်လဲ ထိန်းချုပ်ဖို့ component state ကို close over လုပ်နိုင်ပါတယ်:

```tsx
useQuery({
  queryKey: ['prices', tokenAddress],
  queryFn: () => fetchPrice(tokenAddress),
  refetchInterval: () => {
    if (!tokenAddress || isPaused) return false
    return 15_000
  },
})
```

## Offline support နဲ့ polling

TanStack Query က browser ရဲ့ `online` နဲ့ `offline` events တွေကို နားထောင်ပြီး connectivity ကို ရှာဖွေပါတယ်။ ဒီ events တွေ ယုံကြည်ရလောက်အောင် fire မဖြစ်တဲ့ environment တွေ (Electron, embedded WebViews အချို့) မှာ — connectivity check ကို ကျော်သွားဖို့ `networkMode: 'always'` ကို သတ်မှတ်နိုင်ပါတယ်:

```tsx
useQuery({
  queryKey: ['chainStatus'],
  queryFn: fetchChainStatus,
  refetchInterval: 10_000,
  networkMode: 'always',
})
```

Network mode တွေအကြောင်း ပိုသိချင်ရင် [Network Mode](/docs/tanstack-query/network-mode) ကို ကြည့်ပါ။

## Deduplication အကြောင်း မှတ်စု

`QueryObserver` တစ်ခုချင်းစီ (ဆိုလိုတာက `refetchInterval` နဲ့ `useQuery` သုံးတဲ့ component တစ်ခုချင်းစီ) က သူ့ရဲ့ ကိုယ်ပိုင် timer ကို run ပါတယ်။ တူညီတဲ့ key မှာ `refetchInterval: 5000` နဲ့ subscribe လုပ်ထားတဲ့ component နှစ်ခုက — တစ်ခုချင်းစီ သူတို့ရဲ့ timer ကို ၅ စက္ကန့်တိုင်း fire လုပ်ပါတယ်။ Deduplicate ဖြစ်တာက concurrent in-flight fetches (တစ်ပြိုင်နက် သွားနေဆဲ fetches) တွေပါ — timer နှစ်ခု တစ်ချိန်တည်း fire ဖြစ်ရင်တောင် network request တစ်ခုပဲ ထွက်ပါတယ်။ Timers တွေက observer-level ဖြစ်ပြီး — deduplication ကတော့ query-level ဖြစ်ပါတယ်။

## Browser မဟုတ်တဲ့ environment များ

React Native လို browser မဟုတ်တဲ့ runtime တွေအတွက် — ပုံမှန် `online`/`offline` နဲ့ focus events တွေ မရနိုင်ပါဘူး။ [React Native guide](https://tanstack.com/query/latest/docs/framework/react/react-native) မှာ `focusManager` နဲ့ `onlineManager` တွေကို native app state APIs တွေနဲ့ ဘယ်လို ချိတ်ဆက်ရမလဲဆိုတာ ဖော်ပြထားပါတယ်။
