---
title: "HydrationBoundary (Dehydrate လုပ်ထားသော state ကို cache သို့ ပြန်ထည့်ရန် component)"
description: "HydrationBoundary ရဲ့ props နဲ့ Returns — server မှာ dehydrate လုပ်ထားတဲ့ state ကို client ရဲ့ queryClient cache ထဲကို ပြန်ထည့်ပေးတဲ့ component; SSR မှာ data ကို client ဆီ လွှဲပြောင်းရာမှာ သုံး"
order: 51
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/HydrationBoundary"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function HydrationBoundary(__namedParameters): ReactElement<unknown, string | JSXElementConstructor<any>>;
```

`HydrationBoundary` က အရင်က dehydrate လုပ်ထားခဲ့တဲ့ state ကို — `useQueryClient()` ကနေ ပြန်ရမယ့် `queryClient` ရဲ့ cache ထဲကို ထည့်ပေးပါတယ်။ Client ထဲမှာ data ရှိပြီးသားဆိုရင် — query အသစ်တွေကို update timestamp ပေါ် မူတည်ပြီး ဉာဏ်ရည်ရှိရှိ (intelligently) ပေါင်းစည်း (merge) လုပ်ပါတယ်။

> မှတ်ချက်: `HydrationBoundary` နဲ့ဆိုရင် `queries` တွေကိုသာ dehydrate လုပ်လို့ ရပါတယ် — `mutations` တွေ မဟုတ်ပါဘူး။

## Parameters

**`__namedParameters`** — [`HydrationBoundaryProps`](https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/HydrationBoundaryProps) interface:

| Property | အဓိပ္ပာယ် |
|---|---|
| `state` | (required) `DehydratedState \| null \| undefined` — hydrate လုပ်မယ့် state (`dehydrate(queryClient)` ရဲ့ ရလဒ်) |
| `children?` | `ReactNode` — render လုပ်မယ့် components တွေ။ Hydration ပြီးမှ မဟုတ်ဘဲ ဘယ်အခြေအနေမှာမဆို အမြဲ unconditional အနေနဲ့ render လုပ်ပါတယ် |
| `queryClient?` | custom `QueryClient` တစ်ခု သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် အနီးဆုံး context ကနေ အလိုအလျောက် ယူပါတယ် |
| `options?` | `OmitKeyof<HydrateOptions, "defaultOptions"> & object` — optional။ သတိပြုစရာ — `hydrate` နဲ့ မတူတာက ဒီမှာ `mutations` ကို သတ်မှတ်လို့ မရပါဘူး |

## Returns

`ReactElement` — `children` ကို unconditional အနေနဲ့ render လုပ်ပေးပါတယ်။ `state` ထဲက query အသစ်တွေကို render လုပ်နေစဉ်အတွင်းမှာ cache ထဲကို hydrate လုပ်ပြီး — cache ထဲမှာ ရှိပြီးသား queries တွေအတွက်တော့ ပိုသစ်တဲ့ dehydrated data ကိုသာ commit ပြီးနောက် effect ထဲမှာ hydrate လုပ်ပါတယ် (ဒါကြောင့် ဒီ data က မရောက်ခင် `children` က ခဏလေး အရင်ပဲ render ဖြစ်နေနိုင်ပါတယ်)။

## ဘယ်အချိန်မှာ သုံးမလဲ

Server rendering (SSR) မှာ — server ဘက်က prefetch လုပ်ထားတဲ့ queries တွေကို `dehydrate(queryClient)` နဲ့ serializable state အဖြစ် ပြောင်းပြီး client ဆီ ပို့ကာ — ဒီ component နဲ့ ပြန် hydrate လုပ်ပါတယ်။ ဒါမှ client မှာ fetch အသစ် ထပ်မလုပ်တော့ဘဲ server-rendered markup ထဲက data ကို ချက်ချင်း သုံးနိုင်ပါတယ်။ Pattern အပြည့်အစုံ (Next.js pages router / Remix ဥပမာတွေ အပါအဝင်) ကို [Server Rendering & Hydration](/docs/tanstack-query/ssr) guide မှာ ကြည့်ပါ။

## ဥပမာများ

```tsx
import { HydrationBoundary } from '@tanstack/react-query'

function App() {
  return <HydrationBoundary state={dehydratedState}>...</HydrationBoundary>
}
```

Server-side prefetch ရဲ့ ရလဒ်ကို `dehydrate` ကနေ client ဆီ လွှဲပြောင်းခြင်း:

```tsx
import { HydrationBoundary, dehydrate, noop } from '@tanstack/react-query'

async function ServerComponent() {
  const queryClient = getQueryClient()

  await queryClient
    .query({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

Streaming / Server Components setup တွေအတွက် [Advanced Server Rendering](/docs/tanstack-query/advanced-ssr) guide ကို ကြည့်ပါ။
