---
title: "Preventing Flash Before Hydration (hydration မဖြစ်မီ flash ကို ကာကွယ်ခြင်း)"
description: "Server-rendered HTML ကို browser မှာ ပထမဆုံး paint မဖြစ်ခင်ကတည်းက ပြုပြင်ပြီး — locale, time zone, theme, persisted UI state တွေကြောင့် ဖြစ်တဲ့ visible flash (မြင်သာတဲ့ မှိတ်တုတ် ပြောင်းလဲမှု) နဲ့ hydration errors တွေကို inline script နဲ့ ရှောင်ရှားနည်း"
order: 236
source: "https://nextjs.org/docs/app/guides/preventing-flash-before-hydration"
status: translated
updated: 2026-09-03
---

User preferences (သုံးစွဲသူရဲ့ ဦးစားပေးရွေးချယ်မှုများ), browser settings နဲ့ client-side storage တွေက server rendering (ဆာဗာဘက်မှ render လုပ်ခြင်း) အတွင်းမှာ မရနိုင်ပါဘူး။ Server က သင့်တင့်လုံလောက်တဲ့ default တန်ဖိုးတစ်ခုကို ထုတ်ပေးပါတယ် — ဒါပေမယ့် client-only state (locale, time zone, theme, သိမ်းဆည်းထားတဲ့ interactions) ပေါ်မှာ မှီခိုနေတဲ့ UI ဘယ်ဟာမဆို — user မမြင်ရခင် update လုပ်ပြီးသား ဖြစ်ဖို့ လိုပါတယ်။

ဒီပြဿနာအတွက် အသုံးများတဲ့ ချဉ်းကပ်နည်းတချို့ကတော့:

- Client တန်ဖိုးတွေနဲ့ ပြန် render လုပ်တဲ့ Client Component တစ်ခုက hydration error ဖြစ်စေပါတယ်။
- `useEffect` ဆီ ရွှေ့ဆိုင်းလိုက်တာက error ကို ရှောင်ပေးပေမယ့် — visible flash (မြင်သာတဲ့ မှိတ်တုတ် ပြောင်းလဲမှု) တစ်ခု ဖြစ်စေပါတယ်။
- Server ပေါ်မှာပဲ render လုပ်တာက client-specific formatting တွေကို လုံးဝ စွန့်လွှတ်လိုက်တာနဲ့ အတူတူပါပဲ။

Browser က HTML ကို parse လုပ်နေတုန်း synchronously (တစ်ပြိုင်နက်) run လုပ်တဲ့ **inline script** (HTML ထဲမှာ တိုက်ရိုက် ထည့်ထားတဲ့ script) တစ်ခုကို သုံးပြီး — **ပထမဆုံး paint (first paint) မဖြစ်ခင်ကတည်းက** DOM ကို update လုပ်နိုင်ပါတယ်။ ဒီ guide က dates, themes နဲ့ persisted UI state (သိမ်းဆည်းထားတဲ့ UI state) တွေအကြောင်း ဖော်ပြထားပါတယ်။

## ဥပမာ (Example)

