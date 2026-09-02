---
title: "mdx-components.js (MDX Components file convention)"
description: "@next/mdx ကို App Router နဲ့ သုံးဖို့ မဖြစ်မနေ လိုအပ်တဲ့ mdx-components.js|tsx file — useMDXComponents function တစ်ခုတည်းကို export လုပ်ရပုံနှင့် ဥပမာများ"
order: 102
source: "https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components"
status: translated
updated: 2026-09-02
---

`mdx-components.js|tsx` file က [`@next/mdx` ကို App Router နဲ့ သုံးဖို့](https://nextjs.org/docs/app/guides/mdx) **မဖြစ်မနေ လိုအပ်ပါတယ်** — ဒီ file မရှိရင် အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။ ဒါ့အပြင် ဒီ file ကို [styles နဲ့ components တွေ စိတ်ကြိုက် ပြင်ဆင်ဖို့](https://nextjs.org/docs/app/guides/mdx#using-custom-styles-and-components)လည်း သုံးနိုင်ပါတယ်။

MDX Components တွေကို သတ်မှတ်ဖို့ `mdx-components.tsx` (သို့) `.js` file ကို သင့် project ရဲ့ root မှာ ထားပါ။ ဥပမာ — `pages` (သို့) `app` နဲ့ တစ်ဆင့်တည်းမှာ၊ (သက်ဆိုင်ရင်) `src` ရဲ့ အတွင်းမှာ ထားနိုင်ပါတယ်။

```tsx filename="mdx-components.tsx" switcher
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js filename="mdx-components.js" switcher
const components = {}

export function useMDXComponents() {
  return components
}
```

## Exports

### `useMDXComponents` function

File က `useMDXComponents` ဆိုတဲ့ function တစ်ခုတည်းကိုပဲ export လုပ်ရပါမယ်။ ဒီ function က arguments ဘာမှ လက်ခံပါဘူး။

```tsx filename="mdx-components.tsx" switcher
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js filename="mdx-components.js" switcher
const components = {}

export function useMDXComponents() {
  return components
}
```

## Version History (ဗားရှင်း မှတ်တမ်း)

| Version   | အပြောင်းအလဲ                  |
| --------- | ----------------------------- |
| `v13.1.2` | MDX Components ထည့်သွင်း။     |
