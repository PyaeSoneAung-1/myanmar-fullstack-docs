---
title: "create (React Hook Store ဖန်တီးခြင်း)"
description: "create API နဲ့ React Hook store ဖန်တီးနည်း၊ state update လုပ်နည်းများ၊ action မပါဘဲ state update လုပ်ခြင်းနဲ့ subscribe လုပ်ခြင်း"
order: 11
source: "https://zustand.docs.pmnd.rs/reference/apis/create"
status: translated
updated: 2026-09-01
---

`create` က API utilities တွေ တွဲပါတဲ့ React Hook တစ်ခုကို ဖန်တီးပေးပါတယ်။

```js
const useSomeStore = create(stateCreatorFn)
```

## Types

### Signature

```ts
create<T>()(stateCreatorFn: StateCreator<T, [], []>): UseBoundStore<StoreApi<T>>
```

## Reference

### `create(stateCreatorFn)`

#### Parameters

- `stateCreatorFn`: `set` function, `get` function နဲ့ `store` ကို argument အဖြစ် လက်ခံတဲ့ function တစ်ခုပါ။ အများအားဖြင့် သင်ထုတ်ပြချင်တဲ့ (expose) method တွေပါတဲ့ object ကို ပြန်ပေးပါလိမ့်မယ်။ `set`, `get` နဲ့ `store` တို့က ဒီ function အလုပ်လုပ်နေတုန်းမှာ သုံးလို့ မရဘဲ — store ဖန်တီးပြီးမှသာ သုံးလို့ရတယ်ဆိုတာ သတိပြုပါ။

#### Returns

`create` က API utilities တွေဖြစ်တဲ့ `setState`, `getState`, `getInitialState` နဲ့ `subscribe` တို့ တွဲပါတဲ့ React Hook တစ်ခုကို ပြန်ပေးပါတယ်။ Selector function သုံးပြီး လက်ရှိ state ကို အခြေခံတဲ့ data တွေကို ပြန်ပေးနိုင်ပါတယ်။ ဒါပေမယ့် selector function ကိုပဲ argument အဖြစ် လက်ခံပါတယ်။

## Usage

### Previous state ကို အခြေခံပြီး state update လုပ်ခြင်း

Previous state ကို အခြေခံပြီး state update လုပ်ဖို့ဆို **updater functions** တွေကို သုံးသင့်ပါတယ်။ အဲဒီအကြောင်း အသေးစိတ်ကို [ဒီမှာ](https://react.dev/learn/queueing-a-series-of-state-updates) ဖတ်ပါ။

ဒီဥပမာက **actions** တွေထဲမှာ **updater functions** တွေကို ဘယ်လို ထောက်ပံ့ပေးနိုင်တယ်ဆိုတာကို ပြပါတယ်။

```tsx
import { create } from 'zustand'

type AgeStoreState = { age: number }

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState['age']
      | ((currentAge: AgeStoreState['age']) => AgeStoreState['age']),
  ) => void
}

type AgeStore = AgeStoreState & AgeStoreActions

const useAgeStore = create<AgeStore>()((set) => ({
  age: 42,
  setAge: (nextAge) => {
    set((state) => ({
      age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
    }))
  },
}))

export default function App() {
  const age = useAgeStore((state) => state.age)
  const setAge = useAgeStore((state) => state.setAge)

  function increment() {
    setAge((currentAge) => currentAge + 1)
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button
        onClick={() => {
          increment()
          increment()
          increment()
        }}
      >
        +3
      </button>
      <button
        onClick={() => {
          increment()
        }}
      >
        +1
      </button>
    </>
  )
}
```

### State ထဲက Primitive တွေ update လုပ်ခြင်း

State က JavaScript ရဲ့ ဘယ်လို value အမျိုးအစားကိုမဆို သိမ်းထားနိုင်ပါတယ်။ number, string, boolean စတဲ့ built-in primitive value တွေကို update လုပ်ချင်တဲ့အခါ — update တွေ မှန်ကန်စွာ အလုပ်လုပ်ပြီး မမျှော်လင့်တဲ့ အပြုအမူတွေ မဖြစ်အောင် တန်ဖိုးအသစ်ကို တိုက်ရိုက် assign လုပ်သင့်ပါတယ်။

> **မှတ်ချက်:** Default အားဖြင့် `set` function က shallow merge လုပ်ပေးပါတယ်။ State တစ်ခုလုံးကို state အသစ်နဲ့ လုံးဝ အစားထိုးချင်ရင်တော့ `replace` parameter ကို `true` ဆိုပြီး သတ်မှတ်ပါ။

```tsx
import { create } from 'zustand'

type XStore = number

const useXStore = create<XStore>()(() => 0)

export default function MovingDot() {
  const x = useXStore()
  const setX = (nextX: number) => {
    useXStore.setState(nextX, true)
  }
  const position = { y: 0, x }

  return (
    <div
      onPointerMove={(e) => {
        setX(e.clientX)
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### State ထဲက Objects တွေ update လုပ်ခြင်း

JavaScript မှာ objects တွေက **mutable** (ပြောင်းလဲလို့ရတဲ့) ဖြစ်ပေမယ့် — state ထဲမှာ သိမ်းတဲ့အခါ **immutable** (မပြောင်းလဲသော) အနေနဲ့ သဘောထားသင့်ပါတယ်။ Object တစ်ခုကို update လုပ်ချင်ရင် object အသစ်တစ်ခု ဖန်တီးပြီး (သို့မဟုတ် ရှိပြီးသား object ကို copy လုပ်ပြီး) state ကို object အသစ်နဲ့ set လုပ်ရပါမယ်။

Default အားဖြင့် `set` function က shallow merge လုပ်ပေးပါတယ်။ သီးခြား property တချို့ကိုပဲ ပြုပြင်ဖို့လိုတဲ့ update အများစုအတွက် — default shallow merge က ပိုပြီး efficient ဖြစ်လို့ ဦးစားပေး သုံးသင့်ပါတယ်။ State တစ်ခုလုံးကို အသစ်နဲ့ လုံးဝ အစားထိုးချင်ရင်တော့ `replace` parameter ကို `true` ဆိုပြီး သတိထား သုံးပါ — ဘာလို့လဲဆိုတော့ state ထဲက ရှိပြီးသား nested data တွေ အားလုံး ပျောက်သွားလို့ပါ။

```tsx
import { create } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const usePositionStore = create<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (nextPosition) => set({ position: nextPosition }),
}))

