---
title: "UseInfiniteQueryResult (useInfiniteQuery ၏ result type)"
description: "initialData မသတ်မှတ်ထားတဲ့အခါ useInfiniteQuery ရဲ့ result type — query-core က InfiniteQueryObserverResult ကို re-export လုပ်ထားခြင်း"
order: 106
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseInfiniteQueryResult"
status: translated
updated: 2026-09-05
---

```ts
type UseInfiniteQueryResult<TData, TError> = InfiniteQueryObserverResult<TData, TError>;
```

`initialData` မသတ်မှတ်ထားတဲ့အခါ `useInfiniteQuery` ရဲ့ result type ဖြစ်ပါတယ် — query က `pending` ဖြစ်နေစဉ် `data` က `undefined` ဖြစ်နိုင်ပါတယ်။ `@tanstack/query-core` ထဲက InfiniteQueryObserverResult ကို ပြန်လည်ထုတ်ပေး (re-export) ထားတာပါ။

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
