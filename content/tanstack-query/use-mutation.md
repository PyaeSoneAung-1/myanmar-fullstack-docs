---
title: "useMutation (Mutation run လုပ်ရန် hook)"
description: "useMutation ရဲ့ call signature, type parameters, options နဲ့ Returns — server side-effect (create/update/delete) တွေအတွက် hook"
order: 38
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useMutation"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useMutation<TData, TError, TVariables, TOnMutateResult>(options, queryClient?): UseMutationResult<TData, TError, TVariables, TOnMutateResult>;
```

Query တွေက data ဖတ်ဖို့ဆိုရင် — **mutation** တွေက data ဖန်တီး/ပြင်/ဖျက်ခြင်းနဲ့ server side-effect တွေအတွက် ဖြစ်ပြီး၊ အဲဒါအတွက် hook က `useMutation` ပါ။ Mutation ရဲ့ အသုံးပြုပုံအပြည့်အစုံကို [Mutations အသေးစိတ်](/docs/tanstack-query/mutations) မှာ ဖတ်နိုင်ပြီး — ဒီစာမျက်နှာက reference အနေနဲ့ signature နဲ့ result တွေကို ဖော်ပြပါတယ်။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TData` | `unknown` | `mutationFn` က resolve လုပ်တဲ့ data ရဲ့ type |
| `TError` | `Error` | `mutationFn` က throw နိုင်တဲ့ error ရဲ့ type |
| `TVariables` | `void` | `mutate` / `mutateAsync` ဆီ ပို့တဲ့ variable ရဲ့ type |
| `TOnMutateResult` | `unknown` | `onMutate` က return လုပ်တဲ့ type — ဒါက `onSuccess`/`onError`/`onSettled` တွေဆီ parameter အဖြစ် ရောက်သွားပြီး optimistic update ရဲ့ rollback data အတွက် အသုံးဝင်ပါတယ် |

## Parameters

**`options`** — [`UseMutationOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseMutationOptions) type ဖြစ်ပြီး `useMutation` ဆီ ပို့လို့ရတဲ့ option အကုန်လုံး ပါဝင်ပါတယ် — အဓိကတွေက:

| Option | အဓိပ္ပာယ် |
|---|---|
| `mutationFn` | async work လုပ်တဲ့ function — `(variables) => Promise` (required) |
| `mutationKey` | mutation ကို ခွဲခြားတဲ့ key — `useMutationState` လို နေရာကနေ ပြန်ရှာဖို့ သုံး |
| `onMutate` | `mutate` ခေါ်လိုက်တာနဲ့ ချက်ချင်း run တဲ့ callback — optimistic update မှာ cache ကို ကြိုပြင်ဖို့ [Optimistic Updates](/docs/tanstack-query/optimistic-updates) |
| `onSuccess` / `onError` / `onSettled` | mutation အောင်မြင် / မအောင်မြင် / ပြီးဆုံးချိန် callbacks — hook level မှာ သတ်မှတ်ထားရင် mutation တိုင်းအတွက် fire ပါတယ် |
| `retry` | failed mutation တွေကို ပြန်ကြိုးစားတဲ့ အကြိမ်ရေ |
| `networkMode` | network မရှိတဲ့အခါ ဘယ်လို ပြုမူမလဲ — [Network Mode](/docs/tanstack-query/network-mode) |
| `meta` | mutation နဲ့အတူ သယ်သွားချင်တဲ့ အချက်အလက် |

**`queryClient?`** — custom `QueryClient` instance ကို ပို့ချင်ရင် သုံးပါ; မပို့ရင် အနီးဆုံး `QueryClientProvider` context ကနေ ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

[`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseMutationResult) — query result နဲ့မတူဘဲ mutation မှာ `idle` state ပါဝင်ပြီး `pending` ဆိုတာ data မရှိလို့ မဟုတ်ဘဲ mutation run နေလို့ ဖြစ်ပါတယ်။ အဓိက fields တွေက:

