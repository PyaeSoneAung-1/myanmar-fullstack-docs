---
title: "DefinedUseQueryResult (initialData ထားလျှင် useQuery ၏ result)"
description: "`useQuery` ၌ `initialData` သတ်မှတ်ထားချိန် (သို့) `isPlaceholderData` omission မရှိသေးသည့် `useSuspenseQuery` ၏ result type — `data` သည် ဘယ်တော့မှ `undefined` မဖြစ်; `DefinedQueryObserverResult` ကို ပြန်လည် export လုပ်ထား"
order: 90
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/DefinedUseQueryResult"
status: translated
updated: 2026-09-05
---

ဒီ type က [`useQuery`](/docs/tanstack-query/use-query) မှာ `initialData` သတ်မှတ်ထားချိန် ရလာတဲ့ result ဒါမှမဟုတ် — `isPlaceholderData` ကို ဖယ်ရှားလိုက်ခြင်း (omission) မရှိသေးတဲ့ [`useSuspenseQuery`](/docs/tanstack-query/use-suspense-query) ရဲ့ result ဖြစ်ပါတယ် — ဒီ type မှာ `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး။ `@tanstack/query-core` ကနေ `DefinedQueryObserverResult` ကို ပြန်လည် export (re-export) လုပ်ထားပါတယ်။

```ts
type DefinedUseQueryResult<TData, TError> = DefinedQueryObserverResult<TData, TError>;
```

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

`queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
