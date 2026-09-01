---
title: "Initial Query Data (ကနဦး Query ဒေတာ)"
description: "Query အတွက် initial data ထည့်သွင်းနည်း — `initialData` option, `staleTime` နဲ့ `initialDataUpdatedAt`, initial data function, cache ကနေ initial data ယူနည်း"
order: 22
source: "https://tanstack.com/query/latest/docs/framework/react/guides/initial-query-data"
status: translated
updated: 2026-09-01
---

Query တစ်ခုအတွက် initial data ကို လိုအပ်ချိန်မတိုင်ခင် cache ထဲကို ထည့်သွင်းဖို့ နည်းလမ်းမျိုးစုံ ရှိပါတယ်:

- Declaratively (ကြေညာနည်းအရ):
  - Query တစ်ခုကို `initialData` ပေးပြီး — cache ဗလာ ဖြစ်နေရင် ကြိုဖြည့်ထားပါ
- Imperatively (လုပ်ဆောင်နည်းအရ):
  - [`queryClient.query` သုံးပြီး data ကို prefetch လုပ်ပါ](/docs/tanstack-query/prefetching)
  - [`queryClient.setQueryData` သုံးပြီး data ကို cache ထဲ ကိုယ်တိုင် ထည့်ပါ](/docs/tanstack-query/prefetching)

## `initialData` သုံးပြီး Query တစ်ခုကို ကြိုဖြည့်ခြင်း

တစ်ခါတလေ — သင့် app ထဲမှာ query တစ်ခုအတွက် initial data ရှိပြီးသား ဖြစ်ပြီး — အဲဒါကို query ဆီ တိုက်ရိုက် ပေးလိုက်ရုံပဲ ရှိတတ်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ — `config.initialData` option ကို သုံးပြီး query တစ်ခုအတွက် initial data သတ်မှတ်ကာ — ကနဦး loading state ကို ကျော်သွားနိုင်ပါတယ်!

