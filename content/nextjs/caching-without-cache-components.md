---
title: "Caching နဲ့ Revalidating (Previous Model)"
description: "Cache Components မသုံးတဲ့ project တွေအတွက် — fetch options, unstable_cache နဲ့ route segment configs တွေကို သုံးပြီး data တွေကို cache လုပ်ပြီး revalidate (ပြန်လည်စစ်ဆေး) လုပ်နည်း — time-based နဲ့ on-demand revalidation, request deduplication နဲ့ data preloading အကြောင်း"
order: 182
source: "https://nextjs.org/docs/app/guides/caching-without-cache-components"
status: translated
updated: 2026-09-03
---

> ဒီ guide က version 16 မှာ [`cacheComponents` flag](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) အောက်မှာ မိတ်ဆက်ခဲ့တဲ့ [Cache Components](/docs/nextjs/caching) **ကို မသုံးတဲ့** project တွေအတွက် ရည်ရွယ်ထားပါတယ်။

## `fetch` Requests တွေကို Caching လုပ်ခြင်း

Default အားဖြင့် [`fetch`](/docs/nextjs/fetch) requests တွေကို cache မလုပ်ပါဘူး။ Request တစ်ခုချင်းစီကို `cache` option ကို `'force-cache'` အဖြစ် သတ်မှတ်ပြီး cache လုပ်နိုင်ပါတယ်။

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

```jsx filename="app/page.jsx" switcher
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

အသေးစိတ် သိချင်ရင် [`fetch` API reference](/docs/nextjs/fetch) ကို ကြည့်ပါ။

### `fetch` မဟုတ်တဲ့ functions တွေအတွက် `unstable_cache`

`unstable_cache` က `fetch` မသုံးတဲ့ database queries တွေနဲ့ တခြား async functions တွေရဲ့ ရလဒ်ကို cache လုပ်နိုင်စေပါတယ်။ Function ကို `unstable_cache` နဲ့ wrap လုပ်လိုက်ရုံပါပဲ:

```ts filename="app/lib/data.ts" switcher
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id: string) => {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])
  },
  ['user'], // cache key ရဲ့ ရှေ့ဆက် (prefix)
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

```js filename="app/lib/data.js" switcher
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id) => {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])
  },
  ['user'], // cache key ရဲ့ ရှေ့ဆက် (prefix)
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

တတိယ argument မှာ အောက်ပါတို့ ပါဝင်ပါတယ်:

- `tags`: `revalidateTag` နဲ့ on-demand revalidation လုပ်ဖို့ tag တွေရဲ့ array
- `revalidate`: cache ကို revalidate လုပ်ဖို့ စက္ကန့်အရေအတွက်

အသေးစိတ် သိချင်ရင် [`unstable_cache` API reference](/docs/nextjs/unstable-cache) ကို ကြည့်ပါ။

### Route segment config

Caching အပြုအမူကို route level မှာ configure လုပ်နိုင်ပါတယ် — [Page](/docs/nextjs/file-conventions-page), [Layout](/docs/nextjs/file-conventions-layout) (သို့) [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုကနေ config options တွေကို export လုပ်ခြင်းအားဖြင့်ပါ။

#### `dynamic`

Layout (သို့) page တစ်ခုရဲ့ dynamic အပြုအမူကို လုံးဝ static (သို့) လုံးဝ dynamic အဖြစ် ပြောင်းလဲပါတယ်။

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

```jsx filename="layout.js | page.js | route.js" switcher
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

- **`'auto'`** (default): Component တွေက dynamic အပြုအမူထဲ ဝင်ခွင့်မပြုဘဲ တတ်နိုင်သမျှ cache လုပ်နိုင်အောင် ထားတဲ့ default option ပါ။
- **`'force-dynamic'`**: [Dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) ကို အတင်းအကျပ် ဖြစ်စေပါတယ် — ရလဒ်အနေနဲ့ route တွေကို request time မှာ user တစ်ဦးချင်းစီအတွက် render လုပ်ပေးပါလိမ့်မယ်။ ဒီ option က အောက်ပါတို့နဲ့ ညီမျှပါတယ်:
  - Layout (သို့) page ထဲက `fetch()` request တိုင်းရဲ့ option ကို `{ cache: 'no-store', next: { revalidate: 0 } }` အဖြစ် သတ်မှတ်ထားခြင်း
  - Segment config ကို `export const fetchCache = 'force-no-store'` အဖြစ် သတ်မှတ်ထားခြင်း
