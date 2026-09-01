---
title: "Devtools (Developer Tools)"
description: "React Query ရဲ့ ကိုယ်ပိုင် devtools — install & import လုပ်နည်း, Floating Mode, Embedded Mode, options တွေ အားလုံး, production မှာ lazy loading လုပ်နည်း"
order: 36
source: "https://tanstack.com/query/latest/docs/framework/react/devtools"
status: translated
updated: 2026-09-01
---

လက်တွေ မြှောက်ပြီး ဟူရေး လို့ အော်လိုက်ပါ — React Query မှာ ကိုယ်ပိုင် devtools ပါလာလို့ပါ! 🥳

React Query ခရီးစဉ်ကို စတင်တဲ့အခါ — ဒီ devtools တွေကို အနားမှာ ထားချင်ပါလိမ့်မယ်။ ဒါတွေက React Query ရဲ့ အတွင်းပိုင်း အလုပ်လုပ်ပုံတွေ အားလုံးကို မြင်သာအောင် ကူညီပေးပြီး — ဒုက္ခရောက်နေချိန်မှာ နာရီပေါင်းများစွာ လိုမယ့် debugging အချိန်တွေကို သက်သာစေပါလိမ့်မယ်!

> Chrome၊ Firefox နဲ့ Edge user တွေအတွက်: TanStack Query ကို browser DevTools ထဲမှာ တိုက်ရိုက် debug လုပ်ဖို့ third-party browser extensions တွေ ရနိုင်ပါတယ်။ ဒါတွေက framework-specific ဖြစ်တဲ့ devtools packages တွေနဲ့ အတူတူ လုပ်ဆောင်ချက်တွေကို ပေးပါတယ်:
>
> - [Devtools for Chrome](https://chromewebstore.google.com/detail/tanstack-query-devtools/annajfchloimdhceglpgglpeepfghfai)
> - [Devtools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tanstack-query-devtools/)
> - [Devtools for Edge](https://microsoftedge.microsoft.com/addons/detail/tanstack-query-devtools/edmdpkgkacmjopodhfolmphdenmddobj)

> React Native user တွေအတွက်: js-based application မှန်သမျှမှာ React Query ကို debug လုပ်ဖို့ third-party native macOS app တစ်ခု ရနိုင်ပါတယ်။ Devices တွေအနှံ့က queries တွေကို real-time မှာ စောင့်ကြည့်နိုင်ပါတယ်။ ဒီမှာ ကြည့်ပါ: [rn-better-dev-tools](https://github.com/LovesWorking/rn-better-dev-tools)

> ဗားရှင်း 5 ကစပြီး dev tools တွေက mutations တွေကိုပါ စောင့်ကြည့်လို့ ရတယ်ဆိုတာ သတိပြုပါ။

## Devtools တွေကို Install လုပ်ပြီး Import လုပ်ခြင်း

Devtools တွေက သီးခြား install လုပ်ရတဲ့ package တစ်ခုပါ:

```bash
npm i @tanstack/react-query-devtools
```

ဒါမှမဟုတ်

```bash
pnpm add @tanstack/react-query-devtools
```

ဒါမှမဟုတ်

```bash
yarn add @tanstack/react-query-devtools
```

ဒါမှမဟုတ်

```bash
bun add @tanstack/react-query-devtools
```

Next 13+ App Dir အတွက်ဆိုရင် — အလုပ်ဖြစ်ဖို့ dev dependency အဖြစ် install လုပ်ရပါမယ်။

Devtools တွေကို ဒီလို import လုပ်နိုင်ပါတယ်:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

Default အနေနဲ့ — React Query Devtools တွေက `process.env.NODE_ENV === 'development'` ဖြစ်တဲ့အခါမှသာ bundles တွေထဲမှာ ပါဝင်တာမို့ — production build တစ်ခုမှာ ဒါတွေကို ဖယ်ထုတ်ဖို့ စိတ်ပူစရာ မလိုပါဘူး။

## Floating Mode

Floating Mode က devtools တွေကို သင့် app ထဲမှာ fixed၊ floating element တစ်ခုအနေနဲ့ mount လုပ်ပြီး — devtools တွေကို ပြ/ဝှက် လုပ်ဖို့ screen ရဲ့ ထောင့်မှာ toggle တစ်ခု ပေးပါလိမ့်မယ်။ ဒီ toggle state က reload တွေကြားမှာ localStorage ထဲမှာ သိမ်းဆည်းပြီး မှတ်မိနေပါလိမ့်မယ်။

အောက်က code ကို သင့် React app ရဲ့ တတ်နိုင်သမျှ မြင့်တဲ့ နေရာမှာ ထားပါ။ Page ရဲ့ root နဲ့ နီးလေလေ — ပိုကောင်းလေလေ အလုပ်လုပ်ပါလိမ့်မယ်!

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Options

- `initialIsOpen: boolean`
  - Dev tools တွေ default အနေနဲ့ ဖွင့်ထားချင်ရင် ဒါကို `true` လို့ သတ်မှတ်ပါ
- `buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "relative"`
  - Default က `bottom-right`
  - Devtools panel ကို ဖွင့်/ပိတ် လုပ်ဖို့ TanStack logo ရဲ့ တည်နေရာ
  - `relative` ဆိုရင် — devtools တွေကို သင် render လုပ်တဲ့ နေရာမှာ button ကို ထားပေးပါတယ်
- `position?: "top" | "bottom" | "left" | "right"`
  - Default က `bottom`
  - React Query devtools panel ရဲ့ တည်နေရာ
- `client?: QueryClient`,
  - Custom QueryClient တစ်ခု သုံးဖို့ ဒါကို သုံးပါ။ မဟုတ်ရင် — အနီးဆုံး context ကဟာကို သုံးပါလိမ့်မယ်
- `errorTypes?: { name: string; initializer: (query: Query) => TError}[]`
  - သင့် queries တွေပေါ်မှာ trigger လုပ်လို့ ရတဲ့ errors တစ်ချို့ကို ကြိုသတ်မှတ်ဖို့ ဒါကို သုံးပါ။ UI ကနေ အဲဒီ error ကို toggle ဖွင့်တဲ့အခါ (သီးခြား query နဲ့အတူ) initializer ကို ခေါ်ပါလိမ့်မယ်။ ဒါက Error တစ်ခုကို return လုပ်ရပါမယ်
- `styleNonce?: string`
  - Document head ဆီ ထည့်တဲ့ style tag ဆီ nonce တစ်ခု ပေးဖို့ ဒါကို သုံးပါ။ Inline styles တွေ ခွင့်ပြုဖို့ Content Security Policy (CSP) nonce သုံးနေရင် အသုံးဝင်ပါတယ်
- `shadowDOMTarget?: ShadowRoot`
  - Default အပြုအမူက devtool ရဲ့ styles တွေကို DOM ထဲက head tag ဆီ အသုံးချပါလိမ့်မယ်
  - Styles တွေကို light DOM ထဲက head tag ထဲမှာ မဟုတ်ဘဲ shadow DOM ထဲမှာ အသုံးချဖို့ shadow DOM target တစ်ခုကို devtools ဆီ ပေးဖို့ ဒါကို သုံးပါ
- `theme?: "light" | "dark" | "system"`
  - Default က `system`
  - Devtools panel ရဲ့ theme ကို ပြောင်းဖို့ ဒါကို သတ်မှတ်ပါ

## Embedded Mode

Embedded mode က development tools တွေကို သင့် application ထဲမှာ fixed element တစ်ခုအနေနဲ့ ပြသပေးပါလိမ့်မယ် — ဒါကြောင့် သင့်ကိုယ်ပိုင် development tools တွေထဲမှာ ကျွန်တော်တို့ရဲ့ panel ကို သုံးနိုင်ပါတယ်။

အောက်က code ကို သင့် React app ရဲ့ တတ်နိုင်သမျှ မြင့်တဲ့ နေရာမှာ ထားပါ။ Page ရဲ့ root နဲ့ နီးလေလေ — ပိုကောင်းလေလေ အလုပ်လုပ်ပါလိမ့်မယ်!

```tsx
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

function App() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <button
        onClick={() => setIsOpen(!isOpen)}
      >{`${isOpen ? 'Close' : 'Open'} the devtools panel`}</button>
      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
    </QueryClientProvider>
  )
}
```

### Options

- `style?: React.CSSProperties`
  - Devtools panel အတွက် custom styles
  - Default: `{ height: '500px' }`
  - ဥပမာ: `{ height: '100%' }`
  - ဥပမာ: `{ height: '100%', width: '100%' }`
- `onClose?: () => void`
  - Devtools panel ကို ပိတ်လိုက်တဲ့အခါ ခေါ်ခံရတဲ့ callback function
- `client?: QueryClient`,
  - Custom QueryClient တစ်ခု သုံးဖို့ ဒါကို သုံးပါ။ မဟုတ်ရင် — အနီးဆုံး context ကဟာကို သုံးပါလိမ့်မယ်
- `errorTypes?: { name: string; initializer: (query: Query) => TError}[]`
  - သင့် queries တွေပေါ်မှာ trigger လုပ်လို့ ရတဲ့ errors တစ်ချို့ကို ကြိုသတ်မှတ်ဖို့ ဒါကို သုံးပါ။ UI ကနေ အဲဒီ error ကို toggle ဖွင့်တဲ့အခါ (သီးခြား query နဲ့အတူ) initializer ကို ခေါ်ပါလိမ့်မယ်။ ဒါက Error တစ်ခုကို return လုပ်ရပါမယ်
- `styleNonce?: string`
  - Document head ဆီ ထည့်တဲ့ style tag ဆီ nonce တစ်ခု ပေးဖို့ ဒါကို သုံးပါ။ Inline styles တွေ ခွင့်ပြုဖို့ Content Security Policy (CSP) nonce သုံးနေရင် အသုံးဝင်ပါတယ်
- `shadowDOMTarget?: ShadowRoot`
  - Default အပြုအမူက devtool ရဲ့ styles တွေကို DOM ထဲက head tag ဆီ အသုံးချပါလိမ့်မယ်
  - Styles တွေကို light DOM ထဲက head tag ထဲမှာ မဟုတ်ဘဲ shadow DOM ထဲမှာ အသုံးချဖို့ shadow DOM target တစ်ခုကို devtools ဆီ ပေးဖို့ ဒါကို သုံးပါ
- `theme?: "light" | "dark" | "system"`
  - Default က `system`
  - Devtools panel ရဲ့ theme ကို ပြောင်းဖို့ ဒါကို သတ်မှတ်ပါ

## Production မှာ Devtools

Devtools တွေက production builds တွေထဲမှာ ဖယ်ထုတ်ခံရပါတယ်။ ဒါပေမယ့် — production မှာ devtools တွေကို lazy load လုပ်တာက နှစ်သက်စရာ ဖြစ်နိုင်ပါတယ်:

```tsx
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Example } from './Example'

const queryClient = new QueryClient()

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

function App() {
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </QueryClientProvider>
  )
}

export default App
```

ဒါနဲ့ဆိုရင် — `window.toggleDevtools()` ကို ခေါ်တာနဲ့ devtools bundle ကို download လုပ်ပြီး ပြသပေးပါလိမ့်မယ်။

### Modern bundlers

သင့် bundler က package exports တွေကို ထောက်ပံ့ရင် — အောက်ပါ import path ကို သုံးနိုင်ပါတယ်:

```tsx
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
)
```

TypeScript အတွက်ဆိုရင် — သင့် tsconfig ထဲမှာ `moduleResolution: 'nodenext'` ကို သတ်မှတ်ဖို့ လိုပြီး — ဒါက TypeScript v4.7 အနည်းဆုံး လိုပါတယ်။
