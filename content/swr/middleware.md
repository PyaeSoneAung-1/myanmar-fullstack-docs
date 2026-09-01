---
title: "Middleware"
description: "SWR ကို custom middleware တွေနဲ့ တိုးချဲ့ခြင်း — SWR hook ရဲ့ ရှေ့/နောက်မှာ logic ထည့်သွင်းခြင်း၊ request logger, laggy data, object key serialize ဥပမာများ"
order: 12
source: "https://swr.vercel.app/docs/middleware"
status: translated
updated: 2026-09-01
---

> ဒီ feature ကို သုံးဖို့ နောက်ဆုံးဗားရှင်း (≥ 1.0.0) ကို update လုပ်ပါ။

Middleware ဆိုတာ SWR 1.0 မှာ အသစ်ထည့်လာတဲ့ feature တစ်ခုပါ — SWR hook တွေရဲ့ ရှေ့နဲ့ နောက်မှာ logic တွေ လုပ်ဆောင်နိုင်စေဖို့ပါ။

## အသုံးပြုနည်း (Usage)

Middleware တွေက SWR hook ကို လက်ခံပြီး — hook ကို run လုပ်တဲ့ ရှေ့နဲ့ နောက်မှာ logic တွေ လုပ်ဆောင်နိုင်ပါတယ်။ Middleware အများကြီး ရှိနေရင် — middleware တစ်ခုချင်းစီက နောက် middleware တစ်ခုကို wrap လုပ်ပါတယ်။ List ထဲက နောက်ဆုံး middleware က မူရင်း SWR hook `useSWR` ကို လက်ခံရရှိပါတယ်။

### API

_မှတ်ချက်: Function နာမည်ကို စာလုံးကြီးနဲ့ စမထားသင့်ပါဘူး (ဥပမာ `MyMiddleware` အစား `myMiddleware`) — မဟုတ်ရင် React lint rules တွေက `Rules of Hook` error ပစ်ပါလိမ့်မယ်။_

[TypeScript](/docs/swr/typescript#middleware-types)

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // Hook run မလုပ်ခင်...

    // နောက် middleware တစ်ခု၊ ဒါမှမဟုတ် ဒါက နောက်ဆုံးတစ်ခုဆိုရင် `useSWR` hook ကို ကိုင်တွယ်ပါ
    const swr = useSWRNext(key, fetcher, config)

    // Hook run လုပ်ပြီး...
    return swr
  }
}
```

Middleware တွေရဲ့ array ကို `SWRConfig` ဒါမှမဟုတ် `useSWR` ရဲ့ option အဖြစ် ပေးနိုင်ပါတယ်:

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// ဒါမှမဟုတ်...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### Extend (တိုးချဲ့ခြင်း)

Middleware တွေက သာမန် option တွေလိုပဲ extend ဖြစ်ပါတယ်။ ဥပမာ:

```jsx
function Bar () {
  useSWR(key, fetcher, { use: [c] })
  // ...
}

function Foo() {
  return (
    <SWRConfig value={{ use: [a] }}>
      <SWRConfig value={{ use: [b] }}>
        <Bar/>
      </SWRConfig>
    </SWRConfig>
  )
}
```

ဒါက ဒီအတိုင်း ညီမျှပါတယ်:

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### Middleware အများအပြား

Middleware တစ်ခုချင်းစီက နောက် middleware တစ်ခုကို wrap လုပ်ပြီး — နောက်ဆုံးတစ်ခုက SWR hook ကိုပဲ wrap လုပ်ပါတယ်။ ဥပမာ:

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

Middleware တွေရဲ့ လုပ်ဆောင်မှု အစဉ်လိုက်ကတော့ `a → b → c` ဖြစ်ပြီး — အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```plaintext
enter a
  enter b
    enter c
      useSWR()
    exit  c
  exit  b
