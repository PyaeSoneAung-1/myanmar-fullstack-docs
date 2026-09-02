---
title: "useState"
description: "React ရဲ့ အခြေခံအကျဆုံး Hook — state variable ထည့်ခြင်း၊ set function ဖြင့် state ပြောင်းခြင်း၊ updater function နဲ့ initial state စီမံခြင်း"
order: 49
source: "https://react.dev/reference/react/useState"
status: translated
updated: 2026-09-02
---

**useState** က component တစ်ခုထဲကို [state variable](/docs/react/state-a-components-memory) ထည့်ပေးနိုင်တဲ့ React Hook တစ်ခုပါ။ Component ရဲ့ render ချိန်မှာ ပြောင်းလဲနိုင်တဲ့ အချက်အလက်တွေ (counter ကိန်းဂဏန်း၊ input text၊ checkbox အခြေအနေ စသဖြင့်) ကို သိမ်းထားပြီး — ပြောင်းလဲတိုင်း UI ကို နောက်တစ်ကြိမ် render လုပ်ပေးပါတယ်။

```js
const [state, setState] = useState(initialState)
```

## Reference

### `useState(initialState)`

Component ရဲ့ ထိပ်ဆုံးနေရာမှာ `useState` ကို ခေါ်ပြီး [state variable](/docs/react/state-a-components-memory) တစ်ခုကို ကြေညာပါတယ်:

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

