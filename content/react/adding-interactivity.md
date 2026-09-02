---
title: "Interactivity ထည့်သွင်းခြင်း (Adding Interactivity)"
description: "User input တွေကို တုံ့ပြန်တဲ့ component တွေ ဘယ်လို ရေးမလဲ — event handler ထည့်ခြင်း၊ state နဲ့ component memory၊ render/commit အဆင့်နှစ်ဆင့်၊ state snapshot၊ state updates တွေ queue တင်ခြင်း၊ object နဲ့ array ကို state ထဲ update လုပ်ခြင်း"
order: 28
source: "https://react.dev/learn/adding-interactivity"
status: translated
updated: 2026-09-01
---

Screen ပေါ်က အရာတချို့က user input တွေကို တုံ့ပြန်ပြီး update ဖြစ်ပါတယ်။ ဥပမာ — image gallery တစ်ခုကို နှိပ်လိုက်ရင် active image က ပြောင်းသွားပါတယ်။ React မှာ — အချိန်နဲ့အမျှ ပြောင်းလဲတဲ့ data ကို *state* လို့ ခေါ်ပါတယ်။ Component ဘယ်မှာမဆို state ထည့်လို့ရပြီး — လိုအပ်သလို update လုပ်နိုင်ပါတယ်။ ဒီ chapter မှာ — interaction တွေကို ကိုင်တွယ်တဲ့၊ state ကို update လုပ်တဲ့၊ အချိန်နဲ့အမျှ output အမျိုးမျိုး ပြတဲ့ component တွေ ရေးနည်းကို သင်ယူရမှာ ဖြစ်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- [Event များနဲ့ အပြန်အလှန်](/docs/react/events) — user-initiated events တွေကို ဘယ်လို ကိုင်တွယ်မလဲ
- [State — Component တစ်ခုရဲ့ Memory](/docs/react/state-a-components-memory) — state နဲ့ component တွေက အချက်အလက်တွေကို ဘယ်လို "မှတ်မိ" စေမလဲ
- [Render လုပ်ခြင်းနဲ့ Commit လုပ်ခြင်း](/docs/react/render-and-commit) — React က UI ကို အဆင့်နှစ်ဆင့်နဲ့ ဘယ်လို update လုပ်လဲ
- [State နဲ့ Rendering](/docs/react/state-snapshot) — state က ပြောင်းပြီးချင်း ဘာကြောင့် ချက်ချင်း update မဖြစ်တာလဲ
- [State Update တစ်တန်းကို Queue တင်ခြင်း](/docs/react/queueing-a-series-of-state-updates) — state updates အများအပြားကို ဘယ်လို queue တင်မလဲ
- [State ထဲက Object တွေကို Update လုပ်ခြင်း](/docs/react/updating-objects-in-state) — state ထဲက object တစ်ခုကို ဘယ်လို update မလဲ
- [State ထဲက Array တွေကို Update လုပ်ခြင်း](/docs/react/updating-arrays-in-state) — state ထဲက array တစ်ခုကို ဘယ်လို update မလဲ

## Event တွေကို တုံ့ပြန်ခြင်း

React က သင့် JSX ထဲမှာ *event handlers* တွေ ထည့်ခွင့် ပေးပါတယ်။ Event handlers တွေဆိုတာ — click လုပ်ခြင်း၊ hover လုပ်ခြင်း၊ form input တွေကို focus လုပ်ခြင်း စတဲ့ user interactions တွေကို တုံ့ပြန်ပြီး trigger ဖြစ်တဲ့ — သင်ကိုယ်တိုင်ရဲ့ functions တွေပါ။

`<button>` လိုမျိုး built-in components တွေက `onClick` လိုမျိုး built-in browser events တွေကိုပဲ ထောက်ပံ့ပါတယ်။ ဒါပေမယ့် — ကိုယ်ပိုင် component တွေ ဖန်တီးပြီး — သူတို့ရဲ့ event handler props တွေကို — application နဲ့ ကိုက်ညီတဲ့ နာမည်တွေ ပေးလို့ရပါတယ်:

```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

Event handlers တွေ ဘယ်လို ထည့်မလဲဆိုတာ [Event များနဲ့ အပြန်အလှန်](/docs/react/events) မှာ ဆက်လေ့လာပါ။

## State — Component တစ်ခုရဲ့ Memory

Component တွေက interaction တစ်ခုရဲ့ ရလဒ်အနေနဲ့ — screen ပေါ်က အရာတွေကို ပြောင်းဖို့ မကြာခဏ လိုအပ်ပါတယ်။ Form ထဲ စာရိုက်တာက input field ကို update လုပ်သင့်တယ်၊ image carousel ပေါ်က "next" ကို နှိပ်တာက ပြသနေတဲ့ image ကို ပြောင်းသင့်တယ်၊ "buy" ကို နှိပ်တာက ပစ္စည်းတစ်ခုကို shopping cart ထဲ ထည့်သင့်တယ်။ Component တွေက အရာတွေကို "မှတ်မိ" ဖို့ လိုပါတယ် — လက်ရှိ input value၊ လက်ရှိ image၊ shopping cart စသဖြင့်ပေါ့။ React မှာ — ဒီလို component-specific memory မျိုးကို *state* လို့ ခေါ်ပါတယ်။

[`useState`](/docs/react/use-state) Hook နဲ့ component တစ်ခုကို state ထည့်နိုင်ပါတယ်။ *Hooks* တွေက — သင့် component တွေကို React features တွေ သုံးခွင့်ပေးတဲ့ အထူး functions တွေပါ (state က အဲဒီ features တွေထဲက တစ်ခုပါ)။ `useState` Hook က state variable တစ်ခုကို ကြေညာခွင့် ပေးပါတယ် — ကနဦး state ကို ယူပြီး — တန်ဖိုးအတွဲတစ်တွဲ ပြန်ပေးပါတယ်: လက်ရှိ state နဲ့ — အဲဒါကို update လုပ်ဖို့ state setter function တစ်ခုပါ:

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

တန်ဖိုးတစ်ခုကို မှတ်မိပြီး — interaction ပေါ်မှာ update လုပ်နည်းကို [State — Component တစ်ခုရဲ့ Memory](/docs/react/state-a-components-memory) မှာ ဆက်လေ့လာပါ။

## Render လုပ်ခြင်းနဲ့ Commit လုပ်ခြင်း

သင့် component တွေ screen ပေါ် မပြသခင် — React က သူတို့ကို render လုပ်ရပါတယ်။ ဒီဖြစ်စဉ်ထဲက အဆင့်တွေကို နားလည်ထားတာက — သင့် code ဘယ်လို execute ဖြစ်လဲဆိုတာ တွေးတောနိုင်ပြီး — အပြုအမူတွေကို ရှင်းပြနိုင်စေပါတယ်။

သင့် component တွေက မီးဖိုချောင်ထဲက စားဖိုမှူးတွေ၊ ပါဝင်ပစ္စည်းတွေကနေ ဟင်းပွဲတွေ ချက်နေတယ်လို့ စိတ်ကူးကြည့်ပါ။ ဒီအခြေအနေမှာ — React က ဝယ်သူတွေရဲ့ မှာစာတွေကို လက်ခံပြီး ဟင်းပွဲတွေ ပို့ပေးတဲ့ စားပွဲထိုးပါ။ UI ကို တောင်းဆို/ပို့ဆောင်တဲ့ ဒီဖြစ်စဉ်မှာ အဆင့် သုံးဆင့် ရှိပါတယ်:

1. **Triggering** — render တစ်ခုကို စတင်ခြင်း (ဝယ်သူရဲ့ မှာစာကို မီးဖိုချောင်ဆီ ပို့ခြင်း)
2. **Rendering** — component ကို render လုပ်ခြင်း (မီးဖိုချောင်ထဲမှာ မှာစာ ပြင်ဆင်ခြင်း)
3. **Committing** — DOM ဆီ commit လုပ်ခြင်း (မှာစာကို စားပွဲပေါ် တင်ခြင်း)

UI update တစ်ခုရဲ့ သက်တမ်းစက်ဝိုင်းအကြောင်း [Render လုပ်ခြင်းနဲ့ Commit လုပ်ခြင်း](/docs/react/render-and-commit) မှာ ဆက်လေ့လာပါ။

## State က Snapshot တစ်ခုပါ

ပုံမှန် JavaScript variable တွေနဲ့ မတူဘဲ — React state က snapshot တစ်ခုလိုမျိုး ပြုမူပါတယ်။ State ကို set လုပ်တာက — သင့်မှာ ရှိပြီးသား state variable ကို မပြောင်းဘဲ — re-render တစ်ခုကို trigger လုပ်ပါတယ်။ ဒါက အစပိုင်းမှာ အံ့သြစရာ ကောင်းနိုင်ပါတယ်!

```js
console.log(count);  // 0
setCount(count + 1); // 1 နဲ့ re-render တစ်ခု တောင်းဆိုခြင်း
console.log(count);  // 0 ပဲ ရှိနေသေးတယ်!
```

ဒီအပြုအမူက သိမ်မွေ့တဲ့ bug တွေကို ရှောင်ရှားဖို့ ကူညီပေးပါတယ်။ Event handlers တွေထဲမှာ state က ဘာကြောင့် "ပုံသေ" ဖြစ်နေပြီး မပြောင်းလဲဘူးဆိုတာ [State နဲ့ Rendering](/docs/react/state-snapshot) မှာ ဆက်ဖတ်ပါ။

## State Update တစ်တန်းကို Queue တင်ခြင်း

ဒီ component က bug ရှိပါတယ် — "+3" ကို နှိပ်လိုက်ရင် score က တစ်ခါပဲ တိုးပါတယ်:

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

[State နဲ့ Rendering](/docs/react/state-snapshot) က ဒါ ဘာကြောင့် ဖြစ်တာလဲဆိုတာ ရှင်းပြပါတယ် — state ကို set လုပ်တာက re-render အသစ်တစ်ခုကို တောင်းဆိုပေမယ့် — run နေပြီးသား code ထဲမှာတော့ မပြောင်းပါဘူး။ State ကို set လုပ်တဲ့အခါ *updater function* တစ်ခု ပို့ခြင်းဖြင့် ဒါကို ပြုပြင်နိုင်ပါတယ် — `setScore(score + 1)` အစား `setScore(s => s + 1)` သုံးတာက "+3" button ကို ပြုပြင်ပေးပြီး — state updates အများအပြားကို queue တင်ခွင့် ပေးပါတယ်။

State update တစ်တန်းကို ဘယ်လို queue တင်မလဲဆိုတာ [State Update တစ်တန်းကို Queue တင်ခြင်း](/docs/react/queueing-a-series-of-state-updates) မှာ ဆက်လေ့လာပါ။

## State ထဲက Object တွေကို Update လုပ်ခြင်း

State က JavaScript တန်ဖိုး ဘယ်မျိုးကိုမဆို ကိုင်ထားနိုင်ပါတယ် — object တွေ အပါအဝင်ပါ။ ဒါပေမယ့် — React state ထဲမှာ ကိုင်ထားတဲ့ object တွေနဲ့ array တွေကို — တိုက်ရိုက် ပြောင်းလဲလို့ မရပါဘူး။ အဲဒီအစား — object ဒါမှမဟုတ် array တစ်ခုကို update လုပ်ချင်ရင် — အသစ်တစ်ခု ဖန်တီးရပါတယ် (ဒါမှမဟုတ် ရှိပြီးသား တစ်ခုရဲ့ copy တစ်ခု လုပ်ပါ) — ပြီးမှ state ကို အဲဒီ copy သုံးဖို့ update လုပ်ပါတယ်။ ပုံမှန်အားဖြင့် — ပြောင်းလဲချင်တဲ့ object/array တွေကို copy လုပ်ဖို့ `...` spread syntax ကို သုံးပါတယ်:

```jsx
setPerson({
  ...person,
  name: e.target.value
});
```

Object တွေကို မှန်ကန်အောင် ဘယ်လို update မလဲဆိုတာ [State ထဲက Object တွေကို Update လုပ်ခြင်း](/docs/react/updating-objects-in-state) မှာ ဆက်လေ့လာပါ။

## State ထဲက Array တွေကို Update လုပ်ခြင်း

Array တွေက state ထဲမှာ သိမ်းလို့ရတဲ့ — mutable JavaScript object အမျိုးအစား နောက်တစ်မျိုးပါ — ဒါပေမယ့် — read-only အဖြစ်ပဲ သဘောထားသင့်ပါတယ်။ Object တွေလိုပဲ — state ထဲက array တစ်ခုကို update လုပ်ချင်ရင် — အသစ်တစ်ခု ဖန်တီးရပါတယ် (ဒါမှမဟုတ် ရှိပြီးသား တစ်ခုရဲ့ copy တစ်ခု လုပ်ပါ) — ပြီးမှ state ကို array အသစ် သုံးဖို့ set လုပ်ပါတယ်:

```jsx
setList(list.map(artwork => {
  if (artwork.id === artworkId) {
    return { ...artwork, seen: nextSeen };
  } else {
    return artwork;
  }
}));
```

Array တွေကို မှန်ကန်အောင် ဘယ်လို update မလဲဆိုတာ [State ထဲက Array တွေကို Update လုပ်ခြင်း](/docs/react/updating-arrays-in-state) မှာ ဆက်လေ့လာပါ။

## နောက်တစ်ဆင့်တွေ

- [Event များနဲ့ အပြန်အလှန်](/docs/react/events) ကနေ စပြီး — ဒီ chapter ကို page တစ်ခုချင်းစီ ဖတ်သွားနိုင်ပါတယ်။
- ဒီအကြောင်းအရာတွေ သိပြီးသားဆိုရင် — [State စီမံခန့်ခွဲမှု](/docs/react/managing-state) ကို ဆက်ဖတ်ပါ။
