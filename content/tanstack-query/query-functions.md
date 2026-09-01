---
title: "Query Functions (query လုပ်ဆောင်ချက်များ)"
description: "query function ဆိုတာ ဘာလဲ — promise ပြန်ပေးတဲ့ function ပုံစံအမျိုးမျိုး, error handling, fetch နဲ့ အသုံးပြုပုံ, QueryFunctionContext အသေးစိတ်"
order: 8
source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-functions"
status: translated
updated: 2026-09-01
---

Query function ဆိုတာ **promise ပြန်ပေးတဲ့** ဘယ် function မဆို ဖြစ်နိုင်ပါတယ်။ ပြန်ပေးတဲ့ promise က **data ကို resolve လုပ်တာ** ဒါမှမဟုတ် **error တစ်ခုကို throw လုပ်တာ** ဖြစ်ရပါမယ်။

အောင်မြင်တဲ့အခါ resolve လုပ်လိုက်တဲ့ value က `undefined` **မဟုတ်တဲ့** ဘာမဆို ဖြစ်နိုင်ပါတယ်။ `undefined` ကို resolve လုပ်တဲ့ query တွေက [failed (မအောင်မြင်တဲ့) query အဖြစ် သတ်မှတ်ခံရပါတယ်](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-4#undefined-is-an-illegal-cache-value-for-successful-queries)။ Query cache ထဲမှာ "ဘာမှ မရှိ" ဆိုတဲ့ အခြေအနေကို အောင်မြင်တဲ့ result အဖြစ် သိမ်းချင်ရင် `undefined` အစား `null` ကို resolve လုပ်ပါ။

အောက်ပါတွေက အကုန်လုံး မှန်ကန်တဲ့ query function configuration တွေပါ:

```tsx
useQuery({ queryKey: ['todos'], queryFn: fetchAllTodos })
useQuery({ queryKey: ['todos', todoId], queryFn: () => fetchTodoById(todoId) })
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId)
    return data
  },
})
useQuery({
  queryKey: ['todos', todoId],
  queryFn: ({ queryKey }) => fetchTodoById(queryKey[1]),
})
```

## Error handling နဲ့ throw လုပ်ခြင်း

TanStack Query က query တစ်ခု error ဖြစ်တယ်လို့ သိဖို့အတွက် query function က **throw လုပ်ရပါမယ်** ဒါမှမဟုတ် **rejected Promise** တစ်ခုကို ပြန်ပေးရပါမယ်။ Query function ထဲမှာ throw လုပ်လိုက်တဲ့ error ဘယ်ဟာမဆို query ရဲ့ `error` state ပေါ်မှာ သိမ်းထားပါတယ်။

```tsx
const { error } = useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error('Oh no!')
    }
    if (somethingElseGoesWrong) {
      return Promise.reject(new Error('Oh no!'))
    }

    return data
  },
})
```

## `fetch` နဲ့ တခြား default အနေနဲ့ throw မလုပ်တဲ့ client တွေနဲ့ အသုံးပြုခြင်း

`axios` ဒါမှမဟုတ် `graphql-request` လို့ utilities အများစုက unsuccessful HTTP call တွေအတွက် error ကို အလိုအလျောက် throw လုပ်ပေးပေမယ့် — `fetch` လို့ အချို့ utilities တွေကတော့ default အနေနဲ့ throw မလုပ်ပါဘူး။ အဲဒီလိုဆိုရင် သင်ကိုယ်တိုင် throw လုပ်ပေးဖို့ လိုပါတယ်။ လူသုံးများတဲ့ `fetch` API နဲ့ လုပ်နိုင်တဲ့ ရိုးရှင်းတဲ့ နည်းလမ်းတစ်ခုပါ:

```tsx
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const response = await fetch('/todos/' + todoId)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
})
```

## Query Function Variables

Query keys တွေက သင်ယူနေတဲ့ data ကို သီးခြားခွဲခြားဖို့အတွက်သာ မဟုတ်ပါဘူး — `QueryFunctionContext` ရဲ့ အစိတ်အပိုင်းအနေနဲ့ သင့် query function ထဲကို အဆင်ပြေစွာ ထည့်ပေးလည်း ပေးပါတယ်။ အမြဲတမ်း မလိုအပ်ပေမယ့် — ဒါက လိုအပ်ရင် query function တွေကို သီးခြား ထုတ်ယူသုံးလို့ ရစေပါတယ်:

```tsx
function Todos({ status, page }) {
  const result = useQuery({
    queryKey: ['todos', { status, page }],
    queryFn: fetchTodoList,
  })
}

// Query function ထဲမှာ key, status နဲ့ page variables တွေကို သုံးနိုင်တယ်!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey
  return new Promise()
}
```

### QueryFunctionContext

`QueryFunctionContext` ဆိုတာ query function တစ်ခုစီဆီကို ထည့်ပေးလိုက်တဲ့ object ပါ။ သူ့မှာ ပါဝင်တာတွေက:

- `queryKey: QueryKey`: [Query Keys](/docs/tanstack-query/query-keys)
- `client: QueryClient`: [QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- `signal?: AbortSignal`
  - TanStack Query က ထောက်ပံ့ပေးတဲ့ [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) instance
  - [Query Cancellation](/docs/tanstack-query/query-cancellation) အတွက် သုံးနိုင်တယ်
- `meta: Record<string, unknown> | undefined`
  - သင့် query အကြောင်း အပိုအချက်အလက်တွေနဲ့ ဖြည့်လို့ရတဲ့ optional field

ဒါတွေအပြင် [Infinite Queries](/docs/tanstack-query/infinite-queries) တွေက ဒီ options တွေကိုပါ ရရှိပါတယ်:

- `pageParam: TPageParam`
  - လက်ရှိ page ကို fetch လုပ်ဖို့ သုံးတဲ့ page parameter
- `direction: 'forward' | 'backward'`
  - **deprecated** (အသုံးမပြုတော့ဘူးလို့ သတ်မှတ်ထား)
  - လက်ရှိ page fetch ရဲ့ ဦးတည်ချက်
  - လက်ရှိ page fetch ရဲ့ ဦးတည်ချက်ကို ရယူချင်ရင် `getNextPageParam` နဲ့ `getPreviousPageParam` ကနေ `pageParam` ထဲကို direction တစ်ခု ထည့်ပေးပါ။
