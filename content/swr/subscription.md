---
title: "Subscription"
description: "useSWRSubscription hook နဲ့ real-time data sources တွေကို subscribe လုပ်ခြင်း — Firestore, WebSocket ဥပမာများ၊ same key အတွက် subscription တွေကို deduplicate လုပ်ခြင်း"
order: 16
source: "https://swr.vercel.app/docs/subscription"
status: translated
updated: 2026-09-01
---

> ဒီ API ကို သုံးဖို့ နောက်ဆုံးဗားရှင်း (≥ 2.1.0) ကို update လုပ်ပါ။

## `useSWRSubscription`

`useSWRSubscription` က React hook တစ်ခုဖြစ်ပြီး — SWR နဲ့အတူ real-time data sources တွေကို subscribe လုပ်နိုင်စေပါတယ်။

```tsx
useSWRSubscription<Data, Error>(key: Key, subscribe: (key: Key, options: { next: (error?: Error | null, data: Data) => void }) => () => void): { data?: Data, error?: Error }
```

### API

ဒီ hook က ပေးထားတဲ့ subscribe function ကို သုံးပြီး real-time data source တစ်ခုကို subscribe လုပ်ကာ — ရရှိတဲ့ နောက်ဆုံး data နဲ့ ကြုံတွေ့ရတဲ့ error တွေကို ပြန်ပေးပါတယ်။ Event အသစ်တွေ ရောက်လာတာနဲ့ — hook က ပြန်ပေးနေတဲ့ data ကို အလိုအလျောက် update လုပ်ပေးပါတယ်။

#### Parameters

- `key`: subscribe လုပ်နေတဲ့ data ကို ခွဲခြားသတ်မှတ်တဲ့ unique key — `useSWR` ရဲ့ key နဲ့ အတူတူပါ
- `subscribe`: real-time data source ကို subscribe လုပ်တဲ့ function တစ်ခုပါ — အောက်ပါ argument တွေ လက်ခံပါတယ်:
  - `key`: အပေါ်က key အတိုင်းပါပဲ
  - `options`: အောက်ပါ property တွေ ပါတဲ့ object တစ်ခုပါ:
    - `next`: error နဲ့ data တစ်ခုကို လက်ခံပြီး — real-time data source ကနေ ရတဲ့ နောက်ဆုံး data နဲ့ state ကို update လုပ်ပေးတဲ့ function

ဥပမာ:

```tsx
function subscribe(key, { next }) {
  const sub = remote.subscribe(key, (err, data) => next(err, data))
  return () => sub.close()
}
```

`next` ရဲ့ `data` အနေနဲ့ updater function တစ်ခုကိုလည်း ပေးလို့ရပါတယ် — အဲဒီ function က ယခင် data ကို ပထမဆုံး argument အနေနဲ့ လက်ခံပြီး — data အသစ် ပြန်ပေးပါတယ်။

```tsx
function subscribe(key, { next }) {
  const sub = remote.subscribe(key, (err, data) => next(err, prev => prev.concat(data)))
  return () => sub.close()
}
```

#### Return Values

- `state`: အောက်ပါ property တွေ ပါတဲ့ object တစ်ခုပါ:
  - `data`: real-time data source ကနေ ရရှိတဲ့ နောက်ဆုံး data
  - `error`: real-time data source ကို subscribe လုပ်တုန်း error ဖြစ်ခဲ့ရင် Error object — မဟုတ်ရင် undefined

Data အသစ် ရောက်ရှိလာတဲ့အခါ — `error` ကို `undefined` အနေနဲ့ ပြန်လည် reset လုပ်ပါတယ်။

### အသုံးပြုနည်း

Firestore data source တစ်ခုကို `useSWRSubscription` နဲ့ subscribe လုပ်တာ:

```tsx
import useSWRSubscription from 'swr/subscription'

function Post({ id }) {
  const { data } = useSWRSubscription(['views', id], ([_, postId], { next }) => {
    const ref = firebase.database().ref('views/' + postId)
    ref.on('value',
      snapshot => next(null, snapshot.data()),
      err => next(err)
    )
    return () => ref.off()
  })

  return <span>Your post has {data} views!</span>
}
```

WebSocket data source တစ်ခုကို `useSWRSubscription` နဲ့ subscribe လုပ်တာ:

```tsx
import useSWRSubscription from 'swr/subscription'

function App() {
  const { data, error } = useSWRSubscription('ws://...', (key, { next }) => {
    const socket = new WebSocket(key)
    socket.addEventListener('message', (event) => next(null, event.data))
    socket.addEventListener('error', (event) => next(event.error))
    return () => socket.close()
  })
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data}!</div>
}
```

`useSWRSubscription` ရဲ့ TypeScript ဥပမာတွေကို [ဒီ page](/docs/swr/typescript#useswrsubscription) မှာ ကြည့်နိုင်ပါတယ်။

### Deduplication

`useSWRSubscription` က key တူတဲ့ subscription request တွေကို deduplicate (ထပ်နေတာ ဖယ်) လုပ်ပါတယ်။ Key တူတဲ့ component အများကြီး ရှိနေရင် — subscription တစ်ခုတည်းကိုပဲ အားလုံး share လုပ်ပါတယ်။ ဒီ key ကို သုံးနေတဲ့ နောက်ဆုံး component က unmount ဖြစ်သွားတဲ့အခါ — subscription ကို ပိတ်လိုက်ပါတယ်။

ဆိုလိုတာက — key တူတဲ့ component အများကြီး ရှိနေရင် — အားလုံးက data တူတူပဲ ရရှိပါတယ်။ ပြီးတော့ real-time data source ဆီ subscription က key တစ်ခုအတွက် တစ်ခုတည်းပဲ ရှိပါတယ်။
