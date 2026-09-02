---
title: "useContext"
description: "Component တစ်ခုကနေ context (tree တစ်လျှောက် data မျှဝေရန် သုံးသည့် mechanism) ၏ တန်ဖိုးကို ဖတ်ပြီး ပြောင်းလဲမှုများကို ခံယူနိုင်စေသည့် React Hook — provider ရှာဖွေပုံ၊ default value နှင့် state ဖြင့် context update လုပ်ခြင်း"
order: 53
source: "https://react.dev/reference/react/useContext"
status: translated
updated: 2026-09-02
---

`useContext` ဆိုတာ — သင့် component ကနေ [context](/docs/react/passing-data-deeply-with-context) တစ်ခုရဲ့ တန်ဖိုးကို ဖတ်ရှုပြီး — ၎င်းရဲ့ ပြောင်းလဲမှုတွေကို နောက်ဆုံး အခြေအနေအတိုင်း ဆက်လက် ခံယူနိုင်စေတဲ့ (read and subscribe) React Hook တစ်ခုပါ။

```js
const value = useContext(SomeContext)
```

## ရည်ညွှန်းချက် (Reference)

### `useContext(SomeContext)`

[Context](/docs/react/passing-data-deeply-with-context) တစ်ခုကို ဖတ်ရှုပြီး ၎င်းရဲ့ ပြောင်းလဲမှုတွေကို ခံယူဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useContext` ကို ခေါ်ပါတယ်:

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

**Parameters (ပါရာမီတာများ)**

- `SomeContext`: [`createContext`](https://react.dev/reference/react/createContext) နဲ့ သင်အရင်က ဖန်တီးထားတဲ့ context တစ်ခု။ Context ကိုယ်တိုင်က အချက်အလက်တွေကို သိမ်းဆည်းမထားပါဘူး — component တွေဆီ ပေးပို့နိုင်တဲ့ (သို့) component တွေကနေ ဖတ်နိုင်တဲ့ အချက်အလက် *အမျိုးအစား* ကိုပဲ ကိုယ်စားပြုပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`useContext` က ခေါ်ယူနေတဲ့ component အတွက် context value ကို ပြန်ပေးပါတယ်။ ဒီတန်ဖိုးကို — ခေါ်ယူနေတဲ့ component ရဲ့အပေါ်ဘက် tree ထဲမှာ အနီးဆုံးရှိတဲ့ `SomeContext` provider ဆီ `value` အနေနဲ့ ပေးထားတာကနေ ဆုံးဖြတ်ပါတယ်။ အဲဒီလို provider လုံးဝ မရှိဘူးဆိုရင် — အဲဒီ context အတွက် [`createContext`](https://react.dev/reference/react/createContext) မှာ သင်ပေးခဲ့တဲ့ `defaultValue` ကို ပြန်ပေးမှာ ဖြစ်ပါတယ်။ ပြန်ပေးတဲ့ တန်ဖိုးက အမြဲတမ်း အသစ်ဆုံး (up-to-date) ဖြစ်ပါတယ် — context တစ်ခုခု ပြောင်းသွားရင် — အဲဒီ context ကို ဖတ်နေတဲ့ component တွေကို React က အလိုအလျောက် re-render လုပ်ပေးလို့ပါ။

**Caveats (သတိပြုရမည့်အချက်များ)**

- Component တစ်ခုထဲက `useContext()` ခေါ်မှုကို — အဲဒီ component ကိုယ်တိုင်က ပြန်ပေးတဲ့ (အတွင်းမှာ ထားတဲ့) providers တွေက သက်ရောက်မှု မရှိပါဘူး။ သက်ဆိုင်ရာ `<Context>` က `useContext()` ခေါ်နေတဲ့ component ရဲ့ **အပေါ်မှာ** ရှိနေဖို့ လိုပါတယ်။
- `value` မတူညီတာကို ရရှိတဲ့ provider ကစပြီး — React က အဲဒီ context ကို သုံးနေတဲ့ children တွေ အားလုံးကို **အလိုအလျောက် re-render** လုပ်ပါတယ်။ ယခင် တန်ဖိုးနဲ့ နောက် တန်ဖိုးကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နှိုင်းယှဉ်မှုနဲ့ ယှဉ်ပါတယ်။ [`memo`](https://react.dev/reference/react/memo) နဲ့ re-render တွေကို ရှောင်ထားရင်တောင် — children တွေ context value အသစ်တွေ ရရှိတာကို မတားဆီးနိုင်ပါဘူး။
- သင့် build system က output ထဲမှာ module တွေ ထပ်နေအောင် ထုတ်ပေးနေရင် (symlinks တွေကြောင့် ဖြစ်တတ်ပါတယ်) — context က ပျက်စီးသွားနိုင်ပါတယ်။ Context မှတစ်ဆင့် တစ်ခုခု ပို့ပေးတာ အလုပ်လုပ်ဖို့ဆိုရင် — context ပေးပို့ဖို့ သုံးတဲ့ `SomeContext` နဲ့ ဖတ်ဖို့ သုံးတဲ့ `SomeContext` က `===` နှိုင်းယှဉ်ချက်အရ ***အတိအကျ တူညီတဲ့ object တစ်ခုတည်း*** ဖြစ်နေဖို့ လိုပါတယ်။

## အသုံးပြုပုံ (Usage)

### Tree ထဲသို့ Data နက်ရှိုင်းစွာ ပို့ဆောင်ခြင်း (Passing data deeply into the tree)

[Context](/docs/react/passing-data-deeply-with-context) တစ်ခုကို ဖတ်ရှုပြီး ၎င်းရဲ့ ပြောင်းလဲမှုတွေကို ခံယူဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useContext` ကို ခေါ်ပါတယ်:

