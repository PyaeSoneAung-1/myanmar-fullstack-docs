---
title: "useLinkStatus hook (<Link> ၏ pending state ခြေရာခံခြင်း)"
description: "useLinkStatus() — <Link> တစ်ခု၏ pending state ကို ခြေရာခံပေးသော hook; prefetching မပြီးသေးချိန် (သို့) loading.js မပါသော dynamic route များဆီ navigation ပြုလုပ်ချိန်တွင် inline feedback (shimmer effect စသည်) ပြသရန် အသုံးပြုပုံ၊ pending property ပြန်ပေးပုံနှင့် fast navigation ကို ချောမွေ့စွာ ကိုင်တွယ်နည်း"
order: 148
source: "https://nextjs.org/docs/app/api-reference/functions/use-link-status"
status: translated
updated: 2026-09-03
---

`useLinkStatus` hook က `<Link>` တစ်ခုရဲ့ **pending** state ကို ခြေရာခံနိုင်စေပါတယ်။ Navigation ပြီးဆုံးနေချိန်မှာ — နှိပ်လိုက်တဲ့ link ပေါ်က shimmer effect လိုမျိုး — သိမ်မွေ့တဲ့ inline feedback တွေအတွက် သုံးပါ။ Route-level fallbacks တွေအတွက် `loading.js` ကို ဦးစားပေးပြီး — instant transitions တွေအတွက် prefetching ကို သုံးပါ။

`useLinkStatus` က ဒီအခြေအနေတွေမှာ အသုံးဝင်ပါတယ်:

- [Prefetching](/docs/nextjs/linking) ကို disable လုပ်ထား (သို့) လုပ်ဆောင်နေဆဲ ဖြစ်လို့ navigation က ပိတ်ဆို့နေတဲ့အခါ။
- Destination route က dynamic ဖြစ်ပြီး — instant navigation တစ်ခု ရစေမယ့် [`loading.js`](/docs/nextjs/file-conventions-loading) file မပါတဲ့အခါ။

```tsx filename="app/hint.tsx" switcher
'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function Hint() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}

export default function Header() {
  return (
    <header>
      <Link href="/dashboard" prefetch={false}>
        <span className="label">Dashboard</span> <Hint />
      </Link>
    </header>
  )
}
```

```jsx filename="app/hint.js" switcher
'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function Hint() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}

export default function Header() {
  return (
    <header>
      <Link href="/dashboard" prefetch={false}>
        <span className="label">Dashboard</span> <Hint />
      </Link>
    </header>
  )
}
```

> **သိထားသင့်သည်:**
>
> - `useLinkStatus` ကို `Link` component တစ်ခုရဲ့ descendant component တစ်ခုအတွင်းမှာ သုံးရပါမယ်။
> - `Link` component ပေါ်မှာ `prefetch={false}` သတ်မှတ်ထားတဲ့အခါ hook က အသုံးအဝင်ဆုံး ဖြစ်ပါတယ်။
> - Linked route ကို prefetch လုပ်ပြီးသားဆိုရင် — pending state ကို ကျော်သွားပါလိမ့်မယ်။
> - Link အများကြီးကို ဆက်တိုက် အမြန် နှိပ်လိုက်တဲ့အခါ — နောက်ဆုံး link ရဲ့ pending state ကိုပဲ ပြသပါတယ်။
> - ဒီ hook က Pages Router မှာ ထောက်ပံ့မထားပြီး — `{ pending: false }` ကိုပဲ အမြဲ ပြန်ပေးပါတယ်။
> - Inline indicators တွေက layout shifts တွေကို လွယ်လွယ်နဲ့ ဖြစ်စေနိုင်ပါတယ်။ Fixed-size ဖြစ်ပြီး — အမြဲ render လုပ်ထားတဲ့ hint element တစ်ခုကို သုံးပြီး — သူ့ရဲ့ opacity ကို ပြောင်းပေးပါ (သို့) animation တစ်ခုကို သုံးပါ။

## သင့်မှာ `useLinkStatus` မလိုအပ်နိုင်ပါ (You might not need `useLinkStatus`)

Inline feedback မထည့်သွင်းခင် — ဒါတွေကို စဉ်းစားကြည့်ပါ:

- Destination က static ဖြစ်ပြီး — production မှာ prefetch လုပ်ထားတာမို့ pending phase ကို ကျော်သွားနိုင်ပါတယ်။
- Route မှာ `loading.js` file ရှိပြီး — route-level fallback တစ်ခုနဲ့ instant transitions တွေ ရနေပါတယ်။

