---
title: "refresh function (Server Action ကနေ client router ကို refresh လုပ်ခြင်း)"
description: "refresh() — Server Action တစ်ခုအတွင်းကနေ client router ကို refresh လုပ်နည်း; Server Actions တွေမှာပဲ ခေါ်လို့ရပြီး Route Handlers, Client Components စတဲ့ အခြား context တွေမှာ error ဖြစ်ကြောင်း"
order: 68
source: "https://nextjs.org/docs/app/api-reference/functions/refresh"
status: translated
updated: 2026-09-02
---

`refresh` က [Server Action](https://nextjs.org/docs/app/guides/server-actions) တစ်ခုအတွင်းကနေ client router ကို refresh လုပ်နိုင်စေပါတယ်။

## အသုံးပြုပုံ (Usage)

`refresh` ကို Server Actions တွေအတွင်းကနေပဲ ခေါ်လို့ **ရပါတယ်**။ Route Handlers, Client Components (သို့) အခြား context တွေမှာတော့ သုံးလို့မရပါဘူး။

## Parameters

```tsx
refresh(): void;
```

## Returns

`refresh` က တန်ဖိုးတစ်ခုမှ ပြန်မပေးပါဘူး။

## ဥပမာများ

```ts filename="app/actions.ts" switcher
'use server'

import { refresh } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // Create the post in your database
  const post = await db.post.create({
    data: { title, content },
  })

  refresh()
}
```

```js filename="app/actions.js" switcher
'use server'

import { refresh } from 'next/cache'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // Create the post in your database
  const post = await db.post.create({
    data: { title, content },
  })

  refresh()
}
```

### Server Actions အပြင်မှာ သုံးရင် error တက်ခြင်း

```ts filename="app/api/posts/route.ts" switcher
import { refresh } from 'next/cache'

export async function POST() {
  // This will throw an error
  refresh()
}
```
