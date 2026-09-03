---
title: "useSelectedLayoutSegment hook (Layout အောက်တစ်ဆင့်ရှိ active route segment ဖတ်ခြင်း)"
description: "useSelectedLayoutSegment() — Client Component hook နဲ့ ခေါ်ထားတဲ့ Layout ရဲ့ အောက်တစ်ဆင့်မှာရှိတဲ့ active route segment ကို ဖတ်နည်း; parallelRouteKey parameter, return တန်ဖိုးများ, catch-all routes အပြုအမူနဲ့ Cache Components + Suspense လိုအပ်ချက်"
order: 150
source: "https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment"
status: translated
updated: 2026-09-03
---

`useSelectedLayoutSegment` က **Client Component** hook တစ်ခုဖြစ်ပြီး — သူ့ကို ခေါ်ထားတဲ့ Layout ရဲ့ **အောက်တစ်ဆင့် (one level below)** မှာရှိတဲ့ active route segment ကို ဖတ်နိုင်စေပါတယ်။

Navigation UI တွေအတွက် အသုံးဝင်ပါတယ် — ဥပမာ parent layout တစ်ခုအတွင်းက tabs တွေဟာ active ဖြစ်နေတဲ့ child segment ပေါ်မူတည်ပြီး style ပြောင်းလဲနေတာမျိုးပါ။

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>Active segment: {segment}</p>
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>Active segment: {segment}</p>
}
```

> **သိထားသင့်သည် (Good to know)**:
>
> - `useSelectedLayoutSegment` က [Client Component](/docs/nextjs/server-client-components) hook ဖြစ်ပြီး Layout တွေက default အားဖြင့် [Server Components](/docs/nextjs/server-client-components) တွေ ဖြစ်လို့ — `useSelectedLayoutSegment` ကို Layout တစ်ခုထဲကို import လုပ်ထားတဲ့ Client Component တစ်ခုကနေ အများအားဖြင့် ခေါ်ပါတယ်။
> - `useSelectedLayoutSegment` က အောက်တစ်ဆင့်ကပဲ segment ကို ပြန်ပေးပါတယ်။ Active segments အားလုံးကို ပြန်ယူချင်ရင် — [`useSelectedLayoutSegments`](/docs/nextjs/use-selected-layout-segments) ကို ကြည့်ပါ။
> - [Catch-all](/docs/nextjs/file-conventions-dynamic-routes) routes တွေအတွက် — ကိုက်ညီတဲ့ (matched) segments တွေကို ပေါင်းထားတဲ့ string တစ်ခုတည်းအဖြစ် ပြန်ပေးပါတယ်။ ဥပမာ — `app/blog/[...slug]/page.js` ရှိပြီး `/blog/a/b/c` ကို လည်ပတ်တဲ့အခါ `app/blog/layout.js` ကနေ ခေါ်ရင် `'a/b/c'` ကို ပြန်ပေးပါတယ်။

## Parameters

```tsx
const segment = useSelectedLayoutSegment(parallelRouteKey?: string)
```

`useSelectedLayoutSegment` က [`parallelRouteKey`](/docs/nextjs/parallel-routes) တစ်ခုကို _optionally_ (ထည့်လည်းရ၊ မထည့်လည်းရ) လက်ခံပါတယ် — ဒါဆိုရင် အဲဒီ slot အတွင်းက active route segment ကို ဖတ်နိုင်ပါတယ်။

## Returns

`useSelectedLayoutSegment` က active segment ရဲ့ string တစ်ခုကို ပြန်ပေးပြီး — မရှိဘူးဆိုရင် `null` ကို ပြန်ပေးပါတယ်။

ဥပမာ — အောက်က Layouts တွေနဲ့ URLs တွေအတွက် return ရလာမယ့် segment က:

| Layout                    | လည်ပတ်ခဲ့သော URL        | Return ရလာမယ့် Segment |
| ------------------------- | --------------------- | ----------------------- |
| `app/layout.js`           | `/`                   | `null`                  |
| `app/layout.js`           | `/dashboard`          | `'dashboard'`           |
| `app/dashboard/layout.js` | `/dashboard`          | `null`                  |
| `app/dashboard/layout.js` | `/dashboard/settings` | `'settings'`            |
| `app/dashboard/layout.js` | `/dashboard/analytics` | `'analytics'`          |
| `app/dashboard/layout.js` | `/dashboard/analytics/monthly` | `'analytics'`    |

Catch-all routes (`[...slug]`) တွေအတွက် — return ရလာတဲ့ segment မှာ ကိုက်ညီတဲ့ path segments အားလုံးကို string တစ်ခုတည်းအဖြစ် ပေါင်းထည့်ထားပါတယ်:

| Layout               | လည်ပတ်ခဲ့သော URL | Return ရလာမယ့် Segment |
| -------------------- | -------------- | ----------------------- |
| `app/blog/layout.js` | `/blog/a/b/c`  | `'a/b/c'`               |

## အပြုအမူ (Behavior)

### Cache Components

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ဖွင့်ထားတဲ့အခါ — active segment ကို prerendering လုပ်ချိန်မှာ resolve လုပ်နိုင်လား မလုပ်နိုင်ဘူးလားပေါ် မူတည်ပြီး `useSelectedLayoutSegment` က [`Suspense`](https://react.dev/reference/react/Suspense) boundary တစ်ခု လိုအပ်နိုင်ပါတယ်။

- **Static routes တွေနဲ့ [`generateStaticParams`](/docs/nextjs/generate-static-params) ပါတဲ့ routes တွေ**: dynamic params အပါအဝင် route segment တိုင်းကို build time မှာ သိပြီးသားပါ။ Active segment ကို prerendering လုပ်ချိန်မှာ resolve လုပ်လို့ရလို့ — `useSelectedLayoutSegment` က server ပေါ်မှာ resolve ဖြစ်ပြီး `Suspense` boundary ဘာမှ မလိုအပ်ပါဘူး။
- **`generateStaticParams` နဲ့ မလွှမ်းခြုံထားတဲ့ dynamic params ပါတဲ့ routes တွေ**: param က [fallback param](/docs/nextjs/generate-static-params) ဖြစ်ပြီး — request time ရောက်မှသာ သိရပါတယ်။ Active segment ကို prerendering လုပ်ချိန်မှာ resolve လုပ်လို့မရလို့ — `useSelectedLayoutSegment` က suspend ဖြစ်ပါတယ်။ Component (သို့) parent တစ်ခုကို `Suspense` boundary တစ်ခုနဲ့ wrap လုပ်ထားပါ — ဒါဆို prerendering လုပ်ချိန်မှာ ၎င်းရဲ့ fallback ကို render လုပ်နိုင်မှာ ဖြစ်ပြီး — မဟုတ်ရင် build က မအောင်မြင်ပါဘူး။

`useSelectedLayoutSegment` ကို ခေါ်နေတဲ့ component ကိုယ်တိုင် static ဖြစ်နေရင်တောင် ဒါက အကျုံးဝင်ပါတယ်။ ဥပမာ — parent layout တစ်ခုမှာ render လုပ်ထားတဲ့ tab bar ဟာ ၎င်းရဲ့အောက်မှာ unknown dynamic param ရှိတဲ့ page တစ်ခုခု ရှိနေရင် suspend ဖြစ်ပါတယ်။ Layout ရဲ့ ကျန်တဲ့အပိုင်းတွေ prerender ဖြစ်နေဖို့အတွက် — `useSelectedLayoutSegment` ကို ခေါ်တဲ့ component (သို့) parent တစ်ခုကို fallback ပါတဲ့ `Suspense` boundary တစ်ခုနဲ့ wrap လုပ်ထားပါ။

ပြည့်စုံတဲ့ ဖြေရှင်းနည်း options တွေနဲ့ trade-offs တွေအတွက် [Next.js encountered URL data in a Client Component outside of Suspense](https://nextjs.org/docs/messages/blocking-prerender-client-hook) ကို ကြည့်ပါ။

## ဥပမာများ

### Active link component တစ်ခု ဖန်တီးခြင်း

`useSelectedLayoutSegment` ကို သုံးပြီး — active segment ပေါ်မူတည်ပြီး style ပြောင်းတဲ့ active link component တစ်ခု ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — blog တစ်ခုရဲ့ sidebar ထဲက featured posts list (အထူးဖော်ပြထားသော ပို့စ်စာရင်း) မျိုးပါ:

```tsx filename="app/blog/blog-nav-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

// This *client* component will be imported into a blog layout
export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  // Navigating to `/blog/hello-world` will return 'hello-world'
  // for the selected layout segment
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // Change style depending on whether the link is active
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/blog/blog-nav-link.js" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

// This *client* component will be imported into a blog layout
export default function BlogNavLink({ slug, children }) {
  // Navigating to `/blog/hello-world` will return 'hello-world'
  // for the selected layout segment
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // Change style depending on whether the link is active
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```tsx filename="app/blog/layout.tsx" switcher
// Import the Client Component into a parent Layout (Server Component)
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

```jsx filename="app/blog/layout.js" switcher
// Import the Client Component into a parent Layout (Server Component)
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({ children }) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

## Version History

| Version   | အပြောင်းအလဲ                        |
| --------- | --------------------------------- |
| `v13.0.0` | `useSelectedLayoutSegment` ကို စတင် မိတ်ဆက်။ |
