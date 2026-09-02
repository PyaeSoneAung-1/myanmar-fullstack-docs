---
title: "Reducer နဲ့ Context ပေါင်းစပ်ခြင်း"
description: "Reducer နဲ့ context ကို ပေါင်းစပ်ပြီး ရှုပ်ထွေးတဲ့ screen တစ်ခုရဲ့ state ကို စီမံခြင်း — context objects ဖန်တီးခြင်း၊ state နဲ့ dispatch ကို context ထဲထည့်ခြင်း၊ wiring အားလုံးကို file တစ်ခုတည်းထဲ ရွှေ့ခြင်း"
order: 39
source: "https://react.dev/learn/scaling-up-with-reducer-and-context"
status: translated
updated: 2026-09-02
---

Reducers တွေက component တစ်ခုရဲ့ state update logic ကို စုစည်းနိုင်စေပါတယ်။ Context က တခြား components တွေဆီ နက်နက်ရှိုင်းရှိုင်း အချက်အလက်တွေ ပို့ဆောင်နိုင်စေပါတယ်။ သင်က reducers နဲ့ context တို့ကို ပေါင်းစပ်ပြီး — ရှုပ်ထွေးတဲ့ screen တစ်ခုရဲ့ state ကို စီမံခန့်ခွဲနိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Reducer တစ်ခုကို context နဲ့ ဘယ်လို ပေါင်းစပ်မလဲ
- Props တွေကနေ state နဲ့ dispatch ပို့ပေးနေရတာကို ဘယ်လို ရှောင်မလဲ
- Context နဲ့ state logic တွေကို file သပ်သပ်တစ်ခုထဲမှာ ဘယ်လို ထားမလဲ

## Reducer တစ်ခုကို Context နဲ့ ပေါင်းစပ်ခြင်း

[Reducer တွေရဲ့ မိတ်ဆက်](/docs/react/extracting-state-logic-into-a-reducer) ထဲက ဒီဥပမာမှာ — state ကို reducer တစ်ခုက စီမံပါတယ်။ Reducer function ထဲမှာ state update logic တွေ အားလုံး ပါဝင်ပြီး — ဒီ file ရဲ့ အောက်ခြေမှာ ကြေညာထားပါတယ်:

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>Day off in Kyoto</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
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

```js src/TaskList.js
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

Reducer တစ်ခုက event handlers တွေကို တိုတိုနဲ့ ကျစ်လျစ်နေအောင် ကူညီပေးပါတယ်။ ဒါပေမယ့် — သင့် app ကြီးလာတာနဲ့အမျှ — နောက်ထပ် အခက်အခဲတစ်ခုကို ကြုံရနိုင်ပါတယ်။ **လောလောဆယ် — `tasks` state နဲ့ `dispatch` function တွေက top-level `TaskApp` component ထဲမှာပဲ ရနိုင်ပါတယ်။** တခြား components တွေက task list ကို ဖတ်နိုင် ဒါမှမဟုတ် ပြောင်းနိုင်ဖို့ — လက်ရှိ state နဲ့ သူ့ကို ပြောင်းလဲပေးတဲ့ event handlers တွေကို props အနေနဲ့ [အောက်ကို ရှင်းရှင်းလင်းလင်း ပို့ပေး](/docs/react/props) ရပါတယ်။

ဥပမာ — `TaskApp` က task list နဲ့ event handlers တွေကို `TaskList` ဆီ ပို့ပေးပါတယ်:

```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

ပြီးတော့ `TaskList` က event handlers တွေကို `Task` ဆီ ပို့ပေးပါတယ်:

