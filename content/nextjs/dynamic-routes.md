---
title: "Dynamic Routes"
description: "[slug] လို dynamic segment တွေ၊ params ကို await နဲ့ ဖတ်နည်း၊ generateStaticParams၊ catch-all [...slug] နဲ့ optional catch-all [[...slug]] — data ကနေ route အများအပြား ဆောက်ခြင်း"
order: 3
source: "https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes"
status: translated
updated: 2026-09-01
---

## Dynamic Segment ဆိုတာ ဘာလဲ

URL path က segment တွေ ဆက်စပ်ထားတာပါ — segment တစ်ခုက **static** (တန်ဖိုး အတိအကျ match ဖြစ်) ဖြစ်နိုင်သလို **dynamic** (URL ကနေ တန်ဖိုး ဖမ်းယူတဲ့ placeholder) လည်း ဖြစ်နိုင်ပါတယ်။ Segment ရဲ့ တန်ဖိုးကို ကြိုမသိရဘူးဆိုရင် folder နာမည်ကို **square bracket** နဲ့ ပတ်ပြီး dynamic segment ဖန်တီးပါတယ် — `[folderName]`။ ဥပမာ blog post တွေအတွက် `app/blog/[slug]/page.tsx` ဆိုရင် `/blog/hello`, `/blog/world` စတဲ့ route တွေ ဖြစ်သွားပါတယ်။

Dynamic segment ရဲ့ ဖမ်းယူလိုက်တဲ့ တန်ဖိုးတွေကို `params` prop အနေနဲ့ — `page`, `layout`, `route`, `generateMetadata` function တွေဆီ ပို့ပေးပါတယ်။

## params ကို ဖတ်နည်း

Next.js 15+ မှာ `params` က **Promise** ဖြစ်ပါတယ် — server component မှာ တန်ဖိုး ရဖို့ `await` လုပ်ရပါတယ်:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

`/blog/hello` ကို request လုပ်ရင် `params` က `{ slug: 'hello' }` ပြန်ပေးပါတယ်။ Client component page မှာဆိုရင် `useParams()` hook (ဒါမှမဟုတ် React ရဲ့ `use()` API) ကို သုံးပါတယ်။

## generateStaticParams — Build Time မှာ ကြိုတင် Generate

`generateStaticParams` function ကို export လုပ်ရင် — build time မှာ route တွေကို **static အနေနဲ့ ကြိုတင် generate** လုပ်ပါတယ်။ Request time မှာ on-demand ဖန်တီးရမယ့်အစား — page တွေကို build လုပ်ချိန်မှာ ကြိုထုတ်ထားလို့ load မြန်ပြီး SEO လည်း ကောင်းပါတယ်:

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

ဒီ function က return လုပ်တဲ့ object တစ်ခုချင်းစီအတွက် page တစ်ခုစီကို build ချိန်မှာ ဖန်တီးပေးပါတယ်။ `generateStaticParams` ထဲက `fetch` request တွေကို deduplicate (တစ်ခါတည်း ပြန်သုံး) လုပ်ပေးလို့ — build time လည်း မြန်ပါတယ်။

## Catch-all Segments [...slug]

`[...folderName]` ပုံစံနဲ့ ရေးရင် — segment အများအပြားကို တစ်ခါတည်း ဖမ်းယူလို့ရပါတယ် (**catch-all**)။ ဥပမာ `app/shop/[...slug]/page.js` က `/shop/a` တင်မက `/shop/a/b`, `/shop/a/b/c` စတာတွေကိုပါ match ဖြစ်ပြီး — `params.slug` က **array** အနေနဲ့ ရပါတယ်:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  // /shop/a/b/c → slug = ['a', 'b', 'c']
  return <div>Shop: {slug.join(' / ')}</div>
}
```

## Optional Catch-all Segments [[...slug]]

Double square bracket `[[...folderName]]` ဆိုရင် — **optional catch-all** ဖြစ်ပြီး param မပါတဲ့ route ကိုပါ match ဖြစ်ပါတယ်။ `app/shop/[[...slug]]/page.js` က `/shop/a`, `/shop/a/b` စတာတွေနဲ့တင် မက — `/shop` တစ်ခုတည်းကိုပါ match ဖြစ်ပြီး အဲဒီအခါ `slug` က `undefined` ဖြစ်ပါတယ်။ Catch-all နဲ့ optional catch-all ရဲ့ တစ်ခုတည်းသော ကွာခြားချက်က ဒါပါပဲ — optional မှာ param မပါတဲ့ route ပါ ပါဝင်တယ်။

## generateMetadata — Metadata ကို Dynamic ဖန်တီးခြင်း

Page တစ်ခုချင်းစီရဲ့ title, description လို metadata တွေကို param ပေါ်မူတည်ပြီး ဖန်တီးချင်ရင် `generateMetadata` ကို export လုပ်ပါတယ် — ဒါကြောင့် SEO မှာ page တစ်ခုစီက title ထူးထူးခြားခြား ရှိပါတယ်:

```tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `Blog: ${slug}`,
  }
}
```

`generateStaticParams` နဲ့ တွဲသုံးရင် build time မှာ metadata ပါ static ဖြစ်ပြီး — [Pages & Layouts](/docs/nextjs/pages-layouts) မှာ ပါတဲ့ folder structure နဲ့ ပေါင်းလိုက်ရင် dynamic blog site အပြည့်အစုံ ဆောက်လို့ရပါပြီ။

## နောက်တစ်ဆင့်တွေ

- [Pages & Layouts](/docs/nextjs/pages-layouts) — layout နဲ့ page တွေရဲ့ အခြေခံ
- [Linking & Navigation](/docs/nextjs/linking) — dynamic route တွေဆီ Link ချိတ်နည်း
- [Data Fetching](/docs/nextjs/data-fetching) — page ထဲမှာ data ယူနည်း
