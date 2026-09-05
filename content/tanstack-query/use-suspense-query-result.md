---
title: "UseSuspenseQueryResult (useSuspenseQuery ၏ result type)"
description: "useSuspenseQuery ရဲ့ result type — DefinedUseQueryResult နဲ့ တူပြီး အမြဲ false ဖြစ်နေတဲ့ isPlaceholderData field ကို ဖယ်ထားခြင်း"
order: 114
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseSuspenseQueryResult"
status: translated
updated: 2026-09-05
---

```ts
type UseSuspenseQueryResult<TData, TError> = DistributiveOmit<DefinedQueryObserverResult<TData, TError>, "isPlaceholderData">;
```

`useSuspenseQuery` ရဲ့ result type ဖြစ်ပါတယ်။ [DefinedUseQueryResult](/docs/tanstack-query/defined-use-query-result) နဲ့ အတူတူပါပဲ — `isPlaceholderData` ကတော့ ဖယ်ထားပါတယ်။ ဒီ type မှာ အဲဒီ field က အမြဲ `false` ဖြစ်နေတာမို့ — အသက်ဝင်နေတဲ့ state တစ်ခုကို ဖယ်လိုက်တာ မဟုတ်ဘဲ အသုံးမကျတဲ့ field (dead field) ကို ဖယ်လိုက်တာပါ။

## Type Parameters

### TData

`TData` = `unknown`

`select` run ပြီးနောက်မှာ `data` အနေနဲ့ ရောက်ရှိသွားတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် `queryFn` က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။
