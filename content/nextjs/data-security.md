---
title: "Next.js မှာ Data Security အကြောင်း ဘယ်လို စဉ်းစားမလဲ"
description: "Next.js ရဲ့ built-in data security features တွေနဲ့ သင့် application ရဲ့ data တွေကို ကာကွယ်ဖို့ အကောင်းဆုံး အလေ့အကျင့်များ — data fetching နည်းလမ်းများ, Data Access Layer (DAL), Taint APIs, server-only code, Server Actions လုံခြုံရေး, client input validation, authentication/authorization, encryption, allowed origins နဲ့ auditing အကြောင်း"
order: 188
source: "https://nextjs.org/docs/app/guides/data-security"
status: translated
updated: 2026-09-03
---

[React Server Components](https://react.dev/reference/rsc/server-components) တွေက performance ကို ပိုကောင်းစေပြီး data fetching (ဒေတာ ယူခြင်း) ကို ရိုးရှင်းစေပေမယ့် — data တွေကို ဘယ်နေရာမှာ, ဘယ်လို ဝင်ရောက်သုံးစွဲတယ်ဆိုတာကိုလည်း ပြောင်းလဲစေပါတယ်။ Frontend apps တွေမှာ data ကိုင်တွယ်ခြင်းရဲ့ ရိုးရာ security assumptions (လုံခြုံရေး ယူဆချက်များ) တစ်ချို့ကိုလည်း ဒါက ပြောင်းလဲစေပါတယ်။

ဒီ guide က Next.js မှာ data security (ဒေတာ လုံခြုံရေး) အကြောင်း ဘယ်လို စဉ်းစားရမလဲ — နဲ့ best practices တွေကို ဘယ်လို အကောင်အထည်ဖော်ရမလဲဆိုတာကို နားလည်စေဖို့ ကူညီပေးပါလိမ့်မယ်။

## Data Fetching နည်းလမ်းများ

Next.js မှာ data fetching အတွက် အဓိက နည်းလမ်း သုံးခုကို အကြံပြုပါတယ် — သင့် project ရဲ့ အရွယ်အစားနဲ့ သက်တမ်းပေါ် မူတည်ပါတယ်:

- [HTTP APIs](#external-http-apis): ရှိပြီးသား ကြီးမားတဲ့ applications တွေနဲ့ အဖွဲ့အစည်းတွေအတွက်။
- [Data Access Layer](#data-access-layer): Project အသစ်တွေအတွက်။
- [Component-Level Data Access](#component-level-data-access): Prototypes တွေနဲ့ လေ့လာသင်ယူမှုတွေအတွက်။

Data fetching နည်းလမ်း တစ်ခုတည်းကို ရွေးပြီး — ရောနှောသုံးစွဲတာကို ရှောင်ဖို့ အကြံပြုပါတယ်။ ဒါက သင့် codebase ထဲမှာ အလုပ်လုပ်နေတဲ့ developers တွေရော — security auditors (လုံခြုံရေး စစ်ဆေးသူများ) အတွက်ပါ ဘာကို မျှော်လင့်ရမလဲဆိုတာ ရှင်းလင်းစေပါတယ်။

### External HTTP APIs

Project အဟောင်း (existing project) တစ်ခုမှာ Server Components တွေကို စတင် လက်ခံကျင့်သုံးတဲ့အခါ — **Zero Trust** model ကို လိုက်နာသင့်ပါတယ်။ Client Components တွေမှာ လုပ်သလိုပဲ — Server Components တွေကနေ REST (သို့) GraphQL လို သင့်ရှိပြီးသား API endpoints တွေကို [`fetch`](/docs/nextjs/fetch) သုံးပြီး ဆက်လက် ခေါ်ဆိုနိုင်ပါတယ်။

```tsx filename="app/page.tsx"
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('AUTH_TOKEN')?.value

  const res = await fetch('https://api.example.com/profile', {
    headers: {
      Cookie: `AUTH_TOKEN=${token}`,
      // Other headers
    },
  })

  // ....
}
```

ဒီနည်းလမ်းက အောက်ပါ အခြေအနေတွေမှာ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်:

- သင့်မှာ security practices (လုံခြုံရေး အလေ့အကျင့်များ) ရှိပြီးသားဆိုရင်။
- Backend team တွေက သီးခြားဖြစ်ပြီး — အခြား language တွေသုံးတာ (သို့) APIs တွေကို လွတ်လပ်စွာ စီမံခန့်ခွဲနေတယ်ဆိုရင်။

### Data Access Layer (DAL)

Project အသစ်တွေအတွက်တော့ — သီးသန့် **Data Access Layer (DAL)** (ဒေတာ ဝင်ရောက်မှု အလွှာ) တစ်ခု ဖန်တီးဖို့ အကြံပြုပါတယ်။ ဒါက data တွေကို ဘယ်လို, ဘယ်အချိန်မှာ fetch လုပ်မလဲ — နဲ့ သင့် render context ဆီ ဘာတွေ ပို့မလဲဆိုတာကို ထိန်းချုပ်ပေးတဲ့ internal library တစ်ခုပါ။

Data Access Layer တစ်ခုက အောက်ပါအတိုင်း ဖြစ်သင့်ပါတယ်:

- Server ပေါ်မှာပဲ run လုပ်ရမည်။
- Authorization checks (ခွင့်ပြုချက် စစ်ဆေးမှုများ) လုပ်ဆောင်ရမည်။
- လုံခြုံပြီး အနည်းငယ်မျှသော **Data Transfer Objects (DTOs)** (ဒေတာ ပို့ဆောင်ရေး object များ) တွေကိုပဲ ပြန်ပေးရမည်။

ဒီနည်းလမ်းက data access logic (ဒေတာ ဝင်ရောက်မှု logic) အားလုံးကို ဗဟိုချုပ်ကိုင်ပေးတာမို့ — တစ်သမတ်တည်း ဖြစ်တဲ့ data access ကို ကျင့်သုံးဖို့ ပိုလွယ်ကူစေပြီး — authorization bugs တွေရဲ့ အန္တရာယ်ကိုလည်း လျှော့ချပေးပါတယ်။ Request တစ်ခုရဲ့ နေရာ အစိတ်အပိုင်း အသီးသီးကြားမှာ in-memory cache တစ်ခုကို share လုပ်နိုင်တဲ့ အကျိုးကျေးဇူးလည်း ရရှိပါတယ်။

```ts filename="data/auth.ts"
import { cache } from 'react'
import { cookies } from 'next/headers'

// Cached helper methods makes it easy to get the same value in many places
// without manually passing it around. This discourages passing it from Server
// Component to Server Component which minimizes risk of passing it to a Client
// Component.
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('AUTH_TOKEN')
  const decodedToken = await decryptAndValidate(token)
  // Don't include secret tokens or private information as public fields.
  // Use classes to avoid accidentally passing the whole object to the client.
  return new User(decodedToken.id)
})
```

```tsx filename="data/user-dto.tsx"
import 'server-only'
import { getCurrentUser } from './auth'

function canSeeUsername(viewer: User) {
  // Public info for now, but can change
  return true
}

function canSeePhoneNumber(viewer: User, team: string) {
  // Privacy rules
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
  // Don't pass values, read back cached values, also solves context and easier to make it lazy

  // use a database API that supports safe templating of queries
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const userData = rows[0]

  const currentUser = await getCurrentUser()

  // only return the data relevant for this query and not everything
  // <https://www.w3.org/2001/tag/doc/APIMinimization>
  return {
    username: canSeeUsername(currentUser) ? userData.username : null,
    phonenumber: canSeePhoneNumber(currentUser, userData.team)
      ? userData.phonenumber
      : null,
  }
}
```

```tsx filename="app/page.tsx"
import { getProfileDTO } from '../../data/user-dto'

export default async function Page({ params }) {
  const { slug } = await params
  // This page can now safely pass around this profile knowing
  // that it shouldn't contain anything sensitive.
  const profile = await getProfileDTO(slug)
  ...
}
```

> **သိထားသင့်သည်:** Secret keys တွေကို environment variables တွေထဲမှာ သိမ်းဆည်းသင့်ပေမယ့် — `process.env` ကို Data Access Layer ကသာလျှင် ဝင်ရောက်သုံးစွဲသင့်ပါတယ်။ ဒါက secrets တွေ application ရဲ့ အခြား အစိတ်အပိုင်းတွေဆီ ပေါက်ကြားမသွားအောင် ကာကွယ်ပေးပါတယ်။

### Component-Level Data Access

အမြန် prototypes တွေနဲ့ အကြိမ်ကြိမ် စမ်းသပ်ပြင်ဆင်မှုတွေအတွက်တော့ — database queries တွေကို Server Components တွေထဲမှာ တိုက်ရိုက် ထည့်နိုင်ပါတယ်။

ဒါပေမယ့် ဒီနည်းလမ်းက private data တွေ client ဆီ မတော်တဆ ပေါက်ကြားသွားဖို့ ပိုလွယ်ကူစေပါတယ်။ ဥပမာ:

```tsx filename="app/page.tsx"
import Profile from './components/profile.tsx'

export default async function Page({ params }) {
  const { slug } = await params
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const userData = rows[0]
  // EXPOSED: This exposes all the fields in userData to the client because
  // we are passing the data from the Server Component to the Client.
  return <Profile user={userData} />
}
```

```tsx filename="app/ui/profile.tsx"
'use client'

// BAD: This is a bad props interface because it accepts way more data than the
// Client Component needs and it encourages server components to pass all that
// data down. A better solution would be to accept a limited object with just
// the fields necessary for rendering the profile.
export default async function Profile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      ...
    </div>
  )
}
```

Client Component ဆီ မပို့ခင် data တွေကို sanitize (စစ်ထုတ် သန့်စင်) လုပ်ထားသင့်ပါတယ်:

```ts filename="data/user.ts"
import { sql } from './db'

export async function getUser(slug: string) {
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const user = rows[0]

  // Return only the public fields
  return {
    name: user.name,
  }
}
```

```tsx filename="app/page.tsx"
import { getUser } from '../data/user'
import Profile from './ui/profile'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const publicProfile = await getUser(slug)
  return <Profile user={publicProfile} />
}
```

## Reading Data (Data ဖတ်ခြင်း)

### Passing Data from Server to Client

ကနဦး load (ပထမဆုံး ဖွင့်ချိန်) မှာ Server ရော Client Components တွေပါ HTML ထုတ်လုပ်ဖို့ server ပေါ်မှာ run လုပ်ပါတယ်။ ဒါပေမယ့် သူတို့က သီးခြားခွဲထားတဲ့ (isolated) module systems တွေထဲမှာ execute လုပ်ပါတယ်။ ဒါက Server Components တွေက private data တွေနဲ့ APIs တွေကို ဝင်ရောက်သုံးစွဲနိုင်ပြီး — Client Components တွေကတော့ မသုံးစွဲနိုင်ဘူးဆိုတာ အာမခံပေးပါတယ်။

**Server Components တွေ:**

- Server ပေါ်မှာပဲ run လုပ်ပါတယ်။
- Environment variables, secrets (လျှို့ဝှက်ချက်များ), databases နဲ့ internal APIs တွေကို လုံခြုံစွာ ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။

**Client Components တွေ:**

- Prerendering လုပ်ချိန်မှာ server ပေါ်မှာ run လုပ်ပေမယ့် — browser ထဲမှာ run နေတဲ့ code တွေနဲ့ အတူတူပဲ ဖြစ်တဲ့ security assumptions တွေကို လိုက်နာရပါတယ်။
- Privileged data (အခွင့်ထူးခံ ဒေတာ) တွေ (သို့) server-only modules တွေကို ဝင်ရောက်သုံးစွဲခွင့် မရှိပါဘူး။

ဒါက app ကို default အားဖြင့် secure ဖြစ်စေပေမယ့် — data တွေကို fetch လုပ်တဲ့ နည်းလမ်း (သို့) components တွေဆီ ပို့တဲ့ နည်းလမ်းကတစ်ဆင့် private data တွေ မတော်တဆ ပေါက်ကြားသွားနိုင်တာ ရှိပါတယ်။

### Tainting (Data တားမြစ်ခြင်း)

Private data တွေ client ဆီ မတော်တဆ ပေါက်ကြားတာကို ကာကွယ်ဖို့ — React ရဲ့ Taint APIs တွေကို သုံးနိုင်ပါတယ်:

- [`experimental_taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference) — data objects တွေအတွက်။
- [`experimental_taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) — တိကျတဲ့ တန်ဖိုး (specific values) တွေအတွက်။

`next.config.js` ထဲမှာ [`experimental.taint`](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint) option နဲ့ သင့် Next.js app မှာ ဒါကို enable လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  experimental: {
    taint: true,
  },
}
```

ဒါက tainted (တားမြစ်ထားသော) objects (သို့) values တွေကို client ဆီ ပို့မခံရအောင် တားဆီးပေးပါတယ်။ ဒါပေမယ့် ဒါက နောက်ထပ် ကာကွယ်ရေး အလွှာတစ်ခုသာ ဖြစ်ပြီး — React ရဲ့ render context ဆီ မပို့ခင် data တွေကို သင့် [DAL](#data-access-layer) ထဲမှာ ဆက်လက် filter နဲ့ sanitize လုပ်ထားသင့်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - Default အားဖြင့် environment variables တွေက Server ပေါ်မှာပဲ ရနိုင်ပါတယ်။ `NEXT_PUBLIC_` နဲ့ prefix လုပ်ထားတဲ့ environment variable တွေကိုတော့ Next.js က client ဆီ ထုတ်ဖော်ပေးပါတယ်။ [ပိုမိုလေ့လာရန်](/docs/nextjs/environment-variables)။
> - Functions နဲ့ classes တွေကို Client Components တွေဆီ ပို့တာကို default အားဖြင့် ကန့်သတ်ထားပြီးသားပါ။

### Server-only Code တွေကို Client မှာ မလည်ပတ်စေရန်

Server-only code (server အတွက်သာ ရည်ရွယ်တဲ့ code) တွေ client ပေါ်မှာ execute မဖြစ်အောင် တားဆီးဖို့ — module တစ်ခုကို [`server-only`](https://www.npmjs.com/package/server-only) package နဲ့ mark လုပ်နိုင်ပါတယ်:

```ts filename="lib/data.ts"
import 'server-only'

//...
```

ဒါက module ကို client environment ထဲမှာ import လုပ်ရင် build error တစ်ခု ဖြစ်စေခြင်းအားဖြင့် — proprietary code (မူပိုင်ကုဒ်) (သို့) internal business logic တွေ server ပေါ်မှာပဲ ရှိနေစေဖို့ သေချာစေပါတယ်။

`server-only` imports တွေကို Next.js က ကိုယ်တိုင် (internally) ကိုင်တွယ်ပါတယ်။ NPM ကနေ ရတဲ့ ဒီ packages တွေရဲ့ အတွင်းအကြောင်းအရာတွေကိုတော့ အသုံးမပြုပါဘူး။ ဒါပေမယ့် — သင့် linting rules တွေက extraneous dependencies (ပိုနေသော dependencies) တွေလို့ flag တက်နေရင်တော့ — ပြဿနာတွေ ရှောင်ဖို့ သူတို့ကို install လုပ်ထားနိုင်ပါတယ်။

```bash package="npm"
npm install server-only
```

```bash package="yarn"
yarn add server-only
```

```bash package="pnpm"
pnpm add server-only
```

```bash package="bun"
bun add server-only
```

`server-only` အကြောင်း ပိုမိုလေ့လာရန် [preventing environment poisoning (environment အဆိပ်သင့်မှု ကာကွယ်ခြင်း)](/docs/nextjs/server-client-components) section ကို ဖတ်ပါ။

## Mutating Data (ဒေတာ ပြောင်းလဲခြင်း)

Next.js က mutations (ဒေတာ ပြောင်းလဲမှုများ) တွေကို [Server Actions](https://react.dev/reference/rsc/server-functions) တွေနဲ့ ကိုင်တွယ်ပါတယ်။

### Server Actions ရဲ့ Built-in Security Features

Default အားဖြင့် — Server Action တစ်ခုကို ဖန်တီးပြီး export လုပ်လိုက်တာနဲ့ — သင့် application ရဲ့ UI ကနေတစ်ဆင့်သာမက direct POST request တစ်ခုကနေလည်း ခေါ်ဆိုလို့ ရနိုင်ပါတယ်။ ဆိုလိုတာက Server Action (သို့) utility function တစ်ခုကို သင့် code ထဲက အခြားနေရာတွေမှာ import မလုပ်ထားရင်တောင် — ပြင်ပကနေ ခေါ်ဆိုနိုင်ပါသေးတယ်။

Security ပိုကောင်းစေဖို့ Next.js မှာ အောက်ပါ built-in features တွေ ပါဝင်ပါတယ်:

- **Secure action IDs:** Server Action ကို client က reference လုပ်ပြီး ခေါ်ဆိုနိုင်ဖို့ — Next.js က encrypted (ကုဒ်ဝှက်ထားသော), non-deterministic (ခန့်မှန်း၍ မရသော) IDs တွေကို ဖန်တီးပေးပါတယ်။ Security ပိုကောင်းစေဖို့ ဒီ IDs တွေကို builds တွေကြားမှာ အခါအားလျော်စွာ ပြန်လည် တွက်ချက်ပေးပါတယ်။
- **Dead code elimination:** အသုံးမပြုတော့တဲ့ Server Actions တွေ (သူတို့ရဲ့ IDs နဲ့ reference လုပ်ထားတဲ့) ကို — public access (အများပြည်သူ ဝင်ရောက်မှု) မဖြစ်အောင် client bundle ကနေ ဖယ်ရှားပေးပါတယ်။

> **သိထားသင့်သည်:**
>
> IDs တွေကို compilation လုပ်ချိန်မှာ ဖန်တီးပြီး — အများဆုံး ရက် 14 ကြာအောင် cache လုပ်ထားပါတယ်။ Build အသစ်တစ်ခု စတင်တဲ့အခါ (သို့) build cache ကို invalidate လုပ်တဲ့အခါ — ပြန်လည် ထုတ်လုပ်ပေးပါလိမ့်မယ်။
> ဒီ security improvement က authentication layer (အထောက်အထား စိစစ်ရေး အလွှာ) မပါတဲ့ အခြေအနေတွေမှာ အန္တရာယ်ကို လျှော့ချပေးပါတယ်။ ဒါပေမယ့် — Server Actions တွေကို direct POST requests တွေကနေ ခေါ်ဆိုလို့ ရနိုင်သေးတယ်ဆိုတဲ့အချက်ကို သတိထားပြီး — Action တစ်ခုချင်းစီအတွင်းမှာ authentication ရော authorization ပါ verify လုပ်သင့်ပါတယ်။

```jsx
// app/actions.js
'use server'

// If this action **is** used in our application, Next.js
// will create a secure ID to allow the client to reference
// and call the Server Action.
export async function updateUserAction(formData) {}

// If this action **is not** used in our application, Next.js
// will automatically remove this code during `next build`
// and will not create a public endpoint.
export async function deleteUserAction(formData) {}
```

### Client Input တွေကို Validate လုပ်ခြင်း

Client ကနေ လာတဲ့ input တွေကို အမြဲတမ်း validate (စစ်ဆေး) လုပ်သင့်ပါတယ် — ဘာလို့လဲဆိုတော့ သူတို့ကို အလွယ်တကူ ပြုပြင်ပြောင်းလဲလို့ ရနိုင်လို့ပါ။ ဥပမာ — form data, URL parameters, headers နဲ့ searchParams တွေပါ:

```tsx filename="app/page.tsx"
// BAD: Trusting searchParams directly
export default async function Page({ searchParams }) {
  const isAdmin = (await searchParams).isAdmin
  if (isAdmin === 'true') {
    // Vulnerable: relies on untrusted client data
    return <AdminPanel />
  }
}

// GOOD: Re-verify every time
import { cookies } from 'next/headers'
import { verifyAdmin } from './auth'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('AUTH_TOKEN')
  const isAdmin = await verifyAdmin(token)

  if (isAdmin) {
    return <AdminPanel />
  }
}
```

### Authentication နဲ့ Authorization

Page level မှာ လုပ်ထားတဲ့ authentication check တစ်ခုက — အဲဒီ page အတွင်းမှာ သတ်မှတ်ထားတဲ့ Server Actions တွေအထိ သက်ရောက်မှု မရှိပါဘူး။ Action အတွင်းမှာ အမြဲတမ်း ပြန်လည် verify လုပ်ပါ:

```tsx filename="app/admin/page.tsx" highlight={13,14,15,16}
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    redirect('/login')
  }

  return (
    <form
      action={async () => {
        'use server'
        const session = await auth()
        if (!session?.user?.isAdmin) {
          throw new Error('Unauthorized')
        }
        await db.record.deleteMany()
      }}
    >
      <button>Delete Records</button>
    </form>
  )
}
```

Action အတွင်းက highlight လုပ်ထားတဲ့ `auth()` check က အလွန် အရေးကြီးပါတယ်။ Line 6 မှာရှိတဲ့ page-level redirect က ဘယ် UI ကို render လုပ်မလဲဆိုတာကိုသာ ထိန်းချုပ်ပြီး — Server Action ကတော့ သီးခြား entry point (ဝင်ပေါက်) တစ်ခု ဖြစ်လို့ — caller ကို ကိုယ်တိုင် verify လုပ်ရပါတယ်။

Authentication (user က log in ဝင်ထားသလား?) အပြင် — **authorization** (ဒီ user က ဒီ resource တစ်ခုချင်းအလိုက် လုပ်ဆောင်ရန် ခွင့်ပြုချက် ရှိလား?) ကိုပါ စစ်ဆေးဖို့ မမေ့ပါနဲ့။ ဒါက [Insecure Direct Object Reference (IDOR)](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) (လုံခြုံမှုမဲ့ တိုက်ရိုက် object ညွှန်းဆိုမှု) vulnerabilities တွေကို ကာကွယ်ပေးပါတယ်:

```tsx filename="app/actions.ts"
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await db.post.findUnique({ where: { id: postId } })

  // Check that the user owns this resource
  if (post.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
}
```

Next.js မှာ [Authentication](/docs/nextjs/authentication) အကြောင်း ပိုမိုလေ့လာပါ။

### Mutations တွေအတွက် Data Access Layer အသုံးပြုခြင်း

Data ဖတ်ခြင်းအတွက် [Data Access Layer](#data-access-layer) ကို အကြံပြုထားသလိုပဲ — mutations တွေအတွက်လည်း အလားတူ pattern ကို အသုံးပြုနိုင်ပါတယ်။ ဒါက authentication, authorization နဲ့ database logic တွေကို သီးသန့် `server-only` module တစ်ခုထဲမှာ ထားပြီး — `"use server"` actions တွေကို ပါးပါးလေး (thin) ဖြစ်အောင် ထားပေးပါတယ်။

```ts filename="data/posts.ts"
import 'server-only'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await db.post.findUnique({ where: { id: postId } })

  if (post.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
}
```

`"use server"` action ကနေ DAL ဆီ လွှဲပြောင်း (delegate) လုပ်လိုက်တာပါ:

```ts filename="app/actions.ts"
'use server'