exit  a
```

## ဥပမာများ

### Request Logger

ဥပမာအနေနဲ့ — request logger middleware တစ်ခု ဆောက်ကြည့်ရအောင်။ ဒီ SWR hook ကနေ ပို့လိုက်တဲ့ fetcher request တွေ အားလုံးကို ပုံနှိပ်ပြပါတယ်။ ဒီ middleware ကို `SWRConfig` ထဲ ထည့်ပေးလိုက်ရင် — SWR hook အားလုံးအတွက်ပါ သုံးနိုင်ပါတယ်။

```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // မူရင်း fetcher ထဲ logger ကို ထည့်ပါ
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // fetcher အသစ်နဲ့ hook ကို run လုပ်ပါ
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... component ထဲမှာ
useSWR(key, fetcher, { use: [logger] })
```

Request တစ်ခုချင်းစီ ပို့တိုင်း — console မှာ SWR key ကို ပုံနှိပ်ပြပါတယ်:

```plaintext
SWR Request: /api/user1
SWR Request: /api/user2
```

### ယခင် ရလဒ်ကို ဆက်ထားခြင်း (Keep Previous Result)

တစ်ခါတစ်ရံ `useSWR` က ပြန်ပေးတဲ့ data ကို "laggy" (နောက်ကျချင်း) ဖြစ်စေချင်ပါတယ်။ Key ပြောင်းသွားရင်တောင် — data အသစ် load မပြီးမချင်း ယခင် ရလဒ်ကိုပဲ ပြန်ပေးစေချင်တာမျိုးပါ။

ဒါကို `useRef` နဲ့အတူ laggy middleware တစ်ခု အနေနဲ့ တည်ဆောက်လို့ရပါတယ်။ ဒီဥပမာမှာ — `useSWR` hook ရဲ့ ပြန်ပေးတဲ့ object ကိုပါ extend လုပ်ထားပါတယ်:

```jsx
import { useRef, useEffect, useCallback } from 'react'

// ဒါက SWR middleware ဖြစ်ပြီး — key ပြောင်းသွားရင်တောင် data ကို ဆက်ထားပေးပါတယ်
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // ယခင် ပြန်ပေးခဲ့တဲ့ data ကို သိမ်းဖို့ ref သုံးပါ
    const laggyDataRef = useRef()

    // တကယ့် SWR hook
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // data က undefined မဟုတ်ရင် ref ကို update လုပ်ပါ
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // laggy data ကို ရှင်းဖို့ method တစ်ခု ဖော်ထုတ်ပါ (ရှိရင်)
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // လက်ရှိ data က undefined ဆိုရင် ယခင် data ကို ပြန်သုံးပါ
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data

    // ယခင် data ကို ပြနေတာလား?
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

    // SWR ကို `isLagging` field ပါ ထပ်ထည့်ပေးပါ
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}
```

SWR hook တစ်ခု laggy ဖြစ်စေချင်တဲ့အခါ — ဒီ middleware ကို သုံးနိုင်ပါတယ်:

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### Object Keys ကို Serialize လုပ်ခြင်း

> SWR 1.1.0 ကစပြီး — object ပုံစံ key တွေကို နောက်ကွယ်မှာ အလိုအလျောက် serialize လုပ်ပေးပါတယ်။

> ⚠️ ဗားရှင်းအဟောင်း (< 1.1.0) တွေမှာ — SWR က render တိုင်း argument တွေကို **shallow** နှိုင်းယှဉ်ပြီး — တစ်ခုခု ပြောင်းသွားရင် revalidation စတင်ပါတယ်။ Serializable object တွေကို key အဖြစ် ပေးနေတယ်ဆိုရင် — object key တွေကို serialize လုပ်ပြီး တည်ငြိမ်မှု ရှိစေဖို့ ရိုးရိုး middleware တစ်ခု သုံးနိုင်ပါတယ်:

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // Key ကို serialize လုပ်ပါ
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // Serialize လုပ်ထားတဲ့ key ကို ပေးပြီး — fetcher ထဲမှာ ပြန် unserialize လုပ်ပါ
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ... ဒါမှမဟုတ် global အနေနဲ့ ဖွင့်ထားဖို့
<SWRConfig value={{ use: [serialize] }}>
```

Render တွေကြားမှာ object ပြောင်းသွားမှာကို စိုးရိမ်စရာ မလိုပါဘူး — အမြဲတမ်း string တူတူပဲ serialize ဖြစ်နေပြီး — fetcher က object argument တွေကို ပုံမှန်အတိုင်း လက်ခံရရှိနေပါတယ်။

> နောက်ထပ် — `JSON.stringify` အစား [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) လို library တွေကိုလည်း သုံးနိုင်ပါတယ် — ပိုမြန်ပြီး ပိုတည်ငြိမ်ပါတယ်။