Navigation က ပုံမှန်အားဖြင့် မြန်ဆန်ပါတယ်။ Transition တစ်ခု နှေးနေတာကို သတိထားမိတဲ့အခါ — မြန်မြန် ပြင်ဆင်ချက် (quick patch) အနေနဲ့ `useLinkStatus` ကို သုံးပြီး — နောက်ပိုင်းမှာ prefetching (သို့) `loading.js` fallback တစ်ခုနဲ့ ရင်းမြစ် အကြောင်းရင်းကို ပြုပြင်ဖို့ ဆက်လုပ်ပါ။

## Parameters

```tsx
const { pending } = useLinkStatus()
```

`useLinkStatus` က parameter ဘာမှ လက်ခံမထားပါဘူး။

## Returns

`useLinkStatus` က property တစ်ခုတည်း ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်:

| Property | Type    | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| pending  | boolean | History updates (မှတ်တမ်း update များ) မတိုင်ခင် `true`၊ ပြီးတဲ့အခါ `false` |

## ဥပမာ

### Inline link အချက်ပြချက် (Inline link hint)

Prefetching မပြီးသေးချိန်မှာ click လုပ်လိုက်တာကို အတည်ပြုဖို့ — layout ကို မထိခိုက်စေတဲ့ သိမ်မွေ့ပြီး fixed-size hint တစ်ခု ထည့်ပါ။

```tsx filename="app/components/loading-indicator.tsx" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```jsx filename="app/components/loading-indicator.js" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```tsx filename="app/shop/layout.tsx" switcher
import Link from 'next/link'
import LoadingIndicator from './components/loading-indicator'

const links = [
  { href: '/shop/electronics', label: 'Electronics' },
  { href: '/shop/clothing', label: 'Clothing' },
  { href: '/shop/books', label: 'Books' },
]

function Menubar() {
  return (
    <div>
      {links.map((link) => (
        <Link key={link.label} href={link.href}>
          <span className="label">{link.label}</span> <LoadingIndicator />
        </Link>
      ))}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Menubar />
      {children}
    </div>
  )
}
```

```jsx filename="app/shop/layout.js" switcher
import Link from 'next/link'
import LoadingIndicator from './components/loading-indicator'

const links = [
  { href: '/shop/electronics', label: 'Electronics' },
  { href: '/shop/clothing', label: 'Clothing' },
  { href: '/shop/books', label: 'Books' },
]

function Menubar() {
  return (
    <div>
      {links.map((link) => (
        <Link key={link.label} href={link.href}>
          <span className="label">{link.label}</span> <LoadingIndicator />
        </Link>
      ))}
    </div>
  )
}

export default function Layout({ children }) {
  return (
    <div>
      <Menubar />
      {children}
    </div>
  )
}
```

## Fast navigation တွေကို ချောမွေ့စွာ ကိုင်တွယ်ခြင်း (Gracefully handling fast navigation)

Route အသစ်တစ်ခုဆီ navigation က မြန်လွန်းရင် — users တွေက hint ရဲ့ မလိုအပ်တဲ့ flash တစ်ခုကို မြင်ရနိုင်ပါတယ်။ User experience ကို ပိုကောင်းစေဖို့နဲ့ — navigation က အချိန်ယူမှသာ hint ကို ပြသဖို့ — နည်းလမ်းတစ်ခုက initial animation delay (ဥပမာ 100ms) ထည့်ပြီး — animation ကို မမြင်ရတဲ့ အနေအထား (ဥပမာ `opacity: 0`) ကနေ စတင်ပါ။

```css filename="app/styles/global.css"
.link-hint {
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: 0.25rem;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0;
  visibility: hidden; /* reserve space without showing the hint */
}

.link-hint.is-pending {
  /* Animation 1: fade in after 100ms and keep final opacity */
  /* Animation 2: subtle pulsing while pending */
  visibility: visible;
  animation-name: fadeIn, pulse;
  animation-duration: 200ms, 1s;
  /* Appear only if navigation actually takes time */
  animation-delay: 100ms, 100ms;
  animation-timing-function: ease, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: forwards, none;
}

@keyframes fadeIn {
  to {
    opacity: 0.35;
  }
}
@keyframes pulse {
  50% {
    opacity: 0.15;
  }
}
```

## Version History

| Version   | အပြောင်းအလဲ                    |
| --------- | -------------------------------- |
| `v15.3.0` | `useLinkStatus` ကို စတင် မိတ်ဆက်။ |
