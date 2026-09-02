---
title: "usePathname hook (လက်ရှိ URL ရဲ့ pathname ဖတ်ခြင်း)"
description: "usePathname() — Client Component တစ်ခုအတွင်းက လက်ရှိ URL ရဲ့ pathname ဖတ်ပေးတဲ့ hook; Cache Components နဲ့ Suspense လိုအပ်ချက်၊ rewrites နဲ့ hydration mismatch ရှောင်နည်း"
order: 41
source: "https://nextjs.org/docs/app/api-reference/functions/use-pathname"
status: translated
updated: 2026-09-02
---

`usePathname` က **Client Component** hook တစ်ခုဖြစ်ပြီး — လက်ရှိ URL ရဲ့ **pathname** ကို ဖတ်နိုင်စေပါတယ်။

```tsx
// app/example-client-component.tsx
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>Current pathname: {pathname}</p>
}
```

`usePathname` က [Client Component](/docs/nextjs/server-client-components) တစ်ခုကို ရည်ရွယ်ချက်ရှိရှိ လိုအပ်ပါတယ်။ Client Components တွေက de-optimization (စွမ်းဆောင်ရည် ကျစေတာ) မဟုတ်ဘဲ — [Server Components](/docs/nextjs/server-client-components) architecture ရဲ့ အဓိက အစိတ်အပိုင်းတစ်ခုဆိုတာ သတိပြုပါ။

ဥပမာ — `usePathname` သုံးထားတဲ့ Client Component တစ်ခုက ကနဦး page load မှာ HTML အဖြစ် render လုပ်ပေးပါတယ်။ Route အသစ်တစ်ခုဆီ navigate လုပ်တဲ့အခါ — ဒီ component ကို ပြန် fetch လုပ်စရာ မလိုပါဘူး။ Component ကို client JavaScript bundle ထဲမှာ တစ်ကြိမ်တည်း download လုပ်ပြီး — လက်ရှိ state ပေါ် မူတည်ကာ ပြန် re-render လုပ်သွားပါတယ်။

> **သိထားသင့်သည်:**
>
> - [Server Component](/docs/nextjs/server-client-components) တစ်ခုထဲကနေ လက်ရှိ URL ကို ဖတ်တာကို **ထောက်ပံ့မပေးပါဘူး**။ ဒါက page navigations တွေကြားမှာ layout state ကို ထိန်းသိမ်းထားနိုင်ဖို့ ရည်ရွယ်ချက်ရှိရှိ ပြုလုပ်ထားတဲ့ ဒီဇိုင်းတစ်ခုပါ။
> - သင့် page က statically prerender လုပ်နေပြီး — `next.config` ထဲမှာ [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) (သို့) [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) file တစ်ခု ရှိနေရင် — `usePathname()` နဲ့ pathname ဖတ်တာက hydration mismatch errors တွေ ဖြစ်စေနိုင်ပါတယ်။ ဘာလို့ဆို ကနဦး value က server ကနေ လာပြီး — routing အပြီး browser ရဲ့ တကယ့် pathname နဲ့ မကိုက်ညီနိုင်လို့ပါ။ ပြဿနာကို လျော့ပါးစေတဲ့ နည်းအတွက် အောက်က Rewrites နဲ့ hydration mismatch ရှောင်ခြင်း ဥပမာကို ကြည့်ပါ။

<details>

<summary>Pages Router နဲ့ လိုက်ဖက်မှု (Compatibility)</summary>

`usePathname` သုံးထားတဲ့ components တွေကို Pages Router ထဲက routes တွေမှာလည်း import လုပ်သုံးနေတယ်ဆိုရင် — router က မစတင်ရသေးတဲ့ (not yet initialized) အခြေအနေမျိုးမှာ `usePathname` က `null` ပြန်ပေးနိုင်တာ သတိပြုပါ။ ဥပမာ — Pages Router ထဲက [fallback routes](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true) (သို့) [Automatic Static Optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization) ကာလအတွင်းမှာ ဖြစ်နိုင်ပါတယ်။

Routing systems နှစ်ခုကြား လိုက်ဖက်မှု ပိုကောင်းအောင် — သင့် project ထဲမှာ `app` ရော `pages` directory ပါ နှစ်ခုလုံး ရှိနေရင် — Next.js က `usePathname` ရဲ့ return type ကို အလိုအလျောက် ပြင်ဆင်ပေးပါတယ်။

</details>

## Parameters

```tsx
const pathname = usePathname()
```

`usePathname` က parameters ဘာမှ လက်ခံမပါဘူး။

## Returns

`usePathname` က လက်ရှိ URL ရဲ့ pathname string ကို ပြန်ပေးပါတယ်။ ဥပမာ:

| URL                 | ပြန်ပေးတဲ့ တန်ဖိုး         |
| ------------------- | -------------------------- |
| `/`                 | `'/'`                      |
| `/dashboard`        | `'/dashboard'`             |
| `/dashboard?v=2`    | `'/dashboard'`             |
| `/blog/hello-world` | `'/blog/hello-world'`      |

## အပြုအမူ (Behavior)

