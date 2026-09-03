---
title: "Preserving UI state (navigations ကြားမှာ UI state ထိန်းသိမ်းခြင်း)"
description: "Next.js က Cache Components နဲ့ React Activity ကို သုံးပြီး navigations ကြားမှာ page state နဲ့ DOM ကို ဘယ်လို ထိန်းသိမ်းပေးလဲ — ဘာတွေကို ထိန်းထားသင့်/ပြန်စက်သင့်လဲ (expandable UI, dialog, forms), state နဲ့ authentication, global styles, testing နဲ့ ကိုယ်ပိုင် components တွေထဲမှာ Activity သုံးနည်း"
order: 229
source: "https://nextjs.org/docs/app/guides/preserving-ui-state"
status: translated
updated: 2026-09-03
---

> **သိထားသင့်သည်:** ဒီ guide က [Cache Components](/docs/nextjs/caching) enable လုပ်ထားတယ်လို့ ယူဆပါတယ်။ သင့် Next config file ထဲမှာ [`cacheComponents: true`](/docs/nextjs/next-config-cache-components) ဆိုပြီး သတ်မှတ်ခြင်းဖြင့် enable လုပ်နိုင်ပါတယ်။

Cache Components မတိုင်ခင် — navigations ကြားမှာ page-level state ကို ထိန်းသိမ်းဖို့ဆိုရင် — state ကို [shared layout](https://nextjs.org/docs/app/getting-started/layouts-and-pages#nesting-layouts) တစ်ခုဆီ ရွှေ့တင်တာ (hoisting) (သို့) external store တစ်ခု သုံးတာလိုမျိုး workaround တွေ လိုအပ်ပါတယ်။ Cache Components နဲ့ဆိုရင် — Next.js က state ရော DOM ကိုပါ အလိုအလျောက် (out of the box) ထိန်းသိမ်းပေးပါတယ်။

Navigation လုပ်တဲ့အခါ pages တွေကို unmount လုပ်မယ့်အစား — Next.js က React ရဲ့ [`<Activity>`](https://react.dev/reference/react/Activity) component ကို သုံးပြီး သူတို့ကို ဝှက်ထားပါတယ်။ Activity က DOM ကို document ထဲမှာ (`display: none` နဲ့ ဝှက်ထားပြီး) ဆက်ထိန်းထားလို့ — React state ရော DOM state ပါ ထိန်းသိမ်းခံရပါတယ်: form draft တွေ, scroll positions တွေ, ဖွင့်ထားတဲ့ `<details>` elements တွေ, video playback progress စတာတွေ အားလုံး ပါဝင်ပါတယ်။

Next.js က route 3 ခုအထိ ထိန်းသိမ်းပေးပါတယ်။ ဒါထက် ကျော်လွန်ရင် — အသက်အကြီးဆုံး route ကို ဖယ်ရှား (evict) လိုက်ပြီး — နောက်တစ်ကြိမ် ဝင်လာရင် အသစ်အနေနဲ့ ပြန် render လုပ်ပါလိမ့်မယ်။

> **သိထားသင့်သည်:** [`useRouter().bfcacheId`](/docs/nextjs/use-router#bfcacheid) ကို [React `key`](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) တစ်ခုအနေနဲ့ သုံးပါ: `<Fragment key={bfcacheId}>` တစ်ခုတည်းက push (သို့) replace navigations တွေ (`<Link>` clicks နဲ့ `router.push` / `router.replace` အပါအဝင်) မှာ subtree တစ်ခုလုံးကို reset လုပ်ပေးပြီး — browser back/forward တွေမှာတော့ state ကို ပြန်ထိန်းပေးပါတယ်။ `bfcacheId` က အဓိကအားဖြင့် migration tool တစ်ခုပါ။ Code အသစ်တွေအတွက်တော့ — အောက်က per-pattern resets တွေကို ဦးစားပေးပါ။

## ဘာတွေကို ထိန်းသိမ်းမလဲ ရွေးချယ်ခြင်း

Activity က component state နဲ့ DOM state အားလုံးကို default အနေနဲ့ ထိန်းသိမ်းပါတယ်။ State တစ်ခုချင်းစီအတွက် — အဲဒါက သင့် UI အတွက် မှန်ကန်တဲ့ အပြုအမူလားဆိုတာ သင်ကိုယ်တိုင် ဆုံးဖြတ်ရပါတယ်။ အောက်က patterns တွေက အသုံးများတဲ့ အခြေအနေတွေနဲ့ — ဘယ်အခါ ထိန်းထား၊ ဘယ်အခါ ပြန်စက်ရမလဲဆိုတဲ့ ဘက်နှစ်ဘက်စလုံးကို ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာ ပြပါတယ်။

### Expandable UI (dropdown, accordion, panel များ)

User က အခြားနေရာကို navigate လုပ်ပြီး ပြန်လာတဲ့အခါ — Activity က expandable elements တွေရဲ့ ဖွင့်/ပိတ် state ကို ထိန်းသိမ်းပေးပါတယ်။

**ဘယ်အခါ ထိန်းထားသင့်လဲ:** Sections တွေ ချဲ့ထားတဲ့ sidebar, FAQ accordion (သို့) filters panel တစ်ခုမျိုးပါ။ User က သူ့ view ကို ရည်ရွယ်ချက်ရှိရှိ ပြင်ဆင်ထားတာမို့ — အဲဒါကို ပြန်ထိန်းပေးတာက အဲဒီအလုပ်တွေကို ထပ်မလုပ်ရအောင် ရှောင်ပေးပါတယ်။

**ဘယ်အခါ ပြန်စက်သင့်လဲ:** Button click နဲ့ ပေါ်လာတဲ့ dropdown menu (သို့) popover တစ်ခုမျိုးပါ။ ဒါတွေက ခဏတာ (transient) interaction တွေဖြစ်ပြီး — မြဲနေတဲ့ view state မဟုတ်ပါဘူး။ Page တစ်ခုဆီ ပြန်လာတဲ့အခါ dropdown က ဖွင့်ပြီးသား ဖြစ်နေတာက user friendly မဟုတ်ပါဘူး။

ခဏတာ open/closed state တွေကို reset လုပ်ဖို့ — `useLayoutEffect` cleanup function တစ်ခုထဲမှာ ပိတ်လိုက်ပါ:

```tsx highlight={8-13}
'use client'

import { useState, useLayoutEffect } from 'react'

function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  // Component ဝှက်ခံရတဲ့အခါ dropdown ကို ပိတ်ပါ
  useLayoutEffect(() => {
    return () => {
      setIsOpen(false)
    }
  }, [])

  return (
    <div>
      <button onClick={() => setIsOpen((o) => !o)}>Options</button>
      {isOpen && (
        <ul>
          <li>
            <button>Edit Profile</button>
          </li>
          <li>
            <button>Change Password</button>
          </li>
        </ul>
      )}
    </div>
  )
}
```

Activity က ဒီ component ကို ဝှက်လိုက်တဲ့အခါ — cleanup function က run ပြီး `isOpen` ကို reset လုပ်ပါတယ်။ Page က ပြန်မြင်ရတဲ့အခါ — dropdown က ပိတ်ထားတဲ့ အနေအထားပါ။ `useLayoutEffect` သုံးတာက cleanup က component ကို မဝှက်ခင် synchronously run ဖြစ်အောင် သေချာစေလို့ — stale state တွေ တစ်ခဏမျှ ပေါ်လာတာ (flash) မဖြစ်စေပါဘူး။

Navigation link တစ်ခုကို click လုပ်တဲ့အခါ dropdown တွေကို ချက်ချင်း ပိတ်ဖို့ — `Link` ရဲ့ [`onNavigate`](/docs/nextjs/component-link#onnavigate) callback ကိုလည်း သုံးနိုင်ပါတယ်။

### Dialog နဲ့ initialization logic

Activity က dialog ရဲ့ ဖွင့်/ပိတ် state ကို ထိန်းသိမ်းပါတယ်။ ဒါက အဲဒီ state ပေါ် မူတည်ပြီး run တဲ့ Effects တွေကိုပါ သက်ရောက်ပါတယ်။

**ဘယ်အခါ ထိန်းထားသင့်လဲ:** User တစ်ယောက် တက်ကြွစွာ အလုပ်လုပ်နေတဲ့ multi-step wizard (သို့) settings panel တစ်ခုပါ။ Step နဲ့ input state တွေကို ထိန်းပေးတာက တိုးတက်မှု (progress) တွေ မပျောက်အောင် ရှောင်ပေးပါတယ်။

**ဘယ်အခါ ပြန်စက်သင့်လဲ:** အဖွင့်တိုင်း initialization logic (input တစ်ခုကို focus လုပ်တာလိုမျိုး) run တဲ့ dialog တစ်ခုပါ။ User က dialog ဖွင့်ထားတုန်း navigate ထွက်သွားခဲ့ရင် — Activity က `isDialogOpen: true` ကို ထိန်းသိမ်းထားပါတယ်။ နောက်တစ်ကြိမ် ပြန်ဖွင့်တဲ့အခါ — `true` ဖြစ်ပြီးသား အပေါ်မှာ `true` ပြန်သတ်မှတ်တာမို့ — state change မဖြစ်ဘဲ Effect က ပြန် run မလုပ်ပါဘူး။

ဥပမာ ဒီအတိုင်း ကြည့်ပါ:

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'

function ProductTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isDialogOpen) {
      inputRef.current?.focus()
    }
  }, [isDialogOpen])

  // ...
}
```

User က dialog ဖွင့်ထားတုန်း navigate ထွက်သွားခဲ့ရင် — ပြန်လာပြီး dialog ကို ဖွင့်တဲ့အခါ focus Effect က trigger မဖြစ်တော့ပါဘူး — ဘာလို့လဲဆိုတော့ `isDialogOpen` က `true` ဖြစ်နေပြီးသားမို့ပါ။

ဒါကို ဖြေရှင်းဖို့ — dialog state ကို ထိန်းသိမ်းထားတဲ့ component state ပြင်ပက — search param တစ်ခုလိုမျိုးကနေ ဆင်းသက်ယူပါ:

```tsx highlight={3,7-9,20,25}
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