export default function MovingDot() {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### State ထဲက Arrays တွေ update လုပ်ခြင်း

JavaScript မှာ arrays တွေက mutable ဖြစ်ပေမယ့် — state ထဲမှာ သိမ်းတဲ့အခါ immutable အနေနဲ့ သဘောထားသင့်ပါတယ်။ Objects တွေလိုပဲ — state ထဲမှာ သိမ်းထားတဲ့ array တစ်ခုကို update လုပ်ချင်ရင် array အသစ် ဖန်တီးပြီး (သို့မဟုတ် ရှိပြီးသားကို copy လုပ်ပြီး) state ကို array အသစ်နဲ့ set လုပ်ရပါမယ်။

Default အားဖြင့် `set` function က shallow merge လုပ်ပေးပါတယ်။ Array value တွေကို update လုပ်ဖို့ — update တွေ မှန်ကန်စွာ အလုပ်လုပ်ပြီး မမျှော်လင့်တဲ့ အပြုအမူတွေ မဖြစ်အောင် တန်ဖိုးအသစ်တွေကို assign လုပ်သင့်ပါတယ်။ State တစ်ခုလုံးကို အသစ်နဲ့ လုံးဝ အစားထိုးချင်ရင်တော့ `replace` parameter ကို `true` ဆိုပြီး သတ်မှတ်ပါ။

> **အရေးကြီး:** Immutable operation တွေကို ဦးစားပေး သုံးသင့်ပါတယ် — `[...array]`, `concat(...)`, `filter(...)`, `slice(...)`, `map(...)`, `toSpliced(...)`, `toSorted(...)`, `toReversed(...)` စတာတွေပေါ့။ `array[arrayIndex] = ...`, `push(...)`, `unshift(...)`, `pop(...)`, `shift(...)`, `splice(...)`, `reverse(...)`, `sort(...)` စတဲ့ mutable operation တွေကိုတော့ ရှောင်ကြဉ်ပါ။

```tsx
import { create } from 'zustand'

type PositionStore = [number, number]

const usePositionStore = create<PositionStore>()(() => [0, 0])

export default function MovingDot() {
  const [x, y] = usePositionStore()
  const setPosition: typeof usePositionStore.setState = (nextPosition) => {
    usePositionStore.setState(nextPosition, true)
  }
  const position = { x, y }

  return (
    <div
      onPointerMove={(e) => {
        setPosition([e.clientX, e.clientY])
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### Store action မပါဘဲ state update လုပ်ခြင်း

Store ရဲ့ အပြင်ဘက် module level မှာ actions တွေကို သတ်မှတ်ခြင်းက အားသာချက်တချို့ ရှိပါတယ် — action တစ်ခုကို ခေါ်ဖို့ hook မလိုတော့ဘူး၊ ပြီးတော့ code splitting ကိုလည်း လွယ်ကူစေပါတယ်။

> **မှတ်ချက်:** ဒါပေမယ့် အကြံပြုလိုတဲ့ နည်းကတော့ — actions တွေနဲ့ states တွေကို store ထဲမှာ အတူတူ ထားဖို့ပါ (actions တွေကို state နဲ့အတူ တစ်နေရာတည်းမှာ ထားပါ)။

```tsx
import { create } from 'zustand'

const usePositionStore = create<{
  x: number
  y: number
}>()(() => ({ x: 0, y: 0 }))

const setPosition: typeof usePositionStore.setState = (nextPosition) => {
  usePositionStore.setState(nextPosition)
}

export default function MovingDot() {
  const position = usePositionStore()

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
        onMouseEnter={(event) => {
          const parent = event.currentTarget.parentElement
          const parentWidth = parent.clientWidth
          const parentHeight = parent.clientHeight

          setPosition({
            x: Math.ceil(Math.random() * parentWidth),
            y: Math.ceil(Math.random() * parentHeight),
          })
        }}
      />
    </div>
  )
}
```

### State update တွေကို subscribe လုပ်ခြင်း

State update တွေကို subscribe လုပ်ခြင်းအားဖြင့် — store ရဲ့ state update ဖြစ်တိုင်း အလုပ်လုပ်တဲ့ callback တစ်ခုကို register လုပ်လိုက်တာပါ။ External state management အတွက် `subscribe` ကို သုံးနိုင်ပါတယ်။

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const usePositionStore = create<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (nextPosition) => set({ position: nextPosition }),
}))

export default function MovingDot() {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  useEffect(() => {
    const unsubscribePositionStore = usePositionStore.subscribe(
      ({ position }) => {
        console.log('new position', { position })
      },
    )

    return () => {
      unsubscribePositionStore()
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
        onMouseEnter={(event) => {
          const parent = event.currentTarget.parentElement
          const parentWidth = parent.clientWidth
          const parentHeight = parent.clientHeight

          setPosition({
            x: Math.ceil(Math.random() * parentWidth),
            y: Math.ceil(Math.random() * parentHeight),
          })
        }}
      />
    </div>
  )
}
```