import { deletePost } from '@/data/posts'
import { revalidatePath } from 'next/cache'

export async function deletePostAction(postId: string) {
  await deletePost(postId) // Auth + authz happen inside the DAL
  revalidatePath('/posts')
}
```

> **သိထားသင့်သည်:** Data Access Layer ရော `"use server"` file ကိုယ်တိုင်မှာပါ `import 'server-only'` ကို အသုံးပြုနိုင်ပါတယ်။ Action ကို Client Component တစ်ခုထဲမှာ import လုပ်တဲ့အခါ (ဥပမာ — `useActionState` ဆီ ပို့ဖို့) နှစ်ခုလုံး အလုပ်လုပ်ပါတယ် — ဘာလို့လဲဆိုတော့ `"use server"` modules တွေကို server-only webpack layer တစ်ခုထဲမှာ resolve လုပ်လို့ပါ။

### Return Values တွေကို ထိန်းချုပ်ခြင်း

Server Action တွေရဲ့ return values တွေကို serialize လုပ်ပြီး client ဆီ ပို့ပါတယ်။ Raw database records တွေ မဟုတ်ဘဲ — UI က လိုအပ်တာကိုသာ ပြန်ပေးပါ။

```tsx filename="app/actions.ts"
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// BAD: Returns the full database record, which may include
// internal fields the client should not see.
export async function updateUser(data: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return db.user.update({
    where: { id: session.user.id },
    data: { name: data.get('name') as string },
  })
}

