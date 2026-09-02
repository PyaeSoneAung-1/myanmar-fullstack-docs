---
title: "useQueryClient (QueryClient ရယူရန် hook)"
description: "useQueryClient hook — component ထဲကနေ လက်ရှိ QueryClient instance ကို ရယူပြီး cache methods တွေ သုံးခြင်း"
order: 41
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQueryClient"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useQueryClient(queryClient?): QueryClient;
```

`useQueryClient` hook က — လက်ရှိ context ထဲက `QueryClient` instance ကို ပြန်ပေးပါတယ်။ App တစ်ခုလုံးမှာ တစ်ခုတည်းသော `QueryClient` ကို `QueryClientProvider` နဲ့ ထည့်ပေးထားလေ့ ရှိတာမို့ — ဒီ hook က component တစ်ခုချင်းစီကနေ အဲဒီ shared instance ကို ရယူပြီး `queryClient.getQueryData()`၊ `setQueryData()`၊ `invalidateQueries()`၊ `cancelQueries()` စတဲ့ cache methods တွေကို တိုက်ရိုက်ခေါ်နိုင်စေဖို့ သုံးပါတယ်။

## Parameters

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ instance ကို ယူပါတယ်။

## Returns

`QueryClient` — လက်ရှိ `QueryClient` instance။

## Throws

`queryClient` argument မပို့ဘဲ — component tree ထဲမှာ `QueryClientProvider` ကိုလည်း ရှာမတွေ့ရင် error တက်ပါတယ်။ ဒါကြောင့် app ရဲ့ root မှာ provider ကို ထားဖို့ မမေ့ပါနဲ့။

## အသုံးပြုပုံ ဥပမာ

```tsx
import { useQueryClient } from '@tanstack/react-query'

function Component() {
  // context ထဲက QueryClient instance ကို ယူမယ်
  const queryClient = useQueryClient()

  const handleAddTodo = () => {
    // cache ထဲက လက်ရှိ data ကို ဖတ်ပြီး item အသစ် ထပ်ထည့်တယ်
    const todos = queryClient.getQueryData<string[]>(['todos']) ?? []
    queryClient.setQueryData(['todos'], [...todos, 'new todo'])
  }

  return <button onClick={handleAddTodo}>Add todo</button>
}
```

## ဘယ်နေရာတွေမှာ သုံးလဲ

- **Query invalidation** — mutation အောင်မြင်ပြီးနောက် `queryClient.invalidateQueries({ queryKey: [...] })` နဲ့ ဆက်စပ်နေတဲ့ query တွေကို ပြန် fetch လုပ်တာ — [Query Invalidation](/docs/tanstack-query/query-invalidation) နဲ့ [Mutations](/docs/tanstack-query/mutations) မှာ ကြည့်ပါ
- **Optimistic updates** — `cancelQueries` / `getQueryData` / `setQueryData` တွေနဲ့ server response မစောင့်ဘဲ cache ကို ကြိုပြင်တာ — [Optimistic Updates](/docs/tanstack-query/optimistic-updates)
- **Prefetching** — `prefetchQuery` နဲ့ data ကို user မလိုခင် ကြိုဆွဲထားတာ — [Prefetching](/docs/tanstack-query/prefetching)
- **Cache ကို တိုက်ရိုက် ဖတ်/ပြင်ချင်တဲ့ နေရာတွေ** — [Caching အခြေခံ](/docs/tanstack-query/cache)

`queryClient` ရဲ့ method အပြည့်အစုံအတွက် — [QueryClient reference](https://tanstack.com/query/latest/docs/reference/QueryClient) ကို ကြည့်နိုင်ပါတယ်။