```js
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

ဒီလို သေးငယ်တဲ့ ဥပမာမှာတော့ — ဒါက ကောင်းကောင်း အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် — ကြားထဲမှာ component ဆယ်ခု ဒါမှမဟုတ် ရာချီ ရှိနေရင် — state နဲ့ functions တွေ အားလုံးကို props တွေကနေ အောက်ကို ပို့ပေးနေရတာက အရမ်း စိတ်ပျက်စရာ ကောင်းနိုင်ပါတယ်!

ဒါကြောင့် — props တွေကနေ ပို့ပေးတာရဲ့ အခြားရွေးချယ်စရာအနေနဲ့ — `tasks` state ရော `dispatch` function ပါ နှစ်ခုလုံးကို [context ထဲ ထည့်](/docs/react/passing-data-deeply-with-context) ချင်နိုင်ပါတယ်။ **ဒီနည်းနဲ့ — tree ထဲက `TaskApp` ရဲ့ အောက်မှာ ရှိတဲ့ component ဘယ်ဟာမဆို — "prop drilling" ထပ်မလုပ်ရဘဲ — tasks တွေကို ဖတ်နိုင်ပြီး — actions တွေကို dispatch လုပ်နိုင်ပါတယ်။**

Reducer တစ်ခုကို context နဲ့ ပေါင်းစပ်နည်းက ဒီလိုပါ:

1. Context ကို **ဖန်တီး** ပါ။
2. State နဲ့ dispatch ကို context ထဲ **ထည့်** ပါ။
3. Tree ထဲက ဘယ်နေရာမှာမဆို context ကို **သုံး** ပါ။

### အဆင့် 1: Context ကို ဖန်တီးခြင်း

`useReducer` Hook က လက်ရှိ `tasks` နဲ့ — သူတို့ကို update လုပ်ခွင့်ပေးတဲ့ `dispatch` function — တို့ကို ပြန်ပေးပါတယ်:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

သူတို့ကို tree အောက်ကို ပို့ပေးဖို့ — context သပ်သပ် နှစ်ခုကို [ဖန်တီး](/docs/react/passing-data-deeply-with-context) ရပါမယ်:

- `TasksContext` က လက်ရှိ task list ကို ပေးပါတယ်။
- `TasksDispatchContext` က components တွေကို actions dispatch လုပ်ခွင့်ပေးတဲ့ function ကို ပေးပါတယ်။

သူတို့ကို file သပ်သပ်တစ်ခုကနေ export လုပ်ထားပါ — ဒါမှ နောက်ပိုင်းမှာ တခြား files တွေကနေ import လုပ်လို့ရမှာပါ:

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>Day off in Kyoto</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/TasksContext.js active
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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

ဒီနေရာမှာ — context နှစ်ခုလုံးဆီ default value အနေနဲ့ `null` ကို ပို့ထားပါတယ်။ တကယ့် တန်ဖိုးတွေကို `TaskApp` component က ပေးပါလိမ့်မယ်။

### အဆင့် 2: State နဲ့ Dispatch ကို Context ထဲ ထည့်ခြင်း

အခု — သင့် `TaskApp` component ထဲမှာ context နှစ်ခုလုံးကို import လုပ်နိုင်ပါပြီ။ `useReducer()` က ပြန်ပေးတဲ့ `tasks` နဲ့ `dispatch` တွေကို ယူပြီး — အောက်က tree တစ်ခုလုံးဆီ [ပေးပို့](/docs/react/passing-data-deeply-with-context) ပါ:

```js
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        ...
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

အခုအချိန်မှာ — props တွေကရော context ထဲကပါ — အချက်အလက်တွေကို နှစ်နေရာလုံးကနေ ပို့ထားပါတယ်:

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

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
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext>
    </TasksContext>
  );
}

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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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

နောက် အဆင့်မှာ — prop ပို့ပေးတာတွေကို ဖယ်ရှားပါမယ်။


### အဆင့် 3: Tree ထဲက ဘယ်နေရာမှာမဆို Context ကို သုံးခြင်း

အခုဆိုရင် — task list ဒါမှမဟုတ် event handlers တွေကို tree အောက်ကို ပို့ပေးစရာ မလိုတော့ပါဘူး:

```js
<TasksContext value={tasks}>
  <TasksDispatchContext value={dispatch}>
    <h1>Day off in Kyoto</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext>
</TasksContext>
```

