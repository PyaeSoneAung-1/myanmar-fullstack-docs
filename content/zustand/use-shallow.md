---
title: "useShallow (Selector Memoize လုပ်ခြင်း)"
description: "useShallow hook နဲ့ selector function တွေကို memoize လုပ်ပြီး re-render တွေကို optimize လုပ်နည်း"
order: 14
source: "https://zustand.docs.pmnd.rs/reference/hooks/use-shallow"
status: translated
updated: 2026-09-01
---

`useShallow` က re-render တွေကို optimize လုပ်နိုင်အောင် လုပ်ပေးတဲ့ React Hook တစ်ခုပါ။

```js
const memoizedSelector = useShallow(selector)
```

## Types

### Signature

```ts
useShallow<T, U = T>(selectorFn: (state: T) => U): (state: T) => U
```

## Reference

### `useShallow(selectorFn)`

#### Parameters

- `selectorFn`: လက်ရှိ state ကို အခြေခံတဲ့ data တွေကို ပြန်ပေးနိုင်တဲ့ function တစ်ခုပါ။

#### Returns

`useShallow` က selector function တစ်ခုရဲ့ memoized version ကို — shallow comparison ကို memoization အတွက် သုံးပြီး ပြန်ပေးပါတယ်။

## Usage

### Memoized selector တစ်ခု ရေးသားခြင်း

ပထမဆုံး — ဝက်ဝံမိသားစုရဲ့ state ကို သိမ်းထားဖို့ store တစ်ခု ပြင်ဆင်ကြည့်ရအောင်။ ဒီ store ထဲမှာ property သုံးခု သတ်မှတ်ထားပါတယ် — `papaBear`, `mamaBear`, `babyBear` — တစ်ခုချင်းစီက ဝက်ဝံမိသားစုရဲ့ အဖွဲ့ဝင် တစ်ဦးစီနဲ့ သူတို့ရဲ့ oatmeal pot အရွယ်အစား အသီးသီးကို ကိုယ်စားပြုပါတယ်။

```tsx
import { create } from 'zustand'

type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))
```

နောက်တစ်ဆင့်မှာ — ကျွန်တော်တို့ state ရဲ့ keys တွေ (ဝက်ဝံမိသားစုရဲ့ အဖွဲ့ဝင်တွေ) ကို ယူပြီး ပြသပေးတဲ့ `BearNames` component တစ်ခု ဖန်တီးပါမယ်။

```tsx
function BearNames() {
  const names = useBearFamilyMealsStore((state) => Object.keys(state))

  return <div>{names.join(', ')}</div>
}
```

နောက်တစ်ဆင့်မှာ — baby bear ရဲ့ meal ရွေးချယ်မှုကို ပုံမှန် update လုပ်ပေးတဲ့ `UpdateBabyBearMeal` component တစ်ခု ဖန်တီးပါမယ်။

```tsx
const meals = [
  'A tiny, little, wee bowl',
  'A small, petite, tiny pot',
  'A wee, itty-bitty, small bowl',
  'A little, petite, tiny dish',
  'A tiny, small, wee vessel',
  'A small, little, wee cauldron',
  'A little, tiny, small cup',
  'A wee, small, little jar',
  'A tiny, wee, small pan',
  'A small, wee, little crock',
]

function UpdateBabyBearMeal() {
  useEffect(() => {
    const timer = setInterval(() => {
      useBearFamilyMealsStore.setState({
        babyBear: meals[Math.floor(Math.random() * (meals.length - 1))],
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return null
}
```

နောက်ဆုံးမှာ — component နှစ်ခုလုံးကို `App` component ထဲမှာ ပေါင်းပြီး အလုပ်လုပ်ပုံကို ကြည့်ကြရအောင်။

```tsx
export default function App() {
  return (
    <>
      <UpdateBabyBearMeal />
      <BearNames />
    </>
  )
}
```

အပြည့်အစုံ code က ဒီလိုပုံစံ ဖြစ်သင့်ပါတယ်:

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'

type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))

const meals = [
  'A tiny, little, wee bowl',
  'A small, petite, tiny pot',
  'A wee, itty-bitty, small bowl',
  'A little, petite, tiny dish',
  'A tiny, small, wee vessel',
  'A small, little, wee cauldron',
  'A little, tiny, small cup',
  'A wee, small, little jar',
  'A tiny, wee, small pan',
  'A small, wee, little crock',
]