- **`'error'`**: Layout (သို့) page တစ်ခုကို အတင်းအကျပ် prerender လုပ်ပြီး — component တစ်ခုခုက Request-time APIs (သို့) uncached data တွေကို သုံးရင် error တစ်ခု ဖြစ်စေခြင်းအားဖြင့် data ကို cache လုပ်ပါတယ်။ ဒီ option က အောက်ပါတို့နဲ့ ညီမျှပါတယ်:
  - `pages` directory ထဲက `getStaticProps()`
  - Layout (သို့) page ထဲက `fetch()` request တိုင်းရဲ့ option ကို `{ cache: 'force-cache' }` အဖြစ် သတ်မှတ်ထားခြင်း
  - Segment config ကို `fetchCache = 'only-cache'` အဖြစ် သတ်မှတ်ထားခြင်း
- **`'force-static'`**: Layout (သို့) page တစ်ခုကို အတင်းအကျပ် prerender လုပ်ပြီး — [`cookies`](/docs/nextjs/cookies), [`headers()`](/docs/nextjs/headers) နဲ့ [`useSearchParams()`](/docs/nextjs/use-search-params) တွေကို empty values တွေ ပြန်ပေးအောင် အတင်းအကျပ် လုပ်ခြင်းအားဖြင့် data ကို cache လုပ်ပါတယ်။ `force-static` နဲ့ render လုပ်ထားတဲ့ pages (သို့) layouts တွေမှာ `revalidate`, [`revalidatePath`](/docs/nextjs/revalidate-path) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) တွေကို သုံးလို့ရပါတယ်။

#### `fetchCache`

<details>
  <summary>ဒါက advanced option တစ်ခုဖြစ်ပြီး — default အပြုအမူကို override လုပ်ဖို့ တိကျစွာ လိုအပ်မှသာ သုံးသင့်ပါတယ်။</summary>

`cache` option မသတ်မှတ်ထားတဲ့ `fetch` request တစ်ခုကို Request-time APIs တွေ မသုံးခင် **ရောက်ရှိနိုင်ရင်** — route က အဲဒီအထိ prerender လုပ်ခံရလို့ `next build` ကာလအတွင်းမှာ တစ်ကြိမ်တည်း fetch လုပ်ပါတယ်။ Request-time API တစ်ခု run ပြီးမှ **တွေ့ရှိရတဲ့** requests တွေကတော့ request တိုင်းမှာ run လုပ်ပါတယ်။

`fetchCache` က layout (သို့) page တစ်ခုထဲက `fetch` requests အားလုံးရဲ့ default `cache` option ကို override လုပ်နိုင်စေပါတယ်။

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

