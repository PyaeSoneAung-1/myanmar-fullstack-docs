---
title: "အသုံးများတဲ့ Patterns"
description: "အသုံးများတဲ့ Zustand patterns — Map/object update, get/set helper, computed state, async actions, React မပါဘဲ သုံးခြင်း"
order: 9
source: "https://zustand.docs.pmnd.rs/guides/recipes"
status: translated
updated: 2026-09-01
---

## Map / Object Update Pattern

Zustand က state ပြောင်းလဲမှုကို reference နှိုင်းယှဉ်ပြီး ရှာဖွေတာမို့ — `Map` (နဲ့ `Set`) လို
mutable data structure တွေကို update လုပ်တဲ့အခါ instance အသစ် ဖန်တီးပေးရပါတယ်:

```js
// Update single entry
set((state) => ({
  foo: new Map(state.foo).set(key, value),
}))

// Delete entry
set((state) => {
  const next = new Map(state.foo)
  next.delete(key)
  return { foo: next }
})

// ❌ Wrong - same reference, no re-render
set((state) => {
  state.foo.set(key, value)
  return { foo: state.foo }
})

// ✅ Correct - new reference, triggers re-render
set((state) => ({
  foo: new Map(state.foo).set(key, value),
}))
```

အရင်က instance ကိုပဲ mutate လုပ်ပြီး ပြန်ပေးရင် — reference မပြောင်းတာမို့ re-render မဖြစ်တာကို
အပေါ်က wrong/correct နှိုင်းယှဉ်မှုမှာ မြင်ရပါလိမ့်မယ်။

Plain object တွေမှာတော့ spread pattern ကို သုံးပါတယ် — `set((state) => ({ nested: { ...state.nested, count: state.nested.count + 1 } }))`
လိုမျိုးပါ (အသေးစိတ်ကို [State Update လုပ်ခြင်း](/docs/zustand/update-state) မှာ ကြည့်ပါ)။

## State ကို get/set Helper တွေနဲ့ ဖတ်/ပြောင်းခြင်း

Action တွေထဲမှာ လက်ရှိ state ကို ဖတ်ဖို့ `set((state) => ...)` ရဲ့ function form ကို သုံးနိုင်သလို —
store creator ကို `(set, get)` နဲ့ လက်ခံပြီး `get()` နဲ့လည်း ဘယ်နေရာမှာမဆို ဖတ်လို့ရပါတယ်:

```js
const useStore = create((set, get) => ({
  sound: 'grunt',
  action: () => {
    const sound = get().sound
    set({ sound: sound.toUpperCase() })
  },
}))
```

Component အပြင်ကနေ ဖတ်/ပြောင်းချင်ရင်လည်း — hook မှာ ပါတဲ့ utility တွေကို သုံးလို့ရပါတယ်:
`useStore.getState()` က non-reactive ဖတ်နည်း, `useStore.setState(...)` က update လုပ်နည်းပါ။
ဒါတွေက `set` လိုပဲ merge behavior ကို လိုက်နာပါတယ်။

## Computed State (Derived State)

Value တိုင်းကို store ထဲ သိမ်းစရာ မလိုပါဘူး — တချို့ value တွေက လက်ရှိ state ကနေ
တွက်ထုတ်လို့ရတဲ့ **computed state** (derived state) ပါ။ Store ထဲ ထပ်မထည့်ဘဲ — selector
ထဲမှာ တိုက်ရိုက် တွက်ယူလို့ရပါတယ်:

```jsx
import { create } from 'zustand'

const useBearStore = create(() => ({
  bears: 3,
  foodPerBear: 2,
}))

function TotalFood() {
  // Derived value: required amount food for all bears
  const totalFood = useBearStore((s) => s.bears * s.foodPerBear) // don't need to have extra property `{ totalFood: 6 }` in your Store

  return <div>We need {totalFood} jars of honey</div>
}
```

ဒါကြောင့် store က minimal ဖြစ်နေပြီး — `bears` ဒါမှမဟုတ် `foodPerBear` ပြောင်းတိုင်း
`totalFood` က အလိုအလျောက် မှန်နေပါတယ်။

## Async Actions

Zustand က action က async ဖြစ်ဖြစ်, sync ဖြစ်ဖြစ် ဂရုမစိုက်ပါဘူး — async flow ထဲမှာ
data ရောက်တဲ့အခါ `set` ကို ခေါ်လိုက်ရုံပါပဲ:

```js
const useStore = create((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
  },
}))
```

`fetch` action က network ကို စောင့်ပြီး — data ရတာနဲ့ `set` နဲ့ store ထဲ ထည့်ပါတယ်။ Loading
state ထည့်ချင်ရင် — `await` မလုပ်ခင် `set({ loading: true })` လုပ်ပြီး, data ရတာနဲ့
ပြန်ပိတ်လို့ရပါတယ်။

## React မပါဘဲ Zustand (Vanilla Store)

Zustand ရဲ့ core ကို React မလိုဘဲ သုံးလို့ရပါတယ် — `zustand/vanilla` ကနေ import လုပ်ရင်
`createStore` က hook အစား API utility တွေ (`getState`, `setState`, `subscribe`, `destroy`) ကို
ပြန်ပေးပါတယ်။ ဒါကြောင့် React project မဟုတ်တဲ့နေရာ (ဥပမာ plain JavaScript module, test file)
တွေမှာလည်း state management လုပ်လို့ရပြီး — [Testing](/docs/zustand/testing) မှာ မြင်ခဲ့တဲ့အတိုင်း
store ကို React အပြင်မှာ test လုပ်ရာမှာလည်း အသုံးဝင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [State Update လုပ်ခြင်း](/docs/zustand/update-state) — `set()` နဲ့ update လုပ်ပုံ အသေးစိတ်
- [Immer Middleware](/docs/zustand/immer) — nested update တွေကို ရိုးရှင်းအောင် လုပ်နည်း
- [Persist Middleware](/docs/zustand/persist) — state ကို storage မှာ သိမ်းနည်း
