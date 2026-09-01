---
title: "Default Query Function (ပုံမှန် Query Function)"
description: "App တစ်ခုလုံးအတွက် default query function တစ်ခုတည်း သတ်မှတ်ပြီး query key တွေနဲ့သာ fetch လုပ်ရမယ့်အရာကို ခွဲခြားသတ်မှတ်နည်း — defaultOptions နဲ့ queryFn ကို ဘယ်လို override လုပ်မလဲ"
order: 29
source: "https://tanstack.com/query/latest/docs/framework/react/guides/default-query-function"
status: translated
updated: 2026-09-01
---

ဘယ်အကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် — သင့် app တစ်ခုလုံးအတွက် query function တစ်ခုတည်းကို မျှဝေသုံးချင်ပြီး — fetch လုပ်ရမယ့်အရာကို query key တွေနဲ့သာ ခွဲခြားသတ်မှတ်ချင်တယ်ဆိုရင် — TanStack Query ကို **default query function** (ပုံမှန် query function) ပေးခြင်းအားဖြင့် ဒါကို လုပ်နိုင်ပါတယ်:

```tsx
// Query key ကို လက်ခံရရှိမယ့် default query function တစ်ခု သတ်မှတ်ပါ
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com${queryKey[0]}`,
  )
  return data
}

// defaultOptions နဲ့ သင့် app ကို default query function ပေးပါ
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}

// အခုဆိုရင် လုပ်စရာက key တစ်ခုပဲ ပေးလိုက်ရုံပါပဲ!
function Posts() {
  const { status, data, error, isFetching } = useQuery({ queryKey: ['/posts'] })

  // ...
}

// queryFn ကို ချန်လှပ်ပြီး options တွေဆီ တိုက်ရိုက်သွားလို့လည်း ရပါတယ်
function Post({ postId }) {
  const { status, data, error, isFetching } = useQuery({
    queryKey: [`/posts/${postId}`],
    enabled: !!postId,
  })

  // ...
}
```

Default `queryFn` ကို ဘယ်အချိန်မဆို override လုပ်ချင်ရင် — ပုံမှန်အတိုင်း ကိုယ်ပိုင် `queryFn` ကို ထည့်ပေးလိုက်ရုံပါပဲ။
