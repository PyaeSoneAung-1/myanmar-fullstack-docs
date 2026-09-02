---
title: "createRef"
description: "ဘယ် value မဆို ထည့်ထားနိုင်တဲ့ ref object တစ်ခုကို ဖန်တီးပေးတဲ့ React API — class components တွေထဲမှာ အသုံးများပြီး function components တွေမှာတော့ useRef ကို ဦးစားပေး အသုံးပြုသင့်ခြင်း၊ class component တစ်ခုကနေ function component ဆီ ပြောင်းနည်း"
order: 104
source: "https://react.dev/reference/react/createRef"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန် —** `createRef` ကို [class components](/docs/react/component) တွေမှာ အဓိက သုံးပါတယ်။ Function components တွေမှာတော့ ပုံမှန်အားဖြင့် [`useRef`](/docs/react/use-ref) ကို မှီခိုပါတယ်။

`createRef` က — ဘယ် value မဆို ထည့်ထားနိုင်တဲ့ [ref](/docs/react/referencing-values-with-refs) object တစ်ခုကို ဖန်တီးပေးပါတယ်။

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

## ရည်ညွှန်းချက် (Reference)

### `createRef()`

[Class component](/docs/react/component) တစ်ခုထဲမှာ ref တစ်ခုကို ကြေညာဖို့ `createRef` ကို ခေါ်ပါတယ်:

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

အောက်မှာ ဥပမာ တွေ ထပ်ကြည့်ပါ။

#### Parameters (ပါရာမီတာများ)

`createRef` က ပါရာမီတာ ဘာမှ မလက်ခံပါဘူး။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`createRef` က property တစ်ခုတည်း ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်:

- `current` — အစပိုင်းမှာ `null` လို့ သတ်မှတ်ထားပါတယ်။ နောက်ပိုင်းမှာ တခြား တစ်ခုခုဆီ ပြောင်းလို့ရပါတယ်။ ဒီ ref object ကို JSX node တစ်ခုရဲ့ `ref` attribute အဖြစ် React ဆီ ပေးလိုက်ရင် — React က သူ့ရဲ့ `current` property ကို set လုပ်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `createRef` က *မတူညီတဲ့* object တစ်ခုကို အမြဲ ပြန်ပေးပါတယ်။ `{ current: null }` ဆိုတာကို ကိုယ်တိုင် ရေးနေတာနဲ့ ညီမျှပါတယ်။
- Function component တစ်ခုမှာတော့ — object တစ်ခုတည်းကို အမြဲ ပြန်ပေးတဲ့ [`useRef`](/docs/react/use-ref) ကို သုံးချင်ပါလိမ့်မယ်။
- `const ref = useRef()` ဆိုတာ `const [ref, _] = useState(() => createRef(null))` နဲ့ ညီမျှပါတယ်။

---

## အသုံးပြုပုံ (Usage)

### Class component တစ်ခုထဲမှာ ref တစ်ခု ကြေညာခြင်း

[Class component](/docs/react/component) တစ်ခုထဲမှာ ref တစ်ခု ကြေညာဖို့ — `createRef` ကို ခေါ်ပြီး — ရလဒ်ကို class field တစ်ခုဆီ assign လုပ်ပါ:

```js
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

အခု သင့် JSX ထဲက `<input>` တစ်ခုဆီ `ref={this.inputRef}` လို့ ပေးလိုက်ရင် — React က `this.inputRef.current` ကို input ရဲ့ DOM node နဲ့ ဖြည့်ပေးပါလိမ့်မယ်။ ဥပမာ — input ကို focus လုပ်ပေးတဲ့ button တစ်ခု ဘယ်လို လုပ်မလဲ ဆိုတာ ဒီမှာ ကြည့်ပါ:

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

> **သတိပြုရန် —** `createRef` ကို [class components](/docs/react/component) တွေမှာ အဓိက သုံးပါတယ်။ Function components တွေမှာတော့ ပုံမှန်အားဖြင့် [`useRef`](/docs/react/use-ref) ကို မှီခိုပါတယ်။

---

## နောက်ထပ် ရွေးစရာများ (Alternatives)

### `createRef` ပါတဲ့ class ကနေ — `useRef` ပါတဲ့ function ဆီ ပြောင်းခြင်း

Code အသစ်တွေမှာ [class components](/docs/react/component) တွေအစား function components တွေကို သုံးဖို့ အကြံပြုပါတယ်။ `createRef` သုံးထားတဲ့ class components အဟောင်းတွေ ရှိနေရင် — ဒီလို ပြောင်းနိုင်ပါတယ်။ ဒါက မူရင်း code ပါ:

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

[ဒီ component ကို class ကနေ function ဆီ ပြောင်းတဲ့အခါ](/docs/react/component) — `createRef` ခေါ်တာတွေကို [`useRef`](/docs/react/use-ref) ခေါ်တာတွေနဲ့ အစားထိုးပါ:

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
