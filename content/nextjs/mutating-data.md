---
title: "Mutating Data (ဒေတာ ပြောင်းလဲခြင်း)"
description: "Server Functions နဲ့ Server Actions တွေသုံးပြီး data တွေကို ဘယ်လို mutate (ပြောင်းလဲ) လုပ်မလဲ — Server Functions ဖန်တီးခြင်း, forms/event handlers တွေကနေ invoke လုပ်ခြင်း, pending state ပြသခြင်း, refresh/revalidate/redirect နဲ့ cookies အသုံးပြုခြင်း"
order: 260
source: "https://nextjs.org/docs/app/getting-started/mutating-data"
status: translated
updated: 2026-09-05
---


Next.js မှာ [React Server Functions](https://react.dev/reference/rsc/server-functions) တွေကို သုံးပြီး data တွေကို mutate (ပြောင်းလဲ) လုပ်နိုင်ပါတယ်။ ဒီ page မှာ Server Functions တွေကို ဘယ်လို ဖန်တီးမလဲ၊ ဘယ်လို invoke (ခေါ်ယူ) လုပ်မလဲ ဆိုတာတွေကို လေ့လာသွားပါမယ်။ Next.js နဲ့ သက်ဆိုင်တဲ့ behaviors တွေ — single-roundtrip response, sequential dispatch, security, deployment — အကြောင်းကတော့ [Server Actions and Mutations](/docs/nextjs/server-actions) page မှာ ကြည့်ပါ။

## Server Functions တွေက ဘာလဲ

**Server Function** ဆိုတာ server ပေါ်မှာ run လုပ်တဲ့ asynchronous function တစ်ခုပါ။ Client ကနေ network request တစ်ခုကတစ်ဆင့် ခေါ်ယူနိုင်တာမို့ — ဒီ functions တွေက asynchronous ဖြစ်ရပါမယ်။

`action` (သို့) mutation context တစ်ခုထဲမှာ သုံးတဲ့အခါ — သူတို့ကို **Server Actions** လို့လည်း ခေါ်ပါတယ်။

ပုံမှန်အားဖြင့် — Server Action ဆိုတာ [`startTransition`](https://react.dev/reference/react/startTransition) နဲ့ တွဲသုံးထားတဲ့ async function တစ်ခုပါ။ အောက်ပါ အခြေအနေတွေမှာ ဒါက အလိုအလျောက် ဖြစ်ပေါ်ပါတယ်:

- `action` prop ကိုသုံးပြီး `<form>` တစ်ခုဆီ function ကို ပေးလိုက်တဲ့အခါ။
- `formAction` prop ကိုသုံးပြီး `<button>` တစ်ခုဆီ function ကို ပေးလိုက်တဲ့အခါ။

Action တစ်ခုကို invoke လုပ်တဲ့အခါ — Next.js က server roundtrip တစ်ခုတည်းမှာ update လုပ်ထားတဲ့ UI ရော data အသစ်တွေကိုပါ ပြန်ပေးနိုင်ပါတယ်။

နောက်ကွယ်မှာတော့ actions တွေက `POST` method ကိုသုံးပြီး — ဒီ HTTP method တစ်ခုတည်းကပဲ သူတို့ကို invoke လုပ်နိုင်ပါတယ်။

> [!WARNING]
> Server Functions တွေက သင့် application ရဲ့ UI ကနေတင် မဟုတ်ဘဲ — တိုက်ရိုက် POST requests တွေကနေလည်း ရောက်ရှိနိုင်ပါတယ်။ Server Function တိုင်းအတွင်းမှာ authentication နဲ့ authorization ကို အမြဲ verify လုပ်ပါ။ အကြံပြုထားတဲ့ ပုံစံများအတွက် [Data Security guide](/docs/nextjs/data-security) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** Server Action ဆိုတာ — Server Function တစ်ခုကို သီးခြား အသုံးပြုနည်းတစ်မျိုးနဲ့ သုံးထားတာပါ (form submissions နဲ့ mutations တွေကို ကိုင်တွယ်ဖို့)။ Server Function က ပိုကျယ်ပြန့်တဲ့ အသုံးအနှုန်း ဖြစ်ပါတယ်။

## Server Functions ဖန်တီးခြင်း

Server Function တစ်ခုကို [`use server`](https://react.dev/reference/rsc/use-server) directive ကိုသုံးပြီး သတ်မှတ်နိုင်ပါတယ်။ Directive ကို **asynchronous** function တစ်ခုရဲ့ ထိပ်ဆုံးမှာ ထားပြီး အဲဒီ function ကို Server Function အဖြစ် မှတ်သားနိုင်သလို — သပ်သပ် file တစ်ခုရဲ့ ထိပ်ဆုံးမှာ ထားပြီး အဲဒီ file ကနေ export လုပ်ထားတဲ့အရာ အားလုံးကိုလည်း မှတ်သားနိုင်ပါတယ်။

```ts filename="app/lib/actions.ts" switcher
import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}

export async function deletePost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')

  // Verify the user owns this resource before deleting
  // Mutate data
  // Revalidate cache
}
```

```js filename="app/lib/actions.js" switcher
import { auth } from '@/lib/auth'

export async function createPost(formData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}

export async function deletePost(formData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')

  // Verify the user owns this resource before deleting
  // Mutate data
  // Revalidate cache
}
```

### Server Components

Server Functions တွေကို — `"use server"` directive ကို function body ရဲ့ ထိပ်ဆုံးမှာ ထည့်ပြီး — Server Components တွေထဲမှာ inline (တိုက်ရိုက်) ရေးသားနိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }

  return <></>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  // Server Action
  async function createPost(formData) {
    'use server'
    // ...
  }

  return <></>
}
```

> **သိထားသင့်သည်:** Server Components တွေက progressive enhancement ကို ပုံမှန်အားဖြင့် ပံ့ပိုးပေးပါတယ် — ဆိုလိုတာက Server Actions တွေကို ခေါ်တဲ့ forms တွေဟာ JavaScript load မဖြစ်သေးဘူး (သို့) disabled ဖြစ်နေရင်တောင် submit လုပ်နိုင်ပါတယ်။

### Client Components

Client Components တွေထဲမှာတော့ Server Functions တွေကို သတ်မှတ်လို့ မရပါဘူး။ ဒါပေမယ့် — ထိပ်ဆုံးမှာ `"use server"` directive ပါတဲ့ file တစ်ခုကနေ import လုပ်ပြီး — Client Components တွေထဲမှာ သူတို့ကို invoke လုပ်နိုင်ပါတယ်:

```ts filename="app/actions.ts" switcher
'use server'

export async function createPost() {}
```

```js filename="app/actions.js" switcher
'use server'

export async function createPost() {}
```

```tsx filename="app/ui/button.tsx" switcher
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

```jsx filename="app/ui/button.js" switcher
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

> **သိထားသင့်သည်:** Client Components တွေမှာ — Server Actions တွေကို invoke လုပ်တဲ့ forms တွေက JavaScript load မဖြစ်သေးရင် submissions တွေကို queue (တန်းစီ) လုပ်ထားပြီး — hydration အတွက် ဦးစားပေး သတ်မှတ်ပေးပါတယ်။ Hydration ပြီးသွားတဲ့အခါ — form submission မှာ browser က refresh လုပ်တော့မှာ မဟုတ်ပါဘူး။

### Actions တွေကို props အဖြစ် ပေးပို့ခြင်း

Action တစ်ခုကို Client Component ဆီ prop အနေနဲ့လည်း ပေးပို့နိုင်ပါတယ်:

```jsx
<ClientComponent updateItemAction={updateItem} />
```

```tsx filename="app/client-component.tsx" switcher
'use client'

export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

```jsx filename="app/client-component.js" switcher
'use client'

export default function ClientComponent({ updateItemAction }) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

## Server Functions တွေကို Invoke လုပ်ခြင်း

Server Function တစ်ခုကို invoke လုပ်ဖို့ နည်းလမ်း အဓိက နှစ်မျိုး ရှိပါတယ်:

1. Server Components နဲ့ Client Components တွေထဲက [Forms](#forms)
2. Client Components တွေထဲက [Event Handlers](#event-handlers) နဲ့ [useEffect](#useeffect)

> **သိထားသင့်သည်:** Server Functions တွေက server-side mutations တွေအတွက် ဒီဇိုင်းထုတ်ထားတာပါ။ Client က သူတို့ကို လက်ရှိမှာ တစ်ခုပြီးတစ်ခု dispatch လုပ်ပြီး await လုပ်ပါတယ်။ ဒါက implementation detail တစ်ခုဖြစ်ပြီး — နောင်မှာ ပြောင်းလဲနိုင်ပါတယ်။ Parallel data fetching လိုအပ်ရင် — Server Components တွေထဲမှာ [data fetching](/docs/nextjs/data-fetching) ကို သုံးပါ၊ (သို့) Server Function တစ်ခုတည်းအတွင်းမှာ ဒါမှမဟုတ် [Route Handler](/docs/nextjs/backend-for-frontend) တစ်ခုအတွင်းမှာ parallel အလုပ်တွေကို လုပ်ဆောင်ပါ။

### Forms

React က HTML ရဲ့ [`<form>`](https://react.dev/reference/react-dom/components/form) element ကို ချဲ့ထွင်ပြီး — HTML `action` prop ကတစ်ဆင့် Server Function တစ်ခုကို invoke လုပ်နိုင်အောင် လုပ်ပေးပါတယ်။

Form တစ်ခုထဲမှာ invoke လုပ်တဲ့အခါ — function က [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) object ကို အလိုအလျောက် လက်ခံရရှိပြီး — native [`FormData` methods](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods) တွေနဲ့ data တွေကို ထုတ်ယူနိုင်ပါတယ်:

```tsx filename="app/ui/form.tsx" switcher
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```jsx filename="app/ui/form.js" switcher
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```ts filename="app/actions.ts" switcher
'use server'

import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}
```

```js filename="app/actions.js" switcher
'use server'

