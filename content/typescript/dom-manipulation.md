---
title: "DOM Manipulation (DOM ကို ကိုင်တွယ်ခြင်း)"
description: "TypeScript နဲ့ DOM manipulation အကြောင်း — HTMLElement type, Document interface, getElementById နဲ့ createElement, Node interface, children နဲ့ childNodes ကွာခြားချက်, querySelector နဲ့ querySelectorAll"
order: 16
source: "https://www.typescriptlang.org/docs/handbook/dom-manipulation.html"
status: translated
updated: 2026-09-01
---

_`HTMLElement` type ကို စူးစမ်းလေ့လာခြင်း_

Standard သတ်မှတ်ပြီးချိန်ကစပြီး နှစ်ပေါင်း 20+ အတွင်းမှာ — JavaScript က အများကြီး တိုးတက်လာခဲ့ပါတယ်။ 2020 မှာဆိုရင် JavaScript ကို servers တွေ ၊ data science တွေ ၊ IoT devices တွေမှာတောင် သုံးနိုင်ပေမယ့် — သူ့ရဲ့ လူကြိုက်အများဆုံး အသုံးပြုမှုက web browsers တွေပဲ ဆိုတာ သတိရဖို့ အရေးကြီးပါတယ်။

Websites တွေက HTML နဲ့/ဒါမှမဟုတ် XML documents တွေနဲ့ ဖွဲ့စည်းထားပါတယ်။ ဒီ documents တွေက static — ပြောင်းလဲမှု မရှိပါဘူး။ *Document Object Model (DOM)* ဆိုတာ — static websites တွေကို အလုပ်လုပ်နိုင်အောင် browsers တွေက implement လုပ်ထားတဲ့ programming interface တစ်ခုပါ။ DOM API ကို document ရဲ့ structure ၊ style နဲ့ content တွေကို ပြောင်းလဲဖို့ သုံးလို့ရပါတယ်။ ဒီ API က ဒီလောက် စွမ်းဆောင်နိုင်တာမို့ — dynamic websites တွေကို ပိုလွယ်ကူစွာ တည်ဆောက်နိုင်ဖို့ frontend frameworks တွေ အများကြီး (jQuery ၊ React ၊ Angular စသည်) က အဲဒါပေါ်မှာ အခြေခံပြီး တည်ဆောက်ထားပါတယ်။

TypeScript က JavaScript ရဲ့ typed superset တစ်ခုဖြစ်ပြီး — DOM API အတွက် type definitions တွေကိုပါ ထည့်သွင်းပေးထားပါတယ်။ ဒီ definitions တွေက ဘယ် default TypeScript project မှာမဆို အလွယ်တကူ ရနိုင်ပါတယ်။ _lib.dom.d.ts_ ထဲက definition line ပေါင်း 20,000+ ထဲမှာ — တစ်ခု ထင်ရှားပေါ်လွင်ပါတယ်: `HTMLElement` ပါ။ ဒီ type က TypeScript နဲ့ DOM manipulation ရဲ့ ကျောရိုး (backbone) ပဲ ဖြစ်ပါတယ်။

> [DOM type definitions](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) ရဲ့ source code ကို စူးစမ်းလေ့လာနိုင်ပါတယ်

## Basic Example (အခြေခံ ဥပမာ)

ရိုးရှင်းတဲ့ _index.html_ ဖိုင်တစ်ခု ရှိတယ် ဆိုပါစို့:

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>TypeScript Dom Manipulation</title></head>
  <body>
    <div id="app"></div>
    <!-- index.js က index.ts ရဲ့ compiled output လို့ ယူဆပါ -->
    <script src="index.js"></script>
  </body>
</html>
```

`#app` element ထဲကို `<p>Hello, World!</p>` element တစ်ခု ထည့်ပေးတဲ့ TypeScript script တစ်ခုကို လေ့လာကြည့်ရအောင်။

