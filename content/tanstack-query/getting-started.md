---
title: "TanStack Query မိတ်ဆက်"
description: "TanStack Query ဆိုတာ ဘာလဲ — server state ကို cache, background update, sync လုပ်ပေးတဲ့ library"
order: 1
source: "https://tanstack.com/query/latest/docs/framework/react/overview"
status: translated
updated: 2026-09-01
---

## TanStack Query ဆိုတာ ဘာလဲ

**TanStack Query** (အရင်က React Query) က React, Vue, Svelte, Solid စတဲ့
framework တွေမှာ **server state** — ဆိုလိုတာက API/database ကနေ လာတဲ့ data —
ကို စီမံခန့်ခွဲဖို့ အကောင်းဆုံး library တွေထဲက တစ်ခုပါ။

Server state က client state (UI state) နဲ့ လုံးဝမတူပါဘူး:

- သင်က ပိုင်ဆိုင်မထားဘူး — remote မှာ ရှိတယ်
- Async — fetch လုပ်ရတယ်၊ စောင့်ရတယ်
- သင်မသိတဲ့အချိန်မှာ တစ်ခြားသူတွေ ပြောင်းနိုင်တယ်
- ဒါကြောင့် “stale” ဖြစ်သွားနိုင်တယ်

TanStack Query က ဒီပြဿနာတွေကို ဖြေရှင်းပေးပြီး — **caching, background
refetching, retry, pagination, infinite scroll** စတာတွေကို ကိုယ်တိုင်မရေးရဘဲ
ရစေပါတယ်။ အရင်က useEffect + useState နဲ့ ကိုယ်တိုင်ရေးနေရတဲ့ data fetching
logic တွေ အကုန်သက်သာသွားပါတယ်။

## Installation

```bash
npm install @tanstack/react-query
```

React app မှာ `QueryClientProvider` နဲ့ app ကို wrap လုပ်ဖို့လိုပါတယ်:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
    </QueryClientProvider>
  );
}
```

## ပထမဆုံး query — useQuery

`useQuery` hook က data ကို fetch လုပ်ပြီး — `data`, `isLoading`, `isError`,
`error` စတဲ့ state တွေကို ပြန်ပေးပါတယ်:

```tsx
import { useQuery } from "@tanstack/react-query";

async function fetchPosts() {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("API error");
  return res.json();
}

function Posts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],        // cache ထဲမှာ ဒီ query ကို ခွဲခြားဖို့ key
    queryFn: fetchPosts,        // data ယူတဲ့ function
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

`queryKey` က အရေးကြီးပါတယ် — TanStack Query က ဒီ key နဲ့ cache လုပ်ပြီး
key တူရင် data ကို ပြန်သုံးပါတယ်။

## Mutation — data ပြောင်းလဲခြင်း

Data ဖန်တီးခြင်း/ပြင်ခြင်း/ဖျက်ခြင်းအတွက် `useMutation` ကို သုံးပါတယ်:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddPost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) =>
      fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
      }),
    onSuccess: () => {
      // posts list ကို ပြန် fetch လုပ်ဖို့ cache ကို invalidate လုပ်တယ်
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ title: "ဆောင်းပါးအသစ်" })}>
      {mutation.isPending ? "ထည့်နေသည်…" : "ဆောင်းပါး ထည့်မယ်"}
    </button>
  );
}
```

## ဘာကြောင့် TanStack Query သုံးသလဲ

- **Cache အလိုအလျောက်** — နောက်တစ်ခါ ဒီ data လိုရင် network မသွားဘဲ cache ကနေ ပြန်ရ
- **Background revalidation** — window ကို focus ပြန်လုပ်ရင်, network ပြန်ရရင်
  data ကို နောက်ခံမှာ အလိုအလျောက် update လုပ်ပေးတယ်
- **Retry & error handling** — failed query တွေကို အလိုအလျောက် ပြန်ကြိုးစားပေးတယ်
- **Devtools** — query state တွေကို visual အနေနဲ့ ကြည့်လို့ရတယ်
- **Pagination, infinite scroll, optimistic updates** — built-in ပါပြီးသား

## SWR နဲ့ ဘာကွာလဲ

TanStack Query က SWR လိုပဲ data fetching/caching လုပ်တဲ့နေရာမှာ ဆင်တူပြီး —
TanStack Query က feature set ပိုကြီးပါတယ် (mutation, query cancellation,
devtools, framework မျိုးစုံ support)။ SWR က ပေါ့ပါးပြီး API ပိုရိုးရှင်းပါတယ်။
နှစ်ခုလုံးကောင်းပြီး — project ရဲ့ လိုအပ်ချက်ပေါ် မူတည်ပါတယ်။
[SWR စတင်ခြင်း](/docs/swr/getting-started) မှာ နှိုင်းယှဉ်ကြည့်နိုင်ပါတယ်။
