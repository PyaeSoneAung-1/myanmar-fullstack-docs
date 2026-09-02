---
title: "Children"
description: "`children` prop အနေနဲ့ လက်ခံရရှိတဲ့ JSX တွေကို ကိုင်တွယ်/ပြောင်းလဲနိုင်စေတဲ့ React API — Children.map, Children.forEach, Children.count, Children.toArray, Children.only တို့ရဲ့ အသုံးပြုပုံများနဲ့ ပိုမိုခိုင်မာတဲ့ အခြားရွေးချယ်စရာများ"
order: 113
source: "https://react.dev/reference/react/Children"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန် —** `Children` ကို သုံးတာက ရှားပါးပြီး — ပျက်စီးလွယ်တဲ့ (fragile) code တွေကို ဖြစ်စေနိုင်ပါတယ်။ [အသုံးများတဲ့ အခြားရွေးချယ်စရာတွေကို ကြည့်ပါ။](#alternatives)

`Children` က — သင့် component က [`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ လက်ခံရရှိတဲ့ JSX တွေကို ကိုင်တွယ် (manipulate) လုပ်ပြီး ပြောင်းလဲ (transform) လုပ်နိုင်စေပါတယ်။

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

## ရည်ညွှန်းချက် (Reference)

### `Children.count(children)`

`children` data structure ထဲမှာ child ဘယ်နှစ်ခု ပါလဲ ရေတွက်ဖို့ `Children.count(children)` ကို ခေါ်ပါ။

```js src/RowList.js
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[အောက်မှာ နောက်ထပ် ဥပမာတွေ ကြည့်ပါ။](#counting-children)

#### Parameters (ပါရာမီတာများ)

- `children`: သင့် component က [`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ လက်ခံရရှိတဲ့ တန်ဖိုးပါ။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

ဒီ `children` ထဲမှာ ပါဝင်တဲ့ nodes အရေအတွက်ကို ပြန်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Empty nodes (`null`, `undefined` နဲ့ Booleans) တွေ၊ strings တွေ၊ numbers တွေနဲ့ [React elements](/docs/react/create-element) တွေကို — node တစ်ခုချင်းစီအနေနဲ့ ရေတွက်ပါတယ်။ Arrays တွေကိုတော့ node တစ်ခုချင်းစီအနေနဲ့ မရေတွက်ဘဲ — သူတို့ထဲက children တွေကိုပဲ ရေတွက်ပါတယ်။ **Traversal (ဖြတ်လျှောက်ရှာဖွေခြင်း) က React elements တွေထက် ပိုနက်နက်ကို မသွားပါဘူး:** အဲဒီ elements တွေကို render မလုပ်ပါဘူး — သူတို့ရဲ့ children တွေကိုလည်း ဆက်ပြီး ဖြတ်လျှောက် မသွားပါဘူး။ [Fragments](/docs/react/fragment) တွေကိုလည်း ဖြတ်လျှောက် မသွားပါဘူး။

### `Children.forEach(children, fn, thisArg?)`

`children` data structure ထဲက child တစ်ခုချင်းစီအတွက် code တစ်ချို့ run လုပ်ဖို့ `Children.forEach(children, fn, thisArg?)` ကို ခေါ်ပါ။

```js src/RowList.js
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[အောက်မှာ နောက်ထပ် ဥပမာတွေ ကြည့်ပါ။](#running-some-code-for-each-child)

#### Parameters (ပါရာမီတာများ)

- `children`: သင့် component က [`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ လက်ခံရရှိတဲ့ တန်ဖိုးပါ။
- `fn`: Child တစ်ခုချင်းစီအတွက် သင်ပြေးစေချင်တဲ့ function ပါ — [array ရဲ့ `forEach` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) callback နဲ့ ဆင်ပါတယ်။ ဒီ function ကို — child ကို ပထမ argument အနေနဲ့၊ သူ့ရဲ့ index ကို ဒုတိယ argument အနေနဲ့ ယူပြီး ခေါ်ပါတယ်။ Index က `0` ကနေ စပြီး — ခေါ်မှု တစ်ကြိမ်စီမှာ တစ်ခုစီ တိုးပါတယ်။
- **optional** `thisArg`: `fn` function ကို ဘယ် [`this` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) နဲ့ ခေါ်ရမလဲ သတ်မှတ်ပါတယ်။ မပေးထားရင် — `undefined` ဖြစ်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`Children.forEach` က `undefined` ကို ပြန်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Empty nodes (`null`, `undefined` နဲ့ Booleans) တွေ၊ strings တွေ၊ numbers တွေနဲ့ [React elements](/docs/react/create-element) တွေကို — node တစ်ခုချင်းစီအနေနဲ့ ရေတွက်ပါတယ်။ Arrays တွေကိုတော့ node တစ်ခုချင်းစီအနေနဲ့ မရေတွက်ဘဲ — သူတို့ထဲက children တွေကိုပဲ ရေတွက်ပါတယ်။ **Traversal (ဖြတ်လျှောက်ရှာဖွေခြင်း) က React elements တွေထက် ပိုနက်နက်ကို မသွားပါဘူး:** အဲဒီ elements တွေကို render မလုပ်ပါဘူး — သူတို့ရဲ့ children တွေကိုလည်း ဆက်ပြီး ဖြတ်လျှောက် မသွားပါဘူး။ [Fragments](/docs/react/fragment) တွေကိုလည်း ဖြတ်လျှောက် မသွားပါဘူး။

### `Children.map(children, fn, thisArg?)`

`children` data structure ထဲက child တစ်ခုချင်းစီကို map (သို့) transform လုပ်ဖို့ `Children.map(children, fn, thisArg?)` ကို ခေါ်ပါ။

```js src/RowList.js
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[အောက်မှာ နောက်ထပ် ဥပမာတွေ ကြည့်ပါ။](#transforming-children)

#### Parameters (ပါရာမီတာများ)

- `children`: သင့် component က [`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ လက်ခံရရှိတဲ့ တန်ဖိုးပါ။
- `fn`: Mapping function ပါ — [array ရဲ့ `map` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) callback နဲ့ ဆင်ပါတယ်။ ဒီ function ကို — child ကို ပထမ argument အနေနဲ့၊ သူ့ရဲ့ index ကို ဒုတိယ argument အနေနဲ့ ယူပြီး ခေါ်ပါတယ်။ Index က `0` ကနေ စပြီး — ခေါ်မှု တစ်ကြိမ်စီမှာ တစ်ခုစီ တိုးပါတယ်။ ဒီ function ကနေ React node တစ်ခုကို ပြန်ပေးဖို့ လိုပါတယ်။ ဒါက empty node (`null`, `undefined` ဒါမှမဟုတ် Boolean) တစ်ခု၊ string တစ်ခု၊ number တစ်ခု၊ React element တစ်ခု ဒါမှမဟုတ် တခြား React nodes တွေရဲ့ array တစ်ခု ဖြစ်နိုင်ပါတယ်။
- **optional** `thisArg`: `fn` function ကို ဘယ် [`this` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) နဲ့ ခေါ်ရမလဲ သတ်မှတ်ပါတယ်။ မပေးထားရင် — `undefined` ဖြစ်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`children` က `null` (သို့) `undefined` ဖြစ်နေရင် — အဲဒီ တန်ဖိုးအတိုင်းပဲ ပြန်ပေးပါတယ်။

ဒါမှမဟုတ်ရင် — သင်က `fn` function ကနေ ပြန်ပေးလိုက်တဲ့ nodes တွေ ပါဝင်တဲ့ flat array တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ array ထဲမှာ — သင်ပြန်ပေးခဲ့တဲ့ nodes တွေ အားလုံး ပါဝင်ပြီး — `null` နဲ့ `undefined` တွေကတော့ ချန်လှပ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Empty nodes (`null`, `undefined` နဲ့ Booleans) တွေ၊ strings တွေ၊ numbers တွေနဲ့ [React elements](/docs/react/create-element) တွေကို — node တစ်ခုချင်းစီအနေနဲ့ ရေတွက်ပါတယ်။ Arrays တွေကိုတော့ node တစ်ခုချင်းစီအနေနဲ့ မရေတွက်ဘဲ — သူတို့ထဲက children တွေကိုပဲ ရေတွက်ပါတယ်။ **Traversal (ဖြတ်လျှောက်ရှာဖွေခြင်း) က React elements တွေထက် ပိုနက်နက်ကို မသွားပါဘူး:** အဲဒီ elements တွေကို render မလုပ်ပါဘူး — သူတို့ရဲ့ children တွေကိုလည်း ဆက်ပြီး ဖြတ်လျှောက် မသွားပါဘူး။ [Fragments](/docs/react/fragment) တွေကိုလည်း ဖြတ်လျှောက် မသွားပါဘူး။

- `fn` ကနေ key ပါတဲ့ element တစ်ခု (သို့) elements တွေရဲ့ array တစ်ခုကို ပြန်ပေးရင် — **ပြန်ပေးလိုက်တဲ့ elements တွေရဲ့ keys တွေကို — `children` ထဲက မူရင်း item တစ်ခုချင်းစီရဲ့ key နဲ့ အလိုအလျောက် ပေါင်းစပ်ပါတယ်။** `fn` ကနေ element အများကြီးကို array အနေနဲ့ ပြန်ပေးတဲ့အခါ — သူတို့ရဲ့ keys တွေက တစ်ခုနဲ့တစ်ခုကြားမှာပဲ locally unique ဖြစ်ဖို့ လိုပါတယ်။

### `Children.only(children)`

`children` က React element တစ်ခုတည်း ကိုယ်စားပြုကြောင်း အတည်ပြုဖို့ `Children.only(children)` ကို ခေါ်ပါ။

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parameters (ပါရာမီတာများ)

- `children`: သင့် component က [`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ လက်ခံရရှိတဲ့ တန်ဖိုးပါ။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`children` က [valid element](/docs/react/is-valid-element) တစ်ခု ဖြစ်ရင် — အဲဒီ element ကို ပြန်ပေးပါတယ်။

မဟုတ်ရင် — error တစ်ခု ပစ်လိုက်ပါတယ် (throws)။

#### Caveats (သတိပြုရမည့်အချက်များ)

- ဒီ method က — `children` အနေနဲ့ array တစ်ခုကို (ဥပမာ — `Children.map` ရဲ့ ပြန်ပေးချက်) ပေးလိုက်ရင် အမြဲတမ်း **throw လုပ်ပါတယ်။** တစ်နည်းပြောရရင် — ဒါက `children` က element တစ်ခုတည်းပါတဲ့ array လား ဆိုတာ စစ်တာ မဟုတ်ဘဲ — `children` က React element တစ်ခုတည်း ဖြစ်ကြောင်း အတင်းအကျပ် သေချာစေတာပါ။

### `Children.toArray(children)`

`children` data structure ကနေ array တစ်ခု ဖန်တီးဖို့ `Children.toArray(children)` ကို ခေါ်ပါ။

```js src/ReversedList.js
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parameters (ပါရာမီတာများ)

- `children`: သင့် component က [`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ လက်ခံရရှိတဲ့ တန်ဖိုးပါ။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`children` ထဲက elements တွေ ပါဝင်တဲ့ flat array တစ်ခုကို ပြန်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Empty nodes (`null`, `undefined` နဲ့ Booleans) တွေကို — ပြန်ပေးတဲ့ array ထဲကနေ ချန်လှပ်လိုက်ပါတယ်။ **ပြန်ပေးလိုက်တဲ့ elements တွေရဲ့ keys တွေကို — မူရင်း elements တွေရဲ့ keys နဲ့ သူတို့ရဲ့ nesting အဆင့်နဲ့ နေရာ (position) တို့ကနေ တွက်ချက်ပါတယ်။** ဒါက array ကို flatten လုပ်လိုက်တာကြောင့် အပြုအမူ ပိုင်း ပြောင်းလဲမှုတွေ မဖြစ်စေဘူးဆိုတာ သေချာစေပါတယ်။

## အသုံးပြုပုံ (Usage)

### Children တွေကို ပြောင်းလဲခြင်း (Transforming children)

[`children` prop](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) အနေနဲ့ သင့် component က လက်ခံရရှိတဲ့ children JSX တွေကို ပြောင်းလဲဖို့ — `Children.map` ကို ခေါ်ပါ:

```js
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

အပေါ်က ဥပမာမှာ — `RowList` က သူလက်ခံရတဲ့ child တိုင်းကို `<div className="Row">` container တစ်ခုအတွင်း ထုပ်ပေးပါတယ်။ ဥပမာ — parent component က `<p>` tags သုံးခုကို `RowList` ဆီ `children` prop အနေနဲ့ ပို့တယ် ဆိုပါစို့:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

အဲဒါဆိုရင် — အပေါ်က `RowList` implementation နဲ့ဆိုရင် — နောက်ဆုံး render လုပ်ပြီးသား ရလဒ်က ဒီလိုပုံ ဖြစ်ပါလိမ့်မယ်:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` က — [array တွေကို `map()` နဲ့ ပြောင်းလဲတာနဲ့](/docs/react/rendering-lists) ဆင်ပါတယ်။ ကွာခြားချက်က — `children` data structure ကို *opaque* (အတွင်းပိုင်း ဖွဲ့စည်းပုံ မသိနိုင်တဲ့အရာ) လို့ သတ်မှတ်ထားလို့ပါ။ ဆိုလိုတာက — တစ်ခါတစ်ရံ array ဖြစ်နေရင်တောင် — သူက array ဒါမှမဟုတ် တခြား သီးသန့် data type တစ်ခုခုလို့ သင်ယူဆလို့ မရပါဘူး။ ဒါကြောင့်ပဲ — ပြောင်းလဲဖို့ လိုအပ်ရင် `Children.map` ကို သုံးသင့်တာပါ။

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

#### `children` prop က ဘာကြောင့် အမြဲတမ်း array မဟုတ်တာလဲ

React မှာ — `children` prop ကို *opaque* data structure တစ်ခုအနေနဲ့ သတ်မှတ်ပါတယ်။ ဆိုလိုတာက — သူ့ရဲ့ ဖွဲ့စည်းပုံကို အားမကိုးသင့်ပါဘူး။ Children တွေကို ပြောင်းလဲဖို့၊ filter လုပ်ဖို့ ဒါမှမဟုတ် ရေတွက်ဖို့ဆိုရင် — `Children` methods တွေကို သုံးသင့်ပါတယ်။

လက်တွေ့မှာ — `children` data structure ကို အတွင်းပိုင်းမှာ array အနေနဲ့ ကိုယ်စားပြုလေ့ ရှိပါတယ်။ ဒါပေမယ့် — child တစ်ခုတည်းပဲ ရှိတဲ့အခါ — React က array အပိုတစ်ခု ဖန်တီးမှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒါက မလိုအပ်တဲ့ memory overhead တစ်ခု ဖြစ်စေလို့ပါ။ `children` prop ကို တိုက်ရိုက် စစ်ဆေးနေမယ့်အစား — `Children` methods တွေကို သုံးနေသရွေ့ — React က data structure ကို အကောင်အထည်ဖော်ပုံ ပြောင်းသွားရင်တောင် သင့် code က မပျက်ပါဘူး။

`children` က array ဖြစ်နေတဲ့အခါတောင်မှ — `Children.map` မှာ အသုံးဝင်တဲ့ အထူး အပြုအမူတွေ ရှိပါတယ်။ ဥပမာ — `Children.map` က — [keys](/docs/react/rendering-lists) တွေကို ပြန်ပေးလိုက်တဲ့ elements တွေနဲ့ — သူ့ဆီ ပို့လိုက်တဲ့ `children` တွေရဲ့ keys တွေနဲ့ ပေါင်းစပ်ပါတယ်။ ဒါက — အပေါ်က ဥပမာလိုမျိုး ထုပ်လိုက်တဲ့အခါမျိုးမှာတောင် — မူရင်း JSX children တွေရဲ့ keys တွေ "ပျောက်မသွား" စေဖို့ သေချာစေပါတယ်။

> **သတိပြုရန် —** `children` data structure ထဲမှာ — သင်က JSX အနေနဲ့ ပို့လိုက်တဲ့ components တွေရဲ့ **render လုပ်ပြီးသား output တွေ မပါဝင်ပါဘူး။** အောက်က ဥပမာမှာ — `RowList` က လက်ခံရရှိတဲ့ `children` ထဲမှာ item သုံးခုအစား နှစ်ခုပဲ ပါပါတယ်:
>
> 1. `<p>This is the first item.</p>`
> 2. `<MoreRows />`
>
> ဒါကြောင့်ပဲ — ဒီဥပမာမှာ row wrapper နှစ်ခုပဲ ထွက်လာတာပါ:
>
> ```js
> import RowList from './RowList.js';
>
> export default function App() {
>   return (
>     <RowList>
>       <p>This is the first item.</p>
>       <MoreRows />
>     </RowList>
>   );
> }
>
> function MoreRows() {
>   return (
>     <>
>       <p>This is the second item.</p>
>       <p>This is the third item.</p>
>     </>
>   );
> }
> ```
>
> ```js src/RowList.js
> import { Children } from 'react';
>
> export default function RowList({ children }) {
>   return (
>     <div className="RowList">
>       {Children.map(children, child =>
>         <div className="Row">
>           {child}
>         </div>
>       )}
>     </div>
>   );
> }
> ```
>
> ```css
> .RowList {
>   display: flex;
>   flex-direction: column;
>   border: 2px solid grey;
>   padding: 5px;
> }
>
> .Row {
>   border: 2px dashed black;
>   padding: 5px;
>   margin: 5px;
> }
> ```
>
> `children` တွေကို ကိုင်တွယ်တဲ့အခါ — `<MoreRows />` လို အတွင်းက component တစ်ခုရဲ့ render လုပ်ပြီးသား output ကို **ရယူဖို့ နည်းလမ်း မရှိပါဘူး။** ဒါကြောင့်ပဲ [အခြားရွေးချယ်စရာ နည်းလမ်းတွေထဲက တစ်ခုကို သုံးတာ ပိုကောင်းပါတယ်။](#alternatives)

### Child တစ်ခုချင်းစီအတွက် code run လုပ်ခြင်း (Running some code for each child)

`children` data structure ထဲက child တစ်ခုချင်းစီကို ဖြတ်ပြီး iterate လုပ်ဖို့ — `Children.forEach` ကို ခေါ်ပါ။ သူက တန်ဖိုး ဘာမှ ပြန်မပေးဘဲ — [array ရဲ့ `forEach` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) နဲ့ ဆင်ပါတယ်။ ကိုယ်ပိုင် array တစ်ခု တည်ဆောက်တာလို custom logic တွေ run ဖို့ သုံးနိုင်ပါတယ်။

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

> **သတိပြုရန် —** အစောပိုင်းမှာ ဖော်ပြခဲ့သလိုပဲ — `children` တွေကို ကိုင်တွယ်တဲ့အခါ — အတွင်းက component တစ်ခုရဲ့ render လုပ်ပြီးသား output ကို ရယူဖို့ နည်းလမ်း မရှိပါဘူး။ ဒါကြောင့်ပဲ [အခြားရွေးချယ်စရာ နည်းလမ်းတွေထဲက တစ်ခုကို သုံးတာ ပိုကောင်းပါတယ်။](#alternatives)

### Children တွေကို ရေတွက်ခြင်း (Counting children)

Children ဘယ်နှစ်ခု ရှိလဲ တွက်ချက်ဖို့ — `Children.count(children)` ကို ခေါ်ပါ။

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

> **သတိပြုရန် —** အစောပိုင်းမှာ ဖော်ပြခဲ့သလိုပဲ — `children` တွေကို ကိုင်တွယ်တဲ့အခါ — အတွင်းက component တစ်ခုရဲ့ render လုပ်ပြီးသား output ကို ရယူဖို့ နည်းလမ်း မရှိပါဘူး။ ဒါကြောင့်ပဲ [အခြားရွေးချယ်စရာ နည်းလမ်းတွေထဲက တစ်ခုကို သုံးတာ ပိုကောင်းပါတယ်။](#alternatives)

### Children တွေကို array အဖြစ် ပြောင်းခြင်း (Converting children to an array)

`children` data structure ကို ပုံမှန် JavaScript array တစ်ခုအဖြစ် ပြောင်းဖို့ — `Children.toArray(children)` ကို ခေါ်ပါ။ ဒါက — array ထဲကို [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)၊ [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) (သို့) [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) လို built-in array methods တွေနဲ့ ကိုင်တွယ်နိုင်စေပါတယ်။

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

> **သတိပြုရန် —** အစောပိုင်းမှာ ဖော်ပြခဲ့သလိုပဲ — `children` တွေကို ကိုင်တွယ်တဲ့အခါ — အတွင်းက component တစ်ခုရဲ့ render လုပ်ပြီးသား output ကို ရယူဖို့ နည်းလမ်း မရှိပါဘူး။ ဒါကြောင့်ပဲ [အခြားရွေးချယ်စရာ နည်းလမ်းတွေထဲက တစ်ခုကို သုံးတာ ပိုကောင်းပါတယ်။](#alternatives)

## အခြားရွေးချယ်စရာများ (Alternatives)

> **မှတ်ချက်:** ဒီ section က — ဒီလိုမျိုး import လုပ်တဲ့ `Children` API (စာလုံးကြီး `C` နဲ့) အတွက် အခြားရွေးချယ်စရာတွေကို ဖော်ပြပါတယ်:
>
> ```js
> import { Children } from 'react';
> ```
>
> ဒါကို — (စာလုံးသေး `c` နဲ့) [`children` prop သုံးခြင်း](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) နဲ့ မရောထွေးပါနဲ့ — အဲဒါကတော့ ကောင်းမွန်ပြီး အားပေးအားမြှောက် ပြုလိုတဲ့ နည်းလမ်းတစ်ခုပါ။

### Component အများအပြားကို ထုတ်ဖော်ခြင်း (Exposing multiple components)

`Children` methods တွေနဲ့ children တွေကို ကိုင်တွယ်တာက မကြာခဏဆိုသလို ပျက်စီးလွယ်တဲ့ (fragile) code တွေကို ဖြစ်စေပါတယ်။ JSX ထဲမှာ သင်က component တစ်ခုဆီ children တွေ ပို့တဲ့အခါ — အဲဒီ component က child တစ်ခုချင်းစီကို ကိုင်တွယ် (သို့) ပြောင်းလဲလိမ့်မယ်လို့ သင်ပုံမှန် မမျှော်လင့်ပါဘူး။

တတ်နိုင်ရင် — `Children` methods တွေ သုံးတာကို ရှောင်ဖို့ ကြိုးစားပါ။ ဥပမာ — `RowList` ရဲ့ child တိုင်းကို `<div className="Row">` ထဲ ထုပ်ချင်တယ်ဆိုရင် — `Row` component တစ်ခုကို export လုပ်ပြီး — row တိုင်းကို ကိုယ်တိုင် ဒီလို ထုပ်ပါ:

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

`Children.map` သုံးတာနဲ့ မတူဘဲ — ဒီနည်းလမ်းက child တိုင်းကို အလိုအလျောက် မထုပ်ပါဘူး။ **ဒါပေမယ့် — ဒီနည်းလမ်းမှာ [အစောပိုင်းက `Children.map` နဲ့ ဥပမာ](#transforming-children) ထက် သိသာတဲ့ အားသာချက် တစ်ခု ရှိပါတယ် — ဘာလို့လဲဆိုတော့ — သင်က component တွေ ထပ်ထပ်ထုတ်နေရင်တောင် ဒီနည်းလမ်းက အလုပ်လုပ်နေလို့ပါ။** ဥပမာ — ကိုယ်ပိုင် `MoreRows` component တစ်ခု ထုတ်လိုက်ရင်တောင် — ဒီနည်းလမ်းက အလုပ်လုပ်နေဦးမှာပါ:

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

ဒါက `Children.map` နဲ့ဆို အလုပ်မလုပ်ပါဘူး — ဘာလို့လဲဆိုတော့ — `Children.map` က `<MoreRows />` ကို child တစ်ခုတည်း (row တစ်တန်းတည်း) အနေနဲ့ပဲ "မြင်လို့" ပါ။

### Prop တစ်ခုအနေနဲ့ object တွေရဲ့ array တစ်ခုကို လက်ခံခြင်း (Accepting an array of objects as a prop)

Array တစ်ခုကို prop အနေနဲ့လည်း ရှင်းရှင်းလင်းလင်း ပို့နိုင်ပါတယ်။ ဥပမာ — ဒီ `RowList` က `rows` array တစ်ခုကို prop အနေနဲ့ လက်ခံပါတယ်:

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

`rows` က ပုံမှန် JavaScript array တစ်ခုမို့ — `RowList` component က [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) လို built-in array methods တွေကို သူ့အပေါ်မှာ သုံးနိုင်ပါတယ်။

ဒီ pattern က — children တွေနဲ့အတူ နောက်ထပ် အချက်အလက်တွေကို structured data အနေနဲ့ အတူတကွ ပို့နိုင်စေချင်တဲ့အခါ အထူး အသုံးဝင်ပါတယ်။ အောက်က ဥပမာမှာ — `TabSwitcher` component က object တွေရဲ့ array တစ်ခုကို `tabs` prop အနေနဲ့ လက်ခံပါတယ်:

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

Children တွေကို JSX အနေနဲ့ ပို့တာနဲ့ မတူဘဲ — ဒီနည်းလမ်းက item တစ်ခုချင်းစီနဲ့ `header` လို အပို data တချို့ကို တွဲပေးနိုင်ပါတယ်။ သင်က `tabs` ကို တိုက်ရိုက် ကိုင်တွယ်နေပြီး — သူက array တစ်ခုမို့ — `Children` methods တွေ မလိုအပ်ပါဘူး။

### Rendering စိတ်ကြိုက်ပြင်ဆင်ဖို့ render prop တစ်ခုကို ခေါ်ခြင်း (Calling a render prop to customize rendering)

Item တစ်ခုချင်းစီအတွက် JSX ထုတ်ပေးမယ့်အစား — JSX ပြန်ပေးတဲ့ function တစ်ခုကို ပို့ပြီး — လိုအပ်တဲ့အခါမှ အဲဒီ function ကို ခေါ်နိုင်ပါတယ်။ ဒီဥပမာမှာ — `App` component က `renderContent` function တစ်ခုကို `TabSwitcher` component ဆီ ပို့ပြီး — `TabSwitcher` component က ရွေးထားတဲ့ tab အတွက်ပဲ `renderContent` ကို ခေါ်ပါတယ်:

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

`renderContent` လို prop တစ်ခုကို — user interface တစ်ပိုင်းကို ဘယ်လို render လုပ်ရမလဲ သတ်မှတ်ပေးတဲ့ prop တစ်ခုမို့ — *render prop* လို့ ခေါ်ပါတယ်။ ဒါပေမယ့် — ဒါနဲ့ ပတ်သက်ပြီး ထူးခြားတာ ဘာမှ မရှိပါဘူး: သူက function တစ်ခုဖြစ်သွားတဲ့ ပုံမှန် prop တစ်ခုပါ။

Render props တွေက functions တွေမို့ — သူတို့ဆီ အချက်အလက်တွေ ပို့လို့ရပါတယ်။ ဥပမာ — ဒီ `RowList` component က row တစ်ခုချင်းစီရဲ့ `id` နဲ့ `index` ကို `renderRow` render prop ဆီ ပို့ပြီး — အဲဒီ render prop က `index` ကို သုံးပြီး စုံတွဲ (even) rows တွေကို highlight လုပ်ပါတယ်:

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

ဒါက — parent နဲ့ child components တွေက children တွေကို ကိုင်တွယ်စရာမလိုဘဲ — ဘယ်လို ပူးပေါင်း ဆောင်ရွက်နိုင်လဲဆိုတဲ့ နောက်ထပ် ဥပမာတစ်ခုပါ။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### ကိုယ်ပိုင် component တစ်ခု ပို့ထားပေမယ့် — `Children` methods တွေက သူ့ရဲ့ render result ကို မပြပါဘူး

သင်က `RowList` ဆီ child နှစ်ခုကို ဒီလို ပို့တယ် ဆိုပါစို့:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

`RowList` ထဲမှာ `Children.count(children)` ကို လုပ်ကြည့်ရင် — `2` ရပါလိမ့်မယ်။ `MoreRows` က item အမျိုးမျိုး ၁၀ ခု render လုပ်နေရင်တောင် — ဒါမှမဟုတ် `null` ပြန်ပေးနေရင်တောင် — `Children.count(children)` က `2` ပဲ ဖြစ်နေဦးမှာပါ။ `RowList` ရဲ့ ရှုထောင့်ကနေကြည့်ရင် — သူက လက်ခံရရှိတဲ့ JSX ကိုပဲ "မြင်"ပါတယ်။ `MoreRows` component ရဲ့ အတွင်းပိုင်းတွေကိုတော့ "မြင်"မှာ မဟုတ်ပါဘူး။

ဒီအကန့်အသတ်ကြောင့် — component တစ်ခုကို ထုတ်ယူရတာ ခက်ခဲစေပါတယ်။ ဒါကြောင့်ပဲ — `Children` သုံးတာထက် [အခြားရွေးချယ်စရာများ](#alternatives) ကို ပိုနှစ်သက်တာပါ။