```ts
// 1. id property ကိုသုံးပြီး div element ကို ရွေးချယ်ပါတယ်
const app = document.getElementById("app");

// 2. <p></p> element အသစ်တစ်ခုကို programmatically ဖန်တီးပါတယ်
const p = document.createElement("p");

// 3. Text content ထည့်ပါတယ်
p.textContent = "Hello, World!";

// 4. p element ကို div element ထဲ ထည့်သွင်းပါတယ်
app?.appendChild(p);
```

_index.html_ page ကို compile ပြီး run လိုက်ရင် — ရလာတဲ့ HTML က:

```html
<div id="app">
  <p>Hello, World!</p>
</div>
```

## `Document` Interface

TypeScript code ရဲ့ ပထမဆုံး line က global variable `document` တစ်ခုကို သုံးပါတယ်။ Variable ကို စစ်ဆေးကြည့်ရင် — _lib.dom.d.ts_ ဖိုင်ထဲက `Document` interface ကနေ သတ်မှတ်ထားတာ တွေ့ရပါတယ်။ ဒီ code snippet ထဲမှာ method နှစ်ခု — `getElementById` နဲ့ `createElement` — ကို ခေါ်ထားပါတယ်။

### `Document.getElementById`

ဒီ method ရဲ့ definition က:

```ts
getElementById(elementId: string): HTMLElement | null;
```

Element id string တစ်ခု ပေးလိုက်ရင် — `HTMLElement` ဒါမှမဟုတ် `null` ကို ပြန်ပေးပါတယ်။ ဒီ method က အရေးအကြီးဆုံး types တွေထဲက တစ်ခုဖြစ်တဲ့ `HTMLElement` ကို မိတ်ဆက်ပေးပါတယ်။ ဒါက တခြား element interface တိုင်းရဲ့ အခြေခံ interface ဖြစ်ပါတယ်။ ဥပမာ — code example ထဲက `p` variable က `HTMLParagraphElement` type ဖြစ်ပါတယ်။ ဒါ့အပြင် ဒီ method က `null` ကို ပြန်ပေးနိုင်တာကိုလည်း သတိပြုပါ။ ဘာလို့လဲဆိုတော့ — runtime မတိုင်ခင် method က သတ်မှတ်ထားတဲ့ element ကို တကယ် ရှာတွေ့နိုင်မလားဆိုတာ မသေချာလို့ပါ။ Code snippet ရဲ့ နောက်ဆုံး line မှာတော့ `appendChild` ကို ခေါ်ဖို့ _optional chaining_ operator အသစ်ကို သုံးထားပါတယ်။

### `Document.createElement`

ဒီ method ရဲ့ definition က (deprecated definition ကိုတော့ ချန်လိုက်ပါတယ်):

```ts
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```

ဒါက overloaded function definition တစ်ခုပါ။ ဒုတိယ overload က အရိုးရှင်းဆုံးဖြစ်ပြီး — `getElementById` method လိုမျိုးပဲ အလုပ်လုပ်ပါတယ်။ ဘယ် `string` ကိုမဆို ပေးလိုက်ရင် standard HTMLElement တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ definition ကြောင့်ပဲ developers တွေက ထူးခြားတဲ့ HTML element tags တွေကို ဖန်တီးနိုင်တာပါ။

ဥပမာ — `document.createElement('xyz')` က `<xyz></xyz>` element တစ်ခုကို ပြန်ပေးပါတယ် — HTML specification ထဲမှာ သတ်မှတ်ထားတာ လုံးဝမဟုတ်တဲ့ element တစ်ခုပါ။

> စိတ်ဝင်စားသူတွေအတွက် — custom tag elements တွေကို `document.getElementsByTagName` ကိုသုံးပြီး အပြန်အလှန် ဆက်သွယ်လို့ရပါတယ်

