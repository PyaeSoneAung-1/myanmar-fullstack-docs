---
title: "fetch function (server-side caching နဲ့ revalidation အတွက် extended fetch)"
description: "fetch() — Web fetch API ကို Next.js က တိုးချဲ့ထားပုံ: server-side persistent cache နဲ့ revalidation semantics, options.cache (auto no cache/no-store/force-cache), next.revalidate, next.tags, memoization, Server Components ထဲမှာ data fetching နဲ့ development မှာ HMR cache/hard refresh troubleshooting"
order: 140
source: "https://nextjs.org/docs/app/api-reference/functions/fetch"
status: translated
updated: 2026-09-03
---

Next.js က [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API) ကို တိုးချဲ့ပြီး — server ပေါ်က request တစ်ခုစီဟာ ကိုယ်ပိုင် persistent caching (တည်မြဲစွာ cache သိမ်းဆည်းခြင်း) နဲ့ revalidation (ပြန်လည်စစ်ဆေးခြင်း) semantics တွေကို သတ်မှတ်နိုင်အောင် ပြုလုပ်ပေးပါတယ်။

Browser ထဲမှာ `cache` option က fetch request တစ်ခုက _browser ရဲ့_ HTTP cache နဲ့ ဘယ်လို ဆက်ဆံမလဲဆိုတာ ဖော်ပြပါတယ်။ ဒီ extension နဲ့ဆိုရင် `cache` က _server-side_ fetch request တစ်ခုက framework ရဲ့ persistent cache နဲ့ ဘယ်လို ဆက်ဆံမလဲဆိုတာကို ဖော်ပြပါတယ်။

Server Components တွေထဲမှာ `fetch` ကို `async` နဲ့ `await` သုံးပြီး တိုက်ရိုက် ခေါ်နိုင်ပါတယ်။

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## `fetch(url, options)`

