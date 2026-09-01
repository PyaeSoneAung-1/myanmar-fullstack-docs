---
title: "Mutation နဲ့ Revalidation"
description: "mutate နဲ့ useSWRMutation API — cache data ပြောင်းလဲခြင်း၊ revalidation ပြန်စတင်ခြင်း၊ optimistic updates နဲ့ error ဖြစ်ရင် rollback လုပ်နည်း"
order: 10
source: "https://swr.vercel.app/docs/mutation"
status: translated
updated: 2026-09-01
---

SWR က remote data နဲ့ ဆက်စပ်နေတဲ့ cache တွေကို ပြောင်းလဲ (mutate) လုပ်ဖို့ [`mutate`](/docs/swr/mutation#mutate) နဲ့ [`useSWRMutation`](/docs/swr/mutation#useswrmutation) ဆိုတဲ့ API တွေ ပေးထားပါတယ်။

## `mutate`

`mutate` API ကို သုံးပြီး data ပြောင်းလဲဖို့ နည်း ၂ မျိုး ရှိပါတယ် — ဘယ် key ကိုမဆို ပြောင်းလဲလို့ရတဲ့ **global mutate API** နဲ့ — သက်ဆိုင်ရာ SWR hook ရဲ့ data ကိုပဲ ပြောင်းလဲလို့ရတဲ့ **bound mutate API** တို့ပါ။

### Global Mutate

Global mutator ကို ရယူဖို့ အကြံပြုထားတဲ့ နည်းကတော့ [`useSWRConfig`](/docs/swr/global-config) hook ကို သုံးတာပါ:

```js
import { useSWRConfig } from "swr"

function App() {
  const { mutate } = useSWRConfig()
  mutate(key, data, options)
}
```

Global အနေနဲ့လည်း import လုပ်ပြီး သုံးလို့ရပါတယ်:

```js
import { mutate } from "swr"

function App() {
  mutate(key, data, options)
}
```

> ⚠️ `key` parameter တစ်ခုတည်းနဲ့ global mutator ကို သုံးရင် — cache ကို update လုပ်မှာ မဟုတ်သလို revalidation ကိုလည်း စတင်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် ဒီ `key` ကိုပဲ သုံးထားတဲ့ SWR hook တစ်ခု mount ဖြစ်နေတယ်ဆိုရင်တော့ အလုပ်လုပ်ပါတယ်။

### Bound Mutate

Bound mutate က လက်ရှိ key ရဲ့ data ကို ပြောင်းလဲဖို့ အတိုဆုံး နည်းလမ်းပါ။ `key` က `useSWR` ကို ပေးထားတဲ့ `key` နဲ့ ချိတ်ဆက်ထားပြီး — `data` ကို ပထမဆုံး argument အနေနဲ့ လက်ခံပါတယ်။

အပေါ်က global `mutate` function နဲ့ လုပ်ဆောင်ချက် အတူတူပါပဲ — ဒါပေမယ့် `key` parameter မလိုပါဘူး:

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // API ကို request ပို့ပြီး data ကို update လုပ်ပါ
        await requestUpdateUsername(newName)
        // local data ကို ချက်ချင်း update လုပ်ပြီး revalidate (refetch) လုပ်ပါ
        // NOTE: useSWR ရဲ့ mutate ကို သုံးတဲ့အခါ key က pre-bound ဖြစ်နေလို့ မလိုပါဘူး
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

### Revalidation

`mutate(key)` ကို data မပါဘဲ ခေါ်လိုက်ရင် (bound mutate API နဲ့ဆိုရင် `mutate()` ချည်းပဲ) — ဒီ resource အတွက် revalidation ကို စတင်ပေးပါတယ် (data ကို expired အဖြစ် မှတ်သားပြီး refetch လုပ်ခြင်း)။ အောက်က ဥပမာမှာ — user က "Logout" button ကို နှိပ်လိုက်တဲ့အခါ login info တွေကို (`<Profile/>` ထဲက ဟာတွေ) အလိုအလျောက် ပြန်ယူပေးပုံကို ပြထားပါတယ်:

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // cookie ကို expired အဖြစ် သတ်မှတ်ပါ
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // ဒီ key ကို သုံးထားတဲ့ SWR အားလုံးကို revalidate လုပ်ခိုင်းပါ
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

> ဒီ revalidation က [cache provider](/docs/advanced/cache) scope တစ်ခုတည်းအောက်က SWR hook တွေဆီ ပျံ့နှံ့ (broadcast) သွားပါတယ်။ Cache provider မရှိရင်တော့ SWR hook အားလုံးဆီ broadcast ဖြစ်ပါတယ်။

### API

#### Parameters

- `key`: `useSWR` ရဲ့ `key` နဲ့ အတူတူပါ — function ဖြစ်နေရင်တော့ [filter function](/docs/swr/mutation#mutate-multiple-items) အနေနဲ့ ပြုမူပါတယ်
- `data`: client cache ကို update လုပ်ဖို့ data၊ သို့မဟုတ် remote mutation အတွက် async function
- `options`: အောက်ပါ option တွေကို လက်ခံပါတယ်
  - `optimisticData`: client cache ကို ချက်ချင်း update လုပ်ဖို့ data၊ သို့မဟုတ် လက်ရှိ data ကို လက်ခံပြီး client cache data အသစ် ပြန်ပေးတဲ့ function — အများအားဖြင့် optimistic UI မှာ သုံးပါတယ်
  - `revalidate = true`: async update ပြီးသွားတဲ့အခါ cache ကို revalidate လုပ်သင့်လား။ Function ဖြစ်နေရင် — အဲဒီ function က `data` နဲ့ `key` ကို လက်ခံပါတယ်
  - `populateCache = true`: remote mutation ရဲ့ ရလဒ်ကို cache ထဲ ရေးသင့်လား၊ သို့မဟုတ် ရလဒ်အသစ်နဲ့ လက်ရှိရလဒ်ကို argument အဖြစ် လက်ခံပြီး mutation ရလဒ် ပြန်ပေးတဲ့ function
  - `rollbackOnError = true`: remote mutation မှာ error ဖြစ်ရင် cache ကို ပြန်လှည့် (rollback) သင့်လား၊ သို့မဟုတ် fetcher က ပစ်လိုက်တဲ့ error ကို လက်ခံပြီး rollback လုပ်သင့်မသင့် boolean ပြန်ပေးတဲ့ function
  - `throwOnError = true`: mutate ခေါ်မှု မအောင်မြင်ရင် error ကို throw လုပ်သင့်လား

#### Return Values

`mutate` က `data` parameter ရဲ့ resolve ဖြစ်လာတဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။ `mutate` ကို ပေးထားတဲ့ function က — သက်ဆိုင်ရာ cache value ကို update လုပ်ဖို့ သုံးမယ့် data အသစ်ကို ပြန်ပေးပါတယ်။ Function ကို လုပ်ဆောင်နေတုန်း error တစ်ခုခု throw ဖြစ်ခဲ့ရင် — အဲဒီ error ကို သင့်တော်သလို စီမံနိုင်အောင် ပြန်ပစ်ပေးပါတယ်။

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // user update လုပ်နေတုန်း ဖြစ်တဲ့ error ကို ဒီနေရာမှာ စီမံပါ
}
```

## `useSWRMutation`

SWR က remote mutation တွေအတွက် `useSWRMutation` ဆိုတဲ့ hook ကိုလည်း ပေးထားပါတယ်။ Remote mutation တွေက `useSWR` လို အလိုအလျောက် မဟုတ်ဘဲ — ကိုယ်တိုင် (manually) ခေါ်မှပဲ စတင်ပါတယ်။

ဒါ့အပြင် ဒီ hook က တခြား `useSWRMutation` hook တွေနဲ့ state ကို share မလုပ်ပါဘူး။

```tsx
import useSWRMutation from 'swr/mutation'

// Fetcher အကောင်အထည်ဖော်မှု။
// အပိုဖြည့် argument ကို 2nd parameter ရဲ့ `arg` property ကနေ ပေးပို့မှာပါ။
// အောက်က ဥပမာမှာ `arg` က `'my_token'` ဖြစ်ပါလိမ့်မယ်
async function updateUser(url, { arg }: { arg: string }) {
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${arg}`
    }
  })
}

function Profile() {
  // useSWR + mutate ပုံစံ API တစ်ခုပါ — ဒါပေမယ့် request ကို အလိုအလျောက် စတင်မှာ မဟုတ်ပါဘူး။
  const { trigger } = useSWRMutation('/api/user', updateUser, options)

  return <button onClick={() => {
    // `updateUser` ကို သတ်မှတ်ထားတဲ့ argument တစ်ခုနဲ့ trigger လုပ်ပါ
    trigger('my_token')
  }}>Update User</button>
}
```

### API

#### Parameters

- `key`: [`mutate`](/docs/swr/mutation#mutate) ရဲ့ `key` နဲ့ အတူတူပါ
- `fetcher(key, { arg })`: remote mutation အတွက် async function
- `options`: optional object တစ်ခုဖြစ်ပြီး အောက်ပါ property တွေ ပါဝင်ပါတယ်:
  - `optimisticData`: `mutate` ရဲ့ `optimisticData` နဲ့ အတူတူပါ
  - `revalidate = true`: `mutate` ရဲ့ `revalidate` နဲ့ အတူတူပါ
  - `populateCache = false`: `mutate` ရဲ့ `populateCache` နဲ့ အတူတူပါ — ဒါပေမယ့် default က `false` ပါ
  - `rollbackOnError = true`: `mutate` ရဲ့ `rollbackOnError` နဲ့ အတူတူပါ
  - `throwOnError = true`: `mutate` ရဲ့ `throwOnError` နဲ့ အတူတူပါ
  - `onSuccess(data, key, config)`: remote mutation တစ်ခု အောင်မြင်စွာ ပြီးဆုံးသွားတဲ့အခါ ခေါ်တဲ့ callback function
  - `onError(err, key, config)`: remote mutation မှာ error ပြန်ရတဲ့အခါ ခေါ်တဲ့ callback function

#### Return Values

- `data`: ပေးထားတဲ့ `key` အတွက် `fetcher` က ပြန်ပေးတဲ့ data
- `error`: `fetcher` က ပစ်လိုက်တဲ့ error (မရှိရင် undefined)
- `trigger(arg, options)`: remote mutation တစ်ခုကို စတင်ဖို့ function
- `reset`: state (`data`, `error`, `isMutating`) တွေကို ပြန်လည်စက်ချဖို့ function
- `isMutating`: remote mutation တစ်ခု လုပ်ဆောင်နေဆဲ ရှိ/မရှိ

### Basic Usage

```tsx
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }: { arg: { username: string }}) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then(res => res.json())
}

function App() {
  const { trigger, isMutating } = useSWRMutation('/api/user', sendRequest, /* options */)

  return (
    <button
      disabled={isMutating}
      onClick={async () => {
        try {
          const result = await trigger({ username: 'johndoe' }, /* options */)
        } catch (e) {
          // error handling
        }
      }}
    >
      Create User
    </button>
  )
}
```

Mutation ရဲ့ ရလဒ်ကို rendering ထဲမှာ သုံးချင်ရင် — `useSWRMutation` ရဲ့ return values ကနေ ရယူလို့ရပါတယ်။

```jsx
const { trigger, data, error } = useSWRMutation('/api/user', sendRequest)
```

`useSWRMutation` က `useSWR` နဲ့ cache store ကို share လုပ်တာမို့ — `useSWR` နဲ့ကြား race condition တွေကို ရှာဖွေ ကာကွယ်နိုင်ပါတယ်။ Optimistic updates နဲ့ rollback on errors လို `mutate` ရဲ့ လုပ်ဆောင်ချက်တွေကိုလည်း ထောက်ပံ့ပါတယ်။ ဒီ option တွေကို `useSWRMutation` နဲ့ သူ့ရဲ့ `trigger` function နှစ်ခုလုံးဆီ ပေးနိုင်ပါတယ်။

```jsx
const { trigger } = useSWRMutation('/api/user', updateUser, {
  optimisticData: current => ({ ...current, name: newName })
})

// ဒါမှမဟုတ်

trigger(newName, {
  optimisticData: current => ({ ...current, name: newName })
})
```

### Data လိုအပ်မှသာ loading လုပ်ခြင်း (Defer)

`useSWRMutation` ကို data loading အတွက်လည်း သုံးလို့ရပါတယ်။ `useSWRMutation` က `trigger` ကို မခေါ်မချင်း request မစတင်တာမို့ — data တကယ် လိုအပ်တဲ့အခါမှသာ loading စတင်ဖို့ ရွှေ့ဆိုင်းထားနိုင်ပါတယ်။

```jsx
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  // trigger မခေါ်ခင် data က undefined ဖြစ်နေပါမယ်
  const { data: user, trigger } = useSWRMutation('/api/user', fetcher);

  return (
    <div>
      <button onClick={() => {
        trigger();
        setShow(true);
      }}>Show User</button>
      {show && user ? <div>{user.name}</div> : null}
    </div>
  );
}
```

## Optimistic Updates

အများစုမှာ data ကို local အနေနဲ့ ပြောင်းလဲ (mutation) လုပ်တာက — ပြောင်းလဲမှုကို မြန်မြန်ဆန်ဆန် ခံစားရစေဖို့ နည်းလမ်းကောင်းတစ်ခုပါ — remote data ကို စောင့်စရာ မလိုပါဘူး။

`optimisticData` option နဲ့ — remote mutation ပြီးဆုံးဖို့ စောင့်နေတုန်း local data ကို ကိုယ်တိုင် update လုပ်ထားလို့ရပါတယ်။ `rollbackOnError` နဲ့ တွဲသုံးရင် — ဘယ်အချိန်မှာ data ကို ပြန်လှည့်မလဲ ဆိုတာကိုလည်း ထိန်းချုပ်နိုင်ပါတယ်။

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        const user = { ...data, name: newName }
        const options = {
          optimisticData: user,
          rollbackOnError(error) {
            // timeout abort error ဆိုရင် rollback မလုပ်ပါနဲ့
            return error.name !== 'AbortError'
          },
        }

        // local data ကို ချက်ချင်း update လုပ်ပါ
        // data ကို update လုပ်ဖို့ request ပို့ပါ
        // local data မှန်ကန်ကြောင်း သေချာစေဖို့ revalidation (refetch) စတင်ပါ
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```

> **`updateFn`** က remote mutation ကို ကိုင်တွယ်ဖို့ promise သို့မဟုတ် async function ဖြစ်ရပါမယ် — update လုပ်ပြီးသား data ကို ပြန်ပေးရပါတယ်။

`optimisticData` ကို function အနေနဲ့လည်း ပေးနိုင်ပါတယ် — လက်ရှိ data ပေါ်မူတည်ပြီး တွက်ချင်ရင်ပါ:

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        mutate('/api/user', updateUserName(newName), {
          optimisticData: user => ({ ...user, name: newName }),
          rollbackOnError: true
        });
      }}>Uppercase my name!</button>
    </div>
  )
}
```

`useSWRMutation` နဲ့ `trigger` ကို သုံးပြီးလည်း အလားတူ ရေးလို့ရပါတယ်:

```jsx
import useSWRMutation from 'swr/mutation'

function Profile () {
  const { trigger } = useSWRMutation('/api/user', updateUserName)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()

        trigger(newName, {
          optimisticData: user => ({ ...user, name: newName }),
          rollbackOnError: true
        })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

## Rollback on Errors

`optimisticData` သတ်မှတ်ထားတဲ့အခါ — optimistic data က user ဆီ ပြသလိုက်မိပြီး — remote mutation က ကျရှုံးသွားတာမျိုး ဖြစ်နိုင်ပါတယ်။ ဒီလိုအခါမျိုးမှာ `rollbackOnError` ကို သုံးပြီး — local cache ကို ယခင် state ဆီ ပြန်လှည့်ကာ — user က မှန်ကန်တဲ့ data ကိုပဲ မြင်နေရကြောင်း သေချာစေနိုင်ပါတယ်။

## Mutation အပြီး Cache ကို Update လုပ်ခြင်း

တစ်ခါတစ်ရံ — remote mutation request က update လုပ်ပြီးသား data ကို တိုက်ရိုက် ပြန်ပေးတာမို့ — ဒီ data ကို ရဖို့ နောက်ထပ် fetch တစ်ခု ထပ်လုပ်စရာ မလိုပါဘူး။ `populateCache` option ကို ဖွင့်လိုက်ရင် — mutation ရဲ့ response နဲ့အတူ `useSWR` အတွက် cache ကို update လုပ်ပေးပါတယ်:

```jsx
const updateTodo = () => fetch('/api/todos/1', {
  method: 'PATCH',
  body: JSON.stringify({ completed: true })
})

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // list ကို filter လုပ်ပြီး updated item နဲ့အတူ ပြန်ပေးပါ
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // API က updated information ကို ပေးပြီးသားမို့
  // ဒီနေရာမှာ revalidate လုပ်စရာ မလိုပါဘူး
  revalidate: false
})
```

ဒါမှမဟုတ် `useSWRMutation` hook နဲ့:

```jsx
useSWRMutation('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // list ကို filter လုပ်ပြီး updated item နဲ့အတူ ပြန်ပေးပါ
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // API က updated information ကို ပေးပြီးသားမို့
  // ဒီနေရာမှာ revalidate လုပ်စရာ မလိုပါဘူး
  revalidate: false
})
```

ဒါတွေကို `optimisticData` နဲ့ `rollbackOnError` တို့နဲ့ တွဲသုံးလိုက်ရင် — perfect ဖြစ်တဲ့ optimistic UI အတွေ့အကြုံကို ရပါလိမ့်မယ်။

## Race Conditions ရှောင်ရှားခြင်း

`mutate` ရော `useSWRMutation` ပါ — `useSWR` နဲ့ကြား race condition တွေကို ရှောင်ရှားပေးနိုင်ပါတယ်။ ဥပမာ:

```tsx
function Profile() {
  const { data } = useSWR('/api/user', getUser, { revalidateInterval: 3000 })
  const { trigger } = useSWRMutation('/api/user', updateUser)

  return <>
    {data ? data.username : null}
    <button onClick={() => trigger()}>Update User</button>
  </>
}
```

သာမန် `useSWR` hook က focus ဖြစ်တာ၊ polling လုပ်တာ စတဲ့ အကြောင်းတွေကြောင့် ဘယ်အချိန်မဆို data ကို refresh လုပ်နိုင်ပါတယ်။ ဒါက ပြသနေတဲ့ username ကို တတ်နိုင်သမျှ အသစ်ဆုံး ဖြစ်စေဖို့ပါ။ ဒါပေမယ့် — `useSWR` ရဲ့ refetch နဲ့ mutation တို့ တစ်ချိန်တည်း နီးပါး ဖြစ်သွားနိုင်တာမို့ — `getUser` request က အစောကြီး စတင်ခဲ့ပေမယ့် `updateUser` ထက် ပိုကြာသွားတဲ့ race condition ဖြစ်နိုင်ပါတယ်။

ကံကောင်းချင်တော့ `useSWRMutation` က ဒါကို အလိုအလျောက် စီမံပေးပါတယ်။ Mutation အပြီးမှာ — `useSWR` ကို လုပ်ဆောင်နေဆဲ request ကို ရပ်ပြီး revalidate လုပ်ဖို့ ပြောပေးလိုက်တာမို့ — stale data က ဘယ်တော့မှ ပြသမခံရတော့ပါဘူး။

## လက်ရှိ Data ကို အခြေခံပြီး Mutate လုပ်ခြင်း

တစ်ခါတစ်ရံ — လက်ရှိ data ကို အခြေခံပြီး data ရဲ့ အစိတ်အပိုင်းတစ်ခုကို update လုပ်ချင်ပါတယ်။

`mutate` နဲ့ဆိုရင် — async function ကို ပေးလို့ရပါတယ်။ အဲဒီ function က လက်ရှိ cached value (ရှိရင်) ကို လက်ခံပြီး — update လုပ်ပြီးသား document ကို ပြန်ပေးပါတယ်။

```jsx
mutate('/api/todos', async todos => {
  // ID `1` ရှိတဲ့ todo ကို completed ဖြစ်အောင် update လုပ်ကြည့်ရအောင်၊
  // ဒီ API က updated data ကို ပြန်ပေးပါတယ်
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // list ကို filter လုပ်ပြီး updated item နဲ့အတူ ပြန်ပေးပါ
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
// API က updated information ကို ပေးပြီးသားမို့
// ဒီနေရာမှာ revalidate လုပ်စရာ မလိုပါဘူး
}, { revalidate: false })
```

## Item အများအပြား Mutate လုပ်ခြင်း

Global `mutate` API က filter function ကို လက်ခံပါတယ် — အဲဒီ function က `key` ကို argument အဖြစ် လက်ခံပြီး — ဘယ် key တွေကို revalidate လုပ်ရမလဲ ပြန်ပေးပါတယ်။ ဒီ filter function က ရှိပြီးသား cache key အားလုံးအပေါ် အသုံးပြုပါတယ်:

```jsx
import { mutate } from 'swr'
// ကိုယ်ပိုင် cache provider သတ်မှတ်ထားရင် hook ကနေ ရယူနိုင်ပါတယ်:
// { mutate } = useSWRConfig()

mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)
```

ဒါက array လို key type မျိုးနဲ့လည်း အလုပ်လုပ်ပါတယ်။ ပထမဆုံး element က `'item'` ဖြစ်တဲ့ key အားလုံးနဲ့ ကိုက်ညီအောင် mutation လုပ်ပါတယ်။

```jsx
useSWR(['item', 123], ...)
useSWR(['item', 124], ...)
useSWR(['item', 125], ...)

mutate(
  key => Array.isArray(key) && key[0] === 'item',
  undefined,
  { revalidate: false }
)
```

Filter function က ရှိပြီးသား cache key အားလုံးအပေါ် အသုံးပြုတာမို့ — key ပုံစံမျိုးစုံ သုံးနေတဲ့အခါ key ရဲ့ ပုံသဏ္ဍာန်ကို အလျဉ်းသင့် ယူဆမထားသင့်ပါဘူး။

```jsx
// ✅ array key နဲ့ ကိုက်ညီအောင်
mutate((key) => key[0].startsWith('/api'), data)
// ✅ string key နဲ့ ကိုက်ညီအောင်
mutate((key) => typeof key === 'string' && key.startsWith('/api'), data)

// ❌ ERROR: မသေချာတဲ့ key (array လား string လား) တွေကို mutate လုပ်ခြင်း
mutate((key: any) => /\/api/.test(key.toString()))
```

Cache data အားလုံးကို ရှင်းပစ်ချင်ရင်လည်း filter function ကို သုံးလို့ရပါတယ် — logout လုပ်တဲ့အခါ အသုံးဝင်ပါတယ်:

```js
const clearCache = () => mutate(
  () => true,
  undefined,
  { revalidate: false }
)

// ...logout လုပ်တဲ့အခါ cache ရှင်းပါ
clearCache()
```
