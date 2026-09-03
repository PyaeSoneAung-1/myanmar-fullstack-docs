---
title: "Optimizing Prefetching (prefetching ကို အကောင်းဆုံး ဖြစ်အောင် လုပ်ခြင်း)"
description: "Cache Components နဲ့ Partial Prefetching အောက်မှာ `<Link prefetch={true}>` သုံးပြီး per-link URL data ကို navigation မလုပ်ခင် ဖြေရှင်းခြင်း၊ App Shell ထဲ session data ထည့်သွင်းခြင်းနဲ့ use cache: private — trade-offs အပါအဝင်"
order: 186
source: "https://nextjs.org/docs/app/guides/optimizing-prefetching"
status: translated
updated: 2026-09-03
---

Prefetching က route တစ်ခုရဲ့ JavaScript, CSS နဲ့ RSC payload တွေကို — user က အဲဒီ route ဆီ မသွားခင် ကြိုတင် ဒေါင်းလုဒ်လုပ်ပေးလို့ — router က roundtrip (server ဆီ ပြန်သွားစရာ) မလိုဘဲ နောက် route ကို render လုပ်နိုင်ပါတယ်။ App Router က default အနေနဲ့ ဘာတွေကို prefetch လုပ်လဲဆိုတာ [Prefetching guide](/docs/nextjs/prefetching) မှာ ဖော်ပြထားပါတယ်။