Next.js က [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API) ကို တိုးချဲ့ထားတာမို့ — [ရနိုင်တဲ့ native options](https://developer.mozilla.org/docs/Web/API/fetch#parameters) တွေကို အကုန် အသုံးပြုနိုင်ပါတယ်။

### `options.cache`

Request တစ်ခုက Next.js [caching](/docs/nextjs/caching) နဲ့ ဘယ်လို ဆက်ဆံသင့်လဲဆိုတာကို configure လုပ်ပါတယ်။

```ts
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

- **`auto no cache`** (default): Next.js က development mode မှာ request တိုင်း remote server ကနေ resource ကို ယူပါတယ် — ဒါပေမယ့် route က statically prerender ဖြစ်မှာမို့ `next build` လုပ်ချိန်မှာတော့ တစ်ကြိမ်ပဲ ယူပါတယ်။ Route ပေါ်မှာ [Request-time APIs](https://nextjs.org/docs/app/glossary#request-time-apis) တွေကို တွေ့ရရင် — Next.js က request တိုင်းမှာ resource ကို ပြန်ယူပါလိမ့်မယ်။
- **`no-store`**: Route ပေါ်မှာ Request-time APIs တွေ မရှိတာတောင် — Next.js က request တိုင်း remote server ကနေ resource ကို ယူပါတယ်။
- **`force-cache`**: Next.js က သူ့ရဲ့ server-side cache ထဲမှာ ကိုက်ညီတဲ့ request တစ်ခုကို ရှာပါတယ်။ Request တစ်ခုက သူ့ရဲ့ URL, method, headers နဲ့ body ပေါ် မူတည်ပြီး match ဖြစ်လို့ — ဒါတွေထဲက တစ်ခုခု ကွဲပြားတဲ့ requests တွေကို သပ်သပ်စီ cache လုပ်ပါတယ်။
  - Match တစ်ခု တွေ့ပြီး fresh (အသစ်) ဖြစ်နေရင် — cache ကနေ ပြန်ပေးပါတယ်။
  - Match မတွေ့ဘူး (သို့) stale (ဟောင်းနေပြီ) ဖြစ်နေရင် — Next.js က remote server ကနေ resource ကို ယူပြီး ရလာတဲ့ resource နဲ့ cache ကို update လုပ်ပါတယ်။ `200` HTTP status code ရှိတဲ့ responses တွေကိုပဲ သိမ်းပါတယ်။

> **သိထားသင့်သည်:** Caching က opt-in (ကိုယ်တိုင် ရွေးချယ်သုံးရတဲ့) စနစ်ပါ။ Request တစ်ခုခုကို — `POST` နဲ့ `authorization` (သို့) `cookie` headers ပို့တဲ့ requests တွေ အပါအဝင် — cache လုပ်ချင်ရင် `cache: 'force-cache'` ကို သတ်မှတ်ပါ။ [Draft Mode](/docs/nextjs/draft-mode) ကတော့ cache ကို လုံးဝ ကျော်လွှားပါတယ် (read ရော write ပါ မလုပ်ပါဘူး)။

### `options.next.revalidate`

```ts
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

Resource တစ်ခုရဲ့ cache lifetime (သက်တမ်း) ကို စက္ကန့်နဲ့ သတ်မှတ်ပါတယ်။

- **`false`** — Resource ကို အကန့်အသတ်မရှိ cache လုပ်ပါတယ်။ `revalidate: Infinity` နဲ့ အနှစ်သာရအားဖြင့် တူညီပါတယ်။ HTTP cache က အဟောင်းရဆုံး resources တွေကို အချိန်ကြာလာတာနဲ့အမျှ ဖယ်ရှားပစ်နိုင်ပါတယ်။
- **`0`** — Resource ကို cache လုပ်မခံရအောင် တားဆီးပါတယ်။
- **`number`** — (စက္ကန့်နဲ့) resource က cache lifetime အများဆုံး `n` စက္ကန့် ရှိစေရမယ်လို့ သတ်မှတ်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - `fetch()` request တစ်ခုတည်းက route တစ်ခုရဲ့ [default `revalidate`](https://nextjs.org/docs/app/guides/caching-without-cache-components#route-segment-config-revalidate) ထက် ပိုနည်းတဲ့ `revalidate` number တစ်ခု သတ်မှတ်ရင် — route တစ်ခုလုံးရဲ့ revalidation interval ကို လျှော့ချလိုက်ပါလိမ့်မယ်။
> - Route တစ်ခုတည်းထဲမှာ URL တူညီတဲ့ fetch requests နှစ်ခုက မတူညီတဲ့ `revalidate` values တွေ ရှိနေရင် — ပိုနည်းတဲ့ တန်ဖိုးကို သုံးပါလိမ့်မယ်။
> - `{ revalidate: 3600, cache: 'no-store' }` လိုမျိုး ဆန့်ကျင်နေတဲ့ options တွေက ခွင့်မပြုပါဘူး — နှစ်ခုလုံးကို လျစ်လျူရှုပြီး development mode မှာ terminal ထဲကို warning တစ်ခု ရိုက်နှိပ်ပေးပါလိမ့်မယ်။

### `options.next.tags`

```ts
fetch(`https://...`, { next: { tags: ['collection'] } })
```

Resource တစ်ခုရဲ့ cache tags တွေကို သတ်မှတ်ပါတယ်။ ပြီးရင် data တွေကို [`revalidateTag`](/docs/nextjs/revalidate-tag) သုံးပြီး on-demand (လိုအပ်တဲ့အခါမှ) revalidate လုပ်နိုင်ပါတယ်။ Custom tag တစ်ခုရဲ့ အမြင့်ဆုံး အလျားက စာလုံးရေ 256 ဖြစ်ပြီး — tag အများဆုံး အရေအတွက်ကတော့ 128 ပါ။

## မှတ်သားခြင်း (Memoization)

`GET` method နဲ့ တူညီတဲ့ URL နဲ့ options ပါတဲ့ `fetch` requests တွေက server render pass တစ်ခုအတွင်း [memoized](https://nextjs.org/docs/app/glossary#memoization) (မှတ်သားထားပြီး တစ်ကြိမ်တည်းသာ လုပ်ဆောင်ခြင်း) ဖြစ်ပါတယ်။ တူညီတဲ့ `fetch` ကို Server Components, layouts, pages, `generateStaticParams` နဲ့ `generateViewport` အများအပြားမှာ ခေါ်ရင် — Next.js က တစ်ကြိမ်ပဲ လုပ်ဆောင်ပြီး ရလဒ်ကို အားလုံး မျှဝေသုံးပါတယ်။ ဒါက persistent [caching](/docs/nextjs/caching) နဲ့ သီးခြားပါ — memoization က render pass တစ်ခုတည်းအတွက်ပဲ ခံပြီး — cached responses တွေကတော့ requests အများအပြားကြားမှာ တည်မြဲနေပါတယ်။

ဒီကနေ ဖယ်ထွက်ချင်ရင် (opt out) — `fetch` ကို [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) signal တစ်ခု ထည့်ပြီး ခေါ်ပါ:

```js
const { signal } = new AbortController()
fetch(url, { signal })
```

> **သိထားသင့်သည်:** Memoization က [Route Handlers](/docs/nextjs/file-conventions-route) တွေမှာ အကျုံးမဝင်ပါဘူး — သူတို့က React component tree ရဲ့ အစိတ်အပိုင်း မဟုတ်လို့ပါ။

## Troubleshooting (ပြဿနာရှာဖွေခြင်း)

### Fetch default `auto no cache` နဲ့ `cache: 'no-store'` က development မှာ fresh data မပြခြင်း

Next.js က local development မှာ Server Components တွေထဲက `fetch` responses တွေကို Hot Module Replacement (HMR) တစ်လျှောက် cache လုပ်ထားပါတယ် — response တွေ မြန်မြန် ရစေဖို့နဲ့ bill ပေးရတဲ့ API calls တွေရဲ့ ကုန်ကျစရိတ်ကို လျှော့ချဖို့ပါ။

Default အနေနဲ့ [HMR cache](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache) က fetch requests အားလုံးကို အကျုံးဝင်ပါတယ် — default `auto no cache` နဲ့ `cache: 'no-store'` option ပါတဲ့ requests တွေ အပါအဝင်ပါ။ ဆိုလိုတာက — cache မလုပ်ထားတဲ့ requests တွေက HMR refreshes ကြားမှာ fresh data ကို ပြသနိုင်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် navigation လုပ်တာ (သို့) full-page reload လုပ်လိုက်ရင်တော့ cache က clear ဖြစ်သွားပါလိမ့်မယ်။

အသေးစိတ်ကို [`serverComponentsHmrCache`](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache) docs မှာ ကြည့်ပါ။

### Hard refresh နဲ့ development မှာ caching

Development mode မှာ request ထဲမှာ `cache-control: no-cache` header ပါခဲ့ရင် — `options.cache`, `options.next.revalidate` နဲ့ `options.next.tags` တွေကို လျစ်လျူရှုပြီး — `fetch` request ကို source ကနေ တိုက်ရိုက် ဖြည့်ဆည်းပါတယ်။

Browser တွေက developer tools ထဲမှာ cache ကို disable လုပ်ထားချိန် (သို့) hard refresh လုပ်ချိန်မှာ `cache-control: no-cache` ကို သာမန်အားဖြင့် ထည့်ပို့လေ့ ရှိပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ       |
| --------- | ----------------- |
| `v13.0.0` | `fetch` ကို စတင် မိတ်ဆက်။ |
