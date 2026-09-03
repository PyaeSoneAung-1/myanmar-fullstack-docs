---
title: "unauthorized function (401 Unauthorized page ပြသရန် error throw လုပ်ခြင်း)"
description: "unauthorized() — authentication (အကောင့်ဝင်ခြင်း) errors များအတွက် Next.js 401 page render စေရန် NEXT_HTTP_ERROR_FALLBACK;401 error ကို throw လုပ်သော function; experimental authInterrupts config ဖွင့်နည်း၊ Server Components, Server Functions, Route Handlers များတွင် အသုံးပြုပုံနှင့် streaming ပြီးနောက် ခေါ်ခြင်း, unauthenticated users များအတွက် login UI ပြသခြင်း, Server Actions mutations, Route Handlers data fetching ဥပမာများ"
order: 147
source: "https://nextjs.org/docs/app/api-reference/functions/unauthorized"
status: translated
updated: 2026-09-03
---

`unauthorized` function က — Next.js ရဲ့ 401 page တစ်ခုကို render လုပ်စေမယ့် error တစ်ခုကို throw လုပ်ပါတယ်။ Request တစ်ခု sign in မလုပ်ရသေးတဲ့အခါ (authentication error) တွေကို ကိုင်တွယ်ဖို့ အသုံးဝင်ပါတယ်။ UI ကို [`unauthorized.js` file](/docs/nextjs/file-conventions-unauthorized) နဲ့ စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

`unauthorized()` ကို ခေါ်လိုက်တဲ့အခါ `NEXT_HTTP_ERROR_FALLBACK;401` error တစ်ခု throw ဖြစ်ပြီး — အဲဒီ error ကို throw လုပ်လိုက်တဲ့ route segment ရဲ့ rendering ကို ရပ်တန့်လိုက်ပါတယ်။ ဒါ့အပြင် Next.js က `<meta name="robots" content="noindex" />` tag တစ်ခုကိုပါ ထည့်ပေးလို့ — page ကို search engine တွေမှာ index လုပ်မှာ မဟုတ်ပါဘူး။ ဒါက throw လုပ်ခြင်းအားဖြင့် အလုပ်လုပ်တာမို့ — render path ထဲမှာ ခေါ်ပါ: component တစ်ခု၊ သို့မဟုတ် component တစ်ခုက `await` လုပ်တဲ့ function တစ်ခုအတွင်းမှာ ခေါ်ပါ။ Un-awaited promise တစ်ခုထဲမှာ ချန်ထားခဲ့ရင် — ဘယ်နေရာကမှ catch မလုပ်တဲ့ နေရာမှာ throw ဖြစ်ပြီး — unauthorized UI က render ဖြစ်မှာ မဟုတ်ပါဘူး။

`unauthorized` ကို စသုံးဖို့ — သင့် `next.config.js` file ထဲမှာ experimental (စမ်းသပ်ဆဲ) [`authInterrupts`](https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts) configuration option ကို ဖွင့်ပေးရပါမယ်:

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

