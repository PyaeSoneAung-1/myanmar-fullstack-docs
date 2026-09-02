---
title: "resumeToPipeableStream"
description: "Pre-render (ကြိုတင် render) လုပ်ထားပြီးသား React tree တစ်ခုကို pipe လုပ်လို့ရတဲ့ Node.js Stream အဖြစ် ဆက်လက် render လုပ်ပေးတဲ့ react-dom/server API — pipe/abort methods၊ onShellReady/onShellError စတဲ့ options များနဲ့ caveats (Node.js အတွက်သာ)"
order: 93
source: "https://react.dev/reference/react-dom/server/resumeToPipeableStream"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** ဒီ feature က React ရဲ့ နောက်ဆုံး Canary version တွေမှာပဲ ရနိုင်ပါသေးတယ်။

`resumeToPipeableStream` က ကြိုတင် render (pre-render) လုပ်ထားပြီးသား React tree တစ်ခုကို pipe လုပ်လို့ရတဲ့ [Node.js Stream](https://nodejs.org/api/stream.html) အဖြစ် stream လုပ်ပါတယ်။

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

> **မှတ်ချက်:** ဒီ API က Node.js အတွက် သီးသန့်ပါ။ [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ရှိတဲ့ environments တွေ — Deno နဲ့ modern edge runtimes လိုမျိုး — မှာတော့ [`resume`](/docs/react/resume) ကို သုံးသင့်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `resumeToPipeableStream(node, postponed, options?)`

ကြိုတင် render လုပ်ထားတဲ့ React tree တစ်ခုကို HTML အဖြစ် [Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) တစ်ခုထဲ ဆက်လက် render လုပ်ဖို့ `resumeToPipeableStream` ကို ခေါ်ပါ:

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

#### Parameters (ပါရာမီတာများ)

- `reactNode`: သင်က `prerender` နဲ့ ခေါ်ခဲ့တဲ့ React node။ ဥပမာ — `<App />` လို JSX element တစ်ခု။ Document တစ်ခုလုံးကို ကိုယ်စားပြုဖို့ မျှော်လင့်ထားလို့ — `App` component က `<html>` tag ကို render လုပ်ပေးသင့်ပါတယ်။
- `postponedState`: [prerender API](https://react.dev/reference/react-dom/static/index) ကနေ ပြန်လာတဲ့ opaque `postpone` object — သင်သိမ်းထားတဲ့ နေရာ (ဥပမာ redis၊ file တစ်ခု (သို့) S3) ကနေ ပြန်ဖတ်ယူပြီး ပေးရပါတယ်။
- **optional** `options`: Streaming option တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) အတွက် scripts တွေကို ခွင့်ပြုဖို့ [nonce](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string တစ်ခု။
  - **optional** `signal`: Server rendering ကို [abort လုပ်ပြီး](#aborting-server-rendering) ကျန်တာကို client ပေါ်မှာ render လုပ်ခွင့်ပေးတဲ့ [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) တစ်ခု။
  - **(Canary)** *optional* `onBrowserBailout`: React က [`browser()`](https://react.dev/reference/react-dom/browser) ကနေ ပြန်လည် ကောင်းမွန်တဲ့အခါ — browser က အစားထိုးဖို့ Suspense fallback တစ်ခုကို ချန်ထားရင်း React က ခေါ်တဲ့ callback တစ်ခု။ Browser မှာပဲ render လုပ်တာကို ဖော်ပြတဲ့ `Error` တစ်ခုနဲ့ `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။ `browser` ဆီ reason တစ်ခု ပေးခဲ့ရင် — အဲဒါကို `error.cause` အနေနဲ့ ရနိုင်ပါတယ်။ Default အားဖြင့် React က ဘာမှ မလုပ်ပါဘူး။ [Browser-only rendering ကို report လုပ်ပုံ ကြည့်ရန်](https://react.dev/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)။
  - **optional** `onError`: Server error တစ်ခုခု ဖြစ်တိုင်း — [recoverable](https://react.dev/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ဖြစ်ဖြစ် [မဟုတ်ဘဲ](https://react.dev/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) ဖြစ်ဖြစ် — ခေါ်ခံရတဲ့ callback တစ်ခု။ Default အားဖြင့် `console.error` ကိုပဲ ခေါ်ပါတယ်။ [crash reports တွေကို log လုပ်ဖို့](https://react.dev/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) override လုပ်ရင် — `console.error` ကို ဆက်ခေါ်ဖို့ သေချာပါစေ။
  - **optional** `onShellReady`: [Shell](#specifying-what-goes-into-the-shell) ပြီးစီးပြီးချင်း ခေါ်ခံရတဲ့ callback တစ်ခု။ Streaming စဖို့ ဒီနေရာမှာ `pipe` ကို ခေါ်နိုင်ပါတယ်။ React က — HTML loading fallbacks တွေကို content တွေနဲ့ အစားထိုးတဲ့ inline `<script>` tags တွေနဲ့အတူ — shell နောက်က [နောက်ထပ် content တွေကို](#streaming-more-content-as-it-loads) stream လုပ်ပါလိမ့်မယ်။
  - **optional** `onShellError`: Shell ကို render လုပ်ရာမှာ error တစ်ခု ဖြစ်ခဲ့ရင် ခေါ်ခံရတဲ့ callback တစ်ခု။ Error ကို argument အဖြစ် လက်ခံပါတယ်။ Stream ကနေ bytes ဘာမှ မထွက်ရသေးဘဲ — `onShellReady` ရော `onAllReady` ပါ ခေါ်ခံရမှာ မဟုတ်လို့ — [fallback HTML shell တစ်ခု output လုပ်နိုင်ပါတယ်](#recovering-from-errors-inside-the-shell) (သို့) prelude ကို သုံးနိုင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`resumeToPipeableStream` က method နှစ်ခု ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်:

- `pipe`: ပေးထားတဲ့ [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) တစ်ခုထဲ HTML ကို output လုပ်ပါတယ်။ Streaming ဖွင့်ချင်ရင် `onShellReady` ထဲမှာ `pipe` ကို ခေါ်ပါ — crawlers တွေနဲ့ static generation အတွက်ကျတော့ `onAllReady` ထဲမှာ ခေါ်ပါ။
- `abort`: Server rendering ကို [abort လုပ်ပြီး](#aborting-server-rendering) ကျန်တာကို client ပေါ်မှာ render လုပ်ခွင့်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `resumeToPipeableStream` က `bootstrapScripts`၊ `bootstrapScriptContent` (သို့) `bootstrapModules` အတွက် options တွေကို လက်မခံပါဘူး။ အဲဒီအစား — ဒီ options တွေကို `postponedState` ကို generate လုပ်တဲ့ `prerender` ခေါ်မှုဆီ ပေးရပါတယ်။ Bootstrap content တွေကို writable stream ထဲကို ကိုယ်တိုင်လည်း ထည့်သွင်းနိုင်ပါတယ်။
- `resumeToPipeableStream` က `identifierPrefix` ကို လက်မခံပါဘူး — prefix က `prerender` ရော `resumeToPipeableStream` မှာပါ အတူတူပဲ ဖြစ်ရလို့ပါ။
- `nonce` ကို prerender ဆီ ပေးလို့မရတာမို့ — prerender ဆီ scripts တွေ မပေးဘူးဆိုမှသာ `nonce` ကို `resumeToPipeableStream` ဆီ ပေးသင့်ပါတယ်။
- `resumeToPipeableStream` က root ကနေ — အပြည့်အဝ pre-render မလုပ်ရသေးတဲ့ component တစ်ခုကို ရှာတွေ့တဲ့အထိ ပြန်ပြီး render လုပ်ပါတယ်။ အပြည့်အဝ pre-render လုပ်ပြီးသား components တွေ (component ရော သူ့ရဲ့ children တွေပါ prerendering ပြီးစီးသွားတာ) ကိုပဲ လုံးဝ ကျော်လိုက်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### ဆက်လက်ဖတ်ရှုရန် (Further reading)

Resuming က `renderToReadableStream` နဲ့ အလားတူ ပြုမူပါတယ်။ ဥပမာတွေ ထပ်ကြည့်ချင်ရင် — [`renderToReadableStream` ရဲ့ usage section](https://react.dev/reference/react-dom/server/renderToReadableStream#usage) ကို ကြည့်ပါ။
[`prerender` ရဲ့ usage section](https://react.dev/reference/react-dom/static/prerender#usage) မှာတော့ — `prerenderToNodeStream` ကို သီးသန့် ဘယ်လို သုံးရမလဲ ဆိုတဲ့ ဥပမာတွေ ပါဝင်ပါတယ်။
