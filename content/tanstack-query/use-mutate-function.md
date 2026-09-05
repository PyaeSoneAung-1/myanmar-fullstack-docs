---
title: "UseMutateFunction (mutate ၏ function type)"
description: "useMutation က ပြန်ပေးတဲ့ mutate function ရဲ့ type — fire-and-forget ပုံစံမို့ error တွေကို throw မလုပ်ဘဲ mutation result ကနေ ဖော်ပြပေးခြင်း"
order: 108
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseMutateFunction"
status: translated
updated: 2026-09-05
---

```ts
type UseMutateFunction<TData, TError, TVariables, TOnMutateResult> = (...args) => void;
```

`useMutation` က ပြန်ပေးတဲ့ `mutate` ရဲ့ type ဖြစ်ပါတယ်။ Variables တွေ (နဲ့ optional ဖြစ်တဲ့ — call တစ်ခုချင်းစီအတွက် `onSuccess`/`onError`/`onSettled` တွေ) ကို နောက်ခံ `mutate` call ဆီ ဆက်ပို့ပေးပါတယ်။ Fire-and-forget ပုံစံမို့ — error တွေကို throw လုပ်မယ့်အစား mutation result ကနေ တစ်ဆင့် ဖော်ပြပေးပါတယ်။

## Type Parameters

### TData

`TData` = `unknown`

သင့် mutation function က resolve လုပ်ပေးလိုက်တဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် mutation function က throw လုပ်နိုင်တဲ့ error တွေရဲ့ type ဖြစ်ပါတယ်။

### TVariables

`TVariables` = `void`

`mutate` ဆီ ပို့ပေးလိုက်တဲ့ variable ရဲ့ type ဖြစ်ပါတယ်။

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` က ပြန်ပေးလိုက်တဲ့ type ဖြစ်ပြီး — `onSuccess`/`onError`/`onSettled` တွေဆီ သူတို့ရဲ့ `onMutateResult` parameter အနေနဲ့ ပို့ပေးပါတယ်။ Optimistic update တွေကို ပြန်လှည့်ဖျက် (rollback) ဖို့ လိုအပ်တဲ့ data တွေအတွက် အသုံးဝင်ပါတယ်။

## Parameters

### args

...`Parameters`\<`MutateFunction`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>\>

## Returns

`void`
