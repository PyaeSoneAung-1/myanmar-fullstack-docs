---
title: "Global Configuration"
description: "SWRConfig provider နဲ့ global fetcher/refreshInterval သတ်မှတ်ခြင်း၊ per-hook override၊ SWRConfig အလွှာထပ်ခြင်း (nesting) နဲ့ fallback data"
order: 6
source: "https://swr.vercel.app/docs/global-configuration"
status: translated
updated: 2026-09-01
---

## SWRConfig — global configuration

`SWRConfig` context က SWR hook တွေ အားလုံးအတွက် global configuration (options) တွေကို ပေးနိုင်ပါတယ်:

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // override

  // ...
}

function App () {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```

ဒီမှာ `Dashboard` ထဲက hook တွေ အားလုံးက global `fetcher` ကို သုံးပြီး — default အနေနဲ့ ၃ စက္ကန့်တစ်ခါ revalidate (ပြန်လည်စစ်ဆေး) လုပ်ပါတယ် (`refreshInterval` 3000ms)။ ဒီလိုဆိုရင် component တွေထဲမှာ hook တိုင်းမှာ fetcher ထပ်ရေးစရာ မလိုဘဲ — `useSWR('/api/events')` လို key တစ်ခုတည်းနဲ့ ခေါ်လိုက်ရုံနဲ့ global fetcher ကို အလိုအလျောက် သုံးပါတယ်။

Hook တစ်ခုချင်းစီမှာ override လုပ်ချင်ရင် — global fetcher ရှိတဲ့အခါ `useSWR(key, options)` လို ဒုတိယ argument နေရာမှာ options object ပေးလို့ရပြီး — fetcher ကို ကိုယ်တိုင် ထည့်ရေးနေတဲ့အခါ `useSWR(key, fetcher, options)` လို တတိယ argument အနေနဲ့ ပေးရပါတယ်။ အပေါ်က code မှာ `user` hook က `{ refreshInterval: 0 }` နဲ့ override လုပ်ထားလို့ — သူ့အတွက်တော့ auto refresh ပိတ်သွားပြီး — ကျန်တဲ့ hook တွေကတော့ global setting အတိုင်း ဆက်အလုပ်လုပ်ပါတယ်။

## SWRConfig အလွှာထပ်ခြင်း (Nesting)

`SWRConfig` တွေ ထပ်ထည့်ထားရင် — child က parent context ရဲ့ configuration နဲ့ **merge** လုပ်ပါတယ်။ Object ဖြစ်ဖြစ်, function ဖြစ်ဖြစ် ပေးလို့ရပြီး — function ဆိုရင် parent configuration ကို argument အနေနဲ့ လက်ခံပြီး ကိုယ်ပိုင် configuration အသစ် ပြန်ပေးရပါတယ်:

```jsx
import { SWRConfig, useSWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 100,
        refreshInterval: 100,
        fallback: { a: 1, b: 1 },
      }}
    >
      <SWRConfig
        value={{
          dedupingInterval: 200, // parent တန်ဖိုးကို override — primitive တန်ဖိုးမို့
          fallback: { a: 2, c: 2 }, // parent နဲ့ merge — mergeable object မို့
        }}
      >
        <Page />
      </SWRConfig>
    </SWRConfig>
  )
}

function Page() {
  const config = useSWRConfig()
  // {
  //   dedupingInterval: 200,
  //   refreshInterval: 100,
  //   fallback: { a: 2, b: 1, c: 2 },
  // }
}
```

Merge စည်းမျဉ်းက — primitive တန်ဖိုး (`dedupingInterval` လို number) ဆိုရင် child က override လုပ်ပြီး — mergeable object (`fallback` လို) ဆိုရင် parent ရော child ရော ပေါင်းထည့်ပါတယ်။ Function ပုံစံဆိုရင် — `value={parent => ({ ... })}` လို ရေးပြီး parent ရဲ့တန်ဖိုးကို ကြည့်ပြီး ကွေးညွှတ်စွာ customize လုပ်လို့ရပါတယ်။

ဒီပုံစံက — route/page တစ်ခုစီမှာ default config ထားပြီး — အထူးပြုလိုတဲ့နေရာမှာပဲ ကိုယ်ပိုင် config ထပ်ထည့်တာမျိုး လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ ဥပမာ — app တစ်ခုလုံးအတွက် `refreshInterval: 3000` ထားပြီး — admin panel မှာပဲ `1000` ပြောင်းချင်ရင် admin ရဲ့ subtree ကို `SWRConfig` အသစ်နဲ့ ထုပ်လိုက်ရုံပါပဲ။ `useSWRConfig` hook က — လက်ရှိ merged configuration ကို ပြန်ပေးပြီး — global `mutate`, `cache` စတာတွေကိုပါ ရယူနိုင်ပါတယ်။

## Fallback data

`fallback` option က hook တွေ fetch မလုပ်ခင်ကတည်းက cache ထဲ ကြိုထည့်ထားတဲ့ data ပါ — SSR/SSG (server-side rendering / static generation) ကရတဲ့ data ကို client ဘက်မှာ ချက်ချင်း ပြဖို့ အသုံးဝင်ပါတယ်:

```jsx
<SWRConfig value={{ fallback: { '/api/data': prefetchedData } }}>
  <Page />
</SWRConfig>
```

`fallback` ထဲမှာ — hook တွေရဲ့ key အတိုင်း ထည့်ရပါတယ် (အပေါ်က ဥပမာမှာ URL string key)။ ဒီလိုဆိုရင် `useSWR('/api/data', fetcher)` က fetch မလုပ်ခင်မှာတောင် `prefetchedData` ကို data အဖြစ် ချက်ချင်း ရပြီး — first render မှာတင် content ပေါ်ပါတယ်။ `fallbackData` option (hook တစ်ခုချင်းစီအတွက်) နဲ့ အသေးစိတ်ကို [Prefetching](/docs/swr/prefetching) မှာ ဖတ်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Prefetching](/docs/swr/prefetching) — preload, fallbackData နဲ့ SSR/SSG data
- [Data Fetching](/docs/swr/data-fetching) — global fetcher နဲ့ request key အခြေခံ
