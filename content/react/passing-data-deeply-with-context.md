---
title: "Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း"
description: "Prop drilling ဆိုတာ ဘာလဲ — context နဲ့ ထပ်ခါထပ်ခါ prop တွေ ပို့နေစရာ မလိုဘဲ parent ကနေ tree ထဲက component တိုင်းဆီ data ဖြန့်ဝေခြင်း၊ context ရဲ့ အသုံးပြုပုံများနဲ့ အခြားရွေးချယ်စရာများ"
order: 12
source: "https://react.dev/learn/passing-data-deeply-with-context"
status: translated
updated: 2026-09-01
---

များသောအားဖြင့် — parent component ကနေ child component ဆီ အချက်အလက်တွေကို props တွေနဲ့ ပို့ပေးပါတယ်။ ဒါပေမယ့် — ကြားထဲက component အများကြီးကို ဖြတ်ပြီး ပို့ပေးရတဲ့အခါ ဒါမှမဟုတ် သင့် app ထဲက component အများကြီးက အချက်အလက်တစ်ခုတည်း လိုအပ်တဲ့အခါ — props တွေ ပို့ပေးတာက ရှည်လျားပြီး အဆင်မပြေဖြစ်လာနိုင်ပါတယ်။ *Context* က parent component ကို — သူ့အောက်က tree ထဲက component တိုင်းဆီ — ဘယ်လောက်နက်နက်ပဲ ဖြစ်ဖြစ် — props တွေနဲ့ ရှင်းလင်းစွာ မပို့ဘဲ အချက်အလက်တချို့ ရရှိနိုင်အောင် လုပ်ပေးပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- "Prop drilling" ဆိုတာ ဘာလဲ
- ထပ်ခါထပ်ခါ prop တွေ ပို့နေရတာကို context နဲ့ ဘယ်လို အစားထိုးမလဲ
- Context ရဲ့ အသုံးများတဲ့ ကိစ္စတွေ
- Context ရဲ့ အသုံးများတဲ့ အခြားရွေးချယ်စရာတွေ

## Props ပို့ပေးခြင်းရဲ့ ပြဿနာ

[Props ပို့ပေးခြင်း](/docs/react/passing-props-to-a-component) က — သင့် UI tree ကိုဖြတ်ပြီး သုံးမယ့် component တွေဆီ data တွေကို ရှင်းလင်းစွာ ပိုက်လိုင်းချပေးဖို့ ကောင်းမွန်တဲ့ နည်းလမ်းတစ်ခုပါ။

ဒါပေမယ့် — prop တစ်ခုကို tree ထဲ နက်နက်နဲနဲ ပို့ပေးရတဲ့အခါ ဒါမှမဟုတ် component အများကြီးက prop တစ်ခုတည်း လိုအပ်တဲ့အခါ — props တွေ ပို့ပေးတာက ရှည်လျားပြီး အဆင်မပြေ ဖြစ်လာနိုင်ပါတယ်။ အနီးဆုံး common ancestor က data လိုအပ်တဲ့ component တွေနဲ့ အလှမ်းဝေးနိုင်ပြီး — [state ကို အဲဒီလောက်အထိ lift up](/docs/react/sharing-state-between-components) လုပ်တာက "prop drilling" လို့ခေါ်တဲ့ အခြေအနေတစ်ခုကို ဖြစ်စေနိုင်ပါတယ်။

> _Diagram:_ **State ကို lift up လုပ်ခြင်း** — parent က child နှစ်ခုစလုံးဆီ တန်ဖိုးတစ်ခုကို ပို့ပေးတယ်။ **Prop drilling** — root ကနေ တန်ဖိုးတစ်ခုကို ကြားထဲက component တွေကို ဖြတ်ပြီး အောက်ခြေက components တွေဆီ ပို့ပေးရတယ် — ကြားထဲက component တွေက တန်ဖိုးကို မသုံးဘဲ ဖြတ်ပို့နေရတာပဲ။

