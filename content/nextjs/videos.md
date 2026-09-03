---
title: "Videos (video များ အသုံးပြုခြင်းနဲ့ optimize လုပ်ခြင်း)"
description: "Next.js application တွေမှာ video files တွေကို performance မထိခိုက်စေဘဲ သိမ်းဆည်း၊ ပြသနည်း — `<video>`/`<iframe>` tags, best practices, self-hosted videos, Vercel Blob နဲ့ third-party integrations"
order: 232
source: "https://nextjs.org/docs/app/guides/videos"
status: translated
updated: 2026-09-03
---

ဒီ page က Next.js applications တွေမှာ videos တွေကို ဘယ်လို အသုံးပြုမလဲ — performance ကို မထိခိုက်စေဘဲ video files တွေကို ဘယ်လို သိမ်းဆည်း၊ ပြသမလဲဆိုတာကို ဖော်ပြထားပါတယ်။

## `<video>` နဲ့ `<iframe>` အသုံးပြုခြင်း

Videos တွေကို page ပေါ်မှာ — တိုက်ရိုက် video files တွေအတွက် HTML **`<video>`** tag နဲ့ရော — ပြင်ပ platform တွေမှာ host လုပ်ထားတဲ့ videos တွေအတွက် **`<iframe>`** နဲ့ပါ embed လုပ်နိုင်ပါတယ်။

### `<video>`

