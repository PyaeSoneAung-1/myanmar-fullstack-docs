---
title: "useSelectedLayoutSegments hook (Layout အောက်ရှိ active route segments အားလုံး ဖတ်ခြင်း)"
description: "useSelectedLayoutSegments() — Client Component hook နဲ့ ခေါ်ထားတဲ့ Layout ရဲ့ အောက်ဘက်ရှိ active route segments တွေကို array အနေနဲ့ ဖတ်နည်း; parallelRouteKey parameter, Route Groups နဲ့ catch-all segments ပါဝင်ပုံ, return တန်ဖိုးများနဲ့ Cache Components + Suspense လိုအပ်ချက်"
order: 151
source: "https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments"
status: translated
updated: 2026-09-03
---

`useSelectedLayoutSegments` က **Client Component** hook တစ်ခုဖြစ်ပြီး — သူ့ကို ခေါ်ထားတဲ့ Layout ရဲ့ **အောက်ဘက် (below)** မှာရှိတဲ့ active route segments တွေကို ဖတ်နိုင်စေပါတယ်။

ဒါက active child segments တွေအကြောင်း သိထားဖို့လိုတဲ့ parent Layouts တွေထဲမှာ UI ဖန်တီးတဲ့အခါ အသုံးဝင်ပါတယ် — ဥပမာ breadcrumbs (လမ်းကြောင်းပြ အညွှန်းများ) တွေလိုမျိုးပါ။

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

> **သိထားသင့်သည် (Good to know)**:
>
> - `useSelectedLayoutSegments` က [Client Component](/docs/nextjs/server-client-components) hook ဖြစ်ပြီး Layout တွေက default အားဖြင့် [Server Components](/docs/nextjs/server-client-components) တွေ ဖြစ်လို့ — `useSelectedLayoutSegments` ကို Layout တစ်ခုထဲကို import လုပ်ထားတဲ့ Client Component တစ်ခုကနေ အများအားဖြင့် ခေါ်ပါတယ်။
> - Return ရလာတဲ့ segments တွေမှာ [Route Groups](/docs/nextjs/file-conventions-route-groups) တွေ ပါဝင်နိုင်ပြီး — အဲဒါတွေကို သင့် UI ထဲမှာ ထည့်မပြချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။ Bracket (ကွင်းစကွင်းပိတ် `[]`) နဲ့ စတင်တဲ့ items တွေကို ဖယ်ထုတ်ဖို့ [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) array method ကို သုံးနိုင်ပါတယ်။
> - [Catch-all](/docs/nextjs/file-conventions-dynamic-routes) routes တွေအတွက် — ကိုက်ညီတဲ့ segments တွေကို array ထဲမှာ ပေါင်းထားတဲ့ string တစ်ခုတည်းအဖြစ် ပြန်ပေးပါတယ်။ ဥပမာ — `app/blog/[...slug]/page.js` ရှိပြီး `/blog/a/b/c` ကို လည်ပတ်တဲ့အခါ `app/layout.js` ကနေ ခေါ်ရင် `['blog', 'a/b/c']` ကို ပြန်ပေးပါတယ် — `['blog', 'a', 'b', 'c']` မဟုတ်ပါဘူး။

## Parameters

```tsx
const segments = useSelectedLayoutSegments(parallelRouteKey?: string)
```

`useSelectedLayoutSegments` က [`parallelRouteKey`](/docs/nextjs/parallel-routes) တစ်ခုကို _optionally_ (ထည့်လည်းရ၊ မထည့်လည်းရ) လက်ခံပါတယ် — ဒါဆိုရင် အဲဒီ slot အတွင်းက active route segment ကို ဖတ်နိုင်ပါတယ်။

## Returns

`useSelectedLayoutSegments` က — hook ကို ခေါ်ထားတဲ့ layout ရဲ့ အောက်ဘက်မှာရှိတဲ့ active segments တွေ ပါဝင်တဲ့ strings တွေရဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ ဘာမှ မရှိဘူးဆိုရင် empty array တစ်ခု ပြန်ပေးပါတယ်။

ဥပမာ — အောက်က Layouts တွေနဲ့ URLs တွေအတွက် return ရလာမယ့် segments တွေက:

| Layout                    | လည်ပတ်ခဲ့သော URL        | Return ရလာမယ့် Segments       |
| ------------------------- | --------------------- | ---------------------------- |
| `app/layout.js`           | `/`                   | `[]`                         |
| `app/layout.js`           | `/dashboard`          | `['dashboard']`              |
| `app/layout.js`           | `/dashboard/settings` | `['dashboard', 'settings']`  |
| `app/dashboard/layout.js` | `/dashboard`          | `[]`                         |
| `app/dashboard/layout.js` | `/dashboard/settings` | `['settings']`               |

Catch-all routes (`[...slug]`) တွေအတွက် — ကိုက်ညီတဲ့ path segments အားလုံးကို array ထဲမှာ ပေါင်းထားတဲ့ string တစ်ခုတည်းအဖြစ် ပြန်ပေးပါတယ်:

| Layout               | လည်ပတ်ခဲ့သော URL | Return ရလာမယ့် Segments |
| -------------------- | -------------- | ---------------------- |
| `app/layout.js`      | `/blog/a/b/c`  | `['blog', 'a/b/c']`    |
| `app/blog/layout.js` | `/blog/a/b/c`  | `['a/b/c']`            |

## အပြုအမူ (Behavior)

### Cache Components

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ဖွင့်ထားတဲ့အခါ — active segments တွေကို prerendering လုပ်ချိန်မှာ resolve လုပ်နိုင်လား မလုပ်နိုင်ဘူးလားပေါ် မူတည်ပြီး `useSelectedLayoutSegments` က [`Suspense`](https://react.dev/reference/react/Suspense) boundary တစ်ခု လိုအပ်နိုင်ပါတယ်။

- **Static routes တွေနဲ့ [`generateStaticParams`](/docs/nextjs/generate-static-params) ပါတဲ့ routes တွေ**: dynamic params အပါအဝင် route segment တိုင်းကို build time မှာ သိပြီးသားပါ။ Active segments တွေကို prerendering လုပ်ချိန်မှာ resolve လုပ်လို့ရလို့ — `useSelectedLayoutSegments` က server ပေါ်မှာ resolve ဖြစ်ပြီး `Suspense` boundary ဘာမှ မလိုအပ်ပါဘူး။
- **`generateStaticParams` နဲ့ မလွှမ်းခြုံထားတဲ့ dynamic params ပါတဲ့ routes တွေ**: param က [fallback param](/docs/nextjs/generate-static-params) ဖြစ်ပြီး — request time ရောက်မှသာ သိရပါတယ်။ Active segments တွေကို prerendering လုပ်ချိန်မှာ resolve လုပ်လို့မရလို့ — `useSelectedLayoutSegments` က suspend ဖြစ်ပါတယ်။ Component (သို့) parent တစ်ခုကို `Suspense` boundary တစ်ခုနဲ့ wrap လုပ်ထားပါ — ဒါဆို prerendering လုပ်ချိန်မှာ ၎င်းရဲ့ fallback ကို render လုပ်နိုင်မှာ ဖြစ်ပြီး — မဟုတ်ရင် build က မအောင်မြင်ပါဘူး။

`useSelectedLayoutSegments` ကို ခေါ်နေတဲ့ component ကိုယ်တိုင် static ဖြစ်နေရင်တောင် ဒါက အကျုံးဝင်ပါတယ်။ ဥပမာ — parent layout တစ်ခုမှာ render လုပ်ထားတဲ့ breadcrumb component ဟာ ၎င်းရဲ့အောက်မှာ unknown dynamic param ရှိတဲ့ page တစ်ခုခု ရှိနေရင် suspend ဖြစ်ပါတယ်။ Layout ရဲ့ ကျန်တဲ့အပိုင်းတွေ prerender ဖြစ်နေဖို့အတွက် — `useSelectedLayoutSegments` ကို ခေါ်တဲ့ component (သို့) parent တစ်ခုကို fallback ပါတဲ့ `Suspense` boundary တစ်ခုနဲ့ wrap လုပ်ထားပါ။

ပြည့်စုံတဲ့ ဖြေရှင်းနည်း options တွေနဲ့ trade-offs တွေအတွက် [Next.js encountered URL data in a Client Component outside of Suspense](https://nextjs.org/docs/messages/blocking-prerender-client-hook) ကို ကြည့်ပါ။

## Version History

| Version   | အပြောင်းအလဲ                         |
| --------- | ---------------------------------- |
| `v13.0.0` | `useSelectedLayoutSegments` ကို စတင် မိတ်ဆက်။ |
