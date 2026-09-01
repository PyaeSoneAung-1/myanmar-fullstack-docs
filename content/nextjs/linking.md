---
title: "Linking & Navigation"
description: "<Link> component နဲ့ client-side navigation, prefetching, useRouter() hook (push/back), shallow navigation, usePathname နဲ့ active link, scroll ပြုမူပုံ"
order: 4
source: "https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating"
status: translated
updated: 2026-09-01
---

## Link Component — Client-side Navigation

Next.js မှာ route တွေက default အားဖြင့် server မှာ render လုပ်ပါတယ် — client က server response ကို စောင့်ရတာကြောင့် navigation နှေးနိုင်ပါတယ်။ ဒါကို ဖြေရှင်းဖို့ Next.js မှာ **prefetching**, **streaming**, **client-side transition** ဆိုတဲ့ built-in optimization တွေ ပါပါတယ်။

Page တွေကြား သွားလာဖို့ အဓိကနည်းလမ်းက `<Link>` component ပါ — `next/link` ကနေ import လုပ်ပြီး HTML `<a>` tag ကို တိုးချဲ့ထားတာဖြစ်ပါတယ်:

```tsx
import Link from 'next/link'

export default function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

`<Link>` နဲ့ သွားတဲ့အခါ — full page reload မဖြစ်ဘဲ **client-side transition** ဖြစ်ပါတယ်။ Shared layout တွေ ထိန်းသိမ်းခံရပြီး — လက်ရှိ page ကို prefetch လုပ်ထားတဲ့ content နဲ့ ချက်ချင်း အစားထိုးပါတယ်။

## Prefetching

`<Link>` က viewport ထဲ ရောက်လာတဲ့အခါ (သို့) hover လုပ်တဲ့အခါ — link ရဲ့ route ကို **နောက်ခံမှာ ကြိုတင် ဆွဲယူ** ပါတယ် (prefetch)။ Static route ဆိုရင် အပြည့်အဝ prefetch ဖြစ်ပြီး — user က click လုပ်တဲ့အခါ နောက် route ရဲ့ data က client မှာ အဆင်သင့် ရှိနေလို့ navigation က instant လို့ ခံစားရပါတယ်။ Dynamic route အတွက်တော့ prefetching ကို ကျော်လိုက်တာ (သို့) `loading.tsx` ရှိရင် တစ်စိတ်တစ်ပိုင်း prefetch လုပ်ပါတယ် — server မှာ အလုပ်မလိုအပ်အောင် ရှောင်တာပါ။ Prefetch မလုပ်ချင်ရင် `<Link prefetch={false}>` ထည့်လို့ရပါတယ် — ဥပမာ infinite scroll လို link အများကြီး ရှိတဲ့နေရာမှာ resource မကုန်အောင်ပါ။

## useRouter() Hook

Programmatic navigation လိုအပ်ရင် — `next/navigation` ကနေ `useRouter()` hook ကို သုံးပါတယ်။ Client component ထဲမှာ:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.push('/dashboard')}>Dashboard သို့</button>
      <button onClick={() => router.back()}>နောက်သို့</button>
    </div>
  )
}
```

`router.push()` က route အသစ်တစ်ခုဆီ သွားဖို့၊ `router.back()` က browser history ထဲက နောက် entry ဆီ ပြန်သွားဖို့ သုံးပါတယ်။ ဒါတွေက `<Link>` လို markup ထဲ မထည့်နိုင်တဲ့ — button click, form submit, timer စတဲ့ နေရာတွေမှာ အသုံးဝင်ပါတယ်။

## Shallow Navigation — URL ပြောင်းရုံပဲ

Filter ရွေးတာ, sort လုပ်တာလို — page reload မလိုဘဲ URL (search params) ကိုပဲ ပြောင်းချင်တဲ့အခါ **shallow navigation** ကို သုံးပါတယ်။ `router.push` ကို URL/search params အပြည့်အစုံနဲ့ ခေါ်ရင် — server က data ပြန်မယူဘဲ URL ပဲ ပြောင်းပြီး `useSearchParams` နဲ့ အလိုက်သင့် sync ဖြစ်ပါတယ်:

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    router.push(`?${params.toString()}`)
  }

  return (
    <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
  )
}
```

ဒီပုံစံက client-side မှာ ရှိပြီးသား data ကို filter/sort လုပ်တာလိုမျိုး — data fetching မလိုတဲ့ URL update တွေအတွက် သင့်တော်ပါတယ်။

## Active Link ပုံစံ (usePathname)

လက်ရှိ route ပေါ်မူတည်ပြီး nav item ကို highlight လုပ်ချင်ရင် — `usePathname()` hook နဲ့ လက်ရှိ path ကို ယူပြီး link ရဲ့ href နဲ့ နှိုင်းယှဉ်ပါတယ်:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  )
}
```

`usePathname` က client component မှာသာ သုံးလို့ရပြီး — layout ထဲက nav bar တွေမှာ အများဆုံး အသုံးပြုပါတယ်။

## Scroll ပြုမူပုံ

Client-side transition တွေမှာ Next.js က **page အပေါ်ဆုံးကို scroll** လုပ်ပေးပါတယ်။ Scroll to top မလုပ်စေချင်ရင် `<Link>` မှာ `scroll={false}` ထည့်လို့ရပြီး — sticky/fixed header နဲ့ ရောထွေးတဲ့အခါ CSS `scroll-padding-top` နဲ့ ချိန်ညှိနိုင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Pages & Layouts](/docs/nextjs/pages-layouts) — page/layout တွေ ဘယ်လို ဖွဲ့စည်းသလဲ
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — dynamic route တွေဆီ link ချိတ်တဲ့အခါ
- [Data Fetching](/docs/nextjs/data-fetching) — page တွေမှာ data ယူနည်း
