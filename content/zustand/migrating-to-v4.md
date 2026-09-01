---
title: "v4 သို့ ပြောင်းရွှေ့ခြင်း (Migrating to v4)"
description: "Zustand v3 ကနေ v4 ကို ပြောင်းရွှေ့နည်း — breaking changes တွေက types တွေမှာပဲ ရှိတာမို့ TypeScript သုံးသူတွေအတွက် create, StateCreator, PartialState, useStore, UseBoundStore, createContext နဲ့ middleware types တွေကို ဘယ်လို ပြင်ဆင်ရမလဲ"
order: 23
source: "https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v4"
status: translated
updated: 2026-09-01
---

Breaking changes တွေက **types တွေမှာပဲ** ရှိပါတယ်။ အကယ်၍ သင်က Zustand ကို TypeScript (သို့) JSDoc type annotations တွေနဲ့ သုံးနေတယ်ဆိုရင် — ဒီ guide က သင့်အတွက် သက်ဆိုင်ပါတယ်။ မဟုတ်ရင် migration လုပ်စရာ မလိုပါဘူး။

ဒါ့အပြင် — migration ကို နားလည်ရ ပိုလွယ်ကူစေဖို့ အသစ်ဖြစ်တဲ့ [TypeScript Guide](/docs/zustand/typescript) ကို အရင်ဆုံး ဖတ်ထားဖို့ အကြံပြုပါတယ်။

