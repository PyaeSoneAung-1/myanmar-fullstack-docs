---
title: "Zustand စတင်ခြင်း"
description: "Zustand ဆိုတာ ဘာလဲ၊ install လုပ်နည်း၊ create() နဲ့ store ဖန်တီးပြီး selector နဲ့ state ဖတ်/update လုပ်ခြင်း"
order: 1
source: "https://zustand.docs.pmnd.rs/getting-started/introduction"
status: translated
updated: 2026-09-01
---

## Zustand ဆိုတာ ဘာလဲ

**Zustand** က React အတွက် သေးငယ်၊ မြန်ဆန်ပြီး scale လုပ်လို့ရတဲ့ (scalable)
state management solution တစ်ခုပါ။ သူ့ရဲ့ ဆောင်ပုဒ်က "Bear necessities for React state"
ဖြစ်ပြီး — API က hooks ကို အခြေခံထားလို့ သုံးရတာ သက်တောင့်သက်သာ ရှိပါတယ်။
Boilerplate (ထပ်ခါထပ်ခါ ရေးနေရတဲ့ code) မလိုဘဲ၊ opinionated လည်း မဟုတ်ပေမယ့်
explicit ဖြစ်ပြီး flux ပုံစံနဲ့ ဆင်တဲ့ convention တွေ ပါပါတယ်။

Zustand ရဲ့ နောက်ထပ် အားသာချက်က React ရဲ့ နာမည်ကြီး pitfall တွေကို
ရှောင်ရှားဖို့ အချိန်အများကြီး သုံးထားတာပါ — zombie child problem, React concurrency,
mixed renderer တွေကြားမှာ context ပျောက်တာတွေ အပါအဝင်ပါ။ Provider တွေ မလိုဘဲ
hook တစ်ခုတည်းနဲ့ store တစ်ခုလုံးကို စီမံနိုင်တာကြောင့် React ecosystem ထဲမှာ
အသုံးအများဆုံး state manager တွေထဲက တစ်ခု ဖြစ်ပါတယ်။

## Installation

Zustand က NPM မှာ package အနေနဲ့ ရနိုင်ပါတယ်:

```bash
npm install zustand
```

Yarn, pnpm, bun စတဲ့ ကိုယ်ကြိုက်တဲ့ package manager မဆို သုံးလို့ရပါတယ်။

## Store တစ်ခု ဖန်တီးခြင်း

Zustand မှာ store ဆိုတာ hook တစ်ခုပါပဲ — primitive, object, function ဘာမဆို
ထည့်လို့ရပါတယ်။ `create()` ကို ခေါ်ပြီး `(set)` ကို လက်ခံတဲ့ function နဲ့
initial state ကို သတ်မှတ်ပါတယ်:

```js
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

ဒီဥပမာမှာ `bears` က state ဖြစ်ပြီး `increasePopulation`, `removeAllBears`,
`updateBears` တို့က state ကို ပြောင်းတဲ့ action (function) တွေပါ။
`increasePopulation` မှာ `set((state) => ...)` ပုံစံနဲ့ ရေးထားလို့ လက်ရှိ state ကို
ဖတ်ပြီး တန်ဖိုးအသစ် တွက်နိုင်ပါတယ်။ `set` က state အသစ်ကို လက်ရှိ state နဲ့
merge လုပ်ပေးပါတယ်။

## Component တွေထဲမှာ state သုံးခြင်း

Store က hook ဖြစ်လို့ provider တွေ မလိုဘဲ ဘယ် component မှာမဆို တိုက်ရိုက်
သုံးလို့ရပါတယ်။ Selector function နဲ့ လိုတဲ့ state ကို ရွေးပြီး — အဲဒီ state
ပြောင်းတဲ့အခါမှသာ component က re-render ဖြစ်ပါတယ်:

```jsx
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} bears around here...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

`useBearStore((state) => state.bears)` မှာ `(state) => state.bears` က selector ပါ —
state တစ်ခုလုံးကို မယူဘဲ `bears` တစ်ခုတည်းကိုပဲ ရွေးယူလို့ မလိုအပ်တဲ့
re-render တွေ မဖြစ်အောင် ကာကွယ်ပါတယ်။ ဒါပါပဲ — store ဖန်တီးပြီး component မှာ
သုံးလို့ရပါပြီ။

## နောက်တစ်ဆင့်တွေ

- [State Update လုပ်ခြင်း](/docs/zustand/update-state) — `set()` နဲ့ state ပြောင်းနည်း အသေးစိတ်
- [Selector သုံးခြင်း](/docs/zustand/selectors) — state ရွေးယူမှုကို optimize လုပ်နည်း
- [TypeScript နဲ့ သုံးခြင်း](/docs/zustand/typescript) — store တွေကို type-safe ဖြစ်အောင် ရေးနည်း
