---
title: "basePath (sub-path အောက်တွင် deploy လုပ်ခြင်း)"
description: "basePath option — domain တစ်ခု၏ sub-path (ဥပမာ /docs) အောက်တွင် application ကို deploy လုပ်ရန် path prefix သတ်မှတ်ချက်; links နှင့် images အပေါ် သက်ရောက်ပုံ"
order: 86
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath"
status: translated
updated: 2026-09-02
---

Domain တစ်ခုရဲ့ sub-path အောက်မှာ Next.js application တစ်ခုကို deploy လုပ်ဖို့ `basePath` config option ကို သုံးနိုင်ပါတယ်။

`basePath` က application အတွက် path prefix တစ်ခု သတ်မှတ်ပေးနိုင်ပါတယ်။ ဥပမာ — `''` (empty string ဖြစ်တဲ့ default) အစား `/docs` ကို သုံးချင်ရင် `next.config.js` ကို ဖွင့်ပြီး `basePath` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',
}
```

> **သိထားသင့်သည်:** ဒီတန်ဖိုးကို client-side bundles တွေထဲမှာ inline လုပ်ထားလို့ — build time မှာ သတ်မှတ်ရပြီး re-build မလုပ်ဘဲ ပြောင်းလို့ မရပါဘူး။

### Links

`next/link` နဲ့ `next/router` တွေကို သုံးပြီး အခြား pages တွေဆီ link ချိတ်တဲ့အခါ — `basePath` ကို အလိုအလျောက် သက်ရောက်စေပါတယ်။

ဥပမာ — `basePath` ကို `/docs` လို့ သတ်မှတ်ထားရင် `/about` ကို သုံးတာက အလိုအလျောက် `/docs/about` ဖြစ်သွားပါလိမ့်မယ်။

```js
export default function HomePage() {
  return (
    <>
      <Link href="/about">About Page</Link>
    </>
  )
}
```

Output html:

```html
<a href="/docs/about">About Page</a>
```

ဒါကြောင့် `basePath` တန်ဖိုး ပြောင်းတဲ့အခါ — သင့် application ထဲက links အားလုံးကို ပြောင်းစရာ မလိုတော့ပါဘူး။

### Images

[`next/image`](/docs/nextjs/component-image) component ကို သုံးတဲ့အခါ — `src` ရဲ့ ရှေ့မှာ `basePath` ကို ထည့်ပေးဖို့ လိုအပ်ပါတယ်။

ဥပမာ — `basePath` ကို `/docs` လို့ သတ်မှတ်ထားရင် `/docs/me.png` ကို သုံးပြီး သင့် image ကို မှန်ကန်စွာ serve လုပ်နိုင်ပါတယ်။

```jsx
import Image from 'next/image'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/docs/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default Home
```
