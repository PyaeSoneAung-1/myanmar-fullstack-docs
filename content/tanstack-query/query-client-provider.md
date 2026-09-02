---
title: "QueryClientProvider (QueryClient ကို application သို့ ပေးဆောင်ရန် component)"
description: "QueryClientProvider ရဲ့ props နဲ့ Returns — QueryClient တစ်ခုကို app တစ်ခုလုံးသို့ ချိတ်ဆက်/ဖြန့်ဝေပေးပြီး focus/online events တွေကို subscribe လုပ်ပေးတဲ့ component"
order: 50
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/QueryClientProvider"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function QueryClientProvider(__namedParameters): Element;
```

`QueryClientProvider` component က `QueryClient` တစ်ခုကို သင့် application နဲ့ ချိတ်ဆက်ပြီး ဖြန့်ဝေပေးပါတယ်။ Component mount/unmount ဖြစ်တာနဲ့အမျှ `client.mount()`/`client.unmount()` တွေကိုပါ ခေါ်ပေးတာမို့ — client က focus/online events တွေကို subscribe လုပ်ပြီး — app ပြန် focus ဖြစ်တဲ့အခါ ဒါမှမဟုတ် online ပြန်ဖြစ်တဲ့အခါ paused ဖြစ်နေတဲ့ mutations တွေကို ဆက်လုပ်ပေးပြီး လိုအပ်တဲ့ queries တွေကို refetch လုပ်ပေးပါတယ် ([Window Focus Refetching](/docs/tanstack-query/window-focus-refetching) နဲ့ [Network Mode](/docs/tanstack-query/network-mode) မှာ ကြည့်ပါ)။

`QueryClient` instance တစ်ခုကို ဖန်တီးပြီး app ရဲ့ root မှာ ဒီ provider နဲ့ ထုပ်တာက TanStack Query သုံးတိုင်း ပထမဆုံး setup step ဖြစ်ပါတယ် — [Getting Started](/docs/tanstack-query/getting-started) ကို ကြည့်ပါ။

## Parameters

**`__namedParameters`** — [`QueryClientProviderProps`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/QueryClientProviderProps) type:

| Property | အဓိပ္ပာယ် |
|---|---|
| `client` | (required) ဖြန့်ဝေပေးမယ့် `QueryClient` instance |
| `children?` | `React.ReactNode` — ဒီ `QueryClient` ကို သုံးခွင့်ရမယ့် components တွေ |

## Returns

`Element` — `children` တွေကို `useQueryClient` နဲ့ ပြန်ဖတ်လို့ရအောင် context ထဲ ထည့်ပေးထားတဲ့ ပုံစံနဲ့ ပြန်ပေးပါတယ် ([useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ)။

## ဥပမာများ

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

**SSR မှာ သတိပြုစရာ** — server rendering သုံးတဲ့အခါ `queryClient` ကို module scope မှာ မဟုတ်ဘဲ — React state (ဥပမာ `useState`) ထဲမှာ ဖန်တီးပါ။ Module level မှာ ဖန်တီးရင် cache က user တွေနဲ့ requests တွေကြားမှာ share ဖြစ်ပြီး — data အားလုံး ရောထွေးသွားနိုင်လို့ပါ။ Setup ဥပမာ အပြည့်အစုံကို [Server Rendering & Hydration](/docs/tanstack-query/ssr) guide မှာ ကြည့်ပါ။
