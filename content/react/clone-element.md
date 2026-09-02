---
title: "cloneElement"
description: "Element တစ်ခုကို စမှတ် (starting point) အနေနဲ့ သုံးပြီး props/children အသစ်တွေနဲ့ React element အသစ် ဖန်တီးပေးတဲ့ API — props ပေါင်းစပ်ခြင်း၊ key/ref ကိုင်တွယ်ပုံ များနဲ့ render prop, context, custom Hook စတဲ့ ပိုကောင်းတဲ့ အခြားရွေးချယ်စရာများ"
order: 87
source: "https://react.dev/reference/react/cloneElement"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်:** `cloneElement` သုံးတာက အဖြစ်နည်းပြီး fragile (ပျက်စီးလွယ်) code တွေကို ဖြစ်စေနိုင်ပါတယ်။ [အခြားရွေးချယ်စရာများ (Alternatives)](#alternatives) ကို ကြည့်ပါ။

`cloneElement` က — တခြား element တစ်ခုကို စမှတ် (starting point) အနေနဲ့ သုံးပြီး React element အသစ်တစ်ခု ဖန်တီးနိုင်စေပါတယ်။

```js
const clonedElement = cloneElement(element, props, ...children)
```

## ရည်ညွှန်းချက် (Reference)

### `cloneElement(element, props, ...children)`

`element` ကို အခြေခံပြီး — props နဲ့ children မတူတဲ့ React element တစ်ခု ဖန်တီးဖို့ `cloneElement` ကို ခေါ်ပါ:

```js
import { cloneElement } from 'react';

const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

#### Parameters (ပါရာမီတာများ)

- `element`: `element` argument က valid React element တစ်ခု ဖြစ်ရပါမယ်။ ဥပမာ — `<Something />` လို JSX node တစ်ခု၊ [`createElement`](/docs/react/create-element) ခေါ်တာရဲ့ ရလဒ်၊ ဒါမှမဟုတ် တခြား `cloneElement` call တစ်ခုရဲ့ ရလဒ် ဖြစ်နိုင်ပါတယ်။
- `props`: `props` argument က object ဒါမှမဟုတ် `null` ဖြစ်ရပါမယ်။ `null` ပေးလိုက်ရင် — cloned element က မူရင်း `element.props` တွေအားလုံးကို ထိန်းသိမ်းပါတယ်။ မဟုတ်ရင် — `props` object ထဲက prop တိုင်းအတွက် — ပြန်ရတဲ့ element က `element.props` ထဲက တန်ဖိုးထက် `props` ထဲက တန်ဖိုးကို "ဦးစားပေး" ပါတယ်။ ကျန်တဲ့ props တွေကိုတော့ မူရင်း `element.props` ကနေ ဖြည့်ပေးပါတယ်။ `props.key` ဒါမှမဟုတ် `props.ref` ပေးရင် — မူရင်း key/ref တွေကို အစားထိုးပါတယ်။
- **optional** `...children`: Child node တွေ သုည ဒါမှမဟုတ် အများကြီး ဖြစ်နိုင်ပါတယ်။ React elements, strings, numbers, [portals](https://react.dev/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, `false`) နဲ့ React nodes တွေရဲ့ arrays တွေ အပါအဝင် — React node တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ `...children` argument တွေ ဘာမှ မပေးရင် — မူရင်း `element.props.children` ကို ထိန်းသိမ်းပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`cloneElement` က property အနည်းငယ်ပါတဲ့ React element object တစ်ခုကို ပြန်ပေးပါတယ်:

- `type`: `element.type` နဲ့ အတူတူပါ။
- `props`: `element.props` ကို — သင်ပေးလိုက်တဲ့ overriding `props` တွေနဲ့ shallow ပုံစံ merge လုပ်ထားတဲ့ ရလဒ်ပါ။
- `ref`: `props.ref` နဲ့ override မလုပ်ထားရင် — မူရင်း `element.ref` ပါ။
- `key`: `props.key` နဲ့ override မလုပ်ထားရင် — မူရင်း `element.key` ပါ။

ပုံမှန်အားဖြင့် — element ကို သင့် component ကနေ ပြန်ပေးတာ ဒါမှမဟုတ် တခြား element တစ်ခုရဲ့ child အဖြစ် ထားပါတယ်။ Element ရဲ့ properties တွေကို ဖတ်လို့ ရပေမယ့် — element တစ်ခုကို ဖန်တီးပြီးတာနဲ့ opaque (အတွင်းကို ထိုးဖောက်မကြည့်သော) တစ်ခုအနေနဲ့ သဘောထားပြီး — render လုပ်ရုံကလွဲလို့ တခြားကိုင်တွယ်မှု မလုပ်တာ အကောင်းဆုံးပါ။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Element တစ်ခုကို clone လုပ်တာက — **မူရင်း element ကို modify လုပ်တာ မဟုတ်ပါဘူး။**
- Children တွေကို **အကုန်လုံး statically သိပြီးသား ဖြစ်မှသာ** — `cloneElement(element, null, child1, child2, child3)` လို argument အများကြီးအနေနဲ့ ပေးသင့်ပါတယ်။ Children တွေ dynamic ဖြစ်နေရင်တော့ — array တစ်ခုလုံးကို တတိယ argument အဖြစ် ပေးပါ: `cloneElement(element, null, listItems)`။ ဒါဆိုရင် dynamic lists တွေမှာ [`key` တွေ ပျောက်နေတာကို React က သတိပေးနိုင်ပါလိမ့်မယ်](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)။ Static lists တွေကတော့ ဘယ်တော့မှ ပြန်စီခြင်း (reorder) မလုပ်ရတာမို့ — ဒါ မလိုအပ်ပါဘူး။
- `cloneElement` က data flow ကို ခြေရာခံဖို့ ပိုခက်စေပါတယ် — ဒါကြောင့် [အခြားရွေးချယ်စရာတွေ (alternatives)](#alternatives) ကို ဦးစားပေး စမ်းကြည့်ပါ။

## အသုံးပြုပုံ (Usage)

### Element တစ်ခုရဲ့ props တွေကို override လုပ်ခြင်း

React element တစ်ခုရဲ့ props တချို့ကို override လုပ်ဖို့ — အဲဒီ element ကို override လုပ်ချင်တဲ့ props တွေနဲ့အတူ `cloneElement` ဆီ ပေးပါ:

```js
import { cloneElement } from 'react';

const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

ဒီမှာ ရလာတဲ့ cloned element က `<Row title="Cabbage" isHighlighted={true} />` ဖြစ်ပါလိမ့်မယ်။

**ဒါက ဘယ်အချိန်မှာ အသုံးဝင်လဲ ဆိုတာ ဥပမာတစ်ခုနဲ့ လေ့လာကြည့်ရအောင်။**

သူ့ရဲ့ [`children`](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) တွေကို — "Next" button ပါတဲ့ selectable rows စာရင်း တစ်ခုအနေနဲ့ render လုပ်တဲ့ `List` component တစ်ခု ဆိုပါစို့။ "Next" button က ဘယ် row ကို ရွေးထားလဲ ပြောင်းပေးပါတယ်။ `List` က ရွေးထားတဲ့ `Row` ကို မတူအောင် render လုပ်ဖို့ လိုတာမို့ — သူလက်ခံရတဲ့ `<Row>` child တိုင်းကို clone လုပ်ပြီး `isHighlighted: true` ဒါမှမဟုတ် `isHighlighted: false` prop အပိုတစ်ခု ထပ်ထည့်ပါတယ်:

```js
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

ဥပမာ — `List` က လက်ခံရတဲ့ မူရင်း JSX က ဒီလိုမျိုး ဖြစ်ပါတယ်:

```jsx
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Children တွေကို clone လုပ်ခြင်းဖြင့် — `List` က အတွင်းက `Row` တိုင်းဆီ အချက်အလက် အပိုတွေ ပို့နိုင်ပါတယ်။ ရလဒ်က ဒီလိုမျိုး ဖြစ်ပါတယ်:

```jsx
<List>
  <Row title="Cabbage" isHighlighted={true} />
  <Row title="Garlic" isHighlighted={false} />
  <Row title="Apple" isHighlighted={false} />
</List>
```

အတူတူ လုပ်ဆောင်ဖို့ လိုအပ်တဲ့ ကျန်တဲ့ code တွေက ဒီလိုပါ — App က `List` ထဲကို product rows တွေ ပို့ပြီး — `List` က selection state ကို ထိန်းထားကာ — `Row` က `isHighlighted` ပေါ် မူတည်ပြီး ကိုယ့်ကိုယ်ကိုယ် ပုံစံချပါတယ်:

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
        />
      )}
    </List>
  );
}
```

```js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

