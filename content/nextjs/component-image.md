---
title: "image (<Image>)"
description: "<Image> component (next/image) — images တွေကို အလိုအလျောက် optimize လုပ်ပေးတဲ့ HTML <img> ရဲ့ extension; src, alt, width/height, fill, loader, sizes, quality, placeholder, onLoad စတဲ့ props များနဲ့ next.config.js ရဲ့ images configuration options အားလုံး"
order: 75
source: "https://nextjs.org/docs/app/api-reference/components/image"
status: translated
updated: 2026-09-02
---

Next.js ရဲ့ Image component က HTML `<img>` element ကို — images တွေကို အလိုအလျောက် optimize လုပ်ဖို့အတွက် ချဲ့ထွင်ထားတာပါ။

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
  )
}
```

## Reference

### Props

အောက်ပါ props တွေ ရနိုင်ပါတယ်:

| Prop                                      | Example                                  | Type            | Status     |
| ----------------------------------------- | ---------------------------------------- | --------------- | ---------- |
| [`src`](#src)                             | `src="/profile.png"`                     | String          | Required   |
| [`alt`](#alt)                             | `alt="Picture of the author"`            | String          | Required   |
| [`width`](#width-and-height)                         | `width={500}`                            | Integer (px)    | -   |
| [`height`](#width-and-height)                       | `height={500}`                           | Integer (px)    | -   |
| [`fill`](#fill)                           | `fill={true}`                            | Boolean         | -          |
| [`loader`](#loader)                       | `loader={imageLoader}`                   | Function        | -          |
| [`sizes`](#sizes)                         | `sizes="(max-width: 768px) 100vw, 33vw"` | String          | -          |
| [`quality`](#quality)                     | `quality={80}`                           | Integer (1-100) | -          |
| [`preload`](#preload)                     | `preload={true}`                         | Boolean         | -          |
| [`placeholder`](#placeholder)             | `placeholder="blur"`                     | String          | -          |
| [`style`](#style)                         | `style={{objectFit: "contain"}}`         | Object          | -          |
| [`onLoadingComplete`](#onloadingcomplete) | `onLoadingComplete={img => done())}`     | Function        | Deprecated |
| [`onLoad`](#onload)                       | `onLoad={event => done())}`              | Function        | -          |
| [`onError`](#onerror)                     | `onError(event => fail()}`               | Function        | -          |
| [`loading`](#loading)                     | `loading="lazy"`                         | String          | -          |
| [`blurDataURL`](#blurdataurl)             | `blurDataURL="data:image/jpeg..."`       | String          | -          |
| [`unoptimized`](#unoptimized)             | `unoptimized={true}`                     | Boolean         | -          |
| [`overrideSrc`](#overridesrc)             | `overrideSrc="/seo.png"`                 | String          | -          |
| [`decoding`](#decoding)                   | `decoding="async"`                       | String          | -          |

#### `src`

Image ရဲ့ source ပါ။ အောက်ပါတွေထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

Internal path string တစ်ခု။

```jsx
<Image src="/profile.png" />
```

Absolute external URL တစ်ခု ([remotePatterns](#remotepatterns) နဲ့ configure လုပ်ထားရမည်)။

```jsx
<Image src="https://example.com/profile.png" />
```

Static import တစ်ခု။

```jsx
import profile from './profile.png'

export default function Page() {
  return <Image src={profile} />
}
```

> **သိထားသင့်သည်:** လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် — default [loader](#loader) ကို သုံးတဲ့ Image Optimization API က `src` image ကို fetch လုပ်တဲ့အခါ headers တွေကို forward _လုပ်မှာ မဟုတ်ပါဘူး_။
> `src` image က authentication လိုအပ်ရင် — Image Optimization ကို ပိတ်ဖို့ [unoptimized](#unoptimized) property ကို သုံးစဉ်းစားပါ။

#### `alt`

`alt` property က screen readers တွေနဲ့ search engines တွေအတွက် image ကို ဖော်ပြဖို့ သုံးပါတယ်။ Images တွေ ပိတ်ထားတဲ့အခါ (သို့) image load လုပ်ရာမှာ error ဖြစ်တဲ့အခါ — fallback text အဖြစ်လည်း ဆောင်ရွက်ပါတယ်။

ဒါထဲမှာ [page ရဲ့ အဓိပ္ပာယ်ကို မပြောင်းလဲဘဲ](https://html.spec.whatwg.org/multipage/images.html#general-guidelines) image ကို အစားထိုးနိုင်တဲ့ text ပါသင့်ပါတယ်။ ဒါက image ကို ဖြည့်စွက်ဖို့ ရည်ရွယ်တာ မဟုတ်ဘဲ — image ရဲ့ အပေါ် (သို့) အောက်က captions တွေထဲမှာ ဖော်ပြပြီးသား အချက်အလက်တွေကို ထပ်မလုပ်သင့်ပါဘူး။

Image က [အလှဆင်သက်သက်](https://html.spec.whatwg.org/multipage/images.html#a-purely-decorative-image-that-doesn't-add-any-information) (သို့) [user အတွက် ရည်ရွယ်ထားတာ မဟုတ်ဘူးဆိုရင်](https://html.spec.whatwg.org/multipage/images.html#an-image-not-intended-for-the-user) — `alt` property က empty string (`alt=""`) ဖြစ်သင့်ပါတယ်။

> [Image accessibility guidelines](https://html.spec.whatwg.org/multipage/images.html#alt) အကြောင်း ပိုလေ့လာပါ။

#### `width` နဲ့ `height`

`width` နဲ့ `height` properties တွေက pixels နဲ့ တိုင်းတဲ့ image ရဲ့ [intrinsic](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size) size ကို ကိုယ်စားပြုပါတယ်။ Loading အတွင်း browsers တွေက image အတွက် နေရာ ကြိုချန်ထားပြီး layout shift တွေ ရှောင်နိုင်ဖို့ — ဒီ property ကို မှန်ကန်တဲ့ **aspect ratio** ကို ခန့်မှန်းဖို့ သုံးပါတယ်။ ဒါက CSS က ထိန်းချုပ်တဲ့ _rendered size_ ကိုတော့ သတ်မှတ်ပေးတာ မဟုတ်ပါဘူး။

```jsx
<Image src="/profile.png" width={500} height={500} />
```

အောက်ပါ အခြေအနေတွေကလွဲရင် — `width` ရော `height` properties နှစ်ခုလုံးကို **သတ်မှတ်ပေးရပါမယ်**:

- Image က statically imported ဖြစ်နေရင်
- Image မှာ [`fill` property](#fill) ရှိနေရင်

Height နဲ့ width ကို မသိရဘူးဆိုရင် — [`fill` property](#fill) ကို သုံးဖို့ အကြံပြုပါတယ်။

#### `fill`

Image ကို parent element ရဲ့ အရွယ်အစားအထိ ကျယ်စေတဲ့ boolean တစ်ခုပါ။

```js
<Image src="/profile.png" fill={true} />
```

**Positioning:**

- Parent element က `position: "relative"`, `"fixed"`, (သို့) `"absolute"` တစ်ခုခုကို သတ်မှတ်ပေးရ**ပါမယ်**။
- Default အနေနဲ့ — `<img>` element က `position: "absolute"` ကို သုံးပါတယ်။

**Object Fit:**

Image ပေါ်မှာ style တွေ ဘာမှ မသတ်မှတ်ရင် — image က container ထဲ အံဝင်အောင် ဆန့်ထွက်ပါလိမ့်မယ်။ Cropping နဲ့ scaling ကို ထိန်းချုပ်ဖို့ `objectFit` ကို သုံးနိုင်ပါတယ်။

- `"contain"`: Image က container ထဲ အံဝင်ဖို့ ချုံ့ပြီး aspect ratio ကို ထိန်းထားပါတယ်။
- `"cover"`: Image က container ကို ပြည့်အောင် ဖုံးပြီး လိုအပ်ရင် crop လုပ်ပါတယ်။

[`position`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) နဲ့ [`object-fit`](https://developer.mozilla.org/docs/Web/CSS/object-fit) အကြောင်း ပိုလေ့လာပါ။

#### `loader`

Image URL ကို generate လုပ်ဖို့ သုံးတဲ့ custom function တစ်ခုပါ။ Function က အောက်ပါ parameters တွေကို လက်ခံရရှိပြီး — image အတွက် URL string တစ်ခုကို ပြန်ပေးပါတယ်:

- [`src`](#src)
- [`width`](#width-and-height)
- [`quality`](#quality)

```js
'use client'

import Image from 'next/image'

const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

export default function Page() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

