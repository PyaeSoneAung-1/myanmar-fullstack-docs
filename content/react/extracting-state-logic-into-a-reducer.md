---
title: "State Logic ကို Reducer အဖြစ် ထုတ်ယူခြင်း"
description: "Reducer ဆိုတာ ဘာလဲ — state update logic တွေကို component အပြင်ဘက်က function တစ်ခုတည်းမှာ စုစည်းခြင်း၊ useState ကနေ useReducer ကို ဘယ်လို ပြောင်းမလဲ၊ reducer ကောင်းကောင်း ရေးနည်း"
order: 11
source: "https://react.dev/learn/extracting-state-logic-into-a-reducer"
status: translated
updated: 2026-09-01
---

State update အများကြီး event handler အများကြီးထဲမှာ ပြန့်ကျဲနေတဲ့ component တွေက ရင်ဆိုင်ရခက်လာနိုင်ပါတယ်။ ဒီလိုကိစ္စတွေအတွက် — state update logic အားလုံးကို သင့် component ရဲ့ အပြင်ဘက်မှာ — _reducer_ လို့ခေါ်တဲ့ function တစ်ခုတည်းထဲ စုစည်းနိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Reducer function ဆိုတာ ဘာလဲ
- `useState` ကနေ `useReducer` ကို ဘယ်လို refactor လုပ်မလဲ
- Reducer ကို ဘယ်အချိန် သုံးမလဲ
- Reducer ကောင်းကောင်း ဘယ်လို ရေးမလဲ

## Reducer တစ်ခုနဲ့ State Logic ကို စုစည်းခြင်း

သင့် component တွေ ပိုရှုပ်ထွေးလာတာနဲ့အမျှ — component တစ်ခုရဲ့ state ကို update လုပ်တဲ့ နည်းလမ်းအမျိုးမျိုးကို တစ်ချက်ကြည့်ရုံနဲ့ မြင်ရတာ ပိုခက်လာပါတယ်။ ဥပမာ — အောက်က `TaskApp` component က state ထဲမှာ `tasks` array တစ်ခုကို ကိုင်ထားပြီး — task တွေ ထည့်ဖို့၊ ဖယ်ဖို့၊ edit လုပ်ဖို့ event handler သုံးခု မတူညီတာ သုံးထားပါတယ်:

```jsx
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```
```jsx
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```
```jsx
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```
```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```
သူ့ရဲ့ event handler တစ်ခုချင်းစီက state ကို update လုပ်ဖို့ `setTasks` ကို ခေါ်ပါတယ်။ Component ကြီးထွားလာတာနဲ့အမျှ — အဲဒီထဲမှာ ပြန့်ကျဲနေတဲ့ state logic ပမာဏလည်း တိုးလာပါတယ်။ ဒီရှုပ်ထွေးမှုကို လျှော့ချပြီး — logic အားလုံးကို လွယ်လွယ်ကူကူ ရောက်လို့ရတဲ့ နေရာတစ်ခုတည်းမှာ ထားဖို့ — အဲဒီ state logic ကို သင့် component ရဲ့ အပြင်ဘက်က function တစ်ခုတည်းထဲ ရွှေ့နိုင်ပါတယ် — အဲဒါကို **"reducer"** လို့ ခေါ်ပါတယ်။

Reducer တွေက state ကို ကိုင်တွယ်တဲ့ နည်းလမ်း မတူညီတာတစ်ခုပါ။ `useState` ကနေ `useReducer` ကို အဆင့် သုံးဆင့်နဲ့ ပြောင်းနိုင်ပါတယ်:

1. State ကို set လုပ်တာကနေ action တွေ dispatch လုပ်တာဆီ **ပြောင်းပါ။**
2. Reducer function တစ်ခုကို **ရေးပါ။**
3. သင့် component ကနေ reducer ကို **သုံးပါ။**

### အဆင့် ၁ — State Set လုပ်ခြင်းကနေ Action Dispatch လုပ်ခြင်းဆီ ပြောင်းပါ