Data တွေကို props မပို့ဘဲ — tree ထဲက လိုအပ်တဲ့ component တွေဆီ "teleport" (တိုက်ရိုက်ပို့) လုပ်ဖို့ နည်းလမ်းတစ်ခု ရှိရင် ကောင်းမှာပေါ့နော်? React ရဲ့ context feature နဲ့ဆိုရင် — ရှိပါတယ်!

## Context — Props ပို့ပေးခြင်းရဲ့ အခြားရွေးချယ်စရာ

Context က parent component တစ်ခုကို — သူ့အောက်က tree တစ်ခုလုံးဆီ data ပေးပို့နိုင်စေပါတယ်။ Context ရဲ့ အသုံးပြုပုံ အများကြီး ရှိပါတယ်။ ဥပမာတစ်ခု ဒီမှာပါ။ သူ့ရဲ့ အရွယ်အစားအတွက် `level` တစ်ခုကို လက်ခံတဲ့ ဒီ `Heading` component ကို ကြည့်ပါ:

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```
```jsx
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```
```jsx
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```
`Section` တစ်ခုတည်းအတွင်းက heading အများအပြား တစ်ခုတည်းရဲ့ အရွယ်အစားနဲ့ အမြဲတမ်း ဖြစ်စေချင်တယ်ဆိုပါစို့:

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```
```jsx
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```
```jsx
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```
လက်ရှိမှာ — `<Heading>` တစ်ခုချင်းစီဆီ `level` prop ကို သီးခြားစီ ပို့ပေးနေရပါတယ်:

```jsx
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```
`level` prop ကို `<Section>` component ဆီ ပို့ပြီး — `<Heading>` ကနေ ဖယ်ရှားနိုင်ရင် ကောင်းမှာပေါ့။ ဒီနည်းနဲ့ — section တစ်ခုတည်းထဲက heading တွေ အားလုံး တစ်ခုတည်းရဲ့ အရွယ်အစား ရှိတာကို အတင်းအကျပ် လုပ်နိုင်မှာပါ:

```jsx
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```
ဒါပေမယ့် — `<Heading>` component က သူ့ရဲ့ အနီးဆုံး `<Section>` ရဲ့ level ကို ဘယ်လို သိနိုင်မလဲ? **အဲဒါအတွက် — child တစ်ခုက tree ရဲ့ အပေါ်ဘက်က တစ်နေရာရာကနေ data ကို "တောင်းခံ" နိုင်တဲ့ နည်းလမ်းတစ်ခု လိုပါတယ်။**

Props တွေနဲ့တင်တော့ မလုပ်နိုင်ပါဘူး။ ဒီနေရာမှာ context က ပါဝင်လာတာပါ။ အဆင့် သုံးဆင့်နဲ့ လုပ်ရပါမယ်:

1. Context တစ်ခုကို **ဖန်တီးပါ။** (Heading level အတွက်ဖြစ်လို့ `LevelContext` လို့ ခေါ်နိုင်ပါတယ်။)
2. Data လိုအပ်တဲ့ component ကနေ အဲဒီ context ကို **သုံးပါ။** (`Heading` က `LevelContext` ကို သုံးပါလိမ့်မယ်။)
3. Data ကို သတ်မှတ်ပေးတဲ့ component ကနေ အဲဒီ context ကို **ပေးပို့ပါ (provide)**။ (`Section` က `LevelContext` ကို provide လုပ်ပါလိမ့်မယ်။)

Context က parent တစ်ခုကို — ဘယ်လောက်ဝေးဝေးပဲ ဖြစ်ဖြစ် — သူ့အတွင်းက tree တစ်ခုလုံးဆီ data တချို့ ပေးပို့နိုင်စေပါတယ်။

