---
title: "public Folder (static files serve လုပ်ခြင်း)"
description: "Root directory ထဲက public folder အောက်မှာ images လို static files တွေ ထည့်ပြီး base URL (/) ကနေ ကိုးကားနည်း — caching အပြုအမူနဲ့ static metadata files အတွက် မှတ်ချက်"
order: 103
source: "https://nextjs.org/docs/app/api-reference/file-conventions/public-folder"
status: translated
updated: 2026-09-02
---

Next.js က root directory ထဲက `public` ဆိုတဲ့ folder အောက်မှာ images လို static files တွေကို serve လုပ်နိုင်ပါတယ်။ `public` ထဲက files တွေကို သင့် code ထဲမှာ base URL (`/`) ကနေ စတင်ပြီး ကိုးကားနိုင်ပါတယ်။

ဥပမာ — `public/avatars/me.png` file ကို `/avatars/me.png` path ကို သွားကြည့်ခြင်းအားဖြင့် မြင်နိုင်ပါတယ်။ အဲဒီ image ကို ပြသဖို့ code က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```jsx filename="avatar.js"
import Image from 'next/image'

export function Avatar({ id, alt }) {
  return <Image src={`/avatars/${id}.png`} alt={alt} width="64" height="64" />
}

export function AvatarOfMe() {
  return <Avatar id="me" alt="A portrait of me" />
}
```

## Caching (Cache ပြုလုပ်ခြင်း)

Next.js က `public` folder ထဲက assets တွေကို — ပြောင်းလဲနိုင်လို့ — လုံခြုံစွာ cache မလုပ်နိုင်ပါဘူး။ အသုံးပြုတဲ့ default caching headers တွေက:

```jsx
Cache-Control: public, max-age=0
```

## Robots, Favicons နဲ့ အခြားအရာများ

`robots.txt`, `favicon.ico` စတဲ့ static metadata files တွေအတွက်တော့ — `app` folder ထဲမှာ [special metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) တွေကို သုံးသင့်ပါတယ်။
