---
title: "Draft Mode Guide (Draft Mode ဖြင့် Content Preview လုပ်နည်း)"
description: "Draft Mode က editor တွေကို revalidation စောင့်စရာမလိုဘဲ — draft content တွေ သင့် site ပေါ်မှာ ဘယ်လို ပေါ်မလဲ ကြည့်နိုင်စေပါတယ်; headless CMS preview integration အတွက် Route Handler ဖန်တီးပုံ, shared secret ဖြင့် လုံခြုံအောင် လုပ်ပုံ, draft content ဖတ်ပုံ နဲ့ preview banner ပြပုံ အဆင့်ဆင့်"
order: 261
source: "https://nextjs.org/docs/app/guides/draft-mode"
status: translated
updated: 2026-09-05
---

**Draft Mode** က editor တွေကို revalidation (ပြန်လည် စစ်ဆေးခြင်း) စောင့်စရာ မလိုဘဲ — draft (အကြမ်း) ဖြစ်နေတဲ့ (သို့) လုပ်ဆောင်ဆဲ (in-progress) content တွေက သင့် site ပေါ်မှာ ဘယ်လို ပေါ်မလဲ ဆိုတာကို မြင်နိုင်စေပါတယ်။ Editor တစ်ယောက် Draft Mode ထဲ ရောက်နေချိန်မှာ — cached (သို့) pre-rendered လုပ်ထားတဲ့ content တွေကို ကျော်ပြီး — upstream sources တွေကနေ တိုက်ရိုက် ယူပါတယ်။ အခြား visitors တွေကတော့ page ရဲ့ cached (သို့) pre-rendered version ကိုပဲ ဆက်ပြီး မြင်နေရပါတယ်။