> **သိထားသင့်သည်:** Function တစ်ခုကို လက်ခံတဲ့ `onLoad` လိုမျိုး props တွေ သုံးတာက — ပေးလိုက်တဲ့ function ကို serialize လုပ်ဖို့ [Client Components](https://react.dev/reference/rsc/use-client) တွေ သုံးရန် လိုအပ်ပါတယ်။

တနည်းအားဖြင့် — prop တစ်ခု ပေးစရာ မလိုဘဲ သင့် application ထဲက `next/image` instance တိုင်းကို configure လုပ်ဖို့ — `next.config.js` ထဲက [loaderFile](#loaderfile) configuration ကို သုံးနိုင်ပါတယ်။
#### `sizes`

Breakpoints အမျိုးမျိုးမှာ image ရဲ့ အရွယ်အစားတွေကို သတ်မှတ်ပါ။ Generated `srcset` ထဲကနေ အသင့်တော်ဆုံး အရွယ်အစားကို ရွေးဖို့ browser က ဒါကို သုံးပါတယ်။

```jsx
import Image from 'next/image'

export default function Page() {
  return (
    <div className="grid-element">
      <Image
        fill
        src="/example.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

အောက်ပါ အခြေအနေတွေမှာ `sizes` ကို သုံးသင့်ပါတယ်:

- Image က [`fill`](#fill) prop ကို သုံးနေရင်
- Image ကို responsive ဖြစ်အောင် CSS သုံးနေရင်

`sizes` မရှိရင် — browser က image က viewport လောက် ကျယ်တယ် (`100vw`) လို့ ယူဆပါတယ်။ ဒါက မလိုအပ်ဘဲ ကြီးတဲ့ images တွေ download လုပ်မိစေနိုင်ပါတယ်။

ထပ်ပြီး — `sizes` က `srcset` generate လုပ်ပုံကိုပါ သက်ရောက်ပါတယ်:

- `sizes` မရှိရင်: Next.js က fixed-size images တွေအတွက် သင့်တော်တဲ့ — ကန့်သတ်ထားတဲ့ `srcset` (ဥပမာ 1x, 2x) တစ်ခုကို generate လုပ်ပါတယ်။
- `sizes` ရှိရင်: Next.js က responsive layouts တွေအတွက် optimize လုပ်ထားတဲ့ — full `srcset` (ဥပမာ 640w, 750w, စသည်) တစ်ခုကို generate လုပ်ပါတယ်။

`srcset` နဲ့ `sizes` အကြောင်း [web.dev](https://web.dev/learn/design/responsive-images/#sizes) နဲ့ [mdn](https://developer.mozilla.org/docs/Web/HTML/Element/img#sizes) မှာ ပိုလေ့လာပါ။

#### `quality`

Optimized image ရဲ့ quality ကို သတ်မှတ်တဲ့ `1` ကနေ `100` ကြားက integer တစ်ခုပါ။ တန်ဖိုး မြင့်လေ — file size နဲ့ visual fidelity မြင့်လေပါ။ တန်ဖိုး နိမ့်လေ — file size နည်းပေမယ့် sharpness ကို ထိခိုက်နိုင်ပါတယ်။

```jsx
// Default quality က 75 ဖြစ်သည်
<Image quality={75} />
```

`next.config.js` ထဲမှာ [qualities](#qualities) တွေ configure လုပ်ထားရင် — အဲဒီ list ထဲမှာ မပါတဲ့ တန်ဖိုးတစ်ခုကို အနီးဆုံး ခွင့်ပြုထားတဲ့ entry ဆီ ညှိပေးပါတယ်။ ဥပမာ — `qualities: [50, 75, 100]` နဲ့ဆို `quality` `80` ကို `75` အဖြစ် serve လုပ်ပါတယ်။ Development မှာ — allowlist ထဲ တန်ဖိုးထည့်နိုင်အောင် warning log လုပ်ပါတယ်။

> **သိထားသင့်သည်:** မူရင်း image က quality နိမ့်ပြီးသားဆိုရင် — quality တန်ဖိုး မြင့်မြင့် သတ်မှတ်တာက ပုံပန်းသဏ္ဌာန် မတိုးတက်ဘဲ file size ကိုပဲ ကြီးစေပါတယ်။

#### `style`

အောက်ခံ image element ဆီ CSS styles တွေ ပေးပို့နိုင်စေပါတယ်။

```jsx
const imageStyle = {
  borderRadius: '50%',
  border: '1px solid #fff',
  width: '100px',
  height: 'auto',
}

export default function ProfileImage() {
  return <Image src="..." style={imageStyle} />
}
```

> **သိထားသင့်သည်:** `style` prop နဲ့ custom width တစ်ခု သတ်မှတ်ရင် — image ရဲ့ aspect ratio ထိန်းသိမ်းဖို့ `height: 'auto'` ကိုပါ တစ်ပြိုင်နက် သတ်မှတ်ဖို့ သေချာပါစေ။

#### `preload`

Image ကို preload လုပ်သင့်မသင့် ဖော်ပြတဲ့ boolean တစ်ခုပါ။

```jsx
// Default preload က false ဖြစ်သည်
<Image preload={false} />
```

- `true`: `<head>` ထဲမှာ `<link>` တစ်ခု ထည့်ပြီး image ကို [preload](https://web.dev/preload-responsive-images/) လုပ်ပါတယ်။
- `false`: Image ကို preload မလုပ်ပါဘူး။

**ဘယ်အခါ သုံးမလဲ:**

- Image က [Largest Contentful Paint (LCP)](https://nextjs.org/learn/seo/web-performance/lcp) element ဖြစ်နေရင်
- Image က above the fold မှာ ရှိနေရင် — ပုံမှန်အားဖြင့် hero image
- `<body>` ထဲမှာ နောက်မှ တွေ့ရမယ့် image ကို `<head>` ထဲမှာကတည်းက စတင် load ချင်ရင်

**ဘယ်အခါ မသုံးသင့်လဲ:**

- Viewport ပေါ် မူတည်ပြီး [Largest Contentful Paint (LCP)](https://nextjs.org/learn/seo/web-performance/lcp) element လို့ ယူဆနိုင်တဲ့ images အများအပြား ရှိနေရင်
- `loading` property ကို သုံးထားရင်
- `fetchPriority` property ကို သုံးထားရင်

အများစုမှာ — `preload` အစား `loading="eager"` (သို့) `fetchPriority="high"` တွေကို သုံးသင့်ပါတယ်။

#### `priority`

Next.js 16 ကစပြီး — အပြုအမူကို ရှင်းလင်းစေဖို့ `priority` property ကို [`preload`](#preload) property ရဲ့ မျက်နှာသာပေးမှုနဲ့ deprecated လုပ်လိုက်ပါပြီ။

#### `loading`

Image ကို ဘယ်အချိန်မှာ စတင် load လုပ်မလဲ ထိန်းချုပ်ပါတယ်။

```jsx
// Default က lazy ဖြစ်သည်
<Image loading="lazy" />
```

- `lazy`: Image က viewport ကနေ တွက်ချက်ထားတဲ့ အကွာအဝေးတစ်ခုဆီ ရောက်တဲ့အထိ loading ကို ရွှေ့ဆိုင်းထားပါတယ်။
- `eager`: Page ထဲမှာ ဘယ်နေရာမှာ ရှိနေပါစေ — image ကို ချက်ချင်း load လုပ်ပါတယ်။

Image ကို ချက်ချင်း load ဖြစ်နေဖို့ သေချာစေချင်မှသာ `eager` ကို သုံးပါ။

[`loading` attribute](https://developer.mozilla.org/docs/Web/HTML/Element/img#loading) အကြောင်း ပိုလေ့လာပါ။

#### `placeholder`

Image load လုပ်နေချိန်မှာ သုံးဖို့ placeholder တစ်ခုကို သတ်မှတ်ပြီး — မြင်ရတဲ့ loading performance ကို ပိုကောင်းစေပါတယ်။

```jsx
// Default က empty ဖြစ်သည်
<Image placeholder="empty" />
```

- `empty`: Image load လုပ်နေချိန်မှာ placeholder မရှိပါဘူး။
- `blur`: Image ရဲ့ blurred version တစ်ခုကို placeholder အဖြစ် သုံးပါတယ်။ [`blurDataURL`](#blurdataurl) property နဲ့ တွဲသုံးရပါမယ်။
- `data:image/...`: [Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) တစ်ခုကို placeholder အဖြစ် သုံးပါတယ်။

**ဥပမာများ:**

- [`blur` placeholder ဥပမာ](https://image-component.nextjs.gallery/placeholder)
- [Data URL `placeholder` prop နဲ့ Shimmer effect](https://image-component.nextjs.gallery/shimmer)
- [`blurDataURL` prop နဲ့ Color effect](https://image-component.nextjs.gallery/color)

[`placeholder` attribute](https://developer.mozilla.org/docs/Web/HTML/Element/img#placeholder) အကြောင်း ပိုလေ့လာပါ။

#### `blurDataURL`

Image က အောင်မြင်စွာ load မဖြစ်ခင်မှာ placeholder image အဖြစ် သုံးဖို့ [Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) တစ်ခုပါ။ [`placeholder="blur"`](#placeholder) property နဲ့ အလိုအလျောက် သတ်မှတ်ခြင်း (သို့) တွဲသုံးခြင်း နှစ်မျိုးလုံး လုပ်နိုင်ပါတယ်။

```jsx
<Image placeholder="blur" blurDataURL="..." />
```

Image ကို အလိုအလျောက် ချဲ့ပြီး blur လုပ်ပေးတာမို့ — အရမ်းသေးငယ်တဲ့ image (10px (သို့) ဒီထက် နည်း) တစ်ခုကို သုံးဖို့ အကြံပြုပါတယ်။

**အလိုအလျောက်**

`src` က `jpg`, `png`, `webp`, (သို့) `avif` file တစ်ခုရဲ့ static import တစ်ခုဆိုရင် — image က animated မဟုတ်သရွေ့ `blurDataURL` ကို အလိုအလျောက် ထည့်ပေးပါတယ်။

**ကိုယ်တိုင် သတ်မှတ်ခြင်း**

Image က dynamic (သို့) remote ဖြစ်နေရင် — `blurDataURL` ကို ကိုယ်တိုင် ပေးရပါမယ်။ Generate လုပ်ဖို့ အောက်ပါတွေကို သုံးနိုင်ပါတယ်:

- [png-pixel.com လိုမျိုး online tool တစ်ခု](https://png-pixel.com)
- [Plaiceholder လိုမျိုး library တစ်ခု](https://github.com/joe-bell/plaiceholder)

blurDataURL အကြီးကြီးတစ်ခုက performance ကို ထိခိုက်စေနိုင်ပါတယ်။ သေးငယ်ပြီး ရိုးရှင်းအောင် ထားပါ။

**ဥပမာများ:**

- [Default `blurDataURL` prop ဥပမာ](https://image-component.nextjs.gallery/placeholder)
- [`blurDataURL` prop နဲ့ Color effect](https://image-component.nextjs.gallery/color)

#### `onLoad`

Image က အပြည့်အဝ load ဖြစ်ပြီး [placeholder](#placeholder) ကို ဖယ်ရှားလိုက်တာနဲ့ — invoke လုပ်တဲ့ callback function တစ်ခုပါ။

```jsx
<Image onLoad={(e) => console.log(e.target.naturalWidth)} />
```

Callback function ကို argument တစ်ခုနဲ့ ခေါ်ပါတယ် — အောက်ခံ `<img>` element ကို ရည်ညွှန်းတဲ့ `target` ပါတဲ့ event ပါ။

> **သိထားသင့်သည်:** Function တစ်ခုကို လက်ခံတဲ့ `onLoad` လိုမျိုး props တွေ သုံးတာက — ပေးလိုက်တဲ့ function ကို serialize လုပ်ဖို့ [Client Components](https://react.dev/reference/rsc/use-client) တွေ သုံးရန် လိုအပ်ပါတယ်။

#### `onError`

Image က load လုပ်ဖို့ မအောင်မြင်ရင် invoke လုပ်တဲ့ callback function တစ်ခုပါ။

```jsx
<Image onError={(e) => console.error(e.target.id)} />
```

> **သိထားသင့်သည်:** Function တစ်ခုကို လက်ခံတဲ့ `onError` လိုမျိုး props တွေ သုံးတာက — ပေးလိုက်တဲ့ function ကို serialize လုပ်ဖို့ [Client Components](https://react.dev/reference/rsc/use-client) တွေ သုံးရန် လိုအပ်ပါတယ်။

#### `unoptimized`

Image ကို optimize လုပ်သင့်မသင့် ဖော်ပြတဲ့ boolean တစ်ခုပါ။ Optimization ကနေ အကျိုးမရတဲ့ images တွေ — ဥပမာ သေးငယ်တဲ့ images (1KB အောက်), vector images (SVG) (သို့) animated images (GIF) တွေအတွက် အသုံးဝင်ပါတယ်။

```js
import Image from 'next/image'

const UnoptimizedImage = (props) => {
  // Default က false ဖြစ်သည်
  return <Image {...props} unoptimized />
}
```

- `true`: Quality, size (သို့) format တွေ ပြောင်းမယ့်အစား — source image ကို `src` ကနေ မူလအတိုင်း serve လုပ်ပါတယ်။
- `false`: Source image ကို optimize လုပ်ပါတယ်။

Next.js 12.3.0 ကစပြီး — အောက်ပါ configuration နဲ့ `next.config.js` ကို update လုပ်ပြီး — ဒီ prop ကို images အားလုံးအတွက် သတ်မှတ်ပေးနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    unoptimized: true,
  },
}
```

#### `overrideSrc`

`<Image>` component ဆီ `src` prop ပေးတဲ့အခါ — ရလာတဲ့ `<img>` အတွက် `srcset` ရော `src` attributes နှစ်ခုလုံးကို အလိုအလျောက် generate လုပ်ပေးပါတယ်။

```jsx filename="input.js"
<Image src="/profile.jpg" />
```

```html filename="output.html"
<img
  srcset="
    /_next/image?url=%2Fprofile.jpg&w=640&q=75 1x,
    /_next/image?url=%2Fprofile.jpg&w=828&q=75 2x
  "
  src="/_next/image?url=%2Fprofile.jpg&w=828&q=75"
/>
```

အခြေအနေတချို့မှာ — `src` attribute ကို generate လုပ်တာက မလိုလားအပ်ဘဲ — `overrideSrc` prop နဲ့ ဒါကို ကျော်ဖို့ (override) ဆန္ဒရှိနိုင်ပါတယ်။

ဥပမာ — ရှိပြီးသား website တစ်ခုကို `<img>` ကနေ `<Image>` ဆီ upgrade လုပ်တဲ့အခါ — image ranking (သို့) recrawl ရှောင်တာလိုမျိုး SEO ရည်ရွယ်ချက်တွေအတွက် — `src` attribute ကို အတူတူ ထိန်းထားချင်နိုင်ပါတယ်။

```jsx filename="input.js"
<Image src="/profile.jpg" overrideSrc="/override.jpg" />
```

```html filename="output.html"
<img
  srcset="
    /_next/image?url=%2Fprofile.jpg&w=640&q=75 1x,
    /_next/image?url=%2Fprofile.jpg&w=828&q=75 2x
  "
  src="/override.jpg"
/>
```

#### `decoding`

Browser က တခြား content updates တွေကို မပြသခင် image ကို decode လုပ်ပြီးတဲ့အထိ စောင့်သင့်လား မစောင့်သင့်လားဆိုတဲ့ — browser အတွက် hint တစ်ခုပါ။

```jsx
// Default က async ဖြစ်သည်
<Image decoding="async" />
```

- `async`: Image ကို asynchronously decode လုပ်ပြီး — မပြီးခင် တခြား content တွေကို render လုပ်ခွင့်ပေးပါတယ်။
- `sync`: တခြား content တွေနဲ့အတူ atomic presentation ရဖို့ — image ကို synchronously decode လုပ်ပါတယ်။
- `auto`: Preference မရှိဘူး။ Browser က အကောင်းဆုံး နည်းလမ်းကို ရွေးပါတယ်။

[`decoding` attribute](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding) အကြောင်း ပိုလေ့လာပါ။

### Other Props

`<Image />` component ပေါ်က တခြား properties တွေကို — အောက်ပါကလွဲရင် — အောက်ခံ `img` element ဆီ ပို့ပေးပါတယ်:

- `srcSet`: ဒီအစား [Device Sizes](#devicesizes) ကို သုံးပါ။

### Deprecated props

#### `onLoadingComplete`

> **သတိပေးချက်**: Next.js 14 မှာ Deprecated ဖြစ်ပြီ — [`onLoad`](#onload) ကို သုံးပါ။

Image က အပြည့်အဝ load ဖြစ်ပြီး [placeholder](#placeholder) ကို ဖယ်ရှားလိုက်တာနဲ့ — invoke လုပ်တဲ့ callback function တစ်ခုပါ။

Callback function ကို argument တစ်ခုနဲ့ ခေါ်ပါတယ် — အောက်ခံ `<img>` element ဆီ ရည်ညွှန်းချက် (reference) တစ်ခုပါ။

```jsx
'use client'

<Image onLoadingComplete={(img) => console.log(img.naturalWidth)} />
```

> **သိထားသင့်သည်:** Function တစ်ခုကို လက်ခံတဲ့ `onLoadingComplete` လိုမျိုး props တွေ သုံးတာက — ပေးလိုက်တဲ့ function ကို serialize လုပ်ဖို့ [Client Components](https://react.dev/reference/rsc/use-client) တွေ သုံးရန် လိုအပ်ပါတယ်။
### Configuration options

Image Component ကို `next.config.js` ထဲမှာ configure လုပ်နိုင်ပါတယ်။ အောက်ပါ options တွေ ရနိုင်ပါတယ်:

#### `localPatterns`

Specific local paths တွေကနေ images တွေကို optimize လုပ်ခွင့်ပြုပြီး — တခြားအားလုံးကို ပိတ်ဆို့ဖို့ — သင့် `next.config.js` file ထဲမှာ `localPatterns` ကို သုံးပါ။

```js filename="next.config.js"
module.exports = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/images/**',
        search: '',
      },
    ],
  },
}
```

အပေါ်က ဥပမာက — `next/image` ရဲ့ `src` property က `/assets/images/` နဲ့ စရမယ် ဖြစ်ပြီး query string မပါရဘူးဆိုတာ သေချာစေပါတယ်။ တခြား path တစ်ခုခုကို optimize လုပ်ဖို့ ကြိုးစားရင် — `400` Bad Request error နဲ့ response ပြန်ပါလိမ့်မယ်။

> **သိထားသင့်သည်:** `search` property ကို ချန်လှပ်ထားရင် — search parameters အားလုံးကို ခွင့်ပြုပြီး — သင်မရည်ရွယ်ထားတဲ့ URLs တွေကို အန္တရာယ်ပြုလိုသူတွေ optimize လုပ်နိုင်စေပါတယ်။ `search: '?v=2'` လိုမျိုး တိကျတဲ့ တန်ဖိုးတစ်ခုကို သုံးပြီး တိကျတဲ့ match ဖြစ်အောင် ကြိုးစားပါ။

#### `remotePatterns`

Specific external paths တွေကနေ images တွေကို ခွင့်ပြုပြီး — တခြားအားလုံးကို ပိတ်ဆို့ဖို့ — သင့် `next.config.js` file ထဲမှာ `remotePatterns` ကို သုံးပါ။ ဒါက သင့် account ကနေပဲ external images တွေ serve လုပ်နိုင်စေဖို့ သေချာစေပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [new URL('https://example.com/account123/**')],
  },
}
```

`remotePatterns` ကို object နဲ့လည်း configure လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/account123/**',
        search: '',
      },
    ],
  },
}
```

အပေါ်က ဥပမာက — `next/image` ရဲ့ `src` property က `https://example.com/account123/` နဲ့ စရမယ် ဖြစ်ပြီး query string မပါရဘူးဆိုတာ သေချာစေပါတယ်။ တခြား protocol, hostname, port (သို့) မကိုက်ညီတဲ့ path ဘယ်ဟာမဆို — `400` Bad Request နဲ့ response ပြန်ပါလိမ့်မယ်။

**Wildcard Patterns:**

`pathname` ရော `hostname` နှစ်ခုလုံးအတွက် wildcard patterns တွေကို သုံးနိုင်ပြီး — အောက်ပါ syntax တွေ ရှိပါတယ်:

- `*` က path segment တစ်ခုတည်း (သို့) subdomain တစ်ခုတည်းကို ကိုက်ညီသည်
- `**` က အဆုံးမှာ ရှိတဲ့ path segments အရေအတွက် ဘယ်လောက်ကိုမဆို (သို့) အစမှာ ရှိတဲ့ subdomains အရေအတွက် ဘယ်လောက်ကိုမဆို ကိုက်ညီသည်။ ဒီ syntax က pattern ရဲ့ အလယ်မှာတော့ အလုပ်မလုပ်ပါဘူး။

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        search: '',
      },
    ],
  },
}
```

ဒါက `image.example.com` လိုမျိုး subdomains တွေကို ခွင့်ပြုပါတယ်။ Query strings နဲ့ custom ports တွေကတော့ ပိတ်ထားဆဲပါ။

> **သိထားသင့်သည်:** `protocol`, `port`, `pathname` (သို့) `search` တွေကို ချန်လှပ်လိုက်ရင် — wildcard `**` ကို ဆိုလိုတာ ဖြစ်ပါတယ်။ ဒါက သင်မရည်ရွယ်ထားတဲ့ urls တွေကို အန္တရာယ်ပြုလိုသူတွေ optimize လုပ်နိုင်စေလို့ — အကြံမပြုပါဘူး။

**Query Strings:**

`search` property ကို သုံးပြီး query strings တွေကိုလည်း ကန့်သတ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        search: '?v=1727111025337',
      },
    ],
  },
}
```

