---
title: "combine (Types အလိုအလျောက် သတ်မှတ်ခြင်း)"
description: "combine middleware နဲ့ initial state နဲ့ state creator function ကို ပေါင်းပြီး store ဖန်တီးနည်း — types တွေ အလိုအလျောက် inferred လုပ်ခြင်း"
order: 16
source: "https://zustand.docs.pmnd.rs/reference/middlewares/combine"
status: translated
updated: 2026-09-01
---

`combine` middleware က initial state တစ်ခုကို — state slices အသစ်တွေနဲ့ actions တွေ ထည့်ပေးတဲ့ state creator function တစ်ခုနဲ့ ပေါင်းစပ်ပြီး ညီညွတ်တဲ့ (cohesive) state တစ်ခု ဖန်တီးနိုင်အောင် လုပ်ပေးပါတယ်။ ဒါက types တွေကို အလိုအလျောက် infer လုပ်ပေးတာမို့ — explicit type definitions တွေ မလိုတော့ဘဲ တကယ့်ကို အဆင်ပြေပါတယ်။

> **အကြံပြုချက်:** ဒါက middleware သုံးတဲ့အခါ `create` နဲ့ `createStore` ရဲ့ curried version တွေ မလိုတော့အောင် လုပ်ပေးတာမို့ — state management ကို ပိုရိုးရှင်းပြီး ထိရောက်စေပါတယ်။

```js
const nextStateCreatorFn = combine(initialState, additionalStateCreatorFn)
```

## Types

### Signature

```ts
combine<T extends object, U extends object>(initialState: T, additionalStateCreatorFn: StateCreator<T, [], [], U>): StateCreator<Omit<T, keyof U> & U, [], []>
```

## Reference

### `combine(initialState, additionalStateCreatorFn)`

#### Parameters

- `initialState`: State ကို ကနဦးမှာ ဘယ်လို ရှိစေချင်လဲဆိုတဲ့ တန်ဖိုးပါ။ Function မဟုတ်ဘဲ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။
- `additionalStateCreatorFn`: `set` function, `get` function နဲ့ `store` ကို argument အဖြစ် လက်ခံတဲ့ function တစ်ခုပါ။ အများအားဖြင့် သင်ထုတ်ပြချင်တဲ့ (expose) method တွေပါတဲ့ object ကို ပြန်ပေးပါလိမ့်မယ်။

#### Returns

`combine` က state creator function တစ်ခုကို ပြန်ပေးပါတယ်။

## Usage

### Types တွေ အလိုအလျောက် သတ်မှတ်ခံရတဲ့ store တစ်ခု ဖန်တီးခြင်း

ဒီဥပမာက store တစ်ခုကို ဘယ်လို ဖန်တီးပြီး — types တွေကို explicit အနေနဲ့ သတ်မှတ်စရာ မလိုဘဲ အလိုအလျောက် inferred လုပ်ခံရတယ်ဆိုတာကို ပြပါတယ်။

```ts
import { createStore } from 'zustand/vanilla'
import { combine } from 'zustand/middleware'

const positionStore = createStore(
  combine({ position: { x: 0, y: 0 } }, (set) => ({
    setPosition: (position) => set({ position }),
  })),
)

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe(render)
```

ဒီမှာ `html` code ပါ —

```html
<div
  id="dot-container"
  style="position: relative; width: 100vw; height: 100vh;"
>
  <div
    id="dot"
    style="position: absolute; background-color: red; border-radius: 50%; left: -10px; top: -10px; width: 20px; height: 20px;"
  ></div>
</div>
```

## Troubleshooting

TBD
