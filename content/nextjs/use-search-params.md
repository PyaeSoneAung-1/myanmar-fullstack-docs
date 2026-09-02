---
title: "useSearchParams hook (လက်ရှိ URL ရဲ့ query string ဖတ်ခြင်း)"
description: "useSearchParams() — Client Components တွေမှာ လက်ရှိ URL ရဲ့ query string ဖတ်ပေးတဲ့ read-only hook; Suspense boundary လိုအပ်ချက်၊ prerendering/dynamic rendering အပြုအမူနဲ့ searchParams prop နဲ့ နှိုင်းယှဉ်ချက်"
order: 42
source: "https://nextjs.org/docs/app/api-reference/functions/use-search-params"
status: translated
updated: 2026-09-02
---

`useSearchParams` က **Client Component** hook တစ်ခုဖြစ်ပြီး — လက်ရှိ URL ရဲ့ **query string** ကို ဖတ်နိုင်စေပါတယ်။

`useSearchParams` က [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface ရဲ့ **read-only (ဖတ်ရုံသာ)** version တစ်ခုကို ပြန်ပေးပါတယ်။

```tsx
// app/dashboard/search-bar.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {search}</>
}
```

## Parameters

```tsx
const searchParams = useSearchParams()
```

`useSearchParams` က parameters ဘာမှ လက်ခံမပါဘူး။

## Returns

`useSearchParams` က [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface ရဲ့ **read-only** version တစ်ခုကို ပြန်ပေးပြီး — URL ရဲ့ query string ဖတ်ဖို့ utility methods တွေ ပါဝင်ပါတယ်:

- [`URLSearchParams.get()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get): Search parameter နဲ့ ဆက်စပ်နေတဲ့ ပထမဆုံး value ကို ပြန်ပေးပါတယ်။ ဥပမာ:

  | URL                  | `searchParams.get("a")`                                                                                     |
  | -------------------- | ------------------------------------------------------------------------------------------------------------ |
  | `/dashboard?a=1`     | `'1'`                                                                                                        |
  | `/dashboard?a=`      | `''`                                                                                                         |
  | `/dashboard?b=3`     | `null`                                                                                                       |
  | `/dashboard?a=1&a=2` | `'1'` _— value အားလုံး ရဖို့ [`getAll()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll) သုံးပါ_ |

- [`URLSearchParams.has()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has): Parameter ပေးထားတာ တည်ရှိမရှိ ဖော်ပြတဲ့ boolean တစ်ခု ပြန်ပေးပါတယ်။ ဥပမာ:

  | URL              | `searchParams.has("a")` |
  | ---------------- | ----------------------- |
  | `/dashboard?a=1` | `true`                  |
  | `/dashboard?b=3` | `false`                 |

- [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) ရဲ့ အခြား **read-only** methods တွေအကြောင်း ပိုလေ့လာပါ — [`getAll()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll), [`keys()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/keys), [`values()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/values), [`entries()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/entries), [`forEach()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/forEach), [`toString()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/toString) တို့ ပါဝင်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - `useSearchParams` က [Client Component](/docs/nextjs/server-client-components) hook တစ်ခုဖြစ်ပြီး — [partial rendering](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions) (တစ်စိတ်တစ်ပိုင်း ပြန်ဆိုခြင်း) ကာလအတွင်းမှာ stale values တွေ မဖြစ်အောင် [Server Components](/docs/nextjs/server-client-components) တွေမှာ **မထောက်ပံ့ပါဘူး**။
> - Server Component တစ်ခုထဲမှာ search params တွေအပေါ် မူတည်ပြီး data fetch လုပ်ချင်ရင် — သက်ဆိုင်ရာ [Page](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) ရဲ့ [`searchParams` prop](/docs/nextjs/file-conventions-page) ကို ဖတ်တာက ပိုကောင်းတဲ့ ရွေးချယ်မှုပါ။ အဲဒီနောက် အဲဒီ Page အတွင်းက ဘယ် component (Server ရော Client ပါ) ကိုမဆို props ကတစ်ဆင့် ပို့နိုင်ပါတယ်။
> - App တစ်ခုမှာ `/pages` directory ပါဝင်နေရင် — `useSearchParams` က `ReadonlyURLSearchParams | null` ပြန်ပေးပါတယ်။ `null` တန်ဖိုးက migration ကာလအတွင်း လိုက်ဖက်မှုအတွက်ပါ — `getServerSideProps` မသုံးတဲ့ page တစ်ခုရဲ့ prerendering ကာလအတွင်းမှာ search params တွေကို မသိနိုင်လို့ပါ။

## အပြုအမူ (Behavior)

### Prerendering

Route တစ်ခုကို [prerendered](https://nextjs.org/docs/app/glossary#prerendering) လုပ်နေရင် — `useSearchParams` ကို ခေါ်လိုက်တာက အနီးဆုံး [`Suspense` boundary](https://react.dev/reference/react/Suspense) အထိရှိတဲ့ Client Component tree ကို client-side rendering ဖြစ်စေပါတယ်။

ဒါက route ရဲ့ အစိတ်အပိုင်းတစ်ခုကို prerender လုပ်ထားနိုင်ပြီး — `useSearchParams` သုံးထားတဲ့ dynamic အပိုင်းကတော့ client-side မှာ render ဖြစ်နေစေပါတယ်။

`useSearchParams` သုံးထားတဲ့ Client Component ကို `<Suspense/>` boundary တစ်ခုထဲမှာ wrap လုပ်ဖို့ အကြံပြုပါတယ်။ ဒါဆိုရင် အဲဒီအပေါ်က Client Components တွေကို prerender လုပ်ပြီး — ကနဦး HTML ရဲ့ တစ်စိတ်တစ်ပိုင်းအဖြစ် ပို့ပေးနိုင်ပါတယ်။ ဖြေရှင်းနည်း options အပြည့်အစုံအတွက် — [Next.js encountered URL data in a Client Component outside of Suspense](https://nextjs.org/docs/messages/blocking-prerender-client-hook) ကို ကြည့်ပါ။

ဥပမာ:

```tsx
// app/dashboard/search-bar.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // ဒါက prerendering ကာလအတွင်းမှာ server ပေါ်မှာ log ဖြစ်မှာ မဟုတ်ပါဘူး
  console.log(search)

  return <>Search: {search}</>
}
```

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import SearchBar from './search-bar'

// Suspense boundary ရဲ့ fallback အဖြစ် ပို့လိုက်တဲ့ ဒီ component က
// ကနဦး HTML ထဲမှာ search bar နေရာမှာ render လုပ်ခံရပါမယ်။
// React hydration ကာလအတွင်းမှာ value ရနိုင်တဲ့အခါ fallback ကို
// `<SearchBar>` component နဲ့ အစားထိုးလိုက်ပါတယ်။
function SearchBarFallback() {
  return <>placeholder</>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

> **သိထားသင့်သည်:**
>
> - Development မှာ routes တွေက on-demand ဖြစ်ပြီး render လုပ်လို့ — `useSearchParams` က suspend မလုပ်ဘဲ `Suspense` မပါဘဲ အလုပ်လုပ်နေပုံ ရပါတယ်။
> - Production builds တွေမှာ — Client Component တစ်ခုကနေ `useSearchParams` ခေါ်တဲ့ static page တစ်ခုကို `Suspense` boundary အတွင်းမှာ wrap လုပ်ရပါမယ်။ မလုပ်ရင် build က [Missing Suspense boundary with useSearchParams](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) error နဲ့ ကျရှုံးပါတယ်။
> - Route ကို dynamically render လုပ်စေချင်တယ်ဆိုရင် — Server Component တစ်ခုထဲမှာ [`connection`](https://nextjs.org/docs/app/api-reference/functions/connection) function ကို အရင်ခေါ်ပြီး incoming request တစ်ခုကို စောင့်ပါ — ဒါက အောက်က အရာအားလုံးကို prerendering ကနေ ဖယ်ထုတ်ပေးပါတယ်။ Route တစ်ခုကို ဘာတွေက dynamic ဖြစ်စေလဲဆိုတာ [Dynamic Rendering guide](https://nextjs.org/docs/app/glossary#dynamic-rendering) မှာ ကြည့်ပါ။
> - Server Component Page တစ်ခုထဲမှာ ရှိနေပြီးသားဆိုရင် — [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) ကို သုံးပြီး Client Components တွေဆီ တန်ဖိုးတွေ ပို့ဖို့ စဉ်းစားပါ။
> - Page ရဲ့ [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) ကို Client Component တစ်ခုဆီ တိုက်ရိုက် ပို့ပြီး React ရဲ့ `use()` နဲ့ ဖြေဖို့လည်း ရပါတယ်။ ဒါပေမယ့် ဒါက suspend လုပ်လို့ — Client Component ကို `Suspense` boundary နဲ့ wrap လုပ်ထားသင့်ပါတယ်။

### Dynamic Rendering

Route တစ်ခုကို dynamically render လုပ်နေရင် — Client Component ရဲ့ ကနဦး server render ကာလအတွင်းမှာ `useSearchParams` က server ပေါ်မှာ ရနိုင်ပါတယ်။

ဥပမာ:

```tsx
// app/dashboard/search-bar.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // ဒါက ကနဦး render မှာ server ပေါ်မှာ log ဖြစ်ပြီး
  // နောက်ဆက်တွဲ navigations တွေမှာတော့ client ပေါ်မှာ log ဖြစ်ပါတယ်။
  console.log(search)

  return <>Search: {search}</>
}
```

```tsx
// app/dashboard/page.tsx
import { connection } from 'next/server'
import SearchBar from './search-bar'

export default async function Page() {
  await connection()
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

> **သိထားသင့်သည်:**
>
> - အရင်တုန်းက page ပေါ်မှာ `export const dynamic = 'force-dynamic'` သတ်မှတ်ပြီး dynamic rendering ကို အတင်းလုပ်ခဲ့ရပါတယ်။ အခုတော့ [`connection()`](https://nextjs.org/docs/app/api-reference/functions/connection) ကို သုံးတာ ပိုကောင်းပါတယ် — ဘာလို့ဆို dynamic rendering ကို incoming request နဲ့ အဓိပ္ပာယ်အရ ချိတ်ဆက်ပေးလို့ပါ။

### Server Components

#### Pages

[Pages](/docs/nextjs/file-conventions-page) (Server Components) တွေထဲမှာ search params တွေကို ဝင်ရောက်ဖို့ — [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop ကို သုံးပါ။

#### Layouts

[Layouts](/docs/nextjs/file-conventions-layout) (Server Components) တွေက Pages တွေနဲ့ မတူဘဲ — `searchParams` prop ကို **လက်ခံရရှိမှာ မဟုတ်ပါဘူး**။ ဘာလို့ဆို shared layout တစ်ခုက [navigation ကာလအတွင်း ပြန် re-render မလုပ်လို့](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions) — navigations တွေကြားမှာ `searchParams` stale ဖြစ်သွားနိုင်လို့ပါ။ ဒီအစား — Page ရဲ့ [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page) prop (သို့) Client Component တစ်ခုထဲမှာ [`useSearchParams`](/docs/nextjs/use-search-params) hook ကို သုံးပါ — Client Components တွေက client ပေါ်မှာ နောက်ဆုံး `searchParams` တွေနဲ့ ပြန် re-render ဖြစ်လို့ပါ။

## ဥပမာများ

### `searchParams` update လုပ်ခြင်း

`searchParams` အသစ်တွေ သတ်မှတ်ဖို့ — [`useRouter`](/docs/nextjs/use-router) (သို့) [`Link`](https://nextjs.org/docs/app/api-reference/components/link) ကို သုံးနိုင်ပါတယ်။ Navigation တစ်ခု လုပ်ဆောင်ပြီးတဲ့အခါ — လက်ရှိ [`page.js`](https://nextjs.org/docs/app/api-reference/file-conventions/page) က updated [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) တစ်ခု လက်ခံရရှိပါတယ်။

```tsx
// app/example-client-component.tsx
'use client'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // လက်ရှိ searchParams ကို ပေးထားတဲ့ key/value pair တစ်ခုနဲ့ ပေါင်းပြီး
  // searchParams string အသစ်တစ်ခု ရယူပါ
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <p>Sort By</p>

      {/* useRouter သုံးခြင်း */}
      <button
        onClick={() => {
          // <pathname>?sort=asc
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>

      {/* <Link> သုံးခြင်း */}
      <Link
        href={
          // <pathname>?sort=desc
          pathname + '?' + createQueryString('sort', 'desc')
        }
      >
        DESC
      </Link>
    </>
  )
}
```

## Version History

| Version   | အပြောင်းအလဲ                  |
| --------- | --------------------------- |
| `v13.0.0` | `useSearchParams` စတင် မိတ်ဆက် |
