---
title: "UseQueryOptions (useQuery ၏ options များအတွက် interface)"
description: "useQuery က လက်ခံသော options — UseBaseQueryOptions ကို အခြေခံပြီး suspense မပါဝင်သည့် interface"
order: 78
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseQueryOptions"
status: translated
updated: 2026-09-05
---

`useQuery` က လက်ခံတဲ့ options တွေ ဖြစ်ပါတယ်။ [`UseBaseQueryOptions`](/docs/tanstack-query/use-base-query-options) နဲ့ အတူတူပါပဲ — `suspense` မပါဝင်တာပဲ ကွာပါတယ် (`react-query` က `suspense` ကို option အဖြစ် ထုတ်ပြမပေးဘဲ — ဘယ် hook ကို ခေါ်လဲဆိုတာကနေ ဆုံးဖြတ်ယူလို့ပါ)။

## Extends

- `OmitKeyof`\<[`UseBaseQueryOptions`](/docs/tanstack-query/use-base-query-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryFnData`, `TQueryKey`\>, `"suspense"`\>

## Type Parameters

### TQueryFnData

`TQueryFnData` = `unknown`

သင့် `queryFn` က resolve လုပ်ပေးတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ errors တွေရဲ့ type ဖြစ်ပါတယ်။

### TData

`TData` = `TQueryFnData`

`select` run ပြီးနောက် `data` က ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။ `select` မသုံးတဲ့အခါ `TQueryFnData` ကို default အနေနဲ့ ယူပါတယ်။

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

သင့် `queryKey` ရဲ့ type ဖြစ်ပါတယ်။

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

#### Inherited from

```ts
OmitKeyof.subscribed
```
