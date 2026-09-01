---
title: "Immer Middleware (Immutable State ကို လွယ်ကူစွာ သုံးခြင်း)"
description: "immer middleware နဲ့ immutable state ကို ပိုအဆင်ပြေတဲ့ နည်းနဲ့ သုံးခြင်း — install လုပ်နည်း, simple/complex states update လုပ်နည်းနဲ့ gotchas"
order: 22
source: "https://zustand.docs.pmnd.rs/reference/integrations/immer-middleware"
status: translated
updated: 2026-09-01
---

[Immer](https://github.com/immerjs/immer) middleware က immutable state ကို ပိုပြီး အဆင်ပြေတဲ့ နည်းနဲ့ သုံးခွင့်ပေးပါတယ်။ ဒါ့အပြင် Immer နဲ့ဆို — Zustand ထဲမှာ immutable data structures တွေကို ကိုင်တွယ်တာကို ရိုးရှင်းအောင် လုပ်နိုင်ပါတယ်။

## Installation (တပ်ဆင်ခြင်း)

Zustand မှာ Immer middleware ကို သုံးဖို့ဆိုရင် — Immer ကို direct dependency အနေနဲ့ install လုပ်ထားဖို့ လိုပါတယ်။

```bash
npm install immer
```

## Usage (အသုံးပြုခြင်း)

(Type parameter ပြီးနောက်မှာ ထပ်တိုးထားတဲ့ parentheses တွေကို သတိထားကြည့်ပါ — [Advanced Typescript Guide](https://zustand.docs.pmnd.rs/learn/guides/advanced-typescript) မှာ ဖော်ပြထားတဲ့အတိုင်းပါ။)

### ရိုးရှင်းတဲ့ states တွေကို update လုပ်ခြင်း

```ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  count: number
}

type Actions = {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

export const useCountStore = create<State & Actions>()(
  immer((set) => ({
    count: 0,
    increment: (qty: number) =>
      set((state) => {
        state.count += qty
      }),
    decrement: (qty: number) =>
      set((state) => {
        state.count -= qty
      }),
  })),
)
```

### ရှုပ်ထွေးတဲ့ states တွေကို update လုပ်ခြင်း

```ts
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
      '771c85c5-46ea-4a11-8fed-36cc2c7be344': {
        id: '771c85c5-46ea-4a11-8fed-36cc2c7be344',
        title: 'Learn Valtio',
        done: false,
      },
      '363a4bac-083f-47f7-a0a2-aeeee153a99c': {
        id: '363a4bac-083f-47f7-a0a2-aeeee153a99c',
        title: 'Learn Signals',
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

## Gotchas (သတိထားရမယ့် အချက်များ)

ဒီ section မှာ Zustand ကို Immer နဲ့ သုံးတဲ့အခါ သတိထားရမယ့် အချက်တချို့ကို တွေ့ရမှာပါ။

### Subscriptions တွေကို မခေါ်ဖြစ်နေဘူး

Immer ကို သုံးနေတယ်ဆိုရင် — သင် [Immer ရဲ့ rules](https://immerjs.github.io/immer/pitfalls) တွေကို တကယ် လိုက်နာနေလားဆိုတာ သေချာစစ်ပါ။

ဥပမာ — [class objects](https://immerjs.github.io/immer/complex-objects) တွေ အလုပ်လုပ်ဖို့ `[immerable] = true` ကို ထည့်ပေးရပါတယ်။ ဒါကို မလုပ်ရင် — Immer က object ကို mutate လုပ်ဆဲ လုပ်မှာပါ — ဒါပေမယ့် proxy အနေနဲ့ မဟုတ်တာမို့ — လက်ရှိ state ကိုပါ update ဖြစ်သွားစေပါတယ်။ Zustand က state တကယ် ပြောင်းသွားလားဆိုတာ စစ်ပါတယ် — ဒါကြောင့် (မှန်ကန်စွာ မလုပ်ရင်) လက်ရှိ state နဲ့ နောက် state တို့ တူညီနေတာမို့ — Zustand က subscriptions တွေကို ခေါ်တာကို ကျော်သွားပါလိမ့်မယ်။

## Demos (သရုပ်ပြများ)

- Basic: https://stackblitz.com/edit/vitejs-vite-3sgc4ejy
- Advanced: https://stackblitz.com/edit/vitejs-vite-jxxtuyj3
