---
title: "Component များကြား State မျှဝေခြင်း"
description: "Lifting state up — component နှစ်ခုရဲ့ state ကို သူတို့ရဲ့ အနီးဆုံး common parent ဆီ ရွှေ့ပြီး props နဲ့ ပြန်ပို့ခြင်း၊ controlled နဲ့ uncontrolled component များအကြောင်း"
order: 9
source: "https://react.dev/learn/sharing-state-between-components"
status: translated
updated: 2026-09-01
---

တခါတရံ — component နှစ်ခုရဲ့ state တွေ အမြဲတမ်း အတူတကွ ပြောင်းလဲစေချင်တာမျိုး ရှိပါတယ်။ အဲဒါလုပ်ဖို့ — နှစ်ခုလုံးကနေ state ကို ဖယ်ရှားပြီး — သူတို့ရဲ့ အနီးဆုံး ဘုံမိဘ (closest common parent) ဆီ ရွှေ့ပြီး — props ကနေ အောက်ကို ပြန်ပို့ပေးပါ။ ဒါကို *lifting state up* (state ကို အပေါ်ဆီ မြှင့်တင်ခြင်း) လို့ ခေါ်ပြီး — React code ရေးတဲ့အခါ သင်လုပ်ရမယ့် အဖြစ်အများဆုံး အလုပ်တွေထဲက တစ်ခုပါ။

## သင်ယူရမည့်အကြောင်းအရာများ

- State ကို အပေါ်ဆီ မြှင့်တင်ပြီး component တွေကြား ဘယ်လို မျှဝေမလဲ
- Controlled နဲ့ uncontrolled component တွေဆိုတာ ဘာလဲ

## Lifting State Up — ဥပမာတစ်ခုနဲ့ ကြည့်ခြင်း

ဒီဥပမာမှာ — parent `Accordion` component တစ်ခုက `Panel` နှစ်ခုကို သီးခြား render လုပ်ပါတယ်:

* `Accordion`
  - `Panel`
  - `Panel`

`Panel` component တစ်ခုချင်းစီမှာ — သူ့ရဲ့ content မြင်ရမြင်ရဆိုတာကို ဆုံးဖြတ်တဲ့ boolean `isActive` state တစ်ခု ရှိပါတယ်။

Panel နှစ်ခုလုံးရဲ့ Show button ကို နှိပ်ကြည့်ပါ:

```jsx
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```
```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```
Panel တစ်ခုရဲ့ button ကို နှိပ်လိုက်တာက တစ်ခြား panel ကို မထိခိုက်စေဘူးဆိုတာ သတိပြုပါ — သူတို့က တစ်ခုနဲ့တစ်ခု အမှီအခိုကင်းပါတယ်။

> _Diagram:_ အစပိုင်းမှာ — `Panel` တစ်ခုချင်းစီရဲ့ `isActive` state က `false` ဖြစ်တာမို့ နှစ်ခုလုံး ခေါက်ထားတဲ့အတိုင်း (collapsed) ပေါ်နေပါတယ်။ Panel တစ်ခုခုရဲ့ button ကို နှိပ်ရင် — အဲဒီ `Panel` တစ်ခုတည်းရဲ့ `isActive` state ကိုပဲ update လုပ်ပါတယ်။

**ဒါပေမယ့် — တစ်ချိန်မှာ panel တစ်ခုတည်းပဲ ဖြန့်ထားစေချင်တယ်ဆိုပါစို့။** ဒီဒီဇိုင်းနဲ့ဆိုရင် — ဒုတိယ panel ကို ဖြန့်လိုက်တာနဲ့ ပထမ panel က ခေါက်သွားရပါမယ်။ အဲဒါကို ဘယ်လို လုပ်မလဲ?

Panel နှစ်ခုကို ညှိနှိုင်းဖို့ — သူတို့ရဲ့ state ကို parent component ဆီ "lift up" (မြှင့်တင်) လုပ်ဖို့ လိုပြီး — အဆင့် သုံးဆင့် ရှိပါတယ်:

1. Child component တွေကနေ state ကို **ဖယ်ရှားပါ။**
2. Common parent ကနေ hardcoded data ကို **ပို့ပေးပါ။**
3. Common parent မှာ state ကို **ထည့်ပြီး** event handler တွေနဲ့အတူ အောက်ကို ပို့ပေးပါ။

