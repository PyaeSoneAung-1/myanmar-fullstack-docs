---
title: "Error & Loading အခြေအနေများ"
description: "useSWR ရဲ့ error state၊ isLoading နဲ့ isValidating ကွာခြားချက်၊ error retry (errorRetryCount, errorRetryInterval) နဲ့ SWRConfig သုံးပြီး global error handling"
order: 3
source: "https://swr.vercel.app/docs/error-handling"
status: translated
updated: 2026-09-01
---

## Error state

`fetcher` ထဲမှာ error throw လုပ်လိုက်ရင် — useSWR က အဲဒီ error ကို `error`
အနေနဲ့ ပြန်ပေးပါတယ်။ Fetch promise က reject ဖြစ်တာနဲ့ `error` object က
တန်ဖိုးရှိလာပါမယ်:

```js
const fetcher = url => fetch(url).then(r => r.json())

// ...
const { data, error } = useSWR('/api/user', fetcher)
```

ဒါကြောင့် component ထဲမှာ `error` ရှိမရှိ စစ်ပြီး error UI ပြသလို့ရပါတယ်။

## isLoading vs isValidating

ဒီနှစ်ခုက ဆင်တူပေမယ့် အဓိပ္ပာယ် မတူပါဘူး:

- **`isLoading`** — request လုပ်နေပြီး "loaded data" မရသေးတဲ့ အခြေအနေ။
  Data တစ်ခါမှ မရဖူးသေးတဲ့ ပထမဆုံး load မှာ `true` ဖြစ်ပါတယ်။
- **`isValidating`** — request (သို့) revalidation တစ်ခုခု လုပ်နေတဲ့ အခြေအနေ။
  Cache ထဲမှာ data အဟောင်း ရှိပြီးသားဆိုရင်တောင် — background မှာ ပြန်စစ်နေတဲ့
  အချိန်မှာ `true` ဖြစ်ပါတယ်။

ဥပမာ — data ရပြီးသား၊ revalidate လုပ်နေတဲ့ အချိန်မှာ `isLoading` က `false`
ဖြစ်ပေမယ့် `isValidating` က `true` ဖြစ်နေနိုင်ပါတယ်။ ဒါကြောင့် loading spinner
အသစ်ပြမယ့်အစား — data အဟောင်းကို ပြထားရင်း နောက်ကွယ်မှာ ပြန်ယူနေတာမျိုးကို
ဒီ flag နှစ်ခုနဲ့ ခွဲပြီး UI လုပ်လို့ရပါတယ်။

## Status code နဲ့ error object

တစ်ခါတစ်ရံ API က status code နဲ့အတူ error object ပါ ပြန်ပေးပါတယ်။
`fetcher` ကို customize လုပ်ပြီး — status code က `2xx` မဟုတ်ရင် error အဖြစ်
သတ်မှတ်လိုက်လို့ရပါတယ်:

```js
const fetcher = async url => {
  const res = await fetch(url)

  // status code က 200-299 ထဲမှာ မဟုတ်ရင် —
  // body ကို parse ပြီး error အဖြစ် throw လုပ်မယ်
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // error object ထဲကို အချက်အလက် ထပ်ထည့်မယ်
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}
```

ဒါဆိုရင် component ထဲမှာ `error.status === 403` လိုမျိုး စစ်ပြီး — တိကျတဲ့ error
UI ပြလို့ရပါတယ်။ မှတ်ထားရမှာက **`data` နဲ့ `error` က တစ်ပြိုင်နက် ရှိနေနိုင်ပါတယ်** —
ဒါကြောင့် နောက်ဆုံး request မအောင်မြင်ပေမယ့် အရင်ရထားတဲ့ data ကို ဆက်ပြထားလို့ရပါတယ်။

## Error Retry

SWR က error ဖြစ်တဲ့အခါ **exponential backoff algorithm** နဲ့ request ကို
အလိုအလျောက် ပြန်စမ်းပါတယ် — ပထမအကြိမ်တွေမှာ မြန်မြန်ပြန်စမ်းပြီး၊ နောက်လေလေ
ကြားကာလ ရှည်လေလေ ဖြစ်ပါတယ်။ Retry အရေအတွက်နဲ့ ကြားကာလကို option တွေနဲ့
ထိန်းချုပ်လို့ရပါတယ်:

```js
useSWR('/api/user', fetcher, {
  errorRetryCount: 3,          // အများဆုံး retry အကြိမ်ရေ
  errorRetryInterval: 5000,    // retry ကြားကာလ (ms)
})
```

- **`errorRetryCount`** — error ဖြစ်ပြီးနောက် အများဆုံး ပြန်စမ်းတဲ့ အကြိမ်ရေ
- **`errorRetryInterval`** — retry တစ်ခုနဲ့တစ်ခုကြား အချိန်။ Default က 5000ms
  ဖြစ်ပြီး — နှေးတဲ့ network (2G လို 70Kbps အောက်) မှာတော့ 10s ဖြစ်ပါတယ်
- **`shouldRetryOnError: false`** ဆိုရင် retry လုံးဝ ပိတ်လိုက်ပါတယ်

ပိုပြီး ကွေးညွှတ်လိုချင်ရင် `onErrorRetry` callback နဲ့ — "404 ဆိုရင် မပြန်စမ်းဘူး"၊
"ဒီ key ဆိုရင် မပြန်စမ်းဘူး" စတဲ့ condition တွေကို ကိုယ်တိုင် သတ်မှတ်လို့ရပါတယ်။

## Global Error Handling

Error တွေကို component တစ်ခုချင်းစီမှာ ကိုင်စရာမလိုဘဲ — toast/snackbar ပြတာ၊
Sentry လိုမျိုး error reporting service ဆီ ပို့တာမျိုးကို **တစ်နေရာတည်းကနေ**
လုပ်ချင်ရင် `SWRConfig` ရဲ့ `onError` event ကို သုံးပါတယ်:

```jsx
<SWRConfig value={{
  onError: (error, key) => {
    if (error.status !== 403 && error.status !== 404) {
      // ဥပမာ — error ကို Sentry ဆီ ပို့မယ် (သို့) notification ပြမယ်
    }
  }
}}>
  <MyApp />
</SWRConfig>
```

ဒီလိုဆိုရင် app တစ်ခုလုံးက SWR error တွေ အားလုံး ဒီ callback တစ်ခုတည်းကို
ဖြတ်သွားပြီး — error handling logic ကို နေရာတစ်ခုတည်းမှာ ထိန်းသိမ်းလို့ရပါတယ်။
`onError` ကိုတော့ hook တစ်ခုချင်းစီရဲ့ option အနေနဲ့လည်း ထည့်လို့ရပါသေးတယ်။

## ဆက်ဖတ်ရန်

- [SWR စတင်ခြင်း](/docs/swr/getting-started) — useSWR အခြေခံ ပြန်ကြည့်ရန်
- [Data Fetching](/docs/swr/data-fetching) — request key နဲ့ fetcher အသေးစိတ်
