---
title: "notFound function (404 page ပြသရန် error throw လုပ်ခြင်း)"
description: "notFound() — resource (ရင်းမြစ်) မတွေ့ရတဲ့အခါ Next.js 404 page render စေရန် NEXT_HTTP_ERROR_FALLBACK;404 error ကို throw လုပ်သော function; Server Components, Server Functions, Route Handlers များတွင် သုံးပုံ, streaming စတင်ပြီးမှ ခေါ်ခြင်း နဲ့ Route Handler ကနေ 404 ပြန်ပို့ခြင်း ဥပမာများ"
order: 240
source: "https://nextjs.org/docs/app/api-reference/functions/not-found"
status: translated
updated: 2026-09-03
---

`notFound` function က Next.js ရဲ့ 404 page တစ်ခုကို render လုပ်စေမယ့် error တစ်ခုကို throw လုပ်ပါတယ်။ သင့် application ထဲက ပျောက်ဆုံးနေတဲ့ (missing) resources တွေကို ကိုင်တွယ်ဖို့ အသုံးဝင်ပါတယ်။ UI ကို [`not-found.js` file](/docs/nextjs/not-found) နဲ့ စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

`notFound()` ကို ခေါ်လိုက်တဲ့အခါ `NEXT_HTTP_ERROR_FALLBACK;404` error တစ်ခု throw ဖြစ်ပြီး — အဲဒီ error ကို throw လုပ်လိုက်တဲ့ route segment ရဲ့ rendering ကို ရပ်တန့်လိုက်ပါတယ်။ ဒါ့အပြင် Next.js က `<meta name="robots" content="noindex" />` tag တစ်ခုကိုပါ ထည့်ပေးလို့ — page ကို search engines တွေမှာ index လုပ်မှာ မဟုတ်ပါဘူး။ ဒါက throw လုပ်ခြင်းအားဖြင့် အလုပ်လုပ်တာမို့ — render path ထဲမှာ ခေါ်ပါ: component တစ်ခု၊ သို့မဟုတ် component တစ်ခုက `await` လုပ်တဲ့ function တစ်ခုအတွင်းမှာ ခေါ်ပါ။ Un-awaited promise တစ်ခုထဲမှာ ချန်ထားခဲ့ရင် — ဘယ်နေရာကမှ catch မလုပ်တဲ့ နေရာမှာ throw ဖြစ်ပြီး — not-found UI က render ဖြစ်မှာ မဟုတ်ပါဘူး (development မှာ server က `⨯ unhandledRejection: NEXT_HTTP_ERROR_FALLBACK;404` လို့ log တက်ပါတယ်)။

