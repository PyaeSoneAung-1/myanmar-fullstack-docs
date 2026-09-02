---
title: "Strict Mode"
description: "`<StrictMode>` ဖြင့် development အဆင့်မှာ component များ၏ အမှားများကို စောစီးစွာ ရှာဖွေခြင်း — render/Effect/ref callback များ နှစ်ကြိမ် ပြန်လည် run ခြင်း၊ deprecated APIs စစ်ဆေးခြင်းတို့၏ အကျိုးကျေးဇူးများ"
order: 40
source: "https://react.dev/reference/react/StrictMode"
status: translated
updated: 2026-09-02
---

`<StrictMode>` က development လုပ်နေစဉ်အတွင်း — သင့် components တွေထဲက အဖြစ်များတဲ့ bugs တွေကို — စောစီးစွာ ရှာဖွေတွေ့ရှိနိုင်စေပါတယ်။

```js
<StrictMode>
  <App />
</StrictMode>
```

## Reference

### `<StrictMode>`

အတွင်းက component tree အတွက် — development behavior နဲ့ warnings အပိုတွေကို ဖွင့်ပေးဖို့ `StrictMode` ကို သုံးပါ:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[အောက်မှာ ဥပမာတွေ ထပ်ကြည့်ပါ။](#usage)

Strict Mode က အောက်ပါ development-only behavior တွေကို ဖွင့်ပေးပါတယ်:

- သင့် components တွေက — impure rendering ကြောင့် ဖြစ်တဲ့ bugs တွေကို ရှာဖို့ — [နောက်ထပ် တစ်ကြိမ် re-render](#fixing-bugs-found-by-double-rendering-in-development) လုပ်ပါလိမ့်မယ်။
- သင့် components တွေက — Effect cleanup မရှိလို့ ဖြစ်တဲ့ bugs တွေကို ရှာဖို့ — [Effects တွေကို နောက်ထပ် တစ်ကြိမ် re-run](#fixing-bugs-found-by-re-running-effects-in-development) လုပ်ပါလိမ့်မယ်။
- သင့် components တွေက — ref cleanup မရှိလို့ ဖြစ်တဲ့ bugs တွေကို ရှာဖို့ — [ref callbacks တွေကို နောက်ထပ် တစ်ကြိမ် re-run](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) လုပ်ပါလိမ့်မယ်။
- သင့် components တွေက [deprecated APIs တွေ သုံးနေလားဆိုတာ စစ်ဆေးခံ](#fixing-deprecation-warnings-enabled-by-strict-mode) ရပါလိမ့်မယ်။

#### Props

`StrictMode` က props တစ်ခုမှ လက်ခံမထားပါဘူး။

#### Caveats (သတိပြုစရာများ)

- `<StrictMode>` နဲ့ ထုပ်ထားတဲ့ tree တစ်ခုအတွင်းမှာ — Strict Mode ကနေ ထွက်ဖို့ (opt out) နည်းလမ်း မရှိပါဘူး။ ဒါက — `<StrictMode>` အတွင်းက components တွေ အားလုံး စစ်ဆေးခံရတယ်ဆိုတဲ့ ယုံကြည်မှု ပေးပါတယ်။ Product တစ်ခုပေါ်မှာ အလုပ်လုပ်နေတဲ့ အဖွဲ့ နှစ်ဖွဲ့က — ဒီစစ်ဆေးမှုတွေ တန်ဖိုးရှိမရှိ သဘောထား ကွဲလွဲနေရင် — သူတို့ သဘောတူညီချက် တစ်ခုခု ရဖို့ ဒါမှမဟုတ် `<StrictMode>` ကို tree ထဲ အောက်ကို ရွှေ့ဖို့ လိုပါတယ်။

## Usage

### App တစ်ခုလုံးအတွက် Strict Mode ဖွင့်ခြင်း

Strict Mode က `<StrictMode>` component အတွင်းက component tree တစ်ခုလုံးအတွက် — development-only စစ်ဆေးမှုတွေ အပိုဖွင့်ပေးပါတယ်။ ဒီစစ်ဆေးမှုတွေက — development လုပ်ငန်းစဉ်ရဲ့ အစောပိုင်းမှာ — သင့် components တွေထဲက အဖြစ်များတဲ့ bugs တွေကို ရှာဖွေဖို့ ကူညီပါတယ်။

သင့် app တစ်ခုလုံးအတွက် Strict Mode ဖွင့်ဖို့ — root component ကို render လုပ်တဲ့အခါ — `<StrictMode>` နဲ့ ထုပ်ပါ:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

သင့် app တစ်ခုလုံးကို — အထူးသဖြင့် အသစ်ဖန်တီးထားတဲ့ apps တွေအတွက် — Strict Mode နဲ့ ထုပ်ဖို့ အကြံပြုပါတယ်။ [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) ကို သင့်အတွက် ခေါ်ပေးတဲ့ framework တစ်ခု သုံးနေရင် — Strict Mode ဖွင့်နည်းအတွက် သူ့ရဲ့ documentation ကို စစ်ဆေးပါ။

Strict Mode ရဲ့ စစ်ဆေးမှုတွေက **development မှာပဲ run တာဖြစ်ပေမယ့်** — သင့် code ထဲမှာ ရှိပြီးသား — production မှာ ယုံကြည်စိတ်ချစွာ reproduce လုပ်ဖို့ ခက်တဲ့ — bugs တွေကို ရှာဖွေဖို့ ကူညီပါတယ်။ Strict Mode က user တွေ မတိုင်ကြားခင် bugs တွေကို ပြုပြင်ခွင့် ပေးပါတယ်။

> **မှတ်ချက်:** Strict Mode က development ထဲမှာ အောက်ပါ စစ်ဆေးမှုတွေကို ဖွင့်ပေးပါတယ်:
>
> - သင့် components တွေက — impure rendering ကြောင့် ဖြစ်တဲ့ bugs တွေကို ရှာဖို့ — [နောက်ထပ် တစ်ကြိမ် re-render](#fixing-bugs-found-by-double-rendering-in-development) လုပ်ပါလိမ့်မယ်။
> - သင့် components တွေက — Effect cleanup မရှိလို့ ဖြစ်တဲ့ bugs တွေကို ရှာဖို့ — [Effects တွေကို နောက်ထပ် တစ်ကြိမ် re-run](#fixing-bugs-found-by-re-running-effects-in-development) လုပ်ပါလိမ့်မယ်။
> - သင့် components တွေက — ref cleanup မရှိလို့ ဖြစ်တဲ့ bugs တွေကို ရှာဖို့ — [ref callbacks တွေကို နောက်ထပ် တစ်ကြိမ် re-run](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) လုပ်ပါလိမ့်မယ်။
> - သင့် components တွေက [deprecated APIs တွေ သုံးနေလားဆိုတာ စစ်ဆေးခံ](#fixing-deprecation-warnings-enabled-by-strict-mode) ရပါလိမ့်မယ်။
>
> **ဒီစစ်ဆေးမှုတွေ အားလုံးက development-only ဖြစ်ပြီး — production build ကို မထိခိုက်ပါဘူး။**

### App ရဲ့ အစိတ်အပိုင်းတစ်ခုအတွက် Strict Mode ဖွင့်ခြင်း

သင့် application ရဲ့ ဘယ်အစိတ်အပိုင်းအတွက်မဆို — Strict Mode ဖွင့်နိုင်ပါတယ်:

```js
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

ဒီဥပမာမှာ — Strict Mode ရဲ့ စစ်ဆေးမှုတွေက `Header` နဲ့ `Footer` components တွေပေါ်မှာ run မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — `Sidebar` နဲ့ `Content` — ပြီးတော့ သူတို့အတွင်းက components တွေ အားလုံးပေါ်မှာတော့ — ဘယ်လောက်နက်နက်ပဲ ဖြစ်ဖြစ် — run ပါလိမ့်မယ်။

> **မှတ်ချက်:** `StrictMode` ကို app ရဲ့ အစိတ်အပိုင်းတစ်ခုအတွက်ပဲ ဖွင့်ထားတဲ့အခါ — React က production မှာ ဖြစ်နိုင်တဲ့ behavior တွေကိုပဲ ဖွင့်ပေးပါလိမ့်မယ်။ ဥပမာ — `<StrictMode>` ကို app ရဲ့ root မှာ မဖွင့်ထားရင် — ကနဦး mount မှာ [Effects တွေကို နောက်ထပ် တစ်ကြိမ် re-run](#fixing-bugs-found-by-re-running-effects-in-development) လုပ်မှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ — ဒါက parent effects တွေ မပါဘဲ — child effects တွေ နှစ်ခါ fire ဖြစ်စေပြီး — production မှာ မဖြစ်နိုင်တာမို့ပါ။

### Development မှာ Double Rendering ကြောင့် တွေ့ရတဲ့ Bugs တွေကို ပြုပြင်ခြင်း

[React က — သင်ရေးတဲ့ component တိုင်းက pure function တစ်ခုလို့ ယူဆပါတယ်](/docs/react/keeping-components-pure)။ ဆိုလိုတာက — သင် ရေးတဲ့ React components တွေက — inputs (props, state, context) တွေ တူညီနေသရွေ့ — JSX တူညီတာကိုပဲ အမြဲ ပြန်ပေးရပါတယ်။

ဒီစည်းမျဉ်းကို ချိုးဖောက်တဲ့ Components တွေက — ကြိုတင်ခန့်မှန်းလို့ မရတဲ့ပုံစံနဲ့ ပြုမူပြီး — bugs တွေ ဖြစ်စေပါတယ်။ မတော်တဆ impure ဖြစ်နေတဲ့ code တွေကို ရှာဖွေဖို့ — Strict Mode က သင့် function တချို့ကို (pure ဖြစ်သင့်တဲ့ဟာတွေကိုပဲ) development မှာ **နှစ်ကြိမ်** ခေါ်ပါတယ်။ ဒါတွေ ပါဝင်ပါတယ်:

- သင့် component function ရဲ့ body (top-level logic ပဲ ပါဝင်လို့ — event handlers ထဲက code တွေ မပါပါဘူး)
- [`useState`](/docs/react/use-state)၊ [`set` functions](/docs/react/use-state)၊ [`useMemo`](https://react.dev/reference/react/useMemo) ဒါမှမဟုတ် [`useReducer`](https://react.dev/reference/react/useReducer) တို့ဆီ ပို့တဲ့ functions တွေ
- Class component methods တချို့ — [`constructor`](https://react.dev/reference/react/Component)၊ [`render`](https://react.dev/reference/react/Component)၊ [`shouldComponentUpdate`](https://react.dev/reference/react/Component) လိုမျိုး ([စာရင်းအပြည့်အစုံကို ဒီမှာ ကြည့်ပါ](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Function တစ်ခုက pure ဖြစ်ရင် — သူ့ကို နှစ်ကြိမ် run လုပ်တာက — သူ့ရဲ့ အပြုအမူကို မပြောင်းလဲစေပါဘူး — ဘာလို့လဲဆိုတော့ — pure function တစ်ခုက ရလဒ်တူညီတာကိုပဲ အကြိမ်တိုင်း ထုတ်လုပ်လို့ပါ။ ဒါပေမယ့် — function တစ်ခုက impure ဖြစ်နေရင် (ဥပမာ — သူလက်ခံရတဲ့ data ကို mutate လုပ်တာမျိုး) — သူ့ကို နှစ်ကြိမ် run လုပ်တာက သိသာလာပါတယ် (ဒါကြောင့်ပဲ သူ impure ဖြစ်နေတာပါ!) ဒါက bug ကို စောစီးစွာ သတိပြုမိပြီး ပြုပြင်နိုင်စေပါတယ်။

**Strict Mode မှာ double rendering က သင့်ကို bugs တွေ စောစီးစွာ ရှာဖွေတွေ့ရှိစေပုံကို ပြဖို့ ဥပမာတစ်ခု ဒီမှာပါ။**

ဒီ `StoryTray` component က `stories` array တစ်ခုကို လက်ခံပြီး — အဆုံးမှာ "Create Story" item တစ်ခု ထပ်ထည့်ပါတယ်:

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

အထက်က code ထဲမှာ အမှားတစ်ခု ရှိပါတယ်။ ဒါပေမယ့် — ကနဦး output က မှန်နေပုံရလို့ — သတိထားမိဖို့ လွယ်မလွယ် ဆိုတာက ပြဿနာပါ။

ဒီအမှားက — `StoryTray` component ကို အကြိမ်များစွာ re-render လုပ်လိုက်ရင် — ပိုပြီး သိသာလာပါလိမ့်မယ်။ ဥပမာ — သူ့အပေါ် hover လုပ်တိုင်း — `StoryTray` ကို နောက်ခံအရောင် မတူညီတာနဲ့ re-render လုပ်ကြည့်ရအောင်:

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

`StoryTray` component ပေါ်မှာ hover လုပ်တိုင်း — "Create Story" က list ထဲကို နောက်တစ်ကြိမ် ထပ်ဝင်သွားတာ သတိပြုပါ။ Code ရဲ့ ရည်ရွယ်ချက်က — အဆုံးမှာ တစ်ခါပဲ ထည့်ဖို့ပါ။ ဒါပေမယ့် — `StoryTray` က props ကနေ ရတဲ့ `stories` array ကို တိုက်ရိုက် ပြုပြင်နေပါတယ်။ `StoryTray` render လုပ်တိုင်း — array တစ်ခုတည်းရဲ့ အဆုံးမှာ "Create Story" ကို နောက်တစ်ကြိမ် ထပ်ထည့်ပါတယ်။ တစ်နည်းပြောရရင် — `StoryTray` က pure function မဟုတ်ပါဘူး — သူ့ကို အကြိမ်များစွာ run လုပ်တာက ရလဒ် မတူညီတာတွေ ထုတ်လုပ်လို့ပါ။

ဒီပြဿနာကို ပြုပြင်ဖို့ — array ရဲ့ copy တစ်ခုကို ဖန်တီးပြီး — မူရင်း မဟုတ်ဘဲ — အဲဒီ copy ကို ပြုပြင်နိုင်ပါတယ်:

```js
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

ဒါက [`StoryTray` function ကို pure ဖြစ်စေပါလိမ့်မယ်](/docs/react/keeping-components-pure)။ သူ့ကို ခေါ်တိုင်း — array ရဲ့ copy အသစ်တစ်ခုကိုပဲ ပြုပြင်ပြီး — external objects ဒါမှမဟုတ် variables တွေကို မထိခိုက်စေပါဘူး။ ဒါက bug ကို ဖြေရှင်းပေးပါတယ် — ဒါပေမယ့် — component ကို မကြာခဏ re-render လုပ်မှ — သူ့ရဲ့ အပြုအမူမှာ တစ်ခုခု မှားနေတာ သိသာလာမှာပါ။

**မူရင်း ဥပမာမှာ — bug က သိသာမှု မရှိပါဘူး။ အခု — မူရင်း (bug ရှိတဲ့) code ကို `<StrictMode>` ထဲ ထုပ်ကြည့်ရအောင်:**

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

**Strict Mode က သင့် rendering function ကို *အမြဲတမ်း* နှစ်ကြိမ် ခေါ်လို့ — အမှားကို ချက်ချင်း မြင်ရပါတယ်** ("Create Story" က နှစ်ခါ ပေါ်နေပါလိမ့်မယ်)။ ဒါက ဒီလို အမှားမျိုးတွေကို လုပ်ငန်းစဉ် အစောပိုင်းမှာ သတိပြုမိစေပါတယ်။ Strict Mode မှာ render ဖြစ်အောင် သင့် component ကို ပြုပြင်လိုက်တဲ့အခါ — အရင်က hover functionality လိုမျိုး — နောင် production bugs တွေ အများကြီးကိုပါ *တစ်ပါတည်း* ပြုပြင်ပြီးသား ဖြစ်သွားပါတယ်:

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

Strict Mode မရှိရင် — re-render တွေ ထပ်မထည့်မချင်း — bug ကို သတိမထားမိဘဲ လွတ်သွားနိုင်ပါတယ်။ Strict Mode က အဲဒီ bug ကို ချက်ချင်း ပေါ်လာစေပါတယ်။ Strict Mode က သင့်ကို — bugs တွေကို — team နဲ့ user တွေဆီ မရောက်ခင် — ရှာဖွေတွေ့ရှိစေပါတယ်။

[Components တွေကို pure ဖြစ်အောင် ထားခြင်းအကြောင်း ပိုဖတ်ပါ။](/docs/react/keeping-components-pure)

> **မှတ်ချက်:** [React DevTools](https://react.dev/learn/react-developer-tools) တပ်ဆင်ထားရင် — ဒုတိယ render ခေါ်ဆိုမှုအတွင်း ဖြစ်ပေါ်တဲ့ `console.log` calls တွေက — နည်းနည်း မှိန်ဖျော့နေပါလိမ့်မယ်။ React DevTools မှာ သူတို့ကို လုံးဝ ဖိနှိပ်ဖို့ setting တစ်ခုလည်း ရှိပါတယ် (default အားဖြင့် ပိတ်ထားတယ်)။


### Development မှာ Effects တွေကို ပြန် run ခြင်းကြောင့် တွေ့ရတဲ့ Bugs တွေကို ပြုပြင်ခြင်း

Strict Mode က [Effects](/docs/react/synchronizing-with-effects) တွေထဲက bugs တွေကို ရှာဖွေဖို့လည်း ကူညီနိုင်ပါတယ်။

Effect တိုင်းမှာ setup code တစ်ချို့ ရှိပြီး — cleanup code တစ်ချို့လည်း ရှိနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — component တစ်ခု *mount* ဖြစ်တဲ့အခါ (screen ပေါ် ထည့်လိုက်တဲ့အခါ) — React က setup ကို ခေါ်ပြီး — component *unmount* ဖြစ်တဲ့အခါ (screen ကနေ ဖယ်လိုက်တဲ့အခါ) — cleanup ကို ခေါ်ပါတယ်။ ပြီးရင် — သူ့ရဲ့ dependencies တွေက နောက်ဆုံး render ကတည်းက ပြောင်းသွားရင် — React က cleanup ရော setup ပါ နောက်တစ်ကြိမ် ခေါ်ပါတယ်။

Strict Mode ဖွင့်ထားတဲ့အခါ — React က **Effect တိုင်းအတွက် — development မှာ setup+cleanup သံသရာ တစ်ခု အပိုထပ်လည်း run** ပါလိမ့်မယ်။ ဒါက အံ့သြစရာ ဖြစ်နိုင်ပေမယ့် — ကိုယ်တိုင် ဖမ်းဖို့ ခက်တဲ့ — သိမ်မွေ့တဲ့ bugs တွေကို ဖော်ထုတ်ဖို့ ကူညီပါတယ်။

**Strict Mode မှာ Effects တွေကို ပြန် run ခြင်းက သင့်ကို bugs တွေ စောစီးစွာ ရှာဖွေတွေ့ရှိစေပုံကို ပြဖို့ ဥပမာတစ်ခု ဒီမှာပါ။**

Component တစ်ခုကို chat တစ်ခုနဲ့ ချိတ်ဆက်ပေးတဲ့ ဒီဥပမာကို စဉ်းစားကြည့်ပါ:

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

ဒီ code မှာ ပြဿနာတစ်ခု ရှိပေမယ့် — ချက်ချင်းတော့ မထင်ရှားနိုင်ပါဘူး။

ပြဿနာကို ပိုသိသာစေဖို့ — feature တစ်ခု အကောင်အထည်ဖော်ကြည့်ရအောင်။ အောက်က ဥပမာမှာ — `roomId` က hardcode မလုပ်ထားပါဘူး။ အဲဒီအစား — user က dropdown ကနေ ချိတ်ဆက်ချင်တဲ့ `roomId` ကို ရွေးလို့ရပါတယ်။ "Open chat" ကို နှိပ်ပြီး — chat room တွေကို တစ်ခုပြီးတစ်ခု ရွေးကြည့်ပါ။ Console ထဲမှာ active connections အရေအတွက်ကို ခြေရာခံကြည့်ပါ:

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

ဖွင့်ထားတဲ့ connections အရေအတွက်က အမြဲတမ်း တိုးနေတာ သတိပြုမိပါလိမ့်မယ်။ Real app တစ်ခုမှာ — ဒါက performance နဲ့ network ပြဿနာတွေ ဖြစ်စေပါလိမ့်မယ်။ ပြဿနာက [သင့် Effect မှာ cleanup function တစ်ခု ပျောက်နေလို့ပါ:](/docs/react/synchronizing-with-effects)

```js
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

အခု သင့် Effect က သူ့နောက်ကိုယ်တိုင် "ရှင်းလင်း" ပြီး — အသုံးမဝင်တော့တဲ့ connections တွေကို ဖျက်ဆီးလို့ — leak က ဖြေရှင်းပြီးပါပြီ။ ဒါပေမယ့် — သတိပြုစရာက — ပြဿနာက — features တွေ (select box) ထပ်ထည့်တဲ့အထိ — မပေါ်လွင်ခဲ့ဘူးဆိုတာပါ။

**မူရင်း ဥပမာမှာ — bug က သိသာမှု မရှိပါဘူး။ အခု — မူရင်း (bug ရှိတဲ့) code ကို `<StrictMode>` ထဲ ထုပ်ကြည့်ရအောင်:**

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

**Strict Mode နဲ့ဆိုရင် — ပြဿနာရှိတာ ချက်ချင်း မြင်ရပါတယ်** (active connections အရေအတွက်က 2 ဆီ ခုန်တက်သွားတာပါ)။ Strict Mode က Effect တိုင်းအတွက် setup+cleanup သံသရာ တစ်ခု အပိုထပ် run ပါတယ်။ ဒီ Effect မှာ cleanup logic မရှိတာမို့ — connection အပိုတစ်ခု ဖန်တီးလိုက်ပေမယ့် — ဖျက်ဆီးမလိုက်ပါဘူး။ ဒါက — သင်မှာ cleanup function တစ်ခု ပျောက်နေတယ်ဆိုတဲ့ အရိပ်အမြွက်ပါ။

Strict Mode က ဒီလို အမှားမျိုးတွေကို လုပ်ငန်းစဉ် အစောပိုင်းမှာ သတိပြုမိစေပါတယ်။ Strict Mode မှာ cleanup function တစ်ခု ထည့်ပြီး သင့် Effect ကို ပြုပြင်လိုက်တဲ့အခါ — အရင်က select box လိုမျိုး — နောင် production bugs တွေ အများကြီးကိုပါ *တစ်ပါတည်း* ပြုပြင်ပြီးသား ဖြစ်သွားပါတယ်:

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

Console ထဲက active connection အရေအတွက်က — နောက်တော့ — မတိုးတော့တာ သတိပြုပါ။

Strict Mode မရှိရင် — သင့် Effect မှာ cleanup လိုအပ်နေတာကို လွယ်လွယ်နဲ့ လွတ်သွားနိုင်ပါတယ်။ Development မှာ သင့် Effect အတွက် — *setup* အစား — *setup → cleanup → setup* run လုပ်ပေးခြင်းဖြင့် — Strict Mode က cleanup logic ပျောက်နေတာကို ပိုသိသာစေပါတယ်။

[Effect cleanup အကောင်အထည်ဖော်ခြင်းအကြောင်း ပိုဖတ်ပါ။](/docs/react/synchronizing-with-effects)

### Development မှာ Ref Callbacks တွေကို ပြန် run ခြင်းကြောင့် တွေ့ရတဲ့ Bugs တွေကို ပြုပြင်ခြင်း

Strict Mode က [callback refs](/docs/react/manipulating-the-dom-with-refs) တွေထဲက bugs တွေကို ရှာဖွေဖို့လည်း ကူညီနိုင်ပါတယ်။

Callback `ref` တိုင်းမှာ setup code တစ်ချို့ ရှိပြီး — cleanup code တစ်ချို့လည်း ရှိနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — element တစ်ခုကို *ဖန်တီး* တဲ့အခါ (DOM ထဲ ထည့်လိုက်တဲ့အခါ) — React က setup ကို ခေါ်ပြီး — element ကို *ဖယ်ရှား* တဲ့အခါ (DOM ကနေ ထုတ်လိုက်တဲ့အခါ) — cleanup ကို ခေါ်ပါတယ်။

Strict Mode ဖွင့်ထားတဲ့အခါ — React က **callback `ref` တိုင်းအတွက် — development မှာ setup+cleanup သံသရာ တစ်ခု အပိုထပ်လည်း run** ပါလိမ့်မယ်။ ဒါက အံ့သြစရာ ဖြစ်နိုင်ပေမယ့် — ကိုယ်တိုင် ဖမ်းဖို့ ခက်တဲ့ — သိမ်မွေ့တဲ့ bugs တွေကို ဖော်ထုတ်ဖို့ ကူညီပါတယ်။

တိရစ္ဆာန်တစ်ကောင်ကို ရွေးပြီး — သူတို့ထဲက တစ်ကောင်ဆီ scroll လုပ်ခွင့်ပြုတဲ့ ဒီဥပမာကို စဉ်းစားကြည့်ပါ။ "Cats" ကနေ "Dogs" ကို ပြောင်းလိုက်တဲ့အခါ — console logs တွေက list ထဲက တိရစ္ဆာန် အရေအတွက် တိုးနေပြီး — "Scroll to" buttons တွေ အလုပ်မလုပ်တော့တာ သတိပြုပါ:

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

**ဒါက production bug တစ်ခုပါ!** Ref callback က cleanup ထဲမှာ list ကနေ တိရစ္ဆာန်တွေကို မဖယ်ရှားလို့ — တိရစ္ဆာန် list က တိုးလာနေပါတယ်။ ဒါက real app တစ်ခုမှာ performance ပြဿနာတွေ ဖြစ်စေနိုင်တဲ့ — memory leak တစ်ခုဖြစ်ပြီး — app ရဲ့ အပြုအမူကိုပါ ချိုးဖျက်ပါတယ်။

ပြဿနာက ref callback က သူ့နောက်ကိုယ်တိုင် cleanup မလုပ်တာပါ:

```js
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

အခု — မူရင်း (bug ရှိတဲ့) code ကို `<StrictMode>` ထဲ ထုပ်ကြည့်ရအောင်:

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

**Strict Mode နဲ့ဆိုရင် — ပြဿနာရှိတာ ချက်ချင်း မြင်ရပါတယ်**။ Strict Mode က callback ref တိုင်းအတွက် setup+cleanup သံသရာ တစ်ခု အပိုထပ် run ပါတယ်။ ဒီ callback ref မှာ cleanup logic မရှိတာမို့ — refs တွေကို ထည့်ပေမယ့် — ဖယ်ရှားမလိုက်ပါဘူး။ ဒါက — သင်မှာ cleanup function တစ်ခု ပျောက်နေတယ်ဆိုတဲ့ အရိပ်အမြွက်ပါ။

Strict Mode က callback refs တွေထဲက အမှားတွေကို စေ့စေ့စပ်စပ် ရှာဖွေတွေ့ရှိစေပါတယ်။ Strict Mode မှာ cleanup function တစ်ခု ထည့်ပြီး သင့် callback ကို ပြုပြင်လိုက်တဲ့အခါ — အရင်က "Scroll to" bug လိုမျိုး — နောင် production bugs တွေ အများကြီးကိုပါ *တစ်ပါတည်း* ပြုပြင်ပြီးသား ဖြစ်သွားပါတယ်:

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

အခု — StrictMode ထဲမှာ ကနဦး mount လုပ်တဲ့အခါ — ref callbacks တွေ အားလုံးက — setup လုပ်၊ cleanup လုပ်၊ ပြီးတော့ နောက်တစ်ကြိမ် setup လုပ်ပါတယ်:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**ဒါက မျှော်လင့်ထားတာပါ။** Strict Mode က ref callbacks တွေ မှန်ကန်စွာ cleanup လုပ်နေကြောင်း အတည်ပြုပေးလို့ — အရေအတွက်က မျှော်လင့်ထားတာထက် ဘယ်တော့မှ မတိုးပါဘူး။ ပြုပြင်ပြီးတဲ့အခါ — memory leaks တွေ မရှိတော့ဘဲ — features တွေ အားလုံး မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်ပါတယ်။

Strict Mode မရှိရင် — app ကို နေရာအနှံ့ နှိပ်ကြည့်ပြီး — features တွေ ပျက်နေတာ သတိထားမိသည်အထိ — bug ကို လွယ်လွယ်နဲ့ လွတ်သွားနိုင်ပါတယ်။ Strict Mode က bugs တွေကို — production ဆီ မရောက်ခင် — ချက်ချင်း ပေါ်လာစေပါတယ်။

### Strict Mode က ဖွင့်ပေးတဲ့ Deprecation Warnings တွေကို ပြုပြင်ခြင်း

React က — `<StrictMode>` tree တစ်ခုထဲက component တစ်ခုခုက ဒီ deprecated APIs တွေထဲက တစ်ခုခုကို သုံးနေရင် — warning ထုတ်ပေးပါတယ်:

- [`UNSAFE_componentWillMount`](https://react.dev/reference/react/Component) လိုမျိုး `UNSAFE_` class lifecycle methods တွေ။ [အခြားရွေးချယ်စရာတွေကို ဒီမှာ ကြည့်ပါ။](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

ဒီ APIs တွေကို အဓိကအားဖြင့် [class components](/docs/react/describing-ui) အဟောင်းတွေမှာ သုံးလို့ — ခေတ်မီ apps တွေမှာ ရှားပါးပါတယ်။