```js
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` က သင်ပေးလိုက်တဲ့ context အတွက် context value ကို ပြန်ပေးပါတယ်။ Context value ကို ဆုံးဖြတ်ဖို့ — React က component tree ကို ရှာဖွေပြီး — အဲဒီ context အတွက် **အပေါ်ဆုံးမှာ အနီးဆုံး ဖြစ်တဲ့ context provider** ကို ရှာတွေ့ပါတယ်။

`Button` ဆီ context ပို့ပေးဖို့ — `Button` ကိုဖြစ်စေ၊ သူ့ရဲ့ parent component တစ်ခုခုကိုဖြစ်စေ — သက်ဆိုင်ရာ context provider ထဲမှာ ထည့်ပြီး ပတ်ထားပါ:

```js
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... အတွင်းမှာ buttons တွေ render လုပ်ထားပါတယ် ...
}
```

Provider နဲ့ `Button` ကြားမှာ component အလွှာ ဘယ်လောက်များများ ရှိရှာ ကိစ္စမရှိပါဘူး။ `Form` ရဲ့ အတွင်းက ဘယ်နေရာမှာမဆို ရှိတဲ့ `Button` တစ်ခုက `useContext(ThemeContext)` ကို ခေါ်လိုက်ရင် — `"dark"` တန်ဖိုးကို ရရှိပါလိမ့်မယ်။

> **သတိပြုရန်** — `useContext()` က အမြဲတမ်း သူ့ကို ခေါ်နေတဲ့ component ရဲ့ *အပေါ်မှာ* ရှိတဲ့ အနီးဆုံး provider ကိုပဲ ရှာပါတယ်။ အပေါ်ကိုပဲ ရှာတာမို့ — သင်က `useContext()` ခေါ်နေတဲ့ component ကိုယ်တိုင် အတွင်းမှာ ရှိတဲ့ providers တွေကိုတော့ ထည့်တွက်မပေးပါဘူး။

အောက်မှာ လက်တွေ့ အလုပ်လုပ်တဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ် — `MyApp` က `"dark"` theme ကို context ကနေ ပို့ပေးထားပြီး — `Form` အတွင်းက `Panel` နဲ့ `Button` component တွေက `useContext(ThemeContext)` နဲ့ ဖတ်ကာ — ကိုယ့်ရဲ့ class name တွေကို ရွေးချယ်ပါတယ်:

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```
```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

### Context မှတစ်ဆင့် ပို့ပေးတဲ့ Data ကို Update လုပ်ခြင်း (Updating data passed via context)

Context က အချိန်နဲ့အမျှ ပြောင်းလဲစေချင်တာမျိုး မကြာခဏ ရှိတတ်ပါတယ်။ Context ကို update လုပ်ဖို့ — [state](/docs/react/use-state) နဲ့ တွဲသုံးပါ။ Parent component ထဲမှာ state variable တစ်ခု ကြေညာပြီး — လက်ရှိ state ကို context value အဖြစ် provider ဆီ ပို့ပေးပါ:

```js
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext>
  );
}
```

အခုဆို — provider ရဲ့ အတွင်းက `Button` တစ်ခုခုက လက်ရှိ `theme` တန်ဖိုးကို ရရှိပါလိမ့်မယ်။ Provider ဆီ ပို့ပေးနေတဲ့ `theme` တန်ဖိုးကို `setTheme` နဲ့ update လုပ်လိုက်ရင် — `Button` component တွေ အားလုံး `'light'` တန်ဖိုးအသစ်နဲ့ re-render ဖြစ်သွားပါတယ်။