function ProductTab() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isDialogOpen = searchParams.get('edit') === 'true'
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isDialogOpen) {
      inputRef.current?.focus()
    }
  }, [isDialogOpen])

  return (
    <div>
      <button onClick={() => router.push('?edit=true')}>Edit Product</button>

      {isDialogOpen && (
        <dialog open>
          <input ref={inputRef} placeholder="Product name" />
          <button onClick={() => router.replace('?', { scroll: false })}>
            Close
          </button>
        </dialog>
      )}
    </div>
  )
}
```

ဒီနည်းနဲ့ဆို — `isDialogOpen` က component state ကနေ မဟုတ်ဘဲ URL ကနေ ဆင်းသက်လာပါတယ်။ Navigate ထွက်ပြီး ပြန်လာတဲ့အခါ — search param ကို ရှင်းလိုက်တာမို့ (URL ပြောင်းသွားတယ်) — `isDialogOpen` က `false` ဖြစ်သွားပါတယ်။ Dialog ကို ဖွင့်တဲ့အခါ — param ကို သတ်မှတ်လို့ — `isDialogOpen` ပြောင်းပြီး Effect ကို trigger လုပ်ပါတယ်။

### Forms, inputs နဲ့ state

Activity က form input values တွေ (text fields, ရွေးထားတဲ့ options, checkbox states), submission results တွေနဲ့ status messages တွေကို navigations ကြားမှာ ထိန်းသိမ်းပေးပါတယ်။

**ဘယ်အခါ ထိန်းထားသင့်လဲ:** Filters ပါတဲ့ search page, user ရေးနေတဲ့ draft (သို့) မသိမ်းရသေးတဲ့ အပြောင်းအလဲတွေ ပါတဲ့ settings form တစ်ခုပါ။ Input state ကို ထိန်းပေးတာက UX အတွက် အကြီးမားဆုံး အကျိုးအမြတ်တွေထဲက တစ်ခုပါ — user က အလုပ်တွေ မဆုံးရှုံးလို့ပါ။

**ဘယ်အခါ ပြန်စက်သင့်လဲ:** "New transaction" flow တစ်ခုလိုမျိုး — visit တိုင်း အသစ်အစ စတင်သင့်တာမျိုး (သို့) context အသစ်တစ်ခုမှာ ရှုပ်ထွေးစေနိုင်တဲ့ success/error messages အဟောင်းတွေ ပြဖို့ မလိုတဲ့ form တစ်ခုပါ။

#### Submit လုပ်ပြီးနောက် form state ကို reset လုပ်ခြင်း

User တစ်ယောက်က item အသစ်တစ်ခု ဖန်တီးတဲ့ page တစ်ခုကို စဉ်းစားကြည့်ပါ။ Submit လုပ်ပြီးတဲ့နောက် — `router.push` က record အသစ်ဆီ navigate လုပ်ပါတယ်။ Activity က page ကို ထိန်းသိမ်းထားလို့ — နောက်ပြန် navigate လုပ်တဲ့အခါ form ထဲမှာ နာမည်အဟောင်း ကျန်နေတာ မြင်ရပါမယ်။ Form ကို အသစ်အစ ဖြစ်နေစေဖို့ — event handler ထဲမှာ state ကို reset လုပ်ပါ:

```tsx filename="app/new/page.tsx" highlight={13}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewItemPage() {
  const [name, setName] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const item = await createItem({ name })
    setName('')
    router.push(`/items/${item.id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  )
}
```

#### Status message အဟောင်းတွေကို reset လုပ်ခြင်း

Submit လုပ်ပြီးတဲ့နောက် — feedback message တစ်ခု render လုပ်ဖို့ status တစ်ခုကို state ထဲ ထည့်ထားရင် — အဲဒါကို ရှင်းဖို့ အားကိုးလို့ရတဲ့ user-initiated event တစ်ခု မကြာခဏ မရှိတတ်ပါဘူး။

User က သင့် ထိန်းချုပ်မှု အပြင်ဘက်က `next/link` elements တွေကနေဖြစ်ဖြစ် — browser controls တွေကနေဖြစ်ဖြစ် navigate လုပ်နိုင်ပါတယ်။

Form ဆီ ပြန်လာတဲ့အခါ — message အဟောင်း တစ်ခု ပေါ်နေတာ တွေ့ရပါမယ်။ ဒီလိုအခါမျိုးမှာ — form နဲ့ state ကို reset လုပ်ဖို့ `useLayoutEffect` cleanup တစ်ခုကို သုံးနိုင်ပါတယ်:

```tsx highlight={17-26}
'use client'

import { useState, useRef, useLayoutEffect } from 'react'

function ContactForm() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const shouldReset = useRef(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await sendMessage({ name })
    setStatus('success')
    shouldReset.current = true
  }

  // Activity က ဒီ component ကို ဝှက်တဲ့အခါ success message အဟောင်းကို reset လုပ်ပါ
  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false
        setStatus('idle')
        setName('')
      }
    }
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Send</button>
      {status === 'success' && <p>Message sent!</p>}
    </form>
  )
}
```

`shouldReset` ref က cleanup ကို အောင်မြင်တဲ့ submission တစ်ခု ပြီးမှသာ run ဖြစ်အောင် သေချာစေပါတယ်။ User က submit မလုပ်ဘဲ draft အလယ်မှာ navigate ထွက်သွားရင် — သူ့ input တွေကို ထိန်းသိမ်းထားပါတယ်။

[`useActionState`](https://react.dev/reference/react/useActionState) သုံးနေတယ်ဆိုရင်လည်း — အလားတူ နည်းလမ်းပဲ သက်ရောက်ပါတယ်။ သင့် reducer ထဲကို `RESET` action တစ်ခု ထည့်နည်းအတွက် React docs ထဲက [Reset state](https://react.dev/reference/react/useActionState#reset-state) ကို ကြည့်ပါ။ ဒီ hooks တွေနဲ့ responsive interactions တွေ တည်ဆောက်ခြင်း အကြောင်း ပိုသိရဖို့ — [Building interactive apps](/docs/nextjs/interactive-apps) guide ကို ကြည့်ပါ။

<details>
<summary>Callback ref နဲ့ form fields အားလုံးကို reset လုပ်ခြင်း</summary>

Activity က component ကို ဝှက်တဲ့အခါ — `form.reset()` ကို ခေါ်ဖို့ callback ref တစ်ခု သုံးနိုင်ပါတယ်:

```tsx
<form
  ref={(form) => {
    return () => form?.reset()
  }}
>
  <input name="email" />
  <input name="message" />
  <button type="submit">Send</button>
</form>
```

ဒါက user က navigate ထွက်သွားတိုင်း — fields အားလုံးကို reset လုပ်ပါတယ်။

</details>

## State နဲ့ authentication

Activity က local component state တွေ (`useState`, DOM input values) ကို navigations ကြားမှာ — authentication အပြောင်းအလဲတွေ အပါအဝင် — ထိန်းသိမ်းပါတယ်။ ဒါက React ရဲ့ ပုံမှန် အပြုအမူပါ: props တွေ ပြောင်းတာ (user အသစ်တစ်ယောက် ရတာလိုမျိုး) က re-render တစ်ခုကို trigger လုပ်ပေမယ့် — ရှိနှင့်ပြီးသား state ကို reset မလုပ်ပါဘူး။ User တစ်ယောက် ရေးနေတဲ့ draft ကို နောက်တစ်ယောက်က မြင်ရတာမျိုး မဖြစ်သင့်ပါဘူး။

Logout flows တွေအတွက် — `router.push` အစား `window.location.href` ကို သုံးတာက full page reload တစ်ခုကို trigger လုပ်ပြီး — client-side state အားလုံးကို ရှင်းပစ်ပါတယ်။

User ပြောင်းတဲ့အခါ — reload မလုပ်ဘဲ state တချို့ကို reset လုပ်ချင်ရင်:

```tsx
'use client'

import { useState, useEffect, useRef } from 'react'

function UserScopedForm({ userId }: { userId: string | null }) {
  const [draft, setDraft] = useState('')
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (lastUserIdRef.current !== null && lastUserIdRef.current !== userId) {
      setDraft('') // User ပြောင်းတဲ့အခါ reset လုပ်ပါ
    }
    lastUserIdRef.current = userId
  }, [userId])

  return <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
}
```

တစ်နည်းအားဖြင့် — components တွေကို user ID ပေါ် key လုပ်ထားပြီး React ကို reset ကို ကိုင်တွယ်ခွင့် ပေးနိုင်ပါတယ်: `<Form key={userId} />`။

## Global styles (ကမ္ဘာလုံးဆိုင်ရာ styles)

Page-level styles တွေ (CSS variables, z-index, global classes) က — origin component ကို Activity က ဝှက်ထားချိန်မှာ — မြင်နေရတဲ့ pages တွေကို သက်ရောက်နိုင်ပါတယ်။ ဝှက်ထားချိန်မှာ သူတို့ကို disable လုပ်ထားချင်ပါလိမ့်မယ်: ဝှက်ထားတဲ့ page တစ်ခုရဲ့ accent color (သို့) z-index overrides တွေက မြင်နေရတဲ့ page ထဲကို ပေါက်ကြားမသွားသင့်ပါဘူး။

Stylesheet ရဲ့ `media` attribute ကို toggle လုပ်ဖို့ callback ref တစ်ခု သုံးပါ:

```tsx
<style
  ref={(style) => {
    if (style) style.media = '' // Visible ဖြစ်ချိန်မှာ enable လုပ်ပါ
    return () => {
      if (style) style.media = 'not all' // Hidden ဖြစ်ချိန်မှာ disable လုပ်ပါ
    }
  }}
>
  {`:root { --page-accent: blue; }`}
</style>
```

ဒါမှမဟုတ် — style elements အများကြီးကို စီမံနေတဲ့အခါ (သို့) ပိုရှုပ်ထွေးတဲ့ cleanup တွေအတွက် `useLayoutEffect` ကို သုံးပါ:

```tsx
'use client'

import { useLayoutEffect, useRef } from 'react'

function PageWithStyles() {
  const styleRef = useRef<HTMLStyleElement>(null)

  useLayoutEffect(() => {
    if (styleRef.current) styleRef.current.media = ''
    return () => {
      if (styleRef.current) styleRef.current.media = 'not all'
    }
  }, [])

  return <style ref={styleRef}>{`:root { --page-accent: blue; }`}</style>
}
```

Activity က component ကို ဝှက်တဲ့အခါ — cleanup က `media="not all"` ကို သတ်မှတ်လို့ — stylesheet ကို disable လုပ်ပါတယ်။ ပြန်မြင်ရတဲ့အခါ — effect က ပြန် run ပြီး `media` ကို enable ဖြစ်အောင် ပြန်သတ်မှတ်ပါတယ်။

### `:has` selector

[`:root:has(...)`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has) rule တစ်ခုက — သူ့ရဲ့ selector ကို အခြေခံပြီး styles တွေကို သက်ရောက်စေပါတယ်။ ရွေးချယ်ခံရတဲ့ element ရော ကိုက်ညီနေတဲ့ element ရော — အဲဒီ ဆက်စပ်မှုအကြောင်း မသိကြပါဘူး။ ဒါက မှန်ကန်တဲ့ CSS ဖြစ်ပေမယ့် — React ရဲ့ data flow ကို ရှောင်ကွက်ပြီး မသက်ဆိုင်တဲ့ components တွေကို ဆက်စပ်မိစေပါတယ်။

Global state အတွက်တော့ — React က ပိုင်ဆိုင်တဲ့ `data-*` attribute တစ်ခုကို ဦးစားပေးပါ:

```tsx
<html data-modal-open={modalOpen ? "true" : undefined}>
```

```css
html[data-modal-open='true'] {
  overflow: hidden;
}
```

Component တစ်ခုအတွင်းက local parent/child styling အတွက်တော့ `:has()` ကို သီးသန့် သုံးပါ:

```css
.card:has(img) {
  padding-top: 0;
}
```

ဒါက React data-flow (သို့) Next.js နဲ့ပဲ သက်ဆိုင်တာ မဟုတ်ပါဘူး။ ကျယ်ပြန့်တဲ့ `:has()` selectors တွေက တကယ့် performance bottleneck တစ်ခုပါ။ MDN ပေါ်က [Performance considerations](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has#performance_considerations) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** ဝှက်ထားတဲ့ component ကိုယ်တိုင်က global `:has` rule ကို သတ်မှတ်နေတယ်ဆိုရင် — အပေါ်က section က toggle က component ရဲ့ တခြား styles တွေနဲ့အတူ အဲဒါကိုပါ disable လုပ်ပေးပါတယ်။

## Testing (စမ်းသပ်ခြင်း)

Hidden Activity content တွေက `display: none` ဖြစ်နေပေမယ့် — document ထဲမှာ ဆက်ရှိနေပါတယ်။ ဒါက Cache Components က ထိန်းသိမ်းထားတဲ့ routes တွေရော — သင် `<Activity>` နဲ့ တိုက်ရိုက် ဝှက်ထားတဲ့ content တွေရော နှစ်မျိုးလုံးနဲ့ သက်ဆိုင်ပါတယ်။ ဒါက Playwright, Cypress (သို့) Puppeteer လို tools တွေနဲ့ end-to-end testing ကို သက်ရောက်ပါတယ်:

- **DOM queries တွေက hidden elements တွေကို ရှာတွေ့နိုင်ပါတယ်။** Selectors တွေက visibility နဲ့ မဆိုင်ဘဲ elements တွေနဲ့ ကိုက်ညီနိုင်ပါတယ်။
- **Hidden elements တွေနဲ့ interactions တွေက fail (သို့) timeout ဖြစ်ပါတယ်။** Tools အများစုက interact မလုပ်ခင် elements တွေ visible ဖြစ်လာတာကို စောင့်ပါတယ်။
- **Assertions တွေက hidden content တွေနဲ့ ကိုက်ညီနိုင်ပါတယ်။** Element ရှိနေမှုကို assert လုပ်တဲ့အခါ visibility အကြောင်း တိကျစွာ ဖော်ပြပါ။

### Visibility-aware selectors တွေကို အသုံးပြုခြင်း

Playwright မှာ — `getByRole` queries တွေက visibility အလိုက် အလိုအလျောက် စစ်ထုတ်ပေးပါတယ်:

```ts
// Good - getByRole filters by visibility automatically
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')

// Also good - getByLabel, getByPlaceholder filter by visibility
await page.getByLabel('Email').fill('test@example.com')
await page.getByPlaceholder('Search...').fill('query')
```

`getByRole` က မသင့်တော်တဲ့အခါ — visibility filtering ပါတဲ့ `.locator()` ကို သုံးပါ:

```ts
// Fallback - filter by visibility explicitly
await page.locator('.product-card').filter({ visible: true }).first().click()
await page
  .locator('[data-testid="timer"]')
  .filter({ visible: true })
  .textContent()

// Avoid - may match hidden elements in Activity boundaries
await page.locator('.product-card').first().click()
```

`getByRole` က Activity, tabbed navigation, accordions နဲ့ — hidden content တွေကို DOM ထဲမှာ ထားရှိတဲ့ အခြား pattern တွေအတွက် ခိုင်မာပါတယ်။ ဒါက hidden elements တွေကို ဖယ်ထားတဲ့ accessibility tree ကို query လုပ်လို့ပါ။ တခြား testing tools တွေအတွက်တော့ — visibility-aware selectors တွေအတွက် သူတို့ရဲ့ documentation တွေကို စစ်ဆေးပါ။ ဥပမာ — Cypress က `.should('be.visible')` (သို့) `{ visible: true }` options တွေကို သုံးပါတယ်။

## သင့် components တွေထဲမှာ Activity သုံးခြင်း

Cache Components က Activity ကို route level မှာ အလိုအလျောက် သုံးပေမယ့် — သင့်ကိုယ်ပိုင် components တွေထဲမှာလည်း `<Activity>` ကို တိုက်ရိုက် သုံးနိုင်ပါတယ်။ Tabs, expandable panels (သို့) content ကို unmount မလုပ်ဘဲ ဝှက်ထားချင်တဲ့ ဘယ် UI အတွက်မဆို ဒါက အသုံးဝင်ပါတယ်။

### Hidden content တွေကို prerender လုပ်ခြင်း

Activity က user မမြင်ရသေးတဲ့ content တွေကို prerender လုပ်နိုင်ပါတယ်။ Hidden boundaries တွေက priority နိမ့်နဲ့ render လုပ်ပါတယ်။ Suspense နဲ့ ပေါင်းလိုက်တဲ့အခါ — user က နောက်တစ်ဆင့် ကြည့်ဖို့ များတဲ့ content အတွက် data တွေကို ကြိုတင် (prefetch) ယူနိုင်ပါတယ်။

Server Component တစ်ခုက data တွေကို ချက်ချင်း fetch စတင်ပြီး — promise ကို client component တစ်ခုဆီ ပေးပို့နိုင်ပါတယ်။ Client component က Activity ကို သုံးပြီး user က request လုပ်တဲ့အထိ content ကို ဝှက်ထားကာ — render လုပ်တဲ့အခါ promise ကို ဖြေရှင်းဖို့ `use()` ကို သုံးပါတယ်:

```tsx filename="app/page.tsx"
import { Suspense } from 'react'
import { ExpandableComments } from './expandable-comments'

async function getCommentsData() {
  return db.comments.findMany()
}

export default function Page() {
  const commentsPromise = getCommentsData()

  return (
    <article>
      <h1>Post Title</h1>
      <p>Main content visible immediately...</p>

      <ExpandableComments commentsPromise={commentsPromise} />
    </article>
  )
}
```

```tsx filename="app/expandable-comments.tsx"
'use client'

import { Activity, Suspense, useState, use } from 'react'

type Comment = { id: string; text: string; author: string }

export function ExpandableComments({
  commentsPromise,
}: {
  commentsPromise: Promise<Comment[]>
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <button onClick={() => setExpanded((e) => !e)}>
        {expanded ? 'Hide Comments' : 'Show Comments'}
      </button>

      <Activity mode={expanded ? 'visible' : 'hidden'}>
        <Suspense fallback={<CommentsSkeleton />}>
          <Comments commentsPromise={commentsPromise} />
        </Suspense>
      </Activity>
    </>
  )
}

function Comments({
  commentsPromise,
}: {
  commentsPromise: Promise<Comment[]>
}) {
  const comments = use(commentsPromise)
  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  )
}

function CommentsSkeleton() {
  return <div>Loading comments...</div>
}
```

Server Component က comments တွေကို ချက်ချင်း fetch စတင်ပြီး — promise ကို အောက်သို့ ပေးပို့ပါတယ်။ ဝှက်ထားချိန်မှာ — data က priority နိမ့်နဲ့ stream ဝင်ပါတယ်။ User က "Show Comments" ကို click လုပ်တဲ့အခါ — `Comments` component က `use()` နဲ့ promise ကို ဖြေရှင်းပြီး — content က ချက်ချင်း ပေါ်လာပါတယ်။

### Effect နဲ့ media cleanup

Activity က content ကို ဝှက်တဲ့အခါ — React က unmount လုပ်တုန်းကလိုပဲ — effect cleanup functions တွေကို run လုပ်ပါတယ်။ ဆိုလိုတာက — cleanup ကောင်းကောင်း ရှိရင် timers, subscriptions နဲ့ media playback တွေက အလိုအလျောက် ခေတ္တရပ်သွားပါတယ်:

```tsx
'use client'

import { useEffect, useState } from 'react'

function LiveTimer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000)
    return () => clearInterval(id) // ဝှက်ထားချိန်မှာ ခေတ္တရပ်ပါတယ်
  }, [])

  return <p>Count: {count}</p>
}
```

`<video>` နဲ့ `<audio>` လို media elements တွေအတွက်တော့ — `display: none` က playback ကို မရပ်ပေးပါဘူး။ `useLayoutEffect` နဲ့ တိကျတဲ့ cleanup တစ်ခု ထည့်ပါ:

```tsx
'use client'

import { useLayoutEffect, useRef } from 'react'

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    const video = videoRef.current
    return () => {
      video?.pause() // ဝှက်ထားချိန်မှာ ခေတ္တရပ်ပြီး playback position ကို ထိန်းသိမ်းပါတယ်
    }
  }, [])

  return <video ref={videoRef} src={src} controls />
}
```

Component က ပြန်မြင်ရတဲ့အခါ — effects တွေ ပြန် run ပြီး — DOM node ကို ဘယ်တော့မှ မဖယ်ရှားခဲ့လို့ playback position က ထိန်းသိမ်းခံရပါတယ်။

### ပထမဆုံး mount ဖြစ်ခြင်းနဲ့ ပြန်ပေါ်လာခြင်းကို ခွဲခြားခြင်း

Effects တွေက ကနဦး mount တစ်ခုတည်းမှာ မဟုတ်ဘဲ — hide-to-visible transition တိုင်းမှာ run ပါတယ်။ ပထမဆုံး mount ဖြစ်ခြင်းကို နောက်ပိုင်း visibility အပြောင်းအလဲတွေကနေ ခွဲခြားဖို့ လိုအပ်ရင် — ref တစ်ခု သုံးပါ:

```tsx
'use client'

import { useEffect, useRef } from 'react'

function TrackedComponent() {
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      console.log('First mount')
    } else {
      console.log('Became visible again')
    }
  }, [])

  return <div>...</div>
}
```

Ref က hide/show cycles တွေကြားမှာ ဆက်ရှိနေပါတယ် (refs တွေကို cleanup မလုပ်ပါဘူး) — ဒါကြောင့် ပထမဆုံး mount အပြီးမှာ `hasMountedRef.current` က `true` အတိုင်း ဆက်ရှိနေပါတယ်။ Activity က visible ဖြစ်လာတိုင်း — Effect က ပြန် run ပေမယ့် — အခုတော့ `else` branch ကို ယူပါတယ်။

## ဥပမာများ

[Activity Patterns Demo](https://react-activity-patterns.labs.vercel.dev) ([source](https://github.com/vercel-labs/react-activity-patterns)) က — Cache Components enable လုပ်ထားပြီး routes သုံးခု ပါတဲ့ Next.js app တစ်ခုပါ။ State ထိန်းသိမ်းမှုကို လက်တွေ့ မြင်ရဖို့ သူတို့ကြားမှာ navigate လုပ်ကြည့်ပါ:

- **Data** — navigations တွေကြားမှာ state ကို ထိန်းထားတဲ့ sortable table နဲ့ selectable list တစ်ခု၊ ပြီးတော့ နောက်ခံမှာ prerender လုပ်တဲ့ reviews section တစ်ခု
- **Forms** — DOM state (`<details>`, checkboxes, text inputs) တွေကို ဆက်ထိန်းပေးတဲ့ filter panel တစ်ခု၊ ပြီးတော့ `useLayoutEffect` cleanup သုံးပြီး submission အပြီး reset လုပ်တဲ့ newsletter form တစ်ခု
- **Side Effects** — navigate ထွက်တဲ့အခါ ခေတ္တရပ်ပြီး ပြန်လာတဲ့အခါ ဆက်လုပ်တဲ့ live timer တစ်ခု၊ ပြီးတော့ playback position ကို ထိန်းသိမ်းထားပြီး အလိုအလျောက် pause လုပ်တဲ့ video player တစ်ခု
