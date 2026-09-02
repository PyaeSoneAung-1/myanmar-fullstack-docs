---
title: "memo"
description: "Component ရဲ့ props တွေ မပြောင်းရင် re-render လုပ်တာကို ရှောင်နိုင်စေတဲ့ React API — component တစ်ခုရဲ့ memoized version အသစ်ကို ပြန်ပေး၊ optional arePropsEqual နဲ့ custom comparison လုပ်နိုင် — performance optimization အနေနဲ့ပဲ သုံးသင့်ခြင်း"
order: 69
source: "https://react.dev/reference/react/memo"
status: translated
updated: 2026-09-02
---

`memo` ဆိုတာ — component တစ်ခုရဲ့ props တွေ မပြောင်းလဲဘူးဆိုရင် — အဲဒီ component ကို re-render လုပ်တာကို ရှောင်နိုင်စေတဲ့ React API တစ်ခုပါ။

```js
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

> **မှတ်ချက်:** [React Compiler](https://react.dev/learn/react-compiler) က `memo` နဲ့ ညီမျှတဲ့ optimization ကို components အားလုံးအတွက် အလိုအလျောက် လုပ်ပေးတာမို့ — manual memoization တွေ လိုအပ်မှု လျော့ကျစေပါတယ်။ Component memoization ကို အလိုအလျောက် ကိုင်တွယ်ဖို့ compiler ကို သုံးနိုင်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `memo(Component, arePropsEqual?)`

Component တစ်ခုကို `memo` ထဲမှာ ထုပ်လိုက်ရင် — အဲဒီ component ရဲ့ *memoized* version တစ်ခုကို ရပါတယ်။ ဒီ memoized version က — parent component re-render ဖြစ်ပေမယ့် — props တွေ မပြောင်းသရွေ့ re-render မလုပ်တော့ပါဘူး။ ဒါပေမယ့် React က ရံဖန်ရံခါ re-render လုပ်နိုင်ပါသေးတယ် — memoization က performance optimization တစ်ခုပဲ ဖြစ်ပြီး — အာမခံချက် (guarantee) မဟုတ်ပါဘူး။

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

**Parameters (ပါရာမီတာများ)**

- `Component` — သင်က memoize လုပ်ချင်တဲ့ component။ `memo` က ဒီ component ကို ပြုပြင်မွမ်းမံတာ မဟုတ်ဘဲ — memoized component အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ Function components တွေရော [`forwardRef`](/docs/react/forward-ref) components တွေပါ — တရားဝင်တဲ့ React component တိုင်း လက်ခံပါတယ်။
- `arePropsEqual` (**optional**) — argument နှစ်ခု (component ရဲ့ ယခင် props နဲ့ props အသစ်) ကို လက်ခံတဲ့ function တစ်ခု။ Props အဟောင်းနဲ့ အသစ် ညီမျှရင် (props အသစ်နဲ့ ဆို component က output အတူတူပဲ ထွက်ပြီး ပုံစံအတူတူပဲ ပြုမူမယ်ဆိုရင်) `true` ပြန်ရပြီး — မဟုတ်ရင် `false` ပြန်ရပါတယ်။ ပုံမှန်အားဖြင့် ဒီ function ကို သတ်မှတ်စရာ မလိုပါဘူး — React က prop တစ်ခုချင်းစီကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်ပေးပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`memo` က React component အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ သူက `memo` ဆီ ပေးလိုက်တဲ့ component လိုပဲ ပြုမူပါတယ် — ကွာတာက — parent re-render ဖြစ်တဲ့အခါ — props တွေ မပြောင်းရင် React က ဒီ component ကို အမြဲ re-render လုပ်မှာ မဟုတ်တာပါ။

## အသုံးပြုပုံ (Usage)

### Props တွေ မပြောင်းရင် re-render လုပ်တာကို ရှောင်ခြင်း

ပုံမှန်အားဖြင့် — parent တစ်ခု re-render ဖြစ်တိုင်း React က သူ့ရဲ့ components တွေအားလုံးကို re-render လုပ်ပါတယ်။ `memo` နဲ့ဆို — props အသစ်တွေက props အဟောင်းတွေနဲ့ အတူတူဆိုရင် — parent re-render ဖြစ်ပေမယ့် re-render မလုပ်တဲ့ component တစ်ခုကို ဖန်တီးနိုင်ပါတယ် — ဒီလို component ကို *memoized* ဖြစ်တယ်လို့ ခေါ်ပါတယ်:

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});
```