```jsx filename="layout.js | page.js | route.js" switcher
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

- **`'auto'`** (default): Request-time APIs တွေ မသုံးခင်က `fetch` requests တွေကို သူတို့ ပေးထားတဲ့ `cache` option နဲ့ cache လုပ်ပြီး — Request-time APIs တွေ ပြီးနောက်က `fetch` requests တွေကိုတော့ cache မလုပ်တဲ့ default option ပါ။
- **`'default-cache'`**: ဘယ် `cache` option ကိုမဆို `fetch` ဆီ ပေးလို့ရပေမယ့် — option မပေးရင် `cache` option ကို `'force-cache'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ ဆိုလိုတာက Request-time APIs တွေ နောက်မှာ လာတဲ့ `fetch` requests တွေတောင် static အဖြစ် သတ်မှတ်ခံရပါတယ်။
- **`'only-cache'`**: `fetch` requests အားလုံး caching ထဲ ဝင်အောင် သေချာလုပ်ပါတယ် — option မပေးရင် default ကို `cache: 'force-cache'` အဖြစ် ပြောင်းပြီး `cache: 'no-store'` သုံးတဲ့ `fetch` request တစ်ခုခု ရှိရင် error ဖြစ်စေပါတယ်။
- **`'force-cache'`**: `fetch` requests အားလုံးရဲ့ `cache` option ကို `'force-cache'` အဖြစ် သတ်မှတ်ခြင်းအားဖြင့် caching ထဲ ဝင်အောင် သေချာလုပ်ပါတယ်။
- **`'default-no-store'`**: ဘယ် `cache` option ကိုမဆို `fetch` ဆီ ပေးလို့ရပေမယ့် — option မပေးရင် `cache` option ကို `'no-store'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ ဆိုလိုတာက Request-time APIs တွေ မသုံးခင် `fetch` requests တွေတောင် dynamic အဖြစ် သတ်မှတ်ခံရပါတယ်။
- **`'only-no-store'`**: `fetch` requests အားလုံး caching ကနေ ဖယ်ထွက်အောင် သေချာလုပ်ပါတယ် — option မပေးရင် default ကို `cache: 'no-store'` အဖြစ် ပြောင်းပြီး `cache: 'force-cache'` သုံးတဲ့ `fetch` request တစ်ခုခု ရှိရင် error ဖြစ်စေပါတယ်။
- **`'force-no-store'`**: `fetch` requests အားလုံးရဲ့ `cache` option ကို `'no-store'` အဖြစ် သတ်မှတ်ခြင်းအားဖြင့် caching ကနေ ဖယ်ထွက်အောင် သေချာလုပ်ပါတယ်။ ဒါက `fetch` request တစ်ခုက `'force-cache'` option ပေးထားရင်တောင် — request တိုင်းမှာ ပြန်ပြန် fetch လုပ်စေပါတယ်။

##### Route တစ်ခုထဲက segment အချင်းချင်း အပြုအမူ (Cross-route segment behavior)

- Route တစ်ခုတည်းရဲ့ layout နဲ့ page တစ်ခုချင်းစီပေါ်မှာ သတ်မှတ်ထားတဲ့ options တွေ အားလုံး တစ်ခုနဲ့တစ်ခု လိုက်ဖက်ညီဖို့ လိုအပ်ပါတယ်။
  - `'only-cache'` နဲ့ `'force-cache'` နှစ်ခုလုံး ပေးထားရင် `'force-cache'` က အနိုင်ရပါတယ်။ `'only-no-store'` နဲ့ `'force-no-store'` နှစ်ခုလုံး ပေးထားရင်လည်း `'force-no-store'` က အနိုင်ရပါတယ်။ Force option က route တစ်ခုလုံးရဲ့ အပြုအမူကို ပြောင်းလဲပေးလို့ — segment တစ်ခုတည်းမှာ `'force-*'` ရှိနေရင် `'only-*'` တွေကြောင့် ဖြစ်လာနိုင်တဲ့ errors တွေ မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။
  - `'only-*'` နဲ့ `'force-*'` options တွေရဲ့ ရည်ရွယ်ချက်က route တစ်ခုလုံးကို လုံးဝ static (သို့) လုံးဝ dynamic ဖြစ်အောင် အာမခံဖို့ပါ။ ဆိုလိုတာက:
    - Route တစ်ခုတည်းထဲမှာ `'only-cache'` နဲ့ `'only-no-store'` ပေါင်းသုံးတာ ခွင့်မပြုပါဘူး
    - Route တစ်ခုတည်းထဲမှာ `'force-cache'` နဲ့ `'force-no-store'` ပေါင်းသုံးတာ ခွင့်မပြုပါဘူး
  - Child တစ်ခုက `'auto'` (သို့) `'*-cache'` ပေးထားရင် parent က `'default-no-store'` မပေးနိုင်ပါဘူး — အဲဒါဆိုရင် တူညီတဲ့ fetch အတွက် အပြုအမူ မတူညီတာတွေ ဖြစ်သွားနိုင်လို့ပါ။
- Shared parent layouts တွေကို `'auto'` အတိုင်း ထားပြီး — child segments တွေ ကွဲပြားတဲ့နေရာမှာပဲ options တွေကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ ယေဘုယျအားဖြင့် အကြံပြုပါတယ်။

</details>

## Time-based revalidation (အချိန်အခြေပြု revalidation)

`fetch` ပေါ်မှာ `next.revalidate` option ကို သုံးပြီး သတ်မှတ်ထားတဲ့ စက္ကန့် အရေအတွက်တစ်ခု ပြည့်တာနဲ့ data တွေကို revalidate လုပ်နိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

```jsx filename="app/page.jsx" switcher
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

`fetch` မဟုတ်တဲ့ functions တွေအတွက်တော့ `unstable_cache` က သူ့ရဲ့ configuration ထဲမှာ `revalidate` option ကို လက်ခံပါတယ် (အပေါ်က ဥပမာမှာ ပြထားပါတယ်)။

### Route segment config `revalidate`

