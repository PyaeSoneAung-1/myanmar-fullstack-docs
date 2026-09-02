---
title: "use cache"
description: "'use cache' directive — route, React component (သို့) function တစ်ခုကို cacheable အဖြစ် သတ်မှတ်ပေးတဲ့ directive; cache keys, serialization, constraints, runtime caching, revalidation နဲ့ troubleshooting အကြောင်း"
order: 58
source: "https://nextjs.org/docs/app/api-reference/directives/use-cache"
status: translated
updated: 2026-09-02
---

`use cache` directive က route, React component (သို့) function တစ်ခုကို cacheable (cache လုပ်လို့ရတဲ့အရာ) အဖြစ် သတ်မှတ်နိုင်စေပါတယ်။ File ရဲ့ ထိပ်မှာ သုံးရင် file ထဲက exports အားလုံးကို cache လုပ်မယ်လို့ ဖော်ပြနိုင်သလို — function (သို့) component တစ်ခုရဲ့ ထိပ်မှာ inline သုံးရင်တော့ return value ကို cache လုပ်ပါတယ်။ `use cache` သုံးထားတဲ့ functions နဲ့ components တွေက async ဖြစ်ရပါမယ်။

> **သိထားသင့်သည်:**
>
> - Cookies (သို့) headers တွေကို သုံးချင်ရင် — cached scopes တွေရဲ့ အပြင်ဘက်မှာ ဖတ်ပြီး တန်ဖိုးတွေကို arguments အဖြစ် ပို့ပါ။ ဒါက ဦးစားပေး လုပ်သင့်တဲ့ pattern ဖြစ်ပါတယ်။
> - Runtime data အတွက် in-memory cache က မလုံလောက်ဘူးဆိုရင် — [`'use cache: remote'`](/docs/nextjs/use-cache-remote) က platforms တွေကို သီးသန့် cache handler တစ်ခု ပေးနိုင်စေပေမယ့် — cache ကို စစ်ဆေးဖို့ network roundtrip တစ်ခု လိုပြီး platform fees တွေ ပုံမှန် ကျခံရပါတယ်။
> - Compliance လိုအပ်ချက်တွေ ရှိတဲ့အခါ (သို့) runtime data တွေကို `use cache` scope တစ်ခုဆီ arguments အဖြစ် ပို့ဖို့ refactor မလုပ်နိုင်တဲ့အခါ — [`'use cache: private'`](/docs/nextjs/use-cache-private) ကို ကြည့်ပါ။

## အသုံးပြုပုံ (Usage)

`use cache` က Cache Components feature တစ်ခု ဖြစ်ပါတယ်။ Enable လုပ်ဖို့ — သင့် `next.config.ts` file ထဲမှာ [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) option ကို ထည့်ပါ:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

ပြီးရင် function, component (သို့) file level မှာ `use cache` ကို ထည့်ပါ။ Cached functions နဲ့ components တွေက async ဖြစ်ရပါမယ်:

```tsx
// Function level
export async function getData() {
  'use cache'
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}

// Component level
export async function MyComponent() {
  'use cache'
  return <></>
}
```

File level မှာ သုံးတဲ့အခါ — export လုပ်ထားတဲ့ function တိုင်းက cached function တစ်ခု ဖြစ်ပြီး async လည်း ဖြစ်ရပါမယ်:

```tsx
// File level
'use cache'

export default async function Page() {
  // ...
}
```

## `use cache` အလုပ်လုပ်ပုံ

### Cache keys

Cache entry တစ်ခုရဲ့ key ကို သူ့ရဲ့ inputs တွေရဲ့ serialized version တစ်ခုကနေ generate လုပ်ပါတယ်။ အဲဒီထဲမှာ ပါဝင်တာတွေက:

1. **Build ID** — Build တစ်ခုချင်းစီမှာ မတူပါဘူး။ ဒါ ပြောင်းလဲရင် cache entries အားလုံး invalidate ဖြစ်ပါတယ်။ [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) သတ်မှတ်ထားရင် — cache key အတွက် build ID ကို အဲဒါက override လုပ်ပါတယ်။
2. **Function ID** — Codebase ထဲက function ရဲ့ တည်နေရာနဲ့ signature ရဲ့ secure hash တစ်ခု
3. **Serializable arguments** — Props (components အတွက်) (သို့) function arguments တွေ
4. **HMR refresh hash** (development မှာပဲ) — Hot module replacement ပေါ်မှာ cache ကို invalidate လုပ်ပါတယ်

Cached function တစ်ခုက outer scopes တွေထဲက variables တွေကို ရည်ညွှန်းတဲ့အခါ — အဲဒီ variables တွေကို အလိုအလျောက် ဖမ်းယူပြီး arguments အဖြစ် bind လုပ်လိုက်လို့ — cache key ရဲ့ အစိတ်အပိုင်း ဖြစ်လာပါတယ်။