`createElement` ရဲ့ ပထမ definition ကတော့ — ပိုအဆင့်မြင့်တဲ့ generic patterns တွေကို သုံးထားပါတယ်။ အပိုင်းလိုက် ခွဲကြည့်ရင် နားလည်ဖို့ လွယ်ပါတယ် — generic expression ကစလိုက်ရအောင်: `<K extends keyof HTMLElementTagNameMap>` ။ ဒီ expression က `HTMLElementTagNameMap` interface ရဲ့ keys တွေဆီ _constrained_ လုပ်ထားတဲ့ generic parameter `K` တစ်ခုကို သတ်မှတ်ပါတယ်။ ဒီ map interface ထဲမှာ HTML tag name တိုင်းနဲ့ သူ့ရဲ့ သက်ဆိုင်တဲ့ type interface တွေ ပါဝင်ပါတယ်။ ဥပမာ — ပထမဆုံး mapped values ၅ ခု:

```ts
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
        ...
}
```

တချို့ elements တွေက ထူးခြားတဲ့ properties တွေ မရှိတာမို့ — `HTMLElement` ကိုပဲ ပြန်ပေးပါတယ်။ ဒါပေမယ့် တခြား types တွေကတော့ ထူးခြားတဲ့ properties နဲ့ methods တွေ ရှိလို့ — သူတို့ရဲ့ သီးခြား interface တွေကို ပြန်ပေးပါတယ် (အဲဒီ interface တွေက `HTMLElement` ကနေ extend လုပ်ထားတာ ဒါမှမဟုတ် implement လုပ်ထားတာ ဖြစ်ပါတယ်)။

အခု `createElement` definition ရဲ့ ကျန်တဲ့အပိုင်း: `(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]` ။ ပထမ argument ဖြစ်တဲ့ `tagName` ကို generic parameter `K` အဖြစ် သတ်မှတ်ထားပါတယ်။ TypeScript interpreter က ဒီ argument ကနေ generic parameter ကို _infer_ လုပ်ဖို့ လုံလောက်တဲ့ ဉာဏ်ရှိပါတယ်။ ဆိုလိုတာက — developer က method သုံးတဲ့အခါ generic parameter ကို သီးခြား သတ်မှတ်စရာ မလိုပါဘူး; `tagName` argument ဆီ ပေးလိုက်တဲ့ value ဘာပဲဖြစ်ဖြစ် — `K` အဖြစ် infer လုပ်ခံရပြီး definition ရဲ့ ကျန်တဲ့အပိုင်း တစ်လျှောက်လုံး သုံးလို့ရပါတယ်။ တကယ်လည်း အဲဒီလိုပဲ ဖြစ်ပါတယ် — return value ဖြစ်တဲ့ `HTMLElementTagNameMap[K]` က `tagName` argument ကို ယူပြီး သက်ဆိုင်တဲ့ type ကို ပြန်ပေးပါတယ်။ ဒီ definition ကြောင့်ပဲ code snippet ထဲက `p` variable က `HTMLParagraphElement` type ရတာပါ။ ပြီးတော့ code က `document.createElement('a')` ဆိုရင်တော့ — `HTMLAnchorElement` type ရှိတဲ့ element တစ်ခု ဖြစ်ပါလိမ့်မယ်။

## `Node` Interface

`document.getElementById` function က `HTMLElement` တစ်ခုကို ပြန်ပေးပါတယ်။ `HTMLElement` interface က `Element` interface ကနေ extend လုပ်ထားပြီး — အဲဒီ `Element` ကတော့ `Node` interface ကနေ extend လုပ်ထားပါတယ်။ ဒီ prototypal extension ကြောင့် `HTMLElement` တွေ အားလုံးက standard methods အစုတစ်ခုကို သုံးနိုင်ပါတယ်။ Code snippet ထဲမှာ — website ထဲကို `p` element အသစ်ကို ထည့်ဖို့ `Node` interface ပေါ်မှာ သတ်မှတ်ထားတဲ့ property တစ်ခုကို သုံးထားပါတယ်။

