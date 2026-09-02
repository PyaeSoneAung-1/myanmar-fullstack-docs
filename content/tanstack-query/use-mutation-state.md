---
title: "useMutationState (Mutation state များ ဝင်ရောက်ရန် hook)"
description: "useMutationState ရဲ့ call signature, type parameters, options နဲ့ Returns — MutationCache ထဲက mutation state အားလုံးကို filters နဲ့ select သုံးပြီး ဝင်ရောက်ခြင်း"
order: 44
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useMutationState"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useMutationState<TResult, TMutation>(options, queryClient?): TResult[];
```

`useMutationState` က `MutationCache` ထဲမှာ ရှိနေတဲ့ mutation အားလုံးရဲ့ state တွေဆီ ဝင်ရောက်ခွင့် ပေးတဲ့ hook ပါ။ `filters` (MutationFilters) ပေးပြီး ကိုက်ညီတဲ့ mutation တွေကို ရွေးထုတ်နိုင်ပြီး — `select` နဲ့ mutation state တစ်ခုချင်းစီကနေ လိုချင်တဲ့ အချက်အလက်ကို ထုတ်ယူနိုင်ပါတယ်။ ဒါကြောင့် mutation ကို run လုပ်နေတဲ့ component မှာပဲ မဟုတ်ဘဲ — app ထဲက ဘယ်နေရာကမဆို mutation တွေရဲ့ state/result တွေကို ဖတ်လို့ ရပါတယ်။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TResult` | `MutationState<unknown, Error, unknown, unknown>` | ရလဒ် array ထဲက element တစ်ခုချင်းစီရဲ့ type — `select` ပေးထားရင် select ရဲ့ return type၊ မပေးရင် mutation state object |
| `TMutation` | `MutationTypeFromResult<TResult>` (ပုံမှန် — `Mutation<any, any, any, any>` ကို extend လုပ်ထားရမယ်) | `filters`/`select` တွေဆီ ရောက်သွားတဲ့ mutation instance ရဲ့ type |

## Parameters

**`options`** — `MutationStateOptions<TResult, TMutation>` type ဖြစ်ပြီး default က `{}` (empty object) — fields တွေက:

| Option | အဓိပ္ပာယ် |
|---|---|
| `filters` | `MutationFilters` — ဘယ် mutation တွေကို ထည့်သွင်းမလဲ ဆုံးဖြတ်တဲ့ filter (`mutationKey`, `status`, `predicate` စသည်) — [Filters](/docs/tanstack-query/filters) |
| `select` | `(mutation: TMutation) => TResult` — mutation state တစ်ခုချင်းစီကနေ လိုချင်တဲ့ တန်ဖိုးကို ထုတ်ယူတဲ့ transformation (optional) |

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`TResult[]` — filter နဲ့ ကိုက်ညီတဲ့ mutation တစ်ခုချင်းစီအတွက် `select` ရဲ့ ရလဒ် ပါဝင်တဲ့ array။ `select` မပေးရင် element တစ်ခုချင်းစီက `MutationState` object (mutation ရဲ့ `state` တစ်ခုလုံး) ဖြစ်ပါတယ်။

## ဥပမာများ

Run နေတဲ့ (pending) mutation တွေရဲ့ variable အားလုံးကို စုယူခြင်း:

```tsx
import { useMutationState } from '@tanstack/react-query'

function PendingPosts() {
  const pendingVariables = useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => mutation.state.variables,
  })

  return <>{pendingVariables.length} posts saving...</>
}
```

`mutationKey` တစ်ခုတည်းကို [useMutation](/docs/tanstack-query/use-mutation) နဲ့ မျှဝေသုံးထားပြီး — အဲဒီ key နဲ့ ကိုက်ညီတဲ့ mutation တွေရဲ့ data အားလုံးကို ပြန်ယူခြင်း:

```tsx
import { useMutation, useMutationState } from '@tanstack/react-query'

const mutationKey = ['posts']

function Posts() {
  // state ကို လိုချင်တဲ့ mutation — အပေါ်က mutationKey နဲ့ ကိုက်ညီအောင် သတ်မှတ်ထားတယ်
  const mutation = useMutation({
    mutationKey,
    mutationFn: createPosts,
  })

  const savedPosts = useMutationState({
    // ဒီ mutation key က အပေါ်က mutation ရဲ့ mutation key နဲ့ ကိုက်ညီဖို့ လိုပါတယ် (see above)
    filters: { mutationKey, status: 'success' },
    select: (mutation) => mutation.state.data,
  })

  return (
    <button onClick={() => mutation.mutate(['New Post'])}>
      Create post ({savedPosts.length} saved so far)
    </button>
  )
}
```

နောက်ဆုံး mutation ရဲ့ data ကို `mutationKey` ကနေ ရယူခြင်း — `mutate` ကို ခေါ်လိုက်တိုင်း mutation cache ထဲမှာ entry အသစ်တစ်ခု `gcTime` milliseconds ကြာ ထပ်ပေါင်းပါတယ်။ ဒါကြောင့် နောက်ဆုံး invocation ရဲ့ data ကို ရဖို့ `useMutationState` ပြန်ပေးတဲ့ array ရဲ့ နောက်ဆုံး item ကို စစ်ပါ:

```tsx
import { useMutationState } from '@tanstack/react-query'

function LatestPost() {
  const savedPosts = useMutationState({
    filters: { mutationKey: ['posts'], status: 'success' },
    select: (mutation) => mutation.state.data,
  })

  const latestSavedPost = savedPosts[savedPosts.length - 1]

  return <>{latestSavedPost ? 'Saved' : 'Nothing saved yet'}</>
}
```

Mutation state တွေရဲ့ အသေးစိတ် (status, variables, data စသည်) နဲ့ cache ထဲမှာ mutation entry တွေ ဘယ်လို သက်တမ်းတိုးသွားလဲဆိုတာကို [Mutations](/docs/tanstack-query/mutations) မှာ ကြည့်နိုင်ပါတယ်။
