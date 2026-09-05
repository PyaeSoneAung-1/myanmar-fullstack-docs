---
title: "Metadata Files (Metadata file conventions)"
description: "Route segments တွေဆီ special metadata files တွေ ထည့်သွင်းခြင်းဖြင့် file-based metadata သတ်မှတ်ခြင်း — static files (ဥပမာ opengraph-image.jpg) (သို့) code နဲ့ ထုတ်လုပ်တဲ့ dynamic variants (ဥပမာ opengraph-image.js); Next.js က files တွေကို အလိုအလျောက် serve လုပ်ပြီး head elements တွေကို update လုပ်ပုံ"
order: 266
source: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata"
status: translated
updated: 2026-09-05
---

ဒီ docs အပိုင်းက **Metadata file conventions** တွေကို လွှမ်းခြုံပါတယ်။ File-based metadata ကို — route segments တွေဆီ special metadata files တွေ ထည့်သွင်းခြင်းအားဖြင့် သတ်မှတ်နိုင်ပါတယ်။

File convention တစ်ခုချင်းစီကို — static file (ဥပမာ — `opengraph-image.jpg`) အနေနဲ့ ဖြစ်စေ၊ file ကို code နဲ့ ထုတ်လုပ်ပေးတဲ့ dynamic variant (ဥပမာ — `opengraph-image.js`) အနေနဲ့ ဖြစ်စေ သတ်မှတ်နိုင်ပါတယ်။

File တစ်ခုကို သတ်မှတ်လိုက်တာနဲ့ — Next.js က file ကို အလိုအလျောက် serve လုပ်ပြီး (production မှာ caching အတွက် hashes တွေ ပါဝင်ပါတယ်) — asset ရဲ့ URL, file type, image size စတဲ့ မှန်ကန်တဲ့ metadata တွေနဲ့အတူ သက်ဆိုင်ရာ head elements တွေကိုပါ update လုပ်ပေးပါတယ်။

> **သိထားသင့်သည်:**
>
> - [`sitemap.ts`](/docs/nextjs/sitemap), [`opengraph-image.tsx`](/docs/nextjs/opengraph-image), [`icon.tsx`](/docs/nextjs/app-icons) လိုမျိုး Special Route Handlers တွေနဲ့ [အခြား metadata files](/docs/nextjs/metadata-files) တွေကို default အနေနဲ့ cache လုပ်ပါတယ်။
> - [`proxy.ts`](/docs/nextjs/file-conventions-proxy) နဲ့ တွဲသုံးမယ်ဆိုရင် — metadata files တွေကို ချန်လှပ်ဖို့ [matcher ကို configure](/docs/nextjs/file-conventions-proxy#matcher) လုပ်ပါ။