HTML [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tag က self-hosted (ကိုယ်တိုင် host လုပ်) (သို့) တိုက်ရိုက် ပို့ဆောင်ပေးတဲ့ video content တွေကို embed လုပ်နိုင်ပြီး — playback နဲ့ အသွင်အပြင်အပေါ် အပြည့်အဝ ထိန်းချုပ်မှု ပေးပါတယ်။

```jsx filename="app/ui/video.jsx"
export function Video() {
  return (
    <video width="320" height="240" controls preload="none">
      <source src="/path/to/video.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  )
}
```

### `<video>` tag ရဲ့ အသုံးများတဲ့ attributes

| Attribute     | ဖော်ပြချက် (Description)                                                       | ဥပမာ တန်ဖိုး (Example Value)        |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| `src`         | Video file ရဲ့ source ကို သတ်မှတ်ပေးပါတယ်။                                   | `<video src="/path/to/video.mp4" />` |
| `width`       | Video player ရဲ့ width (အကျယ်) ကို သတ်မှတ်ပေးပါတယ်။                          | `<video width="320" />`              |
| `height`      | Video player ရဲ့ height (အမြင့်) ကို သတ်မှတ်ပေးပါတယ်။                        | `<video height="240" />`             |
| `controls`    | ပါဝင်နေရင် — default playback controls တွေကို ပြသပေးပါတယ်။                   | `<video controls />`                 |
| `autoPlay`    | Page load ဖြစ်တာနဲ့ video ကို အလိုအလျောက် စဖွင့်ပေးပါတယ်။ မှတ်ချက်: Autoplay policies တွေက browser အလိုက် ကွဲပြားပါတယ်။ | `<video autoPlay />`                 |
| `loop`        | Video playback ကို ထပ်ခါထပ်ခါ ပြန်ဖွင့်ပေးပါတယ်။                             | `<video loop />`                     |
| `muted`       | Audio ကို default အနေနဲ့ mute (အသံပိတ်) လုပ်ပေးပါတယ်။ `autoPlay` နဲ့ တွဲသုံးလေ့ ရှိပါတယ်။ | `<video muted />`                    |
| `preload`     | Video ကို ဘယ်လို preload လုပ်မလဲ သတ်မှတ်ပေးပါတယ်။ Values: `none`, `metadata`, `auto`။ | `<video preload="none" />`           |
| `playsInline` | iOS devices တွေမှာ inline playback ကို ဖွင့်ပေးပါတယ် — iOS Safari မှာ autoplay အလုပ်လုပ်ဖို့ မကြာခဏ လိုအပ်ပါတယ်။ | `<video playsInline />`              |

> **သိထားသင့်သည်:** `autoPlay` attribute ကို သုံးတဲ့အခါ — browser အများစုမှာ video က အလိုအလျောက် ဖွင့်နိုင်ဖို့ `muted` attribute ကိုပါ ထည့်သွင်းဖို့ အရေးကြီးပြီး — iOS devices တွေနဲ့ လိုက်ဖက်ညီမှုအတွက် `playsInline` attribute ကိုလည်း ထည့်သွင်းဖို့ အရေးကြီးပါတယ်။

Video attributes တွေရဲ့ ပြည့်စုံတဲ့ စာရင်းအတွက် [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attributes) ကို ကိုးကားပါ။

### Video best practices (video အတွက် အကောင်းဆုံး နည်းလမ်းများ)

- **Fallback Content (နေရာခံ content):** `<video>` tag ကို သုံးတဲ့အခါ — video playback ကို မထောက်ပံ့တဲ့ browsers တွေအတွက် tag ရဲ့ အတွင်းမှာ fallback content တစ်ခု ထည့်ပါ။
- **Subtitles (သို့) Captions:** နားမကြား (သို့) အကြားအာရုံ ချို့ယွင်းသူတွေအတွက် subtitles (သို့) captions တွေ ထည့်ပါ။ Caption file တွေရဲ့ source တွေကို သတ်မှတ်ဖို့ သင့် `<video>` elements တွေမှာ [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) tag ကို အသုံးပြုပါ။
- **Accessible Controls (သုံးစွဲနိုင်မှု မြှင့်တင်ထားတဲ့ controls):** Keyboard navigation နဲ့ screen reader လိုက်ဖက်မှုအတွက် standard HTML5 video controls တွေကို အကြံပြုပါတယ်။ ပိုအဆင့်မြင့်တဲ့ လိုအပ်ချက်တွေအတွက်တော့ — accessible controls တွေနဲ့ တစ်သမတ်တည်း browser experience ပေးတဲ့ [react-player](https://github.com/cookpete/react-player) (သို့) [video.js](https://videojs.com/) လို third-party players တွေကို စဉ်းစားပါ။

### `<iframe>`

HTML `<iframe>` tag က YouTube (သို့) Vimeo လို ပြင်ပ platforms တွေကနေ videos တွေကို embed လုပ်နိုင်စေပါတယ်။

```jsx filename="app/page.jsx"
export default function Page() {
  return (
    <iframe src="https://www.youtube.com/embed/19g66ezsKAg" allowFullScreen />
  )
}
```

### `<iframe>` tag ရဲ့ အသုံးများတဲ့ attributes

| Attribute         | ဖော်ပြချက် (Description)                                            | ဥပမာ တန်ဖိုး (Example Value)          |
| ----------------- | -------------------------------------------------------------------- | -------------------------------------- |
| `src`             | Embed လုပ်မယ့် page ရဲ့ URL ပါ။                                    | `<iframe src="https://example.com" />` |
| `width`           | Iframe ရဲ့ width ကို သတ်မှတ်ပေးပါတယ်။                             | `<iframe width="500" />`               |
| `height`          | Iframe ရဲ့ height ကို သတ်မှတ်ပေးပါတယ်။                            | `<iframe height="300" />`              |
| `allowFullScreen` | Iframe content ကို full-screen mode မှာ ပြသခွင့် ပေးပါတယ်။        | `<iframe allowFullScreen />`           |
| `sandbox`         | Iframe အတွင်းက content အပေါ် ကန့်သတ်ချက် အပိုတစ်စုံကို ဖွင့်ပေးပါတယ်။ | `<iframe sandbox />`                   |
| `loading`         | Loading အပြုအမူကို optimize လုပ်ပေးပါတယ် (ဥပမာ — lazy loading)။  | `<iframe loading="lazy" />`            |
| `title`           | Accessibility (သုံးစွဲနိုင်မှု) ကို အထောက်အကူပြုဖို့ iframe အတွက် title တစ်ခု ပေးပါတယ်။ | `<iframe title="Description" />`       |

Iframe attributes တွေရဲ့ ပြည့်စုံတဲ့ စာရင်းအတွက် [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attributes) ကို ကိုးကားပါ။

### Video embed လုပ်နည်း ရွေးချယ်ခြင်း

သင့် Next.js application ထဲမှာ videos တွေကို embed လုပ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- **Self-hosted (သို့) တိုက်ရိုက် video files:** Player ရဲ့ လုပ်ဆောင်ချက်နဲ့ အသွင်အပြင်အပေါ် အသေးစိတ် ထိန်းချုပ်မှု လိုအပ်တဲ့ အခြေအနေတွေအတွက် — `<video>` tag ကို သုံးပြီး self-hosted videos တွေကို embed လုပ်ပါ။ Next.js ထဲက ဒီ integration နည်းလမ်းက သင့် video content တွေကို customize လုပ်ပြီး ထိန်းချုပ်ခွင့် ပေးပါတယ်။
- **Video hosting services (YouTube, Vimeo စသည်) သုံးခြင်း:** YouTube (သို့) Vimeo လို video hosting services တွေအတွက်ဆိုရင် — သူတို့ရဲ့ iframe-based players တွေကို `<iframe>` tag နဲ့ embed လုပ်ပါ။ ဒီနည်းလမ်းက player အပေါ် ထိန်းချုပ်မှု တချို့ ကန့်သတ်ခံရပေမယ့် — အသုံးပြုရ လွယ်ကူမှုနဲ့ ဒီ platforms တွေက ပေးတဲ့ features တွေကို ရရှိစေပါတယ်။

သင့် application ရဲ့ လိုအပ်ချက်တွေနဲ့ ပေးအပ်ဖို့ ရည်ရွယ်ထားတဲ့ user experience နဲ့ ကိုက်ညီတဲ့ embedding နည်းလမ်းကို ရွေးချယ်ပါ။

### ပြင်ပမှာ host လုပ်ထားတဲ့ videos တွေကို embed လုပ်ခြင်း

ပြင်ပ platforms တွေကနေ videos တွေကို embed လုပ်ဖို့ — video အချက်အလက်တွေကို fetch လုပ်ဖို့ Next.js ကိုရော — loading လုပ်နေချိန်မှာ fallback state ကို ကိုင်တွယ်ဖို့ React Suspense ကိုပါ သုံးနိုင်ပါတယ်။

**1. Video embedding အတွက် Server Component တစ်ခု ဖန်တီးပါ**

ပထမဆုံး အဆင့်က — video ကို embed လုပ်ဖို့ သင့်လျော်တဲ့ iframe ကို generate လုပ်ပေးတဲ့ [Server Component](/docs/nextjs/server-client-components) တစ်ခု ဖန်တီးတာပါ။ ဒီ component က video ရဲ့ source URL ကို fetch လုပ်ပြီး iframe ကို render လုပ်ပါလိမ့်မယ်။

```jsx filename="app/ui/video-component.jsx"
export default async function VideoComponent() {
  const src = await getVideoSrc()

  return <iframe src={src} allowFullScreen />
}
```

**2. React Suspense သုံးပြီး video component ကို stream လုပ်ပါ**

Video ကို embed လုပ်ဖို့ Server Component ဖန်တီးပြီးတဲ့နောက် — နောက်တစ်ဆင့်က [React Suspense](https://react.dev/reference/react/Suspense) ကို သုံးပြီး component ကို [stream](/docs/nextjs/file-conventions-loading) လုပ်တာပါ။

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>Loading video...</p>}>
        <VideoComponent />
      </Suspense>
      {/* Other content of the page */}
    </section>
  )
}
```

> **သိထားသင့်သည်:** ပြင်ပ platforms တွေကနေ videos တွေကို embed လုပ်တဲ့အခါ အောက်ပါ best practices တွေကို ထည့်သွင်း စဉ်းစားပါ:
>
> - Video embeds တွေ responsive (မျက်နှာပြင် အရွယ်အစားနဲ့ လိုက်လျောညီထွေ) ဖြစ်ကြောင်း သေချာပါစေ။ Iframe (သို့) video player က screen sizes အမျိုးမျိုးနဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် CSS ကို သုံးပါ။
> - Data plan အကန့်အသတ် ရှိတဲ့ users တွေအတွက် အထူးသဖြင့် — network အခြေအနေတွေပေါ် မူတည်ပြီး [video loading strategies](https://yoast.com/site-speed-tips-for-faster-video/) တွေကို အကောင်အထည်ဖော်ပါ။

ဒီချဉ်းကပ်နည်းက page ကို block ဖြစ်မသွားအောင် တားဆီးပေးလို့ — video component ထဲ stream ဝင်နေချိန်မှာ user က page နဲ့ interact လုပ်လို့ရတာမို့ — ပိုကောင်းတဲ့ user experience ကို ရရှိစေပါတယ်။

ပိုပြီး ဆွဲဆောင်မှုရှိပြီး အချက်အလက် ကြွယ်ဝတဲ့ loading experience အတွက် — fallback UI အဖြစ် loading skeleton တစ်ခုကို သုံးစဉ်းစားပါ။ ရိုးရိုး loading message တစ်ခု ပြမယ့်အစား — video player ပုံစံနဲ့ ဆင်တဲ့ skeleton တစ်ခုကို ဒီလို ပြနိုင်ပါတယ်:

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'
import VideoSkeleton from '../ui/VideoSkeleton.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<VideoSkeleton />}>
        <VideoComponent />
      </Suspense>
      {/* Other content of the page */}
    </section>
  )
}
```

