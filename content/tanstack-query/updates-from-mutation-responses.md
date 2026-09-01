---
title: "Mutation Responses တွေကနေ Update လုပ်ခြင်း (Updates from Mutation Responses)"
description: "Mutation အောင်မြင်တဲ့အခါ response data ကို `setQueryData` နဲ့ cache ထဲ ချက်ချင်း update လုပ်နည်း — onSuccess, reusable custom hook, immutability"
order: 24
source: "https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses"
status: translated
updated: 2026-09-01
---

Server ပေါ်မှာ object တွေကို **update** လုပ်တဲ့ mutations တွေ ကိုင်တွယ်တဲ့အခါ — object အသစ်က mutation ရဲ့ response ထဲမှာ အလိုအလျောက် ပြန်ပါလာတတ်တာ သာမာန်ပါ။ ကျွန်တော်တို့မှာ ရှိပြီးသား data အတွက် သက်ဆိုင်ရာ queries တွေကို ပြန် refetch လုပ်ပြီး network call တစ်ခု ဖြုန်းတီးတာအစား — mutation function က ပြန်ပေးတဲ့ object ကို အခွင့်ကောင်းယူပြီး — [Query Client ရဲ့ `setQueryData` method](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientsetquerydata) ကို သုံးကာ — ရှိပြီးသား query ကို data အသစ်နဲ့ ချက်ချင်း update လုပ်နိုင်ပါတယ်:

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: editTodo,
  onSuccess: (data) => {
    queryClient.setQueryData(['todo', { id: 5 }], data)
  },
})

mutation.mutate({
  id: 5,
  name: 'Do the laundry',
})

// အောက်က query ကို အောင်မြင်တဲ့ mutation ရဲ့
// response နဲ့ update လုပ်ပါလိမ့်မယ်
const { status, data, error } = useQuery({
  queryKey: ['todo', { id: 5 }],
  queryFn: fetchTodoById,
})
```

`onSuccess` logic ကို reusable mutation တစ်ခုထဲမှာ ချည်ထားချင်တယ်ဆိုရင် — ဒီလို custom hook တစ်ခု ဖန်တီးနိုင်ပါတယ်:

```tsx
const useMutateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editTodo,
    // ဒုတိယ argument က `mutate` function က လက်ခံရရှိတဲ့ variables object ဖြစ်တာ သတိပြုပါ
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['todo', { id: variables.id }], data)
    },
  })
}
```

## Immutability (မပြောင်းလဲနိုင်မှု)

`setQueryData` ကနေတစ်ဆင့် update လုပ်တာတွေကို _immutable_ (မပြောင်းလဲနိုင်သော) နည်းနဲ့ လုပ်ဆောင်ရပါမယ်။ **Cache ကနေ ရယူထားတဲ့ data ကို နေရာတွင်း (in place) mutate လုပ်ပြီး cache ထဲကို တိုက်ရိုက် ရေးဖို့ မကြိုးစားပါနဲ့။** အစပိုင်းမှာ အလုပ်လုပ်နိုင်ပေမယ့် — နောက်ပိုင်းမှာ သိမ်မွေ့တဲ့ bugs တွေကို ဖြစ်စေနိုင်ပါတယ်။

```tsx
queryClient.setQueryData(['posts', { id }], (oldData) => {
  if (oldData) {
    // ❌ ဒါကို မစမ်းပါနဲ့
    oldData.title = 'my new post title'
  }
  return oldData
})

queryClient.setQueryData(
  ['posts', { id }],
  // ✅ ဒါက မှန်ကန်တဲ့ နည်းလမ်းပါ
  (oldData) =>
    oldData
      ? {
          ...oldData,
          title: 'my new post title',
        }
      : oldData,
)
```