Layout (သို့) page တစ်ခုအတွက် default revalidation အချိန်ကို သတ်မှတ်ပါတယ်။ ဒီ option က `fetch` request တစ်ခုချင်းစီမှာ သတ်မှတ်ထားတဲ့ `revalidate` value ကို override မလုပ်ပါဘူး။

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const revalidate = false
// false | 0 | number
```

```jsx filename="layout.js | page.js | route.js" switcher
export const revalidate = false
// false | 0 | number
```

- **`false`** (default): `cache` option ကို `'force-cache'` လို့ သတ်မှတ်ထားတဲ့ (သို့) Request-time API တစ်ခုကို မသုံးခင် ရှာဖွေတွေ့ရှိခဲ့တဲ့ `fetch` requests တွေကို cache လုပ်တဲ့ default heuristic ပါ။ Semantically `revalidate: Infinity` နဲ့ ညီမျှပြီး — resource ကို အကန့်အသတ်မရှိ cache လုပ်သင့်တယ်လို့ ဆိုလိုပါတယ်။ `fetch` request တစ်ခုချင်းစီကတော့ `cache: 'no-store'` (သို့) `revalidate: 0` သုံးပြီး cache လုပ်ခံရတာကို ရှောင်ကာ route ကို dynamically render လုပ်နိုင်ပါသေးတယ်။ ဒါမှမဟုတ် route ရဲ့ default ထက် နည်းတဲ့ positive `revalidate` number တစ်ခုကို သတ်မှတ်ပြီး route တစ်ခုရဲ့ revalidation ကြိမ်နှုန်းကို မြှင့်တင်နိုင်ပါတယ်။
- **`0`**: Request-time APIs (သို့) uncached data fetches တွေ ရှာမတွေ့ဘူးဆိုရင်တောင် layout (သို့) page တစ်ခုကို အမြဲ dynamically render လုပ်ဖို့ သေချာစေပါတယ်။ ဒီ option က `cache` option မသတ်မှတ်ထားတဲ့ `fetch` requests တွေရဲ့ default ကို `'no-store'` အဖြစ် ပြောင်းပေမယ့် — `'force-cache'` ကို ရွေးထားတဲ့ (သို့) positive `revalidate` သုံးထားတဲ့ `fetch` requests တွေကိုတော့ မပြောင်းဘဲ ထားပါတယ်။
- **`number`**: (စက္ကန့်နဲ့) Layout (သို့) page တစ်ခုရဲ့ default revalidation ကြိမ်နှုန်းကို `n` စက္ကန့်အဖြစ် သတ်မှတ်ပါတယ်။

> **သိထားသင့်သည်**:
>
> - `revalidate` value က statically analyzable (static ပိုင်းခြား စိတ်ဖြာလို့ရတဲ့) ဖြစ်ရပါမယ်။ ဥပမာ — `revalidate = 600` က valid ဖြစ်ပေမယ့် `revalidate = 60 * 10` ကတော့ မရပါဘူး။
> - `revalidate` value က deprecated ဖြစ်နေတဲ့ `runtime = 'edge'` ကို သုံးထားချိန်မှာ မရနိုင်ပါဘူး။
> - Development မှာတော့ Pages တွေက _အမြဲတမ်း_ on-demand render လုပ်ပြီး ဘယ်တော့မှ cache မလုပ်ပါဘူး။ ဒါကြောင့် revalidation ကာလတစ်ခု ကုန်ဆုံးဖို့ မစောင့်ဘဲ ပြောင်းလဲမှုတွေကို ချက်ချင်း မြင်နိုင်ပါတယ်။

#### Revalidation ကြိမ်နှုန်း

- Route တစ်ခုတည်းရဲ့ layout နဲ့ page တစ်ခုချင်းစီပေါ်မှာ ရှိတဲ့ အနိမ့်ဆုံး `revalidate` က _route တစ်ခုလုံးရဲ့_ revalidation ကြိမ်နှုန်းကို သတ်မှတ်ပါလိမ့်မယ်။ ဒါက child pages တွေကို သူတို့ရဲ့ parent layouts တွေလောက် မကြာခဏ revalidate လုပ်ခံရစေဖို့ သေချာစေပါတယ်။
- `fetch` request တစ်ခုချင်းစီကလည်း route ရဲ့ default `revalidate` ထက် နည်းတဲ့ `revalidate` တစ်ခုကို သတ်မှတ်ပြီး — route တစ်ခုလုံးရဲ့ revalidation ကြိမ်နှုန်းကို မြှင့်တင်နိုင်ပါတယ်။ ဒါကြောင့် စံသတ်မှတ်ချက်တစ်ခုခုအပေါ် မူတည်ပြီး route အချို့အတွက် ပိုမကြာခဏ revalidation လုပ်ဖို့ dynamically ရွေးချယ်နိုင်ပါတယ်။

## On-demand revalidation (လိုအပ်ချိန်မှ revalidation)

Event တစ်ခု ပြီးဆုံးတာနဲ့ cached data တွေကို revalidate လုပ်ဖို့ — [Server Action](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုထဲမှာ [`revalidateTag`](/docs/nextjs/revalidate-tag) (သို့) [`revalidatePath`](/docs/nextjs/revalidate-path) ကို သုံးပါ။

### Cached data တွေကို tag လုပ်ခြင်း

On-demand cache invalidation အတွက် `fetch` requests တွေကို `next.tags` နဲ့ tag လုပ်ပါ:

```tsx filename="app/lib/data.ts" switcher
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

