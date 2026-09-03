---
title: "Scripts (third-party scripts များကို load/optimize လုပ်ခြင်း)"
description: "`next/script` ရဲ့ Script component နဲ့ third-party scripts တွေကို load လုပ်ပြီး optimize လုပ်နည်း — layout/application scripts, strategy, web worker သို့ လွှဲပြောင်းခြင်း, inline scripts, event handlers, additional attributes"
order: 231
source: "https://nextjs.org/docs/app/guides/scripts"
status: translated
updated: 2026-09-03
---

### Layout Scripts (layout ထဲမှာ scripts ထည့်ခြင်း)

Routes အများကြီးအတွက် third-party script တစ်ခုကို load လုပ်ဖို့ — `next/script` ကို import လုပ်ပြီး script ကို သင့် layout component ထဲမှာ တိုက်ရိုက် ထည့်ပါ:

```tsx filename="app/dashboard/layout.tsx" switcher
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
import Script from 'next/script'

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

Third-party script ကို — user က အဲဒီ folder route (ဥပမာ `dashboard/page.js`) (သို့) nested route တစ်ခုခု (ဥပမာ `dashboard/settings/page.js`) ကို ဝင်ကြည့်တဲ့အခါ fetch လုပ်ပါတယ်။ Next.js က — user က layout တစ်ခုတည်းထဲက routes အများကြီးကြားမှာ သွားလာနေရင်တောင် — script ကို **တစ်ကြိမ်ပဲ** load လုပ်ကြောင်း သေချာစေပါတယ်။

### Application Scripts (app တစ်ခုလုံးအတွက် scripts)

Routes အားလုံးအတွက် third-party script တစ်ခုကို load လုပ်ဖို့ — `next/script` ကို import လုပ်ပြီး script ကို သင့် root layout ထဲမှာ တိုက်ရိုက် ထည့်ပါ:

```tsx filename="app/layout.tsx" switcher
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

ဒီ script က သင့် application ထဲက route _တစ်ခုခုကို_ ဝင်ကြည့်လိုက်တာနဲ့ load ဖြစ်ပြီး execute လုပ်ပါလိမ့်မယ်။ Next.js က — user က pages အများကြီးကြားမှာ သွားလာနေရင်တောင် — script ကို **တစ်ကြိမ်ပဲ** load လုပ်ကြောင်း သေချာစေပါတယ်။

> **အကြံပြုချက်:** Performance အပေါ် မလိုအပ်တဲ့ သက်ရောက်မှုတွေ အနည်းဆုံး ဖြစ်အောင် — third-party scripts တွေကို သီးခြား pages (သို့) layouts တွေထဲမှာပဲ ထည့်ဖို့ အကြံပြုပါတယ်။

### Strategy (loading မဟာဗျူဟာ)

`next/script` ရဲ့ default အပြုအမူက third-party scripts တွေကို page (သို့) layout တိုင်းမှာ load လုပ်ခွင့် ပေးပေမယ့် — `strategy` property ကို သုံးပြီး loading အပြုအမူကို ပိုပြီး ချိန်ညှိနိုင်ပါတယ်:

- `beforeInteractive`: Next.js code ဘာမှ မလုပ်ခင်၊ page hydration မစတင်ခင် script ကို load လုပ်ပါတယ်။
- `afterInteractive`: (**default**) Script ကို စောစော load လုပ်ပေမယ့် — page ပေါ်မှာ hydration နည်းနည်း ဖြစ်ပြီးမှပါ။
- `lazyOnload`: Script ကို browser ရဲ့ idle time မှာ နောက်မှ load လုပ်ပါတယ်။
- `worker`: (experimental) Script ကို web worker တစ်ခုထဲမှာ load လုပ်ပါတယ်။

Strategy တစ်ခုချင်းစီနဲ့ သူတို့ရဲ့ use cases တွေအကြောင်း အသေးစိတ်ကို [`next/script`](/docs/nextjs/component-script) API reference documentation မှာ ကြည့်ပါ။

### Scripts တွေကို Web Worker တစ်ခုဆီ လွှဲပြောင်းခြင်း (experimental)

> **သတိပေးချက်:** `worker` strategy က တည်ငြိမ် (stable) မဖြစ်သေးဘဲ — App Router နဲ့လည်း လောလောဆယ် အလုပ်မလုပ်သေးပါဘူး။ သတိထားပြီး သုံးပါ။

