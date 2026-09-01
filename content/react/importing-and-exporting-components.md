---
title: "Component များ Import နဲ့ Export လုပ်ခြင်း (Importing and Exporting Components)"
description: "Root component file ဆိုတာ ဘာလဲ၊ component တွေကို default/named export နဲ့ import လုပ်နည်း၊ file တစ်ခုကနေ component အများအပြား import/export လုပ်နည်း"
order: 25
source: "https://react.dev/learn/importing-and-exporting-components"
status: translated
updated: 2026-09-01
---

Component တွေရဲ့ အစွမ်းက သူတို့ရဲ့ ပြန်သုံးလို့ရမှု (reusability) မှာ ပါ: တခြား component တွေနဲ့ ဖွဲ့စည်းထားတဲ့ component တွေကို သင်ဖန်တီးနိုင်ပါတယ်။ ဒါပေမယ့် — component တွေ ပိုပိုပြီး nested ဖြစ်လာတာနဲ့အမျှ — သူတို့ကို file အမျိုးမျိုး ခွဲထားတာ အဓိပ္ပါယ် ရှိလာပါတယ်။ ဒါက သင့် file တွေကို ဖတ်ရလွယ်ကူအောင် ထားနိုင်ပြီး — component တွေကို နေရာ အမျိုးမျိုးမှာ ပြန်သုံးနိုင်စေပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Root component file ဆိုတာ ဘာလဲ
- Component တစ်ခုကို ဘယ်လို import နဲ့ export လုပ်မလဲ
- Default နဲ့ named imports/exports တွေကို ဘယ်အချိန် သုံးမလဲ
- File တစ်ခုကနေ component အများအပြားကို ဘယ်လို import နဲ့ export လုပ်မလဲ
- Component တွေကို file အမျိုးမျိုးကို ဘယ်လို ခွဲမလဲ

## Root Component File

[သင့် ပထမဆုံး Component](/docs/react/your-first-component) မှာ — သင် `Profile` component တစ်ခုနဲ့ — အဲဒါကို render လုပ်တဲ့ `Gallery` component တစ်ခု ဖန်တီးခဲ့ပါတယ်:

```jsx
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
```css
img { margin: 0 10px 10px 0; height: 90px; }
```
ဒါတွေက လက်ရှိမှာ **root component file** ထဲမှာ ရှိနေပြီး — ဒီဥပမာမှာ `App.js` လို့ ခေါ်ပါတယ်။ သင့် setup ပေါ်မူတည်ပြီး — သင့် root component က တခြား file တစ်ခုမှာ ရှိနိုင်ပါတယ်။ Next.js လိုမျိုး file-based routing ရှိတဲ့ framework တစ်ခုကို သုံးရင် — သင့် root component က စာမျက်နှာ တစ်ခုချင်းစီအတွက် မတူညီပါလိမ့်မယ်။

## Component တစ်ခုကို Export လုပ်ခြင်းနဲ့ Import လုပ်ခြင်း

နောင်တစ်ချိန်မှာ landing screen ကို ပြောင်းပြီး — သိပ္ပံစာအုပ်တွေရဲ့ list တစ်ခု အဲဒီမှာ ထားချင်တယ်ဆိုရင်ကော? ဒါမှမဟုတ် profile တွေ အားလုံးကို တခြားနေရာမှာ ထားချင်တယ်ဆိုရင်ကော? `Gallery` နဲ့ `Profile` ကို root component file ကနေ ထုတ်ရွှေ့တာ အဓိပ္ပါယ် ရှိပါတယ်။ ဒါက သူတို့ကို ပိုပြီး modular ဖြစ်စေပြီး — တခြား file တွေမှာ ပြန်သုံးလို့ရစေပါတယ်။ Component တစ်ခုကို အဆင့် သုံးဆင့်နဲ့ ရွှေ့နိုင်ပါတယ်:

1. Component တွေ ထည့်ဖို့ JS file အသစ်တစ်ခု **ဖန်တီးပါ**။
2. အဲဒီ file ကနေ သင့် function component ကို **export လုပ်ပါ** ([default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) ဒါမှမဟုတ် [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) exports ဖြစ်ဖြစ်)။
3. Component ကို သုံးမယ့် file ထဲမှာ **import လုပ်ပါ** (default ဒါမှမဟုတ် named imports အတွက် သက်ဆိုင်ရာ နည်းလမ်းကို သုံးပြီး)။

ဒီမှာ `Profile` ရော `Gallery` ပါ — `App.js` ကနေ `Gallery.js` လို့ ခေါ်တဲ့ file အသစ်တစ်ခုထဲကို ရွှေ့ထားပါတယ်။ အခု — `App.js` က `Gallery.js` ကနေ `Gallery` ကို import လုပ်ဖို့ ပြောင်းလဲနိုင်ပါတယ်:

```jsx
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```
```jsx
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
```css
img { margin: 0 10px 10px 0; height: 90px; }
```
ဒီဥပမာက ယခု component file နှစ်ခုအဖြစ် ခွဲထားတာကို သတိပြုပါ:

