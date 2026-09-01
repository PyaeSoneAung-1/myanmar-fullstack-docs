---
title: "createStore (Vanilla Store ဖန်တီးခြင်း)"
description: "createStore API နဲ့ vanilla store ဖန်တီးနည်း၊ state update လုပ်နည်းများနဲ့ state updates တွေကို subscribe လုပ်ခြင်း"
order: 10
source: "https://zustand.docs.pmnd.rs/reference/apis/create-store"
status: translated
updated: 2026-09-01
---

`createStore` က API utilities တွေ ပါဝင်တဲ့ vanilla store တစ်ခုကို ဖန်တီးပေးပါတယ်။

```js
const someStore = createStore(stateCreatorFn)
```

## Types

### Signature

```ts
createStore<T>()(stateCreatorFn: StateCreator<T, [], []>): StoreApi<T>
```

## Reference

### `createStore(stateCreatorFn)`

#### Parameters

- `stateCreatorFn`: `set` function, `get` function နဲ့ `store` ကို argument အဖြစ် လက်ခံတဲ့ function တစ်ခုပါ။ အများအားဖြင့် သင်ထုတ်ပြချင်တဲ့ (expose) method တွေပါတဲ့ object ကို ပြန်ပေးပါလိမ့်မယ်။ `set`, `get` နဲ့ `store` တို့က ဒီ function အလုပ်လုပ်နေတုန်းမှာ သုံးလို့ မရဘဲ — store ဖန်တီးပြီးမှသာ သုံးလို့ရတယ်ဆိုတာ သတိပြုပါ။

#### Returns

`createStore` က API utilities တွေဖြစ်တဲ့ `setState`, `getState`, `getInitialState` နဲ့ `subscribe` တို့ ပါဝင်တဲ့ vanilla store တစ်ခုကို ပြန်ပေးပါတယ်။

## Usage

### Previous state ကို အခြေခံပြီး state update လုပ်ခြင်း

ဒီဥပမာက **actions** တွေထဲမှာ **updater functions** တွေကို ဘယ်လို ထောက်ပံ့ပေးနိုင်တယ်ဆိုတာကို ပြပါတယ်။

```tsx
import { createStore } from 'zustand/vanilla'

type AgeStoreState = { age: number }

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState['age']
      | ((currentAge: AgeStoreState['age']) => AgeStoreState['age']),
  ) => void
}

type AgeStore = AgeStoreState & AgeStoreActions

const ageStore = createStore<AgeStore>()((set) => ({
  age: 42,
  setAge: (nextAge) =>
    set((state) => ({
      age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
    })),
}))

function increment() {
  ageStore.getState().setAge((currentAge) => currentAge + 1)
}

const $yourAgeHeading = document.getElementById(
  'your-age',
) as HTMLHeadingElement
const $incrementBy3Button = document.getElementById(
  'increment-by-3',
) as HTMLButtonElement
const $incrementBy1Button = document.getElementById(
  'increment-by-1',
) as HTMLButtonElement

$incrementBy3Button.addEventListener('click', () => {
  increment()
  increment()
  increment()
})

$incrementBy1Button.addEventListener('click', () => {
  increment()
})

const render: Parameters<typeof ageStore.subscribe>[0] = (state) => {
  $yourAgeHeading.innerHTML = `Your age: ${state.age}`
}

render(ageStore.getInitialState(), ageStore.getInitialState())

ageStore.subscribe(render)
```

ဒီမှာ `html` code ပါ —

```html
<h1 id="your-age"></h1>
<button id="increment-by-3" type="button">+3</button>
<button id="increment-by-1" type="button">+1</button>
```

### State ထဲက Primitive တွေ update လုပ်ခြင်း

State က JavaScript ရဲ့ ဘယ်လို value အမျိုးအစားကိုမဆို သိမ်းထားနိုင်ပါတယ်။ number, string, boolean စတဲ့ built-in primitive value တွေကို update လုပ်ချင်တဲ့အခါ — update တွေ မှန်ကန်စွာ အလုပ်လုပ်ပြီး မမျှော်လင့်တဲ့ အပြုအမူတွေ မဖြစ်အောင် တန်ဖိုးအသစ်ကို တိုက်ရိုက် assign လုပ်သင့်ပါတယ်။

> **မှတ်ချက်:** Default အားဖြင့် `set` function က shallow merge လုပ်ပေးပါတယ်။ State တစ်ခုလုံးကို state အသစ်နဲ့ လုံးဝ အစားထိုးချင်ရင်တော့ `replace` parameter ကို `true` ဆိုပြီး သတ်မှတ်ပါ။