သင့် event handler တွေက လက်ရှိမှာ — state ကို set လုပ်ခြင်းဖြင့် _ဘာလုပ်ရမယ်_ ဆိုတာကို သတ်မှတ်ပါတယ်:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```
State setting logic အားလုံးကို ဖယ်ရှားပါ။ ကျန်ခဲ့တာက event handler သုံးခုပါ:

- `handleAddTask(text)` — user က "Add" ကို နှိပ်တဲ့အခါ ခေါ်ပါတယ်။
- `handleChangeTask(task)` — user က task တစ်ခုကို toggle လုပ်တဲ့အခါ ဒါမှမဟုတ် "Save" ကို နှိပ်တဲ့အခါ ခေါ်ပါတယ်။
- `handleDeleteTask(taskId)` — user က "Delete" ကို နှိပ်တဲ့အခါ ခေါ်ပါတယ်။

Reducer တွေနဲ့ state ကို စီမံတာက state ကို တိုက်ရိုက် set လုပ်တာနဲ့ နည်းနည်း ကွာပါတယ်။ React ကို state set လုပ်ပြီး "ဘာလုပ်ရမယ်" လို့ ပြောမယ့်အစား — သင့် event handler တွေကနေ "action" တွေကို dispatch လုပ်ပြီး "user က ဘာလုပ်လိုက်လဲ" ဆိုတာကို သတ်မှတ်ပါတယ်။ (State update logic က တစ်ခြားနေရာမှာ နေထိုင်ပါလိမ့်မယ်!) ဒါကြောင့် — event handler ကနေ "`tasks` ကို set လုပ်တာ" အစား — "task တစ်ခု ထည့်လိုက်တယ်/ပြောင်းလိုက်တယ်/ဖျက်လိုက်တယ်" ဆိုတဲ့ action တစ်ခုကို dispatch လုပ်နေတာပါ။ ဒါက user ရဲ့ ရည်ရွယ်ချက်ကို ပိုဖော်ပြနိုင်ပါတယ်။

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```
`dispatch` ဆီ သင်ပို့လိုက်တဲ့ object ကို "action" လို့ ခေါ်ပါတယ်:

```js
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```
ဒါက သာမန် JavaScript object တစ်ခုပါ။ အဲဒီထဲ ဘာထည့်မလဲဆိုတာ သင်ဆုံးဖြတ်ပါတယ် — ဒါပေမယ့် ယေဘုယျအားဖြင့် _ဘာဖြစ်ခဲ့လဲ_ ဆိုတဲ့ အချက်အလက် အနည်းဆုံးကို ပါဝင်သင့်ပါတယ်။ (`dispatch` function ကိုယ်တိုင်ကို နောက်အဆင့်တစ်ခုမှာ ထည့်ပါမယ်။)

> **မှတ်ချက်:** Action object က ဘယ်ပုံစံမဆို ဖြစ်နိုင်ပါတယ်။
>
> စည်းမျဉ်းအရ — ဘာဖြစ်ခဲ့လဲဆိုတာကို ဖော်ပြတဲ့ string `type` တစ်ခုကို ပေးပြီး — အပိုအချက်အလက်တွေကို တခြား field တွေမှာ ပို့တာ အဖြစ်များပါတယ်။ `type` က component တစ်ခုနဲ့ သက်ဆိုင်တာမို့ — ဒီဥပမာမှာဆိုရင် `'added'` ဖြစ်ဖြစ် `'added_task'` ဖြစ်ဖြစ် နှစ်ခုလုံး အဆင်ပြေပါတယ်။ ဘာဖြစ်ခဲ့လဲဆိုတာ ပြောတဲ့ နာမည်တစ်ခု ရွေးပါ!
>
> ```js
> dispatch({
>   // specific to component
>   type: 'what_happened',
>   // other fields go here
> });
> ```
### အဆင့် ၂ — Reducer Function တစ်ခု ရေးပါ

Reducer function က သင့် state logic ထည့်မယ့်နေရာပါ။ သူက argument နှစ်ခုကို လက်ခံပါတယ် — လက်ရှိ state နဲ့ action object — ပြီးတော့ နောက် state ကို ပြန်ပေးပါတယ်:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```
React က reducer ကနေ သင်ပြန်ပေးတဲ့အရာကို state အဖြစ် set လုပ်ပါလိမ့်မယ်။

ဒီဥပမာမှာ — သင့် event handler တွေထဲက state setting logic တွေကို reducer function ဆီ ရွှေ့ဖို့:

1. လက်ရှိ state (`tasks`) ကို ပထမ argument အဖြစ် ကြေညာပါ။
2. `action` object ကို ဒုတိယ argument အဖြစ် ကြေညာပါ။
3. Reducer ကနေ _နောက်_ state ကို ပြန်ပေးပါ (React က အဲဒါကို state အဖြစ် set လုပ်ပါလိမ့်မယ်)။

ဒီမှာ — state setting logic အားလုံးကို reducer function တစ်ခုဆီ ရွှေ့ထားတာပါ:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```
Reducer function က state (`tasks`) ကို argument အဖြစ် လက်ခံတာမို့ — သူ့ကို သင့် component ရဲ့ **အပြင်ဘက်မှာ ကြေညာနိုင်ပါတယ်။** ဒါက indentation အဆင့်ကို လျှော့ချပေးပြီး — သင့် code ကို ဖတ်ရလွယ်စေနိုင်ပါတယ်။

