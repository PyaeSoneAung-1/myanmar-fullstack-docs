---
title: "UseMutationOptions (useMutation ၏ options များအတွက် interface)"
description: "useMutation က လက်ခံသော options — MutationObserverOptions ကို အခြေခံပြီး အတွင်းပိုင်း _defaulted flag မပါဝင်သည့် interface"
order: 77
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseMutationOptions"
status: translated
updated: 2026-09-05
---

`useMutation` က လက်ခံတဲ့ options တွေ ဖြစ်ပါတယ်။ `@tanstack/query-core` က `MutationObserverOptions` နဲ့ အတူတူပါပဲ — အတွင်းပိုင်း `_defaulted` flag မပါဝင်တာပဲ ကွာပါတယ်။

## Extends

- `OmitKeyof`\<`MutationObserverOptions`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"_defaulted"`\>

## Type Parameters

### TData

`TData` = `unknown`

သင့် mutation function က resolve လုပ်ပေးတဲ့ type ဖြစ်ပါတယ်။

### TError

`TError` = `DefaultError`

သင့် mutation function က throw လုပ်နိုင်တဲ့ errors တွေရဲ့ type ဖြစ်ပါတယ်။

### TVariables

`TVariables` = `void`

`mutate`/`mutateAsync` ဆီ ပို့လိုက်တဲ့ variable ရဲ့ type ဖြစ်ပါတယ်။

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` က ပြန်ပေးတဲ့ type ဖြစ်ပြီး — `onSuccess`/`onError`/`onSettled` တို့ဆီ သူတို့ရဲ့ `onMutateResult` parameter အနေနဲ့ ရောက်သွားပါတယ် — optimistic-update တွေကို rollback လုပ်ဖို့ လိုတဲ့ data အတွက် အသုံးဝင်ပါတယ်။