အပေါ်က ဥပမာက — `next/image` ရဲ့ `src` property က `https://assets.example.com` နဲ့ စရမယ် ဖြစ်ပြီး — တိကျတဲ့ query string `?v=1727111025337` ရှိရမယ်ဆိုတာ သေချာစေပါတယ်။ တခြား protocol (သို့) query string ဘယ်ဟာမဆို — `400` Bad Request နဲ့ response ပြန်ပါလိမ့်မယ်။

ခွင့်ပြုထားတဲ့ `remotePatterns` တွေထဲက တစ်ခုခုက redirect နဲ့ response ပြန်ရင် — remote image server ကနေ redirect ကို လိုက်ပြီး — redirect ရဲ့ နေရာအပေါ်မှာ `remotePatterns` ကို နောက်တစ်ခါ မစစ်တော့ပါဘူး။ [maximumRedirects](#maximumredirects) ကို configure လုပ်ပြီး redirects တွေကို လျှော့ချ (သို့) ပိတ်နိုင်ပါတယ်။

#### `loaderFile`

Next.js အစား custom image optimization service တစ်ခု သုံးဖို့ `loaderFile` ကို ခွင့်ပြုပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

Path က project root နဲ့ ဆက်စပ်နေရပါမယ်။ File က URL string တစ်ခုကို ပြန်ပေးတဲ့ default function တစ်ခုကို export လုပ်ရပါမယ်:

```js filename="my/image/loader.js"
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

**ဥပမာ:**

- [Custom Image Loader Configuration ဥပမာ](https://nextjs.org/docs/app/api-reference/config/next-config-js/images#example-loader-configuration)

> တနည်းအားဖြင့် — `next/image` instance တစ်ခုချင်းစီကို configure လုပ်ဖို့ [`loader` prop](#loader) ကို သုံးနိုင်ပါတယ်။

#### `path`

Image Optimization API အတွက် default path ကို ပြောင်းချင် (သို့) prefix လုပ်ချင်ရင် — `path` property နဲ့ လုပ်နိုင်ပါတယ်။ `path` ရဲ့ default တန်ဖိုးက `/_next/image` ပါ။

```js filename="next.config.js"
module.exports = {
  images: {
    path: '/my-prefix/_next/image',
  },
}
```
#### `deviceSizes`

Device width breakpoints တွေရဲ့ စာရင်းတစ်ခုကို သတ်မှတ်ဖို့ `deviceSizes` က ခွင့်ပြုပါတယ်။ `next/image` component က [`sizes`](#sizes) prop သုံးတဲ့အခါ — user ရဲ့ device အတွက် မှန်ကန်တဲ့ image ကို serve လုပ်ဖို့ — ဒီ widths တွေကို သုံးပါတယ်။

Configuration မပေးရင် — အောက်ပါ default ကို သုံးပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

#### `imageSizes`

Image widths တွေရဲ့ စာရင်းတစ်ခုကို သတ်မှတ်ဖို့ `imageSizes` က ခွင့်ပြုပါတယ်။ Image [srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) တွေ generate လုပ်ဖို့ သုံးတဲ့ — sizes တွေရဲ့ full array တစ်ခုအဖြစ် — ဒီ widths တွေကို [device sizes](#devicesizes) array နဲ့ ပေါင်းစပ်ပေးပါတယ်။

Configuration မပေးရင် — အောက်ပါ default ကို သုံးပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
}
```

`imageSizes` ကို [`sizes`](#sizes) prop ပေးထားတဲ့ images တွေအတွက်ပဲ သုံးပါတယ် — ဒါက image က screen ရဲ့ အပြည့်အနံထက် နည်းတယ်လို့ ဖော်ပြတာပါ။ ဒါကြောင့် — `imageSizes` ထဲက sizes တွေအားလုံးက `deviceSizes` ထဲက အသေးဆုံး size ထက် ပိုသေးသင့်ပါတယ်။

#### `qualities`

Image quality တန်ဖိုးတွေရဲ့ စာရင်းတစ်ခုကို သတ်မှတ်ဖို့ `qualities` က ခွင့်ပြုပါတယ်။

Configuration မပေးရင် — အောက်ပါ default ကို သုံးပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    qualities: [75],
  },
}
```

> **သိထားသင့်သည်**: Next.js 16 ကစပြီး ဒီ field က လိုအပ်ပါတယ် — ဘာလို့လဲဆိုတော့ ကန့်သတ်ချက် မရှိတဲ့ access က သင်မရည်ရွယ်ထားတာထက် qualities အများအပြားကို အန္တရာယ်ပြုလိုသူတွေ optimize လုပ်နိုင်စေလို့ပါ။

Allowlist ထဲမှာ image qualities တွေ ထပ်ထည့်နိုင်ပါတယ် — ဥပမာ အောက်ပါအတိုင်း:

```js filename="next.config.js"
module.exports = {
  images: {
    qualities: [25, 50, 75, 100],
  },
}
```

အပေါ်က ဥပမာမှာ — qualities လေးခုပဲ ခွင့်ပြုပါတယ်: 25, 50, 75, နဲ့ 100။

[`quality`](#quality) prop က ဒီ array ထဲက တန်ဖိုးတစ်ခုနဲ့ မကိုက်ညီရင် — အနီးဆုံး ခွင့်ပြုထားတဲ့ တန်ဖိုးကို သုံးပါလိမ့်မယ်။

REST API ကို ဒီ array ထဲက တန်ဖိုးတစ်ခုနဲ့ မကိုက်ညီတဲ့ quality တစ်ခုနဲ့ တိုက်ရိုက် ဝင်ကြည့်ရင် — server က 400 Bad Request response ပြန်ပါလိမ့်မယ်။

#### `formats`

သုံးရမယ့် image formats တွေရဲ့ စာရင်းတစ်ခုကို သတ်မှတ်ဖို့ `formats` က ခွင့်ပြုပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    // Default
    formats: ['image/webp'],
  },
}
```

