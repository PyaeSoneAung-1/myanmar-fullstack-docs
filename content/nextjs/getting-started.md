---
title: "Next.js စတင်ခြင်း"
description: "Next.js ဆိုတာ ဘာလဲ၊ ဘယ်လို install လုပ်မလဲ၊ App Router အခြေခံ — React framework နဲ့ စတင်မယ်"
order: 1
source: "https://nextjs.org/docs/app/getting-started/installation"
status: translated
updated: 2026-09-01
---

## Next.js ဆိုတာ ဘာလဲ

**Next.js** က production-ready fullstack React framework တစ်ခုပါ။ React ကိုယ်တိုင်က
UI ဆွဲဖို့ library သက်သက်ဖြစ်ပြီး — routing, server-side rendering, performance
optimization, data fetching စတဲ့ အရာတွေကို ကိုယ်တိုင်စီစဉ်ရပါတယ်။ Next.js က
အဲဒါတွေအားလုံးကို **framework level မှာ အဆင်သင့် ပေးထားပါတယ်**။

Next.js ရဲ့ ထူးခြားချက်တွေကတော့:

- **App Router** — file-based routing စနစ်။ `app/` folder ထဲက file ပုံစံအတိုင်း
  route တွေ အလိုအလျောက် ဖြစ်သွားတယ်
- **Server & Client Components** — component တစ်ခုချင်းစီကို server မှာ
  render လုပ်မလား client မှာလား ရွေးလို့ရတယ်
- **Built-in optimization** — image, font, SEO metadata စတာတွေကို အလွယ်တကူ
- **API routes** — React ထဲမှာတင် backend endpoint တွေပါ ရေးလို့ရတယ်
- **Fullstack** — frontend + backend (API) + database ကို project တစ်ခုတည်းမှာ

## Installation

Next.js ကို `create-next-app` နဲ့ စတင်နိုင်ပါတယ်။ Node.js 18.18+ (သို့) ဒီထက်နောက်ကျတဲ့
version လိုအပ်ပါတယ်:

```bash
npx create-next-app@latest my-app
```

Command run လုပ်ရင် TypeScript, ESLint, Tailwind CSS သုံးမလား စတဲ့ မေးခွန်းတွေ
လာပါလိမ့်မယ်။ အသစ်စသူဆိုရင် အကြံပြုထားတဲ့ default တွေကို ရွေးလိုက်ရုံပါပဲ။

```bash
cd my-app
npm run dev
```

ဒါဆိုရင် `http://localhost:3000` မှာ development server တက်လာပါမယ်။

## Project Structure

`create-next-app` ဖန်တီးပေးတဲ့ ဖိုင်တွေထဲက အဓိက နေရာတွေကတော့:

```
my-app/
├── app/                # App Router — route တွေ ဒီမှာ သတ်မှတ်
│   ├── layout.tsx      # အဖွဲ့အစည်းတစ်ခုလုံးအတွက် shared layout
│   └── page.tsx        # Home page (route: /)
├── public/             # Static assets (images, fonts…)
└── package.json        # Dependencies နဲ့ scripts
```

### File-based Routing ဆိုတာ

`app/` folder ထဲက file တွေက route တွေကို ကိုယ်စားပြုပါတယ်:

- `app/page.tsx` → `/` route
- `app/about/page.tsx` → `/about` route
- `app/blog/[id]/page.tsx` → `/blog/1`, `/blog/2` စသဖြင့် (dynamic route)

Route တစ်ခုစီအတွက် folder တစ်ခုစီ ဖန်တီးပြီး အဲဒီထဲမှာ `page.tsx` ထည့်ရင်
route အသစ် အလိုအလျောက် ဖြစ်သွားပါတယ်။

## Page တစ်ခု ရေးကြည့်မယ်

`app/page.tsx` ထဲမှာ React component တစ်ခုကို export လုပ်ရင် အဲဒါက page ဖြစ်သွားပါတယ်:

```tsx
export default function Home() {
  return (
    <main>
      <h1>မင်္ဂလာပါ Next.js</h1>
      <p>ဒါက ပထမဆုံး page ပါ။</p>
    </main>
  );
}
```

## Server vs Client Component

Next.js App Router မှာ component တိုင်းက **default အားဖြင့် server component**
ဖြစ်ပါတယ် — server မှာ render လုပ်ပြီး HTML အနေနဲ့ client ကို ပို့ပါတယ်။
ဒါကြောင့် performance ကောင်းပြီး, database လို server-only အရာတွေကို
တိုက်ရိုက်သုံးလို့ရပါတယ်။

User interaction (button click, useState, useEffect) လိုအပ်ရင် component ရဲ့
ထိပ်ဆုံးမှာ `"use client"` ဆိုပြီး ကြေညာလိုက်ရင် client component
ဖြစ်သွားပါတယ်:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Production Build

ဖွံ့ဖြိုးပြီးရင် production အတွက် build လုပ်ဖို့:

```bash
npm run build    # production build
npm run start    # build ထားတဲ့ app ကို run လုပ်ရန်
```

`next build` က code ကို optimize လုပ်ပြီး static page တွေကို ကြိုတင်
render လုပ်ပေးပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [React မိတ်ဆက်](/docs/react/getting-started) — React အခြေခံ မရသေးရင် အရင်ဖတ်ပါ
- [Pages & Layouts](/docs/nextjs/pages-layouts) — page နဲ့ layout တွေ ဘယ်လို အလုပ်လုပ်သလဲ
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — `[slug]` လို dynamic route တွေ
- [Linking & Navigation](/docs/nextjs/linking) — page တွေကြား navigation
- [Data Fetching](/docs/nextjs/data-fetching) — data ယူနည်းတွေ
- [Route Handlers (API)](/docs/nextjs/route-handlers) — API endpoint တွေ ဆောက်နည်း