// GOOD: Returns only what the client needs.
export async function updateUserSafe(data: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  await db.user.update({
    where: { id: session.user.id },
    data: { name: data.get('name') as string },
  })
  return { success: true }
}
```

### Rate Limiting

စရိတ် (cost) မြင့်တဲ့ operations တွေ (ဥပမာ — emails ပို့ခြင်း, database ထဲ ရေးသားခြင်း) အတွက် — အလွဲသုံးစားမှု (abuse) မဖြစ်အောင် rate limiting (တောင်းဆိုမှု နှုန်း ကန့်သတ်ခြင်း) ထည့်သွင်းဖို့ စဉ်းစားပါ။ [Rate limiting](https://nextjs.org/docs/app/guides/backend-for-frontend#rate-limiting) ဥပမာကို Backend for Frontend guide ထဲမှာ ကြည့်ပါ။

### Closures နဲ့ Encryption

Component တစ်ခုအတွင်းမှာ Server Action တစ်ခု သတ်မှတ်လိုက်တာက [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) တစ်ခုကို ဖန်တီးပေးပါတယ် — အဲဒီမှာ action က အပြင်ဘက် function ရဲ့ scope ကို ဝင်ရောက် သုံးစွဲနိုင်ပါတယ်။ ဥပမာ — `publish` action က `publishVersion` variable ကို ဝင်ရောက် သုံးစွဲနိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since pressing publish');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>Publish</button>
    </form>
  );
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since pressing publish');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>Publish</button>
    </form>
  );
}
```

