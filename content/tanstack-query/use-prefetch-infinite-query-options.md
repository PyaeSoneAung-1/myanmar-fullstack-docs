---
title: "UsePrefetchInfiniteQueryOptions (usePrefetchInfiniteQuery ၏ options type)"
description: "usePrefetchInfiniteQuery က လက်ခံတဲ့ options type — queryClient.infiniteQuery ဆီ ပို့လို့ရတဲ့ options အားလုံး ပါဝင်ခြင်း"
order: 110
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UsePrefetchInfiniteQueryOptions"
status: translated
updated: 2026-09-05
---

```ts
type UsePrefetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = DistributiveOmit<InfiniteQueryExecuteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, "queryFn"> & object;
```

`usePrefetchInfiniteQuery` က လက်ခံတဲ့ options type ဖြစ်ပါတယ် — `queryClient.infiniteQuery` ဆီ ပို့လို့ရတဲ့ အရာအားလုံး ပါဝင်ပြီး — default query function သတ်မှတ်ထားတာမျိုး မဟုတ်ရင် `queryFn` ကိုတော့ မဖြစ်မနေ ပေးရပါတယ်။

## Type Declaration

### queryFn?

```ts
optional queryFn: Exclude<InfiniteQueryExecuteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>["queryFn"], SkipToken>;
```

ဒီနေရာမှာ `skipToken` ကို value အနေနဲ့ သုံးခွင့် မရှိပါဘူး — prefetch တစ်ခု တကယ် run ဖို့ဆိုရင် query function အမြဲ လိုအပ်လို့ပါ (default query function သတ်မှတ်ထားရင်တော့ ချွင်းချက်ပါ)။

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

သင့် `queryFn` က resolve လုပ်ပေးလိုက်တဲ့ page တစ်ခုချင်းစီရဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပြီး — default က `InfiniteData<TQueryFnData>` ပါ (fetch လုပ်ပြီးသား page အားလုံးရဲ့ data တွေနဲ့ page params တွေ ပါဝင်တဲ့ ပုံစံ)။ Prefetch က `data` ကို ပြန်ဖတ်တာ မလုပ်တာမို့ — ဒီ parameter က ဒီ options တွေကို `select` နဲ့တကွ တစ်နေရာမှာ ပြန်သုံးမယ်ဆိုရင်မှသာ အဓိပ္ပာယ် ရှိပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

သင့် `queryKey` ရဲ့ type ဖြစ်ပါတယ်။

### TPageParam

`TPageParam` = `unknown`

သတ်မှတ်ထားတဲ့ page တစ်ခုကို fetch လုပ်ဖို့ `queryFn` ဆီ ပို့ပေးလိုက်တဲ့ parameter ရဲ့ type ဖြစ်ပါတယ်။
