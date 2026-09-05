---
title: "UseBaseQueryResult (initialData မရှိသော useQuery ၏ result type)"
description: "initialData မသတ်မှတ်ထားတဲ့အခါ useQuery ရဲ့ result type — query-core က QueryObserverResult ကို re-export လုပ်ထားခြင်း"
order: 105
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseBaseQueryResult"
status: translated
updated: 2026-09-05
---

```ts
type UseBaseQueryResult<TData, TError> = QueryObserverResult<TData, TError>;
```

`initialData` မသတ်မှတ်ထားတဲ့အခါ `useQuery` ရဲ့ result type ဖြစ်ပါတယ် — query က `pending` ဖြစ်နေစဉ် `data` က `undefined` ဖြစ်နိုင်ပါတယ်။ `@tanstack/query-core` ထဲက QueryObserverResult ကို ပြန်လည်ထုတ်ပေး (re-export) ထားတာဖြစ်ပြီး — `useInfiniteQuery` ကတော့ [UseInfiniteQueryResult](/docs/tanstack-query/use-infinite-query-result) ကို ပြန်ပေးပါတယ်။

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
