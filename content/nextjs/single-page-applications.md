---
title: "Next.js နဲ့ single-page applications (SPAs) တည်ဆောက်ခြင်း"
description: "SPA (single-page application) ဆိုတာ ဘာလဲ၊ strict SPA တွေရဲ့ အားနည်းချက်တွေကို Next.js က ဘယ်လို ဖြေရှင်းပေးလဲ — client-side navigation နဲ့ data fetching သုံးပြီး SPA patterns (React use API + Context Provider, browser-only rendering, shallow routing, Server Actions) တည်ဆောက်နည်း၊ static export နဲ့ ရှိပြီးသား project တွေ migration လုပ်ခြင်း အကြောင်း"
order: 136
source: "https://nextjs.org/docs/app/guides/single-page-applications"
status: translated
updated: 2026-09-03
---

ဒီ guide မှာ client-side navigation နဲ့ data fetching ကို သုံးပြီး Single-Page Applications (SPAs) တွေ ဘယ်လို တည်ဆောက်ရမလဲ ကြည့်ပါမယ်။ Next.js က client ရော server patterns တွေပါ app တစ်ခုတည်းထဲမှာ ထောက်ပံ့ပေးပြီး — ရှိပြီးသား SPAs တွေကိုလည်း တစ်ခုလုံး rewrite လုပ်စရာ မလိုပဲ migrate (ပြောင်းရွှေ့) လုပ်လို့ ရပါတယ်။

## Single-Page Application (SPA) ဆိုတာ ဘာလဲ

SPA ရဲ့ အဓိပ္ပါယ် ဖွင့်ဆိုချက်က နေရာအလိုက် ကွဲပြားပါတယ်။ ဒီ guide မှာတော့ "strict SPA" ဆိုတာကို ဒီလို သတ်မှတ်ပါမယ်:

- **Client-side rendering (CSR)**: App ကို HTML file တစ်ခုတည်း (ဥပမာ `index.html`) နဲ့ ဝန်ဆောင်မှု ပေးပါတယ်။ Route တိုင်း၊ page transition တိုင်း၊ data fetch တိုင်းကို browser ထဲက JavaScript က ကိုင်တွယ်ပါတယ်။
- **Full-page reloads မရှိခြင်း**: Route တစ်ခုစီအတွက် document အသစ် တောင်းမယ့်အစား — client-side JavaScript က လက်ရှိ page ရဲ့ DOM ကို ပြင်ဆင်ပြီး လိုအပ်သလို data တွေ fetch လုပ်ပါတယ်။

Strict SPAs တွေက page က interactive ဖြစ်လာဖို့ JavaScript အမြောက်အမြား load လုပ်ရတတ်ပါတယ်။ ဒါ့အပြင် — client ဘက်က data waterfalls (data တစ်ခုပြီးတစ်ခု စောင့်ရတဲ့ requests အစဉ်လိုက်) တွေကို စီမံခန့်ခွဲရတာ ခက်ခဲနိုင်ပါတယ်။ Next.js နဲ့ SPA တည်ဆောက်ခြင်းက ဒီပြဿနာတွေကို ဖြေရှင်းပေးနိုင်ပါတယ်။

## SPA တွေအတွက် Next.js ကို ဘာကြောင့် သုံးသလဲ

Next.js က သင့် JavaScript bundles တွေကို အလိုအလျောက် code split (အပိုင်းပိုင်း ခွဲ) လုပ်ပြီး — route အမျိုးမျိုးအတွက် HTML entry points အများအပြား ထုတ်ပေးနိုင်ပါတယ်။ ဒါက client-side မှာ မလိုအပ်တဲ့ JavaScript code တွေ load မဖြစ်အောင် ရှောင်ရှားပေးလို့ — bundle size လျှော့ချပြီး page loads တွေ ပိုမြန်စေပါတယ်။

