---
title: "cacheLife function (cache သက်တမ်း သတ်မှတ်ခြင်း)"
description: "cacheLife() — `use cache` directive scope အတွင်းမှာ cached function/component တစ်ခုရဲ့ cache lifetime ကို preset profiles (seconds/minutes/hours/days/weeks/max) (သို့) custom profiles တွေနဲ့ သတ်မှတ်နည်း"
order: 53
source: "https://nextjs.org/docs/app/api-reference/functions/cacheLife"
status: translated
updated: 2026-09-02
---

`cacheLife` function က function (သို့) component တစ်ခုရဲ့ cache lifetime ကို သတ်မှတ်ပေးပါတယ်။ [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache) directive နဲ့ တွဲပြီး — အဲဒီ function (သို့) component ရဲ့ scope အတွင်းမှာ သုံးရပါမယ်။

## အသုံးပြုပုံ (Usage)

### အခြေခံ setup

`cacheLife` သုံးဖို့ ပထမဆုံး `next.config.js` file ထဲမှာ [`cacheComponents` flag](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို ဖွင့်ပါ:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

JavaScript project တွေမှာဆို `module.exports = { cacheComponents: true }` ပုံစံနဲ့ ရေးနိုင်ပါတယ်။

`cacheLife` ကို cache directive scope အတွင်းမှာပဲ သုံးလို့ ရပါတယ်။ File level မှာ (သို့) async function (သို့) component တစ်ခုရဲ့ အပေါ်ဆုံးမှာ `use cache` လိုမျိုး cache directive တစ်ခု ထည့်ပါ။ Module scope မှာတော့ `cacheLife` ကို မသုံးနိုင်ပါ — file ရဲ့ top level မှာ ခေါ်ရင် error တက်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - `use cache` scope တိုင်းမှာ `cacheLife` ကို သတ်မှတ်ထားဖို့ အကြံပြုပါတယ် — ဒါမှ call site မှာ အပြုအမူက ရှင်းလင်းနေမှာပါ။ ချန်လှပ်ထားရင် lifetime က implicit ဖြစ်နေပြီး (`default` profile သက်ရောက်) — [nested cached scopes](#nested-caching-behavior) တွေမှာ နားလည်ရ ခက်စေပါတယ်။
> - Caching သတ်မှတ်ထားတဲ့ function (သို့) component ထဲမှာပဲ `cacheLife` ကို ခေါ်ပါ။ Shared utilities တွေထဲ abstraction လုပ်တာကို ရှောင်ပါ — ဒါမှ cache အပြုအမူက ရှင်းလင်းပြီး လွယ်လွယ် နားလည်နေမှာပါ။
> - Function invocation တစ်ကြိမ်မှာ `cacheLife` call တစ်ခုပဲ run ဖြစ်အောင် သေချာပါစေ။ Control flow branches အမျိုးမျိုးမှာ ခေါ်ထားလို့ ရပေမယ့် — request တစ်ခုမှာ တစ်ခုပဲ run သင့်ပါတယ်။ [Conditional cache lifetimes](#conditional-cache-lifetimes) ဥပမာကို ကြည့်ပါ။

### Preset profiles သုံးခြင်း

Next.js က အသုံးများတဲ့ caching လိုအပ်ချက်တွေ ဖုံးအားပေးတဲ့ preset cache profiles တွေ ပေးပါတယ်။ Profile တစ်ခုစီက အချက် သုံးချက် ချိန်ခွင်လျှာညှိပေးပါတယ်:

- Update အသစ် ရှိမရှိ မစစ်ဘဲ user တွေက cached content ကို ဘယ်လောက်ကြာကြာ မြင်ရမလဲ (client-side)
- Server ပေါ်မှာ fresh content ကို ဘယ်နှစ်ခါလောက် generate လုပ်မလဲ
- Content အဟောင်းက ဘယ်အချိန်မှာ လုံးဝ expire ဖြစ်မလဲ

Content တွေ ဘယ်နှစ်ခါ update ဖြစ်လဲအပေါ် မူတည်ပြီး profile ရွေးပါ:

- **`seconds`** — Real-time data (စတော့စျေးနှုန်း၊ live scores)
- **`minutes`** — မကြာခဏ update ဖြစ်တဲ့ content (social feeds, news)
- **`hours`** — တစ်နေ့ကို အကြိမ်များစွာ update (product inventory, weather)
- **`days`** — နေ့စဉ် update (blog posts, articles)
- **`weeks`** — အပတ်စဉ် update (podcasts, newsletters)
- **`max`** — ခဲခဲယဉ်းယဉ်းပဲ ပြောင်းတဲ့ content (legal pages, archived content)

`cacheLife` ကို import လုပ်ပြီး profile name တစ်ခု ပေးလိုက်ပါ:

```tsx
// app/blog/page.tsx
'use cache'
import { cacheLife } from 'next/cache'

export default async function BlogPage() {
  cacheLife('days') // Blog content updated daily

  const posts = await getBlogPosts()
  return <div>{/* render posts */}</div>
}
```

Profile name က function တစ်ခုလုံးရဲ့ output ကို ဘယ်လို cache လုပ်မလဲ ဆိုတာ Next.js ကို ပြောပြပါတယ်။ `cacheLife` မခေါ်ရင် `default` profile ကို သုံးပါတယ် — timing အသေးစိတ်အတွက် [preset cache profiles](#preset-cache-profiles) ကို ကြည့်ပါ။

## Reference

### Cache profile properties

Cache profiles တွေက caching အပြုအမူကို timing properties သုံးခုနဲ့ ထိန်းချုပ်ပါတယ်:

- **[`stale`](#stale)**: Client က server ကို မစစ်ဘဲ cached data ကို ဘယ်လောက်ကြာကြာ သုံးနိုင်မလဲ
- **[`revalidate`](#revalidate)**: ဒီအချိန် ကျော်လွန်ရင် နောက် request က background refresh တစ်ခု စတင်စေမယ်
- **[`expire`](#expire)**: Requests မရှိဘဲ ဒီအချိန် ကျော်လွန်ရင် နောက် request က fresh content အတွက် စောင့်ရပါမယ်

#### `stale`

**Client-side:** Client က server ကို မစစ်ဘဲ cached data ကို သုံးနိုင်တဲ့ ကြာချိန်။

ဒီအချိန်အတွင်းမှာ client-side router က cached content ကို network request မလိုဘဲ ချက်ချင်း ပြသပါတယ်။ ဒီအချိန် ကုန်သွားရင်တော့ router က နောက် navigation (သို့) request မှာ server နဲ့ ပြန်စစ်ရပါတယ်။ ဒါက client cache ကနေ ချက်ချင်း page load ရစေပေမယ့် — data တွေ ခေတ်နောက်ကျနေနိုင်ပါတယ်။

- မသတ်မှတ်ရင် `default` profile ရဲ့ `stale` တန်ဖိုး (၅ မိနစ် — [`staleTimes`](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes) ကို ကြည့်ပါ) ကို သုံးပါတယ်
- Content က route ရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ရဲ့ အစိတ်အပိုင်း ဖြစ်နိုင်မလဲဆိုတာကိုလည်း ဆုံးဖြတ်ပါတယ် — [Prerendering behavior](#prerendering-behavior) ကို ကြည့်ပါ

```tsx
cacheLife({ stale: 300 }) // 5 minutes
```

#### `revalidate`

Server က cached content ကို background မှာ ဘယ်နှစ်ကြိမ် regenerate လုပ်မလဲ ဆိုတာ သတ်မှတ်ပါတယ်။

- ဒီအချိန် ကျော်လွန်ပြီးမှ request တစ်ခု ဝင်လာရင် server က:
  1. Cached version ကို ချက်ချင်း ပေးပါတယ် (ရှိရင်)
  2. Background မှာ content ကို regenerate လုပ်ပါတယ်
  3. Cache ကို fresh content နဲ့ update လုပ်ပါတယ်
- [Incremental Static Regeneration (ISR)](https://nextjs.org/docs/app/guides/incremental-static-regeneration) နဲ့ ဆင်တူပါတယ်
- မသတ်မှတ်ရင် `default` profile ရဲ့ `revalidate` တန်ဖိုး (၁၅ မိနစ်) ကို သုံးပါတယ်

```tsx
cacheLife({ revalidate: 900 }) // 15 minutes
```

#### `expire`

Server က cached content ကို regenerate လုပ်ရမယ့် အများဆုံး ကြာချိန်။

- Traffic မရှိဘဲ ဒီအချိန် ကျော်လွန်သွားရင် — နောက် request မှာ server က content ကို synchronously regenerate လုပ်ပါတယ်
- `revalidate` နဲ့ `expire` နှစ်ခုလုံး သတ်မှတ်ထားရင် — `expire` က `revalidate` ထက် ပိုရှည်ရပါမယ်။ Next.js က ဒါကို validate လုပ်ပြီး invalid ဖြစ်ရင် error တက်ပါတယ်
- မသတ်မှတ်ရင် `default` profile ရဲ့ `expire` တန်ဖိုး (ဘယ်တော့မှ expire မဖြစ်) ကို သုံးပါတယ်

```tsx
cacheLife({ expire: 3600 }) // 1 hour
```

### Preset cache profiles

Profile မသတ်မှတ်ရင် Next.js က `default` profile ကို သုံးပါတယ်။ Caching အပြုအမူ ရှင်းလင်းစေဖို့ profile တစ်ခုကို အတိအကျ သတ်မှတ်ဖို့ အကြံပြုပါတယ်။

| **Profile** | **အသုံးပြုမှု**                              | `stale`    | `revalidate` | `expire` |
| ----------- | -------------------------------------------- | ---------- | ------------ | -------- |
| `default`   | Standard content                             | 5 minutes  | 15 minutes   | never    |
| `seconds`   | Real-time data                               | 30 seconds | 1 second     | 1 minute |
| `minutes`   | Frequently updated content                   | 5 minutes  | 1 minute     | 1 hour   |
| `hours`     | Content updated multiple times per day       | 5 minutes  | 1 hour       | 1 day    |
| `days`      | Content updated daily                        | 5 minutes  | 1 day        | 1 week   |
| `weeks`     | Content updated weekly                       | 5 minutes  | 1 week       | 30 days  |
| `max`       | Stable content that rarely changes           | 5 minutes  | 30 days      | 1 year   |

### Default cache profiles တွေကို override လုပ်ခြင်း

Preset profiles တွေက အကျွမ်းဝင်တဲ့ time periods တွေ (`seconds`, `minutes`, `hours`, `days`, `weeks`) နဲ့ `default`, `max` တို့ကို ပုံဖော်ထားပါတယ်။ ဒါတွေကို မူလအတိုင်း သုံးနိုင်သလို — `next.config.ts` မှာ ဘယ်ဟာကိုမဆို (`default` နဲ့ `max` အပါအဝင်) ပြန်သတ်မှတ် (redefine) လုပ်နိုင်ပါတယ်။ Built-in names တွေက editor autocomplete မှာ ဆက်အလုပ်လုပ်ပါတယ်။

Built-in တစ်ခုကို ပြန်သတ်မှတ်တာက supported pattern တစ်ခုပါ — ဒါပေမယ့် `cacheLife('hours')` လိုမျိုး call တစ်ခုက သင့်သတ်မှတ်ထားတဲ့ တန်ဖိုးတွေကို ထင်ဟပ်စေဖို့ သင့် project ထဲမှာ မှတ်တမ်းတင်ထားပါ။ Time-named profiles တွေက ပင်ကိုယ် မျှော်လင့်ချက် ပါလာတာမို့ (`days` ဆို ၂၄ နာရီ ဝန်းကျင်) — `default` (သို့) `max` ကို ပြန်သတ်မှတ်တာထက် reader ကို ပိုအံ့အားသင့်စေနိုင်ပါတယ်။ Built-in name တစ်ခုကို overload လုပ်တာထက် — ကိုယ်ပိုင် [custom profile](#custom-cache-profiles) သတ်မှတ်တာကလည်း အညီအမျှ သင့်တော်တဲ့ နည်းလမ်းတစ်ခုပါ။

`default` ကို ပြန်သတ်မှတ်တာက `cacheLife` မခေါ်တဲ့ `use cache` scope တစ်ခုမှာ သက်ရောက်တဲ့ lifetime ကိုပါ ပြောင်းလဲစေပါတယ်။ အောက်က ဥပမာက `default` ကို တစ်နာရီ revalidate အနေနဲ့ သတ်မှတ်ထားပါတယ်:

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    // Redefine the 'default' profile
    default: {
      stale: 300, // 5 minutes
      revalidate: 3600, // 1 hour
      expire: 86400, // 1 day
    },
  },
}

export default nextConfig
```

> **သိထားသင့်သည်:** `cacheLife` function ရဲ့ type signature ကို `next dev`, `next build` (သို့) [`next typegen`](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options) လုပ်ချိန်မှာ `next.config.ts` ကနေ generate လုပ်ပါတယ် — ဒါကြောင့် override လုပ်ထားတဲ့ profile ရဲ့ editor autocomplete နဲ့ JSDoc hint တွေက presets မဟုတ်ဘဲ သင့်တန်ဖိုးတွေကို ထင်ဟပ်ပါတယ်။

### Custom cache profiles

`next.config.ts` မှာ ကိုယ်ပိုင် နာမည်တွေနဲ့ ပြန်သုံးလို့ရတဲ့ cache profiles တွေ သတ်မှတ်နိုင်ပါတယ်:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    biweekly: {
      stale: 60 * 60 * 24 * 14, // 14 days
      revalidate: 60 * 60 * 24, // 1 day
      expire: 60 * 60 * 24 * 14, // 14 days
    },
  },
}

export default nextConfig
```

အပေါ်က ဥပမာက ၁၄ ရက် cache လုပ်ပြီး — နေ့စဉ် update ရှိမရှိ စစ်ကာ — ၁၄ ရက်အကြာမှာ cache ကို expire လုပ်ပါတယ်။ ဒီ profile ကို application တစ်လျှောက်လုံးမှာ နာမည်နဲ့ ရည်ညွှန်းသုံးနိုင်ပါတယ်:

> **သိထားသင့်သည်:** Custom profile တစ်ခုမှာ ချန်လှပ်ထားတဲ့ properties တွေက `default` profile ကနေ အမွေဆက်ခံပါတယ်။ `cacheLife()` ကို တိုက်ရိုက် ပေးလိုက်တဲ့ inline profile objects တွေမှာလည်း ဒီလိုပါပဲ။

```tsx
// app/page.tsx
'use cache'
import { cacheLife } from 'next/cache'

export default async function Page() {
  cacheLife('biweekly')
  return <div>Page</div>
}
```

### Inline cache profiles

တစ်ကြိမ်တည်းအတွက် ဖြစ်တဲ့ကိစ္စတွေမှာ — profile object တစ်ခုကို `cacheLife` ကို တိုက်ရိုက် ပေးလိုက်ပါ:

```tsx
// app/page.tsx
'use cache'
import { cacheLife } from 'next/cache'

export default async function Page() {
  cacheLife({
    stale: 3600,
    revalidate: 900,
    expire: 86400,
  })

  return <div>Page</div>
}
```

Inline profiles တွေက သတ်မှတ်ထားတဲ့ function (သို့) component အတွက်ပဲ သက်ရောက်ပါတယ်။ ပြန်သုံးဖို့ ရည်ရွယ်တဲ့ configurations တွေအတွက်တော့ `next.config.ts` မှာ custom profiles သတ်မှတ်ပါ။

`cacheLife({})` — empty object သုံးရင်လည်း `default` profile ရဲ့ တန်ဖိုးတွေ သက်ရောက်ပါတယ်။

### Client cache အပြုအမူ

`stale` property က [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) header မဟုတ်ဘဲ [Client Cache](https://nextjs.org/docs/app/glossary#client-cache) ကို ထိန်းချုပ်ပါတယ်:

- Server က stale time ကို `x-nextjs-stale-time` response header ကနေ ပို့ပါတယ်
- Client router က ဒီတန်ဖိုးကို သုံးပြီး ဘယ်အချိန်မှာ revalidate လုပ်ရမလဲ ဆုံးဖြတ်ပါတယ်
- Prefetched links တွေ အသုံးပြုနိုင် ဆဲဖြစ်အောင် **အနည်းဆုံး စက္ကန့် ၃၀ သတ်မှတ်ပေးပါတယ်**

ဒီ ၃၀ စက္ကန့် အနည်းဆုံးက prefetched data တွေ user တွေ link တွေကို မနှိပ်ခင် expire မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။ ဒါက time-based expiration တွေမှာပဲ သက်ရောက်ပါတယ်။

Server Action တစ်ခုကနေ revalidation functions ([`revalidateTag`](/docs/nextjs/revalidate-tag), [`revalidatePath`](/docs/nextjs/revalidate-path), [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), (သို့) [`refresh`](https://nextjs.org/docs/app/api-reference/functions/refresh)) တွေကို ခေါ်လိုက်ရင် — client cache တစ်ခုလုံး ချက်ချင်း clear ဖြစ်ပြီး stale time ကို ကျော်လွှားသွားပါတယ်။

> **သိထားသင့်သည်:** `cacheLife` ထဲက `stale` property က [`staleTimes`](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes) နဲ့ မတူပါဘူး။ `staleTimes` က routes အားလုံးကို သက်ရောက်တဲ့ global setting တစ်ခုဖြစ်ပြီး — `cacheLife` ကတော့ per-function (သို့) per-route configuration ကို ခွင့်ပြုပါတယ်။ `staleTimes.static` ကို update လုပ်တာက `default` cache profile ရဲ့ `stale` တန်ဖိုးကိုပါ update လုပ်ပေးပါတယ်။

### Prerendering behavior

Cache lifetime တိုတိုလေးက cached content ကို ဘယ်ကနေ ပို့နိုင်လဲ ဆိုတာကို ပြောင်းလဲစေပါတယ်:

- **`revalidate` က `0` (သို့) `expire` က ၅ မိနစ်အောက်**: prerenders တွေကနေ ဖယ်ထုတ်ခံရပြီး — request time မှာ ဖြေရှင်းရတဲ့ "dynamic hole" ဖြစ်လာပါတယ်
- **`stale` က စက္ကန့် ၃၀ အောက်**: prerenders တွေကနေ ဖယ်ထုတ်ခံရပါတယ် — prefetch တစ်ခုက user မနှိပ်ခင် expire ဖြစ်သွားလို့ပါ
- **`stale` က စက္ကန့် ၃၀ နဲ့အထက် ဒါပေမယ့် ၅ မိနစ်အောက်**: prerenders တွေထဲမှာ ပါဝင်ပေမယ့် — route ရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကနေတော့ ဖယ်ထုတ်ခံရပါတယ်

Presets တွေထဲက `seconds` တစ်ခုပဲ ဒီအဆင့်တွေထဲ ကျရောက်ပါတယ် — ၁ မိနစ် `expire` ရှိတာမို့ prerenders တွေကနေ ဖယ်ထုတ်ခံရပါတယ်။

ဒီအပြုအမူက page တစ်ခုတည်းမှာ static နဲ့ dynamic content တွေ ရောနှောနိုင်အောင် ခွင့်ပြုပါတယ်။ Static အပိုင်းတွေက prerender လုပ်ခံရပြီး — short-lived caches တွေကတော့ data တွေကို build time မဟုတ်ဘဲ request time မှာ ယူတဲ့ boundaries တွေ ဖန်တီးပေးပါတယ်။ Dynamic caches တွေ ဝန်းရံဖို့ `<Suspense>` boundary တစ်ခု သုံးပြီး content load လုပ်နေချိန် fallback ပေးပါ။

### Nested caching behavior

`use cache` directives တွေ nested ဖြစ်နေတဲ့အခါ (cached function/component တစ်ခုက နောက် cached function/component တစ်ခုကို သုံးနေရင်) — outer cache ရဲ့ အပြုအမူက သူ့မှာ explicit `cacheLife` ရှိမရှိအပေါ် မူတည်ပါတယ်။

#### Explicit outer cacheLife ရှိရင်

Outer cache က inner cache lifetimes တွေ ဘယ်လိုပဲ ရှိရှိ — ကိုယ်ပိုင် lifetime ကိုပဲ သုံးပါတယ်။ Outer cache hit ဖြစ်ရင် nested data အားလုံး အပါအဝင် output အပြည့်အစုံ ပြန်ပေးပါတယ်။ Explicit `cacheLife` က inner lifetimes တွေထက် ပိုရှည်သည်ဖြစ်စေ ပိုတိုသည်ဖြစ်စေ — အမြဲ ဦးစားပေး သက်ရောက်ပါတယ်။

```tsx
// app/dashboard/page.tsx
import { cacheLife } from 'next/cache'
import { Widget } from './widget'

export default async function Dashboard() {
  'use cache'
  cacheLife('hours') // Outer scope sets its own lifetime

  return (
    <div>
      <h1>Dashboard</h1>
      <Widget /> {/* Inner scope has 'minutes' lifetime */}
    </div>
  )
}
```

#### Explicit outer cacheLife မရှိရင်

Outer cache မှာ `cacheLife` မခေါ်ရင် `default` profile (၁၅ မိနစ် revalidate) ကို သုံးပါတယ်။ Lifetime ပိုတိုတဲ့ inner caches တွေက outer cache ရဲ့ `default` lifetime ကို လျှော့ချနိုင်ပြီး — lifetime ပိုရှည်တဲ့ inner caches တွေကတော့ default ထက် ကျော်လွန်အောင် မတိုးပေးနိုင်ပါဘူး။ (ဥပမာ — Widget က ၅ မိနစ်ဆို Dashboard က ၅ မိနစ် ဖြစ်သွားပြီး — Widget က ၁ နာရီဆို Dashboard က ၁၅ မိနစ်မှာပဲ ရှိနေပါတယ်။)

**Explicit `cacheLife` သတ်မှတ်ဖို့ အကြံပြုပါတယ်။** Explicit lifetime values တွေနဲ့ဆို cached function/component တစ်ခုကို ကြည့်ပြီး — nested caches တွေကို ခြေရာခံစရာ မလိုဘဲ သူ့ရဲ့ အပြုအမူကို ချက်ချင်း သိနိုင်ပါတယ်။

#### Nested short-lived caches

[Prerendering အပြုအမူ](#prerendering-behavior) မှာ ဖော်ပြထားသလို — short-lived caches တွေ (`revalidate` 0 ဖြစ်တာ (သို့) `expire` ၅ မိနစ်အောက်) က prerenders တွေကနေ ဖယ်ထုတ်ခံရတဲ့ dynamic holes တွေ ဖြစ်ပါတယ်။

Short-lived cache တစ်ခုက explicit `cacheLife` မရှိတဲ့ နောက် `use cache` တစ်ခုထဲမှာ nested ဖြစ်နေရင် — propagation ကတစ်ဆင့် outer cache ရဲ့ lifetime ပါ short ဖြစ်သွားနိုင်ပါတယ်။ ဒီလို မရည်ရွယ်ဘဲ ဖြစ်တဲ့ misconfiguration ကို ကာကွယ်ဖို့ Next.js က prerendering လုပ်ချိန်မှာ error တက်စေပါတယ်။ Nested cache က သိသာချင်မှ သိသာပါမယ် — imported module တစ်ခု (သို့) third-party dependency တစ်ခုထဲမှာတောင် ရှိနိုင်ပါတယ်:

```tsx
// components/short-lived-widget.tsx
import { cacheLife } from 'next/cache'

export async function ShortLivedWidget() {
  'use cache'
  cacheLife('seconds')
  const data = await fetchRealtimeData()
  return <div>{data}</div>
}
```

ဒီ component ကို explicit `cacheLife` မရှိတဲ့ နောက် `use cache` တစ်ခုကနေ သုံးရင် prerendering လုပ်ချိန်မှာ error ဖြစ်ပါတယ်။ ဖြေရှင်းနည်း နှစ်မျိုး ရှိပါတယ်:

- **Outer cache ကို static (prerendered) အတိုင်း ထားချင်ရင်** — lifetime ပိုရှည်တဲ့ explicit `cacheLife('default')` ကို outer `use cache` မှာ ထည့်ပါ (error ကို ကာကွယ်ပေးပါတယ်)
- **Outer cache ကိုပါ short-lived ဖြစ်စေချင်ရင်** — ဒါက ရည်ရွယ်ချက်ရှိရှိပါဆိုတာ အတည်ပြုဖို့ short lifetime တစ်ခုကို အတိအကျ သတ်မှတ်ပြီး — content load နေချိန် fallback ရဖို့ component ကို `<Suspense>` boundary ထဲမှာ ထည့်ပါ

> **မှတ်ချက်:** Serverless deployments တွေမှာ default in-memory cache က requests ကြားမှာ မတည်မြဲတာမို့ runtime caching အတွက် `"use cache: remote"` ကို သုံးပါတယ်။ Self-hosted environments တွေမှာတော့ `"use cache"` နဲ့ လုံလောက်နိုင်ပါတယ် — [Runtime caching considerations](https://nextjs.org/docs/app/api-reference/directives/use-cache#runtime-caching-considerations) မှာ အသေးစိတ် ကြည့်ပါ။

### Conditional cache lifetimes

Application logic အပေါ် မူတည်ပြီး cache ကြာချိန် ကွဲပြားအောင် — code paths အမျိုးမျိုးမှာ `cacheLife` ကို conditionally ခေါ်နိုင်ပါတယ်:

```tsx
// lib/posts.ts
import { cacheLife, cacheTag } from 'next/cache'

async function getPostContent(slug: string) {
  'use cache'

  const post = await fetchPost(slug)

  // Tag the cache entry for targeted revalidation
  cacheTag(`post-${slug}`)

  if (!post) {
    // Content may not be published yet or could be in draft
    // Cache briefly to reduce database load
    cacheLife('minutes')
    return null
  }

  // Published content can be cached longer
  cacheLife('days')

  // Return only the necessary data to keep cache size minimal
  return post.data
}
```

ဒီ pattern က ရလဒ်မတူတဲ့အခါ cache ကြာချိန် ကွဲပြားဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်ပါတယ် — ဥပမာ item တစ်ခု မရှိတော့ပေမယ့် နောက်မှာ ရှိလာနိုင်တဲ့ အခြေအနေမျိုးမှာပေါ့။

Runtime မှာ cache lifetime ကို တွက်ချင်ရင် — ဥပမာ fetched data ထဲကနေ ဖတ်ယူချင်ရင် — [inline cache profile](#inline-cache-profiles) object တစ်ခုကို သုံးပါ (ဥပမာ `cacheLife({ revalidate: post.revalidateSeconds ?? 3600 })` — ဒီမှာ `stale` နဲ့ `expire` တို့က `default` profile ကနေ အမွေဆက်ခံပါတယ်)။