> _Diagram:_ **အနီးက children တွေမှာ context သုံးခြင်း** — parent က တန်ဖိုးတစ်ခုကို child နှစ်ခုလုံးဆီ တိုက်ရိုက် ပို့ပေးတယ်။ **ဝေးက children တွေမှာ context သုံးခြင်း** — root parent က တန်ဖိုးတစ်ခုကို ကြားထဲက component တွေကို မဖြတ်ဘဲ — အောက်က leaf လေးခုနဲ့ ကြားထဲက component တစ်ခုဆီ တိုက်ရိုက် ပို့ပေးတယ်။

### အဆင့် ၁ — Context ကို ဖန်တီးပါ

ပထမဆုံး — context တစ်ခုကို ဖန်တီးရပါမယ်။ သင့် component တွေ သုံးနိုင်ဖို့ — **သူ့ကို file တစ်ခုကနေ export လုပ်ဖို့** လိုပါတယ်:

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```
```jsx
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```
```jsx
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```
`createContext` ရဲ့ တစ်ခုတည်းသော argument က _default_ တန်ဖိုးပါ။ ဒီမှာ `1` က အကြီးဆုံး heading level ကို ရည်ညွှန်းပါတယ် — ဒါပေမယ့် ဘယ်လို တန်ဖိုးမျိုးမဆို (object တောင်မှ) ပို့နိုင်ပါတယ်။ Default တန်ဖိုးရဲ့ အရေးပါပုံကို နောက်အဆင့်မှာ မြင်ရပါမယ်။

### အဆင့် ၂ — Context ကို သုံးပါ

React ကနေ `useContext` Hook နဲ့ သင့် context ကို import လုပ်ပါ:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```
လက်ရှိမှာ — `Heading` component က `level` ကို props ကနေ ဖတ်ပါတယ်:

```js
export default function Heading({ level, children }) {
  // ...
}
```
အဲဒီအစား — `level` prop ကို ဖယ်ရှားပြီး — သင်အခုလေးတင် import လုပ်ထားတဲ့ context ဖြစ်တဲ့ `LevelContext` ကနေ တန်ဖိုးကို ဖတ်ပါ:

```js
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```
`useContext` က Hook တစ်ခုပါ။ `useState` နဲ့ `useReducer` လိုပဲ — Hook တစ်ခုကို React component တစ်ခုရဲ့ အတွင်းမှာသာ တိုက်ရိုက် ခေါ်နိုင်ပါတယ် (loop တွေ ဒါမှမဟုတ် conditions တွေထဲမှာ မခေါ်ရပါဘူး)။ **`useContext` က `Heading` component က `LevelContext` ကို ဖတ်ချင်တယ်ဆိုတာ React ကို ပြောပြပါတယ်။**

အခု `Heading` component မှာ `level` prop မရှိတော့တာမို့ — သင့် JSX ထဲမှာ `Heading` ဆီ level prop ကို ဒီလိုမျိုး ပို့နေစရာ မလိုတော့ပါဘူး:

```jsx
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```
JSX ကို update လုပ်ပြီး — အဲဒါကို `Section` ကသာ လက်ခံရရှိအောင် လုပ်ပါ:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```
သတိပေးချက်တစ်ခုအနေနဲ့ — ဒါက သင်အလုပ်လုပ်စေချင်နေတဲ့ markup ပါ:

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```
```jsx
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```
```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```
ဒီဥပမာက သိပ်အလုပ်မလုပ်သေးဘူးဆိုတာ သတိပြုပါ! Heading တွေ အားလုံး အရွယ်အစားတူနေပါတယ် — ဘာလို့လဲဆိုတော့ — **သင်က context ကို *သုံးနေ* ပေမယ့် — *provide* မလုပ်ရသေးလို့ပါ။** React က ဘယ်ကရမလဲ မသိပါဘူး!

