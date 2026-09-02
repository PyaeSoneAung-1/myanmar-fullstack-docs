---
title: "Built-in Components (React DOM)"
description: "<div> လို built-in React DOM components တွေ အားလုံး ထောက်ပံ့တဲ့ common props နဲ့ events များ — children/ref/style/dangerouslySetInnerHTML၊ standard DOM props နဲ့ event handlers၊ ref callback function နဲ့ React event object"
order: 47
source: "https://react.dev/reference/react-dom/components/common"
status: translated
updated: 2026-09-02
---

[`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) လိုမျိုး built-in browser components တွေ အားလုံးက — common props နဲ့ events တချို့ကို ထောက်ပံ့ပေးပါတယ်။

```js
<div className="wrapper">Some content</div>
```

> **မှတ်ချက်:** `<input>`၊ `<select>`၊ `<textarea>`၊ `<option>`၊ `<progress>`၊ `<form>`၊ `<link>`၊ `<meta>`၊ `<script>`၊ `<style>` နဲ့ `<title>` လိုမျိုး components တချို့ကိုတော့ — သူတို့ရဲ့ ကိုယ်ပိုင် props တွေ (ဥပမာ `<input>`/`<select>`/`<textarea>` တွေရဲ့ `value`၊ `onChange`၊ `autoFocus` စသည်) နဲ့အတူ သီးခြား reference pages တွေမှာ မှတ်တမ်းတင်ထားပါတယ်။ ဒီစာမျက်နှာကတော့ built-in components အားလုံးနဲ့ သက်ဆိုင်တဲ့ common props/events တွေကို ဖော်ပြပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### Common Components (ဥပမာ `<div>`)

#### React Special Props

Built-in components တွေ အားလုံးအတွက် ဒီ React props တွေကို ထောက်ပံ့ပေးပါတယ်:

- `children`: Component ရဲ့ အတွင်းက content ကို သတ်မှတ်တဲ့ React node တစ်ခု (element၊ string၊ number၊ portal၊ `null`/`undefined`/boolean လို empty node တွေ ဒါမှမဟုတ် React nodes တွေရဲ့ array)။ JSX သုံးတဲ့အခါ — `<div><span /></div>` လို tags တွေ ထပ်တန်းထားခြင်းဖြင့် `children` prop ကို သွယ်ဝိုက်ပြီး သတ်မှတ်လေ့ ရှိပါတယ်။
- `dangerouslySetInnerHTML`: အတွင်းမှာ raw HTML string တစ်ခု ပါတဲ့ `{ __html: '<p>some html</p>' }` ပုံစံ object တစ်ခု။ DOM node ရဲ့ [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property ကို ကျော်ပြီး ပေးထားတဲ့ HTML ကို ပြသပါတယ်။ **ဒါကို အလွန် သတိထားသုံးရပါတယ်!** HTML က ယုံကြည်ရတဲ့ အရင်းအမြစ်ကနေ မဟုတ်ဘူးဆိုရင် (ဥပမာ — user data ကို အခြေခံထားရင်) — [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability တစ်ခု ဖြစ်စေနိုင်ပါတယ်။
- `ref`: [`useRef`](/docs/react/use-ref) ဒါမှမဟုတ် `createRef` ကနေ ရတဲ့ ref object တစ်ခု၊ [ref callback function](#ref-callback-function) တစ်ခု ဒါမှမဟုတ် legacy refs အတွက် string တစ်ခု။ Ref ထဲကို ဒီ node ရဲ့ DOM element နဲ့ ဖြည့်ပေးပါတယ်။
- `suppressContentEditableWarning`: Boolean တစ်ခု။ `true` ဆိုရင် — `children` နဲ့ `contentEditable={true}` (ပုံမှန်အားဖြင့် အတူ အလုပ်မလုပ်တဲ့) နှစ်ခုလုံး ရှိတဲ့ elements တွေအတွက် React ပြတဲ့ warning ကို ဖိနှိပ်ပေးပါတယ်။ `contentEditable` content ကို ကိုယ်တိုင် စီမံတဲ့ text input library တစ်ခု တည်ဆောက်နေရင် သုံးပါ။
- `suppressHydrationWarning`: Boolean တစ်ခု။ Server rendering သုံးရင် — server နဲ့ client က မတူတဲ့ content တွေ render လုပ်တဲ့အခါ ပုံမှန်အားဖြင့် warning ရပါတယ်။ Timestamps လိုမျိုး ရှားရှားပါးပါး case တွေမှာ အတိအကျ ကိုက်အောင် လုပ်ဖို့ မဖြစ်နိုင်သလောက်ပါ — ဒီ prop ကို `true` လုပ်ထားရင် အဲဒီ element ရဲ့ attributes/content mismatch တွေအတွက် React က warning မပြတော့ပါဘူး။ ဒါက အလွှာ တစ်ခုထဲမှာပဲ အလုပ်လုပ်ပြီး escape hatch တစ်ခုအနေနဲ့ပဲ သုံးသင့်ပါတယ်။
- `style`: CSS styles ပါတဲ့ object တစ်ခု — ဥပမာ `{ fontWeight: 'bold', margin: 20 }`။ DOM ရဲ့ [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property လိုပဲ — CSS property names တွေကို `font-weight` အစား `fontWeight` လို `camelCase` နဲ့ ရေးရပြီး — values တွေက string ဒါမှမဟုတ် number ဖြစ်နိုင်ပါတယ်။ Number တစ်ခု (ဥပမာ `width: 100`) ပေးရင် — unitless property တစ်ခု မဟုတ်ရင် React က `px` ကို အလိုအလျောက် ပေါင်းပေးပါတယ်။ `style` ကို ရှေ့ကတည်းက မသိနိုင်တဲ့ dynamic styles တွေအတွက်ပဲ သုံးဖို့ အကြံပြုပြီး — တခြား case တွေမှာ `className` နဲ့ CSS classes သုံးတာ ပိုထိရောက်ပါတယ်။

#### Standard DOM Props

ဒီ standard DOM props တွေကိုလည်း built-in components အားလုံးအတွက် ထောက်ပံ့ပေးပါတယ်:

- `accessKey` — element ရဲ့ keyboard shortcut (ယေဘုယျအားဖြင့် အကြံမပြုပါ)။
- `aria-*` — accessibility tree အချက်အလက် သတ်မှတ်တဲ့ ARIA attributes (React မှာ HTML နဲ့ နာမည် အတူတူပါ)။
- `autoCapitalize` — user input ကို စာလုံးကြီး/သေး ဘယ်လို ပြောင်းရမလဲ သတ်မှတ်ပါတယ်။
- `className` — element ရဲ့ CSS class name (HTML ရဲ့ `class` attribute နေရာမှာ သုံးတာပါ)။
- `contentEditable` — `true` ဆိုရင် browser က element ကို user က တိုက်ရိုက် တည်းဖြတ်ခွင့် ပေးပါတယ် ([Lexical](https://lexical.dev/) လို rich text input libraries တွေမှာ သုံးပါတယ်)။ `contentEditable={true}` ရှိတဲ့ element ဆီ React children တွေ ပို့ရင် — React က user တည်းဖြတ်ပြီးနောက် content ကို update မလုပ်နိုင်လို့ warning ပြပါတယ်။
- `data-*` — element ဆီ string data တချို့ တွဲဖို့ (ဥပမာ `data-fruit="banana"`) — React မှာတော့ props/state ကနေ ဖတ်လေ့ရှိလို့ သိပ်မသုံးပါဘူး။
- `dir` — `'ltr'` ဒါမှမဟုတ် `'rtl'` — element ရဲ့ စာလုံး ဦးတည်ချက်။
- `draggable` — element ကို ဆွဲယူလို့ရမရ သတ်မှတ်တဲ့ boolean (HTML Drag and Drop API ရဲ့ အစိတ်အပိုင်း)။
- `enterKeyHint` — virtual keyboards တွေပေါ်မှာ enter key အတွက် ဘယ် action ပြရမလဲ သတ်မှတ်ပါတယ်။
- `htmlFor` — `<label>` နဲ့ `<output>` တွေအတွက် — label ကို control တစ်ခုနဲ့ ချိတ်ဆက်ပေးပါတယ် (HTML ရဲ့ `for` attribute နေရာမှာ React က `htmlFor` ကို သုံးပါတယ်)။
- `hidden` — element ကို ဝှက်ထားမထား သတ်မှတ်တဲ့ boolean/string။
- `id` — element အတွက် unique identifier — component instance အများကြီးကြားမှာ clash မဖြစ်အောင် `useId` နဲ့ ထုတ်နိုင်ပါတယ်။
- `is` — သတ်မှတ်ထားရင် component က custom element တစ်ခုလို ပြုမူပါတယ်။
- `inputMode` — ဘယ်လို keyboard အမျိုးအစား (text, number, telephone စသည်) ပြရမလဲ သတ်မှတ်ပါတယ်။
- `itemProp` — structured data crawlers တွေအတွက် element က ဘယ် property ကို ကိုယ်စားပြုလဲ သတ်မှတ်ပါတယ်။
- `lang` — element ရဲ့ ဘာသာစကား။
- `role` — assistive technologies တွေအတွက် element ရဲ့ role ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပါတယ်။
- `slot` — shadow DOM သုံးတဲ့အခါ slot name သတ်မှတ်ပါတယ် (React မှာတော့ JSX ကို props အဖြစ် ပို့တဲ့ pattern က ပိုအသုံးများပါတယ်)။
- `spellCheck` — spellchecking ဖွင့်/ပိတ် လုပ်တဲ့ boolean ဒါမှမဟုတ် `null`။
- `tabIndex` — default Tab button အပြုအမူကို ကျော်လွှားဖို့ — `-1` နဲ့ `0` ကလွဲလို့ တခြား values တွေ ရှောင်ပါ။
- `title` — element ရဲ့ tooltip စာသား။
- `translate` — `'yes'` ဒါမှမဟုတ် `'no'` — `'no'` ဆိုရင် element content ကို ဘာသာပြန်ကနေ ဖယ်ထုတ်ပါတယ်။

`mycustomprop="someValue"` လို custom attributes တွေကိုလည်း props အဖြစ် ပေးနိုင်ပါတယ် (third-party libraries တွေနဲ့ ပေါင်းစပ်တဲ့အခါ အသုံးဝင်ပါတယ်) — custom attribute name က lowercase ဖြစ်ရပြီး `on` နဲ့ စလို့ မရပါဘူး။ Value ကို string အဖြစ် ပြောင်းပြီး — `null` ဒါမှမဟုတ် `undefined` ပေးရင် attribute ကို ဖယ်ရှားပါတယ်။

#### Event Handler Props

Event handlers တွေက `onXxx` prop ပုံစံနဲ့ ဖြစ်ပြီး — event object တစ်ခုကို argument အဖြစ် လက်ခံတဲ့ function တစ်ခုပါ။ Handler တစ်ခုစီရဲ့ Capture phase version (`onXxxCapture`) တွေလည်း ရှိပါတယ်:

- **Clipboard events** — `onCopy` (copy လုပ်တဲ့အခါ)၊ `onCut` (cut လုပ်တဲ့အခါ)၊ `onPaste` (paste လုပ်တဲ့အခါ) — `ClipboardEvent` handlers။
- **Composition events** — `onCompositionStart`/`onCompositionUpdate`/`onCompositionEnd` — input method editor (IME) session စတင်/ပြောင်း/ပြီးဆုံးချိန်တွေမှာ — `CompositionEvent` handlers။
- **Keyboard events** — `onKeyDown` (key နှိပ်ချိန်)၊ `onKeyUp` (key လွှတ်ချိန်) — `KeyboardEvent` handlers။ `onKeyPress` ကတော့ deprecated ဖြစ်ပြီး — `onKeyDown` ဒါမှမဟုတ် `onBeforeInput` သုံးပါ။
- **Input events** — `onBeforeInput` — editable element တစ်ခုရဲ့ value မပြောင်းခင် fire ပြီး — React က native `beforeinput` event ကို မသုံးသေးဘဲ တခြား events တွေနဲ့ polyfill လုပ်ဖို့ ကြိုးစားပါတယ် — `InputEvent` handler။
- **Focus events** — `onFocus` (element focus ရချိန်)၊ `onBlur` (focus ပျောက်ချိန်) — `FocusEvent` handlers။ **React မှာ ဒီ events နှစ်ခုလုံး bubble ဖြစ်ပါတယ်** (browser ရဲ့ native `focus`/`blur` events တွေနဲ့ မတူဘဲ)။
- **Mouse events** — `onClick` (primary button နှိပ်ချိန်)၊ `onContextMenu` (context menu ဖွင့်ချိန်)၊ `onDoubleClick` (နှစ်ချက် နှိပ်ချိန်)၊ `onAuxClick` (primary မဟုတ်တဲ့ button နှိပ်ချိန်)၊ `onMouseDown`/`onMouseUp`၊ `onMouseEnter`/`onMouseLeave` (capture phase မရှိဘဲ ထွက်တဲ့ element ကနေ ဝင်တဲ့ element ဆီ ပျံ့တာ)၊ `onMouseMove`၊ `onMouseOut` — `MouseEvent` handlers။
- **Pointer events** — `onPointerDown`/`onPointerUp`/`onPointerMove`/`onPointerEnter`/`onPointerLeave`/`onPointerOut`/`onPointerCancel`/`onGotPointerCapture`/`onLostPointerCapture` — `PointerEvent` handlers။
- **Touch events** — `onTouchStart`/`onTouchMove`/`onTouchEnd`/`onTouchCancel` — `TouchEvent` handlers။
- **UI events** — `onScroll` (element scroll ဖြစ်ချိန် — bubble မလုပ်ပါ) — `UIEvent` handler။ `onSelect` — input လို editable element တစ်ခုထဲက selection ပြောင်းချိန် (React က `contentEditable` elements တွေအတွက်ပါ ထောက်ပံ့ပေးပါတယ်)။
- **Wheel events** — `onWheel` (wheel button လှည့်ချိန်) — `WheelEvent` handler။
- **Animation events** — `onAnimationStart`/`onAnimationIteration`/`onAnimationEnd` — CSS animation စတင်/အကြိမ်ပြန်/ပြီးဆုံးချိန်တွေမှာ — `AnimationEvent` handlers။
- **Transition events** — `onTransitionEnd` — CSS transition ပြီးဆုံးချိန် — `TransitionEvent` handler။
- **Drag events** — `onDrag`/`onDragStart`/`onDragEnd`/`onDragEnter`/`onDragLeave`/`onDragOver`/`onDrop` — HTML Drag and Drop API — `DragEvent` handlers။ (`onDragOver` မှာ drop ခွင့်ပြုဖို့ `e.preventDefault()` ခေါ်ရပါတယ်။)

ဒီ events တွေက သတ်မှတ်ထားတဲ့ elements တွေအတွက်ပဲ ရှိပါတယ်:

- `<form>` အတွက် — `onReset` (form reset ဖြစ်ချိန်)၊ `onSubmit` (form submit ဖြစ်ချိန်)။
- `<dialog>` အတွက် — `onCancel` (dialog ပိတ်ဖို့ ကြိုးစားချိန်)၊ `onClose` (dialog ပိတ်ပြီးချိန်) — browser events တွေနဲ့ မတူဘဲ React မှာ bubble ဖြစ်ပါတယ်။
- `<details>` အတွက် — `onToggle` — browser နဲ့ မတူဘဲ React မှာ bubble ဖြစ်ပါတယ်။
- `<img>`၊ `<iframe>`၊ `<object>`၊ `<embed>`၊ `<link>` နဲ့ SVG `<image>` တွေအတွက် — `onLoad` (resource load ပြီးချိန်)၊ `onError` (resource load မဖြစ်နိုင်ချိန်) — React မှာ bubble ဖြစ်ပါတယ်။
- `<audio>` နဲ့ `<video>` လို media resources တွေအတွက် — `onAbort`၊ `onCanPlay`၊ `onCanPlayThrough`၊ `onDurationChange`၊ `onEmptied`၊ `onEncrypted`၊ `onEnded`၊ `onError`၊ `onLoadedData`၊ `onLoadedMetadata`၊ `onLoadStart`၊ `onPause`၊ `onPlay`၊ `onPlaying`၊ `onProgress`၊ `onRateChange`၊ `onResize`၊ `onSeeked`၊ `onSeeking`၊ `onStalled`၊ `onSuspend`၊ `onTimeUpdate`၊ `onVolumeChange`၊ `onWaiting` — media ရဲ့ load/playback state အပြောင်းအလဲတွေမှာ fire ပြီး — React မှာ bubble ဖြစ်ပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `children` နဲ့ `dangerouslySetInnerHTML` နှစ်ခုလုံးကို တစ်ပြိုင်နက် ပေးလို့ မရပါဘူး။
- Events တချို့ (`onAbort` နဲ့ `onLoad` လိုမျိုး) က browser ထဲမှာ bubble မဖြစ်ပေမယ့် — React ထဲမှာတော့ bubble ဖြစ်ပါတယ်။

### Ref Callback Function

Ref object တစ်ခု (ဥပမာ `useRef` က ပြန်ပေးတဲ့) အစား — `ref` attribute ဆီ function တစ်ခုကို ပေးနိုင်ပါတယ်:

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

`<div>` DOM node ကို screen ပေါ် ထည့်လိုက်တဲ့အခါ — React က သင့် ref callback ကို DOM `node` ကို argument အဖြစ်နဲ့ ခေါ်ပါတယ်။ DOM node ကို ဖယ်ရှားလိုက်ရင် — callback ကနေ ပြန်ပေးထားတဲ့ cleanup function ကို React က ခေါ်ပါတယ်။ တခြား ref callback တစ်ခု ပေးလိုက်တိုင်းလည်း React က ပြန်ခေါ်ပါတယ် — component re-render ဖြစ်တိုင်း `(node) => { ... }` က function အသစ်တစ်ခု ဖြစ်နေတာမို့ — callback အရင်တစ်ခုကို `null` argument နဲ့ ခေါ်ပြီး — callback အသစ်ကို DOM node နဲ့ ခေါ်ပါတယ်။

**Parameters (ပါရာမီတာများ)**

- `node`: DOM node တစ်ခု။ Ref တွဲလိုက်တဲ့အခါ React က DOM node ကို ပေးပါတယ်။ Ref callback ကို render တိုင်း function reference တစ်ခုတည်းနဲ့ မပေးဘူးဆိုရင် — re-render တိုင်းမှာ callback က ယာယီ cleanup ဖြစ်ပြီး ပြန်လည် ဖန်တီးခံရပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- **optional** `cleanup function`: Ref ကို ဖြုတ်လိုက်တဲ့အခါ React က ဒီ cleanup function ကို ခေါ်ပါတယ်။ Ref callback ကနေ function တစ်ခု ပြန်မပေးဘူးဆိုရင် — ref ဖြုတ်ချိန်မှာ callback ကို `null` argument နဲ့ ထပ်ခေါ်ပါတယ် (ဒီ behavior က နောက် version တစ်ခုမှာ ဖယ်ရှားမှာပါ)။

**Caveats (သတိပြုရမည့်အချက်များ)**

- Strict Mode ဖွင့်ထားရင် — React က ပထမဆုံး real setup မလုပ်ခင် development-only setup+cleanup cycle တစ်ခု အပိုဆောင်း run ပါတယ်။
- Ref callback အသစ် ပေးလိုက်တဲ့အခါ — React က callback အဟောင်းရဲ့ cleanup function ကို (ပြန်ပေးထားရင်) ခေါ်ပြီး — cleanup function မရှိရင် callback အဟောင်းကို `null` နဲ့ ခေါ်ပါတယ် — callback အသစ်ကိုတော့ DOM node နဲ့ ခေါ်ပါတယ်။

> **မှတ်ချက်:** React 19 က ref callbacks တွေအတွက် cleanup functions တွေကို ထည့်သွင်းပေးခဲ့ပါတယ်။ Backwards compatibility အတွက် — ref callback ကနေ cleanup function ပြန်မပေးရင် — ref ဖြုတ်ချိန်မှာ `node` ကို `null` နဲ့ ခေါ်ပြီး — ဒီ behavior က နောက် version တစ်ခုမှာ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။

### React Event Object

သင့် event handlers တွေက *React event object* တစ်ခုကို လက်ခံရရှိပါတယ် — "synthetic event" လို့လည်း တခါတရံ ခေါ်ပါတယ်။

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

ဒါက အောက်ခံ DOM events တွေရဲ့ standard နဲ့ ကိုက်ညီပေမယ့် — browser ရဲ့ မကိုက်ညီမှုတချို့ကို ပြုပြင်ပေးပါတယ်။ React events တချို့က browser ရဲ့ native events တွေနဲ့ တိုက်ရိုက် မြေပုံမညီပါဘူး — ဥပမာ `onMouseLeave` ထဲမှာ `e.nativeEvent` က `mouseout` event တစ်ခုကို ညွှန်ပါလိမ့်မယ်။ Native browser event လိုအပ်ရင် `e.nativeEvent` ကနေ ဖတ်ပါ။

**Properties (ဂုဏ်သတ္တိများ)** — standard [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) properties တချို့ကို ထောက်ပံ့ပေးပါတယ်: `bubbles` (bubble ဖြစ်မဖြစ်)၊ `cancelable` (cancel လုပ်လို့ရမရ)၊ `currentTarget` (လက်ရှိ handler တွဲထားတဲ့ node)၊ `defaultPrevented` (`preventDefault` ခေါ်ပြီးပြီလား)၊ `eventPhase` (လက်ရှိ phase)၊ `isTrusted` (user က စတင်တာလား)၊ `target` (event ဖြစ်ပွားတဲ့ node)၊ `timeStamp` (event ဖြစ်တဲ့အချိန်)။ ဒါ့အပြင် — `nativeEvent` (မူရင်း browser event object)။

**Methods (နည်းလမ်းများ)** — [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) (browser ရဲ့ default action ကို တားဆီး)၊ [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) (React tree ထဲမှာ event ပျံ့နှံ့တာကို ရပ်)။ ဒါ့အပြင် — `isDefaultPrevented()`၊ `isPropagationStopped()`၊ `persist()` (React DOM မှာ မသုံးပါ)၊ `isPersistent()` (React DOM မှာ မသုံးပါ)။

**Caveats (သတိပြုရမည့်အချက်များ)** — React event objects တွေထဲက `currentTarget`/`eventPhase`/`target`/`type` တွေက သင့် React code က မျှော်လင့်တဲ့ တန်ဖိုးတွေကို ထင်ဟပ်ပြီး — React က handlers တွေကို root မှာ တွဲထားတာ အတွင်းအဆင့်ကို ထင်ဟပ်မနေပါဘူး။ ဥပမာ `e.currentTarget` က `e.nativeEvent.currentTarget` နဲ့ တူချင်မှ တူပါလိမ့်မယ်။

### Event Handler Function Types

Handler တစ်ခုချင်းစီရဲ့ parameter က — သက်ဆိုင်ရာ event type ရဲ့ အပိုဂုဏ်သတ္တိတွေ ပါဝင်တဲ့ React event object (`e`) တစ်ခုပါ:

- `AnimationEvent` — CSS animation events တွေအတွက် — အပို: `animationName`၊ `elapsedTime`၊ `pseudoElement`။
- `ClipboardEvent` — Clipboard API events တွေအတွက် — အပို: `clipboardData`။
- `CompositionEvent` — IME events တွေအတွက် — အပို: `data`။
- `DragEvent` — Drag and Drop events တွေအတွက် — အပို: `dataTransfer` + MouseEvent/UIEvent အမွေဂုဏ်သတ္တိတွေ။
- `FocusEvent` — focus events တွေအတွက် — အပို: `relatedTarget` + UIEvent အမွေဂုဏ်သတ္တိတွေ။
- `Event` — generic events တွေအတွက် — အပိုဂုဏ်သတ္တိ မရှိပါ။
- `InputEvent` — `onBeforeInput` အတွက် — အပို: `data`။
- `KeyboardEvent` — keyboard events တွေအတွက် — အပို: `altKey`၊ `charCode`၊ `code`၊ `ctrlKey`၊ `getModifierState(key)`၊ `key`၊ `keyCode`၊ `locale`၊ `metaKey`၊ `location`၊ `repeat`၊ `shiftKey`၊ `which` + UIEvent အမွေဂုဏ်သတ္တိတွေ။
- `MouseEvent` — mouse events တွေအတွက် — အပို: `altKey`၊ `button`၊ `buttons`၊ `ctrlKey`၊ `clientX`/`clientY`၊ `getModifierState(key)`၊ `metaKey`၊ `movementX`/`movementY`၊ `pageX`/`pageY`၊ `relatedTarget`၊ `screenX`/`screenY`၊ `shiftKey` + UIEvent အမွေဂုဏ်သတ္တိတွေ။
- `PointerEvent` — pointer events တွေအတွက် — MouseEvent ဂုဏ်သတ္တိတွေ အားလုံး + အပို: `height`၊ `isPrimary`၊ `pointerId`၊ `pointerType`၊ `pressure`၊ `tangentialPressure`၊ `tiltX`၊ `tiltY`၊ `twist`၊ `width` + UIEvent အမွေဂုဏ်သတ္တိတွေ။
- `TouchEvent` — touch events တွေအတွက် — အပို: `altKey`၊ `ctrlKey`၊ `changedTouches`၊ `getModifierState(key)`၊ `metaKey`၊ `shiftKey`၊ `touches`၊ `targetTouches` + UIEvent အမွေဂုဏ်သတ္တိတွေ။
- `TransitionEvent` — CSS transition events တွေအတွက် — အပို: `elapsedTime`၊ `propertyName`၊ `pseudoElement`။
- `UIEvent` — generic UI events တွေအတွက် — အပို: `detail`၊ `view`။
- `WheelEvent` — `onWheel` အတွက် — MouseEvent ဂုဏ်သတ္တိတွေ + အပို: `deltaMode`၊ `deltaX`၊ `deltaY`၊ `deltaZ` + UIEvent အမွေဂုဏ်သတ္တိတွေ။

## အသုံးပြုပုံ (Usage)

### CSS Styles သုံးစွဲခြင်း

React မှာ CSS class တစ်ခုကို [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) နဲ့ သတ်မှတ်ပါတယ် — HTML ရဲ့ `class` attribute လိုပါပဲ:

```js
<img className="avatar" />
```

ပြီးရင် CSS rules တွေကို သီးခြား CSS file တစ်ခုမှာ ရေးပါတယ်:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

Style values တွေက data ပေါ် မူတည်နေရင် — `style` attribute နဲ့ styles တွေကို dynamically ပေးနိုင်ပါတယ်:

```js
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

ဒီမှာ `style={{}}` က အထူး syntax မဟုတ်ဘဲ — `style={ }` JSX curly braces ရဲ့ အတွင်းက သာမန် `{}` object တစ်ခုပါ။ Styles တွေက JavaScript variables တွေပေါ် မူတည်တဲ့အခါမှပဲ `style` attribute ကို သုံးဖို့ အကြံပြုပါတယ်။ CSS classes တွေကို conditionally သုံးချင်ရင် — `className` string ကို ကိုယ်တိုင် တည်ဆောက်ပါ — ဥပမာ `className={'row ' + (isSelected ? 'selected': '')}` — ဒါမှမဟုတ် [`classnames`](https://github.com/JedWatson/classnames) လို helper library လေးတွေ သုံးနိုင်ပါတယ်။

### Ref တစ်ခုနဲ့ DOM Node တစ်ခုကို ကိုင်တွယ်ခြင်း

တခါတရံ JSX ထဲက tag တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ browser DOM node ကို ရယူဖို့ လိုပါတယ် — ဥပမာ button နှိပ်တဲ့အခါ `<input>` တစ်ခုကို focus လုပ်ချင်ရင် — browser `<input>` DOM node ပေါ်မှာ [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) ခေါ်ဖို့ လိုပါတယ်။ ဒါဆိုရင် — `useRef` နဲ့ ref တစ်ခု ကြေညာပြီး — tag ဆီ `ref` attribute အဖြစ် ပေးပါ။ React က node ကို screen ပေါ် render ပြီးတာနဲ့ — DOM node ကို `inputRef.current` ထဲ ထည့်ပေးပါတယ်:

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

ပိုအဆင့်မြင့်တဲ့ case တွေအတွက် — `ref` attribute က [callback function](#ref-callback-function) တစ်ခုကိုလည်း လက်ခံပါတယ်။ အသေးစိတ်ကို [DOM ကို refs နဲ့ ကိုင်တွယ်ခြင်း](/docs/react/manipulating-the-dom-with-refs) မှာ ကြည့်ပါ။

### Inner HTML ကို Dangerously သတ်မှတ်ခြင်း

Element တစ်ခုဆီ raw HTML string တစ်ခုကို ဒီလို ပေးနိုင်ပါတယ်:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**ဒါက အန္တရာယ်ရှိပါတယ်။** အောက်ခံ DOM ရဲ့ [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property လိုပဲ — အလွန် သတိထားရပါတယ်! Markup က လုံးဝ ယုံကြည်ရတဲ့ အရင်းအမြစ်ကနေ လာတာ မဟုတ်ဘူးဆိုရင် — ဒီနည်းနဲ့ [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability တစ်ခု ထည့်လိုက်တာနဲ့ တူပါတယ်။ `{__html}` object ကို HTML ထုတ်ပေးတဲ့နေရာ အနီးမှာပဲ ဖန်တီးပြီး — ယုံကြည်ရပြီး သန့်စင်ပြီးသား (sanitized) data နဲ့ပဲ သုံးပါ:

```js
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML ထဲ မြှုပ်ထားတဲ့ code က run ပါလိမ့်မယ် — hacker တစ်ယောက်က ဒီ security hole ကနေ user အချက်အလက်တွေ ခိုးယူနိုင်ပါတယ်။

### Mouse / Pointer / Focus / Keyboard Events တွေကို ကိုင်တွယ်ခြင်း

ဒီ event groups တစ်ခုချင်းစီအတွက် — `MouseEvent`၊ `PointerEvent`၊ `FocusEvent`၊ `KeyboardEvent` — ဥပမာ code တွေ ရှိပါတယ်။ Keyboard events တွေရဲ့ ဥပမာ:

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

React မှာ focus events တွေ bubble ဖြစ်တာမို့ — focus/blur က parent element ရဲ့ အပြင်ကလား အတွင်းက child ကလားဆိုတာကို `currentTarget` နဲ့ `relatedTarget` သုံးပြီး ခွဲခြားနိုင်ပါတယ် — `e.currentTarget.contains(e.relatedTarget)` က subtree တစ်ခုလုံးကို ဝင်ချိန်/ထွက်ချိန်တွေကို သိစေပါတယ်။
