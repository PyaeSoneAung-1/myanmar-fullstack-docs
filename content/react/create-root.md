---
title: "createRoot"
description: "Browser DOM node တစ်ခုအတွင်းမှာ React components တွေကို ပြသဖို့ root ဖန်တီးပေးတဲ့ react-dom/client API — root.render/root.unmount၊ onCaughtError/onUncaughtError/onRecoverableError/identifierPrefix options များနဲ့ server-rendered app များအတွက် hydrateRoot သုံးရန် သတိပေးချက်များ"
order: 85
source: "https://react.dev/reference/react-dom/client/createRoot"
status: translated
updated: 2026-09-02
---

`createRoot` က — browser DOM node တစ်ခုအတွင်းမှာ React components တွေကို ပြသဖို့ root တစ်ခု ဖန်တီးနိုင်စေပါတယ်။

```js
const root = createRoot(domNode, options?)
```

## ရည်ညွှန်းချက် (Reference)

### `createRoot(domNode, options?)`

Browser DOM element တစ်ခုအတွင်းမှာ content တွေ ပြသဖို့ React root တစ်ခု ဖန်တီးရန် `createRoot` ကို ခေါ်ပါ:

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React က `domNode` အတွက် root တစ်ခု ဖန်တီးပြီး — သူ့အတွင်းက DOM ကို စီမံခန့်ခွဲမှု တာဝန်ယူပါတယ်။ Root ဖန်တီးပြီးတာနဲ့ — အတွင်းမှာ React component တစ်ခု ပြသဖို့ `root.render` ကို ခေါ်ရပါတယ်:

```js
root.render(<App />);
```

React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတဲ့ app တစ်ခုမှာ — root component အတွက် `createRoot` call တစ်ခုပဲ ရှိတတ်ပါတယ်။ Page ရဲ့ အစိတ်အပိုင်းတချို့မှာပဲ React ကို "ဖြန်း" သုံးတဲ့ page တစ်ခုမှာတော့ — လိုသလောက် root အများကြီး သီးခြားစီ ရှိနိုင်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `domNode`: [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element) တစ်ခု။ React က ဒီ DOM element အတွက် root ဖန်တီးပြီး — `render` လို functions တွေကို root ပေါ်မှာ ခေါ်နိုင်အောင် ခွင့်ပြုပါတယ်။
- **optional** `options`: ဒီ React root အတွက် option တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `onCaughtError`: Error Boundary တစ်ခုက error တစ်ခုကို ဖမ်းမိတဲ့အခါ ခေါ်ခံရတဲ့ callback။ Error Boundary က ဖမ်းမိတဲ့ `error` နဲ့ — `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို argument အဖြစ် လက်ခံပါတယ်။
  - **optional** `onUncaughtError`: Error တစ်ခု throw ဖြစ်ပြီး Error Boundary က မဖမ်းမိတဲ့အခါ ခေါ်ခံရတဲ့ callback။ Throw ဖြစ်ခဲ့တဲ့ `error` နဲ့ `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။
  - **optional** `onRecoverableError`: React က errors တွေကနေ အလိုအလျောက် ပြန်လည် ကောင်းမွန်တဲ့အခါ ခေါ်ခံရတဲ့ callback။ React က throw လုပ်တဲ့ `error` တစ်ခုနဲ့ `componentStack` ပါဝင်တဲ့ `errorInfo` object တစ်ခုကို လက်ခံပါတယ်။ Recoverable errors တချို့မှာ မူရင်း error ရဲ့ အကြောင်းရင်းကို `error.cause` အနေနဲ့ ပါဝင်နိုင်ပါတယ်။
  - **optional** `identifierPrefix`: [`useId`](/docs/react/use-id) က generate လုပ်တဲ့ IDs တွေအတွက် React သုံးမယ့် string prefix တစ်ခု။ Page တစ်ခုတည်းမှာ roots အများကြီး သုံးတဲ့အခါ conflicts တွေ ရှောင်ရှားဖို့ အသုံးဝင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`createRoot` က method နှစ်ခု ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်: `render` နဲ့ `unmount`။

#### Caveats (သတိပြုရမည့်အချက်များ)

