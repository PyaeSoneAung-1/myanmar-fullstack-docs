---
title: "subscribeWithSelector (အသေးစိတ် State Update များကို Subscribe လုပ်ခြင်း)"
description: "subscribeWithSelector middleware နဲ့ လက်ရှိ state ကို အခြေခံပြီး သီးခြား data တွေကို subscribe လုပ်နည်း — partial state updates နားထောင်ခြင်း"
order: 20
source: "https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector"
status: translated
updated: 2026-09-01
---

`subscribeWithSelector` middleware က လက်ရှိ state ကို အခြေခံပြီး သီးခြား (specific) data တွေကို subscribe လုပ်ခွင့်ပေးပါတယ်။

```js
const nextStateCreatorFn = subscribeWithSelector(stateCreatorFn)
```

## Types

### Signature

```ts
subscribeWithSelector<T>(stateCreatorFn: StateCreator<T, [], []>): StateCreator<T, [['zustand/subscribeWithSelector', never]], []>
```

### Mutator

```ts
;['zustand/subscribeWithSelector', never]
```

## Reference

### `subscribeWithSelector(stateCreatorFn)`

#### Parameters

- `stateCreatorFn`: `set` function, `get` function နဲ့ `store` ကို argument အဖြစ် လက်ခံတဲ့ function တစ်ခုပါ။ အများအားဖြင့် သင်ထုတ်ပြချင်တဲ့ (expose) method တွေပါတဲ့ object ကို ပြန်ပေးပါလိမ့်မယ်။

#### Returns

`subscribeWithSelector` က state creator function တစ်ခုကို ပြန်ပေးပါတယ်။

## Usage

### Partial state updates တွေကို subscribe လုပ်ခြင်း

Partial state updates တွေကို subscribe လုပ်ခြင်းအားဖြင့် — store ရဲ့ partial state update ဖြစ်တိုင်း အလုပ်လုပ်တဲ့ callback တစ်ခုကို register လုပ်လိုက်တာပါ။ External state management အတွက် `subscribe` ကို သုံးနိုင်ပါတယ်။

```ts
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  subscribeWithSelector((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  })),
)

const $dot = document.getElementById('dot') as HTMLDivElement

$dot.addEventListener('mouseenter', (event) => {
  const parent = event.currentTarget.parentElement
  const parentWidth = parent.clientWidth
  const parentHeight = parent.clientHeight

  positionStore.getState().setPosition({
    x: Math.ceil(Math.random() * parentWidth),
    y: Math.ceil(Math.random() * parentHeight),
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe((state) => state.position, render)

const logger: Parameters<typeof positionStore.subscribe>[0] = (x) => {
  console.log('new x position', { x })
}

positionStore.subscribe((state) => state.position.x, logger)
```

ဒီမှာ `html` code က ဒီလိုပါ

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