Context ကို မပေးပို့ရင် — React က ယခင် အဆင့်မှာ သင်သတ်မှတ်ထားတဲ့ default တန်ဖိုးကို သုံးပါလိမ့်မယ်။ ဒီဥပမာမှာ — သင်က `createContext` ရဲ့ argument အဖြစ် `1` ကို သတ်မှတ်ခဲ့တာမို့ — `useContext(LevelContext)` က `1` ကို ပြန်ပေးပြီး — heading တွေ အားလုံးကို `<h1>` အဖြစ် သတ်မှတ်ပါတယ်။ ဒီပြဿနာကို — `Section` တစ်ခုချင်းစီက သူ့ကိုယ်ပိုင် context ကို provide လုပ်ခြင်းဖြင့် ဖြေရှင်းကြည့်ရအောင်။

### အဆင့် ၃ — Context ကို ပေးပို့ပါ (Provide)

`Section` component က လက်ရှိမှာ သူ့ရဲ့ children တွေကို render လုပ်ပါတယ်:

```jsx
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```
သူတို့ဆီ `LevelContext` ကို ပေးပို့ဖို့ — **သူတို့ကို context provider တစ်ခုနဲ့ ပတ်ထားပါ:**

```jsx
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```
ဒါက React ကို ဒီလိုပြောပါတယ် — "ဒီ `<Section>` ရဲ့ အတွင်းက component တစ်ခုခုက `LevelContext` ကို တောင်းရင် — သူတို့ကို ဒီ `level` ကို ပေးလိုက်ပါ။" Component က သူ့အပေါ်က UI tree ထဲမှာ အနီးဆုံး `<LevelContext>` ရဲ့ တန်ဖိုးကို သုံးပါလိမ့်မယ်။

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```
```jsx
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```
```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```
ရလဒ်က မူရင်း code နဲ့ အတူတူပါပဲ — ဒါပေမယ့် `Heading` component တစ်ခုချင်းစီဆီ `level` prop ကို ပို့ပေးနေစရာ မလိုတော့ပါဘူး! အဲဒီအစား — သူက အပေါ်က အနီးဆုံး `Section` ကို မေးပြီး သူ့ရဲ့ heading level ကို "ကိုယ်တိုင် ရှာဖွေတွက်ချက်" ပါတယ်:

1. သင်က `<Section>` ဆီ `level` prop တစ်ခု ပို့ပေးပါတယ်။
2. `Section` က သူ့ရဲ့ children တွေကို `<LevelContext value={level}>` ထဲ ပတ်ထားပါတယ်။
3. `Heading` က အပေါ်က `LevelContext` ရဲ့ အနီးဆုံးတန်ဖိုးကို `useContext(LevelContext)` နဲ့ မေးပါတယ်။

## Component တစ်ခုတည်းကနေ Context ကို သုံးခြင်းနဲ့ ပေးပို့ခြင်း

လက်ရှိမှာ — section တစ်ခုချင်းစီရဲ့ `level` ကို သင်ကိုယ်တိုင် သတ်မှတ်ပေးနေရပါသေးတယ်:

```jsx
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```
Context က အပေါ်က component တစ်ခုကနေ အချက်အလက်တွေကို ဖတ်နိုင်စေတာမို့ — `Section` တစ်ခုချင်းစီက အပေါ်က `Section` ကနေ `level` ကို ဖတ်ပြီး — `level + 1` ကို အလိုအလျောက် အောက်ကို ပို့ပေးနိုင်ပါတယ်။ ဒီလို လုပ်နိုင်ပါတယ်:

```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```
ဒီပြောင်းလဲမှုနဲ့ဆိုရင် — `<Section>` ဆီရော `<Heading>` ဆီပါ `level` prop ကို ပို့နေစရာ *လုံးဝ* မလိုတော့ပါဘူး:

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```
```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```
```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```
အခုဆိုရင် — `Heading` ရော `Section` ပါ သူတို့ ဘယ်လောက် "နက်" လဲဆိုတာကို တွက်ဖို့ `LevelContext` ကို ဖတ်ပါတယ်။ ပြီးတော့ `Section` က သူ့အတွင်းက အရာအားလုံး "ပိုနက်တဲ့" level မှာ ရှိတယ်ဆိုတာ သတ်မှတ်ဖို့ သူ့ရဲ့ children တွေကို `LevelContext` ထဲ ပတ်ထားပါတယ်။