အကောင်းဆုံး output format ကို ဆုံးဖြတ်ဖို့ — Next.js က request ရဲ့ `Accept` header ကနေ browser ရဲ့ ထောက်ပံ့တဲ့ image formats တွေကို အလိုအလျောက် ရှာဖွေပါတယ်။

`Accept` header က configured formats တွေထဲက တစ်ခုထက်ပိုပြီး ကိုက်ညီရင် — array ထဲမှာ ပထမဆုံး ကိုက်ညီတဲ့ဟာကို သုံးပါတယ်။ ဒါကြောင့် array order က အရေးပါပါတယ်။ ကိုက်ညီမှု မရှိရင် (သို့) source image က animated ဖြစ်နေရင် — မူရင်း image ရဲ့ format ကို သုံးပါတယ်။

Browser က [AVIF ကို မထောက်ပံ့ဘူးဆိုရင်](https://caniuse.com/avif) src image ရဲ့ မူရင်း format ဆီ fallback ဖြစ်စေမယ့် — AVIF support ကို ဖွင့်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    formats: ['image/avif'],
  },
}
```

AVIF ရော WebP formats နှစ်ခုလုံးကိုလည်း အတူတူ ဖွင့်နိုင်ပါတယ်။ AVIF ကို ထောက်ပံ့တဲ့ browsers တွေအတွက် AVIF ကို ဦးစားပေးပြီး — WebP ကို fallback အဖြစ် သုံးပါမယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

> **သိထားသင့်သည်:**
>
> - Use cases အများစုအတွက် WebP ကို သုံးဖို့ပဲ အကြံပြုပါတယ်။
> - AVIF က encode လုပ်ဖို့ ယေဘုယျအားဖြင့် 50% ပိုကြာပေမယ့် — WebP ထက် 20% ပိုပြီး ချုံ့ပေးပါတယ်။ ဆိုလိုတာက — image တစ်ခုကို ပထမဆုံး request လုပ်တဲ့အခါ ပုံမှန်အားဖြင့် ပိုနှေးပေမယ့် — နောက်ပိုင်း cached requests တွေကတော့ ပိုမြန်ပါတယ်။
> - Formats အများအပြား သုံးတဲ့အခါ — Next.js က format တစ်ခုချင်းစီကို သီးခြားစီ cache လုပ်ပါတယ်။ ဆိုလိုတာက — browser support မတူညီတာတွေအတွက် images တွေရဲ့ AVIF ရော WebP versions နှစ်ခုလုံးကို သိမ်းထားလို့ — format တစ်ခုတည်းနဲ့ ယှဉ်ရင် storage လိုအပ်ချက် မြင့်တက်ပါတယ်။
> - Next.js ရဲ့ ရှေ့မှာ Proxy/CDN တစ်ခုနဲ့ self-host လုပ်ရင် — `Accept` header ကို forward လုပ်ဖို့ Proxy ကို configure လုပ်ရပါမယ်။

#### `minimumCacheTTL`

Cached optimized images တွေအတွက် Time to Live (TTL) ကို စက္ကန့်နဲ့ configure လုပ်ဖို့ `minimumCacheTTL` က ခွင့်ပြုပါတယ်။ အများစုမှာ — file contents တွေကို အလိုအလျောက် hash လုပ်ပြီး image ကို `Cache-Control` header `immutable` နဲ့ ထာဝရ cache လုပ်ပေးမယ့် [Static Image Import](/docs/nextjs/image) တစ်ခုကို သုံးတာက ပိုကောင်းပါတယ်။

Configuration မပေးရင် — အောက်ပါ default ကို သုံးပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    minimumCacheTTL: 14400, // 4 hours
  },
}
```