Closures တွေက — rendering လုပ်ချိန်မှာ data ရဲ့ _snapshot_ (ပုံရိပ် ဖမ်းယူမှု) တစ်ခုကို ဖမ်းယူထားပြီး (ဥပမာ `publishVersion`) — နောက်ပိုင်း action ကို invoke လုပ်တဲ့အခါ အသုံးပြုနိုင်ဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်ပါတယ်။

ဒါပေမယ့် ဒါ ဖြစ်ဖို့အတွက် — action ကို invoke လုပ်တဲ့အခါ — ဖမ်းယူထားတဲ့ (captured) variables တွေကို client ဆီ ပို့ပြီး client ကနေ server ဆီ ပြန်ပို့ပါတယ်။ Sensitive data တွေ client ဆီ ပေါက်ကြားမသွားအောင် — Next.js က closed-over variables (closure အတွင်း ပိတ်မိနေသော variables) တွေကို အလိုအလျောက် encrypt (ကုဒ်ဝှက်) လုပ်ပေးပါတယ်။ Next.js application တစ်ခုကို build လုပ်တိုင်း — action တစ်ခုစီအတွက် private key အသစ်တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ ဆိုလိုတာက actions တွေကို သက်ဆိုင်ရာ build တစ်ခုအတွက်မှသာ invoke လုပ်လို့ ရနိုင်ပါတယ်။

