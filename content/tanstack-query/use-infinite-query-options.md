---
title: "UseInfiniteQueryOptions (useInfiniteQuery ၏ options များအတွက် interface)"
description: "useInfiniteQuery က လက်ခံသော options — page များ fetch လုပ်ရန် TPageParam အပါအဝင် type parameters များ ပါဝင်သည့် interface"
order: 76
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseInfiniteQueryOptions"
status: translated
updated: 2026-09-05
---

`useInfiniteQuery` က လက်ခံတဲ့ options တွေ ဖြစ်ပါတယ်။ `@tanstack/query-core` က `InfiniteQueryObserverOptions` ကို extend လုပ်ထားပြီး — `react-query` အတွက်သာ သီးသန့်ရှိတဲ့ `subscribed` option ကို ထပ်ပေါင်းထားပြီး — `suspense` ကိုတော့ ဖယ်ထုတ်ထားပါတယ် (`react-query` က `suspense` ကို option အဖြစ် ထုတ်ပြမပေးဘဲ — ဘယ် hook ကို ခေါ်လဲဆိုတာကနေ ဆုံးဖြတ်ယူလို့ပါ)။

## Extends

- `OmitKeyof`\<`InfiniteQueryObserverOptions`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>, `"suspense"`\>

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

သင့် `queryFn` က resolve လုပ်ပေးလိုက်တဲ့ page တစ်ခုချင်းစီရဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ errors တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` run ပြီးနောက် `data` က ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ် — default အနေနဲ့ `InfiniteData<TQueryFnData>` ကို ယူပြီး၊ fetch လုပ်ထားတဲ့ pages အားလုံးရဲ့ ပုံစံနဲ့ သူတို့ရဲ့ page params တွေပါ ပါဝင်ပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

သင့် `queryKey` ရဲ့ type ဖြစ်ပါတယ်။

### TPageParam

`TPageParam` = `unknown`

ပေးထားတဲ့ page တစ်ခုကို fetch လုပ်ဖို့ `queryFn` ဆီ ပို့လိုက်တဲ့ parameter ရဲ့ type ဖြစ်ပါတယ်။

## Properties

### subscribed?

```ts
optional subscribed: boolean;
```

ဒါကို `false` ထားရင် — ဒီ observer က query cache ရဲ့ update တွေကို နားမထောင်တော့ဘဲ unsubscribe လုပ်လိုက်ပါတယ်။

#### Default Value

```ts
true
```
