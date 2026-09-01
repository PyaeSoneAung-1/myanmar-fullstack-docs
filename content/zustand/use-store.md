---
title: "useStore (React မှာ Vanilla Store သုံးခြင်း)"
description: "useStore hook နဲ့ React မှာ vanilla store တွေကို သုံးနည်း — global, dynamic global, scoped နဲ့ dynamic scoped vanilla stores"
order: 13
source: "https://zustand.docs.pmnd.rs/reference/hooks/use-store"
status: translated
updated: 2026-09-01
---

`useStore` က React မှာ vanilla store တစ်ခုကို သုံးနိုင်အောင် လုပ်ပေးတဲ့ React Hook တစ်ခုပါ။

```js
const someState = useStore(store, selectorFn)
```

## Types

### Signature

```ts
useStore<T, U = T>(store: StoreApi<T>, selectorFn?: (state: T) => U): U
```

## Reference

### `useStore(store, selectorFn)`

#### Parameters

- `storeApi`: Store API utilities တွေကို သုံးခွင့်ပေးတဲ့ instance ပါ။
- `selectorFn`: လက်ရှိ state ကို အခြေခံတဲ့ data တွေကို ပြန်ပေးနိုင်တဲ့ function တစ်ခုပါ။

#### Returns

`useStore` က selector function ပေါ်မူတည်ပြီး လက်ရှိ state ကို အခြေခံတဲ့ data ဘာကိုမဆို ပြန်ပေးပါတယ်။ သူက argument တွေအဖြစ် store တစ်ခုနဲ့ selector function တစ်ခုကို လက်ခံပါတယ်။

## Usage

### React မှာ global vanilla store တစ်ခု သုံးခြင်း

ပထမဆုံး — screen ပေါ်မှာ dot ရဲ့ နေရာကို သိမ်းထားမယ့် store တစ်ခု ပြင်ဆင်ကြည့်ရအောင်။ `x` နဲ့ `y` coordinates တွေကို စီမံပြီး — အဲဒီ coordinates တွေကို update လုပ်ဖို့ action တစ်ခု ပါတဲ့ store ကို သတ်မှတ်ပါမယ်။

```tsx
type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))
```

နောက်တစ်ဆင့်မှာ — dot ကို ကိုယ်စားပြုတဲ့ div တစ်ခုကို render လုပ်တဲ့ `MovingDot` component တစ်ခု ဖန်တီးပါမယ်။ ဒီ component က dot ရဲ့ နေရာကို ခြေရာခံပြီး update လုပ်ဖို့ store ကို သုံးပါလိမ့်မယ်။

```tsx
function MovingDot() {
  const position = useStore(positionStore, (state) => state.position)
  const setPosition = useStore(positionStore, (state) => state.setPosition)

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

နောက်ဆုံးမှာ — `MovingDot` component ကို ကျွန်တော်တို့ရဲ့ `App` component ထဲမှာ render လုပ်ပါမယ်။

```tsx
export default function App() {
  return <MovingDot />
}
```

အပြည့်အစုံ code က ဒီလိုပုံစံ ဖြစ်သင့်ပါတယ်:

```tsx
import { createStore, useStore } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))

function MovingDot() {
  const position = useStore(positionStore, (state) => state.position)
  const setPosition = useStore(positionStore, (state) => state.setPosition)

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

export default function App() {
  return <MovingDot />
}
```

### React မှာ dynamic global vanilla stores တွေ သုံးခြင်း

ပထမဆုံး — counter state ကို စီမံဖို့ store တစ်ခုကို ထုတ်ပေးတဲ့ factory function တစ်ခု ဖန်တီးပါမယ်။ Tab တစ်ခုချင်းစီမှာ သူ့ကိုယ်ပိုင် store instance ရှိပါလိမ့်မယ်။

```ts
type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}
```

နောက်တစ်ဆင့်မှာ — counter stores တွေကို ဖန်တီးခြင်းနဲ့ ပြန်ယူခြင်းကို စီမံပေးတဲ့ factory function တစ်ခု ဖန်တီးပါမယ်။ ဒါက tab တစ်ခုချင်းစီမှာ သီးခြား counter တစ်ခုစီ ရှိစေပါတယ်။

```ts
const defaultCounterStores = new Map<
  string,
  ReturnType<typeof createCounterStore>
