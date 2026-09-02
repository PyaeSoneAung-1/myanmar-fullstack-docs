---
title: "<Fragment> (<>...</>)"
description: "Wrapper node မလိုဘဲ elements တွေကို group လုပ်နိုင်စေတဲ့ React component — <>...</> shorthand, FragmentInstance (refs ဖြင့် event listeners/focus/scroll/IntersectionObserver စီမံခြင်း) အပါအဝင် props, caveats နဲ့ အသုံးပြုပုံ နမူနာများ"
order: 114
source: "https://react.dev/reference/react/Fragment"
status: translated
updated: 2026-09-02
---

`<Fragment>` — `<>...</>` syntax နဲ့ အသုံးများတဲ့ — wrapper node မလိုဘဲ elements တွေကို group လုပ်နိုင်စေတဲ့ React component တစ်ခုပါ။

> **မှတ်ချက် (Canary):** Fragments တွေက refs တွေကိုလည်း လက်ခံနိုင်ပါတယ် — wrapper elements တွေ ထပ်ထည့်စရာ မလိုဘဲ အောက်ခံ DOM nodes တွေနဲ့ အပြန်အလှန် ဆက်သွယ်နိုင်စေပါတယ်။

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

## ရည်ညွှန်းချက် (Reference)

### `<Fragment>`

Element တစ်ခုတည်း လိုအပ်တဲ့ အခြေအနေတွေမှာ — elements တွေကို အတူတကွ group လုပ်ဖို့ `<Fragment>` ထဲမှာ ထုပ်ပါ။ `Fragment` ထဲမှာ elements တွေကို group လုပ်တာက — ရလဒ် DOM အပေါ် ဘာမှ သက်ရောက်မှု မရှိပါဘူး — elements တွေကို group မလုပ်ထားဘူးဆိုတာနဲ့ အတူတူပါပဲ။ ဗလာ JSX tag `<></>` က ကိစ္စ အများစုမှာ `<Fragment></Fragment>` ရဲ့ အတိုကောက် (shorthand) ပါ။

#### Props

