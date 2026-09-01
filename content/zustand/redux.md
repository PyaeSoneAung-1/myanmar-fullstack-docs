---
title: "redux (Actions နဲ့ Reducers သုံး၍ Store Update လုပ်ခြင်း)"
description: "redux middleware နဲ့ redux ပုံစံအတိုင်း actions နဲ့ reducers တွေကနေ store ကို update လုပ်နည်း — reducerFn, initialState နဲ့ dispatch"
order: 19
source: "https://zustand.docs.pmnd.rs/reference/middlewares/redux"
status: translated
updated: 2026-09-01
---

`redux` middleware က redux လိုပဲ — actions နဲ့ reducers တွေကနေ store ကို update လုပ်ခွင့်ပေးပါတယ်။

```js
const nextStateCreatorFn = redux(reducerFn, initialState)
```

## Types

### Signature

```ts
redux<T, A extends { type: string }>(reducerFn: (state: T, action: A) => T, initialState: T): StateCreator<T & { dispatch: (action: A) => A }, [['zustand/redux', A]], []>
```

### Mutator

```ts
;['zustand/redux', A]
```

## Reference

### `redux(reducerFn, initialState)`

#### Parameters

- `reducerFn`: Pure (ဘေးထွက်သက်ရောက်မှု မရှိတဲ့) function ဖြစ်ရပါမယ်။ သင့် application ရဲ့ လက်ရှိ state နဲ့ action object တစ်ခုကို argument အဖြစ် လက်ခံပြီး — action ကို အသုံးချလိုက်တဲ့ ရလဒ်ကြောင့် ဖြစ်ပေါ်လာတဲ့ state အသစ်ကို ပြန်ပေးပါတယ်။
- `initialState`: State ရဲ့ ကနဦး (initial) တန်ဖိုးပါ။ Function မဟုတ်တဲ့ ဘယ် type ရဲ့ value မဆို ဖြစ်နိုင်ပါတယ်။

#### Returns

`redux` က state creator function တစ်ခုကို ပြန်ပေးပါတယ်။

## Usage

### Actions နဲ့ reducers တွေကနေ state update လုပ်ခြင်း

```ts
import { createStore } from 'zustand/vanilla'
import { redux } from 'zustand/middleware'

type PersonStoreState = {
  firstName: string
  lastName: string
  email: string
}

type PersonStoreAction =
  | { type: 'person/setFirstName'; firstName: string }
  | { type: 'person/setLastName'; lastName: string }
  | { type: 'person/setEmail'; email: string }

type PersonStore = PersonStoreState & {
  dispatch: (action: PersonStoreAction) => PersonStoreAction
}

const personStoreReducer = (
  state: PersonStoreState,
  action: PersonStoreAction,
) => {
  switch (action.type) {
    case 'person/setFirstName': {
      return { ...state, firstName: action.firstName }
    }
    case 'person/setLastName': {
      return { ...state, lastName: action.lastName }
    }
    case 'person/setEmail': {
      return { ...state, email: action.email }
    }
    default: {
      return state
    }
  }
}

const personStoreInitialState: PersonStoreState = {
  firstName: 'Barbara',
  lastName: 'Hepworth',
  email: 'bhepworth@sculpture.com',
}

const personStore = createStore<PersonStore>()(
  redux(personStoreReducer, personStoreInitialState),
)

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.dispatch({
    type: 'person/setFirstName',
    firstName: (event.target as any).value,
  })
}

function handleLastNameChange(event: Event) {
  personStore.dispatch({
    type: 'person/setLastName',
    lastName: (event.target as any).value,
  })
}

function handleEmailChange(event: Event) {
  personStore.dispatch({
    type: 'person/setEmail',
    email: (event.target as any).value,
  })
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (person) => {
  $firstNameInput.value = person.firstName
  $lastNameInput.value = person.lastName
  $emailInput.value = person.email

  $result.innerHTML = `${person.firstName} ${person.lastName} (${person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```

ဒီမှာ `html` code က ဒီလိုပါ

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

## Troubleshooting

TBD
