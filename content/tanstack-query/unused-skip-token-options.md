---
title: "UnusedSkipTokenOptions (skipToken မသုံးနိုင်သော queryOptions overload ၏ options type)"
description: "initialData မရှိဘဲ queryFn က skipToken မဟုတ်တဲ့အခါ ရွေးချယ်ခံရတဲ့ queryOptions overload ရဲ့ options type — queryFn နေရာမှာ skipToken မသုံးနိုင်"
order: 103
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UnusedSkipTokenOptions"
status: translated
updated: 2026-09-05
---

```ts
type UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey> = OmitKeyof<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object;
```

`initialData` မသတ်မှတ်ထားဘဲ `queryFn` က `skipToken` မဟုတ်တဲ့အခါ ရွေးချယ်ခံရတဲ့ `queryOptions` overload က လက်ခံတဲ့ options type ဖြစ်ပါတယ် — [UndefinedInitialDataOptions](/docs/tanstack-query/undefined-initial-data-options) နဲ့ အတူတူပါပဲ။ ဒါပေမယ့် ဒီ overload မှာ `queryFn` နေရာအတွက် `skipToken` ကို မသုံးနိုင်ပါဘူး။

## Type Declaration

### queryFn?

```ts
optional queryFn: Exclude<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>["queryFn"], SkipToken | undefined>;
```

ဒီနေရာမှာ `skipToken` ကို value အနေနဲ့ သုံးခွင့် မရှိပါဘူး — `initialData` မသတ်မှတ်ထားတဲ့အခါ ရွေးချယ်ခံရတဲ့ overload ဖြစ်လို့ပါ။ Query ကို ချက်ချင်း run ချင်သေးတာ မဟုတ်ရင် `enabled: false` ကို သတ်မှတ်ပါ — `queryFn` ကို ချန်လိုက်ရုံတစ်ခုတည်းနဲ့ fetch တစ်ခု ဖြစ်ပေါ်ပြီး `enabled` က `false` မဟုတ်ဘဲ default query function လည်း မရှိဘူးဆိုရင် "Missing queryFn" ဆိုတဲ့ error နဲ့ ကျရှုံးသွားပါတယ်။ Default query function က `queryFn` ကိုသာ ဖြည့်ဆည်းပေးတာ ဖြစ်ပြီး — fetch ကို သူ့ဘာသာသူ ရွှေ့ဆိုင်း (defer) လုပ်ပေးတာ မဟုတ်ပါဘူး။

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
