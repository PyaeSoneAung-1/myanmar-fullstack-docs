---
title: "Refs နဲ့ DOM ကို ပြုလုပ်ခြင်း (Manipulating the DOM)"
description: "ref attribute နဲ့ React က စီမံထားတဲ့ DOM node တွေကို ဝင်ရောက်ခြင်း — focus လုပ်ခြင်း၊ scroll လုပ်ခြင်း၊ တခြား component ရဲ့ DOM node တွေကို ဝင်ရောက်ခြင်းနဲ့ React ရဲ့ DOM ကို ဘယ်အချိန် ပြုပြင်လို့ ရလဲ"
order: 14
source: "https://react.dev/learn/manipulating-the-dom-with-refs"
status: translated
updated: 2026-09-01
---

React က သင့် render output နဲ့ ကိုက်ညီအောင် [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) ကို အလိုအလျောက် update လုပ်ပေးတာမို့ — သင့် component တွေက DOM ကို မကြာခဏ ပြုလုပ်ဖို့ မလိုပါဘူး။ ဒါပေမယ့် — တခါတရံ React က စီမံထားတဲ့ DOM element တွေကို ဝင်ရောက်ဖို့ လိုအပ်နိုင်ပါတယ် — ဥပမာ — node တစ်ခုကို focus လုပ်ဖို့၊ အဲဒါဆီ scroll လုပ်ဖို့၊ ဒါမှမဟုတ် သူ့ရဲ့ အရွယ်အစားနဲ့ နေရာကို တိုင်းတာဖို့ပေါ့။ ဒီလိုအရာတွေကို လုပ်ဖို့ React မှာ built-in နည်းလမ်း မရှိပါဘူး — ဒါကြောင့် သင်က DOM node ဆီ *ref* တစ်ခု လိုပါလိမ့်မယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- `ref` attribute နဲ့ React က စီမံထားတဲ့ DOM node တစ်ခုကို ဘယ်လို ဝင်ရောက်မလဲ
- `ref` JSX attribute က `useRef` Hook နဲ့ ဘယ်လို ဆက်စပ်လဲ
- တစ်ခြား component တစ်ခုရဲ့ DOM node ကို ဘယ်လို ဝင်ရောက်မလဲ
- React က စီမံထားတဲ့ DOM ကို ဘယ်အခြေအနေတွေမှာ ပြုပြင်တာ အန္တရာယ်ကင်းလဲ

## Node ဆီ Ref တစ်ခု ရယူခြင်း

React က စီမံထားတဲ့ DOM node တစ်ခုကို ဝင်ရောက်ဖို့ — ပထမဆုံး `useRef` Hook ကို import လုပ်ပါ:

```js
import { useRef } from 'react';
```

ပြီးရင် — သင့် component ရဲ့ အတွင်းမှာ ref တစ်ခုကို ကြေညာဖို့ အဲဒါကို သုံးပါ:

```js
const myRef = useRef(null);
```

နောက်ဆုံးမှာ — သင်က DOM node ရယူချင်တဲ့ JSX tag ဆီ `ref` attribute အဖြစ် သင့် ref ကို ပေးပါ:

```js
<div ref={myRef}>
```

