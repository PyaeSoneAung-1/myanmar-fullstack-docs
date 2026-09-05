---
title: "UseSuspenseInfiniteQueryOptions (useSuspenseInfiniteQuery ၏ options များအတွက် interface)"
description: "useSuspenseInfiniteQuery က လက်ခံသော options — enabled, throwOnError, placeholderData တို့ မပါဝင်သည့် interface"
order: 79
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseSuspenseInfiniteQueryOptions"
status: translated
updated: 2026-09-05
---

`useSuspenseInfiniteQuery` က လက်ခံတဲ့ options တွေ ဖြစ်ပါတယ်။ [`UseInfiniteQueryOptions`](/docs/tanstack-query/use-infinite-query-options) နဲ့ အတူတူပါပဲ — `enabled`, `throwOnError`, `placeholderData` တို့ မပါဝင်တာပဲ ကွာပါတယ် — Suspense hooks တွေက "disabled" ဒါမှမဟုတ် "placeholder" state ကို render လုပ်လို့ မရတာမို့ ဒီ options တွေ အသုံးမဝင်ပါဘူး။

## Extends

- `OmitKeyof`\<[`UseInfiniteQueryOptions`](/docs/tanstack-query/use-infinite-query-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>, `"queryFn"` \| `"enabled"` \| `"throwOnError"` \| `"placeholderData"`\>

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

### queryFn?

```ts
optional queryFn: QueryFunction<TQueryFnData, TQueryKey, TPageParam>;
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
