---
title: "UseSuspenseQueryOptions (useSuspenseQuery ၏ options များအတွက် interface)"
description: "useSuspenseQuery က လက်ခံသော options — enabled, throwOnError, placeholderData တို့ မပါဝင်သည့် interface"
order: 80
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseSuspenseQueryOptions"
status: translated
updated: 2026-09-05
---

`useSuspenseQuery` က လက်ခံတဲ့ options တွေ ဖြစ်ပါတယ်။ [`UseQueryOptions`](/docs/tanstack-query/use-query-options) နဲ့ အတူတူပါပဲ — `enabled`, `throwOnError`, `placeholderData` တို့ မပါဝင်တာပဲ ကွာပါတယ် — Suspense hooks တွေက "disabled" ဒါမှမဟုတ် "placeholder" state ကို render လုပ်လို့ မရတာမို့ ဒီ options တွေ အသုံးမဝင်ပါဘူး။

## Extends

- `OmitKeyof`\<[`UseQueryOptions`](/docs/tanstack-query/use-query-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>, `"queryFn"` \| `"enabled"` \| `"throwOnError"` \| `"placeholderData"`\>

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

### queryFn?

```ts
optional queryFn: QueryFunction<TQueryFnData, TQueryKey, never>;
```

ဒီနေရာမှာ `skipToken` ကို ခွင့်မပြုပါဘူး — Suspense hooks တွေက "disabled" state ကို render လုပ်လို့ မရတာမို့ — default query function တစ်ခု သတ်မှတ်ထားခြင်း မရှိရင် query function ကို အမြဲတမ်း ပေးထားရပါမယ်။

***

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
