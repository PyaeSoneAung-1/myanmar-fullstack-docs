---
title: "UseSuspenseInfiniteQueryResult (useSuspenseInfiniteQuery ၏ result type)"
description: "useSuspenseInfiniteQuery ရဲ့ result type — DefinedUseInfiniteQueryResult နဲ့ တူပြီး isPlaceholderData မပါ (Suspense hooks က placeholder data ကို render မလုပ်သောကြောင့်)"
order: 113
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseSuspenseInfiniteQueryResult"
status: translated
updated: 2026-09-05
---

```ts
type UseSuspenseInfiniteQueryResult<TData, TError> = OmitKeyof<DefinedInfiniteQueryObserverResult<TData, TError>, "isPlaceholderData">;
```

`useSuspenseInfiniteQuery` ရဲ့ result type ဖြစ်ပါတယ်။ [DefinedUseInfiniteQueryResult](/docs/tanstack-query/defined-use-infinite-query-result) နဲ့ အတူတူပါပဲ — `isPlaceholderData` ကတော့ ဖယ်ထားပါတယ်။ Suspense hooks တွေက placeholder data ကို ဘယ်တော့မှ render လုပ်လေ့ မရှိလို့ပါ။

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
