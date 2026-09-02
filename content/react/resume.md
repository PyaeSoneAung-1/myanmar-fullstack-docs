---
title: "resume"
description: "Pre-render (ကြိုတင် render) လုပ်ထားပြီးသား React tree တစ်ခုကို Readable Web Stream အဖြစ် ဆက်လက် render လုပ်ပေးတဲ့ react-dom/server API — prerender ကရတဲ့ postponedState နဲ့ resume လုပ်ခြင်း၊ allReady ၊ onBrowserBailout/onError options များနဲ့ caveats"
order: 92
source: "https://react.dev/reference/react-dom/server/resume"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** ဒီ feature က React ရဲ့ နောက်ဆုံး Canary version တွေမှာပဲ ရနိုင်ပါသေးတယ်။

`resume` က ကြိုတင် render (pre-render) လုပ်ထားပြီးသား React tree တစ်ခုကို [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) အဖြစ် stream လုပ်ပါတယ်။

```js
const stream = await resume(reactNode, postponedState, options?)
```

> **မှတ်ချက်:** ဒီ API က [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ပေါ်မှာ မူတည်ပါတယ်။ Node.js အတွက်ဆိုရင် — [`resumeToPipeableStream`](/docs/react/resume-to-pipeable-stream) ကို သုံးပါ။

## ရည်ညွှန်းချက် (Reference)

### `resume(node, postponedState, options?)`

ကြိုတင် render လုပ်ထားတဲ့ React tree တစ်ခုကို HTML အဖြစ် [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) တစ်ခုထဲ ဆက်လက် render လုပ်ဖို့ `resume` ကို ခေါ်ပါ:

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
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

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`resume` က Promise တစ်ခုကို ပြန်ပေးပါတယ်:

- `resume` က [shell](https://react.dev/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell) တစ်ခုကို အောင်မြင်စွာ ထုတ်လုပ်နိုင်ခဲ့ရင် — အဲဒီ Promise က [Writable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) တစ်ခုဆီ pipe လုပ်လို့ရတဲ့ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) တစ်ခုအဖြစ် resolve ဖြစ်ပါလိမ့်မယ်။
- Shell ထဲမှာ error တစ်ခု ဖြစ်ခဲ့ရင် — Promise က အဲဒီ error နဲ့ reject ဖြစ်ပါလိမ့်မယ်။

ပြန်လာတဲ့ stream မှာ နောက်ထပ် property တစ်ခု ပါပါတယ်:

- `allReady`: Rendering အားလုံး ပြီးစီးတဲ့အခါ resolve ဖြစ်တဲ့ Promise တစ်ခု။ Response ပြန်မပို့ခင် `stream.allReady` ကို [crawlers တွေနဲ့ static generation အတွက်](https://react.dev/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) `await` လုပ်နိုင်ပါတယ်။ အဲဒီလို လုပ်ရင် — progressive loading မရတော့ပါဘူး။ Stream ထဲမှာ နောက်ဆုံး HTML ပဲ ပါမှာ ဖြစ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `resume` က `bootstrapScripts`၊ `bootstrapScriptContent` (သို့) `bootstrapModules` အတွက် options တွေကို လက်မခံပါဘူး။ အဲဒီအစား — ဒီ options တွေကို `postponedState` ကို generate လုပ်တဲ့ `prerender` ခေါ်မှုဆီ ပေးရပါတယ်။ Bootstrap content တွေကို writable stream ထဲကို ကိုယ်တိုင်လည်း ထည့်သွင်းနိုင်ပါတယ်။
- `resume` က `identifierPrefix` ကို လက်မခံပါဘူး — prefix က `prerender` ရော `resume` မှာပါ အတူတူပဲ ဖြစ်ရလို့ပါ။
- `nonce` ကို prerender ဆီ ပေးလို့မရတာမို့ — prerender ဆီ scripts တွေ မပေးဘူးဆိုမှသာ `nonce` ကို `resume` ဆီ ပေးသင့်ပါတယ်။
- `resume` က root ကနေ — အပြည့်အဝ pre-render မလုပ်ရသေးတဲ့ component တစ်ခုကို ရှာတွေ့တဲ့အထိ ပြန်ပြီး render လုပ်ပါတယ်။ အပြည့်အဝ pre-render လုပ်ပြီးသား components တွေ (component ရော သူ့ရဲ့ children တွေပါ prerendering ပြီးစီးသွားတာ) ကိုပဲ လုံးဝ ကျော်လိုက်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Prerender ရလဒ်ကို resume လုပ်ခြင်း

အောက်က example က — prerender လုပ်ပြီး postpone လုပ်ထားတဲ့ app တစ်ခုကို resume လုပ်တဲ့ အဆင့်တွေကို layer လိုက် ပြထားပါတယ်။ ပထမဆုံး — demo ရဲ့ `public/index.html` က content တွေ စီးဝင်မယ့် frame တစ်ခုကို သတ်မှတ်ပါတယ်:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

`src/index.js` ကတော့ — prerender ကနေ prelude နဲ့ postponed state ရယူခြင်း၊ cookies တွေ ရောက်ရှိချိန်မှာ render ကို `resume` နဲ့ ဆက်လုပ်ခြင်း၊ နောက်ဆုံးမှာ hydrate လုပ်ခြင်း စတဲ့ အဆင့်တွေ အားလုံးကို ပြပါတယ်:

```js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

`src/demo-helpers.js` မှာတော့ — stream တွေကို frame ထဲ ရေးသွင်းဖို့၊ prerender အတွင်း ရည်ရွယ်ချက်ရှိရှိ abort လုပ်တာကို ခွဲခြားဖို့ စတဲ့ demo helper တွေ ပါပါတယ်:

```js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    const partialHTML = decoder.decode(value, {stream: true});
    document.write(partialHTML);
  }

  document.write(decoder.decode());
}

// This doesn't need to be an error.
// You can use any other means to check if an error during prerender was
// from an intentional abort or a real error.
export class Postponed extends Error {}

// We're just hardcoding a session here.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

### ဆက်လက်ဖတ်ရှုရန် (Further reading)

Resuming က `renderToReadableStream` နဲ့ အလားတူ ပြုမူပါတယ်။ ဥပမာတွေ ထပ်ကြည့်ချင်ရင် — [`renderToReadableStream` ရဲ့ usage section](https://react.dev/reference/react-dom/server/renderToReadableStream#usage) ကို ကြည့်ပါ။
[`prerender` ရဲ့ usage section](https://react.dev/reference/react-dom/static/prerender#usage) မှာတော့ — `prerender` ကို သီးသန့် ဘယ်လို သုံးရမလဲ ဆိုတဲ့ ဥပမာတွေ ပါဝင်ပါတယ်။
