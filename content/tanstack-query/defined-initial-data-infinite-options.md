---
title: "DefinedInitialDataInfiniteOptions (initialData သတ်မှတ်ထားချိန် infinite query options)"
description: "`infiniteQueryOptions` တွင် `initialData` သတ်မှတ်ထားချိန် ရွေးချယ်ခံရသော overload options type — ထိုအခါ `data` သည် ဘယ်တော့မှ `undefined` မဖြစ်"
order: 87
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/DefinedInitialDataInfiniteOptions"
status: translated
updated: 2026-09-05
---

[`infiniteQueryOptions`](/docs/tanstack-query/infinite-query-options) မှာ overload များစွာ ရှိပြီး — `initialData` သတ်မှတ်ထားတဲ့အခါ ဒီ `DefinedInitialDataInfiniteOptions` type ကို ရွေးချယ်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ result ရဲ့ `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး။

```ts
type DefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object;
```

## Type Declaration

### initialData

```ts
initialData: 
  | NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>
  | () => NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>
  | undefined;
```

ဒီ value ကို သတ်မှတ်ထားရင် — query ကို မဖန်တီးရသေးသရွေ့ (ဒါမှမဟုတ် cache လုပ်ပြီး မဖြစ်သေးသရွေ့) — အဲဒါကို query cache ရဲ့ initial data အဖြစ် အသုံးပြုပါလိမ့်မယ်။ Function တစ်ခုကို သတ်မှတ်ထားရင်တော့ ဒီ function ကို shared/root query စတင်ဆောက်တည်ချိန်မှာ **တစ်ကြိမ်သာ** ခေါ်ပြီး — initial data ကို synchronously ပြန်ပေးဖို့ မျှော်လင့်ပါတယ်။ Initial data ကို `staleTime` သတ်မှတ်မထားရင် default အနေနဲ့ stale လို့ သတ်မှတ်ပါတယ်။ `initialData` ကိုတော့ cache ထဲမှာ **persist လုပ်ပါတယ်** (ဆက်လက် သိမ်းဆည်းပါတယ်)။

## Type Parameters

### TQueryFnData

`TQueryFnData`

`queryFn` က resolve လုပ်ပေးလိုက်တဲ့ page တစ်ခုချင်းစီရဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

`queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ် — default ကတော့ fetch လုပ်ပြီးသား page တွေ အားလုံးနဲ့ သူတို့ရဲ့ page params တွေ ပါဝင်တဲ့ ပုံစံ `InfiniteData<TQueryFnData>` ဖြစ်ပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` ရဲ့ type ဖြစ်ပါတယ်။

### TPageParam

`TPageParam` = `unknown`

သတ်မှတ်ထားတဲ့ page တစ်ခုကို fetch လုပ်ဖို့ `queryFn` ဆီ ပို့လိုက်တဲ့ parameter ရဲ့ type ဖြစ်ပါတယ်။