> **မှတ်ချက်:** အထက်က code က if/else statements တွေ သုံးထားပေမယ့် — reducer တွေထဲမှာ [switch statements](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) သုံးတာ စည်းမျဉ်းတစ်ခုပါ။ ရလဒ်က အတူတူပါပဲ — ဒါပေမယ့် switch statements တွေက တစ်ချက်ကြည့်ရုံနဲ့ ဖတ်ရလွယ်နိုင်ပါတယ်။
>
> ဒီ documentation ရဲ့ ကျန်တဲ့နေရာတွေမှာ ဒီလိုမျိုး သုံးသွားပါမယ်:
>
> ```js
> function tasksReducer(tasks, action) {
>   switch (action.type) {
>     case 'added': {
>       return [
>         ...tasks,
>         {
>           id: action.id,
>           text: action.text,
>           done: false,
>         },
>       ];
>     }
>     case 'changed': {
>       return tasks.map((t) => {
>         if (t.id === action.task.id) {
>           return action.task;
>         } else {
>           return t;
>         }
>       });
>     }
>     case 'deleted': {
>       return tasks.filter((t) => t.id !== action.id);
>     }
>     default: {
>       throw Error('Unknown action: ' + action.type);
>     }
>   }
> }
> ```
>
> `case` block တစ်ခုချင်းစီကို `{` နဲ့ `}` curly braces တွေနဲ့ ပတ်ထားဖို့ အကြံပြုပါတယ် — ဒါမှ `case` မတူညီတာတွေထဲမှာ ကြေညာထားတဲ့ variable တွေ တစ်ခုနဲ့တစ်ခု တိုက်မိမှာ မဟုတ်လို့ပါ။ ပြီးတော့ — `case` တစ်ခုက များသောအားဖြင့် `return` နဲ့ အဆုံးသတ်သင့်ပါတယ်။ `return` လုပ်ဖို့ မေ့သွားရင် — code က နောက် `case` ဆီ "fall through" ဖြစ်ပြီး — အမှားတွေ ဖြစ်စေနိုင်ပါတယ်!
>
> Switch statements တွေနဲ့ မကျွမ်းကျင်သေးရင် — if/else သုံးတာ လုံးဝ အဆင်ပြေပါတယ်။

#### Reducer တွေကို ဘာကြောင့် ဒီလိုနာမည် ခေါ်တာလဲ

Reducer တွေက သင့် component ထဲက code ပမာဏကို "reduce" (လျှော့ချ) နိုင်ပေမယ့် — တကယ်တော့ သူတို့ကို array တွေပေါ်မှာ လုပ်လို့ရတဲ့ [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) operation ကို အစွဲပြုပြီး နာမည်ပေးထားတာပါ။

`reduce()` operation က array တစ်ခုကို ယူပြီး — အများကြီးထဲကနေ တန်ဖိုးတစ်ခုတည်းကို "accumulate" (စုပေါင်း) လုပ်နိုင်စေပါတယ်:

```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```
`reduce` ဆီ သင်ပို့တဲ့ function ကို "reducer" လို့ ခေါ်ပါတယ်။ သူက _အခုထိ ရလဒ်_ နဲ့ _လက်ရှိ item_ ကို လက်ခံပြီး — _နောက်ရလဒ်_ ကို ပြန်ပေးပါတယ်။ React reducer တွေက အဲဒီအယူအဆတစ်ခုတည်းရဲ့ ဥပမာပါ — သူတို့က _အခုထိ state_ နဲ့ _action_ ကို လက်ခံပြီး — _နောက် state_ ကို ပြန်ပေးပါတယ်။ ဒီနည်းနဲ့ — action တွေကို အချိန်ကြာလာတာနဲ့အမျှ state အဖြစ် စုပေါင်းလိုက်တာပါ။

`reduce()` method ကို `initialState` တစ်ခုနဲ့ `actions` array တစ်ခုနဲ့တွဲပြီး — သင့် reducer function ကို အဲဒီဆီ ပို့ပေးခြင်းဖြင့် နောက်ဆုံး state ကို တွက်ချက်တောင်ရပါတယ်:

```js
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```
```js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```html
<pre id="output"></pre>
```
သင်ကိုယ်တိုင် ဒါမျိုး လုပ်ဖို့ မလိုနိုင်ပါဘူး — ဒါပေမယ့် React က လုပ်နေတာနဲ့ ဆင်တူပါတယ်!

### အဆင့် ၃ — သင့် Component ကနေ Reducer ကို သုံးပါ

နောက်ဆုံးအနေနဲ့ — `tasksReducer` ကို သင့် component နဲ့ ချိတ်ဆက်ဖို့ လိုပါတယ်။ React ကနေ `useReducer` Hook ကို import လုပ်ပါ:

```js
import { useReducer } from 'react';
```
ပြီးရင် `useState` ကို:

```js
const [tasks, setTasks] = useState(initialTasks);
```
ဒီလို `useReducer` နဲ့ အစားထိုးနိုင်ပါတယ်:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```
`useReducer` Hook က `useState` နဲ့ ဆင်တူပါတယ် — သူ့ကို initial state တစ်ခု ပေးရပြီး — stateful value တစ်ခုနဲ့ state ကို set လုပ်ဖို့ နည်းလမ်းတစ်ခု (ဒီကိစ္စမှာ dispatch function) ကို ပြန်ပေးပါတယ်။ ဒါပေမယ့် နည်းနည်းတော့ ကွာပါတယ်။

