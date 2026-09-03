---
title: "Authentication with Cache Components (Cache Components နဲ့ authentication အကောင်အထည်ဖော်ခြင်း)"
description: "Cache Components enable လုပ်ထားချိန်မှာ authentication အကောင်အထည်ဖော်နည်း — session ကို request time မှာ ဖတ်ခြင်း, authenticated UI ကို streaming လုပ်ခြင်း, session ကရတဲ့ data တွေကို cache လုပ်ခြင်း နဲ့ authenticated navigations တွေကို instant ဖြစ်အောင် ထိန်းသိမ်းခြင်း"
order: 223
source: "https://nextjs.org/docs/app/guides/authentication-with-cache-components"
status: translated
updated: 2026-09-03
---

[Cache Components](/docs/nextjs/caching) enable လုပ်ထားတဲ့အခါ — session ဖတ်ခြင်းက request time မှာ ဖြစ်ပွားတာမို့ — static shell ထဲမှာ prerender (ကြိုတင် render) လုပ်လို့ မရပါဘူး။ Authenticated UI တွေက `<Suspense>` boundary နောက်ကနေ stream ဝင်လာပြီး — session ကနေ ဆင်းသက်လာတဲ့ data တွေကိုတော့ ဆက်လက် cache လုပ်နိုင်ပါသေးတယ်။