Revalidations အရေအတွက် လျှော့ချပြီး ကုန်ကျစရိတ် ဖြစ်နိုင်သမျှ လျှော့ချဖို့ — TTL ကို မြှင့်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    minimumCacheTTL: 2678400, // 31 days
  },
}
```

Optimized image ရဲ့ expiration (နောက်ထပ် Max Age) ကို — `minimumCacheTTL` (သို့) upstream image ရဲ့ `Cache-Control` header — ဘယ်ဟာ ပိုကြီးလဲ အဲဒါနဲ့ သတ်မှတ်ပါတယ်။

Image တစ်ခုချင်းစီအတွက် caching အပြုအမူ ပြောင်းဖို့ လိုရင် — upstream image ပေါ်မှာ (ဥပမာ `/_next/image` ကိုယ်တိုင် မဟုတ်ဘဲ `/some-asset.jpg`) `Cache-Control` header သတ်မှတ်ဖို့ [`headers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers) ကို configure လုပ်နိုင်ပါတယ်။

လက်ရှိမှာ cache ကို invalidate လုပ်ဖို့ နည်းလမ်း မရှိသေးလို့ — `minimumCacheTTL` ကို နိမ့်နိမ့် ထားတာ အကောင်းဆုံးပါ။ မဟုတ်ရင် — [`src`](#src) prop ကို ကိုယ်တိုင် ပြောင်းရ (သို့) cached file `<distDir>/cache/images` ကို ဖျက်ပစ်ရနိုင်ပါတယ်။

#### `disableStaticImages`

Static image imports တွေကို ပိတ်ဖို့ `disableStaticImages` က ခွင့်ပြုပါတယ်။

Default behavior က — `import icon from './icon.png'` လိုမျိုး static files တွေကို import လုပ်ပြီး `src` property ဆီ ပေးပို့ခွင့်ပြုပါတယ်။ ဒီ feature က import ကို မတူညီတဲ့ပုံစံနဲ့ မျှော်လင့်တဲ့ တခြား plugins တွေနဲ့ conflict ဖြစ်နေရင် — တချို့ အခြေအနေတွေမှာ ဒီ feature ကို ပိတ်ချင်နိုင်ပါတယ်။

သင့် `next.config.js` အတွင်းမှာ static image imports တွေကို ပိတ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```
#### `maximumRedirects`

Default image optimization loader က remote images တွေကို fetch လုပ်တဲ့အခါ — HTTP redirects တွေကို အများဆုံး 3 ကြိမ်အထိ လိုက်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    maximumRedirects: 3,
  },
}
```

သင့် အဆင်ပြေစေဖို့ — ဒီ redirects တွေက [remotePatterns](#remotepatterns) တွေကို ကျေနပ်စရာ မလိုပါဘူး။

Remote images တွေကို fetch လုပ်တဲ့အခါ လိုက်ရမယ့် redirects အရေအတွက်ကို configure လုပ်နိုင်ပါတယ်။ တန်ဖိုးကို `0` လို့ သတ်မှတ်ရင် — redirects တွေကို လိုက်တာ ပိတ်ပါလိမ့်မယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    maximumRedirects: 0,
  },
}
```

#### `maximumDiskCacheSize`

Default image optimization loader က optimized images တွေကို disk ပေါ် ရေးပြီး — နောက်ပိုင်း requests တွေကို disk cache ကနေ ပိုမြန်အောင် serve လုပ်နိုင်ပါတယ်။

Disk cache ရဲ့ အများဆုံး အရွယ်အစားကို bytes နဲ့ configure လုပ်နိုင်ပါတယ် — ဥပမာ 500 MB:

```js filename="next.config.js"
module.exports = {
  images: {
    maximumDiskCacheSize: 500_000_000,
  },
}
```

တန်ဖိုးကို `0` လို့ သတ်မှတ်ပြီး disk cache ကို လုံးဝ ပိတ်ပစ်လည်း ရပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    maximumDiskCacheSize: 0,
  },
}
```

