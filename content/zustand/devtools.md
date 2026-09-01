---
title: "devtools (Time-Travel Debugging)"
description: "devtools middleware နဲ့ Redux DevTools ကို Redux မလိုဘဲ သုံးပြီး store ကို debug လုပ်နည်း — actionsDenylist, cleanup နဲ့ troubleshooting"
order: 15
source: "https://zustand.docs.pmnd.rs/reference/middlewares/devtools"
status: translated
updated: 2026-09-01
---

`devtools` middleware က [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) ကို Redux မလိုဘဲ သုံးခွင့်ပေးပါတယ်။ Debugging အတွက် [Redux DevTools သုံးခြင်းရဲ့ အကျိုးကျေးဇူးတွေ](https://redux.js.org/style-guide/#use-the-redux-devtools-extension-for-debugging) အကြောင်း ဆက်ဖတ်ကြည့်ပါ။

> **အရေးကြီး:** `zustand/middleware` ကနေ `devtools` ကို သုံးဖို့ — `@redux-devtools/extension` library ကို install လုပ်ထားဖို့ လိုပါတယ်။

```js
const nextStateCreatorFn = devtools(stateCreatorFn, devtoolsOptions)
```

## Types

### Signature

```ts
devtools<T>(stateCreatorFn: StateCreator<T, [], []>, devtoolsOptions?: DevtoolsOptions): StateCreator<T, [['zustand/devtools', never]], []>
```

### Mutator

```ts
;['zustand/devtools', never]
```

## Reference

### `devtools(stateCreatorFn, devtoolsOptions)`

#### Parameters

- `stateCreatorFn`: `set` function, `get` function နဲ့ `store` ကို argument အဖြစ် လက်ခံတဲ့ function တစ်ခုပါ။ အများအားဖြင့် သင်ထုတ်ပြချင်တဲ့ (expose) method တွေပါတဲ့ object ကို ပြန်ပေးပါလိမ့်မယ်။
- **optional** `devtoolsOptions`: `Redux Devtools` ရဲ့ options တွေကို သတ်မှတ်ဖို့ object တစ်ခုပါ။
  - **optional** `name`: Redux DevTools ထဲက connection အတွက် စိတ်ကြိုက် identifier တစ်ခုပါ။
  - **optional** `enabled`: Development mode မှာ default အားဖြင့် `true` ဖြစ်ပြီး — production mode မှာတော့ `false` ဖြစ်ပါတယ်။ ဒီ store အတွက် Redux DevTools integration ကို ဖွင့်/ပိတ် လုပ်ပေးပါတယ်။
  - **optional** `anonymousActionType`: Default အားဖြင့် inferred လုပ်ထားတဲ့ action type (မရရှိနိုင်ရင် `anonymous`) ကို သုံးပါတယ်။ Redux DevTools ထဲမှာ anonymous mutations တွေအတွက် action type အဖြစ် သုံးမယ့် string တစ်ခုပါ။
  - **optional** `store`: Redux DevTools ထဲမှာ store အတွက် စိတ်ကြိုက် identifier တစ်ခုပါ။
  - **optional** `actionsDenylist`: Redux DevTools ကနေ ဘယ် actions တွေကို စစ်ထုတ် (filter out) သင့်လဲ သတ်မှတ်တဲ့ string တစ်ခု ဒါမှမဟုတ် string array (regex patterns) ပါ။ ဒီ option ကို filtering လုပ်ဖို့ Redux DevTools ဆီကို တိုက်ရိုက် ပေးပို့ပါတယ်။ ဥပမာ — `['secret.*']` က "secret" နဲ့ စတင်တဲ့ actions အားလုံးကို စစ်ထုတ်ပါလိမ့်မယ်။

#### Returns

`devtools` က state creator function တစ်ခုကို ပြန်ပေးပါတယ်။

## Usage

### Store တစ်ခုကို debug လုပ်ခြင်း

ဒီဥပမာက `Redux Devtools` ကို သုံးပြီး store တစ်ခုကို ဘယ်လို debug လုပ်နိုင်တယ်ဆိုတာကို ပြပါတယ်

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type JungleStore = {
  bears: number
  addBear: () => void
  fishes: number
  addFish: () => void
}

const useJungleStore = create<JungleStore>()(
  devtools((set) => ({
    bears: 0,
    addBear: () =>
      set((state) => ({ bears: state.bears + 1 }), undefined, 'jungle/addBear'),
    fishes: 0,
    addFish: () =>
      set(
        (state) => ({ fishes: state.fishes + 1 }),
        undefined,
        'jungle/addFish',
      ),
  })),
)
```

### Slices pattern အခြေခံတဲ့ store တစ်ခုကို debug လုပ်ခြင်း

ဒီဥပမာက `Redux Devtools` ကို သုံးပြီး Slices pattern အခြေခံတဲ့ store တစ်ခုကို ဘယ်လို debug လုပ်နိုင်တယ်ဆိုတာကို ပြပါတယ်

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () =>
    set(
      (state) => ({ bears: state.bears + 1 }),
      undefined,
      'jungle:bear/addBear',
    ),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () =>
    set(
      (state) => ({ fishes: state.fishes + 1 }),
      undefined,
      'jungle:fish/addFish',
    ),
})

const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  })),
)
```

### actionsDenylist နဲ့ actions တွေကို စစ်ထုတ်ခြင်း

`actionsDenylist` option ကို သုံးပြီး Redux DevTools ကနေ သီးခြား actions တွေကို စစ်ထုတ်နိုင်ပါတယ်။ Internal ဒါမှမဟုတ် ထိခိုက်နိုင်ခြေရှိတဲ့ (sensitive) actions တွေကို DevTools timeline ကနေ ဝှက်ထားချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Store = {
  user: string | null
  token: string | null
  login: (user: string, token: string) => void
  logout: () => void
  updateData: () => void
}

const useStore = create<Store>()(
  devtools(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }, undefined, 'auth/login'),
      logout: () => set({ user: null, token: null }, undefined, 'auth/logout'),
      updateData: () =>
        set({ user: 'updated' }, undefined, 'internal/updateData'),
    }),
    {
      name: 'AuthStore',
      // ဒီ regex patterns တွေနဲ့ ကိုက်ညီတဲ့ actions တွေကို စစ်ထုတ်ပါ
      actionsDenylist: ['internal/.*'], // 'internal/*' actions အားလုံးကို ဝှက်ပေးပါတယ်
    },
  ),
)
```

Regex string တစ်ခုတည်းကိုလည်း သုံးလို့ရပါတယ်:

```ts
const useStore = create<Store>()(
  devtools(
    (set) => ({
      // ... state နဲ့ actions
    }),
    {
      name: 'MyStore',
      actionsDenylist: 'secret.*', // 'secret' နဲ့ စတင်တဲ့ actions တွေအားလုံးကို ဝှက်ပေးပါတယ်
    },
  ),
)
```

> **မှတ်ချက်:** `actionsDenylist` option က regex pattern matching ကို သုံးပြီး — Redux DevTools Extension က ကိုယ်တိုင် ကိုင်တွယ်ပါတယ်။ Actions အားလုံးကို DevTools ဆီ ပို့ဆဲ ပို့ပါတယ်၊ ဒါပေမယ့် ကိုက်ညီတဲ့ actions တွေကိုတော့ display ကနေ စစ်ထုတ်လိုက်တာပါ။

### Cleanup (ရှင်းလင်းခြင်း)

Store တစ်ခု မလိုအပ်တော့တဲ့အခါ — store ပေါ်က `cleanup` method ကို ခေါ်ပြီး Redux DevTools connection ကို ရှင်းလင်းနိုင်ပါတယ်:

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  })),
)

// store သုံးပြီးသွားရင် cleanup လုပ်ပါ
useStore.devtools.cleanup()
```

