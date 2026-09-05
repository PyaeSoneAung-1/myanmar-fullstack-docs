---
title: "JSX"
description: "JSX ဆိုတာဘာလဲ — `.tsx` files နဲ့ `jsx` option, JSX modes တွေ, `as` operator, intrinsic/value-based elements, attribute type checking, children type checking နဲ့ React integration အထိ ပြည့်စုံသော လမ်းညွှန်"
order: 58
source: "https://www.typescriptlang.org/docs/handbook/jsx.html"
status: translated
updated: 2026-09-05
---

[JSX](https://facebook.github.io/jsx/) ဆိုတာ — XML ပုံစံနဲ့ ဆင်တူတဲ့ — embed (တခြား code ထဲ ထည့်သွင်း) လုပ်လို့ရတဲ့ syntax တစ်မျိုး ဖြစ်ပါတယ်။ ၎င်းကို valid JavaScript အဖြစ် ပြောင်းလဲဖို့ ရည်ရွယ်ထားပေမယ့် — အဲဒီ transformation (ပြောင်းလဲခြင်း) ရဲ့ semantics ကတော့ implementation တစ်ခုနဲ့တစ်ခု မတူနိုင်ပါဘူး။ JSX က [React](https://reactjs.org/) framework နဲ့အတူ လူကြိုက်များလာခဲ့ပေမယ့် — နောက်ပိုင်းမှာ တခြား implementation တွေလည်း ပေါ်ပေါက်လာပါတယ်။ TypeScript ကတော့ JSX ကို JavaScript အဖြစ် — embedding (ထည့်သွင်းခြင်း) ၊ type checking (type စစ်ဆေးခြင်း) နဲ့ compiling (compile လုပ်ခြင်း) — အားလုံးကို တိုက်ရိုက် ထောက်ပံ့ပေးပါတယ်။

## Basic usage (အခြေခံ အသုံးပြုနည်း)

JSX ကို အသုံးပြုဖို့ဆိုရင် အချက် နှစ်ချက် လုပ်ဆောင်ရပါမယ်။

1. သင့် file တွေကို `.tsx` extension နဲ့ နာမည်ပေးပါ
2. [`jsx`](https://www.typescriptlang.org/tsconfig) option ကို enable (ဖွင့်) လုပ်ပါ

TypeScript မှာ JSX mode အများအပြား ပါဝင်ပါတယ်: `preserve` ၊ `react` (classic runtime) ၊ `react-jsx` (automatic runtime) ၊ `react-jsxdev` (automatic development runtime) နဲ့ `react-native` တို့ ဖြစ်ပါတယ်။ `preserve` mode ကတော့ JSX ကို output ရဲ့ အစိတ်အပိုင်းအဖြစ် ထိန်းသိမ်းထားပြီး — နောက်ထပ် transform step တစ်ခုက ဆက်ပြီး စီမံနိုင်အောင် ချန်ထားပါတယ် (ဥပမာ — [Babel](https://babeljs.io/))။ ထို့အပြင် output မှာ `.jsx` file extension ပါ ပါလာမှာ ဖြစ်ပါတယ်။ `react` mode ကတော့ `React.createElement` ကို emit (ထုတ်ပေး) ပြီး — အသုံးမပြုခင် JSX transformation ဖြတ်စရာ မလိုပါဘူး။ output မှာတော့ `.js` file extension ပါ ပါလာပါလိမ့်မယ်။ `react-native` mode ကတော့ JSX အားလုံးကို ထိန်းသိမ်းထားတဲ့အတွက် `preserve` နဲ့ တူညီပေမယ့် — output မှာတော့ `.js` file extension ပဲ ပါမှာ ဖြစ်ပါတယ်။

| Mode           | Input     | Output                                            | Output File Extension |
| -------------- | --------- | ------------------------------------------------- | --------------------- |
| `preserve`     | `<div />` | `<div />`                                         | `.jsx`                |
| `react`        | `<div />` | `React.createElement("div")`                      | `.js`                 |
| `react-native` | `<div />` | `<div />`                                         | `.js`                 |
| `react-jsx`    | `<div />` | `_jsx("div", {}, void 0);`                        | `.js`                 |
| `react-jsxdev` | `<div />` | `_jsxDEV("div", {}, void 0, false, {...}, this);` | `.js`                 |

ဒီ mode ကို — [`jsx`](https://www.typescriptlang.org/tsconfig) command line flag ဒါမှမဟုတ် [သင့် tsconfig.json file ထဲမှာရှိတဲ့ သက်ဆိုင်ရာ `jsx` option](https://www.typescriptlang.org/tsconfig) — နှစ်ခုအနက် တစ်ခုခုနဲ့ သတ်မှတ်နိုင်ပါတယ်။

> \*မှတ်ချက်: react JSX emit ကို ရည်ရွယ်တဲ့အခါ သုံးမယ့် JSX factory function ကို [`jsxFactory`](https://www.typescriptlang.org/tsconfig) option နဲ့ သတ်မှတ်နိုင်ပါတယ် (default ကတော့ `React.createElement` ဖြစ်ပါတယ်)

## The `as` operator (`as` operator အကြောင်း)

type assertion (type တစ်ခုကို အတည်ပြုသတ်မှတ်ခြင်း) ရေးသားပုံကို ပြန်သတိရကြည့်ရအောင်:

```ts
const foo = <Foo>bar;
```

ဒါက `bar` ဆိုတဲ့ variable မှာ `Foo` type ရှိတယ်လို့ assert (အတည်ပြု) လုပ်ပါတယ်။ TypeScript က type assertions တွေမှာ angle brackets (`< >`) တွေကိုပါ သုံးတာမို့ — ဒါတွေကို JSX ရဲ့ syntax နဲ့ ပေါင်းလိုက်ရင် parsing (ခွဲခြမ်းစိတ်ဖြာခြင်း) ဆိုင်ရာ အခက်အခဲတွေ ဖြစ်ပေါ်လာနိုင်ပါတယ်။ အကျိုးဆက်အနေနဲ့ — TypeScript က `.tsx` file တွေထဲမှာ angle bracket type assertions တွေကို ခွင့်မပြုပါဘူး။

အပေါ်က syntax ကို `.tsx` file တွေထဲမှာ သုံးလို့ မရတာမို့ — အခြားရွေးချယ်စရာ type assertion operator တစ်ခုကို သုံးသင့်ပါတယ်: `as` ပါ။ အဲဒီ ဥပမာကို `as` operator နဲ့ အလွယ်တကူ ပြန်ရေးလို့ရပါတယ်။

```ts
const foo = bar as Foo;
```

`as` operator က `.ts` ရော `.tsx` file တွေမှာပါ ရနိုင်ပြီး — angle-bracket type assertion ပုံစံနဲ့ အပြုအမူ အတူတူပဲ ဖြစ်ပါတယ်။

## Type Checking (Type စစ်ဆေးခြင်း)

JSX နဲ့ type checking လုပ်ပုံကို နားလည်ဖို့ — intrinsic elements နဲ့ value-based elements ကြားက ခြားနားချက်ကို အရင်ဆုံး နားလည်ထားရပါမယ်။ JSX expression `<expr />` တစ်ခုမှာ — `expr` က environment ထဲက မွေးရာပါ (intrinsic) အရာတစ်ခုကို ရည်ညွှန်းနိုင်သလို (ဥပမာ — DOM environment ထဲက `div` ဒါမှမဟုတ် `span`) — သင် ကိုယ်တိုင် ဖန်တီးထားတဲ့ custom component တစ်ခုကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။ ဒါက အချက် နှစ်ချက်အတွက် အရေးကြီးပါတယ်:

1. React မှာ intrinsic elements တွေကို string တွေအနေနဲ့ emit လုပ်ပါတယ် (`React.createElement("div")`) — ဒါပေမယ့် သင်ဖန်တီးထားတဲ့ component တစ်ခုကတော့ ဒီလို မဟုတ်ပါဘူး (`React.createElement(MyComponent)`)။
2. JSX element ထဲ ပေးပို့လိုက်တဲ့ attributes တွေရဲ့ types တွေကိုလည်း မတူညီတဲ့ နည်းနဲ့ ရှာဖွေသင့်ပါတယ်။ Intrinsic element ရဲ့ attributes တွေကို _intrinsically_ (မွေးရာပါအားဖြင့်) သိရှိသင့်ပြီး — component တွေကတော့ ကိုယ်ပိုင် attributes အစုတစ်စု သတ်မှတ်ချင်ကြပါလိမ့်မယ်။

TypeScript က ဒီနှစ်မျိုးကို ခွဲခြားဖို့ — [React သုံးတဲ့ convention အတိုင်းပဲ](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components) လိုက်နာပါတယ်။ Intrinsic element တစ်ခုက အမြဲတမ်း lowercase (စာလုံးအသေး) နဲ့ စပြီး — value-based element တစ်ခုကတော့ အမြဲတမ်း uppercase (စာလုံးအကြီး) နဲ့ စပါတယ်။

### The `JSX` namespace (`JSX` namespace အကြောင်း)

TypeScript ထဲက JSX ကို `JSX` namespace နဲ့ type သတ်မှတ်ပါတယ်။ `JSX` namespace ကို — `jsx` compiler option ပေါ် မူတည်ပြီး — နေရာ အမျိုးမျိုးမှာ သတ်မှတ်နိုင်ပါတယ်။

`jsx` options ဖြစ်တဲ့ `preserve` ၊ `react` နဲ့ `react-native` တို့က classic runtime အတွက် type definitions တွေကို သုံးပါတယ်။ ဆိုလိုတာက — `jsxFactory` compiler option နဲ့ သတ်မှတ်တဲ့ variable တစ်ခု scope ထဲမှာ ရှိနေဖို့ လိုအပ်ပါတယ်။ `JSX` namespace ကို JSX factory ရဲ့ အပေါ်ဆုံး (top-most) identifier ပေါ်မှာ သတ်မှတ်သင့်ပါတယ်။ ဥပမာ — React က default factory ဖြစ်တဲ့ `React.createElement` ကို သုံးပါတယ်။ ဆိုလိုတာက ၎င်းရဲ့ `JSX` namespace ကို `React.JSX` အနေနဲ့ သတ်မှတ်သင့်ပါတယ်။

```ts
export function createElement(): any;

export namespace JSX {
  // …
}
```

ပြီးတော့ user က React ကို `React` အနေနဲ့ အမြဲတမ်း import လုပ်သင့်ပါတယ်။

```ts
import * as React from 'react';
```

Preact ကတော့ JSX factory `h` ကို သုံးပါတယ်။ ဆိုလိုတာက ၎င်းရဲ့ types တွေကို `h.JSX` အနေနဲ့ သတ်မှတ်သင့်ပါတယ်။

```ts
export function h(props: any): any;

export namespace h.JSX {
  // …
}
```

User က `h` ကို import လုပ်ဖို့ named import ကို သုံးသင့်ပါတယ်။

```ts
import { h } from 'preact';
```

`react-jsx` နဲ့ `react-jsxdev` ဆိုတဲ့ `jsx` options တွေအတွက်ကတော့ — `JSX` namespace ကို ကိုက်ညီတဲ့ entry points တွေကနေ export လုပ်သင့်ပါတယ်။ `react-jsx` အတွက်ဆိုရင် `${jsxImportSource}/jsx-runtime` ဖြစ်ပြီး — `react-jsxdev` အတွက်ဆိုရင် `${jsxImportSource}/jsx-dev-runtime` ဖြစ်ပါတယ်။ ဒါတွေက file extension မသုံးတာမို့ — ESM user တွေကို ထောက်ပံ့နိုင်ဖို့ `package.json` ထဲမှာရှိတဲ့ [`exports`](https://nodejs.org/api/packages.html#exports) field ကို သေချာပေါက် အသုံးပြုရပါမယ်။

```json 
{
  "exports": {
    "./jsx-runtime": "./jsx-runtime.js",
    "./jsx-dev-runtime": "./jsx-dev-runtime.js",
  }
}
```

ပြီးရင် `jsx-runtime.d.ts` နဲ့ `jsx-dev-runtime.d.ts` တွေထဲမှာ:

```ts
export namespace JSX {
  // …
}
```

သတိပြုရမှာက — `JSX` namespace ကို export လုပ်တာက type checking အတွက် လုံလောက်ပေမယ့် — production runtime က runtime မှာ `jsx` ၊ `jsxs` နဲ့ `Fragment` exports တွေ လိုအပ်ပြီး — development runtime ကတော့ `jsxDEV` နဲ့ `Fragment` လိုအပ်ပါတယ်။ ဖြစ်နိုင်ရင် အဲဒါတွေအတွက်ပါ types တွေ ထည့်ပေးတာ အကောင်းဆုံးပါ။

`JSX` namespace က သင့်လျော်တဲ့ နေရာမှာ မရနိုင်ဘူးဆိုရင် — classic ရော automatic runtime နှစ်ခုလုံးက global `JSX` namespace ကို fall back (ပြန်လည် အသုံးပြု) လုပ်ပါတယ်။

### Intrinsic elements (Intrinsic Elements များ)

Intrinsic elements တွေကို အထူး interface ဖြစ်တဲ့ `JSX.IntrinsicElements` ပေါ်မှာ ရှာဖွေပါတယ်။ Default အားဖြင့် — ဒီ interface ကို သတ်မှတ်မထားဘူးဆိုရင် — ဘာဖြစ်ဖြစ် ခွင့်ပြုပြီး intrinsic elements တွေကို type check လုပ်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် ဒီ interface _ရှိနေရင်_ — intrinsic element ရဲ့ နာမည်ကို `JSX.IntrinsicElements` interface ပေါ်က property တစ်ခုအနေနဲ့ ရှာဖွေပါတယ်။ ဥပမာ:

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: any;
  }
}

<foo />; // ok
<bar />; // error
```

အပေါ်က ဥပမာမှာ — `<foo />` က အဆင်ပြေပြေ အလုပ်လုပ်မှာ ဖြစ်ပေမယ့် `<bar />` ကတော့ `JSX.IntrinsicElements` ပေါ်မှာ သတ်မှတ်မထားလို့ error ဖြစ်ပါလိမ့်မယ်။

> မှတ်ချက်: `JSX.IntrinsicElements` ပေါ်မှာ catch-all string indexer တစ်ခုကိုလည်း အောက်ပါအတိုင်း သတ်မှတ်နိုင်ပါတယ်:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
```

### Value-based elements (Value-based Elements များ)

Value-based elements တွေကတော့ — scope ထဲမှာ ရှိနေတဲ့ identifiers တွေနဲ့ပဲ ရိုးရှင်းစွာ ရှာဖွေပါတယ်။

```tsx
import MyComponent from "./myComponent";

<MyComponent />; // ok
<SomeOtherComponent />; // error
```

Value-based element တစ်ခုကို သတ်မှတ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

1. Function Component (FC)
2. Class Component

ဒီ value-based element အမျိုးအစား နှစ်ခုက JSX expression တစ်ခုထဲမှာ တစ်ခုနဲ့တစ်ခု ခွဲခြားလို့ မရနိုင်တာမို့ — TS က ပထမဆုံး overload resolution (overload ဖြေရှင်းခြင်း) ကို သုံးပြီး အဲဒီ expression ကို Function Component အဖြစ် resolve လုပ်ဖို့ ကြိုးစားပါတယ်။ ဒီလုပ်ငန်းစဉ် အောင်မြင်သွားရင် — TS က expression ကို ၎င်းရဲ့ declaration ဆီ resolve လုပ်ပြီး အဆုံးသတ်ပါတယ်။ value က Function Component အဖြစ် resolve မဖြစ်နိုင်ဘူးဆိုရင် — TS က နောက်တစ်ဆင့်အနေနဲ့ class component အဖြစ် resolve လုပ်ဖို့ ကြိုးစားပါတယ်။ အဲဒါတောင် မအောင်မြင်ခဲ့ရင် TS က error တစ်ခု အစီရင်ခံပါလိမ့်မယ်။

#### Function Component (Function Component များ)

နာမည်အတိုင်းပဲ — component ကို JavaScript function အဖြစ် သတ်မှတ်ပြီး — ၎င်းရဲ့ ပထမဆုံး argument က `props` object ဖြစ်ပါတယ်။ TS က ၎င်းရဲ့ return type က `JSX.Element` ဆီ assignable (အစားထိုး လက်ခံနိုင်) ရမယ်လို့ တင်းကျပ်စွာ သတ်မှတ်ပါတယ်။

```tsx
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: { name: string });
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name={prop.name} />;
}

const Button = (prop: { value: string }, context: { color: string }) => (
  <button />
);
```

Function Component က ရိုးရိုး JavaScript function တစ်ခုပဲ ဖြစ်တာမို့ — function overloads တွေကိုလည်း ဒီမှာ သုံးနိုင်ပါတယ်:

```ts twoslash
// @noErrors
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// ---cut---
interface ClickableProps {
  children: JSX.Element[] | JSX.Element;
}

interface HomeProps extends ClickableProps {
  home: JSX.Element;
}

interface SideProps extends ClickableProps {
  side: JSX.Element | string;
}

function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element;
function MainButton(prop: ClickableProps): JSX.Element {
  // ...
}
```

> မှတ်ချက်: Function Components တွေကို အရင်က Stateless Function Components (SFC) လို့ ခေါ်ခဲ့ပါတယ်။ react ရဲ့ မကြာသေးတဲ့ version တွေမှာ Function Components တွေကို stateless လို့ မယူဆနိုင်တော့တာမို့ — `SFC` type နဲ့ ၎င်းရဲ့ alias ဖြစ်တဲ့ `StatelessComponent` တို့ကို deprecated (အသုံးမပြုရန် သတ်မှတ်) လုပ်လိုက်ပါပြီ။

#### Class Component (Class Component များ)

Class component တစ်ခုရဲ့ type ကို သတ်မှတ်လို့ ရပါတယ်။ ဒါပေမယ့် အဲဒါကို လုပ်ဖို့ဆိုရင် — ဝေါဟာရ အသစ် နှစ်ခုကို နားလည်ထားတာ အကောင်းဆုံးပါ: _element class type_ (element ရဲ့ class type) နဲ့ _element instance type_ (element ရဲ့ instance type) တို့ ဖြစ်ပါတယ်။

`<Expr />` တစ်ခုအတွက် — _element class type_ ဆိုတာ `Expr` ရဲ့ type ပဲ ဖြစ်ပါတယ်။ ဒါကြောင့် အပေါ်က ဥပမာမှာ — `MyComponent` က ES6 class တစ်ခုဆိုရင် class type က အဲဒီ class ရဲ့ constructor နဲ့ statics တွေ ဖြစ်ပါလိမ့်မယ်။ `MyComponent` က factory function တစ်ခုဆိုရင် class type က အဲဒီ function ကိုယ်တိုင် ဖြစ်ပါလိမ့်မယ်။

Class type သတ်မှတ်ပြီးတာနဲ့ — instance type ကို class type ရဲ့ construct ဒါမှမဟုတ် call signatures (ဘယ်ဟာ ရှိရင် အဲဒါ) တွေရဲ့ return types တွေရဲ့ union အနေနဲ့ ဆုံးဖြတ်ပါတယ်။ ဒါကြောင့် ES6 class တစ်ခုဆိုရင် — instance type က အဲဒီ class ရဲ့ instance တစ်ခုရဲ့ type ဖြစ်ပြီး — factory function တစ်ခုဆိုရင်တော့ function ကနေ ပြန်ထုတ်ပေးတဲ့ value ရဲ့ type ဖြစ်ပါလိမ့်မယ်။

```ts
class MyComponent {
  render() {}
}

// use a construct signature
const myComponent = new MyComponent();

// element class type => MyComponent
// element instance type => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {},
  };
}

// use a call signature
const myComponent = MyFactoryFunction();

// element class type => MyFactoryFunction
// element instance type => { render: () => void }
```

Element instance type က စိတ်ဝင်စားစရာ ကောင်းပါတယ် — ဘာလို့လဲဆိုတော့ ၎င်းက `JSX.ElementClass` ဆီ assignable ဖြစ်ရမှာ ဖြစ်ပြီး — မဟုတ်ရင် error ဖြစ်လို့ပါ။ Default အားဖြင့် `JSX.ElementClass` က `{}` ဖြစ်ပေမယ့် — သင့်လျော်တဲ့ interface နဲ့ ကိုက်ညီတဲ့ types တွေအတွက်ပဲ JSX ကို ကန့်သတ်ဖို့ — အဲဒီ type ကို augment (တိုးချဲ့) လုပ်နိုင်ပါတယ်။

```tsx
declare namespace JSX {
  interface ElementClass {
    render: any;
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction() {
  return { render: () => {} };
}

<MyComponent />; // ok
<MyFactoryFunction />; // ok

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

<NotAValidComponent />; // error
<NotAValidFactoryFunction />; // error
```

### Attribute type checking (Attribute Type စစ်ဆေးခြင်း)

Attributes တွေကို type check လုပ်တဲ့အခါ ပထမဆုံး အဆင့်က — _element attributes type_ (element ရဲ့ attributes type) ကို ဆုံးဖြတ်ဖို့ ဖြစ်ပါတယ်။ ဒါက intrinsic နဲ့ value-based elements ကြားမှာ နည်းနည်း ကွဲပြားပါတယ်။

Intrinsic elements တွေအတွက်ဆိုရင် — `JSX.IntrinsicElements` ပေါ်က property ရဲ့ type ပဲ ဖြစ်ပါတယ်:

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// element attributes type for 'foo' is '{bar?: boolean}'
<foo bar />;
```

Value-based elements တွေအတွက်ကတော့ — နည်းနည်း ပိုရှုပ်ထွေးပါတယ်။ အဲဒါကို — အရင်က ဆုံးဖြတ်ထားတဲ့ _element instance type_ ပေါ်က property တစ်ခုရဲ့ type နဲ့ ဆုံးဖြတ်ပါတယ်။ ဘယ် property ကို သုံးမလဲဆိုတာကိုတော့ `JSX.ElementAttributesProperty` နဲ့ သတ်မှတ်ပါတယ်။ ၎င်းကို property တစ်ခုတည်းနဲ့ ကြေညာသင့်ပြီး — အဲဒီ property ရဲ့ နာမည်ကိုမှ သုံးမှာ ဖြစ်ပါတယ်။ TypeScript 2.8 ကစပြီး — `JSX.ElementAttributesProperty` ကို မပေးထားဘူးဆိုရင် — class element ရဲ့ constructor ဒါမှမဟုတ် Function Component ရဲ့ call ထဲက ပထမဆုံး parameter ရဲ့ type ကို အစားထိုး သုံးပါတယ်။

```tsx
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // specify the property name to use
  }
}

class MyComponent {
  // specify the property on the element instance type
  props: {
    foo?: string;
  };
}

// element attributes type for 'MyComponent' is '{foo?: string}'
<MyComponent foo="bar" />;
```

Element attribute type ကို JSX ထဲက attributes တွေကို type check လုပ်ဖို့ သုံးပါတယ်။ Optional နဲ့ required (မဖြစ်မနေ လိုအပ်သော) properties တွေကို ထောက်ပံ့ပါတယ်။

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number };
  }
}

<foo requiredProp="bar" />; // ok
<foo requiredProp="bar" optionalProp={0} />; // ok
<foo />; // error, requiredProp is missing
<foo requiredProp={0} />; // error, requiredProp should be a string
<foo requiredProp="bar" unknownProp />; // error, unknownProp does not exist
<foo requiredProp="bar" some-unknown-prop />; // ok, because 'some-unknown-prop' is not a valid identifier
```

> မှတ်ချက်: Attribute နာမည်တစ်ခုက valid JS identifier မဟုတ်ဘူးဆိုရင် (ဥပမာ — `data-*` attribute လိုမျိုး) — အဲဒါကို element attributes type ထဲမှာ ရှာမတွေ့ရင်တောင် error အဖြစ် မသတ်မှတ်ပါဘူး။

ထို့အပြင် — `JSX.IntrinsicAttributes` interface ကို — components တွေရဲ့ props ဒါမှမဟုတ် arguments တွေမှာ ယေဘုယျအားဖြင့် မပါဝင်တဲ့ — JSX framework က သုံးတဲ့ extra properties တွေကို သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ် — ဥပမာ React ထဲက `key` လိုမျိုးပါ။ ပိုပြီး တိကျအောင် — generic type ဖြစ်တဲ့ `JSX.IntrinsicClassAttributes<T>` ကိုလည်း — class components တွေအတွက်ပဲ (Function Components တွေ မဟုတ်ဘဲ) — အလားတူ extra attributes အမျိုးအစားကို သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်။ ဒီ type ထဲမှာ generic parameter က class instance type နဲ့ သက်ဆိုင်ပါတယ်။ React မှာတော့ — ဒါကို `Ref<T>` type ရှိတဲ့ `ref` attribute ကို ခွင့်ပြုဖို့ သုံးပါတယ်။ ယေဘုယျအားဖြင့် — ဒီ interfaces တွေပေါ်က properties တွေ အားလုံးက optional ဖြစ်သင့်ပါတယ် — သင့် JSX framework ရဲ့ user တွေက tag တိုင်းပေါ်မှာ attribute တစ်ချို့ ပေးဖို့ လိုအပ်စေချင်တယ်ဆိုရင်တော့ ချွင်းချက်ပါ။

Spread operator ကလည်း အလုပ်လုပ်ပါတယ်:

```tsx
const props = { requiredProp: "bar" };
<foo {...props} />; // ok

const badProps = {};
<foo {...badProps} />; // error
```

### Children Type Checking (Children Type စစ်ဆေးခြင်း)

TypeScript 2.3 မှာ TS က _children_ (ကလေး element များ) ရဲ့ type checking ကို မိတ်ဆက်ခဲ့ပါတယ်။ _children_ ဆိုတာ — _element attributes type_ ထဲက အထူး property တစ်ခု ဖြစ်ပြီး — child *JSXExpression* တွေကို attributes တွေထဲ ထည့်သွင်းခံရတာလို့ မှတ်ယူပါတယ်။ TS က _props_ ရဲ့ နာမည်ကို ဆုံးဖြတ်ဖို့ `JSX.ElementAttributesProperty` ကို သုံးသလိုပဲ — အဲဒီ props တွေထဲက _children_ ရဲ့ နာမည်ကို ဆုံးဖြတ်ဖို့ `JSX.ElementChildrenAttribute` ကို သုံးပါတယ်။ `JSX.ElementChildrenAttribute` ကို property တစ်ခုတည်းနဲ့ ကြေညာသင့်ပါတယ်။

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {}; // specify children name to use
  }
}
```

```tsx
<div>
  <h1>Hello</h1>
</div>;

<div>
  <h1>Hello</h1>
  World
</div>;

const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
  <div>Hello World</div>
  {"This is just a JS expression..." + 1000}
</CustomComp>
```

_children_ ရဲ့ type ကိုလည်း တခြား attribute တစ်ခုလိုပဲ သတ်မှတ်နိုင်ပါတယ်။ ဒါက default type ကို override (အစားထိုး) လုပ်မှာ ဖြစ်ပြီး — ဥပမာ [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) တွေကို သင်သုံးထားရင်လည်း အဲဒီက type ကို အစားထိုးမှာ ဖြစ်ပါတယ်။

```tsx
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        {this.props.children}
      </h2>
    )
  }
}