`useReducer` Hook က argument နှစ်ခု လက်ခံပါတယ်:

1. Reducer function တစ်ခု
2. Initial state တစ်ခု

ပြီးတော့ ပြန်ပေးပါတယ်:

1. Stateful value တစ်ခု
2. Dispatch function တစ်ခု (reducer ဆီ user actions တွေကို "dispatch" လုပ်ဖို့)

အခု အပြည့်အဝ ချိတ်ဆက်ပြီးပါပြီ! ဒီမှာ — reducer ကို component file ရဲ့ အောက်ဆုံးမှာ ကြေညာထားပါတယ်:

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```
```jsx
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```
```jsx
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```
```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```
လိုချင်ရင် — reducer ကို file တစ်ခု သီးခြားဆီ ရွှေ့တောင်ရပါတယ်:

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```
```js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```
```jsx
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```
```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```
ဒီလိုမျိုး ကိစ္စရပ်တွေကို ခွဲခြားထားတဲ့အခါ — component logic က ဖတ်ရပိုလွယ်ပါတယ်။ အခု — event handler တွေက action တွေကို dispatch လုပ်ပြီး _ဘာဖြစ်ခဲ့လဲ_ ကိုပဲ သတ်မှတ်ပြီး — reducer function က အဲဒါတွေကို တုံ့ပြန်ပြီး _state က ဘယ်လို update ဖြစ်မလဲ_ ကို ဆုံးဖြတ်ပါတယ်။

## `useState` နဲ့ `useReducer` ကို နှိုင်းယှဉ်ခြင်း

Reducer တွေမှာလည်း အားနည်းချက်တွေ မပါဘူးဆိုတာ မဟုတ်ပါဘူး! သူတို့ကို နှိုင်းယှဉ်နိုင်တဲ့ နည်းလမ်းတချို့ ဒီမှာပါ:

- **Code အရွယ်အစား:** ယေဘုယျအားဖြင့် `useState` နဲ့ဆိုရင် — ကနဦးမှာ code နည်းနည်းပဲ ရေးရပါတယ်။ `useReducer` နဲ့ဆိုရင် — reducer function တစ်ခုရော dispatch actions တွေပါ ရေးရပါတယ်။ ဒါပေမယ့် — event handler အများကြီးက state ကို ပုံစံဆင်တူတာမျိုးနဲ့ ပြင်နေရရင် — `useReducer` က code တွေကို လျှော့ချပေးနိုင်ပါတယ်။
- **ဖတ်ရလွယ်မှု:** State update တွေ ရိုးရှင်းတဲ့အခါ — `useState` က ဖတ်ရ အရမ်းလွယ်ပါတယ်။ ပိုရှုပ်ထွေးလာတဲ့အခါ — သူတို့က သင့် component ရဲ့ code ကို ဖောင်းပွစေပြီး ဖတ်ရခက်စေနိုင်ပါတယ်။ ဒီလိုအခါ — `useReducer` က update logic ရဲ့ _ဘယ်လို_ ဆိုတာကို event handler တွေရဲ့ _ဘာဖြစ်ခဲ့လဲ_ ဆိုတာကနေ သပ်သပ်ရပ်ရပ် ခွဲထုတ်နိုင်စေပါတယ်။
- **Debugging:** `useState` နဲ့ bug တစ်ခု ရှိတဲ့အခါ — state ကို ဘယ်မှာ မှားသတ်မှတ်ခဲ့လဲ၊ ဘာကြောင့်လဲဆိုတာ ပြောဖို့ ခက်နိုင်ပါတယ်။ `useReducer` နဲ့ဆိုရင် — reducer ထဲမှာ console log တစ်ခု ထည့်ပြီး state update တိုင်းကို မြင်နိုင်ပြီး — ဘာကြောင့် ဖြစ်ခဲ့လဲ (ဘယ် `action` ကြောင့်လဲ) ဆိုတာပါ သိနိုင်ပါတယ်။ `action` တစ်ခ်ချင်းစီ မှန်နေရင် — အမှားက reducer logic ကိုယ်တိုင်ထဲမှာ ရှိတယ်ဆိုတာ သင်သိပါလိမ့်မယ်။ ဒါပေမယ့် — `useState` ထက် code ပိုများများ လျှောက်ကြည့်ရပါတယ်။
- **Testing:** Reducer က သင့် component ပေါ် မမှီခိုတဲ့ pure function တစ်ခုပါ။ ဆိုလိုတာက — သူ့ကို export လုပ်ပြီး သီးခြား အထီးကျန် test လုပ်နိုင်ပါတယ်။ ယေဘုယျအားဖြင့် component တွေကို ပိုလက်တွေ့ကျတဲ့ environment မှာ test တာ အကောင်းဆုံးဖြစ်ပေမယ့် — ရှုပ်ထွေးတဲ့ state update logic တွေအတွက်တော့ — သင့် reducer က specific initial state နဲ့ action တစ်ခုအတွက် specific state တစ်ခုကို ပြန်ပေးတယ်ဆိုတာ စစ်ဆေးတာ အသုံးဝင်ပါတယ်။
- **ကိုယ်ပိုင်အကြိုက်:** တချို့လူတွေက reducer တွေ ကြိုက်ပြီး — တချို့က မကြိုက်ပါဘူး။ ဒါက အဆင်ပြေပါတယ်။ အကြိုက်ရဲ့ ကိစ္စပါ။ `useState` နဲ့ `useReducer` ကြားကို အချိန်မရွေး ပြောင်းပြန်လုပ်လို့ ရပါတယ် — သူတို့က ညီမျှပါတယ်!

