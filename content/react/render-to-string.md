---
title: "renderToString"
description: "React tree တစ်ခုကို HTML string အဖြစ် render လုပ်ပေးတဲ့ react-dom/server API — streaming နဲ့ data စောင့်ဆိုင်းခြင်းကို support မလုပ်သော renderToString ၏ parameters/returns/caveats များ၊ streaming (သို့) static prerender method များဆီ ပြောင်းရွှေ့နည်းနဲ့ client code ထဲမှာ မသုံးသင့်ကြောင်း"
order: 90
source: "https://react.dev/reference/react-dom/server/renderToString"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်:** `renderToString` က streaming ကိုရော data စောင့်ဆိုင်းခြင်းကိုပါ support မလုပ်ပါဘူး။ [အခြားရွေးချယ်စရာများ (Alternatives)](#alternatives) ကို ကြည့်ပါ။

`renderToString` က React tree တစ်ခုကို HTML string အဖြစ် render လုပ်ပါတယ်။

```js
const html = renderToString(reactNode, options?)
```

## ရည်ညွှန်းချက် (Reference)

### `renderToString(reactNode, options?)`

Server ပေါ်မှာ — သင့် app ကို HTML အဖြစ် render လုပ်ဖို့ `renderToString` ကို ခေါ်ပါ:

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Client ပေါ်မှာတော့ — server ကထုတ်ပေးလိုက်တဲ့ HTML ကို interactive ဖြစ်အောင် [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်ပါ။

#### Parameters (ပါရာမီတာများ)

- `reactNode`: HTML အဖြစ် render လုပ်ချင်တဲ့ React node တစ်ခု။ ဥပမာ — `<App />` လို JSX node တစ်ခု။
- **optional** `options`: Server render အတွက် option တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `identifierPrefix`: [`useId`](/docs/react/use-id) က generate လုပ်တဲ့ IDs တွေအတွက် React သုံးမယ့် string prefix တစ်ခု။ Page တစ်ခုတည်းမှာ roots အများကြီး သုံးတဲ့အခါ conflicts တွေ ရှောင်ရှားဖို့ အသုံးဝင်ပါတယ်။ [`hydrateRoot`](/docs/react/hydrate-root) ဆီ ပေးထားတဲ့ prefix နဲ့ အတူတူပဲ ဖြစ်ရပါမယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

HTML string တစ်ခု ဖြစ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `renderToString` မှာ Suspense support အကန့်အသတ်ပဲ ရှိပါတယ်။ Component တစ်ခု suspend ဖြစ်ရင် — `renderToString` က သူ့ရဲ့ fallback ကို HTML အဖြစ် ချက်ချင်း ပို့လိုက်ပါတယ်။
- `renderToString` က browser ထဲမှာလည်း အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် client code ထဲမှာ သုံးတာကိုတော့ [မအကြံပြုပါဘူး](#removing-rendertostring-from-the-client-code)။

## အသုံးပြုပုံ (Usage)

### React tree တစ်ခုကို HTML string အဖြစ် render လုပ်ခြင်း

သင့် app ကို HTML string အဖြစ် render လုပ်ဖို့ `renderToString` ကို ခေါ်ပါ — ပြီးရင် အဲဒီ string ကို သင့် server response နဲ့အတူ ပို့နိုင်ပါတယ်:

```js
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

ဒါက သင့် React components တွေရဲ့ ကနဦး non-interactive HTML output ကို ထုတ်ပေးပါလိမ့်မယ်။ Client ပေါ်မှာတော့ — အဲဒီ server-generated HTML ကို *hydrate* လုပ်ပြီး interactive ဖြစ်အောင် [`hydrateRoot`](/docs/react/hydrate-root) ကို ခေါ်ဖို့ လိုပါလိမ့်မယ်။

> **သတိပြုရန်:** `renderToString` က streaming ကိုရော data စောင့်ဆိုင်းခြင်းကိုပါ support မလုပ်ပါဘူး။ [အခြားရွေးချယ်စရာများ (Alternatives)](#alternatives) ကို ကြည့်ပါ။

## Alternatives (အခြားရွေးချယ်စရာများ)

### `renderToString` ကနေ server မှာ streaming render ဆီ ပြောင်းခြင်း

`renderToString` က string တစ်ခုကို ချက်ချင်း ပြန်ပေးတာမို့ — content တွေ ရောက်လာတာနဲ့ stream လုပ်တာကို support မလုပ်ပါဘူး။

ဖြစ်နိုင်ရင် — ဒီ full-featured alternatives တွေကို သုံးဖို့ အကြံပြုပါတယ်:

- Node.js သုံးနေရင် — [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) ကို သုံးပါ။
- [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ပါတဲ့ Deno (သို့) modern edge runtime သုံးနေရင် — [`renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream) ကို သုံးပါ။

သင့် server environment က streams တွေကို support မလုပ်ဘူးဆိုရင် — `renderToString` ကို ဆက်သုံးနိုင်ပါတယ်။

### `renderToString` ကနေ static prerender ဆီ ပြောင်းခြင်း

`renderToString` က string တစ်ခုကို ချက်ချင်း ပြန်ပေးတာမို့ — static HTML generation အတွက် data တွေ အကုန် ရောက်လာအောင် စောင့်ဆိုင်းတာကို support မလုပ်ပါဘူး။

ဒီ full-featured alternatives တွေကို သုံးဖို့ အကြံပြုပါတယ်:

- Node.js သုံးနေရင် — [`prerenderToNodeStream`](https://react.dev/reference/react-dom/static/prerenderToNodeStream) ကို သုံးပါ။
- [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ပါတဲ့ Deno (သို့) modern edge runtime သုံးနေရင် — [`prerender`](https://react.dev/reference/react-dom/static/prerender) ကို သုံးပါ။

သင့် static site generation environment က streams တွေကို support မလုပ်ဘူးဆိုရင် — `renderToString` ကို ဆက်သုံးနိုင်ပါတယ်။

### Client code ထဲက `renderToString` ကို ဖယ်ရှားခြင်း

တခါတရံမှာ `renderToString` ကို client ပေါ်မှာ — component တစ်ခုကို HTML အဖြစ် ပြောင်းဖို့ သုံးတတ်ပါတယ်:

```js
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // For example, "<svg>...</svg>"
```

**Client ပေါ်မှာ** `react-dom/server` ကို import လုပ်တာက — သင့် bundle size ကို မလိုအပ်ဘဲ ကြီးစေပြီး ရှောင်ရှားသင့်ပါတယ်။ Browser ထဲမှာ component တစ်ခုကို HTML အဖြစ် render လုပ်ချင်ရင် — [`createRoot`](/docs/react/create-root) ကို သုံးပြီး DOM ကနေ HTML ကို ဖတ်ယူပါ:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // For example, "<svg>...</svg>"
```

[`flushSync`](/docs/react/flush-sync) ခေါ်တာက — DOM ရဲ့ [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property ကို မဖတ်ခင် DOM ကို update ပြီးသား ဖြစ်နေဖို့ လိုအပ်လို့ပါ။

## Troubleshooting (ပြဿနာရှာဖွေခြင်း)

### Component တစ်ခု suspend ဖြစ်ရင် HTML ထဲမှာ fallback ပဲ အမြဲ ပါနေတာ

`renderToString` က Suspense ကို အပြည့်အဝ support မလုပ်ပါဘူး။

Component တစ်ခုခု suspend ဖြစ်ရင် (ဥပမာ — [`lazy`](/docs/react/lazy) နဲ့ သတ်မှတ်ထားလို့ (သို့) data fetch လုပ်နေလို့) — `renderToString` က သူ့ရဲ့ content တွေ resolve ဖြစ်တာ မစောင့်ပါဘူး။ အဲဒီအစား — `renderToString` က အပေါ်မှာ အနီးဆုံး [`<Suspense>`](/docs/react/suspense) boundary ကို ရှာပြီး သူ့ရဲ့ `fallback` prop ကို HTML ထဲမှာ render လုပ်ပါလိမ့်မယ်။ Client code တွေ load မဖြစ်မချင်း အဲဒီ content က ပေါ်လာမှာ မဟုတ်ပါဘူး။

ဒါကို ဖြေရှင်းဖို့ — [အကြံပြုထားတဲ့ streaming solutions](#alternatives) တွေထဲက တစ်ခုကို သုံးပါ။ Server-side rendering အတွက်ဆိုရင် — server ပေါ်မှာ content တွေ resolve ဖြစ်လာတာနဲ့ အပိုင်းလိုက် stream လုပ်နိုင်လို့ — client code တွေ load မဖြစ်ခင်ကတည်းက page က တဖြည်းဖြည်း ပြည့်လာတာကို user မြင်ရပါလိမ့်မယ်။ Static site generation အတွက်ဆိုရင် — static HTML မထုတ်လုပ်ခင် content အားလုံး resolve ဖြစ်တာကို စောင့်နိုင်ပါတယ်။