> အရေးကြီးသည်: `initialData` က cache ထဲမှာ ထိန်းသိမ်းခံရပြီး — placeholder, partial (တစ်စိတ်တစ်ပိုင်း) ဒါမှမဟုတ် မပြည့်စုံတဲ့ data တွေကို ဒီ option မှာ ထည့်ဖို့ အကြံပြုမထားပါဘူး — အဲဒီအစား `placeholderData` ကို သုံးပါ

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
})
```

### `staleTime` နဲ့ `initialDataUpdatedAt`

Default အနေနဲ့ — `initialData` က အခုလေးတင် fetch လုပ်လိုက်သလို လုံးဝ fresh လို့ သတ်မှတ်ခံရပါတယ်။ ဒါက `staleTime` option က ဒါကို ဘယ်လို ဘာသာပြန်ဆိုမလဲဆိုတာကိုလည်း သက်ရောက်မှု ရှိပါတယ်။

- Query observer ကို `initialData` နဲ့ configure လုပ်ပြီး `staleTime` မပါရင် (default `staleTime: 0`) — query က mount ဖြစ်တာနဲ့ ချက်ချင်း refetch လုပ်ပါတယ်:

  ```tsx
  // initialTodos ကို ချက်ချင်း ပြမယ် — ဒါပေမယ့် mount ပြီးတာနဲ့ todos တွေကိုလည်း ချက်ချင်း refetch လုပ်ပါမယ်
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    initialData: initialTodos,
  })
  ```

- Query observer ကို `initialData` နဲ့ `staleTime` `1000` ms နဲ့ configure လုပ်ရင် — data က query function ကနေ အခုလေးတင် fetch လုပ်လိုက်သလို — အဲဒီအချိန်အတွက် fresh လို့ သတ်မှတ်ခံရပါတယ်။

  ```tsx
  // initialTodos ကို ချက်ချင်း ပြမယ် — ဒါပေမယ့် 1000 ms ပြီးတဲ့နောက်
  // တခြား interaction event တစ်ခု ကြုံရတဲ့အထိ refetch မလုပ်ပါဘူး
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    initialData: initialTodos,
    staleTime: 1000,
  })
  ```

- ဒါဆိုရင် — သင့်ရဲ့ `initialData` က လုံးဝ fresh မဟုတ်ဘူးဆိုရင်ကော? အဲဒါက ကျွန်တော်တို့ကို နောက်ဆုံး configuration ဆီ ခေါ်သွားပါတယ် — အဲဒါက တကယ်တော့ အမှန်ကန်ဆုံး ဖြစ်ပြီး `initialDataUpdatedAt` ဆိုတဲ့ option ကို သုံးပါတယ်။ ဒီ option က — initialData ကိုယ်တိုင် နောက်ဆုံး update ဖြစ်ခဲ့တဲ့ အချိန်ကို milliseconds နဲ့ ရေးတဲ့ numeric JS timestamp တစ်ခု ထည့်ပေးနိုင်စေပါတယ် — ဥပမာ `Date.now()` က ပေးတဲ့ပုံစံမျိုးပါ။ Unix timestamp ရှိနေရင် — `1000` နဲ့ မြှောက်ပြီး JS timestamp အဖြစ် ပြောင်းဖို့ လိုမယ်ဆိုတာ သတိပြုပါ။

  ```tsx
  // initialTodos ကို ချက်ချင်း ပြမယ် — ဒါပေမယ့် 1000 ms ပြီးတဲ့နောက်
  // တခြား interaction event တစ်ခု ကြုံရတဲ့အထိ refetch မလုပ်ပါဘူး
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    initialData: initialTodos,
    staleTime: 60 * 1000, // 1 မိနစ်
    // ဒါက လွန်ခဲ့တဲ့ 10 စက္ကန့် ဒါမှမဟုတ် 10 မိနစ်က ဖြစ်နိုင်ပါတယ်
    initialDataUpdatedAt: initialTodosUpdatedTimestamp, // eg. 1608412420052
  })
  ```

  ဒီ option က staleTime ကို မူရင်း ရည်ရွယ်ချက်အတိုင်း — data က ဘယ်လောက် fresh ဖြစ်ဖို့ လိုသလဲ ဆုံးဖြတ်ဖို့ — သုံးနိုင်စေသလို — `initialData` က `staleTime` ထက် ပိုဟောင်းနေရင် mount ဖြစ်ချိန်မှာ data ကို refetch လုပ်နိုင်စေပါတယ်။ အပေါ်က ဥပမာမှာ — ကျွန်တော်တို့ရဲ့ data က 1 မိနစ်အတွင်း fresh ဖြစ်ဖို့ လိုပြီး — initialData ကို ဘယ်တော့ နောက်ဆုံး update လုပ်ခဲ့လဲဆိုတာကို query ဆီ hint ပေးထားလို့ — data ကို ပြန် refetch ရမလား မရဘူးလားဆိုတာ query က ကိုယ်တိုင် ဆုံးဖြတ်နိုင်ပါတယ်။

  > သင့်ရဲ့ data ကို **prefetched data** အနေနဲ့ သဘောထားချင်တယ်ဆိုရင် — cache ကို ကြိုတင် ဖြည့်ဖို့ `query` API ကို သုံးဖို့ အကြံပြုပါတယ် — အဲဒီလိုဆိုရင် သင့် `staleTime` ကို `initialData` နဲ့ သီးခြားစီ configure လုပ်နိုင်မှာ ဖြစ်လို့ပါ။

### Initial Data Function

Query တစ်ခုရဲ့ initial data ကို ရယူတဲ့ လုပ်ငန်းစဉ်က လေးလံတယ်ဆိုရင် — ဒါမှမဟုတ် render တိုင်း မလုပ်ချင်ဘူးဆိုရင် — `initialData` တန်ဖိုးအနေနဲ့ function တစ်ခုကို ထည့်ပေးနိုင်ပါတယ်။ ဒီ function က query ကို initialize လုပ်တဲ့အခါ တစ်ကြိမ်တည်းသာ run မှာမို့ — အဖိုးတန်တဲ့ memory နဲ့/ဒါမှမဟုတ် CPU တွေ ချွေတာနိုင်ပါတယ်:

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: () => getExpensiveTodos(),
})
```