Component တစ်ခုထဲမှာ — state update မှားတာကြောင့် bug တွေ မကြာခဏ ကြုံရပြီး — သူ့ရဲ့ code ထဲ structure ပိုထည့်ချင်ရင် reducer သုံးဖို့ အကြံပြုပါတယ်။ အရာအားလုံးအတွက် reducer သုံးစရာ မလိုပါဘူး — လွတ်လပ်စွာ ရောနှောသုံးလို့ရပါတယ်! Component တစ်ခုတည်းထဲမှာတောင် `useState` ရော `useReducer` ပါ သုံးလို့ရပါတယ်။

## Reducer တွေကို ကောင်းကောင်း ရေးခြင်း

Reducer ရေးတဲ့အခါ ဒီအချက် နှစ်ချက်ကို သတိရပါ:

- **Reducer တွေက pure ဖြစ်ရမယ်။** [State updater function](/docs/react/queueing-a-series-of-state-updates) တွေလိုပဲ — reducer တွေက rendering အတွင်းမှာ run ပါတယ်! (Actions တွေက နောက် render အထိ queue လုပ်ခံရပါတယ်။) ဆိုလိုတာက reducer တွေက [pure ဖြစ်ရမယ်](/docs/react/keeping-components-pure) — input တူရင် output တူရပါတယ်။ သူတို့က request တွေ မပို့သင့်ဘူး၊ timeout တွေ မစီစဉ်သင့်ဘူး၊ side effects တွေ (component အပြင်ဘက်က အရာတွေကို ထိခိုက်စေတဲ့ operations) မလုပ်သင့်ပါဘူး။ [Objects](/docs/react/updating-objects-in-state) နဲ့ [arrays](/docs/react/updating-arrays-in-state) တွေကို mutation မလုပ်ဘဲ update သင့်ပါတယ်။
- **Action တစ်ခုစီက user interaction တစ်ခုတည်းကို ဖော်ပြရမယ်** — အဲဒါက data ထဲမှာ ပြောင်းလဲမှု အများကြီး ဖြစ်စေရင်တောင် ဖြစ်ပါတယ်။ ဥပမာ — user က reducer နဲ့ စီမံထားတဲ့ field ငါးခုပါတဲ့ form တစ်ခုမှာ "Reset" ကို နှိပ်ရင် — `set_field` action ငါးခု သီးခြားစီ dispatch လုပ်မယ့်အစား — `reset_form` action တစ်ခုတည်း dispatch လုပ်တာ ပိုအဓိပ္ပါယ်ရှိပါတယ်။ Reducer ထဲမှာ action တိုင်းကို log လုပ်ရင် — အဲဒီ log က ဘယ် interaction တွေ/တုံ့ပြန်မှုတွေ ဘယ်လိုအစီအစဉ်နဲ့ ဖြစ်ခဲ့လဲဆိုတာကို ပြန်တည်ဆောက်လို့ရလောက်အောင် ရှင်းလင်းနေသင့်ပါတယ်။ ဒါက debugging အတွက် ကူညီပါတယ်!

## Immer နဲ့ Reducer တွေကို တိုတိုရှင်းရှင်း ရေးခြင်း