ဒီ migration guide အပြင် — Zustand repository ထဲက test files တွေရဲ့ v3 ကနေ v4 ကို ပြောင်းလဲမှု [diff](https://github.com/pmndrs/zustand/compare/v3.7.2...v4.0.0?short_path=37e5b4c#diff-c21e24854115b390eccde717da83f91feb2d5927a76c1485e5f0fdd0135c2afa) ကိုလည်း ကြည့်ရှုနိုင်ပါတယ်။

## `create`

**သက်ဆိုင်ရာ imports**

```ts
import create from 'zustand'
import create from 'zustand/vanilla'
```

**ပြောင်းလဲမှု (Change)**

```diff
- create:
-   < State
-   , StoreSetState = StoreApi<State>["set"]
-   , StoreGetState = StoreApi<State>["get"]
-   , Store = StoreApi<State>
-   >
-     (f: ...) => ...
+ create:
+   { <State>(): (f: ...) => ...
+   , <State, Mutators>(f: ...) => ...
+   }
```

**Migration (ပြောင်းရွှေ့နည်း)**

`create` ကို type parameters တွေ ဘာမှ မပို့ထားဘူးဆိုရင် — migration လုပ်စရာ မလိုပါဘူး။

`combine` (သို့) `redux` လို "leaf" middleware တစ်ခုကို သုံးနေတယ်ဆိုရင် — `create` ကနေ type parameters အားလုံးကို ဖယ်ရှားလိုက်ပါ။

မဟုတ်ရင် `create<T, ...>(...)` ကို `create<T>()(...)` ဆိုပြီး အစားထိုးပါ။

## `StateCreator`

**သက်ဆိုင်ရာ imports**

```ts
import type { StateCreator } from 'zustand'
import type { StateCreator } from 'zustand/vanilla'
```

**ပြောင်းလဲမှု (Change)**

```diff
- type StateCreator
-   < State
-   , StoreSetState = StoreApi<State>["set"]
-   , StoreGetState = StoreApi<State>["get"]
-   , Store = StoreApi<State>
-   > =
-     ...
+ type StateCreator
+   < State
+   , InMutators extends [StoreMutatorIdentifier, unknown][] = []
+   , OutMutators extends [StoreMutatorIdentifier, unknown][] = []
+   , Return = State
+   > =
+     ...
```

**Migration (ပြောင်းရွှေ့နည်း)**

သင်က `StateCreator` ကို သုံးနေတယ်ဆိုရင် — middleware တစ်ခုကို ရေးသားနေတာ (သို့) "slices" pattern ကို သုံးနေတာ ဖြစ်နိုင်ပါတယ်။ အဲဒါအတွက် TypeScript Guide ရဲ့ [Authoring middlewares and advanced usage](/docs/zustand/typescript#authoring-middlewares-and-advanced-usage) နဲ့ [Common recipes](/docs/zustand/typescript#common-recipes) section တွေကို ကြည့်ပါ။

## `PartialState`

**သက်ဆိုင်ရာ imports**

```ts
import type { PartialState } from 'zustand'
import type { PartialState } from 'zustand/vanilla'
```

**ပြောင်းလဲမှု (Change)**

```diff
- type PartialState
-   < T extends State
-   , K1 extends keyof T = keyof T
-   , K2 extends keyof T = K1
-   , K3 extends keyof T = K2
-   , K4 extends keyof T = K3
-   > =
-   | (Pick<T, K1> | Pick<T, K2> | Pick<T, K3> | Pick<T, K4> | T)
-   | ((state: T) => Pick<T, K1> | Pick<T, K2> | Pick<T, K3> | Pick<T, K4> | T)
+ type PartialState<T> =
+   | Partial<T>
+   | ((state: T) => Partial<T>)
```

**Migration (ပြောင်းရွှေ့နည်း)**

`PartialState<T, ...>` ကို `PartialState<T>` ဆိုပြီး အစားထိုးပြီး — သင့် `tsconfig.json` ထဲမှာ [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) ကို ဖွင့်ထားဖို့ ဦးစားပေး လုပ်ဆောင်ပါ:

```json
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": true
  }
}
```

`{ foo: undefined }` ကို `Partial<{ foo: string }>` ထဲ assign မလုပ်နိုင်အောင် တားတဲ့ နည်းလမ်းဟောင်းကို ကျွန်တော်တို့ သုံးတော့မှာ မဟုတ်ပါဘူး။ အဲဒီအစား — သုံးစွဲသူတွေကိုယ်တိုင် `exactOptionalPropertyTypes` ကို ဖွင့်ထားဖို့ပဲ မှီခိုပါတယ်။

## `useStore`

**သက်ဆိုင်ရာ imports**

```ts
import { useStore } from 'zustand'
import { useStore } from 'zustand/react'
```

**ပြောင်းလဲမှု (Change)**

```diff
- useStore:
-   { <State>(store: StoreApi<State>): State
-   , <State, StateSlice>
-       ( store: StoreApi<State>
-       , selector: StateSelector<State, StateSlice>,
-       , equals?: EqualityChecker<StateSlice>
-       ): StateSlice
-   }
+ useStore:
+   <Store, StateSlice = ExtractState<Store>>
+     ( store: Store
+     , selector?: StateSelector<State, StateSlice>,
+     , equals?: EqualityChecker<StateSlice>
+     )
+       => StateSlice
```

**Migration (ပြောင်းရွှေ့နည်း)**

`useStore` ကို type parameters တွေ ဘာမှ မပို့ထားဘူးဆိုရင် — migration လုပ်စရာ မလိုပါဘူး။

ပို့ထားတယ်ဆိုရင် — type parameters အားလုံးကို ဖယ်ရှားတာ (သို့) ပထမ parameter အဖြစ် **state** type အစား **store** type ကို ပေးတာ နှစ်မျိုးလုံးထဲက တစ်မျိုး လုပ်ဖို့ အကြံပြုပါတယ်။

## `UseBoundStore`

**သက်ဆိုင်ရာ imports**

```ts
import type { UseBoundStore } from 'zustand'
import type { UseBoundStore } from 'zustand/react'
```

**ပြောင်းလဲမှု (Change)**

```diff
- type UseBoundStore<
-   State,
-   Store = StoreApi<State>
- > =
-   & { (): T
-     , <StateSlice>
-         ( selector: StateSelector<State, StateSlice>
-         , equals?: EqualityChecker<StateSlice>
-         ): U
-     }
-   & Store
+ type UseBoundStore<Store> =
+   & (<StateSlice = ExtractState<S>>
+       ( selector?: (state: ExtractState<S>) => StateSlice
+       , equals?: (a: StateSlice, b: StateSlice) => boolean
+       ) => StateSlice
+     )
+   & S
```

**Migration (ပြောင်းရွှေ့နည်း)**

`UseBoundStore<T>` ကို `UseBoundStore<StoreApi<T>>` နဲ့ — `UseBoundStore<T, S>` ကို `UseBoundStore<S>` နဲ့ အစားထိုးပါ။

## `UseContextStore`

**သက်ဆိုင်ရာ imports**

```ts
import type { UseContextStore } from 'zustand/context'
```

**ပြောင်းလဲမှု (Change)**

```diff
- type UseContextStore
```

**Migration (ပြောင်းရွှေ့နည်း)**

အဲဒီအစား `typeof MyContext.useStore` ကို သုံးပါ။

## `createContext`

**သက်ဆိုင်ရာ imports**

```ts
import createContext from 'zustand/context'
```

**ပြောင်းလဲမှု (Change)**

```diff
  createContext:
-   <State, Store = StoreApi<State>>() => ...
+   <Store>() => ...
```

**Migration (ပြောင်းရွှေ့နည်း)**

`createContext<T>()` ကို `createContext<StoreApi<T>>()` နဲ့ — `createContext<T, S>()` ကို `createContext<S>()` နဲ့ အစားထိုးပါ။

## `combine`, `devtools`, `subscribeWithSelector`

**သက်ဆိုင်ရာ imports**

```ts
import { combine } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'
```

**ပြောင်းလဲမှု (Change)**

```diff
- combine:
-   <T, U>(...) => ...
+ combine:
+   <T, U, Mps, Mcs>(...) => ...

- devtools:
-   <T>(...) => ...
+ devtools:
+   <T, Mps, Mcs>(...) => ...

- subscribeWithSelector:
-   <T>(...) => ...
+ subscribeWithSelector:
+   <T, Mps, Mcs>(...) => ...
```

**Migration (ပြောင်းရွှေ့နည်း)**

`combine`, `devtools` (သို့) `subscribeWithSelector` တွေကို type parameters တွေ ဘာမှ မပို့ထားဘူးဆိုရင် — migration လုပ်စရာ မလိုပါဘူး။

ပို့ထားတယ်ဆိုရင် — အဲဒီ type parameters တွေကို automatic ဖြစ်အောင် inference လုပ်လို့ရတာမို့ — အားလုံး ဖယ်ရှားလိုက်ပါ။

## `persist`

**သက်ဆိုင်ရာ imports**

```ts
import { persist } from 'zustand/middleware'
```

**ပြောင်းလဲမှု (Change)**

```diff
- persist:
-   <T, U = Partial<T>>(...) => ...
+ persist:
+   <T, Mps, Mcs, U = T>(...) => ...
```

**Migration (ပြောင်းရွှေ့နည်း)**

Type parameters တွေ ပို့ထားတယ်ဆိုရင် — automatic ဖြစ်အောင် inference လုပ်လို့ရတာမို့ — ဖယ်ရှားလိုက်ပါ။

နောက်ပြီး — သင်က `partialize` option ကို ပို့ထားတယ်ဆိုရင် — နောက်ထပ် migration အတွက် ဘာမှ လုပ်စရာ မလိုပါဘူး။

`partialize` option ကို **မပို့ထားဘူး**ဆိုရင် — compilation errors တချို့ တွေ့ရနိုင်ပါတယ်။ Error တွေ မတွေ့ရဘူးဆိုရင် — နောက်ထပ် migration မလိုတော့ပါဘူး။

Partialized state ရဲ့ type က အခုဆို `Partial<T>` အစား `T` ဖြစ်ပါတယ် — ဒါက default `partialize` ရဲ့ runtime အပြုအမူဖြစ်တဲ့ identity (`s => s`) နဲ့ ကိုက်ညီပါတယ်။

Compilation errors တွေ တွေ့ရတယ်ဆိုရင် — အဲဒီ errors တွေက unsound code ရဲ့ လက္ခဏာ ဖြစ်နိုင်လို့ — error တွေကို ကိုယ်တိုင် ရှာဖွေ ပြင်ဆင်ရပါမယ်။ ဒါမှမဟုတ် — `partialize` မှာ `s => s as Partial<typeof s>` ပို့တဲ့ workaround နဲ့ ဖြေရှင်းနိုင်ပါတယ်။ သင့် partialized state က တကယ်ပဲ `Partial<T>` ဆိုရင် — bug တွေ ကြုံရမှာ မဟုတ်ပါဘူး။

Runtime အပြုအမူကတော့ မပြောင်းပါဘူး — types တွေပဲ အခုမှ မှန်ကန်လာတာပါ။

## `redux`

**သက်ဆိုင်ရာ imports**

```ts
import { redux } from 'zustand/middleware'
```

**ပြောင်းလဲမှု (Change)**

```diff
- redux:
-   <T, A>(...) => ...
+ redux:
+   <T, A, Mps, Mcs>(...) => ...
```

**Migration (ပြောင်းရွှေ့နည်း)**

`redux` ကို type parameters တွေ ဘာမှ မပို့ထားဘူးဆိုရင် — migration လုပ်စရာ မလိုပါဘူး။

ပို့ထားတယ်ဆိုရင် — type parameters အားလုံးကို ဖယ်ရှားပြီး — ဒုတိယ (action) parameter ကိုပဲ annotate လုပ်ပါ။ ဆိုလိုတာက — `redux<T, A>((state, action) => ..., ...)` ကို `redux((state, action: A) => ..., ...)` ဆိုပြီး အစားထိုးပါ။