သင့် CMS က draft နဲ့ published content တွေကို URL တစ်ခုတည်းကနေ ပေးနေရင် — သင့် data-fetching code ကို ပြောင်းစရာ မလိုပါဘူး။ မဟုတ်ရင်တော့ [သင့် CMS က သီးခြား Draft Endpoint သုံးတဲ့အခါ](#when-your-cms-uses-a-separate-draft-endpoint) ကို ကြည့်ပါ။

## Draft Mode က ဘာတွေ လုပ်ပေးလဲ (What Draft Mode Does)

Request တစ်ခုအတွက် Draft Mode ဖွင့်ထားတဲ့အခါ:

- `fetch()` calls တွေက Next.js fetch cache ကို ကျော်ပြီး — network ကို တိုက်ရိုက် သွားပါတယ်။
- [`'use cache'`](/docs/nextjs/use-cache) အတွင်းက components နဲ့ functions တွေက request တိုင်းမှာ ပြန် execute ဖြစ်ပြီး — ရလဒ်တွေကို cache ထဲ မသိမ်းပါဘူး။
- [`unstable_cache`](/docs/nextjs/unstable-cache) ရဲ့ reads နဲ့ writes တွေကိုလည်း အလားတူ bypass လုပ်ပါတယ်။
- Page ကို ISR response cache ကနေ ဖယ်ထုတ်ပြီး — `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` နဲ့ ပေးပို့ပါတယ်။

ဒီအကျိုးသက်ရောက်မှုက page ကို statically generated လုပ်ထား၊ cache ကနေ ပေးနေ၊ (သို့) ISR ကနေတစ်ဆင့် revalidate လုပ်ထား — ဘယ်လိုပဲ ဖြစ်ဖြစ် သက်ရောက်ပါတယ်။

## ဒီ Guide မှာ ဘာတွေ ပါဝင်လဲ (What This Guide Covers)

ဒီ guide က အောက်ပါတို့ ရှိပြီးသားလို့ ယူဆပါတယ်:

- သင့် headless CMS က configure လုပ်လို့ရတဲ့ preview URLs တွေကို ထောက်ပံ့တယ် (အများစုက ထောက်ပံ့ပါတယ်)။
- Editor က "Preview" ကို နှိပ်တဲ့အခါ — CMS က `/api/draft?secret=XXX&slug=/posts/foo` လို URL တစ်ခုကို tab အသစ်တစ်ခုမှာ ဖွင့်ပေးတယ်။ `secret` က shared token တစ်ခု ဖြစ်ပြီး — `slug` က preview လုပ်ရမယ့် path ပါ။
- သင့် Next.js app က secret ကို validate လုပ်ပြီး — Draft Mode ကို ဖွင့်ကာ — slug ဆီ redirect လုပ်ပေးတယ်။

ဒီ contract ကို စိတ်ထဲ ထားပြီး — ဒီ guide ရဲ့ ကျန်အပိုင်းတွေက အောက်ပါတို့ကို အဆင့်ဆင့် လမ်းညွှန်ပါတယ်:

1. cookie တစ်ခု သတ်မှတ်ခြင်းဖြင့် Draft Mode ကို ဖွင့်ပေးတဲ့ Route Handler တစ်ခု ဖန်တီးခြင်း။
2. အဲဒီ handler ကို CMS ဆီကလာတဲ့ shared secret နဲ့ slug သုံးပြီး လုံခြုံအောင် ပြုလုပ်ခြင်း။
3. နောက်ဆုံး draft ကို ဖတ်တဲ့ pages တွေ render လုပ်ခြင်း။
4. exit form ပါတဲ့ preview banner တစ်ခု ပြသခြင်း။

ပြီးတော့ — သင့် setup ပေါ် မူတည်ပြီး:

- [Draft Mode with Cache Components](#draft-mode-with-cache-components) — `'use cache'` boundary တစ်ခုကနေ preview state ကို ထုတ်ပြဖို့အတွက်။
- [သင့် CMS က သီးခြား Draft Endpoint သုံးတဲ့အခါ](#when-your-cms-uses-a-separate-draft-endpoint) — `isEnabled` ပေါ် မူတည်ပြီး fetch URL ကို ခွဲ (branch) ဖို့အတွက်။

> **သိထားသင့်သည်:** `GET` က ဘေးကင်းတဲ့ (safe) read-only method တစ်ခုအဖြစ် ရည်ရွယ်ထားပါတယ်။ Cookie တစ်ခုကနေတစ်ဆင့် Draft Mode ဖွင့်တာလို — နောက်ထပ် requests တွေကို သက်ရောက်စေတဲ့ operations တွေကို `POST` နဲ့ လုပ်သင့်ပါတယ်။ Entry handler ကတော့ `GET` ကို သုံးပါတယ် — ဘာလို့လဲဆိုတော့ CMS preview integration တစ်ခုကို ယူဆထားလို့ပါ: CMS က URL ကို browser tab အသစ်တစ်ခုမှာ ဖွင့်ပေးတာက `GET` request တစ်ခု ဖြစ်လို့ပါ။ အဆင့် 4 ထဲက exit flow ကတော့ ([Server Action](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) `POST` Route Handler ကနေတစ်ဆင့်) `POST` ကို သုံးပါတယ်။

## အဆင့် 1: Route Handler တစ်ခု ဖန်တီးခြင်း (Step 1: Create a Route Handler)

Draft Mode cookie ကို သတ်မှတ်ပေးတဲ့ [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခု ဖန်တီးပါ။ နာမည် ဘာဖြစ်ဖြစ် ရပါတယ် — ဥပမာ `app/api/draft/route.ts` ဆိုပြီး ဖန်တီးနိုင်ပါတယ်။

```ts filename="app/api/draft/route.ts" switcher
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

```js filename="app/api/draft/route.js" switcher
import { draftMode } from 'next/headers'

export async function GET(request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

`draft.enable()` က `__prerender_bypass` ဆိုတဲ့ နာမည်နဲ့ cookie တစ်ခုကို သတ်မှတ်ပါတယ်။ ဒီ cookie ပါတဲ့ နောက်ထပ် requests တွေက အထက်မှာ ဖော်ပြထားတဲ့ cache layers တိုင်းကို ကျော်သွားပါတယ်။

`/api/draft` ကို ဝင်ရောက်ပြီး သင့် browser ရဲ့ developer tools တွေကို ကြည့်ခြင်းဖြင့် ကိုယ်တိုင် စမ်းသပ်ကြည့်နိုင်ပါတယ်။ `Set-Cookie` response header ကို သတိပြုပါ။

ဒီအတိုင်း ရေးထားတဲ့ handler က public ပါ — `/api/draft` ကို ဝင်လာသူတိုင်း ကိုယ့်အတွက် Draft Mode ကို ဖွင့်လိုက်တာပါပဲ။ အဆင့် 2 မှာတော့ shared secret တစ်ခုနဲ့ ဒါကို ပိတ်ပြီး — သင့် CMS ပဲ ခေါ်နိုင်အောင် လုပ်ပါမယ်။

## အဆင့် 2: သင့် Headless CMS ကနေ Route Handler ကို ဝင်ရောက်ခြင်း (Step 2: Access the Route Handler from Your Headless CMS)

> ဒီအဆင့်တွေက သင်သုံးနေတဲ့ headless CMS က **custom draft URLs** သတ်မှတ်ခြင်းကို ထောက်ပံ့တယ်လို့ ယူဆပါတယ်။ မထောက်ပံ့ဘူးဆိုရင်လည်း — သင့် draft URLs တွေကို လုံခြုံအောင် ဒီနည်းလမ်းကိုပဲ သုံးလို့ရပါသေးတယ် — ဒါပေမယ့် draft URL ကို ကိုယ်တိုင် ဆောက်ပြီး ဝင်ရောက်ဖို့တော့ လိုပါလိမ့်မယ်။ တိကျတဲ့ အဆင့်တွေကတော့ သင်ဘယ် headless CMS ကို သုံးနေလဲပေါ် မူတည်ပြီး ကွဲပြားပါလိမ့်မယ်။

သင့် headless CMS ကနေ Route Handler ကို လုံခြုံစွာ ဝင်ရောက်ဖို့:

1. သင်နှစ်သက်ရာ token generator တစ်ခုနဲ့ **secret token string** တစ်ခု ဖန်တီးပါ။ ဒီ secret ကို သင့် Next.js app နဲ့ သင့် headless CMS ပဲ သိပါတယ်။
2. သင့် headless CMS က custom draft URLs သတ်မှတ်ခြင်းကို ထောက်ပံ့ရင် — draft URL တစ်ခု သတ်မှတ်ပါ (ဒါက သင့် Route Handler က `app/api/draft/route.ts` မှာ ရှိတယ်လို့ ယူဆပါတယ်)။ ဥပမာ:

```bash filename="Terminal"
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

> - `<your-site>` က သင့် deployment domain ဖြစ်သင့်ပါတယ်။
> - `<token>` ကို သင်ဖန်တီးထားတဲ့ secret token နဲ့ အစားထိုးသင့်ပါတယ်။
> - `<path>` က သင်ကြည့်ချင်တဲ့ page ရဲ့ path ဖြစ်သင့်ပါတယ်။ `/posts/one` ကို ကြည့်ချင်ရင် — `&slug=/posts/one` လို့ သုံးရပါမယ်။
>
> သင့် headless CMS က draft URL ထဲမှာ variable တစ်ခု ထည့်ခွင့်ပြုတယ်ဆိုရင် — `<path>` ကို CMS ရဲ့ data ပေါ် မူတည်ပြီး ဒီလိုမျိုး dynamic ဖြစ်အောင် သတ်မှတ်နိုင်ပါတယ်: `&slug=/posts/{entry.fields.slug}`

3. သင့် Route Handler ထဲမှာ — secret ကိုက်ညီမှု ရှိမရှိနဲ့ `slug` parameter ရှိမရှိကို စစ်ပါ (မရှိရင် request က fail ဖြစ်သင့်ပါတယ်) — ပြီးရင် `draft.enable()` ကို ခေါ်ပြီး cookie ကို သတ်မှတ်ကာ — browser ကို `slug` မှာ သတ်မှတ်ထားတဲ့ path ဆီ redirect လုပ်ပါ:

```ts filename="app/api/draft/route.ts" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // ဒီ secret ကို ဒီ Route Handler နဲ့ CMS ပဲ သိသင့်ပါတယ်
  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // Draft Mode မဖွင့်ခင် slug က CMS ထဲမှာ တကယ်ရှိမရှိ စစ်ဆေးပါ
  const post = await getPostBySlug(slug)
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  // open redirect vulnerabilities မဖြစ်အောင် searchParams ကမဟုတ်ဘဲ —
  // ရယူထားတဲ့ post ထဲက path ဆီပဲ redirect လုပ်ပါ
  redirect(post.slug)
}
```

```js filename="app/api/draft/route.js" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  const post = await getPostBySlug(slug)
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(post.slug)
}
```

အောင်မြင်ခဲ့ရင် — Draft Mode cookie သတ်မှတ်ပြီးသား အနေနဲ့ browser က target path ဆီ redirect ဖြစ်သွားပါတယ်။

## အဆင့် 3: Draft Content ကို Preview လုပ်ခြင်း (Step 3: Preview the Draft Content)

Draft Mode က cache ကို အလိုအလျောက် bypass လုပ်တာကြောင့် — fresh content တွေ ရရှိဖို့ သင့် page က Draft Mode ဖွင့်ထားလား ဆိုတာ သိစရာ မလိုပါဘူး။ ပုံမှန်အတိုင်းပဲ fetch လုပ်ပါ:

```tsx filename="app/posts/[slug]/page.tsx" switcher
async function getPost(slug: string) {
  const res = await fetch(`https://cms.example.com/posts/${slug}`)
  return res.json()
}

export default async function Page({ params }: PageProps<'/posts/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <main>
      <h1>{post.title}</h1>
      <article>{post.content}</article>
    </main>
  )
}
```

```jsx filename="app/posts/[slug]/page.js" switcher
async function getPost(slug) {
  const res = await fetch(`https://cms.example.com/posts/${slug}`)
  return res.json()
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <main>
      <h1>{post.title}</h1>
      <article>{post.content}</article>
    </main>
  )
}
```

Draft Mode cookie ရှိနေရင် — အထက်က `fetch` က Next.js fetch cache ကို ကျော်ပြီး — လက်ရှိ draft အတွက် သင့် CMS ကို တိုက်ရိုက် သွားပါတယ်။ Cookie မရှိရင်တော့ — အဲဒီ request ကို ပုံမှန်အတိုင်း cache ကနေ ပေးနိုင်ပါတယ်။

သင့် CMS က drafts တွေကို endpoint တစ်ခုတည်းကနေ မပေးဘဲ URL သီးခြားတစ်ခုကနေ ပေးနေရင် — [သင့် CMS က သီးခြား Draft Endpoint သုံးတဲ့အခါ](#when-your-cms-uses-a-separate-draft-endpoint) ကို ကြည့်ပါ။

## အဆင့် 4: Preview Indicator တစ်ခု ပြသခြင်း (Step 4: Show a Preview Indicator)

`isEnabled` က editor ကို အချက်ပြဖို့ အသုံးဝင်ဆုံးပါ — draft content တစ်ခုကို ကြည့်နေကြောင်း အတည်ပြုပေးတဲ့ banner တစ်ခု၊ ပြီးတော့ ထွက်ဖို့ နည်းလမ်းတစ်ခုပါ။ Preview page တိုင်းမှာ ပေါ်နိုင်အောင် သင့် root layout ကနေ indicator တစ်ခုကို render လုပ်ပါ။

```tsx filename="app/preview-banner.tsx" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

async function exitPreview() {
  'use server'
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <aside role="status">
      Preview mode is on.{' '}
      <form action={exitPreview}>
        <button type="submit">Exit preview</button>
      </form>
    </aside>
  )
}
```

```jsx filename="app/preview-banner.js" switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

