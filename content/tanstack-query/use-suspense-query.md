---
title: "useSuspenseQuery (Suspense mode Query hook)"
description: "useSuspenseQuery ရဲ့ call signature, options နဲ့ Returns — Suspense နဲ့ သုံးတဲ့ useQuery; data undefined မဖြစ်ကြောင်း အာမခံချက်၊ error boundary နဲ့ အလုပ်လုပ်ပုံ"
order: 45
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useSuspenseQuery"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient?): UseSuspenseQueryResult<TData, TError>;
```

`useSuspenseQuery` က [useQuery](/docs/tanstack-query/use-query) ရဲ့ Suspense-enabled version ပါ — React Suspense နဲ့ တွဲသုံးဖို့ ရည်ရွယ်ထားပြီး၊ data အဆင်သင့် မဖြစ်သေးသရွေ့ component ကို suspend လုပ်လိုက်ပါတယ်။ ရလဒ်အနေနဲ့ — loading UI (fallback) နဲ့ error UI (error boundary) တွေကို Suspense/ErrorBoundary တွေက ကိုင်တွယ်ပေးလို့ — `status`/`error` တွေကို ကိုယ်တိုင် စစ်ပြီး loading/error UI ရေးစရာ မလိုတော့ပါဘူး။ Suspense mode အလုံးစုံကို [Suspense guide](/docs/tanstack-query/suspense) မှာ ဖတ်နိုင်ပါတယ်။

`useSuspenseQuery` ရဲ့ options တွေက `useQuery` နဲ့ အတူတူပဲ — ဒါပေမယ့် အောက်ပါတွေ မပါဝင်ပါဘူး:

- `throwOnError`, `enabled`, `placeholderData` — သုံးလို့ မရတော့ပါဘူး
- `queryFn` က `skipToken` လည်း မဖြစ်နိုင်ပါဘူး — Suspense hooks တွေက "disabled" state ကို render လုပ်လို့ မရလို့ပါ

**သတိပြုစရာ (Caveat):** cancellation က ဒီ hook နဲ့ အလုပ်မလုပ်ပါဘူး။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TQueryFnData` | `unknown` | `queryFn` က resolve လုပ်တဲ့ raw data ရဲ့ type |
| `TError` | `Error` | `queryFn` က throw နိုင်တဲ့ error ရဲ့ type |
| `TData` | `TQueryFnData` | `select` transformation ပြီးနောက် `data` ထဲမှာ ရောက်ရှိတဲ့ type |
| `TQueryKey` | `readonly unknown[]` | query key ရဲ့ type — `QueryKey` ကို extend လုပ်ထားရမယ် |

## Parameters

**`options`** — [`UseSuspenseQueryOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseSuspenseQueryOptions)<`TQueryFnData`, `TError`, `TData`, `TQueryKey`> type — အပေါ်မှာ ဖယ်ထားတဲ့ options တွေကလွဲလို့ `useQuery` options နဲ့ အတူတူပါ။ Option တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ်အပြည့်အစုံကို [useQuery](/docs/tanstack-query/use-query) စာမျက်နှာမှာ ကြည့်နိုင်ပါတယ်။

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

[`UseSuspenseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseSuspenseQueryResult)<`TData`, `TError`> — `useQuery` ပြန်ပေးတဲ့ object နဲ့ ပုံစံတူပေမယ့် ကွာခြားချက် သုံးခု ရှိပါတယ်:

| Property | ကွာခြားချက် |
|---|---|
| `data` | **သေချာပေါက် defined** — ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး |
| `isPlaceholderData` | မပါတော့ပါဘူး |
| `status` | `'success'` \| `'error'` ပဲ ဖြစ်နိုင်တယ် (derived flags — `isSuccess`/`isError` — တွေလည်း အလိုက်သင့် သတ်မှတ်ပေးပါတယ်) |

**data undefined မဖြစ်တဲ့ အာမခံချက်** — data မရှိသေးသရွေ့ component က render ဖြစ်မှာ မဟုတ်ဘဲ `<Suspense>` fallback အောက်မှာ စောင့်နေလို့ပါ။ ဒါကြောင့် `status: 'pending'` ဆိုတဲ့ အခြေအနေကို ဒီ result မှာ မမြင်ရတော့ဘဲ — `data` ကို `undefined` ဖြစ်နိုင်ခြေ မရှိတဲ့ type အနေနဲ့ သုံးလို့ ရပါတယ် (isPending check မလို)။

**Error boundary နဲ့ အလုပ်လုပ်ပုံ** — fetch မအောင်မြင်ပြီး cache ထဲမှာ ပြစရာ data လည်း မရှိသေးရင် query error ကို throw လုပ်ပါတယ် — ဒါကြောင့် `<Suspense>` ကို ထုပ်ထားတဲ့ error boundary ရှိဖို့ လိုပါတယ်။ နောက်ခံမှာ ဖြစ်တဲ့ (background) refetch တစ်ခု ကျရှုံးရင်တော့ error ကို throw မလုပ်ဘဲ — cache ထဲက ရှိပြီးသား data ကို ဆက်ပြီး render လုပ်ပါတယ်။ ဒီလို error ပြီးနောက် user က ပြန်ကြိုးစားလို့ ရအောင် `QueryErrorResetBoundary` ကို သုံးနိုင်ပါတယ် — default `throwOnError` အပြုအမူအကြောင်း အသေးစိတ်ကို [Suspense](/docs/tanstack-query/suspense) guide မှာ ကြည့်ပါ။

## သတိပြုစရာများ (Remarks)

Component တစ်ခုထဲမှာ `useSuspenseQuery` ကို ကြိမ်များစွာ ခေါ်ထားရင် — query တွေက တစ်ခုပြီးတစ်ခု serial ဖြစ်ပြီး suspend လုပ်ပါတယ်။ ဆိုလိုတာက — query တစ်ခုက resolve မဖြစ်မချင်း render ကို ပိတ်ထားလို့ နောက် query က အဲဒီအချိန်အထိ fetch စလို့တောင် မရပါဘူး (request waterfall)။ ဒါကြောင့် component တစ်ခုထဲမှာ suspenseful query တစ်ခုထက်ပိုပြီး သုံးမယ်ဆိုရင် — parallel ဖြစ်အောင် [useSuspenseQueries](/docs/tanstack-query/use-suspense-queries) ကို သုံးပါ။

## ဥပမာများ

Fetch ကျရှုံးပြီး cache data မရှိသေးရင် error ကို throw လုပ်လို့ — `<Suspense>` ပတ်ပတ်လည်မှာ error boundary လိုပါတယ်။ Background refetch ကျရှုံးတာကတော့ cache data ကို ဆက် render လုပ်ပါတယ်:

```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'

function Posts() {
  // `data` က ဒီနေရာမှာ သေချာပေါက် defined ဖြစ်ပါတယ် — `isPending` check မလိုပါဘူး။
  const { data, isFetching } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  return (
    <div>
      <h1>Posts {isFetching ? '(refreshing...)' : null}</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              There was an error!
              <button onClick={() => resetErrorBoundary()}>Try again</button>
            </div>
          )}
        >
          <Suspense fallback={<h1>Loading posts...</h1>}>
            <Posts />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

Error boundaries တွေကို reset လုပ်ခြင်း၊ `throwOnError` ရဲ့ default တန်ဖိုးနဲ့ render-as-you-fetch စတာတွေရဲ့ အသေးစိတ်ကို [Suspense guide](/docs/tanstack-query/suspense) မှာ ဆက်ဖတ်နိုင်ပါတယ်။