### `Node.appendChild`

Code snippet ရဲ့ နောက်ဆုံး line က `app?.appendChild(p)` ပါ။ အပေါ်က `document.getElementById` section မှာ ဖော်ပြခဲ့သလိုပဲ — `app` က runtime မှာ null ဖြစ်နိုင်လို့ ဒီနေရာမှာ _optional chaining_ operator ကို သုံးထားတာပါ။ `appendChild` method ကို ဒီလို သတ်မှတ်ပါတယ်:

```ts
appendChild<T extends Node>(newChild: T): T;
```

ဒီ method က `createElement` method လိုမျိုးပဲ အလုပ်လုပ်ပါတယ် — generic parameter `T` ကို `newChild` argument ကနေ infer လုပ်ပါတယ်။ `T` က တခြား အခြေခံ interface ဖြစ်တဲ့ `Node` ဆီ _constrained_ လုပ်ထားပါတယ်။

## `children` နဲ့ `childNodes` အကြား ခြားနားချက်

အပေါ်မှာ ဒီ document မှာ — `HTMLElement` interface က `Element` ကနေ extend လုပ်ထားပြီး ၊ အဲဒီ `Element` က `Node` ကနေ extend လုပ်ထားတယ်ဆိုတာ ဖော်ပြခဲ့ပါတယ်။ DOM API ထဲမှာ _children_ elements ဆိုတဲ့ concept တစ်ခု ရှိပါတယ်။ ဥပမာ — အောက်က HTML မှာ `p` tags တွေက `div` element ရဲ့ children တွေပါ:

```tsx
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(2) [p, p]

div.childNodes;
// NodeList(2) [p, p]
```

`div` element ကို ရယူပြီးတဲ့အခါ — `children` prop က `HTMLParagraphElements` တွေ ပါဝင်တဲ့ `HTMLCollection` list တစ်ခုကို ပြန်ပေးပါတယ်။ `childNodes` property ကတော့ — အလားတူ `NodeList` list တစ်ခုကို ပြန်ပေးပါတယ်။ `p` tag တစ်ခုချင်းစီက `HTMLParagraphElements` type ပဲ ဖြစ်နေဦးမယ်ဆိုပေမယ့် — `NodeList` ထဲမှာတော့ `HTMLCollection` list ထဲမှာ မပါနိုင်တဲ့ _HTML nodes_ တွေ ထပ်ပါဝင်နိုင်ပါတယ်။

HTML ကို ပြင်ပြီး `p` tags တစ်ခုကို ဖယ်လိုက်ပေမယ့် — text ကိုတော့ ထားလိုက်ရအောင်:

```tsx
<div>
  <p>Hello, World</p>
  TypeScript!
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(1) [p]

div.childNodes;
// NodeList(2) [p, text]
```

Lists နှစ်ခုလုံး ဘယ်လို ပြောင်းသွားလဲ ကြည့်ပါ။ `children` ထဲမှာ အခု `<p>Hello, World</p>` element ပဲ ကျန်ပြီး — `childNodes` ထဲမှာတော့ `p` node နှစ်ခုအစား `text` node တစ်ခု ပါလာပါတယ်။ `NodeList` ထဲက `text` အပိုင်းက — `TypeScript!` ဆိုတဲ့ text ပါဝင်တဲ့ literal `Node` တစ်ခုပါ။ `children` list ထဲမှာတော့ ဒီ `Node` မပါပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒါက `HTMLElement` လို့ မသတ်မှတ်ထားလို့ပါ။

## `querySelector` နဲ့ `querySelectorAll` Methods

ဒီ method နှစ်ခုစလုံးက — ပိုထူးခြားတဲ့ constraints တွေနဲ့ ကိုက်ညီတဲ့ dom elements စာရင်းတွေ ရယူဖို့ ကောင်းမွန်တဲ့ tool တွေပါ။ _lib.dom.d.ts_ ထဲမှာ ဒီလို သတ်မှတ်ထားပါတယ်:

