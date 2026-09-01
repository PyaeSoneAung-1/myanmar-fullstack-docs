---
title: "Selector သုံးခြင်း"
description: "Selector နဲ့ state ရွေးချယ်ခြင်း — useShallow, equality function, transient update (subscribe) အကြောင်း"
order: 3
source: "https://zustand.docs.pmnd.rs/guides/selectors"
status: translated
updated: 2026-09-01
---

## Selector ဆိုတာ ဘာလဲ

Store က state တစ်ခုလုံးကို သိမ်းထားတာမို့ component ထဲမှာ လိုတဲ့ အပိုင်း (slice)
တစ်ခုချင်းစီကို ရွေးယူဖို့ **selector** ကို သုံးပါတယ်။ `useStore((state) => state.bears)`
လိုမျိုး — selector က state တစ်ခုလုံးကို လက်ခံပြီး ကိုယ်လိုချင်တဲ့ တန်ဖိုးကို
ပြန်ပေးတဲ့ function ပါ။ Selected value က `Object.is` နဲ့ ယှဉ်ကြည့်လို့ ပြောင်းသွားမှသာ
component က re-render ဖြစ်ပါတယ် — ဒါက Zustand ရဲ့ re-render တွေကို ထိန်းချုပ်တဲ့
အခြေခံ ယန္တရားပါ။

## State slice အများကြီး ရွေးခြင်း

တစ်ခါတစ်လေ state ရဲ့ value တစ်ခုထက်ပိုပြီး လိုအပ်ပါတယ် — အဲဒီအခါ selector က
object တစ်ခုကို ပြန်ပေးလို့ရပါတယ်။ ဒါပေမယ့် သတိထားရမှာက — object တစ်ခုကို
ပြန်ပေးတိုင်း ရလာတဲ့ reference က အသစ်ဖြစ်နေလို့ `Object.is` ယှဉ်ချက်က
မတူဘူးလို့ မှတ်ပြီး — state မပြောင်းဘဲနဲ့တောင် re-render တွေ ဖြစ်နိုင်ပါတယ်။

ဥပမာ — ဝက်ဝံတစ်ကောင်စီ စားတဲ့ meal တွေကို store မှာ သိမ်းထားပြီး သူတို့ရဲ့
နာမည်တွေကိုပဲ render လုပ်တဲ့ component တစ်ခု ကြည့်ရအောင်:

```js
import { create } from 'zustand'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))
```

`Object.keys(state)` လိုမျိုး computed value ကို selector နဲ့ ရွေးရင်:

```jsx
export const BearNames = () => {
  const names = useMeals((state) => Object.keys(state))
  return <div>{names.join(', ')}</div>
}
```

`useMeals.setState({ papaBear: 'a large pizza' })` လို့ state ကို ပြောင်းလိုက်ရင် —
`names` ရဲ့ တန်ဖိုးက မပြောင်းပေမယ့် — object reference အသစ် ဖြစ်သွားလို့
`BearNames` က re-render ဖြစ်ပါတယ်။

## useShallow နဲ့ re-render တွေကို ကာကွယ်ခြင်း

အဲဒီလို မလိုအပ်တဲ့ re-render တွေကို ကာကွယ်ဖို့ `useShallow` ကို သုံးပါတယ် —
selected value က နောက်ဆုံးတစ်ခါနဲ့ shallow equal ဖြစ်နေသရွေ့ re-render မလုပ်ပါဘူး:

```js
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))

export const BearNames = () => {
  const names = useMeals(useShallow((state) => Object.keys(state)))
  return <div>{names.join(', ')}</div>
}
```

ဒါဆိုရင် state ဘယ်လို ပြောင်းပြောင်း `names` ရဲ့ output က shallow equal ဆိုရင်
`BearNames` က ပြန်မဆွဲတော့ပါဘူး။ Value တစ်ခုထက်ပို ရွေးတဲ့အခါမှာလည်း
ဒီပုံစံအတိုင်း သုံးနိုင်ပါတယ်:

```js
const { bears, food } = useBearStore(
  useShallow((state) => ({ bears: state.bears, food: state.food })),
)
```

## Equality function တွေ

Zustand က default အနေနဲ့ `Object.is` ကို သုံးပြီး — ကိုယ်ပိုင် equality function
သုံးချင်ရင် `createWithEqualityFn` နဲ့ selector ရဲ့ ဒုတိယ argument အနေနဲ့
ပေးလို့ရပါတယ်:

```js
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

const useBearStore = createWithEqualityFn(() => ({
  bears: 0,
}))

const bears = useBearStore((s) => s.bears, Object.is)
// ဒါမှမဟုတ် object ရွေးရင် shallow နဲ့ ယှဉ်မယ်
const bears = useBearStore((s) => ({ bears: s.bears }), shallow)
```

## Transient updates — subscribe နဲ့ နားထောင်ခြင်း

Component ထဲ re-render မလိုဘဲ — store ရဲ့ state ပြောင်းတာကို ပြင်ပ (external)
နေရာကနေ နားထောင်ချင်ရင် `subscribe` ကို သုံးပါတယ်။ State တစ်စိတ်တစ်ပိုင်းကိုပဲ
နားထောင်ချင်ရင် `subscribeWithSelector` middleware ကို သုံးပြီး selector ကို
ထည့်နိုင်ပါတယ်:

```js
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useScratchStore = create(
  subscribeWithSelector((set) => ({
    scratches: 0,
    setScratches: (scratches) => set({ scratches }),
  })),
)

// scratches တန်ဖိုး ပြောင်းမှသာ listener ကို ခေါ်မယ်
const unsub = useScratchStore.subscribe(
  (state) => state.scratches,
  (scratches, prevScratches) => {
    console.log(scratches, prevScratches)
  },
)

// နားထောင်တာ ရပ်ဖို့
unsub()
```

Mouse position လို update မကြာခဏ ဖြစ်တဲ့ state တွေမှာ re-render မလုပ်ဘဲ
subscribe နဲ့ သီးသန့် ကိုင်တွယ်တာကို **transient update** လို့ ခေါ်ပါတယ် —
ဒီနည်းနဲ့ component တွေကို မလိုအပ်ဘဲ ပြန်ဆွဲစရာ မလိုတော့ပါဘူး။

Store ရဲ့ initial state ကိုပဲ ဖတ်ချင်ရင် `getInitialState()` ကို သုံးပါတယ်:

```js
const currentScratch = useScratchStore.getInitialState().scratches
```

## နောက်တစ်ဆင့်တွေ

- [State Update လုပ်ခြင်း](/docs/zustand/update-state) — selector နဲ့ ရွေးထားတဲ့ state တွေကို update လုပ်နည်း
- [TypeScript နဲ့ သုံးခြင်း](/docs/zustand/typescript) — selector တွေကို type-safe ဖြစ်အောင် ရေးနည်း