async function exitPreview() {
  'use server'
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <aside role="status">
      Preview mode is on.{' '}
      <form action={exitPreview}>
        <button type="submit">Exit preview</button>
      </form>
    </aside>
  )
}
```

Draft Mode ကနေ ထွက်တာက `GET` Route Handler တစ်ခုနဲ့လည်း အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် [Server Action](https://nextjs.org/docs/app/getting-started/mutating-data) ကနေတစ်ဆင့် (သို့) `POST` Route Handler တစ်ခုဆီ submit လုပ်တဲ့ form လိုမျိုး — `POST` က semantically ပိုမှန်ကန်ပါတယ်။

`GET` Route Handler ကိုပဲ သုံးမယ်ဆိုရင် — [`<Link>`](/docs/nextjs/component-link) ကနေ မဟုတ်ဘဲ `<form method="GET">` ကနေတစ်ဆင့် trigger လုပ်ပါ။ Next.js က `<Link>` components တွေကို default အနေနဲ့ prefetch လုပ်တာကြောင့် — editor က click မလုပ်ခင်မှာတင် cookie ကို ရှင်းပစ်နိုင်ပါတယ်။ Forms တွေကတော့ method ဘာပဲဖြစ်ဖြစ် prefetch လုပ်မခံရပါဘူး။

## Draft Mode with Cache Components (Cache Components နဲ့ Draft Mode)

[`'use cache'`](/docs/nextjs/use-cache) scope တစ်ခုအတွင်းမှာ `isEnabled` ကို ဖတ်ပြီး — cached component တစ်ခုကနေ preview indicator တစ်ခုကို render လုပ်နိုင်ပါတယ်။ Cache bypass က ဆက်လက် သက်ရောက်နေတာကြောင့် — draft request တိုင်းမှာ component က fresh data တွေနဲ့ ပြန် execute ဖြစ်ပါတယ်။

```tsx filename="app/posts/[slug]/page.tsx" switcher
import { draftMode } from 'next/headers'