တန်ဖိုး မသတ်မှတ်ရင် — default behavior က startup လုပ်ချိန်မှာ ရနိုင်တဲ့ လက်ရှိ disk space ကို တစ်ကြိမ် စစ်ပြီး 50% ကို သုံးတာပါ။

Disk cache က configured size ထက် ကျော်လွန်တဲ့အခါ — cache က limit အောက် ပြန်ရောက်တဲ့အထိ — အသုံးနည်းဆုံး (least recently used) optimized images တွေကို ဖျက်ပါတယ်။

တနည်းအားဖြင့် — `maximumDiskCacheSize` configuration ကို လျစ်လျူရှုမယ့် [`cacheHandler`](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) ကို သုံးပြီး ကိုယ်ပိုင် cache handler တစ်ခုကို implement လုပ်နိုင်ပါတယ်။

#### `maximumResponseBody`

Default image optimization loader က source images တွေကို အရွယ်အစား 50 MB အထိ fetch လုပ်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    maximumResponseBody: 50_000_000,
  },
}
```

သင့် source images အားလုံး သေးငယ်တယ်ဆိုတာ သေချာရင် — memory ကန့်သတ်ချက်ရှိတဲ့ servers တွေကို ကာကွယ်ဖို့ — ဒါကို 5 MB လိုမျိုး ပိုသေးတဲ့ တန်ဖိုးတစ်ခုဆီ လျှော့ချနိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    maximumResponseBody: 5_000_000,
  },
}
```

#### `dangerouslyAllowLocalIP`

Private network တစ်ခုပေါ်မှာ Next.js ကို self-host လုပ်တဲ့ ရှားပါးတဲ့ အခြေအနေတွေမှာ — network တစ်ခုတည်းပေါ်က local IP addresses တွေကနေ images တွေကို optimize လုပ်တာ ခွင့်ပြုချင်နိုင်ပါတယ်။ ဒါက သင့် internal network ပေါ်က content တွေကို အန္တရာယ်ပြုလိုသူတွေ ဝင်ရောက်နိုင်စေလို့ — users အများစုအတွက် အကြံမပြုပါဘူး။

Default အနေနဲ့ — တန်ဖိုးက false ပါ။

```js filename="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowLocalIP: false,
  },
}
```

သင့် local network ထဲက တခြားနေရာတွေမှာ hosted ဖြစ်နေတဲ့ remote images တွေကို optimize လုပ်ဖို့ လိုရင် — တန်ဖိုးကို true လို့ သတ်မှတ်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowLocalIP: true,
  },
}
```

Split-horizon DNS ပါတဲ့ VPC တစ်ခုထဲမှာ Next.js ကို hosting လုပ်ပြီး status 400 Bad Request ရနေရင် — ဒါ လိုအပ်နိုင်ပါတယ်။ SSRF risk ကို နားလည်ပြီးမှသာ ဖွင့်ပါ။

#### `dangerouslyAllowSVG`

SVG images တွေကို serve လုပ်ဖို့ `dangerouslyAllowSVG` က ခွင့်ပြုပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
  },
}
```

Default အနေနဲ့ — Next.js က SVG images တွေကို အကြောင်းရင်းအနည်းငယ်ကြောင့် optimize မလုပ်ပါဘူး:

- SVG က vector format တစ်ခုမို့ — lossless ဖြစ်အောင် resize လုပ်နိုင်ပါတယ်။
- SVG မှာ HTML/CSS တွေရဲ့ feature တွေ အများအပြား ပါဝင်လို့ — သင့်လျော်တဲ့ [Content Security Policy (CSP) headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#content-security-policy) မရှိရင် vulnerabilities တွေ ဖြစ်စေနိုင်ပါတယ်။

[`src`](#src) prop က SVG ဖြစ်တယ်လို့ သိရတဲ့အခါ — [`unoptimized`](#unoptimized) prop ကို သုံးဖို့ အကြံပြုပါတယ်။ `src` က `".svg"` နဲ့ ဆုံးရင် — ဒါ အလိုအလျောက် ဖြစ်ပါတယ်။

```jsx
<Image src="/my-image.svg" unoptimized />
```

ထပ်ပြီး — browser ကို image download လုပ်ခိုင်းဖို့ `contentDispositionType` ကိုလည်း သတ်မှတ်ပေးဖို့ ပြင်းပြင်းထန်ထန် အကြံပြုပြီး — image ထဲမှာ မြှုပ်ထားတဲ့ scripts တွေ execute မဖြစ်အောင် `contentSecurityPolicy` ကိုပါ သတ်မှတ်ပေးပါ။

```js filename="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

#### `contentDispositionType`

[`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#as_a_response_header_for_the_main_body) header ကို configure လုပ်ဖို့ `contentDispositionType` က ခွင့်ပြုပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    contentDispositionType: 'inline',
  },
}
```

#### `contentSecurityPolicy`

Images တွေအတွက် [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) header ကို configure လုပ်ဖို့ `contentSecurityPolicy` က ခွင့်ပြုပါတယ်။ [`dangerouslyAllowSVG`](#dangerouslyallowsvg) သုံးတဲ့အခါ — image ထဲမှာ မြှုပ်ထားတဲ့ scripts တွေ execute မဖြစ်အောင် ကာကွယ်ဖို့ ဒါက အထူး အရေးကြီးပါတယ်။

```js filename="next.config.js"
module.exports = {
  images: {
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

Default အနေနဲ့ — API က မဆိုင်းမလဲ remote images တွေကို serve လုပ်နိုင်လို့ — [loader](#loader) က နောက်ထပ် အကာအကွယ်တစ်ခုအတွက် [`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#as_a_response_header_for_the_main_body) header ကို `attachment` အဖြစ် သတ်မှတ်ပေးပါတယ်။

Default တန်ဖိုးက `attachment` ဖြစ်ပြီး — browser က တိုက်ရိုက် ဝင်ကြည့်တဲ့အခါ image ကို download လုပ်ခိုင်းပါတယ်။ [`dangerouslyAllowSVG`](#dangerouslyallowsvg) true ဖြစ်တဲ့အခါ ဒါက အထူး အရေးကြီးပါတယ်။

Optionally — `inline` လို့ configure လုပ်ပြီး — browser က တိုက်ရိုက် ဝင်ကြည့်တဲ့အခါ download မလုပ်ဘဲ image ကို render လုပ်ခွင့်ပြုနိုင်ပါတယ်။

### Deprecated configuration options

#### `domains`

> **သတိပေးချက်**: အန္တရာယ်ပြုလိုသူတွေကနေ သင့် application ကို ကာကွယ်ဖို့ — တင်းကျပ်တဲ့ [`remotePatterns`](#remotepatterns) ရဲ့ မျက်နှာသာပေးမှုနဲ့ Next.js 14 ကစပြီး Deprecated ဖြစ်ပါတယ်။

[`remotePatterns`](#remotepatterns) နဲ့ ဆင်တူပြီး — `domains` configuration ကို external images တွေအတွက် ခွင့်ပြုထားတဲ့ hostnames စာရင်းတစ်ခု ပေးဖို့ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — `domains` configuration က wildcard pattern matching ကို မထောက်ပံ့ဘဲ — protocol, port (သို့) pathname တွေကိုလည်း ကန့်သတ်လို့ မရပါဘူး။

Remote image servers အများစုက tenants အများအပြားကြားမှာ shared ဖြစ်နေလို့ — ရည်ရွယ်ထားတဲ့ images တွေကိုပဲ optimize လုပ်ဖြစ်စေဖို့ `remotePatterns` ကို သုံးတာက ပိုလုံခြုံပါတယ်။

`next.config.js` file ထဲမှာ `domains` property ရဲ့ ဥပမာတစ်ခုကို အောက်မှာ ဖော်ပြထားပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    domains: ['assets.acme.com'],
  },
}
```
## Functions

### `getImageProps`

`getImageProps` function ကို သုံးပြီး — အောက်ခံ `<img>` element ဆီ ပို့ပေးမယ့် props တွေကို ရယူနိုင်ပြီး — တခြား component, style, canvas စတာတွေဆီ အဲဒီအစား ပေးပို့နိုင်ပါတယ်။

```jsx
import { getImageProps } from 'next/image'

const { props } = getImageProps({
  src: 'https://example.com/image.jpg',
  alt: 'A scenic mountain view',
  width: 1200,
  height: 800,
})

function ImageWithCaption() {
  return (
    <figure>
      <img {...props} />
      <figcaption>A scenic mountain view</figcaption>
    </figure>
  )
}
```

ဒါက React ရဲ့ `useState()` ကို ခေါ်တာကိုလည်း ရှောင်ရှားပေးလို့ — performance ပိုကောင်းစေနိုင်ပါတယ်။ ဒါပေမယ့် — placeholder ကို ဘယ်တော့မှ ဖယ်ရှားပေးမှာ မဟုတ်လို့ — [`placeholder`](#placeholder) prop နဲ့တော့ သုံးလို့ မရပါဘူး။

## Known browser bugs

ဒီ `next/image` component က browser native [lazy loading](https://caniuse.com/loading-lazy-attr) ကို သုံးပြီး — Safari 15.4 မတိုင်ခင်က ပိုအသက်ကြီးတဲ့ browsers တွေမှာ eager loading ဆီ fallback ဖြစ်နိုင်ပါတယ်။ Blur-up placeholder သုံးတဲ့အခါ — Safari 12 မတိုင်ခင်က browsers တွေမှာ empty placeholder ဆီ fallback ဖြစ်ပါတယ်။ `width`/`height` တန်ဖိုး `auto` တွေနဲ့ styles သုံးတဲ့အခါ — [aspect ratio ကို ထိန်းသိမ်းမပေး](https://caniuse.com/mdn-html_elements_img_aspect_ratio_computed_from_attributes)တဲ့ Safari 15 မတိုင်ခင်က browsers တွေမှာ [Layout Shift](https://web.dev/cls/) ဖြစ်စေနိုင်ပါတယ်။ အသေးစိတ်အတွက် [ဒီ MDN video](https://www.youtube.com/watch?v=4-d_SoCHeWE) ကို ကြည့်ပါ။

- [Safari 15 - 16.3](https://bugs.webkit.org/show_bug.cgi?id=243601) တွေက loading လုပ်နေချိန်မှာ မီးခိုးရောင် border တစ်ခု ပြသပါတယ်။ Safari 16.4 က [ဒီ issue ကို ပြုပြင်ပေးခဲ့ပါတယ်](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/#:~:text=Now%20in%20Safari%2016.4%2C%20a%20gray%20line%20no%20longer%20appears%20to%20mark%20the%20space%20where%20a%20lazy%2Dloaded%20image%20will%20appear%20once%20it%E2%80%99s%20been%20loaded.)။ ဖြစ်နိုင်တဲ့ ဖြေရှင်းနည်းတွေ:
  - CSS `@supports (font: -apple-system-body) and (-webkit-appearance: none) { img[loading="lazy"] { clip-path: inset(0.6px) } }` ကို သုံးပါ
  - Image က above the fold မှာ ရှိနေရင် [`loading="eager"`](#loading) ကို သုံးပါ
- [Firefox 67+](https://bugzilla.mozilla.org/show_bug.cgi?id=1556156) က loading လုပ်နေချိန်မှာ အဖြူရောင် background တစ်ခု ပြသပါတယ်။ ဖြစ်နိုင်တဲ့ ဖြေရှင်းနည်းတွေ:
  - [AVIF `formats`](#formats) ကို ဖွင့်ပါ
  - [`placeholder`](#placeholder) ကို သုံးပါ

## ဥပမာများ (Examples)

### Images တွေကို styling လုပ်ခြင်း

Image component ကို styling လုပ်တာက ပုံမှန် `<img>` element တစ်ခုကို styling လုပ်တာနဲ့ ဆင်တူပေမယ့် — သတိထားရမယ့် လမ်းညွှန်ချက်တချို့ ရှိပါတယ်:

`styled-jsx` မဟုတ်ဘဲ — `className` (သို့) `style` ကို သုံးပါ။ အများစုမှာ — `className` prop ကို သုံးဖို့ အကြံပြုပါတယ်။ ဒါက imported [CSS Module](/docs/nextjs/css) တစ်ခု၊ [global stylesheet](/docs/nextjs/css#global-css) တစ်ခု စသဖြင့် ဖြစ်နိုင်ပါတယ်။

```jsx
import styles from './styles.module.css'

export default function MyImage() {
  return <Image className={styles.image} src="/my-image.png" alt="My Image" />
}
```

`style` prop ကို သုံးပြီး inline styles တွေလည်း သတ်မှတ်နိုင်ပါတယ်။

```jsx
export default function MyImage() {
  return (
    <Image style={{ borderRadius: '8px' }} src="/my-image.png" alt="My Image" />
  )
}
```

`fill` သုံးတဲ့အခါ — parent element က `position: relative`, `fixed`, (သို့) `absolute` နဲ့ positioned ဖြစ်နေရပါမယ်။ Image ကိုယ်တိုင်က `position: absolute` ကို သုံးလို့ — အနီးဆုံး positioned ancestor နဲ့ သူ့ရဲ့ အရွယ်အစားကို တွက်ပါတယ်။

```jsx
<div style={{ position: 'relative' }}>
  <Image fill src="/my-image.png" alt="My Image" />
</div>
```

[styled-jsx](https://nextjs.org/docs/app/guides/css-in-js) ကတော့ လက်ရှိ component ထဲမှာပဲ scoped ဖြစ်လို့ (style ကို `global` လို့ မမှတ်သားထားရင်) — သုံးလို့ မရပါဘူး။

### Static export နဲ့ responsive images

Static image တစ်ခုကို import လုပ်တဲ့အခါ — Next.js က file ပေါ် အခြေခံပြီး သူ့ရဲ့ width နဲ့ height ကို အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။ Style သတ်မှတ်ပြီး image ကို responsive ဖြစ်စေနိုင်ပါတယ်:

```jsx
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Responsive() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image
        alt="Mountains"
        // Image တစ်ခုကို import လုပ်တာက
        // width နဲ့ height ကို အလိုအလျောက် သတ်မှတ်ပေးပါတယ်
        src={mountains}
        sizes="100vw"
        // Image ကို အပြည့်အနံ ပြသစေပြီး
        // aspect ratio ကို ထိန်းသိမ်းပေးပါ
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
```

### Remote URL တစ်ခုနဲ့ responsive images

Source image က dynamic (သို့) remote URL တစ်ခုဆိုရင် — Next.js က aspect ratio တွက်နိုင်ဖို့ width နဲ့ height props တွေကို ပေးရပါမယ်:

```jsx filename="components/page.js"
import Image from 'next/image'

export default function Page({ photoUrl }) {
  return (
    <Image
      src={photoUrl}
      alt="Picture of the author"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
      width={500}
      height={300}
    />
  )
}
```

စမ်းကြည့်ပါ:

- [Viewport ကို လိုက်လျောတဲ့ responsive image ကို demo လုပ်ကြည့်ပါ](https://image-component.nextjs.gallery/responsive)

### `fill` နဲ့ responsive image

Image ရဲ့ aspect ratio ကို မသိရဘူးဆိုရင် — `objectFit` prop ကို `cover` လို့ သတ်မှတ်ပြီး [`fill` prop](#fill) ကို ထည့်နိုင်ပါတယ်။ ဒါက image ကို သူ့ရဲ့ parent container ရဲ့ အပြည့်အနံ ဖြည့်စေပါလိမ့်မယ်။

```jsx
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Fill() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto))',
      }}
    >
      <div style={{ position: 'relative', width: '400px' }}>
        <Image
          alt="Mountains"
          src={mountains}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: 'cover', // cover, contain, none
          }}
        />
      </div>
      {/* Grid ထဲမှာ နောက်ထပ် images တွေ ထည့်နိုင်ပါသေးတယ်... */}
    </div>
  )
}
```

### Background Image

Screen ဧရိယာ တစ်ခုလုံးကို image က ဖုံးအုပ်ဖို့ — `fill` prop ကို သုံးပါ:

```jsx
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Background() {
  return (
    <Image
      alt="Mountains"
      src={mountains}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  )
}
```

Styles အမျိုးမျိုးနဲ့ သုံးထားတဲ့ Image component ရဲ့ ဥပမာတွေအတွက် — [Image Component Demo](https://image-component.nextjs.gallery) ကို ကြည့်ပါ။

### Remote images

Remote image တစ်ခု သုံးဖို့ — `src` property က URL string တစ်ခု ဖြစ်သင့်ပါတယ်။

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

Build process အတွင်း Next.js က remote files တွေကို ဝင်ရောက်ခွင့် မရှိတာမို့ — [`width`](/docs/nextjs/component-image), [`height`](/docs/nextjs/component-image) နဲ့ optional [`blurDataURL`](/docs/nextjs/component-image#blurdataurl) props တွေကို ကိုယ်တိုင် ပေးရပါမယ်။

`width` နဲ့ `height` attributes တွေကို image ရဲ့ မှန်ကန်တဲ့ aspect ratio ကို ခန့်မှန်းပြီး — image load ဝင်တာကနေ layout shift ရှောင်ဖို့ သုံးပါတယ်။ `width` နဲ့ `height` တွေက image file ရဲ့ _rendered size ကို_ သတ်မှတ်တာ မဟုတ်ပါဘူး။

Images တွေကို optimize လုပ်တာ လုံခြုံစွာ ခွင့်ပြုဖို့ — `next.config.js` ထဲမှာ ထောက်ပံ့ထားတဲ့ URL patterns စာရင်းတစ်ခုကို သတ်မှတ်ပါ။ အန္တရာယ်ရှိတဲ့ အသုံးပြုမှုတွေ မဖြစ်အောင် — တတ်နိုင်သမျှ specific ဖြစ်ပါစေ။ ဥပမာ — အောက်ပါ configuration က specific AWS S3 bucket တစ်ခုကနေပဲ images တွေကို ခွင့်ပြုပါလိမ့်မယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}
```
### Theme detection

