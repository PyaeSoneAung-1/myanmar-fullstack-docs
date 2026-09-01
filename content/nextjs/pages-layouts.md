---
title: "Pages & Layouts"
description: "page.tsx နဲ့ layout.tsx ရဲ့ အခန်းကဏ္ဍ၊ root layout (html/body) လိုအပ်ချက်၊ nested layout တွေနဲ့ folder structure — App Router ရဲ့ layout စနစ်"
order: 2
source: "https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts"
status: translated
updated: 2026-09-01
---

## Page ဆိုတာ ဘာလဲ

**Page** ဆိုတာ — သတ်မှတ်ထားတဲ့ route တစ်ခုမှာ render လုပ်ပေးတဲ့ UI ပါ။ Page တစ်ခု ဖန်တီးဖို့ `app` folder ထဲမှာ `page.tsx` file တစ်ခု ထည့်ပြီး React component တစ်ခုကို **default export** လုပ်ရပါတယ်။ ဥပမာ — home page (`/`) အတွက် `app/page.tsx` မှာ:

```tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

Next.js က **file-system based routing** ကို သုံးပါတယ် — folder က URL segment တစ်ခုကို ကိုယ်စားပြုပြီး file (`page`, `layout`) တွေက အဲဒီ segment အတွက် UI ကို သတ်မှတ်ပါတယ်။ `app/about/page.tsx` ဆိုရင် `/about` route ဖြစ်သွားပြီး — route တစ်ခုစီမှာ **page တစ်ခုပဲ ရှိရပါတယ်** (page က leaf route ဖြစ်လို့)။

## Layout ဆိုတာ ဘာလဲ

**Layout** ဆိုတာ — page အများအပြားကြားမှာ **share လုပ်ထားတဲ့ UI** ပါ။ Navigation လုပ်တဲ့အခါ layout တွေက state ကို ဆက်ထိန်းထားပြီး interactive ဖြစ်နေတုန်းပဲ — **ပြန်လည် render မလုပ်ပါဘူး**။ Layout ကို `layout.tsx` file ကနေ default export လုပ်ပြီး `children` prop ကို လက်ခံရပါတယ် — `children` ထဲမှာ page (သို့) နောက် nested layout တစ်ခု ဝင်ပါတယ်။

## Root Layout — html နဲ့ body

`app` folder ရဲ့ အမြစ်မှာ ရှိတဲ့ layout ကို **root layout** လို့ ခေါ်ပြီး — **မဖြစ်မနေ လိုအပ်ပါတယ်**။ Root layout မှာ `<html>` နဲ့ `<body>` tag နှစ်ခုလုံး ပါဝင်ရမယ်။ `create-next-app` က ဒါကို ကြိုတင် ဖန်တီးပေးထားပါတယ်:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI — page တွေအားလုံးမှာ ထပ်တူ ပါမယ့် အပိုင်း */}
        {/* children ကို page (သို့) nested layout ပြချင်တဲ့ နေရာမှာ ထားပါ */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

## Nested Routes — Folder Structure

Nested route ဆိုတာ URL segment အများအပြား ပေါင်းစပ်ထားတဲ့ route ပါ။ ဥပမာ `/blog/[slug]` ဆိုတာ `/` (root), `blog`, `[slug]` ဆိုပြီး segment သုံးခု ပါဝင်ပါတယ်။ Folder တွေကို အထပ်လိုက် ထည့်ရုံနဲ့ nested route တွေ ဖြစ်သွားပါတယ်:

```
app/
├── layout.tsx       # root layout (html/body)
├── page.tsx         # route: /
├── blog/
│   ├── layout.tsx   # /blog အတွက် layout
│   ├── page.tsx     # route: /blog
│   └── [slug]/
│       └── page.tsx # route: /blog/hello (dynamic)
└── about/
    └── page.tsx     # route: /about
```

`[slug]` လို square bracket နဲ့ ရေးထားတဲ့ folder က **dynamic route segment** ဖြစ်ပြီး — data ကနေ page အများအပြား ဖန်တီးဖို့ သုံးပါတယ် (ဥပမာ blog post တစ်ပုဒ်ချင်းစီအတွက် page)။

## Nested Layouts — Layout တွေ အလွှာလိုက် ထပ်ခြင်း

Layout တွေက folder အနေအထားအလိုက် **အလွှာလိုက် ထပ်ပြီး** — child layout ကို parent layout ရဲ့ `children` ထဲမှာ ပတ်ထားပါတယ်။ ဥပမာ `/blog` route အတွက် `app/blog/layout.tsx`:

```tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

ဒါဆိုရင် root layout က blog layout ကို ပတ်ပြီး — blog layout က `app/blog/page.tsx` နဲ့ `app/blog/[slug]/page.tsx` တို့ကို ပတ်ပါတယ်။ Page တွေက leaf route ဖြစ်လို့ layout က page ကို ပတ်တာပဲ ရှိပြီး — page က နောက် page တစ်ခုကို မပတ်နိုင်ပါဘူး။ Navigation လုပ်တဲ့အခါ **shared layout တွေက မပြောင်းလဲဘဲ ကျန်နေပြီး** page ရဲ့ အကြောင်းအရာပဲ ပြောင်းပါတယ် — ဒါကြောင့် nav bar, sidebar လို အရာတွေက navigation တိုင်းမှာ ပြန်မဆွဲဘဲ အလုပ်လုပ်နေပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Next.js စတင်ခြင်း](/docs/nextjs/getting-started) — App Router အခြေခံ မရသေးရင် အရင်ဖတ်ပါ
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — `[slug]` လို dynamic segment တွေ ဆက်လေ့လာပါ
- [Linking & Navigation](/docs/nextjs/linking) — page တွေကြား ဘယ်လို သွားလာမလဲ