### Cache ကနေ Initial Data

အခြေအနေတစ်ချို့မှာ — တခြား query တစ်ခုရဲ့ cached result ကနေ initial data ကို ထောက်ပံ့ပေးနိုင်ပါတယ်။ ကောင်းတဲ့ ဥပမာတစ်ခုက — todos list query ရဲ့ cached data ထဲမှာ ရှာပြီး individual todo item တစ်ခုကို ရယူကာ — အဲဒါကို individual todo query ရဲ့ initial data အဖြစ် သုံးတာပါ:

```tsx
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch('/todos'),
  initialData: () => {
    // 'todos' query ကနေ todo တစ်ခုကို ဒီ todo query ရဲ့ initial data အဖြစ် သုံးပါမယ်
    return queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId)
  },
})
```

### Cache ကနေ Initial Data — `initialDataUpdatedAt` နဲ့အတူ

Cache ကနေ initial data ရယူတာဆိုတာ — သင်ရှာဖွေနေတဲ့ source query က ဖြစ်နိုင်ခြေ များတာက ဟောင်းနေပြီလို့ ဆိုလိုပါတယ်။ Query ကို ချက်ချင်း refetch မဖြစ်အောင် artificial `staleTime` တစ်ခု သုံးတာအစား — source query ရဲ့ `dataUpdatedAt` ကို `initialDataUpdatedAt` ဆီ ထည့်ပေးဖို့ အကြံပြုပါတယ်။ ဒါက query instance ကို — initial data ပေးထားတာနဲ့ မသက်ဆိုင်ဘဲ — query ကို ပြန် refetch လိုအပ်လား၊ လိုရင် ဘယ်အချိန်မှာလဲ ဆုံးဖြတ်ဖို့ လိုအပ်တဲ့ အချက်အလက် အားလုံးကို ပေးပါတယ်။

```tsx
const result = useQuery({
  queryKey: ['todos', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () =>
    queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId),
  initialDataUpdatedAt: () =>
    queryClient.getQueryState(['todos'])?.dataUpdatedAt,
})
```

### Cache ကနေ Conditional Initial Data

Initial data ရှာဖို့ သုံးနေတဲ့ source query က ဟောင်းနေတယ်ဆိုရင် — cached data ကို လုံးဝ မသုံးဘဲ server ကနေပဲ fetch လုပ်ချင်တာ ဖြစ်နိုင်ပါတယ်။ ဒီဆုံးဖြတ်ချက် ပိုလွယ်ကူအောင် — `queryClient.getQueryState` method ကို သုံးပြီး source query အကြောင်း အချက်အလက် ပိုရယူနိုင်ပါတယ် — `state.dataUpdatedAt` timestamp လည်း ပါဝင်လို့ — query က သင့်လိုအပ်ချက်အတွက် "fresh" လုံလောက်မှု ရှိမရှိ ဆုံးဖြတ်နိုင်ပါတယ်:

```tsx
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    // Query state ကို ယူပါ
    const state = queryClient.getQueryState(['todos'])

    // Query ရှိပြီး data က 10 စက္ကန့်ထက် မပိုဟောင်းဘူးဆိုရင်...
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      // individual todo ကို ပြန်ပေးပါ
      return state.data.find((d) => d.id === todoId)
    }

    // မဟုတ်ရင် undefined ပြန်ပေးပြီး hard loading state ကနေ fetch လုပ်ခွင့်ပြုပါ!
  },
})
```

## ဆက်လက်ဖတ်ရှုရန်

`Initial Data` နဲ့ `Placeholder Data` ကြား နှိုင်းယှဉ်မှုအတွက် — [TkDodo ရဲ့ ဆောင်းပါး](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query) ကို ကြည့်ပါ။
