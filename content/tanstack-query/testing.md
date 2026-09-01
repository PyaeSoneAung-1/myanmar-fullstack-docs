---
title: "Testing (စမ်းသပ်ခြင်း)"
description: "React Query ရဲ့ custom hooks တွေကို ဘယ်လို စမ်းသပ်မလဲ — React Hooks Testing Library, renderHook & waitFor, retries ပိတ်နည်း, Jest နဲ့ gcTime, nock နဲ့ network calls စမ်းသပ်ခြင်း, infinite scroll testing"
order: 34
source: "https://tanstack.com/query/latest/docs/framework/react/guides/testing"
status: translated
updated: 2026-09-01
---

React Query က hooks တွေကနေတစ်ဆင့် အလုပ်လုပ်ပါတယ် — ကျွန်တော်တို့ ကမ်းလှမ်းတဲ့ဟာတွေ ဖြစ်စေ၊ ဒါတွေကို ပတ်ပြီး ထုပ်ထားတဲ့ custom ones တွေ ဖြစ်စေပါတယ်။

React 17 ဒါမှမဟုတ် အစောပိုင်း ဗားရှင်းတွေနဲ့ဆိုရင် — ဒီ custom hooks တွေအတွက် unit tests တွေ ရေးဖို့ [React Hooks Testing Library](https://react-hooks-testing-library.com/) library ကို သုံးနိုင်ပါတယ်။

ဒါကို install လုပ်ဖို့:

```sh
npm install @testing-library/react-hooks react-test-renderer --save-dev
```

(`react-test-renderer` library က `@testing-library/react-hooks` ရဲ့ peer dependency အဖြစ် လိုအပ်ပြီး — သင်သုံးနေတဲ့ React ရဲ့ ဗားရှင်းနဲ့ ကိုက်ညီဖို့ လိုပါတယ်။)

_Note_: React 18 ဒါမှမဟုတ် နောက်ပိုင်း သုံးတဲ့အခါ — `renderHook` က `@testing-library/react` package ကနေ တိုက်ရိုက် ရနိုင်ပြီး — `@testing-library/react-hooks` မလိုတော့ပါဘူး။

## ကျွန်တော်တို့ရဲ့ ပထမဆုံး Test

Install လုပ်ပြီးတာနဲ့ — ရိုးရှင်းတဲ့ test တစ်ခု ရေးလို့ ရပါပြီ။ အောက်ပါ custom hook ကို ပေးထားတယ်ဆိုပါစို့:

```tsx
export function useCustomHook() {
  return useQuery({ queryKey: ['customHook'], queryFn: () => 'Hello' })
}
```

ဒီအတွက် test တစ်ခုကို ဒီလို ရေးနိုင်ပါတယ်:

```tsx
import { renderHook, waitFor } from '@testing-library/react'

const queryClient = new QueryClient()
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const { result } = renderHook(() => useCustomHook(), { wrapper })

await waitFor(() => expect(result.current.isSuccess).toBe(true))

expect(result.current.data).toEqual('Hello')
```

ကျွန်တော်တို့က `QueryClient` နဲ့ `QueryClientProvider` တွေကို တည်ဆောက်ပေးတဲ့ custom wrapper တစ်ခု ပေးထားတာ သတိပြုပါ။ ဒါက ကျွန်တော်တို့ရဲ့ test က တခြား tests တွေနဲ့ လုံးဝ သီးခြားဖြစ်နေဖို့ သေချာစေပါတယ်။

ဒီ wrapper ကို တစ်ခါပဲ ရေးဖို့ ဖြစ်နိုင်ပါတယ် — ဒါပေမယ့် အဲဒီလိုဆိုရင် — test တစ်ခုချင်းစီ မတိုင်ခင် `QueryClient` ကို clear လုပ်ဖို့ သေချာဖို့ လိုပြီး — tests တွေ parallel ဖြစ်ပြီး run မနေဖို့လည်း လိုပါတယ် — မဟုတ်ရင် test တစ်ခုက တခြားတစ်ခုရဲ့ ရလဒ်တွေကို လွှမ်းမိုးနိုင်လို့ပါ။

## Retries တွေကို ပိတ်ခြင်း

Library က exponential backoff နဲ့ retry ၃ ကြိမ်ကို default အနေနဲ့ လုပ်ပါတယ် — ဆိုလိုတာက — error ဖြစ်တဲ့ query တစ်ခုကို စမ်းသပ်ချင်ရင် သင့် tests တွေက timeout ဖြစ်ဖို့ များပါတယ်။ Retries တွေကို ပိတ်ဖို့ အလွယ်ဆုံး နည်းလမ်းက QueryClientProvider ကနေတစ်ဆင့်ပါ။ အပေါ်က ဥပမာကို ချဲ့ကြည့်ရအောင်:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
})
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
```

ဒါက component tree ထဲက queries အားလုံးအတွက် default ကို "retries မရှိ" ဖြစ်အောင် သတ်မှတ်ပေးပါလိမ့်မယ်။ ဒါက — သင့် တကယ့် `useQuery` မှာ explicit ဖြစ်တဲ့ retries တွေ မသတ်မှတ်ထားမှသာ အလုပ်လုပ်မယ်ဆိုတာ သိထားဖို့ အရေးကြီးပါတယ်။ Retry ၅ ကြိမ် လိုချင်တဲ့ query တစ်ခု ရှိရင် — အဲဒါက ဦးစားပေး ဆက်ဖြစ်နေမှာပါ — ဘာကြောင့်လဲဆိုတော့ defaults တွေက fallback အဖြစ်သာ ယူတာမို့ပါ။

## Jest နဲ့ gcTime ကို Infinity သတ်မှတ်ခြင်း

Jest သုံးနေတယ်ဆိုရင် — "Jest did not exit one second after the test run completed" error message ကို ကာကွယ်ဖို့ `gcTime` ကို `Infinity` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒါက server ပေါ်မှာ default အပြုအမူ ဖြစ်ပြီး — `gcTime` ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ထားမှသာ ဒါကို သတ်မှတ်ဖို့ လိုပါတယ်။

## Network Calls တွေကို စမ်းသပ်ခြင်း

React Query ရဲ့ အဓိက အသုံးပြုမှုက network requests တွေကို cache လုပ်ဖို့မို့ — ကျွန်တော်တို့ရဲ့ code က မှန်ကန်တဲ့ network requests တွေ လုပ်နေလားဆိုတာ စမ်းသပ်နိုင်ဖို့ အရေးကြီးပါတယ်။

ဒါတွေကို စမ်းသပ်ဖို့ နည်းလမ်းတွေ အများကြီး ရှိပါတယ် — ဒါပေမယ့် ဒီဥပမာအတွက် [nock](https://www.npmjs.com/package/nock) ကို သုံးပါမယ်။

အောက်ပါ custom hook ကို ပေးထားတယ်ဆိုပါစို့:

```tsx
function useFetchData() {
  return useQuery({
    queryKey: ['fetchData'],
    queryFn: () => request('/api/data'),
  })
}
```

ဒီအတွက် test တစ်ခုကို ဒီလို ရေးနိုင်ပါတယ်:

```tsx
const queryClient = new QueryClient()
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const expectation = nock('http://example.com').get('/api/data').reply(200, {
  answer: 42,
})

