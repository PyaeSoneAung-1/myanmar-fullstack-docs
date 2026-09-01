---
title: "Data Fetching"
description: "Server component တွေမှာ async/await နဲ့ data ယူခြင်း, fetch() ရဲ့ revalidate/no-store options, client-side fetching (SWR), loading.tsx streaming နဲ့ error.tsx အခြေခံ"
order: 5
source: "https://nextjs.org/docs/app/building-your-application/data-fetching/fetching"
status: translated
updated: 2026-09-01
---

## Server Components မှာ Data Fetching

App Router မှာ data fetching ရဲ့ အဓိက နေရာက **server component** ပါ — server မှာ render လုပ်တာဖြစ်လို့ component ကို `async` function လုပ်ပြီး `fetch` ကို `await` လုပ်ရုံပါပဲ:

```tsx
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

Component tree ထဲမှာ တူညီတဲ့ `fetch` request တွေကို **memoize** (တစ်ခါတည်း ပြန်သုံး) လုပ်ပေးပါတယ် — ဒါကြောင့် props တွေ ထပ်ဆင့် ပို့စရာ မလိုဘဲ data လိုတဲ့ component မှာ တိုက်ရိုက် fetch လို့ရပါတယ်။ Server component ဖြစ်လို့ DB credentials နဲ့ query logic တွေက client bundle ထဲ မပါပါဘူး — ORM (ဥပမာ Prisma) နဲ့ database ကို တိုက်ရိုက် ချိတ်လို့လည်း ရပါတယ်။

## fetch() နဲ့ Caching Options

`fetch()` ရဲ့ options တွေနဲ့ caching ကို ထိန်းချုပ်နိုင်ပါတယ်:

```tsx
// ISR-style — 60 စက္ကန့်တိုင်း နောက်ခံမှာ ပြန်စစ်ပြီး cache ကို update လုပ်မယ်
const posts = await fetch('https://api.vercel.app/blog', {
  next: { revalidate: 60 },
})

// ဘယ်တော့မှ cache မလုပ်ဘူး — request တိုင်း fresh data ယူမယ်
const latest = await fetch('https://api.vercel.app/blog/latest', {
  cache: 'no-store',
})
```

`next: { revalidate: 60 }` က **ISR (Incremental Static Regeneration)** ပုံစံပါ — 60 စက္ကန့်အတွင်း request တွေကို cache ကနေ ချက်ချင်း ပြန်ပေးပြီး နောက်ခံမှာ page ကို ပြန်ထုတ်ပေးပါတယ်။ `cache: 'no-store'` ကတော့ request တိုင်း server ကနေ အသစ် ယူတာဖြစ်လို့ — user ဆီ ပုဂ္ဂိုလ်ရေး သီးသန့် ဖြစ်နေတဲ့ data လိုမျိုး cache မလုပ်သင့်တဲ့နေရာတွေမှာ သုံးပါတယ်။

## Client Components မှာ Data Fetching

Server component မှာ fetch လုပ်တာက default နဲ့ အကောင်းဆုံး ဖြစ်ပေမယ့် — user interaction ပေါ်မူတည်ပြီး browser ထဲမှာ fetch လုပ်ချင်တဲ့ အခြေအနေတွေလည်း ရှိပါတယ်။ Client component မှာ React ရဲ့ `useEffect` + `fetch` ကို သုံးလို့ရသလို — ပိုကောင်းတာကတော့ **SWR** ဒါမှမဟုတ် **React Query** လို community library တွေကို သုံးတာပါ။ ဒီ library တွေမှာ caching, revalidation (ဒေတာကို ပြန်လည်စစ်ဆေးခြင်း), loading/error state တွေ အဆင်သင့် ပါပြီးသား ဖြစ်လို့ code ပိုတိုပြီး ပြုပြင်ရတာ လွယ်ပါတယ်။ (SWR အသေးစိတ်ကို ဒီ site ရဲ့ [useSWR data fetching](/docs/swr/data-fetching) မှာ ဖတ်နိုင်ပါတယ်။)

## loading.tsx — Streaming

Data fetch က နှေးရင် — page တစ်ခုလုံး block ဖြစ်နေမယ့်အစား **streaming** နဲ့ loading UI ကို ပြပြီး — data ရတာနဲ့ အလိုအလျောက် အစားထိုး လုပ်လို့ရပါတယ်။ Route folder ထဲမှာ `loading.tsx` ထည့်ရုံပါပဲ:

```tsx
export default function Loading() {
  // Data မရသေးချိန်မှာ ပြမယ့် fallback UI
  return <div>Loading...</div>
}
```

`loading.tsx` ထည့်လိုက်ရင် Next.js က page ကို `<Suspense>` boundary ထဲ အလိုအလျောက် ပတ်ပေးပြီး — shared layout တွေက interactive ဖြစ်နေတုန်းပဲ၊ loading state က ချက်ချင်း ပေါ်ပါတယ်။ Page ရဲ့ အပိုင်းတစ်ပိုင်းချင်းစီပဲ stream လုပ်ချင်ရင် component ကို `<Suspense fallback={...}>` နဲ့ ကိုယ်တိုင် ပတ်လို့လည်း ရပါတယ်။

## error.tsx — Error Handling အခြေခံ

Runtime မှာ error တက်ရင် user ကို အဆင်ပြေတဲ့ error UI ပြဖို့ route folder ထဲမှာ `error.tsx` ထည့်ပါတယ် — ဒါက **client component** ဖြစ်ရပါမယ်:

```tsx
'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>တစ်ခုခု မှားသွားပါတယ်!</h2>
      <button onClick={reset}>ပြန်ကြိုးစားမယ်</button>
    </div>
  )
}
```

`error.tsx` က error ဖြစ်တဲ့ segment နဲ့ အဲဒီအောက် children တွေအတွက်ပဲ အလုပ်လုပ်ပြီး — layout ကိုယ်တိုင် (တူညီတဲ့ level) ထဲက error တွေကို မဖမ်းနိုင်ပါဘူး။ `reset` က error ဖြစ်တဲ့ segment ကို ပြန် render လုပ်ဖို့ သုံးပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Dynamic Routes](/docs/nextjs/dynamic-routes) — params နဲ့ data fetching ပေါင်းနည်း
- [Route Handlers (API)](/docs/nextjs/route-handlers) — ကိုယ်ပိုင် API endpoint တွေ ဆောက်နည်း
- [Linking & Navigation](/docs/nextjs/linking) — loading state နဲ့ navigation မြန်အောင်
