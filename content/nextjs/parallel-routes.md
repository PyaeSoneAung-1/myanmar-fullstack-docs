---
title: "Parallel Routes"
description: "Parallel Routes — @folder slots တွေနဲ့ layout တစ်ခုထဲမှာ pages အများအပြားကို တစ်ပြိုင်နက် render လုပ်ခြင်း, default.js, conditional routes, tab groups နဲ့ modals"
order: 24
source: "https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes"
status: translated
updated: 2026-09-02
---

**Parallel Routes** က layout တစ်ခုတည်းအတွင်းမှာ pages တစ်ခု (သို့) တစ်ခုထက်ပိုကို — တစ်ပြိုင်နက် (သို့) condition ပေါ်မူတည်ပြီး render လုပ်နိုင်စေပါတယ်။ Dashboard တွေ၊ social sites တွေရဲ့ feeds လို highly dynamic အပိုင်းတွေအတွက် အသုံးဝင်ပါတယ်။

ဥပမာ — dashboard တစ်ခုမှာ `team` နဲ့ `analytics` pages တွေကို parallel routes သုံးပြီး တစ်ပြိုင်နက် render လုပ်နိုင်ပါတယ်: တစ်ဖက်မှာ navigation menu ရှိနေတုန်း နောက်တစ်ဖက်မှာ main content ကို သီးခြား ပြောင်းပြခြင်းမျိုးပါ။

## Convention — Slots (Slot များ)

Parallel routes တွေကို named **slots** တွေနဲ့ ဖန်တီးပါတယ် — `@folder` convention နဲ့ သတ်မှတ်ပါတယ်။ ဥပမာ — `app` ထဲမှာ `@analytics/page.tsx` နဲ့ `@team/page.tsx` ဆိုတဲ့ folders နှစ်ခု ထည့်ထားရင် slots နှစ်ခု သတ်မှတ်ပြီးသား ဖြစ်ပါတယ်။

Slots တွေက shared parent layout ဆီ **props တွေအနေနဲ့** ရောက်သွားပါတယ် — ဥပမာအပေါ်မှာ `app/layout.js` က `@analytics` နဲ့ `@team` slots props တွေကို လက်ခံပြီး `children` prop နဲ့အတူ တစ်ပြိုင်နက် render လုပ်နိုင်ပါတယ်:

```tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

ဒါပေမယ့် slots တွေက **route segments မဟုတ်ဘူး** — URL structure ကို မထိခိုက်ပါဘူး။ ဥပမာ `/@analytics/views` ဆိုတဲ့ path ရဲ့ URL က `@analytics` က slot ဖြစ်လို့ `/views` ပဲ ဖြစ်ပါတယ်။ Slots တွေက ပုံမှန် [Page](/docs/nextjs/pages-layouts) component နဲ့ ပေါင်းပြီး route segment နဲ့ ဆက်စပ်တဲ့ နောက်ဆုံး page ကို ဖွဲ့စည်းပါတယ်။ ဒါကြောင့် route segment level တစ်ခုတည်းမှာ [prerendered](https://nextjs.org/docs/app/glossary#prerendering) နဲ့ [dynamically rendered](https://nextjs.org/docs/app/glossary#dynamic-rendering) slots တွေ ရောမထားနိုင်ပါဘူး — slot တစ်ခု dynamic ဆိုရင် အဲဒီ level က slots အားလုံး dynamic ဖြစ်ရပါမယ်။

> **Good to know:** `children` prop က implicit slot တစ်ခုပါ — folder တစ်ခုနဲ့ မြေပုံဆွဲစရာ မလိုပါဘူး။ ဆိုလိုတာက `app/page.js` က `app/@children/page.js` နဲ့ ညီမျှပါတယ်။

## default.js (Fallback Page)

Initial load (သို့) full-page reload လုပ်တဲ့အခါ — ဘယ် page နဲ့မှ မကိုက်ညီတဲ့ slots တွေအတွက် fallback အနေနဲ့ render လုပ်ဖို့ `default.js` file ကို သတ်မှတ်နိုင်ပါတယ်။

ဥပမာ — `@team` slot မှာ `/settings` page ရှိပြီး `@analytics` မှာ မရှိဘူးဆိုပါစို့။ `/settings` ကို navigate လုပ်တဲ့အခါ — `@team` slot က `/settings` page ကို render ပြီး `@analytics` slot ကတော့ သူ့ရဲ့ လက်ရှိ active ဖြစ်နေတဲ့ page ကို ဆက်ထိန်းထားပါတယ်။ Refresh (full-page load) လုပ်လိုက်တဲ့အခါမှာတော့ Next.js က `@analytics` အတွက် `default.js` ကို render လုပ်ပါလိမ့်မယ် — `default.js` မရှိရင် `404` ပြပါတယ်။

ဒါ့အပြင် `children` က implicit slot ဖြစ်လို့ — parent page ရဲ့ active state ကို Next.js က ပြန်မရနိုင်တဲ့အခါမျိုးမှာ `children` အတွက်ပါ `default.js` file တစ်ခု ဖန်တီးပေးဖို့ လိုပါတယ်။

```tsx
export default function Default() {
  return null
}
```

## အပြုအမူ (Behavior)

Next.js က slot တစ်ခုစီအတွက် active *state* (subpage) ကို မှတ်သားထားပေမယ့် — slot ထဲမှာ render လုပ်တဲ့ content က navigation အမျိုးအစားပေါ် မူတည်ပါတယ်:

- **Soft Navigation** (client-side navigation) — Next.js က [partial render](https://nextjs.org/docs/app/getting-started/linking-and-navigating) လုပ်ပြီး slot တစ်ခုအတွင်းက subpage ကို ပြောင်းပေးပါတယ် — ကျန်တဲ့ slot တွေရဲ့ active subpages တွေကတော့ လက်ရှိ URL နဲ့ မကိုက်ညီတော့ရင်တောင် ဆက်ထိန်းထားပေးပါတယ်။
- **Hard Navigation** (browser refresh လို full-page load) — လက်ရှိ URL နဲ့ မကိုက်ညီတဲ့ slots တွေရဲ့ active state ကို Next.js က ဆုံးဖြတ်လို့ မရတော့ပါဘူး။ အဲဒီအစား — မကိုက်ညီတဲ့ slots တွေအတွက် [`default.js`](#defaultjs-fallback-page) file ကို render လုပ်ပြီး `default.js` မရှိရင် `404` ပြပါတယ်။

> **Good to know:** Unmatched routes တွေအတွက် `404` က parallel route တစ်ခုကို မရည်ရွယ်တဲ့ page ပေါ်မှာ မတော်တဆ render မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။

## ဥပမာများ

### useSelectedLayoutSegment(s) နဲ့ Active State ဖတ်ခြင်း

[`useSelectedLayoutSegment`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) နဲ့ [`useSelectedLayoutSegments`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments) နှစ်ခုလုံးက `parallelRouteKey` parameter ကို လက်ခံပြီး — slot တစ်ခုအတွင်းက active route segment ကို ဖတ်နိုင်စေပါတယ်:

```tsx
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

User က `app/@auth/login` (URL bar မှာ `/login`) ကို navigate လုပ်တဲ့အခါ — `loginSegment` က `"login"` ဆိုတဲ့ string နဲ့ ညီမျှပါလိမ့်မယ်။ ဒါနဲ့ slot ရဲ့ active state ပေါ်မူတည်ပြီး nav links တွေကို highlight လုပ်တာမျိုး လုပ်နိုင်ပါတယ်။

### Conditional Routes (အခြေအနေအလိုက် Route ရွေးခြင်း)

Parallel Routes ကို သုံးပြီး user role လို အခြေအနေတွေပေါ်မူတည်ပြီး route တွေကို condition နဲ့ render လုပ်နိုင်ပါတယ် — ဥပမာ `/admin` (သို့) `/user` role တွေအတွက် dashboard page မတူအောင်:

