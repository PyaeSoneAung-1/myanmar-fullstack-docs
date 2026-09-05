---
title: "mutationOptions (mutation များအတွက် options object ကြိုတင်ဖန်တီးရန် function)"
description: "mutationOptions ရဲ့ overloads, type parameters နဲ့ Returns — useMutation အတွက် mutation options များကို ကြိုတင်ဖန်တီးပြီး mutationKey နဲ့ ပြန်ရှာနိုင်စေခြင်း"
order: 71
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/mutationOptions"
status: translated
updated: 2026-09-05
---

`useMutation` လို API တွေကို ခေါ်တဲ့အခါ တွဲသုံးဖို့ — mutation options object တစ်ခုကို ကြိုတင် ဖန်တီးပေးတဲ့ function ဖြစ်ပါတယ်။ Mutation တစ်ခုရဲ့ options တွေကို နေရာတစ်ခုတည်းမှာ သတ်မှတ်ထားပြီး — လိုအပ်တဲ့နေရာတွေမှာ ပြန်သုံးနိုင်အောင် လုပ်ပေးကာ type inference ကိုလည်း ထိန်းသိမ်းပေးပါတယ်။

## Call Signature

```ts
function mutationOptions<TData, TError, TVariables, TOnMutateResult>(options): WithRequired<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">;
```

`useMutation` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `mutationOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ overload မှာတော့ `mutationKey` က required ဖြစ်ပါတယ် — နောက်ပိုင်းမှာ mutation ကို (ဥပမာ `useMutationState` နဲ့) ပြန်ရှာလို့ ရအောင်ပါ။

### Type Parameters

#### TData

`TData` = `unknown`

#### TError

`TError` = `Error`

#### TVariables

`TVariables` = `void`

#### TOnMutateResult

`TOnMutateResult` = `unknown`

### Parameters

#### options

`WithRequired`\<[`UseMutationOptions`](/docs/tanstack-query/use-mutation-options)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

သုံးမယ့် mutation options တွေ — `useMutation` ဆီ ပို့ရမယ့်ပုံစံနဲ့ အတူတူပဲ ဖြစ်ပြီး `mutationKey` ကိုတော့ required အနေနဲ့ ထည့်ပေးရပါတယ်။

### Returns

`WithRequired`\<[`UseMutationOptions`](/docs/tanstack-query/use-mutation-options)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

ထည့်လိုက်တဲ့ options object အတိုင်း — ဘာမှ မပြောင်းလဲဘဲ ပြန်ရပါတယ်။

### See

ဒီ options တွေက ဖော်ပြတဲ့ mutation ကို run လုပ်ဖို့ [`useMutation`](/docs/tanstack-query/use-mutation) ကို ကြည့်ပါ။

### Example

Mutation ကို သူ့ရဲ့ `mutationKey` ကနေ တစ်နေရာရာမှာ ပြန်ရှာကြည့်တဲ့ ဥပမာ — ဥပမာ app တစ်ခုလုံးအတွက် "saving…" indicator ပြဖို့:
```tsx
import { mutationOptions, useMutationState } from '@tanstack/react-query'

const createPostOptions = mutationOptions({
  mutationKey: ['posts', 'create'],
  mutationFn: createPost,
})

function SavingIndicator() {
  const isCreatingPost = useMutationState({
    filters: { mutationKey: createPostOptions.mutationKey, status: 'pending' },
  }).length > 0

  return isCreatingPost ? <span>Saving…</span> : null
}
```

## Call Signature

```ts
function mutationOptions<TData, TError, TVariables, TOnMutateResult>(options): Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">;
```

`useMutation` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `mutationOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ overload မှာတော့ `mutationKey` မလိုအပ်ပါဘူး — နောက်ပိုင်းမှာ mutation ကို `mutationKey` filter (ဥပမာ `useMutationState`) နဲ့ ပစ်မှတ်ထားဖို့ မလိုအပ်တဲ့အခါ ဒီပုံစံကို သုံးပါ။ `status` လို တခြား filters တွေကနေတော့ ဆက်ပြီး observe လုပ်လို့ ရပါသေးတယ်။

### Type Parameters

#### TData

`TData` = `unknown`

#### TError

`TError` = `Error`

#### TVariables

`TVariables` = `void`

#### TOnMutateResult

`TOnMutateResult` = `unknown`

### Parameters

#### options

`Omit`\<[`UseMutationOptions`](/docs/tanstack-query/use-mutation-options)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

သုံးမယ့် mutation options တွေ — `useMutation` ဆီ ပို့ရမယ့်ပုံစံနဲ့ အတူတူပဲ ဖြစ်ပြီး `mutationKey` မပါဝင်ပါဘူး။

### Returns

`Omit`\<[`UseMutationOptions`](/docs/tanstack-query/use-mutation-options)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

ထည့်လိုက်တဲ့ options object အတိုင်း — ဘာမှ မပြောင်းလဲဘဲ ပြန်ရပါတယ်။

### See

ဒီ options တွေက ဖော်ပြတဲ့ mutation ကို run လုပ်ဖို့ [`useMutation`](/docs/tanstack-query/use-mutation) ကို ကြည့်ပါ။

### Remarks

`useMutationState` ကနေ mutation တစ်ခုကို ပြန်ရှာတဲ့ ဥပမာကို အခြား overload ရဲ့ Example မှာ ကြည့်ပါ။

### Example

```tsx
import { mutationOptions, useMutation } from '@tanstack/react-query'

export const createPostOptions = mutationOptions({
  mutationFn: createPost,
})

function CreatePost() {
  const mutation = useMutation(createPostOptions)
  return <button onClick={() => mutation.mutate({ title: 'Hello' })}>Create</button>
}
```