1. `Gallery.js`:
   - File တစ်ခုတည်းအတွင်းမှာပဲ သုံးပြီး — export မလုပ်ထားတဲ့ `Profile` component ကို သတ်မှတ်ပါတယ်။
   - `Gallery` component ကို **default export** အဖြစ် export လုပ်ပါတယ်။
2. `App.js`:
   - `Gallery.js` ကနေ `Gallery` ကို **default import** အဖြစ် import လုပ်ပါတယ်။
   - Root `App` component ကို **default export** အဖြစ် export လုပ်ပါတယ်။

> **မှတ်ချက်:** `.js` file extension ကို ချန်လှပ်ထားတဲ့ file တွေကိုလည်း သင်တွေ့နိုင်ပါတယ်:
>
> ```jsx
> import Gallery from './Gallery';
> ```
>
> `'./Gallery.js'` ရော `'./Gallery'` ပါ — React နဲ့ အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် — ရှေ့တစ်ခုက [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) အလုပ်လုပ်ပုံနဲ့ ပိုနီးစပ်ပါတယ်။

#### Default နဲ့ Named Exports

JavaScript နဲ့ value တွေကို export လုပ်ဖို့ နည်းလမ်း အဓိက နှစ်ခု ရှိပါတယ်: default exports နဲ့ named exports။ အခုထိ — ကျွန်တော်တို့ရဲ့ ဥပမာတွေက default exports တွေပဲ သုံးခဲ့ပါတယ်။ ဒါပေမယ့် — file တစ်ခုတည်းမှာ နှစ်ခုလုံး ဒါမှမဟုတ် တစ်ခုချင်းစီ သုံးနိုင်ပါတယ်။ **File တစ်ခုမှာ _default_ export တစ်ခုထက် ပိုလို့ မရပါဘူး — ဒါပေမယ့် _named_ exports တွေကတော့ ကြိုက်သလောက် များများ ရှိနိုင်ပါတယ်။**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

Component ကို ဘယ်လို export လုပ်လဲဆိုတာက — ဘယ်လို import လုပ်ရမယ်ဆိုတာကို သတ်မှတ်ပါတယ်။ Default export တစ်ခုကို — named export လုပ်သလိုမျိုး import ဖို့ ကြိုးစားရင် — error ရပါလိမ့်မယ်! ဒီဇယားက သတိထားနိုင်ဖို့ ကူညီပေးပါတယ်:

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

_default_ import တစ်ခု ရေးတဲ့အခါ — `import` ရဲ့ နောက်မှာ ကြိုက်တဲ့ နာမည် ဘာမဆို ထားနိုင်ပါတယ်။ ဥပမာ — `import Banana from './Button.js'` လို့ ရေးရင်တောင် — တူညီတဲ့ default export ကို ရပါသေးတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — named imports တွေမှာတော့ — နာမည်က နှစ်ဖက်လုံးမှာ တူညီနေရပါတယ်။ ဒါကြောင့် သူတို့ကို _named_ imports လို့ ခေါ်တာပါ!

**File က component တစ်ခုတည်းပဲ export လုပ်ရင် default exports ကို သုံးလေ့ ရှိပြီး — component နဲ့ value အများအပြား export လုပ်ရင် named exports ကို သုံးလေ့ ရှိပါတယ်။** ဘယ် coding style ကိုပဲ ကြိုက်ကြိုက် — သင့် component function တွေနဲ့ — သူတို့ ပါဝင်တဲ့ file တွေကို အဓိပ္ပါယ်ရှိတဲ့ နာမည်တွေ အမြဲတမ်း ပေးပါ။ `export default () => {}` လိုမျိုး — နာမည်မရှိတဲ့ component တွေက debugging ပိုခက်စေတာမို့ — မထောက်ခံပါဘူး။

## File တစ်ခုတည်းကနေ Component အများအပြားကို Export နဲ့ Import လုပ်ခြင်း

Gallery တစ်ခု အစား `Profile` တစ်ခုတည်းကိုပဲ ပြချင်တယ်ဆိုရင်ကော? `Profile` component ကိုပါ export လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် — `Gallery.js` မှာ *default* export တစ်ခု ရှိပြီးသားဖြစ်ပြီး — default export _နှစ်ခု_ မဖြစ်နိုင်ပါဘူး။ Default export တစ်ခုပါတဲ့ file အသစ်တစ်ခု ဖန်တီးနိုင်သလို — `Profile` အတွက် *named* export တစ်ခု ထည့်နိုင်ပါတယ်။ **File တစ်ခုမှာ default export တစ်ခုပဲ ရှိနိုင်ပေမယ့် — named exports တွေကတော့ အများကြီး ရှိနိုင်ပါတယ်!**

> **မှတ်ချက်:** Default နဲ့ named exports တွေကြားက ရှုပ်ထွေးမှု လျှော့ချဖို့ — အသင်းတချို့က style တစ်ခုတည်း (default ဒါမှမဟုတ် named) ကိုပဲ ကပ်သုံးတာ ဒါမှမဟုတ် — file တစ်ခုတည်းမှာ ရောမသုံးအောင် ရှောင်တာမျိုး လုပ်ပါတယ်။ သင့်အတွက် အကောင်းဆုံး အလုပ်လုပ်တာကို လုပ်ပါ!

