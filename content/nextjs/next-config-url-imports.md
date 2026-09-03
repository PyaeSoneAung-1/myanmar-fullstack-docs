---
title: "urlImports (external URLs မှ imports ခွင့်ပြုခြင်း)"
description: "urlImports option — external servers (URLs) မှ modules များကို တိုက်ရိုက် import လုပ်ခွင့်ပြုရန် experimental သတ်မှတ်ချက်; ယုံကြည်ရသော domains များကိုသာ allow list လုပ်ရန်, next.lock lockfile နှင့် security model အကြောင်း"
order: 168
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/urlImports"
status: translated
updated: 2026-09-03
---

URL imports တွေက (local disk ကနေ မဟုတ်ဘဲ) external servers တွေကနေ modules တွေကို တိုက်ရိုက် import လုပ်နိုင်စေတဲ့ experimental feature တစ်ခုပါ။

> **သတိပေးချက် (Warning):** သင့် machine ပေါ်မှာ download လုပ်ပြီး run မယ့်အရာမို့ — သင်ယုံကြည်ရတဲ့ domains တွေကိုပဲ သုံးပါ။ ဒီ feature က stable လို့ မသတ်မှတ်ရသေးချိန်အထိ — ဆင်ခြင်ဉာဏ်နဲ့ သတိကြီးကြီးထားပြီး သုံးပါ။

Opt-in လုပ်ဖို့ — ခွင့်ပြုထားတဲ့ URL prefixes တွေကို `next.config.js` ထဲမှာ ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
}
```

ပြီးရင် modules တွေကို URLs တွေကနေ တိုက်ရိုက် import လုပ်နိုင်ပါပြီ:

```js
import { a, b, c } from 'https://example.com/assets/some/module.js'
```

URL Imports တွေကို ပုံမှန် package imports တွေ သုံးလို့ရတဲ့ နေရာတိုင်းမှာ သုံးနိုင်ပါတယ်။

## Security Model

ဒီ feature ကို **security ကို ထိပ်တန်း ဦးစားပေး** အနေနဲ့ ဒီဇိုင်းလုပ်နေပါတယ်။ စတင်ဖို့ — URL imports တွေကို ဘယ် domains တွေကနေ လက်ခံမလဲ ဆိုတာကို သင်ကိုယ်တိုင် အတိအကျ ခွင့်ပြုပေးဖို့ တွန်းအားပေးတဲ့ experimental flag တစ်ခုကို ထည့်ထားပါတယ်။ နောက်ထပ် — URL imports တွေကို [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge) ကို သုံးပြီး browser sandbox ထဲမှာပဲ run ဖို့ ကန့်သတ်ခြင်းဖြင့် ဒီထက် ပိုလုံခြုံအောင် ဆက်လက် ဆောင်ရွက်နေပါတယ်။

## Lockfile

URL imports တွေ သုံးတဲ့အခါ Next.js က lockfile နဲ့ ဆွဲယူထားတဲ့ (fetched) assets တွေ ပါဝင်တဲ့ `next.lock` directory တစ်ခုကို ဖန်တီးပါတယ်။ ဒီ directory ကို `.gitignore` နဲ့ ဖျောက်ထားလို့ မရဘဲ — **Git ထဲ commit လုပ်ထားရပါမယ်**။

- `next dev` run လုပ်တဲ့အခါ Next.js က အသစ်တွေ့ရှိတဲ့ URL Imports တွေ အားလုံးကို download လုပ်ပြီး သင့် lockfile ထဲ ထည့်ပါတယ်။
- `next build` run လုပ်တဲ့အခါ Next.js က production အတွက် application ကို တည်ဆောက်ဖို့ lockfile ကိုပဲ သုံးပါတယ်။

ပုံမှန်အားဖြင့် network requests တွေ မလိုအပ်ဘဲ — ခေတ်မမီတော့တဲ့ (outdated) lockfile တစ်ခု ရှိနေရင် build က ကျရှုံးသွားပါတယ်။ ခြွင်းချက်တစ်ခုကတော့ `Cache-Control: no-cache` နဲ့ တုံ့ပြန်တဲ့ resources တွေပါ — ဒီ resources တွေက lockfile ထဲမှာ `no-cache` entry ရှိပြီး build တစ်ခုစီမှာ network ကနေ အမြဲ ဆွဲယူပါတယ်။

## Examples

### Skypack

```js
import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import { useEffect } from 'react'

export default () => {
  useEffect(() => {
    confetti()
  })
  return <p>Hello</p>
}
```

### Static Image Imports

```js
import Image from 'next/image'
import logo from 'https://example.com/assets/logo.png'

export default () => (
  <div>
    <Image src={logo} placeholder="blur" />
  </div>
)
```

### URLs in CSS

```css
.className {
  background: url('https://example.com/assets/hero.jpg');
}
```

### Asset Imports

```js
const logo = new URL('https://example.com/assets/file.txt', import.meta.url)

console.log(logo.pathname)

// "/_next/static/media/file.a9727b5d.txt" ဆိုတာကို ပုံနှိပ်ပါမယ်
```