## Self-hosted videos (ကိုယ်တိုင် host လုပ်ထားတဲ့ videos)

Self-hosting လုပ်တာက အကြောင်းရင်း အများအပြားအတွက် ပိုသင့်လျော်နိုင်ပါတယ်:

- **အပြည့်အဝ ထိန်းချုပ်မှုနဲ့ လွတ်လပ်မှု (Complete control and independence):** Self-hosting က playback ကနေ အသွင်အပြင်အထိ သင့် video content တွေကို တိုက်ရိုက် စီမံခန့်ခွဲခွင့် ပေးပြီး — ပြင်ပ platform တွေရဲ့ ကန့်သတ်ချက်တွေကနေ ကင်းလွတ်တဲ့ အပြည့်အဝ ပိုင်ဆိုင်မှုနဲ့ ထိန်းချုပ်မှုကို ရရှိစေပါတယ်။
- **သီးခြား လိုအပ်ချက်တွေအတွက် customize လုပ်နိုင်မှု (Customization for specific needs):** Dynamic background videos တွေလို ထူးခြားတဲ့ လိုအပ်ချက်တွေအတွက် စံပြ ဖြစ်ပြီး — design နဲ့ functional လိုအပ်ချက်တွေနဲ့ ကိုက်ညီအောင် အံဝင်ခွင်ကျ customize လုပ်နိုင်စေပါတယ်။
- **Performance နဲ့ scalability ထည့်သွင်းစဉ်းစားချက်များ (Performance and scalability considerations):** တိုးလာနေတဲ့ traffic နဲ့ content အရွယ်အစားတွေကို ထိထိရောက်ရောက် ထောက်ပံ့နိုင်ဖို့ — performance ကောင်းပြီး scale လုပ်လို့ရတဲ့ storage solutions တွေကို ရွေးချယ်ပါ။
- **ကုန်ကျစရိတ်နဲ့ ပေါင်းစည်းမှု (Cost and integration):** Storage နဲ့ bandwidth ရဲ့ ကုန်ကျစရိတ်တွေကို — သင့် Next.js framework နဲ့ ပိုကျယ်ပြန့်တဲ့ tech ecosystem ထဲကို လွယ်ကူစွာ ပေါင်းစည်းနိုင်မှု လိုအပ်ချက်နဲ့ ချိန်ခွင်လျှာ ညှိပါ။

