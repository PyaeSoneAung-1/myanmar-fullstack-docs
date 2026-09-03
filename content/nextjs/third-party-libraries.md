---
title: "Third-Party Libraries တွေကို Optimize လုပ်ခြင်း"
description: "`@next/third-parties` package နဲ့ လူကြိုက်များတဲ့ third-party libraries တွေရဲ့ performance ကို optimize လုပ်နည်း — Google Tag Manager, Google Analytics, Google Maps Embed နဲ့ YouTube Embed components တွေ ထည့်သွင်းပုံ, events ပို့ပုံ နဲ့ options ဇယားများ အပြည့်အစုံ"
order: 135
source: "https://nextjs.org/docs/app/guides/third-party-libraries"
status: translated
updated: 2026-09-03
---

**`@next/third-parties`** က — သင့် Next.js application ထဲမှာ လူကြိုက်များတဲ့ third-party libraries တွေကို load လုပ်တဲ့အခါ performance နဲ့ developer experience (developer အတွေ့အကြုံ) တွေကို မြှင့်တင်ပေးတဲ့ components နဲ့ utilities အစုအဝေးတစ်ခု ပံ့ပိုးပေးတဲ့ library တစ်ခုပါ။

`@next/third-parties` က ပေးတဲ့ third-party integrations အားလုံးကို performance နဲ့ အသုံးပြုရလွယ်ကူမှုအတွက် optimize လုပ်ထားပါတယ်။

## စတင်ခြင်း (Getting Started)

စတင်ဖို့ — `@next/third-parties` library ကို install လုပ်ပါ:

```bash package="pnpm"
pnpm add @next/third-parties@latest next@latest
```

```bash package="npm"
npm install @next/third-parties@latest next@latest
```

```bash package="yarn"
yarn add @next/third-parties@latest next@latest
```

```bash package="bun"
bun add @next/third-parties@latest next@latest
```

`@next/third-parties` က လက်ရှိမှာ တက်ကြွစွာ ဖွံ့ဖြိုးဆဲ **experimental** library တစ်ခုပါ။ Third-party integrations အသစ်တွေ ထပ်ထည့်နေချိန်မှာ — ဒါကို **latest** (သို့) **canary** flags တွေနဲ့ install လုပ်ဖို့ အကြံပြုပါတယ်။

## Google Third-Parties

Google ကနေ ထောက်ပံ့ထားတဲ့ third-party libraries အားလုံးကို `@next/third-parties/google` ကနေ import လုပ်နိုင်ပါတယ်။

### Google Tag Manager

`GoogleTagManager` component ကို သုံးပြီး သင့် page မှာ [Google Tag Manager](https://developers.google.com/tag-platform/tag-manager) container တစ်ခုကို တည်ဆောက် (instantiate) နိုင်ပါတယ်။ Default အနေနဲ့ — page ပေါ်မှာ hydration ဖြစ်ပြီးမှ မူရင်း inline script ကို fetch လုပ်ပါတယ်။

Routes အားလုံးအတွက် Google Tag Manager ကို load လုပ်ဖို့ — component ကို သင့် root layout ထဲ တိုက်ရိုက် ထည့်ပြီး သင့် GTM container ID ကို ထည့်ပေးပါ:

```tsx filename="app/layout.tsx" switcher
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

Route တစ်ခုတည်းအတွက် Google Tag Manager ကို load လုပ်ဖို့ — component ကို သင့် page file ထဲမှာ ထည့်ပါ:

```jsx filename="app/page.js"
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return <GoogleTagManager gtmId="GTM-XYZ" />
}
```

#### Events ပို့ခြင်း (Sending Events)

`sendGTMEvent` function ကို သုံးပြီး `dataLayer` object ကနေတစ်ဆင့် events တွေ ပို့ကာ — သင့် page ပေါ်က user interactions တွေကို ခြေရာခံနိုင်ပါတယ်။ ဒီ function အလုပ်လုပ်ဖို့ — `<GoogleTagManager />` component က parent layout, page (သို့) component တစ်ခုခုမှာ (သို့) file တစ်ခုတည်းထဲမှာ တိုက်ရိုက် ပါဝင်နေရပါမယ်။

```jsx filename="app/page.js"
'use client'

