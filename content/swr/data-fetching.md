---
title: "Data Fetching"
description: "Request key သဘောတရား၊ SWRConfig နဲ့ global fetcher၊ multiple arguments၊ conditional/dependent fetching နဲ့ mutate သုံးပြီး manual trigger လုပ်ခြင်း"
order: 2
source: "https://swr.vercel.app/docs/data-fetching"
status: translated
updated: 2026-09-01
---

## useSWR(key, fetcher) အခြေခံ

SWR ရဲ့ အခြေခံအကျဆုံး API ကတော့ ဒီပုံစံပါ:

```js
const { data, error } = useSWR(key, fetcher)
```

`fetcher` က **`key` ကို argument အနေနဲ့ လက်ခံပြီး data ပြန်ပေးတဲ့** async
function ပါ။ Fetcher က ပြန်ပေးတဲ့တန်ဖိုးက `data` ဖြစ်သွားပြီး — fetcher ထဲမှာ
error throw လုပ်ရင်လည်း `error` အနေနဲ့ ဖမ်းမိပါတယ်။ `fetcher` ကို global အနေနဲ့
ပေးထားရင် parameter ထဲက ချန်လိုက်လို့လည်း ရပါတယ်။

## Request Key — cache identifier

`key` က request တစ်ခုစီအတွက် **တစ်မျိုးတည်းသော identifier** ဖြစ်ပြီး —
အဲဒီ key ကိုပဲ **cache key** အနေနဲ့လည်း သုံးပါတယ်။ Key တူရင် cache ထဲက
data ကို ပြန်သုံးပြီး၊ key ပြောင်းရင် request အသစ် ထွက်ပါတယ်။ ဒါကြောင့် key ကို
data တစ်ခုစီရဲ့ "လိပ်စာ" လို့ မှတ်ယူလို့ရပါတယ်:

```jsx
function App () {
  const { data, error } = useSWR('/api/data', fetcher)
  // ...
}
```

## Global fetcher — SWRConfig

Project တစ်ခုလုံးမှာ fetcher တစ်မျိုးတည်း သုံးနေရရင် — hook တိုင်းမှာ
ထပ်ထည့်နေစရာမလိုဘဲ `SWRConfig` context နဲ့ တစ်ခါတည်း global သတ်မှတ်လို့ရပါတယ်:

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
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

ဒီလိုဆိုရင် `Dashboard` ထဲက `useSWR` တွေအားလုံးက global fetcher ကို
အလိုအလျောက် သုံးပြီး — default အနေနဲ့ သုံးစက္ကန့်တစ်ခါ ပြန်လည် စစ်ဆေးပေးပါတယ်
(`refreshInterval`)။ Hook တစ်ခုချင်းမှာလည်း option ထပ်ပေးပြီး override လုပ်လို့ရပါတယ်။

## Multiple Arguments — argument အများကြီး ပို့ခြင်း

`fetcher` ကို argument တစ်ခုထက်ပိုပြီး ပို့ချင်ရင် — **array ကို key အနေနဲ့**
သုံးလို့ရပါတယ်။ ဥပမာ authentication token ပါတဲ့ request ကို ကြည့်ရအောင်:

```jsx
const { data: user } = useSWR(['/api/user', token], ([url, token]) => fetchWithToken(url, token))
```

ဒီနေရာမှာ cache key တစ်ခုလုံး — `['/api/user', token]` — နဲ့ ချိတ်ဆက်သွားလို့
`token` ပြောင်းတိုင်း key အသစ် ဖြစ်ပြီး data အသစ် ပြန်ယူပါတယ်။ မှားတတ်တဲ့
ပုံစံတစ်ခုက `useSWR('/api/user', url => fetchWithToken(url, token))` လို့ ရေးတာပါ —
ဒီမှာ cache key က `'/api/user'` ပဲ ဖြစ်နေလို့ token ပြောင်းလဲပေမယ့် data ဟောင်း
(မှားနေတဲ့ data) ပြန်ရနိုင်ပါတယ်။

## Conditional Fetching — null key

အခြေအနေတစ်ခုပေါ် မူတည်ပြီး fetch လုပ်ချင်ရင် — key နေရာမှာ `null` ပေးလိုက်ရုံပါ။
Key က `null` (သို့) falsy ဖြစ်နေသရွေ့ SWR က request မစတင်ပါဘူး:

```jsx
// shouldFetch မှန်မှသာ fetch လုပ်မယ်
const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)
```

## Dependent Fetching — ဒေတာပေါ်မူတည်တဲ့ fetch

Data A ရမှ Data B ကို ယူရမယ်ဆိုရင် — key နေရာမှာ **function ပေးလို့**ရပါတယ်။
အဲဒီ function က falsy ပြန်တာ (သို့) throw ဖြစ်နေသရွေ့ SWR က B ကို မယူပါဘူး:

```jsx
function MyProjects () {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(() => '/api/projects?uid=' + user.id)
  // user.id က user မရသေးချိန်မှာ throw ဖြစ်နေလို့ —
  // user ရမှသာ projects ကို fetch လုပ်ပါတယ်

  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}
```

ဒီလိုမျိုး function key သုံးခြင်းဖြင့် — မလိုအပ်ဘဲ request တွေ ဆင့်မသွားအောင်
(waterfall မဖြစ်အောင်) SWR က စီစဉ်ပေးပြီး၊ dependency အဆင်သင့်ဖြစ်မှသာ
နောက် request ကို စလိုက်ပါတယ်။

## Fetch on mount vs Manual Trigger (mutate)

Default အားဖြင့် `useSWR` က component mount ဖြစ်တာနဲ့ အလိုအလျောက် fetch
လုပ်ပါတယ်။ ဒါပေမယ့် — button နှိပ်တာ စတဲ့ user action ပေါ်မှာ ပြန်ယူချင်ရင်
`mutate` ကို သုံးပြီး manual အနေနဲ့ trigger လုပ်လို့ရပါတယ်:

```jsx
const { data, mutate } = useSWR('/api/user', fetcher)

// ...ဒီလိုခေါ်ရင် data ကို ပြန်ယူ (revalidate) မယ်
mutate()
```

`useSWR` ကနေ ပြန်ရတဲ့ `mutate` က အဲဒီ key နဲ့ ချိတ်ထားတဲ့ (bound) function
ဖြစ်ပြီး — `useSWRConfig` ကရတဲ့ global `mutate` ကို သုံးရင်တော့ `mutate('/api/user')`
ဆိုပြီး key ကို သတ်မှတ်ပေးရပါတယ်။

## ဆက်ဖတ်ရန်

- [Error & Loading အခြေအနေများ](/docs/swr/error-handling) — error, retry နဲ့ loading state အသေးစိတ်