[`next/link`](/docs/nextjs/component-link) component က routes တွေကို အလိုအလျောက် [prefetch](/docs/nextjs/component-link) လုပ်ပေးတာကြောင့် — strict SPA တစ်ခုလိုပဲ မြန်ဆန်တဲ့ page transitions တွေ ရရှိပြီး — ချိတ်ဆက် (link) လုပ်ဖို့နဲ့ share လုပ်ဖို့အတွက် application ရဲ့ routing state ကို URL ထဲမှာ ထိန်းသိမ်းထားနိုင်တဲ့ အားသာချက်လည်း ပါပါတယ်။

Next.js က static site အနေနဲ့ဖြစ်စေ၊ အရာအားလုံး client-side မှာ render လုပ်တဲ့ strict SPA အနေနဲ့ဖြစ်စေ စတင်နိုင်ပါတယ်။ သင့် project ကြီးထွားလာရင် — လိုအပ်သလို server features တွေ (ဥပမာ [React Server Components](/docs/nextjs/server-client-components), [Server Actions](https://nextjs.org/docs/app/guides/server-actions), စသည်) ကို တဖြည်းဖြည်း ထပ်ဖြည့်နိုင်ပါတယ်။

## SPA patterns အသုံးများတာတွေ တည်ဆောက်ခြင်း

အောက်က ဥပမာတွေက Next.js နဲ့ SPA တည်ဆောက်ရာမှာ အသုံးများတဲ့ patterns တွေကို ဖော်ပြပါတယ်။ တွဲဖက်ပါတဲ့ [demo](https://next-spa-patterns.labs.vercel.dev) ([source](https://github.com/vercel-labs/next-spa-patterns)) မှာ pattern တစ်ခုချင်းစီကို လက်တွေ့ မြင်နိုင်ပါတယ်။

### Context Provider တစ်ခုအတွင်းမှာ React ရဲ့ `use` ကို အသုံးပြုခြင်း

React ရဲ့ [use API](https://react.dev/reference/react/use) ကို သုံးပြီး server ကနေ Client Component တစ်ခုဆီ data တွေကို stream လုပ်နိုင်ပါတယ်။ Server Component (parent (သို့) layout) တစ်ခုထဲမှာ data ကို fetch လုပ်ပြီး — Promise ကို အောက်ကို ပို့ပေးပါ။ Client Component က render လုပ်ချိန်အတွင်း `await` မလုပ်နိုင်လို့ — `use()` နဲ့ ၎င်းကို ဖြေ (unwrap) လိုက်ပါတယ်။

App ရဲ့ ကျန်အပိုင်းတွေ render မလုပ်ခင်ကတည်းက request ကို server ပေါ်မှာ စတင်လိုက်တာက — response ကို ချက်ချင်း stream လုပ်နိုင်စေပြီး client-side request waterfalls တွေကို ရှောင်ရှားပေးပါတယ်။

Promise တစ်ခုတည်းကို prop အနေနဲ့ ပို့ပြီး `use()` နဲ့ ဖြေနိုင်သလို — React context provider တစ်ခုနဲ့ တွဲပြီး ဘယ် Client Component မဆို custom hook တစ်ခုကနေတစ်ဆင့် value ကို ဖတ်နိုင်အောင်လည်း လုပ်နိုင်ပါတယ်။

Client Component တစ်ခုက focus revalidation, polling, mutations (သို့) request deduplication (ထပ်နေတဲ့ requests တွေ ဖယ်ရှားခြင်း) လိုအပ်ရင် — SWR (သို့) TanStack Query လို library တစ်ခုကို သုံးပါ။ Browser ကနေ တိုက်ရိုက် fetch လုပ်ခြင်း၊ Server Component တစ်ခုကနေ initial data ပေးခြင်း၊ နဲ့ library ရဲ့ cache ကို Next.js ရဲ့ server နဲ့ client caches တွေနဲ့ ညှိနှိုင်းခြင်း အတွက် [Client-side data fetching](/docs/nextjs/client-side-data-fetching) ကို ကြည့်ပါ။

Request ကို Server Component (ဒီမှာ root layout) တစ်ခုထဲမှာ await မလုပ်ဘဲ စတင်ပြီး — Promise ကို provider ဆီ ပို့ပေးပါ:

```tsx filename="app/layout.tsx" switcher
import { UserProvider } from './user-provider'
import { getUser } from './user' // some server-side function

export default function RootLayout({ children }: LayoutProps<'/'>) {
  let userPromise = getUser() // do NOT await

  return (
    <html lang="en">
      <body>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { UserProvider } from './user-provider'
import { getUser } from './user' // some server-side function

export default function RootLayout({ children }) {
  let userPromise = getUser() // do NOT await

  return (
    <html lang="en">
      <body>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  )
}
```

> **သိထားသင့်သည်:** Tree ရဲ့ မြင့်တဲ့နေရာမှာ သတ်မှတ်ထားတဲ့ Promise တစ်ခုကို ပြန် fetch လုပ်တိုင်း — ၎င်းကို သတ်မှတ်ခဲ့တဲ့ Server Component က ပြန် run ပါတယ်။ ဒါကြောင့် app ရဲ့ အစိတ်အပိုင်းတစ်ချို့ပဲ လိုအပ်တဲ့ data ဆိုရင် — provider ကို root layout မှာ မဟုတ်ဘဲ အဲဒီ subtree ပေါ်မှာ ထားပါ။ React ရဲ့ [context ကနေ Promise ဖတ်ခြင်းဆိုင်ရာ caveat](https://react.dev/reference/react/use#reading-a-promise-from-context) ကို ကြည့်ပါ။

Request တစ်ခုအတွင်းမှာ component အများအပြားက data တစ်ခုတည်းကို ဖတ်နေရင် — call တစ်ခုတည်းကို မျှဝေသုံးနိုင်ဖို့ `getUser` ကို React ရဲ့ [cache](https://react.dev/reference/react/cache) နဲ့ wrap လုပ်ပါ။ ဒီ pattern အကြောင်း ပိုသိရဖို့ [React.cache နဲ့ data ပြန်သုံးခြင်း](/docs/nextjs/data-fetching) ကို ကြည့်ပါ။

Provider က Promise ကို context ကနေတစ်ဆင့် ရှေ့ဆက် ပို့ပေးပါတယ်:

```tsx filename="app/user-provider.tsx" switcher
'use client'

import { createContext, useContext } from 'react'

type User = { id: string; name: string }

const UserContext = createContext<Promise<User> | null>(null)

export function useUser() {
  const userPromise = useContext(UserContext)
  if (!userPromise) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return userPromise
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode
  userPromise: Promise<User>
}) {
  return (
    <UserContext.Provider value={userPromise}>{children}</UserContext.Provider>
  )
}
```

```js filename="app/user-provider.js" switcher
'use client'

import { createContext, useContext } from 'react'

const UserContext = createContext(null)

export function useUser() {
  const userPromise = useContext(UserContext)
  if (!userPromise) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return userPromise
}

export function UserProvider({ children, userPromise }) {
  return (
    <UserContext.Provider value={userPromise}>{children}</UserContext.Provider>
  )
}
```

နောက်ဆုံးအနေနဲ့ — ဘယ် Client Component မှာမဆို `useUser()` hook ကို ခေါ်ပြီး Promise ကို `use()` နဲ့ ဖြေလိုက်ပါ — ဒါက data အသင့်မဖြစ်မချင်း component ကို suspend လုပ်ထားပါတယ်:

```tsx filename="app/profile.tsx" switcher
'use client'

import { use } from 'react'
import { useUser } from './user-provider'

export function Profile() {
  const userPromise = useUser()
  const user = use(userPromise)

  return <p>{user.name}</p>
}
```

```jsx filename="app/profile.js" switcher
'use client'

import { use } from 'react'
import { useUser } from './user-provider'

export function Profile() {
  const userPromise = useUser()
  const user = use(userPromise)

  return <p>{user.name}</p>
}
```

Promise ဖြေရှင်းနေချိန်အတွင်း fallback တစ်ခု ပြသဖို့ consumer ကို [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary တစ်ခုနဲ့ wrap လုပ်ပါ:

```tsx filename="app/page.tsx" switcher
import { Suspense } from 'react'
import { Profile } from './profile'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Profile />
    </Suspense>
  )
}
```

```jsx filename="app/page.js" switcher
import { Suspense } from 'react'
import { Profile } from './profile'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Profile />
    </Suspense>
  )
}
```

Promise ကို သုံးတဲ့ component (ဥပမာ အထက်က `Profile`) က Promise ဖြေရှင်းနေချိန်မှာ suspend လုပ်ထားလို့ — JavaScript load မပြီးဆုံးခင်မှာတင် stream လုပ်ပြီး ကြိုတင် render ထားတဲ့ (prerendered) HTML ကို ကြည့်ရှုနိုင်ပါတယ်။

ဒီ pattern ကို [live demo](https://next-spa-patterns.labs.vercel.dev/use-context) နဲ့ ၎င်းရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/use-context) မှာ ကြည့်နိုင်ပါတယ်။

### Browser ထဲမှာပဲ component တွေကို render လုပ်ခြင်း

Client components တွေကို `next build` လုပ်ချိန်မှာ [prerender](https://github.com/reactwg/server-components/discussions/4) လုပ်ပါတယ်။ Client Component တစ်ခုအတွက် prerendering ကို ပိတ်ပြီး browser environment ထဲမှာပဲ load ချင်တယ်ဆိုရင် — [`next/dynamic`](/docs/nextjs/lazy-loading) ကို သုံးနိုင်ပါတယ်:

```jsx
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(() => import('./component'), {
  ssr: false,
})
```

ဒါက `window` (သို့) `document` လို browser APIs တွေအပေါ် မှီခိုနေတဲ့ third-party libraries တွေအတွက် အသုံးဝင်ပါတယ်။ ဒါ့အပြင် — ဒီ APIs တွေ ရှိမရှိ စစ်ဆေးတဲ့ `useEffect` တစ်ခု ထည့်ပြီး — မရှိဘူးဆိုရင် `null` (သို့) prerender လုပ်မယ့် loading state တစ်ခုကို return လုပ်နိုင်ပါတယ်။

ဒီ pattern ကို [live demo](https://next-spa-patterns.labs.vercel.dev/browser-only) နဲ့ ၎င်းရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/browser-only) မှာ ကြည့်နိုင်ပါတယ်။

### Client ဘက်မှာ shallow routing လုပ်ခြင်း

[Create React App](https://nextjs.org/docs/app/guides/migrating/from-create-react-app) (သို့) [Vite](https://nextjs.org/docs/app/guides/migrating/from-vite) လို strict SPA တစ်ခုကနေ migrate လုပ်နေတယ်ဆိုရင် — URL state ကို update လုပ်ဖို့ shallow route လုပ်တဲ့ ရှိပြီးသား code တွေ ရှိနိုင်ပါတယ်။ ဒါက Next.js ရဲ့ default file-system routing ကို *မသုံးပဲ* — သင့် application ထဲက views တွေကြား manual transitions တွေအတွက် အသုံးဝင်ပါတယ်။

Next.js က page ကို reload မလုပ်ပဲ browser ရဲ့ history stack ကို update လုပ်ဖို့ native [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) နဲ့ [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) methods တွေကို သုံးခွင့် ပေးပါတယ်။

`pushState` နဲ့ `replaceState` calls တွေက Next.js Router ထဲကို ပေါင်းစည်းသွားလို့ — [`usePathname`](/docs/nextjs/use-pathname) နဲ့ [`useSearchParams`](/docs/nextjs/use-search-params) တွေနဲ့ ထပ်တူကျအောင် (sync) လုပ်နိုင်ပါတယ်။

```tsx filename="app/ui/sort-products.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    urlSearchParams.set('sort', sortOrder)
    window.history.pushState(null, '', `?${urlSearchParams.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

```jsx filename="app/ui/sort-products.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder) {
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    urlSearchParams.set('sort', sortOrder)
    window.history.pushState(null, '', `?${urlSearchParams.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

Next.js မှာ [routing နဲ့ navigation](/docs/nextjs/linking) ဘယ်လို အလုပ်လုပ်လဲ ဆိုတာ ပိုလေ့လာပါ။

ဒီ pattern ကို [live demo](https://next-spa-patterns.labs.vercel.dev/shallow-routing) နဲ့ ၎င်းရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/shallow-routing) မှာ ကြည့်နိုင်ပါတယ်။

### Server Actions နဲ့ data တွေကို mutation လုပ်ခြင်း

Interactivity (အသုံးပြုသူနဲ့ ထိတွေ့ဆက်သွယ်မှု) တွေမှာ data တွေ ရေးသားဖို့ မကြာခဏ လိုအပ်ပါတယ်။ Client Component တစ်ခုက [Server Action](https://nextjs.org/docs/app/guides/server-actions) တစ်ခုကို ခေါ်ပြီး mutation ကို server ပေါ်မှာ run စေနိုင်ပါတယ်။ [client-side data fetching guide](/docs/nextjs/client-side-data-fetching) မှာ ပြထားသလို — client data-fetching library တစ်ခုက Server Action တစ်ခုတည်းကို ဝန်းရံပြီး optimistic browser update တစ်ခုကို ညှိနှိုင်းနိုင်ပါတယ်။ ဒီ section ရဲ့ ကျန်တဲ့အပိုင်းမှာတော့ Server Action ကို React ရဲ့ built-in state APIs တွေနဲ့ ညှိနှိုင်းပြပါမယ်။

Server Action တစ်ခုက အချိန်ယူရပြီး မအောင်မြင်လည်း ဖြစ်နိုင်ပါတယ်။ ၎င်း run နေချိန်မှာ UI ကို responsive ဖြစ်နေအောင် ထိန်းထားဖို့ React မှာ အသုံးဝင်တဲ့ tools တွေ ရှိပြီး — အဲဒါတွေနဲ့ mutation တစ်ခုက client-rendered SPA တစ်ခုလိုပဲ ချက်ချင်း (instant) ဖြစ်နေသလို ခံစားရစေနိုင်ပါတယ်: [transitions](https://react.dev/reference/react/useTransition), [`useOptimistic`](https://react.dev/reference/react/useOptimistic), [`useActionState`](https://react.dev/reference/react/useActionState) နဲ့ [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) တို့ပါ။

အရိုးရှင်းဆုံး ပုံစံကတော့ — Client Component တစ်ခုက transition တစ်ခုအတွင်းမှာ Server Action တစ်ခုကို ခေါ်ပြီး — feedback အတွက် pending state ကို သုံးတာပါ:

```tsx filename="app/delete-post.tsx" switcher
'use client'

import { useTransition } from 'react'
import { deletePost } from './actions'

export function DeletePost({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deletePost(id))}
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
```

```jsx filename="app/delete-post.js" switcher
'use client'

import { useTransition } from 'react'
import { deletePost } from './actions'

export function DeletePost({ id }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deletePost(id))}
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
```

ပြောင်းလဲမှုတိုင်း ချက်ချင်း ပေါ်သင့်တဲ့ list လိုမျိုး state တွေအတွက် — `useActionState` ကို `useOptimistic` နဲ့ တွဲသုံးနိုင်ပါတယ်။ အောက်က ဥပမာက to-do list တစ်ခုပါ: pure reducer တစ်ခုက action တစ်ခုချင်းစီက list ကို ဘယ်လို ပြောင်းလဲစေလဲ သတ်မှတ်ပေးလို့ — client ရော server ပါ အဲဒီ logic တစ်ခုတည်းကို မျှဝေသုံးပါတယ်:

```ts filename="app/todos-reducer.ts" switcher
export type Todo = { id: string; text: string; done: boolean }

export type TodoAction =
  | { type: 'add'; id: string; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'edit'; id: string; text: string }
  | { type: 'delete'; id: string }

export function todosReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      return [...todos, { id: action.id, text: action.text, done: false }]
    case 'toggle':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      )
    case 'edit':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, text: action.text } : todo
      )
    case 'delete':
      return todos.filter((todo) => todo.id !== action.id)
    default:
      return todos
  }
}
```

```js filename="app/todos-reducer.js" switcher
export function todosReducer(todos, action) {
  switch (action.type) {
    case 'add':
      return [...todos, { id: action.id, text: action.text, done: false }]
    case 'toggle':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      )
    case 'edit':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, text: action.text } : todo
      )
    case 'delete':
      return todos.filter((todo) => todo.id !== action.id)
    default:
      return todos
  }
}
```

Server Action က reducer ကို အသုံးချပြီး — ရလဒ်ကို သိမ်းဆည်းကာ နောက် list ကို ပြန်ပေးပါတယ်:

```ts filename="app/actions.ts" switcher
'use server'

import { db } from './db'
import { todosReducer, type Todo, type TodoAction } from './todos-reducer'

export async function saveTodos(
  todos: Todo[],
  action: TodoAction
): Promise<Todo[]> {
  const next = todosReducer(todos, action)
  await db.saveTodos(next)
  return next
}
```

```js filename="app/actions.js" switcher
'use server'

import { db } from './db'
import { todosReducer } from './todos-reducer'

export async function saveTodos(todos, action) {
  const next = todosReducer(todos, action)
  await db.saveTodos(next)
  return next
}
```

Client က reducer တစ်ခုတည်းကိုပဲ `useOptimistic` ဆီ ပို့လို့ — optimistic update ရော server ပါ နောက် state ကို တူညီတဲ့ နည်းနဲ့ တွက်ချက်ပါတယ်။ `runAction` helper တစ်ခုက optimistic change ကို အသုံးချပြီး transition တစ်ခုတည်းအတွင်းမှာ Server Action ကို dispatch လုပ်လိုက်လို့ — ပြောင်းလဲမှုတိုင်း ချက်ချင်း ပေါ်လာပါတယ်:

```tsx filename="app/todo-list.tsx" switcher
'use client'

import { useActionState, useOptimistic, startTransition } from 'react'
import { saveTodos } from './actions'
import { todosReducer, type Todo, type TodoAction } from './todos-reducer'

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, dispatch, isPending] = useActionState(saveTodos, initialTodos)
  const [optimisticTodos, addOptimistic] = useOptimistic(todos, todosReducer)

  function runAction(action: TodoAction) {
    startTransition(() => {
      addOptimistic(action)
      dispatch(action)
    })
  }

  return (
    <>
      <form
        action={(formData) =>
          runAction({
            type: 'add',
            id: crypto.randomUUID(),
            text: String(formData.get('text')),
          })
        }
      >
        <input name="text" />
        <button>Add</button>
      </form>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => runAction({ type: 'toggle', id: todo.id })}
            />
            <span
              style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => runAction({ type: 'delete', id: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isPending && <p>Syncing to server…</p>}
    </>
  )
}
```

```jsx filename="app/todo-list.js" switcher
'use client'

import { useActionState, useOptimistic, startTransition } from 'react'
import { saveTodos } from './actions'
import { todosReducer } from './todos-reducer'

export function TodoList({ initialTodos }) {
  const [todos, dispatch, isPending] = useActionState(saveTodos, initialTodos)
  const [optimisticTodos, addOptimistic] = useOptimistic(todos, todosReducer)

  function runAction(action) {
    startTransition(() => {
      addOptimistic(action)
      dispatch(action)
    })
  }

  return (
    <>
      <form
        action={(formData) =>
          runAction({
            type: 'add',
            id: crypto.randomUUID(),
            text: String(formData.get('text')),
          })
        }
      >
        <input name="text" />
        <button>Add</button>
      </form>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => runAction({ type: 'toggle', id: todo.id })}
            />
            <span
              style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => runAction({ type: 'delete', id: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isPending && <p>Syncing to server…</p>}
    </>
  )
}
```

Optimistic update က ချက်ချင်း ပေါ်လာပြီး — `useActionState` ရဲ့ pending flag ကတော့ Server Action ပြီးဆုံးတဲ့အထိ သိမ်မွေ့တဲ့ indicator တစ်ခု (ဥပမာ `Syncing to server…`) ပြသဖို့ ခွင့်ပြုပါတယ်။

ဒီ pattern ကို [live demo](https://next-spa-patterns.labs.vercel.dev/mutations) နဲ့ ၎င်းရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/mutations) မှာ ကြည့်နိုင်ပါတယ်။

Server-rendered apps တွေပေါ်မှာ interactivity တွေ ထပ်ဖြည့်ပြီး SPA တွေလို ခံစားရအောင် လုပ်နည်း ပိုလေ့လာဖို့ — [Building interactive apps](https://nextjs.org/docs/app/guides/interactive-apps) guide နဲ့ ၎င်းရဲ့ run လို့ရတဲ့ (runnable) demo ကို ကြည့်ပါ။

## Static export (optional)

Next.js က static site အပြည့်အစုံ [ထုတ်လုပ်ခြင်း](/docs/nextjs/static-exports) ကိုလည်း ထောက်ပံ့ပါတယ်။ ဒါက strict SPAs တွေထက် အားသာချက်တချို့ ရှိပါတယ်:

- **Automatic code-splitting**: `index.html` တစ်ခုတည်း ပို့မယ့်အစား — Next.js က route တစ်ခုစီအတွက် HTML file တစ်ခုစီ ထုတ်ပေးလို့ — visitors တွေက client JavaScript bundle ကို မစောင့်ပဲ content တွေကို ပိုမြန်မြန် ရရှိပါတယ်။
- **Improved user experience**: Routes အားလုံးအတွက် skeleton အကြမ်း မဟုတ်ဘဲ — route တစ်ခုစီအတွက် အပြည့်အဝ render လုပ်ထားတဲ့ pages တွေ ရရှိပါတယ်။ Users တွေ client side ကနေ navigate လုပ်တဲ့အခါမှာလည်း transitions တွေက ချက်ချင်း (instant) ဖြစ်ပြီး SPA လိုပါပဲ။

Static export တစ်ခု enable လုပ်ဖို့ — သင့် configuration ကို update လုပ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
}

export default nextConfig
```

`next build` run ပြီးတာနဲ့ Next.js က သင့် application အတွက် HTML/CSS/JS assets တွေပါတဲ့ `out` folder တစ်ခု ဖန်တီးပေးပါလိမ့်မယ်။

> **မှတ်ချက်:** Next.js server features တွေကို static exports တွေမှာ ထောက်ပံ့မထားပါဘူး။ [ပိုလေ့လာပါ](/docs/nextjs/static-exports)။

## ရှိပြီးသား project တွေကို Next.js ဆီ ပြောင်းရွှေ့ခြင်း

ဒီလမ်းညွှန်တွေကို လိုက်နာပြီး Next.js ဆီ တဖြည်းဖြည်း (incrementally) migrate လုပ်နိုင်ပါတယ်:

- [Migrating from Create React App](https://nextjs.org/docs/app/guides/migrating/from-create-react-app)
- [Migrating from Vite](https://nextjs.org/docs/app/guides/migrating/from-vite)

Pages Router နဲ့ SPA တစ်ခု သုံးနေပြီးသားဆိုရင် — [App Router ကို တဖြည်းဖြည်း စတင်အသုံးပြုနည်း](https://nextjs.org/docs/app/guides/migrating/app-router-migration) ကို လေ့လာနိုင်ပါတယ်။