```jsx filename="app/lib/data.js" switcher
export async function getUserById(id) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

`fetch` မဟုတ်တဲ့ functions တွေအတွက်လည်း `unstable_cache` က `tags` option ကို လက်ခံပါတယ် (အပေါ်က ဥပမာမှာ ပြထားပါတယ်)။

### `revalidateTag`

[`revalidateTag`](/docs/nextjs/revalidate-tag) ကို သုံးပြီး tag အလိုက် cached data တွေကို invalidate လုပ်ပါ:

```tsx filename="app/lib/actions.ts" switcher
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Data တွေကို mutate လုပ်ပါ
  revalidateTag('user', 'max')
}
```

```jsx filename="app/lib/actions.js" switcher
import { revalidateTag } from 'next/cache'

export async function updateUser(id) {
  // Data တွေကို mutate လုပ်ပါ
  revalidateTag('user', 'max')
}
```

### `revalidatePath`

Route path တစ်ခုအတွက် cached data အားလုံးကို [`revalidatePath`](/docs/nextjs/revalidate-path) နဲ့ invalidate လုပ်ပါ:

```tsx filename="app/lib/actions.ts" switcher
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Data တွေကို mutate လုပ်ပါ
  revalidatePath('/profile')
}
```

```jsx filename="app/lib/actions.js" switcher
import { revalidatePath } from 'next/cache'

export async function updateUser(id) {
  // Data တွေကို mutate လုပ်ပါ
  revalidatePath('/profile')
}
```

## Request တွေကို deduplicate (ထပ်တူမကျအောင်) လုပ်ခြင်း

`fetch` ([အလိုအလျောက် memoization လုပ်ပေးတဲ့](/docs/nextjs/fetch)) ကို မသုံးဘဲ ORM (သို့) database ကို တိုက်ရိုက် သုံးနေတယ်ဆိုရင် — သင့် data access ကို [React `cache`](https://react.dev/reference/react/cache) function နဲ့ wrap လုပ်ပြီး render pass တစ်ခုတည်းအတွင်းမှာ requests တွေကို deduplicate လုပ်နိုင်ပါတယ်:

```tsx filename="app/lib/data.ts" switcher
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

```jsx filename="app/lib/data.js" switcher
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

## Data တွေကို preload လုပ်ခြင်း

Blocking requests တွေရဲ့ အထက်မှာ eagerly ခေါ်လိုက်တဲ့ utility function တစ်ခုကို ဖန်တီးပြီး data တွေကို preload လုပ်နိုင်ပါတယ်။ ဒါက data fetching ကို စောစော စတင်နိုင်စေပြီး — component render လုပ်ချိန်မှာ data က အသင့်ရှိနေပါပြီ။

[`server-only` package](https://www.npmjs.com/package/server-only) ကို React ရဲ့ [`cache`](https://react.dev/reference/react/cache) နဲ့ ပေါင်းပြီး ပြန်သုံးလို့ရတဲ့ preload utility တစ်ခု ဖန်တီးပါ:

```ts filename="utils/get-item.ts" switcher
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id: string) => {
  // ...
})

export const preload = (id: string) => {
  void getItem(id)
}
```

```js filename="utils/get-item.js" switcher
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id) => {
  // ...
})

export const preload = (id) => {
  void getItem(id)
}
```

ပြီးရင် blocking အလုပ်တွေ မလုပ်ခင် `preload()` ကို ခေါ်လိုက်ရင် data က ချက်ချင်း စတင် load လာပါတယ်:

```tsx filename="app/item/[id]/page.tsx" switcher
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Item data ကို စ load လုပ်ပါ
  preload(id)
  // နောက်ထပ် asynchronous အလုပ်တစ်ခု လုပ်ပါ
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}

async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
```

```jsx filename="app/item/[id]/page.js" switcher
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  // Item data ကို စ load လုပ်ပါ
  preload(id)
  // နောက်ထပ် asynchronous အလုပ်တစ်ခု လုပ်ပါ
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}

async function Item({ id }) {
  const result = await getItem(id)
  // ...
}
```

## Dynamic routes တွေကို statically generate လုပ်ခြင်း

[`generateStaticParams`](/docs/nextjs/generate-static-params) နဲ့ dynamic routes တွေကို prerender လုပ်ပြီး အချိန်နဲ့အမျှ revalidate လုပ်ချင်ရင် — [Incremental Static Regeneration](/docs/nextjs/incremental-static-regeneration) guide ကို ကြည့်ပါ။
