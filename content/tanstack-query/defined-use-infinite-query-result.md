---
title: "DefinedUseInfiniteQueryResult (initialData ထားလျှင် useInfiniteQuery ၏ result)"
description: "`useInfiniteQuery` ၌ `initialData` သတ်မှတ်ထားချိန် ပြန်လာသော result type — `data` သည် ဘယ်တော့မှ `undefined` မဖြစ်; `DefinedInfiniteQueryObserverResult` ကို ပြန်လည် export လုပ်ထား"
order: 89
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/DefinedUseInfiniteQueryResult"
status: translated
updated: 2026-09-05
---

`initialData` သတ်မှတ်ထားတဲ့အခါ [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) က ပြန်ပေးတဲ့ result type ဖြစ်ပါတယ် — ဒီအခါ `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး။ `@tanstack/query-core` ထဲက `DefinedInfiniteQueryObserverResult` ကို ပြန်လည် export (re-export) လုပ်ထားတာပါ။

```ts
type DefinedUseInfiniteQueryResult<TData, TError> = DefinedInfiniteQueryObserverResult<TData, TError>;
```

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

`queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