Light နဲ့ dark mode တွေအတွက် မတူညီတဲ့ image တစ်ခု ပြသချင်ရင် — `<Image>` components နှစ်ခုကို wrap လုပ်ပြီး CSS media query တစ်ခုအပေါ် အခြေခံကာ မှန်ကန်တဲ့ဟာကို ပြသပေးတဲ့ component အသစ်တစ်ခု ဖန်တီးနိုင်ပါတယ်။

```css filename="components/theme-image.module.css"
.imgDark {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .imgLight {
    display: none;
  }
  .imgDark {
    display: unset;
  }
}
```

```tsx filename="components/theme-image.tsx" switcher
import styles from './theme-image.module.css'
import Image, { ImageProps } from 'next/image'

type Props = Omit<ImageProps, 'src' | 'preload' | 'loading'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```

```jsx filename="components/theme-image.js" switcher
import styles from './theme-image.module.css'
import Image from 'next/image'

const ThemeImage = (props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```

> **သိထားသင့်သည်:** `loading="lazy"` ရဲ့ default behavior က မှန်ကန်တဲ့ image တစ်ခုတည်းကိုပဲ load ဖြစ်စေတာ သေချာစေပါတယ်။ `preload` (သို့) `loading="eager"` တွေကို မသုံးနိုင်ပါဘူး — images နှစ်ခုလုံး load ဖြစ်စေလို့ပါ။ အဲဒီအစား — [`fetchPriority="high"`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority) ကို သုံးနိုင်ပါတယ်။

စမ်းကြည့်ပါ:

- [Light/dark mode theme detection ကို demo လုပ်ကြည့်ပါ](https://image-component.nextjs.gallery/theme)

### Art direction

Mobile နဲ့ desktop တွေအတွက် မတူညီတဲ့ image တစ်ခု ပြသချင်ရင် — တခါတရံ [Art Direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#art_direction) လို့ ခေါ်ပါတယ် — `getImageProps()` ကို မတူညီတဲ့ `src`, `width`, `height`, နဲ့ `quality` props တွေနဲ့ ပေးနိုင်ပါတယ်။

```jsx filename="app/page.js"
import { getImageProps } from 'next/image'

export default function Home() {
  const common = { alt: 'Art Direction Example', sizes: '100vw' }
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    width: 1440,
    height: 875,
    quality: 80,
    src: '/desktop.jpg',
  })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width: 750,
    height: 1334,
    quality: 70,
    src: '/mobile.jpg',
  })

  return (
    <picture>
      <source media="(min-width: 1000px)" srcSet={desktop} />
      <source media="(min-width: 500px)" srcSet={mobile} />
      <img {...rest} style={{ width: '100%', height: 'auto' }} />
    </picture>
  )
}
```

### Background CSS

Background image တစ်ခုကို optimize လုပ်ဖို့ — `srcSet` string ကို [`image-set()`](https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set) CSS function အဖြစ်တောင် ပြောင်းလဲနိုင်ပါတယ်။

```jsx filename="app/page.js"
import { getImageProps } from 'next/image'

function getBackgroundImage(srcSet = '') {
  const imageSet = srcSet
    .split(', ')
    .map((str) => {
      const [url, dpi] = str.split(' ')
      return `url("${url}") ${dpi}`
    })
    .join(', ')
  return `image-set(${imageSet})`
}

export default function Home() {
  const {
    props: { srcSet },
  } = getImageProps({ alt: '', width: 128, height: 128, src: '/img.png' })
  const backgroundImage = getBackgroundImage(srcSet)
  const style = { height: '100vh', width: '100vw', backgroundImage }

  return (
    <main style={style}>
      <h1>Hello World</h1>
    </main>
  )
}
```

## Version History

| Version    | အပြောင်းအလဲ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v16.1.7`  | `maximumDiskCacheSize` configuration ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `v16.1.2`  | `maximumResponseBody` configuration ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `v16.0.0`  | `qualities` default configuration ကို `[75]` အဖြစ် ပြောင်း၊ `preload` prop ထည့်သွင်း၊ `priority` prop ကို deprecated လုပ်၊ `dangerouslyAllowLocalIP` config ထည့်သွင်း၊ `maximumRedirects` config ထည့်သွင်း။                                                                                                                                                                                                                                                                                                            |
| `v15.3.0`  | `remotePatterns` မှာ `URL` objects array တွေအတွက် support ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `v15.0.0`  | `contentDispositionType` configuration ရဲ့ default ကို `attachment` အဖြစ် ပြောင်း။                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `v14.2.23` | `qualities` configuration ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `v14.2.15` | `decoding` prop နဲ့ `localPatterns` configuration ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `v14.2.14` | `remotePatterns.search` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `v14.2.0`  | `overrideSrc` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `v14.1.0`  | `getImageProps()` က stable ဖြစ်လာ။                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `v14.0.0`  | `onLoadingComplete` prop နဲ့ `domains` config တွေကို deprecated လုပ်။                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `v13.4.14` | `placeholder` prop မှာ `data:/image...` အတွက် support ထည့်သွင်း                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `v13.2.0`  | `contentDispositionType` configuration ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `v13.0.6`  | `ref` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `v13.0.0`  | `next/image` import ကို `next/legacy/image` အဖြစ် အမည်ပြောင်း။ `next/future/image` import ကို `next/image` အဖြစ် အမည်ပြောင်း။ Imports တွေကို လုံခြုံစွာ အလိုအလျောက် အမည်ပြောင်းဖို့ [codemod ရနိုင်ပါတယ်](https://nextjs.org/docs/app/guides/upgrading/codemods#next-image-to-legacy-image)。 `<span>` wrapper ကို ဖယ်ရှား။ `layout`, `objectFit`, `objectPosition`, `lazyBoundary`, `lazyRoot` props တွေကို ဖယ်ရှား။ `alt` က required ဖြစ်လာ။ `onLoadingComplete` က `img` element ဆီ reference ကို လက်ခံရရှိ။ Built-in loader config ကို ဖယ်ရှား။ |
| `v12.3.0`  | `remotePatterns` နဲ့ `unoptimized` configuration တွေ stable ဖြစ်လာ။                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `v12.2.0`  | Experimental `remotePatterns` နဲ့ experimental `unoptimized` configuration တွေ ထည့်သွင်း။ `layout="raw"` ကို ဖယ်ရှား။                                                                                                                                                                                                                                                                                                                                                                                  |
| `v12.1.1`  | `style` prop ထည့်သွင်း။ `layout="raw"` အတွက် experimental support ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `v12.1.0`  | `dangerouslyAllowSVG` နဲ့ `contentSecurityPolicy` configuration တွေ ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v12.0.9`  | `lazyRoot` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v12.0.0`  | `formats` configuration ထည့်သွင်း။ AVIF support ထည့်သွင်း။ Wrapper `<div>` ကို `<span>` အဖြစ် ပြောင်း။                                                                                                                                                                                                                                                                                                                                                                                            |
| `v11.1.0`  | `onLoadingComplete` နဲ့ `lazyBoundary` props တွေ ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `v11.0.0`  | `src` prop မှာ static import အတွက် support ထည့်သွင်း။ `placeholder` prop ထည့်သွင်း။ `blurDataURL` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                          |
| `v10.0.5`  | `loader` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `v10.0.1`  | `layout` prop ထည့်သွင်း။                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `v10.0.0`  | `next/image` စတင် မိတ်ဆက်။                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