ဒါက `Accordion` component ကို `Panel` နှစ်ခုလုံးကို ညှိနှိုင်းပြီး — တစ်ကြိမ်မှာ တစ်ခုတည်းပဲ ဖြန့်ထားနိုင်စေပါလိမ့်မယ်။

### အဆင့် ၁ — Child Component တွေကနေ State ကို ဖယ်ရှားပါ

`Panel` ရဲ့ `isActive` ကို ထိန်းချုပ်ခွင့်ကို သူ့ရဲ့ parent component ဆီ ပေးလိုက်ပါမယ်။ ဆိုလိုတာက — parent component က `isActive` ကို `Panel` ဆီ prop အနေနဲ့ ပို့ပေးပါလိမ့်မယ်။ `Panel` component ကနေ **ဒီ line ကို ဖယ်ရှားပြီး** စလိုက်ပါ:

```js
const [isActive, setIsActive] = useState(false);
```
ပြီးတော့ — `Panel` ရဲ့ props list ထဲ `isActive` ကို ထည့်ပါ:

```js
function Panel({ title, children, isActive }) {
```
အခု `Panel` ရဲ့ parent component က [prop အဖြစ် အောက်ကို ပို့ပေးခြင်းဖြင့်](/docs/react/props) `isActive` ကို *ထိန်းချုပ်* နိုင်ပါပြီ။ အပြန်အလှန်အနေနဲ့ — `Panel` component က `isActive` ရဲ့ တန်ဖိုးအပေါ် *ထိန်းချုပ်မှု လုံးဝ မရှိတော့ပါဘူး* — အခုဆိုရင် အဲဒါ parent component ရဲ့ တာဝန်ပါ!

### အဆင့် ၂ — Common Parent ကနေ Hardcoded Data ကို ပို့ပေးပါ

State ကို lift up လုပ်ဖို့ — သင်ညှိနှိုင်းချင်တဲ့ child component *နှစ်ခုလုံး* ရဲ့ အနီးဆုံး common parent component ကို ရှာရပါမယ်:

* `Accordion` *(အနီးဆုံး common parent)*
  - `Panel`
  - `Panel`

ဒီဥပမာမှာ — အဲဒါက `Accordion` component ပါ။ သူက panel နှစ်ခုလုံးရဲ့ အပေါ်မှာ ရှိပြီး သူတို့ရဲ့ props တွေကို ထိန်းချုပ်နိုင်တာမို့ — ဘယ် panel က လက်ရှိ active လဲဆိုတာအတွက် "source of truth" (အမှန်တရား၏ အရင်းအမြစ်) ဖြစ်လာပါမယ်။ `Accordion` component က `isActive` တန်ဖိုး hardcoded တစ်ခု (ဥပမာ `true`) ကို panel နှစ်ခုလုံးဆီ ပို့ပေးအောင် လုပ်ပါ:

```jsx
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```
```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```
`Accordion` component ထဲက hardcoded `isActive` တန်ဖိုးတွေကို ပြင်ကြည့်ပြီး — screen ပေါ်က ရလဒ်ကို ကြည့်ပါ။

### အဆင့် ၃ — Common Parent မှာ State ထည့်ပါ

State ကို lift up လုပ်တာက သင်သိမ်းထားတဲ့ state ရဲ့ သဘောသဘာဝကိုပါ မကြာခဏ ပြောင်းလဲစေပါတယ်။

ဒီကိစ္စမှာ — တစ်ချိန်မှာ panel တစ်ခုတည်းပဲ active ဖြစ်သင့်ပါတယ်။ ဆိုလိုတာက — `Accordion` common parent component က ဘယ် panel က active ဖြစ်နေလဲဆိုတာကို ခြေရာခံဖို့ လိုပါတယ်။ `boolean` တန်ဖိုးအစား — active `Panel` ရဲ့ index ကို number အနေနဲ့ state variable အတွက် သုံးနိုင်ပါတယ်:

```js
const [activeIndex, setActiveIndex] = useState(0);
```
`activeIndex` က `0` ဆိုရင် ပထမ panel active ဖြစ်ပြီး — `1` ဆိုရင် ဒုတိယတစ်ခု ဖြစ်ပါတယ်။