> **သိထားသင့်သည်:** Sensitive values တွေ client ပေါ်မှာ ပေါက်ကြားမသွားအောင် encryption တစ်ခုတည်းကိုပဲ အားပြုဖို့ အကြံမပြုပါဘူး။

### Encryption Keys တွေကို Overwrite လုပ်ခြင်း (အဆင့်မြင့်)

**Self-hosting** လုပ်ထားတဲ့ သင့် Next.js application ကို server အများအပြားမှာ run လုပ်တဲ့အခါ — server instance တစ်ခုချင်းစီမှာ encryption key မတူညီတာတွေ ဖြစ်နိုင်ပြီး — inconsistencies (ကိုက်ညီမှု မရှိခြင်းများ) တွေ ဖြစ်လာနိုင်ပါတယ်။

ဒါကို လျော့ပါးစေဖို့ — `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` environment variable ကို သုံးပြီး encryption key ကို overwrite (အစားထိုး) လုပ်နိုင်ပါတယ်။ ဒီ variable ကို သတ်မှတ်ပေးတာက — သင့် encryption keys တွေ builds တွေတစ်လျှောက် တည်မြဲနေစေပြီး — server instance တိုင်းက key တစ်ခုတည်းကိုပဲ အသုံးပြုစေပါတယ်။