`unauthorized` ကို [Server Components](/docs/nextjs/server-client-components), [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ [Route Handlers](/docs/nextjs/file-conventions-route) တွေမှာ ခေါ်နိုင်ပါတယ်။

```tsx filename="app/dashboard/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  // Render the dashboard for authenticated users
  return (
    <main>
      <h1>Welcome to the Dashboard</h1>
      <p>Hi, {session.user.name}.</p>
    </main>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  // Render the dashboard for authenticated users
  return (
    <main>
      <h1>Welcome to the Dashboard</h1>
      <p>Hi, {session.user.name}.</p>
    </main>
  )
}
```

## သိထားသင့်သည် (Good to know)

- `unauthorized` function ကို [root layout](/docs/nextjs/file-conventions-layout) ထဲမှာ ခေါ်လို့ မရပါဘူး။
- `return unauthorized()` လို့ ရေးဖို့ မလိုပါဘူး။ ဒါက throw လုပ်တာမို့ (TypeScript ရဲ့ [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) return type) — execution က ရပ်သွားပါတယ်။ ခေါ်တဲ့ နေရာကို `try/catch` နဲ့ ဝိုင်းထားရင် interrupt ကို ဖိနှိပ်လိုက်လို့ unauthorized UI က render မဖြစ်တော့ပါဘူး။ ဒါကို ဖြတ်သန်းခွင့်ပေးဖို့ [`unstable_rethrow`](/docs/nextjs/unstable-rethrow) ကို သုံးပါ။
- Un-awaited promise တစ်ခုထဲမှာ ချန်ထားခဲ့တဲ့ `unauthorized()` က — ဘယ်နေရာကမှ catch မလုပ်တဲ့ နေရာမှာ throw ဖြစ်လို့ unauthorized UI က render မဖြစ်ပါဘူး။ Development မှာ server က `⨯ unhandledRejection: NEXT_HTTP_ERROR_FALLBACK;401` လို့ log တက်ပါတယ်။ ဒါကို ခေါ်နိုင်တဲ့ function ကို အမြဲ `await` လုပ်ပါ။

## ဥပမာများ

### Streaming စတင်ပြီးမှ `unauthorized()` ခေါ်ခြင်း (Calling `unauthorized()` after streaming has started)

Page ရဲ့ shell နဲ့ loading UI တွေကို session စစ်ဆေးနေချိန်မှာ မြင်နေရစေဖို့ — auth check ကို data တွေကို load လုပ်တဲ့ [Data Access Layer](/docs/nextjs/authentication) function ထဲမှာ ထည့်ပြီး — [`<Suspense>`](https://react.dev/reference/react/Suspense) နဲ့ wrap လုပ်ထားတဲ့ component တစ်ခုထဲမှာ render လုပ်ပါ။ Check က boundary အတွင်းမှာ run တာမို့ — session ပြီးဆုံးချိန်အထိ shell က streaming ဖြစ်နေပါလိမ့်မယ်:

```tsx filename="app/account/page.tsx" switcher highlight={8}
import { Suspense } from 'react'
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

async function getAccount() {
  const session = await verifySession()
  if (!session) {
    unauthorized()
  }
  return db.accounts.findByUserId(session.userId)
}

async function AccountDetails() {
  const account = await getAccount()
  return <p>Signed in as {account.email}</p>
}

export default function AccountPage() {
  return (
    <main>
      <h1>Account</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  )
}
```

```jsx filename="app/account/page.js" switcher highlight={8}
import { Suspense } from 'react'
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

async function getAccount() {
  const session = await verifySession()
  if (!session) {
    unauthorized()
  }
  return db.accounts.findByUserId(session.userId)
}

async function AccountDetails() {
  const account = await getAccount()
  return <p>Signed in as {account.email}</p>
}

export default function AccountPage() {
  return (
    <main>
      <h1>Account</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  )
}
```

Request က sign in မလုပ်ရသေးဘူးဆိုရင် — `getAccount` က `unauthorized()` ကို ခေါ်ပြီး throw ဖြစ်သွားပါတယ်။ ဒါက rendering ကာလအတွင်းမှာ ဖြစ်တာမို့ — page shell ကို ပို့လိုက်ပြီးသား ဖြစ်တောင်မှ — exception က အနီးဆုံး [`unauthorized`](/docs/nextjs/file-conventions-unauthorized) boundary ဆီ ပျံ့နှံ့သွားပြီး — stream လုပ်ထားတဲ့ content ရဲ့ နေရာမှာ အစားထိုး render လုပ်ပါတယ်။

အဲဒီ UI ကို သတ်မှတ်ဖို့ route နဲ့အတူ `unauthorized.tsx` file တစ်ခု ထည့်ပါ:

```tsx filename="app/account/unauthorized.tsx" switcher
import Link from 'next/link'

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>
        Please <Link href="/login">sign in</Link> to view your account.
      </p>
    </main>
  )
}
```

```jsx filename="app/account/unauthorized.js" switcher
import Link from 'next/link'

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>
        Please <Link href="/login">sign in</Link> to view your account.
      </p>
    </main>
  )
}
```

ဒီနည်းလမ်းရဲ့ အလျှော့အတင်းကတော့ HTTP status code ပါ။ ဘာကြောင့်လဲဆိုတော့ — စစ်ဆေးမှုက `<Suspense>` boundary အတွင်းမှာ run တာမို့ — response က `200` အနေနဲ့ streaming စတင်နေပြီး — streaming စပြီးတာနဲ့ status ကို ပြောင်းလို့ မရတော့လို့ပါ။ Page တစ်ခုအတွက်တော့ ဒါက ပုံမှန် အဆင်ပြေပါတယ် — user က `unauthorized` UI ကို ဘယ်လိုပဲဖြစ်ဖြစ် မြင်ရတာပါပဲ။ တကယ့် `401` status တစ်ခု ပြန်ပို့ချင်ရင်တော့ — စစ်ဆေးမှုက response streaming မစခင် run ဖို့ လိုပါတယ်။ [Cache Components](/docs/nextjs/caching) တွေနဲ့ဆိုရင် — dynamic route တိုင်းက static shell တစ်ခုကို အရင်ဆုံး stream လုပ်တာမို့ — ဒီစစ်ဆေးမှုကို [`proxy`](/docs/nextjs/file-conventions-proxy) ထဲမှာ လုပ်ပါ။ [Status codes](/docs/nextjs/file-conventions-loading) ကို ကြည့်ပါ။

### Unauthenticated users တွေကို login UI ပြသခြင်း (Displaying login UI to unauthenticated users)

`unauthorized` function ကို သုံးပြီး — login UI တစ်ခုပါတဲ့ `unauthorized.js` file ကို ပြသနိုင်ပါတယ်။

```tsx filename="app/dashboard/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  return <div>Dashboard</div>
}
```

```jsx filename="app/dashboard/page.js" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  return <div>Dashboard</div>
}
```

```tsx filename="app/unauthorized.tsx" switcher
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

```jsx filename="app/unauthorized.js" switcher
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

### Server Actions တွေနဲ့ Mutations လုပ်ခြင်း (Mutations with Server Actions)

Server Actions တွေထဲမှာ `unauthorized` ကို ခေါ်ပြီး — authenticated users တွေပဲ specific mutations တွေကို လုပ်ဆောင်ခွင့်ရှိအောင် သေချာစေနိုင်ပါတယ်။

```ts filename="app/actions/update-profile.ts" switcher
'use server'

import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'
import db from '@/app/lib/db'

export async function updateProfile(data: FormData) {
  const session = await verifySession()

  // If the user is not authenticated, return a 401
  if (!session) {
    unauthorized()
  }

  // Proceed with mutation
  // ...
}
```

```js filename="app/actions/update-profile.js" switcher
'use server'

import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'
import db from '@/app/lib/db'

export async function updateProfile(data) {
  const session = await verifySession()

  // If the user is not authenticated, return a 401
  if (!session) {
    unauthorized()
  }

  // Proceed with mutation
  // ...
}
```

### Route Handlers တွေနဲ့ data fetching လုပ်ခြင်း (Fetching data with Route Handlers)

Route Handlers တွေမှာ `unauthorized` ကို သုံးပြီး — authenticated users တွေပဲ endpoint ကို ဝင်ရောက်ခွင့်ရှိအောင် သေချာစေနိုင်ပါတယ်။

```ts filename="app/api/profile/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify the user's session
  const session = await verifySession()

  // If no session exists, return a 401 and render unauthorized.tsx
  if (!session) {
    unauthorized()
  }

  // Fetch data
  // ...
}
```

```jsx filename="app/api/profile/route.js" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export async function GET() {
  const session = await verifySession()

  // If the user is not authenticated, return a 401 and render unauthorized.tsx
  if (!session) {
    unauthorized()
  }

  // Fetch data
  // ...
}
```

## Version History

| Version   | အပြောင်းအလဲ                  |
| --------- | ------------------------------ |
| `v15.1.0` | `unauthorized` ကို စတင် မိတ်ဆက်။ |
