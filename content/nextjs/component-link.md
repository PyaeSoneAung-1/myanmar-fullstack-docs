---
title: "link (<Link>)"
description: "<Link> component (next/link) — routes တွေကြား prefetching နဲ့ client-side navigation အတွက် အဓိက နည်းလမ်း; href, replace, scroll, prefetch, onNavigate, transitionTypes props များနှင့် ဥပမာများ"
order: 70
source: "https://nextjs.org/docs/app/api-reference/components/link"
status: translated
updated: 2026-09-02
---

`<Link>` က HTML ရဲ့ `<a>` element ကို ချဲ့ထွင်ထားတဲ့ React component တစ်ခုဖြစ်ပြီး — routes တွေကြားမှာ [prefetching](/docs/nextjs/linking#prefetching) နဲ့ client-side navigation တွေကို ပံ့ပိုးပေးပါတယ်။ Next.js မှာ routes တွေကြား သွားလာဖို့ အဓိက နည်းလမ်း ဖြစ်ပါတယ်။

အခြေခံ အသုံးပြုပုံ:

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

## Reference

`<Link>` component ဆီ အောက်ပါ props တွေကို ပေးပို့နိုင်ပါတယ်:

| Prop                                  | Example                          | Type                       | Required |
| ------------------------------------- | -------------------------------- | -------------------------- | -------- |
| [`href`](#href-required)              | `href="/dashboard"`              | String or Object           | Yes      |
| [`replace`](#replace)                 | `replace={false}`                | Boolean                    | -        |
| [`scroll`](#scroll)                   | `scroll={false}`                 | Boolean                    | -        |
| [`prefetch`](#prefetch)               | `prefetch={false}`               | Boolean, `"auto"`, or null | -        |
| [`onNavigate`](#onnavigate)           | `onNavigate={(e) => {}}`         | Function                   | -        |
| [`transitionTypes`](#transitiontypes) | `transitionTypes={['slide-in']}` | `string[]`                 | -        |

> **သိထားသင့်သည်:** `<a>` tag ရဲ့ attribute တွေဖြစ်တဲ့ `className` (သို့) `target="_blank"` တွေကို `<Link>` ဆီ props အဖြစ် ထည့်နိုင်ပြီး — အောက်ခံ `<a>` element ဆီ ပို့ဆောင်ပေးပါတယ်။

### `href` (required)

သွားရောက်ရမယ့် path (သို့) URL ပါ။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

// Navigate to /about?name=test
export default function Page() {
  return (
    <Link
      href={{
        pathname: '/about',
        query: { name: 'test' },
      }}
    >
      About
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

// Navigate to /about?name=test
export default function Page() {
  return (
    <Link
      href={{
        pathname: '/about',
        query: { name: 'test' },
      }}
    >
      About
    </Link>
  )
}
```

### `replace`

**Default က `false` ပါ။** `true` ဆိုရင် — `next/link` က [browser ရဲ့ history](https://developer.mozilla.org/docs/Web/API/History_API) stack ထဲ URL အသစ်တစ်ခု ထည့်မယ့်အစား လက်ရှိ history state ကို အစားထိုး (replace) လုပ်ပါတယ်။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

### `scroll`

**Default က `true` ပါ။** Next.js ထဲက `<Link>` ရဲ့ ပုံမှန် scroll အပြုအမူက — browsers တွေ back/forward navigation တွေကို ကိုင်တွယ်သလိုပဲ — **scroll position ကို ထိန်းထားပေးတာ** ဖြစ်ပါတယ်။ [Page](/docs/nextjs/file-conventions-page) အသစ်တစ်ခုဆီ သွားတဲ့အခါ — Page က viewport ထဲမှာ မြင်နေရသရွေ့ scroll position က အတူတူ ရှိနေပါတယ်။ ဒါပေမယ့် Page က viewport ထဲမှာ မမြင်ရဘူးဆိုရင် — Next.js က ပထမဆုံး Page element ရဲ့ ထိပ်ဆုံးဆီ scroll လုပ်ပါတယ်။

`scroll = {false}` ဆိုရင် — Next.js က ပထမဆုံး Page element ဆီ scroll လုပ်ဖို့ ကြိုးစားမှာ မဟုတ်ပါဘူး။

> **သိထားသင့်သည်:** Next.js က scroll behavior ကို စီမံခန့်ခွဲတဲ့အခါ `scroll: false` ဟုတ်မဟုတ် အရင်ဆုံး စစ်ဆေးပါတယ်။ Scrolling ဖွင့်ထားရင် — navigation အတွက် သက်ဆိုင်တဲ့ DOM node ကို ဖော်ထုတ်ပြီး top-level element တစ်ခုချင်းစီကို စစ်ဆေးပါတယ်။ Scroll လုပ်လို့ မရတဲ့ element တွေနဲ့ rendered HTML မရှိတဲ့ element တွေကို ကျော်သွားပါတယ် — ဒီထဲမှာ sticky (သို့) fixed positioned element တွေ၊ `getBoundingClientRect` နဲ့ တွက်ထားတဲ့ non-visible element တွေလိုမျိုး မြင်နိုင်မှု မရှိတဲ့ element တွေလည်း ပါဝင်ပါတယ်။ ပြီးရင် Next.js က sibling တွေကြားကို ဆက်သွားပြီး — viewport ထဲမှာ မြင်ရတဲ့ scrollable element တစ်ခုကို တွေ့ရှိတဲ့အထိ ဆက်ရှာဖွေပါတယ်။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

### `prefetch`

`<Link />` component တစ်ခုက user ရဲ့ viewport ထဲ ဝင်လာတဲ့အခါ (အစပိုင်းမှာ ဖြစ်စေ scroll လုပ်လို့ ဖြစ်စေ) prefetching ဖြစ်ပေါ်ပါတယ်။ Next.js က ချိတ်ဆက်ထားတဲ့ route (ဆိုလိုတာ `href` က ညွှန်တဲ့ route) နဲ့ သူ့ရဲ့ data ကို background မှာ prefetch လုပ်ပြီး load လုပ်ပါတယ် — client-side navigation တွေရဲ့ performance ကို ပိုမိုကောင်းမွန်စေဖို့ပါ။ User က `<Link />` ပေါ်မှာ hover လုပ်တဲ့အချိန်မှာ prefetched data က သက်တမ်းကုန်သွားပြီဆိုရင် — Next.js က သူ့ကို နောက်တစ်ခါ ထပ် prefetch လုပ်ဖို့ ကြိုးစားပါတယ်။ **Prefetching က production မှာပဲ ဖွင့်ထားပါတယ်**။

`prefetch` prop ဆီ အောက်ပါ တန်ဖိုးတွေကို ပေးနိုင်ပါတယ်:

- **`"auto"` (သို့) `null` (default)**: Prefetch behavior က route က static လား dynamic လားပေါ် မူတည်ပါတယ်။ Static routes တွေအတွက်ဆို — route တစ်ခုလုံးကို (data အားလုံး အပါအဝင်) prefetch လုပ်ပါတယ်။ Dynamic routes တွေအတွက်ဆို — [`loading.js`](/docs/nextjs/file-conventions-loading#instant-loading-states) boundary ပါတဲ့ အနီးဆုံး segment အထိ route ရဲ့ အစိတ်အပိုင်းကိုပဲ prefetch လုပ်ပါတယ်။
- **`true`**: Static ရော dynamic routes နှစ်မျိုးလုံးအတွက် route တစ်ခုလုံးကို prefetch လုပ်ပါတယ်။ [Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) ဖွင့်ထားရင် — prefetch ထဲမှာ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) နဲ့ link ရဲ့ URL data ပေါ် မူတည်တဲ့ cached content တွေ ပါဝင်ပါတယ်။ [Optimizing prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching) ကို ကြည့်ပါ။
- `false`: Viewport ထဲ ဝင်တဲ့အခါရော hover လုပ်တဲ့အခါမှာရော prefetching ဘယ်တော့မှ ဖြစ်မှာ မဟုတ်ပါဘူး။

> **Partial Prefetching ဖွင့်ထားရင်** ([`partialPrefetching: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching)): default က ပြောင်းသွားပါတယ်။ `auto` က page အပြည့်အစား — route တစ်ခုချင်းစီရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) (route ရဲ့ static နဲ့ cached content) ကို prefetch လုပ်ပါတယ်။ အပြုအမူ အပြောင်းအလဲ အပြည့်အစုံအတွက် [Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) ကို ကြည့်ပါ။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

### `onNavigate`

Client-side navigation အတွင်းမှာ ခေါ်ယူတဲ့ event handler တစ်ခုပါ။ Handler က `preventDefault()` method ပါတဲ့ event object တစ်ခုကို လက်ခံရရှိပြီး — လိုအပ်ရင် navigation ကို ပယ်ဖျက်ဖို့ (cancel) သုံးနိုင်ပါတယ်။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href="/dashboard"
      onNavigate={(e) => {
        // Only executes during SPA navigation
        console.log('Navigating...')

        // Optionally prevent navigation
        // e.preventDefault()
      }}
    >
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href="/dashboard"
      onNavigate={(e) => {
        // Only executes during SPA navigation
        console.log('Navigating...')

        // Optionally prevent navigation
        // e.preventDefault()
      }}
    >
      Dashboard
    </Link>
  )
}
```

> **သိထားသင့်သည်:** `onClick` နဲ့ `onNavigate` တွေက ဆင်တူပုံရပေမယ့် — ရည်ရွယ်ချက် မတူညီပါဘူး။ `onClick` က click event တိုင်းမှာ အလုပ်လုပ်ပြီး — `onNavigate` က client-side navigation အတွင်းမှာပဲ run လုပ်ပါတယ်။ အဓိက ကွာခြားချက်တချို့:
>
> - Modifier keys (`Ctrl`/`Cmd` + Click) သုံးတဲ့အခါ — `onClick` က အလုပ်လုပ်ပေမယ့် `onNavigate` က မလုပ်ပါဘူး — ဘာလို့လဲဆိုတော့ Next.js က tab အသစ်တွေအတွက် default navigation ကို တားဆီးထားလို့ပါ။
> - External URLs တွေက `onNavigate` ကို မဖြစ်ပေါ်စေပါဘူး — ဒါက client-side နဲ့ same-origin navigation တွေအတွက်ပဲ ဖြစ်လို့ပါ။
> - `download` attribute ပါတဲ့ links တွေက `onClick` နဲ့တော့ အလုပ်လုပ်ပြီး `onNavigate` နဲ့တော့ မလုပ်ပါဘူး — browser က ချိတ်ဆက်ထားတဲ့ URL ကို download အဖြစ် သဘောထားလို့ပါ။

### `transitionTypes`

Navigation မှာ သက်ရောက်စေမယ့် transition types စာရင်းတစ်ခုပါ။ ဒီ types တွေကို navigation transition အတွင်းမှာ [`React.addTransitionType`](https://react.dev/reference/react/addTransitionType) ဆီ ပို့ဆောင်ပေးပြီး — [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) components တွေက navigation ရဲ့ အမျိုးအစားပေါ် မူတည်ပြီး မတူညီတဲ့ animations တွေ သက်ရောက်နိုင်ပါတယ်။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" transitionTypes={['slide-in']}>
      About
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" transitionTypes={['slide-in']}>
      About
    </Link>
  )
}
```

## ဥပမာများ (Examples)

အောက်က ဥပမာတွေက `<Link>` component ကို အခြေအနေ အမျိုးမျိုးမှာ ဘယ်လို သုံးရမလဲ ပြသပါတယ်။

### Dynamic route segments တွေဆီ ချိတ်ဆက်ခြင်း

[dynamic segments](/docs/nextjs/dynamic-routes) တွေဆီ ချိတ်ဆက်တဲ့အခါ — [template literals နဲ့ interpolation](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals) တွေကို သုံးပြီး link စာရင်းတစ်ခု generate လုပ်နိုင်ပါတယ်။ ဥပမာ — blog posts စာရင်းတစ်ခု generate လုပ်ဖို့:

```tsx filename="app/blog/post-list.tsx" switcher
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
}

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/blog/post-list.js" switcher
import Link from 'next/link'

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### Active links တွေကို စစ်ဆေးခြင်း

Link တစ်ခု active ဟုတ်မဟုတ် သိရှိဖို့ [`usePathname()`](/docs/nextjs/use-pathname) ကို သုံးနိုင်ပါတယ်။ ဥပမာ — active link ဆီ class တစ်ခု ထည့်ဖို့ လက်ရှိ `pathname` က link ရဲ့ `href` နဲ့ တိုက်ဆိုင်မှု ရှိမရှိ စစ်ဆေးနိုင်ပါတယ်:

```tsx filename="app/ui/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

```jsx filename="app/ui/nav-links.js" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

### `id` တစ်ခုဆီ scroll လုပ်ခြင်း

Navigation လုပ်တဲ့အခါ တိကျတဲ့ `id` တစ်ခုဆီ scroll လုပ်ချင်ရင် — သင့် URL ရဲ့ နောက်မှာ `#` hash link တစ်ခု ထည့်နိုင်သလို (သို့) `href` prop ဆီ hash link တစ်ခုကို တိုက်ရိုက် ပေးနိုင်ပါတယ်။ `<Link>` က `<a>` element တစ်ခုအဖြစ် render လုပ်တာမို့ ဒါ ဖြစ်နိုင်ပါတယ်။

```jsx
<Link href="/dashboard#settings">Settings</Link>

// Output
<a href="/dashboard#settings">Settings</a>
```

> **သိထားသင့်သည်:**
>
> - Navigation လုပ်တဲ့အခါ [Page](/docs/nextjs/file-conventions-page) က viewport ထဲမှာ မမြင်ရဘူးဆိုရင် — Next.js က အဲဒီ Page ဆီ scroll လုပ်ပါလိမ့်မယ်။

### URL အသစ် push မလုပ်ဘဲ replace လုပ်ခြင်း

`Link` component ရဲ့ ပုံမှန် အပြုအမူက URL အသစ်တစ်ခုကို `history` stack ထဲ `push` လုပ်တာပါ။ Entry အသစ်တစ်ခု မထည့်ချင်ဘူးဆိုရင် — အောက်က ဥပမာလိုပဲ `replace` prop ကို သုံးနိုင်ပါတယ်:

```tsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" replace>
      About us
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/about" replace>
      About us
    </Link>
  )
}
```

### Page ထိပ်ဆုံးဆီ scroll လုပ်ခြင်းကို ပိတ်ခြင်း

Next.js ထဲက `<Link>` ရဲ့ ပုံမှန် scroll အပြုအမူက — browsers တွေ back နဲ့ forwards navigation တွေကို ကိုင်တွယ်သလိုပဲ — **scroll position ကို ထိန်းထားပေးတာ** ဖြစ်ပါတယ်။ [Page](/docs/nextjs/file-conventions-page) အသစ်တစ်ခုဆီ သွားတဲ့အခါ — Page က viewport ထဲမှာ မြင်နေရသရွေ့ scroll position က အတူတူ ရှိနေပါတယ်။

ဒါပေမယ့် Page က viewport ထဲမှာ မမြင်ရဘူးဆိုရင် — Next.js က ပထမဆုံး Page element ရဲ့ ထိပ်ဆုံးဆီ scroll လုပ်ပါတယ်။ ဒီအပြုအမူကို ပိတ်ချင်ရင် — `<Link>` component ဆီ `scroll={false}` (သို့) `router.push()` (သို့) `router.replace()` တွေဆီ `scroll: false` ပေးနိုင်ပါတယ်။

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/#hashid" scroll={false}>
      Disables scrolling to the top
    </Link>
  )
}
```

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/#hashid" scroll={false}>
      Disables scrolling to the top
    </Link>
  )
}
```

`router.push()` (သို့) `router.replace()` ကို သုံးတာမျိုး:

```jsx
// useRouter
import { useRouter } from 'next/navigation'

const router = useRouter()

router.push('/dashboard', { scroll: false })
```

### Sticky headers တွေနဲ့အတူ scroll offset

Next.js က scroll target ကို ရှာဖွေတဲ့အခါ sticky နဲ့ fixed positioned elements တွေကို ကျော်လိုက်လို့ — navigation ပြီးနောက် content က sticky header တစ်ခုရဲ့ နောက်မှာ ဝင်ပုန်းနေတာမျိုး ဖြစ်နိုင်ပါတယ်။ ဥပမာ — သင့် layout မှာ sticky header တစ်ခု ရှိနေရင်:

```tsx filename="app/layout.tsx" switcher
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 h-16 bg-white">
          {/* Navigation */}
        </header>
        {children}
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 h-16 bg-white">
          {/* Navigation */}
        </header>
        {children}
      </body>
    </html>
  )
}
```

သူ့ရဲ့ အမြင့်ကို scroll container ပေါ်မှာ [`scroll-padding-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top) သုံးပြီး ထည့်တွက်နိုင်ပါတယ်:

```css filename="app/globals.css"
html {
  scroll-padding-top: 64px; /* Match the height of your sticky header */
}
```

ဒါက scroll-based positioning တွေကို ရွှေ့ပြောင်းပေးတဲ့ browser CSS property တစ်ခုပါ။ Next.js က native [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) API ကို သုံးတဲ့အခါတိုင်း — hash fragment (`#id`) navigation အပါအဝင် — ဒါ သက်ရောက်ပါတယ်။ တစ်နည်းအနေနဲ့ — global offset တစ်ခု သတ်မှတ်မယ့်အစား target element တစ်ခုချင်းစီပေါ်မှာ [`scroll-margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) ကိုလည်း သုံးနိုင်ပါတယ်။

### Proxy ထဲက links တွေကို prefetching လုပ်ခြင်း

Authentication (သို့) user တစ်ယောက်ကို စာမျက်နှာတစ်ခုကနေ နောက်တစ်ခုဆီ ပြန်လမ်းကြောင်းပြောင်းတာ (rewriting) ပါဝင်တဲ့ အခြား ရည်ရွယ်ချက်တွေအတွက် [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) ကို သုံးတာ အသုံးများပါတယ်။ `<Link />` component က Proxy ကနေ rewrites ပါတဲ့ links တွေကို မှန်ကန်စွာ prefetch လုပ်နိုင်ဖို့ — ပြသရမယ့် URL ရော prefetch လုပ်ရမယ့် URL ပါ နှစ်ခုလုံးကို Next.js ကို ပြောပြဖို့ လိုအပ်ပါတယ်။ ဘယ် route ကို prefetch လုပ်ရမလဲ သိရှိဖို့ proxy ဆီ fetches တွေ မလိုအပ်ဘဲ ဖြစ်အောင် ဒါ လိုအပ်ပါတယ်။

ဥပမာ — authenticated နဲ့ visitor views နှစ်မျိုးလုံး ရှိတဲ့ `/dashboard` route တစ်ခုကို serve လုပ်ချင်ရင် — user ကို မှန်ကန်တဲ့ page ဆီ ပြောင်းပေးဖို့ သင့် Proxy ထဲမှာ အောက်ပါအတိုင်း ထည့်နိုင်ပါတယ်:

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  const nextUrl = request.nextUrl
  if (nextUrl.pathname === '/dashboard') {
    if (request.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', request.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', request.url))
    }
  }
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  const nextUrl = request.nextUrl
  if (nextUrl.pathname === '/dashboard') {
    if (request.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', request.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', request.url))
    }
  }
}
```

ဒီကိစ္စမှာ — သင့် `<Link />` component ထဲမှာ အောက်ပါ code ကို သုံးချင်ပါလိမ့်မယ်:

```tsx filename="app/page.tsx" switcher
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // Your auth hook

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

