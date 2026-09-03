---
title: "Authentication အကောင်အထည်ဖော်ခြင်း (How to implement authentication)"
description: "သင့် Next.js application မှာ authentication ကို အကောင်အထည်ဖော်နည်း — signup/login forms, session management (stateless & database sessions), authorization checks (DAL, DTO, Proxy), Server Components/Layouts/Server Actions/Route Handlers တွေထဲမှာ စစ်ဆေးခြင်း နဲ့ auth libraries များ"
order: 108
source: "https://nextjs.org/docs/app/guides/authentication"
status: translated
updated: 2026-09-03
---

သင့် application ရဲ့ data တွေကို ကာကွယ်ဖို့ authentication ကို နားလည်ခြင်းက အရေးကြီးပါတယ်။ ဒီ page က auth ကို အကောင်အထည်ဖော်ဖို့ React နဲ့ Next.js ရဲ့ ဘယ် features တွေကို သုံးရမလဲဆိုတာ လမ်းညွှန်ပေးသွားပါမယ်။

မစခင် — ဒီ process ကို concept သုံးခု အဖြစ် ခွဲကြည့်တာ အထောက်အကူ ဖြစ်ပါတယ်:

1. **[Authentication](#authentication)**: User က သူပြောနေတဲ့အတိုင်း သူဟုတ်မဟုတ် စိစစ်ခြင်း ဖြစ်ပါတယ်။ User က သူ့မှာ ရှိတဲ့အရာတစ်ခုနဲ့ — ဥပမာ username နဲ့ password — ကိုယ်ပိုင်အထောက်အထား သက်သေပြဖို့ လိုအပ်ပါတယ်။
2. **[Session Management](#session-management)**: Requests တွေကြားမှာ user ရဲ့ auth state ကို ခြေရာခံခြင်း ဖြစ်ပါတယ်။
3. **[Authorization](#authorization)**: User က ဘယ် routes နဲ့ data တွေကို ဝင်ရောက်ခွင့် ရှိလဲ ဆုံးဖြတ်ပေးခြင်း ဖြစ်ပါတယ်။

ဒီ diagram က React နဲ့ Next.js features တွေကို သုံးပြီး authentication flow ကို ပြသထားပါတယ်:

*Authentication flow ကို ပြသထားတဲ့ diagram — React နဲ့ Next.js features တွေနဲ့အတူ။*

ဒီ page က ဥပမာတွေက ပညာရေးဆိုင်ရာ ရည်ရွယ်ချက်အတွက် အခြေခံ username နဲ့ password auth ကို ဖြတ်သန်း ပြသထားပါတယ်။ Custom auth solution တစ်ခုကို ကိုယ်တိုင် အကောင်အထည်ဖော်လို့ ရပေမယ့် — security ပိုကောင်းပြီး ရိုးရှင်းစေဖို့ authentication library တစ်ခုကို သုံးဖို့ အကြံပြုပါတယ်။ ဒီ libraries တွေက authentication, session management နဲ့ authorization တွေအတွက် built-in solutions တွေ ပေးစွမ်းပြီး — social logins, multi-factor authentication, role-based access control လို အပိုဆောင်း features တွေလည်း ပါဝင်ပါတယ်။ စာရင်းကို [Auth Libraries](#auth-libraries) section မှာ ကြည့်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ဖွင့်ထားရင် — session ဖတ်ခြင်းနဲ့ user တစ်ယောက်ချင်းစီရဲ့ data တွေကို cache လုပ်ခြင်းက စည်းမျဉ်း သီးသန့်တွေ လိုက်နာရပါတယ်။ [Authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components) ကို ကြည့်ပါ။

## Authentication (အထောက်အထား စိစစ်ခြင်း)

### Sign-up နဲ့ login လုပ်ဆောင်ချက်

User credentials တွေကို ဖမ်းယူဖို့၊ form fields တွေကို validate လုပ်ဖို့နဲ့ သင့် Authentication Provider ရဲ့ API (သို့) database ကို ခေါ်ဖို့ — React ရဲ့ [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ `useActionState` ပါတဲ့ [`<form>`](https://react.dev/reference/react-dom/components/form) element ကို သုံးနိုင်ပါတယ်။

Server Actions တွေက server ပေါ်မှာ အမြဲ run တာမို့ — authentication logic ကို ကိုင်တွယ်ဖို့ secure environment တစ်ခု ပေးပါတယ်။

Signup/login လုပ်ဆောင်ချက် အကောင်အထည်ဖော်ဖို့ အဆင့်တွေက ဒီလိုပါ:

#### 1. User credentials တွေကို ဖမ်းယူခြင်း

User credentials တွေကို ဖမ်းယူဖို့ — submission မှာ Server Action တစ်ခုကို invoke လုပ်တဲ့ form တစ်ခု ဖန်တီးပါ။ ဥပမာ — user ရဲ့ name, email နဲ့ password တွေကို လက်ခံတဲ့ signup form တစ်ခု:

```tsx filename="app/ui/signup-form.tsx"
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

```jsx filename="app/ui/signup-form.js"
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

```tsx filename="app/actions/auth.ts"
export async function signup(formData: FormData) {}
```

```jsx filename="app/actions/auth.js"
export async function signup(formData) {}
```

#### 2. Server ပေါ်မှာ form fields တွေကို validate လုပ်ခြင်း

Server Action ကို သုံးပြီး — server ပေါ်မှာ form fields တွေကို validate လုပ်ပါ။ သင့် authentication provider မှာ form validation မပါဘူးဆိုရင် — [Zod](https://zod.dev/), [Valibot](https://valibot.dev/) (သို့) [Yup](https://github.com/jquense/yup) လို schema validation library တစ်ခုကို သုံးနိုင်ပါတယ်။

Zod ကို ဥပမာအဖြစ် သုံးပြီး — သင့်တော်တဲ့ error messages တွေပါတဲ့ form schema တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်:

```ts filename="app/lib/definitions.ts"
import * as z from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
```

```js filename="app/lib/definitions.js"
import * as z from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})
```

သင့် authentication provider ရဲ့ API (သို့) database ဆီ မလိုအပ်တဲ့ calls တွေ မဖြစ်အောင် — form fields တစ်ခုခုက သတ်မှတ်ထားတဲ့ schema နဲ့ မကိုက်ညီရင် Server Action ထဲမှာ စောစောစီးစီး `return` လုပ်နိုင်ပါတယ်။

```ts filename="app/actions/auth.ts"
import { SignupFormSchema, FormState } from '@/app/lib/definitions'

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Call the provider or db to create a user...
}
```

```js filename="app/actions/auth.js"
import { SignupFormSchema } from '@/app/lib/definitions'

export async function signup(state, formData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Call the provider or db to create a user...
}
```

သင့် `<SignupForm />` ထဲမှာ ပြန်သွားပြီး — form submit လုပ်နေချိန်မှာ validation errors တွေ ပြသဖို့ React ရဲ့ `useActionState` hook ကို သုံးနိုင်ပါတယ်:

```tsx filename="app/ui/signup-form.tsx" highlight={7,15,21,27-36}
'use client'

import { signup } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}
```

```jsx filename="app/ui/signup-form.js" highlight={7,15,21,27-36}
'use client'

import { signup } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}
```

> **သိထားသင့်သည်:**
>
> - React 19 မှာ `useFormStatus` က ပြန်ပေးတဲ့ object ပေါ်မှာ data, method, action စတဲ့ keys အပိုတွေ ပါဝင်ပါတယ်။ React 19 မသုံးရင်တော့ `pending` key တစ်ခုပဲ ရနိုင်ပါတယ်။
> - Data တွေကို mutate မလုပ်ခင် — user က အဲဒီ action ကို လုပ်ဆောင်ဖို့ authorized ဖြစ်မဖြစ်ကိုလည်း အမြဲ သေချာစေသင့်ပါတယ်။ [Authentication နဲ့ Authorization](#authorization) ကို ကြည့်ပါ။

#### 3. User တစ်ဦး ဖန်တီးခြင်း (သို့) user credentials တွေကို စစ်ဆေးခြင်း

Form fields တွေ validate လုပ်ပြီးတဲ့အခါ — သင့် authentication provider ရဲ့ API (သို့) database ကို ခေါ်ပြီး user account အသစ်တစ်ခု ဖန်တီးနိုင်ပြီး (သို့) user ရှိမရှိ စစ်ဆေးနိုင်ပါတယ်။

အရင် ဥပမာကနေ ဆက်ပြီး:

```tsx filename="app/actions/auth.tsx"
export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

```jsx filename="app/actions/auth.js"
export async function signup(state, formData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Library API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

User account ကို အောင်မြင်စွာ ဖန်တီးပြီး (သို့) user credentials တွေကို verify လုပ်ပြီးတဲ့အခါ — user ရဲ့ auth state ကို စီမံဖို့ session တစ်ခု ဖန်တီးနိုင်ပါတယ်။ သင့် session management strategy ပေါ် မူတည်ပြီး — session ကို cookie (သို့) database (သို့) နှစ်ခုလုံးမှာ သိမ်းနိုင်ပါတယ်။ ပိုလေ့လာဖို့ [Session Management](#session-management) section ကို ဆက်ကြည့်ပါ။

> **အကြံပြုချက်များ:**
>
> - အထက်က ဥပမာက ပညာရေး ရည်ရွယ်ချက်အတွက် authentication အဆင့်တွေကို ခွဲပြထားလို့ ရှည်လျားပါတယ်။ ဒါက ကိုယ်ပိုင် secure solution တစ်ခု အကောင်အထည်ဖော်တာ မြန်မြန်ဆန်ဆန် ရှုပ်ထွေးလာနိုင်တာကို မီးမောင်းထိုးပြပါတယ်။ ဒီ process ကို ရိုးရှင်းစေဖို့ [Auth Library](#auth-libraries) တစ်ခု သုံးဖို့ စဉ်းစားပါ။
> - User experience ကောင်းအောင် — registration flow ထဲမှာ စောစောစီးစီး duplicate emails (သို့) usernames တွေရှိမရှိ စစ်ဆေးချင်နိုင်ပါတယ်။ ဥပမာ — user က username တစ်ခု ရိုက်နေချိန် (သို့) input field က focus ပျောက်သွားတဲ့အခါမျိုးမှာပါ။ ဒါက မလိုအပ်တဲ့ form submissions တွေကို တားဆီးနိုင်ပြီး user ကို ချက်ချင်း feedback ပေးနိုင်ပါတယ်။ ဒီ checks တွေရဲ့ အကြိမ်ရေကို စီမံဖို့ [use-debounce](https://www.npmjs.com/package/use-debounce) လို libraries တွေနဲ့ requests တွေကို debounce လုပ်နိုင်ပါတယ်။

## Session Management (session စီမံခန့်ခွဲမှု)

Session management က user ရဲ့ authenticated state ကို requests တွေကြားမှာ ထိန်းသိမ်းထားကြောင်း သေချာစေပါတယ်။ ဒါမှာ sessions (သို့) tokens တွေကို ဖန်တီးခြင်း, သိမ်းဆည်းခြင်း, refresh လုပ်ခြင်းနဲ့ ဖျက်ခြင်း တို့ ပါဝင်ပါတယ်။

Session နှစ်မျိုး ရှိပါတယ်:

1. [**Stateless**](#stateless-sessions): Session data (သို့) token တစ်ခုကို browser ရဲ့ cookies တွေထဲမှာ သိမ်းပါတယ်။ Cookie က request တစ်ခုစီနဲ့အတူ ပါသွားပြီး — session ကို server ပေါ်မှာ verify လုပ်နိုင်စေပါတယ်။ ဒီနည်းလမ်းက ပိုရိုးရှင်းပေမယ့် — မှန်ကန်စွာ အကောင်အထည်မဖော်ရင် လုံခြုံမှု နည်းနိုင်ပါတယ်။
2. [**Database**](#database-sessions): Session data တွေကို database ထဲမှာ သိမ်းပြီး — user ရဲ့ browser က encrypted session ID ကိုပဲ လက်ခံရရှိပါတယ်။ ဒီနည်းလမ်းက ပိုလုံခြုံပေမယ့် — ရှုပ်ထွေးပြီး server resources တွေ ပိုသုံးနိုင်ပါတယ်။

> **သိထားသင့်သည်:** နည်းလမ်း တစ်ခုခုကို ဖြစ်စေ၊ နှစ်ခုလုံးကို ဖြစ်စေ သုံးနိုင်ပေမယ့် — [iron-session](https://github.com/vvo/iron-session) (သို့) [Jose](https://github.com/panva/jose) လို session management library တစ်ခုကို သုံးဖို့ အကြံပြုပါတယ်။

### Stateless Sessions

Stateless sessions တွေကို ဖန်တီးပြီး စီမံဖို့ — လိုက်နာရမယ့် အဆင့်အနည်းငယ် ရှိပါတယ်:

1. သင့် session ကို sign လုပ်ဖို့ သုံးမယ့် secret key တစ်ခု generate လုပ်ပြီး — [environment variable](/docs/nextjs/environment-variables) တစ်ခုအနေနဲ့ သိမ်းပါ။
2. Session management library တစ်ခုကို သုံးပြီး — session data တွေကို encrypt/decrypt လုပ်ဖို့ logic တစ်ခု ရေးပါ။
3. Next.js ရဲ့ [`cookies`](/docs/nextjs/cookies) API ကို သုံးပြီး cookies တွေကို စီမံပါ။

ဒါတွေအပြင် — user က application ဆီ ပြန်လာတဲ့အခါ session ကို [update (သို့) refresh](#updating-or-refreshing-sessions) လုပ်ခြင်းနဲ့ user logout လုပ်တဲ့အခါ session ကို [ဖျက်ခြင်း](#deleting-the-session) လို လုပ်ဆောင်ချက်တွေ ထည့်သွင်း စဉ်းစားပါ။

> **သိထားသင့်သည်:** သင့် [auth library](#auth-libraries) မှာ session management ပါဝင်ပြီးသား ဟုတ်မဟုတ် စစ်ဆေးပါ။

#### 1. Secret key တစ်ခု generate လုပ်ခြင်း

သင့် session ကို sign လုပ်ဖို့ secret key တစ်ခု generate လုပ်နိုင်တဲ့ နည်းလမ်း အနည်းငယ် ရှိပါတယ်။ ဥပမာ — သင့် terminal ထဲမှာ `openssl` command ကို သုံးနိုင်ပါတယ်:

```bash filename="terminal"
openssl rand -base64 32
```

ဒီ command က character 32 လုံး ပါတဲ့ random string တစ်ခုကို generate လုပ်ပြီး — သင့် [environment variables file](/docs/nextjs/environment-variables) ထဲမှာ secret key အဖြစ် သိမ်းနိုင်ပါတယ်:

```bash filename=".env"
SESSION_SECRET=your_secret_key
```

ပြီးရင် ဒီ key ကို သင့် session management logic ထဲမှာ ရည်ညွှန်း သုံးနိုင်ပါတယ်:

```js filename="app/lib/session.js"
const secretKey = process.env.SESSION_SECRET
```

#### 2. Sessions တွေကို encrypt လုပ်ပြီး decrypt လုပ်ခြင်း

နောက်တစ်ဆင့်မှာ — sessions တွေကို encrypt/decrypt လုပ်ဖို့ သင်နှစ်သက်ရာ [session management library](#session-management-libraries) ကို သုံးနိုင်ပါတယ်။ အရင် ဥပမာကနေ ဆက်ပြီး — သင့် session management logic ကို server ပေါ်မှာပဲ run ကြောင်း သေချာဖို့ [Jose](https://www.npmjs.com/package/jose) နဲ့ React ရဲ့ [`server-only`](https://www.npmjs.com/package/server-only) package ကို သုံးပါမယ်။

```tsx filename="app/lib/session.ts"
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/app/lib/definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
```

```jsx filename="app/lib/session.js"
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
```

> **အကြံပြုချက်များ**:
>
> - Payload ထဲမှာ နောက်ဆက်တွဲ requests တွေမှာ သုံးမယ့် **အနည်းဆုံး** လိုအပ်တဲ့, unique user data တွေပဲ ပါသင့်ပါတယ် — ဥပမာ user ရဲ့ ID, role စသဖြင့်ပါ။ Phone number, email address, credit card information လို personally identifiable information တွေ (သို့) passwords လို sensitive data တွေ မပါသင့်ပါဘူး။

#### 3. Cookies တွေ သတ်မှတ်ခြင်း (အကြံပြုထားတဲ့ options)

Session ကို cookie တစ်ခုထဲမှာ သိမ်းဖို့ — Next.js ရဲ့ [`cookies`](/docs/nextjs/cookies) API ကို သုံးပါ။ Cookie ကို server ပေါ်မှာ သတ်မှတ်ပြီး — အကြံပြုထားတဲ့ options တွေ ပါဝင်သင့်ပါတယ်:

- **HttpOnly**: Client-side JavaScript တွေ cookie ကို ဝင်ရောက်လို့မရအောင် တားဆီးပေးပါတယ်။
- **Secure**: Cookie ကို ပို့ဖို့ https ကို သုံးပါ။
- **SameSite**: Cookie ကို cross-site requests တွေနဲ့အတူ ပို့လို့ရမရ သတ်မှတ်ပါ။
- **Max-Age သို့မဟုတ် Expires**: ကာလတစ်ခုပြီးရင် cookie ကို ဖျက်ပါ။
- **Path**: Cookie အတွက် URL path ကို သတ်မှတ်ပါ။

Option တစ်ခုချင်းစီအကြောင်း ပိုသိရဖို့ [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) ကို ကိုးကားပါ။

```ts filename="app/lib/session.ts"
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js filename="app/lib/session.js"
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

သင့် Server Action ထဲမှာ ပြန်သွားပြီး — `createSession()` function ကို invoke လုပ်ကာ user ကို သင့်တော်တဲ့ page ဆီ redirect လုပ်ဖို့ [`redirect()`](/docs/nextjs/redirecting) API ကို သုံးနိုင်ပါတယ်:

```ts filename="app/actions/auth.ts"
import { createSession } from '@/app/lib/session'

export async function signup(state: FormState, formData: FormData) {
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API

  // Current steps:
  // 4. Create user session
  await createSession(user.id)
  // 5. Redirect user
  redirect('/profile')
}
```

```js filename="app/actions/auth.js"
import { createSession } from '@/app/lib/session'

export async function signup(state, formData) {
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API

  // Current steps:
  // 4. Create user session
  await createSession(user.id)
  // 5. Redirect user
  redirect('/profile')
}
```

> **အကြံပြုချက်များ**:
>
> - **Cookies တွေကို server ပေါ်မှာ သတ်မှတ်သင့်ပါတယ်** — client-side tampering တွေကို ကာကွယ်ဖို့ပါ။
> - 🎥 ကြည့်ရှုရန်: Next.js နဲ့ stateless sessions နဲ့ authentication အကြောင်း ပိုလေ့လာရန် → [YouTube (11 မိနစ်)](https://www.youtube.com/watch?v=DJvM2lSPn6w)။

#### Updating (or refreshing) sessions (sessions များကို update/refresh လုပ်ခြင်း)

Session ရဲ့ expiration time ကိုလည်း တိုးချဲ့နိုင်ပါတယ်။ User က application ကို ပြန်လည် ဝင်ရောက်ပြီးနောက်မှာ login ဆက်ဖြစ်နေစေဖို့ အသုံးဝင်ပါတယ်။ ဥပမာ:

```ts filename="app/lib/session.ts"
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js filename="app/lib/session.js"
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

> **အကြံပြုချက်:** သင့် auth library မှာ refresh tokens တွေ ထောက်ပံ့မှု ရှိမရှိ စစ်ဆေးပါ — user ရဲ့ session ကို တိုးချဲ့ဖို့ သုံးနိုင်ပါတယ်။

#### Deleting the session (session ကို ဖျက်ခြင်း)

Session ကို ဖျက်ဖို့ — cookie ကို ဖျက်နိုင်ပါတယ်:

```ts filename="app/lib/session.ts"
import 'server-only'
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

```js filename="app/lib/session.js"
import 'server-only'
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

ပြီးရင် `deleteSession()` function ကို သင့် application ထဲမှာ ပြန်သုံးနိုင်ပါတယ် — ဥပမာ logout လုပ်တဲ့အခါ:

```ts filename="app/actions/auth.ts"
import { cookies } from 'next/headers'
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
```

```js filename="app/actions/auth.js"
import { cookies } from 'next/headers'
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
```

### Database Sessions

Database sessions တွေကို ဖန်တီးပြီး စီမံဖို့ — အောက်ပါ အဆင့်တွေကို လိုက်နာရပါမယ်:

1. Session နဲ့ data တွေကို သိမ်းဖို့ သင့် database ထဲမှာ table တစ်ခု ဖန်တီးပါ (သို့) သင့် Auth Library က ဒါကို ကိုင်တွယ်ပြီးသားလား စစ်ဆေးပါ။
2. Sessions တွေကို insert, update နဲ့ delete လုပ်ဖို့ လုပ်ဆောင်ချက်တွေ အကောင်အထည်ဖော်ပါ။
3. Session ID ကို user ရဲ့ browser ထဲမှာ မသိမ်းခင် encrypt လုပ်ပြီး — database နဲ့ cookie တွေ sync ဖြစ်နေကြောင်း သေချာပါစေ (ဒါက optional ဖြစ်ပေမယ့် [Proxy](#optimistic-checks-with-proxy-optional) ထဲမှာ optimistic auth checks တွေအတွက် အကြံပြုပါတယ်)။

ဥပမာ:

```ts filename="app/lib/session.ts"
import { cookies } from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js filename="app/lib/session.js"
import { cookies } from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

> **အကြံပြုချက်များ**:
>
> - ပိုမြန်အောင် — session ရဲ့ သက်တမ်းအတွက် server caching ထည့်သွင်း စဉ်းစားနိုင်ပါတယ်။ Session data တွေကို သင့် primary database ထဲမှာပဲ ထားပြီး — query အရေအတွက် လျှော့ဖို့ data requests တွေကို ပေါင်းစပ်နိုင်ပါတယ်။
> - User တစ်ယောက် နောက်ဆုံး login လုပ်ခဲ့တဲ့ အချိန် (သို့) active devices အရေအတွက်တွေကို ခြေရာခံခြင်း၊ (သို့) devices အားလုံးကနေ logout လုပ်နိုင်တဲ့ အခွင့်အရေး ပေးခြင်း စတဲ့ အဆင့်မြင့် use cases တွေအတွက် database sessions တွေကို ရွေးချယ်နိုင်ပါတယ်။

Session management ကို အကောင်အထည်ဖော်ပြီးတဲ့အခါ — သင့် application ထဲမှာ users တွေ ဘာတွေကို ဝင်ရောက်ခွင့်ရှိပြီး ဘာတွေ လုပ်ခွင့်ရှိလဲ ထိန်းချုပ်ဖို့ authorization logic တွေ ထည့်ဖို့ လိုပါမယ်။ ပိုလေ့လာဖို့ [Authorization](#authorization) section ကို ဆက်ကြည့်ပါ။

## Authorization (ခွင့်ပြုချက် စစ်ဆေးခြင်း)

User တစ်ယောက် authenticated ဖြစ်ပြီး session တစ်ခု ဖန်တီးပြီးတာနဲ့ — သင့် application ထဲမှာ user က ဘာတွေကို ဝင်ရောက်ခွင့်ရှိပြီး ဘာတွေ လုပ်ခွင့်ရှိလဲ ထိန်းချုပ်ဖို့ authorization ကို အကောင်အထည်ဖော်နိုင်ပါပြီ။

Authorization checks အဓိက နှစ်မျိုး ရှိပါတယ်:

1. **Optimistic**: Cookie ထဲမှာ သိမ်းထားတဲ့ session data တွေကို သုံးပြီး — user က route တစ်ခုကို ဝင်ရောက်ခွင့် (သို့) action တစ်ခု လုပ်ဆောင်ခွင့် ရှိမရှိ စစ်ဆေးခြင်း ဖြစ်ပါတယ်။ ဒီ checks တွေက မြန်ဆန်တဲ့ လုပ်ဆောင်ချက်တွေအတွက် အသုံးဝင်ပါတယ် — ဥပမာ permissions (သို့) roles တွေပေါ် မူတည်ပြီး UI elements တွေ ပြ/မပြ၊ users တွေကို redirect လုပ်တာမျိုးပါ။
2. **Secure**: Database ထဲမှာ သိမ်းထားတဲ့ session data တွေကို သုံးပြီး — user က route တစ်ခုကို ဝင်ရောက်ခွင့် (သို့) action တစ်ခု လုပ်ဆောင်ခွင့် ရှိမရှိ စစ်ဆေးခြင်း ဖြစ်ပါတယ်။ ဒီ checks တွေက ပိုလုံခြုံပြီး — sensitive data (သို့) actions တွေဆီ ဝင်ရောက်ဖို့ လိုအပ်တဲ့ လုပ်ဆောင်ချက်တွေအတွက် သုံးပါတယ်။

ကိစ္စ နှစ်ခုလုံးအတွက် အကြံပြုချက်တွေကတော့:

- သင့် authorization logic တွေကို ဗဟိုချုပ်ကိုင်ဖို့ [Data Access Layer](#creating-a-data-access-layer-dal) တစ်ခု ဖန်တီးခြင်း
- လိုအပ်တဲ့ data တွေကိုပဲ ပြန်ပေးဖို့ [Data Transfer Objects (DTO)](#using-data-transfer-objects-dto) တွေကို သုံးခြင်း
- Optimistic checks တွေ လုပ်ဖို့ [Proxy](#optimistic-checks-with-proxy-optional) ကို optional အနေနဲ့ သုံးခြင်း

### Optimistic checks with Proxy (Optional)

[Proxy](/docs/nextjs/file-conventions-proxy) ကို သုံးပြီး — permissions တွေပေါ် မူတည်ကာ users တွေကို redirect လုပ်ချင်တဲ့ case တချို့ ရှိပါတယ်:

- Optimistic checks တွေ လုပ်ဖို့ပါ။ Proxy က route တိုင်းပေါ်မှာ run တာမို့ — redirect logic တွေကို ဗဟိုချုပ်ကိုင်ဖို့နဲ့ unauthorized users တွေကို ကြိုတင် စစ်ထုတ်ဖို့ နည်းလမ်းကောင်းတစ်ခု ဖြစ်ပါတယ်။
- Users တွေကြားမှာ data တွေ မျှဝေထားတဲ့ static routes တွေကို ကာကွယ်ဖို့ပါ (ဥပမာ — paywall နောက်ကွယ်က content လိုမျိုး)။

ဒါပေမယ့် — Proxy က [prefetched](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching) routes တွေ အပါအဝင် route တိုင်းပေါ်မှာ run တာမို့ — cookie ကနေ session ကိုပဲ ဖတ်ဖို့ (optimistic checks) အရေးကြီးပြီး — performance ပြဿနာတွေ မဖြစ်အောင် database checks တွေကို ရှောင်ရှားပါ။

ဥပမာ:

```tsx filename="proxy.ts"
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

```js filename="proxy.js"
import { NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

Proxy က ကနဦး checks တွေအတွက် အသုံးဝင်နိုင်ပေမယ့် — သင့် data တွေကို ကာကွယ်ရာမှာ တစ်ခုတည်းသော ကာကွယ်ရေး လိုင်းအဖြစ်တော့ မထားသင့်ပါဘူး။ Security checks အများစုကို သင့် data source နဲ့ အတတ်နိုင်ဆုံး နီးကပ်တဲ့နေရာမှာ လုပ်ဆောင်သင့်ပါတယ် — အသေးစိတ်ကို [Data Access Layer](#creating-a-data-access-layer-dal) မှာ ကြည့်ပါ။

> **အကြံပြုချက်များ**:
>
> - Proxy ထဲမှာ `req.cookies.get('session')?.value` ကို သုံးပြီးလည်း cookies တွေကို ဖတ်နိုင်ပါတယ်။
> - Proxy က Node.js runtime ကို သုံးတာမို့ — သင့် Auth library နဲ့ session management library တွေ compatible ဖြစ်မဖြစ် စစ်ဆေးပါ။
> - Proxy ရဲ့ `matcher` property ကို သုံးပြီး — Proxy ဘယ် routes တွေပေါ်မှာ run သင့်လဲ သတ်မှတ်နိုင်ပါတယ်။ ဒါပေမယ့် — auth အတွက်တော့ Proxy က route အားလုံးပေါ်မှာ run ဖို့ အကြံပြုပါတယ်။

### Creating a Data Access Layer (DAL)

သင့် data requests နဲ့ authorization logic တွေကို ဗဟိုချုပ်ကိုင်ဖို့ — DAL တစ်ခု ဖန်တီးဖို့ အကြံပြုပါတယ်။

DAL ထဲမှာ — user က သင့် application နဲ့ အပြန်အလှန် ဆက်သွယ်တဲ့အခါ သူ့ရဲ့ session ကို verify လုပ်တဲ့ function တစ်ခု ပါသင့်ပါတယ်။ အနည်းဆုံးတော့ — function က session ကို valid ဖြစ်မဖြစ် စစ်ဆေးပြီး — နောက်ထပ် requests တွေ လုပ်ဖို့ လိုအပ်တဲ့ user အချက်အလက်တွေကို redirect လုပ်ခြင်း (သို့) ပြန်ပေးခြင်း လုပ်သင့်ပါတယ်။

ဥပမာ — သင့် DAL အတွက် `verifySession()` function တစ်ခု ပါတဲ့ file သီးခြားတစ်ခု ဖန်တီးပါ။ ပြီးရင် — React render pass တစ်ခုအတွင်း function ရဲ့ return value ကို memoize လုပ်ဖို့ React ရဲ့ [cache](https://react.dev/reference/react/cache) API ကို သုံးပါ:

```tsx filename="app/lib/dal.ts"
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

```js filename="app/lib/dal.js"
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

ပြီးရင် `verifySession()` function ကို သင့် data requests, Server Actions, Route Handlers တွေထဲမှာ invoke လုပ်နိုင်ပါတယ်:

```tsx filename="app/lib/dal.ts"
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

```jsx filename="app/lib/dal.js"
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

> **အကြံပြုချက်**:
>
> - DAL ကို request time မှာ fetch လုပ်တဲ့ data တွေကို ကာကွယ်ဖို့ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — users တွေကြားမှာ data တွေ မျှဝေထားတဲ့ static routes တွေအတွက်တော့ data ကို request time မှာ မဟုတ်ဘဲ build time မှာ fetch လုပ်ပါလိမ့်မယ်။ Static routes တွေကို ကာကွယ်ဖို့ [Proxy](#optimistic-checks-with-proxy-optional) ကို သုံးပါ။
> - Secure checks တွေအတွက် — session ID ကို သင့် database နဲ့ ယှဉ်ပြီး session valid ဖြစ်မဖြစ် စစ်ဆေးနိုင်ပါတယ်။ Render pass တစ်ခုအတွင်း database ဆီ မလိုအပ်တဲ့ duplicate requests တွေ မဖြစ်အောင် React ရဲ့ [cache](https://react.dev/reference/react/cache) function ကို သုံးပါ။
> - ဆက်စပ်နေတဲ့ data requests တွေကို — method တစ်ခုခု မခေါ်ခင် `verifySession()` ကို run ပေးတဲ့ JavaScript class တစ်ခုထဲမှာ စုစည်းချင်နိုင်ပါတယ်။

### Using Data Transfer Objects (DTO)

Data တွေ ပြန်ယူတဲ့အခါ — object တစ်ခုလုံး မဟုတ်ဘဲ သင့် application ထဲမှာ သုံးမယ့် လိုအပ်တဲ့ data တွေကိုပဲ ပြန်ပေးဖို့ အကြံပြုပါတယ်။ ဥပမာ — user data တွေ fetch လုပ်နေတယ်ဆိုရင် — passwords, phone numbers စတာတွေ ပါဝင်နိုင်တဲ့ user object တစ်ခုလုံး မဟုတ်ဘဲ — user ရဲ့ ID နဲ့ name တွေကိုပဲ ပြန်ပေးနိုင်ပါတယ်။

ဒါပေမယ့် — ပြန်လာတဲ့ data structure ကို ထိန်းချုပ်လို့ မရဘူး (သို့) client ဆီ object တစ်ခုလုံး ရောက်သွားတာကို ရှောင်ချင်တဲ့ team တစ်ခုမှာ အလုပ်လုပ်နေတယ်ဆိုရင် — client ဆီ ဘယ် fields တွေ ထုတ်ဖော်ပြသဖို့ အန္တရာယ် ကင်းလဲ သတ်မှတ်ပေးတာလို strategy တွေကို သုံးနိုင်ပါတယ်။

```tsx filename="app/lib/dto.ts"
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer: User) {
  return true
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // Return specific columns here
  })
  const user = data[0]

  const currentUser = await getUser(user.id)

  // Or return only what's specific to the query here
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

```js filename="app/lib/dto.js"
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer) {
  return true
}

function canSeePhoneNumber(viewer, team) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // Return specific columns here
  })
  const user = data[0]

  const currentUser = await getUser(user.id)

  // Or return only what's specific to the query here
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

သင့် data requests နဲ့ authorization logic တွေကို DAL တစ်ခုထဲမှာ ဗဟိုချုပ်ကိုင်ပြီး DTO တွေကို သုံးခြင်းအားဖြင့် — data requests အားလုံး secure နဲ့ consistent ဖြစ်ကြောင်း သေချာစေနိုင်ပြီး — သင့် application scale ဖြစ်လာတာနဲ့အမျှ ထိန်းသိမ်းရ, စစ်ဆေးရ (audit) နဲ့ debug လုပ်ရတာတွေ ပိုလွယ်ကူစေပါတယ်။

> **သိထားသင့်သည်**:
>
> - DTO တစ်ခုကို သတ်မှတ်ဖို့ နည်းလမ်း အနည်းငယ် ရှိပါတယ် — `toJSON()` သုံးတာကနေ အထက်က ဥပမာလို function တစ်ခုချင်းစီ သုံးတာ (သို့) JS classes တွေအထိပါ။ ဒါတွေက React (သို့) Next.js feature မဟုတ်ဘဲ JavaScript patterns တွေမို့ — သင့် application အတွက် အကောင်းဆုံး pattern ကို ရှာဖို့ ကိုယ်တိုင် သုတေသန လုပ်ဖို့ အကြံပြုပါတယ်။
> - Security အတွက် အကောင်းဆုံး အလေ့အကျင့်တွေကို ကျွန်တော်တို့ရဲ့ [Next.js မှာ Security အကြောင်း ဆောင်းပါး](https://nextjs.org/blog/security-nextjs-server-components-actions) မှာ လေ့လာနိုင်ပါတယ်။

### Server Components

[Server Components](/docs/nextjs/server-client-components) တွေထဲမှာ auth checks တွေက role-based access တွေအတွက် အသုံးဝင်ပါတယ်။ ဥပမာ — user ရဲ့ role ပေါ် မူတည်ပြီး components တွေကို condition ပေါ်မူတည်ကာ render လုပ်ဖို့:

```tsx filename="app/dashboard/page.tsx"
import { verifySession } from '@/app/lib/dal'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role // Assuming 'role' is part of the session object

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

```jsx filename="app/dashboard/page.jsx"
import { verifySession } from '@/app/lib/dal'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role // Assuming 'role' is part of the session object

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

ဒီ ဥပမာမှာ — ကျွန်တော်တို့ရဲ့ DAL ကနေ `verifySession()` function ကို သုံးပြီး 'admin', 'user' နဲ့ unauthorized roles တွေကို စစ်ဆေးပါတယ်။ ဒီ pattern က user တစ်ဦးချင်းစီက သူ့ရဲ့ role နဲ့ ကိုက်ညီတဲ့ components တွေနဲ့ပဲ အပြန်အလှန် ဆက်သွယ်ကြောင်း သေချာစေပါတယ်။

### Layouts နဲ့ auth checks

[Partial Rendering](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions) ကြောင့် — [Layouts](/docs/nextjs/file-conventions-layout) တွေထဲမှာ checks တွေ လုပ်တဲ့အခါ သတိထားပါ — ဒါတွေက navigation မှာ ပြန် render မဖြစ်တာမို့ — route ပြောင်းတိုင်း user session ကို စစ်ဆေးမှာ မဟုတ်ပါဘူး။

Layout တစ်ခုက ကျန် route တစ်ခုလုံး render ဖြစ်မဖြစ်ကိုလည်း ထိန်းချုပ်မထားပါဘူး။ Route segments နဲ့ [parallel route slots](/docs/nextjs/parallel-routes) တွေကို router က render လုပ်တာမို့ — သူတို့ကို ဖျောက်တဲ့ (သို့) လဲလှယ်တဲ့ layout တစ်ခုက — သူတို့ run လုပ်တာ (သို့) [RSC Payload](https://nextjs.org/docs/app/glossary#rsc-payload) ထဲမှာ ပေါ်လာတာကို မရပ်တန့်နိုင်ပါဘူး။

ဒါကြောင့် — checks တွေကို သင့် data source (သို့) condition ပေါ်မူတည်ပြီး render လုပ်မယ့် component နဲ့ နီးကပ်တဲ့နေရာမှာ လုပ်ဆောင်သင့်ပါတယ်။

ဥပမာ — user data တွေကို fetch လုပ်ပြီး nav တစ်ခုထဲမှာ user image ကို ပြတဲ့ shared layout တစ်ခုကို စဉ်းစားကြည့်ပါ။ Layout ထဲမှာ auth check လုပ်မယ့်အစား — layout ထဲမှာ user data (`getUser()`) ကို fetch လုပ်ပြီး auth check ကို သင့် [DAL](#creating-a-data-access-layer-dal) ထဲမှာ လုပ်သင့်ပါတယ်။

ဒါက သင့် application ထဲမှာ `getUser()` ကို ဘယ်နေရာမှာ ခေါ်ခေါ် — auth check လုပ်ဆောင်ခံရကြောင်း အာမခံပြီး — developer တွေ user က data ကို ဝင်ရောက်ဖို့ authorized ဖြစ်မဖြစ် စစ်ဆေးဖို့ မေ့သွားတာမျိုးကို ကာကွယ်ပေးပါတယ်။

#### Auth နဲ့ streaming

Session နဲ့ user data တွေက မကြာခဏဆိုသလို — routes တွေအနှံ့ ထပ်ခါထပ်ခါ ပေါ်နေတဲ့ shell UI (header, nav) တွေထဲမှာ ပေါ်တတ်ပါတယ်။ Layout တစ်ခုထဲမှာ `cookies()`, `headers()` (သို့) DAL ပေါ်မှာ top-level `await` လုပ်တာက — အဲဒီ segment အတွက် ပထမဆုံး streamed chunk ကို နှောင့်နှေးစေပြီး `{children}` ကို အဲဒီ အလုပ်နောက်မှာ ချုပ်နှောင်ထားပါတယ်။

Shell ရဲ့ အစိတ်အပိုင်းတစ်ချို့ပဲ session data လိုအပ်တယ်ဆိုရင် (ဥပမာ — user menu တစ်ခု) — `await` ကို nested Server Component တစ်ခုထဲကို ရွှေ့ပြီး — ကျန် page တွေ အရင်ဆုံး stream ဖြစ်နိုင်အောင် `<Suspense>` နဲ့ wrap လုပ်ပါ။ ဒီ pattern အတွက် [Dynamic access တွေကို အောက်သို့ တွန်းချခြင်း](/docs/nextjs/streaming) ကို ကြည့်ပါ။

Client Components တွေက DAL ကို import မလုပ်နိုင်ပါဘူး။ `verifySession()`, `getUser()` (သို့) အလားတူတွေကို parent Server Component တစ်ခုထဲမှာ run လုပ်ပြီး — data တွေကို props (သို့) context provider တစ်ခုကတစ်ဆင့် client children တွေဆီ ပို့ပေးပါ။ ဒီ pattern အတွက် [Context Provider တစ်ခုအတွင်းမှာ React ရဲ့ `use` ကို သုံးခြင်း](https://nextjs.org/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider) ကို ကြည့်ပြီး — sensitive session fields တွေ client ဆီ မရောက်အောင် React ရဲ့ [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) API ကို သုံးပါ။

#### Page components တွေထဲမှာ auth checks

ဥပမာ — dashboard page တစ်ခုမှာ user session ကို verify လုပ်ပြီး user data တွေကို fetch လုပ်နိုင်ပါတယ်:

```tsx filename="app/dashboard/page.tsx"
import { verifySession } from '@/app/lib/dal'

export default async function DashboardPage() {
  const session = await verifySession()

  // Fetch user-specific data from your database or data source
  const user = await getUserData(session.userId)

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

```jsx filename="app/dashboard/page.jsx"
import { verifySession } from '@/app/lib/dal'

export default async function DashboardPage() {
  const session = await verifySession()

  // Fetch user-specific data from your database or data source
  const user = await getUserData(session.userId)

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

#### Leaf components တွေထဲမှာ auth checks

User permissions တွေပေါ် မူတည်ပြီး UI elements တွေကို condition ပေါ်မူတည်ကာ render လုပ်တဲ့ leaf components တွေထဲမှာလည်း auth checks တွေ လုပ်နိုင်ပါတယ်။ ဥပမာ — admin-only actions တွေကို ပြတဲ့ component တစ်ခု:

```tsx filename="app/ui/admin-actions.tsx"
import { verifySession } from '@/app/lib/dal'

export default async function AdminActions() {
  const session = await verifySession()
  const userRole = session?.user?.role

  if (userRole !== 'admin') {
    return null
  }

  return (
    <div>
      <button>Delete User</button>
      <button>Edit Settings</button>
    </div>
  )
}
```

```jsx filename="app/ui/admin-actions.jsx"
import { verifySession } from '@/app/lib/dal'

export default async function AdminActions() {
  const session = await verifySession()
  const userRole = session?.user?.role

  if (userRole !== 'admin') {
    return null
  }

  return (
    <div>
      <button>Delete User</button>
      <button>Edit Settings</button>
    </div>
  )
}
```

ဒီ pattern က user permissions တွေပေါ် မူတည်ပြီး UI elements တွေကို ပြ/မပြ ထိန်းချုပ်နိုင်စေပြီး — auth check က component တစ်ခုချင်းစီရဲ့ render time မှာ ဖြစ်ကြောင်း သေချာစေပါတယ်။

> **သိထားသင့်သည်:**
>
> - SPA တွေမှာ အသုံးများတဲ့ pattern တစ်ခုက — user authorized မဟုတ်ရင် layout (သို့) top-level component တစ်ခုထဲမှာ `null` return လုပ်တာပါ။ ဒီ pattern ကို **အကြံမပြုပါဘူး** — Next.js applications တွေမှာ entry points အများအပြား ရှိလို့ — nested route segments နဲ့ Server Actions တွေကို ဝင်ရောက်တာကို ဒါက မတားဆီးနိုင်ပါဘူး။
> - ဒီ components တွေကနေ ခေါ်တဲ့ Server Actions တိုင်းက — ကိုယ်ပိုင် authorization checks တွေလည်း လုပ်ဆောင်ကြောင်း သေချာပါစေ — client-side UI ကန့်သတ်ချက်တွေတစ်ခုတည်းက security အတွက် မလုံလောက်ပါဘူး။

### Server Actions

[Server Actions](https://nextjs.org/docs/app/guides/server-actions) တွေကို — public-facing API endpoints တွေလိုပဲ security ထည့်သွင်း စဉ်းစားပြီး — user က mutation တစ်ခု လုပ်ဆောင်ဖို့ ခွင့်ပြုချက် ရှိမရှိ verify လုပ်ပါ။

အောက်က ဥပမာမှာ — action ကို ဆက်လုပ်ခွင့် မပြုခင် user ရဲ့ role ကို စစ်ဆေးပါတယ်:

```ts filename="app/lib/actions.ts"
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction(formData: FormData) {
  const session = await verifySession()
  const userRole = session?.user?.role

  // Return early if user is not authorized to perform the action
  if (userRole !== 'admin') {
    return null
  }

  // Proceed with the action for authorized users
}
```

```js filename="app/lib/actions.js"
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction() {
  const session = await verifySession()
  const userRole = session.user.role

  // Return early if user is not authorized to perform the action
  if (userRole !== 'admin') {
    return null
  }

  // Proceed with the action for authorized users
}
```

### Route Handlers

[Route Handlers](/docs/nextjs/file-conventions-route) တွေကိုလည်း — public-facing API endpoints တွေလိုပဲ security ထည့်သွင်း စဉ်းစားပြီး — user က Route Handler ကို ဝင်ရောက်ခွင့် ရှိမရှိ verify လုပ်ပါ။

ဥပမာ:

```ts filename="app/api/route.ts"
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // User authentication and role verification
  const session = await verifySession()

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    return new Response(null, { status: 401 })
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    // User is authenticated but does not have the right permissions
    return new Response(null, { status: 403 })
  }

  // Continue for authorized users
}
```

```js filename="app/api/route.js"
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // User authentication and role verification
  const session = await verifySession()

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    return new Response(null, { status: 401 })
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    // User is authenticated but does not have the right permissions
    return new Response(null, { status: 403 })
  }

  // Continue for authorized users
}
```

အထက်က ဥပမာက — security check အဆင့် နှစ်ဆင့် ပါတဲ့ Route Handler တစ်ခုကို ပြသပါတယ်။ ပထမဆုံး active session တစ်ခု ရှိမရှိ စစ်ဆေးပြီး — နောက်မှ login ဝင်ထားတဲ့ user က 'admin' ဟုတ်မဟုတ် verify လုပ်ပါတယ်။

## Resources (အရင်းအမြစ်များ)

အခု Next.js မှာ authentication အကြောင်း လေ့လာပြီးပြီမို့ — secure authentication နဲ့ session management တွေ အကောင်အထည်ဖော်ဖို့ ကူညီပေးမယ့် Next.js-compatible libraries နဲ့ resources တွေက ဒီမှာ ရှိပါတယ်:

### Auth Libraries

- [Auth0](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Better Auth](https://www.better-auth.com/docs/integrations/next)
- [Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Descope](https://docs.descope.com/getting-started/nextjs)
- [Kinde](https://kinde.com/docs/developer-tools/nextjs-sdk)
- [Logto](https://docs.logto.io/quick-starts/next-app-router)
- [NextAuth.js](https://authjs.dev/getting-started/installation?framework=next.js)
- [Ory](https://www.ory.sh/docs/getting-started/integrate-auth/nextjs)
- [Stack Auth](https://docs.stack-auth.com/getting-started/setup)
- [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Stytch](https://stytch.com/docs/guides/quickstarts/nextjs)
- [WorkOS](https://workos.com/docs/user-management/nextjs)

### Session Management Libraries

- [Iron Session](https://github.com/vvo/iron-session)
- [Jose](https://github.com/panva/jose)

## ထပ်ဆင့် လေ့လာစရာများ

Authentication နဲ့ security အကြောင်း ဆက်လေ့လာဖို့ — အောက်ပါ resources တွေကို ကြည့်ပါ:

- [Next.js မှာ security အကြောင်း ဘယ်လို တွေးမလဲ](https://nextjs.org/blog/security-nextjs-server-components-actions)
- [XSS Attacks တွေကို နားလည်ခြင်း](https://vercel.com/guides/understanding-xss-attacks)
- [CSRF Attacks တွေကို နားလည်ခြင်း](https://vercel.com/guides/understanding-csrf-attacks)
- [The Copenhagen Book](https://thecopenhagenbook.com/)
