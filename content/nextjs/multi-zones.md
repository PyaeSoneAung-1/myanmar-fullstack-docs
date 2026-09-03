---
title: "Multi-Zones နဲ့ Micro-Frontends တွေ တည်ဆောက်ခြင်း (Building Micro-Frontends with Multi-Zones)"
description: "Next.js Multi-Zones နဲ့ domain တစ်ခုတည်းအောက်မှာ Next.js apps အများအပြားကို deploy လုပ်ပြီး micro-frontends တည်ဆောက်နည်း — zone သတ်မှတ်ခြင်း (assetPrefix), requests တွေကို မှန်ကန်တဲ့ zone ဆီ routing လုပ်ခြင်း, zones အကြား linking နဲ့ code မျှဝေခြင်း"
order: 117
source: "https://nextjs.org/docs/app/guides/multi-zones"
status: translated
updated: 2026-09-03
---

<details open>

<summary>ဥပမာများ (Examples)</summary>

- [With Zones](https://github.com/vercel/next.js/tree/canary/examples/with-zones)

</details>

Multi-Zones ဆိုတာ micro-frontends တွေအတွက် ချဉ်းကပ်နည်းတစ်ခုဖြစ်ပြီး — domain တစ်ခုပေါ်က ကြီးမားတဲ့ application တစ်ခုကို path set တစ်ခုစီကို သီးခြား serve လုပ်တဲ့ Next.js applications ငယ်လေးတွေ အဖြစ် ခွဲထုတ်တာပါ။ Application ထဲက အခြားစာမျက်နှာတွေနဲ့ မဆက်စပ်တဲ့ page အစုအဝေးတွေ ရှိနေတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ ဒီ pages တွေကို zone သီးခြားတစ်ခုဆီ (ဆိုလိုတာက application သီးခြားတစ်ခု) ရွှေ့လိုက်ခြင်းဖြင့် — application တစ်ခုချင်းစီရဲ့ အရွယ်အစားကို လျှော့ချနိုင်ပြီး၊ ဒါက build times တွေကို ပိုကောင်းစေကာ zone တစ်ခုအတွက်ပဲ လိုအပ်တဲ့ code တွေကို ဖယ်ရှားပေးပါတယ်။ Applications တွေ သီးခြားစီ ခွဲထားလို့ — Multi-Zones က domain ပေါ်က အခြား applications တွေကိုပါ သူတို့ကြိုက်တဲ့ framework တစ်ခုခုကို သုံးခွင့် ပေးပါတယ်။

ဥပမာ — အောက်ပါ page set တွေကို ခွဲထုတ်ချင်တယ် ဆိုပါစို့:

- `/blog/*` — blog posts တွေ အားလုံးအတွက်
- `/dashboard/*` — user က dashboard ထဲ login ဝင်ထားချိန် pages တွေ အားလုံးအတွက်
- `/*` — အခြား zones တွေက မဖုံးလွှမ်းတဲ့ ကျန်ဝဘ်ဆိုက် အားလုံးအတွက်

Multi-Zones support နဲ့ဆိုရင် — application သုံးခုကို ဖန်တီးနိုင်ပြီး၊ အားလုံးက domain တစ်ခုတည်းပေါ်မှာ serve လုပ်ပြီး user အတွက်တော့ အတူတူပဲ မြင်ရပါတယ်။ ဒါပေမယ့် — application တစ်ခုချင်းစီကို တစ်ခုနဲ့တစ်ခု မသက်ဆိုင်ဘဲ သီးခြား develop လည်း လုပ်နိုင်၊ deploy လည်း လုပ်နိုင်ပါတယ်။

_Zone A, B, C သုံးခု — zone အမျိုးမျိုးကြားက routes တွေကြား hard navigation နဲ့ zone တစ်ခုတည်းအတွင်းက routes တွေကြား soft navigations တွေကို ပြသထားသည်။_

Zone တစ်ခုတည်းအတွင်းက pages တွေကြား navigate လုပ်တာက soft navigation ဖြစ်ပြီး — page ကို reload လုပ်စရာ မလိုတဲ့ navigation မျိုးပါ။ ဥပမာ ဒီ diagram ထဲမှာ `/` ကနေ `/products` ကို navigate လုပ်တာက soft navigation ဖြစ်ပါတယ်။

Zone တစ်ခုထဲက page တစ်ခုကနေ နောက် zone တစ်ခုထဲက page တစ်ခုဆီ (ဥပမာ `/` ကနေ `/dashboard`) navigate လုပ်တာကတော့ hard navigation ဖြစ်ပြီး — လက်ရှိ page ရဲ့ resources တွေကို ဖြုတ်ချပြီး page အသစ်ရဲ့ resources တွေကို တင်ပါတယ်။ မကြာခဏ အတူတူ သွားလေ့ရှိတဲ့ pages တွေက hard navigations တွေ မဖြစ်ရအောင် — zone တစ်ခုတည်းထဲမှာ နေသင့်ပါတယ်။

## Zone တစ်ခုကို ဘယ်လို သတ်မှတ်မလဲ

Zone တစ်ခုဆိုတာ သာမန် Next.js application တစ်ခုပါပဲ — အခြား zones တွေထဲက pages တွေနဲ့ static files တွေနဲ့ မတိုက်မိအောင် [assetPrefix](/docs/nextjs/next-config-asset-prefix) တစ်ခုကိုပါ configure လုပ်ထားတာ ဖြစ်ပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: '/blog-static',
}
```

Next.js ရဲ့ assets တွေ (JavaScript နဲ့ CSS လိုမျိုး) ကို — အခြား zones တွေရဲ့ assets တွေနဲ့ မတိုက်မိစေဖို့ `assetPrefix` နဲ့ ရှေ့ဆက်ထည့်ပါတယ်။ ဒီ assets တွေကို zone တစ်ခုချင်းစီအတွက် `/assetPrefix/_next/...` အောက်မှာ serve လုပ်ပါတယ်။

ပိုတိကျတဲ့ zone တစ်ခုခုဆီ မရောက်တဲ့ path တွေ အားလုံးကို ကိုင်တွယ်တဲ့ default application ကတော့ `assetPrefix` မလိုပါဘူး။

Next.js 15 ထက် အဟောင်းတွေမှာတော့ — static assets တွေကို ကိုင်တွယ်ဖို့ rewrite တစ်ခု ထပ်လိုနိုင်ပါသေးတယ်။ Next.js 15 မှာတော့ ဒါ မလိုတော့ပါဘူး။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: '/blog-static',
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/blog-static/_next/:path+',
          destination: '/_next/:path+',
        },
      ],
    }
  },
}
```