ဒီ guide ထဲက ဥပမာတွေက [iron-session](https://github.com/vvo/iron-session) ကို encrypted cookie sessions (စာဝှက်ထားတဲ့ cookie session များ) အတွက် သုံးထားပေမယ့် — pattern တွေက session (သို့) authentication library ဘယ်ဟာနဲ့မဆို သက်ရောက်ပါတယ်။ Run လို့ရတဲ့ ပုံစံအပြည့်အစုံအတွက် [with-iron-session-cache-components example](https://github.com/vercel/next.js/tree/canary/examples/with-iron-session-cache-components) ကို ကြည့်ပါ။

## ကြိုတင်လိုအပ်ချက်များ (Prerequisites)

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို enable လုပ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

ဒီ guide က Cache Components နဲ့ authentication အတွက် code pattern တွေကို လွှမ်းခြုံပါတယ် — request time မှာ session ဖတ်ခြင်း၊ authenticated UI တွေကို streaming လုပ်ခြင်း၊ ပြီးတော့ session ကရတဲ့ data တွေကို cache လုပ်ခြင်း။ Cache Components ကို ရင်းနှီးပြီးသားလို့ ယူဆထားပါတယ် (မသိသေးရင် [Caching](/docs/nextjs/caching) ကို အရင်ဖတ်ပါ) — ပြီးတော့ login လုပ်တဲ့အခါ session တစ်ခု သတ်မှတ်ပြီးသားလည်း ဖြစ်ရပါမယ်။

ဒါတွေကို အခြေခံထားတဲ့ အခြေခံသဘောတရားတွေအတွက် — guide နှစ်ခုကို အကြံပြုပါတယ်:

- [Authentication](/docs/nextjs/authentication) — sign-up, login, session management, authorization နဲ့ Data Access Layer တွေကို လွှမ်းခြုံပါတယ်။
- [Data Security](/docs/nextjs/data-security) — data access တွေကို server ပေါ်မှာ ထားပြီး sensitive data တွေကို client ဆီ မရောက်အောင် ကာကွယ်တာတွေကို လွှမ်းခြုံပါတယ်။

## ရှိပြီးသား app တစ်ခုကို ပြောင်းရွှေ့ခြင်း (Migrating an existing app)

Cache Components enable လုပ်ထားတဲ့အခါ — instant navigation validation က session ကို ဖတ်တဲ့ route တိုင်းကို flag (အမှတ်အသား) တင်ပါတယ်။ ဘာလို့လဲဆိုတော့ — request read တစ်ခုက static shell ထဲမှာ prerender လုပ်လို့ မရလို့ပါ။ ဒါပေမယ့် အကုန်လုံးကို shipping မလုပ်ခင် ဖြေရှင်းစရာ မလိုပါဘူး။ Page (သို့) layout ပေါ်မှာ [`export const instant = false`](/docs/nextjs/instant-navigation) သတ်မှတ်ပြီး — server ပေါ်မှာ ဆက်ပြီး blocking ဖြစ်နေအောင် ထားနိုင်ပြီး — အောက်က pattern တွေကို route တစ်ခုချင်းစီအလိုက် ကျင့်သုံးနိုင်ပါတယ်။ Migration workflow အပြည့်အစုံအတွက် [Migrating to Cache Components](/docs/nextjs/migrating-to-cache-components) ကို ကြည့်ပါ။

## အဆင့် 1: လက်ရှိ user ကို ဖတ်ခြင်း (Read the current user)

လက်ရှိ user ကို ဖတ်တယ်ဆိုတာ — session cookie ကို ဖတ်ပြီး user ကို ရှာဖွေတာပါ။ Request read တစ်ခုက static shell ရဲ့ အစိတ်အပိုင်း မဖြစ်နိုင်တာမို့ — [`<Suspense>`](/docs/nextjs/file-conventions-loading) boundary နောက်မှာ အမြဲ ရှိနေပြီး — navigation တိုင်းမှာ stream ဝင်ပါတယ်။

User session တစ်ခုက အချိန်ကာလတစ်ခုအထိ သက်တမ်းရှိတာမို့ — cache lifetime တစ်ခု ထည့်ပေးလိုက်ရင် framework က အဲဒီ content တွေကို ကြိုတင်ပြီး prefetch လုပ်နိုင်ပါတယ်။

ဒါပေမယ့် server-side directives တွေက အဲဒီ lifetime ကို ပေးလို့ မရပါဘူး — ရိုးရိုး [`use cache`](/docs/nextjs/use-cache) ရော [`use cache: remote`](/docs/nextjs/use-cache-remote) ရော `cookies()` ကို ခေါ်လို့ မရသလို — [တန်ဖိုးကို ထုတ်ယူပြီး ထည့်ပေးခြင်း](/docs/nextjs/caching) ကလည်း မဖြစ်နိုင်ပါဘူး။ ဘာကြောင့်လဲဆိုတော့:

- Session helper တစ်ခုက cookie ကို သူ့ကိုယ်ပိုင် code ရဲ့ အတွင်းထဲမှာ ဖတ်တာမို့ — အပြင်ကို ဆွဲထုတ်စရာ (lift out) ဘာမှ မရှိပါဘူး။
- Session ကို validate လုပ်တာက token ရဲ့ expiry ကို လက်ရှိအချိန်နဲ့ ယှဉ်ကြည့်တာမို့ (iron-session ရဲ့ `unsealData` က expired seal တစ်ခုကို reject လုပ်ပါတယ်) — ဖတ်ခြင်းက request နဲ့ အချိန်ပေါ် မူတည်နေပါတယ်။

အဲဒါကြောင့်ပဲ [`use cache: private`](/docs/nextjs/use-cache-private) ရှိတာပါ — ဒါက `cookies()` နဲ့ `headers()` တွေကို တိုက်ရိုက် ဖတ်ပြီး — ရလဒ်ကို browser ထဲမှာပဲ သိမ်းထားကာ — server ပေါ်မှာ ဘယ်တော့မှ မသိမ်းပါဘူး။

Private scope တစ်ခုက browser ထဲမှာပဲ ရှိနေတာမို့ — server ပေါ်မှာ ဘယ်တော့မှ cache မလုပ်ပါဘူး။ Server ပေါ်မှာ cache လုပ်ချင်ရင်တော့ — တန်ဖိုးတစ်ခု (`userId` ဥပမာ) ကို ထုတ်ယူပြီး ရိုးရိုး [`use cache`](/docs/nextjs/use-cache) (သို့) [`use cache: remote`](/docs/nextjs/use-cache-remote) ထဲ pass လုပ်ပါ။ အဲဒီ pattern အတိုင်းပဲ session ကနေ ဆင်းသက်လာတဲ့ data တွေကိုလည်း cache လုပ်နိုင်ပါတယ် — အောက်က အဆင့် 4 မှာ ဖော်ပြထားပါတယ်။

```tsx filename="lib/session.ts"
import 'server-only'
import { cookies } from 'next/headers'
import { sealData, unsealData } from 'iron-session'

export type SessionData = {
  userId?: string
}

const COOKIE_NAME = 'app_session'
const password = process.env.SESSION_PASSWORD!

export async function getSession(): Promise<SessionData> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value
  if (!cookie) {
    return {}
  }
  return unsealData<SessionData>(cookie, { password })
}
```

```tsx filename="lib/auth.ts"
import 'server-only'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { findUserById } from './data'

export type User = {
  id: string
  name: string
}

export async function getCurrentUser(): Promise<User> {
  'use cache: private'

  const { userId } = await getSession()
  if (!userId) {
    redirect('/login')
  }

  const user = await findUserById(userId)
  if (!user) {
    redirect('/login')
  }

  return { id: user.id, name: user.name }
}
```

`redirect()` calls တွေက return value အစား — rendering ကို ရပ်တန့်ဖို့ throw လုပ်တာမို့ — cache မဖြစ်ပါဘူး။ ဖြေရှင်းပြီးသား (resolved) user တစ်ယောက်ကပဲ cache ဖြစ်ပါတယ်။

> **သိထားသင့်သည်:** [`use cache: private`](/docs/nextjs/use-cache-private) က `cookies()`, `headers()` နဲ့ `searchParams` တွေကို လက်ခံပေမယ့် — [`connection()`](/docs/nextjs/connection) ကိုတော့ မလက်ခံပါဘူး။ စာရင်းအပြည့်အစုံအတွက် [`use cache: private`](/docs/nextjs/use-cache-private) ကို ကြည့်ပါ။

## အဆင့် 2: Page ကို မပိတ်ဆို့ဘဲ user ကို ပြသခြင်း (Show the user without blocking the page)

Session ကို ဖတ်တဲ့ component တစ်ခုက [`<Suspense>`](/docs/nextjs/file-conventions-loading) boundary နောက်မှာ ရှိရပါမယ်။ Cache Components နဲ့ဆို — boundary အပြင်မှာ `cookies()` ဖတ်တာက build error တစ်ခုပါ။ Boundary က ကျန်တဲ့ page တွေကို မြန်ဆန်နေစေတဲ့ အရာလည်း ဖြစ်ပါတယ်။ Boundary အပြင်က ဘာမဆို — static ဖြစ်ဖြစ် [`use cache`](/docs/nextjs/use-cache) နဲ့ ခြုံထားပြီး ကိုယ်ပိုင် runtime data မဖတ်ဘူးဆိုရင် — [static shell](/docs/nextjs/caching) ထဲမှာ prerender ဖြစ်ပြီး ချက်ချင်း load ပါတယ်။ Boundary နောက်က section ကပဲ request ကို စောင့်ရပါတယ်။

```tsx filename="app/page.tsx"
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getAnnouncements } from '@/lib/data'

export default function Page() {
  return (
    <main>
      {/* Cache လုပ်ထားလို့ static shell ထဲမှာ prerender ဖြစ်တယ် */}
      <Announcements />

      {/* Session ကို ဖတ်တာမို့ boundary နောက်ကနေ stream ဝင်တယ် */}
      <Suspense fallback={<p>Loading your dashboard…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}

async function Announcements() {
  'use cache'
  const announcements = await getAnnouncements()
  return (
    <ul>
      {announcements.map((announcement) => (
        <li key={announcement}>{announcement}</li>
      ))}
    </ul>
  )
}

async function Dashboard() {
  const user = await getCurrentUser()
  return <h1>Welcome, {user.name}</h1>
}
```

Layout တစ်ခုရဲ့ top level မှာလည်း session ဖတ်ခြင်းကို မထားပါနဲ့။ Layout ထဲက session ပေါ်မှာ top-level `await` လုပ်တာက — `{children}` အပါအဝင် segment တစ်ခုလုံးကို အဲဒီ request နောက်မှာ ပိတ်မိနေစေပါတယ်။ ဒါကြောင့် boundary တစ်ခုအတွင်းက component တစ်ခုထဲ ထည့်ပေးပါ။ [Push dynamic access down](/docs/nextjs/streaming) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** `getCurrentUser` က session ကို ဖတ်၊ စစ်ဆေးပြီး — ကျဉ်းမြောင်းတဲ့ user တစ်ယောက်ကို ပြန်ပေးပါတယ်။ ဒီလို ဖတ်ခြင်းတွေကို function တစ်ခုတည်းမှာ စုစည်းထားတာက [Data Access Layer](/docs/nextjs/authentication) pattern ပါ။

## အဆင့် 3: User ကို components တွေကြားမှာ share လုပ်ခြင်း (Share the user across components)

User လိုအပ်တဲ့ component တိုင်းမှာ session ကို ပြန်ပြန် ဖတ်စရာ မလိုပါဘူး။ တစ်ကြိမ်ပဲ ဖတ်ပြီး — boundary တစ်ခုတည်းအတွင်းကနေ Server ရော Client Components တွေရော ဘယ်နှစ်ခုကိုမဆို လက်ဆင့်ကမ်းလိုက်ပါ။

Server Components တွေက `getCurrentUser()` ကို တိုက်ရိုက် ခေါ်နိုင်ပါတယ်။ Prop drilling မလုပ်ဘဲ Client Components တွေဆီ ရောက်အောင် — promise တစ်ခုကို တစ်ကြိမ်တည်း ဖန်တီးပြီး context ကနေတစ်ဆင့် pass ကာ — [`use()`](https://react.dev/reference/react/use) နဲ့ ဖြေလိုက်ပါ။ ယေဘုယျ pattern အတွက် [Using React's `use` within a Context Provider](/docs/nextjs/single-page-applications) ကို ကြည့်ပါ။ `getCurrentUser` က request ကို ဖတ်တာမို့ — promise ကို Suspense boundary အတွင်းမှာပဲ ဖန်တီးပါ — layout ရဲ့ ထိပ်ပိုင်းမှာ မဟုတ်ပါဘူး။

```tsx filename="app/user-provider.tsx"
'use client'

import { createContext, use } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/lib/auth'

const UserContext = createContext<Promise<User> | null>(null)

export function UserProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<User>
  children: ReactNode
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}

export function useUser() {
  const userPromise = use(UserContext)
  if (!userPromise) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return use(userPromise)
}
```

Boundary နောက်က Server Component က promise ကို ဖန်တီးပြီး — await မလုပ်ဘဲ provider ဆီ လက်ဆင့်ကမ်းပါတယ်။ Consumer တစ်ခုချင်းစီက ကိုယ့် boundary နောက်မှာ ဖြေရှင်းလို့ — shared chrome က session ကို မစောင့်ဘဲ render ဖြစ်ပါတယ်:

```tsx filename="app/page.tsx"
function Dashboard() {
  const userPromise = getCurrentUser()

  return (
    <UserProvider userPromise={userPromise}>
      <Suspense fallback={<span>Loading…</span>}>
        <UserBadge />
      </Suspense>
    </UserProvider>
  )
}
```

Client Components တွေက လက်ရှိ user ကို ရဖို့ `useUser()` ကို ခေါ်ပါတယ်။ `use()` က promise ပြီးတဲ့အထိ suspend လုပ်တာမို့ — component ကို `<Suspense>` boundary နောက်မှာ ထားပါ:

```tsx filename="app/user-badge.tsx"
'use client'

import { useUser } from './user-provider'

export function UserBadge() {
  const user = useUser()
  return <span>Signed in as {user.name}</span>
}
```

> **သိထားသင့်သည်:** Client လိုအပ်တာကိုပဲ ထုတ်ပြပါ။ `getCurrentUser` helper က raw session အစား ကျဉ်းမြောင်းတဲ့ `{ id, name }` ကို ပြန်ပေးပါတယ်။ Sensitive fields တွေ client ဆီ မရောက်အောင် — [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) ကို ကြည့်ပါ။

## အဆင့် 4: Session ကရတဲ့ data တွေကို cache လုပ်ခြင်း (Cache session-derived data)

အခုတော့ user ရှိပြီမို့ — သူ့အတွက် fetch လုပ်တဲ့ data တွေကို နည်းလမ်း နှစ်ခုနဲ့ cache လုပ်နိုင်ပါတယ်။ User id ကို ရိုးရိုး [`use cache`](/docs/nextjs/use-cache) function တစ်ခုထဲ pass လုပ်ရင် — ရလဒ်က id နဲ့ key တပ်ပြီး server ပေါ်မှာ သိမ်းပါတယ် (ဒါက [cache key](/docs/nextjs/use-cache) ရဲ့ အစိတ်အပိုင်း ဖြစ်လာပါတယ်) — နောက်ပိုင်းမှာ [`cacheTag`](/docs/nextjs/cache-tag) တစ်ခုနဲ့ invalidate လုပ်လို့ ရပါတယ်။ [`use cache: private`](/docs/nextjs/use-cache-private) scope အတွင်းမှာ ဖတ်ရင်တော့ — browser ထဲမှာပဲ သိမ်းပြီး server ပေါ်မှာ ဘယ်တော့မှ မသိမ်းပါဘူး — ဒါက ဒီ data အချို့ကို server ဘက်မှာ ခဏတောင် သိမ်းထားဖို့ မသင့်ဘူးလို့ စည်းမျဉ်းတွေက တားမြစ်ထားတဲ့အခါ အရေးကြီးပါတယ်။ ဥပမာထဲမှာတော့ — ဒီ note တွေက tag တပ်ထားပြီး ပြောင်းလဲတိုင်း refresh လုပ်တာမို့ — id ကို pass လုပ်ထားပါတယ်။

ရိုးရိုး `use cache` scope တစ်ခုက `cookies()` ကို ဖတ်လို့ မရတာမို့ — exported function က user ကို ဖြေရှင်းပြီး id ကိုပဲ cached function ဆီ pass လုပ်ပါတယ်:

```tsx filename="lib/data.ts"
import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getCurrentUser } from './auth'

export async function getNotes() {
  const user = await getCurrentUser()
  return getNotesByUserId(user.id)
}

async function getNotesByUserId(userId: string) {
  'use cache'
  cacheTag(`notes:${userId}`)
  cacheLife('minutes')

  return db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
  })
}
```

`getNotesByUserId` ကို unexported အတိုင်း ထားပါ — ဒါမှ တစ်ပါးသူက id တစ်ခု ထည့်ပြီး သူများရဲ့ notes တွေကို တောင်းခံလို့ ရမှာ မဟုတ်ပါဘူး။ Exported getter ထဲမှာ user ကို ဖြေရှင်းတာက အဲဒါကို လုံခြုံစေတဲ့ အရာပါ။ [Data Security](/docs/nextjs/data-security) ကို ကြည့်ပါ။

Notes တွေကို render လုပ်တဲ့ Server Component ကနေ ခေါ်ပါတယ်။ Pass စရာ user id မရှိဘူး — getter ထဲက `getCurrentUser()` ခေါ်တာက private cache ကို ထိမို့ — session ကို နောက်တစ်ခါ ပြန်မဖတ်တော့ပါဘူး:

```tsx filename="app/page.tsx"
async function Notes() {
  const notes = await getNotes()
  // ...
}
```

> **သိထားသင့်သည် — cache keys နဲ့ tags တွေကို plain text နဲ့ သိမ်းပါတယ်။** Cached function တစ်ခုရဲ့ arguments နဲ့ captured variables တွေကို သူ့ရဲ့ cache key ထဲ serialized လုပ်ပြီး — `cacheTag` တန်ဖိုးတွေကလည်း ရေးထားတဲ့အတိုင်း သိမ်းပါတယ်။ ဘယ်ဟာမှ hash မလုပ်ပါဘူး: default cache က ဒါတွေကို plain-text map keys နဲ့ tag lists အဖြစ် ကိုင်ထားပြီး — [remote cache](/docs/nextjs/use-cache-remote) ကလည်း အလားတူ လက်ခံပါတယ်။ User id လို တည်ငြိမ်တဲ့ identifier ပေါ်မှာ key နဲ့ tag လုပ်ပြီး — secrets နဲ့ sensitive personal data တွေ (tokens, passwords, raw emails) ကို arguments နဲ့ tags တွေထဲ မထည့်ပါနဲ့။

Server ပေါ်မှာ — ရိုးရိုး `use cache` က entry ကို memory ထဲမှာ best effort (တတ်နိုင်သမျှ) အနေနဲ့ သိမ်းပါတယ်: ဖိအား (pressure) ရှိတဲ့အခါ evict လုပ်ခံရပြီး — serverless မှာတော့ instances တွေကြား မတည်မြဲပါဘူး။ အဲဒီ data က instances နဲ့ requests တွေကြား ရှင်သန်နေဖို့ လိုရင် — တာရှည်ခံပြီး share လုပ်ထားတဲ့ storage အတွက် [`use cache: remote`](/docs/nextjs/use-cache-remote) ကို opt in လုပ်ပါ — အဲဒီမှာ [သင်ရွေးချယ်တဲ့ cache key](/docs/nextjs/use-cache-remote) က သင့် hit rate ကို မောင်းနှင်ပေးပါတယ်။

## အဆင့် 5: Session ကရတဲ့ data တွေကို update လုပ်ခြင်း (Update session-derived data)

[Server Action](https://nextjs.org/docs/app/getting-started/mutating-data) တစ်ခုက user ရဲ့ data ကို ပြောင်းလဲတဲ့အခါ — tag တူတူနဲ့ [`updateTag`](/docs/nextjs/update-tag) ခေါ်ပြီး cached entry ကို refresh လုပ်ပါ။ Action ထဲမှာ session ကို ပြန်ဖတ်ပြီး — client ကို ယုံကြည်တာမဟုတ်ဘဲ သူ့ဘာသာသူ authorize လုပ်ပါတယ်။ ဒါ ဘာကြောင့် အရေးကြီးလဲဆိုတာ [authentication with Server Actions](/docs/nextjs/authentication) မှာ ကြည့်ပါ။

```ts filename="app/actions.ts"
'use server'
import { redirect } from 'next/navigation'
import { updateTag } from 'next/cache'
import { getSession } from '@/lib/session'
import { saveNote } from '@/lib/data'

export async function addNote(formData: FormData) {
  const { userId } = await getSession()
  if (!userId) {
    redirect('/login')
  }

  const note = String(formData.get('note') ?? '').trim()
  if (note) {
    await saveNote(userId, note)
    updateTag(`notes:${userId}`)
  }
}
```

## အဆင့် 6: Authenticated navigations တွေကို instant ဖြစ်အောင် လုပ်ခြင်း (Make authenticated navigations instant)

Cached reads တွေမှာ lifetime ရှိပြီးသားမို့ — ဒါက အများစုမှာ သူ့ဘာသာသူ ဖြစ်ပါတယ်။ `use cache: private` scope တစ်ခုက ကိုယ်ပိုင် သတ်မှတ်ချက် မရှိရင် [`default` profile](/docs/nextjs/cache-life) (ငါးမိနစ် `stale`) ကို သုံးပြီး — session ဖတ်တဲ့ route တစ်ခုက authenticated content တွေပါတဲ့ session တစ်ခုချင်းစီအတွက် [App Shell](https://nextjs.org/docs/app/glossary#app-shell) တစ်ခုကို ထုတ်ပေးပါတယ် — session တစ်ခုချင်းစီအလိုက် prefetch လုပ်ပြီး cache လုပ်ထားပါတယ်။ အဲဒါဆီက navigations တွေက တကယ်တော့ instant ဖြစ်နေပါပြီ။

ဒီလို ဆက်ထိန်းထားဖို့ အချက် နှစ်ချက် ရှိပါတယ်:

- Lifetime ကို [`cacheLife`](/docs/nextjs/cache-life) နဲ့ ချိန်ညှိရင် — `stale` ကို စက္ကန့် 30 (သို့) ဒီထက်ပိုပြီး ထားပါ။ အဲဒါအောက်ဆို — scope က prefetching ကနေ ကျသွားပါတယ်။ [`cacheLife` client cache behavior](/docs/nextjs/cache-life) ကို ကြည့်ပါ။
- URL ပေါ်မှာလည်း မှီခိုတဲ့ route တစ်ခု (`params` (သို့) `searchParams` တန်ဖိုး) ကို ညွှန်တဲ့ links တွေပေါ်မှာ [`<Link prefetch={true}>`](/docs/nextjs/component-link) လိုအပ်ပါတယ်။ ဒါက [per-link prefetching](/docs/nextjs/optimizing-prefetching) ကို opt in လုပ်တာဖြစ်ပြီး — click မလုပ်ခင် per-link data တွေကို ဖြေရှင်းပေးပါတယ်။

```tsx filename="app/page.tsx"
<Link href={`/notes/${note.id}`} prefetch={true}>
  {note.text}
</Link>
```

Destination က ဒီအတွက် [Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) လိုအပ်ပါတယ် — ဒါကြောင့် [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) flag ကို enable လုပ်ပါ (သို့) segment ပေါ်မှာ `prefetch = 'partial'` သတ်မှတ်ပါ။ စောင့်ဆိုင်းရကျိုး နပ်တဲ့နေရာမှာ prop ကို ထည့်ပါ: အဲဒီ prefetch က link တစ်ခုစီအတွက် server invocation တစ်ကြိမ် ကုန်ကျတာမို့ — `/chat/[id]` links တွေ ပြည့်နေတဲ့ sidebar တစ်ခုက item တစ်ခုစီအတွက် အဲဒီကုန်ကျစရိတ်ကို ပေးရပါတယ်။

## အဖြစ်များတဲ့ အမှားများ (Common pitfalls)

- **ရိုးရိုး `use cache` function ထဲမှာ `cookies()` (သို့) `headers()` ဖတ်ခြင်း။** ဒါက throw လုပ်ပါတယ်။ Request ကို အပြင်မှာ ဖတ်ပြီး တန်ဖိုးကို pass လုပ်ပါ (သို့) `use cache: private` ကို သုံးပါ။
- **Cache keys (သို့) tags တွေထဲမှာ secrets (သို့) personal data ထည့်ခြင်း။** Arguments နဲ့ `cacheTag` တန်ဖိုးတွေကို plain text နဲ့ သိမ်းပါတယ်။ Sensitive input တွေပေါ်မှာ မဟုတ်ဘဲ — တည်ငြိမ်တဲ့ identifier ပေါ်မှာ key နဲ့ tag လုပ်ပါ။
- **Authorization အတွက် client ကို ယုံကြည်ခြင်း။** UI checks တွေက elements တွေကို ဖျောက်ပေးရုံပဲ — data တွေကို မကာကွယ်ပါဘူး။ Data နဲ့ နီးကပ်တဲ့နေရာမှာ — Server Action တိုင်းနဲ့ [Route Handler](/docs/nextjs/file-conventions-route) တိုင်းထဲမှာ session ကို ပြန်စစ်ဆေးပါ။ [Authorization](/docs/nextjs/authentication) ကို ကြည့်ပါ။