```ts
/**
 * selectors တွေနဲ့ ကိုက်ညီတဲ့ node ရဲ့ descendant ဖြစ်တဲ့ ပထမဆုံး element ကို ပြန်ပေးပါတယ်။
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;

/**
 * selectors တွေနဲ့ ကိုက်ညီတဲ့ node ရဲ့ element descendants အားလုံးကို ပြန်ပေးပါတယ်။
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
```

`querySelectorAll` definition က `getElementsByTagName` နဲ့ ဆင်တူပေမယ့် — type အသစ်တစ်ခုဖြစ်တဲ့ `NodeListOf` ကို ပြန်ပေးပါတယ်။ ဒီ return type က အခြေခံအားဖြင့် standard JavaScript list element ရဲ့ custom implementation တစ်ခုပါ။ `NodeListOf<E>` ကို `E[]` နဲ့ အစားထိုးရင် — user experience အတော်လေး ဆင်တူမယ်လို့ ဆိုလို့ရပါတယ်။ `NodeListOf` က အောက်ပါ properties နဲ့ methods တွေကိုပဲ implement လုပ်ပါတယ်: `length` ၊ `item(index)` ၊ `forEach((value, key, parent) => void)` နဲ့ numeric indexing ။ ဒါ့အပြင် ဒီ method က `.childNodes` method ကနေ `NodeList` ပြန်ပေးသလိုမဟုတ်ဘဲ — _nodes_ မဟုတ်တဲ့ _elements_ စာရင်းတစ်ခုကို ပြန်ပေးပါတယ်။ ဒါက ကွာဟချက်လို ထင်ရပေမယ့် — `Element` interface က `Node` ကနေ extend လုပ်ထားတာ သတိပြုပါ။

ဒီ methods တွေ အလုပ်လုပ်ပုံကို ကြည့်ဖို့ — ရှိပြီးသား code ကို ဒီလို ပြင်ကြည့်ရအောင်:

```tsx
<ul>
  <li>First :)</li>
  <li>Second!</li>
  <li>Third times a charm.</li>
</ul>;

const first = document.querySelector("li"); // ပထမဆုံး li element ကို ပြန်ပေးပါတယ်
const all = document.querySelectorAll("li"); // li elements အားလုံးရဲ့ စာရင်းကို ပြန်ပေးပါတယ်
```

## ပိုမိုလေ့လာလိုပါသလား?

_lib.dom.d.ts_ type definitions တွေရဲ့ အကောင်းဆုံး အချက်က — Mozilla Developer Network (MDN) documentation site မှာ annotate လုပ်ထားတဲ့ types တွေကို ထင်ဟပ်နေလို့ပါ။ ဥပမာ — `HTMLElement` interface ကို MDN ပေါ်က [HTMLElement page](https://developer.mozilla.org/docs/Web/API/HTMLElement) မှာ document လုပ်ထားပါတယ်။ ဒီ pages တွေမှာ ရနိုင်တဲ့ properties ၊ methods တွေ အားလုံး ပြီးတော့ တစ်ခါတလေ ဥပမာတွေပါ ဖော်ပြထားပါတယ်။ နောက်ထပ် ကောင်းတဲ့ အချက်က — ဒီ pages တွေက သက်ဆိုင်ရာ standard documents တွေဆီ link တွေပါ ပေးထားပါတယ်။ ဒီမှာ [W3C Recommendation for HTMLElement](https://www.w3.org/TR/html52/dom.html#htmlelement) ရဲ့ link ပါ။

Sources (ရင်းမြစ်များ):

- [ECMA-262 Standard](http://www.ecma-international.org/ecma-262/10.0/index.html)
- [Introduction to the DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)
