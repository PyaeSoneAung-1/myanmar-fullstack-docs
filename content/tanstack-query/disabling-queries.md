---
title: "Query တွေကို Disable/Pause လုပ်ခြင်း"
description: "enabled: false option နဲ့ query တွေကို အလိုအလျောက် run မလုပ်စေခြင်း — disabled query တွေရဲ့ state များ, lazy queries, isLoading, skipToken နဲ့ type-safe disable လုပ်ခြင်း"
order: 15
source: "https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries"
status: translated
updated: 2026-09-01
---

Query တစ်ခုကို အလိုအလျောက် run မလုပ်စေချင်ဘူးဆိုရင် — `enabled = false` option ကို သုံးနိုင်ပါတယ်။ `enabled` option က boolean ပြန်ပေးတဲ့ callback တစ်ခုကိုလည်း လက်ခံပါတယ်။

`enabled` က `false` ဖြစ်တဲ့အခါ:

- Query မှာ cached data ရှိနေရင် — query ကို `status === 'success'` ဒါမှမဟုတ် `isSuccess` state နဲ့ စတင်ပါလိမ့်မယ်။
- Query မှာ cached data မရှိဘူးဆိုရင် — query က `status === 'pending'` နဲ့ `fetchStatus === 'idle'` state ကနေ စတင်ပါလိမ့်မယ်။
- Query က mount လုပ်တဲ့အခါ အလိုအလျောက် fetch လုပ်မှာ မဟုတ်ပါဘူး။
- Query က background မှာ အလိုအလျောက် refetch လုပ်မှာ မဟုတ်ပါဘူး။
- ပုံမှန်အားဖြင့် query ကို refetch ဖြစ်စေမယ့် query client ရဲ့ `invalidateQueries` နဲ့ `refetchQueries` ခေါ်ဆိုမှုတွေကို query က လျစ်လျူရှုပါလိမ့်မယ်။
- `useQuery` ကနေ ပြန်ရတဲ့ `refetch` ကို သုံးပြီး query ကို manual အနေနဲ့ fetch လုပ်ဖို့ trigger လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် `skipToken` နဲ့တော့ အလုပ်မလုပ်ပါဘူး။

