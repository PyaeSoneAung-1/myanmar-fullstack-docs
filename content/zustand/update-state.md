---
title: "State Update လုပ်ခြင်း"
description: "set() နဲ့ state update လုပ်ခြင်း — shallow merge, nested state, slice pattern နဲ့ replace flag"
order: 2
source: "https://zustand.docs.pmnd.rs/guides/updating-state"
status: translated
updated: 2026-09-01
---

## Flat Updates — set() အခြေခံ

Zustand မှာ state update လုပ်တာ ရိုးရှင်းပါတယ် — `set` function ကို state အသစ်နဲ့
ခေါ်လိုက်ရုံပါပဲ။ `set` က ပြောင်းလဲချင်တဲ့ value တွေကို store ထဲက လက်ရှိ state နဲ့
**shallow merge** လုပ်ပေးပါတယ်။ (Nested state အတွက်တော့ အောက်မှာ ကြည့်ပါ။)

```js
import { create } from 'zustand'

type State = {
  firstName: string
  lastName: string
}

type Action = {
  updateFirstName: (firstName: State['firstName']) => void
  updateLastName: (lastName: State['lastName']) => void
}

// state ရော action တွေပါ ပါတဲ့ store ကို ဖန်တီးမယ်
const usePersonStore = create<State & Action>()((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}))
```

`set` ကို object နဲ့ပဲ ဖြစ်ဖြစ်, updater function နဲ့ပဲ ဖြစ်ဖြစ် ခေါ်လို့ရပါတယ်။
Object နဲ့ ခေါ်ရင် — `set({ firstName: 'Hla' })` — ပြောင်းချင်တဲ့ value ကို
တိုက်ရိုက်ပေးပြီး, function နဲ့ ခေါ်ရင် — `set((state) => ({ firstName: 'Hla' }))` —
လက်ရှိ state ကို လက်ခံပြီး အဲဒီအပေါ် အခြေခံပြီး တွက်လို့ရပါတယ်။

Component ထဲမှာ အဲဒီ action တွေကို ဘယ်လို သုံးလဲ ဆိုတော့:

```jsx
function App() {
  const firstName = usePersonStore((state) => state.firstName)
  const updateFirstName = usePersonStore((state) => state.updateFirstName)

  return (
    <main>
      <label>
        First name
        <input
          onChange={(e) => updateFirstName(e.currentTarget.value)}
          value={firstName}
        />
      </label>

      <p>
        Hello, <strong>{firstName}!</strong>
      </p>
    </main>
  )
}
```

## Shallow Merge ဘယ်လို အလုပ်လုပ်သလဲ

`set` က state ကို level တစ်ခုထိ (one level) ပဲ merge လုပ်ပါတယ်။ ဒါကြောင့်
React ရဲ့ `useState` လိုပဲ immutable update လုပ်တဲ့အခါ — `...state` ကို
ထည့်စရာ မလိုဘဲ ပြောင်းချင်တဲ့ key ကိုပဲ ပေးရပါတယ်:

```js
import { create } from 'zustand'

const useCountStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))
```

တကယ်တမ်း `set` က `{ ...state, count: state.count + 1 }` လိုမျိုး merge လုပ်ပေးနေတာပါ —
ဒါက အသုံးများတဲ့ pattern ဖြစ်လို့ `...state` ကို ချန်လိုက်လို့ရတာပါ။

## Nested State တွေကို update လုပ်ခြင်း

State ထဲမှာ object ထဲ object တွေရှိရင်တော့ သတိထားရပါမယ် — `set` က level
တစ်ခုထဲပဲ merge လုပ်တာမို့ nested level တိုင်းကို spread operator `...` နဲ့
ကိုယ်တိုင် copy လုပ်ပေးရပါတယ်:

```js
const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}))
```

ဒီလိုရေးရတာ ရှည်တယ်ဆိုရင် [Immer](https://github.com/immerjs/immer) လိုမျိုး
library ကို သုံးပြီး deeply nested update တွေကို အတိုချုံးလို့ရပါတယ်။

## Slice Pattern — Store ကို အပိုင်းတွေ ခွဲခြင်း

Store က ကြီးလာတာနဲ့အမျှ ထိန်းသိမ်းရတာ ခက်လာပါတယ်။ အဲဒါအတွက် main store ကို
သေးငယ်တဲ့ slice တွေ ခွဲပြီး ပေါင်းစပ်လို့ရပါတယ် — ဒါကို **slice pattern** လို့
ခေါ်ပါတယ်။ Slice တစ်ခုစီက `set` ကို လက်ခံတဲ့ function တစ်ခုပါ:

```js
// fishSlice.js
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

// bearSlice.js
export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})
```

ပြီးရင် `create()` ထဲမှာ slice တွေကို ပေါင်းပြီး bounded store တစ်ခု ဖန်တီးပါတယ်:

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

Component ထဲမှာတော့ ပုံမှန်အတိုင်း selector နဲ့ ရွေးသုံးရုံပါပဲ —
`useBoundStore((state) => state.bears)`။ Slice တစ်ခုက နောက် slice ရဲ့ state ကိုပါ
သုံးချင်ရင် `(set, get)` နဲ့ လက်ခံပြီး `get().addBear()` လိုမျိုး တစ်ခါတည်း
ခေါ်လို့ရပါတယ်။

## State တစ်ခုလုံး Replace လုပ်ခြင်း

Default merge behavior ကို မလိုချင်ဘဲ state တစ်ခုလုံးကို state အသစ်နဲ့
အစားထိုးချင်ရင် `set` ရဲ့ ဒုတိယ argument ဖြစ်တဲ့ `replace` flag ကို `true`
ပေးလိုက်ပါ:

```js
set((state) => newState, true)
```

သတိထားရမှာက — replace လုပ်လိုက်ရင် ပါမသွားတဲ့ key တွေအားလုံး ပျက်သွားမှာမို့
ဒီ flag ကို လိုအပ်မှသာ သုံးပါ။

## နောက်တစ်ဆင့်တွေ

- [Selector သုံးခြင်း](/docs/zustand/selectors) — state ကို ထိရောက်စွာ ရွေးယူနည်း
- [Zustand စတင်ခြင်း](/docs/zustand/getting-started) — store ဖန်တီးပုံ အခြေခံ
