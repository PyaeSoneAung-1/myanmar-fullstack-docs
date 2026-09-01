---
title: "Query Invalidation (query ကို invalidate လုပ်ခြင်း)"
description: "invalidateQueries နဲ့ query တွေကို stale ဖြစ်စေပြီး background မှာ refetch လုပ်စေခြင်း — prefix matching, exact, predicate function အသုံးပြုနည်း"
order: 12
source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation"
status: translated
updated: 2026-09-01
---

Query တွေ stale ဖြစ်မှသာ ပြန် fetch လုပ်ဖို့ စောင့်နေတာက အမြဲတမ်း အလုပ်မဖြစ်ပါဘူး — အထူးသဖြင့် user တစ်ယောက် တစ်ခုခု လုပ်လိုက်လို့ query ရဲ့ data က ခေတ်နောက်ကျ (out of date) ဖြစ်သွားတယ်ဆိုတာ သင်သေချာသိတဲ့အခါမျိုးမှာပါ။ ဒီအတွက် `QueryClient` မှာ `invalidateQueries` method ရှိပြီး — query တွေကို ဉာဏ်ရှိရှိနဲ့ stale အဖြစ် မှတ်သားစေပြီး သူတို့ကို refetch လည်း လုပ်ပေးနိုင်ပါတယ်!

```tsx
// Cache ထဲက query တိုင်းကို invalidate လုပ်မယ်
queryClient.invalidateQueries()
// `todos` နဲ့ စတင်တဲ့ key ရှိတဲ့ query တိုင်းကို invalidate လုပ်မယ်
queryClient.invalidateQueries({ queryKey: ['todos'] })
```

> မှတ်ချက် — normalized cache တွေ သုံးတဲ့ တခြား library တွေက local query တွေကို data အသစ်နဲ့ update လုပ်ဖို့ imperative နည်းနဲ့ဖြစ်ဖြစ် schema inference နဲ့ဖြစ်ဖြစ် ကြိုးစားကြမှာပါ။ TanStack Query ကတော့ normalized cache တွေ ထိန်းသိမ်းရတဲ့ manual အလုပ်တွေကို ရှောင်နိုင်ဖို့ tool တွေ ပေးထားပြီး — အဲဒီအစား **targeted invalidation, background-refetching နဲ့ နောက်ဆုံးမှာ atomic updates** တွေကို ညွှန်ကြားပေးပါတယ်။

Query တစ်ခုကို `invalidateQueries` နဲ့ invalidate လုပ်လိုက်တဲ့အခါ အချက်နှစ်ချက် ဖြစ်ပါတယ်:

- အဲဒီ query က stale အဖြစ် မှတ်သားခံရပါတယ်။ ဒီ stale state က `useQuery` ဒါမှမဟုတ် ဆက်စပ် hooks တွေမှာ သုံးထားတဲ့ `staleTime` configuration ဘယ်ဟာကိုမဆို override လုပ်ပါတယ်
- Query က လက်ရှိ `useQuery` ဒါမှမဟုတ် ဆက်စပ် hooks တွေကနေ render လုပ်နေတယ်ဆိုရင် — background မှာ refetch လည်း လုပ်ပေးပါတယ်

## `invalidateQueries` နဲ့ Query Matching

`invalidateQueries` နဲ့ `removeQueries` (ပြီးတော့ partial query matching ကို ထောက်ပံ့တဲ့ တခြား API တွေ) ကို သုံးတဲ့အခါ — query တွေကို သူတို့ရဲ့ prefix နဲ့ တွဲပြီး အများကြီး match လုပ်နိုင်ပြီး၊ ဒါမှမဟုတ် ပိုတိကျအောင် query တစ်ခုတည်းကို တိတိကျကျ match လုပ်နိုင်ပါတယ်။ သုံးလို့ရတဲ့ filter အမျိုးအစားတွေအကြောင်း သိချင်ရင် [Query Filters](/docs/tanstack-query/filters#query-filters) ကို ကြည့်ပါ။

ဒီဥပမာမှာ `todos` prefix ကို သုံးပြီး query key မှာ `todos` နဲ့ စတင်တဲ့ query တွေ အားလုံးကို invalidate လုပ်နိုင်ပါတယ်:

```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Context ကနေ QueryClient ကို ယူမယ်
const queryClient = useQueryClient()

queryClient.invalidateQueries({ queryKey: ['todos'] })

// အောက်က query နှစ်ခုလုံး invalidate ဖြစ်မယ်
const todoListQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})
const todoListQuery = useQuery({
  queryKey: ['todos', { page: 1 }],
  queryFn: fetchTodoList,
})
```

`invalidateQueries` method ဆီကို ပိုတိကျတဲ့ query key တစ်ခု ထည့်ပေးပြီး specific variables တွေပါတဲ့ query တွေကိုတောင် invalidate လုပ်နိုင်ပါတယ်:

```tsx
queryClient.invalidateQueries({
  queryKey: ['todos', { type: 'done' }],
})

// အောက်က query က invalidate ဖြစ်မယ်
const todoListQuery = useQuery({
  queryKey: ['todos', { type: 'done' }],
  queryFn: fetchTodoList,
})

// ဒါပေမယ့် အောက်က query ကတော့ invalidate ဖြစ်မှာ မဟုတ်ဘူး
const todoListQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})
```

`invalidateQueries` API က အလွန် flexible ပါတယ် — ဒါကြောင့် အပို variables ဒါမှမဟုတ် subkeys တွေ မရှိတဲ့ `todos` query တွေကို **သာ** invalidate လုပ်ချင်ရင်တောင် `invalidateQueries` method ဆီကို `exact: true` option ထည့်ပေးနိုင်ပါတယ်:

```tsx
queryClient.invalidateQueries({
  queryKey: ['todos'],
  exact: true,
})

// အောက်က query က invalidate ဖြစ်မယ်
const todoListQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})

// ဒါပေမယ့် အောက်က query ကတော့ invalidate ဖြစ်မှာ မဟုတ်ဘူး
const todoListQuery = useQuery({
  queryKey: ['todos', { type: 'done' }],
  queryFn: fetchTodoList,
})
```

ဒီထက်တောင် **ပိုတိကျ** စေချင်ရင် `invalidateQueries` method ဆီကို predicate function တစ်ခု ထည့်ပေးနိုင်ပါတယ်။ ဒီ function က query cache ထဲက `Query` instance တစ်ခုချင်းစီကို လက်ခံရရှိပြီး — အဲဒီ query ကို invalidate လုပ်ချင်လား မလုပ်ချင်ဘူးလားဆိုတာအတွက် `true` ဒါမှမဟုတ် `false` ပြန်ပေးနိုင်ပါတယ်:

```tsx
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'todos' && query.queryKey[1]?.version >= 10,
})

// အောက်က query က invalidate ဖြစ်မယ်
const todoListQuery = useQuery({
  queryKey: ['todos', { version: 20 }],
  queryFn: fetchTodoList,
})

// အောက်က query က invalidate ဖြစ်မယ်
const todoListQuery = useQuery({
  queryKey: ['todos', { version: 10 }],
  queryFn: fetchTodoList,
})

// ဒါပေမယ့် အောက်က query ကတော့ invalidate ဖြစ်မှာ မဟုတ်ဘူး
const todoListQuery = useQuery({
  queryKey: ['todos', { version: 5 }],
  queryFn: fetchTodoList,
})
```
