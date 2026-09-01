---
title: "Paginated / Lagged Queries (စာမျက်နှာခွဲ Queries)"
description: "paginated data ကို render လုပ်ခြင်း — page info ကို query key ထဲ ထည့်သုံးခြင်း, placeholderData / keepPreviousData နဲ့ success/pending state ခုန်ပေါက်မှုကို ရှောင်ခြင်း"
order: 10
source: "https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries"
status: translated
updated: 2026-09-01
---

Paginated data ကို render လုပ်တာက UI မှာ အသုံးအများဆုံး pattern တစ်ခုဖြစ်ပြီး — TanStack Query မှာတော့ page information ကို query key ထဲ ထည့်လိုက်ရုံနဲ့ "အလိုအလျောက် အလုပ်ဖြစ်သွားပါတယ်":

```tsx
const result = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
})
```

ဒါပေမယ့် ဒီရိုးရှင်းတဲ့ ဥပမာကို run ကြည့်ရင် ထူးဆန်းတာတစ်ခုကို သတိထားမိပါလိမ့်မယ်:

**Page အသစ်တိုင်းကို query အသစ်တစ်ခုလို သဘောထားလို့ UI က `success` နဲ့ `pending` state တွေကြားမှာ ခုန်ပေါက်နေပါလိမ့်မယ်။**

ဒီအတွေ့အကြုံက အကောင်းဆုံးမဟုတ်ပါဘူး — ကံမကောင်းစွာပဲ ဒီနေ့ခေတ် tool တော်တော်များများက ဒီအတိုင်းပဲ အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် TanStack Query ကတော့ မဟုတ်ပါဘူး! ခန့်မှန်းမိကြမယ်ထင်ပါတယ် — TanStack Query မှာ `placeholderData` ဆိုတဲ့ အလွန်ကောင်းတဲ့ feature တစ်ခု ပါဝင်ပြီး ဒီပြဿနာကို ရှောင်လွှဲနိုင်ပါတယ်။

## `placeholderData` နဲ့ ပိုကောင်းတဲ့ Paginated Queries

ဒီဥပမာကို ကြည့်ပါ — ကျွန်တော်တို့ လိုချင်တာက query တစ်ခုအတွက် pageIndex (သို့မဟုတ် cursor) ကို တိုးချင်တာပါ။ `useQuery` ကို သုံးရင် **နည်းပညာအရတော့ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်** — ဒါပေမယ့် page/cursor တစ်ခုစီအတွက် query အသစ်တွေ ဖန်တီးခံရပြီး ဖျက်ခံရတာကြောင့် UI က `success` နဲ့ `pending` state တွေကြားမှာ ခုန်ပေါက်နေပါလိမ့်မယ်။ `placeholderData` ကို `(previousData) => previousData` ဒါမှမဟုတ် TanStack Query ကနေ export လုပ်ထားတဲ့ `keepPreviousData` function အဖြစ် သတ်မှတ်လိုက်ရင် အသစ်တွေ အများကြီး ရလာပါတယ်:

- **Query key ပြောင်းသွားပေမယ့် — data အသစ်ကို မတောင်းခံရသေးချိန်မှာ နောက်ဆုံး အောင်မြင်ခဲ့တဲ့ fetch ရဲ့ data က ရရှိနေပါသေးတယ်**။
- Data အသစ် ရောက်လာတဲ့အခါ — အရင် `data` ကို data အသစ်နဲ့ ချောမွေ့စွာ လဲလှယ်ပြသပါတယ်။
- Query က လက်ရှိ ဘယ် data ကို ပေးနေလဲ သိဖို့ `isPlaceholderData` ကို ရရှိပါတယ်

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'

function Todos() {
  const [page, setPage] = React.useState(0)

  const fetchProjects = (page = 0) =>
    fetch('/api/projects?page=' + page).then((res) => res.json())

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ['projects', page],
      queryFn: () => fetchProjects(page),
      placeholderData: keepPreviousData,
    })

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData && data.hasMore) {
            setPage((old) => old + 1)
          }
        }}
        // Next Page button ကို နောက် page ရှိမရှိ မသိမချင်း disable ထားမယ်
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}
    </div>
  )
}
```

## `placeholderData` နဲ့ Infinite Query results တွေကို နှောင့်နှေးပြသခြင်း

သိပ်တော့ အသုံးမများပေမယ့် — `placeholderData` option က `useInfiniteQuery` hook နဲ့လည်း အဆင်ပြေပြေ အလုပ်လုပ်ပါတယ်။ Infinite query keys တွေ အချိန်နဲ့အမျှ ပြောင်းနေချိန်မှာ user တွေကို cached data တွေ ဆက်ကြည့်နေစေဖို့ ချောမွေ့စွာ စီစဉ်ပေးနိုင်ပါတယ်။
