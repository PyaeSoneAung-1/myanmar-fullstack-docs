---
title: "React Compiler (React app ကို အလိုအလျောက် optimize လုပ်ပေးတဲ့ build-time tool)"
description: "React Compiler မိတ်ဆက် — ဘာတွေ လုပ်ပေးလဲ၊ manual memoization မလိုဘဲ re-renders နဲ့ တွက်ချက်မှုများကို အလိုအလျောက် optimize လုပ်ခြင်း၊ build tools များနဲ့ လိုက်ဖက်မှု၊ useMemo/useCallback နဲ့ ဆက်ဆံပုံ"
order: 120
source: "https://react.dev/learn/react-compiler"
status: translated
updated: 2026-09-02
---

React Compiler က သင့် React app ကို အလိုအလျောက် optimize လုပ်ပေးတဲ့ build-time tool အသစ်တစ်ခုပါ။ သူက plain JavaScript နဲ့ အလုပ်လုပ်ပြီး — [Rules of React](https://react.dev/reference/rules) တွေကို နားလည်ပါတယ် — ဒါကြောင့် သုံးဖို့အတွက် code တစ်ကြောင်းမှ ပြန်ရေးစရာ မလိုပါဘူး။

ဒီ page မှာ အောက်ပါတွေကို လေ့လာရပါမယ်:

- React Compiler က ဘာတွေ လုပ်ပေးလဲ
- Compiler နဲ့ စတင်ခြင်း
- တဖြည်းဖြည်း စတင်အသုံးပြုခြင်း (incremental adoption) နည်းလမ်းများ
- အမှားတွေ ဖြစ်တဲ့အခါ debugging နဲ့ troubleshooting
- သင့် React library ပေါ်မှာ compiler သုံးခြင်း

## React Compiler က ဘာတွေ လုပ်ပေးလဲ?

React Compiler က သင့် React application ကို build time မှာ အလိုအလျောက် optimize လုပ်ပေးပါတယ်။ React က optimization မပါဘဲလည်း မကြာခဏ လုံလောက်အောင် မြန်ပါတယ် — ဒါပေမယ့် တစ်ခါတလေ သင့် app ကို responsive ဖြစ်စေဖို့ components နဲ့ values တွေကို ကိုယ်တိုင် memoize လုပ်ဖို့ လိုပါတယ်။ ဒီ manual memoization က ငြီးငွေ့စရာ ကောင်းပြီး — မှားလွယ်ကာ — ထိန်းသိမ်းစရာ code တွေ ပိုထည့်ပေးပါတယ်။ React Compiler က ဒီ optimization ကို သင့်အတွက် အလိုအလျောက် လုပ်ပေးလို့ — ဒီစိတ်ပင်ပန်းမှုကနေ လွတ်မြောက်ပြီး feature တွေ တည်ဆောက်တာကိုပဲ အာရုံစိုက်နိုင်ပါတယ်။

### React Compiler မတိုင်ခင် (Before React Compiler)

Compiler မရှိဘဲ — re-renders တွေကို optimize လုပ်ဖို့ components နဲ့ values တွေကို ကိုယ်တိုင် memoize လုပ်ရပါတယ်:

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

> **မှတ်ချက်** — ဒီ manual memoization မှာ memoization ကို ချိုးဖျက်ပစ်တဲ့ သိမ်မွေ့တဲ့ bug တစ်ခု ရှိပါတယ်:
>
> ```js
> <Item key={item.id} onClick={() => handleClick(item)} />
> ```
>
> `handleClick` ကို `useCallback` ထဲမှာ ထုပ်ထားပေမယ့် — arrow function `() => handleClick(item)` က component render တိုင်း function အသစ်တစ်ခု ဖန်တီးပေးပါတယ်။ ဒါက `Item` က `onClick` prop အသစ်တစ်ခုကို အမြဲ လက်ခံရရှိစေလို့ — memoization ကို ချိုးဖျက်ပါတယ်။
>
> React Compiler က ဒါကို arrow function ပါပါစေ၊ မပါပါစေ — မှန်ကန်စွာ optimize လုပ်နိုင်ပြီး — `props.onClick` ပြောင်းမှသာ `Item` က re-render ဖြစ်ကြောင်း သေချာစေပါတယ်။

### React Compiler ပြီးနောက် (After React Compiler)

React Compiler နဲ့ဆိုရင် — manual memoization မပါဘဲ အတူတူ code ကို ရေးနိုင်ပါတယ်:

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[ဒီဥပမာကို React Compiler Playground မှာ ကြည့်ပါ](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

React Compiler က အကောင်းဆုံး memoization ကို အလိုအလျောက် သက်ရောက်စေပြီး — သင့် app က လိုအပ်မှသာ re-render ဖြစ်ကြောင်း သေချာစေပါတယ်။

#### React Compiler က ဘယ်လို memoization မျိုး ထည့်ပေးလဲ?

React Compiler ရဲ့ automatic memoization က အဓိကအားဖြင့် **update performance ကို မြှင့်တင်ခြင်း** (ရှိပြီးသား components တွေကို re-render လုပ်ခြင်း) ကို ဦးတည်ထားလို့ — အောက်ပါ use cases နှစ်ခုကို အာရုံစိုက်ပါတယ်:

1. **Components တွေရဲ့ ကွင်းဆက် re-rendering ကို ကျော်လွှားခြင်း**
   - `<Parent />` ကို re-render လုပ်တာက သူ့ရဲ့ component tree ထဲက components အများကြီးကို re-render ဖြစ်စေပါတယ် — `<Parent />` ပဲ ပြောင်းသွားတာတောင် ဖြစ်ပါတယ်။
2. **React ရဲ့ အပြင်ဘက်က စျေးကြီးတဲ့ တွက်ချက်မှုတွေကို ကျော်လွှားခြင်း**
   - ဥပမာ — ဒီ data လိုအပ်တဲ့ သင့် component ဒါမှမဟုတ် hook ထဲမှာ `expensivelyProcessAReallyLargeArrayOfObjects()` ကို ခေါ်တာမျိုး။

#### Re-renders တွေကို optimize လုပ်ခြင်း

React က သင့် UI ကို သူတို့ရဲ့ လက်ရှိ state (ပိုတိကျပြောရရင် — props, state နဲ့ context) ရဲ့ function တစ်ခုအဖြစ် ဖော်ပြနိုင်စေပါတယ်။ လက်ရှိ implementation မှာ — component တစ်ခုရဲ့ state ပြောင်းတဲ့အခါ — React က အဲဒီ component ကို re-render လုပ်ပြီး — `useMemo()`, `useCallback()` ဒါမှမဟုတ် `React.memo()` တွေနဲ့ manual memoization တစ်ခုခု သက်ရောက်ထားမှသာလျှင် ရှောင်နိုင်တဲ့ — _သူ့ရဲ့ children တွေ အားလုံးကိုပါ_ re-render လုပ်ပါတယ်။ ဥပမာ — အောက်က ဥပမာမှာ `<MessageButton>` က `<FriendList>` ရဲ့ state ပြောင်းတိုင်း re-render ဖြစ်ပါလိမ့်မယ်:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```

[_ဒီဥပမာကို React Compiler Playground မှာ ကြည့်ပါ_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler က manual memoization နဲ့ ညီမျှတာကို အလိုအလျောက် သက်ရောက်စေပြီး — state ပြောင်းတဲ့အခါ app ရဲ့ သက်ဆိုင်ရာ အစိတ်အပိုင်းတွေပဲ re-render ဖြစ်ကြောင်း သေချာစေပါတယ် — ဒါကို တစ်ခါတစ်ရံ "fine-grained reactivity" လို့ ခေါ်ပါတယ်။ အပေါ်က ဥပမာမှာ — React Compiler က `<FriendListCard />` ရဲ့ return value ကို `friends` ပြောင်းတဲ့အခါမှာတောင် ပြန်သုံးလို့ရကြောင်း ဆုံးဖြတ်ပြီး — ဒီ JSX ကို ပြန်ဖန်တီးတာကို ရှောင်နိုင်ကာ — count ပြောင်းတဲ့အခါ `<MessageButton>` ကို re-render မလုပ်တော့ပါဘူး။

#### စျေးကြီးတဲ့ တွက်ချက်မှုတွေကိုလည်း memoize လုပ်ပေးပါတယ်

React Compiler က rendering အတွင်း သုံးတဲ့ စျေးကြီးတဲ့ တွက်ချက်မှုတွေကိုလည်း အလိုအလျောက် memoize လုပ်နိုင်ပါတယ်:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

[_ဒီဥပမာကို React Compiler Playground မှာ ကြည့်ပါ_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

ဒါပေမယ့် — `expensivelyProcessAReallyLargeArrayOfObjects` က တကယ်ပဲ စျေးကြီးတဲ့ function တစ်ခုဆိုရင် — React ရဲ့ အပြင်ဘက်မှာ သူ့ကိုယ်ပိုင် memoization အကောင်အထည်ဖော်ဖို့ စဉ်းစားချင်နိုင်ပါတယ် — ဘာလို့လဲဆိုတော့:

- React Compiler က React components နဲ့ hooks တွေကိုပဲ memoize လုပ်တာ ဖြစ်ပြီး — function တိုင်းကို မဟုတ်ပါဘူး
- React Compiler ရဲ့ memoization က components ဒါမှမဟုတ် hooks အများကြီးကြားမှာ မျှဝေမထားပါဘူး

ဒါကြောင့် — `expensivelyProcessAReallyLargeArrayOfObjects` ကို component အများကြီးထဲမှာ သုံးထားရင် — အတိအကျတူတဲ့ items တွေကို အောက်ကို ပို့ထားရင်တောင် — ဒီစျေးကြီးတဲ့ တွက်ချက်မှုက ထပ်ခါထပ်ခါ run ဖြစ်နေပါလိမ့်မယ်။ Code ကို ပိုရှုပ်ထွေးအောင် မလုပ်ခင် — တကယ် စျေးကြီးလားဆိုတာ သိဖို့ [အရင်ဆုံး profiling](/docs/react/use-memo) လုပ်ကြည့်ဖို့ အကြံပြုပါတယ်။

## Compiler ကို စမ်းသုံးကြည့်သင့်လား?

အားလုံးကို React Compiler စတင် သုံးဖို့ အားပေးပါတယ်။ Compiler က ဒီနေ့ React အတွက် optional ဖြည့်စွက်ချက်တစ်ခု ဖြစ်နေသေးပေမယ့် — အနာဂတ်မှာ feature တစ်ချို့က အပြည့်အဝ အလုပ်လုပ်ဖို့ compiler လိုအပ်လာနိုင်ပါတယ်။

### သုံးရတာ အန္တရာယ် ကင်းလား?

React Compiler က အခုဆိုရင် stable ဖြစ်ပြီး — production မှာ အကျယ်တဝင့် စမ်းသပ်ပြီးပါပြီ။ Meta လို ကုမ္ပဏီတွေမှာ production မှာ သုံးနေပေမယ့် — သင့် app အတွက် compiler ကို production ဆီ ဖြန့်ချီတာက — သင့် codebase ရဲ့ ကျန်းမာရေးနဲ့ သင်က [Rules of React](https://react.dev/reference/rules) တွေကို ဘယ်လောက် ကောင်းကောင်း လိုက်နာထားလဲအပေါ် မူတည်ပါတယ်။

## ဘယ် build tools တွေကို ပံ့ပိုးလဲ?

React Compiler ကို [build tools အများအပြား](/docs/react/react-compiler-installation) ပေါ်မှာ install လုပ်နိုင်ပါတယ် — ဥပမာ Babel, Vite, Metro, Rsbuild တို့ပါ။

React Compiler က အဓိကအားဖြင့် — core compiler ပတ်လည်က light Babel plugin wrapper တစ်ခုပါ — Babel ကိုယ်တိုင်နဲ့ ခွဲထုတ်ဖို့ ဒီဇိုင်းထုတ်ထားတာပါ။ Compiler ရဲ့ ကနဦး stable version က အဓိက Babel plugin အဖြစ် ဆက်ရှိနေဦးမယ့်ပေမယ့် — အနာဂတ်မှာ သင့် build pipelines တွေထဲကို Babel ပြန်ထည့်စရာ မလိုအောင် — swc နဲ့ [oxc](https://github.com/oxc-project/oxc/issues/10048) teams တွေနဲ့ အတူ React Compiler အတွက် first class support တည်ဆောက်နေပါတယ်။

Next.js users တွေက [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) နဲ့ အထက်ကို သုံးပြီး swc-invoked React Compiler ကို enable လုပ်နိုင်ပါတယ်။

## useMemo, useCallback နဲ့ React.memo တွေကို ဘာလုပ်ရမလဲ?

Default အနေနဲ့ — React Compiler က သူ့ရဲ့ analysis နဲ့ heuristics တွေကို အခြေခံပြီး သင့် code ကို memoize လုပ်ပါလိမ့်မယ်။ အခြေအနေ အများစုမှာ — ဒီ memoization က သင်ကိုယ်တိုင် ရေးထားတာလောက် တိကျပြီး — တစ်ခါတစ်ရံ ပိုတောင် တိကျပါတယ်။

ဒါပေမယ့် — developer တစ်ချို့က memoization ပေါ်မှာ ပိုပြီး ထိန်းချုပ်မှု လိုအပ်တဲ့ အခြေအနေတွေ ရှိပါတယ်။ `useMemo` နဲ့ `useCallback` hooks တွေကို React Compiler နဲ့အတူ — ဘယ် values တွေကို memoize လုပ်မလဲ ထိန်းချုပ်ဖို့ escape hatch အဖြစ် ဆက်သုံးနိုင်ပါတယ်။ သာမန် use case တစ်ခုက — memoized value တစ်ခုကို effect dependency အဖြစ် သုံးတဲ့အခါမျိုးပါ — dependencies တွေ သိသိသာသာ မပြောင်းဘဲနဲ့ effect က ထပ်ခါထပ်ခါ မဖြစ်အောင် သေချာစေဖို့ပါ။

Code အသစ်တွေအတွက် — memoization ကို compiler ပေါ်မှာ အားကိုးပြီး — တိကျတဲ့ ထိန်းချုပ်မှု လိုအပ်တဲ့နေရာမှာပဲ `useMemo`/`useCallback` တွေကို သုံးဖို့ အကြံပြုပါတယ်။

ရှိပြီးသား code တွေအတွက်တော့ — ရှိပြီးသား memoization ကို သူ့နေရာမှာ ထားဖို့ (ဖယ်လိုက်ရင် compilation output ပြောင်းသွားနိုင်လို့) ဒါမှမဟုတ် — memoization မဖယ်ခင် သေချာ စမ်းသပ်ဖို့ အကြံပြုပါတယ်။

## React Compiler စမ်းသုံးကြည့်ခြင်း

ဒီ section က React Compiler နဲ့ စတင်ဖို့နဲ့ — သင့် projects တွေထဲမှာ ထိရောက်စွာ သုံးနည်းကို နားလည်ဖို့ ကူညီပေးပါလိမ့်မယ်။

- **[Installation](/docs/react/react-compiler-installation)** — React Compiler ကို install လုပ်ပြီး သင့် build tools တွေအတွက် configure လုပ်ခြင်း
- **[React Version Compatibility](https://react.dev/reference/react-compiler/target)** — React 17, 18 နဲ့ 19 တွေအတွက် support
- **[Configuration](https://react.dev/reference/react-compiler/configuration)** — သင့် လိုအပ်ချက်တွေအတွက် compiler ကို customize လုပ်ခြင်း
- **[Incremental Adoption](/docs/react/react-compiler-incremental-adoption)** — ရှိပြီးသား codebases တွေထဲမှာ compiler ကို တဖြည်းဖြည်း ဖြန့်ချီတဲ့ နည်းလမ်းများ
- **[Debugging and Troubleshooting](/docs/react/react-compiler-debugging)** — Compiler သုံးတဲ့အခါ ပြဿနာတွေကို ရှာဖွေ ဖြေရှင်းခြင်း
- **[Compiling Libraries](https://react.dev/reference/react-compiler/compiling-libraries)** — Compiled code ပို့ချခြင်းအတွက် အကောင်းဆုံး လုပ်ထုံးလုပ်နည်းများ
- **[API Reference](https://react.dev/reference/react-compiler/configuration)** — Configuration options တွေ အားလုံးရဲ့ အသေးစိတ် documentation

## ထပ်ဆောင်း resource များ

ဒီ docs တွေအပြင် — compiler အကြောင်း ထပ်ဆောင်း အချက်အလက်နဲ့ ဆွေးနွေးမှုတွေအတွက် [React Compiler Working Group](https://github.com/reactwg/react-compiler) ကို ကြည့်ဖို့ အကြံပြုပါတယ်။