```tsx
import { checkUserRole } from '@/lib/auth'

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return role === 'admin' ? admin : user
}
```

> [!WARNING]
> Slots နှစ်ခုလုံးက layout က ဘယ်ဟာကို return လုပ်လဲ မသက်ဆိုင်ဘဲ — **server ပေါ်မှာ render ဖြစ်ပါတယ်**။ Conditional က user ဘာကို မြင်လဲပဲ ဆုံးဖြတ်တာပါ — ဘာ code run လဲ မဆုံးဖြတ်ပါဘူး။ ဒါကြောင့် `@admin/page.js` က data fetch တွေကို user တိုင်းအတွက် run လုပ်ပြီး response ထဲမှာပါ ပါဝင်သွားပါတယ် — slot တစ်ခုစီရဲ့ page (သို့) [Data Access Layer](https://nextjs.org/docs/app/guides/authentication) ထဲမှာ authorization ကို ထည့်ပေးရပါမယ်:

```tsx
import { getAdminStats } from '@/lib/dal'

export default async function AdminPage() {
  const stats = await getAdminStats()
  return <Stats stats={stats} />
}
```

### Tab Groups (Tab အုပ်စုများ)

Slot တစ်ခုအတွင်းမှာ `layout` ထည့်ပြီး — user တွေကို slot ကို သီးခြား သွားလာနိုင်အောင် (independently navigate) လုပ်ပေးနိုင်ပါတယ်။ Tabs ဖန်တီးဖို့ အသုံးဝင်ပါတယ်။

ဥပမာ — `@analytics` slot မှာ `/page-views` နဲ့ `/visitors` ဆိုတဲ့ subpages နှစ်ခု ရှိတယ်ဆိုပါစို့။ `@analytics` အတွင်းမှာ `layout` file ဖန်တီးပြီး tabs တွေကို pages နှစ်ခုကြားမှာ share လုပ်နိုင်ပါတယ်:

```tsx
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">Page Views</Link>
        <Link href="/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

### Modals (Parallel + Intercepting Routes)

Parallel Routes တွေကို [Intercepting Routes](/docs/nextjs/intercepting-routes) နဲ့ တွဲသုံးပြီး — deep linking ကို ပံ့ပိုးတဲ့ modals တွေ ဖန်တီးနိုင်ပါတယ်။ ဒါက modals တွေ ဆောက်ရာမှာ ဖြစ်လေ့ရှိတဲ့ စိန်ခေါ်မှုတွေကို ဖြေရှင်းပေးပါတယ်:

- Modal content ကို **URL ကတစ်ဆင့် share လုပ်နိုင်ခြင်း**
- Page refresh လုပ်ရင် modal ပိတ်မသွားဘဲ **context ဆက်ထိန်းနိုင်ခြင်း**
- **Backward navigation မှာ modal ကိုပဲ ပိတ်ပြီး** ရှေ့က route ကို မသွားခြင်း
- **Forward navigation မှာ modal ကို ပြန်ဖွင့်နိုင်ခြင်း**

ဥပမာ UI pattern တစ်ခုက — user က client-side navigation နဲ့ layout ကနေ login modal ကို ဖွင့်နိုင်သလို — `/login` page သပ်သပ်ကိုလည်း ဝင်ရောက်နိုင်ပါတယ်။ အကောင်အထည်ဖော်ပုံ အဆင့်ဆင့်:

**၁။ Main login page ဆောက်ပါ** — `/login` route တစ်ခု ဖန်တီးပြီး main login page ကို render လုပ်ပါ:

```tsx
import { Login } from '@/app/ui/login'

export default function Page() {
  return <Login />
}
```

**၂။ `@auth` slot ထဲမှာ `default.js` ထည့်ပါ** — modal က active မဟုတ်တဲ့အခါ render မဖြစ်အောင် `null` return လုပ်တဲ့ file ပါ:

```tsx
export default function Default() {
  return null
}
```

**၃။ `/login` route ကို slot ထဲမှာ intercept လုပ်ပါ** — `<Modal>` component နဲ့ သူ့ children တွေကို `@auth/(.)login/page.tsx` ထဲမှာ ထည့်ပါ:

```tsx
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

ဒီနေရာမှာ `(.)` က [intercepting routes](/docs/nextjs/intercepting-routes) convention ပါ။ `<Modal>` ရဲ့ လုပ်ဆောင်ချက်နဲ့ modal content (`<Login>`) ကို ခွဲထားတာမို့ — modal အတွင်းက content တွေ (ဥပမာ [forms](/docs/nextjs/forms)) ကို Server Components အဖြစ် ထားနိုင်ပါတယ်။

**၄။ Modal ဖွင့်ခြင်း** — `@auth` slot ကို parent layout ဆီ prop အနေနဲ့ ပေးပြီး `children` နဲ့အတူ render လုပ်ပါ:

```tsx
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

User က `<Link>` ကို နှိပ်တဲ့အခါ — `/login` page ကို navigate မသွားဘဲ modal က ပွင့်လာပါလိမ့်မယ်။ ဒါပေမယ့် refresh (သို့) initial load မှာ `/login` ကို သွားရင်တော့ main login page ကို ရောက်ပါတယ်။

**၅။ Modal ပိတ်ခြင်း** — `router.back()` ခေါ်ပြီး (သို့) `Link` component သုံးပြီး ပိတ်နိုင်ပါတယ်:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  )
}
```

`Link` သုံးပြီး `@auth` slot မလိုတော့တဲ့ page တစ်ခုဆီ သွားတဲ့အခါ — parallel route က `null` return လုပ်တဲ့ component နဲ့ ကိုက်ညီအောင် လုပ်ပေးရပါတယ်။ Root page ဆီ ပြန်သွားတဲ့အခါ `@auth/page.tsx` ဖန်တီးပြီး `null` ပြန်ပေးပါ — (သို့) `/foo`, `/foo/bar` စတဲ့ တခြား page တွေဆီ သွားတဲ့အခါ **catch-all slot** ကို သုံးနိုင်ပါတယ်:

```tsx
export default function CatchAll() {
  return null
}
```

`app/@auth/[...catchAll]/page.tsx` ဆိုတဲ့ ပုံစံနဲ့ ထားတာပါ။ Client-side navigation တွေမှာ slot နဲ့ မကိုက်ညီတော့တဲ့ routes တွေက မြင်နေရဆဲ ဖြစ်လို့ — modal ပိတ်ဖို့ slot ကို `null` return လုပ်တဲ့ route တစ်ခုနဲ့ ကိုက်ညီအောင် လုပ်ရတာပါ။ တခြား ဥပမာတွေက — gallery တစ်ခုမှာ `/photo/[id]` page ရှိနေတုန်း photo modal ဖွင့်တာ၊ (သို့) side modal ထဲမှာ shopping cart ပြတာမျိုးပါ။

### Loading နဲ့ Error UI

Parallel Routes တွေကို သီးခြားစီ stream လုပ်လို့ရပြီး — route တစ်ခုချင်းစီအတွက် သီးခြား error နဲ့ loading states တွေ သတ်မှတ်နိုင်ပါတယ်။ ဒါကြောင့် slot တစ်ခုက error တက်ရင် ကျန်တဲ့ slot တွေရဲ့ UI ကို မထိခိုက်ပါဘူး — [Error Handling](/docs/nextjs/error-handling) နဲ့ [Streaming](/docs/nextjs/streaming) pages တွေမှာ အသေးစိတ် ဖတ်နိုင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Intercepting Routes](/docs/nextjs/intercepting-routes) — modal routing အတွက် intercept patterns
- [Pages & Layouts](/docs/nextjs/pages-layouts) — nested layouts နဲ့ slots တွေ ပေါင်းသုံးခြင်း
- [Linking & Navigation](/docs/nextjs/linking) — soft navigation အကြောင်း
