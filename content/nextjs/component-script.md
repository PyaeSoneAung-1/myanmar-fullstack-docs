---
title: "script"
description: "Script component (next/script) — third-party scripts တွေကို optimize လုပ်ခြင်း; src, strategy (beforeInteractive, afterInteractive, lazyOnload, worker), onLoad, onReady, onError props များ"
order: 71
source: "https://nextjs.org/docs/app/api-reference/components/script"
status: translated
updated: 2026-09-02
---

ဒီ API reference က Script Component အတွက် ရရှိနိုင်တဲ့ [props](#props) တွေကို ဘယ်လို အသုံးပြုရမလဲ နားလည်စေဖို့ ကူညီပေးပါတယ်။ Features တွေနဲ့ အသုံးပြုပုံ (usage) အပြည့်အစုံအတွက်တော့ — [Optimizing Scripts](https://nextjs.org/docs/app/guides/scripts) page ကို ကြည့်ပါ။

```tsx filename="app/dashboard/page.tsx" switcher
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

## Props

ဒီမှာ Script Component အတွက် ရရှိနိုင်တဲ့ props တွေရဲ့ အကျဉ်းချုပ် ဖြစ်ပါတယ်:

| Prop                    | Example                           | Type     | Required                              |
| ----------------------- | --------------------------------- | -------- | ------------------------------------- |
| [`src`](#src)           | `src="http://example.com/script"` | String   | Required unless inline script is used |
| [`strategy`](#strategy) | `strategy="lazyOnload"`           | String   | -                                     |
| [`onLoad`](#onload)     | `onLoad={onLoadFunc}`             | Function | -                                     |
| [`onReady`](#onready)   | `onReady={onReadyFunc}`           | Function | -                                     |
| [`onError`](#onerror)   | `onError={onErrorFunc}`           | Function | -                                     |

## Required Props

`<Script />` component က အောက်ပါ properties တွေ မဖြစ်မနေ လိုအပ်ပါတယ်။

### `src`

External script တစ်ခုရဲ့ URL ကို သတ်မှတ်ပေးတဲ့ path string တစ်ခုပါ။ Absolute external URL (ပြင်ပ URL အပြည့်အစုံ) (သို့) internal path (အတွင်းပိုင်း လမ်းကြောင်း) ဖြစ်နိုင်ပါတယ်။ Inline script သုံးတာမဟုတ်ရင် `src` property က မဖြစ်မနေ လိုအပ်ပါတယ်။

## Optional Props

`<Script />` component က မဖြစ်မနေ လိုအပ်တာတွေအပြင် — နောက်ထပ် properties တစ်ချို့ကိုလည်း လက်ခံပါတယ်။

### `strategy`

Script ရဲ့ loading strategy (တင်ဆောင်မှု နည်းလမ်း) ဖြစ်ပါတယ်။ သုံးလို့ရတဲ့ strategies လေးမျိုး ရှိပါတယ်:

- `beforeInteractive`: Next.js code တစ်ခုခု မတိုင်ခင် ရော page hydration မဖြစ်ခင်မှာပဲ load လုပ်ပါတယ်။
- `afterInteractive`: (**default**) စောစော load လုပ်ပေမယ့် — page ပေါ်မှာ hydration တစ်ချို့ ဖြစ်ပြီးမှပါ။
- `lazyOnload`: Browser ရဲ့ idle (အလုပ်မရှိ) အချိန်မှာ load လုပ်ပါတယ်။
- `worker`: (experimental) Web worker တစ်ခုထဲမှာ load လုပ်ပါတယ်။

### `beforeInteractive`

`beforeInteractive` strategy နဲ့ load လုပ်တဲ့ scripts တွေကို server ကနေ initial HTML ထဲ inject လုပ်ပြီး — Next.js module တစ်ခုခု မတိုင်ခင် download လုပ်ကာ — ထားရှိထားတဲ့ အစဉ်အတိုင်း execute လုပ်ပါတယ်။

ဒီ strategy နဲ့ သတ်မှတ်ထားတဲ့ scripts တွေကို first-party code တစ်ခုခု မတိုင်ခင်မှာ preload လုပ်ပြီး fetch လုပ်ပေမယ့် — သူတို့ရဲ့ execution က **page hydration ဖြစ်တာကို မတားဆီးပါဘူး**။

`beforeInteractive` strategy သုံးတဲ့ scripts တွေကို [root layout](/docs/nextjs/file-conventions-layout#root-layout) — ဥပမာ `app/layout.tsx` (သို့) `app/[locale]/layout.tsx` — တစ်ခုအတွင်းမှာ ထားရပါမယ်။ ဒါတွေက site တစ်ခုလုံးအတွက် လိုအပ်တဲ့ scripts တွေကို load လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားတာပါ (ဆိုလိုတာက — application ထဲက ဘယ် page ကို မဆို server-side မှာ load လုပ်ပြီးတာနဲ့ script က load ဖြစ်မှာပါ)။

**ဒီ strategy ကို — တတ်နိုင်သမျှ မြန်မြန် fetch လုပ်ဖို့ လိုအပ်တဲ့ critical scripts တွေအတွက်ပဲ သုံးသင့်ပါတယ်။**

```tsx filename="app/layout.tsx" switcher
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

> **သိထားသင့်သည်:** `beforeInteractive` သုံးထားတဲ့ scripts တွေကို component ထဲမှာ ဘယ်နေရာမှာ ထားထားပါစေ — HTML document ရဲ့ `head` ထဲမှာပဲ အမြဲ inject လုပ်ပါလိမ့်မယ်။

> **သိထားသင့်သည်:** ဒီ scripts တွေက document load တစ်ခါ ဖြစ်တိုင်း run တစ်ခါပဲ လုပ်ပါတယ်။ Client-side navigation တစ်ခုက — root param တစ်ခုပဲ ပြောင်းတဲ့ `/en` ကနေ `/fi` ကို သွားတာမျိုးတောင် — သူတို့ကို နောက်တစ်ခါ ပြန် run စေမှာ မဟုတ်ပါဘူး။ ဘာလို့လဲဆိုတော့ root layout က အတူတူပဲ ဆက်ရှိနေလို့ပါ။

`beforeInteractive` နဲ့ တတ်နိုင်သမျှ မြန်မြန် fetch လုပ်သင့်တဲ့ scripts တွေရဲ့ ဥပမာတချို့:

- Bot detectors (bot ရှာဖွေစစ်ဆေးသူများ)
- Cookie consent managers (cookie ခွင့်ပြုချက် စီမံသူများ)

### `afterInteractive`

`afterInteractive` strategy သုံးတဲ့ scripts တွေကို HTML ထဲ client-side မှာ inject လုပ်ပြီး — page ပေါ်မှာ hydration တစ်ချို့ (သို့) အားလုံး ဖြစ်ပြီးမှ load လုပ်ပါတယ်။ ဒါက Script component ရဲ့ **default strategy** ဖြစ်ပြီး — တတ်နိုင်သမျှ မြန်မြန် load ဖို့ လိုအပ်ပေမယ့် first-party Next.js code တစ်ခုခုရဲ့ ရှေ့မှာ မလိုအပ်တဲ့ scripts တွေအတွက် သုံးသင့်ပါတယ်။

`afterInteractive` scripts တွေကို page (သို့) layout တစ်ခုခုထဲမှာ ထားနိုင်ပြီး — အဲဒီ page (သို့) page အုပ်စုကို browser ထဲမှာ ဖွင့်လိုက်မှသာ load လုပ်ပြီး execute ဖြစ်ပါတယ်။

```jsx filename="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

`afterInteractive` အတွက် သင့်တော်တဲ့ ရွေးချယ်မှု ဥပမာတချို့:

- Tag managers
- Analytics

### `lazyOnload`

`lazyOnload` strategy သုံးတဲ့ scripts တွေကို browser ရဲ့ idle အချိန်မှာ HTML ထဲ client-side အနေနဲ့ inject လုပ်ပြီး — page ပေါ်က resources အားလုံး fetch လုပ်ပြီးမှ load လုပ်ပါတယ်။ ဒီ strategy ကို စောစော load လုပ်စရာ မလိုတဲ့ background (နောက်ခံ) (သို့) ဦးစားပေးမှု နည်းတဲ့ (low priority) scripts တွေအတွက် သုံးသင့်ပါတယ်။

`lazyOnload` scripts တွေကို page (သို့) layout တစ်ခုခုထဲမှာ ထားနိုင်ပြီး — အဲဒီ page (သို့) page အုပ်စုကို browser ထဲမှာ ဖွင့်လိုက်မှသာ load လုပ်ပြီး execute ဖြစ်ပါတယ်။

```jsx filename="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

ချက်ချင်း load လုပ်စရာ မလိုဘဲ `lazyOnload` နဲ့ fetch လုပ်လို့ရတဲ့ scripts တွေရဲ့ ဥပမာတချို့:

- Chat support plugins (chat အကူအညီ ပလပ်အင်များ)
- Social media widgets (လူမှုကွန်ရက် ဝစ်ဂျက်များ)

### `worker`

> **သတိပေးချက် (Warning):** `worker` strategy က မတည်ငြိမ်သေးပါဘူး — App Router နဲ့လည်း လက်ရှိမှာ အလုပ်မလုပ်သေးပါဘူး။ သတိထားပြီးမှ သုံးပါ။

`worker` strategy သုံးတဲ့ scripts တွေကို web worker တစ်ခုထဲ ရွှေ့ထားလိုက်လို့ — main thread ကို လွတ်ကင်းစေပြီး — critical ဖြစ်တဲ့ first-party resources တွေကိုပဲ အဲဒီမှာ လုပ်ဆောင်ဖို့ သေချာစေပါတယ်။ ဒီ strategy ကို ဘယ် script အတွက်မဆို သုံးလို့ရနိုင်ပေမယ့် — third-party scripts တိုင်းကို ထောက်ပံ့ဖို့ အာမခံထားတဲ့ဟာ မဟုတ်တဲ့ အဆင့်မြင့် (advanced) အသုံးပြုမှု တစ်ခုပါ။

`worker` strategy ကို သုံးဖို့ — `next.config.js` ထဲမှာ `nextScriptWorkers` flag ကို ဖွင့်ပေးရပါမယ်:

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

`worker` scripts တွေကို လက်ရှိမှာ **`pages/` directory ထဲမှာပဲ** သုံးလို့ရပါတယ်:

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

### `onLoad`

> **သတိပေးချက် (Warning):** `onLoad` က Server Components တွေနဲ့ လက်ရှိမှာ အလုပ်မလုပ်သေးဘဲ Client Components တွေမှာပဲ သုံးလို့ရပါတယ်။ နောက်ပြီး — `onLoad` ကို `beforeInteractive` နဲ့ တွဲသုံးလို့ မရပါဘူး — အဲဒီအစား `onReady` ကို သုံးဖို့ စဉ်းစားပါ။

Third-party scripts တချို့က — script load ပြီးစီးပြီးမှ content တစ်ခုခုကို စတင်ဖို့ (သို့) function တစ်ခုခု ခေါ်ဆိုဖို့ JavaScript code တွေ run လုပ်ဖို့ လိုအပ်ပါတယ်။ `afterInteractive` (သို့) `lazyOnload` loading strategy တစ်ခုခုနဲ့ script တစ်ခုကို load လုပ်နေရင် — `onLoad` property ကို သုံးပြီး သူ load ပြီးတာနဲ့ code တွေ execute လုပ်နိုင်ပါတယ်။

Library load ပြီးမှသာ lodash method တစ်ခုကို execute လုပ်တဲ့ ဥပမာ ဒီမှာ ကြည့်ပါ။

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
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
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
        }}
      />
    </>
  )
}
```

### `onReady`

> **သတိပေးချက် (Warning):** `onReady` က Server Components တွေနဲ့ လက်ရှိမှာ အလုပ်မလုပ်သေးဘဲ Client Components တွေမှာပဲ သုံးလို့ရပါတယ်။

Third-party scripts တချို့က — script က load ပြီးစီးတဲ့အခါတိုင်း ရော component ကို mount လုပ်တဲ့အခါတိုင်းပါ (ဥပမာ — route navigation တစ်ခု ပြီးနောက်) JavaScript code တွေ run လုပ်ဖို့ လိုအပ်ပါတယ်။ `onReady` property ကို သုံးပြီး — script ပထမဆုံး load ဖြစ်တဲ့အခါ သူ့ရဲ့ load event ပြီးနောက် ရော နောက်ပိုင်း component re-mount တိုင်းမှာပါ code တွေ execute လုပ်နိုင်ပါတယ်။

Component ကို mount လုပ်တိုင်း Google Maps JS embed တစ်ခုကို ပြန်လည် စတင်ပေးတဲ့ ဥပမာ ဒီမှာ ကြည့်ပါ:

```tsx filename="app/page.tsx" switcher
'use client'