// OK
<Component name="foo">
  <h1>Hello World</h1>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element
<Component name="bar">
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element or string.
<Component name="baz">
  <h1>Hello</h1>
  World
</Component>
```

## The JSX result type (JSX Result Type အကြောင်း)

Default အားဖြင့် JSX expression တစ်ခုရဲ့ result ကို `any` အနေနဲ့ type သတ်မှတ်ပါတယ်။ `JSX.Element` interface ကို သတ်မှတ်ခြင်းအားဖြင့် အဲဒီ type ကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒီ interface ကနေ JSX ရဲ့ element ၊ attributes ဒါမှမဟုတ် children တွေအကြောင်း type information တွေကို ပြန်ယူလို့ မရနိုင်ပါဘူး။ အဲဒါက black box (အတွင်းပိုင်း မမြင်ရသော သေတ္တာ) တစ်ခုပဲ ဖြစ်ပါတယ်။

## The JSX function return type (JSX Function Return Type အကြောင်း)

Default အားဖြင့် function components တွေက `JSX.Element | null` ကို return လုပ်ရပါမယ်။ ဒါပေမယ့် ဒါက runtime behaviour ကို အမြဲတမ်း ကိုယ်စားပြုတာတော့ မဟုတ်ပါဘူး။ TypeScript 5.1 ကစပြီး — ဘယ်အရာတွေက valid JSX component type တွေလဲဆိုတာကို override လုပ်ဖို့ `JSX.ElementType` ကို သတ်မှတ်နိုင်ပါတယ်။ သတိပြုရမှာက — ဒါက ဘယ် props တွေ valid လဲဆိုတာကို သတ်မှတ်ပေးတာ မဟုတ်ပါဘူး။ Props တွေရဲ့ type ကို ပေးပို့လိုက်တဲ့ component ရဲ့ ပထမဆုံး argument ကနေ အမြဲတမ်း သတ်မှတ်ပါတယ်။ Default ကတော့ အောက်ပါအတိုင်း ပုံစံမျိုး ဖြစ်ပါတယ်:

```ts
namespace JSX {
    export type ElementType =
        // All the valid lowercase tags
        | keyof IntrinsicElements
        // Function components
        | (props: any) => Element
        // Class components
        | new (props: any) => ElementClass;
    export interface IntrinsicAttributes extends /*...*/ {}
    export type Element = /*...*/;
    export type ElementClass = /*...*/;
}
```

## Embedding Expressions (Expressions ထည့်သွင်းခြင်း)

JSX က expressions တွေကို curly braces (`{ }`) တွေနဲ့ ဝန်းရံပြီး — tags တွေကြားမှာ ထည့်သွင်းဖို့ ခွင့်ပြုပါတယ်။

```tsx
const a = (
  <div>
    {["foo", "bar"].map((i) => (
      <span>{i / 2}</span>
    ))}
  </div>
);
```

အပေါ်က code က error ဖြစ်ပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ string တစ်ခုကို number တစ်ခုနဲ့ စားလို့ မရလို့ပါ။ `preserve` option ကို သုံးတဲ့အခါ output က အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```tsx
const a = (
  <div>
    {["foo", "bar"].map(function (i) {
      return <span>{i / 2}</span>;
    })}
  </div>
);
```

## React integration (React ပေါင်းစပ်အသုံးပြုခြင်း)

JSX ကို React နဲ့တွဲ သုံးဖို့ဆိုရင် — [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) တွေကို သုံးသင့်ပါတယ်။ ဒီ typings တွေက React နဲ့ တွဲသုံးဖို့ သင့်လျော်တဲ့ `JSX` namespace ကို သတ်မှတ်ပေးပါတယ်။

```tsx
/// <reference path="react.d.ts" />

interface Props {
  foo: string;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>;
  }
}

<MyComponent foo="bar" />; // ok
<MyComponent foo={0} />; // error
```

### Configuring JSX (JSX ကို Configure လုပ်ခြင်း)

သင့် JSX ကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ သုံးနိုင်တဲ့ compiler flags အများအပြား ရှိပါတယ် — ဒါတွေက compiler flag အနေနဲ့ရော — inline per-file pragmas (file တစ်ခုချင်းစီအတွင်း ထည့်ရေးသော ညွှန်ကြားချက်များ) အနေနဲ့ပါ အလုပ်လုပ်ပါတယ်။ ပိုပြီး အသေးစိတ် သိရှိဖို့ သူတို့ရဲ့ tsconfig reference pages တွေကို ကြည့်ပါ:

- [`jsxFactory`](https://www.typescriptlang.org/tsconfig)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig)