## Requests တွေကို မှန်ကန်တဲ့ zone ဆီ ဘယ်လို route လုပ်မလဲ

Multi Zones set-up မှာ — path တွေကို application အမျိုးမျိုးက serve လုပ်နေလို့ — path တွေကို မှန်ကန်တဲ့ zone ဆီ route လုပ်ဖို့ လိုပါတယ်။ ဒါကို HTTP proxy တစ်ခုခုနဲ့ လုပ်နိုင်ပေမယ့် — Next.js applications တစ်ခုကိုလည်း domain တစ်ခုလုံးအတွက် requests တွေကို route လုပ်ဖို့ သုံးနိုင်ပါတယ်။

Next.js application တစ်ခုကို သုံးပြီး မှန်ကန်တဲ့ zone ဆီ route လုပ်ဖို့ — [`rewrites`](/docs/nextjs/next-config-rewrites) ကို သုံးနိုင်ပါတယ်။ Zone တစ်ခုခုက serve လုပ်တဲ့ path တစ်ခုချင်းစီအတွက် — အဲဒီ path ကို zone တစ်ခုခုရဲ့ domain ဆီ ပို့ပေးမယ့် rewrite rule တစ်ခု ထည့်ရပြီး — static assets တွေအတွက် requests တွေကိုလည်း rewrite လုပ်ဖို့ လိုပါတယ်။ ဥပမာ:

```js filename="next.config.js"
async rewrites() {
    return [
        {
            source: '/blog',
            destination: `${process.env.BLOG_DOMAIN}/blog`,
        },
        {
            source: '/blog/:path+',
            destination: `${process.env.BLOG_DOMAIN}/blog/:path+`,
        },
        {
            source: '/blog-static/:path+',
            destination: `${process.env.BLOG_DOMAIN}/blog-static/:path+`,
        }
    ];
}
```