- **optional** `key`: `<Fragment>` syntax အရှည်နဲ့ ကြေညာထားတဲ့ Fragments တွေမှာ [keys](/docs/react/rendering-lists) တွေ ရှိနိုင်ပါတယ်။
- *(Canary)* **optional** `ref`: Ref object တစ်ခု (ဥပမာ — [`useRef`](/docs/react/use-ref) ကနေ ရတဲ့ဟာ) ဒါမှမဟုတ် [callback function](/docs/react/built-in-components#ref-callback-function)။ React က `FragmentInstance` တစ်ခုကို ref value အနေနဲ့ ပေးပါတယ် — Fragment က ထုပ်ထားတဲ့ DOM nodes တွေနဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ method တွေ ပါဝင်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Fragment တစ်ခုဆီ `key` ပို့ချင်ရင် — `<>...</>` syntax ကို သုံးလို့ မရပါဘူး။ `'react'` ကနေ `Fragment` ကို ရှင်းရှင်းလင်းလင်း import လုပ်ပြီး — `<Fragment key={yourKey}>...</Fragment>` လို့ render လုပ်ရပါတယ်။

- React က — `<><Child /></>` ကို render လုပ်တာကနေ `[<Child />]` ဆီ (သို့) နောက်ပြန် ပြောင်းတဲ့အခါ — ဒါမှမဟုတ် `<><Child /></>` ကနေ `<Child />` ဆီ (သို့) နောက်ပြန် ပြောင်းတဲ့အခါ — [state ကို reset မလုပ်ပါဘူး](/docs/react/preserving-and-resetting-state)။ ဒါက အဆင့်တစ်ခု အနက်မှာပဲ အလုပ်လုပ်ပါတယ်: ဥပမာ — `<><><Child /></></>` ကနေ `<Child />` ကို ပြောင်းရင်တော့ state ကို reset လုပ်ပါတယ်။ တိကျတဲ့ အဓိပ္ပာယ်သတ်မှတ်ချက်တွေကို [ဒီမှာ](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) ကြည့်ပါ။

- *(Canary)* သင် Fragment တစ်ခုဆီ `ref` ပို့ချင်ရင်လည်း — `<>...</>` syntax ကို သုံးလို့ မရပါဘူး။ `'react'` ကနေ `Fragment` ကို ရှင်းရှင်းလင်းလင်း import လုပ်ပြီး — `<Fragment ref={yourRef}>...</Fragment>` လို့ render လုပ်ရပါတယ်။

### *(Canary)* `FragmentInstance`

သင် Fragment တစ်ခုဆီ `ref` ပို့တဲ့အခါ — React က `FragmentInstance` object တစ်ခုကို ပေးပါတယ်။ သူ့မှာ — Fragment က ထုပ်ထားတဲ့ first-level DOM children တွေနဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ method တွေ ပါဝင်ပါတယ်။

- [`addEventListener`](#addeventlistener) နဲ့ [`removeEventListener`](#removeeventlistener) တွေက — first-level DOM children အားလုံးပေါ်မှာ event listeners တွေကို စီမံပေးပါတယ်။
- [`dispatchEvent`](#dispatchevent) က Fragment ပေါ်မှာ event တစ်ခုကို dispatch လုပ်ပြီး — အဲဒါက DOM parent ဆီအထိ bubble တက်နိုင်ပါတယ်။
- [`focus`](#focus)၊ [`focusLast`](#focuslast) နဲ့ [`blur`](#blur) တွေက — nested children အားလုံးကို depth-first ဖြတ်ပြီး focus ကို စီမံပေးပါတယ်။
- [`observeUsing`](#observeusing) နဲ့ [`unobserveUsing`](#unobserveusing) တွေက — `IntersectionObserver` (သို့) `ResizeObserver` instance တွေကို ချိတ်ပေး/ဖြုတ်ပေးပါတယ်။
- [`getClientRects`](#getclientrects) က first-level DOM children အားလုံးရဲ့ bounding rectangles တွေကို ပြန်ပေးပါတယ်။
- [`getRootNode`](#getrootnode) က Fragment ရဲ့ parent ရဲ့ root node ကို ပြန်ပေးပါတယ်။
- [`compareDocumentPosition`](#comparedocumentposition) က Fragment ရဲ့ တည်နေရာကို တခြား node တစ်ခုနဲ့ နှိုင်းယှဉ်ပါတယ်။
- [`scrollIntoView`](#scrollintoview) က Fragment ရဲ့ children တွေကို view ထဲ ရောက်အောင် scroll လုပ်ပါတယ်။

#### `addEventListener(type, listener, options?)`

Fragment ရဲ့ first-level DOM children အားလုံးဆီ event listener တစ်ခု ထပ်ပေါင်းထည့်ပါတယ်။

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parameters (ပါရာမီတာများ)

- `type`: ဘယ် event type ကို နားထောင်ရမလဲ ဖော်ပြတဲ့ string တစ်ခု (ဥပမာ — `'click'`၊ `'focus'`)။
- `listener`: Event handler function ပါ။
- **optional** `options`: Capture အတွက် options object (သို့) boolean တစ်ခု — [DOM ရဲ့ `addEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) နဲ့ ကိုက်ညီပါတယ်။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`addEventListener` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `removeEventListener(type, listener, options?)`

Fragment ရဲ့ first-level DOM children အားလုံးကနေ event listener တစ်ခုကို ဖယ်ရှားပါတယ်။

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parameters (ပါရာမီတာများ)

- `type`: Event type string ပါ။
- `listener`: ဖယ်ရှားရမယ့် event handler function ပါ။
- **optional** `options`: Options object (သို့) boolean တစ်ခု — [DOM ရဲ့ `removeEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) နဲ့ ကိုက်ညီပါတယ်။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`removeEventListener` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `dispatchEvent(event)`

Fragment ပေါ်မှာ event တစ်ခုကို dispatch လုပ်ပါတယ်။ ထည့်ထားတဲ့ event listeners တွေကို ခေါ်ပြီး — event က Fragment ရဲ့ DOM parent ဆီအထိ bubble တက်နိုင်ပါတယ်။

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parameters (ပါရာမီတာများ)

- `event`: Dispatch လုပ်ရမယ့် [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) object တစ်ခု။ `bubbles` က `true` ဆိုရင် — event က Fragment ရဲ့ parent DOM node ဆီအထိ bubble တက်ပါတယ်။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

Event ကို cancel မလုပ်ထားရင် `true` ကို ပြန်ပေးပြီး — `preventDefault()` ကို ခေါ်ထားရင် `false` ကို ပြန်ပေးပါတယ်။

#### `focus(options?)`

Fragment ထဲက ပထမဆုံး focus လုပ်လို့ရတဲ့ DOM node ကို focus လုပ်ပါတယ်။ DOM element တစ်ခုပေါ်မှာ `element.focus()` ကို ခေါ်တာနဲ့ မတူဘဲ — ဒီ method က element ကိုယ်တိုင် (သို့) သူ့ရဲ့ တိုက်ရိုက် children တွေကိုပဲ ကြည့်တာ မဟုတ်ဘဲ — focus လုပ်လို့ရတဲ့ element တစ်ခု မတွေ့မချင်း *nested children အားလုံး* ကို depth-first ရှာဖွေပါတယ်။

```js
fragmentRef.current.focus();
```

##### Parameters (ပါရာမီတာများ)

- **optional** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object တစ်ခု (ဥပမာ — `{ preventScroll: true }`)။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`focus` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `focusLast(options?)`

Fragment ထဲက နောက်ဆုံး focus လုပ်လို့ရတဲ့ DOM node ကို focus လုပ်ပါတယ်။ Nested children တွေကို depth-first ရှာဖွေပြီး — ပြီးမှ နောက်ပြန် (reverse) အစီအစဉ်နဲ့ iterate လုပ်ပါတယ်။

```js
fragmentRef.current.focusLast();
```

##### Parameters (ပါရာမီတာများ)

- **optional** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object တစ်ခု။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`focusLast` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `blur()`

လက်ရှိ active element က Fragment ရဲ့ အတွင်းမှာ ရှိနေရင် — အဲဒီကနေ focus ကို ဖယ်ရှားပါတယ်။ `document.activeElement` က Fragment ရဲ့ အတွင်းမှာ မရှိဘူးဆိုရင် — `blur` က ဘာမှ မလုပ်ပါဘူး။

```js
fragmentRef.current.blur();
```

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`blur` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `observeUsing(observer)`

ပေးထားတဲ့ observer နဲ့ — Fragment ရဲ့ first-level DOM children အားလုံးကို စတင် စောင့်ကြည့် (observe) လုပ်ပါတယ်။

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parameters (ပါရာမီတာများ)

- `observer`: [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) (သို့) [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance တစ်ခု။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`observeUsing` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `unobserveUsing(observer)`

သတ်မှတ်ထားတဲ့ observer နဲ့ — Fragment ရဲ့ DOM children တွေကို စောင့်ကြည့်တာကို ရပ်လိုက်ပါတယ်။

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parameters (ပါရာမီတာများ)

- `observer`: အရင်က [`observeUsing`](#observeusing) ဆီ ပေးခဲ့ဖူးတဲ့ `IntersectionObserver` (သို့) `ResizeObserver` instance အတူတူပါ။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`unobserveUsing` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

#### `getClientRects()`

First-level DOM children အားလုံးရဲ့ bounding rectangles တွေကို ကိုယ်စားပြုတဲ့ [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) objects တွေပါတဲ့ flat array တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const rects = fragmentRef.current.getClientRects();
```

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

Children အားလုံးရဲ့ bounding rectangles တွေ ပါဝင်တဲ့ `Array<DOMRect>` တစ်ခုပါ။

#### `getRootNode(options?)`

Fragment ရဲ့ parent DOM node ကို ပါဝင်စေတဲ့ root node ကို ပြန်ပေးပါတယ် — [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode) ရဲ့ အပြုအမူနဲ့ ကိုက်ညီပါတယ်။

```js
const root = fragmentRef.current.getRootNode();
```

##### Parameters (ပါရာမီတာများ)

- **optional** `options`: `composed` boolean property တစ်ခု ပါတဲ့ object တစ်ခု — [DOM ရဲ့ `getRootNode` API](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options) နဲ့ ကိုက်ညီပါတယ်။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`Document` တစ်ခု၊ `ShadowRoot` တစ်ခု — ဒါမှမဟုတ် parent DOM node မရှိဘူးဆိုရင် `FragmentInstance` ကိုယ်တိုင် ဖြစ်ပါတယ်။

#### `compareDocumentPosition(otherNode)`

Fragment ရဲ့ document position ကို တခြား node တစ်ခုနဲ့ နှိုင်းယှဉ်ပြီး — [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition) ရဲ့ အပြုအမူနဲ့ ကိုက်ညီတဲ့ bitmask တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parameters (ပါရာမီတာများ)

- `otherNode`: နှိုင်းယှဉ်ရမယ့် DOM node ပါ။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

[Position flags](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value) တွေရဲ့ bitmask တစ်ခုပါ။ ဗလာ Fragments တွေနဲ့ — [portal](/docs/react/create-portal) တစ်ခုကနေ render လုပ်ထားတဲ့ children တွေ ရှိတဲ့ Fragments တွေရဲ့ ရလဒ်ထဲမှာ `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` ပါဝင်ပါတယ်။

#### `scrollIntoView(alignToTop?)`

Fragment ရဲ့ children တွေကို view ထဲ ရောက်အောင် scroll လုပ်ပါတယ်။ `alignToTop` က `true` (သို့) မပေးထားဘူးဆိုရင် — ပထမ child ကို scrollable ancestor ရဲ့ ထိပ်နဲ့ ညှိပြီး scroll လုပ်ပါတယ်။ `alignToTop` က `false` ဆိုရင် — နောက်ဆုံး child ကို အောက်ခြေနဲ့ ညှိပြီး scroll လုပ်ပါတယ်။

```js
fragmentRef.current.scrollIntoView();
```

##### Parameters (ပါရာမီတာများ)

- **optional** `alignToTop`: Boolean တစ်ခု။ `true` (default) ဆိုရင် — ပထမ child ကို scrollable area ရဲ့ ထိပ်ဆီ scroll လုပ်ပြီး — `false` ဆိုရင် — နောက်ဆုံး child ကို အောက်ခြေဆီ scroll လုပ်ပါတယ်။ [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) နဲ့ မတူဘဲ — ဒီ method က `ScrollIntoViewOptions` object တစ်ခုကို လက်မခံပါဘူး။

##### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`scrollIntoView` က ဘာမှ ပြန်မပေးပါဘူး (`undefined`)။

##### Caveats (သတိပြုရမည့်အချက်များ)

- `scrollIntoView` က options object တစ်ခုကို လက်မခံပါဘူး။ တစ်ခု ပေးလိုက်ရင် error တစ်ခု ပစ်ပါတယ်။ အဲဒီအစား `alignToTop` boolean ကို သုံးပါ။
- Fragment မှာ children မရှိဘူးဆိုရင် — `scrollIntoView` က fallback အနေနဲ့ — အနီးဆုံး sibling (သို့) parent ကို view ထဲ ရောက်အောင် scroll လုပ်ပါတယ်။

#### `FragmentInstance` Caveats (သတိပြုရမည့်အချက်များ)

- Children တွေကို ပစ်မှတ်ထားတဲ့ methods တွေ (`addEventListener`၊ `observeUsing` နဲ့ `getClientRects` လိုမျိုး) က Fragment ရဲ့ *first-level host (DOM) children* တွေအပေါ်မှာ အလုပ်လုပ်ပါတယ်။ တခြား DOM element တစ်ခုရဲ့ အတွင်းမှာ nested ဖြစ်နေတဲ့ children တွေကိုတော့ တိုက်ရိုက် ပစ်မှတ်မထားပါဘူး။
- `focus` နဲ့ `focusLast` တွေက — event နဲ့ observer methods တွေလို first-level host children တွေကိုပဲ ပစ်မှတ်ထားတာ မဟုတ်ဘဲ — focus လုပ်လို့ရတဲ့ elements တွေအတွက် nested children တွေကို depth-first ရှာဖွေပါတယ်။
- `observeUsing` က text nodes တွေပေါ်မှာ အလုပ်မလုပ်ပါဘူး။ Fragment ထဲမှာ text children တွေပဲ ရှိနေရင် — development မှာ React က warning တစ်ခု log လုပ်ပါတယ်။
- React က `addEventListener` နဲ့ ထည့်ထားတဲ့ event listeners တွေကို — ဝှက်ထားတဲ့ (hidden) [`<Activity>`](https://react.dev/reference/react/Activity) trees တွေဆီ သက်ရောက်စေမှာ မဟုတ်ပါဘူး။ `Activity` boundary တစ်ခုက hidden ကနေ visible ကို ပြောင်းတဲ့အခါ — listeners တွေကို အလိုအလျောက် သက်ရောက်စေပါတယ်။
- `ref` ပါတဲ့ Fragment တစ်ခုရဲ့ first-level DOM child တစ်ခုချင်းစီမှာ `reactFragments` property တစ်ခု ရှိပါတယ် — အဲဒီ element ကို ပိုင်ဆိုင်တဲ့ Fragment instance တွေ အားလုံး ပါဝင်တဲ့ `Set<FragmentInstance>` တစ်ခုပါ။ ဒါက [shared observer တစ်ခုကို cache လုပ်ခြင်း](#caching-global-intersection-observer) ကို Fragments အများကြီးကြားမှာ ဖြစ်နိုင်စေပါတယ်။

## အသုံးပြုပုံ (Usage)

### Element အများကြီးကို ပြန်ပေးခြင်း (Returning multiple elements)

`Fragment` (သို့) ညီမျှတဲ့ `<>...</>` syntax ကို သုံးပြီး — elements တွေ အများကြီးကို အတူတကွ group လုပ်ပါ။ Element တစ်ခုတည်း ထည့်လို့ရတဲ့ နေရာ မှန်သမျှမှာ — element အများကြီး ထည့်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။ ဥပမာ — component တစ်ခုက element တစ်ခုပဲ ပြန်ပေးလို့ရပေမယ့် — Fragment သုံးပြီး elements အများကြီးကို group လုပ်ပြီး — group တစ်ခုအနေနဲ့ ပြန်ပေးလို့ရပါတယ်:

```js
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments တွေ အသုံးဝင်တာက — Fragment နဲ့ elements တွေကို group လုပ်တာက layout (သို့) styles တွေကို ဘာမှ မသက်ရောက်လို့ပါ — DOM element လို တခြား container တစ်ခုနဲ့ elements တွေကို ထုပ်လိုက်ရင် သက်ရောက်မှု ရှိမှာနဲ့ မတူပါဘူး။ ဒီဥပမာကို browser tools တွေနဲ့ စစ်ကြည့်ရင် — `<h1>` နဲ့ `<article>` DOM nodes တွေ အားလုံး — ပတ်ပတ်လည်မှာ wrapper တွေ မရှိဘဲ siblings (မောင်နှမ nodes) တွေအနေနဲ့ ပေါ်နေတာ တွေ့ရပါလိမ့်မယ်:

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

#### အထူး syntax မသုံးဘဲ Fragment တစ်ခုကို ဘယ်လို ရေးမလဲ (How to write a Fragment without the special syntax?)

အပေါ်က ဥပမာက React ကနေ `Fragment` ကို import လုပ်တာနဲ့ ညီမျှပါတယ်:

```js
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

ပုံမှန်အားဖြင့် — သင့် [`Fragment` ဆီ `key` ပို့ဖို့](#rendering-a-list-of-fragments) လိုအပ်တဲ့အခါမှသာ ဒါကို သုံးဖို့ လိုပါလိမ့်မယ်။

### Elements အများကြီးကို variable တစ်ခုဆီ assign လုပ်ခြင်း (Assigning multiple elements to a variable)

တခြား element တွေလိုပဲ — Fragment elements တွေကို variable တွေဆီ assign လုပ်တာ၊ props အနေနဲ့ ပို့တာစသဖြင့် လုပ်နိုင်ပါတယ်:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

### Elements တွေကို စာသားတွေနဲ့ အတူ group လုပ်ခြင်း (Grouping elements with text)

`Fragment` ကို သုံးပြီး — စာသားတွေကို components တွေနဲ့ အတူ group လုပ်နိုင်ပါတယ်:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

### Fragment တွေရဲ့ list တစ်ခုကို render လုပ်ခြင်း (Rendering a list of Fragments)

`<></>` syntax သုံးမယ့်အစား `Fragment` ကို ရှင်းရှင်းလင်းလင်း ရေးဖို့ လိုအပ်တဲ့ အခြေအနေတစ်ခုက ဒီမှာပါ။ [loop တစ်ခုထဲမှာ element အများကြီး render လုပ်တဲ့အခါ](/docs/react/rendering-lists) — element တစ်ခုချင်းစီဆီ `key` တစ်ခု assign လုပ်ဖို့ လိုပါတယ်။ Loop ထဲက elements တွေက Fragments တွေဆိုရင် — `key` attribute ကို ပေးနိုင်ဖို့ ပုံမှန် JSX element syntax ကို သုံးရပါလိမ့်မယ်:

```js
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

DOM ကို စစ်ကြည့်ခြင်းဖြင့် — Fragment children တွေရဲ့ ပတ်ပတ်လည်မှာ wrapper elements တွေ မရှိတာ အတည်ပြုနိုင်ပါတယ်:

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

### *(Canary)* Wrapper element မလိုဘဲ event listeners တွေ ထည့်ခြင်း (Adding event listeners without a wrapper element)

Fragment ရဲ့ `ref`s တွေက — wrapper DOM node တစ်ခု ထပ်ထည့်စရာ မလိုဘဲ — element တစ်စုဆီ event listeners တွေ ထည့်နိုင်စေပါတယ်။ Listeners တွေကို ချိတ်ပြီး ရှင်းလင်းဖို့ [ref callback](/docs/react/built-in-components#ref-callback-function) တစ်ခုကို သုံးပါ:

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

`addEventListener` call က listener ကို Fragment ရဲ့ first-level DOM child တိုင်းဆီ သက်ရောက်စေပါတယ်။ Children တွေကို dynamic အနေနဲ့ ထပ်ထည့်တာ/ဖယ်ရှားတာ လုပ်တဲ့အခါ — `FragmentInstance` က listener ကို အလိုအလျောက် ထည့်ပေး/ဖယ်ပေးပါတယ်။

#### Fragment ref တစ်ခုက ဘယ် children တွေကို ပစ်မှတ်ထားလဲ (Which children does a Fragment ref target?)

`FragmentInstance` တစ်ခုက Fragment ရဲ့ **first-level host (DOM) children** တွေကို ပစ်မှတ်ထားပါတယ်။ ဒီ tree ကို ကြည့်ပါ:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` က React component တစ်ခုမို့ — `FragmentInstance` က DOM nodes တွေ ရှာဖို့ သူ့ကို ဖြတ်ကြည့်ပါတယ်။ ပစ်မှတ်ထားတဲ့ children တွေက `A`၊ `B` နဲ့ `D` ပါ။ `C` ကတော့ — DOM element `B` ရဲ့ အတွင်းမှာ nested ဖြစ်နေလို့ — ပစ်မှတ် မထားပါဘူး။

`addEventListener`၊ `observeUsing` နဲ့ `getClientRects` လို methods တွေက ဒီ first-level DOM children တွေအပေါ်မှာ အလုပ်လုပ်ပါတယ်။ `focus` နဲ့ `focusLast` တွေကတော့ မတူပါဘူး — သူတို့က focus လုပ်လို့ရတဲ့ elements တွေ ရှာဖို့ nested children *အားလုံး* ကို depth-first ရှာဖွေပါတယ်။

### *(Canary)* Element တစ်စုပေါ်မှာ focus ကို စီမံခြင်း (Managing focus across a group of elements)

Fragment ရဲ့ `ref`s တွေက — Fragment အတွင်းက DOM nodes အားလုံးပေါ်မှာ အလုပ်လုပ်တဲ့ `focus`၊ `focusLast` နဲ့ `blur` methods တွေကို ပေးပါတယ်:

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

`focus()` ကို ခေါ်တာက — `street` input ကို focus လုပ်ပါတယ် — `<fieldset>` နဲ့ `<label>` အတွင်းမှာ နက်နက်နဲနဲ nested ဖြစ်နေရင်တောင် ဖြစ်ပါတယ်။ `focus()` က Fragment ရဲ့ တိုက်ရိုက် children တွေကိုပဲ ကြည့်တာ မဟုတ်ဘဲ — nested children အားလုံးကို depth-first ရှာဖွေပါတယ်။ `focusLast()` က အပြန်အလှန် (reverse) အနေနဲ့ အလုပ်လုပ်ပြီး — `blur()` ကတော့ လက်ရှိ focus ဖြစ်နေတဲ့ element က Fragment အတွင်းမှာ ရှိနေရင် focus ကို ဖယ်ရှားပါတယ်။

### *(Canary)* Element တစ်စုကို view ထဲ ရောက်အောင် scroll လုပ်ခြင်း (Scrolling a group of elements into view)

Wrapper element မလိုဘဲ — Fragment ရဲ့ children တွေကို view ထဲ ရောက်အောင် scroll လုပ်ဖို့ `scrollIntoView` ကို သုံးပါ။ ပထမ child ကို ထိပ်ဆီ scroll လုပ်ဖို့ `true` ကို ပို့ပါ (ဒါမှမဟုတ် argument မပေးပါနဲ့)။ နောက်ဆုံး child ကို အောက်ခြေဆီ scroll လုပ်ဖို့ `false` ကို ပို့ပါ:

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

### *(Canary)* Wrapper element မလိုဘဲ မြင်နိုင်မှု (visibility) ကို စောင့်ကြည့်ခြင်း (Observing visibility without a wrapper element)

Fragment တစ်ခုရဲ့ first-level DOM children အားလုံးဆီ `IntersectionObserver` တစ်ခုကို ချိတ်ဖို့ `observeUsing` ကို သုံးပါ။ ဒါက — child components တွေက `ref`s တွေ ထုတ်ပေးဖို့ (သို့) wrapper element တစ်ခု ထည့်ဖို့ မလိုဘဲ — မြင်နိုင်မှုကို ခြေရာခံနိုင်စေပါတယ်:

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

### *(Canary)* Global IntersectionObserver တစ်ခုကို cache လုပ်ခြင်း (Caching a global IntersectionObserver)

Observers အများကြီး ရှိတဲ့ site တွေအတွက် အသုံးများတဲ့ performance optimization တစ်ခုက — config တစ်ခုစီအတွက် IntersectionObserver တစ်ခုတည်းကို မျှဝေပြီး — ဘယ် element က intersect ဖြစ်လဲပေါ် မူတည်ပြီး သူ့ရဲ့ entries တွေကို မှန်ကန်တဲ့ callbacks တွေဆီ လမ်းကြောင်းပြောင်းပေးတာပါ။ Fragment ရဲ့ `ref`s တွေက `reactFragments` property ကနေတစ်ဆင့် — ဒီ pattern အတိုင်း လုပ်ဆောင်နိုင်စေပါတယ်။

`ref` ပါတဲ့ Fragment တစ်ခုရဲ့ first-level DOM child တစ်ခုချင်းစီမှာ `reactFragments` property တစ်ခု ရှိပါတယ် — အဲဒီ element ကို ပါဝင်စေတဲ့ `FragmentInstance` objects တွေရဲ့ `Set` တစ်ခုပါ။ Shared observer က fire ဖြစ်တဲ့အခါ — ဒီ property ကို သုံးပြီး — intersect ဖြစ်နေတဲ့ element ကို ဘယ် `FragmentInstance` က ပိုင်ဆိုင်လဲ ရှာဖွေပြီး — မှန်ကန်တဲ့ callbacks တွေကို run လုပ်နိုင်ပါတယ်။

```js src/App.js
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

Options အတူတူ ရှိတဲ့ `ObservedGroup` components အများကြီးက — `IntersectionObserver` တစ်ခုတည်းကို ပြန်သုံး (reuse) ပါတယ်။ Section တစ်ခုခုက view ထဲ ရောက်လာတဲ့အခါ — shared observer က fire ဖြစ်ပြီး — entry ကို မှန်ကန်တဲ့ callback ဆီ လမ်းကြောင်းပြောင်းဖို့ `reactFragments` ကို သုံးပါတယ်။
