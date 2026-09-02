---
title: "hydrateRoot"
description: "react-dom/server နဲ့ server မှာ render လုပ်ပြီးသား HTML content ပါတဲ့ browser DOM node အတွင်းမှာ React components တွေ ပြသဖို့ React ကို 'attach' (ချိတ်ဆက်) လုပ်ပေးတဲ့ react-dom/client API — root.render/root.unmount၊ onCaughtError စတဲ့ options များနဲ့ hydration mismatch ကိုင်တွယ်ပုံ"
order: 86
source: "https://react.dev/reference/react-dom/client/hydrateRoot"
status: translated
updated: 2026-09-02
---

`hydrateRoot` က — HTML content ကို [react-dom/server](https://react.dev/reference/react-dom/server) နဲ့ အရင်က generate လုပ်ထားတဲ့ browser DOM node တစ်ခုအတွင်းမှာ React components တွေကို ပြသဖို့ ခွင့်ပြုပါတယ်။

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

## ရည်ညွှန်းချက် (Reference)

### `hydrateRoot(domNode, reactNode, options?)`

Server environment မှာ React က render လုပ်ပြီးသား HTML တစ်ခုပေါ်ကို React ကို "attach" (ချိတ်ဆက်) လုပ်ဖို့ `hydrateRoot` ကို ခေါ်ပါ:

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React က `domNode` အတွင်းက ရှိပြီးသား HTML ပေါ်ကို ချိတ်ဆက်ပြီး — သူ့အတွင်းက DOM ကို စီမံခန့်ခွဲမှု တာဝန်ယူပါတယ်။ React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတဲ့ app တစ်ခုမှာ root component အတွက် `hydrateRoot` call တစ်ခုပဲ ရှိတတ်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `domNode`: Server မှာ root element အဖြစ် render လုပ်ထားတဲ့ [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element) တစ်ခု။
- `reactNode`: ရှိပြီးသား HTML ကို render လုပ်ဖို့ သုံးခဲ့တဲ့ "React node" တစ်ခု။ ပုံမှန်အားဖြင့် — `renderToPipeableStream(<App />)` လို ReactDOM Server method တစ်ခုနဲ့ render လုပ်ထားတဲ့ `<App />` လို JSX တစ်ပိုင်း ဖြစ်ပါတယ်။
- **optional** `options`: ဒီ React root အတွက် option တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `onCaughtError`: Error Boundary တစ်ခုက error တစ်ခုကို ဖမ်းမိတဲ့အခါ ခေါ်ခံရတဲ့ callback။ Error Boundary က ဖမ်းမိတဲ့ `error` နဲ့ — `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို argument အဖြစ် လက်ခံပါတယ်။
  - **optional** `onUncaughtError`: Error တစ်ခု throw ဖြစ်ပြီး Error Boundary က မဖမ်းမိတဲ့အခါ ခေါ်ခံရတဲ့ callback။ Throw ဖြစ်ခဲ့တဲ့ `error` နဲ့ `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။
  - **optional** `onRecoverableError`: React က errors တွေကနေ အလိုအလျောက် ပြန်လည် ကောင်းမွန်တဲ့အခါ ခေါ်ခံရတဲ့ callback။ React က throw လုပ်တဲ့ `error` တစ်ခုနဲ့ `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။ Recoverable errors တချို့မှာ မူရင်း error ရဲ့ အကြောင်းရင်းကို `error.cause` အနေနဲ့ ပါဝင်နိုင်ပါတယ်။
  - **optional** `identifierPrefix`: [`useId`](/docs/react/use-id) က generate လုပ်တဲ့ IDs တွေအတွက် React သုံးမယ့် string prefix တစ်ခု။ Page တစ်ခုတည်းမှာ roots အများကြီး သုံးတဲ့အခါ conflicts တွေ ရှောင်ရှားဖို့ အသုံးဝင်ပါတယ်။ **Server ပေါ်မှာ သုံးထားတဲ့ prefix နဲ့ အတူတူပဲ ဖြစ်ရပါမယ်။**

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`hydrateRoot` က method နှစ်ခု ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်: `render` နဲ့ `unmount`။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `hydrateRoot()` က render လုပ်ထားတဲ့ content က server-rendered content နဲ့ တစ်ထပ်တည်း တူညီနေမယ်လို့ မျှော်လင့်ပါတယ်။ Mismatches တွေကို bug တွေအနေနဲ့ သဘောထားပြီး ပြင်ဆင်သင့်ပါတယ်။
- Development mode မှာ React က hydration အတွင်း mismatches တွေကို warning လုပ်ပါတယ်။ Mismatch ဖြစ်ရင် attribute differences တွေကို patch လုပ်ပေးမယ့် အာမခံချက် မရှိပါဘူး။ Performance အရ အရေးကြီးပါတယ် — apps အများစုမှာ mismatches က ရှားလို့ markup အားလုံးကို စစ်ဆေးတာက အကုန်အကျ များလွန်းလို့ပါ။
- သင့် app မှာ `hydrateRoot` call တစ်ခုပဲ ရှိဖို့ များပါတယ်။ Framework တစ်ခု သုံးနေရင် — အဲဒီ framework က ဒီ call ကို သင့်အတွက် လုပ်ပေးနိုင်ပါတယ်။
- သင့် app က HTML ဘာမှ render မလုပ်ထားဘဲ client-rendered ဖြစ်ရင် — `hydrateRoot()` ကို မသုံးနိုင်ပါဘူး။ [`createRoot()`](/docs/react/create-root) ကို သုံးပါ။

### `root.render(reactNode)`

Hydrate လုပ်ထားတဲ့ React root အတွင်းက React component တစ်ခုကို browser DOM element အတွက် update လုပ်ဖို့ `root.render` ကို ခေါ်ပါ:

```js
root.render(<App />);
```

React က hydrate လုပ်ထားတဲ့ `root` အတွင်းမှာ `<App />` ကို update လုပ်ပါတယ်။

#### Parameters (root.render ၏ ပါရာမီတာများ)

- `reactNode`: သင်ပြသချင်တဲ့ *React node* တစ်ခု။ ပုံမှန်အားဖြင့် `<App />` လို JSX တစ်ပိုင်း ဖြစ်ပေမယ့် — [`createElement()`](/docs/react/create-element) နဲ့ တည်ဆောက်ထားတဲ့ React element တစ်ခု၊ string တစ်ခု၊ number တစ်ခု၊ `null` ဒါမှမဟုတ် `undefined` လည်း ပေးနိုင်ပါတယ်။

#### Returns (root.render ၏ ပြန်ပေးသည့်တန်ဖိုး)

`root.render` က `undefined` ကို ပြန်ပေးပါတယ်။

#### Caveats (root.render အတွက် သတိပြုရမည့်အချက်များ)

- Root က hydration မပြီးခင်မှာ `root.render` ကို ခေါ်ရင် — React က ရှိပြီးသား server-rendered HTML content တွေကို ရှင်းပစ်ပြီး root တစ်ခုလုံးကို client rendering ဆီ ပြောင်းလိုက်ပါတယ်။

### `root.unmount()`

React root တစ်ခုအတွင်းမှာ render လုပ်ထားတဲ့ tree တစ်ခုကို ဖျက်ဆီးဖို့ `root.unmount` ကို ခေါ်ပါ:

```js
root.unmount();
```

React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတဲ့ app တစ်ခုမှာ `root.unmount` ခေါ်စရာ မလိုသလောက်ပါ။

ဒါက အဓိကအားဖြင့် — သင့် React root ရဲ့ DOM node (ဒါမှမဟုတ် သူ့ရဲ့ ancestors တစ်ခုခု) ကို တခြား code တစ်ခုခုက DOM ကနေ ဖယ်ရှားနိုင်တဲ့အခါ အသုံးဝင်ပါတယ်။ ဥပမာ — inactive tabs တွေကို DOM ကနေ ဖယ်ရှားတဲ့ jQuery tab panel တစ်ခု ဆိုပါစို့။ Tab တစ်ခု ဖယ်ခံရရင် — သူ့အတွင်းက အကုန်လုံး (React roots တွေ အပါအဝင်) DOM ကနေ ပါဖယ်ခံရပါတယ်။ အဲဒီအခါ — `root.unmount` ခေါ်ပြီး ဖယ်ရှားခံရတဲ့ root ရဲ့ content တွေကို React က စီမံခန့်ခွဲတာ "ရပ်လိုက်" ဖို့ လိုပါတယ်။ မဟုတ်ရင် — ဖယ်ရှားခံရတဲ့ root အတွင်းက components တွေက subscriptions လို resources တွေကို သန့်ရှင်းရေး လုပ်ဖို့ မသိဘဲ နေနေပါလိမ့်မယ်။

#### Parameters (root.unmount ၏ ပါရာမီတာများ)

`root.unmount` က parameter ဘာမှ လက်မခံပါဘူး။

#### Returns (root.unmount ၏ ပြန်ပေးသည့်တန်ဖိုး)

`root.unmount` က `undefined` ကို ပြန်ပေးပါတယ်။

#### Caveats (root.unmount အတွက် သတိပြုရမည့်အချက်များ)

- `root.unmount` ခေါ်တာက — tree ထဲက components တွေ အားလုံးကို unmount လုပ်ပြီး React ကို root DOM node ကနေ "ခွာ" (detach) လိုက်ပါတယ်။
- `root.unmount` ခေါ်ပြီးတာနဲ့ — root တစ်ခုတည်းပေါ်မှာ `root.render` ကို နောက်တစ်ခါ ပြန်ခေါ်လို့ မရတော့ပါဘူး။ Unmount ဖြစ်ပြီးသား root ပေါ်မှာ `root.render` ခေါ်ဖို့ ကြိုးစားရင် "Cannot update an unmounted root" error တစ်ခု throw ဖြစ်ပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### Server-rendered HTML ကို hydrate လုပ်ခြင်း

သင့် app ရဲ့ HTML ကို [react-dom/server](https://react.dev/reference/react-dom/server) နဲ့ generate လုပ်ထားတယ်ဆိုရင် — client ပေါ်မှာ အဲဒီ HTML ကို *hydrate* လုပ်ဖို့ လိုပါတယ်။

```js
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

ဒါက browser DOM node အတွင်းက server HTML ကို — သင့် app ရဲ့ React component နဲ့ hydrate လုပ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် startup မှာ တစ်ကြိမ်ပဲ လုပ်ပါတယ်။ Framework တစ်ခု သုံးနေရင် — အဲဒီ framework က ဒါကို နောက်ကွယ်မှာ သင့်အတွက် လုပ်ပေးနိုင်ပါတယ်။

Hydrate လုပ်ဖို့ — React က server ကနေ လာတဲ့ ကနဦး HTML ပေါ်ကို သင့် components တွေရဲ့ logic တွေကို "attach" လုပ်ပါတယ်။ Hydration ဆိုတာ server ရဲ့ ကနဦး HTML snapshot ကို — browser ထဲမှာ run လို့ရတဲ့ အပြည့်အဝ interactive ဖြစ်တဲ့ app အဖြစ် ပြောင်းပေးတာပါ။ ဥပမာ:

```html
<!--
  <div id="root">...</div> အတွင်းက HTML content ကို
  App ကနေ react-dom/server နဲ့ generate လုပ်ထားတာပါ။
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

`hydrateRoot` ကို နောက်တစ်ကြိမ် ပြန်ခေါ်စရာ ဒါမှမဟုတ် နေရာများစွာမှာ ခေါ်စရာ မလိုပါဘူး။ ဒီအချိန်ကစပြီး — React က သင့် app ရဲ့ DOM ကို စီမံပါလိမ့်မယ်။ UI update လုပ်ဖို့ — သင့် components တွေက [state](/docs/react/use-state) သုံးပါလိမ့်မယ်။

> **သတိပြုရန်:** `hydrateRoot` ဆီ ပေးလိုက်တဲ့ React tree က server ပေါ်မှာ ထုတ်ခဲ့တဲ့ output နဲ့ **တူညီတဲ့ output ကိုပဲ** ထုတ်ပေးရပါမယ်။
>
> ဒါက user experience အတွက် အရေးကြီးပါတယ်။ JavaScript code တွေ မရောက်ရှိခင်မှာ user က server ကနေ ထုတ်ထားတဲ့ HTML ကို အချိန်အတော်ကြာ ကြည့်နေရပါတယ်။ Server rendering က သူ့ရဲ့ output ရဲ့ HTML snapshot ကို ပြသခြင်းဖြင့် — app က ပိုမြန်မြန် load လာသလို ထင်ယောင်ထင်မှား ဖြစ်စေပါတယ်။ ရုတ်တရက် မတူတဲ့ content တွေ ပြသလိုက်တာက အဲဒီ ထင်ယောင်ထင်မှားကို ချိုးဖျက်ပါတယ်။ ဒါကြောင့် server render output က client ပေါ်က ကနဦး render output နဲ့ ကိုက်ညီရပါမယ်။
>
> Hydration errors တွေကို ဖြစ်စေတတ်တဲ့ အဖြစ်များဆုံး အကြောင်းရင်းတွေက:
>
> - Root node အတွင်းက React-generated HTML ပတ်လည်မှာ extra whitespace (newlines လိုမျိုး) တွေ ရှိနေတာ။
> - Rendering logic ထဲမှာ `typeof window !== 'undefined'` လို checks တွေ သုံးတာ။
> - Rendering logic ထဲမှာ [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) လို browser-only APIs တွေ သုံးတာ။
> - Server နဲ့ client ပေါ်မှာ မတူညီတဲ့ data တွေ render လုပ်တာ။
>
> React က hydration errors တချို့ကနေ ပြန်လည် ကောင်းမွန်နိုင်ပေမယ့် — **တခြား bugs တွေလိုပဲ သင့်က ပြင်ဆင်ရပါမယ်။** အကောင်းဆုံး အခြေအနေမှာ နှေးကွေးမှုကိုပဲ ဖြစ်စေပြီး — အဆိုးဆုံးမှာ event handlers တွေက မှားယွင်းတဲ့ elements တွေပေါ်မှာ တွဲသွားနိုင်ပါတယ်။

### Document တစ်ခုလုံးကို hydrate လုပ်ခြင်း

React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတဲ့ apps တွေက — [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) tag အပါအဝင် document တစ်ခုလုံးကို JSX အဖြစ် render လုပ်နိုင်ပါတယ်:

```jsx
function App() {
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

Document တစ်ခုလုံးကို hydrate လုပ်ဖို့ — [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) global ကို `hydrateRoot` ရဲ့ ပထမ argument အဖြစ် ပေးပါ:

```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

### မလွှဲမရှောင်သာ hydration mismatch errors တွေကို ဖိနှိပ်ခြင်း

Element တစ်ခုရဲ့ attribute ဒါမှမဟုတ် text content က server နဲ့ client ကြားမှာ မလွှဲမရှောင်သား ကွဲပြားနေရင် (ဥပမာ — timestamp တစ်ခု) — hydration mismatch warning ကို ဖိနှိပ်နိုင်ပါတယ်။

Element တစ်ခုပေါ်မှာ warning တွေ ဖိနှိပ်ဖို့ `suppressHydrationWarning={true}` ကို ထည့်ပါ:

```html
<!--
  <div id="root">...</div> အတွင်းက HTML content ကို
  App ကနေ react-dom/server နဲ့ generate လုပ်ထားတာပါ။
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```jsx
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

ဒါက level တစ်ခုပဲ နက်ပြီး escape hatch (ရုန်းထွက်နည်း) အနေနဲ့သာ ရည်ရွယ်ပါတယ်။ အလွန်အကျွံ မသုံးပါနဲ့။ React က mismatched text content တွေကို patch လုပ်ဖို့ ကြိုးစားမှာ မဟုတ်ပါဘူး။

### Client နဲ့ server content မတူညီတဲ့အခါ ကိုင်တွယ်ခြင်း

Server နဲ့ client ပေါ်မှာ တမင်တကာ မတူညီတဲ့အရာ render လုပ်ဖို့ လိုအပ်ရင် — two-pass rendering လုပ်နိုင်ပါတယ်။ Client ပေါ်မှာ မတူညီတဲ့အရာ render လုပ်တဲ့ components တွေက — [Effect](/docs/react/use-effect) တစ်ခုအတွင်းမှာ `true` လို့ သတ်မှတ်နိုင်တဲ့ `isClient` လို [state variable](/docs/react/use-state) တစ်ခုကို ဖတ်နိုင်ပါတယ်:

```js
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

ဒီနည်းနဲ့ ကနဦး render pass က server content နဲ့ အတူတူပဲ render လုပ်ပြီး — mismatches တွေကို ရှောင်ပါတယ်။ ဒါပေမယ့် hydration ပြီးပြီးချင်း synchronous ဖြစ်တဲ့ နောက်ထပ် pass တစ်ခု ထပ်ဖြစ်ပါလိမ့်မယ်။

> **မှတ်ချက် (Canary):** Component တစ်ခုက browser ထဲမှာပဲ render လုပ်သင့်တယ်ဆိုရင် — Effect တစ်ခုကို စောင့်နေမယ့်အစား [`use(browser())`](https://react.dev/reference/react/use#use-browser) ကို ခေါ်ပါ။

> **သတိပြုရန်:** ဒီနည်းလမ်းက hydration ကို ပိုနှေးကွေးစေပါတယ် — သင့် components တွေ နှစ်ခါ render လုပ်ရလို့ပါ။ Slow connections တွေပေါ်က user experience ကို သတိထားပါ။ JavaScript code က ကနဦး HTML render ထက် သိသိသာသာ နောက်ကျမှ ရောက်နိုင်လို့ — hydration ပြီးချင်းမှာ မတူတဲ့ UI တစ်ခု ချက်ချင်း ပြောင်းပြတာကလည်း user ကို ထူးဆန်းနောက်ကျိ စေနိုင်ပါတယ်။

### Hydrate လုပ်ပြီးသား root component တစ်ခုကို update လုပ်ခြင်း

Root က hydration ပြီးသွားရင် — root React component ကို update လုပ်ဖို့ `root.render` ကို ခေါ်နိုင်ပါတယ်။ **[`createRoot`](/docs/react/create-root) နဲ့ မတူဘဲ — ဒါကို ပုံမှန်အားဖြင့် လုပ်စရာ မလိုပါဘူး**၊ အကြောင်းကတော့ ကနဦး content က HTML အနေနဲ့ ရပြီးသား ဖြစ်လို့ပါ။

Hydration ပြီးတဲ့ နောက်ပိုင်း တစ်ချိန်ချိန်မှာ `root.render` ခေါ်ပြီး — component tree ရဲ့ တည်ဆောက်ပုံက အရင်က render လုပ်ထားတာနဲ့ ကိုက်ညီနေရင် React က [state ကို ထိန်းသိမ်း](https://react.dev/learn/preserving-and-resetting-state) ပါလိမ့်မယ်။

```html
<!--
  <div id="root">...</div> အတွင်းက HTML content အားလုံးကို
  <App /> ကို react-dom/server နဲ့ render လုပ်ပြီး ထုတ်ထားတာပါ။
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

Hydrate လုပ်ထားတဲ့ root တစ်ခုပေါ်မှာ `root.render` ခေါ်တာက အဖြစ်နည်းပါတယ်။ ပုံမှန်အားဖြင့် — components တစ်ခုခုရဲ့ အတွင်းမှာ [state ကို update](/docs/react/use-state) လုပ်ပါလိမ့်မယ်။

### Production မှာ error logging (error မှတ်တမ်းတင်ခြင်း)

ပုံမှန်အားဖြင့် React က errors တွေ အားလုံးကို console ထဲမှာ log လုပ်ပါတယ်။ ကိုယ်ပိုင် error reporting စနစ် တည်ဆောက်ချင်ရင် — optional error handler root options တွေဖြစ်တဲ့ `onUncaughtError`, `onCaughtError` နဲ့ `onRecoverableError` တွေကို ပေးနိုင်ပါတယ်:

```js
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

`onCaughtError` option က argument နှစ်ခုနဲ့ ခေါ်ခံရတဲ့ function တစ်ခုပါ:

1. Throw ဖြစ်ခဲ့တဲ့ `error`။
2. Error ရဲ့ `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခု။

`onUncaughtError` နဲ့ `onRecoverableError` တို့နဲ့ အတူ — ကိုယ်ပိုင် error reporting စနစ် အပြည့်အစုံ အကောင်အထည်ဖော်နိုင်ပါတယ်။ Development မှာ React ရဲ့ default handlers တွေကို အသုံးချနိုင်ဖို့ ဒါမှမဟုတ် ကိုယ်ပိုင် overlay တစ်ခု ရေးနိုင်ဖို့ — ဒီ options တွေကို development မှာ ဖယ်ထားဖို့ သတိပြုပါ။

## Troubleshooting (ပြဿနာရှာဖွေခြင်း)

### "You passed a second argument to root.render" error ရနေပါတယ်

အဖြစ်များတဲ့ အမှားတစ်ခုက — `hydrateRoot` အတွက် options တွေကို `root.render(...)` ဆီ မှားပို့မိတာပါ:

```js
// 🚩 မှား: root.render က argument တစ်ခုပဲ လက်ခံပါတယ်။
root.render(App, {onUncaughtError});

// ✅ မှန်: options တွေကို hydrateRoot ဆီ ပေးပါ။
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
