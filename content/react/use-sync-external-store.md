---
title: "useSyncExternalStore"
description: "React ပြင်ပက external store တစ်ခုကို subscribe လုပ်ဖတ်နိုင်တဲ့ React Hook — subscribe/getSnapshot/getServerSnapshot functions များ၊ browser APIs နဲ့ third-party state stores တွေကို ချိတ်ဆက်ခြင်း"
order: 64
source: "https://react.dev/reference/react/useSyncExternalStore"
status: translated
updated: 2026-09-02
---

`useSyncExternalStore` ဆိုတာ — external store (React ပြင်ပက ဒေတာသိုလှောင်ရာ) တစ်ခုကို subscribe လုပ်ပြီး ဖတ်နိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

## ရည်ညွှန်းချက် (Reference)

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`

External data store တစ်ခုကနေ တန်ဖိုးတစ်ခု ဖတ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useSyncExternalStore` ကို ခေါ်ပါတယ်:

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

ဒါက store ထဲက data ရဲ့ snapshot ကို ပြန်ပေးပါတယ်။ Argument အနေနဲ့ function နှစ်ခု ပို့ရပါတယ်:

1. `subscribe` function က store ကို subscribe လုပ်ပြီး — unsubscribe လုပ်တဲ့ function တစ်ခုကို ပြန်ပေးရပါတယ်။
2. `getSnapshot` function က store ကနေ data ရဲ့ snapshot တစ်ခုကို ဖတ်ရပါတယ်။

#### Parameters

- `subscribe` — `callback` argument တစ်ခုတည်းကို လက်ခံပြီး — store ဆီ subscribe လုပ်ပေးတဲ့ function တစ်ခုပါ။ Store ပြောင်းလဲတဲ့အခါ — ပေးလိုက်တဲ့ `callback` ကို ခေါ်ရပါတယ် — အဲဒါက React ကို `getSnapshot` ကို ပြန်ခေါ်စေပြီး (လိုအပ်ရင်) component ကို re-render လုပ်စေပါတယ်။ `subscribe` function က subscription ကို ရှင်းလင်းပေးတဲ့ function တစ်ခုကို ပြန်ပေးရပါတယ်။
- `getSnapshot` — component လိုအပ်တဲ့ store ထဲက data ရဲ့ snapshot တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုပါ။ Store မပြောင်းသေးသရွေ့ — `getSnapshot` ကို ထပ်ခါထပ်ခါ ခေါ်ရင်လည်း တူညီတဲ့ value ကို ပြန်ပေးရပါတယ်။ Store ပြောင်းပြီး — ပြန်ပေးတဲ့ value က မတူတော့ရင် ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်လို့) — React က component ကို re-render လုပ်ပါတယ်။
- **optional** `getServerSnapshot` — store ထဲက data ရဲ့ ကနဦး snapshot ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။ Server rendering အတွင်းနဲ့ — client ပေါ်မှာ server-rendered content ကို hydration လုပ်ချိန်မှာပဲ သုံးပါတယ်။ Server snapshot က client နဲ့ server ကြားမှာ အတူတူ ဖြစ်ရပြီး — ပုံမှန်အားဖြင့် server ကနေ client ဆီ serialize လုပ်ပြီး ပို့ပါတယ်။ ဒီ argument ကို ချန်လိုက်ရင် — server ပေါ်မှာ component ကို render လုပ်တာက error ဖြစ်ပါလိမ့်မယ်။

#### Returns

သင့် rendering logic ထဲမှာ သုံးလို့ရတဲ့ store ရဲ့ လက်ရှိ snapshot ပါ။

#### Caveats

