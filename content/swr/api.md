---
title: "API ကိုးကား (API Reference)"
description: "useSWR hook အတွက် ပြည့်စုံတဲ့ API ကိုးကား — parameters၊ return values နဲ့ options အားလုံး၏ ဖော်ပြချက်များ"
order: 21
source: "https://swr.vercel.app/docs/api"
status: translated
updated: 2026-09-01
---

```js
const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, options)
```

## Parameters

- `key`: request အတွက် သီးခြား (unique) key string (function / array / null လည်း ဖြစ်နိုင်ပါတယ်) — [(အသေးစိတ်)](/docs/swr/arguments)၊ [(အဆင့်မြင့် အသုံးပြုနည်း)](/docs/swr/conditional-fetching)
- `fetcher`: (_optional_) သင့် data ကို ယူဖို့ Promise ပြန်ပေးတဲ့ function — [(အသေးစိတ်)](/docs/swr/data-fetching)
- `options`: (_optional_) ဒီ SWR hook အတွက် options တွေ ပါဝင်တဲ့ object

## Return Values

- `data`: ပေးထားတဲ့ `key` အတွက် `fetcher` က resolve လုပ်ပေးတဲ့ data (load မဖြစ်သေးရင် undefined)
- `error`: `fetcher` က ပစ်လိုက်တဲ့ error (မရှိရင် undefined)
- `isLoading`: request တစ်ခု လုပ်ဆောင်နေပြီး "loaded data" မရှိသေးတဲ့ အခြေအနေ။ Fallback data နဲ့ ယခင် data တွေကို "loaded data" အဖြစ် မသတ်မှတ်ပါဘူး
- `isValidating`: request ဒါမှမဟုတ် revalidation တစ်ခု load ဖြစ်နေတဲ့ အခြေအနေ
- `mutate(data?, options?)`: cached data ကို ပြောင်းလဲဖို့ function — [(အသေးစိတ်)](/docs/swr/mutation)

နောက်ထပ် အချက်အလက်တွေကို [ဒီမှာ](/docs/swr/understanding) တွေ့နိုင်ပါတယ်။

## Options