`value="dark"` က `"dark"` ဆိုတဲ့ string ကို ပို့ပေးတာဖြစ်ပြီး — `value={theme}` ကတော့ JavaScript `theme` variable ရဲ့ တန်ဖိုးကို [JSX curly braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces) နဲ့ ပို့ပေးတာပါ။ Curly braces တွေက string မဟုတ်တဲ့ context values တွေကိုလည်း ပို့ပေးနိုင်ပါတယ်။

Context update လုပ်တဲ့ ဥပမာတချို့ ဆက်ကြည့်ရအောင်:

#### Context ကနေ Object တစ်ခုကို Update လုပ်ခြင်း (Updating an object via context)

ဒီဥပမာမှာ — object တစ်ခုကို သိမ်းထားတဲ့ `currentUser` state variable တစ်ခု ရှိပါတယ်။ `{ currentUser, setCurrentUser }` ကို object တစ်ခုတည်းအဖြစ် ပေါင်းပြီး — `value={}` ထဲမှာ context မှတစ်ဆင့် အောက်ကို ပို့ပေးပါတယ်။ ဒါက — အောက်က component တစ်ခုခု (ဥပမာ `LoginButton`) က `currentUser` ရော `setCurrentUser` ပါ ဖတ်နိုင်စေပြီး — လိုအပ်တဲ့အခါ `setCurrentUser` ကို ခေါ်နိုင်စေပါတယ်။

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```
```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

#### Context နဲ့ Reducer တွဲသုံးပြီး Scale Up လုပ်ခြင်း (Scaling up with context and a reducer)

