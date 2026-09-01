---
title: "Testing"
description: "Store တွေကို React အပြင်မှာ test လုပ်ခြင်း၊ test ကြားမှာ state reset လုပ်ခြင်း၊ component တွေကို store နဲ့ testing လုပ်ခြင်း"
order: 8
source: "https://zustand.docs.pmnd.rs/guides/testing"
status: translated
updated: 2026-09-01
---

## Test Environment ပြင်ဆင်ခြင်း

Zustand store တွေက React နဲ့ သီးခြား လွတ်လပ်တာမို့ — test runner (Jest, Vitest စသဖြင့်) ကို
JavaScript/TypeScript syntax run ဖို့ configure လုပ်ရုံနဲ့ store ကို စ test လို့ရပါတယ်။ UI
component တွေကိုပါ test ချင်ရင်တော့ — JSDOM လို mock DOM environment လိုပါတယ်။ React
component တွေအတွက်တော့ [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro)
ကို သုံးဖို့ အကြံပြုထားပြီး — network request တွေကို mock ဖို့ဆို [Mock Service Worker (MSW)](https://mswjs.io/)
ကို သုံးလို့ရပါတယ်။

## Store ကို React အပြင်မှာ Testing လုပ်ခြင်း

Store တစ်ခုကို component မပါဘဲ တိုက်ရိုက် test လုပ်နိုင်ပါတယ် — `createStore` (vanilla) နဲ့
ဖန်တီးထားတဲ့ store ရဲ့ `getState()` ကို စစ်ဆေးပြီး, action ကို တိုက်ရိုက်ခေါ်ပြီး state
ပြောင်းလဲမှုကို assert လုပ်လို့ရပါတယ်:

```js
// shared/counter-store-creator.js
export const counterStoreCreator = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

```js
// counter-store.test.js
import { createStore } from 'zustand/vanilla'
import { counterStoreCreator } from './counter-store-creator'

describe('counter store', () => {
  test('starts with count 1', () => {
    const store = createStore(counterStoreCreator)

    expect(store.getState().count).toBe(1)
  })

  test('increments the count', () => {
    const store = createStore(counterStoreCreator)

    store.getState().inc()
    expect(store.getState().count).toBe(2)
  })
})
```

`counterStoreCreator` က store ရဲ့ state creator ဖြစ်လို့ — test တစ်ခုစီမှာ store အသစ် ဆောက်သုံးလို့ရပြီး
test တစ်ခုစီက တစ်ခုနဲ့တစ်ခု မသက်ရောက်အောင် ခွဲထားပါတယ်။ React component မပါဘဲ
store logic ကို အရင်စစ်နိုင်တာကြောင့် — bug က store ထဲလား, component ထဲလားဆိုတာ
ခွဲခြားရတာ ပိုလွယ်ပါတယ်။

## Test တွေကြားမှာ State ပြန်စခြင်း (Reset)

Store တစ်ခုတည်းကို test အများကြီးမှာ မျှဝေသုံးရင် — test တစ်ခုရဲ့ state က နောက် test ကို
သက်ရောက်မှု ရှိနိုင်ပါတယ်။ အဲဒါကြောင့် test တစ်ခုစီပြီးတိုင်း initial state ကို ပြန်လုပ်ပေးရပါတယ် —
`setState(initialState, true)` က merge မလုပ်ဘဲ state တစ်ခုလုံးကို အစားထိုး (replace) လုပ်ပေးပါတယ်:

```js
import { createStore } from 'zustand/vanilla'

const store = createStore((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

const initialState = store.getInitialState()

afterEach(() => {
  // state တစ်ခုလုံးကို initial state နဲ့ အစားထိုး — merge မဟုတ်ဘူး
  store.setState(initialState, true)
})
```

Test runner ထဲမှာ `zustand` ကို mock လုပ်ပြီး — app ထဲက store တွေအားလုံးရဲ့ reset function တွေကို
စုပြီး `afterEach` မှာ run လုပ်တဲ့ pattern လည်း အသုံးများပါတယ် (Jest ဆို `__mocks__/zustand.ts` ၊
Vitest ဆို `vi.mock('zustand')` နဲ့)။ ဒါဆိုရင် store တစ်ခုချင်းစီအတွက် reset code ထပ်ရေးစရာမလိုဘဲ
test အကြား state တွေ အလိုအလျောက် ပြန်စသွားပါတယ်။

## Component တွေကို Store နဲ့ Testing လုပ်ခြင်း

Component ထဲမှာ store သုံးထားရင် — RTL နဲ့ component ကို render လုပ်ပြီး UI ကနေတစ်ဆင့်
store ရဲ့ အပြုအမူကို စစ်လို့ရပါတယ်:

```jsx
// counter.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './counter'

describe('Counter', () => {
  test('should render with initial state of 1', async () => {
    render(<Counter />)

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /one up/i })).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    render(<Counter />)

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(await screen.findByText(/^2$/)).toBeInTheDocument()
  })
})
```

User က button နှိပ်တာကို အတုယူပြီး — UI ကနေတစ်ဆင့် state ပြောင်းလဲမှု (`1` → `2`) ကို စစ်ဆေးပါတယ်။
ဒီလိုမျိုး component ကနေတစ်ဆင့် test လုပ်တာက — user တကယ်သုံးတဲ့ပုံစံနဲ့ အနီးစပ်ဆုံးဖြစ်လို့
test တွေက ယုံကြည်စိတ်ချရမှု ပိုများပါတယ် (Testing Library ရဲ့ အဓိက ခံယူချက်ကလည်း — "test တွေက
software သုံးတဲ့ပုံစံနဲ့ ဘယ်လောက် ဆင်လေလေ, ယုံကြည်စိတ်ချရမှု ပိုရလေလေ" ဆိုတာပါ)။

## နောက်တစ်ဆင့်တွေ

- [Zustand စတင်ခြင်း](/docs/zustand/getting-started) — store ဖန်တီးပုံ အခြေခံ
- [Persist Middleware](/docs/zustand/persist) — persist လုပ်ထားတဲ့ store တွေ test လုပ်တဲ့အခါ hydration ကို သတိထားပါ
- [Middleware သုံးခြင်း](/docs/zustand/middleware) — middleware တွေ ဘယ်လို အလုပ်လုပ်သလဲ
