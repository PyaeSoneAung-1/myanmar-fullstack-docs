---
title: "useInsertionEffect"
description: "CSS-in-JS library တွေအတွက် — layout Effects တွေ မစတင်ခင် DOM ထဲကို `<style>` tags တွေ ထည့်သွင်းနိုင်တဲ့ React Hook (CSS-in-JS library ရေးသူတွေ မဟုတ်ရင် useEffect / useLayoutEffect ကို သုံးပါ)"
order: 65
source: "https://react.dev/reference/react/useInsertionEffect"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန် —** `useInsertionEffect` က CSS-in-JS library တွေ ရေးသားသူတွေအတွက် ရည်ရွယ်ထားတာပါ။ သင်က CSS-in-JS library တစ်ခုပေါ်မှာ အလုပ်လုပ်နေပြီး styles တွေ ထိုးသွင်းဖို့ နေရာတစ်ခု လိုနေတာ မဟုတ်ဘူးဆိုရင် — [`useEffect`](/docs/react/use-effect) ဒါမှမဟုတ် [`useLayoutEffect`](/docs/react/use-layout-effect) ကို သုံးသင့်ပါတယ်။

`useInsertionEffect` ဆိုတာ — layout Effects တွေ fire မဖြစ်ခင် DOM ထဲကို elements တွေ ထည့်သွင်းနိုင်စေတဲ့ React Hook တစ်ခုပါ။

```js
useInsertionEffect(setup, dependencies?)
```

## ရည်ညွှန်းချက် (Reference)

### `useInsertionEffect(setup, dependencies?)`

Layout ကို ဖတ်ဖို့ လိုအပ်တဲ့ Effects တွေ မစတင်ခင် styles တွေ ထည့်သွင်းနိုင်ဖို့ — သင့် CSS-in-JS library ထဲမှာ `useInsertionEffect` ကို ခေါ်ပါတယ်:

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
  });
  return rule;
}
```

**Parameters (ပါရာမီတာများ)**

- `setup` — သင့် Effect ရဲ့ logic ပါတဲ့ function။ *cleanup* function တစ်ခုကိုလည်း ပြန်ပေးနိုင်ပါတယ်။ သင့် component က DOM ထဲ ထည့်ပြီးပေမယ့် layout Effects တွေ မစတင်ခင် React က `setup` ကို run ပါတယ်။ Dependencies ပြောင်းတဲ့ re-render တိုင်းမှာ React က cleanup function (ပေးထားရင်) ကို value အဟောင်းတွေနဲ့ အရင် run ပြီး — `setup` ကို value အသစ်တွေနဲ့ ပြန် run ပါတယ်။ Component ကို DOM ကနေ ဖယ်ရှားတဲ့အခါ — React က cleanup function ကို run ပါတယ်။
- `dependencies` (**optional**) — `setup` code အတွင်းမှာ ကိုးကားထားတဲ့ reactive values တွေရဲ့ စာရင်း။ Reactive values တွေထဲမှာ props၊ state နဲ့ component body ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables/functions တွေ ပါဝင်ပါတယ်။ Dependency list က item အရေအတွက် မပြောင်းလဲဘဲ `[dep1, dep2, dep3]` လို inline ရေးရပြီး — React က dependency တစ်ခုချင်းစီကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်ပါတယ်။ Dependencies လုံးဝ မပေးရင် — Effect က component ရဲ့ re-render တိုင်း ပြန် run ပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`useInsertionEffect` က `undefined` ကို ပြန်ပေးပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- Effects တွေက client ပေါ်မှာပဲ run ပါတယ် — server rendering အတွင်းမှာ run မှာ မဟုတ်ပါဘူး။
- `useInsertionEffect` ရဲ့ အတွင်းကနေ state update လုပ်လို့ မရပါဘူး။
- `useInsertionEffect` run ချိန်မှာ refs တွေ မချိတ်ရသေးပါဘူး။
- `useInsertionEffect` က DOM update မတိုင်ခင် ဒါမှမဟုတ် ပြီးမှ run နိုင်ပါတယ် — DOM က ဘယ်အချိန်မှာ update ဖြစ်မယ်ဆိုတာကို အားမကိုးရပါဘူး။
- တခြား Effects တွေနဲ့ မတူဘဲ (အဲဒါတွေက Effect အားလုံးရဲ့ cleanup တွေ ပြီးမှ setup တွေ run ပါတယ်) — `useInsertionEffect` က cleanup ရော setup ပါ component တစ်ခုချင်းစီအလိုက် run လို့ — cleanup/setup functions တွေ interleave (ကြားဖောက်ကြားဖောက်) ဖြစ်သွားပါတယ်။

## အသုံးပြုပုံ (Usage)

### CSS-in-JS libraries တွေကနေ dynamic styles တွေ ထိုးသွင်းခြင်း (Injecting dynamic styles from CSS-in-JS libraries)

အစဉ်အလာအရ — React components တွေကို plain CSS နဲ့ပဲ style လုပ်လေ့ရှိပါတယ်:

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

အသင်းတချို့က CSS files တွေ ရေးမယ့်အစား — styles တွေကို JavaScript code ထဲမှာတိုက်ရိုက် ရေးချင်ကြပါတယ်။ ဒါက ပုံမှန်အားဖြင့် CSS-in-JS library (သို့) tool တစ်ခု လိုအပ်ပြီး — ချဉ်းကပ်နည်း သုံးမျိုး ရှိပါတယ်:

1. Compiler တစ်ခုနဲ့ static styles တွေကို CSS files အဖြစ် ထုတ်ယူခြင်း
2. Inline styles — ဥပမာ `<div style={{ opacity: 1 }}>`
3. `<style>` tags တွေကို runtime မှာ ထိုးသွင်းခြင်း

CSS-in-JS သုံးမယ်ဆိုရင် — ပထမနည်းနှစ်ခုရဲ့ ပေါင်းစပ်မှုကို အကြံပြုပါတယ် (static styles တွေအတွက် CSS files၊ dynamic styles တွေအတွက် inline styles)။ **Runtime `<style>` tag ထိုးသွင်းတာကိုတော့ အကြောင်းပြချက် နှစ်ခုနဲ့ အကြံမပြုပါဘူး:**

1. Runtime injection က browser ကို styles တွေ ထပ်ခါထပ်ခါ recalculate လုပ်စေပါတယ်။
2. React lifecycle ရဲ့ မှားယွင်းတဲ့ အချိန်မှာ ဖြစ်ရင် runtime injection က အရမ်းနှေးနိုင်ပါတယ်။

ပထမပြဿနာကတော့ မဖြေရှင်းနိုင်ပေမယ့် — ဒုတိယပြဿနာကို `useInsertionEffect` က ဖြေရှင်းပေးပါတယ်။

Layout Effects တွေ မစတင်ခင် styles တွေ ထည့်သွင်းဖို့ `useInsertionEffect` ကို ခေါ်ပါ:

```js
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // But if you have to do it, then it's important to do in useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