`useRef` Hook က `current` လို့ ခေါ်တဲ့ property တစ်ခုတည်း ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ အစပိုင်းမှာ — `myRef.current` က `null` ဖြစ်ပါလိမ့်မယ်။ React က ဒီ `<div>` အတွက် DOM node တစ်ခု ဖန်တီးတဲ့အခါ — React က ဒီ node ဆီ ညွှန်တဲ့ reference တစ်ခုကို `myRef.current` ထဲ ထည့်ပေးပါလိမ့်မယ်။ ပြီးရင် — ဒီ DOM node ကို သင့် [event handlers](/docs/react/events) တွေကနေ ဝင်ရောက်ပြီး — အဲဒီပေါ်မှာ သတ်မှတ်ထားတဲ့ built-in [browser APIs](https://developer.mozilla.org/docs/Web/API/Element) တွေကို သုံးနိုင်ပါတယ်။

```js
// You can use any browser APIs, for example:
myRef.current.scrollIntoView();
```

### ဥပမာ — Text Input တစ်ခုကို Focus လုပ်ခြင်း

ဒီဥပမာမှာ — button ကို နှိပ်လိုက်တာက input ကို focus လုပ်ပေးပါတယ်:

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

ဒါကို implement လုပ်ဖို့:

1. `useRef` Hook နဲ့ `inputRef` ကို ကြေညာပါ။
2. အဲဒါကို `<input ref={inputRef}>` အဖြစ် ပေးပါ။ ဒါက React ကို **ဒီ `<input>` ရဲ့ DOM node ကို `inputRef.current` ထဲ ထည့်ပေးဖို့** ပြောတာပါ။
3. `handleClick` function ထဲမှာ — `inputRef.current` ကနေ input DOM node ကို ဖတ်ပြီး — `inputRef.current.focus()` နဲ့ [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) ကို ခေါ်ပါ။
4. `handleClick` event handler ကို `onClick` နဲ့ `<button>` ဆီ ပေးပါ။

DOM manipulation က refs တွေအတွက် အသုံးအများဆုံး ကိစ္စဖြစ်ပေမယ့် — `useRef` Hook ကို React ရဲ့ အပြင်ဘက်မှာ timer ID တွေလိုမျိုး တခြားအရာတွေ သိမ်းဖို့လည်း သုံးနိုင်ပါတယ်။ State လိုပဲ — refs တွေက render တွေကြားမှာ တည်မြဲနေပါတယ်။ Refs တွေက — set လုပ်လိုက်ရင် re-render မဖြစ်စေတဲ့ state variables တွေလိုမျိုးပါ။ Refs အကြောင်း အသေးစိတ်ကို [Referencing Values with Refs](/docs/react/referencing-values-with-refs) မှာ ဖတ်ပါ။

### ဥပမာ — Element တစ်ခုဆီ Scroll လုပ်ခြင်း

Component တစ်ခုထဲမှာ ref တစ်ခုထက် ပိုပြီး ရှိနိုင်ပါတယ်။ ဒီဥပမာမှာ — ပုံ သုံးပုံပါတဲ့ carousel တစ်ခု ရှိပါတယ်။ Button တစ်ခုချင်းစီက — သက်ဆိုင်ရာ DOM node ပေါ်မှာ browser ရဲ့ [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) method ကို ခေါ်ခြင်းဖြင့် ပုံတစ်ပုံကို အလယ်တည့်တည့် ရောက်အောင် လုပ်ပါတယ်:

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
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

#### Ref Callback သုံးပြီး Ref List တစ်ခုကို စီမံနည်း

အထက်ပါ ဥပမာတွေမှာ — ref အရေအတွက်က ကြိုသတ်မှတ်ထားပါတယ်။ ဒါပေမယ့် — တခါတရံ list ထဲက item တစ်ခုချင်းစီအတွက် ref တစ်ခု လိုနိုင်ပြီး — ဘယ်လောက်များများ ရှိမယ်ဆိုတာ သင်မသိနိုင်ပါဘူး။ ဒီလိုမျိုး ရေးတာက **အလုပ်မလုပ်ပါဘူး:**

```js
<ul>
  {items.map((item) => {
    // Doesn't work!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

ဒါက **Hooks တွေကို သင့် component ရဲ့ အပေါ်ဆုံးအဆင့် (top-level) မှာပဲ ခေါ်ရလို့ပါ။** Loop တစ်ခု၊ condition တစ်ခု ဒါမှမဟုတ် `map()` ခေါ်မှုရဲ့ အတွင်းမှာ `useRef` ကို ခေါ်လို့ မရပါဘူး။

ဒါကို ရှောင်နိုင်တဲ့ နည်းတစ်ခုက — သူတို့ရဲ့ parent element ဆီ ref တစ်ခုတည်း ရယူပြီး — [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) လိုမျိုး DOM manipulation methods တွေကို သုံးပြီး — child node တစ်ခုချင်းစီကို သူ့ကနေ "ရှာဖွေ" ခြင်းပါ။ ဒါပေမယ့် — ဒါက ပျက်စီးလွယ်ပြီး — သင့် DOM structure ပြောင်းလဲရင် ပျက်သွားနိုင်ပါတယ်။

နောက်ထပ် ဖြေရှင်းနည်းတစ်ခုက **`ref` attribute ဆီ function တစ်ခုကို ပေးလိုက်ခြင်းပါ။** ဒါကို [`ref` callback](/docs/react/useRef) လို့ ခေါ်ပါတယ်။ React က ref ကို set လုပ်ဖို့ အချိန်ကျရင် သင့် ref callback ကို DOM node နဲ့အတူ ခေါ်ပြီး — clear လုပ်ဖို့ အချိန်ကျရင် callback ကနေ ပြန်လာတဲ့ cleanup function ကို ခေါ်ပါတယ်။ ဒါက သင့်ကိုယ်ပိုင် array တစ်ခု ဒါမှမဟုတ် [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) တစ်ခုကို ထိန်းသိမ်းနိုင်စေပြီး — ref တစ်ခုခုကို သူ့ရဲ့ index ဒါမှမဟုတ် ID တစ်မျိုးမျိုးနဲ့ ဝင်ရောက်နိုင်စေပါတယ်။

ဒီဥပမာက — ရှည်လျားတဲ့ list တစ်ခုထဲက node တစ်ခုခုဆီ scroll လုပ်ဖို့ ဒီနည်းလမ်းကို ဘယ်လို သုံးနိုင်လဲ ပြပါတယ်:

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
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

ဒီဥပမာမှာ — `itemsRef` က DOM node တစ်ခုတည်းကို မကိုင်ထားပါဘူး။ အဲဒီအစား — item ID ကနေ DOM node ဆီ ညွှန်တဲ့ [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) တစ်ခုကို ကိုင်ထားပါတယ်။ ([Refs တွေက ဘာတန်ဖိုးမဆို ကိုင်ထားနိုင်ပါတယ်!](/docs/react/referencing-values-with-refs)) List item တိုင်းပေါ်က [`ref` callback](/docs/react/useRef) က Map ကို update လုပ်ဖို့ ဂရုစိုက်ပါတယ်:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

ဒါက နောက်ပိုင်းမှာ Map ကနေ DOM node တစ်ခုချင်းစီကို ဖတ်နိုင်စေပါတယ်။

> **မှတ်ချက်:** Strict Mode ဖွင့်ထားရင် — ref callbacks တွေက development ထဲမှာ နှစ်ခါ အလုပ်လုပ်ပါလိမ့်မယ်။
>
> Ref callbacks တွေကို ပြန်လည်လုပ်ဆောင်ခြင်းက [bug တွေကို ရှာဖွေတွေ့ရှိစေပုံ](/docs/react/strict-mode) အကြောင်း ပိုဖတ်ပါ။

## တစ်ခြား Component တစ်ခုရဲ့ DOM Nodes တွေကို ဝင်ရောက်ခြင်း

> **သတိပြုရန်:** Refs တွေက escape hatch တစ်ခုပါ။ တစ်ခြား component တစ်ခုရဲ့ DOM nodes တွေကို ကိုယ်တိုင် ပြုလုပ်တာက သင့် code ကို ပျက်စီးလွယ် (fragile) ဖြစ်စေနိုင်ပါတယ်။

Refs တွေကို [တခြား prop တွေလိုပဲ](/docs/react/passing-props-to-a-component) parent component ကနေ child component တွေဆီ ပို့ပေးနိုင်ပါတယ်။

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

အထက်ပါ ဥပမာမှာ — ref တစ်ခုကို parent component ဖြစ်တဲ့ `MyForm` မှာ ဖန်တီးပြီး — child component ဖြစ်တဲ့ `MyInput` ဆီ ပို့ပေးပါတယ်။ `MyInput` က ref ကို `<input>` ဆီ ဆက်ပို့ပေးပါတယ်။ `<input>` က [built-in component](/docs/react/built-in-components) တစ်ခုဖြစ်တာမို့ — React က ref ရဲ့ `.current` property ကို `<input>` DOM element နဲ့ set လုပ်ပါတယ်။

`MyForm` မှာ ဖန်တီးထားတဲ့ `inputRef` က အခု `MyInput` က ပြန်ပေးတဲ့ `<input>` DOM element ဆီ ညွှန်ပါတယ်။ `MyForm` မှာ ဖန်တီးထားတဲ့ click handler တစ်ခုက `inputRef` ကို ဝင်ရောက်ပြီး — `<input>` ပေါ်မှာ focus ထားဖို့ `focus()` ကို ခေါ်နိုင်ပါတယ်။

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

#### Imperative Handle တစ်ခုနဲ့ API ရဲ့ အစိတ်အပိုင်းတစ်ခုကို ထုတ်ဖော်ခြင်း

အထက်ပါ ဥပမာမှာ — `MyInput` ဆီ ပို့ထားတဲ့ ref ကို မူရင်း DOM input element ဆီ ဆက်ပို့ပါတယ်။ ဒါက parent component က `focus()` ကို ခေါ်နိုင်စေပါတယ်။ ဒါပေမယ့် — ဒါက parent component က တခြားအရာတွေလည်း လုပ်နိုင်စေပါတယ် — ဥပမာ — သူ့ရဲ့ CSS styles တွေကို ပြောင်းတာမျိုးပေါ့။ ရှားပါးတဲ့ အခြေအနေတွေမှာ — ထုတ်ဖော်ထားတဲ့ လုပ်ဆောင်နိုင်စွမ်းကို ကန့်သတ်ချင်နိုင်ပါတယ်။ [`useImperativeHandle`](/docs/react/use-imperative-handle) နဲ့ ဒါကို လုပ်နိုင်ပါတယ်:

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

ဒီမှာ — `MyInput` ရဲ့ အတွင်းက `realInputRef` က တကယ့် input DOM node ကို ကိုင်ထားပါတယ်။ ဒါပေမယ့် — [`useImperativeHandle`](/docs/react/use-imperative-handle) က React ကို — parent component ဆီ ref တစ်ခုရဲ့ တန်ဖိုးအဖြစ် သင်ကိုယ်တိုင်ရဲ့ အထူး object တစ်ခုကို ပေးဖို့ ညွှန်ကြားပါတယ်။ ဒါကြောင့် — `Form` component ရဲ့ အတွင်းက `inputRef.current` မှာ `focus` method ပဲ ရှိပါလိမ့်မယ်။ ဒီကိစ္စမှာ — ref "handle" က DOM node မဟုတ်ဘဲ — [`useImperativeHandle`](/docs/react/use-imperative-handle) ခေါ်မှုရဲ့ အတွင်းမှာ သင်ဖန်တီးထားတဲ့ custom object ပါ။

## React က Refs တွေကို ဘယ်အချိန် Attach လုပ်လဲ

React မှာ — update တိုင်းကို [အဆင့် နှစ်ဆင့်](/docs/react/render-and-commit) ခွဲထားပါတယ်:

* **render** အတွင်း — React က screen ပေါ်မှာ ဘာတွေ ရှိသင့်လဲ ဆုံးဖြတ်ဖို့ သင့် component တွေကို ခေါ်ပါတယ်။
* **commit** အတွင်း — React က DOM ဆီ အပြောင်းအလဲတွေကို သက်ရောက်စေပါတယ်။

ယေဘုယျအားဖြင့် — rendering အတွင်း refs တွေကို ဝင်ရောက်ဖို့ [မလိုချင်ပါဘူး](/docs/react/referencing-values-with-refs#best-practices-for-refs)။ DOM nodes တွေကို ကိုင်ထားတဲ့ refs တွေလည်း အပါအဝင်ပါ။ ပထမဆုံး render အတွင်း — DOM nodes တွေက မဖန်တီးရသေးလို့ — `ref.current` က `null` ဖြစ်ပါလိမ့်မယ်။ Update တွေရဲ့ rendering အတွင်းမှာလည်း — DOM nodes တွေက update မဖြစ်ရသေးပါဘူး။ ဒါကြောင့် — သူတို့ကို ဖတ်ဖို့ စောလွန်းပါတယ်။

React က commit အတွင်းမှာ `ref.current` ကို set လုပ်ပါတယ်။ DOM ကို update မလုပ်ခင် — React က သက်ရောက်မှုရှိတဲ့ `ref.current` တန်ဖိုးတွေကို `null` ဖြစ်အောင် set လုပ်ပါတယ်။ DOM ကို update လုပ်ပြီးတာနဲ့ — React က သူတို့ကို သက်ဆိုင်ရာ DOM nodes တွေနဲ့ ချက်ချင်း set လုပ်ပါတယ်။

**ပုံမှန်အားဖြင့် — refs တွေကို event handlers တွေကနေ ဝင်ရောက်ပါလိမ့်မယ်။** Ref တစ်ခုနဲ့ တစ်ခုခု လုပ်ချင်ပေမယ့် — အဲဒါလုပ်ဖို့ တိကျတဲ့ event တစ်ခု မရှိဘူးဆိုရင် — Effect တစ်ခု လိုအပ်နိုင်ပါတယ်။ Effects တွေအကြောင်း နောက်စာမျက်နှာတွေမှာ ဆွေးနွေးပါမယ်။

#### flushSync နဲ့ State Updates တွေကို Synchronously Flush လုပ်ခြင်း

Todo အသစ်တစ်ခု ထည့်ပြီး — screen ကို list ရဲ့ နောက်ဆုံး child ဆီ အောက်ကို scroll လုပ်တဲ့ code ဒီလိုမျိုး စဉ်းစားကြည့်ပါ။ တစ်ချို့အကြောင်းပြချက်ကြောင့် — နောက်ဆုံး ထည့်လိုက်တဲ့ todo ရဲ့ *အရှေ့တစ်ခု* ဆီ အမြဲ scroll ဖြစ်သွားတာ သတိပြုပါ:

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

ပြဿနာက ဒီ line နှစ်ကြောင်းမှာပါ:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React မှာ — [state updates တွေက queue တင်ထားပါတယ်](/docs/react/queueing-a-series-of-state-updates)။ ပုံမှန်အားဖြင့် — ဒါက သင်လိုချင်တာပါ။ ဒါပေမယ့် — ဒီမှာ ပြဿနာဖြစ်စေပါတယ် — ဘာလို့လဲဆိုတော့ `setTodos` က DOM ကို ချက်ချင်း update မလုပ်လို့ပါ။ ဒါကြောင့် — list ကို သူ့ရဲ့ နောက်ဆုံး element ဆီ scroll လုပ်တဲ့အချိန်မှာ — todo က မထည့်ရသေးပါဘူး။ ဒါကြောင့် — scroll လုပ်တာက item တစ်ခုစာ အမြဲ "နောက်ကျနေတာ" ပါ။

ဒီပြဿနာကို ဖြေရှင်းဖို့ — React ကို DOM ကို synchronously update ("flush") လုပ်ဖို့ အတင်းလုပ်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ — `react-dom` ကနေ `flushSync` ကို import လုပ်ပြီး — **state update ကို** `flushSync` ခေါ်မှုတစ်ခုထဲ **ထုပ်ပေးပါ**:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

ဒါက React ကို — `flushSync` ထဲမှာ ထုပ်ထားတဲ့ code လုပ်ဆောင်ပြီးတာနဲ့ — DOM ကို synchronously update လုပ်ဖို့ ညွှန်ကြားပါလိမ့်မယ်။ ရလဒ်အနေနဲ့ — သင်အဲဒါဆီ scroll လုပ်ဖို့ ကြိုးစားတဲ့အချိန်မှာတော့ — နောက်ဆုံး todo က DOM ထဲမှာ ရှိနေပါပြီ:

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

## Refs နဲ့ DOM Manipulation အတွက် အကောင်းဆုံး အလေ့အကျင့်များ

Refs တွေက escape hatch တစ်ခုပါ။ သင်က "React ရဲ့ အပြင်ဘက်ကို ထွက်" ဖို့ လိုတဲ့အခါမှပဲ သုံးသင့်ပါတယ်။ ဒီလိုအခြေအနေတွေရဲ့ သာမန်ဥပမာတွေက — focus စီမံခြင်း၊ scroll position စီမံခြင်း၊ ဒါမှမဟုတ် React က ထုတ်မပြတဲ့ browser APIs တွေကို ခေါ်ခြင်းပါ။

Focusing နဲ့ scrolling လိုမျိုး — မဖျက်ဆီးတတ်တဲ့ (non-destructive) လုပ်ဆောင်ချက်တွေကိုပဲ လုပ်နေရင် — ပြဿနာတွေ ကြုံစရာ မလိုပါဘူး။ ဒါပေမယ့် — DOM ကို ကိုယ်တိုင် **ပြုပြင်** ဖို့ ကြိုးစားရင် — React က လုပ်နေတဲ့ အပြောင်းအလဲတွေနဲ့ ထိပ်တိုက် တိုက်မိနိုင်ပါတယ်။

ဒီပြဿနာကို သရုပ်ပြဖို့ — ဒီဥပမာမှာ ကြိုဆိုရေး message တစ်ခုနဲ့ button နှစ်ခု ပါပါတယ်။ ပထမ button က React မှာ ပုံမှန် လုပ်သလိုပဲ — [conditional rendering](/docs/react/conditional-rendering) နဲ့ [state](/docs/react/state-a-components-memory) သုံးပြီး သူ့ရဲ့ ရှိ/မရှိကို ပြောင်းပါတယ်။ ဒုတိယ button က React ရဲ့ ထိန်းချုပ်မှု ပြင်ပကနေ အတင်းဖယ်ရှားဖို့ [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) ကို သုံးပါတယ်။

"Toggle with setState" ကို အကြိမ်အနည်းငယ် နှိပ်ကြည့်ပါ။ Message က ပျောက်ပြီး ပြန်ပေါ်လာပါလိမ့်မယ်။ ပြီးရင် "Remove from the DOM" ကို နှိပ်ပါ။ ဒါက သူ့ကို အတင်းဖယ်ရှားပါလိမ့်မယ်။ နောက်ဆုံးမှာ — "Toggle with setState" ကို နှိပ်ပါ:

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```
```css
p,
button {
  display: block;
  margin: 10px;
}
```

DOM element ကို ကိုယ်တိုင် ဖယ်ရှားပြီးတဲ့အခါ — သူ့ကို ပြန်ပြဖို့ `setState` သုံးဖို့ ကြိုးစားရင် crash ဖြစ်သွားပါလိမ့်မယ်။ ဒါက သင်က DOM ကို ပြောင်းလိုက်လို့ပါ — ပြီးတော့ React က အဲဒါကို ဆက်ပြီး မှန်မှန်ကန်ကန် စီမံနည်းကို မသိတော့ပါဘူး။

**React က စီမံထားတဲ့ DOM nodes တွေကို ပြောင်းလဲတာ ရှောင်ပါ။** React က စီမံထားတဲ့ elements တွေကို ပြုပြင်တာ၊ children တွေ ထည့်တာ၊ ဒါမှမဟုတ် ဖယ်ရှားတာက — အပေါ်က ဥပမာလိုမျိုး — ညီညွတ်မှုမရှိတဲ့ visual results တွေ ဒါမှမဟုတ် crash တွေ ဖြစ်စေနိုင်ပါတယ်။

ဒါပေမယ့် — ဒါက လုံးဝ မလုပ်နိုင်ဘူးလို့ ဆိုလိုတာ မဟုတ်ပါဘူး။ သတိထားဖို့ လိုပါတယ်။ **React က update လုပ်ဖို့ *အကြောင်းပြချက် မရှိတဲ့* DOM ရဲ့ အစိတ်အပိုင်းတွေကို သင်ဘေးကင်းစွာ ပြုပြင်နိုင်ပါတယ်။** ဥပမာ — JSX ထဲမှာ `<div>` တစ်ခုက အမြဲတမ်း ဗလာဖြစ်နေရင် — React က သူ့ရဲ့ children list ကို ထိစရာ အကြောင်းပြချက် မရှိပါဘူး။ ဒါကြောင့် — အဲဒီနေရာမှာ elements တွေကို ကိုယ်တိုင် ထည့်တာ ဒါမှမဟုတ် ဖယ်ရှားတာက အန္တရာယ်ကင်းပါတယ်။

## အကျဉ်းချုပ်

- Refs တွေက generic concept တစ်ခုပါ — ဒါပေမယ့် အများဆုံးတော့ DOM elements တွေကို ကိုင်ထားဖို့ သုံးပါလိမ့်မယ်။
- `<div ref={myRef}>` ပေးလိုက်ခြင်းဖြင့် — DOM node တစ်ခုကို `myRef.current` ထဲ ထည့်ဖို့ React ကို ညွှန်ကြားပါတယ်။
- ပုံမှန်အားဖြင့် — refs တွေကို focusing၊ scrolling၊ DOM elements တွေကို တိုင်းတာခြင်းလိုမျိုး — non-destructive လုပ်ဆောင်ချက်တွေအတွက် သုံးပါလိမ့်မယ်။
- Component တစ်ခုက သူ့ရဲ့ DOM nodes တွေကို ပုံမှန်အားဖြင့် ထုတ်မပြပါဘူး။ `ref` prop ကို သုံးခြင်းဖြင့် DOM node တစ်ခု ထုတ်ပြဖို့ ရွေးချယ်နိုင်ပါတယ်။
- React က စီမံထားတဲ့ DOM nodes တွေကို ပြောင်းလဲတာ ရှောင်ပါ။
- React က စီမံထားတဲ့ DOM nodes တွေကို ပြုပြင်မိရင် — React က update လုပ်ဖို့ အကြောင်းပြချက် မရှိတဲ့ အစိတ်အပိုင်းတွေကိုပဲ ပြုပြင်ပါ။

## စိန်ခေါ်မှုများ (Challenges)

### Video ကို Play နဲ့ Pause လုပ်ခြင်း

ဒီဥပမာမှာ — button က state variable တစ်ခုကို toggle လုပ်ပြီး — playing နဲ့ paused state ကြား ပြောင်းပါတယ်။ ဒါပေမယ့် — video ကို တကယ် play ဒါမှမဟုတ် pause လုပ်ဖို့ဆိုရင် — state toggle လုပ်ရုံနဲ့ မလုံလောက်ပါဘူး။ `<video>` အတွက် DOM element ပေါ်မှာ [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) နဲ့ [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) တွေကိုလည်း ခေါ်ဖို့ လိုပါတယ်။ အဲဒါဆီ ref တစ်ခု ထည့်ပြီး — button ကို အလုပ်လုပ်အောင် လုပ်ပါ။

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```
```css
button { display: block; margin-bottom: 20px; }
```

နောက်ထပ် စိန်ခေါ်မှုတစ်ခုအနေနဲ့ — အသုံးပြုသူက video ပေါ်မှာ right-click လုပ်ပြီး browser ရဲ့ built-in media controls တွေနဲ့ play လုပ်ရင်တောင် — "Play" button က video playing ဖြစ်မဖြစ်နဲ့ အမြဲ sync ဖြစ်နေအောင် လုပ်ပါ။ ဒါလုပ်ဖို့ video ပေါ်မှာ `onPlay` နဲ့ `onPause` တွေကို နားထောင်ဖို့ လိုနိုင်ပါတယ်။

#### အဖြေ

Ref တစ်ခုကို ကြေညာပြီး `<video>` element ပေါ်မှာ တင်ပါ။ ပြီးရင် — နောက် state အပေါ် မူတည်ပြီး event handler ထဲမှာ `ref.current.play()` နဲ့ `ref.current.pause()` တွေကို ခေါ်ပါ။

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```
```css
button { display: block; margin-bottom: 20px; }
```

Browser ရဲ့ built-in controls တွေကို ကိုင်တွယ်ဖို့ — `<video>` element ပေါ်မှာ `onPlay` နဲ့ `onPause` handlers တွေ ထည့်ပြီး — သူတို့ကနေ `setIsPlaying` ကို ခေါ်နိုင်ပါတယ်။ ဒီနည်းနဲ့ — အသုံးပြုသူက browser controls တွေနဲ့ video ကို play လုပ်ရင် — state က လိုက်လျောညီထွေ ပြောင်းလဲပါလိမ့်မယ်။

### Search Field ကို Focus လုပ်ခြင်း

"Search" button ကို နှိပ်တာက field ကို focus ဖြစ်စေအောင် လုပ်ပါ။

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```
```css
button { display: block; margin-bottom: 10px; }
```

#### အဖြေ

Input ဆီ ref တစ်ခု ထည့်ပြီး — အဲဒါကို focus လုပ်ဖို့ DOM node ပေါ်မှာ `focus()` ကို ခေါ်ပါ:

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```
```css
button { display: block; margin-bottom: 10px; }
```

### Image Carousel တစ်ခုကို Scroll လုပ်ခြင်း

ဒီ image carousel မှာ active image ကို ပြောင်းပေးတဲ့ "Next" button တစ်ခု ပါပါတယ်။ Click လုပ်တဲ့အခါ gallery က active image ဆီ အလျားလိုက် scroll ဖြစ်အောင် လုပ်ပါ။ Active image ရဲ့ DOM node ပေါ်မှာ [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) ကို ခေါ်ဖို့ လိုပါလိမ့်မယ်:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

> **အရိပ်အမြွက်:** ဒီလေ့ကျင့်ခန်းအတွက် ပုံတိုင်းဆီ ref တစ်ခုစီ ရှိဖို့ မလိုပါဘူး။ လက်ရှိ active image ဆီ ref တစ်ခု ဒါမှမဟုတ် list ကိုယ်တိုင်ဆီ ref တစ်ခု ရှိရင် လုံလောက်ပါတယ်။ သင်က scroll လုပ်ခင် *မှာ* DOM ကို update ဖြစ်အောင် သေချာစေဖို့ `flushSync` ကို သုံးပါ။

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

#### အဖြေ

`selectedRef` တစ်ခုကို ကြေညာပြီး — လက်ရှိပုံဆီပဲ သတ်မှတ်ချက်အရ (conditionally) ပေးနိုင်ပါတယ်:

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i` ဖြစ်တဲ့အခါ — ဆိုလိုတာက ပုံက ရွေးထားတဲ့ပုံ ဖြစ်တဲ့အခါ — `<li>` က `selectedRef` ကို လက်ခံရရှိပါလိမ့်မယ်။ React က `selectedRef.current` က မှန်ကန်တဲ့ DOM node ဆီ အမြဲ ညွှန်နေအောင် သေချာလုပ်ပါလိမ့်မယ်။

Scroll မလုပ်ခင် DOM ကို update လုပ်ဖို့ React ကို အတင်းလုပ်ဖို့ — `flushSync` ခေါ်မှု လိုအပ်တာ သတိပြုပါ။ မဟုတ်ရင် — `selectedRef.current` က အရင်ရွေးထားတဲ့ item ဆီ အမြဲ ညွှန်နေပါလိမ့်မယ်။

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

### Component တွေ သီးခြားခွဲထားတဲ့ Search Field ကို Focus လုပ်ခြင်း

"Search" button ကို နှိပ်တာက field ကို focus ဖြစ်စေအောင် လုပ်ပါ။ Component တစ်ခုချင်းစီကို file သီးခြားစီမှာ သတ်မှတ်ထားပြီး — အဲဒီကနေ ရွှေ့လို့ မရဘူးဆိုတာ သတိပြုပါ။ သူတို့ကို ဘယ်လို ချိတ်ဆက်မလဲ?

> **အရိပ်အမြွက်:** `SearchInput` လိုမျိုး ကိုယ်ပိုင် component တစ်ခုကနေ DOM node တစ်ခုကို ထုတ်ဖော်ဖို့ — `ref` ကို prop အဖြစ် ပို့ပေးဖို့ လိုပါလိမ့်မယ်။

```js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```
```js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```
```js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```
```css
button { display: block; margin-bottom: 10px; }
```

#### အဖြေ

`SearchButton` ဆီ `onClick` prop တစ်ခု ထည့်ဖို့ လိုပြီး — `SearchButton` က browser `<button>` ဆီ အောက်ကို ဆက်ပို့ပေးဖို့ လုပ်ပါ။ `<SearchInput>` ဆီလည်း ref တစ်ခု ပို့ပေးဖို့ လိုပါမယ် — အဲဒါက တကယ့် `<input>` ဆီ ဆက်ပို့ပြီး populate လုပ်ပါလိမ့်မယ်။ နောက်ဆုံးမှာ — click handler ထဲမှာ — အဲဒီ ref ထဲမှာ သိမ်းထားတဲ့ DOM node ပေါ်မှာ `focus` ကို ခေါ်ပါ။

```js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```
```js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```
```js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```
```css
button { display: block; margin-bottom: 10px; }
```