import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        Send Event
      </button>
    </div>
  )
}
```

Function ထဲကို ထည့်လို့ရတဲ့ variables နဲ့ events အမျိုးမျိုးအကြောင်း လေ့လာဖို့ — Tag Manager ရဲ့ [developer documentation](https://developers.google.com/tag-platform/tag-manager/datalayer) ကို ကိုးကားပါ။

#### Server-side Tagging

Server-side tag manager တစ်ခု သုံးပြီး သင့် tagging server ကနေ `gtm.js` scripts တွေကို serve လုပ်နေတယ်ဆိုရင် — script ရဲ့ URL ကို သတ်မှတ်ဖို့ `gtmScriptUrl` option ကို သုံးနိုင်ပါတယ်။

#### Options

Google Tag Manager ဆီ ပို့ရမယ့် options တွေပါ။ Options အပြည့်အစုံစာရင်းအတွက် — [Google Tag Manager docs](https://developers.google.com/tag-platform/tag-manager/datalayer) ကို ဖတ်ပါ။

| Name            | Type       | Description                                                                              |
| --------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `gtmId`         | Required\* | သင့် GTM container ID။ ပုံမှန်အားဖြင့် `GTM-` နဲ့ စတင်ပါတယ်။                        |
| `gtmScriptUrl`  | Optional\* | GTM script URL။ Default က `https://www.googletagmanager.com/gtm.js`။                   |
| `dataLayer`     | Optional   | Container ကို instantiate လုပ်ဖို့ data layer object တစ်ခု။                            |
| `dataLayerName` | Optional   | Data layer ရဲ့ နာမည်။ Default က `dataLayer`။                                          |
| `auth`          | Optional   | Environment snippets တွေအတွက် authentication parameter (`gtm_auth`) ရဲ့ တန်ဖိုး။     |
| `preview`       | Optional   | Environment snippets တွေအတွက် preview parameter (`gtm_preview`) ရဲ့ တန်ဖိုး။         |

\*`gtmScriptUrl` ပေးထားတဲ့အခါ — [Google tag gateway for advertisers](https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual) ကို ထောက်ပံ့ဖို့ `gtmId` ကို ချန်လှပ်ထားနိုင်ပါတယ်။

### Google Analytics

`GoogleAnalytics` component ကို သုံးပြီး Google tag (`gtag.js`) ကနေတစ်ဆင့် သင့် page ထဲ [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4) ကို ထည့်သွင်းနိုင်ပါတယ်။ Default အနေနဲ့ — page ပေါ်မှာ hydration ဖြစ်ပြီးမှ မူရင်း scripts တွေကို fetch လုပ်ပါတယ်။

