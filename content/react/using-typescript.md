---
title: "TypeScript သုံးခြင်း (Using TypeScript)"
description: "React နဲ့ TypeScript — installation၊ component props တွေကို type လုပ်ခြင်း၊ Hooks (useState/useReducer/useContext/useMemo/useCallback) type လုပ်ခြင်း၊ @types/react ကနေ သုံးလေ့ရှိတဲ့ types များ"
order: 117
source: "https://react.dev/learn/typescript"
status: translated
updated: 2026-09-02
---

TypeScript က JavaScript codebases တွေကို type definitions တွေ ထည့်ပေးဖို့ ရေပန်းစားတဲ့ နည်းလမ်းတစ်ခုပါ။ TypeScript က [JSX](/docs/react/writing-markup-with-jsx) ကို ကနဦးကတည်းက ပံ့ပိုးပြီးသားဖြစ်ပြီး — သင့် project ထဲကို [`@types/react`](https://www.npmjs.com/package/@types/react) နဲ့ [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) တွေ ထည့်လိုက်ရင် React Web အတွက် အပြည့်အဝ support ရပါတယ်။

ဒီ page မှာ အောက်ပါတွေကို လေ့လာရပါမယ်:

- React Components တွေနဲ့ TypeScript သုံးခြင်း
- Hooks တွေကို type လုပ်တဲ့ ဥပမာများ
- `@types/react` ကနေ သုံးလေ့ရှိတဲ့ types များ
- ဆက်လေ့လာစရာ နေရာများ

## Installation

[Production-grade React frameworks](/docs/react/creating-a-react-app) တွေ အားလုံးက TypeScript သုံးခြင်းကို ပံ့ပိုးပါတယ်။ Installation အတွက် framework တစ်ခုချင်းစီရဲ့ guide ကို လိုက်နာပါ:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### ရှိပြီးသား React project တစ်ခုထဲကို TypeScript ထည့်ခြင်း

React ရဲ့ type definitions နောက်ဆုံးဗားရှင်းကို install လုပ်ဖို့:

```bash
npm install --save-dev @types/react @types/react-dom
```

သင့် `tsconfig.json` ထဲမှာ အောက်ပါ compiler options တွေ သတ်မှတ်ထားဖို့ လိုပါတယ်:

1. [`lib`](https://www.typescriptlang.org/tsconfig/#lib) ထဲမှာ `dom` ပါဝင်ရပါမယ် (မှတ်ချက် — `lib` option ကို သတ်မှတ်မထားရင် `dom` က default ပါဝင်ပါတယ်)။
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) ကို valid options တွေထဲက တစ်ခုခုနဲ့ သတ်မှတ်ရပါမယ်။ Application အများစုအတွက် `preserve` ဆိုရင် လုံလောက်ပါတယ်။ Library တစ်ခု publish လုပ်နေတယ်ဆိုရင် — ဘယ် value ကို ရွေးရမလဲဆိုတာ [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) မှာ ကြည့်ပါ။

## React Components တွေနဲ့ TypeScript

> **မှတ်ချက်** — JSX ပါတဲ့ file တိုင်းက `.tsx` file extension ကို သုံးရပါမယ်။ ဒါက TypeScript-specific ဖြစ်တဲ့ extension ဖြစ်ပြီး — ဒီ file ထဲမှာ JSX ပါတယ်ဆိုတာ TypeScript ကို အသိပေးပါတယ်။

React နဲ့ TypeScript ရေးတာက React နဲ့ JavaScript ရေးတာနဲ့ အလွန်ဆင်ပါတယ်။ Component တစ်ခုနဲ့ အလုပ်လုပ်တဲ့အခါ အဓိက ကွာခြားချက်က — သင့် component ရဲ့ props တွေအတွက် types တွေ ပေးနိုင်တာပါ။ ဒီ types တွေကို correctness စစ်ဆေးခြင်းနဲ့ editor တွေထဲမှာ inline documentation ပေးခြင်းတွေအတွက် သုံးနိုင်ပါတယ်။

[Quick Start](/docs/react/getting-started) guide ကနေ [`MyButton` component](/docs/react/getting-started) ကို ယူပြီး — button ရဲ့ `title` ကို ဖော်ပြတဲ့ type တစ်ခု ထည့်ကြည့်ရအောင်:

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

> **မှတ်ချက်** — ဒီ sandboxes တွေက TypeScript code တွေကို ကိုင်တွယ်နိုင်ပေမယ့် — type-checker ကို run မပေးပါဘူး။ ဆိုလိုတာက TypeScript sandboxes တွေကို လေ့လာဖို့ ပြင်ဆင်လို့ရပေမယ့် — type errors တွေ ဒါမှမဟုတ် warnings တွေ ရမှာ မဟုတ်ပါဘူး။ Type-checking ရဖို့ဆိုရင် — [TypeScript Playground](https://www.typescriptlang.org/play) ဒါမှမဟုတ် ပိုပြည့်စုံတဲ့ online sandbox တစ်ခုခုကို သုံးနိုင်ပါတယ်။

ဒီ inline syntax က component တစ်ခုအတွက် types ပေးဖို့ အရိုးရှင်းဆုံး နည်းလမ်းပါ — ဒါပေမယ့် field တစ်ချို့ ရှိလာတာနဲ့ ဒီပုံစံက ရှုပ်ထွေးလာနိုင်ပါတယ်။ ဒီအစား — component ရဲ့ props တွေကို ဖော်ပြဖို့ `interface` ဒါမှမဟုတ် `type` ကို သုံးနိုင်ပါတယ်:

```tsx src/App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

သင့် component ရဲ့ props တွေကို ဖော်ပြတဲ့ type က — သင်လိုသလောက် ရိုးရှင်းလည်း ရ၊ ရှုပ်ထွေးလည်း ရပါတယ်။ ဒါပေမယ့် — `type` ဒါမှမဟုတ် `interface` နဲ့ ဖော်ပြထားတဲ့ object type တစ်ခု ဖြစ်သင့်ပါတယ်။ TypeScript က object တွေကို ဘယ်လို ဖော်ပြလဲဆိုတာ [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) မှာ လေ့လာနိုင်ပြီး — type အနည်းငယ်ထဲက တစ်ခုခု ဖြစ်နိုင်တဲ့ prop တစ်ခုကို ဖော်ပြဖို့ [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) နဲ့ — ပိုအဆင့်မြင့်တဲ့ use cases တွေအတွက် [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) guide တို့ကိုလည်း စိတ်ဝင်စားနိုင်ပါတယ်။

## Hooks တွေကို type လုပ်ခြင်း (Example Hooks)

`@types/react` ကနေ လာတဲ့ type definitions တွေမှာ built-in Hooks တွေအတွက် types တွေ ပါဝင်လို့ — ဘာ setup မှ ထပ်မလိုဘဲ သင့် components တွေထဲမှာ သုံးနိုင်ပါတယ်။ ဒီ types တွေက သင့် component ထဲမှာ သင်ရေးထားတဲ့ code ကို ထည့်တွက်ထားလို့ — အကြိမ်အများစုမှာ [inferred types](https://www.typescriptlang.org/docs/handbook/type-inference.html) တွေ ရပြီး — types တွေ ကိုယ်တိုင် ပေးရတဲ့ အနုစိတ်အသေးစိတ်တွေကို မကိုင်တွယ်ရတော့ပါဘူး။

ဒါပေမယ့် — Hooks တွေအတွက် types ပေးနည်း ဥပမာတစ်ချို့ကို ကြည့်ရအောင်။

### `useState` ကို type လုပ်ခြင်း

[`useState` Hook](/docs/react/use-state) က — value ရဲ့ type က ဘာဖြစ်သင့်လဲ ဆုံးဖြတ်ဖို့ — initial state အဖြစ် ပေးလိုက်တဲ့ value ကို ပြန်သုံးပါတယ်။ ဥပမာ:

```ts
// Infer the type as "boolean"
const [enabled, setEnabled] = useState(false);
```

ဒါက `enabled` ကို `boolean` type သတ်မှတ်ပေးပြီး — `setEnabled` က `boolean` argument ဒါမှမဟုတ် `boolean` ပြန်ပေးတဲ့ function တစ်ခုကို လက်ခံတဲ့ function ဖြစ်လာပါတယ်။ State အတွက် type တစ်ခုကို အတိအကျ ပေးချင်ရင် — `useState` call ကို type argument တစ်ခု ပေးပြီး ဒီလို လုပ်နိုင်ပါတယ်:

```ts
// Explicitly set the type to "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

ဒီကိစ္စမှာ ဒါက သိပ်အသုံးမဝင်ပေမယ့် — type တစ်ခု ပေးချင်လေ့ရှိတဲ့ သာမန် အခြေအနေတစ်ခုကတော့ — union type တစ်ခု ရှိတဲ့အခါပါ။ ဥပမာ — ဒီမှာ `status` က string တစ်ချို့ထဲက တစ်ခုခု ဖြစ်နိုင်ပါတယ်:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

ဒါမှမဟုတ် — [state တည်ဆောက်ပုံ စည်းမျဉ်းတွေ](/docs/react/choosing-the-state-structure) မှာ အကြံပြုထားသလို — ဆက်စပ်နေတဲ့ state တွေကို object တစ်ခုအနေနဲ့ စုပြီး — မတူတဲ့ ဖြစ်နိုင်ခြေတွေကို object types တွေနဲ့ ဖော်ပြနိုင်ပါတယ်:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` ကို type လုပ်ခြင်း

[`useReducer` Hook](/docs/react/use-reducer) က reducer function တစ်ခုနဲ့ initial state တစ်ခုကို ယူတဲ့ ပိုရှုပ်ထွေးတဲ့ Hook တစ်ခုပါ။ Reducer function ရဲ့ types တွေက initial state ကနေ infer လုပ်ခံရပါတယ်။ State အတွက် type တစ်ခု ပေးဖို့ `useReducer` call ကို type argument တစ်ခု ရွေးချယ်ပြီး ပေးနိုင်ပေမယ့် — initial state ပေါ်မှာ type ကို သတ်မှတ်တာက မကြာခဏ ပိုကောင်းပါတယ်:

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

ဒီမှာ TypeScript ကို အဓိက နေရာအနည်းငယ်မှာ သုံးထားပါတယ်:

- `interface State` က reducer ရဲ့ state ရဲ့ ပုံသဏ္ဍာန်ကို ဖော်ပြပါတယ်။
- `type CounterAction` က reducer ဆီ dispatch လုပ်လို့ရတဲ့ မတူညီတဲ့ actions တွေကို ဖော်ပြပါတယ်။
- `const initialState: State` က initial state အတွက် type တစ်ခု ပေးပြီး — `useReducer` က default အနေနဲ့ သုံးတဲ့ type လည်း ဖြစ်ပါတယ်။
- `stateReducer(state: State, action: CounterAction): State` က reducer function ရဲ့ arguments နဲ့ return value တွေရဲ့ types တွေကို သတ်မှတ်ပေးပါတယ်။

`initialState` ပေါ်မှာ type သတ်မှတ်တာထက် ပိုပြီး အတိအကျ ပြောတဲ့ နည်းလမ်းတစ်ခုကတော့ — `useReducer` ကို type argument တစ်ခု ပေးတာပါ:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` ကို type လုပ်ခြင်း

[`useContext` Hook](/docs/react/use-context) က — props တွေကို component တွေကြားမှာ ဖြတ်မပို့ဘဲ — component tree တစ်လျှောက် data တွေ အောက်ကို ပို့ပေးတဲ့ နည်းလမ်းတစ်ခုပါ။ Provider component တစ်ခု ဖန်တီးပြီး — child component တစ်ခုထဲမှာ အဲဒီ value ကို စားသုံးဖို့ Hook တစ်ခုကို မကြာခဏ ဖန်တီးပြီး သုံးပါတယ်။

Context က ပေးတဲ့ value ရဲ့ type က `createContext` call ဆီ ပေးလိုက်တဲ့ value ကနေ infer လုပ်ခံရပါတယ်:

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

ဒီနည်းလမ်းက — အဓိပ္ပာယ်ရှိတဲ့ default value တစ်ခု ရှိတဲ့အခါ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် default value မရှိသင့်တဲ့ အခြေအနေတစ်ချို့လည်း ရှိပြီး — အဲဒီလိုအခါမျိုးမှာ default value အဖြစ် `null` က သင့်တော်ပုံ ရပါတယ်။ ဒါပေမယ့် — type-system ကို သင့် code ကို နားလည်စေဖို့ — `createContext` ပေါ်မှာ `ContextShape | null` ကို အတိအကျ သတ်မှတ်ဖို့ လိုပါတယ်။

ဒါက — context consumers တွေအတွက် type ထဲက `| null` ကို ဖယ်ရှားဖို့ လိုအပ်လာစေပါတယ်။ ကျွန်ုပ်တို့ရဲ့ အကြံပြုချက်ကတော့ — Hook က runtime မှာ သူ့ရဲ့ တည်ရှိမှုကို စစ်ဆေးပြီး — မရှိရင် error တစ်ခု throw လုပ်ဖို့ပါ:

```js
import { createContext, useContext, useState, useMemo } from 'react';

// This is a simpler example, but you can imagine a more complex object here
type ComplexObject = {
  kind: string
};

// The context is created with `| null` in the type, to accurately reflect the default value.
const Context = createContext<ComplexObject | null>(null);

// The `| null` will be removed via the check in the Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` ကို type လုပ်ခြင်း

> **မှတ်ချက်** — [React Compiler](/docs/react/react-compiler) က values နဲ့ functions တွေကို အလိုအလျောက် memoize လုပ်ပေးလို့ — manual `useMemo` calls တွေအတွက် လိုအပ်ချက် လျော့နည်းစေပါတယ်။ Memoization ကို အလိုအလျောက် ကိုင်တွယ်ဖို့ compiler ကို သုံးနိုင်ပါတယ်။

[`useMemo`](/docs/react/use-memo) Hook က — function call တစ်ခုကနေ memorized value တစ်ခုကို ဖန်တီး/ပြန်လည်ဝင်ရောက်ပြီး — ၂ ခုမြောက် parameter အဖြစ် ပေးထားတဲ့ dependencies တွေ ပြောင်းမှသာ function ကို ပြန် run ပါတယ်။ Hook ကို ခေါ်တာရဲ့ ရလဒ်က — ပထမ parameter ထဲက function ရဲ့ return value ကနေ infer လုပ်ခံရပါတယ်။ Hook ကို type argument တစ်ခု ပေးပြီး ပိုပြီး အတိအကျ ပြောနိုင်ပါတယ်။

```ts
// The type of visibleTodos is inferred from the return value of filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback` ကို type လုပ်ခြင်း

> **မှတ်ချက်** — [React Compiler](/docs/react/react-compiler) က values နဲ့ functions တွေကို အလိုအလျောက် memoize လုပ်ပေးလို့ — manual `useCallback` calls တွေအတွက် လိုအပ်ချက် လျော့နည်းစေပါတယ်။ Memoization ကို အလိုအလျောက် ကိုင်တွယ်ဖို့ compiler ကို သုံးနိုင်ပါတယ်။

[`useCallback`](/docs/react/use-callback) က — ဒုတိယ parameter ထဲကို ပေးလိုက်တဲ့ dependencies တွေ အတူတူ ရှိနေသရွေ့ — function တစ်ခုရဲ့ stable reference တစ်ခုကို ပေးပါတယ်။ `useMemo` လိုပဲ — function ရဲ့ type က ပထမ parameter ထဲက function ရဲ့ return value ကနေ infer လုပ်ခံရပြီး — type argument တစ်ခု ပေးပြီး ပိုပြီး အတိအကျ ပြောနိုင်ပါတယ်။

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript strict mode မှာ အလုပ်လုပ်တဲ့အခါ — `useCallback` က သင့် callback ထဲက parameters တွေအတွက် types တွေ ထည့်ဖို့ လိုအပ်ပါတယ်။ ဒါက — callback ရဲ့ type က function ရဲ့ return value ကနေ infer လုပ်ခံရလို့ပါ — parameters မရှိရင် type ကို အပြည့်အဝ နားလည်လို့ မရလို့ပါ။

သင့် code-style ပေါ် မူတည်ပြီး — React types တွေကနေ `*EventHandler` functions တွေကို သုံးပြီး — callback သတ်မှတ်တာနဲ့ event handler ရဲ့ type ကို တစ်ပြိုင်နက် ပေးနိုင်ပါတယ်:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## အသုံးဝင်တဲ့ Types များ (Useful Types)

`@types/react` package ကနေ လာတဲ့ types အစုအဝေးက အတော်လေး ကျယ်ပြန့်ပါတယ် — React နဲ့ TypeScript တို့ ဘယ်လို ဆက်ဆံလဲဆိုတာ သက်တောင့်သက်သာ ရှိလာတဲ့အခါ ဖတ်ကြည့်သင့်ပါတယ်။ [DefinitelyTyped ထဲက React ရဲ့ folder](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts) ထဲမှာ ရှာတွေ့နိုင်ပါတယ်။ ဒီမှာ သုံးလေ့ရှိတဲ့ types တစ်ချို့ကို ကြည့်ရအောင်။

### DOM Events တွေကို type လုပ်ခြင်း

React မှာ DOM events တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — event ရဲ့ type က event handler ကနေ မကြာခဏ infer လုပ်ခံရပါတယ်။ ဒါပေမယ့် — event handler တစ်ခုဆီ ပို့ဖို့ function တစ်ခုကို သီးခြားထုတ်ချင်တဲ့အခါ — event ရဲ့ type ကို အတိအကျ သတ်မှတ်ဖို့ လိုပါလိမ့်မယ်။

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

React types တွေထဲမှာ event အမျိုးအစား အများကြီး ပါဝင်ပါတယ် — [ဒီမှာ](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) စာရင်းအပြည့်အစုံ ရှာတွေ့နိုင်ပြီး — [DOM ကနေ လူကြိုက်အများဆုံး events တွေ](https://developer.mozilla.org/en-US/docs/Web/Events) ကို အခြေခံထားတာပါ။

သင်ရှာနေတဲ့ type ကို ဆုံးဖြတ်တဲ့အခါ — ပထမဆုံး သင်သုံးနေတဲ့ event handler ရဲ့ hover information ကို ကြည့်နိုင်ပါတယ် — အဲဒီမှာ event ရဲ့ type ကို ပြပါလိမ့်မယ်။

ဒီစာရင်းထဲမှာ မပါတဲ့ event တစ်ခုကို သုံးဖို့ လိုအပ်ရင် — events တွေ အားလုံးရဲ့ base type ဖြစ်တဲ့ `React.SyntheticEvent` type ကို သုံးနိုင်ပါတယ်။

### Children တွေကို type လုပ်ခြင်း

Component တစ်ခုရဲ့ children တွေကို ဖော်ပြဖို့ သာမန် နည်းလမ်း နှစ်ခု ရှိပါတယ်။ ပထမတစ်ခုက — JSX မှာ children အဖြစ် ပေးလို့ရတဲ့ ဖြစ်နိုင်တဲ့ types တွေ အားလုံးရဲ့ union ဖြစ်တဲ့ `React.ReactNode` type ကို သုံးတာပါ:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

ဒါက children ရဲ့ အလွန် ကျယ်ပြန့်တဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ပါ။ ဒုတိယတစ်ခုကတော့ — JSX elements တွေပဲ ဖြစ်ပြီး — string ဒါမှမဟုတ် number လို JavaScript primitives တွေ မဟုတ်တဲ့ `React.ReactElement` type ကို သုံးတာပါ:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

မှတ်ချက် — children တွေက JSX elements အမျိုးအစား တစ်ခုခု ဖြစ်တယ်ဆိုတာကို TypeScript နဲ့ ဖော်ပြလို့ မရတာမို့ — `<li>` children တွေပဲ လက်ခံတဲ့ component တစ်ခုကို type-system နဲ့ ဖော်ပြလို့ မရပါဘူး။

`React.ReactNode` နဲ့ `React.ReactElement` နှစ်ခုလုံးရဲ့ ဥပမာကို type-checker နဲ့တကွ [ဒီ TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFff19eFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA) မှာ ကြည့်နိုင်ပါတယ်။

### Style Props တွေကို type လုပ်ခြင်း

React မှာ inline styles တွေ သုံးတဲ့အခါ — `style` prop ဆီ ပေးလိုက်တဲ့ object ကို ဖော်ပြဖို့ `React.CSSProperties` ကို သုံးနိုင်ပါတယ်။ ဒီ type က ဖြစ်နိုင်တဲ့ CSS properties တွေ အားလုံးရဲ့ union တစ်ခုဖြစ်ပြီး — `style` prop ဆီ valid CSS properties တွေပဲ ပို့ကြောင်း သေချာစေဖို့နဲ့ — သင့် editor ထဲမှာ auto-complete ရဖို့ ကောင်းတဲ့ နည်းလမ်းတစ်ခုပါ။

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## ဆက်လေ့လာခြင်း (Further Learning)

ဒီ guide က React နဲ့ TypeScript သုံးခြင်းရဲ့ အခြေခံတွေကို လွှမ်းခြုံထားပေမယ့် — လေ့လာစရာ နောက်ထပ် အများကြီး ရှိပါသေးတယ်။ Docs ပေါ်က API pages တစ်ခုချင်းစီမှာ — TypeScript နဲ့ ဘယ်လို သုံးရမလဲဆိုတဲ့ ပိုနက်ရှိုင်းတဲ့ documentation တွေ ပါဝင်နိုင်ပါတယ်။

အောက်ပါ resource တွေကို အကြံပြုပါတယ်:

- [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) က TypeScript ရဲ့ official documentation ဖြစ်ပြီး — အဓိက language features တွေ အများစုကို လွှမ်းခြုံထားပါတယ်။
- [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) က feature အသစ်တွေကို အသေးစိတ် ဖော်ပြပါတယ်။
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) က community က ထိန်းသိမ်းထားတဲ့ cheatsheet ဖြစ်ပြီး — အသုံးဝင်တဲ့ edge cases တွေ အများကြီး လွှမ်းခြုံပြီး ဒီ document ထက် ပိုကျယ်ပြန့်တဲ့ အကြောင်းအရာတွေ ပေးပါတယ်။
- [TypeScript Community Discord](https://discord.com/invite/typescript) က TypeScript နဲ့ React ဆိုင်ရာ မေးခွန်းတွေ မေးဖို့၊ အကူအညီ ရဖို့ ကောင်းတဲ့ နေရာတစ်ခုပါ။