`destination` က zone က serve လုပ်တဲ့ URL တစ်ခု ဖြစ်ရမှာပြီး — scheme နဲ့ domain ပါ ထည့်ရပါတယ်။ ဒါက zone ရဲ့ production domain ကို ညွှန်သင့်ပြီး — local development မှာ `localhost` ဆီ route လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်။

> **Good to know**: URL paths တွေက zone တစ်ခုအတွက်ပဲ သီးသန့် ဖြစ်သင့်ပါတယ်။ ဥပမာ — zone နှစ်ခုက `/blog` ကို တစ်ပြိုင်နက် serve လုပ်ဖို့ ကြိုးစားရင် routing conflict တစ်ခု ဖြစ်ပါလိမ့်မယ်။

### Proxy သုံးပြီး requests route လုပ်ခြင်း

[`rewrites`](/docs/nextjs/next-config-rewrites) ကတစ်ဆင့် requests တွေကို route လုပ်တာက — requests တွေရဲ့ latency overhead ကို အနည်းဆုံး ဖြစ်အောင် လုပ်လို့ အကြံပြုထားပါတယ်။ ဒါပေမယ့် — routing လုပ်တဲ့အခါ dynamic ဆုံးဖြတ်ချက်တစ်ခု လိုအပ်တဲ့အခါမှာတော့ proxy ကိုလည်း သုံးနိုင်ပါတယ်။ ဥပမာ — migration တစ်ခုရဲ့အတွင်း feature flag တစ်ခုကို သုံးပြီး path တစ်ခုကို ဘယ်နေရာကို route လုပ်ရမလဲ ဆုံးဖြတ်နေတယ်ဆိုရင် — proxy ကို သုံးနိုင်ပါတယ်။

```js filename="proxy.js"
export async function proxy(request) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/your-path' && myFeatureFlag.isEnabled()) {
    return NextResponse.rewrite(`${rewriteDomain}${pathname}${search}`)
  }
}
```

## Zones အကြား linking လုပ်ခြင်း

Zone တစ်ခုခုထဲက path တွေဆီ ညွှန်တဲ့ links တွေက — Next.js ရဲ့ [`<Link>`](/docs/nextjs/component-link) component အစား `a` tag ကို သုံးသင့်ပါတယ်။ ဘာလို့ဆို — Next.js က `<Link>` component ထဲက relative path တိုင်းကို prefetch လုပ်ပြီး soft navigate လုပ်ဖို့ ကြိုးစားမှာ ဖြစ်ပြီး — အဲဒါက zones တစ်ခုကို ဖြတ်ပြီး အလုပ်မလုပ်လို့ပါ။

## Code မျှဝေခြင်း

Zones အမျိုးမျိုးကို ဖွဲ့စည်းထားတဲ့ Next.js applications တွေက ဘယ် repository မှာမဆို နေနိုင်ပါတယ်။ ဒါပေမယ့် — code တွေ ပိုလွယ်ကူစွာ မျှဝေနိုင်ဖို့ ဒီ zones တွေကို [monorepo](https://en.wikipedia.org/wiki/Monorepo) တစ်ခုထဲ ထားတာက မကြာခဏ အဆင်ပြေပါတယ်။ Repository အမျိုးမျိုးမှာ နေတဲ့ zones တွေအတွက်ကျတော့ — public (သို့) private NPM packages တွေကိုလည်း code မျှဝေဖို့ သုံးနိုင်ပါတယ်။

Zones အမျိုးမျိုးထဲက pages တွေက အချိန်အမျိုးမျိုးမှာ release ဖြစ်နိုင်လို့ — zones အမျိုးမျိုးကြားမှာ features တွေကို တစ်ပြိုင်တည်း enable/disable လုပ်ဖို့ feature flags တွေ အသုံးဝင်နိုင်ပါတယ်။

## Server Actions

[Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) ကို Multi-Zones နဲ့ သုံးတဲ့အခါ — သင့် user-facing domain က applications အများအပြားကို serve လုပ်နိုင်လို့ — user-facing origin ကို ရှင်းရှင်းလင်းလင်း allow လုပ်ပေးရပါတယ်။ သင့် `next.config.js` file ထဲမှာ အောက်ပါစာကြောင်းတွေ ထည့်ပါ:

```js filename="next.config.js"
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['your-production-domain.com'],
    },
  },
}
```

အသေးစိတ်အတွက် [`serverActions.allowedOrigins`](/docs/nextjs/next-config-server-actions) ကို ကြည့်ပါ။