### Video hosting အတွက် Vercel Blob အသုံးပြုခြင်း

[Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) က videos တွေကို host လုပ်ဖို့ ထိရောက်တဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ် — Next.js နဲ့ ကောင်းမွန်စွာ အလုပ်လုပ်တဲ့ scalable cloud storage solution တစ်ခုပါ။ Vercel Blob ကို သုံးပြီး video တစ်ခုကို ဒီလို host လုပ်နိုင်ပါတယ်:

**1. Vercel Blob ဆီ video တစ်ခု upload လုပ်ခြင်း**

သင့် Vercel dashboard ထဲမှာ — "Storage" tab ဆီ သွားပြီး သင့် [Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) store ကို ရွေးပါ။ Blob table ရဲ့ အပေါ်ညာဘက် ထောင့်မှာ "Upload" button ကို ရှာပြီး နှိပ်ပါ။ ပြီးရင် upload လုပ်ချင်တဲ့ video file ကို ရွေးပါ။ Upload ပြီးမြောက်ပြီးနောက် — video file က Blob table ထဲမှာ ပေါ်လာပါလိမ့်မယ်။

တနည်းအားဖြင့် — server action တစ်ခုကို သုံးပြီးလည်း သင့် video ကို upload လုပ်နိုင်ပါတယ်။ အသေးစိတ် ညွှန်ကြားချက်တွေအတွက် — [server-side uploads](https://vercel.com/docs/vercel-blob/server-upload) ဆိုင်ရာ Vercel documentation ကို ကိုးကားပါ။ Vercel က [client-side uploads](https://vercel.com/docs/vercel-blob/client-upload) တွေကိုလည်း ထောက်ပံ့ပါတယ်။ အချို့ use cases တွေအတွက်တော့ ဒီနည်းလမ်းက ပိုသင့်လျော်နိုင်ပါတယ်။

**2. Next.js ထဲမှာ video ကို ပြသခြင်း**

Video upload လုပ်ပြီး သိမ်းဆည်းပြီးတာနဲ့ — သင့် Next.js application ထဲမှာ ပြသနိုင်ပါပြီ။ `<video>` tag နဲ့ React Suspense ကို သုံးပြီး ဒီလို လုပ်နိုင်တဲ့ ဥပမာတစ်ခုပါ:

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import { list } from '@vercel/blob'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <VideoComponent fileName="my-video.mp4" />
    </Suspense>
  )
}

