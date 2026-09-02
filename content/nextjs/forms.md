---
title: "Forms (Form များနဲ့ Mutations)"
description: "React Server Actions တွေကို form တွေမှာ သုံးပြီး data mutation လုပ်ခြင်း — form action, useActionState, useFormStatus, validation, error handling နဲ့ progressive enhancement"
order: 22
source: "https://nextjs.org/docs/app/guides/forms"
status: translated
updated: 2026-09-02
---

React **Server Actions** တွေဆိုတာ server ပေါ်မှာ run လုပ်တဲ့ [Server Functions](https://react.dev/reference/rsc/server-functions) တွေပါ — form submissions တွေကို ကိုင်တွယ်ဖို့ Server ရော Client Components တွေထဲကနေပါ ခေါ်လို့ရပါတယ်။ ဒီ guide မှာ Server Actions သုံးပြီး Next.js မှာ forms တွေ ဘယ်လို ဆောက်ရမလဲ အဆင့်ဆင့် ကြည့်ပါမယ်။ (Form တွေအပြင် Server Actions ရဲ့ အခြား behaviors တွေ — single-roundtrip response, sequential dispatch, security, deployment — အတွက်ကတော့ [Server Actions guide](https://nextjs.org/docs/app/guides/server-actions) ကို ကြည့်ပါ။)

> [!WARNING]
> Form ကို authenticated page ပေါ်မှာပဲ render လုပ်ထားရင်တောင် — Server Action တစ်ခုစီအတွင်းမှာ [authentication နဲ့ authorization](https://nextjs.org/docs/app/guides/authentication) ကို အမြဲ verify လုပ်ပါ။

## ဘယ်လို အလုပ်လုပ်လဲ (How It Works)

React က HTML ရဲ့ [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) element ကို ချဲ့ထွင်ပြီး — [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#action) attribute ကတစ်ဆင့် Server Actions တွေကို ခေါ်ယူနိုင်အောင် လုပ်ပေးထားပါတယ်။

Form တစ်ခုထဲမှာ သုံးတဲ့အခါ function က [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) object ကို အလိုအလျောက် လက်ခံရရှိပြီး — native [`FormData methods`](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods) တွေနဲ့ data တွေကို ထုတ်ယူနိုင်ပါတယ်:

```tsx
import { auth } from '@/lib/auth'

export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate the cache
  }

  return <form action={createInvoice}>...</form>
}
```

> **Good to know:** Field အများအပြား ပါတဲ့ forms တွေမှာ JavaScript ရဲ့ [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) ကို သုံးနိုင်ပါတယ် — ဥပမာ `const rawFormData = Object.fromEntries(formData)`။ ဒါပေမယ့် ဒီ object ထဲမှာ `$ACTION_` နဲ့ စတဲ့ extra properties တွေ ပါလာမယ်ဆိုတာ သတိပြုပါ။

Form ထဲမှာ Server Function ကို `action` အနေနဲ့ တိုက်ရိုက် ပေးထားရင် — submission က native form submission အနေနဲ့ အလုပ်လုပ်နိုင်လို့ **JavaScript မလိုအပ်ဘဲ** (သို့) JS load မဖြစ်သေးခင် တောင်မှ server function ကို ခေါ်နိုင်ပါတယ် (progressive enhancement)။ JavaScript ရောက်လာတဲ့အခါ React က ဒီအတွေ့အကြုံကို ပိုမို smooth ဖြစ်အောင် မြှင့်တင်ပေးပါတယ် — form submission ကို ကြားဖြတ်ပြီး client-side ကနေ စီမံကာ ပြန်လာတဲ့ state/UI updates တွေကို ချောမွေ့စွာ ပေါင်းစပ်ပေးပါတယ်။

ဒီပုံစံမှာ `'use server'` directive ကို Server Component ထဲမှာ inline သတ်မှတ်ထားတဲ့ `async` function ရဲ့ အစမှာ ထည့်ထားတာကို သတိပြုပါ — ဒါက ဒီ function ကို server-side မှာ run လုပ်မယ့် Server Action အဖြစ် မှတ်ပေးပါတယ်။ ဒါမှမဟုတ် `'use server'` ကို file တစ်ခုရဲ့ ထိပ်ဆုံးမှာ ထားပြီး — အဲဒီ file ကနေ export လုပ်ထားတဲ့ functions အားလုံးကို Server Actions အဖြစ် အသုံးပြုနိုင်ပါတယ် (အောက်က `bind` ဥပမာထဲက `app/actions.ts` လိုမျိုး)။

Mutation လုပ်ပြီးရင် — ပုံမှန်အားဖြင့် cache ကို revalidate လုပ်ပြီး UI ကို နောက်ဆုံး data နဲ့ ပြန်လည် ပေါင်းစပ်ပေးရပါတယ် (`// revalidate the cache` နေရာမှာ) — အသေးစိတ်ကို [Revalidating](/docs/nextjs/revalidating) page မှာ ဖတ်နိုင်ပါတယ်။

## အပိုဆောင်း arguments တွေ ပေးပို့ခြင်း

Form fields တွေအပြင် — JavaScript ရဲ့ [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) method သုံးပြီး Server Function တစ်ခုကို arguments အပိုတွေ ပေးပို့နိုင်ပါတယ်။ ဥပမာ `updateUser` Server Function ဆီ `userId` argument ပို့ဖို့:

```tsx
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  )
}
```

Server Function က `userId` ကို အပိုဆောင်း argument အဖြစ် လက်ခံရရှိပါတယ်:

```ts
'use server'

export async function updateUser(userId: string, formData: FormData) {}
```

ဒီနေရာမှာ `bind(null, userId)` က function အသစ်တစ်ခုကို ပြန်ထုတ်ပေးပြီး — submit ဖြစ်တဲ့အခါ `userId` ကို ပထမဆုံး argument အနေနဲ့ ရှေ့ကနေ ထည့်ပေးလိုက်ပြီး form ထဲက `FormData` က နောက်ဆုံးမှာ လိုက်ပါလာပါတယ်။ ဒါကြောင့် ဥပမာ — user တစ်ယောက်ချင်းစီရဲ့ profile form မှာ သူ့ရဲ့ `userId` ကို form field အဖြစ် မထည့်ဘဲ action ဆီ တိုက်ရိုက် ပို့နိုင်ပါတယ်။

> **Good to know:**
>
> - တခြားနည်းတစ်ခုက arguments တွေကို hidden input fields အဖြစ် ထည့်တာပါ — ဥပမာ `<input type="hidden" name="userId" value={userId} />`။ ဒါပေမယ့် value က rendered HTML ထဲမှာ ပါသွားပြီး encode မလုပ်ထားပါဘူး။
> - `bind` က Server ရော Client Components တွေမှာပါ အလုပ်လုပ်ပြီး — **progressive enhancement** ကို ပံ့ပိုးပေးပါတယ်။

## Form Validation (Form စစ်ဆေးခြင်း)

Forms တွေကို client (သို့) server ပေါ်မှာ validate လုပ်နိုင်ပါတယ်:

- **Client-side validation** အတွက် — `required`, `type="email"` လို HTML attributes တွေကို basic validation အဖြစ် သုံးနိုင်ပါတယ်။ ဒါက user ကို ချက်ချင်း feedback ပေးနိုင်လို့ UX ကောင်းပေမယ့် — client ပေါ်က validation ကို ကျော်ဖြတ်လို့လွယ်တာမို့ data ရဲ့ မှန်ကန်မှုအတွက် server-side validation ကိုပါ တွဲသုံးဖို့ အရေးကြီးပါတယ်။
- **Server-side validation** အတွက် — [Zod](https://zod.dev/) (သို့) [Valibot](https://valibot.dev/) လို schema validation library တွေနဲ့ form fields တွေကို validate လုပ်နိုင်ပါတယ်။ ဥပမာ:

```tsx
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mutate data
}
```

## Validation Errors ပြသခြင်း

Validation errors (သို့) messages တွေကို ပြသဖို့ — `<form>` ကို သတ်မှတ်တဲ့ component ကို Client Component အဖြစ် ပြောင်းပြီး React ရဲ့ [`useActionState`](https://react.dev/reference/react/useActionState) ကို သုံးပါ။

`useActionState` သုံးတဲ့အခါ — Server function ရဲ့ signature က ပထမဆုံး argument အနေနဲ့ `prevState` (သို့) `initialState` parameter အသစ် တစ်ခု လက်ခံရအောင် ပြောင်းသွားပါတယ်:

```tsx
'use server'

import { z } from 'zod'

export async function createUser(initialState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })
  // ...
}
```

ပြီးတော့ `state` object ကို ကြည့်ပြီး error message တွေကို condition ပေါ်မူတည်ပြီး render လုပ်နိုင်ပါတယ်:

```tsx
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

ဒီနေရာမှာ `useActionState` က `[state, formAction, pending]` ဆိုတဲ့ array ကို ပြန်ပေးပါတယ် — action ကို wrap လုပ်ပြီး server ကနေ return လုပ်လာတဲ့ တန်ဖိုးကို `state` အဖြစ် သိမ်းပေးတာမို့ submit တစ်ခါ လုပ်တိုင်း state က နောက်ဆုံး action ရဲ့ result နဲ့ update ဖြစ်သွားပါတယ်။ ပထမဆုံး ပေးလိုက်တဲ့ `initialState` က စတင် render ချိန်မှာ သုံးမယ့် state ဖြစ်ပြီး — error message တွေကို `<p aria-live="polite">` ထဲမှာ ပြထားတာမို့ screen readers တွေက error တက်လာတာကို ကြေညာပေးနိုင်ပါတယ်။ Error state တွေကို `state?.message` လို conditional rendering နဲ့ ပြသနိုင်ပြီး — validation error တွေကို action ထဲကနေ return လုပ်တဲ့ပုံစံအကြောင်း နောက်ထပ် အသေးစိတ်ကို [Error Handling](/docs/nextjs/error-handling) page မှာ ဖတ်နိုင်ပါတယ်။

## Pending States (လုပ်ဆောင်နေစဉ် အခြေအနေပြခြင်း)

[`useActionState`](https://react.dev/reference/react/useActionState) hook က `pending` boolean ကို ထုတ်ပေးပြီး — action run လုပ်နေချိန်မှာ loading indicator ပြဖို့ (သို့) submit button ကို disable လုပ်ဖို့ သုံးနိုင်ပါတယ်:

```tsx
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      {/* Other form elements */}
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

တခြားနည်းကတော့ — action run နေချိန်မှာ loading indicator ပြဖို့ [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) hook ကို သုံးတာပါ။ ဒီ hook သုံးရင် loading indicator ကို render လုပ်ဖို့ component သပ်သပ် ခွဲထုတ်ရပါတယ် — ဥပမာ action pending ဖြစ်ချိန်မှာ button ကို disable လုပ်ဖို့:

```tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      Sign Up
    </button>
  )
}
```

ပြီးတော့ `SubmitButton` component ကို form ရဲ့ အတွင်းမှာ nest လုပ်ပါ:

```tsx
import { SubmitButton } from './button'
import { createUser } from '@/app/actions'

export function Signup() {
  return (
    <form action={createUser}>
      {/* Other form elements */}
      <SubmitButton />
    </form>
  )
}
```

`useActionState` နဲ့ `useFormStatus` ရဲ့ ကွာခြားချက်က — `useActionState` ရဲ့ `pending` က wrap လုပ်ထားတဲ့ action တစ်ခုတည်းအတွက်ပဲ ဖြစ်ပြီး၊ `useFormStatus` ကတော့ သူ့ကို ဖွင့်ထားတဲ့ component က `<form>` ရဲ့ အတွင်းမှာ render ဖြစ်နေရင် — အဲဒီ form ရဲ့ action က run နေချိန် `pending: true` ပြန်ပေးပါတယ်။ ဒါကြောင့် form တစ်ခုလုံးရဲ့ submit state ပေါ်မူတည်ပြီး button (သို့) အခြား element တွေကို ထိန်းချုပ်ချင်ရင် `useFormStatus` က ပိုအဆင်ပြေပြီး — action တစ်ခုချင်းစီရဲ့ state လိုအပ်ရင် `useActionState` ကို သုံးပါတယ်။

> **Good to know:** React 19 မှာ `useFormStatus` က data, method, action စတဲ့ keys အပိုတွေပါ ပြန်ပေးပါတယ် — React 19 မသုံးရင်တော့ `pending` key တစ်ခုပဲ ရပါတယ်။

> **Good to know:** **experimental** [`useOffline`](https://nextjs.org/docs/app/guides/offline-support) config ဖွင့်ထားရင် — connectivity ပြတ်လို့ Server Action ရပ်သွားရင်တောင် action က pending အနေနဲ့ ဆက်ရှိနေပြီး network ပြန်ရတာနဲ့ ပြီးဆုံးသွားပါတယ် — user ရဲ့ submission မပျောက်ပါဘူး။

## Optimistic Updates

Server Function ရဲ့ response ကို မစောင့်ဘဲ UI ကို ချက်ချင်း update လုပ်ချင်ရင် — React ရဲ့ [`useOptimistic`](https://react.dev/reference/react/useOptimistic) hook ကို သုံးနိုင်ပါတယ်:

```tsx
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
  message: string
}

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [...state, { message: newMessage }])

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

ဒီပုံစံမှာ `useOptimistic` က `[optimisticMessages, addOptimisticMessage]` ဆိုတဲ့ array ကို ပြန်ပေးပါတယ် — `addOptimisticMessage` ခေါ်လိုက်တာနဲ့ UI ထဲမှာ ပေးလိုက်တဲ့ value က ချက်ချင်း ပေါ်သွားပြီး server response ကို မစောင့်ပါဘူး။ Server Function ပြီးဆုံးပြီး actual state ရောက်လာတဲ့အခါ — React က optimistic value ကို နောက်ဆုံး state နဲ့ အလိုအလျောက် ပေါင်းစပ် အစားထိုးပေးပါတယ်။ Chat message ပို့တာ၊ like နှိပ်တာလို — ချက်ချင်း feedback မရရင် နှေးခနဲ့ ခံစားရမယ့် interactions တွေအတွက် သင့်တော်ပါတယ်။

## Nested Form Elements

`<form>` ရဲ့ အတွင်းမှာ nest လုပ်ထားတဲ့ `<button>`, `<input type="submit">`, `<input type="image">` လို elements တွေကနေလည်း Server Actions တွေကို ခေါ်နိုင်ပါတယ် — ဒီ elements တွေက `formAction` prop (သို့) event handlers တွေကို လက်ခံပါတယ်။

Form တစ်ခုအတွင်းမှာ Server Actions အများအပြား ခေါ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ် — ဥပမာ post တစ်ခုကို publish လုပ်တဲ့ button အပြင် draft သိမ်းတဲ့ button သပ်သပ် ဖန်တီးတာမျိုးပါ။ အသေးစိတ်ကို [React `<form>` docs](https://react.dev/reference/react-dom/components/form#handling-multiple-submission-types) မှာ ကြည့်ပါ။

## Programmatic Form Submission

[`requestSubmit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit) method သုံးပြီး form submission ကို code ကနေ အလိုအလျောက် စတင်နိုင်ပါတယ် — ဥပမာ user က `⌘` + `Enter` keyboard shortcut နဲ့ form submit လုပ်တဲ့အခါ `onKeyDown` event ကို နားထောင်ပြီး:

```tsx
'use client'

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

ဒါက အနီးဆုံး `<form>` ancestor ရဲ့ submission ကို စတင်စေပြီး — Server Function ကို invoke လုပ်ပါလိမ့်မယ်။

## နောက်တစ်ဆင့်တွေ

- [Error Handling](/docs/nextjs/error-handling) — expected errors တွေကို useActionState နဲ့ ကိုင်တွယ်ခြင်း
- [Data Fetching](/docs/nextjs/data-fetching) — server မှာ data ယူခြင်း အခြေခံ
- [Revalidating](/docs/nextjs/revalidating) — mutation ပြီးနောက် cache ကို ပြန်လည် စစ်ဆေးခြင်း
