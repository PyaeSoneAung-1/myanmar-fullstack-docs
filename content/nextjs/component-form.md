---
title: "form"
description: "<Form> component (next/form) — form submission နဲ့ search params update တွေကို client-side navigation နဲ့ ကိုင်တွယ်ခြင်း; action (string/function) props များနှင့် ဥပမာများ"
order: 72
source: "https://nextjs.org/docs/app/api-reference/components/form"
status: translated
updated: 2026-09-02
---

`<Form>` component က HTML ရဲ့ `<form>` element ကို ချဲ့ထွင်ထားတဲ့ component တစ်ခုဖြစ်ပြီး — [loading UI](/docs/nextjs/file-conventions-loading) ရဲ့ [**prefetching**](/docs/nextjs/linking#prefetching)၊ submission မှာ **client-side navigation** နဲ့ **progressive enhancement** (တိုးတက်မြှင့်တင်မှု) တွေကို ပံ့ပိုးပေးပါတယ်။

URL ရဲ့ search params တွေကို update လုပ်တဲ့ forms တွေအတွက် အသုံးဝင်ပါတယ် — အထက်ပါ ရည်ရွယ်ချက်တွေ အောင်မြင်ဖို့ လိုအပ်တဲ့ boilerplate code (ထပ်ခါထပ်ခါ ရေးနေရတဲ့ code) တွေကို လျှော့ချပေးလို့ပါ။

အခြေခံ အသုံးပြုပုံ:

```tsx filename="/app/ui/search.tsx" switcher
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

```jsx filename="/app/ui/search.js" switcher
import Form from 'next/form'

export default function Search() {
  return (
    <Form action="/search">
      {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

## Reference

`<Form>` component ရဲ့ အပြုအမူက — `action` prop ကို `string` အဖြစ် ပေးလား `function` အဖြစ် ပေးလားပေါ် မူတည်ပါတယ်။

- `action` က **string** ဖြစ်နေရင် — `<Form>` က **`GET`** method သုံးတဲ့ native HTML form တစ်ခုလို ပြုမူပါတယ်။ Form data ကို URL ထဲမှာ search params အဖြစ် encode လုပ်ပြီး — form ကို submit လုပ်တဲ့အခါ သတ်မှတ်ထားတဲ့ URL ဆီ navigate လုပ်ပါတယ်။ အပြင်၊ Next.js က:
  - Form က မြင်သာလာတဲ့အခါ path ကို [Prefetch](/docs/nextjs/linking#prefetching) လုပ်ပြီး — ဒါက shared UI (ဥပမာ `layout.js` နဲ့ `loading.js`) တွေကို ကြိုတင် load လုပ်ပေးလို့ — navigation ပိုမို မြန်ဆန်စေပါတယ်။
  - Form ကို submit လုပ်တဲ့အခါ page တစ်ခုလုံး reload လုပ်မယ့်အစား — [client-side navigation](/docs/nextjs/linking) ကို လုပ်ဆောင်ပေးပါတယ်။ ဒါက shared UI နဲ့ client-side state တွေကို ထိန်းထားပေးပါတယ်။
- `action` က **function** (Server Action) ဖြစ်နေရင် — `<Form>` က [React form](https://react.dev/reference/react-dom/components/form) တစ်ခုလို ပြုမူပြီး — form ကို submit လုပ်တဲ့အခါ အဲဒီ action ကို execute လုပ်ပါတယ်။

### `action` (string) Props

`action` က string ဖြစ်နေရင် — `<Form>` component က အောက်ပါ props တွေကို ထောက်ပံ့ပါတယ်:

| Prop       | Example            | Type                            | Required |
| ---------- | ------------------ | ------------------------------- | -------- |
| `action`   | `action="/search"` | `string` (URL or relative path) | Yes      |
| `replace`  | `replace={false}`  | `boolean`                       | -        |
| `scroll`   | `scroll={true}`    | `boolean`                       | -        |
| `prefetch` | `prefetch={true}`  | `boolean`                       | -        |

- **`action`**: Form ကို submit လုပ်တဲ့အခါ သွားရောက်မယ့် URL (သို့) path ပါ။
  - Empty string `""` ဆိုရင် — search params အသစ်တွေနဲ့အတူ တူညီတဲ့ route ဆီပဲ navigate လုပ်ပါလိမ့်မယ်။
- **`replace`**: [browser ရဲ့ history](https://developer.mozilla.org/en-US/docs/Web/API/History_API) stack ထဲ entry အသစ်တစ်ခု push လုပ်မယ့်အစား — လက်ရှိ history state ကို အစားထိုး (replace) လုပ်ပါတယ်။ Default က `false` ပါ။
- **`scroll`**: Navigation အတွင်း scroll behavior ကို ထိန်းချုပ်ပါတယ်။ Default က `true` ဖြစ်ပြီး — route အသစ်ရဲ့ ထိပ်ဆုံးဆီ scroll လုပ်ကာ — back/forward navigation တွေအတွက်တော့ scroll position ကို ထိန်းထားပါတယ်။
- **`prefetch`**: Form က user ရဲ့ viewport ထဲမှာ မြင်သာလာတဲ့အခါ path ကို prefetch လုပ်မလား ဆိုတာကို ထိန်းချုပ်ပါတယ်။ Default က `true` ပါ။

### `action` (function) Props

`action` က function ဖြစ်နေရင် — `<Form>` component က အောက်ပါ prop တစ်ခုကို ထောက်ပံ့ပါတယ်:

| Prop     | Example             | Type                       | Required |
| -------- | ------------------- | -------------------------- | -------- |
| `action` | `action={myAction}` | `function` (Server Action) | Yes      |

- **`action`**: Form ကို submit လုပ်တဲ့အခါ ခေါ်ယူမယ့် Server Action ပါ။ အသေးစိတ်အတွက် [React docs](https://react.dev/reference/react-dom/components/form#props) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** `action` က function ဖြစ်နေရင် — `replace` နဲ့ `scroll` props တွေကို လျစ်လျူရှုပါတယ် (ignored)။

### Caveats (သတိထားစရာများ)

- **`formAction`**: `action` prop ကို override လုပ်ဖို့ `<button>` (သို့) `<input type="submit">` fields တွေမှာ သုံးနိုင်ပါတယ်။ Next.js က client-side navigation ကို လုပ်ဆောင်ပေးပေမယ့် — ဒီနည်းလမ်းက prefetching ကို ထောက်ပံ့ပေးမှာ မဟုတ်ပါဘူး။
  - [`basePath`](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath) သုံးနေရင် — `formAction` ရဲ့ path ထဲမှာပါ ထည့်ပေးရပါမယ်။ ဥပမာ — `formAction="/base-path/search"`။
- **`key`**: String `action` တစ်ခုဆီ `key` prop တစ်ခု ပေးတာကို မထောက်ပံ့ပါဘူး။ Re-render တစ်ခု ဖြစ်စေချင် (သို့) mutation တစ်ခု လုပ်ချင်ရင် — function `action` တစ်ခုကို သုံးဖို့ စဉ်းစားပါ။
- **`onSubmit`**: Form submission logic တွေကို ကိုင်တွယ်ဖို့ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — `event.preventDefault()` ကို ခေါ်လိုက်ရင် သတ်မှတ်ထားတဲ့ URL ဆီ navigate လုပ်တာလိုမျိုး `<Form>` ရဲ့ အပြုအမူတွေကို override လုပ်ပစ်မှာ ဖြစ်ပါတယ်။
- **[`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method), [`encType`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#enctype), [`target`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#target)**: ဒါတွေက `<Form>` ရဲ့ အပြုအမူကို override လုပ်လို့ — ထောက်ပံ့မပေးပါဘူး။
  - အလားတူပဲ — `formMethod`, `formEncType` နဲ့ `formTarget` တွေက `method`, `encType` နဲ့ `target` props တွေကို အသီးသီး override လုပ်ဖို့ သုံးနိုင်ပြီး — အဲဒါတွေ သုံးလိုက်ရင် native browser အပြုအမူဆီ fallback သွားပါလိမ့်မယ်။
  - ဒီ props တွေ လိုအပ်နေရင် — အဲဒီအစား HTML `<form>` element ကို သုံးပါ။
- **`<input type="file">`**: `action` က string ဖြစ်နေချိန်မှာ ဒီ input type ကို သုံးရင် — file object အစား filename ကို submit လုပ်တဲ့ browser ရဲ့ အပြုအမူအတိုင်းပဲ ဖြစ်ပါတယ်။

## ဥပမာများ (Examples)

### Search result page ဆီ ရောက်စေတဲ့ Search form

`action` အဖြစ် path တစ်ခုကို ပေးပြီး — search results page ဆီ navigate လုပ်တဲ့ search form တစ်ခု ဖန်တီးနိုင်ပါတယ်:

```tsx filename="/app/page.tsx" switcher
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

```jsx filename="/app/page.js" switcher
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

User က query input field ထဲက စာသားကို ပြင်ပြီး form ကို submit လုပ်တဲ့အခါ — form data ကို URL ထဲမှာ search params အဖြစ် encode လုပ်ပြီး — ဥပမာ `/search?query=abc` ဆိုတဲ့ ပုံစံမျိုး ဖြစ်သွားပါတယ်။

> **သိထားသင့်သည်:** `action` ဆီ empty string `""` တစ်ခု ပေးလိုက်ရင် — form က search params အသစ်တွေနဲ့အတူ တူညီတဲ့ route ဆီပဲ navigate လုပ်ပါလိမ့်မယ်။

Results page ပေါ်မှာ — [`searchParams`](/docs/nextjs/file-conventions-page#searchparams-optional) `page.js` prop ကို သုံးပြီး query ကို ဝင်ရောက် ဖတ်နိုင်ကာ — external source တစ်ခုကနေ data fetch လုပ်ဖို့ သုံးနိုင်ပါတယ်။

```tsx filename="/app/search/page.tsx" switcher
import { getSearchResults } from '@/lib/search'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const results = await getSearchResults((await searchParams).query)

  return <div>...</div>
}
```

```jsx filename="/app/search/page.js" switcher
import { getSearchResults } from '@/lib/search'

export default async function SearchPage({ searchParams }) {
  const results = await getSearchResults((await searchParams).query)

  return <div>...</div>
}
```

`<Form>` က user ရဲ့ viewport ထဲမှာ မြင်သာလာတာနဲ့ — `/search` page ပေါ်က shared UI (ဥပမာ `layout.js` နဲ့ `loading.js`) တွေကို prefetch လုပ်ပါလိမ့်မယ်။ Submit လုပ်လိုက်တာနဲ့ — form က route အသစ်ဆီ ချက်ချင်း navigate လုပ်ပြီး — results တွေ fetch ဖြစ်နေချိန်မှာ loading UI ကို ပြသပါတယ်။ Fallback UI ကို [`loading.js`](/docs/nextjs/file-conventions-loading) သုံးပြီး ဒီဇိုင်းဆွဲနိုင်ပါတယ်:

```tsx filename="/app/search/loading.tsx" switcher
export default function Loading() {
  return <div>Loading...</div>
}
```

```jsx filename="/app/search/loading.js" switcher
export default function Loading() {
  return <div>Loading...</div>
}
```

Shared UI က မရသေးတဲ့ အခြေအနေတွေကို ဖုံးအုပ်ဖို့ — [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) ကို သုံးပြီး user ကို ချက်ချင်း တုံ့ပြန်မှု (instant feedback) ပြသနိုင်ပါတယ်။

ပထမဆုံး — form က pending (ဆောင်ရွက်နေဆဲ) ဖြစ်နေချိန်မှာ loading state ပြသပေးတဲ့ component တစ်ခု ဖန်တီးပါ:

```tsx filename="/app/ui/search-button.tsx" switcher
'use client'
import { useFormStatus } from 'react-dom'

export default function SearchButton() {
  const status = useFormStatus()
  return (
    <button type="submit">{status.pending ? 'Searching...' : 'Search'}</button>
  )
}
```

```jsx filename="/app/ui/search-button.js" switcher
'use client'
import { useFormStatus } from 'react-dom'

export default function SearchButton() {
  const status = useFormStatus()
  return (
    <button type="submit">{status.pending ? 'Searching...' : 'Search'}</button>
  )
}
```

ပြီးရင် — `SearchButton` component ကို သုံးဖို့ search form page ကို update လုပ်ပါ:

```tsx filename="/app/page.tsx" switcher
import Form from 'next/form'
import { SearchButton } from '@/ui/search-button'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <SearchButton />
    </Form>
  )
}
```

```jsx filename="/app/page.js" switcher
import Form from 'next/form'
import { SearchButton } from '@/ui/search-button'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <SearchButton />
    </Form>
  )
}
```

### Server Actions တွေနဲ့ Mutations လုပ်ခြင်း

`action` prop ဆီ function တစ်ခုကို ပေးပြီး mutations တွေ လုပ်ဆောင်နိုင်ပါတယ်။

```tsx filename="/app/posts/create/page.tsx" switcher
import Form from 'next/form'
import { createPost } from '@/posts/actions'

export default function Page() {
  return (
    <Form action={createPost}>
      <input name="title" />
      {/* ... */}
      <button type="submit">Create Post</button>
    </Form>
  )
}
```

```jsx filename="/app/posts/create/page.js" switcher
import Form from 'next/form'
import { createPost } from '@/posts/actions'

export default function Page() {
  return (
    <Form action={createPost}>
      <input name="title" />
      {/* ... */}
      <button type="submit">Create Post</button>
    </Form>
  )
}
```

Mutation တစ်ခု ပြီးနောက် — resource အသစ်ဆီ redirect လုပ်တာ အသုံးများပါတယ်။ Post page အသစ်ဆီ သွားဖို့ `next/navigation` ကနေ [`redirect`](/docs/nextjs/redirecting) function ကို သုံးနိုင်ပါတယ်။

> **သိထားသင့်သည်:** Form submission ရဲ့ "destination" (ဦးတည်ရာ) ကို action execute ဖြစ်တဲ့အထိ မသိနိုင်လို့ — `<Form>` က shared UI ကို အလိုအလျောက် prefetch လုပ်လို့ မရပါဘူး။

```tsx filename="/app/posts/actions.ts" switcher
'use server'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // Create a new post
  // ...

  // Redirect to the new post
  redirect(`/posts/${data.id}`)
}
```

```jsx filename="/app/posts/actions.js" switcher
'use server'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  // Create a new post
  // ...

  // Redirect to the new post
  redirect(`/posts/${data.id}`)
}
```

ပြီးရင် — page အသစ်မှာ `params` prop ကို သုံးပြီး data fetch လုပ်နိုင်ပါတယ်:

```tsx filename="/app/posts/[id]/page.tsx" switcher
import { getPost } from '@/posts/data'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getPost(id)

  return (
    <div>
      <h1>{data.title}</h1>
      {/* ... */}
    </div>
  )
}
```

```jsx filename="/app/posts/[id]/page.js" switcher
import { getPost } from '@/posts/data'

export default async function PostPage({ params }) {
  const { id } = await params
  const data = await getPost(id)

  return (
    <div>
      <h1>{data.title}</h1>
      {/* ... */}
    </div>
  )
}
```

နောက်ထပ် ဥပမာတွေအတွက် [Mutating data](https://nextjs.org/docs/app/getting-started/mutating-data) ကို ကြည့်ပါ။
