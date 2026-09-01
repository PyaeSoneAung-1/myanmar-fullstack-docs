---
title: "Query Cancellation (Query ဖျက်သိမ်းခြင်း)"
description: "Query တွေကို cancel လုပ်နည်း — AbortSignal, fetch/axios/XMLHttpRequest/graphql-request နဲ့ တွဲသုံးပုံ, manual cancellation, cancel options, limitations"
order: 25
source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation"
status: translated
updated: 2026-09-01
---

TanStack Query က query function တစ်ခုချင်းစီကို [`AbortSignal` instance](https://developer.mozilla.org/docs/Web/API/AbortSignal) တစ်ခု ထောက်ပံ့ပေးပါတယ်။ Query တစ်ခုက out-of-date ဒါမှမဟုတ် inactive ဖြစ်သွားတဲ့အခါ — ဒီ `signal` က aborted ဖြစ်သွားပါတယ်။ ဆိုလိုတာက — query တွေ အားလုံးက cancellable ဖြစ်ပြီး — သင်လိုချင်ရင် ကိုယ့် query function ထဲမှာ cancellation ကို တုံ့ပြန်နိုင်ပါတယ်။ အကောင်းဆုံး အချက်က — ပုံမှန် async/await syntax ကို ဆက်သုံးနေရင်း — automatic cancellation ရဲ့ အကျိုးကျေးဇူးတွေ အားလုံး ရနိုင်တာပါ။

`AbortController` API က [runtime environment အများစုမှာ](https://developer.mozilla.org/docs/Web/API/AbortController#browser_compatibility) ရနိုင်ပါတယ် — ဒါပေမယ့် သင့်ရဲ့ runtime environment က မထောက်ပံ့ဘူးဆိုရင် — polyfill တစ်ခု ထည့်ပေးဖို့ လိုပါမယ်။ [ရနိုင်တဲ့ polyfill တွေ အများကြီး ရှိပါတယ်](https://www.npmjs.com/search?q=abortcontroller%20polyfill)။

## Default အပြုအမူ

Default အနေနဲ့ — သူတို့ရဲ့ promises တွေ resolve မဖြစ်ခင် unmount ဖြစ်သွားတဲ့ ဒါမှမဟုတ် အသုံးမပြုတော့တဲ့ queries တွေကို _မဖျက်သိမ်းပါဘူး_။ ဆိုလိုတာက — promise resolve ဖြစ်ပြီးနောက် ရလာတဲ့ data က cache ထဲမှာ ရနိုင်ပါလိမ့်မယ်။ ဒါက — query တစ်ခုကို စတင် လက်ခံရရှိနေပေမယ့် — မပြီးခင် component ကို unmount လုပ်လိုက်ရတဲ့ အခြေအနေမျိုးမှာ အသုံးဝင်ပါတယ်။ Component ကို ပြန် mount လုပ်ပြီး query က garbage collected မဖြစ်သေးဘူးဆိုရင် — data က ရနိုင်ပါလိမ့်မယ်။

ဒါပေမယ့် — သင်က `AbortSignal` ကို သုံးစွဲပြီးပြီဆိုရင် — Promise ကို ဖျက်သိမ်းခံရမှာ ဖြစ်ပြီး (ဥပမာ fetch ကို abort လုပ်ခြင်း) — ဒါကြောင့် Query ကိုလည်း ဖျက်သိမ်းရပါမယ်။ Query ကို ဖျက်သိမ်းလိုက်တာက — ၎င်းရဲ့ state ကို ယခင် state ဆီ _ပြန်ပြောင်းစေပါတယ်_။

## `fetch` သုံးခြင်း

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: async ({ signal }) => {
    const todosResponse = await fetch('/todos', {
      // signal ကို fetch တစ်ခုဆီ ပို့ပါ
      signal,
    })
    const todos = await todosResponse.json()

    const todoDetails = todos.map(async ({ details }) => {
      const response = await fetch(details, {
        // ဒါမှမဟုတ် အများကြီးဆီ ပို့ပါ
        signal,
      })
      return response.json()
    })

    return Promise.all(todoDetails)
  },
})
```

## `axios` [v0.22.0+](https://github.com/axios/axios/releases/tag/v0.22.0) သုံးခြင်း

```tsx
import axios from 'axios'

const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) =>
    axios.get('/todos', {
      // signal ကို `axios` ဆီ ပို့ပါ
      signal,
    }),
})
```

### v0.22.0 ထက် နိမ့်တဲ့ `axios` ဗားရှင်း သုံးခြင်း

```tsx
import axios from 'axios'