ဒီ guide နဲ့ တွဲဖက်ထားတဲ့ [demo](https://preventing-flash-before-hydration.labs.vercel.dev/) ([source](https://github.com/vercel-labs/preventing-flash-before-hydration)) ကို `LANG=ja_JP.UTF-8` နဲ့ တည်ဆောက်ထားတာမို့ — server/client locale မကိုက်ညီမှုကို simulate (ပုံဖော်ပြသ) လုပ်ထားပါတယ်။ ဒီမှာ အောက်ပါတို့ကို ယှဉ်ကြည့်နိုင်ပါတယ်:

- Flash မရှိ၊ hydration error မရှိတဲ့ inline script နဲ့ date formatting
- `toLocaleDateString()` ကို တိုက်ရိုက် ခေါ်ပြီး hydration error ပြတဲ့ Client Component
- Lazy `useState` initializer သုံးပြီး ဖွင့်ထားတဲ့ section ကို `localStorage` ထဲ သိမ်းတဲ့ accordion (ဖွင့်/ပိတ် လုပ်လို့ရတဲ့ အပိုင်းစာရင်း)

Chrome DevTools ရဲ့ [Sensors](https://developer.chrome.com/docs/devtools/sensors) ကို သုံးပြီး သင့် locale (ဥပမာ `ru-RU`) ကို override လုပ်ကာ — နည်းလမ်းတစ်ခုချင်းစီ ဘယ်လို ပြုမူလဲ ကြည့်နိုင်ပါတယ်။

## ရက်စွဲနဲ့ ပုံစံဖော်ပြခြင်း (Dates and formatting)

`2026-06-15T18:00:00Z` လို UTC timestamp တစ်ခုက အချိန် ပုံသေမှတ်တမ်း (fixed point in time) တစ်ခုကို ကိုယ်စားပြုပေမယ့် — ပြသဖို့ format လုပ်တဲ့အခါမှာတော့ user ရဲ့ locale နဲ့ time zone (ဒေသစံတော်ချိန် ဇုန်) ပေါ်မှာ မူတည်ပါတယ်။ Server ပေါ်က `toLocaleDateString()` နဲ့ `Intl.DateTimeFormat` တွေက server ရဲ့ settings တွေကို သုံးပါတယ် — အဲဒါတွေက user ရဲ့ဟာနဲ့ မတူညီနိုင်ပါဘူး။

### ပြဿနာ (The problem)

သဘာဝကျတဲ့ ချဉ်းကပ်နည်းတစ်ခုကတော့ — date ကို format လုပ်ပေးတဲ့ Client Component တစ်ခုပါ:

```tsx filename="app/components/event-date.tsx" switcher
'use client'

export function EventDate({ date }: { date: string }) {
  return <p>{new Date(date).toLocaleDateString()}</p>
}
```

```jsx filename="app/components/event-date.js" switcher
'use client'

export function EventDate({ date }) {
  return <p>{new Date(date).toLocaleDateString()}</p>
}
```

SSR အတွင်းမှာ `toLocaleDateString()` က Node.js ထဲမှာ run လုပ်ပြီး — server ရဲ့ locale နဲ့ format လုပ်ပါတယ် (ဥပမာ `6/15/2026`)။ Hydration လုပ်တဲ့အခါ React က component ကို browser ထဲမှာ ပြန် execute လုပ်ပြီး — user ရဲ့ locale ကို ထုတ်ပေးပါတယ် (ဥပမာ `2026/6/15`)။ React က မကိုက်ညီမှုကို detect လုပ်ပြီး hydration error ကို ပစ်လိုက်ကာ — user က flash တစ်ခုကို မြင်ရပါတယ်။

ဒါကို `useEffect` သုံးပြီး hydration ပြီးမှ date ကို update လုပ်လို့ ရနိုင်ပေမယ့် — user က server ဘက်က format လုပ်ထားတဲ့ date ကို အရင်ဆုံး မြင်ရပါသေးတယ်။ Server Component တစ်ခုက error ကို လုံးဝ ရှောင်ပေးပေမယ့် — date က server ရဲ့ locale ထဲမှာပဲ အမြဲ ကျန်နေပါလိမ့်မယ်။

> **သိထားသင့်သည်:** သင့် machine ရဲ့ locale က browser ရဲ့ locale နဲ့ တူနေရင် ဒီပြဿနာက local development မှာ သတိမထားမိဘဲ လွတ်သွားနိုင်ပါတယ်။ Dev server ကို သင့် browser နဲ့ မတူတဲ့ `TZ` နဲ့ `LANG` တွေနဲ့ run လုပ်ပြီး (ဥပမာ `TZ=UTC LANG=ja_JP.UTF-8 next dev`) — မကိုက်ညီမှုတွေကို စောစောစီးစီး ဖမ်းမိနိုင်ပါတယ်။ Servers အများစုက UTC နဲ့ run လုပ်တာမို့ — `TZ=UTC` က ကောင်းတဲ့ default တစ်ခုပါ။

### Inline script နဲ့ ပြုပြင်ခြင်း

1. Server က date ကို သူ့ရဲ့ locale နဲ့ `<p>` တစ်ခုထဲ render လုပ်ပါတယ်။
2. Element ရဲ့ နောက်မှာ (via [`dangerouslySetInnerHTML`](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)) `<script>` တစ်ခု ထားပါ။ Browser က ဒါကို HTML parsing အတွင်း — first paint မဖြစ်ခင် — **synchronously (တစ်ပြိုင်နက်)** run လုပ်ပါတယ်။
3. Inline script က React hydrate မလုပ်ခင် text ကို ပြောင်းလိုက်လို့ — element ပေါ်မှာ [`suppressHydrationWarning`](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors) ကို ထည့်ပါ။ အောက်က `suppressHydrationWarning` ကို နားလည်ခြင်း section ကို ကြည့်ပါ။

```tsx filename="app/events/page.tsx" switcher
import { getEvent } from '@/app/lib/events'

export default async function Page() {
  const event = await getEvent('nextjs-conf')

  return (
    <section>
      <h1>{event.name}</h1>
      <p id="event-date" suppressHydrationWarning>
        {new Date(event.date).toLocaleDateString()}
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.getElementById("event-date").textContent=new Date("${event.date}").toLocaleDateString()`,
        }}
      />
    </section>
  )
}
```

```jsx filename="app/events/page.js" switcher
import { getEvent } from '@/app/lib/events'