State variable တွေကို `[something, setSomething]` ဆိုတဲ့ [array destructuring](https://javascript.info/destructuring-assignment) ပုံစံနဲ့ နာမည်ပေးတာ ထုံးစံပါ။

`useState` က array တစ်ခုကို ပြန်ပေးပြီး အထဲမှာ item နှစ်ခု အတိအကျ ပါပါတယ်:

1. ဒီ state variable ရဲ့ **လက်ရှိ state** — ပထမဆုံး render မှာ သင်ပေးလိုက်တဲ့ `initialState` နဲ့ ညီပါတယ်။
2. **`set` function** — state ကို တခြားတန်ဖိုး ပြောင်းဖို့ သုံးပါတယ်။

#### Parameters

- `initialState` — state ရဲ့ ကနဦး တန်ဖိုးပါ။ ဘယ် type မဆို ဖြစ်နိုင်ပေမယ့် — function ဆိုရင် အထူး အပြုအမူ ရှိပါတယ်။ ဒီ argument ကို ပထမဆုံး render ပြီးရင် ထပ်မကြည့်တော့ပါဘူး။
  - Function တစ်ခု `initialState` အဖြစ် ပေးရင် — အဲဒါကို **initializer function** အဖြစ် သဘောထားပါတယ်။ Pure ဖြစ်ရမယ်၊ argument မယူရဘူး၊ တန်ဖိုး တစ်ခုခု ပြန်ပေးရပါတယ်။ React က component ကို initialize လုပ်တဲ့အခါ ဒီ function ကို ခေါ်ပြီး — ရလဒ်ကို ကနဦး state အဖြစ် သိမ်းပါတယ်။

#### Returns

`useState` က item နှစ်ခု ပါတဲ့ array ကို ပြန်ပေးပါတယ်:

1. လက်ရှိ state — ပထမဆုံး render မှာ ပေးလိုက်တဲ့ `initialState` နဲ့ တူပါတယ်။
2. State ကို တန်ဖိုးအသစ် ပြောင်းပြီး re-render ဖြစ်စေတဲ့ `set` function။

#### Caveats

- `useState` က Hook တစ်ခုမို့ — component ရဲ့ ထိပ်ဆုံးမှာ (သို့) ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်လို့ရပါတယ်။ Loop သို့မဟုတ် condition ထဲမှာ မခေါ်ရပါဘူး။ အဲဒါ လိုအပ်ရင် — component အသစ် တစ်ခု ခွဲထုတ်ပြီး state ကို အဲဒီထဲ ရွှေ့ပါ။
- Strict Mode မှာ React က သင့် **initializer function ကို နှစ်ခါ** ခေါ်ပါတယ် — [accidental impurity တွေ ရှာဖို့](/docs/react/strict-mode) ဖြစ်ပြီး — development မှာပဲ ဖြစ်ပါတယ်။ Function က pure ဖြစ်နေရင် ပြဿနာ မရှိပါဘူး — ရလဒ် တစ်ခုကိုပဲ သုံးမှာပါ။

### `set` functions — `setSomething(nextState)`

`useState` က ပြန်ပေးတဲ့ `set` function က state ကို တန်ဖိုးအသစ်နဲ့ ပြောင်းပြီး re-render ဖြစ်စေပါတယ်။ Next state ကို တိုက်ရိုက် ပေးလို့ရသလို — အရင် state ကနေ တွက်ချက်ပေးတဲ့ function ကိုလည်း ပေးလို့ရပါတယ်:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameters

- `nextState` — နောက်ထပ် ပြသချင်တဲ့ တန်ဖိုးပါ။ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။
  - Function တစ်ခု ပေးရင် — အဲဒါကို **updater function** အဖြစ် သဘောထားပါတယ်။ Pure ဖြစ်ရမယ်၊ argument တစ်ခုတည်း (အရင် state) ကို လက်ခံပြီး — next state ကို ပြန်ပေးရပါတယ်။ React က သင့် updater ကို queue ထဲ ထည့်ပြီး — နောက် render မှာ run လုပ်ပါတယ်။ အကြိမ်တစ်ရက်တည်းမှာ `set` function အများကြီး ခေါ်ထားရင် — updater တွေကို အစီအစဉ်အတိုင်း run ပြီး next state ကို တွက်ပါတယ်။

#### Returns

`set` function က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats

- `set` function က **နောက် render တစ်ခုအတွက်** state ကို ပြောင်းပေးတာပါ — လက်ရှိ run နေတဲ့ code ထဲက တန်ဖိုးကို ချက်ချင်း မပြောင်းပါဘူး (အောက်က pitfall မှာ ကြည့်ပါ)။
- Value အတူတူပဲ ဆိုရင် (Object.is နဲ့ နှိုင်းယှဉ်ပြီး) — React က re-render ကို **ရှောင်ပါတယ်**။
- React က state updates တွေကို **batch** လုပ်ပါတယ် — event handler ထဲက `set` ခေါ်မှု အားလုံးကို ပေါင်းပြီး render တစ်ခါပဲ လုပ်ပါတယ်။
- Strict Mode မှာ updater function တွေကို နှစ်ခါ ခေါ်ပြီး — pure ဖြစ်ကြောင်း စစ်ပါတယ် (development မှာပဲ)။
- `set` function ရဲ့ identity က stable ပါ — render တိုင်း အတူတူပဲ ဖြစ်လို့ Effect dependencies ထဲ ထည့်လည်း re-render မဖြစ်စေပါဘူး။

## Usage

### State တစ်ခု ထည့်ခြင်း (Adding state to a component)

Component ရဲ့ ထိပ်ဆုံးမှာ `useState` ခေါ်ပြီး state variable တစ်ခု (သို့) အများကြီး ကြေညာပါတယ်။ Screen ပေါ်က အရာကို ပြောင်းဖို့ — `set` function ကို next state နဲ့ ခေါ်ပါတယ်:

```js
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

> **သတိပြုရန်** — `set` function က လက်ရှိ run နေတဲ့ code ထဲက state ကို မပြောင်းပါဘူး — နောက် render ကစပြီးမှ သက်ရောက်ပါတယ်။

ဥပမာ — counter (number) state:

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

### Updater function သုံးပြီး အရင် state ကို အခြေခံတဲ့ update

`age` က `42` ရှိတယ် ဆိုပါစို့ — ဒီ handler က `setAge(age + 1)` ကို သုံးကြိမ် ခေါ်ပါတယ်:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

ဒါပေမယ့် — click တစ်ချက်ပြီးရင် `age` က `45` မဟုတ်ဘဲ `43` ပဲ ဖြစ်ပါလိမ့်မယ်။ ဘာလို့လဲဆိုတော့ — `set` function က [လက်ရှိ run နေတဲ့ code ထဲက state ကို update မလုပ်ပါဘူး](/docs/react/state-snapshot) — ဒါကြောင့် `setAge(age + 1)` ခေါ်မှု တိုင်းက `setAge(43)` ဖြစ်သွားလို့ပါ။

ဒီပြဿနာကို ဖြေရှင်းဖို့ — next state အစား **updater function** ကို ပေးလို့ရပါတယ်:

```js

However, after one click, `age` will only be `43` rather than `45`! This is because calling the `set` function [does not update](/learn/state-as-a-snapshot) the `age` state variable in the already running code. So each `setAge(age + 1)` call becomes `setAge(43)`.

To solve this problem, **you may pass an *updater function*** to `setAge` instead of the next state:

```

ဒီမှာ `a => a + 1` က သင့် updater function ပါ — pending state ကို လက်ခံပြီး next state ကို တွက်ပေးပါတယ်။ React က updater တွေကို [queue](/docs/react/queueing-a-series-of-state-updates) ထဲ ထည့်ပြီး — နောက် render မှာ အစီအစဉ်အတိုင်း ခေါ်ပါတယ်: ပထမတစ်ခါ `42` ကနေ `43`၊ ဒုတိယ `43` ကနေ `44`၊ တတိယ `44` ကနေ `45`။ Queue ထဲ နောက်ထပ် update မရှိတော့လို့ — React က နောက်ဆုံး `45` ကို လက်ရှိ state အဖြစ် သိမ်းပါတယ်။

ထုံးစံအရ — pending state argument ကို state variable ရဲ့ ပထမစာလုံးနဲ့ ခေါ်တတ်ပါတယ် (`a` for `age`) — `prevAge` လိုမျိုးလည်း ရပါတယ်။ Development မှာ React က [updater တွေကို နှစ်ခါ ခေါ်ပြီး pure ဖြစ်ကြောင်း](/docs/react/keeping-components-pure) စစ်ပါတယ်။

### State ထဲက object/array တွေကို ပြောင်းခြင်း

State ထဲက object (သို့) array ကို တိုက်ရိုက် mutate **မလုပ်ရပါဘူး** — copy အသစ်တစ်ခု ဖန်တီးပြီး သိမ်းမှသာ re-render ဖြစ်ပါတယ်:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

```js

Instead, replace the whole object by creating a new one:

```

### Initial state ကို ထပ်ခါထပ်ခါ မတွက်စေခြင်း

Array/object လိုမျိုး — ဖန်တီးရတာ စျေးကြီးတဲ့ တန်ဖိုးကို `useState` ထဲ တိုက်ရိုက် ပေးရင် — render တိုင်း တွက်ချက်ပြီး ဖြုန်းတီးပါတယ်။ Function အနေနဲ့ ပေးမှ — ပထမဆုံး initialize လုပ်တဲ့အခါမှပဲ ခေါ်ပါတယ်:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

```js

Although the result of `createInitialTodos()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating large arrays or performing expensive calculations.

To solve this, you may **pass it as an _initializer_ function** to `useState` instead:

```

## Troubleshooting

### State update လုပ်ပြီးမှ log ကြည့်ရင် အဟောင်းပဲ ပြနေတာ

`set` ခေါ်တာနဲ့ လက်ရှိ function ထဲက state က ချက်ချင်း မပြောင်းပါဘူး — နောက် render ကစပြီးမှ ပြောင်းပါတယ်:

```js
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

### Screen ပေါ်မှာ မပြောင်းတော့တာ

State ထဲက object/array ကို mutate လုပ်မိရင် — reference အတူတူမို့ React က ပြောင်းလဲမှုကို မမြင်ပါဘူး:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

```js

You mutated an existing `obj` object and passed it back to `setObj`, so React ignored the update. To fix this, you need to ensure that you're always [_replacing_ objects and arrays in state instead of _mutating_ them](#updating-objects-and-arrays-in-state):

```

### "Too many re-renders" error ဖြစ်နေတာ

Render အတွင်းမှာ event handler ကို ခေါ်လိုက်လို့ပါ — handler ကို ပို့မယ့်အစား ခေါ်လိုက်မိရင် render တိုင်း state ပြောင်းပြီး အဆုံးမဲ့ loop ဖြစ်ပါတယ်:

```js
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

### Initializer / updater function နှစ်ခါ run ဖြစ်နေတာ

Strict Mode (development) မှာ ပုံမှန်ပါ — impurity တွေ ရှာဖို့ ရည်ရွယ်ချက်နဲ့ နှစ်ခါ ခေါ်တာပါ။ Function တွေ pure ဖြစ်နေသရွေ့ ပြဿနာ မရှိပါဘူး။

### State ကို function တန်ဖိုး သိမ်းချင်လို့ ပေးလိုက်တာ — အဲဒီ function ကိုယ်တိုင် run ဖြစ်နေတာ

`useState(someFunction)` ဆိုရင် — `someFunction` ကို initializer အဖြစ် မှတ်ပြီး ခေါ်ပါတယ်။ Function ကိုယ်တိုင် သိမ်းချင်ရင် — wrapper နဲ့ ပတ်ပေးရပါတယ်: `useState(() => someFunction)`။

အသေးစိတ် ဆက်ဖတ်ရန် — [State ဆိုတာ component ရဲ့ memory](/docs/react/state-a-components-memory) နဲ့ [State ကို snapshot အဖြစ် မြင်ခြင်း](/docs/react/state-snapshot)။