ပထမဆုံး — `Gallery.js` ကနေ `Profile` ကို named export ( `default` keyword မပါဘဲ) နဲ့ **export** လုပ်ပါ:

```jsx
export function Profile() {
  // ...
}
```
ပြီးရင် — `Gallery.js` ကနေ `App.js` ထဲ `Profile` ကို named import (curly braces တွေနဲ့) သုံးပြီး **import** လုပ်ပါ:

```jsx
import { Profile } from './Gallery.js';
```
နောက်ဆုံး — `App` component ကနေ `<Profile />` ကို **render** လုပ်ပါ:

```jsx
export default function App() {
  return <Profile />;
}
```
အခု `Gallery.js` မှာ export နှစ်ခု ပါပါတယ်: default `Gallery` export တစ်ခုနဲ့ — named `Profile` export တစ်ခုပါ။ `App.js` က နှစ်ခုလုံးကို import လုပ်ပါတယ်။ ဒီဥပမာမှာ `<Profile />` ကို `<Gallery />` အဖြစ်နဲ့ ပြန် ပြောင်းကြည့်ပါ:

```jsx
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```
```jsx
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
```css
img { margin: 0 10px 10px 0; height: 90px; }
```
အခု — သင် default နဲ့ named exports တွေကို ရောပြီး သုံးနေပါပြီ:

- `Gallery.js`:
  - `Profile` component ကို **`Profile` လို့ ခေါ်တဲ့ named export** အဖြစ် export လုပ်ပါတယ်။
  - `Gallery` component ကို **default export** အဖြစ် export လုပ်ပါတယ်။
- `App.js`:
  - `Gallery.js` ကနေ `Profile` ကို **`Profile` လို့ ခေါ်တဲ့ named import** အဖြစ် import လုပ်ပါတယ်။
  - `Gallery.js` ကနေ `Gallery` ကို **default import** အဖြစ် import လုပ်ပါတယ်။
  - Root `App` component ကို **default export** အဖြစ် export လုပ်ပါတယ်။

## အကျဉ်းချုပ်

ဒီစာမျက်နှာမှာ သင်လေ့လာခဲ့တာတွေ:

- Root component file ဆိုတာ ဘာလဲ
- Component တစ်ခုကို ဘယ်လို import နဲ့ export လုပ်မလဲ
- Default နဲ့ named imports/exports တွေကို ဘယ်အချိန်၊ ဘယ်လို သုံးမလဲ
- File တစ်ခုတည်းကနေ component အများအပြားကို ဘယ်လို export လုပ်မလဲ

## စိန်ခေါ်မှုများ (Challenges)

### Component တွေကို ထပ်ခွဲခြင်း (Split the Components Further)

လက်ရှိမှာ `Gallery.js` က `Profile` ရော `Gallery` ပါ export လုပ်ထားပြီး — နည်းနည်း ရှုပ်ထွေးပါတယ်။

`Profile` component ကို သူ့ရဲ့ ကိုယ်ပိုင် `Profile.js` ထဲ ရွှေ့ပြီး — `App` component က `<Profile />` ရော `<Gallery />` ပါ တစ်ခုပြီးတစ်ခု render လုပ်အောင် ပြောင်းပါ။

`Profile` အတွက် default ဒါမှမဟုတ် named export ဘယ်ဟာကိုမဆို သုံးနိုင်ပါတယ် — ဒါပေမယ့် `App.js` ရော `Gallery.js` နှစ်ခုလုံးမှာ သက်ဆိုင်တဲ့ import syntax ကို သုံးဖို့ သေချာပါစေ! အထက်က deep dive ကနေ ဒီဇယားကို ကိုးကားနိုင်ပါတယ်:

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

> **အရိပ်အမြွက်:** Component တွေကို သူတို့ ခေါ်ထားတဲ့ နေရာမှာ import လုပ်ဖို့ မမေ့ပါနဲ့။ `Gallery` က `Profile` ကိုလည်း သုံးတာ မဟုတ်လား?

```jsx
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```
```jsx
// Move me to Profile.js! → ကျွန်တော့်ကို Profile.js ထဲ ရွှေ့ပါ!
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
```jsx
```
```css
img { margin: 0 10px 10px 0; height: 90px; }
```
Export တစ်မျိုးနဲ့ အလုပ်ဖြစ်အောင် လုပ်ပြီးတာနဲ့ — နောက်တစ်မျိုးနဲ့လည်း အလုပ်ဖြစ်အောင် လုပ်ကြည့်ပါ။

#### အဖြေ

ဒါက named exports နဲ့ ဖြေရှင်းထားတဲ့ ပုံစံပါ:

```jsx
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```
```jsx
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
```jsx
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```
```css
img { margin: 0 10px 10px 0; height: 90px; }
```
ဒါက default exports နဲ့ ဖြေရှင်းထားတဲ့ ပုံစံပါ:

```jsx
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```
```jsx
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
```jsx
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```
```css
img { margin: 0 10px 10px 0; height: 90px; }
```
