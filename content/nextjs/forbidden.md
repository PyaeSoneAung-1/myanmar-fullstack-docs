---
title: "forbidden function (403 Forbidden page ပြသရန် error throw လုပ်ခြင်း)"
description: "forbidden() — authorization (ခွင့်ပြုချက်) errors များအတွက် Next.js 403 page render စေရန် NEXT_HTTP_ERROR_FALLBACK;403 error ကို throw လုပ်သော function; experimental authInterrupts config ဖွင့်နည်း၊ Server Components, Server Functions, Route Handlers များတွင် အသုံးပြုပုံနှင့် streaming ပြီးနောက် ခေါ်ခြင်း, role-based route protection, Server Actions mutations ဥပမာများ"
order: 146
source: "https://nextjs.org/docs/app/api-reference/functions/forbidden"
status: translated
updated: 2026-09-03
---

`forbidden` function က — Next.js ရဲ့ 403 page တစ်ခုကို render လုပ်စေမယ့် error တစ်ခုကို throw လုပ်ပါတယ်။ သင့် application ထဲက authorization (ခွင့်ပြုချက် စစ်ဆေးခြင်း) errors တွေကို ကိုင်တွယ်ဖို့ အသုံးဝင်ပါတယ်။ UI ကို [`forbidden.js` file](/docs/nextjs/file-conventions-forbidden) နဲ့ စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

`forbidden()` ကို ခေါ်လိုက်တဲ့အခါ `NEXT_HTTP_ERROR_FALLBACK;403` error တစ်ခု throw ဖြစ်ပြီး — အဲဒီ error ကို throw လုပ်လိုက်တဲ့ route segment ရဲ့ rendering ကို ရပ်တန့်လိုက်ပါတယ်။ ဒါ့အပြင် Next.js က `<meta name="robots" content="noindex" />` tag တစ်ခုကိုပါ ထည့်ပေးလို့ — page ကို search engine တွေမှာ index လုပ်မှာ မဟုတ်ပါဘူး။ ဒါက throw လုပ်ခြင်းအားဖြင့် အလုပ်လုပ်တာမို့ — render path ထဲမှာ ခေါ်ပါ: component တစ်ခု၊ သို့မဟုတ် component တစ်ခုက `await` လုပ်တဲ့ function တစ်ခုအတွင်းမှာ ခေါ်ပါ။ Un-awaited promise တစ်ခုထဲမှာ ချန်ထားခဲ့ရင် — ဘယ်နေရာကမှ catch မလုပ်တဲ့ နေရာမှာ throw ဖြစ်ပြီး — forbidden UI က render ဖြစ်မှာ မဟုတ်ပါဘူး။