ပုံမှန် state ထဲက [objects](/docs/react/updating-objects-in-state#write-concise-update-logic-with-immer) နဲ့ [arrays](/docs/react/updating-arrays-in-state#write-concise-update-logic-with-immer) တွေကို update လုပ်သလိုပဲ — Immer library ကို သုံးပြီး reducer တွေကို ပိုတိုတိုရှင်းရှင်း ရေးနိုင်ပါတယ်။ ဒီမှာ — [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) က `push` ဒါမှမဟုတ် `arr[i] =` assignment တွေနဲ့ state ကို mutate လုပ်ခွင့် ပေးပါတယ်:

```jsx
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```
```jsx
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```
```jsx
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```
```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```
```json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```
Reducer တွေက pure ဖြစ်ရမှာမို့ — state ကို mutate မလုပ်သင့်ပါဘူး။ ဒါပေမယ့် Immer က mutate လုပ်ဖို့ ဘေးကင်းတဲ့ `draft` object အထူးတစ်ခုကို ပေးပါတယ်။ နောက်ကွယ်မှာ — Immer က `draft` မှာ သင်လုပ်ခဲ့တဲ့ ပြောင်းလဲမှုတွေနဲ့အတူ သင့် state ရဲ့ copy တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။ ဒါကြောင့် `useImmerReducer` နဲ့ စီမံထားတဲ့ reducer တွေက — သူတို့ရဲ့ ပထမ argument ကို mutate လုပ်နိုင်ပြီး state ကို ပြန်ပေးစရာ မလိုတာပါ။

## အကျဉ်းချုပ်

- `useState` ကနေ `useReducer` ကို ပြောင်းဖို့:
  1. Event handler တွေကနေ action တွေကို dispatch လုပ်ပါ။
  2. ပေးထားတဲ့ state နဲ့ action တစ်ခုအတွက် နောက် state ကို ပြန်ပေးတဲ့ reducer function တစ်ခု ရေးပါ။
  3. `useState` ကို `useReducer` နဲ့ အစားထိုးပါ။
- Reducer တွေက code နည်းနည်း ပိုရေးရပေမယ့် — debugging နဲ့ testing တွေအတွက် အကူအညီ ပေးပါတယ်။
- Reducer တွေက pure ဖြစ်ရပါမယ်။
- Action တစ်ခုစီက user interaction တစ်ခုတည်းကို ဖော်ပြရပါတယ်။
- Mutating ပုံစံနဲ့ reducer တွေ ရေးချင်ရင် Immer ကို သုံးပါ။

## စိန်ခေါ်မှုများ (Challenges)

### Event Handler တွေကနေ Action တွေကို Dispatch လုပ်ခြင်း

လက်ရှိမှာ — `ContactList.js` နဲ့ `Chat.js` ထဲက event handler တွေမှာ `// TODO` comments တွေ ရှိပါတယ်။ ဒါကြောင့် — input ထဲ ရိုက်တာ အလုပ်မလုပ်ဘဲ — button တွေ နှိပ်တာကလည်း ရွေးထားတဲ့ လက်ခံသူကို မပြောင်းတာပါ။

ဒီ `// TODO` နှစ်ခုကို — သက်ဆိုင်ရာ action တွေကို `dispatch` လုပ်တဲ့ code နဲ့ အစားထိုးပါ။ Action တွေရဲ့ မျှော်လင့်ထားတဲ့ ပုံစံနဲ့ type ကို ကြည့်ဖို့ — `messengerReducer.js` ထဲက reducer ကို စစ်ဆေးပါ။ Reducer က ရေးပြီးသားမို့ — သင်ပြောင်းစရာ မလိုပါဘူး။ `ContactList.js` နဲ့ `Chat.js` ထဲမှာပဲ action တွေကို dispatch လုပ်ဖို့ လိုပါတယ်။

> **အရိပ်အမြွက်:** `dispatch` function က component နှစ်ခုလုံးထဲမှာ prop အဖြစ် ပို့ပြီးသားမို့ — ရနိုင်ပြီးသားပါ။ ဒါကြောင့် သက်ဆိုင်ရာ action object နဲ့ `dispatch` ကို ခေါ်ဖို့ပဲ လိုပါတယ်။
>
> Action object ရဲ့ ပုံစံကို စစ်ဆေးဖို့ — reducer ကို ကြည့်ပြီး ဘယ် `action` field တွေကို မျှော်လင့်ထားလဲဆိုတာ ကြည့်နိုင်ပါတယ်။ ဥပမာ — reducer ထဲက `changed_selection` case က ဒီလိုပါ:
>
> ```js
> case 'changed_selection': {
>   return {
>     ...state,
>     selectedId: action.contactId
>   };
> }
> ```
>
> ဒါက သင့် action object မှာ `type: 'changed_selection'` ပါသင့်တယ်လို့ ဆိုလိုပါတယ်။ ပြီးတော့ `action.contactId` ကို သုံးထားတာလည်း တွေ့ရတာမို့ — သင့် action ထဲမှာ `contactId` property တစ်ခု ထည့်ဖို့ လိုပါတယ်။

```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
#### အဖြေ

Reducer code ကနေ — actions တွေက ဒီလိုပုံစံ ဖြစ်ဖို့ လိုတယ်လို့ ကောက်ချက်ချနိုင်ပါတယ်:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```
ဒီမှာ — သက်ဆိုင်ရာ messages တွေကို dispatch လုပ်ဖို့ update လုပ်ထားတဲ့ ဥပမာပါ:

```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
### Message ပို့လိုက်တဲ့အခါ Input ကို ရှင်းလင်းခြင်း

လက်ရှိမှာ — "Send" ကို နှိပ်တာက ဘာမှ မလုပ်ပါဘူး။ "Send" button မှာ event handler တစ်ခု ထည့်ပြီး:

1. လက်ခံသူရဲ့ email နဲ့ message ကို ပြတဲ့ `alert` တစ်ခု ပြပါ။
2. Message input ကို ရှင်းလင်းပါ။

```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
#### အဖြေ

"Send" button event handler မှာ လုပ်နိုင်တဲ့ နည်းလမ်း နှစ်ခုလောက် ရှိပါတယ်။ နည်းလမ်းတစ်ခုက — alert တစ်ခု ပြပြီး — `message` အလွတ်တစ်ခုနဲ့ `edited_message` action တစ်ခုကို dispatch လုပ်တာပါ:

```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
ဒါက အလုပ်လုပ်ပြီး — "Send" ကို နှိပ်လိုက်တဲ့အခါ input ကို ရှင်းပေးပါတယ်။

ဒါပေမယ့် — _user ရဲ့ အမြင်ကနေ_ ကြည့်ရင် — message ပို့တာက field ကို edit လုပ်တာနဲ့ action မတူပါဘူး။ အဲဒါကို ထင်ဟပ်ဖို့ — `sent_message` လို့ခေါ်တဲ့ action *အသစ်* တစ်ခုကို ဖန်တီးပြီး — reducer ထဲမှာ သီးခြား ကိုင်တွယ်နိုင်ပါတယ်:

```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
ရလဒ်အပြုအမူကတော့ အတူတူပါပဲ။ ဒါပေမယ့် — action types တွေက စံပြအနေနဲ့ "state ကို ဘယ်လို ပြောင်းချင်လဲ" ထက် — "user က ဘာလုပ်ခဲ့လဲ" ဆိုတာကို ဖော်ပြသင့်တယ်ဆိုတာ သတိရပါ။ ဒါက နောက်မှ feature အသစ်တွေ ထည့်ရတာ ပိုလွယ်စေပါတယ်။

ဘယ် solution ပဲ သုံးသုံး — `alert` ကို reducer ထဲမှာ **မထည့်မိဖို့** အရေးကြီးပါတယ်။ Reducer က pure function တစ်ခု ဖြစ်ရမယ် — နောက် state ကိုပဲ တွက်ချက်ရမယ်။ User ကို message ပြတာတွေ အပါအဝင် — ဘာကိုမှ "လုပ်" မလုပ်သင့်ပါဘူး။ အဲဒါတွေက event handler ထဲမှာ ဖြစ်သင့်ပါတယ်။ (ဒီလိုအမှားမျိုးတွေ ဖမ်းမိဖို့ — React က Strict Mode မှာ သင့် reducer တွေကို အကြိမ်များစွာ ခေါ်ပါတယ်။ ဒါကြောင့် reducer ထဲမှာ alert ထည့်ထားရင် — နှစ်ခါ ပြပါတယ်။)

### Tab တွေကြား ပြောင်းတဲ့အခါ Input တန်ဖိုးတွေကို ပြန်ရယူခြင်း

ဒီဥပမာမှာ — လက်ခံသူ မတူညီတာတွေကြား ပြောင်းတိုင်း — text input က အမြဲတမ်း ရှင်းသွားပါတယ်:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```
ဒါက — လက်ခံသူ အများကြီးကြားမှာ message draft တစ်ခုတည်းကို မျှဝေချင်လို့ မဟုတ်ပါဘူး။ ဒါပေမယ့် — သင့် app က contact တစ်ဦးချင်းစီအတွက် draft တစ်ခုကို သီးခြား "မှတ်မိ" ပြီး — contact တွေ ပြောင်းတဲ့အခါ ပြန်ရယူပေးရင် ပိုကောင်းပါလိမ့်မယ်။

သင့်တာဝန်က — contact *တစ်ဦးချင်းစီအတွက်* message draft ကို သီးခြားမှတ်မိအောင် — state ကို ဖွဲ့စည်းတဲ့နည်းလမ်း ပြောင်းဖို့ပါ။ Reducer ၊ initial state နဲ့ component တွေမှာ ပြောင်းလဲမှု အနည်းငယ် လုပ်ဖို့ လိုပါလိမ့်မယ်။

> **အရိပ်အမြွက်:** သင့် state ကို ဒီလိုမျိုး ဖွဲ့စည်းနိုင်ပါတယ်:
>
> ```js
> export const initialState = {
>   selectedId: 0,
>   messages: {
>     0: 'Hello, Taylor', // Draft for contactId = 0
>     1: 'Hello, Alice', // Draft for contactId = 1
>   },
> };
> ```
>
> `[key]: value` ဆိုတဲ့ [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) syntax က `messages` object ကို update လုပ်ဖို့ ကူညီနိုင်ပါတယ်:
>
> ```js
> {
>   ...state.messages,
>   [id]: message
> }
> ```
```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
#### အဖြေ

Contact တစ်ဦးချင်းစီအတွက် message draft တစ်ခုကို သီးခြားသိမ်းပြီး update လုပ်ဖို့ — reducer ကို update လုပ်ဖို့ လိုပါလိမ့်မယ်:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```
ပြီးတော့ — လက်ရှိ ရွေးထားတဲ့ contact အတွက် message ကို ဖတ်ဖို့ `Messenger` component ကိုလည်း update လုပ်ရပါမယ်:

```js
const message = state.messages[state.selectedId];
```
ဒီမှာ ပြီးပြည့်စုံတဲ့ solution ပါ:

```jsx
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
ထူးခြားတာက — ဒီလို မတူညီတဲ့ အပြုအမူကို implement ဖို့ event handler တွေကို ဘာမှ ပြောင်းစရာ မလိုခဲ့ပါဘူး။ Reducer မရှိရင် — state ကို update လုပ်တဲ့ event handler တိုင်းကို ပြောင်းရပါလိမ့်မယ်။

### `useReducer` ကို အစကနေ Implement လုပ်ခြင်း

အစောပိုင်း ဥပမာတွေမှာ — React ကနေ `useReducer` Hook ကို import လုပ်ခဲ့ပါတယ်။ ဒီတစ်ခါတော့ — _`useReducer` Hook ကိုယ်တိုင်_ ကို implement လုပ်ရမှာပါ! စလို့ရအောင် stub တစ်ခု ဒီမှာပါ။ Code ၁၀ line ထက်တော့ မပိုသင့်ပါဘူး။

သင့်ပြောင်းလဲမှုတွေကို စမ်းသပ်ဖို့ — input ထဲ ရိုက်ကြည့်ပါ ဒါမှမဟုတ် contact တစ်ခု ရွေးကြည့်ပါ။

> **အရိပ်အမြွက်:** ဒီမှာ implementation ရဲ့ အသေးစိတ် ပုံကြမ်းတစ်ခုပါ:
>
> ```js
> export function useReducer(reducer, initialState) {
>   const [state, setState] = useState(initialState);
> 
>   function dispatch(action) {
>     // ???
>   }
> 
>   return [state, dispatch];
> }
> ```
>
> Reducer function တစ်ခုက argument နှစ်ခု — လက်ရှိ state နဲ့ action object — ကို လက်ခံပြီး နောက် state ကို ပြန်ပေးတယ်ဆိုတာ သတိရပါ။ သင့် `dispatch` implementation က အဲဒါနဲ့ ဘာလုပ်သင့်လဲ?

```jsx
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```js
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
#### အဖြေ

Action တစ်ခုကို dispatch လုပ်တာက — reducer ကို လက်ရှိ state နဲ့ action နဲ့အတူ ခေါ်ပြီး — ရလဒ်ကို နောက် state အဖြစ် သိမ်းဆည်းပါတယ်။ Code ထဲမှာ ဒီလိုပုံစံ ရှိပါတယ်:

```jsx
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```
```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```
```js
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```
```jsx
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```
```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
အများစုမှာ ထူးခြားမှု မရှိပေမယ့် — ပိုတိကျတဲ့ implementation တစ်ခုက ဒီလိုမျိုးပါ:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```
ဒါက — dispatch လုပ်ထားတဲ့ actions တွေက နောက် render အထိ queue လုပ်ခံရလို့ပါ — [updater functions တွေလိုပဲ](/docs/react/queueing-a-series-of-state-updates)။

## နောက်တစ်ဆင့်တွေ

- [Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း](/docs/react/passing-data-deeply-with-context) — props တွေ ထပ်ခါထပ်ခါ ပို့နေစရာ မလိုဘဲ data ဖြန့်ဝေခြင်း
- [State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း](/docs/react/preserving-and-resetting-state) — state ကို ဘယ်အချိန် ထိန်းသိမ်း/ပြန်လည်သတ်မှတ်လဲ