ဥပမာ — `name` prop ပြောင်းတိုင်း `Greeting` က re-render ဖြစ်ပေမယ့် — `Greeting` ဆီ prop အဖြစ် မပို့တဲ့ `address` ပြောင်းရင်တော့ re-render မဖြစ်ပါဘူး။

React component တစ်ခုက [pure rendering logic](https://react.dev/learn/keeping-components-pure) ရှိရပါမယ် — props/state/context တွေ မပြောင်းရင် output အတူတူ ပြန်ပေးရမယ်လို့ ဆိုလိုပါတယ်။ `memo` သုံးခြင်းဖြင့် — သင့် component က ဒီလိုအပ်ချက်ကို လိုက်နာတယ်လို့ React ကို ပြောလိုက်တာဖြစ်လို့ — props တွေ မပြောင်းသရွေ့ re-render လုပ်စရာ မလိုတော့ပါဘူး။ **`memo` သုံးထားရင်တောင်** — component ရဲ့ ကိုယ်ပိုင် state ပြောင်းရင် ဒါမှမဟုတ် သူသုံးနေတဲ့ context တစ်ခုခု ပြောင်းရင် re-render ဖြစ်ပါသေးတယ် (memoization က parent ကနေ ပို့တဲ့ props တွေနဲ့ပဲ ဆိုင်လို့ပါ)။

> **မှတ်ချက်:** **`memo` ကို performance optimization တစ်ခုအနေနဲ့ပဲ မှီခိုသင့်ပါတယ်။** မပါဘဲ သင့် code အလုပ်မလုပ်ဘူးဆိုရင် — မူရင်းပြဿနာကို ရှာပြီး အရင်ဆုံး ပြုပြင်ပါ။ ပြီးမှ performance တိုးတက်စေဖို့ `memo` ကို ထပ်ထည့်နိုင်ပါတယ်။

**`memo` ကို နေရာတိုင်းမှာ ထည့်သင့်လား?** သင့် app က ဒီ site လိုမျိုး — interaction အများစုက coarse (page/section တစ်ခုလုံး အစားထိုးတာမျိုး) ဆိုရင် memoization က ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။ Drawing editor လိုမျိုး — interaction တွေ granular (shape တွေ ရွှေ့တာမျိုး) ဆိုရင်တော့ — memoization အရမ်း အသုံးဝင်နိုင်ပါတယ်။ `memo` က — component က props အတူတူနဲ့ မကြာခဏ re-render ဖြစ်နေပြီး re-render logic က စရိတ်ကြီးမှသာ တန်ဖိုးရှိပါတယ်။ **ပို့နေတဲ့ props တွေက *အမြဲ* ကွဲပြားနေရင်** (rendering အတွင်း သတ်မှတ်ထားတဲ့ object/function ပို့နေတာမျိုး) — `memo` က လုံးဝ အသုံးမကျပါဘူး — ဒါကြောင့် `memo` နဲ့ တွဲပြီး [`useMemo`](/docs/react/use-memo) နဲ့ [`useCallback`](/docs/react/use-callback) တွေ မကြာခဏ လိုအပ်တာပါ။

**လက်တွေ့မှာ — အောက်က principle အနည်းငယ်ကို လိုက်နာရင် — memoization အများကြီး မလိုအပ်တော့အောင် လုပ်နိုင်ပါတယ်:**

1. Component တစ်ခုက တခြား components တွေကို visually ထုပ်ပေးနေတယ်ဆိုရင် — [JSX တွေကို children အဖြစ် လက်ခံပါစေ](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) — wrapper က ကိုယ့် state ကို update လုပ်ရင် children တွေ re-render မလိုကြောင်း React က သိပါတယ်။
2. Local state ကို ဦးစားပေးသုံးပြီး — [state ကို လိုအပ်တာထက် ပိုမြှင့် (lift up)](https://react.dev/learn/sharing-state-between-components) မလုပ်ပါနဲ့ — forms နဲ့ hover state လို ခဏတပ်မျှ state တွေကို tree ထိပ်မှာ မသိမ်းပါနဲ့။
3. သင့် [rendering logic ကို pure ဖြစ်အောင် ထားပါ](https://react.dev/learn/keeping-components-pure) — re-render လုပ်တာ ပြဿနာတစ်ခုခု ဖြစ်စေနေရင် အဲဒါ bug တစ်ခုပါ — memoization မထည့်ဘဲ bug ကို ပြုပြင်ပါ။
4. [State တွေကို update လုပ်တဲ့ မလိုအပ်တဲ့ Effects တွေ](https://react.dev/learn/you-might-not-need-an-effect) ကို ရှောင်ပါ — React app တွေမှာ performance ပြဿနာ အများစုက Effects တွေကနေ စတင်တဲ့ update ကွင်းဆက်တွေကြောင့်ပါ။
5. သင့် [Effects တွေဆီက မလိုအပ်တဲ့ dependencies တွေကို ဖယ်ရှားဖို့ ကြိုးစားပါ](https://react.dev/learn/removing-effect-dependencies) — object/function တစ်ခုကို Effect ရဲ့ အတွင်း ဒါမှမဟုတ် component ရဲ့ အပြင်ဘက် ရွှေ့လိုက်တာ မကြာခဏ ပိုရိုးရှင်းပါတယ်။

Interaction တစ်ခုခု ကြန့်ကြာနေသေးရင် — [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) နဲ့ ဘယ် components တွေ memoization ကနေ အကျိုးအများဆုံး ရမလဲ ကြည့်ပြီး — လိုတဲ့နေရာမှာပဲ ထည့်ပါ။

### Props တွေပြောင်းတာကို နည်းနိုင်သမျှ နည်းအောင် လုပ်ခြင်း

`memo` သုံးထားရင် — prop တစ်ခုခုက ယခင် value နဲ့ *shallow မညီ* (reference မတူ) တာနဲ့ — component က re-render ဖြစ်ပါတယ် (`Object.is(3, 3)` က `true` ဖြစ်ပေမယ့် `Object.is({}, {})` က `false` ဆိုတာ သတိပြုပါ)။ `memo` ကနေ အကျိုးအများဆုံး ရဖို့ — props တွေ ပြောင်းတဲ့ အကြိမ်အရေအတွက်ကို နည်းအောင် လုပ်ပါ။ ဥပမာ — prop က object တစ်ခုဆိုရင် — parent က object အသစ် ထပ်ခါထပ်ခါ မဖန်တီးအောင် [`useMemo`](/docs/react/use-memo) သုံးပါ:

```js
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Props changes လျှော့ဖို့ ပိုကောင်းတဲ့ နည်းက — component က props ထဲမှာ လိုအပ်တဲ့ အနည်းဆုံး အချက်အလက်ကိုပဲ လက်ခံအောင် လုပ်တာပါ — object တစ်ခုလုံးအစား — တန်ဖိုးတစ်ခုချင်းစီ လက်ခံနိုင်ပါတယ်: `return <Profile name={name} age={age} />;`။ Memoized component ဆီ function တစ်ခု ပို့ဖို့လိုရင် — component အပြင်ဘက်မှာ ကြေညာထားပါ (ဒါဆို ဘယ်တော့မှ မပြောင်း) — ဒါမှမဟုတ် re-renders တွေကြားမှာ function definition ကို cache လုပ်ဖို့ [`useCallback`](/docs/react/use-callback) သုံးပါ။

### Custom comparison function တစ်ခု သတ်မှတ်ခြင်း

Memoized component တစ်ခုရဲ့ props changes တွေကို နည်းအောင် လုပ်ဖို့ မဖြစ်နိုင်တဲ့ ရှားပါးကိစ္စတွေမှာ — custom comparison function တစ်ခု ပေးနိုင်ပါတယ် — `memo` ရဲ့ ဒုတိယ argument အနေနဲ့ ပေးပြီး — React က shallow equality အစား ဒီ function ကို သုံးပါလိမ့်မယ်:

```js
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

> **သတိပြုရန် —** Custom `arePropsEqual` implementation ပေးရင် — function တွေ အပါအဝင် **prop တိုင်းကို နှိုင်းယှဉ်ရပါမယ်။** Functions တွေက parent components တွေရဲ့ props/state တွေကို [close over](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) လုပ်လေ့ရှိလို့ — `oldProps.onClick !== newProps.onClick` ဖြစ်နေတာကို `true` ပြန်လိုက်ရင် — သင့် component က ယခင် render က props/state တွေကို handler ထဲမှာ ဆက်မြင်နေပြီး — အရမ်းရှုပ်ထွေးတဲ့ bugs တွေ ဖြစ်စေပါတယ်။ `arePropsEqual` ထဲမှာ deep equality checks တွေကိုလည်း ရှောင်ပါ — **deep equality checks တွေက အလွန် နှေးနိုင်ပြီး** — data structure ကို နောက်ပိုင်း တစ်ယောက်ယောက် ပြောင်းလိုက်ရင် app က စက္ကန့်ပေါင်းများစွာ freeze ဖြစ်နိုင်ပါတယ်။ ဒီလိုလုပ်ရင် — browser developer tools ရဲ့ Performance panel နဲ့ သင့် comparison function က component re-render လုပ်တာထက် တကယ် ပိုမြန်လားဆိုတာ စစ်ဆေးပါ (React ကို production mode နဲ့ run ပြီး တိုင်းတာပါ)။

### React Compiler သုံးနေရင် `React.memo` လိုသေးလား

[React Compiler](https://react.dev/learn/react-compiler) ဖွင့်ထားရင် — `React.memo` ကို ပုံမှန်အားဖြင့် ထပ်မလိုတော့ပါဘူး — compiler က component re-rendering တွေကို အလိုအလျောက် optimize လုပ်ပေးလို့ပါ။ Compiler က — component ဆီ ပို့တဲ့ props တွေ မပြောင်းကြောင်း ခြေရာခံပြီး — အရင် ဖန်တီးထားတဲ့ JSX ကို ပြန်သုံးကာ — child ရဲ့ re-render ကို လုံးဝ ရှောင်ပေးပါတယ် — ဒါက `React.memo` လုပ်ပေးတာနဲ့ အတိအကျ တူညီပါတယ်။ ဒါကြောင့် React Compiler သုံးနေရင် `React.memo` တွေကို ဖယ်ရှားလိုက်လို့ ရပါတယ်။ Compiler ရဲ့ optimization က `React.memo` ထက်တောင် ပိုကျယ်ပြန့်ပါတယ် — component tree တစ်ခုလုံးမှာ `React.memo` နဲ့ `useMemo` ပေါင်းထားသလို — intermediate values နဲ့ စရိတ်ကြီးတဲ့ computations တွေကိုပါ memoize လုပ်ပေးလို့ပါ။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Prop က object, array, ဒါမှမဟုတ် function ဖြစ်နေလို့ component က re-render ဖြစ်နေတယ်

React က props အဟောင်းနဲ့ အသစ်ကို shallow equality နဲ့ နှိုင်းယှဉ်ပါတယ် — prop အသစ်တိုင်းက ယခင် prop နဲ့ reference အတူတူလားဆိုတာ ကြည့်တာပါ။ Parent re-render ဖြစ်တိုင်း object/array အသစ်တစ်ခု ဖန်တီးနေရင် — အတွင်းက element တွေ တစ်ခုချင်းစီ အတူတူပဲ ဖြစ်နေရင်တောင် — React က prop ပြောင်းသွားတယ်လို့ သတ်မှတ်ပါတယ်။ Rendering အတွင်းမှာ function အသစ် ဖန်တီးနေရင်လည်း — definition အတူတူပဲ ဖြစ်နေရင် — React က ပြောင်းသွားတယ်လို့ သတ်မှတ်ပါတယ်။ ဒါကို ရှောင်ဖို့ — parent မှာ props တွေကို ရိုးရှင်းအောင် လုပ်ပါ ဒါမှမဟုတ် props တွေကို memoize လုပ်ပါ (အထက်က "Props တွေပြောင်းတာကို နည်းနိုင်သမျှ နည်းအောင် လုပ်ခြင်း" section ကို ကြည့်ပါ)။
