---
title: "Cache (ကက်ရှ်)"
description: "cache provider ကို customize လုပ်ခြင်း — localStorage လို storage တွေနဲ့ ချိတ်သုံးခြင်း၊ cache ရှင်းလင်းခြင်း စတဲ့ အဆင့်မြင့် caching နည်းဗျူဟာများ"
order: 18
source: "https://swr.vercel.app/docs/advanced/cache"
status: translated
updated: 2026-09-01
---

> နောက်ဆုံး version (≥ 1.0.0) ကို upgrade လုပ်ထားမှ ဒီ feature ကို သုံးလို့ရပါတယ်။

> ⚠️ အများစုမှာ cache ထဲကို တိုက်ရိုက် _ရေးသားခြင်း_ ကို ရှောင်သင့်ပါတယ် — ဒါက SWR ရဲ့ မမျှော်လင့်ထားတဲ့ အပြုအမူတွေ (undefined behaviors) ကို ဖြစ်စေနိုင်လို့ပါ။ Key တစ်ခုကို ကိုယ်တိုင် mutate လုပ်ချင်ရင် SWR ရဲ့ API တွေကို သုံးဖို့ စဉ်းစားပါ။
>
> ဆက်ကြည့်ရန်: [Mutation](/docs/swr/mutation)၊ [Test Case အကြားမှာ Cache ကို Reset လုပ်ခြင်း](#test-case-အကြားမှာ-cache-ကို-reset-လုပ်ခြင်း)။

Default အနေနဲ့ SWR က global cache တစ်ခုကို သုံးပြီး — component တွေ အားလုံးကြားမှာ data တွေကို သိမ်းဆည်းပြီး မျှဝေပါတယ်။ ဒါပေမယ့် ဒီအပြုအမူကို `SWRConfig` ရဲ့ `provider` option နဲ့လည်း customize လုပ်လို့ရပါတယ်။

Cache provider တွေက SWR ကို ပိုပြီး customize လုပ်ထားတဲ့ storage တွေနဲ့ အသုံးပြုနိုင်ဖို့ ရည်ရွယ်ပါတယ်။

## Cache Provider

Cache provider ဆိုတာ Map နဲ့ ဆင်တူတဲ့ object တစ်ခုဖြစ်ပြီး — အောက်ပါ TypeScript definition နဲ့ ကိုက်ညီရပါမယ် (`swr` ကနေ import လုပ်လို့ရပါတယ်):

```typescript
interface Cache<Data> {
  get(key: string): Data | undefined
  set(key: string, value: Data): void
  delete(key: string): void
  keys(): IterableIterator<string>
}
```

ဥပမာ — [JavaScript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) instance တစ်ခုကို SWR အတွက် cache provider အနေနဲ့ တိုက်ရိုက် သုံးလို့ရပါတယ်။

## Cache Provider ဖန်တီးခြင်း

`SWRConfig` ရဲ့ `provider` option က [cache provider](#cache-provider) တစ်ခုကို ပြန်ပေးတဲ့ function ကို လက်ခံပါတယ်။ အဲဒီ provider ကို အဲဒီ `SWRConfig` အတွင်းမှာရှိတဲ့ SWR hook တွေ အားလုံးက သုံးပါလိမ့်မယ်။ ဥပမာ:

```jsx
import useSWR, { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Page/>
    </SWRConfig>
  )
}
```

`<Page/>` အတွင်းက SWR hook တွေ အားလုံးက အဲဒီ Map instance ကနေ ဖတ်ပြီး ရေးပါလိမ့်မယ်။ ကိုယ့် သီးခြား use case အတွက် တခြား cache provider implementation တွေကိုလည်း သုံးလို့ရပါတယ်။

> အပေါ်က ဥပမာမှာ — `<App/>` component ကို ပြန် mount လုပ်တိုင်း provider ကိုလည်း အသစ် ပြန်ဖန်တီးပါလိမ့်မယ်။ Cache provider တွေကို component tree ရဲ့ အပေါ်ပိုင်းမှာ ဒါမှမဟုတ် render ရဲ့ အပြင်ဘက်မှာ ထားသင့်ပါတယ်။

Nested (အလွှာလိုက်) ဖြစ်နေတဲ့အခါ SWR hook တွေက အပေါ်အဆင့် (upper-level) ရဲ့ cache provider ကို သုံးပါတယ်။ အပေါ်အဆင့် cache provider မရှိရင် — default cache provider ဖြစ်တဲ့ empty `Map` တစ်ခုကို ပြန်သုံးပါတယ်။

> ⚠️ Cache provider တစ်ခု သုံးထားရင် — အဲဒီ `<SWRConfig>` အတွင်းက SWR hook တွေအတွက် global `mutate` က **အလုပ်လုပ်မှာ မဟုတ်ပါဘူး**။ အဲဒီအစား [ဒီနည်း](#လက်ရှိ-cache-provider-ကို-ရယူခြင်း) ကို သုံးပါ။

## လက်ရှိ Cache Provider ကို ရယူခြင်း

React component တစ်ခုအတွင်းမှာဆိုရင် — လက်ရှိ cache provider နဲ့ `mutate` အပါအဝင် တခြား configuration တွေကို ရယူဖို့ [`useSWRConfig`](/docs/swr/global-config) hook ကို သုံးရပါတယ်:

```jsx
import { useSWRConfig } from 'swr'

function Avatar() {
  const { cache, mutate, ...extraConfig } = useSWRConfig()
  // ...
}
```

ဘယ် `<SWRConfig>` အောက်မှမှ မရှိဘူးဆိုရင် — default configurations တွေကို ပြန်ပေးပါတယ်။

## စမ်းသပ်ဆဲ (Experimental): Cache Provider တိုးချဲ့ခြင်း

> 🧪 ဒါက experimental feature တစ်ခုပါ — နောက်ပိုင်း upgrade တွေမှာ အပြုအမူ ပြောင်းလဲနိုင်ပါတယ်။

`<SWRConfig>` component တွေ အများအပြား nested (အလွှာလိုက်) ဖြစ်နေတဲ့အခါ — cache provider ကို တိုးချဲ့ (extend) လုပ်လို့ရပါတယ်။

`provider` function ရဲ့ ပထမဆုံး argument က အပေါ်အဆင့် `<SWRConfig>` ရဲ့ cache provider (parent `<SWRConfig>` မရှိရင် default cache) ဖြစ်ပါတယ် — အဲဒါကို သုံးပြီး cache provider ကို တိုးချဲ့လို့ရပါတယ်:

```jsx
<SWRConfig value={{ provider: (cache) => newCache }}>
  ...
</SWRConfig>
```

## ဥပမာများ

### localStorage အခြေခံ Persistent Cache

Cache ကို `localStorage` နဲ့ sync လုပ်ချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။ ဥပမာ implementation တစ်ခုက ဒီလိုပါ:

```jsx
function localStorageProvider() {
  // စတင်တဲ့အခါ `localStorage` ထဲက data တွေကို map တစ်ခုထဲ ပြန်ထည့်ပါတယ်
  const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'))

  // App မပိတ်ခင် data တွေ အားလုံးကို `localStorage` ထဲ ပြန်ရေးပါတယ်
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  // Performance အတွက် write & read ကိုတော့ map ကိုပဲ သုံးပါတယ်
  return map
}
```

ပြီးတော့ provider အနေနဲ့ ဒီလို သုံးပါတယ်:

```jsx
<SWRConfig value={{ provider: localStorageProvider }}>
  <App/>
</SWRConfig>
```

> ပိုကောင်းအောင် လုပ်ချင်ရင် — memory cache ကို buffer အနေနဲ့ သုံးပြီး `localStorage` ကို အခါအားလျော်စွာ ရေးနိုင်ပါတယ်။ IndexedDB ဒါမှမဟုတ် WebSQL နဲ့လည်း အလားတူ layered cache မျိုး လုပ်လို့ရပါတယ်။

### Test Case အကြားမှာ Cache ကို Reset လုပ်ခြင်း

App ကို test လုပ်တဲ့အခါ — test case တစ်ခုနဲ့တစ်ခုကြားမှာ SWR cache ကို reset လုပ်ချင်တာမျိုး ရှိနိုင်ပါတယ်။ App ကို empty cache provider တစ်ခုနဲ့ ရိုးရှင်းစွာ ထုပ်လိုက်ရုံပါပဲ။ Jest နဲ့ ဥပမာ:

```jsx
describe('test suite', async () => {
  it('test case', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <App/>
      </SWRConfig>
    )
  })
})
```

### Cache Data ကို ပြုပြင်ခြင်း

> 🚨 Cache ထဲကို တိုက်ရိုက် ရေးသားခြင်း မလုပ်သင့်ပါဘူး — undefined behavior တွေ ဖြစ်စေနိုင်ပါတယ်။

Cache ကို ပြုပြင်ဖို့ [`mutate`](/docs/swr/mutation) ကို သုံးနိုင်ပါတယ်။ ဥပမာ — cache data အားလုံးကို ရှင်းပစ်ချင်ရင် အောက်က အတိုင်း လုပ်နိုင်ပါတယ်:

```jsx
const { mutate } = useSWRConfig()

mutate(
  key => true, // ဘယ် cache key တွေကို update လုပ်မလဲ
  undefined, // cache data ကို `undefined` အဖြစ် update လုပ်ပါ
  { revalidate: false } // revalidate မလုပ်ပါ
)
```

အသေးစိတ်ကို [ဒီမှာ](/docs/swr/arguments#multiple-arguments--array-key) ဖတ်နိုင်ပါတယ်။

## Cache ရှင်းလင်းခြင်း

> ဒီ API က SWR 2.5.0-beta.1 ဒါမှမဟုတ် နောက်ပိုင်း လိုအပ်ပါတယ်။

`unload()` က cache provider တစ်ခုရဲ့ entry တွေ အားလုံးကို ရှင်းလင်းပြီး — အဲဒီ provider scope ထဲက mounted hook တွေ အားလုံးကို အသိပေး (notify) ပါတယ်။ Pending ဖြစ်နေတဲ့ preload တွေကိုလည်း ရှင်းလင်းပြီး — လုပ်ဆောင်နေဆဲ (in-flight) request နဲ့ mutation တွေရဲ့ ရလဒ်တွေကိုလည်း SWR က လျစ်လျူရှုစေပါတယ်။ Network လုပ်ဆောင်ချက်တွေကိုတော့ abort မလုပ်ပါဘူး။

Default အနေနဲ့ — cache ရှင်းလင်းပြီးတဲ့အခါ mounted hook တွေက revalidate ပြန်လုပ်ပါတယ်:

```tsx
import { unload } from 'swr'

unload()
```

ချက်ချင်း refetch မလုပ်ဘဲ cache ရှင်းချင်ရင် — revalidation ကို ပိတ်ထားပါ:

```tsx
unload({ revalidate: false })
```

အဲဒီ hook တွေက `data` ကို `undefined` အဖြစ်နဲ့ re-render ဖြစ်ပြီး — focus, reconnect, remount လို အခြားသော event တစ်ခုခုက revalidate လုပ်တဲ့အထိ ဗလာ (empty) ဖြစ်နေပါတယ်။ `unload` က `keepPreviousData` နဲ့ သိမ်းထားတဲ့ data တွေကိုလည်း ဖျက်ပစ်ပြီး — `useSWRInfinite` လို API တွေက သုံးတဲ့ internal key တွေကိုပါ ရှင်းပစ်ပါတယ် (mutate ရဲ့ key filter နဲ့ မကိုက်ညီနိုင်တဲ့ key တွေပါ)။

Top-level import ကတော့ SWR ရဲ့ default cache provider နဲ့ ချိတ်ထားပါတယ်။ Custom provider သုံးနေတယ်ဆိုရင် — `useSWRConfig` ကနေ scoped `unload` function ကို ရယူပါ:

```tsx
import { useSWRConfig } from 'swr'

function ClearCacheButton() {
  const { unload } = useSWRConfig()

  return (
    <button onClick={() => unload({ revalidate: false })}>
      Clear cache
    </button>
  )
}
```

### API

```ts
unload(options?: { revalidate?: boolean }): void
```

- `revalidate = true`: cache ရှင်းလင်းပြီးတဲ့အခါ mounted hook တွေ သုံးနေတဲ့ key တွေကို revalidate လုပ်မလား။
