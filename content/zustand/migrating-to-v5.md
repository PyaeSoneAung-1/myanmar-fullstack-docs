---
title: "v5 သို့ ပြောင်းရွှေ့ခြင်း (Migrating to v5 from v4)"
description: "Zustand v4 ကနေ v5 ကို ပြောင်းရွှေ့နည်း — breaking changes စာရင်း၊ createWithEqualityFn နဲ့ useShallow သုံးပြီး custom equality function ပြောင်းရွှေ့ခြင်း၊ stable selector outputs လိုအပ်ချက်၊ setState ရဲ့ replace flag types တင်းကျပ်လာခြင်းနဲ့ persist middleware အပြုအမူ အပြောင်းအလဲ"
order: 24
source: "https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5"
status: translated
updated: 2026-09-01
---

# v4 ကနေ v5 ကို ဘယ်လို ပြောင်းရွှေ့မလဲ

v5 ကို မပြောင်းရွှေ့ခင် — v4 ရဲ့ နောက်ဆုံး version အထိ အရင်ဆုံး update လုပ်ဖို့ အထူး အကြံပြုပါတယ်။ အဲဒီလိုလုပ်ရင် — သင့် app ကို မချိုးဖျက်ဘဲ deprecation warnings တွေ အားလုံး ပြသပါလိမ့်မယ်။

## v5 မှာ ပြောင်းလဲမှုတွေ (Changes in v5)

- Default exports တွေကို ဖယ်ရှားခြင်း
- Deprecated features တွေကို ဖယ်ရှားခြင်း
- React 18 ကို အနည်းဆုံး လိုအပ်တဲ့ version အဖြစ် သတ်မှတ်ခြင်း
- `use-sync-external-store` ကို peer dependency အဖြစ် ပြောင်းခြင်း (`zustand/traditional` ထဲက `createWithEqualityFn` နဲ့ `useStoreWithEqualityFn` အတွက် လိုအပ်ပါတယ်)
- TypeScript 4.5 ကို အနည်းဆုံး လိုအပ်တဲ့ version အဖြစ် သတ်မှတ်ခြင်း
- UMD/SystemJS support ကို ဖယ်ရှားခြင်း
- package.json ထဲမှာ entry points တွေကို ပြန်စီစဉ်ခြင်း
- ES5 support ကို ဖယ်ရှားခြင်း
- `setState` ရဲ့ replace flag သတ်မှတ်ထားချိန်မှာ types တွေ ပိုတင်းကျပ်လာခြင်း
- Persist middleware ရဲ့ အပြုအမူ ပြောင်းလဲခြင်း
- အခြား သေးငယ်တဲ့ တိုးတက်မှုတွေ (technically breaking changes တွေပါ)

## Migration လမ်းညွှန်

### `shallow` လို custom equality functions တွေ သုံးခြင်း

v5 ထဲက `create` function က equality function ကို customize လုပ်တာကို မထောက်ပံ့ပါဘူး။

`shallow` လို custom equality function တစ်ခုကို သုံးနေတယ်ဆိုရင် — အလွယ်ဆုံး migration ကတော့ `createWithEqualityFn` ကို သုံးတာပါ။

```js
// v4
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

const useCountStore = create((set) => ({
  count: 0,
  text: 'hello',
  // ...
}))

const Component = () => {
  const { count, text } = useCountStore(
    (state) => ({
      count: state.count,
      text: state.text,
    }),
    shallow,
  )
  // ...
}
```

အဲဒါကို v5 မှာ `createWithEqualityFn` နဲ့ ဒီလို လုပ်လို့ရပါတယ်:

```bash
npm install use-sync-external-store
```

```js
// v5
import { createWithEqualityFn as create } from 'zustand/traditional'

// The rest is the same as v4
```

တနည်းအားဖြင့် — `shallow` အတွက်ဆိုရင် `useShallow` hook ကို သုံးနိုင်ပါတယ်:

```js
// v5
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

const useCountStore = create((set) => ({
  count: 0,
  text: 'hello',
  // ...
}))

const Component = () => {
  const { count, text } = useCountStore(
    useShallow((state) => ({
      count: state.count,
      text: state.text,
    })),
  )
  // ...
}
```

### Stable selector outputs တွေ လိုအပ်ခြင်း

v5 မှာ React ရဲ့ default အပြုအမူနဲ့ ကိုက်ညီအောင် behavioral change တစ်ခု ရှိပါတယ်။ Selector တစ်ခုက reference အသစ်တစ်ခုကို ပြန်ပေးရင် — infinite loop တွေ ဖြစ်စေနိုင်ပါတယ်။

