---
title: "Legacy React APIs"
description: "react package ကနေ export လုပ်ထားပေမယ့် — code အသစ်တွေမှာ သုံးဖို့ အကြံမပြုတဲ့ Legacy React APIs များ — Children, cloneElement, Component, createElement, createRef, forwardRef, isValidElement, PureComponent နဲ့ React 19 မှာ ဖယ်ရှားလိုက်တဲ့ APIs များ"
order: 107
source: "https://react.dev/reference/react/legacy"
status: translated
updated: 2026-09-02
---

ဒီ APIs တွေကို `react` package ကနေ export လုပ်ပေးထားပါတယ် — ဒါပေမယ့် — code အသစ်တွေမှာတော့ သုံးဖို့ အကြံမပြုပါဘူး။ အကြံပြုထားတဲ့ အစားထိုး ရွေးစရာတွေအတွက် — ချိတ်ပေးထားတဲ့ API page တစ်ခုချင်းစီကို ကြည့်ပါ။

## Legacy APIs (အမွေခံ APIs)

- [`Children`](https://react.dev/reference/react/Children) — `children` prop အဖြစ် လက်ခံရရှိတဲ့ JSX ကို ကိုင်တွယ်ခြင်း၊ ပြောင်းလဲခြင်း လုပ်နိုင်စေပါတယ်။ [အစားထိုး ရွေးစရာများ](https://react.dev/reference/react/Children#alternatives) ကို ကြည့်ပါ။
- [`cloneElement`](/docs/react/clone-element) — တခြား element တစ်ခုကို အခြေခံအဖြစ် သုံးပြီး React element တစ်ခု ဖန်တီးနိုင်စေပါတယ်။ [အစားထိုး ရွေးစရာများ](/docs/react/clone-element) ကို ကြည့်ပါ။
- [`Component`](/docs/react/component) — React component တစ်ခုကို JavaScript class အဖြစ် သတ်မှတ်နိုင်စေပါတယ်။ [အစားထိုး ရွေးစရာများ](/docs/react/component) ကို ကြည့်ပါ။
- [`createElement`](/docs/react/create-element) — React element တစ်ခု ဖန်တီးနိုင်စေပါတယ်။ ပုံမှန်အားဖြင့်တော့ — JSX ကို သုံးပါလိမ့်မယ်။
- [`createRef`](/docs/react/create-ref) — ဘယ် value မဆို ထည့်ထားနိုင်တဲ့ ref object တစ်ခု ဖန်တီးပေးပါတယ်။ [အစားထိုး ရွေးစရာများ](/docs/react/create-ref) ကို ကြည့်ပါ။
- [`forwardRef`](/docs/react/forward-ref) — component တစ်ခုက [ref](/docs/react/manipulating-the-dom-with-refs) တစ်ခုနဲ့အတူ DOM node တစ်ခုကို parent component ဆီ ထုတ်ဖော်ပြနိုင်စေပါတယ်။
- [`isValidElement`](/docs/react/is-valid-element) — value တစ်ခုက React element ဟုတ်မဟုတ် စစ်ဆေးပေးပါတယ်။ ပုံမှန်အားဖြင့် [`cloneElement`](/docs/react/clone-element) နဲ့ တွဲသုံးပါတယ်။
- [`PureComponent`](/docs/react/pure-component) — [`Component`](/docs/react/component) နဲ့ ဆင်တူပေမယ့် — props အတူတူဆိုရင် re-renders တွေကို ရှောင်ပေးပါတယ်။ [အစားထိုး ရွေးစရာများ](/docs/react/pure-component) ကို ကြည့်ပါ။

---

## Removed APIs (ဖယ်ရှားလိုက်သော APIs)

ဒီ APIs တွေကို React 19 မှာ ဖယ်ရှားလိုက်ပါပြီ:

- [`createFactory`](https://18.react.dev/reference/react/createFactory): JSX ကို သုံးပါ။
- Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): [`static contextType`](https://18.react.dev/reference/react/Component#static-contexttype) ကို သုံးပါ။
- Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): [`static contextType`](https://18.react.dev/reference/react/Component#static-contexttype) ကို သုံးပါ။
- Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): [Context](/docs/react/create-context) ကို သုံးပါ။
- Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): [TypeScript](https://www.typescriptlang.org/) လို type system တစ်ခုကို သုံးပါ။
- Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): [`createRef`](/docs/react/create-ref) ကို သုံးပါ။
