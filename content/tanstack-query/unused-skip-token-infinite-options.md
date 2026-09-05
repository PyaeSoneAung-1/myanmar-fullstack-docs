---
title: "UnusedSkipTokenInfiniteOptions (skipToken မသုံးနိုင်သော infiniteQueryOptions overload ၏ options type)"
description: "initialData မရှိဘဲ queryFn က skipToken မဟုတ်တဲ့အခါ ရွေးချယ်ခံရတဲ့ infiniteQueryOptions overload ရဲ့ options type — queryFn နေရာမှာ skipToken မသုံးနိုင်"
order: 102
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UnusedSkipTokenInfiniteOptions"
status: translated
updated: 2026-09-05
---

```ts
type UnusedSkipTokenInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = OmitKeyof<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, "queryFn"> & object;
```

`initialData` မသတ်မှတ်ထားဘဲ `queryFn` က `skipToken` မဟုတ်တဲ့အခါ ရွေးချယ်ခံရတဲ့ `infiniteQueryOptions` overload က လက်ခံတဲ့ options type ဖြစ်ပါတယ် — [UndefinedInitialDataInfiniteOptions](/docs/tanstack-query/undefined-initial-data-infinite-options) နဲ့ အတူတူပါပဲ။ ဒါပေမယ့် ဒီ overload မှာ `queryFn` နေရာအတွက် `skipToken` ကို မသုံးနိုင်ပါဘူး။

## Type Declaration

### queryFn?

```ts
optional queryFn: Exclude<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>["queryFn"], SkipToken | undefined>;
```

ဒီနေရာမှာ `skipToken` ကို value အနေနဲ့ သုံးခွင့် မရှိပါဘူး — `initialData` မသတ်မှတ်ထားတဲ့အခါ ရွေးချယ်ခံရတဲ့ overload ဖြစ်လို့ပါ။ Query ကို ချက်ချင်း run ချင်သေးတာ မဟုတ်ရင် `enabled: false` ကို သတ်မှတ်ပါ — `queryFn` ကို ချန်လိုက်ရုံတစ်ခုတည်းနဲ့ fetch တစ်ခု ဖြစ်ပေါ်ပြီး `enabled` က `false` မဟုတ်ဘဲ default query function လည်း မရှိဘူးဆိုရင် "Missing queryFn" ဆိုတဲ့ error နဲ့ ကျရှုံးသွားပါတယ်။ Default query function က `queryFn` ကိုသာ ဖြည့်ဆည်းပေးတာ ဖြစ်ပြီး — fetch ကို သူ့ဘာသာသူ ရွှေ့ဆိုင်း (defer) လုပ်ပေးတာ မဟုတ်ပါဘူး။

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
