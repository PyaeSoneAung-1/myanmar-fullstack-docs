---
title: "Error Handling"
description: "မျှော်လင့်ထားတဲ့ (expected) errors တွေကို ဘယ်လို ပြသမလဲ နဲ့ မမျှော်လင့်ထားတဲ့ (uncaught) exceptions တွေကို ဘယ်လို ကိုင်တွယ်မလဲ — useActionState, notFound, error.js, catchError, global-error.js"
order: 10
source: "https://nextjs.org/docs/app/getting-started/error-handling"
status: translated
updated: 2026-09-01
---

Errors တွေကို အမျိုးအစား နှစ်ခု ခွဲနိုင်ပါတယ်: [expected errors](#handling-expected-errors) (မျှော်လင့်ထားတဲ့ errors) နဲ့ [uncaught exceptions](#handling-uncaught-exceptions) (မမျှော်လင့်ထားတဲ့ exceptions) တွေပါ။ ဒီ page မှာ ဒီ errors တွေကို သင့် Next.js application ထဲမှာ ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာ အဆင့်ဆင့် ရှင်းပြပါမယ်။

## Expected errors တွေကို ကိုင်တွယ်ခြင်း

Expected errors တွေဆိုတာ application ရဲ့ ပုံမှန် လည်ပတ်မှုအတွင်းမှာ ဖြစ်နိုင်တဲ့ errors တွေပါ — ဥပမာ [server-side form validation](/docs/nextjs/forms) (သို့) မအောင်မြင်တဲ့ requests တွေကနေ ဖြစ်တတ်ပါတယ်။ ဒီ errors တွေကို ရှင်းရှင်းလင်းလင်း ကိုင်တွယ်ပြီး client ဆီ ပြန်ပို့သင့်ပါတယ်။

### Server Functions

[Server Functions](https://react.dev/reference/rsc/server-functions) တွေထဲမှာ expected errors တွေကို ကိုင်တွယ်ဖို့ [`useActionState`](https://react.dev/reference/react/useActionState) hook ကို သုံးနိုင်ပါတယ်။

ဒီ errors တွေအတွက် — `try`/`catch` blocks တွေ သုံးပြီး errors တွေကို throw လုပ်တာကို ရှောင်ပါ။ အဲဒီအစား expected errors တွေကို return values အဖြစ် ပုံဖော်ပါ။

```ts
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

သင့် action ကို `useActionState` hook ဆီ ပို့ပြီး — error message ပြသဖို့ return လုပ်လာတဲ့ `state` ကို သုံးနိုင်ပါတယ်။

```tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = {
  message: '',
}

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

### Server Components

Server Component တစ်ခုထဲမှာ data fetch လုပ်တဲ့အခါ — response ကို သုံးပြီး error message တစ်ခုကို condition ပေါ်မူတည်ပြီး render လုပ်နိုင်သလို (သို့) [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect) လုပ်နိုင်ပါတယ်။

```tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!res.ok) {
    return 'There was an error.'
  }

  return '...'
}
```

### Not found (တွေ့ရှိမှု မရှိခြင်း)

Route segment တစ်ခုအတွင်းမှာ [`notFound`](/docs/nextjs/not-found) function ကို ခေါ်နိုင်ပြီး — 404 UI တစ်ခု ပြသဖို့ [`not-found.js`](/docs/nextjs/not-found) file ကို သုံးနိုင်ပါတယ်။

```tsx
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

```tsx
export default function NotFound() {
  return <div>404 - Page Not Found</div>
}
```

## Uncaught exceptions တွေကို ကိုင်တွယ်ခြင်း

Uncaught exceptions တွေဆိုတာ မမျှော်လင့်ထားတဲ့ errors တွေပါ — application ရဲ့ ပုံမှန် စီးဆင်းမှုအတွင်းမှာ မဖြစ်သင့်တဲ့ bugs (သို့) ပြဿနာတွေကို ညွှန်ပြပါတယ်။ ဒါတွေကို errors throw လုပ်ခြင်းဖြင့် ကိုင်တွယ်သင့်ပြီး — error boundaries တွေက ဖမ်းယူပါလိမ့်မယ်။

### Nested error boundaries (အလွှာလိုက် error boundaries)

Next.js က uncaught exceptions တွေကို ကိုင်တွယ်ဖို့ error boundaries တွေကို သုံးပါတယ်။ Error boundaries တွေက သူတို့ရဲ့ child components တွေထဲက errors တွေကို ဖမ်းပြီး — ပျက်စီးသွားတဲ့ component tree အစား fallback UI တစ်ခုကို ပြသပါတယ်။

Error boundary တစ်ခု ဖန်တီးဖို့ — route segment တစ်ခုအတွင်းမှာ [`error.js`](https://nextjs.org/docs/app/api-reference/file-conventions/error) file တစ်ခု ထည့်ပြီး React component တစ်ခုကို export လုပ်ပါ:

```tsx
'use client' // Error boundaries တွေက Client Components ဖြစ်ရမယ်

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Error ကို error reporting service တစ်ခုဆီ log လုပ်ပါ
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Segment ကို ပြန် fetch လုပ်ပြီး ပြန် render လုပ်ခြင်းဖြင့် ပြန်လည်ထူထောင်ဖို့ ကြိုးစားပါ
          () => retry()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

Errors တွေက အနီးဆုံး parent error boundary ဆီ အပေါ်ကို ပြန့်တက်သွားပါတယ် (bubble up)။ ဒါကြောင့် [route hierarchy](/docs/nextjs/project-structure#component-hierarchy) ရဲ့ အဆင့်အမျိုးမျိုးမှာ `error.tsx` files တွေ ထားခြင်းဖြင့် — အသေးစိတ်ကျတဲ့ (granular) error handling လုပ်နိုင်ပါတယ်။

Component-level error recovery အတွက် — [`catchError`](https://nextjs.org/docs/app/api-reference/functions/catchError) function က သင့် component tree ရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို wrap လုပ်နိုင်တဲ့ error boundaries တွေ ဖန်တီးပေးပါတယ်:

```tsx
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

ပြီးတော့ return လုပ်လာတဲ့ component ကို layout (သို့) page မဆို wrapper အဖြစ် သုံးပါ:

```tsx
import ErrorBoundary from './custom-error-boundary'

export default function Component({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary title="Dashboard Error">{children}</ErrorBoundary>
}
```

Error boundaries တွေက event handlers တွေအတွင်းက errors တွေကို မဖမ်းပါဘူး။ သူတို့က [rendering ကာလအတွင်း](https://react.dev/reference/react/Component#static-getderivedstatefromerror) ဖြစ်တဲ့ errors တွေကို ဖမ်းဖို့ ဒီဇိုင်းထုတ်ထားပြီး — app တစ်ခုလုံး ပျက်စီးမယ့်အစား **fallback UI** တစ်ခု ပြသပါတယ်။

ယေဘုယျအားဖြင့် — event handlers (သို့) async code တွေထဲက errors တွေက error boundaries တွေနဲ့ မကိုင်တွယ်နိုင်ပါဘူး — ဘာလို့လဲဆိုတော့ သူတို့က rendering ပြီးမှ run လုပ်လို့ပါ။

ဒီကိစ္စတွေကို ကိုင်တွယ်ဖို့ — error ကို ကိုယ်တိုင် catch လုပ်ပြီး `useState` (သို့) `useReducer` နဲ့ သိမ်းကာ — user ကို အသိပေးဖို့ UI ကို update လုပ်ပါ။

```tsx
'use client'

import { useState } from 'react'

export function Button() {
  const [error, setError] = useState(null)

  const handleClick = () => {
    try {
      // do some work that might fail
      throw new Error('Exception')
    } catch (reason) {
      setError(reason)
    }
  }

  if (error) {
    /* render fallback UI */
  }

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  )
}
```

`useTransition` ကနေ ရတဲ့ `startTransition` အတွင်းက unhandled errors တွေက — အနီးဆုံး error boundary ဆီ bubble up သွားတာကို သတိပြုပါ။

```tsx
'use client'

import { useTransition } from 'react'

export function Button() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(() => {
      throw new Error('Exception')
    })

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  )
}
```

### Global errors

သိပ်မအဖြစ်များပေမယ့် — root app directory ထဲမှာ တည်ရှိတဲ့ [`global-error.js`](https://nextjs.org/docs/app/building-your-application/routing/error-handling) file ကို သုံးပြီး root layout ထဲက errors တွေကိုလည်း ကိုင်တွယ်နိုင်ပါတယ် — [internationalization](/docs/nextjs/internationalization) သုံးနေတာတောင် ရပါတယ်။ Global error UI က သူ့ရဲ့ ကိုယ်ပိုင် `<html>` နဲ့ `<body>` tags တွေ သတ်မှတ်ရပါမယ် — ဘာလို့လဲဆိုတော့ active ဖြစ်ချိန်မှာ သူက root layout (သို့) template ကို အစားထိုးလို့ပါ။

```tsx
'use client' // Error boundaries တွေက Client Components ဖြစ်ရမယ်

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    // global-error မှာ html နဲ့ body tags တွေ ပါဝင်ရမယ်
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
```