>()

const createCounterStoreFactory = (
  counterStores: typeof defaultCounterStores,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const getOrCreateCounterStoreByKey =
  createCounterStoreFactory(defaultCounterStores)
```

အခု — သုံးစွဲသူတွေ tab တွေကြားမှာ ပြောင်းလို့ရပြီး tab တစ်ခုချင်းစီရဲ့ counter ကို တိုးနိုင်တဲ့ `Tabs` component ကို ဆောက်ကြည့်ရအောင်။

```tsx
const [currentTabIndex, setCurrentTabIndex] = useState(0)
const counterState = useStore(
  getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`),
)

return (
  <div style={{ fontFamily: 'monospace' }}>
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid salmon',
        paddingBottom: 4,
      }}
    >
      <button
        type="button"
        style={{
          border: '1px solid salmon',
          backgroundColor: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setCurrentTabIndex(0)}
      >
        Tab 1
      </button>
      <button
        type="button"
        style={{
          border: '1px solid salmon',
          backgroundColor: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setCurrentTabIndex(1)}
      >
        Tab 2
      </button>
      <button
        type="button"
        style={{
          border: '1px solid salmon',
          backgroundColor: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setCurrentTabIndex(2)}
      >
        Tab 3
      </button>
    </div>
    <div style={{ padding: 4 }}>
      Content of Tab {currentTabIndex + 1}
      <br /> <br />
      <button type="button" onClick={() => counterState.increment()}>
        Count: {counterState.count}
      </button>
    </div>
  </div>
)
```

နောက်ဆုံးမှာ — tabs တွေနဲ့ သူတို့ရဲ့ counter တစ်ခုချင်းစီကို render လုပ်တဲ့ `App` component ကို ဖန်တီးပါမယ်။ Tab တစ်ခုချင်းစီအတွက် counter state ကို သီးခြား စီမံထားပါတယ်။

```tsx
export default function App() {
  return <Tabs />
}
```

အပြည့်အစုံ code က ဒီလိုပုံစံ ဖြစ်သင့်ပါတယ်:

```tsx
import { useState } from 'react'
import { createStore, useStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const defaultCounterStores = new Map<
  string,
  ReturnType<typeof createCounterStore>
>()

const createCounterStoreFactory = (
  counterStores: typeof defaultCounterStores,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const getOrCreateCounterStoreByKey =
  createCounterStoreFactory(defaultCounterStores)

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useStore(
    getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`),
  )

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid salmon',
          paddingBottom: 4,
        }}
      >
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(0)}
        >
          Tab 1
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(1)}
        >
          Tab 2
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(2)}
        >
          Tab 3
        </button>
      </div>
      <div style={{ padding: 4 }}>
        Content of Tab {currentTabIndex + 1}
        <br /> <br />
        <button type="button" onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}
```

### React မှာ scoped (non-global) vanilla store တစ်ခု သုံးခြင်း

ပထမဆုံး — screen ပေါ်မှာ dot ရဲ့ နေရာကို သိမ်းထားမယ့် store တစ်ခု ပြင်ဆင်ကြည့်ရအောင်။ `x` နဲ့ `y` coordinates တွေကို စီမံပြီး — အဲဒီ coordinates တွေကို update လုပ်ဖို့ action တစ်ခု ပါတဲ့ store ကို သတ်မှတ်ပါမယ်။

```tsx
type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}
```

နောက်တစ်ဆင့်မှာ — React component tree ကတစ်ဆင့် store ကို ဖြန့်ဝေပေးဖို့ context တစ်ခုနဲ့ provider component တစ်ခု ဖန်တီးပါမယ်။ ဒါက `MovingDot` component တစ်ခုချင်းစီမှာ သီးခြား state ရှိစေပါတယ်။

```tsx
const PositionStoreContext = createContext<ReturnType<
  typeof createPositionStore
> | null>(null)

function PositionStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createPositionStore())
  return (
    <PositionStoreContext.Provider value={store}>
      {children}
    </PositionStoreContext.Provider>
  )
}
```

Store ကို သုံးတာ ပိုရိုးရှင်းအောင် — React custom hook တစ်ခုဖြစ်တဲ့ `usePositionStore` ကို ဖန်တီးပါမယ်။ ဒီ hook က context ကနေ store ကို ဖတ်ပြီး state ရဲ့ သီးခြားအပိုင်းတွေကို ရွေးယူနိုင်အောင် လုပ်ပေးပါတယ်။

```ts
function usePositionStore<U>(selector: (state: PositionStore) => U) {
  const store = useContext(PositionStoreContext)

  if (store === null) {
    throw new Error(
      'usePositionStore must be used within PositionStoreProvider',
    )
  }

  return useStore(store, selector)
}
```

အခု — သူ့ရဲ့ container အတွင်းမှာ mouse cursor နောက်ကို လိုက်တဲ့ dot တစ်ခုကို render လုပ်တဲ့ `MovingDot` component ကို ဖန်တီးကြည့်ရအောင်။

```tsx
function MovingDot({ color }: { color: string }) {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x:
            e.clientX > e.currentTarget.clientWidth
              ? e.clientX - e.currentTarget.clientWidth
              : e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '50vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: color,
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

နောက်ဆုံးမှာ — `MovingDot` component နှစ်ခုကို တစ်ခုချင်းစီရဲ့ သီးခြား state နဲ့ render လုပ်တဲ့ `App` component ထဲမှာ အားလုံးကို စုစည်းကြည့်ရအောင်။

```tsx
export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <PositionStoreProvider>
        <MovingDot color="red" />
      </PositionStoreProvider>
      <PositionStoreProvider>
        <MovingDot color="blue" />
      </PositionStoreProvider>
    </div>
  )
}
```

အပြည့်အစုံ code က ဒီလိုပုံစံ ဖြစ်သင့်ပါတယ်:

```tsx
import { type ReactNode, useState, createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}

const PositionStoreContext = createContext<ReturnType<
  typeof createPositionStore
> | null>(null)

function PositionStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createPositionStore())
  return (
    <PositionStoreContext.Provider value={store}>
      {children}
    </PositionStoreContext.Provider>
  )
}

function usePositionStore<U>(selector: (state: PositionStore) => U) {
  const store = useContext(PositionStoreContext)

  if (store === null) {
    throw new Error(
      'usePositionStore must be used within PositionStoreProvider',
    )
  }

  return useStore(store, selector)
}

function MovingDot({ color }: { color: string }) {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x:
            e.clientX > e.currentTarget.clientWidth
              ? e.clientX - e.currentTarget.clientWidth
              : e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '50vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: color,
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

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <PositionStoreProvider>
        <MovingDot color="red" />
      </PositionStoreProvider>
      <PositionStoreProvider>
        <MovingDot color="blue" />
      </PositionStoreProvider>
    </div>
  )
}
```

### React မှာ dynamic scoped (non-global) vanilla stores တွေ သုံးခြင်း

ပထမဆုံး — counter state ကို စီမံဖို့ store တစ်ခုကို ထုတ်ပေးတဲ့ factory function တစ်ခု ဖန်တီးပါမယ်။ Tab တစ်ခုချင်းစီမှာ သူ့ကိုယ်ပိုင် store instance ရှိပါလိမ့်မယ်။

```ts
import { createStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}
```

နောက်တစ်ဆင့်မှာ — counter stores တွေကို ဖန်တီးခြင်းနဲ့ ပြန်ယူခြင်းကို စီမံပေးတဲ့ factory function တစ်ခု ဖန်တီးပါမယ်။ ဒါက tab တစ်ခုချင်းစီမှာ သီးခြား counter တစ်ခုစီ ရှိစေပါတယ်။

```ts
const createCounterStoreFactory = (
  counterStores: Map<string, ReturnType<typeof createCounterStore>>,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}
```

နောက်တစ်ဆင့်မှာ — app တစ်ခုလုံးမှာ ဒီ stores တွေကို စီမံပြီး သုံးနိုင်ဖို့ နည်းလမ်းတစ်ခု လိုပါတယ်။ အဲဒါအတွက် React ရဲ့ context ကို သုံးပါမယ်။

```tsx
const CounterStoresContext = createContext(null)

const CounterStoresProvider = ({ children }) => {
  const [stores] = useState(
    () => new Map<string, ReturnType<typeof createCounterStore>>(),
  )

  return (
    <CounterStoresContext.Provider value={stores}>
      {children}
    </CounterStoresContext.Provider>
  )
}
```

အခု — tab တစ်ခုအတွက် မှန်ကန်တဲ့ store ကို သုံးနိုင်အောင် လုပ်ပေးတဲ့ custom hook `useCounterStore` ကို ဖန်တီးပါမယ်။

```tsx
const useCounterStore = <U>(
  currentTabIndex: number,
  selector: (state: CounterStore) => U,
) => {
  const stores = useContext(CounterStoresContext)

  if (stores === undefined) {
    throw new Error('useCounterStore must be used within CounterStoresProvider')
  }

  const getOrCreateCounterStoreByKey = useCallback(
    () => createCounterStoreFactory(stores),
    [stores],
  )

  return useStore(getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`))
}
```

အခု — သုံးစွဲသူတွေ tab တွေကြားမှာ ပြောင်းလို့ရပြီး tab တစ်ခုချင်းစီရဲ့ counter ကို တိုးနိုင်တဲ့ `Tabs` component ကို ဆောက်ကြည့်ရအောင်။

```tsx
function Tabs() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useCounterStore(
    `tab-${currentTabIndex}`,
    (state) => state,
  )

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid salmon',
          paddingBottom: 4,
        }}
      >
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(0)}
        >
          Tab 1
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(1)}
        >
          Tab 2
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(2)}
        >
          Tab 3
        </button>
      </div>
      <div style={{ padding: 4 }}>
        Content of Tab {currentTabIndex + 1}
        <br /> <br />
        <button type="button" onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}