`notFound()` ကို [Server Components](/docs/nextjs/server-client-components), [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ [Route Handlers](/docs/nextjs/file-conventions-route) တွေမှာ ခေါ်နိုင်ပါတယ်။

```tsx filename="app/user/[id]/page.tsx" switcher
import { notFound } from 'next/navigation'

async function fetchUser(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  // ...
}
```

```jsx filename="app/user/[id]/page.js" switcher
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  // ...
}
```

## သိထားသင့်သည် (Good to know)

`return notFound()` လို့ ရေးဖို့ မလိုပါဘူး။ ခေါ်ရုံနဲ့ လုံလောက်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ ဒါက function ရဲ့ execution ကို ရပ်တန့်စေမယ့် exception တစ်ခုကို throw လုပ်လို့ပါ။ TypeScript က ဒါကို [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) return type ကနေ နားလည်လို့ — အရင်စစ်ဆေးလိုက်တဲ့ value က နောက်ပိုင်းမှာ narrowed (ကျဉ်းမြောင်းထားသော type) အနေနဲ့ပဲ ဆက်ရှိနေပါတယ်:

```tsx
// fetchUser resolves to a user object, or undefined
const user = await fetchUser(id)

if (!user) {
  notFound()
}

// user is defined here
return <Profile user={user} />
```

Exception တစ်ခုလိုပဲ — ဒါက တစ်ခုခုက ဖမ်းလိုက်တဲ့အထိ call stack ပေါ် အပေါ်ကို ဆက်တက်သွားပါတယ်။ ခေါ်တဲ့ နေရာကို `try/catch` နဲ့ ဝိုင်းထားရင် — ဒါကို ဖိနှိပ်လိုက်လို့ not-found UI က render မဖြစ်တော့ပါဘူး။ ခေါ်တဲ့နေရာ အနားမှာ errors တွေကို catch လုပ်ဖို့ လိုအပ်ရင် — [`unstable_rethrow`](/docs/nextjs/unstable-rethrow) ကို သုံးပြီး interrupt ကို အရင်ဆုံး ဖြတ်သန်းခွင့်ပေးပါ။

## ဥပမာများ

### Streaming စတင်ပြီးမှ `notFound()` ခေါ်ခြင်း (Calling `notFound()` after streaming has started)

Data တွေ load ဖြစ်နေချိန်မှာ page ရဲ့ shell နဲ့ loading UI တွေကို မြင်နေရစေဖို့ — route တစ်ခုလုံးကို block လုပ်မယ့်အစား — ရှိမရှိ စစ်ဆေးမှုကို [`<Suspense>`](https://react.dev/reference/react/Suspense) နဲ့ wrap လုပ်ထားတဲ့ component တစ်ခုအတွင်းမှာ လုပ်ပါ။ ဒီစစ်ဆေးမှုအတွက် အသင့်တော်ဆုံး နေရာကတော့ — data လိုအပ်တဲ့ component က `await` လုပ်တဲ့ data-access function ကိုယ်တိုင်ပါ:

```tsx filename="app/blog/[slug]/page.tsx" switcher highlight={8}
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  if (res.status === 404) {
    notFound()
  }
  if (!res.ok) {
    throw new Error(`Failed to load post: ${res.status}`)
  }
  return res.json()
}

async function Article({ slug }: { slug: string }) {
  const post = await getPost(slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  return (
    <section>
      <Link href="/blog">Blog</Link>
      <Suspense fallback={<p>Loading...</p>}>
        <Article slug={slug} />
      </Suspense>
    </section>
  )
}
```

```jsx filename="app/blog/[slug]/page.js" switcher highlight={8}
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  if (res.status === 404) {
    notFound()
  }
  if (!res.ok) {
    throw new Error(`Failed to load post: ${res.status}`)
  }
  return res.json()
}

async function Article({ slug }) {
  const post = await getPost(slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}

export default async function PostPage({ params }) {
  const { slug } = await params

  return (
    <section>
      <Link href="/blog">Blog</Link>
      <Suspense fallback={<p>Loading...</p>}>
        <Article slug={slug} />
      </Suspense>
    </section>
  )
}
```

Post မရှိတဲ့အခါ — `getPost` က `notFound()` ကို ခေါ်ပြီး throw ဖြစ်သွားပါတယ်။ ဒါက rendering ကာလအတွင်းမှာ ဖြစ်တာမို့ — page shell ကို ပို့လိုက်ပြီးသား ဖြစ်တောင် — exception က အနီးဆုံး [`not-found`](/docs/nextjs/not-found) boundary ဆီ ပျံ့နှံ့သွားပြီး — stream လုပ်ပြီးသား content ရဲ့ နေရာမှာ အစားထိုး render လုပ်ပါတယ်။

အဲဒီ UI ကို သတ်မှတ်ဖို့ route နဲ့အတူ `not-found.tsx` file တစ်ခု ထည့်ပါ။ မထည့်ထားရင် — အနီးဆုံး parent `not-found` boundary က render လုပ်ပြီး — Next.js ရဲ့ default 404 page ဆီ ပြန်ကျသွားပါတယ်:

```tsx filename="app/blog/[slug]/not-found.tsx" switcher
export default function NotFound() {
  return (
    <section>
      <h1>Post not found</h1>
      <p>The post you're looking for doesn't exist.</p>
    </section>
  )
}
```

```jsx filename="app/blog/[slug]/not-found.js" switcher
export default function NotFound() {
  return (
    <section>
      <h1>Post not found</h1>
      <p>The post you're looking for doesn't exist.</p>
    </section>
  )
}
```

ဒီနည်းလမ်းရဲ့ အလျှော့အတင်းကတော့ HTTP status code ပါ။ ဘာကြောင့်လဲဆိုတော့ — စစ်ဆေးမှုက `<Suspense>` boundary အတွင်းမှာ run တာမို့ — response က `200` အနေနဲ့ streaming စတင်နေပြီး — streaming စပြီးတာနဲ့ status ကို ပြောင်းလို့ မရတော့လို့ပါ။ `noindex` tag က soft 404 တစ်ခုကို search results တွေထဲ မရောက်အောင် ကာကွယ်ပေးပါတယ်။ တကယ့် `404` status တစ်ခု ပြန်ပို့ချင်ရင်တော့ — resource ကို response streaming မစခင် စစ်ဆေးဖို့ လိုပါတယ်။ [Cache Components](/docs/nextjs/caching) တွေနဲ့ဆိုရင် — dynamic route တိုင်းက static shell တစ်ခုကို အရင်ဆုံး stream လုပ်တာမို့ — ဒီစစ်ဆေးမှုကို [`proxy`](/docs/nextjs/file-conventions-proxy) ထဲမှာ လုပ်ပါ။ [Status codes](/docs/nextjs/file-conventions-loading#status-codes) ကို ကြည့်ပါ။

### Route Handler တစ်ခုကနေ 404 ပြန်ပို့ခြင်း (Serving a 404 from a Route Handler)

`notFound()` က [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုထဲမှာလည်း အလုပ်လုပ်ပါတယ် — အဲဒီမှာ caller ဆီ `404` ကို ပြန်ပို့ပေးပါတယ်။

```tsx filename="app/api/posts/[slug]/route.ts" switcher
import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: RouteContext<'/api/posts/[slug]'>
) {
  const { slug } = await params
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  if (!res.ok) {
    notFound()
  }
  return NextResponse.json(await res.json())
}
```

```jsx filename="app/api/posts/[slug]/route.js" switcher
import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

export async function GET(request, { params }) {
  const { slug } = await params
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  if (!res.ok) {
    notFound()
  }
  return NextResponse.json(await res.json())
}
```

## Version History

| Version   | အပြောင်းအလဲ          |
| --------- | ---------------------- |
| `v13.0.0` | `notFound` ကို စတင် မိတ်ဆက်။ |
