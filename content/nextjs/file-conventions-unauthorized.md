---
title: "unauthorized.js (authentication မအောင်မြင်လျှင် 401 UI)"
description: "unauthorized.js file convention — authentication ကာလအတွင်း unauthorized() function ခေါ်လိုက်တဲ့အခါ 401 Unauthorized UI render လုပ်ပေးတဲ့ experimental special file; props နှင့် ဥပမာများ"
order: 106
source: "https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်:** ဒီ feature က လက်ရှိ experimental ဖြစ်ပြီး — ပြောင်းလဲနိုင်တာမို့ production အတွက် အကြံပြုမထားပါဘူး။ စမ်းသုံးကြည့်ပြီး [GitHub](https://github.com/vercel/next.js/issues) မှာ သင့် feedback ကို မျှဝေပေးပါ။

**unauthorized** file က authentication (အထောက်အထား စစ်ဆေးခြင်း) ကာလအတွင်းမှာ [`unauthorized`](https://nextjs.org/docs/app/api-reference/functions/unauthorized) function ကို ခေါ်လိုက်တဲ့အခါ UI render လုပ်ဖို့ သုံးပါတယ်။ UI ကို စိတ်ကြိုက် ပြင်ဆင်ခွင့်ပြုပေးတာအပြင် — Next.js က `401` status code ကိုလည်း ပြန်ပို့ပေးပါတယ်။

```tsx filename="app/unauthorized.tsx" switcher
import Login from '@/app/components/Login'

export default function Unauthorized() {
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

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

## Reference

### Props

`unauthorized.js` components တွေက props ဘာမှ လက်ခံပါဘူး။

## ဥပမာများ (Examples)

### Unauthenticated users တွေကို login UI ပြသခြင်း

[`unauthorized`](https://nextjs.org/docs/app/api-reference/functions/unauthorized) function ကို သုံးပြီး — login UI ပါတဲ့ `unauthorized.js` file ကို render လုပ်နိုင်ပါတယ်။

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

## Version History (ဗားရှင်း မှတ်တမ်း)

| Version   | အပြောင်းအလဲ                       |
| --------- | ---------------------------------- |
| `v15.1.0` | `unauthorized.js` စတင် မိတ်ဆက်။    |