function UpdateBabyBearMeal() {
  useEffect(() => {
    const timer = setInterval(() => {
      useBearFamilyMealsStore.setState({
        babyBear: meals[Math.floor(Math.random() * (meals.length - 1))],
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return null
}

function BearNames() {
  const names = useBearFamilyMealsStore((state) => Object.keys(state))

  return <div>{names.join(', ')}</div>
}

export default function App() {
  return (
    <>
      <UpdateBabyBearMeal />
      <BearNames />
    </>
  )
}
```

အရာအားလုံး အဆင်ပြေပုံ ရပေမယ့် — ပြဿနာလေး တစ်ခု ရှိပါတယ်: `BearNames` component က names တွေ မပြောင်းဘဲ ရှိနေပေမယ့် ထပ်ခါထပ်ခါ re-render ဖြစ်နေပါတယ်။ ဘာကြောင့်လဲဆိုတော့ — state ရဲ့ ဘယ်အပိုင်းပဲ ပြောင်းပြောင်း (ကျွန်တော်တို့ ဂရုစိုက်တဲ့ names စာရင်း မပြောင်းရင်တောင်) component က re-render ဖြစ်သွားလို့ပါ။

ဒါကို ဖြေရှင်းဖို့ — component က state ရဲ့ keys တွေ တကယ် ပြောင်းမှသာ re-render ဖြစ်အောင် `useShallow` ကို သုံးပါတယ်:

```tsx
function BearNames() {
  const names = useBearFamilyMealsStore(
    useShallow((state) => Object.keys(state)),
  )

  return <div>{names.join(', ')}</div>
}
```

အပြည့်အစုံ code က ဒီလိုပုံစံ ဖြစ်သင့်ပါတယ်:

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))

const meals = [
  'A tiny, little, wee bowl',
  'A small, petite, tiny pot',
  'A wee, itty-bitty, small bowl',
  'A little, petite, tiny dish',
  'A tiny, small, wee vessel',
  'A small, little, wee cauldron',
  'A little, tiny, small cup',
  'A wee, small, little jar',
  'A tiny, wee, small pan',
  'A small, wee, little crock',
]

function UpdateBabyBearMeal() {
  useEffect(() => {
    const timer = setInterval(() => {
      useBearFamilyMealsStore.setState({
        babyBear: meals[Math.floor(Math.random() * (meals.length - 1))],
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return null
}

function BearNames() {
  const names = useBearFamilyMealsStore(
    useShallow((state) => Object.keys(state)),
  )

  return <div>{names.join(', ')}</div>
}

export default function App() {
  return (
    <>
      <UpdateBabyBearMeal />
      <BearNames />
    </>
  )
}
```

`useShallow` ကို သုံးခြင်းအားဖြင့် — rendering process ကို optimize လုပ်လိုက်ပြီး component က လိုအပ်မှသာ re-render ဖြစ်တာမို့ — အလုံးစုံ performance တိုးတက်လာပါတယ်။

## Troubleshooting

### Store ကနေ value အများကြီး ဖတ်တဲ့အခါ "Maximum update depth exceeded" error ရတယ်

v5 ကစပြီး — render တိုင်းမှာ reference အသစ် ပြန်ပေးတဲ့ selectors တွေက infinite update loops တွေ ဖြစ်စေနိုင်ပါတယ်၊ ဘာလို့လဲဆိုတော့ default equality check က `Object.is` ဖြစ်လို့ပါ။ အဖြစ်အများဆုံး ကိစ္စကတော့ — selector ထဲမှာ value အများကြီးကို object တစ်ခုတည်းထဲ စုထည့်လိုက်တာပါ။ အောက်က code က error ကို ဖြစ်စေပါတယ်:

```tsx
const { searchValue, setSearchValue } = useStore((state) => ({
  searchValue: state.searchValue,
  setSearchValue: state.setSearchValue,
}))
```

Wrapper object က render တိုင်း အသစ်ပြန်ဖန်တီးခံရတာမို့ — နှိုင်းယှဉ်မှု တစ်ခုချင်းစီတိုင်း မအောင်မြင်ပြီး component က loop ထဲမှာ ထပ်ခါထပ်ခါ re-subscribe ဖြစ်နေပါတယ်။

Selector ကို `useShallow` နဲ့ wrap လုပ်လိုက်ရင် — wrapper ကိုယ်တိုင် မဟုတ်ဘဲ wrapper ရဲ့ property တွေကို reference နဲ့ နှိုင်းယှဉ်ပါလိမ့်မယ်:

```tsx
const { searchValue, setSearchValue } = useStore(
  useShallow((state) => ({
    searchValue: state.searchValue,
    setSearchValue: state.setSearchValue,
  })),
)
```

တစ်နည်းအားဖြင့် — value တစ်ခုချင်းစီကို selector တစ်ခုစီနဲ့ subscribe လုပ်လို့လည်း ရပါတယ် — ဒါဆိုရင် ပြန်ဖန်တီးစရာ wrapper object မရှိတော့ပါဘူး:

```tsx
const searchValue = useStore((state) => state.searchValue)
const setSearchValue = useStore((state) => state.setSearchValue)
```

ဒီအပြုအမူ အပြောင်းအလဲရဲ့ နောက်ကွယ်က အကြောင်းရင်းအသေးစိတ်ကို v5 migration guide ထဲက [Requiring stable selector outputs](../migrations/migrating-to-v5.md#requiring-stable-selector-outputs) မှာ ကြည့်ပါ။