`worker` strategy သုံးထားတဲ့ scripts တွေကို [Partytown](https://partytown.qwik.dev/) နဲ့အတူ web worker တစ်ခုထဲမှာ လွှဲပြောင်း လုပ်ဆောင်ပါတယ်။ ဒါက main thread ကို သင့် application code ရဲ့ ကျန် အစိတ်အပိုင်းတွေအတွက် သီးသန့် ထားပေးလို့ — သင့် site ရဲ့ performance ကို တိုးတက်စေနိုင်ပါတယ်။

ဒီ strategy က experimental ဖြစ်နေဆဲ ဖြစ်ပြီး — `next.config.js` ထဲမှာ `nextScriptWorkers` flag ကို enable လုပ်ထားမှသာ သုံးလို့ရပါတယ်:

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

ပြီးရင် — development server ကို run လုပ်ပါ။ Setup ပြီးမြောက်ဖို့ လိုအပ်တဲ့ packages တွေ install လုပ်တာကို Next.js က သင့်ကို လမ်းညွှန်ပေးပါလိမ့်မယ်:

```bash package="pnpm"
pnpm dev
```

```bash package="npm"
npm run dev
```

```bash package="yarn"
yarn dev
```

```bash package="bun"
bun dev
```

ဒီလိုမျိုး ညွှန်ကြားချက်တွေ တွေ့ရပါလိမ့်မယ် — Please install Partytown by running `npm install @qwik.dev/partytown`

Setup ပြီးတာနဲ့ — `strategy="worker"` ကို သတ်မှတ်လိုက်ရင် သင့် application ထဲမှာ Partytown ကို အလိုအလျောက် instantiate လုပ်ပြီး — script ကို web worker တစ်ခုဆီ လွှဲပြောင်းပေးပါလိမ့်မယ်။

```tsx filename="pages/home.tsx" switcher
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

```jsx filename="pages/home.js" switcher
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

Web worker တစ်ခုထဲမှာ third-party script တစ်ခုကို load လုပ်တဲ့အခါ — ထည့်သွင်း စဉ်းစားရမယ့် trade-offs (အားသာချက်/အားနည်းချက် လဲလှယ်မှုများ) အများကြီး ရှိပါတယ်။ အသေးစိတ်အတွက် Partytown ရဲ့ [tradeoffs](https://partytown.qwik.dev/trade-offs) documentation ကို ကြည့်ပါ။

### Inline Scripts (page ထဲမှာ တိုက်ရိုက် ရေးသော scripts)

External file တစ်ခုကနေ load လုပ်တာမဟုတ်ဘဲ — ရေးထားတဲ့ inline scripts တွေကိုလည်း Script component က support လုပ်ပါတယ်။ JavaScript ကို curly braces တွေထဲမှာ ထည့်ပြီး ရေးလို့ရပါတယ်:

```jsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

ဒါမှမဟုတ် — `dangerouslySetInnerHTML` property ကို သုံးပြီးလည်း ရေးလို့ရပါတယ်:

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **သတိပေးချက်:** Inline scripts တွေအတွက် — Next.js က script ကို track လုပ်ပြီး optimize လုပ်နိုင်ဖို့ `id` property တစ်ခု သတ်မှတ်ပေးရပါမယ်။

### နောက်ထပ် Code တွေ Execute လုပ်ခြင်း

Event handlers တွေကို Script component နဲ့ သုံးပြီး — event တစ်ခု ဖြစ်ပွားပြီးနောက် နောက်ထပ် code တွေကို execute လုပ်နိုင်ပါတယ်:

- `onLoad`: Script load လုပ်ပြီးသွားပြီးနောက် code execute လုပ်ပါတယ်။
- `onReady`: Script load လုပ်ပြီးနောက် ရော — component ကို mount လုပ်တိုင်းမှာပါ code execute လုပ်ပါတယ်။
- `onError`: Script load လုပ်ဖို့ မအောင်မြင်ရင် code execute လုပ်ပါတယ်။

ဒီ handlers တွေက — `next/script` ကို ပထမဆုံး code line အနေနဲ့ `"use client"` သတ်မှတ်ထားတဲ့ [Client Component](/docs/nextjs/server-client-components) တစ်ခုထဲမှာ import လုပ်ပြီး သုံးထားမှသာ အလုပ်လုပ်ပါတယ်:

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

Event handler တစ်ခုချင်းစီအကြောင်း အသေးစိတ်နဲ့ ဥပမာတွေ ကြည့်ဖို့ [`next/script`](/docs/nextjs/component-script) API reference ကို ကိုးကားပါ။

### နောက်ထပ် Attributes များ

`<script>` element တစ်ခုမှာ သတ်မှတ်လို့ရတဲ့ — Script component က သူ့ဘာသာ မသုံးတဲ့ DOM attributes အများကြီး ရှိပါတယ် — [`nonce`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce) (သို့) [custom data attributes](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/data-*) လိုမျိုးပါ။ နောက်ထပ် attributes တွေ ထည့်လိုက်ရင် — HTML ထဲမှာ ပါဝင်မယ့် နောက်ဆုံး၊ optimize လုပ်ထားတဲ့ `<script>` element ဆီကို အလိုအလျောက် forward လုပ်ပေးပါတယ်။

```tsx filename="app/page.tsx" switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```