```ts
import { createStore } from 'zustand/vanilla'

type XStore = number

const xStore = createStore<XStore>()(() => 0)

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  xStore.setState(event.clientX, true)
})

const render: Parameters<typeof xStore.subscribe>[0] = (x) => {
  $dot.style.transform = `translate(${x}px, 0)`
}

render(xStore.getInitialState(), xStore.getInitialState())

xStore.subscribe(render)
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

### State ထဲက Objects တွေ update လုပ်ခြင်း

JavaScript မှာ objects တွေက **mutable** (ပြောင်းလဲလို့ရတဲ့) ဖြစ်ပေမယ့် — state ထဲမှာ သိမ်းတဲ့အခါ **immutable** (မပြောင်းလဲသော) အနေနဲ့ သဘောထားသင့်ပါတယ်။ Object တစ်ခုကို update လုပ်ချင်ရင် object အသစ်တစ်ခု ဖန်တီးပြီး (သို့မဟုတ် ရှိပြီးသား object ကို copy လုပ်ပြီး) state ကို object အသစ်နဲ့ set လုပ်ရပါမယ်။

Default အားဖြင့် `set` function က shallow merge လုပ်ပေးပါတယ်။ သီးခြား property တချို့ကိုပဲ ပြုပြင်ဖို့လိုတဲ့ update အများစုအတွက် — default shallow merge က ပိုပြီး efficient ဖြစ်လို့ ဦးစားပေး သုံးသင့်ပါတယ်။ State တစ်ခုလုံးကို အသစ်နဲ့ လုံးဝ အစားထိုးချင်ရင်တော့ `replace` parameter ကို `true` ဆိုပြီး သတိထား သုံးပါ — ဘာလို့လဲဆိုတော့ state ထဲက ရှိပြီးသား nested data တွေ အားလုံး ပျောက်သွားလို့ပါ။

```ts
import { createStore } from 'zustand/vanilla'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))

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

### State ထဲက Arrays တွေ update လုပ်ခြင်း

JavaScript မှာ arrays တွေက mutable ဖြစ်ပေမယ့် — state ထဲမှာ သိမ်းတဲ့အခါ immutable အနေနဲ့ သဘောထားသင့်ပါတယ်။ Objects တွေလိုပဲ — state ထဲမှာ သိမ်းထားတဲ့ array တစ်ခုကို update လုပ်ချင်ရင် array အသစ် ဖန်တီးပြီး (သို့မဟုတ် ရှိပြီးသားကို copy လုပ်ပြီး) state ကို array အသစ်နဲ့ set လုပ်ရပါမယ်။

Default အားဖြင့် `set` function က shallow merge လုပ်ပေးပါတယ်။ Array value တွေကို update လုပ်ဖို့ — update တွေ မှန်ကန်စွာ အလုပ်လုပ်ပြီး မမျှော်လင့်တဲ့ အပြုအမူတွေ မဖြစ်အောင် တန်ဖိုးအသစ်တွေကို assign လုပ်သင့်ပါတယ်။ State တစ်ခုလုံးကို အသစ်နဲ့ လုံးဝ အစားထိုးချင်ရင်တော့ `replace` parameter ကို `true` ဆိုပြီး သတ်မှတ်ပါ။

> **အရေးကြီး:** Immutable operation တွေကို ဦးစားပေး သုံးသင့်ပါတယ် — `[...array]`, `concat(...)`, `filter(...)`, `slice(...)`, `map(...)`, `toSpliced(...)`, `toSorted(...)`, `toReversed(...)` စတာတွေပေါ့။ `array[arrayIndex] = ...`, `push(...)`, `unshift(...)`, `pop(...)`, `shift(...)`, `splice(...)`, `reverse(...)`, `sort(...)` စတဲ့ mutable operation တွေကိုတော့ ရှောင်ကြဉ်ပါ။

```ts
import { createStore } from 'zustand/vanilla'

type PositionStore = [number, number]

const positionStore = createStore<PositionStore>()(() => [0, 0])

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.setState([event.clientX, event.clientY], true)
})

const render: Parameters<typeof positionStore.subscribe>[0] = ([x, y]) => {
  $dot.style.transform = `translate(${x}px, ${y}px)`
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

### State update တွေကို subscribe လုပ်ခြင်း

State update တွေကို subscribe လုပ်ခြင်းအားဖြင့် — store ရဲ့ state update ဖြစ်တိုင်း အလုပ်လုပ်တဲ့ callback တစ်ခုကို register လုပ်လိုက်တာပါ။ External state management အတွက် `subscribe` ကို သုံးနိုင်ပါတယ်။

```ts
import { createStore } from 'zustand/vanilla'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))

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