`forbidden` ကို စသုံးဖို့ — သင့် `next.config.js` file ထဲမှာ experimental (စမ်းသပ်ဆဲ) [`authInterrupts`](https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts) configuration option ကို ဖွင့်ပေးရပါမယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  experimental: {
    authInterrupts: true,
  },
}
```

`forbidden` ကို [Server Components](/docs/nextjs/server-client-components), [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ [Route Handlers](/docs/nextjs/file-conventions-route) တွေမှာ ခေါ်နိုင်ပါတယ်။

```tsx filename="app/admin/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // Check if the user has the 'admin' role
  if (session.role !== 'admin') {
    forbidden()
  }

  // Render the admin page for authorized users
  return <></>
}
```

```jsx filename="app/admin/page.js" switcher
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // Check if the user has the 'admin' role
  if (session.role !== 'admin') {
    forbidden()
  }

  // Render the admin page for authorized users
  return <></>
}
```

## သိထားသင့်သည် (Good to know)

- `forbidden` function ကို [root layout](/docs/nextjs/file-conventions-layout) ထဲမှာ ခေါ်လို့ မရပါဘူး။
- `return forbidden()` လို့ ရေးဖို့ မလိုပါဘူး။ ဒါက throw လုပ်တာမို့ (TypeScript ရဲ့ [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) return type) — execution က ရပ်သွားပါတယ်။ ခေါ်တဲ့ နေရာကို `try/catch` နဲ့ ဝိုင်းထားရင် interrupt ကို ဖိနှိပ်လိုက်လို့ forbidden UI က render မဖြစ်တော့ပါဘူး။ ဒါကို ဖြတ်သန်းခွင့်ပေးဖို့ [`unstable_rethrow`](/docs/nextjs/unstable-rethrow) ကို သုံးပါ။
- Un-awaited promise တစ်ခုထဲမှာ ချန်ထားခဲ့တဲ့ `forbidden()` က — ဘယ်နေရာကမှ catch မလုပ်တဲ့ နေရာမှာ throw ဖြစ်လို့ forbidden UI က render မဖြစ်ပါဘူး။ Development မှာ server က `⨯ unhandledRejection: NEXT_HTTP_ERROR_FALLBACK;403` လို့ log တက်ပါတယ်။ ဒါကို ခေါ်နိုင်တဲ့ function ကို အမြဲ `await` လုပ်ပါ။

## ဥပမာများ

### Streaming စတင်ပြီးမှ `forbidden()` ခေါ်ခြင်း (Calling `forbidden()` after streaming has started)

Page ရဲ့ shell နဲ့ loading UI တွေကို session စစ်ဆေးနေချိန်မှာ မြင်နေရစေဖို့ — role check ကို data တွေကို load လုပ်တဲ့ [Data Access Layer](/docs/nextjs/authentication) function ထဲမှာ ထည့်ပြီး — [`<Suspense>`](https://react.dev/reference/react/Suspense) နဲ့ wrap လုပ်ထားတဲ့ component တစ်ခုထဲမှာ render လုပ်ပါ။ Check က boundary အတွင်းမှာ run တာမို့ — session ပြီးဆုံးချိန်အထိ shell က streaming ဖြစ်နေပါလိမ့်မယ်:

```tsx filename="app/projects/page.tsx" switcher highlight={8}
import { Suspense } from 'react'
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

async function getProjects() {
  const session = await verifySession()
  if (session?.role !== 'admin') {
    forbidden()
  }
  return db.projects.findMany()
}

async function Projects() {
  const projects = await getProjects()
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projects</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Projects />
      </Suspense>
    </main>
  )
}
```

```jsx filename="app/projects/page.js" switcher highlight={8}
import { Suspense } from 'react'
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

async function getProjects() {
  const session = await verifySession()
  if (session?.role !== 'admin') {
    forbidden()
  }
  return db.projects.findMany()
}

