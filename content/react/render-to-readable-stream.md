---
title: "renderToReadableStream"
description: "React tree တစ်ခုကို Readable Web Stream အဖြစ် HTML render လုပ်ပေးတဲ့ react-dom/server API — Deno/edge runtimes အတွက် renderToPipeableStream ရဲ့ Web Streams version၊ bootstrapScripts/identifierPrefix/signal စတဲ့ options များ၊ stream.allReady နဲ့ Suspense streaming၊ error ကိုင်တွယ်ပုံနဲ့ abort လုပ်ခြင်း"
order: 95
source: "https://react.dev/reference/react-dom/server/renderToReadableStream"
status: translated
updated: 2026-09-02
---

`renderToReadableStream` က React tree တစ်ခုကို [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) တစ်ခုအဖြစ် render လုပ်ပေးပါတယ်။

```js
const stream = await renderToReadableStream(reactNode, options?)
```

> **မှတ်ချက်:** ဒီ API က [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ပေါ်မှာ မူတည်ပါတယ်။ Node.js အတွက်ကတော့ — [renderToPipeableStream](/docs/react/render-to-pipeable-stream) ကို သုံးပါ။

## ရည်ညွှန်းချက် (Reference)

### `renderToReadableStream(reactNode, options?)`

သင့် React tree ကို HTML အဖြစ် [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) တစ်ခုထဲကို render လုပ်ဖို့ `renderToReadableStream` ကို ခေါ်ပါ:

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Client ဘက်မှာ — server က generate လုပ်ထားတဲ့ HTML ကို interactive ဖြစ်စေဖို့ [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်ပါ။

#### Parameters (ပါရာမီတာများ)

- `reactNode`: HTML အဖြစ် render လုပ်ချင်တဲ့ React node တစ်ခု။ ဥပမာ — `<App />` လို JSX element တစ်ခု။ ဒါက document တစ်ခုလုံးကို ကိုယ်စားပြုဖို့ မျှော်လင့်ထားလို့ — `App` component က `<html>` tag ကို render လုပ်ပေးရပါမယ်။
- **optional** `options`: Streaming options တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `bootstrapScriptContent`: သတ်မှတ်ပေးထားရင် — ဒီ string ကို inline `<script>` tag တစ်ခုအတွင်းမှာ ထည့်သွင်းပေးပါလိမ့်မယ်။
  - **optional** `bootstrapScripts`: Page ပေါ်မှာ ထုတ်လွှတ်ဖို့ `<script>` tags တွေရဲ့ string URLs array တစ်ခု။ [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်တဲ့ `<script>` ကို ထည့်သွင်းဖို့ ဒါကို သုံးပါ။ Client ဘက်မှာ React ကို လုံးဝ run ချင်မှာ မဟုတ်ဘူးဆိုရင် — ချန်လိုက်ပါ။
  - **optional** `bootstrapModules`: `bootstrapScripts` နဲ့ ဆင်ပေမယ့် — [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) ကို ထုတ်လွှတ်ပါတယ်။
  - **optional** `identifierPrefix`: [`useId`](/docs/react/use-id) က generate လုပ်တဲ့ IDs တွေအတွက် React သုံးမယ့် string prefix တစ်ခု။ Page တစ်ခုတည်းမှာ roots အများကြီး သုံးတဲ့အခါ conflicts တွေ ရှောင်ရှားဖို့ အသုံးဝင်ပါတယ်။ [`hydrateRoot`](/docs/react/hydrate-root) ဆီ ပေးထားတဲ့ prefix နဲ့ အတူတူပဲ ဖြစ်ရပါမယ်။
  - **optional** `namespaceURI`: Stream ရဲ့ root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) ပါတဲ့ string တစ်ခု။ ပုံမှန်အားဖြင့် သာမန် HTML ဖြစ်ပါတယ်။ SVG အတွက် `'http://www.w3.org/2000/svg'` ဒါမှမဟုတ် MathML အတွက် `'http://www.w3.org/1998/Math/MathML'` ကို ပေးပါ။
  - **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) အောက်မှာ scripts တွေကို ခွင့်ပြုပေးဖို့ [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string တစ်ခု။
  - *(Canary)* **optional** `onBrowserBailout`: React က [`browser()`](https://react.dev/reference/react-dom/browser) ကနေ ပြန်လည် ကောင်းမွန်တဲ့အခါ — browser က အစားထိုးဖို့ Suspense fallback တစ်ခု ချန်ထားလိုက်ခြင်းအားဖြင့် — React က ခေါ်တဲ့ callback တစ်ခု။ ဒါက browser-only render အကြောင်း ဖော်ပြတဲ့ `Error` တစ်ခုနဲ့ — `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။ `browser` ဆီ reason တစ်ခု ပေးခဲ့ရင် — အဲဒါကို `error.cause` အနေနဲ့ ရနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် React က ဘာမှ မလုပ်ပါဘူး။ [Browser-only rendering ကို server ပေါ်မှာ ဘယ်လို report လုပ်မလဲ ကြည့်ပါ။](https://react.dev/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  - **optional** `onError`: Server error တစ်ခု ဖြစ်တိုင်း — shell အပြင်ဘက်က errors တွေလိုမျိုး ပြန်လည် ကောင်းမွန်နိုင်တဲ့ (recoverable) error ဖြစ်ဖြစ် — shell အတွင်းက errors တွေလိုမျိုး မကောင်းမွန်နိုင်တဲ့ error ဖြစ်ဖြစ် — fire ဖြစ်တဲ့ callback တစ်ခု။ ပုံမှန်အားဖြင့် ဒါက `console.error` ကိုပဲ ခေါ်ပါတယ်။ Crash reports တွေ log လုပ်ဖို့ override လုပ်မယ်ဆိုရင် — `console.error` ကို ဆက်ခေါ်ဖို့ သေချာပါစေ။ Shell မထုတ်လွှတ်ခင်မှာ status code ကို ချိန်ညှိဖို့လည်း သုံးနိုင်ပါတယ်။
  - **optional** `progressiveChunkSize`: Chunk တစ်ခုအတွင်းက byte အရေအတွက်။ [Default heuristic အကြောင်း ပိုဖတ်ရန်](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)။
  - **optional** `signal`: Server rendering ကို ရပ်လိုက်ပြီး ကျန်တာကို client ပေါ်မှာ render လုပ်စေနိုင်တဲ့ [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) တစ်ခု။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`renderToReadableStream` က Promise တစ်ခုကို ပြန်ပေးပါတယ်:

- Shell ကို render လုပ်တာ အောင်မြင်ခဲ့ရင် — အဲဒီ Promise က [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) တစ်ခုဆီ resolve ဖြစ်ပါတယ်။
- Shell ကို render လုပ်တာ မအောင်မြင်ခဲ့ရင် — Promise က rejected ဖြစ်ပါတယ်။ Fallback shell တစ်ခု ထုတ်ပေးဖို့ ဒါကို သုံးပါ။

ပြန်လာတဲ့ stream မှာ နောက်ထပ် property တစ်ခု ပါပါတယ်:

- `allReady`: Rendering အားလုံး — shell ရော နောက်ထပ် content တွေပါ — ပြီးစီးတဲ့အခါ resolve ဖြစ်တဲ့ Promise တစ်ခု။ Crawlers နဲ့ static generation အတွက် response တစ်ခု မပြန်ခင် `stream.allReady` ကို `await` လုပ်နိုင်ပါတယ်။ အဲဒီလို လုပ်လိုက်ရင် — progressive loading ရမှာ မဟုတ်တော့ပါဘူး။ Stream ထဲမှာ နောက်ဆုံး HTML ပဲ ပါပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### React tree တစ်ခုကို Readable Web Stream ထဲကို HTML အဖြစ် render လုပ်ခြင်း

သင့် React tree ကို HTML အဖြစ် [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) တစ်ခုထဲကို render လုပ်ဖို့ `renderToReadableStream` ကို ခေါ်ပါ:

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Root component တစ်ခုအပြင် — bootstrap `<script>` paths တွေရဲ့ list တစ်ခုကိုပါ ပေးဖို့ လိုပါတယ်။ သင့် root component က **document တစ်ခုလုံးကို root `<html>` tag အပါအဝင် ပြန်ပေးရပါမယ်။**

ဥပမာ — ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```js
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React က [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) နဲ့ သင့်ရဲ့ bootstrap `<script>` tags တွေကို ရလာတဲ့ HTML stream ထဲကို ထည့်သွင်းပေးပါလိမ့်မယ်:

```html
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

Client ဘက်မှာ — သင့်ရဲ့ bootstrap script က [`hydrateRoot` ခေါ်ခြင်းအားဖြင့် document တစ်ခုလုံးကို hydrate လုပ်ပေးရပါမယ်](/docs/react/hydrate-root):

```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

ဒါက server က generate လုပ်ထားတဲ့ HTML ပေါ်ကို event listeners တွေ တွဲပေးပြီး — interactive ဖြစ်စေပါတယ်။

#### Build output ကနေ CSS နဲ့ JS asset paths တွေကို ဖတ်ခြင်း

နောက်ဆုံး asset URLs တွေ (JavaScript နဲ့ CSS files တွေလိုမျိုး) က build ပြီးနောက်မှာ hashed လုပ်ခံရလေ့ ရှိပါတယ်။ ဥပမာ — `styles.css` အစား `styles.123456.css` ဆိုတာမျိုး ဖြစ်သွားနိုင်ပါတယ်။ Static asset filenames တွေကို hashing လုပ်ခြင်းက — asset တစ်ခုရဲ့ build တစ်ခုစီတိုင်းမှာ filename မတူညီကြောင်း အာမခံပါတယ်။ ဒါက အသုံးဝင်ပါတယ် — ဘာဖြစ်လို့လဲဆိုတော့ static assets တွေအတွက် long-term caching ကို လုံခြုံစွာ ဖွင့်နိုင်လို့ပါ: နာမည်တစ်ခုရှိတဲ့ file က content ဘယ်တော့မှ ပြောင်းမှာ မဟုတ်ပါဘူး။

ဒါပေမယ့် — asset URLs တွေကို build ပြီးမှပဲ သိနိုင်တယ်ဆိုရင် — အဲဒါတွေကို source code ထဲမှာ ထည့်ထားဖို့ နည်းလမ်း မရှိပါဘူး။ ဥပမာ — အရင်ကလိုမျိုး `"/styles.css"` ကို JSX ထဲမှာ hardcode လုပ်ထားတာက အလုပ်မဖြစ်ပါဘူး။ ဒါတွေကို source code ထဲက ဖယ်ထားဖို့ — သင့်ရဲ့ root component က prop တစ်ခုအနေနဲ့ ပေးလိုက်တဲ့ map တစ်ခုကနေ တကယ့် filenames တွေကို ဖတ်နိုင်ပါတယ်:

```js
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Server ပေါ်မှာ — `<App assetMap={assetMap} />` လို့ render လုပ်ပြီး သင့်ရဲ့ `assetMap` ကို asset URLs တွေနဲ့အတူ ပေးလိုက်ပါ:

```js
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

သင့်ရဲ့ server က အခု `<App assetMap={assetMap} />` ကို render လုပ်နေတာမို့ — hydration errors တွေ မဖြစ်အောင် client ပေါ်မှာလည်း `assetMap` နဲ့ပဲ render လုပ်ဖို့ လိုပါတယ်။ `assetMap` ကို serialize လုပ်ပြီး ဒီလိုမျိုး client ဆီ ပို့နိုင်ပါတယ်:

```js
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

အပေါ်က ဥပမာမှာ — `bootstrapScriptContent` option က client ပေါ်မှာ global `window.assetMap` variable ကို သတ်မှတ်ပေးတဲ့ inline `<script>` tag တစ်ခု ထပ်ထည့်ပေးပါတယ်။ ဒါက client code ကို တူညီတဲ့ `assetMap` ကို ဖတ်နိုင်စေပါတယ်:

```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Client ရော server ပါ — `App` ကို တူညီတဲ့ `assetMap` prop နဲ့ render လုပ်တာမို့ — hydration errors တွေ မဖြစ်ပါဘူး။

### Content တွေ load ဖြစ်လာတာနဲ့အမျှ ထပ်ဆင့် stream လုပ်ခြင်း

Streaming က — server ပေါ်မှာ data အကုန် load မပြီးသေးခင် content တွေကို user စပြီး မြင်နိုင်စေပါတယ်။ ဥပမာ — cover တစ်ခု၊ friends နဲ့ photos တွေပါတဲ့ sidebar တစ်ခုနဲ့ posts list တစ်ခု ပြတဲ့ profile page တစ်ခု ဆိုပါစို့:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />` အတွက် data တွေ load လုပ်ရတာ အချိန်ယူရတယ်ဆိုပါစို့။ အကောင်းဆုံးကတော့ — posts တွေကို မစောင့်ဘဲ profile page ရဲ့ ကျန်တဲ့ content တွေကို user ကို ပြချင်ပါတယ်။ ဒါလုပ်ဖို့ — [`Posts` ကို `<Suspense>` boundary တစ်ခုအတွင်းမှာ ထုပ်ပါ](/docs/react/suspense):

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

ဒါက `Posts` က သူ့ရဲ့ data တွေ မရသေးခင် — HTML ကို React က စပြီး stream လုပ်ဖို့ ပြောလိုက်တာပါ။ React က loading fallback (`PostsGlimmer`) အတွက် HTML ကို အရင်ပို့ပြီး — `Posts` က data တွေ load ပြီးတာနဲ့ — အဲဒီ fallback ကို HTML နဲ့ အစားထိုးတဲ့ inline `<script>` tag တစ်ခုနဲ့အတူ ကျန်တဲ့ HTML ကို ပို့ပေးပါတယ်။ User ရဲ့ ရှုထောင့်ကကြည့်ရင် — page က အရင်ဆုံး `PostsGlimmer` နဲ့ ပေါ်လာပြီး — နောက်မှ `Posts` နဲ့ အစားထိုးခံရပါတယ်။

ပိုပြီး granular ဖြစ်တဲ့ loading sequence တစ်ခု ဖန်တီးဖို့ — [`<Suspense>` boundaries တွေကို ထပ်ဆင့် nest လုပ်နိုင်ပါတယ်](/docs/react/suspense):

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

ဒီဥပမာမှာ — React က page ကို ပိုစောပြီး stream လုပ်နိုင်ပါတယ်။ `<Suspense>` boundary တစ်ခုခုနဲ့မှ မထုပ်ထားလို့ — `ProfileLayout` နဲ့ `ProfileCover` ပဲ အရင်ဆုံး render ပြီးစီးဖို့ လိုပါတယ်။ ဒါပေမယ့် `Sidebar`, `Friends` ဒါမှမဟုတ် `Photos` က data တချို့ load လုပ်ဖို့ လိုအပ်ရင် — React က `BigSpinner` fallback အတွက် HTML ကို အဲဒီအစား ပို့ပါလိမ့်မယ်။ ပြီးတော့ — data တွေ ပိုရနိုင်လာတာနဲ့အမျှ — အားလုံး မြင်ရတဲ့အထိ content တွေ ဆက်ပြီး ပေါ်လာပါလိမ့်မယ်။

Streaming က React ကိုယ်တိုင် browser ထဲမှာ load ဖြစ်ဖို့ ဒါမှမဟုတ် သင့် app က interactive ဖြစ်ဖို့ မစောင့်ပါဘူး။ Server ကနေ လာတဲ့ HTML content တွေက `<script>` tags တွေ မတင်ခင်ကတည်းက — တဖြည်းဖြည်း ပေါ်လာပါလိမ့်မယ်။

[Streaming HTML အလုပ်လုပ်ပုံ အကြောင်း ပိုဖတ်ရန်](https://github.com/reactwg/react-18/discussions/37)

> **မှတ်ချက်:** [Suspense boundary တစ်ခုကို activate လုပ်ပေးတဲ့](https://react.dev/reference/react/Suspense#what-activates-a-suspense-boundary) source တစ်ခုကနေ ဖတ်တဲ့ data ပဲ — [`use`](/docs/react/use) နဲ့ ဖတ်တဲ့ Promise တစ်ခုလိုမျိုး — rendering အတွင်း suspend ဖြစ်မှာပါ။ Effect ဒါမှမဟုတ် event handler တစ်ခုအတွင်းမှာ fetch လုပ်ထားတဲ့ data ကို Suspense က ထောက်လှမ်းမပေးပါဘူး။

### Shell ထဲမှာ ဘာတွေ ပါမလဲ သတ်မှတ်ခြင်း

သင့် app ရဲ့ `<Suspense>` boundaries တစ်ခုခုရဲ့ အပြင်ဘက်က အပိုင်းကို *shell* လို့ ခေါ်ပါတယ်:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

ဒါက user မြင်ရနိုင်တဲ့ အစောဆုံး loading state ကို သတ်မှတ်ပေးပါတယ်:

```js
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

App တစ်ခုလုံးကို root မှာ `<Suspense>` boundary တစ်ခုနဲ့ ထုပ်လိုက်ရင် — shell ထဲမှာ အဲဒီ spinner ပဲ ပါပါလိမ့်မယ်။ ဒါပေမယ့် — ဒါက ကောင်းမွန်တဲ့ user experience မဟုတ်ပါဘူး — screen ပေါ်မှာ spinner ကြီးတစ်ခု မြင်ရတာက — နည်းနည်း ပိုစောင့်ပြီး တကယ့် layout ကို မြင်ရတာထက် ပိုနှေးတယ်လို့ ခံစားရစေနိုင်လို့ပါ။ ဒါကြောင့် — ပုံမှန်အားဖြင့် `<Suspense>` boundaries တွေကို — shell က page layout တစ်ခုလုံးရဲ့ *အရိုးစု* လို — "အနည်းဆုံးပေမယ့် ပြည့်စုံ" (minimal but complete) လို့ ခံစားရစေမယ့်နေရာမှာ ထားချင်ပါလိမ့်မယ်။

`renderToReadableStream` ဆီက async call က shell တစ်ခုလုံး render လုပ်ပြီးတာနဲ့ — `stream` တစ်ခုဆီ resolve ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် အဲဒီအချိန်မှာ — အဲဒီ `stream` နဲ့ response တစ်ခု ဖန်တီးပြီး ပြန်ပေးခြင်းအားဖြင့် streaming စလုပ်ပါလိမ့်မယ်:

```js
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

`stream` ကို ပြန်ပေးလိုက်ချိန်မှာ — nested `<Suspense>` boundaries တွေထဲက components တွေက data တွေ ဆက် loading လုပ်နေတာ ဖြစ်နိုင်ပါသေးတယ်။

### Server ပေါ်မှာ crashes တွေကို log လုပ်ခြင်း

ပုံမှန်အားဖြင့် — server ပေါ်က errors တွေ အားလုံးကို console ထဲမှာ log လုပ်ပါတယ်။ Crash reports တွေ log လုပ်ဖို့ ဒီအပြုအမူကို override လုပ်နိုင်ပါတယ်:

```js
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

ကိုယ်ပိုင် `onError` implementation တစ်ခု ပေးမယ်ဆိုရင် — အပေါ်ကလိုပဲ console ထဲကိုလည်း errors တွေ log လုပ်ဖို့ မမေ့ပါနဲ့။

### Shell အတွင်းက errors တွေကနေ ပြန်လည် ကောင်းမွန်ခြင်း

ဒီဥပမာမှာ — shell ထဲမှာ `ProfileLayout`, `ProfileCover` နဲ့ `PostsGlimmer` တွေ ပါဝင်ပါတယ်:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

ဒီ components တွေကို render လုပ်ရာမှာ error တစ်ခု ဖြစ်ခဲ့ရင် — React မှာ client ဆီ ပို့ဖို့ အဓိပ္ပါယ်ရှိတဲ့ HTML ဘာမှ ရှိမှာ မဟုတ်ပါဘူး။ နောက်ဆုံး နည်းလမ်းအနေနဲ့ — server rendering ကို အားမကိုးတဲ့ fallback HTML တစ်ခု ပို့ဖို့ သင့်ရဲ့ `renderToReadableStream` call ကို `try...catch` တစ်ခုအတွင်းမှာ ထုပ်ပါ:

```js
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Shell ကို generate လုပ်နေစဉ်မှာ error တစ်ခု ရှိခဲ့ရင် — `onError` ရော သင့်ရဲ့ `catch` block ပါ နှစ်ခုလုံး fire ဖြစ်ပါတယ်။ Error reporting အတွက် `onError` ကို သုံးပြီး — fallback HTML document ပို့ဖို့ `catch` block ကို သုံးပါ။ သင့်ရဲ့ fallback HTML က error page တစ်ခု ဖြစ်စရာ မလိုပါဘူး။ အဲဒီအစား — သင့် app ကို client ပေါ်မှာပဲ render လုပ်ပေးမယ့် alternative shell တစ်ခု ထည့်နိုင်ပါတယ်။

### Shell အပြင်ဘက်က errors တွေကနေ ပြန်လည် ကောင်းမွန်ခြင်း

ဒီဥပမာမှာ — `<Posts />` component က `<Suspense>` အတွင်းမှာ ထုပ်ထားလို့ — shell ရဲ့ အစိတ်အပိုင်း *မဟုတ်ပါဘူး*:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` component ထဲမှာ ဒါမှမဟုတ် သူ့အတွင်းထဲ တစ်နေရာရာမှာ error တစ်ခု ဖြစ်ခဲ့ရင် — React က [အဲဒီကနေ ပြန်လည် ကောင်းမွန်ဖို့ ကြိုးစားပါလိမ့်မယ်](https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content):

1. အနီးဆုံး `<Suspense>` boundary (`PostsGlimmer`) ရဲ့ loading fallback ကို HTML ထဲမှာ ထုတ်ပေးပါလိမ့်မယ်။
2. Server ပေါ်မှာ `Posts` content တွေကို ဆက်ပြီး render လုပ်ဖို့ "လက်လျှော့" လိုက်ပါလိမ့်မယ်။
3. JavaScript code တွေ client ပေါ်မှာ load ဖြစ်တာနဲ့ — React က `Posts` ကို client ပေါ်မှာ *ပြန်ကြိုးစား* render လုပ်ပါလိမ့်မယ်။

Client ပေါ်မှာ `Posts` ကို ပြန် render လုပ်တာ *လည်း* မအောင်မြင်ခဲ့ရင် — React က error ကို client ပေါ်မှာ throw လုပ်ပါလိမ့်မယ်။ Rendering အတွင်း throw ဖြစ်တဲ့ errors အားလုံးလိုပဲ — [အနီးဆုံး parent error boundary](https://react.dev/reference/react/Component#static-getderivedstatefromerror) က error ကို user ဆီ ဘယ်လို ပြမလဲ ဆုံးဖြတ်ပါတယ်။ လက်တွေ့မှာ ဆိုလိုတာက — error က ပြန်လည် ကောင်းမွန်လို့ မရနိုင်တာ သေချာမသိခင် အထိ — user က loading indicator တစ်ခုကိုပဲ မြင်နေရပါလိမ့်မယ်။

Client ပေါ်မှာ `Posts` ကို ပြန် render လုပ်တာ အောင်မြင်ခဲ့ရင် — server ကနေ လာတဲ့ loading fallback ကို client rendering output နဲ့ အစားထိုးလိုက်ပါလိမ့်မယ်။ Server error တစ်ခု ရှိခဲ့တာကို user က သိမှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — server ရဲ့ `onError` callback နဲ့ client ရဲ့ [`onRecoverableError`](/docs/react/hydrate-root) callbacks တွေ fire ဖြစ်လို့ — error အကြောင်း အသိပေးခံရမှာ ဖြစ်ပါတယ်။

### Status code သတ်မှတ်ခြင်း

Streaming က tradeoff တစ်ခု မိတ်ဆက်ပေးပါတယ်။ Page ကို ဖြစ်နိုင်သမျှ စောစော stream စချင်ပါတယ် — user က content တွေကို မြန်မြန် မြင်နိုင်ဖို့ပါ။ ဒါပေမယ့် — streaming စပြီးတာနဲ့ — response status code ကို နောက်ထပ် သတ်မှတ်လို့ မရတော့ပါဘူး။

သင့် app ကို shell (ပုံမှန်အားဖြင့် `<Suspense>` boundaries တွေရဲ့ အပေါ်မှာ) နဲ့ ကျန်တဲ့ content တွေဆိုပြီး ပိုင်းခြားထားခြင်းအားဖြင့် — ပြဿနာရဲ့ အစိတ်အပိုင်းတစ်ခုကို ဖြေရှင်းပြီးသား ဖြစ်ပါတယ်။ Shell မှာ error ဖြစ်ရင် — error status code သတ်မှတ်ခွင့်ပေးတဲ့ သင့်ရဲ့ `catch` block က run ပါလိမ့်မယ်။ မဟုတ်ရင် — app က client ပေါ်မှာ ပြန်လည် ကောင်းမွန်နိုင်တယ်လို့ သိရလို့ — "OK" ပို့နိုင်ပါတယ်။

```js
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Shell ရဲ့ *အပြင်ဘက်* က component တစ်ခု (ဆိုလိုတာက `<Suspense>` boundary တစ်ခုအတွင်းက) error တစ်ခု throw လုပ်ခဲ့ရင် — React က render လုပ်တာ ရပ်မှာ မဟုတ်ပါဘူး။ ဆိုလိုတာက — `onError` callback က fire ဖြစ်မယ် ဆိုပေမယ့် — `catch` block ထဲကို မဝင်ဘဲ သင့်ရဲ့ code က ဆက်ပြီး run နေပါလိမ့်မယ်။ ဘာဖြစ်လို့လဲဆိုတော့ — အပေါ်မှာ ဖော်ပြခဲ့တဲ့အတိုင်း React က အဲဒီ error ကနေ client ပေါ်မှာ ပြန်လည် ကောင်းမွန်ဖို့ ကြိုးစားမှာမို့ပါ။

ဒါပေမယ့် — လိုချင်ရင် တစ်ခုခု error ဖြစ်ခဲ့တယ်ဆိုတဲ့ အချက်ကို status code သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်:

```js
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

ဒါက ကနဦး shell content ကို generate လုပ်နေစဉ် ဖြစ်ခဲ့တဲ့ — shell အပြင်ဘက်က errors တွေကိုပဲ ဖမ်းမိမှာမို့ — အကုန်အစုံ မဟုတ်ပါဘူး။ Content တစ်ခုခုအတွက် error တစ်ခု ဖြစ်ခဲ့မလားဆိုတာ သိဖို့ အရေးကြီးတယ်ဆိုရင် — အဲဒီ content ကို shell ထဲကို ရွှေ့တင်နိုင်ပါတယ်။

### Errors အမျိုးမျိုးကို နည်းအမျိုးမျိုးနဲ့ ကိုင်တွယ်ခြင်း

[ကိုယ်ပိုင် `Error` subclasses တွေ ဖန်တီးပြီး](https://javascript.info/custom-errors) — ဘယ် error ကို throw လုပ်ထားလဲ စစ်ဖို့ [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator ကို သုံးနိုင်ပါတယ်။ ဥပမာ — custom `NotFoundError` တစ်ခု define လုပ်ပြီး သင့် component ကနေ throw လုပ်နိုင်ပါတယ်။ ဒါဆိုရင် error ကို `onError` ထဲမှာ သိမ်းထားပြီး — error type ပေါ် မူတည်ပြီး response မပြန်ခင် မတူတာတွေ လုပ်နိုင်ပါတယ်:

```js
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

သတိထားရမှာက — shell ကို ထုတ်လွှတ်ပြီး streaming စပြီးတာနဲ့ — status code ကို ပြောင်းလို့ မရတော့ပါဘူး။

### Crawlers နဲ့ static generation အတွက် content အားလုံး load ပြီးတဲ့အထိ စောင့်ခြင်း

Streaming က ပိုကောင်းတဲ့ user experience တစ်ခု ပေးပါတယ် — ဘာဖြစ်လို့လဲဆိုတော့ user က content တွေ ရနိုင်တာနဲ့အမျှ မြင်နိုင်လို့ပါ။

ဒါပေမယ့် — crawler တစ်ခုက သင့် page ကို လာလည်တဲ့အခါ ဒါမှမဟုတ် build ချိန်မှာ pages တွေ generate လုပ်နေတယ်ဆိုရင် — content တွေ အားလုံး အရင်ဆုံး load လုပ်ပြီးမှ — တဖြည်းဖြည်း ပြတာမဟုတ်ဘဲ — နောက်ဆုံး HTML output ကို ထုတ်ချင်ပါလိမ့်မယ်။

`stream.allReady` Promise ကို await လုပ်ပြီး content တွေ အားလုံး load ဖြစ်တာကို စောင့်နိုင်ပါတယ်:

```js
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... depends on your bot detection strategy ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

ပုံမှန် visitor တစ်ယောက်ကတော့ — တဖြည်းဖြည်း load ဖြစ်လာတဲ့ content တွေရဲ့ stream တစ်ခုကို ရပါလိမ့်မယ်။ Crawler တစ်ခုကတော့ — data တွေ အားလုံး load ပြီးမှ နောက်ဆုံး HTML output ကို ရပါလိမ့်မယ်။ ဒါပေမယ့် — ဒါက crawler က data *အားလုံး* အတွက် စောင့်ရမယ်လို့လည်း ဆိုလိုပါတယ် — အဲဒီထဲက တချို့က ဖြည်းဖြည်း load ဖြစ်တာ ဒါမှမဟုတ် error ဖြစ်နိုင်ပါတယ်။ သင့် app ပေါ် မူတည်ပြီး — crawlers တွေဆီကိုလည်း shell ကို ပို့ဖို့ ရွေးချယ်နိုင်ပါတယ်။

### Server rendering ကို ရပ်ဆိုင်းခြင်း (abort)

Timeout တစ်ခုပြီးနောက်မှာ server rendering ကို "လက်လျှော့" စေဖို့ အတင်းလုပ်နိုင်ပါတယ်:

```js
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React က ကျန်နေတဲ့ loading fallbacks တွေကို HTML အဖြစ် flush လုပ်ပြီး — ကျန်တာကို client ပေါ်မှာ render လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။
