---
title: "TypeScript နဲ့ သုံးခြင်း"
description: "Zustand store တွေကို TypeScript နဲ့ type သတ်မှတ်ခြင်း — create<T>()(), typed set/get, slice pattern"
order: 4
source: "https://zustand.docs.pmnd.rs/guides/typescript"
status: translated
updated: 2026-09-01
---

## Store ကို TypeScript နဲ့ ဖန်တီးခြင်း

Zustand က TypeScript-first ဒီဇိုင်း ဖြစ်လို့ — state, action, selector တွေအားလုံးကို
strongly typed ရပြီး autocomplete ရော compile-time safety ပါ ရပါတယ်။
TypeScript မှာ store ဖန်တီးတဲ့အခါ `create(...)` အစား **curried** ပုံစံ
`create<T>()(...)` ကို သုံးရပါတယ် — type parameter `T` နဲ့ state type ကို
သတ်မှတ်ပြီး နောက်ထပ် `()` တစ်ခါ ထပ်ပါတယ်:

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

ဘာလို့ curried ပုံစံ လဲဆိုတော့ — state type `T` က invariant ဖြစ်လို့ TypeScript က
initial state ကနေ ကိုယ်တိုင် infer မလုပ်နိုင်လို့ပါ။ Currying က
TypeScript issue #10571 အတွက် workaround ဖြစ်ပြီး — `T` ကို ကိုယ်တိုင် သတ်မှတ်ပြီး
ကျန်တဲ့ type တွေကို infer လုပ်ခွင့် ပေးပါတယ်။

## Typed set နဲ့ get

`create<BearState>()((set) => ...)` လို့ ရေးလိုက်တာနဲ့ `set` နဲ့ `get` နှစ်ခုလုံးက
`BearState` နဲ့ typed ဖြစ်သွားပါတယ်။ ဥပမာ `set((state) => ({ bears: state.bears + by }))`
မှာ `state` က `BearState` type ဖြစ်လို့ `state.bears` က number ဆိုတာ TypeScript က
သေချာ သိပြီး — field အမည် မှားရေးရင် ဒါမှမဟုတ် type မှားရင် compile လုပ်တုန်းမှာတင်
အမှား ပြပါတယ်။ Action တွေထဲမှာ `get()` ကိုလည်း သုံးနိုင်ပြီး — အဲဒါကလည်း
typed state ကို ပြန်ပေးလို့ လက်ရှိ state ကို ဖတ်ပြီး တွက်ချက်တာတွေ လုပ်နိုင်ပါတယ်။

## Slice Pattern — Slice တွေကို type သတ်မှတ်ခြင်း

Store ကြီးတွေမှာ slice တွေ ခွဲတဲ့အခါ — slice တစ်ခုစီကို `StateCreator` type နဲ့
သတ်မှတ်ပြီး ရေးလို့ရပါတယ်။ ဒါကို **createStateSlice pattern** လို့လည်း ခေါ်ပါတယ် —
`StateCreator<MyState, [], [], MySlice>` ပုံစံမှာ store တစ်ခုလုံးရဲ့ state နဲ့
slice တစ်ခုချင်းစီရဲ့ type ကို သီးခြား သတ်မှတ်ပါတယ်:

```ts
import { create, StateCreator } from 'zustand'

interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

// slice တစ်ခုစီက set (နဲ့ get) ကို typed နဲ့ ရရှိပါတယ်
const createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<BearSlice & FishSlice, [], [], FishSlice> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})
```

`StateCreator` ရဲ့ generic arguments တွေက — store တစ်ခုလုံးရဲ့ state (`BearSlice & FishSlice`),
mutator list (`[]` — middleware မရှိရင်), နောက်ဆုံး ဒီ slice ရဲ့ type ပါ။ Middleware
သုံးရင် mutator တွေကို `[["zustand/devtools", never]]` လိုမျိုး ထည့်ရပါတယ်။

## Slice တွေ ပေါင်းစပ်ခြင်း (Combining Slices)

Slice တွေအားလုံးကို `create<CombinedState>()((...a) => ...)` နဲ့ store တစ်ခုထဲ
ပေါင်းစပ်ပါတယ် — slice function တစ်ခုချင်းစီကို `...a` နဲ့ ခေါ်ပြီး
result တွေကို spread လုပ်တာပါ:

```ts
const useBoundStore = create<BearSlice & FishSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

Slice တစ်ခုက နောက် slice ရဲ့ state ကို လိုအပ်ရင် `(set, get)` ကို လက်ခံတဲ့
slice တစ်ခု ထပ်ထည့်နိုင်ပါတယ်:

```ts
interface SharedSlice {
  addBoth: () => void
  getBoth: () => number
}

const createSharedSlice: StateCreator<BearSlice & FishSlice, [], [], SharedSlice> = (set, get) => ({
  addBoth: () => {
    // slice တွေရဲ့ method တွေကို ပြန်သုံးနိုင်တယ်
    get().addBear()
    get().addFish()
  },
  getBoth: () => get().bears + get().fishes,
})
```

ပြီးရင် `create` ထဲမှာ ဒီ slice ကိုပါ ထည့်လိုက်ရင် — store တစ်ခုလုံးက typed ဖြစ်ပြီး
component တွေမှာ `useBoundStore((state) => state.bears)` လိုမျိုး type-safe နဲ့
သုံးလို့ရပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Zustand စတင်ခြင်း](/docs/zustand/getting-started) — store ဖန်တီးပုံ အခြေခံ
- [State Update လုပ်ခြင်း](/docs/zustand/update-state) — typed store တွေမှာ state update လုပ်နည်း