async function Post({ slug }: { slug: string }) {
  'use cache'

  const post = await fetch(`https://cms.example.com/posts/${slug}`).then((r) =>
    r.json()
  )
  const { isEnabled } = await draftMode()

  return (
    <article>
      {isEnabled && <p role="status">Draft preview</p>}
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

```jsx filename="app/posts/[slug]/page.js" switcher
import { draftMode } from 'next/headers'

async function Post({ slug }) {
  'use cache'

  const post = await fetch(`https://cms.example.com/posts/${slug}`).then((r) =>
    r.json()
  )
  const { isEnabled } = await draftMode()

  return (
    <article>
      {isEnabled && <p role="status">Draft preview</p>}
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

> **သိထားသင့်သည်:** `draftMode().enable()` နဲ့ `draftMode().disable()` တွေကို caching directive scope တစ်ခုအတွင်းမှာ ခေါ်လို့ မရပါဘူး — Draft Mode ကို [Route Handler](/docs/nextjs/file-conventions-route) (သို့) [Server Action](https://nextjs.org/docs/app/getting-started/mutating-data) ကနေပဲ toggle လုပ်ပါ။

## သင့် CMS က သီးခြား Draft Endpoint သုံးတဲ့အခါ (When Your CMS Uses a Separate Draft Endpoint)

သင့် CMS က draft content တွေကို URL မတူညီတာကနေ ပေးနေရင် (သို့) မတူညီတဲ့ credentials တွေ လိုအပ်ရင် — `isEnabled` ပေါ် မူတည်ပြီး သင့် fetch ကို ခွဲ (branch) လုပ်ပါ:

```tsx filename="app/posts/[slug]/page.tsx" switcher
import { draftMode } from 'next/headers'

async function getPost(slug: string) {
  const { isEnabled } = await draftMode()
  const baseUrl = isEnabled
    ? 'https://cms.example.com/preview'
    : 'https://cms.example.com/published'

  const res = await fetch(`${baseUrl}/posts/${slug}`)
  return res.json()
}
```

```jsx filename="app/posts/[slug]/page.js" switcher
import { draftMode } from 'next/headers'

async function getPost(slug) {
  const { isEnabled } = await draftMode()
  const baseUrl = isEnabled
    ? 'https://cms.example.com/preview'
    : 'https://cms.example.com/published'

  const res = await fetch(`${baseUrl}/posts/${slug}`)
  return res.json()
}
```

Cache bypass က branch နှစ်ခုလုံးမှာ ဆက်လက် သက်ရောက်ပါတယ် — fork က ဘယ်ကနေ ဖတ်ရမလဲ ဆိုတာကိုပဲ ရွေးပေးတာပါ။
