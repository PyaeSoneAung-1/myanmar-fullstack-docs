---
title: "UndefinedInitialDataOptions (initialData မသတ်မှတ်ထားသော queryOptions ၏ options type)"
description: "initialData မသတ်မှတ်ထားတဲ့အခါ ရွေးချယ်ခံရတဲ့ queryOptions overload ရဲ့ options type — query က pending ဖြစ်နေစဉ် data က undefined ဖြစ်နိုင်ခြင်း"
order: 101
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UndefinedInitialDataOptions"
status: translated
updated: 2026-09-05
---

```ts
type UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & object;
```

`initialData` မသတ်မှတ်ထားတဲ့အခါ ရွေးချယ်ခံရတဲ့ `queryOptions` overload က လက်ခံတဲ့ options type ဖြစ်ပါတယ် — ဒီအခြေအနေမှာ query က `pending` ဖြစ်နေစဉ် `data` က `undefined` ဖြစ်နိုင်ပါတယ်။

## Type Declaration

### initialData?

```ts
optional initialData: 
  | InitialDataFunction<NonUndefinedGuard<TQueryFnData>>
| NonUndefinedGuard<TQueryFnData>;
```

သတ်မှတ်ထားမယ်ဆိုရင် ဒီ value ကို query cache ရဲ့ initial data အဖြစ် သုံးပါလိမ့်မယ် (query ကို အသစ် မဖန်တီးရသေး / cache မလုပ်ရသေးသရွေ့)။ Function အနေနဲ့ သတ်မှတ်ထားရင် — function ကို shared/root query initialization လုပ်နေစဉ်မှာ **တစ်ကြိမ်တည်း** ခေါ်ပြီး initial data ကို synchronously ပြန်ပေးဖို့ မျှော်လင့်ပါတယ်။ Initial data က `staleTime` သတ်မှတ်မထားရင် default အနေနဲ့ stale လို့ သတ်မှတ်ခံရပါတယ်။ `initialData` ကတော့ cache ထဲမှာ **မှတ်တမ်းတင် သိမ်းဆည်းခံရ (persist) ပါတယ်**။

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

သင့် `queryFn` က resolve လုပ်ပေးလိုက်တဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `TQueryFnData`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

သင့် `queryKey` ရဲ့ type ဖြစ်ပါတယ်။