import { auth } from '@/lib/auth'

export async function createPost(formData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}
```

### Event Handlers

Client Component တစ်ခုထဲမှာ — `onClick` လို event handlers တွေကိုသုံးပြီး Server Function တစ်ခုကို invoke လုပ်နိုင်ပါတယ်:

```tsx filename="app/like-button.tsx" switcher
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

```jsx filename="app/like-button.js" switcher
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

## ဥပမာများ (Examples)

### Pending state ပြသခြင်း

Server Function တစ်ခု run လုပ်နေချိန်မှာ — React ရဲ့ [`useActionState`](https://react.dev/reference/react/useActionState) hook ကိုသုံးပြီး loading indicator (လုပ်ဆောင်နေကြောင်း ညွှန်ပြချက်) ကို ပြသနိုင်ပါတယ်။ ဒီ hook က `pending` boolean တစ်ခုကို ပြန်ပေးပါတယ်:

```tsx filename="app/ui/button.tsx" switcher
'use client'

import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

```jsx filename="app/ui/button.js" switcher
'use client'

import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

Responsive interactions တွေ — pending feedback, optimistic UI, transitions နဲ့ error handling အပါအဝင် — အကြောင်း ပိုမို နက်ရှိုင်းစွာ လေ့လာချင်ရင် [Building interactive apps](/docs/nextjs/interactive-apps) guide ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** **experimental** [`useOffline`](/docs/nextjs/offline-support) config ဖွင့်ထားရင် — connectivity ပြတ်တောက်လို့ Server Action တစ်ခု ရပ်တန့်သွားရင်တောင် action က pending အနေနဲ့ ဆက်ရှိနေပြီး — network ပြန်ရတာနဲ့ ပြီးဆုံးသွားပါတယ်။

### Data ကို Refresh လုပ်ခြင်း

Mutation တစ်ခု ပြီးသွားပြီးနောက်မှာ — နောက်ဆုံး data တွေကို ပြသဖို့ လက်ရှိ page ကို refresh လုပ်ချင်တတ်ပါတယ်။ Server Action တစ်ခုထဲမှာ `next/cache` ကနေ [`refresh`](/docs/nextjs/refresh) ကို ခေါ်ပြီး ဒါကို လုပ်နိုင်ပါတယ်:

```ts filename="app/lib/actions.ts" switcher
'use server'