positionStore.subscribe(render)

const logger: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  console.log('new position', { position: state.position })
}

positionStore.subscribe(logger)
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

### State ကို update လုပ်ပြီးပေမယ့် screen ပေါ်မှာ မပြောင်းဘူး

အပေါ်က ဥပမာတွေမှာ `position` object ကို cursor ရဲ့ လက်ရှိ နေရာကနေ အသစ် အမြဲ ဖန်တီးနေပါတယ်။ ဒါပေမယ့် — မကြာခဏဆိုသလို သင်ဖန်တီးနေတဲ့ object အသစ်ထဲမှာ ရှိပြီးသား data တွေကိုပါ ထည့်သွင်းချင်ပါလိမ့်မယ်။ ဥပမာ — form ထဲက field တစ်ခုကိုပဲ update လုပ်ချင်ပေမယ့် ကျန်တဲ့ field တွေရဲ့ တန်ဖိုးဟောင်းတွေကို ဆက်ထိန်းထားချင်တာမျိုးပါ။

ဒီ input fields တွေ အလုပ်မလုပ်တာက `oninput` handlers တွေက state ကို mutate လုပ်လို့ပါ:

```ts
import { createStore } from 'zustand/vanilla'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (person) => set({ person }),
}))

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.getState().person.firstName = (event.target as any).value
}

function handleLastNameChange(event: Event) {
  personStore.getState().person.lastName = (event.target as any).value
}

function handleEmailChange(event: Event) {
  personStore.getState().person.email = (event.target as any).value
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (state) => {
  $firstNameInput.value = state.person.firstName
  $lastNameInput.value = state.person.lastName
  $emailInput.value = state.person.email

  $result.innerHTML = `${state.person.firstName} ${state.person.lastName} (${state.person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```

ဒီမှာ `html` code ပါ —

```html
<label style="display: block">
  First name:
  <input id="first-name" />
</label>
<label style="display: block">
  Last name:
  <input id="last-name" />
</label>
<label style="display: block">
  Email:
  <input id="email" />
</label>
<p id="result"></p>
```

ဥပမာ — ဒီ line က render ဟောင်းတစ်ခုကနေ state ကို mutate လုပ်နေပါတယ်:

```ts
personStore.getState().firstName = (e.target as any).value
```

သင်လိုချင်တဲ့ အပြုအမူကို ရဖို့ ယုံကြည်စိတ်ချရတဲ့ နည်းကတော့ — object အသစ်တစ်ခု ဖန်တီးပြီး `setPerson` ကို ပေးလိုက်တာပါ။ ဒါပေမယ့် field တစ်ခုတည်းပဲ ပြောင်းတာမို့ — ရှိပြီးသား data တွေကိုလည်း object အသစ်ထဲကို copy လုပ်ဖို့ လိုပါတယ်:

```ts
personStore.getState().setPerson({
  firstName: e.target.value, // input ကနေ ရတဲ့ first name အသစ်
})
```

> **မှတ်ချက်:** `set` function က default အားဖြင့် shallow merge လုပ်ပေးတာမို့ — property တစ်ခုချင်းစီကို သပ်သပ်စီ copy လုပ်စရာ မလိုပါဘူး။

အခုတော့ form အလုပ်လုပ်ပါပြီ။

Input field တစ်ခုချင်းစီအတွက် state variable သပ်သပ်စီ ကြေညာထားတာ မဟုတ်တာကို သတိထားကြည့်ပါ။ Form ကြီးတွေအတွက် — data အားလုံးကို object တစ်ခုထဲမှာ စုထားတာ အဆင်ပြေလွန်းပါတယ် — update ကို မှန်ကန်စွာ လုပ်တတ်သရွေ့ပေါ့!

```ts
import { createStore } from 'zustand/vanilla'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (person) => set({ person }),
}))

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    firstName: (event.target as any).value,
  })
}

function handleLastNameChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    lastName: (event.target as any).value,
  })
}

function handleEmailChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    email: (event.target as any).value,
  })
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (state) => {
  $firstNameInput.value = state.person.firstName
  $lastNameInput.value = state.person.lastName
  $emailInput.value = state.person.email

  $result.innerHTML = `${state.person.firstName} ${state.person.lastName} (${state.person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```
