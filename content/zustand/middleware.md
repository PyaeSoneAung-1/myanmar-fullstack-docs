---
title: "Middleware သုံးခြင်း"
description: "Middleware ဆိုတာ ဘာလဲ၊ custom middleware ရေးနည်း၊ devtools middleware နဲ့ log middleware ပေါင်းသုံးခြင်း"
order: 5
source: "https://zustand.docs.pmnd.rs/middlewares/immer"
status: translated
updated: 2026-09-01
---

## Middleware ဆိုတာ ဘာလဲ

Zustand မှာ **middleware** ဆိုတာ — store ဖန်တီးတဲ့ function (state creator) ကို wrap လုပ်ပြီး
store ရဲ့ အပြုအမူ (behavior) တွေကို တိုးချဲ့ပေးတဲ့ function တစ်မျိုးပါ။ Middleware တွေက
`set`, `get`, `api` တို့ကို ကြားခံပြီး ပြုပြင်နိုင်တာမို့ — state update တိုင်းကို log ထုတ်တာ,
state ကို storage မှာ သိမ်းတာ, Redux DevTools နဲ့ ချိတ်ဆက်တာ စတဲ့ အလုပ်တွေကို store ရဲ့
code ကို မထိဘဲ ထည့်လို့ရပါတယ်။ သုံးပုံက — `create()` ရဲ့ argument ဖြစ်တဲ့ state creator ကို
`middleware(stateCreator, options)` ပုံစံနဲ့ ထုပ်လိုက်ရုံပါပဲ။

## Custom Middleware ရေးနည်း

ကိုယ်ပိုင် middleware ရေးဖို့ဆို — `(set, get, api)` သုံးခုလုံးကို လက်ခံပြီး modified version
ကို ပြန်ပေးတဲ့ function ကို ရေးရပါတယ်။ အောက်မှာ state ပြောင်းတိုင်း console မှာ log
ထုတ်ပေးတဲ့ custom `log` middleware ပါ:

```js
// Log every time state is changed
const log = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log('  applying', args)
      set(args)
      console.log('  new state', get())
    },
    get,
    api
  )
```

ဒီမှာ `log` က မူရင်း `set` ကို — log ထုတ် → update လုပ် → state အသစ် နောက်ထပ် log ထုတ် —
ဆိုတဲ့ အစီအစဉ်နဲ့ အစားထိုးလိုက်တာပါ။ Middleware တွေကို ထပ်ဆင့်ထုပ်လို့လည်း ရပါတယ် —
`create(devtools(persist(...)))` လိုမျိုး middleware function တွေနဲ့ store ကို ကိုယ်ကြိုက်သလို
compose လုပ်နိုင်ပါတယ်။

## Devtools Middleware

`devtools` middleware က Redux ကို သုံးစရာမလိုဘဲ [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
နဲ့ store ကို debug လုပ်ခွင့်ပေးပါတယ် — action တိုင်းနဲ့ state အပြောင်းအလဲတိုင်းကို DevTools
timeline မှာ မြင်နိုင်ပါတယ်။ `zustand/middleware` ကနေ `devtools` ကို သုံးဖို့
`@redux-devtools/extension` package ကို install လုပ်ထားဖို့ လိုပါတယ်။

```js
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type JungleStore = {
  bears: number
  addBear: () => void
  fishes: number
  addFish: () => void
}

const useJungleStore = create<JungleStore>()(
  devtools((set) => ({
    bears: 0,
    addBear: () => set((state) => ({ bears: state.bears + 1 }), undefined, 'jungle/addBear'),
    fishes: 0,
    addFish: () => set((state) => ({ fishes: state.fishes + 1 }), undefined, 'jungle/addFish'),
  })),
)
```

`set` ရဲ့ တတိယ argument မှာ action type name (ဥပမာ `'jungle/addBear'`) ပေးထားတာ သတိထားကြည့်ပါ —
ဒါက DevTools timeline မှာ action name တွေကို ရှင်းရှင်းလင်းလင်း မြင်ရအောင်ပါ။ Action name
မပေးဘူးဆိုရင် "anonymous" ဆိုပြီး label တက်မှာမို့ — နာမည်ပေးတာ အကောင်းဆုံးပါ။ ပြီးတော့
DevTools က default အားဖြင့် store တစ်ခုတည်းကိုပဲ ပြတာမို့ — store အများကြီး ရှိရင် store
selector နဲ့ ရွေးကြည့်ရပါမယ်။

## Devtools + Log Middleware ပေါင်းသုံးခြင်း

Middleware တွေက compose လုပ်လို့ရတာမို့ — အပေါ်က custom `log` နဲ့ `devtools` ကို တွဲပြီး
တစ်ပြိုင်နက် သုံးလို့ရပါတယ်:

```js
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// log middleware ကို devtools နဲ့ ပေါင်းစပ်ထားတဲ့ store
const useCountStore = create(
  devtools(
    log((set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
    }))
  )
)
```

ဒီလိုဆို DevTools မှာ state change တွေကို မြင်ရင်း, console log ကနေလည်း update တစ်ခုချင်းစီရဲ့
အသေးစိတ်ကို မြင်ရပါတယ် — debugging အတွက် အဆင်ပြေတဲ့ ပေါင်းစပ်မှုပါ။ Middleware တွေ
ထပ်ဆင့်ထုပ်တဲ့အခါ အပြင်ဆုံး middleware က အရင်ဆုံး အလုပ်လုပ်မှာကိုလည်း သတိထားပါ။

## နောက်တစ်ဆင့်တွေ

- [Persist Middleware](/docs/zustand/persist) — state ကို localStorage/sessionStorage မှာ သိမ်းပေးတဲ့ middleware
- [Immer Middleware](/docs/zustand/immer) — immutable update တွေကို ရိုးရှင်းအောင် လုပ်ပေးတဲ့ middleware
- [Zustand စတင်ခြင်း](/docs/zustand/getting-started) — store ဖန်တီးပုံ အခြေခံ