App ကြီးတွေမှာ — state တစ်ခုခုနဲ့ ဆိုင်တဲ့ logic တွေကို component တွေကနေ ခွဲထုတ်ဖို့ — context ကို [reducer](https://react.dev/reference/react/useReducer) နဲ့ တွဲသုံးတာ အဖြစ်များပါတယ်။ ဒီဥပမာမှာ — "wiring" (ချိတ်ဆက်မှု အားလုံး) ကို `TasksContext.js` ထဲမှာ ဝှက်ထားပြီး — အဲဒီထဲမှာ reducer တစ်ခုနဲ့ context နှစ်ခု ပါပါတယ်။

ဒီဥပမာရဲ့ အပြည့်အစုံ ရှင်းလင်းချက်ကို — [Reducer နဲ့ Context ကို အတူတကွ အသုံးပြုခြင်း](/docs/react/scaling-up-with-reducer-and-context) မှာ ဖတ်နိုင်ပါတယ်။

```js
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
```js
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
```js
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
```js
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

### Fallback Default Value သတ်မှတ်ခြင်း (Specifying a fallback default value)

Parent tree ထဲမှာ အဲဒီ context ရဲ့ provider တစ်ခုမှ React က ရှာမတွေ့ဘူးဆိုရင် — `useContext()` က ပြန်ပေးတဲ့ context value ဟာ — သင်အဲဒီ context ကို [ဖန်တီးစဉ်](https://react.dev/reference/react/createContext) သတ်မှတ်ခဲ့တဲ့ default value နဲ့ ညီမျှပါလိမ့်မယ်:

```js
const ThemeContext = createContext(null);
```

Default value က **ဘယ်တော့မှ မပြောင်းပါဘူး။** Context ကို update လုပ်ချင်ရင် — state နဲ့ တွဲသုံးပါ (အထက်က "Context မှတစ်ဆင့် ပို့ပေးတဲ့ Data ကို Update လုပ်ခြင်း" အပိုင်းမှာ ဖော်ပြထားသလို)။

မကြာခဏဆိုသလို — `null` အစား default အဖြစ် သုံးလို့ရတဲ့ ပိုပြီး အဓိပ္ပာယ်ရှိတဲ့ တန်ဖိုး တစ်ခုခု ရှိပါတယ်။ ဥပမာ:

```js
const ThemeContext = createContext('light');
```

ဒီနည်းနဲ့ — သက်ဆိုင်ရာ provider မပါဘဲ component တစ်ခုခုကို မတော်တဆ render လုပ်မိရင်တောင် — အလုပ်မပျက်ပါဘူး။ ဒါ့အပြင် — test environment မှာ providers တွေ အများကြီး တည်ဆောက်စရာ မလိုဘဲ — သင့် component တွေ ကောင်းကောင်း အလုပ်လုပ်နိုင်အောင်လည်း ကူညီပေးပါတယ်။

အောက်က ဥပမာမှာ — "Toggle theme" button က **theme context provider တစ်ခုခုရဲ့ အပြင်ဘက်မှာ** ရှိပြီး — context ရဲ့ default theme တန်ဖိုးက `'light'` ဖြစ်နေလို့ — အမြဲတမ်း light ဖြစ်နေပါတယ်။ Default theme ကို `'dark'` အဖြစ် ပြောင်းပြီး စမ်းကြည့်ပါ။

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```
```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

### Tree ရဲ့ အစိတ်အပိုင်းတစ်ခုအတွက် Context ကို Override လုပ်ခြင်း (Overriding context for a part of the tree)

Tree ရဲ့ အစိတ်အပိုင်းတစ်ခုကို — တန်ဖိုး မတူညီတဲ့ provider တစ်ခုထဲ ပတ်ထားခြင်းဖြင့် — context ကို override လုပ်နိုင်ပါတယ်:

```js
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

Providers တွေကို လိုသလောက် အကြိမ်ကြိမ် nest လုပ်ပြီး override လုပ်နိုင်ပါတယ်။

Override လုပ်တဲ့ ဥပမာတချို့ ဆက်ကြည့်ရအောင်:

#### Theme တစ်ခုကို Override လုပ်ခြင်း (Overriding a theme)

ဒီမှာ — `Footer` ရဲ့ *အတွင်းက* button က — အပြင်ဘက်က buttons တွေ ရရှိတဲ့ context value (`"dark"`) နဲ့ မတူညီတဲ့ — context value (`"light"`) တစ်ခုကို ရရှိပါတယ်။

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```
```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

Context providers တွေကို ထပ်ထပ်ချပြီး (nest) သုံးတဲ့အခါ — အချက်အလက်တွေ "စုပုံ" လာအောင် လုပ်နိုင်ပါတယ် — ဥပမာ — section တစ်ခုရဲ့ nesting အနက်ကို ခြေရာခံပြီး — heading level တွေကို အလိုအလျောက် သတ်မှတ်တာမျိုးပါ။ ဒီလို ဥပမာ အပြည့်အစုံကို — [Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း](/docs/react/passing-data-deeply-with-context) စာမျက်နှာမှာ ကြည့်နိုင်ပါတယ်။

### Objects နဲ့ Functions တွေ ပို့ပေးတဲ့အခါ Re-renders တွေကို အကောင်းဆုံးဖြစ်အောင် လုပ်ခြင်း (Optimizing re-renders when passing objects and functions)

Context ကနေ object တွေ၊ function တွေ အပါအဝင် — ဘယ်တန်ဖိုးမဆို ပို့ပေးနိုင်ပါတယ်။

```js
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

ဒီမှာ — context value က property နှစ်ခု ပါတဲ့ JavaScript object တစ်ခုဖြစ်ပြီး — အဲဒီထဲက တစ်ခုက function တစ်ခုပါ။ `MyApp` re-render ဖြစ်တိုင်း (ဥပမာ — route တစ်ခု ပြောင်းတဲ့အခါ) — ဒါက function အသစ်တစ်ခုကို ညွှန်ပြနေတဲ့ object *အသစ်* တစ်ခု ဖြစ်နေလို့ — `useContext(AuthContext)` ခေါ်နေတဲ့ tree အောက်က component တွေ အားလုံးကိုပါ React က re-render လုပ်ရပါတယ်။

App သေးသေးလေးတွေမှာ — ဒါက ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — အောက်ခံ data (ဥပမာ `currentUser`) မပြောင်းရသေးဘူးဆိုရင် — သူတို့ကို re-render လုပ်စရာ မလိုပါဘူး။ ဒီအချက်ကို React က အခွင့်ကောင်းယူနိုင်ဖို့ — `login` function ကို [`useCallback`](https://react.dev/reference/react/useCallback) နဲ့ ပတ်ပြီး — object ဖန်တီးမှုကို [`useMemo`](https://react.dev/reference/react/useMemo) နဲ့ ပတ်နိုင်ပါတယ်။ ဒါက performance optimization တစ်ခုပါ:

```js
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

ဒီပြောင်းလဲမှုရဲ့ ရလဒ်က — `MyApp` re-render ဖြစ်ဖို့ လိုနေရင်တောင် — `useContext(AuthContext)` ခေါ်နေတဲ့ component တွေက `currentUser` မပြောင်းသရွေ့ — re-render လုပ်စရာ မလိုတော့ပါဘူး။

[`useMemo`](https://react.dev/reference/react/useMemo#skipping-re-rendering-of-components) နဲ့ [`useCallback`](https://react.dev/reference/react/useCallback#skipping-re-rendering-of-components) အကြောင်း ဆက်ဖတ်ပါ။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### သင့် component က provider ရဲ့ value ကို မမြင်ရဘူး (My component doesn't see the value from my provider)

ဒီလို ဖြစ်တတ်တဲ့ နည်းလမ်း အများအပြား ရှိပါတယ်:

1. သင်က `useContext()` ခေါ်နေတဲ့ component ထဲမှာ (သို့) အောက်မှာ `<SomeContext>` ကို render လုပ်နေပါတယ်။ `<SomeContext>` ကို `useContext()` ခေါ်နေတဲ့ component ရဲ့ *အပေါ်နဲ့ အပြင်ဘက်* ကို ရွှေ့ပါ။
2. သင့် component ကို `<SomeContext>` နဲ့ ပတ်ထားဖို့ မေ့သွားတာ (သို့) သင်ထင်ထားတာနဲ့ မတူတဲ့ tree နေရာမှာ ထားမိတာ ဖြစ်နိုင်ပါတယ်။ [React DevTools](https://react.dev/learn/react-developer-tools) နဲ့ hierarchy မှန်မမှန် စစ်ဆေးကြည့်ပါ။
3. သင့် tooling မှာ build issue တစ်ခုခု ရှိနေလို့ — provider လုပ်တဲ့ component ဘက်က မြင်ရတဲ့ `SomeContext` နဲ့ — ဖတ်တဲ့ component ဘက်က မြင်ရတဲ့ `SomeContext` က object နှစ်ခု ကွဲနေတာ ဖြစ်နိုင်ပါတယ်။ ဥပမာ — symlinks သုံးထားရင် ဖြစ်တတ်ပါတယ်။ သူတို့ကို `window.SomeContext1` နဲ့ `window.SomeContext2` လို globals တွေဆီ သတ်မှတ်ပြီး — console ထဲမှာ `window.SomeContext1 === window.SomeContext2` ဟုတ်မဟုတ် စစ်ဆေးခြင်းဖြင့် အတည်ပြုနိုင်ပါတယ်။ မတူညီဘူးဆိုရင် — build tool အဆင့်မှာ ပြဿနာကို ဖြေရှင်းပါ။

### Default value ကွဲပြားနေပေမယ့် context ကနေ `undefined` ပဲ အမြဲ ရနေတယ် (I am always getting `undefined` from my context although the default value is different)

သင့် tree ထဲမှာ `value` မပါတဲ့ provider တစ်ခု ရှိနေလို့ ဖြစ်နိုင်ပါတယ်:

```js
// 🚩 အလုပ်မလုပ်ပါ — value prop မပါဘူး
<ThemeContext>
   <Button />
</ThemeContext>
```

`value` သတ်မှတ်ဖို့ မေ့သွားရင် — `value={undefined}` ပို့ပေးလိုက်တာနဲ့ အတူတူပါပဲ။

Prop နာမည် မှားပြီး သုံးမိတာလည်း ဖြစ်နိုင်ပါတယ်:

```js
// 🚩 အလုပ်မလုပ်ပါ — prop နာမည်ကို "value" လို့ ခေါ်ရမယ်
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

ဒီကိစ္စ နှစ်မျိုးလုံးမှာ — React က console မှာ warning တစ်ခု ပြပါလိမ့်မယ်။ ဖြေရှင်းဖို့ — prop ကို `value` လို့ ခေါ်ပါ:

```js
// ✅ value prop ကို ပို့ပေးလိုက်တာ
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

[`createContext(defaultValue)` ခေါ်မှုကနေ ရတဲ့ default value](https://react.dev/reference/react/createContext) ကို — **အပေါ်မှာ ကိုက်ညီတဲ့ provider လုံးဝ မရှိမှသာ** သုံးမှာ သတိပြုပါ။ Parent tree ထဲမှာ `<SomeContext value={undefined}>` component တစ်ခုခု ရှိနေရင် — `useContext(SomeContext)` ခေါ်နေတဲ့ component က context value အဖြစ် `undefined` ကိုပဲ ရရှိပါလိမ့်မယ်။

ဆက်စပ်ဖတ်ရှုရန် — [Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း](/docs/react/passing-data-deeply-with-context) နဲ့ [Reducer နဲ့ Context ကို အတူတကွ အသုံးပြုခြင်း](/docs/react/scaling-up-with-reducer-and-context)။