> TypeScript အသုံးပြုသူတွေအတွက် — `enabled = false` ရဲ့ အခြားရွေးချယ်စရာအဖြစ် [skipToken](#typesafe-disabling-of-queries-using-skiptoken) ကို သုံးချင်နိုင်ပါတယ်။

```tsx
function Todos() {
  const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
    enabled: false,
  })

  return (
    <div>
      <button onClick={() => refetch()}>Fetch Todos</button>

      {data ? (
        <ul>
          {data.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>Not ready ...</span>
      )}

      <div>{isFetching ? 'Fetching...' : null}</div>
    </div>
  )
}
```

Query တစ်ခုကို အပြီးအပိုင် disable လုပ်ခြင်းက TanStack Query ရဲ့ ကောင်းမွန်တဲ့ feature တွေ (background refetches လိုမျိုး) အများကြီးကနေ ထွက်သွားစေပြီး — ဒါက idiomatic (ပုံမှန်ကျင့်သုံးတဲ့) နည်းလမ်းလည်း မဟုတ်ပါဘူး။ ဒါက declarative approach (query ဘယ်အချိန်မှာ run သင့်လဲဆိုတဲ့ dependencies တွေကို သတ်မှတ်ခြင်း) ကနေ imperative mode (ဒီနေရာကို click လုပ်တဲ့အခါတိုင်း fetch လုပ်ခြင်း) ဆီကို ပြောင်းသွားစေပါတယ်။ `refetch` ကို parameter တွေ ထည့်ပြီး ခေါ်လို့လည်း မရပါဘူး။ အများစုမှာ သင်လိုချင်တာက ကနဦး fetch ကို ရွှေ့ဆိုင်းထားပေးတဲ့ lazy query တစ်ခုပဲ ဖြစ်တတ်ပါတယ်:

## Lazy Queries (Lazy Query များ)

`enabled` option က query တစ်ခုကို အပြီးအပိုင် disable လုပ်ရုံတင်မကဘဲ — နောက်ပိုင်းမှာ enable/disable လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်။ ကောင်းတဲ့ ဥပမာတစ်ခုက filter form ပါ — user က filter value တစ်ခု ထည့်လိုက်မှသာ ပထမဆုံး request ကို fire လုပ်ချင်တဲ့ အခြေအနေမျိုးပါ:

```tsx
function Todos() {
  const [filter, setFilter] = React.useState('')

  const { data } = useQuery({
    queryKey: ['todos', filter],
    queryFn: () => fetchTodos(filter),
    // ⬇️ filter ဘာမှ မရှိသရွေ့ disabled ဖြစ်နေမယ်
    enabled: !!filter,
  })

  return (
    <div>
      // 🚀 filter ကို သုံးလိုက်တာနဲ့ query က enable ဖြစ်ပြီး run ပါမယ်
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  )
}
```

### isLoading (အရင်က: `isInitialLoading`)

Lazy query တွေက စကတည်းက `status: 'pending'` နဲ့ ရှိနေပါလိမ့်မယ် — ဘာကြောင့်လဲဆိုတော့ `pending` ဆိုတာ data မရှိသေးဘူးလို့ ဆိုလိုတာမို့ပါ။ ဒါက နည်းပညာအရတော့ မှန်ပါတယ်။ ဒါပေမယ့် — ကျွန်တော်တို့က လက်ရှိ data တစ်ခုမှ fetch မလုပ်နေတာမို့ (query က _enabled_ မဟုတ်လို့) — ဒီ flag ကို loading spinner ပြဖို့ သုံးလို့ မဖြစ်နိုင်ပါဘူး။

Disabled ဒါမှမဟုတ် lazy query တွေ သုံးနေရင် — `isLoading` flag ကို သုံးနိုင်ပါတယ်။ ဒါက ဒီကနေ တွက်ချက်ထားတဲ့ derived flag တစ်ခုပါ:

`isPending && isFetching`

ဒါကြောင့် query က ပထမဆုံးအကြိမ် fetch လုပ်နေမှသာ ဒါက `true` ဖြစ်ပါလိမ့်မယ်။

## Typesafe disabling of queries using `skipToken`

TypeScript သုံးနေတယ်ဆိုရင် — query တစ်ခုကို disable လုပ်ဖို့ `skipToken` ကို သုံးနိုင်ပါတယ်။ Condition တစ်ခုအပေါ် မူတည်ပြီး query ကို disable လုပ်ချင်ပေမယ့် — query ကို type safe ဖြစ်စေချင်တဲ့အခါမျိုးမှာ ဒါက အသုံးဝင်ပါတယ်။

> **အရေးကြီး**: `useQuery` ကနေ ရတဲ့ `refetch` က `skipToken` နဲ့ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။ `skipToken` သုံးထားတဲ့ query ပေါ်မှာ `refetch()` ခေါ်လိုက်ရင် — execute လုပ်ဖို့ တရားဝင် query function မရှိတာကြောင့် `Missing queryFn` error ဖြစ်ပါလိမ့်မယ်။ Query တွေကို manual အနေနဲ့ trigger လုပ်ချင်တယ်ဆိုရင် — `refetch()` ကို ကောင်းကောင်း အလုပ်လုပ်ပေးတဲ့ `enabled: false` ကို အသုံးပြုဖို့ စဉ်းစားပါ။ ဒီကန့်သတ်ချက်ကလွဲလို့ — `skipToken` က `enabled: false` နဲ့ အတူတူပဲ အလုပ်လုပ်ပါတယ်။

```tsx
import { skipToken, useQuery } from '@tanstack/react-query'

function Todos() {
  const [filter, setFilter] = React.useState<string | undefined>()

  const { data } = useQuery({
    queryKey: ['todos', filter],
    // ⬇️ filter က undefined ဒါမှမဟုတ် ဘာမှ မရှိသရွေ့ disabled ဖြစ်နေမယ်
    queryFn: filter ? () => fetchTodos(filter) : skipToken,
  })

  return (
    <div>
      // 🚀 filter ကို သုံးလိုက်တာနဲ့ query က enable ဖြစ်ပြီး run ပါမယ်
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  )
}
```