> **မှတ်ချက်:** ဒီဥပမာက heading levels တွေကို သုံးထားတာက — nested component တွေ context ကို ဘယ်လို override လုပ်နိုင်လဲဆိုတာ visually ပြလို့ပါ။ ဒါပေမယ့် context က တခြား use cases တွေအများကြီးအတွက်လည်း အသုံးဝင်ပါတယ်။ Subtree တစ်ခုလုံး လိုအပ်တဲ့ အချက်အလက်ဘာမဆို အောက်ကို ပို့နိုင်ပါတယ် — လက်ရှိ color theme၊ လက်ရှိ login ဝင်ထားတဲ့ user စသဖြင့်ပေါ့။

## Context က ကြားခံ Component တွေကို ဖြတ်သန်းသွားပါတယ်

Context ကို ပေးပို့တဲ့ component နဲ့ သုံးတဲ့ component ကြားမှာ — ကြိုက်သလောက် component တွေ အများကြီး ထည့်နိုင်ပါတယ်။ ဒါမှာ `<div>` လိုမျိုး built-in component တွေရော — သင်ကိုယ်တိုင် တည်ဆောက်ထားတဲ့ component တွေပါ ပါဝင်ပါတယ်။

ဒီဥပမာမှာ — `Post` component တစ်ခုတည်း (dashed border နဲ့) ကို nesting level မတူညီတာ နှစ်နေရာမှာ render လုပ်ထားပါတယ်။ သူ့အတွင်းက `<Heading>` က သူ့ရဲ့ level ကို အနီးဆုံး `<Section>` ကနေ အလိုအလျောက် ရယူတာကို သတိပြုပါ:

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```
```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```
```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```
```js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```
```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```
ဒါ အလုပ်လုပ်ဖို့ သင်ဘာမှ အထူးလုပ်ထားစရာ မလိုပါဘူး။ `Section` တစ်ခုက သူ့အတွင်းက tree အတွက် context ကို သတ်မှတ်ပေးတာမို့ — `<Heading>` တစ်ခုကို ဘယ်နေရာမှာပဲ ထည့်ထည့် — အရွယ်အစား မှန်ကန်စွာ ရပါလိမ့်မယ်။ အထက်က sandbox ထဲမှာ စမ်းကြည့်ပါ!

**Context က သင့်ကို "ပတ်ဝန်းကျင်နဲ့ လိုက်လျောညီထွေဖြစ်နေတဲ့" component တွေ ရေးနိုင်စေပြီး — သူတို့ *ဘယ်မှာ* (တစ်နည်းအားဖြင့် — *ဘယ် context* ထဲမှာ) render လုပ်ခံရလဲဆိုတာပေါ်မူတည်ပြီး ကိုယ့်ကိုယ်ကို မတူညီတဲ့ပုံစံနဲ့ ပြသနိုင်စေပါတယ်။**

Context အလုပ်လုပ်ပုံက [CSS property inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) ကို သတိရစေနိုင်ပါတယ်။ CSS မှာ — `<div>` တစ်ခုအတွက် `color: blue` သတ်မှတ်လိုက်ရင် — သူ့အတွင်းက DOM node တိုင်း — ဘယ်လောက်နက်နက်ပဲ ဖြစ်ဖြစ် — ကြားထဲက DOM node တစ်ခုခုက `color: green` နဲ့ override မလုပ်ထားရင် အဲဒီအရောင်ကို အမွေဆက်ခံပါတယ်။ React မှာလည်း အလားတူပဲ — အပေါ်ကလာတဲ့ context တစ်ခုကို override လုပ်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက — children တွေကို တန်ဖိုး မတူညီတဲ့ context provider တစ်ခုထဲ ပတ်ထားဖို့ပါ။

CSS မှာ — `color` နဲ့ `background-color` လိုမျိုး property မတူညီတာတွေက တစ်ခုကိုတစ်ခု override မလုပ်ပါဘူး။ `<div>` တွေရဲ့ `color` ကို အနီရောင်ထားလိုက်ရုံနဲ့ — `background-color` ကို မထိခိုက်စေပါဘူး။ အလားတူပဲ — **React context မတူညီတာတွေက တစ်ခုကိုတစ်ခု override မလုပ်ပါဘူး။** `createContext()` နဲ့ သင်ဖန်တီးတဲ့ context တစ်ခုချင်းစီက တခြားဟာတွေနဲ့ လုံးဝ သီးခြားဖြစ်ပြီး — အဲဒီ context *တစ်ခုတည်း* ကို သုံးတဲ့ ဒါမှမဟုတ် ပေးပို့တဲ့ component တွေကို ချိတ်ဆက်ပေးပါတယ်။ Component တစ်ခုက context အများကြီးကို ပြဿနာမရှိဘဲ သုံး ဒါမှမဟုတ် ပေးပို့နိုင်ပါတယ်။

## Context မသုံးခင်

Context က သုံးချင်စရာ အရမ်းကောင်းပါတယ်! ဒါပေမယ့် ဒါက — အလွန်အကျွံ သုံးမိဖို့လည်း လွယ်လွန်းတယ်လို့ ဆိုလိုပါတယ်။ **Props တချို့ကို အဆင့်ပေါင်းများစွာ နက်နက်ပို့ပေးဖို့ လိုတာနဲ့ — အဲဒီအချက်အလက်ကို context ထဲ ထည့်သင့်တယ်လို့ မဆိုလိုပါဘူး။**

Context မသုံးခင် စဉ်းစားသင့်တဲ့ အခြားရွေးချယ်စရာ အနည်းငယ် ဒီမှာပါ:

1. **[Props တွေ ပို့ပေးတာကနေ စပါ။](/docs/react/passing-props-to-a-component)** သင့် component တွေက trivial မဟုတ်ရင် — component တစ်ဆယ့်နှစ်ခုကိုဖြတ်ပြီး prop တစ်ဒါဇင် ပို့ပေးရတာ ထူးဆန်းတာ မဟုတ်ပါဘူး။ ပင်ပန်းသလို ခံစားရနိုင်ပေမယ့် — ဘယ် component က ဘယ် data သုံးလဲဆိုတာ အရမ်း ရှင်းလင်းစေပါတယ်! သင့် code ကို ထိန်းသိမ်းမယ့်သူက — data flow တွေကို props တွေနဲ့ ရှင်းလင်းစွာ ဖော်ပြထားတဲ့အတွက် ကျေးဇူးတင်ပါလိမ့်မယ်။
2. **Component တွေကို ထုတ်ယူပြီး — JSX ကို `children` အဖြစ် သူတို့ဆီ [ပို့ပေးပါ](/docs/react/passing-props-to-a-component#passing-jsx-as-children)**။ Data တချို့ကို အဲဒီ data မသုံးတဲ့ (အောက်ကို ဖြတ်ပို့နေရုံပဲ) ကြားခံ component အလွှာများစွာကိုဖြတ်ပြီး ပို့ပေးနေရရင် — ဒါက မကြာခဏဆိုသလို — လမ်းတစ်လျှောက်မှာ component တချို့ ထုတ်ယူဖို့ မေ့နေတာကို ဆိုလိုပါတယ်။ ဥပမာ — `posts` လိုမျိုး data props တွေကို — `<Layout posts={posts} />` လိုမျိုး — သူတို့ကို တိုက်ရိုက် မသုံးတဲ့ visual component တွေဆီ ပို့ပေးနေနိုင်ပါတယ်။ အဲဒီအစား — `Layout` က `children` ကို prop အဖြစ် လက်ခံအောင်လုပ်ပြီး — `<Layout><Posts posts={posts} /></Layout>` လို့ render လုပ်ပါ။ ဒါက data ကို သတ်မှတ်တဲ့ component နဲ့ အဲဒါကို လိုအပ်တဲ့ component ကြားက အလွှာအရေအတွက်ကို လျှော့ချပေးပါတယ်။

ဒီနည်းလမ်း နှစ်ခုလုံး သင့်အတွက် အဆင်မပြေရင်တော့ — context ကို စဉ်းစားပါ။

## Context ရဲ့ အသုံးပြုပုံများ

- **Theming:** သင့် app က user ကို သူ့ရဲ့ အသွင်အပြင် (ဥပမာ dark mode) ပြောင်းခွင့် ပေးထားရင် — သင့် app ရဲ့ ထိပ်ဆုံးမှာ context provider တစ်ခု ထားပြီး — သူတို့ရဲ့ visual look ကို ချိန်ညှိဖို့ လိုအပ်တဲ့ component တွေထဲမှာ အဲဒီ context ကို သုံးနိုင်ပါတယ်။
- **လက်ရှိ အကောင့်:** Component အများကြီးက လက်ရှိ login ဝင်ထားတဲ့ user ကို သိဖို့ လိုနိုင်ပါတယ်။ သူ့ကို context ထဲ ထားတာက — tree ထဲက ဘယ်နေရာမှာမဆို ဖတ်ရလွယ်စေပါတယ်။ App တချို့က တစ်ချိန်တည်းမှာ အကောင့် အများအပြားနဲ့ လည်ပတ်ခွင့်လည်း ပေးပါတယ် (ဥပမာ — user တစ်ယောက်အနေနဲ့ comment ရေးဖို့)။ ဒီလိုကိစ္စတွေမှာ — UI တစ်ပိုင်းကို current account တန်ဖိုး မတူညီတဲ့ nested provider တစ်ခုနဲ့ ပတ်ထားတာ အဆင်ပြေနိုင်ပါတယ်။
- **Routing:** Routing solution အများစုက လက်ရှိ route ကို ကိုင်ထားဖို့ context ကို အတွင်းပိုင်းမှာ သုံးပါတယ်။ ဒါက link တိုင်း သူ့ဟာသူ active ဖြစ်မဖြစ် "သိ" နေတဲ့ နည်းလမ်းပါ။ သင်ကိုယ်တိုင် router တစ်ခု တည်ဆောက်ရင် — ဒါမျိုး လုပ်ချင်လာနိုင်ပါတယ်။
- **State စီမံခန့်ခွဲမှု:** သင့် app ကြီးထွားလာတာနဲ့အမျှ — သင့် app ရဲ့ ထိပ်ဆုံးနားမှာ state အများကြီး ရှိလာနိုင်ပါတယ်။ အောက်က ဝေးလံတဲ့ component အများကြီးက အဲဒါတွေကို ပြောင်းချင်ကြပါလိမ့်မယ်။ ရှုပ်ထွေးတဲ့ state တွေကို စီမံပြီး ဝေးလံတဲ့ component တွေဆီ အခက်အခဲမရှိ ပို့ပေးဖို့ — [reducer ကို context နဲ့ တွဲသုံးတာ](/docs/react/scaling-up-with-reducer-and-context) အဖြစ်များပါတယ်။

Context က static တန်ဖိုးတွေအတွက်ပဲ ကန့်သတ်မထားပါဘူး။ နောက် render မှာ တန်ဖိုး မတူညီတာတစ်ခု ပို့လိုက်ရင် — React က အောက်က အဲဒါကို ဖတ်နေတဲ့ component တွေ အားလုံးကို update လုပ်ပါလိမ့်မယ်! ဒါကြောင့် context ကို state နဲ့ တွဲပြီး မကြာခဏ သုံးတာပါ။

ယေဘုယျအားဖြင့် — tree ရဲ့ နေရာမတူညီတဲ့ အစိတ်အပိုင်းတွေမှာ ရှိတဲ့ ဝေးလံတဲ့ component တွေက အချက်အလက်တချို့ လိုအပ်နေရင် — context က ကူညီပေးမယ့် ကောင်းတဲ့ အရိပ်အယောင်တစ်ခုပါ။

## အကျဉ်းချုပ်

- Context က component တစ်ခုကို — သူ့အောက်က tree တစ်ခုလုံးဆီ အချက်အလက်တချို့ ပေးပို့နိုင်စေပါတယ်။
- Context ပို့ပေးဖို့:
  1. `export const MyContext = createContext(defaultValue)` နဲ့ ဖန်တီးပြီး export လုပ်ပါ။
  2. ဘယ်လောက်နက်နက်ပဲ ဖြစ်ဖြစ် — child component တစ်ခုခုထဲမှာ ဖတ်ဖို့ `useContext(MyContext)` Hook ဆီ ပို့ပေးပါ။
  3. Parent ကနေ ပေးပို့ဖို့ — children တွေကို `<MyContext value={...}>` ထဲ ပတ်ထားပါ။
- Context က ကြားထဲက component တွေကို ဖြတ်သန်းသွားပါတယ်။
- Context က "ပတ်ဝန်းကျင်နဲ့ လိုက်လျောညီထွေဖြစ်နေတဲ့" component တွေ ရေးနိုင်စေပါတယ်။
- Context မသုံးခင် — props ပို့ပေးတာ ဒါမှမဟုတ် JSX ကို `children` အဖြစ် ပို့ပေးတာ အရင်စမ်းကြည့်ပါ။

## စိန်ခေါ်မှုများ (Challenges)

### Prop Drilling ကို Context နဲ့ အစားထိုးခြင်း

ဒီဥပမာမှာ — checkbox ကို toggle လုပ်တာက `<PlaceImage>` တစ်ခုချင်းစီဆီ ပို့ပေးတဲ့ `imageSize` prop ကို ပြောင်းလဲပါတယ်။ Checkbox state က ထိပ်ဆုံး `App` component ထဲမှာ ရှိပေမယ့် — `<PlaceImage>` တစ်ခုချင်းစီက အဲဒါကို သိဖို့ လိုပါတယ်။

လက်ရှိမှာ — `App` က `imageSize` ကို `List` ဆီ ပို့ပြီး — `List` က `Place` တစ်ခုချင်းစီဆီ ပို့ပြီး — `Place` က `PlaceImage` ဆီ ပို့ပါတယ်။ `imageSize` prop ကို ဖယ်ရှားပြီး — အဲဒီအစား `App` component ကနေ `PlaceImage` ဆီ တိုက်ရိုက် ပို့ပေးပါ။

Context ကို `Context.js` ထဲမှာ ကြေညာနိုင်ပါတယ်။

```jsx
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```
```js