အချုပ်ပြောရရင် — `List` က လက်ခံရတဲ့ `<Row />` elements တွေကို clone လုပ်ပြီး — prop အပိုတစ်ခု ထပ်ထည့်လိုက်တာပါ။

> **သတိပြုရန်:** Children တွေကို clone လုပ်တာက — data က သင့် app ထဲမှာ ဘယ်လို စီးဆင်းနေလဲ နားလည်ဖို့ ခက်စေပါတယ်။ [အခြားရွေးချယ်စရာတွေထဲက တစ်ခုခု](#alternatives) စမ်းကြည့်ပါ။

## Alternatives (အခြားရွေးချယ်စရာများ)

### Render prop နဲ့ data ပို့ခြင်း

`cloneElement` သုံးမယ့်အစား — `renderItem` လို *render prop* တစ်ခုကို လက်ခံတာ စဉ်းစားကြည့်ပါ။ ဒီမှာ `List` က `renderItem` ကို prop အဖြစ် လက်ခံပြီး — item တိုင်းအတွက် `isHighlighted` ကို argument အနေနဲ့ ပေးကာ `renderItem` ကို ခေါ်ပါတယ်:

```js
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

`renderItem` prop ကို "render prop" လို့ ခေါ်တာက — သူက တစ်ခုခုကို ဘယ်လို render လုပ်ရမလဲ သတ်မှတ်ပေးတဲ့ prop ဖြစ်လို့ပါ။ ဥပမာ — ပေးထားတဲ့ `isHighlighted` တန်ဖိုးနဲ့ `<Row>` တစ်ခု render လုပ်တဲ့ `renderItem` အကောင်အထည်ဖော်မှု တစ်ခုကို ပေးနိုင်ပါတယ်:

```jsx
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

နောက်ဆုံး ရလဒ်က `cloneElement` နဲ့ အတူတူပါပဲ။ ဒါပေမယ့် — `isHighlighted` တန်ဖိုး ဘယ်ကနေ လာတယ်ဆိုတာ ရှင်းရှင်းလင်းလင်း ခြေရာခံလို့ရပါတယ်။

ဒီ pattern က `cloneElement` ထက် ပိုနှစ်သက်ဖွယ် ကောင်းတာက — သူက ပိုပြီး explicit ဖြစ်လို့ပါ။

### Context ကနေ data ပို့ခြင်း

`cloneElement` ရဲ့ နောက်ထပ် အခြားရွေးချယ်စရာတစ်ခုက [context ကနေ data ပို့တာပါ](https://react.dev/learn/passing-data-deeply-with-context)။

ဥပမာ — `HighlightContext` တစ်ခုကို သတ်မှတ်ဖို့ [`createContext`](/docs/react/create-context) ကို ခေါ်နိုင်ပါတယ်:

```js
export const HighlightContext = createContext(false);
```

သင့် `List` component က — သူ render လုပ်တဲ့ item တိုင်းကို `HighlightContext` provider တစ်ခုအတွင်းမှာ ထုပ်နိုင်ပါတယ်:

```js
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

ဒီနည်းနဲ့ဆိုရင် — `Row` က `isHighlighted` prop ကို လုံးဝ လက်ခံစရာ မလိုတော့ဘဲ context ကို ဖတ်ရုံပဲ လုပ်ပါတယ်:

```js
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
}
```

ဒါက calling component ကို `<Row>` ဆီ `isHighlighted` ပို့ရတာကို မသိရအောင်၊ ပူစရာ မလိုအောင် လုပ်ပေးပါတယ်:

```jsx
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

အဲဒီအစား — `List` နဲ့ `Row` တို့က highlight logic ကို context ကနေ ညှိနှိုင်းဆောင်ရွက်ပါတယ်။ [Context ကနေ data နက်နက်နဲနဲ ပို့တာအကြောင်း ဆက်ဖတ်ရန်](/docs/react/use-context)။

### Logic ကို custom Hook တစ်ခုထဲ ထုတ်ယူခြင်း

စမ်းကြည့်လို့ရတဲ့ နောက်ထပ် နည်းလမ်းတစ်ခုက — "non-visual" (အမြင်အာရုံနဲ့ မဆိုင်တဲ့) logic ကို ကိုယ်ပိုင် Hook တစ်ခုထဲ ထုတ်ပြီး — ဘာကို render လုပ်ရမလဲ ဆုံးဖြတ်ဖို့ အဲဒီ Hook က ပြန်ပေးတဲ့ အချက်အလက်ကို သုံးတာပါ။ ဥပမာ — `useList` ဆိုတဲ့ custom Hook တစ်ခု ရေးနိုင်ပါတယ်:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

ပြီးတော့ ဒီလို သုံးနိုင်ပါတယ်:

```jsx
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Data flow က explicit ဖြစ်ပေမယ့် — state က `useList` custom Hook ရဲ့ အတွင်းမှာ ရှိတာမို့ — component ဘယ်ကနေမဆို သုံးလို့ရပါတယ်။

ဒီနည်းလမ်းက — ဒီ logic ကို component အမျိုးမျိုးကြားမှာ ပြန်သုံးချင်ရင် အထူးသဖြင့် အသုံးဝင်ပါတယ်။