Key က base64-encoded value တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး — decode လုပ်ထားတဲ့ length က valid AES key size (16, 24 (သို့) 32 bytes) တစ်ခုနဲ့ ကိုက်ညီရပါမယ်။ Next.js က default အားဖြင့် 32-byte keys တွေကို ထုတ်လုပ်ပေးပါတယ်။ သင့် platform ရဲ့ cryptographic tools တွေကို သုံးပြီး ကိုက်ညီတဲ့ key တစ်ခုကို ထုတ်လုပ်နိုင်ပါတယ်။ ဥပမာ:

```bash
openssl rand -base64 32
```

ဒါက deployments အများအပြားမှာ encryption အပြုအမူ တစ်သမတ်တည်း ရှိနေတာက သင့် application အတွက် အရေးကြီးတဲ့ advanced use case တစ်ခုပါ။ Key rotation (key လှည့်ခြင်း) နဲ့ signing လို standard security practices တွေကို လိုက်နာပါ။ Deployment အလိုက် သုံးသပ်စရာတွေအတွက် [Self-Hosting guide](/docs/nextjs/self-hosting) ကို ကြည့်ပါ။

### Allowed Origins (ခွင့်ပြု Origins) — အဆင့်မြင့်

Server Actions တွေကို `<form>` element တစ်ခုအတွင်းကနေလည်း invoke လုပ်လို့ ရနိုင်တာမို့ — [CSRF attacks](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) တွေဆီ ဖွင့်ထားပေးသလို ဖြစ်နေပါတယ်။

