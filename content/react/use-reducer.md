---
title: "useReducer"
description: "Component တစ်ခုထဲကို reducer (state update logic ကို ကိုင်တွယ်တဲ့ function) ထည့်ဖို့ သုံးတဲ့ React Hook — state နဲ့ dispatch function ပြန်ပေးပုံ၊ Parameters/Returns/Caveats၊ ဥပမာများနဲ့ ပြဿနာဖြေရှင်းနည်းများ"
order: 50
source: "https://react.dev/reference/react/useReducer"
status: translated
updated: 2026-09-02
---

`useReducer` ဆိုတာ — သင့် component တစ်ခုထဲကို [reducer (state update logic ကို သတ်မှတ်ပေးတဲ့ function)](/docs/react/extracting-state-logic-into-a-reducer) တစ်ခု ထည့်ပေးနိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

## ရည်ညွှန်းချက် (Reference)

### `useReducer(reducer, initialArg, init?)`

သင့် component ရဲ့ ထိပ်ဆုံးအဆင့်မှာ `useReducer` ကို ခေါ်ပြီး — state ကို [reducer](/docs/react/extracting-state-logic-into-a-reducer) တစ်ခုနဲ့ စီမံပါတယ်:

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

#### Parameters (ပါရာမီတာများ)

- `reducer` — state ကို ဘယ်လို update လုပ်မလဲဆိုတာ သတ်မှတ်ပေးတဲ့ reducer function ပါ။ Pure ဖြစ်ရမယ် (တူညီတဲ့ inputs တွေအတွက် တူညီတဲ့ output ပြန်ပေးတဲ့ — ဘေးထွက်ဆိုးကျိုး မရှိတဲ့ function)။ `state` နဲ့ `action` ကို arguments အဖြစ် လက်ခံပြီး — next state (နောက် state) ကို ပြန်ပေးရပါတယ်။ `state` ရော `action` ပါ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။
- `initialArg` — ကနဦး state ကို တွက်ချက်ရာမှာ အခြေခံအဖြစ် သုံးတဲ့ တန်ဖိုးပါ။ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။ ဒီတန်ဖိုးကနေ ကနဦး state ကို ဘယ်လို တွက်လဲဆိုတာ — နောက်က `init` argument အပေါ် မူတည်ပါတယ်။
- **optional** `init` — ကနဦး state ကို ပြန်ပေးရမယ့် initializer function ပါ။ မသတ်မှတ်ထားဘူးဆိုရင် — ကနဦး state က `initialArg` ကို သုံးပါတယ်။ သတ်မှတ်ထားရင်တော့ — `init(initialArg)` ကို ခေါ်ပြီး ရလဒ်ကို ကနဦး state အဖြစ် သတ်မှတ်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`useReducer` က item နှစ်ခု အတိအကျ ပါတဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်:

1. လက်ရှိ state (current state) — ပထမဆုံး render မှာ `init` ရှိရင် `init(initialArg)` ၊ `init` မရှိရင် `initialArg` ကို သတ်မှတ်ပေးပါတယ်။
2. [`dispatch` function](#dispatch) — state ကို တန်ဖိုးအသစ်တစ်ခုဆီ update လုပ်ပြီး re-render ဖြစ်စေဖို့ သုံးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `useReducer` က Hook တစ်ခုမို့ — သင့် component ရဲ့ **ထိပ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ်။ Loops ဒါမှမဟုတ် conditions တွေထဲမှာ ခေါ်လို့ မရပါဘူး။ အဲဒါ လိုအပ်ရင် — component အသစ်တစ်ခု ခွဲထုတ်ပြီး state ကို အဲဒီထဲ ရွှေ့ပါ။
- `dispatch` function ရဲ့ identity က stable (တည်ငြိမ်) ဖြစ်လို့ — Effect dependencies တွေထဲကနေ ချန်လိုက်တာကို မကြာခဏ တွေ့ရပါတယ်။ ဒါပေမယ့် ထည့်ထားရင်လည်း Effect က run ဖြစ်မှာ မဟုတ်ပါဘူး။ Linter က error မရှိဘဲ dependency ကို ချန်ဖို့ ခွင့်ပြုရင် — ချန်လိုက်တာ လုံခြုံပါတယ်။ [Effect dependencies တွေကို ဖယ်ရှားခြင်း အကြောင်း ဆက်ဖတ်ပါ](/docs/react/removing-effect-dependencies)။
- Strict Mode မှာ React က သင့် **reducer နဲ့ initializer functions တွေကို နှစ်ခါ ခေါ်ပါတယ်** — [မတော်တဆ ပါဝင်လာတတ်တဲ့ impurity (pure မဟုတ်တဲ့အပိုင်း) တွေ ရှာတွေ့ဖို့](#my-reducer-or-initializer-function-runs-twice) အတွက်ပါ။ ဒါက development မှာပဲ ဖြစ်ပြီး — production ကို မထိခိုက်ပါဘူး။ သင့် reducer နဲ့ initializer တွေက pure ဖြစ်နေရင် (ဖြစ်သင့်သလိုပဲ) — သင့် logic ကို မထိခိုက်ပါဘူး။ ခေါ်မှု နှစ်ခုထဲက ရလဒ် တစ်ခုကိုပဲ အသုံးပြုပါတယ်။

### `dispatch` function

`useReducer` က ပြန်ပေးတဲ့ `dispatch` function က — state ကို တန်ဖိုးအသစ်တစ်ခုဆီ update လုပ်ပြီး re-render ဖြစ်စေဖို့ သုံးပါတယ်။ Action ကို `dispatch` function ရဲ့ တစ်ခုတည်းသော argument အဖြစ် ပေးရပါတယ်:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React က — သင့်က လက်ရှိ `state` နဲ့ `dispatch` ဆီ ပေးလိုက်တဲ့ action ကို သုံးပြီး — သင်ပေးထားတဲ့ `reducer` function ကို ခေါ်ကာ — အဲဒီကရတဲ့ ရလဒ်ကို next state အဖြစ် သတ်မှတ်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `action` — အသုံးပြုသူက လုပ်ဆောင်လိုက်တဲ့ action ပါ။ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။ ထုံးစံအရ — action က ကိုယ့်ကိုယ်ကို ခွဲခြားသိနိုင်တဲ့ `type` property ပါတဲ့ object တစ်ခု ဖြစ်ပြီး — လိုအပ်ရင် အချက်အလက် အပိုတွေကို တခြား properties တွေအနေနဲ့ ထည့်သွင်းလေ့ရှိပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`dispatch` function တွေက ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `dispatch` function က **နောက် render တစ်ခုအတွက်ပဲ** state variable ကို update လုပ်ပါတယ်။ `dispatch` ခေါ်ပြီးမှ state variable ကို ဖတ်ကြည့်ရင် — [ခေါ်ခင် screen ပေါ်မှာ ရှိခဲ့တဲ့ တန်ဖိုးဟောင်းကိုပဲ ရပါသေးတယ်](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)။
- ပေးလိုက်တဲ့ တန်ဖိုးအသစ်က လက်ရှိ `state` နဲ့ အတူတူပဲ ဆိုရင် — [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်ပြီး ဆုံးဖြတ်ပါတယ် — React က component ရော သူ့ရဲ့ children တွေပါ **re-render လုပ်တာကို ရှောင်ပါတယ်။** ဒါက optimization တစ်ခုပါ။ React က ရလဒ်ကို လျစ်လျူရှုပြီး သင့် component ကို ခေါ်ဖို့ လိုအပ်နိုင်သေးပေမယ့် — သင့် code ကို မထိခိုက်စေပါဘူး။
- React က state updates တွေကို [batch လုပ်ပါတယ်](/docs/react/queueing-a-series-of-state-updates) — event handlers တွေ အားလုံး run ပြီး သူတို့ရဲ့ `set` functions တွေ ခေါ်ပြီးမှသာ — screen ကို update လုပ်ပါတယ်။ ဒါက event တစ်ခုတည်းအတွင်းမှာ re-render အများကြီး မဖြစ်အောင် တားဆီးပေးပါတယ်။ Screen ကို စောပြီး update လုပ်ဖို့ လိုအပ်တဲ့ ရှားပါးကိစ္စမျိုးမှာ (ဥပမာ — DOM ကို ဝင်ကြည့်ချင်တဲ့အခါ) — [`flushSync`](https://react.dev/reference/react-dom/flushSync) ကို သုံးနိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Reducer တစ်ခုကို component တစ်ခုထဲ ထည့်ခြင်း

Component ရဲ့ ထိပ်ဆုံးအဆင့်မှာ `useReducer` ကို ခေါ်ပြီး — state ကို [reducer](/docs/react/extracting-state-logic-into-a-reducer) တစ်ခုနဲ့ စီမံပါတယ်။

`useReducer` က item နှစ်ခု အတိအကျ ပါတဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်: (၁) ဒီ state variable ရဲ့ **လက်ရှိ state** — သင်ပေးလိုက်တဲ့ **initial state** ကို ကနဦးမှာ သတ်မှတ်ပေးထားပြီး — (၂) interaction တွေကို တုံ့ပြန်ပြီး state ကို ပြောင်းလဲခွင့်ပေးတဲ့ **`dispatch` function** ပါ။

Screen ပေါ်က အရာတွေကို update လုပ်ဖို့ — အသုံးပြုသူ လုပ်လိုက်တာကို ကိုယ်စားပြုတဲ့ object — *action* လို့ ခေါ်ပါတယ် — အဲဒါကို `dispatch` ဆီ ပို့ပါတယ်:

```js
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React က လက်ရှိ state နဲ့ action ကို သင့် **reducer function** ဆီ ပို့ပါတယ်။ Reducer က next state ကို တွက်ပြီး ပြန်ပေးပါတယ်။ React က အဲဒီ next state ကို သိမ်းပြီး — သင့် component ကို အဲဒီ state နဲ့ render လုပ်ကာ UI ကို update ပါတယ်။

#### ဥပမာ — Age counter

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

`useReducer` က [`useState`](/docs/react/use-state) နဲ့ အရမ်းဆင်ပါတယ် — ဒါပေမယ့် state update logic ကို event handlers တွေကနေ သင့် component ရဲ့ အပြင်ဘက်က function တစ်ခုတည်းထဲ ရွှေ့နိုင်စေပါတယ်။ [`useState` နဲ့ `useReducer` ကြားက ရွေးချယ်မှု](/docs/react/extracting-state-logic-into-a-reducer) အကြောင်း ဆက်ဖတ်နိုင်ပါတယ်။

### Reducer function ရေးသားခြင်း

Reducer function တစ်ခုကို ဒီလိုမျိုး ကြေညာပါတယ်:

```js
function reducer(state, action) {
  // ...
}
```

ပြီးတော့ — next state ကို တွက်ပြီး ပြန်ပေးမယ့် code တွေကို ဖြည့်ရပါတယ်။ ထုံးစံအရ — [`switch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) တစ်ခုအနေနဲ့ ရေးလေ့ရှိပါတယ်။ `switch` ထဲက `case` တစ်ခုချင်းစီအတွက် — next state တစ်ခုခုကို တွက်ပြီး ပြန်ပေးပါတယ်။

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Actions တွေက ဘယ်ပုံစံမဆို ဖြစ်နိုင်ပါတယ်။ ထုံးစံအရ — action ကို ခွဲခြားသိနိုင်တဲ့ `type` property ပါတဲ့ objects တွေကို ပို့လေ့ရှိပါတယ်။ Reducer က next state တွက်ဖို့ လိုအပ်တဲ့ အနည်းဆုံး အချက်အလက်တွေပဲ ပါဝင်သင့်ပါတယ်။

```js
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Action type နာမည်တွေက သင့် component အတွင်းမှာပဲ သက်ဆိုင်ပါတယ်။ [Action တစ်ခုစီက interaction တစ်ခုကိုပဲ ဖော်ပြရပါတယ် — ဒေတာမှာ ပြောင်းလဲမှု အများကြီး ဖြစ်စေရင်တောင်](/docs/react/extracting-state-logic-into-a-reducer)။ State ရဲ့ ပုံစံ (shape) က လွတ်လပ်ပါတယ် — ဒါပေမယ့် အများအားဖြင့် object (သို့) array တစ်ခု ဖြစ်ပါတယ်။

[State logic ကို reducer တစ်ခုထဲ ထုတ်ယူခြင်း](/docs/react/extracting-state-logic-into-a-reducer) မှာ ဆက်ဖတ်နိုင်ပါတယ်။

> **သတိပြုရန်:** State ကို read-only အနေနဲ့ သဘောထားပါ။ State ထဲက object (သို့) array တွေကို modify မလုပ်ပါနဲ့:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

အစား — သင့် reducer ကနေ object အသစ်တွေကိုပဲ အမြဲ ပြန်ပေးပါ:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

အသေးစိတ် — [State ထဲက objects တွေကို update လုပ်ခြင်း](/docs/react/updating-objects-in-state) နဲ့ [State ထဲက arrays တွေကို update လုပ်ခြင်း](/docs/react/updating-arrays-in-state) မှာ ဆက်ဖတ်ပါ။

#### ဥပမာ — Todo list (array)

ဒီဥပမာမှာ — reducer က task တွေရဲ့ array တစ်ခုကို စီမံပါတယ်။ Array ကို [mutation မလုပ်ဘဲ](/docs/react/updating-arrays-in-state) update လုပ်ရပါတယ်:

```js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

ဒီဥပမာကို အလုပ်လုပ်ဖို့ — `AddTask` နဲ့ `TaskList` ဆိုတဲ့ helper components နှစ်ခု လိုပါတယ်။ `AddTask.js`:

```js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

ပြီးတော့ `TaskList.js` — task တစ်ခုချင်းစီကို edit/delete လုပ်ဖို့ သုံးပါတယ်:

```js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

**Immer နဲ့ ရေးသားခြင်း** — mutation မလုပ်ဘဲ arrays/objects တွေကို update လုပ်တဲ့ code ကို ထပ်ခါထပ်ခါ ရေးနေရတာ ပင်ပန်းရင် — [Immer](https://github.com/immerjs/use-immer#useimmerreducer) လိုမျိုး library ကို သုံးပြီး repetitive code တွေ လျှော့ချနိုင်ပါတယ်။ Immer က object တွေကို mutate လုပ်သလိုမျိုး code တိုတိုလေး ရေးလို့ရအောင် လုပ်ပေးပြီး — နောက်ကွယ်မှာ immutable updates တွေကို ကိုယ်တိုင် လုပ်ပေးပါတယ် (ဥပမာ — `use-immer` ရဲ့ `useImmerReducer` hook ကို သုံးရင် reducer က လက်ခံတဲ့ `draft` ကို တိုက်ရိုက် mutate လုပ်လို့ရပါတယ်)။

### Initial state ကို ထပ်ခါထပ်ခါ မဖန်တီးစေခြင်း

React က initial state ကို တစ်ခါပဲ သိမ်းပြီး — နောက် renders တွေမှာ လျစ်လျူရှုပါတယ်။

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

`createInitialState(username)` ရဲ့ ရလဒ်ကို ပထမဆုံး render မှာပဲ သုံးပေမယ့် — ဒီ function ကို render တိုင်း ခေါ်နေပါတယ်။ ဒီ function က array ကြီးကြီးတွေ ဖန်တီးနေတာ (သို့) တွက်ချက်မှု စျေးကြီးတာတွေ လုပ်နေရင် — ဒါက ဖြုန်းတီးမှုတစ်ခုပါ။

ဖြေရှင်းဖို့ — အဲဒါကို `useReducer` ရဲ့ တတိယ argument အနေနဲ့ **_initializer_ function** အဖြစ် ပို့နိုင်ပါတယ်:

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

သတိထားပါ — ပို့နေတာက `createInitialState` (function ကိုယ်တိုင်) ဖြစ်ပြီး — `createInitialState()` (ခေါ်လိုက်လို့ ရလာတဲ့ ရလဒ်) မဟုတ်ပါဘူး။ ဒီလိုဆို — ကနဦး state ကို initialize လုပ်ပြီးနောက် နောက်တစ်ခါ မဖန်တီးတော့ပါဘူး။

အထက်က ဥပမာမှာ `createInitialState` က `username` argument ကို လက်ခံပါတယ်။ သင့် initializer က initial state တွက်ဖို့ ဘာအချက်အလက်မှ မလိုဘူးဆိုရင် — `useReducer` ရဲ့ ဒုတိယ argument အနေနဲ့ `null` ကို ပို့နိုင်ပါတယ်။

#### ဥပမာ — Initializer function ကို ပို့ခြင်း

ဒီဥပမာက initializer function ကို ပို့ထားလို့ — `createInitialState` function က initialization အတွင်းမှာပဲ run ပါတယ်။ Component က re-render ဖြစ်တဲ့အခါ (ဥပမာ — input ထဲ စာရိုက်တဲ့အခါ) ပြန် run မပါဘူး:

```js
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

ဆန့်ကျင်ဘက်အနေနဲ့ — initializer function ကို မပို့ဘဲ `useReducer(reducer, createInitialState(username))` လို — initial state ကို argument အနေနဲ့ တိုက်ရိုက် တွက်ခိုင်းရင်တော့ — `createInitialState` က render တိုင်း (input ထဲ စာရိုက်တိုင်း အပါအဝင်) ပြန် run ပါလိမ့်မယ်။ အပြုအမူပိုင်း မြင်သာတဲ့ ကွာခြားချက် မရှိပေမယ့် — ဒီ code က ပိုပြီး ထိရောက်မှု နည်းပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Action တစ်ခု dispatch လုပ်ပြီးမှ log လုပ်ကြည့်ရင် state အဟောင်းကိုပဲ မြင်နေရတယ်

`dispatch` function ကို ခေါ်တာက **လက်ရှိ run နေတဲ့ code ထဲက state ကို မပြောင်းပါဘူး:**

```js
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

ဒါက [state တွေက snapshot တစ်ခုလိုပဲ အပြုအမူ ရှိလို့ပါ](/docs/react/state-snapshot)။ State ကို update လုပ်တာက — state တန်ဖိုးအသစ်နဲ့ render တစ်ခု ထပ်တောင်းတာပါ — လက်ရှိ run နေတဲ့ event handler ထဲက `state` JavaScript variable ကိုတော့ မထိခိုက်ပါဘူး။

Next state ရဲ့ တန်ဖိုးကို ခန့်မှန်းကြည့်ချင်ရင် — reducer ကို ကိုယ်တိုင် ခေါ်ပြီး လက်နဲ့ တွက်ကြည့်နိုင်ပါတယ်:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

### Action တစ်ခု dispatch လုပ်ပေမယ့် screen ပေါ်မှာ update မဖြစ်ဘူး

Next state က အရင် state နဲ့ တူနေရင် — [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်ပြီး ဆုံးဖြတ်ပါတယ် — React က **သင့် update ကို လျစ်လျူရှုပါတယ်။** ဒါက အများအားဖြင့် — state ထဲက object (သို့) array တစ်ခုကို တိုက်ရိုက် ပြောင်းလိုက်လို့ ဖြစ်တတ်ပါတယ်:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

ရှိနေပြီးသား `state` object ကို mutate လုပ်ပြီး ပြန်ပေးလိုက်လို့ — React က update ကို လျစ်လျူရှုလိုက်တာပါ။ ဖြေရှင်းဖို့ — [state ထဲက objects](/docs/react/updating-objects-in-state) နဲ့ [state ထဲက arrays](/docs/react/updating-arrays-in-state) တွေကို mutate လုပ်မယ့်အစား — အစားထိုး update လုပ်နေဖို့ အမြဲ သေချာပါစေ:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

### Dispatch လုပ်ပြီးနောက် reducer state ရဲ့ အစိတ်အပိုင်း တစ်ချို့ undefined ဖြစ်သွားတယ်

`case` branch တိုင်းက — state အသစ် ပြန်ပေးတဲ့အခါ **ရှိပြီးသား fields တွေ အားလုံးကို ကူးယူ** ထားဖို့ သေချာပါစေ:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

အထက်မှာ `...state` မပါဘူးဆိုရင် — ပြန်ပေးလိုက်တဲ့ next state မှာ `age` field တစ်ခုပဲ ပါပြီး — တခြားဟာ ဘာမှ မပါတော့ပါဘူး။

### Dispatch လုပ်ပြီးနောက် reducer state တစ်ခုလုံး undefined ဖြစ်သွားတယ်

State က မထင်မှတ်ဘဲ `undefined` ဖြစ်သွားရင် — `case` တစ်ခုခုထဲမှာ `return` လုပ်ဖို့ မေ့နေတာ (သို့) action type က `case` တစ်ခုမှနဲ့ မကိုက်ညီတာ ဖြစ်နိုင်ပါတယ်။ ဘာကြောင့်လဲ ရှာဖို့ — `switch` ရဲ့ အပြင်ဘက်မှာ error တစ်ခု throw လုပ်ထားပါ:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

ဒီလိုမျိုး mistake တွေကို ဖမ်းဖို့ — TypeScript လိုမျိုး static type checker တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။

### "Too many re-renders" error တစ်ခု ရနေတယ်

`Too many re-renders. React limits the number of renders to prevent an infinite loop.` ဆိုတဲ့ error ကို မြင်ရနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် ဒါက — render *အတွင်းမှာ* action ကို unconditional (အခြေအနေမခွဲဘဲ) dispatch လုပ်မိလို့ပါ — အဲဒါဆို သင့် component က render → dispatch (render ဖြစ်စေတယ်) → render → dispatch ... ဆိုပြီး loop ထဲ ရောက်သွားပါတယ်။ Event handler တစ်ခုကို သတ်မှတ်ရာမှာ အမှားလုပ်မိလို့ အဖြစ်များပါတယ်:

```js
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

ဒီ error ရဲ့ အကြောင်းရင်းကို ရှာမတွေ့သေးရင် — console ထဲက error ဘေးက arrow ကို နှိပ်ပြီး — JavaScript stack ထဲမှာ error အတွက် တာဝန်ရှိတဲ့ `dispatch` function call အတိအကျကို ရှာကြည့်ပါ။

### Reducer (သို့) initializer function က နှစ်ခါ run ဖြစ်နေတယ်

[Strict Mode](/docs/react/strict-mode) မှာ React က သင့် reducer နဲ့ initializer functions တွေကို နှစ်ခါ ခေါ်ပါတယ်။ ဒါက သင့် code ကို မချိုးဖျက်သင့်ပါဘူး။

ဒီ **development-only** အပြုအမူက — [components တွေကို pure ဖြစ်အောင် ထားဖို့](/docs/react/keeping-components-pure) ကူညီပေးပါတယ်။ React က ခေါ်မှု နှစ်ခုထဲက ရလဒ် တစ်ခုကို သုံးပြီး — နောက်တစ်ခုရဲ့ ရလဒ်ကို လျစ်လျူရှုပါတယ်။ သင့် component ၊ initializer နဲ့ reducer functions တွေက pure ဖြစ်နေသရွေ့ — သင့် logic ကို မထိခိုက်ပါဘူး။ ဒါပေမယ့် မတော်တဆ impure ဖြစ်နေရင်တော့ — ဒီနှစ်ခါ ခေါ်မှုက mistake တွေကို သတိထားမိစေပါတယ်။

ဥပမာ — ဒီ impure reducer function က state ထဲက array တစ်ခုကို mutate လုပ်ပါတယ်:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

React က သင့် reducer function ကို နှစ်ခါ ခေါ်တာမို့ — todo က နှစ်ခါ ထည့်သွင်းခံရတာကို မြင်ရပြီး — mistake ရှိနေကြောင်း သိလိုက်ရပါတယ်။ ဒီဥပမာမှာ — array ကို mutate လုပ်မယ့်အစား [အစားထိုး ဖန်တီးပေးခြင်း](/docs/react/updating-arrays-in-state) နဲ့ ပြင်နိုင်ပါတယ်:

```js
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

ခုဆို ဒီ reducer function က pure ဖြစ်သွားလို့ — နောက်တစ်ခါ အပိုခေါ်လည်း အပြုအမူပိုင်း ကွာခြားမှု မရှိတော့ပါဘူး။ ဒါကြောင့် React က နှစ်ခါ ခေါ်တာက — mistakes တွေ ရှာတွေ့စေတာပါ။ **Component ၊ initializer နဲ့ reducer functions တွေပဲ pure ဖြစ်ဖို့ လိုပါတယ်။** Event handlers တွေက pure ဖြစ်စရာ မလိုပါဘူး — React က သင့် event handlers တွေကို ဘယ်တော့မှ နှစ်ခါ မခေါ်ပါဘူး။

[Components တွေကို pure ဖြစ်အောင် ထားခြင်း](/docs/react/keeping-components-pure) အကြောင်း ဆက်ဖတ်နိုင်ပါတယ်။
