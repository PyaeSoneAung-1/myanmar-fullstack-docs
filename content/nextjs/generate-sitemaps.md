---
title: "generateSitemaps function (sitemaps အများအပြား ဖန်တီးခြင်း)"
description: "generateSitemaps() — သင့် application အတွက် sitemap တစ်ခုထက်ပို ဖန်တီးနည်း; id တစ်ခုစီအလိုက် /sitemap/[id].xml URLs တွေ ထုတ်လုပ်ပုံနဲ့ ဥပမာ"
order: 64
source: "https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps"
status: translated
updated: 2026-09-02
---

သင့် application အတွက် sitemaps အများအပြား ဖန်တီးဖို့ `generateSitemaps` function ကို သုံးနိုင်ပါတယ်။

## Returns (ပြန်ပေးသည့်တန်ဖိုး)

`generateSitemaps` က `id` property တစ်ခုပါတဲ့ objects array တစ်ခုကို ပြန်ပေးပါတယ်။

## URLs

ဖန်တီးလိုက်တဲ့ sitemaps တွေကို `/.../sitemap/[id].xml` မှာ ရနိုင်ပါမယ်။ ဥပမာ — `/product/sitemap/1.xml`။

## ဥပမာ

ဥပမာ — `generateSitemaps` သုံးပြီး sitemap တစ်ခုကို ခွဲဖို့ sitemap `id` ပါတဲ့ objects array တစ်ခုကို ပြန်ပေးပါ။ ပြီးရင် `id` ကို သုံးပြီး ထူးခြားတဲ့ sitemaps တစ်ခုစီကို ဖန်တီးပါ။

```ts filename="app/product/sitemap.ts" switcher
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

```js filename="app/product/sitemap.js" switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props) {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

## Version History

| Version   | အပြောင်းအလဲ                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v16.0.0` | `generateSitemaps` ကနေ ပြန်ပေးတဲ့ `id` values တွေကို အခု `string` အဖြစ် resolve ဖြစ်တဲ့ promise တစ်ခုအနေနဲ့ sitemap function ဆီ ပေးပို့ပါတယ်။       |
| `v15.0.0` | `generateSitemaps` က development နဲ့ production ကြား တစ်သမတ်တည်း URLs တွေ ထုတ်ပေးတော့ပါတယ်။                                                      |
| `v13.3.2` | `generateSitemaps` ကို စတင် မိတ်ဆက်။ Development မှာ ဖန်တီးထားတဲ့ sitemap ကို `/.../sitemap.xml/[id]` မှာ ကြည့်နိုင်ပါတယ်။ ဥပမာ — `/product/sitemap.xml/1`။ |
