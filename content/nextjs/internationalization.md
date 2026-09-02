---
title: "Internationalization"
description: "ဘာသာစကားမျိုးစုံ support လုပ်ဖို့ internationalized routing နဲ့ localized content — locale ရွေးချယ်ခြင်း, sub-path/domain routing, dictionaries နဲ့ localization, next/root-params နဲ့ locale share လုပ်ခြင်း, static rendering"
order: 16
source: "https://nextjs.org/docs/app/guides/internationalization"
status: translated
updated: 2026-09-01
---

Next.js က ဘာသာစကားမျိုးစုံ support လုပ်ဖို့ content တွေရဲ့ routing နဲ့ rendering ကို configure လုပ်နိုင်စေပါတယ်။ သင့် site ကို locales အမျိုးမျိုးနဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်တာမှာ — translated content (localization) နဲ့ internationalized routes တွေ ပါဝင်ပါတယ်။

## ဝေါဟာရများ

- **Locale:** ဘာသာစကားနဲ့ ပုံစံချမှု (formatting) နှစ်သက်မှု အစုတစ်ခုရဲ့ identifier တစ်ခုပါ။ ဒါက များသောအားဖြင့် user ရဲ့ နှစ်သက်ရာ ဘာသာစကားနဲ့ ဖြစ်နိုင်ရင် သူတို့ရဲ့ ပထဝီဒေသကိုပါ ပါဝင်ပါတယ်။
  - `en-US`: အမေရိကန်ပြည်ထောင်စုမှာ ပြောတဲ့ အင်္ဂလိပ်
  - `nl-NL`: နယ်သာလန်မှာ ပြောတဲ့ ဒတ်ခ်ျ
  - `nl`: ဒတ်ခ်ျ၊ ဒေသ သတ်မှတ်မထား

## Routing ခြုံငုံသုံးသပ်ချက်

ဘယ် locale ကို သုံးမလဲဆိုတာ ရွေးဖို့ — browser ထဲက user ရဲ့ ဘာသာစကား နှစ်သက်မှုတွေကို သုံးဖို့ အကြံပြုပါတယ်။ သင့် နှစ်သက်ရာ ဘာသာစကား ပြောင်းလိုက်ရင် — သင့် application ဆီ ရောက်လာတဲ့ `Accept-Language` header ကို ပြုပြင်မွမ်းမံပါတယ်။

ဥပမာ — အောက်ပါ libraries တွေကို သုံးပြီး — `Headers` တွေ, သင့် support လုပ်ဖို့ စီစဉ်ထားတဲ့ locales တွေနဲ့ default locale တို့ကို အခြေခံကာ — ဘယ် locale ကို ရွေးရမလဲဆိုတာ သိဖို့ incoming `Request` တစ်ခုကို ကြည့်နိုင်ပါတယ်:

```js
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en-US', 'nl-NL', 'nl']
let defaultLocale = 'en-US'

match(languages, locales, defaultLocale) // -> 'en-US'
```

Routing ကို sub-path (`/fr/products`) (သို့) domain (`my-site.fr/products`) အားဖြင့် နှစ်မျိုးလုံးနဲ့ internationalize လုပ်နိုင်ပါတယ်။ ဒီအချက်အလက်နဲ့ — [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) ထဲမှာ locale ပေါ် မူတည်ပြီး user ကို redirect လုပ်နိုင်ပါပြီ:

```js
import { NextResponse } from "next/server";

let locales = ['en-US', 'nl-NL', 'nl']

// နှစ်သက်ရာ locale ကို ရယူပါ — အပေါ်က အတိုင်း (သို့) library တစ်ခု သုံးပြီး
function getLocale(request) { ... }

export function proxy(request) {
  // Pathname ထဲမှာ support လုပ်ထားတဲ့ locale တစ်ခုခု ရှိမရှိ စစ်ဆေးပါ
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Locale မရှိရင် redirect လုပ်ပါ
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // ဥပမာ — incoming request က /products
  // New URL က အခု /en-US/products ဖြစ်သွားပါပြီ
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Internal paths တွေအားလုံးကို ကျော်ပါ (_next)
    '/((?!_next).*)',
    // Optional: root (/) URL ပေါ်မှာပဲ run လုပ်ဖို့
    // '/'
  ],
}
```

