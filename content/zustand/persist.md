---
title: "Persist Middleware"
description: "persist middleware နဲ့ state ကို localStorage/sessionStorage မှာ သိမ်းခြင်း — partialize, name, onRehydrateStorage, skipHydration, version + migrate"
order: 6
source: "https://zustand.docs.pmnd.rs/middlewares/persist"
status: translated
updated: 2026-09-01
---

## Persist Middleware ဆိုတာ ဘာလဲ

**persist** middleware က store ရဲ့ state ကို storage ထဲမှာ သိမ်းပေးပြီး — page reload (သို့)
application restart လုပ်ပြီးတာတောင် state မပျောက်အောင် ကာကွယ်ပေးပါတယ်။ Default အားဖြင့်
`localStorage` ကို သုံးပြီး — `createJSONStorage(() => sessionStorage)` ပေးပြီး `sessionStorage`
ကိုလည်း ပြောင်းသုံးလို့ရပါတယ်။ Store ဖန်တီးတုန်း `persist(stateCreator, options)` နဲ့ wrap
လုပ်ရပြီး — options ထဲက `name` က မဖြစ်မနေ လိုအပ်ပါတယ် (storage ထဲက key အနေနဲ့ သုံးလို့
unique ဖြစ်ရပါမယ်)။

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBearStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
```

ဒီဥပမာမှာ `bears` state ကို `sessionStorage` ထဲ `food-storage` ဆိုတဲ့ key နဲ့ သိမ်းထားပါတယ်။
App ပြန်ဖွင့်တဲ့အခါ middleware က သိမ်းထားတဲ့ state ကို ပြန်ဖတ်ပြီး store ထဲ merge လုပ်ပေးပါတယ် —
ဒီလုပ်ငန်းစဉ်ကို **hydration** (rehydration) လို့ ခေါ်ပါတယ်။

## Partialize — သိမ်းမယ့် field တွေ ရွေးခြင်း

State တစ်ခုလုံး သိမ်းချင်မှ မဟုတ်ဘူးဆိုရင် `partialize` နဲ့ ဘယ် field တွေ သိမ်းမယ်ဆိုတာ
ရွေးလို့ရပါတယ် — ဥပမာ sensitive data တွေ, action function တွေကို storage ထဲ မထည့်ဘဲ
ချန်ထားတာမျိုးပါ။

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ bears: state.bears }),
    },
  ),
)
```

ဒီမှာ `bears` တစ်ခုတည်းကိုပဲ သိမ်းလို့ — `addABear` action က storage ထဲ မဝင်ပါဘူး။ State ထဲ
field အသစ် ထပ်ဖြည့်လာရင်လည်း `partialize` ကို ပြင်ရုံနဲ့ ဘာ field သိမ်းမလဲ ထိန်းချုပ်လို့ရပါတယ်။

## onRehydrateStorage — Hydration ကို စောင့်ကြည့်ခြင်း

`onRehydrateStorage` က hydration စတင်ချိန်နဲ့ ပြီးချိန်မှာ custom logic ထည့်ဖို့ ဖြစ်ပါတယ် —
function ကို ပေးပြီး (optional) function ကို ပြန်ပေးနိုင်ပါတယ်။ ပြန်ပေးတဲ့ function က
hydration ပြီးတဲ့အခါ — rehydrate လုပ်ထားတဲ့ state နဲ့ error (ရှိရင်) ကို လက်ခံပါတယ်:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'count-storage',
      onRehydrateStorage: (state) => {
        console.log('hydration starts')

        // optional
        return (state, error) => {
          if (error) {
            console.log('an error happened during hydration', error)
          } else {
            console.log('hydration finished')
          }
        }
      },
    },
  ),
)
```

ဒီလိုမျိုး hydration ဖြစ်ပြီးပြီလားဆိုတာ သိရတာမို့ — loading state တွေ ပြချင်ရင်, (သို့)
hydrate လုပ်တဲ့အခါ data ပျက်စီးနေတာကို ကိုင်တွယ်ချင်ရင် အသုံးဝင်ပါတယ်။

## Version + Migrate — Breaking Change ကိုင်တွယ်ခြင်း

State ရဲ့ ပုံစံ (shape) ကို ပြောင်းတဲ့ breaking change တွေအတွက် `version` နဲ့ `migrate` ကို
သုံးပါတယ်။ Storage ထဲက version နဲ့ code ထဲက version မတူရင် သိမ်းထားတဲ့ value ကို မသုံးတော့ဘဲ —
`migrate` က အဲဒီ data ကို နောက်ဆုံး version ပုံစံအဖြစ် ပြောင်းပေးနိုင်ပါတယ်:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      newField: 0, // let's say this field was named otherwise in version 0
    }),
    {
      name: 'food-storage',
      version: 1, // a migration will be triggered if the version in the storage mismatches this one
      migrate: (persistedState, version) => {
        if (version === 0) {
          // if the stored value is in version 0, we rename the field to the new name
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }

        return persistedState
      },
    },
  ),
)
```

ဒီဥပမာမှာ version 0 မှာ `oldField` ဆိုပြီး သိမ်းထားခဲ့တာကို version 1 မှာ `newField` ဆိုပြီး
ပြောင်းလိုက်တာမို့ — `migrate` က သိမ်းထားပြီးသား user data ကို ပြန်လည်တည့်မတ်ပေးပြီး
မပျက်အောင် ကာကွယ်ပါတယ်။

## skipHydration — Hydration ကို ကိုယ်တိုင် ထိန်းချုပ်ခြင်း

Server-side rendering (SSR) လို app မျိုးမှာ hydration အချိန်ကို ကိုယ်တိုင် ထိန်းချုပ်ချင်ရင် —
options ထဲ `skipHydration: true` ပေးထားပြီး ကိုယ့်အချိန်မှာ `useBoundStore.persist.rehydrate()` ကို
ခေါ်ပြီး manually hydrate လုပ်လို့ရပါတယ် (ဥပမာ component mount လုပ်ချိန်မှာ
`useEffect` ထဲက ခေါ်တာမျိုး)။ Default ကတော့ `false` ဖြစ်ပြီး — store စဖန်တီးတာနဲ့
အလိုအလျောက် hydration ဖြစ်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Immer Middleware](/docs/zustand/immer) — persist နဲ့ တွဲပြီး nested update တွေကို ရိုးရှင်းအောင် လုပ်နည်း
- [Middleware သုံးခြင်း](/docs/zustand/middleware) — middleware တွေ ဘယ်လို အလုပ်လုပ်သလဲ
- [Testing](/docs/zustand/testing) — store တွေကို ဘယ်လို test လုပ်မလဲ
