---
title: "createElement"
description: "React element တစ်ခုကို ဖန်တီးပေးတဲ့ API — JSX မသုံးဘဲ type, props နဲ့ children တွေနဲ့ element တွေ တည်ဆောက်ခြင်း — parameters/returns/caveats များနဲ့ အသုံးပြုပုံ"
order: 70
source: "https://react.dev/reference/react/createElement"
status: translated
updated: 2026-09-02
---

`createElement` ဆိုတာ — React element တစ်ခုကို ဖန်တီးပေးတဲ့ function ဖြစ်ပြီး [JSX](https://react.dev/learn/writing-markup-with-jsx) ရေးသားခြင်းရဲ့ အခြားရွေးချယ်စရာ တစ်ခုပါ။

```js
const element = createElement(type, props, ...children)
```

## ရည်ညွှန်းချက် (Reference)

### `createElement(type, props, ...children)`

ပေးထားတဲ့ `type`, `props` နဲ့ `children` တွေနဲ့ React element တစ်ခု ဖန်တီးဖို့ `createElement` ကို ခေါ်ပါတယ်:

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

#### Parameters (ပါရာမီတာများ)

- `type` — React component type တစ်ခု ဖြစ်ရပါတယ်။ ဥပမာ — tag name string (`'div'` ဒါမှမဟုတ် `'span'` လိုမျိုး) ဒါမှမဟုတ် React component (function, class, ဒါမှမဟုတ် [`Fragment`](https://react.dev/reference/react/Fragment) လို special component) ဖြစ်နိုင်ပါတယ်။
- `props` — object ဒါမှမဟုတ် `null` ဖြစ်ရပါတယ်။ `null` ပေးလိုက်ရင် empty object နဲ့ အတူတူပဲ သဘောထားခံရပါတယ်။ React က သင်ပေးလိုက်တဲ့ `props` တွေနဲ့ ကိုက်ညီတဲ့ element တစ်ခု ဖန်တီးပေးပါတယ်။ `props` object ထဲက `ref` နဲ့ `key` တွေကတော့ ထူးခြားပါတယ် — ပြန်ရတဲ့ `element` ပေါ်မှာ `element.props.ref` နဲ့ `element.props.key` အနေနဲ့ **မရနိုင်ဘဲ** — `element.ref` နဲ့ `element.key` အနေနဲ့သာ ရပါလိမ့်မယ်။
- **optional** `...children` — child node တွေ သုည ဒါမှမဟုတ် အများကြီး ဖြစ်နိုင်ပါတယ်။ React elements, strings, numbers, [portals](https://react.dev/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, `false`) နဲ့ React nodes တွေရဲ့ arrays တွေ အပါအဝင် — React node တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`createElement` က property အနည်းငယ်ပါတဲ့ React element object တစ်ခုကို ပြန်ပေးပါတယ်:

- `type` — သင်ပေးလိုက်တဲ့ `type`။
- `props` — `ref` နဲ့ `key` ကလွဲပြီး သင်ပေးလိုက်တဲ့ props တွေ။
- `ref` — သင်ပေးလိုက်တဲ့ `ref`။ မပေးရင် `null`။
- `key` — string အဖြစ် ပြောင်းထားတဲ့ သင်ပေးလိုက်တဲ့ `key`။ မပေးရင် `null`။

ပုံမှန်အားဖြင့် — element ကို သင့် component ကနေ ပြန်ပေး (return) လုပ်တာ ဒါမှမဟုတ် တခြား element တစ်ခုရဲ့ child အဖြစ် ထားပါတယ်။ Element ရဲ့ properties တွေကို ဖတ်လို့ ရပေမယ့် — element တစ်ခုကို ဖန်တီးပြီးတာနဲ့ opaque (အတွင်းကို ထိုးဖောက်မကြည့်သော) တစ်ခုအနေနဲ့ သဘောထားပြီး — render လုပ်ရုံကလွဲလို့ တခြားကိုင်တွယ်မှု မလုပ်တာ အကောင်းဆုံးပါ။

#### Caveats (သတိပြုရမည့်အချက်များ)

- React elements နဲ့ သူတို့ရဲ့ props တွေကို [immutable](https://en.wikipedia.org/wiki/Immutable_object) (ဖန်တီးပြီးနောက် ပြောင်းလဲ၍ မရသော) အဖြစ် သဘောထားပြီး — ဖန်တီးပြီးတာနဲ့ သူတို့ရဲ့ အကြောင်းအရာတွေကို ဘယ်တော့မှ မပြောင်းရပါဘူး။ Development မှာ React က ပြန်ပေးလိုက်တဲ့ element နဲ့ သူ့ရဲ့ `props` property ကို shallow ပုံစံ [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) လုပ်ပြီး ဒါကို အတည်ပြုပေးပါတယ်။
- JSX သုံးတဲ့အခါ — ကိုယ်ပိုင် custom component တစ်ခုကို render လုပ်ဖို့ tag ကို **စာလုံးကြီးနဲ့ စရပါမယ်**။ တစ်နည်းပြောရရင် `<Something />` က `createElement(Something)` နဲ့ ညီမျှပြီး — `<something />` (lowercase) ကတော့ `createElement('something')` နဲ့ ညီမျှပါတယ် (string ဖြစ်လို့ built-in HTML tag အဖြစ် သဘောထားခံရမှာကို သတိပြုပါ)။
- Children တွေကို **အကုန်လုံး statically သိပြီးသား ဖြစ်မှသာ** — `createElement('h1', {}, child1, child2, child3)` လို argument အများကြီးအနေနဲ့ ပေးသင့်ပါတယ်။ Children တွေ dynamic ဖြစ်နေရင်တော့ — array တစ်ခုလုံးကို တတိယ argument အဖြစ် ပေးပါ: `createElement('ul', {}, listItems)`။ ဒါဆိုရင် dynamic lists တွေမှာ [`key` တွေ ပျောက်နေတာကို React က သတိပေးနိုင်ပါလိမ့်မယ်](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)။ Static lists တွေကတော့ ဘယ်တော့မှ ပြန်စီခြင်း (reorder) မလုပ်ရတာမို့ — ဒါ မလိုအပ်ပါဘူး။

## အသုံးပြုပုံ (Usage)

### JSX မပါဘဲ Element တစ်ခုကို ဖန်တီးခြင်း (Creating an element without JSX)

[JSX](https://react.dev/learn/writing-markup-with-jsx) ကို မကြိုက်ဘူး ဒါမှမဟုတ် သင့် project မှာ မသုံးနိုင်ဘူးဆိုရင် — အခြားရွေးချယ်စရာ တစ်ခုအနေနဲ့ `createElement` ကို သုံးနိုင်ပါတယ်။

JSX မပါဘဲ element တစ်ခု ဖန်တီးဖို့ — `type`, `props` နဲ့ `children` တွေနဲ့ `createElement` ကို ခေါ်ပါ:

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

`children` တွေက optional ဖြစ်ပြီး — လိုသလောက် အများကြီး ပေးနိုင်ပါတယ် (အထက်က ဥပမာမှာ children သုံးခု ရှိပါတယ်)။ ဒီ code က နှုတ်ခွန်းဆက်စကားပါတဲ့ `<h1>` header တစ်ခုကို ပြပါလိမ့်မယ်။ နှိုင်းယှဉ်ကြည့်ဖို့ — ဒီဥပမာကိုပဲ JSX နဲ့ ပြန်ရေးထားတာ အောက်မှာ ဖြစ်ပါတယ်:

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

ကိုယ်ပိုင် React component တစ်ခုကို render လုပ်ဖို့ — `'h1'` လို string အစား `Greeting` လို function တစ်ခုကို `type` အဖြစ် ပေးပါ:

```js
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

JSX နဲ့ဆိုရင် — ဒီလို ဖြစ်ပါလိမ့်မယ်:

```js
export default function App() {
  return <Greeting name="Taylor" />;
}
```

ရေးဟန် နှစ်မျိုးလုံး အဆင်ပြေပါတယ် — သင့် project အတွက် ဘယ်ဟာကို ကြိုက်လဲ သုံးနိုင်ပါတယ်။ JSX ရဲ့ အဓိက အားသာချက်က — ဘယ် closing tag က ဘယ် opening tag နဲ့ တွဲလဲ ရှင်းရှင်းလင်းလင်း မြင်ရတာပါ။

### React element ဆိုတာ အတိအကျ ဘာလဲ (What is a React element, exactly?)

Element ဆိုတာ — user interface ရဲ့ အစိတ်အပိုင်းတစ်ခုကို ပေါ့ပါးစွာ ဖော်ပြတဲ့ description တစ်ခုပါ။ ဥပမာ — `<Greeting name="Taylor" />` ရော `createElement(Greeting, { name: 'Taylor' })` ရော — အောက်ပါအတိုင်း object တစ်ခုကို ထုတ်ပေးပါတယ်:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**ဒီ object ကို ဖန်တီးလိုက်တာက — `Greeting` component ကို render လုပ်တာ ဒါမှမဟုတ် DOM elements တွေ ဖန်တီးတာ မဟုတ်မှန်း သတိပြုပါ။**

React element က description တစ်ခု — React က နောက်မှ `Greeting` component ကို render လုပ်ဖို့ ပေးလိုက်တဲ့ ညွှန်ကြားချက်တစ်ခုလို သဘောပါ။ ဒီ object ကို သင့် `App` component ကနေ ပြန်ပေးလိုက်ခြင်းဖြင့် — React ကို နောက် ဘာလုပ်ရမလဲဆိုတာ ပြောလိုက်တာပါပဲ။

Element တွေ ဖန်တီးတာက အရမ်း စျေးပေါပါတယ် — ဒါကြောင့် ဒါကို optimize လုပ်ဖို့ ဒါမှမဟုတ် ရှောင်ဖို့ ကြိုးစားစရာ မလိုပါဘူး။