> **အကြံပြုချက်:** သင့် application ထဲမှာ Google Tag Manager ပါပြီးသားဆိုရင် — Google Analytics ကို သီးခြား component တစ်ခုအနေနဲ့ ထည့်မယ့်အစား အဲဒီကနေတစ်ဆင့် တိုက်ရိုက် configure လုပ်နိုင်ပါတယ်။ Tag Manager နဲ့ `gtag.js` ကြားက ကွာခြားချက်တွေအကြောင်း ပိုလေ့လာဖို့ — [documentation](https://developers.google.com/analytics/devguides/collection/ga4/tag-options#what-is-gtm) ကို ကိုးကားပါ။

Routes အားလုံးအတွက် Google Analytics ကို load လုပ်ဖို့ — component ကို သင့် root layout ထဲ တိုက်ရိုက် ထည့်ပြီး သင့် measurement ID ကို ထည့်ပေးပါ:

```tsx filename="app/layout.tsx" switcher
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

Route တစ်ခုတည်းအတွက် Google Analytics ကို load လုပ်ဖို့ — component ကို သင့် page file ထဲမှာ ထည့်ပါ:

```jsx filename="app/page.js"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Page() {
  return <GoogleAnalytics gaId="G-XYZ" />
}
```

#### Events ပို့ခြင်း (Sending Events)

`sendGAEvent` function ကို သုံးပြီး `dataLayer` object ကနေတစ်ဆင့် events တွေ ပို့ကာ — သင့် page ပေါ်က user interactions တွေကို တိုင်းတာနိုင်ပါတယ်။ ဒီ function အလုပ်လုပ်ဖို့ — `<GoogleAnalytics />` component က parent layout, page (သို့) component တစ်ခုခုမှာ (သို့) file တစ်ခုတည်းထဲမှာ တိုက်ရိုက် ပါဝင်နေရပါမယ်။

```jsx filename="app/page.js"
'use client'

import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGAEvent('event', 'buttonClicked', { value: 'xyz' })}
      >
        Send Event
      </button>
    </div>
  )
}
```

Event parameters တွေအကြောင်း ပိုလေ့လာဖို့ — Google Analytics ရဲ့ [developer documentation](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters) ကို ကိုးကားပါ။

#### Pageviews ခြေရာခံခြင်း (Tracking Pageviews)

Browser history state ပြောင်းတဲ့အခါ Google Analytics က pageviews တွေကို အလိုအလျောက် ခြေရာခံပါတယ်။ ဆိုလိုတာက — Next.js routes တွေကြားက client-side navigations တွေက configuration ဘာမှ မလိုဘဲ pageview data တွေ ပို့ပေးပါလိမ့်မယ်။

Client-side navigations တွေကို မှန်ကန်စွာ တိုင်းတာနိုင်ဖို့ — သင့် Admin panel ထဲမှာ ["Enhanced Measurement"](https://support.google.com/analytics/answer/9216061#enable_disable) property ကို enable လုပ်ထားပြီး "Page changes based on browser history events" checkbox ကို ရွေးထားကြောင်း စစ်ဆေးပါ။

> **မှတ်ချက်:** Pageview events တွေကို ကိုယ်တိုင် ပို့ဖို့ ဆုံးဖြတ်ထားတယ်ဆိုရင် — duplicate data တွေ မဖြစ်အောင် default pageview measurement ကို disable လုပ်ထားပါ။ ပိုလေ့လာဖို့ — Google Analytics ရဲ့ [developer documentation](https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag#manual_pageviews) ကို ကိုးကားပါ။

#### Options

`<GoogleAnalytics>` component ဆီ ပို့ရမယ့် options တွေပါ။

| Name            | Type     | Description                                                                                             |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `gaId`          | Required | သင့် [measurement ID](https://support.google.com/analytics/answer/12270356)။ ပုံမှန်အားဖြင့် `G-` နဲ့ စတင်ပါတယ်။ |
| `dataLayerName` | Optional | Data layer ရဲ့ နာမည်။ Default က `dataLayer`။                                                        |
| `debugMode`     | Optional | Google Analytics [debug mode](https://support.google.com/analytics/answer/7201382) ကို ဖွင့်ပေးပါတယ်။ |
| `nonce`         | Optional | [nonce](https://nextjs.org/docs/app/guides/content-security-policy#nonces) တစ်ခု။                       |

### Google Maps Embed

`GoogleMapsEmbed` component ကို သုံးပြီး သင့် page ထဲ [Google Maps Embed](https://developers.google.com/maps/documentation/embed/embedding-map) တစ်ခု ထည့်နိုင်ပါတယ်။ Default အနေနဲ့ — ပထမဆုံး မြင်ရတဲ့ viewport ရဲ့ အောက်မှာ ရှိတဲ့ embed တွေကို lazy-load လုပ်ဖို့ `loading` attribute ကို သုံးပါတယ်။

```jsx filename="app/page.js"
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

#### Options