နောက်ဆုံးအနေနဲ့ — `app/` ထဲက special files တွေအားလုံးကို `app/[lang]` အောက်မှာ nested ဖြစ်အောင် သေချာလုပ်ပါ။ ဒါက Next.js router ကို route ထဲမှာ locales အမျိုးမျိုးကို dynamic အနေနဲ့ ကိုင်တွယ်နိုင်စေပြီး — `lang` parameter ကို layout နဲ့ page တိုင်းဆီ ပို့ပေးပါတယ်။ ဥပမာ:

```tsx
// အခု လက်ရှိ locale ကို ဝင်ရောက်သုံးနိုင်ပါပြီ
// ဥပမာ /en-US/products -> `lang` က "en-US"
export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  return ...
}
```

> **သိထားသင့်သည်** — `PageProps` နဲ့ `LayoutProps` တွေက route parameters တွေအတွက် strong typing ပေးတဲ့ globally available TypeScript helpers တွေပါ။ အသေးစိတ်အတွက် [PageProps](https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper) နဲ့ [LayoutProps](https://nextjs.org/docs/app/api-reference/file-conventions/layout#layout-props-helper) တွေကို ကြည့်ပါ။

Root layout ကိုလည်း folder အသစ်ထဲမှာ nested လုပ်နိုင်ပါတယ် (ဥပမာ `app/[lang]/layout.js`)။

## Localization (ဒေသအလိုက် ပြောင်းလဲခြင်း)

User ရဲ့ နှစ်သက်ရာ locale ပေါ် မူတည်ပြီး ပြသတဲ့ content တွေကို ပြောင်းလဲတာ (localization) က Next.js အတွက် သီးသန့် ကိစ္စ မဟုတ်ပါဘူး။ အောက်မှာ ဖော်ပြထားတဲ့ ပုံစံတွေက web application မဆိုနဲ့ပဲ အလားတူ အလုပ်လုပ်ပါတယ်။

ကျွန်တော်တို့ app ထဲမှာ အင်္ဂလိပ်နဲ့ ဒတ်ခ်ျ content နှစ်မျိုးစလုံးကို support လုပ်ချင်တယ်လို့ ယူဆကြည့်ပါ။ "dictionaries" နှစ်ခု ထားရှိနိုင်ပါတယ် — ဒါတွေက key တစ်ခုကနေ localized string တစ်ခုဆီ mapping ပေးတဲ့ objects တွေပါ။ ဥပမာ:

```json
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

```json
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```

ပြီးတော့ — လိုအပ်တဲ့ locale အတွက် translations တွေကို load လုပ်ဖို့ `getDictionary` function တစ်ခု ဖန်တီးနိုင်ပါတယ်:

```ts
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
```

လက်ရှိ ရွေးထားတဲ့ ဘာသာစကားပေါ် မူတည်ပြီး — layout (သို့) page တစ်ခုထဲမှာ dictionary ကို ယူနိုင်ပါတယ်။

`lang` က `string` အဖြစ် type လုပ်ထားလို့ — `hasLocale` ကို သုံးတာက type ကို သင့် support လုပ်ထားတဲ့ locales ဆီ ကျဉ်းမြောင်းစေပါတယ်။ ပြီးတော့ — translation တစ်ခု ပျောက်နေရင် runtime error အစား 404 ပြန်ပေးဖို့လည်း သေချာစေပါတယ်။

```tsx
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'

export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

`app/` directory ထဲက layouts နဲ့ pages တွေအားလုံးက default အနေနဲ့ [Server Components](/docs/nextjs/server-client-components) ဖြစ်လို့ — translation files တွေရဲ့ အရွယ်အစားက သင့် client-side JavaScript bundle ရဲ့ အရွယ်အစားကို သက်ရောက်မှာကို စိုးရိမ်စရာ မလိုပါဘူး။ ဒီ code က **server ပေါ်မှာပဲ** run လုပ်ပြီး — ရလဒ်ထွက်တဲ့ HTML ကိုပဲ browser ဆီ ပို့ပေးပါတယ်။

## Locale ကို app တစ်ခုလုံးမှာ share လုပ်ခြင်း

Locale ကို လက်ခံတဲ့ page ထက်ကျော်ပြီး — shared data-fetching utilities (သို့) နက်နက်ရှိုင်းရှိုင်း nested ဖြစ်တဲ့ components တွေမှာလည်း မကြာခဏ လိုအပ်ပါတယ်။ `lang` ကို အလွှာတစ်ခုချင်းစီကနေ prop drilling လုပ်မယ့်အစား — [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params) နဲ့ တိုက်ရိုက် ဖတ်နိုင်ပါတယ်။

`next/root-params` က root layout ရဲ့ အပေါ်မှာ ရှိတဲ့ dynamic segment တစ်ခုချင်းစီအတွက် getter တစ်ခုစီ ထုတ်ပေးပါတယ်။ Route တိုင်းက `app/[lang]` အောက်မှာ nested ဖြစ်လို့ — `lang` က root parameter တစ်ခု ဖြစ်ပြီး — Server Component (သို့) server-side utility မဆို သူ့ရဲ့ getter ကို ခေါ်နိုင်ပါတယ်။ Locale lookup ကို `getDictionary` ထဲ ရွှေ့လိုက်လို့ — ခေါ်သူတွေက `lang` ကို ထပ်မပို့တော့ပါဘူး:

```ts
import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async () => {
  const locale = await lang()
  if (!hasLocale(locale)) notFound()
  return dictionaries[locale]()
}
```

> **သိထားသင့်သည်** — `next/root-params` ကနေ import လုပ်တဲ့ files တွေက `import 'server-only'` မလိုအပ်ပါဘူး။ Client Component တစ်ခုမှာ သုံးရင် import ကိုယ်တိုင် build time မှာ ကျရှုံးပါပြီ။

Pages နဲ့ components တွေက ဒီနောက် — locale က အတွင်းပိုင်းမှာ ဖြေရှင်းလို့ — arguments မပါဘဲ `getDictionary()` ကို ခေါ်ပါတယ်:

```tsx
import { getDictionary } from './dictionaries'

export default async function Page() {
  const dict = await getDictionary()
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

> **သိထားသင့်သည်** — Root parameter getters တွေက Server Components နဲ့ server-side utilities တွေမှာ run လုပ်ပြီး — Client Components, Server Actions (သို့) Route Handlers တွေမှာတော့ run မလုပ်ပါဘူး။ API အပြည့်အစုံနဲ့ caching နဲ့အတူ ပြုမူပုံအတွက် [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params) ကို ကြည့်ပါ။

## Static Rendering

Locales အစုတစ်ခုအတွက် static routes တွေ generate လုပ်ဖို့ — page (သို့) layout မဆိုမှာ `generateStaticParams` ကို သုံးနိုင်ပါတယ်။ ဒါက global ဖြစ်နိုင်ပါတယ် — ဥပမာ root layout မှာ:

```tsx
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}
```

## အရင်းအမြစ်များ

- [Minimal i18n routing and translations](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing)
- [`next-intl`](https://next-intl.dev)
- [`next-international`](https://github.com/QuiiBz/next-international)
- [`next-i18n-router`](https://github.com/i18nexus/next-i18n-router)
- [`paraglide-next`](https://inlang.com/m/osslbuzt/paraglide-next-i18n)
- [`lingui`](https://lingui.dev)
- [`tolgee`](https://tolgee.io/apps-integrations/next)
- [`next-intlayer`](https://intlayer.org/doc/environment/nextjs)
- [`gt-next`](https://generaltranslation.com/en/docs/next)