## Troubleshooting

### State ကို update လုပ်ပြီးပေမယ့် screen ပေါ်မှာ မပြောင်းဘူး

အပေါ်က ဥပမာတွေမှာ `position` object ကို cursor ရဲ့ လက်ရှိ နေရာကနေ အသစ် အမြဲ ဖန်တီးနေပါတယ်။ ဒါပေမယ့် — မကြာခဏဆိုသလို သင်ဖန်တီးနေတဲ့ object အသစ်ထဲမှာ ရှိပြီးသား data တွေကိုပါ ထည့်သွင်းချင်ပါလိမ့်မယ်။ ဥပမာ — form ထဲက field တစ်ခုကိုပဲ update လုပ်ချင်ပေမယ့် ကျန်တဲ့ field တွေရဲ့ တန်ဖိုးဟောင်းတွေကို ဆက်ထိန်းထားချင်တာမျိုးပါ။

ဒီ input fields တွေ အလုပ်မလုပ်တာက `onChange` handlers တွေက state ကို mutate လုပ်လို့ပါ:

```tsx
import { create } from 'zustand'

type PersonStoreState = {
  firstName: string
  lastName: string
  email: string
}

type PersonStoreActions = {
  setPerson: (nextPerson: Partial<PersonStoreState>) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  firstName: 'Barbara',
  lastName: 'Hepworth',
  email: 'bhepworth@sculpture.com',
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.firstName = e.target.value
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.lastName = e.target.value
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    person.email = e.target.value
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```

ဥပမာ — ဒီ line က render ဟောင်းတစ်ခုကနေ state ကို mutate လုပ်နေပါတယ်:

```tsx
person.firstName = e.target.value
```

သင်လိုချင်တဲ့ အပြုအမူကို ရဖို့ ယုံကြည်စိတ်ချရတဲ့ နည်းကတော့ — object အသစ်တစ်ခု ဖန်တီးပြီး `setPerson` ကို ပေးလိုက်တာပါ။ ဒါပေမယ့် field တစ်ခုတည်းပဲ ပြောင်းတာမို့ — ရှိပြီးသား data တွေကိုလည်း object အသစ်ထဲကို copy လုပ်ဖို့ လိုပါတယ်:

```ts
setPerson({ ...person, firstName: e.target.value }) // input ကနေ ရတဲ့ first name အသစ်
```

> **မှတ်ချက်:** `set` function က default အားဖြင့် shallow merge လုပ်ပေးတာမို့ — property တစ်ခုချင်းစီကို သပ်သပ်စီ copy လုပ်စရာ မလိုပါဘူး။

အခုတော့ form အလုပ်လုပ်ပါပြီ။

Input field တစ်ခုချင်းစီအတွက် state variable သပ်သပ်စီ ကြေညာထားတာ မဟုတ်တာကို သတိထားကြည့်ပါ။ Form ကြီးတွေအတွက် — data အားလုံးကို object တစ်ခုထဲမှာ စုထားတာ အဆင်ပြေလွန်းပါတယ် — update ကို မှန်ကန်စွာ လုပ်တတ်သရွေ့ပေါ့!

```tsx
import { create } from 'zustand'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state.person)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, firstName: e.target.value })
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, lastName: e.target.value })
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, email: e.target.value })
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```