ဒါက — store ကို context ထဲမှာ wrap လုပ်ထားတဲ့ ဒါမှမဟုတ် stores အများကြီးကို dynamically ဖန်တီးနေတဲ့ applications တွေမှာ အထူးသဖြင့် အသုံးဝင်ပါတယ်။

## Troubleshooting

### Store တစ်ခုတည်းပဲ ပြနေတယ်

Default အားဖြင့် `Redux Devtools` က တစ်ကြိမ်မှာ store တစ်ခုကိုပဲ ပြပါတယ် — ဒါကြောင့် တခြား stores တွေကို မြင်ချင်ရင် store selector ကို သုံးပြီး တခြား store တစ်ခုကို ရွေးရပါမယ်။

### Action names တွေအားလုံးကို 'anonymous' ဆိုပြီး label တက်နေတယ်

Action type name ပေးမထားဘူးဆိုရင် — "anonymous" ဆိုပြီး default ဖြစ်သွားပါတယ်။ ဒီ default တန်ဖိုးကို `anonymousActionType` parameter ပေးပြီး စိတ်ကြိုက် ပြောင်းလဲနိုင်ပါတယ်:

ဥပမာ — အောက်က ဥပမာမှာ action type name မပါပါဘူး:

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  })),
)
```

အပေါ်က ဥပမာကို ဖြေရှင်းဖို့ — တတိယ parameter အနေနဲ့ action type name တစ်ခု ပေးဖို့ လိုပါတယ်။ ဒါ့အပြင် — replacement logic ရဲ့ default အပြုအမူကို ထိန်းသိမ်းဖို့ ဒုတိယ parameter ကို `undefined` ဆိုပြီး သတ်မှတ်ထားဖို့ လိုပါတယ်။

ဒီမှာ ပြုပြင်ပြီးသား ဥပမာ ဖြစ်ပါတယ်

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () =>
    set((state) => ({ bears: state.bears + 1 }), undefined, 'bear/addBear'),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () =>
    set((state) => ({ fishes: state.fishes + 1 }), undefined, 'fish/addFish'),
})

const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  })),
)
```

> **အရေးကြီး:** Default replacement logic ကို ပြောင်းလဲဖို့ မရည်ရွယ်ဘူးဆိုရင် — ဒုတိယ parameter ကို `true` ဒါမှမဟုတ် `false` ဆိုပြီး မသတ်မှတ်ပါနဲ့။
