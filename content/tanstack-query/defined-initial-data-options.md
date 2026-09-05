---
title: "DefinedInitialDataOptions (initialData သတ်မှတ်ထားချိန် query options)"
description: "`queryOptions` တွင် `initialData` သတ်မှတ်ထားချိန် ရွေးချယ်ခံရသော overload options type — ထိုအခါ `data` သည် ဘယ်တော့မှ `undefined` မဖြစ်"
order: 88
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/DefinedInitialDataOptions"
status: translated
updated: 2026-09-05
---

[`queryOptions`](/docs/tanstack-query/query-options-function) မှာ overload များစွာ ရှိပြီး — `initialData` သတ်မှတ်ထားတဲ့အခါ ဒီ `DefinedInitialDataOptions` type ကို ရွေးချယ်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ result ရဲ့ `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး။

```ts
type DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object;
```

## Type Declaration

### initialData

```ts
initialData: 
  | NonUndefinedGuard<TQueryFnData>
| () => NonUndefinedGuard<TQueryFnData>;
```

ဒီ value ကို သတ်မှတ်ထားရင် — query ကို မဖန်တီးရသေးသရွေ့ (ဒါမှမဟုတ် cache လုပ်ပြီး မဖြစ်သေးသရွေ့) — အဲဒါကို query cache ရဲ့ initial data အဖြစ် အသုံးပြုပါလိမ့်မယ်။ Function တစ်ခုကို သတ်မှတ်ထားရင်တော့ ဒီ function ကို shared/root query စတင်ဆောက်တည်ချိန်မှာ **တစ်ကြိမ်သာ** ခေါ်ပြီး — initial data ကို synchronously ပြန်ပေးဖို့ မျှော်လင့်ပါတယ်။ Initial data ကို `staleTime` သတ်မှတ်မထားရင် default အနေနဲ့ stale လို့ သတ်မှတ်ပါတယ်။ `initialData` ကိုတော့ cache ထဲမှာ **persist လုပ်ပါတယ်** (ဆက်လက် သိမ်းဆည်းပါတယ်)။

### queryFn?

```ts
optional queryFn: QueryFunction<TQueryFnData, TQueryKey>;
```

ဒီနေရာမှာ optional ဖြစ်ပေမယ့် — fetch လုပ်ဖို့ ဘယ်တော့မှ ကြိုးစားမှာ မဟုတ်တဲ့ အခြေအနေမျိုးမှာသာ ချန်လိုက်တာ အန္တရာယ်ကင်းပါတယ် — ဥပမာ `enabled: false` ထားတာ ဒါမှမဟုတ် default query function သတ်မှတ်ထားတာမျိုးပါ။ အဲဒီလိုမဟုတ်ရင် `queryFn` မပါတဲ့ enabled query က fetch လုပ်ဖို့ ကြိုးစားဆဲဖြစ်ပြီး "Missing queryFn" error နဲ့ ကျရှုံးပါတယ် — `initialData` က ဒါကို တားဆီးမပေးနိုင်ပါဘူး။

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

`queryFn` က resolve လုပ်ပေးလိုက်တဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

`queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `TQueryFnData`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` ရဲ့ type ဖြစ်ပါတယ်။
