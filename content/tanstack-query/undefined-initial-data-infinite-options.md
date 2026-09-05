---
title: "UndefinedInitialDataInfiniteOptions (initialData မသတ်မှတ်ထားသော infiniteQueryOptions ၏ options type)"
description: "initialData မသတ်မှတ်ထားတဲ့အခါ ရွေးချယ်ခံရတဲ့ infiniteQueryOptions overload ရဲ့ options type — query က pending ဖြစ်နေစဉ် data က undefined ဖြစ်နိုင်ခြင်း"
order: 100
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UndefinedInitialDataInfiniteOptions"
status: translated
updated: 2026-09-05
---

```ts
type UndefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object;
```

`initialData` မသတ်မှတ်ထားတဲ့အခါ ရွေးချယ်ခံရတဲ့ `infiniteQueryOptions` overload က လက်ခံတဲ့ options type ဖြစ်ပါတယ် — ဒီအခြေအနေမှာ query က `pending` ဖြစ်နေစဉ် `data` က `undefined` ဖြစ်နိုင်ပါတယ်။

## Type Declaration

### initialData?

```ts
optional initialData: 
  | NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>
| InitialDataFunction<NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>>;
```

သတ်မှတ်ထားမယ်ဆိုရင် ဒီ value ကို query cache ရဲ့ initial data အဖြစ် သုံးပါလိမ့်မယ် (query ကို အသစ် မဖန်တီးရသေး / cache မလုပ်ရသေးသရွေ့)။ Function အနေနဲ့ သတ်မှတ်ထားရင် — function ကို shared/root query initialization လုပ်နေစဉ်မှာ **တစ်ကြိမ်တည်း** ခေါ်ပြီး initial data ကို synchronously ပြန်ပေးဖို့ မျှော်လင့်ပါတယ်။ Initial data က `staleTime` သတ်မှတ်မထားရင် default အနေနဲ့ stale လို့ သတ်မှတ်ခံရပါတယ်။ `initialData` ကတော့ cache ထဲမှာ **မှတ်တမ်းတင် သိမ်းဆည်းခံရ (persist) ပါတယ်**။

## Type Parameters

### TQueryFnData

`TQueryFnData`

သင့် `queryFn` က resolve လုပ်ပေးလိုက်တဲ့ page တစ်ခုချင်းစီရဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပြီး — default က `InfiniteData<TQueryFnData>` ဖြစ်ပါတယ် (fetch လုပ်ပြီးသား page တွေအားလုံးရဲ့ data တွေနဲ့ သူတို့ရဲ့ page params တွေ ပါဝင်တဲ့ ပုံစံ)။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

သင့် `queryKey` ရဲ့ type ဖြစ်ပါတယ်။

### TPageParam

`TPageParam` = `unknown`

သတ်မှတ်ထားတဲ့ page တစ်ခုကို fetch လုပ်ဖို့ `queryFn` ဆီ ပို့ပေးလိုက်တဲ့ parameter ရဲ့ type ဖြစ်ပါတယ်။
