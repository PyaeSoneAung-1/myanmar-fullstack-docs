---
title: "useRouter hook (route တွေကို programmatically ပြောင်းလဲခြင်း)"
description: "useRouter() — Client Components တွေမှာ navigation ကို programmatic အနေနဲ့ လုပ်ဆောင်ပေးတဲ့ hook; push, replace, refresh, prefetch, back, forward methods နဲ့ bfcacheId အကြောင်း"
order: 40
source: "https://nextjs.org/docs/app/api-reference/functions/use-router"
status: translated
updated: 2026-09-02
---

`useRouter` hook က [Client Components](/docs/nextjs/server-client-components) တွေထဲကနေ route တွေကို programmatically (ကုဒ်နဲ့ ထိန်းချုပ်) ပြောင်းလဲနိုင်စေပါတယ်။

> **အကြံပြုချက်:** `useRouter` ကို သုံးဖို့ တိကျတဲ့ လိုအပ်ချက်တစ်ခု ရှိမှသာ သုံးပါ — ယေဘုယျအားဖြင့် navigation အတွက် [`<Link>` component](https://nextjs.org/docs/app/api-reference/components/link) ကို ဦးစားပေး သုံးသင့်ပါတယ်။

```tsx
// app/example-client-component.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

## `useRouter()` methods များ

- `router.push(href: string, { scroll: boolean, transitionTypes: string[] })`: ပေးထားတဲ့ route ဆီ client-side navigation တစ်ခု လုပ်ဆောင်ပါတယ်။ [Browser ရဲ့ history stack](https://developer.mozilla.org/docs/Web/API/History_API) ထဲကို entry အသစ်တစ်ခု ထည့်ပေးပါတယ်။ Optional `transitionTypes` တွေကို navigation Transition အတွင်းမှာ [`React.addTransitionType`](https://react.dev/reference/react/addTransitionType) ဆီ ပို့ပေးပါတယ်။
- `router.replace(href: string, { scroll: boolean, transitionTypes: string[] })`: ပေးထားတဲ့ route ဆီ client-side navigation လုပ်ပေမယ့် — browser ရဲ့ history stack ထဲကို entry အသစ် **မထည့်ပါဘူး**။ Optional `transitionTypes` တွေကို navigation Transition အတွင်းမှာ `React.addTransitionType` ဆီ ပို့ပေးပါတယ်။
- `router.refresh()`: လက်ရှိ route ကို refresh လုပ်ပါတယ် — server ဆီ request အသစ်တစ်ခု ပို့ပြီး data requests တွေကို ပြန် fetch လုပ်ကာ Server Components တွေကို ပြန် render လုပ်ပါတယ်။ Client ဘက်က မထိခိုက်တဲ့ client-side React state (ဥပမာ `useState`) နဲ့ browser state (ဥပမာ scroll position) တွေကို မဆုံးရှုံးဘဲ — updated React Server Component payload ကို ပေါင်းစပ်လိုက်ပါတယ်။ ဒါက လက်ရှိ route အတွက် [Client Cache](https://nextjs.org/docs/app/glossary#client-cache) ကို ရှင်းလင်းပေမယ့် — server-side cache ကိုတော့ **invalidate မလုပ်ပါဘူး**။ Server-side cached data တွေကို invalidate လုပ်ဖို့ [`revalidatePath`](/docs/nextjs/revalidate-path) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို သုံးပါ။
- `router.prefetch(href: string, options?: { onInvalidate?: () => void })`: ပေးထားတဲ့ route ကို [prefetch](/docs/nextjs/linking) (ကြိုတင် ယူထားခြင်း) လုပ်ပြီး client-side transitions တွေ မြန်ဆန်စေပါတယ်။ Optional `onInvalidate` callback က [prefetched data stale ဖြစ်သွားတဲ့အခါ](https://nextjs.org/docs/app/guides/prefetching#extending-or-ejecting-link) ခေါ်ပေးပါတယ်။
- `router.back()`: Browser ရဲ့ history stack ထဲက ယခင် route ဆီ ပြန်သွားပါတယ်။
- `router.forward()`: Browser ရဲ့ history stack ထဲက နောက် page ဆီ ရှေ့သို့ သွားပါတယ်။
- `router.bfcacheId`: လက်ရှိ route segment နဲ့ သက်ဆိုင်တဲ့ opaque string identifier တစ်ခုပါ။ ပတ်ဝန်းကျင် segment ကို push (သို့) replace navigation နဲ့ အသစ် ဖန်တီးလိုက်တိုင်း ပြောင်းလဲပြီး — back/forward navigations, `router.refresh()` နဲ့ search-param- (သို့) hash-only navigations တွေမှာတော့ တူညီနေပါတယ်။ အသေးစိတ်အတွက် အောက်က [`bfcacheId`](#bfcacheid) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:**
>
> - `router.push` (သို့) `router.replace` ဆီ untrusted (မယုံကြည်ရတဲ့) (သို့) sanitize မလုပ်ထားတဲ့ URLs တွေကို ပို့လို့ မရပါဘူး — ဒါက သင့် site ကို cross-site scripting (XSS) တိုက်ခိုက်မှုတွေဆီ ဖွင့်ပေးလိုက်သလို ဖြစ်နိုင်လို့ပါ။ ဥပမာ — `javascript:` URLs တွေကို `router.push` (သို့) `router.replace` ဆီ ပို့လိုက်ရင် သင့် page ရဲ့ context အတွင်းမှာ execute ဖြစ်သွားပါလိမ့်မယ်။
> - `<Link>` component က routes တွေ viewport ထဲ မြင်ရတာနဲ့ အလိုအလျောက် prefetch လုပ်ပေးပါတယ်။
> - Fetch requests တွေ cache လုပ်ထားရင် `refresh()` က တူညီတဲ့ ရလဒ်ကိုပဲ ပြန်ထုတ်ပေးနိုင်ပါတယ်။ `cookies` နဲ့ `headers` လို အခြား Request-time APIs တွေကလည်း response ကို ပြောင်းလဲစေနိုင်ပါတယ်။
> - `onInvalidate` callback က prefetch request တစ်ခုအတွက် အများဆုံး တစ်ကြိမ်ပဲ ခေါ်ပေးပါတယ်။ Route data အသစ်အတွက် prefetch အသစ်တစ်ခု စတင်သင့်ကြောင်း သင်သိစေဖို့ အချက်ပြပေးတာပါ။

### `next/router` ကနေ ပြောင်းရွှေ့ခြင်း (Migrating from `next/router`)

- App Router သုံးတဲ့အခါ `useRouter` hook ကို `next/router` ကနေ မဟုတ်ဘဲ **`next/navigation`** ကနေ import လုပ်ရပါတယ်။
- `pathname` string ကို ဖယ်ရှားပြီး — [`usePathname()`](/docs/nextjs/use-pathname) နဲ့ အစားထိုးပါတယ်။
- `query` object ကို ဖယ်ရှားပြီး — [`useSearchParams()`](/docs/nextjs/use-search-params) နဲ့ အစားထိုးပါတယ်။
- `router.events` ကို အစားထိုးလိုက်ပါပြီ။ အောက်မှာ ကြည့်ပါ။

[ပြောင်းရွှေ့မှု guide အပြည့်အစုံ](https://nextjs.org/docs/app/guides/migrating/app-router-migration) ကို ကြည့်ပါ။

## ဥပမာများ

### Router events (navigation ပြောင်းလဲမှုတွေကို နားထောင်ခြင်း)

`usePathname` နဲ့ `useSearchParams` လို အခြား Client Component hooks တွေကို ပေါင်းစပ်ပြီး page ပြောင်းလဲမှုတွေကို နားထောင်နိုင်ပါတယ်:

```jsx
// app/components/navigation-events.js
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(url)
    // လက်ရှိ URL ကို အခု သုံးလို့ရပါပြီ
    // ...
  }, [pathname, searchParams])

  return '...'
}
```

ဒီ component ကို layout တစ်ခုထဲမှာ import လုပ်သုံးနိုင်ပါတယ်:

```jsx
// app/layout.js
import { Suspense } from 'react'
import { NavigationEvents } from './components/navigation-events'

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  )
}
```

> **သိထားသင့်သည်:** [`useSearchParams()`](/docs/nextjs/use-search-params) က [prerendering](https://nextjs.org/docs/app/glossary#prerendering) ကာလအတွင်းမှာ အနီးဆုံး `Suspense` boundary အထိ client-side rendering ဖြစ်စေလို့ — `<NavigationEvents>` ကို [Suspense boundary](/docs/nextjs/file-conventions-loading) တစ်ခုထဲမှာ wrap လုပ်ထားပါတယ်။ [အသေးစိတ် လေ့လာရန်](/docs/nextjs/use-search-params)။

### Scroll to top ပိတ်ခြင်း

Default အနေနဲ့ — Next.js က route အသစ်တစ်ခုဆီ navigate လုပ်တဲ့အခါ page ရဲ့ ထိပ်ဆုံးကို scroll လုပ်ပေးပါတယ်။ `router.push()` (သို့) `router.replace()` ကို ခေါ်တဲ့အခါ `scroll: false` ပို့ပြီး ဒီအပြုအမူကို ပိတ်နိုင်ပါတယ်:

```tsx
// app/example-client-component.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}
```

### `bfcacheId`

`router.bfcacheId` က လက်ရှိ route segment နဲ့ သက်ဆိုင်တဲ့ opaque string identifier တစ်ခုပါ။ Push (သို့) replace navigation က segment အသစ်တစ်ခုကို ဖန်တီးလိုက်တိုင်း ဒါက ပြောင်းလဲပြီး — back/forward navigations, `router.refresh()` နဲ့ search-param- (သို့) hash-only navigations တွေမှာတော့ အတူတူပဲ ရှိနေပါတယ်။

အကြံပြုလိုတဲ့ သုံးနည်းကတော့ — navigation အသစ်တစ်ခုမှာ state ထိန်းသိမ်းမှုကို ဖယ်ထုတ်ဖို့ React `key` အနေနဲ့ ပို့ပြီး — back/forward navigation ကာလအတွင်းမှာတော့ state ကို ပြန်လည် ထိန်းသိမ်းပေးတာပါ:

```tsx
// app/example/page.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const { bfcacheId } = useRouter()
  return <form key={bfcacheId}>{/* ... */}</form>
}
```

`cacheComponents` enable လုပ်ထားတဲ့အခါ — App Router က React `<Activity>` ကို သုံးပြီး navigations တွေကြားမှာ Client Component state တွေကို ထိန်းသိမ်းပေးပါတယ်။ Component တစ်ခုကို `bfcacheId` ပေါ် key လုပ်ထားရင် — navigation အသစ်တိုင်းမှာ ပြန်စက်ပြီး browser back/forward navigations တွေမှာတော့ state ကို ဆက်ထိန်းပေးပါတယ်။ Pattern အလိုက် အကြံပြုထားတဲ့ resets တွေအတွက် [Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:**
>
> `bfcacheId` သုံးမယ့်အစား — state ကို event handler (ဥပမာ `onSubmit`) အတွင်းမှာ တိုက်ရိုက် reset လုပ်တာ (သို့) ကိုယ့် data ကနေ key တစ်ခု ဆင်းသက်ယူတာ (ဥပမာ server ကလာတဲ့ draft id) ကို ဦးစားပေးပါ။ `bfcacheId` ကို codebase အဟောင်းတစ်ခုကို ပြောင်းရွှေ့တာလိုမျိုး — နောက်ဆုံး ရွေးချယ်စရာအဖြစ်ပဲ သုံးပါ။

## Version History

| Version   | အပြောင်းအလဲ                                                            |
| --------- | -------------------------------------------------------------------- |
| `v15.4.0` | `router.prefetch` အတွက် optional `onInvalidate` callback ထည့်သွင်း |
| `v13.0.0` | `next/navigation` ကနေ `useRouter` စတင် မိတ်ဆက်                      |
