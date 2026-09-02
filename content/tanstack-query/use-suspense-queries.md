---
title: "useSuspenseQueries (Suspense mode Queries အစုအဝေး hook)"
description: "useSuspenseQueries ရဲ့ call signature, options (combine အပါအဝင်) နဲ့ Returns — Suspense queries တွေကို parallel ဖြစ်အောင် run လုပ်ခြင်း"
order: 47
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useSuspenseQueries"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useSuspenseQueries<T, TCombinedResult>(options, queryClient?): TCombinedResult;
```

`useSuspenseQueries` က [useQueries](/docs/tanstack-query/use-queries) ရဲ့ Suspense-enabled version ပါ — queries အစုအဝေးတစ်ခုကို တစ်ပြိုင်နက် (parallel) run လုပ်ပြီး — query တစ်ခုချင်းစီရဲ့ data အဆင်သင့် မဖြစ်သေးသရွေ့ component ကို suspend လုပ်ထားပါတယ်။ Component တစ်ခုထဲမှာ [useSuspenseQuery](/docs/tanstack-query/use-suspense-query) ကို ခေါ်ချက်များစွာ သုံးထားရင် query တွေက serial ဖြစ်ပြီး waterfall ဖြစ်တတ်လို့ — suspenseful query တစ်ခုထက်ပိုရင် ဒီ hook နဲ့ parallel ဖြစ်အောင် run သင့်ပါတယ်။

Options တွေက `useQueries` နဲ့ အတူတူပဲ — ဒါပေမယ့် top-level `subscribed` option ကို မထောက်ခံတော့ဘဲ — query တစ်ခုချင်းစီမှာ `throwOnError`, `enabled`, `placeholderData` တွေ မပါနိုင်တော့ပါဘူး။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `T` | — | `queries` array ရဲ့ element type — `any[]` ကို extend လုပ်ထားရမယ် |
| `TCombinedResult` | (mapped tuple type) | input `queries` array ထဲက element type တစ်ခုချင်းစီကို သက်ဆိုင်ရာ `UseSuspenseQueryResult` type အဖြစ် map လုပ်ထားတဲ့ type — array ရဲ့ element အရေအတွက်/ပုံစံအတိုင်း result type တွေ လိုက်ထွက်ပါတယ် (မူရင်း type က ဒါကို ဖော်ပြတဲ့ recursive conditional type ရှည်ကြီး ဖြစ်ပါတယ်) |

## Parameters

**`options`** — Suspense မှာ run မယ့် `queries` array နဲ့ optional `combine` function ပါတဲ့ object ဖြစ်ပါတယ်:

| Option | အဓိပ္ပာယ် |
|---|---|
| `queries` | `useSuspenseQuery` options object တွေနဲ့ အတူတူဖြစ်တဲ့ query options တွေရဲ့ array — `T` type parameter က ဒီကနေ ဆင်းသက်ပြီး element တစ်ခုချင်းစီရဲ့ result type ကို သတ်မှတ်ပေးပါတယ် |
| `combine?` | `(result) => TCombinedResult` — query results တွေအားလုံးကို တန်ဖိုးတစ်ခုတည်းအဖြစ် ပေါင်းစပ်တဲ့ function — ရလဒ်ကို referentially stable ဖြစ်သလောက် ဖြစ်အောင် structurally shared လုပ်ထားပါတယ် |

`combine` ပေးလိုက်ရင် `TCombinedResult` က combine ရဲ့ return type ဖြစ်သွားပြီး — မပေးရင် `queries` array ကနေ ဆင်းသက်လာတဲ့ result array ဖြစ်ပါတယ်။ (မူရင်း documentation အရ `combine` ကို လက်ခံတဲ့ overload က တစ်ခုတည်းပဲ ရှိပါတယ်။)

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`TCombinedResult` — [useQueries](/docs/tanstack-query/use-queries) နဲ့ structure အတူတူပဲ။ Query တစ်ခုချင်းစီအတွက် `data` က **သေချာပေါက် defined** (query တစ်ခုချင်းစီအတွက် `isPending` check မလို) — `isPlaceholderData` မပါတော့ဘဲ — `status` က `'success'` \| `'error'` ပဲ ဖြစ်နိုင်ပြီး derived flags (`isSuccess`/`isError`) တွေလည်း အလိုက်သင့် သတ်မှတ်ပေးပါတယ်။ Error handling ကလည်း [useSuspenseQuery](/docs/tanstack-query/use-suspense-query) လိုပဲ — cache data မရှိဘဲ fetch ကျရှုံးရင် error ကို throw လုပ်လို့ `<Suspense>` ပတ်ပတ်လည်မှာ error boundary လိုပါတယ်။

**သတိပြုစရာများ (Caveats):**

1. Component က query တွေ အားလုံး loading ပြီးစီးမှသာ (re-)mount ဖြစ်ပါတယ် — ဒါကြောင့် query အားလုံး ပြီးသွားတဲ့အချိန်မှာ query တစ်ခုခုက stale ဖြစ်သွားခဲ့ရင် re-mount မှာ အဲဒီ query ကို နောက်တစ်ခါ ပြန် fetch လုပ်ပါလိမ့်မယ်။ ဒါမျိုး မဖြစ်အောင် `staleTime` ကို လုံလောက်အောင် မြင့်မြင့် သတ်မှတ်ထားပါ။
2. Cancellation က ဒီ hook နဲ့ အလုပ်မလုပ်ပါဘူး။

## ဥပမာများ

### Dynamic queries array

`ids` တစ်ခုချင်းစီအတွက် query တစ်ခုစီ — ရလဒ်တိုင်း သေချာပေါက် defined ဖြစ်လို့ per-query `isPending` check မလိုတော့ပါဘူး:

```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  // ရလဒ်တိုင်း သေချာပေါက် defined ဖြစ်ပါတယ် — query တစ်ခုချင်းစီအတွက် `isPending` check မလိုပါဘူး။
  const postQueries = useSuspenseQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
    })),
  })

  return (
    <ul>
      {postQueries.map((query) => (
        <li key={query.data.id}>{query.data.title}</li>
      ))}
    </ul>
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
            <Posts ids={[1, 2, 3]} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

### Queries အမျိုးမျိုး — parallel ဖြစ်အောင်

`useSuspenseQuery` ခေါ်ချက် တစ်ခုပြီးတစ်ခု serial suspend မဖြစ်အောင် — query တွေ မတူညီတဲ့အခါမှာလည်း `useSuspenseQueries` ကို သုံးပြီး parallel ဖြစ်အောင် fetch လုပ်ပါ:

```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Dashboard() {
  const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['teams'], queryFn: fetchTeams },
      { queryKey: ['projects'], queryFn: fetchProjects },
    ],
  })

  return (
    <div>
      <UserList users={usersQuery.data} />
      <TeamList teams={teamsQuery.data} />
      <ProjectList projects={projectsQuery.data} />
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
          <Suspense fallback={<h1>Loading dashboard...</h1>}>
            <Dashboard />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

### combine နဲ့ ပေါင်းစပ်ခြင်း

`combine` က results တွေကို boolean တစ်ခုတည်းအဖြစ် ပေါင်းလိုက်လို့ — `Refresh` က query တစ်ခုချင်းစီရဲ့ update တိုင်း မဟုတ်ဘဲ အဲဒီ boolean ပြောင်းလဲမှသာ re-render ဖြစ်ပါတယ်:

```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Refresh() {
  const anyFetching = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['teams'], queryFn: fetchTeams },
    ],
    combine: (results) => results.some((result) => result.isFetching),
  })

  return anyFetching ? <span>Refreshing…</span> : null
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
          <Suspense fallback={<h1>Loading dashboard...</h1>}>
            <Refresh />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

Query တစ်ခုထဲပဲ ဆိုရင် [useSuspenseQuery](/docs/tanstack-query/use-suspense-query) ကို၊ suspense မပါတဲ့ parallel queries တွေအတွက်တော့ [useQueries](/docs/tanstack-query/use-queries) ကို — Suspense mode အလုံးစုံအတွက်တော့ [Suspense guide](/docs/tanstack-query/suspense) မှာ ကြည့်နိုင်ပါတယ်။