- `getSnapshot` က ပြန်ပေးတဲ့ store snapshot က **immutable (မပြောင်းလဲနိုင်သော)** ဖြစ်ရပါတယ်။ အောက်ခံ store မှာ mutable data ရှိနေရင် — data ပြောင်းခဲ့ရင် snapshot အသစ်တစ်ခု ပြန်ပေးပြီး — မပြောင်းရင် cache လုပ်ထားတဲ့ နောက်ဆုံး snapshot ကိုပဲ ပြန်ပေးပါ။
- Re-render တစ်ခုအတွင်း `subscribe` function မတူတာတစ်ခု ပို့ခံရရင် — React က အသစ်ပို့လိုက်တဲ့ `subscribe` function သုံးပြီး store ကို ပြန် subscribe လုပ်ပါတယ်။ `subscribe` ကို component အပြင်မှာ ကြေညာထားခြင်းဖြင့် ဒါကို ကာကွယ်နိုင်ပါတယ်။
- Store ကို [non-blocking Transition update](https://react.dev/reference/react/useTransition) တစ်ခုအတွင်း mutate လုပ်ခဲ့ရင် — React က အဲဒီ update ကို blocking update အဖြစ် ပြန်လုပ်ပါတယ်။ တိတိကျကျပြောရရင် — Transition update တိုင်းအတွက် — React က DOM ကို ပြောင်းလဲမှုတွေ မသက်ရောက်ခင် `getSnapshot` ကို ဒုတိယအကြိမ် ခေါ်ပါတယ်။ မူလ ခေါ်ခဲ့စဉ်ကနဲ့ မတူတဲ့ value ပြန်လာရင် — React က update ကို အစကနေ ပြန်စပြီး — ဒီတစ်ခါ blocking update အဖြစ် လုပ်ကာ — screen ပေါ်က component တိုင်း store ရဲ့ version တစ်ခုတည်းကိုပဲ ထင်ဟပ်နေတာ သေချာစေပါတယ်။
- `useSyncExternalStore` က ပြန်ပေးတဲ့ store value ကို အခြေခံပြီး render တစ်ခုကို *suspend* လုပ်တာကို အကြံပြုမထားပါဘူး။ အကြောင်းကတော့ — external store ကို mutate လုပ်တာတွေက [non-blocking Transition updates](https://react.dev/reference/react/useTransition) အဖြစ် မှတ်သားလို့ မရလို့ပါ — ဒါကြောင့် အနီးဆုံး [Suspense](https://react.dev/reference/react/Suspense) fallback ကို trigger လုပ်ပြီး — screen ပေါ်က render ပြီးသား content တွေကို loading spinner နဲ့ အစားထိုးလိုက်တာက — ပုံမှန်အားဖြင့် UX မကောင်းစေလို့ပါ။

  ဥပမာ — အောက်ကဟာမျိုးတွေက မအားပေးပါဘူး:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

## အသုံးပြုပုံ (Usage)

### External store တစ်ခုကို subscribe လုပ်ခြင်း

သင့် React components အများစုက — သူတို့ရဲ့ [props](https://react.dev/learn/passing-props-to-a-component)၊ [state](/docs/react/use-state) နဲ့ [context](/docs/react/use-context) ကနေပဲ data ဖတ်ပါလိမ့်မယ်။ ဒါပေမယ့် — တစ်ခါတစ်ရံ component တစ်ခုက — React ပြင်ပမှာ ရှိပြီး အချိန်နဲ့အမျှ ပြောင်းလဲနေတဲ့ store တစ်ခုခုကနေ data ဖတ်ဖို့ လိုပါတယ်။ ဒါတွေထဲမှာ ပါဝင်ပါတယ်:

- React ပြင်ပမှာ state ကို ကိုင်ထားတဲ့ third-party state management libraries တွေ။
- Mutable value တစ်ခုနဲ့ — သူ့ရဲ့ ပြောင်းလဲမှုတွေကို subscribe လုပ်ဖို့ events တွေ ထုတ်ပေးတဲ့ Browser APIs တွေ။

External data store တစ်ခုကနေ တန်ဖိုးတစ်ခု ဖတ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useSyncExternalStore` ကို ခေါ်ပါတယ်:

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

ဒါက store ထဲက data ရဲ့ snapshot ကို ပြန်ပေးပါတယ်။ Argument အနေနဲ့ function နှစ်ခု ပို့ရပါတယ်:

1. `subscribe` function က store ကို subscribe လုပ်ပြီး — unsubscribe လုပ်တဲ့ function တစ်ခုကို ပြန်ပေးရပါတယ်။
2. `getSnapshot` function က store ကနေ data ရဲ့ snapshot တစ်ခုကို ဖတ်ရပါတယ်။

React က ဒီ functions တွေကို သုံးပြီး — သင့် component ကို store နဲ့ subscribe ဖြစ်နေအောင် ထားပြီး — ပြောင်းလဲမှုတွေပေါ်မှာ re-render လုပ်ပေးပါတယ်။

ဥပမာ — အောက်က sandbox ထဲမှာ — `todosStore` ကို React ပြင်ပမှာ data သိမ်းထားတဲ့ external store တစ်ခုအနေနဲ့ ရေးထားပါတယ်။ `TodosApp` component က `useSyncExternalStore` Hook နဲ့ အဲဒီ external store ဆီ ချိတ်ဆက်ပါတယ်:

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

> **မှတ်ချက်:** ဖြစ်နိုင်ရင် — [useState](/docs/react/use-state) နဲ့ [useReducer](/docs/react/use-reducer) ပါတဲ့ React ရဲ့ built-in state ကို သုံးဖို့ အကြံပြုပါတယ်။ `useSyncExternalStore` API က — ရှိပြီးသား React မဟုတ်တဲ့ code တွေနဲ့ ပေါင်းစပ်ဖို့ လိုအပ်မှသာ အဓိက အသုံးဝင်ပါတယ်။

### Browser API တစ်ခုကို subscribe လုပ်ခြင်း

`useSyncExternalStore` ထည့်ရတဲ့ နောက်အကြောင်းရင်းတစ်ခုက — browser က ထုတ်ပေးပြီး အချိန်နဲ့အမျှ ပြောင်းလဲနေတဲ့ value တစ်ခုခုကို subscribe လုပ်ချင်တဲ့အခါပါ။ ဥပမာ — network connection က active ဖြစ်မဖြစ် သင့် component က ပြချင်တယ် ဆိုပါစို့။ Browser က ဒီအချက်အလက်ကို [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) ဆိုတဲ့ property ကနေ ထုတ်ပေးပါတယ်။

ဒီ value က React မသိဘဲ ပြောင်းလဲနိုင်လို့ — `useSyncExternalStore` နဲ့ ဖတ်သင့်ပါတယ်:

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`getSnapshot` function ကို ရေးဖို့ — browser API ကနေ လက်ရှိ တန်ဖိုးကို ဖတ်ပါ:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

ပြီးရင် — `subscribe` function ကို ရေးဖို့ လိုပါတယ်။ ဥပမာ — `navigator.onLine` ပြောင်းတဲ့အခါ browser က `window` object ပေါ်မှာ [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) နဲ့ [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events တွေကို ထုတ်ပါတယ်။ `callback` argument ကို သက်ဆိုင်ရာ events တွေဆီ subscribe ပြီး — subscriptions တွေကို ရှင်းပေးတဲ့ function တစ်ခု ပြန်ပေးရပါတယ်:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

အခုဆို React က — external `navigator.onLine` API ကနေ value ဖတ်ပုံရော — သူ့ရဲ့ ပြောင်းလဲမှုတွေကို subscribe လုပ်ပုံပါ သိပါပြီ။ ကွန်ရက်ကနေ ချိတ်ဖြုတ်ကြည့်ရင် — component က တုံ့ပြန်ပြီး re-render ဖြစ်တာ သတိထားမိပါလိမ့်မယ်:

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

### Logic ကို custom Hook တစ်ခုထဲ ထုတ်ယူခြင်း

ပုံမှန်အားဖြင့် — သင်က `useSyncExternalStore` ကို components တွေထဲမှာ တိုက်ရိုက် မရေးပါဘူး။ အဲဒီအစား — ကိုယ်ပိုင် custom Hook တစ်ခုကနေ ခေါ်လေ့ ရှိပါတယ်။ ဒါက — external store တစ်ခုတည်းကို component အမျိုးမျိုးကနေ သုံးနိုင်စေပါတယ်။

ဥပမာ — ဒီ custom `useOnlineStatus` Hook က network online ဖြစ်မဖြစ် ခြေရာခံပါတယ်:

```js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

အခုဆို — component အမျိုးမျိုးက — အောက်ခံ implementation ကို ထပ်ခါထပ်ခါ မရေးတော့ဘဲ `useOnlineStatus` ကို ခေါ်လို့ရပါတယ် — `StatusBar` က `✅ Online` / `❌ Disconnected` ပြတဲ့ heading ပြီး — `SaveButton` က offline ဖြစ်နေချိန်မှာ button ကို disable လုပ်ပါတယ်။

### Server rendering အတွက် ပံ့ပိုးမှု ထည့်ခြင်း

သင့် React app က [server rendering](https://react.dev/reference/react-dom/server) သုံးရင် — သင့် components တွေက ကနဦး HTML ထုတ်ဖို့ browser environment အပြင်မှာပါ run ပါတယ်။ ဒါက external store တစ်ခုနဲ့ ချိတ်ဆက်တဲ့အခါ စိန်ခေါ်မှု အနည်းငယ် ဖန်တီးပါတယ်:

- Browser-only API တစ်ခုနဲ့ ချိတ်ဆက်နေရင် — server ပေါ်မှာ အဲဒါ မရှိတာမို့ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။
- Third-party data store တစ်ခုနဲ့ ချိတ်ဆက်နေရင် — server နဲ့ client ကြားမှာ data တူညီဖို့ လိုပါတယ်။

ဒီပြဿနာတွေကို ဖြေရှင်းဖို့ — `getServerSnapshot` function တစ်ခုကို `useSyncExternalStore` ရဲ့ တတိယ argument အဖြစ် ပို့ပါ:

```js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot` function က `getSnapshot` နဲ့ ဆင်တူပေမယ့် — အခြေအနေ နှစ်မျိုးမှာပဲ run ပါတယ်:

- HTML ထုတ်တဲ့အခါ server ပေါ်မှာ run ပါတယ်။
- Client ပေါ်မှာ [hydration](https://react.dev/reference/react-dom/client/hydrateRoot) လုပ်ချိန် — ဆိုလိုတာက React က server HTML ကို ယူပြီး interactive ဖြစ်အောင် လုပ်နေချိန်မှာ run ပါတယ်။

ဒါက — app interactive မဖြစ်ခင်အထိ သုံးမယ့် ကနဦး snapshot value တစ်ခုကို ပေးနိုင်စေပါတယ်။ Server rendering အတွက် အဓိပ္ပာယ်ရှိတဲ့ ကနဦး value မရှိဘူးဆိုရင် — ဒီ argument ကို ချန်လိုက်ပြီး [client ပေါ်မှာပဲ render ဖြစ်အောင် လုပ်နိုင်ပါတယ်](https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)။

> **မှတ်ချက်:** `getServerSnapshot` က — client ရဲ့ ကနဦး render ပေါ်မှာ server ပေါ်မှာ ပြန်ပေးခဲ့တဲ့ data နဲ့ အတိအကျ တူညီတဲ့ data ကို ပြန်ပေးဖို့ သေချာပါစေ။ ဥပမာ — `getServerSnapshot` က server ပေါ်မှာ prepopulated store content တချို့ ပြန်ပေးခဲ့ရင် — အဲဒီ content ကို client ဆီ transfer လုပ်ဖို့ လိုပါတယ်။ နည်းလမ်းတစ်ခုက — server rendering အတွင်း `window.MY_STORE_DATA` လို global တစ်ခုကို set လုပ်တဲ့ `<script>` tag တစ်ခု ထုတ်ပြီး — client ဘက်က `getServerSnapshot` ထဲမှာ အဲဒီ global ကနေ ဖတ်တာပါ။ ဒါကို ဘယ်လို လုပ်ရမလဲဆိုတဲ့ ညွှန်ကြားချက်တွေကို သင့် external store က ပေးသင့်ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "The result of `getSnapshot` should be cached" error တစ်ခု ရနေတာ

ဒီ error က — သင့် `getSnapshot` function က ခေါ်တိုင်း object အသစ်တစ်ခု ပြန်ပေးနေလို့ပါ:

```js
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

`getSnapshot` ရဲ့ return value က နောက်ဆုံး ခေါ်ခဲ့တာနဲ့ မတူရင် — React က component ကို re-render လုပ်ပါတယ်။ ဒါကြောင့် — value မတူတာကို အမြဲ ပြန်ပေးနေရင် — infinite loop ထဲ ရောက်ပြီး — ဒီ error ကို ရပါတယ်။

တစ်ခုခု တကယ် ပြောင်းလဲမှသာ — သင့် `getSnapshot` က object မတူတာတစ်ခုကို ပြန်ပေးသင့်ပါတယ်။ Store ထဲမှာ immutable data ရှိရင် — အဲဒီ data ကို တိုက်ရိုက် ပြန်ပေးနိုင်ပါတယ်:

```js
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

Store data က mutable ဆိုရင် — သင့် `getSnapshot` function က အဲဒီထဲက immutable snapshot တစ်ခုကို ပြန်ပေးသင့်ပါတယ်။ ဆိုလိုတာက — object အသစ်တွေ ဖန်တီးဖို့ *လိုအပ်* ပေမယ့် — ခေါ်တိုင်း ဖန်တီးနေဖို့ မလိုပါဘူး။ အဲဒီအစား — နောက်ဆုံး တွက်ထားတဲ့ snapshot ကို သိမ်းထားပြီး — store ထဲက data မပြောင်းရင် — ယခင် snapshot အတိုင်းပဲ ပြန်ပေးသင့်ပါတယ်။ Mutable data ပြောင်းလဲမပြောင်းလဲ ဘယ်လို ဆုံးဖြတ်မလဲဆိုတာက — သင့် mutable store အပေါ်မှာ မူတည်ပါတယ်။

### ငါ့ရဲ့ `subscribe` function ကို re-render တိုင်း ပြန်ခေါ်နေတယ်

ဒီ `subscribe` function ကို component တစ်ခုရဲ့ *အတွင်းမှာ* သတ်မှတ်ထားလို့ — re-render တိုင်း မတူတဲ့ function ဖြစ်နေပါတယ်:

```js
function ChatIndicator() {
  // 🚩 Always a different function, so React will resubscribe on every re-render
  function subscribe() {
    // ...
  }

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

Re-renders တွေကြားမှာ `subscribe` function မတူတာတစ်ခု ပို့ခံရရင် — React က သင့် store ကို ပြန် subscribe လုပ်ပါလိမ့်မယ်။ ဒါက performance ပြဿနာ ဖြစ်စေပြီး ပြန် subscribe လုပ်တာကို ရှောင်ချင်ရင် — `subscribe` function ကို အပြင်ဘက် ရွှေ့ပါ:

```js
// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

တစ်နည်းအားဖြင့် — `subscribe` ကို [useCallback](/docs/react/use-callback) ထဲ ထုပ်ပြီး — argument တစ်ခုခု ပြောင်းမှသာ ပြန် subscribe ဖြစ်အောင် လုပ်နိုင်ပါတယ်:

```js
function ChatIndicator({ userId }) {
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