async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  })
  const { url } = blobs[0]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
```

ဒီချဉ်းကပ်နည်းမှာ — page က video ရဲ့ `@vercel/blob` URL ကို သုံးပြီး `VideoComponent` နဲ့ video ကို ပြသပါတယ်။ Video URL ကို fetch လုပ်ပြီး video ပြသဖို့ အသင့်ဖြစ်တဲ့အထိ — fallback တစ်ခုကို ပြသဖို့ React Suspense ကို သုံးပါတယ်။

### သင့် video မှာ subtitles ထည့်ခြင်း

သင့် video အတွက် subtitles တွေ ရှိရင် — သင့် `<video>` tag ရဲ့ အတွင်းမှာ `<track>` element ကို သုံးပြီး လွယ်ကူစွာ ထည့်နိုင်ပါတယ်။ Subtitle file ကို video file ကို ယူခဲ့တဲ့ နည်းအတိုင်းပဲ — [Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) ကနေ fetch လုပ်နိုင်ပါတယ်။ Subtitles ပါဝင်အောင် `<VideoComponent>` ကို ဒီလို update လုပ်နိုင်ပါတယ်:

```jsx filename="app/page.jsx"
async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 2,
  })
  const { url } = blobs[0]
  const { url: captionsUrl } = blobs[1]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      <track src={captionsUrl} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  )
}
```

ဒီချဉ်းကပ်နည်းအတိုင်း လုပ်ခြင်းဖြင့် — videos တွေကို ထိထိရောက်ရောက် self-host လုပ်ပြီး သင့် Next.js applications တွေထဲကို ပေါင်းစည်းနိုင်ပါတယ်။

## Resources (နောက်ထပ် အရင်းအမြစ်များ)

Video optimization နဲ့ best practices တွေအကြောင်း ဆက်ပြီး လေ့လာဖို့ အောက်ပါ resources တွေကို ကိုးကားပါ:

- **Video formats နဲ့ codecs တွေကို နားလည်ခြင်း (Understanding video formats and codecs):** သင့် video လိုအပ်ချက်တွေအတွက် — လိုက်ဖက်ညီမှု (compatibility) အတွက် MP4 (သို့) web optimization အတွက် WebM လို — မှန်ကန်တဲ့ format နဲ့ codec ကို ရွေးပါ။ အသေးစိတ်အတွက် [Mozilla ရဲ့ video codecs guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs) ကို ကြည့်ပါ။
- **Video compression (video ချုံ့ခြင်း):** Quality နဲ့ file size ကို ချိန်ခွင်လျှာ ညှိပြီး videos တွေကို ထိထိရောက်ရောက် ချုံ့ဖို့ FFmpeg လို tools တွေကို သုံးပါ။ Compression နည်းစနစ်တွေကို [FFmpeg ရဲ့ တရားဝင် website](https://www.ffmpeg.org/) မှာ လေ့လာပါ။
- **Resolution နဲ့ bitrate ချိန်ညှိခြင်း (Resolution and bitrate adjustment):** ကြည့်ရှုတဲ့ platform ပေါ် မူတည်ပြီး [resolution နဲ့ bitrate](https://www.dacast.com/blog/bitrate-vs-resolution/#:~:text=The%20two%20measure%20different%20aspects,yield%20different%20qualities%20of%20video) တွေကို ချိန်ညှိပါ — mobile devices တွေအတွက်တော့ နိမ့်တဲ့ settings တွေ သုံးပါ။
- **Content Delivery Networks (CDNs):** Video ပို့ဆောင်မှု မြန်နှုန်း မြှင့်တင်ဖို့နဲ့ traffic များတာကို စီမံဖို့ CDN တစ်ခုကို အသုံးပြုပါ။ Vercel Blob လို storage solutions တချို့ သုံးတဲ့အခါ — CDN လုပ်ဆောင်ချက်ကို သင့်အတွက် အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။ CDNs တွေနဲ့ သူတို့ရဲ့ အကျိုးကျေးဇူးတွေအကြောင်း [ပိုလေ့လာပါ](https://vercel.com/docs/cdn?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)။

သင့် Next.js projects တွေထဲကို video ပေါင်းစည်းဖို့ အောက်ပါ video streaming platforms တွေကိုလည်း စူးစမ်းကြည့်ပါ:

### Open source `next-video` component

- Next.js အတွက် `<Video>` component တစ်ခုကို ပေးပြီး — [Vercel Blob](https://vercel.com/docs/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website), S3, Backblaze နဲ့ Mux အပါအဝင် hosting services အမျိုးမျိုးနဲ့ လိုက်ဖက်ညီပါတယ်။
- Hosting services အမျိုးမျိုးနဲ့ `next-video.dev` ကို အသုံးပြုခြင်းအတွက် [အသေးစိတ် documentation](https://next-video.dev/docs) ကို ကြည့်ပါ။

### Cloudinary Integration

- Cloudinary ကို Next.js နဲ့ အသုံးပြုခြင်းအတွက် တရားဝင် [documentation နဲ့ integration guide](https://next.cloudinary.dev/) ကို ကြည့်ပါ။
- ချက်ချင်း ထည့်သုံးလို့ရတဲ့ [drop-in video support](https://next.cloudinary.dev/cldvideoplayer/basic-usage) အတွက် `<CldVideoPlayer>` component တစ်ခု ပါဝင်ပါတယ်။
- Cloudinary ကို Next.js နဲ့ ပေါင်းစည်းခြင်းရဲ့ [ဥပမာတွေ](https://github.com/cloudinary-community/cloudinary-examples/?tab=readme-ov-file#nextjs) ကို ရှာဖွေကြည့်ပါ — [Adaptive Bitrate Streaming](https://github.com/cloudinary-community/cloudinary-examples/tree/main/examples/nextjs-cldvideoplayer-abr) အပါအဝင်ပါ။
- Node.js SDK အပါအဝင် တခြား [Cloudinary libraries](https://cloudinary.com/documentation) တွေလည်း ရရှိနိုင်ပါတယ်။

### Mux Video API

- Mux က Mux နဲ့ Next.js သုံးပြီး video course တစ်ခု ဖန်တီးဖို့ [starter template](https://github.com/muxinc/video-course-starter-kit) တစ်ခု ပေးထားပါတယ်။
- သင့် Next.js application အတွက် [high-performance video](https://www.mux.com/for/nextjs) embed လုပ်ခြင်းဆိုင်ရာ Mux ရဲ့ အကြံပြုချက်တွေကို လေ့လာပါ။
- Mux ကို Next.js နဲ့ တွဲသုံးပြထားတဲ့ [ဥပမာ project](https://with-mux-video.vercel.app/) တစ်ခုကို စူးစမ်းကြည့်ပါ။

### Fastly

- Fastly ရဲ့ [video on demand](https://www.fastly.com/products/streaming-media/video-on-demand) နဲ့ streaming media အတွက် ဖြေရှင်းချက်တွေကို Next.js ထဲကို ပေါင်းစည်းခြင်းအကြောင်း ပိုလေ့လာပါ။

### ImageKit.io Integration

- ImageKit ကို Next.js နဲ့ ပေါင်းစည်းခြင်းအတွက် [တရားဝင် quick start guide](https://imagekit.io/docs/integration/nextjs) ကို ကြည့်ပါ။
- ဒီ integration က [seamless video support](https://imagekit.io/docs/integration/nextjs#rendering-videos) (ချောမွေ့တဲ့ video ထောက်ပံ့မှု) ပေးတဲ့ `<IKVideo>` component တစ်ခုကို ပံ့ပိုးပေးပါတယ်။
- Node.js SDK လို တခြား [ImageKit libraries](https://imagekit.io/docs) တွေကိုလည်း စူးစမ်းနိုင်ပါတယ် — အဲဒါတွေလည်း ရရှိနိုင်ပါတယ်။