const { result } = renderHook(() => useFetchData(), { wrapper })

await waitFor(() => expect(result.current.isSuccess).toBe(true))

expect(result.current.data).toEqual({ answer: 42 })
```

ဒီမှာ `waitFor` ကို အသုံးပြုပြီး — query ရဲ့ status က request အောင်မြင်ပြီးဆိုတာ ညွှန်ပြတဲ့အထိ စောင့်နေပါတယ်။ ဒီနည်းနဲ့ — ကျွန်တော်တို့ရဲ့ hook က ပြီးစီးပြီး မှန်ကန်တဲ့ data ရှိသင့်တယ်ဆိုတာ သိနိုင်ပါတယ်။ _Note_: React 18 သုံးတဲ့အခါ — `waitFor` ရဲ့ semantics တွေက အပေါ်မှာ ဖော်ပြခဲ့သလို ပြောင်းလဲသွားပါတယ်။

## Load More / Infinite Scroll စမ်းသပ်ခြင်း

ပထမဆုံး ကျွန်တော်တို့ရဲ့ API response ကို mock လုပ်ဖို့ လိုပါတယ်

```tsx
function generateMockedResponse(page) {
  return {
    page: page,
    items: [...]
  }
}
```

ပြီးတော့ — ကျွန်တော်တို့ရဲ့ `nock` configuration က page ပေါ်မူတည်ပြီး responses တွေကို ခွဲခြားပေးဖို့ လိုပြီး — ဒါလုပ်ဖို့ `uri` ကို သုံးပါမယ်။
ဒီမှာ `uri` ရဲ့ တန်ဖိုးက `"/?page=1` ဒါမှမဟုတ် `/?page=2` လိုမျိုး ဖြစ်ပါလိမ့်မယ်

```tsx
const expectation = nock('http://example.com')
  .persist()
  .query(true)
  .get('/api/data')
  .reply(200, (uri) => {
    const url = new URL(`http://example.com${uri}`)
    const { page } = Object.fromEntries(url.searchParams)
    return generateMockedResponse(page)
  })
```

(`.persist()` ကို သတိပြုပါ — ဘာကြောင့်လဲဆိုတော့ ဒီ endpoint ကနေ အကြိမ်များစွာ ခေါ်နေမှာမို့ပါ)

အခု ကျွန်တော်တို့ရဲ့ tests တွေကို လုံခြုံစွာ run လို့ ရပါပြီ — ဒီမှာ လှည့်ကွက်က data assertion ကျော်သွားတာကို စောင့်ဖို့ပါ:

```tsx
const { result } = renderHook(() => useInfiniteQueryCustomHook(), {
  wrapper,
})

await waitFor(() => expect(result.current.isSuccess).toBe(true))

expect(result.current.data.pages).toStrictEqual(generateMockedResponse(1))

result.current.fetchNextPage()

await waitFor(() =>
  expect(result.current.data.pages).toStrictEqual([
    ...generateMockedResponse(1),
    ...generateMockedResponse(2),
  ]),
)

expectation.done()
```

_Note_: React 18 သုံးတဲ့အခါ — `waitFor` ရဲ့ semantics တွေက အပေါ်မှာ ဖော်ပြခဲ့သလို ပြောင်းလဲသွားပါတယ်။

## ထပ်ဆင့် ဖတ်ရှုရန်

အပိုဆောင်း tips တွေနဲ့ `mock-service-worker` သုံးတဲ့ နောက်ထပ် setup တစ်ခုအတွက် — TkDodo ရဲ့ [ဒီ Testing React Query ဆောင်းပါး](https://tkdodo.eu/blog/testing-react-query) ကို ကြည့်ပါ။