```tsx filename="lib/data.ts"
async function Component({ userId }: { userId: string }) {
  const getData = async (filter: string) => {
    'use cache'
    // Cache key includes both userId (from closure) and filter (argument)
    const res = await fetch(
      `https://api.example.com/users/${userId}/data?filter=${filter}`
    )
    return res.json()
  }

  return getData('active')
}
```

အပေါ်က snippet ထဲမှာ `userId` ကို outer scope ကနေ ဖမ်းယူထားပြီး `filter` ကို argument အဖြစ် ပို့ထားလို့ — နှစ်ခုလုံး `getData` function ရဲ့ cache key ထဲ ပါဝင်ပါတယ်။ ဒါကြောင့် user နဲ့ filter ပေါင်းစပ်မှု မတူတိုင်း cache entries သီးခြားစီ ရှိပါတယ်။

> **သိထားသင့်သည်:** Cached function တစ်ခုက [root parameters](https://nextjs.org/docs/app/api-reference/functions/next-root-params) တွေကို ဖတ်ရင် — သူ တကယ်ဖတ်တဲ့ parameters တွေပဲ သူ့ရဲ့ cache key ထဲ ပါဝင်ပါတယ်။

### Cache output

Cached function တစ်ခုက inputs တူရင် output တူတူပဲ ထုတ်ပေးပါတယ်။ Inputs တစ်စုအတွက် ပထမဆုံး call က function body ကို run ပြီး output ကို သိမ်းပါတယ်။ နောက်ပိုင်း inputs တူတဲ့ call တွေတိုင်းက — render pass တစ်ခုအတွင်းရော requests တွေကြားမှာပါ — entry ရှိနေသမျှ ဒီ output ကိုပဲ ပြန်သုံးပါတယ်။

Outputs တွေကို [cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) တစ်ခုက သိမ်းပြီး — default အနေနဲ့ [in-memory](#runtime-caching-considerations) မှာ သိမ်းကာ — [revalidate](#revalidation) ဖြစ်တဲ့အထိ ခံပါတယ်။

```tsx filename="lib/orders.ts"
import { cacheLife } from 'next/cache'

export async function getOrderSummary(accountId: string) {
  'use cache'
  cacheLife('hours')

  const orders = await getOrders(accountId)
  const totals = await getOrderTotals(accountId)

  return { orders, totals }
}

export async function getOrders(accountId: string) {
  'use cache'
  cacheLife('hours')

  return db.orders.findMany({ where: { accountId } })
}

export async function getOrderTotals(accountId: string) {
  return db.orders.aggregate({ where: { accountId }, _sum: { amount: true } })
}
```

အပေါ်က ဥပမာမှာ — `accountId` တစ်ခုချင်းစီအတွက် `getOrderSummary` မှာ သူ return လုပ်တဲ့ serialized `{ orders, totals }` object ကို ကိုင်ထားတဲ့ entry သီးခြားစီ ရှိပါတယ်။ `getOrders` ဆီက calls တွေကလည်း — တူညီတဲ့ `accountId` နဲ့ key လုပ်ထားတဲ့ ကိုယ်ပိုင် entries တွေ ရှိပါတယ်။ Summary ကနေဖြစ်စေ တိုက်ရိုက်ဖြစ်စေ အရင် call တစ်ခုက entry တစ်ခုကို ဖြည့်ပြီးသားဆိုရင် — `db.orders.findMany` က run မလုပ်တော့ဘဲ အဲဒီ orders တွေက summary ရဲ့ output ထဲ အစိတ်အပိုင်းအဖြစ် ပါသွားပါတယ်။ Inner lifetime တစ်ခုက သူ့ကို ဝန်းရံထားတဲ့ entry ကို ဘယ်လို သက်ရောက်လဲဆိုတာ [nested caching behavior](/docs/nextjs/cache-life#nested-caching-behavior) မှာ ကြည့်ပါ။

`getOrderTotals` ကို cache မလုပ်ထားမှန်း သတိပြုပါ။ သူ့ကို export လုပ်ထားတာက — application ရဲ့ တခြားအစိတ်အပိုင်းတွေက uncached scope တစ်ခုထဲမှာ fresh totals တွေကို ဖတ်နိုင်ဖို့ပါ။ ဒါပေမယ့် `getOrderSummary` ထဲမှာတော့ totals query က — အဲဒီမှာ သတ်မှတ်ထားတဲ့ `'hours'` lifetime နောက်ကို လိုက်ပြီး function run တဲ့အခါမှပဲ run ပါတယ်။

[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) နဲ့ဆိုရင် prerendering က entry ကို ဖြည့်ပြီး rendering ကို ဆက်လုပ်လို့ — ဒီ output က route ရဲ့ [static shell](/docs/nextjs/caching#prerendering) ကို ပံ့ပိုးပေးပြီး သူ့ရဲ့ [prefetch](/docs/nextjs/caching#prefetching) ကိုပါ ပံ့ပိုးနိုင်ပါတယ်။ လုံခြုံစွာ သိမ်းဖို့ မလုံလောက်တဲ့ cache life တိုတိုကတော့ — request time မှာ ဖြေရှင်းရတဲ့ hole တစ်ခု ချန်ခဲ့ပါတယ်။ Thresholds တွေအတွက် [prerendering behavior](/docs/nextjs/cache-life#prerendering-behavior) ကို ကြည့်ပါ။

## Serialization (serialize လုပ်ခြင်း)

Cached functions တွေဆီက arguments တွေရော သူတို့ရဲ့ return values တွေပါ serializable ဖြစ်ရပါမယ်။

အပြည့်အစုံ ကိုးကားရန်အတွက်:

- [Serializable arguments](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values) — **React Server Components** serialization ကို သုံးပါတယ်
- [Serializable return types](https://react.dev/reference/rsc/use-client#serializable-types) — **React Client Components** serialization ကို သုံးပါတယ်

> **သိထားသင့်သည်:** Arguments နဲ့ return values တွေက မတူညီတဲ့ serialization systems တွေ သုံးပါတယ်။ Server Component serialization (arguments အတွက်) က Client Component serialization (return values အတွက်) ထက် ပိုတင်းကျပ်ပါတယ်။ ဒါကြောင့် — JSX elements တွေကို return လုပ်လို့ ရပေမယ့် pass-through patterns တွေ မသုံးရင် arguments အဖြစ်တော့ လက်ခံလို့ မရပါဘူး။

### Supported types (ထောက်ပံ့ထားတဲ့ types)

**Arguments:**

- Primitives: `string`, `number`, `boolean`, `null`, `undefined`
- Plain objects: `{ key: value }`
- Arrays: `[1, 2, 3]`
- Dates, Maps, Sets, TypedArrays, ArrayBuffers
- React elements (pass-through အနေနဲ့ပဲ)

**Return values:**

- Arguments တွေလိုပဲ — JSX elements တွေပါ ထပ်ခွင့်ပြုပါတယ်

### Unsupported types (မထောက်ပံ့တဲ့ types)

- Class instances
- Functions (pass-through ကလွဲရင်)
- Symbols, WeakMaps, WeakSets
- URL instances

```tsx filename="app/components/user-card.tsx"
// Valid - primitives and plain objects
async function UserCard({
  id,
  config,
}: {
  id: string
  config: { theme: string }
}) {
  'use cache'
  return <div>{id}</div>
}