```
```js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```
```js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```
#### အဖြေ

Component အားလုံးကနေ `imageSize` prop ကို ဖယ်ရှားပါ။

`Context.js` ကနေ `ImageSizeContext` ကို ဖန်တီးပြီး export လုပ်ပါ။ ပြီးရင် — List ကို `<ImageSizeContext value={imageSize}>` နဲ့ ပတ်ပြီး တန်ဖိုးကို အောက်ကို ပို့ပေးပြီး — `PlaceImage` ထဲမှာ ဖတ်ဖို့ `useContext(ImageSizeContext)` ကို သုံးပါ:

```jsx
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```
```js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```
```js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```
```js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```
ကြားထဲက component တွေက `imageSize` ကို နောက်ထပ် ပို့နေစရာ မလိုတော့တာကို သတိပြုပါ။

## နောက်တစ်ဆင့်တွေ

- [Reducer နဲ့ Context ကို အတူတကွ အသုံးပြုခြင်း](/docs/react/scaling-up-with-reducer-and-context) — ရှုပ်ထွေးတဲ့ state တွေကို context နဲ့ ပေါင်းစပ်စီမံခြင်း
- [State Logic ကို Reducer အဖြစ် ထုတ်ယူခြင်း](/docs/react/extracting-state-logic-into-a-reducer) — state update logic တွေကို function တစ်ခုတည်းမှာ စုစည်းခြင်း
