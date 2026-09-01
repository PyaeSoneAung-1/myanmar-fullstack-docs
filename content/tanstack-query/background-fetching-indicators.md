---
title: "Background Fetching Indicators (နောက်ခံ Fetching ညွှန်ပြချက်များ)"
description: "Query တစ်ခုက နောက်ခံမှာ refetch ဖြစ်နေကြောင်း ပြသဖို့ `isFetching` flag နဲ့ `useIsFetching` hook ကို သုံးနည်း"
order: 27
source: "https://tanstack.com/query/latest/docs/framework/react/guides/background-fetching-indicators"
status: translated
updated: 2026-09-01
---

Query တစ်ခုရဲ့ `status === 'pending'` state က — query ရဲ့ ကနဦး hard-loading state ကို ပြသဖို့ လုံလောက်ပါတယ် — ဒါပေမယ့် တစ်ခါတလေ — query တစ်ခုက နောက်ခံမှာ refetch ဖြစ်နေကြောင်း နောက်ထပ် ညွှန်ပြချက်တစ်ခု ပြသချင်တာ ဖြစ်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ — queries တွေက `status` variable ရဲ့ အခြေအနေ ဘယ်လိုပဲ ရှိရှိ — fetching state ထဲ ရောက်နေကြောင်း ပြသဖို့ သုံးလို့ရတဲ့ `isFetching` boolean တစ်ခုကိုလည်း ထောက်ပံ့ပေးပါတယ်:

```tsx
function Todos() {
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return status === 'pending' ? (
    <span>Loading...</span>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}

      <div>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </div>
    </>
  )
}
```

## Global Background Fetching Loading State ပြသခြင်း

Individual query loading states တွေအပြင် — **ဘယ်** queries တွေမဆို fetching ဖြစ်နေတဲ့အခါ (နောက်ခံမှာ ပါ အပါအဝင်) — global loading indicator တစ်ခု ပြသချင်တယ်ဆိုရင် — `useIsFetching` hook ကို သုံးနိုင်ပါတယ်:

```tsx
import { useIsFetching } from '@tanstack/react-query'

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching()

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null
}
```