အဲဒီအစား — task list လိုအပ်တဲ့ component ဘယ်ဟာမဆို — `TasksContext` ကနေ ဖတ်နိုင်ပါတယ်:

```js
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

Task list ကို update လုပ်ဖို့ — component ဘယ်ဟာမဆို — context ကနေ `dispatch` function ကို ဖတ်ပြီး — သူ့ကို ခေါ်နိုင်ပါတယ်:

```js
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Add</button>
    // ...
```

**`TaskApp` component က event handlers တွေကို အောက်ကို မပို့တော့ဘဲ — `TaskList` ကလည်း `Task` component ဆီ event handlers တွေကို မပို့တော့ပါဘူး။** Component တစ်ခုချင်းစီက သူလိုအပ်တဲ့ context ကိုပဲ ဖတ်ပါတယ်:

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext>
    </TasksContext>
  );
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

**State က top-level `TaskApp` component ထဲမှာပဲ — `useReducer` နဲ့ စီမံထားလျက် — "နေထိုင်" နေဆဲပါ။** ဒါပေမယ့် — သူ့ရဲ့ `tasks` နဲ့ `dispatch` တွေကို — အခုဆိုရင် — ဒီ contexts တွေကို import လုပ်ပြီး သုံးခြင်းဖြင့် — tree ထဲက component တိုင်းအတွက် ရနိုင်ပါပြီ။

## Wiring တွေ အားလုံးကို File တစ်ခုတည်းထဲ ရွှေ့ခြင်း

ဒါကို လုပ်စရာ မလိုပါဘူး — ဒါပေမယ့် — reducer ရော context ပါ — file တစ်ခုတည်းထဲ ရွှေ့ခြင်းဖြင့် — components တွေကို ပိုပြီး ရှင်းလင်းအောင် လုပ်နိုင်ပါသေးတယ်။ လောလောဆယ် — `TasksContext.js` မှာ context declaration နှစ်ခုပဲ ပါပါတယ်:

```js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

ဒီ file က မကြာခင် လူကျဲကျဲ ဖြစ်တော့မှာပါ! Reducer ကို အဲဒီ file တစ်ခုထဲပဲ ရွှေ့ပါမယ်။ ပြီးရင် — file တစ်ခုတည်းမှာပဲ — `TasksProvider` component အသစ်တစ်ခုကို ကြေညာပါမယ်။ ဒီ component က အပိုင်းအစတွေ အားလုံးကို ချိတ်ဆက်ပေးပါလိမ့်မယ်:

1. သူက state ကို reducer တစ်ခုနဲ့ စီမံပါလိမ့်မယ်။
2. သူက context နှစ်ခုလုံးကို အောက်က components တွေဆီ ပေးပါလိမ့်မယ်။
3. သူ့ဆီ JSX ပို့လို့ရအောင် — [`children` ကို prop အဖြစ် လက်ခံ](/docs/react/props) ပါလိမ့်မယ်။

```js
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

**ဒါက သင့် `TaskApp` component ကနေ ရှုပ်ထွေးမှုတွေနဲ့ wiring တွေ အားလုံးကို ဖယ်ရှားပေးပါတယ်:**

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

ပြီးတော့ — context ကို *သုံး* တဲ့ functions တွေကိုလည်း — `TasksContext.js` ကနေ export လုပ်နိုင်ပါတယ်:

```js
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

Component တစ်ခုက context ကို ဖတ်ဖို့ လိုအပ်တဲ့အခါ — ဒီ functions တွေကနေ ဖတ်နိုင်ပါတယ်:

```js
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

ဒါက အပြုအမူကို ဘယ်လိုမှ မပြောင်းလဲပါဘူး — ဒါပေမယ့် — နောက်ပိုင်းမှာ ဒီ contexts တွေကို ထပ်ခွဲဖို့ ဒါမှမဟုတ် ဒီ functions တွေထဲ logic တစ်ချို့ ထည့်ဖို့ ခွင့်ပြုပါတယ်။ **အခုတော့ context ရော reducer ရဲ့ wiring တွေ အားလုံးက `TasksContext.js` ထဲမှာပါ။ ဒါက components တွေကို — data ဘယ်ကရလဲဆိုတာထက် — သူတို့ ဘာပြသလဲဆိုတာကိုပဲ အာရုံစိုက်ပြီး — သန့်ရှင်း၊ ရှင်းလင်းနေစေပါတယ်:**

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

`TasksProvider` ကို — tasks တွေနဲ့ ဘယ်လို ဆက်ဆံရမယ်ဆိုတာ သိတဲ့ screen ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့လည်းကောင်း — `useTasks` ကို သူတို့ကို ဖတ်တဲ့ နည်းလမ်းတစ်ခုအနေနဲ့လည်းကောင်း — `useTasksDispatch` ကို tree ထဲက အောက်က component ဘယ်ဟာကမဆို သူတို့ကို update လုပ်တဲ့ နည်းလမ်းတစ်ခုအနေနဲ့လည်းကောင်း — တွေးကြည့်နိုင်ပါတယ်။

> **မှတ်ချက်:** `useTasks` နဲ့ `useTasksDispatch` လိုမျိုး functions တွေကို *[Custom Hooks](/docs/react/reusing-logic-with-custom-hooks)* လို့ ခေါ်ပါတယ်။ သင့် function ရဲ့ နာမည်က `use` နဲ့ စတင်ရင် — အဲဒါက custom Hook တစ်ခုလို့ သတ်မှတ်ပါတယ်။ ဒါက — သူ့အတွင်းမှာ — `useContext` လိုမျိုး — တခြား Hooks တွေကို သုံးခွင့် ပေးပါတယ်။

သင့် app ကြီးလာတာနဲ့အမျှ — ဒီလို context-reducer တွဲတွေ အများအပြား ရှိလာနိုင်ပါတယ်။ ဒါက — tree ထဲ နက်နက်မှာ data တွေကို လက်လှမ်းမီချင်တိုင်း — အလုပ်အများကြီး မလိုဘဲ — သင့် app ကို scale လုပ်ပြီး [state ကို lift up](/docs/react/sharing-state-between-components) လုပ်ဖို့ အစွမ်းထက်တဲ့ နည်းလမ်းတစ်ခုပါ။

## အကျဉ်းချုပ်

- Reducer တစ်ခုကို context နဲ့ ပေါင်းစပ်ပြီး — သူ့အပေါ်က state ကို — component ဘယ်ဟာမဆို ဖတ်၊ update လုပ်နိုင်စေနိုင်ပါတယ်။
- အောက်က components တွေဆီ state နဲ့ dispatch function ပေးပို့ဖို့:
  1. Context နှစ်ခု (state အတွက်ရော dispatch functions တွေအတွက်ပါ) ဖန်တီးပါ။
  2. Reducer သုံးတဲ့ component ကနေ context နှစ်ခုလုံးကို ပေးပို့ပါ။
  3. ဖတ်ဖို့ လိုအပ်တဲ့ components တွေကနေ context တစ်ခုခုကို သုံးပါ။
- Wiring တွေ အားလုံးကို file တစ်ခုတည်းထဲ ရွှေ့ပြီး — components တွေကို ပိုရှင်းလင်းအောင် လုပ်နိုင်ပါတယ်။
  - Context ပေးပို့တဲ့ `TasksProvider` လိုမျိုး component တစ်ခုကို export လုပ်နိုင်ပါတယ်။
  - သူ့ကို ဖတ်ဖို့ `useTasks` နဲ့ `useTasksDispatch` လိုမျိုး custom Hooks တွေကိုလည်း export လုပ်နိုင်ပါတယ်။
- သင့် app ထဲမှာ ဒီလို context-reducer တွဲတွေ အများအပြား ရှိနိုင်ပါတယ်။