// Invalid - class instance
async function UserProfile({ user }: { user: UserClass }) {
  'use cache'
  // Error: Cannot serialize class instance
  return <div>{user.name}</div>
}
```

### Pass-through (non-serializable arguments တွေ လက်ခံခြင်း)

Non-serializable values တွေကို — **သူတို့ကို introspect (စစ်ဆေးဖတ်ယူ) မလုပ်သရွေ့** လက်ခံနိုင်ပါတယ်။ ဒါက `children` နဲ့ Server Actions တွေပါတဲ့ composition patterns တွေ ရေးနိုင်စေပါတယ်:

```tsx filename="app/components/cached-wrapper.tsx"
async function CachedWrapper({ children }: { children: ReactNode }) {
  'use cache'
  // Don't read or modify children - just pass it through
  return (
    <div className="wrapper">
      <header>Cached Header</header>
      {children}
    </div>
  )
}

// Usage: children can be dynamic
export default function Page() {
  return (
    <CachedWrapper>
      <DynamicComponent /> {/* Not cached, passed through */}
    </CachedWrapper>
  )
}
```

Server Actions တွေကိုလည်း cached components တွေကနေ ဖြတ်ပို့ (pass through) လုပ်နိုင်ပါတယ်:

```tsx filename="app/components/cached-form.tsx"
async function CachedForm({ action }: { action: () => Promise<void> }) {
  'use cache'
  // Don't call action here - just pass it through
  return <form action={action}>{/* ... */}</form>
}
```

## Constraints (ကန့်သတ်ချက်များ)

Cached functions တွေက သီးခြား (isolated) environment တစ်ခုထဲမှာ run ပါတယ်။ အောက်က ကန့်သတ်ချက်တွေက cache အပြုအမူ ခန့်မှန်းလို့ရပြီး လုံခြုံနေအောင် သေချာစေပါတယ်။

### Request-time APIs

Cached functions နဲ့ components တွေက `cookies()`, `headers()`, (သို့) `searchParams` လိုမျိုး runtime APIs တွေကို **သုံးလို့ မရပါဘူး** — ပြီးတော့ ဒီကန့်သတ်ချက်က call stack တစ်လျှောက်လုံး သက်ရောက်ပါတယ်: cached function က ခေါ်တဲ့ helper တစ်ခုက ဒီထဲက တစ်ခုခုကို ဖတ်ရင်လည်း — [`next-request-in-use-cache`](https://nextjs.org/docs/messages/next-request-in-use-cache) error နဲ့အတူ ဒီလိုပဲ ကျရှုံးပါတယ်။ Dynamically rendered route တစ်ခုပေါ်မှာဆိုရင် ဒါက route run တဲ့အခါမှ ပေါ်လာလို့ — `next build` ကို အောင်နိုင်ပြီး `next start` အောက်မှာ ကျရှုံးနိုင်ပါတယ်။ ဒီတန်ဖိုးတွေကို cached scope ရဲ့ အပြင်ဘက်မှာ ဖတ်ပြီး arguments အဖြစ် ပို့ပါ။

### Runtime caching considerations

`use cache` က အဓိကအားဖြင့် uncached data တွေကို static shell ထဲ ထည့်သွင်းဖို့ ဒီဇိုင်းထားပေမယ့် — in-memory LRU (Least Recently Used) storage သုံးပြီး runtime မှာလည်း data တွေကို cache လုပ်နိုင်ပါတယ်။

Default in-memory handler နဲ့ဆိုရင် runtime cache အပြုအမူက သင့် hosting environment အပေါ် မူတည်ပါတယ်:

| Environment     | Runtime Caching အပြုအမူ                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Serverless**  | Cache entries တွေက ပုံမှန်အားဖြင့် requests တွေကြားမှာ (request တစ်ခုချင်းစီက instance မတူနိုင်လို့) (သို့) revalidation ကာလအတွင်း မတည်မြဲပါဘူး။ Build-time caching ကတော့ ပုံမှန် အလုပ်လုပ်ပါတယ်။ |
| **Self-hosted** | Cache entries တွေက requests တွေကြားမှာ တည်မြဲပါတယ်။ Cache size ကို [`cacheMaxMemorySize`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize) နဲ့ ထိန်းချုပ်ပါ။     |

ဥပမာ — serverless environment တစ်ခုမှာ pages နှစ်ခုက share လုပ်ထားတဲ့ cached function တစ်ခုက static shell revalidation တစ်ခုစီမှာ run ပါတယ်။ Self-hosted (သို့) persistent memory ရှိတဲ့ environments တွေမှာတော့ cached output က fresh ဖြစ်နေသေးရင် ပြန်သုံးပါတယ်။

Default in-memory cache က မလုံလောက်ဘူးဆိုရင် — **[`use cache: remote`](/docs/nextjs/use-cache-remote)** ကို စဉ်းစားပါ။ ဒါက platforms တွေကို (Redis (သို့) KV database လိုမျိုး) သီးသန့် cache handler တစ်ခု ပေးနိုင်စေပါတယ်။ ဒါက သင့် total traffic အတွက် scale မလုပ်ထားတဲ့ data sources တွေဆီ ရောက်တဲ့ hits တွေကို လျှော့ချပေးနိုင်ပေမယ့် — (storage, network latency, platform fees လိုမျိုး) ကုန်ကျစရိတ်တွေ ပါလာပါတယ်။

> **မှတ်ချက်:**
> Default in-memory handler နဲ့ဆိုရင် serverless instances တွေက ephemeral (ယာယီ) ဖြစ်လို့ — `use cache: remote` နဲ့ မတူဘဲ entries တွေက requests တွေကြားမှာ ပြန်သုံးခံရချင်မှ သုံးခံရပါတယ်။ Caching directive နှစ်ခုစလုံးကလည်း deploy အသစ်တစ်ခုဆီ မသယ်ဆောင်သွားပါဘူး — အကြောင်းက [cache key](#cache-keys) ထဲမှာ build (သို့) `deploymentId` ID ပါဝင်လို့ပါ။
>
> Deploys တွေကြားမှာ ဆက်ခံစေချင်တဲ့ data တွေအတွက်တော့ — non-`fetch` functions တွေမှာ [`unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) ကို သုံးပါ (သို့) [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch) cache ကို အားကိုးပါ။

