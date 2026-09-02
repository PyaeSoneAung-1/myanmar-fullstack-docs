---
title: "Component"
description: "JavaScript classes တွေနဲ့ သတ်မှတ်ထားတဲ့ React components တွေရဲ့ base class — class components တွေကို React က ဆက် support လုပ်ပေးသေးပေမယ့် code အသစ်တွေမှာ function components တွေကို အကြံပြုပါတယ်"
order: 68
source: "https://react.dev/reference/react/Component"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန် —** Components တွေကို classes တွေအစား functions အဖြစ် သတ်မှတ်ဖို့ အကြံပြုပါတယ်။ (အောက်က Alternatives section မှာ ဘယ်လို migrate လုပ်မလဲ ကြည့်ပါ။)

`Component` ဆိုတာ — [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) တွေနဲ့ သတ်မှတ်ထားတဲ့ React components တွေရဲ့ base class ပါ။ Class components တွေကို React က ဆက်ပြီး support လုပ်ပေးပါတယ် — ဒါပေမယ့် code အသစ်တွေမှာ သူတို့ကို သုံးဖို့ အကြံမပြုပါဘူး။

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## ရည်ညွှန်းချက် (Reference)

### `Component` class တစ်ခုကို သတ်မှတ်ခြင်း

React component တစ်ခုကို class အဖြစ် သတ်မှတ်ဖို့ — built-in `Component` class ကို extend ပြီး `render` method တစ်ခု သတ်မှတ်ပါ:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render` method ကပဲ မဖြစ်မနေ လိုအပ်ပြီး — တခြား methods တွေက optional ပါ။ Hooks တွေ (`use` နဲ့ စတဲ့ functions — [`useState`](/docs/react/use-state) လိုမျိုး) က class components ရဲ့ အတွင်းမှာ support မလုပ်ပါဘူး။

**Instance fields (အင်စတန်း နယ်ပယ်များ)**

- **`this.props`** — parent ကနေ class component ဆီ ပို့လိုက်တဲ့ props တွေပါ။ Function components တွေမှာ [props တွေကို ကြေညာခြင်း](https://react.dev/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) နဲ့ ညီမျှပါတယ်။
- **`this.state`** — class component ရဲ့ state — **object တစ်ခု ဖြစ်ရပါမယ်**။ State ကို တိုက်ရိုက် mutate မလုပ်ရဘဲ — ပြောင်းချင်ရင် `setState` ကို ခေါ်ရပါတယ်။ Function components မှာ [`useState`](/docs/react/use-state) ခေါ်တာနဲ့ ညီမျှပါတယ်။
- **`this.context`** — class component ရဲ့ [context](https://react.dev/learn/passing-data-deeply-with-context)။ `static contextType` နဲ့ ဘယ် context ကို လက်ခံမလဲ သတ်မှတ်ထားမှသာ ရနိုင်ပြီး — class component တစ်ခုက တစ်ကြိမ်မှာ context တစ်ခုပဲ ဖတ်လို့ရပါတယ်။ Function components မှာ [`useContext`](/docs/react/use-context) နဲ့ ညီမျှပါတယ်:

```js
class Button extends Component {
  static contextType = ThemeContext; // createContext နဲ့ ဖန်တီးထားတဲ့ value ဖြစ်ရမယ်

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>{this.props.children}</button>
    );
  }
}
```

### `constructor(props)`

[Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) က class component တစ်ခု *mount* မဖြစ်ခင် (screen ပေါ် မရောက်ခင်) run ပါတယ်။ React မှာ constructor ကို ပုံမှန်အားဖြင့် ရည်ရွယ်ချက် နှစ်ခုအတွက်ပဲ သုံးပါတယ် — state ကြေညာဖို့ နဲ့ class methods တွေကို class instance နဲ့ [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) လုပ်ဖို့ပါ:

```js
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
}
```

Modern JavaScript syntax (public class fields) သုံးရင် — constructor တွေ ခဲယဉ်းမှ မလိုတော့ပါဘူး:

```js
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
}
```

**Caveats:** Constructor ထဲမှာ side effects ဒါမှမဟုတ် subscriptions တွေ မထည့်ရဘူး — အဲဒါတွေက `componentDidMount` အတွက် ဖြစ်တာတွေပါ။ တခြား statement တွေ မရေးခင် `super(props)` ကို အရင် ခေါ်ရမယ် — မခေါ်ရင် constructor run နေချိန်မှာ `this.props` က `undefined` ဖြစ်နေပြီး bugs တွေ ဖြစ်စေနိုင်ပါတယ်။ Constructor က `this.state` ကို တိုက်ရိုက် assign လုပ်လို့ရတဲ့ **တစ်ခုတည်းသော နေရာ** ဖြစ်ပြီး — ကျန်တဲ့ method တွေမှာ `this.setState()` ကိုပဲ သုံးရပါတယ်။ Server rendering မှာလည်း constructor က server ပေါ်မှာ run ပြီး — `componentDidMount`/`componentWillUnmount` လို lifecycle methods တွေကတော့ server မှာ run မှာ မဟုတ်ပါဘူး။ [Strict Mode](/docs/react/strict-mode) ဖွင့်ထားရင် — development မှာ React က constructor ကို နှစ်ခါ ခေါ်ပြီး instance တစ်ခုကို ပစ်ပယ်ပါတယ် (မတော်တဆ side effects တွေကို သတိထားမိစေဖို့ပါ)။ Function components မှာ constructor ရဲ့ အတိအကျ ညီမျှမှု မရှိပါဘူး — state ကြေညာဖို့ [`useState`](/docs/react/use-state) ကို သုံးပါ။

### `render()`

`render` method က class component တစ်ခုမှာ မဖြစ်မနေ လိုအပ်တဲ့ တစ်ခုတည်းသော method ပါ — screen ပေါ်မှာ ဘာတွေ ပေါ်စေချင်လဲ သတ်မှတ်ပေးရပါတယ်:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React က `render` ကို ဘယ်အချိန်မဆို ခေါ်နိုင်တာမို့ — တိကျတဲ့ အချိန်မှာ run မယ်လို့ မယူဆသင့်ပါဘူး။ `render` က ပုံမှန်အားဖြင့် [JSX](https://react.dev/learn/writing-markup-with-jsx) တစ်ပိုင်းကို ပြန်ပေးပြီး — တခြား return types တချို့ (strings တွေလို) လည်း ရပါတယ် (React elements ဖြစ်တဲ့ `<div />`, strings, numbers, [portals](https://react.dev/reference/react-dom/createPortal), `null`/`undefined`/`true`/`false` စတဲ့ empty nodes, React nodes arrays)။ Return JSX တွက်ဖို့ — `render` က `this.props`၊ `this.state` နဲ့ `this.context` တွေကို ဖတ်နိုင်ပါတယ်။

**Caveats:** `render` ကို props/state/context တွေရဲ့ **pure function** အဖြစ် ရေးရပါမယ် — အတူတူဆိုရင် ရလဒ်တူရမယ်၊ side effects (subscriptions တပ်ဆင်တာမျိုး) ဒါမှမဟုတ် browser APIs တွေနဲ့ ထိတွေ့ခြင်း မပါရဘူး။ Side effects တွေကို event handlers ဒါမှမဟုတ် `componentDidMount` လို methods တွေထဲမှာပဲ လုပ်ရပါတယ်။ `shouldComponentUpdate` က `false` ပြန်ရင် `render` ကို မခေါ်တော့ပါဘူး။ Strict Mode မှာ development အတွက် `render` ကို နှစ်ခါ ခေါ်ပြီး ရလဒ်တစ်ခုကို ပစ်ပယ်ပါတယ်။

### `setState(nextState, callback?)`

`setState` က component state ကို update လုပ်ဖို့ ခေါ်ပါတယ် — state ထဲကို ပြောင်းလဲမှုတွေကို enqueue လုပ်ပြီး — ဒီ component ရော သူ့ရဲ့ children ပါ state အသစ်နဲ့ re-render လိုအပ်ကြောင်း React ကို ပြောပါတယ်:

```js
class Form extends Component {
  state = { name: 'Taylor' };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({ name: newName });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

**Caveats:**

- `setState` ခေါ်တာက လက်ရှိ run နေတဲ့ code ထဲမှာ state ကို ချက်ချင်း မပြောင်းပါဘူး — `this.setState({name: 'Robin'})` ပြီးချင်း `console.log(this.state.name)` လုပ်ရင် "Taylor" ပဲ ပြနေဦးမှာပါ။ နောက် *render* ကစပြီးမှသာ `this.state` ထဲမှာ သက်ရောက်ပါတယ်။ Update ပြီးမှ လုပ်ချင်တာတွေအတွက် `componentDidUpdate` ဒါမှမဟုတ် `setState` ရဲ့ `callback` argument ကို သုံးပါ။
- Next state ကို ယခင် state ပေါ် မူတည်ပြီး တွက်ချင်ရင် — object အစား function (updater) ပို့နိုင်ပါတယ်: `this.setState(prevState => ({ age: prevState.age + 1 }))` — pure ဖြစ်ရပြီး — event တစ်ခုအတွင်း state ကို အကြိမ်များစွာ update လုပ်ချင်ရင် အသုံးဝင်ပါတယ်။
- `setState` ကို *request* တစ်ခုလို သဘောထားပါ — event တစ်ခုကို တုံ့ပြန်ပြီး components အများကြမ်း state update လုပ်ရင် — React က updates တွေကို batch လုပ်ပြီး — event အဆုံးမှာ တစ်ခါတည်း အတူတကွ re-render လုပ်ပါတယ်။ Synchronous ဖြစ်အောင် တွန်းဖို့ လိုရင် [`flushSync`](https://react.dev/reference/react-dom/flushSync) နဲ့ ထုပ်လို့ရပေမယ့် — performance ကို ထိခိုက်စေနိုင်ပါတယ်။

### Lifecycle methods — `componentDidMount` / `componentDidUpdate` / `componentWillUnmount`

- **`componentDidMount()`** — component ကို screen ပေါ် *mount* (ထည့်) လုပ်ပြီးတဲ့အခါ React က ခေါ်ပါတယ်။ Data fetching စတာ၊ subscriptions တပ်ဆင်တာ၊ DOM nodes တွေကို ကိုင်တွယ်တာတွေ လုပ်လေ့ရှိပါတယ်။
- **`componentDidUpdate(prevProps, prevState)`** — props/state update ဖြစ်လို့ re-render ပြီးတာနဲ့ ချက်ချင်း React က ခေါ်ပါတယ် (initial render အတွက်တော့ မခေါ်ပါဘူး)။ Network requests လုပ်တာမျိုး ဒီနေရာမှာ လုပ်နိုင်ပေမယ့် — props/state တွေ တကယ်ပြောင်းမှသာ အလုပ်လုပ်အောင် `prevProps`/`prevState` နဲ့ နှိုင်းယှဉ်တဲ့ conditions တွေထဲမှာပဲ logic တွေထည့်ပါ — မဟုတ်ရင် infinite loops ဖြစ်နိုင်ပါတယ်။
- **`componentWillUnmount()`** — component ကို screen ကနေ *unmount* (ဖယ်) လုပ်ခင် React က ခေါ်ပါတယ်။ Data fetching cancel လုပ်တာ၊ subscriptions ဖယ်ရှားတာတွေ လုပ်လေ့ရှိပြီး — `componentDidMount` ရဲ့ logic ကို "ပြောင်းပြန် မှန်" (mirror) အောင် လုပ်ရပါတယ်။

ဒီ method သုံးခုကို ပုံမှန်အားဖြင့် အတူတကွ သုံးရပါတယ် — ဥပမာ chat connection တစ်ခုကို props/state တွေနဲ့ sync ဖြစ်အောင် ထားတဲ့ ဒီ `ChatRoom` ကို ကြည့်ပါ:

```js
class ChatRoom extends Component {
  state = { serverUrl: 'https://localhost:1234' };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(this.state.serverUrl, this.props.roomId);
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  // render() { ... }
}
```

**Caveats:** Strict Mode ဖွင့်ထားရင် development မှာ React က `componentDidMount` → `componentWillUnmount` → `componentDidMount` ဆိုပြီး ချက်ချင်း ပြန်ခေါ်ပါတယ် — `componentWillUnmount` မေ့ထားတာ ဒါမှမဟုတ် mirror မဖြစ်တာကို သတိထားမိစေဖို့ပါ။ `componentDidMount`/`componentDidUpdate` ထဲမှာ `setState` ချက်ချင်း ခေါ်လို့ရပေမယ့် ဖြစ်နိုင်ရင် ရှောင်ပါ (ပုံမှန်အားဖြင့် constructor ထဲမှာ initial state သတ်မှတ်သင့်ပြီး — modals/tooltips လို DOM node ကို တိုင်းပြီးမှ render လုပ်ရတဲ့ ကိစ္စမျိုးမှာသာ လိုအပ်တတ်ပါတယ်)။

Function components မှာ — `componentDidMount` + `componentDidUpdate` + `componentWillUnmount` သုံးခုပေါင်းတာက [`useEffect`](/docs/react/use-effect) ခေါ်တာနဲ့ ညီမျှပြီး — code က browser paint မတိုင်ခင် run ဖို့ အရေးကြီးတဲ့ ရှားပါးကိစ္စတွေမှာ [`useLayoutEffect`](/docs/react/use-layout-effect) က ပိုနီးစပ်ပါတယ်။

### Error Boundary methods — `static getDerivedStateFromError` နဲ့ `componentDidCatch`

- **`static getDerivedStateFromError(error)`** — child component တစ်ခုခု (ဝေးတဲ့ descendants တွေအပါအဝင်) rendering အတွင်း error throw လုပ်ရင် React က ခေါ်ပါတယ်။ UI တစ်ခုလုံး ရှင်းမသွားအောင် — error message ပြနိုင်ဖို့ state အသစ်ကို return လုပ်ရပါတယ်။ **Pure function** ဖြစ်ရပါမယ်။
- **`componentDidCatch(error, info)`** — error ဖြစ်တဲ့အခါ React က ခေါ်ပြီး — production မှာ error reporting service ဆီ log လုပ်ဖို့ သုံးပါတယ်။ `info.componentStack` မှာ error throw လုပ်တဲ့ component နဲ့ သူ့ရဲ့ parent components တွေရဲ့ stack trace ပါပါတယ်။

ဒီ method နှစ်ခုပါတဲ့ component ကို *Error Boundary* လို့ ခေါ်ပါတယ် (အောက်က Usage မှာ ဥပမာ ကြည့်ပါ)။ Function components တွေအတွက် ဒီနည်းနဲ့ ညီမျှတဲ့နည်း လောလောဆယ် မရှိသေးပါဘူး — class Error Boundary တစ်ခုတည်း ရေးပြီး app တစ်ခုလုံးမှာ ပြန်သုံးနိုင်ပါတယ် — ဒါမှမဟုတ် [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package ကို သုံးနိုင်ပါတယ်။

### တခြား methods — အတိုချုပ်

- **`forceUpdate(callback?)`** — component ကို re-render အောင် အတင်းလုပ်ဖို့ပါ — ပုံမှန်အားဖြင့် မလိုပါဘူး (`render` က `this.props`/`this.state`/`this.context` တွေကနေပဲ ဖတ်နေရင် `setState` နဲ့ auto re-render ဖြစ်ပါတယ်)။ External data source တစ်ခုကနေ `render` ထဲ တိုက်ရိုက်ဖတ်နေမှသာ လိုနိုင်ပြီး — function components တွေမှာ [`useSyncExternalStore`](/docs/react/use-sync-external-store) က ဒါကို အစားထိုးထားပါတယ်။ ဖြစ်နိုင်ရင် `forceUpdate` ကို ရှောင်ပါ။
- **`shouldComponentUpdate(nextProps, nextState)`** — re-render ကို ရှောင်လို့ရမရ React ကို မေးဖို့ပါ — `false` ပြန်ရင် update ကို skip ပါတယ်။ Performance optimization အတွက်သာ ဖြစ်ပြီး — [PureComponent](https://react.dev/reference/react/PureComponent) (props/state တွေကို shallow နှိုင်းယှဉ်ပေးတာ) က ကိုယ်တိုင်ရေးရတာထက် ပိုစိတ်ချရပါတယ်။ Deep equality checks/`JSON.stringify` သုံးတာကို အကြံမပြုပါဘူး။ Function components တွေမှာ [`memo`](/docs/react/memo) နဲ့ ဆင်တူပါတယ်။
- **`static getDerivedStateFromProps(props, state)`** — `render` မခေါ်ခင် (initial mount ရော updates တွေမှာပါ) ခေါ်ပြီး — state update ဖို့ object (သို့) `null` ပြန်ပေးရပါတယ်။ Props တွေ အချိန်ကြာလာတာနဲ့ ပြောင်းတာပေါ် state မူတည်တဲ့ ရှားပါးကိစ္စတွေအတွက်သာ ရည်ရွယ်ပါတယ် — [ဒီပုံစံကို မလိုအပ်ဘဲ မသုံးပါနဲ့](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)။ Function components မှာ rendering အတွင်း [`useState`](https://react.dev/reference/react/useState#storing-information-from-previous-renders) ရဲ့ set function ခေါ်တာနဲ့ ညီမျှပါတယ်။
- **`static defaultProps`** — class ရဲ့ default props တွေ သတ်မှတ်ဖို့ပါ — `undefined` ဖြစ်နေတဲ့ props တွေအတွက် သုံးပြီး `null` props တွေအတွက် မသုံးပါဘူး (ဥပမာ `static defaultProps = { color: 'blue' }`)။
- **`getSnapshotBeforeUpdate(prevProps, prevState)`** — React က DOM ကို update မလုပ်ခင် ချက်ချင်း ခေါ်ပြီး — DOM ကနေ အချက်အလက် (scroll position လိုမျိုး) ဖမ်းယူဖို့ သုံးပါတယ်။ ပြန်ပေးလိုက်တဲ့ value ကို `componentDidUpdate` ဆီ snapshot argument အဖြစ် ပို့ပေးပါတယ်။ Function components တွေအတွက် လောလောဆယ် ညီမျှမှု မရှိသေးပါဘူး။
- **`UNSAFE_componentWillMount` / `UNSAFE_componentWillReceiveProps` / `UNSAFE_componentWillUpdate`** — အရင်က `componentWillMount` စသဖြင့် ခေါ်ခဲ့တဲ့ methods တွေပါ — **deprecated** ဖြစ်ပြီး code အသစ်တွေမှာ မသုံးသင့်ပါဘူး။ `UNSAFE_` prefix နဲ့ နာမည်ပြောင်းထားပြီး — နောင်ထွက်မယ့် major version တွေမှာ နာမည်အသစ်ပဲ အလုပ်လုပ်မှာပါ ([`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) နဲ့ အလိုအလျောက် update လုပ်နိုင်ပါတယ်)။ Side effects တွေအတွက် `componentDidMount`/`componentDidUpdate` တို့ကို သုံးပါ — ဒီ methods တွေက [Suspense](/docs/react/suspense) လို ခေတ်မီ features တွေနဲ့ တွဲသုံးရင် mount/update ဖြစ်မယ်လို့ အာမခံချက် မရှိလို့ "unsafe" လို့ ခေါ်တာပါ။

## အသုံးပြုပုံ (Usage)

### Class component တစ်ခု သတ်မှတ်ခြင်း

React component တစ်ခုကို class အဖြစ် သတ်မှတ်ဖို့ — `Component` class ကို extend ပြီး `render` method သတ်မှတ်ပါ။ React က screen ပေါ်မှာ ဘာပြရမလဲ သိဖို့ လိုအပ်တိုင်း `render` ကို ခေါ်ပါတယ် — `render` က pure function ဖြစ်ရပြီး JSX ကိုပဲ တွက်ပေးရပါတယ်:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Function components တွေလိုပဲ — class component တစ်ခုက parent ကနေ props တွေ လက်ခံရရှိပါတယ် — ဒါပေမယ့် props ဖတ်တဲ့ syntax က မတူပါဘူး: `<Greeting name="Taylor" />` ဆိုရင် — `name` prop ကို `this.props.name` နဲ့ ဖတ်ရပါတယ်။

### Class component တစ်ခုကို state ထည့်ခြင်း

State ထည့်ဖို့ — `state` ဆိုတဲ့ property တစ်ခုကို object တစ်ခု သတ်မှတ်ပြီး — state update လုပ်ဖို့ `this.setState` ကို ခေါ်ပါတယ်:

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  handleAgeChange = () => {
    this.setState({ age: this.state.age + 1 });
  };

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <button onClick={this.handleAgeChange}>Increment age</button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

### Lifecycle methods တွေ ထည့်ခြင်း

`componentDidMount` သတ်မှတ်ထားရင် — component ကို screen ပေါ် ထည့်ပြီးချိန်မှာ React က ခေါ်ပါတယ်။ Props/state တွေ ပြောင်းလို့ re-render ပြီးတိုင်း `componentDidUpdate` ကို ခေါ်ပြီး — component ကို screen ကနေ ဖယ်ရှားပြီးချိန်မှာ `componentWillUnmount` ကို ခေါ်ပါတယ်။ `componentDidMount` ထည့်ထားရင် — ပုံမှန်အားဖြင့် method သုံးခုလုံး ထည့်ဖို့ လိုပါတယ် (bug တွေ ရှောင်ဖို့): `componentDidMount` က state/props တချို့ ဖတ်နေရင် — `componentDidUpdate` က သူတို့ ပြောင်းလဲမှုတွေကို ကိုင်တွယ်ပေးပြီး — `componentWillUnmount` က `componentDidMount` လုပ်ထားတာတွေကို ရှင်းလင်းပေးရပါတယ်။ (အထက်က `ChatRoom` ဥပမာကို ကြည့်ပါ။)

### Error Boundary တစ်ခုနဲ့ rendering errors တွေကို ဖမ်းခြင်း

Default အနေနဲ့ — သင့် app က rendering အတွင်း error throw လုပ်ရင် — React က UI ကို screen ကနေ ဖယ်ရှားပါတယ်။ ဒါကို ကာကွယ်ဖို့ — UI ရဲ့ အစိတ်အပိုင်းတစ်ခုကို *Error Boundary* ထဲမှာ ထုပ်နိုင်ပါတယ် — Error Boundary ဆိုတာ — ပျက်သွားတဲ့ အပိုင်းအစား fallback UI (error message လိုမျိုး) ပြနိုင်တဲ့ အထူး component တစ်ခုပါ:

```js
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

ပြီးရင် — သင့် component tree ရဲ့ အစိတ်အပိုင်းတစ်ခုကို ဒီလို ထုပ်နိုင်ပါတယ်:

```js
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

Error Boundaries တွေက ဒါတွေကို ဖမ်းမပေးပါဘူး — event handlers တွေ၊ [server side rendering](https://react.dev/reference/react-dom/server)၊ Error Boundary ကိုယ်တိုင် (သူ့ရဲ့ children မဟုတ်ဘဲ) throw လုပ်တဲ့ errors တွေ၊ နဲ့ async code (`setTimeout`/`requestAnimationFrame` callbacks လိုမျိုး) — ချွင်းချက်ကတော့ [`useTransition`](/docs/react/use-transition) Hook ကနေ ပြန်ရတဲ့ `startTransition` function ရဲ့ အတွင်းမှာ throw လုပ်တဲ့ errors တွေပါ။ Component တိုင်းကို Error Boundary သပ်သပ် ထုပ်နေစရာ မလိုပါဘူး — error message ပြဖို့ အဓိပ္ပာယ်ရှိတဲ့ နေရာတွေမှာပဲ ထားပါ။ (Error Boundary ကို function component အဖြစ် ရေးဖို့ နည်းလမ်း လောလောဆယ် မရှိသေးပါဘူး — [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package ကို သုံးနိုင်ပါတယ်။)

## နောက်ထပ် ရွေးစရာများ (Alternatives) — function components ဆီ ပြောင်းခြင်း

Class components တွေအစား — components တွေကို functions အဖြစ် သတ်မှတ်ဖို့ အကြံပြုပါတယ်။ ဘယ်လို migrate လုပ်မလဲ ဆိုတာ အတိုချုံး ဖော်ပြထားပါတယ်:

- **Simple component တစ်ခု:** `render` method ရဲ့ body ကို function တစ်ခုဆီ ရွှေ့ပြီး — `this.props.name` အစား destructuring နဲ့ `{ name }` လို ဖတ်ပါ:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

- **State ပါတဲ့ component:** `this.state`/`this.setState` အစား [`useState`](/docs/react/use-state) သုံးပါ — `this.` prefix တွေအားလုံးကို variables/functions တွေနဲ့ အစားထိုးပါ (`this.state.age` → `age`၊ `this.handleNameChange` → `handleNameChange`)။
- **Lifecycle methods ပါတဲ့ component:** `componentWillUnmount` က `componentDidMount` ရဲ့ ပြောင်းပြန် ဖြစ်နေကြောင်း၊ `componentDidUpdate` က သက်ဆိုင်ရာ props/state တွေ အကုန် ကိုင်တွယ်နေကြောင်း အရင်စစ်ပြီး — ပြီးရင် logic တစ်ခုလုံးကို [`useEffect`](/docs/react/use-effect) Effect တစ်ခုတည်းအဖြစ် ဖော်ပြပါ:

```js
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

- **Context သုံးတဲ့ component:** `static contextType` + `this.context` အစား [`useContext`](/docs/react/use-context) သုံးပါ။
