---
title: "UseQueryResult (useQuery ၏ result type)"
description: "useQuery ရဲ့ result type — UseBaseQueryResult နဲ့ အတူတူ"
order: 112
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseQueryResult"
status: translated
updated: 2026-09-05
---

```ts
type UseQueryResult<TData, TError> = UseBaseQueryResult<TData, TError>;
```

`useQuery` ရဲ့ result type ဖြစ်ပါတယ်။ [UseBaseQueryResult](/docs/tanstack-query/use-base-query-result) နဲ့ အတူတူပါပဲ။

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
