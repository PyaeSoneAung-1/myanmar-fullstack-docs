---
title: "createPortal"
description: "React children တွေကို DOM ရဲ့ တခြားအစိတ်အပိုင်းတစ်ခုမှာ render လုပ်နိုင်စေတဲ့ react-dom API — modal/tooltip လို UI တွေကို parent ရဲ့ အပြင်ဘက်ကို ပို့ဆောင်ခြင်း — parameters/returns/caveats များနဲ့ အသုံးပြုပုံ"
order: 71
source: "https://react.dev/reference/react-dom/createPortal"
status: translated
updated: 2026-09-02
---

`createPortal` ဆိုတာ — children တချို့ကို DOM ရဲ့ ကွဲပြားတဲ့ အစိတ်အပိုင်းတစ်ခုမှာ render လုပ်နိုင်စေတဲ့ react-dom API တစ်ခုပါ။

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

## ရည်ညွှန်းချက် (Reference)

### `createPortal(children, domNode, key?)`

Portal တစ်ခု ဖန်တီးဖို့ — JSX တချို့ နဲ့ သူ့ကို render လုပ်ချင်တဲ့ DOM node ကို ပေးပြီး `createPortal` ကို ခေါ်ပါတယ်:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

Portal က DOM node ရဲ့ ရုပ်ပိုင်းဆိုင်ရာ နေရာချထားမှုကိုပဲ ပြောင်းပေးပါတယ်။ တခြား နည်းလမ်းတိုင်းမှာ — portal ထဲ render လုပ်ထားတဲ့ JSX က သူ့ကို render လုပ်နေတဲ့ React component ရဲ့ child node အနေနဲ့ပဲ ပြုမူပါတယ်။ ဥပမာ — child က parent tree က ပေးထားတဲ့ context ကို သုံးနိုင်ပြီး — events တွေက React tree အတိုင်း children ကနေ parents ဆီကို ပျံ့နှံ့ (bubble) သွားပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `children` — React နဲ့ render လုပ်လို့ရတာ ဘာမဆို — ဥပမာ JSX တစ်ပိုင်း (`<div />` ဒါမှမဟုတ် `<SomeComponent />`), [Fragment](https://react.dev/reference/react/Fragment) (`<>...</>`), string ဒါမှမဟုတ် number, ဒါမှမဟုတ် ဒါတွေရဲ့ array တစ်ခု။
- `domNode` — `document.getElementById()` လိုနေရာတွေက ရတဲ့ DOM node တစ်ခုခု။ Node က အရင်ကတည်းက တည်ရှိပြီးသား ဖြစ်ရပါမယ်။ Update အတွင်းမှာ ကွဲပြားတဲ့ DOM node တစ်ခုကို ပေးလိုက်ရင် — portal content ကို ပြန်ဖန်တီး (recreate) လုပ်ခံရပါလိမ့်မယ်။
- **optional** `key` — portal ရဲ့ [key](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) အဖြစ် သုံးမယ့် ထူးခြားတဲ့ string ဒါမှမဟုတ် number တစ်ခု။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`createPortal` က JSX ထဲ ထည့်လို့ရတဲ့ ဒါမှမဟုတ် React component တစ်ခုကနေ ပြန်ပေးလို့ရတဲ့ React node တစ်ခုကို ပြန်ပေးပါတယ်။ React က ဒါကို render output ထဲမှာ တွေ့ရင် — ပေးထားတဲ့ `children` တွေကို ပေးထားတဲ့ `domNode` ရဲ့ အတွင်းမှာ ထားပေးပါလိမ့်မယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Portal ကနေ ထွက်လာတဲ့ events တွေက DOM tree အတိုင်း မဟုတ်ဘဲ — React tree အတိုင်း ပျံ့နှံ့ပါတယ်။ ဥပမာ — portal ရဲ့ အတွင်းမှာ click လုပ်ပြီး portal ကို `<div onClick>` နဲ့ ထုပ်ထားရင် — အဲဒီ `onClick` handler က fire ဖြစ်ပါတယ်။ ဒါက ပြဿနာ ဖြစ်စေရင် — portal ရဲ့ အတွင်းကနေ event propagation ကို ရပ်လိုက်ပါ ဒါမှမဟုတ် portal ကိုယ်တိုင်ကို React tree ထဲမှာ အပေါ်ဆီ ရွှေ့လိုက်ပါ။

## အသုံးပြုပုံ (Usage)

### DOM ရဲ့ တခြားအစိတ်အပိုင်းတစ်ခုကို Render လုပ်ခြင်း (Rendering to a different part of the DOM)

*Portals* တွေက သင့် components တွေကို — သူတို့ရဲ့ children တချို့ကို DOM ရဲ့ တခြားနေရာတစ်ခုမှာ render လုပ်ခွင့် ပေးပါတယ်။ ဒါက component ရဲ့ အစိတ်အပိုင်းတစ်ခုကို — ဘယ် containers တွေထဲမှာပဲ ရှိနေနေ — အဲဒီကနေ "လွတ်မြောက်" အောင် လုပ်ပေးနိုင်ပါတယ်။ ဥပမာ — component တစ်ခုက စာမျက်နှာရဲ့ ကျန်အပိုင်းတွေရဲ့ အပေါ်နဲ့ အပြင်ဘက်မှာ ပေါ်နေတဲ့ modal dialog ဒါမှမဟုတ် tooltip တစ်ခုကို ပြနိုင်ပါတယ်။

Portal တစ်ခု ဖန်တီးဖို့ — `createPortal` ရဲ့ ရလဒ်ကို — JSX တစ်ပိုင်း နဲ့ သူသွားရောက်ရမယ့် DOM node တစ်ခု ပေါင်းပြီး render လုပ်ပါ:

```js
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React က — သင်ပေးလိုက်တဲ့ JSX ရဲ့ DOM nodes တွေကို သင်ပေးလိုက်တဲ့ DOM node ရဲ့ အတွင်းမှာ ထားပေးပါလိမ့်မယ်။

Portal မရှိရင် — ဒုတိယ `<p>` က parent `<div>` ရဲ့ အတွင်းမှာ ရှိနေမှာ ဖြစ်ပေမယ့် — portal က သူ့ကို [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) ထဲကို "teleport" (ပို့ဆောင်) လုပ်လိုက်ပါတယ်။ ဒုတိယ paragraph က border ပါတဲ့ parent `<div>` ရဲ့ အပြင်ဘက်မှာ ပေါ်နေတာ သတိထားမိပါလိမ့်မယ်။ Developer tools နဲ့ DOM structure ကို စစ်ကြည့်ရင် — ဒုတိယ `<p>` က `<body>` ထဲကို တိုက်ရိုက် ရောက်သွားတာ တွေ့ရပါလိမ့်မယ်:

```html
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

အထက်မှာ ပြောခဲ့သလို — portal က DOM node ရဲ့ ရုပ်ပိုင်းဆိုင်ရာ နေရာချထားမှုကိုပဲ ပြောင်းပေးတာ ဖြစ်ပြီး — portal ထဲ render လုပ်ထားတဲ့ JSX က တခြား နည်းလမ်းတိုင်းမှာ သူ့ကို render လုပ်နေတဲ့ component ရဲ့ child အနေနဲ့ပဲ ပြုမူပါတယ်။ (context သုံးလို့ရတာ၊ events တွေ React tree အတိုင်း bubble လုပ်တာ အပါအဝင်။)

### Portal တစ်ခုနဲ့ Modal Dialog တစ်ခုကို Render လုပ်ခြင်း (Rendering a modal dialog with a portal)

Portal ကို သုံးပြီး — စာမျက်နှာရဲ့ ကျန်အပေါ်မှာ ပေါ်နေတဲ့ modal dialog တစ်ခုကို ဖန်တီးနိုင်ပါတယ် — dialog ကို ခေါ်လိုက်တဲ့ component က `overflow: hidden` ဒါမှမဟုတ် dialog ကို အနှောင့်အယှက် ဖြစ်စေနိုင်တဲ့ တခြား style တွေပါတဲ့ container ထဲမှာ ရှိနေရင်တောင် ဖြစ်ပါတယ်။

ဥပမာအဖြစ် — container နှစ်ခုလုံးမှာ modal dialog ကို ဖျက်ဆီးတဲ့ style တွေ ရှိပြီး — portal ထဲ render လုပ်ထားတဲ့ တစ်ခုကတော့ မထိခိုက်ပါဘူး — ဘာလို့လဲဆိုတော့ DOM ထဲမှာ modal က parent JSX elements တွေရဲ့ အတွင်းမှာ မပါဝင်တော့လို့ပါ။

```js
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

(Modal မပါဘဲ ပြထားတဲ့ version ကတော့ — portal မရှိတဲ့အတွက် `overflow: hidden` container ရဲ့ အတွင်းမှာ ညှပ်နေခံရလို့ dialog က ဖြတ်ခံရတာကို ပြတာပါ — `PortalExample` ကသာ portal ကို သုံးထားလို့ ကောင်းကောင်း ပေါ်ပါတယ်။)

> **သတိပြုရန်** — Portals တွေ သုံးတဲ့အခါ သင့် app က accessibility (လူတိုင်း အသုံးပြုနိုင်မှု) ရှိအောင် သေချာလုပ်ဖို့ အရေးကြီးပါတယ်။ ဥပမာ — user က portal ထဲကို သဘာဝကျကျ ဝင်ထွက်နိုင်ဖို့ keyboard focus ကို စီမံဖို့ လိုနိုင်ပါတယ်။ Modal တွေ ဖန်တီးတဲ့အခါ [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) ကို လိုက်နာပါ။ Community package တစ်ခု သုံးရင် — အဲဒါက accessible ဖြစ်ပြီး ဒီ guidelines တွေကို လိုက်နာကြောင်း သေချာအောင် လုပ်ပါ။

### React Components တွေကို React မဟုတ်တဲ့ Server Markup ထဲမှာ Render လုပ်ခြင်း (Rendering React components into non-React server markup)

Portals တွေက — သင့် React root က React နဲ့ မဆောက်ထားတဲ့ static ဒါမှမဟုတ် server-rendered စာမျက်နှာတစ်ခုရဲ့ အစိတ်အပိုင်းတစ်ခုပဲ ဆိုရင် အသုံးဝင်ပါတယ်။ ဥပမာ — သင့် page ကို Rails လို server framework နဲ့ တည်ဆောက်ထားရင် — sidebar တွေလို static နေရာတွေအတွင်းမှာ interactivity ရှိတဲ့ နေရာတွေ ဖန်တီးနိုင်ပါတယ်။ [React root အများကြီး သပ်သပ်စီ ထားရှိခြင်း](https://react.dev/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) နဲ့ ယှဉ်ရင် — portals တွေက app ရဲ့ အစိတ်အပိုင်းတွေ DOM ရဲ့ နေရာအမျိုးမျိုးမှာ render ဖြစ်နေပေမယ့် — state ကို အတူတူ မျှဝေတဲ့ React tree တစ်ခုတည်းအနေနဲ့ သဘောထားနိုင်စေပါတယ်။

ဥပမာ — React မဟုတ်တဲ့ server markup ထဲက `#sidebar-content` div ထဲကို React component တစ်ခု portal နဲ့ ပို့လိုက်တာ:

```js
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

ဒီမှာ `#root` ထဲကို `createRoot` နဲ့ React ကို mount လုပ်ထားပြီး — page ရဲ့ တခြား အစိတ်အပိုင်းတွေ (header, sidebar markup) က server ကနေ လာတာပါ။ `SidebarContent` ကတော့ portal ကတစ်ဆင့် — server ရဲ့ sidebar markup ထဲက `#sidebar-content` နေရာမှာ render ဖြစ်ပါတယ်။

### React Components တွေကို React မဟုတ်တဲ့ DOM Nodes တွေထဲမှာ Render လုပ်ခြင်း (Rendering React components into non-React DOM nodes)

React ရဲ့ အပြင်ဘက်မှာ စီမံခန့်ခွဲခံနေရတဲ့ DOM node တစ်ခုရဲ့ content ကို စီမံဖို့လည်း portal ကို သုံးနိုင်ပါတယ်။ ဥပမာ — React မဟုတ်တဲ့ map widget တစ်ခုနဲ့ ပေါင်းစည်းပြီး — popup တစ်ခုရဲ့ အတွင်းမှာ React content ကို render လုပ်ချင်တယ်ဆိုပါစို့။ ဒါလုပ်ဖို့ — render လုပ်မယ့် DOM node ကို သိမ်းထားဖို့ `popupContainer` state variable တစ်ခု ကြေညာပါ:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Third-party widget ကို ဖန်တီးတဲ့အခါ — widget က ပြန်ပေးတဲ့ DOM node ကို သိမ်းထားလိုက်ပါ:

```js
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

ဒါက — `popupContainer` ရနိုင်တာနဲ့ `createPortal` ကို သုံးပြီး React content တွေကို အဲဒီထဲ render လုပ်နိုင်စေပါတယ်:

```js
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

ဒီဥပမာ အပြည့်အစုံမှာ — `App.js` က map ကို ဖန်တီးပြီး portal နဲ့ popup content ကို render လုပ်ပြီး — `map-widget.js` က `createMapWidget` နဲ့ `addPopupToMapWidget` functions တွေကို သတ်မှတ်ပေးထားပါတယ် (Leaflet လို map library ကို သုံးပြီး popup ထဲက div တစ်ခုကို React ရဲ့ လက်ထဲ ပြန်ပေးတဲ့ပုံစံပါ)။
