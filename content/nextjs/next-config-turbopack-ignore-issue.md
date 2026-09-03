---
title: "turbopack.ignoreIssue (Turbopack errors/warnings များကို ဖိနှိပ်ရန် သတ်မှတ်ချက်)"
description: "turbopack.ignoreIssue option — Turbopack errors နှင့် warnings အချို့ကို CLI output နှင့် error overlay တို့မှ ဖယ်ထုတ် (filter out) ရန် သတ်မှတ်ချက်များ; path, title, description fields များဖြင့် ကိုက်ညီမှု စည်းမျဉ်းများ သတ်မှတ်နိုင်; Turbopack (next dev --turbopack) သုံးသည့်အခါမှသာ ရနိုင်"
order: 218
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackIgnoreIssue"
status: translated
updated: 2026-09-03
---

`turbopack.ignoreIssue` option က Turbopack ရဲ့ errors နဲ့ warnings အချို့ကို filter လုပ်ပြီး — သူတို့ CLI output (သို့) error overlay ထဲမှာ မပေါ်အောင် ဖယ်ထုတ်ပေးနိုင်ပါတယ်။ သင့် application ကို မထိခိုက်စေတဲ့ အသိအမှတ်ပြုထားပြီးသား warnings တွေ — ဥပမာ ရည်ရွယ်ချက်ရှိရှိ မဖြေရှင်းထားတဲ့ (unresolved) optional dependencies လိုမျိုး — ကို ဖိနှိပ်ဖို့ အသုံးဝင်ပါတယ်။

ဒီ option က Turbopack (`next dev --turbopack`) သုံးတဲ့အခါမှသာ ရနိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/vendor/**',
      },
    ],
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/vendor/**',
      },
    ],
  },
}

module.exports = nextConfig
```

## Options

`ignoreIssue` array ထဲက rule တစ်ခုချင်းစီက အောက်ပါ fields တွေပါတဲ့ object တစ်ခု ဖြစ်ပါတယ်:

| Field                         | Type               | Required | Description                                |
| ----------------------------- | ------------------ | -------- | ------------------------------------------ |
| [`path`](#path)               | `string \| RegExp` | Yes      | Issue ဖြစ်ပွားရာ file path နဲ့ ကိုက်ညီမှု စစ်ဆေးသည် |
| [`title`](#title)             | `string \| RegExp` | No       | Issue title နဲ့ ကိုက်ညီမှု စစ်ဆေးသည်            |
| [`description`](#description) | `string \| RegExp` | No       | Issue description နဲ့ ကိုက်ညီမှု စစ်ဆေးသည်      |

Rule တစ်ခုထဲမှာ `path` နဲ့ သတ်မှတ်ထားတဲ့ တခြား fields တွေ **အားလုံး** ကိုက်ညီမှသာ issue ကို ဖိနှိပ်ပါတယ်။ `path` တစ်ခုတည်းပဲ ပေးထားရင် — ကိုက်ညီတဲ့ file ကနေ ထွက်လာတဲ့ issue မှန်သမျှ ဖိနှိပ်ခံရပါတယ်။

> **သိထားသင့်သည် (Good to know):** Issue titles နဲ့ descriptions တွေက Turbopack version တွေကြားမှာ ပြောင်းလဲနိုင်ပါတယ်။ `path` field ကတော့ ယေဘုယျအားဖြင့် တည်ငြိမ်ပေမယ့် — issue type တိုင်းအတွက် အမြဲတသမတ်တည်း ရှိမယ်လို့တော့ အာမခံထားတာ မဟုတ်ပါဘူး။ ဖြစ်နိုင်ရင် `title` (သို့) `description` ကိုက်ညီမှုတွေထက် ပိုတိကျတဲ့ `path` patterns တွေကို ဦးစားပေး သုံးပါ။

### path

Issue စတင်ဖြစ်ပွားတဲ့ file path နဲ့ ကိုက်ညီမှု စစ်ဆေးပေးတဲ့ — string အနေနဲ့ သုံးရင် **glob pattern**, (သို့) **regular expression** တစ်ခု ဖြစ်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      // Glob pattern: vendor/ အောက်က file မှန်သမျှကန့် issues တွေကို ဖိနှိပ်ပါ
      { path: '**/vendor/**' },
      // RegExp: pattern တစ်ခုနဲ့ ကိုက်ညီတဲ့ files တွေကန့် issues တွေကို ဖိနှိပ်ပါ
      { path: /node_modules\/legacy-lib/ },
    ],
  },
}
```

### title

Issue title နဲ့ ကိုက်ညီမှု စစ်ဆေးပေးတဲ့ — string အနေနဲ့ သုံးရင် **တိကျတဲ့ string ကိုက်ညီမှု (exact string match)**, (သို့) **regular expression** တစ်ခု ဖြစ်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/src/**',
        title: 'Module not found',
      },
    ],
  },
}
```

### description

Issue description နဲ့ ကိုက်ညီမှု စစ်ဆေးပေးတဲ့ — string အနေနဲ့ သုံးရင် **တိကျတဲ့ string ကိုက်ညီမှု (exact string match)**, (သို့) **regular expression** တစ်ခု ဖြစ်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/src/**',
        description: /Cannot find module 'optional-dep'/,
      },
    ],
  },
}
```

## Examples

### Optional dependencies အတွက် warnings များကို ဖိနှိပ်ခြင်း

သင့် code က optional `require()` call တစ်ခုကို `try/catch` နဲ့ ပတ်ထားရင် — Turbopack က "Module not found" warning တစ်ခုကို report လုပ်နိုင်ပါတယ်။ အောက်ပါအတိုင်း ဖိနှိပ်နိုင်ပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/lib/optional-feature/**',
        title: 'Module not found',
      },
    ],
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/lib/optional-feature/**',
        title: 'Module not found',
      },
    ],
  },
}

module.exports = nextConfig
```

### Rules အများအပြား ပေါင်းစပ်ခြင်း

Issues အမျိုးမျိုးကို ဖိနှိပ်ဖို့ rules တွေ အများအပြား သတ်မှတ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      { path: '**/vendor/**' },
      { path: '**/legacy/**', title: 'Module not found' },
      { path: /generated\//, description: /expected identifier/ },
    ],
  },
}
```

## Version History

| Version   | အပြောင်းအလဲ                            |
| --------- | ---------------------------------------- |
| `v16.2.0` | `turbopack.ignoreIssue` စတင် မိတ်ဆက်ခဲ့။ |