နောက်ကွယ်မှာ Server Actions တွေက `POST` method ကို အသုံးပြုပြီး — ဒီ HTTP method တစ်ခုတည်းကသာ သူတို့ကို invoke လုပ်ခွင့် ရှိပါတယ်။ ဒါက modern browsers တွေမှာ CSRF vulnerabilities အများစုကို ကာကွယ်ပေးပါတယ် — အထူးသဖြင့် [SameSite cookies](https://web.dev/articles/samesite-cookies-explained) တွေက default ဖြစ်နေတဲ့အခါပါ။

နောက်ထပ် ကာကွယ်မှုအနေနဲ့ — Next.js ရဲ့ Server Actions တွေက [Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) နဲ့ [Host header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) (သို့) `X-Forwarded-Host` တို့ကိုပါ ယှဉ်ကြည့်ပါတယ်။ ဒါတွေ မကိုက်ညီဘူးဆိုရင် request ကို ရပ်တန့် (abort) လိုက်ပါတယ်။ တနည်းအားဖြင့် — Server Actions တွေကို သူ့ကို host လုပ်ထားတဲ့ page ရှိတဲ့ host တစ်ခုတည်းပေါ်မှာသာ invoke လုပ်လို့ ရနိုင်ပါတယ်။

Reverse proxies (သို့) multi-layered backend architectures (server API က production domain နဲ့ ကွဲပြားနေတဲ့) တွေကို အသုံးပြုတဲ့ ကြီးမားတဲ့ applications တွေအတွက် — လုံခြုံတဲ့ origins စာရင်းတစ်ခု သတ်မှတ်ဖို့ [`serverActions.allowedOrigins`](/docs/nextjs/next-config-server-actions) configuration option ကို အသုံးပြုဖို့ အကြံပြုပါတယ်။ ဒီ option က string တွေရဲ့ array တစ်ခုကို လက်ခံပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

[Security နဲ့ Server Actions](https://nextjs.org/blog/security-nextjs-server-components-actions) အကြောင်း ပိုမိုလေ့လာပါ။

### Rendering လုပ်နေစဉ် Side-Effects ရှောင်ကြဉ်ခြင်း

Mutations တွေ (ဥပမာ — users တွေကို log out လုပ်ခြင်း, databases တွေ update လုပ်ခြင်း, caches တွေ invalidate လုပ်ခြင်း) က Server Components တွေမှာဖြစ်စေ Client Components တွေမှာဖြစ်စေ — side-effect တစ်ခု ဖြစ်လို့ မရပါဘူး။ မရည်ရွယ်ဘဲ ဖြစ်လာတဲ့ side effects တွေ မဖြစ်အောင် — render methods တွေအတွင်းမှာ cookies သတ်မှတ်ခြင်း (သို့) cache revalidation စတင်ခြင်းတွေကို Next.js က တိတိကျကျ တားဆီးပေးပါတယ်။

```tsx filename="app/page.tsx"
// BAD: Triggering a mutation during rendering
export default async function Page({ searchParams }) {
  if ((await searchParams).logout) {
    const cookieStore = await cookies()
    cookieStore.delete('AUTH_TOKEN')
  }

  return <UserProfile />
}
```

အဲဒီအစား — mutations တွေကို ကိုင်တွယ်ဖို့ Server Actions တွေကို အသုံးပြုသင့်ပါတယ်။

```tsx filename="app/page.tsx"
// GOOD: Using Server Actions to handle mutations
import { logout } from './actions'

export default function Page() {
  return (
    <>
      <UserProfile />
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </>
  )
}
```

> **သိထားသင့်သည်:** Mutations တွေကို ကိုင်တွယ်ဖို့ Next.js က `POST` requests တွေကို အသုံးပြုပါတယ်။ ဒါက GET requests တွေကနေ မတော်တဆ ဖြစ်လာတတ်တဲ့ side-effects တွေကို ကာကွယ်ပေးပြီး — Cross-Site Request Forgery (CSRF) risks တွေကို လျှော့ချပေးပါတယ်။

## Auditing (စစ်ဆေး သုံးသပ်ခြင်း)

Next.js project တစ်ခုကို audit (စစ်ဆေး သုံးသပ်) လုပ်နေတယ်ဆိုရင် — အထူး အာရုံစိုက် ကြည့်သင့်တဲ့ အချက်တစ်ချို့ကို အကြံပြုထားပါတယ်:

- **Data Access Layer:** သီးခြားခွဲထားတဲ့ Data Access Layer တစ်ခုအတွက် စနစ်ကျတဲ့ အလေ့အကျင့် (established practice) ရှိရဲ့လား? Database packages တွေနဲ့ environment variables တွေကို Data Access Layer ရဲ့ အပြင်ဘက်မှာ import မလုပ်ထားဘူးဆိုတာ စစ်ဆေးပါ။
- **`"use client"` files တွေ:** Component props တွေက private data တွေကို မျှော်လင့်နေလား? Type signatures တွေက လိုအပ်တာထက် ကျယ်ပြန့်နေလား?
- **`"use server"` files တွေ:** Action arguments တွေကို action ထဲမှာ (သို့) Data Access Layer အတွင်းမှာ validate လုပ်ထားလား? Action အတွင်းမှာ user ကို ပြန်လည် authorize လုပ်ထားလား? Action က resource ရဲ့ ပိုင်ဆိုင်မှုကို စစ်ဆေးလား (authorization — authentication တစ်ခုတည်း မဟုတ်ဘဲ)? Return values တွေက client လိုအပ်တာပဲ ကျန်အောင် filter လုပ်ထားလား? Database access ကို `server-only` Data Access Layer ဆီ လွှဲအပ်ထားလား?
- **`/[param]/.`** — Bracket (ကွင်း) တွေ ပါတဲ့ folder တွေက user input တွေပါ။ Params တွေကို validate လုပ်ထားလား?
- **`proxy.ts` နဲ့ `route.ts`:** ဒါတွေက ပါဝါ အများကြီး ရှိပါတယ်။ ရိုးရာ (traditional) techniques တွေကို သုံးပြီး ဒါတွေကို audit လုပ်ဖို့ အချိန် ပိုပေးပါ။ Penetration Testing (ထိုးဖောက် စမ်းသပ်ခြင်း) (သို့) Vulnerability Scanning (အားနည်းချက် ရှာဖွေခြင်း) တွေကို — ပုံမှန် (သို့) သင့် team ရဲ့ software development lifecycle နဲ့ ကိုက်ညီအောင် လုပ်ဆောင်ပါ။
