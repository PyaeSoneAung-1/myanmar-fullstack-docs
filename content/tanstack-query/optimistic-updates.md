---
title: "Optimistic Updates (အကောင်းမြင်အမြင် Updates)"
description: "mutation မပြီးဆုံးခင် UI ကို optimistic အနေနဲ့ update လုပ်ခြင်း — variables နဲ့ UI ကနေ တစ်ဆင့်, onMutate နဲ့ cache ကနေ တစ်ဆင့် နည်းလမ်းနှစ်မျိုး, rollback လုပ်နည်း"
order: 11
source: "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates"
status: translated
updated: 2026-09-01
---

React Query က mutation မပြီးဆုံးခင် UI ကို optimistically (အကောင်းမြင်စိတ်နဲ့ ကြိုတင်) update လုပ်ဖို့ နည်းလမ်း နှစ်မျိုး ထောက်ပံ့ပေးပါတယ် — `onMutate` option သုံးပြီး cache ကို တိုက်ရိုက် update လုပ်တာ၊ ဒါမှမဟုတ် `useMutation` result ကနေ ပြန်ရတဲ့ `variables` ကို သုံးပြီး UI ကို update လုပ်တာ ဆိုပြီး ဖြစ်ပါတယ်။

## UI ကနေ တစ်ဆင့်

ဒါက ပိုရိုးရှင်းတဲ့ နည်းလမ်းပါ — cache ကို တိုက်ရိုက် ထိတွေ့စရာ မလိုပါဘူး။

```tsx
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  // query invalidation ရဲ့ Promise ကို _return_ လုပ်ဖို့ သေချာလုပ်ပါ
  // ဒါမှ refetch မပြီးမချင်း mutation က `pending` state မှာ ရှိနေမှာပါ
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

const { isPending, submittedAt, variables, mutate, isError } = addTodoMutation
```

ပြီးရင် `addTodoMutation.variables` ကို သုံးလို့ ရပါပြီ — အဲဒီထဲမှာ ထည့်လိုက်တဲ့ todo ပါပါတယ်။ Query ကို render လုပ်ထားတဲ့ UI list ထဲမှာ mutation က `isPending` ဖြစ်နေချိန် item တစ်ခု ထပ်ထည့်လို့ ရပါတယ်:

```tsx
<ul>
  {todoQuery.items.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
  {isPending && <li style={{ opacity: 0.5 }}>{variables}</li>}
</ul>
```

Mutation pending ဖြစ်နေသရွေ့ `opacity` ခြားနားတဲ့ ယာယီ item တစ်ခုကို render လုပ်နေတာပါ။ Mutation ပြီးဆုံးတာနဲ့ အဲဒီ item က အလိုအလျောက် render မလုပ်တော့ပါဘူး။ Refetch အောင်မြင်ခဲ့တယ်ဆိုရင် — အဲဒီ item ကို list ထဲမှာ "ပုံမှန် item" တစ်ခုအနေနဲ့ မြင်ရမှာပါ။

Mutation မှာ error ဖြစ်ရင်လည်း item က ပျောက်သွားပါမယ်။ ဒါပေမယ့် လိုချင်ရင် mutation ရဲ့ `isError` state ကို စစ်ပြီး ဆက်ပြသနိုင်ပါတယ်။ `variables` တွေက mutation error ဖြစ်တဲ့အခါ _ရှင်းပစ်ခံရတာ မဟုတ်ပါဘူး_ — ဒါကြောင့် သူတို့ကို ဆက်သုံးလို့ရပြီး retry button တောင် ပြနိုင်ပါတယ်:

```tsx
{
  isError && (
    <li style={{ color: 'red' }}>
      {variables}
      <button onClick={() => mutate(variables)}>Retry</button>
    </li>
  )
}
```

### Mutation နဲ့ query က component တစ်ခုတည်းမှာ မရှိရင်

ဒီနည်းလမ်းက mutation နဲ့ query က component တစ်ခုတည်းမှာ ရှိနေရင် အလွန်ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် — တခြား component တွေထဲက mutation တွေရဲ့ state ကိုလည်း `useMutationState` ဆိုတဲ့ သီးသန့် hook နဲ့ ရယူနိုင်ပါတယ်။ `mutationKey` နဲ့ တွဲသုံးရင် အကောင်းဆုံးပါ:

```tsx
// သင့် app ထဲက တစ်နေရာရာမှာ
const { mutate } = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  mutationKey: ['addTodo'],
})

// variables တွေကို တစ်ခြားနေရာကနေ ရယူမယ်
const variables = useMutationState<string>({
  filters: { mutationKey: ['addTodo'], status: 'pending' },
  select: (mutation) => mutation.state.variables,
})
```

`variables` က `Array` ဖြစ်ပါလိမ့်မယ် — ဘာကြောင့်လဲဆိုတော့ mutation အများကြီး တစ်ချိန်တည်း run နေနိုင်လို့ပါ။ Item တွေအတွက် unique key လိုအပ်ရင် `mutation.state.submittedAt` ကိုလည်း select လုပ်နိုင်ပါတယ်။ ဒါက concurrent optimistic updates (တစ်ပြိုင်နက် ဖြစ်နေတဲ့ update တွေ) ကို ပြသဖို့တောင် လွယ်ကူစေပါတယ်။

## Cache ကနေ တစ်ဆင့်

