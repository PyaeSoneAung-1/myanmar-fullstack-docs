---
title: "UsePrefetchQueryOptions (usePrefetchQuery ၏ options type)"
description: "usePrefetchQuery က လက်ခံတဲ့ options type — queryClient.query ဆီ ပို့လို့ရတဲ့ options အားလုံး ပါဝင်ခြင်း"
order: 111
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UsePrefetchQueryOptions"
status: translated
updated: 2026-09-05
---

```ts
type UsePrefetchQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> = DistributiveOmit<QueryExecuteOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, "queryFn"> & object;
```

`usePrefetchQuery` က လက်ခံတဲ့ options type ဖြစ်ပါတယ် — `queryClient.query` ဆီ ပို့လို့ရတဲ့ အရာအားလုံး ပါဝင်ပြီး — default query function သတ်မှတ်ထားတာမျိုး မဟုတ်ရင် `queryFn` ကိုတော့ မဖြစ်မနေ ပေးရပါတယ်။

## Type Declaration

### queryFn?

```ts
optional queryFn: Exclude<QueryExecuteOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>["queryFn"], SkipToken>;
```

ဒီနေရာမှာ `skipToken` ကို value အနေနဲ့ သုံးခွင့် မရှိပါဘူး — prefetch တစ်ခု တကယ် run ဖို့ဆိုရင် query function အမြဲ လိုအပ်လို့ပါ (default query function သတ်မှတ်ထားရင်တော့ ချွင်းချက်ပါ)။

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

သင့် `queryFn` က resolve လုပ်ပေးလိုက်တဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `TQueryFnData`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပြီး — `select` မသုံးတဲ့အခါ `TQueryFnData` အတိုင်း ဖြစ်ပါတယ်။

### TQueryData

`TQueryData` = `TQueryFnData`

Query cache ထဲမှာ တကယ်တမ်း သိမ်းထားတဲ့ data ရဲ့ type ဖြစ်ပြီး — `select` နဲ့ `placeholderData` တို့ရဲ့ input လည်း ဖြစ်ပါတယ်။ Default ကလည်း `TQueryFnData` ဖြစ်ပြီး အများအားဖြင့် `TQueryFnData` နဲ့ပဲ တူညီပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

သင့် `queryKey` ရဲ့ type ဖြစ်ပါတယ်။
