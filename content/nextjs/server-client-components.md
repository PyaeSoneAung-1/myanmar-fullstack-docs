---
title: "Server နဲ့ Client Components"
description: "React Server နဲ့ Client Components တွေကို သုံးပြီး app ရဲ့ အစိတ်အပိုင်းတွေကို server (သို့) client ပေါ်မှာ ဘယ်လို render လုပ်မလဲ — ဘယ်အချိန်မှာ ဘယ်ဟာကို သုံးမလဲ၊ ဘယ်လို ပေါင်းစပ်သုံးမလဲ"
order: 7
source: "https://nextjs.org/docs/app/getting-started/server-and-client-components"
status: translated
updated: 2026-09-01
---

Default အားဖြင့် layout နဲ့ page တွေက [Server Components](https://react.dev/reference/rsc/server-components) တွေ ဖြစ်ပါတယ် — ဆိုလိုတာက data တွေကို fetch လုပ်ပြီး UI ရဲ့ အစိတ်အပိုင်းတွေကို server ပေါ်မှာ render လုပ်နိုင်ပြီး၊ ရလဒ်ကို cache လုပ်ကာ client ဆီ stream လုပ်ပို့နိုင်ပါတယ်။ Interactivity (သုံးစွဲသူနဲ့ အပြန်အလှန် တုံ့ပြန်မှု) ဒါမှမဟုတ် browser API တွေ လိုအပ်တဲ့အခါ [Client Components](https://react.dev/reference/rsc/use-client) တွေနဲ့ အဲဒီလုပ်ဆောင်ချက်တွေကို ထပ်ဖြည့်နိုင်ပါတယ်။

ဒီ page မှာ Server နဲ့ Client Components တွေ Next.js မှာ ဘယ်လို အလုပ်လုပ်သလဲ၊ ဘယ်အချိန်မှာ သုံးရမလဲ၊ ပြီးတော့ app ထဲမှာ သူတို့ကို ဘယ်လို ပေါင်းစပ်သုံးရမလဲဆိုတာတွေကို ဥပမာတွေနဲ့တကွ ရှင်းပြပါမယ်။

> **သိထားသင့်သည်** — component type တစ်ခုချင်းစီက ဘယ်နေရာမှာ run လုပ်သလဲ၊ boundary က ဘယ်လို အလုပ်လုပ်သလဲဆိုတဲ့ ရှင်းလင်းချက်အတွက် [Server နဲ့ Client Boundary](/docs/nextjs/server-client-components) ကို ကြည့်ပါ။

## Server နဲ့ Client Components ကို ဘယ်အချိန်မှာ သုံးမလဲ

Client နဲ့ server environment တွေမှာ စွမ်းဆောင်ရည် မတူညီပါဘူး။ Server နဲ့ Client Components တွေက သင့် use case ပေါ်မူတည်ပြီး environment တစ်ခုချင်းစီမှာ logic တွေ run လုပ်နိုင်အောင် ကူညီပေးပါတယ်။

ဒါတွေ လိုအပ်ရင် **Client Components** ကို သုံးပါ:

- [State](https://react.dev/learn/managing-state) နဲ့ [event handlers](https://react.dev/learn/responding-to-events) — ဥပမာ `onClick`, `onChange`
- [Lifecycle logic](https://react.dev/learn/lifecycle-of-reactive-effects) — ဥပမာ `useEffect`
- Browser-only API တွေ — ဥပမာ `localStorage`, `window`, `navigator.geolocation` စသဖြင့်
- [Custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

ဒါတွေ လိုအပ်ရင် **Server Components** ကို သုံးပါ:

- Database ဒါမှမဟုတ် API တွေကနေ ရင်းမြစ်နဲ့ နီးကပ်တဲ့နေရာမှာ data fetch လုပ်ခြင်း
- API keys, tokens နဲ့ အခြား secret တွေကို client ဆီ မပေါက်ကြားအောင် ကာကွယ်ခြင်း
- Browser ဆီ ပို့တဲ့ JavaScript ပမာဏကို လျှော့ချခြင်း
- [First Contentful Paint (FCP)](https://web.dev/fcp/) ကို မြှင့်တင်ပြီး content တွေကို client ဆီ တဖြည်းဖြည်း (progressively) stream လုပ်ခြင်း

ဥပမာ — `<Page>` component က post တစ်ခုရဲ့ data ကို fetch လုပ်တဲ့ Server Component ဖြစ်ပြီး၊ အဲဒီ data ကို client-side interactivity ကို ကိုင်တွယ်တဲ့ `<LikeButton>` ဆီ props အနေနဲ့ ပို့ပေးပါတယ်။

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

## Server နဲ့ Client Components တွေ Next.js မှာ ဘယ်လို အလုပ်လုပ်သလဲ

### Server ပေါ်မှာ

Server ပေါ်မှာ Next.js က React ရဲ့ API တွေကို သုံးပြီး rendering ကို စီစဉ်ပေးပါတယ်။ Rendering အလုပ်တွေကို route segment တစ်ခုချင်းစီ ([layouts နဲ့ pages](/docs/nextjs/pages-layouts)) အလိုက် အပိုင်းပိုင်း ခွဲထားပြီး — ပြသခြင်း ရှိ/မရှိ မဆို [parallel route slots](/docs/nextjs/parallel-routes) တွေလည်း ပါဝင်ပါတယ်:

- **Server Components** တွေကို React Server Component Payload (RSC Payload) လို့ခေါ်တဲ့ အထူး data format အနေနဲ့ render လုပ်ပါတယ်။
- **Client Components** နဲ့ RSC Payload ကို သုံးပြီး HTML ကို [prerender](https://nextjs.org/docs/app/glossary#prerendering) လုပ်ပါတယ်။

> **React Server Component Payload (RSC) ဆိုတာ ဘာလဲ?**
>
> RSC Payload ဆိုတာ render လုပ်ပြီးသား React Server Components tree ရဲ့ compact ဖြစ်တဲ့, serialized လုပ်ထားတဲ့ ကိုယ်စားပြုပုံပါ။ React က client ပေါ်မှာ browser ရဲ့ DOM ကို update လုပ်ဖို့ ဒါကို သုံးပါတယ်။ RSC Payload ထဲမှာ ပါဝင်တာတွေက:
>
> - Server Components တွေရဲ့ render လုပ်ပြီးသား ရလဒ်
> - Client Components တွေကို ဘယ်နေရာမှာ render လုပ်ရမယ်ဆိုတဲ့ placeholder တွေနဲ့ သူတို့ရဲ့ JavaScript file တွေဆီ ညွှန်တဲ့ references
> - Server Component ကနေ Client Component ဆီ ပို့လိုက်တဲ့ props တွေ

### Client ပေါ်မှာ (ပထမဆုံး load)

ပြီးတော့ client ပေါ်မှာ:

1. **HTML** ကို သုံးပြီး user ကို route ရဲ့ မြန်ဆန်တဲ့ non-interactive အကြိုမြင်ကွင်း (preview) ကို ချက်ချင်း ပြပါတယ်။
2. **RSC Payload** ကို သုံးပြီး Client နဲ့ Server Component trees တွေကို ပြန်လည် ပေါင်းစည်း (reconcile) လုပ်ပါတယ်။
3. **JavaScript** ကို သုံးပြီး Client Components တွေကို hydrate လုပ်ကာ app ကို interactive ဖြစ်အောင် လုပ်ပါတယ်။

> **Hydration ဆိုတာ ဘာလဲ?**
>
> Hydration ဆိုတာ static HTML ကို interactive ဖြစ်အောင်လုပ်ဖို့ React က [event handlers](https://react.dev/learn/responding-to-events) တွေကို DOM ပေါ်မှာ တွဲပေးတဲ့ (attach) လုပ်ငန်းစဉ်ပါ။

### နောက်ဆက်တွဲ navigations

နောက်ဆက်တွဲ navigation တွေမှာ:

- **RSC Payload** ကို ကြိုတင် fetch (prefetch) လုပ်ပြီး cache လုပ်ထားလို့ navigation က ချက်ချင်း ဖြစ်ပါတယ်။
- **Client Components** တွေကို server-rendered HTML မပါဘဲ client ပေါ်မှာ လုံးလုံး render လုပ်ပါတယ်။

## ဥပမာများ

### Client Component သုံးနည်း

File ရဲ့ ထိပ်ဆုံး, imports တွေရဲ့ အထက်မှာ [`"use client"`](https://react.dev/reference/rsc/use-client) directive ထည့်ခြင်းဖြင့် Client Component တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

`"use client"` က Server နဲ့ Client module graphs (trees) တွေကြားက **boundary** ကို ကြေညာဖို့ သုံးပါတယ်။

File တစ်ခုကို `"use client"` နဲ့ မှတ်သားလိုက်တာနဲ့ — **အဲဒီ file ရဲ့ imports အားလုံးနဲ့ သူက တိုက်ရိုက် render လုပ်တဲ့ components တွေအားလုံးက client bundle ထဲ ပါဝင်သွားပါတယ်**။ ဆိုလိုတာက client အတွက် ရည်ရွယ်ထားတဲ့ component တိုင်းမှာ directive ထည့်စရာ မလိုပါဘူး။

ဒီအပြုအမူက Client Component ရဲ့ [module graph](https://nextjs.org/docs/app/glossary#module-graph) ထဲ ပါတဲ့ components တွေအတွက်ပါ — module graph မှာ သူ import လုပ်တဲ့ modules တွေနဲ့ သူ တိုက်ရိုက် render လုပ်တဲ့ components တွေ ပါဝင်ပါတယ်။ children ဒါမှမဟုတ် အခြား props အနေနဲ့ ပို့လိုက်တဲ့ Server Components တွေကိုတော့ မသက်ရောက်ပါဘူး။ အဲဒီ components တွေက Client Component ရဲ့ module graph ထဲ import မလုပ်ပါဘူး — သူတို့ကို server ပေါ်မှာ render လုပ်ပြီး render လုပ်ပြီးသား output အနေနဲ့ Client Component ဆီ ပို့ပေးပါတယ်။

Server နဲ့ Client Components တွေကို ဘယ်လို ပေါင်းစပ်သုံးနိုင်လဲဆိုတာကို [Server နဲ့ Client Components တွေ ရောယှက်သုံးခြင်း](#interleaving-server-and-client-components) မှာ ကြည့်ပါ။

### JS bundle အရွယ်အစား လျှော့ချခြင်း

Client JavaScript bundle တွေရဲ့ အရွယ်အစားကို လျှော့ချဖို့ — UI ရဲ့ ကြီးမားတဲ့ အစိတ်အပိုင်းတွေကို Client Components အဖြစ် မှတ်သားမယ့်အစား, interactive ဖြစ်တဲ့ component တစ်ခုချင်းစီမှာပဲ `'use client'` ထည့်ပါ။

ဥပမာ — `<Layout>` component ထဲမှာ logo နဲ့ navigation links လို static အစိတ်အပိုင်းတွေ အများစုပါပြီး interactive ဖြစ်တဲ့ search bar တစ်ခုလည်း ပါပါတယ်။ `<Search />` က Client Component ဖြစ်ရမှာဖြစ်ပြီး — ကျန် layout တစ်ခုလုံးကတော့ Server Component အဖြစ် ဆက်နေနိုင်ပါတယ်။

```tsx
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'

// Layout က default အားဖြင့် Server Component ဖြစ်သည်
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```tsx
'use client'

export default function Search() {
  // ...
}
```

### Server ကနေ Client Components ဆီ data ပို့ခြင်း

Server Components ကနေ Client Components ဆီ props တွေသုံးပြီး data ပို့နိုင်ပါတယ်။

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return <LikeButton likes={post.likes} />
}
```

```tsx
'use client'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

တနည်းအားဖြင့် — Server Component ကနေ Client Component ဆီ [`use` API](https://react.dev/reference/react/use) နဲ့ data ကို stream လုပ်ပြီး ပို့နိုင်ပါတယ်။ [ဥပမာ](/docs/nextjs/data-fetching) ကို ကြည့်ပါ။

> **သိထားသင့်သည်** — Client Components တွေဆီ ပို့တဲ့ props တွေက React အတွက် [serializable](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values) ဖြစ်ရပါမယ်။

### Server နဲ့ Client Components တွေ ရောယှက်သုံးခြင်း (Interleaving)

Client Component တစ်ခုဆီ Server Component တစ်ခုကို prop အနေနဲ့ ပို့နိုင်ပါတယ်။ ဒါကြောင့် server-rendered UI ကို Client component တွေရဲ့ အတွင်းမှာ အမြင်ပိုင်း (visually) အသိုက်အမြှုံး ထည့်နိုင်ပါတယ်။

အသုံးများတဲ့ ပုံစံတစ်ခုက `<ClientComponent>` ထဲမှာ _slot_ တစ်ခု ဖန်တီးဖို့ `children` ကို သုံးတာပါ။ ဥပမာ — client state နဲ့ မြင်ကွင်းကို ဖွင့်/ပိတ် လုပ်တဲ့ `<Modal>` component ထဲမှာ server ပေါ်မှာ data fetch လုပ်တဲ့ `<Cart>` component ကို ထည့်တာမျိုးပါ။

```tsx
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

ပြီးတော့ parent Server Component (ဥပမာ `<Page>`) ထဲမှာ `<Cart>` ကို `<Modal>` ရဲ့ child အဖြစ် ပို့နိုင်ပါတယ်:

```tsx
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

ဒီပုံစံမှာ Server Components တွေကို Client Components တွေဆီ props အနေနဲ့ ပို့တောင် server ပေါ်မှာ ကြိုတင် render လုပ်ထားပါတယ်။ React Server Component Payload ထဲမှာ အဲဒီ Server Components တွေရဲ့ render လုပ်ပြီးသား ရလဒ်တွေ ပါဝင်ပြီး — Client Components တွေကို ဘယ်နေရာမှာ render လုပ်ရမယ်ဆိုတဲ့ placeholders တွေနဲ့ သူတို့ရဲ့ JavaScript file တွေဆီ ညွှန်တဲ့ references တွေလည်း ပါပါတယ်။

### Context providers

[React context](https://react.dev/learn/passing-data-deeply-with-context) ကို current theme လို global state တွေ မျှဝေဖို့ အသုံးများပါတယ်။ ဒါပေမယ့် React context က Server Components တွေမှာ support မလုပ်ပါဘူး။

Context သုံးဖို့ — `children` ကို လက်ခံတဲ့ Client Component တစ်ခု ဖန်တီးပါ:

```tsx
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

ပြီးတော့ Server Component (ဥပမာ `layout`) ထဲမှာ import လုပ်ပါ:

```tsx
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

ဒါဆိုရင် Server Component က provider ကို တိုက်ရိုက် render လုပ်နိုင်ပြီး — app တစ်ခုလုံးက တခြား Client Components တွေအားလုံးလည်း ဒီ context ကို သုံးနိုင်ပါပြီ။

> **သိထားသင့်သည်** — Providers တွေကို tree ထဲမှာ တတ်နိုင်သမျှ နက်နက်နေရာမှာ render လုပ်သင့်ပါတယ် — `ThemeProvider` က `<html>` document တစ်ခုလုံးကို မပတ်ဘဲ `{children}` ကိုပဲ ပတ်ထားတာကို သတိပြုပါ။ ဒါက Next.js အတွက် Server Components တွေရဲ့ static အစိတ်အပိုင်းတွေကို optimize လုပ်ရ ပိုလွယ်စေပါတယ်။

Server ကနေ fetch လုပ်ထားတဲ့ data ကို context ကနေတဆင့် ပို့ပြီး Client Components တွေမှာ `use()` နဲ့ ဖတ်ချင်ရင် [Context Provider တစ်ခုအတွင်း React ရဲ့ `use` ကို သုံးခြင်း](https://nextjs.org/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider) ကို ကြည့်ပါ။

### Third-party components

Client-only features တွေပေါ်မှာ မှီခိုနေတဲ့ third-party component တစ်ခုကို သုံးတဲ့အခါ — သူက ကောင်းကောင်း အလုပ်လုပ်ဖို့ Client Component တစ်ခုထဲမှာ wrap လုပ်နိုင်ပါတယ်။

ဥပမာ — `<Carousel />` ကို `acme-carousel` package ကနေ import လုပ်ပါတယ်။ ဒီ component က `useState` သုံးပေမယ့် — `"use client"` directive မရှိသေးပါဘူး။

`<Carousel />` ကို Client Component တစ်ခုထဲမှာ သုံးရင် ကောင်းကောင်း အလုပ်လုပ်ပါတယ်:

```tsx
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Carousel က Client Component ထဲမှာ သုံးထားလို့ အလုပ်လုပ်တယ် */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

ဒါပေမယ့် Server Component တစ်ခုထဲမှာ တိုက်ရိုက် သုံးကြည့်ရင် error တက်ပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ `<Carousel />` က client-only features တွေ သုံးနေတယ်ဆိုတာ Next.js က မသိလို့ပါ။

ဒါကို ဖြေရှင်းဖို့ — client-only features တွေပေါ်မှာ မှီခိုနေတဲ့ third-party components တွေကို ကိုယ်ပိုင် Client Components တွေထဲမှာ wrap လုပ်နိုင်ပါတယ်:

```tsx
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

အခုတော့ `<Carousel />` ကို Server Component တစ်ခုထဲမှာ တိုက်ရိုက် သုံးလို့ရပါပြီ:

```tsx
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/* Carousel က Client Component ဖြစ်လို့ အလုပ်လုပ်တယ် */}
      <Carousel />
    </div>
  )
}
```

> **Library ရေးသားသူများအတွက် အကြံပြုချက်**
>
> Component library တစ်ခု တည်ဆောက်နေတယ်ဆိုရင် — client-only features တွေပေါ်မှာ မှီခိုနေတဲ့ entry points တွေမှာ `"use client"` directive ထည့်ပါ။ ဒါကြောင့် သုံးစွဲသူတွေက wrapper တွေ ကိုယ်တိုင် ဖန်တီးစရာ မလိုဘဲ Server Components တွေထဲကို components တွေ import လုပ်နိုင်ပါလိမ့်မယ်။
>
> Bundler အချို့က `"use client"` directives တွေကို ဖြုတ်ပစ်နိုင်တာကို သတိပြုသင့်ပါတယ်။ `"use client"` directive ပါဝင်အောင် esbuild ကို ဘယ်လို configure လုပ်ရမလဲဆိုတဲ့ ဥပမာကို [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13) နဲ့ [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) repositories တွေမှာ တွေ့နိုင်ပါတယ်။

### Environment poisoning ကာကွယ်ခြင်း

JavaScript modules တွေက Server နဲ့ Client Components modules နှစ်ခုလုံးကြားမှာ share လုပ်နိုင်ပါတယ်။ ဒါကြောင့် server-only code တွေကို client ထဲမှာ မတော်တဆ import လုပ်မိနိုင်ပါတယ်။ ဥပမာ — ဒီ function ကို ကြည့်ပါ:

```ts
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

ဒီ function ထဲမှာ client ဆီ ဘယ်တော့မှ မပေါက်ကြားသင့်တဲ့ `API_KEY` တစ်ခု ပါပါတယ်။

Next.js မှာ `NEXT_PUBLIC_` နဲ့ စတင်တဲ့ environment variables တွေပဲ client bundle ထဲ ပါဝင်ပါတယ်။ Prefix မပါတဲ့ variables တွေကို Next.js က empty string အဖြစ် အစားထိုးပါတယ်။

ဒါကြောင့် `getData()` ကို client ပေါ်မှာ import လုပ်ပြီး run လုပ်လို့ ရနိုင်ပေမယ့် — မျှော်လင့်ထားသလို အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။

Client Components တွေထဲမှာ မတော်တဆ သုံးမိတာကို ကာကွယ်ဖို့ [`server-only` package](https://www.npmjs.com/package/server-only) ကို သုံးနိုင်ပါတယ်။

ပြီးတော့ server-only code ပါတဲ့ file ထဲမှာ package ကို import လုပ်ပါ:

```js
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

အခုဆိုရင် module ကို Client Component တစ်ခုထဲမှာ import လုပ်ကြည့်ရင် — build-time error တစ်ခု ဖြစ်ပါလိမ့်မယ်။

သက်ဆိုင်တဲ့ [`client-only` package](https://www.npmjs.com/package/client-only) ကတော့ `window` object ကို ဝင်ရောက်သုံးတဲ့ code လို client-only logic တွေ ပါတဲ့ modules တွေကို မှတ်သားဖို့ သုံးပါတယ်။

Next.js မှာ `server-only` ဒါမှမဟုတ် `client-only` ကို install လုပ်တာက **optional** ပါ။ ဒါပေမယ့် သင့် linting rules တွေက extraneous dependencies တွေကို flag လုပ်နေတယ်ဆိုရင် — အဆင်မပြေမှုတွေ ရှောင်ဖို့ install လုပ်နိုင်ပါတယ်။

```bash
npm install server-only
```

Next.js က `server-only` နဲ့ `client-only` imports တွေကို အတွင်းပိုင်းမှာ ကိုင်တွယ်ပြီး — module ကို မှားတဲ့ environment မှာ သုံးတဲ့အခါ ပိုရှင်းလင်းတဲ့ error messages တွေ ပေးပါတယ်။ NPM ကနေ ရတဲ့ ဒီ packages တွေရဲ့ အကြောင်းအရာတွေကိုတော့ Next.js က သုံးမပါဘူး။

Next.js က [`noUncheckedSideEffectImports`](https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports) activate လုပ်ထားတဲ့ TypeScript configurations တွေအတွက် `server-only` နဲ့ `client-only` ရဲ့ ကိုယ်ပိုင် type declarations တွေလည်း ပေးထားပါတယ်။
