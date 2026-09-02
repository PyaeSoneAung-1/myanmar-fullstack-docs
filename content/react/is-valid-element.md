---
title: "isValidElement"
description: "Value တစ်ခုက React element ဟုတ်မဟုတ် စစ်ဆေးပေးတဲ့ API — JSX tags နဲ့ createElement ရလဒ်များသာ React elements အဖြစ် သတ်မှတ်ခံရခြင်း၊ React elements vs React nodes ခွဲခြားမှု အပါအဝင် parameters/returns/caveats"
order: 88
source: "https://react.dev/reference/react/isValidElement"
status: translated
updated: 2026-09-02
---

`isValidElement` က — value တစ်ခုက React element ဟုတ်မဟုတ် စစ်ဆေးပေးပါတယ်။

```js
const isElement = isValidElement(value)
```

## ရည်ညွှန်းချက် (Reference)

### `isValidElement(value)`

`value` တစ်ခုက React element ဟုတ်မဟုတ် စစ်ဆေးဖို့ `isValidElement(value)` ကို ခေါ်ပါ။

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements တွေပါ
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ React elements တွေ မဟုတ်ပါဘူး
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

#### Parameters (ပါရာမီတာများ)

- `value`: သင်စစ်ဆေးချင်တဲ့ `value`။ Type မရွေး ဘာ value မဆို ဖြစ်နိုင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`isValidElement` က — `value` က React element ဖြစ်ရင် `true` ကို ပြန်ပေးပြီး — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- **[JSX tags](https://react.dev/learn/writing-markup-with-jsx) တွေနဲ့ [`createElement`](/docs/react/create-element) က ပြန်ပေးတဲ့ objects တွေပဲ** React elements အဖြစ် သတ်မှတ်ခံရပါတယ်။ ဥပမာ — `42` လို number တစ်ခုက valid React *node* (component ကနေ ပြန်ပေးလို့ရတဲ့အရာ) ဖြစ်ပေမယ့် — valid React element မဟုတ်ပါဘူး။ Arrays တွေနဲ့ [`createPortal`](/docs/react/create-portal) နဲ့ ဖန်တီးထားတဲ့ portals တွေလည်း React elements အဖြစ် သတ်မှတ်ခံရမှာ မဟုတ်ပါဘူး။

## အသုံးပြုပုံ (Usage)

### တစ်ခုခုက React element ဟုတ်မဟုတ် စစ်ဆေးခြင်း

တစ်ချို့ value တစ်ခုက *React element* ဟုတ်မဟုတ် စစ်ဆေးဖို့ `isValidElement` ကို ခေါ်ပါ။

React elements တွေက:

- [JSX tag](https://react.dev/learn/writing-markup-with-jsx) တစ်ခု ရေးခြင်းဖြင့် ထွက်လာတဲ့ values တွေ
- [`createElement`](/docs/react/create-element) ကို ခေါ်ခြင်းဖြင့် ထွက်လာတဲ့ values တွေ

React elements တွေအတွက် — `isValidElement` က `true` ပြန်ပေးပါတယ်:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX tags တွေက React elements တွေပါ
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ createElement က ပြန်ပေးတဲ့ values တွေက React elements တွေပါ
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Strings, numbers, ဒါမှမဟုတ် ဘယ်လို objects/arrays မဆို စတဲ့ တခြား values တွေကတော့ — React elements တွေ မဟုတ်ပါဘူး။

ဒါတွေအတွက်တော့ — `isValidElement` က `false` ပြန်ပေးပါတယ်:

```js
// ❌ ဒါတွေက React elements တွေ မဟုတ်ပါဘူး
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement` လိုအပ်တာက အရမ်း ရှားပါတယ်။ Elements တွေပဲ လက်ခံတဲ့ API တစ်ခုခု (ဥပမာ [cloneElement](https://react.dev/reference/react/cloneElement) လိုမျိုး) ကို ခေါ်နေပြီး — သင့် argument က React element မဟုတ်ရင် error တစ်ခု မဖြစ်ရလေအောင် ရှောင်ချင်တဲ့အခါမျိုးမှာ အဓိကအားဖြင့် အသုံးဝင်ပါတယ်။

`isValidElement` check တစ်ခု ထည့်ဖို့ အရမ်း သတ်သတ်မှတ်မှတ် အကြောင်းပြချက် တစ်ခုခု မရှိရင် — သင်လည်း ဒါ မလိုအပ်ပါဘူး။

### React elements vs React nodes (နက်ရှိုင်းစွာ လေ့လာခြင်း)

Component တစ်ခု ရေးတဲ့အခါ — အဲဒီကနေ *React node* ဘယ်လိုမျိုးကို မဆို ပြန်ပေးလို့ရပါတယ်:

```js
function MyComponent() {
  // ... React node ဘယ်လိုမျိုးကို မဆို ပြန်ပေးလို့ရပါတယ် ...
}
```

React node တစ်ခုက ဖြစ်နိုင်ပါတယ်:

- `<div />` ဒါမှမဟုတ် `createElement('div')` လိုမျိုး ဖန်တီးထားတဲ့ React element တစ်ခု
- [`createPortal`](/docs/react/create-portal) နဲ့ ဖန်တီးထားတဲ့ portal တစ်ခု
- String တစ်ခု
- Number တစ်ခု
- `true`, `false`, `null` ဒါမှမဟုတ် `undefined` (ပြသမခံရတဲ့ဟာတွေပါ)
- တခြား React nodes တွေရဲ့ array တစ်ခု

**`isValidElement` က argument က *React element* ဟုတ်လားဆိုတာကိုပဲ စစ်တာ ဖြစ်ပြီး — React node ဟုတ်လားဆိုတာ မစစ်ပါဘူးဆိုတာ သတိပြုပါ။** ဥပမာ — `42` က valid React element တစ်ခု မဟုတ်ပါဘူး။ ဒါပေမယ့် — သူက perfectly valid React node တစ်ခုပါ:

```js
function MyComponent() {
  return 42; // Component ကနေ number တစ်ခု ပြန်ပေးတာ ရပါတယ်
}
```

ဒါကြောင့်ပဲ — တစ်ခုခု render လုပ်လို့ ရလားဆိုတာ စစ်ဆေးဖို့ `isValidElement` ကို သုံးစရာ မလိုပါဘူး။
