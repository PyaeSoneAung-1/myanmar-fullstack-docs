---
title: "Server နဲ့ Client Boundary"
description: "App Router မှာ Server Components နဲ့ Client Components တွေ ဘယ်မှာ run လဲ — RSC module graphs, rendering environments, boundary ကို ဖြတ်ကျော်ပုံ ('use client' directive, props, children), state နဲ့ interactivity, server data တွေ tree ထဲကို ဝင်ပုံ"
order: 178
source: "https://nextjs.org/docs/app/guides/server-and-client-boundary"
status: translated
updated: 2026-09-03
---

React Server Components (RSC) တွေက component tree တစ်ခုကို server နဲ့ client module graphs နှစ်ခုကြားမှာ ပိုင်းခြားပါတယ်။ ဒီ boundary က component code ဘယ်မှာ run မလဲ၊ အဲဒီ code က browser ဆီ ရောက်သွားလားဆိုတာကို သတ်မှတ်ပါတယ်။ RSC က Server Components တွေကို server ပေါ်မှာပဲ သီးသန့် ထားပြီး — interactive UI အတွက် Client Components တွေကိုတော့ ထိန်းသိမ်းထားပါတယ်။ နှစ်ခုလုံးက tree တစ်ခုတည်းထဲမှာ ပေါင်းစပ်ပြီး — server က အဲဒီ tree ကို [RSC Payload](https://nextjs.org/docs/app/glossary#rsc-payload) အဖြစ် render လုပ်ပါတယ်။ RSC Payload ဆိုတာ UI ရဲ့ serialized ဖော်ပြချက်တစ်ခုဖြစ်ပြီး — သူ့ထဲက Client Components တွေဆီ ညွှန်တဲ့ references တွေ သယ်ဆောင်ပါတယ်။

RSC မတိုင်ခင် — React components တွေက RSC က အခု Client Component model လို့ ခေါ်တဲ့ပုံစံအတိုင်းပဲ လိုက်နာပါတယ်။ React က ဒီ components တွေကို server ပေါ်မှာ HTML အဖြစ် render လုပ်နိုင်ပေမယ့် — အဲဒီ HTML ကို [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) လုပ်ဖို့ code တစ်ခုတည်းကိုပဲ browser ဆီ ပို့ပေးပါတယ်။ Hydration က ကနဦး HTML ကို interactive ဖြစ်စေပြီး — component က server ရော browser မှာပါ တူညီတဲ့ output ထုတ်ပေးဖို့ လိုအပ်ပါတယ်။ Client ပေါ်မှာတင် အပြည့်အဝ render လုပ်တဲ့ apps တွေကတော့ — အလွတ် shell တစ်ခုကနေ စတင်ပြီး browser ထဲမှာ component tree ကို mount လုပ်နိုင်ပါတယ်။

```txt
Server Component
├─ Server Component
└─ Client Component
   └─ Client Component
```

Component တစ်ခုချင်းစီရဲ့ module က server [module graph](https://nextjs.org/docs/app/glossary#module-graph) (သို့) client module graph (သို့) နှစ်ခုလုံးမှာ ပါဝင်နိုင်ပါတယ်။ Next.js က graphs နှစ်ခုလုံးက သုံးတဲ့ module တစ်ခုကို environment တစ်ခုစီအတွက် သီးခြား compile လုပ်ပါတယ်။

Rendering လုပ်နေစဉ် — server graph က Client Components တွေဆီ ညွှန်တဲ့ references တွေ ထုတ်ပေးပြီး — သူတို့ဆီ ပို့တဲ့ props တွေကို serialize လုပ်ပါတယ်။ Client graph က server graph ကို import မလုပ်ပါဘူး။ Client graph က references နဲ့ serialized props တွေကို RSC Payload ကနေတစ်ဆင့် လက်ခံရရှိပါတယ်။

## Rendering environments (render လုပ်တဲ့ ပတ်ဝန်းကျင်များ)

Component နာမည်တွေက server နဲ့ browser ကြား သပ်ရပ်တဲ့ ပိုင်းခြားမှုတစ်ခုလို ထင်ရပေမယ့် — rendering က နေရာနှစ်ခုလုံးမှာ ဖြစ်ပါတယ်။ Server ပေါ်မှာ — Server Component tree က RSC Payload ကို ထုတ်ပေးပါတယ်။ Next.js က payload နဲ့ Client Components တွေကို သုံးပြီး — build time မှာ (သို့) request တစ်ခုကို ကိုင်တွယ်နေစဉ်မှာ HTML ကို render လုပ်ပါတယ်။

Component တစ်ခု ဘယ်မှာ run မလဲ ဆုံးဖြတ်တဲ့အခါ — သူ့ရဲ့ server render ရော သူ့ code က browser ထဲမှာ run လားဆိုတာကိုပါ ထည့်သွင်းစဉ်းစားပါ:

|                      | Server ပေါ်မှာ | Browser ထဲမှာ |
| -------------------- | -------------- | -------------- |
| **Server Component** | ရသည်          | မရပါ          |
| **Client Component** | ရသည်          | ရသည်          |

"Client" ဆိုတဲ့ စကားလုံးက Client Component တစ်ခုဟာ သူ့ရဲ့ server render နဲ့အတူ — browser ထဲမှာလည်း run လို့ — ဆိုတာကို ညွှန်ပြပါတယ်။

တိုက်ရိုက် visit တစ်ခုမှာ — အောက်ပါ Client Component က server ပေါ်မှာ render လုပ်ပြီး — hydration လုပ်နေစဉ် browser ထဲမှာ နောက်တစ်ကြိမ် ထပ် render လုပ်ပါတယ်။ သူ့ရဲ့ log က terminal ရော browser console မှာပါ ပေါ်ပါတယ်။ Client-side navigation တစ်ခုမှာတော့ — server က RSC Payload ကို ပို့ပြီး — component က server-rendered HTML မပါဘဲ browser ထဲမှာ render လုပ်ပါတယ်။

```tsx filename="app/hello.tsx" switcher
'use client'

export default function Hello() {
  console.log('Hello rendered') // on a direct visit: server, then browser
  return <p>Hello</p>
}
```

```jsx filename="app/hello.js" switcher
'use client'

export default function Hello() {
  console.log('Hello rendered') // on a direct visit: server, then browser
  return <p>Hello</p>
}
```

Server ပေါ်မှာ Client Component တစ်ခုကို render လုပ်တာက HTML ကို ထုတ်ပေးပေမယ့် — component က Client Component အဖြစ်ပဲ ဆက်ရှိနေပါတယ်။

Client Components တွေကို HTML အဖြစ် render လုပ်တာက RSC ထက် စောပါတယ်။ Route ပေါ် မူတည်ပြီး — Next.js က HTML ကို ထုတ်လုပ်နိုင် (သို့) ပြန်ထုတ်လုပ်နိုင်ပါတယ်:

- [Static Site Generation (SSG)](https://nextjs.org/docs/app/glossary#prerendering) နဲ့ build time မှာ။
- [Incremental Static Regeneration (ISR)](https://nextjs.org/docs/app/glossary#incremental-static-regeneration-isr) နဲ့ build ပြီးနောက်မှာ။
- Server-side rendering (SSR) နဲ့ request တစ်ခုစီအတွက်။

RSC က သီးခြား process တစ်ခုပါ — Server Component code ကို server ပေါ်မှာ ထားပြီး — အဲဒီ code ကို ပို့မယ့်အစား RSC Payload ကို ထုတ်ပေးပါတယ်။ "Server-rendered" ဆိုတာ Next.js က HTML ကို ဘယ်လို ထုတ်လုပ်လဲဆိုတာကို ဖော်ပြတာဖြစ်ပြီး — "Server Component" ဆိုတာက component code ဘယ်မှာ run လဲ၊ အဲဒီ code က browser ဆီ ရောက်သွားလားဆိုတာကို ဖော်ပြတာပါ။

> **Server Components နဲ့ SEO**
>
> HTML ကိုပဲ ဖတ်တဲ့ crawler တစ်ခုက ပထမဆုံး response ကို မြင်ပြီး — သင့် JavaScript ကို လုံးဝ run မလုပ်ပါဘူး။ Server Components ရော Client Components နှစ်ခုလုံးက အဲဒီ response ထဲကို HTML ထည့်ဝင်ပါတယ်။
>
> SEO က server render က content အထိ ရောက်မရောက်ပေါ်မှာ မူတည်ပါတယ်။ User interaction (သို့) event တစ်ခုရဲ့ နောက်ကွယ်မှာ ချုပ်နှောင်ထားတဲ့ content တွေက — JavaScript run မလုပ်တဲ့ crawler တစ်ခု ရနိုင်တဲ့ HTML ထဲမှာ မပေါ်ပါဘူး။

Component တစ်ခု ဘယ်တော့ render လဲဆိုတဲ့ အသေးစိတ် — build time လား request တစ်ခုစီမှာလား၊ static လား dynamic လား — အတွက် [Rendering Philosophy](/docs/nextjs/rendering-philosophy) ကို ကြည့်ပါ။

## Data က tree ထဲကို ဘယ်လို ဝင်လဲ (How data enters the tree)

RSC မတိုင်ခင် — Next.js applications တွေက `getStaticProps` (သို့) `getServerSideProps` လို functions တွေနဲ့ server data တွေကို စုဆောင်းပြီး — component tree ဆီ props အဖြစ် ပို့ပေးလေ့ရှိပါတယ်။ Data fetching က tree render မလုပ်ခင် ဖြစ်ခဲ့ပါတယ်။ Tree က rendering လုပ်နေစဉ် fetch လုပ်မယ့်အစား — data ကို လက်ခံရရှိပါတယ်။

```txt
Data
  ↓
Loader or API
  ↓
Props
  ↓
Component tree
```

Server Component တစ်ခုက server ပေါ်မှာပဲ run လို့ — database, filesystem, internal service (သို့) secret တစ်ခုလိုမျိုး resources တွေကို တိုက်ရိုက် ဝင်ရောက်နိုင်ပါတယ်။ Component က ဒီ resources တွေကို သူ့ရဲ့ ကိုယ်ပိုင် render အတွင်း ဖတ်ပါတယ် — data ကို client ဆီ အရင်ထုတ်ဖော်ပြတဲ့ API route တစ်ခု မလိုအပ်ပါဘူး။

```tsx filename="app/page.tsx" switcher
import { PostList } from '@/app/ui/post-list'
import { getPosts } from '@/lib/data'

export default async function Page() {
  const posts = await getPosts() // runs on the server, during render
  return <PostList posts={posts} />
}
```

```jsx filename="app/page.js" switcher
import { PostList } from '@/app/ui/post-list'
import { getPosts } from '@/lib/data'

export default async function Page() {
  const posts = await getPosts() // runs on the server, during render
  return <PostList posts={posts} />
}
```

RSC နဲ့ဆိုရင် — Server Component တစ်ခုက rendering လုပ်နေစဉ်မှာ data fetch လုပ်နိုင်ပါတယ်။ သီးခြား data-loading အဆင့်တစ်ခုက component tree ဆီ initial props တွေ ပို့ဖို့ မလိုအပ်ပါဘူး။

> **သိထားသင့်သည်:** Server Component တစ်ခုက secrets နဲ့ server-only data တွေကို တိုက်ရိုက် ဖတ်နိုင်လို့ — Client Components တွေဆီ ဘာတွေ ပို့မလဲဆိုတာကို သေချာ စဉ်းစားပါ။
>
> Props တွေကို serialize လုပ်ပြီး browser ဆီ ပို့ပါတယ်။ [Data Security](https://nextjs.org/docs/app/guides/data-security#passing-data-from-server-to-client) ကို ကြည့်ပါ။

Server Components တွေက UI ပြန်မပို့ခင် data အားလုံးကို await လုပ်ရမယ် မဟုတ်ပါဘူး။ Server ကနေ fetch လုပ်ထားတဲ့ data ကို Client Component တစ်ခုဆီ stream လုပ်ဖို့ — Server Component တစ်ခုထဲမှာ request ကို စတင်ပြီး — pending promise ကို prop အဖြစ် ပို့ပါ။

Client Component က promise ကို [`use`](https://react.dev/reference/react/use#streaming-data-from-server-to-client) နဲ့ resource အဖြစ် ဖတ်ပါတယ်။ Promise pending ဖြစ်နေစဉ် — အနီးဆုံး [Suspense](https://nextjs.org/docs/app/glossary#suspense-boundary) boundary က သူ့ရဲ့ fallback ကို ပြပါတယ်။ Promise resolve ဖြစ်တဲ့အခါ Client Component က render လုပ်ပါတယ်။

Request က client မစတင်ခင် စတင်ပြီးသားမို့ — Client Component က mount ပြီးနောက်မှာ data တစ်ခုတည်းကို ပြန် fetch လုပ်ဖို့ မလိုအပ်ပါဘူး။ Request လုပ်လိုက်တဲ့ data က client-only state (သို့) user interaction ပေါ် မှီခိုနေရင်တော့ — browser ထဲမှာ fetch တစ်ခု စတင်ဖို့ လိုအပ်နိုင်ပါသေးတယ်။

တူညီတဲ့ `fetch` requests တွေကို [server render တစ်ခုအတွင်း memoize လုပ်ပါတယ်](/docs/nextjs/fetch)။ [Cache Components](/docs/nextjs/caching) တွေနဲ့ဆိုရင် — data function (သို့) component တစ်ခုကို cache လုပ်ပြီး — page ရဲ့ ကျန်တဲ့အစိတ်အပိုင်းတွေနဲ့ မသက်ဆိုင်ဘဲ အဲဒီ entry ကို revalidate လုပ်နိုင်ပါတယ်။ Implementation patterns တွေအတွက် [Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) ကို ကြည့်ပါ။

## State နဲ့ interactivity (တုံ့ပြန်မှု)

Server Component တစ်ခုရဲ့ code က browser ဆီ ဘယ်တော့မှ မရောက်ပါဘူး။ Next.js က route ကို render လုပ်တဲ့အခါ — navigation, refresh (သို့) revalidation ပြီးနောက်မှာ — component က ထပ် render လုပ်နိုင်ပါတယ်။

Client Component တစ်ခုရဲ့ code ကတော့ browser ဆီ ရောက်ပါတယ်။ React က component ကို ကနဦး load မှာ hydrate လုပ်ပြီး — client-side updates တွေက သူ့ကို browser ထဲမှာ ပြန် render လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** ကနဦး load မှာ — RSC Payload က HTML နဲ့အတူ ပါလာပါတယ်။
>
> Server Component ရဲ့ DOM nodes တွေကို တိုက်ရိုက် mutate လုပ်တာက DOM ကို React ရဲ့ component tree နဲ့ မကိုက်ညီအောင် ဖြစ်စေနိုင်ပါတယ်။
>
> Server Component output ကို update လုပ်ဖို့ — component ကို server ပေါ်မှာ ပြန် render လုပ်ပါ။ Browser က RSC Payload အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ — React က component tree ကို reconcile လုပ်ပြီး DOM ကို update လုပ်ပါတယ်။ [Streaming](/docs/nextjs/streaming) ကို ကြည့်ပါ။

`useState`, `useEffect` နဲ့ event handlers တွေက browser ထဲမှာ run ပြီး updates တွေကို တုံ့ပြန်တဲ့ code လိုအပ်ပါတယ်။ Server Component code က browser ဆီ ဘယ်တော့မှ မရောက်လို့ — ဒီ client-side APIs တွေကို သုံးလို့ မရပါဘူး။

Built-in browser နဲ့ HTML အပြုအမူတွေက Client Component တစ်ခု မလိုပဲ interactivity ကို ပေးနိုင်ပါတယ်။ ဥပမာ:

- `<details>` element တစ်ခုက ပွင့်လို့/ပိတ်လို့ ရပါတယ်။
- `<form>` တစ်ခုက သူ့ရဲ့ `action` prop ဆီ ပို့ထားတဲ့ [Server Function](/docs/nextjs/server-actions) တစ်ခုကနေတစ်ဆင့် submit လုပ်နိုင်ပါတယ်။
- `<video controls>` element တစ်ခုက play/pause လုပ်နိုင်ပါတယ်။

အပြုအမူက အချိန်နဲ့အမျှ ပြောင်းလဲနေတဲ့ browser state လိုအပ်တဲ့အခါ — controlled input, live filter (သို့) drag handle လိုမျိုး — Client Component တစ်ခုကို သုံးပါ။ Browser က လိုအပ်တဲ့ အပြုအမူအားလုံးကို ပေးနိုင်တဲ့အခါ button (သို့) form တစ်ခုက Client Component တစ်ခု မလိုအပ်ပါဘူး။

Environment တစ်ခုစီမှာ ဘာတွေ ပါဝင်သင့်လဲဆိုတဲ့ လက်တွေ့စာရင်းအတွက် [When to use Server and Client Components](/docs/nextjs/server-client-components) ကို ကြည့်ပါ။

## Boundary ကို ဖြတ်ကျော်ခြင်း (Crossing the boundary)

Client Component တစ်ခုကို [`'use client'`](/docs/nextjs/use-client) directive နဲ့ အမှတ်အသား လုပ်ပါတယ်။ Directive က module graph ထဲမှာ boundary တစ်ခုကို ရေးဆွဲပေးပြီး — စည်းမျဉ်း နှစ်ခုက ဘာတွေ ဖြတ်ကျော်လဲ သတ်မှတ်ပါတယ်:

- **Code** က imports တွေကနေတစ်ဆင့် ဖြတ်ကျော်ပါတယ်။ Client Component တစ်ခု import လုပ်သမျှဟာ [client bundle](https://nextjs.org/docs/app/glossary#client-bundles) ထဲကို ဆွဲသွင်းခံရပါတယ်။
- **Data** က props တွေကနေတစ်ဆင့် ဖြတ်ကျော်ပြီး — [serializable](/docs/nextjs/server-client-components) ဖြစ်ရပါမယ်။ ဒါကြောင့် event handlers လို functions တွေက ဖြတ်ကျော်လို့ မရပါဘူး။

> **သိထားသင့်သည်:**
>
> Server Component တစ်ခုကနေ Client Component တစ်ခုဆီ function တစ်ခုကို prop အဖြစ် ပို့တာက throw ဖြစ်ပါတယ်။ `onClick` လို event handler တစ်ခုက ဖြတ်ကျော်လို့ မရပါဘူး။ `'use server'` နဲ့ အမှတ်အသား လုပ်ထားတဲ့ [Server Function](/docs/nextjs/server-actions) တစ်ခုကတော့ reference အဖြစ် ဖြတ်ကျော်ပါတယ်။
>
> Server Function တစ်ခုက သူ့ရဲ့ type နဲ့ သာမန် function တစ်ခုနဲ့ ခွဲခြားလို့ မရပါဘူး။ TypeScript plugin က Client Component prop တစ်ခုကို — သူ့နာမည်က `action` (သို့) `Action` နဲ့ အဆုံးသတ်တဲ့အခါ — function အဖြစ် typed လုပ်ထားတာကို ခွင့်ပြုပါတယ်။ အခြား function props တွေကိုတော့ plugin က flag တင်ပါတယ်။

Render လုပ်ပြီးသား React element တစ်ခုက serializable data ဖြစ်လို့ — boundary ကို ဖြတ်ကျော်နိုင်ပါတယ်။ Render လုပ်ထားတဲ့ output ကို `children` အဖြစ် ပို့ပေးတာက — Server Component တစ်ခုကို Client Component တစ်ခုရဲ့ အတွင်းမှာ nested လုပ်ခွင့်ပေးပြီး — Server Component ရဲ့ code ကို client graph ထဲကို import မလုပ်ပါဘူး။

```tsx filename="app/page.tsx" switcher
import { Cart } from '@/app/ui/cart'
import { Modal } from '@/app/ui/modal'

// Page and Cart are Server Components. Modal is a Client Component
export default function Page() {
  return (
    <Modal title={<div>Your cart</div>}>
      <Cart />
    </Modal>
  )
}
```

```jsx filename="app/page.js" switcher
import { Cart } from '@/app/ui/cart'
import { Modal } from '@/app/ui/modal'

// Page and Cart are Server Components. Modal is a Client Component
export default function Page() {
  return (
    <Modal title={<div>Your cart</div>}>
      <Cart />
    </Modal>
  )
}
```

`children` prop က အခြား prop တွေလိုပဲ ပြုမူပါတယ်။ `Modal` က `title` နဲ့ `children` တွေကို serialized React elements အဖြစ် လက်ခံပြီး — သူ့ရဲ့ implementation ထဲမှာ သတ်မှတ်ထားတဲ့ နေရာတွေမှာ render လုပ်ပါတယ်။

```tsx filename="app/ui/modal.tsx" switcher
'use client'

import { useState, type ReactNode } from 'react'

export function Modal({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <div role="dialog">
      <header>
        {title}
        <button onClick={() => setOpen(false)}>Close</button>
      </header>
      {children}
    </div>
  )
}
```

```jsx filename="app/ui/modal.js" switcher
'use client'

import { useState } from 'react'

export function Modal({ title, children }) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <div role="dialog">
      <header>
        {title}
        <button onClick={() => setOpen(false)}>Close</button>
      </header>
      {children}
    </div>
  )
}
```

ဒီနေရာမှာ `Cart` က server ပေါ်မှာ run ပြီး — `Modal` က သူ့ရဲ့ output ကိုပဲ မြင်ရတာ — သူ့ code ကို ဘယ်တော့မှ မမြင်ရပါဘူး။

<details>
  <summary>Owner နဲ့ parent</summary>

ဒီဥပမာမှာ `Page` က React က သီးခြားထားတဲ့ အခန်းကဏ္ဍ နှစ်ခုကို ပြပါတယ်:

- **Owner** ဆိုတာ child တစ်ခုရဲ့ JSX ကို သူ့ရဲ့ source ထဲမှာ ပါဝင်တဲ့ component ပါ။ `Page` က `Modal` ရော `Cart` ကိုပါ ပိုင်ဆိုင်ပါတယ်။
- **Parent** က rendered tree ထဲမှာ child ကို တိုက်ရိုက် ပါဝင်စေတဲ့သူပါ။ `Modal` က `Cart` ရဲ့ parent ဖြစ်ပါတယ်။

`Cart` ရဲ့ owner က Server Component တစ်ခုမို့ — `Cart` က server ပေါ်မှာ render လုပ်ပါတယ်။ `Modal` က parent သက်သက်မို့ — `Modal` က `Cart` ရဲ့ output ကို နေရာချဖို့ လက်ခံရရှိပြီး — သူ့ code ကို run လုပ်ဖို့တော့ မရပါဘူး။ ဒီခွဲခြားမှုက Client Component တစ်ခုကို သူ ဘယ်တော့မှ import မလုပ်ဖူးတဲ့ Server Component တစ်ခုကို ပြသစေနိုင်ပါတယ်။

</details>

<details>
  <summary>Boundary ကိုဖြတ်ပြီး compound components များ</summary>

Compound components တွေက subcomponents တွေကို static properties အဖြစ် — `Menu.Item` (သို့) `Tabs.Panel` လိုမျိုး — ထုတ်ဖော်နိုင်ပါတယ်။ ဒီ pattern က အပိုင်းအားလုံး Server Components (သို့) အပိုင်းအားလုံး Client Components တွေဖြစ်တဲ့ graph တစ်ခုတည်းအတွင်းမှာ အလုပ်လုပ်ပါတယ်။

Static member တစ်ခု boundary ကို ဖြတ်ကျော်တဲ့အခါ — ဒီ pattern က ပျက်ပြားပါတယ်။ Client Component တစ်ခုကို import လုပ်တဲ့ Server Component တစ်ခုက function အစား client reference တစ်ခုကို လက်ခံရရှိပါတယ်။ အကျိုးဆက်အနေနဲ့ — `Menu.Item` က `undefined` ဖြစ်ပြီး — React က "Element type is invalid" ဆိုတဲ့ error တစ်ခုကို throw လုပ်ပါတယ်။

Compound Client Component တစ်ခုကို အခြား Client Component တစ်ခုကနေ သုံးပါ။ Server Component တစ်ခုကနေ သူ့ရဲ့ အပိုင်းတွေကို သုံးချင်ရင် — static properties အစား named exports အဖြစ် ထုတ်ဖော်ပါ။

</details>

Client subtree တစ်ခုရဲ့ entry မှာပဲ `'use client'` လိုပါတယ် — အဲဒီအတွင်းက file တိုင်းမှာ မဟုတ်ပါဘူး။ Entry ကနေ import လုပ်ထားတဲ့ module တိုင်းက client module graph ရဲ့ အစိတ်အပိုင်း ဖြစ်သွားပါတယ်။

Shared component တစ်ခုကို မပြောင်းဘဲ ထားချင်ရင် — သူ့ကို import လုပ်တဲ့ Client Component wrapper တစ်ခု ဖန်တီးပြီး — directive ကို wrapper ပေါ်မှာ ထားပါ။ Wrapper က shared module ကို မပြောင်းဘဲ ထားပြီး — boundary ကို သင့် application code နဲ့ ပိုနီးအောင် လုပ်ပေးပါတယ်။ `useState` (သို့) `useEffect` ခေါ်တဲ့ shared component တိုင်းပေါ်မှာ directive ထည့်စရာလည်း မလိုတော့ပါဘူး။

Client code တစ်ခုက boundary မပါဘဲ server graph ထဲကို ဝင်လာရင် — compiler က directive ဘယ်မှာ လိုအပ်လဲဆိုတာကို ညွှန်ပြပါလိမ့်မယ်။

နောက်ထပ် patterns တွေအတွက် [Interleaving Server and Client Components](/docs/nextjs/server-client-components) ကို ကြည့်ပါ။

Next.js မှာ သုံးတဲ့ အခြား directives တွေအတွက် — [directives](https://nextjs.org/docs/app/api-reference/directives) documentation ကို ကြည့်ပါ။