async function Projects() {
  const projects = await getProjects()
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projects</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Projects />
      </Suspense>
    </main>
  )
}
```

Session မှာ access မရှိဘူးဆိုရင် — `getProjects` က `forbidden()` ကို ခေါ်ပြီး throw ဖြစ်သွားပါတယ်။ ဒါက rendering ကာလအတွင်းမှာ ဖြစ်တာမို့ — page shell ကို ပို့လိုက်ပြီးသား ဖြစ်တောင်မှ — exception က အနီးဆုံး [`forbidden`](/docs/nextjs/file-conventions-forbidden) boundary ဆီ ပျံ့နှံ့သွားပြီး — stream လုပ်ထားတဲ့ content ရဲ့ နေရာမှာ အစားထိုး render လုပ်ပါတယ်။

အဲဒီ UI ကို သတ်မှတ်ဖို့ route နဲ့အတူ `forbidden.tsx` file တစ်ခု ထည့်ပါ:

```tsx filename="app/projects/forbidden.tsx" switcher
export default function Forbidden() {
  return (
    <main>
      <h1>403 - Forbidden</h1>
      <p>You don't have access to this page.</p>
    </main>
  )
}
```

```jsx filename="app/projects/forbidden.js" switcher
export default function Forbidden() {
  return (
    <main>
      <h1>403 - Forbidden</h1>
      <p>You don't have access to this page.</p>
    </main>
  )
}
```

ဒီနည်းလမ်းရဲ့ အလျှော့အတင်းကတော့ HTTP status code ပါ။ ဘာကြောင့်လဲဆိုတော့ — စစ်ဆေးမှုက `<Suspense>` boundary အတွင်းမှာ run တာမို့ — response က `200` အနေနဲ့ streaming စတင်နေပြီး — streaming စပြီးတာနဲ့ status ကို ပြောင်းလို့ မရတော့လို့ပါ။ Page တစ်ခုအတွက်တော့ ဒါက ပုံမှန် အဆင်ပြေပါတယ် — user က `forbidden` UI ကို ဘယ်လိုပဲဖြစ်ဖြစ် မြင်ရတာပါပဲ။ တကယ့် `403` status တစ်ခု ပြန်ပို့ချင်ရင်တော့ — စစ်ဆေးမှုက response streaming မစခင် run ဖို့ လိုပါတယ်။ [Cache Components](/docs/nextjs/caching) တွေနဲ့ဆိုရင် — dynamic route တိုင်းက static shell တစ်ခုကို အရင်ဆုံး stream လုပ်တာမို့ — ဒီစစ်ဆေးမှုကို [`proxy`](/docs/nextjs/file-conventions-proxy) ထဲမှာ လုပ်ပါ။ [Status codes](/docs/nextjs/file-conventions-loading) ကို ကြည့်ပါ။

### Role အလိုက် route ကာကွယ်ခြင်း (Role-based route protection)

User roles တွေအပေါ် မူတည်ပြီး — တချို့ routes တွေဆီ ဝင်ရောက်ခွင့်ကို ကန့်သတ်ဖို့ `forbidden` ကို သုံးနိုင်ပါတယ်။ ဒါက authenticated ဖြစ်ပေမယ့် — လိုအပ်တဲ့ permissions မရှိတဲ့ users တွေ route ဆီ ဝင်လို့မရအောင် သေချာစေပါတယ်။

```tsx filename="app/admin/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // Check if the user has the 'admin' role
  if (session.role !== 'admin') {
    forbidden()
  }

  // Render the admin page for authorized users
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </main>
  )
}
```

```jsx filename="app/admin/page.js" switcher
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // Check if the user has the 'admin' role
  if (session.role !== 'admin') {
    forbidden()
  }

  // Render the admin page for authorized users
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </main>
  )
}
```

### Server Actions တွေနဲ့ Mutations လုပ်ခြင်း (Mutations with Server Actions)

Server Actions တွေမှာ mutations (ဒေတာ ပြောင်းလဲမှုများ) ကို အကောင်အထည်ဖော်တဲ့အခါ — specific role တစ်ခုရှိတဲ့ users တွေပဲ sensitive data တွေကို update လုပ်ခွင့်ရအောင် `forbidden` ကို သုံးနိုင်ပါတယ်။

```ts filename="app/actions/update-role.ts" switcher
'use server'

import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'
import db from '@/app/lib/db'

export async function updateRole(formData: FormData) {
  const session = await verifySession()

  // Ensure only admins can update roles
  if (session.role !== 'admin') {
    forbidden()
  }

  // Perform the role update for authorized users
  // ...
}
```

```js filename="app/actions/update-role.js" switcher
'use server'

import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'
import db from '@/app/lib/db'

export async function updateRole(formData) {
  const session = await verifySession()

  // Ensure only admins can update roles
  if (session.role !== 'admin') {
    forbidden()
  }

  // Perform the role update for authorized users
  // ...
}
```

## Version History

| Version   | အပြောင်းအလဲ               |
| --------- | --------------------------- |
| `v15.1.0` | `forbidden` ကို စတင် မိတ်ဆက်။ |