```

နောက်ဆုံးမှာ — tabs တွေနဲ့ သူတို့ရဲ့ counter တစ်ခုချင်းစီကို render လုပ်တဲ့ `App` component ကို ဖန်တီးပါမယ်။ Tab တစ်ခုချင်းစီအတွက် counter state ကို သီးခြား စီမံထားပါတယ်။

```tsx
export default function App() {
  return (
    <CounterStoresProvider>
      <Tabs />
    </CounterStoresProvider>
  )
}
```

အပြည့်အစုံ code က ဒီလိုပုံစံ ဖြစ်သင့်ပါတယ်:

```tsx
import {
  type ReactNode,
  useState,
  useCallback,
  useContext,
  createContext,
} from 'react'
import { createStore, useStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const createCounterStoreFactory = (
  counterStores: Map<string, ReturnType<typeof createCounterStore>>,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const CounterStoresContext = createContext<Map<
  string,
  ReturnType<typeof createCounterStore>
> | null>(null)

const CounterStoresProvider = ({ children }: { children: ReactNode }) => {
  const [stores] = useState(
    () => new Map<string, ReturnType<typeof createCounterStore>>(),
  )

  return (
    <CounterStoresContext.Provider value={stores}>
      {children}
    </CounterStoresContext.Provider>
  )
}

const useCounterStore = <U,>(
  key: string,
  selector: (state: CounterStore) => U,
) => {
  const stores = useContext(CounterStoresContext)

  if (stores === undefined) {
    throw new Error('useCounterStore must be used within CounterStoresProvider')
  }

  const getOrCreateCounterStoreByKey = useCallback(
    (key: string) => createCounterStoreFactory(stores!)(key),
    [stores],
  )

  return useStore(getOrCreateCounterStoreByKey(key), selector)
}

function Tabs() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useCounterStore(
    `tab-${currentTabIndex}`,
    (state) => state,
  )

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid salmon',
          paddingBottom: 4,
        }}
      >
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(0)}
        >
          Tab 1
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(1)}
        >
          Tab 2
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(2)}
        >
          Tab 3
        </button>
      </div>
      <div style={{ padding: 4 }}>
        Content of Tab {currentTabIndex + 1}
        <br /> <br />
        <button type="button" onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <CounterStoresProvider>
      <Tabs />
    </CounterStoresProvider>
  )
}
```

## Troubleshooting

TBD