ဥပမာ — ဒါတွေက infinite loops တွေ ဖြစ်စေနိုင်ပါတယ်:

```js
// v4
const [searchValue, setSearchValue] = useStore((state) => [
  state.searchValue,
  state.setSearchValue,
])
```

Error message က ဒီလိုမျိုး ဖြစ်ပါလိမ့်မယ်:

```plaintext
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

ဖြေရှင်းဖို့ — `useShallow` hook ကို သုံးပါ။ အဲဒါက stable reference တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်:

```js
// v5
import { useShallow } from 'zustand/shallow'

const [searchValue, setSearchValue] = useStore(
  useShallow((state) => [state.searchValue, state.setSearchValue]),
)
```

ဒီဥပမာကလည်း infinite loops တွေ ဖြစ်စေနိုင်ပါတယ်:

```js
// v4
const action = useMainStore((state) => {
  return state.action ?? () => {}
})
```

ဖြေရှင်းဖို့ — selector function က stable reference တစ်ခုကို ပြန်ပေးကြောင်း သေချာအောင် လုပ်ပါ:

```js
// v5

const FALLBACK_ACTION = () => {}

const action = useMainStore((state) => {
  return state.action ?? FALLBACK_ACTION
})
```

တနည်းအားဖြင့် — သင့်မှာ v4 အပြုအမူ လိုအပ်ရင် `createWithEqualityFn` က လုံလောက်ပါတယ်:

```js
// v5
import { createWithEqualityFn as create } from 'zustand/traditional'
```

### `setState` ရဲ့ replace flag သတ်မှတ်ထားချိန်မှာ types တွေ ပိုတင်းကျပ်လာခြင်း (TypeScript အတွက်သာ)

```diff
- setState:
-   (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;
+ setState:
+   (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false) => void;
+   (state: T | ((state: T) => T), replace: true) => void;
```

သင်က `replace` flag ကို မသုံးဘူးဆိုရင် — migration လုပ်စရာ မလိုပါဘူး။

`replace` flag ကို `true` ဆိုပြီး သုံးနေတယ်ဆိုရင် — complete state object တစ်ခုကို ပေးရပါမယ်။ ဒီပြောင်းလဲမှုက `store.setState({}, true)` (invalid state ဖြစ်စေတဲ့) ကို valid အဖြစ် မသတ်မှတ်တော့အောင် သေချာစေပါတယ်။

**ဥပမာများ:**

```ts
// Partial state update (valid)
store.setState({ key: 'value' })

// Complete state replacement (valid)
store.setState({ key: 'value' }, true)

// Incomplete state replacement (invalid)
store.setState({}, true) // Error
```

#### Dynamic `replace` Flag ကို ကိုင်တွယ်ခြင်း

`replace` flag ရဲ့ တန်ဖိုးက dynamic ဖြစ်ပြီး runtime မှာ ဆုံးဖြတ်တာဆိုရင် — ပြဿနာ ကြုံရနိုင်ပါတယ်။ အဲဒါကို ကိုင်တွယ်ဖို့ — `replace` parameter ကို `setState` function ရဲ့ parameters တွေနဲ့ annotate လုပ်တဲ့ workaround ကို သုံးနိုင်ပါတယ်:

```ts
const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
store.setState(...args)
```

#### Persist middleware က store ဖန်တီးချိန်မှာ item ကို သိမ်းတော့မှာ မဟုတ်တော့ပါ

အရင်က — `persist` middleware က store ဖန်တီးနေစဉ်မှာပဲ initial state ကို သိမ်းထားပါတယ်။ ဒီအပြုအမူကို v5 (နဲ့ v4.5.5) မှာ ဖယ်ရှားလိုက်ပါပြီ။

ဥပမာ — အောက်ပါ code မှာ initial state ကို storage ထဲ သိမ်းထားပါတယ်:

```js
// v4
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCountStore = create(
  persist(
    () => ({
      count: Math.floor(Math.random() * 1000),
    }),
    {
      name: 'count',
    },
  ),
)
```

v5 မှာတော့ အဲဒီလို မဟုတ်တော့ပါဘူး — store ဖန်တီးပြီးမှ state ကို ကိုယ်တိုင် သတ်မှတ်ပေးဖို့ လိုပါတယ်:

```js
// v5
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCountStore = create(
  persist(
    () => ({
      count: 0,
    }),
    {
      name: 'count',
    },
  ),
)
useCountStore.setState({
  count: Math.floor(Math.random() * 1000),
})
```

## Links

- https://github.com/pmndrs/zustand/pull/2138
- https://github.com/pmndrs/zustand/pull/2580
