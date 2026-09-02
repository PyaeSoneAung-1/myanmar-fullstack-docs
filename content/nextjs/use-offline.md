---
title: "useOffline hook (experimental — အော့ဖ်လိုင်း အခြေအနေ စစ်ဆေးခြင်း)"
description: "useOffline() — app က လက်ရှိ အော့ဖ်လိုင်း ဖြစ်နေလား ဆိုတဲ့ boolean ပြန်ပေးတဲ့ experimental Client Component hook; offline banner နဲ့ offline-aware Suspense fallback တွေ ဆောက်နည်း"
order: 69
source: "https://nextjs.org/docs/app/api-reference/functions/use-offline"
status: translated
updated: 2026-09-02
---

`useOffline` hook က app က လက်ရှိ အော့ဖ်လိုင်း (offline) ဖြစ်နေလား ဆိုတာကို ဖော်ပြတဲ့ boolean တစ်ခု ပြန်ပေးပါတယ်။ Connectivity ကို သတိပြုတဲ့ UI တွေ — ဥပမာ user ရဲ့ network connection ပြတ်သွားတဲ့အခါ banner တစ်ခု၊ (သို့) offline ကို သတိထားတဲ့ Suspense fallback တစ်ခု — render လုပ်ဖို့ သုံးနိုင်ပါတယ်။

ဒီ hook က ပိုကြီးတဲ့ feature တစ်ခုရဲ့ အစိတ်အပိုင်းတစ်ခုပါ။ [`experimental.useOffline`](https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline) config option ကို ဖွင့်လိုက်ရင် — offline connectivity detection တွေ၊ ပိတ်ဆို့ခံထားရတဲ့ (blocked) navigation, prefetch, Server Action request တွေကို အလိုအလျောက် ပြန်စမ်းခြင်း (automatic retry) တွေ စလုပ်ပေးပြီး — Client Components တွေ state ကို ဖတ်နိုင်အောင် ဒီ hook ကို ထုတ်ပေးပါတယ်။

ဒီ flag မပါဘဲနဲ့တော့ hook က အမြဲတမ်း `false` ပြန်ပေးပါတယ်။

```js filename="next.config.js"
module.exports = {
  experimental: {
    useOffline: true,
  },
}
```

```tsx filename="app/offline-status.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineStatus() {
  const isOffline = useOffline()
  return <div>{isOffline ? 'Offline' : 'Online'}</div>
}
```

```jsx filename="app/offline-status.js" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineStatus() {
  const isOffline = useOffline()
  return <div>{isOffline ? 'Offline' : 'Online'}</div>
}
```

Connectivity ကို ဘယ်လို စစ်ဆေးပြီး requests တွေကို ဘယ်လို ပြန်စမ်းလဲဆိုတဲ့ အသေးစိတ်အတွက် [How retry works](https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline#how-retry-works) ကို ကြည့်ပါ။

## Parameters

```tsx
const isOffline = useOffline()
```

`useOffline` က parameter ဘာမှ လက်မခံပါဘူး။

## Returns

`useOffline` က `boolean` တစ်ခု ပြန်ပေးပါတယ်:

| Value   | အဓိပ္ပါယ်                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| `true`  | App က အော့ဖ်လိုင်း ဖြစ်နေပါတယ်။ Network request တစ်ခု မအောင်မြင်ခဲ့သလို — browser က `offline` event တစ်ခု ပစ်လွှတ်ထားပါတယ်။ |
| `false` | App က အွန်လိုင်း ဖြစ်နေတာ၊ (သို့) server ပေါ်မှာ render လုပ်နေတာ ဖြစ်ပါတယ်။ Hydration မပြီးသေးခင် ပထမဆုံး တန်ဖိုးလည်း ဒါပဲ ဖြစ်ပါတယ်။ |

## ဥပမာများ

### Offline banner တစ်ခု ပြသခြင်း

User ရဲ့ connection ပြတ်တောက်သွားတိုင်း အမြဲပေါ်နေတဲ့ banner တစ်ခုကို render လုပ်ပါ။

```tsx filename="app/components/offline-banner.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) {
    return null
  }

  return (
    <div role="status" className="offline-banner">
      You are offline. Some content may be unavailable.
    </div>
  )
}
```

```jsx filename="app/components/offline-banner.js" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) {
    return null
  }

  return (
    <div role="status" className="offline-banner">
      You are offline. Some content may be unavailable.
    </div>
  )
}
```

Banner က route တိုင်းမှာ ပေါ်နေအောင် root layout ထဲမှာ render လုပ်ပါ:

```tsx filename="app/layout.tsx" switcher
import { OfflineBanner } from './components/offline-banner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <OfflineBanner />
        {children}
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { OfflineBanner } from './components/offline-banner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OfflineBanner />
        {children}
      </body>
    </html>
  )
}
```

### Offline ကို သတိထားတဲ့ Suspense fallback

User က အော့ဖ်လိုင်းဖြစ်နေချိန်မှာ route တစ်ခုဆီ သွားလာရင် — prefetch လုပ်ထားတဲ့ static shell က ချက်ချင်း render ဖြစ်ပေမယ့် `<Suspense>` boundary တစ်ခုနောက်မှာရှိတဲ့ dynamic content က network ပေါ်မှာ ပိတ်ဆို့နေပါတယ်။ ဥပမာ — content က ဘာကြောင့် မျှော်လင့်ထားတာထက် ကြာနေလဲ ရှင်းပြဖို့ [`loading.tsx`](/docs/nextjs/file-conventions-loading) file တစ်ခုထဲမှာ `useOffline` ကို သုံးနိုင်ပါတယ်။

```tsx filename="app/destination/loading.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export default function Loading() {
  const isOffline = useOffline()

  return (
    <div>
      {isOffline ? 'Waiting for connection to load this page...' : 'Loading...'}
    </div>
  )
}
```

```jsx filename="app/destination/loading.js" switcher
'use client'

import { useOffline } from 'next/offline'

export default function Loading() {
  const isOffline = useOffline()

  return (
    <div>
      {isOffline ? 'Waiting for connection to load this page...' : 'Loading...'}
    </div>
  )
}
```

Connectivity ပြန်ရလာတဲ့အခါ Next.js က ပိတ်ဆို့နေတဲ့ request ကို ပြန်စမ်းပြီး — dynamic content က အလိုအလျောက် stream ဝင်လာပါတယ်။

## Version History

| Version    | အပြောင်းအလဲ                  |
| ---------- | ----------------------------- |
| `v16.x.0`  | `useOffline` hook ကို စတင် မိတ်ဆက်။ |