export default async function Page() {
  const event = await getEvent('nextjs-conf')

  return (
    <section>
      <h1>{event.name}</h1>
      <p id="event-date" suppressHydrationWarning>
        {new Date(event.date).toLocaleDateString()}
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.getElementById("event-date").textContent=new Date("${event.date}").toLocaleDateString()`,
        }}
      />
    </section>
  )
}
```

ဒါက full page loads (တိုက်ရိုက် visits, refreshes) တွေမှာ အလုပ်လုပ်ပါတယ်။ `<Link>` ကနေတစ်ဆင့် client-side navigation လုပ်တာတွေအတွက်တော့ — ပြန်သုံးလို့ရတဲ့ component တစ်ခု ထုတ်ယူခြင်း section ကို ကြည့်ပါ။

### `suppressHydrationWarning` ကို နားလည်ခြင်း

React က hydrate လုပ်ပြီး text မကိုက်ညီမှု တစ်ခုကို တွေ့တဲ့အခါ:

- **`suppressHydrationWarning` မပါဘဲ:** React က ဒါကို hydration error တစ်ခုအနေနဲ့ သဘောထားပြီး — အနီးဆုံး error (သို့) Suspense boundary ကနေ client-side ပြန် render လုပ်ခြင်းနဲ့ ပြန်ကောင်းအောင် လုပ်ပါတယ်။ ဒါက flash ဖြစ်စေပြီး — React က DOM ကို ပြန်တည်ဆောက်တဲ့အခါ scripts တွေက ပြန် run မလုပ်တာမို့ — အဲဒီ boundary အတွင်းက **အခြား components တွေပေါ်မှာ inline script တွေ ပြုပြင်ထားတာတွေ ပျောက်သွားစေပါတယ်**။
- **`suppressHydrationWarning` ပါဘဲ:** React က DOM ထဲမှာ ရှိနေတာကို ထိန်းသိမ်းပြီး — အဲဒီ element အတွက် client ရဲ့ output ကို ပစ်ပယ်ပါတယ်။ DOM ဘက်က အနိုင်ရပါတယ်။

Inline script က React hydrate မလုပ်ခင် မှန်ကန်တဲ့ တန်ဖိုးကို DOM ထဲ ထည့်ပေးပါတယ်။ Server Components တွေမှာတောင် — React က hydration အတွင်းမှာ DOM ကို RSC payload (React Server Components payload) နဲ့ ယှဉ်ကြည့်ပြီး — inline script က text ကို ပြောင်းထားပြီးသား ဖြစ်ပါတယ်။ `suppressHydrationWarning` က React ကို — payload ကို မဟုတ်ဘဲ DOM ကို လက်ခံဖို့ ပြောပါတယ်။

### ပြန်သုံးလို့ရတဲ့ component တစ်ခု ထုတ်ယူခြင်း (Extracting a reusable component)

DOM updates တွေကနေတစ်ဆင့် ထည့်သွင်းတဲ့ scripts တွေက browser ထဲမှာ execute မလုပ်ပါဘူး။ Client-side navigation တွေမှာ React က component ကို RSC payload ကနေ render လုပ်တာမို့ — script က run မဖြစ်တော့ပါဘူး။ Component ကို Client Component တစ်ခု ဖြစ်အောင် လုပ်တာက ဒါကို ဖြေရှင်းပေးပါတယ်: soft navigations (client-side မှာပဲ ပြောင်းတဲ့ navigations) တွေမှာ `toLocaleDateString()` က browser ထဲမှာ တိုက်ရိုက် run လုပ်ပြီး — hard navigations (full page loads) တွေမှာတော့ inline script က ကိုင်တွယ်ပါတယ်။ Instance တစ်ခုချင်းစီအတွက် stable ဖြစ်တဲ့ unique ID တစ်ခု ထုတ်ပေးဖို့ [`useId`](https://react.dev/reference/react/useId) ကို သုံးပါတယ်။

React က development မှာ rendering က `<script>` tags တွေ ထုတ်လုပ်တဲ့အခါ warning လည်း ပေးပါတယ်။ ဒါကို ရှောင်ဖို့ — script ကို server ပေါ်မှာ `type="text/javascript"` ဖြစ်ပြီး — client ပေါ်မှာ `type="text/plain"` ဖြစ်အောင် သတ်မှတ်ပေးတဲ့ helper တစ်ခုထဲမှာ wrap လုပ်ပါ။ Type မကိုက်ညီမှုကို `suppressHydrationWarning` က ကိုင်တွယ်ပေးပါတယ်။

```tsx filename="app/components/inline-script.tsx" switcher
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

```jsx filename="app/components/inline-script.js" switcher
export function InlineScript({ html }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

```tsx filename="app/components/local-date.tsx" switcher
'use client'

import { useId } from 'react'
import { InlineScript } from './inline-script'

export function LocalDate({
  date,
  options,
}: {
  date: string
  options?: Intl.DateTimeFormatOptions
}) {
  const id = useId()

  return (
    <>
      <time id={id} dateTime={date} suppressHydrationWarning>
        {new Date(date).toLocaleDateString(undefined, options)}
      </time>
      <InlineScript
        html={`{var n=document.getElementById("${id}");if(n)n.textContent=new Date("${date}").toLocaleDateString(undefined,${JSON.stringify(options)})}`}
      />
    </>
  )
}
```

```jsx filename="app/components/local-date.js" switcher
'use client'

import { useId } from 'react'
import { InlineScript } from './inline-script'

export function LocalDate({ date, options }) {
  const id = useId()

  return (
    <>
      <time id={id} dateTime={date} suppressHydrationWarning>
        {new Date(date).toLocaleDateString(undefined, options)}
      </time>
      <InlineScript
        html={`{var n=document.getElementById("${id}");if(n)n.textContent=new Date("${date}").toLocaleDateString(undefined,${JSON.stringify(options)})}`}
      />
    </>
  )
}
```

- **Hard navigation** (ကနဦး load, refresh): Script က HTML parsing အတွင်းမှာ execute ဖြစ်ပြီး date ကို ပြင်ပေးပါတယ်။ `suppressHydrationWarning` က React ကို DOM ကို လက်ခံဖို့ ပြောပါတယ်။
- **Client-side navigation** (`<Link>` ကနေတစ်ဆင့်): `toLocaleDateString()` က Client Component render ရဲ့ အစိတ်အပိုင်းအနေနဲ့ browser ထဲမှာ run လုပ်ပါတယ်။ Script ကတော့ `text/plain` ဖြစ်နေလို့ ignore လုပ်ခံရပါတယ်။

```tsx filename="app/events/page.tsx" switcher
import { LocalDate } from '@/app/components/local-date'
import { getEvent } from '@/app/lib/events'

export default async function Page() {
  const event = await getEvent('nextjs-conf')

  return (
    <section>
      <h1>{event.name}</h1>
      <LocalDate
        date={event.date}
        options={{ year: 'numeric', month: 'long', day: 'numeric' }}
      />
    </section>
  )
}
```

```jsx filename="app/events/page.js" switcher
import { LocalDate } from '@/app/components/local-date'
import { getEvent } from '@/app/lib/events'

export default async function Page() {
  const event = await getEvent('nextjs-conf')

  return (
    <section>
      <h1>{event.name}</h1>
      <LocalDate
        date={event.date}
        options={{ year: 'numeric', month: 'long', day: 'numeric' }}
      />
    </section>
  )
}
```

> **သိထားသင့်သည်:**
>
> - ပြသထားတဲ့ text ဘယ်လိုပဲ ဖြစ်နေနေ — ISO string ကို search engines နဲ့ screen readers တွေ parse လုပ်နိုင်အောင် `dateTime` attribute ပါတဲ့ [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time) element တစ်ခုကို သုံးပါ။
> - `dangerouslySetInnerHTML` နဲ့ inline scripts တွေက `'unsafe-inline'` ကို ခွင့်မပြုတဲ့ တင်းကျပ်တဲ့ [Content Security Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) တွေအောက်မှာ block ခံရပါတယ်။ သင့် app က CSP သုံးနေရင် — [nonce](/docs/nextjs/content-security-policy) တစ်ခု ထည့်ဖို့ လိုပါလိမ့်မယ်။

## Themes (အပြင်အဆင်များ)

သင့် page က default theme (ဥပမာ light) နဲ့ server-render လုပ်ခံရပေမယ့် — user က `localStorage` ထဲမှာ သိမ်းထားတဲ့ ဦးစားပေး ရွေးချယ်မှုတစ်ခု ရှိနေနိုင်ပါတယ်။ ဒီ inline script technique ကိုပဲ သုံးနိုင်ပါတယ်: တန်ဖိုးကို ဖတ်ပြီး — browser မှာ paint မဖြစ်ခင် `<html>` ပေါ်က `data-theme` attribute ကို သတ်မှတ်ပါ။

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```css filename="app/globals.css"
[data-theme='light'] {
  --background: #ffffff;
  --foreground: #000000;
}

[data-theme='dark'] {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

Script က `<head>` ထဲမှာ run လုပ်တာမို့ — content တစ်ခုခု paint မဖြစ်ခင် မှန်ကန်တဲ့ theme ကို အသုံးချပြီးသား ဖြစ်ပါတယ်။ `try/catch` က `localStorage` မရနိုင်တဲ့ အခြေအနေတွေကို ကိုင်တွယ်ပေးပါတယ်။

### Theme ကို cookie ထဲ သိမ်းဆည်းခြင်း (Storing the theme in a cookie)

`localStorage` နဲ့ မတူဘဲ — cookie တစ်ခုက request တိုင်းနဲ့အတူ ပို့ပေးတာမို့ — server က [`cookies()`](/docs/nextjs/cookies) နဲ့ ဖတ်လို့ **ရပါတယ်**။ ဒါပေမယ့် root layout ထဲမှာ ဖတ်လိုက်တာက app တစ်ခုလုံးကို static prerendering (ကြိုတင် static အနေနဲ့ render လုပ်ခြင်း) ကနေ ထုတ်ပစ်လိုက်ပါတယ် — ပြီးတော့ [Cache Components](/docs/nextjs/next-config-cache-components) အောက်မှာဆို — layout အောက်က segment တိုင်းကို block ဖြစ်စေပါတယ်။ Page ကို generic default တစ်ခုနဲ့ static အနေနဲ့ပဲ prerender ဖြစ်နေစေပြီး flash ကိုလည်း ရှောင်ချင်ရင် — inline script ထဲမှာ cookie ကို ဖတ်ပါ:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);if(m)document.documentElement.setAttribute("data-theme",decodeURIComponent(m[1]))}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);if(m)document.documentElement.setAttribute("data-theme",decodeURIComponent(m[1]))}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Themes တွေ ပြောင်းဖို့ — `<html>` ပေါ်မှာ attribute ကို သတ်မှတ်ပြီး ရွေးချယ်မှုကို cookie ထဲ သိမ်းပါ:

```js
const theme = 'dark'
document.documentElement.setAttribute('data-theme', theme)
document.cookie = `theme=${encodeURIComponent(theme)}; path=/; max-age=31536000; SameSite=Lax`
```

## React state နဲ့ ထပ်တူပြုခြင်း (Syncing with React state)

Client Component တစ်ခုက interactive state ကို စီမံခန့်ခွဲနေတဲ့အခါ (accordion ရဲ့ ဘယ် section က ဖွင့်ထားလဲလို အခြေအနေမျိုး) — React ရဲ့ ကနဦး state က inline script က သတ်မှတ်ထားတဲ့ DOM နဲ့ ကိုက်ညီနေရပါမယ်။ Script နဲ့ ရင်းမြစ်တစ်ခုတည်းကနေ ဖတ်တဲ့ **lazy state initializer** (ပထမဆုံး render မှာမှ သာ တွက်ချက်တဲ့ state ကနဦးတန်ဖိုး) တစ်ခုကို သုံးပါ။

```tsx filename="app/components/accordion.tsx" switcher
'use client'

import { useState, useCallback } from 'react'
import { InlineScript } from './inline-script'

const STORAGE_KEY = 'open-section'

const sections = [
  {
    id: 'setup',
    title: 'Setup',
    content: 'Install dependencies and create your project.',
  },
  {
    id: 'usage',
    title: 'Usage',
    content: 'Import the component and pass your data.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    content: 'Push to your Git provider and deploy.',
  },
]

const DEFAULT_ID = sections[0].id
const SECTION_IDS = sections.map((s) => s.id)

export function Accordion() {
  const [openId, setOpenId] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_ID
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ID
  })

  const handleToggle = useCallback(
    (id: string) => (e: React.ToggleEvent<HTMLDetailsElement>) => {
      if (e.newState === 'open') {
        setOpenId(id)
        localStorage.setItem(STORAGE_KEY, id)
      }
    },
    []
  )

  return (
    <div>
      {sections.map((section) => (
        <details
          key={section.id}
          name="accordion"
          id={`section-${section.id}`}
          open={openId === section.id}
          onToggle={handleToggle(section.id)}
        >
          <summary>{section.title}</summary>
          <p>{section.content}</p>
        </details>
      ))}
      <InlineScript
        html={`{var id=localStorage.getItem("${STORAGE_KEY}")??"${DEFAULT_ID}";${JSON.stringify(SECTION_IDS)}.forEach(function(s){var el=document.getElementById("section-"+s);if(el){if(s===id)el.setAttribute("open","");else el.removeAttribute("open")}})}`}
      />
    </div>
  )
}
```

```jsx filename="app/components/accordion.js" switcher
'use client'

import { useState, useCallback } from 'react'
import { InlineScript } from './inline-script'

const STORAGE_KEY = 'open-section'

const sections = [
  {
    id: 'setup',
    title: 'Setup',
    content: 'Install dependencies and create your project.',
  },
  {
    id: 'usage',
    title: 'Usage',
    content: 'Import the component and pass your data.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    content: 'Push to your Git provider and deploy.',
  },
]

const DEFAULT_ID = sections[0].id
const SECTION_IDS = sections.map((s) => s.id)

export function Accordion() {
  const [openId, setOpenId] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_ID
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ID
  })

  const handleToggle = useCallback(
    (id) => (e) => {
      if (e.newState === 'open') {
        setOpenId(id)
        localStorage.setItem(STORAGE_KEY, id)
      }
    },
    []
  )

  return (
    <div>
      {sections.map((section) => (
        <details
          key={section.id}
          name="accordion"
          id={`section-${section.id}`}
          open={openId === section.id}
          onToggle={handleToggle(section.id)}
        >
          <summary>{section.title}</summary>
          <p>{section.content}</p>
        </details>
      ))}
      <InlineScript
        html={`{var id=localStorage.getItem("${STORAGE_KEY}")??"${DEFAULT_ID}";${JSON.stringify(SECTION_IDS)}.forEach(function(s){var el=document.getElementById("section-"+s);if(el){if(s===id)el.setAttribute("open","");else el.removeAttribute("open")}})}`}
      />
    </div>
  )
}
```

Inline script ရော lazy `useState` initializer ရော နှစ်ခုလုံးက `localStorage` ကနေ ဖတ်ပါတယ်။ သူတို့က အမြဲတမ်း သဘောတူညီနေလို့ — React ရဲ့ ကနဦး state က DOM နဲ့ ကိုက်ညီနေပါတယ်။

## Development မှာ attributes တွေကို ပြန်အသုံးချခြင်း (Re-applying attributes in development)

Inline script က attribute ကို parsing အတွင်းမှာ သတ်မှတ်ပေးပါတယ် — production build တစ်ခုအတွက် ဒီလောက်နဲ့ လုံလောက်ပါတယ်။ Development မှာတော့ [React ရဲ့ Strict Mode](https://react.dev/reference/react/StrictMode) က bugs တွေ ပေါ်လွင်စေဖို့ components တွေကို တစ်ခါ ပြန် mount (remount) လုပ်ပါတယ် — အဲဒီ remount လုပ်တုန်းမှာ `<html>`, `<head>`, `<body>` တွေကို JSX ကနေ သူထိန်းချုပ်တဲ့ attributes တွေပဲ ကျန်အောင် ပြန်သတ်မှတ်လိုက်လို့ — script က သတ်မှတ်ခဲ့တဲ့ attribute ပျောက်သွားပါတယ်။ Page က attribute မပါဘဲ render ဖြစ်ပြီး — တန်ဖိုးရဲ့ မူရင်းရင်းမြစ် (source of truth) ကို လျစ်လျူရှုလိုက်သလို ဖြစ်သွားပါတယ်။

ဒါကို ပြုပြင်ဖို့ နည်းလမ်းတစ်ခုက — inline script လုံးဝ မရှိဘူးဆိုရင် သင်လုပ်မယ့်အရာကိုပဲ လုပ်တာပါ။ သိမ်းထားတဲ့ တန်ဖိုးကို client ပေါ်မှာ ဖတ်ပြီး — theme ရဲ့ ပိုင်ရှင် component ထဲမှာ — first paint မဖြစ်ခင် run လုပ်တဲ့ [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect) တစ်ခုထဲမှာ အသုံးချပါ:

```tsx filename="app/components/theme-toggle.tsx"
'use client'