### Cache Components

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enable လုပ်ထားတဲ့အခါ — pathname ကို prerendering ကာလအတွင်းမှာ ဖြေရှင်းလို့ ရလား မရလားပေါ် မူတည်ပြီး — `usePathname` က [`Suspense`](https://react.dev/reference/react/Suspense) boundary တစ်ခု လိုအပ်နိုင်ပါတယ်။

- **Static routes နဲ့ [`generateStaticParams`](/docs/nextjs/generate-static-params) ပါတဲ့ routes တွေ**: dynamic params တွေ အပါအဝင် route segment တိုင်းကို build time မှာ သိပါတယ်။ Pathname ကို prerendering အတွင်း ဖြေရှင်းလို့ရလို့ — `usePathname` က server ပေါ်မှာ ဖြေရှင်းပြီး `Suspense` boundary မလိုပါဘူး။
- **`generateStaticParams` က မဖုံးလွှမ်းထားတဲ့ dynamic params ပါတဲ့ routes တွေ**: param က request time အထိ မသိရတဲ့ [fallback param](/docs/nextjs/generate-static-params) တစ်ခုပါ။ Pathname ကို prerendering အတွင်း ဖြေရှင်းလို့မရလို့ — `usePathname` က suspend လုပ်ပါတယ်။ Component (သို့) ၎င်း၏ parent တစ်ခုကို `Suspense` boundary အတွင်းမှာ wrap လုပ်ထားပါ — ဒါမှ prerendering ကာလအတွင်းမှာ fallback ကို render လုပ်လို့ရမှာပါ။ မဟုတ်ရင် build က ကျရှုံးပါတယ်။

ဒါက `usePathname` ကို ခေါ်နေတဲ့ component ကိုယ်တိုင် static ဖြစ်နေရင်တောင် သက်ရောက်ပါတယ်။ ဥပမာ — layout တစ်ခုထဲမှာ render လုပ်ထားတဲ့ active links ပါတဲ့ sidebar က — သူ့အောက်က မသိတဲ့ (unknown) dynamic param ရှိတဲ့ page ဘယ်ဟာမဆို ရှိရင် suspend ဖြစ်သွားပါတယ်။ ကျန်တဲ့ layout ကို prerendered ဖြစ်နေစေဖို့ — `usePathname` ခေါ်တဲ့ component (သို့) ၎င်း၏ parent ကို fallback ပါတဲ့ `Suspense` boundary တစ်ခုနဲ့ wrap လုပ်ပါ။

ဖြေရှင်းနည်း options အပြည့်အစုံနဲ့ အားနည်းချက်တွေအတွက် — [Next.js encountered URL data in a Client Component outside of Suspense](https://nextjs.org/docs/messages/blocking-prerender-client-hook) ကို ကြည့်ပါ။

## ဥပမာများ

### Route ပြောင်းလဲမှုကို တုံ့ပြန်တဲ့ အလုပ်တစ်ခု လုပ်ဆောင်ခြင်း

```tsx
// app/example-client-component.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // ဒီမှာ တစ်ခုခု လုပ်ဆောင်ပါ...
  }, [pathname, searchParams])
}
```

### Rewrites နဲ့ hydration mismatch ရှောင်ခြင်း

Page တစ်ခုကို prerender လုပ်တဲ့အခါ — HTML ကို source pathname အတွက် ထုတ်လုပ်ပေးပါတယ်။ Page ကို `next.config` ထဲက rewrite (သို့) `Proxy` တစ်ခုကတစ်ဆင့် ရောက်ရှိလာရင် — browser ရဲ့ URL က ကွဲပြားနိုင်ပြီး `usePathname()` က client ပေါ်မှာ rewritten pathname ကို ဖတ်ပါလိမ့်မယ်။

Hydration mismatches တွေ ရှောင်ဖို့ — client pathname ပေါ်မှာ မှီခိုတဲ့ အစိတ်အပိုင်းကို သေးငယ်ပြီး သီးသန့် (isolated) ဖြစ်အောင် UI ကို ဒီဇိုင်းဆွဲပါ။ Server ပေါ်မှာ stable fallback တစ်ခုကို render လုပ်ပြီး — mount ပြီးမှ အဲဒီအစိတ်အပိုင်းကို update လုပ်ပါ။ ဒီလို deferred read က တကယ့် pathname မပေါ်ခင် fallback ကို ခဏလေး ပြသနေပါလိမ့်မယ် — မြင်ရတဲ့ flicker (မှိတ်တုတ် မှိတ်တုတ် ဖြစ်ခြင်း) ကို ဖယ်ရှားနိုင်တဲ့ နည်းလမ်းတွေအတွက် [Preventing flash before hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) ကို ကြည့်ပါ။

```tsx
// app/example-client-component.tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PathnameBadge() {
  const pathname = usePathname()
  const [clientPathname, setClientPathname] = useState('')

  useEffect(() => {
    setClientPathname(pathname)
  }, [pathname])

  return (
    <p>
      Current pathname: <span>{clientPathname}</span>
    </p>
  )
}
```

## Version History

| Version   | အပြောင်းအလဲ                |
| --------- | ------------------------- |
| `v13.0.0` | `usePathname` စတင် မိတ်ဆက် |
