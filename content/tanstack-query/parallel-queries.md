---
title: "Parallel Queries (အပြိုင် Queries)"
description: "query တွေကို parallel လုပ်ဆောင်ခြင်း — manual parallel queries, useQueries နဲ့ dynamic parallel queries, suspense mode မှာ သတိထားစရာများ"
order: 9
source: "https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries"
status: translated
updated: 2026-09-01
---

"Parallel" query တွေဆိုတာ fetching concurrency (ဒေတာယူမှု အပြိုင်လုပ်ဆောင်နိုင်မှု) အများဆုံး ရနိုင်ဖို့ — parallel (သို့မဟုတ်) တစ်ချိန်တည်းမှာ execute လုပ်တဲ့ query တွေပါ။

## Manual Parallel Queries

Parallel query အရေအတွက် မပြောင်းဘူးဆိုရင် — parallel query သုံးဖို့ **အပိုအားစိုက်စရာ မလိုပါဘူး**။ TanStack Query ရဲ့ `useQuery` နဲ့ `useInfiniteQuery` hooks တွေကို ဘယ်နှစ်ခုမဆို ဘေးချင်းကပ် သုံးလိုက်ရုံပါပဲ!

```tsx
function App () {
  // အောက်က queries တွေက parallel နဲ့ execute ဖြစ်မယ်
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  ...
}
```

> Suspense mode မှာ React Query ကို သုံးနေရင် ဒီ parallel ပုံစံက အလုပ်မလုပ်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ ပထမ query က အတွင်းပိုင်းမှာ promise တစ်ခုကို throw လုပ်ပြီး ကျန် query တွေ run မလုပ်ခင် component ကို suspend လုပ်လိုက်လို့ပါ။ ဒါကို ရှောင်ဖို့ — `useSuspenseQueries` hook (အကြံပြုထားတဲ့ နည်း) ကို သုံးရပါမယ်၊ ဒါမှမဟုတ် `useSuspenseQuery` instance တစ်ခုစီအတွက် component တစ်ခုစီ ခွဲပြီး parallel ကို ကိုယ်တိုင် စီစဉ်ရပါမယ်။

## `useQueries` နဲ့ Dynamic Parallel Queries

သင်လုပ်ဆောင်ရမယ့် query အရေအတွက်က render တစ်ခုနဲ့တစ်ခု ပြောင်းနေတယ်ဆိုရင် — manual query ကို မသုံးနိုင်ပါဘူး၊ ဘာကြောင့်လဲဆိုတော့ ဒါက rules of hooks (hook တွေရဲ့ စည်းမျဉ်း) ကို ချိုးဖောက်မိလို့ပါ။ အဲဒီအစား TanStack Query က `useQueries` hook ကို ထောက်ပံ့ပေးထားပြီး — ဒါနဲ့ သင်လိုသလောက် query တွေကို parallel နဲ့ dynamic အနေနဲ့ execute လုပ်နိုင်ပါတယ်။

`useQueries` က **options object** တစ်ခုကို လက်ခံပြီး — အဲဒီထဲမှာ **queries key** ရှိပြီး သူ့ရဲ့ value က **query object တွေရဲ့ array** ဖြစ်ပါတယ်။ ပြန်ပေးတာကတော့ **query results တွေရဲ့ array** ပါ:

```tsx
function App({ users }) {
  const userQueries = useQueries({
    queries: users.map((user) => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchUserById(user.id),
      }
    }),
  })
}
```

> TypeScript သုံးတဲ့အခါ — `useQueries` ဆီ ပေးတဲ့ query object ပေါ်မှာ inline `select` ရေးရင် အဲဒီ object ရဲ့ `queryFn` ကနေ သူ့ရဲ့ `data` argument ကို မှန်းဆ (infer) လို့မရပါဘူး — `unknown` အဖြစ် ပြုတ်ကျသွားပါတယ်။ Type inference ကို ထိန်းထားချင်ရင် `select` ရဲ့ parameter ကို ရှင်းရှင်းလင်းလင်း annotate လုပ်ပါ၊ ဒါမှမဟုတ် [`queryOptions`](https://tanstack.com/query/latest/docs/reference/queryOptions) helper နဲ့ query ကို သတ်မှတ်ပါ။ [ဒီ လူသိများတဲ့ ကန့်သတ်ချက်ကို ကြည့်ပါ](https://github.com/TanStack/query/issues/6556)။