import { useLayoutEffect } from 'react'

export function ThemeToggle() {
  // Re-apply after React clears it on the dev remount. This is a no-op in production.
  useLayoutEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme) document.documentElement.setAttribute('data-theme', theme)
  }, [])

  function toggle() {
    const next =
      (localStorage.getItem('theme') ?? 'light') === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return <button onClick={toggle}>Toggle theme</button>
}
```

## အခြား နည်းလမ်းတွေကို ဘယ်အချိန်မှာ သုံးမလဲ (When to use other approaches)

| အခြေအနေ (Situation)                                        | ချဉ်းကပ်နည်း (Approach)                                                                                                        |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Date က request data (cookies, headers) ပေါ် မူတည်နေတယ်     | Request data တွေကို ဖတ်ပြီး server ဘက်မှာ format လုပ်ဖို့ [`headers()`](/docs/nextjs/headers) (သို့) [`cookies()`](/docs/nextjs/cookies) ကို သုံးပါ |
| Date က live ဖြစ်ပြီး update လုပ်နေတယ် (countdown timers, clocks) | `useEffect` နဲ့ `suppressHydrationWarning` ပါတဲ့ Client Component တစ်ခုကို သုံးပါ                                           |
| Page က ကတည်းက အပြည့်အဝ dynamic ဖြစ်နေပြီ              | `Accept-Language` header ကို သုံးပြီး date ကို server ပေါ်မှာ format လုပ်ပါ                                                |
| Content တွေကို ဘာသာစကားအလိုက် ပြန်ဆိုနေတယ်               | Locale တစ်ခုချင်းစီအတွက် static builds (သို့) dynamic rendering နဲ့ [internationalization](/docs/nextjs/internationalization) ကို သုံးပါ |

### `useEffect` ကို ဘာကြောင့် မသုံးတာလဲ

`useEffect` က hydration နဲ့ paint ပြီးမှသာ run လုပ်ပါတယ်။ User က server ရဲ့ တန်ဖိုးကို အရင်မြင်ရပြီးမှ — ပြင်ဆင်မှုကို မြင်ရပါတယ်။ Effect တစ်ခုထဲမှာ state သတ်မှတ်တာက re-render တစ်ခုကိုလည်း trigger လုပ်လို့ — parent Suspense boundaries တွေ ပြန် activate ဖြစ်နိုင်ပါတယ်။

`useLayoutEffect` က paint မဖြစ်ခင် — ဒါပေမယ့် hydration ပြီးမှ — run လုပ်ပါတယ်။ Hydration နဲ့ paint ကြားက flash ကို ကာကွယ်ပေးပေမယ့် — HTML ရောက်ရှိချိန်ကနေ React hydrate လုပ်ချိန်အထိ ကြားက flash ကိုတော့ မကာကွယ်နိုင်ပါဘူး။ Connection နှေးတဲ့အခါ — browser က React မတင်ရသေးခင် server HTML ကို paint လုပ်ပစ်ပါတယ်။ Inline script ကတော့ React မပါဝင်ခင်ကတည်းက HTML **parsing** အတွင်းမှာ run လုပ်ပါတယ်။

### Request time မှာ headers (သို့) cookies တွေကနေ ဘာကြောင့် မဖတ်တာလဲ

`await headers()` နဲ့ `Accept-Language` ကို ဖတ်တာက server ကို request တစ်ခုချင်းအလိုက် format လုပ်နိုင်စေပါတယ်။ Cache Components တွေနဲ့ဆို — page ရဲ့ ကျန်တဲ့ အပိုင်းတွေ static ဖြစ်နေအောင် — date ကိုပဲ Suspense fallback တစ်ခုထဲမှာ wrap လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် ချက်ချင်း content မဟုတ်ဘဲ fallback တစ်ခုကို ပြရပါလိမ့်မယ် — ပြီးတော့ `Accept-Language` ထဲမှာ time zone အချက်အလက် မပါဝင်ပါဘူး။

## နောက်တစ်ဆင့်တွေ (Next steps)

- Request data ပေါ် အခြေခံပြီး format လုပ်ဖို့ လိုတဲ့အခါ — [cookies](/docs/nextjs/cookies) (သို့) [headers](/docs/nextjs/headers) တွေကို ဖတ်ပါ။
- ဘာသာစကားမျိုးစုံ (multi-language) support အတွက် [internationalization](/docs/nextjs/internationalization) ကို configure လုပ်ပါ။
- Hydration mismatches တွေရဲ့ အခြား အဖြစ်များတဲ့ အကြောင်းရင်းတွေအတွက် — [React hydration error](https://nextjs.org/docs/messages/react-hydration-error) ကို ကြည့်ပါ။
