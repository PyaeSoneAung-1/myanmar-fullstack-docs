---
title: "UseBaseMutationResult (useMutation ၏ အခြေခံ result type)"
description: "useMutation ရဲ့ result type — mutate ကို fire-and-forget signature အဖြစ် ကျဉ်းမြောင်းထားပြီး mutateAsync ပါ ထပ်ဖြည့်ထားခြင်း"
order: 104
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseBaseMutationResult"
status: translated
updated: 2026-09-05
---

```ts
type UseBaseMutationResult<TData, TError, TVariables, TOnMutateResult> = Override<MutationObserverResult<TData, TError, TVariables, TOnMutateResult>, {
  mutate: UseMutateFunction<TData, TError, TVariables, TOnMutateResult>;
}> & object;
```

`useMutation` ရဲ့ result type ဖြစ်ပါတယ်။ `@tanstack/query-core` ထဲက MutationObserverResult နဲ့ အတူတူပါပဲ — ဒါပေမယ့် `mutate` ကို fire-and-forget ပုံစံ [UseMutateFunction](/docs/tanstack-query/use-mutate-function) signature အနေနဲ့ ကျဉ်းမြောင်းထားပြီး `mutateAsync` ကိုပါ ထပ်ဖြည့်ထားပါတယ်။

## Type Declaration

### mutateAsync

```ts
mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TOnMutateResult>;
```

`mutate` နဲ့ ဆင်တူပြီး — await လုပ်လို့ရတဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

## Type Parameters

### TData

`TData` = `unknown`

သင့် mutation function က resolve လုပ်ပေးလိုက်တဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် mutation function က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TVariables

`TVariables` = `unknown`

`mutate`/`mutateAsync` ဆီ ပို့ပေးလိုက်တဲ့ variable ရဲ့ type ဖြစ်ပါတယ်။

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` က ပြန်ပေးလိုက်တဲ့ type ဖြစ်ပြီး — `onSuccess`/`onError`/`onSettled` တွေဆီ သူတို့ရဲ့ `onMutateResult` parameter အနေနဲ့ ပို့ပေးပါတယ်။ Optimistic update တွေကို ပြန်လှည့်ဖျက် (rollback) ဖို့ လိုအပ်တဲ့ data တွေအတွက် အသုံးဝင်ပါတယ်။