Mutation မလုပ်ခင် state ကို optimistically update လုပ်တဲ့အခါ — mutation က မအောင်မြင်ဘဲ ဖြစ်သွားနိုင်ခြေ ရှိပါတယ်။ Failure တွေထဲက အများစုမှာ optimistic query တွေကို refetch လုပ်ပြီး သူတို့ရဲ့ တကယ့် server state ကို ပြန်ရောက်အောင် လုပ်လိုက်ရုံပါပဲ။ ဒါပေမယ့် အချို့အခြေအနေတွေမှာ refetch က မှန်ကန်စွာ အလုပ်မလုပ်နိုင်ဘဲ — mutation error က refetch မဖြစ်နိုင်အောင် တားဆီးတဲ့ server issue အမျိုးအစားတစ်ခုခု ဖြစ်နေနိုင်ပါတယ်။ အဲဒီလိုအခါမှာ သင့် update ကို ပြန်လှိမ့် (roll back) လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။

ဒါလုပ်ဖို့ `useMutation` ရဲ့ `onMutate` handler option က value တစ်ခုကို ပြန်ပေးစေနိုင်ပြီး — အဲဒီ value က နောက်ပိုင်းမှာ `onError` နဲ့ `onSettled` handlers နှစ်ခုလုံးဆီကို နောက်ဆုံး argument အနေနဲ့ ထည့်ပေးမှာ ဖြစ်ပါတယ်။ အများစုမှာ rollback function တစ်ခုကို ပေးတာက အသုံးအဝင်ဆုံးပါ။

### Todo အသစ်တစ်ခု ထည့်တဲ့အခါ todo list ကို update လုပ်ခြင်း

```tsx
const queryClient = useQueryClient()

useMutation({
  mutationFn: updateTodo,
  // mutate ကို ခေါ်လိုက်တဲ့အခါ:
  onMutate: async (newTodo, context) => {
    // သွားနေတဲ့ refetch တွေကို cancel လုပ်မယ်
    // (သူတို့က ကျွန်တော်တို့ရဲ့ optimistic update ကို မဖျက်ဆီးစေဖို့)
    await context.client.cancelQueries({ queryKey: ['todos'] })

    // အရင် value ကို snapshot လုပ်မယ်
    const previousTodos = context.client.getQueryData(['todos'])

    // Optimistically update လုပ်ပြီး value အသစ်ကို ထည့်မယ်
    context.client.setQueryData(['todos'], (old) => [...old, newTodo])

    // Snapshot လုပ်ထားတဲ့ value နဲ့ result ကို ပြန်ပေးမယ်
    return { previousTodos }
  },
  // Mutation မအောင်မြင်ရင်
  // onMutate ကနေ ပြန်ပေးလိုက်တဲ့ result ကို သုံးပြီး roll back လုပ်မယ်
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(['todos'], onMutateResult.previousTodos)
  },
  // Error ဖြစ်ဖြစ် success ဖြစ်ဖြစ် အမြဲတမ်း refetch လုပ်မယ်:
  onSettled: (data, error, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ['todos'] }),
})
```

### Todo တစ်ခုတည်းကို update လုပ်ခြင်း

```tsx
useMutation({
  mutationFn: updateTodo,
  // mutate ကို ခေါ်လိုက်တဲ့အခါ:
  onMutate: async (newTodo, context) => {
    // သွားနေတဲ့ refetch တွေကို cancel လုပ်မယ်
    // (သူတို့က ကျွန်တော်တို့ရဲ့ optimistic update ကို မဖျက်ဆီးစေဖို့)
    await context.client.cancelQueries({ queryKey: ['todos', newTodo.id] })

    // အရင် value ကို snapshot လုပ်မယ်
    const previousTodo = context.client.getQueryData(['todos', newTodo.id])

    // Optimistically update လုပ်ပြီး value အသစ်ကို ထည့်မယ်
    context.client.setQueryData(['todos', newTodo.id], newTodo)

    // အရင် todo နဲ့ todo အသစ်ပါတဲ့ result ကို ပြန်ပေးမယ်
    return { previousTodo, newTodo }
  },
  // Mutation မအောင်မြင်ရင် အပေါ်မှာ ပြန်ပေးထားတဲ့ result ကို သုံးမယ်
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(
      ['todos', onMutateResult.newTodo.id],
      onMutateResult.previousTodo,
    )
  },
  // Error ဖြစ်ဖြစ် success ဖြစ်ဖြစ် အမြဲတမ်း refetch လုပ်မယ်:
  onSettled: (newTodo, error, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ['todos', newTodo.id] }),
})
```

လိုချင်ရင် သီးခြား `onError` နဲ့ `onSuccess` handlers တွေအစား `onSettled` function ကို တစ်ခုတည်း သုံးလို့လည်း ရပါတယ်:

```tsx
useMutation({
  mutationFn: updateTodo,
  // ...
  onSettled: async (newTodo, error, variables, onMutateResult, context) => {
    if (error) {
      // တစ်ခုခု လုပ်ပါ
    }
  },
})
```

## ဘယ်အချိန်မှာ ဘယ်နည်းကို သုံးမလဲ

Optimistic result ကို ပြသဖို့ နေရာတစ်ခုတည်းပဲ ရှိတယ်ဆိုရင် — `variables` ကို သုံးပြီး UI ကို တိုက်ရိုက် update လုပ်တာက code ပိုနည်းပြီး ယေဘုယျအားဖြင့် နားလည်ရ ပိုလွယ်ပါတယ်။ ဥပမာ — rollback လုပ်ဖို့တောင် မလိုပါဘူး။

ဒါပေမယ့် screen ပေါ်မှာ update အကြောင်း သိထားဖို့ လိုတဲ့ နေရာ အများကြီး ရှိတယ်ဆိုရင် — cache ကို တိုက်ရိုက် ကိုင်တွယ်တာက ဒါကို အလိုအလျောက် ဂရုစိုက်ပေးပါလိမ့်မယ်။

## ဆက်လက်ဖတ်ရှုရန်

TkDodo ရေးထားတဲ့ [Concurrent Optimistic Updates](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query) guide ကို ကြည့်ပါ။
