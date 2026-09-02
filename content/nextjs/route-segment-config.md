---
title: "Route Segment Config (route segment options များ)"
description: "Route Segment Config — Page, Layout (သို့) Route Handler တစ်ခုရဲ့ အပြုအမူကို variables တွေ တိုက်ရိုက် export လုပ်ပြီး configure လုပ်နိုင်စေတဲ့ route segment options များ (runtime, maxDuration, dynamicParams, preferredRegion, prefetch, instant)"
order: 74
source: "https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config"
status: translated
updated: 2026-09-02
---

Route Segment Config options တွေက — အောက်ပါ variables တွေကို တိုက်ရိုက် export လုပ်ခြင်းအားဖြင့် [Page](/docs/nextjs/file-conventions-page) တစ်ခု၊ [Layout](/docs/nextjs/file-conventions-layout) တစ်ခု (သို့) [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုရဲ့ အပြုအမူကို configure လုပ်နိုင်စေပါတယ်:

| Option                                                         | Type                                                                              | Default                        |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------ |
| [`dynamicParams`](#dynamicparams)                              | `boolean`                                                                         | `true`                         |
| [`runtime`](#runtime)                                          | `'nodejs' \| 'edge' (deprecated)`                                                 | `'nodejs'`                     |
| [`preferredRegion`](#preferredregion)                          | `'auto' \| 'global' \| 'home' \| string \| string[] (deprecated)`                 | `'auto'`                       |
| [`maxDuration`](#maxduration)                                  | `number`                                                                          | Deployment platform က သတ်မှတ်သည် |

## runtime

`runtime` option က — သင့် route ကို render လုပ်ရာမှာ သုံးမယ့် JavaScript runtime ကို ရွေးချယ်နိုင်စေပါတယ်။

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const runtime = 'nodejs'
// 'nodejs'
```

```js filename="layout.js | page.js | route.js" switcher
export const runtime = 'nodejs'
// 'nodejs'
```

- **`'nodejs'`** (default)
- **`'edge'`** (deprecated)

> **သိထားသင့်သည်:**
>
> - Edge Runtime က deprecated ဖြစ်သွားပါပြီ။ သင့် route files တွေထဲက `runtime` export ကို ဖယ်ရှားပါ။ [Edge Runtime Deprecated](https://nextjs.org/docs/messages/edge-runtime-deprecated) ကို ကြည့်ပါ။
> - ဒီ option ကို [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) မှာ သုံးလို့ မရပါဘူး။

## maxDuration

`maxDuration` option က — route segment တစ်ခုထဲက server-side logic အတွက် အမြင့်ဆုံး execution time (လုပ်ဆောင်ချိန်၊ စက္ကန့်နဲ့) ကို သတ်မှတ်နိုင်စေပါတယ်။ Deployment platforms တွေက Next.js ရဲ့ build output ထဲက `maxDuration` ကို သုံးပြီး — သီးခြား execution limits (လုပ်ဆောင်ချိန် ကန့်သတ်ချက်များ) သတ်မှတ်ပေးနိုင်ပါတယ်။

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const maxDuration = 5
```

```js filename="layout.js | page.js | route.js" switcher
export const maxDuration = 5
```

### Server Actions

[Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေ သုံးနေတယ်ဆိုရင် — page ပေါ်မှာ သုံးထားတဲ့ Server Actions အားလုံးရဲ့ default timeout ကို ပြောင်းလဲဖို့ `maxDuration` ကို page level မှာ သတ်မှတ်ပါ။

## dynamicParams

`dynamicParams` option က — [generateStaticParams](/docs/nextjs/generate-static-params) နဲ့ generate မလုပ်ထားတဲ့ dynamic segment တစ်ခုကို ဝင်ရောက်ကြည့်ရှုတဲ့အခါ ဘာဖြစ်မလဲ ဆိုတာကို ထိန်းချုပ်နိုင်စေပါတယ်။

```tsx filename="layout.tsx | page.tsx" switcher
export const dynamicParams = true // true | false
```

```js filename="layout.js | page.js | route.js" switcher
export const dynamicParams = true // true | false
```

- **`true`** (default): `generateStaticParams` ထဲမှာ မပါဝင်တဲ့ dynamic route segments တွေကို request time (request ဝင်လာချိန်) မှာ generate လုပ်ပါတယ်။
- **`false`**: `generateStaticParams` ထဲမှာ မပါဝင်တဲ့ dynamic route segments တွေက 404 ပြန်ပေးပါလိမ့်မယ်။

> **သိထားသင့်သည်:**
>
> - ဒီ option က `pages` directory ထဲက `getStaticPaths` ရဲ့ `fallback: true | false | blocking` option နေရာကို အစားထိုးပါတယ်။
> - `dynamicParams` က [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enable ဖြစ်နေချိန်မှာ မရနိုင်ပါဘူး။

## preferredRegion

> **Deprecated:** `preferredRegion` route segment config က deprecated ဖြစ်သွားပါပြီ။ သင့် route files တွေထဲက `preferredRegion` export ကို ဖယ်ရှားပါ။ အသေးစိတ်အတွက် [deprecation message](https://nextjs.org/docs/messages/preferred-region-deprecated) ကို ကြည့်ပါ။

`preferredRegion` option က — route segment တစ်ခုအတွက် နှစ်သက်ရာ (preferred) deployment region တစ်ခုကို သတ်မှတ်နိုင်စေပါတယ်။ ဒီတန်ဖိုးကို သင့် deployment platform ဆီ ပို့ပေးပါတယ်။

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const preferredRegion = // string || string[]
```

```js filename="layout.js | page.js | route.js" switcher
export const preferredRegion = // string || string[]
```

- **`string`**: Route ကို သတ်မှတ်ထားတဲ့ region တစ်ခုတည်းမှာ deploy လုပ်ပါတယ်။ ရနိုင်တဲ့ region codes တွေက platform အလိုက် ကွဲပြားပါတယ်။ ဥပမာ — `'iad1'`။
- **`string[]`**: Route ကို region အများအပြားမှာ deploy လုပ်ပါတယ်။ Route ကို list ထဲကနေ ရွေးလိုက်တဲ့ region တစ်ခုတည်းမှာ မဟုတ်ဘဲ — စာရင်းထဲက region တွေ **အားလုံး**မှာ deploy လုပ်ပါတယ်။ ဥပမာ — `['iad1', 'sfo1']`။

> **သိထားသင့်သည်:**
>
> - `preferredRegion` ကို သတ်မှတ်မထားရင် — အနီးဆုံး parent layout ရဲ့ option ကို အမွေဆက်ခံ (inherit) ပါတယ်။ Root layout ကတော့ `'auto'` ဖြစ်ပါတယ်။
> - Child segment ရဲ့ တန်ဖိုးက parent ရဲ့ တန်ဖိုးကို override လုပ်ပြီး — တန်ဖိုးတွေကို merge (ပေါင်းစပ်) လုပ်တာ မဟုတ်ပါဘူး။
> - Next.js က region တန်ဖိုးတွေကို deployment platform ဆီ ဖြတ်ပို့ပါတယ်။ တိကျတဲ့ အပြုအမူ နဲ့ ရနိုင်တဲ့ region codes တွေက platform အလိုက် ကွဲပြားပါတယ်။ ထောက်ပံ့ထားတဲ့ တန်ဖိုးတွေအတွက် သင့် deployment platform ရဲ့ documentation ကို ကိုးကားပါ။

### Vercel

Next.js ကို Vercel မှာ deploy လုပ်မယ်ဆိုရင် — regions တွေကို အရင်က `export const runtime = 'edge'` နဲ့မှသာ ထောက်ပံ့ခဲ့ပြီး အခုအခါမှာတော့ [deprecated](https://nextjs.org/docs/messages/edge-runtime-deprecated) ဖြစ်သွားပါပြီ။ အောက်ပါ options တွေကို ပေးနိုင်ပါတယ်:

- **`'auto'`** (default): ပုံမှန် (default) region ကို သုံးပါတယ်။
- **`'global'`**: Route ကို region အားလုံးမှာ deploy လုပ်တာကို ဦးစားပေးပါတယ်။
- **`'home'`**: Route ကို home region မှာ deploy လုပ်တာကို ဦးစားပေးပါတယ်။

ထောက်ပံ့မထားတဲ့ တန်ဖိုးတစ်ခု ပေးလိုက်ရင် error ထွက်ပါလိမ့်မယ်။

## prefetch

`prefetch` route segment config က — client-side navigation အတွင်း segment တစ်ခုကို ဘယ်လို prefetch (ကြိုတင်ယူ) လုပ်မလဲ ဆိုတာကို ထိန်းချုပ်ပါတယ်။ Default အနေနဲ့ framework က app ရဲ့ [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) setting ပေါ် မူတည်ပြီး strategy ကို စီမံပေးပါတယ်။ Segment တစ်ခုချင်းစီအလိုက် override လုပ်ချင်ရင် — ဒီ export ကို အောက်က တန်ဖိုးတွေထဲက တစ်ခုနဲ့ သတ်မှတ်ပါ။

> **သိထားသင့်သည်:**
>
> - `prefetch` export က [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enable ဖြစ်နေမှသာ အလုပ်လုပ်ပါတယ်။
> - Segment က Client Component ဖြစ်နေရင် `prefetch` ကို သုံးလို့ မရပါဘူး။
> - သတ်မှတ်လို့ အဓိပ္ပာယ်ရှိတဲ့ တန်ဖိုးတွေကတော့ `'partial'` နဲ့ `'force-disabled'` ပါ။ `'auto'` ကတော့ default ဖြစ်ပြီး — export ကို ချန်လှပ်ထားတာနဲ့ ညီမျှပါတယ်; `prefetch = 'auto'` လို့ ရှင်းရှင်းလင်းလင်း မရေးပါနဲ့။

```tsx filename="layout.tsx | page.tsx" switcher
export const prefetch = 'partial'

export default function Page() {
  return <div>...</div>
}
```

```jsx filename="layout.js | page.js" switcher
export const prefetch = 'partial'

export default function Page() {
  return <div>...</div>
}
```

### Options

#### `'partial'`

Segment ကို global [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) flag ဖွင့်စရာ မလိုဘဲ [Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) ထဲ ဝင်စေပါတယ်။ `prefetch = 'partial'` ရှိတဲ့ segment တစ်ခုကို ညွှန်တဲ့ `<Link>` တစ်ခုက — ပုံစံဟောင်း full prefetch အစား route တစ်ခုချင်းစီရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို load လုပ်ပါတယ်။ ဒါကို link မှာ မဟုတ်ဘဲ destination (ဦးတည်ရာ) မှာ သတ်မှတ်ပါ။

Prefecth ပိုကျယ်ပြန့်အောင် [`<Link prefetch={true}>`](/docs/nextjs/component-link#prefetch) နဲ့ ဝင်ချင်တဲ့ links တွေအတွက် — Next.js က per-link prefetching ကို သုံးပါတယ်။ Server က URL data (`params`, `searchParams`, နဲ့ URL အပြည့်အစုံ) တွေကို ဖြေရှင်းပေးတဲ့ response အသစ်တစ်ခုကို render လုပ်ပါတယ်။ Content အားလုံး statically render လုပ်လို့ရတဲ့ pages တွေမှာ — Next.js က static cache ကနေ prefetches တွေကို ထုတ်ပေးပါတယ်။ Page တစ်ခုက static မဟုတ်တဲ့ data တွေကို ဝင်ရောက်သုံးနေရင် — အဲဒါကို runtime မှာ prefetch လုပ်ပါတယ်။

`partialPrefetching` ကို app တစ်ခုလုံးအတွက် တစ်ပြိုင်နက် ဖွင့်လို့ မရတဲ့အခါ — ဒါကို တဖြည်းဖြည်း (incremental) စတင်သုံးစွဲဖို့ သုံးပါ။ သက်ဆိုင်ရာ route တိုင်းမှာ `prefetch = 'partial'` ရှိသွားပြီဆိုရင် — global flag ကို ဖွင့်ပြီး route တစ်ခုချင်းစီရဲ့ exports တွေကို ဖယ်ရှားလိုက်ပါ။

> **သိထားသင့်သည်:** Next.js က segment တစ်ခုအတွက် per-link prefetch လုပ်တဲ့အခါ — အောက်ဘက်က downstream segments တွေ အားလုံးက request တစ်ခုတည်းထဲမှာ ပါဝင်ပါတယ်။ Tree ထဲက ပိုနက်တဲ့နေရာမှာ `'force-disabled'` နဲ့ configure လုပ်ထားတဲ့ segments တွေကလည်း response ရဲ့ အစိတ်အပိုင်းအဖြစ် prefetch ခံရဆဲ ဖြစ်ပါတယ်။

```tsx filename="page.tsx"
export const prefetch = 'partial'
```

#### `'force-disabled'`

ဒီ segment ကို ဘယ်တော့မှ prefetch မလုပ်ပါနဲ့။ Client က navigation မတိုင်ခင် segment data တွေကို request လုပ်မှာ မဟုတ်ပါဘူး။ Prefetching က အကျိုးမရှိတဲ့ segments တွေအတွက် ဒါကို သုံးပါ — ဥပမာ authentication နောက်မှာ ရှိပြီး ခဲခဲယဉ်းယဉ်းပဲ လာလည်တဲ့ pages တွေမျိုး။

> **သိထားသင့်သည်:** `'force-disabled'` က Next.js က route အကြောင်း metadata တွေကို prefetch လုပ်တာကို တားဆီးမပေးပါဘူး။ ဒါပေမယ့် — ဒီ segment နဲ့ သူ့အောက်က segments တွေရဲ့ တကယ့် segment data တွေကတော့ prefetching ကနေ ဖယ်ထုတ်ခံရပါမယ်။

### Relationship with the `<Link prefetch>` prop

Prefetch တစ်ခုက — ရည်ရွယ်ချက် (ဒီ destination ကို prefetch လုပ်သင့်လား၊ ဘယ်လောက် စိတ်အားထက်သန်စွာ လုပ်သင့်လဲ) ဖော်ပြတဲ့ `<Link>` တစ်ခုကနေ စတင်ပြီး — cost ceiling (ဒီနေရာကို ညွှန်တဲ့ link ဘယ်ဟာမဆို အတွက် ကြိုတင် ဘယ်လောက်အထိ အလုပ်လုပ်ထားတာ အဆင်ပြေလဲ) သတ်မှတ်တဲ့ segment တစ်ခုမှာ အဆုံးသတ်ပါတယ်။

Destination တစ်ခုက ဘယ် links တွေက သူ့ကို ညွှန်နေလဲ မသိနိုင်လို့ — segment config က ဘယ် [`<Link prefetch={true}>`](/docs/nextjs/component-link#prefetch) မဆို ဆွဲယူတာတွေကို ကန့်သတ် (cap) ပေးပါတယ်:

- [`'partial'`](#partial): Default links တွေအတွက် App Shell; [`<Link prefetch={true}>`](/docs/nextjs/component-link#prefetch) တစ်ခုက ထပ်ပြီး URL data (`params`, `searchParams`, နဲ့ URL အပြည့်အစုံ) ရော သူ့နောက်က cached content တွေပါ ဖြေရှင်းယူပါတယ်။
- [`'force-disabled'`](#force-disabled): Segment data တွေကို လုံးဝ ကျော်လိုက်ပါတယ်။

[`<Link prefetch={false}>`](/docs/nextjs/component-link#prefetch) က destination ကို ဘယ်လိုပဲ configure လုပ်ထားပါစေ — link level မှာ prefetching ကို ကျော်သွားပါတယ်။

> **သိထားသင့်သည်:** Content အားလုံး statically render လုပ်လို့ရတဲ့ pages တွေမှာ — Next.js က prefetches တွေကို static cache (သို့) CDN ကနေ ထုတ်ပေးပါတယ်။ Page တစ်ခုက cookies (သို့) headers လိုမျိုး static မဟုတ်တဲ့ data တွေကို ဝင်ရောက်သုံးနေရင် — server render အသစ်တစ်ခုနဲ့ runtime မှာ prefetch လုပ်ပြီး — page view တစ်ခုချင်းစီအတွက် server CPU ကုန်ကျပါတယ်။

### TypeScript

```tsx
type Prefetch = 'auto' | 'partial' | 'force-disabled'

export const prefetch: Prefetch = 'partial'
```

## instant

`instant` route segment config က — ဒီ segment ထဲကို ဝင်တဲ့ navigation တစ်ခုက instant UI (ချက်ချင်း ပေါ်လာတဲ့ UI) တစ်ခုကို ထုတ်လုပ်နိုင်မလား ဆိုတာကို Next.js က ဘယ်လို validate (စစ်ဆေးအတည်ပြု) မလဲ ဆိုတာကို ထိန်းချုပ်ပါတယ်။

Next.js က လက်ရှိ page ပေါ်က in-app links တွေ အားလုံးအတွက် navigations တွေကို ကြိုတင် load လုပ်ဖို့ prefetching ကို သုံးပါတယ်။ ဒါပေမယ့် — client-side data fetching တွေ (သို့) server ကနေ တစိတ်တပိုင်း prerender လုပ်ထားတဲ့ ရလဒ်တွေက UI ကို ချက်ချင်း update မဖြစ်စေတဲ့ navigations တွေ ဖြစ်စေနိုင်ပါတယ်။ မြန်ဆန်တယ်လို့ ခံစားရတဲ့ navigations တွေ တည်ဆောက်ဖို့ ကူညီဖို့ — `instant` က configure လုပ်ထားတဲ့ segment ကနေဖြတ်တဲ့ navigations တွေကနေ ဘာကို မျှော်လင့်ရမလဲ ဆိုတာကို Next.js ကို ပြောပြနိုင်စေပါတယ်။ ဥပမာ — ဒီ segment ထဲကို ဝင်တဲ့ navigations တွေက ပြင်ပ (external) data တွေ ဘာမှ မစောင့်ဘဲ ချက်ချင်း render ဖြစ်တဲ့ UI တစ်ခု ထုတ်သင့်တယ်လို့ ညွှန်ပြနိုင်သလို — navigations တွေက instant ဖြစ်ဖို့ မမျှော်လင့်ထားဘူးလို့လည်း ညွှန်ပြနိုင်ပါတယ်။

Segment တစ်ခုကို instant UI မျှော်လင့်ဖို့ configure လုပ်ထားတဲ့အခါ — Next.js က navigation ကို UI ချက်ချင်း update လုပ်တာကနေ တားဆီးနိုင်တဲ့ သင့် application ထဲက code တွေကို ပေါ်လွင်စေပါတယ်။ လေ့လာမှု အပြည့်အစုံ (end-to-end walkthrough) အတွက် [Instant Navigation guide](https://nextjs.org/docs/app/guides/instant-navigation) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:**
>
> - `instant` export က [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enable ဖြစ်နေမှသာ အလုပ်လုပ်ပါတယ်။
> - `instant` ကို Client Components တွေမှာ သုံးလို့ မရပါဘူး။ Error တက်ပါလိမ့်မယ်။
> - Next.js က development မှာ prefetches တွေ မလုပ်ပါဘူး — ဒါကြောင့် navigations တွေက production မှာလောက် instant ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။ Validation က prefetching ဖွင့်ထားတဲ့ `next start` အတွင်းမှာ ဘာဖြစ်မလဲ ဆိုတာကို ထင်ဟပ်ပါတယ်။

```tsx filename="layout.tsx | page.tsx" switcher
export const instant = true

export default function Page() {
  return <div>...</div>
}
```

```jsx filename="layout.js | page.js" switcher
export const instant = true

export default function Page() {
  return <div>...</div>
}
```

### Reference

Export က အောက်ပါတို့ကို လက်ခံပါတယ်:

- **`true`**: Segment ကို global အနေနဲ့ configure လုပ်ထားတဲ့ level မှာ validation ထဲ ဝင်စေပါတယ် ([Configuring validation defaults](#configuring-validation-defaults) ကို ကြည့်ပါ)။ Framework default တွေနဲ့ဆို — validation က development မှာပဲ run ပြီး dev overlay မှာ errors တွေ ပြပါတယ်။
- **`false`**: Segment ကို validation ကနေ ဖယ်ထုတ် (opt out) ပါတယ် ([Disabling instant](#disabling-instant) ကို ကြည့်ပါ)။
- **object** တစ်ခု: Options တွေ ထပ်ထည့်ပြီး opt in လုပ်ပါတယ်။ [`level`](#level) ကို ကြည့်ပါ။

#### `level`

ဒီ segment အတွက် validation run ဖြစ်မယ့် ပြင်းထန်မှု (severity) ကို သတ်မှတ်ပါတယ်။

```tsx filename="page.tsx"
export const instant = {
  level: 'warning',
}
```

- **`'warning'`**: Development မှာပဲ validate လုပ်ပါတယ်။ Errors တွေက dev overlay မှာ ပေါ်ပြီး — build ကို မထိခိုက်ပါဘူး။

နောင်မှာ build အတွင်းမှာပါ validation ထောက်ပံ့ပေးနိုင်တဲ့ validation level တစ်ခု ထပ်ထောက်ပံ့သွားပါလိမ့်မယ်။ Experimental validation modes တွေ ဖွင့်မထားရင် level ကို သတ်မှတ်စရာ မလိုပါဘူး — ရနိုင်တဲ့ level က `"warning"` တစ်ခုတည်းပဲ ရှိလို့ပါ။

`level` ကို ချန်လှပ်ထားရင် (သို့) `instant = true` သုံးထားရင် — segment ကို global အနေနဲ့ configure လုပ်ထားတဲ့ level မှာ validate လုပ်ပါတယ် — [Configuring validation defaults](#configuring-validation-defaults) ကို ကြည့်ပါ။

#### Disabling instant

Layout (သို့) page တစ်ခုပေါ်မှာ `false` သတ်မှတ်ပြီး — ဒီ segment ကို ဝင်ကြည့်တဲ့အခါ block ဖြစ်ခွင့်ရှိတယ်လို့ ညွှန်ပြနိုင်ပါတယ်။

ပိုနက်တဲ့ page တစ်ခုက instant ဖြစ်သင့်ပေမယ့် ancestor (အထက်အဆင့်) တစ်ခုက မဖြစ်နိုင်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ ဥပမာ — shared layout တစ်ခုက instant အနေနဲ့ load မလုပ်နိုင်ပေမယ့် ဒီ layout အောက်က pages တွေကို instant အနေနဲ့ navigate လုပ်လို့ရတယ်လို့ သေချာအောင် လုပ်ချင်တယ်ဆိုရင် — pages တွေမှာ `instant = true` ထားပြီး shared layout မှာ `instant = false` ထားနိုင်ပါတယ်။

```tsx filename="app/tabs/layout.tsx"
export const instant = false
```

```tsx filename="app/tabs/[tab]/page.tsx"
export const instant = true
```

အပြင်ကနေ tab တစ်ခုထဲကို ဝင်တဲ့ navigations တွေက layout မှာ block ဖြစ်ခွင့်ရှိပါတယ်။ Tabs တွေကြားက navigations တွေကတော့ instant UI အတွက် validate လုပ်ခံရပါတယ်။

Instant page တစ်ခုရဲ့ ancestors တွေက block လုပ်တတ်တဲ့အရာတစ်ခုခု လုပ်နေလို့ဆိုပြီး `false` ထည့်စရာ မလိုပါဘူး — အပေါ်က `instant = true` က သူ့အောက်က descendants တွေကို validate လုပ်ဖို့ အတင်းအကျပ် မလုပ်ပါဘူး၊ ancestor တစ်ခုကို configure မလုပ်ဘဲ ထားတာလည်း အဆင်ပြေပါတယ်။ ပိုနက်တဲ့ page တစ်ခုကို instant အဖြစ် configure လုပ်ထားပြီး — block လုပ်တဲ့ ancestor တစ်ခုကနေဖြတ်တဲ့ navigations တွေကို ကင်းလွတ်ခွင့် (exempt) ပေးဖို့ လိုအပ်မှသာ `false` ကို သုံးပါ။

#### Disabling static shell validation

Cache Components က app ထဲက page တိုင်းက prerender လုပ်ချိန်မှာ static shell (route ရဲ့ static အစိတ်အပိုင်း) အလွတ်မဟုတ်တဲ့ (non-empty) တစ်ခု ထုတ်လုပ်တာကိုလည်း validate လုပ်ပါတယ်။ Route တစ်ခုကို ဒီ validation ကနေ ဖယ်ထုတ်ချင်ရင် — route ရဲ့ tree ထဲက အမြင့်ဆုံး `instant` config က `false` ဖြစ်နေဖို့ သေချာပါစေ — static-shell check အတွက် tree ထဲက အပေါ်က `false` က အောက်က `true` တွေထက် ဦးစားပေး အလုပ်လုပ်ပါတယ်။

Root layout ပေါ်မှာ `false` သတ်မှတ်လိုက်ရင် — app တစ်ခုလုံးအတွက် static shell validation ကို ပိတ်လိုက်တာ ဖြစ်ပါတယ်။ `false` ကို တတ်နိုင်သမျှ အနိမ့်ဆုံး နေရာမှာ ထားပါ — ဖယ်ထုတ်ချင်တဲ့ routes တွေကို ဖုံးအုပ်ဖို့ လိုအပ်တဲ့ အမြင့်လောက်ပဲ ထားပါ — ဒါမှ ကျန်တဲ့ app က validate လုပ်နေဦးမှာ ဖြစ်ပါတယ်။

### How validation works

`instant` က route ထဲက shared layout boundary တိုင်းမှာ validation ကို စတင်ပါတယ်။ Validation က development အတွင်း (page loads နဲ့ HMR updates တွေပေါ်မှာ) run ပြီး dev error overlay မှာ errors တွေ ပြပါတယ်။

Error တစ်ခုချင်းစီက navigation ကို block ဖြစ်စေမယ့် component ကို ဖော်ထုတ်ပါတယ်။ အများအားဖြင့် ဖြေရှင်းနည်းက — data တွေကို `use cache` နဲ့ cache လုပ်တာ (သို့) `<Suspense>` boundary တစ်ခုထဲမှာ wrap လုပ်တာ ဖြစ်ပါတယ်။

### Configuring validation defaults

Default (`validationLevel: 'warning'`) အနေနဲ့ — Cache Components apps တွေက Page နဲ့ Default segment တိုင်းကို development မှာ validate လုပ်ပါတယ်။ `experimental.instantInsights.validationLevel` config က ဒီအပြုအမူကို ချိန်ညှိပေးပါတယ် — ဥပမာ — `instant` ကနေတဆင့် တိုက်ရိုက် opt in လုပ်ထားတဲ့ segments တွေကိုပဲ validate လုပ်ဖို့ ကန့်သတ်ချင်ရင် သုံးပါ။

```js filename="next.config.js"
module.exports = {
  experimental: {
    instantInsights: {
      validationLevel: 'warning',
    },
  },
}
```

ထောက်ပံ့ထားတဲ့ levels တွေက:

- **`'warning'`** _(framework default)_: Page နဲ့ Default segment တိုင်းကို warning level မှာ သွယ်ဝိုက်၍ (implicitly) validate လုပ်ပါတယ် (dev မှာပဲ)။
- **`'manual-warning'`**: `instant` ကို တိုက်ရိုက် သတ်မှတ်ထားတဲ့ segments တွေကိုပဲ warning level မှာ validate လုပ်ပါတယ် (dev မှာပဲ)။

Segment တစ်ခုပေါ်မှာ `instant = false` သတ်မှတ်ထားရင် — validation ကနေ လုံးဝ ဖယ်ထုတ်လိုက်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - Framework default က နောက်ဗားရှင်းတွေမှာ users တွေကို ပိုမြင့်တဲ့ validation levels တွေဆီ opt in ဖြစ်စေဖို့ ပြောင်းလဲနိုင်ပါတယ်။ ဒီ feature က experimental ဖြစ်လို့ — အဲဒီပြောင်းလဲမှုကို breaking change အဖြစ် မသတ်မှတ်ပါဘူး။ သီးခြား အပြုအမူတစ်ခုကို သေချာစေချင်ရင် — `validationLevel` ကို တိုက်ရိုက် သတ်မှတ်ပါ။
> - Framework က ဖန်တီးထားတဲ့ error routes (`/_global-error`, `/_not-found`) တွေကို implicit validation ကနေ ဖယ်ထုတ်ထားပါတယ်။ သူတို့ကို validate လုပ်ချင်ရင် — `instant` နဲ့ တိုက်ရိုက် opt in လုပ်ပါ။

### Inspecting loading states

Navigation Inspector က Cache Components enable ဖြစ်နေချိန်မှာ ရနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  cacheComponents: true,
}
```

Next.js DevTools ကို ဖွင့်ပြီး **Navigation Inspector** ကို ရွေးကာ — **Pause on navigations** ကို ဖွင့်ပါ။ Toggle ဖွင့်ထားချိန်မှာ:

- Dynamic data တွေ မဝင်လာခင် — route အတွက် ထုတ်လုပ်ထားတဲ့ ကနဦး static UI ကို အေးခဲသွားစေဖို့ page ကို refresh လုပ်ပါ။
- Destination route အတွက် prefetch လုပ်ထားတဲ့ UI ကို အေးခဲသွားစေဖို့ link တစ်ခုကို နှိပ်ပါ။

UI အေးခဲသွားတဲ့အခါ — လက်ရှိ navigation ကို အပြီးသတ်ဖို့ **Resume** ကို နှိပ်ပါ။ Toggle က ဆက်ဖွင့်ထားတာမို့ — နောက် refresh (သို့) link click တွေမှာလည်း pause လုပ်ဦးမှာ ဖြစ်ပါတယ်။ ပြီးရင် ပိတ်လိုက်ပါ။ ပထမဆုံး ဝင်ရောက်တဲ့အခါရော navigation လုပ်တဲ့အခါမှာပါ loading states တွေ မှန်ကန်နေစေဖို့ — page refreshes ရော link clicks နှစ်မျိုးလုံးကို သုံးပြီး စစ်ဆေးပါ။

### Testing instant navigation

`@next/playwright` package က — callback က instant UI ပေါ်မှာ run နေချိန်မှာ dynamic content တွေကို ချုပ်ထားပေးတဲ့ `instant()` helper တစ်ခုကို export လုပ်ပါတယ်။ ဥပမာ အပြည့်အစုံအတွက် [guide](https://nextjs.org/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) ကို ကြည့်ပါ။

```typescript
import { instant } from '@next/playwright'
```

### Known issue: shared cookie across projects

DevTools တွေက dynamic content တွေကို ချုပ်ထားပြီး instant UI မှာ page ကို အေးခဲစေဖို့ `next-instant-navigation-testing` cookie တစ်ခုကို သုံးပါတယ်။ Cookies တွေက port အတွက် မဟုတ်ဘဲ domain အတွက်ပဲ scope လုပ်ခံရလို့ — domain တစ်ခုတည်းမှာ (ပုံမှန်အားဖြင့် `localhost`) projects အများအပြား run လုပ်ရင် — cookie က projects တွေကြားမှာ share ဖြစ်ပြီး မမျှော်လင့်တဲ့ အပြုအမူတွေ ဖြစ်စေနိုင်ပါတယ်။ Projects တွေကြား ပြောင်းတဲ့အခါ — cookie ကို ရှင်းလိုက်ပါ (သို့) Navigation Inspector panel ကို ပိတ်လိုက်ပါ — ပြဿနာတွေ ရှောင်ရှားနိုင်ပါတယ်။

> **သိထားသင့်သည်:** ဒါကို feature ကို stabilize (တည်ငြိမ်အောင်) လုပ်ခြင်းရဲ့ အစိတ်အပိုင်းအနေနဲ့ ပြင်ဆင်သွားပါလိမ့်မယ်။

### TypeScript

```tsx
type InstantConfig =
  | true
  | false
  | {
      level?: 'warning'
    }

export const instant: InstantConfig = true
```

## Version History

| Version      | အပြောင်းအလဲ                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v16.0.0`    | `dynamic`, `dynamicParams`, `revalidate`, နဲ့ `fetchCache` တွေကို [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enable ဖြစ်နေချိန်မှာ ဖယ်ရှားလိုက်ပါတယ်။ [Caching and Revalidating (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components#route-segment-config) ကို ကြည့်ပါ။ |
| `v16.0.0`    | `export const experimental_ppr = true` ကို ဖယ်ရှားလိုက်ပါတယ်။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#remove-experimental_ppr-route-segment-config-from-app-router-pages-and-layouts) ရနိုင်ပါတယ်။                                                                                                                                      |
| `v15.0.0-RC` | `export const runtime = "experimental-edge"` ကို deprecated လုပ်လိုက်ပါတယ်။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#transform-app-router-route-segment-config-runtime-value-from-experimental-edge-to-edge) ရနိုင်ပါတယ်။                                                                                                               |
| `v13.4.10`   | `maxDuration` စတင် မိတ်ဆက်။                                                                                                                                                                                                                                                                                                                                    |
| `v16.x.x`    | `prefetch` export ကို စတင် မိတ်ဆက် (Cache Components များတွင်သာ)                                                                                                                                                                                                                                                                                                |
| `v16.x.x`    | `instant` export ကို စတင် မိတ်ဆက် (Cache Components များတွင်သာ)                                                                                                                                                                                                                                                                                                |