const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    // ဒီ request အတွက် CancelToken source အသစ်တစ်ခု ဖန်တီးပါ
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    const promise = axios.get('/todos', {
      // source token ကို သင့် request ဆီ ပို့ပါ
      cancelToken: source.token,
    })

    // TanStack Query က abort လုပ်ဖို့ signal ပေးရင် request ကို ဖျက်သိမ်းပါ
    signal?.addEventListener('abort', () => {
      source.cancel('Query was cancelled by TanStack Query')
    })

    return promise
  },
})
```

## `XMLHttpRequest` သုံးခြင်း

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    return new Promise((resolve, reject) => {
      var oReq = new XMLHttpRequest()
      oReq.addEventListener('load', () => {
        resolve(JSON.parse(oReq.responseText))
      })
      signal?.addEventListener('abort', () => {
        oReq.abort()
        reject()
      })
      oReq.open('GET', '/todos')
      oReq.send()
    })
  },
})
```

## `graphql-request` သုံးခြင်း

`AbortSignal` တစ်ခုကို client ရဲ့ `request` method ထဲမှာ သတ်မှတ်နိုင်ပါတယ်။

```tsx
const client = new GraphQLClient(endpoint)

const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    client.request({ document: query, signal })
  },
})
```

## v4.0.0 ထက် နိမ့်တဲ့ `graphql-request` ဗားရှင်း သုံးခြင်း

`AbortSignal` တစ်ခုကို `GraphQLClient` constructor ထဲမှာ သတ်မှတ်နိုင်ပါတယ်။

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    const client = new GraphQLClient(endpoint, {
      signal,
    })
    return client.request(query, variables)
  },
})
```

## Manual Cancellation (ကိုယ်တိုင် ဖျက်သိမ်းခြင်း)

Query တစ်ခုကို ကိုယ်တိုင် ဖျက်သိမ်းချင်တာ ဖြစ်နိုင်ပါတယ်။ ဥပမာ — request က ပြီးဖို့ အချိန်ကြာနေတယ်ဆိုရင် — user က cancel button တစ်ခုကို click လုပ်ပြီး request ကို ရပ်တန့်ခွင့်ပြုနိုင်ပါတယ်။ ဒါလုပ်ဖို့ — `queryClient.cancelQueries({ queryKey })` ကို ခေါ်ရုံပါပဲ — ဒါက query ကို ဖျက်သိမ်းပြီး ယခင် state ဆီ ပြန်ပြောင်းပေးပါလိမ့်မယ်။ Query function ဆီ ပို့ထားတဲ့ `signal` ကို သုံးစွဲထားရင် — TanStack Query က Promise ကိုပါ ထပ်ပြီး ဖျက်သိမ်းပေးပါလိမ့်မယ်။

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: async ({ signal }) => {
    const resp = await fetch('/todos', { signal })
    return resp.json()
  },
})

const queryClient = useQueryClient()

return (
  <button
    onClick={(e) => {
      e.preventDefault()
      queryClient.cancelQueries({ queryKey: ['todos'] })
    }}
  >
    Cancel
  </button>
)
```

## `Cancel Options`

Cancel options တွေက query cancellation လုပ်ဆောင်ချက်တွေရဲ့ အပြုအမူကို ထိန်းချုပ်ဖို့ သုံးပါတယ်။

```tsx
// Query တချို့ကို အသံတိတ် cancel လုပ်ပါ
await queryClient.cancelQueries({ queryKey: ['posts'] }, { silent: true })
```

Cancel options object တစ်ခုက အောက်ပါ properties တွေကို ထောက်ပံ့ပါတယ်:

- `silent?: boolean`
  - `true` သတ်မှတ်ထားရင် — `CancelledError` ကို observers တွေဆီ (ဥပမာ `onError` callbacks) နဲ့ ဆက်စပ် notifications တွေဆီ ပြန့်ပွားမသွားအောင် တားဆီးပြီး — reject လုပ်တာအစား retry promise ကို ပြန်ပေးပါတယ်။
  - Default က `false`
- `revert?: boolean`
  - `true` သတ်မှတ်ထားရင် — in-flight fetch မစတင်ခင် ကတည်းက ရှိခဲ့တဲ့ query ရဲ့ state (data နဲ့ status) ကို ပြန်ထားပေးပြီး — `fetchStatus` ကို `idle` ဆီ ပြန်သတ်မှတ်ကာ — ယခင် data မရှိခဲ့ဘူးဆိုရင်သာ throw လုပ်ပါတယ်။
  - Default က `true`

## Limitations (ကန့်သတ်ချက်များ)

Cancellation က `Suspense` hooks တွေနဲ့ သုံးတဲ့အခါ အလုပ်မလုပ်ပါဘူး: `useSuspenseQuery`, `useSuspenseQueries` နဲ့ `useSuspenseInfiniteQuery`။
