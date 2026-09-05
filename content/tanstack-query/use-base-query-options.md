---
title: "UseBaseQueryOptions (useQuery/useSuspenseQuery ၏ options များအတွက် အခြေခံ interface)"
description: "useQuery နှင့် useSuspenseQuery မျှဝေသုံးသော options — QueryObserverOptions ကို subscribed option ဖြင့် extend လုပ်ထားသည့် interface"
order: 75
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseBaseQueryOptions"
status: translated
updated: 2026-09-05
---

`useQuery` နဲ့ `useSuspenseQuery` နှစ်ခုလုံးက မျှဝေသုံးတဲ့ options တွေ ဖြစ်ပါတယ်။ `@tanstack/query-core` က `QueryObserverOptions` ကို extend လုပ်ထားပြီး — `react-query` အတွက်သာ သီးသန့်ရှိတဲ့ `subscribed` option ကို ထပ်ပေါင်းထားပါတယ်။

## Extends

- `QueryObserverOptions`\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

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

### TQueryData

`TQueryData` = `TQueryFnData`

query cache ထဲမှာ တကယ် သိမ်းထားတဲ့ data ရဲ့ type — `select` နဲ့ `placeholderData` တို့ဆီ ထည့်သွင်းပေးတဲ့ input ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် `TQueryFnData` နဲ့ အတူတူပဲ ဖြစ်ပြီး — သတ်မှတ်မထားရင် `TQueryFnData` ကို default ယူပါတယ်။

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
