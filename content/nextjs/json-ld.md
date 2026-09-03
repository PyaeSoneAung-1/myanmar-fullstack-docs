---
title: "JSON-LD (Search Engines နဲ့ AI အတွက် Structured Data ထည့်သွင်းခြင်း)"
description: "JSON-LD — search engines နဲ့ AI တွေ page ရဲ့ ဖွဲ့စည်းပုံကို နားလည်နိုင်ဖို့ structured data တွေကို layout.js/page.js components တွေထဲက <script> tag နဲ့ ထည့်သွင်းနည်း; XSS injection ကာကွယ်ရန် JSON.stringify output ကို sanitize လုပ်နည်း, serialize-javascript/schema-dts လို community packages, Rich Results Test စတဲ့ validation tools များ"
order: 122
source: "https://nextjs.org/docs/app/guides/json-ld"
status: translated
updated: 2026-09-03
---

[JSON-LD](https://json-ld.org/) က structured data (စနစ်တကျ ဖွဲ့စည်းထားတဲ့ data) အတွက် format တစ်ခုပါ — search engines တွေနဲ့ AI တွေက page ရဲ့ content သက်သက်ထက် ကျော်လွန်ပြီး ဖွဲ့စည်းပုံကို နားလည်နိုင်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။ ဥပမာ — လူတစ်ဦး (person), event, organization, movie, book, recipe စတဲ့ entity အမျိုးအစား မြောက်မြားစွာကို ဖော်ပြဖို့ သုံးနိုင်ပါတယ်။

JSON-LD အတွက် ကျွန်တော်တို့ရဲ့ လက်ရှိ အကြံပြုချက်ကတော့ — structured data ကို သင့် `layout.js` (သို့) `page.js` components တွေထဲမှာ `<script>` tag အနေနဲ့ render လုပ်ဖို့ပါ။

အောက်ပါ code snippet က `JSON.stringify` ကို သုံးထားပါတယ် — ဒါက XSS injection မှာ သုံးတဲ့ အန္တရာယ်ရှိ strings တွေကို sanitize (သန့်စင်) လုပ်မပေးပါဘူး။ ဒီလို vulnerability မျိုး မဖြစ်အောင် `JSON-LD` payload ထဲက `HTML` tags တွေကို ဖယ်ရှားနိုင်ပါတယ် — ဥပမာ `<` ဆိုတဲ့ character ကို သူ့ရဲ့ unicode အစားထိုး `\u003c` နဲ့ ပြောင်းလိုက်တာမျိုးပါ။

အန္တရာယ် ဖြစ်နိုင်ချေရှိတဲ့ strings တွေကို sanitize လုပ်ဖို့ သင့်အဖွဲ့အစည်းရဲ့ အကြံပြုထားတဲ့ နည်းလမ်းကို ပြန်လည် သုံးသပ်ပါ၊ ဒါမှမဟုတ် [serialize-javascript](https://www.npmjs.com/package/serialize-javascript) လို `JSON.stringify` အတွက် community က ထိန်းသိမ်းထားတဲ့ အခြားရွေးချယ်စရာတွေကို သုံးပါ။

```tsx filename="app/products/[id]/page.tsx" switcher
export default async function Page({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* JSON-LD ကို သင့် page မှာ ထည့်ရန် */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* ... */}
    </section>
  )
}
```

```jsx filename="app/products/[id]/page.js" switcher
export default async function Page({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* JSON-LD ကို သင့် page မှာ ထည့်ရန် */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* ... */}
    </section>
  )
}
```

သင့်ရဲ့ structured data ကို Google ရဲ့ [Rich Results Test](https://search.google.com/test/rich-results) (သို့) ယေဘုယျသုံး [Schema Markup Validator](https://validator.schema.org/) နဲ့ စစ်ဆေး (validate) ပြီး စမ်းသပ်နိုင်ပါတယ်။

JSON-LD ကို TypeScript နဲ့ type သတ်မှတ်ချင်ရင် [`schema-dts`](https://www.npmjs.com/package/schema-dts) လို community packages တွေကို သုံးနိုင်ပါတယ်:

```tsx
import { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Next.js Sticker',
  image: 'https://nextjs.org/imgs/sticker.png',
  description: 'Dynamic at the speed of static.',
}
```

> **သိထားသင့်သည်:** `next/script` component က JavaScript တွေကို load လုပ်ပြီး execute လုပ်ဖို့ အထူး optimize လုပ်ထားတာပါ။ JSON-LD က executable code မဟုတ်ဘဲ structured data ဖြစ်လို့ — ဒီနေရာမှာတော့ native `<script>` tag ကသာ မှန်ကန်တဲ့ ရွေးချယ်မှုပါ။