- `suspense = false`: React Suspense mode ဖွင့်ရန် — [(အသေးစိတ်)](/docs/swr/suspense)
- `fetcher(args)`: fetcher function
- `revalidateIfStale = true`: stale data ရှိနေရင်တောင် အလိုအလျောက် revalidate လုပ်ရန် — [(အသေးစိတ်)](/docs/swr/revalidation#အလိုအလျောက်-revalidation-တွေကို-ပိတ်ခြင်း)
- `revalidateOnMount`: component mount ဖြစ်တဲ့အခါ အလိုအလျောက် revalidation ဖွင့်/ပိတ်ရန် — [(အသေးစိတ်)](/docs/swr/revalidation#mount-ဖြစ်တဲ့အခါ-revalidate-လုပ်ခြင်း)
- `revalidateOnFocus = true`: window focus ရတဲ့အခါ အလိုအလျောက် revalidate လုပ်ရန် — [(အသေးစိတ်)](/docs/swr/revalidation)
- `revalidateOnReconnect = true`: browser က network connection ပြန်ရတဲ့အခါ (`navigator.onLine` ကနေ စစ်ဆေး) အလိုအလျောက် revalidate လုပ်ရန် — [(အသေးစိတ်)](/docs/swr/revalidation)
- `refreshInterval` — [(အသေးစိတ်)](/docs/swr/revalidation):
  - Default အနေနဲ့ ပိတ်ထားပါတယ်: `refreshInterval = 0`
  - Number တစ်ခု သတ်မှတ်ထားရင် — polling interval ကို millisecond နဲ့ ဖြစ်ပါတယ်
  - Function တစ်ခု သတ်မှတ်ထားရင် — အဲဒီ function က နောက်ဆုံး data ကို လက်ခံပြီး interval ကို millisecond နဲ့ ပြန်ပေးရပါမယ်
- `refreshWhenHidden = false`: window မမြင်ရတဲ့အခါ polling လုပ်ရန် (`refreshInterval` ဖွင့်ထားရင်)
- `refreshWhenOffline = false`: browser offline ဖြစ်နေတဲ့အခါ polling လုပ်ရန် (`navigator.onLine` နဲ့ စစ်ဆေးပါတယ်)
- `shouldRetryOnError = true`: fetcher မှာ error ဖြစ်ရင် retry လုပ်ရန်
- `dedupingInterval = 2000`: key တူညီတဲ့ request တွေကို ဒီအချိန်အတွင်း (millisecond) dedupe လုပ်ရန်
- `focusThrottleInterval = 5000`: အချိန်တစ်ပိုင်းအတွင်း (millisecond) တစ်ခါပဲ revalidate လုပ်ရန်
- `loadingTimeout = 3000`: `onLoadingSlow` event ကို စတင်ဖို့ timeout (millisecond)
- `errorRetryInterval = 5000`: error retry interval (millisecond)
- `errorRetryCount`: error retry အများဆုံး အကြိမ်အရေအတွက်
- `fallback`: fallback data အများအပြား ပါဝင်တဲ့ key-value object — [(ဥပမာ)](/docs/swr/with-nextjs)
- `fallbackData`: ပြန်ပေးရမယ့် initial data (မှတ်ချက်: ဒါက hook တစ်ခုချင်းစီ (per-hook) အတွက်ပါ)
- `strictServerPrefetchWarning = false`: key တစ်ခုအတွက် pre-filled data မပေးထားတဲ့အခါ console မှာ warning message ပြရန် — [(အသေးစိတ်)](/docs/swr/with-nextjs#server-components-ထဲမှာ-data-ကြိုတင်ယူခြင်း)
- `keepPreviousData = false`: data အသစ် load ပြီးသည်အထိ ယခင် key ရဲ့ data ကို ပြန်ပေးရန် — [(အသေးစိတ်)](/docs/swr/understanding#ယခင်-data-ကို-ပြန်ပေးပြီး-ux-ကောင်းအောင်-လုပ်ခြင်း)
- `onLoadingSlow(key, config)`: request တစ်ခု load ဖို့ အချိန်ကြာလွန်းတဲ့အခါ ခေါ်တဲ့ callback function (`loadingTimeout` ကို ကြည့်ပါ)
- `onSuccess(data, key, config)`: request တစ်ခု အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ ခေါ်တဲ့ callback function
- `onError(err, key, config)`: request တစ်ခုမှာ error ပြန်ရတဲ့အခါ ခေါ်တဲ့ callback function
- `onErrorRetry(err, key, config, revalidate, revalidateOps)`: error retry အတွက် handler
- `onDiscarded(key)`: race condition တွေကြောင့် request တစ်ခုကို လျစ်လျူရှုလိုက်တဲ့အခါ ခေါ်တဲ့ callback function
- `compare(a, b)`: ပြန်ပေးတဲ့ data ပြောင်းလဲခြင်း ရှိ/မရှိ စစ်ဆေးဖို့ သုံးတဲ့ comparison function — spurious re-render တွေ ရှောင်ဖို့ပါ။ Default အနေနဲ့ [stable-hash](https://github.com/shuding/stable-hash) ကို သုံးပါတယ်
- `isPaused()`: revalidation တွေကို ခဏရပ်ထားသင့်လား စစ်ဆေးတဲ့ function — `true` ပြန်ရင် fetched data နဲ့ errors တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ Default အနေနဲ့ `false` ပြန်ပါတယ်
- `use`: middleware function တွေရဲ့ array — [(အသေးစိတ်)](/docs/swr/middleware)

> 💡 Network နှေးတဲ့အခါ (2G, ≤ 70Kbps) — `errorRetryInterval` က 10s ဖြစ်ပြီး `loadingTimeout` က default အနေနဲ့ 5s ဖြစ်ပါတယ်။

Default options တွေ သတ်မှတ်ဖို့ [global configuration](/docs/swr/global-config) ကိုလည်း သုံးနိုင်ပါတယ်။
