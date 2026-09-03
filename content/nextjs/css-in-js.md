---
title: "CSS-in-JS Libraries တွေကို ဘယ်လို သုံးမလဲ (Using CSS-in-JS Libraries)"
description: "Next.js `app` directory ထဲက Client Components တွေမှာ CSS-in-JS libraries တွေ သုံးနည်း — style registry နဲ့ useServerInsertedHTML hook သုံးပြီး styled-jsx နဲ့ styled-components တွေကို configure လုပ်ခြင်း"
order: 114
source: "https://nextjs.org/docs/app/guides/css-in-js"
status: translated
updated: 2026-09-03
---

> **Warning:** Server Components နဲ့ Streaming လို React feature အသစ်တွေမှာ CSS-in-JS သုံးဖို့ဆိုရင် — library တွေက React ရဲ့ နောက်ဆုံး version တွေကို ထောက်ပံ့ဖို့ လိုအပ်ပါတယ်။ ([concurrent rendering](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react) အပါအဝင်)

အောက်ပါ libraries တွေက `app` directory ထဲက Client Components တွေမှာ သုံးလို့ရပါတယ် (အက္ခရာစဉ်အလိုက်):

- [`ant-design`](https://ant.design/docs/react/use-with-next#using-app-router)
- [`chakra-ui`](https://chakra-ui.com/getting-started/nextjs-app-guide)
- [`@fluentui/react-components`](https://react.fluentui.dev/?path=/docs/concepts-developer-server-side-rendering-next-js-appdir-setup--page)
- [`kuma-ui`](https://kuma-ui.com)
- [`@mui/material`](https://mui.com/material-ui/guides/next-js-app-router/)
- [`@mui/joy`](https://mui.com/joy-ui/integrations/next-js-app-router/)
- [`pandacss`](https://panda-css.com)
- [`styled-jsx`](#styled-jsx)
- [`styled-components`](#styled-components)
- [`stylex`](https://stylexjs.com)
- [`tamagui`](https://tamagui.dev/docs/guides/next-js#server-components)
- [`tss-react`](https://tss-react.dev/)
- [`vanilla-extract`](https://vanilla-extract.style)

အောက်ပါ library တွေကတော့ လောလောဆယ် support လုပ်ဖို့ လုပ်ဆောင်နေဆဲ ဖြစ်ပါတယ်:

- [`emotion`](https://github.com/emotion-js/emotion/issues/2928)

> **Good to know**: CSS-in-JS libraries အမျိုးမျိုးကို ကျွန်ုပ်တို့ စမ်းသပ်နေပြီး — React 18 features တွေနဲ့/သို့မဟုတ် `app` directory ကို ထောက်ပံ့တဲ့ libraries တွေအတွက် ဥပမာတွေ ထပ်ထည့်သွားပါမယ်။

## `app` ထဲမှာ CSS-in-JS configure လုပ်ခြင်း

CSS-in-JS ကို configure လုပ်တာက opt-in ဖြစ်တဲ့ အဆင့်သုံးဆင့် ပါဝင်ပါတယ်:

1. render တစ်ခုအတွင်းက CSS rules တွေ အားလုံးကို စုဆောင်းပေးမယ့် **style registry** တစ်ခု။
2. ဒီ rules တွေကို သုံးနိုင်တဲ့ content တွေ မတိုင်ခင် — rules တွေကို inject လုပ်ဖို့ `useServerInsertedHTML` hook အသစ်။
3. ကနဦး server-side rendering ကာလအတွင်း — သင့် app ကို style registry နဲ့ wrap လုပ်ပေးတဲ့ Client Component တစ်ခု။

### `styled-jsx`

Client Components တွေမှာ `styled-jsx` သုံးဖို့ဆိုရင် `v5.1.0` ကို သုံးရပါမယ်။ ပထမဆုံး registry အသစ်တစ်ခု ဖန်တီးပါ:

```tsx filename="app/registry.tsx"
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

```jsx filename="app/registry.js"
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({ children }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

ပြီးရင် သင့် [root layout](/docs/nextjs/file-conventions-layout#root-layout) ကို ဒီ registry နဲ့ wrap လုပ်ပါ:

```tsx filename="app/layout.tsx"
import StyledJsxRegistry from './registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js"
import StyledJsxRegistry from './registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

[ဥပမာတစ်ခုကို ဒီနေရာမှာ ကြည့်ပါ](https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx).

### Styled Components

အောက်မှာတော့ `styled-components@6` (သို့) အသစ်တွေကို configure လုပ်နည်း ဥပမာပါ:

ပထမဆုံး `next.config.js` ထဲမှာ styled-components ကို enable လုပ်ပါ။

```js filename="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

ပြီးရင် `styled-components` ရဲ့ API ကို သုံးပြီး — render တစ်ခုအတွင်း ထုတ်လုပ်လာတဲ့ CSS style rules တွေ အားလုံးကို စုဆောင်းဖို့ global registry component တစ်ခု၊ ပြီးတော့ ဒီ rules တွေကို ပြန်ထုတ်ပေးဖို့ function တစ်ခု ဖန်တီးပါ။ ပြီးရင် `useServerInsertedHTML` hook ကို သုံးပြီး — registry ထဲမှာ စုဆောင်းထားတဲ့ styles တွေကို root layout ထဲက `<head>` HTML tag ထဲ inject လုပ်ပါ။

```tsx filename="lib/registry.tsx"
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

```jsx filename="lib/registry.js"
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

Root layout ရဲ့ `children` တွေကို style registry component နဲ့ wrap လုပ်ပါ:

```tsx filename="app/layout.tsx"
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js"
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

[ဥပမာတစ်ခုကို ဒီနေရာမှာ ကြည့်ပါ](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components).

> **Good to know**:
>
> - Server rendering ကာလအတွင်းမှာ styles တွေကို global registry တစ်ခုထဲ ထုတ်ယူပြီး — သင့် HTML ရဲ့ `<head>` ထဲကို flush လုပ်ပါတယ်။ ဒါက style rules တွေကို သုံးနိုင်တဲ့ content တွေထက် ရှေ့မှာ နေရာရစေဖို့ သေချာစေပါတယ်။ နောင်မှာ ဒီ styles တွေကို ဘယ်နေရာမှာ inject လုပ်ရမလဲ ဆုံးဖြတ်ဖို့ — React feature အသစ်တစ်ခုကို ကျွန်ုပ်တို့ သုံးကောင်း သုံးပါလိမ့်မယ်။
> - Streaming ကာလအတွင်းမှာ — chunk တစ်ခုချင်းစီကနေ ရလာတဲ့ styles တွေကို စုဆောင်းပြီး ရှိပြီးသား styles တွေရဲ့ နောက်မှာ ဆက်ထည့်ပါတယ်။ Client-side hydration ပြီးသွားတဲ့အခါ — `styled-components` က ပုံမှန်အတိုင်း တာဝန်ယူပြီး နောက်ထပ် dynamic styles တွေကို inject လုပ်ပါတယ်။
> - Style registry အတွက် tree ရဲ့ ထိပ်ဆုံးမှာ Client Component တစ်ခုကို တမင်တကာ သုံးတာပါ — ဘာလို့ဆို ဒီနည်းနဲ့ CSS rules တွေကို ထုတ်ယူတာက ပိုပြီး ထိရောက်လို့ပါ။ နောက် server renders တွေမှာ styles တွေ ပြန်ထုတ်တာကို ရှောင်နိုင်ပြီး — Server Component payload ထဲ သူတို့ မပါသွားအောင်လည်း ကာကွယ်ပေးပါတယ်။
> - styled-components ရဲ့ compilation ကို သီးခြား property တွေ တစ်ခုချင်းစီ configure လုပ်ဖို့လိုတဲ့ အဆင့်မြင့် use case တွေအတွက်ဆိုရင် — ကျွန်ုပ်တို့ရဲ့ [Next.js styled-components API reference](https://nextjs.org/docs/architecture/nextjs-compiler#styled-components) မှာ ဆက်ဖတ်နိုင်ပါတယ်။