```js filename="app/page.js" switcher
'use client'

import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed' // Your auth hook

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

### Navigation ပိတ်ဆို့ခြင်း

`onNavigate` prop ကို သုံးပြီး — form ထဲမှာ သိမ်းမထားရသေးတဲ့ (unsaved) အပြောင်းအလဲတွေ ရှိနေတာလိုမျိုး အခြေအနေတွေမှာ navigation ကို ပိတ်ဆို့နိုင်ပါတယ်။ သင့် app ထဲက components အများအပြားကို လွှမ်းခြုံပြီး navigation ပိတ်ဆို့ဖို့ လိုအပ်တဲ့အခါ (form တစ်ခုကို တည်းဖြတ်နေချိန်မှာ ဘယ် link ကနေပဲ ဖြစ်ဖြစ် navigation မဖြစ်အောင် တားဆီးချင်တာမျိုး) — React Context က ဒီ blocking state ကို share လုပ်ဖို့ သန့်ရှင်းတဲ့ နည်းလမ်းတစ်ခု ပေးစွမ်းပါတယ်။ ပထမဆုံး — navigation blocking state ကို ခြေရာခံဖို့ context တစ်ခု ဖန်တီးပါ:

```tsx filename="app/contexts/navigation-blocker.tsx" switcher
'use client'

