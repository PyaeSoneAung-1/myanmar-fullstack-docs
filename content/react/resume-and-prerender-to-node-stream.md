---
title: "resumeAndPrerenderToNodeStream"
description: "Pre-render (ကြိုတင် render) လုပ်ထားပြီးသား React tree တစ်ခုကို Node.js Stream သုံးပြီး static HTML string အဖြစ် ဆက်လက် render လုပ်ပေးတဲ့ react-dom/static API — Node.js အတွက်သာ၊ postponedState နဲ့ ဆက်လုပ်ခြင်း၊ signal/onBrowserBailout/onError options များနဲ့ caveats"
order: 112
source: "https://react.dev/reference/react-dom/static/resumeAndPrerenderToNodeStream"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** ဒီ feature က React ရဲ့ နောက်ဆုံး Canary version တွေမှာပဲ ရနိုင်ပါသေးတယ်။

`resumeAndPrerenderToNodeStream` က prerender လုပ်ထားပြီးသား React tree တစ်ခုကို [Node.js Stream](https://nodejs.org/api/stream.html) သုံးပြီး static HTML string အဖြစ် ဆက်လက် render လုပ်ပေးပါတယ်။

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

> **မှတ်ချက်:** ဒီ API က Node.js အတွက် သီးသန့်ပါ။ [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ရှိတဲ့ environments တွေ — Deno နဲ့ modern edge runtimes လိုမျိုး — မှာတော့ [`resumeAndPrerender`](/docs/react/resume-and-prerender) ကို သုံးသင့်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)`

prerender လုပ်ထားပြီးသား React tree တစ်ခုကို static HTML string အဖြစ် ဆက်လက် render လုပ်ဖို့ `resumeAndPrerenderToNodeStream` ကို ခေါ်ပါ:

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

Client ဘက်မှာ — server က generate လုပ်ထားတဲ့ HTML ကို interactive ဖြစ်စေဖို့ [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်ပါ။

#### Parameters (ပါရာမီတာများ)

- `reactNode`: သင်က `prerender` (သို့) အရင် `resumeAndPrerenderToNodeStream` တစ်ခုခုနဲ့ ခေါ်ခဲ့တဲ့ React node။ ဥပမာ — `<App />` လို JSX element တစ်ခု။ Document တစ်ခုလုံးကို ကိုယ်စားပြုဖို့ မျှော်လင့်ထားလို့ — `App` component က `<html>` tag ကို render လုပ်ပေးရပါမယ်။
- `postponedState`: [prerender API](/docs/react/react-dom-static) ကနေ ပြန်လာတဲ့ opaque `postpone` object — သင်သိမ်းထားတဲ့ နေရာ (ဥပမာ redis၊ file တစ်ခု (သို့) S3) ကနေ ပြန်ဖတ်ယူပြီး ပေးရပါတယ်။
- **optional** `options`: Streaming option တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `signal`: Server rendering ကို abort လုပ်ပြီး ကျန်တာကို client ပေါ်မှာ render လုပ်ခွင့်ပေးတဲ့ [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) တစ်ခု။
  - *(Canary)* **optional** `onBrowserBailout`: React က [`browser()`](https://react.dev/reference/react-dom/browser) ကနေ ပြန်လည် ကောင်းမွန်တဲ့အခါ — browser က အစားထိုးဖို့ Suspense fallback တစ်ခု ချန်ထားလိုက်ခြင်းအားဖြင့် — React က ခေါ်တဲ့ callback တစ်ခု။ ဒါက browser-only render အကြောင်း ဖော်ပြတဲ့ `Error` တစ်ခုနဲ့ — `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။ `browser` ဆီ reason တစ်ခု ပေးခဲ့ရင် — အဲဒါကို `error.cause` အနေနဲ့ ရနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် React က ဘာမှ မလုပ်ပါဘူး။ [Browser-only rendering ကို server ပေါ်မှာ ဘယ်လို report လုပ်မလဲ ကြည့်ပါ။](https://react.dev/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  - **optional** `onError`: Server error တစ်ခု ဖြစ်တိုင်း — [recoverable](https://react.dev/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ဖြစ်ဖြစ် [မဟုတ်ဘဲ](https://react.dev/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) ဖြစ်ဖြစ် — fire ဖြစ်တဲ့ callback တစ်ခု။ ပုံမှန်အားဖြင့် ဒါက `console.error` ကိုပဲ ခေါ်ပါတယ်။ [Crash reports တွေ log လုပ်ဖို့](https://react.dev/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) override လုပ်မယ်ဆိုရင် — `console.error` ကို ဆက်ခေါ်ဖို့ သေချာပါစေ။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`resumeAndPrerenderToNodeStream` က Promise တစ်ခုကို ပြန်ပေးပါတယ်:

- Render လုပ်တာ အောင်မြင်ခဲ့ရင် — Promise က အောက်ပါတို့ ပါတဲ့ object တစ်ခုအဖြစ် resolve ဖြစ်ပါလိမ့်မယ်:
  - `prelude`: HTML ရဲ့ [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) တစ်ခု။ Response တစ်ခုကို chunks တွေနဲ့ ပို့ဖို့ ဒီ stream ကို သုံးနိုင်သလို — stream တစ်ခုလုံးကို string တစ်ခုအဖြစ်လည်း ဖတ်နိုင်ပါတယ်။
  - `postponed`: JSON serialize လုပ်လို့ရတဲ့ opaque object တစ်ခု — `resumeAndPrerenderToNodeStream` ကို abort လုပ်ခဲ့မယ်ဆိုရင် [`resumeToPipeableStream`](/docs/react/resume-to-pipeable-stream) (သို့) [`resumeAndPrerenderToNodeStream`](/docs/react/resume-and-prerender-to-node-stream) ဆီ ဒါကို ထပ်ဆင့် ပေးပို့နိုင်ပါတယ်။
- Render လုပ်တာ မအောင်မြင်ခဲ့ရင် — Promise က reject ဖြစ်ပါလိမ့်မယ်။ [Fallback shell တစ်ခု output လုပ်ဖို့ ဒါကို သုံးပါ။](https://react.dev/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Caveats (သတိပြုရမည့်အချက်များ)

Prerender လုပ်တဲ့အခါ `nonce` က ရနိုင်တဲ့ option တစ်ခု မဟုတ်ပါဘူး။ Nonces တွေက request တစ်ခုစီအတွက် ထူးခြားနေရပြီး — [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) နဲ့ သင့် app ကို လုံခြုံအောင် လုပ်ဖို့ nonces တွေ သုံးနေမယ်ဆိုရင် — nonce value ကို prerender ထဲမှာကိုယ်တိုင် ထည့်သွင်းတာက မသင့်လျော်သလို မလုံခြုံပါဘူး။

> **မှတ်ချက် — `resumeAndPrerenderToNodeStream` ကို ဘယ်အချိန်မှာ သုံးသင့်လဲ**
>
> Static `resumeAndPrerenderToNodeStream` API ကို static server-side generation (SSG) အတွက် သုံးပါတယ်။ `renderToString` နဲ့ မတူဘဲ — `resumeAndPrerenderToNodeStream` က resolve မဖြစ်ခင် data အားလုံး load ပြီးတဲ့အထိ စောင့်ပါတယ်။ ဒါကြောင့် — Suspense သုံးပြီး fetch လုပ်ဖို့ လိုတဲ့ data တွေ အပါအဝင် — page တစ်ခုလုံးအတွက် static HTML generate လုပ်ဖို့ သင့်တော်ပါတယ်။ Content တွေ load ဖြစ်လာတာနဲ့အမျှ stream လုပ်ချင်ရင် — [renderToReadableStream](/docs/react/render-to-readable-stream) လို streaming server-side render (SSR) API တစ်ခုကို သုံးပါ။
>
> `resumeAndPrerenderToNodeStream` ကို abort လုပ်နိုင်ပြီး — နောက်မှ နောက်ထပ် `resumeAndPrerenderToNodeStream` တစ်ခုနဲ့ ဆက်လုပ်နိုင်သလို — partial pre-rendering ကို support လုပ်ဖို့ `resumeToPipeableStream` နဲ့လည်း resume လုပ်နိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### ဆက်လက်ဖတ်ရှုရန် (Further reading)

`resumeAndPrerenderToNodeStream` က [`prerender`](/docs/react/prerender) နဲ့ အလားတူ ပြုမူပေမယ့် — အရင်က စတင်ခဲ့ပြီး abort လုပ်ခဲ့တဲ့ prerendering လုပ်ငန်းစဉ်တစ်ခုကို ဆက်လုပ်ဖို့ သုံးနိုင်ပါတယ်။
Prerender လုပ်ထားတဲ့ tree တစ်ခုကို resume လုပ်ခြင်းအကြောင်း ပိုသိချင်ရင် — [resume documentation](/docs/react/resume) ကို ကြည့်ပါ။