အလွန် ရှားပါးတဲ့အခြေအနေတွေမှာ — compliance လိုအပ်ချက်တွေ ရှိတာ (သို့) သင့် code ကို runtime data တွေ `use cache` scope တစ်ခုဆီ arguments အဖြစ် ပို့ဖို့ refactor မလုပ်နိုင်တဲ့အခါ — [`use cache: private`](/docs/nextjs/use-cache-private) လိုအပ်နိုင်ပါတယ်။

### Draft Mode

[Draft Mode](https://nextjs.org/docs/app/guides/draft-mode) enable ဖြစ်နေတဲ့အခါ — cached functions နဲ့ components တွေ အားလုံးက request တိုင်းမှာ ပြန် run ပြီး ရလဒ်တွေကို cache ထဲ မသိမ်းတော့ပါဘူး။ ဒါက draft content တွေ အမြဲ fresh ဖြစ်နေစေပြီး — သင့် caching code ကို ဘာမှ ပြောင်းစရာ မလိုပါဘူး။

`use cache` scope တစ်ခုအတွင်းမှာ [`draftMode()`](https://nextjs.org/docs/app/api-reference/functions/draft-mode) ကနေ `isEnabled` ကို ဖတ်လို့ ရပါတယ်။ ဒါပေမယ့် — Draft Mode active ဖြစ်နေတာတောင်မှ `cookies()` နဲ့ `headers()` လို တခြား runtime APIs တွေကတော့ ခွင့်မပြုပါဘူး။ အကြံပြုထားတဲ့ pattern အတွက် [Passing runtime values to cached functions](/docs/nextjs/caching) ကို ကြည့်ပါ။

```tsx filename="app/components/content.tsx"
import { draftMode } from 'next/headers'

async function Content() {
  'use cache'

  const { isEnabled } = await draftMode()
  const url = isEnabled
    ? 'https://draft.example.com/content'
    : 'https://production.example.com/content'

  const data = await fetch(url)
  return <article>{/* ... */}</article>
}
```

Caching directive scope တစ်ခုအတွင်းမှာ `enable()` (သို့) `disable()` ခေါ်ရင်လည်း error တက်ပါတယ်။ Draft Mode ကို [Route Handlers](/docs/nextjs/file-conventions-route) (သို့) [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေထဲမှာပဲ toggle လုပ်လို့ ရပါတယ်။

### React.cache isolation

[`React.cache`](https://react.dev/reference/react/cache) က `use cache` boundaries တွေအတွင်းမှာ သီးခြား (isolated) scope တစ်ခုထဲမှာ အလုပ်လုပ်ပါတယ်။ `use cache` function တစ်ခုရဲ့ အပြင်ဘက်မှာ `React.cache` ကနေ သိမ်းထားတဲ့ values တွေက သူ့အတွင်းမှာ မမြင်ရပါဘူး။

ဒါကြောင့် — `React.cache` ကို `use cache` scope တစ်ခုထဲကို data ပို့ဖို့ သုံးလို့ မရပါဘူး:

```tsx
import { cache } from 'react'

const store = cache(() => ({ current: null as string | null }))

function Parent() {
  const shared = store()
  shared.current = 'value from parent'
  return <Child />
}

async function Child() {
  'use cache'
  const shared = store()
  // shared.current is null, not 'value from parent'
  // use cache has its own isolated React.cache scope
  return <div>{shared.current}</div>
}
```

ဒီ isolation က cached functions တွေမှာ ခန့်မှန်းလို့ရတဲ့၊ မိမိကိုယ်မိမိ ပြည့်စုံတဲ့ အပြုအမူ ရှိစေပါတယ်။ `use cache` scope တစ်ခုထဲကို data ပို့ချင်ရင် — function arguments တွေကို သုံးပါ။

## `use cache` runtime မှာ

**Server** ပေါ်မှာ — cache entries တွေကို in-memory မှာ သိမ်းပြီး သင့် `cacheLife` configuration ထဲက `revalidate` နဲ့ `expire` times တွေကို လိုက်နာပါတယ်။ သင့် `next.config.js` file ထဲမှာ [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) သတ်မှတ်ပြီး cache storage ကို customize လုပ်နိုင်ပါတယ်။

**Client** ဘက်မှာ — server cache ကနေ လာတဲ့ content တွေကို `stale` time နဲ့ သတ်မှတ်ထားတဲ့ ကြာချိန်အတွက် browser ရဲ့ memory ထဲမှာ သိမ်းပါတယ်။ Client router က configuration ဘယ်လိုပဲ ရှိရှိ — **အနည်းဆုံး စက္ကန့် ၃၀ ရှိတဲ့ stale time** တစ်ခုကို ကျင့်သုံးပါတယ်။

`x-nextjs-stale-time` response header က cache lifetime ကို server ကနေ client ဆီ ပို့ပေးပြီး — အပြုအမူတွေ ညီညွတ်နေအောင် သေချာစေပါတယ်။

## Revalidation

Cached functions တွေက — သူတို့ရဲ့ `cacheLife` profile ထဲက `revalidate` နဲ့ `expire` times တွေအရ (သို့) tags တွေကနေ on-demand အနေနဲ့ revalidate လုပ်ပါတယ်။ ဒီနည်းလမ်း နှစ်ခုက သီးသန့်ခွဲထားစရာ မလိုတဲ့အရာတွေ ဖြစ်ပြီး — မကြာခဏ တွဲသုံးလေ့ ရှိပါတယ်:

- **[Time-based](#time-based-revalidation)**: ကြာချိန် တစ်ခု ကျော်လွန်ပြီးရင် [`cacheLife`](/docs/nextjs/cache-life) နဲ့ အလိုအလျောက် refresh လုပ်ခြင်း
- **[On-demand](#on-demand-revalidation)**: Mutation တစ်ခု ပြီးသွားရင် [`cacheTag`](/docs/nextjs/cache-tag) နဲ့ [`revalidateTag`](/docs/nextjs/revalidate-tag) (သို့) [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) သုံးပြီး invalidate လုပ်ခြင်း

ဥပမာ — စာရေးဆရာက တည်းဖြတ်မှပဲ ပြောင်းတဲ့ blog post တစ်ပုဒ်အတွက် — `cacheTag` နဲ့ တွဲပြီး `max` လိုမျိုး ရှည်ကြာတဲ့ `cacheLife` ကို သုံးပြီး — post ကို သိမ်းတဲ့အခါ on-demand နဲ့ invalidate လုပ်နိုင်ပါတယ်။ တစ်နေ့တာလုံး update ဖြစ်နေတဲ့ မကြာသေးတဲ့ posts စာရင်းတစ်ခုအတွက်တော့ — ကိုယ်တိုင် invalidate လုပ်စရာ မလိုဘဲ `hours` လိုမျိုး တိုတဲ့ profile ကို သုံးပြီး သူ့ဘာသာ refresh ဖြစ်အောင် လုပ်နိုင်ပါတယ်။

### Time-based revalidation

`use cache` scope တိုင်းမှာ [`cacheLife`](/docs/nextjs/cache-life) နဲ့ explicit cache lifetime တစ်ခု သတ်မှတ်ပါ။ ဒါက call site မှာ cache အပြုအမူကို ရှင်းလင်းစေပြီး — `default` profile (သို့) ပတ်ဝန်းကျင် caches တွေပေါ် မမှီခိုစေပါဘူး။

```tsx filename="lib/data.ts"
import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours') // Use built-in 'hours' profile
  const res = await fetch('https://api.example.com/data')
  return res.json()
}
```

`cacheLife` ချန်လှပ်ထားရင် `default` profile သက်ရောက်ပြီး — lifetime က call site မှာ explicit မဖြစ်တော့ပါဘူး:

- **stale**: ၅ မိနစ် (client-side)
- **revalidate**: ၁၅ မိနစ် (server-side)
- **expire**: အချိန်နဲ့ ဘယ်တော့မှ expire မဖြစ်

```tsx filename="lib/data.ts"
async function getData() {
  'use cache'
  // Implicitly uses the 'default' profile
  const res = await fetch('https://api.example.com/data')
  return res.json()
}
```

Explicit [cacheLife](/docs/nextjs/cache-life) မရှိတဲ့ use cache တစ်ခုထဲမှာ short-lived use cache တစ်ခုကို nesting လုပ်ရင် — prerendering ကာလအတွင်း build က ကျရှုံးပါတယ်။ စည်းမျဉ်းနဲ့ ဖြေရှင်းနည်းအတွက် [Nested short-lived caches](/docs/nextjs/cache-life#nested-short-lived-caches) ကို ကြည့်ပါ။

### On-demand revalidation

On-demand cache invalidation အတွက် [`cacheTag`](/docs/nextjs/cache-tag), [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို သုံးပါ:

```tsx filename="lib/data.ts"
import { cacheTag } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheTag('products')
  const res = await fetch('https://api.example.com/products')
  return res.json()
}
```

```tsx filename="app/actions.ts"
'use server'

import { updateTag } from 'next/cache'

export async function updateProduct() {
  await db.products.update(...)
  updateTag('products') // Invalidates all 'products' caches
}
```

`cacheLife` ရော `cacheTag` ပါ client နဲ့ server caching layers နှစ်ခုလုံးမှာ ပေါင်းစပ်အလုပ်လုပ်လို့ — သင့် caching semantics တွေကို တစ်နေရာတည်းမှာ configure လုပ်ထားရင် နေရာတိုင်းမှာ သက်ရောက်ပါတယ်။

## ဥပမာများ (Examples)

### Function output ကို `use cache` နဲ့ caching လုပ်ခြင်း

`use cache` ကို components နဲ့ routes တွေတင်မက — async function တိုင်းမှာ ထည့်နိုင်ပါတယ်။ Network request, database query (သို့) နှေးကွေးတဲ့ computation တစ်ခုကို cache လုပ်ချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။

```tsx filename="app/actions.ts" highlight={2} switcher
export async function getData() {
  'use cache'

  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

```jsx filename="app/actions.js" highlight={2} switcher
export async function getData() {
  'use cache'

  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

### Component တစ်ခုရဲ့ output ကို `use cache` နဲ့ caching လုပ်ခြင်း

Component level မှာ `use cache` သုံးပြီး — အဲဒီ component အတွင်းမှာ လုပ်ဆောင်တဲ့ fetches (သို့) computations တွေ ဘာကိုမဆို cache လုပ်နိုင်ပါတယ်။ Serialized props တွေက instance တိုင်းမှာ တူညီတဲ့ တန်ဖိုး ထုတ်ပေးသရွေ့ cache entry ကို ပြန်သုံးပါတယ်။

```tsx filename="app/components/bookings.tsx" highlight={2} switcher
export async function Bookings({ type = 'haircut' }: BookingsProps) {
  'use cache'
  async function getBookingsData() {
    const response = await fetch(
      `https://api.example.com/bookings?type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    return data
  }
  return //...
}

interface BookingsProps {
  type: string
}
```

```jsx filename="app/components/bookings.js" highlight={2} switcher
export async function Bookings({ type = 'haircut' }) {
  'use cache'
  async function getBookingsData() {
    const response = await fetch(
      `https://api.example.com/bookings?type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    return data
  }
  return //...
}
```

### Interleaving

React မှာ `children` (သို့) slots တွေနဲ့ composition လုပ်တာက — flexible components တွေ တည်ဆောက်ဖို့ လူသိများတဲ့ pattern တစ်ခုပါ။ `use cache` သုံးတဲ့အခါမှာလည်း ဒီပုံစံအတိုင်း UI ကို ဆက်ပေါင်းစပ်နိုင်ပါတယ်။ Return လုပ်တဲ့ JSX ထဲမှာ `children` (သို့) တခြား compositional slots တွေအဖြစ် ပါဝင်တာတွေက — cached component ကနေ ဖြတ်သွားပြီး သူ့ရဲ့ cache entry ကို မထိခိုက်စေပါဘူး။

Cacheable function ရဲ့ body ထဲမှာ JSX slots တွေထဲက တစ်ခုခုကို တိုက်ရိုက် ရည်ညွှန်း မသုံးသရွေ့ — return output ထဲမှာ သူတို့ ပါနေတာက cache entry ကို မထိခိုက်စေပါဘူး။

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const uncachedData = await getData()
  return (
    // Pass compositional slots as props, e.g. header and children
    <CacheComponent header={<h1>Home</h1>}>
      {/* DynamicComponent is provided as the children slot */}
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

async function CacheComponent({
  header, // header: a compositional slot, injected as a prop
  children, // children: another slot for nested composition
}: {
  header: ReactNode
  children: ReactNode
}) {
  'use cache'
  const res = await fetch('https://api.example.com/cached-data')
  const cachedData = await res.json()
  return (
    <div>
      {header}
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  const uncachedData = await getData()
  return (
    // Pass compositional slots as props, e.g. header and children
    <CacheComponent header={<h1>Home</h1>}>
      {/* DynamicComponent is provided as the children slot */}
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

async function CacheComponent({
  header, // header: a compositional slot, injected as a prop
  children, // children: another slot for nested composition
}) {
  'use cache'
  const res = await fetch('https://api.example.com/cached-data')
  const cachedData = await res.json()
  return (
    <div>
      {header}
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

Server Actions တွေကိုလည်း — cacheable function ထဲမှာ မခေါ်ဘဲ cached components တွေကနေ Client Components တွေဆီ ဖြတ်ပို့နိုင်ပါတယ်။

```tsx filename="app/page.tsx" switcher
import ClientComponent from './ClientComponent'

export default async function Page() {
  const performUpdate = async () => {
    'use server'
    // Perform some server-side update
    await db.update(...)
  }

  return <CachedComponent performUpdate={performUpdate} />
}

async function CachedComponent({
  performUpdate,
}: {
  performUpdate: () => Promise<void>
}) {
  'use cache'
  // Do not call performUpdate here
  return <ClientComponent action={performUpdate} />
}
```

```jsx filename="app/page.js" switcher
import ClientComponent from './ClientComponent'

export default async function Page() {
  const performUpdate = async () => {
    'use server'
    // Perform some server-side update
    await db.update(...)
  }

  return <CachedComponent performUpdate={performUpdate} />
}

async function CachedComponent({ performUpdate }) {
  'use cache'
  // Do not call performUpdate here
  return <ClientComponent action={performUpdate} />
}
```

```tsx filename="app/ClientComponent.tsx" switcher
'use client'

export default function ClientComponent({
  action,
}: {
  action: () => Promise<void>
}) {
  return <button onClick={action}>Update</button>
}
```

```jsx filename="app/ClientComponent.js" switcher
'use client'

export default function ClientComponent({ action }) {
  return <button onClick={action}>Update</button>
}
```

### Module တစ်ခုရဲ့ exports တွေကို `use cache` နဲ့ caching လုပ်ခြင်း

Directive ကို file ရဲ့ ထိပ်မှာ တစ်ခါ ထည့်ထားရင် — export တစ်ခုချင်းစီမှာ ထပ်ခါထပ်ခါ ရေးစရာ မလိုဘဲ exports အားလုံးကို ဖုံးအားပေးပါတယ်။ ဖုံးအားခံရတဲ့ exported function တိုင်းက async ဖြစ်ရပါမယ်။

```tsx filename="app/lib/reports.ts"
'use cache'

export async function getMonthlyTotals(accountId: string) {
  return db.orders.aggregate({ where: { accountId }, _sum: { amount: true } })
}

export async function getTopProducts() {
  return db.products.findMany({ orderBy: { sales: 'desc' }, take: 10 })
}
```

Framework function exports တွေကိုလည်း တခြား exports တွေလိုပဲ ဖုံးအားလို့ — ဒီလို file တစ်ခုထဲမှာ [`generateMetadata`](/docs/nextjs/generate-metadata) နဲ့ [`generateStaticParams`](/docs/nextjs/generate-static-params) တွေက async ဖြစ်ရပါမယ်။

> **သိထားသင့်သည်:**
>
> - Caching directive တစ်ခု (`use cache`, [`use cache: private`](/docs/nextjs/use-cache-private), (သို့) [`use cache: remote`](/docs/nextjs/use-cache-remote)) က file တစ်ခုရဲ့ ထိပ်မှာ ရှိနေရင် — သူ့ရဲ့ exported functions တွေကို Client Component တစ်ခုထဲမှာ import လုပ်ပြီး တိုက်ရိုက် ခေါ်နိုင်ပါတယ်; သူတို့က server ပေါ်မှာ run ပြီး [Server Function](https://nextjs.org/docs/app/glossary#server-function) တစ်ခုလိုပဲ ရလဒ်ကို ပြန်ပို့ပါတယ်။ Cached functions တွေကို server ပေါ်မှာ ခေါ်ပြီး ရလဒ်တွေကို props အဖြစ် အောက်ကို ပို့တာကို ဦးစားပေးပါ။

### Route segment တစ်ခုရဲ့ output ကို `use cache` နဲ့ caching လုပ်ခြင်း

`page` (သို့) `layout` file ဆိုတာလည်း module တစ်ခုပဲ ဖြစ်လို့ — အဲဒီမှာ file-level directive သုံးရင်လည်း စည်းမျဉ်းတွေ အတူတူပါပဲ။ Route segment တစ်ခုစီက entry point သီးခြားစီ ဖြစ်ပြီး — သီးခြားစီ cache လုပ်ပါတယ်။ Route တစ်ခုလုံးကို prerender လုပ်ဖို့ — သူ render လုပ်တဲ့ segment file တိုင်းရဲ့ ထိပ်မှာ `use cache` ထည့်ပါ: `page`, `layout` နဲ့ [parallel route](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) slots တွေ အားလုံး။

```tsx filename="app/layout.tsx" switcher
'use cache'

export default async function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

```jsx filename="app/layout.js" switcher
'use cache'

export default async function Layout({ children }) {
  return <div>{children}</div>
}
```

Cached `layout` တစ်ခုက သူ render လုပ်တဲ့ `children` တွေကို cache မလုပ်ပါဘူး — slots တွေက သူ့ရဲ့ entry ကို မထိခိုက်ဘဲ ဖြတ်သွားလို့ပါ။ [Interleaving](#interleaving) ကို ကြည့်ပါ။

```tsx filename="app/page.tsx" switcher
'use cache'

async function Users() {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()
  // loop through users
}

export default async function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

```jsx filename="app/page.js" switcher
'use cache'

async function Users() {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()
  // loop through users
}

export default async function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

## Troubleshooting (ပြဿနာရှာဖွေခြင်း)

### Cache အပြုအမူ debugging လုပ်ခြင်း

#### Verbose logging

Verbose cache logging အတွက် `NEXT_PRIVATE_DEBUG_CACHE=1` ကို သတ်မှတ်ပါ:

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
# or for production
NEXT_PRIVATE_DEBUG_CACHE=1 npm run start
```

> **သိထားသင့်သည်:** ဒီ environment variable က ISR နဲ့ တခြား caching mechanisms တွေကိုပါ log လုပ်ပါတယ်။ [အသေးစိတ်အတွက် Verifying correct production behavior](https://nextjs.org/docs/app/guides/incremental-static-regeneration#verifying-correct-production-behavior) ကို ကြည့်ပါ။

#### Console log replays

Development မှာ cached functions တွေကနေ ထွက်တဲ့ console logs တွေက `Cache` prefix နဲ့ ပေါ်ပါတယ်။

### Build Hangs (Cache Timeout)

သင့် build က ရပ်နေရင် (hang) — `use cache` boundary တစ်ခုရဲ့ အပြင်ဘက်မှာ ဖန်တီးထားတဲ့ uncached (သို့) runtime data တွေဆီ resolve ဖြစ်တဲ့ Promises တွေကို သင်ဝင်ရောက်နေလို့ပါ။ Cached function က build ကာလအတွင်း resolve မဖြစ်နိုင်တဲ့ data ကို စောင့်နေလို့ — စက္ကန့် ၅၀ အကြာမှာ timeout ဖြစ်ပါတယ်။

Build timeout ဖြစ်တဲ့အခါ ဒီ error message ကို မြင်ရပါလိမ့်မယ်:

> Error: Filling a cache during prerender timed out, likely because request-specific arguments such as params, searchParams, cookies() or uncached data were used inside "use cache".

ဒီလိုမျိုး ဖြစ်တတ်တဲ့ နည်းလမ်းတွေက — ဒီလို Promises တွေကို props အဖြစ် ပို့တာ၊ closure ကနေ ဝင်ရောက်တာ၊ (သို့) shared storage (Maps) တွေကနေ ပြန်ယူတာတွေ ဖြစ်ပါတယ်။

> **သိထားသင့်သည်:** `use cache` ထဲမှာ `cookies()` (သို့) `headers()` တွေကို တိုက်ရိုက် ခေါ်ရင်တော့ — timeout မဟုတ်ဘဲ [ခြားနားတဲ့ error](https://nextjs.org/docs/messages/next-request-in-use-cache) တစ်ခုနဲ့ ချက်ချင်း ကျရှုံးပါတယ်။

**Runtime data Promises တွေကို props အဖြစ် ပို့ခြင်း:**

```tsx filename="app/page.tsx"
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dynamic />
    </Suspense>
  )
}

async function Dynamic() {
  const cookieStore = cookies()
  return <Cached promise={cookieStore} /> // Build hangs
}

async function Cached({ promise }: { promise: Promise<unknown> }) {
  'use cache'
  const data = await promise // Waits for runtime data during build
  return <p>..</p>
}
```

`Dynamic` component ထဲမှာ `cookies` store ကို await လုပ်ပြီး — `Cached` component ဆီ cookie value တစ်ခုကို ပို့ပါ။

**Shared deduplication storage:**

```tsx filename="app/page.tsx"
// Problem: Map stores dynamic Promises, accessed by cached code
import { Suspense } from 'react'

const cache = new Map<string, Promise<string>>()

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Dynamic id="data" />
      </Suspense>
      <Cached id="data" />
    </>
  )
}

async function Dynamic({ id }: { id: string }) {
  // Stores dynamic Promise in shared Map
  cache.set(
    id,
    fetch(`https://api.example.com/${id}`).then((r) => r.text())
  )
  return <p>Dynamic</p>
}

async function Cached({ id }: { id: string }) {
  'use cache'
  return <p>{await cache.get(id)}</p> // Build hangs - retrieves dynamic Promise
}
```

Next.js ရဲ့ built-in `fetch()` deduplication ကို သုံးပါ (သို့) cached နဲ့ uncached contexts တွေအတွက် Maps တွေ သီးခြားစီ သုံးပါ။

## Platform Support (Platform ထောက်ပံ့မှု)

| Deployment Option                                                   | Supported         |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js server](/docs/nextjs/deploying#nodejs-server) | Yes               |
| [Docker container](/docs/nextjs/deploying#docker)      | Yes               |
| [Static export](/docs/nextjs/deploying#static-export)  | No                |
| [Adapters](/docs/nextjs/deploying#adapters)            | Platform-specific |

Next.js ကို self-host လုပ်တဲ့အခါ [caching ကို configure လုပ်နည်း](https://nextjs.org/docs/app/guides/self-hosting#caching-and-isr) ကို လေ့လာပါ။

## Version History

| Version   | အပြောင်းအလဲ                                                             |
| --------- | ------------------------------------------------------------------- |
| `v16.0.0` | `"use cache"` ကို Cache Components feature နဲ့အတူ enable လုပ်နိုင်ပါပြီ။ |
| `v15.0.0` | `"use cache"` ကို experimental feature အဖြစ် စတင် မိတ်ဆက်ခဲ့ပါတယ်။    |