- သင့် app က server-rendered ဆိုရင် — `createRoot()` ကို သုံးလို့ မရပါဘူး။ [`hydrateRoot()`](https://react.dev/reference/react-dom/client/hydrateRoot) ကို သုံးပါ။
- သင့် app မှာ `createRoot` call တစ်ခုပဲ ရှိဖို့ များပါတယ်။ Framework တစ်ခု သုံးနေရင် — အဲဒီ framework က ဒီ call ကို သင့်အတွက် လုပ်ပေးနိုင်ပါတယ်။
- Component ရဲ့ child မဟုတ်တဲ့ DOM tree ထဲက တခြားနေရာတစ်ခုမှာ JSX တစ်ပိုင်းကို render လုပ်ချင်ရင် (ဥပမာ modal ဒါမှမဟုတ် tooltip) — `createRoot` အစား [`createPortal`](/docs/react/create-portal) ကို သုံးပါ။

### `root.render(reactNode)`

[JSX](https://react.dev/learn/writing-markup-with-jsx) တစ်ပိုင်း ("React node") ကို React root ရဲ့ browser DOM node ထဲမှာ ပြသဖို့ `root.render` ကို ခေါ်ပါ:

```js
root.render(<App />);
```

React က `root` ထဲမှာ `<App />` ကို ပြသပြီး — သူ့အတွင်းက DOM ကို စီမံခန့်ခွဲမှု တာဝန်ယူပါတယ်။

#### Parameters (root.render ၏ ပါရာမီတာများ)

- `reactNode`: သင်ပြသချင်တဲ့ *React node* တစ်ခု။ ပုံမှန်အားဖြင့် `<App />` လို JSX တစ်ပိုင်း ဖြစ်ပေမယ့် — [`createElement()`](/docs/react/create-element) နဲ့ တည်ဆောက်ထားတဲ့ React element တစ်ခု၊ string တစ်ခု၊ number တစ်ခု၊ `null` ဒါမှမဟုတ် `undefined` လည်း ပေးနိုင်ပါတယ်။

#### Returns (root.render ၏ ပြန်ပေးသည့်တန်ဖိုး)

`root.render` က `undefined` ကို ပြန်ပေးပါတယ်။

#### Caveats (root.render အတွက် သတိပြုရမည့်အချက်များ)

- `root.render` ကို ပထမဆုံး အကြိမ် ခေါ်တဲ့အခါ — React component ကို render မလုပ်ခင် React root အတွင်းက ရှိပြီးသား HTML content တွေ အားလုံးကို React က ရှင်းပစ်ပါတယ်။
- Root ရဲ့ DOM node ထဲမှာ server ဒါမှမဟုတ် build ချိန်မှာ React က ထုတ်ပေးထားတဲ့ HTML ပါနေရင် — event handlers တွေကို ရှိပြီးသား HTML ပေါ် တွဲပေးတဲ့ [`hydrateRoot()`](https://react.dev/reference/react-dom/client/hydrateRoot) ကို သုံးပါ။
- Root တစ်ခုတည်းပေါ်မှာ `render` ကို တစ်ကြိမ်ထက်ပိုပြီး ခေါ်ရင် — နောက်ဆုံး ပေးလိုက်တဲ့ JSX ကို ထင်ဟပ်ဖို့ React က DOM ကို လိုအပ်သလို update လုပ်ပါတယ်။ အရင် render လုပ်ထားတဲ့ tree နဲ့ ["matching up"](https://react.dev/learn/preserving-and-resetting-state) လုပ်ပြီး — DOM ရဲ့ ဘယ်အပိုင်းတွေကို ပြန်သုံးလို့ရလဲ၊ ဘယ်ဟာတွေကို ပြန်ဖန်တီးရမလဲ ဆုံးဖြတ်ပါတယ်။ Root component ပေါ်မှာ [set function](/docs/react/use-state) ခေါ်တာနဲ့ ဆင်တူပြီး — React က မလိုအပ်တဲ့ DOM updates တွေကို ရှောင်ပါတယ်။
- Rendering က စတင်လိုက်တာနဲ့ synchronous ဖြစ်ပေမယ့် — `root.render(...)` ကိုယ်တိုင်ကတော့ synchronous မဟုတ်ပါဘူး။ ဆိုလိုတာက `root.render()` နောက်က code က — အဲဒီ render ရဲ့ effects တွေ (`useLayoutEffect`, `useEffect`) မဖြစ်သေးခင် run နိုင်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် ပြဿနာ မရှိသလို ပြင်ဆင်စရာ ခဲလှပါတယ်။ Effects ရဲ့ အချိန်ကိုက်မှု အရေးကြီးတဲ့ ရှားပါးတဲ့ case တွေမှာ — ကနဦး render ကို အပြည့်အဝ synchronously run ဖြစ်စေဖို့ `root.render(...)` ကို [`flushSync`](/docs/react/flush-sync) ထဲမှာ ထုပ်နိုင်ပါတယ်:

```js
const root = createRoot(document.getElementById('root'));
root.render(<App />);
// 🚩 ဒီအချိန်မှာ HTML ထဲမှာ render ထားတဲ့ <App /> မပါသေးပါဘူး:
console.log(document.body.innerHTML);
```

### `root.unmount()`

React root တစ်ခုအတွင်းမှာ render လုပ်ထားတဲ့ tree တစ်ခုကို ဖျက်ဆီးဖို့ `root.unmount` ကို ခေါ်ပါ:

```js
root.unmount();
```

React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတဲ့ app တစ်ခုမှာ `root.unmount` ခေါ်စရာ မလိုသလောက်ပါ။

ဒါက အဓိကအားဖြင့် — သင့် React root ရဲ့ DOM node (ဒါမှမဟုတ် သူ့ရဲ့ ancestors တစ်ခုခု) ကို တခြား code တစ်ခုခုက DOM ကနေ ဖယ်ရှားနိုင်တဲ့အခါ အသုံးဝင်ပါတယ်။ ဥပမာ — inactive tabs တွေကို DOM ကနေ ဖယ်ရှားတဲ့ jQuery tab panel တစ်ခု ဆိုပါစို့။ Tab တစ်ခု ဖယ်ခံရရင် — သူ့အတွင်းက အကုန်လုံး (React roots တွေ အပါအဝင်) DOM ကနေ ပါဖယ်ခံရပါတယ်။ အဲဒီအခါ — `root.unmount` ခေါ်ပြီး ဖယ်ရှားခံရတဲ့ root ရဲ့ content တွေကို React က စီမံခန့်ခွဲတာ "ရပ်လိုက်" ဖို့ လိုပါတယ်။ မဟုတ်ရင် — ဖယ်ရှားခံရတဲ့ root အတွင်းက components တွေက subscriptions လို global resources တွေကို သန့်ရှင်းရေး လုပ်ဖို့ မသိဘဲ နေနေပါလိမ့်မယ်။

`root.unmount` ခေါ်တာက — root ထဲက components တွေ အားလုံးကို unmount လုပ်ပြီး event handlers ဒါမှမဟုတ် state တွေ ဖယ်ရှားခြင်း အပါအဝင် — React ကို root DOM node ကနေ "ခွာ" (detach) လိုက်ပါတယ်။

#### Parameters (root.unmount ၏ ပါရာမီတာများ)

`root.unmount` က parameter ဘာမှ လက်မခံပါဘူး။

#### Returns (root.unmount ၏ ပြန်ပေးသည့်တန်ဖိုး)

`root.unmount` က `undefined` ကို ပြန်ပေးပါတယ်။

#### Caveats (root.unmount အတွက် သတိပြုရမည့်အချက်များ)

- `root.unmount` ခေါ်တာက — tree ထဲက components တွေ အားလုံးကို unmount လုပ်ပြီး React ကို root DOM node ကနေ "ခွာ" လိုက်ပါတယ်။
- `root.unmount` ခေါ်ပြီးတာနဲ့ — root တစ်ခုတည်းပေါ်မှာ `root.render` ကို နောက်တစ်ခါ ပြန်ခေါ်လို့ မရတော့ပါဘူး။ Unmount ဖြစ်ပြီးသား root ပေါ်မှာ `root.render` ခေါ်ဖို့ ကြိုးစားရင် "Cannot update an unmounted root" error တစ်ခု throw ဖြစ်ပါလိမ့်မယ်။ ဒါပေမယ့် — အဲဒီ DOM node အတွက် root အရင် ဖျက်ပြီးရင်တော့ DOM node တစ်ခုတည်းအတွက် root အသစ်တစ်ခု ဖန်တီးလို့ ရပါတယ်။

## အသုံးပြုပုံ (Usage)

### React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတဲ့ app တစ်ခုကို render လုပ်ခြင်း

သင့် app က React နဲ့ အပြည့်အဝ တည်ဆောက်ထားတယ်ဆိုရင် — app တစ်ခုလုံးအတွက် root တစ်ခုတည်း ဖန်တီးပါ:

```js
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

ပုံမှန်အားဖြင့် ဒီ code ကို startup မှာ တစ်ကြိမ်ပဲ run ဖို့ လိုပါတယ်။ ဒါက:

1. သင့် HTML ထဲမှာ သတ်မှတ်ထားတဲ့ browser DOM node ကို ရှာပြီး
2. သင့် app ရဲ့ React component ကို အတွင်းမှာ ပြသပေးပါတယ်။

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- ဒါက DOM node ပါ -->
    <div id="root"></div>
  </body>
</html>
```

```js
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**သင့် app က React နဲ့ အပြည့်အဝ တည်ဆောက်ထားရင် — root တွေ ထပ်မဖန်တီးသင့်သလို `root.render` ကိုလည်း ပြန်ခေါ်စရာ မလိုပါဘူး။**

ဒီကစပြီး — React က သင့် app တစ်ခုလုံးရဲ့ DOM ကို စီမံပါလိမ့်မယ်။ Components တွေ ထပ်ထည့်ချင်ရင် [App component ရဲ့ အတွင်းမှာ ထည့်သွင်းပါ](https://react.dev/learn/importing-and-exporting-components)။ UI update လုပ်ဖို့ လိုတဲ့အခါ — component တစ်ခုစီက [state](/docs/react/use-state) သုံးပြီး လုပ်နိုင်ပါတယ်။ DOM node ရဲ့ အပြင်ဘက်မှာ modal ဒါမှမဟုတ် tooltip လို အပိုအကြောင်းအရာတွေ ပြချင်ရင် — [portal တစ်ခုနဲ့ render လုပ်ပါ](/docs/react/create-portal)။

> **မှတ်ချက်:** သင့် HTML က ဗလာဖြစ်နေရင် — app ရဲ့ JavaScript code မရောက်ရှိခင်အထိ user က ဗလာ page တစ်ခုကိုပဲ မြင်ရပါလိမ့်မယ်:
>
> ```html
> <div id="root"></div>
> ```
>
> ဒါက အရမ်း နှေးတယ်လို့ ခံစားရစေနိုင်ပါတယ်! ဖြေရှင်းဖို့ — JavaScript code တွေ မရောက်ရှိခင်ကတည်းက visitor တွေ စာသား ဖတ်နိုင်၊ ပုံတွေ မြင်နိုင်၊ links တွေ နှိပ်နိုင်အောင် — [server ပေါ်မှာ ဒါမှမဟုတ် build ချိန်မှာ](https://react.dev/reference/react-dom/server) သင့် components တွေကနေ ကနဦး HTML ကို generate လုပ်နိုင်ပါတယ်။ ဒီ optimization ကို ပုံမှန်အတိုင်း လုပ်ပေးတဲ့ [framework တစ်ခု](https://react.dev/learn/creating-a-react-app) သုံးဖို့ အကြံပြုပါတယ်။ ဘယ်အချိန်မှာ run လဲပေါ် မူတည်ပြီး — ဒါကို *server-side rendering (SSR)* ဒါမှမဟုတ် *static site generation (SSG)* လို့ ခေါ်ပါတယ်။

> **သတိပြုရန်:** Server rendering ဒါမှမဟုတ် static generation သုံးတဲ့ apps တွေက — `createRoot` အစား [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) ကို ခေါ်ရပါမယ်။ အဲဒါဆိုရင် React က သင့် HTML ကနေ DOM nodes တွေကို ဖျက်ဆီးပြီး ပြန်ဖန်တီးတာ မဟုတ်ဘဲ — *hydrate* (ပြန်လည် အသုံးပြု) လုပ်ပါလိမ့်မယ်။

### React နဲ့ တစ်စိတ်တစ်ပိုင်း တည်ဆောက်ထားတဲ့ page တစ်ခုကို render လုပ်ခြင်း

သင့် page က React နဲ့ [တစ်စိတ်တစ်ပိုင်းပဲ တည်ဆောက်ထားတယ်ဆိုရင်](https://react.dev/learn/add-react-to-an-existing-project) — React က စီမံမယ့် top-level UI အပိုင်းတစ်ခုစီအတွက် `createRoot` ကို အကြိမ်ကြိမ် ခေါ်ပြီး root တွေ ဖန်တီးနိုင်ပါတယ်။ Root တစ်ခုစီမှာ `root.render` ခေါ်ပြီး မတူညီတဲ့ content တွေ ပြနိုင်ပါတယ်။

ဒီမှာ — React component နှစ်ခုကို `index.html` ထဲမှာ သတ်မှတ်ထားတဲ့ DOM nodes နှစ်ခုထဲမှာ render လုပ်ထားပါတယ်:

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

```js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

[`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) နဲ့ DOM node အသစ်တစ်ခုကို ဖန်တီးပြီး — document ထဲကို ကိုယ်တိုင် ထည့်လို့လည်း ရပါတယ်:

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // document ရဲ့ ဘယ်နေရာမှာမဆို ထည့်လို့ရပါတယ်
```

DOM node ကနေ React tree ကို ဖယ်ရှားပြီး သူသုံးထားတဲ့ resources တွေ အားလုံးကို သန့်ရှင်းဖို့ — `root.unmount` ကို ခေါ်ပါ:

```js
root.unmount();
```

ဒါက အဓိကအားဖြင့် — သင့် React components တွေက တခြား framework တစ်ခုနဲ့ ရေးထားတဲ့ app တစ်ခုရဲ့ အတွင်းမှာ ရှိနေတဲ့အခါ အသုံးဝင်ပါတယ်။

### Root component တစ်ခုကို update လုပ်ခြင်း

Root တစ်ခုတည်းပေါ်မှာ `render` ကို တစ်ကြိမ်ထက်ပိုပြီး ခေါ်လို့ရပါတယ်။ Component tree ရဲ့ တည်ဆောက်ပုံက အရင် render လုပ်ထားတာနဲ့ ကိုက်ညီနေသရွေ့ — React က [state ကို ထိန်းသိမ်း](https://react.dev/learn/preserving-and-resetting-state) ပါလိမ့်မယ်။ ဒီဥပမာမှာ input ထဲ စာရိုက်လို့ရတာကို သတိထားပါ — ဆိုလိုတာက စက္ကန့်တိုင်း `render` ခေါ်တာတွေကနေ လာတဲ့ updates တွေက ဖျက်ဆီးတတ်တဲ့ဟာတွေ မဟုတ်ပါဘူး:

```js
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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

`render` ကို အကြိမ်ကြိမ် ခေါ်တာက တွေ့ရ ခဲပါတယ်။ ပုံမှန်အားဖြင့် — သင့် components တွေက [state ကို update](/docs/react/use-state) လုပ်ပါလိမ့်မယ်။

### Production မှာ error logging (error မှတ်တမ်းတင်ခြင်း)

React က errors တွေ အားလုံးကို console ထဲမှာ ပုံမှန်အားဖြင့် log လုပ်ပါတယ်။ ကိုယ်ပိုင် error reporting စနစ် တည်ဆောက်ချင်ရင် — optional error handler root options တွေဖြစ်တဲ့ `onUncaughtError`, `onCaughtError` နဲ့ `onRecoverableError` တွေကို ပေးနိုင်ပါတယ်:

```js
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
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

`onUncaughtError` နဲ့ `onRecoverableError` တို့နဲ့ အတူ — ကိုယ်ပိုင် error reporting စနစ် အပြည့်အစုံ အကောင်အထည်ဖော်နိုင်ပါတယ်:

```js
function reportError({ type, error, errorInfo }) {
  // တိကျတဲ့ အကောင်အထည်ဖော်မှုက သင့်အပေါ်မှာ မူတည်ပါတယ်။
  // `console.error()` ကို သရုပ်ပြရန်အတွက်သာ သုံးထားတာပါ။
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Development မှာ React ရဲ့ default handlers တွေကို အသုံးချနိုင်ဖို့
  // ဒီ options တွေကို ဖယ်ထားဖို့ ဒါမှမဟုတ် ကိုယ်ပိုင် overlay တစ်ခု ရေးဖို့ သတိပြုပါ။
  // ဒီ handlers တွေကို သရုပ်ပြရန်အတွက်သာ ခြွင်းချက်မရှိ သတ်မှတ်ထားတာပါ။
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
```

## Troubleshooting (ပြဿနာရှာဖွေခြင်း)

### Root ဖန်တီးပြီးပြီ ဒါပေမယ့် ဘာမှ မပြသပါဘူး

Root ထဲကို သင့် app ကို တကယ် *render* လုပ်ဖို့ မမေ့ပါစေနဲ့:

```js
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

ဒါကို မလုပ်မချင်း — ဘာမှ ပြသမှာ မဟုတ်ပါဘူး။

### "You passed a second argument to root.render" error ရနေပါတယ်

အဖြစ်များတဲ့ အမှားတစ်ခုက — `createRoot` အတွက် options တွေကို `root.render(...)` ဆီ မှားပို့မိတာပါ:

```js
// 🚩 မှား: root.render က argument တစ်ခုပဲ လက်ခံပါတယ်။
root.render(App, {onUncaughtError});

// ✅ မှန်: options တွေကို createRoot ဆီ ပေးပါ။
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

### "Target container is not a DOM element" error ရနေပါတယ်

ဒီ error က — သင် `createRoot` ဆီ ပို့နေတာက DOM node တစ်ခု မဟုတ်ဘူးလို့ ဆိုလိုတာပါ။ ဘာဖြစ်နေလဲ မသေချာရင် — log ထုတ်ကြည့်ပါ:

```js
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

ဥပမာ — `domNode` က `null` ဆိုရင် [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) က `null` ပြန်လိုက်တယ်လို့ ဆိုလိုပါတယ်။ ဒါက — သင်ခေါ်တဲ့ အချိန်မှာ document ထဲမှာ အဲဒီ ID နဲ့ node မရှိဘူးဆိုရင် ဖြစ်တတ်ပါတယ်။ အကြောင်းရင်း အနည်းငယ် ရှိနိုင်ပါတယ်:

1. သင်ရှာနေတဲ့ ID က HTML file ထဲမှာ သုံးထားတဲ့ ID နဲ့ မတူနိုင်ပါဘူး။ စာလုံးပေါင်း မှန်မမှန် စစ်ပါ!
2. သင့် bundle ရဲ့ `<script>` tag က HTML ထဲမှာ သူ့နောက်မှ ပေါ်လာတဲ့ DOM nodes တွေကို "မြင်နိုင်" မှာ မဟုတ်ပါဘူး။

ဒီ error ရတတ်တဲ့ နောက်ထပ် နည်းတစ်ခုက — `createRoot(domNode)` အစား `createRoot(<App />)` ရေးမိတာပါ။

### "Functions are not valid as a React child." error ရနေပါတယ်

ဒီ error က — သင် `root.render` ဆီ ပို့နေတာက React component တစ်ခု မဟုတ်ဘူးလို့ ဆိုလိုတာပါ။

`root.render` ကို `<Component />` အစား `Component` နဲ့ ခေါ်မိရင် ဖြစ်တတ်ပါတယ်:

```js
// 🚩 မှား: App က function တစ်ခုပါ၊ Component တစ်ခု မဟုတ်ပါဘူး။
root.render(App);

// ✅ မှန်: <App /> က component တစ်ခုပါ။
root.render(<App />);
```

ဒါမှမဟုတ် — `root.render` ဆီ function တစ်ခုကို ခေါ်ပြီးသား ရလဒ် အစား function ကိုယ်တိုင် ပေးမိရင်လည်း ဖြစ်တတ်ပါတယ်:

```js
// 🚩 မှား: createApp က function တစ်ခုပါ၊ component တစ်ခု မဟုတ်ပါဘူး။
root.render(createApp);

// ✅ မှန်: component တစ်ခု ပြန်ပေးဖို့ createApp ကို ခေါ်ပါ။
root.render(createApp());
```

### Server-rendered HTML က အစကနေ ပြန်ဖန်တီးခံနေရပါတယ်

သင့် app က server-rendered ဖြစ်ပြီး React က ထုတ်ပေးထားတဲ့ ကနဦး HTML ပါဝင်နေရင် — root တစ်ခု ဖန်တီးပြီး `root.render` ခေါ်တာက အဲဒီ HTML တစ်ခုလုံးကို ဖျက်ပြီး DOM nodes တွေကို အစကနေ အကုန် ပြန်ဖန်တီးနေတာကို သတိထားမိနိုင်ပါတယ်။ ဒါက ပိုနှေးစေပြီး — focus နဲ့ scroll positions တွေ ပြန်စသွားကာ — တခြား user input တွေလည်း ပျောက်ဆုံးစေနိုင်ပါတယ်။

Server-rendered apps တွေက `createRoot` အစား [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) ကို သုံးရပါမယ်:

```js
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

သူ့ရဲ့ API က မတူညီတာ သတိပြုပါ။ အထူးသဖြင့် — ပုံမှန်အားဖြင့် နောက်ထပ် `root.render` ခေါ်စရာ မလိုတော့ပါဘူး။