import { auth } from '@/lib/auth'
import { refresh } from 'next/cache'

export async function updatePost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  refresh()
}
```

```js filename="app/lib/actions.js" switcher
'use server'

import { auth } from '@/lib/auth'
import { refresh } from 'next/cache'

export async function updatePost(formData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  refresh()
}
```

ဒါက client router ကို refresh လုပ်ပြီး — UI က နောက်ဆုံး state ကို ထင်ဟပ်နေအောင် သေချာ လုပ်ပေးပါတယ်။ `refresh()` function က tagged data တွေကို revalidate မလုပ်ပါဘူး။ Tagged data တွေကို revalidate လုပ်ဖို့ဆိုရင် — [`updateTag`](/docs/nextjs/update-tag) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို အစားထိုး သုံးပါ။

### Data ကို Revalidate လုပ်ခြင်း

Mutation တစ်ခု လုပ်ဆောင်ပြီးနောက်မှာ — Server Function အတွင်းကနေ [`revalidatePath`](/docs/nextjs/revalidate-path) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို ခေါ်ပြီး — Next.js cache ကို revalidate လုပ်ကာ update လုပ်ထားတဲ့ data တွေကို ပြသနိုင်ပါတယ်:

```ts filename="app/lib/actions.ts" switcher
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  revalidatePath('/posts')
}
```

```js filename="app/lib/actions.js" switcher
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...
  revalidatePath('/posts')
}
```

### Mutation ပြီးနောက် Redirect လုပ်ခြင်း

Mutation တစ်ခု ပြီးနောက်မှာ — user ကို တခြား page တစ်ခုဆီ redirect လုပ်ချင်တတ်ပါတယ်။ Server Function အတွင်းကနေ [`redirect`](/docs/nextjs/redirect) ကို ခေါ်ပြီး ဒါကို လုပ်နိုင်ပါတယ်:

```ts filename="app/lib/actions.ts" switcher
'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  revalidatePath('/posts')
  redirect('/posts')
}
```

```js filename="app/lib/actions.js" switcher
'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  revalidatePath('/posts')
  redirect('/posts')
}
```

`redirect` ကို ခေါ်လိုက်တာက — framework က ကိုင်တွယ်ပေးတဲ့ control-flow exception တစ်ခုကို throw လုပ်ပါတယ်။ အဲဒီနောက်မှာ ရှိတဲ့ code တွေက run မှာ မဟုတ်ပါဘူး။ Fresh data လိုအပ်ရင် — ကြိုတင်ပြီး [`revalidatePath`](/docs/nextjs/revalidate-path) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို ခေါ်ထားပါ။

### Cookies

Server Action တစ်ခုအတွင်းမှာ [`cookies`](/docs/nextjs/cookies) API ကိုသုံးပြီး — cookies တွေကို `get`, `set`, `delete` လုပ်နိုင်ပါတယ်။

Server Action တစ်ခုထဲမှာ cookie တစ်ခုကို [set (သို့) delete](/docs/nextjs/cookies) လုပ်လိုက်တဲ့အခါ — Next.js က လက်ရှိ page နဲ့ ၎င်းရဲ့ layouts တွေကို server ပေါ်မှာ ပြန်လည် render လုပ်ပြီး — **UI က cookie value အသစ်ကို ထင်ဟပ်စေပါတယ်**။

> **သိထားသင့်သည်:** Server update က လက်ရှိ React tree အတွက်ပဲ သက်ရောက်ပါတယ် — လိုအပ်သလို components တွေကို re-render လုပ်၊ mount လုပ် (သို့) unmount လုပ်ပေးပါတယ်။ Re-render လုပ်ထားတဲ့ components တွေရဲ့ client state ကို ထိန်းသိမ်းပေးပြီး — dependencies တွေ ပြောင်းသွားရင် effects တွေက ပြန် run ပါတယ်။

```ts filename="app/actions.ts" switcher
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  const cookieStore = await cookies()

  // Get cookie
  cookieStore.get('name')?.value

  // Set cookie
  cookieStore.set('name', 'Delba')

  // Delete cookie
  cookieStore.delete('name')
}
```

```js filename="app/actions.js" switcher
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  // Get cookie
  const cookieStore = await cookies()

  // Get cookie
  cookieStore.get('name')?.value

  // Set cookie
  cookieStore.set('name', 'Delba')

  // Delete cookie
  cookieStore.delete('name')
}
```

### useEffect

Component တစ်ခု mount ဖြစ်ချိန် (သို့) dependency တစ်ခု ပြောင်းလဲချိန်မှာ — Server Action တစ်ခုကို invoke လုပ်ဖို့ React ရဲ့ [`useEffect`](https://react.dev/reference/react/useEffect) hook ကို သုံးနိုင်ပါတယ်။ Global events တွေပေါ် မူတည်တဲ့ (သို့) အလိုအလျောက် trigger လုပ်ဖို့ လိုအပ်တဲ့ mutations တွေအတွက် အသုံးဝင်ပါတယ်။ ဥပမာ — app shortcuts တွေအတွက် `onKeyDown`, infinite scrolling အတွက် intersection observer hook တစ်ခု၊ (သို့) view count တစ်ခုကို update လုပ်ဖို့ component mount ဖြစ်ချိန်မှာ:

```tsx filename="app/view-count.tsx" switcher
'use client'

import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])

  // You can use `isPending` to give users feedback
  return <p>Total Views: {views}</p>
}
```

```jsx filename="app/view-count.js" switcher
'use client'

import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'

export default function ViewCount({ initialViews }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])

  // You can use `isPending` to give users feedback
  return <p>Total Views: {views}</p>
}
```