[Cache Components](/docs/nextjs/caching) နဲ့ [Partial Prefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) တို့နဲ့ဆို — [`<Link>`](/docs/nextjs/component-link) တစ်ခုက route တစ်ခုချင်းစီအတွက် ပြန်သုံးလို့ရတဲ့ [**App Shell**](https://nextjs.org/docs/app/glossary#app-shell) တစ်ခုကို default အနေနဲ့ prefetch လုပ်ပါတယ်။ App Shell ထဲမှာ route ရဲ့ static output ပါဝင်ပြီး — [`cookies()`](/docs/nextjs/cookies) (သို့) [`headers()`](/docs/nextjs/headers) တွေကို ဖတ်တဲ့ routes တွေအတွက်တော့ — session-specific UI တွေလည်း ပါဝင်ပါတယ်။ Route တစ်ခုတည်းကို ညွှန်တဲ့ links တွေက အဲဒီ App Shell ကိုပဲ ပြန်သုံးပါတယ်။

Shared App Shell ထဲမှာတော့ — destination အလိုက် ပြောင်းလဲတတ်တဲ့ URL data တွေ ([`searchParams`](/docs/nextjs/file-conventions-page) နဲ့ [`params`](/docs/nextjs/file-conventions-page) လိုမျိုး) မပါဝင်ပါဘူး။ Link တစ်ခုပေါ်မှာ `prefetch={true}` သတ်မှတ်လိုက်ရင် — သူ့ရဲ့ [URL data](https://nextjs.org/docs/app/glossary#url-data) ပေါ် မူတည်တဲ့ cached content တွေကို navigation အပြီးမှာ stream လုပ်မယ့်အစား — navigation မလုပ်ခင် ကြိုဖြေရှင်းနိုင်ပါတယ်။

ဒီ guide က [Cache Components](/docs/nextjs/caching) နဲ့ [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) enable လုပ်ထားပြီးသား ဆိုတဲ့ အပေါ်မှာ အခြေခံပါတယ်:

```ts filename="next.config.ts" highlight={4,5}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

ဒါ့အပြင် သင့် route က instant navigation အတွက် ဖွဲ့စည်းပြီးသား ဖြစ်ဖို့လည်း ယူဆပါတယ်။ မဖြစ်သေးရင် — အရင်ဆုံး [Instant navigation guide](https://nextjs.org/docs/app/guides/instant-navigation) ကနေ သင့် route ရဲ့ caching structure ကို စစ်ဆေး အတည်ပြုပြီးမှ စတင်ပါ။

## URL data ကို prefetch time မှာ ဖြေရှင်းခြင်း

Navigation မလုပ်ခင် အဲဒီ link အတွက် URL data ကို ဖြေရှင်းဖို့ `<Link prefetch={true}>` ကို သတ်မှတ်ပါ။ Destination က [Partial Prefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) ကို သုံးထားရမှာ ဖြစ်ပြီး — `partialPrefetching` နဲ့ global အနေနဲ့ (သို့) segment တစ်ခုချင်းစီအတွက် [`prefetch = 'partial'`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch#partial) နဲ့ enable လုပ်ထားရပါမယ်။

`/` ပေါ်က user တစ်ယောက်က `/search?q=react` နဲ့ `/search?q=next` ဆီ ညွှန်ထားတဲ့ links တွေကို မြင်ရပြီး — link တစ်ခုချင်းစီက `prefetch={true}` နဲ့ opt in လုပ်ထားပါတယ်:

```tsx filename="app/page.tsx"
import Link from 'next/link'

export default function Home() {
  return (
    <nav>
      <Link href="/search?q=react" prefetch={true}>
        React
      </Link>
      <Link href="/search?q=next" prefetch={true}>
        Next.js
      </Link>
    </nav>
  )
}
```

Destination က static heading တစ်ခုနဲ့ — query ပေါ် မူတည်တဲ့ `<Results>` list တစ်ခုကို render လုပ်ပါတယ်။ Query တစ်ခုချင်းစီကို cache လုပ်ထားပြီး — တစ်ကြိမ် တွက်ပြီးတာကို ပြန်သုံးပါတယ်။

```tsx filename="app/search/page.tsx"
import { Suspense } from 'react'

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <>
      <h1>Search</h1>
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function Results({
  searchParams,
}: {
  searchParams: PageProps<'/search'>['searchParams']
}) {
  const { q } = await searchParams
  return <ResultList items={await search(q)} />
}

async function search(q: string) {
  'use cache'
  return db.search(q)
}
```

`prefetch={true}` မပါဘဲ — App Shell က `<h1>` ကို render လုပ်ပြီး `<Results>` ရဲ့ fallback ကို ပြပါတယ်။ Query က click လုပ်ပြီးမှ ဖြေရှင်းပြီး — ရလဒ်တွေက stream ဝင်ပါတယ်။

Link ပေါ်မှာ `prefetch={true}` ပါရင်တော့ — router က click မလုပ်ခင် `<Results>` ကို ဖြေရှင်းပြီးသား prerender တစ်ခုကို prefetch လုပ်ပါတယ်။ `q` တန်ဖိုးက link ရဲ့ URL ကနေ ရတာ ဖြစ်လို့ prefetch time မှာ သိပြီးသား ဖြစ်ပြီး — cache လုပ်ထားတဲ့ `search(q)` က ရလဒ်ကို ပေးပါတယ်။ Click လုပ်တဲ့အခါ — fallback မလိုဘဲ ရလဒ်တွေ ချက်ချင်း render ဖြစ်ပါတယ်။

Prerender က static (သို့) cached ဖြစ်သမျှကို ဖြတ်ကျော်ပြီး — uncached reads တွေမှာ ရပ်တန့်ကာ — ဝန်းရံထားတဲ့ `<Suspense>` boundary ဆီ fall back လုပ်ပါတယ်။ အဲဒီ boundary က [route ကို instant navigation အတွက် ဖွဲ့စည်းထားစဉ်က](https://nextjs.org/docs/app/guides/instant-navigation) ရှိပြီးသားပါ။

Per-link prefetch တစ်ခုကို generate လုပ်တာက — **prefetchable link တစ်ခုချင်းစီအတွက် server invocation တစ်ခု** ကုန်ကျလို့ — link တစ်ခုချင်းစီအလိုက် opt-in လုပ်ရပါတယ်။ Content အားလုံး statically render လုပ်လို့ရတဲ့ pages တွေမှာတော့ — Next.js က static cache ကနေ prefetch ကို ဆောင်ရွက်ပေးပါတယ်။ Non-static data တွေ သုံးတဲ့ page တစ်ခုကတော့ — prefetch တစ်ခုချင်းစီအတွက် ပြန် generate လုပ်ပါတယ်။

> **သိထားသင့်သည်:** Cold cache (ပထမဆုံး visit (သို့) သက်တမ်းကုန်ပြီးနောက်) ဆိုရင် — server က cached result ကို ပြန်တွက်ရပါသေးတယ်။ အဲဒီ ပထမဆုံး navigation မှာ loading spinner ကို user မြင်ရနိုင်ပါတယ်။ Cache နွေးနေသရွေ့ (warm) — နောက်ပိုင်း navigations တွေက instant ဖြစ်ပါတယ်။

`searchParams` လိုပဲ — `params` ကလည်း [`generateStaticParams`](/docs/nextjs/generate-static-params) နဲ့ values တွေ ကြိုသတ်မှတ်ထားရင်တောင် `<Suspense>` boundary တစ်ခု လိုအပ်ပါတယ်။ Statically သိထားတဲ့ param တစ်ခုကလည်း URL တစ်ခုတည်းနဲ့ပဲ သက်ဆိုင်တုန်းပါပဲ။ `prefetch={true}` နဲ့ per-link prefetch က — `generateStaticParams` မဖုံးအုပ်ထားတဲ့ values တွေကိုပါ ဖြေရှင်းပေးပါတယ်။

## Session data တွေကို shell ထဲ ထည့်သွင်းခြင်း

`prefetch={true}` က URL data ကို ဖြေရှင်းပေးပါတယ်။ Session data ကတော့ သီးခြား စီမံပါတယ်။ `cookies()` (သို့) `headers()` တွေကို ဖတ်တဲ့ route တစ်ခုက (`"use cache: private"` ကနေတစ်ဆင့် ဖတ်တာ အပါအဝင်) — သူ့ရဲ့ session data ပါဝင်တဲ့ App Shell တစ်ခု ရပါတယ်။ Session data ကို client ပေါ်မှာ session တစ်ခုချင်းစီအလိုက် cache လုပ်ပြီး — per-link prefetch မလိုဘဲ navigation မှာ အသင့်ဖြစ်နေပါတယ်။

Session data ပေါ် မူတည်တဲ့ lookup တစ်ခုက — `search(q)` က URL အတွက် လိုသလိုပဲ — cache lifetime (cache သက်တမ်း) လိုအပ်ပါတယ်။ Cookie တစ်ခုကို ဖတ်ပြီး — အဲဒါပေါ် အခြေခံတဲ့ content ကို ရှာတဲ့ dashboard nav တစ်ခုကို ကြည့်ပါ:

```tsx filename="app/dashboard/layout.tsx"
import { Suspense } from 'react'

export default function DashboardLayout({
  children,
}: LayoutProps<'/dashboard'>) {
  return (
    <div>
      <Suspense fallback={<nav>Loading...</nav>}>
        <UserNav />
      </Suspense>
      <main>{children}</main>
    </div>
  )
}
```

Cookie ကိုယ်တိုင်က App Shell က သိပြီးသား session data ပါ။ ဒါပေမယ့် `"use cache"` က cached function ထဲမှာ `cookies()` ကို ဖတ်လို့ မရတာမို့ — ဒီအချက်ကို ပေါင်းကူးဖို့ ပုံစံ နှစ်မျိုး ရှိပါတယ်:

- **Extract and pass (ထုတ်ယူပြီး ထည့်ပေးခြင်း)** — lookup ရလဒ်က sessions အများကြီးကြားမှာ share လုပ်တဲ့အခါ
- **`"use cache: private"`** — session တစ်ခုတည်းနဲ့ သက်ဆိုင်တဲ့အခါ

### Extract and pass

Cookie ကို cached function ရဲ့ အပြင်မှာ ဖတ်ပြီး — value ကို argument အနေနဲ့ ထည့်ပေးပါ။ `cookies()` ခေါ်တာက cache scope ရဲ့ အပြင်မှာ ရှိနေပြီး — argument က boundary ကို ဖြတ်သွားကာ — cached function က deterministic signature (ရလဒ် တစ်ထပ်တည်းကျတဲ့ ပုံစံ) ရှိပါတယ်။ Cache entry က အဲဒီ argument နဲ့ key လုပ်ထားလို့ — value တူညီတဲ့ sessions တွေက entry တစ်ခုတည်းကို share လုပ်ပါတယ်။

```tsx filename="app/dashboard/user-nav.tsx"
import { cookies } from 'next/headers'

async function UserNav() {
  const team = (await cookies()).get('team')?.value
  const topics = await getTopics(team)
  return (
    <nav>
      {topics.map((topic) => (
        <a key={topic.id} href={topic.href}>
          {topic.label}
        </a>
      ))}
    </nav>
  )
}

async function getTopics(team: string | undefined) {
  'use cache'
  return db.topics.forTeam(team)
}
```

တိုက်ရိုက် visit တစ်ခုမှာ — `<UserNav>` က lookup ဖြေရှင်းပြီးတဲ့အထိ သူ့ရဲ့ fallback ကို ပြပါတယ်။ Navigation မှာတော့ — App Shell က အဲဒါကို ကြိုဖြေရှင်းပြီးသား ဖြစ်ပါတယ်။ ဘာကြောင့်လဲဆိုတော့ team cookie က shell ဖတ်လို့ရတဲ့ session data မို့ပါ။ Team တူညီတဲ့ sessions တွေက cache entry တစ်ခုတည်းကို share လုပ်လို့ — အောက်ခံ data ဆီက traffic က session အရေအတွက်နဲ့ မဟုတ်ဘဲ — team အရေအတွက်နဲ့ပဲ ချဲ့ထွင်ပါတယ် (scale)။

Caching directive မပါတဲ့ ဘာမဆို — navigation အပြီးမှာ stream ဝင်ပါသေးတယ်။ Shell တစ်ခုက navigation မလုပ်ခင် ကြိုပြင်ဆင်လို့ရတာကိုပဲ ကိုင်ထားနိုင်တာ ဖြစ်ပြီး — page တစ်ခုလုံး မဟုတ်ပါဘူး။ Caching structure ခွင့်ပြုသလောက်ပဲ ရှေ့ဆက် ဖြေရှင်းပါတယ်။

### `"use cache: private"`

Lookup က session တစ်ခုတည်းနဲ့ သက်ဆိုင်ရင် — [`"use cache: private"`](/docs/nextjs/use-cache-private) ကို သုံးပါ။ ဒါက cookies, headers (သို့) အခြား runtime data တွေကို တိုက်ရိုက် ဖတ်တဲ့ function တစ်ခုကို cache lifetime သတ်မှတ်ပေးပါတယ်။ ရလဒ်တွေကို browser ထဲမှာပဲ — အဲဒီ session အတွက် scope လုပ်ပြီး cache လုပ်ပါတယ်။

```tsx filename="app/dashboard/user-nav.tsx"
import { cookies } from 'next/headers'

async function UserNav() {
  const user = await getUser()
  return <nav>{user.name}</nav>
}

async function getUser() {
  'use cache: private'
  const session = (await cookies()).get('session')?.value
  return db.users.findBySession(session)
}
```

ဒီမှာ `cookies()` က cached function ရဲ့ အတွင်းမှာ ရှိနေပြီး — `"use cache: private"` အောက်မှာပဲ အလုပ်လုပ်ပါတယ်။ Runtime data ကို အပြင်ကနေ ထုတ်ယူလို့ မရတဲ့အခါ သုံးတဲ့ ပုံစံလည်း ဖြစ်ပါတယ်: auth helpers တွေက `Date.now()` ကို token ရဲ့ သက်တမ်းနဲ့ စစ်တာ (သို့) session helpers တွေက သူတို့ code ထဲ နက်နက်မှာ cookies တွေကို ဖတ်တာမျိုး — ဒါတွေကို call site မှာ wrap လုပ်လို့ မရပါဘူး။

Scope ထဲက အရာအားလုံးက lifetime တစ်ခုတည်းကို မျှဝေပါတယ်။ `"use cache: private"` ကို runtime data access ရဲ့ အနီးဆုံး နေရာမှာ ထားပါ။

## Trade-offs (အကျိုးအမြတ်နဲ့ ကုန်ကျစရိတ် ချိန်ဆမှု)

`prefetch={true}` ကို အောက်ပါ routes တွေမှာ သုံးပါ:

- Component tree ရဲ့ အစိတ်အပိုင်း တစ်ခုက URL data ပေါ် မူတည်နေရင် — URL အပြည့်အစုံ၊ `searchParams` (သို့) [`generateStaticParams`](/docs/nextjs/generate-static-params) နဲ့ မဖြေရှင်းရသေးတဲ့ `params`
- Tree ရဲ့ အဲဒီ အစိတ်အပိုင်းမှာ သိထားတဲ့ cache lifetime ရှိရင် (`"use cache"` (သို့) `"use cache: private"` နဲ့ ဖော်ပြလို့ရတဲ့)
- Traffic က per-link server invocation ကို တရားမျှတစေရင်

Prefetch က App Shell ထက် ပိုကောင်းတဲ့ UI မထုတ်လုပ်နိုင်ရင် — မသုံးပါနဲ့။ မြင်ရတဲ့ `<Link prefetch={true}>` တစ်ခုချင်းစီက server တစ်လုံးကို နှိုးနိုင်ပြီး — click မလုပ်ခင် page ရဲ့ ပိုများတဲ့ အစိတ်အပိုင်း အသင့်ဖြစ်မှသာ အဲဒီ ကုန်ကျစရိတ်က တန်ပါတယ်:

- Route မှာ URL-data dependency နည်းတာ (သို့) မရှိတာ — App Shell က navigation ကို ချက်ချင်း ဖြစ်စေပြီးသားပါ
- Dependent content က request တိုင်းမှာ အသစ် ဖြစ်နေရတာ — prerender က `<Suspense>` fallback တစ်ခုတည်းမှာ ရပ်လို့ — UI က user အတွက် ဘယ်လိုပဲ ဖြစ်ဖြစ် အတူတူပါပဲ
- Route ကို ခဏခဏ မသွားဖြစ်တာ — click-through ဖြစ်ဖြစ် မဖြစ်ဖြစ် visible link တစ်ခုချင်းစီအတွက် ပေးရပါတယ်

Per-link prefetch က best-effort (အကောင်းဆုံး ကြိုးစားချက်) သဘောပါ — click မလုပ်ခင် အပြီးသတ်နိုင်တဲ့ navigations တွေကိုပဲ အကူအညီ ပေးပါတယ်။ Network နှေးတဲ့အခါ၊ links အများကြီး ရှိတဲ့ feed တစ်ခုမှာ (သို့) တိုက်ရိုက် visit တစ်ခုမှာဆို — user navigate လုပ်တဲ့အခါ အသင့် မဖြစ်သေးဘဲ — navigation က App Shell ဆီ fall back လုပ်ပါတယ်။

Route တစ်ခုဆီ ညွှန်တဲ့ links အများကြီး တစ်ပြိုင်နက် မြင်ရတဲ့အခါ (card တွေရဲ့ grid လိုမျိုး) — `<Link prefetch={true}>` တစ်ခုချင်းစီက viewport ထဲ ဝင်လာတာနဲ့ သူ့ content ကို prefetch လုပ်လို့ — grid တစ်ခုက card တစ်ခုချင်းစီအတွက် server request တစ်ခုစီ လုပ်ပါတယ်။ အဲဒီအစား — intent ပေါ်မှာ prefetch လုပ်ပါ။ [Hover-triggered prefetch](/docs/nextjs/prefetching) က user နှိပ်ဖို့ များတဲ့ links တွေကိုပဲ ယူပါတယ်။ Default `<Link>` ( `prefetch={true}` မပါတဲ့) က App Shell ကိုပဲ prefetch လုပ်လို့ — ဒီကုန်ကျစရိတ် မသင့်ပါဘူး။

|                        | **App Shell**                                | **`prefetch={true}` နဲ့ per-link prefetch**          |
| ---------------------- | -------------------------------------------- | ----------------------------------------------------- |
| **Scope (အတိုင်းအတာ)** | Route တစ်ခုစီအတွက် တစ်ခု                     | Visible `<Link prefetch={true}>` တစ်ခုစီအတွက် တစ်ခု |
| **Content**            | Route ရဲ့ rendered output — per-link data မပါ | အဲဒါအတူတူ + per-link URL data ပါ ဖြေရှင်းပြီးသား    |
| **Cost (ကုန်ကျစရိတ်)** | Route အရေအတွက်နဲ့ အကန့်အသတ်                  | Visible link အရေအတွက်နဲ့ အကန့်အသတ်                   |
| **Role (အခန်းကဏ္ဍ)**   | Default prefetch                              | Click မလုပ်ခင် ပိုပြီး render လုပ်ထား                 |

## နောက်တစ်ဆင့်တွေ

- [Adopting Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) — ပုံစံသစ်အောက်မှာ `<Link>` က ဘယ်လို ပြုမူလဲ၊ ရှိပြီးသား apps တွေကို ဘယ်လို ပြောင်းရွှေ့မလဲ
- [`prefetch` API reference](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch) — prefetch modes အားလုံးအတွက်
- [`use cache: private` reference](/docs/nextjs/use-cache-private) — per-user caching အသေးစိတ်အတွက်
- [Instant navigation guide](https://nextjs.org/docs/app/guides/instant-navigation) — route ရဲ့ caching structure ကို စစ်ဆေးဖို့
- [Caching](/docs/nextjs/caching) — `use cache`, Suspense နဲ့ Partial Prerendering အကြောင်း နောက်ခံအချက်အလက်တွေအတွက်
