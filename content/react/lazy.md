---
title: "lazy"
description: "Component တစ်ခုရဲ့ code ကို ပထမဆုံးအကြိမ် render လုပ်ချိန်အထိ loading ရွှေ့ဆိုင်းပေးနိုင်တဲ့ React API — code splitting နဲ့ Suspense ပေါင်းသုံးပုံ၊ parameters/returns များ"
order: 58
source: "https://react.dev/reference/react/lazy"
status: translated
updated: 2026-09-02
---

`lazy` ဆိုတာ — component တစ်ခုရဲ့ code ကို ပထမဆုံးအကြိမ် render လုပ်ချိန်အထိ loading လုပ်တာကို ရွှေ့ဆိုင်းထားနိုင်တဲ့ (defer) React function တစ်ခုပါ။ ဒါကို code splitting — app ရဲ့ initial bundle ကို သေးအောင် ခွဲပြီး လိုအပ်မှသာ code အပိုင်းတွေကို သီးခြား load လုပ်တာ — လုပ်ဖို့ သုံးပါတယ်။

```js
const SomeComponent = lazy(load)
```

## ရည်ညွှန်းချက် (Reference)

### `lazy(load)`

Lazy-loaded React component တစ်ခုကို ကြေညာဖို့ — `lazy` ကို သင့် components တွေရဲ့ အပြင်ဘက်မှာ ခေါ်ပါတယ်:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

#### Parameters (ပါရာမီတာများ)

- `load` — [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (သို့) တခြား *thenable* (Promise လိုမျိုး — `then` method ပါတဲ့ object) တစ်ခုကို ပြန်ပေးတဲ့ function ပါ။ React က ပြန်ပေးလိုက်တဲ့ component ကို ပထမဆုံးအကြိမ် render လုပ်ဖို့ ကြိုးစားတဲ့အခါမှပဲ `load` ကို ခေါ်ပါတယ်။ ပထမဆုံး `load` ခေါ်ပြီးနောက် — resolve ဖြစ်တာကို စောင့်ပြီး — resolve ရလာတဲ့ တန်ဖိုးရဲ့ `.default` ကို React component အဖြစ် render လုပ်ပါတယ်။ ပြန်လာတဲ့ Promise ရော Promise ရဲ့ resolved value ပါ cache လုပ်ခံရလို့ — React က `load` ကို တစ်ခါထက် ပိုပြီး မခေါ်ပါဘူး။ Promise reject ဖြစ်ရင် — React က rejection reason ကို အနီးဆုံး Error Boundary ကိုင်တွယ်ဖို့ throw လုပ်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`lazy` က သင့် tree ထဲမှာ render လို့ရတဲ့ React component တစ်ခုကို ပြန်ပေးပါတယ်။ Lazy component ရဲ့ code loading ဖြစ်နေတုန်း render လုပ်ဖို့ ကြိုးစားရင် — *suspend* (ခေတ္တရပ်ဆိုင်း) ဖြစ်ပါတယ်။ Load လုပ်နေချိန်မှာ loading indicator ပြဖို့ — [`<Suspense>`](/docs/react/suspense) ကို သုံးပါ။

### `load` function

#### Parameters (ပါရာမီတာများ)

`load` က ပါရာမီတာ ဘာမှ မလက်ခံပါဘူး။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (သို့) တခြား *thenable* တစ်ခုကို ပြန်ပေးရပါတယ် — နောက်ဆုံးမှာ `.default` property က valid React component type ဖြစ်တဲ့ object တစ်ခုဆီ resolve ဖြစ်ရပါတယ် — function (သို့) [`memo`](https://react.dev/reference/react/memo) (သို့) [`forwardRef`](https://react.dev/reference/react/forwardRef) component လိုမျိုးပါ။

## အသုံးပြုပုံ (Usage)

### Component တွေကို Suspense နဲ့ lazy-loading လုပ်ခြင်း (Lazy-loading components with Suspense)

ပုံမှန်အားဖြင့် — component တွေကို static [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) declaration နဲ့ import လုပ်ပါတယ်:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

ဒီ component ရဲ့ code ကို ပထမဆုံးအကြိမ် render လုပ်ချိန်အထိ ရွှေ့ဆိုင်းချင်ရင် — ဒီ import ကို ဒီလိုမျိုး အစားထိုးပါ:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

ဒီ code က [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) ကို မှီခိုလို့ — သင့် bundler (သို့) framework ရဲ့ ပံ့ပိုးမှု လိုနိုင်ပါတယ်။ ဒီ pattern သုံးတဲ့အခါ — lazy-load လုပ်နေတဲ့ component ကို `default` export အနေနဲ့ export လုပ်ထားဖို့ လိုပါတယ်။

ခုဆို component ရဲ့ code က on demand load ဖြစ်နေလို့ — load လုပ်နေချိန်မှာ ဘာပြမလဲဆိုတာလည်း သတ်မှတ်ပေးရပါမယ်။ Lazy component (သို့) သူ့ရဲ့ parent တစ်ခုခုကို [`<Suspense>`](/docs/react/suspense) boundary တစ်ခုနဲ့ ထုပ်ခြင်းအားဖြင့် လုပ်နိုင်ပါတယ်:

```js
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

ဒီဥပမာမှာ — `MarkdownPreview` ရဲ့ code ကို render လုပ်ဖို့ ကြိုးစားတဲ့အခါမှပဲ load ပါလိမ့်မယ်။ `MarkdownPreview` loading မပြီးသေးရင် — သူ့နေရာမှာ `Loading` ကို ပြပါလိမ့်မယ်။ Checkbox ကို အမှတ်ခြယ်/ဖြုတ် လုပ်ကြည့်ပါ:

`App.js` — markdown editor တစ်ခုနဲ့ preview ကို ချိတ်ဆက်ထားတဲ့ ဥပမာပါ:

```js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Loading state ကို မြင်ရအောင် delay အသေတစ်ခု ထည့်ထားတာပါ
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

`Loading.js`:

```js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

`MarkdownPreview.js`:

```js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

ဒီ demo က artificial delay တစ်ခုနဲ့ load လုပ်ပါတယ်။ နောက်တစ်ခါ checkbox ကို ဖြုတ်ပြီး ပြန်အမှတ်ခြယ်ကြည့်ရင် — `Preview` က cache လုပ်ပြီးသား ဖြစ်လို့ — loading state မရှိတော့ပါဘူး။ Loading state ကို ထပ်မြင်ချင်ရင် — sandbox ထဲက "Reset" ကို နှိပ်ပါ။

[Suspense နဲ့ loading states တွေကို စီမံခန့်ခွဲခြင်း အကြောင်း ဆက်ဖတ်ပါ](/docs/react/suspense)။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Lazy component ရဲ့ state တွေ မထင်မှတ်ဘဲ reset ဖြစ်သွားတယ်

`lazy` components တွေကို တခြား components တွေရဲ့ *အတွင်းမှာ* ကြေညာ မလုပ်ပါနဲ့:

```js
import { lazy } from 'react';

function Editor() {
  // 🔴 မမှန်ပါ — ဒါက re-render တိုင်းမှာ state အားလုံး reset ဖြစ်စေပါတယ်
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

အစား — သူတို့ကို module ရဲ့ ထိပ်ဆုံးအဆင့်မှာ အမြဲ ကြေညာပါ:

```js
import { lazy } from 'react';

// ✅ မှန်ပါတယ် — lazy components တွေကို components တွေရဲ့ အပြင်ဘက်မှာ ကြေညာပါ
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
