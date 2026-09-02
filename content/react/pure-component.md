---
title: "PureComponent"
description: "Props နဲ့ state အတူတူဆိုရင် re-render တွေကို ရှောင်ပေးနိုင်တဲ့ Component ရဲ့ subclass — class components တွေမှာ props/state တွေကို shallow နှိုင်းယှဉ်ပြီး performance optimization လုပ်နည်း၊ function components (memo) ဆီ ပြောင်းရွှေ့နည်း"
order: 106
source: "https://react.dev/reference/react/PureComponent"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန် —** Components တွေကို classes တွေအစား functions အဖြစ် သတ်မှတ်ဖို့ အကြံပြုပါတယ်။ (ဘယ်လို migrate လုပ်မလဲ အောက်မှာ ကြည့်ပါ။)

`PureComponent` က [`Component`](/docs/react/component) နဲ့ ဆင်တူပါတယ် — ဒါပေမယ့် props နဲ့ state အတူတူဆိုရင် re-renders တွေကို ရှောင်ပေးပါတယ်။ Class components တွေကို React က ဆက် support လုပ်ပေးပါတယ် — ဒါပေမယ့် code အသစ်တွေမှာတော့ သူတို့ကို သုံးဖို့ အကြံမပြုပါဘူး။

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## ရည်ညွှန်းချက် (Reference)

### `PureComponent`

Props နဲ့ state အတူတူဆိုရင် class component တစ်ခု re-render မဖြစ်အောင် — [`Component`](/docs/react/component) အစား `PureComponent` ကို extend လုပ်ပါ:

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` က `Component` ရဲ့ subclass တစ်ခုဖြစ်ပြီး — [`Component` APIs တွေ အားလုံး](/docs/react/component) ကို support လုပ်ပါတယ်။ `PureComponent` ကို extend လုပ်တာက — props နဲ့ state တွေကို shallow နှိုင်းယှဉ်ပေးတဲ့ — custom [`shouldComponentUpdate`](/docs/react/component) method တစ်ခု သတ်မှတ်နေတာနဲ့ ညီမျှပါတယ်။

အောက်မှာ ဥပမာ တွေ ထပ်ကြည့်ပါ။

---

## အသုံးပြုပုံ (Usage)

### Class components တွေအတွက် မလိုအပ်တဲ့ re-renders တွေကို ရှောင်ခြင်း

ပုံမှန်အားဖြင့် — parent re-render ဖြစ်တိုင်း React က component ကို re-render လုပ်ပါတယ်။ Optimization တစ်ခုအနေနဲ့ — props အသစ်တွေနဲ့ state အသစ်တွေက အဟောင်းတွေနဲ့ အတူတူပဲ ဆိုရင် — parent re-render ဖြစ်ပေမယ့် React က re-render မလုပ်တဲ့ component တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ [Class components](/docs/react/component) တွေက `PureComponent` ကို extend လုပ်ပြီး — ဒီအပြုအမူကို ရွေးချယ်နိုင်ပါတယ်:

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React component တစ်ခုမှာ [pure rendering logic](/docs/react/keeping-components-pure) အမြဲ ရှိသင့်ပါတယ်။ ဆိုလိုတာက — props၊ state နဲ့ context တွေ မပြောင်းဘူးဆိုရင် — output အတူတူပဲ ပြန်ပေးရမယ်လို့ ဆိုလိုပါတယ်။ `PureComponent` သုံးခြင်းဖြင့် — သင့် component က ဒီလိုအပ်ချက်ကို လိုက်နာတယ်လို့ React ကို ပြောလိုက်တာမို့ — props နဲ့ state တွေ မပြောင်းသရွေ့ React က re-render လုပ်စရာ မလိုတော့ပါဘူး။ ဒါပေမယ့် — သင့် component က သုံးနေတဲ့ context တစ်ခုခု ပြောင်းရင်တော့ — re-render ဖြစ်ပါဦးမယ်။

ဒီဥပမာမှာ — `name` ပြောင်းတိုင်း `Greeting` component က re-render ဖြစ်ပေမယ့် (ဘာလို့လဲဆိုတော့ — `name` က သူ့ရဲ့ props တစ်ခုမို့ပါ) — `address` ပြောင်းရင်တော့ re-render မဖြစ်ပါဘူး (ဘာလို့လဲဆိုတော့ — `Greeting` ဆီ prop အဖြစ် မပို့လို့ပါ):

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

> **သတိပြုရန် —** Components တွေကို classes တွေအစား functions အဖြစ် သတ်မှတ်ဖို့ အကြံပြုပါတယ်။ (ဘယ်လို migrate လုပ်မလဲ အောက်မှာ ကြည့်ပါ။)

---

## နောက်ထပ် ရွေးစရာများ (Alternatives)

### `PureComponent` class component တစ်ခုကနေ function ဆီ ပြောင်းခြင်း

Code အသစ်တွေမှာ [class components](/docs/react/component) တွေအစား function components တွေကို သုံးဖို့ အကြံပြုပါတယ်။ `PureComponent` သုံးထားတဲ့ class components အဟောင်းတွေ ရှိနေရင် — ဒီလို ပြောင်းနိုင်ပါတယ်။ ဒါက မူရင်း code ပါ:

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

[ဒီ component ကို class ကနေ function ဆီ ပြောင်းတဲ့အခါ](/docs/react/component) — [`memo`](/docs/react/memo) နဲ့ ထုပ်ပါ:

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

> **မှတ်ချက်:** `PureComponent` နဲ့ မတူဘဲ — [`memo`](/docs/react/memo) က state အဟောင်းနဲ့ အသစ်ကို နှိုင်းယှဉ်မပေးပါဘူး။ Function components တွေမှာ — state အတူတူနဲ့ [`set` function](/docs/react/use-state) ကို ခေါ်ရင် — `memo` မပါဘဲတောင် — [default အနေနဲ့ re-renders တွေကို ကာကွယ်ပြီးသား](/docs/react/memo) ဖြစ်ပါတယ်။