import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

### `onError`

> **သတိပေးချက် (Warning):** `onError` က Server Components တွေနဲ့ လက်ရှိမှာ အလုပ်မလုပ်သေးဘဲ Client Components တွေမှာပဲ သုံးလို့ရပါတယ်။ `onError` ကို `beforeInteractive` loading strategy နဲ့ တွဲသုံးလို့ မရပါဘူး။

Script တစ်ခု load မဖြစ်တဲ့အခါ ဖမ်းယူဖို့ (catch) တစ်ခါတစ်ရံ အသုံးဝင်ပါတယ်။ ဒီလို errors တွေကို `onError` property နဲ့ ကိုင်တွယ်နိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
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
        onError={(e) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

## Version History

| Version   | အပြောင်းအလဲ                                                                          |
| --------- | ------------------------------------------------------------------------------------- |
| `v13.0.0` | `beforeInteractive` နဲ့ `afterInteractive` တွေကို `app` ကို ထောက်ပံ့နိုင်အောင် ပြုပြင်ခဲ့။ |
| `v12.2.4` | `onReady` prop ထည့်သွင်း။                                                            |
| `v12.2.2` | `beforeInteractive` ပါတဲ့ `next/script` ကို `_document` ထဲမှာ ထားခွင့်ပြုခဲ့။        |
| `v11.0.0` | `next/script` စတင် မိတ်ဆက်။                                                          |
