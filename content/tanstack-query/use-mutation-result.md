---
title: "UseMutationResult (useMutation ၏ result type)"
description: "useMutation ရဲ့ result type — UseBaseMutationResult နဲ့ အတူတူ"
order: 109
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseMutationResult"
status: translated
updated: 2026-09-05
---

```ts
type UseMutationResult<TData, TError, TVariables, TOnMutateResult> = UseBaseMutationResult<TData, TError, TVariables, TOnMutateResult>;
```

`useMutation` ရဲ့ result type ဖြစ်ပါတယ်။ [UseBaseMutationResult](/docs/tanstack-query/use-base-mutation-result) နဲ့ အတူတူပါပဲ။

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