| Property | အဓိပ္ပာယ် |
|---|---|
| `status` | `'idle'` \| `'pending'` \| `'error'` \| `'success'` |
| `data` | `success` ဖြစ်ရင် `mutationFn` ရဲ့ result (မဟုတ်ရင် `undefined`) |
| `variables` | နောက်ဆုံး `mutate` ခေါ်တုန်းက ပို့ခဲ့တဲ့ variable |
| `error` | error ဖြစ်ရင် error object (မဟုတ်ရင် `null`) |
| `isIdle` / `isPending` / `isSuccess` / `isError` | `status` ကနေ ဆင်းသက်လာတဲ့ convenience flags |
| `mutate(variables, callbacks?)` | fire-and-forget ပုံစံ — mutation ကို စတင်ခေါ်တဲ့ function |
| `mutateAsync(variables, callbacks?)` | `mutate` နဲ့တူပေမယ့် Promise ပြန်ပေးလို့ `await` လုပ်နိုင် |
| `reset()` | mutation state ကို `idle` အဖြစ် ပြန်သတ်မှတ်ပေးတဲ့ function |

**Per-call callbacks အကြောင်း သတိပြုစရာ** — `mutate`/`mutateAsync` ရဲ့ ဒုတိယ argument အနေနဲ့ per-call `onSuccess`/`onError`/`onSettled` callbacks တွေကို ထည့်လို့ရပါတယ် — ဒါက shared mutation definition နဲ့ မချိတ်ဘဲ call-site မှာပဲ side effect (ဥပမာ navigation) လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ Hook-level callbacks ကတော့ mutation တိုင်းအတွက် fire ပြီး — per-call callbacks က သင်ပြုလုပ်ခဲ့တဲ့ **နောက်ဆုံး call အတွက်ပဲ** fire ပါတယ်။ ပြီးတော့ component က mount ဖြစ်နေတုန်းမှာသာ အလုပ်လုပ်ပါတယ် — mutation မပြီးခင် component unmount ဖြစ်သွားရင် subscription ပျက်သွားလို့ per-call callbacks fire မှာ မဟုတ်ပါဘူး။

## ဥပမာများ

`onSuccess` မှာ `invalidateQueries` နဲ့ todos list ကို ပြန် fetch လုပ်တာ၊ `mutate` ရဲ့ per-call `onError` နဲ့ call-site မှာပဲ error ကို ကိုင်တွယ်တာ:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return (
    <button
      onClick={() =>
        addMutation.mutate('Item', {
          onError: (error) => console.error('Failed to add item:', error),
        })
      }
    >
      Add
    </button>
  )
}
```

Per-call callbacks က နောက်ဆုံး call အတွက်ပဲ fire လို့ — mutations အများကြီးကို တစ်ပြိုင်နက် ခေါ်ပြီး တစ်ခုချင်းစီရဲ့ ရလဒ်ကို သိချင်ရင် `mutateAsync` က call တစ်ခုစီအတွက် promise တစ်ခုစီ ပြန်ပေးပါတယ်။ တစ်ခုက ကျရှုံးလို့ ကျန်တာတွေရဲ့ အချက်အလက် မပျောက်စေချင်ရင် `Promise.all` အစား `Promise.allSettled` ကို သုံးနိုင်ပါတယ်:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodos() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  async function handleAddAll(todos: Array<string>) {
    const addResults = await Promise.allSettled(
      todos.map((todo) => addMutation.mutateAsync(todo)),
    )

    addResults.forEach((addResult, index) => {
      if (addResult.status === 'rejected') {
        console.error(`Failed to add "${todos[index]}":`, addResult.reason)
      }
    })
  }

  return (
    <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
      Add all
    </button>
  )
}
```

Optimistic update pattern (cache ကို `onMutate` မှာ ကြိုပြင်၊ `onError` မှာ rollback) အပြည့်အစုံနဲ့ — server data နဲ့ ညှိဖို့ `onSettled` မှာ invalidate လုပ်တာတွေကို [Optimistic Updates](/docs/tanstack-query/optimistic-updates) မှာ ကြည့်နိုင်ပါတယ်။ Mutation options တွေကို call sites အများအပြားကြား မျှဝေချင်ရင် `mutationOptions` helper ကိုလည်း သုံးနိုင်ပါတယ် — [TypeScript](/docs/tanstack-query/typescript) မှာ ဖတ်ပါ။