`Panel` တစ်ခုခုထဲက "Show" button ကို နှိပ်တာက `Accordion` ထဲက active index ကို ပြောင်းဖို့ လိုပါတယ်။ `Panel` တစ်ခုက `activeIndex` state ကို တိုက်ရိုက် set လုပ်လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒါက `Accordion` ထဲမှာ သတ်မှတ်ထားလို့ပါ။ `Accordion` component က — [event handler တစ်ခုကို prop အဖြစ် အောက်ကို ပို့ပေးခြင်းဖြင့်](/docs/react/events#passing-event-handlers-as-props) `Panel` component ကို သူ့ရဲ့ state ပြောင်းခွင့် *ရှင်းလင်းစွာ ခွင့်ပြု* ပေးရပါမယ်:

```jsx
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```
`Panel` ထဲက `<button>` က အခု `onShow` prop ကို သူ့ရဲ့ click event handler အဖြစ် သုံးပါလိမ့်မယ်:

```jsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```
```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```
ဒါနဲ့ lifting state up ပြီးပါပြီ! State ကို common parent component ထဲ ရွှေ့လိုက်တာက — panel နှစ်ခုကို ညှိနှိုင်းနိုင်စေခဲ့ပါတယ်။ "is shown" flag နှစ်ခုအစား active index ကို သုံးတာက — တစ်ချိန်မှာ panel တစ်ခုတည်းပဲ active ဖြစ်တာ သေချာစေခဲ့ပါတယ်။ Event handler ကို child ဆီ ပို့ပေးတာက — child က parent ရဲ့ state ကို ပြောင်းနိုင်စေခဲ့ပါတယ်။

> _Diagram:_ အစပိုင်းမှာ — `Accordion` ရဲ့ `activeIndex` က `0` ဖြစ်လို့ ပထမ `Panel` က `isActive = true` ရပြီး ဒုတိယ `Panel` က `isActive = false` ရပါတယ်။ `Accordion` ရဲ့ `activeIndex` state က `1` ကို ပြောင်းသွားတဲ့အခါ — ဒုတိယ `Panel` ကသာ `isActive = true` ရပါတော့တယ်။

#### Controlled နဲ့ Uncontrolled Component များ

Local state တစ်ခုခု ရှိတဲ့ component ကို "uncontrolled" လို့ ခေါ်တာ အဖြစ်များပါတယ်။ ဥပမာ — `isActive` state variable ပါတဲ့ မူလ `Panel` component က uncontrolled ပါ — ဘာလို့လဲဆိုတော့ သူ့ရဲ့ parent က panel active ဖြစ်မဖြစ်ကို လွှမ်းမိုးလို့ မရလို့ပါ။

အပြန်အလှန်အနေနဲ့ — component တစ်ခုရဲ့ အရေးကြီးတဲ့ အချက်အလက်တွေက သူ့ရဲ့ ကိုယ်ပိုင် local state ထက် props တွေနဲ့ မောင်းနှင်နေရင် — အဲဒီ component ကို "controlled" လို့ ပြောလို့ရပါတယ်။ ဒါက parent component က သူ့ရဲ့ အပြုအမူကို အပြည့်အဝ သတ်မှတ်နိုင်စေပါတယ်။ `isActive` prop ပါတဲ့ နောက်ဆုံး `Panel` component က `Accordion` component ရဲ့ ထိန်းချုပ်မှုအောက်မှာ ရှိပါတယ်။

Uncontrolled component တွေက သူတို့ရဲ့ parents တွေအတွင်း သုံးရပိုလွယ်ပါတယ် — ဘာလို့လဲဆိုတော့ configuration ပိုနည်းလို့ပါ။ ဒါပေမယ့် သူတို့ကို အတူတကွ ညှိနှိုင်းချင်တဲ့အခါ — ပြောင်းလွယ်ပြင်လွယ် နည်းပါတယ်။ Controlled component တွေက အများဆုံး ပြောင်းလွယ်ပြင်လွယ် ရှိပေမယ့် — parent component တွေက props တွေနဲ့ အပြည့်အဝ configure လုပ်ပေးဖို့ လိုပါတယ်။

လက်တွေ့မှာ — "controlled" နဲ့ "uncontrolled" တွေက တိကျတဲ့ နည်းပညာဝေါဟာရတွေ မဟုတ်ပါဘူး — component တစ်ခုချင်းစီမှာ များသောအားဖြင့် local state ရော props ပါ ရောနှောပါဝင်ပါတယ်။ ဒါပေမယ့် — component တွေကို ဘယ်လို ဒီဇိုင်းလုပ်ထားလဲ၊ ဘယ်လို စွမ်းဆောင်နိုင်စွမ်းတွေ ပေးလဲဆိုတာကို ပြောဆိုဖို့ ဒီနည်းက အသုံးဝင်ပါတယ်။

Component တစ်ခု ရေးတဲ့အခါ — အဲဒီထဲက ဘယ်အချက်အလက်တွေကို controlled (props ကနေ) ဖြစ်စေသင့်လဲ၊ ဘယ်ဟာတွေကို uncontrolled (state ကနေ) ဖြစ်စေသင့်လဲဆိုတာ စဉ်းစားပါ။ ဒါပေမယ့် နောက်မှ စိတ်ပြောင်းပြီး refactor လုပ်လို့ အမြဲ ရပါတယ်။

## State တစ်ခုချင်းစီအတွက် Single Source of Truth

React application တစ်ခုမှာ — component အများကြီးက သူတို့ရဲ့ ကိုယ်ပိုင် state တွေ ရှိကြပါတယ်။ State တချို့က inputs တွေလိုမျိုး — leaf component တွေ (tree ရဲ့ အောက်ဆုံး component တွေ) အနီးမှာ "နေထိုင်" ပါတယ်။ တခြား state တွေက app ရဲ့ ထိပ်ဆုံးနားမှာ "နေထိုင်" ပါတယ်။ ဥပမာ — client-side routing library တွေတောင် များသောအားဖြင့် — လက်ရှိ route ကို React state ထဲ သိမ်းပြီး props နဲ့ အောက်ကို ပို့ပေးခြင်းဖြင့် implement လုပ်ကြပါတယ်!

**State အပိုင်းတစ်ခုချင်းစီအတွက် — အဲဒီ state ကို "ပိုင်ဆိုင်" မယ့် component တစ်ခုကို သင်ရွေးချယ်ရပါတယ်။** ဒီမူကို ["single source of truth"](https://en.wikipedia.org/wiki/Single_source_of_truth) ရှိခြင်းလို့လည်း ခေါ်ပါတယ်။ ဒါက state အားလုံး နေရာတစ်ခုတည်းမှာ ရှိတယ်လို့ ဆိုလိုတာ မဟုတ်ပါဘူး — ဒါပေမယ့် state *တစ်ခုချင်းစီ* အတွက် အဲဒီအချက်အလက်ကို ကိုင်ထားတဲ့ *တိကျတဲ့* component တစ်ခု ရှိတယ်ဆိုတာပါ။ Component တွေကြားမှာ shared state ကို ထပ်ထည့်မယ့်အစား — သူတို့ရဲ့ ဘုံ shared parent ဆီ *lift up* လုပ်ပြီး — လိုအပ်တဲ့ children တွေဆီ *pass down* လုပ်ပါ။

အလုပ်လုပ်ရင်း သင့် app က ပြောင်းလဲပါလိမ့်မယ်။ State အပိုင်းတစ်ခုချင်းစီ ဘယ်မှာ "နေထိုင်" မလဲဆိုတာ ရှာနေတုန်းမှာ — state ကို အောက်ကို ရွှေ့တာ ဒါမှမဟုတ် အပေါ်ကို ပြန်ရွှေ့တာတွေ လုပ်ရတာ ပုံမှန်ပါ။ ဒါတွေအားလုံးက လုပ်ငန်းစဉ်ရဲ့ အစိတ်အပိုင်းပါ!

Component အနည်းငယ်နဲ့ လက်တွေ့မှာ ဘယ်လို ခံစားရလဲ ကြည့်ဖို့ — [React အတွေးအခေါ်](/docs/react/thinking-in-react) ကို ဖတ်ကြည့်ပါ။

## အကျဉ်းချုပ်

- Component နှစ်ခုကို ညှိနှိုင်းချင်ရင် — သူတို့ရဲ့ state ကို သူတို့ရဲ့ common parent ဆီ ရွှေ့ပါ။
- ပြီးရင် အဲဒီ common parent ကနေ props တွေနဲ့ အချက်အလက်တွေကို အောက်ကို ပို့ပေးပါ။
- နောက်ဆုံးမှာ — children တွေ parent ရဲ့ state ကို ပြောင်းနိုင်ဖို့ event handler တွေကို အောက်ကို ပို့ပေးပါ။
- Component တွေကို "controlled" (props နဲ့ မောင်းနှင်တာ) ဒါမှမဟုတ် "uncontrolled" (state နဲ့ မောင်းနှင်တာ) အနေနဲ့ သုံးသပ်ကြည့်တာ အသုံးဝင်ပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Input နှစ်ခု ထပ်တူဖြစ်အောင် လုပ်ခြင်း (Synced Inputs)

ဒီ input နှစ်ခုက တစ်ခုနဲ့တစ်ခု အမှီအခိုကင်းပါတယ်။ သူတို့ ထပ်တူဖြစ်နေအောင် လုပ်ပါ — input တစ်ခုကို တည်းဖြတ်ရင် တစ်ခြား input မှာလည်း text တစ်ခုတည်းနဲ့ update ဖြစ်ရပါမယ်။

> **အရိပ်အမြွက်:** သူတို့ရဲ့ state ကို parent component ထဲ lift up လုပ်ဖို့ လိုပါလိမ့်မယ်။

```jsx
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```
```css
input { margin: 5px; }
label { display: block; }
```
#### အဖြေ

`text` state variable ကို `handleChange` handler နဲ့အတူ parent component ထဲ ရွှေ့ပါ။ ပြီးရင် `Input` component နှစ်ခုလုံးဆီ props အဖြစ် အောက်ကို ပို့ပေးပါ။ ဒါက သူတို့ ထပ်တူဖြစ်နေအောင် လုပ်ပေးပါလိမ့်မယ်။

```jsx
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```
```css
input { margin: 5px; }
label { display: block; }
```
### List တစ်ခုကို Filter လုပ်ခြင်း

ဒီဥပမာမှာ — `SearchBar` မှာ text input ကို ထိန်းချုပ်တဲ့ ကိုယ်ပိုင် `query` state တစ်ခု ရှိပါတယ်။ သူ့ရဲ့ parent `FilterableList` component က item တွေရဲ့ `List` တစ်ခုကို ပြပါတယ် — ဒါပေမယ့် search query ကို ထည့်သွင်းစဉ်းစားမထားပါဘူး။

`filterItems(foods, query)` function ကို သုံးပြီး — search query အလိုက် list ကို filter လုပ်ပါ။ သင့်ပြောင်းလဲမှုတွေကို စမ်းသပ်ဖို့ — input ထဲမှာ "s" ရိုက်လိုက်ရင် list က "Sushi"၊ "Shish kebab" နဲ့ "Dim sum" အထိ filter ကျသွားတာ စစ်ဆေးပါ။

`filterItems` က implement လုပ်ပြီးသား import လုပ်ပြီးသားမို့ — သင်ကိုယ်တိုင် ရေးစရာ မလိုဘူးဆိုတာ သတိပြုပါ!

> **အရိပ်အမြွက်:** `SearchBar` ကနေ `query` state နဲ့ `handleChange` handler ကို ဖယ်ရှားပြီး — `FilterableList` ဆီ ရွှေ့ချင်ပါလိမ့်မယ်။ ပြီးရင် `query` နဲ့ `onChange` props အဖြစ် `SearchBar` ဆီ အောက်ကို ပို့ပေးပါ။

```jsx
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
```js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```
#### အဖြေ

`query` state ကို `FilterableList` component ထဲ lift up လုပ်ပါ။ `filterItems(foods, query)` ကို ခေါ်ပြီး filtered list ကို ရယူကာ `List` ဆီ အောက်ကို ပို့ပေးပါ။ အခုဆိုရင် query input ပြောင်းတာက list ထဲမှာ ထင်ဟပ်ပါပြီ:

```jsx
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
```js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```
## နောက်တစ်ဆင့်တွေ

- [State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း](/docs/react/preserving-and-resetting-state) — state ကို ဘယ်အချိန် ထိန်းသိမ်း/ပြန်လည်သတ်မှတ်လဲ
- [State Structure ရွေးချယ်ခြင်း](/docs/react/choosing-the-state-structure) — state ကို ဖွဲ့စည်းပုံ ကောင်းအောင် လုပ်နည်း