Google Maps Embed ဆီ ပို့ရမယ့် options တွေပါ။ Options အပြည့်အစုံစာရင်းအတွက် — [Google Map Embed docs](https://developers.google.com/maps/documentation/embed/embedding-map) ကို ဖတ်ပါ။

| Name              | Type     | Description                                                                                                    |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `apiKey`          | Required | သင့် api key။                                                                                                  |
| `mode`            | Required | [Map mode](https://developers.google.com/maps/documentation/embed/embedding-map#choosing_map_modes)             |
| `height`          | Optional | Embed ရဲ့ အမြင့်။ Default က `auto`။                                                                           |
| `width`           | Optional | Embed ရဲ့ အနံ။ Default က `auto`။                                                                             |
| `style`           | Optional | iframe ဆီ styles တွေ ပို့ပေးပါတယ်။                                                                            |
| `allowfullscreen` | Optional | Map ရဲ့ အစိတ်အပိုင်းတစ်ချို့ကို full screen ဖြစ်ခွင့်ပြုတဲ့ property တစ်ခု။                                  |
| `loading`         | Optional | Default က lazy။ သင့် embed က viewport ထဲ မြင်ရတဲ့ နေရာမှာ ရှိမယ်ဆိုရင် ပြောင်းစဉ်းစားပါ။                 |
| `q`               | Optional | Map marker ရဲ့ တည်နေရာကို သတ်မှတ်ပါတယ်။ _Map mode ပေါ် မူတည်ပြီး လိုအပ်နိုင်ပါတယ်_။                   |
| `center`          | Optional | Map view ရဲ့ ဗဟိုကို သတ်မှတ်ပါတယ်။                                                                            |
| `zoom`            | Optional | Map ရဲ့ ကနဦး zoom level ကို သတ်မှတ်ပါတယ်။                                                                   |
| `maptype`         | Optional | Load လုပ်ရမယ့် map tiles အမျိုးအစားကို သတ်မှတ်ပါတယ်။                                                       |
| `language`        | Optional | UI elements တွေနဲ့ map tiles ပေါ်က labels တွေအတွက် သုံးမယ့် language ကို သတ်မှတ်ပါတယ်။                  |
| `region`          | Optional | Geo-political sensitivities တွေကို အခြေခံပြီး ပြသရမယ့် သင့်လျော်တဲ့ borders နဲ့ labels တွေကို သတ်မှတ်ပါတယ်။ |

### YouTube Embed

`YouTubeEmbed` component ကို သုံးပြီး YouTube embed တစ်ခုကို load လုပ်ပြီး ပြသနိုင်ပါတယ်။ ဒီ component က နောက်ကွယ်မှာ [`lite-youtube-embed`](https://github.com/paulirish/lite-youtube-embed) ကို သုံးထားလို့ — ပိုမြန်ဆန်စွာ load လုပ်ပါတယ်။

```jsx filename="app/page.js"
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

#### Options

| Name        | Type     | Description                                                                                                                                                                                                            |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `videoid`   | Required | YouTube video id။                                                                                                                                                                                                       |
| `width`     | Optional | Video container ရဲ့ အနံ။ Default က `auto`။                                                                                                                                                                           |
| `height`    | Optional | Video container ရဲ့ အမြင့်။ Default က `auto`။                                                                                                                                                                        |
| `playlabel` | Optional | Accessibility အတွက် play button ပေါ်က visually hidden label (မျက်စိဖြင့် မမြင်ရတဲ့ label)။                                                          |
| `params`    | Optional | [ဒီမှာ](https://developers.google.com/youtube/player_parameters#Parameters) သတ်မှတ်ထားတဲ့ video player params တွေပါ။ <br/> Params တွေကို query param string အနေနဲ့ ပို့ပါတယ်။ <br/> ဥပမာ — `params="controls=0&start=10&end=30"` |
| `style`     | Optional | Video container ဆီ styles တွေ သက်ရောက်ဖို့ သုံးပါတယ်။                                                                                                 |