`useEffect` လိုပဲ — `useInsertionEffect` က server ပေါ်မှာ run မှာ မဟုတ်ပါဘူး။ Server ပေါ်မှာ ဘယ် CSS rules တွေ သုံးခဲ့လဲ စုဆောင်းချင်ရင် — rendering အတွင်းမှာ လုပ်နိုင်ပါတယ်:

```js
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

Runtime injection သုံးတဲ့ CSS-in-JS libraries တွေကို `useInsertionEffect` ဆီ [ဘယ်လို upgrade လုပ်မလဲ ဒီမှာ ဖတ်ပါ](https://github.com/reactwg/react-18/discussions/110)။

**Rendering အတွင်း သို့မဟုတ် `useLayoutEffect` ထဲမှာ styles တွေ ထိုးသွင်းတာထက် ဒါက ဘာကြောင့် ပိုကောင်းလဲ?**

Rendering အတွင်းမှာ styles တွေ ထည့်သွင်းပြီး React က [non-blocking update](https://react.dev/reference/react/useTransition) တစ်ခုကို လုပ်ဆောင်နေရင် — browser က component tree တစ်ခုလုံး render လုပ်နေစဉ် frame တိုင်းမှာ styles တွေကို recalculate လုပ်ရတာမို့ **အလွန် နှေးကွေးနိုင်ပါတယ်။**

`useInsertionEffect` က [`useLayoutEffect`](/docs/react/use-layout-effect) သို့မဟုတ် [`useEffect`](/docs/react/use-effect) အတွင်း styles တွေ ထိုးသွင်းတာထက် ပိုကောင်းတာက — သင့် components တွေထဲက တခြား Effects တွေ run ချိန်မှာ `<style>` tags တွေ ထည့်ပြီးသား ဖြစ်နေတာ သေချာစေလို့ပါ။ ဒါမှ မဟုတ်ရင် — styles တွေ ခေတ်နောက်ကျနေလို့ ပုံမှန် Effects တွေထဲက layout calculations တွေ မှားယွင်းနိုင်ပါတယ်။
