---
title: "default.js (Parallel Routes fallback file)"
description: "default.js file convention — full-page load ပြီးနောက် Next.js က slot ရဲ့ active state ကို ပြန်မရနိုင်တဲ့အခါ Parallel Routes အတွင်း fallback UI render လုပ်ဖို့ သုံးတဲ့ file"
order: 31
source: "https://nextjs.org/docs/app/api-reference/file-conventions/default"
status: translated
updated: 2026-09-02
---

`default.js` file ကို [Parallel Routes](/docs/nextjs/parallel-routes) အတွင်းမှာ fallback (လဲလှယ်ပြသစရာ UI) တစ်ခုကို render လုပ်ဖို့ သုံးပါတယ် — full-page load (စာမျက်နှာ တစ်ခုလုံး ပြန်တင်ခြင်း) အပြီးမှာ Next.js က slot တစ်ခုရဲ့ active state (လက်ရှိ ပြသနေတဲ့ subpage အခြေအနေ) ကို ပြန်လည် ရယူနိုင်စွမ်း မရှိတဲ့အခါမျိုးမှာ ဖြစ်ပါတယ်။

[Soft navigation](/docs/nextjs/linking) (client-side navigation) လုပ်နေချိန်မှာ Next.js က slot တစ်ခုချင်းစီအတွက် active *state* (subpage) ကို ခြေရာခံ မှတ်သားထားပါတယ်။ ဒါပေမယ့် — hard navigation (full-page load လိုမျိုး) တွေမှာတော့ Next.js က ဒီ active state ကို ပြန်လည် ရယူလို့ မရပါဘူး။ ဒီလိုအခြေအနေမျိုးမှာ — လက်ရှိ URL နဲ့ မကိုက်ညီတဲ့ subpages တွေအတွက် `default.js` file တစ်ခုကို render လုပ်ပေးနိုင်ပါတယ်။

အောက်ပါ folder structure ကို ဥပမာအနေနဲ့ ကြည့်ပါ — `@team` slot မှာ `settings` page ရှိပြီး `@analytics` slot မှာတော့ မရှိပါဘူး။

`/settings` ကို navigate လုပ်တဲ့အခါ — `@team` slot က `settings` page ကို render လုပ်မယ့်အချိန်မှာ `@analytics` slot ကတော့ သူ့ရဲ့ လက်ရှိ active ဖြစ်နေတဲ့ page ကို ဆက်ထိန်းထားပါတယ်။

Refresh (full-page load) လုပ်လိုက်တာနဲ့ — Next.js က `@analytics` အတွက် `default.js` တစ်ခုကို render လုပ်ပါလိမ့်မယ်။ `default.js` မရှိဘူးဆိုရင် — named slots (`@team`, `@analytics` စသည်) တွေအတွက် error တစ်ခု ပြန်ပေးပြီး ဆက်လုပ်ဖို့ `default.js` တစ်ခု သတ်မှတ်ပေးဖို့ လိုအပ်ပါတယ်။ ဒီလိုအခြေအနေတွေမှာ အရင်တုန်းကလို 404 ပြန်ပေးတဲ့ အပြုအမူကို ထိန်းသိမ်းချင်ရင်တော့ — အောက်ပါအတိုင်း `default.js` တစ်ခု ဖန်တီးနိုင်ပါတယ်:

```tsx
// app/@team/default.js
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

ဒါ့အပြင် — `children` က implicit slot (သွယ်ဝိုက် ပါရှိနေတဲ့ slot) တစ်ခု ဖြစ်လို့ — parent page ရဲ့ active state ကို Next.js က ပြန်လည် ရယူနိုင်ခြင်း မရှိတဲ့အခါ `children` အတွက် fallback တစ်ခု render လုပ်ဖို့ `default.js` file တစ်ခုကိုလည်း ဖန်တီးပေးရပါမယ်။ `children` slot အတွက် `default.js` ကို မဖန်တီးထားဘူးဆိုရင် — အဲဒီ route အတွက် 404 page တစ်ခု ပြန်ပေးမှာ ဖြစ်ပါတယ်။

## Reference

### `params` (optional)

`params` က promise တစ်ခု ဖြစ်ပြီး — root segment ကနေ slot ရဲ့ subpages အထိ [dynamic route parameters](/docs/nextjs/dynamic-routes) တွေ ပါဝင်တဲ့ object တစ်ခုကို resolve လုပ်ပေးပါတယ်။ ဥပမာ:

```tsx
// app/[artist]/@sidebar/default.js
export default async function Default({
  params,
}: {
  params: Promise<{ artist: string }>
}) {
  const { artist } = await params
}
```

| ဥပမာ | URL | `params` |
|---|---|---|
| `app/[artist]/@sidebar/default.js` | `/zack` | `Promise<{ artist: 'zack' }>` |
| `app/[artist]/[album]/@sidebar/default.js` | `/zack/next` | `Promise<{ artist: 'zack', album: 'next' }>` |

- `params` prop က promise ဖြစ်လို့ — တန်ဖိုးတွေ ဝင်ရောက်ဖတ်ဖို့ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါတယ်။
- Version 14 နဲ့ အစောပိုင်းတွေမှာ `params` က synchronous prop တစ်ခု ဖြစ်ခဲ့ပါတယ်။ Backwards compatibility (နောက်ပြန် လိုက်ဖက်မှု) အတွက် Next.js 15 မှာ synchronous အနေနဲ့လည်း ဆက်ဖတ်လို့ရသေးပေမယ့် — ဒီအပြုအမူကတော့ နောင်မှာ deprecated (ဖျက်သိမ်းသွားမယ့်) ဖြစ်ပါလိမ့်မယ်။

## Parallel Routes အကြောင်း ဆက်လေ့လာရန်

- [Parallel Routes](/docs/nextjs/parallel-routes) — မြင်ကွင်းတစ်ခုတည်းမှာ page တစ်ခု (သို့) တစ်ခုထက်ပိုတဲ့ pages တွေကို တစ်ပြိုင်နက် render လုပ်ပြီး — တစ်ခုချင်းစီကို သီးခြား navigate လုပ်နိုင်တဲ့ ပုံစံပါ။ Highly dynamic applications တွေအတွက် သင့်တော်တဲ့ pattern တစ်ခုပါ။
