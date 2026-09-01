---
title: "Lazy Loading"
description: "Client Components နဲ့ libraries တွေကို lazy load လုပ်ပြီး application ရဲ့ loading performance ကို မြှင့်တင်ခြင်း — next/dynamic, React.lazy, ssr: false, external libraries, custom loading component, named exports နဲ့ magic comments"
order: 17
source: "https://nextjs.org/docs/app/guides/lazy-loading"
status: translated
updated: 2026-09-01
---

Next.js မှာ [lazy loading](https://developer.mozilla.org/docs/Web/Performance/Lazy_loading) က — route တစ်ခု render လုပ်ဖို့ လိုအပ်တဲ့ JavaScript ပမာဏကို လျှော့ချပေးခြင်းအားဖြင့် application တစ်ခုရဲ့ ကနဦး loading performance ကို မြှင့်တင်ပေးပါတယ်။

ဒါက **Client Components** တွေနဲ့ imported libraries တွေရဲ့ loading ကို ရွှေ့ဆိုင်းစေပြီး — သူတို့ လိုအပ်တဲ့အခါမှပဲ client bundle ထဲမှာ ထည့်သွင်းနိုင်စေပါတယ်။ ဥပမာ — user က modal တစ်ခုကို ဖွင့်ဖို့ click လုပ်တဲ့အထိ modal ရဲ့ loading ကို ရွှေ့ဆိုင်းထားချင်နိုင်ပါတယ်။

Next.js မှာ lazy loading ကို အကောင်အထည်ဖော်ဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

1. `next/dynamic` နဲ့ [Dynamic Imports](#nextdynamic) သုံးခြင်း
2. [Suspense](https://react.dev/reference/react/Suspense) နဲ့ [`React.lazy()`](https://react.dev/reference/react/lazy) သုံးခြင်း

Default အနေနဲ့ Server Components တွေက [code split](https://developer.mozilla.org/docs/Glossary/Code_splitting) လုပ်ခံရပြီး — server ကနေ client ဆီ UI အပိုင်းတွေကို တဖြည်းဖြည်း ပို့ဖို့ [streaming](/docs/nextjs/streaming) ကို သုံးနိုင်ပါတယ်။ Lazy loading က Client Components တွေကို သက်ရောက်ပါတယ်။

## `next/dynamic`

`next/dynamic` က [`React.lazy()`](https://react.dev/reference/react/lazy) နဲ့ [Suspense](https://react.dev/reference/react/Suspense) တို့ရဲ့ ပေါင်းစပ်မှုတစ်ခုပါ။ Incremental migration အတွက် — `app` နဲ့ `pages` directories နှစ်ခုလုံးမှာ တူညီတဲ့ နည်းလမ်းအတိုင်း ပြုမူပါတယ်။

## ဥပမာများ

### Client Components တွေကို Import လုပ်ခြင်း

```jsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Client Components:
const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })

export default function ClientComponentExample() {
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      {/* ချက်ချင်း load လုပ်ပါ၊ ဒါပေမယ့် client bundle သီးခြားစီမှာ */}
      <ComponentA />

      {/* လိုအပ်မှသာ — condition ပြည့်မှီတဲ့အခါ/အချိန်မှာ load လုပ်ပါ */}
      {showMore && <ComponentB />}
      <button onClick={() => setShowMore(!showMore)}>Toggle</button>

      {/* Client ပေါ်မှာပဲ load လုပ်ပါ */}
      <ComponentC />
    </div>
  )
}
```

> **မှတ်ချက်** — Server Component တစ်ခုက Client Component တစ်ခုကို dynamically import လုပ်တဲ့အခါ — automatic [code splitting](https://developer.mozilla.org/docs/Glossary/Code_splitting) က လက်ရှိမှာ **support မလုပ်ပါဘူး**။

### SSR ကို ကျော်လိုက်ခြင်း

`React.lazy()` နဲ့ Suspense ကို သုံးတဲ့အခါ — Client Components တွေက default အနေနဲ့ [prerender](https://github.com/reactwg/server-components/discussions/4) (SSR) လုပ်ခံရပါတယ်။

> **မှတ်ချက်** — `ssr: false` option က Client Components တွေအတွက်ပဲ အလုပ်လုပ်ပါတယ် — client code-splitting ကောင်းကောင်း အလုပ်လုပ်ဖို့ ဒါကို Client Components တွေထဲ ရွှေ့ထည့်ပါ။

Client Component တစ်ခုအတွက် prerendering ကို disable လုပ်ချင်ရင် — `ssr` option ကို `false` အဖြစ် သတ်မှတ်သုံးနိုင်ပါတယ်:

```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

### Server Components တွေကို Import လုပ်ခြင်း

Server Component တစ်ခုကို dynamically import လုပ်ရင် — Server Component ကိုယ်တိုင် မဟုတ်ဘဲ — Server Component ရဲ့ children တွေဖြစ်တဲ့ Client Components တွေကိုပဲ lazy-load လုပ်ပါလိမ့်မယ်။
Server Components တွေမှာ သုံးတဲ့အခါ CSS လို static assets တွေကို preload လုပ်ဖို့လည်း ကူညီပေးပါတယ်။

```jsx
import dynamic from 'next/dynamic'

// Server Component:
const ServerComponent = dynamic(() => import('../components/ServerComponent'))

export default function ServerComponentExample() {
  return (
    <div>
      <ServerComponent />
    </div>
  )
}
```

> **မှတ်ချက်** — `ssr: false` option က Server Components တွေမှာ support မလုပ်ပါဘူး။ Server Components တွေမှာ သုံးကြည့်ရင် error တစ်ခု တွေ့ရပါလိမ့်မယ်။
> Server Components တွေမှာ `next/dynamic` နဲ့ `ssr: false` ကို ခွင့်မပြုပါဘူး။ ဒါကို Client Component တစ်ခုထဲ ရွှေ့ထည့်ပေးပါ။

### External Libraries တွေကို Load လုပ်ခြင်း

External libraries တွေကို [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) function သုံးပြီး on demand load လုပ်နိုင်ပါတယ်။ ဒီဥပမာက fuzzy search အတွက် external library `fuse.js` ကို သုံးထားပါတယ်။ Module ကို user က search input ထဲ စာရိုက်ပြီးမှပဲ client ပေါ်မှာ load လုပ်ပါတယ်။

```jsx
'use client'

import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // fuse.js ကို dynamically load လုပ်ပါ
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

### Custom loading component တစ်ခု ထည့်ခြင်း

```jsx
'use client'

import dynamic from 'next/dynamic'

const WithCustomLoading = dynamic(
  () => import('../components/WithCustomLoading'),
  {
    loading: () => <p>Loading...</p>,
  }
)

export default function Page() {
  return (
    <div>
      {/* <WithCustomLoading/> က loading ဖြစ်နေချိန်မှာ loading component ကို render လုပ်ပါမယ် */}
      <WithCustomLoading />
    </div>
  )
}
```

### Named Exports တွေကို Import လုပ်ခြင်း

Named export တစ်ခုကို dynamically import လုပ်ဖို့ — [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) function က ပြန်ပေးတဲ့ Promise ကနေ ပြန်ထုတ်ပေးနိုင်ပါတယ်:

```jsx
'use client'

export function Hello() {
  return <p>Hello!</p>
}
```

```jsx
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

## Magic Comments များ

Next.js က dynamic imports တွေကို bundler က ဘယ်လို ကိုင်တွယ်လဲဆိုတာ ထိန်းချုပ်ဖို့ magic comments တွေကို support လုပ်ပါတယ်။ ဒီ comments တွေက dynamic `import()`, `require()`, `require.resolve()` နဲ့ `new Worker()` expressions တွေနဲ့ အလုပ်လုပ်ပါတယ်။

> **သိထားသင့်သည်** — Magic comments တွေက static `import` statements တွေနဲ့ အလုပ်မလုပ်ပါဘူး (`import x from 'y'`)။ Dynamic expressions တွေနဲ့ပဲ အလုပ်လုပ်ပါတယ်။

### `webpackIgnore` / `turbopackIgnore`

Dynamic import တစ်ခုကို bundling ကနေ ကျော်ဖို့ ဒီ comments တွေကို သုံးပါ။ Import expression က output ထဲမှာ မူလအတိုင်း ကျန်ရစ်ပြီး — runtime-only modules တွေအတွက် အသုံးဝင်ပါတယ်:

```js
// Bundling ကို ကျော်ပါ - import က runtime မှာ ဖြစ်ပါတယ်
const runtime = await import(/* webpackIgnore: true */ 'runtime-module')

// Turbopack-specific variant
const plugin = await import(/* turbopackIgnore: true */ pluginPath)

// require နဲ့လည်း အလုပ်လုပ်ပါတယ်
const mod = require(/* webpackIgnore: true */ 'runtime-module')
```

### `turbopackOptional` (Turbopack မှာပဲ)

Module တစ်ခု ရှိမှ ရှိမယ်ဆိုတဲ့ အခြေအနေမှာ — build errors တွေကို နှိမ်နင်းဖို့ ဒီ comment ကို သုံးပါ။ Module ပျောက်နေရင် import က runtime မှာ ဆက်ပြီး throw လုပ်ပါဦးမယ်:

```js
// './optional-feature' မရှိရင် build error မဖြစ်ပါဘူး
// Run လုပ်ရင် runtime မှာ MODULE_NOT_FOUND throw ဖြစ်ပါလိမ့်မယ်
const feature = await import(/* turbopackOptional: true */ './optional-feature')

// require နဲ့လည်း အလုပ်လုပ်ပါတယ်
const mod = require(/* turbopackOptional: true */ './optional-module')
```

ဒါက အောက်ပါတို့အတွက် အသုံးဝင်ပါတယ်:

- Install မဖြစ်နိုင်တဲ့ conditional features တွေ
- Modules တွေ optional ဖြစ်တဲ့ plugin systems တွေ
- File အချို့ မရှိသေးတဲ့ gradual migrations တွေ

> **သိထားသင့်သည်** — `webpackOptional` က support မလုပ်ပါဘူး။ Turbopack သုံးတဲ့အခါ `turbopackOptional` ကို အစား သုံးပါ။
