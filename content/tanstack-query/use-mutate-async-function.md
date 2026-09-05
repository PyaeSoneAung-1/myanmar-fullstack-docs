---
title: "UseMutateAsyncFunction (mutateAsync ၏ function type)"
description: "useMutation က ပြန်ပေးတဲ့ mutateAsync function ရဲ့ type — mutate နဲ့ ဆင်တူပြီး await လုပ်လို့ရတဲ့ promise ကို ပြန်ပေး"
order: 107
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseMutateAsyncFunction"
status: translated
updated: 2026-09-05
---

```ts
type UseMutateAsyncFunction<TData, TError, TVariables, TOnMutateResult> = MutateFunction<TData, TError, TVariables, TOnMutateResult>;
```

`useMutation` က ပြန်ပေးတဲ့ `mutateAsync` ရဲ့ type ဖြစ်ပါတယ်။ [UseMutateFunction](/docs/tanstack-query/use-mutate-function) နဲ့ ဆင်တူပြီး — await လုပ်လို့ရတဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

## Type Parameters

### TData

`TData` = `unknown`

သင့် mutation function က resolve လုပ်ပေးလိုက်တဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် mutation function က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TVariables

`TVariables` = `void`

`mutateAsync` ဆီ ပို့ပေးလိုက်တဲ့ variable ရဲ့ type ဖြစ်ပါတယ်။

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` က ပြန်ပေးလိုက်တဲ့ type ဖြစ်ပြီး — `onSuccess`/`onError`/`onSettled` တွေဆီ သူတို့ရဲ့ `onMutateResult` parameter အနေနဲ့ ပို့ပေးပါတယ်။ Optimistic update တွေကို ပြန်လှည့်ဖျက် (rollback) ဖို့ လိုအပ်တဲ့ data တွေအတွက် အသုံးဝင်ပါတယ်။