import { createContext, useState, useContext } from 'react'

interface NavigationBlockerContextType {
  isBlocked: boolean
  setIsBlocked: (isBlocked: boolean) => void
}

export const NavigationBlockerContext =
  createContext<NavigationBlockerContextType>({
    isBlocked: false,
    setIsBlocked: () => {},
  })

export function NavigationBlockerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isBlocked, setIsBlocked] = useState(false)

  return (
    <NavigationBlockerContext.Provider value={{ isBlocked, setIsBlocked }}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
```

```jsx filename="app/contexts/navigation-blocker.js" switcher
'use client'

import { createContext, useState, useContext } from 'react'

export const NavigationBlockerContext = createContext({
  isBlocked: false,
  setIsBlocked: () => {},
})

export function NavigationBlockerProvider({ children }) {
  const [isBlocked, setIsBlocked] = useState(false)

  return (
    <NavigationBlockerContext.Provider value={{ isBlocked, setIsBlocked }}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
```

Context ကို သုံးတဲ့ form component တစ်ခု ဖန်တီးပါ:

```tsx filename="app/components/form.tsx" switcher
'use client'

import { useNavigationBlocker } from '../contexts/navigation-blocker'

export default function Form() {
  const { setIsBlocked } = useNavigationBlocker()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setIsBlocked(false)
      }}
      onChange={() => setIsBlocked(true)}
    >
      <input type="text" name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

```jsx filename="app/components/form.js" switcher
'use client'

import { useNavigationBlocker } from '../contexts/navigation-blocker'

export default function Form() {
  const { setIsBlocked } = useNavigationBlocker()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setIsBlocked(false)
      }}
      onChange={() => setIsBlocked(true)}
    >
      <input type="text" name="name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

Navigation ကို ပိတ်ဆို့တဲ့ custom Link component တစ်ခု ဖန်တီးပါ:

```tsx filename="app/components/custom-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useNavigationBlocker } from '../contexts/navigation-blocker'

interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode
}

export function CustomLink({ children, ...props }: CustomLinkProps) {
  const { isBlocked } = useNavigationBlocker()

  return (
    <Link
      onNavigate={(e) => {
        if (
          isBlocked &&
          !window.confirm('You have unsaved changes. Leave anyway?')
        ) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/components/custom-link.js" switcher
'use client'

import Link from 'next/link'
import { useNavigationBlocker } from '../contexts/navigation-blocker'

export function CustomLink({ children, ...props }) {
  const { isBlocked } = useNavigationBlocker()

  return (
    <Link
      onNavigate={(e) => {
        if (
          isBlocked &&
          !window.confirm('You have unsaved changes. Leave anyway?')
        ) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
```

Navigation component တစ်ခု ဖန်တီးပါ:

```tsx filename="app/components/nav.tsx" switcher
'use client'

import { CustomLink as Link } from './custom-link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

```jsx filename="app/components/nav.js" switcher
'use client'

import { CustomLink as Link } from './custom-link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

နောက်ဆုံးအနေနဲ့ — root layout ထဲမှာ သင့် app ကို `NavigationBlockerProvider` နဲ့ wrap လုပ်ပြီး သင့် page ထဲမှာ components တွေကို သုံးပါ:

```tsx filename="app/layout.tsx" switcher
import { NavigationBlockerProvider } from './contexts/navigation-blocker'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationBlockerProvider>{children}</NavigationBlockerProvider>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { NavigationBlockerProvider } from './contexts/navigation-blocker'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationBlockerProvider>{children}</NavigationBlockerProvider>
      </body>
    </html>
  )
}
```

ပြီးရင် — သင့် page ထဲမှာ `Nav` နဲ့ `Form` components တွေကို သုံးပါ:

```tsx filename="app/page.tsx" switcher
import Nav from './components/nav'
import Form from './components/form'

export default function Page() {
  return (
    <div>
      <Nav />
      <main>
        <h1>Welcome to the Dashboard</h1>
        <Form />
      </main>
    </div>
  )
}
```

```jsx filename="app/page.js" switcher
import Nav from './components/nav'
import Form from './components/form'

export default function Page() {
  return (
    <div>
      <Nav />
      <main>
        <h1>Welcome to the Dashboard</h1>
        <Form />
      </main>
    </div>
  )
}
```

Form ထဲမှာ သိမ်းမထားရသေးတဲ့ အပြောင်းအလဲတွေ ရှိနေတုန်း user က `CustomLink` ကို သုံးပြီး ထွက်သွားဖို့ ကြိုးစားရင် — မထွက်ခွာမီ အတည်ပြုဖို့ prompt လုပ်ပေးပါလိမ့်မယ်။

## Version History

| Version   | အပြောင်းအလဲ                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v16.2.0` | `transitionTypes` prop ထည့်သွင်း။                                                                                                               |
| `v15.4.0` | Default `prefetch` အပြုအမူအတွက် `auto` ကို alias အဖြစ် ထည့်သွင်း။                                                                           |
| `v15.3.0` | `onNavigate` API ထည့်သွင်း။                                                                                                                     |
| `v13.0.0` | Child `<a>` tag တစ်ခု မလိုအပ်တော့ပါဘူး။ Codebase ကို အလိုအလျောက် update လုပ်ဖို့ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#remove-a-tags-from-link-components) ပံ့ပိုးပေးထားပါတယ်။ |
| `v10.0.0` | Dynamic route တစ်ခုကို ညွှန်တဲ့ `href` props တွေကို အလိုအလျောက် ဖြေရှင်းပေးပြီး — `as` prop မလိုအပ်တော့ပါဘူး။                               |
| `v8.0.0`  | Prefetching performance ပိုမိုကောင်းမွန်အောင် ပြုပြင်ခဲ့။                                                                                      |
| `v1.0.0`  | `next/link` စတင် မိတ်ဆက်။                                                                                                                      |
