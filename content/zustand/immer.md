---
title: "Immer Middleware"
description: "immer middleware နဲ့ draft ကို mutate လုပ်ပြီး immutable update လုပ်ခြင်း — nested state ရိုးရှင်းအောင် လုပ်နည်းနဲ့ middleware တွေနဲ့ ပေါင်းသုံးခြင်း"
order: 7
source: "https://zustand.docs.pmnd.rs/middlewares/immer"
status: translated
updated: 2026-09-01
---

## Immer Middleware ဆိုတာ ဘာလဲ

**Immer** က immutable state update တွေကို ပိုအဆင်ပြေအောင် လုပ်ပေးတဲ့ library ဖြစ်ပြီး —
**immer** middleware က အဲဒီစွမ်းရည်ကို Zustand store ထဲမှာ တိုက်ရိုက် သုံးခွင့်ပေးပါတယ်။
သုံးဖို့ `immer` library ကို install လုပ်ထားဖို့ လိုပြီး — `zustand/middleware/immer` ကနေ
import လုပ်ရပါတယ် (`npm install immer`)။ Immer ရဲ့ လုပ်နည်းက — update logic ကို
mutating style နဲ့ ရေးခွင့်ပေးပြီး, နောက်ကွယ်မှာ immutable (မပြောင်းလဲနိုင်တဲ့) state အသစ်ကို
ထုတ်ပေးတာဖြစ်လို့ — Zustand ရဲ့ re-render detection တွေ ပုံမှန်အတိုင်း အလုပ်လုပ်ပါတယ်။

ရိုးရိုး Zustand မှာ nested state ကို update လုပ်ဖို့ — level တိုင်းကို spread operator `...`
နဲ့ ကိုယ်တိုင် copy လုပ်ရပါတယ်:

```js
import { createStore } from 'zustand/vanilla'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (
    nextPerson:
      | PersonStoreState['person']
      | ((person: PersonStoreState['person']) => PersonStoreState['person']),
  ) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (nextPerson) =>
    set((state) => ({
      person: typeof nextPerson === 'function' ? nextPerson(state.person) : nextPerson,
    })),
}))
```

`person` ရဲ့ field တစ်ခုပြောင်းဖို့တောင် `{ ...person, firstName: value }` လို copy တစ်ခုလုံး
ဆောက်နေရပါတယ် — object ပိုနက်လာလေလေ, ဒီပုံစံက ပိုရှည်ပြီး အမှားဖြစ်နိုင်ခြေ ပိုများလေလေပါ။

## Immer နဲ့ Update လုပ်ခြင်း (Mutating Draft)

`immer` middleware နဲ့ဆို — `set` ထဲမှာ draft ကို တိုက်ရိုက် mutate လုပ်လို့ရပါတယ်။
Immer က mutation တွေကို ခြေရာခံပြီး နောက်ကွယ်မှာ immutable state အသစ် တစ်ခုကို
ထုတ်ပေးပါတယ်:

```js
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (
    nextPerson:
      | PersonStoreState['person']
      | ((person: PersonStoreState['person']) => PersonStoreState['person']),
  ) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()(
  immer((set) => ({
    person: {
      firstName: 'Barbara',
      lastName: 'Hepworth',
      email: 'bhepworth@sculpture.com',
    },
    setPerson: (nextPerson) =>
      set((state) => {
        state.person = typeof nextPerson === 'function' ? nextPerson(state.person) : nextPerson
      }),
  })),
)
```

ပထမဥပမာနဲ့ ယှဉ်ကြည့်ရင် — spread နဲ့ copy လုပ်နေစရာ မလိုတော့ပါဘူး။ `set` ထဲက `state` က
real state မဟုတ်ဘဲ **draft** ဖြစ်ပြီး — `state.person = ...` လို mutate လုပ်လိုက်တာကိုပဲ
Immer က immutable update အဖြစ် ပြောင်းပေးပါတယ်။

## Nested State Update တွေမှာ ဘာလို့ ပိုလွယ်သလဲ

Deeply nested object တွေမှာ ဒီအားသာချက်က ပိုထင်ရှားပါတယ် — ဥပမာ `todos` စာရင်းထဲက
todo တစ်ခုရဲ့ `done` field ကို ပြောင်းတာမျိုး:

```js
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Todo {
  id: string
  title: string
  done: boolean
}

type State = {
  todos: Record<string, Todo>
}

type Actions = {
  toggleTodo: (todoId: string) => void
}

export const useTodoStore = create<State & Actions>()(
  immer((set) => ({
    todos: {
      '82471c5f-4207-4b1d-abcb-b98547e01a3e': {
        id: '82471c5f-4207-4b1d-abcb-b98547e01a3e',
        title: 'Learn Zustand',
        done: false,
      },
      '354ee16c-bfdd-44d3-afa9-e93679bda367': {
        id: '354ee16c-bfdd-44d3-afa9-e93679bda367',
        title: 'Learn Jotai',
        done: false,
      },
    },
    toggleTodo: (todoId: string) =>
      set((state) => {
        state.todos[todoId].done = !state.todos[todoId].done
      }),
  })),
)
```

`state.todos[todoId].done = !state.todos[todoId].done` — ဒါမျိုး deep update ကို မူရင်းပုံစံနဲ့
ရေးရင် `todos` ကစပြီး level တိုင်း spread လုပ်နေရမှာပါ။ Immer နဲ့ဆို draft ကို mutate
လုပ်ရုံမို့ — ဖတ်ရတာ လွယ်, ရေးရတာ တိုပြီး logic ကိုပဲ အာရုံစိုက်လို့ရပါတယ်။

## Middleware တွေနဲ့ ပေါင်းသုံးခြင်း

`immer` ကို `devtools`, `persist` စတဲ့ middleware တွေနဲ့လည်း တွဲသုံးလို့ရပါတယ် —
[Middleware သုံးခြင်း](/docs/zustand/middleware) မှာ မြင်ခဲ့သလို compose လုပ်တဲ့အခါ
`immer` က `set` ကို ပြုပြင်တဲ့ middleware ဖြစ်လို့ — အများအားဖြင့် အတွင်းဆုံးမှာ ထားပါတယ်:

```js
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  devtools(
    immer((set) => ({
      count: 0,
      inc: () =>
        set((state) => {
          state.count += 1
        }),
    })),
  ),
)
```

ဒီလိုဆို DevTools မှာ action တွေကို ကြည့်ရင်း, update လုပ်တဲ့အခါ Immer ရဲ့ draft mutation
အဆင်ပြေမှုကိုပါ တစ်ပြိုင်နက် ရပါတယ်။ သတိထားရမှာတစ်ခုက — Immer ကို သုံးတဲ့အခါ
[Immer ရဲ့ rules](https://immerjs.github.io/immer/pitfalls) တွေကို လိုက်နာဖို့ လိုပါတယ်
(ဥပမာ class object တွေအတွက် `[immerable]` သတ်မှတ်ပေးရတာမျိုး) — မလိုက်နာရင် Zustand က
state မပြောင်းဘူးလို့ ထင်ပြီး subscription တွေ မခေါ်တော့တာမျိုး ဖြစ်နိုင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Middleware သုံးခြင်း](/docs/zustand/middleware) — middleware တွေ ဘယ်လို အလုပ်လုပ်သလဲ
- [Persist Middleware](/docs/zustand/persist) — state ကို storage မှာ သိမ်းနည်း
- [State Update လုပ်ခြင်း](/docs/zustand/update-state) — `set()` နဲ့ update လုပ်ပုံ အခြေခံ
