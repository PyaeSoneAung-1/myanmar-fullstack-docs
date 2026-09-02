---
title: "prerenderToNodeStream"
description: "React tree တစ်ခုကို Node.js Stream သုံးပြီး static HTML string အဖြစ် render လုပ်ပေးတဲ့ react-dom/static API — Node.js အတွက်သာ၊ bootstrapScripts/identifierPrefix စတဲ့ options များ၊ prelude/postponed returns များ၊ SSG အတွက် data အားလုံး load ပြီးမှ resolve လုပ်ခြင်းနဲ့ prerendering ကို abort လုပ်ခြင်း"
order: 110
source: "https://react.dev/reference/react-dom/static/prerenderToNodeStream"
status: translated
updated: 2026-09-02
---

`prerenderToNodeStream` က [Node.js Stream](https://nodejs.org/api/stream.html) တစ်ခုသုံးပြီး React tree တစ်ခုကို static HTML string အဖြစ် render လုပ်ပေးပါတယ်။

```js
const {prelude, postponed} = await prerenderToNodeStream(reactNode, options?)
```

> **မှတ်ချက်:** ဒီ API က Node.js အတွက် သီးသန့်ပါ။ [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ရှိတဲ့ environments တွေ — Deno နဲ့ modern edge runtimes လိုမျိုး — မှာတော့ [`prerender`](/docs/react/prerender) ကို သုံးသင့်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `prerenderToNodeStream(reactNode, options?)`

သင့် app ကို static HTML အဖြစ် render လုပ်ဖို့ `prerenderToNodeStream` ကို ခေါ်ပါ:

```js
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Client ဘက်မှာ — server က generate လုပ်ထားတဲ့ HTML ကို interactive ဖြစ်စေဖို့ [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်ပါ။

#### Parameters (ပါရာမီတာများ)

- `reactNode`: HTML အဖြစ် render လုပ်ချင်တဲ့ React node တစ်ခု။ ဥပမာ — `<App />` လို JSX node တစ်ခု။ ဒါက document တစ်ခုလုံးကို ကိုယ်စားပြုဖို့ မျှော်လင့်ထားလို့ — `App` component က `<html>` tag ကို render လုပ်ပေးရပါမယ်။
- **optional** `options`: Static generation options တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `bootstrapScriptContent`: သတ်မှတ်ပေးထားရင် — ဒီ string ကို inline `<script>` tag တစ်ခုအတွင်းမှာ ထည့်သွင်းပေးပါလိမ့်မယ်။
  - **optional** `bootstrapScripts`: Page ပေါ်မှာ ထုတ်လွှတ်ဖို့ `<script>` tags တွေရဲ့ string URLs array တစ်ခု။ [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်တဲ့ `<script>` ကို ထည့်သွင်းဖို့ ဒါကို သုံးပါ။ Client ဘက်မှာ React ကို လုံးဝ run ချင်မှာ မဟုတ်ဘူးဆိုရင် — ချန်လိုက်ပါ။
  - **optional** `bootstrapModules`: `bootstrapScripts` နဲ့ ဆင်ပေမယ့် — [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) ကို ထုတ်လွှတ်ပါတယ်။
  - **optional** `identifierPrefix`: [`useId`](/docs/react/use-id) က generate လုပ်တဲ့ IDs တွေအတွက် React သုံးမယ့် string prefix တစ်ခု။ Page တစ်ခုတည်းမှာ roots အများကြီး သုံးတဲ့အခါ conflicts တွေ ရှောင်ရှားဖို့ အသုံးဝင်ပါတယ်။ [`hydrateRoot`](/docs/react/hydrate-root) ဆီ ပေးထားတဲ့ prefix နဲ့ အတူတူပဲ ဖြစ်ရပါမယ်။
  - **optional** `namespaceURI`: Stream ရဲ့ root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) ပါတဲ့ string တစ်ခု။ ပုံမှန်အားဖြင့် သာမန် HTML ဖြစ်ပါတယ်။ SVG အတွက် `'http://www.w3.org/2000/svg'` ဒါမှမဟုတ် MathML အတွက် `'http://www.w3.org/1998/Math/MathML'` ကို ပေးပါ။
  - *(Canary)* **optional** `onBrowserBailout`: React က [`browser()`](https://react.dev/reference/react-dom/browser) ကနေ ပြန်လည် ကောင်းမွန်တဲ့အခါ — browser က အစားထိုးဖို့ Suspense fallback တစ်ခု ချန်ထားလိုက်ခြင်းအားဖြင့် — React က ခေါ်တဲ့ callback တစ်ခု။ ဒါက browser-only render အကြောင်း ဖော်ပြတဲ့ `Error` တစ်ခုနဲ့ — `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။ `browser` ဆီ reason တစ်ခု ပေးခဲ့ရင် — အဲဒါကို `error.cause` အနေနဲ့ ရနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် React က ဘာမှ မလုပ်ပါဘူး။ [Browser-only rendering ကို server ပေါ်မှာ ဘယ်လို report လုပ်မလဲ ကြည့်ပါ။](https://react.dev/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  - **optional** `onError`: Server error တစ်ခု ဖြစ်တိုင်း — [recoverable](https://react.dev/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) ဖြစ်ဖြစ် [မဟုတ်ဘဲ](https://react.dev/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell) ဖြစ်ဖြစ် — fire ဖြစ်တဲ့ callback တစ်ခု။ ပုံမှန်အားဖြင့် ဒါက `console.error` ကိုပဲ ခေါ်ပါတယ်။ [Crash reports တွေ log လုပ်ဖို့](https://react.dev/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server) override လုပ်မယ်ဆိုရင် — `console.error` ကို ဆက်ခေါ်ဖို့ သေချာပါစေ။ Shell မထုတ်လွှတ်ခင်မှာ [status code ကို ချိန်ညှိဖို့](https://react.dev/reference/react-dom/server/renderToPipeableStream#setting-the-status-code) လည်း သုံးနိုင်ပါတယ်။
  - **optional** `progressiveChunkSize`: Chunk တစ်ခုအတွင်းက byte အရေအတွက်။ [Default heuristic အကြောင်း ပိုဖတ်ရန်](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)။
  - **optional** `signal`: [Prerendering ကို abort လုပ်ပြီး](#aborting-prerendering) ကျန်တာကို client ပေါ်မှာ render လုပ်ခွင့်ပေးတဲ့ [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) တစ်ခု။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`prerenderToNodeStream` က Promise တစ်ခုကို ပြန်ပေးပါတယ်:

- Render လုပ်တာ အောင်မြင်ခဲ့ရင် — Promise က အောက်ပါတို့ ပါတဲ့ object တစ်ခုအဖြစ် resolve ဖြစ်ပါလိမ့်မယ်:
  - `prelude`: HTML ရဲ့ [Node.js Stream](https://nodejs.org/api/stream.html) တစ်ခု။ Response တစ်ခုကို chunks တွေနဲ့ ပို့ဖို့ ဒီ stream ကို သုံးနိုင်သလို — stream တစ်ခုလုံးကို string တစ်ခုအဖြစ်လည်း ဖတ်နိုင်ပါတယ်။
  - `postponed`: JSON serialize လုပ်လို့ရတဲ့ opaque object တစ်ခု — `prerenderToNodeStream` က ပြီးမြောက်မသွားခဲ့ရင် [`resumeToPipeableStream`](/docs/react/resume-to-pipeable-stream) ဆီ ဒါကို ပေးပို့နိုင်ပါတယ်။ မဟုတ်ရင်တော့ — `prelude` ထဲမှာ content အားလုံး ပါဝင်ပြီး resume မလိုအပ်ဘူးဆိုတာကို ပြတဲ့ `null` ဖြစ်ပါတယ်။
- Render လုပ်တာ မအောင်မြင်ခဲ့ရင် — Promise က reject ဖြစ်ပါလိမ့်မယ်။ [Fallback shell တစ်ခု output လုပ်ဖို့ ဒါကို သုံးပါ။](https://react.dev/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)

#### Caveats (သတိပြုရမည့်အချက်များ)

Prerender လုပ်တဲ့အခါ `nonce` က ရနိုင်တဲ့ option တစ်ခု မဟုတ်ပါဘူး။ Nonces တွေက request တစ်ခုစီအတွက် ထူးခြားနေရပြီး — [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) နဲ့ သင့် app ကို လုံခြုံအောင် လုပ်ဖို့ nonces တွေ သုံးနေမယ်ဆိုရင် — nonce value ကို prerender ထဲမှာကိုယ်တိုင် ထည့်သွင်းတာက မသင့်လျော်သလို မလုံခြုံပါဘူး။

> **မှတ်ချက် — `prerenderToNodeStream` ကို ဘယ်အချိန်မှာ သုံးသင့်လဲ**
>
> Static `prerenderToNodeStream` API ကို static server-side generation (SSG) အတွက် သုံးပါတယ်။ `renderToString` နဲ့ မတူဘဲ — `prerenderToNodeStream` က resolve မဖြစ်ခင် data အားလုံး load ပြီးတဲ့အထိ စောင့်ပါတယ်။ ဒါကြောင့် — Suspense သုံးပြီး fetch လုပ်ဖို့ လိုတဲ့ data တွေ အပါအဝင် — page တစ်ခုလုံးအတွက် static HTML generate လုပ်ဖို့ သင့်တော်ပါတယ်။ Content တွေ load ဖြစ်လာတာနဲ့အမျှ stream လုပ်ချင်ရင် — [renderToReadableStream](/docs/react/render-to-readable-stream) လို streaming server-side render (SSR) API တစ်ခုကို သုံးပါ။
>
> `prerenderToNodeStream` ကို abort လုပ်နိုင်ပြီး — partial pre-rendering ကို support လုပ်ဖို့ နောက်မှ `resumeToPipeableStream` နဲ့ resume လုပ်နိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### React tree တစ်ခုကို static HTML stream အဖြစ် render လုပ်ခြင်း

သင့် React tree ကို [Node.js Stream](https://nodejs.org/api/stream.html) တစ်ခုထဲကို static HTML အဖြစ် render လုပ်ဖို့ `prerenderToNodeStream` ကို ခေါ်ပါ:

```js
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Root component တစ်ခုအပြင် — bootstrap `<script>` paths တွေရဲ့ list တစ်ခုကိုပါ ပေးဖို့ လိုပါတယ်။ သင့်ရဲ့ root component က **document တစ်ခုလုံးကို root `<html>` tag အပါအဝင် ပြန်ပေးရပါမယ်။**

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

ဒါက server က generate လုပ်ထားတဲ့ static HTML ပေါ်ကို event listeners တွေ တွဲပေးပြီး — interactive ဖြစ်စေပါတယ်။

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

Server ပေါ်မှာ — `<App assetMap={assetMap} />` ကို render လုပ်ပြီး သင့်ရဲ့ `assetMap` ကို asset URLs တွေနဲ့အတူ ပေးလိုက်ပါ:

```js
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: [assetMap['/main.js']]
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

သင့်ရဲ့ server က အခု `<App assetMap={assetMap} />` ကို render လုပ်နေတာမို့ — hydration errors တွေ မဖြစ်အောင် client ပေါ်မှာလည်း `assetMap` နဲ့ပဲ render လုပ်ဖို့ လိုပါတယ်။ `assetMap` ကို serialize လုပ်ပြီး ဒီလိုမျိုး client ဆီ ပို့နိုင်ပါတယ်:

```js
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

အပေါ်က ဥပမာမှာ — `bootstrapScriptContent` option က client ပေါ်မှာ global `window.assetMap` variable ကို သတ်မှတ်ပေးတဲ့ inline `<script>` tag တစ်ခု ထပ်ထည့်ပေးပါတယ်။ ဒါက client code ကို တူညီတဲ့ `assetMap` ကို ဖတ်နိုင်စေပါတယ်:

```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Client ရော server ပါ — `App` ကို တူညီတဲ့ `assetMap` prop နဲ့ render လုပ်တာမို့ — hydration errors တွေ မဖြစ်ပါဘူး။

### React tree တစ်ခုကို static HTML string အဖြစ် render လုပ်ခြင်း

သင့် app ကို static HTML string အဖြစ် render လုပ်ဖို့ `prerenderToNodeStream` ကို ခေါ်ပါ:

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

ဒါက သင့် React components တွေရဲ့ ကနဦး non-interactive HTML output ကို ထုတ်ပေးပါလိမ့်မယ်။ Client ဘက်မှာ — server က generate လုပ်ထားတဲ့ HTML ကို *hydrate* လုပ်ပြီး interactive ဖြစ်စေဖို့ [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်ဖို့ လိုပါလိမ့်မယ်။

### Data တွေ အားလုံး load ပြီးတဲ့အထိ စောင့်ခြင်း

`prerenderToNodeStream` က static HTML generation ကို အပြီးသတ်ပြီး resolve မဖြစ်ခင် — data အားလုံး load ပြီးတဲ့အထိ စောင့်ပါတယ်။ ဥပမာ — cover တစ်ခု၊ friends နဲ့ photos တွေပါတဲ့ sidebar တစ်ခုနဲ့ posts list တစ်ခု ပြတဲ့ profile page တစ်ခု ဆိုပါစို့:

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

`<Posts />` က data တချို့ load လုပ်ဖို့ လိုပြီး — အချိန်တစ်ခု ယူရတယ်ဆိုပါစို့။ အကောင်းဆုံးကတော့ — posts တွေ ပြီးတဲ့အထိ စောင့်ပြီး HTML ထဲမှာ ပါဝင်စေချင်ပါလိမ့်မယ်။ ဒါလုပ်ဖို့ — data ပေါ်မှာ suspend ဖြစ်ဖို့ Suspense ကို သုံးနိုင်ပြီး — `prerenderToNodeStream` က static HTML အဖြစ် resolve မဖြစ်ခင် suspended content တွေ ပြီးတဲ့အထိ စောင့်ပါလိမ့်မယ်။

> **မှတ်ချက်:** [Suspense boundary တစ်ခုကို activate လုပ်ပေးတဲ့](https://react.dev/reference/react/Suspense#what-activates-a-suspense-boundary) source တစ်ခုကနေ ဖတ်တဲ့ data ပဲ — [`use`](/docs/react/use) နဲ့ ဖတ်တဲ့ Promise တစ်ခုလိုမျိုး — rendering အတွင်း suspend ဖြစ်မှာပါ။ Effect ဒါမှမဟုတ် event handler တစ်ခုအတွင်းမှာ fetch လုပ်ထားတဲ့ data ကို Suspense က ထောက်လှမ်းမပေးပါဘူး။

### Prerendering ကို ရပ်ဆိုင်းခြင်း (abort)

Timeout တစ်ခုပြီးနောက်မှာ prerender ကို "လက်လျှော့" စေဖို့ အတင်းလုပ်နိုင်ပါတယ်:

```js
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // the prelude will contain all the HTML that was prerendered
    // before the controller aborted.
    const {prelude} = await prerenderToNodeStream(<App />, {
      signal: controller.signal,
    });
    //...
```

Children တွေ မပြည့်စုံသေးတဲ့ Suspense boundaries တွေ ဘယ်ဟာမဆို — fallback state ထဲမှာ prelude ထဲ ထည့်သွင်းခံရပါလိမ့်မယ်။

ဒါကို [`resumeToPipeableStream`](/docs/react/resume-to-pipeable-stream) (သို့) [`resumeAndPrerenderToNodeStream`](/docs/react/resume-and-prerender-to-node-stream) တွေနဲ့အတူ — partial prerendering အတွက် သုံးနိုင်ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### App တစ်ခုလုံး render ပြီးတဲ့အထိ Stream က မစတင်ဘူး

`prerenderToNodeStream` ရဲ့ response က resolve မဖြစ်ခင် — Suspense boundaries တွေ အားလုံး resolve ဖြစ်တာ အပါအဝင် — app တစ်ခုလုံး render ပြီးတဲ့အထိ စောင့်ပါတယ်။ ဒါက ကြိုတင်ပြီး static site generation (SSG) လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားတာမို့ — content တွေ load ဖြစ်လာတာနဲ့အမျှ နောက်ထပ် content တွေကို stream လုပ်တာကို support မလုပ်ပါဘူး။

Content တွေ load ဖြစ်လာတာနဲ့အမျှ stream လုပ်ချင်ရင် — [renderToPipeableStream](/docs/react/render-to-pipeable-stream) လို streaming server render API တစ်ခုကို သုံးပါ။
