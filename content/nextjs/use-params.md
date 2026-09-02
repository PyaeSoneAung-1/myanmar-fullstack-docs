---
title: "useParams hook (လက်ရှိ route ရဲ့ dynamic params ဖတ်ခြင်း)"
description: "useParams() — Client Component hook တစ်ခုအနေနဲ့ လက်ရှိ URL ကနေ ဖြည့်ထားတဲ့ route ရဲ့ dynamic params တွေကို ဖတ်နည်း; dynamic segments အမျိုးအစားအလိုက် return တန်ဖိုးတွေနဲ့ Cache Components + Suspense လိုအပ်ချက်"
order: 66
source: "https://nextjs.org/docs/app/api-reference/functions/use-params"
status: translated
updated: 2026-09-02
---

`useParams` က **Client Component** hook တစ်ခုဖြစ်ပြီး — လက်ရှိ URL ကနေ ဖြည့်ထားတဲ့ route တစ်ခုရဲ့ [dynamic params](/docs/nextjs/dynamic-routes) တွေကို ဖတ်နိုင်စေပါတယ်။

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams<{ tag: string; item: string }>()

  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return '...'
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams()

  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return '...'
}
```

## Parameters

```tsx
const params = useParams()
```

`useParams` က parameter ဘာမှ လက်မခံပါဘူး။

## Returns

`useParams` က လက်ရှိ route ရဲ့ ဖြည့်ပြီးသား (filled in) [dynamic parameters](/docs/nextjs/dynamic-routes) တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

- Object ထဲက property တစ်ခုစီဟာ active ဖြစ်နေတဲ့ dynamic segment တစ်ခုစီ ဖြစ်ပါတယ်။
- Properties ရဲ့ နာမည်က segment ရဲ့ နာမည် ဖြစ်ပြီး — properties ရဲ့ တန်ဖိုးက segment ထဲကို ဖြည့်ထားတဲ့ တန်ဖိုး ဖြစ်ပါတယ်။
- Properties ရဲ့ တန်ဖိုးက — [dynamic segment ရဲ့ အမျိုးအစား](/docs/nextjs/dynamic-routes) ပေါ် မူတည်ပြီး `string` (သို့) `string` တွေရဲ့ array တစ်ခု ဖြစ်ပါလိမ့်မယ်။
- Route ထဲမှာ dynamic parameters တွေ မပါဘူးဆိုရင် `useParams` က empty object တစ်ခုကို ပြန်ပေးပါတယ်။
- Pages Router မှာ သုံးမယ်ဆိုရင် — `useParams` က ပထမဆုံး render မှာ `null` ကို ပြန်ပေးပြီး router အသင့်ဖြစ်တာနဲ့ အပေါ်က စည်းမျဉ်းတွေအတိုင်း properties တွေနဲ့ update ဖြစ်ပါတယ်။

ဥပမာ:

| Route                           | URL         | `useParams()`             |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/page.js`              | `/shop`     | `{}`                      |
| `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

## အပြုအမူ (Behavior)

### Cache Components

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ဖွင့်ထားတဲ့အခါ — params တွေကို prerendering လုပ်ချိန်မှာ resolve လုပ်နိုင်လား မလုပ်နိုင်ဘူးလားပေါ် မူတည်ပြီး `useParams` က [`Suspense`](https://react.dev/reference/react/Suspense) boundary တစ်ခု လိုအပ်နိုင်ပါတယ်။

- **Static routes တွေနဲ့ [`generateStaticParams`](/docs/nextjs/generate-static-params) ပါတဲ့ routes တွေ**: dynamic param တိုင်းကို build time မှာ သိပြီးသားပါ။ `useParams` က server ပေါ်မှာ resolve ဖြစ်ပြီး `Suspense` boundary ဘာမှ မလိုအပ်ပါဘူး။
- **`generateStaticParams` နဲ့ မလွှမ်းခြုံထားတဲ့ dynamic params ပါတဲ့ routes တွေ**: param ကို request time ရောက်မှ သိရပါတယ်။ `useParams` က suspend ဖြစ်ပါတယ်။ Component (သို့) parent တစ်ခုကို `Suspense` boundary တစ်ခုနဲ့ wrap လုပ်ထားပါ — ဒါဆို prerendering လုပ်ချိန်မှာ ၎င်းရဲ့ fallback ကို render လုပ်နိုင်မှာ ဖြစ်ပြီး — မဟုတ်ရင် build က မအောင်မြင်ပါဘူး။

ပြည့်စုံတဲ့ ဖြေရှင်းနည်း options တွေနဲ့ trade-offs တွေအတွက် [Next.js encountered URL data in a Client Component outside of Suspense](https://nextjs.org/docs/messages/blocking-prerender-client-hook) ကို ကြည့်ပါ။

## Version History

| Version   | အပြောင်းအလဲ               |
| --------- | ------------------------- |
| `v13.3.0` | `useParams` ကို စတင် မိတ်ဆက်။ |
