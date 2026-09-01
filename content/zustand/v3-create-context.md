---
title: "zustand/context ရဲ့ createContext (v3)"
description: "zustand/context ကနေ v3.5 မှာ စတင်ပေးထားတဲ့ createContext — Provider နဲ့ useStore ကို သုံးပြီး store hook ကို အလွဲသုံးစားလုပ်တာ ရှောင်ခြင်း၊ component အလိုက် store အသစ် ဖန်တီးခြင်း၊ props ကနေ initialize လုပ်ခြင်းနဲ့ v4 API ကို ပြောင်းရွှေ့နည်း"
order: 25
source: "https://zustand.docs.pmnd.rs/reference/previous-versions/zustand-v3-create-context"
status: translated
updated: 2026-09-01
---

`zustand/context` ကနေ ပေးထားတဲ့ အထူး `createContext` တစ်ခုက v3.5 ကတည်းက ရှိခဲ့ပါတယ် — store hook ကို အလွဲသုံးစား လုပ်တာတွေကို ရှောင်ရှားပေးဖို့ပါ။

> **မှတ်ချက်:** ဒီ function က v4 မှာ deprecated ဖြစ်ပြီး — v5 မှာ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။ [Migration](#migration) ကို ကြည့်ပါ။

```jsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
```

## Real components တွေမှာ createContext သုံးခြင်း

```jsx
import create from "zustand";
import createContext from "zustand/context";

// Best practice: You can move the below createContext() and createStore to a separate file(store.js) and import the Provider, useStore here/wherever you need.

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 })
  }));

const Button = () => {
  return (
      {/** store() - This will create a store for each time using the Button component instead of using one store for all components **/}
    <Provider createStore={createStore}>
      <ButtonChild />
    </Provider>
  );
};

const ButtonChild = () => {
  const state = useStore();
  return (
    <div>
      {state.bears}
      <button
        onClick={() => {
          state.increasePopulation();
        }}
      >
        +
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Button />
      <Button />
    </div>
  );
}
```

## Props တွေကနေ initialization လုပ်ပြီး createContext သုံးခြင်း

```tsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

export default function App({ initialBears }) {
  return (
    <Provider
      createStore={() =>
        create((set) => ({
          bears: initialBears,
          increase: () => set((state) => ({ bears: state.bears + 1 })),
        }))
      }
    >
      <Button />
    </Provider>
  )
}
```

## Migration

ဆွေးနွေးချက်: https://github.com/pmndrs/zustand/discussions/1276

ဒီကတော့ v4 API နဲ့ context သုံးနည်း အသစ်ပါ။

```jsx
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
  const storeRef = useRef()
  if (storeRef.current === null) {
    storeRef.current = createStore((set) => ({
      // ...
    }))
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

const useStoreInContext = (selector) => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('Missing StoreProvider')
  }
  return useStore(store, selector)
}
```

ဒါမှမဟုတ် — Zustand v3 နဲ့ ဆင်တဲ့ API တွေကို ပေးတဲ့ third-party libraries တချို့ကို ဆက်သွယ် သုံးနိုင်ပါတယ်:

- <https://github.com/charkour/zustand-di>
- <https://github.com/arvinxx/zustand-utils>
